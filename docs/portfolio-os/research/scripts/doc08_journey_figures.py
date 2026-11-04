"""Document 8 (UX and Product Design Blueprint) v0.2 -- every journey and worked-example figure.

All inputs are SYNTHETIC (stated below). Money and rates in the FX sections use Decimal/Fraction.
The goal-engine illustration and the queue-sizing model use numpy (seeded); the Journey 4 card reads
Doc 3's committed synthetic ledger with pandas. Run from anywhere with:
    python3 -I docs/portfolio-os/research/scripts/doc08_journey_figures.py
Requires numpy and pandas; the script stops with an error if either is missing.

Sections (cited in Doc 8 as `doc08_journey_figures.py §n`):
  1 calendar checks (weekdays, business-day age of the month-end FX fixing)
  2 net-worth change decomposition per CANONICAL_CONTRACTS C5.3 (reproduces C5.4 exactly) + sign check
  3 transfer card: conversion cost vs reference per C1.5, one-sided band, C4 routing
  4 Journey 2: monthly spending review and the "school fees for the year" scenario
  5 Journey 3: "What happens if I spend AED 14,000?"
  6 Journey 6 and the Overview goal line: C6 output fields (parametric stand-in for the engine)
  7 Journey 4: insight-card figures from Doc 3's synthetic ledger
  8 First-batch and steady-state review-queue sizing under C4
  9 Colour contrast of the design tokens (WCAG 2.2 1.4.3 / 1.4.11)
"""
import sys
from datetime import date, timedelta
from decimal import Decimal as D, getcontext, ROUND_HALF_EVEN
from fractions import Fraction as F
from pathlib import Path

try:
    import numpy as np
    import pandas as pd
except ImportError as exc:  # fail loudly, never silently fall back
    sys.exit(f"FATAL: {exc}. This script requires numpy and pandas (python3 -I, system site-packages).")

getcontext().prec = 50
CENT = D("0.01")
HERE = Path(__file__).resolve().parent


def q2(x):
    if isinstance(x, F):
        x = D(x.numerator) / D(x.denominator)
    return x.quantize(CENT, rounding=ROUND_HALF_EVEN)


def bdays_between(d0, d1):
    """Business days (Mon-Fri, no holiday calendar) after d0 up to and including d1."""
    n, x = 0, d0
    while x < d1:
        x += timedelta(days=1)
        n += x.weekday() < 5
    return n


# ---------------------------------------------------------------- 1 calendar checks
def s1():
    print("=== 1 Calendar checks ===")
    for d in (date(2026, 10, 2), date(2026, 10, 3), date(2026, 10, 5), date(2026, 10, 18), date(2026, 10, 19),
              date(2026, 10, 30), date(2026, 10, 31), date(2026, 11, 2), date(2026, 11, 3)):
        print(f"{d} is a {d.strftime('%A')}")
    age = bdays_between(date(2026, 10, 30), date(2026, 11, 3))
    # Doc 5c 4.3.2 official FX: fresh <= 1 business day; ageing 2; stale > 2; expired > 10 (also C5.2)
    state = "fresh" if age <= 1 else "ageing" if age == 2 else "stale" if age <= 10 else "expired"
    print(f"Fixing of Fri 2026-10-30 read on Tue 2026-11-03: {age} business days old -> freshness '{state}'")


# ---------------------------------------------------------------- 2 C5.3 decomposition
RATES = {date(2026, 9, 30): D("1530.00"), date(2026, 10, 15): D("1505.00"), date(2026, 10, 16): D("1500.00"),
         date(2026, 10, 20): D("1495.00"), date(2026, 10, 26): D("1490.00"), date(2026, 10, 28): D("1485.00"),
         date(2026, 10, 30): D("1480.00")}   # synthetic CBN "NFEM Rate (₦/US$)" NGN per USD (C5.1 v0.2) (identical to contracts_checks.py)
PEG = D("3.6725")


def fixing(d):
    fd = max(k for k in RATES if k <= d)
    if bdays_between(fd, d) > 2:
        raise ValueError("stale rate: C5.2 requires a badge; >10 business days -> rate missing")
    return fd, RATES[fd]


