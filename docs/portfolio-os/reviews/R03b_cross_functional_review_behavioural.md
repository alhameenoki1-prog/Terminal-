Review of: Document 3 — Scientific Behavioural Finance Research Report (v0.1, 2026-11-04)  ·  Reviewer roles: financial planner; UX researcher; privacy engineer and data-protection researcher (NDPA 2023, UAE PDPL); YC-style operator  ·  Date: 2026-11-04  ·  Verdict: **Accept with required changes** (research findings §3 accepted; §4.2, §4.6 and §8 need revision before the Investment Committee)

Also read: Doc 8 §4 and §8 (plus F15 and §5–§7 for context); Doc 6 §3E, §4.4–§4.7 and the retention row of §4.1. Re-ran `docs/portfolio-os/research/behavioural/payday_sim.py` (output written to the reviewer scratchpad, not the repo). Simulated reviewers only: nothing here is legal advice. A Nigerian data-protection lawyer and UAE counsel must review §3 of this memo before anyone relies on it.

## 1. Verdict and the three most important problems

The literature review is careful, well sourced and suitably modest. Every number I spot-checked matches its source, and the claimed retraction of Ariely & Wertenbroch (2002) is real (Crossref records a publisher retraction dated 2 September 2026). The problems are in turning that research into a product:

1. **The behavioural surface Doc 8 specifies breaks Doc 3's own ladder.** Doc 8's insight card and Journey 4 use a different window (4 days, not 7), a share with no baseline and no interval, and a "trait" word. They list confounders that Doc 3 says must be removed *before* any L1 statement. They also offer a two-month before/after "self-experiment" that Doc 3's power analysis shows cannot be read. Doc 8 is the document that will get built (Blocking).
2. **The flagship L2 construct and the intervention pilot are not tied to any financial decision.** The five-question answers for recommendations 1–3 give *output* metrics ("pattern reported with interval"), not improvements. For one sophisticated user, the payday ratio has no cost unless it leads to end-of-cycle borrowing or fees. A 12-month ABAB pilot whose most likely result is "no measurable difference yet" is poor use of founder attention (Major).
3. **Doc 3 has no lawful-basis, purpose, sensitive-data or retention design.** Behavioural constructs are profiling. Some of them reveal religion (Ramadan seasonality, tithes or zakat), health, or family. Family is a sensitive category under the UAE PDPL as summarised by DLA Piper. Doc 6's six-year write-once-read-many (WORM) vault, Doc 8's "delete everything" and Doc 3's "the record is kept" contradict each other (Major now; Blocking at the first external user).

## 2. Findings, severity-ranked

### Blocking

**B1 · Doc 8 §4.4 Journey 4 and §4.5.6, against Doc 3 §4.1, §4.2, §4.4 and §4.6 · The user-facing behavioural card and intervention contradict the claims ladder.**
- *Claim (Doc 8):* the card reads "38% of discretionary spending happens in the 4 days after salary arrives … not yet a stable trait". It lists "Bills fall in those days too and some may be mis-categorised" under "Other explanations we cannot rule out", and it offers "a standing transfer to savings on salary day for two months … compare post-salary discretionary spending before and after".
- *Why it is wrong:*
  - (a) Doc 3 defines the construct as days 0–6 against days 7 and later, reported as a ratio with a 95% interval (§4.2 row 1, §4.4). A 4-day share with no interval is a different statistic, and it is not an L1 form at all.
  - (b) A share without its expected value misleads. Four days are about 13% of a month, so 38% implies a ratio near 4× (reviewer arithmetic: (0.38/4)/(0.62/26) ≈ 4.0). That is two and a half times Doc 3's synthetic 1.6× and far above anything in F13. A reader cannot tell whether 38% is high.
  - (c) Doc 3 L1 requires the scheduled-bill and misclassification checks to have *passed* before a pattern is shown. Listing them as "cannot rule out" means the card shows a pre-L1 number.
  - (d) "Not yet a stable trait" is trait language that Doc 3 L2 forbids, and it suggests a trait may follow.
  - (e) A two-month before/after test is what Doc 3 §4.5 Step 8 calls underpowered (power ≈ 0.23 at six months for a 15% effect). A standing transfer cannot be withdrawn, so Doc 3 §4.6 item 2 calls for a multiple-baseline design, not before/after. Doc 3 §4.7 also forbids "this nudge worked" after fewer than 12 alternations.
  - (f) Doc 8's ■■■ "Supported explanation" level is triggered by "Doc 3 grade E1–E2 with the specific study cited". That mixes up the grade of the *literature* (E-scale) with the evidence *for this user* (L-rung). Under Doc 8's rule a pattern can reach the top level only because the payday literature is E1, before any of this user's alternative-explanation checks have run.
