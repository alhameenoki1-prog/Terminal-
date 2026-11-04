```
Document: 03 — Scientific Behavioural Finance Research Report
Department: Behavioural Finance, Psychology and Decision Science  ·  Lead role(s): Chief Behavioural Science Officer; behavioural-finance researcher; academic cognitive psychologist; decision scientist; behavioural economist; consumer financial-psychology specialist; psychometrician; experimental-design specialist
Version: 0.2 · Date: 2026-11-04 · Status: revised after independent review
Reviewers required: Data & Personal Finance Architecture (System A); Quant/Portfolio (System D); AI Research & Explanation (System H); UX & Product Design; Legal/Compliance & Ethics, including a Nigerian data-protection lawyer and UAE counsel (§4.9); Tax (F17 foreign-currency flag only)
```

# Document 3 — Scientific Behavioural Finance Research Report

## 1. Executive summary

**Conclusions first.** Records show what a person did and, after checks, some regular patterns. They cannot show why, and for one person they cannot show whether a nudge-sized intervention worked. Review found three overstatements in v0.1, all accepted. (1) The power analysis did not match the randomisation. With order randomised within pairs of pay cycles, six months can never reach p < 0.05; twelve months gives power 0.36 for a 15% effect (0.13 with lumpier spending). (2) The best-evidenced interventions (auto-sweeps, auto-conversion, trade friction) need automated transfers or order routing, which Doc 4 R13 rules out. Remaining informational prompts have a bias-corrected finance-domain effect of 0.00 (Maier et al.). (3) The ladder let findings about other people pass as explanations of this person.

**What we now recommend.**
1. A claims ladder with two observed rungs (recorded, classified), a literature-context rung that never raises the evidence indicator, and a rung for within-person randomised results. All behavioural text comes from rung-tagged templates via C2 tokens.
2. Personal MVP: decision-linked measures only — recurring charges; fees, levies and conversion cost; liquidity buffer by currency; currency conversions with spread and tax flags; a user-confirmed obligations view.
3. The payday decomposition guards against false "splurge" alarms (8.03× naïve versus 1.60×). It becomes a decision measure only if the founder's data show an end-of-cycle shortfall cost.
4. No within-person trial in the MVP. A standing order the founder sets up at their bank is tracked at L0 as a decision.
5. Year-one questionnaires: 64 items cut to 7.
6. Behavioural analysis gets its own off-by-default consent, a sensitive-inference register, separate retention, and a data-protection impact assessment before any second user.

**Biggest uncertainty.** Whether behavioural analysis improves any decision for this founder. That depends on facts we lack: their pay cycles, any shortfall cost, their trading frequency.

## 2. Scope and method

**Questions addressed.** (A) Which behavioural-finance theories are strong enough to build on, and what are their current critiques and replication status? (B) What can bank and brokerage transaction data legitimately reveal, following the five-level distinction in the context brief §6? (C) Which alternative explanations and confounders are specific to a Nigeria–UAE multi-currency life? (D) Which measurement instruments are validated, with what psychometrics, and when do they add information beyond behaviour? (E) What statistics are defensible for one person observed over time? (F) Which interventions have evidence, with what effect sizes, and how should they be tested ethically? (G) What concrete framework, catalogue, claims ladder, worked example and prohibited outputs should Portfolio OS adopt?

**What we searched and read.** Reference verification for 171 academic works was performed against OpenAlex and Crossref by Digital Object Identifier (DOI) on 2026-11-02; the primary abstracts of about 110 of them were retrieved from OpenAlex, Semantic Scholar and Europe PMC so that every headline number quoted in §3 comes from the paper's own abstract rather than memory. Web searches (eight queries before the shared search budget was exhausted) and direct page fetches covered the time-sensitive facts: the Nigerian National Bureau of Statistics (NBS) Consumer Price Index (CPI) release for September 2026, the Nigerian Foreign Exchange Market (NFEM) rate in late October 2026, the ₦50 electronic-transfer stamp duty effective 1 January 2026, the EFInA Access to Financial Services in Nigeria (A2F) 2023 headline figures, and the Consumer Financial Protection Bureau (CFPB) scale technical report (full PDF read). A synthetic six-month ledger was generated and analysed in Python (numpy/pandas only — scipy and statsmodels were not installed) to produce the worked example in §4.5; the script and data are synthetic and reproducible.

**Tools and their limits (disclosure).** The reference-lookup MCP tools named in the brief timed out for every call on 2026-11-02 because the shared, unauthenticated OpenAlex budget on this network was exhausted; the coordinator then authorised direct DOI look-ups against the OpenAlex API, which succeeded for 170 of 171 items (Crossref was used to resolve DOIs that were initially wrong, and several items were corrected as a result — nine initial DOIs pointed to different papers and were replaced). On 2026-11-04 the hosted verify tool worked for DOI-based calls (5 of 7) and confirmed the same OpenAlex records; title-only searches still timed out. Verification status in §10 is therefore reported as **[verified: OpenAlex DOI]** (title, first author and year matched), **[verified: Crossref]** or **[unverified]**. One classic citation, Ariely & Wertenbroch (2002) on self-imposed deadlines, is flagged **RETRACTED** in the publisher metadata and is cited only to warn against relying on it. Two things we could not access: the full EFInA 2023 report (server error; headline figures taken from Nigerian News Agency coverage of the launch) and the Central Bank of Nigeria (CBN) April 2026 fee circular (search snippet only; treated as unverified). The web-search budget ran out before African evidence on disposition effects or Nigerian retail-investor studies could be searched; we flag that gap rather than fill it from memory. No Google Drive or Gmail content was read; nothing under `src/` was modified.

**Revision method (v0.2, 2026-11-04).** We read reviews R03 (academic) and R03b (cross-functional), revision-log rows V-007 and V-024 to V-030, the context brief v0.2 and `CANONICAL_CONTRACTS.md` (C1–C7, binding). We re-ran `research/behavioural/payday_sim.py` under `python3 -I`; it reproduced the stored ledger byte for byte. Every number that changed in this version comes from a new script, `research/scripts/doc03_revision_checks.py` (numpy and pandas only; fails loudly otherwise; sections A–N are cited in the text as "script §X"). Facts we changed were re-checked on 2026-11-04:
- *Crossref API:* S151 authors; S47 date; the Mertens et al. correction and reply; Bakdash & Marusich; Jachimowicz et al.; Walasek et al.; Adolf & Fried; the SCRIBE statement; Edgington & Onghena; the S160 retraction notice.
- *Hosted reference-lookup tool (verify by DOI):* Walasek et al.; Jachimowicz et al.; the Mertens reply; Adolf & Fried; SCRIBE; S151. For S151 the tool matched a merged OpenAlex record that carries the trial-registry author list. That record is the source of v0.1's author error, so Crossref governs.
- *Web pages and documents:*
  - Maier et al., PMC full text, Table 1: the finance-domain and category results.
  - NBER w27057 abstract (Kaiser et al.).
  - CFPB technical report, PDF text extracted: the score metric is IRT × 15 + 50, and no test–retest result was found. The CFPB scale landing page states no licence terms.
  - Global Preference Survey downloads page: licence terms, and the country questionnaires for Nigeria and the UAE.
  - Nigeria Data Protection Act 2023: the DataGuidance-hosted copy of the Act text. We read ss. 3, 24, 30, 35 and 37 and the s.65 definition of sensitive personal data. The PLAC certified copy is an image-only PDF.
  - DLA Piper's UAE summary: the PDPL definition of sensitive data. This is secondary; the primary text was not reached.

*Count correction (R03 m3):* v0.1 said 171 works were verified, but §10 listed 166 entries, of which 157 are academic. The 171 counted DOI look-ups, including nine wrong DOIs that were later replaced. v0.2 adds 13 entries (S167–S179), 8 of them academic.

**Not re-checked in this pass:**
- the Save More Tomorrow (S140) and implementation-intention (S148) magnitudes;
- NBS core inflation (PDF not fetched);
- the TechCabal pages (S106);
- licence terms for DOSPERT and Grable–Lytton (searched; no licence statement found);
- the UAE PDPL primary text;
- the NDPA gazetted text, compared with the copy we read.

**Evidence grades** follow the brief: E1 replicated/meta-analytic, E2 single peer-reviewed study or official publication, E3 authoritative institutional/practitioner source, E4 expert judgment (discipline stated), E5 engineering assumption with a test, E6 speculative concept with the validating evidence named.

## 3. Findings

Each finding states the evidence grade, the source numbers (see §10), and — where it bears on the product — which rung of the claims ladder (§4.1) it supports.

### 3A. Theoretical foundations, evidence strength and current critiques

**F1. Prospect theory's choice patterns replicate; its parameters are not portable to an individual.** Kahneman & Tversky (1979) and the cumulative version (Tversky & Kahneman 1992) describe reference dependence, diminishing sensitivity, loss aversion and probability weighting [S1, S2]. A pre-registered 19-country replication (N = 4,099) reproduced 94% of the 17 original choice items and 12 of 13 theoretical contrasts, with attenuated magnitudes [S3] — **E1** for the qualitative patterns. Barberis's review documents that applying the theory outside the laboratory requires auxiliary assumptions about what the reference point is and how outcomes are bracketed, which is where applications fail [S4, S165] (**E3**; S165 sets out the bracketing problem). *Product implication:* the system may use reference dependence to *frame hypotheses* (for example, "purchase price appears to act as a reference point in your selling decisions") but may not estimate a personal value-function curvature from transactions; there is no identified estimator for that from spending data.

**F2. Loss aversion exists on average but its magnitude and generality are contested.** A 2024 meta-analysis of 607 estimates from 150 articles places the mean loss-aversion coefficient at 1.955 (95% interval 1.820–2.102) [S8] (**E1** that the pooled average exceeds 1). A second meta-analysis, restricted to cumulative-prospect-theory λ fitted to individual choices between mixed gambles, finds λ = 1.31 (95% CI 1.10–1.53) and reports that "much of the data are of poor quality" [S167] (abstract as indexed by OpenAlex for the published DOI; checked 2026-11-04). The magnitude therefore runs from about 1.3 to 2.0 depending on the elicitation method (**E2–E3** for magnitude; R03 M5). Against this, Gal & Rucker (2018) argue that the evidence does not support losses being generally more impactful than gains [S5]; Walasek & Stewart (2015) show loss aversion can be made to disappear or reverse by changing the distribution of gains and losses people sample from, supporting a decision-by-sampling account [S6]; Mrkva et al. (2020; N = 17,720 across five samples) find loss aversion present at all knowledge levels but moderated by domain knowledge, experience and age [S7]. The endowment effect and status quo bias are the classic field manifestations [S9, S34]. *Grade for the construct:* **E1 that an asymmetry exists on average; E2–E4 on its size for any given person and context.* *Product implication:* never assign an individual a loss-aversion coefficient; the construct's moderators (experience, stake size, context) are precisely the things that vary within one person's financial life.

**F3. Mental accounting and mental budgeting have strong field support from transaction data — and known side effects.** Thaler's framework [S10, S11] and the behavioural life-cycle hypothesis [S12] predict non-fungibility across labelled accounts. Field tests using panel transaction data reject fungibility: households substitute to lower-grade petrol when prices rise beyond what income effects explain, best fitted by category budgeting [S14]; the marginal propensity to consume food out of US SNAP benefits is 0.5–0.6 versus much lower out of cash, even for households for which the benefit is economically equivalent to cash [S15]; small windfalls (a grocery coupon) raise spending on items not previously purchased [S16]; consumers set category budgets and under-consume typical items late in the budget period [S13] (**E1** for non-fungibility; multiple independent designs). Side effect: earmarked savings can be *over-protected* — people borrow at high interest rather than draw on savings labelled for a goal, believing it the responsible choice [S17] (**E2**, six lab studies). Recent reviews of budgeting behaviour confirm that budgeting is common, imprecise and category-based [S161] (**E3**). *Product implication:* labelled sub-accounts and "envelopes" are evidence-backed tools, but the product must warn when a labelled buffer is being protected at the cost of expensive debt.

**F4. Present bias is real in effort and consumption, small in money-earlier-or-later choices, and predictive of credit behaviour.** Quasi-hyperbolic discounting [S18, S19] motivates commitment products. Measurement has matured: the convex-time-budget meta-analysis of 220 estimates from 28 studies finds people present-biased on average with large heterogeneity, modest selective reporting toward *over-reporting* bias, and reward type (monetary versus non-monetary) as the main moderator [S21]; money-dated choices show "very limited time inconsistency" while real-effort choices show considerably more, and effort-based present bias predicts demand for commitment [S22]; the JEL review by Cohen, Ericson, Laibson & White explains why money-earlier-or-later choices measure required rates of return on financial flows rather than pure time preference [S20] (**E1** for the phenomenon; **E2** for any specific parameter). Field correlates: incentivised present-bias measures predict having and holding more credit-card debt, controlling for income and credit constraints [S23]; account-level data show present-biased planning in credit-card pay-down [S24] (**E2** each). *Product implication:* the product may test for behavioural signatures *consistent with* present bias (spending that front-loads after income, repeated deferral of planned contributions) but must not infer a discount parameter; and it must check the rational alternatives in F15 first.

**F5. Overconfidence and excess trading: strong brokerage evidence, mechanism partly inferred.** Among 66,465 US discount-brokerage households (1991–1996), the most active quintile earned 11.4% a year against a market return of 17.9%; the average household turned over 75% of its portfolio annually [S25]; men traded 45% more than women and trading reduced men's net returns by 2.65 percentage points a year versus 1.72 for women [S26]; Odean (1999) showed stocks bought underperformed stocks sold even ignoring costs [S27] (**E1** for the turnover–performance relation; **E2** for overconfidence as *the* explanation, since gender is a proxy). *Product implication:* turnover, and the realised return of positions bought versus sold, are directly observable and may be reported as facts with costs attached; "overconfidence" is a hypothesis label, not a finding.

