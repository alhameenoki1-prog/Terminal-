Review of: Document 5a — Institutional Investment Research Methodology and Data-Quality Framework (v0.1, 2026-11-02, re-checked 2026-11-04)  ·  Reviewer roles: finance professor; quantitative analyst; emerging-markets portfolio manager (NGX/DFM/ADX); independent data-quality function (all simulated, none licensed)  ·  Date: 2026-11-04  ·  Verdict: **Accept with required changes.** The framework in §4.1, §4.5 and §4.10 can go forward. The bank module (§4.3), the cost-of-equity routes (§4.4) and Worked Example 1 must be reworked before the Investment Committee sees them.

## 1. Verdict and the three most important problems

The core of the document holds up: provenance comes first, market rules live in a versioned registry, every value is shown as a range, and invalidation conditions are written down. Most market facts I re-fetched are confirmed. The trouble is in the parts the document ranks as Personal-MVP must-haves (R5, and R8 by implication). They contain errors that the document's own gates should have caught.

1. **Example 1 breaks the document's own rules and contains arithmetic and definitional errors.** Its FY2025 and H1-2026 inputs are "stale" under §4.10, yet the note is labelled "current". It says "all inputs V2+" but carries a V1 row. It reports FX gains as "27.5% of PBT" when the figure is a share of profit after tax (PAT). It nets pre-tax gains off post-tax profit. Its growth and payout assumptions are inconsistent with each other. And the low end of its cost-of-equity grid (23%) sits below both of the routes that are supposed to produce it.
2. **The NGN cost-of-equity route is not Damodaran's method, and the method choice that matters most is missing.** The rating-based and CDS-based premiums in the same July 2026 sheet differ by about 3 pp for Nigeria (12.24% against 9.27%). That gap is larger than the analyst-versus-economist disagreement the document preserves.
3. **The bank module misses binding CBN rules.** These are the CET1 and leverage minimums, the capital conservation buffer and D-SIB surcharge (effective CAR floors of 16% and 17%, not 15%), the bar on paying dividends from FX revaluation gains, and the June 2025 dividend suspension for banks under forbearance. The module also treats IFRS 9 Stage 3 as if it were the prudential NPL ratio, and it contradicts Doc 6 on the tax treatment of T-bills and dividends.

## 2. Findings, severity-ranked

### Blocking

**B1 — §4.11 Example 1: the note fails its own freshness and validation gates.**
- *Claim:* "Status: current · Data-quality check: passed 2026-11-04 (all inputs V2+)."
- *Why it is wrong:* The §4.10 freshness table marks audited annual statements "stale" after 270 days and interim statements after 120 days. A stale figure "is excluded from any computed value", and a derived figure "inherits the worst freshness of its inputs". On 2026-11-04 the FY2025 inputs (PAT, FX gains, equity, DPS) are 308 days old and the H1-2026 inputs (loans, Stage 3, CAR, qualifying capital) are 127 days old. By the document's own rules, every derived metric in the note is stale and the note cannot be "current". The provenance table also lists the country-risk edition as **V1**, which contradicts "all inputs V2+".
- *Further errors:*
  - Periods are mixed. Shares are taken at 2026-06-30, PAT and book value at FY2025, and price at 2026-11-03.
  - The thesis calls the bank "post-recapitalisation", which implies shares were issued in 2026. If so, FY2025 EPS and book value per share computed on mid-2026 shares are wrong, which contradicts "no corporate action since".
  - The qualifying-capital row is V2, but its threshold comes from a press article that the document itself grades E3 [S32].
- *Fix:* Add a period-alignment rule to the quant check (every ratio uses one period end, and share counts are weighted or matched to that period). Rebuild the example on Q3-2026 interim figures, or show it as stale. Make the header status a computed field, not free text.

