"""Document 5b — Section H worked example on SYNTHETIC data.
Three assets: NGN equity index proxy (NGX-like, thinly traded), USD equity proxy, FGN bond proxy (NGN).
Base currency USD. FX path includes a one-day devaluation jump. Reproducible seed. numpy/pandas only (+scipy if present).
Run: python3 worked_example_5b.py"""
import numpy as np, pandas as pd
rng = np.random.default_rng(5)
T = 1260  # 5 years of trading days
dt = 1/252

# ---------- 1. Synthetic data-generating process (all parameters are ASSUMPTIONS, not estimates) ----------
# True local-currency daily log-returns, correlated: [NGN equity, USD equity, FGN bond]
mu_loc  = np.array([0.22, 0.08, 0.17])        # annual drift in LOCAL currency (NGN nominal rates high)
vol_loc = np.array([0.20, 0.16, 0.05])
corr    = np.array([[1.0, 0.15, 0.10],[0.15, 1.0, 0.00],[0.10, 0.00, 1.0]])
L = np.linalg.cholesky(corr)
z = rng.standard_t(5, size=(T,3)) / np.sqrt(5/3)   # variance-scaled t5 innovations
true_loc = (mu_loc - 0.5*vol_loc**2)*dt + (z @ L.T)*vol_loc*np.sqrt(dt)
# Thin trading: NGN equity prints a zero return (stale price) on 35% of days; the missed move is recovered later
obs = true_loc.copy(); carry = 0.0
stale = rng.random(T) < 0.35
for t in range(T):
    if stale[t]: carry += true_loc[t,0]; obs[t,0] = 0.0
    else:        obs[t,0] = true_loc[t,0] + carry; carry = 0.0
# FX: log USDNGN (NGN per USD). Crawling depreciation 12%/yr, vol 6%, plus a one-day +45% jump (≈ -31% in USD value of NGN) at day 630
fx = 0.12*dt + 0.06*np.sqrt(dt)*rng.standard_normal(T); fx[630] += np.log(1.45)
# Convert NGN assets to USD: r_usd = r_ngn - d(log USDNGN)
usd = obs.copy(); usd[:,0] -= fx; usd[:,2] -= fx
names = ["NGN_equity","USD_equity","FGN_bond"]
R = pd.DataFrame(usd, columns=names)             # daily log returns in USD
Rngn = pd.DataFrame(obs, columns=names); Rngn["USD_equity"] = obs[:,1] + fx   # NGN-base view

print("=== 1. Annualised statistics (USD base, full 5y sample) ===")
stats = pd.DataFrame({"ann_mean": R.mean()*252, "ann_vol": R.std()*np.sqrt(252),
                      "zero_days_local_ccy": (Rngn==0).mean()}).round(4)
print(stats.to_string())
print("\nSample correlation (USD base):\n", R.corr().round(3).to_string())
pre, post = R.iloc[:630], R.iloc[630:]
print("\nCorrelation NGN_equity vs FGN_bond: pre-devaluation %.3f | post %.3f  (shared FX factor dominates in USD terms)" %
      (pre.corr().iloc[0,2], post.corr().iloc[0,2]))

# ---------- 2. Covariance estimators ----------
def lw_identity(X):
    """Ledoit & Wolf (2004, J. Multivariate Analysis) shrinkage toward scaled identity. X: T x N, demeaned inside."""
    Xc = X - X.mean(0); T_, N = Xc.shape
    S = Xc.T @ Xc / T_
    mu = np.trace(S)/N; F = mu*np.eye(N)
    d2 = ((S-F)**2).sum()
    b2 = sum(((np.outer(x,x) - S)**2).sum() for x in Xc)/T_**2
    b2 = min(b2, d2); delta = b2/d2 if d2 > 0 else 0.0
    return (1-delta)*S + delta*F, delta
