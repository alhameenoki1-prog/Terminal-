"""Document 5b v0.2 §4.5 -- performance-measurement coding contract and golden ledger (R05b M6).

Standard library only (fractions, decimal, datetime); run with python3 -I.
Implements the reference functions of the contract in §4.5 and evaluates 12 golden cases:
G1-G10 ledger cases (TWR, Modified Dietz, MWR/IRR) and G11-G12 currency cases.
All money is exact (Fraction). IRR is solved with Decimal at 40 significant digits.
"""
from datetime import date, timedelta
from decimal import Decimal as D, getcontext
from fractions import Fraction as F

getcontext().prec = 40
LARGE_FLOW = F(1, 10)       # E5: a flow >= 10% of value at the time requires a valuation (GIPS 2.A.23c: firm-defined)
MD_FLOOR = F(5, 100)        # E5: Modified Dietz "not meaningful" if |denominator| < 5% of gross capital employed

def pct(x, dp=2):
    return "n/a" if x is None else f"{float(x) * 100:+.{dp}f}%"

# ---------------------------------------------------------------- reference functions
def twr_daily(values, flows, timing="SOD"):
    """values: {date: V_d} closing values for every valuation date incl. the start date s (first key).
    flows: {date: F_d} net external flow (inflow +). SOD: the flow is in P from the start of d and earns day d's return;
    EOD: the flow happens after the close of d. Returns the cumulative TWR (exact Fraction)."""
    ds = sorted(values); g = F(1)
    for prev, d in zip(ds, ds[1:]):
        Fd = flows.get(d, F(0))
        if timing == "SOD": r = values[d] / (values[prev] + Fd) - 1
        else:               r = (values[d] - Fd) / values[prev] - 1
        g *= 1 + r
    return g - 1

def exposure_days(s, e, d, timing):
    return (e - d).days + (1 if timing == "SOD" else 0)

def modified_dietz(bmv, emv, flows, s, e, timing="SOD"):
    """flows: list of (date, amount). W_i = exposed days / CD, CD = (e - s).days (calendar days, Actual).
    Returns (return or None, status)."""
    CD = (e - s).days
    den = bmv + sum(F(exposure_days(s, e, d, timing), CD) * a for d, a in flows)
    gross = bmv + sum(max(a, F(0)) for d, a in flows)
    if den <= 0 or abs(den) < MD_FLOOR * gross:
        return None, f"not meaningful (denominator {float(den):,.2f} vs gross capital {float(gross):,.2f})"
    return (emv - bmv - sum(a for _, a in flows)) / den, "ok"

def large_flows(bmv, flows):
    out, v = [], bmv
    for d, a in sorted(flows):
        if v > 0 and abs(a) >= LARGE_FLOW * v: out.append(d)
        v += a
    return out

def irr(bmv, emv, flows, s, e, timing="SOD"):
    """Annual effective r solving BMV(1+r)^(CD/365) + sum F_i (1+r)^(exp_i/365) = EMV (Actual/365 Fixed).
    Scans (1+r) on a log grid over [0.01, 101], bisects every sign change; returns (roots, status)."""
    CD = (e - s).days
    terms = [(D(bmv.numerator) / D(bmv.denominator), D(CD) / 365)] + \
            [(D(a.numerator) / D(a.denominator), D(exposure_days(s, e, d, timing)) / 365) for d, a in flows]
    EMV = D(emv.numerator) / D(emv.denominator)
    def f(u): return sum(c * (u ** t) for c, t in terms if c != 0) - EMV
    grid = [D("0.01") * (D(10100) ** (D(i) / 4000)) for i in range(4001)]
    roots = []
    for a, b in zip(grid, grid[1:]):
        fa, fb = f(a), f(b)
        if fa == 0: roots.append(a - 1)
        elif fa * fb < 0:
            for _ in range(150):
                m = (a + b) / 2
                if f(a) * f(m) <= 0: b = m
                else: a = m
            roots.append((a + b) / 2 - 1)
    if len(roots) == 1: return roots, "ok"
    return roots, ("no root" if not roots else f"{len(roots)} roots: MWR not uniquely defined")

def period_or_annual(r_ann, CD):
    """GIPS 2020 2.A.12: returns for periods of less than one year must not be annualised."""
    if r_ann is None: return None, "-"
    if CD < 365: return (1 + r_ann) ** (D(CD) / 365) - 1, "period (not annualised)"
    return r_ann, "annualised"

