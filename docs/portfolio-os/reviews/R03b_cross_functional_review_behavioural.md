Review of: Document 3 — Scientific Behavioural Finance Research Report (v0.1, 2026-11-04)  ·  Reviewer roles: financial planner; UX researcher; privacy engineer and data-protection researcher (NDPA 2023, UAE PDPL); YC-style operator  ·  Date: 2026-11-04  ·  Verdict: **Accept with required changes** (§3 research accepted; §4.2, §4.6 and §8 to be revised before the Investment Committee)

**Read:**
- Doc 3 in full.
- Doc 8 §4 and §8, plus F15 and §5–§7.
- Doc 6 §3E, §4.1 (retention row) and §4.4–§4.7.

**Re-run:** `research/behavioural/payday_sim.py`, with output written to the reviewer scratchpad. All reviewers are simulated, and nothing here is legal advice. A Nigerian data-protection lawyer and UAE counsel must review M5 before anyone relies on it.

## 1. Verdict and the three most important problems

The literature work is careful and modest. Every figure I spot-checked matches its source. The Ariely & Wertenbroch retraction is real: Crossref records a publisher retraction dated 2 September 2026. The weaknesses are in how the research becomes product.

1. **Doc 8's insight card and Journey 4 break Doc 3's claims ladder** (Blocking).
   - The card uses a different window and statistic, with no interval.
   - It uses trait wording.
   - It lists as "cannot rule out" the confounders that Doc 3 requires to be removed before L1.
   - It offers a two-month before/after test that Doc 3's own power analysis says cannot be read.
2. **The flagship L2 construct and the 12-month pilot improve no named financial decision** (Major). The answers to five-question test items 1 and 5 for recommendations 1–3 describe outputs, not improvements. The most likely result of the pilot is "no measurable difference yet".
3. **There is no lawful-basis, purpose, sensitive-inference or retention design** (Major now; Blocking at the first external user). The behavioural constructs are profiling, and some reveal religion, health or family. Doc 6, Doc 8 and Doc 3 give three incompatible retention rules.

## 2. Findings, severity-ranked

### Blocking

**B1 · Doc 8 §4.4 Journey 4 and §4.5.6, against Doc 3 §4.1, §4.2, §4.4 and §4.6 · The user-facing card contradicts the ladder.**

*What Doc 8 says.* The card reads: "38% of discretionary spending happens in the 4 days after salary arrives … not yet a stable trait." Under "Other explanations we cannot rule out" it lists "Bills fall in those days too and some may be mis-categorised". It then offers "a standing transfer to savings on salary day for two months … compare … before and after".

*Why it is wrong.*
- **(a) Different statistic.** Doc 3 defines the construct as days 0–6 against days 7 and later, reported as a ratio with a 95% interval. A 4-day share with no interval is a different statistic and not an L1 form.
- **(b) No baseline.** A share shown without its expected value misleads. Four days are about 13% of a month, so 38% implies a ratio of about (0.38/4)/(0.62/26) ≈ 4.0× (reviewer arithmetic). That is far above Doc 3's 1.6× and anything in F13, and the reader cannot tell whether 38% is high.
- **(c) Pre-L1 number.** L1 requires the scheduled-bill and misclassification checks to have passed. Listing them as unresolved means the card is showing a number that has not reached L1.
- **(d) Forbidden language.** "Not yet a stable trait" is trait language that L2 forbids.
- **(e) Unreadable test.** A two-month before/after comparison is exactly what Doc 3 §4.5 Step 8 shows is underpowered (power ≈ 0.23 at six months for a 15% effect). A standing transfer cannot be withdrawn, so Doc 3 §4.6 item 2 requires a multiple-baseline design.
- **(f) Wrong evidence scale.** Doc 8 assigns ■■■ "Supported explanation" from the "Doc 3 grade E1–E2" of the cited study. That confuses the grade of the literature with the rung reached for this user. A pattern could reach the top level before any of the user's checks have run.

*Fix.*
- Doc 3 owns one machine-readable construct specification: window, statistic, interval, gates and template. Doc 8 renders it.
- Map the three-square indicator one-to-one onto L0–L2. L3 stays inside "test something".
- Show the checks already removed, with their size ("bills: 93% of the raw spike, removed"). Show only the alternatives that remain open.
- Replace the Journey 4 offer as described in M2.

### Major

