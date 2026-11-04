#!/usr/bin/env python3
"""Document 5a v0.2 worked examples (ALL INPUTS SYNTHETIC unless marked as a sourced parameter).

Reproduces every number in Doc 5a §4.4 (cost-of-equity routes) and §4.11 Examples 1-3.
Run:  python3 -I research/scripts/doc05a_worked_examples.py

Standard library only (decimal, datetime). It needs no third-party package and imports none.

Consistency pass 2026-11-04 (revision-log V-031): fresh_5c() now implements Doc 5c v0.2 §4.3.2 (its fallback
day counts, used while no registry filing deadline or calendar record exists). v0.1's thresholds are withdrawn.

Sourced parameters (checked 2026-11-04):
  * Damodaran ctrypremJuly26.xlsx, sheet "ERPs by country" (re-downloaded and parsed 2026-11-04):
    mature ERP 4.20%; multiplier 1.5544955; Nigeria B3 rating default spread 5.17478%,
    rating CRP 8.04418%, rating total ERP 12.24418%; sovereign CDS net of Swiss CDS 3.26%,
    CDS CRP 5.06766%, CDS total ERP 9.26766%; US Aa1 default spread 0.21864%.
  * CBN Guidelines on Regulatory Capital (Sept 2021), Table 2, paras 30, 82, 94, 98, Appendix 2
    (downloaded and read 2026-11-04).
Everything else (bank financials, yields, inflation scenarios, household figures) is synthetic.
"""
import sys
from datetime import date, timedelta
from decimal import Decimal as D, ROUND_HALF_EVEN, getcontext

if sys.version_info < (3, 9):
    raise SystemExit("Python 3.9+ required")
getcontext().prec = 34


def r(x, q="0.01"):
    return x.quantize(D(q), rounding=ROUND_HALF_EVEN)


def pct(x, q="0.01"):
    return f"{r(x * 100, q)}%"


AS_OF = date(2026, 11, 4)

# --------------------------------------------------------------------------------------------
# 1. Freshness: Doc 5c v0.2 §4.3.2 thresholds (Doc 5c governs data status; C3 governs the vocabulary;
#    computed at read time). Fundamentals use 5c's fallback day counts because no NGX filing deadline is
#    registered yet (synthetic example).
# --------------------------------------------------------------------------------------------
def busdays(d0, d1):
    n, d = 0, d0
    while d < d1:
        d += timedelta(days=1)
        if d.weekday() < 5:
            n += 1
    return n


def fresh_5c(kind, as_of_date, now=AS_OF):
    if kind == "eod_price":  # 5c: fresh <= 1 trading day; ageing 2; stale 3-5; expired > 5
        n = busdays(as_of_date, now)  # holiday calendar omitted (synthetic)
        return "fresh" if n <= 1 else "ageing" if n <= 2 else "stale" if n <= 5 else "expired"
    days = (now - as_of_date).days
    if kind == "quarterly":  # 5c interim fallback: ageing > 45 days after period end, stale > 120, expired > 200
        return "fresh" if days <= 45 else "ageing" if days <= 120 else "stale" if days <= 200 else "expired"
    if kind == "annual":  # 5c annual fallback: ageing > 120, stale > 270, expired > 450
        return "fresh" if days <= 120 else "ageing" if days <= 270 else "stale" if days <= 450 else "expired"
    if kind == "semiannual_edition":  # 5c country-risk edition row (from 5a's proposal): fresh <= 7 months
        return "fresh" if days <= 213 else "ageing" if days <= 396 else "stale"
    raise ValueError(kind)


def fresh_5a_v01(kind, as_of_date, now=AS_OF):
    """Doc 5a v0.1 §4.10 table (withdrawn in v0.2), used only to show the v0.1 example failed its own gate."""
    days = (now - as_of_date).days
    if kind == "annual":
        return "fresh" if days <= 120 else "ageing" if days < 270 else "stale"
    if kind == "quarterly":
        return "fresh" if days <= 45 else "ageing" if days < 120 else "stale"
    raise ValueError(kind)


ORDER = ["fresh", "ageing", "stale", "expired"]


def worst(states):
    return max(states, key=ORDER.index)


print("== Freshness of the v0.1 Example 1 inputs on 2026-11-04 ==")
fy25, h126 = date(2025, 12, 31), date(2026, 6, 30)
print(f"FY2025 annual inputs: age {(AS_OF - fy25).days} days -> v0.1 5a table: {fresh_5a_v01('annual', fy25)}; "
      f"5c v0.2 table: {fresh_5c('annual', fy25)}")
