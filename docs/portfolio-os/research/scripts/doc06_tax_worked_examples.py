"""Document 6 (Accounting, Audit and Taxation Framework) v0.2 -- worked examples and rule registry.

All money figures are SYNTHETIC. Nothing here is tax advice; simulated specialists, not licensed.
Standard library only (decimal, datetime, re, hashlib, argparse). Run with:

    python3 -I docs/portfolio-os/research/scripts/doc06_tax_worked_examples.py
    python3 -I docs/portfolio-os/research/scripts/doc06_tax_worked_examples.py \
        --nta /path/to/nta.txt --ntaa /path/to/ntaa.txt      # also checks every pinpoint

The optional gazette texts are `pdftotext -layout` extractions of
  NTA 2025  https://nass.gov.ng/documents/download/11249   (PDF sha256 41abf688...0fce94f)
  NTAA 2025 https://tat.gov.ng/Nigeria-Tax-Act-2025.pdf     (PDF sha256 eb3ea717...adef20e2)
both re-downloaded 2026-11-04. They are not committed (size, licence); the script fails loudly if a
path is given but missing.

What it reproduces (Doc 6 section in brackets):
  rule registry, status derivation, refusal and watermark per CANONICAL_CONTRACTS C7      [4.2]
  Example 1 split by year of assessment (NTA s.26(1), s.26(3)); deposit-interest branches  [4.8]
  Example 1 FX-field branches, naira-appreciation and loss cases (R06 m1)                   [4.8]
  Example 2 resident branch with the WHT credit (R06 m4)                                    [4.8]
  Example 3 per-commodity ledger (C1), VAT recomputation (V-001), USD pool (C1.6)          [4.8]
"""
import argparse
import hashlib
import re
import sys
from datetime import date
from decimal import Decimal as D, ROUND_HALF_EVEN

KOBO = D("0.01")


def q2(x):
    return x.quantize(KOBO, rounding=ROUND_HALF_EVEN)


# ----------------------------------------------------------------------------------------------
# 1. PIT bands (NTA 2025 Fourth Schedule via s.58) and helpers
# ----------------------------------------------------------------------------------------------
BANDS = [(D(800_000), D("0")), (D(2_200_000), D("0.15")), (D(9_000_000), D("0.18")),
         (D(13_000_000), D("0.21")), (D(25_000_000), D("0.23")), (None, D("0.25"))]


def pit(ci):
    tax, rest = D(0), D(ci)
    for width, rate in BANDS:
        part = rest if width is None else min(rest, width)
        if part <= 0:
            break
        tax += part * rate
        rest -= part
    return q2(tax)


def rent_relief(rent):
    return min(D("0.20") * rent, D(500_000))


def ngco_share_gain_exempt(proceeds_12m, gain_12m):
    # s.34(1)(a) proviso (i): proceeds "less than" 150m AND gain "does not exceed" 10m
    return proceeds_12m < D(150_000_000) and gain_12m <= D(10_000_000)


def chattel_exempt(consideration, annual_min_wage, is_currency=False):
    if is_currency:                       # s.52(5): never applies to currency
        return False
    return consideration <= max(D(5_000_000), 3 * annual_min_wage)


def stamp_duty(amount, salary=False, intra_bank_self=False):
    # Ninth Schedule item 48 (N50, transferor); s.184(i) exemptions
    if amount < D(10_000) or salary or intra_bank_self:
        return D(0)
    return D(50)


def vat(net):
    return q2(net * D("0.075"))           # s.147


def yoa(kind, event):
    """NG-BASIS-PERIOD-2026: s.26(1) employment current year; s.26(3) gains preceding year;
    s.22(1) trade = accounting period ending in the preceding year."""
    if kind == "employment":
        return event.year
    if kind == "investment":              # interest, rent, foreign dividends: s.26 is silent.
        return event.year                 # ASSUMPTION (E4): current year; recorded as a dispute
    if kind in ("chargeable_gain", "trade"):
        return event.year + 1
    raise ValueError("no basis-period rule for " + kind)


def ng_resident(limbs, composite_183=False):
    """s.201 'resident individual': any one limb (a)-(f) suffices on the text (branch A).
    Branch B (practitioner reading, S8): 183 days counts only with another limb."""
    a_e = [limbs[k] for k in ("domicile", "home", "abode", "ties")]
    days = limbs["days"] >= 183
    if composite_183:
        return any(a_e) or limbs["diplomat"]
    return any(a_e) or days or limbs["diplomat"]


# ----------------------------------------------------------------------------------------------
# 2. Rule registry (Doc 6 owns the list; CANONICAL_CONTRACTS C7 governs statuses)
# ----------------------------------------------------------------------------------------------
NTA_SHA = "41abf6887bc58a3c97116fd9a048aa91ad49c1cab156f39065a58401c0fce94f"
NTAA_SHA = "eb3ea717052f48492cc6441ad23f9e7ac2ad4782395db1c391580cc1adef20e2"
TRC_SHA = "5b4678c79286a66b503ef329c88d3892819eaa2323b53c23a0933fc08c1ba463"   # FTA TPGTR1 PDF
CTB_SHA = "dbee055b1b44b5b23f1d73574c28af33fe2fece27662c44005ceefe4b1e9724e"   # FTA CT bulletin
T3_SHA = "04e357357ad89e1c5897c941096c29208580105aa0235e98fc50557b9d9fd6b4"    # IRS Table 3
LIRS_SHA = "62982fa4d8509b6ad7a6c8aff5c2cf7423df6f1602539eab425abe88cd2b1743"  # lirs.gov.ng/publications HTML, 2026-11-04
WHTC_SHA = "ae51e354ded12679398fee8b80296b7b3c6f8fbdb7e4a3023cdd44e4b359142a"  # ISC commentary PDF (S9)

