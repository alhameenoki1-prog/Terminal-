Review of: Document 5c — Market Data Sourcing, Licensing and Validation Framework (v0.1, 2026-11-02)  ·  Reviewer roles: market-data licensing researcher; principal data engineer; internal auditor  ·  Date: 2026-11-04  ·  Verdict: **Major revision** (§4.1 source catalogue broadly accepted; §4.3 control framework, §4.5 failure analysis and §4.6 costs need rework before the Investment Committee)

> Re-fetches in this memo were made on 2026-11-04 from this environment. "Confirmed" means the primary page or PDF was opened and the quoted text read. Nothing here is legal advice. A lawyer admitted in Nigeria and the UAE must review every licensing conclusion, the author's and mine alike.

## 1. Verdict and the three most important problems

The source catalogue is careful and mostly right. I re-fetched NGX API prices, the NGX End User Agreement, the FMDQ fees, the NAFEM methodology, the CBN MPC decisions, the NBS CPI coverage and EDGAR, and they match the document. The control framework, though, would not have stopped the failure it was built for, and it cannot yet be implemented.

1. **The repository's policy rate was wrong when it was written, so it did not go stale later (Blocking).** The repo file was committed on 2 March 2026. CBN's own decisions page shows the Monetary Policy Rate (MPR) was cut to 27.0% on 23 September 2025 and to 26.5% on 24 February 2026, and no MPC met in March 2026. The `27.50` / `nextMeeting: '2026-03-25'` pair was false on the day it was entered. The document's expiry control (Example C) would have shown 27.50% as *fresh* until 1 April. Nothing in §4.3 checks a value against a primary source when it is entered.
2. **The status vocabulary is undefined and contradicts the other documents (Blocking).** The "state machine below" in §4.3.1 is never drawn. The enum leaves out states that the document itself uses (`candidate`, `unconfirmed`, `republished`). It mixes freshness with validation, and it conflicts with 05a (V0–V3 plus a separate freshness_status) and with 07 (four states). The AI eligibility rules depend on this vocabulary.
3. **Non-display licensing and source independence are understated (Major).** NGX's agreement says *any* processing other than display needs a separate fee (cl. 3.1). Valuation, risk metrics, reconciliation and AI tools are all processing. Yet the MVP total leaves this fee out, and its upper bound is lower than the document's own international price. The "two-source" secondaries for NGX close and NFEM are largely copies of the primary, so when they agree it does not show the value is right.

## 2. Findings, severity-ranked

### Blocking

**B1 — §4.5 R1, §4.4 Example C, §4.3.6: the failure is "wrong at entry", but the controls only catch "decayed over time".**
*Claim:* had the expiry rule existed, the prototype's 27.50% "would have shown 'expired since 2026-04-01' rather than a confident number".
*Why it is wrong:* `git log` dates `src/data/countryProfiles.ts` to 2026-03-02. The CBN MPC decisions page (re-fetched) lists: 22–23 Sep 2025, "Reduce … by 50 basis points to 27"; 24–25 Nov 2025, retain 27; 23–24 Feb 2026, "Reduce … by 50 basis points to 26.5"; next meeting 19–20 May 2026. So on the commit date the value was 100 bp wrong, and the "next meeting" was a date on which no meeting was scheduled. Expiry was computed from that invented date, so an expiry control would have certified a false number as fresh for about a month. The same file pattern appears in `ratesData.ts` (Fed 4.25% with `lastChange: '2024-12-18'`, labelled "accurate as of March 2026"). That looks like values written from memory or an old source with a false freshness label (E4 inference). 05a §4.10 says the same figure would have been "expired since February 2026", which is a third account.
*Fix:* add root cause R0, "fact wrong at entry / false as-of assertion". Controls: (i) a new world-fact record cannot pass `raw` without an attached primary-source snapshot (URL, retrieval time, content hash). (ii) `expiry_at` comes from a separately sourced calendar record (CBN MPC calendar), never typed by hand. (iii) Before go-live, re-verify every seeded constant against primary sources. (iv) Correct Example C and settle the account with 05a.

