```
Review of: Document 09 — Venture Capital Investment Memorandum (v0.1, 2026-11-04)  ·  Reviewer roles: dissenting VC partner; Nigerian consumer-fintech founder-operator; CFO (unit economics); regulatory researcher; market researcher  ·  Date: 2026-11-04  ·  Verdict: Major revision
```

## 1. Verdict and the three most important problems

**Verdict: Major revision.** The "build-to-learn, no-fund-yet" call is probably right. The wedge, the unit economics and the three raise signals do not survive re-computation or Documents 4, 5c and 6.

1. **The tax wedge targets users with nothing to compute.** Gains on Nigerian shares are exempt below ₦150m proceeds and ₦10m gains, and dividends bear final withholding tax (Doc 6, gazette). Software may prepare but not file (NTAA s.33). Free 2026 calculators, including a government one, already exist. The real pain is foreign shares, FX gains and diaspora residency, a smaller segment with professional liability attached.
2. **The unit economics are inconsistent and leave out costs.** The executive summary presents the blended ARPU as the ₦2,500 price. LTV uses 5% churn; the P&L implies 7.5%. The 1m line exceeds the memo's own SOM. VAT, Paystack's fixed fee, aggregation, the 2026 NGX schedule and practitioner review are missing. The 35%-USD gate becomes about 58% at 7% churn.
3. **The signals cannot be read at month 9 and are not falsifiable.** The calendar does not fit; n=20 friends is not a demand test; an LOI costs the signer nothing; there are three different USD thresholds.

## 2. Findings, severity-ranked

### Blocking

**B1 — §1, §4.5, §8.1 item 2, §8.3(c), F6: "Nigerian tax computation is the strongest near-term differentiator; the IPO cohort needs capital-gains records."**
*Why it is wrong.* Doc 6 F13 (s.34(1)(a) proviso, read from the gazette) exempts gains on Nigerian-company shares where aggregate proceeds are below ₦150m **and** gains do not exceed ₦10m in 12 months. Doc 6 F12 (NTAA s.51(3)) makes net dividends "not charged to further tax". A ₦5,250-minimum IPO subscriber (min. ≈ $4, CNBC Africa, re-fetched) therefore has no capital-gains tax (CGT) and no further dividend tax. The IPO is a portfolio-tracking prompt, not a tax wedge. The memo still calls the exemption "conflicting secondary readings" (F15) even though Doc 6 has already settled it from the primary text.
- The filing boundary removes the "TurboTax" analogy (A5). Under NTAA s.33 only the taxpayer or an *accredited* agent may file (Doc 6 F19, F34).
- The state pre-fills returns: NTAA s.34(3) treats a pre-entered electronic return as valid self-assessment.
- "Nobody has one" is false at the level of pay-as-you-earn (PAYE) and personal income tax (PIT). A search on 2026-11-04 found a Federal Government PIT calculator (fiscalreforms.ng, launched Aug 2025, per PRNigeria and Prime Business Africa search results) and several 2026-band calculators (wtec.org.ng, wakatax.netlify.app, which describes itself as a "Calculator & Filing Tool", and others).
- Selling computations for a fee may engage the Chartered Institute of Taxation of Nigeria (CITN) Act's restriction of tax practice to registered members. Not verified this session, but the memo does not consider it.

*Where the pain actually is.* Doc 6 identifies four places, all of them complex and liability-bearing:
- foreign shares, which get no threshold (Bamboo/Risevest/Trove users);
- FX as a chargeable asset (s.34(1)(b));
- worldwide income of anyone captured by the disjunctive s.202 residency test, including diaspora members who keep a Nigerian home or family ties;
- US 30% dividend withholding and estate-tax exposure above $60k.

*Fix.* Re-specify the wedge as "cross-border investor tax-and-records pack (foreign shares, FX, residency), practitioner-co-signed". Re-size it to Bamboo/Risevest/Trove users with realised gains plus diaspora. Drop "nobody has a tax engine". Obtain a CITN-Act opinion. Change signal (c) to that segment.