def ngn_per(c, d):
    _, r = fixing(d)
    return {"NGN": F(1), "USD": F(r), "AED": F(r) / F(PEG)}[c]


T0, T1 = date(2026, 9, 30), date(2026, 10, 31)
OPEN_Q = {"NGN": D("12000000.00"), "USD": D("35000.00"), "AED": D("85000.00")}
ETF_UNITS, P0, P1 = D("12"), D("250.00"), D("257.50")
CONV = date(2026, 10, 18)
FLOWS = [(date(2026, 10, 15), "AED", D("-5500.00"), "external"),
         (CONV, "NGN", D("-1000000.00"), "exchange"), (CONV, "USD", D("660.00"), "exchange"),
         (date(2026, 10, 26), "NGN", D("2350000.00"), "external"),
         (date(2026, 10, 28), "NGN", D("-480000.00"), "external")]


def decompose(base):
    def x(c, d):
        return ngn_per(c, d) / ngn_per(base, d)
    close_q = dict(OPEN_Q)
    for _, c, qty, _ in FLOWS:
        close_q[c] += qty
    W0 = sum(F(OPEN_Q[c]) * x(c, T0) for c in OPEN_Q) + F(ETF_UNITS * P0) * x("USD", T0)
    W1 = sum(F(close_q[c]) * x(c, T1) for c in close_q) + F(ETF_UNITS * P1) * x("USD", T1)
    ext = sum(F(q) * x(c, d) for d, c, q, k in FLOWS if k == "external")
    conv = sum(F(q) * x(c, d) for d, c, q, k in FLOWS if k == "exchange")
    market = F(ETF_UNITS * (P1 - P0)) * x("USD", T1)
    fx = {}
    for c in OPEN_Q:
        fx[c] = F(OPEN_Q[c]) * (x(c, T1) - x(c, T0)) + sum(F(q) * (x(c, T1) - x(c, d)) for d, cc, q, _ in FLOWS if cc == c)
    fx["USD"] += F(ETF_UNITS * P0) * (x("USD", T1) - x("USD", T0))
    assert ext + conv + market + sum(fx.values()) == W1 - W0, "C5 identity must hold exactly"
    # render-time sign check (C5.3): for each currency held long throughout with a monotone move
    checks = {}
    for c in fx:
        dx = x(c, T1) - x(c, T0)
        if dx != 0:
            expected = 1 if dx > 0 else -1
            got = (fx[c] > 0) - (fx[c] < 0)
            checks[c] = (expected, got, got == expected)
    parts = {"flows": q2(ext), "conversion": q2(conv), "market": q2(market), **{f"fx_{c}": q2(v) for c, v in fx.items()}}
    parts["rounding"] = q2(W1) - q2(W0) - sum(parts.values())
    return q2(W0), q2(W1), parts, checks, close_q


def s2():
    print("\n=== 2 Net-worth change decomposition (C5.3; reproduces CANONICAL_CONTRACTS C5.4) ===")
    expected = {"NGN": ("105551844.79", "102258121.17", {"flows": "-383914.23", "conversion": "-10000.00",
                "market": "133200.00", "fx_NGN": "0.00", "fx_USD": "-1913200.00", "fx_AED": "-1119809.39"}),
                "USD": ("68988.13", "69093.33", {"flows": "-243.67", "conversion": "-6.67", "market": "90.00",
                "fx_NGN": "265.53", "fx_USD": "0.00", "fx_AED": "0.00"})}
    for base in ("NGN", "USD"):
        W0, W1, parts, checks, close_q = decompose(base)
        e0, e1, ep = expected[base]
        assert str(W0) == e0 and str(W1) == e1, (base, W0, W1)
        for k, v in ep.items():
            assert str(parts[k]) == v, (base, k, parts[k], v)
        print(f"[{base} view] W0 {W0:,}  W1 {W1:,}  change {W1 - W0:,}")
        print("   " + " | ".join(f"{k} {v:,}" for k, v in parts.items()))
        for c, (e, g, ok) in checks.items():
            print(f"   sign check FX on {c}: expected {'+' if e > 0 else '-'}, got {'+' if g > 0 else '-'}: {'OK' if ok else 'WITHHOLD'}")
        if base == "NGN":
            fx_total = parts["fx_USD"] + parts["fx_AED"] + parts["fx_NGN"]
            yours = parts["flows"] + parts["conversion"]
            print(f"   Overview tile (million, 1 dp): net worth {W1 / 10**6:.1f}m; change {(W1 - W0) / 10**6:.1f}m = "
                  f"your flows {yours / 10**6:.2f}m (incl. conversion cost {parts['conversion']:,}) + market "
                  f"{parts['market'] / 10**6:.2f}m + exchange rates {fx_total / 10**6:.2f}m")
            print(f"   v0.1 Overview claimed '+0.8M FX'; contract method gives {fx_total:,} (sign reversed, see R08 B2)")
            print(f"   closing holdings: {dict((k, str(v)) for k, v in close_q.items())}; ETF {ETF_UNITS} x {P1}")
            usd_assets = close_q["USD"] + ETF_UNITS * P1
            print(f"   USD-denominated investment assets at 30 Oct: USD {usd_assets:,} (cash {close_q['USD']:,} + ETF {ETF_UNITS * P1:,})")


