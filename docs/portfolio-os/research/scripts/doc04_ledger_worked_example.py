"""Document 4 (v0.2) worked example, recomputed under CANONICAL_CONTRACTS.md C1, C4 and C5.

All inputs are SYNTHETIC (October 2026). Standard library only; run with:
    python3 -I docs/portfolio-os/research/scripts/doc04_ledger_worked_example.py
Money and rates use decimal.Decimal and fractions.Fraction; no float touches money.

What changed from v0.1 (review R04):
  * rates are synthetic CBN *central* fixings on Nigerian business days only; a non-business day takes the latest
    earlier fixing (C5.2): Sunday 18 Oct -> Friday 16 Oct; Saturday 31 Oct -> Friday 30 Oct (R04 W1, W2);
  * postings balance per commodity, exchanges pass through Equity:Conversion:<C>, transfers through
    Assets:InTransit:<id>, categories are classification rows, not posting accounts (C1 D1-D4, D8);
  * FX conversion cost is a derived measure against the reference rate, reported only for confirmed matches that pass
    the C1.5 residual rule; the symmetric +/-6% band is withdrawn (R04 B1);
  * currency pools at weighted-average NGN cost and an ETF lot with the commission capitalised (C1.6; R04 B3, W11);
  * the net-worth change is decomposed exactly per C5.3, with intra-month flows translated (R04 W10);
  * line keys per C1.8, re-import golden test, CAMF cap test (<=), stamp-duty scope audit, date-format check.
"""
import sys

try:
    from decimal import Decimal as D, getcontext, ROUND_HALF_EVEN, ROUND_DOWN
    from fractions import Fraction as F
    from datetime import date, timedelta
    import hashlib
    import hmac
except ImportError as exc:  # fail loudly (revision instructions, item 5)
    sys.exit(f"missing standard-library module: {exc}")

getcontext().prec = 50
CENT = D("0.01")


def q2(x, rounding=ROUND_HALF_EVEN):
    if isinstance(x, F):
        x = D(x.numerator) / D(x.denominator)
    return D(x).quantize(CENT, rounding=rounding)


def fmt(x):
    return f"{q2(x):,}"


def d_(s):
    return date.fromisoformat(s)


# ------------------------------------------------------------------ 1. Reference rates (C5.1, C5.2)
NG_HOLIDAYS = {d_("2026-10-01")}          # Independence Day; no other October 2026 holiday modelled
PEG = D("3.6725")                          # CBUAE AED per USD, a registered reference fact (not a code constant in production)
ANCHORS = [(d_("2026-09-30"), D("1329.00")), (d_("2026-10-16"), D("1350.00")),
           (d_("2026-10-20"), D("1352.00")), (d_("2026-10-30"), D("1356.00"))]   # synthetic central NGN per USD


def ng_business_day(d):
    return d.weekday() < 5 and d not in NG_HOLIDAYS


def build_fixings():
    days, d = [], ANCHORS[0][0]
    while d <= ANCHORS[-1][0]:
        if ng_business_day(d):
            days.append(d)
        d += timedelta(days=1)
    out = {}
    for (a, ra), (b, rb) in zip(ANCHORS, ANCHORS[1:]):
        seg = [x for x in days if a <= x <= b]
        n = len(seg) - 1
        for i, x in enumerate(seg):
            out[x] = q2(ra + (rb - ra) * D(i) / D(n))
    return out


FIX = build_fixings()


def fixing(d):
    """Latest fixing on or before d (C5.2). >2 NG business days old -> stale; >10 -> expired (no conversion)."""
    fd = max(k for k in FIX if k <= d)
    bd, x = 0, fd
    while x < d:
        x += timedelta(days=1)
        bd += ng_business_day(x)
    if bd > 10:
        raise ValueError(f"rate expired for {d}")
    return fd, FIX[fd], ("stale" if bd > 2 else "ok")


def ngn_per(c, d):
    if c == "NGN":
        return F(1)
    _, r, _ = fixing(d)
    return F(r) if c == "USD" else F(r) / F(PEG)


print("=== 1. Synthetic CBN central fixings (NGN per USD), Nigerian business days only ===")
print("  " + "  ".join(f"{k.strftime('%d%b')} {v}" for k, v in FIX.items()))
for s in ("2026-10-01", "2026-10-03", "2026-10-18", "2026-10-25", "2026-10-31"):
    fd, r, st = fixing(d_(s))
    print(f"  {s} ({d_(s).strftime('%a')}) -> fixing {fd} ({fd.strftime('%a')}) {r} [{st}]; "
          f"fixing_date and applied_date both stored")

