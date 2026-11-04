Review of: Document 06 — Accounting, Audit and Taxation Framework (v0.1, 2026-11-02/04)  ·  Reviewer roles: Nigerian tax researcher reading statute text; UAE tax researcher; international-tax researcher; external-audit specialist; regulatory-perimeter researcher (all simulated, none licensed: nothing here is tax or legal advice, and a licensed Nigerian tax practitioner, a UAE-registered tax agent and counsel must still review)  ·  Date: 2026-11-04  ·  Verdict: **Major revision**

## 1. Verdict and the three most important problems

The document is unusually careful. Most of its statutory readings hold up against the gazette text, which I re-downloaded today, and every number in its arithmetic reproduces. However, the flagship worked example and the rule engine built on it contain legal-structure errors that the arithmetic checks cannot catch.

1. **Basis-period error (Blocking).** NTA s.26(3) assesses an individual's chargeable gains in the year of assessment *after* the year of disposal. NTAA s.13(2)(b) makes the return report income "for the year preceding the year of assessment". Example 1 puts a June 2026 gain into "the 2026 year of assessment". No rule record covers basis periods.
2. **The rule engine's refusal logic is undefined (Blocking).** It refuses when `status != confirmed`, but no rule has the status `confirmed`. The single specified record uses a fifth status that is not in the documented lifecycle. Example 1 then produces a "balance on direct assessment" from a rule marked unconfirmed, with no watermark. The text names 22 rules (not 20), and only one is specified.
3. **Provenance defects in E2 claims (Major).** The NTAA's own commencement bracket reads **26 June 2025**, not 1 January 2026. The residency and exemption provisions are cited as s.202 and s.163 but are s.201 and s.162. NTA s.120(5), which deems "extant" treaties to apply, is not discussed.

## 2. Findings, severity-ranked

Sources: the NTA was re-downloaded from https://nass.gov.ng/documents/download/11249 (215 pp.) and the NTAA from https://tat.gov.ng/Nigeria-Tax-Act-2025.pdf (93 pp.), both on 2026-11-04 and text-extracted with `pdftotext`. My NTA copy is byte-identical to the author's (`cmp`), so every discrepancy below is a reading error, not a difference between prints.

### Blocking