**B2 — §4.3, §4.11 Example 1: the normalisation and valuation arithmetic is inconsistent.** I recomputed every figure with Python (script in the reviewer scratchpad). The headline arithmetic reproduces: EPS 13.33, P/E 4.5×, P/B 1.20×, dividend yield 6.7%, payout 30%, ROE 27.97%, Stage 3 ratio 5.0%, coverage 80%, P/B grid values 72.7/57.1/44.4 and 36.4/28.6/22.2, and DDM values 40.7/32.0/24.9. The inputs behind them are wrong or inconsistent:

| Issue | Document | Correct / consistent |
|---|---|---|
| FX share of profit | "27.5% of PBT came from FX revaluation" | 110/400 = 27.5% of **PAT**. At a 30% tax rate, PBT ≈ N571bn and the share is **≈19%**. Invalidation condition (5), "> 40% of PBT", inherits the same confusion. |
| Normalised ROE | "about 20%" = (400 − 110)/1,430 | Takes pre-tax gains off post-tax profit. Tax-effected at 30%, the result is (400 − 77)/1,430 = **22.6%**, and the values become 48.2 / 37.9 / 29.4 instead of 36.4 / 28.6 / 22.2. The research view survives, but by a narrower margin than shown. |
| Growth vs payout | g = 12%, payout 30%, in both the justified-P/B and DDM rows | Justified P/B = (ROE − g)/(k − g) implies a payout of 1 − g/ROE = **57%** at ROE 28% (40% at ROE 20%). The DDM at a 30% payout and g = 12% implies retained earnings earn only 12%/0.70 = 17.1%, below every cost of equity in the grid. The two rows rest on incompatible assumptions, and the note does not say so. |
| Cost-of-equity grid | "Span 23–30% comes from the two routes in §4.4" | The routes give 24.5% (NGN) and 27.2–34.0% (USD, at 12–18% inflation). **23% matches neither route.** It equals the MPR. |
| Real growth | g = 12% nominal NGN | Against the 12–18% inflation scenarios this is zero-to-negative real growth. The assumption needs to be stated. |
| Dividend capacity | "no regulatory payout cap under the reported rule" | The CBN barred banks from paying dividends out of FX revaluation gains and required those gains to be held in a special regulatory reserve (September 2023 circular, reiterated March 2024). In June 2025 it suspended dividends for banks under forbearance (Nairametrics, 14 June 2025, fetched 2026-11-04). A bank whose profit is 27.5% FX gains has capped distributable profit. The windfall tax on banks' FX gains (50% proposed in 2024; the enacted rate and years were not verified) is also missing from normalisation. |

*Fix:* Make the sustainable-growth identity (g = ROE × retention) a quant-check test. Tax-effect every normalisation. Derive the cost-of-equity grid from the routes mechanically. Add the CBN distribution rules to the registry.

### Major

**M1 — §4.4: the NGN route formula is not Damodaran's, and the CDS alternative is omitted.**
- *Claim:* NGN cost of equity = FGN 10-year yield + β × mature ERP × 1.55, giving 24.5%.
- *Why it is wrong:* Damodaran's sheet (S27, re-downloaded and parsed 2026-11-04) multiplies the **default spread** by 1.554495 to get the country risk premium. It does not multiply the mature ERP. His local-currency method takes the local government yield, subtracts the sovereign default spread to get a local risk-free rate, and then adds the total ERP: 18% − 5.17% + 12.24% = **25.07%**. The document's 24.5% is close only by coincidence.
- *What else the sheet shows:* The same sheet gives a **CDS-based** Nigeria ERP of 9.27% (net CDS 3.26%, country risk premium 5.07%) against the rating-based 12.24%. The USD route on the CDS basis gives 24.0–27.3% at 12–15% inflation, against 27.2–30.6% on the rating basis.
- *Fix:* Show the rating-versus-CDS choice as its own scenario axis. Correct the formula. Also note that the mature ERP of 4.20% is measured over an "adjusted dollar riskfree rate" (net of the 0.22% US Aa1 default spread). The USD risk-free rate should therefore be the Treasury yield minus 0.22%, not the headline 4.2%. All Damodaran figures quoted in F23 are **confirmed**: mature ERP 4.20%; Nigeria B3, 5.17% / 8.04% / 12.24%; UAE Aa2, 0.39% / 0.61% / 4.81%; US 4.42%; multiplier 1.55. The USD-to-NGN conversion arithmetic (27.2 / 30.6 / 34.0%) is correct.