# ------------------------------------------------------------------ 2. Statements (as printed)
# (date, narration, signed amount, bank_ref, rail, nature/posting account, category, levy_type)
A1 = [  # NGN current account, opening 1,250,000.00
    ("2026-10-03", "POS/WEB PURCHASE TRANSACTION SHOPRITE LEKKI", "-48500.00", None, "POS", "Expenses:Consumption", "groceries", None),
    ("2026-10-05", "NIP/ZEN/ADEBAYO LANDLORD/RENT OCT", "-400000.00", "S100501", "NIP", "Expenses:Consumption", "rent", None),
    ("2026-10-05", "NIP TRANSFER FEE", "-50.00", None, "NIP", "Expenses:BankCharge", "transfer_fee", None),
    ("2026-10-05", "VAT ON NIP FEE", "-3.75", None, "NIP", "Expenses:Tax", "vat_on_fee", "vat"),
    ("2026-10-05", "STAMP DUTY (NTA 2025)", "-50.00", None, "NIP", "Expenses:Levy", "stamp_duty", "stamp_duty"),
    ("2026-10-10", "USSD AIRTIME TOPUP 0803XXXXXXX", "-5000.00", None, "USSD", "Expenses:Consumption", "telephone", None),
    ("2026-10-12", "POS PURCHASE TOTAL ENERGIES IKOYI 12/10 09:41", "-27300.00", None, "POS", "Expenses:Consumption", "fuel", None),
    ("2026-10-12", "POS PURCHASE TOTAL ENERGIES IKOYI 12/10 09:42", "-27300.00", None, "POS", "Expenses:Consumption", "fuel", None),
    ("2026-10-14", "REVERSAL OF POS TXN 12/10 TOTAL ENERGIES", "27300.00", None, "POS", "Expenses:Consumption", "fuel", None),
    ("2026-10-19", "NIP/IMTO PARTNER/REMITTANCE REF AE7781", "1780000.00", "S101902", "NIP", "EXCHANGE:T1", None, None),
    ("2026-10-20", "NIP/FX PROVIDER LTD/USD 715.00 FOR BROKERAGE FUNDING", "-1000000.00", "S102003", "NIP", "Assets:InTransit:T2", None, None),
    ("2026-10-20", "NIP TRANSFER FEE", "-50.00", None, "NIP", "Expenses:BankCharge", "transfer_fee", None),
    ("2026-10-20", "VAT ON NIP FEE", "-3.75", None, "NIP", "Expenses:Tax", "vat_on_fee", "vat"),
    ("2026-10-20", "STAMP DUTY (NTA 2025)", "-50.00", None, "NIP", "Expenses:Levy", "stamp_duty", "stamp_duty"),
    ("2026-10-26", "SALARY OCT 2026 ACME NIGERIA LTD", "2350000.00", "S102604", "NIP", "Income:Employment", "salary", None),
    ("2026-10-31", "SMS ALERT CHARGES 12 @ N4", "-48.00", None, "SYS", "Expenses:BankCharge", "sms_alert", None),
    ("2026-10-31", "VAT ON SMS ALERT CHARGES", "-3.60", None, "SYS", "Expenses:Tax", "vat_on_fee", "vat"),
    ("2026-10-31", "ACCOUNT MAINTENANCE FEE (N0.5/mille)", "-740.40", None, "SYS", "Expenses:BankCharge", "camf", None),
    ("2026-10-31", "VAT ON ACCOUNT MAINTENANCE FEE", "-55.53", None, "SYS", "Expenses:Tax", "vat_on_fee", "vat"),
]
A2 = [  # AED current account, opening 18,400.00
    ("2026-10-01", "WPS SALARY SEP 2026 GULF EMPLOYER LLC", "22000.00", "W0101", "WPS", "Income:Employment", "salary", None),
    ("2026-10-02", "STANDING ORDER RENT INSTALMENT", "-9000.00", None, "SO", "Expenses:Consumption", "rent", None),
    ("2026-10-06", "POS CARREFOUR MOE", "-612.35", None, "POS", "Expenses:Consumption", "groceries", None),
    ("2026-10-09", "DEWA BILL PAYMENT", "-540.00", None, "BILL", "Expenses:Consumption", "gas_electricity_water", None),
    ("2026-10-12", "AANI TRANSFER TO +9715XXXXXXX", "-250.00", None, "AANI", "Suspense:Unmatched:A2", None, None),
    ("2026-10-18", "OUTWARD REMITTANCE NGN BENEF SELF REF AE7781", "-5000.00", "AE7781", "SWIFT", "Assets:InTransit:T1", None, None),
    ("2026-10-18", "REMITTANCE FEE", "-15.00", None, "SWIFT", "Expenses:BankCharge", "transfer_fee", None),
    ("2026-10-18", "VAT 5% ON FEE", "-0.75", None, "SWIFT", "Expenses:Tax", "vat_on_fee", "vat"),
    ("2026-10-25", "ACCOUNT FEE", "-25.00", None, "SYS", "Expenses:BankCharge", "account_fee", None),
    ("2026-10-25", "VAT 5% ON ACCOUNT FEE", "-1.25", None, "SYS", "Expenses:Tax", "vat_on_fee", "vat"),
    ("2026-10-28", "POS RESTAURANT JBR", "-180.00", None, "POS", "Expenses:Consumption", "restaurant", None),
]
A3 = [  # USD brokerage cash, opening 2,150.00; 12 ETF units (cost 240.00 each), price 250.00 on 30 Sep
    ("2026-10-22", "DEPOSIT (wire from FX provider) ref NG-5520", "715.00", "NG-5520", "WIRE", "EXCHANGE:T2", None, None),
    ("2026-10-23", "BUY 2.8 ETF @ 250.00", "-700.00", "IB-77101", "TRADE", "Assets:Brokerage:A3:ETF", None, None),
    ("2026-10-23", "COMMISSION", "-1.00", "IB-77101", "TRADE", "Assets:Brokerage:A3:ETF", None, None),
    ("2026-10-30", "DIVIDEND ETF 12 x 0.80 (gross)", "9.60", "IB-77188", "CORP", "Income:Dividend", "dividend", None),
    ("2026-10-30", "WITHHOLDING TAX 30%", "-2.88", "IB-77188", "CORP", "Expenses:Tax", "foreign_wht", "wht"),
]
OPEN = {"A1": D("1250000.00"), "A2": D("18400.00"), "A3": D("2150.00")}
CCY = {"A1": "NGN", "A2": "AED", "A3": "USD"}
STMT = {"A1": A1, "A2": A2, "A3": A3}