def lw_constcorr(X):
    """Ledoit & Wolf (2004, J. Portfolio Management) shrinkage toward constant-correlation target."""
    Xc = X - X.mean(0); T_, N = Xc.shape
    S = Xc.T @ Xc / T_; s = np.sqrt(np.diag(S)); C = S/np.outer(s,s)
    rbar = (C.sum()-N)/(N*(N-1)); F = rbar*np.outer(s,s); np.fill_diagonal(F, np.diag(S))
    Y = Xc**2; pi_mat = (Y.T @ Y)/T_ - S**2; pi = pi_mat.sum()
    term1 = ((Xc**3).T @ Xc)/T_; help_ = Xc.T @ Xc/T_; help_diag = np.diag(help_)
    term2 = help_diag[:,None]*S; term3 = help_*np.diag(S)[:,None]; term4 = np.diag(S)[:,None]*S
    theta = term1 - term2 - term3 + term4
    rho = np.trace(pi_mat) + rbar*((1/s)[:,None]*s[None,:]*theta).sum() - rbar*np.trace(theta)  # standard formula
    gamma = ((F-S)**2).sum()
    kappa = (pi - rho)/gamma if gamma > 0 else 0.0
    delta = float(np.clip(kappa/T_, 0, 1))
    return (1-delta)*S + delta*F, delta
def minvar_longonly(S):
    N = S.shape[0]
    try:
        from scipy.optimize import minimize
        res = minimize(lambda w: w@S@w, np.ones(N)/N, bounds=[(0,1)]*N,
                       constraints=[{"type":"eq","fun":lambda w: w.sum()-1}], method="SLSQP")
        return res.x
    except ImportError:  # projected-gradient fallback
        w = np.ones(N)/N
        for _ in range(5000):
            w = w - 0.5*S@w/np.abs(S).max(); w = np.clip(w,0,None); w = w/w.sum()
        return w
X = R.values*252   # annualised units for readability (scale does not change weights)
S_s = np.cov(X.T, ddof=0); S_i, d_i = lw_identity(X); S_c, d_c = lw_constcorr(X)
print("\nLW shrinkage intensities on the full sample: identity-target delta=%.3f, constant-correlation delta=%.3f" % (d_i, d_c))
mask = np.ones(T, bool); mask[630] = False
_, d_i_x = lw_identity(X[mask]); _, d_c_x = lw_constcorr(X[mask])
print("Same, EXCLUDING the single devaluation day: identity delta=%.3f, constant-correlation delta=%.3f" % (d_i_x, d_c_x))
print("-> One structural-break day drives the estimated fourth moments and pushes the shrinkage intensity to its cap; the estimator then returns the target itself. Breaks must be handled explicitly (scenario or dummy), not fed to the estimator as if stationary.")
print("\n=== 2. Minimum-variance long-only weights, full sample (USD base) ===")
W = pd.DataFrame({"sample": minvar_longonly(S_s), "LW_identity(delta=%.2f)"%d_i: minvar_longonly(S_i),
                  "LW_constcorr(delta=%.2f)"%d_c: minvar_longonly(S_c), "1/N": np.ones(3)/3}, index=names)
print(W.round(3).to_string())

# Sensitivity: rolling 250-day windows and bootstrap resamples
print("\n=== 2b. Weight instability: rolling 250-day windows (step 21d) ===")
rows = []
for start in range(0, T-250, 21):
    Xw = X[start:start+250]
    rows.append(np.r_[minvar_longonly(np.cov(Xw.T, ddof=0)), minvar_longonly(lw_identity(Xw)[0]), minvar_longonly(lw_constcorr(Xw)[0])])
rows = np.array(rows)
sens = pd.DataFrame({"sample_mean": rows[:,:3].mean(0), "sample_sd": rows[:,:3].std(0),
                     "LWid_mean": rows[:,3:6].mean(0), "LWid_sd": rows[:,3:6].std(0),
                     "LWcc_mean": rows[:,6:].mean(0), "LWcc_sd": rows[:,6:].std(0)}, index=names)
print(sens.round(3).to_string())
print("Mean absolute weight change between consecutive windows (turnover proxy): sample %.3f | LW-identity %.3f | LW-constcorr %.3f" %
      tuple(np.abs(np.diff(rows[:,i:i+3],axis=0)).sum(1).mean() for i in (0,3,6)))
print("Small-N caveat: with N=3 and T=250 the sample covariance is already well conditioned, so shrinkage changes little; "
      "the instability that remains comes from the data (regime/devaluation), not from estimation noise alone.")
