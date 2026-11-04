```
Document: 11 — Independent Red-Team Review (board-level consolidation of all independent challenge)
Department: Independent Red Team  ·  Lead role(s): Head of the Independent Red Team (simulated, not licensed), consolidating review memos R03–R09 and red-team panels RT-A, RT-B and RT-C
Version: 1.0  ·  Date: 2026-11-04  ·  Status: for Investment Committee
Reviewers required: Investment Committee; the founder; programme coordinator; owners of Docs 3–9 and of the Canonical Contracts; the licensed professionals named in §9
```

*This document consolidates; it does not re-review. Every finding traces to a review memo (R03–R09), a red-team panel memo (RT-A, RT-B, RT-C), `reviews/REVISION_LOG.md`, or a script run for this consolidation (§11). Where it cites a document's own revision table, it says so; those entries are the author's self-report.*

## 1. Executive summary

**Verdict.**
- **Stage 4 (MVP definition): not ready as specified.** We recommend conditional approval of a much narrower MVP once the founder fact-find and the re-scoping steps in §9.1 are done.
- **Stage 5 (build): not ready.** No build should start and no real financial data should be loaded until §9.2 holds. A second user or a commercial offer is further away again (§9.3–9.4).

The revision pass did real work: of 26 "Fixed" rows Panel A sampled, 22 landed in full. The method is sound; the build plan and several controls are not.

**The five issues that most change the plan:**

1. **Scope against founder time.** Panel C estimates 50–64 person-weeks for the package as specified, against a thinnest useful MVP of about 12. Doc 9's six-month Stage 0 cannot pass (P-1; RT-C B1).
2. **No independent challenge exists.** The founder or another simulated agent performs every "independent" control. The labels overstated this; C3 is amended, C7 is not (V-034).
3. **Assumptions drive the headline outputs.** One unsourced NGN-depreciation input moves the goal engine's success count from 27 to 55 of 100. More devaluation risk *raises* the count. About 220 E4/E5 parameters have no register (V-035, V-036).
4. **Security and retention before real data.**
   - Malware on the founder's development laptop is unmodelled.
   - The backup lock cannot be undone.
   - The C2 figure contract let 18 of 20 bypass strings through at v0.1 and 17 of 20 at an intermediate commit. *Coordinator update:* after the final contracts v0.2 commit (afc6552) the harness passes 0 of 20; because C2 was hardened against this known list, a fresh adversarial round with new strings is still required (V-040).
   
   (V-040, V-041, V-043.)
5. **The perimeter and the commercial calendar.** Outputs computed for anyone but the founder are plausibly regulated. Pre-orders start before counsel opines, and the tax-pack demand test falls after the filing deadline (V-042; RT-C B3).

The largest uncertainty is not technical. It is the founder's own facts: hours, residency, institutions and holdings. None has been supplied since the master prompt.

## 2. How the challenge was run

### 2.1 Two rounds

| Round | Object | Reviewers (all simulated) | Output |
|---|---|---|---|
| 1 | v0.1 of Docs 3–9 | Ten memos (R03, R03b, R04, R05a, R05b, R05c, R06, R07, R08, R09), each by an agent that did not write the document, briefed to refute (`REVIEW_STANDARD.md`) | 7 "Major revision", 3 "Accept with required changes"; 25 blocking items. Confirmed issues logged as V-001–V-033; the revision pass produced v0.2 and Contracts C1–C7 |
| 2 | Whole v0.2 proposal | **RT-A** science and models (scientific sceptic, SR 11-7 model-risk reviewer, research-methods professor). **RT-B** security, privacy, regulation (offensive-security tester, data-protection researcher, financial-regulation researcher). **RT-C** complexity and commercial logic (YC-style operator, principal engineer, UX critic, sceptical IC partner) | RT-A: Major revision, 2 blocking. RT-B: not ready for real data or any external user, 4 blocking. RT-C: major revision of scope and sequence, 3 blocking. Logged as V-034–V-044 and P-1 |

### 2.2 What was checked

| Check | Round 1 | RT-A | RT-B | RT-C | This consolidation |
|---|---|---|---|---|---|
| Academic references | "Well over 100" by DOI; none fabricated; one wrong co-author list; one retraction already flagged | 1 (S160 retraction) | None | None | None |
| Web sources | About 100 re-fetched | 2 CBN pages; 5 press items as search results only | 9 (E1–E9), some via search only; ISA 2025 definition **not found** | None | None |
| Scripts | Authors' and reviewers' scratch scripts | 7 package scripts under `python3 -I`, all match the text; a sensitivity harness on an uncommitted scratch copy | C2 bypass harness | None | C2 harness on two validator versions; `contracts_checks.py`; an arithmetic script (§11) |

### 2.3 Limits

- **One model family.** Every author, reviewer, panel and this consolidator is the same model family (Claude Opus 5.5, per `reviews/README.md`). Errors are likely correlated, and a blind spot the authors share is likely shared by their reviewers.
- **Agreement is not validation.** Convergence across panels shows internal consistency, not truth.
- **No licensed professional has reviewed anything**: no tax practitioner, lawyer, accountant, penetration tester or model validator. RT-A grades its own work as E4.
- **Partial coverage.** RT-A did not read Docs 7–9. RT-B ran no live test, because nothing runs yet. RT-C checked no external fact.
- **Synthetic data, no founder input.** Every volume, noise and burden figure is conditional on the synthetic generators.
- **Reproducibility.** RT-A's goal-engine sensitivity table cannot be re-run from the repository. RT-B's memo says its harness was not committed, but the log says the coordinator committed it, and I ran that copy.
- **Status drift.** `CANONICAL_CONTRACTS.md` v0.2 (commit 2681349, 16:29) records CC-1–CC-12 and two RT-A items as "Amended". The log (7124bc0, 16:28) still shows them open. I report both and have not checked whether the consuming documents followed. *Coordinator update:* the log now marks CC-1–CC-12 resolved in contracts v0.2 (commit afc6552); the document follow-up edits are in progress in a contract-conformance pass.