# ---------------------------------------------------------------- 3 transfer card (C1.5, C4)
def s3():
    print("\n=== 3 Transfer card (C1.5 conversion cost vs reference; C4 routing) ===")
    G, R = D("1000000.00"), D("660.00")
    fd, ref = fixing(CONV)
    implied = F(int(G * 100), int(R * 100))
    cost = G - R * ref
    pct = cost / G * 100
    lo, hi = D("-1.0"), D("4.0")    # C1.5 provisional one-sided band NGN->USD
    print(f"debit leg value date {CONV} ({CONV.strftime('%A')}); reference = fixing of {fd} ({fd.strftime('%A')}) {ref}")
    print(f"implied rate {q2(F(implied.numerator, implied.denominator))} NGN/USD (exact {implied})")
    print(f"conversion cost vs reference NGN {q2(cost):,} = {q2(pct)}% of NGN given; USD view {q2(F(cost) / F(ref))}")
    print(f"within one-sided band [{lo}%, +{hi}%]: {lo <= pct <= hi}; dealer rate not printed -> no residual test")
    print("C4 item 5: cross-currency match with no shared reference/provider ID -> review queue (not auto-applied)")


# ---------------------------------------------------------------- 4 Journey 2
def s4():
    print("\n=== 4 Journey 2: monthly review (its own synthetic NG Bank series, not the C5.4 household) ===")
    months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]
    spend = dict(zip(months, [1210000, 1305000, 1262000, 1331000, 1248000, 1294000, 1420000]))
    fuel = dict(zip(months, [112000, 121000, 116000, 124000, 115000, 120000, 180000]))
    fees_oct = 180000                     # school fees, annual item last seen Oct 2025
    income = 1850000                      # salary each month (synthetic)
    base = months[:6]
    avg = sum(spend[m] for m in base) / 6
    fuel_avg = sum(fuel[m] for m in base) / 6
    other_oct = spend["Oct"] - fees_oct - fuel["Oct"]
    other_avg = avg - fuel_avg
    print(f"Oct spending {spend['Oct']:,}; previous-six-month average (Apr-Sep) {avg:,.0f}; difference {spend['Oct'] - avg:+,.0f}")
    print(f"components: school fees +{fees_oct:,}; fuel and generator {fuel['Oct'] - fuel_avg:+,.0f}; "
          f"all other categories {other_oct - other_avg:+,.0f}")
    assert fees_oct + (fuel["Oct"] - fuel_avg) + (other_oct - other_avg) == spend["Oct"] - avg
    print(f"excluding school fees, Oct = {spend['Oct'] - fees_oct:,} ({spend['Oct'] - fees_oct - avg:+,.0f} vs average)")
    win = months[1:]                      # six months May-Oct
    s0 = np.array([income - spend[m] for m in win], dtype=float)
    adj = {m: spend[m] + fees_oct / 12 for m in win}
    adj["Oct"] -= fees_oct
    s1_ = np.array([income - adj[m] for m in win], dtype=float)
    print(f"monthly surplus May-Oct as recorded: mean {s0.mean():,.0f}, sample SD {s0.std(ddof=1):,.0f}")
    print(f"with school fees spread over 12 months: mean {s1_.mean():,.0f}, sample SD {s1_.std(ddof=1):,.0f}")


