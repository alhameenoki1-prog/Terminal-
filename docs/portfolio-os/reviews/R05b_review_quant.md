Review of: Document 5b — Quantitative Finance Model-Selection Report (v0.1, 2026-11-02/04)  ·  Reviewer roles: statistics/econometrics professor; practising quantitative portfolio manager; implementing software engineer; lay-user explainer  ·  Date: 2026-11-04  ·  Verdict: **Accept with required changes**

## 1. Verdict and the three most important problems

The central judgement holds: for this user, the job is measurement, not optimisation. I confirmed 19 of the 23 prototype defects in code and found 5 more. Three problems must be fixed before the IC:

1. **Wrong or mislabelled numbers.**
   - The 0.22→0.78 correlation jump is the single devaluation day. Without that day the post-break figure is 0.28.
   - The "nominal 99%" coverage test actually uses a 98% interval. The true 99% coverage is 97.9%.
   - 13 of the 19 decision-matrix totals are miscalculated.
2. **The Phase 1 goal engine is a hidden point forecast.** A raw-history bootstrap is centred on the past mean (24% a year for USD equity in the example). With horizon = sample length, its "11–94%" band is almost fixed by construction (≈Φ(c±1.28)). Doc 8 cannot display it.
3. **The example is not reproducible as instructed.** Under `python3 -I` scipy is absent, and the fallback solver is incorrect. The minimum-variance tables change: LW-constant-correlation goes from 0.13/0.48/0.39 to 0/1/0, and rolling SDs from 25–30 to 38–43 points.

## 2. Findings, severity-ranked

### Blocking

**B1 — §3 F15, §4.9 item 1: the 0.22→0.78 correlation claim is caused by one data point, not by a "shared FX factor".**
- **Claim:** after the devaluation, "a shared currency factor took over" the correlation between NGN equity and the FGN bond in USD terms.
- **Why it is wrong:** in `worked_example_5b.py` line 31 the FX innovation volatility is constant at 6% across the whole sample. Nothing in the generator changes at day 630 except a single +45% jump. The split `pre = R.iloc[:630]`, `post = R.iloc[630:]` puts that jump day in the "post" window. Re-running with day 630 removed from the post window gives a correlation of **0.281**, against 0.221 before. In local currency the figures are −0.056 and 0.108. The 0.78 is therefore one co-movement of roughly 30 standard deviations, not a regime change.
- **Why it matters:** the same artefact will appear on real NGN data, and the risk display must not tell the founder that diversification "collapsed" because of one print.
- **Evidence:** my re-run (scratch script `mv.py`) and code lines 31 and 40–43.
- **Fix:** restate F15 using the published evidence only [S73–S77]. Change the example to show the correlation with and without the break day. Add a rule that every stress-conditional correlation reports its sensitivity to single observations (leave-one-out).

**B2 — §4.7 and §4.10 (rank 6): the Phase 1 goal engine contradicts principle (a), "no point forecast of returns anywhere".**
- **Why it contradicts:** a stationary bootstrap of the raw history has an expected path drift equal to the sample mean. In the example that is 24.4% a year for USD equity and −6.3% for the FGN bond (§4.9 table 1). The drift-shift lines help, but the centre of every displayed range is still the historical mean, which F19 itself says is not a forecast.
- **Fix:** demean the bootstrap, then add back an explicit, labelled, user-editable drift assumption. That assumption could be a CMA-style range from [S117], or zero real return as a neutral case. Show the drift as an input in the assumptions registry (Doc 8 U7).