**B2 — §4.3.1: the status machine is missing, the dimensions are mixed, and states are missing.**
*Claim:* "`validation_status` … State machine below."
*Why it is weak:* no transitions, guards or owners are defined anywhere. `stale`/`expired` (which depend on time) sit in the same enum as `validated` (which depends on evidence), so a validated figure that ages has no representable state. 05a correctly keeps these as two fields. States used elsewhere in the document are missing from the enum: `candidate` (§4.3.4.2), `unconfirmed` (§4.3.3), `republished` (§4.3.2, P17). States the assignment asked about are absent:
- **restated / withdrawn by source.** `superseded` covers a newer vintage but not a retraction, and not "the source says this was wrong".
- **licence_expired / licence_revoked.** NGX EUA cl. 13.5 ends rights on termination "except in respect of any Market Data already provided", and Yahoo developer terms require a purge within 24 h. Each needs its own state plus a purge or retain rule that cascades to derived figures.
- **symbol_unresolved / vendor_renamed.** §4.3.2 maps this to `fetch_failed`, which loses the cause.
- **pending_corporate_action.**
- **override_expired.**

The provenance record is also missing fields:
- `published_at`: the source's release time, separate from `as_of_date` and `retrieval_timestamp`. Without it there is no point-in-time history and no ALFRED-style vintages, and 07 §4.2 P4 requires bitemporal `recorded_at` / `as_of_recorded`.
- `evidence_snapshot_hash`: §4.3.10 relies on a "source page snapshot" but has no field for it.
- `price_type`: last, official close, VWAP or reference.
- `adjustment_basis` and `ca_set_version`.
- For fundamentals: `consolidation_scope` (group vs company: Nigerian banks publish both), `audited` flag, `accounting_basis`, `fiscal_period_id`.
- `terms_version` on the licence record (see m3).
- `source_independence_group` (see M2).

*Fix:* publish one joint state chart with 05a and 07, covering validation × freshness × licence. Each transition should name its trigger and actor. Make the three documents use one enum.

**B3 — Cross-document conflict on the AI number contract (§4.3.12 vs 07 §4.6).**
05c says "the renderer substitutes values … the model's own digits are not rendered" and rejects *any* numeral that is not a token. 07 lets the model write numerals and matches them against tool results within "0.5% relative or the display rounding". These are different systems with different failure modes: 07's 0.5% tolerance would pass a figure the model rounded on its own. 05c also prescribes "Temperature 0", while 07 F15 reports adaptive thinking "always on" for Opus 5.5. In earlier Anthropic APIs, enabling thinking stopped you changing the temperature. I did not re-verify this for 5.5-series models, but the control may simply be unavailable. 05c also names ADX's MCP server as the primary DFM/ADX price route. MCP sends data through the model, which goes against 05c rule 1 ("never receives raw numbers … as free text") unless a deterministic client calls it. *Fix:* the AI and data teams adopt one contract. Token substitution is the safer default, with 07's numeric gate kept as a second layer. Delete the temperature rule or verify it.

### Major

**M1 — §4.6, §7.2: MVP cost leaves out non-display fees and miscalculates its own upper bound.**
The EUA (re-fetched, cl. 3.1 and glossary) defines Non-Display Usage as "accessing, processing, consumption or other use of Market Data for purposes other than in support of display". Portfolio OS's adjusted series, valuations, risk models, reconciliation and AI tools are exactly that. The 2026 schedule's "Delayed Data for Financial modelling" fee is NGN 1,250,000 (USD 7,500) [S3, per F4]. Recomputed at 1,345.01 NGN/USD:
- Local basis: EOD + Interday + non-display = NGN 1,675,000 ≈ USD 1,245/yr ≈ USD 104/mo, or ≈ USD 1,339/yr with 7.5% VAT.
- International basis: USD 2,000 + 7,500 = USD 792/mo.
- Even without non-display, the international basis is USD 167/mo for NGX alone, above the stated "USD 26–150 per month" total.

Two further gaps:
- The portal describes Interday as history "for specified securities", so the price may scale with the number of holdings. That is not addressed.
- Costs mix bases: NGX figures exclude VAT, while FMDQ's 2023 figures are VAT-inclusive and their USD column is struck at NGN 500/USD.

*Fix:* show a 2×2 range (local or international × with or without non-display). Ask NGX in writing whether personal analytics count as non-display use. Put the founder's validation time into the cost.

**M2 — §4.3.3: two-source reconciliation assumes the sources are independent, and they are not.**
- *NGX close:* Kobo's API page (re-fetched) labels index data "sourced from official NGX data" / "NGX chartdata". Mansa parses NGX PDFs. CSCS is NGX's depository. So agreement shows the data was copied faithfully, not that it is correct.
- *USD/NGN:* the Frankfurter currencies page (re-fetched) lists CBN among NGN's 16 providers. The "official" check against Frankfurter is therefore partly the CBN checking itself, and against a *blended* rate. FMDQ's closing rate is the "VWAP of … last ten (10) trades" (NAFEM methodology §5.2.1, re-fetched), which is defined differently from CBN's NFEM VWAP.

