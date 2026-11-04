Review of: Document 8 — User Experience and Product Design Blueprint (v0.1, file dated 2026-11-04 09:14)  ·  Reviewer roles: senior product designer; accessibility specialist (WCAG 2.2 AA, numeracy, low-end Android); HCI researcher (uncertainty visualisation, trust calibration); behavioural scientist (claims ladder, no labels); product-analytics lead  ·  Date: 2026-11-04  ·  Verdict: **Major revision**

## 1. Verdict and the three most important problems

The core commitments are sound and well sourced: evidence strip, Working panel, two disclosure levels, frequency-framed uncertainty, no labels and no gamification. The academic citations I sampled are real and match their metadata. The problem is that Doc 8 was written, and then revised on 2026-11-04, without being reconciled with Docs 3, 4, 5c, 6 and 7, which now exist. Several of its specifications contradict them directly. The three most important problems:

1. **The insight card and self-experiment break Doc 3's claims ladder.** The card puts an un-intervalled "38 % in 4 days" at L1 even though it lists alternative explanations it "cannot rule out". It uses trait language. It offers a two-month before/after intervention, where Doc 3 requires L2 eligibility and an ABAB design over at least 12 cycles. It also lets the model "paraphrase", where Doc 3 and Doc 5c require templates and figure tokens (§4.1, §4.5.6, Journey 4).
2. **The multi-currency and data-state vocabulary does not match Docs 4 and 5c.** The FX decomposition method differs from Doc 4 and IAS 21. The Overview shows an FX effect with the wrong sign. Doc 8 uses one base currency where Doc 4 asks for two views. It defines three confidence bands where Doc 4 has four. Its five validation states do not match Doc 5c's state machine. Disputed figures enter valuations, which Doc 5c forbids. Conflict and Ageing share one colour.
3. **The no-questionnaire promise has no real fallback, and it conflicts with Doc 6.** The success metric is "proposals accepted", which rewards automation bias rather than measuring precision. Doc 6 needs a yearly attested residency questionnaire, and its triggers (FX conversions are chargeable assets) fire almost at once. That makes "ask just in time, never in a wizard" unworkable for tax.

## 2. Findings, severity-ranked

### Blocking

**B1 — Insight card contradicts the Doc 3 claims ladder (§4.5.6, Journey 4, §4.2.4, §4.1 Component B).**
*Claim:* the card "38 % of discretionary spending happens in the 4 days after salary" is shown at evidence level ■■□ "Pattern (statistically measurable)", with "Other explanations we cannot rule out", a "not yet a stable trait" caption, and an optional two-month standing-transfer test compared before and after.
*Why it is wrong:* Doc 3 §4.1 defines L1 as a statistic *with* an interval and a false-alarm rate that "passes pre-specified alternative-explanation checks". Doc 3's construct catalogue (§4.2, row 1) specifies days 0–6, a ratio with a bootstrap confidence interval, a circular-shift test, and the alternative explanations *tested and reported*, not merely listed. Doc 8's card has no interval and no number of cycles held. It also has no baseline: under a uniform distribution, 4 of about 30 days would already take about 13 %. Its alternatives are left untested, which is the very condition that disqualifies a result from L1. "Trait" is forbidden vocabulary at L2 in Doc 3. Doc 3 §4.6 makes interventions eligible only at L2 with a pre-registered impact model, alternating by pay cycle over at least 12 cycles. Doc 3 §4.5 Step 8 shows that even 12 months gives power of about 0.41 for a 15 % effect. A two-month before/after comparison will mislead. Doc 8's three-level indicator (Observed / Pattern / Supported explanation) also leaves out L3 and L4. Separately, Component B ("the model may paraphrase") conflicts with Doc 3 cross-cutting rule 4 (templated L0–L3 sentences only) and with Doc 5c §4.3.12 (the renderer substitutes figure tokens; "the model's own digits are not rendered"). The §4.2.4 example answer is free prose with digits.
*Fix:* adopt Doc 3's five rungs and its sentence templates verbatim. Show ratio, interval, cycles held and the uniform baseline on the card. Show the result of each alternative-explanation check. Offer a "test something" section only at L2, using the Doc 3 §4.6 protocol. Change Component B to "the model composes from templates and figure tokens; it never emits digits".

