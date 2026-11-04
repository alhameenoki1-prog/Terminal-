```
Review of: The whole revised proposal (Docs 0–9 v0.2, CANONICAL_CONTRACTS, REVISION_LOG)  ·  Reviewer roles: YC-style operator (consumer fintech), principal engineer (complexity), UX critic, second investment-committee partner (sceptic) — all simulated  ·  Date: 2026-11-04  ·  Verdict: Major revision of scope and sequence (method sound; build plan not the simplest thing that could work)
```

# Red Team C — Product complexity, founder value and commercial logic

## 1. Verdict

The non-negotiables are right and should stay:

- provenance first;
- reconciliation to the printed closing balance;
- prepare, never file;
- no optimiser;
- figures rendered from a validated store, never written by a model.

The package does, however, confuse a strong specification with a product. It designs a 14-module system for a population of users and applies it to one person who makes about one cross-currency transfer a month (Doc 4 §4.3.2).

- **Effort.** Doc 7 §4.13 puts a *partial* MVP at 37 person-weeks (pw), or 25.5 on Beancount + Fava. Add the uncosted tax engine, goal engine, research module, NGX corporate-action engine and behavioural engine, and I estimate 50–64 pw (E5). That is 2–3 years at 20 h/week.
- **Schedule.** Doc 9 gives Stage 0 six months.
- **Founder input.** None since the master prompt. Only D-001 and D-003 are "Approved by founder", and Doc 1 §10 assumptions A1–A10 are all unconfirmed.

**What I recommend.** Freeze research, collect the founder's facts this week, and build a thin MVP on Beancount + Fava. It is about 12 pw: roughly 5.5 months at 20 h/week, with first useful output at about week 6. It contains:

- a reconciled multi-currency ledger;
- five decision reports;
- a cross-border **records** pack that a licensed practitioner computes from before 31 March 2027.

Defer each of these until a measured trigger fires: the AI layer, the C7 tax engine, the C6 Monte Carlo, investment research, licensed NGX data and the behavioural engine. Re-date the commercial tax-pack test so it runs in a filing season.

**The three most important problems:**
1. Stage 0 cannot pass as written, so the month-6 kill gate tests the calendar, not the hypothesis (B1).
2. Every document's biggest uncertainty is a founder fact, so more research has stopped reducing risk (B2).
3. The wedge's demand signal S-b is scheduled after the filing deadline (B3).

## 2. Findings, ranked

### Blocking

**B1 — Stage 0 is infeasible as specified.** (Doc 9 §4.6, §8.3; Doc 7 §4.13; P-1)

- **What Doc 9 requires by month 6.** All 12 monthly periods of every account reconcile with zero unexplained difference, and the founder's tax pack is practitioner-reviewed before 31 March 2027 (month 5).
- **What Doc 7 estimates.** Its cut slice takes 10 / 17 / 28 pw, or 4.6 / 7.8 / 12.9 months at 20 h/week. That slice has no AI, no risk module and **no tax module**.
- **Founder hours.** Doc 9 adds up to 20 h/week of commercial work from month 3, and founder hours are "unknown, founder to confirm". If the founder has 20 hours in total, the plan needs about 40 from month 3.
- **Consequence.** The likeliest month-6 outcome is a schedule-driven "kill", which would be a false negative on the core hypothesis.
- **Fix.**
  - Adopt the §4 MVP, and confirm the founder's hours before fixing any date.
  - Change the gate to: every *uploaded* period reconciles to zero.
  - Change the tax gate to: records pack delivered to a practitioner by 28 February 2027 (not a rule engine at `practitioner_confirmed`).

**B2 — The central uncertainties are founder facts.** The biggest unknowns named in each executive summary: founder hours, skills and formats (Doc 7); parseable statements (Doc 4); pay cycles and shortfall cost (Doc 3); NGX licensing of a natural person (Doc 5c); residency facts and practitioner readings (Doc 6); willingness to pay (Doc 9). All but the last are settled in about a week by a 90-minute fact-find, three redacted statements, one e-mail and one paid practitioner hour.

The package is about 212,000 words plus 48,000 of reviews: roughly 14–17 hours of reading (at 250 words a minute) before the founder can approve Stage 4.

*Fix:* a research freeze, with the founder fact-find (§4.1) as the Stage-4 entry gate.

**B3 — S-b runs out of season.** (Doc 9 §8.3)

