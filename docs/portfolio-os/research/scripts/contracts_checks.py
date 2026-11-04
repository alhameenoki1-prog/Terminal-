"""Canonical Contracts (CANONICAL_CONTRACTS.md) -- verification of every worked example.

All inputs are SYNTHETIC unless a line says otherwise. Standard library only; run with:
    python3 -I docs/portfolio-os/research/scripts/contracts_checks.py
Money and rates use decimal.Decimal (or fractions.Fraction for exact rates); no floats touch money.
"""
from decimal import Decimal as D, getcontext, ROUND_HALF_EVEN, ROUND_DOWN
from fractions import Fraction as F
from datetime import date, timedelta
import re
import unicodedata

getcontext().prec = 50
CENT = D("0.01")


def q2(x):
    """Quantise a Decimal or Fraction to 2 dp, half-even (display/booking rounding)."""
    if isinstance(x, F):
        x = D(x.numerator) / D(x.denominator)
    return x.quantize(CENT, rounding=ROUND_HALF_EVEN)


def dec(fr):
    return D(fr.numerator) / D(fr.denominator)


# ---------------------------------------------------------------- C1 ledger posting model
def c1():
    print("=== C1 Ledger posting model ===")
    # (a) 4-dp truncation of an inverted rate
    for r in (D("1352.00"), D("1346.91")):
        exact = D(1) / r
        trunc = exact.quantize(D("0.0001"), rounding=ROUND_DOWN)
        err = (trunc - exact) / exact * 100
        print(f"USD per NGN at {r}: exact {exact:.12f}  4dp {trunc}  error {err:.2f}%  "
              f"on NGN 1,000,000: {q2(D(1000000) * trunc)} vs {q2(D(1000000) * exact)} USD")

    # (b) transfer spanning month-end: two entries through an in-transit account, per-commodity balance
    G, R = D("1000000.00"), D("715.00")           # NGN given (30 Oct), USD received (2 Nov)
    E1 = [("Assets:Bank:NG:A1", "CUR:NGN", -G), ("Assets:InTransit:TR-0412", "CUR:NGN", G)]
    E2 = [("Assets:InTransit:TR-0412", "CUR:NGN", -G), ("Equity:Conversion:NGN", "CUR:NGN", G),
          ("Equity:Conversion:USD", "CUR:USD", -R), ("Assets:Brokerage:A3:Cash", "CUR:USD", R)]
    for name, e in (("E1 2026-10-30", E1), ("E2 2026-11-02", E2)):
        sums = {}
        for _, c, a in e:
            sums[c] = sums.get(c, D(0)) + a
        print(f"{name}: per-commodity sums {sums}  balanced={all(v == 0 for v in sums.values())}")
    print("31 Oct balance sheet: InTransit holds NGN", G, "(asset, not spending)")
    implied = F(int(G * 100), int(R * 100))
    print(f"implied rate (exact rational) {implied} = {dec(implied):.10f} NGN/USD")

    # (c) FX cost against a stated reference rate, with the residual-tolerance rule
    ref = D("1352.00")       # synthetic CBN central rate, fixing date 30 Oct 2026 (conversion date)
    dealer = D("1398.60")    # rate printed on the provider receipt (synthetic)
    cost_ref = G - R * ref
    markup = R * (dealer - ref)
    residual = G - R * dealer
    tol = dealer * D("0.005") + D("0.005")   # half a cent of R at the dealer rate + half a kobo of G
    print(f"cost vs reference NGN {q2(cost_ref)} ({q2(cost_ref / G * 100)}% of NGN given); "
          f"dealer markup {q2(markup)}; unexplained residual {q2(residual)}; tolerance {q2(tol)}; "
          f"residual within tolerance={abs(residual) <= tol}")
    band = (D("-1.0"), D("4.0"))   # provisional one-sided band for NGN->USD without a dealer rate (E5)
    for credit in (D("715.00"), D("700.00"), D("750.00")):
        pct = (G - credit * ref) / G * 100
        ok = band[0] <= pct <= band[1]
        print(f"candidate credit USD {credit}: cost vs ref {q2(pct)}% -> "
              f"{'within band: may be confirmed as spread' if ok else 'OUTSIDE band: review, Suspense:FXUnexplained'}")
    usd_view = q2(-G / ref)
    print(f"USD view of the NGN leg at 1/{ref}: {usd_view} (computed from the exact rate, rounded once)")

    # (d) currency pool (weighted average, NGN tax currency) and a security lot (fees capitalised, FIFO)
    pool_q, pool_cost = D("2150.00"), D("2857350.00")          # opening USD pool, NGN cost
    pool_q, pool_cost = pool_q + R, pool_cost + G               # acquisition at consideration given
    print(f"USD pool after E2: USD {pool_q}, NGN cost {pool_cost}, WA {pool_cost / pool_q:.6f}")
    spend = D("701.00")                                          # 2.8 ETF @ 250 + 1.00 commission, 3 Nov
    spot = D("1350.00")                                          # synthetic official rate 3 Nov
    relieved = q2(pool_cost * spend / pool_q)
    proceeds = q2(spend * spot)
    pool_q, pool_cost = pool_q - spend, pool_cost - relieved     # residual stays in the pool
    print(f"USD {spend} spent: NGN proceeds {proceeds}, relieved cost {relieved}, "
          f"realised FX gain (tax view, NGN) {proceeds - relieved}; pool left USD {pool_q}, NGN {pool_cost}")
    lot_q, lot_cost = D("2.8"), D("701.00")
    sell_q, sell_net = D("1.0"), D("259.00")                     # 1 unit @ 260 less 1.00 commission
    rel = q2(lot_cost * sell_q / lot_q)
    lot_q, lot_cost = lot_q - sell_q, lot_cost - rel
    print(f"ETF lot: relieved cost {rel}, gain USD {sell_net - rel}, lot left {lot_q} units cost {lot_cost}; "
          f"cost conserved={rel + lot_cost == D('701.00')}")


