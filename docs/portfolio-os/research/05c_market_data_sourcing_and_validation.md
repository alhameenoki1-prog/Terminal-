```
Document: 05c — Market Data Sourcing, Licensing and Validation Framework
Department: Market Data & Data Quality  ·  Lead role(s): financial data engineer; market-data licensing specialist; investment-research operations lead; independent audit / data-quality function
Version: 0.2  ·  Date: 2026-11-04  ·  Status: revised after independent review
Reviewers required: Legal & Compliance (licensing, terms of use, NGX non-display question); Platform Engineering & Security (store, secrets, CI, lint); Investment Research (field requirements, fiscal-year handling, merged freshness table with Doc 5a); Portfolio & Quant Analytics (adjusted series, FX conversion rules, thin-trading beta); Tax Intelligence (which FX rate and CPI vintage is legally required); AI Research & Explanation (adoption of contract C2); Product/UX (C3.4 display states); Finance (budget, V-012)
```

> Conventions: evidence grades E1–E6 and citation rules follow `00_CONTEXT_BRIEF.md` §5. Source numbers in square brackets, e.g. [S9], refer to §10. "Reached" means the page or file was actually opened and the quoted content was read; "search snippet" means only a search-engine excerpt was seen; "not reached" means the fetch failed and nothing on that page is claimed. v0.1 fetches were made on 2026-11-02; v0.2 re-checks were made on 2026-11-04 and say so. Prices are quoted exactly as seen, with the document or page date. All FX conversions use the Frankfurter v2 USD/NGN rate of 1,345.01 and USD/AED of 3.6725 observed on 2026-11-02 [S82] and are illustrative only (at the 2026-11-04 rate of 1,345.46 no monthly figure in §4.6 moves by more than USD 0.05). **Binding contracts:** this document follows `CANONICAL_CONTRACTS.md` [S111] — C2 (figure integrity) and C3 (status vocabulary) in particular. Where an earlier version of this document said something different, the contract governs and the old text has been removed. Every number in §4.4–§4.6 is reproduced by `research/scripts/doc05c_revision_checks.py` (standard library only; `python3 -I`).

---

## 1. Executive summary

**1. Licensed NGX end-of-day data exists, but the price of using it for analytics is unsettled, and nobody sells it corporate-action-adjusted.** NGX's licence makes any processing other than display a separately priced "Non-Display Usage" (EUA cl. 3.1) [S6]. Valuation, risk and AI tools are processing. Recomputed (§4.6), the core NGX feed costs about **USD 26/month** (local basis, no non-display fee), **USD 104** (local, with it), **USD 167** (international, without) or **USD 792** (international, with), before 7.5% VAT. A broader non-display line could raise the last to USD 1,417 [S3]. v0.1's "USD 26–150" omitted the fee. Only NGX, in writing, can say which line applies.

**2. Free NGX routes are display-only or of undocumented licence status, and they copy NGX.** Their agreement with NGX shows faithful copying, not correctness. NGX prices cannot reach `two_independent` corroboration today; they rely on the single-source sampling protocol (C3.3), about 30 minutes a week of founder review with the contracts v0.2 per-series floor (23 minutes before it). Those checks are the founder's own, so they are labelled "self-checked" (C3.3a).

**3. The repository's policy rate was wrong on the day it was written.** `cbRate: 27.50` was committed on 2026-03-02, when CBN's rate was 26.50% and no MPC was due on the typed "next meeting" date [S107, S110]. The Fed rate committed the same day was 75 bp wrong [S114]. v0.1's expiry control would have shown 27.50% as fresh for 30 days. Root cause **R0, wrong at entry**, now leads the control set: no world fact leaves `candidate` until it matches a primary-source snapshot (C3.5).

**4. DFM is not covered in the personal MVP, and UAE equities get exposure but no risk or goal analytics.** No licensed machine-readable route was reachable; DFM holdings are valued from custodian or broker statements. ADX's free Starter tier carries no price history, so neither market's equities meet Doc 5b's data floors (§4.6).

**Contracts.** C2 (figure tokens) and C3 (status axes) are adopted as binding; this document's conflicting versions are removed.

**Biggest uncertainty:** whether NGX licenses a natural person, on which fee basis (set by unconfirmed residency), and whether private analytics is non-display use.

## 2. Scope and method

**Questions addressed.** (A) What sources exist per market, with what access, delay, history, licence and cost? (B) Which data pathologies must the design absorb? (C) What validation and control framework makes stale, wrong or fabricated figures impossible to display unflagged? (D) Why did the repository's figures fail, and which controls address each cause? (E) What data stack is recommended for the personal MVP and for a commercial product, at what cost and under which legal caveats?

**What we read internally.** `00_CONTEXT_BRIEF.md` (v0.2); `CANONICAL_CONTRACTS.md` [S111]; review R05c [S112]; `REVISION_LOG.md` rows V-004, V-010, V-011, V-012; Doc 5a §3 and §4.10 [S113]; `src/services/yahooService.ts`, `yahooHistService.ts`, `fredService.ts`, `internationalYieldsService.ts`, `chatService.ts`, `ratesData.ts`, `mapData.ts`; `src/components/ChatPanel.tsx`, `TransmissionMap.tsx`; `src/data/countryProfiles.ts`, `economicCalendar.ts`; `vite.config.ts` [S93]; `git log` for commit dates [S110].

**What we searched and fetched (v0.1, 2026-11-02).** WebSearch (extended mode) for NGX, FMDQ, NBS, DFM, ADX, CSCS, vendor coverage and pricing; WebFetch of exchange, regulator, central-bank, statistics-office and vendor pages; local text extraction (`pdftotext`) of the NGX Market Data Pricelist (Schedule 3, file created 12 Aug 2026) [S3], the 2018 NSE pricelist [S4], the NGX Market Data Policy v2.0 [S5], the NGX Global Data Licence Agreement for End Users [S6], and the FMDQ 2023 Fees and Dues Framework [S21]. Live API probes: Frankfurter v2 USD/AED and USD/NGN [S82].

**What we re-checked for v0.2 (2026-11-04).** Downloaded again and extracted: NGX Schedule 3 pricelist (§1.2 non-display lines, §1.5 end-user fees, §4.2 API bandwidth, notes 6.2 and 6.4) [S3]; NGX End User Agreement (cl. 3.1, 8.2, 10.7–10.8, glossary) [S6]; FMDQ 2023 fees (end-user tables, API connection, note 9) [S21]; FMDQ NAFEM Spot Rates Methodology (§4, §5.2, §6.1–6.3), which v0.1 had only as a snippet [S22]. Fetched: CBN MPC decisions page [S107]; Federal Reserve open-market page [S114]; NGX API "Get started" [S9]; NGX vendors list [S12]; Kobo Terminal API page [S46]; Frankfurter currencies and providers pages [S82, S109]; Yahoo Terms [S80]; Arabian Post on ADX MCP [S61]; DFM API docs [S57]. Academic references S102–S106 verified with the reference-lookup tool (OpenAlex, by DOI). Every changed fact below names the source and the date checked.

**What we could not access (and therefore do not claim).** adx.ae (HTTP 403, 2026-11-02; R05c reports 403 again on 2026-11-04) [S59, S60]; Central Bank of the UAE (403) [S64]; UAE FCSC (403) [S65]; Financial Modeling Prep pricing (403) [S77]; Nasdaq Data Link (empty / 404) [S79]; FMDQ market-data sub-pages (503) [S26]; NGX Historical Data Policy PDF (redirect loop) [S7]; Twelve Data's XNSA page (404) [S42]; African Markets (401) [S48]; afx.kwayisi.org (503) [S47]; Tribune Online on a January 2026 CPI methodology change (403) [S36]; DFM API docs ("Filenotfound", re-checked 2026-11-04) [S57]; NGX Rulebook provisions on bonus listing timelines, ex-date mechanics and filing deadlines (not fetched; the claims that depend on them are graded E4). The v0.1 search budget was exhausted after 200 calls, so some v0.1 checks rely on fetches only or are marked unknown.

**Not used, per the brief:** the founder's Google Drive and Gmail; no code written under `src/`; no agents spawned.

## 3. Findings

Each finding carries an evidence grade and source numbers. "Date seen" is 2026-11-02 unless stated.

**F1. NGX sells machine-readable data directly, with published annual prices.** The NGX Market Data API portal lists: Index Values NGN 450,000 / USD 7,500; Most Active and Top Gainers/Losers NGN 100,000 / USD 1,000 each; Prices real-time NGN 1,000,000 / USD 12,500, delayed NGN 400,000 / USD 2,500, end-of-day NGN 125,000 / USD 1,000; Stock Quote Data NGN 800,000 / USD 12,500; Historical Dividends NGN 600,000 (all securities) or NGN 250,000 (specific securities); Interday Prices (OHLCV, up to 10 years) NGN 300,000 / USD 1,000; Daily CapNet Report NGN 650,000 / USD 2,500; NGX News and Corporate Actions NGN 650,000 / USD 2,500; Trade Data NGN 100,000 / USD 1,000. "Annual Pricing"; every product routes to "Contact us". Delayed is defined as 30 minutes. *Re-checked 2026-11-04:* prices unchanged; Interday is described as OHLCV history "for specified securities", so its price may scale with the number of holdings; the international Historical Dividends price is labelled "Real Time $3,000 / Delayed $1,000", which does not fit the product. NGX's general data pages [S1, S2] route all products to the same contacts. (E2 — exchange publication) [S9]

**F2. The NGX API is REST/JSON-XML, token-authenticated, poll-based, and its documentation contains errors.** Endpoints include `price/pricesEOD`, `price/interdayprices` (parameters s, f, t), `fundamental/dividends`, `index/indexvalues`, `news/newsRT`, `trade/todaytrades`. The general note says "All data sources are intentionally delayed upto 3 minutes" while the delayed product says 30 minutes; no rate limits, no adjusted-price field and no schema are documented; several sample URLs are malformed. Implication: integration must be test-driven, not documentation-driven, and freshness must be measured. (E2 for the facts; E4 for the implication) [S10]

**F3. NGX licence terms distinguish personal from commercial use and forbid redistribution and scraping.** The End User Agreement defines a "Non-Professional End User" as a natural person using the data "exclusively for his/her private purposes, such as … the management of his/her own private assets", not for third parties, and not redistributing [S6, glossary]. "Delayed Data" is delayed at least 30 minutes; "End of Day Data" relates to the end of the trading day "prior to midnight in Nigeria"; "Non-Display Usage" is defined as "the accessing, processing, consumption or other use of Market Data for purposes other than in support of display or Distribution or Redistribution", and cl. 3.1 says an End User "may not engage in Non-Display Usage … unless the End User has paid to the NGX any applicable Non-Display Usage fees"; cl. 8.2 says such use need not be reported but changes must be notified [S6, re-extracted 2026-11-04]. Valuation, risk metrics, reconciliation, adjusted series and AI tools are processing in this sense (E2 for the text; E4 for its application to private analytics, which only NGX can settle). The Policy requires every website displaying NGX data to state that "web scraping or re-transmission … is prohibited" and that delayed data must be shown as delayed by thirty minutes [S5 §8.2.7–8.2.8]; redistribution via "widgets, API's" requires prior written permission and a licence [S5 §8.2.6]. Fees are paid in naira by "End Users within Nigeria" and in US dollars by end users outside Nigeria; fees exclude VAT and withholding tax [S6 cl. 10.7–10.8]; the pricelist puts VAT at 7.5% (note 6.4) and says Professional and Non-Professional End Users "are subject to the same Fees" (note 6.2) [S3]. The EUA defines an End User as one receiving data from a Distributor, so whether NGX contracts with a natural person directly is open (R05c Q1). NGX has audit rights with 1.5% monthly interest on underpayments [S6 cl. 9]. (E2) 

**F4. NGX fee levels for distribution have risen sharply since 2018, but display and EOD licences remain modest.** Real-time feed redistribution: NGN 1,200,000 (2018) → NGN 40,000,000 (2026 schedule); delayed licence NGN 625,000 → NGN 2,000,000; EOD licence NGN 500,000 → NGN 1,500,000; Website/Mobile delayed display NGN 125,000 → NGN 250,000 (USD 2,500); Website/Mobile EOD display NGN 50,000 → NGN 120,000 (USD 1,000); "Delayed Data for Financial modelling (not limited to Finance & Risk activities)" non-display NGN 1,250,000 (USD 7,500 "professional"); in the same §1.2 non-display table, "Non-Trading Related activities" NGN 2,500,000 (USD 15,000), noted "Payable for all types of Non-Display Usage"; "Real Time Data stored for Historical reference" NGN 3,500,000; API bandwidth bands "for direct connection to The Exchange" from NGN 200,000 (USD 1,000) [S3 §4.2]; End-user Level 1 terminal fee USD 3 → USD 10 local per month (USD 15 global). Which non-display line would apply to a natural person's analytics is not stated (§4.6 shows both). (E2; schedule re-extracted 2026-11-04) [S3, S4]

**F5. NGX historical data goes back to 1996 (EOD) but is priced on application; tick data is limited to three months; students receive 50–80% discounts.** The Historical Data page says corporate actions are notified "via NGX feed" and on the Corporate Disclosures page. (E2) [S8]

**F6. NGX's "Authorized Market Data Vendors" page lists six real-time vendors: Bloomberg, FactSet, GTN Group, ICE Data Services, LSEG and SIX.** Its text reads "Below is the current list of NGX Real-time Market Data Vendors"; it lists no delayed or end-of-day licensees (re-checked 2026-11-04). None of the retail-facing APIs that advertise NGX coverage appears on it, but because the list covers real-time vendors only, their absence does **not** show they are unlicensed. v0.1's "unlicensed" is withdrawn: their licence status is *undocumented*. (E2 for the list; E4 for any inference about other vendors) [S12]

**F7. Retail APIs with NGX coverage exist, with free tiers, but their licensing provenance is undocumented.** EODHD lists 159 XNSA tickers (ETFs mislabelled as Common Stock), personal plans from USD 19.99/month, and discloses it is "not using exchanges data feeds for the pricing data" but aggregates "100+ sources" via VWAP; data "not necessarily real-time nor accurate" [S40, S41]. Mansa API (pan-African) offers NGX quotes, indices, dividends, disclosures parsed from NGX PDFs, "human-verified" fundamentals, free 100 requests/day, Starter USD 20, Pro USD 50, Business USD 200/month; sourcing/licence not stated; its JSE archive is in cents while live quotes are in rand — a documented unit break [S44, S45]. Kobo Terminal (formerly NGX Pulse; the old domain 301-redirects) offers 30-minute delayed NGX data updated every 20 minutes, Personal NGN 0 (100 req/day), Starter NGN 29,000, Professional NGN 75,000 (adds "Commercial use license"), Institutional NGN 350,000 per month, and states "Public endpoint access does not grant commercial redistribution rights; confirm your intended use with us" (v0.1 misquoted this as "public availability…"; the authentication section uses that shorter phrase) [S46, re-checked 2026-11-04]. Kobo labels index history "sourced from official NGX data" and index snapshots "NGX chartdata"; Mansa parses NGX PDFs; a third-party open-source project integrates Mansa for NGX [S94]. These are therefore copies of NGX, not independent observations (F27). (E3 — vendor self-description) 

**F8. CSCS publishes a free daily NGX/NASD price snapshot (open, close, volume, value) but no export, no archive and no data terms; its APIs are account/portfolio services, not market data.** Portfolio View (NGX) subscription NGN 78,400 + 7.5% VAT, effective 1 January 2026; API items listed as NIL in that schedule. The snapshot's update cadence is irregular: 4 trading days old on 2026-11-02, 1 day old on 2026-11-04 (per R05c). Press describes new investor-facing services [S100]. CSCS is NGX's depository, so its prices are NGX prices. (E2) [S17–S20]

**F9. FMDQ data is licensed and priced; NAFEM/NFEM fixing methodology republishes the previous close when data is inadequate.** 2023 framework (VAT-inclusive, "subject to change"): non-member end-user EOD Fixings (Single) NGN 161,250 (USD 322.50) p.a.; Daily Quotations List NGN 322,500 (USD 645); 24-hour delayed single fixing NGN 107,500 (USD 215); API connection, end user, EOD NGN 322,500 (USD 645); NAFEM Data EOD distribution licence NGN 3,359,375 (USD 6,718.75) [S21]. The FMDQ homepage displays bond, T-bill and CP quotations dated 30 Oct 2026 and NITTY/NIBOR dated 29 Oct 2026 but a blank FX table [S23]; the e-Markets portal requires registration (two-week trial) [S25]. The NAFEM spot methodology (Oct 2023), extracted from the PDF on 2026-11-04 [S22], computes rates as a VWAP; the closing rate follows a waterfall from "Level I – Last ten (10) trades of the current trading day" to "Level IV – Maintain current trading day's Opening Rate" (§5.2); where data is inadequate "the previous day's FMDQ NAFEM Closing Rate shall be published as the Opening and Closing Rates" (§6.1), republished rates "will be identified as such" on the website and e-Markets (§6.2), and after five consecutive business days a Market Review Committee meets (§6.3); FMDQ "will apply expert judgment where necessary" (§4). FMDQ's benchmark-administration page describes the fixings it administers [S24]. The methodology predates CBN's 2024 EFEMS/NFEM changes; whether it is still current was not verified. Also, API end users: "Only Real-Time API is available for Closing Prices" (fees note 9) [S21]. (E2 for fees and the methodology text — upgraded from E3; currency of the 2023 method unverified)

**F10. CBN publishes the official rate as the NFEM volume-weighted average with Excel export; its pages render data client-side.** "NFEM rate is derived at Volume Weighted Average and stands as the official exchange rate for the day"; Export to Excel; no API documented. Money-market, inflation and securities pages follow the same pattern. The Statistics Database (statistics.cbn.gov.ng/shop) describes "Monetary, External, Fiscal and Real" sectors but states no formats or terms. (E2) [S27–S31]

**F11. The CBN Monetary Policy Rate is 23.00% since the 307th MPC (21–22 September 2026: "Reset the Monetary Policy Rate at 23 per cent").** CBN's decisions page (fetched 2026-11-04) gives the full record: 27.50% retained in February, May and July 2025; "Reduce … by 50 basis points to 27.00 per cent" on 22–23 September 2025; retained 24–25 November 2025; "Reduce … by 50 basis points to 26.5 per cent" on 23–24 February 2026; retained 19–20 May and 20–21 July 2026 [S107]. Press adds the corridor (+50/−300 bp) and CRR (45%/16%/75%) [S32]. The page states no next meeting date. The repository's 27.50% was **wrong when entered** (F26), not merely stale. (E2 — central-bank publication; upgraded from E3, matching Doc 5a F13) [S107, S32]

