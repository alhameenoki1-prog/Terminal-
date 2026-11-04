# Document 12 — Final Executive Recommendation

```
Document: 12 — Final Executive Recommendation
Department: Executive Leadership (programme coordinator, for the CEO and Investment Committee)
Version: 1.0  ·  Date: 2026-11-04  ·  Status: for founder decision
Reviewers required: Founder (approval authority)
```

## 1. The recommendation

**Build less, sooner, and prove it on your own money first.** The research supports the full nine-system vision as a long-term architecture. It does not support building most of it now. The Investment Committee voted 7–2 to build a *thin personal MVP* of about 12 person-weeks (range 8–18) on Beancount + Fava, instead of the fuller design, which independent estimates put at 37 to 64 person-weeks for one user (Doc 7 v0.2; red-team panel C).

The thin MVP does four things well:

1. A reconciled, multi-currency ledger of your Nigerian, UAE and international accounts, with provenance on every figure.
2. A small set of reports that change real decisions (cash flow, net worth by currency, exposure, named devaluation scenarios, conversion costs).
3. A deterministic goal calculator with sourced, registered assumptions, in place of the Monte Carlo engine.
4. A records pack for a licensed Nigerian tax practitioner, delivered by 28 February 2027 for the 31 March deadline.

Every other capability keeps its specification and contract, and comes back when a measured trigger fires (§5).

Nothing is sold in the 2027 season unless a legal opinion on tax practice, a processor agreement and a data-protection impact assessment are in hand by **15 January 2027**. No real financial data is loaded until twelve security and privacy conditions are met, beginning with a separate computer account that has no development tools or AI coding agents on it.

**The single biggest unknown is you.** Every document's largest uncertainty is a fact only the founder can supply: weekly hours, tax residency, institutions and holdings. None has been supplied since the master prompt. The plan's dates are therefore expressed in hours, not months.

## 2. What was done, and its limits

| Step | What happened |
|------|---------------|
| Stage 0 | Shared context brief, charter (Doc 1) and organisation and tooling plan (Doc 2). Your earlier conversations were not accessible; the vision was rebuilt from the master prompt and the repository, and ten assumptions were listed for you to confirm (Doc 1 §10) |
| Stage 1 | Nine specialist departments, each a separate agent, researched in parallel and wrote Documents 3, 4, 5a, 5b, 5c, 6, 7, 8 and 9 (about 128,000 words, with sources and reproducible scripts) |
| Stage 1b | Ten independent reviews, one per document plus a second behavioural review. Seven called for major revision, three accepted with required changes. Reviewers re-checked well over 100 academic references and about 100 web sources; no fabricated citation was found |
| Contracts | Reviews showed the documents defined the same core ideas differently. One canonical specification (C1–C8) now governs the ledger, figure integrity, data status, confidence, FX, goal outputs, tax-rule lifecycle and retention |
| Revision | All nine documents revised to v0.2, each with a table answering every review finding. 44 confirmed issues were logged and tracked to closure or to a named owner |
| Stage 3 | Three whole-proposal red-team panels (science and models; security, privacy and regulation; product and complexity), consolidated in Document 11, then the Investment Committee (decision memo and decision records D-007 to D-018) and the roadmap (Document 10) |

**Limits you should weigh.**

- Every specialist, reviewer and committee member is a simulated role played by an AI model. None is a licensed accountant, tax practitioner, lawyer or regulated adviser. Their agreement is not validation.
- What validation exists comes from verified sources, scripts that reproduce every worked example, and checks that were actually run. Tax and legal conclusions need licensed sign-off before reliance (Doc 6 §9 lists each one).
- Time-sensitive facts were checked between 2 and 4 November 2026 and carry those dates.
- All examples use synthetic data. No real financial data was used.

## 3. What the research established

| System | Most important finding | Where |
|--------|------------------------|-------|
| A Ledger | Nigerian open banking is not live, so statement import with mandatory reconciliation is the only reliable route. FX conversion cost must be measured against the CBN NFEM rate; letting it be the balancing figure would hide mismatched transfers | Doc 4; C1, C5 |
| B Behavioural | Observable patterns can be measured; their psychological causes mostly cannot be established for one person. A within-person intervention trial has zero power at six months and only 0.36 at twelve, so it is out of the MVP. Questionnaire burden cut from 64 items to 7 | Doc 3 |
| C Investment research | Licensed NGX end-of-day data exists from NGX directly, from about USD 26 a month. Analysis beyond display may need a non-display fee (about USD 104 to 792 a month); only NGX can say, in writing. No independent second source exists for NGX prices | Doc 5c; Doc 5 |
| D Portfolio | The problem is measurement on poor data, not optimisation. The same NGN equity series shows a −17.5% drawdown in naira and −47.4% in dollars, so base currency must always be explicit | Doc 5b |
| E Goals | An unsourced naira-depreciation assumption moves the goal headline from 27 to 55 out of 100, and calibration at a five-year horizon is impossible for one person. Hence the deterministic calculator | Doc 5b; red-team A |
| F Planning | Planning depends on E and on the tax position; deferred until E re-enters | IC D1 |
| G Tax | The Nigeria Tax Act 2025 changes everything for individuals from 2026, including residency on any one of six tests (s.201) and gains taxed in the year after disposal. The product may prepare, not file; paid preparation by non-members may be an offence under the CITN Act | Doc 6 |
| H AI | Figures must reach you only as tokens rendered from the validated store. The first validator let 18 of 20 bypass strings through; the hardened version blocks all 20, but a fresh round with new strings is required | C2; red-team B |
| I Commercial | Nigerians rarely pay for personal-finance software today. The only fundable wedge found is a practitioner-signed cross-border tax-and-records pack for diaspora and mass-affluent users, and it is a different company from the personal tool | Doc 9; red-team C |