# ---------------------------------------------------------------- C2 figure tokens
STORE = {
    "fig_7a1": {"value": D("0.0812"), "field": "perf.twrr_1y", "unit": "fraction", "ccy": "USD", "status": "validated"},
    "fig_7a2": {"value": D("-0.2345"), "field": "risk.max_drawdown", "unit": "fraction", "ccy": "USD", "status": "validated"},
    "fig_7a3": {"value": D("4084410.00"), "field": "ledger.balance", "unit": "money", "ccy": "NGN", "status": "auto_validated"},
    "date_7a": {"value": date(2026, 10, 31), "field": "asof", "unit": "date", "ccy": None, "status": "validated"},
}
NUMBER_WORDS = re.compile(
    r"\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|"
    r"sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|"
    r"thousand|million|billion|trillion|half|third|thirds|quarter|quarters|double|doubled|triple|tripled|"
    r"dozen|January|February|March|April|June|July|August|September|October|November|December|"
    r"Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b", re.IGNORECASE)
TOKEN = re.compile(r"\{\{(fig|date|dir|quote):([a-z0-9_]+)(?:\|as=([a-z0-9_.]+))?(?:\|fmt=([a-z0-9_]+))?\}\}")


def render_value(f, fmt):
    v = f["value"]
    if fmt == "pct1":
        return f"{(v * 100).quantize(D('0.1'), rounding=ROUND_HALF_EVEN)}%"
    if fmt == "money":
        return f"{f['ccy']} {q2(v):,}"
    if fmt == "date_long":
        return f"{v.day} {v.strftime('%B %Y')}"
    raise ValueError(fmt)


def validate_and_render(segments, allow):
    out, errors = [], []
    for kind, payload in segments:
        if kind == "text":
            if any(unicodedata.category(ch) == "Nd" for ch in payload) or any(ch in "½¼¾⅓" for ch in payload):
                errors.append(f"free digit in text: {payload!r}")
            m = NUMBER_WORDS.search(payload)
            if m:
                errors.append(f"number/date word in text: {m.group(0)!r}")
            out.append(payload)
            continue
        m = TOKEN.fullmatch(payload)
        if not m:
            errors.append(f"malformed token {payload!r}")
            continue
        typ, fid, as_field, fmt = m.groups()
        if fid not in allow:
            errors.append(f"token id not returned by a tool this turn: {fid}")
            continue
        f = STORE[fid]
        if as_field and as_field != f["field"]:
            errors.append(f"semantic mismatch: {fid} is {f['field']}, model claimed {as_field}")
            continue
        if typ == "dir":
            out.append("rose" if f["value"] > 0 else "fell" if f["value"] < 0 else "was unchanged")
        else:
            out.append(render_value(f, fmt))
    return ("PASS", "".join(out)) if not errors else ("REJECT", errors)