**B1 — §4.8 Example 1, §4.2, F13, F17: wrong basis period for gains; the return-year convention is not modelled.**
- *Claim:* Example 1 is a "2026 year of assessment" computation. It includes the gain on a US stock sold on 15 Jun 2026 and is "filed with LIRS by 31 March 2027".
- *Why it is wrong:* NTA s.26(1) taxes employment income in the year of assessment in which it is earned. NTA s.26(3), however, says the assessable income from disposals "shall be the amount of the chargeable gains accruing from assets disposed during the year immediately preceding the year of assessment". The June 2026 gain therefore belongs to year of assessment 2027. Separately, NTAA s.13(2)(b) requires the return to contain "income from every source for the year preceding the year of assessment". LIRS follows this convention: its notice of 24 Feb 2026 calls the return due 31 March 2026 the "2026 year of assessment" return (re-fetched https://lirs.gov.ng/publications, 2026-11-04). So the return due by 31 March 2027 is the 2027 return, not the 2026 one.
- *Consequences:*
  - On my recomputation (`r06_calc/recompute.py`), year-of-assessment 2026 under Treatment A is: chargeable income ₦16,660,000; PIT ₦2,928,600; balance ₦66,000 after PAYE and WHT credit. Under Treatment B the balance is nil.
  - The gain's marginal tax of ₦1,788,200 moves to 2027 and depends on 2027 income.
  - The golden test in the R2 success metric ("Example-1 reproduces to the naira") would lock in the wrong year.
  - There is an unaddressed transitional question. Year of assessment 2026 picks up gains on **2025** disposals, which were made while the Capital Gains Tax Act (10 %) was in force. Is there a double charge, or a gap?
  - There is an internal tension the document does not raise: s.26(1) taxes employment income on a current-year basis, while NTAA s.13(2)(b) requires the return to report preceding-year income.
- *Fix:* Add an `NG-BASIS-PERIOD-2026` rule covering employment (current year), gains (preceding year) and trade (s.22). Re-label and re-split Example 1. Add the transitional point and the s.13(2)(b) tension to §9.

**B2 — §4.2, R2, §6: the rule engine "refuses unconfirmed rules" only in prose, and its own vocabulary defeats the test.**
- *Claim:* The engine "refuses to compute when the only matching rule is `status != confirmed`", and the document delivers "the first 20 rule records".
- *Why it is wrong:*
  - The only fully specified record has `"status": "confirmed_text_unreviewed_by_practitioner"`.
  - The lifecycle described elsewhere is draft → `confirmed_text` → `confirmed_reviewed`. `NG-INT-DEPOSIT-2026` is "unconfirmed, two candidate treatments", and `NG-TREATY-UAE` is `not_in_force`.
  - No status equals `confirmed`. Taken literally, the engine refuses every rule. Read as a prefix match, it computes on rules no practitioner has reviewed.
  - Example 1 computes a filing-style balance from the unconfirmed deposit-interest rule and labels nothing "indicative".
  - Counting the names in §4.2 gives **22** rules (1 specified plus 21 named), not 20. Only one has parameters, and it has two test cases.
  - Rules the examples themselves rely on are missing: non-resident final WHT on rent (NTAA s.51(2)), PAYE credit (s.51(6)–(7)), basis period (B1), loss relief and ring-fencing (NTA s.28(3)), chattels (s.52), FX-rate source ("official market rate", s.201), treaty deeming (s.120(5)), WHT at double rate without a Tax ID (2024 Regulations), and US NRA capital gains.
  - The `confidence: 0.9` field has no defined method behind it.
  - No rule records or engine code exist anywhere in the repository; `grep` for `rule_id` finds only Docs 4 and 6.
- *Fix:* Define one status enumeration and the exact refusal predicate (for example, compute only if every rule used is ≥ `confirmed_text`; watermark unless all are `confirmed_reviewed`). Make the worked examples carry the watermark. Specify all records with parameters and at least one boundary test each. Correct the count. Drop the numeric confidence or define it.

### Major

**M1 — F7: the NTAA commencement date is contradicted by its own gazette text.** Both the TAT gazette copy and the Premium Times "approved copy to print" carry the commencement bracket "[26th June, 2025]". The NTA bracket is "[1st January, 2026]", as the document says. F7 grades "NTA 2025 and NTAA 2025 commenced 1 Jan 2026" as E2 but cites only the NTA and NRS Act brackets. Practice and press treat 1 Jan 2026 as the operative date, so this may be one of the December 2025 "two scripts" defects. Either way, the `effective_from` value for NTAA-sourced rules (s.8(2) Tax ID, s.51 finality, penalties) is genuinely uncertain for 26 Jun–31 Dec 2025. *Fix:* Record both dates in `disputes[]`, downgrade F7 for the NTAA to E3, and add the point to §9.

**M2 — F10, F12, F13, F23, §4.2: wrong section numbers in E2 rows.**
- "Resident individual", "non-resident individual" and "small company" are definitions in **s.201** (General interpretation). s.202 is the Citation section.
- The exemptions cited as s.163(1)(n), (s) and (t) are **s.162(1)(n), (s), (t)**. s.163 is "Deductible donations".
- The substance of each reading is correct. I confirmed the disjunctive "…temporary period of absence, or (f) serves as a diplomat…", and the conjunctive "and" in the non-resident definition.
- In a rules-as-data system, the section reference *is* the provenance, so these errors propagate straight into `source.section`.
- *Fix:* Correct every pinpoint and add a test that resolves each `source.section` against the stored gazette text.

**M3 — F14, §5: treaty analysis omits NTA s.120(5).** Section 120(5) provides that "all extant double taxation agreements are deemed to have been made under the provisions of this section and shall apply … with effect from 1st January of the year immediately following the date the agreement entered into force." If the UAE regards the agreement as in force, s.120(5) gives an argument, however weak, that the s.120(1) ratification requirement is satisfied for "extant" agreements. The document does not engage with this. I found no evidence of ratification. Search results (2026-11-04) show only the FEC approval of January 2024, and IFC Review describes that approval as "to sign" an agreement, which raises the question of whether the 2016 text was replaced. *Status:* "not available" is still the prudent coding, but the status itself is **unconfirmed**, not settled. *Fix:* Analyse s.120(5). Establish whether there is one agreement (2016) or two (2016 and 2024). Add both to the lawyer's item §9(j).

**M4 — §1 "Biggest uncertainty", F12, §7(1): deposit-interest finality can be largely narrowed on the text.**
- NTAA s.51(2) makes WHT on interest final only "from a **non-resident** recipient".
- s.51(3) (dividends) and s.51(5) ("Interest on short term securities and corporate bonds earned by an individual") are specific finality carve-outs. Bank deposits are not among them.
- NTA s.28(2)(b)(iv) excludes only income on which s.51 makes WHT "the final tax".
- The 2024 WHT Regulations treat WHT for residents as "an advance tax payment, which shall be set off" (reg. 4(3), per the ISC commentary, re-fetched 2026-11-04). NTA s.198(b) and NTAA s.146(c) keep those regulations in force.
- On the text, **Treatment A (creditable) is the default**. Position B is attributed to "practitioner reading of continuity with PITA practice" but has no source.
- *Fix:* Keep both treatments, but weight them. Grade A as E2 (text) and B as E4 (unsourced), and say so in §1. Practitioner sign-off is still required.

**M5 — §4.8 Example 3: arithmetic error in a golden test.** "Bank charge −1,050 (₦1,000 + 7.5 % VAT ₦50)": 7.5 % of ₦1,000 is **₦75**. The closing balance should be **₦1,588,875**, not ₦1,588,900. The script reproduces the error because it hard-codes −1,050. Doc 4 does the same calculation correctly (₦3.75 on a ₦50 fee). The −₦310,000 NGN→USD transfer is also never posted to the USD sub-ledger, so the USD weighted-average cost (₦1,500) ignores a June purchase. *Fix:* Correct the figure, post both legs of the transfer, and add a VAT-recomputation assertion to the test suite.

**M6 — F16, §9(g): conflicting "taxable person" definitions are not surfaced.** NTA s.201 defines "taxable person" to *include* "a company, **individual** …". NTAA s.147 defines it only by "economic activity … by way of trade or business". The document cites only the NTAA definition. Because the NTAA governs registration (s.4) and returns (s.13), the conflict decides whether a pure employee must register for a Tax ID and file. NTAA s.14(3) separately requires employees to file anyway. *Fix:* Cite both definitions and add the conflict to `disputes[]`.

**M7 — §3E F34, §4.6, §9: the regulatory perimeter for tax preparation is incomplete.**
- F34 rests on NTAA s.33 alone.
- For the commercial phase, the regime governing tax practice in Nigeria (I believe the Chartered Institute of Taxation of Nigeria Act restricts practice to registered members) is not examined. This is unconfirmed: I did not retrieve that Act.
- NTAA s.101 penalises "knowingly … incomplete or inaccurate returns", and s.33(4)(a) makes the taxpayer attest that the return is "true and complete". Pre-filled schedules therefore carry a product-liability question.
- *Fix:* Add both to the counsel items in §9.

**M8 — Cross-document contradiction on Nigerian fixed-income tax (see §5).** Doc 5a says "DMO states FGN securities' interest is tax-exempt" with no carve-out for T-bills. Doc 6 says T-bills attract 10 % WHT from 28 Oct 2025, which I confirmed at E3 (Stren & Blan, Legal 500, re-fetched; it names T-bills, CP, corporate bonds and promissory notes, and exempts FGN bonds and OMO bills). After-tax yields feeding Docs 3–5 will diverge unless this is reconciled.

### Minor

- **m1 (F4, §4.1):** The FX-rate basis is called "unconfirmed", but NTA s.201 defines "official market rate" as the rate "approved by the Central Bank of Nigeria". The open question is whether that definition governs gains computations, not whether a definition exists. Example 1 also only shows a naira *depreciation*. A realistic 2024→2026 path (Doc 4 uses NFEM ₦1,346.91/$ on 29 Oct 2026) would produce an FX *loss* on cost, and loss relief (s.28(3)(b)) has no rule.
- **m2 (F25):** The statement that "any part of a day counts" omits that TPGTR1 excludes days spent in the UAE because of exceptional circumstances, such as the medical-emergency example in §5.2.1.
- **m3 (F24):** The FTA bulletin attributes the natural-person registration timeline to *FTA Decision No. 3 of 2024*. Cite it as the lead for the "unconfirmed" deadline. Small Business Relief covers tax periods ending by 31 Dec 2026, so the document should say that it lapses for 2027 unless extended.
- **m4 (Example 2):** The resident branch should show the 10 % WHT as a credit (₦870,000 − ₦600,000 = ₦270,000 extra), plus allowable rental expenses. As written, it compares a gross liability with a final tax.
- **m5 (F22):** Drafting defects in the statute should go into `disputes[]`. Examples: s.28(2)(b)(i) cross-refers to "subsection (2)" (it means (3)); s.198(a) refers to itself; the Fourth Schedule preamble still mentions a "relief allowance" although the CRA is gone (I confirmed there is no "consolidated relief" in the text).
- **m6 (F30):** W-8BEN validity also ends early on a change in circumstances (IRS instructions, rev. 10/2021). The reminder logic needs a change-of-circumstances trigger.
- **m7 (F13/F5):** Gifts are not modelled. Under s.36(1)(a) a non-arm's-length disposal is deemed made at market value, and s.54 exempts only re-gifts of assets received by gift. Gifts of shares to family members therefore need a rule or a review flag; LIRS issued a gifts notice on 28 Sep 2026.

## 3. Evidence-grade audit

| Claim (section) | Stated grade | Assessment |
|---|---|---|
| NTAA commenced 1 Jan 2026 (F7) | E2 | **Contradicted** by the gazette bracket (26 Jun 2025). E3 at best for 1 Jan 2026 practice |
| Residency "s.202", exemptions "s.163" (F10, F12) | E2 | Substance confirmed; pinpoints wrong (s.201, s.162) |
| Treaty "not available" (F14) | E2/E3 | Omits s.120(5). Status unconfirmed (E3/E4), not settled |
| Deposit-interest Position B (§7.1) | presented as equal to A | Unsourced; E4. Position A has textual support (E2) |
| Example 1 as a "2026 YOA" liability (§4.8) | computed | Wrong basis period for the gain (B1) |
| "First 20 rule records" (§6, R2) | delivered | 22 names, 1 specified |
| `confidence: 0.9` (§4.2) | — | No method; E5 at most |
| Preparation permitted / commercial perimeter (F34) | E2+E4 | Tax-practice statute and liability not examined; E4 |
| Benford unsuitable on small samples (F6) | E3/E4 | Plausible; Cleary & Thibodeau (2005) on Type I errors supports it but is not cited |
| CMA replaced SCA, "financial advisory" licensable (F36) | E3 | Confirmed at E3 (K&S). Primary decree text not read; grade is appropriate |

The bands, rent relief, s.34 thresholds, s.34(1)(b), s.51(3)/(5), s.119 proportional credit, s.120(1), stamp-duty item 48 and s.184(i), NTAA ss.3, 6, 8(2), 13, 14, 29, 31(5), 33, 65, 100 and 101 are all **confirmed** against the gazette text (2026-11-04).

## 4. Citation and source spot-check

**Academic.** Doc 6 cites only two academic works (S45, S46). To reach the required eight, I verified those two plus seven works bearing on F1/F6 (third-party information and digit tests). All checks were DOI lookups on Crossref on 2026-11-04. OpenAlex hit its rate limit after one call, and I did not use the hosted MCP tool.

| # | Reference | DOI | Status |
|---|---|---|---|
| A1 | Nigrini & Mittermaier (1997), *Auditing: JPT* 16(2) 52–67 (S45) | 10.2308/ajpt-1302507 | verified (Crossref) |
| A2 | Hill (1995), *Statistical Science* 10(4) (S46) | 10.1214/ss/1177009869 | verified (Crossref + OpenAlex) |
| A3 | Cleary & Thibodeau (2005), Benford and Type I errors, *Auditing: JPT* 24(1) 77–81 | 10.2308/aud.2005.24.1.77 | verified; supports F6, not cited by Doc 6 |
| A4 | Nigrini (1996), taxpayer-compliance application of Benford, *JATA* 18(1) 72–91 | 10.2308/jata-6148128 | verified |
| A5 | Nigrini (2012), *Benford's Law* (Wiley) | 10.1002/9781119203094 | verified (title/publisher; author field empty in Crossref) |
| A6 | Kleven et al. (2011), "Unwilling or Unable to Cheat?", *Econometrica* 79(3) 651–692 | 10.3982/ECTA9113 | verified; third-party reporting supports F1's evidence hierarchy |
| A7 | Allingham & Sandmo (1972), *J. Public Econ.* 1, 323–338 | 10.1016/0047-2727(72)90010-2 | verified |
| A8 | Slemrod (2019), "Tax Compliance and Enforcement", *JEL* | 10.1257/jel.20181437 | verified |
| A9 | Pomeranz (2013), "No Taxation without Information", NBER WP 19199 | 10.3386/w19199 | verified (working paper) |
| A10 | Benford (1938), *Proc. Am. Philos. Soc.* | 10.2307/984802 (guessed) | not found on Crossref; unchecked |

**Non-academic (re-fetched 2026-11-04).**

| Source | URL | Status |
|---|---|---|
| S1 NTA gazette | nass.gov.ng/documents/download/11249 | confirmed; pinpoint errors (M2) and s.26(3)/s.120(5) omissions |
| S2a NTAA gazette | tat.gov.ng/Nigeria-Tax-Act-2025.pdf | confirmed provisions; **commencement contradicts F7** |
| S9 WHT Regs 2024 commentary | isc.ng/…/DEDUCTION-OF-TAX-AT-SOURCE-…pdf | reg. 4(3): advance payment for residents, final for non-residents. Supports Treatment A |
| S10 T-bill WHT (Stren & Blan) | legal500.com/…/firs-imposes-10-withholding-tax… | confirmed: effective 28 Oct 2025; FGN bonds and OMO exempt; silent on finality |
| S6/S7 PwC Nigeria | taxsummaries.pwc.com/nigeria/individual/income-determination | gains at PIT rates confirmed; last reviewed 29 May 2026; silent on deposit WHT finality |
| S12 LIRS publications | lirs.gov.ng/publications | confirmed: 31 Mar, 14 Apr and 21 Apr 2026; Tax ID notice 21 Jan 2026; "2026 YOA" label (B1) |
| S20 FTA TPGTR1 | tax.gov.ae/…/Tax-Resident-and-TRC--18-10-2024.pdf | confirmed: AED 1m; 183/90-day tests; TRC AED 50 + 500/1,000/1,750 |
| S25 FTA CT bulletin | tax.gov.ae//…/CT_TaxB_ulletin_EN_V5.pdf | confirmed: AED 1m from 2024; 0/9 % at AED 375k; SBR AED 3m; cites FTA Decision 3/2024 |
| S39 K&S on CMA | kslaw.com/…/2025-cma-decree-laws-february-2026 | confirmed (E3): 1 Jan 2026; 16 activities incl. "financial advisory"; ≥1 yr prison; AED 1m–250m; 1-yr regularisation |
| S27 IRS Table 3 | irs.gov/pub/irs-lbi/table-3-list-of-tax-treaties.pdf | confirmed: updated through 26 Sep 2025; no Nigeria/UAE |
| S29 W-8BEN instructions | irs.gov/instructions/iw8ben | confirmed: valid to end of third succeeding calendar year; 30 % rate (rev. 10/2021) |
| S30 Form 706-NA instructions | irs.gov/instructions/i706na | confirmed: USD 60,000; credit USD 13,000; US stock is US-situs; 15 treaty countries, not NG/UAE |
| S31 OECD AEOI | oecd.org/tax/transparency/documents/AEOI-commitments.pdf | confirmed: update 30 Sep 2026; UAE 2018, Nigeria 2020 |
| S32 Treasury FATCA | home.treasury.gov/…/foreign-account-tax-compliance-act | confirmed: UAE Model 1 in force 19 Feb 2016; Nigeria absent |
| S5 JRB PIT Guidelines | jrb.gov.ng/assets/2026-pit-guidelines-TJG3n9-T.pdf | still HTTP 404; unverified |