print("\n=== 2. Statement reconciliation (completeness control, not an integrity guarantee) ===")
CLOSE = {}
for acc, lines in STMT.items():
    bal = OPEN[acc]
    cr = sum(D(x[2]) for x in lines if D(x[2]) > 0)
    dr = -sum(D(x[2]) for x in lines if D(x[2]) < 0)
    for x in lines:
        bal += D(x[2])
    CLOSE[acc] = bal
    print(f"  {acc} {CCY[acc]}: opening {fmt(OPEN[acc])} + credits {fmt(cr)} - debits {fmt(dr)} = {fmt(bal)}")

# ------------------------------------------------------------------ 3. Journal: per-commodity postings (C1)
ENTRIES = []   # (id, kind, effective_on, [(account, commodity, quantity, cost_total, cost_commodity)])


def add(eid, kind, eff, postings):
    ENTRIES.append((eid, kind, d_(eff), postings))


BANK = {"A1": "Assets:Bank:NG:A1", "A2": "Assets:Bank:AE:A2", "A3": "Assets:Brokerage:A3:Cash"}
for acc, lines in STMT.items():
    c = "CUR:" + CCY[acc]
    for i, (dt, narr, amt, ref, rail, other, cat, levy) in enumerate(lines):
        a = D(amt)
        if narr.startswith("BUY 2.8 ETF") or narr == "COMMISSION" or other.startswith("EXCHANGE"):
            continue          # trade and exchange credit legs are written as their own entries below
        add(f"{acc}-{i:02d}", "bank_line", dt, [(BANK[acc], c, a, None, None), (other, c, -a, None, None)])
# the trade: 2.8 units, cost_total 701.00 USD including the 1.00 commission (C1.6; R04 W11)
add("A3-TRADE", "trade", "2026-10-23", [("Assets:Brokerage:A3:Cash", "CUR:USD", D("-701.00"), None, None),
                                        ("Assets:Brokerage:A3:ETF", "SEC:ETF", D("2.8"), D("701.00"), "CUR:USD")])
# exchanges (C1 D2): the credit leg's bank line is the exchange entry, written once the user confirms the match (C4)
# and dated by the credit leg's value date. Before confirmation the credit sits against Suspense:FXUnexplained:<C>.
add("T1-EXCH", "exchange", "2026-10-19", [("Assets:InTransit:T1", "CUR:AED", D("-5000.00"), None, None),
                                          ("Equity:Conversion:AED", "CUR:AED", D("5000.00"), None, None),
                                          ("Equity:Conversion:NGN", "CUR:NGN", D("-1780000.00"), None, None),
                                          ("Assets:Bank:NG:A1", "CUR:NGN", D("1780000.00"), None, None)])
add("T2-EXCH", "exchange", "2026-10-22", [("Assets:InTransit:T2", "CUR:NGN", D("-1000000.00"), None, None),
                                          ("Equity:Conversion:NGN", "CUR:NGN", D("1000000.00"), None, None),
                                          ("Equity:Conversion:USD", "CUR:USD", D("-715.00"), None, None),
                                          ("Assets:Brokerage:A3:Cash", "CUR:USD", D("715.00"), None, None)])
# Aani: user confirms in review that +9715... is a friend (shared bill), not an own Wio/Liv account -> reclass
add("A2-AANI-RECLASS", "reclass", "2026-10-12", [("Suspense:Unmatched:A2", "CUR:AED", D("-250.00"), None, None),
                                                 ("Expenses:Consumption", "CUR:AED", D("250.00"), None, None)])