**M2 — §4.3 bank module: missing metrics and definitional errors.** Checked against the CBN *Guidelines on Regulatory Capital* (S52), which I re-downloaded and read 2026-11-04:
- *Capital minimums are incomplete.* Table 2 sets CET1 at 7.0 / 10.5 / 10.5%, Tier 1 at 7.5 / 11.25 / 11.25% and CAR at 10 / 15 / 15% for national banks, international banks and D-SIBs respectively. It adds a **capital conservation buffer of 1.0% for all banks** and a **D-SIB higher-loss-absorbency surcharge of 1.0%** (paragraph 30). Paragraph 98 adds leverage-ratio minimums of 4% (5% for D-SIBs). The effective CAR floors are therefore about 11%, 16% and 17%. F12 and Example 1 cite only 15% / 10%. The invalidation trigger "CAR < 17% (15% + 2 pp)" equals the D-SIB floor by accident.
- *Missing metrics:* CET1 ratio; leverage ratio; liquidity ratio (30%, last stated by the 303rd MPC); the 75% cash reserve ratio (CRR) on non-TSA public-sector deposits (confirmed on the CBN MPC page and omitted from F13 and §4.5); regulatory loan-to-deposit ratio; single-obligor limit breaches and forbearance status; FX net open position; off-balance-sheet contingents; the regulatory risk reserve (the gap between prudential and IFRS 9 provisions, footnote 4 of the guideline); and the Composite Risk Rating, which drives bonus restrictions (§7.2).
- *Definitional error:* The table compares the "Stage 3 ratio" with "the 5% prudential reference". The CBN's 5% NPL threshold is measured on the prudential-guidelines definition, not IFRS 9 Stage 3. The module should store both and must not equate them.
- *Dividend capacity:* The dividend test rests on secondary press [S53]. The primary guideline (§7.4) routes dividends to BOFIA. The FX-gains and forbearance restrictions in B2 are missing.

**M3 — Tax statements that contradict Doc 6.**
- (a) F16 and §4.6 say "DMO states FGN securities' interest is tax-exempt". Doc 6 F12 finds the exemption covers Government **bonds** only (NTA s.163(1)(n)). T-bills, commercial paper and corporate bonds have carried 10% withholding tax since 28 October 2025. The DMO page (S16) now returns 404, so the claim cannot be re-checked. This affects the §4.6 real-return bands and the NGN T-bill safety bucket in Example 3.
- (b) §4.5 gives dividend withholding as "reported 10% (final for individuals), effective 2026-01-01 (Tax Act)", sourced to a Bamboo search summary. Doc 6 cites the Withholding Regulations 2024 (from 1 July 2024) and NTAA s.51(3). Use Doc 6's primary citation and effective date.
- (c) Doc 6 already has the gains-on-shares thresholds (₦150m proceeds and ₦10m gain, for Nigerian-company shares only). It also finds that foreign currency is a chargeable asset (s.34(1)(b)). For a Nigerian resident, that touches every AED and USD bucket in Example 3. 5a still says this is "deferred to Doc 6".
- (d) A USD 100,000 goal held in US-domiciled ETFs exceeds the USD 60,000 US estate-tax threshold and draws 30% dividend withholding (Doc 6 F30–F31). Example 3 does not flag either.

**M4 — §3.1 and §4.5: market-rule status after re-fetch (2026-11-04).**

