```
Document: 05c — Market Data Sourcing, Licensing and Validation Framework
Department: Market Data & Data Quality  ·  Lead role(s): financial data engineer; market-data licensing specialist; investment-research operations lead; independent audit / data-quality function
Version: 0.1 draft  ·  Date: 2026-11-02  ·  Status: for cross-department review
Reviewers required: Legal & Compliance (licensing, terms of use); Platform Engineering & Security (store, secrets, CI); Investment Research (field requirements, fiscal-year handling); Portfolio & Quant Analytics (adjusted series, FX conversion rules); Tax Intelligence (which FX rate and CPI vintage is legally required); AI Research & Explanation (tool contracts, figure-citation enforcement); Product/UX (stale and disputed states); Finance (budget)
```

> Conventions: evidence grades E1–E6 and citation rules follow `00_CONTEXT_BRIEF.md` §5. Source numbers in square brackets, e.g. [S9], refer to §10. "Reached" means the page or file was actually opened on 2026-11-02 and the quoted content was read; "search snippet" means only a search-engine excerpt was seen; "not reached" means the fetch failed and nothing on that page is claimed. Prices are quoted exactly as seen, with the document or page date; where a page gave no date, the access date applies. All FX conversions in this document use the Frankfurter v2 USD/NGN rate of 1,345.01 and USD/AED of 3.6725 observed on 2026-11-02 [S82] and are illustrative only.

---

## 1. Executive summary

**Conclusion 1 — Licensed, machine-readable NGX end-of-day data is obtainable, and it is cheaper than the folklore suggests, but nobody sells it corporate-action-adjusted.** The Nigerian Exchange operates a RESTful Market Data API (v3) with published annual prices: end-of-day prices NGN 125,000 (international USD 1,000), ten-year OHLCV history NGN 300,000 (USD 1,000), historical dividends NGN 250,000 per security set, news and corporate actions NGN 650,000 (USD 2,500), index values NGN 450,000 (USD 7,500) [S9]. A minimal personal licence (EOD + history) is therefore about NGN 425,000 a year (≈ USD 316 at today's rate), and the full research bundle about NGN 1.33 million (≈ USD 985). Access is by contacting NGX; whether NGX will contract with a natural person, and whether the founder counts as a "local" (naira) or "international" (dollar) end user, is unconfirmed and is the single biggest cost uncertainty [S6, S9]. No source we reached — official or third-party — documents a corporate-action adjustment methodology for NGX prices. Portfolio OS must build and validate its own adjustment engine from NGX dividend and corporate-action feeds plus issuer filings.

**Conclusion 2 — The free routes are display-only or unlicensed.** NGX's own website is 30-minute delayed, has no export, and its policy prohibits scraping [S5, S11]. Third parties that expose NGX data by API (EOD Historical Data, Mansa, Kobo Terminal) are not on NGX's authorised vendor list, which names only Bloomberg, FactSet, GTN, ICE, LSEG and SIX [S12]; EODHD states it does not use exchange feeds [S40]. These can serve as secondary cross-check sources, never as the system of record.

**Conclusion 3 — The prior tracker's stale figures were an architecture problem, not a vendor problem.** The repository hardcodes a CBN policy rate of 27.50% (the rate today is 23.00%, cut on 2026-09-22 [S32]), labels index levels as percentages, substitutes the US 10-year yield for Nigeria's bond, swallows API failures as empty arrays, and lets a language model restate numbers in prose [S93]. Every one of these maps to a control in §4.3.

**Biggest uncertainty:** NGX's willingness to license an individual and the applicable fee currency; second, the legal status of UAE data for individuals (ADX's own MCP server offers a free tier, but its licence text was unreachable to us [S59, S61]).

## 2. Scope and method

**Questions addressed.** (A) What sources exist per market, with what access, delay, history, licence and cost? (B) Which data pathologies must the design absorb? (C) What validation and control framework makes stale or fabricated figures impossible to display unflagged? (D) Why did the prior tracker fail, and which controls address each cause? (E) What data stack is recommended for the personal MVP and for a commercial product, at what cost and under which legal caveats?

**What we read internally.** `00_CONTEXT_BRIEF.md`; `src/services/yahooService.ts`, `yahooHistService.ts`, `fredService.ts`, `internationalYieldsService.ts`, `chatService.ts`, `ratesData.ts`; `src/components/ChatPanel.tsx`; `src/data/countryProfiles.ts`; `vite.config.ts` [S93].

**What we searched and fetched.** WebSearch (extended mode) for NGX, FMDQ, NBS, DFM, ADX, CSCS, vendor coverage and pricing; WebFetch of exchange, regulator, central-bank, statistics-office and vendor pages; local text extraction (`pdftotext`) of four PDFs: the NGX Market Data Pricelist (Schedule 3, file created 12 Aug 2026) [S3], the 2018 NSE pricelist [S4], the NGX Market Data Policy v2.0 [S5], the NGX Global Data Licence Agreement for End Users [S6], and the FMDQ 2023 Fees and Dues Framework [S21]. Live API probes: Frankfurter v2 USD/AED and USD/NGN [S82]; arXiv API for one academic reference.

**What we could not access (and therefore do not claim).** adx.ae (HTTP 403 on all pages) [S59, S60]; Central Bank of the UAE (403) [S64]; UAE Federal Competitiveness and Statistics Centre (403) [S65]; Financial Modeling Prep pricing (403) [S77]; Nasdaq Data Link (empty page / 404) [S79]; FMDQ market-data sub-pages (503) [S26]; NGX Historical Data Policy PDF (redirect loop) [S7]; Twelve Data's XNSA page (404) [S42]; African Markets (401) [S48]; afx.kwayisi.org (503) [S47]; Tribune Online article on a January 2026 CPI methodology change (403) [S36]. The WebSearch budget for this session was exhausted after 200 calls, so later checks (e.g. Chaka/Bamboo/Trove developer terms, DFM fee list) rely on fetches only or are marked unknown. Academic references could not be checked: both reference-lookup tools timed out and the OpenAlex API returned HTTP 429 ("daily budget used up"); only one reference (arXiv) was verified. Affected citations are marked **[unverified]** and the claims that depend on them are graded E4 at most.

**Not used, per the brief:** the founder's Google Drive and Gmail; no code written under `src/`; no agents spawned.

## 3. Findings

Each finding carries an evidence grade and source numbers. "Date seen" is 2026-11-02 unless stated.