# ---------------------------------------------------------------- 5 Journey 3
def s5():
    print("\n=== 5 Journey 3: 'What happens if I spend AED 14,000?' ===")
    _, _, _, _, close_q = decompose("NGN")
    aed = close_q["AED"]
    committed = D("18000") + D("1400") + D("4000")          # rent instalment, DEWA, school (synthetic)
    essential_aed = [D(v) for v in (10800, 11200, 10950, 11400, 11050, 10700)]   # trailing 6 months, is_essential
    med = sorted(essential_aed)[2:4]
    median = (med[0] + med[1]) / 2
    buy = D("14000")
    print(f"AED balance 30 Oct {aed:,}; committed next 30 days {committed:,}; free {aed - committed:,}; after purchase {aed - committed - buy:,}")
    print(f"AED essential monthly spend (6-month median, Doc 4 4.4.2) {median:,}")
    print(f"AED months covered: before {q2(aed / median)}; after {q2((aed - buy) / median)}")
    ngn_essential = D("610000")
    x_aed = ngn_per("AED", T1)
    liquid = F(close_q["NGN"]) + F(aed) * x_aed
    ess = F(ngn_essential) + F(median) * x_aed
    liquid_after = liquid - F(buy) * x_aed
    print(f"NGN+AED months covered (NGN view, 30 Oct rates; USD broker cash earmarked for the goal and excluded): "
          f"before {q2(liquid / ess)}; after {q2(liquid_after / ess)}")
    print("Goal inputs = USD broker assets + USD contributions; AED cash is not an input -> goal count unchanged")


# ---------------------------------------------------------------- 6 Journey 6 (C6 output fields)
SEED, NPATH = 20261104, 20000
GOAL, START, CONTRIB, H = 100000.0, 38750.0, 800.0, 60
# Synthetic placeholder assumption sets (NOT any provider's capital-market assumptions):
STRUCT = {"60/40 global": (0.050, 0.015, 0.10), "all-equity": (0.065, 0.025, 0.16), "USD money-market": (0.035, 0.010, 0.005)}


def paths(m, sd, sig, months, seed):
    rng = np.random.default_rng(seed)
    mu = rng.normal(m, sd, size=(NPATH, 1))                       # drift uncertainty integrated per path
    z = rng.standard_normal((NPATH, months))
    return mu / 12 + sig / np.sqrt(12) * z                         # monthly log returns


def terminal(r, start, contrib, months):
    g = np.exp(np.cumsum(r[:, :months][:, ::-1], axis=1))[:, ::-1]   # growth from end of month t to horizon
    growth_all = g[:, 0]
    annuity = np.concatenate([g[:, 1:], np.ones((r.shape[0], 1))], axis=1).sum(axis=1)  # contribution at end of each month
    return start * growth_all + contrib * annuity, growth_all, annuity


def round5(k):
    return int(5 * round(k / 5))


def required_return():
    lo, hi = -0.5, 0.5
    for _ in range(200):
        r = (lo + hi) / 2
        mth = (1 + r) ** (1 / 12) - 1
        fv = START * (1 + mth) ** H + CONTRIB * (((1 + mth) ** H - 1) / mth if mth else H)
        lo, hi = (r, hi) if fv < GOAL else (lo, r)
    return r


def goal_outputs(name, m, sd, sig, contrib=CONTRIB, seed=SEED):
    r = paths(m, sd, sig, 120, seed)
    tv, gr, ann = terminal(r, START, contrib, H)
    p = (tv >= GOAL).mean()
    se = np.sqrt(p * (1 - p) / NPATH) * 100
    qs = {f"q{int(q * 100):02d}": np.quantile(tv, q) for q in (0.05, 0.10, 0.25, 0.50, 0.75, 0.90, 0.95)}
    # adjustment for the q10 future to reach the goal
    def q10_with(extra=0.0, lump=0.0):
        return np.quantile((START + lump) * gr + (contrib + extra) * ann, 0.10)
    lo, hi = 0.0, 20000.0
    for _ in range(60):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if q10_with(extra=mid) < GOAL else (lo, mid)
    extra = hi
    lo, hi = 0.0, 500000.0
    for _ in range(60):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if q10_with(lump=mid) < GOAL else (lo, mid)
    lump = hi
    delay = None
    for extra_m in range(0, 61):
        tvx, _, _ = terminal(r, START, contrib, H + extra_m)
        if np.quantile(tvx, 0.10) >= GOAL:
            delay = extra_m
            break
    return {"name": name, "p": p, "k": round(p * 100), "se": se, "display": round5(p * 100), "q": qs,
            "extra_monthly": extra, "lump": lump, "delay_months": delay}


