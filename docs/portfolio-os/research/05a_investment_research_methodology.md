```
Document: 5a — Institutional Investment Research Methodology and Data-Quality Framework
Department: Investment Management and Portfolio Research  ·  Lead role(s): Chief Investment Officer, institutional portfolio manager, equity research analyst, fixed-income analyst, investment strategist, asset-allocation specialist, risk manager, financial-statement analyst, economist, macroeconomic research analyst, emerging-markets specialist
Version: 0.2  ·  Date: 2026-11-04  ·  Status: revised after independent review (v0.1 2026-11-02; review R05a 2026-11-04)
Reviewers required: Data Sources (Doc 5c), Quantitative Models (Doc 5b), Tax (Doc 6), Behavioural Finance (Doc 3 / System B), Personal-Finance Ledger (Doc 4 / System A), AI Research and Explanation (System H), Legal/Compliance, Investment Committee, Programme coordinator
```

# Document 5a — Institutional Investment Research Methodology and Data-Quality Framework

## 1. Executive summary

**Conclusions.** Portfolio OS should reproduce institutional research *discipline*, not scale: validated data, statement analysis, a valuation *range*, a thesis with written invalidation conditions, and independent review before anything is shown. The founder's earlier Nigerian tracker produced outdated or inaccurate figures (brief §1), so provenance precedes every later step. Figure status and rendering follow the canonical contracts C2 and C3.

Three findings drive the design. First, market and prudential rules move and bind valuations directly. In 2026 NGX changed hours and settlement and postponed a pricing revision; CBN buffers and its payout matrix cap bank distributions (F2–F4, F12). A versioned rule registry is therefore core. Second, the screens (accruals, F-score, M-score, Altman Z) are well evidenced historically in US data and weaker after publication. We found no credible return-predictability test on NGX, DFM or ADX, so the screens enter as descriptive flags (F19–F20). Third, return predictability is weak out of sample, so no expected return is shown as a forecast (F21).

**Biggest uncertainty.** Whether one person's system can keep rule, corporate-action and distribution data accurate cheaply. Second: Damodaran's rating-based and CDS-based Nigerian premiums differ by about 3 pp, moving every bank value in Example 1 (§4.4).

**What v0.2 changed.** Example 1 is rebuilt, because v0.1 failed its own gates. The NGN cost-of-equity route now follows Damodaran's method. The bank module adds CET1, leverage, buffers and the CBN payout matrix. Tax facts defer to Doc 6. Allocation thresholds are now parameters the user sets.

**Top recommendations.** *Personal-MVP must-haves:* figures that carry their provenance; the rule registry; a note template with a computed status; the circumstances filter; and the bank module, gated on registry rows for CBN rules. *Later:* screens after local backtests, valuation engine, fixed income, funds. *Do-not-build (yet):* ratings, target prices, return forecasts, macro timing, model-written figures.

## 2. Scope and method

**Questions addressed.** (A) How professional institutions analyse securities and how much evidence supports each tool; (B) market-specific rules for NGX, DFM/ADX, US equities, Nigerian/UAE/US fixed income and funds; (C) how macro conditions enter security and allocation views without forecasting; (D) how an individual's circumstances become explicit research inputs; (E) a research-quality and data-quality framework; (F) worked examples with synthetic numbers. Quantitative model design (Doc 5b) and data-source selection/licensing (Doc 5c) are out of scope; what we need from them is listed in §6.

**What we searched and read (all accessed 2026-11-02, re-checked 2026-11-04).** Primary sources: NGX market-structure page and press release on trading hours; NGX rulebook documents (pricing methodology interpretative guidance and FAQ, free-float rules, index circuit-breaker rule); NGX Domestic and Foreign Portfolio Investment Report (September 2026); Central Securities Clearing System (CSCS) T+1 page; Central Bank of Nigeria (CBN) Monetary Policy Committee (MPC) decisions page, NFEM exchange-rate page and Guidelines on Regulatory Capital (2021); National Pension Commission (PenCom) addendum of 9 February 2026; National Bureau of Statistics (NBS) CPI rebasing highlights (February 2025); IFRS Foundation jurisdiction profiles for Nigeria and the UAE; Debt Management Office (DMO) and FMDQ Exchange pages; Securities and Exchange Commission (SEC) Nigeria NAV page; US SEC EDGAR API documentation; UAE Ministry of Finance T-Bonds programme page; DFM Shari'a compliance page; Damodaran's country-risk page, July 2026 blog post and spreadsheet; CFA Institute Code and Standards and Research Objectivity material; BIS BCBS 239 page. Secondary sources (broker market-information pages for DFM/ADX, Nigerian financial press) were used only where primary pages were unavailable (several DFM, ADX, CBN and CBUAE pages returned 403/404 in this environment) and are labelled as such.

**Tools.** WebSearch (standard and extended) and WebFetch; curl plus `pdftotext`/`openpyxl` to read primary PDFs and spreadsheets; Python 3 for the worked-example arithmetic (v0.2: every number in §4.4 and §4.11 is reproduced by `research/scripts/doc05a_worked_examples.py`, standard library only, `python3 -I`). Academic references were checked with the hosted reference-lookup tool against OpenAlex **by DOI**; title-only lookups and the non-hosted tool timed out, and OpenAlex returned HTTP 429 towards the end of the session. Each reference in §10 carries **[verified]**, **[partially verified]** (DOI resolves to the right title but the full check was blocked by rate limits) or **[unverified]**. Claims that rest only on unverified references are graded no higher than E3.

**What we could not access or verify.** The web-search budget was exhausted mid-session; later checks used direct fetches only. Not verified from primary sources: the current CBN recapitalisation outcome after 31 March 2026; the June 2023 FX-window unification and December 2024 electronic FX matching system; the Central Bank of the UAE (CBUAE) peg statement (page blocked); DFM Shari'a Standard 1 thresholds; the current accounting-standards rule of the UAE Capital Market Authority (CMA), which replaced the Securities and Commodities Authority (SCA) on 1 January 2026 (the IFRS Foundation profiles date from 2016); NGX index methodology and corporate-action (closure-of-register) rules; brokerage access routes from Nigeria/UAE to US markets. These are listed again in §7 and §9.

**Revision method (v0.2, 2026-11-04).** We read review R05a and revision-log rows V-013, V-014 and V-022 and applied CANONICAL_CONTRACTS C2, C3, C5, C6 and C7. **Doc 6 governs tax facts.** This document now cites Doc 6 rule records and no longer states tax rules of its own. We re-read these primary sources directly:
- the CBN *Guidelines on Regulatory Capital* PDF (downloaded and converted with `pdftotext`; Tables 1–2, ¶24–31, ¶80–104, Appendix 2) [S52];
- Damodaran's `ctrypremJuly26.xlsx` (re-downloaded and parsed with the standard library) [S27];
- the CBN MPC decisions page [S10].

We also fetched these secondary sources:
- the Stren & Blan note on T-bill withholding [S55];
- the King & Spalding note on the CMA decree-laws [S54];
- the Nairametrics reports of the September 2023 FX-gains circular and the June 2025 forbearance circular [S56, S57];
- search results on the 2024 windfall levy [S58].

The reference-lookup tools, both local and hosted, timed out on every call, so the academic references were re-checked by DOI against the Crossref REST API and are marked **[verified, Crossref]**. Not re-fetched in v0.2: the NGX pages S1–S9 and the DFM/ADX pages. For these, the statuses come from the reviewer's re-fetch (R05a M4) and are labelled "per R05a".

## 3. Findings

Evidence grades follow the brief (E1–E6). Source numbers refer to §10. "Checked 2026-11-04" applies to every time-sensitive fact unless stated.

### 3.1 Accounting basis and market rules

**F1. Nigerian and UAE listed companies report under IFRS, but the UAE evidence is dated.** Nigeria requires IFRS Accounting Standards for all companies whose securities trade in a public market, effective January 2012, under the Financial Reporting Council of Nigeria Act 2011 [S14]. For the UAE, the IFRS Foundation profile records that the Commercial Companies Law No 2 of 2015 requires "international accounting standards", that ADX and Nasdaq Dubai listing rules require IFRS, and that DFM-listed companies use IFRS in practice while some Islamic financial institutions used AAOIFI standards; the profile is internally inconsistent on whether DFM *requires* IFRS and was last updated 16 June 2016 [S15]. Grade: E2 for Nigeria; E3 for the UAE. The UAE rule must be re-checked against the Capital Market Authority (CMA). Federal Decree-Laws 32 and 33 of 2025 made the CMA the legal successor to the SCA from 1 January 2026, and SCA resolutions stay in force until replaced, to the extent they do not conflict [S54; Doc 6 F36] (Doc 5c). Implication: one IFRS-based statement model serves all three markets, but the UAE data layer must tolerate AAOIFI-format statements for some Islamic banks.

**F2. NGX trading hours changed on 27 April 2026 to 09:00–16:00 WAT**, approved by SEC Nigeria; the prior window closed at 14:30 [S1, S2]. The NGX market-structure page shows pre-open at 09:00, continuous trading from 09:30, pre-close from 15:50 and close at 16:00, with a "+/-10%" price limit in the session table [S1]. Grade: E2 for the hours. **v0.2 regrade:** R05a's re-fetch found "+/-10%" only on the **pre-open** row, so it is not established as the daily limit for continuous trading. The 2018 interpretative guidance describes a ±5% limit around the reference price under the session structure of that time [S3]. The band is therefore **E3, unconfirmed or ambiguous**. The registry row stays `candidate` until the rulebook is read (§9). Docs 5b and 5c hold the same status: a move to the ±10% level is a review item, not a confirmed limit day, until Doc 5c confirms the rule (Doc 5c §4.3.5; consistency pass, I4).

**F3. NGX pricing methodology: three price groups with volume thresholds and tick sizes, and a 2026 revision approved but postponed.** The rule effective 29 January 2018 (SEC approval 14 March 2017) classifies equities as Group A (≥ N100: 10,000 units to move the price, tick N0.10), Group B (N5 to < N100: 50,000 units, tick N0.05) and Group C (< N5: 100,000 units, tick N0.01), with reclassification after four of the last six months in a band [S3, S4]. In June 2026 SEC approved revised bands (Group A ≥ N1,000; B N500–999.99; C < N500) with the same unit thresholds and ticks; implementation set for 17 August 2026 was postponed without a new date, and the exchange said the existing N100/N5 bands remain in force [S35, S36, S37]. Press reports conflict on whether a uniform 100,000-unit rule was in force at any point in 2024–2026 [S37, S38]. Grade: E2 for the 2018 rule; E3 for the 2026 status. The tick sizes are **partly confirmed**: S35 gives these ticks for the revised bands only, and the 2018 PDFs were not re-downloaded in v0.2 (per R05a). Implication: a published NGX price can lag economic value because small trades do not move it; the registry must store the rule *with its effective date*.

**F4. Settlement: NGX equities moved to T+1 on 1 June 2026** at CSCS, covering NGX, NASD OTC and the Lagos Commodities and Futures Exchange [S9, S43]. Grade: E2 (T+1, confirmed by R05a). The earlier move to T+2 is reported, but 28 November 2025 is the date of a CSCS news item, not a stated go-live date: **E3, date unconfirmed**. Fixed income already settled T+2.

**F5. Free float: 20% of issued shares held by at least 300 shareholders, or a float valued at N20bn (Main Board) / N40bn (Premium Board)**; free float excludes holdings of promoters, directors, strategic holders of ≥ 5% and government; issuers must disclose shortfalls, and trading may be suspended for persistent breaches (rules approved by SEC 6 May 2019) [S5]. Grade: E2. Implication: free float, not market capitalisation, is the first liquidity filter.

**F6. Index circuit breaker: a 5% move in the All-Share Index between 10:15 and 13:45 halts all trading for 30 minutes, once per day; a further 5% closes the market** (Rule 15.46, effective 5 February 2016; times predate the 2026 session change) [S6]. Grade: E2 for the rule text; E3 for current times.

**F7. Foreign participation on NGX has fallen to about 10% of turnover in 2026 (from 21.6% in 2025 year-to-date), and domestic institutions dominate**; the NGX report for September 2026 gives 2026 YTD foreign 10.26% / domestic 89.74%, with domestic institutional N8.37trn versus retail N5.15trn, and reports the NAFEM rate used for conversion (N1,329.16/$ at 30 September 2026) [S7]. Grade: E2. FTSE Russell moved Nigeria from Frontier to Unclassified in September 2023 and back to Frontier effective 21 September 2026, citing FX liquidity and repatriation; MSCI reclassified Nigeria to Standalone status in October 2023 and had, as of October 2026, not reversed it [S40]. The "effective February 2024" date in v0.1 came from search summaries [S46] and is not in the re-fetched source: **unconfirmed, E3**. The 2016 MSCI release documents the earlier episode: a 2015 peg caused FX illiquidity that "significantly impaired" repatriation [S28]. Grade: E2/E3. Implication: FX convertibility is a first-order risk factor for any NGN asset held by a person with AED/USD liabilities.

**F8. Nigerian pension funds are the marginal domestic institutional buyer, with equity limits raised in February 2026**: PenCom's addendum of 9 February 2026 raised ordinary-share limits for RSA Fund I 30%→35%, Fund II 25%→33%, Fund III 10%→15% and Fund VI-Active 25%→33%, citing excess liquidity and a shortage of alternative assets [S12]. Grade: E2 as read on 2026-11-02. **v0.2:** the S12 URL returned 404 on 2026-11-04 (R05a). The registry row keeps its values, with `source_status = moved` and last confirmed on 2026-11-02, until the document is found again (§4.5).

**F9. DFM and ADX rules (broker sources; official pages blocked in this session):** continuous trading 10:00–14:45 with a closing auction to 15:00 GST, Monday–Friday; daily limits +15% / −10% from the previous close (ADX adds auction pauses at −5% and −9%); tick sizes from AED 0.001 (below AED 1) to AED 0.10 (≥ AED 100); settlement T+2; foreign-ownership limits (FOL) set by each company's articles within 15–100%, with GCC investors sometimes treated as foreign; trading identity via a National Investor Number (NIN); no withholding, capital-gains or dividend tax [S30, S31]. DFM publishes a Shari'a classification list and three Shari'a standards prepared by an in-house committee (Standard 1 covers issuing, acquiring and trading shares) but the ratio thresholds were not retrievable [S22]; index-provider screens use 33% debt/market-cap limits (S&P, FTSE) versus 30% (AAOIFI) [S29]. ADX removed daily price limits on ETFs and futures from 3 August 2026 [S49]. Grade: E3 throughout; must be re-verified against DFM/ADX rulebooks by Doc 5c.

**F10. US markets: filings are free and machine-readable.** The SEC's `data.sec.gov` APIs (submissions, companyfacts, companyconcept, frames) return XBRL facts in JSON with sub-minute latency and no API key; bulk ZIPs rebuild nightly; only standard taxonomies (us-gaap, ifrs-full, dei, srt) are aggregated [S19]. Grade: E2. Implication: US coverage is the cheapest place to prove the provenance pipeline before applying it to NGX.

### 3.2 Banks, capital and macro

**F11. CBN recapitalisation 2024–2026: minimum paid-up capital plus share premium of N500bn (international), N200bn (national), N50bn (regional), N50bn (merchant), N20bn/N10bn (non-interest national/regional); retained earnings and AT1 excluded; window 1 April 2024–31 March 2026; options were fresh equity, M&A or licence change** [S32]. CBN said 30 banks had met their thresholds as of 6 March 2026 and 33 had raised capital [S33, S34]. The final post-deadline outcome was not verified in this session. Grade: E3 (circular text seen only via press). Implication: for every NGX bank the research note must record licence category, qualifying capital and compliance status with a date.

**F12. CBN capital, buffer and distribution rules (Guidelines on Regulatory Capital, September 2021; primary text re-read 2026-11-04) [S52].**

**Minimum ratios (Tables 1–2), national / international / D-SIB:**
- CET1 7.0 / 10.5 / 10.5%;
- Tier 1 7.5 / 11.25 / 11.25%;
- CAR 10.0 / 15.0 / 15.0%.

**Buffers on top of the minimums:**
- a capital conservation buffer (CCB1) of 1.0% of risk-weighted assets for all banks, held in CET1 (¶82);
- a countercyclical buffer (CCB2) "as determined by CBN from time to time";
- for D-SIBs, a higher-loss-absorbency surcharge (HLA) of 1.0% "to their respective minimum required CAR", met wholly with CET1 (¶30, ¶94).

The **effective CAR floors** are therefore about **11% / 16% / 17%**, and the effective CET1 floors 8.0 / 11.5 / 12.5% (Table 3 uses these CET1 sums for bonuses).

**Leverage-ratio minimums** are 4%, and 5% for D-SIBs. These appear in the bonus conditions (¶98), and Appendix 2 bars dividends when the leverage ratio is below its minimum.

**Distributions.** Dividends are subject to BOFIA (¶103). The maximum dividend depends on CET1, the NPL ratio and the CBN's **Composite Risk Rating** (¶104). Appendix 2 sets the cap as a matrix of CET1 band × NPL band (≤ 5%, 5–8%, 8–10%, > 10%) × risk rating:
- no dividend at all where the NPL ratio exceeds 10%, the risk rating is High, or leverage is below its minimum;
- otherwise a capped payout. For a D-SIB with CET1 above 12.5% and NPL below 5%, the cap is 0 / 25 / 75 / 100% for High / Above Average / Moderate / Low.

The cap applies to **adjusted profit**: profit after tax, less the statutory-reserve transfer and the regulatory-risk-reserve adjustment. The non-distributable **regulatory risk reserve (RRR)** holds the excess of prudential provisions over IFRS 9 (¶24, footnote 4).

Grade: E2 for every item above.

**Additional restrictions reported in the press (circular texts not read; E3):**
- A September 2023 circular directs banks to set aside FX revaluation gains as a counter-cyclical buffer and not to use them "to pay dividend or meet operating expenses", reiterated in March 2024 [S56].
- A 13 June 2025 circular (reported as BSD/DIR/CON/LAB/018/008) suspends dividends, bonuses and new foreign-subsidiary investment for banks under credit or single-obligor-limit (SOL) forbearance, until the forbearance is exited and capital and provisioning are independently verified [S57].

**Unconfirmed:**
- The National Assembly passed a 70% windfall levy on banks' *realised* FX gains in July 2024, covering the period from the start of the new FX policy to the end of 2025. Presidential assent and final terms were not verified (E3; Doc 6 owns) [S58].
- The Composite Risk Rating is a supervisory rating that we have not seen published (E4, bank-analyst judgment), so the payout cap generally cannot be fixed from public data.

The v0.1 finding ("15% / 10% … plus buffers"; NPL tests from secondary sources) was correct but incomplete (R05a M2).

**F13. Monetary policy as of the 307th MPC (21–22 September 2026): MPR reset to 23.0% from 26.5%; corridor +50/−300 bp (previously +50/−450 bp); cash reserve ratio (CRR) 45% for commercial banks, 16% for merchant banks and 75% on non-TSA public-sector deposits.** The liquidity ratio was last stated at 30% at the 303rd MPC (November 2025). The rate history is 27.50% (February–July 2025), 27.00% from the 302nd MPC (22–23 September 2025), 26.50% from February 2026, held in May and July, then 23.0% [S10, re-fetched 2026-11-04]. Grade: E2. The repository's hard-coded 27.50% was **wrong when committed** on 2026-03-02, two decisions after it had last been correct (brief v0.2; C3.6). An entry-time primary-source check (C3.5) would have blocked it; expiry alone would not.