**B2 — The FX decomposition is inconsistent with Doc 4, Doc 6 and the document's own IAS 21 citation, and the Overview has the wrong sign (§4.1 worked example, §4.5.1, §4.5.5).**
*Claim:* "transactional at closing rate +USD 405; revaluation of opening balance +USD 265". The Overview shows "+NGN 2.1M in Oct: +1.3M yours · +0.8M FX".
*Why it is wrong:* F11 cites IAS 21 as translating transactions "at transaction-date rates". Doc 4 §4.2 and Doc 6 F4 both post each flow at its transaction-date rate and revalue monetary balances at period end. Doc 8's example instead translates all flows at the closing rate. On real data that gives a different split from Doc 4's ledger, so the screen and the ledger would disagree. The arithmetic of the example itself is correct; I recomputed it (7,843 → 8,514; 405 + 265). The sign problem is that the example has the naira *strengthening* in October (1,530 → 1,480 NGN/USD). In an NGN base, that *reduces* the naira value of the founder's USD 35,000 of investments and AED 79,500 (about USD 21,600). The FX effect is therefore at least about −NGN 2.8M, not +0.8M. A user who notices this will distrust every decomposition. There are also three decomposition schemes in the package: Doc 8 §4.1 has two terms, §4.5.5 has four (transactions / FX / market / residual), and Doc 4 §4.4.7 has three (net saving / market / FX translation). Doc 8 also leaves out the realised conversion-cost line that Doc 4 §4.5(3) requires on every own-account FX transfer; the §4.5.3 card shows only "fee NGN 2,500?".
*Fix:* take Doc 4's posting-level method as normative and render its three terms plus conversion cost. Recompute the Overview example under a stated base. Add a render-time check that the FX-term sign agrees with the rate move and the net foreign-currency position.