print("\n=== 2c. Short-history case: 60-day windows (what a new user actually has) ===")
rows60 = []
for start in range(0, T-60, 21):
    Xw = X[start:start+60]
    rows60.append(np.r_[minvar_longonly(np.cov(Xw.T, ddof=0)), minvar_longonly(lw_identity(Xw)[0])])
rows60 = np.array(rows60)
print(pd.DataFrame({"sample_sd": rows60[:,:3].std(0), "LWid_sd": rows60[:,3:].std(0)}, index=names).round(3).to_string())

# ---------- 3. Drawdown table ----------
def dd_stats(logr):
    w = np.exp(np.cumsum(logr)); peak = np.maximum.accumulate(w); dd = w/peak - 1
    t = int(np.argmin(dd)); p = int(np.argmax(w[:t+1])) if t > 0 else 0
    rec = next((i for i in range(t, len(w)) if w[i] >= peak[t]), None)
    return {"max_dd": dd.min(), "peak_day": p, "trough_day": t, "days_peak_to_trough": t-p,
            "days_to_recover": (rec - t) if rec is not None else np.nan, "ann_return": logr.mean()*252, "ann_vol": logr.std()*np.sqrt(252)}
print("\n=== 3. Drawdown table (daily, 5y synthetic) ===")
ew = R.mean(axis=1)  # equal-weight, rebalanced daily (approximation using log returns)
tab = pd.DataFrame({n: dd_stats(R[n].values) for n in names} | {"EW_USD": dd_stats(ew.values), "NGN_equity_in_NGN": dd_stats(Rngn["NGN_equity"].values)}).T
print(tab.round(3).to_string())
print("Note: the same NGN equity series shows a mild drawdown in NGN and a deep one in USD — base currency must be stated on every figure.")

# ---------- 4. Bootstrap goal probability with its own uncertainty band ----------
# Goal: USD 100,000 today -> USD 150,000 in 5 years (8.45% p.a.), portfolio = equal weight, no contributions.
def stationary_bootstrap(x, n_paths, horizon, mean_block, rng):
    T_ = len(x); p = 1/mean_block; out = np.empty((n_paths, horizon))
    idx = rng.integers(0, T_, n_paths)
    for h in range(horizon):
        out[:, h] = x[idx]
        new = rng.random(n_paths) < p
        idx = np.where(new, rng.integers(0, T_, n_paths), (idx+1) % T_)
    return out
goal_log = np.log(150_000/100_000); H = 1260
def p_success(sample, n_paths=4000, mean_block=20):
    paths = stationary_bootstrap(sample, n_paths, H, mean_block, rng)
    return (paths.sum(1) >= goal_log).mean()
base = ew.values
p_hat = p_success(base)
# Outer loop: resample the HISTORY itself (block bootstrap of the 5y sample) to express estimation uncertainty
outer = []
for b in range(40):
    hist_b = stationary_bootstrap(base, 1, T, 20, rng)[0]
    outer.append(p_success(hist_b, n_paths=2000))
outer = np.array(outer)
mc_se = np.sqrt(p_hat*(1-p_hat)/4000)
print("\n=== 4. Goal: $100,000 -> $150,000 in 5 years (needs 8.45%/yr), equal-weight USD portfolio ===")
print(f"Point estimate P(success) = {p_hat:.1%}  (Monte Carlo SE ±{mc_se:.1%} from 4,000 paths)")
print(f"Estimation-uncertainty band (resampling the 5y history, 40 reps): 10th-90th pct = {np.quantile(outer,0.1):.0%} – {np.quantile(outer,0.9):.0%}, min–max {outer.min():.0%}–{outer.max():.0%}")
# Sensitivity to the drift assumption (the quantity nobody can estimate from 5 years of data)
print("Sensitivity to assumed annual drift (shift the historical mean):")
for shift in (-0.04, -0.02, 0.0, 0.02):
    print(f"   drift shift {shift:+.0%}/yr -> P(success) = {p_success(base + shift*dt):.0%}")
