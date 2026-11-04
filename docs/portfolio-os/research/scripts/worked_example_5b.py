"""Document 5b (v0.2) -- Section 4.9 worked example on SYNTHETIC data.

Three assets: NGN equity index proxy (NGX-like, thinly traded), USD equity proxy, FGN bond proxy (NGN).
Base currency USD. The FX path includes a one-day devaluation jump at day 630.

Reproducibility contract (V-015, R05b B4):
  * Dependencies: Python standard library + numpy + pandas ONLY (pinned in requirements.txt).
    scipy is never imported. There is no optional code path, so the output is identical under
    `python3 -I` and a normal interpreter. If numpy or pandas is missing the script stops.
  * Every random stream has its own named seed (SEEDS below).
  * The last line prints the SHA-256 of everything printed before it. A golden test compares that
    hash; a different numpy/pandas version that changes any digit changes the hash.
  * The minimum-variance solver is an exact active-set enumeration for N <= 10 (no iterative fallback),
    and every solution is checked against the KKT conditions.

Goal engine (section 4) follows CANONICAL_CONTRACTS.md C6: joint date-vector stationary bootstrap of
[NGN equity local, USD equity, FGN bond local, dlog USDNGN], demeaned, break day removed and overlaid as
a compensated jump at a stated frequency, drift from a labelled synthetic assumption set with drift
uncertainty integrated, 10,000 paths, Politis-White block length with the Patton-Politis-White (2009)
correction.

Run: python3 -I worked_example_5b.py
"""
import sys, hashlib, io
try:
    import numpy as np
    import pandas as pd
except ImportError as exc:  # fail loudly: no silent fallback of any kind
    sys.exit(f"FATAL: worked_example_5b.py needs numpy and pandas (see requirements.txt): {exc}")

_buf = io.StringIO()
def out(*a, **k):
    print(*a, **k)
    print(*a, **k, file=_buf)

SEEDS = {"dgp": 5, "goal": 20261104, "calib": 7}
print(f"interpreter isolated mode (-I): {bool(sys.flags.isolated)} (not part of the hashed output)")
out(f"environment: python {sys.version.split()[0]} | numpy {np.__version__} | pandas {pd.__version__} | seeds {SEEDS}")

rng = np.random.default_rng(SEEDS["dgp"])
T = 1260   # 5 years of trading days
dt = 1/252
BREAK = 630

# ---------- 1. Synthetic data-generating process (all parameters are ASSUMPTIONS, not estimates) ----------
mu_loc  = np.array([0.22, 0.08, 0.17])        # annual drift in LOCAL currency (NGN nominal rates high)
vol_loc = np.array([0.20, 0.16, 0.05])
corr    = np.array([[1.0, 0.15, 0.10],[0.15, 1.0, 0.00],[0.10, 0.00, 1.0]])
Lc = np.linalg.cholesky(corr)
z = rng.standard_t(5, size=(T,3)) / np.sqrt(5/3)   # variance-scaled t5 innovations
true_loc = (mu_loc - 0.5*vol_loc**2)*dt + (z @ Lc.T)*vol_loc*np.sqrt(dt)
obs = true_loc.copy(); carry = 0.0
stale = rng.random(T) < 0.35                      # NGN equity: stale price on 35% of days, recovered later
for t in range(T):
    if stale[t]: carry += true_loc[t,0]; obs[t,0] = 0.0
    else:        obs[t,0] = true_loc[t,0] + carry; carry = 0.0
# FX: log USDNGN (NGN per USD). Crawl 12%/yr, CONSTANT vol 6% for the whole sample, one-day +45% jump at day 630
fx = 0.12*dt + 0.06*np.sqrt(dt)*rng.standard_normal(T); fx[BREAK] += np.log(1.45)
usd = obs.copy(); usd[:,0] -= fx; usd[:,2] -= fx  # r_usd = r_ngn - dlog(USDNGN)
names = ["NGN_equity","USD_equity","FGN_bond"]
R = pd.DataFrame(usd, columns=names)              # daily log returns in USD
Rngn = pd.DataFrame(obs, columns=names); Rngn["USD_equity"] = obs[:,1] + fx
w_ew = np.ones(3)/3
ew = np.log(np.exp(R.values) @ w_ew)              # TRUE daily-rebalanced equal-weight log return (R05b m5)
ew_old = R.values.mean(1)                         # v0.1 approximation (mean of log returns), kept only for comparison

out("\n=== 1. Annualised statistics (USD base, full 5y sample) ===")
stats = pd.DataFrame({"ann_mean": R.mean()*252, "ann_vol": R.std()*np.sqrt(252),
                      "zero_days_local_ccy": (Rngn==0).mean()}).round(4)