## 3. What the first review round changed

| Memo | Doc | Verdict (v0.1) | Blocking items | Log rows | Status after revision | Later challenge |
|---|---|---|---|---|---|---|
| R03 | 3 | Major revision | Power analysis tests the wrong design; large-effect interventions unbuildable, finance nudge effect 0.00 | V-024, V-025 | Closed; RT-A confirmed the power figures landed | RT-A M2; R15 hand-off to Doc 4 **not landed** (V-039) |
| R03b | 3 | Accept with required changes | Doc 8 card breaks the ladder; no privacy design (blocking at first external user) | V-007, V-028–V-030 | Closed, except V-028 "design closed" with DPIA and counsel still required | RT-B B1: retention not closed (V-041) |
| R04 | 4 | Major revision | FX cost a plug (±6% band); invariant and precision; no FX cost basis; reconciliation not integrity | V-003 | Closed via C1; CC-1, CC-7 open in log, amended in contracts v0.2; B4 "Fixed" per Doc 4 §11 | RT-A confirmed 4 rows; RT-A M1, M8 |
| R05a | 5a | Accept with required changes | Example 1 fails its own gates; valuation arithmetic | V-013, V-014, V-022 | Closed; RT-A confirmed 4 rows | V-031, V-032 open; RT-A M4 |
| R05b | 5b | Accept with required changes | Correlation from one point; goal engine a point forecast; band method-driven; solver environment-dependent | V-015–V-017 | Closed; RT-A and coordinator confirmed | **RT-A B2 reopens the goal engine (V-035)** |
| R05c | 5c | Major revision | Wrong at entry; no status machine; AI number-contract conflict | V-004, V-010–V-012 | Closed; RT-A confirmed 3 rows, 1 partly | **RT-B B2: the replacement C2 is bypassable (V-040)** |
| R06 | 6 | Major revision | Wrong basis period; refusal logic undefined | V-018–V-021, V-023 | V-018 awaiting practitioner; V-019 closed, engine deferred; V-020 closed; V-021 narrowed; V-023 partial | RT-A B1: 17 of 34 rules rest on simulated review |
| R07 | 7 | Major revision | Numeric gate bypassable; ledger unbuildable | V-003–V-005 | Closed | RT-B B1, B2, B4; P-1 |
| R08 | 8 | Major revision | Insight card; FX sign; vocabularies | V-006–V-009, V-011 | Closed | RT-C M7, m1 |
| R09 | 9 | Major revision | Tax wedge targets users with nothing to compute; month-9 signals unreadable | V-002, V-023; **no V-row for either** | "Fixed" per Doc 9 §11 (self-report; unsampled) | **RT-C B1, B3 and RT-B B3 reopen both** |

**Totals.** The log has 33 first-round rows:
- 26 closed outright;
- 4 closed with conditions: V-018 and V-021 need a practitioner, V-023 is partial, and V-028 still needs a DPIA and counsel;
- 3 open: V-031–V-033.

Of the 11 second-round rows, only V-038 is closed. Six of the open ones are blocking: V-034, V-035 and V-040–V-043. P-1 is also open.

**Measured landing rate.** RT-A sampled 26 "Fixed" rows from the §11 tables of Docs 3, 4, 5a, 5b, 5c and 6:
- **22 landed in full: 84.6%**, with a Wilson 95% interval of 66.5–93.9% (§11).
- 3 landed in part.
- 1 cross-document hand-off did not land.

No sampled script disagreed with its text. Three caveats:
- The panel chose the sample; it was not random.
- No one has sampled the "Fixed" rows of Docs 7–9.
- "Landed" means the change was made, not that it is right: V-017 landed and was reopened as V-035.

## 4. Residual blocking issues after revision

### 4(a) Scientific and model risk

**A1. Self-review is labelled as independence (V-034; RT-A B1; RT-B M6).**
- *Evidence.*
  - Doc 5c §4.3.10 reads C3.3's "validator ≠ ingester" as a different *process*, and names the founder as validator.
  - NGX prices can never reach `two_independent`, and every FX comparator is `same_upstream`.
  - 17 of 34 tax rules are `reviewed_internal`, and the only reviewer is "R06 independent review (simulated)".
  - Every accuracy target is measured against the founder's own decisions.
- *Since the log.* Contracts v0.2 adds C3.3a: every event records `independence` ∈ {self, simulated_agent, second_person, licensed}. My run of `contracts_checks.py` prints the new "self-checked" and "checked by software" chips. The C7 rename is deferred; the same run still prints `reviewed_internal` chains.
- *Consequence.* A "validated" NGX or naira figure means the founder re-checked about 1 in 20 of their own entries.
- *Resolved when:*
  - C7 renames `reviewed_internal`;
  - Docs 5c and 8 adopt the chips;
  - a second human is budgeted, at least quarterly, for blind re-labelling and planted errors (F-2, F-4, F-5).

**A2. The goal engine's headline is an assumption readout (V-035; RT-A B2).**
- *Evidence.* RT-A's 10,000-path runs:
  - NGN-depreciation drift of 8%, 12% and 16% gives 55, 41 and 27 of 100.
  - Block length moves the count by about 1 point.
  - A jump rate of 0 against 0.3 a year gives 38 against 45: more devaluation risk, better odds.
  - Detecting a 2 pp/yr drift error by one-month calibration needs 3,926 months, about 327 years (my recomputation).
- *Since the log.* CC-12 (contracts v0.2) makes `drift_basis` mandatory. That labels the drift; it does not cure its dominance or the non-monotonicity. The CMA source and the neutral default (C6 Q1–Q3) are still open founder decisions. I could not re-run RT-A's table.
- *Resolved when:*
  - the count is shown at low, central and high values of each dominant assumption;
  - the engine refuses when the span exceeds about 20 points;
  - the monotonicity test (F-8) passes;
  - drift is declared untestable.
  
  Otherwise the engine goes to Later, which is RT-C's cut 4.