se_mean = base.std()*np.sqrt(252)/np.sqrt(5)
print(f"Standard error of the 5y annualised mean return itself: ±{se_mean:.1%}/yr (vol {base.std()*np.sqrt(252):.1%}, 5 years) -> the drift is essentially unknown")

# ---------- 5. Concentration / diversification diagnostics ----------
w = np.ones(3)/3; S = np.cov(R.values.T)*252; sig = np.sqrt(np.diag(S))
hhi = (w**2).sum(); dr = (w@sig)/np.sqrt(w@S@w)
evals, evecs = np.linalg.eigh(S); pc_var = (evecs.T@w)**2*evals; p = pc_var/pc_var.sum(); enb = np.exp(-(p*np.log(p+1e-300)).sum())
print("\n=== 5. Diagnostics for the equal-weight USD portfolio ===")
print(f"HHI = {hhi:.3f} (effective positions 1/HHI = {1/hhi:.2f}); diversification ratio = {dr:.3f}; effective number of bets (PCA entropy) = {enb:.2f}")
rc = w*(S@w)/(w@S@w); print("Risk contributions:", dict(zip(names, rc.round(3))))
print("Currency exposure (USD base): NGN %.0f%%, USD %.0f%%" % (100*(w[0]+w[2]), 100*w[1]))

# ---------- 6. Time-weighted vs Modified Dietz with a large mid-period deposit ----------
print("\n=== 6. TWR vs Modified Dietz, one quarter (63 days), deposit of 50% of start value on day 10 ===")
r = R["USD_equity"].values[:63]; V0 = 100_000.0; cf_day = 10; CF = 50_000.0
V = V0; path = []
for i, ri in enumerate(r):
    if i == cf_day: V += CF
    V *= np.exp(ri); path.append(V)
V1 = path[-1]
twr = np.exp(r.sum()) - 1
md = (V1 - V0 - CF)/(V0 + CF*(63-cf_day)/63)
irr_daily = None
# simple IRR solve by bisection on daily rate
lo, hi = -0.05, 0.05
for _ in range(100):
    mid = (lo+hi)/2; npv = V0*(1+mid)**63 + CF*(1+mid)**(63-cf_day) - V1
    lo, hi = (mid, hi) if npv < 0 else (lo, mid)
irr = (1+mid)**63 - 1
print(f"TWR {twr:+.2%} | Modified Dietz {md:+.2%} | IRR (money-weighted) {irr:+.2%} | end value {V1:,.0f}")
print("Interpretation: TWR measures the strategy; MWR/IRR measures the investor's experience including timing of the deposit.")

# ---------- 7. Sharpe standard error (Lo 2002) and PIT coverage check ----------
m = R["USD_equity"].values; sr_d = m.mean()/m.std(ddof=1); n = len(m)
se = np.sqrt((1 + 0.5*sr_d**2)/n)
print("\n=== 7. Sharpe ratio with standard error (Lo 2002, iid formula) ===")
print(f"USD_equity annualised SR = {sr_d*np.sqrt(252):.2f} ± {se*np.sqrt(252):.2f} (1 s.e.) from {n} daily obs; 95% CI ≈ [{(sr_d-1.96*se)*np.sqrt(252):.2f}, {(sr_d+1.96*se)*np.sqrt(252):.2f}]")
# PIT coverage: Gaussian forecaster with the right variance vs t5 truth
tt = rng.standard_t(5, 100_000)/np.sqrt(5/3)
from math import erf, sqrt
Phi = lambda x: 0.5*(1+erf(x/sqrt(2)))
pit = np.array([Phi(v) for v in tt[:20000]])
hist, _ = np.histogram(pit, bins=10, range=(0,1)); hist = hist/hist.sum()
cover90 = ((tt > -1.645) & (tt < 1.645)).mean(); cover99 = ((tt > -2.326) & (tt < 2.326)).mean()
print("\n=== 7b. Calibration check: Gaussian forecast applied to fat-tailed (t5) outcomes ===")
print("PIT histogram (10 bins, should be flat at 0.10):", hist.round(3))
print(f"Nominal 90% interval covers {cover90:.1%}; nominal 99% interval covers {cover99:.1%} -> centre over-covered, tails under-covered (Kupiec-type test would reject the 99% band)")
