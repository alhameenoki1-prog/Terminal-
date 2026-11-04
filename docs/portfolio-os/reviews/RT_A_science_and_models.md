```
Document: RT-A — Red-team panel A: science, model risk and research methods
Panel: scientific sceptic · financial-model risk reviewer (SR 11-7 tradition) · research-methods professor (all simulated, none licensed)
Version: 1.0  ·  Date: 2026-11-04  ·  Scope: the whole v0.2 proposal (brief, charter, contracts C1–C7, Docs 3, 4, 5a, 5b, 5c, 6 §1/§4/§8/§11)
Independence: this panel wrote none of the documents and did not edit any of them
```

## 1. Verdict

**Major revision before Stage 4. Two findings are blocking.**

The revision pass did real work. Every script we ran reproduces the numbers its document prints. Most of the "Fixed" rows we sampled did land in both text and code. The integration contracts removed the worst contradictions. The documents are also unusually candid about their own limits.

Agreement among the programme's agents still hides three things.

1. **Challenge is not independent.** Every "independent" step in the control design is done either by the founder, who is also the data entrant, labeller, subject and analyst, or by another simulated agent. The status labels the user will see ("reviewed_internal", "validated", "auto-checked") say more than that.
2. **The headline outputs are driven by assumptions.** The goal engine's success count is mostly a readout of a capital-market assumption that has no chosen source. It rises when devaluation risk or assumption uncertainty rises. No test the programme proposes can detect a wrong drift.
3. **The model layer has no model inventory.** About 15 models and more than 200 E4/E5 parameters are spread across seven documents. No register lists them, and none has an owner, a materiality tier, a validation status or a trigger for recalibration.

In several places the methods are more sophisticated than one person's data can support. We show this numerically below.

## 2. What we did

- **Read:** the brief v0.2, the charter, CANONICAL_CONTRACTS, the reviews README and REVISION_LOG; §1, §4, §8 and §11 of Docs 3, 4, 5a, 5b, 5c and 6 (v0.2); and parts of §7 and §9 where §8 or §11 pointed to them.
- **Scripts run under `python3 -I`:** `doc03_revision_checks.py`, `doc04_ledger_worked_example.py`, `doc05a_worked_examples.py`, `worked_example_5b.py` (with and without `-I`), `doc05b_revision_checks.py`, `doc05c_revision_checks.py` and `doc06_tax_worked_examples.py`. All exited 0, and their outputs match the documents.
- **Our own sensitivity harness:** we patched a scratch copy of the Doc 5b script and ran it. No repository file was changed.
- **External checks, 2026-11-04:**
  - the CBN MPC decisions page and the CBN exchange-rate page (fetched);
  - the S160 retraction DOI (reference lookup);
  - press reports of the September 2026 CPI and of the 307th MPC (web search);
  - `git log` for commits d9ad9d5 and 310e0ad.

## 3. Findings

### Blocking

**B1. Effective challenge is self-review throughout, but the labels imply independence (C3.3, C3.5, C4, C7; Doc 5c §4.3.10; Doc 6 §4.2; Doc 3 §4.2).** The SR 11-7 test is whether someone with competence, incentive and independence can challenge a model or data control. In this design:

- **C3.3** requires `validator != ingester` before a figure can become `validated`. Doc 5c §4.3.10 redefines the requirement as "an actor distinct from the ingesting *process*", and names the founder as that actor. For world facts entered by hand under C3.5, the founder is both the person who enters the value and the person who validates it. NGX prices can never reach `two_independent` (Doc 5c §4.3.3), and every FX comparator is `same_upstream`. Conclusion-driving NGX and naira figures therefore rest on the founder sampling 1 in 20 of their own inputs. Doc 5c itself says that a heavier queue "would be rubber-stamped" and estimates this one at about 23 minutes a week.
- **Doc 6:** 17 of 34 tax rules are `reviewed_internal`. The script output gives the reason for every one as "R06 re-read the gazette text on 2026-11-04", and the record names its reviewer as "R06 independent review (simulated)". C7 defines `reviewed_internal` as "a second internal reviewer re-reads the text". The second reader here is another instance of the same programme. We think "INDICATIVE – not confirmed by a licensed tax practitioner" is honest. The status name `reviewed_internal` is not.
- **Ground truth:** transfer-match precision, rule Wilson bounds (C4), the behavioural data-quality gate (Doc 3 §4.2) and categorisation accuracy (charter §9) are all measured against the founder's own review decisions. No second labeller exists, so labelling error and the founder's errors are confounded.

