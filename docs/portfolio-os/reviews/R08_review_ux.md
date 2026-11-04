Review of: Document 8 — User Experience and Product Design Blueprint (v0.1, file dated 2026-11-04 09:14)  ·  Reviewer roles: senior product designer; accessibility specialist (WCAG 2.2 AA, numeracy, low-end Android); HCI researcher (uncertainty visualisation, trust calibration); behavioural scientist (claims ladder, no labels); product-analytics lead  ·  Date: 2026-11-04  ·  Verdict: **Major revision**

## 1. Verdict and the three most important problems

The core commitments are sound and well cited: evidence strip, Working panel, two disclosure levels, counted futures, no labels or gamification. The academic references I sampled are real. But Doc 8 was revised on 2026-11-04 without being reconciled with Docs 3, 4, 5c, 6 and 7, and several specifications contradict them.

1. **The insight card breaks Doc 3's claims ladder.** It shows an un-intervalled statistic, untested alternative explanations and trait language, and offers a two-month before/after self-experiment. The model is also allowed to "paraphrase" numbers (B1).
2. **Multi-currency and data-state rules diverge from Docs 4 and 5c.** The FX method differs, the Overview FX effect has the wrong sign, confidence bands and validation states differ, and disputed figures feed valuations (B2, B3).
3. **The "no questionnaire" promise has no real fallback.** Success is measured by proposals accepted (which rewards over-trust), and the question design conflicts with Doc 6's yearly attested residency questionnaire (M1, M2).

## 2. Findings, severity-ranked

### Blocking

**B1 — §4.5.6, Journey 4, §4.1 Component B, §4.2.4: the insight card violates the Doc 3 ladder.**
*Claim:* the card "38 % of discretionary spending happens in the 4 days after salary" is shown at ■■□ "Pattern". It lists "other explanations we cannot rule out", says "not yet a stable trait", and offers a two-month standing-transfer test evaluated before/after.
*Why wrong:* Doc 3 §4.1 defines L1 as a statistic *with* an interval and false-alarm rate that "passes pre-specified alternative-explanation checks". Doc 3 §4.2 specifies days 0–6, a ratio with a bootstrap confidence interval, a circular-shift test, and alternatives *tested and reported*. The card has no interval, no cycle count and no baseline. A uniform pattern alone puts about 13 % of spending in any 4 of 30 days. Its alternatives are untested, which disqualifies L1.
- "Trait" is forbidden wording.
- Doc 3 §4.6 restricts interventions to L2 with a pre-registered ABAB design over at least 12 cycles. Doc 3 §4.5 Step 8 gives power of about 0.41 at 12 months for a 15 % effect, so a two-month before/after test will mislead.
- The three-level indicator omits L3 and L4.
- Component B ("the model may paraphrase") contradicts Doc 3 rule 4 (templates only) and Doc 5c §4.3.12 (figure tokens; "the model's own digits are not rendered"). The §4.2.4 example is free prose with digits.
*Fix:* adopt Doc 3's rungs, templates and §4.6 protocol verbatim. Show ratio, interval, cycles held, uniform baseline and the result of each check. Make Component B template- and token-only.

**B2 — §4.1 worked example, §4.5.1, §4.5.5: the FX decomposition contradicts Doc 4/Doc 6/IAS 21, and the Overview sign is wrong.**
*Claim:* "transactional at closing rate +USD 405; revaluation of opening +USD 265"; Overview "+NGN 2.1M in Oct: +1.3M yours · +0.8M FX".
*Why wrong:*
- F11 cites IAS 21's transaction-date rates. Doc 4 §4.2 and Doc 6 F4 post flows at the transaction-date rate and then revalue at period end. Doc 8 translates all flows at the closing rate, so on real data its screen will not match the ledger. (The example's arithmetic does reproduce: 7,843 → 8,514, split 405 + 265.)
- The example has the naira *strengthening* (1,530 → 1,480). In an NGN base that *reduces* the naira value of USD 35,000 of investments and AED 79,500 (about USD 21,600). The FX effect is at least about −NGN 2.8M, not +0.8M.
- The package has three decomposition schemes: Doc 8 §4.1 has two terms, §4.5.5 has four, and Doc 4 §4.4.7 has three.
- The conversion-cost expense line that Doc 4 §4.5(3) requires is absent from the transfer card (§4.5.3).
*Fix:* adopt Doc 4's posting-level method and its three terms plus conversion cost. Recompute the Overview. Add a render-time sign check against the rate move and the net foreign-currency position.