out(stats.to_string())
out("\nSample correlation (USD base):\n" + R.corr().round(3).to_string())
out(f"Equal-weight log return on the break day: rebalanced {ew[BREAK]:+.4f} vs v0.1 mean-of-logs {ew_old[BREAK]:+.4f}")

# ---------- 1b. Correlation around the break, with and without the break day (R05b B1) ----------
def c02(X): return float(np.corrcoef(X[:,0], X[:,2])[0,1])
U = R.values; Lv = Rngn.values
pre, post_in, post_ex = U[:BREAK], U[BREAK:], U[BREAK+1:]
out("\n=== 1b. NGN_equity vs FGN_bond correlation around the devaluation ===")
out(f"USD base : pre {c02(pre):.3f} | post incl. break day {c02(post_in):.3f} | post excl. break day {c02(post_ex):.3f}")
out(f"NGN base : pre {c02(Lv[:BREAK]):.3f} | post incl. break day {c02(Lv[BREAK:]):.3f} | post excl. break day {c02(Lv[BREAK+1:]):.3f}")
loo = np.array([c02(np.delete(post_in, i, axis=0)) for i in range(len(post_in))])
i_max = int(np.argmax(np.abs(loo - c02(post_in))))
out(f"Leave-one-out on the post window ({len(post_in)} days): largest single-day influence {loo[i_max]-c02(post_in):+.3f} "
    f"(day {BREAK+i_max}); median |influence| {np.median(np.abs(loo-c02(post_in))):.4f}")
fx_vol_pre, fx_vol_post = fx[:BREAK].std()*np.sqrt(252), np.delete(fx[BREAK:], 0).std()*np.sqrt(252)
out(f"FX innovation vol (generator constant 6%): pre {fx_vol_pre:.3f}, post excl. break {fx_vol_post:.3f} -> no regime change; "
    "the 'post' jump is one observation")

# ---------- 2. Covariance estimators ----------
def lw_identity(X):
    """Ledoit & Wolf (2004, JMVA) shrinkage toward scaled identity; matches sklearn.covariance.ledoit_wolf (R05b M9)."""
    Xc = X - X.mean(0); T_, N = Xc.shape
    S = Xc.T @ Xc / T_
    mu = np.trace(S)/N; F = mu*np.eye(N)
    d2 = ((S-F)**2).sum()
    b2 = sum(((np.outer(x,x) - S)**2).sum() for x in Xc)/T_**2
    b2 = min(b2, d2); delta = b2/d2 if d2 > 0 else 0.0
    return (1-delta)*S + delta*F, delta
def lw_constcorr(X):
    """Ledoit & Wolf (2004, JPM) shrinkage toward constant correlation (not checked against a reference implementation)."""
    Xc = X - X.mean(0); T_, N = Xc.shape
    S = Xc.T @ Xc / T_; s = np.sqrt(np.diag(S)); C = S/np.outer(s,s)
    rbar = (C.sum()-N)/(N*(N-1)); F = rbar*np.outer(s,s); np.fill_diagonal(F, np.diag(S))
    Y = Xc**2; pi_mat = (Y.T @ Y)/T_ - S**2; pi = pi_mat.sum()
    term1 = ((Xc**3).T @ Xc)/T_; help_ = Xc.T @ Xc/T_; help_diag = np.diag(help_)
    term2 = help_diag[:,None]*S; term3 = help_*np.diag(S)[:,None]; term4 = np.diag(S)[:,None]*S
    theta = term1 - term2 - term3 + term4
    rho = np.trace(pi_mat) + rbar*((1/s)[:,None]*s[None,:]*theta).sum() - rbar*np.trace(theta)
    gamma = ((F-S)**2).sum()
    kappa = (pi - rho)/gamma if gamma > 0 else 0.0
    delta = float(np.clip(kappa/T_, 0, 1))
    return (1-delta)*S + delta*F, delta

def minvar_longonly(S, tol=1e-12):
    """Exact long-only minimum variance: min w'Sw s.t. sum w = 1, w >= 0, by enumerating active sets (N <= 10).
    For each support set A: w_A = S_AA^{-1} 1 / (1' S_AA^{-1} 1). The optimum is the feasible candidate satisfying KKT:
    (S w)_i = nu for i in A and (S w)_j >= nu for j not in A, with nu = w'Sw. Raises if no candidate passes."""
    N = S.shape[0]
    if N > 10: raise ValueError("active-set enumeration limited to N <= 10")
    best = None
    for mask in range(1, 2**N):
        A = [i for i in range(N) if mask >> i & 1]
        try: x = np.linalg.solve(S[np.ix_(A,A)], np.ones(len(A)))
        except np.linalg.LinAlgError: continue
        if x.sum() <= 0: continue
        w = np.zeros(N); w[A] = x/x.sum()
        if w.min() < -tol: continue
        g = S @ w; nu = w @ S @ w
        if all(g[j] >= nu - 1e-10*abs(nu) for j in range(N)):
            if best is None or nu < best[1] - 1e-15: best = (np.clip(w, 0, None), nu)
    if best is None: raise RuntimeError("no KKT point found: covariance not positive definite?")
    return best[0]