def s6():
    print("\n=== 6 Journey 6 / Overview goal line: C6 output fields (parametric stand-in, synthetic assumptions) ===")
    print(f"goal USD {GOAL:,.0f}; start USD {START:,.0f} (C5.4 household USD assets, 30 Oct); contributions USD {CONTRIB:,.0f}/month; "
          f"horizon {H} months; {NPATH:,} paths; seed {SEED}")
    print(f"required compound return (deterministic): {required_return() * 100:.2f}%/yr nominal")
    res = {}
    for name, (m, sd, sig) in STRUCT.items():
        o = goal_outputs(name, m, sd, sig)
        res[name] = o
        q = o["q"]
        print(f"[{name}] drift {m:.3f} +/- {sd:.3f} (log/yr), vol {sig:.3f}: success {o['k']} of 100 (MC SE {o['se']:.2f} pts) "
              f"-> display 'about {o['display']} of 100'")
        print("   quantiles USD: " + ", ".join(f"{k} {v:,.0f}" for k, v in q.items()))
        dl = "not within 60 extra months" if o["delay_months"] is None else f"{o['delay_months']} more months"
        print(f"   q10 future reaches goal with: extra USD {o['extra_monthly']:,.0f}/month, or lump sum USD {o['lump']:,.0f} today, or {dl}")
        sens = []
        for dm in (-0.02, 0.0, 0.02):
            ok = goal_outputs(name, m + dm, sd, sig)
            sens.append(f"{dm * 100:+.0f}pp -> {ok['k']} (display {ok['display']})")
        print("   drift sensitivity: " + "; ".join(sens))
    a, b = res["60/40 global"], res["all-equity"]
    gap, bar = abs(a["p"] - b["p"]) * 100, 2 * max(a["se"], b["se"]) + 5
    print(f"60/40 vs all-equity difference {gap:.1f} pts; C6 display bar (2 SE + 5) {bar:.1f} -> "
          f"{'may show difference' if gap >= bar else 'shown as no displayable difference'}")
    for c in (1000.0, 1200.0):
        o = goal_outputs("60/40 global", *STRUCT["60/40 global"], contrib=c)
        print(f"60/40 with contributions USD {c:,.0f}/month: {o['k']} of 100 -> display 'about {o['display']} of 100'")


# ---------------------------------------------------------------- 7 Journey 4 card
def s7():
    print("\n=== 7 Journey 4: insight-card figures from Doc 3's synthetic ledger (research/behavioural) ===")
    df = pd.read_csv(HERE.parent / "behavioural" / "synthetic_ledger.csv", index_col=0, parse_dates=True)
    win = df.days_since_pay <= 6
    w, o = df.loc[win, "discretionary"].mean(), df.loc[~win, "discretionary"].mean()
    ratio = w / o
    assert round(ratio, 2) == 1.60 and win.sum() == 41
    share = df.loc[win, "discretionary"].sum() / df["discretionary"].sum()
    days_share = win.mean()
    aw, ao = df.loc[win, "all_outflows"].mean(), df.loc[~win, "all_outflows"].mean()
    explained = 1 - (w - o) / (aw - ao)
    print(f"days 0-6 vs 7+: flexible-category spend/day {w:,.0f} vs {o:,.0f}; ratio {ratio:.2f} (even spread = 1.00)")
    print(f"share of flexible spending in window {share * 100:.1f}% over {days_share * 100:.1f}% of days")
    print(f"naive all-outflows ratio {aw / ao:.2f}; scheduled and excluded items explain {explained * 100:.0f}% of the naive excess")
    rows = []
    for c, g in df[df.cycle >= 1].groupby("cycle"):
        gw, go = g[g.days_since_pay <= 6].discretionary.mean(), g[g.days_since_pay > 6].discretionary
        if len(go):
            rows.append(round(float(gw / go.mean()), 2))
    held = sum(r > 1.10 for r in rows)
    print(f"complete-cycle ratios {rows}; above ROPE upper bound 1.10 in {held} of {len(rows)} complete cycles")
    contrib = df[df.cycle >= 1].groupby("cycle").investment.sum()
    print(f"investment contribution made in {int((contrib > 0).sum())} of {len(contrib)} cycles; the ledger has no fee or overdraft lines")
    print("interval 1.38-1.83 and circular-shift p = 0.006 (null 95th pct 1.44) are Doc 3's payday_sim.py outputs, cited not recomputed")


