```
Document: 5a — Institutional Investment Research Methodology and Data-Quality Framework
Department: Investment Management and Portfolio Research  ·  Lead role(s): Chief Investment Officer, institutional portfolio manager, equity research analyst, fixed-income analyst, investment strategist, asset-allocation specialist, risk manager, financial-statement analyst, economist, macroeconomic research analyst, emerging-markets specialist
Version: 0.1 draft  ·  Date: 2026-11-02 (sources re-checked 2026-11-04)  ·  Status: for cross-department review
Reviewers required: Data Sources (Doc 5c), Quantitative Models (Doc 5b), Tax (Doc 6), Behavioural Finance (System B), Personal-Finance Ledger (System A), AI Research and Explanation (System H), Legal/Compliance, Programme coordinator
```

# Document 5a — Institutional Investment Research Methodology and Data-Quality Framework

## 1. Executive summary

**Conclusions.** Portfolio OS should reproduce the *discipline* of institutional research, not its scale: a documented process that moves from validated data, through financial-statement analysis and quality checks, to a valuation *range*, an explicit thesis with written invalidation conditions, and an independent review before anything is shown to the user. The founder's earlier Nigerian tracker failed on the first step (figures without source, as-of date or validation), so this document makes provenance a precondition for every later step rather than a feature added afterwards.

Three findings drive the design. First, the markets in scope differ sharply in data accessibility and rule stability: US filings are machine-readable through free official APIs (F19), whereas Nigerian Exchange (NGX) microstructure rules changed three times in 2026 alone — trading hours (27 April), settlement (T+1 from 1 June) and a pricing-methodology revision that was approved, scheduled and then postponed (F3–F6). A market-rule registry with effective dates is therefore a core requirement, not documentation. Second, the academic evidence behind popular screening tools (Piotroski F-score, Beneish M-score, accruals, Altman Z) is strong in US data but has not been replicated by us on NGX, Dubai Financial Market (DFM) or Abu Dhabi Securities Exchange (ADX) data, so these tools enter the product as *descriptive flags* until the quant team backtests them (F8–F11). Third, the evidence on return predictability (Welch & Goyal 2008; Goyal, Welch & Zafirov 2024) means the product must never present expected returns as forecasts; it presents ranges, scenarios and required-saving arithmetic (F21–F22).

**Biggest uncertainty.** Whether a single individual's research system can keep market-rule and corporate-action data accurate enough, cheaply enough, for NGX and the UAE exchanges. The consequences of getting this wrong are exactly the failure the founder already experienced. We recommend the Personal MVP ship with a narrow, fully validated universe (NGX banks and large caps, FGN securities, a handful of US and UAE instruments) rather than broad coverage with weak provenance.

**Top recommendations.** Personal-MVP must-haves: provenance-first figure model with stale-figure display; market-rule registry; research-note template with invalidation statements and value ranges; bank-analysis module; "circumstances as inputs" filter that shrinks the admissible universe before research starts. Later: quality screens after local backtests, valuation engine, fixed income and fund analytics, Shari'a classification. Do-not-build (yet): automated ratings, target prices, return forecasts, macro-timing overlays, model-generated figures.

## 2. Scope and method

**Questions addressed.** (A) How professional institutions analyse securities and how much evidence supports each tool; (B) market-specific rules for NGX, DFM/ADX, US equities, Nigerian/UAE/US fixed income and funds; (C) how macro conditions enter security and allocation views without forecasting; (D) how an individual's circumstances become explicit research inputs; (E) a research-quality and data-quality framework; (F) worked examples with synthetic numbers. Quantitative model design (Doc 5b) and data-source selection/licensing (Doc 5c) are out of scope; what we need from them is listed in §6.

**What we searched and read (all accessed 2026-11-02, re-checked 2026-11-04).** Primary sources: NGX market-structure page and press release on trading hours; NGX rulebook documents (pricing methodology interpretative guidance and FAQ, free-float rules, index circuit-breaker rule); NGX Domestic and Foreign Portfolio Investment Report (September 2026); Central Securities Clearing System (CSCS) T+1 page; Central Bank of Nigeria (CBN) Monetary Policy Committee (MPC) decisions page, NFEM exchange-rate page and Guidelines on Regulatory Capital (2021); National Pension Commission (PenCom) addendum of 9 February 2026; National Bureau of Statistics (NBS) CPI rebasing highlights (February 2025); IFRS Foundation jurisdiction profiles for Nigeria and the UAE; Debt Management Office (DMO) and FMDQ Exchange pages; Securities and Exchange Commission (SEC) Nigeria NAV page; US SEC EDGAR API documentation; UAE Ministry of Finance T-Bonds programme page; DFM Shari'a compliance page; Damodaran's country-risk page, July 2026 blog post and spreadsheet; CFA Institute Code and Standards and Research Objectivity material; BIS BCBS 239 page. Secondary sources (broker market-information pages for DFM/ADX, Nigerian financial press) were used only where primary pages were unavailable (several DFM, ADX, CBN and CBUAE pages returned 403/404 in this environment) and are labelled as such.

**Tools.** WebSearch (standard and extended) and WebFetch; curl plus `pdftotext`/`openpyxl` to read primary PDFs and spreadsheets; Python 3 for the worked-example arithmetic. Academic references were checked with the hosted reference-lookup tool against OpenAlex **by DOI**; title-only lookups and the non-hosted tool timed out, and OpenAlex returned HTTP 429 towards the end of the session. Each reference in §10 carries **[verified]**, **[partially verified]** (DOI resolves to the right title but the full check was blocked by rate limits) or **[unverified]**. Claims that rest only on unverified references are graded no higher than E3.

**What we could not access or verify.** The web-search budget was exhausted mid-session; later checks used direct fetches only. Not verified from primary sources: the current CBN recapitalisation outcome after 31 March 2026; the June 2023 FX-window unification and December 2024 electronic FX matching system; the Central Bank of the UAE (CBUAE) peg statement (page blocked); DFM Shari'a Standard 1 thresholds; the current UAE Securities and Commodities Authority (SCA) accounting-standards rule (the IFRS Foundation profiles date from 2016); NGX index methodology and corporate-action (closure-of-register) rules; the exact Nigeria Tax Act 2025 exemption thresholds for gains on shares (deferred to Doc 6); brokerage access routes from Nigeria/UAE to US markets. These are listed again in §7 and §9.

## 3. Findings

Evidence grades follow the brief (E1–E6). Source numbers refer to §10. "Checked 2026-11-04" applies to every time-sensitive fact unless stated.

### 3.1 Accounting basis and market rules

**F1. Nigerian and UAE listed companies report under IFRS, but the UAE evidence is dated.** Nigeria requires IFRS Accounting Standards for all companies whose securities trade in a public market, effective January 2012, under the Financial Reporting Council of Nigeria Act 2011 [S14]. For the UAE, the IFRS Foundation profile records that the Commercial Companies Law No 2 of 2015 requires "international accounting standards", that ADX and Nasdaq Dubai listing rules require IFRS, and that DFM-listed companies use IFRS in practice while some Islamic financial institutions used AAOIFI standards; the profile is internally inconsistent on whether DFM *requires* IFRS and was last updated 16 June 2016 [S15]. Grade: E2 for Nigeria; E3 for the UAE pending a check of current SCA rules (Doc 5c). Implication: one IFRS-based statement model serves all three markets, but the UAE data layer must tolerate AAOIFI-format statements for some Islamic banks.

**F2. NGX trading hours changed on 27 April 2026 to 09:00–16:00 WAT**, approved by SEC Nigeria; the prior window closed at 14:30 [S1, S2]. The NGX market-structure page shows pre-open at 09:00, continuous trading from 09:30, pre-close from 15:50 and close at 16:00, with a "+/-10%" price limit shown in the session table [S1]. Grade: E2. Note the 2018 interpretative guidance describes a ±5% limit around the reference price under the then session structure [S3]; the current page shows ±10%. We treat ±10% as current but flag the discrepancy for rulebook confirmation (§9).

**F3. NGX pricing methodology: three price groups with volume thresholds and tick sizes, and a 2026 revision approved but postponed.** The rule effective 29 January 2018 (SEC approval 14 March 2017) classifies equities as Group A (≥ N100: 10,000 units to move the price, tick N0.10), Group B (N5 to < N100: 50,000 units, tick N0.05) and Group C (< N5: 100,000 units, tick N0.01), with reclassification after four of the last six months in a band [S3, S4]. In June 2026 SEC approved revised bands (Group A ≥ N1,000; B N500–999.99; C < N500) with the same unit thresholds and ticks; implementation set for 17 August 2026 was postponed without a new date, and the exchange said the existing N100/N5 bands remain in force [S35, S36, S37]. Press reports conflict on whether a uniform 100,000-unit rule was in force at any point in 2024–2026 [S37, S38]. Grade: E2 for the 2018 rule; E3 for 2026 status. Implication: a published NGX price can lag economic value because small trades do not move it; the registry must store the rule *with its effective date*.

**F4. Settlement: NGX equities moved to T+2 on 28 November 2025 and to T+1 on 1 June 2026** at CSCS, covering NGX, NASD OTC and the Lagos Commodities and Futures Exchange; fixed income already settled T+2 [S9, S43]. Grade: E2.

**F5. Free float: 20% of issued shares held by at least 300 shareholders, or a float valued at N20bn (Main Board) / N40bn (Premium Board)**; free float excludes holdings of promoters, directors, strategic holders of ≥ 5% and government; issuers must disclose shortfalls, and trading may be suspended for persistent breaches (rules approved by SEC 6 May 2019) [S5]. Grade: E2. Implication: free float, not market capitalisation, is the first liquidity filter.