def weight(p):
    acc, c, qty, cost, cc = p
    return (cc, (1 if qty > 0 else -1) * cost) if cost is not None else (c, qty)


def scale_ok(p):
    _, c, qty, cost, _ = p
    sc = {"CUR:NGN": 2, "CUR:AED": 2, "CUR:USD": 2, "SEC:ETF": 4}[c]
    return (qty * (D(10) ** sc)) == (qty * (D(10) ** sc)).to_integral_value()


print("\n=== 3. Journal invariants (C1-I1, C1-I2) and balances ===")
bad = 0
for eid, kind, eff, ps in ENTRIES:
    sums = {}
    for p in ps:
        c, w = weight(p)
        sums[c] = sums.get(c, D(0)) + w
    if any(v != 0 for v in sums.values()) or not all(scale_ok(p) for p in ps):
        bad += 1
        print("  UNBALANCED", eid, sums)
print(f"  {len(ENTRIES)} entries; per-commodity sum = 0 exactly in every entry: {bad == 0}")
BAL = {}
for eid, kind, eff, ps in ENTRIES:
    for acc, c, qty, cost, cc in ps:
        BAL[(acc, c)] = BAL.get((acc, c), D(0)) + qty
for k in sorted(BAL):
    if k[0].startswith(("Assets:Bank", "Assets:Brokerage", "Assets:InTransit", "Suspense", "Equity:Conversion")):
        print(f"  {k[0]:28} {k[1]:8} {BAL[k]:>16,}")
for acc in STMT:
    led = OPEN[acc] + BAL[(BANK[acc], 'CUR:' + CCY[acc])]
    print(f"  ledger assertion {acc} at start of 1 Nov: {fmt(led)} = statement closing {fmt(CLOSE[acc])}: {led == CLOSE[acc]}")
print("  InTransit zero after confirmation:", all(v == 0 for (a, c), v in BAL.items() if a.startswith("Assets:InTransit")),
      "| Suspense zero at close:", all(v == 0 for (a, c), v in BAL.items() if a.startswith("Suspense")))

# ------------------------------------------------------------------ 4. Transfer candidates and the C1.5 residual rule
print("\n=== 4. Transfer matches: C1.5 cost vs reference, residual rule, one-sided bands ===")
BANDS = {("NGN", "USD"): (D("-1.0"), D("4.0")), ("NGN", "AED"): (D("-1.0"), D("4.0")),
         ("AED", "USD"): (D("0.0"), D("1.5")), ("AED", "NGN"): (D("-3.0"), D("4.0")), ("USD", "NGN"): (D("-3.0"), D("4.0"))}


def assess(name, src, G, dst, Rq, conv_on, dealer=None):
    ref = ngn_per(dst, d_(conv_on)) / ngn_per(src, d_(conv_on))      # source units per received unit (exact)
    fd, _, _ = fixing(d_(conv_on))
    implied = F(G) / F(Rq)
    cost_src = F(G) - F(Rq) * ref
    pct = cost_src / F(G) * 100
    ngn_view = cost_src * ngn_per(src, d_(conv_on))
    out = {"cost_src": cost_src, "pct": pct, "ngn": ngn_view, "ref": ref}
    line = (f"  {name}: {src} {fmt(G)} -> {dst} {fmt(Rq)}; conversion_on {conv_on} (fixing {fd}); "
            f"implied {float(implied):.6f} {src}/{dst} vs reference {float(ref):.6f}; "
            f"cost vs reference {src} {fmt(cost_src)} = NGN {fmt(ngn_view)} ({q2(pct)}%)")
    print(line)
    if dealer is not None:
        residual = F(G) - F(Rq) * F(dealer)
        markup = F(Rq) * (F(dealer) - ref)
        tol = F(dealer) * F(1, 200) + F(1, 200)
        ok = abs(residual) <= tol
        print(f"      dealer rate printed {dealer}: markup vs reference {fmt(markup)}; unexplained residual "
              f"{fmt(residual)}; tolerance {fmt(tol)} -> {'rounding only: may be confirmed' if ok else 'UNEXPLAINED DIFFERENCE'}")
        out["ok"] = ok
    else:
        lo, hi = BANDS[(src, dst)]
        ok = lo <= D(q2(pct)) <= hi
        print(f"      no dealer rate: one-sided band {src}->{dst} [{lo}%, {hi}%] -> "
              f"{'plausible: may be confirmed' if ok else 'OUTSIDE band: review; credit stays in Suspense:FXUnexplained'}")
        out["ok"] = ok
    return out


