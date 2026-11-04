Review of: Document 03, Scientific Behavioural Finance Research Report (v0.1, 2026-11-04)  ·  Reviewer roles: professor-level academic psychologist (measurement, construct validity); statistician/econometrician (inference limits, n-of-1 designs, multiple comparisons); behavioural-economics academic reviewer  ·  Date: 2026-11-04  ·  Verdict: **Major revision**

## 1. Verdict and the three most important problems

The document is careful and honest about uncertainty, and its numbers reproduce exactly (§4.5; `payday_sim.py` re-run with `python3 -I`, byte-identical ledger). But its central design choices are weaker than it claims, and some of its intervention advice cannot be built.

1. **The intervention design and its power analysis do not match.** §4.6 specifies alternation randomised within pairs. The power figures in §4.5 Step 8 use a permutation over all C(n, n/2) labellings of a fixed ABAB sequence. Under the design as specified, six months gives at most 8 possible assignments, so the smallest achievable p is 0.125 and power is **zero**. Twelve months gives 0.39 power for a 15% effect. Each phase is also a single cycle, which is below the single-case standards the document itself cites [S131].
2. **The best-evidenced interventions cannot be implemented.** The document recommends auto-sweeps, auto-conversion and trade friction. Doc 04 R13 classes automated transfers as *Do-not-build* (regulated payment activity), and Portfolio OS has no order routing. That leaves informational prompts. The source the document cites for its own nudge discussion [S143] reports a bias-corrected effect of **0.00, with evidence against an effect, for the finance domain**, and the document omits this.
3. **Construct validity and the claims ladder are over-stated.** L0 already depends on classification. L2 ("evidence-supported explanation") cannot be reached for one person by the document's own non-ergodicity argument (F25). The classification rules write rational explanations in by default (FX counted as "hedging"). The CFPB quarterly outcome has a minimal detectable change of about 14 points, so it cannot detect plausible intervention effects for one person.

## 2. Findings, severity-ranked

Reproduction note: every number in §4.5 Steps 1–8 matched my re-run (ratio 8.03 against 1.60; bootstrap intervals 1.38–1.83; permutation p = 0.006; HAC t = 5.36; upper control limit ₦286,808; the power grid; alternating-design power 0.23/0.68/0.41/0.93). My checks were run from a separate script in the session scratchpad and are reported below. They are synthetic-data results (E5).

### Blocking