*Required change.* Add an `independence` attribute to every validation and review event, with the values `self`, `simulated_agent`, `second_person` and `licensed`. Show it in the badge. Rename `reviewed_internal` to `machine_reread` until a person other than the founder has done the re-read. Budget a second human, at least quarterly, for a blind re-label sample.

**B2. The goal engine's headline is an assumption readout. It is non-monotone in risk, and its calibration cannot detect the error that matters (C6; Doc 5b §4.7, §4.9, Rec 6–7).** We patched a scratch copy of `worked_example_5b.py` and varied one input at a time (10,000 paths, the script's seeds):

| Change from ASM-SYN-01 | Success count (of 100) | q10 / q90 (USD) |
|---|---|---|
| Baseline (block 5 d, jumps 0.10/yr, drift sd ×1) | 41 | 84,853 / 216,448 |
| Block length fixed at 20 d / 60 d | 40 / 40 | 85,341 / 216,814; 84,359 / 218,458 |
| Jump rate 0 / 0.3 per year | **38 / 45** | 88,062 / 207,015; 80,386 / 239,158 |
| Drift sd ×0 / ×2 | **39 / 44** | 94,911 / 195,832; 67,230 / 269,519 |
| NGN depreciation drift 8% / 16% (base 12%) | **55 / 27** | 96,956 / 247,320; 74,261 / 189,432 |
| Neutral "zero real", jump rate 0 / 0.3 | 18 / 30 | — |

Four things follow.

1. **The sophisticated part barely matters.** The block-length machinery (Politis–White with the PPW correction, golden-tested against `arch` to 1e−9) moves the headline by 1 point.
2. **One unsourced input dominates.** The NGN-depreciation assumption moves the headline by 28 points. It has no source, and C6 open question 3 and erratum CC-12 are both still open.
3. **More risk reads as better odds.** Because jumps are compensated (G-7), a higher devaluation frequency *raises* the success count. Wider drift uncertainty does the same when the goal sits above the median. A user reading "about 45 of 100" against "about 40 of 100" would conclude that more devaluation risk improves their odds. C6 does require the q10–q90 range alongside the count, but the count is still the headline.
4. **Calibration cannot detect a wrong drift.** The protocol calibrates 1-month-ahead forecasts (§4.7). With monthly σ ≈ 0.042, a 2 pp/yr drift error is a shift of 0.04 SD per month. Detecting it with 80% power at one-sided 0.05 needs about **3,900 monthly outcomes, roughly 325 years**. The protocol tests the volatility shape, which hardly affects the headline. It cannot test the drift, which drives it.

The CMA source, its licence and the neutral default are all founder decisions that are still open (C6 Q1–Q3). For NGN assets we know of no published CMA. The engine's key input will therefore be user-typed or "zero real".

*Required change.* Keep the engine as Personal-MVP only if all three of these hold:

- the headline shows the count at the low, central and high value of each dominant assumption (FX drift, drift level, jump rate), and the engine refuses when that span exceeds about 20 points;
- a monotonicity test (more downside risk must not raise the headline) is added to §9;
- `calibration_status` states plainly that drift is not testable.

Otherwise move the engine to Later. Doc 5a Example 3's deterministic required-saving table already carries most of the decision content: moving the return assumption from 0% to 6% changes the required saving by only 16.6%.

### Major

**M1. The FX rate of record names a field the primary source does not publish, and every NGN figure depends on it (C5.1; Doc 4 §1, §4.5; Doc 5c X1; Doc 5a §11 obs. 3; Doc 6 rule 28).**

