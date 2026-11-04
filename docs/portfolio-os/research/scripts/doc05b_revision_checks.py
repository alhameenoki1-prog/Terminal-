"""Document 5b v0.2 revision checks (standard library only; run with python3 -I).

Reproduces:
  [1] §4.10 decision-matrix totals (R05b M1): stated weights, and with the circular 'MVP suitability' criterion removed.
  [2] §4.7 calibration feasibility (R05b M3): exact binomial power and false-alarm rates; months of 1-month-ahead
      outcomes needed; exact (Clopper-Pearson) bounds used by the revised protocol.
  [3] §4.11 / §4.4 June 2023 unification loss in USD terms from sourced I&E closing rates (R05b M5).
  [4] §4.7 why the v0.1 'estimation band' is set by H/T (R05b B3): Phi(c +/- 1.2816 sqrt(H/T)) and the predictive value.
"""
import sys
from fractions import Fraction as F
from math import comb, erf, sqrt

def Phi(x): return 0.5 * (1 + erf(x / sqrt(2)))

# ---------------------------------------------------------------- [1] decision matrix
W = [F(25, 100), F(20, 100), F(20, 100), F(15, 100), F(5, 100), F(15, 100)]
ROWS = [  # name, scores (validity, data, stability, interpretability, compute, MVP suitability), v0.1 stated total
    ("Exposure decomposition", (5, 5, 5, 5, 5, 5), "5.00"),
    ("Descriptive risk with CIs", (5, 4, 4, 4, 5, 5), "4.45"),
    ("Historical/hypothetical + reverse stress", (4, 3, 5, 5, 5, 5), "4.40"),
    ("TWR + MWR ledger, currency decomposition", (5, 4, 5, 4, 5, 5), "4.65"),
    ("Ledoit-Wolf covariance (+EWMA), break rule", (5, 3, 4, 2, 5, 4), "3.95"),
    ("Goal engine (C6)", (4, 3, 3, 4, 4, 5), "3.85"),
    ("Calibration logging", (5, 2, 5, 3, 5, 4), "4.00"),
    ("Sharpe/Sortino/Calmar display rules", (4, 3, 3, 3, 5, 3), "3.45"),
    ("Risk-budgeting / risk-parity display", (4, 3, 4, 4, 5, 3), "3.75"),
    ("Constrained min-variance alternative view", (3, 3, 2, 2, 5, 2), "2.65"),
    ("Black-Litterman view tool", (3, 2, 2, 3, 5, 2), "2.60"),
    ("CVaR optimisation", (4, 1, 2, 3, 4, 1), "2.45"),
    ("Student-t GARCH simulation (estimated)", (4, 2, 2, 2, 3, 2), "2.55"),
    ("Regime-switching simulation", (3, 1, 2, 2, 3, 1), "2.00"),
    ("DCC-GARCH", (2, 1, 1, 1, 2, 1), "1.35"),
    ("Mean-variance (unconstrained)", (2, 1, 1, 1, 5, 1), "1.40"),
    ("Resampled efficiency / robust MV", (2, 1, 3, 1, 3, 1), "1.75"),
    ("Hierarchical risk parity", (3, 2, 3, 1, 4, 1), "2.30"),
    ("Kelly / fractional Kelly", (2, 1, 1, 2, 5, 1), "1.60"),
]
def q2(x): return f"{float(x):.2f}"
print("[1] Decision matrix: weighted totals")
wsum5 = sum(W[:5])
wrong = 0
print(f"   {'module':45s} v0.1   recomputed  without-MVP-criterion (weights renormalised over {float(wsum5):.2f})")
for name, s, stated in ROWS:
    tot = sum(w * x for w, x in zip(W, s)); tot5 = sum(w * x for w, x in zip(W[:5], s[:5])) / wsum5
    flag = "" if q2(tot) == stated else "  <- v0.1 wrong"
    wrong += flag != ""
    print(f"   {name:45s} {stated}  {q2(tot):>6}      {q2(tot5):>6}{flag}")
print(f"   v0.1 totals wrong: {wrong} of {len(ROWS)}")

# ---------------------------------------------------------------- [2] calibration feasibility
def pmf(n, p): return [comb(n, k) * p**k * (1 - p)**(n - k) for k in range(n + 1)]
def reject_set_minlike(n, p0, alpha=0.05):
    """Exact two-sided binomial test, 'minlike' p-value (sum of outcomes no more likely than the observed one)."""
    f = pmf(n, p0)
    return [k for k in range(n + 1) if sum(x for x in f if x <= f[k] * (1 + 1e-7)) <= alpha]