**F6. Index circuit breaker: a 5% move in the All-Share Index between 10:15 and 13:45 halts all trading for 30 minutes, once per day; a further 5% closes the market** (Rule 15.46, effective 5 February 2016; times predate the 2026 session change) [S6]. Grade: E2 for the rule text; E3 for current times.

**F7. Foreign participation on NGX has fallen to about 10% of turnover in 2026 (from 21.6% in 2025 year-to-date), and domestic institutions dominate**; the NGX report for September 2026 gives 2026 YTD foreign 10.26% / domestic 89.74%, with domestic institutional N8.37trn versus retail N5.15trn, and reports the NAFEM rate used for conversion (N1,329.16/$ at 30 September 2026) [S7]. Grade: E2. FTSE Russell moved Nigeria from Frontier to Unclassified in September 2023 and back to Frontier effective 21 September 2026, citing FX liquidity and repatriation; MSCI moved Nigeria to Standalone status (announced October 2023, effective February 2024) and had, as of October 2026, not reversed it [S40, S46]. The 2016 MSCI release documents the earlier episode: a 2015 peg caused FX illiquidity that "significantly impaired" repatriation [S28]. Grade: E2/E3. Implication: FX convertibility is a first-order risk factor for any NGN asset held by a person with AED/USD liabilities.

**F8. Nigerian pension funds are the marginal domestic institutional buyer, with equity limits raised in February 2026**: PenCom's addendum of 9 February 2026 raised ordinary-share limits for RSA Fund I 30%→35%, Fund II 25%→33%, Fund III 10%→15% and Fund VI-Active 25%→33%, citing excess liquidity and a shortage of alternative assets [S12]. Grade: E2.

**F9. DFM and ADX rules (broker sources; official pages blocked in this session):** continuous trading 10:00–14:45 with a closing auction to 15:00 GST, Monday–Friday; daily limits +15% / −10% from the previous close (ADX adds auction pauses at −5% and −9%); tick sizes from AED 0.001 (below AED 1) to AED 0.10 (≥ AED 100); settlement T+2; foreign-ownership limits (FOL) set by each company's articles within 15–100%, with GCC investors sometimes treated as foreign; trading identity via a National Investor Number (NIN); no withholding, capital-gains or dividend tax [S30, S31]. DFM publishes a Shari'a classification list and three Shari'a standards prepared by an in-house committee (Standard 1 covers issuing, acquiring and trading shares) but the ratio thresholds were not retrievable [S22]; index-provider screens use 33% debt/market-cap limits (S&P, FTSE) versus 30% (AAOIFI) [S29]. ADX removed daily price limits on ETFs and futures from 3 August 2026 [S49]. Grade: E3 throughout; must be re-verified against DFM/ADX rulebooks by Doc 5c.

**F10. US markets: filings are free and machine-readable.** The SEC's `data.sec.gov` APIs (submissions, companyfacts, companyconcept, frames) return XBRL facts in JSON with sub-minute latency and no API key; bulk ZIPs rebuild nightly; only standard taxonomies (us-gaap, ifrs-full, dei, srt) are aggregated [S19]. Grade: E2. Implication: US coverage is the cheapest place to prove the provenance pipeline before applying it to NGX.

### 3.2 Banks, capital and macro

**F11. CBN recapitalisation 2024–2026: minimum paid-up capital plus share premium of N500bn (international), N200bn (national), N50bn (regional), N50bn (merchant), N20bn/N10bn (non-interest national/regional); retained earnings and AT1 excluded; window 1 April 2024–31 March 2026; options were fresh equity, M&A or licence change** [S32]. CBN said 30 banks had met their thresholds as of 6 March 2026 and 33 had raised capital [S33, S34]. The final post-deadline outcome was not verified in this session. Grade: E3 (circular text seen only via press). Implication: for every NGX bank the research note must record licence category, qualifying capital and compliance status with a date.

**F12. CBN capital adequacy minimums: 15% CAR for banks with international authorisation and domestic systemically important banks (D-SIBs), 10% for others**, plus buffers (Guidelines on Regulatory Capital, September 2021) [S52]. Dividend restrictions tied to NPL ratios above 5% and 10% are reported in secondary sources [S53]. Grade: E2 for CAR; E3 for dividend rules.

**F13. Monetary policy as of the 307th MPC (21–22 September 2026): MPR reset to 23.0% from 26.5%, corridor +50/−300 bp, CRR 45% (commercial) and 16% (merchant)**; earlier 2026 decisions: 26.5% in February (cut of 50 bp), held in May and July [S10]. Grade: E2. The repository's hard-coded 27.50% is therefore stale by at least two decisions — the anti-pattern this document is designed to remove.

**F14. Inflation statistics were rebased in early 2025 (base year 2024, weights 2023, 934 varieties, 13 COICOP 2018 divisions, modified Laspeyres/Young index)** [S13]; press reports describe a further revision to the index reference period around the turn of 2025/26 [S48]. Grade: E2 for the rebasing; E3 for the later revision. Implication: inflation series must carry a methodology version; year-on-year comparisons across the break are invalid without the NBS linked series.

**F15. The official NGN/USD rate is the NFEM volume-weighted average published daily by CBN**, with high, low, close and turnover [S11]. CBN stated in March 2024 that all *valid* legacy FX backlog claims (about $7bn claimed, $2.4bn found invalid) had been settled [S45]. Grade: E2 for the rate definition; E3 for the backlog history.

**F16. Nigerian federal securities: FGN bonds auction monthly (minimum N50,001,000 at auction), trade on NGX (retail) and FMDQ (wholesale); FGN Savings Bonds, Sovereign Sukuk, Green Bonds, Eurobonds and Treasury bills exist; DMO states FGN securities' interest is tax-exempt; no inflation-linked bond is listed** [S16]. FMDQ publishes closing prices and yields for bonds, T-bills, OMO bills and commercial paper, NAFEX, NIBOR and NITTY fixings and an S&P/FMDQ sovereign bond index, dated daily [S17]. Grade: E2. Implication: inflation-linked thinking in Nigeria must be done analytically (real-yield arithmetic), not through instruments.

**F17. UAE federal dirham T-Bonds and T-Sukuk are auctioned on a published calendar (about AED 1.1bn in most months of 2026, maturities 2026–2033) with a retail T-Sukuk calendar** [S21]; a fractional/retail access initiative from AED 4,000 was reported in 2025–26 [S50]. The dirham's peg to the US dollar at 3.6725 is a long-standing CBUAE policy but the CBUAE page could not be fetched; treat as E3 [unverified in session].

**F18. Nigerian collective investment schemes: SEC publishes monthly (and, per press, weekly) NAV reports; industry NAV was about N9.9trn at 9 October 2026, with money-market funds 68%, dollar funds 18%, equity funds 2.4% and ETFs N33bn** [S18, S39]. Grade: E2 for the publication; E3 for the figures (press citing SEC). NGX lists 21 indices including the All-Share Index, NGX 30, NGX Banking, NGX Pension, NGX Lotus Islamic and NGX Sovereign Bond, but methodology documents were not retrieved [S8].

### 3.3 Evidence behind research tools

**F19. Earnings quality and accrual-based screens are well evidenced in US data; local replication is absent.** Sloan (1996) documents the accrual anomaly [S60, unverified by tool]; Dechow, Ge and Schrand (2010) review the proxies and their limits [S61, verified]; Piotroski's F-score separates winners from losers among high book-to-market stocks [S62, verified]; Mohanram's G-score extends to growth stocks [S63, verified]; Beneish's M-score detects manipulation and predicts returns [S64, S65, verified]; Hou, Xue and Zhang (2020) show that most published anomalies weaken or fail under replication with microcaps controlled [S66, unverified by tool]; McLean and Pontiff (2016) show post-publication decay [S67, verified]; Harvey, Liu and Zhu (2016) argue for higher statistical hurdles [S68, verified]. Grade: E1 for the existence of these effects in US data; **E4 for their validity on NGX/DFM/ADX** until Doc 5b backtests them.

**F20. Distress models: Altman's Z (1968) and the emerging-market Z'' variant (2005) and Ohlson's O-score (1980) are standard** [S69, S70, S71, verified]; they are calibrated on non-financial firms and are not designed for banks. Grade: E2 as tools; E4 locally.

**F21. Equity-premium predictability is weak out of sample.** Welch and Goyal (2008) find most predictors fail out of sample; Campbell and Thompson (2008) show modest gains only with economically motivated restrictions; Cochrane (2008) defends long-horizon predictability from dividend yields; Rapach, Strauss and Zhou (2010) find combination forecasts help marginally; Goyal, Welch and Zafirov (2024) re-examine 29 newer predictors and find most do not hold up [S72–S76, verified]. Valuation ratios (Campbell & Shiller 1988, 1998; Siegel 2016 on CAPE) relate to long-horizon returns with wide error bands [S77–S79, verified]. Grade: E1. Implication: the product may state that "valuation is high/low relative to history"; it may not state an expected return as a forecast.

**F22. Regime models describe history better than they predict it.** Ang and Bekaert (2002) and Ang and Timmermann (2012) document regime shifts in correlations and volatility, with the caveat that regimes are identified with lag and parameters are unstable [S80, S81, verified]. Grade: E2. Country risk matters for emerging-market returns and volatility (Erb, Harvey & Viskanta 1996; Bekaert & Harvey 1995) [S82 verified, S83 unverified by tool].

