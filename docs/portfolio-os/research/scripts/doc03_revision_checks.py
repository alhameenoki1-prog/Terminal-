"""Document 3 (behavioural finance) v0.2 revision checks.

Recomputes every number that Document 3 v0.2 changed in response to reviews R03 and R03b
(revision-log rows V-024, V-026, V-027, V-029, V-030). All data are synthetic. Run with:

    python3 -I docs/portfolio-os/research/scripts/doc03_revision_checks.py

Requires numpy and pandas only (fails loudly otherwise). Reads the v0.1 synthetic ledger
(`../behavioural/synthetic_ledger.csv`, produced by `../behavioural/payday_sim.py`, seed 20261102)
so the v0.1 worked example and these checks use the same synthetic data.

Sections
  A  reproduce the v0.1 headline ratios from the stored ledger
  B  decomposition of the naive "spike" by component (fixes the "93%" label, R03 M8)
  C  cycle-level bootstrap of the discretionary ratio (R03 M8)
  D  empirical size of the circular-shift test (R03 M8)
  E  pattern-detection power under three noise models (R03 M8, R03b M2; gate calibration)
  F  intervention power under the design actually specified: randomisation WITHIN PAIRS of
     pay cycles, exact sign-flip randomisation test; with carry-over and month shocks (R03 B1, V-024)
  G  repeated monthly looks versus scheduled looks: false-pattern rate (R03 M7)
  H  minimal detectable change of the questionnaires (R03 M4, R03b M3)
  I  PGR-PLR precision at the catalogue minimum (R03 M8, V-027)
  J  Doc 8 insight card: implied ratio of "38% in 4 days" (R03b B1, V-007)
  K  price drift per month: month-on-month series vs year-on-year shortcut (R03 m5)
  L  official-parallel FX spread (R03b M4, V-030)
  M  year-one questionnaire burden, v0.1 vs v0.2 (R03b M3, V-029)
  N  budget-view experiment: between-person sample size (Doc 4 sec. 4.4.1 and sec. 9 item 10)
"""
import sys

try:
    import numpy as np
    import pandas as pd
except ImportError as exc:  # fail loudly: no silent fallback
    sys.exit(f"doc03_revision_checks.py needs numpy and pandas: {exc}")

from itertools import product
from math import comb, sqrt
from pathlib import Path

HERE = Path(__file__).resolve().parent
LEDGER = HERE.parent / "behavioural" / "synthetic_ledger.csv"
if not LEDGER.exists():
    sys.exit(f"missing {LEDGER}; run ../behavioural/payday_sim.py first")

rng = np.random.default_rng(20261104)
BASE = 18_000.0  # same baseline as payday_sim.py

# ---------------------------------------------------------------- A
df = pd.read_csv(LEDGER, index_col=0, parse_dates=True)
win = df["days_since_pay"] <= 6
print("A. v0.1 ledger reproduced from CSV")
for col in ["all_outflows", "discretionary"]:
    w, r = df.loc[win, col].mean(), df.loc[~win, col].mean()
    print(f"   {col:14s} window/day {w:,.0f}  other/day {r:,.0f}  ratio {w / r:.2f}")

# ---------------------------------------------------------------- B
print("\nB. Naive excess (window mean - other mean, all outflows) by component")
parts = ["fixed", "family_transfer", "fx_purchase", "investment", "ajo", "discretionary"]
excess = {c: df.loc[win, c].mean() - df.loc[~win, c].mean() for c in parts}
tot = sum(excess.values())
for c in parts:
    print(f"   {c:16s} {excess[c]:>10,.0f} NGN/day  {100 * excess[c] / tot:5.1f}% of naive excess")
nondisc = tot - excess["discretionary"]
print(f"   all non-discretionary components together: {100 * nondisc / tot:.1f}% "
      f"(bills/fees alone {100 * excess['fixed'] / tot:.1f}%)")

# ---------------------------------------------------------------- C
print("\nC. Cycle-level bootstrap of the discretionary ratio (5 complete cycles)")
cyc = df[(df["cycle"] >= 1) & (df["cycle"] <= 5)]
by = [(g.loc[g.days_since_pay <= 6, "discretionary"].values, g.loc[g.days_since_pay > 6, "discretionary"].values)
      for _, g in cyc.groupby("cycle")]
bs = []
for _ in range(10_000):
    pick = rng.integers(0, len(by), len(by))
    w = np.concatenate([by[i][0] for i in pick]); r = np.concatenate([by[i][1] for i in pick])
    bs.append(w.mean() / r.mean())
lo, hi = np.percentile(bs, [2.5, 97.5])
print(f"   cycle bootstrap 95% interval {lo:.2f}-{hi:.2f} (v0.1 day-level bootstrap 1.38-1.83); "
      f"with 5 clusters any bootstrap under-covers")


