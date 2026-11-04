# Investment Committee Memorandum — what to build first

```
Document: Investment Committee Memorandum (Stage 4 build-first decision)
Department: Investment Committee  ·  Lead role(s): Venture Capital Partner (chair), CEO, CFO, CTO, Chief Product Officer, Chief Investment Officer, Chief Behavioural Science Officer, Head of the Independent Red Team, outside YC-style operator (all simulated, none licensed)
Version: 1.0  ·  Date: 2026-11-04  ·  Status: recommendations for founder decision
Reviewers required: The founder (approval authority); a CITN-registered tax practitioner (D4, D7); Nigerian counsel (D7); an external security reviewer (D3)
```

*This is a capital-and-time allocation decision about what to build first, not a funding round. Every number is taken from the package and cited; where the committee did its own arithmetic on cited inputs it says "IC arithmetic". Simulated roles, not licensed professionals. This committee is itself the same model family as every author and reviewer (Doc 11 §2.3), so its agreement is not independent validation.*

## 1. Decision summary

**Verdict: build a modified thin MVP; do not build Doc 7's fuller slice; do not sell anything in the 2027 season unless three legal and privacy items are in hand by 15 January 2027.**

- **D1 (7–2).** Adopt RT-C's thin MVP (≈ 12 person-weeks, range 8–18; RT-C §4.2) on Beancount + Fava, *modified* by a security milestone M-0, an independence label on every status, and a one-page assumption register. Every deferred capability keeps its contract and a measured re-entry trigger.
- **D2 (8–1).** Sequence: fact-find → M-0 isolation → 2–3-day falsification spike → M-1 → M-2 (records pack to a practitioner by 28 February 2027) → M-3. Doc 9's six-month Stage 0 is replaced by an hours-indexed Gate P.
- **D3 (7–2).** Twelve conditions precedent before any real statement is loaded, led by a dedicated OS account with no development tools or coding agents.
- **D4 (8–1).** Independence comes only from a licensed practitioner, a security reviewer and a named second person; everything else is labelled "self-checked" or "checked by software".
- **D5 (8–1).** The C6 Monte Carlo goal engine does not ship; a deterministic calculator with registered, sourced assumptions does.
- **D6 (8–1).** Recurring data-and-AI ceiling of USD 5 a month for the MVP; NGX asked in writing now.
- **D7 (6–3).** 2027 is "case zero" only; a small practitioner-led concierge runs in 2027 only if the go/no-go passes on 15 January 2027, otherwise in the 2028 season. Pre-orders are held.
- **D8 (7–2).** Behavioural module ships four decision-linked L0b measures and a decision log; no L1 claims.
- **D9 (7–2, recommendation).** New private repository for code; the ledger in a separate local repository with no remote.

**Biggest uncertainty:** the founder's weekly hours. Nothing has been supplied since the master prompt (Doc 11 §1).

## 2. Members and process

| Member | Brings the position of | Conflict declared |
|---|---|---|
| Venture Capital Partner (chair) | Doc 9 investment lens | Authored Doc 9's no-fund call |
| CEO | Docs 1 and 9 strategy; the "C7 engine is the wedge" view (Doc 11 §7.2) | Owns the charter's ambition |
| CFO | Doc 9 §4.4 unit economics; Doc 6 accounting | — |
| CTO | Doc 7; contracts C1–C3, C8 | Owns Option A, the PostgreSQL build |
| Chief Product Officer (CPO) | Doc 8; the charter's usability criteria | — |
| Chief Investment Officer (CIO) | Docs 5a/5b/5c; contract C6 | Owns the goal engine |
| Chief Behavioural Science Officer (CBSO) | Doc 3 | Owns the claims ladder |
| Head of the Independent Red Team | Doc 11; panels RT-A, RT-B, RT-C | Independent of all authors |
| Outside YC-style operator | Consumer-fintech operating experience; not an RT-C panel member | Independent |

**Process.** Each member read the brief, Doc 1 §9–10, Doc 11 in full, RT-C in full, Doc 9 §1, §4.4–4.6, §7–9, the §1 summaries of Docs 3–8 and the contracts, and the decision log. Each wrote a position before debate. Decisions pass by simple majority of nine; the chair votes. Dissents are recorded with reasons and are not withdrawn to make a tally look better. The founder asked for a committee that does not approve everything; three of nine decisions carry two or more dissents, and D7 split 6–3 across three positions.

## 3. Answers to the founder's committee questions

**Q1. Does the product solve a compelling problem?** *For the founder, yes, but narrower than the charter.* The decisions that can change by February 2027 are: how much to hold in each currency; which channel converts money (the official–parallel gap was 2.8–3.2% on 29–30 October 2026); exposure to a devaluation (the 2023 unification cost −29% on day one and about −39% by 23 June, V-016); and what to file by 31 March 2027 (RT-C §4.3). Charter problems 3, 4 and 5 (behaviour, research, goals) change no decision in 90 days.
*Strongest objection (YC operator):* the founder makes about one cross-currency transfer a month (Doc 4 §4.3.2). A spreadsheet plus a practitioner may solve 80% of the problem. Whether the rest is worth 480 hours is unmeasured, and F-1 exists to measure it.

**Q2. Can the analysis be demonstrably more useful than alternatives?** Only on three tested claims:
- conversion cost measured against the CBN reference, which no bank app shows (C1.5);
- reconciliation to the printed closing balance with the gap named (Doc 1 §9);
- a records pack that saves practitioner hours (F-14 fails below about 2 hours a case).

F-1 asks whether at least 3 decisions changed in six months and whether their value exceeds the hourly value of the hours spent.
*Strongest objection (Red Team):* every accuracy target is measured against the founder's own decisions (V-034). "More useful" cannot be shown without a second person or a practitioner.

**Q3. What makes the behavioural component genuinely differentiated?** Restraint tied to money, not personality. Doc 3's ladder lets the product say only what records show. Its measures are priced decisions: fees, conversion cost, liquidity by currency. Its payday decomposition prevents false "splurge" alarms (8.03× naïve against 1.60×).
*Strongest objection (VC partner and YC operator, Doc 9 §7.3):* nobody buys restraint. The best-evidenced interventions need money movement, which Doc 4 R13 rules out. The remaining prompts have a bias-corrected finance effect of 0.00, and a within-person trial has power 0.36 at twelve months (Doc 3 §1). It is a trust feature, not a moat.