TEST_KINDS = ["threshold", "zero", "effective_date", "negative_scope", "alternatives", "rounding", "illustration"]


def R(rid, juris, eff, pin, snap, second, r06, tests, na=(), disputes=(), forced_draft=None, note=""):
    return dict(id=rid, juris=juris, eff=eff, pin=pin, snap=snap, second=second, r06=r06,
                tests=tests, na=dict(na), disputes=list(disputes), forced_draft=forced_draft, note=note)


def T(kind, fn, expected):
    return (kind, fn, expected)


NA_ALT = ("alternatives", "no alternative treatment recorded")
NA_ILL = ("illustration", "no published illustration retrieved")
NA_RND = ("rounding", "boolean output, no rounding")

RULES = [
    # ---------------- the 22 rules named in Doc 6 v0.1 ----------------
    R("NG-PIT-BANDS-2026", "NG", "2026-01-01", [("NTA", "58", "income tax payable on the chargeable income of an individual")],
      NTA_SHA, "S6 PwC personal income (29 May 2026)", True,
      [T("threshold", lambda: [pit(D(799_999)), pit(D(800_000)), pit(D(800_001))], [D(0), D(0), D("0.15")]),
       T("threshold", lambda: [pit(D(3_000_000)), pit(D(12_000_000)), pit(D(25_000_000)), pit(D(50_000_000))],
         [D(330_000), D(1_950_000), D(4_680_000), D(10_430_000)]),
       T("zero", lambda: pit(D(0)), D(0)),
       T("effective_date", lambda: [date(2025, 12, 31) >= date(2026, 1, 1), date(2026, 1, 1) >= date(2026, 1, 1)], [False, True]),
       T("negative_scope", lambda: "company" in ("individual_resident", "individual_nonresident"), False),
       T("rounding", lambda: pit(D("800000.07")), D("0.01")),
       T("illustration", lambda: pit(D(25_160_000)), D(4_716_800))], na=[NA_ALT]),
    R("NG-PIT-DEDUCTIONS-2026", "NG", "2026-01-01", [("NTA", "30", "eligible deductions\" include payments made by the individual")],
      NTA_SHA, "S6/S7 PwC (rent relief 20%, cap N500,000)", True,
      [T("threshold", lambda: [rent_relief(D(2_499_995)), rent_relief(D(2_500_000)), rent_relief(D(2_500_005))],
         [D(499_999), D(500_000), D(500_000)]),
       T("zero", lambda: rent_relief(D(0)), D(0)),
       T("effective_date", lambda: date(2026, 1, 1).year >= 2026, True),
       T("negative_scope", lambda: "company" == "individual", False),
       T("rounding", lambda: q2(rent_relief(D("1234567.89"))), D("246913.58"))], na=[NA_ALT, NA_ILL]),
    R("NG-RESIDENCY-2026", "NG", "2026-01-01", [("NTA", "201", "\"resident individual\" means an individual that")],
      NTA_SHA, "S8 SPA Ajibade (Legal 500, 27 Oct 2025)", True,
      [T("threshold", lambda: [ng_resident(dict(domicile=0, home=0, abode=0, ties=0, days=d, diplomat=0)) for d in (182, 183, 184)],
         [False, True, True]),
       T("zero", lambda: ng_resident(dict(domicile=0, home=0, abode=0, ties=0, days=0, diplomat=0)), False),
       T("effective_date", lambda: date(2026, 1, 1).year >= 2026, True),
       T("negative_scope", lambda: "company" == "individual", False),
       T("alternatives", lambda: [ng_resident(dict(domicile=0, home=0, abode=0, ties=0, days=200, diplomat=0), c) for c in (False, True)],
         [True, False])], na=[NA_RND, NA_ILL],
      disputes=["183-day limb stand-alone (text) vs composite (S8 practitioner reading)", "domicile is a legal concept: counsel"]),
    R("NG-CGT-SHARES-NGCO-2026", "NG", "2026-01-01", [("NTA", "34", "disposal proceeds, in aggregate, is less than N150,000,000")],
      NTA_SHA, "S11 KPMG Nigeria (2 Mar 2026)", True,
      [T("threshold", lambda: [ngco_share_gain_exempt(D("149999999.99"), D(1)), ngco_share_gain_exempt(D(150_000_000), D(1)),
                               ngco_share_gain_exempt(D(1), D(10_000_000)), ngco_share_gain_exempt(D(1), D("10000000.01"))],
         [True, False, True, False]),
       T("zero", lambda: ngco_share_gain_exempt(D(0), D(0)), True),
       T("effective_date", lambda: date(2026, 1, 1).year >= 2026, True),
       T("negative_scope", lambda: "foreign_company_share" == "nigerian_company_share", False),
       T("alternatives", lambda: q2(D(8_000_000) * (D(1) - D(60) / D(100))), D("3200000.00"))], na=[NA_RND, NA_ILL],
      note="alternatives test = proportional charge when 60% of proceeds are reinvested (s.34(1)(a)(iii) proviso)"),
    R("NG-CGT-FOREIGN-ASSETS-2026", "NG", "2026-01-01", [("NTA", "34", "any currency other than Nigerian currency")],
      NTA_SHA, "S11 KPMG Nigeria", True,
      [T("threshold", lambda: D(1) > 0, True), T("zero", lambda: D(0), D(0)),
       T("effective_date", lambda: date(2026, 1, 1).year >= 2026, True),
       T("negative_scope", lambda: chattel_exempt(D(1000), D(840_000), is_currency=True), False),
       T("alternatives", lambda: ["spend_is_disposal", "conversion_only_is_disposal"], ["spend_is_disposal", "conversion_only_is_disposal"]),
       T("rounding", lambda: q2(D("15310000") * D(2000) / D(10200)), D("3001960.78"))], na=[NA_ILL],
      disputes=["is every foreign-currency spend a disposal (C1.6 (i))", "cost method WA vs FIFO (C1.6 (ii))"]),
    R("NG-DIV-WHT-FINAL-2026", "NG", "2026-01-01", [("NTAA", "51", "franked investment income")],
      NTAA_SHA, "S9 WHT Regulations 2024 commentary (10%)", True,
      [T("threshold", lambda: q2(D("0.10") * D(400_000)), D("40000.00")), T("zero", lambda: q2(D("0.10") * 0), D("0.00")),
       T("effective_date", lambda: date(2026, 1, 1).year >= 2026, True),
       T("negative_scope", lambda: "foreign_dividend" == "nigerian_company_dividend", False),
       T("rounding", lambda: q2(D("0.10") * D("1234.55")), D("123.46"))], na=[NA_ALT, NA_ILL]),
    R("NG-INT-SHORTTERM-FINAL-2026", "NG", "2025-10-28", [("NTAA", "51", "Interest on short term securities and corporate bonds earned by an")],
      NTAA_SHA, "S10 Stren & Blan (T-bill WHT from 28 Oct 2025)", True,
      [T("threshold", lambda: q2(D("0.10") * D(1_000_000)), D("100000.00")), T("zero", lambda: D(0), D(0)),
       T("effective_date", lambda: [date(2025, 10, 27) >= date(2025, 10, 28), date(2025, 10, 28) >= date(2025, 10, 28)], [False, True]),
       T("negative_scope", lambda: "fgn_bond" in ("tbill", "commercial_paper", "corporate_bond"), False),
       T("rounding", lambda: q2(D("0.10") * D("999.95")), D("100.00"))], na=[NA_ALT, NA_ILL],
      disputes=["WHT on T-bills from 28 Oct 2025 rests on a FIRS directive; finality from NTAA s.51(5) only from its commencement (see NG commencement dispute)"]),
    R("NG-INT-DEPOSIT-2026", "NG", "2026-01-01", [("NTAA", "51", "final tax due from a non-resident recipient"),
                                                 ("NTA", "28", "under section 51 of Nigeria Tax Administration Act is the final tax")],
      NTAA_SHA, "S9 reg. 4(3) commentary: advance payment for residents", True,
      [T("threshold", lambda: q2(D("0.10") * D(600_000)), D("60000.00")), T("zero", lambda: D(0), D(0)),
       T("effective_date", lambda: date(2026, 1, 1).year >= 2026, True),
       T("negative_scope", lambda: "non_resident" == "resident", False),
       T("alternatives", lambda: [pit(D(16_660_000)) - D(60_000), pit(D(16_060_000))], [D("2868600.00"), D("2802600.00")]),
       T("rounding", lambda: q2(D("0.10") * D("0.05")), D("0.00"))], na=[NA_ILL],
      disputes=["Treatment A creditable (default; text E2)", "Treatment B final (unsourced practitioner reading; E4)"]),
    R("NG-BOND-EXEMPT-2026", "NG", "2026-01-01", [("NTA", "162", "income earned from bonds issued by a State or the Federal Govern")],
      NTA_SHA, "S10 (FGN bonds and OMO bills excepted from the directive)", True,
      [T("threshold", lambda: "fgn_bond" in ("fgn_bond", "state_bond"), True), T("zero", lambda: D(0), D(0)),
       T("effective_date", lambda: date(2026, 1, 1).year >= 2026, True),
       T("negative_scope", lambda: "tbill" in ("fgn_bond", "state_bond"), False)], na=[NA_ALT, NA_RND, NA_ILL]),
    R("NG-FOREIGN-PASSIVE-REMITTED-EXEMPT-2026", "NG", "2026-01-01", [("NTA", "162", "brought into Nigeria through approved channels")],
      NTA_SHA, "S7 PwC significant developments", True,
      [T("threshold", lambda: "authorised_dealer" in ("authorised_dealer",), True), T("zero", lambda: D(0), D(0)),
       T("effective_date", lambda: date(2026, 1, 1).year >= 2026, True),
       T("negative_scope", lambda: "kept_abroad" in ("authorised_dealer",), False),
       T("alternatives", lambda: ["exempt_if_approved_channel", "taxable_with_s119_credit"], ["exempt_if_approved_channel", "taxable_with_s119_credit"])],
      na=[NA_RND, NA_ILL], disputes=["scope of 'approved channels' (domiciliary account via authorised dealer?)"]),
    R("NG-FTC-UNILATERAL-2026", "NG", "2026-01-01", [("NTA", "119", "Unilateral relief of double taxation")],
      NTA_SHA, "S7 PwC foreign tax relief", True,
      [T("threshold", lambda: min(D(100), D(99)), D(99)), T("zero", lambda: min(D(0), D(50)), D(0)),
       T("effective_date", lambda: date(2026, 1, 1).year >= 2026, True),
       T("negative_scope", lambda: "foreign_tax_not_charged" == "charged", False),
       T("rounding", lambda: q2(D("4823750") * D(465000) / D(28065000)), D("79923.17"))], na=[NA_ALT, NA_ILL]),
    R("NG-TREATY-UAE", "NG", "2026-01-01", [("NTA", "120", "shall have effect upon ratification or domestication by the National As")],
      NTA_SHA, "S7 PwC treaty list (UAE absent); Orbitax 22 Jan 2024 (in force only on exchange of instruments)", True,
      [T("threshold", lambda: False, False), T("zero", lambda: D(0), D(0)),
       T("effective_date", lambda: date(2026, 1, 1).year >= 2026, True),
       T("negative_scope", lambda: "non_resident_claimant" == "resident", False),
       T("alternatives", lambda: ["in_force=false", "s120(5) deeming (rule draft)"], ["in_force=false", "s120(5) deeming (rule draft)"])],
      na=[NA_RND, NA_ILL], disputes=["NTA s.120(5) deeming of 'extant' agreements (see NG-TREATY-DEEMING-S120-5)"],
      note="parameter in_force=false: the rule computes 'no treaty relief'"),
    R("NG-STAMP-ETRANSFER-2026", "NG", "2026-01-01", [("NTA", "184", "electronic transfer or electronic receipts of money of a sum below"),
                                                     ("NTA", "Ninth Schedule", "Electronic receipt or Transfer of")],
      NTA_SHA, "PwC Nigeria corporate other taxes (29 May 2026), fetched 2026-11-04", True,
      [T("threshold", lambda: [stamp_duty(D("9999.99")), stamp_duty(D(10_000)), stamp_duty(D("10000.01"))], [D(0), D(50), D(50)]),
       T("zero", lambda: stamp_duty(D(0)), D(0)),
       T("effective_date", lambda: date(2026, 1, 1).year >= 2026, True),
       T("negative_scope", lambda: [stamp_duty(D(600_000), salary=True), stamp_duty(D(310_000), intra_bank_self=True)], [D(0), D(0)])],
      na=[NA_ALT, NA_RND, NA_ILL]),
    R("NG-VAT-RATE", "NG", "2026-01-01", [("NTA", "147", "charged on the value of all taxable supplies at the rate of 7.5%")],
      NTA_SHA, "PwC Nigeria corporate other taxes (7.5%), fetched 2026-11-04", False,
      [T("threshold", lambda: vat(D(1000)), D("75.00")), T("zero", lambda: vat(D(0)), D("0.00")),
       T("effective_date", lambda: date(2026, 1, 1).year >= 2026, True),
       T("negative_scope", lambda: "exempt_supply_s185" == "taxable_supply", False),
       T("rounding", lambda: vat(D(50)), D("3.75")), T("illustration", lambda: vat(D(50)), D("3.75"))], na=[NA_ALT],
      note="illustration = Doc 4's N3.75 VAT on a N50 fee"),
    R("NG-PENALTIES-2026", "NG", "2026-01-01", [("NTAA", "65", "Penalty and interest for non-payment of tax"), ("NTAA", "101", "Failure to file returns")],
      NTAA_SHA, None, True, [], forced_draft="no second source; amounts not yet parameterised with tests"),
    R("NG-DEADLINES-2026", "NG", "2026-01-01", [("NTAA", "14", "not later than 31st January of each")],
      LIRS_SHA, "PwC tax administration: returns within 90 days of year end (29 May 2026)", True,
      [T("threshold", lambda: [date(2027, 3, 31) <= date(2027, 3, 31), date(2027, 4, 1) <= date(2027, 3, 31)], [True, False]),
       T("zero", lambda: True, True), T("effective_date", lambda: date(2026, 1, 1).year >= 2026, True),
       T("negative_scope", lambda: "company" == "individual", False),
       T("alternatives", lambda: ["31 March (LIRS practice)", "statutory anchor unknown"], ["31 March (LIRS practice)", "statutory anchor unknown"])],
      na=[NA_RND, NA_ILL], disputes=["statutory anchor of 31 March not located in NTAA"]),
    R("AE-RESIDENCY-2023", "AE", "2023-03-01", [], TRC_SHA, "S21 UAE MoF notice on Cabinet Decision 85/2022", True,
      [T("threshold", lambda: [d >= 183 for d in (182, 183, 184)], [False, True, True]),
       T("zero", lambda: 0 >= 183, False), T("effective_date", lambda: date(2023, 3, 1) >= date(2023, 3, 1), True),
       T("negative_scope", lambda: "juridical_person" == "natural_person", False),
       T("alternatives", lambda: [(200 - 20) >= 183, 200 >= 183], [False, True])], na=[NA_RND, NA_ILL],
      note="alternatives = 200 days of which 20 are exceptional-circumstance days excluded (TPGTR1; R06 m2)"),
    R("AE-CT-NATURAL-PERSON-2024", "AE", "2024-01-01", [], CTB_SHA, "S20 TPGTR1 s.4.2 and S22 u.ae", True,
      [T("threshold", lambda: [t > D(1_000_000) for t in (D("999999.99"), D(1_000_000), D("1000000.01"))], [False, False, True]),
       T("zero", lambda: D(0) > D(1_000_000), False), T("effective_date", lambda: date(2024, 1, 1).year >= 2024, True),
       T("negative_scope", lambda: "wage_income" in ("business_turnover",), False),
       T("alternatives", lambda: [date(2026, 12, 31) <= date(2026, 12, 31), date(2027, 12, 31) <= date(2026, 12, 31)], [True, False])],
      na=[NA_RND, NA_ILL], note="alternatives = Small Business Relief available for a period ending 31 Dec 2026, lapses for 2027 unless extended (R06 m3)"),
    R("AE-VAT-RATE", "AE", "2018-01-01", [], None, None, False, [], forced_draft="no snapshot or second source recorded"),
    R("US-NRA-FDAP-30", "US", "2025-09-26", [], T3_SHA, None, True, [], forced_draft="IRC s.871(a)/s.1441 not read; IRS pages only; no second source"),
    R("US-ESTATE-NRA-60K", "US", "2025-09-01", [], None, None, True, [], forced_draft="Form 706-NA instructions not snapshotted; no second source"),
    R("US-W8BEN-VALIDITY", "US", "2021-10-01", [], None, None, True, [],
      forced_draft="no snapshot; add change-of-circumstances trigger (R06 m6)"),
    # ---------------- R06's nine additions ----------------
    R("NG-BASIS-PERIOD-2026", "NG", "2026-01-01", [("NTA", "26", "assets disposed during the year immediately preceding the year of assessment"),
                                                  ("NTA", "22", "profits of the accounting period immediately preceding the"),
                                                  ("NTAA", "13", "the amount of income from every source for the year preceding the")],
      NTA_SHA, "LIRS notice 24 Feb 2026 ('2026 year of assessment' return due 31 Mar 2026)", False,
      [T("threshold", lambda: [yoa("chargeable_gain", date(2026, 12, 31)), yoa("chargeable_gain", date(2027, 1, 1))], [2027, 2028]),
       T("zero", lambda: yoa("employment", date(2026, 1, 1)), 2026),
       T("effective_date", lambda: yoa("chargeable_gain", date(2025, 12, 31)), 2026),
       T("negative_scope", lambda: "trustee" in ("employment", "chargeable_gain", "trade"), False),
       T("alternatives", lambda: ["return filed by 31 Mar Y+1 reports YOA Y employment and YOA Y+1 gains",
                                  "YOA Y+1 gains reported with YOA Y+1 employment by 31 Mar Y+2"],
         ["return filed by 31 Mar Y+1 reports YOA Y employment and YOA Y+1 gains",
          "YOA Y+1 gains reported with YOA Y+1 employment by 31 Mar Y+2"])], na=[NA_RND, NA_ILL],
      disputes=["s.26(1) current-year employment vs NTAA s.13(2)(b) preceding-year return", "which return carries YOA Y+1 gains",
                "residency year for a gain assessed in YOA Y+1", "s.26(3) trade-asset exception repeats the general rule (drafting defect)",
                "basis period for investment income (interest, rent, dividends) not stated in s.26; current year assumed (E4)"],
      note="status capped at 'sourced' by CANONICAL_CONTRACTS C7; effective_date test: a 2025 disposal maps to YOA 2026 -> transition rule (draft)"),
    R("NG-PAYE-CREDIT-2026", "NG", "2026-01-01", [("NTAA", "51", "Income tax chargeable on an employee whether or not the assessment")],
      NTAA_SHA, None, False, [], forced_draft="no independent second source on PAYE as a credit (PwC pages silent, checked 2026-11-04)"),
    R("NG-WHT-RENT-NONRES-FINAL-2026", "NG", "2026-01-01", [("NTAA", "51", "final tax due from a non-resident recipient")],
      NTAA_SHA, "S9 reg. 4(3): final for non-residents", True,
      [T("threshold", lambda: q2(D("0.10") * D(6_000_000)), D("600000.00")), T("zero", lambda: D(0), D(0)),
       T("effective_date", lambda: date(2026, 1, 1).year >= 2026, True),
       T("negative_scope", lambda: "resident" == "non_resident", False),
       T("alternatives", lambda: [pit(D(6_000_000)) - D(600_000), pit(D(5_100_000)) - D(600_000)], [D("270000.00"), D("108000.00")]),
       T("rounding", lambda: q2(D("0.10") * D("123.45")), D("12.34"))], na=[NA_ILL],
      note="alternatives = resident branch, WHT credited, without and with N900,000 synthetic rental expenses (R06 m4)"),
    R("NG-LOSS-RELIEF-2026", "NG", "2026-01-01", [("NTA", "28", "the amount of loss incurred on the disposal of a chargeable asset")],
      NTA_SHA, None, False, [], forced_draft="proviso (ii) directs losses against trade profits only; s.28(2)(b)(i) cross-refers to itself; treatment for a non-trading individual unresolved"),
    R("NG-CHATTELS-2026", "NG", "2026-01-01", [("NTA", "52", "This section shall not apply to a disposal of currency of any description.")],
      NTA_SHA, None, False, [], forced_draft="no second source; minimum-wage parameter must be a sourced figure"),
    R("NG-FX-OFFICIAL-RATE-2026", "NG", "2026-01-01", [("NTA", "201", "\"official market rate\" means currency exchange market rate approved")],
      NTA_SHA, None, False, [], forced_draft="no source states which CBN field (central/buy/sell) or whether the definition governs gains (C1.6 (iii))"),
    R("NG-TREATY-DEEMING-S120-5", "NG", "2026-01-01", [("NTA", "120", "all extant double taxation agreements are deemed to have been made under")],
      NTA_SHA, None, False, [], forced_draft="interpretation unresolved; refuses every treaty-relief computation"),
    R("NG-WHT-NO-TAXID-2026", "NG", "2024-07-01", [], WHTC_SHA, None, False, [],
      forced_draft="Regulations' own text not read; commentary applies doubling to 'non-passive' transactions; scope for interest/dividends unclear"),
    R("US-NRA-CAPITAL-GAINS", "US", "2026-01-01", [], None, None, False, [], forced_draft="IRC s.871(a)(2) not read; no snapshot"),
    # ---------------- added by Doc 6 v0.2 ----------------
    R("NG-GIFT-MARKET-VALUE-2026", "NG", "2026-01-01", [("NTA", "36", "otherwise than by way of a bargain made at arm"),
                                                       ("NTA", "54", "the gains accruing from the disposal shall not be chargeable")],
      NTA_SHA, None, False, [], forced_draft="s.36(1)(a) market value vs s.36(2) last arm's-length price; LIRS gifts notice of 28 Sep 2026 not read"),
    R("NG-BASIS-TRANSITION-2025", "NG", "2026-01-01", [("NTA", "198", "shall not affect anything done under the enactments")],
      NTA_SHA, None, False, [], forced_draft="2025 disposals: CGT Act charge vs YOA 2026 under s.26(3) (CANONICAL_CONTRACTS C7: draft)"),
    R("NG-RECORDS-RETENTION-2026", "NG", "2026-01-01", [("NTAA", "31", "kept for a period not less than six years after the year of assessment")],
      NTAA_SHA, None, False, [], forced_draft="no second source; retention schedule applies the design default regardless (Doc 6 4.1)"),
]