print(f"H1-2026 interim inputs: age {(AS_OF - h126).days} days -> v0.1 5a table: {fresh_5a_v01('quarterly', h126)}; "
      f"5c v0.2 table: {fresh_5c('quarterly', h126)}")
print("v0.1 header said 'current' and 'all inputs V2+' while carrying a V1 row -> gate failure (R05a B1)")

# --------------------------------------------------------------------------------------------
# 2. Cost of equity: rating vs CDS basis, USD route and Damodaran local-currency (NGN) route
# --------------------------------------------------------------------------------------------
MATURE_ERP = D("0.042")
MULT = D("1.5544955262589411")
NG = {
    "rating": {"spread": D("0.051747824426647708"), "crp": D("0.080441761564857009"), "erp": D("0.122441761564857")},
    "cds": {"spread": D("0.0326"), "crp": D("0.050676554156041477"), "erp": D("0.09267655415604148")},
}
US_DEFAULT_SPREAD = D("0.0021863536781947081")
UST_10Y = D("0.0442")       # synthetic US 10-year Treasury yield
FGN_10Y = D("0.18")         # synthetic FGN 10-year yield
BETA = D("1")
PI_USD = D("0.025")         # synthetic
PI_NGN = [D("0.12"), D("0.15"), D("0.18")]  # house scenarios low / base / high (synthetic)

print("\n== Damodaran July 2026 internal-consistency check (single-source sampling rule, C3.3) ==")
for b, v in NG.items():
    ok_erp = abs(MATURE_ERP + v["crp"] - v["erp"]) < D("1e-12")
    ok_crp = abs(v["spread"] * MULT - v["crp"]) < D("1e-6")
    print(f"{b:6s}: spread {pct(v['spread'])} x {r(MULT, '0.0001')} = CRP {pct(v['crp'])} "
          f"(recomputed ok={ok_crp}); mature {pct(MATURE_ERP)} + CRP = total {pct(v['erp'])} (ok={ok_erp})")

rf_usd = UST_10Y - US_DEFAULT_SPREAD
print(f"\nUSD risk-free = Treasury {pct(UST_10Y)} - US Aa1 default spread {pct(US_DEFAULT_SPREAD, '0.001')} = {pct(rf_usd)}")

routes = []  # (label, basis, pi, k)
for b, v in NG.items():
    k_usd = rf_usd + BETA * v["erp"]
    for pi in PI_NGN:
        k = (1 + k_usd) * (1 + pi) / (1 + PI_USD) - 1
        routes.append((f"USD route, {b}, NGN inflation {pct(pi, '1')}", b, pi, k))
    rf_ngn = FGN_10Y - v["spread"]
    k_ngn = rf_ngn + BETA * v["erp"]
    implied_pi = (1 + rf_ngn) / (1 + rf_usd) * (1 + PI_USD) - 1
    routes.append((f"NGN route, {b} (local rf {pct(rf_ngn)})", b, implied_pi, k_ngn))
    print(f"{b:6s}: USD k = {pct(k_usd)}; NGN local rf = {pct(FGN_10Y)} - {pct(v['spread'])} = {pct(rf_ngn)}; "
          f"NGN-route k = {pct(k_ngn)}; risk-free parity implies NGN inflation {pct(implied_pi)}")
print("v0.1 NGN formula (FGN + beta x mature ERP x 1.55) =", pct(FGN_10Y + BETA * MATURE_ERP * MULT),
      "-> not Damodaran's method; withdrawn")
for lab, b, pi, k in routes:
    print(f"   {lab:55s} k = {pct(k)}")

# Mechanical grid: overall min, CDS base, rating base, overall max. No hand-set column.
usd_only = [x for x in routes if x[0].startswith("USD")]
lo = min(routes, key=lambda x: x[3])
hi = max(routes, key=lambda x: x[3])
cds_base = [x for x in usd_only if x[1] == "cds" and x[2] == D("0.15")][0]
rat_base = [x for x in usd_only if x[1] == "rating" and x[2] == D("0.15")][0]
# each column carries the inflation scenario of the route that produced it; NGN-route columns use the
# risk-free-parity implied inflation
GRID = [("low", lo), ("CDS base", cds_base), ("rating base", rat_base), ("high", hi)]
print("\nMechanical cost-of-equity grid (columns):")
for name, (lab, b, pi, k) in GRID:
    print(f"   {name:11s} k = {pct(k)}  from: {lab}; growth uses inflation {pct(pi)}")
print("v0.1 low column 23% matched no route (it equals the MPR) -> withdrawn")