**B3 — §4.7 and §4.11: the "estimation-uncertainty band" is almost entirely produced by the method, and Doc 8 cannot display it.**
- **Why:** under an iid approximation, P(success | μ̂) = Φ((Hμ̂ − g)/(σ√H)), and μ̂ ~ N(μ, σ²/T). So the 10th–90th percentile of the band is Φ(c ± 1.2816·√(H/T)). With H = T, as in the example, and c ≈ 0.03, this gives **10.5%–90.5%**, which matches the reported 11%–94%. Any goal near the median will show roughly "10–90%", whatever the data. Over a 20-year horizon on 5 years of history (H/T = 4) the band runs from 0.5% to 99.5%.
  - The band therefore mostly reports H/T, not information.
  - The predictive probability that integrates over parameter uncertainty is Φ(c/√2) ≈ 51%. That single number is what Doc 8's "N of 100 futures" dotplot (U1–U2) can show honestly.
  - A band computed from 40 outer replicates also has large Monte Carlo error at the 10th and 90th percentiles (about 4 observations in each tail). No Monte Carlo SE is given for the band.
- **Fix:** report the predictive distribution, with parameter uncertainty integrated, as the main output. Show H/T and the drift sensitivity as the reason for the width. If a second-order band is kept, compute it from at least 500 replicates or analytically, and state its SE. Preserve this as a disagreement: the authors' statistician may prefer the two-level display, while I hold that a lay user cannot act on "somewhere between 10% and 90%". §4.11 currently mandates exactly that sentence.

**B4 — §4.9 and §9.2: the outputs depend on the environment, and the fallback solver is wrong.**
- **What I found:** `minvar_longonly` (lines 65–76) uses scipy SLSQP when scipy imports, and otherwise a "projected-gradient" loop. That loop renormalises after clipping, which is not a Euclidean projection onto the simplex.
  - Under `python3 -I`, as the assignment specifies, scipy (installed in the user site) is not visible. Sections 2, 2b and 2c then differ from the document.
  - Full-sample sample-covariance weights: 0/0.734/0.266 against the document's 0/0.537/0.463. LW-constant-correlation weights: 0/1/0 against 0.134/0.479/0.388. Rolling SDs: 0.385 and 0.429 against 0.27/0.25 and 0.30/0.30.
  - Exhaustive active-set enumeration confirms that the SLSQP numbers are the true optima. The fallback's portfolio variance is 4.25 against 3.61 (sample) and 7.17 against 4.30 (LW-constant-correlation).
  - "Outputs quoted are verbatim" is true only in the author's environment.
- **Fix:** remove the fallback or replace it with an exact solver (an N ≤ 10 active-set QP), and pin dependencies with a lockfile. The golden dataset in §9.2 must record environment hashes.

### Major

**M1 — §4.10 decision matrix: the arithmetic is wrong and one criterion is circular.** Recomputing Σ wᵢ·scoreᵢ with the stated weights gives:
- 13 of 19 totals wrong. Examples: stress 4.35 (document says 4.40); Ledoit–Wolf 3.80 (3.95); bootstrap 3.75 (3.85); calibration 3.95 (4.00); Sharpe rules 3.35 (3.45); mean–variance 1.45 (1.40).
- Phase assignment is not explained by the scores. The Phase 1 "Sharpe display rules" (3.35) score below the Phase 2 risk-budgeting display (3.70).
- "MVP suitability" (weight 0.15) restates the conclusion. If it is dropped and the other weights are renormalised, the bootstrap goal engine falls to 3.53, below risk-budgeting at 3.82.

The matrix decorates the decision rather than making it. **Fix:** correct the totals, drop or define the circular criterion, and state the phase rule (for example, a score threshold plus a gate).

**M2 — §4.7 and §4.10: is the Phase 1 set consistent with "optimisation output is not a forecast"?** Mostly yes. Two exceptions:
- Presentation item (2), "which asset mixes have historically delivered [8.4%] over rolling 5-year windows and how often", is an in-sample search over mixes. It suffers the selection bias that the document's own deflated-Sharpe rule [S104] exists to correct. With 20 years of data there are only 4 non-overlapping 5-year windows.
- The reverse stress test is an optimisation and should be labelled as one.

**Fix:** pre-register a small, fixed set of illustrative mixes; report the number of non-overlapping windows; apply the trial-count rule.