**A3. No model inventory or assumption register (V-036; RT-A M6, M7).**
- *Evidence.* About 15 models and about 220 E4/E5 tags, with no owner, tier, test or date for any of them.
- *Timing.* The log requires this before Stage 5; RT-A wants it before Stage 4.
- *Resolved when:* an inventory and register cover the models that survive the scope decision, tiered by materiality (tax and net worth tier 1, behaviour tier 3).

**A4. Tax figures rest on unconfirmed readings (V-018, V-021, V-023; RT-A M8).**
- *Evidence.*
  - The basis-period fix and the creditable-WHT default await a practitioner.
  - The currency-pool view treats every foreign-currency spend as a disposal, which applies only if the founder is Nigerian-resident (unknown).
  - Method sensitivity (weighted average against FIFO; spot against historical cost) has never been computed.
- *Resolved when:* a practitioner recomputes Examples 1–3 and the real year (F-9), and the pool engine is gated on residency.

### 4(b) Security and AI integrity

**B1. C2 is bypassable lexically and semantically (V-040; RT-B B2). Blocking for any AI layer, not for the ledger.** RT-B found that 18 of 20 strings passed the v0.1 reference validator, and the coordinator reproduced the result. My runs of `rtb_c2_bypass_harness.py`:

| Validator | Passed (bypasses) | Rejected |
|---|---|---|
| v0.1, commit 63b023a | **18 of 20** (reproduces RT-B) | "fifty-k", "twenty-five" |
| HEAD, commit 2681349 | **17 of 20** | also "`as=` omitted" (now mandatory, CC-2) |
| Contracts v0.2 final, commit afc6552 (coordinator run, 2026-11-04) | **0 of 20** | all 20 rejected; hardened against this list, so a fresh round is required |

- *Still passing at commit 2681349 (all rejected at afc6552):*
  - plurals, ordinals, month names, abbreviations and "last month";
  - zero-width and soft-hyphen splits, and a Cyrillic "о";
  - Unicode Roman, circled, superscript and fraction glyphs;
  - "XII", "doce" and "mejila";
  - "All", and a free "fell to".
- *The semantic hole is untouched.* A token binds a field, not a period or account. "Last month you spent {{fig:q3_total|as=spend.total}}" passes on a quarterly total, and so does `ratio(b,a)`.
- *Consequence.* C2 guarantees no free numerals. It does not guarantee no false quantitative claims, which is what Docs 5c, 7 and 8 say it does.
- *Resolved when:* RT-B's tests pass. (i) NFKC normalisation, Cf stripping and a UTS #39 skeleton, then an allow-list. (ii) A generated multilingual corpus rejected 100%, reported with n and a bound. (iii) Scope labels printed by the renderer, and relative time banned. (iv) `cmp` and `count` tokens with a quantifier lint. (v) A metamorphic swap test with a Wilson bound. (vi) An independent extractor maps every asserted quantity to a renderer span. In addition, the model is value-blind by rule (RT-B M3). Deferring the AI layer (RT-C cut 2) takes this off the MVP path but leaves the contract open.

**B2. The founder's own machine is the unmodelled main threat (V-043; RT-B B4). Blocking before real data.**
- *Evidence.* An infostealer, or a malicious npm or pip package running as the founder, can read:
  - the database;
  - the on-host SOPS/age identity;
  - browser sessions (passkeys do not protect a stolen session);
  - statements in Downloads.
  
  The same laptop builds NEXUS with npm and, very likely, AI coding agents. RT-B ranks this path first and email-account takeover second.
- *Resolved when:*
  - Portfolio OS runs in a dedicated OS account or VM with no development tools and no agents;
  - data sits outside every repository and agent directory;
  - a pre-commit check blocks statement files;
  - ingestion uses a drop folder that is shredded after import;
  - PDF passwords are stored nowhere, or in the OS keychain.

### 4(c) Privacy, retention and regulatory perimeter

**C1. Four retention answers, one irreversible (V-041; RT-B B1). Blocking before the first real backup.**
- *The four answers:*
  - Doc 6: the user can always erase.
  - Doc 7: "not erasable while the clock runs", with object lock.
  - Doc 3: write-once.
  - Doc 8: WORM-style, user's choice.
- *Why it bites.* Backblaze compliance-mode locks cannot be removed by anyone before expiry. The clock rule is `draft` yet "applies regardless", which breaks C7. Contracts v0.2 adds no retention contract.
- *Resolved when:*
  - Doc 6's position is adopted;
  - backups use governance mode or no lock;
  - each data class has its own age recipient;
  - rule 34 is raised to `sourced` or stops gating.

**C2. The perimeter trigger is too narrow (V-042; RT-B B3). Blocking at the first external user, paid or free.**
- *The gap.* Docs 6 and 9 draw the line at "security-specific buy/sell/hold output". Module 7 (candidate allocations), the C6 `adjustment` and module 10 (own-tax answers) fall outside it, yet the SEC robo-advisory definition plausibly covers them.
- *The vendor policy.* RT-B quotes Anthropic's Usage Policy treating allocation and own-tax advice as high-risk. That quote is **unverified by the coordinator**, and the fetched version is "Effective Nov 12, 2026", eight days after this review.
- *The calendar.* Doc 9's S-a pre-orders start in month 3, before the SEC opinion (month 6) and before any UAE opinion.
- *Resolved when:*
  - the trigger becomes "any output computed from a specific person's circumstances, delivered to someone other than the operator";
  - modules 7 and 9 and the `adjustment` stay founder-only until counsel opines;
  - S-a is held, or excludes UAE residents and research features.

**Perimeter map (RT-B §5, condensed; research inputs for counsel, not opinions):**