**M1 · Doc 3 §8 Recs 1–3 · The five-question answers are not credible as written.**
- **Rec 1.** Q3 cites "E1 on replication fragility". Evidence that the literature is fragile does not show that a ladder helps; the ladder itself is an E4/E5 design. Q5 is a compliance check plus an unthresholded usefulness rating.
- **Rec 2.** Q3 claims "E1–E2", but F21 is E3 and F14 is US data. Value to this founder is E6 until his charges and fees are measured. Q5 lists states ("concentration vs benchmark"), not changes.
- **Rec 3.** Q1, "the one regularity with E1 support", is evidence, not a problem. Q5, "pattern reported with interval", is an output.
- **Planner's view.** Spending timing within a pay cycle costs almost nothing. Doc 3 §4.5 Step 5(c) puts price drift at about 1.1% a month, so buying early is if anything cheaper. The ratio matters only if it causes overdrafts, high-cost borrowing, skipped contributions or a depleted buffer at the end of the cycle.

*Fix.* Restate Q1 and Q5 in money and decisions. For example: "Problem: end-of-cycle shortfall costing ₦X, or a contribution skipped in Y of 6 cycles. Success: both fall to a stated target." If the founder's data show no shortfall cost, downgrade Rec 3 to *Later*. Keep the §4.5 pipeline as a guardrail against false "splurge" alarms (8.03× naive against 1.60× true). That guardrail is its real value.

**M2 · Doc 3 §4.6 and Rec 5 · One user is unlikely to sustain the 12-month pilot, and it would probably be inconclusive.**

*Power.* Doc 3's own figures give 0.41 power at 12 months for a 15% effect, while a nudge at scale moves behaviour by about 8% relative (S145, re-verified). The simulation reproduces exactly, but its noise model is optimistic: i.i.d. lognormal noise with σ = 0.45, no zero-spend days and perfect classification. I re-ran it with σ = 0.9 and 30% zero-spend days (a reviewer E5 sensitivity, not data):
- For a 1.45× pattern, power to detect the pattern itself falls from 0.89 to 0.32 at six cycles, and from 0.97 to 0.43 at twelve.
- For a 1.3× pattern, it falls to 0.24 and 0.34.
- The false-positive rate held at 0.05–0.07, so the test is valid but weak.

*Threats Doc 3 does not price.*
- **Reactivity.** Installing a monitoring app by itself lowers discretionary spending (Levi & Benartzi, S76, re-verified), so the baseline is contaminated.
- **No blinding.** The founder designs, receives and evaluates the intervention.
- **Carry-over.** A learned "payday plan" does not switch off in B months, which breaks the ABAB reversibility assumption.
- **Upload burden.** There is no open banking (Doc 6 F37). That means 12 months of manual multi-bank uploads and review-queue work, plus the §9 gates (95% matched transfers, 90% labelling agreement).
- **Calendar confounds.** Ramadan, December and school terms fall into one arm when there are only six pairs.

*Fix.* Drop the prompt ABAB from the personal MVP. If the founder wants an auto-sweep, adopt it as a decision and track savings rate and end-of-cycle buffer at L0. The sweep's effect on saving is mechanical and needs no inference. Keep §4.6 for the commercial phase, where between-person randomisation is possible.

**M3 · Rec 4, §3D and §9.5 against the "do not overwhelm with questions" rule and Doc 8 P1 and §5 · Too many questions for too little information.**

*Year-one count from Doc 3 alone:*

| Item | Questions |
|---|---|
| Onboarding: SOEP risk item, Big Three, fragility item (fragility possibly in three currencies) | 5–7 |
| Four-week retest, which adds CFPB-10 (§9.5) | 15–17 |
| CFPB-10 every quarter | 40 |
| Classification audit labels (§9.2) | 200 |

On top of this come counterparty tagging, envelopes and the optional scales (DOSPERT, Grable–Lytton 13, Propensity to Plan 12, Consideration of Future Consequences 12). The core is roughly 60–64 items plus about 200 labels, before Doc 6 §4.4's yearly residency questionnaire (about 17 items) and Doc 8's Phase-1 instruments.