**B2 — §4.6, §8.3: "Re-evaluate at month 9" on signals (a)–(c).**
*Why it is wrong.* The memo's own timeline does not fit.
- Stage 0 runs months 0–6. Signal (a) needs a cohort, a three-month free period, conversion to paid and then 90-day retention, so it cannot be read before about month 12–13.
- Signal (c) needs a practitioner-reviewed engine selling into the 2027 filing season (LIRS deadline 31 March, extended in 2026 to 14 April and then 21 April per Doc 6 F17). That means a reviewed rule set by about January 2027, two months from today, while Stage 0 is scheduled to take six.
- One founder cannot run Stage 0, a 20-user pilot, PFA business development and a tax season in nine months.

*Fix.* Either move the decision to month 15, or swap in signals that can be read by month 9: priced pre-orders with real payment collection, a paid diagnostic sold to diaspora users, and the number of advisers using a free beta weekly.

### Major

**M1 — §1 Why, §4.4: ARPU conflation (optimistic).** The executive summary sets "₦2,500 = $1.86/month" beside "~$46/year revenue, 60% gross margin, LTV/CAC 1.8". The $46 is the 65/20/15 *mix*, and it depends on 35% of payers being on Pro or USD plans. Re-run with the memo's own `model2.py` logic, a Basic-only subscriber yields:

| Basic-only case | Gross margin | LTV at 5% churn | LTV/CAC at $25 |
|---|---|---|---|
| Memo's inputs | 22% | $8 | 0.3 |
| Plus 7.5% VAT and Paystack's ₦100 fee | 11% | — | — |
| Plus naira at ₦1,700/$ | negative | — | — |

The §4.7 worked example states 23%; it computes to 21.5%. *Fix:* state the Basic-plan economics in the executive summary.

**M2 — §4.4 P&L: churn inconsistency and out-of-range scale lines (both directions).** The script charges acquisition at `n*0.9*25`. Replacing 90% of the base each year implies about 7.5% monthly churn, while LTV uses 5%; 5% monthly churn means 46% annual attrition. Recomputed steady-state earnings before interest, tax, depreciation and amortisation (EBITDA), using the memo's fixed-cost tiers:

| Mix | Churn | 10k | 100k | 1m | Approx. breakeven subs |
|---|---|---|---|---|---|
| Nigeria-heavy 65/20/15 | 5.0% | −$0.64m | −$1.08m | **+$3.70m** | ~190k |
| Nigeria-heavy | 7.5% (memo P&L) | −$0.71m | −$1.83m | −$3.80m | ~1.8m |
| Balanced 40/20/40 | 5.0% / 7.5% | −$0.40m / −$0.48m | +$1.25m / +$0.50m | +$27m / +$19.5m | ~65k / ~82k |
| Diaspora 20/10/70 | 5.0% / 7.5% | −$0.17m / −$0.24m | +$3.6m / +$2.9m | +$51m / +$43m | ~40k / ~45k |
| USD $10 only | 5.0% / 7.5% | +$0.07m / 0.00 | +$6.0m / +$5.3m | — | ~10k |

Two corrections follow:
- With internally consistent churn, the Nigeria-heavy business does break even at about 190k subscribers. The memo's "−$3.8m at 1m" is too pessimistic for its own LTV assumption.
- The diaspora mix at 1m earns about $43–51m, not "$15–25m". But no 1m line is coherent with the memo's own five-year serviceable obtainable market (SOM) of 20–150k payers, and the Nigeria-heavy 1m line needs 650k Basic payers, above the high serviceable-market (SAM) estimate of 403k paying people.

*Fix:* use a single churn input; delete the 1m row or label it TAM-only; show breakeven subscriber counts.