**F1. NGX sells machine-readable data directly, with published annual prices.** The NGX Market Data API portal lists: Index Values NGN 450,000 / USD 7,500; Most Active and Top Gainers/Losers NGN 100,000 / USD 1,000 each; Prices real-time NGN 1,000,000 / USD 12,500, delayed NGN 400,000 / USD 2,500, end-of-day NGN 125,000 / USD 1,000; Stock Quote Data NGN 800,000 / USD 12,500; Historical Dividends NGN 600,000 (all securities) or NGN 250,000 (specific securities); Interday Prices (OHLCV, up to 10 years) NGN 300,000 / USD 1,000; Daily CapNet Report NGN 650,000 / USD 2,500; NGX News and Corporate Actions NGN 650,000 / USD 2,500; Trade Data NGN 100,000 / USD 1,000. "Annual Pricing"; every product routes to "Contact us". Delayed is defined as 30 minutes. (E2 — exchange publication) [S9]

**F2. The NGX API is REST/JSON-XML, token-authenticated, poll-based, and its documentation contains errors.** Endpoints include `price/pricesEOD`, `price/interdayprices` (parameters s, f, t), `fundamental/dividends`, `index/indexvalues`, `news/newsRT`, `trade/todaytrades`. The general note says "All data sources are intentionally delayed upto 3 minutes" while the delayed product says 30 minutes; no rate limits, no adjusted-price field and no schema are documented; several sample URLs are malformed. Implication: integration must be test-driven, not documentation-driven, and freshness must be measured. (E2 for the facts; E4 for the implication) [S10]

**F3. NGX licence terms distinguish personal from commercial use and forbid redistribution and scraping.** The End User Agreement defines a "Non-Professional End User" as a natural person using the data "exclusively for his/her private purposes, such as … the management of his/her own private assets", not for third parties, and not redistributing [S6, glossary]. "Delayed Data" is delayed at least 30 minutes; "End of Day Data" relates to the end of the trading day "prior to midnight in Nigeria"; "Non-Display Usage" (processing other than for display) requires a separate fee [S6 cl. 3, glossary]. The Policy requires every website displaying NGX data to state that "web scraping or re-transmission … is prohibited" and that delayed data must be shown as delayed by thirty minutes [S5 §8.2.7–8.2.8]; redistribution via "widgets, API's" requires prior written permission and a licence [S5 §8.2.6]. Fees are paid in naira by "End Users within Nigeria" and in US dollars by end users outside Nigeria; fees exclude VAT and withholding tax [S6 cl. 10.7–10.8]. NGX has audit rights with 1.5% monthly interest on underpayments [S6 cl. 9]. (E2) 

**F4. NGX fee levels for distribution have risen sharply since 2018, but display and EOD licences remain modest.** Real-time feed redistribution: NGN 1,200,000 (2018) → NGN 40,000,000 (2026 schedule); delayed licence NGN 625,000 → NGN 2,000,000; EOD licence NGN 500,000 → NGN 1,500,000; Website/Mobile delayed display NGN 125,000 → NGN 250,000 (USD 2,500); Website/Mobile EOD display NGN 50,000 → NGN 120,000 (USD 1,000); "Delayed Data for Financial modelling" non-display NGN 1,250,000 (USD 7,500 professional); "Real Time Data stored for Historical reference" NGN 3,500,000; End-user Level 1 terminal fee USD 3 → USD 10 local per month (USD 15 global). (E2) [S3, S4]

**F5. NGX historical data goes back to 1996 (EOD) but is priced on application; tick data is limited to three months; students receive 50–80% discounts.** The Historical Data page says corporate actions are notified "via NGX feed" and on the Corporate Disclosures page. (E2) [S8]

**F6. The only authorised NGX real-time vendors are Bloomberg, FactSet, GTN Group, ICE Data Services, LSEG and SIX.** None of the retail-facing APIs that advertise NGX coverage appears on the list. (E2) [S12]

**F7. Retail APIs with NGX coverage exist, with free tiers, but their licensing provenance is undocumented.** EODHD lists 159 XNSA tickers (ETFs mislabelled as Common Stock), personal plans from USD 19.99/month, and discloses it is "not using exchanges data feeds for the pricing data" but aggregates "100+ sources" via VWAP; data "not necessarily real-time nor accurate" [S40, S41]. Mansa API (pan-African) offers NGX quotes, indices, dividends, disclosures parsed from NGX PDFs, "human-verified" fundamentals, free 100 requests/day, Starter USD 20, Pro USD 50, Business USD 200/month; sourcing/licence not stated; its JSE archive is in cents while live quotes are in rand — a documented unit break [S44, S45]. Kobo Terminal (formerly NGX Pulse; the old domain 301-redirects) offers 30-minute delayed NGX data updated every 20 minutes, Personal NGN 0 (100 req/day), Starter NGN 29,000, Professional NGN 75,000 (adds "Commercial use license"), Institutional NGN 350,000 per month, and states "public availability does not grant commercial redistribution rights" [S46]. (E3 — vendor self-description) 

**F8. CSCS publishes a free daily NGX/NASD price snapshot (open, close, volume, value) but no export, no archive and no data terms; its APIs are account/portfolio services, not market data.** Portfolio View (NGX) subscription NGN 78,400 + 7.5% VAT, effective 1 January 2026; API items listed as NIL in that schedule. (E2) [S17–S20]

**F9. FMDQ data is licensed and priced; NAFEM/NFEM fixing methodology republishes the previous close when data is inadequate.** 2023 framework (VAT-inclusive, "subject to change"): non-member end-user EOD Fixings (Single) NGN 161,250 (USD 322.50) p.a.; Daily Quotations List NGN 322,500 (USD 645); 24-hour delayed single fixing NGN 107,500 (USD 215); API connection, end user, EOD NGN 322,500 (USD 645); NAFEM Data EOD distribution licence NGN 3,359,375 (USD 6,718.75) [S21]. The FMDQ homepage displays bond, T-bill and CP quotations dated 30 Oct 2026 and NITTY/NIBOR dated 29 Oct 2026 but a blank FX table [S23]; the e-Markets portal requires registration (two-week trial) [S25]. The NAFEM spot methodology (Oct 2023) states that if data is inadequate the previous day's closing rate is published and, after five consecutive republications, a review committee decides (search snippet, not opened) [S22]. (E2 for fees; E3 for methodology)

**F10. CBN publishes the official rate as the NFEM volume-weighted average with Excel export; its pages render data client-side.** "NFEM rate is derived at Volume Weighted Average and stands as the official exchange rate for the day"; Export to Excel; no API documented. Money-market, inflation and securities pages follow the same pattern. The Statistics Database (statistics.cbn.gov.ng/shop) describes "Monetary, External, Fiscal and Real" sectors but states no formats or terms. (E2) [S27–S31]

**F11. The CBN Monetary Policy Rate is 23.00% since 22 September 2026 (307th MPC, −350 bp from 26.50%; corridor +50/−300 bp; CRR 45%/16%/75%).** Earlier 2026: cut to 26.50% in February; holds in May and July. The repository's hardcoded 27.50% is therefore 450 bp stale, and its "next meeting 2026-03-25" is eight months old. The next MPC date was not stated in the sources reached. (E3 — financial press reporting a CBN communiqué; the communiqué itself was not fetched) [S32, S93]