**B3 — §4.1 Component A, §4.5.8, Journey 5, §4.8: state and confidence vocabularies are not the package's.**
*Claim:* states Validated/Unvalidated/Stale/Conflict/Estimated; confidence High ≥ 0.9 / Medium / Low < 0.7; conflict shown "as a range"; Journey 5 computes "the range of the resulting market capitalisation".
*Why wrong:*
- Doc 5c §4.3.1–4.3.2 has `raw`, `auto_validated`, `validated` (human), `disputed`, `stale`, `expired`, `superseded`, `fetch_failed`, an Ageing (amber) tier, A–D source grades, a "no trade since" badge and licence scope.
- Doc 5c §4.3.3 excludes disputed figures "from valuation until resolved", so the market-cap range is prohibited.
- Doc 5c §4.3.10 lets AI conclude only on human-validated figures.
- Doc 4 §4.2 has four bands (0.98 / 0.90 / 0.70) and sends anything below 0.90 *or model-produced* to review. Doc 8's "accept all High" would bulk-accept items Doc 4 requires a person to review.
- The conflict orange #E69F00 is Doc 5c's Ageing amber.
- Journey 1 calls a rate fetched on Saturday 31 Oct "stale" on Tuesday 3 Nov. That is two business days, so Ageing under Doc 5c.
- Doc 4's `incomplete` and "rate missing" badges are missing.
*Fix:* one package-wide state machine (Doc 5c and Doc 4 own it; Doc 8 maps each state to a visual and an accessible name) and one confidence scale. Disputed values shown side by side, never as a range feeding derived figures.

### Major

**M1 — §1, §4.3, Journey 1, §9.1: the low-precision fallback is undefined.** "Define fallbacks if below 90 %" is not a fallback. Manual column mapping fixes parsing, not inference. "≥ 90 % accepted without edit" measures acceptance, which an over-trusting user inflates (the F3 risk). Doc 4 sets different gates: salary precision ≥ 0.95 (§4.3.1), rules demoted below 0.90 (§4.3.6), and a queue sorted by materiality × uncertainty, whereas Doc 8 groups by reason. Queue size is never estimated. Six months at 212 lines a month is about 1,270 lines; at 15 % below 0.90, the first queue is about 190 items, not 14. *Fix:* measure precision and recall on a founder-labelled sample (Doc 4 §9.6). Gate each fact type on its measured precision. Resolve in batches by counterparty. Defer low-materiality items to an "unresolved, excluded from totals" bucket. Set a review-minutes budget per batch.

**M2 — §4.3.4, §7: the questions do not match Doc 6.** Doc 6 §4.4 requires a yearly attested residency and circumstances questionnaire of about 20 items, and R3 allows "zero tax figures displayed without a current questionnaire". Doc 6's disagreement 9 resolves into indicative/unaudited versus audited modes. Doc 8 has six questions, "never repeated in a wizard", and citizenship "not asked". Doc 6 needs nationality for the UAE 90-day test and for US estate-tax status. The just-in-time trigger also fails: under NTA s.34(1)(b) foreign currency is a chargeable asset and s.12 taxes worldwide income, so the first FX conversion or UAE salary credit triggers the question at once. The §7 table still calls Tax's position "anticipated". *Fix:* adopt Doc 6's questionnaire as a dated, re-attested record and its two modes; update the disagreement table.