**Q4. What would make users trust it with financial data?** For the founder:
- nothing leaves the machine (FD-1 = no);
- no model is in the figure path;
- every figure carries source and as-of;
- erasure always works (C8);
- no money moves.

For others, trust is "earnable only through years of visible accuracy" (Doc 9 §4.5), and banks and PiggyVest (6m users) start with it.
*Strongest objection (Red Team):* the dominant threat is the founder's own laptop. An infostealer or a hostile npm or pip package reads everything while the server runs (RT-B B4). Fava has no authentication (RT-B M2). Trust is not earned until CP-1 to CP-12 hold.

**Q5. Which capabilities create the most measurable value?** In order:
1. the records pack, measured in practitioner hours saved (F-14);
2. conversion cost against the reference, in money per conversion;
3. liquidity and currency exposure, measured by decisions logged;
4. fees and recurring charges, in money cancelled.

The ledger is the precondition, "necessary, not sufficient" (Doc 9 §8.2).
*Strongest objection (CFO):* the records pack's value may accrue to the practitioner, who "may capture the fee" (Doc 9 A9).

**Q6. What prevents easy copying?** Very little today. Doc 9 §4.5 finds one "real, modest moat if executed": the NGX corporate-action pipeline, which nobody sells. The cross-border engine is a "conditional differentiator". Brand and behavioural data are not moats.
*Strongest objection (CEO):* the thin MVP defers the only moat (RT-C cut 7). The committee accepts this. A moat matters only once a company exists, and Doc 9 itself says no-fund (§1).

**Q7. Which features are expensive to maintain?** From RT-B §6 and Doc 7:
- weekly tax-source monitoring, ≈ 26 h/yr;
- weekly `pip-audit`, ≈ 26 h/yr;
- AI smoke-evaluation triage, ≈ 24 h/yr;
- NGX single-source validation, ≈ 20 h/yr;
- AI evaluation at USD 34.93–501.09 a month (Doc 7 §4.12(b));
- a 35-record tax rule engine awaiting re-gazetting (Doc 6 §1);
- the corporate-action engine.

RT-B totals ≈ 130–150 h/yr, about 3 h/week. RT-C puts the operating load at 160–180 min/month against a charter target of 20.
*Strongest objection (CTO):* cutting monitors shifts the cost into undetected staleness. The C3.5 entry check and read-time freshness must stay (RT-C §3).

**Q8. What are the regulatory risks?** In order of proximity (perimeter map, Doc 11 §4(c)):
- **NDPA duties from n = 2:** a DPIA and a s.43 transfer basis; penalties up to the greater of ₦10m or 2% of gross revenue (Doc 9 F16).
- **Paid tax output:** CITN Act s.16 and s.19, with up to two years' imprisonment on indictment (Doc 9 F21); NTAA s.33 and s.101.
- **Advice:** SEC robo-advisory registration (₦100m, about $74k) for allocation outputs to any external user, paid or free (V-042).
- **UAE:** Decree-Law 33/2025 "promotion", with at least one year's imprisonment and AED 1m–250m.
- **Data licences:** NGX licence terms.
- **Model provider:** a possible usage-policy duty, whose quoted text is unverified and effective 12 November 2026.

*Strongest objection (Red Team):* the documents draw the line too narrowly. The trigger must be "any output computed from a specific person's circumstances, delivered to someone other than the operator" (V-042).

**Q9. What would the economics look like at thousands or millions of users?** From Doc 9 §4.4 (E5 throughout):
- A ₦2,500 Basic subscriber contributes $0.49 a month (29%), with LTV/CAC 0.3 at a $25 CAC and 7% churn.
- At 7% churn, USD-only plans break even near 30k payers and a diaspora-heavy mix near 71k. A Nigeria-heavy mix never breaks even.
- Fixed costs are $0.82m at 10k payers and $2.47m at 100k.
- The 1,000,000-payer row was withdrawn as incoherent with the 20–150k obtainable market.
- Uniform agentic AI use takes the Nigeria-heavy margin to 1%, and uniform heavy use to −196%.

Millions of users is therefore a B2B2C story: 11.04m Retirement Savings Accounts, priced as a flat licence because $1 per member is 5–11% of a pension administrator's revenue per account.
*Strongest objection (CFO):* every lever that rescues the economics (churn, tokens, Play billing, the naira) is outside the founder's control (Doc 9 bear case 2).

**Q10. How could it succeed in Nigeria?**
- **Banking.** Open banking has not gone live (Doc 9 F13). Okra shut down in May 2025, and Mono sold for $25–40m in stock. Aggregation costs ≈ $0.37 per account a month and can turn the Basic margin to −4%. Statement upload is the only sound default (Doc 4 Conclusion 1).
- **Currency.** NFEM was ₦1,346/$ against a parallel ₦1,382–1,388 (Doc 9 F18). Naira cards are capped at $500–1,000. Doc 9's repricing rule raises NGN prices if the naira is more than 15% weaker for 30 days.
- **Market data.** NGX processing is priced as non-display, so the core feed costs USD 26–1,417 a month depending on a question only NGX can answer (Doc 5 §1). The repository's policy rate was wrong at entry (brief §1).
- **Consumer behaviour.** 62% of adults earn under ₦100,000 a month, and 3% have used shares. Smartphone ownership is 26.6% nationally but 75% in urban centres, and 96% of phones are Android (Doc 9 F2, F9). Willingness to pay is unmeasured. The Dangote IPO added over 2 million digital subscribers who need records, not tax (F6).

Success in Nigeria means statement-first, USD-priced cross-border users or partner distribution. It does not mean an NGN consumer app.
*Strongest objection (CEO):* this writes off the Nigeria-resident mass-affluent, who need a year-round position (Doc 9 §7.3 dissent).

**Q11. What evidence would cause us to reject or redesign the strategy?** The pre-registered tests F-1 to F-18 (Doc 11 §8), Gate P (D2) and the re-dated kill criteria (D7), summarised per decision in §9.
*Strongest objection (Red Team):* six of the eighteen tests need someone other than the founder. Without a second person the strategy cannot be rejected on evidence, only on the founder's say-so.

