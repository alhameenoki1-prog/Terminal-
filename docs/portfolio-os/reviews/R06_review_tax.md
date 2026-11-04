Review of: Document 06 — Accounting, Audit and Taxation Framework (v0.1, 2026-11-02/04)  ·  Reviewer roles: Nigerian tax researcher reading statute text; UAE tax researcher; international-tax researcher; external-audit specialist; regulatory-perimeter researcher (all simulated, none licensed: nothing here is tax or legal advice, and a licensed Nigerian tax practitioner, a UAE-registered tax agent and counsel must still review)  ·  Date: 2026-11-04  ·  Verdict: **Major revision**

## 1. Verdict and the three most important problems

The document is unusually careful. Most of its statutory readings hold up against the gazette text, which I re-downloaded today, and every number in its arithmetic reproduces. However, the flagship worked example and the rule engine built on it contain legal-structure errors that the arithmetic checks cannot catch.

1. **Basis-period error (Blocking).** NTA s.26(3) assesses an individual's chargeable gains in the year of assessment *after* the year of disposal. NTAA s.13(2)(b) makes the return report income "for the year preceding the year of assessment". Example 1 puts a June 2026 gain into "the 2026 year of assessment". No rule record covers basis periods.
2. **The rule engine's refusal logic is undefined (Blocking).** It refuses when `status != confirmed`, but no rule has the status `confirmed`. The single specified record uses a fifth status that is not in the documented lifecycle. Example 1 then produces a "balance on direct assessment" from a rule marked unconfirmed, with no watermark. The text names 22 rules (not 20), and only one is specified.
3. **Provenance defects in E2 claims (Major).** The NTAA's own commencement bracket reads **26 June 2025**, not 1 January 2026. The residency and exemption provisions are cited as s.202 and s.163 but are s.201 and s.162. NTA s.120(5), which deems "extant" treaties to apply, is not discussed.