- *Fix:* Doc 3 should own one machine-readable construct specification (window, statistic, interval, gates, permitted template). Doc 8's card should render it. Map Doc 8's three-square indicator one-to-one onto L0–L3 and drop the E-grade trigger. Show only alternatives that remain *after* the mandatory checks, and state which checks were removed and how much each explained ("bills: 93% of the raw spike, removed"). Replace the Journey 4 offer with Doc 3 §4.6 eligibility or with B-class "adopt as a decision" wording (see M2).

### Major

**M1 · Doc 3 §8 recommendations 1–3, five-question column · The answers to questions 1 and 5 are not credible as written.**
- Rec 1 (claims ladder). Q3 cites "E1 on replication fragility". Evidence that the literature is fragile does not show that a ladder improves decisions or trust; the ladder is an E4/E5 design. Q5 ("zero untemplated sentences; founder-rated usefulness") is a compliance check plus an unthresholded rating.
- Rec 2 (L0/L1 measures). Q3 grades "E1–E2", but F21 is E3 press reporting and F14 is US card data. Value for this founder is E6 until his recurring charges and fees are measured. Q5 lists states ("concentration vs benchmark"), not changes, with no baseline or target.
- Rec 3 (payday response). Q1, "the one behavioural regularity with E1 field support", is evidence, not a problem. Q5, "pattern reported with interval", is an output.
- *Planner's view:* timing spending within a cycle has almost no cost. Doc 3 §4.5 Step 5(c) shows within-cycle price drift is about 1.1% a month, and with 14.6% inflation buying early is, if anything, slightly cheaper. The ratio matters only if it causes end-of-cycle overdrafts, high-cost borrowing, missed contributions or broken buffers.
- *Fix:* restate Q1 and Q5 in money and decisions. Example for Rec 3: "Problem: end-of-cycle shortfall costing ₦X in fees or borrowing, or a contribution skipped in Y of 6 cycles. Success: shortfall days and fee cost fall to target." If the founder's data show no shortfall cost, downgrade Rec 3 to *Later*. Keep the analysis pipeline as a guardrail against false "splurge" alarms, which is its real value (§4.5 Step 1, 8.03× naïve against 1.60× true).

**M2 · Doc 3 §4.6 and §8 Rec 5 · One user is unlikely to sustain the 12-month pilot, and it would most likely end inconclusive.** Doc 3's own power figures are 0.41 at 12 months for a 15% effect, and nudge-typical effects are about 8% relative (S145, re-verified). I re-ran the simulation and the numbers reproduce exactly. Its noise model is optimistic, though: daily i.i.d. lognormal with σ = 0.45, no zero-spend days, perfect classification.
- With σ = 0.9 and 30% zero-spend days (a reviewer E5 sensitivity case; not real data), power to detect the payday pattern itself at 1.45× falls from 0.89 to 0.32 at six cycles and from 0.97 to 0.43 at twelve. A 1.3× pattern falls to 0.24 and 0.34. The test's false-positive rate held at 0.05–0.07, so the test is valid; it just has little power.
- The pilot also faces threats the document does not price in:
  - *Reactivity.* Levi & Benartzi (S76, re-verified) find that installing a monitoring app *by itself* lowers discretionary spending, so the baseline is contaminated.
  - *No blinding.* The founder designs, delivers and evaluates the test.
  - *Carry-over.* A learned "payday plan" does not switch off in B months, which breaks the ABAB reversibility assumption.
  - *Upload burden.* There is no open banking (Doc 6 F37), so 12 months of manual multi-bank uploads and review-queue work are needed, plus Doc 3 §9's 95% matching and 90% labelling gates.
  - *Calendar confounds.* Ramadan, December and school terms fall into one arm of only six pairs.
