"""Document 5c v0.2 (market data sourcing and validation) -- every number in the revised worked examples.

Reproduces, in order:
  A  entry-time primary-source check on the repository's policy-rate constants (R0, Example C)
  B  NGX personal-MVP cost: 2x2 (local/international x with/without non-display), VAT, sensitivities (Sec. 4.6)
  C  commercial-licence floor recomputed from the 2026 NGX schedule (Sec. 4.6)
  D  founder validation workload under the single-source sampling protocol vs v0.1's "validate every figure"; with the C3.3 v0.2 per-series floor
  E  NGX corporate-action date sequencing (Example A) and the replaced rule 5
  F  stale-close check conditioned on NGX price-group volume thresholds (Sec. 4.3.5)
  G  freshness classification at read time (merged table, Sec. 4.3.2) incl. the "two business days = ageing" case
  H  same-upstream comparison after unit normalisation (kobo/naira, gross/net dividend)

Inputs marked REAL are dated observations from the sources named in Doc 5c Sec. 10; everything else is SYNTHETIC.
Standard library only (decimal, fractions, datetime). Run with:
    python3 -I docs/portfolio-os/research/scripts/doc05c_revision_checks.py
"""
import sys

if sys.version_info < (3, 8):
    raise SystemExit("Python 3.8+ required")

from decimal import Decimal as D, ROUND_HALF_EVEN, getcontext
from datetime import date, timedelta

getcontext().prec = 40


def q(x, places="0.01"):
    return D(x).quantize(D(places), rounding=ROUND_HALF_EVEN)


def fmt(x, places="0.01"):
    return f"{q(x, places):,}"


def bdays_between(d0, d1):
    """Weekdays strictly after d0 up to and including d1 (no holiday calendar: SYNTHETIC simplification)."""
    n, d = 0, d0
    while d < d1:
        d += timedelta(days=1)
        if d.weekday() < 5:
            n += 1
    return n


def add_bdays(d0, n):
    d = d0
    while n > 0:
        d += timedelta(days=1)
        if d.weekday() < 5:
            n -= 1
    return d


# ---------------------------------------------------------------- A  entry-time primary-source check
def part_a():
    print("=== A  Entry-time primary-source check (R0, Example C) ===")
    # REAL: CBN MPC decisions page, fetched 2026-11-04 (S107). (effective date = last day of the meeting, value %)
    cbn = [
        (date(2025, 2, 20), D("27.50")), (date(2025, 5, 20), D("27.50")), (date(2025, 7, 22), D("27.50")),
        (date(2025, 9, 23), D("27.00")), (date(2025, 11, 25), D("27.00")), (date(2026, 2, 24), D("26.50")),
        (date(2026, 5, 20), D("26.50")), (date(2026, 7, 21), D("26.50")), (date(2026, 9, 22), D("23.00")),
    ]
    # REAL: Federal Reserve open-market page, fetched 2026-11-04 (S114). Lower bound of the target range, %.
    fed = [(date(2024, 12, 19), D("4.25")), (date(2025, 9, 18), D("4.00")),
           (date(2025, 10, 30), D("3.75")), (date(2025, 12, 11), D("3.50")), (date(2026, 9, 17), D("3.75"))]
    entered_on = date(2026, 3, 2)   # REAL: git log, commit d9ad9d5 (S110)
    meetings_after = [d for d, _ in cbn if d > entered_on]

    def in_force(series, d):
        return [v for e, v in series if e <= d][-1]

    for name, series, entered, typed_next in (
            ("CBN MPR (countryProfiles.ts)", cbn, D("27.50"), date(2026, 3, 25)),
            ("Fed funds lower bound (ratesData.ts)", fed, D("4.25"), date(2026, 3, 19))):
        prim = in_force(series, entered_on)
        gap_bp = (entered - prim) * 100
        verdict = "PASS" if entered == prim else "BLOCK at entry: V=disputed (value != primary snapshot)"
        last_equal = max((e for e, v in series if v == entered and e <= entered_on), default=None)
        print(f"{name}: entered {entered} on {entered_on}; primary in force {prim}; error {gap_bp:+.0f} bp -> {verdict}")
        if last_equal:
            nxt = [e for e, v in series if e > last_equal and v != entered][0]
            print(f"   the entered value was last true until {nxt - timedelta(days=1)} "
                  f"({(entered_on - nxt).days} days before entry)")
        # v0.1 expiry-only control: fresh until typed next meeting + 7 days
        v01_expiry = typed_next + timedelta(days=7)
        print(f"   v0.1 expiry-only control: typed next meeting {typed_next} -> 'fresh' until {v01_expiry} "
              f"({(v01_expiry - entered_on).days} days of false 'fresh')")
    nxt = meetings_after[0]
    print(f"CBN: typed next meeting 2026-03-25 is a scheduled meeting? {date(2026, 3, 25) in [d for d, _ in cbn]}; "
          f"first meeting after entry per primary record ends {nxt}; calendar-derived expiry_at = {nxt + timedelta(days=7)}")
    today = date(2026, 11, 4)
    print(f"CBN value in force on {today}: {in_force(cbn, today)}; gap of the repo constant today "
          f"{(D('27.50') - in_force(cbn, today)) * 100:+.0f} bp")
    print()


