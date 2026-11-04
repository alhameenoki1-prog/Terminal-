"""Canonical Contracts (CANONICAL_CONTRACTS.md) -- verification of every worked example.

v0.2 (2026-11-04): adds the checks for errata CC-1 to CC-12 (bitemporal view, behavioural templates,
corporate-action and sampling rules, Wilson minimum, trades in the FX decomposition, C7 chains and monitors).
Every v0.1 output line of C1-C6 is unchanged and new lines are appended; the C7 run lines are rebuilt (CC-5).

All inputs are SYNTHETIC unless a line says otherwise. Standard library only; run with:
    python3 -I docs/portfolio-os/research/scripts/contracts_checks.py
Money and rates use decimal.Decimal (or fractions.Fraction for exact rates); no floats touch money.
"""
from decimal import Decimal as D, getcontext, ROUND_HALF_EVEN, ROUND_DOWN
from fractions import Fraction as F
from datetime import date, timedelta
import hashlib
import math
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
    ref = D("1352.00")       # synthetic CBN NFEM rate (nfem_vwap), fixing date 30 Oct 2026 (conversion date)
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

    # (e) v0.2, CC-1: soft state is insert-only; superseded_at is derived in a view, never stored or updated
    postings_before = hashlib.sha256(repr(E2).encode()).hexdigest()
    classification = []                                          # insert-only table (C1-I4)
    classification.append({"id": "cl-1", "entry_id": "E2", "kind": "category", "category": "Investing:Funding",
                           "recorded_at": "2026-11-02T10:00"})
    classification.append({"id": "cl-2", "entry_id": "E2", "kind": "category", "category": "Investing:Contribution",
                           "recorded_at": "2026-11-03T09:00"})

    def with_superseded_at(rows):
        """View: superseded_at = recorded_at of the next row with the same lineage key (entry_id, kind)."""
        out = []
        for r in rows:
            later = [s["recorded_at"] for s in rows if (s["entry_id"], s["kind"]) == (r["entry_id"], r["kind"])
                     and (s["recorded_at"], s["id"]) > (r["recorded_at"], r["id"])]
            out.append({**r, "superseded_at": min(later) if later else None})
        return out

    def as_of(rows, t):
        live = [r for r in with_superseded_at(rows) if r["recorded_at"] <= t and
                (r["superseded_at"] is None or r["superseded_at"] > t)]
        return [r["category"] for r in live]

    view = with_superseded_at(classification)
    print("classification view (derived superseded_at):",
          [(r["id"], r["superseded_at"]) for r in view], "; stored rows have no superseded_at column:",
          all("superseded_at" not in r for r in classification))
    print("as_of_recorded 2026-11-02T23:59 ->", as_of(classification, "2026-11-02T23:59"),
          "; as_of_recorded 2026-11-04T00:00 ->", as_of(classification, "2026-11-04T00:00"))
    print("postings byte-identical after reclassification (C1-I12):",
          hashlib.sha256(repr(E2).encode()).hexdigest() == postings_before)


# ---------------------------------------------------------------- C2 figure tokens
STORE = {
    "fig_7a1": {"value": D("0.0812"), "field": "perf.twrr_1y", "unit": "fraction", "ccy": "USD", "status": "validated",
                "period": "per_1y", "scope": "pf_main"},
    "fig_7a2": {"value": D("-0.2345"), "field": "risk.max_drawdown", "unit": "fraction", "ccy": "USD", "status": "validated",
                "period": "per_1y", "scope": "pf_main"},
    "fig_7a3": {"value": D("4084410.00"), "field": "ledger.balance", "unit": "money", "ccy": "NGN", "status": "auto_validated",
                "period": None, "scope": "acct_a1"},
    "fig_7a4": {"value": D("1250000.00"), "field": "spend.total", "unit": "money", "ccy": "NGN", "status": "auto_validated",
                "period": "per_q3", "scope": "acct_a1"},
    "date_7a": {"value": date(2026, 10, 31), "field": "asof", "unit": "date", "ccy": None, "status": "validated",
                "period": None, "scope": None},
    "per_1y": {"value": (date(2025, 11, 1), date(2026, 10, 31)), "field": "period", "unit": "period", "ccy": None,
               "status": "validated", "period": None, "scope": None},
    "per_oct": {"value": (date(2026, 10, 1), date(2026, 10, 31)), "field": "period", "unit": "period", "ccy": None,
                "status": "validated", "period": None, "scope": None},
}