| Feature | Jurisdiction | Trigger | Licence or opinion needed | Docs agree? |
|---|---|---|---|---|
| Ledger, net worth on own data | NG / AE | First other person (NDPA duties from n = 2) | DPIA; s.43 transfer basis; notice | Partly |
| Hosted LLM on another's data | NG / AE | First non-founder request | s.41–43 basis; DPA; AUP disclosure; ZDR via sales | No |
| Research notes on named securities | NG | Delivered to others, plausibly for remuneration | SEC opinion; ISA 2025 definition **not retrieved** | No |
| Research notes | AE | Offered onshore, from anywhere | CMA "financial advisory"/"promotion"; DFSA if DIFC | Partly |
| Optimiser alternatives (module 7) | NG / AE | First external user, paid **or free** | SEC robo-advisory registration (₦100m capital) or partner; CMA licence; AUP human review | **No** |
| Goal `adjustment` (C6) | NG / AE | Same | Advice-vs-information opinion | Not addressed |
| Behavioural insights | NG / AE | First external user | NDPA s.27(1)(g), s.30, s.37; PDPL | Yes |
| Indicative tax computation, free | NG | First external user | Outside CITN s.16 only if genuinely free; paid bundle counts as remuneration (E4) | Partly |
| Paid tax-and-records pack | NG | First sale | CITN member as the paid party; NTAA s.33; s.101 liability | Yes |
| Pre-filled return or submission | NG / AE | Any submission for another person | NTAA s.33 accredited agent; FTA-registered agent | Yes |
| Bank-API aggregation | NG / AE | Company becomes API consumer | CBN open-banking; CBUAE TPP (not verified) | Yes |
| Scores or profiles shared | NG | Any third-party use | CBN Tier 3; credit-reporting law (not checked) | Not addressed |
| Pre-orders (S-a) | AE | Targeting onshore residents, month 3 | Decree-Law 33/2025 "promotion" | **No** |
| NGX data in founder analytics | NG | Processing beyond display | Non-display fee; NGX answer | Yes |
| NGX values to a hosted model | NG | First call carrying values | NGX view on "Distribution" | Not addressed |
| NGX or US data shown to others | NG / US | First external user | Display, distribution, non-display licences | Partly |

**C3. Lawful basis, profiling and DPIA (V-028; RT-B M4, M5). Blocking at any second user.**
- *Evidence.*
  - The NDPA does not define profiling, and a "Pharmacy" category already implies health.
  - Docs 6 and 9 say consent is not a stand-alone transfer basis, while s.43(1)(a)–(b) provides one.
  - Relatives' account numbers already sit in `narration_raw`.
  
  RT-B wants a light DPIA **now**, because FD-1, Option B and the hosted model all depend on it.
- *Resolved when:* the DPIA exists, counsel has reconciled GAID with the Act, and counterparty identifiers are tokenised at ingest.

### 4(d) Scope, effort and founder burden

**D1. Effort cannot fit the calendar (P-1; RT-C B1).**
- *Doc 7.* The build is about 37 person-weeks (pw), or 25.5 on Beancount + Fava: about 17 or 12 months at 20 h/week. Doc 9 allows 0–6 months, and Doc 9's exit gate also needs a tax module that Doc 7 never costed.
- *RT-C (E5).* Adding the uncosted engines gives **50–64 pw**, or 23–30 months at 20 h/week (my arithmetic). The **thin MVP is about 12 pw** (range 8–18): about 24 weeks, with first output around week 6.
- *Commercial load.* Doc 9 also adds up to 20 h/week of commercial work from month 3.
- *Consequence.* The likeliest month-6 result is a schedule-driven "kill": a false negative on the hypothesis.
- *Resolved when:* the founder's hours are known, scope fits them, and the gate reads "every *uploaded* period reconciles; records pack to a practitioner by 28 February 2027".

**D2. The operating burden is unbudgeted, and the panels conflict (RT-A M9; RT-B §6; RT-C M2).**

| Source | Estimate | Per month (my conversion) |
|---|---|---|
| Charter, Doc 1 §9 | Review under 20 minutes | 20 min |
| RT-C M2 | 160–180 min/month (8–9× the charter) | 160–180 min |
| RT-A F-12 ceiling | 60 min/week | ≈ 260 min |
| RT-B §6 (adds monitors, `pip-audit`, eval triage) | ≈ 130–150 h/yr | ≈ 650–750 min |

None of these is measured. RT-B's figure is about four times RT-C's because the two count different chores. Contracts v0.2 (CC-10) adds that validation workload "will rise".

*Resolved when:* one chore list exists and is measured for four weeks after M-1 (F-12).

**D3. The decisive inputs are founder facts (RT-C B2; RT-A §6).**
- *Decisions.* Two of the nine decisions in `DECISION_LOG.md` are founder-approved (D-001, D-003).
- *Assumptions.* Doc 1's A1–A10 are unconfirmed.
- *Reading load.* The core documents are about 158,000 words (my count), about 10.5 hours at 250 words a minute.
- *Resolved when:* the §10 questions are answered, three redacted statements are supplied, and one practitioner hour is bought.

**D4. The commercial test is out of season (RT-C B3; R09 B2 reopened).** S-b follows the CITN opinion (month 6), with 20 paid packs by month 9. That is May–August 2027, after the 31 March deadline, for a segment Doc 9 calls "deadline- and fear-driven".

*Resolved when:* the opinion is commissioned now with a 6–8-week deadline, and S-b runs in January–March 2027 through a practitioner, or moves openly to 2028.

## 5. Major and minor residual issues