**M3 — §4.7 and Rec 7: PIT and coverage calibration is not feasible for one user as specified.**
- **Timing:** a 5-year goal forecast resolves after 60 months. "24 outcomes" therefore arrive no earlier than month 84, and monthly-issued overlapping forecasts are strongly dependent. PIT uniformity and independence assume non-overlapping or one-step-ahead forecasts [S137]. Berkowitz and Christoffersen tests [S138, S140] lose their size properties under h-step overlap.
- **Power at n = 24 (binomial test, α = 0.05):** when true coverage of a nominal 90% band is 80%, the test rejects only **19%** of the time.
- **False alarms:** under the "within ±10 points" rule, a perfectly calibrated engine fails the 50% band **31%** of the time, and the 90% band 8.5% of the time. "Withdrawn if it fails twice in succession" will therefore trigger on noise.

**Fix:** calibrate the engine's 1-month-ahead distribution of portfolio value, which gives non-overlapping monthly outcomes. Pool across asset series and synthetic backtests. Use exact binomial bounds, not ±10 points. State plainly that goal-horizon calibration cannot be established for one user within the MVP.

**M4 — §4.9 output 7b and F22: the 99% band is mislabelled.**
- Line 198 uses ±2.326, which is the 99th percentile one-sided and so a **98%** two-sided interval. A Gaussian forecaster on variance-scaled t5 covers 97.0% of that 98% interval (scipy, exact). At the true 99% bound (±2.576) coverage is 97.9%.
- The qualitative conclusion survives. The number and the label do not.

**Fix:** correct the code and the text.

**M5 — §4.11 "May say" row 3: a synthetic number is presented as a historical statement.** "In the 2023 naira unification, a portfolio like this would have lost about 31% in USD terms." The 31% comes from the synthetic +45% jump.
- The sources cited for the real event [S85] imply a larger loss. 477 → ~750 in a day is a 36% fall in the USD value of naira assets. Nairametrics (re-fetched 2026-11-04) reports I&E 770.17 on 23 June 2023, which is a 38% fall from 477.
- This is exactly the "plausible but unsourced figure" failure the brief warns about.

**Fix:** use a placeholder or the sourced figure with its as-of date.

**M6 — §4.5: the TWR/MWR spec is not precise enough to code and partly misstates GIPS.**
- Modified Dietz is listed as a fallback for *MWR*. In GIPS practice it is a money-weighted approximation used *within sub-periods* and chain-linked to approximate *TWR*.
- Missing items a developer needs:
  - cash-flow timing convention (start or end of day; the example implicitly uses start of day 10, weight 53/63);
  - calendar-day versus trading-day weights;
  - the definition of an *external* flow in a personal ledger (dividends, coupons, tax, fees and own-account transfers — cross-reference Doc 4);
  - the FX rate and timestamp applied to flows;
  - the large-cash-flow threshold that triggers revaluation;
  - handling of near-zero or negative Modified Dietz denominators;
  - IRR root selection;
  - the GIPS rule against annualising periods shorter than one year;
  - gross versus net of fees.
- The currency decomposition is a single-period identity. Multi-period linking of the cross term (for example, Carino or Menchero smoothing) and the Karnosky–Singer split of the currency return into forward premium and surprise [S79] are absent. The forward premium matters for high-carry NGN.
- GIPS text was never read (§2).

**Fix:** write the pseudo-code contract and a 10-case golden ledger, then have a CIPM- or GIPS-literate reviewer confirm it.

**M7 — §4.4: the reverse stress test is internally inconsistent.**
- "The smallest joint move along the first principal component" fixes the direction in advance, so "smallest" has no metric. The worked sentence ("a 28% naira fall with flat equities") is not a PC1 move.
- The standard formulation minimises Mahalanobis distance subject to loss ≥ threshold, which gives the most plausible severe scenario (Breuer et al. 2009, *IJCB* — not verified by me). Grundke [S94] is a banking bottom-up paper. S65 was never fetched.
- The historical scenarios are well sourced. I re-checked Brent and S&P from FRED and the World Bank FX series (§4). However, the 2008 S&P −57% and the NGX 2008–09 figures remain unsourced, and the scenario windows mix event dates with annual averages.