## 4. Bull case

1. **The personal product is cheap to make useful.** About 12 pw gives first output around week 6. Running costs fall from USD 70–1,374 a month to USD 0–5 (RT-C §3), with accuracy and provenance intact.
2. **The founder's decisions are real and dated.** They concern NGN share, conversion channel, devaluation exposure, the 2027 return, US-situs holdings against USD 60,000, and the W-8BEN date (RT-C §4.3).
3. **The method is sound.** 22 of 26 sampled fixes landed in full: 84.6%, Wilson interval 66.5–93.9% (Doc 11 §3). Contracts C1–C8 make the thin build forward-compatible.
4. **The cross-border wedge is legally new and fear-driven.** Under the disjunctive s.201 residency test, FX is a chargeable asset, and no UAE treaty is in effect. Remittances run at about $21.8bn a year. The candidate segment is 99k–463k people (Doc 9 §7.4, §8.2).
5. **The case-zero measurement is nearly free.** Practitioner hours with and without the pack price the wedge before any consumer software exists (RT-C M8).
6. **The original parts are separable assets.** Importers, the CBN snapshot fetcher, C1 conventions and the records pack could be open-sourced or licensed if the company path dies (RT-C §4.4; Doc 9 §8.3).

## 5. Bear case (the strongest version)

1. **The product may be a sophisticated substitute for hiring an accountant.** If the fact-find shows three institutions, a few positions and no foreign gains, the practitioner's fee buys most of the value. 480 hours of the founder's time is the most expensive line in the plan, and the founder has not said what an hour is worth (Doc 11 §10 rank 15).
2. **The operating load breaks the charter before any feature does.** It is 160–180 min/month against a 20-minute target (RT-C M2), or 130–150 h/yr (RT-B §6). None of it is measured. A founder who stops doing the monthly close has a stale ledger that looks authoritative, which is the failure of the earlier tracker.
3. **No control in the plan is independent.** The founder ingests, labels, validates and is the subject. Every reviewer, including this committee, is the same model family (Doc 11 §2.3). "Reconciled" proves completeness, not correctness (Doc 4 Conclusion 3).
4. **The wedge is a different company.** It is a seasonal, liability-bearing professional service that needs a CITN opinion and a practitioner who may take the fee (RT-C M8). The personal build and the wedge share only the records engine.
5. **Every commercial lever is external.** Willingness to pay is unmeasured. At 7% churn the business needs 92% USD payers at a $25 CAC. Incumbents can add a net-worth tab at zero marginal acquisition cost. Active Nigerian investors fell 30% and seed-to-Series-A conversion is 5.5–6.5% (Doc 9 §7.4, F19).
6. **The calendar is hostile.** The pack needs about 260 hours of build (M-1 + M-2, RT-C) in the 16 weeks to 28 February 2027 (IC arithmetic). At 10 h/week only 160 hours exist. The 2027 commercial test has, realistically, already been lost.
7. **The research programme itself is evidence of risk.** It produced about 260,000 words in two days and no line of working ledger (RT-C M9). The founder's prior tracker failed on data, not design.

## 6. Alternative strategies considered

| # | Strategy | Case for | Why not chosen now | Status |
|---|---|---|---|---|
| A1 | **Doc 7's fuller build.** Option A, PostgreSQL C1: 37 pw (24–58). Option B Stage-0 slice: 10/17/28 pw, with L0/L1 measures, registries and security baseline, then AI and risk in Stage 0b | Closest to the charter; fewer later migrations | 17 or 12 months at 20 h/week against a six-month gate (Doc 7 §4.13). It omits the uncosted tax engine, so the gate still cannot pass. Its AI layer changes no decision (RT-C M5) | Rejected for the MVP; Option A is the costed fallback if F-13 fails |
| A2 | **Concierge-first, practitioner-led (RT-C §5).** Founder hand-prepares 10–20 packs in January–March 2027; practitioner sells and signs | Tests the wedge in season with real money; no consumer product needed | Requires a CITN opinion, a processor agreement and a DPIA by mid-January (RT-B). It collides with the MVP for founder hours | Adopted conditionally for 2027 (go/no-go 15 January 2027); default for the 2028 season (D7) |
| A3 | **Remain a personal tool (Doc 9 A8).** No commercial work at all | Zero regulatory exposure; all hours to the founder's problem | Forecloses a cheap option. Case zero costs only practitioner-hour logging | Default if any D7 kill criterion trips; the CPO's preferred 2027 position (dissent) |
| A4 | **Spreadsheet plus practitioner, no software.** Buy, don't build | Cheapest; fits a low-hours founder | No per-commodity balancing, balance assertions or reproducibility (RT-C §4.4); repeats the brief's unsourced-constant pattern | Fallback for the 2027 pack if M-1 is late (D2 rule) |
| A5 | **NGX corporate-action dataset sold B2B** (RT-C §5; Doc 9 A6) | The one real moat | Redistribution licences unpriced (₦1.5–2.0m/yr plus fees); NGX controls the input; $20–200/month price points | Later, as a by-product |
| A6 | **Practitioner workbench (Doc 9 A9)** | Fits the CITN Act cleanly | Seat market small; willingness to pay unknown | Fallback if the CITN opinion rules out consumer-facing packs |

## 7. Decisions D1–D9

### D1 — Personal-MVP scope: adopt RT-C's thin MVP, modified

**Vote 7–2.**
- *For:* chair, CFO, CPO, CIO, CBSO, Red Team head, YC operator.
- *Against:* CEO, CTO.

**What is in (by milestone; effort from RT-C §4.2, E5).**

