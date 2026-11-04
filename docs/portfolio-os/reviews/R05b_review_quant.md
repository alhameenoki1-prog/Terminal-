Review of: Document 5b — Quantitative Finance Model-Selection Report (v0.1, 2026-11-02/04)  ·  Reviewer roles: statistics/econometrics professor; practising quantitative portfolio manager; implementing software engineer; lay-user explainer  ·  Date: 2026-11-04  ·  Verdict: **Accept with required changes**

## 1. Verdict and the three most important problems

The central judgement holds: for this user, the job is measurement, not optimisation. I confirmed 19 of the 23 prototype defects in code and found 5 more. Three problems must be fixed before the IC:

1. **Wrong or mislabelled numbers.**
   - The 0.22→0.78 correlation jump is the single devaluation day. Without that day the post-break figure is 0.28.
   - The "nominal 99%" coverage test actually uses a 98% interval. The true 99% coverage is 97.9%.
   - 13 of the 19 decision-matrix totals are miscalculated.
2. **The Phase 1 goal engine is a hidden point forecast.** A raw-history bootstrap is centred on the past mean (24% a year for USD equity in the example). With horizon = sample length, its "11–94%" band is almost fixed by construction (≈Φ(c±1.28)). Doc 8 cannot display it.
3. **The example is not reproducible as instructed.** Under `python3 -I` scipy is absent, and the fallback solver is incorrect. The minimum-variance tables change: LW-constant-correlation goes from 0.13/0.48/0.39 to 0/1/0, and rolling SDs from 25–30 to 38–43 points.