# ---------------------------------------------------------------- helpers
def gen_days(n_cycles, uplift, sigma, p_zero, month_sd=0.0):
    nd = 30 * n_cycles
    idx = np.arange(nd); dsp = idx % 30
    wk = np.where((idx % 7) >= 5, 1.25, 1.0)
    up = np.where(dsp <= 6, uplift, 1.0)
    x = BASE * wk * up * rng.lognormal(0, sigma, nd)
    if month_sd:
        x *= np.repeat(rng.lognormal(0, month_sd, n_cycles), 30)
    if p_zero:
        x[rng.random(nd) < p_zero] = 0.0
    return x, dsp <= 6


def circ_p(x, ind, step=3):
    ob = x[ind].mean() / max(x[~ind].mean(), 1e-9)
    nl = np.array([x[np.roll(ind, s)].mean() / max(x[~np.roll(ind, s)].mean(), 1e-9)
                   for s in range(1, len(x), step)])
    return (np.sum(nl >= ob) + 1) / (len(nl) + 1)


NOISE = {"v0.1 clean (sigma 0.45, no zero days)": (0.45, 0.0),
         "R03 lumpy (sigma 0.8, 20% zero days)": (0.8, 0.2),
         "R03b lumpy (sigma 0.9, 30% zero days)": (0.9, 0.3)}

# ---------------------------------------------------------------- D
print("\nD. Empirical size of the circular-shift test at nominal 0.05 (true uplift 1.00, clean noise)")
for n in [3, 6, 12]:
    sims = 400
    rej = sum(circ_p(*gen_days(n, 1.0, 0.45, 0.0)) < 0.05 for _ in range(sims))
    print(f"   {n:2d} cycles: size {rej / sims:.3f}")

# ---------------------------------------------------------------- E
print("\nE. Power to detect the payday pattern (circular-shift, alpha 0.05), 200 sims per cell")
for name, (sg, pz) in NOISE.items():
    for u in [1.30, 1.45]:
        res = {}
        for n in [6, 12, 24]:
            sims = 200
            res[n] = sum(circ_p(*gen_days(n, u, sg, pz), step=3 if n < 24 else 6) < 0.05 for _ in range(sims)) / sims
        print(f"   {name:40s} uplift x{u:.2f}: " + "  ".join(f"{n} cycles {p:.2f}" for n, p in res.items()))


# ---------------------------------------------------------------- F
def sim_within_pair(months, effect, sigma, p_zero, month_sd, carry, sims, alpha=0.05):
    """Treatment cuts payday-window spend by (1-effect). Order randomised within each consecutive pair.
    carry = share of the effect that persists into a control month that follows a treated month.
    Exact one-sided randomisation test over all 2^(pairs) within-pair assignments (Edgington)."""
    pairs = months // 2
    signs = np.array(list(product([1, -1], repeat=pairs)), dtype=float)  # 2^pairs x pairs
    min_p = 1 / len(signs)
    hits = 0
    for _ in range(sims):
        first_treated = rng.random(pairs) < 0.5
        arm = np.empty(months, int)
        arm[0::2] = first_treated; arm[1::2] = ~first_treated
        vals = np.empty(months)
        for m in range(months):
            x, ind = gen_days(1, 1.45, sigma, p_zero, month_sd)
            mult = 1.0
            if arm[m] == 1:
                mult = 1 - effect
            elif m > 0 and arm[m - 1] == 1 and carry:
                mult = 1 - effect * carry
            vals[m] = x[ind].sum() * mult
        # pair difference control - treated (positive = treatment lowered spend)
        a = vals[0::2]; b = vals[1::2]
        d = np.where(first_treated, b - a, a - b)
        obs = d.mean()
        null = signs @ d / pairs
        p = np.mean(null >= obs - 1e-12)
        hits += p <= alpha
    return hits / sims, min_p


print("\nF. Intervention power, randomisation within pairs of pay cycles (exact sign-flip test, one-sided 0.05)")
print("   months  pairs  assignments  min p   | clean: 15%  30%  | lumpy+month shock: 15%  30%  | clean, carry-over 50%: 15%  30%")
for months in [6, 12, 24, 36]:
    sims = 300 if months < 36 else 200
    pw = {}
    for lab, (sg, pz, ms, cv) in {"clean": (0.45, 0.0, 0.0, 0.0),
                                  "lumpy": (0.8, 0.2, 0.15, 0.0),
                                  "carry": (0.45, 0.0, 0.0, 0.5)}.items():
        for eff in [0.15, 0.30]:
            pw[(lab, eff)], mp = sim_within_pair(months, eff, sg, pz, ms, cv, sims)
    print(f"   {months:6d}  {months // 2:5d}  {2 ** (months // 2):11d}  {mp:.4f}  |"
          f"       {pw[('clean', .15)]:.2f} {pw[('clean', .30)]:.2f}  |"
          f"                   {pw[('lumpy', .15)]:.2f} {pw[('lumpy', .30)]:.2f}  |"
          f"                       {pw[('carry', .15)]:.2f} {pw[('carry', .30)]:.2f}")