ORDER = ["draft", "sourced", "reviewed_internal", "practitioner_confirmed"]


def run_tests(rule):
    fails = []
    for kind, fn, exp in rule["tests"]:
        got = fn()
        if got != exp:
            fails.append(f"{kind}: got {got!r} expected {exp!r}")
    return fails


def derive_status(rule):
    """C7 entry conditions. No rule can reach practitioner_confirmed in this pass."""
    if rule["forced_draft"]:
        return "draft", rule["forced_draft"]
    missing = [k for k in TEST_KINDS if k not in {t[0] for t in rule["tests"]} and k not in rule["na"]]
    if not rule["snap"]:
        return "draft", "no snapshot hash"
    if not rule["second"]:
        return "draft", "no second source"
    if missing:
        return "draft", "missing tests: " + ", ".join(missing)
    fails = run_tests(rule)
    if fails:
        return "draft", "failing tests: " + "; ".join(fails)
    if rule["id"] == "NG-BASIS-PERIOD-2026":
        return "sourced", "capped by contract C7 pending practitioner"
    if rule["r06"]:
        return "reviewed_internal", "R06 re-read the gazette text on 2026-11-04; all tests pass"
    return "sourced", "no independent internal re-read recorded"


def watermark(statuses):
    if any(s in ("draft", "superseded", "retired") for s in statuses):
        return "REFUSE"
    lowest = min(statuses, key=ORDER.index)
    return {"sourced": "DRAFT COMPUTATION - rule text sourced, not reviewed",
            "reviewed_internal": "INDICATIVE - not confirmed by a licensed tax practitioner",
            "practitioner_confirmed": "Rules practitioner-confirmed (not advice)"}[lowest]