- **What the contract specifies.** C5.1 and Doc 4 specify the "CBN NFEM **central** rate".
- **What the CBN publishes.** We fetched the CBN exchange-rate page on 2026-11-04. Its columns are NFEM Rate, Highest, Lowest, Closing and Simple Average, and a footnote says the NFEM rate "is derived at Volume Weighted Average" and "stands as the official exchange rate". No buying, central or selling column is shown. Doc 4's "central ₦1,346.41 / sell ₦1,346.91" comes from a press site (S29), because the CBN page could not be fetched.
- **The documents disagree on the number.** Doc 3 §L computes the official–parallel gap against 1,346.91, the sell figure. Doc 5c X3 gives CBN 1,346.26 for 2 November, and X5 gives Frankfurter 1,345.01.
- **Every comparator shares the upstream source** (FMDQ, Frankfurter), so the rate of record is single-sourced by design.
- **What it affects.** The field choice is the open item in tax rule 28, and it feeds currency pools, conversion cost, net-worth translation and Doc 3's spread figures. Doc 6's sandbox shows a ₦11,500 spread in tax on one gain across buy, central and sell.

*Required change.* Re-key C5.1 to a field the source actually publishes (NFEM Rate, VWAP). Record the CBN snapshot rather than a press figure. Close CC-10 before any ledger code is written.

**M2. The flagship behavioural construct is weakly identified and probably unreachable (Doc 3 §4.2 construct 6, §4.3, §4.5).**

- **Pay date and day of month are confounded.** With a fixed salary date on the 25th, the "days 0–6 after salary" window is almost exactly days 25–31 of the month. A single series cannot separate income arrival from month-end or month-start effects. The literature Doc 3 cites as L2a context identifies the effect from variation in pay dates across people. Doc 3 lists salary-date drift as a check, but never names this confound.
- **The worked example does not recover its own parameter.** The generator's "true uplift" is 1.45. The reported cycle-bootstrap interval of 1.51–1.80 excludes it, because the comparison days include the generator's end-of-cycle squeeze. The statistic measures window against rest of cycle, which is not the parameter the text says is true.
- **The test is at its floor.** The circular-shift p of 0.006 is 1/181, the smallest value achievable. Size at the per-look α of 0.017 is not reported; only size at 0.05 is.
- **L1 is probably out of reach.** Under the plausible noise models, the gate (power ≥ 0.8 for a 1.3× pattern) is not met by 24 cycles (0.73 and 0.60). With more than one income stream the construct is L4 by definition. The founder works across Nigeria and the UAE.

*Required change.* Add a placebo-anchor test: the same statistic anchored to non-pay days, such as day 10. Report the gap between the estimand and the generator parameter. Publish a probability, given the founder's noise, that construct 6 ever reaches L1. If that probability is below 0.5, demote construct 6 to an L0b table.

**M3. The data-quality gates cannot be verified as specified (Doc 3 §4.2, §9.1; Doc 4 §7 item 8, §8).**

- **Recall cannot be measured.** Recall ≥ 0.95 is to be measured "on confirmed review-queue items". A missed transfer never enters the queue, so recall cannot be estimated from it.
- **The audit sample is too small.** The gate requires value-weighted error ≤ 2%, audited with 10 probability-proportional-to-size draws a month. With zero errors found, the 95% upper bound is 1 − 0.05^(1/n). Getting that bound below 2% needs about 149 error-free draws, which is 15 months of audit before the gate can pass at all.
- **"Zero false positives" cannot be shown.** Doc 4 proposes zero false positives among confirmed matches, "measured by a quarterly trace sample" at 1 in 20. That rate cannot demonstrate zero. Charter §9's "precision ≥ 98%, recall ≥ 95%" has the same problem.

*Required change.* State each gate as an upper confidence bound with the sample size it needs. Measure recall on a random sample of *all* lines, not on queue items.

**M4. The valuation range is too wide to inform, and a stale market input is allowed to drive conclusions (Doc 5a §4.4, §4.10, Example 1).**

