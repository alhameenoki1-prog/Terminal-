# Portfolio OS — Decision Log

Format per decision (founder's required fields): Proposal · Supporting research · Departments consulted · Major objections ·
Alternatives considered · Final recommendation · Outstanding uncertainties · Required validation before implementation.
Status values: Proposed · Recommended · Recommended by IC — awaiting founder approval · Approved by founder · Rejected · Superseded.
Investment Committee (IC) decisions D-010 to D-018 come from `decisions/INVESTMENT_COMMITTEE_MEMO.md` v1.0 (2026-11-04), §7. All IC members are simulated roles, not licensed professionals.

| ID | Date | Decision | Status |
|----|------|----------|--------|
| D-001 | 2026-11-02 | Research and design before any implementation | Approved by founder (master prompt) |
| D-002 | 2026-11-02 | Research package versioned in the repository under `docs/portfolio-os/` | Recommended (R2) |
| D-003 | 2026-11-02 | Portfolio OS is a separate product from NEXUS, Deal Radar and the AML venture | Approved by founder (master prompt) |
| D-004 | 2026-11-02 | Evidence-grading scale E1–E6 and citation-verification tags are mandatory | Recommended |
| D-005 | 2026-11-02 | Operating model: parallel specialist subagents plus separate adversarial reviewers | Recommended |
| D-006 | 2026-11-02 | Founder's private Drive and email content excluded from research inputs | Recommended (R7) |
| D-007 | 2026-11-02 (outcome 2026-11-04) | Statement upload before open-banking APIs for the personal MVP | Recommended by IC — awaiting founder approval |
| D-008 | 2026-11-02 (outcome 2026-11-04) | Backend stack and data model: Beancount 3 + beangulp + Fava for the personal stage, subject to spike F-13; PostgreSQL C1 build is the costed fallback | Recommended by IC — awaiting founder approval |
| D-009 | 2026-11-02 (outcome 2026-11-04) | Repository strategy for Portfolio OS code (see D-018) | Recommended by IC — founder decides |
| D-010 | 2026-11-04 | IC D1: personal-MVP scope — RT-C thin MVP, modified (M-0 security, independence chip, assumption register); nine systems preserved via re-entry triggers. Vote 7–2 | Recommended by IC — awaiting founder approval |
| D-011 | 2026-11-04 | IC D2: sequence and calendar — hours-indexed plan, research freeze, manual-pack rule (15 Jan 2027), Gate P replaces Doc 9's six-month Stage 0 gate. Vote 8–1 | Recommended by IC — awaiting founder approval |
| D-012 | 2026-11-04 | IC D3: conditions precedent CP-1–CP-12 before any real financial data. Vote 7–2 | Recommended by IC — awaiting founder approval |
| D-013 | 2026-11-04 | IC D4: external challenge — licensed practitioner, security reviewer, named second person; "self-checked" / "checked by software" labels. Vote 8–1 | Recommended by IC — awaiting founder approval |
| D-014 | 2026-11-04 | IC D5: C6 goal engine deferred; deterministic calculator; assumption register before Stage 4 sign-off. Vote 8–1 | Recommended by IC — awaiting founder approval |
| D-015 | 2026-11-04 | IC D6: data budget — USD 5/month recurring ceiling; NGX asked in writing. Vote 8–1 | Recommended by IC — awaiting founder approval |
| D-016 | 2026-11-04 | IC D7: commercial path — 2027 is case zero; concierge go/no-go 15 Jan 2027, else 2028 season; S-a held; opinions now; re-dated kill criteria. Vote 6–3 | Recommended by IC — awaiting founder approval |
| D-017 | 2026-11-04 | IC D8: behavioural module — four L0b decision-linked measures and a decision log; no L1 claims. Vote 7–2 | Recommended by IC — awaiting founder approval |
| D-018 | 2026-11-04 | IC D9: repository — new private code repository; ledger in a local repository with no remote. Vote 7–2 | Recommended by IC — founder decides |

---

## D-001 — Research and design before any implementation
- **Proposal:** No application code until research (Stage 1), design (Stage 2) and independent review (Stage 3) are complete and the founder approves the MVP scope (Stage 4).
- **Supporting research:** Founder's instruction; repository evidence that building first produced hardcoded, unsourced figures and an untested client-side quant engine.
- **Departments consulted:** All (binding in the context brief).
- **Major objections:** None recorded. A YC-style operator would note the risk of over-researching; mitigated by stage exit criteria and a time-boxed MVP definition.
- **Alternatives considered:** Prototype-first with retrofitted methodology (rejected: repeats prior failure).
- **Final recommendation:** Adopt.
- **Outstanding uncertainties:** None.
- **Required validation:** Stage 3 review completed before Stage 5 begins.

## D-002 — Research package versioned in the repository
- **Proposal:** All documents under `docs/portfolio-os/` on branch `claude/upbeat-mayer-55n8yk`, committed and pushed.
- **Supporting research:** Founder follows the session in the Claude app, which opens files in the working directory; Git gives history and review.
- **Departments consulted:** Coordinator; Engineering.
- **Major objections:** Documents could alternatively live in Claude Docs or Notion for commenting; neither is connected or requested.
- **Alternatives considered:** Claude Docs; Google Docs; Notion (requires OAuth).
- **Final recommendation:** Repository as the system of record; a published summary artifact may be added for reading convenience.
- **Outstanding uncertainties:** Founder preference (R2).
- **Required validation:** None.

## D-003 — Separate product from NEXUS, Deal Radar and the AML venture
- **Proposal:** Portfolio OS has its own objectives, architecture and roadmap; shared components only by explicit later decision.
- **Supporting research:** Founder's master prompt; NEXUS code serves intraday macro trading, a different problem.
- **Departments consulted:** Executive; Engineering.
- **Major objections:** Some NEXUS services (FRED, yields) and UI patterns could be reused; allowed case by case (Doc 7 §G).
- **Alternatives considered:** Extend NEXUS into Portfolio OS (rejected: different data integrity requirements, no backend, no tests).
- **Final recommendation:** Adopt.
- **Outstanding uncertainties:** Repository strategy (D-009).
- **Required validation:** Doc 7 reuse assessment.

## D-004 — Evidence grading and verification tags
- **Proposal:** Every important claim graded E1–E6; academic citations verified via OpenAlex/arXiv lookup and tagged.
- **Supporting research:** Founder's research standards (§12 of the master prompt); availability of the reference-lookup tools.
- **Departments consulted:** Academic; all authors.
- **Major objections:** Verification slows drafting. Accepted cost.
- **Alternatives considered:** Unstructured citations (rejected).
- **Final recommendation:** Adopt.
- **Outstanding uncertainties:** Tool coverage for grey literature and regulators (web verification used instead).
- **Required validation:** Academic review (Stage 1b) spot-checks citations.

## D-005 — Operating model for agents
- **Proposal:** Nine parallel department agents for Stage 1; separate reviewer agents for Stage 1b/3; coordinator synthesises; Workflow tool reserved for repeatable pipelines.
- **Supporting research:** Environment inspection (Doc 2 §5).
- **Departments consulted:** Coordinator.
- **Major objections:** A deterministic Workflow could enforce research→review automatically; chosen against for Stage 1 because reviewer briefs must respond to the actual drafts.
- **Alternatives considered:** Single-agent role-play (rejected by founder); Workflow pipeline (deferred).
- **Final recommendation:** Adopt for Stages 1–3; revisit for Stage 5–6 test pipelines.
- **Outstanding uncertainties:** Agent output quality varies; mitigated by format and review.
- **Required validation:** Red team reviews the process in Doc 11.

## D-006 — Private Drive and email excluded
- **Proposal:** A one-time Drive search for project files found none; private corporate documents present are excluded from research inputs; Gmail not searched.
- **Supporting research:** Privacy principle; founder did not point to those files.
- **Departments consulted:** Privacy/compliance.
- **Major objections:** None.
- **Alternatives considered:** Broad mining of Drive/Gmail (rejected).
- **Final recommendation:** Adopt unless the founder designates specific files.
- **Outstanding uncertainties:** None.
- **Required validation:** Founder confirmation (R7).

## D-007 — Statement upload before open-banking APIs
- **Status:** Recommended by IC — awaiting founder approval (outcome recorded 2026-11-04; was Proposed).
- **Proposal:** The personal MVP ingests PDF/CSV statements through deterministic beangulp importers. Each import carries the C1.8 line key and the document SHA-256, and is reconciled by balance assertions to the printed closing balance. Bank or aggregator APIs come later.
- **Supporting research:**
  - Doc 4 §1, Conclusion 1: CBN open banking has no confirmed go-live, and individuals are not API consumers. UAE Open Finance is live at about five of fifteen banks and needs a CBUAE licence.
  - Doc 9 F13: go-live "did not materialize".
  - Doc 9 §4.4: Mono at ≈ $0.37 per account a month can take Basic margin to −4%.
  - Okra shut down in May 2025 (Doc 9 F12).
- **Departments consulted:** Banking and personal finance (Doc 4); Technology (Doc 7); Venture (Doc 9); IC.
- **Major objections:**
  - Parser coverage for the founder's banks is unproven; `bankstract` is alpha (Doc 4 §1).
  - Password-protected PDFs are undesigned (RT-B B4).
  - Manual uploads add ≈ 25 min/month (RT-C M2, E5).
- **Alternatives considered:**
  - Mono aggregation (rejected for the MVP on cost and margin).
  - SMS-alert parsing (not pursued).
  - Manual entry of scanned pages checked by a balance assertion: kept for scanned pages (RT-C m5).
- **Final recommendation:** Adopt. Re-entry trigger for APIs: CBN open banking live, plus a 60-day shadow test (Doc 4 R10).
- **Outstanding uncertainties:** Statement formats per institution (founder fact 4); share of scanned pages.
- **Required validation before implementation:** Spike F-13 on three redacted statements, run only after conditions precedent CP-1–CP-10 (D-012).

## D-008 — Backend stack and data model
- **Status:** Recommended by IC — awaiting founder approval (outcome recorded 2026-11-04; was Proposed).
- **Proposal:** For the personal stage, use Beancount 3 + beangulp + Fava (Doc 7 Option B), with Python scripts for reports, the CBN snapshot fetcher and the C1 invariant checker.
  - The ledger follows the C1 account plan: `Equity:Conversion:<C>`, `Assets:InTransit:<id>`, categories as metadata, and base-currency figures as derived views (C1 D3).
  - Status uses three values (unchecked / checked / disputed) × the C3.3a independence chip, plus read-time freshness and the C3.5 entry check.
  - C8 governs retention.
  - The original proposal, a FastAPI/PostgreSQL modular monolith (Doc 7 Option A, 37 pw), becomes the costed fallback and the re-entry path for a second user or a hosted tier.
- **Supporting research:**
  - Doc 7 §1 and §4.13: Option B is 25.5 pw against 37 for Option A, and Option B's Fava path costs 1 pw for the UI against 5.
  - RT-C M6 and cut 1 save 11.5 pw (Doc 7's figure).
  - GPL-2.0 places no condition on software that is run but not distributed (Doc 7 §1).
- **Departments consulted:** Technology (Doc 7); contracts owner; RT-B; RT-C; IC.
- **Major objections:**
  - The CTO dissents on making Beancount the default before the spike (D-010).
  - Fava has no authentication, and plugin directives import modules (RT-B M2).
  - Beancount lacks AVERAGE booking. RT-C M6 answers this: the WA pool is a derived report.
  - GPL applies if a build is ever distributed (RT-B m1).
- **Alternatives considered:**
  - Option A, PostgreSQL C1 build.
  - hledger (weaker on lots).
  - Actual Budget (single-currency).
  - A spreadsheet plus scripts (suits weeks 0–4 only) (RT-C §4.4).
- **Final recommendation:** Adopt Option B as the default, subject to spike F-13. If F-13 fails, cost Option A before Stage 5.
- **Outstanding uncertainties:**
  - The founder's Python skill (founder fact 12).
  - The cost of the authenticating proxy (uncosted, Doc 11 §6).
- **Required validation before implementation:** F-13 (2–3 days): balance-assertion reconciliation, idempotent re-import, and RT-B's proxy, Host-header and injection checks, all on three redacted statements after CP-1–CP-10.

## D-009 — Repository strategy
- **Status:** Recommended by IC — founder decides (outcome recorded 2026-11-04; was Proposed; founder decision R3).
- **Proposal:** New directory in this repository, or a new repository, for Portfolio OS code.
- **Outcome:** The IC recommends a new private code repository, with the ledger in a separate local git repository with no network remote. Full record in **D-018**.

---

## D-010 — IC D1: personal-MVP scope (thin MVP, modified)
- **Status:** Recommended by IC — awaiting founder approval. Vote 7–2.
  - For: chair, CFO, CPO, CIO, CBSO, Red Team head, YC operator.
  - Against: CEO, CTO.
- **Proposal:** Adopt RT-C's thin MVP (≈ 12 pw, range 8–18, E5; RT-C §4.2) on Beancount + Fava, with IC modifications:
  - M-0 security first (D-012);
  - three status values × the independence chip, badged above a materiality threshold;
  - a one-page assumption register (D-014);
  - the pool view gated on residency;
  - the operating-time target restated as ≤ 60 min/month.

  **In scope:**
  - **M-1** (≈ 3 pw): the ledger, one importer, CBN NFEM fetcher, NGN/USD net worth and a tested restore.
  - **M-2** (+3.5 pw): two more importers; a deterministic matcher; five reports (conversion cost against the CBN reference; liquidity by currency; currency exposure with named devaluation scenarios; fees and recurring charges; unexplained inflows); a decision log; **records pack v1 to a practitioner by 28 Feb 2027**.
  - **M-3** (+5.5 pw): broker importers with FIFO lots; a derived NGN pool cost labelled "method pending practitioner"; the C5 decomposition; a deterministic goal calculator; a provenance report; invariants and golden tests in CI; a close checklist with logged minutes.

  **Deferred, each with a trigger:**
  - statistical matcher (> 50 own transfers/month);
  - C4 calibration (model suggestions introduced);
  - OCR (> 3 scanned statements/month);
  - research module and NGX feed (a pending investment decision above a founder-set share of liquid net worth; NGX trading more than monthly);
  - risk module (> 10 positions);
  - C6 (D-014 conditions);
  - C7 engine (F-14 priced saving and F-9 pass);
  - AI layer (F-15, then CP-11);
  - claims ladder and construct 6 (shortfall cost > 0);
  - nine-area UI (second user).
- **Supporting research:**
  - Doc 11 §1, §4(d) D1 and §6: 50–64 pw for the package as specified against ≈ 12.
  - Doc 7 §4.13: Option B Stage-0 slice of 10/17/28 pw.
  - RT-C B1, M1–M9 and the cut list; running costs fall from USD 70–1,374/month to 0–5.
  - Doc 1 §9 success criteria.
- **Departments consulted:** All nine IC roles; Docs 3–9 owners via their positions; RT-A, RT-B, RT-C via Doc 11.
- **Major objections:**
  - *CEO:* the C7 engine is the wedge, so a minimal cross-border rule set belongs in M-3.
  - *CTO:* "spike, then choose" rather than Beancount by default.
  - *Bear case (memo §5):* a spreadsheet plus a practitioner may deliver most of the value.
- **Alternatives considered:**
  - Doc 7's fuller build (Option A 37 pw, or Option B's slice).
  - Concierge-first.
  - Remain a personal tool.
  - Spreadsheet plus practitioner.
  - NGX dataset B2B.
  - Practitioner workbench.

  See memo §6.
- **Final recommendation:** Adopt the modified thin MVP.
  - Docs 1–9 stay frozen as the target specification.
  - Contracts C1–C8 bind each MVP component's forward-compatible subset.
  - A re-entry register is checked at every monthly close.
  - No deferred item is removed without a founder decision logged here.
- **Outstanding uncertainties:**
  - Founder hours, institutions and holdings.
  - The E5 effort estimates, with no measured velocity.
  - Whether F-1 shows any changed decision.
- **Required validation before implementation:**
  - Founder fact-find.
  - D-012 conditions precedent.
  - Spike F-13.
  - F-1–F-18 pre-registered and hashed (Doc 11 §9.1 item 8).

## D-011 — IC D2: sequence and calendar
- **Status:** Recommended by IC — awaiting founder approval. Vote 8–1.
  - For: all except the CFO.
  - Against: CFO.
- **Proposal:**
  - **Sequence:**
    1. Week 0–1 (by 13 Nov 2026): fact-find, FD-1 = no, practitioner engaged, opinions commissioned, NGX letter sent.
    2. M-0.
    3. Spike F-13.
    4. M-1 → M-2 → M-3.
  - **Research freeze** until a consuming module is built. Exceptions: legal opinions, NGX answer, tax re-gazetting, security baseline, and the CBSO's construct-6 pre-registration document.
  - **Hours-indexed calendar.** The MVP is 480 h and M-1 + M-2 ≈ 260 h. There are 16 weeks to 28 Feb 2027 (IC arithmetic):
    - at 10 h/week, 160 h, so the pack is prepared by hand;
    - at 20 h/week, 320 h, so the pack is built by software with about 60 h margin;
    - at 40 h/week, 640 h.
  - **Manual-pack rule:** if M-1 is not complete by 15 Jan 2027, the 2027 records pack is prepared by hand from statements against the practitioner's field list.
  - **Gate P** replaces Doc 9's month-6 Stage 0 gate. It is read at 480 logged build hours or on 4 Nov 2027, whichever comes first. Pass criteria:
    - every uploaded period reconciles to zero, or its gap is named (F-16);
    - no figure appears without source and as-of;
    - the records pack reached the practitioner by 28 Feb 2027;
    - operating minutes are measured, with ≤ 60 min/month after month 3 as the target and the F-12 kill above 60 min/week for 4 weeks;
    - at least one logged decision a month used a report.

    An integrity failure means redesign, not a verdict on the hypothesis. A schedule miss with integrity intact means re-plan, not kill.
- **Supporting research:**
  - RT-C B1, B2, §4.2.
  - Doc 11 §4(d) D1 and §7.1.
  - Doc 9 §4.6 and §8.3: the Stage 0 gate, the founder time cap and the month-9 date of 4 Aug 2027.
  - Doc 6 §7 item 6: 31 March is LIRS practice, and the statutory anchor was not located.
- **Departments consulted:** IC; Doc 7 and Doc 9 owners.
- **Major objections:**
  - *CFO:* the 4 Nov 2027 backstop is too lenient; it should be 4 Aug 2027.
  - *RT-A, via Doc 11 §7.1:* the inventory should come before Stage 4. Adopted in D-014.
- **Alternatives considered:**
  - Doc 9's fixed six-month Stage 0. Rejected: it tests the calendar, not the hypothesis.
  - A calendar-only backstop.
  - No freeze.
- **Final recommendation:** Adopt. Review the backstop once the founder's hours are known.
- **Outstanding uncertainties:**
  - Founder hours (unknown).
  - The size of the recurring operations load: RT-B ≈ 3 h/week for the full package; the thin MVP's load is unmeasured.
- **Required validation before implementation:**
  - Founder's declared hours.
  - A weekly hours log from week 0 (Doc 9 operating rules).

## D-012 — IC D3: conditions precedent before real financial data
- **Status:** Recommended by IC — awaiting founder approval. Vote 7–2.
  - For: chair, CEO, CFO, CPO, CIO, CBSO, Red Team head.
  - Against: CTO, YC operator.
- **Proposal:** No real financial data, including redacted statements, is loaded until:
  - **CP-1** a dedicated OS account or VM exists, with no development tools, no AI coding agents and no NEXUS checkout, running code installed from a hash-pinned release;
  - **CP-2** the data directory sits outside every repository and agent directory, with a pre-commit check blocking statement and ledger files, and the ledger repository has no remote;
  - **CP-3** a drop folder is in place and shredded after import, and PDF passwords are stored nowhere or in the OS keychain;
  - **CP-4** the email account is treated as part of the system boundary;
  - **CP-5** full-disk encryption, 127.0.0.1 binding and a browser profile with no extensions are in place;
  - **CP-6** C8 is live before the first backup:
    - per-class age recipients;
    - no compliance-mode lock;
    - governance mode only with the bypass credential in escrow;
    - a write-only host key;
    - the key-store identity escrowed with `age -p` or 2-of-3;
    - rule 34 gating nothing;
    - a rotation window of ≤ 30 days stated;
  - **CP-7** one tested restore and one erasure drill (C8-I3) have been run;
  - **CP-8** Fava sits behind an authenticating proxy with a Host-header check and passes the injection test, or the founder signs acceptance of the risk, valid only with CP-1;
  - **CP-9** the C3.5 entry check is live on the CBN NFEM Rate;
  - **CP-10** counterparty identifiers are tokenised at ingest;
  - **CP-11** before any model enters the path: a fresh C2 adversarial round with new strings by a party other than C2's author, RT-B tests (i)–(vi), and a value-blind model;
  - **CP-12** an external security review (≈ 1 reviewer-week) is done before network exposure, any AI layer or a second user.

  Coding agents work only in the development account, on synthetic fixtures.
- **Supporting research:**
  - RT-B B1 (retention), B2 (C2 bypass), B4 (laptop and dev tooling), M2, M5, M8.
  - V-040, V-041, V-043.
  - C2 bypass history: 18/20 at v0.1, 17/20 at an intermediate commit, 0/20 at afc6552, but hardened against the known list (Doc 11 §4(b)).
  - C8; Doc 7 §4.7.1 MVB 1–10; Doc 11 §9.2.
- **Departments consulted:** Technology; contracts owner; RT-B; IC.
- **Major objections:**
  - *CTO:* CP-12 should come before the first real statement (Doc 7 rank 2).
  - *YC operator:* CP-8 and CP-10 are over-engineering for one isolated user (RT-C m3, m4).
- **Alternatives considered:**
  - Doc 7's gate (external review before any statement).
  - RT-C's lighter localhost posture (Fava on 127.0.0.1; passkeys and CSP deferred).
- **Final recommendation:** Adopt CP-1–CP-12 as written.
- **Outstanding uncertainties:**
  - The cost of the proxy.
  - Whether the founder can run a separate OS account or VM (founder fact 9).
  - The external-review quote.
- **Required validation before implementation:**
  - A checklist evidencing each CP.
  - C8-I3 and C8-I4 tests.
  - F-13's proxy and injection checks.

## D-013 — IC D4: external challenge with one user
- **Status:** Recommended by IC — awaiting founder approval. Vote 8–1.
  - For: all except the Red Team head.
  - Against: Red Team head.
- **Proposal:**
  1. **Practitioner.** Engage a CITN-registered practitioner in November. They agree the pack fields, receive pack v1 by 28 Feb 2027, recompute Doc 6 Examples 1–3 and the real year (F-9), log hours with and without the pack (F-14), answer the four C1.6 questions, and give two per-pack quotes.
  2. **Second person.** Each quarter, a blind one-month rebuild (F-2) and planted errors in a labelled replica (F-4, F-5), at about one reviewer-week. The founder names the person. Failing that, a paid reviewer under a confidentiality agreement. Failing that, the tests are reported as "not run".
  3. **External security reviewer**, as in CP-12.
  4. **Labels.** Every check records C3.3a `independence` ∈ {self, simulated_agent, second_person, licensed}. The UI shows "self-checked" and "checked by software". C7's `reviewed_internal` is renamed "checked by software"; the contracts owner confirms. Nothing is called "validated", "reviewed" or "independent" without a second person or a licensed professional. The records pack's cover sheet discloses which checks were of which kind.
- **Supporting research:**
  - V-034; RT-A B1; RT-B M6.
  - Doc 11 §8: six of eighteen tests need a second person or a licensed professional.
  - Doc 6 §1: 17 `reviewed_internal`, none practitioner-confirmed.
  - Doc 9 §4.4: per-pack review $25–60 (E5).
- **Departments consulted:** Red Team; Tax (Doc 6); contracts owner; IC.
- **Major objections:**
  - *Red Team head:* F-2's rule says no pack leaves before a second-person rebuild passes, and sending pack v1 first breaks a pre-registered rule.
- **Alternatives considered:**
  - A second model family as a reviewer. Not adopted: still not a human or a licensed check.
  - Founder-only validation, labelled honestly.
- **Final recommendation:** Adopt. The practitioner's recomputation is the external check on pack v1, disclosed on its cover sheet.
- **Outstanding uncertainties:**
  - Whether a second person exists (founder fact 8).
  - Practitioner fees.
- **Required validation before implementation:**
  - Practitioner engagement letter.
  - The C7 label rename.
  - Pre-registration of F-2, F-4, F-5, F-9 and F-14.

## D-014 — IC D5: goal engine and assumption register
- **Status:** Recommended by IC — awaiting founder approval. Vote 8–1.
  - For: all except the CIO.
  - Against: CIO.
- **Proposal:** The C6 Monte Carlo engine does not ship in the MVP. M-3 ships a deterministic required-return and contribution table instead:
  - every assumption is shown at low, central and high values;
  - the NGN-depreciation input is a registered, sourced assumption, never a default;
  - devaluation scenarios are named historical events, not forecasts.

  **C6 re-enters only when all of these hold:**
  - low, central and high counts are displayed;
  - the engine refuses when the span exceeds about 20 points;
  - F-8 monotonicity passes;
  - drift is declared untestable;
  - F-7 shows the engine changes a decision;
  - the founder picks the capital-market-assumption source and the neutral default.

  **Assumption register before Stage 4 sign-off, scoped to the surviving models.** Fields: owner, source, as-of, grade, sensitivity, test, materiality tier and review date.
- **Supporting research:**
  - RT-A B2 and V-035: drift of 8/12/16% gives 55/41/27 of 100; a jump rate of 0 against 0.3 gives 38 against 45; detecting a 2 pp drift error needs 3,926 months, about 327 years (Doc 11 A2).
  - V-036: about 15 models and about 220 E4/E5 parameters unregistered.
  - RT-C cut 4; C6 Q1–Q3.
- **Departments consulted:** Investment and quant (Doc 5b); RT-A; IC.
- **Major objections:**
  - *CIO:* C6 could ship in M-3 under RT-A's conditions, and the table hides shortfall risk.
  - *Timing:* V-036 placed the register before Stage 5. The IC overrules that, adopting Doc 11's scoped version before Stage 4.
- **Alternatives considered:**
  - Ship C6 with RT-A's conditions.
  - Ship C6 unchanged (rejected: F-8 fails today).
  - No goal output.
- **Final recommendation:** Adopt.
- **Outstanding uncertainties:**
  - The NGN-depreciation source.
  - The capital-market-assumption licence.
  - Whether the founder needs ranges at all.
- **Required validation before implementation:**
  - Register reviewed by the Red Team head.
  - F-7 and F-8 pre-registered.

## D-015 — IC D6: data budget
- **Status:** Recommended by IC — awaiting founder approval. Vote 8–1.
  - For: all except the CIO.
  - Against: CIO.
- **Proposal:** A recurring data-and-AI ceiling of **USD 5/month** for the MVP.
  - **NGX:** not bought; holdings come from broker and CSCS statements. A written question goes to NGX in November covering natural-person eligibility, whether personal analytics counts as non-display, the local or international basis, and the bandwidth band.
  - **US data:** not bought; SEC EDGAR is free if needed; yfinance is removed.
  - **AI in the product:** none.
  - **Backups:** Backblaze B2, first 10 GB free.

  **Ceilings after a trigger, each needing its own approval:**
  - NGX at the figure NGX quotes in writing (reference points: $26.33 local display-only, $103.78 local non-display, $791.67 international non-display, sensitivity to $1,416.67);
  - an AI layer at $141.64/month central, with spend limits;
  - Tiingo at $30/month.

  Professional fees are one-off and quoted, within Doc 9's USD 10–20k Stage 0 envelope.
- **Supporting research:** Doc 5 §1, §4.1–4.2; Doc 7 §4.12(b) and (d); RT-C §3, cut 7 and M5; Doc 11 §7.2 (yfinance).
- **Departments consulted:** Market data (Doc 5c); Technology; CFO; IC.
- **Major objections:**
  - *CIO:* approve the $103.78 local non-display line now, so holdings are valued daily.
- **Alternatives considered:**
  - Doc 5's MVP totals, from a $26.33 floor to a $1,989.64 ceiling.
  - Doc 7's AI layer at $43.85–582.05/month.
- **Final recommendation:** Adopt the USD 5 ceiling and send the NGX letter now.
- **Outstanding uncertainties:**
  - NGX's answer.
  - Residency, which sets the fee basis.
- **Required validation before implementation:** NGX's written answer before any NGX feed is bought.

## D-016 — IC D7: commercial path
- **Status:** Recommended by IC — awaiting founder approval. Vote 6–3.
  - For: chair, CFO, CTO, CIO, CBSO, Red Team head.
  - Against: CEO and YC operator (want more 2027 testing); CPO (wants none in 2027).
- **Proposal:**
  1. Commission now, with a 6–8-week deadline: the CITN Act s.16/s.19 and NTAA s.33 opinion; the SEC-perimeter opinion (ISA 2025 and robo-advisory rules); a light DPIA. UAE counsel only if UAE residents are to be approached.
  2. The 2027 season is case zero, the founder's own pack, measuring F-9 and F-14.
  3. **Go/no-go on 15 Jan 2027** for a concierge of at most 10–20 clients through one practitioner, who is controller, seller and signer. All must hold: a favourable CITN opinion; a signed processor agreement; the DPIA done; the manual-pack rule not triggered. Otherwise the concierge runs in the 2028 season, stated openly.
  4. S-a pre-orders are held until the SEC and UAE opinions arrive; when run, they exclude UAE residents and research features.
  5. No person-specific output goes to anyone but the founder until counsel opines.

  **Kill criteria:**
  - Opinions say core outputs are regulated or tax practice **and** no practitioner or partner will hold the activity: remain a personal tool. A late opinion is a block, not a kill.
  - By 30 Apr 2027: F-14 saving < about 2 h a case, or F-9 shows a material difference: no C7 engine, and rules revert to `draft`.
  - End of the first in-season concierge: packs save < about 2 h, or clients do not pay at about $100: remain a personal tool, or move to the practitioner workbench.
  - Doc 9's month-15/18/24 gates are re-indexed from the first in-season test.
- **Supporting research:**
  - RT-C B3 and §5; RT-B B3; V-042.
  - Doc 9 F16, F17, F21; §4.4 pack economics ($100 price, $40 review gives $37); §8.3.
  - Doc 11 §9.3–9.4.
- **Departments consulted:** Venture (Doc 9); Tax (Doc 6); Legal/regulatory research (RT-B); IC.
- **Major objections:**
  - *CEO:* 2028 delays the first demand signal by 12 months; treat 15 Jan as a target.
  - *YC operator:* the concierge is the only real-money test, so push it.
  - *CPO:* founder hours cannot bear the MVP, the founder's own filing and 10–20 packs together; F-1 should pass first.
- **Alternatives considered:**
  - Doc 9's S-b after the month-6 opinion (rejected: out of season).
  - An unconditional 2027 concierge.
  - No commercial work (remain a personal tool).
  - Practitioner workbench.
  - NGX dataset.
- **Final recommendation:** Adopt the conditional path.
- **Outstanding uncertainties:**
  - Counsel timing.
  - Whether data preparation counts as "practice" (RT-C §7).
  - Willingness to pay and churn (Doc 9 §7.2).
- **Required validation before implementation:**
  - Opinions in hand.
  - DPIA.
  - Processor agreement.
  - Signals pre-registered.
  - Copy rules banning "tax agent", "file your taxes" and "tax practitioner" (RT-B m2).

## D-017 — IC D8: behavioural module
- **Status:** Recommended by IC — awaiting founder approval. Vote 7–2.
  - For: chair, CFO, CTO, CPO, CIO, Red Team head, YC operator.
  - Against: CBSO, CEO.
- **Proposal:**
  - **Ships**, as L0b reports with Doc 3's verbatim L0a/L0b captions (Doc 3 constructs 1–4):
    - recurring charges;
    - fees, levies and conversion cost against the CBN reference;
    - liquidity buffer by currency;
    - currency conversions against liability currency.

    Also the decision log (feeds F-1) and the `L0b.before_after` disclaimer for any standing order the founder sets.
  - **Guardrails:**
    - no L1+ statements;
    - no trait words;
    - no causal verbs;
    - no within-person trials;
    - no model-written behavioural text;
    - overdraft and NSF fees shown, as the construct-6a trigger.
  - **Waits:**
    - claims-ladder engine;
    - construct 6, until shortfall cost > 0, one confirmed income stream and F-6;
    - construct 5, until tokenisation and consent machinery exist;
    - questionnaires, including the 7 year-one items and the risk item (moot, V-039);
    - disposition and turnover;
    - anything for another person.
- **Supporting research:**
  - Doc 3 §1: power 0.36 at 12 months for a 15% effect; bias-corrected finance-nudge effect 0.00; 8.03× against 1.60×; 64 items cut to 7.
  - Doc 3 §4 construct table.
  - Doc 9 F20: a retention feature, not a moat.
  - RT-C cut 13.
- **Departments consulted:** Behavioural science (Doc 3); Product (Doc 8); IC.
- **Major objections:**
  - *CBSO:* pre-register construct 6 and ask the 7 items now, so a baseline exists. The pre-registration document is allowed as a freeze exception.
  - *CEO:* restraint is the brand, and fee tables do not show it.
- **Alternatives considered:**
  - Doc 3's full MVP set, including obligations and questionnaires.
  - No behavioural module.
- **Final recommendation:** Adopt.
- **Outstanding uncertainties:**
  - The founder's pay cycles and any shortfall cost (founder fact 10).
- **Required validation before implementation:**
  - Templates checked against the Doc 3 ladder.
  - F-11 threshold made binding.

## D-018 — IC D9: repository strategy (recommendation; founder decides)
- **Status:** Recommended by IC — founder decides. Vote 7–2.
  - For: chair, CEO, CFO, CTO, CIO, CBSO, Red Team head.
  - Against: CPO, YC operator.
- **Proposal:**
  - A new private repository for Portfolio OS code (Python, importers, reports, CI).
  - The ledger in a separate local git repository with no network remote, inside the CP-1 data account; off-site copies only via C8's encrypted backups.
  - The research package stays in this repository, linked from the new one.
- **Supporting research:**
  - RT-B B4: no NEXUS checkout or npm toolchain in the Portfolio OS account.
  - Doc 7 §1 and RT-B m1: GPL matters only for distributed builds.
  - RT-C M6: git history serves as soft state for one user, which makes the ledger repository itself personal data.
  - D-003: separate product.
- **Departments consulted:** Technology; Red Team; Product; IC.
- **Major objections:**
  - *CPO and YC operator:* a `portfolio-os/` directory here keeps docs and code reviewed together at no cost; split later.
- **Alternatives considered:**
  - A new directory in this repository.
  - A monorepo with NEXUS (rejected under D-003 and RT-B B4).
- **Final recommendation:** A new private code repository. Under either option, the ledger never lives in a repository with a remote.
- **Outstanding uncertainties:**
  - The founder's GitHub and CI preferences.
  - Whether a hosted tier is planned within 12 months (Doc 7 §9).
- **Required validation before implementation:**
  - Founder decision.
  - CP-2 pre-commit check in place in whichever code repository is chosen.