T1 = assess("T1", "AED", D("5000.00"), "NGN", D("1780000.00"), "2026-10-18")
T2 = assess("T2", "NGN", D("1000000.00"), "USD", D("715.00"), "2026-10-20", dealer=D("1398.60"))
print("  Third-party credits that the withdrawn symmetric +/-6% band would have accepted as T2's counter-leg:")
for amt in (D("700.00"), D("750.00"), D("760.00")):
    pct = (D("1000000") - amt * FIX[d_("2026-10-20")]) / D("1000000") * 100
    lo, hi = BANDS[("NGN", "USD")]
    print(f"      USD {amt}: cost vs ref {q2(pct)}%  old +/-6%: {'accept' if abs(pct) <= 6 else 'reject'}  "
          f"C1.5 band: {'within' if lo <= pct <= hi else 'OUTSIDE -> review'}")
# trading-account valuation equals the conversion cost (Selinger)
for name, legs, conv_on in (("T1", (("AED", D("5000.00")), ("NGN", D("-1780000.00"))), "2026-10-18"),
                            ("T2", (("NGN", D("1000000.00")), ("USD", D("-715.00"))), "2026-10-20")):
    v = sum(F(qty) * ngn_per(c, d_(conv_on)) for c, qty in legs)
    print(f"  Equity:Conversion legs of {name} valued at the reference rate: NGN {fmt(v)} (= conversion cost)")

# ------------------------------------------------------------------ 5. Confidence and routing (C4)
print("\n=== 5. Routing under C4 (bands, producer, Wilson bound, tax weight, shared reference) ===")


def wilson_lower(k, n, z=D("1.959963984540054")):
    if n == 0:
        return D(0)
    p = D(k) / D(n)
    z2 = z * z
    return (p + z2 / (2 * n) - z * ((p * (1 - p) / n + z2 / (4 * n * n)).sqrt())) / (1 + z2 / n)


items = [("T1 AED->NGN (shared ref AE7781)", D("0.96"), "deterministic_rule", 0, 0, True, True),
         ("T2 NGN->USD (no shared ref; amount in narration)", D("0.85"), "deterministic_rule", 0, 0, False, False),
         ("Second 12 Oct fuel debit flagged possible bank duplicate", D("0.80"), "deterministic_rule", 41, 44, False, None),
         ("Aani AED 250 to mobile proxy", D("0.75"), "model", 0, 0, False, None)]
for name, p, prod, k, n, tax, shared in items:
    lb = wilson_lower(k, n)
    auto = p >= D("0.90") and prod != "model" and n >= 30 and lb >= D("0.90") and not tax and shared is not False
    print(f"  {name}: p {p}, producer {prod}, rule history {k}/{n} (Wilson LB {q2(lb)}), tax-weighted {tax}, "
          f"shared ref {'n/a' if shared is None else shared} -> {'auto-apply' if auto else 'review queue'}")
print("  Unexplained inflows before review: NGN 1,780,000.00 (T1 credit); after the user confirms T1: NGN 0.00")

# ------------------------------------------------------------------ 6. Currency pools (NGN, weighted average) and ETF lot (C1.6)
print("\n=== 6. Tax view: currency pools at weighted-average NGN cost; ETF lot (flag: s.34(1)(b), practitioner) ===")
pools = {"AED": [D("18400.00"), D("6660800.00")], "USD": [D("2150.00"), D("2857350.00")]}   # synthetic opening NGN cost
events = [  # (date, ccy, qty, kind, ngn_consideration or None -> official rate)
    ("2026-10-01", "AED", D("22000.00"), "acquire", None), ("2026-10-02", "AED", D("-9000.00"), "spend", None),
    ("2026-10-06", "AED", D("-612.35"), "spend", None), ("2026-10-09", "AED", D("-540.00"), "spend", None),
    ("2026-10-12", "AED", D("-250.00"), "spend", None), ("2026-10-18", "AED", D("-5000.00"), "exchange", D("1780000.00")),
    ("2026-10-18", "AED", D("-15.75"), "spend", None), ("2026-10-22", "USD", D("715.00"), "exchange", D("1000000.00")),
    ("2026-10-23", "USD", D("-701.00"), "spend", None), ("2026-10-25", "AED", D("-26.25"), "spend", None),
    ("2026-10-28", "AED", D("-180.00"), "spend", None), ("2026-10-30", "USD", D("9.60"), "acquire", None),
    ("2026-10-30", "USD", D("-2.88"), "spend", None)]
gain = {"AED": D(0), "USD": D(0)}
for dt, c, qty, kind, ngn in events:
    pq, pc = pools[c]
    if qty > 0:
        cost = ngn if ngn is not None else q2(F(qty) * ngn_per(c, d_(dt)))
        pools[c] = [pq + qty, pc + cost]
    else:
        relieved = q2(pc * (-qty) / pq)
        proceeds = ngn if ngn is not None else q2(F(-qty) * ngn_per(c, d_(dt)))
        gain[c] += proceeds - relieved
        pools[c] = [pq + qty, pc - relieved]
        if kind == "exchange" or (c == "USD" and qty == D("-701.00")):
            print(f"  {dt} {c} {fmt(-qty)} {kind}: proceeds NGN {fmt(proceeds)} vs relieved cost {fmt(relieved)} "
                  f"-> {'gain' if proceeds >= relieved else 'loss'} NGN {fmt(proceeds - relieved)}")
