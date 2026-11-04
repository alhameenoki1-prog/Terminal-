"""Document 5b — thin trading (stale prices) biases volatility and beta downward; Dimson (1979) aggregated-coefficients
correction and weekly aggregation recover most of it. Synthetic, seed fixed. Run: python3 thin_trading_demo.py"""
import numpy as np
rng = np.random.default_rng(7)
T = 2520; dt = 1/252
m = 0.18*np.sqrt(dt)*rng.standard_normal(T)                 # market daily returns (vol 18%)
true_beta, idio = 1.0, 0.25*np.sqrt(dt)                     # stock: beta 1, idiosyncratic vol 25%
s_true = true_beta*m + idio*rng.standard_normal(T)
def stale(x, p):
    out = np.zeros_like(x); carry = 0.0
    for t in range(T):
        if rng.random() < p: carry += x[t]
        else: out[t] = x[t] + carry; carry = 0.0
    return out
def ols_beta(y, x): return np.cov(y, x, ddof=0)[0,1]/x.var()
def dimson(y, x, k):
    cols = [np.roll(x, L) for L in range(-k, k+1)]
    X = np.column_stack([np.ones(T)] + cols)[k:T-k]; Y = y[k:T-k]
    b = np.linalg.lstsq(X, Y, rcond=None)[0]; return b[1:].sum()
def weekly(x): return x[:T//5*5].reshape(-1,5).sum(1)
print(f"{'stale prob':>10s} {'obs vol':>8s} {'true vol':>8s} {'OLS beta':>9s} {'Dimson k=1':>10s} {'Dimson k=3':>10s} {'weekly beta':>11s} {'zero-day frac':>13s}")
for p in (0.0, 0.3, 0.5, 0.7):
    s_obs = stale(s_true, p)
    print(f"{p:10.1f} {s_obs.std()*np.sqrt(252):8.3f} {s_true.std()*np.sqrt(252):8.3f} {ols_beta(s_obs, m):9.3f} {dimson(s_obs, m, 1):10.3f} {dimson(s_obs, m, 3):10.3f} {ols_beta(weekly(s_obs), weekly(m)):11.3f} {(s_obs==0).mean():13.2f}")
print("Daily observed vol is biased down and OLS beta is biased toward zero as staleness rises; Dimson lags and weekly aggregation recover most of the bias at the cost of precision.")