| Milestone | Content | Effort |
|---|---|---|
| **M-0 Secure base (IC addition)** | Conditions precedent CP-1 to CP-10 (D3); per-class backups under C8; escrow hardened | Hours to days (Doc 11 §7.1); not in RT-C's 12 pw |
| **Spike F-13** | Balance-assertion reconciliation and idempotent beangulp re-import on three redacted statements, plus RT-B's proxy and injection checks | 2–3 days |
| **M-1 "Where is my money?"** | Beancount repository on the C1 account plan (`Equity:Conversion:<C>`, `Assets:InTransit:<id>`, categories as metadata); opening balances; one importer with the C1.8 line key and document SHA-256; other accounts as monthly balance assertions; CBN NFEM fetcher with snapshot hash and C3.5 rejection; Fava on 127.0.0.1 behind the CP-8 proxy; net worth in NGN and USD; one tested restore | ≈ 3 pw |
| **M-2 "Decisions for the next 90 days"** | Two more importers; deterministic transfer matcher. Five reports, each printing definition, sources and as-of: (1) conversion cost against the CBN reference; (2) liquidity in months of essential spend, by currency; (3) currency exposure with named devaluation scenarios; (4) fees, levies and recurring charges; (5) unexplained inflows. Decision log. **Records pack v1 to the practitioner by 28 February 2027** | +3.5 pw |
| **M-3 "Complete and checked"** | Broker importers (FIFO lots, dividends, withholding); NGN currency-pool cost as a derived report labelled "method pending practitioner" and gated on residency (Doc 11 A4); C5 decomposition with sign check; deterministic goal calculator (D5); provenance report; C1 invariants and golden tests in CI; monthly close checklist with logged minutes | +5.5 pw |

**IC modifications to RT-C:**
1. M-0 comes first, before any real data.
2. Status uses RT-C's three values (*unchecked*, *checked*, *disputed*) × the C3.3a independence chip, badged only above a materiality threshold (Doc 11 §7.1 resolution).
3. A one-page model inventory and assumption register is kept for the surviving models (D5).
4. The residency gate is put on the pool view.
5. "Monthly review under 20 minutes" is restated as "total operating time ≤ 60 minutes a month, measured" (RT-C M2).

**What is deferred, with its trigger, and how the nine systems are preserved.**

| System | MVP form | Deferred | Re-entry trigger (measured) | Contract kept binding |
|---|---|---|---|---|
| A Personal finance | Ledger, importers, deterministic matcher, five reports | Statistical matcher; C4 calibration; OCR; bank APIs | > 50 own transfers a month; model suggestions introduced; > 3 scanned statements a month; open banking live plus a 60-day shadow test (Doc 4 R10) | C1, C3 subset, C4 rule "tax-weighted always reviewed", C5 |
| B Behavioural | Four L0b measures, decision log (D8) | Claims-ladder engine, construct 6, obligations view, questionnaires | Shortfall cost > 0 (Doc 3); consent machinery and tokenisation live | Doc 3 templates; C8 class B |
| C Investment research | Holdings valued from broker or CSCS statements with as-of dates | Registry, notes, bank module, NGX feed, corporate actions | A pending investment decision (CIO wording, adopted: a planned purchase or sale above a founder-set share of liquid net worth); NGX trading more than monthly | C2, C3, C3.5 |
| D Portfolio and quant | Exposure table; named devaluation scenarios; FIFO lots | Risk module; any optimiser (no optimiser in Phase 1, Doc 5 §1) | > 10 positions, or the founder asks | C5 |
| E Goal Reality Engine | Deterministic required return and contribution table | C6 Monte Carlo | D5 conditions | C6 |
| F Forecasting | The calculator only | Planning module (uncosted, Doc 7 §4.13) | After E re-enters | C6 |
| G Tax | Records pack; US-situs and W-8BEN monitors in presence mode | C7 computing engine | F-14 shows a priced saving **and** F-9 passes | C7 |
| H AI | None (FD-1 = no) | AI layer | F-15: ≥ 10 unanswerable questions a month for 2 months, **then** CP-11 | C2 |
| I Commercialisation | Measurement only: practitioner hours, operating minutes, decisions | Any product for others | D7 gates | — |

**Preservation rule.** Docs 1–9 stay the target specification, frozen, not deleted. Each deferred item sits in a re-entry register checked at every monthly close. No item leaves the vision without a founder decision recorded in the log. Each MVP component implements a forward-compatible subset of its contract (RT-C §3).

**Dissents.**
- *CEO:* the C7 engine is the wedge (Docs 6 and 9). A minimal cross-border rule set should ship in M-3 so the 2028 season starts with software. *Majority:* 0 of 35 rules are practitioner-confirmed (Doc 6 §1), the engine refuses every foreign gain today, and F-14 must price it first.
- *CTO:* Beancount should not be the *default* before the spike. The decision should be "spike, then choose", with Option A's 37 pw re-costed for the thin scope. *Majority:* RT-C M6 shows the spike's WA-plugin criterion is unnecessary under C1 D3. Option A remains the named fallback if F-13 fails.

**Rationale.** Doc 9's Stage 0 cannot pass at any plausible hours (P-1). Every executive summary's biggest uncertainty is a founder fact (RT-C B2). The thin MVP reaches the dated decisions without loosening a non-negotiable.

### D2 — Sequence and calendar

**Vote 8–1.**
- *For:* all members except the CFO.
- *Against:* CFO.

**Sequence.**
1. **Week 0–1** (by 13 November 2026):
   - the fact-find (§11);
   - FD-1 = no recorded;
   - practitioner engaged;
   - opinions commissioned (D7);
   - the NGX letter sent (D6).
2. **M-0** (CP-1 to CP-10). Redacted statements are handled only after M-0 (Doc 11 §7.1).
3. **Spike F-13.** If it fails, Option A is costed before Stage 5.
4. **M-1, M-2, M-3**, in that order.

The research freeze applies throughout. No new research document is written until a consuming module is being built. Four exceptions: the opinions, the NGX answer, tax re-gazetting (Doc 6 F22) and the security baseline (RT-C B2; Doc 11 §10 rank 16).

**Calendar, indexed to hours.** The MVP is 480 hours (RT-C). M-1 plus M-2 is about 260 hours. From 9 November 2026 to 28 February 2027 is 16 weeks (IC arithmetic).

| Founder build hours/week | Hours to 28 Feb 2027 | Records pack by software? | Whole MVP |
|---|---|---|---|
| 10 | 160 | No; pack prepared manually | ≈ 48 weeks |
| 20 | 320 | Yes, ≈ 60 h margin | ≈ 24 weeks (late April 2027) |
| 40 | 640 | Yes | ≈ 12 weeks |