- **The timing.** S-b "runs only after the CITN opinion (month 6)", and 20 paid packs are due "by month 9". That puts the test in May–August 2027, the four months after the 31 March deadline Doc 9 uses. (Doc 6 §9(f) still lists that deadline's statutory anchor for practitioner sign-off.)
- **Why it matters.** Doc 9 calls the segment "deadline- and fear-driven". Testing it after the deadline biases the signal toward failure. Because the month-9 decision needs two of three signals, this one distorts the fund/no-fund call.
- **Fix.**
  - Commission the CITN Act / NTAA s.33 opinion **now**, with a 6–8-week deadline.
  - Run S-b in January–March 2027 through a practitioner partner (§5).
  - If the opinion, a processor agreement and a DPIA cannot be ready by mid-January, move S-b to the 2028 season and say so.

### Major

**M1 — The machinery is sized for a population, not for one person's volume.**

- **Transfer matching (Doc 4 §4.3.2).** Fellegi–Sunter with EM-estimated m/u per stratum, isotonic calibration and a Hungarian assignment — yet Doc 4 concedes cross-currency strata "would take years" to reach C4's 30 confirmations. A matcher that can never be calibrated on its only user is ceremony. At 8 own-transfer pairs a month (Doc 8's synthetic volume), deterministic rules (amount or known fee, date window, shared reference) can be checked exhaustively; cross-currency pairs are reviewed anyway.
- **C4 confidence.** A Wilson lower bound ≥ 0.90 (effectively 35 confirmations, CC-8) plus quarterly calibration — for categories that are attributes, not postings (C1 D4), so cannot move a balance. A rule the founder writes is itself a decision.
- **C3 status.** Seven axes; four (lifecycle, rights, identity, corroboration) manage licensed multi-vendor feeds the MVP should not have. The R0 lesson is fully captured by the C3.5 entry-time check plus read-time freshness.
- **Infrastructure.** Fourteen modules, a schema per module, import-linter, FastAPI, a worker and an OpenAPI client, for one user on localhost.

*Fix:* the cut list (§3). Each cut keeps a forward-compatible subset of its contract.

**M2 — The charter's "monthly review under 20 minutes" (Doc 1 §9) is broken by the package's own numbers.** The steady-state operating load:

| Burden | Source | Minutes/month |
|---|---|---|
| Review queue | Doc 8 script §8 | 9–30 |
| NGX single-source validation, ≈ 20 h/yr | Doc 5c §4.3.10 | ≈ 100 |
| Statement downloads and uploads (≈ 5 files × 5 min) | mine, E5 | ≈ 25 |
| Restore drills (monthly in Q1, then quarterly) | Doc 7 MVB 8 | ≈ 10 (30 in Q1) |
| Trace-to-source sample (1 in 20, quarterly) and precision labelling | Doc 4 §4.3.7; Doc 8 §4.3.5 | ≈ 14 |
| **Total** | | **≈ 160–180, i.e. 8–9× the charter** |

Add the yearly residency record (≈ 20 attested items), 7 behavioural items, consents, a decision journal (A8) and a first batch of 231 decisions (≈ 131 minutes). About three-quarters of the load is validation and upload chores, borne by the founder as *operator* and absent from every journey.

*Fix:*
- Value NGX holdings from broker or CSCS statements, as Doc 5c already does for DFM. That removes about 100 minutes a month.
- Restate the target as "total operating time ≤ 60 minutes a month, measured".

**M3 — The C7 engine duplicates the practitioner for one person.** (Doc 6 R2, R4; Doc 9 rec 2)

- **Current state.** Of 34 rule records, none is `practitioner_confirmed`. The engine "refuses the post-PAYE balance and every foreign gain" (Doc 6 §1), and Doc 6 R4 needs a practitioner for the hard items anyway.
- **What the 2027 filing actually needs.** A clean records pack from which the practitioner computes:
  - foreign-share lots at NGN cost;
  - dividends and withholding;
  - FX conversions with reference rates;
  - foreign income;
  - days-present evidence;
  - the US-situs total against USD 60,000;
  - the W-8BEN date.
- **Cost.** I estimate the engine at 4–8 pw (E5; Doc 7 does not cost it) against about 1 pw for the pack.
- **Disagreement, preserved.** Docs 6 and 9 hold that the engine *is* the wedge. That holds only if the wedge is validated (B3).
- **Resolution path.** Log the practitioner's hours on the founder's case with the pack and without it. Build the engine only if the saving can be priced.