- **The range spans the price.** The mechanical grid is honest. But Bank X's justified-P/B values across the grid run from ₦8.0 to ₦69.3 a share, against a price of ₦60. The DDM gives ₦29.4–37.4. A range that wide supports no conclusion, and the permitted-language rules (rightly) forbid drawing one. R8 (valuation engine) is already Later. The bank module (R5, must-have) carries the same grid.
- **A seven-month-old CDS reading counts as fresh.** A country-risk edition is "fresh for up to 7 months". The CDS basis is "a single 30 June reading from a thin market", so a market price up to seven months old drives a conclusion-tier calculation.
- **The single-source check only checks transcription.** For Damodaran, the "internal-consistency" sampling rule recomputes spread × 1.5545 from the same spreadsheet. That catches copying errors, not wrong inputs.

*Required change.* Mark CDS-basis inputs stale after one month. Show only the decomposition of what the price implies (price-implied ROE), not a value grid, until the inputs narrow the range.

**M5. Risk tolerance is measured three different ways, and the instrument chosen cannot discriminate.**

- **Three documents, three answers.** Doc 4 §4.4.4 and §7 still specify Grable–Lytton 13 items annually, "licensed/attributed". Doc 3 F23a found no licence terms for Grable–Lytton and uses the SOEP/GPS single item. Doc 5a M6(a) stores a user-stated constraint and does not use the SOEP item. Doc 3 §11 says "Doc 4 owner decides in its revision". Doc 4 v0.2's §11 has no row for this (R15), so the hand-off silently failed.
- **The SOEP item cannot tell levels apart.** Doc 3's own MDC95 for the item is 3.5–4.0 on a 0–10 scale. That supports at most two or three distinguishable levels, yet the item is the Personal-MVP input to "portfolio benchmarks (System D/E)" (Rec 5). Doc 3 §4.7 also forbids "questionnaire-derived risk profiles used as suitability". That line is thin when the same item sets the benchmark.

*Required change.* One owner and one instrument. Display the item as a band, never as a number.

**M6. More than 200 untested E4/E5 parameters have no register; "calibrate on the founder's history" is mostly infeasible; the grade scale mixes evidence types (all documents; brief §5.2).**

- **Scale of the problem.** We counted about 110 E5 and about 110 E4 tags across the seven documents: bands, floors, tolerances, thresholds, jump rates and MDC inputs.
- **No register.** None of these is held in one assumption register with an owner, a test, the data volume needed and a review date. Doc 5c §4.3.6 does this for its own constants only.
- **The calibration data will not arrive.** Many items are to be calibrated "on confirmed history". At about one cross-currency transfer a month, C4 concedes that 30 confirmations take years, and C1.5's bands, C4's Wilson rule and Doc 4's matcher strata all share that problem.
- **The grade scale conflates kinds of evidence.** E2 covers both "a single peer-reviewed study" and "a gazette text". A statute is authoritative about what the law says. A single study is weak evidence about the world. Putting them on one ordinal scale lets regraded empirical claims and legal readings sit at the same apparent strength.

*Required change.*
- Build a programme-wide assumption register as a C-contract. Each entry records id, value, grade, owner, the test, the n required, the expected date that n is reached, and its sensitivity rank.
- Split the evidence grade into two axes: an **authority** axis for legal and official facts, and an **empirical-strength** axis.

**M7. No model inventory or materiality tiering (SR 11-7 §IV/§V).** The models include:
- Fellegi–Sunter matching with EM and calibration;
- C4 confidence calibration and rule Wilson bounds;
- LLM and statistical classifiers;
- the circular-shift test and cycle bootstrap;
- the C5.3 decomposition;
- the C6 goal engine;
- Ledoit–Wolf covariance and EWMA;
- the stress library and reverse stress;
- TWR/MWR;
- valuation grids and the CBN payout matrix;
- the tax rule engine;
- C3 freshness thresholds;
- the CPI deflator.

None is listed in a single inventory with tier, owner, validation date, known limits or change control. Doc 5b's decision matrix is an inventory for one domain only. Charter §9's "calibration test documented on synthetic data" validates code, not models.

*Required change.* Create an inventory before Stage 4. Tie validation depth to materiality: tax and net worth are tier 1, behaviour is tier 3.

**M8. The currency-pool tax view is built as a must-have before its premise is known, and the method's sensitivity is never shown (C1.6; Doc 4 §4.6; Doc 6 F4, rule 28).**