**M3 — §4.2: information-architecture gaps.** There is no home for:
- liabilities (Doc 4 §4.4.5) or pensions (Doc 4 RSA accounts); "pension" and "liabilit" never occur in Doc 8, so the net-worth view has no liabilities;
- FX and conversion costs (Doc 4 §4.5; Doc 3 FX construct);
- Doc 4's three budget views or its forecast scenarios (§4.4.6);
- risk-tolerance questionnaires (Doc 4 Grable–Lytton; Doc 3 SOEP, DOSPERT, CFPB);
- the market-data validator queue (Doc 5c §4.3.10) or the data-quality dashboard (§4.3.8);
- the US estate-tax monitor (Doc 6).
Cross-links reach tax *via category* and render "Tax: not relevant" before residency is known, which is a tax conclusion. Tax relevance attaches to transaction kind (conversion, dividend, disposal), and the most tax-relevant object, the transfer card, has no tax chip. *Fix:* add Liabilities and Pensions under Net worth, and an FX & costs view. Put tax chips on kind, shown "Not yet determined" until the questionnaire is current.

**M4 — §4.5, §4.8: wireframe and accessibility gaps.** Only four of 13 specifications are drawn (§4.5.1, .3, .6, .9), none at phone width. States are generic rather than per screen. The ledger, queue, net worth, research, tax, settings and the drawer with its Working panel are undrawn. Specific defects:
- (a) Contrast against white: vermilion #D55E00 is 3.87:1 and fails 4.5:1 for negative numerals; #CC79A7 is 3.06:1; orange #E69F00 is 2.25:1 and fails even Doc 8's own 3:1. Grey stale numerals are content, so 1.4.3 applies.
- (b) Single-key shortcuts `j/k/a/c/t/u` and `/` need a way to turn them off or remap them (2.1.4, Level A).
- (c) Session timeout needs a warning and extension (2.2.1).
- (d) Italic "estimated" is not announced by screen readers, and a five-field strip on every cell makes dense tables unlistenable. An accessible-name pattern is needed.
- (e) ICU emits a hyphen-minus (reproduced: `-₦1,234,567.89`), and parentheses are not announced as negative.
- (f) The dotplot needs a text alternative.
- (g) The floating assistant button risks 2.4.11 (focus not obscured).
- (h) Consistent Help (3.2.6, Level A) is not addressed.
- (i) A nine-column ledger at 360 px has no card specification.
*Fix:* phone-width wireframes for the ledger, queue and goal view; darker text variants; an accessible-name specification per component.

**M5 — §4.5.1, Journey 3, §4.6: a single probability slipped back in, and parameter uncertainty is missing.**
- The Overview line "USD 100k by Nov 2031 — 60 of 100 futures" has no range or adjustment, which violates U10.
- U9 restores a numeric confidence on hover.
- A 20-dot plot (5 futures per dot) cannot show 57, 63 or 84 of 100.
- Journey 3 says the purchase is "from AED cash, not from contributions" yet moves 60 to 57.
- Dotplots show only sampling spread under placeholder parameters, so "63 vs 60" implies false precision. The cited Spiegelhalter reviews [S23, S24] separate the two kinds of uncertainty.
- "12 % sits above 80 of 100 historical five-year windows" reuses the futures frame for history.
My re-run of Journey 6 (20,000 lognormal monthly paths) gave 58/62/0/82/95 against the stated 60/63/0/84/95, and a required return of 5.3 % against 5.2 %. That is reproducible in substance, but the 2-point gaps are model noise, which supports the false-precision point. *Fix:* match counts to dot resolution (or use 50 or 100 dots); show a parameter-range band; remove the bare Overview count; separate historical base rates.

**M6 — §4.5.9, Journey 3, §4.5.6, §4.7: copy reads as advice, verdict or reassurance.**
- Directive: "Biggest lever: contributions … ▸ Try it" and "If you land low: add ~USD 150–300/month … or wait 8–14 months".
- Verdict: "a small change".
- Normative reassurance: "spending follows availability of money, which is ordinary".
- Implied verdict: the feature name "Can I afford…?".
- The banned list lacks "afford", "need to", "recommend", "best", "safe", "should consider", "beat", "risk-free", and Doc 3's L1 bans ("because", "you tend to").
- "Drivers" (§4.2.4) reads as causal.
*Fix:* "Changing X to Y changes the count to Z"; extend the lint list from Doc 3 §4.4 and §4.7; rename the feature "What happens if I spend…?".