**F6. The disposition effect is robust; its cause is not.** Shefrin & Statman named it [S29]; Odean (1998) measured it in 10,000 accounts as a higher proportion of gains realised (PGR) than losses realised (PLR), not explained by rebalancing, trading costs or subsequent performance, and tax-suboptimal except in December [S28] (**E1** for the pattern; replicated in Sweden's full-population wealth data [S33]). Ben-David & Hirshleifer (2012) find the probability of selling is V-shaped in profit — at short holding periods investors are *more* likely to sell big losers than small ones — with no jump at zero, which "provides no clear indication that realization preference explains trading" and points to belief revision instead [S30]. Hartzmark (2015) shows people sell their extreme best and extreme worst positions ("rank effect"), driven by salience of portfolio rank rather than the return level [S31]; Frydman & Rangel (2014) reduce the effect experimentally by making purchase price less salient [S32] (**E2** each). *Product implication:* report PGR−PLR with holding-period conditioning and the V-shape check; attribute to "a pattern consistent with several documented tendencies (realisation preference, belief updating, rank salience)" rather than to "loss aversion".

**F7. Framing, anchoring, salience and attention: well-established in choice experiments, measurable in investing, hard to measure in spending.** Framing and anchoring come from the heuristics-and-biases programme [S36, S37, S164]; salience theory formalises overweighting of salient payoffs [S40]. Attention-driven buying is directly measurable: individual investors are net buyers of attention-grabbing stocks (news, abnormal volume, extreme returns) [S38], and intense buying by Robinhood users forecasts negative returns (average 20-day abnormal return −4.7% for the top stocks bought each day) [S39] (**E2**: two papers from overlapping author groups; regraded per R03 §3). Selective attention to finances ("ostrich effect") is measurable from login data: logins fall 9.5% after market declines [S54, S55], and in bank data attention decreases discretely as balances go negative [S56] (**E2**, two independent datasets). *Product implication (v0.2):* not built. While the only user is the developer, app opens reflect building and testing, and product notifications make them endogenous. Per-event telemetry also conflicts with Doc 8's aggregate-only events. Attention-driven buying informs no decision for this user (§4.2, §4.7).

**F8. Pain of paying and payment mechanism.** Prospective accounting of debt versus consumption [S41], higher willingness to pay with cards than cash [S42] and reduced spending salience under less transparent payment modes [S43] are **E2** (lab and field-experiment) findings; the magnitude in cash-light, transfer-heavy Nigerian and UAE payment environments is unknown (**E6**: validate with the founder's own card-versus-transfer split before using).

**F9. Financial literacy: strongly correlated with outcomes; the size of education effects is disputed.** The "Big Three" questions (compound interest, inflation, diversification) show widespread illiteracy worldwide and predict retirement planning [S44, S45] (**E1** correlational). The Fernandes et al. meta-analysis of 201 studies finds financial-education interventions explain 0.1% of variance in downstream behaviour, decaying to negligible effects 20 months out, with stronger associations in correlational studies that shrink when psychological traits are controlled [S46]; the 2022 meta-analysis of 76 randomised experiments with over 160,000 people (Kaiser, Lusardi, Menkhoff & Urban) finds positive causal effects on knowledge and downstream behaviours, "at least three times as large as the average effect documented in earlier work" (NBER w27057 abstract, re-fetched 2026-11-04) [S47]. The two meta-analyses disagree. Fernandes et al. pool correlational and experimental studies and read the effect as small and decaying. Kaiser et al. restrict to randomised trials and read it as similar to educational interventions in other domains. Both are **E1**; we do not choose between them (R03 M10). *Product implication (v0.2):* boosting (F29) deserves a fair hearing now that most nudges are out of scope (§4.6), and just-in-time explanation is retained. The Big Three are not administered to the founder, because a sophisticated user hits their ceiling (§4.2).

**F10. Household finance as a discipline: the normative benchmark matters.** Campbell's address frames household finance as the study of how households *should* and *do* invest; most households are reasonably sensible, a minority make costly mistakes (non-participation, under-diversification, failure to refinance), and mistakes concentrate among the less educated and less wealthy [S48] (**E3**, presidential address synthesising E1/E2 work). Under-diversification is directly measurable in brokerage data and costly to most investors [S52]; naïve 1/n allocation [S51] and home bias [S53] are measurable allocation patterns; financial decision quality peaks in the early fifties [S62]; exponential-growth bias predicts borrowing and saving behaviour [S61]; debt repayment follows a balance-matching heuristic rather than interest-rate ordering [S63] (**E2** each). *Product implication:* the cheapest high-value behavioural outputs are *portfolio-structure facts* (concentration, currency mismatch, cost drag) checked against a stated benchmark, not psychology.

**F11. Myopic loss aversion and evaluation frequency.** More frequent evaluation of returns increases risk aversion in experiments [S49, S50] (**E1** in the lab). For a product this cuts both ways: showing daily portfolio profit-and-loss may raise anxiety and trading; the product should let the user choose the evaluation horizon and should default long-horizon views for long-horizon goals (**E4**, behavioural economist; not testable for one person at useful power, so it is a default, not an experiment; a between-person test is possible at commercialisation, §4.6).

**F12. Replication context and "scarcity" claims.** Replication rates were 36% for psychology [S57] and 61% for economics laboratory experiments [S58]; replicated effects averaged about half to two-thirds of originals. The "poverty impedes cognitive function" result [S59, S108] sits in a literature where an empirical audit of 20 scarcity-priming studies found "some strong successes and other undeniable failures" [S60] (**E1** for the audit; **E2–E4** for scarcity effects). *Product implication:* claims about *why* the user behaves as they do should carry a lower grade than the original paper's by default; our grading applies a one-notch discount to any mechanism claim not replicated in field data. v0.2 applies it in F28 and §4.8 (R03 m7).

### 3B. What transaction data can and cannot reveal

**F13. Spending responds to the arrival of anticipated income, but much of the "spike" is scheduled spending.** Gelman et al. (2014), using a personal-finance-app panel, find a spending response to anticipated income, but "this apparent excess sensitivity of spending results largely from the coincident timing of regular income and regular spending", with the remainder concentrated among the less liquid [S64]. Olafsson & Pagel (2018) find payday responses that are "robust and homogeneous for all income and spending categories throughout the income distribution", including among people with ample liquidity — the "liquid hand-to-mouth" [S65]. US Social Security recipients spend more in the days after the cheque [S66]; recipients without savings consume 25% fewer calories in the week before the cheque than the week after, while those with savings smooth — about a quarter of the sample [S70]; food-stamp recipients' intake declines over the benefit month [S69]. Alaska dividend recipients show an MPC of about 25% for nondurables within a quarter, *rising* with income and driven by liquid high-income households [S68]. Households spend out of expected tax refunds yet smooth when making expected tax payments — an asymmetry inconsistent with pure liquidity constraints and "most consistent with a mental accounting life-cycle model" [S67]. Spending drops sharply at the predictable exhaustion of unemployment benefits [S71]; consumption elasticity heterogeneity is explained entirely by credit and liquidity in linked-account data [S72]. **E1** (multiple independent transaction datasets, consistent direction). *Five-level reading:* (i) observable — spend by day relative to pay date; (ii) measurable — the ratio and its confidence interval after removing scheduled payments; (iii) supported explanation — a *mix* of liquidity constraints, mental accounting and bounded attention, with the mix differing by person; (iv) hypothesis — which mechanism dominates for this user; (v) not establishable — a discount factor or a "self-control score".

**F14. Attention, fees and recurring charges are among the most tractable targets.** Survey-induced attention to overdraft fees reduces overdrafts for up to two years, by fewer low-balance debit transactions and cancelled recurring withdrawals [S73] (**E2**, quasi-experimental). Card-replacement months, which force active renewal, show much higher subscription cancellation; inertia roughly doubles seller revenue [S74] (**E2**, large payment-network data). Adopting a mobile aggregation app reduced non-sufficient-funds fees — "an unambiguous welfare improvement" [S75]; after installing a mobile app, consumers cut discretionary spending, more so in the evening and among those with lower self-control proxies, consistent with a monitoring channel [S76] (**E2** each; the Levi & Benartzi paper is now in the *Journal of Finance*, 2026). *Product implication:* a recurring-charge audit and a fee ledger are directly observable, high-value and ethically unproblematic.

**F15. Retail investor behaviour from brokerage records: what each metric can carry.** Table 1 applies the five-level test to the standard metrics.

| Metric (from records) | Directly observable | Statistically measurable | Supported explanation | Remains hypothesis | Cannot be inferred |
|---|---|---|---|---|---|
| PGR vs PLR (disposition) [S28, S30] | Realised gains/losses on each sale day against paper gains/losses | PGR−PLR with CI; V-shape by holding period | Realisation preference *or* belief revision *or* rank salience | Which mechanism; tax motive | "Loss aversion coefficient" |
| Turnover, buy-minus-sell return [S25, S27] | Trades, prices, costs | Annual turnover; return of bought vs sold positions net of costs | Costly trading | Overconfidence as cause | "Overconfidence score" |
| Concentration / HHI, 1/n, home bias [S51–S53] | Holdings by issuer, sector, currency | Herfindahl index; share domestic; number of names | Under-diversification | Familiarity vs information | "Risk tolerance" from holdings alone |
| Attention-driven buying [S38, S39] | Buys on days of extreme return/news/volume | Share of buys in top-attention decile | Attention effect | Information vs attention | — |
| Rank effect [S31] | Position rank at sale | Sale probability by rank | Salience | — | — |
| Login/ostrich [S54, S56] | Login timestamps vs returns/balances | Login elasticity to negative returns | Selective attention | Anxiety vs rational inattention | "Avoidance personality" |

Conditions: at least 30–50 sale events for a meaningful PGR−PLR [S28 used thousands of accounts; for one account the CI will be wide — see §4.5 note]; prices and costs with provenance; and NGX/DFM/ADX data validated by System C. *v0.2:* precision at small counts is worse than v0.1 stated: ±0.25 with 20 paper gains and 20 paper losses, and about 58 of each for ±0.15 (§4.5 Step 9). The attention, rank and login rows are literature only and are not built (§4.2).

**F16. Robo-advice and automation change observed behaviour.** Robo-adviser adoption reduced disposition, trend-chasing and rank effects for previously under-diversified investors [S77] (**E2**). This is evidence that *decision architecture* rather than *insight* moves investor behaviour — relevant to §3F.

### 3C. Alternative explanations and confounders specific to the founder's context

**F17. Inflation and depreciation are candidate explanations for fast spending and dollar conversion, not default classifications (revised; V-030).** Nigeria's headline inflation was 14.63% year-on-year in September 2026 (NBS, released 15 October 2026; food 19.59%; month-on-month 0.06%), down from 20.98% a year earlier [S103] (**E2**). The NBS dashboard and Doc 4 show core inflation of 12.95%, while press coverage printed 13.29%. That discrepancy is still unresolved against the NBS PDF. The official NFEM rate was ₦1,346.91 per US dollar on 29 October 2026, with the parallel market at about ₦1,385–1,390, a gap of 2.8–3.2% (script §L) [S104] (**E3**, press tracker; re-fetched by reviewer R03b). Financial dollarisation is a rational *aggregate* response to an inflation-volatile domestic currency [S101] (**E2** for the macro model). Whether converting *within days of receipt* is optimal for one person is a separate question (**E4**). It depends on four things:
- the currency of the person's liabilities: if rent and school fees are in NGN, holding USD adds risk;
- the round-trip spread;
- month-on-month inflation, which was 0.06% in September 2026, so the expected loss from waiting a few weeks is small;
- tax: Doc 6 reads NTA s.34(1)(b) as making foreign currency a chargeable asset (rule `NG-CGT-FOREIGN-ASSETS-2026`).

A rule that always explains a behaviour as rational is as unsupported as one that always calls it bias (R03 M3). *Rule (v0.2):* payday-window FX outflows are labelled **currency conversion**. They are excluded from the flexible-spending statistic and reported as a separate series (§4.2 construct 4), with their cost against the NFEM reference (C1.5), the Doc 6 flag and the currency mix against declared liabilities. "Hedging" is one of several L3 candidates and becomes a tag only when the user confirms it. The other candidates are remittance pre-funding, USD debt service, tuition abroad, travel and speculation. Inflation-linked purchases and pre-payments are handled the same way.

**F18. Family, kin and community obligations are economically large and behaviourally rational.** Pressure to share income is measured as an effective "kinship tax": in Kenyan villages women conceal income at a cost, implying an anticipated tax above 4%, nearly doubling when kin observe income directly [S89]; a third of 361 Kenyan entrepreneurs face distortionary pressure to share, with aggregate productivity losses of about a quarter [S90]; Senegalese experiments show income hiding to avoid informal redistribution [S91]; South African households with more dependants hold non-sharable durables and fewer liquid savings [S92]; Northern Nigerian credit markets function as state-contingent insurance between households [S87, S88] (**E1** across settings for the phenomenon; Nigerian evidence is E2 and from the 1980s–90s). Remittances respond to control and labelling: migrants given more control over home-country accounts saved more without cutting remittances [S96]; matched educational remittances crowded in spending [S97]; reviews [S98]. *Rule (v0.2):* transfers to named individuals, recurring outbound transfers around payday and contributions to ajo/esusu/adashe groups are *candidates* for an "obligation/social" tag. The tag is applied only when the user confirms the counterparty, never automatically, because data that reveal a person's family are sensitive under the UAE PDPL (F30, §4.9.5). Tagged flows are analysed as a separate account with its own baseline, and never as "leakage".

**F19. Informal savings groups (ROSCAs) are commitment devices, not anomalies.** Rotating savings and credit associations protect savings from intra-household and kin claims [S85] and are widespread in West Africa [S86]; EFInA's A2F 2023 reports 64% formal inclusion, 10% informal-only use, and 26% exclusion of Nigerian adults, with a 2026 headline of 79% inclusion announced on 21 October 2026 [S107] (**E2** for the survey; group-level prevalence figures not retrieved). Kenyan health-savings experiments found that simply providing a safe place to keep money raised health savings by 66%, that earmarking helped mainly for emergencies or for people "frequently taxed by friends and relatives", and that group-based schemes had "very large effects" [S80] (**E2**). *Rule:* an esusu contribution is a *saving* with a commitment feature and an implicit negative-to-zero return; the product should compute its implicit cost against formal alternatives but must not call it irrational.

**F20. Commitment and default evidence from emerging markets is strong — and adoption is selective.** In the Philippines, 28.4% of offered clients took a commitment account and treatment raised balances by 81 percentage points after 12 months [S78]; Kenyan market women used accounts despite withdrawal fees and invested more, while bicycle-taxi men did not [S79]; mobile money (M-PESA) protected consumption against shocks for users (non-users' consumption fell 7%) [S82], lifted about 194,000 Kenyan households (2%) out of poverty [S81], and protected consumption after rainfall shocks only for users [S83]; mobile-money savings for Mozambican farmers [S84]; default enrolment in Afghanistan raised participation by 40 percentage points — "equivalent to a 50% match" — driven by present bias and cognitive cost [S94]; being paid into an account rather than cash raised savings 131% in India [S95]; commitment accounts for Malawian farmers raised input use [S100]. But merely opening basic accounts in Uganda, Malawi and Chile produced 17%, 10% and 3% active users and no detectable average effects [S93]. Reviews: [S99] (**E1** for commitment and defaults in low- and middle-income settings; **E2** per country). *Implication:* defaults and commitment are the interventions with the best cross-cultural evidence; "access to information" alone is not. *Feasibility (v0.2):* this evidence concerns products that an institution offers and defaults that an institution sets. Portfolio OS can do neither (Doc 4 R13), so the evidence does not transfer to an in-product intervention (§4.6).

**F21. Transfer levies, fees and data gaps mechanically distort behavioural metrics.** From 1 January 2026 a ₦50 stamp duty applies to electronic transfers of ₦10,000 and above. It is borne by the *transferor* (previously the recipient, under the Electronic Money Transfer Levy), and salary payments and intra-bank self-transfers are exempt. Doc 6 F21 read this in the gazetted Nigeria Tax Act 2025 (Ninth Schedule item 48; s.184(i)), so the grade is **E2**, upgraded from E3 (R03b m4); the press report is S105. v0.1's "CBN guide setting transfers above ₦10,000 at ₦60" is almost certainly the revised Guide to Charges' ₦10 fee for the ₦5,001–₦50,000 band (effective 1 May 2026; Doc 4 F5, **E3**) plus the ₦50 duty. It is a misattribution, not a separate rule (R03 m4) [S106, unverified]. Consequences for measurement: (a) transaction *counts* understate activity if users batch transfers to avoid per-transfer levies; (b) levy lines must be excluded from "spending"; (c) round-number clustering just below ₦10,000 is a fee response, not a budgeting heuristic. Data gaps — cash withdrawals, informal income, point-of-sale agent transactions, inter-account transfers that appear as spending — are the single largest threat to validity; System A must deliver a reconciled transfer-matching layer before any behavioural statistic is shown (**E5**. v0.2 replaces the ">95% of flows matched" target, which cannot be computed without ground truth, with the value-weighted gate in §4.2).

**F22. Preferences differ across countries and within them, and are not fully stable.** The Global Preference Survey (80,000 people, 76 countries) finds "even larger within-country heterogeneity" than between-country differences in risk and time preference [S102]; reviews of test–retest stability show experimental risk and time measures are only moderately stable, with survey measures often more stable [S118] (**E1**). *Implication:* no national prior ("Nigerians are X") is admissible for an individual; v0.2 uses no Bayesian decision rule for one person (§4.3). The GPS fielded its questionnaire in Nigeria (Hausa, Igbo and Nigerian Pidgin versions) and the UAE (Arabic) [S177], so its risk item is a better localisation route than the German SOEP wording (R03 M4; country list verified 2026-11-04).

### 3D. Validated instruments and their psychometrics

**F23. Instruments table.** Grades reflect the published psychometric evidence, not our opinion of the construct. Grade (v0.2): **E2** for US development evidence, which rests on single development reports; **E4** for use in Nigeria and the UAE, where there is no measurement-invariance evidence (R03 §3). v0.2 changes the right-hand column.

| Instrument | Items / format | Reliability | Validity evidence | Limits | Use in Portfolio OS |
|---|---|---|---|---|---|
| SOEP general risk question [S114] | 1 item, 0–10 "willingness to take risks in general" | Single item (no alpha); test–retest moderate [S118] | Behaviourally validated against paid lottery choices; best all-round predictor of stock holding, occupation, smoking in a representative sample | Coarse; context-general | **Adopt**. v0.2: GPS wording of the same item, asked once, just in time, when the first portfolio benchmark is shown, plus one retest. MDC95 ≈ 3.5–4 points (E4 inputs; script §H) |
| DOSPERT [S111, S112] | 30 items (revised), 5 domains, risk-taking/perception/benefit sub-scales | Acceptable per domain (original paper reports construct validity on US undergraduates; revised version extends to broader ages/cultures) | Domain-specificity replicated; within-person variation across domains ~7× between-person | Financial sub-scale only partially investment-relevant; not validated in Nigeria/UAE | Literature only (v0.2); no licence terms found (F23a) |
| Grable–Lytton risk tolerance [S109, S110] | 13 items, multiple choice | Cronbach's α = 0.77 on n = 160,279 (2007–2013) | Scores associated with riskier portfolios | Practitioner-oriented; US norms; 13 items | Literature only in Doc 3 (v0.2). Doc 4 §4.4.4 uses it annually, a disagreement recorded as R15. No licence terms found (F23a) |
| Holt–Laury lottery menu [S113, S117] | 10 paired lotteries, incentivised | Choice-based; sensitive to stakes (risk aversion rises sharply with real high payoffs) | Widely used elicitation | Requires real stakes to be meaningful; noisy per person; inconsistent switching common | **Do not use** for an individual profile |
| Risk preference as trait, general factor R [S115, S116] | 39 measures, N = 1,507, 6-month retest n = 109 | Self-report propensity measures highly reliable; behavioural measures weakly correlated with each other and with self-report | R generalises to real-world risky activities (e.g., smoking) | Behavioural tasks poorly suited to individual assessment | Prefer stated-preference items over tasks |
| Financial literacy "Big Three" [S44, S45] | 3 items (interest, inflation, diversification) | Short-form; no alpha applicable | Predicts planning and wealth after controls | Ceiling for financially sophisticated users | Not administered to the founder: ceiling effect (R03b M3) |
| CFPB Financial Well-Being Scale [S119] | 10 items (5-item short form), 5-point; IRT-scored 0–100 | Marginal reliability ≥ 0.89 (10-item), > 0.80 (5-item); 10–5 item correlation 0.94; developed on 4,500 + 7,899 + 2,000 US respondents | Correlates as expected with financial satisfaction, three-months-expenses savings, ability to raise $2,000, credit quality, collections, hardship | US item parameters; mode effects handled by separate scoring rubrics; not normed for Nigeria/UAE | v0.2: 5-item form once a year, optional and descriptive. **Not** an intervention outcome. The score SD is 15 by construction (IRT × 15 + 50), so MDC95 ≈ 14 points for the 10-item form and ≈ 19 for the 5-item form. No test–retest evidence is reported (script §H) |
| Propensity to Plan [S120] | Two 6-item scales (money, time; short-run and long-run) | Reported as reliable in development paper (abstract unavailable to us) | Predicts credit scores and budgeting | Self-report | Literature only |
| Consideration of Future Consequences [S121] | 12 items | "Acceptable reliability and validity" over seven student samples | Predicts health and financial behaviours in later literature | Student norms; trait-level | Literature only |
| Barratt Impulsiveness Scale BIS-11 [S122] | 30 items, 3 factors | Established factor structure | Clinical/psychology use | Not a financial instrument; risk of pathologising | **Do not use** |
| Financial fragility item [S123] | 1 item: confidence in raising $2,000 in 30 days | — | Predicts hardship | Currency/context adaptation needed | Not administered. It duplicates construct 3 (liquidity buffer), and the "$2,000" anchor is not equivalent across currencies |

**F23a. Instrument licensing (new in v0.2; answers Doc 4 v0.1 §9 item 10, now Doc 4 v0.2 §6, and R03 M4).** Checked 2026-11-04 by simulated specialists, who are not lawyers. Legal must confirm before any commercial use.

| Instrument | Terms found | Personal MVP (non-commercial, founder only) | Commercial (System I) | Grade |
|---|---|---|---|---|
| GPS/SOEP general risk item | The GPS downloads page offers questionnaires and data under **Creative Commons Attribution-NonCommercial-ShareAlike 4.0**. It also requires a citation agreement and forbids transfer to third parties without approval [S177]. The SOEP wording is published in Dohmen et al. [S114] | Use with attribution | The non-commercial licence does not cover it. Get written permission from the GPS team, or write and validate our own wording. Whether one short question can be copyrighted is a legal question | E3 |
| CFPB Financial Well-Being Scale | The landing page and questionnaire PDFs state no licence terms [S178]. As a US federal government work it is likely public domain (17 U.S.C. §105; E4, not legal advice) | Use | Probably usable; confirm | E4 |
| Grable–Lytton 13-item | Published in *Financial Services Review* (1999) [S109]. The University of Missouri hosts it as a free online quiz. No reuse licence found [S179] | Ask the authors | Written permission required | Unresolved |
| DOSPERT | The updated scale carries "© Elke U. Weber, 2003". No licence statement found [S179] | Not administered | Written permission required | Unresolved |
| Big Three literacy items | Published in peer-reviewed papers [S44, S45] | Not administered (ceiling effect) | — | — |

**F24. When a questionnaire adds information beyond behaviour.** Stated preferences and behaviour correlate weakly [S115]; this is not a flaw to be engineered away but a reason to measure both: (a) stated risk willingness tells the product what *benchmark* to judge portfolio structure against; (b) financial well-being is a subjective outcome that balances cannot reveal (a user can be liquid and anxious, or illiquid and content); (c) a planning-propensity measure distinguishes "forgot" from "chose"; (d) literacy tells the explanation layer how much to explain. Questionnaires should be short and asked just in time: the risk item once, when it is first needed, with one retest; well-being at most once a year. They are never used to generate labels (§4.7). v0.2 cuts the year-one core from 64 items to 7 (script §M). **E4** (psychometrician and consumer financial-psychology specialist, jointly).

### 3E. Single-user science

**F25. Group results do not transfer to the individual unless the process is ergodic.** Molenaar's idiographic manifesto [S125] and Fisher et al. (2018) — within-person variance two to four times larger than between-person variance across six repeated-measures datasets — mean that population effect sizes are at best a weak guide, not a prediction, for one person [S126]. Grade **E2**: one study, plus a conceptual manifesto at **E3** (regraded per R03 §3). The claim is contested: Adolf & Fried show that ergodicity is sufficient but not necessary for group-to-individual generalisation [S172]. We keep the cautious reading for one person and record the counter-argument (§5). n-of-1 methods exist to address this: observational and interventional single-case designs (AB, ABAB, alternating treatments, multiple baseline) are catalogued for health behaviour [S127]; n-of-1 randomised crossover trials are an established clinical methodology [S128, S129]; reporting standards (CENT 2015) [S130] and What Works Clearinghouse design standards (minimum three demonstrations of effect, minimum data points per phase) [S131] exist (**E3**). Interrupted time series with segmented regression is the standard quasi-experimental design for a single series with a known intervention date, with explicit handling of autocorrelation, seasonality and an *a priori* impact model [S132, S133] (**E3**). Statistical process control — Shewhart individuals charts and run charts with shift and crossings rules — distinguishes common-cause variation from special-cause change with a controlled false-alarm rate, and is validated by simulation [S134, S135] (**E2/E3**). Multiple-comparison control [S136], the garden of forking paths [S137], low power inflating false discoveries [S138] and Bayesian estimation with explicit priors and regions of practical equivalence [S139] are the relevant statistical safeguards (**E3**). *Defensible confidence language for one person* follows in §4.4.

### 3F. Interventions

**F26. Defaults and automatic escalation: the strongest field evidence.** Automatic enrolment raised 401(k) participation dramatically and anchored contribution rates at the default [S35]; Save More Tomorrow raised savings rates among joiners substantially over successive pay rises [S140] (the abstract was not retrievable; the magnitudes commonly quoted — 3.5% to 13.6% over 40 months — are **recalled, not verified in this session** and should be checked before quotation); emerging-market default results in F20 [S94, S95]. **E1** for defaults. A meta-analysis of default effects [S171] belongs alongside these; it is verified, but its pooled estimate was not re-read in this pass, so no number is quoted. *Feasibility (v0.2):* a default works through the inertia of people who did not choose [S35]. A sweep the user sets up is a commitment device, and the relevant evidence there is selective take-up (F20). Portfolio OS cannot set defaults on accounts it does not operate (Doc 4 R13). Peer-information nudges can *backfire*: telling low savers how many peers participate reduced enrolment among the ineligible-for-auto-enrolment group, by discouragement from upward comparison [S141] (**E2**). Reminders raise commitment-savings attainment, especially when they mention the goal and incentive; gain/loss framing made no difference [S151] (**E2**: one paper, three banks). Reminders for credit-card due dates cut late fees 14% but raised overdraft fees 9%, with net *higher* fees for prior overdraft users [S152] (**E2**) — side effects are real.

**F27. The nudge effect-size debate (revised; V-025, V-027).** Mertens et al. report d = 0.45 (95% CI 0.39–0.52) over 450+ effect sizes and n ≈ 2.1 million [S142]. "Decision structure" interventions (defaults, ordering) outperformed information and assistance nudges, and publication bias was moderate. The paper carries a **publisher correction** dated 4 May 2022 [S168]. The correction records that "the sample of studies analyzed for the meta-analysis included four observations from a paper by Shu et al. (2012) that now has been retracted and contained erroneous values for two observations from a paper by Rohlfs Domínguez et al. (2013) as well as several coding errors". This is the correction text as indexed by OpenAlex; the PNAS page returned HTTP 403. Crossref links the correction to the original article. Three reanalyses followed:
- **Maier et al.** applied robust Bayesian meta-analysis [S143]. Their PMC full text (Table 1, re-read 2026-11-04) gives these bias-adjusted effects:
  - **Finance domain:** 0.00 [0.00, 0.00], with BF01 = 41.2 (30.95 using precise estimates only). This is evidence *against* an effect, not merely absence of evidence.
  - **Information** nudges: 0.00 [0.00, 0.00] (BF01 33.8).
  - **Assistance** nudges: 0.01 [0.00, 0.07] (BF01 9.1).
  - **Structure** nudges, which include defaults: undecided at 0.12 [0.00, 0.43] (BF01 1.12), or 0.23 [0.00, 0.49] using precise estimates.

  Their own rejoinder says the overall Bayes factor is undecided, and that they would retitle the paper "No *overall* evidence" [S163]. The finance domain is where they report evidence of absence.
- **Szaszi et al.** argue that heterogeneity makes a single mean meaningless [S144].
- **Bakdash & Marusich** show left-truncated effects and overestimated pooled means [S170].

Mertens et al. replied to all three [S169]. The earlier Hummel & Maedche review found most studies significant, with widely varying sizes [S146]. DellaVigna & Linos compare 126 Nudge Unit RCTs (23 million people) with academic trials. Nudge Unit trials average 1.4 percentage points (8.0% over control) against 8.7 points (33.4%) for academic trials; selective publication plus low power explains about 70% of the gap [S145]. This is **E2**: one study of two units, regraded from E1. Its outcomes are take-up of government programmes after letters and emails, so it says little about prompts a sophisticated user designs for themselves. Opower-style feedback shows cycles of action and backsliding that attenuate, with effects persisting at 10–20% annual decay after discontinuation [S154]. This is **E2**: one multi-site programme, regraded from E1.

*Working prior for Portfolio OS (v0.2):*
- Informational or reminder prompts in the finance domain should be expected to have **possibly zero** effect.
- Structure interventions such as defaults are undecided after bias correction, and cannot be built here in any case (F26, §4.6).
- Effects decay without reinforcement.

v0.1's "defaults and friction by much more" had no support from its own bias-corrected source and is withdrawn (**E4** at best; R03 B2).

**F28. Goals, implementation intentions and earmarking.** Setting savings goals in a fintech app increased savings rates without reducing savings outside the app, most for the lowest-propensity savers, via monitoring and concreteness [S150] (**E2**, randomised beta-test design). Implementation intentions ("if–then" plans) have a medium-to-large meta-analytic effect on goal attainment across 94 tests [S148] (**E3** when applied to money: the evidence is mostly laboratory and health outcomes; the exact d, recalled as ≈0.65, is not verified; regraded per R03 §3). Implementation intentions are meant to leave a lasting habit, and that carry-over breaks reversal designs (§4.6). Goal-setting theory supports specific, difficult goals with feedback [S149] (**E3**: a review by the theory's originators; regraded). Earmarking into partitioned envelopes with a visual reminder raised savings among low-income Indian workers [S153] (**E2**). Commitment devices are reviewed by Bryan, Karlan & Nelson [S147]; the classic self-imposed-deadline study is **retracted** [S160] and must not be cited as support. Age-progressed future-self renderings increased later-reward choices in four studies [S124] (**E2**, lab).

**F29. Boosting and ethics.** Hertwig & Grüne-Yanoff distinguish nudges (steering) from boosts (building competence, e.g., teaching a rule of thumb) [S155]; Sunstein catalogues why nudges fail (strong preferences, counter-nudges, reactance) [S156]; disclosing a default nudge did not eliminate its effect, which bears on transparency [S157]; Loewenstein & Chater and Bhargava & Loewenstein argue that nudges are a complement to, not a substitute for, structural remedies [S158, S159] (**E3**). *Design rule:* every behavioural feature must be transparent, reversible, opt-in, and offered with its evidence grade; the system informs and offers architecture, it does not persuade. F9's evidence is disputed rather than null, so boosting (building competence just in time) remains open once most nudges are out of scope.

### 3G. Data-protection facts relevant to behavioural analysis (new in v0.2; V-028)

**F30. Behavioural constructs are profiling in substance, and some can reveal sensitive data.** On 2026-11-04 we read the text of the Nigeria Data Protection Act 2023 hosted by DataGuidance [S175]. Grade **E2**. We did not compare it line by line with the gazette, so a lawyer must confirm. The provisions that matter:

| Section | What it provides |
|---|---|
| s.3(1) | Exempts processing "solely for personal or household purposes", "provided that such processing … does not constitute a violation of fundamental right to privacy of a data subject" |
| s.24(1)(b) | Purposes must be "specified, explicit, and legitimate"; no further processing "in a way incompatible with these purposes" |
| s.24(1)(d) | Retention no longer than necessary |
| s.27(1)(g) | Notice must cover the "existence of automated decision-making, including profiling" |
| s.30(1)(a) | Sensitive personal data may be processed on consent "for the specific purpose or purposes for which it will be processed" |
| s.35(1)–(2) | Consent may be withdrawn at any time; withdrawing must be as easy as giving it |
| s.37(1) | A right not to be subject to a decision "based solely on automated processing of personal data, including profiling", that has legal or similarly significant effects |
| s.37(2)–(3) | Exceptions for contract, law or consent, subject to safeguards: human intervention, a chance to state a view, and a right to contest |
| s.65 | "Sensitive personal data" includes "religious or similar beliefs", "health status", "race or ethnic origin", "political opinions or affiliations", "sex life" and "trade union memberships" |

Reviewer R03b also read three provisions we did not re-read here: ss.25–26 (lawful basis and consent), s.34 (rights, including erasure) and ss.41–43 (cross-border transfer).

**UAE.** DLA Piper's summary quotes the PDPL (Federal Decree-Law 45/2021). It defines sensitive data to include "any data that directly or indirectly reveals a natural person's family". It also reports that the Executive Regulations were unpublished as of January 2025 [S176]. Grade **E3**: a secondary source; we could not reach the primary text.

**Implications.**
- Ramadan or Eid seasonality, and tithe or zakat counterparties, can reveal religion.
- Pharmacy and hospital spending can reveal health.
- Party dues and town-union levies can reveal political affiliation or ethnic origin.
- Transfers to named kin reveal family, which is sensitive under UAE law.

Doc 6 F40 says financial data is not sensitive. That holds for raw balances, but not for the inferences drawn from them. The design response is in §4.9.

## 4. Proposed framework / specification for Portfolio OS

### 4.0 Contracts this section follows

`CANONICAL_CONTRACTS.md` is binding, and this section refers to it rather than restating it:
- **C2 (figures):** every behavioural sentence is a rung-tagged template whose values, dates, counts and directions are tokens. The renderer resolves them, and the model never writes them (C2.5 "Doc 3 templates"). C2.6 item 3 makes template enforcement for qualitative behavioural claims a Doc 3 contract; §4.10 defines it.
- **C3 (status):** every behavioural statistic is a derived figure. Its validation status is the minimum of its inputs and its freshness the worst. Statistics at L1 or above are *conclusion-driving* under C3.4. A `candidate`, `disputed`, `superseded`, `withdrawn` or `licence_revoked` input withholds the statistic, and the reason is shown. Consumer Price Index (CPI) values and FX rates used for adjustment are world facts under the entry-time check in C3.5.
- **C4 (confidence):** classified totals (rung L0b) show the four C4 bands and the share of value still in review. In addition, and more strictly than C4 requires, every obligation, family, currency-conversion "hedging" or sensitive-category tag is user-confirmed. None is auto-applied or bulk-accepted.
- **C1 and C5 (ledger, FX):** currency-conversion series are built from C1 exchange entries. Conversion cost is the C1.5 "cost vs reference" measure, reported only for confirmed matches (C1-I13). Valuation uses the C5 hierarchy (CBN central rate). The parallel rate appears only as a labelled sensitivity line.

### 4.1 The behavioural claims ladder (v0.2)

Every behavioural output sits at one rung. The rung fixes which template family may render it and what the UX evidence indicator shows. Changes from v0.1 (R03 M1, R03b B1):
- L0 is split into recorded and classified rungs.
- v0.1's L2 ("evidence-supported explanation") is withdrawn. It is replaced by **L2a, literature context**, which is an analogy and never an explanation of this person, and **L2b, within-person randomised result**, the only route to a person-specific causal statement.
- A persistence rule is added.

| Rung | Definition | Evidence needed for this user | Template family (§4.10) | Forbidden | Where Doc 8 shows it (rung in words plus ladder position) |
|---|---|---|---|---|---|
| **L0a Recorded** | A ledger line or balance as stated by the source document | Statement reconciled (C3 `auto_validated`); narration shown only as a C2 `quote` handle | `L0a.*` "On ⟨date⟩, ⟨amount⟩ left ⟨account⟩." | Any category, adjective or comparison | Statements of fact |
| **L0b Classified** | A total over a category, tag or counterparty | C4 band per item; share of value in review shown; sensitive and obligation tags user-confirmed | `L0b.*` "Spending in categories you marked as flexible was ⟨amount⟩ between ⟨date⟩ and ⟨date⟩; ⟨amount⟩ of it is still awaiting your review." | Adjectives about the person; judgement words ("too much") | Statements of fact, with the review share |
| **L1 Measured pattern** | A statistic with an approximate interval after the mandatory checks, published at a scheduled look | Construct gates (§4.2, §4.3) met, including the data-quality gate and the noise-calibrated minimum; checks removed and their size shown | `L1.*` | Causal verbs ("because", "due to", "you tend to"); trait words | Card headline, with baseline, interval, cycles and checks |
| **L2a Literature context** | What studies of *other* people found, named by population | An L1 result on the same construct; source graded E1–E2 | `L2a.*` "Large bank-data studies in the United States and Iceland found a similar pattern; they disagree on why. This describes those studies, not you." | Any statement that a mechanism applies to this user; population quantifiers ("most people") | **Never raises the displayed rung**; only under "Research context (not about you)" attached to an L1 card |
| **L2b Within-person randomised result** | A difference between randomised conditions in this person's own data | §4.6 design gates: tamper-evident pre-registration; exact randomisation test; minimum pairs; carry-over check | `L2b.*` "In the ⟨count⟩ cycles with X, Y was lower by ⟨amount⟩ (range) than in the ⟨count⟩ without; order was randomised within ⟨count⟩ pairs." | Mechanism claims; "it worked" or "it failed" | Card headline (the top displayed rung) |
| **L3 Hypothesis** | A possible mechanism or explanation not testable now | The test and data that would resolve it are named | `L3.*` "One possibility is …; this could be checked when …" | Presenting it as a finding or as a card headline | Only in "Not tested yet" and "If you want to try …" |
| **L4 Not establishable** | A construct no data in the system can identify | — | `L4.*` silence, or "the system does not measure this" | Scores, labels, coefficients | None |

**Persistence rule.** An L1 construct changes rung or value only at a scheduled look (§4.3: cycles 6, 12 and 24, then every 12). Between looks, the published value is held and new cycles appear as L0b rows. A construct is downgraded at once if the data-quality gate fails, an input becomes `disputed` (C3), or the user withdraws consent (§4.9). This stops labels toggling as each cycle arrives (R03 M1).

### 4.2 Behavioural construct catalogue (v0.2)

The catalogue is cut to constructs that inform a named decision (R03b §2a, §2b; V-029). Names are descriptive, not judgemental (R03b m1). The constructs are:
- **1–4:** personal-finance views under the ledger purpose.
- **5–10:** behavioural analysis, requiring the behavioural consent (§4.9).
- **11–12:** stated-preference items, also under the behavioural consent.

| # | Construct (descriptive name) | Decision it informs | Observable | Inputs (contracts) | Method | Gate | Mandatory checks and named alternatives | Max rung (MVP) | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Recurring charges (was "recurring-charge inertia") | Cancel or keep each charge | Recurring debits; annualised cost | Doc 4 recurring-outflow objects; merchant normalisation | Rule plus user confirmation | 3 months (6 for quarterly charges) | Shared subscriptions; annual plans; business expenses; **the user may value the service** (no "inertia" inference) | L0b | MVP |
| 2 | Fees, levies and conversion cost | Account, channel, batching, conversion provider | Bank fees, VAT on fees, stamp duty, C1.5 conversion cost vs CBN reference | Doc 4 `Expenses:BankCharges:*`; C1.5; C5 | Arithmetic | 1 month | Misclassified fees; merchant surcharges; unconfirmed exchanges excluded (C1-I13) | L0b | MVP |
| 3 | Liquidity buffer by currency | Reserve size and currency | Liquid assets ÷ essential monthly spend per currency (Doc 4 §4.4.2) | Balances; C5 rates; "essential" user-confirmed | Arithmetic; run chart | 3 months | Funds in transit (C1-I6 asset, not spending); esusu pay-out schedule; FX valuation date | L0b | MVP |
| 4 | Currency conversions (was "FX hedging", V-030) | Conversion timing, provider, and currency mix against liabilities | Share of income converted within 7 days of receipt; cost vs NFEM reference; Doc 6 `NG-CGT-FOREIGN-ASSETS-2026` flag; holdings by currency against the currency of user-declared liabilities | C1 exchange entries; C1.5; Doc 6 | Arithmetic | 3 months | Named at L3, never by default: hedging; remittance pre-funding; USD debt service; tuition abroad; travel; speculation. The "hedging" tag is applied only if the user confirms it | L0b | MVP |
| 5 | Obligations and family transfers | Planned share in the budget | Transfers to user-confirmed counterparties; esusu contributions | Counterparty tags confirmed by the user only; sensitive-inference register (§4.9.5) | Separate account with its own baseline | 3 months | Business payments; loans repaid; never "leakage" | L0b | MVP, behind the behavioural **and** family-data consents |
| 6 | Spending after income arrives (v0.1 rows "income-arrival response" and "payday cycle severity" merged; R03 M2) | None directly. It is decision-linked only through construct 6a | Flexible-category spend per day, days 0–6 after the salary credit vs days 7 onward | One confirmed income stream (Doc 4 §4.3.1); with several streams the construct is L4 "not defined" | Circular-shift test at scheduled looks; cycle-level bootstrap range; per-cycle table (§4.3) | Data-quality gate; noise-calibrated minimum cycles; single anchor | Removed and sized: scheduled bills, user-confirmed obligations, currency conversions, investment contributions, fees. Checked and shown: posting lag (value date ≠ purchase date), cash withdrawn in the window, bulk buying under inflation, card repayment cycle (UAE), several income streams, spending paid from a partner's account, weekday composition, salary-date drift | L1 (with L2a context) | MVP as a **guardrail** against false alarms. Decision measure only if 6a is non-zero (Rec 3) |
| 6a | End-of-cycle shortfall cost | Buffer size; timing of contributions; overdraft or credit use | Overdraft and non-sufficient-funds fees, high-cost borrowing and skipped planned contributions in the last 7 days of a cycle; days with the buffer below the user's floor | Ledger; user-set floor and planned contributions | Arithmetic per cycle | 3 cycles | Contributions deliberately skipped (user note); a one-off large purchase | L0b | MVP |
| 7 | Concentration and currency exposure | Rebalancing | — | — | — | — | — | — | **Moved to System D** (Doc 8 §4.5.7); cross-reference only |
| 8 | Budget-envelope deviation | Setting the budget | Category spend vs the user's envelope | User envelopes; CPI month-on-month series (C3.5) | Deviation; run chart | 3 months per category | Late-month under-spend can be liquidity, not mental accounting; user-declared seasonal events only (§4.9.5) | L0b | Later |
| 9 | Disposition, as a tax-lot view | Sell or hold; which lot | PGR−PLR **in trade currency and in NGN**; V-shape by holding period | Lots (C1.6); Doc 6 CGT rules | Odean method; bootstrap over sale days | ≥30 sale days; ±0.15 precision needs ≈58 paper gains and ≈58 paper losses (±0.25 at 20 and 20; script §I) | The reference currency can flip the sign; NGX illiquidity and price limits; corporate-action cost-basis errors; Doc 6 F13 exemptions (NGX gains below the ₦150m-proceeds and ₦10m-gain limits), so harvesting matters mainly for foreign shares | L1 | Later |
| 10 | Turnover and trading cost | Trading frequency | Turnover; costs | Trades | Arithmetic | 12 months and ≥30 sale days a year | Rebalancing; tax-lot management | L0b | Later (founder's trading frequency unknown) |
| 11 | Risk willingness, stated (SOEP/GPS general risk item) | Benchmark for portfolio structure (System D/E) | 0–10 item | Asked once, just in time, when the first portfolio benchmark is shown; one retest | Direct; minimal detectable change (MDC) stated | 1 response plus 1 retest | Mood; recent market moves | L0a (stated) | MVP |
| 12 | Financial well-being (CFPB 5-item) | None directly; a descriptive annual series | IRT score | Annual, optional | Published scoring (US parameters, flagged) | Annual | Mode; translation; MDC95 ≈ 19 points (script §H) | L0a (stated) | MVP, optional |

**Removed (R03 M2; R03b §2a, §2b).**
- *Attention-driven buying and the rank effect:* not actionable for this user.
- *App-open ("ostrich") elasticity:* the first user is the developer, product notifications make opens endogenous, and per-event telemetry contradicts Doc 8 §4.9. It is Do-not-build (§4.7).
- *Holt–Laury, BIS-11, DOSPERT, Grable–Lytton, Propensity to Plan and Consideration of Future Consequences:* kept in §3 as literature only.

**Data-quality gate (replaces v0.1 §9.1–9.2; R03 §5.3, R03b M3).**
- *Ground truth:* the founder's decisions in the review queue. There is no separate 200-label exercise.
- *Transfer matching:* precision ≥ 0.98 and recall ≥ 0.95 on confirmed review-queue items. These are Doc 4 v0.1's targets, kept here as E5 thresholds. They are measured with Doc 4 v0.2's stratified labelled set and calibrated posteriors (Doc 4 §4.3.2; C4).
- *Audit sample:* each month, 10 auto-applied classifications drawn with probability proportional to amount are inserted into the queue, unmarked.
- *Value-weighted error:* the estimated misclassified value in the payday window must be ≤ 2% of window outflows (E5, to be calibrated). Value weighting matters because one misclassified ₦2.4m rent line moves the ratio more than a hundred small errors.
- *Reporting:* the correction rate is the published quality metric.
- *Failure:* below the gate, constructs 6 and 8–10 are withheld, with the reason shown.

**Cross-cutting rules.**
1. C3 status and badges apply to every input and output.
2. A statistic is withheld, with the reason, when a gate is not met.
3. Mandatory checks are shown with their size.
4. All text is rendered from §4.10 templates through C2 tokens.
5. Constructs 5–12 need the behavioural consent (§4.9).

### 4.3 Statistical decision rules (v0.2)

- **One decision framework: randomisation-based frequentist tests at scheduled looks** (R03 M7; E4, statistician). Tests are derived from the actual randomisation (Edgington's principle [S174]) or from autocorrelation-preserving circular shifts. The v0.1 Bayesian posterior-versus-ROPE (region of practical equivalence) rule is dropped as a decision rule, so the two frameworks are not mixed. The ROPE itself, [0.90, 1.10] for a ratio, is kept as a pre-declared band of practical equivalence that the interval must clear (§4.4). It is not used as a posterior probability. Benjamini–Hochberg across "15 constructs" is dropped because most constructs are arithmetic, not tests (R03b §2b).
- **Count tests, not constructs.** In the MVP the only inferential test is construct 6; construct 9 is added later. When more than one test is live, Holm's correction applies across tests at each look.
- **Independence unit is the pay cycle.**
  - The interval shown is a cycle-level bootstrap, labelled "approximate" while there are fewer than 10 cycles. On the synthetic data it is 1.51–1.80, against v0.1's day-level 1.38–1.83, which broke this rule (script §C; R03 M8).
  - The decision uses the circular-shift test.
- **Scheduled looks.** Looks happen at cycles 6, 12 and 24, then every 12. Across the first three looks α is split as 0.05/3 ≈ 0.017 per look (Bonferroni; conservative).
  - Re-testing monthly inflates false patterns. In script §G, a construct with no true effect tested monthly from cycle 3 to 12 at 0.05 produced at least one false "pattern" in 18% of simulations. Two scheduled looks at 0.025 each produced one in 10%.
  - The excess over 5% arises because the circular-shift test is liberal with few cycles. Its empirical size at nominal 0.05 is 0.095, 0.080 and 0.060 at 3, 6 and 12 cycles (script §D). The size must therefore be re-estimated on the founder's own noise before go-live (§9 item 2).
- **Minimum cycles depend on the user's own noise and are an E5 assumption (R03 M8, R03b m5).** The gate is the smallest n at which simulated power is ≥ 0.8 for a 1.3× pattern, using the user's estimated σ of log daily spend and share of zero-spend days (script §E).
  - Under v0.1's clean noise (σ 0.45, no zero days) that is 6 cycles (power 0.81).
  - Under σ 0.8 with 20% zero days it is more than 24 cycles (power 0.29, 0.51 and 0.73 at 6, 12 and 24 cycles).
  - Under σ 0.9 with 30% zero days, power at 24 cycles is 0.60.
  - A lumpy spender's construct may therefore never reach L1 within two years. The product says so (`L1.too_early`).
- **Seasonality** is modelled only from calendar events the user declares (school terms, December, and religious festivals *if declared*); the system never infers them (§4.9.5). At least 12 months of data are required before any annual claim.
- **Inflation adjustment** uses the NBS month-on-month CPI series, each value a C3.5 world fact. v0.1 used a shortcut derived from the year-on-year rate (1.14% a month), but the published September 2026 month-on-month figure was 0.06% (script §K; R03 m5).
- **Pre-registration is tamper-evident** (R03 M9). Before the first cycle of any experiment, the impact model, outcome, randomisation scheme and analysis are hashed. The hash is committed to an external timestamp, either an RFC 3161 timestamp authority or a public registry entry (E5). The record is stored outside the founder-editable ledger and contains no personal data.

### 4.4 Defensible confidence language for one person (v0.2)

| Situation | Template | Allowed wording (placeholders are tokens at render time) | Not allowed |
|---|---|---|---|
| Below the noise-calibrated minimum | `L1.too_early` | "Not enough history yet: ⟨count⟩ of ⟨count⟩ pay cycles needed for a pattern this size, given how much your spending varies." | Any estimate |
| No single income anchor | `L4.no_anchor` | "This view needs one regular income date; your income arrives on several dates, so it is not shown." | A ratio computed against a guessed anchor |
| L1 at a scheduled look: p < α_look, interval lower bound above the ROPE (1.10), pattern held in ≥ 5 of the last 6 cycles | `L1.after_income` | "A consistent pattern" + ratio + approximate range + cycles + checks removed with their size | "Always", "habit", "you tend to", "trait" |
| L1 at a look, interval overlaps the ROPE | `L1.possible` | "A possible pattern; too early to tell" | Any directional claim |
| L2a context, attached to an L1 card only | `L2a.after_income` | "Large bank-data studies in the United States and Iceland found a similar pattern; they disagree on why. This describes those studies, not you." | "In most people"; "the payday effect"; "because you are …" |
| L2b within-person result | `L2b.result` | "In the ⟨count⟩ cycles with X, Y was lower by ⟨amount⟩ (range) than in the ⟨count⟩ without; order was randomised within ⟨count⟩ pairs." | "The prompt worked" or "failed"; any mechanism |
| Before/after description of a user decision (§4.6) | `L0b.before_after` | "Since you set up the standing order on ⟨date⟩, your savings rate has been ⟨amount⟩ against ⟨amount⟩ before. This is a description, not a test of its effect." | "Because of the standing order" |
| L3 hypothesis | `L3.*` | "One possibility …; this could be checked when …" | Presenting it as an insight |

### 4.5 Worked example: six months, salary on the 25th, "spending spike" analysis (synthetic data)

**Set-up (unchanged from v0.1).** All numbers are synthetic, from `payday_sim.py`, seed 20261102, re-analysed by `doc03_revision_checks.py`. One NGN current account, 1 January–30 June 2026 (181 days). Net salary of ₦1,500,000 is credited on the 25th or the preceding business day (23 Jan, 25 Feb, 25 Mar, 24 Apr, 25 May, 25 Jun). The generator includes:
- discretionary spending with a 25% weekend uplift, a *true* uplift of 45% in days 0–6 after salary, and a −15% end-of-month squeeze;
- annual rent of ₦2.4m on 26 January;
- school fees of ₦450k on 28 January and 27 May;
- utilities on the 2nd;
- a family transfer of ₦150k within three days of each payday;
- a US-dollar purchase of ₦300k the day after five of the six paydays;
- weekly ajo of ₦20k on Mondays;
- an investment contribution of ₦200k two days after payday.

The noise is i.i.d. lognormal (σ = 0.45) with no zero-spend days. That is cleaner than real spending, so Step 8 adds lumpier noise models.

**Step 1 — the naïve statistic is wrong by a factor of five.** Using all outflows, mean daily outflow in the payday window is ₦205,417 against ₦25,567 on other days, a ratio of 8.03. This is what an unreconciled app would call a "post-payday splurge".

**Step 2 — after classification, the flexible-spending ratio is 1.60.** Mean spend is ₦32,612 a day in the window against ₦20,389 otherwise. The approximate range from a cycle-level bootstrap is 1.51–1.80, from only 5 clusters, so it under-covers. v0.1's day-level bootstrap (1.38–1.83) resampled days and broke the cycle rule (R03 M8).

**Step 3 — is it distinguishable from chance given autocorrelation?** A circular-shift permutation of the window indicator (180 shifts) gives p = 0.006, below the 0.017 per-look threshold even allowing for the test's liberal size at 6 cycles (0.080, script §D). Two robustness checks are kept for this document only and are not production decision engines (R03b §2b):
- a log-spend regression with weekday fixed effects and HAC(7) standard errors (×1.54, t = 5.36);
- the control chart in Step 6.

**Step 4 — does it hold cycle by cycle?** Window-to-rest ratios by cycle are 1.71, 1.86, 1.50, 1.73 and 1.45; the sixth cycle is incomplete. All five complete cycles exceed the ROPE upper bound of 1.10.

**Step 5 — alternative explanations, sized and reported (corrected label; R03 M8).**
- **(a) What makes up the naïve excess.** The excess is the window mean minus the other-day mean, ₦179,850 a day (script §B):
  - bills and fees: 44.3%;
  - the USD purchase: 20.3%;
  - the investment contribution: 16.3%;
  - the family transfer: 12.2%;
  - ajo: about 0%;
  - flexible spending: 6.8%.

  Non-flexible flows therefore make up 93.2% of the naïve excess. v0.1 called all of it "scheduled obligations", which was wrong.
- **(b) Classification in production.** The family transfer and the USD purchase are excluded only after the user confirms the tags. The USD purchase is labelled "currency conversion" and shown with its cost against the NFEM reference, not as "hedging" (V-030).
- **(c) Inflation.** The September 2026 month-on-month CPI was 0.06%, which is immaterial to a 1.6× ratio. v0.1's 1.1% a month came from the year-on-year shortcut (R03 m5).
- **(d) Weekday composition.** Not a factor: the weekend share is 29.3% in the window and 28.6% outside.
- **(e) Salary-date drift.** The window is anchored to the actual credit date.
- **(f) Checks that need production data.** These cannot be run on this synthetic set and are mandatory in production:
  - posting lag;
  - cash withdrawn in the window;
  - bulk buying;
  - several income streams;
  - partner-paid spending;
  - unexplained credits, which raise a flag rather than an adjustment.

**Step 6 — control-chart view (robustness only).** Weekly flexible totals over 27 weeks have a mean of ₦155,241, a moving-range σ̂ of ₦43,856 and an upper control limit of ₦286,808. No week breaches the limit. The pattern is a stable within-cycle rhythm, not a trend.

**Step 7 — what the product may say (L1 card with L2a context; template text in §4.10, rendered here with the synthetic values).**

> "Over 5 pay cycles, spending in categories you marked as flexible during the 7 days after salary arrived averaged 1.6 times the rate on other days (approximate range 1.5–1.8). This held in 5 of 5 cycles. Removed before this was calculated: bills and fees, currency conversions, your investment contribution, and transfers you marked as family — together most of the money that leaves in that week."
>
> *Context:* "Large bank-data studies in the United States and Iceland found a similar pattern after income arrives; they disagree on why (bills timed with pay, attention, available cash). This describes those studies, not you."

Changes from v0.1:
- "discretionary" becomes "categories you marked as flexible";
- "in most people" becomes the named populations;
- the "payday effect" label is dropped (R03b m2);
- there is no offer of an alternating-month prompt (§4.6);
- the card sits at L1 (■■□), not L2.

**Step 8 — power, restated for the design actually specified (V-024; script §E, §F).**

*Detecting the pattern* (circular-shift test, α 0.05):

| Noise model | 1.30×: 6 / 12 / 24 cycles | 1.45×: 6 / 12 / 24 cycles |
|---|---|---|
| v0.1 clean (σ 0.45, no zero days) | 0.81 / 0.94 / 0.97 | 0.86 / 0.95 / 0.99 |
| R03 lumpy (σ 0.8, 20% zero days) | 0.29 / 0.51 / 0.73 | 0.47 / 0.62 / 0.84 |
| R03b lumpy (σ 0.9, 30% zero days) | 0.26 / 0.34 / 0.60 | 0.33 / 0.56 / 0.72 |

*Evaluating an intervention* with order randomised within consecutive pairs of pay cycles. The test is the exact one-sided randomisation test over all 2^pairs assignments; v0.1 permuted a fixed ABAB sequence over C(n, n/2) labellings, which is not the randomisation it specified:

| Months (pairs) | Assignments; smallest possible p | Clean noise: 15% / 30% effect | Lumpy noise + month shocks (σ_month 0.15): 15% / 30% | Clean, 50% carry-over into the next control cycle: 15% / 30% |
|---|---|---|---|---|
| 6 (3) | 8; 0.125 | **0.00 / 0.00** | 0.00 / 0.00 | 0.00 / 0.00 |
| 12 (6) | 64; 0.016 | 0.36 / 0.91 | 0.13 / 0.33 | 0.17 / 0.59 |
| 24 (12) | 4,096; 0.0002 | 0.67 / 1.00 | 0.19 / 0.49 | 0.36 / 0.91 |
| 36 (18) | 262,144; <0.0001 | 0.85 / 1.00 | 0.25 / 0.70 | 0.54 / 0.95 |

*Feasibility, stated plainly.*
1. Six months cannot reach significance at any effect size.
2. Nudge-sized effects (F27: possibly zero in finance; about 8% relative at scale) cannot be detected for one person within three years under realistic noise.
3. Even a 30% effect needs 24 or more cycles under lumpy noise, and then has power of only 0.49.
4. Carry-over, which implementation intentions are designed to produce, roughly halves power.

The reviewer's proposed minimum of 24 cycles for a 15% effect (R03 B1) is therefore not enough under lumpy noise (0.19). We go further and remove the trial from the personal MVP (§4.6).

**Step 9 — disposition analogue (corrected; V-027).** At the catalogue minimum (20 paper gains and 20 paper losses on sale days; PGR 0.30 against PLR 0.15), the binomial 95% half-width is **±0.25**, not v0.1's ±0.15. ±0.15 needs about 58 of each, before within-day clustering (script §I). The product will stay at L0b/L1 for years of ordinary trading.

**Step 10 — checking the Doc 8 v0.1 card against this specification (V-007; script §J).** The card's "38% of discretionary spending in the 4 days after salary" implies a ratio of about 4.0×, because 4 days are 13.3% of a 30-day month. That is 2.5 times this example's 1.6×. It was shown without its baseline, at a different window and with no interval, while listing as "cannot rule out" checks that L1 requires to have been run. Under §4.10 the card is not renderable.

### 4.6 Interventions: what the personal MVP does instead of a trial (V-024, V-025)

**Why there is no within-person trial in the personal MVP.**

| Reason | Evidence |
|---|---|
| The interventions with large expected effects need automation Portfolio OS will not have | Auto-sweep and auto-conversion are "automated payments or transfers from Portfolio OS", Do-not-build (yet) under Doc 4 R13 (regulated payment activity). Trade cooling-off needs order routing, which does not exist |
| The interventions that remain have bias-corrected support near zero in finance | Maier et al.: finance domain 0.00 [0.00, 0.00], BF01 ≈ 41 (31 with precise estimates only); information nudges 0.00, BF01 ≈ 34 (F27) |
| Power | §4.5 Step 8 |
| The founder is subject, designer and analyst | No blinding; hypotheses known in advance; reactivity (installing a monitoring app itself lowers spending [S76]); expectancy |
| Burden | Twelve or more months of manual multi-bank uploads (no open banking: Doc 6 F37), plus review-queue work |

**What the MVP does: decisions, tracked at L0b** (R03b M2). If the founder decides on a saving rule, they implement it as a **standing order at their bank**. That is user-configured bank-side automation: Portfolio OS observes it and moves no money, consistent with Doc 4 R13. The system records the decision date and shows the following before and after it, with the `L0b.before_after` disclaimer that this is a description, not a test of effect:
- savings rate (Doc 4 §4.4.3);
- end-of-cycle buffer;
- construct 6a.

A sweep's effect on saving is mechanical and needs no inference. A self-chosen sweep is a commitment device, not a default in the Madrian–Shea sense, which works through the inertia of people who did not choose [S35]. The relevant evidence is take-up and partial use (28.4% take-up in [S78]).

**Later-stage options, not dropped (brief §5.9):**
- *Auto-sweep and auto-conversion inside the product:* only if Doc 4 R13 changes through a licensed payments partner (System I).
- *Trade cooling-off friction:* only if order routing is ever built.
- *A prompt on the evening before salary:* only as an opt-in reminder the user schedules, with no claim of effect.

**The protocol, retained for two uses.** Use (i) is commercial-phase between-person trials, where randomisation across people makes nudge-sized effects detectable. Use (ii) is an optional founder n-of-1 trial that meets every rule below.
1. **Eligibility.**
   - The construct is at L1.
   - The intervention is reversible and has no intended carry-over mechanism. This excludes implementation intentions and learned plans.
   - The expected effect is ≥ 30%, or the founder accepts in writing that a smaller effect will not be detectable.
2. **Design.**
   - Alternating treatments, with order randomised within consecutive pairs of pay cycles.
   - Pairs are blocked so that user-declared calendar events (school-fee months, December, declared festivals) fall within a pair rather than in one arm.
   - Minimum 24 cycles (12 pairs).
   - Reported against SCRIBE [S173] and CENT [S130], and judged against the single-case standards for alternating-treatment designs [S131] (minimum repetitions per condition as recalled from those standards; not re-read in this pass, E3).
3. **Analysis.**
   - Exact randomisation test over the 2^pairs within-pair assignments [S174]: one-sided α 0.05, one analysis at the pre-registered end, with monitoring for harm only.
   - Carry-over check: control cycles that follow a treated cycle are compared with control cycles that follow a control cycle, and reported descriptively.
4. **Outcome.** The construct metric and construct 6a. The CFPB score is not an outcome: MDC95 ≈ 14 points for the 10-item form, ≈ 19 for the 5-item form, and annual frequency (R03 M4, R03b M3).
5. **Pre-registration.** Tamper-evident (§4.3), and reviewed before the first cycle by a person other than the founder (founder to name; for any second user, an independent reviewer).
6. **Consent and ethics** (R03 M9).
   - For any user other than the founder, the trial is human-subjects research. It needs independent ethics review and a lawful basis under NDPA ss.25–26, with UAE counsel for the PDPL.
   - The consent text states the cost of withholding a possibly beneficial feature in control cycles.
   - Withdrawal stops the trial and deletes its behavioural derivations under §4.9.6. Only the consent and withdrawal events are kept. This replaces v0.1's "the record is kept".
   - Unchanged from v0.1: no social comparison, no loss- or shame-framed copy, no streaks, no interventions on obligation or social transfers, and full transparency of mechanism (F29).

**Budget-view experiment (Doc 4 §4.4.1; Doc 4 v0.2 §6, formerly §9 item 10; R03 §5.6).** For one person this cannot be tested at useful power. In the personal MVP the founder chooses a view, and adherence and savings rate are reported at L0b without a causal claim. At commercialisation it becomes a between-person randomised trial. Detecting a 2-percentage-point savings-rate difference with an SD of 10 points needs about 392 users per arm (two-sided 0.05, power 0.8; E5 inputs; script §N).

### 4.7 Outputs the system must NOT produce, and why

| Prohibited output | Reason |
|---|---|
| "Loss-aversion coefficient", "discount factor", "risk tolerance score" from transactions | Not identified from spending or brokerage data (F1, F2, F4). Loss-aversion magnitude depends on the method, 1.3–2.0 (F2) |
| Personality or "money type" labels ("Spender", "Avoider", "Impulsive") | Non-ergodicity (F25); BIS-type constructs pathologise (F23) |
| Single-number "financial health score" | Combines incommensurable components and hides uncertainty |
| "You are overconfident / present-biased / irrational" | Mechanism claims are L3 at best; alternatives (F17–F19) fit the same data |
| Peer comparisons | Backfire evidence (F26); no reference population; privacy |
| "This worked" or "this failed" for any intervention; before/after comparisons presented as a test (Doc 8 v0.1 Journey 4) | §4.5 Step 8; §4.6 |
| A share shown without its no-pattern baseline (e.g. "38% in 4 days") | Misleads (§4.5 Step 10) |
| Family or community transfers described as waste or "leakage" | F18–F19 |
| National or cultural priors ("Nigerians tend to…"); population quantifiers ("most people") | F22; unsourced generalisation (R03b m2) |
| **Inference of sensitive attributes**: religion (from giving counterparties or festival seasonality), health (from pharmacy or hospital spend), ethnic origin (from counterparties), political affiliation (from dues or levies), sex life | NDPA s.30 and the s.65 definition; PDPL (F30); §4.9.5 |
| Gambling or betting labels and any "addiction" language | Clinical framing; sensitive; no validated mapping |
| Behavioural credit or "creditworthiness" scoring, now or at commercialisation | Profiling with legal or similarly significant effects (NDPA s.37); not validated |
| Sale or sharing of behavioural data | Purpose limitation (NDPA s.24(1)(b)) |
| Real-time "you are about to overspend" push alerts | No evidence for just-in-time interventions here; side effects (F26, S152) |
| Emotion or mood inference from chat text | Not validated; sensitive |
| Questionnaire-derived "risk profiles" used as suitability for advice | Regulated-advice perimeter; single items are noisy (MDC95 ≈ 3.5–4 on 0–10) |
| Engagement or app-open ("ostrich") metrics while the only user is the developer | The measure is endogenous; privacy conflict with Doc 8 §4.9 |

**Merged forbidden-vocabulary list for the Doc 8 copy lint (R03b m3; Doc 8 adds its own list).** always, never (about the person), habit, trait, stable trait, you tend to, because you are, typical of you, irrational, overconfident, present-biased, impulsive, loss-averse, leakage, splurge, overspend, payday effect, severity, inertia, ostrich, avoider, spender, saver (as a label), money type, discretionary (in user copy: say "flexible"), most people, normal for, like you, worked, failed (for interventions); and Doc 8 §4.7's list (over-spender, under-saver, bad habit, guilty, treat yourself, you should, on fire, streak, badge, level up, congratulations for financial actions, score).

### 4.8 Eight-question test applied to the retained features

Grades apply F12's one-notch discount to mechanism claims not replicated in field data (R03 m7).

| Feature | 1 Theory | 2 Evidence | 3 Data | 4 Measurement | 5 Alternatives | 6 Avoiding unsupported conclusions | 7 Intervention | 8 Evaluation |
|---|---|---|---|---|---|---|---|---|
| Recurring charges | Inattention (hypothesis only) | E2 (F14, US data); value to founder E6 | Recurrence detection | Count, annual cost | Valued service; shared, annual or business plans | No "inertia" claim; user confirms each charge | Keep/cancel review | ₦ cancelled per year (L0b) |
| Fees, levies, conversion cost | Salience of fees | E2 stamp duty (F21); E3 charges; E6 for founder | Fee lines; C1.5 | ₦ and % of flows | Surcharges; unconfirmed exchanges excluded | Rule source and as-of date on every line | Channel and provider choice by the user | ₦ avoided per year (L0b) |
| Liquidity buffer by currency | Precautionary saving | E3 convention; F13 liquidity evidence E1 (US) | Balances; C5 | Months covered per currency | In transit; esusu schedule | "Essential" is user-confirmed | None | Buffer against floor |
| Currency conversions | Dollarisation (macro model, E2 for aggregates; E4 for an individual) | E4 | C1 exchanges | Share within 7 days; cost vs NFEM; currency mix vs liabilities | Hedging, remittance, debt service, tuition, travel, speculation (all L3) | No rational or irrational label by default | None | Conversion cost per year (L0b) |
| Obligations view | Kinship insurance and obligations | E1 phenomenon (F18), E2 Nigeria | User-confirmed counterparties | Amount and share | Business; loans | Never "leakage"; sensitive consent | User may set a planned share | — |
| Spending after income (guardrail) and shortfall cost | Liquidity, mental accounting, attention (literature context only) | E1 phenomenon (F13, US and Iceland); E6 applicability to this founder | Matched, classified ledger; one income anchor | Ratio, circular-shift test, per-cycle table; 6a in ₦ | Bills, conversions, obligations, posting lag, cash, bulk buying, several incomes, partner-paid | Ladder; scheduled looks; noise-calibrated gate | None in MVP (§4.6) | 6a falls to the founder's target |
| Risk item (SOEP/GPS) | Stated risk preference | E2 (S114, German sample); E4 for NG/UAE use; GPS fielded it in Nigeria and the UAE [S177] | One response plus retest | 0–10; MDC95 ≈ 3.5–4 (E4 inputs) | Mood; recent market moves | No labels; dated | None | Retest difference recorded |
| CFPB 5-item (annual, optional) | Subjective well-being | E2 (US development report); E6 for this founder | Responses | IRT score; MDC95 ≈ 19 | Mode; translation | No labels; US-norm caveat | None | Descriptive series only |

### 4.9 Privacy and data protection for behavioural analysis (new; V-028)

*Design-level analysis by simulated specialists. A Nigerian data-protection lawyer and UAE counsel must review it before reliance, and in any case before a second user. This is not legal advice.*

**4.9.1 The facts relied on** are in F30 (NDPA text read 2026-11-04; PDPL via secondary source).

**4.9.2 When the Act applies.**
- **Founder alone.** If the founder runs the system alone, for themselves, on infrastructure they control, the s.3(1) exemption for processing "solely for personal or household purposes" is likely to apply. Its proviso still protects third parties: the ledger holds kin names and account numbers.
- **The trigger.** The relevant trigger is **a controller other than the founder** (a company, or a cloud processor acting for one) or **any second user**, not "a second person's data", as Doc 6 §4.6 phrases it. Whether processors serving household users fall inside the exemption is unverified (E4).
- **We do not rely on the exemption.** The design below applies from the start, because it is cheap now and expensive to retrofit (E4).

**4.9.3 Purpose, consent and notice.**
- **Separate purpose.** Behavioural analysis is a purpose separate from the ledger and tax purposes, which rest on legal obligation (Doc 6). Further processing must be compatible with the original purpose (s.24(1)(b)), so profiling needs its own consent (ss.25–26).
- **Granular, off-by-default consents:**
  - (a) behavioural statistics (constructs 6, 8–10);
  - (b) the obligations and family-transfer view (construct 5; family data is sensitive under the PDPL);
  - (c) questionnaires (constructs 11–12);
  - (d) any experiment (§4.6).
- **Notice.** The notice names "automated decision-making, including profiling" (s.27(1)(g)).
- **Withdrawal.** Withdrawal is one control, as easy as giving consent (s.35(2)). It stops computation at once and deletes derivations within 30 days (E5).

**4.9.4 Automated decisions.** No behavioural construct may drive a decision with legal or similarly significant effect without human involvement (s.37(1)). The MVP automates no decision from these constructs. If intervention eligibility is ever automated for other users, the s.37(2)(c) consent route and the s.37(3) safeguards apply: human intervention, the right to express a view, and the right to contest.

**4.9.5 Sensitive-inference register.**

| Sensitive category (NDPA s.65; PDPL) | Signals in a ledger that could reveal it | Rule |
|---|---|---|
| Religious or similar beliefs | Tithe, zakat or offering counterparties; spending seasonality around Ramadan, Eid or Lent | Not computed by default. Seasonality comes only from calendar events the user declares. Religious-giving categories are excluded from behavioural statistics unless the user consents to that specific purpose (s.30(1)(a)). Never shown as an inference about the person |
| Health status | Pharmacy, hospital and insurance merchant codes | Excluded from behavioural statistics; shown only as ordinary L0b category totals in the ledger view |
| Political opinions or affiliations | Party dues; some levies | Excluded; no inference |
| Ethnic origin | Town-union levies; counterparty names | Excluded; no inference |
| Family (PDPL "directly or indirectly reveals a natural person's family") | Transfers to named kin; school fees for dependants | Construct 5 only, behind consent (b), with user-confirmed counterparties |
| Gambling (not a statutory category; high stigma) | Betting merchants | No label; ordinary category total only |

Doc 4 v0.2's "Giving & family" group separates religious or charitable giving (a consumption category) from remittances to family (`TransferOut:Family`). We ask Doc 4 to flag religious giving as a sensitive category and to keep school fees as a scheduled category, so the register can act on each (§6).

**4.9.6 Storage, retention and deletion** (reconciles Doc 6, Doc 8 and v0.1).
- **Separate store.** Behavioural derivations are kept in a store separate from the tax vault. They comprise:
  - statistics;
  - behavioural tags beyond ledger categories;
  - questionnaire responses;
  - experiment records.
- **Retention.** They can be recomputed from the ledger, so the store keeps current values plus 24 months of history (E5; R03b M5). Everything in it is deleted on withdrawal.
- **Tax vault.** Statements, documents and the journal follow Doc 6: kept at least 6 years under NTAA s.31(5), in write-once storage, as a legal obligation.
- **Doc 8's "delete everything".** It must therefore read: "delete behavioural data now; ledger and tax records are deleted when the legal retention period ends".
- **Pre-registration hashes.** Kept outside both stores; they contain no personal data.

**4.9.7 Where processing happens.**
- **Local rendering.** Templates are filled locally by the renderer (C2). Counterparty names are never sent to a cloud model; the model sees token IDs and masked `quote` handles only (C2.2 item 7).
- **Cross-border transfers.** Any cloud processing of personal data outside Nigeria engages NDPA ss.41–43 (counsel to confirm).
- **No telemetry.** Behavioural analysis uses no per-event telemetry, consistent with Doc 8's aggregate-only events.

**4.9.8 Data-protection impact assessment (DPIA).** Required before any second user, before any controller other than the founder, and before commercialisation. Doc 6 F40 already notes that financial services trigger a DPIA. That finding is right about raw balances but does not cover inferences drawn from them, which are sensitive.

### 4.10 Construct specification and template contract (owned by Doc 3; rendered by Doc 8 and System H; V-007)

Doc 3 owns one machine-readable specification per construct. Doc 8 renders it and does not restate window, statistic or wording. The specification for construct 6:

```yaml
construct: spending_after_income
spec_version: 0.2
owner: doc03-behavioural
consent_required: [behavioural_statistics]
decision_link: end_of_cycle_shortfall_cost      # construct 6a; if zero for 6 cycles, show as guardrail only
inputs:
  ledger: C1 postings; categories from C1.3 classification with C4 band
  status_tier: C3 conclusion-driving
  income_anchor: exactly one user-confirmed income stream (Doc 4 4.3.1); otherwise template L4.no_anchor
window: {days_after_credit: [0, 6], comparison: [7, end_of_cycle], anchor: value_date_of_salary_credit}
statistic: ratio of mean flexible-category spend per day, window / comparison
flexible_categories: user-marked
exclude_and_size: [scheduled_recurring, user_confirmed_obligation, currency_conversion,
                   investment_contribution, in_transit, fees_and_levies]
checks_shown: [posting_lag, cash_in_window, bulk_purchase, several_income_streams,
               partner_paid, card_repayment_cycle, weekday_composition, salary_date_drift]
inference: {test: circular_shift, unit: pay_cycle, looks: [6, 12, 24, every_12],
            alpha_per_look: 0.017, interval: cycle_bootstrap_approximate_below_10_cycles}
gates: {min_cycles: noise_calibrated_power_0.8_at_1.3x, data_quality: doc03_4.2_gate,
        persistence: hold_between_looks}
rope: [0.90, 1.10]
max_rung: L1
templates: [L0b.window_totals, L1.after_income, L1.possible, L1.too_early, L4.no_anchor]
context_template: L2a.after_income          # never raises the indicator
ux_rung_display: {L0a: fact, L0b: fact, L1: headline, L2b: headline_top, L2a: research_context_only, L3: not_tested_yet_only}
```

**Template text (C2 token form).** Only the renderer resolves tokens. The model may only *select* a template ID whose rung is at or below the construct's current rung, and may not add connecting text to a behavioural card. This is the template enforcement C2.6 item 3 assigns to Doc 3.

```text
L1.after_income:
  Over {{count:cyc_n}} pay cycles, spending in categories you marked as flexible during the
  {{count:win_days}} days after salary arrived averaged {{calc:pay6.ratio|as=behav.after_income_ratio|fmt=times1}}
  the rate on other days (approximate range {{range:pay6.ci}}). This held in {{count:cyc_held}} of
  {{count:cyc_n}} cycles. Removed before this was calculated: bills and fees
  {{fig:pay6_x_bills|as=behav.excluded_bills|fmt=money0}}, currency conversions
  {{fig:pay6_x_fx|as=behav.excluded_conversions|fmt=money0}}, investment contributions
  {{fig:pay6_x_inv|as=behav.excluded_investment|fmt=money0}}, transfers you marked as family
  {{fig:pay6_x_fam|as=behav.excluded_family|fmt=money0}}.
L2a.after_income:
  Large bank-data studies in the United States and Iceland found a similar pattern after income
  arrives. They disagree on why: bills timed with pay, attention, and available cash all play a part.
  This describes those studies, not you.
```

**Doc 8 card rules that follow from the specification.**
1. Use the specification's window and statistic, with the interval.
2. A share appears only next to its no-pattern baseline.
3. Checks already removed are shown with their size. "Other explanations" lists only checks still open.
4. The displayed rung maps one-to-one to the rung IDs above. The top rung means a within-person randomised result, never the evidence grade of a cited study (v0.1 Doc 8 showed ■■■ for "Doc 3 grade E1–E2").
5. "Test something" offers L3 hypotheses with the data that would resolve them. It never offers a before/after test.

Conformance is tested in §9 item 5.

## 5. Alternatives considered and rejected

| Alternative | Why rejected (for now) |
|---|---|
| **Structural estimation of a personal prospect-theory or β–δ model from transactions** | Not identified from spending data; parameters are context-dependent and unstable (F1, F2, F4, F22) |
| **Machine-learned "behavioural profile" or clustering against a population** | n = 1; non-ergodicity (F25); no Nigerian or UAE reference population; label risk (§4.7); profiling (§4.9) |
| **Large language model reading transactions and narrating psychology** | The fabrication path the brief warns about (lesson 4); excluded by C2 and §4.10 |
| **Gamified streaks, badges, social leaderboards** | Peer comparison backfires among low savers (F26); autonomy concerns (F29). We found no source on durable individual benefit (unsourced in v0.1; now stated as an absence of evidence) |
| **Composite financial-health score** | Hides uncertainty; the validated instrument (CFPB) is self-report |
| **Within-person ABAB prompt pilot in the personal MVP** (v0.1 Rec 5) | Power zero at 6 months and 0.13–0.36 at 12 for a 15% effect; carry-over; calendar confounding; no blinding; upload burden (§4.5 Step 8, §4.6) |
| **24 cycles as a sufficient minimum for 15% effects** (R03 B1 proposal) | Power 0.67 under clean noise and 0.19 under lumpy noise (script §F). Retained only for ≥ 30% effects, as an option |
| **Auto-sweep, auto-conversion, trade friction inside the product** | Doc 4 R13 (regulated payment activity); no order routing. Kept as later-stage options (§4.6) |
| **Bayesian posterior-versus-ROPE as the decision rule, with a null-centred prior** | Mixed with frequentist control in v0.1 (R03 M7). A hierarchical prior centred on the population mean (Adolf & Fried [S172]) needs many users, so it is deferred to the commercial phase |
| **Anytime-valid inference (confidence sequences, e-values)** | Attractive for continuous monitoring, but with three scheduled looks a Bonferroni split is simpler to audit. Revisit if looks become frequent |
| **Benjamini–Hochberg across 15 constructs** | Most constructs are arithmetic; tests are counted instead (§4.3) |
| **Grable–Lytton 13-item annually as the tolerance measure** (Doc 4 §4.4.4) | 13 items a year against a "do not overwhelm" rule; no licence terms found (F23a); US norms. The SOEP/GPS item, fielded in Nigeria and the UAE by the GPS, is preferred (§6, R15) |
| **Big Three literacy and the fragility item for the founder** | Ceiling effects; the fragility item duplicates construct 3; the "$2,000" anchor is not equivalent across currencies (R03 M4, R03b M3) |
| **CFPB score as the intervention outcome** | MDC95 ≈ 14 (10-item) or ≈ 19 (5-item); frequency does not match the design |
| **Classifying payday FX purchases as "hedging" by rule** | Writes a rational explanation in by default; ignores spread and Doc 6's foreign-asset rule (V-030) |
| **Inferring festival seasonality from the data** | Reveals religion (§4.9.5) |
| **Treating ajo/esusu and family transfers as "leakage"** | They are commitment and insurance mechanisms (F18, F19) |
| **Classical between-subject A/B testing** | Impossible at n = 1; appropriate at commercialisation (§4.6) |
| **Daily portfolio profit-and-loss notifications** | Myopic loss aversion (F11) and attention-induced trading (F7) suggest harm |

## 6. Cross-department dependencies

**We need from others.**
- *System A / Doc 4 (data and personal finance):*
  - (1) The transfer-match precision and recall measured on review-queue decisions, and the PPS audit sample (§4.2 gate).
  - (2) Income streams with credit dates and a confirmed-anchor flag.
  - (3) The taxonomy mapping below, including a sensitive flag on religious giving.
  - (4) **Risk instrument:** Doc 4 §4.4.4 should replace "Grable–Lytton 13-item, annually" with the SOEP/GPS item asked just in time (F23, F23a). Grable–Lytton stays optional only after written permission. This disagreement is preserved as R15 until Doc 4 decides.
  - (5) Doc 4's ask (v0.2 §6; v0.1 §9 item 10) is answered here: instrument licensing is F23a and the budget-view experiment is §4.6.
  - (6) The R13 conflict is resolved on our side by removing in-product automation from Doc 3.
- *Doc 8 (UX):* Doc 8 v0.2 was revised in parallel; we read it on 2026-11-04. It already:
  - renders cards from this document's specification;
  - removes the within-person experiment offer;
  - shows the rung in words, with a no-pattern baseline;
  - gates cards on behavioural consent and the sensitive-inference register;
  - asks the risk item just in time.

  Remaining asks:
  - (a) adopt the v0.2 rung IDs (L0a/L0b, L2a, L2b), which its §4.5.6 anticipates;
  - (b) replace the v0.1 day-level range "1.4 to 1.8" with the v0.2 cycle-level range (1.5–1.8, labelled approximate);
  - (c) add to its lint the §4.7 terms its merged list lacks: severity, inertia, ostrich, loss-averse, overspend, discretionary (in user copy), normal for, like you, typical of you, stable trait, worked/failed for interventions;
  - (d) qualify "delete everything" per §4.9.6;
  - (e) delete any remaining "Behavioural: more frequent nudges" disagreement. Doc 3 argues the opposite (F11, F27), and the real tension (pay-eve prompts against notifications off by default) disappears now that prompts are out of the MVP.
- *Doc 6 (tax):*
  - Retention split (§4.9.6).
  - F40 should note that inferences can be sensitive.
  - The §4.6 trigger should read "controller other than the founder or a second user".
  - Supply the `NG-CGT-FOREIGN-ASSETS-2026` flag for construct 4.
  - Tax no longer needs to confirm the ₦50 duty: Doc 6 F21 has done so (F21).
- *System C/D (research, quant):* concentration and currency exposure (construct 7) are theirs. We ask them for a joint PGR−PLR precision simulation once the trade-count distribution is known.
- *System H (AI):* token rendering per C2 and template selection per §4.10, with refusal (`L4.*`) when a construct is not establishable.
- *Legal / compliance:* review §4.9, the consent texts, the licensing table F23a and the §4.6 protocol, and confirm that none of this is regulated advice.
- *Founder:*
  - Do they have one pay cycle or several?
  - Have they had any overdraft fees, high-cost borrowing or skipped contributions?
  - How often do they trade?
  - Who is the controller, and which cloud processors are used?
  - Which calendar events do they declare?
  - Who reviews pre-registrations?
  - Will they upload every institution monthly?

**Taxonomy mapping (Doc 3 partitions to Doc 4 sources; R03 §5.4).**

| Doc 3 partition | Doc 4 source |
|---|---|
| Flexible spending | Consumption-expense categories in Doc 4 §4.3.5 that the user marks as flexible (none marked by default) |
| Scheduled | Doc 4 recurring-outflow objects and `is_essential` |
| Obligation / family | User-confirmed counterparties. Doc 4 v0.2's "Giving & family" rows: remittance to family (`TransferOut:Family`; sensitive under the PDPL) and religious or charitable giving (to be flagged sensitive; excluded by default). School fees are scheduled |
| Currency conversion | C1 `exchange` entries, including Doc 4's purchase of FX into one's own domiciliary account (already a transfer) |
| Investment contribution | Transfers to brokerage and pension accounts (Doc 4 §4.3.3) |
| Fees and levies | `Expenses:BankCharges:*` |

**Others need from us.**
- The ladder, template IDs and construct specifications (System H, Doc 8).
- The data-quality gate and scheduled-look calendar (System A's scheduler).
- The prohibited outputs and merged vocabulary (all teams).
- The sensitive-inference register and consent split (Legal, Doc 8, Doc 7).
- The licensing table (Legal, Doc 4).

## 7. Risks, open uncertainties and disagreements

**R1. Is behavioural analysis worth building for one person? (central disagreement, restated).**
- *Statistician:* nothing inferential beyond the payday guardrail should ship until noise and shortfall cost are measured.
- *Behavioural economist:* the L0b views (charges, fees, conversion cost, buffer) have value from month one and carry no inference risk.
- *Planner (R03b M1):* timing within a cycle costs almost nothing unless it causes shortfalls.
- *Resolution:* ship the L0b views and the guardrail. Make construct 6 a decision measure only if 6a is non-zero (Rec 3), and downgrade it otherwise after 6 cycles.

**R2. Loss aversion as a foundation.** Estimates range from λ ≈ 1.96 [S8] to 1.31 [S167] depending on the method. Loss aversion is used only as an L3 label (unchanged).

**R3. Mechanism of the payday pattern.** The literature disagrees [S64, S65, S67, S68], so the product names no mechanism (L2a only).

**R4. Nudge effect sizes.** The bias-corrected finance-domain effect is null [S143]; "structure" interventions are undecided; Mertens et al. disclosed included retracted data [S168].
- *Behavioural economist:* a motivated founder may respond more than average.
- *Statistician:* that is a hypothesis this design cannot test (§4.5 Step 8).

**R5. Context evidence is thin.** African retail-investor and Nigerian transaction-data evidence was not searched (unchanged).

**R6. Instrument norms and licensing.** These are US-developed instruments with no measurement-invariance evidence for Nigeria or the UAE. The GPS risk item was fielded in Nigeria (Hausa, Igbo, Pidgin) and the UAE (Arabic), but under a non-commercial licence (F23a).

**R7. Data quality dominates** (8.03× against 1.60×). The value-weighted gate (§4.2) mitigates it.

**R8. Ethics and autonomy** (unchanged): Legal and the user draw the line between architecture and manipulation.

**R9. Unverified items:** S140 and S148 magnitudes; S162; S106; NBS core CPI (12.95% on the NBS dashboard and in Doc 4 against 13.29% in the press); the PDPL primary text.

**R10. Unknowns the founder must confirm:** pay cycles, shortfall cost, trading frequency, controller, declared calendar events.

**R11. Founder as subject, designer and analyst** (R03 M9). There is no blinding; reactivity [S76] contaminates any baseline; expectancy. Any experiment uses tamper-evident pre-registration and an outside reviewer (§4.3, §4.6).

**R12. Carry-over and calendar confounding** (R03 B1). These are modelled in script §F: 50% carry-over roughly halves power. Blocking on declared events is required.

**R13. Upload burden** (R03b M2). Without open banking, every construct depends on monthly manual uploads. Removing the 12-month pilot reduces, but does not remove, this risk.

**R14. Privacy** (V-028). This is blocking at the first external user until counsel review and a DPIA (§4.9).

**R15. Disagreement with Doc 4 on the risk instrument.**
- *Doc 4:* Grable–Lytton 13-item annually.
- *Doc 3:* the SOEP/GPS single item, just in time, with one retest. Fewer items, available in Nigerian languages and Arabic, but licensed non-commercial.
- *Proposed resolution:* Doc 4 owner decides in its revision, and Legal confirms licensing for either instrument before System I.

**R16. Disagreement with reviewers, preserved.**
- (a) R03 B1's 24-cycle minimum for 15% effects is not enough under realistic noise; we drop the trial instead.
- (b) R03 M7 proposes a population-centred prior; we drop Bayesian decision rules for n = 1 and defer hierarchical priors to the commercial phase.
- (c) R03b §2b suggests keeping "the circular-shift interval". A circular shift gives a test, not an interval, so we pair it with a cycle-level bootstrap range labelled approximate.

## 8. Recommendations, ranked

| # | Recommendation | Class | Five-question test (1 problem · 2 who/why · 3 evidence · 4 build/validate · 5 measurable improvement) |
|---|---|---|---|
| 1 | Claims ladder v0.2, rung-tagged templates through C2 tokens, prohibited outputs and merged vocabulary (§4.1, §4.7, §4.10) | **Personal-MVP must-have** | 1 Unsupported psychological statements mislead decisions; Doc 8 v0.1's card showed an implied 4.0× as "38%" with no baseline · 2 Founder now; every later user · 3 The ladder is an E4/E5 design, motivated by E1 evidence of replication fragility and the non-ergodicity argument (F12, F25); it is not itself evidence-tested · 4 Template engine; C2 tests T2-01–T2-12 run on behavioural templates; 100 adversarial synthetic ledgers · 5 Zero behavioural sentences outside templates in CI; every L1 card carries interval, cycles and sized checks; founder's correction rate on behavioural cards below 10% (E5 target) |
| 2 | Decision-linked L0b views: recurring charges, fees/levies/conversion cost, liquidity buffer by currency, currency conversions (constructs 1–4) | **Personal-MVP must-have** | 1 Money lost to unwanted charges, fees and conversion spreads (official–parallel gap 2.8–3.2% on 29–30 Oct 2026, script §L), and reserves held in the wrong currency · 2 Founder; multi-currency life makes this hard by hand · 3 F14 (E2, US); F21 (E2 duty; E3 charges); value to founder E6 until measured · 4 Arithmetic on the reconciled ledger; validated against statements · 5 After a 3-month baseline the founder sets a ₦ threshold; continue only if annualised charges cancelled plus fees and spread avoided exceed it; otherwise reduce to a quarterly report |
| 3 | Spending after income (construct 6) as a guardrail, and as a decision measure only if shortfall cost (6a) is non-zero | **Personal-MVP must-have** (guardrail and 6a). Decision use **conditional** | 1 Problem stated in money: end-of-cycle shortfall cost (overdraft and NSF fees, high-cost borrowing, contributions skipped in Y of 6 cycles); without the guardrail a naïve app reports an 8× "splurge" · 2 Founder, if paid on one cycle (confirm) · 3 F13 E1 phenomenon (US, Iceland); E6 applicability · 4 §4.5 pipeline; noise-calibrated gate · 5 6a falls to the founder's target; if 6a is zero for 6 cycles, construct 6 stays a guardrail and its decision use moves to *Later* |
| 4 | Privacy design (§4.9): separate consents, sensitive-inference register, separate retention, local rendering, DPIA | **Personal-MVP must-have** (design); **blocking** at first external user | 1 Profiling and sensitive inferences without a lawful basis expose users and the company · 2 Every user; the founder's kin already appear in the ledger · 3 NDPA text E2 (F30); PDPL E3 · 4 Consent UI; deletion test (behavioural store emptied, tax vault untouched); audit for sensitive categories · 5 Counsel sign-off and DPIA before a second user; zero sensitive-category inferences in audit |
| 5 | Questionnaires cut to 7 items in year one: SOEP/GPS risk item just in time plus one retest; CFPB 5-item annually, optional | **Personal-MVP must-have** (risk item); CFPB optional | 1 Portfolio benchmarks (System D/E) need stated willingness, which behaviour cannot reveal · 2 Founder · 3 S114 (E2); GPS fielding in Nigeria and the UAE [S177]; E4 for local validity · 4 Item plus retest; MDC stated · 5 Personal measurement error known before the first benchmark is shown; no change smaller than the MDC is ever reported |
| 6 | Decisions tracked at L0b: a bank standing order the founder sets up is recorded and described before/after | **Personal-MVP** (low cost) | 1 Saving rules are adopted but rarely tracked · 2 Founder · 3 Commitment-device evidence (F20, E1 low- and middle-income countries; take-up selective) · 4 Decision record plus Doc 4 savings-rate series · 5 Savings rate and buffer against the founder's own target; no causal claim |
| 7 | Within-person intervention protocol (§4.6) | **Later** (commercial between-person trials; founder n-of-1 only for ≥ 30% effects and ≥ 24 cycles) | Power and feasibility per §4.5 Step 8 |
| 8 | Auto-sweep, auto-conversion and trade friction inside the product | **Do-not-build (yet)** | Doc 4 R13; no order routing. Revisit only with a licensed partner |
| 9 | Disposition tax-lot view; turnover and costs | **Later** | Needs lots, validated prices and ≥ 30 sale days a year; ±0.15 precision needs about 58 gains and 58 losses |
| 10 | Budget-envelope deviation; budget-view experiment | **Later** (between-person at commercialisation, about 392 users per arm for 2 pp) | §4.6 |
| 11 | Peer comparison, labels, health score, free-text LLM psychology, parameter estimation, app-open metrics, attention or rank metrics, sensitive inferences, behavioural credit scoring, sale of behavioural data, real-time overspend alerts, emotion inference, questionnaire risk profiles as suitability | **Do-not-build (yet)** | §4.7 |
| 12 | Population behavioural segmentation | **Do-not-build (yet)** | Revisit with consented cohorts, local validation, DPIA and ethics review at System I |

## 9. Required validation before implementation

1. **Data-quality gate (§4.2).**
   - Transfer-match precision ≥ 0.98 and recall ≥ 0.95 on review-queue decisions.
   - The monthly PPS audit of 10 auto-applied items.
   - Value-weighted window error ≤ 2%.
   - Behavioural constructs 6 and 8–10 are disabled below the gate.
2. **Noise calibration.** From the founder's first 3 months:
   - estimate σ of log daily flexible spend and the zero-day share;
   - re-run script §D and §E with those values;
   - set the minimum cycles and α per look;
   - publish the empirical size of the circular-shift test.
3. **Shortfall cost.** Measure construct 6a over the first 6 cycles. The result decides Rec 3.
4. **Template red-team.**
   - 100 synthetic ledgers, including missing months, salary-date drift, several income streams, large one-off transfers and lumpy spending.
   - C2 tests T2-01–T2-12 applied to behavioural templates.
   - No sentence above its rung.
   - The merged lint list passes Doc 8 copy.
5. **Doc 8 conformance.**
   - Every behavioural card is generated from a §4.10 specification.
   - The indicator matches the rung.
   - No share appears without its baseline.
   - No before/after offer appears.
6. **Questionnaire.** Risk item plus one retest four weeks later. The founder's personal difference is recorded against the MDC.
7. **Licensing (F23a).**
   - Before any commercial use, obtain written permission or replace any instrument not cleared. The GPS item is CC BY-NC-SA; DOSPERT and Grable–Lytton have no licence terms found.
   - Confirm the CFPB scale's public-domain status (E4).
8. **Privacy.**
   - Counsel review of §4.9.
   - Consent UI with four separate consents.
   - Withdrawal deletion test: behavioural store emptied within 30 days; tax vault untouched.
   - DPIA before a second user.
9. **Source clean-up.**
   - S140 and S148 magnitudes.
   - NBS core CPI (PDF).
   - S106.
   - S162.
   - The PDPL primary text and article numbers.
   - Comparison of the NDPA copy read with the gazetted Act.
10. **Freshness (C3.5).** Every CPI, FX and levy value carries an evidence snapshot taken at entry and a calendar-derived expiry.
11. **Brokerage precision.** A joint simulation with Quant on the real trade-count distribution, if the founder trades on ≥ 30 sale days a year.

## 10. Sources

Academic sources were verified by DOI against OpenAlex (with Crossref where noted) on 2026-11-02. Entries S47, S148, S160 and S61 were also confirmed with the hosted verify tool on 2026-11-04. v0.2 (2026-11-04) corrected S47, S142, S151 and S160 and added S167–S179, each checked as stated in its entry. Each entry gives: authors (year). Title. Venue. DOI. Verification status. Access date is 2026-11-02 unless stated. Non-academic and time-sensitive sources follow at S103–S107, S119 and S162.

- **S1** Daniel J. Kahneman, Amos Tversky (1979). Prospect Theory: An Analysis of Decision under Risk. *Econometrica*. https://doi.org/10.2307/1914185 — [verified: OpenAlex DOI]
- **S2** Amos Tversky, Daniel J. Kahneman (1992). Advances in prospect theory: Cumulative representation of uncertainty. *Journal of Risk and Uncertainty*. https://doi.org/10.1007/BF00122574 — [verified: OpenAlex DOI]
- **S3** Kai Ruggeri, Sonia Alì, Mari Louise Berge, Giulia Bertoldo et al. (2020). Replicating patterns of prospect theory for decision under risk. *Nature Human Behaviour*. https://doi.org/10.1038/s41562-020-0886-x — [verified: OpenAlex DOI]
- **S4** Nicholas C. Barberis (2013). Thirty Years of Prospect Theory in Economics: A Review and Assessment. *The Journal of Economic Perspectives*. https://doi.org/10.1257/jep.27.1.173 — [verified: OpenAlex DOI]
- **S5** David Gal, Derek D. Rucker (2018). The Loss of Loss Aversion: Will It Loom Larger Than Its Gain?. *Journal of Consumer Psychology*. https://doi.org/10.1002/jcpy.1047 — [verified: OpenAlex DOI]
- **S6** Lukasz Walasek, Neil Stewart (2014). How to make loss aversion disappear and reverse: Tests of the decision by sampling origin of loss aversion.. *Journal of Experimental Psychology General*. https://doi.org/10.1037/xge0000039 — [verified: OpenAlex DOI]
- **S7** Kellen Mrkva, Eric J. Johnson, Simon Gächter, Andreas Peter Herrmann (2019). Moderating Loss Aversion: Loss Aversion Has Moderators, But Reports of its Death are Greatly Exaggerated. *Journal of Consumer Psychology*. https://doi.org/10.1002/jcpy.1156 — [verified: OpenAlex DOI]
- **S8** Alexander L. Brown, Taisuke Imai, Ferdinand M. Vieider, Colin F. Camerer (2024). Meta-analysis of Empirical Estimates of Loss Aversion. *Journal of Economic Literature*. https://doi.org/10.1257/jel.20221698 — [verified: OpenAlex DOI]
- **S9** Daniel J. Kahneman, Jack L. Knetsch, Richard H. Thaler (1991). Anomalies: The Endowment Effect, Loss Aversion, and Status Quo Bias. *The Journal of Economic Perspectives*. https://doi.org/10.1257/jep.5.1.193 — [verified: OpenAlex DOI]
- **S10** Richard H. Thaler (1985). Mental Accounting and Consumer Choice. *Marketing Science*. https://doi.org/10.1287/mksc.4.3.199 — [verified: OpenAlex DOI]
- **S11** Richard H. Thaler (1999). Mental accounting matters. *Journal of Behavioral Decision Making*. https://doi.org/10.1002/(SICI)1099-0771(199909)12:3<183::AID-BDM318>3.0.CO;2-F — [verified: OpenAlex DOI]
- **S12** Hersh Shefrin, Richard H. Thaler (1988). THE BEHAVIORAL LIFE‐CYCLE HYPOTHESIS. *Economic Inquiry*. https://doi.org/10.1111/j.1465-7295.1988.tb01520.x — [verified: OpenAlex DOI]
- **S13** Chip Heath, Jack B. Soll (1996). Mental Budgeting and Consumer Decisions. *Journal of Consumer Research*. https://doi.org/10.1086/209465 — [verified: OpenAlex DOI]
- **S14** Justine Hastings, Jesse M. Shapiro (2013). Fungibility and Consumer Choice: Evidence from Commodity Price Shocks*. *The Quarterly Journal of Economics*. https://doi.org/10.1093/qje/qjt018 — [verified: OpenAlex DOI]
- **S15** Justine Hastings, Jesse M. Shapiro (2018). How Are SNAP Benefits Spent? Evidence from a Retail Panel. *American Economic Review*. https://doi.org/10.1257/aer.20170866 — [verified: OpenAlex DOI]
- **S16** Katherine L. Milkman, John Leonard Beshears (2009). Mental accounting and small windfalls: Evidence from an online grocer. *Journal of Economic Behavior & Organization*. https://doi.org/10.1016/j.jebo.2009.04.007 — [verified: OpenAlex DOI]
- **S17** Abigail B. Sussman, Rourke O’Brien (2015). Knowing When to Spend: Unintended Financial Consequences of Earmarking to Encourage Savings. *Journal of Marketing Research*. https://doi.org/10.1509/jmr.14.0455 — [verified: OpenAlex DOI]
- **S18** David Laibson (1997). Golden Eggs and Hyperbolic Discounting. *The Quarterly Journal of Economics*. https://doi.org/10.1162/003355397555253 — [verified: OpenAlex DOI]
- **S19** Ted O’Donoghue, Matthew Rabin (1999). Doing It Now or Later. *American Economic Review*. https://doi.org/10.1257/aer.89.1.103 — [verified: OpenAlex DOI]
- **S20** Jonathan D. Cohen, Keith M. Marzilli Ericson, David Laibson, J.M. White (2020). Measuring Time Preferences. *Journal of Economic Literature*. https://doi.org/10.1257/jel.20191074 — [verified: OpenAlex DOI]
- **S21** Taisuke Imai, Tom A Rutter, Colin F. Camerer (2020). Meta-Analysis of Present-Bias Estimation using Convex Time Budgets. *The Economic Journal*. https://doi.org/10.1093/ej/ueaa115 — [verified: OpenAlex DOI]
- **S22** Ned Augenblick, Muriel Niederle, Charles D. Sprenger (2015). Working over Time: Dynamic Inconsistency in Real Effort Tasks *. *The Quarterly Journal of Economics*. https://doi.org/10.1093/qje/qjv020 — [verified: OpenAlex DOI]
- **S23** Stephan Meier, Charles D. Sprenger (2009). Present-Biased Preferences and Credit Card Borrowing. *American Economic Journal Applied Economics*. https://doi.org/10.1257/app.2.1.193 — [verified: OpenAlex DOI]
- **S24** Theresa Kuchler, Michaela Pagel (2020). Sticking to your plan: The role of present bias for credit card paydown. *Journal of Financial Economics*. https://doi.org/10.1016/j.jfineco.2020.08.002 — [verified: OpenAlex DOI]
- **S25** Brad M. Barber, Terrance Odean B (2000). Trading Is Hazardous to Your Wealth: The Common Stock Investment Performance of Individual Investors. *The Journal of Finance*. https://doi.org/10.1111/0022-1082.00226 — [verified: OpenAlex DOI]
- **S26** Brad M. Barber, Terry Odean (2001). Boys will be Boys: Gender, Overconfidence, and Common Stock Investment. *The Quarterly Journal of Economics*. https://doi.org/10.1162/003355301556400 — [verified: OpenAlex DOI]
- **S27** Terrance Odean B (1999). Do Investors Trade Too Much?. *American Economic Review*. https://doi.org/10.1257/aer.89.5.1279 — [verified: OpenAlex DOI]
- **S28** Terrance Odean B (1998). Are Investors Reluctant to Realize Their Losses?. *The Journal of Finance*. https://doi.org/10.1111/0022-1082.00072 — [verified: OpenAlex DOI]
- **S29** Hersh Shefrin, Meir Statman (1985). The Disposition to Sell Winners Too Early and Ride Losers Too Long: Theory and Evidence. *The Journal of Finance*. https://doi.org/10.1111/j.1540-6261.1985.tb05002.x — [verified: OpenAlex DOI]
- **S30** Itzhak Ben‐David, David A. Hirshleifer (2012). Are Investors Really Reluctant to Realize Their Losses? Trading Responses to Past Returns and the Disposition Effect. *Review of Financial Studies*. https://doi.org/10.1093/rfs/hhs077 — [verified: OpenAlex DOI]
- **S31** Samuel M. Hartzmark (2014). The Worst, the Best, Ignoring All the Rest: The Rank Effect and Trading Behavior. *Review of Financial Studies*. https://doi.org/10.1093/rfs/hhu079 — [verified: OpenAlex DOI]
- **S32** Cary Frydman, Antonio Rangel (2014). Debiasing the disposition effect by reducing the saliency of information about a stock's purchase price. *Journal of Economic Behavior & Organization*. https://doi.org/10.1016/j.jebo.2014.01.017 — [verified: OpenAlex DOI]
- **S33** Laurent E. Calvet, John Y. Campbell, Paolo Sodini (2009). Fight Or Flight? Portfolio Rebalancing by Individual Investors *. *The Quarterly Journal of Economics*. https://doi.org/10.1162/qjec.2009.124.1.301 — [verified: OpenAlex DOI]
- **S34** William F. Samuelson, Richard Zeckhauser (1988). Status quo bias in decision making. *Journal of Risk and Uncertainty*. https://doi.org/10.1007/BF00055564 — [verified: OpenAlex DOI]
- **S35** Brigitte C. Madrian, Dennis F. Shea (2001). The Power of Suggestion: Inertia in 401(k) Participation and Savings Behavior. *The Quarterly Journal of Economics*. https://doi.org/10.1162/003355301753265543 — [verified: OpenAlex DOI]
- **S36** Amos Tversky, Daniel J. Kahneman (1974). Judgment under Uncertainty: Heuristics and Biases. *Science*. https://doi.org/10.1126/science.185.4157.1124 — [verified: OpenAlex DOI]
- **S37** Amos Tversky, Daniel J. Kahneman (1981). The Framing of Decisions and the Psychology of Choice. *Science*. https://doi.org/10.1126/science.7455683 — [verified: OpenAlex DOI]
- **S38** Brad M. Barber, Terrance Odean B (2007). All That Glitters: The Effect of Attention and News on the Buying Behavior of Individual and Institutional Investors. *Review of Financial Studies*. https://doi.org/10.1093/rfs/hhm079 — [verified: OpenAlex DOI]
- **S39** Brad M. Barber, Xing Huang, Terrance Odean B, CHRISTOPHER SCHWARZ (2022). Attention‐Induced Trading and Returns: Evidence from Robinhood Users. *The Journal of Finance*. https://doi.org/10.1111/jofi.13183 — [verified: OpenAlex DOI]
- **S40** Pedro Bordalo, Nicola Gennaioli, Andrei Shleifer (2012). Salience Theory of Choice Under Risk. *The Quarterly Journal of Economics*. https://doi.org/10.1093/qje/qjs018 — [verified: OpenAlex DOI]
- **S41** Dražen Prelec, George F. Loewenstein (1998). The Red and the Black: Mental Accounting of Savings and Debt. *Marketing Science*. https://doi.org/10.1287/mksc.17.1.4 — [verified: OpenAlex DOI]
- **S42** Dražen Prelec, Duncan I. Simester (2001). Always Leave Home Without It: A Further Investigation of the Credit-Card Effect on Willingness to Pay. *Marketing Letters*. https://doi.org/10.1023/A:1008196717017 — [verified: OpenAlex DOI]
- **S43** Dilip Soman (2001). Effects of Payment Mechanism on Spending Behavior: The Role of Rehearsal and Immediacy of Payments. *Journal of Consumer Research*. https://doi.org/10.1086/319621 — [verified: OpenAlex DOI]
- **S44** Annamaria Lusardi, Olivia S. Mitchell (2014). The Economic Importance of Financial Literacy: Theory and Evidence. *Journal of Economic Literature*. https://doi.org/10.1257/jel.52.1.5 — [verified: OpenAlex DOI]
- **S45** Annamaria Lusardi, Olivia S. Mitchell (2011). Financial literacy around the world: an overview. *Journal of Pensions Economics and Finance*. https://doi.org/10.1017/S1474747211000448 — [verified: OpenAlex DOI]
- **S46** Daniel Von Der Heyde Fernandes, John G Lynch, Richard G. Netemeyer (2014). Financial Literacy, Financial Education, and Downstream Financial Behaviors. *Management Science*. https://doi.org/10.1287/mnsc.2013.1849 — [verified: OpenAlex DOI]
- **S47** Tim Kaiser, Annamaria Lusardi, Lukas Menkhoff, Carly Urban (2022). Financial education affects financial knowledge and downstream behaviors. *Journal of Financial Economics*. https://doi.org/10.1016/j.jfineco.2021.09.022 — [verified: OpenAlex DOI] Published August 2022 per Crossref; v0.1 said 2021. Abstract figures (76 randomised experiments, over 160,000 people, "at least three times as large") are from NBER w27057, https://www.nber.org/papers/w27057, fetched 2026-11-04.
- **S48** John Y. Campbell (2006). Household Finance. *The Journal of Finance*. https://doi.org/10.1111/j.1540-6261.2006.00883.x — [verified: OpenAlex DOI] (Journal of Finance 61(4), presidential address)
- **S49** Shlomo Benartzi, Richard H. Thaler (1995). Myopic Loss Aversion and the Equity Premium Puzzle. *The Quarterly Journal of Economics*. https://doi.org/10.2307/2118511 — [verified: OpenAlex DOI]
- **S50** Uri Gneezy B, Jan Potters (1997). An Experiment on Risk Taking and Evaluation Periods. *The Quarterly Journal of Economics*. https://doi.org/10.1162/003355397555217 — [verified: OpenAlex DOI]
- **S51** Shlomo Benartzi, Richard H. Thaler (2001). Naive Diversification Strategies in Defined Contribution Saving Plans. *American Economic Review*. https://doi.org/10.1257/aer.91.1.79 — [verified: OpenAlex DOI]
- **S52** William Nelson Goetzmann, Alok Kumar (2008). Equity Portfolio Diversification. *European Finance Review*. https://doi.org/10.1093/rof/rfn005 — [verified: OpenAlex DOI]
- **S53** Kenneth R. French, James M. Poterba (1991). Investor Diversification and International Equity Markets. *National Bureau of Economic Research*. https://doi.org/10.3386/w3609 — [verified: OpenAlex DOI] (NBER working-paper version; the AER Papers & Proceedings version has no DOI)
- **S54** Nachum Sicherman, George F. Loewenstein, Duane J. Seppi, Stephen P. Utkus (2015). Financial Attention. *Review of Financial Studies*. https://doi.org/10.1093/rfs/hhv073 — [verified: OpenAlex DOI]
- **S55** Niklas Karlsson, George F. Loewenstein, Duane J. Seppi (2009). The ostrich effect: Selective attention to information. *Journal of Risk and Uncertainty*. https://doi.org/10.1007/s11166-009-9060-6 — [verified: OpenAlex DOI]
- **S56** Arna Olafsson, Michaela Pagel (2025). The Ostrich in Us: Selective Attention to Personal Finances. *The Review of Economics and Statistics*. https://doi.org/10.1162/rest_a_01566 — [verified: OpenAlex DOI]
- **S57** Open Science Collaboration (2015). Estimating the reproducibility of psychological science. *Science*. https://doi.org/10.1126/science.aac4716 — [verified: OpenAlex DOI]
- **S58** Colin F. Camerer, Anna Dreber, Eskil Forsell, Teck‐Hua Ho et al. (2016). Evaluating replicability of laboratory experiments in economics. *Science*. https://doi.org/10.1126/science.aaf0918 — [verified: OpenAlex DOI]
- **S59** Anandi Mani, Sendhil Mullainathan, Eldar B. Shafir, Jiaying Zhao (2013). Poverty Impedes Cognitive Function. *Science*. https://doi.org/10.1126/science.1238041 — [verified: OpenAlex DOI]
- **S60** Michael P. O'Donnell, Amelia S. Dev, Stephen Antonoplis, Stephen M. Baum et al. (2021). Empirical audit and review and an assessment of evidentiary value in research on the psychological consequences of scarcity. *Proceedings of the National Academy of Sciences*. https://doi.org/10.1073/pnas.2103313118 — [verified: OpenAlex DOI]
- **S61** Victor Stango, Jonathan Zinman (2009). Exponential Growth Bias and Household Finance. *The Journal of Finance*. https://doi.org/10.1111/j.1540-6261.2009.01518.x — [verified: OpenAlex DOI]
- **S62** Sumit D. Agarwal, John C. Driscoll, Xavier Gabaix, David Laibson (2009). The Age of Reason: Financial Decisions over the Life Cycle and Implications for Regulation. *Brookings Papers on Economic Activity*. https://doi.org/10.1353/eca.0.0067 — [verified: OpenAlex DOI]
- **S63** John Gathergood, Neale Mahoney, Neil Stewart, Jörg Weber (2019). How Do Individuals Repay Their Debt? The Balance-Matching Heuristic. *American Economic Review*. https://doi.org/10.1257/aer.20180288 — [verified: OpenAlex DOI]
- **S64** Michael Gelman, Shachar Kariv, Matthew D. Shapiro, Dan P. Silverman et al. (2014). Harnessing naturally occurring data to measure the response of spending to income. *Science*. https://doi.org/10.1126/science.1247727 — [verified: OpenAlex DOI]
- **S65** Arna Olafsson, Michaela Pagel (2018). The Liquid Hand-to-Mouth: Evidence from Personal Finance Management Software. *Review of Financial Studies*. https://doi.org/10.1093/rfs/hhy055 — [verified: OpenAlex DOI]
- **S66** Melvin Stephens (2003). “3rd of tha Month”: Do Social Security Recipients Smooth Consumption Between Checks?. *American Economic Review*. https://doi.org/10.1257/000282803321455386 — [verified: OpenAlex DOI]
- **S67** Brian Baugh, Itzhak Ben‐David, Hoonsuk Park, Jonathan A. Parker (2020). Asymmetric Consumption Smoothing. *American Economic Review*. https://doi.org/10.1257/aer.20181735 — [verified: OpenAlex DOI]
- **S68** Lorenz Kueng (2018). Excess Sensitivity of High-Income Consumers*. *The Quarterly Journal of Economics*. https://doi.org/10.1093/qje/qjy014 — [verified: OpenAlex DOI]
- **S69** Jesse M. Shapiro (2004). Is there a daily discount rate? Evidence from the food stamp nutrition cycle. *Journal of Public Economics*. https://doi.org/10.1016/j.jpubeco.2004.05.003 — [verified: OpenAlex DOI]
- **S70** Giovanni Mastrobuoni, Matthew Weinberg (2009). Heterogeneity in Intra-Monthly Consumption Patterns, Self-Control, and Savings at Retirement. *American Economic Journal Economic Policy*. https://doi.org/10.1257/pol.1.2.163 — [verified: OpenAlex DOI]
- **S71** Peter Ganong, Pascal Noel (2019). Consumer Spending during Unemployment: Positive and Normative Implications. *American Economic Review*. https://doi.org/10.1257/aer.20170537 — [verified: OpenAlex DOI]
- **S72** Scott Baker (2018). Debt and the Response to Household Income Shocks: Validation and Application of Linked Financial Account Data. *Journal of Political Economy*. https://doi.org/10.1086/698106 — [verified: OpenAlex DOI]
- **S73** Victor Stango, Jonathan Zinman (2014). Limited and Varying Consumer Attention: Evidence from Shocks to the Salience of Bank Overdraft Fees. *Review of Financial Studies*. https://doi.org/10.1093/rfs/hhu008 — [verified: OpenAlex DOI]
- **S74** Liran Einav B, Ben Klopack, Neale Mahoney (2025). Selling Subscriptions. *American Economic Review*. https://doi.org/10.1257/aer.20231612 — [verified: OpenAlex DOI]
- **S75** Bruce Ian Carlin, Arna Olafsson, Michaela Pagel (2022). Mobile Apps and Financial Decision Making. *European Finance Review*. https://doi.org/10.1093/rof/rfac040 — [verified: OpenAlex DOI]
- **S76** Yaron Levi, Shlomo Benartzi (2026). Mind the App: Mobile Access to Financial Information and Consumer Behavior. *The Journal of Finance*. https://doi.org/10.1111/jofi.70087 — [verified: OpenAlex DOI]
- **S77** Francesco D’Acunto, Nagpurnanand R. Prabhala, Alberto G. P. Rossi (2019). The Promises and Pitfalls of Robo-Advising. *Review of Financial Studies*. https://doi.org/10.1093/rfs/hhz014 — [verified: OpenAlex DOI]
- **S78** N. Ashraf, Dean Karlan, Wesley Yin (2006). Tying Odysseus to the Mast: Evidence From a Commitment Savings Product in the Philippines. *The Quarterly Journal of Economics*. https://doi.org/10.1162/qjec.2006.121.2.635 — [verified: OpenAlex DOI]
- **S79** Pascaline Dupas Y, Jonathan Robinson (2013). Savings Constraints and Microenterprise Development: Evidence from a Field Experiment in Kenya. *American Economic Journal Applied Economics*. https://doi.org/10.1257/app.5.1.163 — [verified: OpenAlex DOI]
- **S80** Pascaline Dupas Y, Jonathan Robinson (2013). Why Don't the Poor Save More? Evidence from Health Savings Experiments. *American Economic Review*. https://doi.org/10.1257/aer.103.4.1138 — [verified: OpenAlex DOI]
- **S81** Tavneet Suri, William G. Jack (2016). The long-run poverty and gender impacts of mobile money. *Science*. https://doi.org/10.1126/science.aah5309 — [verified: OpenAlex DOI]
- **S82** William G. Jack, Tavneet Suri (2013). Risk Sharing and Transactions Costs: Evidence from Kenya's Mobile Money Revolution. *American Economic Review*. https://doi.org/10.1257/aer.104.1.183 — [verified: OpenAlex DOI]
- **S83** Emma Riley (2018). Mobile money and risk sharing against village shocks. *Journal of Development Economics*. https://doi.org/10.1016/j.jdeveco.2018.06.015 — [verified: OpenAlex DOI]
- **S84** Cátia Batista, Pedro C. Vicente (2020). Improving access to savings through mobile money: Experimental evidence from African smallholder farmers. *World Development*. https://doi.org/10.1016/j.worlddev.2020.104905 — [verified: OpenAlex DOI]
- **S85** S. Anderson, Jean‐Marie Baland (2002). The Economics of Roscas and Intrahousehold Resource Allocation. *The Quarterly Journal of Economics*. https://doi.org/10.1162/003355302760193931 — [verified: OpenAlex DOI]
- **S86** F.J.A. Bouman (1995). Rotating and accumulating savings and credit associations: A development perspective. *World Development*. https://doi.org/10.1016/0305-750X(94)00141-K — [verified: OpenAlex DOI]
- **S87** Christopher Udry (1990). Credit Markets in Northern Nigeria: Credit as Insurance in a Rural Economy. *The World Bank Economic Review*. https://doi.org/10.1093/wber/4.3.251 — [verified: OpenAlex DOI]
- **S88** Christopher Udry (1994). Risk and Insurance in a Rural Credit Market: An Empirical Investigation in Northern Nigeria. *The Review of Economic Studies*. https://doi.org/10.2307/2297901 — [verified: OpenAlex DOI]
- **S89** Pamela Jakiela, Owen W. Ozier (2015). Does Africa Need a Rotten Kin Theorem? Experimental Evidence from Village Economies. *The Review of Economic Studies*. https://doi.org/10.1093/restud/rdv033 — [verified: OpenAlex DOI]
- **S90** Munir Squires (2024). Kinship Taxation as an Impediment to Growth: Experimental Evidence from Kenyan Microenterprises. *The Economic Journal*. https://doi.org/10.1093/ej/ueae025 — [verified: OpenAlex DOI]
- **S91** Marie Boltz, Karine Marazyan, Paola Villar (2018). Income hiding and informal redistribution: A lab-in-the-field experiment in Senegal. *Journal of Development Economics*. https://doi.org/10.1016/j.jdeveco.2018.11.004 — [verified: OpenAlex DOI]
- **S92** Salvatore Di Falco, Erwin Bulte (2011). A Dark Side of Social Capital? Kinship, Consumption, and Savings. *The Journal of Development Studies*. https://doi.org/10.1080/00220388.2010.514328 — [verified: OpenAlex DOI]
- **S93** Pascaline Dupas Y, Dean Karlan, Jonathan Robinson, Diego Javier Ubfal (2018). Banking the Unbanked? Evidence from Three Countries. *American Economic Journal Applied Economics*. https://doi.org/10.1257/app.20160597 — [verified: OpenAlex DOI]
- **S94** Joshua Evan Blumenstock, Michael J. Callen, Tarek Ghani (2018). Why Do Defaults Affect Behavior? Experimental Evidence from Afghanistan. *American Economic Review*. https://doi.org/10.1257/aer.20171676 — [verified: OpenAlex DOI]
- **S95** Vincent Somville, Lore Vandewalle (2018). Saving by Default: Evidence from a Field Experiment in Rural India. *American Economic Journal Applied Economics*. https://doi.org/10.1257/app.20160547 — [verified: OpenAlex DOI]
- **S96** Nava Ashraf, Diego Aycinena, Claudia Martínez A., Dean Yang (2014). Savings in Transnational Households: A Field Experiment among Migrants from El Salvador. *The Review of Economics and Statistics*. https://doi.org/10.1162/REST_a_00462 — [verified: OpenAlex DOI]
- **S97** Kate Ambler, Diego Aycinena, Dean Yang (2015). Channeling Remittances to Education: A Field Experiment among Migrants from El Salvador. *American Economic Journal Applied Economics*. https://doi.org/10.1257/app.20140010 — [verified: OpenAlex DOI]
- **S98** Dean Yang (2011). Migrant Remittances. *The Journal of Economic Perspectives*. https://doi.org/10.1257/jep.25.3.129 — [verified: OpenAlex DOI]
- **S99** Dean Karlan, Aishwarya Lakshmi Ratan, Jonathan Zinman (2014). Savings by and for the Poor: A Research Review and Agenda. *Review of Income and Wealth*. https://doi.org/10.1111/roiw.12101 — [verified: OpenAlex DOI]
- **S100** Lasse Brune, Xavier Giné A, Jessica Goldberg, Dean Yang (2015). Facilitating Savings for Agriculture: Field Experimental Evidence from Malawi. *Economic Development and Cultural Change*. https://doi.org/10.1086/684014 — [verified: OpenAlex DOI]
- **S101** Alain Ize, Eduardo Levy Yeyati (2003). Financial dollarization. *Journal of International Economics*. https://doi.org/10.1016/S0022-1996(02)00017-X — [verified: OpenAlex DOI]
- **S102** Armin Falk, Anke Becker, Thomas Dohmen, Benjamin Enke et al. (2018). Global Evidence on Economic Preferences*. *The Quarterly Journal of Economics*. https://doi.org/10.1093/qje/qjy013 — [verified: OpenAlex DOI]
- **S108** Anuj Shah, Sendhil Mullainathan, Eldar B. Shafir (2012). Some Consequences of Having Too Little. *Science*. https://doi.org/10.1126/science.1222426 — [verified: OpenAlex DOI]
- **S109** John E. Grable, Ruth H. Lytton (1999). Financial risk tolerance revisited. *Financial Services Review*. https://doi.org/10.1016/S1057-0810(99)00041-4 — [verified: OpenAlex DOI]
- **S110** Stephen F. Kuzniak, Abed G. Rabbani, Wookjae Heo, Jorge Ruiz‐Menjivar et al. (2015). The Grable and Lytton risk-tolerance scale. *Financial Services Review*. https://doi.org/10.61190/fsr.v24i2.3240 — [verified: OpenAlex DOI]
- **S111** Elke U. Weber, Ann-Renée Blais, Nancy E. Betz (2002). A domain‐specific risk‐attitude scale: measuring risk perceptions and risk behaviors. *Journal of Behavioral Decision Making*. https://doi.org/10.1002/bdm.414 — [verified: OpenAlex DOI]
- **S112** Ann-Renée Blais, Elke U. Weber (2006). A Domain-Specific Risk-Taking (DOSPERT) scale for adult populations. *Judgment and Decision Making*. https://doi.org/10.1017/S1930297500000334 — [verified: OpenAlex DOI]
- **S113** Charles A. Holt, Susan K. Laury (2002). Risk Aversion and Incentive Effects. *American Economic Review*. https://doi.org/10.1257/000282802762024700 — [verified: OpenAlex DOI]
- **S114** Thomas Dohmen, Armin Falk, David Huffman, Uwe Sunde et al. (2011). INDIVIDUAL RISK ATTITUDES: MEASUREMENT, DETERMINANTS, AND BEHAVIORAL CONSEQUENCES. *Journal of the European Economic Association*. https://doi.org/10.1111/j.1542-4774.2011.01015.x — [verified: OpenAlex DOI]
- **S115** Renato Frey, Andreas Pedroni, Rui Mata, Jörg Rieskamp et al. (2017). Risk preference shares the psychometric structure of major psychological traits. *Science Advances*. https://doi.org/10.1126/sciadv.1701381 — [verified: OpenAlex DOI]
- **S116** Rui Mata, Renato Frey, David Richter, Jürgen Schupp et al. (2018). Risk Preference: A View from Psychology. *The Journal of Economic Perspectives*. https://doi.org/10.1257/jep.32.2.155 — [verified: OpenAlex DOI]
- **S117** Gary B. Charness, Uri Gneezy B, Alex Imas (2012). Experimental methods: Eliciting risk preferences. *Journal of Economic Behavior & Organization*. https://doi.org/10.1016/j.jebo.2012.12.023 — [verified: OpenAlex DOI]
- **S118** Yating Chuang, Laura Schechter (2015). Stability of experimental and survey measures of risk, time, and social preferences: A review and some new results. *Journal of Development Economics*. https://doi.org/10.1016/j.jdeveco.2015.07.008 — [verified: OpenAlex DOI]
- **S120** John G Lynch, Richard G. Netemeyer, Stephen A. Spiller, Alessandra Zammit (2009). A Generalizable Scale of Propensity to Plan: The Long and the Short of Planning for Time and for Money. *Journal of Consumer Research*. https://doi.org/10.1086/649907 — [verified: OpenAlex DOI]
- **S121** Alan J. Strathman, Faith Gleicher, David S. Boninger, C. Scott Edwards (1994). The consideration of future consequences: Weighing immediate and distant outcomes of behavior.. *Journal of Personality and Social Psychology*. https://doi.org/10.1037/0022-3514.66.4.742 — [verified: OpenAlex DOI]
- **S122** Jim H. Patton, Matthew S. Stanford, Ernest S. Barratt (1995). Factor structure of the barratt impulsiveness scale. *Journal of Clinical Psychology*. https://doi.org/10.1002/1097-4679(199511)51:6<768::AID-JCLP2270510607>3.0.CO;2-1 — [verified: OpenAlex DOI]
- **S123** Annamaria Lusardi, Daniel Schneider, Peter Tufano (2011). Financially Fragile Households: Evidence and Implications. *Brookings Papers on Economic Activity*. https://doi.org/10.1353/eca.2011.0002 — [verified: OpenAlex DOI]
- **S124** Hal Ersner-Hershfield, Daniel G. Goldstein, William F. Sharpe, Jesse Fox et al. (2011). Increasing Saving Behavior Through Age-Progressed Renderings of the Future Self. *Journal of Marketing Research*. https://doi.org/10.1509/jmkr.48.SPL.S23 — [verified: OpenAlex DOI]
- **S125** Peter C. M. Molenaar (2004). A Manifesto on Psychology as Idiographic Science: Bringing the Person Back Into Scientific Psychology, This Time Forever. *Measurement Interdisciplinary Research and Perspectives*. https://doi.org/10.1207/s15366359mea0204_1 — [verified: OpenAlex DOI]
- **S126** Aaron Jason Fisher, John Dominic Medaglia, Bertus F. Jeronimus (2018). Lack of group-to-individual generalizability is a threat to human subjects research. *Proceedings of the National Academy of Sciences*. https://doi.org/10.1073/pnas.1711978115 — [verified: OpenAlex DOI]
- **S127** Suzanne McDonald, Francis X. Quinn, Rute Vieira, Nicola O’Brien et al. (2017). The state of the art and future opportunities for using longitudinal n-of-1 methods in health behaviour research: a systematic literature overview. *Health Psychology Review*. https://doi.org/10.1080/17437199.2017.1316672 — [verified: OpenAlex DOI]
- **S128** Naihua Duan, Richard L. Kravitz, Christopher H. Schmid (2013). Single-patient (n-of-1) trials: a pragmatic clinical decision methodology for patient-centered comparative effectiveness research. *Journal of Clinical Epidemiology*. https://doi.org/10.1016/j.jclinepi.2013.04.006 — [verified: OpenAlex DOI]
- **S129** Richard L. Kravitz, Naihua Duan (2022). Conduct and Implementation of Personalized Trials in Research and Practice. *Harvard Data Science Review*. https://doi.org/10.1162/99608f92.901255e7 — [verified: OpenAlex DOI]
- **S130** Sunita Vohra, Larissa Shamseer, Margaret Sampson, Cecilia Bukutu et al. (2015). CONSORT extension for reporting N-of-1 trials (CENT) 2015 Statement. *BMJ*. https://doi.org/10.1136/bmj.h1738 — [verified: OpenAlex DOI]
- **S131** Thomas R. Kratochwill, John H. Hitchcock, Robert H. Horner, Joel R. Levin et al. (2012). Single-Case Intervention Research Design Standards. *Remedial and Special Education*. https://doi.org/10.1177/0741932512452794 — [verified: OpenAlex DOI]
- **S132** Jamie Lopez Bernal, Steven Cummins, Antonio Gasparrini (2016). Interrupted time series regression for the evaluation of public health interventions: a tutorial. *International Journal of Epidemiology*. https://doi.org/10.1093/ije/dyw098 — [verified: OpenAlex DOI]
- **S133** Anita Katharina Wagner, Stephen B. Soumerai, Fucheng Zhang, Dennis Ross‐Degnan (2002). Segmented regression analysis of interrupted time series studies in medication use research. *Journal of Clinical Pharmacy and Therapeutics*. https://doi.org/10.1046/j.1365-2710.2002.00430.x — [verified: OpenAlex DOI]
- **S134** James C. Benneyan (2003). Statistical process control as a tool for research and healthcare improvement. *BMJ Quality & Safety*. https://doi.org/10.1136/qhc.12.6.458 — [verified: OpenAlex DOI]
- **S135** Jacob Anhøj, Anne Vingaard Olesen (2014). Run Charts Revisited: A Simulation Study of Run Chart Rules for Detection of Non-Random Variation in Health Care Processes. *PLoS ONE*. https://doi.org/10.1371/journal.pone.0113825 — [verified: OpenAlex DOI]
- **S136** Yoav Benjamini, Yosef Hochberg (1995). Controlling the False Discovery Rate: A Practical and Powerful Approach to Multiple Testing. *Journal of the Royal Statistical Society Series B (Statistical Methodology)*. https://doi.org/10.1111/j.2517-6161.1995.tb02031.x — [verified: OpenAlex DOI]
- **S137** Andrew Gelman, Eric Loken (2014). The Statistical Crisis in Science. *American Scientist*. https://doi.org/10.1511/2014.111.460 — [verified: OpenAlex DOI]
- **S138** Katherine Susan Button, John P. A. Ioannidis, Claire Mokrysz, Brian A. Nosek et al. (2013). Power failure: why small sample size undermines the reliability of neuroscience. *Nature reviews. Neuroscience*. https://doi.org/10.1038/nrn3475 — [verified: OpenAlex DOI]
- **S139** John K. Kruschke (2012). Bayesian estimation supersedes the t test.. *Journal of Experimental Psychology General*. https://doi.org/10.1037/a0029146 — [verified: OpenAlex DOI]
- **S140** Richard H. Thaler, Shlomo Benartzi (2004). Save More Tomorrow™: Using Behavioral Economics to Increase Employee Saving. *Journal of Political Economy*. https://doi.org/10.1086/380085 — [verified: OpenAlex DOI]
- **S141** John Leonard Beshears, James J. Choi, David Laibson, Brigitte C. Madrian et al. (2015). The Effect of Providing Peer Information on Retirement Savings Decisions. *The Journal of Finance*. https://doi.org/10.1111/jofi.12258 — [verified: OpenAlex DOI]
- **S142** Stéphanie Mertens, Mario Herberz, Ulf J.J. Hahnel, Tobias Brosch (2021). The effectiveness of nudging: A meta-analysis of choice architecture interventions across behavioral domains. *Proceedings of the National Academy of Sciences*. https://doi.org/10.1073/pnas.2107346118 — [verified: OpenAlex DOI] Carries a publisher correction (S168): retracted Shu et al. (2012) observations, erroneous values and coding errors.
- **S143** Maximilian Maier, Frantis̆ek Bartos̆, T. D. Stanley, David R. Shanks et al. (2022). No evidence for nudging after adjusting for publication bias. *Proceedings of the National Academy of Sciences*. https://doi.org/10.1073/pnas.2200300119 — [verified: OpenAlex DOI]
- **S144** Barnabás Szászi, Anthony Higney, Aaron Charlton, Andrew Gelman et al. (2022). No reason to expect large and consistent effects of nudge interventions. *Proceedings of the National Academy of Sciences*. https://doi.org/10.1073/pnas.2200732119 — [verified: OpenAlex DOI]
- **S145** Stefano DellaVigna, Elizabeth Linos (2022). RCTs to Scale: Comprehensive Evidence From Two Nudge Units. *Econometrica*. https://doi.org/10.3982/ECTA18709 — [verified: OpenAlex DOI]
- **S146** Dennis Hummel, Alexander Maedche (2019). How effective is nudging? A quantitative review on the effect sizes and limits of empirical nudging studies. *Journal of Behavioral and Experimental Economics*. https://doi.org/10.1016/j.socec.2019.03.005 — [verified: OpenAlex DOI]
- **S147** Gharad Bryan, Dean Karlan, Scott Nelson (2010). Commitment Devices. *Annual Review of Economics*. https://doi.org/10.1146/annurev.economics.102308.124324 — [verified: OpenAlex DOI]
- **S148** Peter M. Gollwitzer, Paschal Sheeran (2006). Implementation Intentions and Goal Achievement: A Meta‐analysis of Effects and Processes. *Advances in experimental social psychology*. https://doi.org/10.1016/S0065-2601(06)38002-1 — [verified: OpenAlex DOI]
- **S149** Edwin A. Locke, Gary P. Latham (2002). Building a practically useful theory of goal setting and task motivation: A 35-year odyssey.. *American Psychologist*. https://doi.org/10.1037/0003-066X.57.9.705 — [verified: OpenAlex DOI]
- **S150** Antonio Gargano, Alberto G. P. Rossi (2024). Goal Setting and Saving in the FinTech Era. *The Journal of Finance*. https://doi.org/10.1111/jofi.13339 — [verified: OpenAlex DOI]
- **S151** Dean Karlan, Margaret McConnell, Sendhil Mullainathan, Jonathan Zinman (2016). Getting to the Top of Mind: How Reminders Increase Saving. *Management Science* 62(12). https://doi.org/10.1287/mnsc.2015.2296 — [verified: Crossref 2026-11-04]. *Correction:* v0.1 listed "Sneha Stephen, Keesler Welch" and the venue "AEA Randomized Controlled Trials". Those came from an OpenAlex record that merges this DOI with the trial-registry entry (10.1257/rct.1350-1.0). The hosted tool still returns that merged record, so Crossref governs (R03 m1).
- **S152** Paolina C. Medina (2020). Side Effects of Nudging: Evidence from a Randomized Intervention in the Credit Card Market. *Review of Financial Studies*. https://doi.org/10.1093/rfs/hhaa108 — [verified: OpenAlex DOI]
- **S153** Dilip Soman, Amar Cheema (2011). Earmarking and Partitioning: Increasing Saving by Low-Income Households. *Journal of Marketing Research*. https://doi.org/10.1509/jmkr.48.SPL.S14 — [verified: OpenAlex DOI]
- **S154** Hunt Allcott, Todd Rogers (2014). The Short-Run and Long-Run Effects of Behavioral Interventions: Experimental Evidence from Energy Conservation. *American Economic Review*. https://doi.org/10.1257/aer.104.10.3003 — [verified: OpenAlex DOI]
- **S155** Ralph Hertwig, Till Grüne‐Yanoff (2017). Nudging and Boosting: Steering or Empowering Good Decisions. *Perspectives on Psychological Science*. https://doi.org/10.1177/1745691617702496 — [verified: OpenAlex DOI]
- **S156** Cass Robert Sunstein (2017). Nudges that fail. *Behavioural Public Policy*. https://doi.org/10.1017/bpp.2016.3 — [verified: OpenAlex DOI]
- **S157** George F. Loewenstein, Cindy L. Bryce, David Hagmann, Sachin D. Rajpal (2015). Warning: You are about to be nudged. *Behavioral Science & Policy*. https://doi.org/10.1353/bsp.2015.0000 — [verified: OpenAlex DOI]
- **S158** George F. Loewenstein, Nick Chater A (2017). Putting nudges in perspective. *Behavioural Public Policy*. https://doi.org/10.1017/bpp.2016.7 — [verified: OpenAlex DOI]
- **S159** Saurabh Bhargava, George F. Loewenstein (2015). Behavioral Economics and Public Policy 102: Beyond Nudging. *American Economic Review*. https://doi.org/10.1257/aer.p20151049 — [verified: OpenAlex DOI]
- **S160** Dan Ariely, Klaus Wertenbroch (2002). RETRACTED: Procrastination, Deadlines, and Performance: Self-Control by Precommitment. *Psychological Science*. https://doi.org/10.1111/1467-9280.00441 — [verified: OpenAlex DOI] **RETRACTED per publisher metadata; cited only as a warning.** Retraction notice: *Psychological Science*, September 2026, https://doi.org/10.1177/09567976261488042 ([verified: Crossref 2026-11-04]; R03 m6).
- **S161** C. Yiwei Zhang, Abigail B. Sussman (2018). Perspectives on mental accounting: An exploration of budgeting and investing. *Financial Planning Review*. https://doi.org/10.1002/cfp2.1011 — [verified: OpenAlex DOI]
- **S164** Daniel J. Kahneman, Amos Tversky (1984). Choices, values, and frames.. *American Psychologist*. https://doi.org/10.1037/0003-066X.39.4.341 — [verified: OpenAlex DOI]
- **S165** Daniel Read, George F. Loewenstein, Matthew Rabin (1999). Choice Bracketing. *Journal of Risk and Uncertainty*. https://doi.org/10.1023/A:1007879411489 — [verified: OpenAlex DOI]

- **S167** Lukasz Walasek, Timothy L. Mullett, Neil Stewart (2024). A meta-analysis of loss aversion in risky contexts. *Journal of Economic Psychology*. https://doi.org/10.1016/j.joep.2024.102740 — [verified: hosted tool (DOI) and Crossref, 2026-11-04]; λ = 1.31 [1.10, 1.53] from the abstract as indexed by OpenAlex.
- **S168** Proceedings of the National Academy of Sciences (2022). Correction for Mertens et al., "The effectiveness of nudging: A meta-analysis of choice architecture interventions across behavioral domains". https://doi.org/10.1073/pnas.2204059119 — [verified: Crossref 2026-11-04, linked as a correction to 10.1073/pnas.2107346118]. Text quoted from OpenAlex; the PNAS page returned HTTP 403.
- **S169** Stephanie Mertens, Mario Herberz, Ulf J. J. Hahnel, Tobias Brosch (2022). Reply to Maier et al., Szaszi et al., and Bakdash and Marusich: The present and future of choice architecture research. *Proceedings of the National Academy of Sciences*. https://doi.org/10.1073/pnas.2202928119 — [verified: hosted tool and Crossref, 2026-11-04].
- **S170** Jonathan Z. Bakdash, Laura R. Marusich (2022). Left-truncated effects and overestimated meta-analytic means (comment on Mertens et al.). PsyArXiv preprint. https://doi.org/10.31234/osf.io/9q67c — [verified: Crossref 2026-11-04].
- **S171** Jon M. Jachimowicz, Shannon Duncan, Elke U. Weber, Eric J. Johnson (2019). When and why defaults influence decisions: a meta-analysis of default effects. *Behavioural Public Policy*. https://doi.org/10.1017/bpp.2018.43 — [verified: hosted tool and Crossref, 2026-11-04]; pooled estimate not re-read.
- **S172** Janne Adolf, Eiko I. Fried (2019). Ergodicity is sufficient but not necessary for group-to-individual generalizability. *Proceedings of the National Academy of Sciences*. https://doi.org/10.1073/pnas.1818675116 — [verified: hosted tool and Crossref, 2026-11-04].
- **S173** Robyn L. Tate, Michael Perdices, Ulrike Rosenkoetter, William Shadish et al. (2016). The Single-Case Reporting Guideline In BEhavioural Interventions (SCRIBE) 2016 Statement. *Journal of Clinical Epidemiology*. https://doi.org/10.1016/j.jclinepi.2016.04.006 — [verified: hosted tool and Crossref, 2026-11-04].
- **S174** Eugene Edgington, Patrick Onghena (2007). *Randomization Tests* (4th ed.). Chapman & Hall/CRC. https://doi.org/10.1201/9781420011814 — [verified: Crossref 2026-11-04].

**Official, institutional and press sources (time-sensitive; checked 2026-11-02, re-stated 2026-11-04):**

- **S103** National Bureau of Statistics (Nigeria), Consumer Price Index, September 2026 (released 15 October 2026): headline 14.63% y/y, food 19.59%, m/m 0.06%, September 2025 20.98%; core 12.95% on the NBS dashboard vs 13.29% in press. Reported via Vanguard, "Breaking: Nigeria's inflation rate drops to 14.63%", 15 Oct 2026, https://www.vanguardngr.com/2026/10/breaking-nigerias-inflation-rate-drops-to-14-63/ and the NBS site https://www.nigerianstat.gov.ng/ — E2 (official statistic; PDF not fetched) [verified by page fetch].
- **S104** WithinNigeria, "Dollar to Naira today, October 31, 2026: NFEM rate ₦1,346.91, black market ₦1,385", 31 Oct 2026, https://www.withinnigeria.com/2026/10/31/dollar-to-naira-today-october-31-2026-nfem-rate-%E2%82%A61346-91-black-market-%E2%82%A61385/ — E3 (press tracker; approximate; CBN primary page not fetched) [re-fetched by reviewer R03b on 2026-11-04; values match].
- **S105** Legit.ng, "UBA, other banks to debit customers N50 on electronic transfer from January 1, 2026", published/updated 31 Dec 2025, https://legit.ng/1690443-banks-charge-n50-stamp-duty-electronic-transfers-january-1-2026.html — E3 (press reporting of bank notices; Tax dept to confirm against the Nigeria Tax Act 2025) [verified by page fetch].
- **S106** TechCabal, "Why your ₦50,000 transfer will cost ₦100 from 2026" (22 Dec 2025) and "Why transfers above ₦10,000 will cost ₦60" (27 Apr 2026), https://techcabal.com/2025/12/22/why-your-50000-transfer-will-cost-100-from-2026/ ; https://techcabal.com/2026/04/27/ — pages returned HTTP 403; figures from search snippets only — **[unverified]**.
- **S107** EFInA, Access to Financial Services in Nigeria (A2F) 2023 survey, launched 14 Dec 2023: 64% formal inclusion, 10% informal-only, 26% excluded, 74% regulated inclusion; via News Agency of Nigeria, https://nannews.ng/financial-inclusion-reaches-64-efina-survey-reveals/ (verified by page fetch); EFInA publication page https://efina.org.ng/publication/access-to-financial-services-in-nigeria-survey-2023 (HTTP 503 on fetch); A2F 2026 headline "financial inclusion reaches 79%" dated 21 Oct 2026 on https://a2f.ng/ (headline only) — E2 for 2023 figures; E3 for 2026 headline.
- **S119** Consumer Financial Protection Bureau, *CFPB Financial Well-Being Scale: Scale development technical report*, 26 May 2017, https://files.consumerfinance.gov/f/documents/201705_cfpb_financial-well-being-scale-technical-report.pdf (full PDF read: 10 items, 5-item short form, IRT scoring, marginal reliability ≥0.89 / >0.80, 10–5 item r = 0.94, samples 4,500 + 7,899 + 2,000, validation correlates) — E2 (official) [verified by document read]. Re-read 2026-11-04: the score is round(IRT score × 15 + 50) (§5.2.1), so its SD is 15 by construction; no test–retest result was found.
- **S162** Besley, T., Coate, S., & Loury, G. (1993). The economics of rotating savings and credit associations. *American Economic Review* 83(4) — DOI look-up and title search both failed — **[unverified]**; relied upon only for background, with S85/S86 carrying the evidential weight.
- **S163** Supporting reporting on the nudge meta-analysis debate: Maier et al. PMC record https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9351501/ and the Bayesian Spectacles rejoinder https://www.bayesianspectacles.org/rejoinder-no-evidence-for-nudging/ — E3, used only to corroborate S143–S144 [verified by page fetch; PMC Table 1 re-read by us 2026-11-04 for the finance-domain and category results].
- **S166** GFLEC, "S&P Global FinLit Survey" page, https://gflec.org/initiatives/sp-global-finlit-survey/ (150,000+ adults, 140+ countries, four concepts; no country figures on page) — E3 [verified by page fetch]. The often-quoted global rate (about one in three adults financially literate) and Nigeria's figure were **not** verified in this session and are not used in the findings.

- **S175** Nigeria Data Protection Act 2023, text hosted by DataGuidance, https://www.dataguidance.com/sites/default/files/data_protection_act_2023.pdf. Read 2026-11-04: ss. 3, 24, 27(1)(g), 30, 35 and 37, and the s.65 definition of "sensitive personal data". The PLAC certified copy, https://placng.org/i/wp-content/uploads/2023/06/Nigeria-Data-Protection-Act-2023.pdf, is image-only and was not machine-readable. Not compared with the gazette — E2 [verified by document read].
- **S176** DLA Piper, *Data Protection Laws of the World — United Arab Emirates* (definitions), https://www.dlapiperdataprotection.com/index.html?t=definitions&c=AE, fetched 2026-11-04. Quotes the PDPL sensitive-data definition, including the "family" limb; reports the Executive Regulations unpublished as of 6 January 2025 — E3 (secondary).
- **S177** Global Preference Survey, Downloads page, University of Bonn, https://gps.econ.uni-bonn.de/downloads, fetched 2026-11-04. Licence CC BY-NC-SA 4.0 with a citation agreement and no transfer to third parties without approval. Questionnaires for Nigeria in Hausa, Igbo and Pidgin English, and for the UAE in Arabic — E3 [verified by page fetch].
- **S178** Consumer Financial Protection Bureau, Financial well-being scale page, https://www.consumerfinance.gov/data-research/research-reports/financial-well-being-scale/, fetched 2026-11-04. No licence terms stated; abbreviated questionnaire and scoring worksheet available — E3 [verified by page fetch].
- **S179** Licence search for Grable–Lytton and DOSPERT (WebSearch, 2026-11-04). Results included: the University of Missouri news release on hosting the free 13-question assessment, https://munews.missouri.edu/news-releases/2018/0130-popular-financial-tool-at-mizzou-will-help-investors-financial-advisors-assess-risk/; and the DOSPERT copyright notice "© Elke U. Weber, 2003" — **[unverified]**: no licence statement found; pages not fetched.

**Synthetic-data artefacts (not sources):** `docs/portfolio-os/research/behavioural/payday_sim.py` and `synthetic_ledger.csv` (copied from the research scratchpad); all amounts invented; seed 20261102; requires numpy and pandas only. v0.2 re-analysis: `docs/portfolio-os/research/scripts/doc03_revision_checks.py`, which reads the same CSV and covers sections A–N.

## 11. Revision history and response to review

**v0.1 (2026-11-04; research performed 2026-11-02):** first draft.

**v0.2 (2026-11-04):** revised after reviews R03 (academic) and R03b (cross-functional).
- Contracts C1–C5 and C2 template tokens adopted (§4.0, §4.10).
- New numbers are reproduced by `research/scripts/doc03_revision_checks.py`.
- Finding IDs below are the reviewers' own numbering.
- Actions: **Fixed** = changed in this document; **Rejected** = not adopted, with evidence; **Deferred** = owner and reason given.

### Review R03 (academic)

| Finding | Log ID | Action | Where | Note |
|---|---|---|---|---|
| B1 power analysis vs design | V-024 | Fixed (with disagreement) | §4.3, §4.5 Step 8, §4.6, §5, R16 | Re-run as an exact within-pair randomisation test. Six months: min p 0.125, power 0. Twelve months: 0.36 (15%). Twenty-four months: 0.67 (clean) or 0.19 (lumpy). Carry-over, calendar blocking and SCRIBE added. The reviewer's 24-cycle minimum is insufficient under lumpy noise, so the trial is removed from the MVP instead |
| B2 interventions unbuildable; finance null omitted | V-025 | Fixed | F26, F27, §4.6, §8 Recs 6–8 | Automation moved to Do-not-build (yet) per Doc 4 R13; standing orders at the bank tracked at L0b. Maier finance-domain 0.00 [0.00, 0.00], BF01 41.2, added from PMC Table 1. Working prior "possibly zero" |
| M1 claims ladder | V-026 | Fixed | §4.1, §4.4 | L0 split into L0a/L0b. L2 replaced by L2a (literature context; cannot raise the indicator) and L2b (within-person randomised). Persistence rule added |
| M2 metric names vs observables | V-026 | Fixed | §4.2 | Rows merged, renamed or removed. Posting-lag, cash, bulk-buying, multi-income, partner-paid and reference-currency checks added. Ostrich metric Do-not-build |
| M3 rational explanations written in | V-026, V-030 | Fixed | F17, F18, §4.2 constructs 4–5 | Hedging and obligation tags are user-confirmed only. FX is "currency conversion" with named L3 candidates |
| M4 instruments, MDC, licensing, Doc 4 conflict | V-026 | Fixed; Doc 4 side open | F23, F23a, §4.2 constructs 11–12, §6, R15 | CFPB MDC95 13.8 / 18.6 (score metric re-read in the PDF). SOEP MDC 3.5–4.0 (E4 inputs). Licensing table. GPS fielding in Nigeria and the UAE verified. Grable–Lytton vs SOEP disagreement preserved for the Doc 4 owner |
| M5 loss aversion one-sided | V-027 | Fixed | F2, §4.7, R2 | Walasek et al. λ 1.31 [1.10, 1.53] added (verified). Magnitude regraded E2–E3 |
| M6 nudge correction, reply, caveats, grades | V-027 | Fixed | F26, F27 | Correction (retracted Shu et al. 2012 observations; erroneous values; coding errors; text via OpenAlex), reply, Bakdash & Marusich and Jachimowicz added. DellaVigna & Linos and Allcott & Rogers regraded E2. "No overall evidence" caveat added |
| M7 multiplicity and repeated looks | — | Fixed; one suggestion rejected | §4.3, §5 | One framework: randomisation tests at scheduled looks (6/12/24), α 0.017 per look; tests counted. Monthly looks give 0.18 false patterns vs 0.10 at two scheduled looks (script §G). Population-centred prior rejected for n = 1 (no hierarchical model); deferred to the commercial phase. Adolf & Fried added |
| M8 worked-example methods and power | V-027, V-029 | Fixed | §4.3, §4.5 Steps 2, 3, 5, 8, 9 | Cycle bootstrap 1.51–1.80. Test size 0.095/0.080/0.060 (3/6/12 cycles). Lumpy-noise power grid. PGR−PLR ±0.25 at 20/20, about 58 each for ±0.15. Decomposition relabelled: bills 44.3%, FX 20.3%, investment 16.3%, family 12.2%; 93.2% non-flexible in total |
| M9 founder as subject; tamper evidence; ethics | V-028 | Fixed; one item deferred | §4.3, §4.6 items 5–6, §4.9, R11 | Hash committed to an external timestamp; outside reviewer; human-subjects, NDPA and consent text for any second user. Naming the reviewer is deferred to the founder |
| M10 financial education read selectively | — | Fixed | F9, F29 | Kaiser et al. "at least three times as large" (NBER abstract re-fetched) set against Fernandes et al. Both kept at E1; disagreement stated |
| m1 S151 authors and grade | V-027 | Fixed | §10 S151, F26 | Crossref gives Karlan, McConnell, Mullainathan, Zinman (*Management Science* 2016). The error came from a merged OpenAlex record. Regraded E2 |
| m2 S47 year | — | Fixed | §10 S47 | 2022 (August), per Crossref |
| m3 uncited S108, S165; count | — | Fixed | F1, F12, §2 | Both now cited. Count corrected (166 entries in v0.1; 179 in v0.2) |
| m4 ₦60 misattribution | — | Fixed | F21 | ₦10 fee (Doc 4 F5) plus ₦50 duty |
| m5 price drift | — | Fixed | F17, §4.3, §4.5 Step 5(c) | m/m 0.06%, not 1.14% |
| m6 S160 retraction notice | — | Fixed | §10 S160 | 10.1177/09567976261488042, September 2026, per Crossref |
| m7 one-notch discount not applied | — | Fixed | F28, §4.8 | Implementation intentions and goal-setting E3; questionnaires E2 (US) / E4 (NG, UAE) |
| §3 grade audit (11 rows) | V-026, V-027 | Fixed | F2, F7, F17, F23, F25–F28, §4.8 | Every proposed regrade adopted |
| §3 unsourced claims | — | Fixed | §4.4, §4.5 Step 7, §5, §4.3 | "Most people" replaced by named populations. Gamification row restated as absence of evidence. Ramadan timing no longer used: seasonality comes from user-declared events only |
| §5.1 automation | V-025 | Fixed | §4.6 | — |
| §5.2 risk instrument | V-026 | Fixed (Doc 3); Doc 4 side open | §6, R15 | — |
| §5.3 data-quality gates | — | Fixed | §4.2 gate, §9.1 | Doc 4 precision/recall plus a value-weighted PPS audit |
| §5.4 taxonomy | — | Fixed | §6 mapping table | Sensitive flag on religious giving requested from Doc 4 |
| §5.5 CBN 2026 charges | — | Fixed | F21 | — |
| §5.6 budget-view experiment | — | Fixed | §4.6 | Infeasible for n = 1; about 392 per arm between-person (script §N) |
| §5.7 core CPI | — | Deferred | F17, R9, §9.9 | NBS PDF not fetched. Owner: Doc 3 with Doc 5c (data) |
| §6 do-not-build gaps | V-028 | Fixed | §4.7, §8 Rec 11 | All eight gaps added |
| §6 IC questions | — | Fixed (one item deferred) | §4.6, §4.3, §4.9.5 | Automation, the 24-month commitment, sensitive inferences and the framework are answered. Single salary cycle is deferred to the founder |
| §8 items the reviewer could not check | — | Deferred (partly fixed) | §2, §9.9 | Fixed: Walasek λ (OpenAlex abstract for the published DOI), GPS countries, correction content. Deferred (owner Doc 3): DellaVigna & Linos published numbers, S148 and S140 magnitudes, DOSPERT and Grable–Lytton terms |

### Review R03b (cross-functional)

| Finding | Log ID | Action | Where | Note |
|---|---|---|---|---|
| B1 Doc 8 card breaks the ladder | V-007 | Fixed (Doc 3 side); Doc 8 side mostly done | §4.5 Step 10, §4.7, §4.10, §6 | Machine-readable construct specification, templates in token form, one-to-one rung mapping, card rules. "38% in 4 days" implies 3.98× (script §J). Doc 8 v0.2 already renders from the specification and has removed the Journey 4 offer. Remaining asks (a)–(e) are in §6 |
| M1 five-question answers are outputs | V-029 | Fixed | §8 Recs 1–6 | Q1 and Q5 restated in money and decisions. Rec 3 conditional on shortfall cost (construct 6a) |
| M2 pilot unsustainable and inconclusive | V-029, V-024 | Fixed | §4.6, §4.5 Step 8, R11–R13 | ABAB removed from the MVP. Decisions tracked at L0b. Reactivity, carry-over, upload burden and calendar threats added |
| M3 questionnaire burden | V-029 | Fixed | F23, F24, §4.2, §8 Rec 5 | 64 items cut to 7 (script §M); the 200 labels folded into the review queue |
| M4 payday FX as hedging | V-030 | Fixed | F17, §4.2 construct 4 | Currency conversion with spread (2.8–3.2%), Doc 6 flag and liability currency mix |
| M5 no privacy design | V-028 | Fixed (design); counsel review and DPIA deferred | F30, §4.9, §8 Rec 4, §9.8 | Consent split, sensitive-inference register, retention split, local rendering, no telemetry, DPIA trigger. Owner of the deferred items: Legal, before any second user |
| m1 judgemental names | — | Fixed | §4.2 | — |
| m2 template wording | — | Fixed | §4.4, §4.5 Step 7, §4.10 | — |
| m3 vocabulary lists | V-007 | Fixed (Doc 3 side) | §4.7 | Merged list for the Doc 8 lint |
| m4 F21 upgrade; Tax request | — | Fixed | F21, §6 | — |
| m5 gates unlabelled | — | Fixed | §4.3 | Gates labelled E5 and calibrated to observed noise |
| §2a decision map | V-029 | Fixed | §4.2 "Decision" column | Every retained construct names its decision |
| §2b removals | — | Fixed (one point modified) | §4.2, §4.3, §5, R16 | Inference engines reduced to the circular-shift test plus a cycle-bootstrap range. BH dropped. Six instruments moved to literature only. A circular shift gives a test, not an interval |
| §3 grade audit | — | Fixed | F13 note in §4.8, F21, F23, F25–F27, §8 | Grade changes adopted |
| §5 contradictions 1–7 | V-007, V-028, V-030 | Fixed (Doc 3 side) | §4.9.6, §4.10, §6 | The Doc 8 §7 "phantom disagreement" is answered in §6 |
| §6 IC questions | — | Fixed (four items deferred) | §4.9, §4.10 | Fixed: sensitive categories and retention; owner of the construct specification (Doc 3). Deferred to the founder: shortfall cost, controller and processors, trading frequency, monthly uploads |
| §8 PDPL primary text and article numbers | V-028 | Deferred | §9.9 | Owner: UAE counsel |

**Counts.** 48 findings in total: 31 from R03 and 17 from R03b.
- **Fixed: 45.** Four of these leave a component deferred to a named owner: R03 M9 (reviewer to be named by the founder); R03 §6 (single pay cycle, founder); R03b M5 (counsel review and DPIA, Legal); R03b §6 (four questions, founder).
- **Deferred: 3.** R03 §5.7 core CPI (Doc 3 with Doc 5c); R03 §8 unverifiable items (Doc 3); R03b §8 PDPL primary text (UAE counsel).
- **Rejected: 0.** Three *suggestions* inside findings that were otherwise fixed were not adopted, with evidence:
  - R03 B1's 24-cycle minimum: power 0.19 under lumpy noise (script §F).
  - R03 M7's population-centred prior: needs a hierarchical model with many users.
  - R03b §2b's "circular-shift interval": a circular shift gives a test, not an interval.

### Contract notes

- We follow C1–C5 and C2 as written. One extension, stricter than C4 and compatible with it: tags with sensitivity weight (family, religious giving, health) never auto-apply or bulk-accept. **Proposal:** C4's condition 4 ("no tax or legal weight") should also name sensitivity weight, so that Doc 4 and Doc 8 apply the same rule.
- C3.4 does not say whether behavioural statistics are "conclusion-driving". We treat L1 and above as conclusion-driving (§4.0). **Proposal:** state this in C3.4.

### Still open

1. Doc 8 v0.2 already renders the specification. It still needs to adopt the v0.2 rung IDs and cycle-level range, and add the missing lint terms (§6 (a)–(e); V-007, Doc 8 side).
2. Doc 4 must decide the risk instrument (R15), flag religious giving as sensitive, and adopt the value-weighted gate.
3. Counsel review of §4.9, a DPIA, the PDPL primary text and licensing permissions are needed before any second user or any commercial use.
4. The founder must confirm: pay cycles, shortfall cost, trading frequency, controller and processors, declared calendar events, and the pre-registration reviewer.
5. Unverified magnitudes remain (S140, S148), along with NBS core CPI, S106 and S162.
6. Noise calibration and test size must be measured on the founder's real data (§9.2) before any L1 statement.