**F23. Country risk premiums (Damodaran): July 2026 edition uses a mature-market ERP of 4.20% (S&P 500 implied ERP 4.42% less the US Aa1 default spread), sovereign-rating-based default spreads scaled by a relative equity/bond volatility multiplier of 1.55; Nigeria (B3) default spread 5.17%, country risk premium 8.04%, total ERP 12.24%; UAE (Aa2) 0.39% / 0.61% / 4.81%; United States 4.42%** [S26, S27]. The January 2026 page had Nigeria at 5.52% / 8.41% / 12.64% [S25]. The author describes the method as pragmatic rather than theoretical, warns that exposure should follow where a company operates rather than where it is incorporated, and that currencies should not carry risk premiums of their own [S26]. Grade: E3 (practitioner standard, semi-annual; version must be stored).

**F24. Goals-based and liability-aware allocation has a coherent theoretical base.** Chhabra (2005) proposes safety/market/aspirational buckets [S84, partially verified]; Nevins (2004) integrates goals with behavioural finance [S85, partially verified]; Shefrin and Statman (2000) and Das, Markowitz, Scheid and Statman (2010) show mental-account portfolios can be made mean-variance consistent [S86, S87, verified]; Sharpe and Tint (1990) formalise liability hedging [S88, verified]; Markowitz (1952) remains the baseline [S89, verified]. Grade: E2.

**F25. Human capital and labour income should shape the financial portfolio.** Bodie, Merton and Samuelson (1992), Viceira (2001) and Cocco, Gomes and Maenhout (2005) show that the riskiness and flexibility of labour income change optimal equity exposure over the life cycle [S90–S92, verified]. Grade: E2 (theory and calibrated models; limited direct field evidence).

**F26. Home bias is pervasive and costly in expectation; concentration risk is severe.** French and Poterba (1991) [S93, unverified by tool], Coval and Moskowitz (1999) [S94, verified] and Cooper and Kaplanis (1994) [S95, verified] document and partly explain home bias; Bessembinder (2018) shows that most individual US stocks underperformed Treasury bills over their lives and that aggregate wealth creation is concentrated in a few firms [S96, verified]; Statman (1987, 2004) on the number of stocks needed for diversification [S97, S98, verified]. Grade: E1 for home bias and skewness in US data; E3 for transfer to NGX.

**F27. Professional standards for research notes exist and are usable.** CFA Institute Standards V(A) Diligence and Reasonable Basis, V(B) Communication with Clients and V(C) Record Retention (Code and Standards effective 1 January 2024) [S23]; the Research Objectivity Standards and the 2018 CFA Institute brief list the disclosures a reader needs to judge a report: depth of analysis, methodology, definitions, third-party inputs and past performance of research [S24]. BCBS 239 (January 2013) sets risk-data principles — governance, data architecture, accuracy and integrity, completeness, timeliness, adaptability — written for banks but directly transferable to a personal research system [S20]. Grade: E3.

**F28. Tax parameters are inputs, not afterthoughts.** The Nigeria Tax Act 2025 took effect on 1 January 2026 with progressive personal rates of 0–25% and a multi-test residency definition; dividends are taxable investment income; the treatment of gains on shares and the withholding rate on dividends must be confirmed by Doc 6 [S41, S47]. UAE exchanges report no withholding or capital-gains tax on listed securities [S30, S31]. Grade: E3 pending Doc 6.

## 4. Proposed framework / specification for Portfolio OS

### 4.1 The research process as a pipeline with gates

Institutional research is a sequence of gated steps; Portfolio OS should encode the gates, not just the analytics. A security cannot advance to the next stage until the gate condition is met and logged.

| Stage | Purpose | Gate to pass (logged) | Owner |
|---|---|---|---|
| 0. Circumstances filter | Remove instruments the user cannot or should not hold (currency, liquidity, horizon, concentration, tax, access) | Instrument is in the *admissible universe* (§4.9) | System A inputs + this framework |
| 1. Idea generation | Screens, events (results, corporate actions, policy changes), portfolio needs (liability matching) | Idea logged with source and date; no number yet shown to user | Analyst role |
| 2. Data validation | Assemble price, shares, statements, dividends, corporate actions, FX with provenance | All mandatory inputs at validation status V2 or better (§4.10) | Data-quality role (Doc 5c) |
| 3. Financial-statement analysis | Restate IFRS statements into a standard model; compute ratios; quality checks | Reconciliation to filing totals within tolerance; quality flags computed | Analyst + quant check |
| 4. Valuation | DCF, dividend models, relative, sum-of-parts; dual-currency reconciliation | Output is a *range* with named drivers; no single target | Analyst + quant check |
| 5. Thesis and invalidation | One-paragraph thesis; three to five measurable invalidation conditions with data sources | Each invalidation condition maps to a monitored field | Analyst |
| 6. Review | Quant check (formulas, units), data-quality check (provenance, freshness), risk check (concentration, liquidity, currency) | Sign-off recorded with reviewer role and date | Three roles |
| 7. Publication to user | Research note with provenance on every figure; permitted language only | Automated linter passes (§4.10) | System H |
| 8. Monitoring | Invalidation conditions and freshness watched; note auto-expires | Note status: current / stale / invalidated | System |

For the Personal MVP the "roles" are the founder plus system checks; the separation still matters because it forces the invalidation conditions and the provenance check to be written down before a conclusion is shown.

### 4.2 Financial-statement analysis and quality-of-earnings tools

All three markets are IFRS-based (F1), so one statement model applies: income statement, balance sheet, cash-flow statement, plus notes for segment data, impairment (IFRS 9), leases (IFRS 16), revenue (IFRS 15) and related parties. The model stores *reported* values with filing page references and computes derived values; derived values are never stored without their formula and inputs.

| Tool | What it measures | Formula summary | Evidence grade (US) | Local status | Product use |
|---|---|---|---|---|---|
| Accruals ratio | Gap between earnings and cash | (Net income − CFO) / average total assets; or balance-sheet accruals | E1 (Sloan 1996 [unverified by tool]; Dechow et al. 2010) | E4 until Doc 5b backtests on NGX/DFM | Flag "earnings not cash-backed" with the two inputs shown |
| Piotroski F-score (0–9) | Improving profitability, leverage/liquidity, efficiency | Nine binary signals (ROA > 0, CFO > 0, ΔROA > 0, CFO > NI, Δleverage < 0, Δcurrent ratio > 0, no dilution, Δgross margin > 0, Δasset turnover > 0) | E1/E2 (Piotroski 2000; replication by Hou et al.) | E4 locally | Descriptive flag; never a rating |
| Mohanram G-score | Growth-stock analogue | Eight signals incl. R&D, capex, advertising intensity, earnings variability | E2 | E4 | Flag |
| Beneish M-score | Probability of manipulation | 8-variable model (DSRI, GMI, AQI, SGI, DEPI, SGAI, LVGI, TATA); threshold −1.78 | E2 (Beneish 1999; Beneish, Lee & Nichols 2013) | E4; IFRS account mapping must be documented | "Manipulation risk flag" with components shown |
| Altman Z / Z'' (EM) | Distress | Z'' = 6.56 X1 + 3.26 X2 + 6.72 X3 + 1.05 X4 (+3.25 constant in EM scoring) | E2 (Altman 1968, 2005) | E4; not for banks | Flag for non-financial issuers only |
| Ohlson O-score | Distress (logit) | Nine-variable logit | E2 | E4 | Optional |
| Gross profitability, QMJ | "Quality" | Gross profit / assets; composite quality | E2 (Novy-Marx 2013 [verified by DOI]; Asness et al. 2019) | E4 | Context only |

Rules for quality-of-earnings work on NGX and UAE statements: (i) FX revaluation gains and losses must be separated from operating earnings (large in Nigeria after 2023–24 devaluation episodes); (ii) IFRS 9 expected-credit-loss (ECL) stages must be read from the notes, not inferred; (iii) related-party exposures and government receivables are a Nigerian-specific quality item; (iv) bonus issues change share counts and must be applied to per-share history; (v) Shari'a-compliant companies' financing structures distort leverage ratios designed for conventional debt.

### 4.3 Bank-specific analysis (the NGX is bank-heavy)

Generic screens (F-score, Z-score) are not valid for banks. The bank module computes the following from audited and interim IFRS statements, each with a note reference:

| Metric | Definition (stored formula) | Why it matters | Validation |
|---|---|---|---|
| Net interest margin (NIM) | Net interest income / average interest-earning assets | Core earnings power; sensitive to MPR and yield curve | Interest-earning assets reconciled to balance sheet |
| Cost of risk | Impairment charge on loans / average gross loans | Credit cycle; recapitalisation era risk | Impairment charge tied to IFRS 9 note |
| Stage 3 ratio | Stage 3 gross loans / total gross loans | Non-performing exposure (compare with the 5% prudential reference) | From ECL staging note |
| Stage 3 coverage | Stage 3 ECL allowance / Stage 3 gross loans | Adequacy of provisioning | Same note |
| Stage 2 share and migration | Stage 2 / gross loans; quarter-on-quarter change | Early-warning | Same note |
| Capital adequacy ratio (CAR) | As reported; compare with 15% (international/D-SIB) or 10% minimum (F12) plus buffers | Dividend capacity; recapitalisation | Reported figure plus licence category |
| Qualifying capital (recap) | Paid-up capital + share premium versus the F11 threshold for the licence category | Compliance and dilution risk | Share register / statement of changes in equity |
| Cost-to-income | Operating expenses / operating income | Efficiency; inflation pass-through to costs | Exclude impairment |
| Earnings mix | Share of profit before tax from FX revaluation, trading gains, fees | Sustainability (normalised ROE) | Income statement notes |
| Funding | CASA share, loan-to-deposit, CRR drag (45% CRR, F13) | Liquidity and margin pressure | Balance sheet |
| Sovereign exposure | FGN securities / total assets | Sovereign–bank nexus; duration risk | Investment securities note |
| Dividend capacity | Payout, regulatory restrictions (NPL and CAR tests, F12) | NGX dividend culture | Regulatory thresholds in rule registry |