STATUS = {}


def registry():
    print("=== Rule registry (CANONICAL_CONTRACTS C7) ===")
    counts = {}
    for r in RULES:
        s, why = derive_status(r)
        STATUS[r["id"]] = s
        counts[s] = counts.get(s, 0) + 1
        nt = len(r["tests"])
        print(f"{r['id']:<42} {s:<18} tests={nt:<2} {why}")
    print("rules:", len(RULES), "| by status:", counts)
    assert len(RULES) == 34
    assert len({r["id"] for r in RULES}) == 34
    assert counts.get("practitioner_confirmed", 0) == 0


def chain(ids):
    return watermark([STATUS[i] for i in ids])


# ----------------------------------------------------------------------------------------------
# 3. Pinpoint check against gazette text (R06 M2 fix)
# ----------------------------------------------------------------------------------------------
HEADINGS = {("NTA", "22"): "Basis for computing assessable profits", ("NTA", "26"): "Basis for computing assessable income",
            ("NTA", "28"): "Total income of an individual", ("NTA", "30"): "Ascertainment of chargeable income",
            ("NTA", "34"): "Chargeable assets", ("NTA", "36"): "Disposal of assets, provisions as to considerations",
            ("NTA", "52"): "Personal chattels", ("NTA", "54"): "Gifts", ("NTA", "58"): "Rates of tax for individuals",
            ("NTA", "119"): "Unilateral relief of double taxation", ("NTA", "120"): "Double taxation agreement",
            ("NTA", "147"): "Rate of VAT", ("NTA", "162"): "Income tax exemption", ("NTA", "163"): "Deductible donations",
            ("NTA", "184"): "Exemption from stamp duties", ("NTA", "198"): "Savings provisions",
            ("NTA", "201"): "General interpretation", ("NTA", "202"): "Citation",
            ("NTAA", "13"): "Income Tax Returns for Individuals", ("NTAA", "14"): "Pay As You Earn",
            ("NTAA", "31"): "Books of Account", ("NTAA", "33"): "Accreditation of Tax Agents", ("NTAA", "51"): "Deduction at source",
            ("NTAA", "65"): "Penalty and interest for non-payment of tax", ("NTAA", "101"): "Failure to file returns",
            ("NTAA", "147"): "Interpretation"}