# ---------------------------------------------------------------- B  NGX personal-MVP cost
FX = D("1345.01")      # REAL: Frankfurter v2 USD/NGN, 2026-11-02 (S82); illustrative conversion only
FX_ALT = D("1345.46")  # REAL: Frankfurter v2 USD/NGN, 2026-11-04 (per R05c); sensitivity
VAT = D("0.075")       # REAL: NGX pricelist general note 6.4 "All Fees are exclusive of 7.5% VAT" (S3)

# REAL: NGX API portal (S9) and Schedule 3 pricelist (S3), both re-read 2026-11-04. (local NGN, international USD) per year
EOD = (D(125000), D(1000))
INTERDAY = (D(300000), D(1000))          # "for specified securities": may scale with the number of holdings
ND_MODEL = (D(1250000), D(7500))         # 1.2 "Delayed Data for Financial modelling" (USD column marked professional)
ND_NONTRADE = (D(2500000), D(15000))     # 1.2 "Non-Trading Related activities ... Payable for all types of Non-Display Usage"
API_BAND1 = (D(200000), D(1000))         # 4.2 "API Bandwidth ... for direct connection to The Exchange", Entry band
DIVS = (D(250000), D(1000))              # dividends, specific securities (international label reads "Delayed $1,000")
NEWS_CA = (D(650000), D(2500))


def usd(local_or_intl, amount):
    return amount / FX if local_or_intl == "local" else amount


def ngx_cost(basis, nd=None, interday_sets=1, api=False, optional=False):
    i = 0 if basis == "local" else 1
    items = [EOD[i], INTERDAY[i] * interday_sets]
    if nd is not None:
        items.append(nd[i])
    if api:
        items.append(API_BAND1[i])
    if optional:
        items += [DIVS[i], NEWS_CA[i]]
    return sum(items, D(0))