| Rule | 5a value | Re-fetch result | Status |
|---|---|---|---|
| NGX hours | 09:00–16:00, effective 27 April 2026; previously 09:30–14:30; SEC-approved | S1 "Market hours: 9.00 to 4.00"; pre-open 9:00, continuous 9:30, pre-close 3:50, close 4:00. S2 dateline 17 April, effective 27 April, previously 9:30–2:30 | **Confirmed** |
| NGX ±10% band | "price limit shown in session table" | In the extracted table, "+/-10%" appears only on the **Pre-Open** row. It is not clearly stated as the daily limit for continuous trading | **Unconfirmed / ambiguous**. Keep at E3 until the rulebook is checked |
| T+1 | 1 June 2026; NGX, NASD, LCFE | Confirmed (S9). 28 November 2025 is the publication date of a T+2 news item, not a stated go-live date | **Confirmed** (T+1); T+2 date **unconfirmed** |
| Pricing-methodology postponement | 17 August 2026 postponed; N100/N5 bands remain | Confirmed (S35): "postponed; not shelved", no new date | **Confirmed** (secondary source) |
| Ticks | 0.10 / 0.05 / 0.01 | S35 gives these ticks for the *revised* bands only. The 2018 PDFs were not re-downloaded | **Partly confirmed** |
| Foreign participation | 2026 YTD 10.26%; 2025 YTD 21.6%; institutional N8.37trn, retail N5.15trn; NAFEM 1,329.16 | All figures match the S7 PDF | **Confirmed** |
| FTSE / MSCI | Back to Frontier 21 September 2026; MSCI Standalone "announced October 2023, effective February 2024" | S40: Frontier effective 21 September 2026 confirmed. S40 says MSCI reclassified Nigeria "in October 2023" and gives no February 2024 effective date | FTSE **confirmed** (secondary); MSCI effective date **unconfirmed** |
| MPR | 23% (307th MPC, 21–22 September 2026); corridor +50/−300; CRR 45/16 | Confirmed on the CBN page. The page also shows a **75%** CRR on non-TSA deposits and a prior corridor of +50/−450 | **Confirmed**; incomplete |
| Recapitalisation | N500/200/50/50/20/10bn; paid-up capital plus share premium only; 1 April 2024–31 March 2026 | Confirmed (S32, Arise, 29 March 2024) | **Confirmed** (E3, press) |
| CAR | 15% / 10% | Confirmed (S52 ¶25), but buffers are missing (M2) | **Confirmed**; incomplete |
| PenCom limits | Fund I 35% etc. | S12 URL now returns **404** | **Not re-checkable** |
| DFM rules | 10:00–14:45 continuous, auction to 15:00, +15% / −10%, ticks, T+2, FOL 15–100%, no taxes | S30 matches (pre-open 09:30–10:00; ticks 0.001/0.01/0.02/0.05/0.1). Still a broker page with no date | **Confirmed against the secondary source only** (E3 correct) |

**M5 — §3.3 F19–F20 and the §4.2 table: evidence grades for the screens.**
- "E1 for the existence of these effects in US data" conflates *historical* existence with *current* persistence. Green, Hand and Soliman (2011, *Management Science*, doi:10.1287/mnsc.1110.1320, verified) document the decline of the accruals anomaly after about 2000. McLean and Pontiff, which the document itself cites, show post-publication decay. Grade historical existence E1 and persistence E2/E3.
- International evidence exists and is not cited: Pincus, Rajgopal and Venkatachalam (2007, *The Accounting Review* 82(1), doi:10.2308/accr.2007.82.1.169, verified) find the accrual anomaly outside the US mainly in common-law, outside-shareholder-heavy markets. That is the relevant prior for NGX.
- "Local replication is absent" is too strong. Nigerian applications exist, though in low-tier venues: Nwosu (2026), Beneish-flagged manipulation in Nigerian manufacturing firms, doi:10.56557/ajefm/2026/v8i1421; Oyamienlen et al. (2023), Altman Z applied to Nigerian **banks**, doi:10.47191/jefms/v6-i6-06. The latter is precisely the misuse the design forbids. I found no credible test of return predictability on NGX, DFM or ADX. Restate as "descriptive local applications exist, of low quality; no credible return-predictability replication found."
- "Replication by Hou et al." for the F-score needs the specific HXZ result cited. I could not confirm it.
- The Z'' coefficients are correct, but the original EM model is Altman, Hartzell and Peck (1995). Altman (2005) is an application.