def c2():
    print("\n=== C2 Figure-integrity contract ===")
    allow = {"fig_7a1", "fig_7a2", "fig_7a3", "date_7a"}
    cases = {
        "A good": [("text", "Your time-weighted return over the past year was "),
                   ("tok", "{{fig:fig_7a1|as=perf.twrr_1y|fmt=pct1}}"), ("text", " and the largest drawdown was "),
                   ("tok", "{{fig:fig_7a2|as=risk.max_drawdown|fmt=pct1}}"), ("text", ", as of "),
                   ("tok", "{{date:date_7a|fmt=date_long}}"), ("text", ".")],
        "B free digits": [("text", "You should expect 12% next year.")],
        "C number words": [("text", "Expect roughly twelve percent.")],
        "D mislabelled": [("text", "Drawdown was "), ("tok", "{{fig:fig_7a1|as=risk.max_drawdown|fmt=pct1}}")],
        "E invented id": [("text", "Balance "), ("tok", "{{fig:fig_9zz|fmt=money}}")],
        "F free date": [("text", "As of October your balance was "), ("tok", "{{fig:fig_7a3|as=ledger.balance|fmt=money}}")],
    }
    for k, segs in cases.items():
        print(k, "->", validate_and_render(segs, allow))


# ---------------------------------------------------------------- C3 data status
def c3():
    print("\n=== C3 Data status: entry-time primary-source check (MPR) ===")
    # CBN MPC decisions as reported by reviewer R05c from the CBN decisions page (E2 via reviewer, 2026-11-04)
    primary = [(date(2025, 9, 23), D("27.00")), (date(2025, 11, 25), D("27.00")), (date(2026, 2, 24), D("26.50"))]
    calendar_next = date(2026, 5, 20)
    entered = {"value": D("27.50"), "entered_on": date(2026, 3, 2), "next_meeting_typed": date(2026, 3, 25)}
    in_force = [v for d_, v in primary if d_ <= entered["entered_on"]][-1]
    print(f"entered {entered['value']} on {entered['entered_on']}; primary value in force {in_force} -> "
          f"{'accept' if in_force == entered['value'] else 'BLOCK at entry: disputed (value != primary)'}")
    print(f"typed next meeting {entered['next_meeting_typed']} in calendar? "
          f"{entered['next_meeting_typed'] == calendar_next} -> expiry_at derived from calendar = "
          f"{calendar_next + timedelta(days=7)}")
    print("eligibility examples (validation, freshness, lifecycle, licence, corroboration) -> use:")
    for combo in [("validated", "fresh", "current", "licence_active", "two_independent"),
                  ("auto_validated", "ageing", "current", "licence_active", "single_source"),
                  ("validated", "stale", "current", "licence_active", "two_independent"),
                  ("disputed", "fresh", "current", "licence_active", "two_independent"),
                  ("validated", "fresh", "superseded", "licence_active", "two_independent"),
                  ("validated", "fresh", "current", "licence_expired", "single_source")]:
        print("  ", combo, "->", eligibility(*combo))


def eligibility(v, fr, lc, lic, corr):
    if lc in ("superseded", "withdrawn") or lic == "licence_revoked" or v in ("rejected",):
        return "history only; not displayable as current; no calc"
    if v == "disputed":
        return "show both values side by side; no calc"
    if fr == "expired":
        return "show 'expired' with as-of; no calc"
    if lic == "licence_expired":
        return "display retained value with licence badge; no new calc or derived figure"
    if v == "candidate":
        return "show 'unchecked'; no calc"
    if fr == "stale":
        return "badge 'stale'; descriptive calc with inherited badge; not conclusion-driving"
    if v == "auto_validated":
        return f"badge '{'single source' if corr == 'single_source' else 'auto-checked'}'; calc with badge; conclusion-driving only via sampling rule"
    return "plain figure with strip; any calc incl. conclusion-driving"