# --------------------------------------------------------------------------------------------
# 3. Example 1 rebuilt: Bank X, trailing twelve months (TTM) to 2026-09-30, Q3-2026 interim
# --------------------------------------------------------------------------------------------
print("\n== Example 1 (rebuilt): Bank X, TTM to 2026-09-30 ==")
price, price_date = D("60.00"), date(2026, 11, 3)
q3_end = date(2026, 9, 30)
shares_end = D("30.0")             # bn, 2026-09-30
shares_wavg_ttm = D("30.0")        # bn; rights issue completed 2025-06 (before the TTM window)
pbt, tax = D("600"), D("180")      # NGN bn, TTM
pat = pbt - tax
fx_gain_pre = D("150")             # NGN bn, FX revaluation gains in TTM (pre-tax)
fx_tax_rate_note = D("0.30")       # tax attributed to the FX gain in the tax note (synthetic)
eq_open, eq_close = D("1450"), D("1650")  # 2025-09-30 and 2026-09-30
avg_eq = (eq_open + eq_close) / 2
dps_ttm = D("4.00")                # FY2025 final 3.00 (paid 2026-04-10) + 2026 interim 1.00 (paid 2026-10-15)
gross_loans, stage3, stage3_ecl = D("3000"), D("150"), D("120")
prudential_npl = D("0.046")        # CBN prudential-guidelines NPL ratio, Pillar 3 (synthetic)
cet1, t1, car, lev = D("0.175"), D("0.180"), D("0.220"), D("0.075")
stat_reserve = D("63")             # TTM transfer to statutory reserve, from statement of changes in equity (synthetic)
rrr_adj = D("0")                   # regulatory risk reserve adjustment (synthetic)

checks = []
# period alignment: every input carries a period tag; flows must be TTM ending q3_end, stocks dated q3_end
# (or the TTM opening date for averages); the price is the only market input and is dated separately.
PERIOD = {"pbt": ("flow", "TTM", q3_end), "tax": ("flow", "TTM", q3_end), "fx_gain": ("flow", "TTM", q3_end),
          "dps": ("flow", "TTM", q3_end), "shares_wavg": ("flow", "TTM", q3_end),
          "equity_close": ("stock", "point", q3_end), "equity_open": ("stock", "point", date(2025, 9, 30)),
          "shares_end": ("stock", "point", q3_end), "loans": ("stock", "point", q3_end),
          "stage3": ("stock", "point", q3_end), "capital_ratios": ("stock", "point", q3_end)}
aligned = all((kind == "flow" and basis == "TTM" and d == q3_end) or
              (kind == "stock" and d in (q3_end, date(2025, 9, 30))) for kind, basis, d in PERIOD.values())
checks.append(("period alignment (flows TTM to 2026-09-30; stocks at 2026-09-30 or TTM opening)", aligned))
v01 = {"pat": date(2025, 12, 31), "equity": date(2025, 12, 31), "shares": date(2026, 6, 30), "loans": date(2026, 6, 30)}
print("v0.1 period-alignment test would have:", "PASSED" if len(set(v01.values())) == 1 else
      f"FAILED (period ends {sorted(set(str(x) for x in v01.values()))})")
checks.append(("share count: weighted TTM == period-end (no issue in window)", shares_wavg_ttm == shares_end))

eps = pat / shares_wavg_ttm
bvps = eq_close / shares_end
fx_after_tax = fx_gain_pre * (1 - fx_tax_rate_note)
pat_norm = pat - fx_after_tax
pat_norm_untaxed = pat - fx_gain_pre
roe_rep = pat / avg_eq
roe_norm = pat_norm / avg_eq
roe_norm_untaxed = pat_norm_untaxed / avg_eq
print(f"PAT = PBT {pbt} - tax {tax} = {pat}bn; EPS {r(eps)}; BVPS {r(bvps)}; P/E {r(price / eps, '0.01')}x; "
      f"P/B {r(price / bvps, '0.001')}x; dividend yield {pct(dps_ttm / price)}")
print(f"FX gains: {pct(fx_gain_pre / pbt)} of PBT (pre-tax / pre-tax); after-tax {r(fx_after_tax)}bn = "
      f"{pct(fx_after_tax / pat)} of PAT; v0.1 error was 110/400 'of PBT' (pre-tax gain over post-tax profit)")
print(f"ROE reported {pct(roe_rep)}; normalised (tax-effected at note rate {pct(fx_tax_rate_note, '1')}) {pct(roe_norm)}; "
      f"sensitivity if FX gain untaxed {pct(roe_norm_untaxed)}")
print(f"Payout: {pct(dps_ttm / eps)} of reported EPS; {pct(dps_ttm / (pat_norm / shares_wavg_ttm))} of normalised EPS")
print(f"Stage 3 ratio (IFRS 9) {pct(stage3 / gross_loans)}; coverage {pct(stage3_ecl / stage3)}; "
      f"prudential NPL (CBN definition, stored separately) {pct(prudential_npl)}")