- *Fix:* do not run the prompt ABAB in the personal MVP. If the founder wants the auto-sweep, adopt it as a *decision* and track the savings rate and end-of-cycle buffer at L0. The sweep's effect on saving is mechanical, so no inference is needed. Keep §4.6 as a specification for the commercial phase, where between-person randomisation becomes possible.

**M3 · Doc 3 §8 Rec 4, §3D and §9.5, against the founder's "do not overwhelm with questions" rule and Doc 8 P1 and §5 · Too many questions.**
- *Year-one count from Doc 3 alone:*
  - Onboarding: SOEP (1) + Big Three (3) + fragility item (1, possibly in three currency versions) = 5–7 items.
  - Four-week retest under §9.5, adding the CFPB-10: another 15–17.
  - Quarterly CFPB-10: 40.
  - §9.2 classification audit: 200 labels.
  - Counterparty tagging for obligation and hedge; user-set envelopes for mental budgets; optional DOSPERT, Grable–Lytton (13), Propensity to Plan (12), CFC (12), and debt-literacy follow-ups.
  - Core total ≈ 60–64 questionnaire items plus about 200 labels, *before* Doc 6 §4.4's yearly residency questionnaire (about 17 items) and Doc 8's Phase-1 instruments (SUS, UMUX-Lite, Single Ease Question, two diary questions a day for eight weeks).
- *Low information value:*
  - The Big Three has a ceiling for a founder building a financial operating system (Doc 3 F23 concedes this). Asking him is uninformative and mildly patronising.
  - The fragility item duplicates the L0 liquidity buffer except for off-ledger resources.
  - The CFPB scale's metric SD is 15 (technical report §5.2.1, read 2026-11-04) and marginal reliability is 0.89. That gives a standard error of measurement ≈ 15·√0.11 ≈ 5.0 and a 95% minimal detectable change ≈ 1.96·√2·5.0 ≈ 14 points. These are reviewer calculations, and IRT error is larger near the ceiling, where this founder probably sits. Quarterly changes under about 14 points are noise, and a quarterly measure cannot serve as the outcome of a *monthly* ABAB (§4.6 item 3).
- *Contradiction:* Doc 8 rejects "questionnaire-first onboarding (profile, goals, risk quiz before data)" (§5), and its §4.3.4 schedules none of Doc 3's instruments.
- *Fix:* ask the SOEP item once, when the first portfolio benchmark is shown, under Doc 8's just-in-time rule. Use the CFPB 5-item short form (r = 0.94 with the 10-item form, per S119) once a year. Drop the Big Three and the fragility item for the founder. Fold the 200-label audit into the review queue, so that the correction rate (Doc 8 §4.3.3) becomes the quality metric. Year-one core falls to about 6–12 items.

**M4 · Doc 3 F17 rule and §4.2 FX row, against Doc 6 F4, F13 and §7 item 3 · Treating payday FX purchases as hedging by default is too broad and ignores tax.**
- *Claim:* "any payday-window outflow to FX … is classified as hedging/committed … before any behavioural statistic is computed", and dollarisation is "the rational response", making it a "minimum-variance portfolio choice".
- *Why it is weak:* minimum variance depends on the currency of the user's *liabilities*. If rent and school fees are in NGN, holding USD adds risk against them. Ize & Levy Yeyati (S101) is a deposit-dollarisation portfolio model, not evidence about a given person's conversions, so this is E4 at best. Round trips also cost the official–parallel spread (₦1,346.91 against ₦1,385–1,390 on 29–30 October 2026; page re-fetched). And Doc 6 reads NTA s.34(1)(b) as making foreign currency a chargeable asset, so conversions back to NGN may realise taxable gains.
- *Fix:* classify these flows as "currency conversion" (not as exempt hedging). Report conversion cost, the tax flag from Doc 6's rule `NG-CGT-FOREIGN-ASSETS-2026`, and the currency mix against stated liabilities. Keep them out of the *discretionary-spending* statistic, as now.