for c in pools:
    print(f"  {c} pool at 31 Oct: {fmt(pools[c][0])} units, NGN cost {fmt(pools[c][1])} (WA {pools[c][1] / pools[c][0]:.6f}); "
          f"October realised currency gain/loss (tax view) NGN {fmt(gain[c])}")
print(f"  Pool quantities equal ledger balances: AED {pools['AED'][0] == CLOSE['A2']}, USD {pools['USD'][0] == CLOSE['A3']}")
lot_cost_usd = D("701.00")
lot_tax_ngn = q2(F(lot_cost_usd) * ngn_per("USD", d_("2026-10-23")))
print(f"  New ETF lot: 2.8 units, cost USD {lot_cost_usd} incl. commission; tax_cost_ngn {fmt(lot_tax_ngn)} "
      f"(= USD pool disposal proceeds for the 701.00 spent)")

# ------------------------------------------------------------------ 7. Cash flow at transaction-date rates; charge audits
print("\n=== 7. October cash flow at transaction-date reference rates (C5.3 'net external flows') ===")
EXT = []   # (date, ccy, signed qty, group)
for acc, lines in STMT.items():
    for dt, narr, amt, ref, rail, other, cat, levy in lines:
        a = D(amt)
        if other.startswith(("Assets:InTransit", "EXCHANGE")) or narr.startswith("BUY 2.8"):
            continue
        if other.startswith("Income"):
            g = "income"
        elif other == "Expenses:BankCharge" or levy == "vat":
            g = "bank_charges_incl_vat"
        elif levy == "stamp_duty":
            g = "levies"
        elif levy == "wht":
            g = "withholding_tax"
        elif narr == "COMMISSION":
            g = "investing_cost"
        else:
            g = "spending"
        EXT.append((d_(dt), CCY[acc], a, g))
groups = ["income", "spending", "bank_charges_incl_vat", "levies", "withholding_tax", "investing_cost"]
tot = {}
for base in ("USD", "NGN"):
    for g in groups:
        tot[(base, g)] = sum(F(a) * ngn_per(c, d) / ngn_per(base, d) for d, c, a, gg in EXT if gg == g)
conv = {"USD": -T1["ngn"] / ngn_per("USD", d_("2026-10-18")) - T2["ngn"] / ngn_per("USD", d_("2026-10-20")),
        "NGN": -T1["ngn"] - T2["ngn"]}   # each exchange valued at its own conversion_on rate
for g in groups:
    nat = {c: sum(a for d, cc, a, gg in EXT if gg == g and cc == c) for c in ("NGN", "AED", "USD")}
    print(f"  {g:22} NGN {fmt(nat['NGN']):>15} AED {fmt(nat['AED']):>11} USD {fmt(nat['USD']):>8} | "
          f"USD view {fmt(tot[('USD', g)]):>10} | NGN view {fmt(tot[('NGN', g)]):>16}")
print(f"  {'conversion cost vs ref':22} {'(T1 + T2, confirmed)':>51} | USD view {fmt(conv['USD']):>10} | NGN view {fmt(conv['NGN']):>16}")
for base in ("USD", "NGN"):
    ns = sum(tot[(base, g)] for g in groups) + conv[base]
    print(f"  [{base} view] net saving {fmt(ns)}; savings rate {q2(ns / tot[(base, 'income')] * 100)}% of gross cash income")
u = {g: -tot[("USD", g)] for g in groups}
imp = -conv["USD"]
print(f"  Implicit conversion cost USD {fmt(imp)} vs bank charges incl. VAT USD {fmt(u['bank_charges_incl_vat'])}: "
      f"{q2(imp / u['bank_charges_incl_vat'])}x; vs charges + stamp duty {q2(imp / (u['bank_charges_incl_vat'] + u['levies']))}x; "
      f"vs all explicit costs incl. WHT and commission (USD {fmt(u['bank_charges_incl_vat'] + u['levies'] + u['withholding_tax'] + u['investing_cost'])}) "
      f"{q2(imp / (u['bank_charges_incl_vat'] + u['levies'] + u['withholding_tax'] + u['investing_cost']))}x")
print("  Pay-period attribute: the 1 Oct WPS credit has pay_period 2026-09; a pay-period view of October has no AED salary "
      "until the Oct salary arrives (due by 1 Nov). Cash-basis figures above are labelled 'cash basis'.")