# v0.2 (RT-B, C2.2(2)): lexical rules. Text is NFKC-normalised and case-folded before word checks; format,
# control and numeral characters are rejected on the raw text; letters outside the allow-list are rejected.
_EN = """zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen
seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million billion
trillion zillion nil nought naught tens dozens hundreds thousands millions billions trillions first second third fourth
fifth sixth seventh eighth ninth tenth eleventh twelfth thirteenth fourteenth fifteenth sixteenth seventeenth
eighteenth nineteenth twentieth thirtieth fortieth fiftieth sixtieth seventieth eightieth ninetieth hundredth
thousandth millionth billionth once twice thrice half halves halved third thirds quarter quarters double doubled
triple tripled quadruple dozen couple k m bn mn tn"""
_OTHER = """okan ookan eji meji eta meta erin merin arun marun efa mefa eje meje ejo mejo esan mesan ewa mewa mokanla
mejila metala merinla meedogun ogun ogbon ogoji aadota ogota ogorun egberun miliyonu
daya biyu uku hudu biyar shida bakwai takwas tara goma ashirin talatin hamsin dari dubu miliyan
wahid ithnan ithnain thalatha arbaa khamsa sitta sabaa thamaniya tisaa ashara ishrun mia alf milyun
uno dos tres cuatro cinco seis siete ocho nueve diez doce trece catorce quince veinte treinta cien ciento mil millon
deux trois quatre cinq sept huit neuf dix onze douze vingt trente cent mille"""
_DATES = """january february march april may june july august september october november december jan feb mar apr jun
jul aug sep sept oct nov dec monday tuesday wednesday thursday friday saturday sunday mon tue tues wed thu thur thurs
fri sat sun eid sallah ramadan christmas xmas easter diwali"""
_CLAIMS = """all none every each both most majority minority few fewer several many more less higher lower greater
smaller larger bigger above below exceed exceeds exceeded than rose risen rise rises rising fell fallen fall falls
falling increase increased increases increasing decrease decreased decreases decreasing grew grown shrank shrunk
dropped declined jumped surged climbed plunged slumped yesterday today tonight tomorrow last next previous ago recent
recently lately earlier later day days daily week weeks weekly weekend fortnight month months monthly year years
yearly annual annually quarterly decade ytd mtd qtd"""
NUM_WORDS = set((_EN + " " + _OTHER + " " + _DATES).split())
CLAIM_WORDS = set(_CLAIMS.split())
WORD = re.compile(r"[a-z]+(?:['’][a-z]+)*")
ROMAN = re.compile(r"\b(?=[MDCLXVI]{2,}\b)M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})\b")
ALLOWED_CHARS = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .,;:!?'\"()-/&%\n"
                    "‘’“”–—…")
TOKEN_TYPES = {"fig", "calc", "count", "range", "date", "period", "dir", "quote", "name"}
AS_REQUIRED = {"fig", "calc", "count", "range", "date"}     # v0.2 (CC-2): as= is mandatory for every value-bearing type
OPTIONS = {"as", "per", "scope", "fmt"}


def render_value(f, fmt):
    v = f["value"]
    if fmt == "pct1":
        return f"{(v * 100).quantize(D('0.1'), rounding=ROUND_HALF_EVEN)}%"
    if fmt == "money":
        return f"{f['ccy']} {q2(v):,}"
    if fmt == "date_long":
        return f"{v.day} {v.strftime('%B %Y')}"
    if fmt == "period_long":
        a, b = v
        return f"{a.day} {a.strftime('%B %Y')} to {b.day} {b.strftime('%B %Y')}"
    if fmt == "int":
        return f"{int(v)}"
    if fmt == "times1":
        return f"{v.quantize(D('0.1'), rounding=ROUND_HALF_EVEN)}×"
    if fmt == "range_times1":
        lo, hi = v
        return (f"{lo.quantize(D('0.1'), rounding=ROUND_HALF_EVEN)}× to "
                f"{hi.quantize(D('0.1'), rounding=ROUND_HALF_EVEN)}×")
    raise ValueError(fmt)