**M4 — Investment research and licensed NGX data are inert in the first 90 days.**

- **What the documents make must-haves.** Doc 5a: a prudential rule registry, a note template with nine quant tests, and an NGX bank module gated on CBN capital and payout rows. Doc 5c: a corporate-action engine, corroboration groups and a founder-validator protocol. The NGX feed costs USD 26–792 a month on a basis only NGX can state.
- **What decisions actually turn on.** For someone holding a few positions, no 90-day decision depends on a recomputed CET1 ratio. The decision-relevant facts are what is held, in which currency, at what cost, and what a devaluation does to it.
- **Fix.** Defer these modules. Use statement valuations with their as-of dates.

**M5 — The AI layer (Doc 7 rank 5, "Stage 0b must-have") changes no decision.**

- **Cost.** C2 is an excellent contract, but the layer costs 6 pw plus USD 44–582 a month, mostly evaluation (Doc 7 §4.12(b)). Doc 9 §4.3 calls it "table stakes, not a moat".
- **The free alternative.** With no model in the product, the figure-integrity failure rate is exactly zero, at no cost.
- **Fix.** Keep C2 binding for later. Build the layer when the founder logs ≥ 10 questions a month, for two consecutive months, that the fixed reports cannot answer.

**M6 — The Beancount spike hinges on a criterion the contracts make unnecessary.** (ADR-10 criterion 2; F31)

- **The criterion.** The spike requires a weighted-average currency-pool *plugin*, because Beancount lacks AVERAGE booking.
- **Why it is unnecessary.** C1 D3 already makes base-currency figures derived views. The NGN pool cost can be a derived report over the journal. The WA method itself awaits a practitioner (C1; Doc 6 rule 28), and an unconfirmed legal reading should not choose the ledger engine. For one user, git history covers "bitemporal soft state".
- **Fix.** Make Option B the default. Run a 2–3-day spike that tries to *falsify* it: balance-assertion reconciliation and idempotent beangulp import on the three real redacted statements.

**M7 — Badge density will defeat provenance.** (Doc 8 §4.3–4.5; C3.4)

- **The count.** A figure can wear about 20 distinct chips and watermarks: unchecked, auto-checked, single source, ageing, stale, expired, disputed, restated, licence, removed, symbol changed, est., incomplete, unclassified, "Tax: not yet determined", three C7 watermarks, unaudited, uncalibrated.
- **An example.** Journey 1 badges converted net-worth totals "ageing" because the CBN fixing is two business days old. That will be true every Monday and Tuesday, and it is immaterial to a descriptive total.
- **Fix.** Badge only above a materiality threshold or where the state changes a decision, and keep the full state in the drawer. Run Doc 8's seeded-error test at default density.

**M8 — The wedge is a different company from the personal product.**

The founder's daily value is consolidation, FX cost and exposure, which Doc 9 §4.3 rates largely "not differentiated". What would be sold is a seasonal, liability-bearing professional service whose practitioner "may capture the fee" (Doc 9 A9), dependent on a CITN opinion and on every rule reaching `practitioner_confirmed`. The only shared asset is the records engine. *Fix:* say so plainly, and measure the wedge by the one number the personal build yields cheaply: practitioner hours saved per case.

**M9 — Research has outrun building.** About 260,000 words, 10 reviews, 7 contracts and 30 revision items in two days, and the revision pass spawned 12 new contract errata. Some research was load-bearing (the CBN wrong-at-entry finding, the basis-period correction, the NGX non-display fee, the FX-plug rejection, the C2 bypasses). The next most valuable fact is the result of parsing the founder's first real statement.

### Minor

- **m1 — The queue estimate is an upper bound.** Doc 8's sizing script does not apply Doc 8's own materiality deferral (§4.3.5 step 3). The long tail of one-off merchants, which dominates the count, would mostly fall to "Unclassified".
- **m2 — Some precision gates cannot be reached.** Doc 8 §4.3.5 asks for ≥ 200 own transfers and 50 reversals in the labelled sample. At 8 pairs a month that takes about two years. Report these gates as "not measurable for n = 1".
- **m3 — Defer passkeys.** On a localhost single-user system, passkeys add a build item with little protection over full-disk encryption and an OS screen lock. Add them at the first remote access.
- **m4 — Move the external-review gate.** Doc 7 places it before any real statement is loaded. A local text ledger on the encrypted laptop that already holds the PDFs adds little exposure. Network exposure, an AI layer or a second user add a lot, so gate the review on the first of those. (Disagreement with Doc 7 rank 2, preserved.)
- **m5 — Scanned pages.** With FD-1 = no, the local-model route needs ≥ 24 GB hardware (Doc 7 §4.12(d)); for a few pages, manual entry checked by a balance assertion is cheaper.
- **m6 — Measure categorisation where it matters:** Doc 1 §9's 90% target only on income, transfers, fees and tax-weighted lines.