**F12. Nigerian CPI was rebased to 2024 = 100 (weights 2023) from January 2025; headline fell from 34.80% (Dec 2024, old base) to 24.48% (Jan 2025, new base).** September 2026 headline 14.63% y/y (food 19.59%, core 12.95%), released 15 October 2026; the release compares with 20.98% for September 2025, whereas the September 2025 figure originally reported was 18.02%, and VON mentions "newly introduced sub-indices" (re-checked by R05c 2026-11-04). The base year did not change, so the restatement fits the reported **January 2026 methodology / reference-period change** (Doc 5a F14) better than the January 2025 rebasing that v0.1 blamed; that change could not be verified at source (403) [S36]. Coverage of the 2025 rebasing: [S98, S99]. Consequence: series are keyed on `methodology_version`, not base year, and year-on-year changes are computed only within one vintage from index levels (P18). The 18.02% original figure was not independently re-confirmed. (E2 for NBS/VON figures; E3 for press; E5 for the attribution) [S33–S36, S98, S99]

**F13. Nigeria's parallel-market premium is currently small but real and unofficial.** On 2026-11-02 10:09 WAT an aggregator showed black-market USD/NGN 1,382/1,388 against a CBN rate of 1,346.26 (+2.65% / +3.10%) [S39]; Frankfurter v2 returned 1,345.01 for the same date [S82]. The product must label the rate type on every NGN conversion. (E4 — unofficial aggregator; E2 for the Frankfurter observation as data)

**F14. DFM website data is 15-minute delayed, display-only; DFM's developer portal was unreachable; LSEG advertises free 15-minute delayed post-trade DFM data to its clients.** "Data delayed by 15 minutes. Please sign in to view real-time data" [S55]; the market-data-providers page promises a list of authorised distributors and a "DFM Fees List" PDF, neither of which rendered [S54]; api.dfm.ae/docs returned "Filenotfound" [S57]; LSEG's DFM page (search snippet, ~439 days old) mentions "free of charge 15 minutes delayed post-trade data" [S58]. (E2/E3)

**F15. ADX runs an official Model Context Protocol (MCP) server for AI assistants with a free Starter tier.** Per a 14 August 2026 press report: Starter free with 100 tool calls/month including real-time Level 1 for all instruments; paid tiers AED 9.99, 29.99 and 49.99 per month; a Premium tier with 4,000 calls/month; Enterprise custom; access via API keys and entitlements; works with ChatGPT and Claude; data may be "real-time, delayed, or batch-based, depending on licensing" [S61]. adx.ae itself returned 403 to us, so the licence text, storage and redistribution terms are unverified [S59]. ICE lists ADX Level 3 market-by-order data for institutions [S62]. (E3)

**F16. The UAE Securities and Commodities Authority now presents as the Capital Market Authority (sca.gov.ae redirects to uaecma.gov.ae) with an Open Data section (registers, statistics, funds) but no listed-company financial-statement feed on the pages seen.** (E2) [S63]

**F17. US official sources are free and well-specified.** SEC EDGAR submissions/companyfacts/frames APIs update "in real-time as filings are disseminated", bulk ZIPs nightly ~3 a.m. ET, no key, maximum 10 requests/second, declared User-Agent required ("Sample Company Name AdminContact@…") [S67–S69]. FRED requires a key, mandates the notice "This product uses the FRED® API but is not endorsed or certified by the Federal Reserve Bank of St. Louis", and warns that third-party series carry their own terms; ALFRED/`series/vintagedates` provide revision vintages [S70–S72]. Treasury par yield curve: CSV/XML [S73]; Fiscal Data API: "offered free, without restriction" [S74]. (E2)