*Why most of these add little.*
- **Big Three.** The literacy questions hit a ceiling for this founder (F23 concedes this), and asking them is mildly patronising.
- **Fragility item.** It duplicates the L0 liquidity buffer.
- **CFPB score.** The scale's SD is 15 (technical report §5.2.1) and its marginal reliability is 0.89. That gives a standard error of measurement of about 5.0 and a 95% minimal detectable change of about 14 points (reviewer calculation; error is larger near the ceiling). A quarterly score therefore cannot detect realistic change, and it cannot serve as the outcome of a monthly ABAB (§4.6 item 3).
- **Conflict with Doc 8.** Doc 8 rejects questionnaire-first onboarding and schedules none of these instruments.

*Fix.*
- Ask the SOEP item once, just in time, when the first portfolio benchmark appears.
- Run the CFPB 5-item form (r = 0.94 with the 10-item form) once a year.
- Drop the Big Three and the fragility item for the founder.
- Fold the 200 labels into the review queue and use the correction rate as the quality metric.

This brings the year-one core to about 6–12 items.

**M4 · F17 rule and the §4.2 FX row, against Doc 6 F4, F13 and §7.3 · Classifying payday FX as "hedging" by default is too broad.**

Doc 3 classifies all payday FX outflows as hedging/committed and calls them "minimum-variance" choices. Whether they are depends on the currency of the user's liabilities. If rent and school fees are paid in NGN, holding USD adds risk. S101 is a macro portfolio model, so this is E4, not a fact. Two other costs are ignored:
- **Spread.** Round trips pay the official–parallel gap: ₦1,346.91 against ₦1,385–1,390 on 29–30 October (page re-fetched).
- **Tax.** Doc 6 reads NTA s.34(1)(b) as making foreign currency a chargeable asset.

*Fix.* Label these flows "currency conversion". Report spread cost, Doc 6's `NG-CGT-FOREIGN-ASSETS-2026` flag and the currency mix against liabilities. Keep them out of the discretionary statistic, as now.

**M5 · Doc 3 (missing section), Doc 6 F38–F40 and §4.6, Doc 8 F15 and §4.5.13 · No privacy design for behavioural inferences.**

Provisions below come from the NDPA 2023 text as passed (PLAC-hosted certified copy, read page by page on 2026-11-04).

- **Scope.**
  - s.3(1) exempts processing "solely for personal or household purposes", provided it does not violate a data subject's fundamental right to privacy. That covers the founder acting alone.
  - Doc 6 §4.6's trigger ("once a second person's data is processed") is imprecise. The ledger already holds named kin and their account numbers. The real trigger is a controller other than the founder, such as a company or a cloud processor. Whether processors serving household users are covered is unverified (E4).
- **Profiling.**
  - The NDPA does not define "profiling"; the s.65 definitions jump from "processing" to "pseudonymisation".
  - s.27(1)(g) requires notice of "automated decision-making, including profiling".
  - s.37(1) protects against solely automated decisions with legal or similarly significant effects. The constructs are profiling in substance. s.37 is engaged only if they drive decisions; auto-sweeps and intervention eligibility come closest. In that case the s.37(2)(c) consent route and the s.37(3) human-intervention safeguards apply.
- **Sensitive data.**
  - *Nigeria.* s.65 lists religious beliefs, health status, ethnic origin and political affiliation as sensitive, and s.30(1)(a) requires consent for each specific purpose. Doc 3 §4.3 explicitly models Ramadan and Eid. Spending categories reveal tithes and zakat, pharmacy and hospital visits, party dues and town-union levies.
  - *UAE.* The PDPL's sensitive-data definition covers data that "directly or indirectly reveals a natural person's family" (DLA Piper summary, fetched today; primary text returned 403). F18's tagging of transfers to named kin is therefore sensitive processing.
  - Doc 6 F40 ("financial data not sensitive") is right about raw balances and wrong about inferences drawn from them.
- **Purpose limitation and lawful basis.**
  - s.24(1)(b) and s.24(4)(a) require any further processing to be compatible with the original purpose.
  - Ledger and tax data rest on legal obligation (s.25(1)(b)(ii); NTAA s.31(5) per Doc 6). Profiling is a new purpose and needs its own consent under s.25(1)(a) and s.26.
  - Doc 3 computes all 15 constructs monthly by default, with only interventions opt-in. Doc 8's first-upload consents cover only analytics and cloud parsing.