def lint_numerals(payload):
    """Rules for any fixed or model text: characters, numerals, number words (several languages), dates.
    Returns the first violation only, in a fixed order, so each rejection names one cause."""
    for ch in payload:
        cat = unicodedata.category(ch)
        if cat in ("Cf", "Co", "Cs", "Cn") or (cat == "Cc" and ch not in "\n\t"):
            return [f"format/control character in text: U+{ord(ch):04X} {unicodedata.name(ch, '?')}"]
    if any(unicodedata.category(ch) == "Nd" for ch in payload):
        return [f"free digit in text: {payload!r}"]
    for ch in payload:
        if unicodedata.category(ch) in ("Nl", "No"):
            return [f"numeral character in text: U+{ord(ch):04X} {unicodedata.name(ch, '?')}"]
    norm = unicodedata.normalize("NFKC", payload)
    for ch in norm:
        if ch not in ALLOWED_CHARS:
            return [f"character outside the text allow-list: U+{ord(ch):04X} {unicodedata.name(ch, '?')}"]
    m = ROMAN.search(norm)
    if m:
        return [f"Roman numeral in text: {m.group(0)!r}"]
    for m in WORD.finditer(norm.lower()):      # allow-list leaves ASCII letters only, so positions are kept
        if m.group(0) in NUM_WORDS:
            return [f"number/date word in text: {norm[m.start():m.end()]!r}"]
    return []


def lint_text(payload):
    """Model-written connecting text: numeral rules, then quantifier, comparative, direction and relative-time
    words, which may only come from count, cmp, dir and period tokens."""
    errs = lint_numerals(payload)
    if errs:
        return errs
    norm = unicodedata.normalize("NFKC", payload)
    for m in WORD.finditer(norm.lower()):
        if m.group(0) in CLAIM_WORDS:
            return [f"quantity/direction/time word in model text: {norm[m.start():m.end()]!r}"]
    return []


def parse_token(payload):
    if not (payload.startswith("{{") and payload.endswith("}}")):
        return None
    head, *opts = payload[2:-2].split("|")
    if ":" not in head:
        return None
    typ, fid = head.split(":", 1)
    if typ not in TOKEN_TYPES or not re.fullmatch(r"[a-z0-9_.]+", fid):
        return None
    kv = {}
    for o in opts:
        k, _, v = o.partition("=")
        if k not in OPTIONS or not v or k in kv:
            return None
        kv[k] = v
    return typ, fid, kv


def validate_and_render(segments, allow):
    out, errors = [], []
    sentence = {"periods": set(), "fig_periods": set()}

    def close_sentence():
        if sentence["periods"] and sentence["fig_periods"] and sentence["periods"] != sentence["fig_periods"]:
            errors.append(f"period token {sorted(sentence['periods'])} does not match figure period "
                          f"{sorted(sentence['fig_periods'])} in the same sentence")
        sentence["periods"], sentence["fig_periods"] = set(), set()

    for kind, payload in segments:
        if kind == "text":
            errors += lint_text(payload)
            out.append(payload)
            if re.search(r"[.!?]", payload):
                close_sentence()
            continue
        if kind == "tpl":
            text, errs = render_template(*payload, allow)
            errors += errs
            out.append(text or "")
            continue
        parsed = parse_token(payload)
        if not parsed:
            errors.append(f"malformed token {payload!r}")
            continue
        typ, fid, kv = parsed
        if fid not in allow:
            errors.append(f"token id not returned by a tool this turn: {fid}")
            continue
        f = STORE[fid]
        as_field = kv.get("as")
        if typ in AS_REQUIRED and not as_field:
            errors.append(f"missing as= on {typ} token {fid}")
            continue
        if as_field and as_field != f["field"]:
            errors.append(f"semantic mismatch: {fid} is {f['field']}, model claimed {as_field}")
            continue
        if typ == "fig" and f["period"] and kv.get("per") != f["period"]:
            errors.append(f"period binding: {fid} covers {f['period']}, token says per={kv.get('per')}")
            continue
        if typ == "fig" and f["scope"] and kv.get("scope") != f["scope"]:
            errors.append(f"scope binding: {fid} belongs to {f['scope']}, token says scope={kv.get('scope')}")
            continue
        if typ == "period":
            sentence["periods"].add(fid)
        if typ == "fig" and f["period"]:
            sentence["fig_periods"].add(f["period"])
        if typ == "dir":
            out.append("rose" if f["value"] > 0 else "fell" if f["value"] < 0 else "was unchanged")
        else:
            out.append(render_value(f, kv.get("fmt")))
    close_sentence()
    return ("PASS", "".join(out)) if not errors else ("REJECT", errors)