**M6 — §4.9: whether the schema is implementable, and whether it is consistent with Doc 3.**
- *Consistent in principle:* fields are stated and confirmed, not assumed, and the single household risk score is rejected.
- *Gaps:*
  - (a) No instrument in Doc 3 F23 elicits a **per-goal loss tolerance** ("can lose 50%"). Doc 3 adopts the single SOEP general-risk item and DOSPERT financial items. 5a rejects a single score without saying how the SOEP item relates to bucket tolerances.
  - (b) "Human capital: present value … correlation with sectors" requires a discount rate, an income-growth path and a correlation estimate. These are inferred quantities, and Doc 3 §4.7 forbids inferring risk constructs from records. Grade them E5 and store them as explicit user-confirmed assumptions.
  - (c) §7 attributes a position to the founder ("Founder (assumed): familiarity with NGX justifies overweight"). This breaks brief §1 ("Do not invent prior decisions") and Doc 3's ban on national priors. Delete it or mark it "unknown — founder to confirm".
  - (d) The fields have no type, unit, `confirmed_by`, `confirmed_at`, `expiry` or version. Rule 6 ("tax treatment unknown → not yet admissible") empties the universe while residency is unknown, which is the current state. A provisional mode needs to be specified.
  - (e) Example 3 applies the currency rule, which Rule 1 limits to 24 months, to a five-year USD goal. That is inconsistent.
  - (f) Example 3 Step 2 concludes the goal is infeasible, which leaves the aspirational bucket empty. Step 3 then narrows the analysis to 18 NGX names for that bucket.

**M7 — Recommendations embedded in the examples.**
- The admissible-universe rules are a house investment policy with unsourced thresholds: 5% per issuer, 25% per sector, equities only for goals of five years or more, single stocks only in the aspirational bucket, "Bank stocks beyond 0%", "FGN Eurobonds only in a small slice". Applied to a real person, these are allocation and suitability advice.
- The Bank X research view ("not consistent with normalised earnings at any cost of equity in the grid") is an "overvalued" call under a permitted label. The permitted-language list ("the price implies", "consistent with") lets ratings through by paraphrase.
- For the founder's personal use this is acceptable. Doc 6 F35 (SEC Nigeria robo-advisory rules) and F36 (UAE CMA "financial advisory") say the regulatory perimeter is crossed when security-specific output is offered to others. Each rule and view should carry a "would be advice at commercialisation" flag, and Legal should see the exact wording.

### Minor

- **m1.** The freshness and validation taxonomies conflict with Doc 5c (§5 below).
- **m2.** F13 says the repository's 27.50% "would have shown as expired since February 2026". Doc 5c says "since 2026-04-01". 5a's own "cut of 50 bp to 26.5%" in February implies the rate before was 27.0%, so the hard-coded value may already have been wrong in 2025.
- **m3.** Example 3 counts only USD 15,000 towards the goal and leaves out NGN 25m and AED 40,000 (about USD 29,700 together) without saying so. It does not state whether the "net income" figure is after NTA 2025 tax.
- **m4.** Example 2 reproduces exactly (grid 48.7–55.2 down to 40.2–44.1; implied WACC 8.86% at g = 3%). Its FY2025 10-K inputs are also "stale" under §4.10 (B1).
- **m5.** S12 (PenCom) and S16 (DMO) now return 404. The registry needs a "source moved" state.
- **m6.** Mohanram (2005) is volume 10, issue 2–3. The document gives "10" only.