**M3 — §4.4 cost inputs: omitted or understated lines (optimistic).**
- **Nigerian VAT (7.5%)** on B2C digital subscriptions, and UAE VAT at 5% once registered: not modelled.
- **Paystack fee.** The ₦100 fixed fee is waived only "for transactions under NGN 2,500" (Paystack support page, re-fetched), so it applies to the ₦2,500 Basic plan. The script waives it, and it omits the ₦100 on international cards as well.
- **Aggregation.** Mono's Basic tier is ₦50,000 a month for 100 accounts, about $0.37 per account per month (Doc 4 F2). At three linked accounts that is about $1.11 per user per month, or 29% of the Nigeria-heavy ARPU. Monarch's ~18% aggregator burden applies to a $99 plan (Sacra, re-fetched).
- **LLM tokens.** The deep-research profile assumes 60k input tokens per Opus-class run with 60% cache hits. Agentic research runs routinely use several hundred thousand tokens. At 2.5× the medium LLM cost plus half-weight aggregation, the Nigeria-heavy gross margin falls to about −2%, Balanced to 33% and Diaspora to 50%.
- **Market data.** §4.4 uses the 2018 NGX list, but Doc 5c §4.6 found the 2026 schedule. Commercial floor ≈ ₦5–8m a year before UAE/US data; non-display licence ₦1.25m; Level-1 real-time fee **$10/user/month** (2018: $3).
- **Professional costs.** Practitioner review and co-signature, professional-indemnity cover and NDPC-licensed audit fees are absent.

*Fix:* add these lines, and re-state the mix thresholds.

**M4 — §7.3, §8.3: "Fund only if ≥35% of subscription revenue is USD."** Re-solving the memo's model for LTV/CAC ≥ 3 at a $25 CAC gives:

| Monthly churn | USD-payer share needed |
|---|---|
| 5% | 37% (39% with VAT/fee fixes) |
| 7% | 58% |
| 10% | 91% |

RevenueCat's Middle East and Africa data, which the memo cites, shows negative median monthly recurring revenue (MRR) growth. The threshold should therefore be stated as a function of measured churn, not as a constant.

**M5 — §4.2 funnel: independence assumption (too pessimistic).** The funnel multiplies banked × smartphone × income × investing as if they were independent. For the top 5–8% of earners, banking and smartphone ownership are close to universal. Start from income instead: 115–120m adults × 5–8% × P(banked & smartphone | high income) ≈ 0.85 × 30–50% invest, which gives **≈1.5–4.1m**, against the memo's 0.30–1.61m. The low bound of the smartphone share (33%) is also *above* EFInA's own national figure (26.6% in the A2F 2023 appendix; 29% in the chart). The independence error dominates in the bearish direction. *Fix:* use conditional shares, for example the EFInA cross-tabulation by income band.

**M6 — F5, §1: Sensor Tower as willingness-to-pay (WTP) evidence (too pessimistic and partly misquoted).** Re-fetched: a weekly unit is stated only for Wallet ($221) and YNAB ($209); Budge ($218) and Money Manager ($155) carry no unit. One app (Money Tracker) peaked at 17.7K actives, not "hundreds to low thousands". The bigger issue is that these are Google Play estimates in a market where card-on-file in-app billing is rare and Nigerian fintechs collect by bank transfer or Paystack on the web. They measure the app-store channel, not WTP. *Fix:* grade the evidence E4 for WTP and stop citing it as "≈ nil".

**M7 — §4.3 competitors missing or mischaracterised.**
- **Portfolio trackers with tax reports (global):** Sharesight, Getquin, Snowball, Delta (eToro). These are the nearest analogue to the "whole balance sheet + tax" quadrant, not Kubera alone.
- **Tax calculators:** the government PIT calculator and multiple 2026 calculators (B1); the NRS/LIRS portals' pre-fill.
- **Diaspora money apps adding savings and investing:** Grey, Nala, Afriex, Cleva and LemFi. LemFi is used only as a size anchor, but it is also a distribution competitor.
- **Integrated groups that already show pension, funds and brokerage in one app:** for example Stanbic IBTC, ARM and United Capital. They are the "incumbent copies the wedge" risk, and they are the B2B2C buyers the memo hopes to sell to.
- **Bank PFM vendors for B2B2C:** Personetics, Meniga and the UK's Moneyhub. These are the established competitors and the pricing anchors for M4.
- **NGX data APIs:** Mansa ($20–200/month) and Kobo Terminal (₦0–350,000/month; Doc 5c N14–N15). These set the price for M6 far below the memo's $500–2,000/month per client.
- **Under-weighted PiggyVest moves:** Techpoint (re-fetched) reports a planned personal/business toggle. That is a direct move on segment S4.