**F14. Inflation statistics were rebased in early 2025 (base year 2024, weights 2023, 934 varieties, 13 COICOP 2018 divisions, modified Laspeyres/Young index)** [S13]; press reports describe a further revision to the index reference period around the turn of 2025/26 [S48]. Grade: E2 for the rebasing; E3 for the later revision. Implication: inflation series must carry a methodology version; year-on-year comparisons across the break are invalid without the NBS linked series.

**F15. The official NGN/USD rate is the NFEM volume-weighted average published daily by CBN**, with high, low, close and turnover [S11]. CBN stated in March 2024 that all *valid* legacy FX backlog claims (about $7bn claimed, $2.4bn found invalid) had been settled [S45]. Grade: E2 for the rate definition; E3 for the backlog history.

**F16. Nigerian federal securities: FGN bonds auction monthly (minimum N50,001,000 at auction), trade on NGX (retail) and FMDQ (wholesale); FGN Savings Bonds, Sovereign Sukuk, Green Bonds, Eurobonds and Treasury bills exist; no inflation-linked bond is listed** [S16; S16 returned 404 on 2026-11-04, so it cannot be re-checked]. **Tax (Doc 6 governs; V-013, V-022):**
- Interest on Federal and State Government **bonds** is exempt (NTA s.162(1)(n), `NG-BOND-EXEMPT-2026`).
- **Treasury bills**, commercial paper and corporate bonds carry 10% withholding from **28 October 2025** under the FIRS directive; FGN bonds and CBN OMO bills are excepted [S55; Doc 6 F12].
- Doc 6 treats that withholding as final for individuals under NTAA s.51(5); this needs practitioner confirmation (Doc 6 §9 item i).

The v0.1 statement that "DMO states FGN securities' interest is tax-exempt" is withdrawn: as worded, it is contradicted for T-bills. FMDQ publishes closing prices and yields for bonds, T-bills, OMO bills and commercial paper, NAFEX, NIBOR and NITTY fixings and an S&P/FMDQ sovereign bond index, dated daily [S17]. Grade: E2 for the instruments; tax per Doc 6. Implication: inflation-linked thinking in Nigeria must be done analytically (real-yield arithmetic), not through instruments.

**F17. UAE federal dirham T-Bonds and T-Sukuk are auctioned on a published calendar (about AED 1.1bn in most months of 2026, maturities 2026–2033) with a retail T-Sukuk calendar** [S21]; a fractional/retail access initiative from AED 4,000 was reported in 2025–26 [S50]. The dirham's peg to the US dollar at 3.6725 is a long-standing CBUAE policy but the CBUAE page could not be fetched; treat as E3 [unverified in session].

**F18. Nigerian collective investment schemes: SEC publishes monthly (and, per press, weekly) NAV reports; industry NAV was about N9.9trn at 9 October 2026, with money-market funds 68%, dollar funds 18%, equity funds 2.4% and ETFs N33bn** [S18, S39]. Grade: E2 for the publication; E3 for the figures (press citing SEC). NGX lists 21 indices including the All-Share Index, NGX 30, NGX Banking, NGX Pension, NGX Lotus Islamic and NGX Sovereign Bond, but methodology documents were not retrieved [S8].

### 3.3 Evidence behind research tools

**F19. Earnings-quality and accrual screens: the historical US effects are well evidenced, their persistence is weaker, and local evidence is descriptive only.**

*Historical existence in US data (E1).*
- Sloan (1996) documents the accrual anomaly [S60].
- Dechow, Ge and Schrand (2010) review the proxies and their limits [S61].
- Piotroski's F-score separates winners from losers among high book-to-market stocks [S62].
- Mohanram's G-score extends the approach to growth stocks [S63].
- Beneish's M-score detects manipulation and predicts returns [S64, S65].

*Persistence after publication (E2/E3).*
- Green, Hand and Soliman (2011) document the decline of the accrual anomaly after about 2000 [S103].
- McLean and Pontiff (2016) show post-publication decay across anomalies [S67].
- Hou, Xue and Zhang (2020) find that most published anomalies weaken or fail under replication once microcaps are controlled [S66].
- Harvey, Liu and Zhu (2016) argue for higher statistical hurdles [S68].
- v0.1's claim that the F-score has a "replication by Hou et al." is **withdrawn**: we could not confirm the specific HXZ result, so the F-score is graded E2 on Piotroski alone.

*International evidence.* Pincus, Rajgopal and Venkatachalam (2007) find the accrual anomaly outside the US mainly in common-law markets with heavy outside-shareholder ownership [S104]. That is the relevant prior for NGX: E2.

*Local evidence.* v0.1 said that "local replication is absent". That is too strong. Descriptive Nigerian applications exist, in low-tier venues:
- Beneish-flagged earnings manipulation in listed manufacturing firms (Nwosu 2026) [S105];
- Altman Z applied to Nigerian banks (Oyamienlen 2023) [S106], which is exactly the misuse F20 forbids.

We found **no credible test of return predictability on NGX, DFM or ADX** [per R05a M5; not independently searched in v0.2].

Grades: **E1** for historical US existence; **E2/E3** for current persistence; **E4** for validity on NGX/DFM/ADX until Doc 5b backtests them.

**F20. Distress models: Altman's Z (1968), the emerging-market Z'' model of Altman, Hartzell and Peck (1995; Altman 2005 is a later application) and Ohlson's O-score (1980) are standard** [S69, S107, S70, S71]; they are calibrated on non-financial firms and are not designed for banks (applying them to Nigerian banks, as in [S106], is a misuse). Grade: E2 as tools; E4 locally.

**F21. Equity-premium predictability is weak out of sample.** Welch and Goyal (2008) find most predictors fail out of sample; Campbell and Thompson (2008) show modest gains only with economically motivated restrictions; Cochrane (2008) defends long-horizon predictability from dividend yields; Rapach, Strauss and Zhou (2010) find combination forecasts help marginally; Goyal, Welch and Zafirov (2024) re-examine 29 newer predictors and find most do not hold up [S72–S76, verified]. Valuation ratios (Campbell & Shiller 1988, 1998; Siegel 2016 on CAPE) relate to long-horizon returns with wide error bands [S77–S79, verified]. Grade: E1. Implication: the product may state that "valuation is high/low relative to history"; it may not state an expected return as a forecast.

**F22. Regime models describe history better than they predict it.** Ang and Bekaert (2002) and Ang and Timmermann (2012) document regime shifts in correlations and volatility, with the caveat that regimes are identified with lag and parameters are unstable [S80, S81, verified]. Grade: E2. Country risk matters for emerging-market returns and volatility (Erb, Harvey & Viskanta 1996; Bekaert & Harvey 1995) [S82, S83; both verified].

**F23. Country risk premiums (Damodaran): July 2026 edition uses a mature-market ERP of 4.20% (S&P 500 implied ERP 4.42% less the US Aa1 default spread), sovereign-rating-based default spreads scaled by a relative equity/bond volatility multiplier of 1.55; Nigeria (B3) default spread 5.17%, country risk premium 8.04%, total ERP 12.24%; UAE (Aa2) 0.39% / 0.61% / 4.81%; United States 4.42%** [S26, S27]. **The same sheet gives a CDS-based alternative:** Nigeria's sovereign CDS net of the Swiss CDS is 3.26% (30 June 2026), so the CDS-based country premium is 5.07% and the total ERP 9.27%, about 3 pp below the rating basis. The mature ERP of 4.20% is the S&P 500 implied ERP measured over an **adjusted** dollar risk-free rate: the Treasury yield less the US Aa1 default spread of 0.22% (0.2186% in the sheet). The multiplier is 1.5545, applied to the **default spread**, not to the mature ERP. All values were re-parsed from the sheet on 2026-11-04. The January 2026 page had Nigeria at 5.52% / 8.41% / 12.64% [S25]. The author describes the method as pragmatic rather than theoretical, warns that exposure should follow where a company operates rather than where it is incorporated, and that currencies should not carry risk premiums of their own [S26]. Grade: E3 (practitioner standard, semi-annual; the edition and the basis, rating or CDS, must be stored).

**F24. Goals-based and liability-aware allocation has a coherent theoretical base.** Chhabra (2005) proposes safety/market/aspirational buckets [S84, verified]; Nevins (2004) integrates goals with behavioural finance [S85, verified]; Shefrin and Statman (2000) and Das, Markowitz, Scheid and Statman (2010) show mental-account portfolios can be made mean-variance consistent [S86, S87, verified]; Sharpe and Tint (1990) formalise liability hedging [S88, verified]; Markowitz (1952) remains the baseline [S89, verified]. Grade: E2.

**F25. Human capital and labour income should shape the financial portfolio.** Bodie, Merton and Samuelson (1992), Viceira (2001) and Cocco, Gomes and Maenhout (2005) show that the riskiness and flexibility of labour income change optimal equity exposure over the life cycle [S90–S92, verified]. Grade: E2 (theory and calibrated models; limited direct field evidence).

**F26. Home bias is pervasive and costly in expectation; concentration risk is severe.** French and Poterba (1991) [S93, partially verified], Coval and Moskowitz (1999) [S94, verified] and Cooper and Kaplanis (1994) [S95, verified] document and partly explain home bias; Bessembinder (2018) shows that most individual US stocks underperformed Treasury bills over their lives and that aggregate wealth creation is concentrated in a few firms [S96, verified]; Statman (1987, 2004) on the number of stocks needed for diversification [S97, S98, verified]. Grade: E1 for home bias and skewness in US data; E3 for transfer to NGX.

**F27. Professional standards for research notes exist and are usable.** CFA Institute Standards V(A) Diligence and Reasonable Basis, V(B) Communication with Clients and V(C) Record Retention (Code and Standards effective 1 January 2024) [S23]; the Research Objectivity Standards and the 2018 CFA Institute brief list the disclosures a reader needs to judge a report: depth of analysis, methodology, definitions, third-party inputs and past performance of research [S24]. BCBS 239 (January 2013) sets risk-data principles — governance, data architecture, accuracy and integrity, completeness, timeliness, adaptability — written for banks but directly transferable to a personal research system [S20]. Grade: E3.

**F28. Tax parameters are inputs, and Doc 6 owns them (V-013, V-022).** We restate nothing here. We use Doc 6's rule records (status lifecycle per C7). As of Doc 6 v0.2 (2026-11-04), where the records below have status `reviewed_internal`, so any output using them carries the C7 "INDICATIVE" watermark:
- The Nigeria Tax Act 2025 (NTA) took effect on 1 January 2026 with progressive personal rates of 0–25%. Residency is a multi-limb test (s.201).
- **Dividends** from Nigerian companies bear 10% withholding under the Withholding Regulations 2024 (from 1 July 2024). NTAA s.51(3) treats the net amount as franked investment income "not charged to further tax", that is, final (`NG-DIV-WHT-FINAL-2026`). The NTAA commencement date is itself disputed: 26 June 2025 against 1 January 2026 (R06 M1).
- **Gains on shares in Nigerian companies** are not chargeable where 12-month aggregate proceeds are below ₦150m **and** the gain does not exceed ₦10m (s.34(1)(a) proviso). Foreign shares have no threshold.
- **Foreign currency is a chargeable asset** (s.34(1)(b); C1.6).
- Gains are assessed in the year after disposal (s.26(3); C7).
- For non-resident aliens, US dividends bear **30%** withholding, because no treaty covers Nigeria or the UAE (Doc 6 F30). US-situs stock above **USD 60,000** creates US estate-tax exposure (Doc 6 F31).
- UAE exchanges report no withholding or capital-gains tax on listed securities [S30, S31; Doc 6 F28].

Grade: as graded in Doc 6 (E2 for statutory text, E3 for directives seen through law-firm notes). Practitioner confirmation is required before reliance. Any output using these rules carries the C7 watermark.

## 4. Proposed framework / specification for Portfolio OS

### 4.1 The research process as a pipeline with gates

Institutional research is a sequence of gated steps; Portfolio OS should encode the gates, not just the analytics. A security cannot advance to the next stage until the gate condition is met and logged.

| Stage | Purpose | Gate to pass (logged) | Owner |
|---|---|---|---|
| 0. Circumstances filter | Remove instruments the user cannot or should not hold (currency, liquidity, horizon, concentration, tax, access) | Instrument passes the user's stated constraints (§4.9); output is a coverage list, not an allocation | System A inputs + this framework |
| 1. Idea generation | Screens, events (results, corporate actions, policy changes), portfolio needs (liability matching) | Idea logged with source and date; no number yet shown to user | Analyst role |
| 2. Data validation | Assemble price, shares, statements, dividends, corporate actions, FX with provenance | All mandatory inputs eligible for a conclusion-driving calculation under C3.4 (§4.10) | Data-quality role (Doc 5c) |
| 3. Financial-statement analysis | Restate IFRS statements into a standard model; compute ratios; quality checks | Reconciliation to filing totals within tolerance; period-alignment test passes; quality flags computed | Analyst + quant check |
| 4. Valuation | DCF, dividend models, relative, sum-of-parts; dual-currency reconciliation | Output is a *range* from a mechanically derived grid; sustainable-growth and payout tests pass or the cell is withheld (§4.10 Q1–Q9) | Analyst + quant check |
| 5. Thesis and invalidation | One-paragraph thesis; three to five measurable invalidation conditions with data sources | Each invalidation condition maps to a monitored field | Analyst |
| 6. Review | Quant check (formulas, units), data-quality check (provenance, freshness), risk check (concentration, liquidity, currency) | Sign-off recorded with reviewer role and date | Three roles |
| 7. Publication to user | Research note with provenance on every figure; figures rendered only as C2 tokens; permitted language only; advice-sensitivity flag | Automated linter and C2 validator pass (§4.10) | System H |
| 8. Monitoring | Invalidation conditions and freshness watched | Note status **computed** from C3 freshness of its inputs and its triggers: current / ageing / stale / expired / invalidated; never typed | System |

For the Personal MVP the "roles" are the founder plus system checks; the separation still matters because it forces the invalidation conditions and the provenance check to be written down before a conclusion is shown.

### 4.2 Financial-statement analysis and quality-of-earnings tools

All three markets are IFRS-based (F1), so one statement model applies: income statement, balance sheet, cash-flow statement, plus notes for segment data, impairment (IFRS 9), leases (IFRS 16), revenue (IFRS 15) and related parties. The model stores *reported* values with filing page references and computes derived values; derived values are never stored without their formula and inputs.

| Tool | What it measures | Formula summary | Evidence grade (US) | Local status | Product use |
|---|---|---|---|---|---|
| Accruals ratio | Gap between earnings and cash | (Net income − CFO) / average total assets; or balance-sheet accruals | E1 historical (Sloan 1996; Dechow et al. 2010); E2/E3 persistence (Green, Hand & Soliman 2011) | International: Pincus et al. 2007 (common-law markets); NGX/DFM: no credible return test; E4 until Doc 5b backtests | Flag "earnings not cash-backed" with the two inputs shown |
| Piotroski F-score (0–9) | Improving profitability, leverage/liquidity, efficiency | Nine binary signals (ROA > 0, CFO > 0, ΔROA > 0, CFO > NI, Δleverage < 0, Δcurrent ratio > 0, no dilution, Δgross margin > 0, Δasset turnover > 0) | E2 (Piotroski 2000); v0.1 "replication by Hou et al." withdrawn (specific result not confirmed) | E4 locally | Descriptive flag; never a rating |
| Mohanram G-score | Growth-stock analogue | Eight signals incl. R&D, capex, advertising intensity, earnings variability | E2 | E4 | Flag |
| Beneish M-score | Probability of manipulation | 8-variable model (DSRI, GMI, AQI, SGI, DEPI, SGAI, LVGI, TATA); threshold −1.78 | E2 (Beneish 1999; Beneish, Lee & Nichols 2013) | E4; descriptive Nigerian application only (Nwosu 2026, low-tier venue); IFRS account mapping must be documented | "Manipulation risk flag" with components shown |
| Altman Z / Z'' (EM) | Distress | Z'' = 6.56 X1 + 3.26 X2 + 6.72 X3 + 1.05 X4 (+3.25 constant in EM scoring) | E2 (Altman 1968; Altman, Hartzell & Peck 1995 for Z''; Altman 2005 an application) | E4; not for banks (Nigerian bank applications exist [S106]; the module refuses them) | Flag for non-financial issuers only |
| Ohlson O-score | Distress (logit) | Nine-variable logit | E2 | E4 | Optional |
| Gross profitability, QMJ | "Quality" | Gross profit / assets; composite quality | E2 (Novy-Marx 2013 [verified by DOI]; Asness et al. 2019) | E4 | Context only |

Rules for quality-of-earnings work on NGX and UAE statements: (i) FX revaluation gains and losses must be separated from operating earnings (large in Nigeria after 2023–24 devaluation episodes); (ii) IFRS 9 expected-credit-loss (ECL) stages must be read from the notes, not inferred; (iii) related-party exposures and government receivables are a Nigerian-specific quality item; (iv) bonus issues change share counts and must be applied to per-share history; (v) Shari'a-compliant companies' financing structures distort leverage ratios designed for conventional debt.

### 4.3 Bank-specific analysis

Banks are among the most traded and most researched NGX sectors. Their index weight is not sourced here, and Doc 5c is asked to supply the NGX Banking index weight; v0.1's unsourced "the NGX is bank-heavy" is withdrawn. Generic screens (F-score, Z-score) are not valid for banks. The bank module computes the metrics below from audited and interim IFRS statements and the bank's Pillar 3 regulatory disclosures, each with a note or table reference. **Thresholds are read from the rule registry (§4.5), never typed into the module.**

| Metric | Definition (stored formula) | Threshold (registry row; source) | Validation |
|---|---|---|---|
| Net interest margin (NIM) | Net interest income / average interest-earning assets | — | Interest-earning assets reconciled to balance sheet |
| Cost of risk | Impairment charge on loans / average gross loans | — | Tied to IFRS 9 note |
| Stage 3 ratio (IFRS 9) | Stage 3 gross loans / total gross loans | **None.** This is an accounting measure and is never compared with the CBN 5% NPL threshold | ECL staging note |
| Prudential NPL ratio (CBN definition) | As disclosed under the prudential guidelines (Pillar 3 / regulatory returns) | Appendix 2 bands ≤ 5%, 5–8%, 8–10%, > 10% [S52] | Stored separately from Stage 3; if not disclosed, the payout cap is shown for every band |
| Stage 3 coverage; Stage 2 share and migration | Stage 3 ECL / Stage 3 gross; Stage 2 / gross, quarter-on-quarter | — | Same note |
| Regulatory risk reserve (RRR) | Excess of prudential provision over IFRS 9 ECL, held in a non-distributable reserve | ¶24 and footnote 4 [S52] | Statement of changes in equity |
| CET1, Tier 1, CAR | As reported | **Effective floor** = Table 1 minimum + CCB1 1.0% + HLA 1.0% (D-SIB) + CCB2 when set. CAR 11 / 16 / 17%; CET1 8.0 / 11.5 / 12.5% (national / international / D-SIB) [S52] | Pillar 3; licence category and D-SIB status from the CBN list |
| Leverage ratio | Tier 1 / exposure measure | 4% (5% for D-SIBs) [S52 ¶98, App. 2] | Pillar 3 |
| Liquidity ratio | As reported | 30% (last stated at the 303rd MPC) [S10] | Regulatory disclosure |
| Cash reserve ratio (CRR) drag | Deposits × CRR, split by deposit type | 45% commercial / 16% merchant; **75% on non-TSA public-sector deposits** [S10] | Deposit mix; the public-sector share usually needs a management disclosure |
| Loan-to-deposit ratio (regulatory) | Gross loans / deposits per the CBN definition | Current CBN LDR policy **not sourced** in this revision (registry row `candidate`) | Balance sheet |
| Single-obligor limit (SOL) breaches; forbearance status | Disclosed breaches; whether the bank benefits from credit or SOL forbearance | June 2025 circular: no dividends while under forbearance [S57, E3] | Annual report; CBN and bank announcements. Absence of a disclosure is not evidence of no forbearance |
| FX net open position | As disclosed | CBN limit not sourced here | Risk-management note |
| Off-balance-sheet contingents | Guarantees, letters of credit / total assets | — | Contingent-liabilities note |
| Qualifying capital (recap) | Paid-up capital + share premium versus the F11 threshold for the licence category | Threshold from press only [S32]: `candidate`, so not conclusion-driving until the circular is read (C3.5) | Statement of changes in equity |
| Cost-to-income | Operating expenses / operating income (excluding impairment) | — | Income statement |
| Earnings mix | FX revaluation gains / PBT (**pre-tax over pre-tax**); after-tax FX gains / PAT using the tax note's attribution | — | Income-statement and tax notes |
| Funding | CASA share, loan-to-deposit | — | Balance sheet |
| Sovereign exposure | FGN securities / total assets | — | Investment-securities note |
| Composite Risk Rating | CBN supervisory rating; drives bonuses (¶98) and payout (App. 2) | — | **Not published (E4).** The module shows results for every rating value |
| Dividend capacity | Max distributable = max(PAT − statutory-reserve transfer − RRR adjustment − after-tax FX revaluation gains, 0) × App. 2 payout (CET1 band × NPL band × risk rating). Zero if NPL > 10%, the risk rating is High, leverage is below its minimum, or the bank is under forbearance | S52 ¶103–104 and App. 2 (E2); FX-gains and forbearance circulars (E3) [S56, S57] | Output is a **range across risk-rating values**, compared with the declared dividend |