| # | Issue | Source | Route to resolution |
|---|---|---|---|
| 1 | FX rate of record named a "central" field the CBN does not publish | RT-A M1; V-037 | Amended in contracts v0.2 (`nfem_vwap`, primary snapshot); document edits and the tax field pending |
| 2 | Construct 6: pay date confounded with month-end; generator value 1.45 outside the reported 1.51–1.80; power 0.73 / 0.60 at 24 cycles | RT-A M2 | Placebo anchors (F-6); demote if P(L1) < 0.5 |
| 3 | Gates unverifiable: recall measured on the queue; a 2% bound needs 149 error-free draws (≈ 15 months) | RT-A M3 | Upper bounds with n; sample all lines (F-3) |
| 4 | Valuation grid ₦8.0–69.3 against a ₦60 price; a 7-month-old CDS reading counts as fresh | RT-A M4 | CDS stale after 1 month; show price-implied ROE only |
| 5 | Risk tolerance measured three ways; SOEP item gives 2–3 levels | RT-A M5; V-039 | One instrument, shown as a band |
| 6 | E2 mixes statutes with single studies | RT-A M6 | Two grading axes (timing disputed, §7) |
| 7 | Currency-pool view built before residency known; no method sensitivity | RT-A M8 | Sensitivity table; gate on residency |
| 8 | ₦1-narration injection: inline quotes, queue flooding, fabricated balanced pairs | RT-B M1 | Evidence-block quotes; bbox match; rate limits; tests T2-13–T2-15 |
| 9 | Fava has no authentication; plugin directives import modules | RT-B M2 | Authenticating proxy, Host-header check, injection test (disputed, §7) |
| 10 | ZDR is per organisation via sales; a company account may end the household exemption | RT-B M3 | Decide FD-1 with the account structure; value-blind model; mask names |
| 11 | Third-party data stored in clear | RT-B M5 | Tokenise at ingest; redact exports |
| 12 | Controls needing a second person who does not exist | RT-B M6 | Rename; seeded errors in a replica; ≈ 1 reviewer-week budget |
| 13 | Licensing: NGX "Distribution" to a model; purge vs 6-year retention; personal-use licences; yfinance (Doc 7 keeps it, Doc 5c bans it) | RT-B M7 | Value-blind design; licensing counsel; drop yfinance |
| 14 | Bare-paper escrow; host key can delete backups | RT-B M8 | `age -p` or 2-of-3; write-only key |
| 15 | Machinery sized for a population | RT-C M1 | Cut list (§6) |
| 16 | C7 engine duplicates the practitioner (0 of 34 rules confirmed) | RT-C M3 | Records pack; F-14 |
| 17 | Research and NGX feed inert for 90 days (USD 26–792/mo) | RT-C M4 | Defer |
| 18 | AI layer changes no decision (6 pw + USD 44–582/mo) | RT-C M5 | Defer to F-15 |
| 19 | Beancount spike hinges on an unnecessary WA-plugin criterion | RT-C M6 | Falsification spike (F-13) |
| 20 | About 20 possible chips; "ageing" totals every Monday | RT-C M7 | Materiality threshold (F-18) |
| 21 | The wedge is a different company from the personal product | RT-C M8 | Measure practitioner hours saved |
| 22 | Research has outrun building | RT-C M9 | Freeze (disputed, §7) |
| 23 | Doc 5 consistency: stale thresholds, NGX "two sources", no UAE equity analytics | V-031–V-033 | Consistency pass, or "deferred with module" |
| 24 | Errata CC-1–CC-12 open in log, amended in contracts v0.2 | Log; contracts | Owners make the listed follow-up edits; update the log |
| 25 | Doc 6 sign-off gaps (gifts, loss relief, "taxable person") | V-023 | Counsel |

**Minor issues.**
- **RT-A.**
  - m1: residual "s.163" (fixed, V-038).
  - m2: one low CPI month, taken from press.
  - m3: add a `definition_change` flag for the MPR reset.
  - m4: the Fed error may be 50 bp, not 75.
  - m5: the C6 display rule ignores assumption uncertainty.
  - m6: a stale Doc 4 §11 entry.
- **RT-B.**
  - m1: GPL-2.0 incompatibility in any distributed build.
  - m2: ban "tax agent" and "file your taxes" in product copy.
  - m3: Doc 1's friendly circle conflicts with Docs 6 and 9.
  - m4: pin the NDPA assent date.
  - m5: re-check the AUP after 12 Nov 2026.
  - m6: monitors must fail closed.
- **RT-C.**
  - m1: the 231-item queue is an upper bound.
  - m2: report the transfer-precision gates as "not measurable for n = 1".
  - m3: defer passkeys (contested).
  - m4: move the external-review gate (contested).
  - m5: enter scanned pages manually.
  - m6: measure categorisation only where it matters.

## 6. Unnecessary complexity

RT-C's cut list is below. Savings are central person-weeks; "(Doc 7)" marks that document's own figure, and the rest are RT-C's E5 estimates. The Panel A and B columns are my reading of their memos; neither was asked about the list, so "silent" means no view, not assent.

| # | Cut or defer | Saving | Re-entry trigger | Panel A | Panel B |
|---|---|---|---|---|---|
| 1 | PostgreSQL C1 → Beancount + beangulp + Fava | 11.5 (Doc 7) | Second user | Silent; M8 supports not building the pool engine first | **Conditional:** needs an authenticating proxy and an injection test (M2); GPL if distributed |
| 2 | AI layer, C2 controller, renderer | 6 (Doc 7) + USD 44–582/mo | ≥ 10 unanswerable questions/month × 2 months | Did not read Doc 7 | **Agrees in effect:** B2 blocks only the AI layer; avoids NGX "Distribution" |
| 3 | Risk module → exposure table, devaluation scenarios | 2 | > 10 positions | Shrinks the inventory | Silent |
| 4 | C6 Monte Carlo → deterministic table | 2–4 | Ranges wanted | **Conditional:** keep only under B2's conditions (F-7) | Removes the `adjustment` perimeter issue |
| 5 | C7 engine → records pack | 3–7 net | Priced practitioner saving | **Agrees** (F-9 needs a practitioner anyway) | **Agrees:** lowers CITN and AUP exposure |
| 6 | Research registry, bank module, notes | 4–8 | Pending investment decision | **Agrees:** range spans the price (M4) | Silent |
| 7 | NGX feed, corporate actions, validation queue | 2–4 + USD 26–792/mo + ≈ 20 h/yr | Monthly NGX trading | **Agrees** (B1) | **Agrees** (M7) |
| 8 | Statistical matcher → deterministic | ≈ 1 | > 50 transfers/month | **Agrees** (M6); recall still sampled (F-3) | Silent |
| 9 | C4 calibration → founder rules | ≈ 1 + queue time | Model suggestions | **Partial:** founder rules are `self` review | **Partial:** rate limits still needed (M1) |
| 10 | C3 axes → three values + freshness + C3.5 | ≈ 1 | First licensed feed | **Tension:** B1 *adds* an independence attribute | **Conditional:** rights axis needed once any licence exists |
| 11 | OCR and local-LLM extraction | 1–2 + hardware | > 3 scanned/month | Silent | Agrees; PDF passwords still need design |
| 12 | Passkeys and CSP; external review moved | 0.5–1 | Remote access, AI or second user | Silent | **Disagrees in part** (M2, B4); agrees passkeys do not stop a stolen session |
| 13 | Claims-ladder engine, construct 6, consent machinery | 1–3 (Doc 7) | Shortfall cost > 0 | **Agrees** (M2) | Agrees: defers profiling exposure |
| 14 | Nine-area IA and 15 screens → Fava + five reports | Inside #1 | Second user | Silent | As #1 |