def part_b():
    print("=== B  NGX personal-MVP cost (Sec. 4.6, V-012) ===")
    print(f"FX for illustration: USD/NGN {FX} (2026-11-02); VAT {VAT * 100}% (NGX note 6.4)")
    print("2x2, core = EOD prices + Interday (one 'specified securities' set); non-display = 'Delayed Data for Financial modelling'")
    rows = []
    for basis in ("local", "international"):
        for nd_label, nd in (("without non-display", None), ("with non-display", ND_MODEL)):
            annual = ngx_cost(basis, nd)
            ccy = "NGN" if basis == "local" else "USD"
            usd_y = usd(basis, annual)
            usd_y_vat = usd_y * (1 + VAT)
            rows.append((basis, nd_label, annual, ccy, usd_y, usd_y_vat))
            print(f"   {basis:13s} {nd_label:20s}: {ccy} {fmt(annual)} /yr = USD {fmt(usd_y)} /yr = USD {fmt(usd_y / 12)} /mo"
                  f" | incl. VAT USD {fmt(usd_y_vat)} /yr = USD {fmt(usd_y_vat / 12)} /mo")
    print("Sensitivities (USD per month, ex-VAT unless stated):")
    for basis in ("local", "international"):
        base = usd(basis, ngx_cost(basis, ND_MODEL)) / 12
        alt_nd = usd(basis, ngx_cost(basis, ND_NONTRADE)) / 12
        api = usd(basis, ngx_cost(basis, ND_MODEL, api=True)) / 12
        five = usd(basis, ngx_cost(basis, ND_MODEL, interday_sets=5)) / 12
        print(f"   {basis:13s}: with ND(modelling) {fmt(base)} | ND line 'Non-Trading' instead {fmt(alt_nd)} | "
              f"+ API Entry band {fmt(api)} | Interday priced per security x5 {fmt(five)}")
    lo = usd("local", ngx_cost("local", ND_MODEL)) / 12
    print(f"   local with ND at FX {FX_ALT}: USD {fmt(ngx_cost('local', ND_MODEL) / FX_ALT / 12)} /mo (vs {fmt(lo)})")
    # MVP total: other layers (USD per month), from Sec. 4.6 table (prices seen 2026-11-02)
    other_lo, other_hi = D(0), D("13.61") + D("30") + D("19.99")   # ADX top tier AED 49.99/3.6725; Tiingo Power; EODHD Historian
    aed_top = D("49.99") / D("3.6725")
    print(f"   ADX top paid tier AED 49.99 = USD {fmt(aed_top)} /mo")
    total_lo = usd("local", ngx_cost("local")) / 12 + other_lo
    total_lo_nd = usd("local", ngx_cost("local", ND_MODEL)) / 12 + other_lo
    total_hi = usd("international", ngx_cost("international", ND_NONTRADE, api=True, optional=True)) * (1 + VAT) / 12 + other_hi
    total_hi_model = usd("international", ngx_cost("international", ND_MODEL, optional=True)) / 12 + other_hi
    print(f"MVP total floor (local, no ND, free secondaries): USD {fmt(total_lo)} /mo")
    print(f"MVP total if personal analytics is non-display (local, ND modelling, free secondaries): USD {fmt(total_lo_nd)} /mo; "
          f"incl. VAT USD {fmt(total_lo_nd * (1 + VAT) - other_lo * VAT)} /mo")
    print(f"MVP total, international, ND modelling, optional NGX dividends+CA, paid US/ADX: USD {fmt(total_hi_model)} /mo")
    print(f"MVP total ceiling (international, ND 'Non-Trading' line, API band, optional feeds, VAT on NGX, paid US/ADX): "
          f"USD {fmt(total_hi)} /mo")
    print(f"v0.1 stated 'USD 26-150 per month'; v0.1's own international core alone = USD "
          f"{fmt(usd('international', ngx_cost('international')) / 12)} /mo")
    # FMDQ (2023 framework, VAT-inclusive, non-member end user): Daily Quotations List EOD + Real-time API (note 9)
    dql, api_rt, api_eod = D(322500), D(537500), D(322500)
    print(f"FMDQ bond closes for Rec 9: Daily Quotations List NGN {fmt(dql)} + API end-user real-time NGN {fmt(api_rt)} "
          f"(note 9: only real-time API carries closing prices) = NGN {fmt(dql + api_rt)} /yr incl. VAT "
          f"= USD {fmt((dql + api_rt) / FX)} at {FX} (FMDQ's own USD column is struck at NGN 500/USD: USD {fmt((dql + api_rt) / 500)})")
    print(f"   if an EOD API sufficed: NGN {fmt(dql + api_eod)} /yr")
    print()


# ---------------------------------------------------------------- C  commercial floor
def part_c():
    print("=== C  Commercial NGX licence floor (Sec. 4.6) ===")
    # REAL: Schedule 3 (S3). local NGN p.a.
    eod_route = {"Website/Mobile EOD display": D(120000), "End of Day Data License": D(1500000),
                 "ND Delayed Data for Financial modelling": D(1250000), "API bandwidth Entry band": D(200000)}
    delayed_route = {"Website/Mobile delayed display": D(250000), "Delayed Data License": D(2000000),
                     "ND Delayed Data for Financial modelling": D(1250000), "API bandwidth Standard band": D(400000)}
    fmdq = D("3359375")   # NAFEM Data EOD distribution licence, FMDQ 2023 framework, VAT-inclusive (S21)
    for name, items in (("EOD route", eod_route), ("delayed route", delayed_route)):
        s = sum(items.values())
        s_nt = s - items["ND Delayed Data for Financial modelling"] + D(2500000)
        print(f"   {name}: NGX NGN {fmt(s)} (ND 'Non-Trading' line instead: {fmt(s_nt)}); + FMDQ NAFEM EOD distribution "
              f"NGN {fmt(fmdq)} = NGN {fmt(s + fmdq)} to {fmt(s_nt + fmdq)} p.a. ex-VAT on NGX = USD {fmt((s + fmdq) / FX)} to {fmt((s_nt + fmdq) / FX)}")
    print()