**M7 — §4.8: performance and offline claims assume an unspecified architecture.** "Offline-first … local database, background sync; writes queued" has no counterpart in Doc 7. Doc 7 specifies a FastAPI/PostgreSQL monolith on founder hardware, lists "a mobile app" as "do not attempt yet", and leaves local-first unresolved. No sync or conflict model exists, and Doc 4 statements are immutable once reconciled. Showing last-synced values offline is carry-forward, which Doc 5c §4.3.11 permits only as labelled, aged derived figures. The "≤ 300 KiB JS / ≤ 1.0 MiB" budget uses Russell's *JS-light* column (re-fetched: 2.0 MiB / 0.3 MiB). A chart-heavy, table-heavy single-page app is the JS-heavy case (1.2 / 0.62 MiB). The tariff default is the NCC floor of ₦431.25/GB, below the about ₦575 average Doc 8 itself cites. The copy "Parsing runs on this device" is wrong under Doc 7. *Fix:* condition offline on a Doc 7 decision, and specify read-only offline with age badges until then; re-base the budget or justify it with a bundle analysis; default the tariff to the average.

**M8 — §4.9: measurability and consent of the validation plan.**
- (a) Phase 1 uses "real files", which breaches Brief §5.7's synthetic-data rule while privacy controls are unapproved.
- (b) The founder is sponsor, designer-of-record and sole subject. Demand effects will inflate SEQ and SUS, an independent facilitator is needed, and monthly SUS ≥ 80 at n = 1 has no norm and adds practice effects.
- (c) The seeded-error sandbox is "clearly labelled", so detection will be optimistic.
- (d) Alternating dotplot and HOPs in two-week n-of-1 blocks breaks the reversibility assumption [S132], because comprehension carries over.
- (e) "5–8 users" conflicts with "five per segment" across three segments.
- (f) The rubric and the ≥ 80 % comprehension and Likert targets are undefined.
- (g) Doc 3's ostrich construct needs app opens, and no `app_opened` event exists.
- (h) The daily diary prompt conflicts with "no daily alerts" unless it is labelled as research.
*Fix:* synthetic or redacted packs; an independent facilitator; crossover with washout or between-subject designs; reconciled counts; a pre-registered rubric; telemetry scope agreed with Doc 3.

### Minor

- m1 §4.7 has "Fri 31 Oct", but 31 Oct 2026 is a Saturday. The §4.1 rate "CBN/NAFEM closing, 31 Oct" is also a Saturday. "NAFEM" is the old name; Docs 4 and 5c use NFEM. The 3 Oct "WIRE IN" is a Saturday.
- m2 Journey 5's "NGX close … 16:30 WAT" is unsourced. Doc 5c §9.3 lists NGX hours as still to be fetched.
- m3 F12 limits "₦" to verified glyph support, but U+20A6 is universal. Only U+20C3, which I confirmed in Unicode 18.0 UnicodeData, is a problem. Docs 3 and 4 use ₦, so pick one package convention.
- m4 `NGN 12,600,000.00` and "164.2M" break Doc 8's own GOV.UK rules. State the exceptions.
- m5 Base currency "by majority income" versus Doc 4 §4.4.7 (USD and NGN views plus a parallel-rate line) and Doc 6 (NGN for tax).
- m6 "Undo 30 days on all ledger edits" versus immutable reconciled statements and audit trail (Docs 4 and 6). Specify undo as a reversing entry.
- m7 "The other 13 pages were used … type the 6 missing lines" versus Doc 4 §4.3.7 (an unreconciled statement is rejected and the period marked incomplete).
- m8 Journey 2's "NGN 551,667 ± 75,093" is not reproducible from the stated figures (about 560,000). The scripts are not in `research/scripts/`.
- m9 F10 open-banking evidence is from October 2025, while Doc 4 F1 was checked on 2026-11-02. UAE Open Finance is omitted.
- m10 Reserve denominator: "baseline spending" in Doc 8 versus "essential spend" in Doc 4 §4.4.2.

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
| S10 | Zhang, Liao & Bellamy 2020, FAT* | Verified. (abstract supports claim) |
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