Tolerances are stated with no derivation:
- 0.1% for US close ignores the difference between consolidated last trade and the closing-auction price.
- "Exact" dividend matching will break on kobo vs naira and on gross vs net of withholding tax.

*Fix:* add a `source_independence_group`. Confidence A should require two *independent* groups. For NGX, state openly that A is unreachable today. Set tolerances per field and per price group (using 05a's tick table) from the two-week NGX trial data (§9.1). Grade them E5 until then.

**M3 — §4.3.3 has no protocol for single-source fields.**
The following have only one source:
- CPI
- MPR (often only the press, because CBN pages render on the client side)
- index membership
- FMDQ fixings
- shares outstanding from filings
- everything on DFM

§4.3.10 then requires a human `validated` state for every figure that drives a conclusion. For about 20 NGX holdings at 250 sessions that is roughly 5,000 price validations a year for the founder. Nobody will do that, so the queue will be rubber-stamped. *Fix:* define validation for single-source fields: internal-consistency checks (recompute CPI year-on-year from index levels; market cap ÷ price vs shares), plausibility bands, and rule-based auto-acceptance with risk-based human sampling. Show "single source" on the badge.

**M4 — §4.3.4 / P2: the corporate-action engine does not fit how NGX works.**
- *Rule 5 blocks legitimate records.* It requires share count and price to change "on the same effective date". On NGX a bonus is marked down at qualification/ex-date, approved at the AGM, and the new shares are listed and credited by CSCS weeks later (E4, practitioner knowledge; verify against NGX Rulebook). The CA record needs separate declaration, ex, qualification/closure, approval, listing and credit dates.
- *Ex-dates follow the settlement cycle.* T+3 → T+2 on 28 Nov 2025 → T+1 on 1 Jun 2026 (05a F4), so ex-date logic must read the settlement regime in force on each date from the rule registry.
- *Holding-company restructurings are missing.* Schemes of arrangement (e.g. GTB→GTCO, Access Bank→Access Holdings, FBNH→First HoldCo) replace ISIN and ticker 1:1, and an entity master keyed on ISIN + MIC breaks the history without a succession table.
- *Other missing cases:*
  - 2024–26 bank-recapitalisation rights issues, including rights trading and supplementary allotment
  - scrip dividends
  - a nominal-value (par) change, which has a price factor of 1 but which vendors may misread
  - dividends declared in kobo
- *The ex-date test has false positives by construction.* The 99th-percentile check flags about 1% of ordinary days. Ex-dates cluster in results season.

*Fix:* add these CA types to the golden dataset. Replace rule 5 with "share change expected within N days of ex-date, or `pending_corporate_action`".

**M5 — §4.3.5 creates false positives on NGX.**
"Identical close for ≥3 sessions with non-zero reported volume (suspect feed)" goes against NGX's pricing rule. A trade below 10,000 / 50,000 / 100,000 units (by price group) does not move the price (05a F3). On illiquid names, unchanged closes with volume are normal. *Fix:* condition the check on traded volume being at or above the group threshold, read from the market-rule registry.

**M6 — Conclusion 2, F6: "unlicensed" is over-claimed.**
The NGX vendors page (re-fetched) is headed "current list of NGX **Real-time** Market Data Vendors". It is not a list of delayed or EOD licensees, so a vendor's absence from it does not prove the vendor is unlicensed. Kobo serves 30-minute delayed data and does not claim a licence. The accurate statement is "licence status undocumented". Keeping them as secondaries is still right. *Fix:* reword, and ask NGX for its list of delayed and EOD display licensees.

**M7 — §4.3.6: "No silent constants" is written as policy, with nothing to enforce it.**
- Nothing tells a world fact apart from an engineering constant in code.
- A CI test that "fails when the record is past expiry" makes every build fail because of the calendar. That check belongs in a scheduled monitor.
- The document itself writes in constants that would need registering: peg 3.6725 ± 0.01%, every tolerance and freshness threshold, SEC's 10 req/s, VAT.
- The repository already has *duplicate, inconsistent* copies: `TransmissionMap.tsx` "Static CB rates (March 2026)" ECB 2.65 vs `ratesData.ts` ECB 2.50, and `economicCalendar.ts` "accurate as of March 2026". R1 does not list these.

*Fix:*
- A `Figure` type that can only be built through the registry.
- A magic-number lint (ESLint `no-magic-numbers` or Ruff `PLR2004`) on domain modules, with annotated exemptions.
- A CI grep that rejects "as of"/date literals in `src/`.
- A CODEOWNERS review by the data-quality owner.
- Thresholds stored as configuration records with a source.

**M8 — §4.3.2 vs 05a §4.10: freshness thresholds disagree.**
| Item | 05c | 05a |
|---|---|---|
| EOD price stale | > 3 days | after 2 |
| EOD price expired | > 20 | after 5 |
| FX expired | > 10 | after 5 |
| Quarterly fundamentals | "fresh" ≤ 135 days | stale at 120 |
| Annual fundamentals | "fresh" ≤ 300 days | stale at 270 |

05c's annual threshold treats a 299-day-old statement as fresh, although NGX filing deadlines are far shorter (E4; 05c concedes deadlines were not fetched). *Fix:* one table, tied to the next filing *expected* under registry deadlines rather than to fixed day counts.

**M9 — UAE coverage: DFM is quietly dropped from the MVP, and ADX MCP is assumed to be adequate.**
- Re-fetched: `dfm.ae` market-data-providers still shows only "Fetching Data…", and `api.dfm.ae/docs/` still returns the "Filenotfound" stub. `adx.ae` still returns 403 (curl and WebFetch).
- The Arabian Post article (re-fetched) confirms Starter is "free and allows 100 tool calls a month, covering current or last-trading-day history". That is about three calls a day, with no history, and it covers ADX only, yet §4.3.3 lists it as primary for "DFM/ADX close".

*Fix:* treat custodian and broker statements, which System A already ingests, as a provenance-carrying price source for DFM/ADX holdings (`method = observed`, source = statement page). Record DFM as an explicit gap; do not leave it as "Later".

**M10 — F12 / P18: the CPI revision is attributed to the wrong cause, and the control is too narrow.**
The VON article (re-fetched) confirms 14.63% for September 2026 against "20.98 per cent recorded in September 2025", and mentions "newly introduced sub-indices". That fits the January 2026 reference-period or methodology change (05a S48) better than the January 2025 rebasing. The base year did not change, so "series ID includes base" would not catch it. *Fix:* key series on `methodology_version`. Compute year-on-year changes only within a single vintage, using index levels.

### Minor

- **m1.** F9: the NAFEM republication rule is now confirmed from the primary PDF (§6.1–6.3: republish the previous close; committee after five days; republished rates "identified as such" on the website/e-Markets). Upgrade it to E2. Also note the waterfall, where Level IV holds the day's opening rate, and FMDQ's expert-judgement discretion (§4). The methodology dates from 2023, before CBN's 2024 EFEMS/NFEM changes, so check it is still current.
- **m2.** FMDQ fees note 9: "Only Real-Time API is available for Closing Prices". An EOD API end-user subscription (NGN 322,500) may not deliver bond closing prices. API connection fees appear to be additional to data fees. Rec 9's cost should reflect both.
- **m3.** Yahoo ToS (re-fetched) now reads "Last updated: 1 November 2026", not the versions cited. The clauses quoted are unchanged. The licence registry needs `terms_version`, `terms_hash` and a re-check date.
- **m4.** F11 is graded E3 because "communiqué not fetched", but the CBN decisions page is reachable and confirms it. Upgrade to E2 and use it as the primary in the §4.3.1 example. The current example record (press source, `auto_validated`) shows the very weakness B1 describes.
- **m5.** P20 does not list the repo's `price: q.regularMarketPrice ?? 0` and `change24h: … ?? 0` (`yahooService.ts`). A missing change is shown as 0%, a "false unchanged" defect.
- **m6.** §4.3.7: re-ingesting a licensed golden dataset in CI, or storing it in the GitHub repo, may count as storage or redistribution under NGX/vendor terms. Keep fixtures in private, licensed storage.
- **m7.** Kobo is misquoted: the page says "Public endpoint access does not grant commercial redistribution rights", not "public availability…".
- **m8.** Document metadata is 2026-11-02, but S101 says "checked 2026-11-04". The version should be bumped.
- **m9.** P12 is already resolved: 05a F2 has NGX hours at 09:00–16:00 WAT from 27 Apr 2026, and the tick table is there too, so EODHD's 10:00–14:20 is stale vendor metadata. That example of vendor drift deserves a mention.