*Note on Appendix 2.* The D-SIB and international tables label the lowest NPL band "NPL < 5%" and the next one "NPL > 5%", so an NPL of exactly 5.0% falls in neither band. The national table uses "≤ 5%". The module treats exactly 5% as the higher band (conservative) and flags the gap (E4).

**Normalisation rules.**
1. Remove FX revaluation gains and one-offs **after tax**, using the tax note's attribution. Where the note is silent, show both the untaxed variant and the statutory-rate variant.
2. Take numerator and denominator from the same period (test Q1, §4.10).
3. Any windfall levy on realised FX gains is already in the reported tax charge and is not deducted again; whether it applies is for Doc 6 to confirm (F12).
4. Show both reported and normalised ROE.
5. FX gains held in the counter-cyclical reserve stay in book value but are excluded from distributable profit.

Banks are valued with excess-return or justified price-to-book models, not free-cash-flow DCF (worked example §4.11).

### 4.4 Valuation module: ranges, currency consistency and dividends

**Principles.** (1) Cash flows and discount rates must be in the same currency and the same inflation basis (Damodaran's own caveat, F23). (2) Every valuation is reported as a range from a small grid of explicitly named assumptions, never a single figure. (3) The cost-of-capital build-up is stored with the version of its inputs (country-risk edition, risk-free source, date).

**Cost of equity for Nigerian issuers: two routes on two country-risk bases.** Every number is reproduced by `doc05a_worked_examples.py`. Damodaran inputs: July 2026 edition, re-parsed 2026-11-04 (F23). The FGN yield, the US Treasury yield and the inflation scenarios are synthetic.

- *USD route.* k_USD = rf_USD + β × ERP_Nigeria. Because the mature ERP of 4.20% is measured over an adjusted dollar risk-free rate, **rf_USD = US Treasury yield − US Aa1 default spread (0.22%)**. With a synthetic 4.42% Treasury yield, rf_USD = 4.20%. Convert to NGN by the inflation differential: (1 + k_USD)(1 + π_NGN)/(1 + π_USD) − 1.
- *NGN route (Damodaran's local-currency method).* **rf_NGN = FGN 10-year yield − sovereign default spread**, then k_NGN = rf_NGN + β × ERP_Nigeria. The v0.1 formula (FGN yield + β × mature ERP × 1.55 = 24.5%) was not Damodaran's: the multiplier scales the default spread, not the mature ERP. It is **withdrawn**.
- *Country-risk basis.* Rating-based or CDS-based. Each route uses the same basis for the default spread it subtracts and the ERP it adds.

| Basis (July 2026) | Default spread | Total ERP | k_USD (β = 1) | USD route in NGN at 12 / 15 / 18% NGN inflation (US 2.5%) | NGN route (local rf) at 18% FGN yield | NGN inflation implied by risk-free parity |
|---|---|---|---|---|---|---|
| Rating (B3) | 5.17% | 12.24% | 16.45% | 27.24 / 30.65 / 34.05% | 25.07% (12.83%) | 10.98% |
| CDS (net of Swiss) | 3.26% | 9.27% | 13.47% | 23.99 / 27.31 / 30.63% | 24.01% (14.74%) | 12.87% |

**Reconciliation.** The two routes agree when the NGN–USD risk-free gap equals the expected inflation differential. At an 18% FGN yield, the NGN route implies NGN inflation of about 11% on the rating basis, or about 13% on the CDS basis. Both are below the base scenario of 15%. A gap between the routes is therefore a statement about the inflation expectation embedded in the FGN curve, and the note shows it as one. The choice of basis moves k by 3.3–3.4 pp on the USD route and by 1.1 pp on the NGN route. The choice of route at base inflation moves it by 5.6 pp (rating) or 3.3 pp (CDS).

**Grid rule (mechanical; no column can be set by hand).** The grid has four columns:
- *low*: the minimum over all routes and scenarios;
- *CDS base* and *rating base*: the USD route at the base inflation scenario, on each basis;
- *high*: the maximum over all routes and scenarios.

Each column carries the inflation scenario that produced it. The growth assumption in that column uses the same inflation: g = (1 + g_real)(1 + π) − 1, with g_real stated. Test Q6 (§4.10) checks that the grid equals the stored route outputs, so changing the grid means changing a stored input. v0.1's 23% column matched no route (it equals the MPR) and is withdrawn.

**Disagreements preserved (§7):**
- *Route.* The equity analyst prefers the USD route (cleaner premium data). The economist prefers the NGN route (market-implied local rates). The risk manager wants both displayed.
- *Basis.* The equity analyst prefers the rating basis (stable and semi-annual; the CDS figure is a single 30 June reading from a thin market). The risk manager wants the CDS basis shown because it is market-based and currently about 3 pp lower.

**Resolution:** no house default. Both routes and both bases are shown as scenario axes. The Investment Committee role (the founder, for the Personal MVP) revisits the display with each semi-annual Damodaran edition.

**Model menu.**

| Model | Best for | Required validated inputs | Output |
|---|---|---|---|
| Free-cash-flow DCF (explicit 5 years + terminal) | Non-financial companies with forecastable cash flows | CFO, capex, working capital, net debt, shares, tax rate | Equity value/share range over a WACC × g grid |
| Excess-return / justified P/B | Banks | Book value, ROE (reported and normalised), payout, cost of equity | P/B range → value range |
| Dividend discount (Gordon & Shapiro 1956) | High-payout NGX and UAE companies; dividend culture | Dividends per share (ex-dates), payout sustainability, growth | Value range; implied required return at market price |
| Relative valuation | Cross-check | Peer set with consistent definitions; last-twelve-months vs forward | Peer percentile, not a target |
| Sum-of-parts | Conglomerates, holdcos | Segment data (IFRS 8) | Range with holdco discount sensitivity |

**Real versus nominal.** Nigerian analysis should be run in nominal NGN with an explicit inflation path per scenario and *also* expressed in USD at the scenario FX path, because the user's goals are multi-currency. A model that discounts NGN cash flows at a USD rate, or that grows NGN cash flows at real rates while discounting at nominal rates, must fail the quant check.

**Dividend-based reasoning for NGX.** Because many NGX large caps are held for dividends and the free-float rules (F5) limit liquidity, the module computes the dividend yield on the *validated* dividend record (declared, closure-of-register date, payment date, withholding), and the implied growth required to justify the price — a diagnostic, not a forecast.

### 4.5 Market-rule registry

The registry is a versioned table. Every row has `rule`, `market`, `value`, `effective_from`, `source`, `source_date`, `checked_on`, `next_check`, `evidence_grade` and `source_status` (`ok` / `moved` / `unreachable`; this is a property of the source, like a series' feed health in C3.2, and not a validation state).

Each row is a **world fact** under C3. It carries the C3 axes and cannot leave `candidate` until the C3.5 entry-time check against a primary-source snapshot passes. **Tax rows are pointers to Doc 6 rule records (C7) and carry no values of their own.**

The analyst layer reads rules from the registry, never from code constants. Initial contents (v0.2, as found or reported on 2026-11-04):

| Market | Rule | Value | Effective | Source | Confidence |
|---|---|---|---|---|---|
| NGX | Trading hours | 09:00–16:00 WAT (pre-open 09:00; continuous 09:30; close 16:00) | 2026-04-27 | S1, S2 | E2 |
| NGX | Price limit (equities) | ±10% shown on the **pre-open** row only; continuous-session daily limit unconfirmed | current page | S1 (per R05a) | E3, `candidate` (2018 guidance showed ±5%; rulebook to confirm; same status in Docs 5b §4.6 and 5c §4.3.5) |
| NGX | Price groups / volume to move price / tick | A ≥ N100: 10,000 / N0.10; B N5–<N100: 50,000 / N0.05; C < N5: 100,000 / N0.01 | 2018-01-29 (2026 revision approved, postponed) | S3, S4, S35 | E2 (2026 status E3; ticks partly confirmed) |
| NGX | Settlement | T+1 (earlier T+2 date unconfirmed) | 2026-06-01 | S9 | E2 |
| NGX | Free float | 20% & ≥300 holders, or N20bn (Main) / N40bn (Premium) | 2019-05-06 | S5 | E2 |
| NGX | Index circuit breaker | ASI ±5% 10:15–13:45 → 30-min halt; further 5% → close | 2016-02-05 | S6 | E2 (times pre-date 2026 hours) |
| Nigeria | Dividend withholding | → Doc 6 rule `NG-DIV-WHT-FINAL-2026` (10%, Withholding Regulations 2024 from 1 July 2024; final via NTAA s.51(3)) | per Doc 6 | Doc 6 F12 | as graded in Doc 6; C7 status |
| Nigeria | T-bill / CP / corporate-bond interest | → Doc 6 rule `NG-INT-SHORTTERM-FINAL-2026` (10% WHT from 28 Oct 2025; FGN bonds and OMO bills excepted) | per Doc 6 | Doc 6 F12; S55 | as graded in Doc 6 |
| Nigeria | FGN bond interest | → Doc 6 rule `NG-BOND-EXEMPT-2026` (NTA s.162(1)(n)) | per Doc 6 | Doc 6 F12 | as graded in Doc 6 |
| Nigeria | Gains on Nigerian-company shares | → Doc 6 rule `NG-CGT-SHARES-NGCO-2026` (₦150m proceeds / ₦10m gain / 12 months) | per Doc 6 | Doc 6 F13 | as graded in Doc 6 |
| DFM/ADX | Trading hours | 10:00–14:45 continuous; closing auction to 15:00 GST; Mon–Fri | — | S30, S31 | E3 |
| DFM/ADX | Daily price limit | +15% / −10% (ADX pauses at −5%, −9%) | — | S30, S31 | E3 |
| DFM/ADX | Settlement | T+2 | — | S30, S31 | E3 |
| DFM/ADX | Foreign ownership | company-specific within 15–100%; real-time FOL data on DFM | — | S30, S31 | E3 |
| DFM/ADX | Tick sizes | AED 0.001 (<1) … 0.10 (≥100) | — | S30, S31 | E3 |
| UAE | Taxes on listed securities | → Doc 6 (none reported for individuals) | — | S30, S31; Doc 6 F28 | E3 → Doc 6 |
| UAE | Securities regulator | Capital Market Authority (CMA), successor to the SCA; Federal Decree-Laws 32 and 33 of 2025 | 2026-01-01 | S54; Doc 6 F36 | E3 |
| US | Filing data | EDGAR XBRL APIs, no key | — | S19 | E2 |
| Nigeria | MPR / corridor / CRR | 23.0% / +50,−300 bp / 45% commercial, 16% merchant, 75% non-TSA public-sector deposits | 2026-09-22 | S10 (re-fetched 2026-11-04) | E2 |
| Nigeria | Liquidity ratio | 30% | 303rd MPC (2025-11) | S10 | E2 |
| Nigeria | Official FX | CBN "NFEM Rate (₦/US$)" field, `price_type = nfem_vwap`, with `fixing_date` and a CBN snapshot, per C5.1 v0.2 (CBN: "derived at Volume Weighted Average and stands as the official exchange rate for the day"; no central column exists) | — | S11; C5.1 | E2 |
| Nigeria | Capital minimums (national / international / D-SIB) | CET1 7.0 / 10.5 / 10.5%; Tier 1 7.5 / 11.25 / 11.25%; CAR 10 / 15 / 15% | 2021-09 guidelines | S52 Tables 1–2 | E2 |
| Nigeria | Capital buffers | CCB1 1.0% (CET1, all banks); CCB2 as set by CBN (currently none found); HLA 1.0% (D-SIBs, CET1) | 2021-09 | S52 ¶30, ¶82, ¶94 | E2 |
| Nigeria | Leverage-ratio minimum | 4% (5% D-SIB) | 2021-09 | S52 ¶98, App. 2 | E2 |
| Nigeria | Maximum dividend payout | Appendix 2 matrix: CET1 band × NPL band × Composite Risk Rating; nil if NPL > 10%, rating High or leverage below minimum | 2021-09 | S52 ¶103–104, App. 2 | E2 |
| Nigeria | FX revaluation gains not distributable | set aside as counter-cyclical buffer; not for dividends or operating expenses | 2023-09 (reiterated 2024-03) | S56 (press; circular not read) | E3, `candidate` |
| Nigeria | Forbearance dividend suspension | no dividends, bonuses or new foreign-subsidiary investment while under credit or SOL forbearance | 2025-06-13 | S57 (press; circular not read) | E3, `candidate` |
| Nigeria | Windfall levy on banks' realised FX gains | 70% passed by the National Assembly (July 2024), from new FX policy to end-2025; assent unverified | — | S58 | E3, `candidate` → Doc 6 |
| Nigeria | Bank minimum capital | N500bn / N200bn / N50bn (commercial by licence) | 2026-03-31 deadline | S32 | E3 |
| Nigeria | Pension equity limits | Fund II 33%; Fund I 35%; Fund III 15%; VI-Active 33% | 2026-02-09 | S12 (`source_status = moved`: 404 on 2026-11-04) | E2 as read 2026-11-02; not re-checkable |
| Nigeria | FGN securities page | instrument list, auction minimum | — | S16 (`source_status = moved`: 404 on 2026-11-04) | E2 as read 2026-11-02 |

Every rule has a `next_check` of at most 90 days. A rule whose source has moved or disagrees at re-check is shown with its last confirmed date and its C3 status (`disputed` on disagreement), and it stops driving conclusions once its freshness reaches `stale` (C3.4).

### 4.6 Fixed income

| Segment | Primary data | Analytics (all reproducible from stored inputs) | Nigeria/UAE specifics |
|---|---|---|---|
| FGN bonds and T-bills | DMO auction results and circulars; FMDQ closing prices/yields; NGX for retail bond trades (F16) | Yield to maturity, modified duration, convexity, real yield = (1+y)/(1+π_expected) − 1 under stated inflation scenarios; holding-period return under rate scenarios | No inflation-linked instruments: real-yield analysis is scenario-based; auction minimum N50,001,000 means retail access is via secondary market, FGN Savings Bonds or funds. **Tax per Doc 6:** FGN bond interest exempt (s.162(1)(n)); T-bill interest 10% WHT from 28 Oct 2025, final for individuals per Doc 6 (NTAA s.51(5)); OMO bills excepted from the directive. Real-return bands use after-tax yields from Doc 6 rule records |
| FGN Eurobonds | DMO closing prices; dealer quotes (Doc 5c) | USD yield, spread to US Treasuries, duration | Sovereign rating B3 (July 2026 Damodaran sheet) — store rating with date |
| UAE T-Bonds/T-Sukuk, corporate sukuk | MoF auction calendar; Nasdaq Dubai/ADX listings (Doc 5c) | Yield, profit-rate equivalents, duration; sukuk structure notes (asset-based vs asset-backed) | Dirham peg means USD rate scenarios drive AED yields; retail/fractional access reported (F17) |
| US Treasuries | Official curve (Doc 5c) | Standard | The USD leg of the user's liabilities anchors the risk-free rate |
| Credit (Nigerian commercial paper, corporate bonds) | FMDQ quotations | Spread, issuer analysis via §4.2/4.3 | Thin liquidity; rating agency coverage uneven; 10% WHT per Doc 6 |

"Inflation-linked thinking" in Nigeria: because no linker exists, the system expresses every NGN fixed-income holding as a *real-return band* under the house inflation scenarios (§4.8) and shows the break-even inflation at which the real return turns negative. This is arithmetic, not forecasting.

### 4.7 Funds

| Fund type | Data | What the research layer checks | Access and cost notes |
|---|---|---|---|
| Nigerian mutual funds (SEC-registered CIS) | SEC monthly/weekly NAV reports [S18, S39] | NAV trail, fees from prospectus, holdings concentration, currency (dollar funds), redemption terms | Dominated by money-market funds (68% of NAV, F18); equity funds are 2.4% — small and often illiquid |
| NGX ETFs | NGX quotes; fund fact sheets (Doc 5c) | Premium/discount to NAV, tracking difference, market-maker presence | Industry ETF NAV about N33bn (F18): low liquidity; large bid–ask spreads likely |
| UAE funds and ETFs | CMA (formerly SCA) / DFM / ADX (Doc 5c) | Same | Shari'a-compliant options via DFM classification [S22] |
| US ETFs | Issuer sites, SEC filings | Expense ratio, index methodology, domicile. Tax per Doc 6: 30% US WHT on dividends for non-resident aliens with no treaty relief for Nigeria or the UAE (F30); US-situs holdings above USD 60,000 trigger the estate-tax monitor (F31). Domicile is shown as a fact, not a recommendation | Access route from Nigeria/UAE (international broker vs local digital sub-broker) and custody chain are unknown — Doc 5c/Legal to establish |

### 4.8 Macro and emerging-market context without forecasting

**Design rule.** Macro variables enter as (a) *context* displayed with as-of dates, (b) *scenario inputs* to valuation and goal arithmetic, and (c) *constraints and stress tests* in allocation. They do not enter as expected-return tilts.

| Variable | Source and cadence | How it is used | How it is not used |
|---|---|---|---|
| Nigeria MPR, corridor, CRR | CBN MPC decisions (six scheduled meetings per year; last 22 Sept 2026) [S10] | Discount-rate build-up; bank NIM sensitivity; cash-yield comparisons | Not used to time equity exposure |
| Nigeria CPI (rebased 2024 basis) | NBS monthly [S13] | Inflation scenarios (low/base/high) for real-return bands | No point forecast of inflation |
| NGN/USD NFEM | CBN daily [S11]; FMDQ NAFEX fixing [S17] | FX scenarios for USD-equivalent values; convertibility risk flag | No FX forecast |
| Oil price and production | Doc 5c to source | Scenario driver for fiscal, FX and bank asset quality | Not a trading signal |
| Fiscal (debt service, Eurobond spreads) | DMO; dealer quotes | Sovereign-risk context for banks and FGN holdings | — |
| UAE: USD peg, CBUAE base rate, oil/non-oil split | CBUAE (page not fetched in session), MoF | AED rates follow US rates; UAE equities' dividend seasonality and FOL | — |
| US: policy rate, Treasury curve, CAPE-type valuation level | Official sources (Doc 5c) | Risk-free anchor; "valuation relative to history" statement with error bands (F21) | No expected-return promise |

**Regime frameworks and their limits.** Growth/inflation quadrant maps and Markov-switching models (F22) are useful for *describing* which historical environments resemble the present and for generating stress scenarios (e.g., "2016 and 2023 FX episodes"). They are not used to shift allocations automatically because regime identification lags, parameters are unstable and the out-of-sample record of macro timing is poor (F21). **Disagreement preserved (§7):** the strategist argues a rules-based macro overlay with small tilts is standard institutional practice; the risk manager argues the evidence does not justify it for a single individual with no risk budget to absorb model error. Proposed resolution: macro may set *constraints* (e.g., minimum USD liquidity when FX convertibility risk is high) but not *tilts*, until Doc 5b shows out-of-sample benefit on local data.

**What the product may say about returns.** It may show: historical ranges; the deterministic arithmetic of required saving under several labelled net-return assumptions; the valuation level relative to history with the dispersion of subsequent outcomes. Any likelihood statement about a goal comes only from the C6 goal engine: a predictive count with quantiles, the adjustment needed and drift sensitivity, from a named assumption set. It may not show: a single expected return; "will"; "on track to reach" without the assumption stated in the same sentence.

### 4.9 From security to the individual: circumstances as explicit inputs

The institutional analogue of "individual financial circumstances" is the investment policy statement. Portfolio OS captures the equivalent as a structured input record *before* research begins. The record drives a **constraint filter** that decides which securities are researched. Its output is a **research-coverage list** that gives the reason for every exclusion or flag. It is not an allocation, a weight or a recommendation.

**Input schema (System A supplies; the user confirms; nothing may be assumed).** Every field record carries `value, type, unit, source (user | ledger | questionnaire), confirmed_by, confirmed_at, expiry_at, version`. An unconfirmed or expired field is `candidate` under C3 and cannot drive a conclusion.

| Field | Type / unit | Example | Confirmation and expiry | Status now |
|---|---|---|---|---|
| Tax residency and citizenship | enum per jurisdiction + day counts | Nigeria / UAE / both / unknown | Doc 6 annual residency questionnaire (signed attestation); 12 months | **Unknown — founder to confirm** (Doc 6) |
| Income streams | per stream: ISO 4217 currency, amount per year, source, sector code, stability | NGN salary from a bank | Ledger (System A) + user; 12 months | Unknown |
| Liabilities | list of (currency, amount, due date) | AED rent, quarterly | User + ledger; on change | Unknown |
| Goals | list of (currency, amount, date, priority enum) | "USD 100,000 by 2031, essential" | User; on change | Example in brief |
| Liquidity need | months of expenses per currency | 6 | User; 12 months | To be set |
| Loss tolerance per goal | **user-stated** maximum drawdown constraint, % of bucket value | "rent bucket: 0%" | User statement, re-confirmed yearly | Not a psychometric measure (see below) |
| Human capital | **user-confirmed assumptions**: income growth path, discount rate, sector link | "employer sector: banking" | User-entered, E5; never inferred from records (Doc 3 §4.7) | Unknown |
| Access constraints | per market: broker, custody, FX repatriation | NGX via a Nigerian broker | User | Unknown |
| Existing concentrations | employer stock, property, family business | — | User + ledger | Unknown |
| Constraint parameters (rules 1–4) | user-set numbers, each with a logged reason | near-liability window; issuer, sector and country caps; minimum equity horizon | User; versioned; every override logged | **No defaults shipped** |

**Relation to Doc 3 (R05a M6a).** Doc 3 adopts the SOEP general risk item and the DOSPERT financial items. Those describe the person, not a goal bucket, and Doc 3 names no instrument that elicits per-goal loss tolerance. This document therefore stores per-goal tolerance as a **user-stated constraint**, like a liability date. It is not a measured trait, and the SOEP item is never used to set it. Whether a validated per-goal instrument should be built is Doc 3's decision (deferred; owner Doc 3).

**Human capital (R05a M6b).** A present value of future earnings and a correlation with a sector are inferred quantities. They are E5 assumptions and enter only as values the user entered and confirmed. The system never infers them from transaction records.

**Provisional mode (R05a M6d).** While residency is unknown, which is the current state, the filter runs under each candidate residency scenario (Nigeria-resident; UAE-resident only; both) using Doc 6's rule records. Every output is labelled "provisional: residency unconfirmed" and carries the weakest C7 watermark of the rules used. Provisional outputs never feed a tax or other conclusion-driving calculation. An instrument whose treatment differs between scenarios is listed with the difference. The universe is therefore not emptied, and nothing is silently included.

**Constraint rules (E5; advice-sensitive at commercialisation).** v0.1 shipped thresholds as house policy: 24 months, 5% per issuer, 25% per sector, five-year equity horizon, single stocks only in the aspirational bucket, "bank stocks beyond 0%" and "FGN Eurobonds only in a small slice". They had no source and no named discipline (R05a §3, M7). Applied to another person, they would be allocation advice. **They are withdrawn as defaults.** Each rule now evaluates a parameter the user sets:

1. *Currency of near liabilities (structural check; Sharpe & Tint; Chhabra safety bucket).*
   - 1a. Liabilities due inside the user's window are matched against assets in the same currency. NGN assets do not count towards AED or USD liabilities inside the window, because NFEM convertibility is a risk (F7, F15).
   - 1b. Beyond the window, a currency mismatch is shown as a named risk with its FX sensitivity. It is a **flag, not an exclusion** (this fixes the v0.1 Example 3 inconsistency, R05a M6e).
2. *Liquidity.* The intended position must be within the user-set share of 60-day average daily value traded, and the issuer must meet the exchange free-float rule (F5; a fact, not a preference). NGX names unchanged for 20 sessions are flagged "price stale by rule" (F3).
3. *Concentration.* The user sets issuer, sector and country caps. Employer or sector exposure counts through human capital only if the user has confirmed the sector link (F25, F26).
4. *Horizon.* The user sets a minimum horizon per asset class, if any.
5. *Data quality (structural).* An instrument is not admissible for valuation unless every mandatory input is conclusion-eligible under C3.4.
6. *Tax and access.* Instruments the user cannot legally buy are excluded. Tax treatment runs in provisional mode as above.
7. *Shari'a preference (if stated).* The DFM classification list or the stated screen is applied as a hard filter.

**Output values (consistency pass, I7).** Each rule returns `pass`, `exclude` or `flag` for an instrument against a goal or bucket, with a reason code. Exclusions come from rules 1a, 2 (free float, liquidity share), 4, 5, 6 and 7. Rule 1b, the "price stale by rule" marker and rule 3's caps produce flags, as in Example 3. Doc 5b consumes the three values as set out in 5b §4.1. The result is never collapsed to yes/no, because that would turn flags into exclusions (R05a M6e).

Every rule result carries `advice_sensitive: true` and names the regulatory trigger that would apply if the output were offered to another person (Doc 6 F35, SEC Nigeria robo-advisory rules; F36, UAE CMA "financial advisory"). Worked example 3 (§4.11) shows the filter for a synthetic household using that household's own parameters.

### 4.10 Research-quality and data-quality framework

**Figure model (CANONICAL_CONTRACTS C3; rendering per C2).** Every number that can reach the user is a C3 figure. It has a validation axis V (`candidate`, `auto_validated`, `validated`, `disputed`, `rejected`), freshness F computed at read time and never stored, lifecycle L, rights R, identity I, corroboration C and method M. It is rendered only through C2 tokens. The model never writes a digit. This document adds research fields:
- `period` (e.g. `TTM-2026Q3`, `FY2025`);
- `period_end`;
- `period_kind` (`flow` | `stock` | `market`);
- `scale`;
- `filing_ref` (document, page/table, XBRL tag);
- `formula_ref` and input IDs for derived figures.

The v0.1 V0–V3 scale is retired using the C3.7 mapping:

| v0.1 | C3 |
|---|---|
| V0 unvalidated | `candidate` |
| V1 single source | `auto_validated` + `single_source` |
| V2 two sources reconciled | `auto_validated` + `two_independent` |
| V3 reconciled to filing page | `validated` with primary-document evidence |

**Who checked (C3.3a, contracts v0.2).** Every validation event records `independence` (`self`, `simulated_agent`, `second_person`, `licensed`). In the personal MVP every human check, including a V3 reconciliation to the filing page, is the founder's own, so it is `self` and displays "self-checked", never "validated"; a check by software alone displays "checked by software". Eligibility for the C3.4 tiers is unchanged. A derived figure or note carries the weakest independence among its inputs ("includes self-checked figures"). In this document the status value `validated` names the V axis only, not a display label.

`two_independent` cannot be reached for NGX prices or NGX-relayed dividends. CSCS, Kobo and Mansa copy NGX, and the NGX dividends endpoint relays the issuer's notice (Doc 5c §4.3.3, F27). These fields are therefore `same_upstream` (or `single_source`). They reach the conclusion tier only through V = `validated` or the C3.3 single-source protocol: internal-consistency checks and plausibility bands pass, and a human sample of 1 in 20 figures, with a floor of max(⌈n/20⌉, min(n, 4)) checks per series per year for n editions, plus every band break, finds no error (C3.3 v0.2; Doc 5c §4.3.3). Every edition of a quarterly, semi-annual or annual series is therefore checked, and a monthly series at least quarterly.

**Inputs that must be eligible for a conclusion-driving calculation (C3.4) before any conclusion:**
- last price and its trade date;
- shares outstanding, period-end and period-weighted, with bonus and rights adjustments;
- EPS, reported and recomputed from net income over weighted shares;
- operating cash flow and capex;
- dividends (declared, closure-of-register date, payment date, withholding per Doc 6);
- corporate actions;
- the FX rate used (C5.1);
- period end and filing date;
- licence category, D-SIB status and every regulatory threshold for banks (registry rows at C3 eligibility);
- index membership, if used.

A single-source input, such as a country-risk edition, qualifies only through the C3.3 sampling rule. A semi-annual edition is human-checked at every edition under the v0.2 floor. The internal-consistency checks are listed in Example 1.

**Freshness thresholds.** This document has **no freshness table of its own**: the v0.1 table and its merge proposal are withdrawn (R05c M8; R05a m1). The rules are **C3.2a** (contracts v0.2, CC-10), with thresholds in **Doc 5c §4.3.2**:
- a sourced calendar or filing deadline governs, and day counts are fallbacks used only while no such record exists; the deadline is itself a C3.5 world fact, never typed by hand;
- a periodic fundamental is `fresh` until the next filing that would update it is due, `ageing` from that due date until it is published, and `stale` once it is published but not ingested, or 30 days after the due date (E5); no fixed day count makes an annual statement fresh (the "300 days" rule is withdrawn);
- a metric used as a current-period measure, such as TTM earnings, takes its freshness from the next filing of **any** period type that would update it, interims included;
- FX follows C5.2, and a policy rate its meeting calendar.

The script's `fresh_5c()` uses Doc 5c's fallback day counts, because no NGX filing deadline is registered yet (V-031). Doc 5c governs the thresholds; C3 governs the vocabulary and the rules.

**Note status is computed, never typed.** It is `invalidated` if any trigger has fired. Otherwise it is the worst F among the note's conclusion-driving inputs (`current` when that worst F is `fresh`). Display follows C3.4: a stale figure is shown with its badge and is excluded from conclusion-driving calculations, and a derived figure inherits the worst F and the minimum V of its inputs.

The repository's hard-coded 27.50% MPR was **wrong when committed** on 2026-03-02: 26.50% had been in force since 24 February 2026, and 27.00% from 23 September 2025 (F13). The C3.5 entry-time check would have blocked it; a freshness rule alone would not.

**Quant-check tests (run on every note; each is a CI test).**

| ID | Test | Action on failure |
|---|---|---|
| Q1 | **Period alignment.** Every flow ratio uses one period (e.g. TTM to the same date). Stocks are dated at that period end (or its opening date, for averages). Share counts are weighted over the flow period | Block publication |
| Q2 | Share count used for per-share figures matches the period (weighted for EPS; period-end for BVPS) and reflects every corporate action. Every input of a per-share metric carries the same `ca_set_version`; a price dated on or after an ex-date combined with a pre-action share count refuses (C3.3 "Pending corporate actions", v0.2) | Block |
| Q3 | **Tax-effected normalisation.** Pre-tax items are never netted against post-tax profit. The tax attribution comes from the tax note; if the note is silent, both variants are shown | Block |
| Q4 | **Sustainable growth and payout consistency.** (a) DDM cells: g ≤ ROE × (1 − declared payout). (b) Justified-P/B cells display their implied payout 1 − g/ROE; where it differs from the declared payout by more than 10 pp, the note states that the rows assume different distribution policies. (c) The implied payout lies in [0, regulatory distributable cap] | (a) cell marked "inconsistent" with the reason; (b) mandatory disclosure line; (c) cell flagged per risk-rating value |
| Q5 | g < k and ROE > g in every cell | Cell shows "n/a (g ≥ ROE)" |
| Q6 | The **grid equals the stored route outputs** (§4.4); no hand-set column | Block |
| Q7 | Currency, inflation and real/nominal consistency. The inflation in g equals the inflation in that column's k | Block |
| Q8 | Units and scale consistency | Block |
| Q9 | Header status computed from inputs; regulatory thresholds read from registry rows | Block |

**Reviewer sign-off workflow.**
1. The analyst prepares the note and writes the invalidation conditions.
2. The quant check runs Q1–Q9 and recomputes every derived figure from stored inputs.
3. The data-quality check confirms C3 eligibility, freshness, corporate actions applied (matched `ca_set_version`) and registry rows current.
4. The note is published.

Each stage records who or what signed and when, with its `independence` (C3.3a). A note cannot be published with an open check. For the Personal MVP, the quant and data-quality checks are automated tests ("checked by software") plus a mandatory human confirmation screen. The founder's confirmation is `self`, so the note shows "self-checked", never "independently reviewed" or "validated".

**Never automated into a recommendation:**
- buy/sell/hold ratings;
- target prices;
- expected-return point estimates;
- tax positions;
- leverage or margin;
- order placement;
- any statement derived from inputs that are not conclusion-eligible (C3.4);
- any digit written by a language model (C2: System H writes connecting text, and values arrive as tokens).

**Permitted language.** Permitted: "research view", "range", "scenario", "the price implies … under assumptions …", "we could not establish", "as of <date> per <source>". Not permitted:
- "will", "guaranteed", "expected return of X%";
- "buy", "sell", "hold";
- "on track", unless the assumption is in the same sentence;
- any figure without an as-of date;
- **and, new in v0.2, any phrasing that ranks price against value as a call**: "overvalued", "undervalued", "cheap", "expensive", "attractive", "upside" or "downside to fair value", "not consistent with … at any …". v0.1's own Example 1 view was a call by paraphrase (R05a M7).

Every note, research view and constraint rule carries `advice_sensitive: true`. This is research and analysis for the founder's own use, which is outside the SEC Nigeria and UAE CMA perimeters per Doc 6 §4.6. Offered to another person, security-specific output would be regulated advice (Doc 6 F35, F36). Legal must approve the exact wording and the linter's list before any such use (brief §5.5).

### 4.11 Worked examples (ALL NUMBERS SYNTHETIC)

Every figure below is printed by `research/scripts/doc05a_worked_examples.py` (`python3 -I`). Sourced parameters, namely the Damodaran July 2026 values and the CBN capital rules, are labelled; everything else is synthetic.

#### Example 1 — Research note for hypothetical NGX "Bank X" (rebuilt in v0.2)

**Why it was rebuilt.** The v0.1 note failed its own gates (R05a B1, B2). The script reproduces each failure:
- its FY2025 inputs were 308 days old and its H1-2026 inputs 127 days old. Both were "stale" under the v0.1 freshness table, yet the header said "current". Both are also "stale" under Doc 5c v0.2's fallback rules (annual stale after 270 days; interim stale after 120). The earlier claim that they would be "ageing" and "fresh" under Doc 5c used 5c's withdrawn v0.1 thresholds and is withdrawn (V-031);
- it carried a V1 row under an "all inputs V2+" header;
- it mixed period ends (2025-12-31 and 2026-06-30), so the period-alignment test Q1 fails;
- "27.5% of PBT" was 110/400, a pre-tax gain over profit after tax;
- normalised ROE netted a pre-tax gain off post-tax profit;
- g = 12% with a 30% payout implies a payout of 57% at ROE 28% under the justified-P/B identity;
- the 23% cost-of-equity column matched no route; it equals the MPR;
- "no regulatory payout cap" is contradicted by the CBN Appendix 2 matrix and by the FX-gains circular.

**Header.**
- Bank X Plc (synthetic ticker BNKX) · note type: initiation · as-of 2026-11-04.
- Basis: trailing twelve months (TTM) to 2026-09-30, from the Q3-2026 interim published 2026-10-29 (synthetic).
- **Status (computed): current.** The worst freshness among conclusion-driving inputs is `fresh`: price 1 trading day old; Q3 interim 35 days after period end; country-risk edition 4 months old.
- Quant check: Q1–Q3 and Q5–Q9 pass. Q4 marks three DDM cells and requires the payout disclosure, both shown below.
- Data-quality check: three inputs are not conclusion-eligible and are excluded from conclusions (marked †).
- Expiry: when the FY2026 audited statement becomes due, or on any trigger.
- `advice_sensitive: true`.

**Provenance table.** Every `validated` row is a check by the founder (`independence = self`) and displays "self-checked"; the note header carries "includes self-checked figures" (C3.3a).

| Field | Value | Unit | Period / as-of | Source ref | Status (C3) |
|---|---|---|---|---|---|
| Last price | 60.00 | NGN/share | close 2026-11-03 | Exchange daily list (synthetic); the CSCS daily list is a copy-fidelity comparator only, because CSCS copies NGX | `validated`, `same_upstream`. Single source in effect: eligible via the C3.3 protocol (Doc 5c §4.3.3) |
| Shares: period-end / TTM weighted | 30.0 / 30.0 | bn | 2026-09-30 / TTM | Q3 note 24. Rights issue completed June 2025, **before** the TTM window, so there is no share change in the window | `validated` |
| PBT / tax / PAT | 600 / 180 / 420 | NGN bn | TTM to 2026-09-30 | Derived: FY2025 + 9M-2026 − 9M-2025 (formula stored) | `validated` (derived; minimum V of inputs) |
| FX revaluation gains (pre-tax); tax attributed in tax note | 150; 30% | NGN bn; % | TTM | Q3 note 9; tax note | `validated` |
| Equity, opening / closing | 1,450 / 1,650 | NGN bn | 2025-09-30 / 2026-09-30 | Interim statements of financial position | `validated` |
| DPS (TTM) | 4.00 | NGN | FY2025 final 3.00 (closure of register 2026-03-20, paid 2026-04-10) + 2026 interim 1.00 (paid 2026-10-15) | Issuer notices; the exchange corporate-action releases relay them | `auto_validated`, `same_upstream`. Conclusion-eligible only while the C3.3 sampling rule holds |
| Gross loans / Stage 3 / Stage 3 ECL | 3,000 / 150 / 120 | NGN bn | 2026-09-30 | Q3 note 18 (IFRS 9 staging) | `validated` |
| Prudential NPL ratio (CBN definition) | 4.6% | % | 2026-09-30 | Pillar 3 table | `validated` |
| CET1 / Tier 1 / CAR / leverage | 17.5 / 18.0 / 22.0 / 7.5 | % | 2026-09-30 | Pillar 3 | `validated` |
| Licence / systemic status | international; D-SIB | — | 2026-09-30 | CBN D-SIB list (synthetic) | `validated` |
| Statutory-reserve transfer; RRR adjustment | 63; 0 | NGN bn | TTM | Statement of changes in equity | `validated` |
| Composite Risk Rating † | not published | — | — | — | not available: payout cap shown for every value |
| Forbearance status † | none disclosed | — | 2026-09-30 | Annual report, CBN releases | `candidate` (absence of disclosure is not evidence) |
| Qualifying capital vs threshold † | 520 vs 500 | NGN bn | 2026-09-30 | Note 30; threshold from press [S32] | `candidate` (threshold lacks a primary snapshot, C3.5) |
| MPR | 23.0% | % | 2026-09-22 | CBN MPC page [S10] | `auto_validated`, `single_source` (C3.5 snapshot passed; one registry record with Doc 5c §4.3.1) |
| Country risk, rating / CDS basis | 12.24% / 9.27% total ERP | % (USD) | edition 2026-07-01; CDS 2026-06-30 | [S27] | `auto_validated`, `single_source`; sampling rule met by internal-consistency checks (spread × 1.5545 = CRP; 4.20% + CRP = total ERP; both pass) |
| FGN 10-year; US 10-year; inflation scenarios | 18.0%; 4.42%; NGN 12 / 15 / 18%, USD 2.5% | % | — | Labelled synthetic assumption set | assumption (M = `estimated`) |

**Derived metrics (formulas stored).**
- EPS 14.00; P/E 4.29×; BVPS 55.00; P/B 1.09×; dividend yield 6.67%.
- Payout 28.6% of reported EPS, or 38.1% of normalised EPS.
- ROE 27.1% reported. Normalised ROE is 20.3% with the FX gain tax-effected at the tax note's 30%, or 17.4% if the gain was untaxed.
- FX revaluation gains are 25.0% of PBT (pre-tax over pre-tax). After tax they are 25.0% of PAT; the two shares are equal only because the gain bears the average rate.
- Stage 3 ratio 5.0% (IFRS 9; **not** compared with the CBN 5% threshold). Prudential NPL 4.6%, which puts the bank in Appendix 2's lowest NPL band. Stage 3 coverage 80%.

**Capital and distributions (CBN rules from the registry).**

| | Bank X | Effective D-SIB floor | Headroom |
|---|---|---|---|
| CET1 | 17.5% | 12.5% (10.5 + CCB1 1.0 + HLA 1.0) | 5.0 pp |
| Tier 1 | 18.0% | 13.25% | 4.75 pp |
| CAR | 22.0% | 17.0% (15.0 + 1.0 + 1.0) | 5.0 pp |
| Leverage | 7.5% | 5.0% | 2.5 pp |

The cap is computed in three steps:
1. Adjusted profit (Appendix 2) = PAT 420 − statutory reserve 63 − RRR 0 = **357bn**.
2. Excluding after-tax FX revaluation gains (Sept 2023 circular, E3) leaves **252bn**.
3. The Appendix 2 payout cap for a D-SIB with CET1 above 12.5% and NPL below 5% depends on the unpublished risk rating:

| Risk rating | Max payout | Max distributable | DPS cap | Declared DPS 4.00 within cap? |
|---|---|---|---|---|
| High | 0% | 0 | 0.00 | No |
| Above Average | 25% | 63bn | 2.10 | **No** |
| Moderate | 75% | 189bn | 6.30 | Yes |
| Low | 100% | 252bn | 8.40 | Yes |

The cap is zero if the bank is under forbearance (June 2025 circular, E3). **Dividend capacity cannot be established from public data.** The declared dividend is within the cap only if the risk rating is Moderate or Low and the bank is not under forbearance.

**Valuation ranges (justified P/B = (ROE − g)/(k − g); g = (1 + g_real)(1 + π) − 1 with g_real = 0%, stated: zero real growth; nominal ROE held at its TTM level in every column, a stated limitation in the high-inflation columns).**

| Column (derived mechanically, §4.4) | low | CDS base | rating base | high |
|---|---|---|---|---|
| k (source route) | 24.0% (USD, CDS, π 12%) | 27.3% (USD, CDS, π 15%) | 30.6% (USD, rating, π 15%) | 34.1% (USD, rating, π 18%) |
| g | 12.0% | 15.0% | 15.0% | 18.0% |
| Reported ROE 27.1%: P/B; value; implied payout | 1.26×; **69.3**; 55.7% | 0.98×; **54.1**; 44.6% | 0.77×; **42.5**; 44.6% | 0.57×; **31.2**; 33.6% |
| Normalised ROE 20.3% | 0.69×; **38.2**; 41.0% | 0.43×; **23.8**; 26.2% | 0.34×; **18.7**; 26.2% | 0.14×; **8.0**; 11.4% |
| Normalised, FX gain untaxed, 17.4% | 0.45×; **24.9**; 31.1% | 0.20×; **10.8**; 13.9% | 0.15×; **8.5**; 13.9% | n/a (g ≥ ROE; Q5) |
| DDM at declared DPS 4.00 | 37.4 | 37.4 ‡ | 29.4 ‡ | 29.4 ‡ |
| Price-implied ROE at P/B 1.09× | 25.1% | 28.4% | 32.1% | 35.5% |

Q4(b) disclosure: the P/B rows imply payouts of 33.6–55.7% of reported earnings, against a declared 28.6%. The P/B and DDM rows therefore assume different distribution policies. v0.1 had the same gap (57% against 30%) and did not say so.

‡ Q4(a) flag. At the declared payout, sustainable growth is 19.4% on reported ROE but only 12.6% on normalised ROE. The DDM value at g = 15–18% therefore holds only if the reported ROE is sustainable.

Every implied payout in the table is below Bank X's distributable cap in the Low case (100% of 252bn = 60% of reported PAT). Several exceed the cap in the Above Average case (25% of 252bn = 15% of reported PAT): the bank could not distribute at that rate even if its earnings were sustainable. Because the rating is unknown, Q4's cap test reports its result for each rating value instead of a single pass or fail.

**Research view (permitted language; `advice_sensitive: true`).** At 60.00 the price implies a sustainable ROE of 25.1–35.5% across the grid. The TTM reported ROE is 27.1%, and the normalised ROE is 20.3% (17.4% if FX gains were untaxed). The gap measures how much of the market's pricing rests on FX-driven earnings and on distribution capacity persisting. The note issues no rating and no target, and takes no view on whether the price is right.

**Thesis.** Bank X completed a rights issue in June 2025 (synthetic) and reports CET1 5.0 pp above its D-SIB effective floor. Its valuation is most sensitive to two things the note cannot observe directly: whether FX revaluation earnings recur, and its supervisory risk rating, which sets its dividend cap. The monitoring question is earnings mix and distribution capacity, not growth.

**Invalidation conditions (each mapped to a monitored field).**
1. Prudential NPL above 5% (Appendix 2's next band), or Stage 3 above 7.5% for two consecutive quarters.
2. Stage 3 coverage below 60%.
3. Headroom over the effective floor below 2 pp on CET1 or CAR, or leverage below 6%. The 2 pp and 1 pp margins are note-level monitoring parameters (E5), not regulatory figures.
4. A dividend omitted, a forbearance disclosure, or a change to any CBN distribution row in the registry.
5. FX revaluation gains above 40% of PBT (pre-tax over pre-tax).
6. Any conclusion-driving input becomes `stale`, `expired` or `disputed`; the status is recomputed.
7. A new country-risk edition or FGN yield move that shifts any grid column by more than 2 pp triggers a re-run.

**Disclosures.** Synthetic example; no position; status computed; methodology §4.3–4.4 and §4.10; Damodaran July 2026 edition, both bases.

#### Example 2 — Short note on hypothetical US "Company Y"

**Header.**
- Company Y Inc. (synthetic) · note type: update · as-of 2026-11-04.
- Basis: TTM to 2026-09-30, from the FY2025 10-K and the Q3-2026 10-Q (synthetic). In v0.1 the FY2025 10-K stood alone. At 308 days it is "stale" under Doc 5c v0.2's annual fallback (more than 270 days), and a newer period exists (R05a m4; corrected from "ageing", V-031).
- Data: SEC EDGAR companyfacts JSON for the synthetic CIK, fields `us-gaap:NetCashProvidedByUsedInOperatingActivities`, `us-gaap:PaymentsToAcquirePropertyPlantAndEquipment` and `dei:EntityCommonStockSharesOutstanding`, each stored with `accn`, `fy`, `fp`, `form` and `filed` [S19].
- Status (computed): current. API facts reconciled to the filing page by the founder, so `validated` with `independence = self`, shown as "self-checked" (C3.3a). `advice_sensitive: true`.

**Inputs.** Free cash flow USD 1,200m (TTM); net cash USD 2,000m and shares 500m at 2026-09-30 (10-Q balance sheet and cover page); five-year FCF growth 6% (an analyst assumption, stated); terminal growth 2–3%. The WACC range is 8.5–10.0%, built up from the 4.20% adjusted USD risk-free rate (§4.4), the July 2026 mature-market ERP of 4.20%, and stored β and capital-structure assumptions.

**Quality flags.** Piotroski F-score 7/9 (computed from XBRL facts; components shown); Beneish M-score −2.4 (below the −1.78 threshold, so no manipulation flag); accruals ratio −2% of assets (cash-backed earnings). These are descriptive flags (F19).

**Valuation grid (equity value per share, USD; reproduced by the script).**

| | g = 2% | g = 3% |
|---|---|---|
| WACC 8.5% | 48.7 | 55.2 |
| WACC 9.5% | 42.6 | 47.2 |
| WACC 10.0% | 40.2 | 44.1 |

**Research view.** The value range is USD 40–55 against a synthetic price of 52. The price implies a WACC near 8.5–9% with 3% terminal growth.

**Invalidation.** FCF conversion (FCF/net income) below 70% for two years; net cash turning to net debt without an acquisition disclosure; any restatement (8-K Item 4.02).

#### Example 3 — Constraint filter for a hypothetical individual (rebuilt in v0.2)

**Circumstances (synthetic).**
- *Income.* Net income NGN 60m per year **after Nigerian personal income tax as computed by the Doc 6 engine under the Nigeria-resident scenario**. This is provisional, because residency is unconfirmed, and carries the C7 watermark. That is about USD 45,113 at a synthetic NGN 1,330/USD.
- *Employment.* Employed by a Nigerian bank. The user has confirmed the employer-sector link.
- *Rent.* AED 120,000 per year (USD 32,675 at the 3.6725 peg, a registered world fact that stays `candidate` until a CBUAE snapshot exists, C5.1/C3.5), paid quarterly.
- *Goal.* USD 100,000 in five years, priority "essential".
- *Liquid assets.* NGN 25m (USD 18,797), AED 40,000 (USD 10,892) and USD 15,000; no debt.
- *Access.* NGX and FGN securities via a Nigerian broker; DFM/ADX via a UAE broker with a NIN; US ETFs via an international broker (access unverified).
- *Constraint parameters entered by this synthetic user (not house values).* Near-liability window 24 months; issuer cap 5% of liquid net worth; sector cap 25% including human-capital exposure; equities only for goals of five years or more.

**Step 1 — liabilities and buckets (Chhabra / Sharpe–Tint logic).** The output is a coverage list with reasons, not an allocation.

| Bucket | Purpose | Currency | Horizon | Passes the user's constraints | Excluded (E) or flagged (F) | Tax and other flags (Doc 6) |
|---|---|---|---|---|---|---|
| Safety | 6 months of expenses | AED and NGN, split by spending | 0–12 months | AED deposits; NGN money-market funds; NGN T-bills | E: equities (user rule 4). E: NGN assets for AED spending (rule 1a) | T-bill interest 10% WHT from 28 Oct 2025, final for individuals per Doc 6 (NTAA s.51(5)). Deposit interest: Doc 6 default Treatment A (WHT creditable), with Treatment B (final) shown alongside. Any AED or USD spending by a Nigerian resident may realise a chargeable currency gain (s.34(1)(b); C1.6) |
| Rent reserve | Next 12 months of rent | AED | ≤ 12 months | AED deposits; short UAE T-Sukuk/T-Bonds if retail access is confirmed (F17) | E: NGN instruments (rule 1a). E: DFM equities (rule 4) | Currency-gain flag as above. AED 40,000 covers 4 of 12 months: **shortfall AED 80,000** |
| USD goal | USD 100,000 in 5 years | USD | 5 years | USD T-bills / short Treasuries; broad US ETFs (rule 4 admits equities at 5 years; the system shows drawdown history for an *essential* goal and does not say whether to hold them); FGN Eurobonds (shown with the B3 rating and its date) | F: NGN equities, currency mismatch beyond the window (rule 1b: flagged, not excluded) | US-domiciled ETFs: 30% US WHT on dividends (Doc 6 F30). USD 100,000 of US-situs assets exceeds the **USD 60,000 estate-tax threshold** (Doc 6 F31), so the monitor fires. Foreign-share gains have no Nigerian threshold (Doc 6 F13). Domicile alternatives are shown as facts, not advice |
| Aspirational | Surplus after the above | Any | > 5 years | **Nothing to fund under current figures** (Step 2) | — | — |

**Step 2 — goal arithmetic (deterministic; no forecast).** These are the C6 `required_return` / required-saving fields. Any likelihood statement would come only from the C6 engine with a labelled assumption set.

| Starting balance counted | 0% net | 2% | 4% | 6% | Share of net income |
|---|---|---|---|---|---|
| USD 15,000 only (the user earmarks the NGN and AED balances to the safety and rent buckets) | USD 17,000/yr | 16,033 | 15,093 | 14,179 | 37.7% → 31.4% |
| All liquid assets, USD 44,689 | 11,062 | 9,735 | 8,424 | 7,131 | 24.5% → 15.8% |

Rent alone is 72.4% of net income at the synthetic rate. In the earmarked case, rent plus required saving is 104–110% of net income, so the goal is **not feasible on current income** unless income rises, the date moves or the amount falls. If every liquid asset is counted, rent plus saving is 88–97% of income. That leaves 3–12% for all other spending and empties the safety and rent buckets. Moving the return assumption from 0% to 6% changes the required saving by 16.6%. The starting balance and income are the larger levers. This is arithmetic, not a forecast. v0.1 counted only USD 15,000 and did not say so (R05a m3).

**Step 3 — research-coverage list (information only).** Starting universe: about 150 NGX equities, about 130 DFM/ADX equities, several thousand US instruments.
- DFM/ADX equities get **exposure only** in the MVP. Doc 5c licenses no DFM data, and ADX Starter has no price history (5c §4.6). Rule 5 therefore excludes them from valuation, and Doc 5b computes no risk or goal analytics for them (5b §4.1). A UAE holding is valued from its custodian or broker statement (consistency pass, I6).
- After the liquidity and free-float checks (rule 2): about 40 NGX names.
- After the data-quality gate (rule 5): about 25.
- Of these, about 7 are banks. They stay in coverage with the flag "employer sector: the user's 25% sector cap may bind once human-capital exposure is counted". v0.1 excluded them by a house rule ("bank stocks beyond 0%"), which is withdrawn.
- For the USD goal, NGX names are flagged (rule 1b), not excluded. For the rent reserve, nothing outside AED passes rule 1a.

Because the aspirational bucket is unfunded, **no security-level analysis is triggered for this household's portfolio**. The Bank X note in Example 1 is information, not portfolio input. This fixes R05a M6f.

**Step 4 — flagged for confirmation.**
- tax residency (provisional mode; Doc 6 questionnaire);
- whether NGN can be converted and remitted when needed (a constraint, not an assumption);
- actual brokerage access;
- per-goal loss tolerance as a user statement (Doc 3 to decide on elicitation);
- the US estate-tax monitor;
- currency-gain disposals;
- advice sensitivity of every row if this output were offered to someone else.

## 5. Alternatives considered and rejected

| Alternative | Why rejected (for now) |
|---|---|
| Broad coverage from day one (all NGX, DFM, ADX and US names via vendor feeds) | The founder reports that the earlier tracker produced outdated or inaccurate figures (brief §1). Corporate-action coverage varies by feed: Doc 5c lists an NGX API News & Corporate Actions product. Market-rule metadata with effective dates is not offered by any feed we know of (Doc 5c to confirm). Narrow validated coverage first. |
| Factor/quant screens as the primary research method | Historical US evidence is strong but persistence is weaker (F19). No credible local return-predictability test exists, and NGX microstructure (volume thresholds, stale prices) breaks the price inputs that screens rely on. Screens become flags until Doc 5b backtests. |
| Single "fair value" per security | Anchoring risk for an individual user (System B) and false precision; institutional practice is a range with drivers. |
| Macro regime overlay driving allocation | Out-of-sample evidence for macro timing is weak (F21–F22); a single individual has no risk budget for model error. Macro sets constraints and scenarios instead. |
| Letting the language model compute or restate figures from prompts | Exactly the leakage path identified in the repo (brief §1.4). The model narrates figure objects produced by tools. |
| Using the FGN yield alone as the NGN risk-free rate | Embeds sovereign default risk and unobservable inflation expectations; must be reconciled with the USD route (§4.4). |
| A single risk-tolerance score for the whole household | Goals have different loss tolerances and currencies; bucketed tolerances are better supported (F24). |
| Ignoring UAE Shari'a classification | A stated preference is a hard constraint; DFM publishes a list, so it is cheap to respect. |
| Hard-coding market rules in application code | The repo's MPR was wrong when committed; a versioned registry with entry-time primary-source checks (C3.5) is required (§4.5). |
| A cost-of-equity grid set by the analyst | v0.1's 23% column matched no route and anchored on the MPR (R05a B2). The grid is derived mechanically from stored route outputs (§4.4, Q6). |
| A single house default for country risk (rating or CDS) | The choice moves k by about 3 pp on the USD route; a default would hide the largest assumption. Both are scenario axes (§4.4). |
| Using IFRS 9 Stage 3 as the prudential NPL ratio | The CBN thresholds use the prudential definition; the gap is the regulatory risk reserve. Both are stored, never equated (§4.3). |
| House allocation thresholds (issuer, sector, horizon caps) as defaults | Unsourced, and allocation advice if applied to another person (R05a M7). Replaced by user-set parameters with logged reasons (§4.9). |

## 6. Cross-department dependencies

**We need from Doc 5c (Data sources):** official or licensed feeds with provenance metadata for NGX prices and corporate actions, CSCS/registrar dividend data, CBN NFEM and MPC releases, DMO/FMDQ bond data, SEC Nigeria NAV files, DFM/ADX prices, FOL and Shari'a lists, EDGAR; confirmation of the DFM/ADX rulebook values in §4.5 (our values are broker-sourced, E3); NGX index methodology, Banking index weight, corporate-action rules, the ±10% band and periodic-filing deadlines (needed for the filing-calendar freshness rule); the current CMA (formerly SCA) accounting rule for DFM; CBUAE peg documentation (C5.1); primary texts of the CBN September 2023 FX-gains, March 2024 and June 2025 forbearance circulars, the current CBN LDR and net-open-position limits, and the D-SIB list; bank Pillar 3 disclosures (CET1, leverage, prudential NPL) as a data source; merging the freshness table per R05c M8 (§4.10 proposal); a `source_status` attribute for moved sources (S12, S16); a maintained market-rule registry with `checked_on` dates; brokerage/custody access routes from Nigeria and the UAE.

**We need from Doc 5b (Quantitative models):** backtests of F-score, M-score, accruals and Z'' on NGX and DFM/ADX data with microstructure-aware returns (volume-threshold price staleness); the discount-rate reconciliation procedure of §4.4 implemented and tested; liquidity metrics (ADV, free-float-adjusted) for the admissible-universe filter; scenario generation for inflation and FX paths; a review of the repository Monte Carlo engine before it feeds the goal arithmetic.

**We need from Doc 6 (Tax; Doc 6 governs tax facts):** rule records with C7 status for every tax row in §4.5 (dividend WHT, T-bill and short-term-security WHT, FGN bond exemption, gains on Nigerian and foreign shares, foreign currency as a chargeable asset, US NRA withholding, US estate tax); after-tax yield definitions; residency questionnaire outputs for provisional mode; confirmation of whether the 2024 bank windfall levy was enacted and for which years.

**We need from System A (Ledger):** holdings, cost basis, currency positions, cash-flow forecasts and liabilities in the schema of §4.9. **From Doc 3 (Behavioural):** a decision on whether per-goal loss tolerance is elicited by a validated instrument or kept as a user-stated constraint (§4.9); display rules for ranges that limit anchoring; evidence on how users react to stale-figure markers. **From System H (AI):** implementation of C2 (tokens only; no digits from the model). **From Legal/Compliance:** confirmation that research-only language and personal use fall outside SEC Nigeria and UAE CMA advisory licensing; review of the permitted-language list and of every `advice_sensitive` output type before commercialisation (System I).

**What they need from us:** this framework's gates and schema (§4.1, §4.10); the bank-module metric definitions and registry rows (§4.3, §4.5); the quant-check tests Q1–Q9; the note template (§4.11); the permitted-language rules; the list of inputs that must be conclusion-eligible; the cost-of-equity route definitions for Doc 5b to implement.

## 7. Risks, open uncertainties and disagreements

**Open uncertainties (unverified or unknown).** (1) Final outcome of the CBN recapitalisation after 31 March 2026 and the status of banks that fell short. (2) Whether the 2018 NGX pricing groups are exactly as currently applied, and when the postponed 2026 revision takes effect. (3) DFM/ADX rules verified only via broker pages. (4) Current UAE accounting-standard rule for DFM issuers (2016 profile). (5) CBUAE peg statement (page blocked). (6) Tax treatments now come from Doc 6 v0.2 rule records at `reviewed_internal`, not practitioner-confirmed (T-bill WHT finality before the NTAA operative date, deposit interest, foreign-currency disposals, NTAA commencement date). (7) Access routes and custody for US instruments from Nigeria/UAE. (8) Whether local data will ever make mid-cap NGX names conclusion-eligible (C3.4) at acceptable cost. (9) Founder's residency, income structure and goals — all inputs, none known. (10) Whether the CBN Composite Risk Rating can be observed at all; without it a bank's dividend cap is a range. (11) Primary texts of the 2023–2025 CBN distribution circulars and the windfall levy. (12) Whether the NGX ±10% band is a daily limit or a pre-open constraint. (13) Which NGX banks remain under forbearance, and the final recapitalisation outcome by licence category.

**Risks.** Rule drift (three NGX changes in 2026) producing silent errors; FX convertibility risk making NGN valuations irrelevant to AED/USD goals; low free float and volume thresholds making NGX "prices" poor value signals; survivorship and look-ahead bias in any local backtest; regulatory risk if research language drifts into advice; over-reliance on one practitioner's country-risk estimates (now partly mitigated by showing both of that practitioner's bases); distribution caps that depend on an unpublished supervisory rating.

**Disagreements preserved.**

| Topic | Position A | Position B | Proposed resolution |
|---|---|---|---|
| Macro overlay | Strategist: small rules-based tilts are standard practice and capture regime risk | Risk manager: evidence (F21–F22) does not justify tilts for one household | Macro sets constraints and stress scenarios only; revisit after Doc 5b out-of-sample tests |
| NGN cost of equity: route | Equity analyst: USD route with country risk premium, then inflation conversion | Economist: NGN route (Damodaran local-currency method) reflects market-implied local pricing | Compute both; the grid is derived mechanically (§4.4); the gap is shown as the implied inflation expectation |
| Country-risk basis | Equity analyst: rating-based (stable, semi-annual) | Risk manager: CDS-based (market-based; currently about 3 pp lower) | No house default; both are scenario axes; revisited each edition by the Investment Committee role |
| Normalisation tax rate (department vs reviewer) | Reviewer R05a B2: tax-effect FX gains at 30% (normalised ROE 22.6% on v0.1 inputs) | Department: use the tax note's attribution; unrealised revaluation gains may be untaxed and realised gains may bear the windfall levy, so a fixed statutory rate can be wrong in either direction | Q3 requires the tax-note attribution; if the note is silent, show both untaxed and statutory variants (Example 1 shows 20.3% and 17.4%) |
| Showing value numbers to an individual | CIO: ranges with drivers are the honest institutional output | Behavioural lead: any number anchors; show direction and drivers only for retail | MVP shows ranges to the founder; retail display to be tested by System B |
| Quality screens | EM specialist: local accounting and microstructure invalidate US-calibrated screens | Quant: the signals are economically motivated and cheap to compute | Ship as flags with "not locally validated" label; promote only after backtests |
| Home bias | Emerging-markets specialist (E4): local information advantage can justify a home overweight. The founder's own view is **unknown — founder to confirm** (v0.1 attributed a position to them; withdrawn per R05a M6c) | Risk manager: human-capital correlation and convertibility argue for a cap | The user sets the country cap with a logged reason; the system shows human-capital and currency exposure next to it |
| Real vs nominal in Nigeria | Fixed-income analyst: real-return bands under scenarios | Equity analyst: nominal models with inflation in growth | One house inflation path per scenario stored as an input used by both |

## 8. Recommendations, ranked

| Rank | Recommendation | Class |
|---|---|---|
| R1 | Provenance-first figure model on the C3 axes, rendered through C2 tokens, with computed note status (§4.10) | Personal-MVP must-have |
| R2 | Versioned market- and prudential-rule registry with effective and checked dates, C3.5 entry checks and `source_status` (§4.5) | Personal-MVP must-have |
| R3 | Research-note template with invalidation conditions, mechanically derived ranges and quant tests Q1–Q9; permitted-language linter with `advice_sensitive` flags (§4.1, §4.10, §4.11) | Personal-MVP must-have |
| R4 | Circumstances-as-inputs schema and constraint filter on user-set parameters, with provisional mode while residency is unknown (§4.9) | Personal-MVP must-have |
| R5 | NGX bank-analysis module from IFRS filings and Pillar 3 disclosures (§4.3), **gated**: it publishes no note until the CBN capital, buffer, leverage and payout rows are in the registry at C3 eligibility. The FX-gains and forbearance rows may stay `candidate`, but every note must then show the dividend cap as a range | Personal-MVP must-have (gated) |
| R6 | Macro context panel with as-of dates and scenario inputs, no forecasts (§4.8) | Personal-MVP must-have |
| R7 | Quality screens (F/G/M-score, accruals, Z'') as labelled flags after local backtests | Later |
| R8 | Valuation engine with dual-currency reconciliation (§4.4) | Later |
| R9 | Fixed-income analytics with DMO/FMDQ data and real-return bands (§4.6) | Later |
| R10 | Fund analytics (SEC NAV, ETF premium/discount) and UAE Shari'a classification (§4.7) | Later |
| R11 | Automated ratings, target prices, expected-return forecasts, macro-timing overlays, auto-rebalancing, news/sentiment signals, model-generated figures | Do-not-build (yet) |

**Five-question test for the top items.**

*R1 Provenance-first figure model.* (1) Problem: the founder reports that their earlier tracker produced outdated or inaccurate figures. (2) Who: the founder first; later every user who must trust a number. (3) Evidence: BCBS 239 principles (F27); the repo's stale-constant pattern (brief §1). (4) Build/validate: schema plus automated freshness tests; validate by replaying 2026 events (hours change, T+1, MPR cuts) and checking that stale markers appear. (5) Metric: share of displayed figures that are conclusion-eligible; zero figures displayed without as-of date; zero hand-typed note statuses; stale-figure incidents found by users.

*R2 Market-rule registry.* (1) Problem: three NGX rule changes in 2026 (F2–F4). (2) Who: valuation and liquidity logic. (3) Evidence: F2–F6, F9. (4) Build/validate: table with `checked_on`; quarterly verification task; test that no code constant duplicates a registry value. (5) Metric: days between a rule change and registry update; count of unconfirmed rules.

*R3 Research-note template with invalidation.* (1) Problem: conclusions without conditions cannot be audited or retired. (2) Who: the analyst role and the reader. (3) Evidence: CFA Standards V(A)–V(C), Research Objectivity disclosures (F27). (4) Build/validate: template plus linter; validate by checking that every note's invalidation fields map to monitored data. (5) Metric: share of notes with all conditions monitored; time from trigger to note status change.

*R4 Circumstances-as-inputs filter.* (1) Problem: research on securities that cannot meet the user's own stated constraints wastes effort and invites currency mismatch. (2) Who: the household with NGN/AED/USD obligations. (3) Evidence: F24–F26 (liability hedging, human capital, home bias). (4) Build/validate: schema, rules, synthetic household tests (Example 3). (5) Metric: unflagged currency mismatch against near liabilities (target zero); constraint breaches surfaced; every exclusion carries a reason; zero house defaults in shipped configuration.

*R5 Bank module.* (1) Problem: banks are a large, heavily researched NGX sector (weight to be sourced), generic screens fail for them, and CBN rules cap their distributions. (2) Who: any NGX equity research. (3) Evidence: F11–F13 (CBN guideline read in primary text, E2; circulars E3); IFRS 9 disclosures. (4) Build/validate: metric definitions with note references; registry rows; reconcile two banks' published ratios to recomputed values; test the Appendix 2 matrix against the CBN table cell by cell. (5) Metric: reconciliation error under 1 pp on CET1, CAR, leverage, Stage 3 and NIM; payout-cap matrix tests 100% passing; zero notes comparing Stage 3 with the prudential NPL threshold.

## 9. Required validation before implementation

1. Confirm NGX current rules from the rulebook: price band, pricing groups and status of the 2026 revision, circuit-breaker times after the hours change, corporate-action timetable (closure of register, ex-date markdown).
2. Confirm DFM and ADX trading rules, FOL mechanics and Shari'a Standard 1 thresholds from official documents; confirm the accounting rule of the CMA (successor to the SCA from 1 January 2026).
3. Confirm the CBN recapitalisation outcome and current list of licence categories and D-SIBs per bank. Read the primary texts of the September 2023 FX-gains, March 2024 and 13 June 2025 forbearance circulars, and confirm which banks are under forbearance. Confirm whether a countercyclical buffer (CCB2) is currently set. Confirm whether the Composite Risk Rating is ever disclosed.
4. Confirm CBUAE peg documentation and UAE retail access to T-Sukuk/T-Bonds.
5. Doc 6 to deliver rule records (C7) for every tax row in §4.5. Doc 6 to confirm whether the 2024 bank windfall levy was enacted, at what rate and for which years.
6. Doc 5b to backtest the quality screens and the discount-rate reconciliation on local data; to review the repository Monte Carlo engine.
7. Doc 5c to prove conclusion-eligibility (C3.4) is achievable for an initial universe (NGX banks and ten large caps; FGN securities; five UAE names; a US ETF set) and to measure feed latency against the freshness table.
8. Legal review of permitted language and of the boundary between research and advice in Nigeria and the UAE.
9. Behavioural review (System B) of how ranges and stale markers are displayed.
10. Re-run academic verification with the reference-lookup tool when it responds; v0.2 checks are Crossref-only. Find the specific Hou–Xue–Zhang F-score result before restoring any "replicated" claim.
11. Doc 5c to merge the freshness table (R05c M8) and to source NGX periodic-filing deadlines for the filing-calendar rule (§4.10).
12. Re-locate the moved PenCom (S12) and DMO (S16) documents.
13. Run the Q1–Q9 tests against the v0.1 and v0.2 Example 1 inputs as regression cases (v0.1 must fail Q1, Q3, Q4(b), Q4(c) and Q6).

## 10. Sources

All web sources accessed 2026-11-02 and re-checked 2026-11-04 unless noted. "v0.2" marks a source re-read by this department during the revision on 2026-11-04; "per R05a" marks a status taken from the reviewer's re-fetch on the same date. "Fetched" means the page or file was read in full or in part in this session; "search summary" means only a search-engine excerpt was seen.

### Official and primary sources

- **S1** Nigerian Exchange Limited, "Trading Market Structure" (equities session table, market hours 9.00–4.00, +/-10% limit), https://ngxgroup.com/exchange/trade/equities/trading-market-structure — fetched.
- **S2** NGX Group, "NGX Expands Trading Window From 9:00 A.M. To 4:00 P.M.", press release dated 17 April 2026 (published 20 April 2026), https://ngxgroup.com/ngx-expands-trading-window-from-900-a-m-to-400-p-m/ — fetched.
- **S3** The Nigerian Stock Exchange, "Amendments to Rule 15.29: Pricing Methodology — Interpretative Guidance" (NSE/LARD/RID/IG3/PMR1/12/17; effective 29 January 2018), https://doclib.ngxgroup.com/regulation-site/Documents/guidance/Interpretative%20Guidance%20-%20Amendments%20to%20the%20Pricing%20Methodology%20Rule.pdf — downloaded and read.
- **S4** The Nigerian Stock Exchange, "Amendments to the Pricing Methodology Rule — Frequently Asked Questions", https://doclib.ngxgroup.com/investors-site/becoming-an-investor/FAQs/Amendments%20to%20the%20Pricing%20Methodology%20Rule%20-%20Frequently%20Asked%20Questions.pdf — downloaded and read.
- **S5** The Nigerian Stock Exchange, "Rules Governing Free Float Requirements for Issuers Listed on The Nigerian Stock Exchange" (SEC approval 6 May 2019), https://doclib.ngxgroup.com/regulation-site/IssuersRules/Rules%20Governing%20Free%20Float%20Requirements.pdf — downloaded and read.
- **S6** The Nigerian Stock Exchange, "Rule 15.46: Trading Halts Due to Extraordinary Market Volatility (Index Circuit Breakers)" (effective 5 February 2016), https://doclib.ngxgroup.com/regulation-site/Dealing%20Members%20Rules/Trading%20Halts%20Due%20to%20Extraordinary%20Market%20Volatility%20(Index%20Circuit%20Breakers%20Rule).pdf — downloaded and read.
- **S7** Nigerian Exchange Limited, "Domestic & Foreign Portfolio Investment Report, September 2026", https://doclib.ngxgroup.com/market_data-site/other-market-information-site/FPI%20Report/NGX%20Domestic%20and%20Foreign%20Portfolio%20Investment%20Report%20For%20September%202026.pdf — downloaded and read.
- **S8** NGX Group, "Indices" page (21 indices listed), https://ngxgroup.com/exchange/data/indices/ — fetched (methodology documents not retrieved).
- **S9** Central Securities Clearing System Plc, "Nigeria Transitions to T+1 Settlement Cycle" (effective 1 June 2026; T+2 go-live news item dated 28 November 2025), https://www.cscs.ng/ngt1/ — fetched.
- **S10** Central Bank of Nigeria, "Key Decisions of the Monetary Policy Committee" (307th meeting, 21–22 September 2026; earlier 2026 meetings), https://www.cbn.gov.ng/MonetaryPolicy/Decisions.html — fetched; **v0.2 re-fetched 2026-11-04**: MPR history 2025–2026, corridor, CRR 45/16/75% (non-TSA), liquidity ratio last stated 30% (303rd MPC).
- **S11** Central Bank of Nigeria, "Exchange Rates — NFEM rate" (volume-weighted average as official rate), https://www.cbn.gov.ng/rates/ExchRateByCurrency.html — fetched (table headers; values load separately).
- **S12** National Pension Commission, "Addendum to the Revised Regulations on Investment of Pension Fund Assets", ref. PenCom/INSP/Surv/2026/187, 9 February 2026, https://www.pencom.gov.ng/wp-content/uploads/2026/03/ADDENDUM-TO-THE-REVISED-REGULATIONS-ON-INVESTMENT-OF-PENSION-FUND-ASSETS.pdf — downloaded and read 2026-11-02; **returned 404 on 2026-11-04 (per R05a): `source_status = moved`.**
- **S13** National Bureau of Statistics, "Highlights of Consumer Price Index (CPI) Rebasing", February 2025, https://microdata.nigerianstat.gov.ng/index.php/catalog/154/download/1156/Highlights%20of%20CPI%20Rebasing%20Result.pdf — downloaded and read.
- **S14** IFRS Foundation, "IFRS Accounting Standards jurisdiction profile: Nigeria" (last updated 16 June 2016), https://www.ifrs.org/use-around-the-world/use-of-ifrs-standards-by-jurisdiction/view-jurisdiction/nigeria/ and PDF profile — fetched and downloaded.
- **S15** IFRS Foundation, "IFRS Accounting Standards jurisdiction profile: United Arab Emirates" (last updated 16 June 2016), https://www.ifrs.org/use-around-the-world/use-of-ifrs-standards-by-jurisdiction/view-jurisdiction/united-arab-emirates/ and PDF profile — fetched and downloaded.
- **S16** Debt Management Office Nigeria, "FGN Bonds" (instruments, monthly auctions, minimum subscription, trading venues, tax statements), https://www.dmo.gov.ng/fgn-bonds — fetched 2026-11-02; **returned 404 on 2026-11-04 (per R05a): `source_status = moved`.** Its tax statement is no longer relied on (Doc 6 governs).
- **S17** FMDQ Exchange, market data page (fixed-income closing rates, futures, NAFEX, NIBOR, NITTY, S&P/FMDQ Nigeria Sovereign Bond Index; data dated 29–30 October 2026), https://fmdqgroup.com/exchange/ — fetched.
- **S18** Securities and Exchange Commission Nigeria, "Monthly Net Asset Value for Collective Investment Schemes", https://sec.gov.ng/for-operators/keep-track-of-capital-market-data/net-asset-value-data/monthly-net-asset-value-for-collective-investment-schemes/ — fetched.
- **S19** U.S. Securities and Exchange Commission, "EDGAR Application Programming Interfaces" (submissions, companyfacts, companyconcept, frames), https://www.sec.gov/search-filings/edgar-application-programming-interfaces — fetched.
- **S20** Basel Committee on Banking Supervision, "Principles for effective risk data aggregation and risk reporting" (BCBS 239), 9 January 2013, https://www.bis.org/publ/bcbs239.htm — page fetched (PDF download blocked; principle names from the standard as known, E3).
- **S21** UAE Ministry of Finance, "T-Bonds Issuance Programme" (2026 institutional and retail T-Sukuk calendars), https://mof.gov.ae/fdmo-tbonds-issuance-program — fetched.
- **S22** Dubai Financial Market, "Shari'a Compliance" (Standards 1–3; classification list) and DFM home page (indices DFMGI, DFMSI, UAEESGI), https://www.dfm.ae/the-exchange/regulation/sharia-compliance and https://www.dfm.ae/ — fetched (trading-hours and calendar pages did not load).
- **S23** CFA Institute, "Code of Ethics and Standards of Professional Conduct" (effective 1 January 2024; Standards of Practice Handbook, 12th ed. 2024), https://www.cfainstitute.org/standards/professionals/code-ethics-standards — fetched.
- **S24** CFA Institute Research and Policy Center, "Analyst Research Process" issue brief, 26 April 2018, https://rpc.cfainstitute.org/policy/positions/analyst-research-process — fetched.
- **S25** Damodaran, A., "Country Default Spreads and Risk Premiums" (updated 5 January 2026), https://pages.stern.nyu.edu/adamodar/New_Home_Page/datafile/ctryprem.html — fetched.
- **S26** Damodaran, A., "Country Risk: Drivers, Measures and Investment Implications — The 2026 Edition!", blog post, 15 July 2026, https://aswathdamodaran.blogspot.com/2026/07/country-risk-drivers-measures-and.html — fetched.
- **S27** Damodaran, A., "ctrypremJuly26.xlsx" (date of update 1 July 2026; default spreads corrected 9 July 2026), https://pages.stern.nyu.edu/~adamodar/pc/datasets/ctrypremJuly26.xlsx — downloaded and parsed; **v0.2 re-downloaded and parsed with the standard library 2026-11-04**: sheet "ERPs by country" row Nigeria (rating spread 5.1748%, CRP 8.0442%, ERP 12.2442%; CDS net of Swiss 3.26%, CRP 5.0677%, ERP 9.2677%), mature ERP 4.20%, multiplier 1.5544955, US Aa1 spread 0.2186%; CDS dated 30 June 2026.
- **S28** MSCI Inc., "Conclusions of the Consultation on the Potential Market Reclassification for the MSCI Nigeria Indexes", press release, 28 September 2016, https://www.msci.com/documents/10199/e927eee0-d481-45b9-8a7c-6b216e584eb5 — downloaded and read.
- **S29** S&P Dow Jones Indices, Shariah indices methodology announcement (4 August 2023) and practice essentials on Shariah-compliant indexing, https://spglobal.com/spdji/en/documents/indexnews/announcements/20230804-1465479/1465479_spshariahindices-8-4-2023.pdf — search summary only.
- **S52** Central Bank of Nigeria, "Guidelines on Regulatory Capital", September 2021 (minimum CAR 15% for international authorisation and D-SIBs; 10% others), https://www.cbn.gov.ng/Out/2021/BSD/1.%20GUIDELINES%20ON%20REGULATORY%20CAPITAL.pdf — **v0.2 re-downloaded 2026-11-04 and read** (28 pp.): Tables 1–2, ¶24 and footnote 4 (RRR), ¶28–31, ¶80–83 (CCB), ¶94 (HLA), ¶97–104 (distributions, bonuses, leverage 4%/5%), Appendix 2 (payout matrix; maximum distributable profit).

### Secondary sources (broker and press)

- **S30** EFG Hermes, "Market Information — Dubai Financial Market", https://tg.efghermes.com/Market/GetById/1904 — fetched.
- **S31** EFG Hermes, "Market Information — Abu Dhabi Securities Exchange", https://tg.efghermes.com/Market/GetById/1872 — fetched.
- **S32** Arise News, "CBN raises capital requirements for banks, sets N500bn threshold for international authorisation", 29 March 2024, https://arise.tv/cbn-raises-capital-requirements-for-banks-sets-n500bn-threshold-for-international-authorisation — fetched.
- **S33** Arise News, "CBN: 30 banks have met new minimum capital thresholds", 7 March 2026, https://www.arise.tv/cbn-30-banks-have-met-new-minimum-capital-thresholds/ — fetched.
- **S34** Gazette Nigeria, report on recapitalisation progress (33 banks raised capital, 20 met thresholds), 24 February 2026, https://gazettengr.com/?p=449682 — fetched.
- **S35** Nairametrics, "NGX postpones new pricing rules days after confirming Monday take-off", 16 August 2026, https://nairametrics.com/2026/08/16/ngx-postpones-new-pricing-rules-days-after-confirming-monday-take-off/ — fetched.
- **S36** Nairametrics, "NGX changes how stock prices move: how it affects your returns", 20 June 2026, https://nairametrics.com/2026/06/20/ngx-changes-how-stock-prices-move-how-it-affects-your-returns/ — fetched.
- **S37** BusinessDay, "NGX pivots back to 2018 market microstructure rules for stock price movement", 18 June 2026, https://businessday.ng/markets/article/ngx-pivots-back-to-2018-market-microstructure-rules-for-stock-price-movement/ — fetched.
- **S38** Nairametrics (op-ed, D. Akintola), "The price band problem: why NGX's ±10% cap needs a proper farewell", 30 May 2026 — fetched; opinion, used only for the description of current practice.
- **S39** Nairametrics, "Nigeria's mutual fund assets near N10 trillion as money market funds dominate", 20 October 2026 (citing SEC NAV report of 9 October 2026), https://nairametrics.com/2026/10/20/nigerias-mutual-fund-assets-near-n10-trillion-as-money-market-funds-dominate/ — fetched.
- **S40** Business Post Nigeria, report on FTSE Russell returning Nigeria to Frontier status effective 21 September 2026 and MSCI status, 20 October 2026, https://businesspost.ng/?p=215905 — fetched.
- **S41** Legal500/Mondaq (Nigerian law-firm article), "Understanding Personal Income Tax under the Nigerian Tax Act 2025", 5 January 2026, https://www.legal500.com/intelligence/nigeria/tax/understanding-personal-income-tax-under-the-nigerian-tax-act-2025 — fetched.
- **S43** Nairametrics, "CSCS launches T+1 settlement cycle as Nigeria joins global market leaders", 1 June 2026, and "SEC sets 5 p.m. T+1 deadline for equities, commodities settlement", 13 August 2026 — search summaries only.
- **S45** The Guardian Nigeria / ICIR, "CBN says all valid FX backlog cleared" (March 2024; about $7bn claims, $2.4bn invalid), https://guardian.ng/news/cbn-says-all-valid-fx-backlog-cleared/ — search summary only.
- **S46** ThisDay, "After FTSE Russell downgrade, MSCI moves to reclassify Nigerian stock market", 28 October 2023, and Stears/Nairametrics coverage of MSCI's Standalone reclassification effective February 2024 — search summaries only. The February 2024 date is not in S40 (per R05a): unconfirmed.
- **S47** Bamboo (learn.investbamboo.com), guide to dividend withholding tax (10%, final for individuals) under the 2025 Act — search summary only. **No longer relied on in v0.2; Doc 6 F12 governs.**
- **S48** ICIR, "Nigeria inflation drops to 24.48% in January following rebasing" (February 2025); BusinessDay and AllAfrica (January 2026) on the CPI reference-period revision — search summaries only.
- **S49** Aletihad / Zawya, "ADX supports market efficiency and liquidity with removal of price limits on ETFs and futures" (effective 3 August 2026) — search summary only.
- **S50** Arabian Business / Gulf News, reports on the UAE fractional and retail T-Sukuk initiatives (from AED 4,000), 2025–2026 — search summaries only.
- **S53** Nairametrics / Mondaq, reports on the CBN 2018 circular restricting dividend payments by NPL ratio and CAR — search summaries only. **Superseded in v0.2 by the primary Appendix 2 of S52.**
- **S54** King & Spalding, "A New Era for UAE Federal Securities Regulation: The 2025 CMA Decree-Laws", February 2026, https://www.kslaw.com/insights/articles/a-new-era-for-uae-federal-securities-regulation-the-2025-cma-decree-laws-february-2026 — fetched 2026-11-04 (v0.2). Law-firm note (E3): Decree-Laws 32 and 33/2025; CMA legal successor to SCA from 1 January 2026; "financial advisory" a regulated activity; SCA resolutions survive until replaced; one-year regularisation. Also Doc 6 S39.
- **S55** Stren & Blan Partners, "FIRS Imposes 10% Withholding Tax on Interest from Short-Term Instruments", Legal 500, 10 December 2025, https://www.legal500.com/intelligence/nigeria/tax/firs-imposes-10-withholding-tax-on-interest-from-short-term-instruments — fetched 2026-11-04 (v0.2). Effective 28 October 2025; T-bills, commercial paper, corporate bonds, promissory notes and bills of exchange covered; FGN bonds and OMO bills exempt; silent on finality. Also Doc 6 S10.
- **S56** Nairametrics, "New CBN circular stops banks from spending gains made from forex revaluation", 11 September 2023, https://nairametrics.com/2023/09/11/new-cbn-circular-stops-banks-from-spending-gains-made-from-forex-revaluation/ — fetched 2026-11-04 (v0.2). Press report quoting the circular ("shall not utilize such FX revaluation gains to pay dividend or meet operating expenses"); circular reference not given; circular text not read (E3).
- **S57** Nairametrics, "CBN suspends dividends, bonuses and foreign investments for banks under regulatory forbearance", 14 June 2025, https://nairametrics.com/2025/06/14/cbn-suspends-dividends-bonuses-and-foreign-investments-for-banks-under-regulatory-forbearance/ — fetched 2026-11-04 (v0.2). Applies to banks under credit or SOL forbearance; lasts until forbearance is fully exited and capital and provisioning are independently verified. The reference BSD/DIR/CON/LAB/018/008 and the 13 June 2025 date come from search-result summaries of other press reports (TheCable and others) and were not seen in the fetched page (E3). The v0.1 review cited a different Nairametrics URL that now returns 404.
- **S58** Nairametrics, "Senate passes Finance Act amendment bill, increases banks' windfall levy to 70%", 24 July 2024, https://nairametrics.com/2024/07/24/senate-passes-finance-act-amendment-bill-increases-banks-windfall-levy-to-70 and TheCable, "FG increases windfall tax on banks to 70% in amended Finance Act" — search summaries only, 2026-11-04 (v0.2). Presidential assent and final terms **not verified** (E3, unconfirmed).
- **S59** Portfolio OS internal documents: Doc 6 v0.1 and v0.2 (2026-11-04; F12, F13, F28, F30, F31, F35, F36; §4.2 rule records and statuses); review R06 (2026-11-04; section pinpoints s.162, s.201; NTAA commencement dispute); CANONICAL_CONTRACTS C2, C3, C5, C6, C7; review R05a (2026-11-04); review R05c M8. Read 2026-11-04.

### Academic references

v0.1 checked these against OpenAlex by DOI with the hosted reference-lookup tool. In v0.2 both the local and the hosted reference-lookup tools timed out on every call (2026-11-04). References changed or added in v0.2 were therefore checked by DOI against the Crossref REST API (`api.crossref.org/works/<doi>`) and are marked **[verified, Crossref 2026-11-04]**. This matches the reviewer's method (R05a §4). Re-run with the lookup tool when it responds (§9 item 10).

- **S60** Sloan, R. G. (1996). Do stock prices fully reflect information in accruals and cash flows about future earnings? *The Accounting Review*, 71(3), 289–315. doi:10.2308/tar-9608042309 **[verified, Crossref 2026-11-04]**
- **S61** Dechow, P., Ge, W., & Schrand, C. (2010). Understanding earnings quality. *Journal of Accounting and Economics*, 50(2–3), 344–401. doi:10.1016/j.jacceco.2010.09.001 **[verified]**
- **S62** Piotroski, J. D. (2000). Value investing: The use of historical financial statement information to separate winners from losers. *Journal of Accounting Research*, 38 (Suppl.), 1–41. doi:10.2307/2672906 **[verified]**
- **S63** Mohanram, P. S. (2005). Separating winners from losers among low book-to-market stocks using financial statement analysis. *Review of Accounting Studies*, 10(2–3), 133–170. doi:10.1007/s11142-005-1526-4 **[verified; issue confirmed via Crossref 2026-11-04]**
- **S64** Beneish, M. D. (1999). The detection of earnings manipulation. *Financial Analysts Journal*, 55(5), 24–36. doi:10.2469/faj.v55.n5.2296 **[verified]**
- **S65** Beneish, M. D., Lee, C. M. C., & Nichols, D. C. (2013). Earnings manipulation and expected returns. *Financial Analysts Journal*, 69(2), 57–82. doi:10.2469/faj.v69.n2.1 **[verified]**
- **S66** Hou, K., Xue, C., & Zhang, L. (2020). Replicating anomalies. *Review of Financial Studies*, 33(5), 2019–2133. doi:10.1093/rfs/hhy131 (published online 2018) **[verified, Crossref 2026-11-04]**. The specific F-score result was not confirmed and is not relied on.
- **S67** McLean, R. D., & Pontiff, J. (2016). Does academic research destroy stock return predictability? *Journal of Finance*, 71(1), 5–32. doi:10.1111/jofi.12365 **[verified]**
- **S68** Harvey, C. R., Liu, Y., & Zhu, H. (2016). … and the cross-section of expected returns. *Review of Financial Studies*, 29(1), 5–68. doi:10.1093/rfs/hhv059 **[verified]**
- **S69** Altman, E. I. (1968). Financial ratios, discriminant analysis and the prediction of corporate bankruptcy. *Journal of Finance*, 23(4), 589–609. doi:10.1111/j.1540-6261.1968.tb00843.x **[verified]**
- **S70** Altman, E. I. (2005). An emerging market credit scoring system for corporate bonds. *Emerging Markets Review*, 6(4), 311–323. doi:10.1016/j.ememar.2005.09.007 **[verified]**
- **S71** Ohlson, J. A. (1980). Financial ratios and the probabilistic prediction of bankruptcy. *Journal of Accounting Research*, 18(1), 109–131. doi:10.2307/2490395 **[verified]**
- **S72** Welch, I., & Goyal, A. (2008). A comprehensive look at the empirical performance of equity premium prediction. *Review of Financial Studies*, 21(4), 1455–1508. doi:10.1093/rfs/hhm014 **[verified]**
- **S73** Campbell, J. Y., & Thompson, S. B. (2008). Predicting excess stock returns out of sample: Can anything beat the historical average? *Review of Financial Studies*, 21(4), 1509–1531. doi:10.1093/rfs/hhm055 **[verified]**
- **S74** Cochrane, J. H. (2008). The dog that did not bark: A defense of return predictability. *Review of Financial Studies*, 21(4), 1533–1575. doi:10.1093/rfs/hhm046 **[verified]**
- **S75** Rapach, D. E., Strauss, J. K., & Zhou, G. (2010). Out-of-sample equity premium prediction: Combination forecasts and links to the real economy. *Review of Financial Studies*, 23(2), 821–862. doi:10.1093/rfs/hhp063 **[verified]**
- **S76** Goyal, A., Welch, I., & Zafirov, A. (2024). A comprehensive 2022 look at the empirical performance of equity premium prediction. *Review of Financial Studies*, 37(11), 3490–3557. doi:10.1093/rfs/hhae044 **[verified]**
- **S77** Campbell, J. Y., & Shiller, R. J. (1988). Stock prices, earnings, and expected dividends. *Journal of Finance*, 43(3), 661–676. doi:10.1111/j.1540-6261.1988.tb04598.x **[verified]**
- **S78** Campbell, J. Y., & Shiller, R. J. (1998). Valuation ratios and the long-run stock market outlook. *Journal of Portfolio Management*, 24(2), 11–26. doi:10.3905/jpm.24.2.11 **[verified]**
- **S79** Siegel, J. J. (2016). The Shiller CAPE ratio: A new look. *Financial Analysts Journal*, 72(3), 41–50. doi:10.2469/faj.v72.n3.1 **[verified]**
- **S80** Ang, A., & Bekaert, G. (2002). International asset allocation with regime shifts. *Review of Financial Studies*, 15(4), 1137–1187. doi:10.1093/rfs/15.4.1137 **[verified]**
- **S81** Ang, A., & Timmermann, A. (2012). Regime changes and financial markets. *Annual Review of Financial Economics*, 4, 313–337. doi:10.1146/annurev-financial-110311-101808 **[verified]**
- **S82** Erb, C. B., Harvey, C. R., & Viskanta, T. E. (1996). Expected returns and volatility in 135 countries. *Journal of Portfolio Management*, 22(3), 46–58. doi:10.3905/jpm.1996.409554 **[verified]**
- **S83** Bekaert, G., & Harvey, C. R. (1995). Time-varying world market integration. *Journal of Finance*, 50(2), 403–444. doi:10.1111/j.1540-6261.1995.tb04790.x **[verified, Crossref 2026-11-04]**
- **S84** Chhabra, A. B. (2005). Beyond Markowitz: A comprehensive wealth allocation framework for individual investors. *Journal of Wealth Management*, 7(4), 8–34. doi:10.3905/jwm.2005.470606 **[verified, Crossref 2026-11-04: title, author, 7(4) 8–34]**
- **S85** Nevins, D. (2004). Goals-based investing: Integrating traditional and behavioral finance. *Journal of Wealth Management*, 6(4), 8–23. doi:10.3905/jwm.2004.391053 **[verified, Crossref 2026-11-04: title, author, 6(4) 8–23]**
- **S86** Shefrin, H., & Statman, M. (2000). Behavioral portfolio theory. *Journal of Financial and Quantitative Analysis*, 35(2), 127–151. doi:10.2307/2676187 **[verified]**
- **S87** Das, S., Markowitz, H., Scheid, J., & Statman, M. (2010). Portfolio optimization with mental accounts. *Journal of Financial and Quantitative Analysis*, 45(2), 311–334. doi:10.1017/S0022109010000141 **[verified]**
- **S88** Sharpe, W. F., & Tint, L. G. (1990). Liabilities — a new approach. *Journal of Portfolio Management*, 16(2), 5–10. doi:10.3905/jpm.1990.409248 **[verified]**
- **S89** Markowitz, H. (1952). Portfolio selection. *Journal of Finance*, 7(1), 77–91. doi:10.1111/j.1540-6261.1952.tb01525.x **[verified]**
- **S90** Bodie, Z., Merton, R. C., & Samuelson, W. F. (1992). Labor supply flexibility and portfolio choice in a life cycle model. *Journal of Economic Dynamics and Control*, 16(3–4), 427–449. doi:10.1016/0165-1889(92)90044-F **[verified]**
- **S91** Viceira, L. M. (2001). Optimal portfolio choice for long-horizon investors with nontradable labor income. *Journal of Finance*, 56(2), 433–470. doi:10.1111/0022-1082.00333 **[verified]**
- **S92** Cocco, J. F., Gomes, F. J., & Maenhout, P. J. (2005). Consumption and portfolio choice over the life cycle. *Review of Financial Studies*, 18(2), 491–533. doi:10.1093/rfs/hhi017 **[verified]**
- **S93** French, K. R., & Poterba, J. M. (1991). Investor diversification and international equity markets. *American Economic Review*, 81(2), 222–226. **[partially verified per R05a: NBER Working Paper w3609 (doi:10.3386/w3609) matches title and authors; the *AER* P&P version is not indexed in Crossref; our own Crossref call for w3609 failed in v0.2]**. Claim F26 rests on it only jointly with S94–S95.
- **S94** Coval, J. D., & Moskowitz, T. J. (1999). Home bias at home: Local equity preference in domestic portfolios. *Journal of Finance*, 54(6), 2045–2073. doi:10.1111/0022-1082.00181 **[verified]**
- **S95** Cooper, I., & Kaplanis, E. (1994). Home bias in equity portfolios, inflation hedging, and international capital market equilibrium. *Review of Financial Studies*, 7(1), 45–60. doi:10.1093/rfs/7.1.45 **[verified]**
- **S96** Bessembinder, H. (2018). Do stocks outperform Treasury bills? *Journal of Financial Economics*, 129(3), 440–457. doi:10.1016/j.jfineco.2018.06.004 **[verified]**
- **S97** Statman, M. (1987). How many stocks make a diversified portfolio? *Journal of Financial and Quantitative Analysis*, 22(3), 353–363. doi:10.2307/2330969 **[verified]**
- **S98** Statman, M. (2004). The diversification puzzle. *Financial Analysts Journal*, 60(4), 44–53. doi:10.2469/faj.v60.n4.2636 **[verified]**
- **S99** Gordon, M. J., & Shapiro, E. (1956). Capital equipment analysis: The required rate of profit. *Management Science*, 3(1), 102–110. doi:10.1287/mnsc.3.1.102 **[verified]**
- **S100** Fama, E. F., & French, K. R. (1988). Dividend yields and expected stock returns. *Journal of Financial Economics*, 22(1), 3–25. doi:10.1016/0304-405X(88)90020-7 **[verified]**
- **S101** Novy-Marx, R. (2013). The other side of value: The gross profitability premium. *Journal of Financial Economics*, 108(1), 1–28. doi:10.1016/j.jfineco.2013.01.003 **[verified by DOI and title; OpenAlex author field did not match]**
- **S102** Asness, C. S., Frazzini, A., & Pedersen, L. H. (2019). Quality minus junk. *Review of Accounting Studies*, 24, 34–112. doi:10.1007/s11142-018-9470-2 **[verified]**
- **S103** Green, J., Hand, J. R. M., & Soliman, M. T. (2011). Going, going, gone? The apparent demise of the accruals anomaly. *Management Science*, 57(5), 797–816. doi:10.1287/mnsc.1110.1320 **[verified, Crossref 2026-11-04]**
- **S104** Pincus, M., Rajgopal, S., & Venkatachalam, M. (2007). The accrual anomaly: International evidence. *The Accounting Review*, 82(1), 169–203. doi:10.2308/accr.2007.82.1.169 **[verified, Crossref 2026-11-04]**
- **S105** Nwosu, R. O. (2026). Financial shenanigans in listed manufacturing firms in Nigeria: Fraud diamond indicators and Beneish-flagged earnings manipulation. *Asian Journal of Economics, Finance and Management*, 8(1), 1109–1130. doi:10.56557/ajefm/2026/v8i1421 **[verified, Crossref 2026-11-04]**. Low-tier venue; cited only for the existence of a descriptive application.
- **S106** Oyamienlen, G. (2023). Predicting financial stability of banks in Nigeria using the Altman Z score model. *Journal of Economics, Finance and Management Studies*, 6(6). doi:10.47191/jefms/v6-i6-06 **[verified, Crossref 2026-11-04; Crossref lists one personal author and an institutional author line]**. Low-tier venue; cited as an example of the misuse this design forbids.
- **S107** Altman, E. I., Hartzell, J., & Peck, M. (1995). *Emerging Markets Corporate Bonds: A Scoring System*. Salomon Brothers; reprinted as a chapter in *Emerging Market Capital Flows* (1998), Springer, NYU Salomon Center Series. doi:10.1007/978-1-4615-6197-2_25 **[verified, Crossref 2026-11-04 (1998 chapter); the 1995 Salomon Brothers report is not indexed]**

*Not cited as evidence because they could not be checked in this session:* Brunel, J. L. P. (2015), *Goals-Based Wealth Management* (Wiley) and Merton, R. C. (2014), "The crisis in retirement planning", *Harvard Business Review* — both are relevant practitioner references for §4.9 and should be verified before being relied upon.

## 11. Revision history and response to review

**v0.1** 2026-11-02 (sources re-checked 2026-11-04). **v0.2** 2026-11-04: revised after independent review R05a. The revision applies revision-log rows V-013, V-014 and V-022 and CANONICAL_CONTRACTS C2, C3, C5, C6 and C7. Every number in §4.4 and §4.11 is reproduced by `research/scripts/doc05a_worked_examples.py`.

| Finding (R05a numbering) | Revision-log ID | Action | Where | Note |
|---|---|---|---|---|
| B1 Example 1 fails its own freshness and validation gates; mixed periods; "post-recapitalisation" vs share count; qualifying-capital threshold from press | V-014 | Fixed | §4.10 (computed status, Q1, Q2), §4.11 Ex. 1 | Rebuilt on TTM to 2026-09-30. Rights issue placed before the TTM window. Qualifying-capital line is `candidate` and excluded from conclusions. Under Doc 5c v0.2 thresholds both v0.1 inputs are also "stale", so B1 stands in full (corrected in the consistency pass, V-031) |
| B2 FX gains "27.5% of PBT" were a share of PAT; invalidation (5) inherits the confusion | V-014 | Fixed | §4.3 earnings mix, Ex. 1 | 25.0% of PBT pre-tax/pre-tax; after-tax share of PAT shown separately; trigger (5) is pre-tax over pre-tax |
| B2 normalised ROE nets a pre-tax gain off post-tax profit | V-014 | Fixed (method differs from reviewer's) | §4.3 rule 1, Q3, Ex. 1, §7 | The tax-note attribution is used, not a fixed 30%. Untaxed variant shown (20.3% / 17.4%). Disagreement recorded in §7 |
| B2 growth inconsistent with payout across P/B and DDM rows | V-014 | Fixed | Q4(a)–(c), Ex. 1 | Implied payouts shown per cell; disclosure line; DDM cells flagged where g exceeds sustainable growth at normalised ROE |
| B2 23% cost-of-equity column matches no route | V-014 | Fixed | §4.4 grid rule, Q6 | Grid derived mechanically: 24.0 / 27.3 / 30.6 / 34.1% |
| B2 g = 12% nominal is zero-to-negative real growth, unstated | V-014 | Fixed | Ex. 1 | g = (1 + g_real)(1 + π) − 1 per column, g_real = 0 stated; nominal-ROE limitation stated |
| B2 "no regulatory payout cap"; FX-gains reserve; forbearance suspension; windfall levy missing | V-014 | Fixed; windfall levy deferred | F12, §4.3, §4.5, Ex. 1 | Appendix 2 matrix read in primary text. Cap shown across risk-rating values. Levy enactment and years deferred to **Doc 6** |
| M1 NGN route is not Damodaran's formula | V-014 | Fixed | §4.4, F23 | rf_NGN = FGN yield − default spread; 25.07% (rating) |
| M1 CDS-based premium omitted | V-014 | Fixed | §4.4, F23, Ex. 1 | Separate scenario axis: 9.27% total ERP; NGN route 24.01% |
| M1 USD risk-free should be the Treasury yield less the US default spread | V-014 | Fixed | §4.4 | 4.42% − 0.22% = 4.20% (synthetic Treasury yield) |
| M2 CET1, Tier 1, buffers, HLA, leverage missing; effective CAR floors 16% / 17% | V-014 | Fixed | F12, §4.3, §4.5, Ex. 1 | Re-read S52 primary: Tables 1–2, ¶30, ¶82, ¶94, ¶98 |
| M2 missing metrics (liquidity ratio, 75% CRR, LDR, SOL and forbearance, NOP, off-balance-sheet items, RRR, risk rating) | V-014 | Fixed; two values deferred | §4.3 | Metrics defined. Current CBN LDR policy and NOP limit not sourced (owner **Doc 5c**, registry `candidate`) |
| M2 Stage 3 compared with the prudential 5% NPL | V-014 | Fixed | §4.3, Ex. 1 | Stored separately; never equated |
| M2 dividend test rests on secondary press | V-014 | Fixed | F12, §4.3 | Primary Appendix 2; S53 superseded |
| M3(a) T-bill interest stated as exempt | V-013, V-022 | Fixed | F16, §4.5, §4.6, Ex. 3 | Doc 6 F12: 10% WHT from 28 Oct 2025; FGN bonds exempt (s.162(1)(n)) |
| M3(b) dividend WHT basis and effective date | V-013 | Fixed | F28, §4.5 | Doc 6 rule `NG-DIV-WHT-FINAL-2026`; WHT Regulations 2024 from 1 Jul 2024; NTAA s.51(3); S47 dropped |
| M3(c) gains thresholds and foreign currency as a chargeable asset | V-013 | Fixed | F28, §4.5, Ex. 3 | Doc 6 F13; C1.6 currency-gain flag on AED and USD buckets |
| M3(d) US estate tax and 30% dividend WHT missing from Example 3 | V-013 | Fixed | §4.7, Ex. 3 | Doc 6 F30–F31; monitor fires at USD 100,000 |
| — UAE regulator stated as SCA | V-022 | Fixed | §2, F1, §4.5, §4.7, §6, §9 | CMA, successor from 1 Jan 2026 [S54] |
| M4 NGX ±10% band | — | Fixed (regraded E3); confirmation deferred | F2, §4.5, §9 | Owner **Doc 5c** (rulebook) |
| M4 T+2 date is a news-item date | — | Fixed | F4, §4.5 | E3, unconfirmed |
| M4 tick sizes only partly confirmed | — | Fixed | F3, §4.5 | — |
| M4 MSCI February 2024 effective date | — | Fixed | F7, S46 | Unconfirmed |
| M4 MPR row incomplete (75% non-TSA CRR, prior corridor) | — | Fixed | F13, §4.5 | Re-fetched S10 |
| M4 PenCom S12 returns 404 | — | Fixed; re-location deferred | F8, §4.5, §9 | `source_status = moved`; owner **Doc 5c** |
| M4 DFM rules confirmed against secondary source only | — | Deferred | §4.5, §9 | Grade E3 unchanged (reviewer agrees). Official rulebooks: owner **Doc 5c** |
| M5 E1 conflates historical existence with persistence | — | Fixed | F19, §4.2 | E1 historical, E2/E3 persistence [S103, S67, S66] |
| M5 international evidence not cited | — | Fixed | F19, §4.2 | Pincus et al. 2007 [S104] |
| M5 "local replication is absent" too strong | — | Fixed | F19, F20, §4.2 | Nwosu 2026; Oyamienlen 2023 [S105, S106]; "no credible return test" |
| M5 HXZ F-score replication not cited specifically | — | Fixed (claim withdrawn) | F19, §4.2, §9 | Piotroski graded E2 alone |
| M5 Z'' original is Altman, Hartzell & Peck 1995 | — | Fixed | F20, §4.2 | [S107] |
| M6(a) no Doc 3 instrument for per-goal loss tolerance | — | Deferred (interim fix) | §4.9, §6 | Stored as a user-stated constraint; SOEP item not used. Instrument decision: owner **Doc 3** |
| M6(b) human capital needs inferred quantities | — | Fixed | §4.9 | E5, user-confirmed only; never inferred |
| M6(c) assumed founder position | — | Fixed | §7 | "Unknown — founder to confirm" |
| M6(d) no types, confirmation or expiry; empty universe while residency is unknown | — | Fixed | §4.9 | Field metadata; provisional mode across residency scenarios |
| M6(e) 24-month rule applied to a 5-year goal | — | Fixed | §4.9 rules 1a/1b, Ex. 3 | Beyond the window: flag, not exclusion |
| M6(f) infeasible goal yet the aspirational bucket narrowed to 18 names | — | Fixed | Ex. 3 Steps 1–3 | Bucket unfunded; coverage list is information only |
| M7 house thresholds are allocation advice | — | Fixed | §4.9, Ex. 3, §5 | Withdrawn as defaults; user-set parameters with logged reasons |
| M7 Bank X view is a rating by paraphrase | — | Fixed | §4.10 language, Ex. 1 | Price-implied ROE only; call phrasing banned |
| M7 "would be advice at commercialisation" flag; Legal review | — | Fixed (flag); review deferred | §4.9, §4.10, §6 | Legal review of wording: owner **Legal/Compliance** |
| m1 freshness and validation taxonomies conflict with Doc 5c | — | Fixed; merge deferred | §4.10 | C3 adopted; 5a table withdrawn; filing-calendar proposal. Merge: owner **Doc 5c** (R05c M8) |
| m2 F13 "expired since February 2026" vs 5c; 27.50% possibly wrong in 2025 | — | Fixed in part; rejected in part | F13, §4.10 | Wording now "wrong when committed" (brief v0.2; C3.6). **Rejected:** the CBN page (re-fetched 2026-11-04) shows 27.50% in force from the 299th to the 301st MPC (Feb–Jul 2025). It became wrong on 23 Sep 2025, not earlier in 2025 |
| m3 Example 3 omits NGN 25m and AED 40,000; net income basis unstated | — | Fixed | Ex. 3 | Both cases computed; after-PIT, provisional |
| m4 Example 2 inputs "stale" | — | Fixed | Ex. 2 | TTM from 10-K plus Q3 10-Q; grid unchanged and reproduced |
| m5 registry needs a "source moved" state | — | Fixed | §4.5 | `source_status` attribute (not a C3 validation state); vocabulary owner **Doc 5c** |
| m6 Mohanram issue 2–3 | — | Fixed | S63 | — |
| §3 evidence-grade audit (rows F19, §4.2, F12, F2, F4, F7, §4.5 WHT, F16, §4.9, Ex. 1, §4.4) | V-013, V-014 | Fixed | as per rows above | §4.9 thresholds are now E5 user parameters |
| §3 unsourced "NGX is bank-heavy" | — | Fixed | §4.3, R5 | Withdrawn; weight requested from Doc 5c |
| §3 unsourced "vendor feeds have no corporate-action metadata" | — | Fixed | §5 | Corrected per Doc 5c N1 |
| §3 unsourced "breadth without provenance" | — | Fixed | §1, §5, R1 | Brief records inaccuracy, not breadth |
| §4 citation spot-check (S60, S66, S83, S84, S85, S93) | — | Fixed | §10 | Statuses updated (Crossref) |
| §5.1–5.2 freshness and validation vs 5c | — | Fixed | §4.10 | = m1 |
| §5.3 MPR graded E3 in 5c | — | Deferred | — | 5a keeps E2; Doc 5c to upgrade (owner **Doc 5c**) |
| §5.4 AED peg E3 (5a) vs E4 (5c) | — | Deferred | F17, Ex. 3 | Under C5.1/C3.5 the peg stays `candidate` until a CBUAE snapshot, whatever the grade; grade owner **Doc 5c** |
| §5.5–5.6 tax and Doc 3 contradictions | V-013, V-022 | Fixed | = M3, M6 | — |
| IC Q1 house country-risk basis | — | Fixed | §4.4, §7 | No default; both axes; revisited each edition |
| IC Q2 grid mechanical or hand-set | — | Fixed | §4.4, Q6 | Mechanical |
| IC Q3 period-alignment and sustainable-growth checks | — | Fixed | §4.10 Q1, Q4 | — |
| IC Q4 provisional mode while residency is unknown | — | Fixed | §4.9 | — |
| IC Q5 who sets thresholds; override | — | Fixed | §4.9 | The user, with a logged reason |
| IC Q6 per-goal loss-tolerance instrument | — | Deferred | §4.9 | Owner **Doc 3** |
| IC Q7 does R5 stay a must-have | — | Fixed | §8 R5 | Gated on registry rows |
| IC Q8 which outputs become advice | — | Fixed (flags); review deferred | §4.9, §4.10 | Owner **Legal/Compliance** |
| IC Q9 recapitalisation outcome; banks under forbearance | — | Deferred | §7 (13), §9 item 3 | Owner **Doc 5c** (data); not found in this pass |
| IC Q10 ±10% band daily or pre-open | — | Deferred | F2, §9 item 1 | Owner **Doc 5c** |
| Consistency pass, 2026-11-04 (Doc 5 §9.2 I1–I7) | V-031, V-032, V-033 | Fixed; version stays 0.2 | Script `fresh_5c()`; F2; §4.5; §4.9; §4.10; Ex. 1–3; this section | `fresh_5c()` now uses Doc 5c v0.2 thresholds. The v0.1 inputs (308 and 127 days old) are `stale`, and Example 1's computed status is unchanged (`fresh`). NGX price and dividend relabelled `same_upstream` and tied to the single-source protocol. MPR set to Doc 5c's `auto_validated`, `single_source` record. ±10% band `candidate` in step with 5b and 5c. Ternary admissibility stated. DFM/ADX equities are exposure-only in the MVP. B1-grading dissent and contract observation 1 withdrawn. Script re-run under `python3 -I` |
| Contract conformance to contracts v0.2, 2026-11-04 | CC-3, CC-10, RT-A rate field, RT-A independence | Fixed; version stays 0.2 | §4.10 (independence labels, sampling floor, C3.2a freshness replacing this document's merge proposal, Q2 `ca_set_version` refusal, sign-off labels); §4.5 Official FX row; Ex. 1 provenance note; Ex. 2 status; this section (observations 2–3 closed) | Founder checks are `self` and display "self-checked"; status values unchanged, so the script and every quoted number are unchanged. Not done here (outside the listed sections): §4.7/Ex. 3 monitor threshold mode (CC-4) and Ex. 3 tax refusal (CC-6). Not a review row; outside the counts |

**Counts.** 65 review rows, not counting the consistency-pass row: 50 Fixed (one with a method that differs from the reviewer's, one by withdrawing the claim); 7 Fixed with a residual item deferred to a named owner; 1 Fixed in part and Rejected in part (m2); 7 Deferred with an owner. No finding was dropped.

**Disagreements with the reviewer (preserved).**
1. *Normalisation tax rate (B2).* The reviewer tax-effects the FX gain at 30%. The department uses the tax note's attribution and shows the untaxed variant. A fixed statutory rate can be wrong in either direction: unrealised revaluation gains may be untaxed, and realised gains may bear the windfall levy (§7).
2. *m2.* 27.50% was correct from February to July 2025, so the hard-coded value was not wrong "already in 2025" before 23 September.
3. *B1 grading (withdrawn in the 2026-11-04 consistency pass).* This dissent rested on Doc 5c's withdrawn v0.1 table. Under Doc 5c v0.2 the FY2025 and H1-2026 inputs are both `stale`, so R05a's B1 stands in full (V-031).

**Observations on the contracts (no departure; raised for the contract owners).**
1. *C3, freshness thresholds (withdrawn in the 2026-11-04 consistency pass).* It cited 5c's v0.1 "fresh up to 300 days" rule, which Doc 5c v0.2 had already withdrawn in favour of the filing calendar (5c §4.3.2). Nothing remains to raise.
2. ~~*C3.3, sampling rule.*~~ **Closed** by contracts v0.2 (CC-10): the floor max(⌈n/20⌉, min(n, 4)) checks every edition of a semi-annual series (§4.10).
3. ~~*C5.1, rate field.*~~ **Closed** by contracts v0.2 (RT-A rate field): the reference is the "NFEM Rate (₦/US$)" field, `nfem_vwap` (§4.5).

**What remains open.**
- Primary texts of the CBN FX-gains (September 2023, March 2024) and forbearance (June 2025) circulars, the list of banks under forbearance, and whether a countercyclical buffer is set.
- Whether the 2024 windfall levy was enacted, at what rate and for which years (Doc 6).
- Whether the Composite Risk Rating is ever disclosed. Until it is, bank dividend caps are ranges.
- The NGX ±10% band, NGX filing deadlines, the NGX Banking index weight, the recapitalisation outcome and the relocated PenCom and DMO documents (Doc 5c).
- The per-goal loss-tolerance instrument (Doc 3). Legal review of the permitted-language list and the `advice_sensitive` outputs (Legal/Compliance).
- Practitioner confirmation of every tax rule used (Doc 6; C7 watermark applies).
- Re-verification of academic references with the reference-lookup tool, and the specific Hou–Xue–Zhang F-score result.

---
*Prepared by the simulated Investment Management and Portfolio Research department. Simulated specialists are not licensed professionals; a regulated financial adviser, accountant and lawyer must review before anything here is relied upon or offered to third parties.*