**B3 — Market-data states and confidence vocabularies are not the package's (§4.1 Component A, §4.5.8, Journey 5, §4.8 tokens).**
*Claim:* validation states are Validated / Unvalidated / Stale / Conflict / Estimated, with confidence High ≥ 0.9, Medium 0.7–0.9, Low < 0.7, and Conflict shown "as a range of the conflicting values"; Journey 5 shows "the range of the resulting market capitalisation".
*Why it is wrong:* Doc 5c §4.3.1 and §4.3.2 define `raw`, `auto_validated`, `validated` (human), `disputed`, `stale`, `expired`, `superseded` and `fetch_failed`. They also define an *Ageing (amber)* tier, data confidence grades A–D, a separate `last_traded_on` "no trade since" badge, and licence scope. Doc 5c §4.3.3 says a disputed figure is "excluded from valuation until resolved", so a market-capitalisation range built from a disputed share count is exactly what Doc 5c prohibits. Doc 5c §4.3.10 also lets AI state conclusions only on human-`validated` figures; Doc 8 does not distinguish auto-validated from validated. Doc 4 §4.2 uses four bands (≥ 0.98 / ≥ 0.90 / ≥ 0.70 / low) and sends *anything below 0.90 or model-produced* to review. Doc 8's "bulk accept all High" would therefore auto-accept items Doc 4 requires a person to review. Doc 8's conflict colour (#E69F00 orange) is the amber Doc 5c reserves for Ageing. Journey 1 marks a rate fetched on Saturday 31 Oct as "stale" on Tuesday 3 Nov. Under Doc 5c that is at most two business days old, so Ageing, not Stale. Doc 4's `incomplete` period badge and its "rate missing" badge (§4.5(6)) are absent.
*Fix:* one state machine for the whole package, owned by Doc 5c and Doc 4, with Doc 8 mapping each state to a visual treatment and an accessible name. One confidence scale. Disputed values are shown side by side, never as a range feeding a derived figure.

### Major

**M1 — The low-precision fallback is undefined, and the success metric rewards over-acceptance (§1, §4.3, Journey 1, §9.1, R1).** "Define fallbacks if below 90 percent" is not a fallback. "Ship manual column mapping" fixes *parsing*, not *inference*. The success criterion "≥ 90 % of proposals accepted without edit" measures acceptance, and an over-trusting user raises it. That is the automation bias F3 warns about. Doc 4 sets different gates: salary precision ≥ 0.95 before forecasting (§4.3.1), rules demoted below 0.90 precision (§4.3.6), and a queue sorted by *materiality × uncertainty*, whereas Doc 8 groups the queue by reason. Doc 8 never estimates queue size. Six months at Journey 2's 212 transactions a month is about 1,270 lines. If even 15 % fall below 0.90, the first queue has about 190 items, not 14. *Fix:* measure precision and recall against a founder-labelled sample (Doc 4 §9.6 asks for 200 transfers and 50 reversals). Specify graded fallbacks: gate each fact type on its measured precision; resolve in batches by counterparty; defer low-materiality items behind an "unresolved, excluded from totals" bucket; and set an upper limit on review minutes per batch.

**M2 — The minimum-questions list does not match Doc 6 (§4.3.4; §7 disagreement table).** Doc 6 §4.4 requires a *yearly* residency and circumstances questionnaire with attestation, covering about 20 items. Doc 8 lists six questions, asks each "once … never repeated in a wizard", and defaults citizenship to "Not asked". Doc 6 needs nationality for the UAE 90-day test and for US estate-tax status (F25, F31). Doc 6 R3's test, "Zero tax figures displayed without a current questionnaire", and its auditor-versus-product resolution (an "indicative / unaudited" watermark, audited mode after gates 1–3) have no counterpart in Doc 8. The just-in-time trigger also fails on its own terms. Under NTA s.34(1)(b), non-naira currency is a chargeable asset, and s.12 taxes residents on worldwide income. So the first FX conversion or UAE salary credit already "changes the tax treatment", and in practice the question arrives at onboarding. The §7 table still labels Tax's position "anticipated". *Fix:* replace the row with Doc 6's questionnaire as a dated, re-attested record; adopt the indicative/audited mode; drop "never repeated"; update the disagreement table with Doc 6's actual position.

**M3 — Information-architecture gaps (§4.2).** There is no home for **liabilities** (Doc 4 §4.4.5: debt-service ratio, credit-bureau uploads), **pensions** (Doc 4 `Assets:Pension:RSA`), **FX and conversion costs** (Doc 4 §4.5; Doc 3 "FX hedging vs spending" construct), **budget views** (Doc 4 offers three; Doc 8 shows baseline bars only), **cash-flow forecast and scenarios** (Doc 4 §4.4.6), **risk-tolerance questionnaires** (Doc 4 Grable–Lytton; Doc 3 SOEP, DOSPERT and CFPB), the **market-data validator queue** (Doc 5c §4.3.10 makes the founder the validator of conclusion-driving figures, but Doc 8's review queue handles only ledger reasons), the **data-quality dashboard** (Doc 5c §4.3.8) and the **US estate-tax monitor** (Doc 6). The words "pension" and "liabilit" do not occur in Doc 8, yet the net-worth view (§4.5.5) is a net-worth view without liabilities. Cross-linking has a further problem: the path to tax runs *through category* and renders "Tax: not relevant" before residency is known. That is a tax conclusion, and tax relevance attaches to *kind* (FX conversion, dividend, disposal), not category. The transfer card (§4.5.3), the most tax-relevant object for this user, carries no tax chip. *Fix:* add Liabilities and Pensions under Overview › Net worth; add an FX & costs detail view; put tax chips on kind, with "Not yet determined" until the Doc 6 questionnaire is current.

**M4 — Wireframe coverage and accessibility paths (§4.5, §4.8).** Only four of the 13 specifications are drawn (§4.5.1, §4.5.3, §4.5.6, §4.5.9), and none at phone width. The review queue, ledger, net worth, research note, tax workspace, settings and the assistant drawer with its Working panel are not drawn. States are listed once for all screens rather than per screen. Specific defects:
(a) Contrast: computed against white, the specified tokens give vermilion #D55E00 3.87:1 (fails the 4.5:1 text minimum, and Doc 8 uses it for negative numerals), reddish purple #CC79A7 3.06:1, and orange #E69F00 2.25:1, which fails even the 3:1 non-text minimum Doc 8 itself sets. Grey "stale" numerals are content, not inactive controls, so WCAG 1.4.3 applies to them too.
(b) The single-key shortcuts `j/k/a/c/t/u` and `/` need a way to turn them off or remap them (WCAG 2.1.4, Level A).
(c) Session timeout needs a warning and an extension (2.2.1).
(d) "Estimated = italic" is not exposed to screen readers. Inheriting the "stale" chip on every derived cell, with five strip fields per number, makes dense tables unlistenable. An accessible-name pattern is needed, for example the value plus one status word with the strip on demand.
(e) "True minus sign" with optional parentheses: ICU emits a hyphen-minus (I reproduced `-₦1,234,567.89`), and parentheses are not announced as negative, so the token must carry the sign in its accessible name.
(f) The dotplot needs a text alternative that states the frequency and range.
(g) A floating assistant button on mobile risks 2.4.11 (focus not obscured).
(h) Consistent help (3.2.6, Level A) is not mentioned.
(i) A nine-column ledger at 360 px has no specified card form beyond "tables reflowing to card lists at 200 %".
*Fix:* draw mobile wireframes for the ledger, review queue and goal view; run the palette through a contrast check (use darker variants for text); add an accessible-name specification per component.

**M5 — Uncertainty display: a single probability slipped back in, and model uncertainty is missing (§4.5.1, Journey 3, §4.6).**
(a) The Overview line "Goals: USD 100k by Nov 2031 — 60 of 100 futures" carries no range or adjustment, which violates the document's own U10 ("never alone").
(b) U9 brings back a numeric confidence on hover.
(c) The 20-dot plot cannot represent "57", "63" or "84 of 100", because each dot is 5 futures. The text and the graphic disagree.
(d) Journey 3 says the purchase is "from AED cash, not from contributions" yet moves the goal from 60 to 57 of 100. Either the AED cash is part of the goal assets or the count should not change.
(e) The dotplot shows only sampling (aleatory) spread under placeholder parameters. Comparing "63 vs 60 of 100" between structures implies precision that parameter uncertainty swamps. Spiegelhalter's reviews [S23, S24], which Doc 8 cites, separate the two kinds of uncertainty.
(f) "A 12 % average return sits above 80 of 100 historical five-year windows" uses the same "N of 100" frame for history as for simulated futures, which invites a probability reading.
I re-ran Journey 6 (20,000 paths, lognormal monthly) and got 58, 62, 0, 82 and 95 of 100 against the stated 60, 63, 0, 84 and 95, with a required return of 5.3 % against 5.2 %. That is reproducible in substance, but 58 versus 60 is sampling and model-specification noise, which is exactly the point of (e).
*Fix:* round counts to the plot's resolution or use 50 or 100 dots. Show parameter uncertainty (an assumption-range toggle, or a band of counts across Doc 5 parameter sets). Remove the bare Overview count or add the range. Separate historical base rates visually and verbally.

**M6 — Copy that reads as advice, verdict or reassurance (§4.5.9, Journey 3, §4.5.6, §4.2.1).**
- "Biggest lever: contributions (USD 1,000/mo → 84 of 100) ▸ Try it" and "If you land low: add ~USD 150–300/month … or wait 8–14 months" are directive.
- "A small change" (Journey 3) is a verdict.
- "Spending follows availability of money, which is ordinary" is a normative reassurance.
- "Can I afford…?" names an affordability verdict that the journey says the system never gives.
- The banned list lacks "afford", "need to", "recommend", "best", "safe", "should consider", "beat", "risk-free", and Doc 3's L1 bans on "because" and "you tend to".
- §4.2.4 labels arithmetic contributors "Drivers", which reads causally.
*Fix:* phrase levers as "Changing X to Y changes the count to Z"; expand the lint list from Doc 3 §4.4 and §4.7; rename the feature "What happens if I spend…?".

**M7 — Performance and offline budgets assume an architecture no other document specifies (§4.8, §4.5 common states).** Doc 8 promises "offline-first with local database, background sync", with "all read actions available; writes queued". Doc 7 specifies a Python/FastAPI modular monolith on PostgreSQL with a Procrastinate worker, running on founder hardware (ADR-1 to ADR-4). It lists "a mobile app" under *do not attempt yet* and leaves local-first versus hosted unresolved (§7 item 1). No document defines a client replica, a sync protocol or conflict resolution for queued ledger writes; Doc 4's statements are "immutable once reconciled". Offline display of last-synced values is carry-forward, which Doc 5c §4.3.11 allows only as a labelled derived figure with its age. The budget of "≤ 300 KiB JS, ≤ 1.0 MiB total" uses Russell's *JS-light* column [S119]. I re-fetched it: JS-light is 2.0 MiB total / 0.3 MiB JS; JS-heavy is 1.2 MiB / 0.62 MiB. A charting, table-heavy, local-database single-page application is the JS-heavy case, so the cited source does not support the budget as stated. The data-cost estimate defaults to the NCC *floor* price (₦431.25/GB), which understates the about ₦575/GB average Doc 8 itself reports [S101]. Consent copy says "parsing runs on this device", but under Doc 7 it runs on the Compose host. *Fix:* make the offline claim conditional on a Doc 7 decision; specify offline as read-only with age badges until a sync design exists; re-base the budget on the JS-heavy column or justify JS-light with a bundle analysis; default the tariff to the measured average.

**M8 — The validation plan's measurability and consent (§4.9, F13).**
(a) Phase 1 uses "real files of the founder's choosing". Brief §5.7 requires synthetic data until data architecture and privacy controls are approved, which they are not.
(b) The founder is commissioner, designer-of-record and sole subject. Think-aloud sessions need an independent facilitator, and demand characteristics will inflate SEQ and SUS. SUS ≥ 80 at n = 1, administered monthly, has no reference distribution, and repeated administration adds practice effects.
(c) The seeded-error test runs "in a clearly labelled sandbox", so the subject knows errors are present. Detection rates will be optimistic.
(d) The n-of-1 alternation of dotplot versus dotplot-plus-HOPs in two-week blocks violates the n-of-1 assumption of a reversible condition [S132]. Comprehension learned in block A carries into block B.
(e) Phase 2 says "5–8 external users" and also "five users per segment" across three segments, which is 15 or more.
(f) The comprehension rubric, the "≥ 80 % comprehension" target and the Likert ≥ 4/5 "non-judgemental" item are not defined or validated.
(g) Analytics are commendably minimal, with no amounts, counterparties or descriptors. But Doc 3's "Ostrich / engagement" construct needs app opens against portfolio returns, and no `app_opened` event exists. The two documents must agree whether that construct is in scope.
(h) A daily diary prompt for eight weeks sits awkwardly with "no daily alerts". It is acceptable as consented research, but say so.
*Fix:* use synthetic or founder-redacted packs until Doc 7's privacy controls pass review; use a facilitator who is not the founder; use crossover with washout or between-subject designs for comprehension; reconcile the Phase 2 counts; pre-register the rubric; settle the telemetry scope with Doc 3.

### Minor

- m1 §4.7 says "Price as of **Fri** 31 Oct". 31 October 2026 is a Saturday. The §4.1 rate "CBN/NAFEM closing, as of 31 Oct" is also a Saturday, and NFEM does not fix at weekends. "NAFEM" is the pre-2024 name; Doc 4 and Doc 5c use NFEM. In Journey 1 the "WIRE IN" credit is dated 3 Oct, also a Saturday.
- m2 Journey 5 gives an "NGX closing price as of … 16:30 WAT". Doc 5c §9.3 lists NGX trading hours as still to be fetched, so this time is unsupported. Use the time from the source record.
- m3 F12 restricts "₦" to where glyph support is verified. U+20A6 has been in Unicode since 1.1 and is in all mainstream fonts; only the dirham sign (U+20C3, which I confirmed in Unicode 18.0 UnicodeData.txt) has a support problem. Docs 3 and 4 use ₦ throughout, so pick one convention for the package.
- m4 The evidence strip shows `NGN 12,600,000.00` although Doc 8's GOV.UK rule says "no spurious decimals". Compact "164.2M" conflicts with the "million in words" rule. State the exceptions.
- m5 Doc 8 picks the base currency by "majority of income currency". Doc 4 §4.4.7 recommends two default views (USD and NGN) plus a parallel-rate sensitivity line, and Doc 6 makes NGN the tax-reporting currency. Doc 8 needs to adopt or contest Doc 4's position explicitly.
- m6 Doc 8's "Undo for 30 days on all ledger edits" conflicts with Doc 4's immutable reconciled statements and Doc 6's audit trail. Specify undo as a reversing entry, not deletion.
- m7 The error copy "type the 6 missing lines … The other 13 pages were used" conflicts with Doc 4 §4.3.7: a statement that does not reconcile is rejected, and the period is marked *incomplete*.
- m8 Journey 2's "NGN 551,667 ± 75,093" cannot be reproduced from the stated figures: 1.85M − 1.275M = 575,000, and spreading the fees gives about 560,000. Doc 8 says code was "retained in the session scratchpad", but none is in `research/scripts/`. Commit it.
- m9 F10 open-banking status rests on October 2025 reporting. Doc 4 F1 has a 2026-11-02 check (phased rollout promised for mid-2026, no confirmed go-live), and the UAE Open Finance status is not mentioned. Update.
- m10 The emergency-reserve denominator is "baseline spending" in Doc 8 and "essential spend" in Doc 4 §4.4.2.

## 3. Evidence-grade audit

| Doc 8 claim | Stated grade | Assessment | Proposed grade |
|---|---|---|---|
| F3 trust framework "E1 … replicated literature review" [S8, S9] | E1 | Lee & See is a conceptual review. Hoff & Bashir is a systematic review, not a meta-analysis. The design implications rest on single crowd-sourced HCI experiments [S10–S13] | E2 (framework E3) |
| F4 "uncertainty as counted futures" | E1–E2 | The dotplot evidence comes from one research group in transit and weather tasks [S25, S26]. No test in long-horizon financial goals. HOP evidence is for ordering and trend judgements, not goal decisions | E2 for the domain tested; E4 for the transfer to finance |
| F4 / U4 "probability of adjustment" framing [S40] | inside E1–E2 | Re-fetched: Tharp (Kitces, 2021) is practitioner opinion. The only survey cited is the author's unpublished survey of *advisors*; there are no client-comprehension data | E4; U4 should be a hypothesis to test in Phase 1, not a binding rule |
| F8 FCA experiment: "share of risky trades by 8 and 6 percent, with larger effects for low-literacy, female and 18–34 participants" | E2 | Numbers match the note's summary. In the body, push notifications raised risky-trade share by 3.5 pp, which the note itself calls **10 %**, not 8 %. "None of the features led to a statistically riskier investment portfolio at the end of trading". The subgroups attach to *different* outcomes: low literacy with flashing prices and leaderboard, which had no main effect; women with push notifications and points; age 18–34 with end-portfolio riskiness. This was an online simulation with an endowment of about £0.50 | E2, but restate precisely and add the null portfolio result |
| F4 "verbal hedges damage trust" [S22] | E1–E2 | Abstract re-read: "only a small decrease in trust … and mostly for verbal". "Damage" overstates it | E2 as worded in the abstract |
| F1 "never three disclosure levels" as a *binding* commitment | E3 | NN/g article (2006) cites unnamed research. Fine as a heuristic, too weak to be "never traded away" | E3; make it a default |
| F7 Gargano & Rossi "the effect persisted" | E2 | The abstract reports a difference-in-differences increase and no crowd-out. "Persisted" is not in the abstract | Check full text |
| §1 / R1 "~90 % precision" threshold | not graded | Engineering assumption | E5, with Doc 4's per-fact thresholds |
| §4.1 confidence bands High ≥ 0.9 … | E5 (stated) | Correctly graded, but conflicts with Doc 4 | — |
| "Every number in §4 is reproducible" (§2) | asserted | Journey 6 reproduces in substance (my re-run). Journey 2's surplus does not, and no code is committed | Unsupported until scripts are committed |

Presented as fact without a source: the NGX 16:30 close (m2); "Fri 31 Oct" (m1); "≥ 44 px … commonly cited" (acknowledged as unsourced); "broadband penetration crossed 50 %" (flagged by Doc 8 itself as not fetched).

## 4. Citation and source spot-check

Academic references, re-verified on 2026-11-04 by Crossref DOI lookup (title, authors, year) and OpenAlex for abstracts:

| Doc 8 # | Reference | Result |
|---|---|---|
| S8 | Lee & See 2004, *Human Factors* | Verified |
| S10 | Zhang, Liao & Bellamy 2020, FAT* | Verified. Abstract supports "calibrates trust … not sufficient to improve" accuracy |
| S11 | Bansal et al. 2021, CHI | Verified |
| S12 | Buçinca, Malaya & Gajos 2021, PACM HCI | Verified |
| S22 | van der Bles et al. 2020, PNAS (n = 5,780) | Verified. Claim slightly overstated (§3) |
| S25 | Kay et al. 2016, CHI | Verified |
| S26 | Fernandes et al. 2018, CHI | Verified |
| S27 | Hullman, Resnick & Adar 2015, PLOS ONE | Verified |
| S33 | Ruginski et al. 2016, *Spatial Cognition & Computation* | Verified |
| S34 | Padilla et al. 2017, *Cognitive Research* | Verified |
| S38 | Hullman et al. 2018, IEEE TVCG 24(1) | Verified |
| S59 | Thaler, Tversky, Kahneman & Schwartz 1997, QJE | Verified |
| S64 | Raghubir & Srivastava 2002, JCR 29(3) | Verified |
| S66 | Carlin, Olafsson & Pagel, *Review of Finance* 27(3) | Verified (online 2022) |
| S69 | Gargano & Rossi 2024, JF 79(3) | Verified. "Persisted" not in abstract |
| S71 | Medina, RFS 34(5) | Verified (online 2020, issue 2021) |
| S72 | D'Acunto, Rossi & Weber 2024, JFE 157 | Verified (no abstract in OpenAlex) |
| S73 | Beshears et al. 2015, JF 70(3) | Verified |
| S91 | Gladstone et al. 2021, OBHDP 167 | Verified |
| S4 | Shneiderman 1996, IEEE VL | Verified (Crossref issued-date null) |
| S124 | Hart & Staveland 1988 | Title verified; author field empty in Crossref (as Doc 8 notes) |

Non-academic URLs, re-fetched on 2026-11-04:

| Doc 8 # | URL | Result |
|---|---|---|
| S3 | nngroup.com/articles/progressive-disclosure/ | Fetched. "Beyond 2 disclosure levels typically have low usability" and "improves … learnability, efficiency of use, and error rate" confirmed. Dated 3 Dec 2006; underlying research unnamed |
| S88 | fca.org.uk research note + full PDF | Fetched. 9,000+ participants and 11 % / 12 % trades confirmed; risky-share effect 8 % (summary) vs 10 % (body); null end-portfolio result omitted by Doc 8 |
| S98 | gs.statcounter.com … /nigeria | Fetched. October 2026: Android 86.58 %, iOS 13.31 %. Confirmed (86.6 %) |
| S99 | gs.statcounter.com … /united-arab-emirates | Fetched. October 2026: Android 80.69 %, iOS 19.29 %. Confirmed |
| S100 | businessday.ng (Jaiyeola, 9 Jul 2025) | Fetched. 50 % increase approved January 2025; 1 GB ₦287.50 → ₦431.25; 9.86 GB/month in May 2025. Confirmed |
| S40 | kitces.com (Tharp, 6 Jan 2021) | Fetched. Framing claims confirmed as opinion; no client data |
| S106 | en.wikipedia.org/wiki/Emirati_dirham_sign | Fetched. CBUAE, 27 Mar 2025; U+20C3 in Unicode 18.0 (Sept 2026). **Independently confirmed** in unicode.org/Public/18.0.0/ucd/UnicodeData.txt (`20C3;UAE DIRHAM SIGN`) |
| S111 | w3.org/WAI/…/new-in-22/ | Fetched. Nine new criteria and 5 Oct 2023 confirmed; 2.4.12, 2.4.13 and 3.3.9 are AAA |
| S118 | web.dev/articles/vitals | Fetched. LCP 2.5 s / INP 200 ms / CLS 0.1 at p75 confirmed |
| S119 | infrequently.org (Russell, 2025) | Fetched. Galaxy A24 4G, 9/3 Mbps, 100 ms confirmed; budget column choice questioned (M7) |
| S107 | Local ICU check | Reproduced: Node 22, ICU 78.3, Unicode 17.0 gives `₦1,234,567.89`, `AED 1,234,567.89`, and ar-AE with RLM/LRM marks and Latin digits |

## 5. Cross-document contradictions

| Topic | Doc 8 | Other document | Ref |
|---|---|---|---|
| AI text generation | "The model may paraphrase" | Doc 3 §4.2 rule 4: templates only. Doc 5c §4.3.12: figure tokens; the model's digits are not rendered | B1 |
| Payday window and statistic | 4 days, share, no interval | Doc 3: days 0–6, ratio with 95 % interval, cycles held, permutation test | B1 |
| Intervention eligibility and design | L1 card, two-month before/after | Doc 3 §4.6: L2 only, ABAB, ≥ 12 cycles | B1 |
| Evidence rungs | Three levels | Doc 3: L0–L4 | B1 |
| FX translation of flows | Closing rate | Doc 4 §4.2 and Doc 6 F4: transaction-date rate plus period-end revaluation | B2 |
| Decomposition terms | Two or four | Doc 4 §4.4.7: three, plus conversion-cost expense line | B2 |
| Base currency | One, by majority of income | Doc 4: USD and NGN views by default. Doc 6: NGN for tax | m5 |
| Confidence bands | Three (0.9 / 0.7) | Doc 4: four (0.98 / 0.90 / 0.70); < 0.90 or model-produced goes to review | B3 |
| Data states | Five states | Doc 5c: eight states plus Ageing tier, A–D grades, no-trade badge, licence scope | B3 |
| Disputed figures | Shown as range; market-cap range computed | Doc 5c §4.3.3: excluded from valuation | B3 |
| Amber | Conflict | Doc 5c: Ageing | B3 |
| Tax questions | Six, just in time, never repeated | Doc 6 §4.4: yearly attested questionnaire, about 20 items, no tax figures without it | M2 |
| Citizenship | Not asked | Doc 6 F25/F31 and Doc 4 §4.4.8 step 1: asked | M2 |
| Risk tolerance | Not asked | Doc 4: Grable–Lytton. Doc 3: SOEP, DOSPERT, CFPB | M3 |
| Liabilities and pensions | Absent | Doc 4 chart of accounts and §4.4.5 | M3 |
| Offline and mobile | Offline-first PWA, queued writes | Doc 7: server monolith; mobile app "do not attempt yet"; local-first unresolved | M7 |
| Partial statements | "Other 13 pages were used" | Doc 4 §4.3.7: unreconciled statement rejected; period incomplete | m7 |
| Open-banking status | Oct 2025 evidence | Doc 4 F1: checked 2026-11-02 | m9 |
| Synthetic FX levels | USD/NGN about 1,480–1,530 | Doc 4/5c observed about 1,346 on 2026-11-02. Synthetic, but a reader comparing documents will be confused; label more loudly or align | — |

Doc 8 §2 says sibling documents "did not exist … at the time of writing". The file was nevertheless edited on 2026-11-04, after Docs 3–7 were committed, and §6 still states dependencies as wishes rather than referencing the now-published interfaces.

## 6. Questions the Investment Committee needs answered

1. What precision and recall do proposals actually reach on the founder's real statement formats, and how many minutes of review does the first batch need? (The whole "no questionnaire" claim rests on this.)
2. Which document owns the single figure-state machine and the single confidence scale, and when will Doc 8 adopt it?
3. Is the personal MVP desktop-web against a home server (Doc 7) or an offline-first PWA (Doc 8)? The performance, offline and consent copy differ completely between the two.
4. Will the tax area ship in "indicative / unaudited" mode (Doc 6) before the yearly questionnaire is complete, and what exactly may be shown?
5. How will goal views show parameter uncertainty, not only sampling spread, given Doc 5's parameters are placeholders?
6. Who facilitates and scores the n = 1 studies, given that the founder is both sponsor and subject?
7. What is the accessible-name pattern for a number carrying an evidence strip, so that a screen-reader user can read a dense ledger?

## 7. Required changes before Investment Committee (priority order)

1. Adopt Doc 3's claims ladder, sentence templates and intervention protocol on the insight card. Remove "trait" and the two-month before/after test. Make Component B template- and token-only (B1).
2. Replace the FX worked example with Doc 4's method, correct the sign of the Overview FX effect, and add the conversion-cost line (B2).
3. Map Doc 8's visual states one-to-one onto Doc 5c's state machine and Doc 4's confidence bands. Stop computing ranges from disputed inputs. Reassign the amber colour (B3).
4. Specify graded low-precision fallbacks. Replace "≥ 90 % accepted" with measured precision and recall plus review-minutes per batch. Sort the queue by materiality × uncertainty (M1).
5. Replace §4.3.4's tax rows with Doc 6's yearly questionnaire and indicative/audited modes. Put tax chips on transaction kind (M2, M3).
6. Add Liabilities, Pensions, FX and costs, budget views, forecast scenarios, the risk questionnaire and the market-data validator queue to the IA (M3).
7. Remove the bare Overview goal count. Align the count to dotplot resolution. Add a parameter-uncertainty display. Fix Journey 3 (M5).
8. Fix contrast failures, character-key shortcuts, timeout, accessible names and the minus sign. Draw phone-width wireframes for the ledger, queue and goal view (M4).
9. Rewrite directive copy and expand the banned list (M6).
10. Make offline and performance claims conditional on a Doc 7 decision. Re-base the JS budget (M7).
11. Fix the validation-plan design issues: synthetic data, independent facilitator, carry-over, Phase 2 counts, telemetry scope with Doc 3 (M8).
12. Correct the minor date, name and reproducibility items and commit the worked-example scripts (m1–m10).

## 8. What this reviewer could not check

- The FCA effect sizes were checked against the PDF text extracted by `pdftotext`. I did not read the regression tables in full.
- No full texts of the academic papers were read. Claim checks rest on abstracts, metadata and Doc 8's wording.
- NGX trading hours, and whether NFEM publishes on non-business days, were not fetched.
- The NDPA "consent cannot be a condition of service" summary, the UAE PDPL executive-regulation status, TechCabal's ₦575/GB figure (HTTP 403 for Doc 8 as well), the EFInA 64 % and the KPMG/Orange study were not re-checked.
- Doc 5a/5b (simulation outputs) and Doc 9 were not read for this review, beyond Doc 5c.
- Contrast was computed against pure white and #121212. The actual surface colours are unspecified.
- No usability or assistive-technology testing was possible. My Monte Carlo re-run used my own lognormal monthly model, not Doc 8's (uncommitted) code.