def reject_set_equaltail(n, p0, alpha=0.05):
    f = pmf(n, p0); cdf = [sum(f[:k + 1]) for k in range(n + 1)]; sf = [sum(f[k:]) for k in range(n + 1)]
    return [k for k in range(n + 1) if cdf[k] <= alpha / 2 or sf[k] <= alpha / 2]
def power(n, p0, p1, rule):
    f1 = pmf(n, p1); return sum(f1[k] for k in rule(n, p0))
print("\n[2] Calibration feasibility")
for n in (24,):
    print(f"   n={n}: power to detect 80% true coverage of a nominal 90% band: minlike {power(n,.9,.8,reject_set_minlike):.1%}, "
          f"equal-tail {power(n,.9,.8,reject_set_equaltail):.1%}")
def pm10(n, p):  # v0.1 rule: fail if realised coverage is more than 10 points from nominal
    f = pmf(n, p); return sum(f[k] for k in range(n + 1) if abs(F(k, n) - F(p).limit_denominator(100)) > F(1, 10))
print(f"   v0.1 '+/-10 points' rule at n=24, perfectly calibrated engine: false alarm 50% band {pm10(24,.5):.1%}, "
      f"90% band {pm10(24,.9):.1%}; two consecutive failures (independent windows) 50% band {pm10(24,.5)**2:.1%}")
need = next(n for n in range(24, 2000) if power(n, .9, .8, reject_set_minlike) >= 0.80)
print(f"   months of non-overlapping 1-month-ahead outcomes for 80% power (90% band, true 80%): {need} "
      f"({need/12:.1f} years); with 4 independent series pooled: {-(-need//4)} months")
need50 = next(n for n in range(24, 4000) if power(n, .5, .4, reject_set_minlike) >= 0.80)
print(f"   same for the 50% band with true coverage 40%: {need50} outcomes")
def cp_bounds(k, n, alpha=0.05):
    """Clopper-Pearson interval by bisection on the exact binomial tails (no scipy)."""
    def tail_ge(p): return sum(comb(n, j) * p**j * (1 - p)**(n - j) for j in range(k, n + 1))
    def tail_le(p): return sum(comb(n, j) * p**j * (1 - p)**(n - j) for j in range(0, k + 1))
    lo = 0.0
    if k > 0:
        a, b = 0.0, 1.0
        for _ in range(100):
            m = (a + b) / 2; a, b = (m, b) if tail_ge(m) < alpha / 2 else (a, m)
        lo = b
    hi = 1.0
    if k < n:
        a, b = 0.0, 1.0
        for _ in range(100):
            m = (a + b) / 2; a, b = (m, b) if tail_le(m) > alpha / 2 else (a, m)
        hi = a
    return lo, hi
for k, n in ((22, 24), (20, 24), (54, 60)):
    lo, hi = cp_bounds(k, n); print(f"   Clopper-Pearson 95% for {k}/{n} inside a 90% band: [{lo:.3f}, {hi:.3f}] -> "
                                   f"{'consistent with 0.90' if lo <= .9 <= hi else 'REJECTS 0.90'}")

# ---------------------------------------------------------------- [3] June 2023 unification, USD loss on naira assets
print("\n[3] June 2023 naira unification: fall in the USD value of a naira asset (I&E window closing rates)")
first_day = F(29, 100)                      # Nairametrics 21 Jun 2023: naira fell 29% to N664/$ on the first day
r16, r23 = F("663.04"), F("770.17")         # Nairametrics 24 Jun 2023: N663.04 (16 Jun) -> N770.17 (23 Jun)
wk = 1 - r16 / r23
print(f"   first trading day (14 Jun, as reported): -{float(first_day):.0%}; week 16 -> 23 Jun: -{float(wk):.1%}; "
      f"cumulative to 23 Jun: -{float(1 - (1 - first_day) * (1 - wk)):.1%}")
print(f"   synthetic generator jump +45% NGN per USD -> USD value change {float(1/F(145,100) - 1):+.1%} (illustrative only)")

# ---------------------------------------------------------------- [4] the H/T band
print("\n[4] Second-order band of P(success | mu_hat) under iid normal returns, mu_hat ~ N(mu, sigma^2/T)")
for c in (0.0, 0.03, 0.2):
    for ht in (1, 4):
        lo, hi = Phi(c - 1.2816 * sqrt(ht)), Phi(c + 1.2816 * sqrt(ht))
        print(f"   c={c:+.2f} H/T={ht}: 10-90 band {lo:.1%}-{hi:.1%}; predictive Phi(c/sqrt(1+H/T)) {Phi(c / sqrt(1 + ht)):.1%}")