One lesson recurs across the package. The repository's hardcoded 27.50% CBN policy rate was wrong *on the day it was committed* in March 2026, when the CBN's own page showed 26.5%. The Fed rate committed the same day was 75 basis points off. That is why every figure must be checked against a primary source at entry, not only expired later (C3.5).

## 4. Disagreements

**Resolved, with reasons.**

- *Ledger model:* three documents disagreed; C1 now governs, with per-commodity balancing and conversion accounts.
- *AI figure safety:* Doc 7's numeric gate was replaced by Doc 5c's figure tokens (C2).
- *Retention:* four incompatible answers were replaced by C8, under which erasure is always possible and compliance-mode backup locks are forbidden.

**Preserved, for you to weigh.**

| Issue | Majority | Dissent |
|-------|----------|---------|
| MVP scope (D1, 7–2) | Thin MVP first | CEO and CTO: the thin MVP under-builds the foundation the long-term product needs |
| 2027 commercial test (D7, 6–3) | Your own case only unless the 15 January gate passes | CEO and YC operator want more in-season testing; CPO wants none at all |
| Goal engine (D5, 8–1) | Deterministic calculator | CIO: deferring simulation hides real risk |
| Data budget (D6, 8–1) | USD 5 a month recurring | CIO: too low for serious NGX research |
| Behavioural scope (D8, 7–2) | Four decision-linked measures, no pattern claims | Chief Behavioural Scientist and CEO: this under-uses the platform's main differentiator |
| Independence (D4, 8–1) | Licensed practitioner, security reviewer, a named second person | Red Team head: still too little for any external user |

## 5. How the full vision is preserved

Nothing you asked for is dropped. Each system has a minimal form now, a binding contract, and a measured trigger for the rest (IC D1).

| System | In the MVP | Deferred | Comes back when |
|--------|-----------|----------|-----------------|
| A Personal finance | Ledger, importers, deterministic matcher, five reports | Statistical matcher, calibration, OCR, bank APIs | More than 50 own transfers a month; over 3 scanned statements a month; open banking live plus a 60-day shadow test |
| B Behavioural | Four decision-linked measures and a decision log | Claims-ladder engine, questionnaires | A real end-of-cycle shortfall cost exists; consent machinery live |
| C Investment research | Holdings valued from broker or CSCS statements with as-of dates | Research notes, bank module, NGX feed, corporate actions | A planned purchase or sale above a share of liquid net worth you set; NGX trading more than monthly |
| D Portfolio and quant | Exposure table, named devaluation scenarios, FIFO lots | Risk module; any optimiser | More than 10 positions, or you ask |
| E Goal Reality Engine | Deterministic required-return and contribution table | Monte Carlo engine | Sourced capital-market assumptions and the D5 conditions |
| F Forecasting | The calculator only | Planning module | After E re-enters |
| G Tax | Records pack; US-situs and W-8BEN monitors | Computing tax engine | A practitioner prices a saving **and** the practitioner test passes |
| H AI | None at first (no raw data leaves your machine) | AI research and explanation layer | At least 10 unanswerable questions a month for two months, then its security condition |
| I Commercialisation | Measurement only | Any product for others | The D7 gates |

Two of these will feel like a loss. The AI layer (H) and investment research (C) were central to your brief. The committee deferred them because neither changes a decision you face in the first 90 days, and both carry the risks that caused your earlier tracker to fail: unverified figures and unlicensed data. The contracts for both are written, so they can be built correctly when the trigger fires.

## 6. The path, step by step

The sequence is fixed. Dates depend on your weekly hours (Doc 10). The figures below assume 20 hours a week starting 9 November 2026, with ranges from Doc 10.

| Step | What it delivers | Date at 20 h/week | Range |
|------|------------------|-------------------|-------|
| Fact-find | Your answers to §8, and approval of the decisions in §7 | 13 Nov 2026 | fixed |
| M-0 Secure base | Conditions CP-1 to CP-10: a separate OS account, encrypted storage, backups that can still be erased | 20 Nov 2026 | 17–24 Nov |
| Spike | A 2–3-day test of the Beancount + Fava base on synthetic statements | 27 Nov 2026 | 23 Nov–2 Dec |
| M-1 | Reconciled ledger from your statements, importers, transfer matching, first reports | 8 Jan 2027 | 21 Dec–3 Feb |
| M-2 | Records pack v1 to your tax practitioner | 26 Feb 2027 | 21 Jan–19 Apr |
| M-3 and Gate P | Broker lots, the goal calculator, the remaining reports; review of whether to continue | 14 May 2027 | 15 Mar–11 Aug |