## 3. Cut list with savings

Savings are in central person-weeks. Figures marked "(Doc 7)" are that document's; all others are mine (**E5**), to be replaced by measured velocity after week 6.

| # | Cut or defer | Spec | Saving | Accuracy and provenance preserved because | Re-entry trigger |
|---|---|---|---|---|---|
| 1 | PostgreSQL C1 build → Beancount + beangulp + Fava | Doc 7 ADR-10 | **11.5 (Doc 7)** | Per-commodity balancing, decimals, FIFO lots and balance assertions are native; base figures are derived (C1 D3) | Second user or hosted tier |
| 2 | AI layer, C2 controller, renderer and harness | Doc 7 m.11; C2 | **6 (Doc 7)** + USD 44–582/mo | No model in the figure path | ≥ 10 unanswerable questions/month for 2 months |
| 3 | Risk module → exposure table and named devaluation scenarios | 5b R3–R8 | 2 of 2.5 | Deterministic arithmetic | > 10 positions, or the founder asks |
| 4 | C6 Monte Carlo → deterministic required return and contribution table | 5b R6; C6 | 2–4 | No forecast shown; Doc 8 J6's 3.98% is already deterministic | Calculator in use and ranges wanted |
| 5 | C7 engine (34 rules) → records pack | Doc 6 R2; Doc 9 rec 2 | 4–8, less 1 | A licensed human computes | Measured practitioner saving justifies it |
| 6 | Research registry, bank module, notes, screens | 5a R1–R6 | 4–8 | Nothing displayed, so nothing stale | A pending investment decision |
| 7 | NGX feed, corporate-action engine, corroboration, validation queue | 5c R2, R6, R7 | 2–4 + USD 26–792/mo + ≈ 20 h/yr | Statement values carry source and as-of | NGX trading more than monthly, or NGX share above a set level |
| 8 | Statistical matcher → deterministic matcher and manual confirmation | Doc 4 R3 | ≈ 1 | Cross-currency pairs always reviewed; in-transit accounts kept | > 50 own transfers/month |
| 9 | C4 calibration → founder-authored rules, tax-weighted items always reviewed, materiality threshold | C4 | ≈ 1 + most queue time | Categories cannot change balances | Model suggestions introduced |
| 10 | C3 axes L, R, I, C → three validation values, computed freshness and the C3.5 entry check | C3; Doc 7 m.14 | ≈ 1 | The R0 lesson is kept exactly; the values map one-to-one onto C3 | First licensed feed |
| 11 | OCR, Docling and local-LLM extraction | Doc 7 §4.5 | 1–2 + hardware | Typed lines checked by balance assertion | > 3 scanned statements/month |
| 12 | Passkeys and CSP work; external review moved | Doc 7 MVB 3, 5, 10 | 0.5–1 | Localhost, full-disk encryption, sandboxed parsers, pinned dependencies and escrowed backups kept | Remote access, AI layer or second user |
| 13 | Claims-ladder engine, construct 6, consent machinery | Doc 3 R1, R3, R4 | 1–3 (Doc 7) | No behavioural sentences shown; fee reports are plain arithmetic | Doc 3's own trigger (shortfall cost > 0) |
| 14 | Nine-area information architecture and 15 screens → Fava and five reports | Doc 8 §4.2, §4.5 | Inside #1 (avoids 5 pw of React) | Fava links each entry to its source document | Second user |

**Totals.**
- Against Doc 7's Option B (25.5 pw), the thin MVP is ≈ **12 pw**, a saving of ≈ 13.5.
- Against the package as specified (≈ 50–64 pw), it saves **≈ 38–52 pw, about 17–24 months at 20 h/week**.
- Running costs fall from about USD 70–1,374 a month (NGX plus AI) to about USD 0–5 (backups), plus practitioner fees.