# ---------------------------------------------------------------- C4 confidence
def wilson_lower(k, n, z=D("1.959963984540054")):
    p = D(k) / D(n)
    z2 = z * z
    centre = p + z2 / (2 * n)
    margin = z * ((p * (1 - p) / n + z2 / (4 * n * n)).sqrt())
    return (centre - margin) / (1 + z2 / n)


def band(c):
    return "very_high" if c >= D("0.98") else "high" if c >= D("0.90") else "medium" if c >= D("0.70") else "low"


def c4():
    print("\n=== C4 Confidence ===")
    for k, n in ((97, 100), (29, 30), (296, 300)):
        lb = wilson_lower(k, n)
        print(f"rule precision {k}/{n}: Wilson 95% lower bound {lb:.4f} -> "
              f"{'may auto-apply' if n >= 30 and lb >= D('0.90') else 'provisional: outputs go to review'}")
    items = [("Fuel POS 27,300", D("0.99"), "deterministic_rule", D("27300"), False),
             ("Credit 1,780,000 from IMTO", D("0.96"), "deterministic_rule", D("1780000"), True),
             ("Aani transfer 250 AED", D("0.75"), "model", D("17930"), False),
             ("Airtime 5,000", D("0.93"), "model", D("5000"), False)]
    for name, c, producer, ngn, tax in items:
        auto = c >= D("0.90") and producer != "model" and not tax
        print(f"{name}: band {band(c)}, producer {producer}, tax-weighted {tax} -> "
              f"{'auto-apply (reversible)' if auto else 'review queue'}; priority {q2(ngn * (1 - c))}"
              f"{' [tax first]' if tax else ''}")


# ---------------------------------------------------------------- C5 FX decomposition
RATES = {date(2026, 9, 30): D("1530.00"), date(2026, 10, 15): D("1505.00"), date(2026, 10, 16): D("1500.00"),
         date(2026, 10, 20): D("1495.00"), date(2026, 10, 26): D("1490.00"), date(2026, 10, 28): D("1485.00"),
         date(2026, 10, 30): D("1480.00")}   # synthetic CBN central NGN per USD; fixing dates only
PEG = D("3.6725")


def fixing(d):
    """Latest fixing on or before d; refuse if older than 2 Nigerian business days (no holidays modelled)."""
    fd = max(k for k in RATES if k <= d)
    bd, x = 0, fd
    while x < d:
        x += timedelta(days=1)
        bd += x.weekday() < 5
    if bd > 2:
        raise ValueError("stale rate")
    return fd, RATES[fd]


def ngn_per(c, d):
    _, r = fixing(d)
    return {"NGN": F(1), "USD": F(r), "AED": F(r) / F(PEG)}[c]