- **The premise is unconfirmed.** Every foreign-currency spend is treated as a disposal. Doc 4's October example books an AED-pool loss of ₦20,487.66 on ordinary Dubai spending. That premise needs practitioner confirmation (C1.6 (i)), and it applies only if the founder is Nigerian-resident, which is unknown.
- **One sensitivity is shown, the larger ones are not.** Doc 6 shows sensitivity to the FX field. It does not show weighted-average against FIFO or specific identification for currency, or spot-at-acquisition against historical NGN cost for securities (C1.6 (iv)). We expect those to move gains far more than the 0.6% field effect, but no script quantifies them. "The engine stores enough to recompute" is a capability, not a sensitivity analysis.

*Required change.* Add a method-sensitivity table to Doc 6 Example 1 and to the Doc 4 example. Gate R2's pool engine on the residency answer.

**M9. The control design depends on founder labour that nobody has added up (Docs 3, 4, 5c, 6, 8; P-1).** The founder is asked for all of the following:

- about 23 minutes a week of data validation (Doc 5c);
- the C4 review queue (231 decisions in the first batch, V-009), with every tax-weighted and cross-currency item permanently in review;
- behavioural confirmations and the monthly PPS audit (Doc 3);
- a yearly residency attestation (Doc 6);
- manual multi-bank uploads (Doc 3 R13);
- 20 hours a week of building (P-1).

The charter's usability criterion is a monthly review in under 20 minutes. No document totals these demands. Controls that rely on unpaid vigilance decay, and a decayed control looks the same as a working one.

*Required change.* Publish a founder-hours budget. Add a planted-error test (§4, F-6) so that decay becomes visible.

### Minor

- **m1.** Doc 6 §11 M2 says "s.163 → s.162 throughout". §9(d) still reads "approved channels in s.163(1)(s)" (line 393).
- **m2.** Doc 3 §4.5 Step 5(c) uses a single month's CPI change (September 2026, 0.06% m/m) to call inflation immaterial. Press reports, which are not the NBS primary, give August at 0.71% m/m and September core at 1.11% m/m. The conclusion survives, but the value is a C3.5 world fact taken from press, and one unusually low month was chosen.
- **m3.** The CBN 307th MPC decision on 22 September 2026 is labelled "Reset" to 23.0%, with the standing-facilities corridor recalibrated (CBN page; press). C3.5 checks value equality, not definitional continuity. Add a `definition_change` flag so that rate series spanning a reset are not differenced naïvely.
- **m4.** Doc 5c's "Fed rate 75 bp wrong at entry" assumes the repo's `cbRate: 4.25` was the *lower* bound. If it was the upper bound, the error is 50 bp. The control works either way, but the claim was upgraded to E2 without establishing which bound the field held.
- **m5.** C6's rule against displaying option differences below "2 SE + 5 points" uses Monte Carlo SE. Assumption uncertainty, which is about 10 points per 2 pp (B2), is far larger.
- **m6.** Doc 4 §11 says it is still waiting for the Behavioural department's response on V-025. Doc 3 v0.2 has already answered (§4.6). One of the two §11s is stale.

## 4. Verification of "Fixed" rows (§11 of each document)