**B1. The power analysis does not test the design the protocol specifies** (§4.5 Step 8, §4.6 item 2)
- *Claim:* "alternating treatment by pay cycle (ABAB…), randomised order within pairs, minimum 12 cycles", with power ≈0.23 at 6 months and ≈0.41 at 12 for a 15% reduction.
- *Problem:* `sim_ab` runs a fixed ABAB sequence and permutes over all C(n, n/2) labellings. For the design as written, a valid randomisation test must permute over the 2^(n/2) within-pair assignments (Edgington's principle that the analysis follows the actual randomisation).
- *My re-simulation:* 6 months gives 8 assignments, a minimum p of 0.125 and **power 0** at any effect size. 12 months gives 64 assignments and power 0.39 (15% effect) or 0.88 (30%). 24 months gives 0.64 or 0.998.
- Each "phase" is one cycle. The single-case standards cited [S131] require several data points per phase for reversal designs. The design is really an alternating-treatments design and should be judged against that standard.
- Carryover is not addressed. Implementation intentions [S148] are *meant* to leave a lasting habit, which breaks the reversibility an ABAB design relies on.
- Alternating by month is confounded with the calendar (school fees in Jan/May/Sep, Ramadan). With only 6 pairs, chance imbalance is large.
- *Fix:* state the randomisation scheme and derive the test from it. Re-run power for that test. Set the minimum at 24 cycles for effects of about 15%, or restrict to interventions with expected effects of 30% or more. Add a carryover/washout analysis, block on the known calendar events, and report against SCRIBE (Single-Case Reporting guideline In BEhavioural interventions) as well as CENT [S130].

**B2. The recommended large-effect interventions cannot be built, and the remaining small-effect ones have bias-corrected support near zero in finance** (F26–F27, §4.2 rows 1/8/11, §4.5 Step 8, §8 rec 5)
- *Claim:* the product "should favour interventions with large expected effects (defaults, auto-sweeps, friction)". Examples given: "optional auto-sweep", "rule-based auto-conversion", "cooling-off friction (24-hour confirm) for trades".
- *Feasibility:* Doc 04 R13 classes "automated payments or transfers from Portfolio OS" as *Do-not-build (yet)* because that moves the product into regulated payment activity. Doc 04 also has no order routing, so trade friction has no point at which to apply. The only implementable forms are standing orders the user sets up at the bank, which the system can observe but not randomise.
- *Evidence:* a self-chosen sweep is a **commitment device**, not a default in the Madrian–Shea sense, which works through inertia among people who did not choose [S35]. The relevant evidence is take-up and partial use of commitment products (28.4% take-up in [S78]), not default effects.
- *Omitted result:* the reanalysis cited [S143], re-read 2026-11-04 at https://pmc.ncbi.nlm.nih.gov/articles/PMC9351501/, reports a bias-corrected effect of d = 0.00 [0.00, 0.00] for the **finance domain** with BF01 ≈ 31–41 (evidence *against* an effect). The "structure" category, which includes defaults, is "undecided" (0.12–0.23, CIs reaching 0). The document's "defaults and friction by much more" therefore has no support from its own bias-corrected source.
- *Fix:* reconcile with Doc 04 R13. Either list user-configured bank-side automation as the intervention, with Portfolio OS only measuring it, or escalate the conflict to the Investment Committee. Add the finance-domain null to F27. Lower the expected effect of informational prompts to "possibly zero".

### Major

**M1. The claims ladder (§4.1, §4.4) is not defensible as written for one person**
- *L0 is not purely observed.* "You spent ₦X on Y" depends on the categorisation (Doc 04 §4.2 attaches confidence to classification, not amount). Split L0 into L0a (raw ledger line) and L0b (classified, with classification confidence shown).
- *L1 needs a stopping rule.* "After confounder removal" depends on the confounders being correctly classified. The criterion "interval excludes ROPE and held in ≥5 of 6 cycles" will flip labels from month to month as new cycles arrive. Add a persistence rule so a label does not toggle on each new cycle.
- *L2 is unreachable for one person.* By F25 (non-ergodicity), "a mechanism from E1 literature consistent with L1" is an analogy, not an explanation for this person. The permitted L2 sentence in Step 7 even says "the system does not know which applies to you", which is L3 by the document's own definitions. "Bank-data studies find a similar after-income pattern in most people" over-generalises US and Icelandic panels [S64, S65] to a Nigeria–UAE user, against F22.
- *Missing rung.* The only route to a person-specific causal statement is the document's own n-of-1 experiment, and the ladder has no rung for it. Fix: rename L2 to "literature context (analogy)", and add "L2-causal: within-person randomised result" with §4.4 wording.

**M2. Several metric names claim more than their observables measure** (§4.2)

| Catalogue construct | What the observable actually measures | Missing alternative explanations |
|---|---|---|
| Income-arrival spending response | Timing of *posted outflows*, not consumption | Bulk/stockpile buying at payday (inventory management under 14–20% inflation, not over-consumption); card/POS posting lags (value date ≠ purchase date); cash withdrawn at payday then spent invisibly; credit-card repayment cycles (UAE); several income streams in NGN and AED with different pay dates; irregular or business income (the analysis is undefined without a single anchor); household spending paid from a partner's account |
| Payday-cycle severity | The same data as row 1, inverted | A duplicate construct: it doubles the multiplicity count and the message the user hears. Merge it with row 1 |
| Recurring-charge "inertia" | Existence of a recurring debit | The user may value the service. Usage data are rarely available. Rename it "recurring-charge inventory" (the L0 rung is fine) |
| Mental-budget categories | Adherence to a user-set envelope | Late-month under-spend is also liquidity; it is not evidence of mental accounting |
| Disposition (PGR−PLR) | Realisation relative to purchase price **in one currency** | For a multi-currency investor, an NGX position up in NGN can be down in USD. The reference currency changes the sign. Also NGX illiquidity and price limits (losers may be unsellable), corporate-action cost-basis errors, and the 2026 Nigerian capital-gains regime (Tax department) |
| Ostrich/engagement | App opens | **The first user is the developer**: opens reflect building and testing. Notifications sent by the product make opens endogenous. Do not build until there is a non-developer user |
| FX "hedging" share | Conversion timing | Remittance pre-funding, USD debt service, speculation. See M3 |

**M3. The classification rules write rational explanations in by default** (F17 rule, F18 rule)
- *Claim:* every payday-window FX, inflation-linked or pre-payment outflow "is classified as hedging/committed … before any behavioural statistic is computed". F17 calls these "minimum-variance portfolio choices, not present bias".
- *Problem:* Ize & Levy Yeyati [S101] model aggregate dollarisation. They do not show that converting *within days of receipt* is optimal for an individual. In the document's own figures (m/m CPI 0.06% in September 2026; NFEM–parallel gap about 2–3%), the expected loss from waiting a few weeks is small. A rule that always explains a behaviour as rational is as unsupported as one that always explains it as bias. It also removes these flows from scrutiny for good.
- *Fix:* tag these flows only after the user confirms the tag, report them as a separate series, and present "hedging" as one of several explanations at L3.

**M4. The instruments cannot do the job assigned; licensing is absent; Doc 04 disagrees** (F23, §4.2, §8 rec 4)
- *CFPB as outcome.* The score metric is IRT θ×15+50, so the population SD is 15 (technical report §5.2.1, re-read 2026-11-04). With marginal reliability 0.89, SEM ≈ 5.0 and **MDC95 ≈ 13.8 points** (5-item: ≈18.6). The technical report gives no test–retest or responsiveness evidence. Quarterly measurement also yields 4 points a year against a per-cycle alternation, so the outcome frequency does not match the design. Keep the CFPB scale as a descriptive annual or semi-annual series, not as the intervention outcome.
- *SOEP item.* With an assumed SD of about 2.3 and retest r of about 0.6–0.7 (E4; the document gives only "moderate"), MDC95 ≈ 3.5–4 points on the 0–10 scale. Annual retests will rarely show real change.
- *Licensing.* The word does not appear in the document, yet Doc 04 §9 item 10 asks this department to "specify … risk-tolerance instrument licensing". The CFPB scale is likely US public domain (E4: federal work; the CFPB page does not state terms). SOEP/Global Preference Survey items, DOSPERT and Grable–Lytton need explicit terms for commercial use (System I).
- *Cross-cultural fit.* The Global Preference Survey [S102] fielded translated risk items in Nigeria and the UAE (reviewer recollection; verify). That is a better localisation route than the German SOEP wording. The fragility item's "$2,000" converted to NGN or AED is not equivalent in difficulty. Anchor it to one month of the user's essential spending instead.
- *Doc 04 conflict.* Doc 04 §4.4.4 and §7 make **Grable–Lytton 13-item annually** the tolerance measure. Doc 03 makes it optional and adopts SOEP. One of them must change.

**M5. The loss-aversion evidence is one-sided** (F2, R2)
- F2 presents Brown et al.'s λ = 1.955 [1.820, 2.102] (abstract re-checked) as *the* meta-analytic estimate.
- It omits Walasek, Mullett & Stewart, "A meta-analysis of loss aversion in risky contexts", *J. Economic Psychology* (2024), doi:10.1016/j.joep.2024.102740 [verified: hosted tool]. Its working-paper abstract (SSRN 10.2139/ssrn.3189088) reports **λ = 1.31, 95% CI [1.10, 1.53]** for CPT λ estimated from risky choice, and says "much of the data are of poor quality". I did not check the published version's figure.
- *Fix:* grade the magnitude E2–E3 and state the range from 1.3 to 2.0 depending on the elicitation method. This strengthens the document's own "never assign λ" rule.

**M6. The nudge debate is presented without the correction, the reply and the authors' own caveat** (F27)
- The Mertens et al. paper carries a **publisher correction** (10.1073/pnas.2204059119, 4 May 2022). It discloses that the sample included four observations from Shu et al. (2012), which **has been retracted**, plus erroneous values and coding errors. A section that warns about retracted work should report this.
- Missing from the exchange: Mertens et al.'s reply (10.1073/pnas.2202928119) and Bakdash & Marusich (10.31234/osf.io/9q67c).
- Maier et al.'s own rejoinder (S163, re-fetched) says the overall Bayes factor is *undecided* and that they would retitle the paper "No *Overall* Evidence". "Collapses toward zero" is acceptable only if absence of evidence is distinguished from evidence of absence. The finance domain is the exception where they do report evidence of absence (B2).
- Grading: DellaVigna & Linos is one study of two units → **E2** by the brief's own rubric, not E1. Its outcomes are take-up of government programmes after letters and emails, so it says little about prompts a sophisticated user designs for himself. Add the default-effects meta-analysis (Jachimowicz et al. 2019, 10.1017/bpp.2018.43 [verified: Crossref]) to F26.

**M7. Multiplicity and repeated looks are not controlled** (§4.3)
- Benjamini–Hochberg "per reporting cycle" does not control error across months. Each monthly recomputation of a growing series is another look (optional stopping). Over a year, 15 constructs × 12 looks will produce false "consistent patterns".
- The document also mixes frequentist FDR control with Bayesian posterior-versus-ROPE reporting without saying which one decides the rung.
- *Fix:* choose one decision framework. Either anytime-valid inference (confidence sequences or e-values) or a pre-declared alpha-spending schedule, or a Bayesian rule with a fixed posterior threshold plus a persistence requirement. Count looks as well as tests.
- The "weak prior centred on the null; population evidence informs width, never centre" rule is defensible caution but is E4 and should be labelled as such. In a hierarchical model, the population mean is the natural prior centre unless non-ergodicity is shown. Fisher et al. [S126] is itself contested (Adolf & Fried 2019, 10.1073/pnas.1818675116, "Ergodicity is sufficient but not necessary…").

**M8. The worked example's methods contradict §4.3, and the power figures are optimistic**
- *Day-level bootstrap.* The Step 2/§4.1 interval (1.38–1.83) resamples *days* independently, which breaks §4.3's rule that "the independence unit is the pay cycle". A cycle-level bootstrap gives 1.51–1.80, but with 5 clusters any bootstrap under-covers. The honest inference is the permutation test.
- *Circular-shift test is slightly liberal.* Empirical size at nominal 0.05 was 0.065, 0.07 and 0.083 for 3, 6 and 12 cycles (400 simulations).
- *Power depends on an unrealistically clean noise model.* The noise is i.i.d. lognormal (σ = 0.45) with no zero-spend days and no lumpy purchases. With σ = 0.8 and 20% zero days, power to detect 1.3× at 6 cycles falls from 0.78 to **0.32** (0.54 at 12). The "≥6 cycles for ≥1.3×" gate in §4.2 must therefore be calibrated on observed noise. §9 item 3 points that way but the catalogue states the gate as fixed.
- *Step 9 precision is understated.* At the catalogue minimum (20 paper gains, 20 paper losses; PGR 0.30 vs PLR 0.15), the binomial 95% half-width is **±0.26**, not ±0.15. ±0.15 needs about 60 of each, before within-day clustering is accounted for.
- *Mislabelled decomposition.* Step 5(a) says "scheduled obligations explain 93%". In the script's own data, bills and fees account for 44% of the naïve excess; FX 20%, investment 16% and family transfers 12% make up the rest.

**M9. The founder is subject, designer and analyst, and the ethics section does not address it** (§4.6, R8)
- No blinding is possible, the hypotheses are known in advance, and expectancy and reactivity effects are likely.
- The "pre-registration record stored in the ledger with timestamp" can be edited by the person whose behaviour is being tested. It must be tamper-evident (hash committed to an external timestamp or registry).
- For any future user, alternating interventions are human-subjects research. That needs independent ethics review and lawful-basis and consent analysis under Nigeria's Data Protection Act 2023 and the UAE Personal Data Protection Law (Legal to confirm). Neither is mentioned.
- Withholding a beneficial feature in "B" months has a financial cost, and this needs stating in the consent text.

**M10. Financial education evidence is read selectively** (F9)
- Kaiser et al. (NBER w27057 abstract, re-fetched) find effects "at least three times as large as the average effect documented in earlier work" (76 randomised trials, more than 160,000 people). They directly dispute the Fernandes "0.1% of variance" reading.
- Grading both "E1" while keeping the Fernandes framing ("small and decay") is not neutral.
- *Fix:* present the disagreement with both positions. This matters for the boosting route (F29), which needs a fair hearing because B2 removes most of the nudges.

### Minor
- m1. **S151 author list is wrong.** Crossref for 10.1287/mnsc.2015.2296 gives Karlan, McConnell, **Mullainathan, Zinman**; the document lists "Sneha Stephen, Keesler Welch", taken from the trial-registry record. It is also graded "E1" though it is one paper (→ E2).
- m2. S47 is dated 2021 in §10 but 2022 in F9. Crossref gives August 2022.
- m3. S108 and S165 are listed but never cited in the text. §2 claims 171 verified works, while §10 lists 167 entries in total, including non-academic sources.
- m4. F21's "CBN guide setting transfers above ₦10,000 at ₦60" is almost certainly the ₦10 fee (₦5,001–₦50,000 band under the revised Guide, Doc 04 F5) plus the ₦50 stamp duty. This is a misattribution, not a separate rule.
- m5. Step 5(c) derives a monthly price drift of about 1.1% from the 14.6% year-on-year rate, but September 2026 month-on-month was 0.06% [S103]. Use the month-on-month series.
- m6. S160: give the retraction notice (10.1177/09567976261488042, 2 Sep 2026 per Crossref) rather than "publisher metadata".
- m7. F12 promises "a one-notch discount" for mechanism claims not replicated in field data. It is not applied in §4.8: implementation intentions and the questionnaires remain E1.

## 3. Evidence-grade audit

| Location | Claim | Given | Supportable | Reason |
|---|---|---|---|---|
| F27 | DellaVigna & Linos as "most credible point estimate" | E1 | E2 | One study; take-up outcomes only |
| F27 | Allcott & Rogers persistence | E1 | E2 | One programme (multi-site) |
| F26 | Karlan et al. reminders | E1 | E2 | One paper |
| F7 | Attention-driven buying | E1 | E2 | Two papers, same author group |
| F2 | λ ≈ 1.96 as the magnitude | E1 | E2–E3 | A competing meta-analysis gives 1.31 (M5) |
| F25 | Non-ergodicity as a bar to group-to-individual inference | E1 | E2 | Contested (Adolf & Fried 2019) |
| F28 | Implementation intentions, applied to money | E1 | E3 | Mostly lab and health outcomes; the meta-analysis d was not verified |
| F28 | Goal-setting theory [S149] | E1 | E3 | A review by the theory's originators |
| §4.8, §8 rec 4 | Questionnaires "E1 psychometrics" | E1 | E2 (US), E4 (NG/UAE use) | Single development reports; no invariance evidence |
| F17 | FX conversion is "minimum-variance, not present bias" | E2 | E4 | Macro model applied to an individual's timing |
| F27 working prior | "Defaults and friction by much more" | implied E1 | E4 | Bias-corrected "structure" effect is undecided; finance-domain effect is null |

Claims stated as fact without a source: "Bank-data studies find a similar after-income pattern in most people" (Step 7 template); "no evidence of durable financial benefit" for gamification (§5; plausible, but unsourced); "Ramadan/Eid timing shifts ~11 days a year" (correct, but unsourced and only needed for user-declared calendars, see §6 below).

## 4. Citation and source spot-check

Academic references (Crossref API unless stated; OpenAlex budget exhausted mid-session; checked 2026-11-04):

| Ref | Check | Status |
|---|---|---|
| S160 Ariely & Wertenbroch 2002 | Crossref `updated-by` retraction 10.1177/09567976261488042 (2026-09-02) | Verified; retraction confirmed |
| S8 Brown et al. 2024 | OpenAlex abstract: 607 estimates, 150 articles, 1.955 [1.820, 2.102] | Verified; numbers match |
| S3 Ruggeri et al. 2020 | OpenAlex abstract: N = 4,099, 19 countries, 94% of 17 items, 12/13 contrasts | Verified; numbers match |
| S142 Mertens et al. | d = 0.45 [0.39, 0.52] matches; **correction 10.1073/pnas.2204059119 not disclosed** | Verified; incomplete |
| S143 Maier et al. 2022 | Crossref + PMC full text | Verified; finance-domain null omitted |
| S144 Szaszi et al. 2022 | Crossref | Verified |
| S145 DellaVigna & Linos 2022 | Crossref; NBER w27594 abstract gives 33.5% / 8.1% and "full difference"; published values not re-fetched | Verified (metadata); numbers partially checked |
| S47 Kaiser et al. | Crossref: JFE, Aug 2022 | Verified; year error |
| S46 Fernandes et al. 2014 | Crossref | Verified |
| S76 Levi & Benartzi | Crossref: JF, 30 Sep 2026 | Verified |
| S74 Einav et al. 2025 | Crossref | Verified |
| S56 Olafsson & Pagel 2025 | Crossref | Verified |
| S114 Dohmen et al. 2011 | Crossref | Verified |
| S126 Fisher et al. 2018 | Crossref | Verified |
| S110 Kuzniak et al. 2015 | Crossref | Verified |
| S90 Squires 2024 | Crossref | Verified |
| S30 Ben-David & Hirshleifer 2012 | Crossref | Verified |
| S148 Gollwitzer & Sheeran 2006 | Crossref | Verified (d not checked) |
| S21 Imai et al. 2020 | Crossref | Verified |
| S151 Karlan et al. 2016 | Crossref authors: Karlan, McConnell, Mullainathan, Zinman | **Mismatch** in co-authors |
| Added: Walasek et al. 2024 | Hosted verify tool (DOI) and SSRN abstract | Verified |
| Added: Mertens reply; Jachimowicz 2019; Adolf & Fried 2019; Bakdash & Marusich | Crossref search | Verified (existence) |

Non-academic URLs (WebFetch, 2026-11-04):

| Source | Result |
|---|---|
| S103 Vanguard CPI article | Fetched. 14.63%, 20.98%, m/m 0.06%, food 19.59% confirmed. The article's core figure (13.29%) is internally inconsistent; Doc 04 gives 12.95% from NBS |
| S104 WithinNigeria FX | Fetched. ₦1,346.91 for 29 Oct 2026 confirmed; parallel ₦1,385–1,390 |
| S105 Legit.ng stamp duty | Fetched. ₦10,000 threshold, sender bears, 1 Jan 2026, salary and intra-bank self-transfer exemptions confirmed; no statute section given |
| S106 TechCabal (both URLs) | HTTP 403. Still unverified |
| S107 NAN / a2f.ng / EFInA | NAN fetched (64/10/26/74% confirmed); a2f.ng shows the 79% headline dated 21 Oct 2026 with no breakdown; EFInA HTTP 503 |
| S119 CFPB technical report | PDF extracted. Reliability ≥0.89 / >0.80 and r = 0.94 confirmed; score SD = 15 by construction; no test–retest reported |
| CFPB scale landing page | Fetched. No licensing terms stated; Spanish versions exist |
| S163 PMC (Maier) and Bayesian Spectacles | Both fetched; see M6 |
| S166 GFLEC | Fetched. 150,000+ adults, 140+ countries, four concepts; no country figures |

## 5. Cross-document contradictions (Doc 04)

1. **Automation.** Doc 04 R13 classes automated transfers as do-not-build; Doc 03 recommends auto-sweeps, auto-conversion and trade friction (B2).
2. **Risk tolerance instrument.** Doc 04 makes Grable–Lytton annual the measure; Doc 03 adopts SOEP with Grable–Lytton optional. Doc 04 also asks Doc 03 to settle licensing, which Doc 03 does not do (M4).
3. **Data-quality gates differ and do not combine.** Doc 03 uses ">95% of inter-account flows matched" and "≥90% agreement on 200 labels". Doc 04 uses precision ≥0.98 / recall ≥0.95 on 200 labelled transfers, and ≥90% of lines auto-classified at ≥0.90 confidence. "Share matched" cannot be computed without ground truth. Neither gate is value-weighted, yet a single misclassified ₦2.4m rent line moves the payday ratio more than 100 misclassified small purchases. Adopt Doc 04's precision/recall plus a **value-weighted** error bound.
4. **Taxonomy.** Doc 03 needs discretionary, scheduled, obligation/social and hedge partitions. Doc 04 supplies `is_essential` and a "Family & giving" group that merges remittances, religious giving and school fees. Doc 04 also treats FX bought into one's own domiciliary account as a transfer, which is already excluded from spending. The two models must be mapped explicitly.
5. **CBN 2026 charges.** Doc 04 F5 reports the revised Guide effective 1 May 2026 (E3); Doc 03 F21 calls the CBN change unverified and misreads ₦60 (m4).
6. **Budget-view experiment.** Doc 04 §4.4.1 and §9 item 10 assign the budget-view experiment to this department; Doc 03 does not design it.
7. Doc 04 states core CPI as 12.95% with no caveat; Doc 03 flags a discrepancy. Resolve against the NBS PDF.

## 6. Questions for the Investment Committee

- If automation is out of scope (Doc 04 R13), what intervention is the behavioural module meant to deliver, and is a module that only measures still worth building?
- Is the founder willing to commit to 24 or more months of alternation? Who, other than the founder, reviews pre-registrations and results?
- Is the founder paid on a single salary cycle at all? The core L2 construct assumes so ("confirm" in §8 rec 3).
- Should sensitive inferences (religion from giving or Ramadan seasonality, health from pharmacy spend, betting) be ruled out by design or allowed only when the user declares them?
- Which single decision framework (frequentist sequential or Bayesian) governs the rungs?

**Gaps in the do-not-build list (§4.7, §8):** inference of sensitive attributes (religion, health, ethnicity from counterparties); gambling or betting labels and any "addiction" language; behavioural credit or "creditworthiness" scoring at commercialisation; sale or sharing of behavioural data; real-time "you are about to overspend" push alerts (just-in-time interventions without evidence); emotion or mood inference from chat text; questionnaire-derived "risk profiles" used as suitability for advice; and an engagement or ostrich metric while the only user is the developer.

## 7. Required changes before Investment Committee (priority order)

1. Make the randomisation scheme, the test and the power analysis agree. Re-state minimum durations and add carryover and calendar blocking (B1).
2. Resolve automation with Doc 04 R13. Add the finance-domain null from [S143] and lower expected effects accordingly (B2).
3. Restructure the ladder: split L0, recast L2 as analogy, add a within-person causal rung, add persistence rules (M1).
4. Rename or limit constructs per the M2 table. Add posting-lag, cash, bulk-buying, multi-income and reference-currency checks. Make hedge and obligation tags user-confirmed (M3).
5. Replace CFPB as the intervention outcome; report MDC for every instrument; add a licensing table; settle SOEP vs Grable–Lytton with Doc 04 (M4).
6. Add Walasek et al. 2024, the Mertens correction and reply, Jachimowicz 2019, Kaiser's counter-position and Adolf & Fried. Regrade per §3 (M5, M6, M10).
7. Choose one sequential decision framework and count looks (M7).
8. Fix the worked example: cluster-respecting inference, a realistic-noise power grid, and the Step 9 half-width (M8).
9. Add tamper-evident pre-registration, independent review and NDPA/PDPL analysis (M9). Extend the do-not-build list (§6 above).
10. Minor corrections m1–m7.

## 8. What this reviewer could not check

- The bias-corrected λ in the *published* Walasek et al. (2024) version (403 at ScienceDirect; SSRN abstract used).
- DellaVigna & Linos's published abstract numbers (the working-paper version differs).
- The content of the Mertens correction beyond its first sentences (PNAS 403).
- Gollwitzer & Sheeran's d and Save More Tomorrow magnitudes (still recalled, as the author notes).
- Licensing terms for SOEP/Global Preference Survey, DOSPERT and Grable–Lytton.
- Whether Nigeria and the UAE are in the Global Preference Survey sample (recollection only).
- TechCabal and EFInA pages (403/503).
- OpenAlex became unavailable (daily budget exhausted) partway through; later checks used Crossref and the hosted tool.
- The SD and retest assumptions used in the SOEP MDC estimate (E4).
- All simulations are on synthetic data and are not evidence about the founder.