print(f"   v0.1 analysed a fixed ABAB sequence over C(n, n/2) labellings: C(6,3)={comb(6, 3)}, C(12,6)={comb(12, 6)}; "
      f"that is not the randomisation the protocol specified")

# ---------------------------------------------------------------- G
print("\nG. One null construct (true uplift 1.00), re-tested as data accumulate (clean noise, 200 sims)")
sims = 200
monthly_fp = scheduled_fp = 0
for _ in range(sims):
    x, ind = gen_days(12, 1.0, 0.45, 0.0)
    ps = {n: circ_p(x[:30 * n], ind[:30 * n], step=3) for n in range(3, 13)}
    monthly_fp += any(p < 0.05 for p in ps.values())
    scheduled_fp += (ps[6] < 0.025) or (ps[12] < 0.025)
print(f"   monthly looks at cycles 3..12, each at 0.05: P(at least one false 'pattern') = {monthly_fp / sims:.2f}")
print(f"   scheduled looks at cycles 6 and 12, each at 0.025:  P(at least one false 'pattern') = {scheduled_fp / sims:.2f}")

# ---------------------------------------------------------------- H
print("\nH. Minimal detectable change, MDC95 = 1.96 * sqrt(2) * SD * sqrt(1 - reliability)")
for name, sd, rel in [("CFPB FWB 10-item (SD 15 by construction; marginal reliability 0.89)", 15, 0.89),
                      ("CFPB FWB 5-item (reliability 0.80)", 15, 0.80),
                      ("SOEP/GPS risk item, assumed SD 2.3, retest r 0.6 (E4)", 2.3, 0.6),
                      ("SOEP/GPS risk item, assumed SD 2.3, retest r 0.7 (E4)", 2.3, 0.7)]:
    sem = sd * sqrt(1 - rel)
    print(f"   {name:70s} SEM {sem:5.2f}  MDC95 {1.96 * sqrt(2) * sem:5.1f}")

# ---------------------------------------------------------------- I
print("\nI. PGR-PLR precision (normal approximation, independent binomials)")
pgr, plr = 0.30, 0.15
for n in [20, 30, 60]:
    hw = 1.96 * sqrt(pgr * (1 - pgr) / n + plr * (1 - plr) / n)
    print(f"   {n} paper gains and {n} paper losses: 95% half-width +/-{hw:.2f}")
need = (1.96 ** 2) * (pgr * (1 - pgr) + plr * (1 - plr)) / 0.15 ** 2
print(f"   n of each needed for +/-0.15: {need:.1f} (before within-day clustering)")

# ---------------------------------------------------------------- J
print("\nJ. Doc 8 card '38% of discretionary spend in the 4 days after salary' (30-day month)")
share, days = 0.38, 4
print(f"   expected share with no pattern {days / 30:.1%}; implied ratio {(share / days) / ((1 - share) / (30 - days)):.2f}x")

# ---------------------------------------------------------------- K
print("\nK. Within-cycle price drift")
yoy, mom = 0.1463, 0.0006
print(f"   from y/y {yoy:.2%}: {(1 + yoy) ** (1 / 12) - 1:.2%} a month (v0.1 shortcut); "
      f"September 2026 m/m as published: {mom:.2%}")

# ---------------------------------------------------------------- L
print("\nL. Official (NFEM) vs parallel USD/NGN, 29-30 Oct 2026 (press tracker S104)")
nfem = 1346.91
for par in [1385.0, 1390.0]:
    print(f"   parallel {par:,.2f}: gap {(par / nfem - 1):.2%} of the official rate")

# ---------------------------------------------------------------- M
print("\nM. Year-one questionnaire items")
v01 = {"onboarding: SOEP item 1 + Big Three 3 + fragility item in 3 currencies": 7,
       "four-week retest: onboarding set repeated + CFPB-10": 17, "CFPB-10 quarterly": 40}
v02 = {"SOEP/GPS risk item, asked just in time": 1, "SOEP/GPS item retest once (measurement error)": 1,
       "CFPB 5-item, once a year": 5}
print(f"   v0.1 core: {sum(v01.values())} items + 200 audit labels; v0.2 core: {sum(v02.values())} items, "
      f"labels folded into the review queue")
for k, v in v02.items():
    print(f"     {k}: {v}")

# ---------------------------------------------------------------- N
print("\nN. Budget-view experiment (Doc 4 sec. 4.4.1): between-person sample size, two-sided 0.05, power 0.80")
sd_pp, delta_pp = 10.0, 2.0  # E5 assumptions: SD of monthly savings rate 10 pp; difference worth detecting 2 pp
n_arm = 2 * (1.96 + 0.8416) ** 2 * (sd_pp / delta_pp) ** 2
print(f"   SD {sd_pp:.0f} pp, difference {delta_pp:.0f} pp: {n_arm:.0f} users per arm (one person cannot supply this)")