print("\n  CAMF audit (0.5 per mille is a CAP: test charged <= cap; base definition unsourced)")
camf_lines = [D(x[2]) for x in A1 if x[4] in ("POS", "NIP", "USSD") and x[5] == "Expenses:Consumption" or x[5].startswith("Assets:InTransit:T2")]
gross = -sum(a for a in camf_lines if a < 0)
net = gross - sum(a for a in camf_lines if a > 0)
for label, base in (("gross customer-induced debits", gross), ("net of the reversed duplicate", net)):
    for rmode, rname in ((ROUND_HALF_EVEN, "half-even"), (ROUND_DOWN, "truncate")):
        cap = q2(base * D("0.0005"), rmode)
        print(f"    base {label} {fmt(base)}: cap ({rname}) {fmt(cap)}; charged 740.40 <= cap: {D('740.40') <= cap}")
print(f"    VAT 7.5% on 740.40 = {q2(D('740.40') * D('0.075'))} (printed 55.53)")

print("\n  Stamp-duty scope audit (NTA 2025 Ninth Schedule item 48 per Doc 6 F21; sender pays; >= NGN 10,000)")
for dt, narr, amt, ref, rail, other, cat, levy in A1:
    a = D(amt)
    if a < 0 and other in ("Expenses:Consumption",) or other == "Assets:InTransit:T2":
        if rail == "NIP":
            st = "in scope: charged" if a <= D("-10000") else "below threshold"
        elif rail in ("POS",):
            st = "SCOPE UNCONFIRMED (card/POS payment): no charge printed; flagged for practitioner, no alert"
        else:
            st = "below threshold" if a > D("-10000") else "scope unconfirmed"
        print(f"    {dt} {rail:4} {fmt(-a):>14} {st}")
print("    credits (salary, remittance) carry no duty because the sender pays, not because of an exemption")

# ------------------------------------------------------------------ 8. Net worth and exact decomposition (C5.3)
print("\n=== 8. Net worth and its exact decomposition (C5.3); sign check ===")
t0, t1 = d_("2026-09-30"), d_("2026-10-31")
open_q = {"NGN": OPEN["A1"], "AED": OPEN["A2"], "USD": OPEN["A3"]}
close_q = {"NGN": CLOSE["A1"], "AED": CLOSE["A2"], "USD": CLOSE["A3"]}
units0, units1, p0, p1, ptrade, dtrade = D("12"), D("14.8"), D("250.00"), D("257.50"), D("250.00"), d_("2026-10-23")
# flows: (date, ccy, qty, kind). Exchange legs are dated conversion_on (C1.5). The trade's 700.00 cash leg is internal
# (it becomes security value); the 1.00 commission is an external flow (a fall in market value, capitalised for tax).
FL = [(d, c, a, "external") for d, c, a, g in EXT]
FL += [(d_("2026-10-18"), "AED", D("-5000.00"), "exchange"), (d_("2026-10-18"), "NGN", D("1780000.00"), "exchange"),
       (d_("2026-10-20"), "NGN", D("-1000000.00"), "exchange"), (d_("2026-10-20"), "USD", D("715.00"), "exchange"),
       (dtrade, "USD", D("-700.00"), "trade_cash")]   # the 1.00 commission is already in EXT as investing_cost
chk = dict(open_q)
for d, c, a, k in FL:
    chk[c] += a
assert chk == close_q, (chk, close_q)
for base in ("NGN", "USD"):
    def x(c, d):
        return ngn_per(c, d) / ngn_per(base, d)
    W0 = sum(F(open_q[c]) * x(c, t0) for c in open_q) + F(units0 * p0) * x("USD", t0)
    W1 = sum(F(close_q[c]) * x(c, t1) for c in close_q) + F(units1 * p1) * x("USD", t1)
    ext = sum(F(a) * x(c, d) for d, c, a, k in FL if k == "external")
    convc = sum(F(a) * x(c, d) for d, c, a, k in FL if k == "exchange")
    market = F(units1 * p1 - units0 * p0 - (units1 - units0) * ptrade) * x("USD", t1)
    fx = {c: F(open_q[c]) * (x(c, t1) - x(c, t0)) + sum(F(a) * (x(c, t1) - x(c, d)) for d, cc, a, k in FL if cc == c)
          for c in open_q}
    fx["USD"] += F(units0 * p0) * (x("USD", t1) - x("USD", t0)) + F((units1 - units0) * ptrade) * (x("USD", t1) - x("USD", dtrade))
    assert ext + convc + market + sum(fx.values()) == W1 - W0, "C5.3 identity must hold exactly"
    parts = [q2(ext), q2(convc), q2(market)] + [q2(v) for v in fx.values()]
    rnd = q2(W1) - q2(W0) - sum(parts)
    print(f"  [{base} base] W0 (30 Sep, fixing {fixing(t0)[1]}) {fmt(W0)}  W1 (31 Oct, fixing {fixing(t1)[0]} {fixing(t1)[1]}) "
          f"{fmt(W1)}  change {fmt(q2(W1) - q2(W0))}")
    print(f"     net external flows {fmt(ext)} | conversion cost vs reference {fmt(convc)} | market {fmt(market)} | "
          + " | ".join(f"FX on {c} {fmt(v)}" for c, v in fx.items()) + f" | display rounding {rnd}  (identity exact: True)")
    path = [FIX[k] for k in sorted(FIX) if t0 <= k <= t1]
    monotone = all(a <= b for a, b in zip(path, path[1:])) or all(a >= b for a, b in zip(path, path[1:]))
    for c, v in fx.items():
        dx = x(c, t1) - x(c, t0)
        if dx != 0:
            exp_sign, got = (1 if dx > 0 else -1), (1 if v > 0 else -1 if v < 0 else 0)
            print(f"     sign check FX on {c}: rate path monotone {monotone}, long throughout, base per {c} "
                  f"{'up' if dx > 0 else 'down'} -> expected {'+' if exp_sign > 0 else '-'}, got {'+' if got > 0 else '-'}: "
                  f"{'OK' if got == exp_sign else 'FAIL: withhold figure'}")