**Fix:** define the metric and the solver; label PC1 as a simplification; source the 2008 figures.

**M8 — §4.7 and §4.9: the block-bootstrap design is under-specified.**
- **No joint resampling:** the example bootstraps the univariate equal-weight series. The spec must resample joint date-vectors (all assets plus FX on the same dates), or FX co-movement is lost when weights change.
- **Inconsistent break handling:** the devaluation day is *in* the bootstrap sample, so about 63% of 1,260-day paths contain it (1 − (1 − 1/1260)^1260) and some contain it twice. Yet §4.6 says breaks are "isolated as scenarios", and §4.7 adds scenario overlays. Devaluations are double-counted or counted inconsistently. Pick one rule: remove break days and overlay jumps at a stated, user-editable frequency.
- **Block length** is fixed at 20 days without justification. If Politis–White [S124] is used, cite and implement the 2009 correction (Patton, Politis & White, *Econometric Reviews* 28(4), 372–375, doi:10.1080/07474930802459016 — verified, Crossref).
- **Regime drift:** crawling-peg drift differs from post-float drift, and no stationarity check is specified.

**M9 — F2 and §4.6: Ledoit–Wolf saturation is not a break detector, and the "0.02–0.13" figure is on the wrong sample.**
- I confirmed the 1.000 identity intensity, and that the script's `lw_identity` matches `sklearn.covariance.ledoit_wolf` exactly (scikit-learn 1.9.1, maximum absolute difference 0.0, full and break-excluded).
- But 0.023/0.127 are full 1,259-day figures, not T = 250. On break-free 250-day windows the identity intensity is 0.08–0.16, and the constant-correlation intensity ranges up to **1.00 with no break at all**, because the target is close to the sample covariance.
- "Intensity at cap" is therefore not diagnostic.
- Excluding break days from Σ also produces a vol and VaR that ignore the largest observed risk. The spec must say which displayed figures use the break-excluded Σ and which include breaks.

**M10 — Five prototype defects the document misses (see §2a).** These matter because the "rebuild" tests in §9 should cover them.

### 2a. Prototype defect audit (source re-read; `prototype_checks.py` re-run under `python3 -I`, output identical to Appendix A)

| Defect | Status | Code evidence |
|---|---|---|
| D1 Math.random | Confirmed | MonteCarloPanel.tsx 51–52, 67 |
| D2 unscaled t5 | Confirmed | 57–62 return z/√(χ²/5) without √(3/5); applied at 95, 100; variance 1.665 ≈ 5/3, 60% → 77.5% |
| D3 hardcoded GARCH, "fat tails" | Confirmed | 113; note at 554; excess kurtosis 0.30 equals the closed form 3(1−0.93²)/(1−0.93²−2·0.08²) − 3 = 0.31 |
| D5 drift conventions | Confirmed | 100 (μ−½σ²), 123 (μ), 140, 171 |
| D6 μ = 0.05 | Confirmed | 306 |
| D7 "Sharpe" | Confirmed | 229 |
| D8 "Max DD" | Confirmed, with a nuance | 241–242 use P25 and P5, but the comment at 239 says "1 − P5/P50 and 1 − P1/P50": the code and its own comment disagree |
| D9 barrier ignored | Confirmed | 218–223 terminal only; 103 `void`; ×1.75 under-count at 63 d reproduced |
| D10 Cholesky asset 2 | Confirmed | 322–323 keep only `finals1` |
| D11, D12, D13, D14, D18 | Confirmed | 139/555; 140; 159–161; 40–45/292–296; 510 |
| D15 quantile indexing | Confirmed, but mis-scoped | `sorted[floor(N·p)]` is off by one at *every* p, not only the lower tail |
| D21 drawdown | Confirmed, and worse than stated | PerformancePanel 50–63: because `peak` starts at 0, a run of only losses ([−100, −200]) reports **0%** drawdown |
| D22 √252 on trade returns | Confirmed | 42–48, 90–93; Lo SE 0.22 × √252 = 3.49 > 2.34 |
| D23 sizing advice | Confirmed | 313–328; also `profitFactor = Infinity` with no losers (100) satisfies the "Scale position size" branch |