# v0.2 (CC-2): behavioural sentences come only from registered Doc 3 templates. The model selects a template
# id and binds it to a stored construct output; slot types, as= fields and formats live in the registry.
RUNG_ORDER = ["L0a", "L0b", "L1", "L2b"]          # L2a (context) and L3 (hypothesis) never raise the rung
TEMPLATES = {
    "L1.after_income@0.2": {
        "rung": "L1", "status": "approved",
        "text": ("Over {cyc_n} pay cycles, spending in categories you marked as flexible during the {win_days} "
                 "days after salary arrived averaged {ratio} the rate on other days (approximate range {ci}). "
                 "This held in {cyc_held} of {cyc_n} cycles."),
        "slots": {"cyc_n": ("count", "behav.cycles_n", "int"), "win_days": ("count", "behav.window_days", "int"),
                  "ratio": ("calc", "behav.after_income_ratio", "times1"),
                  "ci": ("range", "behav.after_income_ratio_ci", "range_times1"),
                  "cyc_held": ("count", "behav.cycles_held", "int")}},
    "L2b.result@0.2": {"rung": "L2b", "status": "approved", "text": "(not used here)", "slots": {}},
}
CONSTRUCT_OUTPUTS = {   # synthetic construct output (placeholder values, not Doc 3's figures)
    "co_pay6": {"construct": "spending_after_income", "rung": "L1", "tier_ok": True,
                "templates": ["L1.after_income@0.2"],
                "figures": {"cyc_n": {"value": D(6), "field": "behav.cycles_n"},
                            "win_days": {"value": D(7), "field": "behav.window_days"},
                            "ratio": {"value": D("1.64"), "field": "behav.after_income_ratio"},
                            "ci": {"value": (D("1.51"), D("1.80")), "field": "behav.after_income_ratio_ci"},
                            "cyc_held": {"value": D(5), "field": "behav.cycles_held"}}},
}


def render_template(tpl_id, co_id, allow):
    t = TEMPLATES.get(tpl_id)
    if t is None or t["status"] != "approved":
        return None, [f"template not approved: {tpl_id}"]
    if co_id not in allow:
        return None, [f"construct output not returned by a tool this turn: {co_id}"]
    co = CONSTRUCT_OUTPUTS[co_id]
    if RUNG_ORDER.index(t["rung"]) > RUNG_ORDER.index(co["rung"]):
        return None, [f"template rung {t['rung']} above construct's current rung {co['rung']}"]
    if tpl_id not in co["templates"]:
        return None, [f"template {tpl_id} not listed in the {co['construct']} specification"]
    if not co["tier_ok"]:
        return None, ["inputs fail the C3 conclusion-driving tier: statistic withheld"]
    vals = {}
    for slot, (typ, field, fmt) in t["slots"].items():
        f = co["figures"][slot]
        if f["field"] != field:
            return None, [f"slot {slot} expects {field}, construct output has {f['field']}"]
        vals[slot] = render_value(f, fmt)
    return t["text"].format(**vals), []


def register_template(text):
    """Registration-time lint of a template's fixed text (slots removed): same rules as model text."""
    errs = lint_numerals(re.sub(r"\{[a-z_]+\}", "", text))
    return "REGISTER" if not errs else ("REFUSE REGISTRATION", errs)