def show(case, bmv, emv, flows, s, e, timing="SOD", values=None):
    CD = (e - s).days
    md, st = modified_dietz(bmv, emv, flows, s, e, timing)
    roots, ist = irr(bmv, emv, flows, s, e, timing)
    mwr, lab = period_or_annual(roots[0] if ist == "ok" else None, CD)
    tw = twr_daily(values, dict(flows), timing) if values else None
    lf = large_flows(bmv, flows)
    print(f"{case}: CD={CD} {timing} | TWR {pct(tw)} | MD {pct(md) if md is not None else st} | "
          f"MWR {pct(mwr) if mwr is not None else ist} [{lab}]" + (f" | large flow(s) on {', '.join(map(str, lf))}" if lf else ""))
    if ist != "ok" and roots: print(f"      roots found (annual): {', '.join(pct(r) for r in roots)}")
    return tw, md, mwr

def path(s, n_days, start_value, daily, flow_on=None, flow=F(0), timing="SOD"):
    """Builds daily closing values: V_d = (V_{d-1} + F_d) * (1 + r_d) under SOD; (V_{d-1}(1+r_d)) + F_d under EOD."""
    vals, v = {s: start_value}, start_value
    for i in range(1, n_days + 1):
        d = s + timedelta(days=i); r = daily(i)
        f_ = flow if d == flow_on else F(0)
        v = (v + f_) * (1 + r) if timing == "SOD" else v * (1 + r) + f_
        vals[d] = v
    return vals

s = date(2026, 1, 31)
print("=== Golden ledger (synthetic; calendar days; all values in the reporting currency) ===")
# G1 no flows: TWR = MD = MWR
v = path(s, 28, F(1000), lambda i: F(1, 200) if i % 2 else F(-1, 400)); e = max(v)
show("G1 no external flow", F(1000), v[e], [], s, e, values=v)
# G2 contribution SOD, TWR and MWR of opposite sign: +10% to day 15, then 100 in at start of day 16, then -8%
s2, e2 = date(2026, 3, 1), date(2026, 4, 1)
dn = F(92, 100)
def r2(i): return (F(11, 10) - 1) if i == 15 else ((dn - 1) if i == 31 else F(0))
fd = s2 + timedelta(days=16)
v2 = path(s2, 31, F(100), r2, fd, F(100))
show("G2 inflow SOD, signs differ", F(100), v2[e2], [(fd, F(100))], s2, e2, values=v2)
# G3 identical economics booked EOD on day 15: must equal G2 exactly
fd3 = s2 + timedelta(days=15)
v3 = path(s2, 31, F(100), r2, fd3, F(100), timing="EOD")
t3, m3, w3 = show("G3 same flow booked EOD day 15", F(100), v3[e2], [(fd3, F(100))], s2, e2, timing="EOD", values=v3)
# G4 statements only (no daily values): whole-period MD vs MD split at the large flow and chain-linked
md_whole, _ = modified_dietz(F(100), v2[e2], [(fd, F(100))], s2, e2)
v_at = v2[fd - timedelta(days=1)]           # valuation obtained at the close before the SOD flow
r_a, _ = modified_dietz(F(100), v_at, [], s2, fd - timedelta(days=1))
r_b, _ = modified_dietz(v_at, v2[e2], [(fd, F(100))], fd - timedelta(days=1), e2)
print(f"G4 statements only: MD whole period {pct(md_whole)} (large flow -> approximate) | split at the flow and linked "
      f"{pct((1 + r_a) * (1 + r_b) - 1)} (= TWR of G2)")
# G5 withdrawal
s5, e5 = date(2026, 5, 31), date(2026, 6, 30)
fd5 = s5 + timedelta(days=11)
v5 = path(s5, 30, F(1000), lambda i: F(1, 100) if i <= 10 else F(-1, 200), fd5, F(-400))
show("G5 withdrawal 400 SOD day 11", F(1000), v5[e5], [(fd5, F(-400))], s5, e5, values=v5)
# G6 dividend: kept inside P (not an external flow) vs paid to a bank account outside P (income + outflow, same date)
s6, e6 = date(2026, 6, 30), date(2026, 7, 31); dd6 = s6 + timedelta(days=10)
v6 = {s6: F(1000)}
for i in range(1, 32):
    d = s6 + timedelta(days=i); v6[d] = F(1020) if d >= dd6 else F(1000)       # price flat; dividend 20 credited as cash
v6b = {d: (x - 20 if d >= dd6 else x) for d, x in v6.items()}                  # dividend paid out of P
show("G6a dividend kept in P", F(1000), v6[e6], [], s6, e6, values=v6)
t6b = twr_daily(v6b, {}, "SOD")                                                 # naive: payout treated as a loss
fl6 = {dd6: F(-20)}
g = F(1); ds = sorted(v6b)
for p_, d in zip(ds, ds[1:]):                                                  # EOD outflow on the payment date
    g *= (v6b[d] - fl6.get(d, 0)) / v6b[p_]
