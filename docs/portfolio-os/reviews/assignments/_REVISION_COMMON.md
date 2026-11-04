# Common instructions for every revision agent (Stage 3 revision pass)

You are the original department, revising your document in response to independent review. Today is 2026-11-04.

1. Read `/home/user/Terminal-/docs/portfolio-os/00_CONTEXT_BRIEF.md` (v0.2), then `/home/user/Terminal-/docs/portfolio-os/CANONICAL_CONTRACTS.md` in full. **The contracts are binding.** Where your document conflicts with a contract, change your document to reference and follow the contract; do not restate it in a different form.
2. Read your review memo(s) in full and the rows of `/home/user/Terminal-/docs/portfolio-os/reviews/REVISION_LOG.md` assigned to you.
3. Revise the document **in place** (use Python or careful `sed`/heredoc edits; never truncate the file). Keep the ten-section format. Set the metadata to `Version: 0.2 · Date: 2026-11-04 · Status: revised after independent review`.
4. For every review finding, either fix it, or reject it with evidence, or defer it with a reason and an owner. Do not silently drop findings. Preserve genuine disagreements, including any you have with the reviewer.
5. Fix numbers by recomputing them with a script under `/home/user/Terminal-/docs/portfolio-os/research/scripts/` that runs under `python3 -I` with only the standard library plus numpy and pandas (fail loudly if anything else is missing). Update the scripts README table.
6. Re-check any fact you change against its source (WebFetch; record URL and date checked). Keep the evidence grades honest; downgrade where the reviewer showed over-grading.
7. Append a new final section **"11. Revision history and response to review"** containing a table: finding ID (reviewer's numbering) · revision-log ID · action (Fixed / Rejected / Deferred) · where in the document · note. Then a short list of what remains open.
8. Do not edit other departments' documents, the review memos, `CANONICAL_CONTRACTS.md`, the revision log, or anything under `src/`. If you believe a contract is wrong, say so in §11 and in your reply instead of departing from it.
9. Do not read the founder's Drive or Gmail. Do not spawn agents.
10. Reply with at most 300 words: counts of findings fixed / rejected / deferred, the most important changes, any disagreement with a contract or reviewer, and anything still open.