def c2():
    print("\n=== C2 Figure-integrity contract ===")
    allow = {"fig_7a1", "fig_7a2", "fig_7a3", "fig_7a4", "date_7a", "per_1y", "per_oct"}
    cases = {
        "A good": [("text", "Your time-weighted return over the period "), ("tok", "{{period:per_1y|fmt=period_long}}"),
                   ("text", " was "), ("tok", "{{fig:fig_7a1|as=perf.twrr_1y|per=per_1y|scope=pf_main|fmt=pct1}}"),
                   ("text", " and the largest drawdown was "),
                   ("tok", "{{fig:fig_7a2|as=risk.max_drawdown|per=per_1y|scope=pf_main|fmt=pct1}}"), ("text", ", as of "),
                   ("tok", "{{date:date_7a|as=asof|fmt=date_long}}"), ("text", ".")],
        "B free digits": [("text", "You should expect 12% next year.")],
        "C number words": [("text", "Expect roughly twelve percent.")],
        "D mislabelled": [("text", "Drawdown was "), ("tok", "{{fig:fig_7a1|as=risk.max_drawdown|fmt=pct1}}")],
        "E invented id": [("text", "Balance "), ("tok", "{{fig:fig_9zz|fmt=money}}")],
        "F free date": [("text", "As of October your balance was "),
                        ("tok", "{{fig:fig_7a3|as=ledger.balance|scope=acct_a1|fmt=money}}")],
    }
    for k, segs in cases.items():
        print(k, "->", validate_and_render(segs, allow))
    # v0.2 template cases (CC-2)
    allow_b = allow | {"co_pay6"}
    tcases = {
        "G template": [("tpl", ("L1.after_income@0.2", "co_pay6"))],
        "H rung above construct": [("tpl", ("L2b.result@0.2", "co_pay6"))],
        "I construct not returned": [("tpl", ("L1.after_income@0.2", "co_pay6"))],
        "J missing as= on date": [("text", "As of "), ("tok", "{{date:date_7a|fmt=date_long}}")],
        # v0.2 (RT-B): binding to period and scope, and the lexical hardening
        "K period token vs figure": [("text", "Over the period "), ("tok", "{{period:per_oct|fmt=period_long}}"),
                                     ("text", " you spent "),
                                     ("tok", "{{fig:fig_7a4|as=spend.total|per=per_q3|scope=acct_a1|fmt=money}}"),
                                     ("text", ".")],
        "L wrong per= binding": [("text", "You spent "),
                                 ("tok", "{{fig:fig_7a4|as=spend.total|per=per_oct|scope=acct_a1|fmt=money}}")],
        "M wrong scope= binding": [("text", "You spent "),
                                   ("tok", "{{fig:fig_7a4|as=spend.total|per=per_q3|scope=acct_b2|fmt=money}}")],
        "N homoglyph": [("text", "Only \u043ene account failed to reconcile.")],
        "O quantifier": [("text", "All of your accounts reconcile.")],
    }
    for k, segs in tcases.items():
        print(k, "->", validate_and_render(segs, allow if k.startswith("I") else allow_b))
    for name, text in (("L4.no_anchor (Doc 3 v0.2 wording)", "This view needs one regular income date; your income "
                        "arrives on several dates, so it is not shown."),
                       ("L4.no_anchor (proposed)", "This view needs a single regular income date; your income "
                        "arrives on several dates, so it is not shown."),
                       ("L3 stem (Doc 3 v0.2 wording)", "One possibility is {hypothesis}; this could be checked when {data}."),
                       ("L3 stem (proposed)", "A possible explanation is {hypothesis}; this could be checked when {data}.")):
        print("template registration:", name, "->", register_template(text))


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

    # v0.2 (CC-3): a pending corporate action is a CA-record lifecycle plus freshness, not a validation state;
    # per-share calculations refuse when their inputs carry different corporate-action set versions.
    ca = {"id": "CA-0907", "kind": "bonus 1 for 10", "ex_date": date(2026, 11, 9), "state": "announced",
          "applied_ca_set": "cas-4"}
    shares = {"value": D("29000000000"), "ca_set_version": "cas-3"}
    for price_date, price_ca in ((date(2026, 11, 6), "cas-3"), (date(2026, 11, 10), "cas-4")):
        f_state = "ageing (open CA lifecycle)"
        if price_ca != shares["ca_set_version"]:
            verdict = (f"REFUSE per-share calc: ca_set_version {shares['ca_set_version']} (shares) vs {price_ca} "
                       f"(price on/after ex-date {ca['ex_date']})")
        else:
            verdict = "per-share calc allowed; shares outstanding badge 'ageing: corporate action pending'"
        print(f"{ca['id']} {ca['kind']} state={ca['state']}: price dated {price_date} -> F(shares)={f_state}; {verdict}")

    # v0.2 (RT-A): independence is recorded per validation event and drives the label, not the eligibility
    rank = ["simulated_agent", "self", "second_person", "licensed"]
    label = {"self": "chip 'self-checked'", "simulated_agent": "chip 'checked by software'",
             "second_person": "plain validated display", "licensed": "plain validated display"}
    for events in (["self"], ["simulated_agent"], ["self", "second_person"], ["licensed"]):
        best = max(events, key=rank.index)
        print(f"validation events {events} -> independence {best}: {label[best]}; tier unchanged")
    inputs = ["second_person", "self"]
    print(f"total from inputs with independence {inputs} -> weakest {min(inputs, key=rank.index)}: "
          f"'includes self-checked figures'")

    # v0.2 (CC-10): single-source sampling floor = max(ceil(n/20), min(n, 4)) human checks a year
    print("single-source sampling per series per year (editions -> human checks):")
    for name, n in (("daily FX or price, 250 editions", 250), ("monthly CPI, 12", 12), ("quarterly, 4", 4),
                    ("semi-annual country-risk edition, 2", 2), ("annual, 1", 1)):
        new = max(math.ceil(n / 20), min(n, 4))
        print(f"   {name}: v0.1 1-in-20 expects {D(n) / 20}; v0.2 -> {new}")


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
    # v0.2 (CC-8): the Wilson condition alone sets the minimum; with no errors it needs 35 confirmations
    for k, n in ((30, 30), (34, 34), (35, 35)):
        print(f"rule precision {k}/{n}: Wilson 95% lower bound {wilson_lower(k, n):.4f} -> "
              f"{'may auto-apply' if wilson_lower(k, n) >= D('0.90') else 'provisional: outputs go to review'}")
    n_min = next(n for n in range(1, 200) if wilson_lower(n, n) >= D("0.90"))
    print(f"smallest error-free track record with lower bound >= 0.90: {n_min} confirmations")
    # v0.2 (CC-11): sensitivity weight routes to review like tax weight
    for name, c, producer, ngn, tax, sensitive in (("Family transfer 150,000", D("0.99"), "counterparty_memory",
                                                    D("150000"), False, "family"),):
        auto = c >= D("0.90") and producer != "model" and not tax and not sensitive
        print(f"{name}: band {band(c)}, producer {producer}, tax-weighted {tax}, sensitivity {sensitive} -> "
              f"{'auto-apply (reversible)' if auto else 'review queue; never bulk-accepted'}; priority {q2(ngn * (1 - c))}")