**F18. US retail vendor pricing seen on 2026-11-02:** Massive (Polygon.io's pricing URL 301-redirects to massive.com): Stocks Advanced USD 199/month real-time, 20+ years, "Individual use only"; Financials & Ratios USD 29/month [S75]. Alpha Vantage: free 25 requests/day; USD 49.99 (75/min) to USD 249.99 (1,200/min) per month; entitlements "for personal use" [S76]. EODHD: Sandbox free 20 calls/day; Historian USD 19.99; Active Trader USD 29.99; Equity Analyst USD 59.99; All-In-One USD 99.99 per month; "Personal use" vs "Commercial / B2B" [S41]. Twelve Data: Basic USD 0 ("Internal non-display usage"), Grow USD 79, Pro USD 229, Ultra USD 999 per month; global equities EOD from Grow; add-ons such as ISINs USD 24,000/year [S43]. Tiingo: Starter USD 0 (1,000 req/day), Power USD 30/month (USD 300/year), business internal use USD 50/month; "Internal use means you may only use the data for your own personal use" [S78]. Financial Modeling Prep and Nasdaq Data Link: not reached. (E3 — vendor pages)

**F19. Yahoo Finance's terms prohibit automated collection and commercial reuse; the finance endpoints used by the prototype are not a published API.** Yahoo Terms of Service: users may not "access or collect data … using any automated means" and may not "access or reuse the Services … for any commercial purpose"; versions dated 15 May 2025 and 2 January 2026 [S80]. R05c saw "Last updated: 1 November 2026" on 2026-11-04; our fetch the same day showed the two dated versions and no "last updated" line in the part read. Either way the quoted clauses are unchanged, and the licence registry must store `terms_version`, `terms_hash` and a re-check date. Yahoo Developer API Terms (REV 3-2022) require removal of retained API data "within 24 hours" unless stated otherwise and do not mention a finance data API at all [S81]. Investing.com similarly prohibits storing, reproducing or distributing its data and discloses that prices "are not necessarily provided by any market or exchange" [S50]. (E2 — published terms)

**F20. Free FX references: the ECB publishes 29 currencies at ~16:00 CET, excluding NGN and AED, "for information purposes only" [S83]; Frankfurter v2 (free, no key, open source) now aggregates 106 central banks and lists NGN (16 providers, from 1999) and AED (54 providers, from 1996) [S82]; its providers page lists the Central Bank of Nigeria (code `CBN`, NGN base, from 2001-12-11) [S109], so a CBN-vs-Frankfurter comparison partly checks CBN against itself (re-checked 2026-11-04); exchangerate.host Free is 100 requests/month non-commercial, paid from USD 14.99 [S84]; Open Exchange Rates Free is 1,000 requests/month USD-base only, Developer USD 12, Enterprise USD 47, Unlimited USD 97 per month, 173 currencies including NGN and AED [S85]. The AED peg (USD/AED 3.6725) was observed via Frankfurter on 2026-11-02 but the Central Bank of the UAE page was unreachable (403), so the peg's official statement is cited as E4 pending verification [S64, S82]. (E2/E3)

**F21. Macro APIs: World Bank Indicators API v2 needs no key but the general terms limit "Materials" to non-commercial use with attribution (dataset-specific terms are separate and were not fetched) [S86, S87]; IMF data is "available through SDMX 2.1 and SDMX 3.0 APIs" with a beta portal account [S88]; NBS offers an Open Data Portal and e-library, no API seen [S33]; UAE Bayanat exposes a GET endpoint per resource GUID, licence not shown [S66]. (E2)

**F22. Claude MCP connectors: Financial Datasets' MCP server (20+ tools: prices, statements, SEC filings, insider trades, macro) is installable from Claude's Connectors Directory per its own docs; its coverage statements are SEC-centric (27,530 stocks; "verified against the underlying SEC filing") with no mention of Nigeria or the UAE [S89, S90]. Distilla offers MCP plugins for Claude/ChatGPT with no stated geographic scope [S91]. The claude.com/connectors page is dynamic (1,050 connectors) and did not render either listing to us [S92]. The only exchange-run MCP server found that covers a market in scope is ADX's (F15). No MCP connector we could verify covers NGX or DFM. (E3)

**F23. The prototype's data layer exhibits the stale-figure anti-patterns directly.** `countryProfiles.ts`: `cbRate: 27.50, nextMeeting: '2026-03-25'`, `yahooBond: '^TNX'` (the CBOE US 10-year index) for Nigeria, `instabilityScore: 72` with no source. `ratesData.ts`: a static central-bank table "accurate as of March 2026". `fredService.ts`: `CPIAUCSL` labelled "US CPI YoY" with unit "%" (it is an index level, 1982–84 = 100) and `GDP` labelled "US GDP Growth %" (it is a level in billions of dollars). `yahooService.ts` calls the v7 quote endpoint and on any failure returns `[]`; `yahooHistService.ts` serves cached closes on error with no age. `ChatPanel.tsx` injects live context into a Groq-hosted Llama prompt whose system text instructs "Cite specific levels and spreads" [S93]. The `Ticker` type carries no as-of timestamp, source or unit. `yahooService.ts` defaults a missing price and change to zero (`q.regularMarketPrice ?? 0`, `q.regularMarketChange ?? 0`), which renders a missing move as 0%. One fact is held twice with different values: ECB 2.65 in `TransmissionMap.tsx` ("Static CB rates (March 2026)") vs 2.50 in `countryProfiles.ts` and `mapData.ts`. `economicCalendar.ts` says "Dates are accurate as of March 2026". (E2 — direct inspection, re-checked 2026-11-04)

**F24. Language models restate and invent financial numbers unless constrained.** FinanceBench (arXiv:2311.11944, verified to exist via the arXiv API) reports that GPT-4-Turbo used with a retrieval system incorrectly answered or refused 81% of its questions in the authors' evaluation [S101]. The exact figure is quoted from the abstract as fetched on 2026-11-02 (see §10 note). It is a 2023 model on a 150-case sample: it supports "constrain the model", not any error rate for current models. (E2 — single study; benchmark-specific)

**F25. Naming drift across the ecosystem is current and material.** NAFEX → NAFEM (2023) → "NFEM" on the CBN page [S22, S28, S96]; SCA → CMA [S63]; Polygon.io → Massive [S75]; NGX Pulse → Kobo Terminal [S46]; TradingView lists the Nigerian exchange as "NSENG" with 30-minute delay, DFM/ADX 15 minutes, "real-time free after sign-up" for display [S51]; EODHD uses the MIC "XNSA" [S40]; the prototype uses Yahoo's `.LG` suffix and `^NGSEINDX` [S93]; ICE fee schedules that mention "NGX" refer to ICE NGX, the Canadian natural-gas exchange, not the Nigerian Exchange [S53]. (E2)

**F26. The repository's policy rates were wrong on the day they were committed.** `git log` shows `src/data/countryProfiles.ts` and `TransmissionMap.tsx` added in commit d9ad9d5 and `src/services/ratesData.ts` in commit 310e0ad, both on 2026-03-02 [S110]. On that date CBN's MPR was 26.50% (from 24 February 2026), not 27.50%; 27.50% had last been true on 22 September 2025, 160 days earlier; and 25 March 2026, the typed "next meeting", was not an MPC date (the next ended 20 May 2026) [S107]. The Fed figure (`rate: 4.25`, `lastChange: '2024-12-18'`, "accurate as of March 2026") was 75 bp above the 3.50% lower bound set on 11 December 2025 [S114]. The values look as if they were written from an old source with a false freshness label. A freshness or expiry control cannot catch this; only a comparison with a primary source at entry can (C3.5). (E2 for the records and dates; E4 for "written from an old source")

**F27. The free NGX and NGN comparators are not independent of the primary.** CSCS is NGX's depository; Kobo labels its data "sourced from official NGX data"; Mansa parses NGX PDFs; EODHD does not disclose its sources [S18, S40, S44, S46]. For USD/NGN, Frankfurter includes CBN among its providers [S109], and FMDQ's closing rate is the VWAP of the last ten trades on the same official market, a different statistic from CBN's day VWAP [S22 §5.2.1]. Agreement among these sources shows faithful copying, not correctness. (E2 for the source statements; E4 for the inference)

## 4. Proposed framework / specification for Portfolio OS

### 4.1 Source catalogue per market

Columns: source · provides · official? · access · delay/freshness · history · licence and redistribution · cost (as seen, date) · reliability notes · verification status. "Checked" dates are 2026-11-02 unless noted. Abbreviations: EOD = end of day; RT = real time; CA = corporate actions; n.p. = not public; PI = personal/internal use; ND = non-display; RD = redistribution.

#### 4.1.1 Nigeria

| # | Source | Provides | Official? | Access | Delay / freshness | History | Licence & RD limits | Cost (as seen) | Reliability notes | Verified |
|---|---|---|---|---|---|---|---|---|---|---|
| N1 | NGX Market Data API v3 [S9, S10] | Prices RT/delayed/EOD, 10-yr OHLCV, dividends, index values/members, gainers/losers, news & CA, trade data, CapNet | Yes (exchange) | REST JSON/XML, token `_t`; subscribe via "Contact us" | RT; delayed 30 min; EOD; "intentionally delayed up to 3 minutes" note | Interday ≤10 yrs | Governed by Global Data Licence Agreement; no RD; ND fee separate; naira for local, USD for international end users [S6] | Annual: EOD prices NGN 125,000 / USD 1,000; Interday NGN 300,000 / USD 1,000; dividends NGN 250,000 (specific) / 600,000 (all); news & CA NGN 650,000 / USD 2,500; index values NGN 450,000 / USD 7,500 (page, 2026-11-02; unchanged 2026-11-04). **Plus non-display** for analytics: NGN 1,250,000 / USD 7,500, or NGN 2,500,000 / USD 15,000 under the general line [S3] (§4.6) | Docs contain malformed samples; no rate limits, no adjusted-price field, no schema published; individual eligibility unconfirmed | Reached; prices quoted verbatim |
| N2 | NGX website Equities Price List [S11] | Prev close, O/H/L/C, change, trades, volume, value | Yes | Web table only | "Prices displayed on this website are delayed by 30 minutes" | Current day | Display only; policy forbids scraping/re-transmission [S5 §8.2.7] | Free to view | Table renders client-side ("Loading data…"); no export | Reached |
| N3 | NGX X-DataPortal [S13] | RT L1/L2 trade floor, EOD statistics, historical equity L1 (generate & download), broker reports | Yes | Web portal, in-portal purchase | RT and historical | "Free access to 7 days Historical Price data" | Portal T&Cs (not read) | "affordable rate"; 2018 list: Equity L1 Historical query engine NGN 45,000 p.a. [S4]; 2026 list not itemised on page | No API; manual downloads | Reached (prices partly) |
| N4 | NGX Historical Data (on request) [S8] | EOD quotes "as far back as 1996"; tick data 3 months | Yes | Request form, e-mail | Batch | 1996– | Internal use vs RD priced separately; RD of EOD historical NGN 1,250,000 / USD 5,000 p.a. [S3] | Price on application; students −50/−80% | Turnaround unknown | Page reached; policy PDF not reached [S7] |
| N5 | NGX corporate disclosures / X-Issuer filings (doclib.ngxgroup.com) [S15, S16, S8] | Audited/unaudited statements, earnings forecasts, CA notices, directors' dealings, delistings [S14] | Yes | Web pages + PDF links; no API/RSS seen | Event-driven; issuers must file via X-Issuer (mandatory since 2022 per press) | Multi-year PDFs | Copyright of issuers/NGX; X-Gen News RD licence NGN 650,000 / USD 7,500 p.a. [S3] | Free to read | PDFs need parsing; delisting list uses mixed date formats ("2008", "7-May-2021", "5/20/2024") [S14] | Delisting page reached; X-Issuer FAQ snippet only |
| N6 | CSCS daily price list [S17, S18] | Symbol, open, close, volume, value for NGX & NASD; bonds/CP/NTB directories | Semi-official (CSD) | Web table | "Market Numbers as of" 27 Oct 2026 seen on 2026-11-02 (i.e. 4 trading days old) | No archive | No data terms shown | Free to view | Copy of NGX (`same_upstream`): a copy-fidelity check for close/volume, not independent; irregular update cadence | Reached |
| N7 | CSCS APIs & portal [S19, S20] | Account creation/validation, Portfolio View (holdings), detachment | Yes (CSD) | API via request form; investor portal | n/a | n/a | Participant agreement | Portfolio View (NGX) NGN 78,400 + VAT subscription, eff. 1 Jan 2026 | Not a price-data source; relevant for System A (holdings reconciliation) | Reached |
| N8 | FMDQ Exchange website & e-Markets [S23, S25] | FGN bond, T-bill, CP quotations; NITTY, NIBOR; FX closing (table blank when seen); bond futures | Yes | Web; e-Markets portal (registration, 2-week trial, Q-Pay) | Homepage quotes dated T-1/T-2; delayed tiers 24 h | Historical via portal/licence | FMDQ T&Cs; RD licences [S21] | Non-member EOD Fixings (Single) NGN 161,250; Daily Quotations List NGN 322,500; API EOD end user NGN 322,500 p.a. (2023 framework, VAT-incl., "subject to change") | Methodology republishes previous close on thin data [S22] | Fees PDF extracted; sub-pages 503 |
| N9 | CBN Data & Statistics [S27–S31] | NFEM official FX (VWAP, high/low/close, turnover), MPR, T-bill, deposit/lending rates, inflation, securities, reserves, crude | Yes (central bank) | Web tables + "Export to Excel"; Statistics Database | Daily (FX), monthly (others) | Long | No terms stated | Free | Tables render client-side; no API; naming NFEM vs NAFEM | Reached (structure); values not rendered |
| N10 | Debt Management Office [S37, S38] | FGN bond auction results (monthly, PDF), issuance calendar, Eurobond daily prices (PDF/spreadsheet), savings bonds, sukuk, debt stock | Yes | PDF/spreadsheet downloads | Monthly / daily | Archive ≥ Apr 2025 visible, ~12 pages | Public documents | Free | PDFs; duplicate entries seen | Reached |
| N11 | National Bureau of Statistics [S33, S34] | CPI (base 2024 = 100), GDP, labour; Open Data Portal, NADA | Yes | Web, PDF/e-library, ODP | Monthly CPI ~15th of following month | Rebased series from Jan 2025 | Public | Free | Back-series revisions observed (Sep-2025: 18.02% → 20.98%) | Reached |
| N12 | SEC Nigeria | Regulatory registers, rules | Yes | Web | — | — | — | Free | Not a market-data source; not fetched this session | Not reached |
| N13 | EOD Historical Data (XNSA) [S40, S41] | EOD prices, dividends/splits (per plan), fundamentals (separate plan) | No; "not using exchanges data feeds" | REST API | EOD; 15-min delayed live on free | 30+ yrs claimed generally; XNSA depth unstated | Personal vs Commercial/B2B plans; licence text not reached | Historian USD 19.99/mo; All-In-One USD 99.99/mo | 159 tickers; ETFs typed as Common Stock; accuracy disclaimer | Reached |
| N14 | Mansa API [S44, S45] | NGX quotes, indices (ASI from 1996), dividends, disclosures, insider trades parsed from PDFs, fundamentals (weekly refresh) | No (not on NGX's real-time vendor list; licence status undocumented) | REST | "30-minute freshness during market hours" | Varies; JSE archive in cents | Terms/Licensing pages not read; Business tier "redistribution-lite" | Free 100 req/day; Starter USD 20; Pro USD 50; Business USD 200/mo | Sourcing not stated; useful filings cross-check | Reached |
| N15 | Kobo Terminal (ex NGX Pulse) [S46] | NGX stocks, fundamentals, dividends, indices/ETFs, bonds, CBN auctions, disclosures, NASD, FX, news | No | REST | "30-min delayed and updated every 20 minutes" | Price history from Starter | "Public endpoint access does not grant commercial redistribution rights"; Professional adds commercial-use licence | NGN 0 / 29,000 / 75,000 / 350,000 per month | Sources named as "sourced from official NGX data", "NGX chartdata", "cbn", Nairametrics/BusinessDay: `same_upstream` with NGX | Reached; re-checked 2026-11-04 |
| N16 | TradingView [S51] | Charts for "NSENG", 30-min delay; RT free after sign-up | No (licensed display vendor) | Browser only | 30 min | Charts | Display only; no API/download | Free tier | Not machine-readable | Reached |
| N17 | Investing.com [S50] | Quotes/charts | No | Browser | Undisclosed; "not necessarily provided by any market" | — | Storing/reproducing prohibited | Free | Unsuitable as a source | Reached (footer terms only) |
| N18 | Stears [S49] | Macro/country risk, private-market data for institutions | No | Platform, trial on request | — | — | "may not be reproduced … redistributed" | n.p. | Institutional; no API seen | Reached |
| N19 | Nairametrics, Proshare, abokiFX-type aggregators [S39, S97] | News; parallel-market and NAFEM rate tables | No | Browser | Intraday | — | Publisher copyright | Free | Context and parallel-rate indication only | Partly reached |
| N20 | Chaka / Bamboo / Trove | Retail brokerage apps | No (brokers, not vendors) | Apps | — | — | Customer terms | — | Not data vendors; developer APIs not verified (search budget exhausted) | Not reached |
| N21 | Bloomberg / LSEG Workspace (cost ceiling) [S52, S12] | Full NGX RT/historical, filings, FX | Licensed vendors | Terminal / enterprise feeds | RT | Deep | Terminal licence; no RD | Aggregator estimates only: ≈ USD 22k–32k per user per year (unverified, not official) | Authorised NGX vendors [S12] | Pricing unverified |

#### 4.1.2 United Arab Emirates

| # | Source | Provides | Official? | Access | Delay / freshness | History | Licence & RD | Cost (as seen) | Notes | Verified |
|---|---|---|---|---|---|---|---|---|---|---|
| U1 | DFM MarketWatch / website [S55, S54] | Quotes, ticker, disclosures, CA pages | Yes | Browser; sign-in for RT | "Data delayed by 15 minutes" | Current | Disclaimer link; "DFM Fees List" PDF not rendered | Free view | Provider list did not render; developer portal "Filenotfound" [S57, re-checked 2026-11-04]. **No licensed machine-readable route: explicit MVP gap** (U9 fallback) | Reached (partial) |
| U2 | DFM authorised data distributors (incl. LSEG) [S54, S58] | RT, delayed, historical, trade and market summary | Yes (via vendors) | Vendor feeds; LSEG DataScope (HTTP/SFTP/API) | LSEG: "free of charge 15 minutes delayed post-trade data" (snippet, ~439 days old) | Deep | Vendor contracts | n.p. | Enterprise-oriented | Snippet only |
| U3 | DFM Disclosures page [S56] | Quarterly/annual financial statements, price-sensitive information; filters by type, company, date, keyword | Yes | Web; format and RSS/API not shown | Event-driven | Range unknown | Disclaimer | Free | Entries did not render ("Fetching Data…") | Reached (partial) |
| U4 | ADX MCP server [S59, S61] | Live prices, L1 for all instruments, depth (paid), disclosures incl. XBRL, CA, history by tier | Yes (exchange) | MCP for Claude/ChatGPT; API keys | RT L1 on Starter; "real-time, delayed, or batch-based, depending on licensing" | Starter: current/last day; Premium: full depth | Entitlements by user/package/dataset; storage & RD terms unseen | Starter free (100 tool calls/mo); AED 9.99 / 29.99 / 49.99 per month; Premium 4,000 calls (price n.p.); Enterprise custom (press, 14 Aug 2026) | adx.ae blocked (403) to us; verify terms before use. Starter ≈ 3 calls a day, current or last-day history only, ADX only (not DFM). Must be called by a deterministic client, never by the answering model (§4.3.12) | Press report reached (re-checked 2026-11-04); exchange page not |
| U5 | ADX via ICE / vendors [S62, S60] | L1–L3 MBO, RT/delayed/EOD/historical | Yes (via vendors) | ICE feeds/API/files | RT | Full tick | ICE licence | n.p. | Institutional | ICE page reached |
| U6 | UAE Capital Market Authority (ex SCA) Open Data [S63] | Registers of licensed firms, funds, statistics, warnings, finfluencer list | Yes (regulator) | Web open-data pages; "Propose/Request Data" | Periodic | — | Open Data Policy (not read) | Free | No company-financials feed seen | Reached |
| U7 | Central Bank of the UAE [S64] | Exchange rates (USD/AED peg), EIBOR, monetary statistics | Yes | Web/Excel (expected) | Daily/monthly | Long | Unknown | Free | HTTP 403 in this session; peg value 3.6725 observed via Frankfurter instead [S82] | Not reached |
| U8 | FCSC / UAE Stat / Bayanat [S65, S66] | CPI, GDP, population; open-data API by resource GUID | Yes | Web; Bayanat GET endpoint | Monthly/quarterly | — | Terms not shown | Free | fcsc.gov.ae 403; Bayanat reached | Partly reached |
| U9 | Custodian / broker statements (System A, Doc 4) | Holdings, statement price and valuation date for DFM/ADX positions | Issued by the regulated holder of the account | Ingested statement files | Statement date (monthly or on request) | Since account opening | The account holder's own records | Free | MVP valuation route for DFM: `method = observed`, source = statement page; usually `same_upstream` with the exchange close; badge "valued from statement of {{date}}" | Design decision (v0.2) |

#### 4.1.3 United States and international

| # | Source | Provides | Official? | Access | Delay | History | Licence & RD | Cost (as seen) | Notes | Verified |
|---|---|---|---|---|---|---|---|---|---|---|
| I1 | SEC EDGAR APIs (submissions, companyconcept, companyfacts, frames) [S67–S69] | XBRL financial facts, filing index, tickers/exchanges | Yes | REST JSON, no key; bulk ZIP nightly ~3 a.m. ET | "updated in real-time as filings are disseminated" | Full XBRL era (2009–) | Public information; cite SEC; ≤10 req/s; declared User-Agent | Free | Facts are as-filed (restatements appear as new facts with later `filed` dates — keep vintages) | Reached |
| I2 | FRED / ALFRED [S70–S72] | US macro, rates, some FX; vintages | Yes (Fed St. Louis) | REST with API key | Per series release | Long | Attribution notice mandatory; third-party series have own terms; no app that replicates FRED | Free | `series/vintagedates`; `realtime_start/end` for as-known values | Reached |
| I3 | US Treasury par yield curve; Fiscal Data API [S73, S74] | Daily yields CSV/XML; interest rates, debt | Yes | CSV/XML; REST | Daily | Long | "offered free, without restriction" (Fiscal Data) | Free | Yield-curve XML feed subject to developer notices | Reached |
| I4 | Massive (ex Polygon.io) [S75] | US stocks RT, 20+ yrs, websockets; financials & ratios | Licensed vendor | REST/WS | RT (Advanced) | 20+ yrs | "Individual use only"; business pricing separate | Stocks Advanced USD 199/mo; Financials & Ratios USD 29/mo | Rename = URL/brand change risk | Reached |
| I5 | Alpha Vantage [S76] | US equities, FX, crypto, fundamentals | Vendor | REST | RT/15-min via entitlement "for personal use" | Deep | Personal use; RD not stated | Free 25 req/day; USD 49.99–249.99/mo | No African/UAE coverage claimed on page | Reached |
| I6 | EODHD [S41] | Global EOD (150,000+ tickers), intraday, fundamentals, dividends/splits | Vendor (aggregated) | REST | EOD; 15-min live | 30+ yrs | Personal vs B2B | USD 19.99–99.99/mo personal | Same provider as N13 | Reached |
| I7 | Twelve Data [S43] | US RT, global EOD equities/ETFs, fundamentals, fixed income (Pro) | Vendor | REST/WS | RT US; EOD global | Long | Basic "internal non-display"; Grow "internal display"; commercial separate | USD 0 / 79 / 229 / 999 per month | Page shows inconsistent credit limits | Reached |
| I8 | Tiingo [S78] | US/China equities, ETFs/mutual funds EOD, IEX RT, fundamentals add-on | Vendor | REST | EOD; IEX RT | 30+ yrs | "Internal use … only … for your own personal use"; RD priced separately | Starter USD 0; Power USD 30/mo; business internal USD 50/mo | Strong free tier for US EOD | Reached |
| I9 | Financial Modeling Prep | US/global fundamentals, prices | Vendor | REST | — | — | — | Not seen (403 ×2) | Cannot be recommended until terms are read | Not reached |
| I10 | Nasdaq Data Link | Curated datasets | Vendor | REST | — | — | — | Not seen | Homepage returned title only | Not reached |
| I11 | Yahoo Finance (unofficial endpoints) [S80, S81] | Quotes, history, FX, indices | No API offered | Undocumented JSON endpoints | Varies | Long | ToS: no automated collection; non-commercial; developer terms: purge within 24 h | Free | Used by the prototype; breaks without notice; legal exposure | Terms reached |
| I12 | Financial Datasets MCP [S89, S90] | Prices, statements, SEC filings, insider trades, US macro | Vendor (SEC-sourced) | MCP via Claude Connectors Directory / Claude Code | — | 30+ yrs fundamentals | Terms not read | Free sign-up; plans n.p. | US-centric; no NG/UAE | Reached |
| I13 | Distilla MCP [S91] | AI research workflows over filings/transcripts/financial data | Vendor | MCP/API | — | — | — | n.p. | No geographic scope stated | Reached |

#### 4.1.4 Foreign exchange

| # | Source | Rate type | Official? | Access | Freshness | History | Licence | Cost | Notes | Verified |
|---|---|---|---|---|---|---|---|---|---|---|
| X1 | CBN NFEM daily [S28] | Official window VWAP, high/low/close, turnover | Yes | Web + Excel export | Daily | Years | None stated | Free | "stands as the official exchange rate for the day" | Reached |
| X2 | FMDQ NAFEM/NFEM fixing & closing [S21–S23, S25] | Noon fix; VWAP closing | Yes (benchmark administrator) | Website (24-h delayed), e-Markets, licence | Daily; delayed tiers | Via licence | Fees table §F9 | From NGN 107,500 p.a. (24-h delayed single fixing, non-member) | Republishes prior close when thin, identified as republished (methodology §6.1–6.3, E2); closing rate = VWAP of last ten trades (§5.2.1) | Fees and methodology PDFs extracted (2026-11-04) |
| X3 | Parallel market aggregators [S39] | Street buy/sell | No | Browser | Intraday | — | Publisher | Free | 2026-11-02: 1,382/1,388 vs CBN 1,346.26 | Reached |
| X4 | ECB reference rates [S83] | EUR crosses, 29 currencies, no NGN/AED | Yes | CSV/XML/SDMX files | ~16:00 CET daily | 1999– | "information purposes only" | Free | Needed for EUR legs only | Reached |
| X5 | Frankfurter v2 [S82] | Aggregated central-bank rates, 228 currencies incl. NGN (16 providers) and AED (54) | No (aggregator of official sources) | REST, no key, open source | Daily | NGN 1999–, AED 1996– | Blended rates free incl. commercial; provider endpoints subject to provider terms | Free | USD/NGN 1,345.01 and USD/AED 3.6725 on 2026-11-02; providers include CBN [S109], so `same_upstream` for official USD/NGN | Reached + probed |
| X6 | exchangerate.host [S84] | EOD and intraday rates | No | REST | Daily (free) to 60 s | Stated as available | Free tier non-commercial | USD 0 / 14.99 / 59.99 / 99.99 per month | Currency list not shown | Reached |
| X7 | Open Exchange Rates [S85] | 173 currencies incl. NGN, AED | No | REST | Hourly (free) to 5 min | — | Terms not read; free tier USD base only | USD 0 / 12 / 47 / 97 per month | — | Reached |
| X8 | USD/AED peg | 3.6725 | Central Bank of the UAE | — | Constant | Since 1997 (E4) | — | — | Official page 403; value observed via X5 | Partly |

#### 4.1.5 Macro statistics

| # | Source | Provides | Cadence & revisions | Access | Licence | Verified |
|---|---|---|---|---|---|---|
| M1 | NBS [S33–S35] | CPI (2024 = 100), GDP, labour | Monthly CPI ~15th; back-series revised after Jan-2025 rebasing; possible 2026 methodology change unverified | Web/PDF/ODP | Public | Reached |
| M2 | CBN [S27–S31] | Rates, money & credit, reserves, inflation mirror | Daily to monthly; Statistical Bulletin annual/quarterly | Excel export | Not stated | Reached |
| M3 | World Bank Indicators API v2 [S86, S87] | WDI | Annual, revised with each WDI release | REST, no key | General terms non-commercial; dataset terms separate (not read) | Reached |
| M4 | IMF Data (SDMX 2.1/3.0) [S88] | IFS, WEO, BOP, CPI (expected) | Periodic; WEO semi-annual | SDMX, beta account | Copyright & usage page not read | Reached |
| M5 | FRED/ALFRED [S70–S72] | US and some international series with vintages | Per release; vintages retained | REST key | Attribution | Reached |
| M6 | FCSC / Bayanat [S65, S66] | UAE CPI, GDP | Monthly/quarterly | Bayanat API | Not shown | Partly |

#### 4.1.6 Claude MCP connectors relevant to this product

Verified: Financial Datasets (US, SEC-sourced) [S89, S90]; Distilla (scope unstated) [S91]; ADX's own MCP server (UAE, ADX only) [S61]. Not found/verified: any MCP connector covering NGX, DFM, FMDQ, CBN or NBS. The Connectors Directory page is dynamic and did not render the finance listings to us [S92]; do not claim coverage beyond the vendors' own documentation.

### 4.2 Data pathologies to design for

| # | Pathology | Concrete instance found | Detection rule | Control (→ §4.3) |
|---|---|---|---|---|
| P1 | Stale prices carried forward on zero-volume days | NGX stocks frequently do not trade. v0.1 said vendors "either repeat the last close or omit the day"; that was unsourced and is now a test item for the NGX trial. CSCS snapshot was 4 trading days old on 2026-11-02 [S18] | volume = 0 or missing day vs trading calendar; identical close ≥ 3 sessions | `last_traded_on` field separate from `as_of_date`; UI badge "no trade since dd-mmm"; liquidity metric uses zero-return days (E2, Lesmond, Ogden & Trzcinka 1999 [S103, verified]); beta under non-synchronous trading per [S104, S105] (Doc 5b) |
| P2 | Bonus issues, scrip dividends, consolidations, rights issues (with supplementary allotment), par-value changes, kobo-denominated dividends | NGX bonus issues are frequent (E4; to be counted from NGX CA notices, N5, in the trial); no vendor documents NGX adjustment methodology (F1–F7) | Price gap on ex-date ≈ 1/(1+bonus ratio); share count step weeks later | Corporate-action engine with CA date fields and lifecycle (§4.3.4); factor audit against issuer notice |
| P3 | Share-count changes not reflected | Vendor shares outstanding differ from latest filing | Market cap / price ≠ shares; EPS mismatch | Shares outstanding sourced from filings only (N5), vendor value stays V=`candidate` |
| P4 | Restated financials and revised statistics | NBS Sep-2025 CPI 18.02% → 20.98% [S34]; SEC facts re-filed | Same (entity, period, concept) with new value | Vintage model (L axis): never overwrite; `supersedes` link; show "restated" (C3.4). Vendors have been shown to rewrite historical records [S106]; Datastream return errors [S102] |
| P5 | Scale/unit errors | NGN'000 vs NGN million statements; Mansa JSE history in cents vs quotes in rand [S44]; prototype labels CPI index as "%" [S93] | Magnitude jump ×10³ between periods; unit metadata mismatch | Mandatory `unit`, `scale`, `currency` fields; magnitude continuity test; series metadata registry |
| P6 | Fiscal-year mismatch | Nigerian issuers with June and December year-ends; TTM aggregation across differing quarters | Period end dates not aligned | Period-aware fundamentals model; TTM built from explicit period IDs |
| P7 | Reporting currency ≠ trading currency | Issuers reporting in USD while trading in NGN (e.g. dual-listed telecoms/oil names — E4, verify per issuer) | Statement currency ≠ listing currency | Convert only with dated official rate; store both; label |
| P8 | Delisting, suspension, name/ticker change | STACO Insurance delisted 21/09/2026 (regulatory); MRS Oil 28-Jul-25 (voluntary) [S14] | Entity status feed; prices stop | Security master with status and effective dates; portfolio valuation falls back to last price flagged "suspended/delisted" |
| P9 | Index reconstitution | NGX index members endpoint priced separately [S9]; semi-annual reviews (E4) | Membership diff | Store membership history; benchmark returns use point-in-time constituents |
| P10 | FX regime breaks | 2016 managed float; June 2023 unification (NAFEM); 2024 EFEMS/NFEM renaming (E4, verify) | Return > 10% in official rate; name change in source | Rate records carry `regime_id`; charts annotate breaks; no splicing without method tag |
| P11 | Holiday calendars and short-notice holidays | Nigeria declares some public holidays days ahead (E4) | Expected session with no data from all sources | Calendar as data with source; an announced-but-unsourced holiday is a calendar record at V=`candidate` |
| P12 | Time zones and session hours | NGX hours are 09:00–16:00 WAT from 27 Apr 2026 (Doc 5a F2, E2). EODHD still shows "10:00–14:20 (+01)" [S40]: stale vendor metadata, itself an example of vendor drift (P13). DFM/ADX GST; US ET | Timestamps without zone; vendor session metadata disagreeing with the rule registry | Store UTC + exchange-local; session table per MIC from the market-rule registry (resolved for NGX via 5a) |
| P13 | Vendor silent symbol/brand/endpoint changes | Polygon.io → Massive; NGX Pulse → Kobo; SCA → CMA; NAFEX/NAFEM/NFEM; `NSENG` vs `XNSA` vs `.LG` [F25] | 301 redirects; symbol not found; schema drift | Entity master keyed by ISIN + MIC; vendor symbol maps versioned; schema-drift alarms |
| P14 | API deprecations and unofficial endpoints | Yahoo v7/v8 used by prototype; ToS prohibits [S80]; prototype returns `[]` on failure [S93] | HTTP errors, empty payloads, cookie/crumb requirements | Only sources with a licence record may feed the store; health checks; series feed status `fetch_failed` (a failed fetch creates no figure, C3.2) |
| P15 | Homonyms | "NGX" = ICE natural-gas exchange in ICE fee PDFs [S53]; "NSE" = Nigeria, India or Nairobi | Wrong MIC/currency on ingest | MIC-first identification; currency sanity check per MIC |
| P16 | Documentation errors | NGX API samples malformed; 3-minute vs 30-minute delay text [S10] | Integration tests fail | Contract tests per endpoint; measured freshness |
| P17 | Benchmark republication | FMDQ republishes previous close on thin data [S22] | Identical fixing on consecutive days | `republished` flag from FMDQ's own identification (methodology §6.2) or detection; counts at least as `ageing` (C3.2); staleness clock continues |
| P18 | Rebased or re-weighted series | CPI 2009 → 2024 base [S35]; headline drop 34.80% → 24.48%; January 2026 methodology change with new sub-indices, same base (F12) | Base-year or methodology attribute change | Series ID carries `methodology_version`, not only base; year-on-year computed only within one vintage from index levels; cross-version comparisons blocked or labelled |
| P19 | LLM-generated numbers | Prototype prompt "Cite specific levels and spreads" to a 70B model [S93]; FinanceBench 81% incorrect/refused for GPT-4-Turbo with retrieval [S101] | Numeric tokens in model output without figure IDs | §4.3.12: tool-only numbers, renderer substitution, output validator |
| P20 | Silent empties and cache-as-truth | `catch { return [] }`; cached closes served on error with no age; `regularMarketPrice ?? 0` and `regularMarketChange ?? 0` (a false "unchanged") [S93] | Data arrays shorter than expected; cache hits after failures | Every value carries `retrieval_timestamp`; cache serves only with age badge; empty ≠ zero |
| P21 | Fact wrong at entry / false as-of label | `cbRate: 27.50` committed 2026-03-02 when 26.50% was in force; Fed 4.25% vs 3.50% (F26) | Entered value ≠ primary snapshot; `as_of` earlier than the latest primary decision | C3.5 entry check; calendar-derived expiry; pre-go-live re-verification (R0) |
| P22 | Holding-company successions | Schemes of arrangement replacing ISIN and ticker 1:1 (e.g. GTB→GTCO; E4) | Old ISIN stops; new ISIN starts with no history | `succession` table (§4.3.4 item 7) |
| P23 | Settlement-cycle changes | T+3 → T+2 (28 Nov 2025) → T+1 (1 Jun 2026) (Doc 5a F4) | Ex-date offsets change | Settlement regime read from the rule registry by date (§4.3.4 item 5) |

### 4.3 Validation and control framework

This section implements contracts C2 and C3 for market and reference data. The contracts define the vocabulary; this section defines the market-data fields, thresholds, checks and enforcement. Where v0.1 had its own versions (an eight-value `validation_status` enum mixing freshness with evidence, a temperature rule, an expiry-only control), they have been removed.

#### 4.3.1 Provenance schema (attached to every stored figure)

Status is held on the separate axes of **C3.2**: V validation (stored, append-only log), F freshness (computed at read time, never stored), L lifecycle, R rights, I identity, C corroboration and M method. The old values map as C3.7 states: `raw` and `candidate`/`unconfirmed` → V=`candidate`; `stale`/`expired` → F; `superseded` → L; `fetch_failed` → series feed status. A failed fetch creates no figure.

| Field | Type | Rule |
|---|---|---|
| `figure_id` | UUID | Immutable; referenced by UI, calculations and AI tokens (C2) |
| `entity_id` | ISIN + MIC, or series code (e.g. `NBS:CPI:ALL:2024=100:m2026`) | From the security/series master, never free text. Series codes carry `methodology_version` (P18) |
| `field` | controlled vocabulary (`close`, `official_close`, `volume`, `shares_outstanding`, `eps_basic`, `dividend_cash`, `fx_rate`, `policy_rate`, …) | Definitions in a registry; the C2 `as=` check compares against this field |
| `value` | decimal (string in transport) | No floats in storage (C1 D6) |
| `unit`, `scale`, `currency` | enum / integer power of ten / ISO 4217 | Mandatory; `scale` 0, 3, 6, 9; dividend unit (`kobo` or `naira`) recorded as published |
| `price_type` | enum (`last`, `official_close`, `closing_auction`, `vwap`, `reference`, `fixing`, `nfem_vwap`, `closing`, `simple_average`, `high`, `low`; `buy`, `sell` only where a source publishes them) | Comparisons only between equal price types (§4.3.3). `central` is withdrawn: CBN publishes no central column (C5.1 v0.2). The CBN reference is `nfem_vwap`, the "NFEM Rate (₦/US$)" column |
| `as_of_date` / `period_start`, `period_end` | date | Stock vs flow; exchange-local date for prices |
| `period_id`, `scope_id` | registry keys | The period a figure covers and the account, portfolio or entity it belongs to. C2 tokens must carry `per=` and `scope=` equal to them (C2.2 item 5, v0.2) |
| `last_traded_on` | date | Separate from `as_of_date` for thinly traded names (P1) |
| `published_at` | datetime | The source's release time; with `recorded_at` it gives point-in-time history (ALFRED-style vintages) |
| `retrieval_timestamp`, `recorded_at` | UTC datetime | Fetch time; system time of the write (bitemporal, C1.7). Every query takes `as_of_recorded` |
| `source_id`, `source_url`, `source_record_id` | registry key, URL, vendor ID | Source registry holds owner, official flag, `source_independence_group`, SLA |
| `source_independence_group` | registry key (e.g. `NGX`, `CBN`, `FMDQ`, `ISSUER:<isin>`, `SEC`) | Two figures corroborate (C=`two_independent`) only if their groups differ (§4.3.3) |
| `evidence_snapshot_hash` | SHA-256 | Hash of the `evidence_snapshot` {url, retrieved_at, content_sha256, quoted_text}; mandatory for world facts and manual entries (C3.5) |
| `licence_id`, `licence_scope`, `terms_version`, `terms_hash` | registry keys; enum (`personal_display`, `non_display`, `internal_display`, `redistribution`) | R axis is computed from these plus licence expiry; a surface or calculation not covered by scope is blocked (C3.4) |
| `rate_type` (FX only) | enum (`official_nfem`, `fmdq_fixing`, `fmdq_closing`, `parallel_indicative`, `ecb_reference`, `peg`) | Shown on every conversion; hierarchy per C5.1 |
| `method` | M axis: `observed`, `derived`, `estimated`, `manual_override` (+ `override_expires_at`) | Derived figures carry `calc_id` and input `figure_id`s (C2.2 item 6) |
| `adjustment_basis`, `ca_set_version` | enum (`raw`, `ca_adjusted`, `total_return`); version id | Adjusted series name the CA set they used |
| `consolidation_scope`, `audited`, `accounting_basis`, `fiscal_period_id` (fundamentals) | enum (`group`, `company`); bool; enum (`IFRS`, `AAOIFI`, `US-GAAP`); id | Nigerian banks publish group and company figures; the two are never mixed |
| `vintage`, `supersedes`, `superseded_by` | integer / UUID | L axis; revisions never overwrite (P4) |
| `confidence` | A–D, **derived, not stored**: A = official and C=`two_independent`; B = official, `single_source` or `same_upstream`; C = vendor, corroborated against an official figure; D = vendor or unofficial only | A display grade of the *source*. It is not the C4 confidence, which applies only to inferred ledger facts |
| `validator`, `validated_at`, `independence`, `notes` | actor id, datetime, enum (`self`, `simulated_agent`, `second_person`, `licensed`), text | `independence` is compared by **person**, not process (C3.3a). The founder's checks are `self` and display "self-checked"; "validated" is reserved for `second_person` or `licensed` events. v0.2's "`validator` ≠ ingesting process" is withdrawn |
| `expiry_at` | datetime, **derived** | From a separately sourced calendar record (C3.5 item 4), never typed. If no calendar record exists, `expiry_at` is null and the cadence fallback of §4.3.2 applies |

Illustrative record, revised (values REAL as of 2026-11-04 except the hashes and ids):

```json
{"figure_id":"9f1c…","entity_id":"CBN:MPR","field":"policy_rate","value":"23.00","unit":"percent","scale":0,"currency":null,
 "price_type":null,"as_of_date":"2026-09-22","published_at":"2026-09-22","recorded_at":"2026-11-04T10:12:03Z",
 "source_id":"cbn:mpc_decisions","source_url":"https://www.cbn.gov.ng/MonetaryPolicy/decisions.html",
 "source_independence_group":"CBN","evidence_snapshot_hash":"sha256:…",
 "evidence_snapshot":{"retrieved_at":"2026-11-04T10:11:40Z","quoted_text":"Reset the Monetary Policy Rate at 23 per cent."},
 "licence_id":"cbn-public","licence_scope":"personal_display","method":"observed","vintage":1,
 "V":"auto_validated","C":"single_source","L":"current","I":"resolved",
 "expiry_at":null,"notes":"Entry check C3.5 passed (value equals snapshot; as_of not earlier than latest decision). Next MPC date not on the decisions page: no calendar record, so cadence fallback applies (§4.3.2). Press report [S32] stored as a non-corroborating mirror (same_upstream)."}
```

This is the **single registry record** for the MPR. Doc 5a's registry row and Example 1 point to it, with the same V and C values (consistency pass, I3).

v0.1's example used a press article as the source, with a note that the primary was "not yet attached". Under C3.5 that record could not have left `candidate`. It showed the weakness described in R0.

#### 4.3.2 Freshness thresholds (one table, merged with Doc 5a §4.10)

Freshness F is computed when a figure is read (C3.2), from `as_of_date`, `published_at`, the source's cadence, holiday calendar, filing calendar and `expiry_at`. It is never stored. The rules are **C3.2a** (contracts v0.2): where a sourced calendar or filing deadline exists, it governs and the day counts are fallbacks; the deadline is itself a C3.5 world fact, never typed by hand. A periodic fundamental is `fresh` until the next filing that would update it is due, `ageing` until it is published, and `stale` once published but not ingested or 30 days after the due date. A metric used as a current-period measure (e.g. TTM) takes its freshness from the next filing of any period type, interims included. Shares outstanding with an open corporate action are `ageing`, and `stale` once the expected apply date passes (C3.3 "Pending corporate actions"). All thresholds are **E5** until calibrated on the two-week NGX trial and three months of live data (§9), and each is stored as a configuration record with its source (§4.3.6). This table replaces both v0.1's table and Doc 5a §4.10's. Doc 5a must point here (§6).

| Data type | Fresh | Ageing (amber) | Stale (grey, badge mandatory) | Expired (no value shown) | Basis |
|---|---|---|---|---|---|
| Exchange EOD close (NGX, DFM, ADX, US) | ≤ 1 trading day old | 2 trading days | 3–5 trading days | > 5 trading days | 5a's 2/5 adopted. v0.1's 3/20 withdrawn. Two trading days old is `ageing`, not stale (C3.7) |
| Thinly traded name | Freshness of the published close is as above. A separate "no trade since {{date}}" badge comes from `last_traded_on` | | | | NGX publishes a close when no trade occurs (P1). Freshness of the feed and liquidity of the name are different facts |
| Delayed intraday quote (licensed) | ≤ 45 min in session | 45–120 min | > 2 h in session | after session: replaced by close | Unchanged |
| Official FX (CBN NFEM, FMDQ) | ≤ 1 source business day between fixing and applied date | 2 | > 2 (or `republished` ≥ 2 consecutive days) | > 10 | **C5.2 governs** (stale > 2, expired > 10). Doc 5a's "expired after 5" is superseded. A single `republished` day counts as ageing (C3.2) |
| AED/USD peg | A registered world fact under C3.5 [C5.1]; no freshness clock. The deviation check (§4.3.5) can move it to `disputed` | | | | C5.5 |
| Policy rate (CBN, Fed, CBUAE) | Until the next scheduled meeting in a sourced calendar record | From that meeting's last day until a decision is ingested (≤ 7 days) | > 7 days after a scheduled meeting with no ingested decision | > 30 days after | 5a's market-event rule adopted. **Fallback with no calendar record:** ageing > 60 days after `as_of`, stale > 75, expired > 120 |
| CPI | Until the next scheduled release (NBS calendar) | Release day + 3 business days with nothing ingested | > 75 days after reference-month end | > 120 days | Fallback day counts (45/75/120) as in 5a and v0.1 |
| Country-risk edition (Damodaran, semi-annual; single source) | ≤ 7 months (213 days) after the edition date | 214–396 days | > 396 days | — (shown with its badge) | Doc 5a §4.10 proposal, adopted in the consistency pass (Doc 5 I9). Every edition is human-checked under the C3.3 v0.2 sampling floor |
| Interim (quarterly) fundamentals | Until the registry filing deadline for the next interim | Deadline passed, nothing filed | A newer period filed but not ingested, or deadline + 30 days | Two newer periods exist | Tied to the next expected filing (R05c M8). **Fallback** (deadline not registered): ageing > 45 days after period end, stale > 120, expired > 200 |
| Audited annual statements | Until the registry deadline for the next annual | Deadline passed, nothing filed | Newer annual filed but not ingested, or deadline + 30 days | > 450 days after FYE | v0.1's "fresh ≤ 300 days" withdrawn. **Fallback:** ageing > 120, stale > 270 (5a), expired > 450. NGX filing deadlines are not yet fetched (E4) |
| Shares outstanding | Until next CA event | Any open CA lifecycle (§4.3.4) | CA past its expected credit date and not applied | — | 5a's rule adopted |
| Dividend record | Until closure of register | Declared, not confirmed by issuer notice | After closure of register if unconfirmed | — | 5a's rule adopted |
| Market rules (tick, price groups, hours, settlement) | ≤ 90 days since last check | 90–180 days | > 180 days | — | From 5a |
| Holiday calendar | Covers ≥ 90 days ahead | 30–90 days | < 30 days coverage | — | Unchanged |
| Vendor symbol map | Not a freshness matter: identity axis I (`resolved`, `vendor_renamed`, `unresolved`) | | | | v0.1 mapped this to `fetch_failed`, which lost the cause |

**UI rule.** C3.4 governs what each V × F combination shows and which calculation tier it may feed. In short: a stale value is shown grey with a badge, an expired one shows no value ("expired since {{date}}"), and a disputed one shows both values side by side, never a range. A screen that cannot show the badge cannot show the number.

#### 4.3.3 Corroboration rules: independence, tolerances and the single-source protocol

**Independence.** Every source has a `source_independence_group`. Two figures corroborate (C=`two_independent`) only if their groups differ and neither copies the other. Agreement inside one group (C=`same_upstream`) shows copy fidelity, not correctness. It is still checked, because copying errors happen (units, adjustments, dates). v0.1 called these "two-source" checks without asking whether the sources were independent. Several are not:

| Field | Primary (group) | Comparator (group) | Independent? | Corroboration reachable today | Tolerance (all E5) | On breach |
|---|---|---|---|---|---|---|
| NGX close | NGX API `pricesEOD` (NGX) | CSCS daily list (NGX group depository); Kobo ("sourced from official NGX data"); Mansa (parses NGX PDFs); EODHD (aggregates "100+ sources", undisclosed) | **No.** All are copies of NGX or undisclosed | `same_upstream` at best. **`two_independent` is unreachable for NGX prices**, so they become conclusion-eligible only through V=`validated` or the single-source protocol | Exact match after unit normalisation for same price type. A difference is a copy or timing error, not market noise | `disputed`; both shown; excluded from conclusions until resolved |
| NGX close (founder's own trade days) | NGX | Broker contract note / CSCS statement of the founder's trade (ISSUER-independent execution record) | Partly: an execution price, not the official close | `two_independent` for plausibility only | Execution price within the day's high–low | Review item |
| NGX volume | NGX | CSCS | No | `same_upstream` | ≤ 2% (block trades may differ) | Flag only |
| DFM/ADX close | **DFM: none licensed (gap, §4.6).** ADX: ADX MCP via a deterministic client (ADX) | Custodian/broker statement price | Statement prices usually derive from the exchange close | `same_upstream` | Exact for the same date and price type | `disputed` |
| US close | Licensed vendor (I4/I8) | Second vendor | Both resell consolidated tape or exchange data | `same_upstream` | Exact when both are `official_close`; if one is consolidated last trade and the other closing auction, they are not compared (price types differ) | `disputed` |
| Shares outstanding | Latest filing (N5 / EDGAR) (ISSUER) | Vendor; market cap ÷ price | Filing vs vendor: independent processing of the issuer's number | Internal-consistency check | Exact; market cap ÷ price within one share-unit rounding | Vendor value `candidate`; filing wins |
| EPS | Recomputed from net income and weighted shares | Filing EPS | Recompute is an internal-consistency check | — | ≤ 2%; basic and diluted separately; same `consolidation_scope` | `disputed` |
| Dividend amount / dates | Issuer notice (ISSUER) | NGX dividends endpoint; vendor | NGX endpoint relays the issuer | `same_upstream` | Exact **after** normalising kobo ↔ naira and gross ↔ net of WHT (script part H) | Vendor-only dividend stays `candidate`; never applied to adjusted series |
| Official USD/NGN | CBN "NFEM Rate (₦/US$)", `nfem_vwap` (CBN) — Excel export or rendered-table snapshot, with the column header | FMDQ closing (FMDQ); Frankfurter (lists CBN among its NGN providers [S109]) | **No.** FMDQ's closing rate is the VWAP of the last ten trades on the same market (NAFEM methodology §5.2.1 [S22]), a different statistic from CBN's day VWAP; Frankfurter includes CBN itself | `same_upstream` (C5.1 labels FMDQ "a corroboration check only") | ≤ 0.5% between CBN and FMDQ (different statistics of one market); exact against Frankfurter when it relays CBN | `disputed` |
| Parallel USD/NGN | Aggregator | Second aggregator | Unknown | — | Informational only | Never used for valuation or tax (C5.1) |
| Index level | NGX index values (NGX) | Vendor | No | `same_upstream` | Exact after scale normalisation | `disputed` |
| CPI, policy rate | NBS / CBN release (primary snapshot, C3.5) | Press | Press relays the release | `single_source` | Exact | Official wins; press is a mirror only |

**Single-source protocol (C3.3, adopted).** These fields have one source in practice: CPI; MPR (the CBN decisions page; the press only relays it); index membership; FMDQ fixings; shares outstanding from filings; NGX prices (because the comparators are copies); everything on DFM and ADX. A `single_source` or `same_upstream` series may feed conclusion-driving calculations only while its sampling rule holds:
1. internal-consistency checks pass. Examples: CPI year-on-year recomputed from index levels **within one methodology version**; market cap ÷ price compared with shares outstanding; close within the day's high–low; adjusted ex-date gap consistent with the CA factor;
2. plausibility bands pass (§4.3.5);
3. a risk-based human sample finds no error: 1 in 20 figures, with a **floor** per series per year of max(⌈n/20⌉, min(n, 4)) human-checked figures for n editions (C3.3 v0.2). Every edition of a quarterly, semi-annual or annual series is checked, and a monthly series at least quarterly;
4. every figure that breaks a band is human-checked.

One sampling error sends the series back to review of each figure. The badge always names "single source" or "same upstream" (C3.4). In the personal MVP the sampler is the founder, so these checks are `self` and display "self-checked" (C3.3a).

**Tolerance derivation.** No tolerance above has been derived from data. Each is E5 and is a configuration record (§4.3.6). The two-week NGX trial (§9) measures CSCS vs NGX API differences per field and per price group (Doc 5a F3 tick table), and the tolerances are reset from that distribution.

#### 4.3.4 Corporate-action engine (revised for NGX)

1. Raw and adjusted series are both stored. The adjusted series is always derivable from raw plus the CA table (`method = derived`, `calc_id = ca_adjust_v2`, `ca_set_version` recorded).
2. Every CA record requires an issuer document (N5 PDF or EDGAR filing) as `source_record_id` with an evidence snapshot. Vendor CA feeds create `candidate` records only.
3. **CA record dates.** NGX events unfold over weeks, so one "effective date" is not enough. Each record holds: `declared_on`, `ex_date` (mark-down), `qualification_date` (closure of register), `approval_date` (AGM or court/SEC sanction), `listing_date`, `credit_date` (CSCS), `payment_date`. Each date is optional per type and carries its own source. On NGX a bonus is marked down at the ex-date, approved at the AGM, and listed and credited weeks later (E4, practitioner knowledge reported by R05c; to be confirmed against the NGX Rulebook, §9).
4. **CA lifecycle** (a property of the CA record, not a figure status; confirmed by contracts v0.2, C3.3 "Pending corporate actions", CC-3): `announced → ex → approved → listed → credited → closed`, plus `withdrawn`. While a CA is open past `ex`, the entity's shares-outstanding figure is F=`ageing` (§4.3.2). If the share change has not arrived within N business days of the ex-date (registry parameter; initial N = 60, E5), F becomes `stale` and a review item opens. This replaces v0.1 rule 5 ("shares and market cap must change on the same effective date … blocks the record"), which would have blocked every ordinary NGX bonus.
5. **Settlement-cycle history.** Ex-date logic reads the settlement regime in force on each date from the rule registry: T+3 until 27 November 2025, T+2 from 28 November 2025, T+1 from 1 June 2026 (Doc 5a F4, §4.5: T+1 is E2; the T+2 date is E3 and unconfirmed, because 28 November 2025 is the date of a CSCS news item; consistency pass, I5). The derivation of an ex-date from a qualification date under T+n is a registered rule (E4 until confirmed against the Rulebook).
6. **Types and factors.** Cash dividend: (close − D)/close on ex-date, used for total-return series only and flagged. Bonus n-for-m: m/(m+n). Split k:1: 1/k. Consolidation: inverse of split. Rights issue: theoretical ex-rights price ÷ cum price. The record also holds rights trading dates, the subscription price and any **supplementary allotment**, because the 2024–26 bank recapitalisation rights issues used them (Doc 5a F11). Scrip dividend: an election record, with the share factor applied only to the elected quantity. **Par-value change:** price factor 1, recorded explicitly so that a vendor's misreading of it as a split is caught. **Dividends declared in kobo:** stored in the published unit and normalised before any comparison.
7. **Holding-company successions.** A scheme of arrangement that swaps shares 1:1 into a new holding company changes ISIN and ticker. Reported examples are GTB→GTCO, Access Bank→Access Holdings and FBNH→First HoldCo (dates and ratios E4, from R05c; each must be sourced from the scheme document before entry). These are held in a `succession` table: (old ISIN, old ticker, new ISIN, new ticker, ratio, effective date, document). Price history and lots run through it, so an entity master keyed on ISIN + MIC does not break the history.
8. **Ex-date test, made honest.** On each CA ex-date, the observed raw gap (close_ex ÷ close_cum) is compared with the CA factor. If the adjusted ex-date return falls outside the stock's 99th percentile of absolute ordinary daily returns, a **review item** is raised, not an automatic `disputed`. By construction that band is exceeded on about 1% of genuine days, and ex-dates cluster in results season. A large unexplained gap on a day *without* a CA record raises "possible missing CA" against the entity.
9. Recompute all per-share metrics from adjusted shares. Never ingest vendor "adjusted EPS" as observed. A per-share calculation **refuses** when its inputs carry different `ca_set_version` values, for example a price dated on or after the ex-date combined with a pre-action share count (C3.3 v0.2), so the `ageing` badge cannot hide an unadjusted mix.

#### 4.3.5 Outlier and discontinuity checks

| Check | Rule | Outcome |
|---|---|---|
| Daily move | Return > 4 SD, or beyond the daily price limit in the market-rule registry (the NGX row is `candidate`, E3: ±10% appears only on the pre-open row of NGX's session table, and the 2018 guidance gives ±5% (Doc 5a F2, §4.5). Until the Rulebook is read, a move at either level raises a review item and is never treated as a confirmed limit day, in Docs 5a, 5b and 5c alike; consistency pass, I4), without a CA record | review; `disputed` if confirmed against a second observation |
| Close outside the day's high–low | Hard check | `disputed` |
| **Identical close for ≥ 3 sessions** | Flag only if traded volume on each of those sessions is **at or above the price-group threshold** needed to move the price (2018 rule, Doc 5a F3: Group A ≥ N100 → 10,000 units; B N5–<N100 → 50,000; C < N5 → 100,000), read from the registry with its effective date. v0.1 flagged any non-zero volume, which is normal on NGX because small trades do not move the price (script part F) | review |
| Magnitude jump ×10³ between consecutive fundamentals periods | Scale error | `disputed` |
| Official FX move > 5% in a day | Regime event or error | review; annotate regime |
| Missing session with no holiday record | All sources missing | review; calendar candidate |
| Vendor symbol resolves to a different ISIN | Identity change | I=`vendor_renamed` until confirmed |
| AED/USD peg deviation | Observed rate differs from the registered peg 3.6725 by > 0.01% (tolerance a configuration record, E5) | peg figure `disputed`; alert |

None of these silently corrects a value.

#### 4.3.6 The "no silent constants" rule, and how it is enforced

**Definition.** A *world fact* describes something outside the code that a third party can change: policy rates, tax rates, VAT, tick sizes, price-group thresholds, trading hours, daily limits, settlement cycles, holiday dates, index memberships, pegs, regulatory thresholds, vendor rate limits (SEC 10 req/s). Test: if a regulator, exchange or vendor could make the value wrong without anyone touching the code, it is a world fact. An *engineering constant* (retry counts, cache TTLs, page sizes) is not. Tolerances and freshness thresholds are a third class, **policy parameters**: they are configuration records with a source and an evidence grade (E5 here).

**Rule.** No world fact or policy parameter appears in application code. Each is a record in the store with source, evidence snapshot (C3.5), `effective_from`, and a derived `expiry_at` or review date.

**Enforcement** (each is a test or a gate):
1. A `Figure` type that can be constructed only through the registry/store client. Domain functions accept `Figure`, not bare numbers.
2. A magic-number lint on domain modules (ESLint `no-magic-numbers` for TypeScript; Ruff `PLR2004` for Python), with annotated exemptions for engineering constants.
3. A CI grep that rejects date literals and "as of" / "accurate as of" strings in `src/` outside fixtures.
4. CODEOWNERS: the data-quality owner must approve changes to the registry, seed files and lint configuration.
5. **Expiry is a scheduled monitor, not a CI test.** v0.1 proposed a CI test that "fails when the record is past expiry", which would break every build because of the calendar. A daily monitor opens review items instead.
6. **Entry check (C3.5).** Any seeded or manually entered world fact stays `candidate` until its value matches a primary-source snapshot and its `as_of` is not earlier than the latest decision in the primary record. Before go-live, every seeded value is re-verified this way.

**Constants this document itself introduces** and which must be registered rather than coded: the peg 3.6725 and its ±0.01% band; every tolerance in §4.3.3; every threshold in §4.3.2; N = 60 in §4.3.4; the 4 SD and 5% outlier rules; SEC's 10 requests/second; VAT 7.5%; the NGX price-group thresholds and ticks; the settlement-cycle dates; the NGX daily limit.

The repository shows why: the Nigerian and US policy rates were wrong when entered (R0), and the ECB rate appears twice with different values (`TransmissionMap.tsx` "Static CB rates (March 2026)" ECB 2.65 vs `countryProfiles.ts`/`mapData.ts` 2.50), alongside "accurate as of March 2026" labels in `ratesData.ts` and `economicCalendar.ts` [S93].

#### 4.3.7 Golden-dataset regression tests

A hand-verified set, maintained by the audit function, of roughly 20 securities × 5 years across NGX, ADX and US, plus the official FX and CPI series. Every corporate action, delisting, restatement, rebasing or methodology boundary and FX-regime break is confirmed against primary documents. A run re-ingests the set from the configured sources on every change to ingestion or adjustment code and compares adjusted series, shares, EPS, dividends and FX with the golden values within the §4.3.3 tolerances.

**Storage and licensing.** Re-ingesting or storing licensed NGX/vendor data in the public GitHub repository, or in a shared CI cache, may count as storage or redistribution under NGX and vendor terms. Therefore:
- the public CI runs on **synthetic fixtures** with the same shape and traps;
- the licensed golden run happens in private, licensed storage under the founder's licence;
- only pass/fail and hashes leave that storage.

**Known traps included deliberately:**
- a bonus issue whose new shares are credited weeks after the ex-date;
- a rights issue with supplementary allotment;
- a scrip dividend;
- a par-value change;
- a dividend declared in kobo;
- a holding-company succession;
- a USD-reporting NGX issuer;
- an NGN'000 statement and a group/company pair;
- the January 2025 CPI rebasing and the January 2026 methodology change;
- the June 2023 FX unification;
- the 2025–26 settlement-cycle changes;
- a delisted name, a suspended name and a vendor symbol rename;
- a NAFEM republication run;
- **a world fact that was wrong at entry** (the 27.50 case).

#### 4.3.8 Data-quality dashboard

- **Per source:** last successful fetch; feed status (`ok`/`fetch_failed`); measured latency against target; error rate; schema-drift alerts; licence expiry, scope and `terms_version` re-check date.
- **Per data type:** counts on each C3 axis (V, computed F, L, R, I, C); open and closed corroboration breaks; open CA lifecycles past N; single-source sampling results, and any series sent back to full review; coverage of the user's holdings (% of positions conclusion-eligible under C3.4).
- **Per surface:** number of figures rendered with stale, disputed or single-source badges; AI answers rejected or refused under C2.

The audit function reviews it weekly, and thresholds trigger alerts.

#### 4.3.9 Audit log

Append-only. It records:
- every write of a figure and every V/L/I transition (trigger, actor, evidence hash, time — C3.3);
- every manual override (user, reason, before/after, expiry);
- every licence or source-registry change;
- every AI turn (prompt hash, figure IDs supplied, figure IDs cited, verdict — C2.2 item 11).

Retention follows contract C8: entries about world facts and market data are class W (indefinite; licence-governed purge under C3 axis R); AI-turn entries are class A traces (12 months, E5); erasure, consent and access events are the content-free class S log. No compliance-mode object lock applies to any entry holding personal data (C8-I4).

#### 4.3.10 Sign-off, who checked, and the founder's workload

A figure is *conclusion-driving* when it feeds a valuation, risk metric, goal evaluation, tax computation or any AI-stated conclusion. Eligibility follows the **C3.4 calculation tiers**. A conclusion-driving calculation needs F ∈ {fresh, ageing}, a permitting licence scope, and either V = `validated` or V = `auto_validated` with `two_independent` or a passing single-source sampling rule. **Independence (C3.3a, contracts v0.2).** v0.2 of this section treated the ingesting *process* as the ingester, so the founder counted as independent. That is withdrawn. Every validation event records `independence`, compared by person: in the personal MVP the founder enters world facts and is the only human sampler, so every human check is `self`. A `self`-checked figure keeps its eligibility (a single-user system has no other route) but displays "self-checked", never "validated", "verified" or "independently checked", in the UI, exports and AI answers, and totals carry "includes self-checked figures". The founder uses a review queue that shows the evidence snapshot and comparison result. In a commercial product the validator is a data-quality analyst with no product-delivery KPI (`second_person`). Overrides expire and return to `candidate` (C3.3).

**Workload.** v0.1 required a human `validated` state for every conclusion-driving figure. For a synthetic 20 NGX holdings over 250 sessions, plus FX and world facts, that is about 5,280 checks a year, or **264 hours** at 3 minutes each. Nobody does that, so the queue would be rubber-stamped. Under the single-source protocol with pooled 1-in-20 sampling the same book needs about 392 checks a year, or 19.6 hours. **Recomputed with the C3.3 v0.2 per-series floor** (script part D): 260 sampled prices (13 per holding), 13 FX fixings, 80 share-count filings (every quarterly edition of 20 holdings), 40 dividend records (2 per holding, E5), 2 country-risk editions, 2 index reviews, about 100 band breaks and 30 world facts: **527 checks, about 26.4 hours a year, roughly 30 minutes a week** (the band-break rate, dividend count and minutes per check are E5). All of it is `self`-checked. The founder must confirm that they will do this (§6). Without a validator, NGX-based conclusions are refused, not silently allowed.

#### 4.3.11 When sources disagree or data is missing

Show the gap.
- A missing price is rendered as "no data (source X unavailable since …)", never as the previous value and never as zero.
- A disagreement renders both values with their sources and the tolerance that failed. It is never collapsed to a range (C3.4).
- Carry-forward is permitted only as an explicitly labelled derived figure (e.g. "month-end NGN valuation uses last trade of 27 Oct — 6 days old"). It must be produced by a named method and be visible as such in every surface, including AI text and exports.

#### 4.3.12 Preventing AI-generated numbers (contract C2)

**C2 is the binding contract** (V-004). It replaces both v0.1's list and Doc 7's numeric gate. What it means for market data:
1. The model never writes a digit, number word, month or weekday. It writes tokens (`{{fig:id|as=field|fmt=…}}`, `calc`, `date`, `count`, `dir`, `ref`, `quote`, `user`), and only the renderer produces the visible string (C2.2 items 1–3).
2. A token resolves only if a tool returned that figure ID in the current turn (allow-list). Its `as=` field, unit and currency must match the stored figure (semantic check, C2.2 items 4–5).
3. Market-data tools return figure objects with their C3 axes. They refuse figures that C3.4 bars from the requested tier, so an `expired` figure cannot be cited at all, and a `disputed` one only as two values side by side.
4. Arithmetic goes through the typed calc registry (C2.2 item 6). Vendor-page text, news and filings reach the model only as `quote` handles with digits masked (C2.2 item 7).
5. A span-map backstop rejects any digit in the final string that the renderer did not emit. On a first rejection the model regenerates once; on a second it refuses with a template, raises a review item and logs the turn (C2.2 items 10–11).
6. **Deleted:** v0.1's "Temperature 0" rule. Determinism comes from the contract, not from sampling settings, which may be unavailable when extended thinking is on (C2.2 item 11).
7. **MCP sources stay out of the model's path.** ADX's MCP server (U4) is called by a deterministic client in the controller, which writes figure objects to the store. The answering model never calls it directly, because an MCP result passed to the model would be raw numbers as free text.
8. The adversarial suite T2-01 to T2-12 runs on every prompt, tool or model change. Results are reported as an upper bound (0 failures in 200 cases → ≈ 1.5% at 95%), not as "zero" (C2.3).

### 4.4 Worked examples (synthetic unless stated; `doc05c_revision_checks.py`)

**Example A — bonus issue on a synthetic NGX stock "SYNTH PLC", with NGX date sequencing.**
- **Notice.** A 1-for-4 bonus. The issuer notice is N5, PDF ref `doclib/synth-bonus-2026.pdf`. The qualification date is Friday 30 Oct 2026. Under T+1 (in force from 1 Jun 2026) the ex/mark-down date is also 30 Oct (E4 derivation). The new shares are listed and credited by CSCS 25 business days later, on 4 Dec 2026.
- **Prices.** Raw closes: 29 Oct NGN 100.00; 30 Oct NGN 80.50. The adjustment factor of 0.8 applies to all pre-ex closes, so the adjusted 29 Oct close is 80.00. The adjusted ex-date return is +0.62%, within the ordinary range, so no review item. The unadjusted series would show −19.5%: the "false crash".
- **Shares.** Shares outstanding move from 1,000 m to 1,250 m only on 4 Dec. v0.1's rule 5 would have **blocked** the record. Under v0.2 the price factor applies on 30 Oct, and the shares figure is `ageing` with an open CA lifecycle until the credit date, which falls within N = 60 business days.
- **EPS.** Net income is NGN 12,500 m (from an NGN'000 statement, `scale = 3`, converted at ingest). Recomputed EPS on post-bonus shares is NGN 10.00. Vendor EPS of NGN 12.50 is not bonus-adjusted: a 25% variance, so `disputed`, with the filing-derived value shown and the note "vendor EPS not bonus-adjusted".

**Example B — FX provenance, real observations of 2026-11-02, re-graded.** CBN NFEM as relayed by an aggregator was 1,346.26; Frankfurter v2 gave 1,345.01, a 0.09% difference. v0.1 marked the CBN figure `auto_validated`, confidence B. That was wrong on two counts:
- the CBN value came through an aggregator, not from a CBN snapshot;
- Frankfurter lists CBN among its NGN providers [S109], so the comparison is `same_upstream`, not independent.

Under C3 the figure stays V=`candidate` until the CBN Excel export is attached as the evidence snapshot. It then becomes `auto_validated`, C=`same_upstream`, and is conclusion-eligible only under the single-source sampling rule. The parallel rate of 1,382/1,388 is stored as `parallel_indicative`, confidence D, and never used for valuation or tax. USD/AED 3.6725 equals the registered peg, so there is no deviation.

**Example C — the policy-rate record and the 27.50 failure (REAL dates; script part A).**
- **Entry.** The repository constant `cbRate: 27.50`, `nextMeeting: '2026-03-25'` was committed on 2026-03-02 (d9ad9d5).
- **Primary record** (CBN decisions page, fetched 2026-11-04 [S107]):
  - 27.50% retained through July 2025;
  - 27.00% from 23 Sep 2025, retained 25 Nov 2025;
  - **26.50% from 24 Feb 2026**;
  - retained 20 May and 21 Jul 2026;
  - 23.00% from 22 Sep 2026.
- **Error at entry.** The entered value was 100 bp above the rate in force. It had last been true on 22 Sep 2025, 160 days before entry. No MPC was scheduled on 25 Mar 2026; the next meeting after entry ended on 20 May 2026.
- **v0.1 control (expiry only).** Expiry was set from the typed date + 7 days, so the value showed as "fresh" until 2026-04-01: 30 days of a false number certified fresh.
- **v0.2 control (C3.5).** The entry check compares the value with the primary snapshot: 27.50 ≠ 26.50, so it is **blocked at entry**. `expiry_at` comes from the calendar: 2026-05-20 + 7 = 2026-05-27. This is the same result as the contract's `c3()`.
- **Same commit, US rate.** The Fed figure in `ratesData.ts` (commit 310e0ad, same day; 4.25%, labelled "accurate as of March 2026", `lastChange: '2024-12-18'`) was 75 bp above the 3.50% lower bound in force since 11 Dec 2025 [S114]. The same check blocks it.
- **Today.** The repository constant is 450 bp from the rate in force (23.00%).

The current record is shown in §4.3.1.

**Agreed account with Doc 5a.** v0.1 of this document said the value "would have shown 'expired since 2026-04-01'". Doc 5a v0.1 said "expired since February 2026". Neither is right. The first certifies a false value as fresh for a month. The second implies the value had once been right and then decayed. The record shows it was wrong at entry, and only an entry-time primary-source check catches that. Doc 5a must adopt this account (§6).

### 4.5 Failure analysis of the repository's figure failures

**Scope.** The founder's prior Nigerian tracker is not available. What sources it used, and whether it shares code or authorship with NEXUS, is **unknown — founder to confirm** (brief §1). v0.1 said NEXUS "shares the author and era"; that was an unsupported assumption and is withdrawn. The causes below are what the NEXUS repository shows [S93]. They are plausible, not proven, causes of the tracker's failure (E5 as an explanation of the tracker; E2 as descriptions of the repository).

| # | Root cause | Evidence in repo [S93, S110] | Effect on users | Control |
|---|---|---|---|---|
| **R0** | **Fact wrong at entry / false as-of assertion** | `cbRate: 27.50` committed 2026-03-02, when CBN's rate was 26.50% [S107]; `nextMeeting: '2026-03-25'` was not a scheduled date. Fed 4.25% committed the same day (310e0ad) vs 3.50% in force [S114]; "accurate as of March 2026" labels on values already wrong | False numbers with a false freshness label. An expiry control certifies them as fresh | C3.5 entry check (snapshot, value equality, as-of not earlier than latest decision); calendar-derived `expiry_at`; pre-go-live re-verification of every seeded value; CODEOWNERS on seeds (§4.3.6) |
| R1 | Hardcoded world facts | `cbRate: 27.50`; static central-bank table; `economicCalendar.ts` "accurate as of March 2026" | 100 bp wrong at entry; 450 bp by 22 Sep 2026 | §4.3.6 registry, lint, grep, monitor |
| R1a | Duplicate, inconsistent copies of one fact | ECB 2.65 in `TransmissionMap.tsx` vs 2.50 in `countryProfiles.ts` and `mapData.ts` | Two screens disagree with no way to tell which is right | One registry record per fact; the `Figure` type (§4.3.6) |
| R2 | Unofficial or undocumented endpoints | Yahoo v7/v8, Stooq CSV, CBOE CDN, rss2json, Binance via Vite proxy | Silent breakage; terms-of-service exposure (F19) | Source registry with licence records; only licensed or official sources feed the store |
| R3 | Failure swallowed as empty or cached | `catch { return [] }`; cached closes returned on error without age | Last good value looks current | Feed status per series; retrieval timestamps; age badges; cache never "truth" |
| R3a | Missing value defaulted to zero | `price: q.regularMarketPrice ?? 0`, `change24h: q.regularMarketChange ?? 0` (`yahooService.ts`) | A missing change shows as 0%: a false "unchanged" | Empty ≠ zero; no defaulting in the data layer (P20) |
| R4 | No as-of or source on values | `Ticker` type has price, change, volume only | User cannot tell 2 minutes from 2 months | Provenance schema mandatory (§4.3.1) |
| R5 | Unit/semantic mislabel | `CPIAUCSL` "US CPI YoY %", `GDP` "growth %" | Index level 3xx displayed as 3xx% | Unit/scale fields; series registry; C2 `as=` check; golden tests |
| R6 | Placeholder substitution across markets | Nigeria `yahooBond: '^TNX'` (US 10-year) | Wrong country's yield shown as Nigeria's | Entity master by MIC/ISIN; no cross-market placeholders |
| R7 | Unsourced composite scores | `instabilityScore: 72` and breakdown | Pseudo-precision | Derived figures require method and inputs |
| R8 | LLM restating injected numbers | `buildContext()` + "Cite specific levels and spreads" | Fabricated or stale figures in prose (F24) | C2 (§4.3.12) |
| R9 | Secrets in browser storage | Zustand `persist` of API keys | Key leakage; vendor account suspension | Server-side secrets (Security team) |
| R10 | No tests, no CI, client-only | Repo has no tests | Regressions undetected | Golden-dataset CI; DQ dashboard; server-side store with audit log |
| R11 | Vendor symbol drift | `.LG`, `^NGSEINDX`, `NGN=X` with no alias map | Quietly missing instruments | Versioned symbol maps; I axis; schema-drift alarms |

**Ordering.** R0 comes first because it is the only cause that the v0.1 control set could not catch. Every other control assumes the value was right when it entered the system.

### 4.6 Recommended data stack and estimated costs (recomputed; V-012)

Costs use prices seen (§4.1, NGX re-read 2026-11-04) and the 2026-11-02 illustrative FX. Annual fees are divided by 12. NGX fees exclude 7.5% VAT (pricelist note 6.4) and withholding tax [S3, S6 cl. 10.8]. FMDQ's 2023 figures **include** VAT, and FMDQ's own USD column is struck at NGN 500/USD, so they are converted here at 1,345.01 instead. Professional and non-professional end users pay the same NGX fees (pricelist note 6.2) [S3]. For the general structure of exchange display, non-display and redistribution fees see [S95] (snippet only). Figures from script part B.

**NGX core feed: the 2×2** (EOD prices + Interday history for one "specified securities" set; non-display = "Delayed Data for Financial modelling", NGN 1,250,000 / USD 7,500):

| Basis (EUA cl. 10.7: naira for end users within Nigeria, USD outside) | Without non-display | With non-display |
|---|---|---|
| **Local** | NGN 425,000/yr ≈ **USD 26/mo** (USD 28 incl. VAT) | NGN 1,675,000/yr ≈ **USD 104/mo** (USD 112 incl. VAT) |
| **International** | USD 2,000/yr ≈ **USD 167/mo** | USD 9,500/yr ≈ **USD 792/mo** |

International figures are shown ex-VAT. Whether Nigerian VAT applies to a supply to a non-resident end user is a Doc 6 question; if it does, add 7.5% (USD 179 and USD 851).

**Sensitivities** (USD/month, with non-display, ex-VAT):

| | Local | International |
|---|---|---|
| Base (as above) | 103.78 | 791.67 |
| If the general "Non-Trading Related activities … payable for all types of Non-Display Usage" line (NGN 2,500,000 / USD 15,000) applies instead of the modelling line | 181.23 | 1,416.67 |
| Plus the API bandwidth Entry band ("for direct connection to The Exchange", NGN 200,000 / USD 1,000), if NGX applies it to API v3 subscribers | 116.17 | 875.00 |
| If Interday is priced per security and five sets are needed | 178.13 | 1,125.00 |

**Personal MVP stack (founder only).**

| Layer | Choice | Monthly cost | Legal caveat |
|---|---|---|---|
| NGX prices & history (system of record) | NGX API: EOD + Interday | USD 26–792 per the 2×2; up to ≈ USD 1,417 in the sensitivities | Natural-person eligibility, local/international status and non-display treatment to be confirmed **in writing** by NGX (§9) |
| NGX dividends & CA (optional in month 1) | Dividends (specific) NGN 250,000 / USD 1,000*; News & CA NGN 650,000 / USD 2,500 p.a. | ≈ USD 56 local; ≈ USD 292 international | *The international dividends price is labelled "Delayed $1,000 / Real Time $3,000" on the portal [S9]; ask NGX |
| NGX comparators (copy-fidelity checks only) | CSCS daily list; Mansa Free; Kobo Personal | USD 0 | Licence status undocumented; `same_upstream`; nothing displayed on their authority alone |
| Filings | NGX doclib PDFs; SEC EDGAR | USD 0 | SEC: ≤ 10 req/s, declared User-Agent |
| **UAE — ADX** | ADX MCP Starter (free; 100 tool calls/month, current or last-day history [S61]) or AED 9.99–49.99/mo (≈ USD 2.72–13.61), called by a deterministic client | USD 0–14 | Licence text unread (adx.ae 403) |
| **UAE — DFM: explicit MVP gap** | **No licensed machine-readable route found.** DFM holdings are valued from custodian or broker statements, which System A already ingests (`method = observed`, source = statement page, as-of = statement date), with a badge "valued from statement of {{date}}" | USD 0 | DFM website data is display-only (15-min delayed); provider list and fees PDF did not render; API docs "Filenotfound" (re-checked 2026-11-04) |
| US prices | Tiingo Starter (free) or Power USD 30; EODHD Historian USD 19.99 as a second (same-upstream) vendor | USD 0–50 | "Personal use only" clauses |
| FX | CBN NFEM Excel export (free; primary snapshot); Frankfurter v2 (same-upstream comparator); parallel aggregator (informational) | USD 0 | Provider-endpoint terms |
| Macro & rates | CBN decisions page, NBS, FRED (key, attribution), Treasury, World Bank, IMF | USD 0 | FRED notice; World Bank non-commercial general terms |
| **Validation labour** | Founder as sampler under the single-source protocol with the C3.3 v0.2 floor (§4.3.10); checks labelled "self-checked" | ≈ 26 h/yr (≈ 30 min/week), E5 | Founder to confirm |
| **Total cash** | | **Floor ≈ USD 26/mo** (local, no non-display, free secondaries). **≈ USD 104/mo** if personal analytics is non-display (local). **≈ USD 1,147/mo** international with non-display, optional NGX feeds and paid US/ADX. **Ceiling ≈ USD 1,990/mo** (international, the "Non-Trading" non-display line, API band, optional feeds, VAT on NGX, paid US/ADX) | |

**UAE-equity analytics gap (consistency pass, I6).** With this stack, UAE equities get **exposure but no risk or goal analytics** in the MVP. DFM has no licensed route, so positions are valued from statements (U9). ADX Starter carries current or last-day prices only, and whether a paid tier's history and terms would serve is unverified (U4). Neither meets Doc 5b's price floors (60 / 250 / 1,000 trading days) or C6's 36-month rule. UAE equities therefore appear in value, allocation, currency and concentration views. No volatility, VaR, drawdown, correlation, stress or goal figure is computed for them (5b §4.1). The UI labels each such holding "valued from statement of ‹date›" and "risk and goal analytics not available: no licensed price history". Portfolio-level risk states the share of value it leaves out (Doc 8 §4.5.7). The gap closes only with a licensed DFM route or an ADX tier with history whose terms permit processing.

**Fixed income (Rec 11, Later).** FMDQ note 9 says "Only Real-Time API is available for Closing Prices" [S21]. A non-member end user who needs bond closing prices by API therefore needs the Daily Quotations List (NGN 322,500) plus the real-time API connection (NGN 537,500), not the EOD API (NGN 322,500). That is NGN 860,000 a year including VAT, ≈ USD 639 at 1,345.01 (FMDQ's own column, at NGN 500/USD, says USD 1,720). It would be NGN 645,000 if an EOD API sufficed.

**Commercial product (Nigerian retail/diaspora; display of NGX data to users).** The minimum NGX set from the 2026 schedule [S3] is:
- a display licence: Website/Mobile EOD NGN 120,000 or delayed NGN 250,000;
- a distribution licence: EOD NGN 1,500,000 or delayed NGN 2,000,000;
- non-display: NGN 1,250,000, or NGN 2,500,000 under the general line;
- API bandwidth: NGN 200,000–400,000;
- end-user fees where real-time is shown (Level 1 USD 10/user/month local).

With FMDQ's NAFEM EOD distribution licence (NGN 3,359,375, VAT-inclusive) [S21], the floor is **NGN 6.4–8.5 million a year (≈ USD 4,800–6,300) ex-VAT on NGX**, before UAE/US commercial data and before legal review (script part C). This is consistent with v0.1's NGN 5–8 million but now itemised. (E5: assembled from published schedules; NGX quotes are bespoke.)

## 5. Alternatives considered and rejected

| Alternative | Why rejected |
|---|---|
| Scrape NGX, DFM or Investing.com pages | Explicitly prohibited by NGX Policy §8.2.7 and Investing.com terms; fragile; no provenance [S5, S50] |
| Rely solely on free third-party NGX APIs (EODHD, Mansa, Kobo) | Licence status undocumented; they copy NGX, so they add no independent evidence; EODHD discloses non-exchange sourcing; redistribution rights unclear. Acceptable only as copy-fidelity comparators [S12, S40, S46] |
| Count agreement between NGX and its copies as "two-source validation" (v0.1) | Same upstream; agreement proves faithful copying only (§4.3.3) |
| Expiry-only control for world facts (v0.1 Example C) | Cannot detect a value that was wrong at entry; it certified 27.50% as fresh for 30 days (R0) |
| Keep Yahoo Finance unofficial endpoints | Terms forbid automated collection and commercial reuse; endpoints change without notice [S80, S81] |
| Bloomberg/LSEG terminal | Cost ceiling (aggregator estimates USD 22k–32k/user/yr, unverified); terminal licences do not permit feeding a product [S52] |
| LLM with web search to "look up" figures | No provenance, no licence, demonstrated error rates [S101] |
| Let the answering model call ADX's MCP server directly | MCP results would reach the model as raw numbers, breaking C2 (§4.3.12 item 7) |
| "Temperature 0" as a determinism control (v0.1) | Possibly unavailable with extended thinking, and not needed under C2's token contract |
| Build a full corporate-actions database from vendor feeds without issuer documents | Cannot be validated; kept as a candidate layer only |
| Interpolate or carry forward silently to keep charts continuous | Reproduces the original failure; permitted only as labelled derived figures |
| Human validation of every conclusion-driving figure (v0.1 §4.3.10) | About 264 hours a year for a 20-holding book; would be rubber-stamped. Replaced by the C3.3 sampling protocol |
| DFM via the 15-minute-delayed website | Display-only; no export; would require scraping |

## 6. Cross-department dependencies

**We need:**
- **Legal & Compliance:**
  - review the NGX EUA, Policy and API order form for a natural person;
  - confirm local vs international fee status;
  - state whether private analytics is "Non-Display Usage" and which pricelist line applies;
  - review ADX MCP and vendor terms;
  - advise on purge or retention of derived figures at licence end (C3.8 Q1; EUA cl. 13.5);
  - advise on redistribution before any commercial display.
- **Platform & Security:** server-side store; secrets management; CI with the lint/grep gates (§4.3.6); private licensed storage for the golden run; audit-log retention.
- **Investment Research (Doc 5a):**
  - adopt the merged freshness table (§4.3.2) and the C3 mapping in 5a §4.10;
  - adopt the agreed "wrong at entry" account of the MPR (§4.4 Example C);
  - supply NGX filing deadlines and the field list;
  - confirm which fundamentals are conclusion-driving.
- **Portfolio & Quant (Doc 5b):** the adjusted-series contract; the C5 FX hierarchy; benchmark constituents. For NGX beta under non-synchronous trading, use the Scholes–Williams and Dimson estimators [S104, S105].
- **Tax (Doc 6):** the legally required FX field and CPI vintage; VAT on NGX fees for a non-resident end user.
- **AI (Doc 7):** adopt C2 in §4.6; deterministic MCP clients.
- **Product/UX (Doc 8):** C3.4 states, including the "risk and goal analytics not available" label for UAE equities (§4.6), the "single source", "same upstream", "valued from statement" and "no trade since" badges.
- **Finance (Doc 9):** use the §4.6 2×2 and the sensitivities in the cost model (V-012).
- **Founder:**
  - residency, which sets the local or international basis (brief §4);
  - whether they will act as sampler (≈ 30 min/week with the v0.2 floor; checks labelled "self-checked");
  - whether statement-based DFM valuation is acceptable for the MVP;
  - what sources the prior tracker actually used.

**Others need from us:**
- the market-data field list for the C3 schema (§4.3.1);
- the source registry with licence scopes, `terms_version` and independence groups (Legal, AI);
- the merged freshness table (Product, 5a);
- the golden dataset and synthetic fixtures (Engineering);
- the DQ dashboard (audit, founder);
- the **registered break list** (devaluation, unification and FX-regime dates, P10, each a C3.5 world fact) for Doc 5b §4.6 and goal-engine step G-2. This department owns it (consistency pass, I11).

## 7. Risks, open uncertainties and disagreements

1. **Engineer vs audit function (preserved).** Engineering position: start with free sources (CSCS, Mansa, Kobo, Tiingo, Frankfurter) and ship; licence later. Audit position: nothing enters the system of record without a licence record, and free NGX sources add no independent evidence because they copy NGX. Proposed resolution: the MVP ingests free sources from day one *as comparators*; no NGX figure is shown without a badge stating its source and licence status; the first conclusion that depends on NGX waits for the NGX feed and the founder's sampling.
2. **NGX eligibility, fee basis and non-display** (F1, F3, §4.6). The range is USD 26 to about USD 1,417 a month for the NGX core alone. Only NGX, in writing, can settle it.
3. **Which non-display line applies (partial disagreement with R05c).** R05c costed the "Delayed Data for Financial modelling" line (NGN 1.25m / USD 7,500). The same pricelist section lists "Non-Trading Related activities … payable for all types of Non-Display Usage" at NGN 2.5m / USD 15,000 [S3]. We think R05c's figure is the more likely reading for EOD-based analytics, but it is not safe to call it the upper bound. Both are shown. Resolution: NGX's written answer.
4. **NGX independence.** No independent second source exists for NGX prices. NGX-based conclusions rest on the single-source protocol and the founder's sampling. If the founder will not sample, those conclusions are refused.
5. **UAE access.** DFM is an explicit MVP gap, valued from statements. adx.ae, CBUAE and FCSC were unreachable (403); ADX MCP terms are unread. A UAE-resident purchase may be needed.
6. **NBS methodology.** A January 2026 methodology or reference-period change is reported but unverified. The back-series revision is confirmed only indirectly (F12).
7. **NGX rules not yet fetched from the Rulebook:** bonus listing timelines, ex-date derivation, filing deadlines, the daily-limit conflict (±10% vs ±5%). The CA engine and freshness table depend on them (E4).
8. **Next CBN MPC date** is not stated on the decisions page. The MPR record runs on the cadence fallback until a calendar record is sourced.
9. **Cost ceiling figures (Bloomberg/LSEG) are aggregator estimates**, not quotes.
10. **Vendor renames and 301 redirects are frequent** (F25). Every integration needs a drift alarm.
11. **Contract gap (raised, not departed from).** C3 has no figure-level state for "pending corporate action". We represent it as a CA-record lifecycle plus F=`ageing` on shares outstanding (§4.3.4) and ask the contract owner to confirm that this is acceptable (§11).

## 8. Recommendations, ranked

| Rank | Recommendation | Class |
|---|---|---|
| 1 | Implement C3 (axes, transitions, C3.4 tiers) and the C3.5 **entry-time primary-source check** before any ingestion code; re-verify every seeded value before go-live (§4.3.1, §4.3.6, R0) | Personal-MVP must-have |
| 2 | Request an NGX Market Data API quote (EOD + Interday; later dividends/CA) as a Non-Professional End User, asking **in writing** about natural-person eligibility, the fee basis, whether private analytics is non-display and which line applies, API bandwidth fees, Interday pricing per security, and its list of delayed/EOD display licensees; Legal to review; record the answer as a dated decision | Personal-MVP must-have |
| 3 | Compute freshness at read time from the merged table, with mandatory badges and the gap-not-interpolation rule (§4.3.2, §4.3.11) | Personal-MVP must-have |
| 4 | Enforce C2 for every figure in AI output; retire the prompt-injection pattern; deterministic MCP clients (§4.3.12) | Personal-MVP must-have |
| 5 | Enforce "no silent constants" by type, lint, grep, CODEOWNERS and a scheduled monitor; register this document's own thresholds (§4.3.6) | Personal-MVP must-have |
| 6 | Build the corporate-action engine with issuer-document gating, NGX date fields, CA lifecycle, settlement-cycle history, succession table and the extended golden dataset (§4.3.4, §4.3.7) | Personal-MVP must-have (NGX subset first) |
| 7 | Corroboration with independence groups, per-field E5 tolerances reset from trial data, and the single-source sampling protocol with the founder as sampler, labelled "self-checked" (§4.3.3, §4.3.10) | Personal-MVP must-have |
| 8 | Official FX per C5.1: the CBN "NFEM Rate (₦/US$)" (`nfem_vwap`) from the Excel export snapshot; FMDQ and Frankfurter as same-upstream comparators; parallel rate indicative only; peg registered as a world fact | Personal-MVP must-have |
| 9 | **DFM: statement-based valuation** for DFM holdings in the MVP, recorded as an explicit gap; keep looking for a licensed machine-readable route | Personal-MVP must-have (fallback); licensed route Later |
| 10 | Evaluate ADX MCP Starter under its actual terms, through a deterministic client | Later |
| 11 | FMDQ end-user data (Daily Quotations List + real-time API for closing prices) once fixed-income analytics are in scope | Later |
| 12 | Commercial redistribution licences (NGX website/mobile display, distribution, non-display; FMDQ) | Later (gate on commercialisation decision) |
| 13 | Bloomberg/LSEG terminal | Do-not-build (yet) |
| 14 | Any scraping of exchange or publisher sites | Do-not-build |

**Five-question test, top items.**

*Rec 1 and 3 (status axes, entry check, freshness).*
1. **Problem:** the repository displayed values that were wrong when entered and labelled current (R0), and values that later decayed (R1), with no way for the user to tell.
2. **Who:** the founder first; any Nigerian retail user later, because NGX data is thin and comparators copy the exchange.
3. **Evidence:** the CBN and Fed records against the commit date (E2) [S107, S110, S114]. Datastream error studies support provenance and vintage controls: Ince & Porter on vendor return-data errors [S102]; Ljungqvist, Malloy & Marston on alterations to historical I/B/E/S analyst-recommendation data [S106] (E2, verified).
4. **Build/validate:** a C3 store plus entry checks plus golden-dataset CI with a wrong-at-entry trap. Validated when the trap is blocked and the dashboard shows no conclusion-driving figure outside C3.4.
5. **Metric:** 100% of world facts carry a matching primary snapshot; 100% of conclusion-driving figures are C3.4-eligible; zero undisclosed gaps.

*Rec 2 (NGX licence).*
1. **Problem:** no licensed NGX system of record, and an unknown cost that varies about 30- to 55-fold.
2. **Who:** the founder.
3. **Evidence:** the NGX schedule and EUA (E2) [S3, S6, S9].
4. **Build/validate:** a written NGX answer, then the two-week trial.
5. **Metric:** a dated decision with a cost inside the §4.6 range; trial completeness ≥ 99% of sessions against CSCS.

*Rec 4 (C2).*
1. **Problem:** fabricated or stale numbers in prose.
2. **Who:** anyone reading AI explanations.
3. **Evidence:** F24; C2.
4. **Build/validate:** the T2-01 to T2-12 adversarial suite.
5. **Metric:** a 95% upper bound on unreferenced-number rate ≤ 1.5% at 200 cases, tightening as cases grow; false-rejection rate reported.

*Rec 6 (corporate actions).*
1. **Problem:** bonus issues create false crashes and wrong per-share metrics (P2–P3), and v0.1's rule 5 would have blocked legitimate NGX bonuses.
2. **Who:** NGX investors.
3. **Evidence:** no vendor documents NGX adjustment (F1–F7); NGX date sequencing (E4 until the Rulebook is fetched).
4. **Build/validate:** factor tests against issuer notices on the golden traps.
5. **Metric:** 100% of ex-date gaps on holdings either explained by a CA record or raised for review.

## 9. Required validation before implementation

1. Written confirmation from NGX on: individual eligibility; fee basis (NGN vs USD); whether private analytics is non-display, and which line applies; API bandwidth fees; Interday pricing per security; rate limits and schema. Then a two-week technical trial measuring actual delay, completeness and per-field CSCS differences, from which the §4.3.3 tolerances are reset.
2. Legal sign-off on: the NGX EUA and Policy; ADX MCP terms; Tiingo/EODHD/Mansa/Kobo terms for personal use; retention or purge of derived figures at licence end. A written decision on Yahoo (recommended: remove).
3. Fetch and register from NGX rulebooks: trading hours (Doc 5a F2 already E2), tick sizes and price groups (Doc 5a F3), the daily limit (±10% vs ±5%), filing deadlines, bonus listing timelines and ex-date derivation under T+1.
4. Source the CBN MPC calendar and the NBS CPI release calendar as calendar records. Confirm the NBS January 2026 methodology change from the NBS release note and set `methodology_version`.
5. Reach CBUAE and FCSC (possibly from a UAE network) for the peg statement, EIBOR and CPI access terms.
6. Build the golden dataset (≥ 20 securities) in private licensed storage, with the trap list of §4.3.7 including the wrong-at-entry case. Build the synthetic fixtures for public CI.
7. Prototype C2 on synthetic data and run T2-01 to T2-12.
8. Re-verify every seeded world fact against a primary snapshot (C3.5) before go-live, and record the results.
9. Confirm with the founder: the sampler role and weekly time (≈ 30 min, "self-checked"), residency (fee basis), DFM statement valuation, and the prior tracker's sources.
10. Done in v0.2: academic references S102–S106 verified by DOI (2026-11-04).

## 10. Sources

Access date 2026-11-02 unless stated (v0.2 re-checks dated 2026-11-04); "reached" = page/file opened and read; "extracted" = PDF text extracted locally; "snippet" = search excerpt only; "not reached" = fetch failed.

- [S1] NGX, "Market Data" — https://ngxgroup.com/exchange/data/ — reached.
- [S2] NGX, "Data Pricing, Policies & Contracts" — https://ngxgroup.com/exchange/data/data-pricing-policies-contracts/ — reached.
- [S3] NGX, Market Data Pricelist, Schedule 3 (PDF metadata: created 12 Aug 2026) — https://ngxgroup.com/ngx-download/market-data-pricelist-2/?wpdmdl=41216 — extracted; re-downloaded and re-extracted 2026-11-04 (§1.2 non-display, §1.5, §4.2, notes 6.2, 6.4).
- [S4] The Nigerian Stock Exchange, Market Data Pricelist 2018, Schedule 4 — https://doclib.ngxgroup.com/market_data-site/market-data-services-site/Data%20Policies/NSE%20Market%20Data%20Pricelist%202018.pdf — extracted.
- [S5] NGX, Market Data Policy Document v2.0, effective 22/07/2020 (© 2022) — https://ngxgroup.com/ngx-download/market-data-policy/?wpdmdl=27017 — extracted.
- [S6] Nigerian Exchange Limited, Global Data Licence Agreement for End Users (© 2021) — https://ngxgroup.com/ngx-download/end-user-agreement/?wpdmdl=27014 — downloaded and extracted; re-extracted 2026-11-04 (cl. 3.1, 8.2, 10.7–10.8, glossary "Non-Display Usage").
- [S7] NGX, Historical Data Policy and Request Form — https://ngxgroup.com/ngx-download/historical-data-policy-and-request-form/?wpdmdl=27000 — not reached (redirect/HTML).
- [S8] NGX, "Historical Data" — https://ngxgroup.com/exchange/data/historical-data/ — reached.
- [S9] NGX, Market Data API portal, "Get started" (annual pricing) — https://marketdataapiv3.ngxgroup.com/portal/getstarted/index — reached; re-checked 2026-11-04.
- [S10] NGX, Market Data API Documentation — https://marketdataapiv3.ngxgroup.com/portal/Home/Documentation — reached.
- [S11] NGX, Equities Price List — https://ngxgroup.com/exchange/data/equities-price-list/ — reached.
- [S12] NGX, Vendors List ("Authorized Market Data Vendors"; "current list of NGX Real-time Market Data Vendors") — https://ngxgroup.com/exchange/data/vendors-list — reached; re-checked 2026-11-04.
- [S13] NGX, X-DataPortal — https://ngxgroup.com/exchange/data/x-dataportal/ — reached.
- [S14] NGX, Delisted Companies — https://ngxgroup.com/exchange/data/delisted-companies/ — reached.
- [S15] NGX, "FAQs on X-Issuer" (PDF) — https://doclib.ngxgroup.com/investors-site/becoming-an-investor/FAQs/FAQs%20ON%20X-ISSUER.pdf — snippet.
- [S16] Nairametrics, "Nigerian Exchange says use of Issuers' Portal for all issuers now mandatory", 30 Jun 2022 — https://nairametrics.com/2022/06/30/nigerian-exchange-says-use-of-issuers-portal-for-all-issuers-now-mandatory/ — snippet.
- [S17] CSCS Plc homepage — https://www.cscs.ng/ — reached.
- [S18] CSCS, Daily Price — https://www.cscs.ng/market-information/daily-price/ — reached.
- [S19] CSCS, API Services — https://www.cscs.ng/api-services/ — reached.
- [S20] CSCS, Charges and Fees (effective 1 Jan 2026 and 1 Feb 2025) — https://www.cscs.ng/charges/ — reached.
- [S21] FMDQ Exchange, Fees and Dues Framework 2023 (PDF created 25 Oct 2023) — https://fmdqgroup.com/exchange/wp-content/uploads/2023/10/FMDQ-Exchange-2023-Fees-and-Dues-Framework-.pdf — extracted; re-extracted 2026-11-04 (end-user tables, API connection, note 9).
- [S22] FMDQ Exchange, NAFEM Spot Rates Methodology, Oct 2023 — https://fmdqgroup.com/exchange/wp-content/uploads/2023/10/FMDQ-Exchange-NAFEM-Spot-Rates-Methodology-October-2023.pdf — snippet in v0.1; downloaded and extracted 2026-11-04 (§4, §5.2, §6.1–6.3).
- [S23] FMDQ Exchange homepage (quotes dated 29–30 Oct 2026) — https://fmdqgroup.com/exchange/ — reached.
- [S24] FMDQ, Benchmark Administration — https://fmdqgroup.com/exchange/market-data/benchmarks/ — reached.
- [S25] FMDQ e-Markets portal — https://emarkets.fmdqgroup.com/market/ — reached.
- [S26] FMDQ, Market Data — https://fmdqgroup.com/exchange/market-data/ — not reached (503).
- [S27] CBN, Data & Statistics index — https://www.cbn.gov.ng/rates/ — reached.
- [S28] CBN, Exchange Rates (NFEM) — https://www.cbn.gov.ng/rates/ExchRateByCurrency.html — reached (structure).
- [S29] CBN, Money Market Indicators — https://www.cbn.gov.ng/rates/mnymktind.html — reached (structure).
- [S30] CBN, Inflation — https://www.cbn.gov.ng/rates/inflrates.html — reached (structure).
- [S31] CBN Statistics Database — https://statistics.cbn.gov.ng/shop — reached (homepage).
- [S32] Nairametrics, "CBN resets MPR to 23%", 22 Sep 2026 — https://nairametrics.com/2026/09/22/cbn-resets-mpr-to-23/ — reached. Now a secondary mirror of [S107].
- [S33] National Bureau of Statistics homepage — https://nigerianstat.gov.ng/ — reached.
- [S34] Voice of Nigeria, "Nigeria's headline inflation drops to 14.63 per cent", 16 Oct 2026 — https://von.gov.ng/nigerias-headline-inflation-drops-to-14-63-per-cent/ — reached.
- [S35] NBS Nigeria (X post), rebased CPI, base 2024, Jan 2025 = 24.48%, Feb 2025 — https://x.com/NBS_Nigeria/status/1891805402762752452 — snippet.
- [S36] Tribune Online, analysis of CPI methodology (2026) — https://tribuneonlineng.com/?p=1294329 — not reached (403).
- [S37] Debt Management Office, FGN Bonds — https://www.dmo.gov.ng/fgn-bonds — reached.
- [S38] DMO, Bond Auction Results — https://www.dmo.gov.ng/fgn-bonds/auction — reached.
- [S39] abokiforex.app, rates page, 2 Nov 2026 10:09 WAT — https://abokiforex.app/ — reached (unofficial).
- [S40] EODHD, "XNSA Stock Market Exchange" — https://eodhd.com/exchange/XNSA — reached.
- [S41] EODHD, Pricing — https://eodhd.com/pricing — reached.
- [S42] Twelve Data, Nigerian Stock Exchange — https://twelvedata.com/exchanges/xnsa — not reached (404); snippet.
- [S43] Twelve Data, Pricing — https://twelvedata.com/pricing — reached.
- [S44] Mansa API, Docs — https://mansaapi.com/docs — reached.
- [S45] Mansa API, Pricing — https://mansaapi.com/pricing — reached.
- [S46] Kobo Terminal (formerly NGX Pulse), API — https://koboterminal.com/api (301 from https://ngxpulse.ng/api) — reached; re-checked 2026-11-04 (quote corrected).
- [S47] afx.kwayisi.org/ngx — not reached (503).
- [S48] African Markets, NGSE — https://www.african-markets.com/en/stock-markets/ngse — not reached (401).
- [S49] Stears — https://www.stears.co/ — reached.
- [S50] Investing.com, Terms and Conditions — https://www.investing.com/about-us/terms-and-conditions — reached (footer disclaimer).
- [S51] TradingView, Data coverage — https://www.tradingview.com/data-coverage/ — reached.
- [S52] CostBench, Bloomberg Terminal pricing pages (aggregator) — https://costbench.com/software/financial-data-terminals/bloomberg-terminal/ — snippet; unverified.
- [S53] ICE, Exchange and Market Data Access Fees 2026 (NGX = ICE NGX natural gas) — https://www.ice.com/publicdocs/data/Market_Data_Subscriber_Fees.pdf — snippet.
- [S54] DFM, Market Data Providers — https://www.dfm.ae/the-exchange/market-information/marketdata-providers — reached (list not rendered).
- [S55] DFM MarketWatch ticker — https://marketwatch.dfm.ae/ext/ticker/en — reached.
- [S56] DFM, Disclosures — https://www.dfm.ae/the-exchange/news-disclosures/disclosures — reached (entries not rendered).
- [S57] DFM API docs — https://api.dfm.ae/docs/ — not reached ("Filenotfound"; same on 2026-11-04).
- [S58] LSEG, Dubai Financial Market data page — https://www.lseg.com/en/data-analytics/financial-data/pricing-and-market-data/equities-market-data/dubai-financial-market — snippet.
- [S59] ADX, MCP Features — https://www.adx.ae/market-data-services/model-context-protocol/adx-mcp-features — not reached (403); snippet.
- [S60] ADX, Directory of Vendors — https://www.adx.ae/members-and-participants/vendors/directory-of-vendors — not reached (403); snippet.
- [S61] The Arabian Post, "ADX opens live market data to conversational AI", 14 Aug 2026 — https://thearabianpost.com/adx-opens-live-market-data-to-conversational-ai/ — reached; re-checked 2026-11-04 (Starter: "100 tool calls a month", "current or last-trading-day history"; DFM not mentioned).
- [S62] ICE, catalog: Abu Dhabi Securities Exchange — https://developer.ice.com/fixed-income-data-services/catalog/abu-dhabi-securities-exchange-adx — reached.
- [S63] UAE Capital Market Authority (formerly SCA) — https://www.uaecma.gov.ae/en/home.aspx (301 from sca.gov.ae) — reached.
- [S64] Central Bank of the UAE, Statistics / Forex & EIBOR / homepage — https://www.centralbank.ae/en/research-and-statistics/statistics/ — not reached (403).
- [S65] UAE FCSC, Statistics — https://fcsc.gov.ae/en-us/Pages/Statistics/Statistics.aspx — not reached (403).
- [S66] Bayanat.ae open data portal — https://bayanat.ae/ — reached.
- [S67] US SEC, "EDGAR Application Programming Interfaces" — https://www.sec.gov/search-filings/edgar-application-programming-interfaces — reached.
- [S68] US SEC, Webmaster FAQ (10 requests/second; declared User-Agent) — https://www.sec.gov/about/webmaster-frequently-asked-questions — reached.
- [S69] US SEC, Privacy and Security Policy — https://www.sec.gov/about/privacy-information — reached.
- [S70] Federal Reserve Bank of St. Louis, FRED API Terms of Use — https://fred.stlouisfed.org/docs/api/terms_of_use.html — reached.
- [S71] FRED API documentation — https://fred.stlouisfed.org/docs/api/fred/ — reached.
- [S72] ALFRED — https://alfred.stlouisfed.org/ — reached.
- [S73] US Treasury, Daily Treasury Par Yield Curve Rates 2026 — https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value=2026 — reached.
- [S74] US Treasury Fiscal Data, API documentation — https://fiscaldata.treasury.gov/api-documentation/ — reached.
- [S75] Massive (formerly Polygon.io), Pricing — https://massive.com/pricing (301 from polygon.io/pricing) — reached.
- [S76] Alpha Vantage, Premium — https://www.alphavantage.co/premium/ — reached.
- [S77] Financial Modeling Prep, pricing — https://site.financialmodelingprep.com/pricing-plans — not reached (403).
- [S78] Tiingo, Pricing — https://www.tiingo.com/about/pricing — reached.
- [S79] Nasdaq Data Link — https://data.nasdaq.com/ — not reached (empty/404).
- [S80] Yahoo, Terms of Service (versions dated 15 May 2025 and 2 Jan 2026; R05c reports "Last updated: 1 November 2026") — https://legal.yahoo.com/us/en/yahoo/terms/otos/index.html — reached; re-checked 2026-11-04 (clauses 2(d)(9) and 2(e) unchanged).
- [S81] Yahoo Developer Network, API Terms of Use (REV 3-2022) — https://legal.yahoo.com/us/en/yahoo/terms/product-atos/apiforydn/index.html — reached.
- [S82] Frankfurter v2 — https://frankfurter.dev/ , https://frankfurter.dev/currencies/ , https://api.frankfurter.dev/v2/rate/usd/ngn , https://api.frankfurter.dev/v2/rate/usd/aed — reached and probed 2026-11-02; currencies page re-checked 2026-11-04.
- [S83] European Central Bank, Euro foreign exchange reference rates — https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html — reached.
- [S84] exchangerate.host, Pricing — https://exchangerate.host/pricing — reached.
- [S85] Open Exchange Rates, Sign up/pricing and currencies.json — https://openexchangerates.org/signup , https://openexchangerates.org/api/currencies.json — reached.
- [S86] World Bank, "About the Indicators API Documentation" — https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation — reached.
- [S87] World Bank, Terms of Use (general; dataset terms referenced) — https://www.worldbank.org/en/about/legal/terms-of-use-for-datasets — reached.
- [S88] IMF, "IMF API" resource page — https://data.imf.org/en/Resource-Pages/IMF-API — reached.
- [S89] Financial Datasets, MCP Server docs — https://docs.financialdatasets.ai/mcp-server — reached.
- [S90] Financial Datasets homepage — https://www.financialdatasets.ai/ — reached.
- [S91] Distilla — https://distilla.ai/ — reached.
- [S92] Claude Connectors Directory — https://claude.com/connectors — reached (dynamic page).
- [S93] Repository `alhameenoki1-prog/Terminal-`: `src/data/countryProfiles.ts`, `src/services/{yahooService,yahooHistService,fredService,internationalYieldsService,chatService,ratesData}.ts`, `src/components/ChatPanel.tsx`, `vite.config.ts` — read 2026-11-02.
- [S94] GitHub, we-promise/sure PR #3629 "add Mansa API provider for NGX" — https://github.com/we-promise/sure/pull/3629 — snippet (third-party).
- [S95] Databento, "Understanding exchange license fees" — https://databento.com/blog/understanding-exchange-fees — snippet.
- [S96] EMTA, NAFEX methodology (PDF) — https://www.emta.org/media/21ehrqek/796e70b5-690b-4923-819c-0be10d8725ac.pdf — snippet.
- [S97] Proshare, Daily Rates Download — https://proshare.co/exchangerates/DailyRatesDownload — snippet (unverified value).
- [S98] The Guardian Nigeria, "Rebased CPI: New era for Nigeria's inflation tracking" — https://guardian.ng/business-services/rebased-cpi-new-era-for-nigerias-inflation-tracking/ — snippet.
- [S99] Africa Check, "Factsheet: Nigeria rebases its economy again" — https://africacheck.org/fact-checks/factsheets/factsheet-nigeria-rebases-its-economy-again-heres-what-sets-it-apart — snippet.
- [S100] Leadership, "CSCS deepens market efficiency with new investor-centric services" — https://leadership.ng/cscs-deepens-market-efficiency-with-new-investor-centric-services/ — snippet.
- [S101] Islam, P., Kannappan, A., Kiela, D., Qian, R., Scherrer, N., Vidgen, B., "FinanceBench: A New Benchmark for Financial Question Answering", arXiv:2311.11944, 20 Nov 2023 — https://arxiv.org/abs/2311.11944 — **[verified]** via arXiv API and abstract page (checked 2026-11-04).
- [S102] Ince, O. S., Porter, R. B., "Individual equity return data from Thomson Datastream: Handle with care!", Journal of Financial Research, 2006, doi:10.1111/j.1475-6803.2006.00189.x — **[verified]** (reference-lookup tool, OpenAlex by DOI, 2026-11-04).
- [S103] Lesmond, D. A., Ogden, J. P., Trzcinka, C. A., "A New Estimate of Transaction Costs", Review of Financial Studies, 1999, doi:10.1093/rfs/12.5.1113 — **[verified]** (OpenAlex by DOI, 2026-11-04).
- [S104] Scholes, M., Williams, J., "Estimating betas from nonsynchronous data", Journal of Financial Economics, 1977, doi:10.1016/0304-405X(77)90041-1 — **[verified]** (OpenAlex by DOI, 2026-11-04).
- [S105] Dimson, E., "Risk measurement when shares are subject to infrequent trading", Journal of Financial Economics, 1979, doi:10.1016/0304-405X(79)90013-8 — **[verified]** (OpenAlex by DOI, 2026-11-04).
- [S106] Ljungqvist, A., Malloy, C., Marston, F., "Rewriting History", Journal of Finance, 2009, doi:10.1111/j.1540-6261.2009.01484.x — **[verified]** (OpenAlex by DOI, 2026-11-04).
- [S107] Central Bank of Nigeria, Monetary Policy Committee decisions — https://www.cbn.gov.ng/MonetaryPolicy/decisions.html — reached 2026-11-04 (299th–307th MPC decisions quoted; no next meeting date stated). E2.
- [S109] Frankfurter, Providers and CBN provider page — https://frankfurter.dev/providers/ , https://frankfurter.dev/providers/cbn/ — reached 2026-11-04 (CBN listed; NGN base; from 2001-12-11; blending method not stated).
- [S110] Repository `alhameenoki1-prog/Terminal-`, `git log`: commit d9ad9d5 (2026-03-02) adds `src/data/countryProfiles.ts` and `src/components/TransmissionMap.tsx`; commit 310e0ad (2026-03-02) adds `src/services/ratesData.ts`; commit 3eed862 (2026-03-03) adds `src/data/economicCalendar.ts` — checked 2026-11-04.
- [S111] Portfolio OS, `CANONICAL_CONTRACTS.md` (C1–C7), v0.1, 2026-11-04 — binding for this document (C2, C3, C5).
- [S112] Portfolio OS, Review R05c of Document 5c, 2026-11-04 (`reviews/R05c_review_market_data.md`).
- [S113] Portfolio OS, Document 5a, Investment Research Methodology, v0.1 (§3 F2–F4, F13, F14; §4.10).
- [S114] Board of Governors of the Federal Reserve System, "Open Market Operations" (target-range history) — https://www.federalreserve.gov/monetarypolicy/openmarket.htm — reached 2026-11-04 (3.50–3.75% from 11 Dec 2025; page "Last Update" 16 Sep 2026 precedes its 17 Sep 2026 entry, noted). E2.


*Simulated specialists are not licensed professionals: licensing conclusions above require review by a lawyer admitted in Nigeria and the UAE before any contract is signed or any data is displayed to third parties.*

## 11. Revision history and response to review

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-11-02 | Draft for cross-department review |
| 0.2 | 2026-11-04 | Revised after review R05c [S112] and against `CANONICAL_CONTRACTS.md` C2, C3, C5 [S111]. Numbers recomputed by `research/scripts/doc05c_revision_checks.py` |
| 0.2 | 2026-11-04 | Consistency pass, 2026-11-04 (V-031, V-032, V-033; Doc 5 §9.2 I3–I6, I9, I11). The MPR record is named as the single registry record. NGX ±10% limit is `candidate` in step with 5a and 5b. T+2 date cited at E3. Country-risk freshness row added. UAE-equity analytics gap stated with its UI label. Break-list ownership stated. No number changed; version stays 0.2 |
| 0.2 | 2026-11-04 | **Contract conformance to contracts v0.2, 2026-11-04** (CC-3, CC-10, RT-A rate field, RT-A independence, RT-B, C8). §4.3.1: `price_type` gains `nfem_vwap`, `closing`, `simple_average`, `high`, `low` and loses `central`; `period_id`/`scope_id` added; `independence` replaces "validator ≠ ingesting process". §4.3.2: C3.2a filing-calendar rules cited. §4.3.3: CBN row re-keyed to "NFEM Rate (₦/US$)"; sampling floor max(⌈n/20⌉, min(n, 4)); founder checks "self-checked". §4.3.4: C3.3 v0.2 cited; `ca_set_version` refusal. §4.3.9: retention per C8. §4.3.10: the founder is `self`, not independent; workload recomputed with the floor (script part D): 527 checks, ≈ 26.4 h/yr, ≈ 30 min/week (was 392, 19.6 h, 23 min). §1 item 2, §4.6 labour row, §6, Rec 8 and open item 1 follow. Script re-run under `python3 -I`; only part D's output changed |

**Response to each finding.** Finding IDs are R05c's (B = blocking, M = major, m = minor). Rows without an ID come from R05c §3 (evidence-grade audit, "G" + row order), §5 (cross-document contradictions, "X" + item) and §6 (Investment Committee questions, "Q" + item).

| Finding | Revision log | Action | Where | Note |
|---|---|---|---|---|
| B1 wrong at entry | V-010 | Fixed | §1 item 3; F11, F26; P21; §4.3.1 example; §4.3.6 item 6; §4.4 Ex. C; §4.5 R0; §9 item 8 | CBN page re-fetched 2026-11-04; git log re-checked. Also found the Fed rate in the same-day commit was 75 bp wrong at entry (E2, upgrading R05c's E4 inference). Control is C3.5 as written in the contract; expiry now calendar-derived. The account with Doc 5a is agreed here; 5a must adopt it (Deferred to Doc 5a owner) |
| B2 status vocabulary, missing states and fields | V-011 | Fixed | §4.3.1, §4.3.2, §4.3.4 | C3 axes adopted verbatim, old enum removed, C3.7 mapping stated. Added fields: `published_at`, `recorded_at`, `evidence_snapshot_hash`, `price_type`, `adjustment_basis`, `ca_set_version`, `consolidation_scope`, `audited`, `accounting_basis`, `fiscal_period_id`, `terms_version`/`terms_hash`, `source_independence_group`, `last_traded_on`, `methodology_version`. **Differs from the reviewer's proposal:** "pending_corporate_action" is a CA-record lifecycle plus F=`ageing`, and "override_expired" is the C3.3 transition `validated → candidate`, not new figure states, because C3 is closed (see open item 1) |
| B3 AI number contract | V-004 | Fixed | §4.3.12; §5 | C2 adopted as binding; temperature rule deleted; ADX MCP via deterministic client only |
| M1 non-display fee; cost upper bound; VAT basis; Interday scaling; labour | V-012 | Fixed, with a partial disagreement | §1 item 1; F3, F4; §4.1 N1; §4.6; §7 item 3 | 2×2 recomputed: USD 26 / 104 / 167 / 792 per month, matching R05c. **Partial disagreement:** the same pricelist table has a general "Non-Trading Related activities … payable for all types of Non-Display Usage" line (NGN 2.5m / USD 15,000), so R05c's figure is not a safe upper bound; shown as a sensitivity (USD 181 / 1,417). Also added: API bandwidth band, Interday per-security scaling, VAT basis (NGX ex-VAT, FMDQ incl.), validation labour in hours (≈ 20 h/yr), not money, because the founder's hourly value is theirs to set |
| M2 source independence; tolerances | V-012 | Fixed | F27; §4.3.1; §4.3.3; §4.4 Ex. B | `source_independence_group` added. NGX `two_independent` declared unreachable. Frankfurter's CBN provider confirmed [S109]. FMDQ VWAP-of-last-ten confirmed from the PDF. All tolerances graded E5, to be reset from trial data; US close compared only by equal `price_type`; dividends normalised (kobo/naira, gross/net) before exact match |
| M3 single-source protocol | V-011 (C3.3) | Fixed | §4.3.3; §4.3.10 | C3.3 adopted; workload 264 h/yr under v0.1 vs ≈ 20 h/yr under sampling (script part D, E5 inputs) |
| M4 corporate-action engine vs NGX | — | Fixed | §4.3.4; §4.3.7; §4.4 Ex. A; P2, P22, P23 | Date fields, lifecycle, settlement-cycle history, succession table, rights/supplementary allotment, scrip, par change, kobo dividends; rule 5 replaced; ex-date test routes to review. NGX Rulebook timelines still E4 (§9 item 3) |
| M5 stale-close false positives | — | Fixed | §4.3.5; script part F | Conditioned on price-group volume thresholds from the registry |
| M6 "unlicensed" over-claimed | — | Fixed | §1 item 2; F6; §4.1 N14; §5 | Reworded to "licence status undocumented"; vendors page re-checked 2026-11-04. Asking NGX for its delayed/EOD licensee list is added to Rec 2 |
| M7 enforcement of "no silent constants" | — | Fixed | §4.3.6; §4.5 R1a, R3a | Type, lint, grep, CODEOWNERS, scheduled monitor (not CI expiry); this document's own constants listed for registration; duplicate ECB constants and the `?? 0` defaults added |
| M8 freshness thresholds conflict with 5a | V-011 (C3.2) | Fixed here; Deferred to Doc 5a owner for 5a §4.10 | §4.3.2 | One merged table tied to calendars and filing deadlines, with day-count fallbacks; FX thresholds follow C5.2 (expired > 10), superseding 5a's 5 |
| M9 DFM dropped; ADX MCP adequacy | — | Fixed | §1 item 4; §4.1 U1, U4, U9; §4.6; Rec 9 | DFM is an explicit MVP gap, valued from statements; ADX Starter's limits stated; DFM pages re-checked 2026-11-04 |
| M10 CPI revision cause; series key | — | Fixed | F12; P18; §4.3.1 | Re-attributed to the January 2026 methodology change (still E5); series keyed on `methodology_version` |
| m1 NAFEM methodology E2; waterfall; expert judgement; currency | — | Fixed | F9; §4.1 X2 | PDF extracted 2026-11-04; post-EFEMS currency still unverified (open item 5) |
| m2 FMDQ note 9; API fees additional | — | Fixed | F9; §4.6 | Rec 11 cost NGN 860,000/yr incl. VAT |
| m3 Yahoo terms version drift | — | Fixed | F19; §4.3.1 (`terms_version`, `terms_hash`) | Our fetch did not show R05c's "Last updated: 1 November 2026" line in the part read; both observations recorded |
| m4 F11 grade; primary in example | — | Fixed | F11; §4.3.1 example | E2 from the CBN page |
| m5 `?? 0` false unchanged | — | Fixed | F23; P20; R3a | — |
| m6 golden dataset licensing | — | Fixed | §4.3.7 | Public CI on synthetic fixtures; licensed run in private storage |
| m7 Kobo misquote | — | Fixed | F7; §4.1 N15 | Quote corrected 2026-11-04 |
| m8 metadata/date mismatch | — | Fixed | Metadata; conventions | Version 0.2, 2026-11-04 |
| m9 P12 resolved by 5a | — | Fixed | P12 | Vendor drift example added |
| G1 "unlicensed" E2 | — | Fixed | F6 | E4 for the inference |
| G2 expiry would have flagged 27.50 | V-010 | Fixed | §4.4 Ex. C | Withdrawn |
| G3 F11 E3 | — | Fixed | F11 | E2 |
| G4 F9 E3 | — | Fixed | F9 | E2 |
| G5 F12 E5 attribution | — | Fixed | F12 | Re-attributed; E5 kept |
| G6 thresholds/tolerances ungraded | — | Fixed | §4.3.2, §4.3.3 | All E5 and registered as policy parameters |
| G7 MVP "USD 26–150" | V-012 | Fixed | §4.6 | Recomputed |
| G8 P1 unsourced vendor behaviour | — | Fixed | P1 | Now a trial test item |
| G9 P2 "bonus issues common" | — | Fixed | P2 | E4; to be counted from NGX notices |
| G10 NEXUS "shares author and era" | — | Fixed | §4.5 preamble | "Unknown — founder to confirm" |
| G11 S102/S106 never cited; FinanceBench scope | — | Fixed | §8; P4; F24; §10 | S102–S106 verified by DOI; cited in body; F24 scope note |
| Orphan sources (S1, S2, S24, S94–S100, S104, S105) | — | Fixed | F1, F7, F8, F9, F12, F25, §4.6, P1, §6 | Each now cited where it supports a statement |
| X1 three status vocabularies | V-011 | Fixed (this document) | §4.3.1 | Docs 5a, 7, 8 adopt C3 in their own revisions |
| X2 AI contract | V-004 | Fixed | §4.3.12 | C2 |
| X3 freshness tables | — | Fixed here; Deferred to 5a | §4.3.2 | See M8 |
| X4 bitemporality | — | Fixed | §4.3.1 | `published_at`, `recorded_at`, `as_of_recorded` |
| X5 when the MPR "expired" | V-010 | Fixed | §4.4 Ex. C | Agreed account written; 5a to adopt |
| X6 NGX rules as "open items" | — | Fixed | P12; §4.3.5; §9 item 3 | Hours, ticks and groups taken from 5a; Rulebook items still open |
| X7 grading of F11 | — | Fixed | F11 | E2 in both |
| X8 NGX daily limit ±10% vs ±5% | — | Deferred | §4.3.5; §7 item 7; §9 item 3 | Registry holds ±10% with a conflict flag until the Rulebook is fetched. Owner: Market Data (this department) with Doc 5a |
| Q1 NGX contract with a natural person; non-display | V-012 | Deferred | §6; §9 item 1; Rec 2 | Only NGX can answer, in writing. Owner: founder with Legal |
| Q2 local vs international end user | V-012 | Deferred | §4.6; §6 | Depends on residency (brief §4). Owner: founder |
| Q3 founder's validation time | — | Deferred | §4.3.10; §6 | ≈ 23 min/week estimated (E5); ≈ 30 min/week with the contracts v0.2 floor (conformance row). Owner: founder |
| Q4 DFM from custodian statements | — | Fixed (proposed); Deferred (acceptance) | §4.6; Rec 9 | Owner: founder |
| Q5 retained NGX history and derived-figure purge | — | Deferred | §6 | Owner: Legal (also C3.8 Q1) |
| Q6 the prior tracker's actual sources | — | Deferred | §4.5 preamble | Owner: founder |
| Q7 NAFEM methodology since EFEMS; tax FX rate | — | Deferred | F9; §6 | Owners: Market Data (methodology currency), Doc 6 (tax rate field, C5.1) |

**Counts.** 22 numbered findings (B1–B3, M1–M10, m1–m9): 22 fixed, 0 rejected, 0 deferred outright. Two fixed findings (B1, M8) leave a dependent change for Doc 5a. One fixed finding (M1) carries a partial disagreement, and one (B2) is implemented differently from the reviewer's proposal because the contract governs. Of the other 27 rows (11 grade-audit, 1 orphan-sources, 8 contradiction and 7 question rows), 19 are fixed and 8 are deferred with an owner (X8, Q1–Q3, Q4 acceptance, Q5–Q7).

**Related, not assigned.** V-008 asks Doc 5c to register the AED peg as a world fact under C3.5 (C5.5). Done in §4.3.2 and §4.3.5.

**What remains open.**
1. ~~**Contract question for the C3 owner.**~~ **Closed** by contracts v0.2 (CC-3): a pending corporate action is a CA-record lifecycle plus F=`ageing`, as here, and per-share calculations refuse on mixed `ca_set_version` (§4.3.4 item 9).
2. NGX's written answers on eligibility, fee basis, non-display line, API bandwidth and Interday pricing (Rec 2). Until then the NGX cost is a range of USD 26 to about USD 1,417 a month.
3. Founder decisions: residency (fee basis), validator role and time, DFM statement valuation, prior tracker sources.
4. NGX Rulebook items: bonus listing timeline, ex-date derivation under T+1, filing deadlines, daily limit.
5. Currency of the 2023 NAFEM methodology since EFEMS; the NBS January 2026 methodology note; the next CBN MPC date as a calendar record.
6. Doc 5a to adopt the merged freshness table, the C3 mapping and the agreed MPR account.
7. All tolerances, thresholds and the sampling workload are E5 until the two-week NGX trial and three months of live data.