**M8 — F17, §4.4 M2: UAE perimeter understated.** Doc 6 F36 reports that Federal Decree-Law 33/2025 lists "financial advisory" **and "promotion"** as licensable activities. It expressly reaches activity from abroad or from free zones that targets onshore clients, and imposes imprisonment of at least one year and fines of AED 1m–250m. The memo's "UAE premium only ($15)" scenario, which assumes direct marketing to UAE residents, carries criminal exposure that is not in its risk register. The National (re-fetched) confirms that onshore robo-advice is limited to *licensed portfolio-management firms*. *Fix:* treat every UAE consumer line as partner-only until counsel opines.

**M9 — F16: Nigeria Data Protection Act (NDPA) obligations framed as threshold-gated.** The memo says "a 20-user cohort is below the threshold". Registration tiers are gated; the obligations are not. Doc 6 F38 records that the General Application and Implementation Directive (GAID) requires a data-protection impact assessment (DPIA) for financial services. It also requires an adequacy decision or an approved instrument for cross-border transfers, and consent alone is not a basis. Sending the cohort's statements to a US-hosted large language model (LLM) API is a cross-border transfer at n=2. Separately, Andersen (S37, re-fetched) gives **no** numeric tiers; the 200/1,000/5,000 figures rest only on the E4 source S85.

**M10 — §4.4 M4 and §8.3: B2B2C pricing and the "250,000 members" seed gate.** At $0.25–1.00 per member per year, 250k members is $62k–250k a year, which is not a fundable revenue line against the ~$1.1m Stage-3 budget. On PenCom's re-fetched Q4 2025 data (₦27.45tn; 11,042,903 RSAs) the average balance is about $1,850. A plausible 0.5–1% fee yields roughly $9–18 per retirement savings account (RSA) a year, so $1 per member would take 5–11% of a pension fund administrator's (PFA) per-member revenue. That is implausible for an analytics add-on in a cost-regulated industry. *Fix:* model B2B2C as flat enterprise licences (unknown; obtain two quotes) and gate on revenue, not members.

**M11 — §4.6 capital plan and hiring realism.** `model2.py` pays the founder nothing for 18 months after a pre-seed raise and prices senior engineers at $2,200/month. The memo's own risk register says talent is USD-indexed. Stage 2 has a single "ops/compliance" hire covering the NDPA data-protection officer (DPO) role, the DPIA, the CITN/tax-practitioner interface, SEC perimeter monitoring and support for 1,000 payers. There is no growth or business-development hire, although the primary route (A4) is enterprise sales by a founder with "no enterprise sales track record". *Fix:* add a founder salary and a USD-benchmarked senior-hire case; Stage 2 probably comes to $0.6–0.8m.

### Minor

- **m1 — model scripts missing from the repository.** `model.py`/`model2.py` exist only in the session scratchpad; they are not in `docs/portfolio-os/research/`. As things stand, reviewers cannot reproduce §4.4 from the repository.
- **m2 — KPMG label (F9).** The memo calls it a "2025 study". KPMG's page is dated September 2026 and does not state a fieldwork year (13,251 respondents in 12 cities confirmed). BusinessDay gives 75%, up from 64% in 2023, and 96% Android.
- **m3 — EFInA phone ownership.** EFInA 93% "own mobile phones" (main text) vs 87.9% (appendix): an internal inconsistency in the source that the memo should note.
- **m4 — Lagos deadline (F15).** Doc 9 says the deadline "moved to 14 April"; Doc 6 says 14 April and then 21 April.
- **m5 — ISA 2025 citation (F14).** The repeal is cited to [S32], a registration checklist. Doc 6 cites assent on 31 March 2025.
- **m6 — [A8] can be upgraded.** Crossref returns the journal version, *Management Science* 2016, doi:10.1287/mnsc.2015.2296.
- **m7 — Mono figures (F1).** The "8m linkages / 12%" figures are company claims that TechCrunch explicitly did not verify; they should be graded E4.
- **m8 — Monarch subscribers (§4.2).** "~1m paying subscribers" is a derivation (ARR ÷ $99); Sacra reports no subscriber count.
- **m9 — Stage-1 kill gaps.** The kill rule is "<8/20 weekly active" and the pass rule is "≥12/20", so 8–11 is undefined. The kill rule also says "<5 *would* pay" (stated intent), while signal (a) and §9.6 require real payment.

