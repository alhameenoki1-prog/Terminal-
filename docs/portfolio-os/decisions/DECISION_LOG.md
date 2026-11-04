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

## D-007 — Statement upload before open-banking APIs (pending)
- **Proposal:** Personal MVP ingests PDF/CSV statements with parsing and reconciliation; aggregator APIs later.
- **Supporting research:** Pending Doc 4 findings on Nigerian and UAE open-banking status.
- **Status:** Proposed.

## D-008 — Backend stack and data model (pending)
- **Proposal:** Python/FastAPI/PostgreSQL modular monolith with append-only ledger postings and provenance on every market figure.
- **Supporting research:** Pending Doc 7 and reviews.
- **Status:** Proposed.

## D-009 — Repository strategy (pending founder)
- **Proposal:** New directory in this repository or a new repository for Portfolio OS code.
- **Status:** Proposed; founder decision R3.