X = R.values*252   # annualised units (scale does not change weights)
S_s = np.cov(X.T, ddof=0); S_i, d_i = lw_identity(X); S_c, d_c = lw_constcorr(X)
mask = np.ones(T, bool); mask[BREAK] = False
_, d_i_x = lw_identity(X[mask]); _, d_c_x = lw_constcorr(X[mask])
out("\n=== 2. Ledoit-Wolf intensities ===")
out(f"Full 1,260-day sample: identity delta={d_i:.3f}, constant-correlation delta={d_c:.3f}")
out(f"Full sample EXCLUDING the break day (1,259 days): identity delta={d_i_x:.3f}, constant-correlation delta={d_c_x:.3f}")
di_w, dc_w = [], []
for start in range(0, T-250+1, 21):
    if start <= BREAK < start+250: continue
    Xw = X[start:start+250]; di_w.append(lw_identity(Xw)[1]); dc_w.append(lw_constcorr(Xw)[1])
out(f"Break-free 250-day windows (n={len(di_w)}, step 21d): identity delta {min(di_w):.2f}-{max(di_w):.2f}; "
    f"constant-correlation delta {min(dc_w):.2f}-{max(dc_w):.2f}")
out("-> Intensity at the cap also occurs with NO break (constant-correlation target close to S); intensity is not a break detector.")

out("\n=== 2a. Minimum-variance long-only weights, full sample (USD base; exact active-set solver) ===")
cols = {"sample": S_s, f"LW_identity(d={d_i:.2f})": S_i, f"LW_constcorr(d={d_c:.2f})": S_c}
W = pd.DataFrame({k: minvar_longonly(v) for k, v in cols.items()} | {"1/N": w_ew}, index=names)
out(W.round(3).to_string())
out("portfolio variance at optimum: " + " | ".join(f"{k} {minvar_longonly(v) @ v @ minvar_longonly(v):.3f}" for k, v in cols.items()))

out("\n=== 2b. Weight instability: rolling 250-day windows (step 21d) ===")
rows = []
for start in range(0, T-250, 21):
    Xw = X[start:start+250]
    rows.append(np.r_[minvar_longonly(np.cov(Xw.T, ddof=0)), minvar_longonly(lw_identity(Xw)[0]), minvar_longonly(lw_constcorr(Xw)[0])])
rows = np.array(rows)
sens = pd.DataFrame({"sample_mean": rows[:,:3].mean(0), "sample_sd": rows[:,:3].std(0),
                     "LWid_mean": rows[:,3:6].mean(0), "LWid_sd": rows[:,3:6].std(0),
                     "LWcc_mean": rows[:,6:].mean(0), "LWcc_sd": rows[:,6:].std(0)}, index=names)
out(sens.round(3).to_string())
out("Mean absolute weight change between consecutive windows: sample %.3f | LW-identity %.3f | LW-constcorr %.3f" %
    tuple(np.abs(np.diff(rows[:,i:i+3],axis=0)).sum(1).mean() for i in (0,3,6)))
out("\n=== 2c. Short-history case: 60-day windows ===")
rows60 = []
for start in range(0, T-60, 21):
    Xw = X[start:start+60]
    rows60.append(np.r_[minvar_longonly(np.cov(Xw.T, ddof=0)), minvar_longonly(lw_identity(Xw)[0])])
rows60 = np.array(rows60)
out(pd.DataFrame({"sample_sd": rows60[:,:3].std(0), "LWid_sd": rows60[:,3:].std(0)}, index=names).round(3).to_string())

# ---------- 3. Drawdown table ----------
def dd_stats(logr):
    w = np.exp(np.cumsum(logr)); peak = np.maximum.accumulate(w); dd = w/peak - 1
    t = int(np.argmin(dd)); p = int(np.argmax(w[:t+1])) if t > 0 else 0
    rec = next((i for i in range(t, len(w)) if w[i] >= peak[t]), None)
    return {"max_dd": dd.min(), "peak_day": p, "trough_day": t, "days_peak_to_trough": t-p,
            "days_to_recover": (rec - t) if rec is not None else np.nan, "ann_return": logr.mean()*252, "ann_vol": logr.std()*np.sqrt(252)}