# ---------------------------------------------------------------- C5 FX decomposition
RATES = {date(2026, 9, 30): D("1530.00"), date(2026, 10, 15): D("1505.00"), date(2026, 10, 16): D("1500.00"),
         date(2026, 10, 20): D("1495.00"), date(2026, 10, 26): D("1490.00"), date(2026, 10, 28): D("1485.00"),
         date(2026, 10, 30): D("1480.00")}   # synthetic CBN NFEM rate (nfem_vwap), NGN per USD; fixing dates only
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

    # v0.2 (CC-7): a security trade inside the period. The cash leg and the security leg at execution price are
    # internal and cancel; the commission is an external flow (an "investing costs" sub-line) even though C1.6
    # capitalises it into tax cost.
    print("trade inside the period (synthetic): 26 Oct buy 2.8 ETF @ 252.00 + commission 1.00 USD")
    d_tr = date(2026, 10, 26)
    cash0, n0, n_buy, p_exec, fee = D("3000.00"), D("10"), D("2.8"), D("252.00"), D("1.00")
    gross = n_buy * p_exec
    cash1, n1 = cash0 - gross - fee, n0 + n_buy
    for base in ("NGN", "USD"):
        def x(c, d):
            return ngn_per(c, d) / ngn_per(base, d)
        W0 = (F(cash0) + F(n0 * p0)) * x("USD", t0)
        W1 = (F(cash1) + F(n1 * p1)) * x("USD", t1)
        investing_costs = -F(fee) * x("USD", d_tr)
        trade_internal = (-F(gross) + F(n_buy * p_exec)) * x("USD", d_tr)
        market = F(n1 * p1 - n0 * p0 - n_buy * p_exec) * x("USD", t1)
        fx = (F(cash0) + F(n0 * p0)) * (x("USD", t1) - x("USD", t0)) \
            + (-F(gross) - F(fee) + F(n_buy * p_exec)) * (x("USD", t1) - x("USD", d_tr))
        exact = investing_costs + trade_internal + market + fx == W1 - W0
        wrong = trade_internal + market + fx == W1 - W0     # commission treated as capitalised (no flow)
        print(f"   [{base} base] change {q2(W1 - W0):,} = investing costs {q2(investing_costs):,} | trade (internal) "
              f"{q2(trade_internal):,} | market {q2(market):,} | FX on USD {q2(fx):,}; identity exact={exact}; "
              f"identity if the commission is left out={wrong}")


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