| Doc | §11 row | Claimed fix | How checked | Result |
|---|---|---|---|---|
| 3 | B1 / V-024 power | Exact within-pair test; 0 / 0.36 / 0.67, lumpy 0.19 | Ran script §F | **Landed** (all cells match) |
| 3 | M4 CFPB MDC | 13.8 / 18.6 | Script §H | **Landed** |
| 3 | M8 decomposition | Bills 44.3%, FX 20.3%, invest 16.3%, family 12.2%; 93.2% | Script §B | **Landed** |
| 3 | m5 price drift | m/m 0.06%, not 1.14% | Script §K (hard-coded); press search | **Landed** (value confirmed via press only; see m2) |
| 3 | m6 S160 retraction | Retraction notice DOI, Sept 2026 | Reference lookup | **Landed** |
| 3 | M4 / R15 hand-off | "Doc 4 side open"; Doc 4 decides | Read Doc 4 §4.4.4, §7, §11 | **Not landed on the Doc 4 side** (no R15 row; Grable–Lytton kept) |
| 4 | B1 ±6% band | Withdrawn; one-sided bands | Script §4 | **Landed** (700/750/760 credits go to review) |
| 4 | M2 duplicate hash | C1.8 line key; golden test | Script §9 | **Landed** (0/0/1/0 new keys versus 0/18/15/0) |
| 4 | W10 residual | Exact C5.3 identity | Script §8 | **Landed** (identity exact; sign checks pass) |
| 4 | W11 commission | Capitalised, lot USD 701.00 | Script §6 | **Landed** |
| 5a | M1 NGN route | rf_NGN = FGN − spread; 25.07% | Script | **Landed** |
| 5a | B2 23% column | Mechanical grid 24.0 / 27.3 / 30.6 / 34.1 | Script | **Landed** |
| 5a | B2 FX share | 25.0% of PBT, pre-tax over pre-tax | Script | **Landed** |
| 5a | m2 rejection | 27.50% in force Feb–Jul 2025 | Fetched CBN page | **Landed; Doc 5a is right** (27.5% at the 299th–301st MPC, 27.0% from 23 Sep 2025) |
| 5b | B4 environment | SHA identical with and without `-I` | Ran both | **Landed** (`8c0725b9…3b6ba4` both times) |
| 5b | M1 matrix | 13/19 recomputed, S5 | Script [1]; recomputed 4 rows by hand (4.35, 3.53, 1.71, 2.65) | **Landed** |
| 5b | M4 99% band | 97.9% | Script 7b | **Landed** |
| 5b | B1 correlation | 0.281 without break day | Script line 18 | **Landed** |
| 5c | B1 wrong at entry | C3.5 check blocks 27.50 | Script A; CBN page | **Landed** (primary record matches the fetched page) |
| 5c | M1 NGX cost 2×2 | USD 26 / 104 / 167 / 792 | Script B | **Landed** |
| 5c | M3 workload | 392 checks, about 20 h/yr | Script D | **Landed** (inputs E5) |
| 5c | B1 Fed claim | 75 bp wrong | Script; repo `git show` | **Partly** (bound semantics assumed; m4) |
| 6 | M5 / V-001 VAT | ₦75; closing ₦1,588,875 | Script Ex. 3; text line 313 | **Landed** |
| 6 | B1 / V-018 basis period | Gain in YOA 2027 | Script event mapping | **Landed** |
| 6 | B2 / V-019 rule set | 34 records: 17 / 2 / 15 | Script status counts | **Landed** (but see B1 on what `reviewed_internal` rests on) |
| 6 | M2 / V-020 pinpoints | s.163 → s.162 "throughout" | grep | **Partly** (one residual in §9(d)) |

Of 26 sampled rows, 22 landed in full, 3 landed in part and 1 cross-document hand-off did not land. We found no case of a "Fixed" row whose script disagreed with its text.

## 5. Falsification tests for the personal phase

Each test should be pre-registered, with the hash timestamped as Doc 3 §4.3 already specifies, before the data exist. A failure means the approach is wrong for this founder, not merely untuned.