**Manual-pack rule.** If M-1 is not complete by **15 January 2027**, the 2027 records pack is prepared by hand from statements against the practitioner's field list (alternative A4), and software follows on the hours-indexed plan. Missing the deadline for the founder's own return is the one failure the plan does not allow.

**Gate P replaces Doc 9's six-month Stage 0 gate.** Gate P is read when 480 build hours have been logged or on 4 November 2027, whichever comes first. It passes if:
1. every *uploaded* period reconciles to zero, or its gap is named (F-16);
2. no figure appears without source and as-of;
3. the records pack reached the practitioner by 28 February 2027, by software or by hand;
4. operating minutes are measured for four weeks after M-1, and total operating time is ≤ 60 min/month after month 3 (success target);
5. at least one logged decision a month used a report.

What follows from each outcome:
- Failing (1) or (2) means **redesign** (Option A or spreadsheet), not a verdict on the hypothesis.
- More than 60 min/week for four weeks cuts the lowest-value control (F-12).
- A schedule miss with integrity intact is a re-plan, not a kill.

**Dissent (CFO).** A backstop at 4 November 2027 lets a slipping build absorb a whole year. The CFO wants 4 August 2027 (Doc 9's month 9). *Majority:* with hours unknown, a calendar backstop would repeat RT-C B1's error of testing the calendar rather than the hypothesis. The backstop is reviewed once the hours are known.

### D3 — Conditions precedent before real financial data (including redacted statements)

**Vote 7–2.**
- *For:* chair, CEO, CFO, CPO, CIO, CBSO, Red Team head.
- *Against:* CTO (wants more), YC operator (wants less).

| # | Condition | Source |
|---|---|---|
| CP-1 | Portfolio OS runs in a **dedicated OS account or VM** with no development tools, no AI coding agents and no NEXUS checkout. Code is installed there from a hash-pinned release (MVB 7) | RT-B B4; V-043 |
| CP-2 | The data directory sits outside every repository and agent working directory. A pre-commit check in every code repository blocks statement and ledger files. The ledger's own git repository has no network remote | RT-B B4; D9 |
| CP-3 | Ingestion uses a drop folder shredded after import. Statements are not left in Downloads or email. PDF passwords are stored nowhere, or in the OS keychain | RT-B B4 |
| CP-4 | The email account that receives statements is treated as part of the system boundary | RT-B threat 2 |
| CP-5 | Full-disk encryption and screen lock; services on 127.0.0.1; a dedicated browser profile with no extensions | MVB 1, 2, 5 |
| CP-6 | **C8 live before the first backup:** per-class age recipients; no compliance-mode lock (C8-I4); governance mode only with the bypass credential in escrow; write-only host backup key; key-store identity escrowed with `age -p` or 2-of-3, never bare paper; rule 34 gates nothing (C8-I2); rotation window ≤ 30 days stated | V-041; RT-B M8 |
| CP-7 | One tested restore and one erasure drill (C8-I3) | RT-C M-1; C8 |
| CP-8 | Fava behind an authenticating proxy with a Host-header check, and a narration-injection test passing. Otherwise the founder signs acceptance of the residual risk, valid only with CP-1 in place | RT-B M2 (disputed) |
| CP-9 | The C3.5 entry check is live on the CBN "NFEM Rate" field before any FX-derived figure | V-010, V-037 |
| CP-10 | Counterparty identifiers are tokenised at ingest. Relatives' account numbers never appear in clear | RT-B M5 |
| CP-11 | Before **any** model enters the path (AI layer or hosted extraction): a **fresh C2 adversarial round** with new strings, written by a party other than C2's author; RT-B tests (i)–(vi); a value-blind model. C2 passes 0 of 20 only on the list it was hardened against (V-040) | RT-B B2 |
| CP-12 | External security review (≈ 1 reviewer-week, Doc 7 MVB 10) before network exposure, any AI layer or a second user. This applies only because CP-1 is done | RT-C m4; Doc 11 §7.2 |

**Development-tooling rule.** AI coding agents may build Portfolio OS code in the development account against synthetic fixtures only (brief §5.7). They never run in, or gain read access to, the data account.

**Dissents.**
- *CTO:* CP-12 should precede the first real statement, as Doc 7 rank 2 specifies. A single author reviewing their own importers is the risk MVB 10 exists for.
- *YC operator:* CP-8 and CP-10 are over-engineering for one user on an isolated account; RT-C would accept the risk.

*Majority:* CP-1 removes most of the threat CP-12 targets, at hours of cost. CP-10 protects third parties who did not consent, which is not the founder's risk to accept.

### D4 — External challenge with one user

**Vote 8–1.**
- *For:* all members except the Red Team head.
- *Against:* Red Team head.

1. **Licensed tax practitioner (CITN-registered), engaged in November.** The practitioner:
   - agrees the pack's fields;
   - receives pack v1 by 28 February 2027;
   - recomputes Doc 6 Examples 1–3 and the founder's real year (F-9);
   - logs hours with and without the pack (F-14);
   - answers the four C1.6 questions;
   - gives two quotes for per-pack review (Doc 9 §9 item 2).

   Doc 9 models per-pack review at $25–60 (E5). Fees are quoted, not assumed.
2. **Sampled third-party checks.** Each quarter, a second person rebuilds one month blind (F-2) and plants tier-1 errors in a labelled replica (F-4, F-5), at a budget of about one reviewer-week (RT-B M6). The founder names the person. Failing that, a paid reviewer works under a confidentiality agreement. Failing that, F-2, F-4, F-5 and F-18 are reported as "not run", never as passed.
3. **External security reviewer**, as in CP-12.
4. **Labels.** Every check records C3.3a `independence` ∈ {self, simulated_agent, second_person, licensed}. The UI shows "self-checked" or "checked by software". C7's `reviewed_internal` is renamed "checked by software" to match C3 v0.2; the contracts owner confirms. Nothing is called "validated", "reviewed" or "independent" unless a second person or a licensed professional did it. The records pack's cover sheet lists which checks were self, software, second-person or licensed. This memo counts as `simulated_agent`.

**Dissent (Red Team head).** F-2's decision rule says no records pack leaves until a second person's blind rebuild passes. Sending pack v1 before F-2 runs breaks a pre-registered rule. *Majority:* the practitioner's recomputation *is* the external check on the pack, the filing date governs, and the cover sheet discloses the gap.

### D5 — Goal engine and assumptions

**Vote 8–1.**
- *For:* all members except the CIO.
- *Against:* CIO.

**Decision.** The C6 Monte Carlo engine does **not** ship in the MVP. RT-A showed its headline is an assumption readout:
- NGN-depreciation drift of 8%, 12% and 16% gives 55, 41 and 27 of 100;
- a jump rate of 0 against 0.3 gives 38 against 45, so more devaluation risk shows better odds;
- detecting a 2 pp/yr drift error needs 3,926 months, about 327 years (Doc 11 A2).

M-3 ships a deterministic calculator: required return (nominal and real) and a contribution table. Every assumption is shown at low, central and high values, and any NGN-depreciation input is a registered, sourced assumption, never a default. Devaluation scenarios are *named historical events* (the 2023 unification, V-016), not forecasts.

**Re-entry conditions for C6, all required:**
1. counts shown at low, central and high values of each dominant assumption;
2. refusal when the span exceeds about 20 points;
3. the monotonicity test F-8 passes;
4. drift declared untestable;
5. F-7 shows the engine changes a decision the table does not;
6. the founder chooses the capital-market-assumption source and the neutral default (C6 Q1–Q3).

**Assumption register, required before Stage 4 sign-off.** It is the scoped version RT-A asked for; V-036's "before Stage 5" timing is overruled. It covers the models that survive D1:
- C1 conventions;
- the C1.5 residual rule;
- the C5 rate hierarchy;
- matcher rules;
- the badge materiality threshold;
- the "essential spend" definition;
- devaluation scenarios;
- the WA and FIFO cost methods;
- freshness thresholds;
- the C8 rotation window;
- operating-time targets.

Fields per entry: owner, source, as-of, evidence grade, sensitivity (low/central/high effect), test, materiality tier (tax and net worth tier 1, behaviour tier 3) and review date. About 220 E4/E5 parameters are untracked today (V-036). Only those feeding surviving models are registered; the rest are marked "deferred with module".

**Dissent (CIO).** Doc 5b and C6 make the engine Personal-MVP. Under RT-A's conditions it could ship in M-3, and the deterministic table hides the shortfall risk the founder most needs to see. *Majority:* the money-market example moves only 0 / 35 / 95 at ±2 points (RT-C §4.3), F-8 fails today, and the table already shows required return.

### D6 — Data budget

**Vote 8–1.**
- *For:* all members except the CIO.
- *Against:* CIO.

| Line | MVP decision | USD/month | Source |
|---|---|---|---|
| NGX licence | Not bought. Holdings come from broker or CSCS statements. **Written question to NGX in November:** natural-person eligibility; whether personal analytics counts as non-display; local or international basis; bandwidth band | 0 | Doc 5 §4.2; RT-C cut 7 |
| US data | Not bought. Broker statements; SEC EDGAR (free) if needed; yfinance removed | 0 | Doc 5 §4.1; Doc 11 §7.2 |
| AI in the product | None (FD-1 = no) | 0 | RT-C M5 |
| CBN and NBS primary pages | Snapshots with hashes | 0 | C3.5 |
| Off-site backups | Backblaze B2: first 10 GB free; 50 GB $0.28 | 0–5 | Doc 7 §4.12(d) |
| **Recurring ceiling for founder approval** | | **≤ 5** | RT-C §3 |

**Ceilings that apply after a trigger, each needing its own approval:**
- NGX at the figure NGX quotes in writing. The reference points are $26.33 (local, display only), $103.78 (local, non-display) and $791.67 (international, non-display), with a sensitivity up to $1,416.67.
- An AI layer at Doc 7's central $141.64 a month, with per-workspace spend limits.
- US data at Tiingo's $30 a month.

One-off professional fees (practitioner, counsel, security review) are quoted separately. They sit inside Doc 9's Stage 0 envelope of USD 10–20k, which includes them. Development tooling, such as coding agents, is outside this ceiling.

**Dissent (CIO).** Approve the local non-display line ($103.78) now, so M-3 values NGX holdings daily rather than at statement dates. *Majority:* no 90-day decision turns on it (RT-C M4), and NGX's answer may change the figure eightfold.

### D7 — Commercial path

**Vote 6–3.**
- *For:* chair, CFO, CTO, CIO, CBSO, Red Team head.
- *Against:* CEO and YC operator (both want more commercial testing in 2027); CPO (wants none in 2027).

**Decision.**
1. **Now:** commission, with a 6–8-week deadline, the CITN Act s.16/s.19 and NTAA s.33 opinion and the SEC-perimeter opinion (ISA 2025, robo-advisory rules), plus a light DPIA (RT-C B3; RT-B C3). UAE counsel is commissioned only if UAE residents are to be approached.
2. **2027 season = case zero.** The founder's own pack measures F-9 and F-14.
3. **Go/no-go on 15 January 2027** for a 2027 concierge (alternative A2) of at most the 10–20 clients RT-C proposes, through one practitioner who is the controller, seller and signer. All four must hold: the CITN opinion is in hand and favourable to that structure; a processor agreement is signed; the DPIA is done; and the manual-pack rule (D2) has not been triggered. If any fails, the concierge runs in the 2028 season, and the plan says so openly.
4. **S-a pre-orders are held** until the SEC and UAE opinions arrive. When run, they exclude UAE residents and research features (V-042).
5. **No output computed from a specific person's circumstances is delivered to anyone but the founder** until counsel opines (Doc 11 §9.3).

**Kill criteria, re-dated.**

| Gate | Kill if | Then |
|---|---|---|
| On receipt of opinions | Core outputs are tax practice or regulated advice **and** no practitioner or licensed partner will hold the activity. A late opinion is a block, not a kill | Remain a personal tool (A3) |
| Case zero, by 30 April 2027 | F-14: saving < about 2 practitioner hours on the founder's case; or F-9 shows a material difference outside `disputes[]` | No C7 engine; concierge reconsidered; rules revert to `draft` |
| End of the first in-season concierge | Packs save < about 2 hours each, or clients do not pay at a price where the pack carries itself (≈ $100; Doc 9 §4.4) | Remain a personal tool, or the practitioner workbench (A6) |
| Doc 9 month-15/18/24 gates | Unchanged in substance, re-indexed from the first in-season test | As Doc 9 §8.3 |

**Dissents.**
- *CEO:* waiting for 2028 pushes the first demand signal 12 months later. The 15 January date should be treated as a target to hit, with counsel briefed this week.
- *YC operator:* agrees with the CEO. The concierge is the only test with real money, and losing a season is the costliest delay in the plan.
- *CPO:* no concierge in 2027 at all. A founder of unknown hours cannot run the MVP, their own filing and 10–20 other people's packs in one quarter (RT-C §5 risks), and F-1 should pass before any commercial work.

*Majority:* the conditional date honours both concerns. If counsel and the DPIA arrive in time, the founder still has to choose against hours.

### D8 — Behavioural module

**Vote 7–2.**
- *For:* chair, CFO, CTO, CPO, CIO, Red Team head, YC operator.
- *Against:* CBSO, CEO.

**Ships (L0b, decision-linked; Doc 3 constructs 1–4):**
1. recurring charges: cancel or keep;
2. fees, levies and conversion cost against the CBN reference;
3. liquidity buffer by currency;
4. currency conversions against the currency of declared liabilities.

All four are reports in M-2. Fixed captions use Doc 3's L0a/L0b templates verbatim. The **decision log** (Doc 1 A8) is the module's first instrument and feeds F-1. A standing order the founder sets at their bank is shown with the `L0b.before_after` disclaimer: a description, not a test.

**Guardrails:**
- no L1 or higher statement;
- no personality or trait words;
- no causal verbs;
- no within-person trial;
- no behavioural sentence from any model;
- overdraft and non-sufficient-funds fees appear in the fees report, which is Doc 3's construct 6a trigger.

**Waits:**
- the claims-ladder engine;
- construct 6 (payday) until shortfall cost > 0 and one confirmed income stream (Doc 3; F-6 placebo test first);
- construct 5 (obligations and family) until tokenisation and consent machinery exist;
- questionnaires, including the 7-item year-one set and the risk-willingness item, which is moot while the risk module is deferred (V-039);
- disposition and turnover;
- any behavioural feature for another person (DPIA, NDPA profiling).

**Dissents.**
- *CBSO:* pre-register construct 6 now so its 6/12/24-cycle clock starts, and ask the 7 items. Otherwise the founder has no measurable behavioural baseline when the trigger fires.
- *CEO:* "scientifically restrained" is the brand, and a ledger with four fee tables does not show it.

*Majority:* the ledger accumulates the raw data anyway. Pre-registration costs little and is permitted as a document, but not as a build item (research-freeze exception granted to the CBSO).

### D9 — Repository strategy (recommendation; the founder decides)

**Vote 7–2.**
- *For:* chair, CEO, CFO, CTO, CIO, CBSO, Red Team head.
- *Against:* CPO, YC operator.

**Recommendation.**
- A **new private repository** for Portfolio OS code (Python, beangulp importers, reports, CI).
- **The ledger in a separate local git repository with no network remote**, inside the CP-1 data account. Off-site copies go only through C8's encrypted backups.
- This repository keeps the research package; the new repository links to it.

Reasons:
- RT-B B4 forbids a NEXUS checkout and npm toolchain in the Portfolio OS account.
- Python and npm dependency trees and CI stay apart.
- GPL obligations attach only to distributed builds, and a separate repository keeps that boundary clear (Doc 7 §1; RT-B m1).
- Commits to a repository with a GitHub remote cannot then carry ledger files.

**Dissent (CPO, YC operator).** A `portfolio-os/` directory in this repository keeps docs, contracts and code reviewed together and costs nothing. Split later if needed. *Majority:* the split is cheap now and expensive after history accumulates. Under either option, the ledger never lives in a repository with a remote.

## 8. Unresolved risks register

| # | Risk | Owner | Trigger | Mitigation |
|---|---|---|---|---|
| U1 | Founder hours too few for the plan | CEO | M-1 not done by 15 Jan 2027 | Manual-pack rule; hours-indexed Gate P |
| U2 | Laptop or tooling compromise | CTO | Any real data before CP-1 | CP-1 to CP-5 |
| U3 | Statements do not parse (PDF-only, scanned, password-protected) | CTO | F-13 fails; > 3 scanned statements a month | Manual entry with balance assertions; Option A costed |
| U4 | Beancount + Fava insufficient | CTO | F-13 fails | Option A before Stage 5 |
| U5 | No independent challenge | Red Team head | No second person named by M-2 | D4 labels; paid reviewer; tests reported "not run" |
| U6 | Tax readings wrong (s.34(1)(b) disposals, basis period, WA vs FIFO) | CFO | Practitioner response | Pack, not engine; "method pending" labels |
| U7 | Residency unknown | CFO | Fact-find answer | Pool view gated on residency |
| U8 | Perimeter breached by sharing an output | Red Team head | Any person-specific output to another person | Founder-only rule (D7) |
| U9 | Opinions late | CEO | Not in hand by 15 Jan 2027 | 2028 season |
| U10 | Operating burden over budget | CPO | > 60 min/week for 4 weeks | Cut the lowest-value control (F-12) |
| U11 | Badge density defeats provenance | CPO | F-18 fails | Materiality threshold |
| U12 | An unsourced assumption drives a report | CIO | A low/high span changes the decision | Register; low/central/high display |
| U13 | Irreversible backup lock | CTO | Any compliance-mode lock | C8-I4 configuration test |
| U14 | Correlated errors from one model family, including this memo | Red Team head | Ongoing | Licensed humans and an external reviewer are the only "independent" labels |
| U15 | The wedge's value accrues to the practitioner | CFO | F-14 < about 2 hours, or no client pays | A3 or A6 |
| U16 | Deferrals silently become deletions | Chair, CPO | A deferred item removed without a log entry | Re-entry register at each close |
| U17 | Data-licence breach (personal-use clauses; NGX values to a model) | CIO | Any licensed feed added | Rights axis re-enters (C3) |
| U18 | Tax law moves during the freeze (re-gazetting pending) | CFO | Re-gazetting notice | Freeze exception |
| U19 | Model-provider policy changes (quote unverified, effective 12 Nov 2026) | CTO | Before any AI layer | Re-check the policy text (RT-B m5) |
| U20 | Founder ledger goes stale after enthusiasm fades | CPO | Close skipped for 2 months | F-16 stop rule; minute log |

## 9. What evidence would make us reverse each decision

| Decision | Reverse or redesign if |
|---|---|
| D1 | F-13 fails, so Option A is costed. Or the fact-find shows foreign gains and several brokers, which pulls a minimal C7 rule set forward (the CEO's dissent). Or F-1 shows no decision changed in six months: freeze new modules |
| D2 | Declared hours ≥ 40 a week: compress, with the CFO's backstop. Declared hours ≤ 10: drop M-3 from the 2027 plan |
| D3 | The external review finds isolation ineffective, so CP-12 moves before real data (the CTO's dissent). Or the proxy costs > 0.5 pw with isolation done, so the founder may accept the risk (Doc 11 §7.1) |
| D4 | No second person and no paid reviewer is available: the Red Team head's rule then holds for later packs. Or F-9 shows a material error: no pack leaves without F-2 |
| D5 | F-7 shows the engine changes a decision under every plausible assumption set **and** F-8 passes: ship C6 (the CIO's dissent) |
| D6 | NGX answers that personal analytics is display-only at $26.33, and the founder trades NGX monthly or more: approve the feed |
| D7 | Opinions, processor agreement and DPIA are all in hand by 15 January 2027: run the concierge. Or a kill criterion trips: remain personal |
| D8 | Fees report shows shortfall cost > 0: start construct 6 (the CBSO's dissent). Or the decision log shows no measure was used in three months: drop it (F-11) |
| D9 | The founder prefers co-location and accepts CP-1/CP-2 as written: a directory here is acceptable |

## 10. Items requiring the founder's approval (ranked)

1. **D1 + D2 together:** the modified thin MVP (M-0, spike, M-1 to M-3, about 12 pw); the research freeze; Gate P replacing Doc 9's Stage 0 gate; the 15 January 2027 manual-pack rule.
2. **D3:** conditions precedent CP-1 to CP-12, including running Portfolio OS in a dedicated OS account or VM, and recording **FD-1 = no**.
3. **D4/D7 professional engagements:** a CITN-registered practitioner for the 2027 filing (pack by 28 February 2027), and the CITN/NTAA s.33 and SEC-perimeter opinions commissioned now with a 6–8-week deadline. All sit within Doc 9's USD 10–20k Stage 0 envelope, against quotes.
4. **D7:** 2027 as case zero; the 15 January 2027 go/no-go for a concierge; S-a held; the re-dated kill criteria.
5. **D6:** the USD 5/month recurring ceiling, and the written question to NGX.
6. **D5:** C6 deferred; the deterministic calculator; the assumption register before Stage 4 sign-off.
7. **D4:** name a second person, or authorise a paid reviewer (about one reviewer-week a year); the labelling rules.
8. **D8:** the behavioural scope and guardrails.
9. **D9:** the repository choice (the founder's decision).
10. **Status updates** D-007 (statement upload) and D-008 (Beancount + Fava for the personal stage).

## 11. Founder facts we need and how each changes the plan

| Rank | Fact | How the answer changes the plan |
|---|---|---|
| 1 | Hours per week, for how long, split between building, operating and selling | Sets every date (D2 table). ≤ 10 means a manual pack and no 2027 concierge; ≥ 40 means the CFO's backstop is adopted |
| 2 | Residency facts for 2026–2027 | Non-resident: pool view and worldwide-income items drop out of the pack. Resident: the pool view is tier 1 and the practitioner's C1.6 answers are urgent |
| 3 | 2027 intent: personal only, or a wedge test in season | Personal only: no DPIA or processor agreement before 2028. Wedge test: counsel briefed this week |
| 4 | Institutions, accounts and formats | Importer count and effort; OCR trigger; PDF-password design (CP-3) |
| 5 | Holdings by market; trading frequency; US-situs above USD 60,000 | NGX and research triggers; estate-tax monitor; broker importers in M-3 |
| 6 | FD-1, and personal or company API account | FD-1 = yes brings CP-11 forward and raises the household-exemption question (RT-B M3) |
| 7 | Funding for practitioner, counsel and external review | Whether F-9, F-14 and CP-12 can happen at all |
| 8 | A trusted second person | Whether any control is more than `self` (D4) |
| 9 | A separate OS account or VM is possible | Whether real data can be loaded at all (CP-1) |
| 10 | Number of income streams and pay dates | With several streams, construct 6 is "not defined" (Doc 3) |
| 11 | Base currency | Report presentation; calculator currency |
| 12 | Python skill | Whether Beancount fits; a contractor if not |
| 13 | The value of an hour | F-1's decision rule; the bear case's first point |
| 14 | Acceptance of the research freeze | Programme cadence (D2) |
| 15 | Capital-market-assumption source and neutral default | Only if C6 re-enters (D5) |
| 16 | Risk-tolerance instrument | Moot while the risk module is deferred (V-039) |

*Sources: `00_CONTEXT_BRIEF.md` v0.2; Doc 1 §9–10; Docs 3–8 §1 and cited sections (Doc 5 §4.1–4.2; Doc 6 F17, §7; Doc 7 §4.7.1, §4.12–4.13); Doc 9 §1, F1–F21, §4.4–4.7, §5, §7–9; `CANONICAL_CONTRACTS.md` §1, C6, C8; `11_independent_red_team_review.md` in full; `reviews/RT_C_product_complexity_commercial.md` in full; `reviews/RT_B_security_privacy_regulation.md` §1, B4, §6; `reviews/RT_A_science_and_models.md` §1; `reviews/REVISION_LOG.md` (V-034–V-044, P-1); `decisions/DECISION_LOG.md`. All read 2026-11-04. No web sources were fetched for this memo. Discrepancy noted: Doc 11 and RT-C count 34 tax rule records; Doc 6 v0.2 §1 counts 35, after adding rule 35 (17 `reviewed_internal`, 2 `sourced`, 16 `draft`, none practitioner-confirmed).*