# Capital floors (CBN Guidelines on Regulatory Capital 2021, Table 2 + paras 30, 82, 94, 98)
floors = {
    "national": {"cet1": D("0.07"), "t1": D("0.075"), "car": D("0.10"), "ccb": D("0.01"), "hla": D("0"), "lev": D("0.04")},
    "international": {"cet1": D("0.105"), "t1": D("0.1125"), "car": D("0.15"), "ccb": D("0.01"), "hla": D("0"), "lev": D("0.04")},
    "dsib": {"cet1": D("0.105"), "t1": D("0.1125"), "car": D("0.15"), "ccb": D("0.01"), "hla": D("0.01"), "lev": D("0.05")},
}
print("\nEffective floors (minimum + CCB1 1.0% + HLA 1.0% for D-SIBs; CCB2 countercyclical buffer = 0 until set by CBN):")
for cat, f in floors.items():
    print(f"   {cat:13s} CET1 {pct(f['cet1'] + f['ccb'] + f['hla'])}  T1 {pct(f['t1'] + f['ccb'] + f['hla'])}  "
          f"CAR {pct(f['car'] + f['ccb'] + f['hla'])}  leverage {pct(f['lev'], '0.1')}")
f = floors["dsib"]
eff = {"cet1": f["cet1"] + f["ccb"] + f["hla"], "t1": f["t1"] + f["ccb"] + f["hla"], "car": f["car"] + f["ccb"] + f["hla"]}
print(f"Bank X (international licence, D-SIB): CET1 {pct(cet1)} vs {pct(eff['cet1'])} (headroom {pct(cet1 - eff['cet1'])}); "
      f"T1 {pct(t1)} vs {pct(eff['t1'])}; CAR {pct(car)} vs {pct(eff['car'])} (headroom {pct(car - eff['car'])}); "
      f"leverage {pct(lev)} vs {pct(f['lev'])}")

# Dividend capacity: CBN Appendix 2 (D-SIB, scenario 4: NPL < 5%, CET1 > 12.5%) x Composite Risk Rating
PAYOUT_DSIB_S4_TOP = {"High": D("0"), "Above Average": D("0.25"), "Moderate": D("0.75"), "Low": D("1.00")}
adj_profit = max(pat - stat_reserve - rrr_adj, D("0"))
# CBN Sept 2023 circular (press-reported): FX revaluation gains set aside, not to fund dividends
adj_profit_ex_fx = max(adj_profit - fx_after_tax, D("0"))
print(f"\nAdjusted profit (App. 2: PAT - statutory reserve - RRR) = {adj_profit}bn; less after-tax FX revaluation gains "
      f"(Sept 2023 circular, E3) = {adj_profit_ex_fx}bn")
print("Composite Risk Rating is a supervisory rating that is not published -> cap shown for every value:")
for crr, po in PAYOUT_DSIB_S4_TOP.items():
    cap = adj_profit_ex_fx * po
    print(f"   CRR {crr:13s} max payout {pct(po, '1'):5s} -> max distributable {r(cap)}bn = DPS cap {r(cap / shares_end)}; "
          f"TTM DPS {dps_ttm} within cap: {dps_ttm * shares_end <= cap}")
print("Forbearance (CBN circular 13 Jun 2025, press-reported): if Bank X is under credit or SOL forbearance, cap = 0")

# Valuation grid, consistent growth (g = (1 + g_real)(1 + pi) - 1 with g_real = 0, stated)
G_REAL = D("0")
print("\nJustified P/B = (ROE - g)/(k - g); DDM at declared DPS; sustainable-growth test g <= ROE x (1 - payout)")
rows = {"reported": roe_rep, "normalised": roe_norm, "normalised, FX untaxed": roe_norm_untaxed}
eps_norm = pat_norm / shares_wavg_ttm
for name, (lab, b, pi, k) in GRID:
    g = (1 + G_REAL) * (1 + pi) - 1
    line = [f"{name:11s} k {pct(k, '0.1')} g {pct(g, '0.1')}:"]
    for rn, roe in rows.items():
        if roe <= g:
            line.append(f"{rn} n/a (g >= ROE needs payout < 0, i.e. new equity)")
            continue
        pb = (roe - g) / (k - g)
        line.append(f"{rn} P/B {r(pb, '0.01')}x value {r(pb * bvps, '0.1')} (implied payout {pct(1 - g / roe, '0.1')})")
    ddm = dps_ttm * (1 + g) / (k - g)
    line.append(f"DDM(DPS {dps_ttm}) {r(ddm, '0.1')}")
    # sustainable growth tests at the declared payout
    for rn, e in (("reported", eps), ("normalised", eps_norm)):
        payout = dps_ttm / e
        roe = roe_rep if rn == "reported" else roe_norm
        g_sust = roe * (1 - payout)
        line.append(f"g_sust({rn}) {pct(g_sust, '0.1')} {'PASS' if g <= g_sust else 'FAIL'}")
    implied_roe = g + (price / bvps) * (k - g)
    line.append(f"price-implied ROE {pct(implied_roe, '0.1')}")
    print("   " + "; ".join(line))