**Totals (RT-C).**
- The thin MVP is about 12 pw.
- That saves about 13.5 pw against Doc 7's Option B, and 38–52 pw against the package as specified.
- Running costs fall from about USD 70–1,374 a month to USD 0–5, plus practitioner fees.

**What every cut keeps:**
- source, as-of, unit, currency and status on every figure;
- zero-tolerance reconciliation;
- conversion and in-transit accounts;
- the C3.5 entry check;
- reproducibility;
- prepare-not-file;
- no advice.

**Where the panels stand.** Panels A and C agree on cuts 4–8 and 13. Panel B's findings support cuts 2, 5, 7 and 13. The live disagreement is cuts 1, 12 and 14 taken together. RT-C's MVP runs Fava on 127.0.0.1 with passkeys and CSP deferred. RT-B says that configuration breaks two minimum baseline controls, MVB 3 and MVB 5, unless an authenticating proxy is added. No one has costed the proxy.

## 7. Disagreements preserved

### 7.1 Between panels

| Disagreement | Position 1 | Position 2 | Proposed resolution |
|---|---|---|---|
| Founder burden | RT-C: ≈ 160–180 min/month; target ≤ 60 min/month | RT-B: ≈ 130–150 h/yr. RT-A: fail above 60 min/week | One chore list; measure for four weeks. RT-C's figure is the success target, RT-A's the kill threshold (F-12) |
| Fava on localhost | RT-C: 127.0.0.1, defer passkeys and CSP | RT-B M2: reachable by local processes and DNS rebinding | Put RT-B's checks in the spike (F-13). If they cost > 0.5 pw, accept the risk only with B4 isolation |
| Escrow | RT-C: two-place paper | RT-B M8: bare paper decrypts everything | Adopt RT-B; the cost is negligible |
| Status complexity | RT-A: add independence to the badge | RT-C: three values, fewer badges | Three values × an independence chip, above a materiality threshold (F-18) |
| Artefacts vs freeze | RT-A: register as a contract; inventory before Stage 4; two-axis grades | RT-C: research freeze | One-page inventory and register for the surviving models before Stage 4; defer two-axis grading |
| Planted errors | RT-A F-4, F-5: plant unannounced | RT-B M6: errors in real data risk real decisions | A second person plants them in a labelled replica, or with exports and decisions blocked during a known window |
| Label for simulated review | RT-A: `machine_reread` | RT-B: "machine-checked"; C3 v0.2: "checked by software" | Contracts owner picks one in the C7 revision |
| Inventory timing | RT-A: before Stage 4 | Log V-036: before Stage 5 | IC decides; this review recommends the scoped version before Stage 4 |
| Redacted statements | RT-C: three in week 0–1 | RT-B B4: isolation before real data | Do the isolation first (hours), then the spike |

### 7.2 Between panels and departments

| Disagreement | Department | Panel | Proposed resolution |
|---|---|---|---|
| C7 engine as the wedge | Docs 6, 9 | RT-C M3: pack first | F-14 decides |
| AI layer | Doc 7: Stage 0b must-have | RT-C M5 defer; RT-B B2 bypass | F-15, then RT-B's C2 tests |
| Goal engine | Doc 5b, C6: Personal-MVP | RT-A B2; RT-C cut 4 | F-7, F-8 |
| Perimeter trigger | Doc 6: buy/sell/hold only | RT-B B3: any person-specific output | Counsel; founder-only until then |
| Commercial calendar | Doc 9: S-a month 3; S-b after month 6; six-month Stage 0 | RT-B B3; RT-C B1, B3 | Re-date (§9.4) |
| External-review gate | Doc 7: before any real statement | RT-C m4: before network, AI or second user | RT-C's gate only once B4 isolation is done |
| Retention | Docs 3, 7, 8 | RT-B B1 sides with Doc 6 | Doc 6 owns retention |
| yfinance | Doc 7 F8 keeps it | Doc 5c F19 and RT-B M7 ban it | Remove |
| Validator identity | Doc 5c §4.3.10 | RT-A B1 | Settled in C3.3a; Doc 5c edit pending |
| Consent as a transfer basis | Docs 6, 9: not stand-alone | RT-B M4: s.43 provides it | Data-protection counsel |
| Friendly circle | Doc 1 P2: consent basics | Docs 6, 9; RT-B m3: DPIA first | Stricter rule until counsel |
| Risk tolerance | Docs 3, 4 and 5a differ | RT-A M5 | Founder or IC decision (V-039); moot if cut |

### 7.3 Within the committee roles

No panel recorded internal dissent, even where its simulated roles would plausibly differ. That is a limit of the method. Three role tensions are visible across the memos:

- **Model-risk reviewer (RT-A) against the YC operator (RT-C).** Validate first, or build to learn. *Path:* the scoped inventory, plus F-1 to test whether building changes decisions.
- **Offensive-security tester (RT-B) against the principal engineer (RT-C).** Controls before data, or cut controls on localhost. *Path:* B4 isolation is cheap enough for both; the spike settles Fava.
- **Regulatory researcher (RT-B) against the sceptical IC partner (RT-C §5).** RT-C's practitioner-first concierge handles 10–20 other people's data in January–March 2027. RT-B requires a DPIA, a processor agreement and counsel first. RT-C concedes these block the concierge and names 2028 as the fallback. *Path:* commission all three now, and treat mid-January 2027 as the go/no-go date.