**Kept intact:**
- source, as-of, unit, currency and status on every figure;
- zero-tolerance reconciliation;
- conversion and in-transit accounts;
- the entry-time primary-source check;
- reproducibility (git, pinned versions, deterministic scripts);
- prepare-not-file;
- no advice.

## 4. The thinnest viable personal MVP

### 4.1 Week 0–1: decide, do not research (≈ 10–15 founder hours)

1. A 90-minute fact-find covering:
   - Doc 1 A1–A10, hours per week, Python/TypeScript skill;
   - institutions, formats and holdings by market;
   - pay cycle, base currency and known residency facts.
2. Three redacted real statements: a Nigerian bank, a UAE bank and a broker.
3. Engage a CITN-registered practitioner for the 2027 filing and agree the pack's fields with them.
4. Commission the CITN/NTAA s.33 and SEC-perimeter opinions now, with a deadline.
5. Set FD-1 = no. With no AI layer, this costs nothing.
6. No NGX licence request for the MVP.

### 4.2 Scope, milestones and effort (at 20 h/week)

**M-1 "Where is my money?" (≈ 3 pw; about week 6)**
- A Beancount repository with the C1 account plan: `Equity:Conversion:<C>`, `Assets:InTransit:<id>`, categories as metadata.
- Opening balances.
- One beangulp importer for the busiest account, with the C1.8 line key and the document SHA-256 kept as metadata.
- Other accounts held as monthly balance assertions.
- A CBN NFEM fetcher that writes `price` directives with source URL, retrieval time and snapshot hash, and rejects any value that differs from its snapshot (C3.5).
- Fava bound to 127.0.0.1.
- A net-worth report in NGN and USD.
- Age-encrypted backup with two-place escrow, and one tested restore.

**M-2 "Decisions for the next 90 days" (+3.5 pw; about week 13, early February 2027)**
- Importers for the remaining two institutions.
- A deterministic transfer matcher.
- Five reports, each printing its definition, sources and as-of date:
  1. FX conversion cost against the CBN reference per provider (C1.5 residual rule);
  2. liquidity in months of essential spend, by currency;
  3. currency exposure with named devaluation scenarios;
  4. fees, levies and recurring charges;
  5. unexplained inflows.
- **Records pack v1** to the practitioner by 28 February 2027.

**M-3 "Complete and checked" (+5.5 pw; about week 24)**
- Broker importers with FIFO lots, dividends and withholding tax.
- NGN currency-pool cost as a derived report, labelled "method pending practitioner".
- The C5 decomposition with its sign check.
- A deterministic goal calculator.
- A provenance report mapping each figure to its document hash and page.
- C1 invariants and golden tests in CI.
- A monthly close checklist with logged minutes.
- The external review before any remote access.

**Effort.** Total ≈ 12 pw (range 8–18, E5), or 480 hours: about 24 weeks.

**Status values:** *unchecked*, *checked* and *disputed*, plus read-time freshness; all map onto C3.

**Pre-registered success measures:**
- every uploaded period reconciles to zero, or its gap is named;
- no figure without source and as-of;
- total operating time ≤ 60 minutes a month after month 3;
- practitioner hours on the founder's case logged;
- at least one logged decision a month that used a report.

### 4.3 Which capabilities change a decision in the first 90 days

| Capability | Decision it can change by February 2027 | Verdict |
|---|---|---|
| Reconciled NGN/AED/USD net worth | How much to hold in each currency | Real |
| Liquidity by currency | Whether to convert, and which account pays a large item (Doc 8 J3) | Real |
| Conversion cost against the CBN reference | Which channel to use next; the official–parallel gap was 2.8–3.2% on 29–30 Oct 2026 (Doc 3 R2) | Real, recurring |
| Exposure and devaluation scenarios | The NGN share; the 2023 unification cost −29% on day one, ≈ −39% by 23 June (V-016) | Real; largest risk |
| Records pack, residency facts, US-situs total, W-8BEN | What to file by 31 March 2027; whether US-situs holdings above USD 60,000 need advice | Real, dated |
| Fees and recurring charges | What to cancel | Real, small |
| Deterministic goal calculator | Contribution level | Real; the Monte Carlo adds little (the money-market count is 0 / 35 / 95 at ±2 points) |
| Payday card; NGX bank note; risk descriptives; AI explanations; data-quality dashboard | None in 90 days (Doc 3 calls the payday card a guardrail) | Inert |