**F12. Nigerian CPI was rebased to 2024 = 100 (weights 2023) from January 2025; headline fell from 34.80% (Dec 2024, old base) to 24.48% (Jan 2025, new base).** September 2026 headline 14.63% y/y (food 19.59%, core 12.95%), released 15 October 2026; the release compares with 20.98% for September 2025, whereas the September 2025 figure originally reported was 18.02% — evidence of post-rebasing revision of the back series. A reported January 2026 move to a twelve-month-average reference period could not be verified (source 403). (E2 for NBS homepage figures; E3 for press; E5 for the revision inference) [S33–S36]

**F13. Nigeria's parallel-market premium is currently small but real and unofficial.** On 2026-11-02 10:09 WAT an aggregator showed black-market USD/NGN 1,382/1,388 against a CBN rate of 1,346.26 (+2.65% / +3.10%) [S39]; Frankfurter v2 returned 1,345.01 for the same date [S82]. The product must label the rate type on every NGN conversion. (E4 — unofficial aggregator; E2 for the Frankfurter observation as data)

**F14. DFM website data is 15-minute delayed, display-only; DFM's developer portal was unreachable; LSEG advertises free 15-minute delayed post-trade DFM data to its clients.** "Data delayed by 15 minutes. Please sign in to view real-time data" [S55]; the market-data-providers page promises a list of authorised distributors and a "DFM Fees List" PDF, neither of which rendered [S54]; api.dfm.ae/docs returned "Filenotfound" [S57]; LSEG's DFM page (search snippet, ~439 days old) mentions "free of charge 15 minutes delayed post-trade data" [S58]. (E2/E3)

**F15. ADX runs an official Model Context Protocol (MCP) server for AI assistants with a free Starter tier.** Per a 14 August 2026 press report: Starter free with 100 tool calls/month including real-time Level 1 for all instruments; paid tiers AED 9.99, 29.99 and 49.99 per month; a Premium tier with 4,000 calls/month; Enterprise custom; access via API keys and entitlements; works with ChatGPT and Claude; data may be "real-time, delayed, or batch-based, depending on licensing" [S61]. adx.ae itself returned 403 to us, so the licence text, storage and redistribution terms are unverified [S59]. ICE lists ADX Level 3 market-by-order data for institutions [S62]. (E3)

**F16. The UAE Securities and Commodities Authority now presents as the Capital Market Authority (sca.gov.ae redirects to uaecma.gov.ae) with an Open Data section (registers, statistics, funds) but no listed-company financial-statement feed on the pages seen.** (E2) [S63]

**F17. US official sources are free and well-specified.** SEC EDGAR submissions/companyfacts/frames APIs update "in real-time as filings are disseminated", bulk ZIPs nightly ~3 a.m. ET, no key, maximum 10 requests/second, declared User-Agent required ("Sample Company Name AdminContact@…") [S67–S69]. FRED requires a key, mandates the notice "This product uses the FRED® API but is not endorsed or certified by the Federal Reserve Bank of St. Louis", and warns that third-party series carry their own terms; ALFRED/`series/vintagedates` provide revision vintages [S70–S72]. Treasury par yield curve: CSV/XML [S73]; Fiscal Data API: "offered free, without restriction" [S74]. (E2)