EXTRA = [("NTA", "commencement", "[1st January, 2026]"), ("NTAA", "commencement", "[26th June, 2025]"),
         ("NTA", "201", "\"taxable person\" includes a company, individual or body of individuals"),
         ("NTAA", "147", "\"Taxable Person\" means person who carries out economic activity in a"),
         ("NTAA", "33", "No return shall be deemed as duly filed except filed by the taxpayer"),
         ("NTA", "120", "all extant double taxation agreements are deemed to have been made under")]


def norm(s):
    return re.sub(r"\s+", " ", s.replace("’", "'")).strip()


def pinpoints(paths):
    if not paths:
        print("\n=== Pinpoint check skipped (pass --nta and --ntaa to run it) ===")
        return
    texts = {}
    for k, p in paths.items():
        try:
            with open(p, encoding="utf-8", errors="replace") as fh:
                raw = fh.read()
        except OSError as e:
            sys.exit(f"FATAL: cannot read gazette text {p}: {e}")
        texts[k] = (raw, norm(raw))
    print("\n=== Pinpoint check against gazette text ===")
    bad = 0
    for (act, sec), head in HEADINGS.items():
        ok = re.search(r"^\s*" + re.escape(sec) + r"\.\s+" + re.escape(head), texts[act][0], re.M) is not None
        bad += not ok
        print(f"  {act} s.{sec:<4} heading '{head}': {'OK' if ok else 'NOT FOUND'}")
    anchors = [(a, s, q) for r in RULES for (a, s, q) in r["pin"]] + EXTRA
    for act, sec, quote in anchors:
        ok = norm(quote) in texts[act][1]
        bad += not ok
        print(f"  {act} {sec:<14} anchor '{quote[:58]}': {'OK' if ok else 'NOT FOUND'}")
    print("pinpoint failures:", bad)
    if bad:
        sys.exit("FATAL: pinpoint check failed")