# Rule statuses as derived in Doc 6 v0.2 §4.2 (2026-11-04), plus the investment-income basis limb that v0.2 of
# this contract splits out of NG-BASIS-PERIOD-2026 (CC-6). Statuses are inputs here, not claims about the law.
RULES = {"NG-PIT-BANDS-2026": "reviewed_internal", "NG-PIT-DEDUCTIONS-2026": "reviewed_internal",
         "NG-RESIDENCY-2026": "reviewed_internal", "NG-INT-DEPOSIT-2026": "reviewed_internal",
         "NG-BASIS-PERIOD-2026": "sourced", "NG-BASIS-INVESTMENT-2026": "draft",
         "NG-PAYE-CREDIT-2026": "draft", "NG-CGT-FOREIGN-ASSETS-2026": "reviewed_internal",
         "NG-FX-OFFICIAL-RATE-2026": "draft", "US-ESTATE-NRA-60K": "draft", "US-W8BEN-VALIDITY": "draft"}


def run(label, chain, value, rules=RULES, disputes_siblings=()):
    """Watermark or refuse a run. A dispute's branches are shown together or not at all (C7 v0.2)."""
    statuses = [rules[r] for r in chain]
    blocked = [r for r in chain if rules[r] in ("draft", "superseded", "retired")]
    sib_blocked = [r for sib in disputes_siblings for r in sib if rules[r] in ("draft", "superseded", "retired")]
    if blocked or sib_blocked:
        why = ", ".join(sorted(set(blocked))) if blocked else "sibling branch refused (" + ", ".join(sorted(set(sib_blocked))) + ")"
        return f"{label}: REFUSE ({why}); SANDBOX - not an output: {value:,}"
    return f"{label}: {value:,} [{watermark(statuses)}]"