### 2A. Kill-criteria falsifiability (task 7)

| Gate | Problem | Proposed fix |
|---|---|---|
| Stage 0 "≥99% reconciliation" | Undefined: by count, by value, or by period? | "All 12 monthly periods reconcile to closing balance with zero unexplained difference (Doc 6 Gate 1)" |
| Stage 1 | Decided by a friendly cohort. 8/20 has a 95% Wilson interval of 22–61%, so it cannot separate a 25% from a 50% conversion rate. "No diaspora user pays $10" is passed by a single friend | ≥30 *non-friend* users recruited by cold channel; real payment; pre-registered thresholds |
| Stage 2 CAC > $40 | At $40 CAC and 5% churn, LTV/CAC is 1.14, not "< 1" as the rationale states | Kill at the CAC where LTV/CAC < 1.5 for *measured* churn and mix |
| FX > 40% | An external event, not a test of the business hypothesis | Convert to a pre-agreed repricing rule; keep it out of the kill list |
| USD thresholds | 20% (month 24), 25% (FX gate) and 35% (seed) are never reconciled | One churn-indexed threshold (M4) |
| Missing | Founder time cap; date for receiving the legal opinion; signal (b) accepts a non-binding LOI | Add "no paid pilot (≥$5k) by month 18"; a legal-opinion deadline; founder-hours budget |

### 2B. Strongest bull case (under-weighted)

1. **The addressable base is probably 3–5× larger than modelled (M5).** The two bearish WTP proxies, Sensor Tower Play revenue and EFInA income, both under-count affluent web payers (M6).
2. **Diaspora tax pain is new, legal and large.** Under NTA s.202, a Nigerian in Dubai or London who keeps a Lagos flat or family ties may now be resident and taxed on worldwide income, with FX itself a chargeable asset and no usable UAE treaty (Doc 6 F10, F13, F14). Nobody in the competitor matrix explains this exposure. Remittances are ≈$21.8bn a year (Vanguard/CBN, re-fetched: $21.811bn in 2024 and $21.806bn in 2025). This is a fear-driven, deadline-driven, USD-paying job, and it is the kind of job Nigerians do pay for.
3. **The data moat is real.** Doc 5c found that nobody, official or third-party, sells corporate-action-adjusted NGX data, and that the legitimate NGX end-of-day (EOD) API costs only ₦425k a year. A validated adjustment engine is both a product moat and a sellable asset to brokers and media, more defensible than any consumer feature.
4. **The retail capital-market cohort is growing.** More than 2m digital subscribers to the Dangote IPO (CNBC Africa, re-fetched) will receive their first CSCS statements, dividends and registrar letters. That creates a free top-of-funnel at a time when Okra's exit and Mono's sale have left the field empty.
5. **USD-only economics are strong at small scale.** At $10 a month the product breaks even near 10k payers even under 7.5% churn (M2 table). A focused diaspora product needs a market less than 1% the size of the memo's top-down TAM.

### 2C. Strongest bear case (strengthened)

1. **The wedge is not there.** The tax job for mass retail is empty (B1). For the diaspora it requires residency judgments that the system must flag "needs professional review" (Doc 6), so the software becomes an intake form for a practitioner who captures the fee.
2. **Every lever that rescues the economics is outside the founder's control:**
   - **Churn:** at 7% the business needs about 58% USD payers.
   - **LLM tokens and aggregation:** together they can take gross margin to zero at Nigerian prices.
   - **App-store billing:** on a 96%-Android market, Play billing costs 15%.
   - **The naira.**