| # | Claim under test | Test | Fails if |
|---|---|---|---|
| F-1 | The system improves decisions, not just visibility | Log every financial decision for 6 months with "would I have done this without Portfolio OS?" and the money involved. Compare with the founder-hours log (M9) | Fewer than about 3 decisions changed, or money saved or avoided below the founder's own hourly value × hours spent |
| F-2 | The ledger is correct, not merely reconciled | A second person rebuilds one full month blind from the raw statements, covering categories, transfers and income classes | Value-weighted disagreement above 2%, or any tax-weighted misclassification |
| F-3 | Matcher recall is high | Randomly sample 100 lines from *all* bank lines (not the queue) and label them independently | Missed own-transfers above 5% of transfer value (upper 95% bound) |
| F-4 | Controls catch errors | Plant errors at a known rate without telling the founder: wrong-at-entry world facts, stale prices, a mis-matched FX credit inside the band, a duplicated line, a wrong rule parameter | Catch rate below 90% for tier-1 errors, or any planted error reaching a displayed total unbadged |
| F-5 | Self-validation is real, not rubber-stamping | Seed obviously wrong items into the 1-in-20 validation queue at about 1 in 50 | More than 1 seeded item approved per quarter |
| F-6 | Construct 6 measures income arrival | Placebo anchors on days 5, 10 and 15 of the month, same statistic and test | Any placebo ratio's interval overlaps the payday ratio's |
| F-7 | The goal engine adds decision information | For each goal, record the decision under the deterministic required-saving table (Doc 5a Ex. 3), then under the engine at low, central and high CMA | The decision is the same in every case, or flips inside the plausible CMA range. Either way the engine adds nothing or adds noise |
| F-8 | The headline is monotone in risk | Engine unit test: raising jump rate, FX drift or drift sd must not raise the count at fixed expected log return | Any violation (fails today; B2) |
| F-9 | Tax figures are right | A licensed practitioner recomputes Examples 1–3 and the founder's real year in their own software (Doc 6 §9(s)) | Any material line differs and the cause is not an open `disputes[]` branch |
| F-10 | Freshness thresholds mean something | For 3 months, log every figure displayed as `fresh` and later found superseded or wrong | Error rate among `fresh` figures not lower than among `ageing` ones |
| F-11 | L0b views pay for themselves | Doc 3 Rec 2's own threshold, made binding | Annualised charges cancelled plus spread avoided below the threshold after 6 months |
| F-12 | The founder can sustain the burden | Weekly minutes log across all queues | Above 60 minutes a week for 4 consecutive weeks, or a queue backlog older than 30 days |

## 6. What we could not check

- **Documents and scripts not reviewed.** We did not read Docs 7, 8 and 9, nor the parts of Docs 3–6 outside §1, §4, §8 and §11 except where cross-referenced. We did not run `doc07_tech_checks.py`, `doc08_journey_figures.py`, the Doc 9 scripts or `contracts_checks.py`.
- **Primary sources not read.**
  - The NTA and NTAA gazette texts. Doc 6's pinpoint checks need a local pdftotext copy that we did not have.
  - The NGX pricelist and EUA.
  - The NBS September 2026 CPI release. Our figures come from press reports.
  - The FMDQ methodology.
  - Any CMA publication.
  - Whether some other CBN page still publishes buying, central and selling rates. We fetched only `ExchRateByCurrency.html`, which showed no data rows when fetched.
- **Literature and expected effects.** We did not re-verify the academic literature beyond S160. We did not test whether the WA-versus-FIFO effect (M8) is as large as we expect.
- **Founder data and decisions.** No real founder data exist, so every noise, volume and burden figure here is conditional on the synthetic generators. Residency, banks, pay cycles, trading frequency and the CMA choice are all unknown. Several findings (M2, M8, B2) change in severity once these are known.
- **Professional status.** The panel's own work is simulated expert judgement (E4). It is not a licensed model validation, audit or legal opinion.

*Sources used directly by this panel (accessed 2026-11-04):*
- CBN, Monetary Policy decisions, https://www.cbn.gov.ng/MonetaryPolicy/decisions.html (fetched)
- CBN, Exchange rates by currency, https://www.cbn.gov.ng/rates/ExchRateByCurrency.html (fetched: column headings and footnote only)
- *Psychological Science*, "Retraction: Procrastination, Deadlines, and Performance", doi:10.1177/09567976261488042 [verified, reference lookup]
- Nairametrics, "CBN resets MPR to 23", https://nairametrics.com/2026/09/22/cbn-resets-mpr-to-23/ (search result only)
- Arise TV, "CBN cuts MPR to 23 from 26.5", https://www.arise.tv/cbn-cuts-mpr-to-23-from-26-5-as-mpc-revises-policy/ (search result only)
- Tekedia, "Nigeria's inflation rate falls to 14.63% in September 2026", https://www.tekedia.com/nigerias-inflation-rate-falls-to-14-63-in-september-2026-as-price-growth-slows/ (search result only)
- Business Post, https://businesspost.ng/?p=215477 (search result only; m/m figures)
- Repository `git log` / `git show` for d9ad9d5 and 310e0ad