**M5 · Doc 3 §3–§6 (absent), Doc 6 F38–F40 and §4.6, Doc 8 F15 and §4.5.13 · No privacy design for behavioural inferences.** Provisions below were read in the NDPA 2023 text as passed (certified bill copy hosted by PLAC, rendered page by page on 2026-11-04) unless marked otherwise.
- **Scope.** s.3(1) exempts processing "solely for personal or household purposes", with the proviso that it must not violate the fundamental right to privacy. That covers the founder's own use. Doc 6 §4.6 says the Act applies formally "once a second person's data is processed". That is imprecise: the founder's ledger already holds third parties' data (named family recipients, their account numbers). The real trigger is a controller other than the founder, such as the company or a cloud processor. Whether a processor serving household use is covered is **unverified** (E4); counsel to confirm.
- **Profiling.** The NDPA does not define "profiling". The s.65 definitions run from "processing" to "pseudonymisation" with nothing between them. But s.27(1)(g) requires notice of "automated decision-making, including profiling", and s.37(1) gives a right not to be subject to solely automated decisions, including profiling, with legal or similarly significant effects. Doc 3's constructs evaluate personal aspects of a person, so they are profiling in the ordinary sense. They trigger s.37 only if they drive decisions; the auto-sweep and intervention eligibility come closest. The consent exception in s.37(2)(c) applies, with the s.37(3) safeguards (human intervention).
- **Sensitive data.** s.65 lists religious or similar beliefs, health status, ethnic origin and political affiliation. s.30(1)(a) requires consent "for the specific purpose". Doc 3 §4.3 explicitly models Ramadan and Eid seasonality. Transaction categories reveal tithes and zakat, pharmacy and hospital spending, party dues, and town or ethnic-union levies. For the UAE, DLA Piper's PDPL summary (fetched 2026-11-04) defines sensitive personal data as data that "directly or indirectly reveals a natural person's family", among other categories. F18's tagging of transfers to named kin is therefore sensitive-data processing. The PDPL article numbers and any household exemption could not be read from the primary text (uaelegislation.gov.ae returned HTTP 403): **unverified**. Doc 6 F40 ("financial data not sensitive") is right about raw balances and wrong about inferences drawn from them.
- **Purpose limitation and lawful basis.** s.24(1)(b) and s.24(4)(a) require further processing to be compatible with the original purpose. Ledger and tax data are kept under a legal obligation (s.25(1)(b)(ii); NTAA s.31(5) per Doc 6). Behavioural profiling is a different purpose that needs its own consent (s.25(1)(a), s.26). Doc 3 runs all 15 constructs monthly by default (§4.3). Its opt-in covers interventions only, and Doc 8's first-upload consents cover only analytics and cloud parsing.
- **Retention and erasure.** s.24(1)(d) allows retention only as long as needed; s.34(2) requires erasure once no longer needed or without a lawful basis; s.35(2) requires withdrawal to be as easy as consent. Doc 6 keeps raw statements for at least six years in WORM storage. Doc 8 offers "delete everything". Doc 3 §4.6 keeps the record after withdrawal and stores pre-registration records "in the ledger". Behavioural derivations have no legal-obligation basis and must be erasable without touching the tax vault.
- **Telemetry.** Doc 3's ostrich elasticity needs per-event app-open timestamps linked to that person's returns. Doc 8 §4.9 promises aggregate-only events with no amounts.
- **Fix:**
  - A separate, granular behavioural-analysis consent (off by default, per construct family).
  - A sensitive-inference register. Seasonality should come from user-declared calendar events, never inferred religion. Health, religious and political categories are excluded from behavioural statistics unless consented.
  - Behavioural derivations stored outside the WORM tax vault, with their own retention period (proposed: deleted on withdrawal; otherwise 24 months, E5).
  - Templated sentences filled locally, never sent to a cloud model with counterparty names. Cross-border transfer is governed by NDPA s.41–43.
  - A data protection impact assessment (DPIA) before any second user. Doc 6 F38 says the GAID mandates one for financial services; that comes from a secondary source.

