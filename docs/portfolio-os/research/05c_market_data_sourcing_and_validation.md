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

### 4.4 Worked examples (synthetic numbers)

**Example A — bonus issue on a synthetic NGX stock "SYNTH PLC".** Raw closes: 29 Oct NGN 100.00; 30 Oct NGN 100.00 (ex-date of a 1-for-4 bonus); shares 1,000 m → 1,250 m per issuer notice (N5, PDF ref `doclib/synth-bonus-2026.pdf`). Expected ex-date price 100 × 4/5 = NGN 80.00; observed raw close NGN 80.50. Adjustment factor 0.8 applied to all pre-ex closes (adjusted 29 Oct = 80.00); adjusted ex-date return = 80.50/80.00 − 1 = +0.6% (passes the 99th-percentile test). Unadjusted series would show −19.5% — the "false crash" the prior tracker would have displayed. Trailing EPS: net income NGN 12,500 m (NGN'000 statement, `scale = 3`, converted at ingest) ÷ weighted shares; vendor EPS of NGN 12.50 (pre-bonus) vs recomputed NGN 10.00 → 25% variance → `disputed`, filing-derived value shown with note "vendor EPS not bonus-adjusted".

**Example B — FX provenance and reconciliation, real observations of 2026-11-02.** CBN NFEM (as relayed by an aggregator) 1,346.26; Frankfurter v2 1,345.01; difference 0.09% < 0.5% → USD/NGN `official_nfem` figure `auto_validated`, confidence B (primary page values did not render; upgrade to A once the CBN Excel export is attached). Parallel 1,382/1,388 stored as `parallel_indicative`, confidence D, never used for valuation or tax; the UI shows "Official (CBN NFEM) 1,346.26 · parallel indicative mid 1,385 (+2.9%)". USD/AED 3.6725 = peg → fresh.

**Example C — the policy-rate record.** `CBN:MPR = 23.00%`, `as_of 2026-09-22`, source press pending communiqué, `expiry_at` provisional (next MPC date unknown — open item), refresh job weekly. Had this rule existed, the prototype's 27.50% would have shown "expired since 2026-04-01" rather than a confident number.

### 4.5 Failure analysis of the prior "stale figures" problem

Reconstructed from repository patterns (prior tracker code is unavailable; the NEXUS repo shares the author and era, so these are plausible causes, E5 unless noted).

| # | Root cause | Evidence in repo [S93] | Effect on users | Control |
|---|---|---|---|---|
| R1 | Hardcoded world-facts | `cbRate: 27.50`, `nextMeeting: '2026-03-25'`, static central-bank table "accurate as of March 2026" | Rates 450 bp wrong eight months later (E2, F11) | §4.3.6 no silent constants; expiry; refresh jobs |
| R2 | Unofficial/undocumented endpoints | Yahoo v7/v8, Stooq CSV, CBOE CDN, rss2json, Binance via Vite proxy | Silent breakage, ToS exposure (F19) | Source registry with licence records; only licensed/official sources feed the store |
| R3 | Failure swallowed as empty or cached | `catch { return [] }`; cached closes returned on error without age | Last good value looks current | `fetch_failed` state; retrieval timestamps; age badges; cache never "truth" |
| R4 | No as-of or source on values | `Ticker` type has price, change, volume only | User cannot tell 2 minutes from 2 months | Provenance schema mandatory (§4.3.1) |
| R5 | Unit/semantic mislabel | `CPIAUCSL` "US CPI YoY %", `GDP` "growth %" | Index level 3xx displayed as 3xx% | Unit/scale fields; series metadata registry; golden tests |
| R6 | Placeholder substitution across markets | Nigeria `yahooBond: '^TNX'` (US 10-year) | Wrong country's yield shown as Nigeria's | Entity master by MIC/ISIN; no cross-market placeholders |
| R7 | Unsourced composite scores | `instabilityScore: 72` and breakdown | Pseudo-precision | Derived figures require method and inputs |
| R8 | LLM restating injected numbers | `buildContext()` + "Cite specific levels and spreads" | Fabricated or stale figures in prose (F24) | §4.3.12 |
| R9 | Secrets in browser storage | Zustand `persist` of API keys | Key leakage; vendor account suspension | Server-side secrets (Security team) |
| R10 | No tests, no CI, client-only | Repo has no tests | Regressions undetected | Golden dataset CI; DQ dashboard; server-side store with audit log |
| R11 | Vendor symbol drift | `.LG`, `^NGSEINDX`, `NGN=X` with no alias map | Quietly missing instruments | Versioned symbol maps; schema-drift alarms |

### 4.6 Recommended data stack and estimated costs

Costs use only prices seen (§4.1) and the 2026-11-02 illustrative FX; VAT and withholding excluded; annual fees divided by 12.

**Personal MVP (founder only, personal/internal use).**

| Layer | Choice | Monthly cost (as seen) | Legal caveat |
|---|---|---|---|
| NGX prices & history (system of record) | NGX API: EOD prices + Interday (10-yr OHLCV) | NGN 425,000 p.a. ≈ USD 316 p.a. ≈ **USD 26/mo** (local pricing); international pricing USD 2,000 p.a. ≈ USD 167/mo | Natural-person eligibility and local/international status to be confirmed with NGX; non-display processing may attract the ND fee — ask in writing |
| NGX dividends & CA (optional in month 1) | NGX dividends (specific securities) NGN 250,000 p.a.; News & CA NGN 650,000 p.a. | ≈ USD 15 + 40/mo | Same |
| NGX secondary (cross-check only) | CSCS daily list (free) + Mansa Free (100 req/day) or Kobo Personal (NGN 0) | USD 0 | Unlicensed provenance; display nothing sourced solely from them |
| Filings | NGX doclib PDFs; SEC EDGAR | USD 0 | SEC: ≤10 req/s, declared User-Agent |
| UAE | ADX MCP Starter (free) or AED 9.99–49.99/mo (≈ USD 2.7–13.6); DFM: 15-min delayed display only until a licensed route is found | USD 0–14 | ADX licence text unread; DFM API unresolved |
| US prices | Tiingo Starter (free) or Power USD 30; EODHD Historian USD 19.99 as global secondary | USD 0–50 | "personal use only" clauses |
| FX | CBN NFEM Excel export (free), Frankfurter v2 (free), parallel aggregator (informational) | USD 0 | Provider-endpoint terms |
| Macro & rates | FRED (key, attribution), NBS, CBN, Treasury, World Bank, IMF | USD 0 | FRED notice; World Bank non-commercial general terms |
| **Total** | | **≈ USD 26–150 per month** depending on NGX pricing basis and optional feeds | |

**Commercial product (Nigerian retail/diaspora, display of NGX data to users).** Minimum NGX licences from the 2026 schedule: Website/Mobile Delayed Display NGN 250,000 p.a. (USD 2,500) or End-of-Day Display NGN 120,000 p.a. (USD 1,000), plus a distribution licence for the feed actually received (Delayed Data License NGN 2,000,000 p.a.; EOD NGN 1,500,000 p.a.), plus end-user fees where real-time is shown (Level 1 USD 10/user/month local), plus API bandwidth bands NGN 200,000–800,000 p.a.; non-display modelling licence NGN 1,250,000 p.a. if analytics are computed on delayed data [S3]. FMDQ: NAFEM EOD distribution NGN 3,359,375 p.a.; Daily Quotations List redistribution per framework [S21]. UAE and US: vendor commercial plans (prices not public for EODHD B2B; Twelve Data Pro USD 229/mo personal-equivalent; Massive business pricing n.p.). Indicative floor **≈ NGN 5–8 million p.a. (USD 3,700–6,000) before UAE/US commercial data and before legal review**; the real number depends on which NGX products are displayed versus processed. (E5 — assembled from published schedules; NGX quotes are bespoke.)

## 5. Alternatives considered and rejected

| Alternative | Why rejected |
|---|---|
| Scrape NGX, DFM or Investing.com pages | Explicitly prohibited by NGX Policy §8.2.7 and Investing.com terms; fragile; no provenance [S5, S50] |
| Rely solely on free third-party NGX APIs (EODHD, Mansa, Kobo) | Not on NGX's authorised vendor list; EODHD discloses non-exchange sourcing; redistribution rights unclear; acceptable only as secondary [S12, S40, S46] |
| Keep Yahoo Finance unofficial endpoints | ToS forbids automated collection and commercial reuse; endpoints change without notice [S80, S81] |
| Bloomberg/LSEG terminal | Cost ceiling (aggregator estimates USD 22k–32k/user/yr, unverified); terminal licences do not permit feeding a product [S52] |
| LLM with web search to "look up" figures | No provenance, no licence, demonstrated error rates [S101] |
| Build a full corporate-actions database from vendor feeds without issuer documents | Cannot be validated; kept as candidate layer only |
| Interpolate or carry forward silently to keep charts continuous | Reproduces the original failure; permitted only as labelled derived figures |
| Single-source ingestion for critical fields | Cannot detect vendor error; two-source rule retained for the §4.3.3 fields |

## 6. Cross-department dependencies

**We need:** Legal & Compliance — review NGX EUA, Policy and API order form for a natural person; confirm local vs international fee status; review ADX MCP and vendor terms; advise on redistribution before any commercial display. Platform & Security — server-side store, secrets management, CI for golden tests, audit log retention. Investment Research — the authoritative field list, fiscal-year handling, which fundamentals are conclusion-driving. Portfolio & Quant — adjusted-series contract, FX conversion policy (official NFEM for valuation), benchmark constituents. Tax — the legally required FX rate and CPI vintage for Nigerian and UAE computations (unknown — founder and tax team to confirm). AI — adoption of the figure-token contract (§4.3.12). Product/UX — stale, disputed and gap states as first-class components.

**Others need from us:** the provenance schema and status vocabulary (all teams); the source registry with licence scopes (Legal, AI); freshness SLOs (Product); the golden dataset (Engineering); the DQ dashboard (audit/founder).

## 7. Risks, open uncertainties and disagreements

1. **Engineer vs audit function (preserved).** Engineering position: start with free sources (CSCS, Mansa, Kobo, Tiingo, Frankfurter) and ship; licence later. Audit position: nothing enters the system of record without a licence record and two-source validation; free sources are cross-checks only. Proposed resolution: the MVP ingests free sources from day one *as secondaries* while the NGX API contract is pursued; no NGX figure is shown without a badge stating its source and licence status; the first validated conclusion waits for the NGX feed.
2. **NGX eligibility and price basis** (F1, F3): unconfirmed whether NGX contracts with individuals and whether the founder is a "local" end user. Range of outcomes: NGN 425,000 to USD 5,500 per year.
3. **UAE access**: adx.ae, CBUAE and FCSC were unreachable (403); ADX MCP terms unread; DFM developer portal missing. A UAE-resident purchase may be needed.
4. **NBS methodology**: a reported January 2026 reference-period change is unverified; back-series revision confirmed only indirectly (F12).
5. **NGX session hours disagree between sources** (P12); tick-size table, daily price limits and filing deadlines were not fetched — all must be sourced from NGX rules before coding.
6. **Next CBN MPC date unknown**; expiry for the MPR record is provisional.
7. **Academic references unverified** (OpenAlex quota exhausted); their role is supportive only.
8. **Cost ceiling figures (Bloomberg/LSEG) are aggregator estimates**, not quotes.
9. **Vendor renames and 301 redirects are frequent** (F25); every integration needs a drift alarm.
10. **Search budget exhausted mid-task**; items marked "not reached" are gaps, not negatives.

## 8. Recommendations, ranked

| Rank | Recommendation | Class |
|---|---|---|
| 1 | Adopt the provenance schema, status machine and "no silent constants" rule before any ingestion code (§4.3.1, §4.3.6) | Personal-MVP must-have |
| 2 | Request an NGX Market Data API quote (EOD + Interday; later dividends/CA) as a Non-Professional End User; Legal to review EUA/Policy; record outcome as a dated decision | Personal-MVP must-have |
| 3 | Implement freshness SLOs with mandatory badges and the gap-not-interpolation rule in the UI (§4.3.2, §4.3.11) | Personal-MVP must-have |
| 4 | Enforce figure-token AI output (§4.3.12); retire the prompt-injection pattern | Personal-MVP must-have |
| 5 | Build the corporate-action engine with issuer-document gating and the golden dataset CI (§4.3.4, §4.3.7) | Personal-MVP must-have (NGX subset first) |
| 6 | Two-source reconciliation for close, shares, EPS, dividends, official FX (§4.3.3) using CSCS/Mansa/Kobo as secondaries | Personal-MVP must-have |
| 7 | Official FX policy: CBN NFEM for valuation, labelled; parallel indicative only; AED peg check | Personal-MVP must-have |
| 8 | Evaluate ADX MCP Starter under its actual terms; defer DFM until a licensed machine-readable route exists | Later |
| 9 | FMDQ end-user data subscription (bond/T-bill quotations) once fixed-income analytics are in scope | Later |
| 10 | Commercial redistribution licences (NGX website/mobile display, distribution licence, FMDQ) | Later (gate on commercialisation decision) |
| 11 | Bloomberg/LSEG terminal | Do-not-build (yet) |
| 12 | Any scraping of exchange or publisher sites | Do-not-build |

**Five-question test, top items.**
*Rec 1–3 (provenance, licensed NGX feed, freshness badges).* Problem: the prior tracker displayed outdated figures without the user knowing (founder report; repo evidence F23). Who: the founder first; any Nigerian retail user later, because NGX data is thin and vendors are unlicensed. Evidence: exchange documents establish that licensed EOD data exists at modest cost (F1, E2); data-quality literature on vendor errors supports provenance and two-source controls (E3, unverified citations) and FinanceBench supports constraining model numbers (E2). Build/validate: schema plus golden-dataset CI plus measured freshness; validation is the dashboard's stale/disputed counts going to zero on the holdings set. Improvement metric: share of displayed figures with age ≤ SLO and validated status (target 100% of conclusion-driving figures); zero unreferenced numbers in AI output; zero undisclosed gaps.
*Rec 4 (AI figure tokens).* Problem: fabricated/stale numbers in prose. Who: anyone reading AI explanations. Evidence: F24. Build/validate: output validator with adversarial prompt suite. Metric: blocked-answer rate falling over time while unreferenced-number rate stays at zero.
*Rec 5 (corporate-action engine).* Problem: bonus issues create false crashes and wrong per-share metrics (P2–P3). Who: NGX investors. Evidence: no vendor documents NGX adjustment (F1–F7). Build/validate: factor tests against issuer notices. Metric: adjusted-return outliers on ex-dates explained 100%.

## 9. Required validation before implementation

1. Written confirmation from NGX on individual eligibility, fee basis (NGN vs USD), non-display treatment, rate limits and schema; a two-week technical trial measuring actual delay and completeness against CSCS.
2. Legal sign-off on NGX EUA/Policy, ADX MCP terms, Tiingo/EODHD/Mansa/Kobo terms for personal use; a written decision on Yahoo (recommended: remove).
3. Fetch and record NGX trading hours, tick sizes, daily limits and filing deadlines from NGX rulebooks; resolve P12.
4. Obtain the CBN MPC calendar and the NBS CPI release calendar; confirm the NBS methodology question with the NBS release note.
5. Reach CBUAE and FCSC (possibly from a UAE network) for the peg statement, EIBOR and CPI access terms.
6. Build the golden dataset (≥ 20 securities) with the audit function; agree tolerances with Portfolio & Quant.
7. Prototype the figure-token AI contract on synthetic data and run the adversarial suite.
8. Verify the five academic references once the OpenAlex quota resets; downgrade or remove any that fail.

## 10. Sources

Access date 2026-11-02 unless stated; "reached" = page/file opened and read; "extracted" = PDF text extracted locally; "snippet" = search excerpt only; "not reached" = fetch failed.

- [S1] NGX, "Market Data" — https://ngxgroup.com/exchange/data/ — reached.
- [S2] NGX, "Data Pricing, Policies & Contracts" — https://ngxgroup.com/exchange/data/data-pricing-policies-contracts/ — reached.
- [S3] NGX, Market Data Pricelist, Schedule 3 (PDF metadata: created 12 Aug 2026) — https://ngxgroup.com/ngx-download/market-data-pricelist-2/?wpdmdl=41216 — extracted.
- [S4] The Nigerian Stock Exchange, Market Data Pricelist 2018, Schedule 4 — https://doclib.ngxgroup.com/market_data-site/market-data-services-site/Data%20Policies/NSE%20Market%20Data%20Pricelist%202018.pdf — extracted.
- [S5] NGX, Market Data Policy Document v2.0, effective 22/07/2020 (© 2022) — https://ngxgroup.com/ngx-download/market-data-policy/?wpdmdl=27017 — extracted.
- [S6] Nigerian Exchange Limited, Global Data Licence Agreement for End Users (© 2021) — https://ngxgroup.com/ngx-download/end-user-agreement/?wpdmdl=27014 — downloaded and extracted.
- [S7] NGX, Historical Data Policy and Request Form — https://ngxgroup.com/ngx-download/historical-data-policy-and-request-form/?wpdmdl=27000 — not reached (redirect/HTML).
- [S8] NGX, "Historical Data" — https://ngxgroup.com/exchange/data/historical-data/ — reached.
- [S9] NGX, Market Data API portal, "Get started" (annual pricing) — https://marketdataapiv3.ngxgroup.com/portal/getstarted/index — reached.
- [S10] NGX, Market Data API Documentation — https://marketdataapiv3.ngxgroup.com/portal/Home/Documentation — reached.
- [S11] NGX, Equities Price List — https://ngxgroup.com/exchange/data/equities-price-list/ — reached.
- [S12] NGX, Vendors List — https://ngxgroup.com/exchange/data/vendors-list/ — reached.
- [S13] NGX, X-DataPortal — https://ngxgroup.com/exchange/data/x-dataportal/ — reached.
- [S14] NGX, Delisted Companies — https://ngxgroup.com/exchange/data/delisted-companies/ — reached.
- [S15] NGX, "FAQs on X-Issuer" (PDF) — https://doclib.ngxgroup.com/investors-site/becoming-an-investor/FAQs/FAQs%20ON%20X-ISSUER.pdf — snippet.
- [S16] Nairametrics, "Nigerian Exchange says use of Issuers' Portal for all issuers now mandatory", 30 Jun 2022 — https://nairametrics.com/2022/06/30/nigerian-exchange-says-use-of-issuers-portal-for-all-issuers-now-mandatory/ — snippet.
- [S17] CSCS Plc homepage — https://www.cscs.ng/ — reached.
- [S18] CSCS, Daily Price — https://www.cscs.ng/market-information/daily-price/ — reached.
- [S19] CSCS, API Services — https://www.cscs.ng/api-services/ — reached.
- [S20] CSCS, Charges and Fees (effective 1 Jan 2026 and 1 Feb 2025) — https://www.cscs.ng/charges/ — reached.
- [S21] FMDQ Exchange, Fees and Dues Framework 2023 (PDF created 25 Oct 2023) — https://fmdqgroup.com/exchange/wp-content/uploads/2023/10/FMDQ-Exchange-2023-Fees-and-Dues-Framework-.pdf — extracted.
- [S22] FMDQ Exchange, NAFEM Spot Rates Methodology, Oct 2023 — https://fmdqgroup.com/exchange/wp-content/uploads/2023/10/FMDQ-Exchange-NAFEM-Spot-Rates-Methodology-October-2023.pdf — snippet.
- [S23] FMDQ Exchange homepage (quotes dated 29–30 Oct 2026) — https://fmdqgroup.com/exchange/ — reached.
- [S24] FMDQ, Benchmark Administration — https://fmdqgroup.com/exchange/market-data/benchmarks/ — reached.
- [S25] FMDQ e-Markets portal — https://emarkets.fmdqgroup.com/market/ — reached.
- [S26] FMDQ, Market Data — https://fmdqgroup.com/exchange/market-data/ — not reached (503).
- [S27] CBN, Data & Statistics index — https://www.cbn.gov.ng/rates/ — reached.
- [S28] CBN, Exchange Rates (NFEM) — https://www.cbn.gov.ng/rates/ExchRateByCurrency.html — reached (structure).
- [S29] CBN, Money Market Indicators — https://www.cbn.gov.ng/rates/mnymktind.html — reached (structure).
- [S30] CBN, Inflation — https://www.cbn.gov.ng/rates/inflrates.html — reached (structure).
- [S31] CBN Statistics Database — https://statistics.cbn.gov.ng/shop — reached (homepage).
- [S32] Nairametrics, "CBN resets MPR to 23%", 22 Sep 2026 — https://nairametrics.com/2026/09/22/cbn-resets-mpr-to-23/ — reached.
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
- [S46] Kobo Terminal (formerly NGX Pulse), API — https://koboterminal.com/api (301 from https://ngxpulse.ng/api) — reached.
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
- [S57] DFM API docs — https://api.dfm.ae/docs/ — not reached ("Filenotfound").
- [S58] LSEG, Dubai Financial Market data page — https://www.lseg.com/en/data-analytics/financial-data/pricing-and-market-data/equities-market-data/dubai-financial-market — snippet.
- [S59] ADX, MCP Features — https://www.adx.ae/market-data-services/model-context-protocol/adx-mcp-features — not reached (403); snippet.
- [S60] ADX, Directory of Vendors — https://www.adx.ae/members-and-participants/vendors/directory-of-vendors — not reached (403); snippet.
- [S61] The Arabian Post, "ADX opens live market data to conversational AI", 14 Aug 2026 — https://thearabianpost.com/adx-opens-live-market-data-to-conversational-ai/ — reached.
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
- [S80] Yahoo, Terms of Service (versions dated 15 May 2025 and 2 Jan 2026) — https://legal.yahoo.com/us/en/yahoo/terms/otos/index.html — reached.
- [S81] Yahoo Developer Network, API Terms of Use (REV 3-2022) — https://legal.yahoo.com/us/en/yahoo/terms/product-atos/apiforydn/index.html — reached.
- [S82] Frankfurter v2 — https://frankfurter.dev/ , https://frankfurter.dev/currencies/ , https://api.frankfurter.dev/v2/rate/usd/ngn , https://api.frankfurter.dev/v2/rate/usd/aed — reached and probed 2026-11-02.
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
- [S102] Ince, O. S., Porter, R. B., "Individual equity return data from Thomson Datastream: Handle with care!", Journal of Financial Research, 2006 — **[unverified]** (OpenAlex quota exhausted 2026-11-02).
- [S103] Lesmond, D. A., Ogden, J. P., Trzcinka, C. A., "A New Estimate of Transaction Costs", Review of Financial Studies, 1999 — **[unverified]**.
- [S104] Scholes, M., Williams, J., "Estimating betas from nonsynchronous data", Journal of Financial Economics, 1977 — **[unverified]**.
- [S105] Dimson, E., "Risk measurement when shares are subject to infrequent trading", Journal of Financial Economics, 1979 — **[unverified]**.
- [S106] Ljungqvist, A., Malloy, C., Marston, F., "Rewriting History", Journal of Finance, 2009 — **[unverified]**.

*Simulated specialists are not licensed professionals: licensing conclusions above require review by a lawyer admitted in Nigeria and the UAE before any contract is signed or any data is displayed to third parties.*