### 4.4 Build versus buy

**Beancount + Fava is the base.** It supplies the ledger, reconciliation (balance assertions), document links, queries and a UI.

hledger is comparable but weaker on lots; Actual Budget is single-currency (Doc 7), failing the core problem; a spreadsheet plus scripts suits weeks 0–4 only, with no per-commodity balancing, assertions or enforced reproducibility.

Portfolio OS adds, on top of Beancount:
- Nigerian and UAE importers with line keys;
- the CBN snapshot fetcher;
- the C1 conventions plus an invariant checker;
- the five reports;
- the records pack;
- later, C2 and the AI layer.

These original parts are also what could later be open-sourced or licensed (Doc 9's kill outcomes).

## 5. Strongest alternative strategy

**Practitioner-first, in-season concierge, software second.** This takes Doc 9's fallback A9 and makes it the first move.

1. **November–December 2026.** Sign one CITN-registered practitioner who serves cross-border or diaspora clients. Obtain counsel's opinion within 6–8 weeks. Put in place a processor agreement and a light DPIA, which are blocking before any second person's data (V-028). The practitioner is the controller and the seller; the founder prepares data.
2. **January–March 2027.** The founder hand-prepares records packs for 10–20 of the practitioner's clients, using Beancount, scripts and a spreadsheet. The practitioner charges the client and pays a fee per pack. The founder's own case is case zero.
3. **Measure:**
   - practitioner hours per case, with and without the pack;
   - client price acceptance;
   - founder hours per pack;
   - which steps repeat.
4. **April 2027 decision.** If packs save at least about 2 practitioner hours each and clients pay, build software for the repeated steps, using a measured specification. If not, keep the personal tool.

**Why it beats the current plan:** it tests the wedge in season with real money; needs no consumer product, C7 engine or AI layer; fits the CITN-compliant posture Doc 9 prefers; and yields S-b and S-c evidence four months earlier.

**Risks:** founder time collides with the MVP build; counsel may classify data preparation as "practice"; the DPIA may not be ready by mid-January. If any fails, run the concierge in the 2028 season and keep 2027 for case zero.

**A weaker second option** is a corporate-action-adjusted NGX dataset sold B2B (Doc 9 §4.5); redistribution licences are unpriced and NGX controls the input.

## 6. Decide now versus learn by building

| Decide now (≤ 1 week) | Learn by building (24 weeks) |
|---|---|
| Founder facts (§4.1) | Parser yield; share of scanned pages |
| Beancount default; 2–3-day falsification spike | Actual operating minutes |
| FD-1 = no; no AI, C7 engine, NGX feed or research module | Which reports drive which decisions |
| Practitioner engaged; opinion commissioned with a deadline | Practitioner hours saved (the wedge's value) |
| Doc 9 gates re-dated (B1, B3) | Conversion-cost size; any shortfall cost |
| Research freeze until a consuming module is being built | Whether the C3 subset and badge policy catch seeded errors |

Docs 10–12 should be short (Doc 10 = this cut list plus milestones). Close errata CC-1 to CC-12 only where they touch the MVP (C1 subset, C3.5, C5); mark the rest "deferred with the module".

## 7. What I could not check

- **Founder facts.** I checked none of them: hours, skills, institutions, formats, holdings, residency or pay cycle. The savings above assume a few positions and three institutions.
- **Effort estimates.** I ran no ADR-10 spike and no import. My effort and minute estimates are reviewer judgement (E5), anchored to Doc 7 §4.13. No measured velocity exists.
- **Scripts.** None re-run; I read the Doc 8 §8 queue code only to confirm it batches by counterparty and omits the materiality deferral.
- **Beancount and Fava.** I did not re-verify their current capabilities against live documentation. I rely on Doc 7 F4 and F31 and on general knowledge (E3/E4).
- **Legal questions.** I did not verify the CITN Act, NTAA s.33, the anchor of the 31 March deadline, or whether concierge data preparation counts as "practice". Counsel is needed for all of them.
- **Coverage.** §1, §4 and §8 of Docs 4, 7, 8 and 9; §1 and §8 of Docs 3, 5a, 5b, 5c and 6; contracts skimmed. Where other sections answer a point, narrow the finding rather than drop it. No web sources were fetched; this memo challenges internal consistency and scope, not external facts.