Normalisation: compute ROE on reported earnings *and* on earnings excluding FX revaluation and one-off gains; show both. The valuation of banks uses excess-return or justified price-to-book models rather than free-cash-flow DCF (worked example §4.11).

### 4.4 Valuation module: ranges, currency consistency and dividends

**Principles.** (1) Cash flows and discount rates must be in the same currency and the same inflation basis (Damodaran's own caveat, F23). (2) Every valuation is reported as a range from a small grid of explicitly named assumptions, never a single figure. (3) The cost-of-capital build-up is stored with the version of its inputs (country-risk edition, risk-free source, date).

**Cost of equity for Nigerian issuers — two reconciled routes.**
- *USD route:* USD risk-free rate + β × total equity risk premium for Nigeria (Damodaran July 2026: 12.24%), then convert to NGN with expected inflation differential: (1 + k_USD) × (1 + π_NGN) / (1 + π_USD) − 1. With a 4.2% USD risk-free rate and β = 1 the USD cost of equity is 16.4%; at 12%/15%/18% NGN inflation (2.5% USD) it becomes 27.2% / 30.6% / 34.0% in NGN.
- *NGN route:* local government bond yield (which already embeds a sovereign default spread) + β × mature-market ERP × relative-volatility factor. With a synthetic 18% FGN 10-year yield this gives about 24.5%.
- The two routes rarely agree because the NGN route double-counts or under-counts country risk depending on how much of it the FGN yield already carries, and because inflation expectations are unobservable in Nigeria (no inflation-linked bonds, F16). The product shows both and uses their span as the discount-rate range. **Disagreement preserved:** the equity analyst prefers the USD route (cleaner premium data); the economist prefers the NGN route (market-implied local rates); the risk manager wants both displayed (§7).

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

The registry is a versioned table; every row has `rule`, `market`, `value`, `effective_from`, `source`, `source_date`, `checked_on`, `next_check`, `confidence`. The analyst layer reads rules from the registry, never from code constants. Initial contents (all values as found on 2026-11-04):

| Market | Rule | Value | Effective | Source | Confidence |
|---|---|---|---|---|---|
| NGX | Trading hours | 09:00–16:00 WAT (pre-open 09:00; continuous 09:30; close 16:00) | 2026-04-27 | S1, S2 | E2 |
| NGX | Daily price limit (equities) | ±10% | current page | S1 | E2 (2018 guidance showed ±5%; confirm) |
| NGX | Price groups / volume to move price / tick | A ≥ N100: 10,000 / N0.10; B N5–<N100: 50,000 / N0.05; C < N5: 100,000 / N0.01 | 2018-01-29 (2026 revision approved, postponed) | S3, S4, S35 | E2 (status E3) |
| NGX | Settlement | T+1 | 2026-06-01 | S9 | E2 |
| NGX | Free float | 20% & ≥300 holders, or N20bn (Main) / N40bn (Premium) | 2019-05-06 | S5 | E2 |
| NGX | Index circuit breaker | ASI ±5% 10:15–13:45 → 30-min halt; further 5% → close | 2016-02-05 | S6 | E2 (times pre-date 2026 hours) |
| NGX | Dividend withholding | reported 10% (final for individuals) | 2026-01-01 (Tax Act) | S47 (secondary) | E3 → Doc 6 |
| DFM/ADX | Trading hours | 10:00–14:45 continuous; closing auction to 15:00 GST; Mon–Fri | — | S30, S31 | E3 |
| DFM/ADX | Daily price limit | +15% / −10% (ADX pauses at −5%, −9%) | — | S30, S31 | E3 |
| DFM/ADX | Settlement | T+2 | — | S30, S31 | E3 |
| DFM/ADX | Foreign ownership | company-specific within 15–100%; real-time FOL data on DFM | — | S30, S31 | E3 |
| DFM/ADX | Tick sizes | AED 0.001 (<1) … 0.10 (≥100) | — | S30, S31 | E3 |
| UAE | Taxes on listed securities | none (WHT/CGT/dividend) | — | S30, S31 | E3 → Doc 6 |
| US | Filing data | EDGAR XBRL APIs, no key | — | S19 | E2 |
| Nigeria | MPR / corridor / CRR | 23.0% / +50,−300 bp / 45% & 16% | 2026-09-22 | S10 | E2 |
| Nigeria | Official FX | NFEM volume-weighted average (CBN daily) | — | S11 | E2 |
| Nigeria | CAR minimum | 15% (international, D-SIB) / 10% | 2021-09 guidelines | S52 | E2 |
| Nigeria | Bank minimum capital | N500bn / N200bn / N50bn (commercial by licence) | 2026-03-31 deadline | S32 | E3 |
| Nigeria | Pension equity limits | Fund II 33%; Fund I 35%; Fund III 15%; VI-Active 33% | 2026-02-09 | S12 | E2 |

Every rule has a `next_check` of at most 90 days; rules that fail a check are marked `unconfirmed` and the user interface shows the last confirmed date.

### 4.6 Fixed income

| Segment | Primary data | Analytics (all reproducible from stored inputs) | Nigeria/UAE specifics |
|---|---|---|---|
| FGN bonds and T-bills | DMO auction results and circulars; FMDQ closing prices/yields; NGX for retail bond trades (F16) | Yield to maturity, modified duration, convexity, real yield = (1+y)/(1+π_expected) − 1 under stated inflation scenarios; holding-period return under rate scenarios | No inflation-linked instruments: real-yield analysis is scenario-based; auction minimum N50,001,000 means retail access is via secondary market, FGN Savings Bonds or funds; DMO states FGN securities' interest is tax-exempt (confirm with Doc 6) |
| FGN Eurobonds | DMO closing prices; dealer quotes (Doc 5c) | USD yield, spread to US Treasuries, duration | Sovereign rating B3 (July 2026 Damodaran sheet) — store rating with date |
| UAE T-Bonds/T-Sukuk, corporate sukuk | MoF auction calendar; Nasdaq Dubai/ADX listings (Doc 5c) | Yield, profit-rate equivalents, duration; sukuk structure notes (asset-based vs asset-backed) | Dirham peg means USD rate scenarios drive AED yields; retail/fractional access reported (F17) |
| US Treasuries | Official curve (Doc 5c) | Standard | The USD leg of the user's liabilities anchors the risk-free rate |
| Credit (Nigerian commercial paper, corporate bonds) | FMDQ quotations | Spread, issuer analysis via §4.2/4.3 | Thin liquidity; rating agency coverage uneven |

"Inflation-linked thinking" in Nigeria: because no linker exists, the system expresses every NGN fixed-income holding as a *real-return band* under the house inflation scenarios (§4.8) and shows the break-even inflation at which the real return turns negative. This is arithmetic, not forecasting.

### 4.7 Funds

| Fund type | Data | What the research layer checks | Access and cost notes |
|---|---|---|---|
| Nigerian mutual funds (SEC-registered CIS) | SEC monthly/weekly NAV reports [S18, S39] | NAV trail, fees from prospectus, holdings concentration, currency (dollar funds), redemption terms | Dominated by money-market funds (68% of NAV, F18); equity funds are 2.4% — small and often illiquid |
| NGX ETFs | NGX quotes; fund fact sheets (Doc 5c) | Premium/discount to NAV, tracking difference, market-maker presence | Industry ETF NAV about N33bn (F18): low liquidity; large bid–ask spreads likely |
| UAE funds and ETFs | SCA/DFM/ADX (Doc 5c) | Same | Shari'a-compliant options via DFM classification [S22] |
| US ETFs | Issuer sites, SEC filings | Expense ratio, index methodology, domicile (tax: US-domiciled vs UCITS, estate-tax exposure for non-residents — Doc 6) | Access route from Nigeria/UAE (international broker vs local digital sub-broker) and custody chain are unknown — Doc 5c/Legal to establish |

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

**What the product may say about returns.** It may show: historical ranges; the arithmetic of required saving under several assumed net returns; the valuation level relative to history with the dispersion of subsequent outcomes. It may not show: a single expected return; "will"; "on track to reach" without the assumption stated in the same sentence.

### 4.9 From security to the individual: circumstances as explicit inputs

The institutional analogue of "individual financial circumstances" is the investment policy statement. Portfolio OS captures the equivalent as a structured input record *before* research begins, and the record drives an **admissible-universe filter** that decides which securities are even analysed.

**Input schema (System A supplies; founder confirms — none may be assumed):**

| Field | Example values | Status in brief |
|---|---|---|
| Tax residency and citizenship | Nigeria / UAE / other; dual | Unknown — founder to confirm (Doc 6) |
| Income currency, source, stability, sector | NGN salary from a bank; AED consulting; USD dividends | Unknown |
| Liabilities by currency and date | AED rent (annual, 12-month horizon), NGN school fees, USD tuition in 2031 | Unknown |
| Goals by currency, amount, date, priority | "USD 100,000 by 2031, essential" | Example in brief |
| Liquidity need | Months of expenses to hold in cash by currency | To be set |
| Horizon per goal | 1, 5, 20 years | Per goal |
| Loss tolerance per goal (not a single risk score) | "Rent bucket: no drawdown"; "Aspirational: can lose 50%" | Behavioural team to design elicitation |
| Human capital | Present value and currency of future earnings; correlation with sectors (bank employee → bank stocks) | Unknown |
| Access constraints | Brokerage accounts available in each market; custody; FX repatriation ability | Unknown |
| Existing concentrations | Employer stock, property, family business | Unknown |

**Admissible-universe rules (initial, E4/E5 — to be tuned):**

1. *Currency matching (Sharpe & Tint; Chhabra safety bucket):* liabilities due within 24 months are funded in their own currency with instruments of matching duration; NGN assets are not admissible for AED/USD liabilities inside that window because NFEM convertibility is itself a risk (F7, F15).
2. *Liquidity:* a security is admissible only if the intended position is ≤ 5% of its average daily traded value over 60 days (×20 cover) and it meets the exchange's free-float rule (F5); NGX names that have not changed price in 20 sessions (Group C volume thresholds, F3) are flagged "price stale by rule".
3. *Concentration:* no single issuer above 5% of liquid net worth, no single sector above 25%, no single country equity market above a cap set by the goal structure (home-bias evidence, F26) — with employer/sector exposure counted through human capital (F25).
4. *Horizon:* equities are admissible only for goals ≥ 5 years; single stocks only for the aspirational bucket.
5. *Data quality:* a security without V2-validated price, shares, statements and dividend record is not admissible for valuation, whatever its merits.
6. *Tax and access:* instruments the user cannot legally buy, or whose tax treatment is unknown for the user's residency, are "not yet admissible" rather than silently included.
7. *Shari'a preference (if stated):* DFM classification list or stated screen applied as a hard filter.

Worked example 3 (§4.11) shows how these rules shrink the universe for a synthetic household.

### 4.10 Research-quality and data-quality framework

**Figure provenance model.** Every number that can reach the user is an object:

```
figure {
  value, unit, currency, scale (e.g. NGN millions), as_of_date, period (e.g. FY2025, Q2-2026),
  source_type (filing | exchange_release | regulator | vendor | derived),
  source_ref (document id, URL, page/table/XBRL tag), retrieved_at,
  validation_status (V0 unvalidated | V1 single source | V2 two sources reconciled | V3 reconciled to filing page),
  freshness_status (fresh | ageing | stale | expired), formula_ref (for derived figures), reviewer, review_date
}
```

**Inputs that must be independently validated before any conclusion (minimum V2):** last price and its trade date; shares outstanding (and any bonus/rights adjustments); earnings per share (reported and computed from net income / weighted shares); operating cash flow and capex; dividends (declared, ex/closure-of-register date, payment date, withholding); corporate actions (bonus, rights, splits, delistings, suspensions); FX rate used (NFEM official vs other); period end and filing date; licence category and regulatory thresholds for banks; index membership if used for comparison.

**Freshness tolerances (E5 — to be tested against observed update patterns):**

| Data type | Expected cadence | "Ageing" after | "Stale" (shown with warning) after | "Expired" (blocked from valuation) after |
|---|---|---|---|---|
| Exchange closing price (NGX, DFM, ADX, US) | Daily | next trading day | 2 trading days | 5 trading days |
| NFEM / FX fixings | Daily | 1 business day | 2 business days | 5 business days |
| Interim financial statements | Quarterly | 45 days after period end | 120 days | next period published |
| Audited annual statements | Annual | 120 days after year end | 270 days | next annual |
| Shares outstanding | On corporate action | at any corporate action | 30 days after an unprocessed action | — |
| Dividend record | Per declaration | at declaration | after closure of register if unconfirmed | — |
| MPR / policy rates | Per MPC meeting (about every 2 months) | day after a scheduled meeting | 7 days after a meeting with no update | — |
| CPI | Monthly | 45 days | 75 days | — |
| Country risk premium edition | Semi-annual (Jan/Jul) | 7 months | 13 months | — |
| Market rules | On change | 90 days since last check | 180 days | — |

**Stale-figure detection and display.** Freshness is computed from `as_of_date` against the tolerance table, and additionally from *market events* (a price that has not changed while the index moved; a statement older than the latest filing announced on the exchange; an MPR unchanged across a scheduled MPC date). Display rule: a stale figure is rendered with its as-of date and a visible marker and is excluded from any computed value; a derived figure inherits the worst freshness of its inputs. The repository's hard-coded MPR of 27.50% would have shown as "expired" since February 2026 (F13).

**Reviewer sign-off workflow.** Analyst (prepares note; writes invalidation conditions) → Quant check (recomputes every derived figure from stored inputs; checks units, currency consistency, real/nominal consistency, formula versions) → Independent data-quality check (confirms every mandatory input at V2+, freshness, corporate actions applied, rule registry values current) → Publication. Each stage records who/what signed and when; a note cannot be published with an open check. For the Personal MVP, the quant and data-quality checks are automated tests plus a mandatory human confirmation screen.

**What must never be automated into a recommendation:** buy/sell/hold ratings; target prices; expected-return point estimates; tax positions; leverage or margin; order placement; any statement derived from inputs below V2; any figure produced by a language model rather than by a tool (System H restates computed values only, as text generated from the figure objects).

**Permitted language.** "Research view", "range", "scenario", "consistent with", "we could not establish", "as of <date> per <source>", "the price implies". Not permitted: "will", "guaranteed", "expected return of X%", "buy", "sell", "on track" (without the assumption in the same sentence), any figure without an as-of date. This is research and analysis, not investment advice; a regulated adviser must review before anything is relied upon or offered to third parties (brief §5.5).

### 4.11 Worked examples (ALL NUMBERS SYNTHETIC)

#### Example 1 — Research note template completed for hypothetical NGX "Bank X"

**Header.** Bank X Plc (NGX: synthetic ticker BNKX) · Note type: initiation · As-of: 2026-11-04 · Analyst: role A · Quant check: passed 2026-11-04 · Data-quality check: passed 2026-11-04 (all inputs V2+) · Status: current · Expiry: 2026-12-31 or on any invalidation trigger.

**Provenance table (every number carries its origin).**

| Field | Value | Unit/currency/scale | Period / as-of | Source ref | Validation |
|---|---|---|---|---|---|
| Last price | 60.00 | NGN per share | close 2026-11-03 | Exchange daily price list (synthetic), row BNKX | V2 (two feeds agree) |
| Shares outstanding | 30.0 | billion shares | 2026-06-30 | FY2025 annual report p. 112; H1-2026 interim note 24; no corporate action since | V3 |
| Profit after tax | 400 | NGN billion | FY2025 | Annual report p. 48, income statement | V3 |
| of which FX revaluation gains (pre-tax) | 110 | NGN billion | FY2025 | Note 9 | V3 |
| Average equity | 1,430 | NGN billion | FY2025 | Statement of changes in equity p. 52 | V3 (computed; formula stored) |
| Book value per share | 50.00 | NGN | 2025-12-31 | Derived: equity 1,500bn / 30bn shares | V3 |
| Dividend per share (final + interim) | 4.00 | NGN | FY2025; closure of register 2026-03-20; paid 2026-04-10 | Exchange corporate-action release (synthetic) | V2 |
| Gross loans / Stage 3 loans | 3,000 / 150 | NGN billion | 2026-06-30 | Interim note 18 (IFRS 9 staging table) | V3 |
| Stage 3 ECL allowance | 120 | NGN billion | 2026-06-30 | Note 18 | V3 |
| CAR (reported) | 22.0% | % | 2026-06-30 | Interim p. 7 | V2 |
| Licence / qualifying capital | International / 520 | NGN billion (paid-up + premium) | 2026-06-30 | Note 30 vs CBN threshold N500bn [S32] | V2 |
| MPR used in rate scenarios | 23.0% | % | 2026-09-22 | CBN MPC decisions [S10] | V2 |
| Country risk premium edition | 12.24% total ERP, B3 | % (USD) | 2026-07-01 | Damodaran July 2026 sheet [S27] | V1 (single source by nature) |

**Derived metrics (formulas stored).** EPS 13.33 NGN; P/E 4.5×; P/B 1.20×; dividend yield 6.7%; payout 30%; ROE 28.0% reported, about 20% excluding FX revaluation gains (normalised); Stage 3 ratio 5.0% (at the 5% prudential reference, F12); Stage 3 coverage 80%; CAR 22% versus a 15% minimum (international licence); qualifying capital N520bn versus N500bn threshold (compliant, 4% headroom).

**Quality checks.** Earnings-cash gap: flagged — 27.5% of PBT came from FX revaluation (non-recurring in a stable-NGN scenario). Accruals: not applicable (bank). Related-party and government exposure: within limits per note 31 (synthetic). Dividend restriction test: NPL ≤ 5% and CAR above minimum → no regulatory payout cap under the reported rule (E3).

**Valuation ranges (justified P/B = (ROE − g)/(k_e − g); g = 12% nominal NGN).**

| Cost of equity (NGN) | 23% | 26% | 30% |
|---|---|---|---|
| Reported ROE 28% → P/B; value/share | 1.45×; **72.7** | 1.14×; **57.1** | 0.89×; **44.4** |
| Normalised ROE 20% → P/B; value/share | 0.73×; **36.4** | 0.57×; **28.6** | 0.44×; **22.2** |
| Dividend model (DPS 4.00 growing 12%) | 40.7 | 32.0 | 24.9 |

Cost-of-equity span (23–30%) comes from the two routes in §4.4 (USD route 27–31% at 12–15% inflation; NGN route about 24.5%). Market price 60 sits inside the reported-ROE range and above the normalised-ROE range. **Research view (permitted language):** the price is consistent with the market expecting FX-driven earnings to persist; it is not consistent with normalised earnings at any cost of equity in the grid. The note does not issue a rating.

**Thesis (one paragraph).** Bank X is well capitalised post-recapitalisation and provisioned at the prudential boundary; its valuation depends almost entirely on whether 2025-level FX gains recur. The research question for monitoring is earnings mix, not growth.

**Invalidation conditions (each mapped to a monitored field).** (1) Stage 3 ratio > 7.5% for two consecutive quarters (note 18). (2) Stage 3 coverage < 60%. (3) CAR < 17% (15% minimum + 2 pp buffer) or qualifying capital falls below N500bn after any capital action. (4) Dividend omitted or payout cap imposed (exchange release / CBN rule). (5) FX revaluation gains > 40% of PBT in FY2026 (note 9) — which would raise, not lower, the quality concern. (6) Any input falls to "expired" freshness — the note itself becomes stale.

**Disclosures.** Synthetic example; no position; data as of dates above; methodology §4.3–4.4; country risk edition July 2026.

#### Example 2 — Short note on hypothetical US "Company Y"

**Header.** Company Y Inc. (synthetic) · Note type: update · As-of: 2026-11-04 · Data: SEC EDGAR companyfacts JSON for the synthetic CIK; fields `us-gaap:NetCashProvidedByUsedInOperatingActivities`, `us-gaap:PaymentsToAcquirePropertyPlantAndEquipment`, `dei:EntityCommonStockSharesOutstanding`, each stored with `accn`, `fy`, `fp`, `form`, `filed` values [S19] · Validation V3 (API fact reconciled to the 10-K page).

**Inputs.** Free cash flow USD 1,200m (FY2025, 10-K); net cash USD 2,000m; shares 500m; five-year FCF growth 6% (analyst assumption, stated); terminal growth 2–3%; WACC 8.5–10.0% (build-up from a 4.2% risk-free rate, mature-market ERP 4.20% per July 2026 edition, β and capital-structure assumptions stored).

**Quality flags.** Piotroski F-score 7/9 (computed from XBRL facts; components shown); Beneish M-score −2.4 (below −1.78 threshold: no manipulation flag); accruals ratio −2% of assets (cash-backed earnings). These are descriptive flags (F19).

**Valuation grid (equity value per share, USD).**

| | g = 2% | g = 3% |
|---|---|---|
| WACC 8.5% | 48.7 | 55.2 |
| WACC 9.5% | 42.6 | 47.2 |
| WACC 10.0% | 40.2 | 44.1 |

Research view: value range USD 40–55 against a synthetic price of 52; the price implies a WACC near 8.5–9% with 3% terminal growth. Invalidation: FCF conversion (FCF/net income) below 70% for two years; net cash turning to net debt without acquisition disclosure; any restatement (8-K Item 4.02).

#### Example 3 — Goals-based allocation sketch for a hypothetical individual

**Circumstances (synthetic).** Net income NGN 60m per year (about USD 45,000 at a synthetic 1,330 NGN/USD), employed by a Nigerian bank; rent AED 120,000 per year (USD 32,675 at the 3.6725 peg), paid quarterly; goal: USD 100,000 in five years, priority "essential"; existing assets: NGN 25m savings, AED 40,000 deposits, USD 15,000; no debt; residency and tax status unconfirmed (flagged); access: NGX and FGN via a Nigerian broker, DFM/ADX via a UAE broker with a NIN, US ETFs via an international broker (access unverified).

**Step 1 — liabilities and buckets (Chhabra/Sharpe–Tint logic).**

| Bucket | Purpose | Currency | Horizon | Admissible instruments | Not admissible (reason) |
|---|---|---|---|---|---|
| Safety | 6 months of expenses | AED and NGN split by spending | 0–12 months | AED deposits; NGN money-market funds / T-bills | Equities (horizon); NGN assets for AED rent (currency, convertibility F7/F15) |
| Rent reserve | Next 12 months of rent | AED | ≤ 12 months | AED deposits; short UAE T-Sukuk/T-Bonds if retail access confirmed (F17) | NGN instruments; DFM equities (volatility, +15/−10% limits) |
| USD goal | USD 100,000 in 5 years | USD | 5 years | USD T-bills/short Treasuries; broad US ETFs only if the household accepts drawdown risk on an essential goal; FGN Eurobonds only in a small slice (B3 sovereign) | NGN equities (currency mismatch for a USD goal); single stocks (concentration) |
| Aspirational | Surplus after the above | Any | > 5 years | NGX large caps passing liquidity and data-quality gates; DFM/ADX names within FOL and Shari'a preference if any; US ETFs | Bank stocks beyond 0% — employer sector (human capital correlation, F25); Group C NGX names with stale prices |

**Step 2 — the goal arithmetic (no forecast).** Starting from USD 15,000, reaching USD 100,000 in five years requires annual saving of about USD 17,000 at 0% net return, 16,000 at 2%, 15,100 at 4% and 14,200 at 6%. Required saving is 31–38% of the household's USD-equivalent income, before rent (which alone is about 72% of income at the synthetic FX rate). The Goal Reality Engine's honest output is therefore "not feasible on current income unless income rises, the goal date moves, or the amount falls" — and the choice of return assumption changes the required saving by less than 20%, which is the point: the return assumption is not the lever.

**Step 3 — how circumstances changed the admissible universe (synthetic counts).** Starting universe: about 150 NGX equities, about 130 DFM/ADX equities, several thousand US instruments. After liquidity and free-float filters: about 40 NGX names. After the data-quality gate (V2 price, shares, statements, dividend record): about 25. After the human-capital rule (employer sector excluded) and the 5% issuer cap: about 18 names, each capped at 5% of liquid net worth. For the USD goal, no NGX name is admissible at all. For the rent reserve, nothing outside AED is admissible. The research team therefore analyses 18 Nigerian names, not 150, and the bank note in Example 1 would be produced for information, not for this household's portfolio.

**Step 4 — what is flagged for confirmation.** Tax residency (Doc 6); whether NGN can be converted and remitted when needed (constraint, not assumption); actual brokerage access; loss tolerance per bucket (behavioural team elicitation, System B).

## 5. Alternatives considered and rejected

| Alternative | Why rejected (for now) |
|---|---|
| Broad coverage from day one (all NGX, DFM, ADX and US names via vendor feeds) | The founder's earlier failure was breadth without provenance. Vendor feeds for NGX have no corporate-action or rule metadata (brief §1.3). Narrow validated coverage first. |
| Factor/quant screens as the primary research method | US evidence is strong (F19) but local replication is absent and NGX microstructure (volume thresholds, stale prices) breaks the price inputs that screens rely on. Screens become flags until Doc 5b backtests. |
| Single "fair value" per security | Anchoring risk for an individual user (System B) and false precision; institutional practice is a range with drivers. |
| Macro regime overlay driving allocation | Out-of-sample evidence for macro timing is weak (F21–F22); a single individual has no risk budget for model error. Macro sets constraints and scenarios instead. |
| Letting the language model compute or restate figures from prompts | Exactly the leakage path identified in the repo (brief §1.4). The model narrates figure objects produced by tools. |
| Using the FGN yield alone as the NGN risk-free rate | Embeds sovereign default risk and unobservable inflation expectations; must be reconciled with the USD route (§4.4). |
| A single risk-tolerance score for the whole household | Goals have different loss tolerances and currencies; bucketed tolerances are better supported (F24). |
| Ignoring UAE Shari'a classification | A stated preference is a hard constraint; DFM publishes a list, so it is cheap to respect. |
| Hard-coding market rules in application code | The repo's stale MPR shows the failure mode; a versioned registry with check dates is required (§4.5). |

## 6. Cross-department dependencies

**We need from Doc 5c (Data sources):** official or licensed feeds with provenance metadata for NGX prices and corporate actions, CSCS/registrar dividend data, CBN NFEM and MPC releases, DMO/FMDQ bond data, SEC Nigeria NAV files, DFM/ADX prices, FOL and Shari'a lists, EDGAR; confirmation of the DFM/ADX rulebook values in §4.5 (our values are broker-sourced, E3); NGX index methodology and corporate-action rules; the current SCA accounting rule for DFM; CBUAE peg documentation; a maintained market-rule registry with `checked_on` dates; brokerage/custody access routes from Nigeria and the UAE.

**We need from Doc 5b (Quantitative models):** backtests of F-score, M-score, accruals and Z'' on NGX and DFM/ADX data with microstructure-aware returns (volume-threshold price staleness); the discount-rate reconciliation procedure of §4.4 implemented and tested; liquidity metrics (ADV, free-float-adjusted) for the admissible-universe filter; scenario generation for inflation and FX paths; a review of the repository Monte Carlo engine before it feeds the goal arithmetic.

**We need from Doc 6 (Tax):** per-instrument, per-jurisdiction tax parameters (dividend withholding and finality, interest on FGN securities, gains on shares and exemption thresholds, UAE treatment, US withholding on dividends for non-residents and estate-tax exposure of US-domiciled ETFs); residency determination inputs.

**We need from System A (Ledger):** holdings, cost basis, currency positions, cash-flow forecasts and liabilities in the schema of §4.9. **From System B (Behavioural):** elicitation of per-goal loss tolerance; display rules for ranges that limit anchoring; evidence on how users react to stale-figure markers. **From System H (AI):** a strict contract that text is generated only from figure objects, with citations to `source_ref`. **From Legal/Compliance:** confirmation that research-only language and personal use fall outside SEC Nigeria and SCA advisory licensing; what changes at commercialisation (System I).

**What they need from us:** this framework's gates and schema (§4.1, §4.10); the metric definitions of §4.3; the note template (§4.11); the permitted-language rules; the list of inputs requiring V2 validation.

## 7. Risks, open uncertainties and disagreements

**Open uncertainties (unverified or unknown).** (1) Final outcome of the CBN recapitalisation after 31 March 2026 and the status of banks that fell short. (2) Whether NGX's ±10% band and the 2018 pricing groups are exactly as currently applied, and when the postponed 2026 revision takes effect. (3) DFM/ADX rules verified only via broker pages. (4) Current UAE accounting-standard rule for DFM issuers (2016 profile). (5) CBUAE peg statement (page blocked). (6) Nigeria Tax Act 2025 treatment of gains on shares and dividend withholding (Doc 6). (7) Access routes and custody for US instruments from Nigeria/UAE. (8) Whether local data will ever support V2 validation for mid-cap NGX names at acceptable cost. (9) Founder's residency, income structure and goals — all inputs, none known.

**Risks.** Rule drift (three NGX changes in 2026) producing silent errors; FX convertibility risk making NGN valuations irrelevant to AED/USD goals; low free float and volume thresholds making NGX "prices" poor value signals; survivorship and look-ahead bias in any local backtest; regulatory risk if research language drifts into advice; over-reliance on one practitioner's country-risk estimates.

**Disagreements preserved.**

| Topic | Position A | Position B | Proposed resolution |
|---|---|---|---|
| Macro overlay | Strategist: small rules-based tilts are standard practice and capture regime risk | Risk manager: evidence (F21–F22) does not justify tilts for one household | Macro sets constraints and stress scenarios only; revisit after Doc 5b out-of-sample tests |
| NGN cost of equity | Equity analyst: USD route with country risk premium, then inflation conversion | Economist: NGN route from FGN curve reflects market-implied local pricing | Compute both; publish the span as the discount-rate range; document |
| Showing value numbers to an individual | CIO: ranges with drivers are the honest institutional output | Behavioural lead: any number anchors; show direction and drivers only for retail | MVP shows ranges to the founder; retail display to be tested by System B |
| Quality screens | EM specialist: local accounting and microstructure invalidate US-calibrated screens | Quant: the signals are economically motivated and cheap to compute | Ship as flags with "not locally validated" label; promote only after backtests |
| Home bias | Founder (assumed): familiarity with NGX justifies overweight | Risk manager: human-capital correlation and convertibility argue for a hard cap | Explicit cap in the circumstances record; the user may override with a logged reason |
| Real vs nominal in Nigeria | Fixed-income analyst: real-return bands under scenarios | Equity analyst: nominal models with inflation in growth | One house inflation path per scenario stored as an input used by both |

## 8. Recommendations, ranked

| Rank | Recommendation | Class |
|---|---|---|
| R1 | Provenance-first figure model with validation status and stale-figure display (§4.10) | Personal-MVP must-have |
| R2 | Versioned market-rule registry with effective and checked dates (§4.5) | Personal-MVP must-have |
| R3 | Research-note template with invalidation conditions and value ranges; permitted-language linter (§4.1, §4.11) | Personal-MVP must-have |
| R4 | Circumstances-as-inputs schema and admissible-universe filter (§4.9) | Personal-MVP must-have |
| R5 | NGX bank-analysis module from IFRS filings (§4.3) | Personal-MVP must-have |
| R6 | Macro context panel with as-of dates and scenario inputs, no forecasts (§4.8) | Personal-MVP must-have |
| R7 | Quality screens (F/G/M-score, accruals, Z'') as labelled flags after local backtests | Later |
| R8 | Valuation engine with dual-currency reconciliation (§4.4) | Later |
| R9 | Fixed-income analytics with DMO/FMDQ data and real-return bands (§4.6) | Later |
| R10 | Fund analytics (SEC NAV, ETF premium/discount) and UAE Shari'a classification (§4.7) | Later |
| R11 | Automated ratings, target prices, expected-return forecasts, macro-timing overlays, auto-rebalancing, news/sentiment signals, model-generated figures | Do-not-build (yet) |

**Five-question test for the top items.**

*R1 Provenance-first figure model.* (1) Problem: figures without source or date caused the founder's earlier tracker to mislead. (2) Who: the founder first; later every user who must trust a number. (3) Evidence: BCBS 239 principles (F27); the repo's stale-constant pattern (brief §1). (4) Build/validate: schema plus automated freshness tests; validate by replaying 2026 events (hours change, T+1, MPR cuts) and checking that stale markers appear. (5) Metric: share of displayed figures at V2+; zero figures displayed without as-of date; stale-figure incidents found by users.

*R2 Market-rule registry.* (1) Problem: three NGX rule changes in 2026 (F2–F4). (2) Who: valuation and liquidity logic. (3) Evidence: F2–F6, F9. (4) Build/validate: table with `checked_on`; quarterly verification task; test that no code constant duplicates a registry value. (5) Metric: days between a rule change and registry update; count of unconfirmed rules.

*R3 Research-note template with invalidation.* (1) Problem: conclusions without conditions cannot be audited or retired. (2) Who: the analyst role and the reader. (3) Evidence: CFA Standards V(A)–V(C), Research Objectivity disclosures (F27). (4) Build/validate: template plus linter; validate by checking that every note's invalidation fields map to monitored data. (5) Metric: share of notes with all conditions monitored; time from trigger to note status change.

*R4 Circumstances-as-inputs filter.* (1) Problem: research on securities the user should not hold wastes effort and invites mismatch. (2) Who: the household with NGN/AED/USD obligations. (3) Evidence: F24–F26 (liability hedging, human capital, home bias). (4) Build/validate: schema, rules, synthetic household tests (Example 3). (5) Metric: currency-mismatch exposure within 24-month liabilities (target zero); concentration breaches; universe size reduction documented.

*R5 Bank module.* (1) Problem: NGX is bank-heavy and generic screens fail for banks. (2) Who: any NGX equity research. (3) Evidence: F11–F12 regulatory thresholds; IFRS 9 disclosures. (4) Build/validate: metric definitions with note references; reconcile two banks' published ratios to recomputed values. (5) Metric: reconciliation error under 1 pp on CAR, Stage 3 and NIM.

## 9. Required validation before implementation

1. Confirm NGX current rules from the rulebook: price band, pricing groups and status of the 2026 revision, circuit-breaker times after the hours change, corporate-action timetable (closure of register, ex-date markdown).
2. Confirm DFM and ADX trading rules, FOL mechanics and Shari'a Standard 1 thresholds from official documents; confirm the SCA accounting rule.
3. Confirm the CBN recapitalisation outcome and current list of licence categories per bank; confirm dividend-restriction rules in force.
4. Confirm CBUAE peg documentation and UAE retail access to T-Sukuk/T-Bonds.
5. Doc 6 to confirm Nigerian and UAE tax parameters per instrument and the residency tests.
6. Doc 5b to backtest the quality screens and the discount-rate reconciliation on local data; to review the repository Monte Carlo engine.
7. Doc 5c to prove V2 validation is achievable for an initial universe (NGX banks and ten large caps; FGN securities; five UAE names; a US ETF set) and to measure feed latency against the freshness table.
8. Legal review of permitted language and of the boundary between research and advice in Nigeria and the UAE.
9. Behavioural review (System B) of how ranges and stale markers are displayed.
10. Re-run academic verification for the references marked unverified/partially verified when OpenAlex access is restored; downgrade any claim that fails.

## 10. Sources

All web sources accessed 2026-11-02 and re-checked 2026-11-04 unless noted. "Fetched" means the page or file was read in full or in part in this session; "search summary" means only a search-engine excerpt was seen.

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
- **S10** Central Bank of Nigeria, "Key Decisions of the Monetary Policy Committee" (307th meeting, 21–22 September 2026; earlier 2026 meetings), https://www.cbn.gov.ng/MonetaryPolicy/Decisions.html — fetched.
- **S11** Central Bank of Nigeria, "Exchange Rates — NFEM rate" (volume-weighted average as official rate), https://www.cbn.gov.ng/rates/ExchRateByCurrency.html — fetched (table headers; values load separately).
- **S12** National Pension Commission, "Addendum to the Revised Regulations on Investment of Pension Fund Assets", ref. PenCom/INSP/Surv/2026/187, 9 February 2026, https://www.pencom.gov.ng/wp-content/uploads/2026/03/ADDENDUM-TO-THE-REVISED-REGULATIONS-ON-INVESTMENT-OF-PENSION-FUND-ASSETS.pdf — downloaded and read.
- **S13** National Bureau of Statistics, "Highlights of Consumer Price Index (CPI) Rebasing", February 2025, https://microdata.nigerianstat.gov.ng/index.php/catalog/154/download/1156/Highlights%20of%20CPI%20Rebasing%20Result.pdf — downloaded and read.
- **S14** IFRS Foundation, "IFRS Accounting Standards jurisdiction profile: Nigeria" (last updated 16 June 2016), https://www.ifrs.org/use-around-the-world/use-of-ifrs-standards-by-jurisdiction/view-jurisdiction/nigeria/ and PDF profile — fetched and downloaded.
- **S15** IFRS Foundation, "IFRS Accounting Standards jurisdiction profile: United Arab Emirates" (last updated 16 June 2016), https://www.ifrs.org/use-around-the-world/use-of-ifrs-standards-by-jurisdiction/view-jurisdiction/united-arab-emirates/ and PDF profile — fetched and downloaded.
- **S16** Debt Management Office Nigeria, "FGN Bonds" (instruments, monthly auctions, minimum subscription, trading venues, tax statements), https://www.dmo.gov.ng/fgn-bonds — fetched.
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
- **S27** Damodaran, A., "ctrypremJuly26.xlsx" (date of update 1 July 2026; default spreads corrected 9 July 2026), https://pages.stern.nyu.edu/~adamodar/pc/datasets/ctrypremJuly26.xlsx — downloaded and parsed.
- **S28** MSCI Inc., "Conclusions of the Consultation on the Potential Market Reclassification for the MSCI Nigeria Indexes", press release, 28 September 2016, https://www.msci.com/documents/10199/e927eee0-d481-45b9-8a7c-6b216e584eb5 — downloaded and read.
- **S29** S&P Dow Jones Indices, Shariah indices methodology announcement (4 August 2023) and practice essentials on Shariah-compliant indexing, https://spglobal.com/spdji/en/documents/indexnews/announcements/20230804-1465479/1465479_spshariahindices-8-4-2023.pdf — search summary only.
- **S52** Central Bank of Nigeria, "Guidelines on Regulatory Capital", September 2021 (minimum CAR 15% for international authorisation and D-SIBs; 10% others), https://www.cbn.gov.ng/Out/2021/BSD/1.%20GUIDELINES%20ON%20REGULATORY%20CAPITAL.pdf — downloaded and read in part.

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
- **S46** ThisDay, "After FTSE Russell downgrade, MSCI moves to reclassify Nigerian stock market", 28 October 2023, and Stears/Nairametrics coverage of MSCI's Standalone reclassification effective February 2024 — search summaries only.
- **S47** Bamboo (learn.investbamboo.com), guide to dividend withholding tax (10%, final for individuals) under the 2025 Act — search summary only; to be confirmed by Doc 6.
- **S48** ICIR, "Nigeria inflation drops to 24.48% in January following rebasing" (February 2025); BusinessDay and AllAfrica (January 2026) on the CPI reference-period revision — search summaries only.
- **S49** Aletihad / Zawya, "ADX supports market efficiency and liquidity with removal of price limits on ETFs and futures" (effective 3 August 2026) — search summary only.
- **S50** Arabian Business / Gulf News, reports on the UAE fractional and retail T-Sukuk initiatives (from AED 4,000), 2025–2026 — search summaries only.
- **S53** Nairametrics / Mondaq, reports on the CBN 2018 circular restricting dividend payments by NPL ratio and CAR — search summaries only.

### Academic references (checked against OpenAlex by DOI with the hosted reference-lookup tool)

- **S60** Sloan, R. G. (1996). Do stock prices fully reflect information in accruals and cash flows about future earnings? *The Accounting Review*, 71(3), 289–315. **[unverified by tool — title lookups timed out / HTTP 429]**
- **S61** Dechow, P., Ge, W., & Schrand, C. (2010). Understanding earnings quality. *Journal of Accounting and Economics*, 50(2–3), 344–401. doi:10.1016/j.jacceco.2010.09.001 **[verified]**
- **S62** Piotroski, J. D. (2000). Value investing: The use of historical financial statement information to separate winners from losers. *Journal of Accounting Research*, 38 (Suppl.), 1–41. doi:10.2307/2672906 **[verified]**
- **S63** Mohanram, P. S. (2005). Separating winners from losers among low book-to-market stocks using financial statement analysis. *Review of Accounting Studies*, 10, 133–170. doi:10.1007/s11142-005-1526-4 **[verified]**
- **S64** Beneish, M. D. (1999). The detection of earnings manipulation. *Financial Analysts Journal*, 55(5), 24–36. doi:10.2469/faj.v55.n5.2296 **[verified]**
- **S65** Beneish, M. D., Lee, C. M. C., & Nichols, D. C. (2013). Earnings manipulation and expected returns. *Financial Analysts Journal*, 69(2), 57–82. doi:10.2469/faj.v69.n2.1 **[verified]**
- **S66** Hou, K., Xue, C., & Zhang, L. (2020). Replicating anomalies. *Review of Financial Studies*, 33(5), 2019–2133. doi:10.1093/rfs/hhy131 **[unverified by tool — timed out three times]**
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
- **S83** Bekaert, G., & Harvey, C. R. (1995). Time-varying world market integration. *Journal of Finance*, 50(2), 403–444. doi:10.1111/j.1540-6261.1995.tb04790.x **[unverified by tool — timed out]**
- **S84** Chhabra, A. B. (2005). Beyond Markowitz: A comprehensive wealth allocation framework for individual investors. *Journal of Wealth Management*, 7(4), 8–34. doi:10.3905/jwm.2005.470606 **[partially verified — DOI resolves to "Beyond Markowitz"; full check blocked by HTTP 429]**
- **S85** Nevins, D. (2004). Goals-based investing: Integrating traditional and behavioral finance. *Journal of Wealth Management*, 6(4), 8–23. doi:10.3905/jwm.2004.391053 **[partially verified — DOI resolves to "Goals-Based Investing"; full check blocked by HTTP 429]**
- **S86** Shefrin, H., & Statman, M. (2000). Behavioral portfolio theory. *Journal of Financial and Quantitative Analysis*, 35(2), 127–151. doi:10.2307/2676187 **[verified]**
- **S87** Das, S., Markowitz, H., Scheid, J., & Statman, M. (2010). Portfolio optimization with mental accounts. *Journal of Financial and Quantitative Analysis*, 45(2), 311–334. doi:10.1017/S0022109010000141 **[verified]**
- **S88** Sharpe, W. F., & Tint, L. G. (1990). Liabilities — a new approach. *Journal of Portfolio Management*, 16(2), 5–10. doi:10.3905/jpm.1990.409248 **[verified]**
- **S89** Markowitz, H. (1952). Portfolio selection. *Journal of Finance*, 7(1), 77–91. doi:10.1111/j.1540-6261.1952.tb01525.x **[verified]**
- **S90** Bodie, Z., Merton, R. C., & Samuelson, W. F. (1992). Labor supply flexibility and portfolio choice in a life cycle model. *Journal of Economic Dynamics and Control*, 16(3–4), 427–449. doi:10.1016/0165-1889(92)90044-F **[verified]**
- **S91** Viceira, L. M. (2001). Optimal portfolio choice for long-horizon investors with nontradable labor income. *Journal of Finance*, 56(2), 433–470. doi:10.1111/0022-1082.00333 **[verified]**
- **S92** Cocco, J. F., Gomes, F. J., & Maenhout, P. J. (2005). Consumption and portfolio choice over the life cycle. *Review of Financial Studies*, 18(2), 491–533. doi:10.1093/rfs/hhi017 **[verified]**
- **S93** French, K. R., & Poterba, J. M. (1991). Investor diversification and international equity markets. *American Economic Review*, 81(2), 222–226. **[unverified by tool — no DOI; title lookup returned HTTP 429]**
- **S94** Coval, J. D., & Moskowitz, T. J. (1999). Home bias at home: Local equity preference in domestic portfolios. *Journal of Finance*, 54(6), 2045–2073. doi:10.1111/0022-1082.00181 **[verified]**
- **S95** Cooper, I., & Kaplanis, E. (1994). Home bias in equity portfolios, inflation hedging, and international capital market equilibrium. *Review of Financial Studies*, 7(1), 45–60. doi:10.1093/rfs/7.1.45 **[verified]**
- **S96** Bessembinder, H. (2018). Do stocks outperform Treasury bills? *Journal of Financial Economics*, 129(3), 440–457. doi:10.1016/j.jfineco.2018.06.004 **[verified]**
- **S97** Statman, M. (1987). How many stocks make a diversified portfolio? *Journal of Financial and Quantitative Analysis*, 22(3), 353–363. doi:10.2307/2330969 **[verified]**
- **S98** Statman, M. (2004). The diversification puzzle. *Financial Analysts Journal*, 60(4), 44–53. doi:10.2469/faj.v60.n4.2636 **[verified]**
- **S99** Gordon, M. J., & Shapiro, E. (1956). Capital equipment analysis: The required rate of profit. *Management Science*, 3(1), 102–110. doi:10.1287/mnsc.3.1.102 **[verified]**
- **S100** Fama, E. F., & French, K. R. (1988). Dividend yields and expected stock returns. *Journal of Financial Economics*, 22(1), 3–25. doi:10.1016/0304-405X(88)90020-7 **[verified]**
- **S101** Novy-Marx, R. (2013). The other side of value: The gross profitability premium. *Journal of Financial Economics*, 108(1), 1–28. doi:10.1016/j.jfineco.2013.01.003 **[verified by DOI and title; OpenAlex author field did not match]**
- **S102** Asness, C. S., Frazzini, A., & Pedersen, L. H. (2019). Quality minus junk. *Review of Accounting Studies*, 24, 34–112. doi:10.1007/s11142-018-9470-2 **[verified]**

*Not cited as evidence because they could not be checked in this session:* Brunel, J. L. P. (2015), *Goals-Based Wealth Management* (Wiley) and Merton, R. C. (2014), "The crisis in retirement planning", *Harvard Business Review* — both are relevant practitioner references for §4.9 and should be verified before being relied upon.

---
*Prepared by the simulated Investment Management and Portfolio Research department. Simulated specialists are not licensed professionals; a regulated financial adviser, accountant and lawyer must review before anything here is relied upon or offered to third parties.*