3. **Distribution is owned by incumbents.** PiggyVest (6m users, expanding into business accounts), integrated bank-asset-manager-PFA groups and diaspora remittance apps can each add a "net worth + tax estimate" tab at zero marginal CAC. Their customers already trust them with money movement, which Portfolio OS forswears.
4. **The B2B2C route rests on pricing (≈$1 per member) that the PFA fee structure cannot carry (M10)**, sold by a founder without enterprise-sales history into 12–24-month cycles.
5. **The capital efficiency the memo claims depends on unpaid founder time and below-market senior hires (M11).** Partech (S52) reports a 5.5–6.5% seed-to-Series-A conversion rate and a 30% fall in active Nigerian investors.

## 3. Evidence-grade audit

| Claim | Memo grade | Should be | Reason |
|---|---|---|---|
| "Nigerian tax engine — nobody has it" (§4.3, §4.5) | Asserted as fact | E4, and false for PIT/PAYE | Government and third-party calculators exist (B1) |
| Share-gain exemption "conflicting readings" (F15) | E4 | E2 | Doc 6 read the gazette (s.34) |
| Sensor Tower as WTP (F5, §1) | E3 | E4 for WTP | Channel-biased; units partly unstated (M6) |
| Mono 8m linkages / 12% (F1, F12) | E3 | E4 | Unverified company claim (TechCrunch) |
| GAID tiers 200/1,000/5,000 (F16) | E3/E4 via S37 | E4 (S85 only) | S37 gives no numbers |
| Unit-economics table (§4.4) | Presented as model output | E5, with internal inconsistency | Churn mismatch; missing costs (M2, M3) |
| LLM usage profiles | E5 (stated) | E5, but token counts not disclosed in text | Only visible in the script |
| "Most credible venture route" for B2B2C | Committee view | E6 | No buyer evidence, no price anchor |
| Hub71 / DFSA capital | E4 | E4 (agree) | Unverified commercial guides |
| Stage-2 salary inputs | E4 [S83] | E5 | Search summaries, not quotes |

**Presented as fact without a source:**
- "~20 PFAs; 24+ banks" (§4.1 S5);
- "Converts 1–3% download-to-paid in emerging markets" (M3, attributed to S61 but not quoted);
- "Big-4 firms sell services, not software";
- "app-store billing 15–30%" (no source).

## 4. Citation and source spot-check (all checked 2026-11-04)

**Academic: Crossref by DOI (OpenAlex for A2, whose Crossref response failed to parse).**

| Ref | DOI | Result |
|---|---|---|
| A1 D'Acunto, Prabhala, Rossi 2019 RFS | 10.1093/rfs/hhz014 | Verified |
| A2 Fernandes, Lynch, Netemeyer 2014 Mgmt Sci | 10.1287/mnsc.2013.1849 | Verified (OpenAlex) |
| A3 Kaiser, Lusardi, Menkhoff, Urban 2022 JFE | 10.1016/j.jfineco.2021.09.022 | Verified |
| A4 Mertens et al. 2021 PNAS | 10.1073/pnas.2107346118 | Verified |
| A5 Maier et al. 2022 PNAS | 10.1073/pnas.2200300119 | Verified |
| A6 Gargano & Rossi 2024 JF | 10.1111/jofi.13339 | Verified |
| A7 Reher & Sokolinski 2024 JFE | 10.1016/j.jfineco.2024.103829 | Verified |
| A8 Karlan et al. | 10.2139/ssrn.1652784; journal version 10.1287/mnsc.2015.2296 | Both verified; cite the 2016 journal version |
| A9 Rossi & Utkus 2020 | 10.2139/ssrn.3552671 | Verified as working paper |
| A10 Levi & Benartzi, JF | 10.1111/jofi.70087 | Verified (issued 30 Sep 2026) |

Bibliographic metadata only; whether each study supports the specific F20 sentence was not re-read.

**Non-academic (re-fetched with WebFetch unless stated).**