def c5():
    print("\n=== C5 FX presentation ===")
    for d in (date(2026, 10, 18), date(2026, 10, 31)):
        fd, r = fixing(d)
        print(f"{d} ({d.strftime('%A')}) uses fixing of {fd} ({fd.strftime('%A')}) = {r}")
    t0, t1 = date(2026, 9, 30), date(2026, 10, 31)
    open_q = {"NGN": D("12000000.00"), "USD": D("35000.00"), "AED": D("85000.00")}
    etf_units, p0, p1 = D("12"), D("250.00"), D("257.50")
    # flows: (date, commodity, quantity, kind)
    conv = date(2026, 10, 18)   # conversion date printed on the provider receipt (Sunday)
    flows = [(date(2026, 10, 15), "AED", D("-5500.00"), "external"),
             (conv, "NGN", D("-1000000.00"), "exchange"), (conv, "USD", D("660.00"), "exchange"),
             (date(2026, 10, 26), "NGN", D("2350000.00"), "external"),
             (date(2026, 10, 28), "NGN", D("-480000.00"), "external")]
    close_q = dict(open_q)
    for _, c, qty, _ in flows:
        close_q[c] += qty
    for base in ("NGN", "USD"):
        def x(c, d):  # base units per unit of c
            return ngn_per(c, d) / ngn_per(base, d)
        W0 = sum(F(open_q[c]) * x(c, t0) for c in open_q) + F(etf_units * p0) * x("USD", t0)
        W1 = sum(F(close_q[c]) * x(c, t1) for c in close_q) + F(etf_units * p1) * x("USD", t1)
        ext = sum(F(q) * x(c, d) for d, c, q, k in flows if k == "external")
        convcost = sum(F(q) * x(c, d) for d, c, q, k in flows if k == "exchange")
        market = F(etf_units * (p1 - p0)) * x("USD", t1)
        fx = {}
        for c in open_q:
            fx[c] = F(open_q[c]) * (x(c, t1) - x(c, t0)) + sum(F(q) * (x(c, t1) - x(c, d)) for d, cc, q, _ in flows if cc == c)
        fx["USD"] += F(etf_units * p0) * (x("USD", t1) - x("USD", t0))
        total = ext + convcost + market + sum(fx.values())
        assert total == W1 - W0, "decomposition must be exact"
        parts = [q2(ext), q2(convcost), q2(market)] + [q2(fx[c]) for c in fx]
        rounding = q2(W1) - q2(W0) - sum(parts)
        print(f"[{base} base] W0 {q2(W0):,}  W1 {q2(W1):,}  change {q2(W1) - q2(W0):,}")
        print(f"   net external flows {q2(ext):,} | conversion cost vs reference {q2(convcost):,} | market {q2(market):,} | "
              + " | ".join(f"FX on {c} {q2(v):,}" for c, v in fx.items()) + f" | display rounding {rounding}")
        for c in fx:
            dx = x(c, t1) - x(c, t0)
            if dx != 0:
                expected = 1 if dx > 0 else -1
                got = 1 if fx[c] > 0 else -1 if fx[c] < 0 else 0
                print(f"   sign check FX on {c}: rate move {'up' if dx > 0 else 'down'}, long position -> "
                      f"expected {'+' if expected > 0 else '-'}, got {'+' if got > 0 else '-'}: {'OK' if got == expected else 'FAIL'}")


# ---------------------------------------------------------------- C6 goal engine
def erf(x):
    s, term, n = D(0), x, 0
    while True:
        t = term / (2 * n + 1)
        if abs(t) < D("1e-40"):
            break
        s += t
        n += 1
        term = -term * x * x / n
    return 2 / D("3.14159265358979323846264338327950288419716939937510").sqrt() * s


def Phi(z):
    return (1 + erf(z / D(2).sqrt())) / 2


Z = {"q05": D("-1.6448536269514722"), "q10": D("-1.2815515655446004"), "q25": D("-0.6744897501960817"),
     "q50": D(0), "q75": D("0.6744897501960817"), "q90": D("1.2815515655446004"), "q95": D("1.6448536269514722")}


def round_to(k, step=5):
    return int((D(k) / step).quantize(D(1), rounding=ROUND_HALF_EVEN)) * step