# ------------------------------------------------------------------ 9. Line keys and idempotent re-import (C1.8; C1-I10)
print("\n=== 9. Line keys (C1.8) vs the v0.1 line_hash; re-import golden test ===")


def v01_hash(acc, rows, with_balance=True):
    bal, out = OPEN[acc], []
    for dt, narr, amt, *_ in rows:
        bal += D(amt)
        out.append(hashlib.sha256(f"{acc}|{dt}|{amt}|{narr.upper().strip()}|{bal if with_balance else ''}".encode()).hexdigest())
    return out


def c18_keys(acc, rows):
    seen, out = {}, []
    for dt, narr, amt, ref, *_ in rows:
        if ref:
            out.append((acc, "ref", ref, amt))
        else:
            k = (acc, dt, amt)
            seen[k] = seen.get(k, 0) + 1
            out.append((acc, "ord", dt, amt, seen[k]))
    return out


base_keys = set(c18_keys("A1", A1))
base_v01 = set(v01_hash("A1", A1))                                      # first import: PDF with a balance column
xlsx = [(r[0], r[1][:24], *r[2:]) for r in A1]                       # XLSX: narrations cut at 24 chars, no balance column
backdated = A1[:5] + [("2026-10-08", "POS PURCHASE PHARMACY", "-6400.00", None, "POS", "Expenses:Consumption", "pharmacy", None)] + A1[5:]
midday = A1[:-4]                                                          # 31 Oct export taken before month-end charges posted
for name, rows, wb in (("PDF re-upload of the same period", A1, True),
                       ("XLSX re-export (cut narrations, no balance)", xlsx, False),
                       ("later PDF with one back-dated line", backdated, True),
                       ("31 Oct mid-day PDF export", midday, True)):
    new = [k for k in c18_keys("A1", rows) if k not in base_keys]
    hs = v01_hash("A1", rows, with_balance=wb)
    print(f"  {name:44}: C1.8 new keys {len(new):2} | v0.1 line_hash new lines {len(set(hs) - base_v01):2}"
          f"{' | in-file collisions ' + str(len(hs) - len(set(hs))) if len(hs) != len(set(hs)) else ''}")
print("  In the XLSX variant the two 12 Oct fuel debits become identical under the v0.1 hash, so the second is silently "
      "skipped and the file fails its own balance check; C1.8 ordinals keep them distinct: "
      f"{c18_keys('A1', xlsx)[6] != c18_keys('A1', xlsx)[7]}")
print("  Mid-day export: overlap resolved at the last common row (row 15 of 19); the 4 missing trailing lines are not deletions")

# account resolver: HMAC of the normalised full identifier under an installation key (C1.3 account_identifier)
KEY = b"synthetic-installation-key"
nuban = "0123456789"
full = hmac.new(KEY, nuban.encode(), hashlib.sha256).hexdigest()[:16]
print(f"  Resolver: full NUBAN HMAC {full}... matches account A1 exactly; masked '******6789' and '012*******' create "
      f"candidates only, confirmed by the user on first sight (C1-I11)")

# ------------------------------------------------------------------ 10. Date-format plausibility (R04 B4)
print("\n=== 10. Date-format plausibility check (DD/MM vs MM/DD) ===")
raw = ["03/10", "05/10", "10/10", "12/10", "14/10", "19/10", "20/10", "26/10", "31/10"]
for fmt_name, dm in (("DD/MM", True), ("MM/DD", False)):
    ok = 0
    for r in raw:
        a, b = int(r[:2]), int(r[3:])
        day, mon = (a, b) if dm else (b, a)
        try:
            dd = date(2026, mon, day)
            ok += d_("2026-10-01") <= dd <= d_("2026-10-31")
        except ValueError:
            pass
    print(f"  {fmt_name}: {ok}/{len(raw)} dates fall inside the printed statement period 1-31 Oct 2026")
print("  -> DD/MM accepted; an ambiguous file (all dates <= 12) is quarantined for the user to confirm the format")