The details are in §2. In summary:
- **Doc 3:** AI paraphrase versus templates; 4-day share versus 0–6-day ratio with interval; L1 intervention versus L2 + ABAB ≥ 12 cycles; 3 rungs versus 5 (B1). Risk questionnaires and telemetry for the ostrich construct are missing (M3, M8).
- **Doc 4:** closing-rate versus transaction-date FX; 2/4 versus 3 decomposition terms; no conversion-cost line (B2). 3 versus 4 confidence bands, and review rules (B3). One base currency versus two default views (m5). Partial statements used versus rejected (m7). Liabilities and pensions absent (M3). Open-banking status stale (m9).
- **Doc 5c:** 5 versus 8 states plus Ageing; disputed values in valuations; amber collision; AI conclusions on non-validated figures; "stale" assigned before the SLO is breached (B3); token rendering (B1).
- **Doc 6:** just-in-time versus yearly attested questionnaire; citizenship; indicative/audited modes; tax relevance by category (M2, M3).
- **Doc 7:** offline-first PWA versus server monolith, with mobile "do not attempt yet" (M7).
- **Synthetic FX levels:** USD/NGN about 1,480–1,530 in Doc 8 versus about 1,346 observed in Docs 4 and 5c on 2026-11-02. These are labelled synthetic, but the gap will confuse readers comparing documents.

Doc 8 §2 says the sibling documents "did not exist". The file was edited on 2026-11-04, after they were committed, and §6 still states the dependencies as wishes.

## 6. Questions the Investment Committee needs answered

1. What precision and recall do proposals actually reach on the founder's real statement formats, and how many minutes of review does the first batch need? (The whole "no questionnaire" claim rests on this.)
2. Which document owns the single figure-state machine and the single confidence scale, and when will Doc 8 adopt it?
3. Is the personal MVP desktop-web against a home server (Doc 7) or an offline-first PWA (Doc 8)? The performance, offline and consent copy differ completely between the two.
4. Will the tax area ship in "indicative / unaudited" mode (Doc 6) before the yearly questionnaire is complete, and what exactly may be shown?
5. How will goal views show parameter uncertainty, not only sampling spread, given Doc 5's parameters are placeholders?
6. Who facilitates and scores the n = 1 studies, given that the founder is both sponsor and subject?
7. What is the accessible-name pattern for a number carrying an evidence strip, so that a screen-reader user can read a dense ledger?

## 7. Required changes before Investment Committee (priority order)

1. Bring the insight card and Component B into line with Doc 3 (B1).
2. Adopt Doc 4's FX method and fix the Overview sign (B2).
3. Adopt a single state machine and a single confidence scale with Docs 4 and 5c (B3).
4. Specify graded low-precision fallbacks, measured by precision and recall rather than acceptance (M1).
5. Adopt Doc 6's questionnaire and its indicative/audited modes (M2).
6. Fill the IA gaps and put tax chips on transaction kind (M3).
7. Fix the uncertainty displays: no bare Overview count, dot resolution, parameter uncertainty, Journey 3 (M5).
8. Fix the accessibility defects and draw phone-width wireframes (M4).
9. Rewrite directive copy and expand the banned-word lint (M6).
10. Condition offline and performance claims on Doc 7 (M7).
11. Fix the validation-plan design (M8).
12. Fix the minor items and commit the worked-example scripts (m1–m10).

## 8. What this reviewer could not check

- The FCA effect sizes were checked against the PDF text extracted by `pdftotext`. I did not read the regression tables in full.
- No full texts of the academic papers were read. Claim checks rest on abstracts, metadata and Doc 8's wording.
- NGX trading hours, and whether NFEM publishes on non-business days, were not fetched.
- The NDPA "consent cannot be a condition of service" summary, the UAE PDPL executive-regulation status, TechCabal's ₦575/GB figure (HTTP 403 for Doc 8 as well), the EFInA 64 % and the KPMG/Orange study were not re-checked.
- Doc 5a/5b (simulation outputs) and Doc 9 were not read for this review, beyond Doc 5c.
- Contrast was computed against pure white and #121212. The actual surface colours are unspecified.
- No usability or assistive-technology testing was possible. My Monte Carlo re-run used my own lognormal monthly model, not Doc 8's (uncommitted) code.