**F18. US retail vendor pricing seen on 2026-11-02:** Massive (Polygon.io's pricing URL 301-redirects to massive.com): Stocks Advanced USD 199/month real-time, 20+ years, "Individual use only"; Financials & Ratios USD 29/month [S75]. Alpha Vantage: free 25 requests/day; USD 49.99 (75/min) to USD 249.99 (1,200/min) per month; entitlements "for personal use" [S76]. EODHD: Sandbox free 20 calls/day; Historian USD 19.99; Active Trader USD 29.99; Equity Analyst USD 59.99; All-In-One USD 99.99 per month; "Personal use" vs "Commercial / B2B" [S41]. Twelve Data: Basic USD 0 ("Internal non-display usage"), Grow USD 79, Pro USD 229, Ultra USD 999 per month; global equities EOD from Grow; add-ons such as ISINs USD 24,000/year [S43]. Tiingo: Starter USD 0 (1,000 req/day), Power USD 30/month (USD 300/year), business internal use USD 50/month; "Internal use means you may only use the data for your own personal use" [S78]. Financial Modeling Prep and Nasdaq Data Link: not reached. (E3 — vendor pages)

**F19. Yahoo Finance's terms prohibit automated collection and commercial reuse; the finance endpoints used by the prototype are not a published API.** Yahoo Terms of Service: users may not "access or collect data … using any automated means" and may not "access or reuse the Services … for any commercial purpose"; versions dated 15 May 2025 and 2 January 2026 [S80]. Yahoo Developer API Terms (REV 3-2022) require removal of retained API data "within 24 hours" unless stated otherwise and do not mention a finance data API at all [S81]. Investing.com similarly prohibits storing, reproducing or distributing its data and discloses that prices "are not necessarily provided by any market or exchange" [S50]. (E2 — published terms)

**F20. Free FX references: the ECB publishes 29 currencies at ~16:00 CET, excluding NGN and AED, "for information purposes only" [S83]; Frankfurter v2 (free, no key, open source) now aggregates 106 central banks and lists NGN (16 providers, from 1999) and AED (54 providers, from 1996) [S82]; exchangerate.host Free is 100 requests/month non-commercial, paid from USD 14.99 [S84]; Open Exchange Rates Free is 1,000 requests/month USD-base only, Developer USD 12, Enterprise USD 47, Unlimited USD 97 per month, 173 currencies including NGN and AED [S85]. The AED peg (USD/AED 3.6725) was observed via Frankfurter on 2026-11-02 but the Central Bank of the UAE page was unreachable (403), so the peg's official statement is cited as E4 pending verification [S64, S82]. (E2/E3)

**F21. Macro APIs: World Bank Indicators API v2 needs no key but the general terms limit "Materials" to non-commercial use with attribution (dataset-specific terms are separate and were not fetched) [S86, S87]; IMF data is "available through SDMX 2.1 and SDMX 3.0 APIs" with a beta portal account [S88]; NBS offers an Open Data Portal and e-library, no API seen [S33]; UAE Bayanat exposes a GET endpoint per resource GUID, licence not shown [S66]. (E2)

**F22. Claude MCP connectors: Financial Datasets' MCP server (20+ tools: prices, statements, SEC filings, insider trades, macro) is installable from Claude's Connectors Directory per its own docs; its coverage statements are SEC-centric (27,530 stocks; "verified against the underlying SEC filing") with no mention of Nigeria or the UAE [S89, S90]. Distilla offers MCP plugins for Claude/ChatGPT with no stated geographic scope [S91]. The claude.com/connectors page is dynamic (1,050 connectors) and did not render either listing to us [S92]. The only exchange-run MCP server found that covers a market in scope is ADX's (F15). No MCP connector we could verify covers NGX or DFM. (E3)

**F23. The prototype's data layer exhibits the stale-figure anti-patterns directly.** `countryProfiles.ts`: `cbRate: 27.50, nextMeeting: '2026-03-25'`, `yahooBond: '^TNX'` (the CBOE US 10-year index) for Nigeria, `instabilityScore: 72` with no source. `ratesData.ts`: a static central-bank table "accurate as of March 2026". `fredService.ts`: `CPIAUCSL` labelled "US CPI YoY" with unit "%" (it is an index level, 1982–84 = 100) and `GDP` labelled "US GDP Growth %" (it is a level in billions of dollars). `yahooService.ts` calls the v7 quote endpoint and on any failure returns `[]`; `yahooHistService.ts` serves cached closes on error with no age. `ChatPanel.tsx` injects live context into a Groq-hosted Llama prompt whose system text instructs "Cite specific levels and spreads" [S93]. The `Ticker` type carries no as-of timestamp, source or unit. (E2 — direct inspection)

**F24. Language models restate and invent financial numbers unless constrained.** FinanceBench (arXiv:2311.11944, verified to exist via the arXiv API) reports that GPT-4-Turbo used with a retrieval system incorrectly answered or refused 81% of its questions in the authors' evaluation [S101]. The exact figure is quoted from the abstract as fetched on 2026-11-02 (see §10 note). (E2 — single study; benchmark-specific)

**F25. Naming drift across the ecosystem is current and material.** NAFEX → NAFEM (2023) → "NFEM" on the CBN page [S22, S28]; SCA → CMA [S63]; Polygon.io → Massive [S75]; NGX Pulse → Kobo Terminal [S46]; TradingView lists the Nigerian exchange as "NSENG" with 30-minute delay, DFM/ADX 15 minutes, "real-time free after sign-up" for display [S51]; EODHD uses the MIC "XNSA" [S40]; the prototype uses Yahoo's `.LG` suffix and `^NGSEINDX` [S93]; ICE fee schedules that mention "NGX" refer to ICE NGX, the Canadian natural-gas exchange, not the Nigerian Exchange [S53]. (E2)

## 4. Proposed framework / specification for Portfolio OS

### 4.1 Source catalogue per market

Columns: source · provides · official? · access · delay/freshness · history · licence and redistribution · cost (as seen, date) · reliability notes · verification status. "Checked" dates are 2026-11-02 unless noted. Abbreviations: EOD = end of day; RT = real time; CA = corporate actions; n.p. = not public; PI = personal/internal use; ND = non-display; RD = redistribution.

#### 4.1.1 Nigeria

| # | Source | Provides | Official? | Access | Delay / freshness | History | Licence & RD limits | Cost (as seen) | Reliability notes | Verified |
|---|---|---|---|---|---|---|---|---|---|---|
| N1 | NGX Market Data API v3 [S9, S10] | Prices RT/delayed/EOD, 10-yr OHLCV, dividends, index values/members, gainers/losers, news & CA, trade data, CapNet | Yes (exchange) | REST JSON/XML, token `_t`; subscribe via "Contact us" | RT; delayed 30 min; EOD; "intentionally delayed up to 3 minutes" note | Interday ≤10 yrs | Governed by Global Data Licence Agreement; no RD; ND fee separate; naira for local, USD for international end users [S6] | Annual: EOD prices NGN 125,000 / USD 1,000; Interday NGN 300,000 / USD 1,000; dividends NGN 250,000 (specific) / 600,000 (all); news & CA NGN 650,000 / USD 2,500; index values NGN 450,000 / USD 7,500 (page, 2026-11-02) | Docs contain malformed samples; no rate limits, no adjusted-price field, no schema published; individual eligibility unconfirmed | Reached; prices quoted verbatim |
| N2 | NGX website Equities Price List [S11] | Prev close, O/H/L/C, change, trades, volume, value | Yes | Web table only | "Prices displayed on this website are delayed by 30 minutes" | Current day | Display only; policy forbids scraping/re-transmission [S5 §8.2.7] | Free to view | Table renders client-side ("Loading data…"); no export | Reached |
| N3 | NGX X-DataPortal [S13] | RT L1/L2 trade floor, EOD statistics, historical equity L1 (generate & download), broker reports | Yes | Web portal, in-portal purchase | RT and historical | "Free access to 7 days Historical Price data" | Portal T&Cs (not read) | "affordable rate"; 2018 list: Equity L1 Historical query engine NGN 45,000 p.a. [S4]; 2026 list not itemised on page | No API; manual downloads | Reached (prices partly) |
| N4 | NGX Historical Data (on request) [S8] | EOD quotes "as far back as 1996"; tick data 3 months | Yes | Request form, e-mail | Batch | 1996– | Internal use vs RD priced separately; RD of EOD historical NGN 1,250,000 / USD 5,000 p.a. [S3] | Price on application; students −50/−80% | Turnaround unknown | Page reached; policy PDF not reached [S7] |
| N5 | NGX corporate disclosures / X-Issuer filings (doclib.ngxgroup.com) [S15, S16, S8] | Audited/unaudited statements, earnings forecasts, CA notices, directors' dealings, delistings [S14] | Yes | Web pages + PDF links; no API/RSS seen | Event-driven; issuers must file via X-Issuer (mandatory since 2022 per press) | Multi-year PDFs | Copyright of issuers/NGX; X-Gen News RD licence NGN 650,000 / USD 7,500 p.a. [S3] | Free to read | PDFs need parsing; delisting list uses mixed date formats ("2008", "7-May-2021", "5/20/2024") [S14] | Delisting page reached; X-Issuer FAQ snippet only |
| N6 | CSCS daily price list [S17, S18] | Symbol, open, close, volume, value for NGX & NASD; bonds/CP/NTB directories | Semi-official (CSD) | Web table | "Market Numbers as of" 27 Oct 2026 seen on 2026-11-02 (i.e. 4 trading days old) | No archive | No data terms shown | Free to view | Useful free secondary for close/volume; staleness observed | Reached |
| N7 | CSCS APIs & portal [S19, S20] | Account creation/validation, Portfolio View (holdings), detachment | Yes (CSD) | API via request form; investor portal | n/a | n/a | Participant agreement | Portfolio View (NGX) NGN 78,400 + VAT subscription, eff. 1 Jan 2026 | Not a price-data source; relevant for System A (holdings reconciliation) | Reached |
| N8 | FMDQ Exchange website & e-Markets [S23, S25] | FGN bond, T-bill, CP quotations; NITTY, NIBOR; FX closing (table blank when seen); bond futures | Yes | Web; e-Markets portal (registration, 2-week trial, Q-Pay) | Homepage quotes dated T-1/T-2; delayed tiers 24 h | Historical via portal/licence | FMDQ T&Cs; RD licences [S21] | Non-member EOD Fixings (Single) NGN 161,250; Daily Quotations List NGN 322,500; API EOD end user NGN 322,500 p.a. (2023 framework, VAT-incl., "subject to change") | Methodology republishes previous close on thin data [S22] | Fees PDF extracted; sub-pages 503 |
| N9 | CBN Data & Statistics [S27–S31] | NFEM official FX (VWAP, high/low/close, turnover), MPR, T-bill, deposit/lending rates, inflation, securities, reserves, crude | Yes (central bank) | Web tables + "Export to Excel"; Statistics Database | Daily (FX), monthly (others) | Long | No terms stated | Free | Tables render client-side; no API; naming NFEM vs NAFEM | Reached (structure); values not rendered |
| N10 | Debt Management Office [S37, S38] | FGN bond auction results (monthly, PDF), issuance calendar, Eurobond daily prices (PDF/spreadsheet), savings bonds, sukuk, debt stock | Yes | PDF/spreadsheet downloads | Monthly / daily | Archive ≥ Apr 2025 visible, ~12 pages | Public documents | Free | PDFs; duplicate entries seen | Reached |
| N11 | National Bureau of Statistics [S33, S34] | CPI (base 2024 = 100), GDP, labour; Open Data Portal, NADA | Yes | Web, PDF/e-library, ODP | Monthly CPI ~15th of following month | Rebased series from Jan 2025 | Public | Free | Back-series revisions observed (Sep-2025: 18.02% → 20.98%) | Reached |
| N12 | SEC Nigeria | Regulatory registers, rules | Yes | Web | — | — | — | Free | Not a market-data source; not fetched this session | Not reached |
| N13 | EOD Historical Data (XNSA) [S40, S41] | EOD prices, dividends/splits (per plan), fundamentals (separate plan) | No; "not using exchanges data feeds" | REST API | EOD; 15-min delayed live on free | 30+ yrs claimed generally; XNSA depth unstated | Personal vs Commercial/B2B plans; licence text not reached | Historian USD 19.99/mo; All-In-One USD 99.99/mo | 159 tickers; ETFs typed as Common Stock; accuracy disclaimer | Reached |
| N14 | Mansa API [S44, S45] | NGX quotes, indices (ASI from 1996), dividends, disclosures, insider trades parsed from PDFs, fundamentals (weekly refresh) | No (not on NGX vendor list) | REST | "30-minute freshness during market hours" | Varies; JSE archive in cents | Terms/Licensing pages not read; Business tier "redistribution-lite" | Free 100 req/day; Starter USD 20; Pro USD 50; Business USD 200/mo | Sourcing not stated; useful filings cross-check | Reached |
| N15 | Kobo Terminal (ex NGX Pulse) [S46] | NGX stocks, fundamentals, dividends, indices/ETFs, bonds, CBN auctions, disclosures, NASD, FX, news | No | REST | "30-min delayed and updated every 20 minutes" | Price history from Starter | "public availability does not grant commercial redistribution rights"; Professional adds commercial-use licence | NGN 0 / 29,000 / 75,000 / 350,000 per month | Sources named as "NGX chartdata", "cbn", Nairametrics/BusinessDay | Reached |
| N16 | TradingView [S51] | Charts for "NSENG", 30-min delay; RT free after sign-up | No (licensed display vendor) | Browser only | 30 min | Charts | Display only; no API/download | Free tier | Not machine-readable | Reached |
| N17 | Investing.com [S50] | Quotes/charts | No | Browser | Undisclosed; "not necessarily provided by any market" | — | Storing/reproducing prohibited | Free | Unsuitable as a source | Reached (footer terms only) |
| N18 | Stears [S49] | Macro/country risk, private-market data for institutions | No | Platform, trial on request | — | — | "may not be reproduced … redistributed" | n.p. | Institutional; no API seen | Reached |
| N19 | Nairametrics, Proshare, abokiFX-type aggregators [S39, S97] | News; parallel-market and NAFEM rate tables | No | Browser | Intraday | — | Publisher copyright | Free | Context and parallel-rate indication only | Partly reached |
| N20 | Chaka / Bamboo / Trove | Retail brokerage apps | No (brokers, not vendors) | Apps | — | — | Customer terms | — | Not data vendors; developer APIs not verified (search budget exhausted) | Not reached |
| N21 | Bloomberg / LSEG Workspace (cost ceiling) [S52, S12] | Full NGX RT/historical, filings, FX | Licensed vendors | Terminal / enterprise feeds | RT | Deep | Terminal licence; no RD | Aggregator estimates only: ≈ USD 22k–32k per user per year (unverified, not official) | Authorised NGX vendors [S12] | Pricing unverified |

#### 4.1.2 United Arab Emirates

| # | Source | Provides | Official? | Access | Delay / freshness | History | Licence & RD | Cost (as seen) | Notes | Verified |
|---|---|---|---|---|---|---|---|---|---|---|
| U1 | DFM MarketWatch / website [S55, S54] | Quotes, ticker, disclosures, CA pages | Yes | Browser; sign-in for RT | "Data delayed by 15 minutes" | Current | Disclaimer link; "DFM Fees List" PDF not rendered | Free view | Provider list did not render; developer portal "Filenotfound" [S57] | Reached (partial) |
| U2 | DFM authorised data distributors (incl. LSEG) [S54, S58] | RT, delayed, historical, trade and market summary | Yes (via vendors) | Vendor feeds; LSEG DataScope (HTTP/SFTP/API) | LSEG: "free of charge 15 minutes delayed post-trade data" (snippet, ~439 days old) | Deep | Vendor contracts | n.p. | Enterprise-oriented | Snippet only |
| U3 | DFM Disclosures page [S56] | Quarterly/annual financial statements, price-sensitive information; filters by type, company, date, keyword | Yes | Web; format and RSS/API not shown | Event-driven | Range unknown | Disclaimer | Free | Entries did not render ("Fetching Data…") | Reached (partial) |
| U4 | ADX MCP server [S59, S61] | Live prices, L1 for all instruments, depth (paid), disclosures incl. XBRL, CA, history by tier | Yes (exchange) | MCP for Claude/ChatGPT; API keys | RT L1 on Starter; "real-time, delayed, or batch-based, depending on licensing" | Starter: current/last day; Premium: full depth | Entitlements by user/package/dataset; storage & RD terms unseen | Starter free (100 tool calls/mo); AED 9.99 / 29.99 / 49.99 per month; Premium 4,000 calls (price n.p.); Enterprise custom (press, 14 Aug 2026) | adx.ae blocked (403) to us; verify terms before use | Press report reached; exchange page not |
| U5 | ADX via ICE / vendors [S62, S60] | L1–L3 MBO, RT/delayed/EOD/historical | Yes (via vendors) | ICE feeds/API/files | RT | Full tick | ICE licence | n.p. | Institutional | ICE page reached |
| U6 | UAE Capital Market Authority (ex SCA) Open Data [S63] | Registers of licensed firms, funds, statistics, warnings, finfluencer list | Yes (regulator) | Web open-data pages; "Propose/Request Data" | Periodic | — | Open Data Policy (not read) | Free | No company-financials feed seen | Reached |
| U7 | Central Bank of the UAE [S64] | Exchange rates (USD/AED peg), EIBOR, monetary statistics | Yes | Web/Excel (expected) | Daily/monthly | Long | Unknown | Free | HTTP 403 in this session; peg value 3.6725 observed via Frankfurter instead [S82] | Not reached |
| U8 | FCSC / UAE Stat / Bayanat [S65, S66] | CPI, GDP, population; open-data API by resource GUID | Yes | Web; Bayanat GET endpoint | Monthly/quarterly | — | Terms not shown | Free | fcsc.gov.ae 403; Bayanat reached | Partly reached |

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
| X2 | FMDQ NAFEM/NFEM fixing & closing [S21–S23, S25] | Noon fix; VWAP closing | Yes (benchmark administrator) | Website (24-h delayed), e-Markets, licence | Daily; delayed tiers | Via licence | Fees table §F9 | From NGN 107,500 p.a. (24-h delayed single fixing, non-member) | Republishes prior close when thin | Fees PDF extracted |
| X3 | Parallel market aggregators [S39] | Street buy/sell | No | Browser | Intraday | — | Publisher | Free | 2026-11-02: 1,382/1,388 vs CBN 1,346.26 | Reached |
| X4 | ECB reference rates [S83] | EUR crosses, 29 currencies, no NGN/AED | Yes | CSV/XML/SDMX files | ~16:00 CET daily | 1999– | "information purposes only" | Free | Needed for EUR legs only | Reached |
| X5 | Frankfurter v2 [S82] | Aggregated central-bank rates, 228 currencies incl. NGN (16 providers) and AED (54) | No (aggregator of official sources) | REST, no key, open source | Daily | NGN 1999–, AED 1996– | Blended rates free incl. commercial; provider endpoints subject to provider terms | Free | USD/NGN 1,345.01 and USD/AED 3.6725 on 2026-11-02 | Reached + probed |
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
| P1 | Stale prices carried forward on zero-volume days | NGX stocks frequently do not trade; vendors either repeat the last close or omit the day; CSCS snapshot was 4 trading days old on 2026-11-02 [S18] | volume = 0 or missing day vs trading calendar; identical close ≥ 3 sessions | `last_traded_on` field separate from `as_of_date`; UI badge "no trade since dd-mmm"; liquidity metric uses zero-return days (E3, Lesmond et al. 1999 [unverified]) |
| P2 | Bonus issues, scrip dividends, consolidations, rights issues | NGX bonus issues are common; no vendor documents NGX adjustment methodology (F1–F7) | Price gap on ex-date ≈ 1/(1+bonus ratio); share count step | Corporate-action engine with raw + adjusted series; factor audit against issuer notice |
| P3 | Share-count changes not reflected | Vendor shares outstanding differ from latest filing | Market cap / price ≠ shares; EPS mismatch | Shares outstanding sourced from filings only (N5), vendor value = "unconfirmed" |
| P4 | Restated financials and revised statistics | NBS Sep-2025 CPI 18.02% → 20.98% [S34]; SEC facts re-filed | Same (entity, period, concept) with new value | Vintage model: never overwrite; `supersedes` link; show "restated on" |
| P5 | Scale/unit errors | NGN'000 vs NGN million statements; Mansa JSE history in cents vs quotes in rand [S44]; prototype labels CPI index as "%" [S93] | Magnitude jump ×10³ between periods; unit metadata mismatch | Mandatory `unit`, `scale`, `currency` fields; magnitude continuity test; series metadata registry |
| P6 | Fiscal-year mismatch | Nigerian issuers with June and December year-ends; TTM aggregation across differing quarters | Period end dates not aligned | Period-aware fundamentals model; TTM built from explicit period IDs |
| P7 | Reporting currency ≠ trading currency | Issuers reporting in USD while trading in NGN (e.g. dual-listed telecoms/oil names — E4, verify per issuer) | Statement currency ≠ listing currency | Convert only with dated official rate; store both; label |
| P8 | Delisting, suspension, name/ticker change | STACO Insurance delisted 21/09/2026 (regulatory); MRS Oil 28-Jul-25 (voluntary) [S14] | Entity status feed; prices stop | Security master with status and effective dates; portfolio valuation falls back to last price flagged "suspended/delisted" |
| P9 | Index reconstitution | NGX index members endpoint priced separately [S9]; semi-annual reviews (E4) | Membership diff | Store membership history; benchmark returns use point-in-time constituents |
| P10 | FX regime breaks | 2016 managed float; June 2023 unification (NAFEM); 2024 EFEMS/NFEM renaming (E4, verify) | Return > 10% in official rate; name change in source | Rate records carry `regime_id`; charts annotate breaks; no splicing without method tag |
| P11 | Holiday calendars and short-notice holidays | Nigeria declares some public holidays days ahead (E4) | Expected session with no data from all sources | Calendar as data with source and confidence; "unconfirmed holiday" state |
| P12 | Time zones and session hours | Sources disagree on NGX hours: EODHD "10:00–14:20 (+01)" [S40] vs Kobo "9:00 AM to 4:00 PM WAT" [S46]; DFM/ADX GST; US ET | Timestamps without zone | Store UTC + exchange-local; session table per MIC verified against exchange rules (open item) |
| P13 | Vendor silent symbol/brand/endpoint changes | Polygon.io → Massive; NGX Pulse → Kobo; SCA → CMA; NAFEX/NAFEM/NFEM; `NSENG` vs `XNSA` vs `.LG` [F25] | 301 redirects; symbol not found; schema drift | Entity master keyed by ISIN + MIC; vendor symbol maps versioned; schema-drift alarms |
| P14 | API deprecations and unofficial endpoints | Yahoo v7/v8 used by prototype; ToS prohibits [S80]; prototype returns `[]` on failure [S93] | HTTP errors, empty payloads, cookie/crumb requirements | Only sources with a licence record may feed the store; health checks; explicit `fetch_failed` state |
| P15 | Homonyms | "NGX" = ICE natural-gas exchange in ICE fee PDFs [S53]; "NSE" = Nigeria, India or Nairobi | Wrong MIC/currency on ingest | MIC-first identification; currency sanity check per MIC |
| P16 | Documentation errors | NGX API samples malformed; 3-minute vs 30-minute delay text [S10] | Integration tests fail | Contract tests per endpoint; measured freshness |
| P17 | Benchmark republication | FMDQ republishes previous close on thin data [S22] | Identical fixing on consecutive days | `republished` flag from source notes or detection; staleness clock continues |
| P18 | Rebased or re-weighted series | CPI 2009 → 2024 base [S35]; headline drop 34.80% → 24.48% | Base-year attribute change | Series ID includes base; cross-base comparisons blocked or labelled |
| P19 | LLM-generated numbers | Prototype prompt "Cite specific levels and spreads" to a 70B model [S93]; FinanceBench 81% incorrect/refused for GPT-4-Turbo with retrieval [S101] | Numeric tokens in model output without figure IDs | §4.3.12: tool-only numbers, renderer substitution, output validator |
| P20 | Silent empties and cache-as-truth | `catch { return [] }`; cached closes served on error with no age [S93] | Data arrays shorter than expected; cache hits after failures | Every value carries `retrieval_timestamp`; cache serves only with age badge; empty ≠ zero |

### 4.3 Validation and control framework

#### 4.3.1 Provenance schema (attached to every stored figure)

| Field | Type | Rule |
|---|---|---|
| `figure_id` | UUID | Immutable; referenced by UI, calculations and AI output |
| `entity_id` | ISIN + MIC, or series code (e.g. `NBS:CPI:ALL:2024=100`) | From the security/series master, never free text |
| `field` | enum (`close`, `volume`, `shares_outstanding`, `eps_basic`, `dividend_cash`, `fx_rate`, `policy_rate`, …) | Controlled vocabulary with definitions |
| `value` | decimal (string in transport) | No floats in storage |
| `unit`, `scale`, `currency` | enum / integer power of ten / ISO 4217 | Mandatory; `scale` 0, 3, 6, 9 |
| `as_of_date` / `period_start`, `period_end` | date | Stock vs flow distinction; exchange-local date for prices |
| `retrieval_timestamp` | UTC datetime | When fetched |
| `source_id`, `source_url`, `source_record_id` | registry key, URL, vendor ID | Source registry holds owner, official flag, licence, SLA |
| `licence_id`, `licence_scope` | registry key; enum (`personal`, `internal_display`, `non_display`, `redistribution`) | Blocks any surface not covered by scope |
| `rate_type` (FX only) | enum (`official_nfem`, `fmdq_fixing`, `fmdq_closing`, `parallel_indicative`, `ecb_reference`, `peg`) | Shown on every conversion |
| `method` | enum (`observed`, `derived`, `estimated`, `manual_override`) | Derived figures carry `calc_id` and input `figure_id`s |
| `vintage` / `supersedes` / `superseded_by` | integer / UUID | Revisions never overwrite |
| `confidence` | A (official, two-source agreed) · B (official, single) · C (vendor, reconciled) · D (vendor only / unofficial) | Drives UI colour and AI eligibility |
| `validation_status` | `raw` → `auto_validated` → `validated` (human) · `disputed` · `stale` · `expired` · `superseded` · `fetch_failed` | State machine below |
| `validator`, `validated_at`, `notes` | user/system id, datetime, text | Required for `validated`, `disputed`, `manual_override` |
| `expiry_at` | datetime | Mandatory for event-driven facts (policy rates, shares, calendars) |

Illustrative record (synthetic values):

```json
{"figure_id":"9f1c…","entity_id":"CBN:MPR","field":"policy_rate","value":"23.00","unit":"percent","scale":0,"currency":null,
 "as_of_date":"2026-09-22","retrieval_timestamp":"2026-11-02T09:40:11Z","source_id":"press:nairametrics","source_url":"https://nairametrics.com/2026/09/22/cbn-resets-mpr-to-23/",
 "licence_id":"fair-use-citation","licence_scope":"personal","method":"observed","vintage":1,"confidence":"B",
 "validation_status":"auto_validated","expiry_at":"2026-11-30T00:00:00Z","notes":"Primary source (CBN communiqué) not yet attached; expiry set to provisional next-MPC window; weekly refresh job cbn_mpr_check"}
```

#### 4.3.2 Freshness service-level targets and stale states

| Data type | Expected cadence | Fresh | Ageing (amber) | Stale (grey, value de-emphasised, badge mandatory) | Expired (hidden from conclusions) |
|---|---|---|---|---|---|
| NGX / DFM / ADX / US EOD price | Each trading day by 20:00 local | ≤ 1 trading day | 2–3 trading days | > 3 trading days | > 20 trading days |
| Delayed intraday quote (licensed) | Continuous, 15–30 min lag | ≤ 45 min in session; "close" after session | 45–120 min | > 2 h in session | — |
| Official FX (CBN NFEM, FMDQ) | Daily | ≤ 1 business day | 2 business days | > 2 business days or `republished` flag ≥ 2 days | > 10 business days |
| AED peg | Constant | Equals 3.6725 ± 0.01% | — | Deviation → `disputed` + alert | — |
| Policy rate (CBN, Fed, CBUAE) | Event-driven | Until `expiry_at` (next scheduled meeting + 7 days) | 7 days before expiry | Past expiry | Past expiry + 30 days |
| CPI | Monthly, ~15th | ≤ 45 days after reference month | 45–75 days | > 75 days | > 120 days |
| Quarterly fundamentals | Filing within exchange deadline | ≤ 135 days after period end | 135–180 | > 180 | > 400 |
| Annual fundamentals | — | ≤ 300 days after FYE | 300–400 | > 400 | > 550 |
| Shares outstanding | Event-driven | Until next CA notice | Any pending CA | CA effective but not applied | — |
| Holiday calendar | Quarterly refresh | Covers ≥ 90 days ahead | 30–90 days | < 30 days coverage | — |
| Vendor symbol map | On every ingest | Resolved | Resolved via alias | Unresolved → `fetch_failed` | — |

UI rule: a figure in `stale`, `expired`, `disputed` or `fetch_failed` state is never rendered as a bare number. The badge and the `as_of_date` are part of the figure component, not optional decoration. A screen that cannot show the badge cannot show the number.

#### 4.3.3 Two-source reconciliation rules for critical fields

| Field | Primary | Secondary | Tolerance | On breach |
|---|---|---|---|---|
| NGX close | NGX API `pricesEOD` (N1) | CSCS daily list (N6) or Mansa/Kobo/EODHD | ≤ 0.5% or one tick (tick table per NGX rules — open item) | `disputed`; show both with sources; exclude from valuation until resolved |
| NGX volume | N1 | N6 | ≤ 2% (block trades differ) | Flag only |
| DFM/ADX close | ADX MCP / DFM licensed feed | Vendor EOD | ≤ 0.5% | `disputed` |
| US close | Licensed vendor (I4/I8) | Second vendor or exchange summary | ≤ 0.1% | `disputed` |
| Shares outstanding | Latest filing (N5 / EDGAR) | Vendor | Exact | Vendor value `unconfirmed`; filing wins |
| EPS | Recomputed from net income and weighted shares | Vendor/filing EPS | ≤ 2% | `disputed`; show basic vs diluted separately |
| Dividend amount/ex-date/pay-date | Issuer notice (N5) | NGX dividends endpoint / vendor | Exact | Vendor-only dividend = `unconfirmed`; never applied to adjusted series |
| Official USD/NGN | CBN NFEM (X1) | FMDQ closing (X2) or Frankfurter (X5) | ≤ 0.5% (observed 2026-11-02: 1,346.26 vs 1,345.01 = 0.09%) | `disputed` |
| Parallel USD/NGN | Aggregator | Second aggregator | Informational only | Never used for valuation or tax |
| Index level | NGX index values (N1) | Vendor | ≤ 0.1% | `disputed` |
| CPI, policy rate | Statistical office / central bank release | Press or vendor mirror | Exact | Official wins; press-only = confidence B with `expiry_at` |

#### 4.3.4 Corporate-action adjustment checks

1. Raw and adjusted series are both stored; adjusted is always derivable from raw plus the CA table (`method = derived`, `calc_id = ca_adjust_v1`).
2. Every CA record requires an issuer document (N5 PDF or EDGAR filing) as `source_record_id`; vendor CA feeds populate `candidate` records only.
3. Adjustment factors: cash dividend (close − D)/close on ex-date (optional, flagged); bonus n-for-m: m/(m+n); split k:1: 1/k; rights: theoretical ex-rights price over cum price; consolidation: inverse of split. Factors stored with the CA record.
4. Test: ex-date adjusted return must lie within the stock's 99th percentile of absolute daily returns, else `disputed`.
5. Shares outstanding and market capitalisation must change on the same effective date; a price adjustment without a share change (or vice versa) blocks the record.
6. Recompute all per-share metrics from adjusted shares; never ingest vendor "adjusted EPS" as observed.

#### 4.3.5 Outlier and discontinuity checks

Daily return > 4 standard deviations or beyond the exchange's daily limit without a CA record; close outside the day's high–low; identical close for ≥ 3 sessions with non-zero reported volume (suspect feed); magnitude jump ×10³ in any fundamental between consecutive periods (scale error); FX move > 5% in a day in the official rate (regime event or error); missing session with no holiday record from all sources; vendor symbol resolving to a different ISIN than last time. Each produces a `disputed` state and a dashboard item, never a silent correction.

#### 4.3.6 The "no silent constants" rule

No numeric constant that describes the world (policy rates, tax rates, tick sizes, trading hours, holiday dates, index memberships, pegs, thresholds derived from regulation) may appear in application code. Each is a dated, sourced record in the store with `expiry_at`, a named refresh job, and a test that fails when the record is past expiry. The repository's `cbRate: 27.50` and the "accurate as of March 2026" table are exactly what this rule forbids [S93]. Engineering constants (retry counts, cache TTLs) are exempt but must be documented.

#### 4.3.7 Golden-dataset regression tests

A hand-verified set, maintained by the audit function, of roughly 20 securities × 5 years across NGX, DFM/ADX and US, plus the official FX and CPI series, with every corporate action, delisting, restatement, rebasing boundary and FX-regime break confirmed against primary documents. CI re-ingests the set from the configured sources on every change to ingestion or adjustment code and compares adjusted series, shares, EPS, dividends and FX to the golden values within the §4.3.3 tolerances. Known traps included deliberately: a bonus issue, a USD-reporting NGX issuer, an NGN'000 statement, the January 2025 CPI rebasing boundary, the June 2023 FX unification, a delisted name, a suspended name, a vendor symbol rename.

#### 4.3.8 Data-quality dashboard

Per source: last successful fetch, measured latency vs SLO, error rate, schema-drift alerts, licence expiry date and scope. Per data type: counts in each `validation_status`, reconciliation breaks open/closed, coverage of the user's holdings (% of positions with fresh, validated prices). Per surface: number of figures rendered with stale/disputed badges; AI answers blocked by the output validator (§4.3.12). Reviewed weekly by the audit function; thresholds trigger alerts.

#### 4.3.9 Audit log

Append-only. Every write of a figure, every state transition, every manual override (user, reason, before/after), every licence or source-registry change, and every AI answer (prompt hash, figure IDs supplied, figure IDs cited, validator result). Retention aligned with the tax and ledger teams' requirements (open item).

#### 4.3.10 Independent sign-off workflow

Figures are "conclusion-driving" when they feed a valuation, risk metric, goal evaluation, tax computation or any AI-stated conclusion. For these, `validated` requires a second actor distinct from the ingesting process: in the personal MVP, the founder acting as validator through a review queue with the evidence (source page snapshot, reconciliation result) alongside; in the commercial product, a data-quality analyst with no product-delivery KPI. The AI layer may cite `auto_validated` figures with their badge but may only state conclusions on `validated` ones. Overrides expire and are re-reviewed monthly.

#### 4.3.11 When sources disagree or data is missing

Show the gap. A missing price is rendered as "no data (source X unavailable since …)", not as the previous value and not as zero. A disagreement renders both values with sources and the tolerance that failed. Interpolation or carry-forward is permitted only as an explicitly labelled derived figure (e.g. "month-end NGN valuation uses last trade of 27 Oct — 6 days old"), produced by a named method and visible as such in every surface including AI prose and exports.

#### 4.3.12 Preventing AI-generated numbers

1. The model never receives raw numbers in its prompt as free text; it receives figure objects (`figure_id`, value, unit, as-of, status) through tool calls, and the tool refuses to return figures in `expired`, `fetch_failed` or (for conclusions) `disputed` states.
2. Arithmetic is performed by a calculation tool that returns a `calc_id` and inputs; the model reports results by reference.
3. The renderer substitutes values from the store for `{{figure:…}}` and `{{calc:…}}` tokens; the model's own digits are not rendered.
4. An output validator rejects any response containing numeric tokens (beyond dates, ordinals and list numbers) that are not tokens, and triggers one regeneration, then a refusal template ("I do not have a validated figure for …").
5. Temperature 0 for figure-bearing answers; the answer stores the set of figure IDs it used (audit log).
6. Regression suite of adversarial prompts ("what is the CBN rate", "estimate the price") must produce zero unreferenced numbers.
This design responds directly to the prototype's `ChatPanel.buildContext()` pattern and to F24.