# ---------------------------------------------------------------- D  validation workload
def part_d():
    print("=== D  Founder validation workload (Sec. 4.3.10; SYNTHETIC holdings count) ===")
    holdings, sessions = 20, 250
    price_figs = holdings * sessions
    sample = D(price_figs) / 20
    band_breaks = D(price_figs) * D("0.02")     # E5 assumption: 2% of figures break a plausibility band
    world = 6 + 12 + 12                         # MPR decisions, CPI releases, other world facts (E5)
    fx_figs = 250
    fx_sample = D(fx_figs) / 20
    minutes = D(3)                              # E5: minutes per check with evidence side by side
    total = sample + band_breaks + world + fx_sample
    print(f"NGX price figures/yr {price_figs}; 1-in-20 sample {sample}; band breaks (2%, E5) {band_breaks}; "
          f"world facts {world}; FX sample {fx_sample}")
    print(f"single-source protocol, pooled 1-in-20 (before the C3.3 v0.2 floor): {q(total, '1')} checks/yr x {minutes} min "
          f"= {fmt(total * minutes / 60, '0.1')} h/yr = {fmt(total * minutes / 60 / 52 * 60, '1')} min/week")
    v01 = price_figs + fx_figs + world
    print(f"v0.1 rule (human-validate every conclusion-driving figure): {v01} checks/yr = {fmt(v01 * minutes / 60, '0.1')} h/yr")

    # contracts v0.2 C3.3 (CC-10): per series per year, at least max(ceil(n/20), min(n, 4)) human checks, n = editions
    def floor_checks(n):
        return max(-(-n // 20), min(n, 4))
    series = [  # (label, number of series, editions per series per year); counts are SYNTHETIC / E5
        ("NGX daily close, per holding", holdings, sessions),
        ("official USD/NGN fixing", 1, fx_figs),
        ("shares outstanding from filings, per holding (quarterly)", holdings, 4),
        ("dividend record, per holding (2 events a year, E5)", holdings, 2),
        ("country-risk edition (semi-annual)", 1, 2),
        ("index membership (semi-annual review, E4)", 1, 2),
    ]
    total2 = D(band_breaks) + world
    print("C3.3 v0.2 sampling floor, per series per year (editions -> human checks):")
    for label, k, n in series:
        c = k * floor_checks(n)
        total2 += c
        print(f"   {label}: {k} x {n} editions -> {k} x {floor_checks(n)} = {c}")
    print(f"   plus band breaks {band_breaks} and world facts {world} (unchanged)")
    print(f"single-source protocol with the floor: {q(total2, '1')} checks/yr x {minutes} min = "
          f"{fmt(total2 * minutes / 60, '0.1')} h/yr = {fmt(total2 * minutes / 60 / 52 * 60, '1')} min/week "
          f"(all checks are the founder's: independence = self, shown 'self-checked')")
    print()


# ---------------------------------------------------------------- E  corporate-action date sequencing
def part_e():
    print("=== E  NGX bonus-issue date sequencing (Example A; SYNTHETIC SYNTH PLC) ===")
    settlement = [(date(2000, 1, 1), 3), (date(2025, 11, 28), 2), (date(2026, 6, 1), 1)]   # 05a F4 (E2 via 05a)

    def cycle(d):
        return [n for e, n in settlement if e <= d][-1]

    qual = date(2026, 10, 30)                   # qualification (closure-of-register) date, SYNTHETIC
    n = cycle(qual)
    # E4 convention: ex-date = qualification date minus (n - 1) business days
    ex = qual
    k = n - 1
    while k > 0:
        ex -= timedelta(days=1)
        if ex.weekday() < 5:
            k -= 1
    for d in (date(2025, 11, 27), date(2025, 11, 28), date(2026, 5, 29), date(2026, 6, 1)):
        print(f"   settlement cycle in force on {d}: T+{cycle(d)}")
    print(f"qualification {qual} under T+{n} -> ex/mark-down date {ex}")
    credit = add_bdays(qual, 25)               # SYNTHETIC: listing and CSCS credit 25 business days later
    gap = bdays_between(ex, credit)
    N = 60                                     # registry parameter, E5
    print(f"new shares listed and credited {credit}: {gap} business days after ex-date")
    print(f"v0.1 rule 5 (price and share count change on the same date): {'BLOCK' if gap > 0 else 'pass'}")
    print(f"v0.2 rule 5 (share change expected within N={N} business days of ex): "
          f"{'pass; shares figure ageing with CA lifecycle open until credit' if gap <= N else 'review: CA overdue'}")
    c_cum, c_ex = D("100.00"), D("80.50")
    m, nb = 4, 1                                # 1-for-4 bonus
    factor = D(m) / D(m + nb)
    adj_cum = c_cum * factor
    print(f"factor {factor}; adjusted cum close {q(adj_cum)}; adjusted ex-date return {q((c_ex / adj_cum - 1) * 100)}%; "
          f"unadjusted {q((c_ex / c_cum - 1) * 100, '0.1')}%")
    ni, sh_post, vendor_eps = D("12500000000"), D("1250000000"), D("12.50")
    eps = ni / sh_post
    print(f"recomputed EPS {q(eps)}; vendor {vendor_eps}; variance {q((vendor_eps / eps - 1) * 100, '1')}%")
    print()


# ---------------------------------------------------------------- F  stale-close check by price group
def part_f():
    print("=== F  Identical-close check conditioned on NGX price groups (Sec. 4.3.5; SYNTHETIC trades) ===")
    # 05a F3 (E2, 2018 rule): group by price, units needed to move the price
    groups = [(D(100), "A", 10000), (D(5), "B", 50000), (D(0), "C", 100000)]

    def group(px):
        for floor, g, units in groups:
            if px >= floor:
                return g, units

    cases = [("Group C name, small trades", D("2.10"), [60000, 40000, 75000]),
             ("Group A name, large trades", D("150.00"), [50000, 80000, 120000]),
             ("Group B name, mixed", D("40.00"), [20000, 55000, 10000])]
    for label, px, vols in cases:
        g, units = group(px)
        v01 = all(v > 0 for v in vols)
        v02 = sum(1 for v in vols if v >= units) >= 3
        print(f"   {label}: close {px} unchanged 3 sessions, volumes {vols}, group {g} threshold {units}: "
              f"v0.1 flag={v01}; v0.2 flag={v02}")
    print()


# ---------------------------------------------------------------- G  freshness at read time
def part_g():
    print("=== G  Freshness computed at read time (merged table, Sec. 4.3.2) ===")

    def eod_state(as_of, read_on):
        n = bdays_between(as_of, read_on)
        return n, ("fresh" if n <= 1 else "ageing" if n == 2 else "stale" if n <= 5 else "expired")

    def fx_state(fixing, applied):
        n = bdays_between(fixing, applied)
        return n, ("fresh" if n <= 1 else "ageing" if n == 2 else "stale" if n <= 10 else "expired")

    for as_of, read_on in ((date(2026, 10, 30), date(2026, 11, 2)), (date(2026, 10, 30), date(2026, 11, 3)),
                           (date(2026, 10, 27), date(2026, 11, 2)), (date(2026, 10, 23), date(2026, 11, 3))):
        n, s = eod_state(as_of, read_on)
        print(f"   EOD close as of {as_of} ({as_of:%a}) read {read_on} ({read_on:%a}): {n} trading days -> {s}")
    for fixing, applied in ((date(2026, 10, 16), date(2026, 10, 18)), (date(2026, 10, 16), date(2026, 11, 2))):
        n, s = fx_state(fixing, applied)
        print(f"   FX fixing {fixing} applied {applied}: {n} business days -> {s}")
    print("   (no holiday calendar in this demo; production uses the source's calendar)")
    print()


# ---------------------------------------------------------------- H  same-upstream comparison
def part_h():
    print("=== H  Same-upstream comparison after normalisation (Sec. 4.3.3; SYNTHETIC) ===")
    issuer = {"amount": D("150"), "unit": "kobo", "basis": "gross"}      # issuer notice: 150 kobo gross
    vendor = {"amount": D("1.35"), "unit": "naira", "basis": "net"}      # vendor: N1.35 net of 10% WHT
    wht = D("0.10")                                                        # SYNTHETIC rate; Doc 6 owns the real one

    def to_gross_naira(r):
        a = r["amount"] / 100 if r["unit"] == "kobo" else r["amount"]
        return a / (1 - wht) if r["basis"] == "net" else a

    a, b = to_gross_naira(issuer), to_gross_naira(vendor)
    print(f"   raw compare 150 vs 1.35 -> mismatch; normalised gross NGN {q(a)} vs {q(b)} -> match={q(a) == q(b)}")
    print()


if __name__ == "__main__":
    part_a()
    part_b()
    part_c()
    part_d()
    part_e()
    part_f()
    part_g()
    part_h()