# ---------------------------------------------------------------- 8 queue sizing (C4)
def wilson_lb(k, n, z=1.959963984540054):
    if n == 0:
        return 0.0
    p = k / n
    c = p + z * z / (2 * n)
    m = z * np.sqrt(p * (1 - p) / n + z * z / (4 * n * n))
    return (c - m) / (1 + z * z / n)


def zipf_draw(rng, pool, s, size):
    w = 1 / np.arange(1, pool + 1) ** s
    return rng.choice(pool, size=size, p=w / w.sum())


def s8():
    print("\n=== 8 Review-queue sizing under C4 (E5 model; synthetic composition of 212 lines/month) ===")
    n_min = next(n for n in range(1, 200) if wilson_lb(n, n) >= 0.90)
    print(f"Wilson 95% LB with 30/30 correct = {wilson_lb(30, 30):.3f}; smallest all-correct n with LB >= 0.90 = {n_min}")
    rng = np.random.default_rng(20261104)
    months = 6
    comp = {"levies_fees": 50, "purchases": 95, "transfers_out": 25, "bills": 8, "own_transfer_legs": 16,
            "savings_nonlinked": 6, "credits": 12}
    assert sum(comp.values()) == 212
    # one row per line over 7 months: (month, group, counterparty)
    rows = []
    for mth in range(months + 1):
        rows += [(mth, "levies_fees", f"rule{k}") for k in zipf_draw(rng, 6, 0.3, comp["levies_fees"])]
        rows += [(mth, "purchases", f"m{k}") for k in zipf_draw(rng, 150, 1.1, comp["purchases"])]
        rows += [(mth, "transfers_out", f"p{k}") for k in zipf_draw(rng, 40, 1.0, comp["transfers_out"])]
        rows += [(mth, "bills", f"b{k}") for k in range(comp["bills"])]
        rows += [(mth, "own_pair", f"pair{mth}_{k}") for k in range(comp["own_transfer_legs"] // 2)]
        rows += [(mth, "savings_nonlinked", f"s{k}") for k in zipf_draw(rng, 2, 0.5, comp["savings_nonlinked"])]
        credit_cp = ["salary"] + [f"client{k}" for k in zipf_draw(rng, 5, 1.0, 2)] + \
                    [f"refund{k}" for k in zipf_draw(rng, 10, 1.0, 3)] + ["interest"] + [f"person{k}" for k in zipf_draw(rng, 15, 1.0, 5)]
        rows += [(mth, "credits", c) for c in credit_cp]
    df = pd.DataFrame(rows, columns=["month", "group", "cp"])
    first = df[df.month < months]
    T_BATCH, T_LINE, T_PAIR, T_TAX = 20, 2, 30, 45     # seconds (E5 assumptions)
    dec, secs = 0, 0
    detail = {}
    for g, sub in first.groupby("group"):
        if g == "own_pair":
            d, s = len(sub), len(sub) * T_PAIR
        elif g == "credits":
            counts = sub.cp.value_counts()
            d = len(counts) + int((counts > 1).sum())          # first credit per payer individually + one batch for the rest
            s = len(counts) * T_TAX + int((counts > 1).sum()) * T_BATCH + int((counts - 1).sum()) * T_LINE
        else:
            counts = sub.cp.value_counts()
            d, s = len(counts), len(counts) * T_BATCH + len(sub) * T_LINE
        detail[g] = (2 * len(sub) if g == "own_pair" else len(sub), d, s)
        dec += d
        secs += s
    nlines = len(first) + int((first.group == "own_pair").sum())   # each pair is two statement lines
    print(f"first batch ({months} months): {nlines:,} lines; {dec} review decisions; about {secs / 60:.0f} minutes "
          f"({secs / 60 / 20:.1f} twenty-minute sessions)")
    for g, (n, d, s) in detail.items():
        print(f"   {g:18s} lines {n:4d}  decisions {d:3d}  minutes {s / 60:5.1f}")
    # month 7 under two readings of C4 item 3 (precision stratum for counterparty memory)
    hist = first.groupby(["group", "cp"]).size()
    m7 = df[df.month == months]
    pairs_hist = int((first.group == "own_pair").sum())
    for reading in ("per-counterparty stratum", "pooled producer stratum"):
        d7, s7_, auto = 0, 0, 0
        # transfer matching is one pooled rule: 5 same-currency pairs may auto-apply once the rule has >= n_min
        # confirmations; the 3 cross-currency pairs need a shared reference or provider ID (C4 item 5) -> review
        n_pairs = int((m7.group == "own_pair").sum())
        same_ccy = 5 if pairs_hist >= n_min else 0
        auto += 2 * same_ccy
        d7 += n_pairs - same_ccy
        s7_ += (n_pairs - same_ccy) * T_PAIR
        for g, sub in m7[m7.group != "own_pair"].groupby("group"):
            for cp, n in sub.cp.value_counts().items():
                h = hist.get((g, cp), 0)
                if g == "credits":
                    mature = False   # no credit stream reaches n_min in six months; first items are tax-weighted
                elif g == "levies_fees":
                    mature = h >= n_min
                else:
                    mature = (h >= n_min) if reading.startswith("per") else (h > 0)
                if mature:
                    auto += n
                    continue
                d7 += 1
                s7_ += (T_TAX if (g == "credits" and h == 0) else T_BATCH) + n * T_LINE
        total = len(m7) + n_pairs
        print(f"month 7, {reading}: {total} lines; auto-applied {auto}; {d7} decisions; about {s7_ / 60:.0f} minutes")


# ---------------------------------------------------------------- 9 contrast
def lum(hexs):
    c = [int(hexs[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def shift(hexs, toward, t):
    c = [int(hexs[i:i + 2], 16) for i in (1, 3, 5)]
    tgt = 0 if toward == "black" else 255
    return "#" + "".join(f"{round(v + (tgt - v) * t):02X}" for v in c)


def fit(hexs, bg, target):
    toward = "black" if lum(bg) > 0.5 else "white"
    for i in range(0, 101):
        h = shift(hexs, toward, i / 100)
        if ratio(h, bg) >= target:
            return h, ratio(h, bg)
    return None, None


def s9():
    print("\n=== 9 Colour contrast (WCAG 2.2: 4.5:1 text, 3:1 marks/boundaries) ===")
    WHITE, DARK = "#FFFFFF", "#121212"
    tokens = {"positive blue": "#0072B2", "negative vermilion": "#D55E00", "reddish purple": "#CC79A7",
              "orange (ageing amber)": "#E69F00", "sky blue": "#56B4E9", "bluish green": "#009E73", "grey 767676": "#767676"}
    for name, h in tokens.items():
        print(f"{name:22s} {h}: on white {ratio(h, WHITE):.2f}:1; on #121212 {ratio(h, DARK):.2f}:1")
    print("derived text variants (mix toward black on white / toward white on dark until >= 4.5:1):")
    for name, h in tokens.items():
        lt, lr = fit(h, WHITE, 4.5)
        dt, dr = fit(h, DARK, 4.5)
        print(f"   {name:22s} light-theme text {lt} ({lr:.2f}:1); dark-theme text {dt} ({dr:.2f}:1)")
    for fill in ("#E69F00", "#CC79A7", "#56B4E9"):
        print(f"black text on chip fill {fill}: {ratio('#000000', fill):.2f}:1")


if __name__ == "__main__":
    s1(); s2(); s3(); s4(); s5(); s6(); s7(); s8(); s9()