Not in dispute: R09's dissenting VC partner and RT-C agree that "no fundraising yet" is right.

## 8. Falsification tests for the personal phase

Each test is pre-registered, with a timestamped hash, before its data exist (RT-A §5). F-1 to F-12 are RT-A's, and F-13 to F-18 come from RT-C. This review proposes the decision rules, each drawn from the source memo's required change. "Who" marks whether the founder can run the test alone (self), or whether it needs a second person (2P) or a licensed professional (L). Per RT-B M6, the founder cannot run the 2P and L tests.

| # | Claim | Test | Fails if | Decision rule | Who |
|---|---|---|---|---|---|
| F-1 | Improves decisions, not just visibility | 6-month decision log against the hours log | < 3 decisions changed, or value < hourly value × hours | Freeze new modules; keep only reports that changed a decision | Self |
| F-2 | Ledger correct, not merely reconciled | Second person rebuilds one month blind | > 2% value-weighted disagreement, or any tax-weighted error | No records pack leaves until fixed and re-run | 2P |
| F-3 | Matcher recall high | 100 lines from *all* bank lines | Missed transfer value > 5% (upper 95% bound) | Matcher totals marked "incomplete" until a re-test passes | Self |
| F-4 | Controls catch errors | Planted tier-1 errors | Catch rate < 90%, or any reaches a total unbadged | Feature freeze; fix; re-run | 2P |
| F-5 | Self-validation is real | Seed obvious errors at ≈ 1 in 50 | > 1 approved per quarter | Control labelled ineffective; shrink queue or add a person | 2P |
| F-6 | Construct 6 measures income arrival | Placebo anchors on days 5, 10, 15 | Any placebo interval overlaps payday's | Demote to an L0b table | Self |
| F-7 | Goal engine adds information | Decision under the deterministic table vs engine at low, central and high CMA | Same in every case, or flips inside the plausible range | Engine to Later | Self |
| F-8 | Headline monotone in risk | Unit test on jump rate, FX drift, drift sd | Any rise in the count (fails today) | Engine refuses to display | Self |
| F-9 | Tax figures right | Practitioner recomputes Examples 1–3 and the real year | Material difference outside `disputes[]` | Rules revert to `draft`; no indicative figures | L |
| F-10 | Freshness means something | 3-month log of `fresh` figures later found wrong | Error rate not below that of `ageing` figures | Re-set thresholds from data | Self |
| F-11 | L0b views pay | Doc 3 Rec 2 threshold, made binding | Below threshold after 6 months | Remove from the monthly review | Self |
| F-12 / F-17 | Burden sustainable | Weekly minutes (RT-A); monthly total (RT-C) | > 60 min/week for 4 weeks, or backlog > 30 days; success needs ≤ 60 min/month after month 3 | Kill: cut the lowest-value control. Miss: no new module | Self |
| F-13 | Beancount + Fava sufficient (RT-C M6) | 2–3-day spike: assertions and idempotent re-import on three redacted statements, plus RT-B's proxy and injection checks | A period fails, re-import duplicates, or a narration escapes | Fall back to Doc 7's C1 build, costed, before Stage 5 | Self |
| F-14 | Pack saves practitioner time (RT-C M3, §5) | Hours on the founder's case with and without the pack | Saving < ≈ 2 hours a case, or no client pays | No C7 engine | L |
| F-15 | AI layer needed (RT-C M5) | Log of questions reports cannot answer | < 10 a month for 2 months | Stays deferred; if met, build only after C2 passes RT-B's tests | Self |
| F-16 | MVP integrity (RT-C §4.2) | Monthly close | Unnamed unreconciled gap, or a figure without source and as-of | Stop the close until fixed | Self |
| F-18 | Badges help (RT-C M7) | Seeded-error test at default density | Detection lower than at reduced density | Apply the materiality threshold | 2P |

Six of the eighteen tests need someone other than the founder. That is V-034 in practical form.

## 9. Conditions precedent

### 9.1 Before Stage 4 approval
1. Founder fact-find (§10, ranks 1–6). (RT-C B2)
2. Scope fixed to the founder's hours, either the thin MVP or a costed alternative. (P-1; RT-C B1)
3. Doc 9 gates rewritten, with S-a and S-b re-dated. (RT-C B1, B3; RT-B B3)
4. Goal engine: RT-A's conditions adopted, or the engine moved to Later. (V-035)
5. A scoped model inventory and assumption register. (V-036; timing disputed)
6. Independence labelling in C7 as well as C3. (V-034)
7. A published founder-hours budget. (RT-A M9)
8. F-1 to F-18 pre-registered and hashed.
9. V-031–V-033 and CC-1–CC-12 closed where they touch the MVP, and marked deferred otherwise. The log updated to match contracts v0.2.

### 9.2 Before any real financial data (including redacted statements)
1. Machine isolation, the drop folder and PDF-password handling. (V-043)
2. Retention settled before the first backup. (V-041)
3. Escrow hardened, with a write-only backup key. (RT-B M8)
4. If Fava is used: the proxy and injection test pass, or the founder records acceptance of the residual risk. (RT-B M2; disputed)
5. The C3.5 entry check live on CBN `nfem_vwap`. (V-010, V-037)
6. Counterparty identifiers tokenised at ingest. (RT-B M5)
7. FD-1 decided. If any model is in the path: C2 passes RT-B's tests (i)–(vi) and the model is value-blind. (V-040)
8. External security review before real data unless isolation is done; otherwise before network exposure, AI or a second user. (Doc 7 vs RT-C m4)
9. One tested restore. (RT-C M-1)