out("\n=== 3. Drawdown table (daily, 5y synthetic; EW = true daily-rebalanced) ===")
tab = pd.DataFrame({n: dd_stats(R[n].values) for n in names} | {"EW_USD": dd_stats(ew), "NGN_equity_in_NGN": dd_stats(Rngn["NGN_equity"].values)}).T
out(tab.round(3).to_string())

# ---------- 4. Goal engine per Contract C6 ----------
def Phi(x):
    from math import erf, sqrt
    return 0.5*(1+erf(x/sqrt(2)))
V0, GOAL, H = 100_000.0, 150_000.0, 1260
g_log = np.log(GOAL/V0)
out("\n=== 4. Goal: USD 100,000 -> USD 150,000 in 5 years, equal-weight daily-rebalanced USD portfolio ===")
out(f"required_return: nominal {(GOAL/V0)**(1/5)-1:.2%}/yr")

# 4a. Why v0.1's band was method-driven (R05b B3): historical centring and the analytic second-order band
m_hist, s_hist = ew.mean()*252, ew.std()*np.sqrt(252); Hy, Ty = H/252, T/252
c = (Hy*m_hist - g_log)/(s_hist*np.sqrt(Hy))
out(f"[v0.1 method, for comparison] historical mean of EW = {m_hist:.3f}/yr (log), vol {s_hist:.3f}: conditional P {Phi(c):.1%}; "
    f"analytic 10-90 band of P given H/T={Hy/Ty:.2f}: {Phi(c-1.2816*np.sqrt(Hy/Ty)):.1%}-{Phi(c+1.2816*np.sqrt(Hy/Ty)):.1%} "
    f"(fixed by H/T, not by data); predictive Phi(c/sqrt(1+H/T)) = {Phi(c/np.sqrt(1+Hy/Ty)):.1%}")

# 4b. Joint date-vectors, break day removed, demeaned
J = np.column_stack([obs[:,0], obs[:,1], obs[:,2], fx])          # local NGN eq, USD eq, local bond, dlog USDNGN
jump_vec = J[BREAK].copy()
Jx = np.delete(J, BREAK, axis=0); Jd = Jx - Jx.mean(0)
out(f"joint sample: {Jd.shape[0]} date-vectors x 4 columns (break day {BREAK} removed and held as the jump vector "
    f"[{', '.join(f'{v:+.3f}' for v in jump_vec)}])")

# 4c. Politis-White automatic block length, stationary bootstrap, with the Patton-Politis-White (2009) correction
def pw_block_sb(x, c_thr=2.0):
    """Stationary-bootstrap block length (Politis & White 2004) with the corrected constant D_SB = 2 g(0)^2
    (Patton, Politis & White 2009). Tuning (K_N, m_max, b_max, first window of K_N insignificant
    autocorrelations starting at lag >= 1, M = 2 max(m_hat, 1)) follows Patton's reference code as
    implemented in arch.bootstrap.optimal_block_length; golden-tested against arch 8.0.0 (see README)."""
    x = np.asarray(x, float); n = len(x); e = x - x.mean()
    bmax = np.ceil(min(3*np.sqrt(n), n/3)); kn = max(5, int(np.log10(n))); mmax = int(np.ceil(np.sqrt(n))) + kn
    cv = c_thr*np.sqrt(np.log10(n)/n); acv = np.zeros(mmax+1); ac = np.zeros(mmax+1); m_hat = None
    for i in range(mmax+1):
        v1 = e[i+1:] @ e[i+1:]; v2 = e[:-(i+1)] @ e[:-(i+1)]; cp = e[i:] @ e[:n-i]
        acv[i] = cp/n; ac[i] = abs(cp)/np.sqrt(v1*v2)
        if i >= kn and m_hat is None and np.all(ac[i-kn:i] < cv): m_hat = i - kn
    M = min(2*max(m_hat, 1) if m_hat is not None else mmax, mmax)
    G = 0.0; g0 = acv[0]
    for k in range(1, M+1):
        lam = 1.0 if k/M <= 0.5 else 2*(1-k/M)
        G += 2*lam*k*acv[k]; g0 += 2*lam*acv[k]
    D_SB = 2*g0**2
    b = (2*G**2/D_SB)**(1/3) * n**(1/3)
    return float(min(b, bmax)), m_hat
# golden self-test against arch 8.0.0 optimal_block_length (values computed once outside this script; arch is NOT a dependency)
_r = np.random.default_rng(1); _e = _r.standard_normal(3000); _ar = np.zeros(3000)
for _t in range(1, 3000): _ar[_t] = 0.6*_ar[_t-1] + _e[_t]
_ma = np.convolve(np.random.default_rng(2).standard_normal(1300), [1, 0.8, 0.5], "valid")
for _x, _ref in ((_ar, 19.49273630551638), (_ma, 7.87014343999439)):
    if abs(pw_block_sb(_x)[0] - _ref) > 1e-9: sys.exit(f"FATAL: Politis-White block length {pw_block_sb(_x)[0]!r} != arch reference {_ref!r}")