### Minor

- **m1 · §4.2 construct names read as judgements.** "Payday cycle *severity*", "Recurring-charge *inertia*", "*Ostrich* / engagement", "*Under*-diversification", "*Attention-driven* buying", "*leakage*" (prohibited, but still in the vocabulary). Several name a cause the table itself calls a hypothesis: F15 lists "information vs attention" as unresolved, yet the row is called attention-driven. Doc 8 P7 lints only copy, and internal names leak into breadcrumbs (Doc 8 §4.2.3 "Pattern: bills cluster after salary"). *Fix:* use descriptive names ("spending after income arrives", "recurring charges", "app opens after market falls", "buys on high-volume days").
- **m2 · L1 and L2 templates.** "Discretionary" is a system judgement; use "spending in categories you marked as flexible". The Step 7 template says "in most people", a population quantifier without a source. Name the studies or say "in several large bank-data studies (US, Iceland)". "The 'payday effect'" names an effect where a description would do.
- **m3 · Banned-vocabulary lists do not overlap.** Doc 3 forbids "always", "habit", "you tend to", "because you are", "irrational", "overconfident", "present-biased", money-type labels and "leakage". Doc 8's lint list (§4.7) contains none of these. Doc 3 should supply them to the lint list.
- **m4 · F21.** Doc 6 F21 has since read the gazetted Ninth Schedule item 48 and s.184(i): ₦50 paid by the transferor; transfers under ₦10,000, salary payments and intra-bank self-transfers exempt. Doc 3 can upgrade this to E2 and drop "Tax dept to confirm". The ₦60 CBN item stays unverified.
- **m5 · §4.3 gates.** "≥6 cycles for ≥1.3×" is hard-coded from the σ = 0.45 simulation but is not labelled E5. Mark it, and make the gate depend on the observed noise (as §9.3 already intends).

### 2a. Decision map for every L0–L2 measure (planner and operator)

| Measure (Doc 3 §4.2) | Concrete decision it improves | Verdict |
|---|---|---|
| Recurring-charge audit | Cancel or keep each subscription | **Actionable**; keep (value in ₦/AED per year still unmeasured for this founder) |
| Fee, levy and FX-spread drag | Account choice, batching, conversion channel | **Actionable**; keep; add official–parallel spread cost |
| Liquidity buffer by currency | Size and currency of the emergency reserve | **Actionable**; keep; "essential spending" must be user-confirmed |
| Concentration and currency exposure | Rebalancing; currency mix against liabilities | **Actionable** but **owned by System D** (Doc 8 §4.5.7 already specifies it); Doc 3 should only cross-reference |
| Family and obligation account | Setting a planned share; keeping cash for it | **Actionable** as a budget line; privacy-sensitive (M5) |
| FX share within 7 days | Conversion policy | Actionable only with spread and tax (M4) |
| Income-arrival ratio and payday cycle | None directly; only via end-of-cycle shortfall cost | **Interesting, not actionable** unless linked to fees, borrowing or missed contributions (M1) |
| Mental-budget deviation | Budget setting | Actionable only if the user sets envelopes, which adds work; *Later* |
| Disposition PGR−PLR | Sell or hold | Actionable version is a **tax-lot view**, which needs no psychology. Under Doc 6 F13, NGX share gains below ₦150 m proceeds and ₦10 m gain are exempt, so harvesting losses on Nigerian shares usually has no value. It matters for foreign shares taxed at personal rates |
| Turnover and trading cost | Trading frequency | Actionable if the founder trades actively (unknown); report costs in currency |
| Attention-driven buying, rank effect | Weak ("why now" prompt) | **Not actionable**; remove from MVP |
| Ostrich login elasticity | None | **Not actionable**; conflicts with Doc 8 telemetry promise; remove |
| SOEP risk item | Benchmark for portfolio structure | Weak alone; risk-capacity facts (Doc 8 §4.3.4) and goals dominate; keep one item, asked just in time |
| CFPB well-being | Outcome only | Annual 5-item short form; not an intervention outcome (M3) |
| Big Three literacy, fragility item | None for this founder | Remove for the personal MVP |