- **Retention and erasure.**
  - The Act limits retention to what is necessary (s.24(1)(d)), requires erasure (s.34(2)) and makes withdrawal as easy as consent (s.35(2)).
  - Doc 6 keeps statements for six years or more in WORM (write-once, read-many) storage. Doc 8 offers "delete everything". Doc 3 §4.6 says "the record is kept" after withdrawal and stores pre-registrations "in the ledger".
- **Telemetry.** The ostrich elasticity needs per-event app-open times linked to the founder's own returns. That contradicts Doc 8 §4.9's promise of aggregate-only events.

*Fix.*
- A separate, granular behavioural consent, off by default.
- A sensitive-inference register: seasonality only from calendar events the user declares; religious, health and political categories excluded unless the user consents.
- Behavioural derivations stored outside the tax vault, deleted on withdrawal and otherwise after 24 months (E5).
- Templates filled locally, never sent to a cloud model with counterparty names (cross-border rules in NDPA s.41–43).
- A DPIA before any second user.

### Minor

- **m1 · §4.2 construct names imply judgement or cause.** Examples: "payday cycle *severity*", "recurring-charge *inertia*", "*ostrich*", "*under*-diversification", and "*attention-driven* buying", although F15 says attention versus information is unresolved. Internal names leak into Doc 8's breadcrumbs (§4.2.3). Use descriptive names ("spending after income arrives", "recurring charges", "buys on high-volume days").
- **m2 · Templates.** "Discretionary" is a system judgement; say "spending in categories you marked as flexible". "In most people" (Step 7) is an unsourced quantifier; say "several large US and Icelandic bank-data studies". Drop "the 'payday effect'" label.
- **m3 · Vocabulary lists do not overlap.** None of Doc 3's forbidden forms ("always", "habit", "you tend to", "because you are", "irrational", "overconfident", "present-biased", "leakage", money-type labels) appear in Doc 8's §4.7 lint list. Merge them.
- **m4 · F21 can be upgraded to E2.** Doc 6 F21 already read Ninth Schedule item 48 and s.184(i) in the gazette. Remove the request to the Tax department.
- **m5 · §4.3 sample gates are unlabelled assumptions.** "≥6 cycles for ≥1.3×" rests on a single noise assumption. Label it E5 and make the gate depend on observed noise, as §9.3 already intends.

### 2a. Decision map for every L0–L2 measure

| Measure | Decision improved | Verdict |
|---|---|---|
| Recurring-charge audit | Cancel or keep | Actionable; keep |
| Fee, levy and FX-spread drag | Account, channel, batching | Actionable; keep; add parallel-spread cost |
| Liquidity buffer by currency | Reserve size and currency | Actionable; "essential" must be user-confirmed |
| Concentration and currency exposure | Rebalancing; currency against liabilities | Actionable, but owned by System D (Doc 8 §4.5.7); cross-reference only |
| Obligation/family account | Planned share | Actionable as a budget line; sensitive (M5) |
| FX share within 7 days | Conversion policy | Only with spread and tax (M4) |
| Income-arrival ratio and payday cycle | None directly | Interesting, not actionable unless tied to shortfall cost (M1) |
| Mental-budget deviation | Budget setting | Requires user envelopes; Later |
| Disposition PGR−PLR | Sell or hold | The actionable form is a tax-lot view. NGX gains under ₦150 m proceeds and ₦10 m gain are exempt (Doc 6 F13), so harvesting matters mainly for foreign shares |
| Turnover and costs | Trading frequency | Only if the founder trades actively (unknown) |
| Attention buying, rank effect | Weak | Not actionable; remove |
| Ostrich login elasticity | None | Not actionable; privacy conflict; remove |
| SOEP item | Portfolio benchmark | Weak alone; keep one item, asked just in time |
| CFPB scale | Outcome only | Annual short form |
| Big Three, fragility item | None for this founder | Remove |

### 2b. What can be removed without losing value

- **Duplicate inference engines.** Five methods are specified for one ratio: bootstrap, circular shift, HAC regression, Bayesian ROPE and SPC. Keep the circular-shift interval and the per-cycle table.
- **Benjamini–Hochberg correction across "15 constructs".** Most of the constructs are arithmetic, not tests.
- **The ostrich, rank and attention rows.**
- **Six instrument rows:** Holt–Laury, BIS-11, DOSPERT, Grable–Lytton, PtP and CFC. Keep them in §3 as literature only.
- **The MVP ABAB machinery.**
- **Duplicated System D content.**