def c7():
    print("\n=== C7 Tax rule lifecycle and basis period (Doc 6 Example 1 inputs) ===")
    print("June 2026 disposal assessed in YOA", yoa_for("chargeable_gain", date(2026, 6, 15)),
          "; 2026 salary assessed in YOA", yoa_for("employment", date(2026, 10, 26)))
    salary, interest, wht, paye_tax = D("18000000"), D("600000"), D("60000"), D("2802600")
    ded, gain = D("1940000"), D("8500000")
    base = ["NG-PIT-BANDS-2026", "NG-PIT-DEDUCTIONS-2026", "NG-RESIDENCY-2026", "NG-INT-DEPOSIT-2026",
            "NG-BASIS-PERIOD-2026"]
    chain_a = base + ["NG-BASIS-INVESTMENT-2026"]       # Treatment A aggregates 2026 interest into a YOA
    chain_b = base                                      # Treatment B: interest WHT final, no YOA allocation
    pit_a, pit_b = pit(salary + interest - ded), pit(salary - ded)
    print(run("YOA 2026 gross PIT, Treatment A (interest aggregated, WHT credited)", chain_a, pit_a))
    print(run("YOA 2026 gross PIT, Treatment B (interest WHT final)", chain_b, pit_b, disputes_siblings=[chain_a]))
    print(run("YOA 2026 balance after PAYE, Treatment A", chain_a + ["NG-PAYE-CREDIT-2026"],
              max(pit_a - wht - paye_tax, D(0))))
    print(run("YOA 2026 balance after PAYE, Treatment B", chain_b + ["NG-PAYE-CREDIT-2026"],
              max(pit_b - paye_tax, D(0)), disputes_siblings=[chain_a]))
    ci27 = salary + interest - ded
    print(run("YOA 2027 marginal tax of the gain if 2027 income equals 2026 (Treatment A)",
              chain_a + ["NG-CGT-FOREIGN-ASSETS-2026", "NG-FX-OFFICIAL-RATE-2026"], pit(ci27 + gain) - pit(ci27)))
    what_if = dict(RULES, **{"NG-BASIS-INVESTMENT-2026": "sourced"})
    print("status what-if, NG-BASIS-INVESTMENT-2026 sourced:")
    print("  ", run("gross PIT A", chain_a, pit_a, rules=what_if), "|",
          run("gross PIT B", chain_b, pit_b, rules=what_if, disputes_siblings=[chain_a]))
    print("watermark examples:")
    for st in (["practitioner_confirmed", "reviewed_internal", "sourced"], ["practitioner_confirmed"] * 3,
               ["reviewed_internal", "reviewed_internal"], ["practitioner_confirmed", "draft"]):
        print("  ", st, "->", watermark(st))
    tests = [(D("800000"), D("0")), (D("800001"), D("0.15")), (D("3000000"), D("330000")), (D("25160000"), D("4716800"))]
    print("PIT band boundary tests:", all(pit(a) == b for a, b in tests))

    # v0.2 (CC-4): monitors. Presence mode runs on data facts only while the rule is draft; threshold or date
    # mode needs the rule at sourced or above and carries the run's watermark. No mode ever says "no action".
    print("monitors (rule_class = monitor; never a tax amount, liability or filing field):")
    us_situs_usd = D("20000.00")      # Doc 6 Example 1: US-domiciled shares held before the sale (synthetic)
    w8_signed = date(2024, 5, 10)     # synthetic questionnaire answer
    for rules in (RULES, dict(RULES, **{"US-ESTATE-NRA-60K": "sourced", "US-W8BEN-VALIDITY": "sourced"})):
        st_e, st_w = rules["US-ESTATE-NRA-60K"], rules["US-W8BEN-VALIDITY"]
        if st_e == "draft":
            e = ("presence mode: holdings of US-domiciled securities exist (data fact) -> reminder 'US estate tax may "
                 "apply to US assets of non-US persons; the rule is not yet sourced here, so no threshold is applied'")
        else:
            threshold = D("60000")    # stands in for the sourced rule record's parameter (Doc 6 F31; Form 706-NA)
            e = (f"threshold mode [{watermark([st_e])}]: US-situs value {us_situs_usd:,} vs rule threshold "
                 f"{threshold:,} -> {'ALERT' if us_situs_usd > threshold else 'watching (below threshold)'}")
        if st_w == "draft":
            w = (f"presence mode: W-8BEN recorded as signed {w8_signed} -> reminder 'validity rule not yet sourced "
                 f"here; confirm with the broker'")
        else:
            expiry = date(w8_signed.year + 3, 12, 31)   # end of the third succeeding calendar year (rule record)
            w = f"date mode [{watermark([st_w])}]: valid to {expiry}; reminder from {expiry - timedelta(days=90)}"
        print(f"   rules {st_e}/{st_w}: estate -> {e}")
        print(f"   rules {st_e}/{st_w}: W-8BEN -> {w}")


if __name__ == "__main__":
    c1(); c2(); c3(); c4(); c5(); c6(); c7()