print("Implied payout needed for g at each ROE: 1 - g/ROE, e.g. base g 15%: reported "
      f"{pct(1 - D('0.15') / roe_rep, '0.1')}, normalised {pct(1 - D('0.15') / roe_norm, '0.1')}")

statuses = {
    "price 2026-11-03": fresh_5c("eod_price", price_date),
    "Q3-2026 interim (period end 2026-09-30)": fresh_5c("quarterly", q3_end),
    "Damodaran July 2026 edition": fresh_5c("semiannual_edition", date(2026, 7, 1)),
}
print("\nComputed note freshness:", statuses, "-> worst:", worst(statuses.values()))
for c, ok in checks:
    print(f"quant check: {c}: {'PASS' if ok else 'FAIL'}")

# --------------------------------------------------------------------------------------------
# 4. Example 2: US Company Y DCF grid (unchanged inputs; now TTM to Q3-2026 from 10-Q + 10-K)
# --------------------------------------------------------------------------------------------
print("\n== Example 2: Company Y DCF grid (USD per share) ==")
fcf0, net_cash, sh = D("1200"), D("2000"), D("500")
for w in (D("0.085"), D("0.095"), D("0.10")):
    vals = []
    for g in (D("0.02"), D("0.03")):
        pv, f_ = D("0"), fcf0
        for t in range(1, 6):
            f_ = f_ * D("1.06")
            pv += f_ / (1 + w) ** t
        tv = f_ * (1 + g) / (w - g)
        pv += tv / (1 + w) ** 5
        vals.append(r((pv + net_cash) / sh, "0.1"))
    print(f"   WACC {pct(w, '0.1')}: g=2% {vals[0]}  g=3% {vals[1]}")

# --------------------------------------------------------------------------------------------
# 5. Example 3: goal arithmetic (deterministic required saving; probabilities are C6's job)
# --------------------------------------------------------------------------------------------
print("\n== Example 3: required annual saving to reach USD 100,000 in 5 years ==")
fx_ngn, peg = D("1330"), D("3.6725")   # synthetic NGN/USD; AED peg (registered world fact, candidate until C3.5 snapshot)
income_usd = D("60000000") / fx_ngn
rent_usd = D("120000") / peg
ngn_sav, aed_dep, usd_cash = D("25000000"), D("40000"), D("15000")
other_usd = ngn_sav / fx_ngn + aed_dep / peg
print(f"net income (after PIT, provisional) USD {r(income_usd)}; rent USD {r(rent_usd)} = {pct(rent_usd / income_usd, '0.1')} of income")
print(f"NGN 25m = USD {r(ngn_sav / fx_ngn)}; AED 40,000 = USD {r(aed_dep / peg)}; together USD {r(other_usd)}")


def req_saving(start, target, rate, n=5):
    if rate == 0:
        return (target - start) / n
    gr = (1 + rate) ** n
    return (target - start * gr) * rate / (gr - 1)


for label, start in (("only USD 15,000 counted (NGN and AED earmarked to safety and rent buckets)", usd_cash),
                     ("all liquid assets counted", usd_cash + other_usd)):
    print(f"  {label}:")
    for rate in (D("0"), D("0.02"), D("0.04"), D("0.06")):
        s = req_saving(start, D("100000"), rate)
        print(f"     at {pct(rate, '1')} net: USD {r(s, '1')} per year = {pct(s / income_usd, '0.1')} of income")
s0, s6 = req_saving(usd_cash, D("100000"), D("0")), req_saving(usd_cash, D("100000"), D("0.06"))
print(f"  return assumption 0% -> 6% changes required saving by {pct((s0 - s6) / s0, '0.1')}")
print(f"  rent reserve need AED 120,000 vs AED deposits 40,000 -> shortfall AED {D('120000') - aed_dep}")
print(f"  US estate-tax monitor: USD 100,000 in US-domiciled ETFs > USD 60,000 threshold (Doc 6 F31): {D('100000') > D('60000')}")