What remains is the ladder, the prohibited outputs, the obligation and transfer separation, the fee/charge/spread ledger, the buffer, and one guarded payday decomposition. That is roughly 30% of the specified surface and, in our judgement (E4), nearly all of its decision value.

## 3. Evidence-grade audit

| Location | As graded | Problem | Proposed |
|---|---|---|---|
| F25 Fisher et al.; Molenaar | E1 | One study plus a conceptual manifesto | E2; E3 |
| F26 reminders (Karlan et al.) | E1 | Single paper (three banks) | E2 |
| F27 DellaVigna & Linos | E1 | Single (very large) study | E2 by the brief's own definition |
| §4.8 questionnaires | E1 | CFPB scale is one official report (Doc 3 grades S119 E2); no Nigeria/UAE norms; no test–retest | E2; E6 for this founder |
| Rec 2 | E1–E2 | F21 is E3 | E2–E3 |
| F17 "minimum-variance, not present bias" | stated as fact | Depends on liability currency | E4 |
| F13 → Rec 3 | E1 | US/Iceland panels; untested for a Nigeria–UAE founder | E1 phenomenon; E6 applicability |
| §4.3 gates | ungraded | From one simulated noise level | E5 |
| S104 NFEM rate | "search only" | Re-fetched; matches | Verified, E3 |

Stated as fact without a source: "in most people" (§4.5 Step 7); school-fee months January/May/September (founder to confirm). F28's d ≈ 0.65 and F26's SMarT magnitudes remain unverified; I could not retrieve either abstract.

## 4. Citation and source spot-check (checked 2026-11-04)

**Academic: Crossref or OpenAlex lookup by DOI, with abstract figures compared**

| Ref | DOI | Result |
|---|---|---|
| S160 Ariely & Wertenbroch 2002 | 10.1111/1467-9280.00441 | Match. Crossref `updated-by` shows a publisher retraction (10.1177/09567976261488042, 2 Sep 2026) — **retraction confirmed** |
| S8 Brown et al. 2024 | 10.1257/jel.20221698 | Match: 607 estimates, 150 articles, 1.955 [1.820, 2.102] |
| S145 DellaVigna & Linos 2022 | 10.3982/ECTA18709 | Match: 126 RCTs, 23 m people, 8.7 pp vs 1.4 pp, ~70% explained |
| S3 Ruggeri et al. 2020 | 10.1038/s41562-020-0886-x | Match: N = 4,099, 19 countries, 94% of 17 items, 12/13 contrasts |
| S76 Levi & Benartzi 2026 | 10.1111/jofi.70087 | Match (J. Finance): spending falls after app install |
| S56 Olafsson & Pagel 2025 | 10.1162/rest_a_01566 | Match |
| S74 Einav et al. 2025 | 10.1257/aer.20231612 | Match: inertia roughly doubles revenue |
| S54 Sicherman et al. 2015 | 10.1093/rfs/hhv073 | Match: logins −9.5% after declines |
| S152 Medina 2020 | 10.1093/rfs/hhaa108 | Match: −14% / +9%; Doc 3 should say the setting is Brazil |
| S148 Gollwitzer & Sheeran 2006 | 10.1016/S0065-2601(06)38002-1 | Metadata match; d unverified (no abstract) |
| S140 Thaler & Benartzi 2004 | 10.1086/380085 | Metadata match; magnitudes unverified (truncated abstract) |

**Non-academic: re-fetched**

| Source | Result |
|---|---|
| S103 vanguardngr.com/2026/10/breaking-nigerias-inflation-rate-drops-to-14-63/ | 14.63%, food 19.59%, m/m 0.06%, prior year 20.98% — match. Core-inflation sentence garbled, so the discrepancy is unresolved |
| S104 withinnigeria.com/2026/10/31/… | NFEM ₦1,346.91 (29 Oct); parallel ₦1,385–1,390 — match |
| S105 legit.ng/1690443-… | ₦50, ≥ ₦10,000, paid by sender, salary and intra-bank self-transfers exempt — match |
| S107 nannews.ng/financial-inclusion-reaches-64-efina-survey-reveals/ | 64 / 10 / 26 / 74% — match |
| S119 CFPB technical report PDF | Reliability ≥ 0.89 / > 0.80 confirmed; score = IRT × 15 + 50; no test–retest found |
| NDPA 2023, placng.org/i/wp-content/uploads/2023/06/Nigeria-Data-Protection-Act-2023.pdf | Scanned certified bill; ss. 3, 24–27, 30, 34–37 and 65 read |
| u.ae data-protection page (updated 4 Dec 2025); DLA Piper UAE page | u.ae gives no sensitive-data text. DLA Piper quotes the "family" limb and says the executive regulations were unpublished as of Jan 2025. uaelegislation.gov.ae returned 403 |

