"""Document 5b — numerical checks of defects in src/components/MonteCarloPanel.tsx and PerformancePanel.tsx.
Synthetic data only. Reproducible: numpy default_rng(20261104). Run: python3 prototype_checks.py"""
import numpy as np
rng = np.random.default_rng(20261104)
print("numpy", np.__version__)

# 1. Student-t(5) innovations are NOT variance-scaled (MonteCarloPanel.tsx lines 57-62, 95)
t = rng.standard_t(5, size=2_000_000)
print(f"\n[1] Student-t(5): sample variance = {t.var():.4f}; theory nu/(nu-2) = {5/3:.4f}; "
      f"sigma inflation factor = {np.sqrt(t.var()):.4f} (so a user-entered 60% vol is simulated as ~{60*np.sqrt(5/3):.1f}%)")

# 2. 'Max drawdown' from terminal cross-section (lines 238-242) vs true path maximum drawdown under GBM
def gbm_paths(S0, mu, sigma, days, n):
    dt = 1/252
    z = rng.standard_normal((n, days))
    logret = (mu - 0.5*sigma**2)*dt + sigma*np.sqrt(dt)*z
    return S0*np.exp(np.cumsum(logret, axis=1))
print("\n[2] Prototype 'Max DD P50/P95' (1-P25/P50, 1-P5/P50 of terminal prices) vs true path max drawdown, GBM mu=5%, sigma=60%")
for days in (5, 21, 63, 252):
    P = gbm_paths(100, 0.05, 0.60, days, 20000)
    fin = P[:, -1]; q = np.quantile(fin, [0.05, 0.25, 0.5])
    proto50 = max(0, 1 - q[1]/q[2]); proto95 = max(0, 1 - q[0]/q[2])
    peaks = np.maximum.accumulate(np.hstack([np.full((P.shape[0],1),100.0), P]), axis=1)[:,1:]
    mdd = (1 - P/peaks).max(axis=1)
    print(f"   {days:3d}d: prototype P50={proto50:6.1%} P95={proto95:6.1%} | true path MDD median={np.median(mdd):6.1%} 95th pct={np.quantile(mdd,0.95):6.1%}")

# 3. P(stop hit) from terminal values only (lines 218-223) vs path barrier under GBM
print("\n[3] P(stop) terminal-only vs path-barrier (stop at -10%), GBM sigma=60%")
for days in (5, 21, 63, 252):
    P = gbm_paths(100, 0.05, 0.60, days, 20000)
    term = (P[:, -1] <= 90).mean(); path = (P.min(axis=1) <= 90).mean()
    print(f"   {days:3d}d: terminal-only {term:5.1%} | path (any day) {path:5.1%} | under-count x{path/max(term,1e-9):.2f}")

# 4. GARCH clamp (line 127) and hardcoded parameters (line 113): effect on unconditional variance and kurtosis
def garch_sim(sigma, alpha, beta, days, n, clamp):
    omega = sigma**2*(1-alpha-beta); dt = 1/252
    s2 = np.full(n, sigma**2); rets = np.empty((n, days))
    for tt in range(days):
        z = rng.standard_normal(n); st = np.sqrt(s2)
        rets[:, tt] = st*np.sqrt(dt)*z
        s2 = omega + alpha*(st*z)**2 + beta*s2
        if clamp: s2 = np.clip(s2, 1e-8, 4*sigma**2)
    return rets
for clamp in (False, True):
    r = garch_sim(0.60, 0.08, 0.85, 252, 5000, clamp)
    ann_vol = r.std()*np.sqrt(252); x = r.ravel(); k = ((x-x.mean())**4).mean()/x.var()**2 - 3
    print(f"[4] GARCH(0.08,0.85) sigma=60%, clamp={clamp}: realised ann. vol {ann_vol:.3f} (target 0.600), excess kurtosis of daily returns {k:.2f}")

# 5. OU half-life claim (lines 139, 555): kappa=2.0 per year
print(f"\n[5] OU kappa=2.0: half-life = ln2/kappa = {np.log(2)/2:.4f} years = {np.log(2)/2*252:.0f} trading days = {np.log(2)/2*365:.0f} calendar days "
      "(code comments say '≈130 days' and '≈127 days')")

# 6. 'Sharpe' output is a restatement of hardcoded mu=0.05 (line 306) divided by sigma
print("\n[6] Prototype 'Sharpe' = mean/std of terminal simple returns * sqrt(252/h), GBM mu=0.05 hardcoded:")
for sigma in (0.18, 0.60):
    for days in (5, 252):
        P = gbm_paths(100, 0.05, sigma, days, 20000); r = P[:, -1]/100 - 1
        print(f"   sigma={sigma:.2f} h={days:3d}d: 'Sharpe'={r.mean()/r.std()*np.sqrt(252/days):.3f}  vs mu/sigma={0.05/sigma:.3f} (no risk-free rate, no data)")

# 7. Monte Carlo error of reported quantities at N=10,000 (no standard errors shown in UI)
F = gbm_paths(100, 0.05, 0.60, 21, 10000*50)[:, -1].reshape(50, 10000)
p5 = np.quantile(F, 0.05, axis=1); pprof = (F > 100).mean(axis=1)
print(f"\n[7] MC noise at N=10,000 (50 independent runs, 21d, sigma 60%): P5 price sd={p5.std():.3f} on mean {p5.mean():.2f} "
      f"(≈{p5.std()/p5.mean():.2%}); P(profit) sd={pprof.std():.4f}")

# 8. PerformancePanel drawdown denominator (lines 50-63): peak of cumulative P&L, not account equity
pnls = [50, -100, 30]
eq = 0; peak = 0; mdd = 0
for p in pnls:
    eq += p; peak = max(peak, eq); dd = (peak-eq)/peak if peak > 0 else 0; mdd = max(mdd, dd)
print(f"\n[8] PerformancePanel: P&L sequence {pnls} on a 10,000 account -> reported max drawdown {mdd:.0%}; "
      f"true equity drawdown {(100/10050):.2%}")

# 9. PerformancePanel 'Sharpe' (lines 42-48): per-trade returns of last 20 trades annualised by sqrt(252)
tr = rng.normal(0.01, 0.05, 20)
print(f"[9] 20 trade returns mean 1% sd 5% (holding period unknown): panel 'Sharpe' = {tr.mean()/tr.std(ddof=1)*np.sqrt(252):.2f}; "
      f"Lo(2002) iid SE of the un-annualised ratio with n=20 ≈ {np.sqrt((1+0.5*(tr.mean()/tr.std(ddof=1))**2)/20):.2f} per sqrt(period)")

# 10. (v0.2, R05b D21/N5) the same function on an all-loss P&L sequence: peak starts at 0 and never rises
pnls2 = [-100, -200]
eq = 0; peak = 0; mdd = 0
for p in pnls2:
    eq += p; peak = max(peak, eq); dd = (peak-eq)/peak if peak > 0 else 0; mdd = max(mdd, dd)
print(f"[10] PerformancePanel: all-loss P&L {pnls2} on a 10,000 account -> reported max drawdown {mdd:.0%}; true equity drawdown {300/10000:.2%}")

# 11. (v0.2, R05b D15) quantile index sorted[floor(N*p)] (0-based) vs the type-1 empirical quantile (order statistic ceil(N*p))
N_ = 10000
print("[11] quantile index floor(N*p) vs ceil(N*p)-1 at N=10,000: " +
      ", ".join(f"p={p_}: {int(np.floor(N_*p_))} vs {int(np.ceil(N_*p_))-1}" for p_ in (0.01, 0.05, 0.25, 0.5, 0.95)))