md6, _ = modified_dietz(F(1000), v6b[e6], [(dd6, F(-20))], s6, e6, "EOD")
print(f"G6b dividend paid outside P: TWR with payout as external outflow (EOD) {pct(g - 1)} | if the payout is missed {pct(t6b)} "
      f"| MD {pct(md6)}")
# G7 fees: net vs gross (advisory fee 5 charged inside P on day 20; gross view treats it as an external outflow)
s7, e7 = date(2026, 8, 31), date(2026, 9, 30); fd7 = s7 + timedelta(days=20)
v7 = path(s7, 30, F(1000), lambda i: F(1, 1000), None)
v7n = {d: (x - 5 * F(1001, 1000) ** max(0, (d - fd7).days) if d >= fd7 else x) for d, x in v7.items()}
net = twr_daily(v7n, {}, "SOD")
gross = F(1); ds = sorted(v7n)
for p_, d in zip(ds, ds[1:]): gross *= (v7n[d] + (5 if d == fd7 else 0)) / v7n[p_]
print(f"G7 fee 5 on day 20: net-of-fees TWR {pct(net, 3)} | gross-of-fees TWR {pct(gross - 1, 3)} (transaction costs are never added back)")
# G8 inception: BMV = 0, first deposit at SOD of day 1
s8, e8 = date(2026, 9, 30), date(2026, 10, 31); fd8 = s8 + timedelta(days=1)
v8 = path(s8, 31, F(0), lambda i: F(1, 500), fd8, F(5000))
show("G8 inception (BMV 0)", F(0), v8[e8], [(fd8, F(5000))], s8, e8, values=v8)
# G9 near-zero denominator: withdraw 990 of 1000 at SOD of day 2, then the residual doubles
s9, e9 = date(2026, 1, 31), date(2026, 3, 2); fd9 = s9 + timedelta(days=2)
v9 = path(s9, 30, F(1000), lambda i: F(1) if i == 10 else F(0), fd9, F(-990))
show("G9 withdraw 99% then +100%", F(1000), v9[e9], [(fd9, F(-990))], s9, e9, values=v9)
# G10 multiple IRR roots over two years: BMV 100; 230 withdrawn after one year (value goes negative, e.g. a margin loan
# inside P); 132 paid in at the end (EOD); EMV 0. f(u) = 100u^2 - 230u + 132 = 0 -> (1+r) = 1.1 or 1.2
s10, e10 = date(2024, 1, 1), date(2025, 12, 31)
fd10 = e10 - timedelta(days=365)                                               # exposed 365 days under EOD
print("G10 sign-changing flows over 730 days (EOD):", end=" ")
roots, st = irr(F(100), F(0), [(fd10, F(-230)), (e10, F(132))], s10, e10, "EOD")
print(st, "| roots", ", ".join(pct(r) for r in roots), "| displayed: no MWR; TWR/MD shown with a badge")
print(f"G2 annualised by mistake would read {pct((1 + D(w3 if w3 is not None else 0)) ** (D(365) / 31) - 1)} (forbidden, GIPS 2.A.12)")

print("\n=== Currency decomposition (position level, exact) ===")
# G11 NGN position, USD base, 3 days; rates NGN per USD 1500, 1500, 2100, 2100; local returns +2%, +1%, +3%
rates = [F(1500), F(1500), F(2100), F(2100)]; rl = [F(2, 100), F(1, 100), F(3, 100)]
gl = gx = gb = F(1)
for t in range(3):
    rx = rates[t] / rates[t + 1] - 1                     # x = USD per NGN; R_X = x(t+1)/x(t) - 1
    rb = (1 + rl[t]) * (1 + rx) - 1
    assert rb == rl[t] + rx + rl[t] * rx
    gl *= 1 + rl[t]; gx *= 1 + rx; gb *= 1 + rb
RL, RX, RB = gl - 1, gx - 1, gb - 1
print(f"G11 cumulative: local {pct(RL)} currency {pct(RX)} cross {pct(RB - RL - RX)} = base {pct(RB)}; "
      f"identity exact: {RB == RL + RX + RL * RX}")
# G12 Karnosky-Singer split of the currency return (Phase 2): forward premium from interest differential, then surprise
iN, iU, days = F(20, 100), F(4, 100), 3
fp = (1 + iU * F(days, 365)) / (1 + iN * F(days, 365)) - 1
surprise = (1 + RX) / (1 + fp) - 1
print(f"G12 currency return {pct(RX, 3)} = forward premium {pct(fp, 4)} (i_NGN 20%, i_USD 4%, simple, {days} days) "
      f"x surprise {pct(surprise, 3)}; exact: {(1 + fp) * (1 + surprise) == 1 + RX}")