**New defects.**
- N1: entering ρ = 0 silently becomes 0.65 (`parseFloat(corrRho) || 0.65`, 305), while the note at 557 displays 0.00. Vol 0 becomes 0.6 (293).
- N2: |ρ| > 1 is accepted. `cholesky2x2` clamps l22 to 0 (77) and produces an invalid correlation without warning.
- N3: the regime multiplier is on by default (285), so the user's σ is altered unless they opt out. In "crisis", with t5, 60% is simulated as 116%.
- N4: Student-t is available only for GBM (468), yet the label claims "fat tails" for GARCH.
- N5: the all-loss zero-drawdown case under D21 above.

D4, D16, D17, D19 and D20 are as described. Their severity is reasonable.

### Minor

- m1. Raffinot [S43] is noted "online 2016". Crossref gives online 2017-12-22 and print 2018.
- m2. `thin_trading_demo.py` line 25 prints "Daily observed vol is biased down", which contradicts its own output (0.303 → 0.313). The document's prose caveat is correct; the script is not.
- m3. Plain-language copy "cannot tell us the average return to within ±6 points" gives a 1-SE (68%) range to a lay reader. Say "±13 points (95%)" or use a frequency format.
- m4. "NAFEM" (§4.6, Disagreement 3) versus "NFEM" in Docs 5a and 5c. Use the current CBN name.
- m5. `ew = R.mean(axis=1)` averages log returns. On the jump day that is −0.248 against −0.231 for the true rebalanced portfolio. This is disclosed but should be fixed in a golden generator.
- m6. Dimson recovery matches theory: 1 − p^(k+1) = 0.9375 at p = 0.5, k = 3. This is a good check and should become a unit test.

## 3. Evidence-grade audit

| Claim | Graded | Problem | Should be |
|---|---|---|---|
| F15 "0.22→0.78 … shared currency factor" | E1 (bundled with S73–S77) | The synthetic part is an artefact (B1) | Literature E1; delete the synthetic claim |
| F25 prototypes not validated, "E2 (code inspection)" | E2 | The brief defines E2 as a peer-reviewed or official publication; code inspection is not that | E5 plus replication (reproducible script) |
| F22 calibration demo | E1 | The demo's 99% label is wrong (M4) | E1 for the methods; correct the demo |
| F2 "0.02–0.13 on break-free data" | E5 | Wrong sample (M9) | Restate with 250-day ranges |
| §4.3/§4.6 floors (60/250/1,000 d; zero-day < 10%; ρ₁ > 0.2; GARCH ≥ 1,000 d) | Ungraded | Presented as specification facts | E5, each with a test plan |
| §4.7 "until 24 outcomes … uncalibrated"; "±10 points" | Ungraded | Statistically unsupported (M3) | E5 with a power calculation |
| §4.10 matrix | E4 | Arithmetic errors (M1) | E4, recomputed |
| F24 GIPS provisions | E3, with S96 "unverified text" | Acceptable, but the spec is built on it | Keep E3; block coding until the text is read |
| F11 Vanguard 5% bands | E4 | S60 still unreachable (re-fetch 2026-11-04: "Service Unavailable") | Keep E4 |

## 4. Citation and source spot-check

**Academic (Crossref DOI lookups on 2026-11-04; OpenAlex returned "rate limit exceeded"; the hosted reference-lookup MCP timed out twice)**