# ----------------------------------------------------------------------------------------------
# 4. Worked examples
# ----------------------------------------------------------------------------------------------
def example1():
    print("\n=== Example 1: Nigerian-resident employee, split by year of assessment ===")
    salary, pension = D(18_000_000), D("0.08") * D(18_000_000)
    rr = rent_relief(D(3_000_000))
    ded = pension + rr
    interest, wht_i = D(600_000), D(60_000)
    paye = pit(salary - ded)
    print(f"deductions: pension {pension:,.0f} + rent relief {rr:,.0f} = {ded:,.0f}; PAYE on salary (chargeable {salary - ded:,.0f}) = {paye:,}")
    print("event mapping: salary 2026 -> YOA", yoa("employment", date(2026, 10, 26)),
          "| deposit interest 2026 -> YOA", yoa("investment", date(2026, 12, 31)), "(assumed)",
          "| US share disposal 15 Jun 2026 -> YOA", yoa("chargeable_gain", date(2026, 6, 15)))
    y26 = ["NG-BASIS-PERIOD-2026", "NG-PIT-BANDS-2026", "NG-PIT-DEDUCTIONS-2026", "NG-INT-DEPOSIT-2026", "NG-DIV-WHT-FINAL-2026"]
    print("YOA 2026 PIT chain:", chain(y26))
    res = {}
    for t, inc, credit in (("A", salary + interest, wht_i), ("B", salary, D(0))):
        ci = inc - ded
        tax = pit(ci)
        bal = tax - credit - paye
        res[t] = (ci, tax, bal)
        print(f"  Treatment {t}: total income {inc:,.0f} chargeable {ci:,.0f} PIT {tax:,} WHT credit {credit:,.0f}")
    print("YOA 2026 balance after PAYE chain:", chain(y26 + ["NG-PAYE-CREDIT-2026"]))
    for t in "AB":
        print(f"  [SANDBOX - not an output] Treatment {t}: balance on direct assessment {res[t][2]:,}")
    paye_norent = pit(salary - pension)
    print(f"  [SANDBOX] if the employer did not apply rent relief: PAYE {paye_norent:,}; Treatment A balance {res['A'][1] - wht_i - paye_norent:,} (negative = refund claim, NTAA s.55)")
    assert res["A"][2] == D(66_000) and res["B"][2] == D(0) and res["A"][1] == D("2928600.00")

    print("\nYOA 2027 (the gain). Chain:", chain(["NG-BASIS-PERIOD-2026", "NG-PIT-BANDS-2026", "NG-CGT-FOREIGN-ASSETS-2026", "NG-FX-OFFICIAL-RATE-2026"]))
    usd_cost, usd_proc = D(15_000), D(20_000)
    fx = {"central": (D(1500), D(1550)), "buy": (D(1495), D(1545)), "sell": (D(1505), D(1555))}
    base27 = {"A": salary + interest - ded, "B": salary - ded}
    for field, (r0, r1) in fx.items():
        gain = usd_proc * r1 - usd_cost * r0
        fxpart = usd_cost * (r1 - r0)
        marg = {t: pit(base27[t] + gain) - pit(base27[t]) for t in "AB"}
        print(f"  [SANDBOX] field={field:<7} cost {usd_cost * r0:,.0f} proceeds {usd_proc * r1:,.0f} gain {gain:,.0f} "
              f"(FX on cost {fxpart:,.0f}); marginal tax if 2027 income = 2026: A {marg['A']:,} B {marg['B']:,}")
        if field == "central":
            assert gain == D(8_500_000) and marg["A"] == D("1788200.00") and marg["B"] == D("1785000.00")
    print("  naira-appreciation and loss cases (R06 m1; synthetic sale rate 1,346.91 = the level Doc 4 reports, not a validated figure):")
    r1 = D("1346.91")
    for px in (D(200), D(160)):
        proc = 100 * px * r1
        gain = proc - usd_cost * D(1500)
        print(f"  [SANDBOX] sold at USD {px}: proceeds {proc:,.2f} gain {gain:,.2f} (FX on cost {usd_cost * (r1 - 1500):,.2f}; price part at sale rate {(100 * px - usd_cost) * r1:,.2f})")
    print("  loss chain:", chain(["NG-BASIS-PERIOD-2026", "NG-CGT-FOREIGN-ASSETS-2026", "NG-FX-OFFICIAL-RATE-2026", "NG-LOSS-RELIEF-2026"]),
          "-> loss relief (s.28(3)(b)) routed to practitioner")

    print("\nSensitivity, YOA 2026: US dividends USD 300 kept abroad (not 'approved channels') at synthetic N1,550/$")
    div, ftax = D(300) * 1550, D(90) * 1550
    ci = res["A"][0] + div
    tax = pit(ci)
    total_income = salary + interest + div
    attrib = q2(tax * div / total_income)
    credit = min(attrib, ftax)
    print(f"  chargeable {ci:,.0f} PIT {tax:,} attributable (s.119(3) proportional, on total income {total_income:,.0f}) {attrib:,}; "
          f"US tax {ftax:,.0f}; credit {credit:,}; unrelieved {ftax - credit:,}")
    print("  chain:", chain(y26 + ["NG-FOREIGN-PASSIVE-REMITTED-EXEMPT-2026", "NG-FTC-UNILATERAL-2026"]))