| Source | Memo claim | Status |
|---|---|---|
| S30 SEC revised minimum capital | IA ₦50m; robo ₦100m; digital sub-broker ₦100m; FM ₦2–5bn; by 30 Jun 2027; 16 Jan 2026 | **Confirmed.** Also: managers with AuM > ₦100bn must hold 10% of AuM |
| S34 openbanking.ng | Awaiting directive; updated Jul 2026 | Confirmed. Latest dated status is Sep 2025; the page says "early 2026" phased go-live |
| S3 Nairametrics CSCS | 6m accounts, ~10% active | Confirmed (CEO speech delivered by a representative) |
| S17 Vanguard remittances | $21.8bn 2024 and 2025 | Confirmed ($21.811bn / $21.806bn, CBN Q4'25 bulletin) |
| S62 Sensor Tower | $155–221 per week; low actives | **Partly.** Weekly unit stated for 2 of 4 apps; one app reached 17.7K actives (M6) |
| S14 BusinessDay / S15 KPMG | 75%, 13,251 respondents, 12 cities, 96% Android, "2025" | Figures confirmed; fieldwork year unstated (m2) |
| S2 PenCom Q4 2025 (PDF, pdftotext) | 11,042,903 RSAs; ₦27.45tn; 225,475 PPP; ~1% quarterly | **Confirmed** |
| S1 EFInA A2F 2023 (local PDF text) | 111m; 52% / 58.3m; 3% / 2% income bands | Confirmed; smartphone ownership 26.6% (appendix), below the memo's 29–33% (M5) |
| S75 YC deal | $500k; $125k for 7% + $375k MFN SAFE; US/Cayman/Singapore/Canada | Confirmed |
| S63 Paystack | 1.5% + ₦100, waived ≤ ₦2,500 | **Error:** waived "under" ₦2,500, so the fee applies at the ₦2,500 price point |
| S37 Andersen GAID | Thresholds 200/1,000/5,000 | **Not in source.** Effective date 19 Sep 2025 confirmed |
| S25 The National | SCA robo-advice for licensed portfolio managers | Confirmed |
| S35 TechCrunch Mono | $25–40m all-stock; 8m linkages | Confirmed; linkages flagged as unverified company claim |
| S57 Kubera | $250 / $2,500 a year | Confirmed; multi-aggregator; no Nigerian bank coverage stated |
| S79 CNBC Africa | $1.6bn; ₦6.4tn ($4.78bn); 3×; > 2m digital | Confirmed; allotment pending; listing later in November |
| S20 Wikipedia | 50–100k Nigerians in the UAE | Confirmed (Business Insider Africa 2024; weak) |
| S11 Techpoint PiggyVest | > 6m users; ₦1.3tn payouts | Confirmed; business toggle planned (M7) |
| S53 Sacra Monarch | $60m end-2025, $100m Sep 2026; $0.30/connection | Confirmed; no subscriber count; Sacra's "$99/mo" typo noted |

## 5. Cross-document contradictions

| Topic | Doc 9 | Other document | Consequence |
|---|---|---|---|
| Share-gain exemption | "Conflicting secondary readings" | Doc 6 F13: gazette read; Nigerian shares only; ₦150m **and** ₦10m | IPO tax wedge collapses (B1) |
| Who files | "TurboTax-style" (A5) | Doc 6 F19/F34: prepare only; taxpayer or accredited agent files | Lower value; competes with practitioners |
| Residency | 183 days and "strong ties" | Doc 6 F10: disjunctive s.202; any limb suffices | Diaspora exposure larger than stated (bull) and the liability larger (bear) |
| Lagos deadline | 14 April | Doc 6 F17: 14 April then 21 April | Minor |
| NGX data cost | 2018 schedule; "current schedule unknown"; L1 $3 | Doc 5c §4.6: 2026 schedule; floor ₦5–8m a year; L1 $10/user/month; ND ₦1.25m | M6 and P&L data line understated |
| Data-API competitors | Stears only | Doc 5c: Mansa, Kobo Terminal, EODHD | M6 pricing |
| Aggregation | Mono as fallback, cost not modelled | Doc 4 F2: ₦50k/month per 100 accounts; Doc 4 R10: only after a 60-day shadow test | Variable cost and onboarding friction |
| UAE perimeter | CMA renamed; Cat-4 via partner | Doc 6 F36: "promotion" licensable, extraterritorial, criminal | UAE consumer lines riskier (M8) |
| UAE Open Finance | Live with CBD and FAB/Pay10 | Doc 4 F8: 5 of 15 banks confirmed; CBUAE licence needed | Consistent; Doc 9 should cite Doc 4 |
| NDPA | Below threshold at 20 users | Doc 6 F38: DPIA for financial services; transfer instrument needed | Obligations apply at the pilot (M9) |

## 6. Questions the Investment Committee needs answered

1. How many Nigerian residents hold foreign shares with *realised* gains? (Bamboo, Risevest and Trove disclosures; SEC data.)
2. What do two PFAs or brokers actually pay today for member-facing analytics, and is it flat or per member?
3. Does the CITN Act restrict selling tax computations, and does a practitioner co-signature resolve it?
4. Which state revenue portals pre-fill investment income, and when?
5. What is the realistic monthly churn for annual-prepaid NGN plans versus monthly USD plans? The thresholds in M4 hinge on it.
6. What are the measured tokens per deep-research run on the prototype?
7. Where is the diaspora's centre of gravity (UK/US/Canada vs UAE)? Is the UAE the right second market, given visa restrictions and CMA criminal exposure?
8. What does the founder actually earn and own? The capital plan assumes zero salary.

## 7. Required changes before Investment Committee (priority order)

1. Re-specify the wedge (B1) using Doc 6's primary-text findings. Re-size it, re-run signal (c) on the cross-border investor segment, and remove "nobody has a tax engine".
2. Re-time or replace the month-9 signals (B2). Fix the kill-criteria defects in §2A.
3. Reconcile churn between LTV and the P&L. Delete or re-label the 1m row. Add breakeven subscriber counts (M2).
4. Add the missing cost lines: VAT, Paystack fixed fees, aggregation, 2026 NGX schedule, practitioner, indemnity, audit. Run a stress case on LLM tokens (M3).
5. Restate the USD-share gate as a function of measured churn (M4), and use one threshold throughout.
6. Rebuild the funnel on conditional probabilities (M5). Downgrade Sensor Tower to E4 (M6).
7. Add the missing competitors and B2B PFM vendors (M7). Re-price M4/M6 against Mansa, Kobo Terminal and the PFA fee base (M10).
8. Add UAE Decree-Law 33/2025 "promotion" and NDPA cross-border obligations to the risk register (M8, M9).
9. Re-cost Stage 2 with a founder salary and a USD-benchmarked case (M11).
10. Commit `model.py`/`model2.py` to `docs/portfolio-os/research/` (m1). Apply minor fixes m2–m9.

## 8. What the reviewer could not check

- The Nigerian diaspora headcount (not attempted; recommend UN DESA International Migrant Stock).
- The CITN Act text.
- Whether fiscalreforms.ng and the third-party calculators are live and accurate (search results only).
- DFSA Category 4 capital and Hub71 terms.
- The NGX 2026 schedule itself (relied on Doc 5c).
- Mono's current pricing (relied on Doc 4).
- RevenueCat Middle East and Africa churn figures (S61 not re-fetched).
- Partech figures (S52 not re-fetched).
- Whether Levi & Benartzi and the other academic papers support the exact F20 sentences (metadata only).
- Nigerian VAT treatment of non-resident or app-store-billed digital subscriptions (assumed 7.5% VAT-inclusive pricing).
- No licensed tax, legal or data-protection professional reviewed this memo. B1, M8 and M9 require one.

*Calculations:* recomputation script `sens.py` (Python 3, standard library). It sits in the session scratchpad at `/tmp/claude-0/-home-user-Terminal-/db376c7d-be49-5fe4-a185-5e7cc59446a3/scratchpad/r09/sens.py`, alongside a re-run of the memo's own `model.py`/`model2.py`, whose outputs match the memo's tables.