| Ref | Status |
|---|---|
| S2 Michaud 1989 FAJ 45(1) 31–42 | Verified |
| S5 DeMiguel, Garlappi, Uppal RFS 22(5) 1915–1953 | Verified (online 2007-12) |
| S9 Chopra & Ziemba JPM 19(2) 6–11 | Verified |
| S16 Ledoit & Wolf JMVA 88(2) 365–411 | Verified (print Feb 2004; the "online 2003" note is fine) |
| S28 Caporin & McAleer *Econometrics* 1(1) 115–126 | Verified |
| S33 Idzorek (Elsevier chapter) | Verified by bibliographic query (2007); the DOI resolves via doi.org |
| S43 Raffinot JPM 44(2) | Verified; online-year note wrong (m1) |
| S44 Jaeger et al. JFDS 3(3) 31–51 | Verified |
| S66 Magdon-Ismail et al. J. Appl. Prob. 41(1) | Verified |
| S69 Woerheide & Persson FSR 2(2) 73–85 | Verified (issued 1992-12) |
| S94 Grundke J. Risk Model Validation 5(1) | Verified |
| S98 Lo 2002 FAJ 58(4) | Verified |
| S124 Politis & White 2004 | Verified; **the 2009 correction is missing** (M8) |
| S32/S34 SSRN 334304, 1314585 | Verified |
| **S71 Meucci 2009 "Managing Diversification", *Risk*** | **Not found** in Crossref by title; SSRN DOI 10.2139/ssrn.1358533 returns 404. Remains unverified, and so does "effective number of bets", which feeds a Phase 1 display (§4.3) |
| **S135 Bengen 1994 JFP 7(4)** | **Not found** in Crossref; unverified. Widely cited, but the document's [unverified] tag is correct |
| **S95 Dietz 1966** | Book indirectly confirmed: Crossref holds 1967 reviews of *Pension Funds: Measuring Investment Performance* in J. Finance 22(1) (doi:10.2307/2977326) and J. Risk & Insurance 34(3) |
| **S103 Young 1991 Calmar** | Not found; unverified trade-magazine piece, correctly flagged. Calmar is a Phase 1 display, so its definition should be pinned to the spec, not to this source |

**Non-academic (re-fetched 2026-11-04)**

| Source | Result |
|---|---|
| S84 World Bank PA.NUS.FCRF API | Matches all values (158.6 / 192.4 / 253.5 / 305.8 / 426.0 / 645.2 / 1,479.0 / 1,518.4) |
| S87 FRED DCOILBRENTEU | Matches: 143.95, 33.73, 115.19, 26.01, 70.25, 9.12, 133.18, 76.02 on the stated dates |
| S88 FRED SP500 | Matches: 3,386.15 → 2,237.40 (−33.9%); 4,796.56 → 3,577.03 (−25.4%). It is a price index, not total return; say so |
| S47 Google Patents US6003018A | Filed 1998-09-09, granted 1999-12-14, "Expired – Lifetime", anticipated expiry 2018-09-09 (Google flags status as non-legal) |
| S64 BIS d457 | 14 Jan 2019, corrected 25 Feb 2019, ES-based internal models; 97.5% not on the landing page (as the document admits) |
| S157 scikit-learn LedoitWolf | Target μI, μ = tr(S)/p; cites JMVA 2004; centres by default. Consistent with the script |
| S117 J.P. Morgan LTCMA | 2027 (31st) edition, 10–15-year horizon, data as of September 2026 |
| S85 Nairametrics 24 Jun 2023 | I&E 770.17 (23 Jun) against 663.04 (16 Jun); intraday 815. Supports S85, but undermines the "31%" in §4.11 (M5) |
| S60 Vanguard PDF | Still unavailable |

## 5. Cross-document contradictions