### 2b. What can be removed without losing value (operator)
- Duplicate inference engines. The payday ratio has a bootstrap interval, a circular-shift test, HAC regression, a Bayesian ROPE posterior *and* an SPC chart. Keep one estimator with an interval (circular-shift, as validated above) and the cycle-by-cycle table.
- Benjamini–Hochberg control "across 15 constructs". Most rows are L0 arithmetic, not tests; apply it only to the two to four tested constructs.
- Rows to drop for the MVP: ostrich, rank effect and attention-buying; the Holt–Laury, BIS-11, DOSPERT, Grable–Lytton, PtP and CFC instrument rows. Their analysis can stay in §3 as literature.
- The ABAB machinery: pre-registration records, randomised pairs and harm-stopping rules (M2).
- Concentration rows that duplicate System D.

What remains is the claims ladder, the prohibited-output list, the transfer and obligation separation, recurring charges, fees and spreads, the buffer, and one guarded payday decomposition. That is perhaps 30% of the specified surface, and in our judgement (E4) nearly all of the decision value.

## 3. Evidence-grade audit

| Location | As graded | Problem | Proposed grade |
|---|---|---|---|
| F25 Fisher et al. + Molenaar | E1 | One study (six datasets) plus a conceptual manifesto; the brief defines E1 as replicated or meta-analytic | E2 (Fisher); E3 (Molenaar) |
| F26 reminders (Karlan et al., three banks) | E1 | One peer-reviewed paper | E2 |
| F27 DellaVigna & Linos | E1 | One study, though very large (126 RCTs) | E2 by the brief's definition; still the best point estimate |
| §4.8 questionnaires (SOEP, CFPB, Big Three) | E1 | CFPB development is one official report (Doc 3 itself grades S119 E2); no Nigeria/UAE norms; no test–retest in the technical report | E2 psychometrics; E6 for use with this founder |
| §8 Rec 2 | "E1–E2" | F21 is E3; F14 is E2 US data | E2–E3; E6 for founder value |
| F17 "minimum-variance … not present bias" | stated as fact | Depends on liability currency; S101 is a macro portfolio model | E4 |
| F13 → Rec 3 "E1 field support" | E1 | E1 for US and Iceland panels; transfer to a Nigeria–UAE salaried founder untested (R5 concedes) | E1 phenomenon; E6 applicability |
| §4.3 minimum-sample gates | ungraded | Derived from one noise assumption | E5 |
| F28 implementation intentions d ≈ 0.65; F26 SMarT 3.5%→13.6% | flagged as recalled | Correctly flagged; I also could not retrieve either abstract (OpenAlex has no abstract for S148 and a truncated one for S140; Semantic Scholar returned HTTP 429) | Remain unverified |
| S104 NFEM rate | "search result only" | Page re-fetched and matches (₦1,346.91 on 29 Oct 2026) | Upgrade status to verified (E3) |

Claims presented as fact without a source: "Bank-data studies find a similar after-income pattern in most people" (§4.5 Step 7); "Ramadan/Eid timing shifts ~11 days a year" (true astronomically, but unsourced); "school fees in January/May/September" (a Nigerian calendar assumption; founder to confirm).