### 9.3 Before any second user (including a free friend)
1. DPIA, lawful and transfer bases, notice and profiling scope, reviewed by Nigerian and UAE counsel. (V-028; RT-B M4)
2. The perimeter trigger redrawn, with modules 7 and 9 and `adjustment` founder-only until counsel opines. (V-042)
3. AUP duties re-checked against the policy in force after 12 Nov 2026. (RT-B m5; unverified)
4. Hosted-model account and processor agreement settled, and the household exemption assessed. (RT-B M3)
5. Personal-use data licences replaced or withdrawn. (RT-B M7)
6. Second-person controls staffed: external review, a second labeller, a facilitator. (RT-B M6)
7. The Doc 1 vs Docs 6/9 staging conflict resolved. (RT-B m3)

### 9.4 Before any commercial offer (including pre-orders)
1. Opinions in hand: CITN s.16 / NTAA s.33; SEC Nigeria (ISA 2025, robo-advisory rules); UAE Decree-Law 33/2025. (RT-B §7; RT-C B3)
2. S-a held until those opinions arrive, or excluding UAE residents and research features. (RT-B B3)
3. S-b run inside a filing season through a practitioner, or moved openly to 2028. (RT-C B3)
4. The practitioner as the paid, practising party, with indemnity and liability addressed. (RT-B §5)
5. Copy rules ban "tax agent", "file your taxes" and "tax practitioner". (RT-B m2)
6. F-9 and F-14 passed. (RT-A; RT-C M8)
7. Commercial data licences priced. (RT-B M7)

## 10. Questions only the founder can answer

Ranked by how much the answer changes the plan.

| Rank | Question | What it changes | Raised in |
|---|---|---|---|
| 1 | Hours per week, for how long, split between building, operating and selling? | Scope, sequence, every date | P-1; RT-C B1; RT-A M9 |
| 2 | Residency facts for 2026–2027 (days, homes, employment, citizenship)? | Whether the pool view and worldwide-income rules matter | Doc 1 A2; RT-A M8 |
| 3 | In 2027: a personal tool only, or test the tax-and-records wedge in season? | Whether counsel, a DPIA and a practitioner are needed by mid-January | RT-C B3, §5; RT-B B3 |
| 4 | Institutions, accounts and formats (CSV, PDF, scanned, password-protected)? | Importer effort; OCR; PDF-password design | RT-C B2; RT-B B4 |
| 5 | Holdings by market, trading frequency, US-situs above USD 60,000? | NGX feed and research triggers; estate-tax monitor | RT-C M4; RT-A §6 |
| 6 | Will any model see your data (FD-1)? A personal or company API account? | AI layer; C2 urgency; household exemption | RT-B M3 |
| 7 | Can you fund a practitioner, counsel and an external review (Doc 9: USD 10–20k)? | Whether F-9, F-14 and §9.3–9.4 can happen | RT-B M6; RT-C §4.1 |
| 8 | Is there a trusted second person for quarterly re-labels and planted errors? | Whether any control is more than `self` | RT-A B1; RT-B M6 |
| 9 | Will you run it in a separate OS account or VM, away from NEXUS and coding agents? | Whether real data can be loaded | RT-B B4 |
| 10 | How many income streams and pay dates? | Whether construct 6 is L4 by definition | RT-A M2 |
| 11 | Base currency? | Presentation; goal engine | Doc 1 A4 |
| 12 | Python and TypeScript skill? | Whether Beancount fits | RT-C §4.1 |
| 13 | If the goal engine stays: which CMA source, and is "zero real" the default? | The headline (27–55 of 100) | C6 Q1–Q3 |
| 14 | Which risk-tolerance instrument? | Risk-module input | V-039 |
| 15 | What is an hour of your time worth? | F-1's rule | RT-A F-1 |
| 16 | Do you accept a research freeze? | Programme cadence | RT-C B2 |

## 11. Sources

**Memos and logs** (`docs/portfolio-os/reviews/`, read 2026-11-04):
1. `README.md`
2. `REVISION_LOG.md` (commit 7124bc0)
3. R03, R03b, R04, R05a, R05b, R05c, R06, R07, R08 and R09 memos: verdicts, §1 and blocking sections
4. `RT_A_science_and_models.md`, `RT_B_security_privacy_regulation.md` and `RT_C_product_complexity_commercial.md`, in full
5. `REVIEW_STANDARD.md`; `../00_CONTEXT_BRIEF.md` v0.2

**Consulted for status only** (authors' self-reports, not re-reviewed):
- `CANONICAL_CONTRACTS.md` v0.2, "Errata resolution" table (commit 2681349)
- Doc 9 §11, rows B1–B2
- Doc 4 §11, rows B3–B4
- `decisions/DECISION_LOG.md`
- Doc 1 §10 (A1–A10)

**Scripts run** (2026-11-04, under `python3 -I`):
- `research/scripts/rtb_c2_bypass_harness.py <validator path>`. The v0.1 validator (`git show 63b023a:…/contracts_checks.py`) let 18 of 20 strings pass. Commits cbd786c, 7124bc0 and HEAD 2681349 each let 17 of 20 pass. A run without the path argument exits 1.
- `research/scripts/contracts_checks.py` exits 0. Its output shows the C3.3a chips and still shows `reviewed_internal`.
- `/tmp/claude-0/-home-user-Terminal-/db376c7d-be49-5fe4-a185-5e7cc59446a3/scratchpad/rt11/rt11_arith.py` (not committed) computed:
  - the Wilson intervals: 22/26 gives 66.5–93.9%, and 25/26 gives 81.1–99.3%;
  - person-weeks to months at 20 h/week: 12 → 5.5, 25.5 → 11.8, 37 → 17.1, 50 → 23.1, 64 → 29.6;
  - the drift-calibration sample: 3,926 months;
  - the number of PPS draws: 149;
  - the burden conversions;
  - the reading time.
- `wc -w`: Docs 0–9 plus contracts, 158,018 words; `research/` Markdown, 70,707; reviews, 62,078.
- `git log` for the commit times.

**Not done here:** no web fetch, no reference re-verification, no re-run of RT-A's uncommitted sensitivity harness, and no re-review of any document. External facts are as reported by the memo cited.
