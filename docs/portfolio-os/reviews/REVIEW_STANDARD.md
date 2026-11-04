# Review Standard for Cross-Department and Red-Team Memos

Each reviewer is a separate agent that did not write the document under review, briefed to find weaknesses.

Memo format (file under `docs/portfolio-os/reviews/`):

```
Review of: <document>  ·  Reviewer roles: <roles>  ·  Date: <date>  ·  Verdict: Accept / Accept with required changes / Major revision / Reject
```
1. Verdict and the three most important problems (≤ 200 words)
2. Findings, severity-ranked (Blocking / Major / Minor), each with: section reference · the claim · why it is wrong, weak or over-graded · evidence (URL or verified reference) · proposed fix
3. Evidence-grade audit: claims graded higher than the evidence supports; claims presented as fact without a source
4. Citation and source spot-check table: ≥ 8 academic references re-verified (hosted lookup tool or OpenAlex/Crossref DOI) and ≥ 6 non-academic URLs re-fetched; status for each
5. Cross-document contradictions with the other package documents read
6. Questions the document leaves unanswered that the Investment Committee needs
7. Required changes before Investment Committee, in priority order
8. What the reviewer could not check

Rules: refute where you can; agreement is not validation; cite what you checked; do not rewrite the document; preserve the author's disagreements and add your own.