## 5. Cross-document contradictions

| # | Conflict | See |
|---|---|---|
| 1 | Doc 3 Rec 4 (onboarding questionnaires) vs Doc 8 P1, §4.3.4 and §5 | M3 |
| 2 | Doc 3 §4.2, §4.4 and §4.6 vs Doc 8 Journey 4 and §4.5.6, and Doc 3's five rungs vs Doc 8's three-level indicator | B1 |
| 3 | Doc 3 forbidden forms vs the Doc 8 lint list | m3 |
| 4 | Retention: Doc 6 (WORM, ≥ 6 years) vs Doc 8 ("delete everything") vs Doc 3 ("record kept"); Doc 6 F40 vs sensitive inferences; ostrich telemetry vs Doc 8 aggregate-only events | M5 |
| 5 | Doc 3 F17 "hedging" vs Doc 6 NTA s.34(1)(b) | M4 |
| 6 | Doc 8 §7 anticipates "Behavioural: more frequent nudges", but Doc 3 argues the opposite (F11, F27, R4) | Delete the phantom disagreement. The real tension is pay-eve prompts vs notifications off by default; opt-in resolves it |
| 7 | Doc 3 §6 asks Tax to confirm the ₦50 duty, which Doc 6 F21 already did | m4 |

## 6. Questions the Investment Committee needs answered

1. Does the founder's data show any end-of-cycle shortfall cost? If not, what does the behavioural module add beyond guardrails?
2. Who is the controller (the founder or an entity), and which cloud processors touch behavioural outputs? The answer decides whether NDPA s.3(1) applies.
3. Which sensitive categories are excluded by default, and how long are behavioural derivations kept?
4. Does the founder trade often enough (≥ 30 sale days a year) for any brokerage construct to pass L0?
5. Will he upload every institution monthly for 12 months?
6. Which document owns the construct specification that the UI renders?

## 7. Required changes before the Investment Committee (priority order)

1. Reconcile Doc 3 and Doc 8 on the card, the indicator mapping and the vocabulary list, and remove the Journey 4 before/after offer (B1, m3).
2. Rewrite five-question items 1 and 5 for Recs 1–5 in currency and decision terms. Make Rec 3 conditional on an observed shortfall cost (M1).
3. Replace the MVP ABAB pilot with "auto-sweep adopted as a decision, tracked at L0". Add reactivity, carry-over and calendar confounds to §7 (M2).
4. Add a privacy section: separate consent, sensitive-inference register, purpose limitation, retention separate from the tax vault, local rendering and DPIA. Cite NDPA ss. 3, 24–27, 30, 34–37 and 65 and the PDPL definitions, then get counsel review (M5).
5. Cut the year-one questionnaire core to about 6–12 items and report the CFPB minimal detectable change (M3).
6. Reclassify payday FX as currency conversion, with spread and tax flags (M4).
7. Apply §2a and §2b, and hand concentration and currency exposure to System D.
8. Regrade per §3, label the §4.3 gates E5, and fix the names and templates (m1, m2, m5).

## 8. What the reviewer could not check

- **UAE PDPL primary text** (403; the u.ae PDF is Arabic only). The "family" limb rests on DLA Piper (E3). Article numbers for the scope exclusions (personal-purpose processing; banking and credit data) and for automated processing are unverified.
- **NDPA and GAID texts.** The certified bill was not compared with the gazetted Act, and the GAID 2025 primary text was not read. Doc 6's DPIA and tier claims, and whether the household exemption extends to processors (E4), remain open.
- **Two recalled magnitudes.** The S148 and S140 figures are still unverified.
- **NBS core inflation.** The NBS PDF was not fetched.
- **Founder data.** The founder's real spending noise, trading frequency, subscription and fee spend, and income regularity are unknown. My noise sensitivity is an assumption, and every "actionable" verdict in §2a depends on these facts.