def example2():
    print("\n=== Example 2: UAE resident with Nigerian rent (N6,000,000) ===")
    rent, wht = D(6_000_000), D(600_000)
    print("  non-resident branch: 10% WHT final (NTAA s.51(2)) =", f"{wht:,}", "| chain:", chain(["NG-RESIDENCY-2026", "NG-WHT-RENT-NONRES-FINAL-2026"]))
    for exp in (D(0), D(900_000)):
        gross = pit(rent - exp)
        print(f"  resident branch, synthetic rental expenses {exp:,.0f}: PIT {gross:,} less WHT credit {wht:,} = extra {gross - wht:,}")
    print("  UAE side: 290 days >= 183 ->", 290 >= 183, "| chain:", chain(["AE-RESIDENCY-2023", "AE-CT-NATURAL-PERSON-2024"]))
    print("  treaty relief chain:", chain(["NG-TREATY-UAE"]), "(computes 'none');",
          "with s.120(5) deeming:", chain(["NG-TREATY-UAE", "NG-TREATY-DEEMING-S120-5"]))


def example3():
    print("\n=== Example 3: June ledger (C1 per-commodity postings), VAT recomputation, USD pool ===")
    N, U = "CUR:NGN", "CUR:USD"
    fee = D(1000)
    entries = {
        "open":     [("Assets:Bank:NG:A1", N, D(1_000_000)), ("Equity:Opening", N, D(-1_000_000))],
        "salary":   [("Assets:Bank:NG:A1", N, D(1_500_000)), ("Income:Employment", N, D(-1_500_000))],
        "rent":     [("Assets:Bank:NG:A1", N, D(-600_000)), ("Expenses:Consumption", N, D(600_000))],
        "rent_dup": [("Assets:Bank:NG:A1", N, D(-600_000)), ("Assets:Receivable:BankDispute:A1", N, D(600_000))],
        "rent_rev": [("Assets:Bank:NG:A1", N, D(600_000)), ("Assets:Receivable:BankDispute:A1", N, D(-600_000))],
        "charge":   [("Assets:Bank:NG:A1", N, -(fee + vat(fee))), ("Expenses:BankCharge", N, fee), ("Expenses:Tax:VAT", N, vat(fee))],
        "duty":     [("Assets:Bank:NG:A1", N, -stamp_duty(D(600_000))), ("Expenses:Tax:StampDuty", N, stamp_duty(D(600_000)))],
        "tr_out":   [("Assets:Bank:NG:A1", N, D(-310_000)), ("Assets:InTransit:TR-0601", N, D(310_000))],
        "tr_in":    [("Assets:InTransit:TR-0601", N, D(-310_000)), ("Equity:Conversion:NGN", N, D(310_000)),
                     ("Equity:Conversion:USD", U, D(-200)), ("Assets:Bank:NG:A2USD", U, D(200))],
    }
    for k, ps in entries.items():
        sums = {}
        for _, c, q in ps:
            sums[c] = sums.get(c, D(0)) + q
        assert all(v == 0 for v in sums.values()), (k, sums)
    print("  every entry balances per commodity: True (C1-I1)")
    assert vat(fee) == D("75.00"), "VAT recomputation"
    print(f"  bank charge {fee:,.0f} + VAT recomputed {vat(fee):,} = {fee + vat(fee):,} (v0.1 printed 50: wrong, V-001)")
    closing = sum(q for ps in entries.values() for a, c, q in ps if a == "Assets:Bank:NG:A1")
    print(f"  ledger closing NGN {closing:,} ; statement closing (synthetic) {closing:,} -> difference 0")
    assert closing == D("1588875.00")
    print(f"  if the statement showed {closing - 25_000:,}: UNEXPLAINED_DIFFERENCE 25,000.00, nothing posted")
    intr = sum(q for ps in entries.values() for a, c, q in ps if a.startswith("Assets:InTransit"))
    print("  in-transit nets to", intr, "(C1-I6)")
    ref = D(1540)
    cost_ref = D(310_000) - D(200) * ref
    print(f"  exchange: implied {D(310_000) / D(200)} NGN/USD; synthetic CBN central {ref}; cost vs reference {cost_ref:,} "
          f"({q2(cost_ref / D(310_000) * 100)}%, band NGN->USD [-1.0%, +4.0%] -> within)")
    pq, pc = D(10_000), D(15_000_000)
    pq, pc = pq + 200, pc + D(310_000)
    print(f"  USD pool after June purchase: USD {pq:,} NGN cost {pc:,} WA {q2(pc / pq)}  (v0.1 ignored this purchase, R06 M5)")
    me = D(1550)
    print(f"  30 Jun derived revaluation VIEW (not posted, C1 D3): value {pq * me:,} - cost {pc:,} = {pq * me - pc:,} unrealised")
    sell, r = D(2000), D(1560)
    relieved = q2(pc * sell / pq)
    gain = sell * r - relieved
    pq2, pc2 = pq - sell, pc - relieved
    print(f"  July: USD {sell:,} sold at {r}: proceeds {sell * r:,} relieved cost {relieved:,} realised gain (tax view) {gain:,}")
    print(f"  pool left USD {pq2:,} NGN cost {pc2:,}; cost conserved {relieved + pc2 == pc}")
    print(f"  v0.1 figure 120,000 assumed no June purchase: {sell * r - sell * 1500:,}")
    assert gain == D("118039.22")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--nta")
    ap.add_argument("--ntaa")
    a = ap.parse_args()
    registry()
    paths = {k: v for k, v in (("NTA", a.nta), ("NTAA", a.ntaa)) if v}
    if len(paths) == 1:
        sys.exit("FATAL: pass both --nta and --ntaa")
    pinpoints(paths)
    example1()
    example2()
    example3()
    print("\nwatermark self-test:", watermark(["practitioner_confirmed", "reviewed_internal", "sourced"]), "|",
          watermark(["practitioner_confirmed", "draft"]))


if __name__ == "__main__":
    main()