1. **Doc 8 Journey 6** simulates with point parameters ("7% nominal, 11% vol", 20,000 paths) and shows one frequency ("60 of 100"). Doc 5b forbids point drifts in the goal engine and forbids a probability without a band. Doc 8 U1–U4 also needs the "size of adjustment" in currency and months, which 5b does not produce. One display contract is required (see B3).
2. **Doc 5c** sets "official NFEM for valuation". Doc 5b Disagreement 3 lets the user choose the valuation rate, including parallel. These must be reconciled. My proposal: official for the ledger of record, user-chosen as a labelled alternative view.
3. **Doc 5a §4.10** says a stale figure "is excluded from any computed value" and derived figures "inherit the worst freshness". Doc 5b *needs* zero-volume closes as observations (Dimson, weekly aggregation). Doc 5c P1 separates `last_traded_on` from `as_of_date`, and that distinction must be written into the quant input contract. Otherwise every NGX volatility is "stale".
4. **Doc 5a Example 3** makes NGN equities inadmissible for a USD goal. Doc 5b's goal example is 67% NGN. The goal engine needs 5a's admissible-universe filter as an input; no interface is defined.
5. NAFEM versus NFEM terminology (m4). Doc 5c cites Lesmond 1999 as unverified where 5b verifies it.

## 6. Questions the IC needs answered

- If the goal band is about 10–90% for most goals by construction, what decision does the founder make differently because of it? What does the founder see instead?
- What is the base currency, and which FX rate is the ledger of record?
- What exactly is calibrated in the MVP, at what horizon, and with what power? What happens if calibration cannot be established for years?
- Will the "alternative views" stability gate (10-point SD) ever pass on realistic data? If not, say that the optimisation feature requested in System D is deferred indefinitely (brief §5.9).
- Who supplies NGX 2008–09 and S&P 2007–09 series, under what licence and at what cost?
- Is the founder's holding set small enough that the TWR/MWR golden ledger can be hand-reconciled before launch?

## 7. Required changes before the IC (priority order)

1. Correct B1 (correlation artefact), M4 (98% versus 99% label), M5 (the "31%" sentence) and M1 (matrix totals and phase rule).
2. Redesign the goal-engine output (B2 and B3): demeaned bootstrap plus a labelled drift assumption; predictive probability as the headline, in Doc 8 format; H/T and drift sensitivity shown as the reason for the width; a band, if kept, computed with ≥ 500 replicates and a Monte Carlo SE.
3. Fix reproducibility (B4): exact solver, lockfile, environment hash in the golden data; re-run and re-quote §4.9.
4. Write the TWR/MWR/currency coding contract with golden cases, and confirm it against the GIPS text (M6).
5. Specify the joint bootstrap and one break-handling rule; cite the Politis–White correction (M8, M9).
6. Replace the calibration protocol with a feasible 1-month-ahead design and exact binomial thresholds (M3).
7. Define the reverse-stress metric (M7). Add N1–N5 and the D21 all-loss case to the §9 test list. State that golden values must be distribution-level tolerances across the Python and TypeScript PRNGs, not bit-exact.
8. Reconcile with Docs 5a, 5c and 8 (§5 above).

**The never-build list (item 9)** is defensible as it stands: Kelly, edge scores and sizing advice are permanent bans; DCC, HRP and resampling are "not yet". But the ban is driven by objective mismatch, not by score (Kelly 1.60 outranks DCC 1.35), and the document should say so. Add explicitly: auto-rebalancing and order placement, leverage or margin, and any single "probability of success" gauge (agreeing with Doc 8).

## 8. What I could not check

- The GIPS 2020 text, the RiskMetrics 1996 document and the BIS 97.5% level (same gaps as the authors).
- Meucci 2009, Bengen 1994 and Young 1991 in any index. OpenAlex was rate-limited all day and the hosted lookup tool timed out, so all academic checks are Crossref-only.
- The NGX rulebook (S156) and the ±10% price-limit claim.
- The constant-correlation Ledoit–Wolf implementation against a reference (scikit-learn has none), so the 0.985 intensity is unconfirmed.
- Real NGX zero-return fractions.
- Whether TypeScript reimplementations would reproduce the Python results.

All numbers above come from my own re-runs (scratchpad scripts `mv.py`, `lw.py`, `chk.py`, `dm.py`). I modified no file under review or under `src/`.
