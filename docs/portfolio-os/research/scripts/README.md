# Reproducibility scripts

Every number in a worked example must be regenerable from a script in this folder (charter principle 10).
All inputs are synthetic or are dated assumptions stated in the script header. Run with `python3 -I <script>`.

| Script | Reproduces |
|--------|-----------|
| `doc04_ledger_worked_example.py` | Document 4 §4 worked example: postings, transfer match, reconciliation, net worth |
| `doc06_tax_worked_examples.py` | Document 6 §4.G worked examples (Nigerian PIT bands, residency case, ledger reconciliation) |
| `worked_example_5b.py` | Document 5b worked example: covariance shrinkage, drawdowns, bootstrap goal range |
| `prototype_checks.py` | Document 5b §F checks on the NEXUS Monte Carlo and performance prototypes |
| `thin_trading_demo.py` | Document 5b thin-trading beta bias and Dimson correction |
| `doc09_sizing_and_unit_economics.py` | Document 9 market sizing and unit-economics tables |
| `doc09_unit_economics_mix.py` | Document 9 plan-mix unit economics |
| `r09_unit_economics_sensitivity.py` | Review R09 recomputation and sensitivity of Document 9's unit economics |
| `../behavioural/payday_sim.py` | Document 3 synthetic payday-spending worked example |
| `contracts_checks.py` | CANONICAL_CONTRACTS.md C1–C7 worked examples: per-commodity postings, FX residual rule, currency pool and lots, figure-token validator, entry-time status check, confidence rule, FX decomposition and sign check, goal output, tax basis period and watermark |
| `doc05c_revision_checks.py` | Document 5c v0.2: entry-time primary-source check on the repo's policy rates (R0, Example C), NGX cost 2×2 and sensitivities incl. non-display and VAT, commercial floor, founder validation workload, NGX corporate-action date sequencing, price-group stale-close check, read-time freshness, kobo/naira dividend normalisation |
