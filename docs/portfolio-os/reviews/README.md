# Stage 1b/3 Review Memos — Verdict Summary

Ten independent reviews, each by a separate agent that did not write the document, briefed to refute. Run 2026-11-04 on Claude Opus 5.5 after an earlier attempt was lost to a usage limit.
Confirmed issues are consolidated in `REVISION_LOG.md`; cross-document contracts that settle shared conflicts are in `../CANONICAL_CONTRACTS.md`.

| Memo | Document reviewed | Verdict | Headline problem |
|------|-------------------|---------|------------------|
| R03 | 3 Behavioural finance (academic) | Major revision | Power analysis does not test the specified design; strongest interventions conflict with Doc 4; claims ladder overreaches for n = 1 |
| R03b | 3 Behavioural finance (cross-functional) | Accept with required changes | Doc 8 breaks the claims ladder; flagship measures improve no named decision; no privacy design |
| R04 | 4 Banking and ledger | Major revision | FX "cost" is a balancing plug that can hide mismatches; ledger model conflicts with Docs 6 and 7 |
| R05a | 5a Investment research | Accept with required changes | Worked Example 1 breaks its own rules; NGN cost-of-equity method misapplied; bank module misses binding CBN rules |
| R05b | 5b Quantitative models | Accept with required changes | Mislabelled statistics; goal engine centred on the historical mean; example not reproducible under isolated Python |
| R05c | 5c Market data | Major revision | Repo rate was wrong when committed, so entry-time checks are needed; status vocabulary undefined; NGX non-display fee omitted |
| R06 | 6 Accounting, audit, tax | Major revision | Wrong year of assessment for gains; rule-engine refusal logic undefined; section-number provenance errors |
| R07 | 7 Technology and security | Major revision | Numeric gate bypassable; ledger unbuildable as written; privacy posture self-contradictory and too heavy for one person |
| R08 | 8 UX blueprint | Major revision | Contradicts Docs 3, 4, 5c and 6 on claims, FX, status and residency capture |
| R09 | 9 Venture memorandum | Major revision | Tax wedge targets users who owe nothing; unit economics inconsistent; signals unreadable by month 9 |

**What held up across reviews:** the ten reviewers re-checked about 150 academic references by DOI and over 120 web sources. Fabricated citations: none found. The core positions survived — provenance first, prepare-not-file for tax, measurement over optimisation, observable patterns over psychological labels, no fundraising yet. The failures are mostly integration (documents written in parallel disagree), a few arithmetic and statistical errors, and over-confident evidence grades.
