# Revision Log — issues confirmed by the coordinator for the Stage 3 revision pass

Issues raised by reviewers that the coordinator has independently confirmed, plus cross-document issues found outside a document's own review.
Each row is resolved by the owning department in the revision pass and closed with a commit reference.

| # | Document | Issue | Source | Coordinator check | Status |
|---|----------|-------|--------|-------------------|--------|
| V-001 | Doc 6 §4.G Example 3 | VAT at 7.5% on a ₦1,000 bank charge is ₦75, not ₦50. Charge line should be −1,075 and the reconciled closing balance ₦1,588,875, not ₦1,588,900 | Raised by R04 reviewer (out of scope for R04) | Recomputed: 1,000,000 + 1,500,000 − 600,000 − 310,000 − 600,000 + 600,000 − 1,075 − 50 = 1,588,875 | Open |
| V-002 | Doc 9 | Worked-example scripts lived only in the scratchpad | Raised by R09 reviewer | Scripts moved to `research/scripts/` (commit 593543c) | Closed |
| V-003 | Docs 4, 6, 7 | Three different posting/ledger models. R04: base-currency balancing, categories as posting accounts, no FX cost basis, 4-dp rate truncation. R07: 3-char currency column cannot hold security units; one-entry transfers break cut-off; reproducibility and idempotent re-import claims fail. A single canonical ledger model must be specified once and referenced by all three | R04 and R07, raised independently | Both memos read; conflict confirmed at summary level | Open — resolve in consolidated architecture (Doc 10 / ADR) |
| V-004 | Docs 5c, 7, 8 | Figure-integrity contract: Doc 7's post-generation numeric gate lets the model emit digits and accepts any trace value within 0.5%; Doc 5c specifies figure tokens rendered from the validated store. Adopt the token contract package-wide | R07 | Consistent with Doc 5c finding 7 and the charter's provenance principle | Open |
| V-005 | Doc 7 | Raw statements routed through the Batch API (29-day retention, no ZDR) contradicts the privacy posture | R07 | Accepted | Open |