out("Politis-White implementation matches the arch 8.0.0 reference on two golden series (AR(1) 0.6: 19.4927; MA(2): 7.8701)")
bl = {}
for j, nm in enumerate(["NGN_eq_loc","USD_eq","bond_loc","dlogFX"]):
    bl[nm] = (pw_block_sb(Jd[:,j])[0], pw_block_sb(Jd[:,j]**2)[0])
B_MIN, B_MAX = 5, 60
block = float(np.clip(max(max(v) for v in bl.values()), B_MIN, B_MAX))
out("Politis-White (PPW 2009) stationary-bootstrap block length, levels / squares: " +
    "; ".join(f"{k} {a:.1f}/{b:.1f}" for k, (a, b) in bl.items()) + f" -> rule max, clipped to [{B_MIN},{B_MAX}] = {block:.1f} days")
h1, h2 = Jd[:len(Jd)//2], Jd[len(Jd)//2:]
out("stationarity check (demeaned vol, first vs second half, ann.): " +
    "; ".join(f"{k} {h1[:,j].std()*np.sqrt(252):.3f}/{h2[:,j].std()*np.sqrt(252):.3f}" for j, k in enumerate(bl)))

# 4d. Assumption set (SYNTHETIC placeholders; NOT J.P. Morgan or any published CMA figures)
ASM = {"id": "ASM-SYN-01", "source": "synthetic placeholder for Doc 5b worked example", "as_of": "2026-11-04",
       "drift_log_local": {"NGN_eq_loc": (0.18, 0.06), "USD_eq": (0.06, 0.02), "bond_loc": (0.16, 0.02)},
       "fx_dlog_usdngn": (0.12, 0.06),           # expected NGN depreciation (log, per year), INCLUDING devaluation jumps
       "usd_inflation": 0.025,
       "jump": {"rate_per_year": 0.10, "vector": "break-day vector", "compensated": True},
       "drift_draws": "independent normal per asset and FX, one draw per path"}
out(f"assumption_set {ASM['id']} ({ASM['source']}, as of {ASM['as_of']}): " +
    ", ".join(f"{k} {m:.2f}+/-{s:.2f}" for k, (m, s) in ASM['drift_log_local'].items()) +
    f", FX {ASM['fx_dlog_usdngn'][0]:.2f}+/-{ASM['fx_dlog_usdngn'][1]:.2f}, USD CPI {ASM['usd_inflation']:.3f}, "
    f"jump rate {ASM['jump']['rate_per_year']}/yr compensated")

def simulate(n_paths, horizon, drift_mode, rng_):
    """Returns log wealth (V0 = 1) at each 21-day checkpoint, shape (n_paths, horizon//21 + 1)."""
    m_loc = np.array([ASM["drift_log_local"][k][0] for k in ("NGN_eq_loc","USD_eq","bond_loc")])
    s_loc = np.array([ASM["drift_log_local"][k][1] for k in ("NGN_eq_loc","USD_eq","bond_loc")])
    m_fx, s_fx = ASM["fx_dlog_usdngn"]
    mu_d = rng_.normal(m_loc, s_loc, size=(n_paths, 3)); mu_fx = rng_.normal(m_fx, s_fx, size=n_paths)
    if drift_mode == "zero_real":   # neutral case: every asset's USD log drift = USD inflation, same drift sd
        pi_l = np.log(1+ASM["usd_inflation"])
        mu_d = pi_l + rng_.normal(0, s_loc, size=(n_paths,3)); mu_fx = rng_.normal(0, s_fx, size=n_paths)
        mu_d[:,[0,2]] += mu_fx[:,None]  # so that local - fx = pi_l (+ noise)
    lam = ASM["jump"]["rate_per_year"]
    comp_loc = lam*jump_vec[:3]; comp_fx = lam*jump_vec[3]   # compensation keeps the expected log return = assumption
    n_ = len(Jd); p = 1/block
    idx = rng_.integers(0, n_, n_paths); logW = np.zeros(n_paths)
    ck = np.zeros((n_paths, horizon//21 + 1))
    for h in range(horizon):
        x = Jd[idx]
        jump = rng_.random(n_paths) < lam*dt
        fxr = x[:,3] + (mu_fx - comp_fx)*dt + jump*jump_vec[3]
        loc = x[:,:3] + (mu_d - comp_loc)*dt + jump[:,None]*jump_vec[:3]
        r_usd = loc.copy(); r_usd[:,0] -= fxr; r_usd[:,2] -= fxr
        logW += np.log(np.exp(r_usd) @ w_ew)
        if (h+1) % 21 == 0: ck[:, (h+1)//21] = logW
        new = rng_.random(n_paths) < p
        idx = np.where(new, rng_.integers(0, n_, n_paths), (idx+1) % n_)
    return ck

N_PATHS, EXT = 10_000, 1260   # simulate 10 years so that the 'delay' adjustment can be read off the same paths
rg = np.random.default_rng(SEEDS["goal"])
ck = simulate(N_PATHS, H+EXT, "cma", rg)
L_H = ck[:, H//21]
qs = [0.05,0.10,0.25,0.50,0.75,0.90,0.95]
infl_H = (1+ASM["usd_inflation"])**(H/252)
def report(L_end, label):
    p = float((L_end >= g_log).mean()); k = int(round(100*p)); se = 100*np.sqrt(p*(1-p)/len(L_end))
    out(f"{label}: success_count {k} of 100 (MC SE {se:.2f} pts) -> display 'about {int(5*round(k/5))} of 100'")
    return p
p_c = report(L_H, "CMA overlay (ASM-SYN-01)")
TV = V0*np.exp(np.quantile(L_H, qs))
out("   quantiles nominal USD: " + ", ".join(f"q{int(q*100):02d} {v:,.0f}" for q, v in zip(qs, TV)))
out("   quantiles real USD (2026 dollars): " + ", ".join(f"q{int(q*100):02d} {v/infl_H:,.0f}" for q, v in zip(qs, TV)))
q10G = np.exp(np.quantile(L_H, 0.10))
out(f"   adjustment (q10 future reaches the goal): lump sum today USD {GOAL/q10G - V0:,.0f}")
G_to_H = np.exp(L_H[:,None] - ck[:, 1:H//21])                    # growth from month m (m=1..59) to H
def q10_with_contrib(c_): return np.quantile(V0*np.exp(L_H) + c_*G_to_H.sum(1), 0.10)
lo_, hi_ = 0.0, 20_000.0
for _ in range(60):
    mid = (lo_+hi_)/2; lo_, hi_ = (mid, hi_) if q10_with_contrib(mid) < GOAL else (lo_, mid)
out(f"   adjustment: extra monthly contribution (start of months 2-60) USD {hi_:,.0f}")
delay = next((m for m in range(0, EXT//21+1) if np.quantile(ck[:, H//21+m], 0.10) >= g_log), None)
out(f"   adjustment: delay {'> 60' if delay is None else delay} months (H/T rises to {(H+21*(delay or 60))/T:.2f})")
out("   drift_sensitivity (common random numbers; all asset drifts shifted): " +
    "; ".join(f"{s:+.0%} -> {int(round(100*(L_H + s*H/252 >= g_log).mean()))} of 100" for s in (-0.02, 0.0, 0.02)))
w_m = np.array([ASM["drift_log_local"][k][1] for k in ("NGN_eq_loc","USD_eq","bond_loc")])
port_sd = np.sqrt((w_ew[0]**2)*(w_m[0]**2+ASM["fx_dlog_usdngn"][1]**2) + (w_ew[1]**2)*w_m[1]**2 +
                  (w_ew[2]**2)*(w_m[2]**2+ASM["fx_dlog_usdngn"][1]**2) + 2*w_ew[0]*w_ew[2]*ASM["fx_dlog_usdngn"][1]**2)
out(f"   width_reason: H/T = {H/T:.2f}; portfolio drift sd ~ {port_sd:.3f}/yr (from the assumption ranges); "
    f"simulated sd of 5y log wealth {L_H.std():.3f}")
hb = sum(1 for s in range(0, T-H+1, H) if ew[s:s+H].sum() >= g_log); hm = len(range(0, T-H+1, H))
out(f"   history_base_rate: {hb} of {hm} non-overlapping 5-year windows (history, not a forecast)")
out(f"   calibration_status: uncalibrated | refusal: none (60 months of history per asset >= 36; H/T={H/T:.2f} <= 4; "
    "inputs synthetic, so C3 eligibility is not tested here)")
rg2 = np.random.default_rng(SEEDS["goal"])
ck0 = simulate(N_PATHS, H, "zero_real", rg2)
report(ck0[:, H//21], "Neutral case 'zero real return'")
# analytic cross-check of the simulated mean 5y log wealth (CMA case): drift + rebalancing (diversification) term + jump convexity
m_usd = np.array([0.18-0.12, 0.06, 0.16-0.12]); Sd = np.cov(np.column_stack([Jd[:,0]-Jd[:,3], Jd[:,1], Jd[:,2]-Jd[:,3]]).T)*252
J_usd = np.array([jump_vec[0]-jump_vec[3], jump_vec[1], jump_vec[2]-jump_vec[3]])
an = 5*(w_ew@m_usd + 0.5*(w_ew@np.diag(Sd) - w_ew@Sd@w_ew)) + ASM["jump"]["rate_per_year"]*5*(np.log(w_ew@np.exp(J_usd)) - w_ew@J_usd)
out(f"   analytic check (CMA case): mean 5y log wealth simulated {L_H.mean():.3f} vs analytic {an:.3f} "
    "(drift + rebalancing term + jump convexity; drift-draw convexity ignored)")

# ---------- 5. Diagnostics: with-break and break-excluded covariance ----------
out("\n=== 5. Diagnostics for the equal-weight USD portfolio ===")
for lab, Ru in (("all days", R.values), ("break day excluded", np.delete(R.values, BREAK, axis=0))):
    S = np.cov(Ru.T)*252; sig = np.sqrt(np.diag(S))
    dr = (w_ew@sig)/np.sqrt(w_ew@S@w_ew)
    ev, evec = np.linalg.eigh(S); pv = (evec.T@w_ew)**2*ev; pp = pv/pv.sum(); enb = np.exp(-(pp*np.log(pp+1e-300)).sum())
    rc = w_ew*(S@w_ew)/(w_ew@S@w_ew)
    out(f"{lab:>19}: vol {np.sqrt(w_ew@S@w_ew):.3f}; DR {dr:.3f}; ENB(PCA entropy) {enb:.2f}; risk contributions " +
        ", ".join(f"{n} {v:.3f}" for n, v in zip(names, rc)))
out(f"HHI = {(w_ew**2).sum():.3f} (1/HHI = {1/(w_ew**2).sum():.2f}); currency exposure NGN {100*(w_ew[0]+w_ew[2]):.0f}%, USD {100*w_ew[1]:.0f}%")
hist_var = -np.quantile(ew, 0.01); hist_var_x = -np.quantile(np.delete(ew, BREAK), 0.01)
out(f"1-day historical 99% VaR of EW: all days {hist_var:.4f}; break excluded {hist_var_x:.4f}; worst day {ew.min():+.4f} (the break day)")

# ---------- 5b. Reverse stress test (R05b M7) ----------
out("\n=== 5b. Reverse stress: USD 100,000 equal-weight, floor = loss of 25% over 1 month ===")
Fall = np.column_stack([obs[:,0], obs[:,1], obs[:,2], fx])        # factors: NGN eq local, USD eq, bond local, dlogFX
Sig = np.cov(Fall.T)*21                                           # 1-month covariance, break day INCLUDED (stressed)
v = V0*w_ew; floor = 0.75*V0
def value(x):  # x = factor log moves; NGN assets lose the FX move in USD terms
    return v[0]*np.exp(x[0]-x[3]) + v[1]*np.exp(x[1]) + v[2]*np.exp(x[2]-x[3])
def grad(x):
    a, b, c_ = v[0]*np.exp(x[0]-x[3]), v[1]*np.exp(x[1]), v[2]*np.exp(x[2]-x[3])
    return np.array([a, b, c_, -(a+c_)])
fac = ["NGN_eq_loc","USD_eq","bond_loc","dlogFX"]
def one_factor(k, conditional):
    lo_, hi_ = 0.0, 3.0
    sgn = 1.0 if k == 3 else -1.0                                   # FX up (naira weaker) or asset down
    for _ in range(200):
        mid = (lo_+hi_)/2; x = np.zeros(4); x[k] = sgn*mid
        if conditional: x = Sig[:, k]/Sig[k, k]*x[k]                # others at conditional expectation (Breuer et al. 2009)
        lo_, hi_ = (mid, hi_) if value(x) > floor else (lo_, mid)
    x = np.zeros(4); x[k] = sgn*hi_
    if conditional: x = Sig[:, k]/Sig[k, k]*x[k]
    return x
Si = np.linalg.inv(Sig)
for k in (3, 0):
    for cond in (False, True):
        x = one_factor(k, cond); d = np.sqrt(x@Si@x)
        out(f"  single factor {fac[k]:<10} {'others at cond. mean' if cond else 'others flat         '}: "
            f"move {np.expm1(x[k]):+.1%} ({'naira per dollar' if k == 3 else 'local price'}); Mahalanobis {d:.2f}")
# most plausible joint scenario: min x' Sig^-1 x  s.t. value(x) = floor. The feasible set {value <= floor} is convex,
# so the minimiser is unique. Newton on the KKT system, started from the linear (delta) solution.
g0 = grad(np.zeros(4)); mu_l = (V0-floor)/(g0@Sig@g0); x = -mu_l*(Sig@g0)
for it in range(100):
    gV = grad(x); Hc = np.diag([gV[0], gV[1], gV[2], gV[0]+gV[2]]); Hc[0,3] = Hc[3,0] = -gV[0]; Hc[2,3] = Hc[3,2] = -gV[2]
    KKT = np.block([[Si + mu_l*Hc, gV[:,None]], [gV[None,:], np.zeros((1,1))]])
    rhs = -np.r_[Si@x + mu_l*gV, value(x)-floor]
    step = np.linalg.solve(KKT, rhs); x = x + step[:4]; mu_l += step[4]
    if np.abs(step[:4]).max() < 1e-13: break
else:
    raise RuntimeError("reverse-stress Newton did not converge")
d_star = np.sqrt(x@Si@x)
out(f"  most plausible joint scenario (Mahalanobis-minimal, an OPTIMISATION output): " +
    ", ".join(f"{fac[i]} {np.expm1(x[i]):+.1%}" for i in range(4)) + f"; distance {d_star:.2f}; value {value(x):,.0f}; "
    f"Newton iterations {it+1}")
lin = (V0-floor)/np.sqrt(grad(np.zeros(4))@Sig@grad(np.zeros(4)))
out(f"  linear (delta) approximation of the distance: {lin:.2f}")

# ---------- 6. TWR vs Modified Dietz (illustration; the coding contract is doc05b_performance_golden.py) ----------
out("\n=== 6. TWR vs Modified Dietz, 63 trading days, deposit of 50% at the START of day index 10 (weight 53/63) ===")
r = R["USD_equity"].values[:63]; CF = 50_000.0; cf_day = 10
Vv = V0
for i, ri in enumerate(r):
    if i == cf_day: Vv += CF
    Vv *= np.exp(ri)
twr = np.exp(r.sum()) - 1
md = (Vv - V0 - CF)/(V0 + CF*(63-cf_day)/63)
lo_, hi_ = -0.05, 0.05
for _ in range(200):
    mid = (lo_+hi_)/2; npv = V0*(1+mid)**63 + CF*(1+mid)**(63-cf_day) - Vv
    lo_, hi_ = (mid, hi_) if npv < 0 else (lo_, mid)
out(f"TWR {twr:+.2%} | Modified Dietz {md:+.2%} | IRR (period, not annualised) {(1+mid)**63-1:+.2%} | end value {Vv:,.0f}")

# ---------- 7. Sharpe SE and calibration demo ----------
m = R["USD_equity"].values; sr_d = m.mean()/m.std(ddof=1); n = len(m); se = np.sqrt((1 + 0.5*sr_d**2)/n)
out("\n=== 7. Sharpe ratio with standard error (Lo 2002, iid) ===")
out(f"USD_equity annualised SR = {sr_d*np.sqrt(252):.2f} +/- {se*np.sqrt(252):.2f} (1 s.e.); 95% CI [{(sr_d-1.96*se)*np.sqrt(252):.2f}, {(sr_d+1.96*se)*np.sqrt(252):.2f}]")
out(f"SE of the 5y annualised mean of EW: {ew.std()*np.sqrt(252)/np.sqrt(5):.3f} (1 s.e.) -> 95% half-width {1.96*ew.std()*np.sqrt(252)/np.sqrt(5):.3f}")
def t5_cdf(t):   # closed form, Student t with 5 d.o.f.
    th = np.arctan(t/np.sqrt(5)); return 0.5 + (th + np.sin(th)*np.cos(th)*(1 + (2/3)*np.cos(th)**2))/np.pi
rc_ = np.random.default_rng(SEEDS["calib"])
tt = rc_.standard_t(5, 100_000)/np.sqrt(5/3)
from math import erf, sqrt
pit = np.array([0.5*(1+erf(v_/sqrt(2))) for v_ in tt[:20000]])
hist, _ = np.histogram(pit, bins=10, range=(0,1)); hist = hist/hist.sum()
out("\n=== 7b. Calibration: Gaussian forecast (right variance) applied to variance-scaled t5 outcomes ===")
out("PIT histogram (10 bins, flat = 0.10): " + " ".join(f"{h:.3f}" for h in hist))
for lab, zc in (("90%", 1.6449), ("98%", 2.3263), ("99%", 2.5758)):
    exact = 2*t5_cdf(zc*np.sqrt(5/3)) - 1
    out(f"nominal {lab} interval (+/-{zc}): covers {((tt > -zc) & (tt < zc)).mean():.1%} simulated, {exact:.2%} exact")

out("\nsha256 of the output above: " + hashlib.sha256(_buf.getvalue().encode()).hexdigest())
assert "scipy" not in sys.modules, "scipy was imported: the output would no longer be environment-independent"