- **Total effort** is about 13.4 person-weeks (range 9.1–19.8), plus about one reviewer-week for an external security review and about one reviewer-week a year from a second person.
- **At 10 hours a week** the 2027 pack is prepared by hand and M-3 leaves the 2027 plan. At 40 hours a week everything finishes by about 10 February 2027.
- **The 15 January 2027 rule protects your filing, not slack.** At 20 hours a week the pre-build work uses almost all of the schedule margin. If M-1 is not done by 15 January, the pack is prepared by hand.
- **Pack v1 needs a lot schedule you prepare by hand**, because broker lots are automated only in M-3.
- **An open conflict.** The committee targets 60 minutes a month of operating time. The security panel's own figures for the MVP's remaining chores come to about 43–73 hours a year, several times that target. Doc 10 leaves this to be measured in M-1 rather than hiding it.

The twelve conditions before real data, the test plan and the falsification tests with their decision rules are in Doc 10 §5–§6.

## 7. Decisions only you can make

Ranked by how much they change the plan (IC §10):

1. **Approve the thin MVP and its sequence (D1, D2).** This covers the research freeze, the hours-based gate that replaces the six-month Stage 0, and the rule that the 2027 pack is prepared by hand if M-1 slips past 15 January 2027.
2. **Approve the twelve conditions before real data (D3).** They include running Portfolio OS in a dedicated OS account or VM, and recording that raw statement data never leaves your machine.
3. **Engage professionals now.** A CITN-registered practitioner for the 2027 filing, plus the CITN/NTAA s.33 and SEC-perimeter opinions on a 6–8-week deadline, within the Stage 0 envelope of about USD 10–20k against quotes.
4. **Treat 2027 as your own case only (D7)**, with the 15 January 2027 go/no-go for a small concierge, and pre-orders held.
5. **Set the data-and-AI ceiling at USD 5 a month (D6)**, and send NGX the written question on personal analytics.
6. **Defer the Monte Carlo engine (D5)** in favour of the deterministic calculator and an assumption register.
7. **Name a second person, or authorise a paid reviewer** for about one reviewer-week a year (D4).
8. **Approve the behavioural scope (D8).**
9. **Choose the repository arrangement (D9).** The committee recommends a new private repository for code and a separate local ledger repository with no remote.
10. **Confirm or correct the ten assumptions in Doc 1 §10.**

## 8. Facts we need from you

The answers below change the plan more than any further research would (IC §11):

| Rank | Fact | Why it matters |
|------|------|----------------|
| 1 | Hours per week, for how long, and the split between building and operating | Sets every date. At 10 hours or fewer the 2027 pack is manual |
| 2 | Tax residency facts for 2026–2027 | Decides whether worldwide income and the FX-pool view are in scope |
| 3 | Intent for 2027: personal only, or a wedge test | A wedge test needs counsel briefed this week |
| 4 | Banks, accounts and statement formats | Sets importer count and effort |
| 5 | Holdings by market, trading frequency, US-situs assets above USD 60,000 | Triggers for research, the estate-tax monitor and broker importers |
| 6 | Whether any raw statement text may go to a hosted AI model | Brings the AI security condition forward if yes |
| 7 | Budget for practitioner, counsel and external review | Whether independent checks can happen at all |
| 8 | A trusted second person | Whether any control is more than self-checked |
| 9 | Whether a separate OS account or VM is possible | Whether real data can be loaded at all |
| 10 | Python skill | Whether the Beancount path fits, or a contractor is needed |

## 9. Challenges to your brief

You asked to be challenged, so here is where the evidence pushes back.

- **"Not another budgeting app."** For the first year, the most valuable thing this system does is be a very accurate, multi-currency ledger with a tax pack. That is close to a budgeting app, done properly. The sophistication goes into what it *refuses* to say.
- **Behavioural finance as a core capability.** For one person, the science supports measuring observable behaviour and linking it to decisions you name. It does not support psychological diagnosis. The differentiator is restraint, which is harder to market than insight.
- **The Goal Reality Engine.** Asking "can $100,000 reach X%?" mostly measures the assumptions you feed in. The honest product shows the required return, the assumptions and their sources, not a probability with false precision.
- **Commercial ambition.** The research found no evidence yet that Nigerians will pay for this. The cheapest test is a practitioner-led concierge in one filing season, not a platform.

## 10. Where to start reading

- Document 11 for the strongest criticism of the plan.
- The Investment Committee memo for each decision, its vote and its dissent.
- Document 10 for the build plan.
- `CANONICAL_CONTRACTS.md` for the rules that keep the numbers honest.
- The revision log for every issue the reviews found and what happened to it.