def c6():
    print("\n=== C6 Goal engine (analytic lognormal check of the output contract) ===")
    V0, goal, H, T, sig = D("100000"), D("150000"), D(5), D(5), D("0.145")
    g = (goal / V0).ln()
    print(f"required compound return {( (goal / V0) ** (1 / H) - 1) * 100:.2f}%/yr; required log return/yr {g / H:.5f}")
    m_hist = D("0.0811")   # synthetic sample mean log return of the history
    c = (H * m_hist - g) / (sig * H.sqrt())
    band_lo, band_hi = Phi(c - D("1.2815515655446004") * (H / T).sqrt()), Phi(c + D("1.2815515655446004") * (H / T).sqrt())
    print(f"historical centring: conditional P {Phi(c) * 100:.1f}%; second-order 10-90 band "
          f"{band_lo * 100:.1f}%-{band_hi * 100:.1f}% (set by H/T={H / T}, not by data)")
    for label, m, sm in (("CMA overlay centre", D("0.05"), D("0.02")), ("drift -2pp", D("0.03"), D("0.02")),
                         ("drift +2pp", D("0.07"), D("0.02"))):
        s_pred = (sig * sig * H + H * H * sm * sm).sqrt()
        p = Phi((H * m - g) / s_pred)
        k = int((p * 100).quantize(D(1), rounding=ROUND_HALF_EVEN))
        line = f"{label}: m={m}, drift sd {sm}: predictive P {p * 100:.1f}% -> {k} of 100, displayed 'about {round_to(k)} of 100'"
        if label == "CMA overlay centre":
            qs = {n: q2(V0 * (H * m + z * s_pred).exp()) for n, z in Z.items()}
            print(line)
            print("   terminal value quantiles USD:", {n: f"{v:,}" for n, v in qs.items()})
            g10 = (H * m + Z["q10"] * s_pred).exp()
            print(f"   adjustment: lump sum today needed for the 10th-percentile future to reach the goal "
                  f"USD {q2(goal / g10 - V0):,}")
            se = (p * (1 - p) / 10000).sqrt() * 100
            print(f"   Monte Carlo SE at 10,000 paths would be {se:.2f} points")
        else:
            print(line)


# ---------------------------------------------------------------- C7 tax rules
BANDS = [(D("800000"), D("0")), (D("2200000"), D("0.15")), (D("9000000"), D("0.18")),
         (D("13000000"), D("0.21")), (D("25000000"), D("0.23")), (None, D("0.25"))]


def pit(ci):
    tax, rest = D(0), ci
    for width, rate in BANDS:
        part = rest if width is None else min(rest, width)
        tax += part * rate
        rest -= part
        if rest <= 0:
            break
    return tax


ORDER = ["draft", "sourced", "reviewed_internal", "practitioner_confirmed"]


def watermark(statuses):
    if any(s in ("draft", "superseded", "retired") for s in statuses):
        return "REFUSE"
    lowest = min(statuses, key=ORDER.index)
    return {"sourced": "DRAFT COMPUTATION - rule text sourced, not reviewed",
            "reviewed_internal": "INDICATIVE - not confirmed by a licensed tax practitioner",
            "practitioner_confirmed": "Rules practitioner-confirmed (not advice)"}[lowest]


def yoa_for(kind, event_date):
    return event_date.year + 1 if kind == "chargeable_gain" else event_date.year


def c7():
    print("\n=== C7 Tax rule lifecycle and basis period (Doc 6 Example 1 inputs) ===")
    print("June 2026 disposal assessed in YOA", yoa_for("chargeable_gain", date(2026, 6, 15)),
          "; 2026 salary assessed in YOA", yoa_for("employment", date(2026, 10, 26)))
    salary, interest, wht, paye_tax = D("18000000"), D("600000"), D("60000"), D("2802600")
    ded, gain = D("1940000"), D("8500000")
    for t, inc in (("A (interest aggregated, WHT credited)", salary + interest), ("B (interest WHT final)", salary)):
        ci = inc - ded
        tax = pit(ci)
        credit = wht if t.startswith("A") else D(0)
        print(f"YOA 2026 Treatment {t}: chargeable {ci:,} PIT {tax:,} balance {max(tax - credit - paye_tax, D(0)):,}")
    ci27 = salary + interest - ded
    print(f"YOA 2027 marginal tax of the gain if 2027 income equals 2026 (Treatment A): {pit(ci27 + gain) - pit(ci27):,}")
    print("watermark examples:")
    for s in (["practitioner_confirmed", "reviewed_internal", "sourced"], ["practitioner_confirmed"] * 3,
              ["reviewed_internal", "reviewed_internal"], ["practitioner_confirmed", "draft"]):
        print("  ", s, "->", watermark(s))
    tests = [(D("800000"), D("0")), (D("800001"), D("0.15")), (D("3000000"), D("330000")), (D("25160000"), D("4716800"))]
    print("PIT band boundary tests:", all(pit(a) == b for a, b in tests))


if __name__ == "__main__":
    c1(); c2(); c3(); c4(); c5(); c6(); c7()
