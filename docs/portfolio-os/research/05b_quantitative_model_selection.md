```
Document: 5b — Quantitative Finance Model-Selection Report
Department: Quantitative Finance and Financial Engineering  ·  Lead role(s): quantitative portfolio researcher, financial mathematician, statistician, financial econometrician, quantitative risk analyst, optimisation specialist, financial data scientist, financial-engineering specialist
Version: 0.2  ·  Date: 2026-11-04  ·  Status: revised after independent review
Reviewers required: Data Architecture & Market Data (provenance, NGX/DFM/ADX feeds); Product & UX (plain-language outputs); Behavioural Finance (how probabilities are shown); Engineering (Web Worker / test harness); Compliance & Legal (statements the product may make); Tax (after-tax return inputs)
```

> Governing rule from the founder, applied throughout: **"Mathematical sophistication is not sufficient justification for implementation."** Every model below had to pass the five-question test (§8) before it was allowed into Phase 1; most did not.

---

## 1. Executive summary

**Conclusions.**
1. For one individual with a few positions across NGN, AED and USD, the quantitative problem is *measurement under bad data*, not optimisation. Exposure, descriptive risk and a correct performance ledger deliver most of the value with little estimation risk.
2. Mean–variance optimisation is not justified in the Personal MVP: short histories with structural breaks cannot supply the expected returns it needs [S2, S5, S9, S10]. Synthetic rolling minimum-variance weights move with standard deviations of 25–30 points (§4.9). Ledoit–Wolf shrinkage is kept only as a risk input.
3. The Goal Reality Engine follows Contract C6: a demeaned joint bootstrap with drift from a labelled assumption set. The headline is a count. Synthetic example: "about 40 of 100 futures reach $150,000; the middle 80% end between $84,900 and $216,400; 9 of 10 futures reach it with $76,800 more today or about $1,200 a month". The v0.1 "11%–94%" band is withdrawn: the horizon-to-history ratio set it, not the data.
4. Goal-horizon calibration cannot be established for one user within the MVP; 1-month-ahead forecasts are calibrated instead.
5. The prototypes have 27 defects (§4.8).

**Biggest uncertainty.** Whether *any* optimiser belongs in the product (§7). Proposed resolution: none in Phase 1; Phase 2 only behind a stability gate. A close second: which capital-market-assumption source supplies drift, and under what licence.

**Recommendations.**
- *Must-have:* exposure decomposition; risk descriptives with intervals; drawdowns; stress library with a defined reverse stress test; the return coding contract (§4.5); the C6 goal engine; 1-month calibration logging.
- *Later:* Black–Litterman views, risk-budgeting weights, estimated GARCH.
- *Not yet:* unconstrained mean–variance, CVaR optimisation, DCC, HRP, resampling.
- *Never:* Kelly, sizing advice, auto-rebalancing, orders, leverage, a single probability gauge.

## 2. Scope and method

**Questions addressed.** Assignment items A–H:
- portfolio-construction models and their evidence;
- risk measurement;
- performance measurement with cash flows and currencies;
- forecasting and simulation;
- emerging-market data pathologies;
- evaluation of the two prototypes;
- a decision matrix and phased plan;
- a synthetic worked example.

Version 0.2 also answers review R05b and revision-log rows V-015, V-016 and V-017. It adopts Contracts C2 (figure tokens), C3 (status), C5 (FX) and C6 (goal output) from `CANONICAL_CONTRACTS.md`. §11 maps every finding to its resolution.

**What we searched and used.**
- **Academic literature.** Every paper cited was checked against OpenAlex by DOI (scripted batch, 2026-11-02). Where no DOI was known, it was checked by title through the hosted reference-lookup tool or Crossref (2026-11-04). Status is marked **[verified]** (title, first author and year agree; where OpenAlex records the online-first year one year earlier than the print year, we note "print year") or **[unverified]**. The verification logs are in the session scratchpad (`openalex_verification.json`, `openalex_batch2.json`, Crossref log). *v0.2:* the reference-lookup tool timed out on four calls on 2026-11-04, so the new and corrected entries (S43, S124b, S160) were checked against Crossref or the publisher page.
- **Primary data pulled by API** (not search engines). These calibrate the stress scenarios in §4.4.
  - World Bank official exchange rate series for Nigeria (`PA.NUS.FCRF`, annual average NGN per USD, 2005–2025; fetched 2026-11-02).
  - FRED/EIA Brent daily prices and the FRED S&P 500 daily *price* index (fetched 2026-11-02).
- **Primary documents fetched.**
  - Google Patents record of US 6,003,018 (Michaud resampled efficiency; expired).
  - BIS page for *Minimum capital requirements for market risk* (January 2019).
  - scikit-learn `LedoitWolf` documentation.
  - J.P. Morgan Long-Term Capital Market Assumptions landing page (2027 edition, data as of September 2026).
  - *v0.2:* the **text of the 2020 GIPS Standards for Firms** (146-page PDF, extracted with `pdftotext`, 2026-11-04). The provisions used in §4.5 are cited by number.
  - *v0.2:* the International Journal of Central Banking (IJCB) page for Breuer et al. (2009).
  - *v0.2:* two Nairametrics articles on the June 2023 unification, re-fetched 2026-11-04.
- **Web search** (budget-limited; several calls failed on shared rate limits). Used for:
  - NGX market-structure facts (2026 changes to price-movement rules, settlement cycle and trading hours);
  - the June 2016 and June 2023 naira regime changes;
  - NGX All-Share Index annual returns for 2023 and 2024;
  - the RiskMetrics decay factors.

  Where only secondary press sources were reachable, we say so and grade E3/E4.
- **Experiments.** Python 3.13 with numpy 2.5.3 and pandas 3.0.5, pinned in `research/scripts/requirements.txt`. **No script uses scipy** (V-015).
  - `worked_example_5b.py` has no optional code path. It stops if numpy or pandas is missing. It uses an exact active-set solver for long-only minimum variance and checks every solution against the KKT (Karush–Kuhn–Tucker) optimality conditions. It ends by printing the SHA-256 of its own output: `8c0725b9…3b6ba4`. That hash is identical under `python3 -I` and a normal interpreter (checked 2026-11-04).
  - `doc05b_revision_checks.py` and `doc05b_performance_golden.py` use the standard library only.
  - `prototype_checks.py` and `thin_trading_demo.py` are unchanged in method.
  - All scripts are in `/home/user/Terminal-/docs/portfolio-os/research/scripts/`. All seeds are fixed, and the outputs quoted in §4 are verbatim.
  - One-off cross-checks run outside the scripts: the Politis–White block length against `arch` 8.0.0 (identical to 1e-9 on four test series; now embedded in the script as a golden self-test); Ledoit–Wolf identity-target intensity against scikit-learn 1.9.1 (reviewer R05b, maximum difference 0.0).

**What we could not access or verify.**
- The RiskMetrics 1996 Technical Document itself (decay factors 0.94/0.97 confirmed only via secondary sources).
- The BIS standard's internal text. The page confirms expected-shortfall (ES)-based internal models. The 97.5% confidence level is from the standard's published text and was not re-read here.
- SSRN and Duke pages for He–Litterman, Walters and Idzorek returned 403. Those papers were verified through Crossref DOIs instead.
- NGX historical index levels for 2008–2009, and an S&P 500 series for 2007–09 (no API; data-department dependency, §6).
- Current NGX trading hours and price-movement rules. These changed during 2026 and press reports conflict; we state what the sources say and require rulebook confirmation.
- The Political Economist (Reuters) page on the 2023 move (HTTP 502 and a timeout on 2026-11-04).
- Meucci (2009), Bengen (1994) and Young (1991) in any index.
- The constant-correlation Ledoit–Wolf intensity against a reference implementation (none exists in scikit-learn).

We did not read the founder's Drive or Gmail, and nothing under `src/` was modified.

## 3. Findings

Each finding carries an evidence grade (E1–E6 per the brief) and source numbers from §10.

**F1. Estimation error dominates mean–variance output, and the damage is largest in the inputs a personal investor can least estimate: expected returns.** Michaud called the optimiser an "estimation-error maximiser" [S2]; Jobson & Korkie showed sample-based efficient portfolios performing far worse than equal weights out of sample [S3, S4]; Chopra & Ziemba found errors in means roughly ten times as costly as errors in variances for a moderately risk-averse investor [S9]; Best & Grauer showed small mean changes flipping weights [S10]. DeMiguel, Garlappi & Uppal estimated that, for 25 assets, a sample-based mean–variance strategy needs on the order of 3,000 months of data to beat 1/N out of sample [S5]. Counter-evidence exists (Kritzman, Page & Turkington [S6]; Tu & Zhou [S7]; Kirby & Ostdiek [S8]) but it relies on long histories, many assets or shrinkage toward priors — none of which describes a 3–10-position personal portfolio with 1–5 years of broken history. **E1** [S2–S10]. Our synthetic replication (§4.9, exact long-only solver) shows rolling-window minimum-variance weights with standard deviations of 25–30 percentage points, even with *no* return forecasts involved.

**F2. Covariance can be estimated far more reliably than means, and shrinkage is a sound default, but it is not a break detector or a cure for breaks.** Ledoit–Wolf shrinkage toward a structured target is well-conditioned, analytically justified and cheap [S15–S17], with nonlinear extensions for large N [S18]. Factor models help when N is large relative to T [S20–S22]. With N = 3 and T = 250 the sample covariance is already well conditioned, so shrinkage changes the estimate little. On break-free 250-day windows of our synthetic data, the identity-target intensity is 0.08–0.16. The constant-correlation intensity ranges from 0.27 up to **1.00 with no break present**, because that target is then close to the sample covariance (§4.9). On the full 1,259-day sample without the devaluation day, the intensities are 0.023 and 0.127; with it, 1.000 and 0.985. A capped intensity is therefore **not diagnostic of a break** (R05b M9). Breaks are detected from registered event dates and robust outlier tests (§4.6). They are removed from the covariance used for *ordinary-day* diversification figures, but kept in the historical VaR/ES and stress figures, so that the largest observed risk never disappears from the display (§4.3). **E1** for the estimator [S15–S18]; **E5** for the break-handling rule (tested in §4.9, to be re-tested on real data).

**F3. Volatility clustering is real and GARCH(1,1) is hard to beat as a *volatility forecaster* [S24–S26, S29, S30]; but a GARCH engine with hardcoded parameters is not a GARCH model.** Hansen & Lunde found nothing convincingly beating GARCH(1,1) on exchange-rate data [S29]. Parameters must be estimated per series with standard errors and persistence diagnostics; Student-t innovations [S26] must be variance-scaled. The prototype does neither (§4.8). **E1** for the forecasting result; **E2** for the specific critique.

**F4. Dynamic conditional correlation (DCC) adds model risk and interpretation risk without clear benefit for a few assets.** Engle's DCC [S27] is useful for research, but Caporin & McAleer document that its estimates lack established asymptotic properties and that its "dynamics" are often artefacts [S28]. For 3–10 assets, an exponentially weighted (EWMA) correlation with a stated half-life [S23] plus explicit crisis scenarios is more transparent. **E2** [S27, S28].

**F5. Black–Litterman is a disciplined way to *express* views relative to a market prior, not a source of returns.** The model [S31], its intuition [S32] and practical guides [S33, S34, S35] all require a market-capitalisation prior and a risk-aversion scalar; for a Nigerian/UAE/US personal portfolio the "market" is ill-defined and the confidence parameter (Omega/tau) is the dominant and least defensible input. Its value for Portfolio OS is pedagogical: it makes the user state a view and see how far the implied weights move. **E2** for the model's properties [S31–S35]; **E4** (quantitative portfolio researcher) for its product role.

**F6. Risk parity equalises *risk contributions*, not outcomes; its historical performance depended on leverage and a bond bull market.** Maillard, Roncalli & Teïletche give the formal properties (unique solution, weights between minimum-variance and equal-weight) [S36]; Asness, Frazzini & Pedersen explain the return as compensation for leverage aversion [S37]; Anderson, Bianchi & Goldberg and Inker show the result is period-dependent and transaction-cost sensitive [S38, S39]; Lee frames all risk-based allocations as implicit return forecasts [S40]. Unlevered risk budgeting for a three-asset personal portfolio is simply a volatility-scaled weighting — useful as a *display* ("how much of my risk comes from NGN equity?"), not as an allocation engine. **E1/E2** [S36–S41].

**F7. Hierarchical risk parity's out-of-sample advantage is contested and irrelevant at N ≤ 10.** López de Prado's HRP [S42] avoids matrix inversion and is attractive for large N; Raffinot extends it [S43]; Jaeger et al. find that out-of-sample it is not reliably superior to simpler risk-based schemes once costs are included [S44]. With a handful of assets there is no hierarchy to exploit. **E2** [S42–S44].

**F8. Resampled efficiency and robust optimisation reduce weight instability but do not add information; resampling was patented until 2018.** Michaud's resampled frontier [S45] is critiqued by Scherer as an averaging heuristic without a decision-theoretic basis [S46]; the patent US 6,003,018 expired on 9 September 2018 [S47], so there is no IP barrier, only an evidence barrier. Robust optimisation [S48, S49] formalises parameter uncertainty but needs uncertainty sets that are themselves estimates. **E2** [S45–S49].

**F9. CVaR optimisation is sound mathematics (linear-programmable, coherent) but needs tail data that short emerging-market histories do not contain.** Rockafellar & Uryasev [S50, S51]; coherence from Artzner et al. and Acerbi & Tasche [S61, S62]. With 250–1,260 daily observations the 1% tail holds 2–13 points; CVaR *optimisation* over such a tail is fitting noise. CVaR *reporting* from scenario sets is fine. **E1** for the theory; **E4** (quantitative risk analyst) for the data judgement.

**F10. Kelly sizing maximises long-run growth under known probabilities; with estimated probabilities full Kelly over-bets catastrophically, and the growth-optimal criterion is not what most people want.** Kelly [S52]; MacLean, Thorp & Ziemba on the "good and bad properties" and fractional Kelly [S53]; Samuelson's objection [S54]. Not for a personal product. **E1** [S52–S54].

**F11. Transaction costs and rebalancing: the evidence supports threshold-based rebalancing for *risk control*, not for return.** Gârleanu & Pedersen (trade partially toward the target) [S55]; Donohue & Yip and Sun et al. on cost-aware rebalancing [S56, S57]; Dichtl, Drobetz & Wambach find the differences between sensible rebalancing rules are small and mostly a risk-control story [S58]; Perold & Sharpe show rebalancing is a concave (sell winners) strategy that pays in mean-reverting markets and loses in trends [S59]. Vanguard's practitioner guidance (annual/semi-annual monitoring with ~5% bands) could not be fetched and is graded E4 [S60]. For NGX names, round-trip costs and thin books make bands wide. **E2** [S55–S59].

**F12. VaR is a quantile, not a loss estimate; expected shortfall is the regulatory and theoretical replacement, and both are only as good as the tail model and the backtest.** Artzner et al. [S61], Beder's early demonstration that VaR varies several-fold across reasonable methods [S63], and the Basel Committee's move to expected-shortfall-based internal models [S64]. Backtests: Kupiec's unconditional coverage [S139], Christoffersen's independence test [S140]. **E1/E2** [S61–S64, S139, S140].

**F13. Drawdown statistics have a known but wide sampling distribution; a drawdown number without its horizon and sample length is uninterpretable.** The expected maximum drawdown of Brownian motion grows with √T for zero drift and with log T for positive drift [S66]; drawdown-based risk measures (CDaR) exist [S67] and drawdown has only recently been given axiomatic foundations [S68]. Single-path drawdown is one draw from a skewed distribution; the product must say so. **E2** [S66–S68].

**F14. Concentration and diversification metrics are useful descriptives when they carry their definitions.** Herfindahl–Hirschman index (sum of squared weights; 1/HHI is the "effective number of positions") [S69]; diversification ratio (weighted average volatility divided by portfolio volatility) [S70]. The effective number of bets via principal-component entropy [S71] could not be verified in any index (R05b §4). Its definition is therefore pinned in this specification (§4.3: exp of the entropy of the portfolio's variance shares across principal components) and graded E5. It is a secondary diagnostic, not a headline figure. **E3** [S69, S70]; **E5** for the effective number of bets.

**F15. Correlations rise in crises and in the left tail; diversification measured in calm periods overstates protection.** Longin & Solnik (extreme-value evidence that correlation rises in bear markets, not merely in volatile markets) [S73]; Ang & Chen (asymmetric correlations) [S74]; Forbes & Rigobon (part of measured "contagion" is a volatility artefact, which matters for how we display it) [S75]; Chow et al. and Kritzman & Li (turbulence-conditioned risk) [S76, S77]. **E1** [S73–S77]. *Correction (v0.2, R05b B1):* v0.1 claimed that, in our synthetic data, the NGN-equity/FGN-bond correlation rose from 0.22 to 0.78 after the devaluation "because a shared currency factor took over". That was wrong. The generator's FX volatility is constant (6%; measured 0.062 before and 0.058 after), and the 0.78 is produced by **one observation**, the break day. Without it, the post-break correlation is **0.281** against 0.221 before; the leave-one-out influence of that single day is −0.502 (§4.9). The example now illustrates a rule instead: **every stress-conditional correlation is shown with its leave-one-out sensitivity**, and a figure that moves by more than 0.10 when one day is dropped carries a "driven by one day" badge (E5).

**F16. Currency is a separate exposure that must be decomposed, and for NGN it is the dominant risk.** Multicurrency attribution separates local-market return, currency return and their cross term [S78, S79]; the hedging literature [S80–S82] presumes hedging instruments that a Nigerian retail investor largely lacks (offshore non-deliverable forwards and FMDQ naira-settled futures exist for institutions; retail access unknown — founder/data team to confirm); Siegel's paradox means expected currency returns differ by base currency [S83]. **Primary data:** World Bank official annual-average NGN/USD: 192.4 (2015) → 253.5 (2016) → 305.8 (2017); 426.0 (2022) → 645.2 (2023) → 1,479.0 (2024) → 1,518.4 (2025) [S84]. The June 2016 float (peg of 197 abandoned; interbank rate ~254–282 on 20 June 2016) [S86] and the June 2023 unification are the two defining structural breaks. For 2023, Nairametrics reports that the official Investor & Exporter (I&E) window rate fell 29% to ₦664/$ on the first day of unified trading, and closed at ₦770.17/$ on 23 June against ₦663.04/$ on 16 June, with an intraday high of ₦815/$ [S85]. That is a fall of about 29% in the dollar value of naira assets on the first day and about 39% by 23 June (`doc05b_revision_checks.py` [3]). v0.1's "~477 → ~750" is not supported by the sources re-fetched on 2026-11-04 (R05b M5). **E2** for the data [S84]; **E3** for event narratives [S85, S86].

**F17. Oil and global equity shocks are the external stress drivers.** FRED/EIA Brent: $115.19 (19 June 2014) → $26.01 (20 Jan 2016), −77%; $143.95 (3 Jul 2008) → $33.73 (26 Dec 2008), −77%; $70.25 (6 Jan 2020) → $9.12 (21 Apr 2020), −87%; 2022: $133.18 → $76.02, −43% [S87]. S&P 500 (FRED, daily close of the *price* index, not total return): −33.9% peak 19 Feb 2020 to trough 23 Mar 2020; −25.4% 3 Jan to 12 Oct 2022 [S88]. The 2007–09 S&P drawdown is outside FRED's 10-year window. v0.1's "≈ −57%" is unsourced, so it is withdrawn from the scenario library until the data team supplies a licensed series (§6; deferred). **E2** (official data) [S87, S88].

**F18. Thinly traded NGX stocks bias volatility and beta downward; corrections exist and must be applied before any risk number is shown.** Fisher (index autocorrelation from stale prices) [S145]; Scholes–Williams and Dimson estimators [S142, S143]; Lo & MacKinlay's econometrics of nonsynchronous trading [S144]; zero-return-day measures of illiquidity [S90, S91]; Amihud's price-impact ratio [S89]; emerging-market liquidity premia [S92]. Our synthetic demonstration (§4.6): with 50% stale days, OLS beta of a true-beta-1 stock is 0.51; Dimson with ±3 lags recovers 0.94; weekly aggregation 0.84. **E1** for the mechanism [S142–S145]; **E5** for the specific NGX magnitudes (to be measured on real data).

**F19. Returns are weakly forecastable at best; the historical mean is a hard benchmark to beat out of sample, and long-run "capital market assumptions" are judgements, not estimates.** Welch & Goyal [S110], Campbell & Thompson (small gains only with economic restrictions) [S111], Rapach, Strauss & Zhou (combination forecasts) [S112], and the 2024 update [S113]. Even the long-run equity premium is disputed [S114–S116]. Institutional CMAs are published annually on 10–15-year horizons by committees (J.P. Morgan's 2027 edition, data as of September 2026, "over a 10- to 15-year horizon") [S117] — appropriate as *labelled assumptions*, never as forecasts. **E1** [S110–S113].

**F20. Parameter uncertainty widens long-horizon return distributions; the "stocks are safe in the long run" intuition does not survive it.** Pástor & Stambaugh [S128]; Barberis [S129]; Avramov & Zhou survey [S130]; Bodie, Samuelson and Merton on time diversification [S131–S133]. A goal engine that simulates with a point drift understates the dispersion of outcomes. **E1** [S128–S133].

**F21. Bootstrap methods preserve empirical fat tails and dependence without parametric assumptions, but with short samples they cannot create tails that were never observed.** Efron [S121]; block and stationary bootstraps [S122, S123]; automatic block length [S124] with its published correction [S124b]; stylised facts of returns [S125]. Regime-switching models [S118–S120] capture crisis clustering, but add parameters that a few years of data cannot pin down. For a multi-asset portfolio the bootstrap must resample **joint date-vectors** (all assets and FX on the same date). Otherwise the currency co-movement that dominates NGN risk is lost when weights change (R05b M8). **E1** [S118–S125].

**F22. Probabilistic outputs can and must be calibration-tested, but at the goal horizon this is not feasible for one user.** Probability integral transform (PIT) histograms [S136, S137], Berkowitz's likelihood-ratio test [S138], Kupiec/Christoffersen coverage tests [S139, S140], and the calibration-and-sharpness paradigm [S141]. Our demonstration: a Gaussian forecaster on variance-scaled t5 outcomes over-covers the centre (91.3% inside a nominal 90% band) and under-covers the tail: **97.9% inside a nominal 99% band** (exact, closed-form t5 distribution function). *Correction (v0.2, R05b M4):* v0.1 reported 97.1% for the 99% band, but its code used ±2.326, which is a 98% two-sided interval (97.0% coverage). These tests assume non-overlapping or one-step-ahead forecasts [S137], so §4.7 calibrates 1-month-ahead forecasts, not 5-year goals (F26). **E1** for the methods [S136–S141].

**F23. Reported Sharpe ratios need standard errors and, when selected from many trials, deflation.** Lo's standard errors (iid SE ≈ √((1+½SR²)/T) and larger under autocorrelation) [S98]; Jobson–Korkie, Ledoit–Wolf and Opdyke tests [S99–S101]; the deflated Sharpe ratio and the probability of backtest overfitting [S104–S107]. With 20 trade returns, the prototype's annualised "Sharpe" of 2.34 has a one-sigma band wider than the estimate (§4.8). **E1** [S98–S107].

**F24. Time-weighted and money-weighted returns answer different questions; a personal ledger needs both, and cash-flow timing makes them diverge materially.** The 2020 GIPS Standards (text read 2026-11-04 [S96]) require the following:
- time-weighted returns to be geometrically linked, with a valuation at every large cash flow (2.A.23c–2.A.24f);
- returns that adjust for *daily-weighted external cash flows* where daily returns are not calculated (2.A.24d). This is the Modified Dietz approach [S95], an approximation **within sub-periods**, chain-linked to approximate the time-weighted return. It is not, as v0.1 implied, a money-weighted fallback (R05b M6);
- money-weighted returns to be computed from daily external cash flows (2.A.29b);
- returns to be stated after transaction costs (2.A.13);
- no annualisation of periods shorter than one year (2.A.12).

GIPS defines an external cash flow as capital entering or exiting a portfolio, and states that dividend and interest income are not external cash flows. Dichev shows that investors' dollar-weighted returns lag buy-and-hold returns [S97]. Our golden case G2: one month with a contribution equal to the opening value gives a time-weighted return of +1.20% against a money-weighted return of −4.47%, so the two differ in sign. **E3** [S95–S97] (standards-body text, now read). The adaptation of firm-level provisions to a personal ledger is **E5** and must be confirmed by a CIPM- or GIPS-literate reviewer (§9).

**F25. The two prototypes are not validated infrastructure.** There are 27 defects with line references in §4.8 (23 in v0.1, confirmed by R05b, plus 4 found by the reviewer), reproduced numerically. **E5 plus replication** (direct code inspection and a reproducible script). v0.1's "E2" was a mis-grade: E2 is reserved for peer-reviewed or official publications (R05b §3).

**F26. Goal-horizon calibration cannot be established for one user within the MVP; 1-month-ahead calibration can, slowly.** A 5-year forecast resolves after 60 months, and monthly-issued 5-year forecasts overlap and are strongly dependent. With 24 outcomes, an exact binomial test detects a nominal 90% band that truly covers 80% only 19% (equal-tailed test) to 34% (minimum-likelihood test) of the time. Under v0.1's "within ±10 points" rule, a perfectly calibrated 50% band fails 31% of the time. Reaching 80% power on non-overlapping monthly outcomes needs 83 months for one series (`doc05b_revision_checks.py` [2]). **E1** for the statistics [S137–S140]; **E5** for the protocol in §4.7 (R05b M3).

**F27. A reverse stress test needs a metric.** v0.1's "smallest move along the first principal component" fixed the direction in advance, so "smallest" had no meaning (R05b M7). Breuer et al. define plausibility in terms of the risk-factor distribution and search for the worst loss over a plausibility region. They show that setting non-stressed factors to their conditional expectation maximises plausibility [S160]. Our specification (§4.4) uses the Mahalanobis distance under a stated stressed covariance, and labels the result as an optimisation output. **E2** [S160] (abstract read; the full text was not re-read); **E5** for the solver choice.

## 4. Proposed framework / specification for Portfolio OS

### 4.1 Inputs the quant layer requires (and what it refuses to compute without)

| Input | Minimum for Phase 1 | Provenance fields required (per brief §5.1) | If missing |
|---|---|---|---|
| Position ledger (holdings, units, cost, currency, account, dates) | Complete, reconciled by System A | source, as-of, currency, validation status | No risk figure is shown; exposure table shows "unpriced" rows |
| Prices for each holding | Daily closes, ≥ 60 trading days for volatility; ≥ 250 for correlation; ≥ 1,000 for tail/drawdown statistics (floors are E5, §4.3) | venue, timestamp, currency, adjustment status, `as_of_date` **and** `last_traded_on` (Doc 5c P1). A zero-volume close on a trading day with a current `as_of_date` is an observation (a stale *price*, used by Dimson/weekly corrections), not a stale *figure* in the C3 freshness sense. C3 freshness is computed from `as_of_date` | Show the metric with a "short history" badge and a wider interval, or suppress it below the floor |
| FX rates NGN/USD, AED/USD | Daily, per the **C5.1 hierarchy**: CBN Nigerian Foreign Exchange Market (NFEM) central rate for valuation and presentation; the AED/USD peg as a registered reference fact; the user's transacted rates only for the economics of their own exchanges (C1.5). A parallel rate is only a labelled sensitivity line (confidence D) | source, `price_type`, `fixing_date`, `applied_date` (C5.2) | No conversion; the aggregate is marked incomplete (C5.2) |
| Base currency choice | Two views by default, USD and NGN (C5.3, Doc 4 §4.4.7); the goal currency is set per goal | — | — |
| Assumption set for goals (C6) | A registered CMA record that is C3-eligible and licence-permitted, the neutral "zero real return" case, or a user value; every parameter has a source and an as-of date | `assumption_set` id, source, as-of | Goal engine refuses (C6) |
| Admissible-universe flags (Doc 5a) | Per instrument and goal currency, with a reason code | Doc 5a | Goal output shows "admissibility not assessed" |
| Cash flows (deposits, withdrawals, dividends, coupons, fees, tax) | Complete, dated | from the ledger | MWR not computed; TWR shown with "unverified cash flows" badge |
| Benchmark(s) | Optional: NGX ASI, S&P 500, 1-year FGN T-bill, USD cash | licence status per data team | Attribution suppressed |
| Scenario library | Shipped with the product (§4.4), versioned | source series, dates | — |

### 4.2 Portfolio-construction model families: assessment (assignment item A)

Table 4.2a summarises each family on the assignment's criteria. "Suitability (i)" is the founder's own multi-currency, few-asset portfolio; "(ii)" is a future retail product.

| Family | Key assumptions | Data needs | Stability | Lay interpretability | Failure modes | Compute | Suitability (i) / (ii) | Evidence |
|---|---|---|---|---|---|---|---|---|
| Mean–variance (Markowitz) [S1] | Known μ, Σ; quadratic utility or normal returns; one period | μ needs decades [S5]; Σ ≥ 250 d | Very low: weights flip on small μ changes [S9, S10] | Low ("why 0% in X?") | Corner solutions; error maximisation [S2]; leverage of estimation noise | Trivial | Not justified / display-only with constraints, later | E1 |
| 1/N and simple heuristics [S5] | None | None | Perfect | High | Ignores risk differences (e.g. a 60%-vol asset at equal weight) | None | Benchmark for every optimiser; a legitimate default | E1 |
| Constrained / shrunk mean–variance [S11–S14] | As above plus priors/constraints | Σ ≥ 250 d; priors | Moderate | Moderate | Constraints do the work; priors hidden | Trivial | Phase 2 as "alternative view" only | E1 |
| Minimum variance (no μ) [S158] | Σ only | ≥ 250 d | Moderate; still sensitive to Σ regime | Moderate | Concentrates in low-vol assets (bonds, which in NGN carry FX risk) | Trivial | Phase 2 display; never a recommendation | E2 |
| Covariance: sample | Stationarity | T ≫ N | Poor when T/N small | — | Singular for N > T; break-sensitive | Trivial | Input only when T/N > 20 | E1 |
| Covariance: Ledoit–Wolf shrinkage [S15–S18] | Stationarity within window | ≥ 60 d usable, ≥ 250 preferred | Good | — (internal) | Intensity can reach the cap with or without a break, so it is not a break detector (§4.9, F2) | Trivial | **Phase 1 risk input, with the break rule of §4.6** | E1 |
| Covariance: EWMA/RiskMetrics [S23] | Local stationarity; λ fixed (0.94 daily per secondary sources) | ≥ 100 d | Responsive; noisy | Moderate ("recent-weighted") | λ arbitrary; no mean-reversion | Trivial | Phase 1 as a *second* estimate to show disagreement | E3 |
| Covariance: factor-based [S20–S22] | Factor structure | Factor returns for NGX/DFM/ADX — not available with provenance | Good for large N | Moderate | Mis-specified factors | Low | Later (retail product with many names) | E1 |
| Covariance: DCC-GARCH [S27, S28] | Correct GARCH + DCC dynamics | ≥ 1,000 d per series | Fragile | Low | Spurious dynamics; no asymptotics [S28] | Moderate | Do-not-build (yet) | E2 |
| Black–Litterman [S31–S35] | Market equilibrium prior; views with confidence | Market-cap weights of a defined universe; δ, τ, Ω | Depends entirely on Ω/τ | Moderate if framed as "your view vs the market" | Prior ill-defined for NGN/AED/USD mix; confidence is a guess | Trivial | Later (view-expression tool) | E2 |
| Risk parity / risk budgeting [S36–S41] | Risk contributions as the objective; leverage available | Σ | Good | High as a *display* | Return depends on leverage and bond beta [S37–S39]; implicit return forecast [S40] | Trivial | Phase 2 display of risk contributions; no leverage | E1/E2 |
| Hierarchical risk parity [S42–S44] | Hierarchical correlation structure | Σ with N large | Moderate | Low | No advantage at N ≤ 10; cost-sensitive [S44] | Low | Do-not-build (yet) | E2 |
| Resampled efficiency [S45–S47] | MV inputs + resampling | As MV | Smoother weights | Low | Averaging heuristic [S46] | Moderate | Do-not-build | E2 |
| Robust optimisation [S48, S49] | Uncertainty sets | As MV plus set sizes | Good within set | Low | Sets are estimates | Moderate | Do-not-build (yet) | E2 |
| CVaR optimisation [S50, S51] | Scenario set represents the tail | ≥ 1,000 d or a scenario library | Poor with short tails | Moderate ("average of worst 5%") | Fits tail noise | Linear programme | Reporting yes (Phase 1); optimisation later | E1 (theory) |
| Kelly / fractional Kelly [S52–S54] | Known edge and odds; log utility | Edge estimates | Catastrophic under estimation error | Low | Over-betting; drawdowns | Trivial | Do-not-build | E1 |

**Constraints and transaction costs (all families).** Long-only, per-position caps, per-currency caps, minimum trade sizes (NGX board lots) and explicit cost assumptions per venue are mandatory in anything that is ever displayed, because Jagannathan & Ma show constraints act as shrinkage [S11] and because unconstrained output is uninterpretable to a lay user. **Rebalancing** is specified as *threshold monitoring* (e.g. report when a weight drifts more than a user-chosen band, default 5 percentage points absolute or 25% relative — an engineering default, E5) with the cost of the implied trade shown next to the drift. The product does not auto-rebalance.

### 4.3 Risk measurement specification (item B)

| Metric | Definition the product uses | Minimum data | Uncertainty shown | Plain-language label |
|---|---|---|---|---|
| Volatility | Annualised SD of daily log returns in the selected base currency; also EWMA (λ = 0.94) as a second estimate | 60 d (badge) / 250 d | Chi-square CI for iid; wider band if autocorrelation detected | "Typical yearly swing" |
| Downside deviation / Sortino [S102] | Below a user-set minimum acceptable return | 250 d | Bootstrap CI | "Downside swing" |
| VaR / CVaR (historical and scenario) | 1-day and 1-month 95%/99% from historical returns **including break days**, and from the scenario library; parametric VaR *not* shown | 250 d (95%); 1,000 d (99%) | Order-statistic CI; Kupiec backtest once ≥ 250 forecasts exist [S139, S140] | "Loss exceeded about 1 month in 20" |
| Drawdown table | Max drawdown, peak/trough dates, time to recover, current drawdown; per asset, per currency view, and portfolio | 250 d | Note on sampling distribution [S66]; horizon stated | "Worst peak-to-trough fall" |
| Concentration | HHI and 1/HHI by position, issuer, sector, country, currency [S69] | Holdings only | None needed | "Effective number of holdings" |
| Diversification ratio [S70]; effective number of bets (secondary; definition pinned here: exp(−Σ p_k ln p_k), where p_k is the share of portfolio variance on principal component k) | Shown twice: break-excluded and all days | 250 d | Bootstrap CI | "How much diversification you are actually getting" |
| Risk contributions | w_i (Σw)_i / w'Σw | 250 d | Bootstrap CI | "Where your risk comes from" |
| Correlation under stress | Full-sample, EWMA, and conditional on the worst-decile days of a chosen factor (oil, USD/NGN, S&P) [S73–S77] | 500 d | Forbes–Rigobon-adjusted figure shown alongside [S75]; **leave-one-out sensitivity**, with a "driven by one day" badge if dropping any single day moves the figure by more than 0.10 (E5; F15) | "How things move together in bad months" |
| Currency exposure decomposition | For each position: local return, currency return, cross term, in base currency, per §4.5 [S78, S79]; money terms per C5.3; exposure table by currency of denomination *and* of economic exposure (e.g. a USD-earning NGX stock — user-tagged) | Holdings + FX | None | "What happens to you if the naira moves 10%" |
| Liquidity flags | Zero-return-day fraction, Amihud ratio, days-to-liquidate at 20% of ADV [S89–S91] | 60 d of volume | — | "How hard to sell" |

**Which covariance feeds which figure (R05b M9).** Volatility, historical VaR/ES and drawdowns use **all days, including breaks**, because the largest observed risk must stay visible. Diversification ratio, effective number of bets and risk contributions are shown **twice**: on break-excluded data ("ordinary days") and on all days. The goal engine uses the break-excluded joint sample plus the jump overlay (§4.7). In the synthetic example, portfolio volatility is 0.145 with the break day and 0.099 without it, and USD equity's risk contribution is 0.139 against 0.349 (§4.9).

**Floors are engineering assumptions.** Every minimum-data floor in this table and in §4.6 is **E5**. The test plan: simulate the coverage of each displayed interval at its floor on the frozen generator (target within 2 points of nominal), and run the §9 item-5 sensitivity table on real data. A floor is raised if coverage fails.

**Multi-currency decomposition formula** (base currency B, position in local currency L): $1+R_B = (1+R_L)(1+R_{FX})$, so $R_B = R_L + R_{FX} + R_L R_{FX}$. The product reports all three terms; for NGN assets the cross term is not negligible in devaluation months (a +20% local month with a −35% currency month gives −22% in USD: −35% + 20% − 7%).

### 4.4 Stress testing specification

**Historical scenarios (shipped library, versioned, each with source series and dates):**

| Scenario | Window | Shock definitions (source) | Applies to |
|---|---|---|---|
| Global financial crisis | 2007-10 → 2009-03 | Brent −77% (3 Jul 2008 → 26 Dec 2008, daily closes) [S87]. S&P 500 and NGX ASI 2007–09 levels: **not yet sourced** (data team; the v0.1 "≈ −57%" is withdrawn until a licensed series exists) | USD equity, oil-linked NGN equity, FX |
| Oil collapse and 2016 naira float | 2014-06 → 2017-12 | Brent −77% (19 Jun 2014 → 20 Jan 2016) [S87]; NGN/USD annual average 158.6 (2014) → 305.8 (2017) [S84]; one-day interbank move ~197 → 254–282 on 20 Jun 2016 [S86] | All NGN assets in USD view |
| COVID shock | 2020-02 → 2020-04 | S&P 500 −33.9% (19 Feb → 23 Mar 2020) [S88]; Brent −87% (6 Jan → 21 Apr 2020) [S87] | Global |
| 2022 rates shock | 2022 | S&P 500 −25.4% (3 Jan → 12 Oct 2022) [S88]; bond drawdowns (data team) | USD bonds/equity |
| 2023 naira unification | 2023-06-14 → 2023-06-23 (event, I&E daily closes); context 2022–2024 annual averages | I&E window: −29% on the first unified trading day (to ₦664/$); ₦663.04 (16 Jun) → ₦770.17 (23 Jun); intraday high ₦815 [S85]. The fall in the USD value of naira assets is about 29% (first day) and about 39% (to 23 Jun). Annual averages 426.0 (2022) → 645.2 (2023) → 1,479.0 (2024) are context only [S84] | All NGN assets; NGN-denominated goals |

Each scenario record states its **window type** (event-day close-to-close, peak-to-trough on daily closes, or annual average), its price type (for example, S&P 500 *price* index from FRED, not total return) and its source. The shock applied is always the event or peak-to-trough figure; annual averages are context, never the shock (R05b M7).

**Hypothetical scenarios (parametrised; user can edit the magnitudes):** NGN −30%/−50% overnight; AED peg break (AED has been pegged to USD; a peg-break scenario is a low-probability, high-impact hypothetical — E6); oil −50%; US equity −40% with NGN −20% (joint); NGX liquidity freeze (positions marked at a 15% discount and 30-day exit).

**Reverse stress test (R05b M7; an optimisation output, labelled as one).**
- *Factors x:* 1-month log moves in each holding's local price and in each FX rate against the base currency.
- *Covariance Σ:* 1-month covariance estimated on the full sample **including** break days. This is the stressed covariance, and it is stated as such on the output.
- *Value function:* V(x) = Σᵢ vᵢ·exp(xᵢ − x_FX(i)), where vᵢ is the base-currency value of holding i today.
- *Floor F:* the user's stated "unacceptable" value.

Two outputs:
1. **Single-factor breakeven** (no optimisation). The move in one factor that takes V to F: (a) with the other factors flat, and (b) with the other factors at their conditional expectation given that move, which Breuer et al. show maximises plausibility for a partial stress [S160]. Found by bisection and shown in words.
2. **Most plausible joint scenario.** Minimise the Mahalanobis distance d(x) = √(x′Σ⁻¹x) subject to V(x) = F. The set {V ≤ F} is convex (a sum of exponentials), so the minimiser is unique. It is solved by Newton's method on the KKT system, started from the linear (delta) solution x₀ = −ℓ·Σg/(g′Σg), where g = ∇V(0) and ℓ = V(0) − F. The output reports the scenario, d, and "this is the least extreme combination of moves, under the stated covariance, that reaches your floor".

d is a distance, not a probability, so the no-probability rule below still applies. The first principal component is no longer the definition; it may be shown only as a labelled simplification. Grundke [S94] (bank bottom-up methods) and the Basel principles [S65, not fetched] are background only.

*Synthetic example (§4.9 section 5b; floor = a 25% loss over one month on USD 100,000 equal-weighted):*
- naira per dollar +60.0% with everything else flat (d = 9.23); +64.9% with the other factors at their conditional means (d = 9.79). For a *given* FX move, the conditional-mean setting is the more plausible one. Here it needs a larger move, because the stressed covariance links a weaker naira to a small rise in USD equity, which offsets part of the loss. Both lines are shown;
- the most plausible joint scenario is NGN equity −15.8%, USD equity −14.0%, FGN bond −1.2% and naira per dollar +31.6% (d = 7.07).

v0.1's sentence "a 28% naira fall with flat equities" is withdrawn: it was not a first-principal-component move, and no script reproduces it.

Each stress result is shown as a *loss given the scenario*, never with a probability attached, unless the scenario comes from the historical library — in which case the frequency statement is limited to "this happened n times in the last m years".

### 4.5 Performance measurement specification (item C): coding contract

This section is written to be coded from. The GIPS 2020 provisions were read in the standard's text [S96] and are cited by number (E3). Their adaptation from firm composites to a personal ledger is **E5**. **A CIPM- or GIPS-literate reviewer must confirm this contract before coding starts** (§9). Every rule is exercised by a golden case in `doc05b_performance_golden.py`.

**P1. Scope and valuation.** A return is computed for a named scope P (a set of C1 accounts) in a reporting currency B. Each holding is valued as quantity × local price × the C5.1 reference rate for the valuation date (latest fixing on or before that date, C5.2). Inputs must meet C3's descriptive tier, and a stale price carries its badge.

**P2. External flows.** GIPS defines an external cash flow as "capital (cash or investments) that enters or exits a portfolio" and states that "dividend and interest income payments are not considered external cash flows" [S96, glossary]. For a personal ledger:

| Ledger event (Doc 4 / C1) | Treatment | Golden case |
|---|---|---|
| Transfer to or from an account outside P, including the user's own accounts | External flow, dated by the value date of the leg posted to the P account (C1 D8). Money in `Assets:InTransit:*` is outside P | G2, G5 |
| Securities transferred in kind | External flow at the flow date's closing value | — |
| Dividend, coupon or interest received into P | Not a flow: income, part of the return | G6a |
| The same income paid to an account outside P | Income on the payment date, plus an external outflow of the same amount on the same date | G6b |
| Withholding tax deducted at source | Not a flow: income is net of withholding; a reclaimable amount is a receivable inside P | — |
| Commissions, spreads, conversion cost with both legs inside P (C1.5) | Not a flow; they reduce the return (GIPS 2.A.13: returns are after transaction costs) | — |
| Exchange with only one leg inside P | The flow is the amount posted inside P; the conversion cost belongs to the scope that holds both legs | — |
| Custody or advisory fee charged inside P | Not a flow in the net-of-fees return (the default); added back as an outflow in the gross-of-fees view | G7 |
| Personal tax paid out of P | External outflow (E5; Doc 6 to confirm) | — |

**P3. Timing convention.** One convention per scope, recorded with every result.
- `SOD` (default): a flow dated d is in P from the start of d and earns day d's return.
- `EOD`: the flow happens after d's close.
- A flow booked `EOD` on d is economically identical to `SOD` on d+1 (G2 = G3).
- A flow on a non-valuation date moves to the next valuation date (E5).

**P4. Time-weighted return (TWR).** With daily valuations (the default): r_d = V_d / (V_{d−1} + F_d) − 1 under SOD, or r_d = (V_d − F_d) / V_{d−1} − 1 under EOD. TWR = Π(1 + r_d) − 1, geometrically linked (GIPS 2.A.24f).

Without daily valuations (statements only): Modified Dietz within each sub-period, chain-linked (2.A.24d, "daily-weighted external cash flows").

A flow with |F| ≥ 10% of the value before it is a **large flow** (E5; GIPS 2.A.23c leaves the threshold to the firm). The sub-period is split at a large flow, with a valuation at the close before it. If no valuation exists, the result is flagged "approximate: large flow without valuation". In G4 the unsplit figure is −4.49% and the correctly split one is +1.20%.

**P5. Modified Dietz.** R = (EMV − BMV − ΣFᵢ) / (BMV + Σ Wᵢ·Fᵢ), where Wᵢ = exposed days / CD.
- CD = calendar days from start to end, (e − s). Calendar days are used, not trading days.
- Exposed days = (e − dᵢ) + 1 under SOD, (e − dᵢ) under EOD. v0.1's 53/63 weight on trading days is replaced.
- **Not meaningful**, and no number is shown, if the denominator is ≤ 0 or below 5% of gross capital employed, BMV + Σ max(Fᵢ, 0) (E5; G9).
- With BMV = 0, the return starts at the first inflow (G8).

**P6. Money-weighted return (MWR, internal rate of return).** Find the annual effective r solving BMV·(1+r)^(CD/365) + Σ Fᵢ·(1+r)^(exposedᵢ/365) = EMV. The day count is Actual/365 Fixed and flows are daily (GIPS 2.A.29b).
- *Root search:* scan (1+r) on a 4,001-point log grid over [0.01, 101] and bisect every sign change.
- Exactly one root: report it. None, or more than one: report "MWR not uniquely defined" and show TWR and Modified Dietz with a badge (G10 has roots at 10% and 20%).
- A unique root is guaranteed when the coefficients, ordered by exposure, change sign once. This covers ledgers with contributions only or withdrawals only.

**P7. Annualisation.** Periods shorter than 365 days are never annualised (GIPS 2.A.12); the period return is shown. Annualised by mistake, G2 would read −41.62%. For periods of 365 days or more, show both the cumulative and the annualised figure.

**P8. Gross and net.** Net of all fees is the default. The gross-of-fees view adds back only itemised custody or advisory fees. Transaction costs are never added back (2.A.13).

**P9. Precision.** Money is exact (C1 D6). Returns are computed in exact rationals or decimals with at least 28 significant digits, and rounded once, at display (2 dp, half-even).

**P10. Why both TWR and MWR are shown.** GIPS 1.A.35 limits money-weighted presentation to firms that control their clients' cash flows. In a personal ledger, the investor controls the flows, so MWR measures their own experience. It is shown next to TWR, and the gap is labelled "timing effect" [S97] (E4 adaptation).

**Currency decomposition.**
- *Money terms, portfolio level:* Contract **C5.3** is binding: flows, conversion cost, market and FX translation, with an exact identity and a render-time sign check. Doc 5b does not restate it.
- *Return terms, per position:* daily 1 + R_B = (1 + R_L)(1 + R_X), where R_X = x_d/x_{d−1} − 1 and x is base units per local unit from the C5 rate set. Over several days, the local and currency factors are chain-linked separately. The identity R_B = R_L + R_X + R_L·R_X then holds **exactly** for the cumulative figures, so no smoothing is needed at position level (G11).
- *Portfolio-level arithmetic attribution:* summing position contributions across periods needs Carino or Menchero linking. It is deferred together with Brinson attribution (Rec 13).
- *Karnosky–Singer split* [S79] of R_X into a forward premium and a surprise: (1 + R_X) = (1 + fp)(1 + surprise), with fp = (1 + i_B·τ)/(1 + i_L·τ) − 1 from the short-rate differential (G12). This matters for high-carry NGN: much of a naira holding's currency "loss" is the expected depreciation priced into its interest rate. **Phase 2**, because it needs C3-eligible short-rate series in both currencies (owner: Doc 5c).

**Golden ledger** (`doc05b_performance_golden.py`; output verbatim):

```
=== Golden ledger (synthetic; calendar days; all values in the reporting currency) ===
G1 no external flow: CD=28 SOD | TWR +3.54% | MD +3.54% | MWR +3.54% [period (not annualised)]
G2 inflow SOD, signs differ: CD=31 SOD | TWR +1.20% | MD -4.49% | MWR -4.47% [period (not annualised)] | large flow(s) on 2026-03-17
G3 same flow booked EOD day 15: CD=31 EOD | TWR +1.20% | MD -4.49% | MWR -4.47% [period (not annualised)] | large flow(s) on 2026-03-16
G4 statements only: MD whole period -4.49% (large flow -> approximate) | split at the flow and linked +1.20% (= TWR of G2)
G5 withdrawal 400 SOD day 11: CD=30 SOD | TWR -0.07% | MD +5.10% | MWR +5.09% [period (not annualised)] | large flow(s) on 2026-06-11
G6a dividend kept in P: CD=31 SOD | TWR +2.00% | MD +2.00% | MWR +2.00% [period (not annualised)]
G6b dividend paid outside P: TWR with payout as external outflow (EOD) +2.00% | if the payout is missed +0.00% | MD +2.03%
G7 fee 5 on day 20: net-of-fees TWR +2.539% | gross-of-fees TWR +3.044% (transaction costs are never added back)
G8 inception (BMV 0): CD=31 SOD | TWR +6.39% | MD +6.39% | MWR +6.39% [period (not annualised)]
G9 withdraw 99% then +100%: CD=30 SOD | TWR +100.00% | MD not meaningful (denominator 43.00 vs gross capital 1,000.00) | MWR +21.64% [period (not annualised)] | large flow(s) on 2026-02-02
G10 sign-changing flows over 730 days (EOD): 2 roots: MWR not uniquely defined | roots +10.00%, +20.00% | displayed: no MWR; TWR/MD shown with a badge
G2 annualised by mistake would read -41.62% (forbidden, GIPS 2.A.12)

=== Currency decomposition (position level, exact) ===
G11 cumulative: local +6.11% currency -28.57% cross -1.75% = base -24.21%; identity exact: True
G12 currency return -28.571% = forward premium -0.1313% (i_NGN 20%, i_USD 4%, simple, 3 days) x surprise -28.478%; exact: True
```

**Risk-adjusted ratios and attribution.**

| Measure | Method | When shown | Standard error / caveat |
|---|---|---|---|
| Sharpe, Sortino, Calmar | Excess over a *stated* cash rate in the base currency (USD T-bill, FGN T-bill or AED deposit; founder to confirm which). Sortino against a stated minimum acceptable return [S102]. **Calmar** is defined by this specification, not by [S103]: annualised TWR divided by \|maximum drawdown\|, both over the same window of daily closes, with a window of at least 36 months | Only with ≥ 36 monthly or ≥ 250 daily observations | Lo (2002) SE [S98] printed next to the ratio. An autocorrelation-adjusted SE is used when the Ljung–Box test rejects. The product says "not statistically distinguishable from zero" when \|SR\| < 2 SE |
| Deflated Sharpe ratio [S104] | Applied to any backtested or strategy-selected figure the research module produces, including the illustrative mixes of §4.7 | Research outputs only | Number of trials must be logged |
| Attribution (Brinson) [S108, S109] | At the level of *asset class × currency* only (allocation, selection, currency); security-level attribution suppressed for < 20 holdings; Carino/Menchero linking | Later, when a licensed benchmark exists | Benchmark choice stated |

### 4.6 Emerging-market data pathologies and required fixes (item E)

| Pathology | Effect on models | Detection | Fix | Minimum data quality by model |
|---|---|---|---|---|
| Thin trading / zero-return days | Volatility and beta biased down; correlations biased toward zero [S142–S145] | Zero-return-day fraction; volume = 0 flags | Dimson aggregated coefficients (±2–3 lags) for beta; weekly or monthly aggregation for volatility and correlation; show both | Volatility: daily only if zero-day fraction < 10%, else weekly; beta: Dimson always on NGX |
| Stale prices in indices and funds | Autocorrelated, smoothed returns; understated risk [S145, S151, S152] | Significant lag-1 autocorrelation | Unsmoothing (Geltner/Getmansky) for fund NAVs; disclose | Any series with ρ₁ > 0.2 is flagged "smoothed" |
| Non-synchronous closes across time zones | Daily cross-market correlations biased down [S146, S147] (NGX closes before US cash open; DFM/ADX close hours earlier still) | Lead–lag cross-correlations | Use 2-day or weekly returns for cross-region correlation; never mix daily closes across regions in Σ | Cross-region Σ: weekly only |
| Survivorship | Overstated historical returns of "the market" [S148] | Compare constituent lists over time | Use total-return indices with documented methodology; flag back-filled data | Any backtest must state the universe-as-of date |
| FX conversion | Mixing official (CBN NFEM), interbank and parallel rates creates fictitious returns | Rate source per observation | One rate source per series, per the **C5.1 hierarchy**; the user's transacted rate only for the economics of their own exchanges (C1.5) | — |
| Short histories | Tail and drawdown statistics undefined; shrinkage targets dominate | T below floors in §4.3 | Suppress or badge; use scenario library instead of empirical tails | Per-metric floors in §4.3 |
| Structural breaks (devaluations, policy regimes) | Estimates average across regimes; one day can dominate a correlation (F15) or a fourth-moment estimate (F2) | A **registered break list**: official devaluation and unification dates (C3.5 world facts), plus any day with a robust (median/MAD) FX z-score above 8 that the data team confirms (E5). Bai–Perron tests on longer series [S149]; window-selection logic [S150]. Shrinkage intensity is **not** used as a detector | **One rule everywhere:** a break day is removed from ordinary-day estimates and the goal engine's bootstrap sample, kept as a jump vector, and overlaid in the goal engine as a compensated jump at a stated, editable frequency (§4.7). It stays in historical VaR/ES, drawdowns and stress scenarios (§4.3). Σ is estimated on the post-break window when ≥ 120 d exist; otherwise both windows are shown | — |
| Price limits and circuit breakers | Truncated return distributions on limit days (NGX ±10% daily limit per its market-structure page; tiered minimum-volume rules for price changes were revised during 2026 and press reports on the effective date conflict [S156]) | Returns equal to the limit | Flag limit days; do not treat as ordinary observations | — |

All minimum-data thresholds in this table (zero-day fraction < 10%, ρ₁ > 0.2, the 120-day post-break window, weekly-only cross-region Σ) are **E5**, with the test plan in §4.3 and §9.

**Thin-trading demonstration** (`thin_trading_demo.py`, output verbatim; v0.2 also prints the unit-test value 1 − p^(k+1) = 0.9375 at p = 0.5, k = 3, which the Dimson k=3 column matches within sampling error):

```
stale prob  obs vol true vol  OLS beta Dimson k=1 Dimson k=3 weekly beta zero-day frac
       0.0    0.303    0.303     0.967      1.005      0.987       0.973          0.00
       0.3    0.304    0.303     0.674      0.932      0.982       0.902          0.29
       0.5    0.308    0.303     0.510      0.744      0.937       0.844          0.49
       0.7    0.313    0.303     0.322      0.580      0.818       0.664          0.69
OLS beta is biased toward zero as staleness rises; Dimson lags and weekly aggregation recover most of the bias at the cost of precision. Observed daily vol is NOT understated here, because this generator recovers every missed move on the next trading day; in real thin markets incomplete catch-up also biases daily vol down (Doc 5b §4.6).
theory 1 - p^(k+1) at p=0.5, k=3: 0.9375
```

(In this generator the missed moves are recovered in full on the next trading day, so total variance is preserved and observed volatility is not understated; in real thin markets stale quotes are *not* fully caught up within the sample window, and daily volatility is also biased down [S142, S145]. The beta bias is the robust result.)

### 4.7 Forecasting and simulation specification (item D): the Goal Reality Engine

**Binding contract.** Contract **C6** governs the method requirements, the fields the engine returns, and what the UI may and may not display. This section gives Doc 5b's implementation and adds nothing that conflicts with C6. v0.1's design centred the bootstrap on the historical mean (24.4% a year for USD equity and −6.3% for the FGN bond in the example) and headlined an "estimation-uncertainty band". It is **withdrawn** (R05b B2, B3; V-017).

**Why v0.1's band was withdrawn.** Under an i.i.d. approximation, P(success | μ̂) = Φ((Hμ̂ − g)/(σ√H)), and μ̂ ~ N(μ, σ²/T). The 10th–90th percentile band of that probability is therefore Φ(c ± 1.2816·√(H/T)).
- With the horizon equal to the history (H = T), any goal near the median gives a band of about 10%–90%, whatever the data say. At H/T = 4 it runs from 0.5% to 99.5% (`doc05b_revision_checks.py` [4]).
- On the example's daily-rebalanced portfolio the analytic band is 14%–93%. With v0.1's mean-of-logs series it is 10.5%–90.5% (R05b), against the 11%–94% that v0.1 reported from 40 outer replicates.
- The predictive probability, which integrates over the drift uncertainty, is the single number a person can act on: Φ(c/√(1 + H/T)).

**Principles.**
- (a) No point forecast of returns anywhere (F19). The drift is a labelled assumption with a source and an as-of date, never a historical mean.
- (b) Every goal output carries the C6 fields: success count with Monte Carlo SE, quantiles, adjustment, drift sensitivity and the reason for the width.
- (c) Optimisation output is never a forecast. The reverse stress test is labelled as an optimisation (§4.4).
- (d) Every forecast is logged for calibration (below).

**Engine choice.**

| Engine | Keeps | Loses | Verdict |
|---|---|---|---|
| GBM with point μ, σ | Simplicity | Fat tails, clustering, parameter uncertainty [S125, S128] | Allowed only as a *labelled benchmark path*, and as the analytic cross-check below |
| Student-t / GARCH [S26] | Tails, clustering | Needs estimated parameters and ≥ 1,000 d; unstable on NGX data | Phase 2, only with estimation + diagnostics |
| Regime switching [S118–S120] | Crisis clustering | Many parameters; regime identification from short data is unreliable | Not yet |
| IID bootstrap [S121] | Empirical tails | Dependence | — |
| Stationary bootstrap of joint date-vectors, demeaned [S122–S124b] | Empirical shape, tails, cross-asset and FX dependence | Drift (supplied by the overlay); tails never observed (supplied by the jump overlay and the scenario library) | **Phase 1 engine** |
| Scenario trees (deterministic) | Transparency | Probability | **Phase 1**, alongside the bootstrap |

**Implementation.**

| Step | Rule | Grade |
|---|---|---|
| G-1 Inputs | The holdings mix (actual or user-specified); per-asset daily local returns and daily log changes of FX against the goal currency, on a common calendar (C5.2); every input in C3's *conclusion-driving* tier; Doc 5a admissible-universe flags, which are displayed and never silently applied (§6) | C3, C6 |
| G-2 Break days | Days on the registered break list (§4.6) are removed from the sample. Each is kept as a **jump vector** (every asset and FX on that date) | C6, E5 |
| G-3 Joint resampling | Stationary bootstrap [S123] of **date-vectors**: all assets and FX from the same date, so FX co-movement survives any change of weights | E1 method |
| G-4 Demeaning | Each column is demeaned on the break-free sample. The bootstrap supplies shape (volatility, tails, dependence), never drift | C6 |
| G-5 Block length | Politis–White [S124] with the corrected constant D_SB = 2ĝ(0)² of Patton, Politis & White [S124b], computed on each column and on its squares (to keep volatility clustering). Take the maximum, clipped to [5, 60] days. The implementation equals `arch` 8.0.0 to 1e−9 (golden self-test in the script) | E1 / E5 (clip) |
| G-6 Drift | From the assumption set: a registered CMA record (C3-eligible, licence-permitted), the neutral "zero real return" case, or a user value. Per path, each asset's drift and the FX drift are drawn from N(central, sd), independently (E5; a correlated-drift variant is a §9 sensitivity) | C6 |
| G-7 Jumps | Poisson arrivals of the stored jump vector at a stated, editable rate (placeholder 0.10 a year). **Compensated:** the diffusive drift is reduced by λ·J, so the expected log return equals the assumption. Jumps add tail, not mean. This avoids double counting against an FX-depreciation assumption that already includes devaluations | E5 |
| G-8 Portfolio and paths | Fixed weights, rebalanced daily in simple returns: log Σ wᵢ·exp(rᵢ). Contributions at the start of months. At least 10,000 paths; seed, engine version and assumption-set version recorded (C1-I9) | C6 |
| G-9 Stationarity check | Compare each column's demeaned volatility between the first and second halves. A ratio outside [0.67, 1.5] means: use the latest regime only (needs ≥ 36 months), or refuse. This covers the crawling-peg versus float problem; drift differences between regimes no longer matter, because drift comes from the overlay | E5 |
| G-10 Outputs | The C6 field list. `adjustment` is computed on the same paths: lump sum = goal/q10(growth) − V₀; monthly contribution by bisection on q10 of terminal wealth; delay = the first extra month at which q10 reaches the goal, searched to +60 months, else "> 60" | C6 |
| G-11 Refusal | The C6 conditions. Our addition: a goal portfolio with an asset that is inadmissible under Doc 5a is shown with that flag, not refused | C6 |
| G-12 Validation | An analytic cross-check of the simulated mean log wealth: drift + rebalancing term + jump convexity (§4.9: 0.313 simulated against 0.314 analytic) | E5 |

**Illustrative mixes (R05b M2).** v0.1's presentation item, "which asset mixes have historically delivered the required return", was an in-sample search over mixes, so it carried the selection bias that the deflated Sharpe ratio exists to correct. It is replaced by a **pre-registered set of at most four mixes**, fixed before any data are seen:
1. the user's current holdings;
2. 100% USD cash;
3. 60/40 USD equity / USD bonds;
4. equal weight across the user's asset classes.

The display states the number of non-overlapping windows (4 five-year windows in 20 years of data; 1 in the 5-year example), counts each mix as a trial [S104], and never labels a mix "best".

**Presentation (to Doc 8, per C6 and C2).** In the product, every value below is a C2 token rendered from the engine output; the text is shown rendered.
> "About **40 of 100** simulated futures reach $150,000 in 5 years. In the middle 80% of futures you would end with between **$84,900 and $216,400** (before inflation). To reach the goal in 9 of 10 futures you would need **$76,800 more today**, or about **$1,200 a month** more; waiting alone does not get there within 10 years. If returns are 2 points a year lower: about 30 of 100. If 2 points higher: about 50 of 100. This uses assumption set ASM-SYN-01 (editable). It is not a forecast."

The display also carries:
- the 20-dot plot (C6);
- the width reason, H/T = 1.00 (C6);
- the history base rate, "1 of 1 non-overlapping 5-year windows, history, not a forecast";
- calibration status `uncalibrated`.

Sequence risk is shown as the difference between contributions timed early and late [S134, S135].

**Calibration protocol (replaces v0.1's "24 outcomes, ±10 points" rule; R05b M3).**
- *What is calibrated:* the same engine's **1-month-ahead** predictive distribution of portfolio value, issued at each month-end. These outcomes do not overlap, so their PIT values are approximately independent [S137].
- *Pooling:* the user's portfolio, each held asset series, and synthetic backtests on the frozen generator, where the truth is known. Pooled series share the FX factor, so pooling raises the effective sample by less than the number of series. This is reported.
- *Tests:* PIT histogram and Berkowitz [S138]; coverage of the 50% and 90% central bands with **exact Clopper–Pearson 95% intervals**. The ±10-point rule is dropped.
- *Power, stated in the product's methods page:* with 24 monthly outcomes, a nominal 90% band that truly covers 80% is detected 19% (equal-tailed test) to 34% (minimum-likelihood test) of the time. 80% power needs 83 outcomes (6.9 years) for one series, or 21 months if four independent series could be pooled. v0.1's rule would fail a perfectly calibrated 50% band 30.7% of the time (`doc05b_revision_checks.py` [2]).
- *Status:* `uncalibrated` until at least 60 non-overlapping pooled outcomes exist (E5).
- *Withdrawal:* the band display is withdrawn, and the cause investigated, when the Clopper–Pearson interval for the 90% band excludes 0.90 on at least 60 outcomes.
- **Calibration at the goal horizon (5-year outcomes) cannot be established for one user within the MVP.** The product says so through `calibration_status`, and §7 records it.

### 4.8 Evaluation of the existing prototypes (item F)

Files: `/home/user/Terminal-/src/components/MonteCarloPanel.tsx` (563 lines) and `/home/user/Terminal-/src/components/PerformancePanel.tsx` (331 lines). Both were written for a day-trading dashboard (single-asset price targets, closed-trade statistics), not for a multi-currency personal portfolio. Defects are numbered. Severity: **H** (wrong number shown to a user), **M** (misleading or unvalidated), **L** (engineering). R05b re-read the code and re-ran `prototype_checks.py`, and confirmed all 23 v0.1 defects. It also extended D8, D15 and D21 and found D24–D27 (checked again by us in the source on 2026-11-04).

| # | Location | Defect | Sev. | Numerical evidence (`prototype_checks.py`) |
|---|---|---|---|---|
| D1 | `MonteCarloPanel.tsx` 49–69 (`Math.random`) | Non-seedable RNG: results are irreproducible; no golden tests possible; no antithetic/common random numbers across models | H | — |
| D2 | 57–62, 95 | Student-t(ν=5) innovations are not variance-scaled (variance ν/(ν−2) = 5/3). A user-entered σ is simulated at σ·√(5/3) | H | sample variance 1.665; a 60% input simulates as ≈77.5% |
| D3 | 113–114 | GARCH α = 0.08, β = 0.85 hardcoded, not estimated; no standard errors; "fat tails" claimed (554) but daily excess kurtosis is only ≈0.3 | M | realised vol 0.601 vs target 0.600; excess kurtosis 0.30 |
| D4 | 127 | Variance clamped at 4σ²: an arbitrary truncation of the volatility distribution (immaterial at these parameters but silently alters the model) | L | identical moments with and without clamp at α+β = 0.93 |
| D5 | 100 vs 123 | Drift conventions differ across engines: GBM uses μ − ½σ², GARCH uses μ (no Itô correction), OU uses a horizon-dependent θ; the same "μ" therefore means a different expected price in each model | M | — |
| D6 | 306 | μ = 0.05 hardcoded; not estimated, not user-visible, not currency-specific; applied to BTC and S&P alike | H | — |
| D7 | 229 | "Sharpe" is mean/SD of the *simulated terminal cross-section*, annualised by √(252/h), with no risk-free rate and no data: it restates μ/σ of the inputs | H | 0.270–0.300 for σ = 18%; 0.059–0.076 for σ = 60% (≈ 0.05/σ) |
| D8 | 238–242 | "Max DD P50/P95" are 1 − P25/P50 and 1 − P5/P50 of *terminal prices*: a dispersion statistic, not a drawdown. The comment at 239–240 says "1 − P5/P50 and 1 − P1/P50", so the code and its own comment disagree | H | 252 d: prototype 34%/63% vs true path median 50%, 95th pct 76% |
| D9 | 218–223, 103 | P(target)/P(stop) use terminal values only; `entry/target/stop` are explicitly `void`ed inside the path loop, so barrier hits during the horizon are ignored | H | P(stop −10%) at 63 d: terminal 40% vs path 71% (under-count ×1.75) |
| D10 | 184–202, 322–323 | Cholesky mode simulates two assets but returns only `finals1`; asset 2 and ρ have no effect on any displayed number | H | — |
| D11 | 139, 555 | OU half-life comments inconsistent and in mixed units (ln2/κ = 0.347 y = 87 trading days = 126 calendar days) | L | computed |
| D12 | 140 | OU long-run mean θ depends on the chosen horizon (`mu*horizon/252`), so the model changes when the user changes the display horizon | M | — |
| D13 | 159–161 | Merton λ, μ_J, σ_J hardcoded; no estimation or source | M | — |
| D14 | 40–45, 292–296 | Regime multipliers 0.85/1.0/1.2/1.5 are arbitrary constants applied multiplicatively to σ; no estimation, no source, no uncertainty | M | — |
| D15 | 225, 233–236 | Quantile indexing `sorted[floor(N·p)]` is off by one position at **every** p where N·p is an integer (index 5,000 instead of 4,999 for the median at N = 10,000); VaR uses the 501st value | L | check [11] |
| D16 | 248–251 | VaR/CVaR reported in price units per one unit of asset, unlabelled by currency; not scaled to position size | M | — |
| D17 | 226–231 | Skewness/kurtosis of simple terminal returns with population (1/N) estimators; no standard errors; colour thresholds (541–542) arbitrary | L | — |
| D18 | 510 | "Fan chart" bar heights `[25,48,80,52,28]` are hardcoded: the chart is decorative, not data-driven | H | — |
| D19 | 298–328 | 10,000 × horizon steps run synchronously on the main thread after a 50 ms `setTimeout` (2.5 M normal draws for 1 y; 15 M with Student-t). No Web Worker, no progress, no cancellation | M | — |
| D20 | whole file | No Monte Carlo standard errors shown | M | at N = 10,000, 21 d, σ = 60%: SD of P5 price ≈ 0.4%; SD of P(profit) ≈ 0.6 pt |
| D21 | `PerformancePanel.tsx` 50–63 | Drawdown computed on cumulative realised P&L with `peak` starting at 0: the denominator is the P&L peak, not account equity. A run of only losses never raises `peak`, so it reports **0%** | H | [+50, −100, +30] on a 10,000 account → 200% reported, true 1.0%; [−100, −200] → 0% reported, true 3.0% (check [10]) |
| D22 | 42–48, 90–93 | "Sharpe" from the last ≤ 20 per-trade returns, annualised by √252 as if each trade were one day; no risk-free rate; holding periods ignored; no SE | H | 20 trades, mean 1%, SD 5% → "2.34"; Lo SE of the raw ratio ≈ 0.22 per period |
| D23 | 313–328, 165–170 | "NEXUS Performance Assessment" issues sizing advice ("Scale position size") from ≥ 5 trades; composite edge score weights 0.6/0.4 arbitrary; USD sign hardcoded (144); no cash flows, no TWR/MWR, no currency | H | — |
| D24 | `MonteCarloPanel.tsx` 305, 293, 557 | `parseFloat(corrRho) \|\| 0.65`: an entered ρ = 0 silently becomes 0.65, while the note at 557 displays 0.00. Volatility 0 becomes 0.6 the same way | H | — |
| D25 | 72–78 | \|ρ\| > 1 is accepted; `cholesky2x2` clamps l22 to 0 and produces an invalid correlation without warning | M | — |
| D26 | 285, 292–296 | The regime multiplier is on by default, so the user's σ is altered unless they opt out. In "crisis" with Student-t, 60% is simulated as about 116% | H | 1.5 × 1.29 × 60% |
| D27 | 468, 554 | Student-t innovations are available only for GBM, yet the GARCH label claims "fat tails" | M | — |

**What a validated implementation needs.** (1) A seedable, tested PRNG (e.g. a counter-based or xoshiro generator with a Ziggurat/Box–Muller normal) with golden-value tests against a reference implementation. (2) Unit tests with analytic cases: GBM terminal log-price mean and variance; Student-t variance after scaling; GARCH unconditional variance ω/(1−α−β); Merton compensator (E[S_T] = S₀e^{μT}); OU stationary variance σ²/(2κ); barrier probability for Brownian motion with drift (reflection-principle closed form) against the path simulator; Modified Dietz and TWR on hand-computed ledgers; max drawdown on a hand-built path. (3) Golden datasets: a frozen synthetic ledger with known TWR/MWR/drawdown; a frozen return panel with known Ledoit–Wolf intensity (cross-checked against scikit-learn's `LedoitWolf` [S157]). (4) Estimation, not constants: GARCH/jump parameters fitted by maximum likelihood with reported standard errors, or the model is not offered. (5) Monte Carlo error bars on every reported quantity; Web Worker execution with cancellation; results cached by (inputs, seed). (6) Separation of engine from UI so the same code runs in CI. (7) *v0.2:* regression tests for D21's all-loss case and for D24–D27 (input parsing must never replace a legitimate zero; |ρ| ≤ 1 must be enforced with an error, not clamped). (8) *v0.2:* golden values for any random output are **distribution-level tolerances**, for example a quantile within 3 Monte Carlo standard errors. They are not bit-exact, because the Python reference and a TypeScript implementation will use different pseudo-random generators. Deterministic outputs (TWR, MWR, Ledoit–Wolf, minimum variance, block length) are compared at 1e−9.

### 4.9 Worked example with synthetic data (item H)

Script: `/home/user/Terminal-/docs/portfolio-os/research/scripts/worked_example_5b.py` (numpy 2.5.3 and pandas 3.0.5 only; seeds 5, 20261104 and 7; runtime about 5 s). **All parameters are assumptions, not estimates of any real market.**
- *Assets:* an NGN equity-index proxy (local vol 20%, 35% stale days), a USD equity proxy (vol 16%) and an FGN bond proxy (local vol 5%, high nominal carry).
- *FX:* USD/NGN drifts 12% a year with a **constant** 6% volatility, plus a one-day +45% jump at day 630 (−31% in the USD value of naira assets).
- *Innovations:* variance-scaled t5. Base currency USD.

*What changed in v0.2:*
- the exact minimum-variance solver;
- the true daily-rebalanced equal-weight portfolio (R05b m5: −0.218 on the break day against −0.237 for the v0.1 mean of log returns);
- correlation with and without the break day;
- Ledoit–Wolf intensities on break-free 250-day windows;
- the C6 goal engine;
- the reverse stress test;
- the correct 99% band;
- an output hash.

The DGP and its draws are unchanged, so sections 1, 2a–2c and the per-asset drawdowns reproduce v0.1's figures. The minimum-variance weights now come from an exact solver and equal v0.1's SLSQP values, which R05b confirmed by enumeration.

Core code (excerpt; the full script is in the repository):
```python
def minvar_longonly(S, tol=1e-12):
    """Exact long-only minimum variance by enumerating active sets (N <= 10); KKT-checked; raises if none passes."""
    for mask in range(1, 2**N):
        A = [i for i in range(N) if mask >> i & 1]
        x = np.linalg.solve(S[np.ix_(A,A)], np.ones(len(A))); w = np.zeros(N); w[A] = x/x.sum()
        if w.min() >= -tol and all((S@w)[j] >= w@S@w*(1-1e-10) for j in range(N)): ...   # feasible KKT point
# C6 goal engine: joint date-vectors, break day removed (kept as jump vector), demeaned
J = np.column_stack([obs[:,0], obs[:,1], obs[:,2], fx]); jump_vec = J[BREAK].copy()
Jx = np.delete(J, BREAK, axis=0); Jd = Jx - Jx.mean(0)
block = clip(max(Politis-White(PPW 2009) on each column and its square), 5, 60)
for h in range(horizon):                      # 10,000 paths
    x = Jd[idx]; jump = rng.random(n_paths) < lam*dt
    fxr = x[:,3] + (mu_fx - lam*J_fx)*dt + jump*J_fx                 # compensated jump: mean = assumption
    loc = x[:,:3] + (mu_d - lam*J_loc)*dt + jump[:,None]*J_loc        # mu_d, mu_fx drawn per path from ASM-SYN-01
    r_usd = loc.copy(); r_usd[:,0] -= fxr; r_usd[:,2] -= fxr
    logW += np.log(np.exp(r_usd) @ w)                                 # daily-rebalanced portfolio
    idx = np.where(rng.random(n_paths) < 1/block, rng.integers(0, n_, n_paths), (idx+1) % n_)
```

**Output (verbatim, `python3 -I`):**

```
environment: python 3.13.18 | numpy 2.5.3 | pandas 3.0.5 | seeds {'dgp': 5, 'goal': 20261104, 'calib': 7}

=== 1. Annualised statistics (USD base, full 5y sample) ===
            ann_mean  ann_vol  zero_days_local_ccy
NGN_equity    0.0671   0.2622               0.3643
USD_equity    0.2435   0.1687               0.0000
FGN_bond     -0.0628   0.1826               0.0000

Sample correlation (USD base):
            NGN_equity  USD_equity  FGN_bond
NGN_equity       1.000      -0.000     0.658
USD_equity      -0.000       1.000    -0.066
FGN_bond         0.658      -0.066     1.000
Equal-weight log return on the break day: rebalanced -0.2184 vs v0.1 mean-of-logs -0.2371

=== 1b. NGN_equity vs FGN_bond correlation around the devaluation ===
USD base : pre 0.221 | post incl. break day 0.783 | post excl. break day 0.281
NGN base : pre -0.056 | post incl. break day 0.108 | post excl. break day 0.108
Leave-one-out on the post window (630 days): largest single-day influence -0.502 (day 630); median |influence| 0.0000
FX innovation vol (generator constant 6%): pre 0.062, post excl. break 0.058 -> no regime change; the 'post' jump is one observation

=== 2. Ledoit-Wolf intensities ===
Full 1,260-day sample: identity delta=1.000, constant-correlation delta=0.985
Full sample EXCLUDING the break day (1,259 days): identity delta=0.023, constant-correlation delta=0.127
Break-free 250-day windows (n=37, step 21d): identity delta 0.08-0.16; constant-correlation delta 0.27-1.00
-> Intensity at the cap also occurs with NO break (constant-correlation target close to S); intensity is not a break detector.

=== 2a. Minimum-variance long-only weights, full sample (USD base; exact active-set solver) ===
            sample  LW_identity(d=1.00)  LW_constcorr(d=0.99)    1/N
NGN_equity   0.000                0.333                 0.134  0.333
USD_equity   0.537                0.333                 0.479  0.333
FGN_bond     0.463                0.333                 0.388  0.333
portfolio variance at optimum: sample 3.611 | LW_identity(d=1.00) 3.653 | LW_constcorr(d=0.99) 4.302

=== 2b. Weight instability: rolling 250-day windows (step 21d) ===
            sample_mean  sample_sd  LWid_mean  LWid_sd  LWcc_mean  LWcc_sd
NGN_equity        0.030      0.029      0.147    0.110      0.063    0.020
USD_equity        0.323      0.270      0.240    0.057      0.320    0.299
FGN_bond          0.647      0.252      0.613    0.160      0.617    0.297
Mean absolute weight change between consecutive windows: sample 0.076 | LW-identity 0.053 | LW-constcorr 0.084

=== 2c. Short-history case: 60-day windows ===
            sample_sd  LWid_sd
NGN_equity      0.050    0.070
USD_equity      0.171    0.056
FGN_bond        0.161    0.079

=== 3. Drawdown table (daily, 5y synthetic; EW = true daily-rebalanced) ===
                   max_dd  peak_day  trough_day  days_peak_to_trough  days_to_recover  ann_return  ann_vol
NGN_equity         -0.474     627.0       910.0                283.0              NaN       0.067    0.262
USD_equity         -0.143     540.0       671.0                131.0             51.0       0.244    0.169
FGN_bond           -0.399     390.0      1083.0                693.0              NaN      -0.063    0.183
EW_USD             -0.246     572.0       671.0                 99.0              NaN       0.094    0.139
NGN_equity_in_NGN  -0.175     758.0       873.0                115.0            118.0       0.313    0.192

=== 4. Goal: USD 100,000 -> USD 150,000 in 5 years, equal-weight daily-rebalanced USD portfolio ===
required_return: nominal 8.45%/yr
[v0.1 method, for comparison] historical mean of EW = 0.094/yr (log), vol 0.139: conditional P 58.2%; analytic 10-90 band of P given H/T=1.00: 14.1%-93.2% (fixed by H/T, not by data); predictive Phi(c/sqrt(1+H/T)) = 55.8%
joint sample: 1259 date-vectors x 4 columns (break day 630 removed and held as the jump vector [+0.000, +0.031, +0.003, +0.373])
Politis-White implementation matches the arch 8.0.0 reference on two golden series (AR(1) 0.6: 19.4927; MA(2): 7.8701)
Politis-White (PPW 2009) stationary-bootstrap block length, levels / squares: NGN_eq_loc 0.0/2.7; USD_eq 4.1/2.4; bond_loc 1.0/0.1; dlogFX 0.7/2.2 -> rule max, clipped to [5,60] = 5.0 days
stationarity check (demeaned vol, first vs second half, ann.): NGN_eq_loc 0.194/0.190; USD_eq 0.179/0.157; bond_loc 0.049/0.055; dlogFX 0.062/0.058
assumption_set ASM-SYN-01 (synthetic placeholder for Doc 5b worked example, as of 2026-11-04): NGN_eq_loc 0.18+/-0.06, USD_eq 0.06+/-0.02, bond_loc 0.16+/-0.02, FX 0.12+/-0.06, USD CPI 0.025, jump rate 0.1/yr compensated
CMA overlay (ASM-SYN-01): success_count 41 of 100 (MC SE 0.49 pts) -> display 'about 40 of 100'
   quantiles nominal USD: q05 73,948, q10 84,853, q25 107,116, q50 138,047, q75 175,759, q90 216,448, q95 244,522
   quantiles real USD (2026 dollars): q05 65,359, q10 74,998, q25 94,675, q50 122,013, q75 155,345, q90 191,309, q95 216,122
   adjustment (q10 future reaches the goal): lump sum today USD 76,776
   adjustment: extra monthly contribution (start of months 2-60) USD 1,200
   adjustment: delay > 60 months (H/T rises to 2.00)
   drift_sensitivity (common random numbers; all asset drifts shifted): -2% -> 31 of 100; +0% -> 41 of 100; +2% -> 52 of 100
   width_reason: H/T = 1.00; portfolio drift sd ~ 0.046/yr (from the assumption ranges); simulated sd of 5y log wealth 0.365
   history_base_rate: 1 of 1 non-overlapping 5-year windows (history, not a forecast)
   calibration_status: uncalibrated | refusal: none (60 months of history per asset >= 36; H/T=1.00 <= 4; inputs synthetic, so C3 eligibility is not tested here)
Neutral case 'zero real return': success_count 23 of 100 (MC SE 0.42 pts) -> display 'about 25 of 100'
   analytic check (CMA case): mean 5y log wealth simulated 0.313 vs analytic 0.314 (drift + rebalancing term + jump convexity; drift-draw convexity ignored)

=== 5. Diagnostics for the equal-weight USD portfolio ===
           all days: vol 0.145; DR 1.410; ENB(PCA entropy) 1.64; risk contributions NGN_equity 0.529, USD_equity 0.139, FGN_bond 0.332
 break day excluded: vol 0.099; DR 1.512; ENB(PCA entropy) 2.00; risk contributions NGN_equity 0.535, USD_equity 0.349, FGN_bond 0.116
HHI = 0.333 (1/HHI = 3.00); currency exposure NGN 67%, USD 33%
1-day historical 99% VaR of EW: all days 0.0138; break excluded 0.0136; worst day -0.2184 (the break day)

=== 5b. Reverse stress: USD 100,000 equal-weight, floor = loss of 25% over 1 month ===
  single factor dlogFX     others flat         : move +60.0% (naira per dollar); Mahalanobis 9.23
  single factor dlogFX     others at cond. mean: move +64.9% (naira per dollar); Mahalanobis 9.79
  single factor NGN_eq_loc others flat         : move -75.0% (local price); Mahalanobis 25.05
  single factor NGN_eq_loc others at cond. mean: move -66.9% (local price); Mahalanobis 19.90
  most plausible joint scenario (Mahalanobis-minimal, an OPTIMISATION output): NGN_eq_loc -15.8%, USD_eq -14.0%, bond_loc -1.2%, dlogFX +31.6%; distance 7.07; value 75,000; Newton iterations 5
  linear (delta) approximation of the distance: 5.97

=== 6. TWR vs Modified Dietz, 63 trading days, deposit of 50% at the START of day index 10 (weight 53/63) ===
TWR -6.27% | Modified Dietz -5.21% | IRR (period, not annualised) -5.21% | end value 142,594

=== 7. Sharpe ratio with standard error (Lo 2002, iid) ===
USD_equity annualised SR = 1.44 +/- 0.45 (1 s.e.); 95% CI [0.56, 2.32]
SE of the 5y annualised mean of EW: 0.062 (1 s.e.) -> 95% half-width 0.122

=== 7b. Calibration: Gaussian forecast (right variance) applied to variance-scaled t5 outcomes ===
PIT histogram (10 bins, flat = 0.10): 0.080 0.084 0.098 0.116 0.128 0.121 0.111 0.099 0.085 0.079
nominal 90% interval (+/-1.6449): covers 91.4% simulated, 91.29% exact
nominal 98% interval (+/-2.3263): covers 97.0% simulated, 97.00% exact
nominal 99% interval (+/-2.5758): covers 97.9% simulated, 97.91% exact

sha256 of the output above: 8c0725b91d89a86fbd4c5fc63ea7c6373223401f0b65b485b504f433343b6ba4
```

**Reading the example.**
1. *One day is not a regime.* The NGN-equity/FGN-bond correlation in USD terms is 0.221 before the devaluation and 0.783 after it **only because the break day is in the "after" window**. Without that day it is 0.281, and that single day moves the figure by −0.502 (leave-one-out). The FX volatility is the same before and after. Hence the leave-one-out badge in §4.3 (F15).
2. *Covariance.* Both Ledoit–Wolf intensities hit their caps on the full sample (1.000 and 0.985); without the break day they are 0.023 and 0.127. On break-free 250-day windows, however, the constant-correlation intensity still reaches 1.00, so the cap is not a break signal (F2). The full-sample "shrunk" identity portfolio is just 1/N. Rolling 250-day minimum-variance weights have standard deviations of 25–30 points for the sample and constant-correlation estimators. On 60-day windows the identity target roughly halves the instability of the USD-equity and bond weights. Shrinkage is worth having as a *risk input*; it does not make an optimiser trustworthy.
3. *Drawdowns.* The same NGN equity series has a −17.5% maximum drawdown in naira and −47.4% in dollars. The FGN bond, "safe" in naira, has a −40% dollar drawdown with no recovery in the sample. The base currency is part of the definition of every risk number.
4. *Goal (C6).*
   - v0.1's method centred on the historical mean (9.4% a year, log, for the rebalanced portfolio). Its band is set by H/T (analytic 14%–93%).
   - The C6 engine gives **41 of 100 (Monte Carlo SE 0.5 points), displayed "about 40 of 100"**. Nominal q10–q90 is $84,853–$216,448, and the adjustment is $76,776 today or $1,200 a month. Drift sensitivity is 31 / 41 / 52 at −2 / 0 / +2 points.
   - The neutral "zero real return" case gives 23 of 100 ("about 25").
   - The wide spread of outcomes comes from return volatility (5-year log-wealth sd 0.365) and from the drift uncertainty in the assumption set (≈ 0.046 a year), not from resampling the history.
   - The analytic cross-check matches (0.313 against 0.314).
5. *Diagnostics.* HHI is 0.333 (three effective positions). On all days there are 1.64 effective bets and 53% of the risk is in NGN equity. On ordinary days (break excluded) there are 2.00 effective bets, and USD equity carries 35% of the risk rather than 14%. Currency exposure is 67% NGN. Both views are shown (§4.3).
6. *Reverse stress.* Losing 25% in a month needs a 60% rise in naira per dollar with everything else flat. The least extreme joint scenario under the stressed covariance needs only +31.6% FX together with equity falls of 14–16% (distance 7.07 against 9.23). This is an optimisation output and is labelled as one (§4.4).
7. *Performance.* With a 50% deposit ten trading days into a losing quarter, TWR is −6.27% and MWR −5.21%. The coding contract and golden cases are in §4.5.
8. *Sharpe and calibration.* A five-year daily Sharpe ratio of 1.44 carries a one-sigma band of ±0.45. The 5-year mean return of the portfolio is uncertain by ±12 points a year (95%). A Gaussian forecaster on t5 outcomes covers 97.9% of a nominal 99% band and 97.0% of a 98% band. v0.1 had mislabelled the 98% figure as the 99% one.

### 4.10 Model-selection decision matrix and phasing (item G)

Scores run from 1 (poor) to 5 (strong). They are the department's expert judgement (**E4**), informed by the findings cited, and are unchanged from v0.1.
- **v0.1 arithmetic was wrong in 13 of 19 rows** (R05b M1). The totals below are recomputed by `doc05b_revision_checks.py` [1].
- **The "MVP suitability" criterion is dropped as the basis for phasing.** It restated the conclusion. Its scores and the old six-criterion total (S6) are kept for traceability only.
- The primary total **S5** uses validity 0.25, data requirements 0.20, stability 0.20, lay interpretability 0.15 and compute 0.05, renormalised by 0.85.

**Phase rule** (stated in advance and applied mechanically):
1. **Do not build** if the output is a sizing, leverage, order or "edge" instruction. This is an objective mismatch, and score does not matter. Kelly scores 1.71, above DCC's 1.35, and is still banned.
2. **Phase 1** if S5 ≥ 3.25, the module outputs no portfolio weights, and it needs no *estimated* expected return. A labelled C6 assumption is not an estimate.
3. **Phase 2** if S5 ≥ 2.50 and the data-requirements score is ≥ 2. Weight outputs also sit behind the stability gate (§7, Disagreement 1).
4. **Not yet** otherwise.

| Model / module | Validity | Data req. | Stability | Interpretability | Compute | (MVP suit.) | S6 (v0.1 stated) | **S5** | Phase (rule) |
|---|---|---|---|---|---|---|---|---|---|
| Exposure decomposition (asset × currency × issuer) | 5 | 5 | 5 | 5 | 5 | (5) | 5.00 (5.00) | **5.00** | **1** |
| Descriptive risk (vol, downside, drawdown, HHI, DR, risk contributions) with CIs | 5 | 4 | 4 | 4 | 5 | (5) | 4.45 (4.45) | **4.35** | **1** |
| Historical/hypothetical stress + reverse stress | 4 | 3 | 5 | 5 | 5 | (5) | 4.35 (4.40) | **4.24** | **1** |
| TWR + MWR performance ledger, currency decomposition | 5 | 4 | 5 | 4 | 5 | (5) | 4.65 (4.65) | **4.59** | **1** |
| Ledoit–Wolf covariance (+EWMA second estimate), break rule | 5 | 3 | 4 | 2 | 5 | (4) | 3.80 (3.95) | **3.76** | **1** (internal) |
| Goal engine per C6 (joint demeaned bootstrap + assumption overlay + jumps) | 4 | 3 | 3 | 4 | 4 | (5) | 3.75 (3.85) | **3.53** | **1** |
| Calibration logging (1-month PIT/coverage) | 5 | 2 | 5 | 3 | 5 | (4) | 3.95 (4.00) | **3.94** | **1** |
| Sharpe/Sortino/Calmar with Lo SE; deflated SR for research | 4 | 3 | 3 | 3 | 5 | (3) | 3.35 (3.45) | **3.41** | **1** (display rules) |
| Risk-budgeting / risk-parity weights (risk contributions themselves are in row 2) | 4 | 3 | 4 | 4 | 5 | (3) | 3.70 (3.75) | **3.82** | 2 (weights; gated) |
| Constrained minimum-variance "alternative view" | 3 | 3 | 2 | 2 | 5 | (2) | 2.60 (2.65) | **2.71** | 2 (gated) |
| Black–Litterman view-expression tool | 3 | 2 | 2 | 3 | 5 | (2) | 2.55 (2.60) | **2.65** | 2 (gated) |
| Student-t GARCH simulation (estimated) | 4 | 2 | 2 | 2 | 3 | (2) | 2.55 (2.55) | **2.65** | 2 (research) |
| CVaR optimisation | 4 | 1 | 2 | 3 | 4 | (1) | 2.40 (2.45) | **2.65** | Not yet (data score 1) |
| Hierarchical risk parity | 3 | 2 | 3 | 1 | 4 | (1) | 2.25 (2.30) | **2.47** | Not yet |
| Regime-switching simulation | 3 | 1 | 2 | 2 | 3 | (1) | 1.95 (2.00) | **2.12** | Not yet |
| Resampled efficiency / robust MV | 2 | 1 | 3 | 1 | 3 | (1) | 1.75 (1.75) | **1.88** | Not yet |
| Mean–variance (unconstrained) | 2 | 1 | 1 | 1 | 5 | (1) | 1.45 (1.40) | **1.53** | Not yet |
| DCC-GARCH | 2 | 1 | 1 | 1 | 2 | (1) | 1.30 (1.35) | **1.35** | Not yet |
| Kelly / fractional Kelly | 2 | 1 | 1 | 2 | 5 | (1) | 1.60 (1.60) | **1.71** | Do not build (objective) |

The rule reproduces every v0.1 phase, and it now explains them. The "Sharpe display rules" (3.41) sit in Phase 1 below the Phase 2 risk-budgeting weights (3.82) because they replace figures the prototypes already show wrongly (D7, D22) and produce no weights; risk-budgeting *weights* are an optimiser output. Without the circular criterion, the goal engine (3.53) scores below risk budgeting (3.82). It stays in Phase 1 because it outputs no weights and requests no estimated return. The matrix ranks; the gates decide.

### 4.11 Statements the product may and may not make

In the product, every figure, date and count below is a **C2 token** resolved from the validated store. The model writes the connecting text only. The sentences show the rendered result. Display rules for goals are those of **C6**.

| May say (with inputs, as-of date and base currency attached) | May not say |
|---|---|
| "Your portfolio's yearly swing over the last 3 years was about 18% in USD (range 15–22% allowing for estimation error)." | "Your expected return is 11.3%." |
| "67% of your money and 86% of your risk is exposed to the naira (65% on ordinary days, excluding the devaluation)." (risk contributions of NGN equity + FGN bond, §4.9 section 5; v0.1 wrote "53%", which was NGN equity alone; found in revision) | "You should move 20% into US equities." |
| "In the June 2023 naira unification, the official I&E rate fell 29% on the first day and about 39% by 23 June [source, dates]; naira assets lost about that share of their dollar value." (from the scenario record, with window and price type) | "In 2023 a portfolio like this would have lost 31%." (v0.1's synthetic figure presented as history; R05b M5) |
| "About 40 of 100 simulated futures reach your goal; in the middle 80% you end between $84,900 and $216,400; reaching it in 9 of 10 futures needs $76,800 more today." (C6) | "This goal is 54% likely" or any bare probability; the median alone; "somewhere between 10% and 90%"; a difference between options smaller than 2 SE + 5 points (C6) |
| "This uses assumption set ASM-SYN-01 (editable); it is not a forecast." | "Our model forecasts…" |
| "Five years of data cannot pin down the average return: it is uncertain by about ±12 points a year (95%)." | "±6 points" (a 1-SE range presented to a lay reader; R05b m3) |
| "Of 4 example mixes fixed in advance, this one reached the target in n of m non-overlapping 5-year windows." | "The best mix for your goal is…" |
| "The least extreme combination of moves that takes you below your floor is …" (labelled as an optimisation result) | "There is a 2% chance of losing more than 31%." (unless from a labelled, calibrated distribution) |
| "This Sharpe ratio is not statistically different from zero with the data available." | "Strong edge — scale position size." |
| "Assumptions used: … (editable)." | Any figure without source, as-of date, unit and currency |

## 5. Alternatives considered and rejected

| Alternative | Why rejected (for now) |
|---|---|
| Ship the existing Monte Carlo engine with fixes | The engine's purpose (single-asset price targets with stops) is not the product's purpose (multi-currency goals with cash flows); the defect list in §4.8 covers the model layer, the statistics layer and the UI. Rebuild from tests upward; reuse nothing but the Box–Muller idea. |
| Parametric GBM/GARCH as the primary goal engine | Point parameters hide estimation uncertainty (F20); GARCH needs ≥ 1,000 clean daily observations per series, which NGX histories with stale prices and breaks do not provide (F3, F18). Kept only as a labelled benchmark path. |
| Mean–variance "efficient frontier" screen | The frontier's shape is driven by unestimable expected returns (F1); showing it to a lay user communicates precision that does not exist. |
| DCC-GARCH correlations | Model risk without benefit at N ≤ 10 (F4). |
| HRP | No hierarchy to exploit with a handful of assets; contested advantage (F7). |
| CVaR optimisation | Tail data insufficient (F9); CVaR *reporting* retained. |
| Kelly sizing | Catastrophic under estimation error; wrong objective for most people (F10). |
| Parametric (variance–covariance) VaR | Normal tails understate losses on NGN assets; historical/scenario VaR and ES retained (F12). |
| Security-level Brinson attribution | Statistically meaningless and noisy for < 20 holdings; asset-class × currency level retained (F24). |
| A single "risk score" (1–10) | Hides base currency, horizon and uncertainty; conflicts with the brief's accuracy standard. The decomposed table is the product. |
| Using LLM prose to restate numbers | Lesson 4 in the brief; all figures come from the calculation layer as C2 tokens. |
| Historical-mean-centred bootstrap with a second-order "estimation band" as the headline (v0.1) | Hidden point forecast (the past mean); the band is set by H/T, not by data (§4.7, R05b B2/B3). Replaced by C6 |
| Univariate bootstrap of the portfolio series (v0.1) | Loses FX co-movement when weights change (R05b M8). Joint date-vectors |
| Leaving break days in the bootstrap sample *and* adding scenario overlays (v0.1) | About 63% of 1,260-day paths contained the break day (1 − (1 − 1/1260)^1260), so devaluations were double-counted. One rule (§4.6) |
| User-chosen valuation rate, including parallel (v0.1 Disagreement 3) | Conflicts with C5.1; the parallel rate is a labelled sensitivity line only (§7) |
| Projected-gradient fallback solver (v0.1 script) | Not a Euclidean projection onto the simplex, and so wrong (R05b B4). Exact active-set enumeration, no fallback |
| Ledoit–Wolf intensity as a break detector (v0.1 F2) | Reaches the cap with no break (§4.9) |

## 6. Cross-department dependencies

**We need from others.**
- *Data architecture / market data (Doc 5c):* daily closes with venue, timestamp, currency, `as_of_date` and `last_traded_on` (kept distinct, §4.1), zero-volume and limit-day flags for NGX, DFM, ADX and US holdings; the registered break list as C3.5 world facts; C3-eligible short-rate series for NGN and USD (Karnosky–Singer split, §4.5, Phase 2); total-return indices with documented methodology; official FX series (CBN/FMDQ) and a way to store the user's transacted rates; NGX ASI history for 2008–09 and an S&P 500 2007–09 series from a licensed source (the GFC scenario has no equity shock until these exist); confirmation of the current NGX rulebook (price limits, tiered price-movement thresholds, trading hours, settlement cycle — 2026 press reports cite T+1 from 1 June 2026 and changed hours; unverified) [S156]; licence status of every benchmark.
- *Personal-finance ledger (System A, Doc 4; Contract C1):* reconciled positions and dated postings, classified so that §4.5 P2 can decide which are external flows for a given scope; in-transit legs per C1 D8.
- *Doc 5a:* the admissible-universe filter (Doc 5a Example 3) as an interface: instrument id, goal currency, admissible yes/no, reason code. The goal engine displays it (§4.7 G-1, G-11).
- *Doc 8:* adopt the C6 display of §4.7 for Journey 6 and the Overview; the "60 of 100" with no range and the point parameters (7%, 11%) are replaced.
- *Founder (C6 open questions):* which CMA source, and whether its licence allows use in the product; the neutral default ("zero real return" or CMA central); the NGN depreciation assumption.
- *Tax (Doc 6):* after-tax return inputs (withholding on NGX dividends, capital-gains treatment) so that the goal engine can run pre- and post-tax; confirmation that personal tax paid out of an investment scope is an external outflow (§4.5 P2).
- *Behavioural finance:* how to display probability ranges without inducing over- or under-reaction; evidence on whether showing drawdown tables changes behaviour.
- *Product/UX:* plain-language templates for every metric in §4.3; a mandatory "assumptions" panel.
- *Engineering:* a Web Worker/CI-testable calculation layer; seedable RNG; golden-test harness.
- *Compliance/legal:* review of §4.11; confirmation that scenario and range outputs are not "investment advice" under Nigerian SEC and UAE rules (the UAE Capital Market Authority replaced the SCA on 1 January 2026 per Doc 6; DFSA for the DIFC). Unknown; must be checked by counsel.
- *Performance reviewer:* a CIPM- or GIPS-literate reviewer to confirm the §4.5 contract.
- *Founder:* base currency; cash-rate benchmark; whether any NGN hedging instrument is accessible to them.

**Others need from us.** The metric definitions and provenance schema (§4.1, §4.3); the scenario library with sources and window types (§4.4); the performance coding contract and golden ledger (§4.5); the C6 engine implementation and its output (§4.7) for Doc 8; the validation protocol (§9); the list of permitted statements (§4.11); the data-quality floors per model (§4.6) that the data team must enforce upstream. For Doc 5c: Lesmond (1999) [S90] is verified here, though Doc 5c lists it as unverified.

## 7. Risks, open uncertainties and disagreements

**Disagreement 1: any optimiser in the MVP?**
- *Optimisation specialist:* a constrained minimum-variance or risk-budgeting view, labelled "one alternative, not a recommendation", helps the user see the trade-off between naira carry and dollar stability. Withholding it is paternalistic.
- *Statistician:* weights with 25–30-point standard deviations (§4.9, exact solver) are noise dressed as advice. A lay user will act on them, and the product's credibility rests on not doing this.
- *Quantitative portfolio researcher (tie-breaker proposal):* no optimiser in Phase 1. In Phase 2, enable the "alternative views" module only when the user's own data pass a stability gate. The gate: weights from the two halves of the history within 10 points of each other, and a bootstrap weight SD below 10 points. Show the module with the band, never a point.
- *R05b's question,* "will the gate ever pass?", is answered honestly: on the synthetic data it would not (SD 25–30 points). If it does not pass on the founder's real data either, the optimisation feature in System D is **deferred indefinitely**, with the reason shown (brief §5.9).
- Unresolved; the founder decides after seeing Phase 1 data.

**Disagreement 2: bootstrap versus parametric simulation.** *Financial econometrician:* the bootstrap cannot produce a devaluation that is not in the sample. *Statistician:* a regime model's crisis parameters are themselves assumptions. **Resolved by C6:** a demeaned joint bootstrap, with the break days as explicit, compensated, user-editable jumps (§4.7). The econometrician's point survives as the jump-rate input and as the Phase 2 research engine (Rec 12). Revisit if 1-month calibration fails.

**Disagreement 3: which FX rate is "true"? Resolved by Contract C5.1, preserved as a minority view.** Valuation and presentation use the CBN NFEM central rate. The user's transacted rates apply only to the economics of their own exchanges (C1.5). The parallel rate is a labelled sensitivity line (confidence D), never a valuation or total. *Risk analyst (minority, preserved):* risk is better measured at the rate at which the user could actually convert. That is why the sensitivity line is shown next to every NGN figure whenever the gap exceeds 5% (E5). v0.1's "let the user choose the valuation rate" is withdrawn.

**Disagreement 4: what is the goal headline? (R05b B3; preserved in C6.)**
- *Our statistician (v0.1):* a two-level display, a probability and its estimation band, is more honest about how little the data say.
- *R05b and Doc 8:* a lay user cannot act on "somewhere between 10% and 90%", and the band mostly reports H/T.
- **C6 decides:** the predictive count is the headline. The band is optional, only with ≥ 500 outer replicates or computed analytically, with its SE. Our statistician accepts that the band reports H/T. The dissent is narrowed to one request: that `width_reason` (H/T and drift sd) always be one tap away. C6 provides it.

**Disagreement 5: power of the calibration test (minor).** R05b's 19% power at n = 24 is for an equal-tailed exact test. The minimum-likelihood test (scipy's default) gives 34%. Both are too low to act on, so the protocol does not depend on the choice (§4.7).

**Answers to R05b's questions for the IC.**
- (1) *What does the founder see instead of the band?* The C6 count, the q10–q90 range, the adjustment in money and months, and the drift sensitivity (§4.7).
- (2) *Base currency and FX of record?* Two views, USD and NGN, by default; the C5.1 CBN central rate of record. The goal currency is set per goal.
- (3) *What is calibrated, at what horizon, with what power?* 1-month-ahead distributions, with exact tests. Power figures are in F26. If calibration cannot be established for years, the status stays `uncalibrated`, and the display says so.
- (4) *Will the stability gate pass?* Probably not; see Disagreement 1.
- (5) *Who supplies the 2007–09 series?* The data team, under licence (§6). Until then, the GFC scenario has no equity shock.
- (6) *Can the golden ledger be reconciled by hand?* Yes for the 12 synthetic cases (§4.5). For the founder's own holdings, it depends on their number. The founder should confirm the list (Doc 4 C1.11 Q2).

**Open uncertainties.**
- (a) Real NGX zero-return-day fractions and their effect sizes are unmeasured; our thin-trading numbers are synthetic.
- (b) Whether retail access to naira hedges exists.
- (c) Current NGX microstructure rules (changed in 2026; sources conflict).
- (d) The adaptation of GIPS to a personal ledger (§4.5) awaits a qualified reviewer.
- (e) The 97.5% ES level in the BIS standard was not re-read.
- (f) The regulatory classification of goal outputs.
- (g) Appraisal-smoothed holdings (private funds, fixed deposits, real estate) need unsmoothing (F18).
- (h) The CMA source and its licence (C6 Q1); no figures from any published CMA are used here.
- (i) The constant-correlation Ledoit–Wolf implementation has no reference check.
- (j) Goal-horizon calibration is not achievable within the MVP (F26).

**Risks.**
- False precision is the dominant product risk. Mitigations: the count format, rounding, sensitivity lines, leave-one-out badges and calibration logging.
- Silent data corruption (stale prices, mixed FX sources) producing fictitious returns. Mitigations: provenance on every figure (C3) and the floors in §4.6.
- Scope creep toward sophisticated models because they are available. Mitigation: the founder's rule, applied through the §4.10 phase rule and the gate in Disagreement 1.

## 8. Recommendations, ranked

| Rank | Recommendation | Class |
|---|---|---|
| 1 | Exposure decomposition by asset, issuer, sector, country and currency (denomination and economic), with provenance on every row | Personal-MVP must-have |
| 2 | TWR and MWR performance ledger with currency decomposition and the TWR–MWR gap explained | Personal-MVP must-have |
| 3 | Descriptive risk analytics with confidence intervals and base-currency switch (vol, downside, drawdown table, HHI, DR, risk contributions, stress-conditional correlation) | Personal-MVP must-have |
| 4 | Scenario library (2008, 2014–16 oil/2016 float, 2020, 2022, 2023 unification), each with sources, window type and price type; hypothetical scenarios; the reverse stress test of §4.4 (single-factor breakevens plus the Mahalanobis-minimal joint scenario, labelled as an optimisation) | Personal-MVP must-have |
| 5 | Ledoit–Wolf covariance with EWMA cross-check and the §4.6 break rule, used only as an input to 3 and 4 | Personal-MVP must-have (internal) |
| 6 | Goal Reality Engine per **C6** (§4.7): joint demeaned stationary bootstrap, labelled assumption overlay with drift uncertainty, compensated jump overlay, predictive count with quantiles, adjustment and drift sensitivity; pre-registered illustrative mixes; the statement contract of §4.11 | Personal-MVP must-have |
| 7 | Calibration logging of 1-month-ahead forecasts from the first month; PIT, Berkowitz and exact binomial coverage tests; goal-horizon calibration stated as not achievable in the MVP | Personal-MVP must-have |
| 8 | Sharpe/Sortino/Calmar display rules (Lo SE; "not distinguishable from zero" wording) | Personal-MVP must-have |
| 9 | Rebuild simulation engine from tests upward (seedable RNG, golden values, Web Worker); retire `MonteCarloPanel.tsx` and `PerformancePanel.tsx` as they stand | Personal-MVP must-have (engineering) |
| 10 | Risk-budgeting weights (the volatility-balanced weights as one labelled alternative, behind the stability gate); risk contributions themselves are already in Rec 3 | Later |
| 11 | Constrained minimum-variance and Black–Litterman "alternative views" behind the stability gate | Later |
| 12 | Estimated Student-t GARCH and regime-switching research engines, offered only if they pass calibration tests against the bootstrap | Later |
| 13 | Asset-class × currency Brinson attribution once licensed benchmarks exist | Later |
| 14 | CVaR optimisation, DCC-GARCH, HRP, resampled/robust mean–variance, point return forecasts | Do-not-build (yet) |
| 15 | Kelly sizing; any "edge score" or sizing advice; auto-rebalancing or order placement; leverage or margin; any single "probability of success" gauge. Banned because of objective mismatch, not because of the score (§4.10 rule 1) | Do-not-build |

**Five-question test on the top items.**

*Recommendation 1–3 (exposure, performance, descriptive risk).* (1) Problem: the founder cannot currently see what they own in one currency, what it has actually earned after cash flows, or where the risk sits. (2) Who: the founder now; every multi-currency retail user later. (3) Evidence: measurement standards (GIPS 2020 text, Dietz, Brinson/Karnosky–Singer decomposition) and the concentration/diversification literature [S69–S70, S78, S79, S95–S97] — E1/E3; the numbers require no forecasting. (4) Build/validate: deterministic calculations with analytic unit tests and the §4.5 golden ledger (§9); the main risk is data quality, handled by floors and badges. (5) Improvement metric: fraction of positions with complete provenance; reconciliation error between ledger value and sum of priced positions < 0.1%; user-reported decisions changed after seeing currency exposure (behavioural team to measure).

*Recommendation 4 (stress library).* (1) Problem: the dominant risk for a naira-based investor is a regime event that volatility statistics do not capture. (2) Who: anyone with NGN assets and USD goals. (3) Evidence: the devaluation and oil series themselves [S84–S88]; the crisis-correlation literature [S73–S77] — E2. (4) Build/validate: deterministic shock application; test by re-applying each scenario to a portfolio that existed at the time and comparing to realised P&L (data team to supply). (5) Improvement: scenario loss vs realised loss error in future events; user comprehension tests.

*Recommendation 5 (Ledoit–Wolf).* (1) Problem: sample covariances on short windows are noisy, and portfolio risk needs a covariance. (2) Who: the risk module. (3) Evidence: [S15–S18], scikit-learn reference implementation [S157], our experiment — E1. (4) Build/validate: golden test against `sklearn.covariance.LedoitWolf`; break-day exclusion test (§4.9). (5) Improvement: out-of-sample portfolio-variance forecast error (QLIKE) vs sample and EWMA, evaluated monthly.

*Recommendation 6–7 (goal engine + calibration).* (1) Problem: goals like "$100k targeting x%" are currently judged by intuition or by false-precision calculators. (2) Who: the founder (System E), later retail users. (3) Evidence: bootstrap theory [S121–S124b], parameter-uncertainty results [S128–S133], weak predictability [S110–S113], calibration methods [S136–S141] — E1. The assumption overlay itself is E4 or E5 until a CMA source is chosen. (4) Build/validate: unit tests on bootstrap moments; demeaning and compensation tests (simulated mean log wealth equals the analytic value within 3 Monte Carlo SE; 0.313 against 0.314 in §4.9); the Politis–White golden test; coverage tests on synthetic data with known truth; then live 1-month PIT logging. (5) Improvement: 1-month coverage of the 50%/90% bands consistent with nominal under exact Clopper–Pearson intervals, once ≥ 60 pooled outcomes exist. Withdrawal rule as in §4.7. Whether showing the count changes the founder's decisions is measured by the behavioural team.

*Recommendation 9 (rebuild engine).* (1) Problem: current code produces wrong numbers (§4.8). (2) Who: everyone downstream. (3) Evidence: direct replication of defects — E5 plus replication. (4) Build/validate: §9. (5) Improvement: 100% of displayed statistics covered by analytic or golden tests; reproducibility of any result from (inputs, seed, version).

## 9. Required validation before implementation

1. **Analytic unit tests** (must pass before any UI):
   - GBM moments; scaled-t variance; GARCH unconditional variance and persistence; Merton compensator; OU stationary variance;
   - barrier-hit probability against the closed form; maximum drawdown on hand-built paths, **including an all-loss path** (D21);
   - HHI, diversification ratio and risk contributions on 2-asset cases with closed-form answers;
   - the multicurrency identity R_B = R_L + R_X + R_L·R_X to 1e−12;
   - the Lo SE formula against a Monte Carlo of i.i.d. Sharpe ratios;
   - Dimson recovery 1 − p^(k+1) (0.9375 at p = 0.5, k = 3; R05b m6);
   - the t5 closed-form distribution function against simulation (§4.9 7b).
2. **Performance golden ledger.** The 12 cases of `doc05b_performance_golden.py` (§4.5) are reproduced exactly by the production engine: rationals equal, MWR to 1e−10, the same "not meaningful" and "not uniquely defined" verdicts. The cases are confirmed by a CIPM- or GIPS-literate reviewer before coding.
3. **Golden datasets and reproducibility.**
   - The frozen §4.9 generator, versioned, with its stored output and its SHA-256 (`8c0725b9…3b6ba4` with numpy 2.5.3 / pandas 3.0.5).
   - Dependencies pinned in `requirements.txt` with no optional code paths; CI runs every script under `python3 -I` and compares hashes.
   - Ledoit–Wolf (identity target) cross-checked against scikit-learn to 1e−8.
   - The exact minimum-variance solver checked against KKT on random positive-definite matrices.
   - The Politis–White block length checked against the arch reference values.
   - **Golden values for random outputs are distribution-level tolerances** (within 3 Monte Carlo SE) across the Python reference and the TypeScript product. They are not bit-exact, because the pseudo-random generators differ. Deterministic outputs are compared at 1e−9.
4. **Out-of-sample tests:** rolling-origin evaluation of covariance estimators (sample, EWMA, LW) by realised portfolio variance and QLIKE; rolling evaluation of any "alternative view" weights by turnover and realised volatility against 1/N. A module that does not beat 1/N on realised risk out of sample is not shown.
5. **Calibration tests:** PIT histogram, Berkowitz and exact binomial coverage on synthetic data with a known DGP (must pass) and on a misspecified DGP (must fail), at the 1-month horizon; then live (§4.7).
6. **Sensitivity analysis:** every displayed figure gets a sensitivity table over window length (60/250/500 d), estimator, base currency, FX source, inclusion or exclusion of break days, **leave-one-out influence**, and (goal engine) block length, jump rate and correlated versus independent drift draws. Figures whose sign or decile changes across these settings carry a "fragile" badge.
7. **Data-quality gates:** the floors in §4.3/§4.6 are enforced in code. A metric below its floor is suppressed or badged, never silently computed. Floor coverage is simulated as in §4.3.
8. **Thin-trading tests:** Dimson against OLS beta on real NGX names once data exist; volatility at daily against weekly frequency. Results are documented before any beta is displayed.
9. **Prototype regression tests:** D1–D27, including D24 (a zero entry must stay zero) and D25 (|ρ| > 1 rejected with an error), so the rebuild cannot reintroduce them.
10. **Human review:** a regulated financial adviser and counsel review §4.11 before anything leaves personal use; a statistician signs off the calibration protocol; a CIPM- or GIPS-literate reviewer signs off §4.5.

## 10. Sources

Verification key: **[verified]** = DOI resolved on OpenAlex/Crossref with matching title, first author and year (print year given; "online year n" noted where OpenAlex records an earlier online date); **[unverified]** = could not be checked in this session. Access dates: academic checks 2026-11-02 and 2026-11-04; web pages as stated. *v0.2:* the reference-lookup tool timed out on 2026-11-04, so new or corrected entries were checked against Crossref (`api.crossref.org/works/<doi>`) or the publisher's page, as noted.

**Portfolio construction and estimation error**
- S1. Markowitz, H. (1952). Portfolio Selection. *Journal of Finance* 7(1), 77–91. doi:10.2307/2975974 [verified]
- S2. Michaud, R. O. (1989). The Markowitz Optimization Enigma: Is "Optimized" Optimal? *Financial Analysts Journal* 45(1), 31–42. doi:10.2469/faj.v45.n1.31 [verified]
- S3. Jobson, J. D. & Korkie, B. (1980). Estimation for Markowitz Efficient Portfolios. *JASA* 75(371), 544–554. doi:10.1080/01621459.1980.10477507 [verified]
- S4. Jobson, J. D. & Korkie, B. (1981). Putting Markowitz Theory to Work. *Journal of Portfolio Management* 7(4), 70–74. doi:10.3905/jpm.1981.408816 [verified]
- S5. DeMiguel, V., Garlappi, L. & Uppal, R. (2009). Optimal Versus Naive Diversification: How Inefficient is the 1/N Portfolio Strategy? *Review of Financial Studies* 22(5), 1915–1953. doi:10.1093/rfs/hhm075 [verified; online 2007]
- S6. Kritzman, M., Page, S. & Turkington, D. (2010). In Defense of Optimization: The Fallacy of 1/N. *FAJ* 66(2), 31–39. doi:10.2469/faj.v66.n2.6 [verified]
- S7. Tu, J. & Zhou, G. (2011). Markowitz meets Talmud. *Journal of Financial Economics* 99(1), 204–215. doi:10.1016/j.jfineco.2010.08.013 [verified; online 2010]
- S8. Kirby, C. & Ostdiek, B. (2012). It's All in the Timing. *JFQA* 47(2), 437–467. doi:10.1017/S0022109012000117 [verified]
- S9. Chopra, V. K. & Ziemba, W. T. (1993). The Effect of Errors in Means, Variances, and Covariances on Optimal Portfolio Choice. *JPM* 19(2), 6–11. doi:10.3905/jpm.1993.409440 [verified]
- S10. Best, M. J. & Grauer, R. R. (1991). On the Sensitivity of Mean-Variance-Efficient Portfolios to Changes in Asset Means. *RFS* 4(2), 315–342. doi:10.1093/rfs/4.2.315 [verified]
- S11. Jagannathan, R. & Ma, T. (2003). Risk Reduction in Large Portfolios: Why Imposing the Wrong Constraints Helps. *Journal of Finance* 58(4), 1651–1683. doi:10.1111/1540-6261.00580 [verified]
- S12. Frost, P. A. & Savarino, J. E. (1988). For Better Performance: Constrain Portfolio Weights. *JPM* 15(1), 29–34. doi:10.3905/jpm.1988.409181 [verified]
- S13. Jorion, P. (1986). Bayes-Stein Estimation for Portfolio Analysis. *JFQA* 21(3), 279–292. doi:10.2307/2331042 [verified]
- S14. Kan, R. & Zhou, G. (2007). Optimal Portfolio Choice with Parameter Uncertainty. *JFQA* 42(3), 621–656. doi:10.1017/S0022109000004129 [verified]

**Covariance estimation**
- S15. Ledoit, O. & Wolf, M. (2003). Improved estimation of the covariance matrix of stock returns with an application to portfolio selection. *Journal of Empirical Finance* 10(5), 603–621. doi:10.1016/S0927-5398(03)00007-0 [verified]
- S16. Ledoit, O. & Wolf, M. (2004). A well-conditioned estimator for large-dimensional covariance matrices. *Journal of Multivariate Analysis* 88(2), 365–411. doi:10.1016/S0047-259X(03)00096-4 [verified; online 2003]
- S17. Ledoit, O. & Wolf, M. (2004). Honey, I Shrunk the Sample Covariance Matrix. *JPM* 30(4), 110–119. doi:10.3905/jpm.2004.110 [verified]
- S18. Ledoit, O. & Wolf, M. (2017). Nonlinear Shrinkage of the Covariance Matrix for Portfolio Selection: Markowitz Meets Goldilocks. *RFS* 30(12), 4349–4388. doi:10.1093/rfs/hhx052 [verified]
- S19. Elton, E. J. & Gruber, M. J. (1973). Estimating the Dependence Structure of Share Prices—Implications for Portfolio Selection. *Journal of Finance* 28(5), 1203–1232. doi:10.1111/j.1540-6261.1973.tb01451.x [verified via Crossref]
- S20. Chan, L. K. C., Karceski, J. & Lakonishok, J. (1999). On Portfolio Optimization: Forecasting Covariances and Choosing the Risk Model. *RFS* 12(5), 937–974. doi:10.1093/rfs/12.5.937 [verified]
- S21. Fama, E. F. & French, K. R. (1993). Common risk factors in the returns on stocks and bonds. *JFE* 33(1), 3–56. doi:10.1016/0304-405X(93)90023-5 [verified]
- S22. Fan, J., Fan, Y. & Lv, J. (2008). High dimensional covariance matrix estimation using a factor model. *Journal of Econometrics* 147(1), 186–197. doi:10.1016/j.jeconom.2008.09.017 [verified]
- S23. J.P. Morgan/Reuters (1996). *RiskMetrics — Technical Document*, 4th ed. Decay factors λ = 0.94 (daily) and 0.97 (monthly) confirmed only from secondary sources (metricgate.com, acadifi.com, accessed 2026-11-04). [unverified primary]
- S24. Engle, R. F. (1982). Autoregressive Conditional Heteroscedasticity with Estimates of the Variance of United Kingdom Inflation. *Econometrica* 50(4), 987–1007. doi:10.2307/1912773 [verified]
- S25. Bollerslev, T. (1986). Generalized autoregressive conditional heteroskedasticity. *Journal of Econometrics* 31(3), 307–327. doi:10.1016/0304-4076(86)90063-1 [verified]
- S26. Bollerslev, T. (1987). A Conditionally Heteroskedastic Time Series Model for Speculative Prices and Rates of Return. *Review of Economics and Statistics* 69(3), 542–547. doi:10.2307/1925546 [verified]
- S27. Engle, R. (2002). Dynamic Conditional Correlation. *Journal of Business & Economic Statistics* 20(3), 339–350. doi:10.1198/073500102288618487 [verified]
- S28. Caporin, M. & McAleer, M. (2013). Ten Things You Should Know about the Dynamic Conditional Correlation Representation. *Econometrics* 1(1), 115–126. doi:10.3390/econometrics1010115 [verified]
- S29. Hansen, P. R. & Lunde, A. (2005). A forecast comparison of volatility models: does anything beat a GARCH(1,1)? *Journal of Applied Econometrics* 20(7), 873–889. doi:10.1002/jae.800 [verified]
- S30. Poon, S.-H. & Granger, C. W. J. (2003). Forecasting Volatility in Financial Markets: A Review. *Journal of Economic Literature* 41(2), 478–539. doi:10.1257/002205103765762743 [verified]

**Black–Litterman, risk parity, HRP, resampling, robust, CVaR, Kelly, costs, rebalancing**
- S31. Black, F. & Litterman, R. (1992). Global Portfolio Optimization. *FAJ* 48(5), 28–43. doi:10.2469/faj.v48.n5.28 [verified]
- S32. He, G. & Litterman, R. (1999/2002). The Intuition Behind Black-Litterman Model Portfolios. Goldman Sachs; SSRN 334304. doi:10.2139/ssrn.334304 [verified via Crossref; SSRN page returned 403]
- S33. Idzorek, T. (2005; published 2007). A Step-by-Step Guide to the Black-Litterman Model. In Satchell (ed.), *Forecasting Expected Returns in the Financial Markets*. doi:10.1016/b978-075068321-0.50003-0 [verified via Crossref]
- S34. Walters, J. (2011 rev.). The Black-Litterman Model in Detail. SSRN 1314585. doi:10.2139/ssrn.1314585 [verified via Crossref]
- S35. Satchell, S. & Scowcroft, A. (2000). A demystification of the Black–Litterman model. *Journal of Asset Management* 1(2), 138–150. doi:10.1057/palgrave.jam.2240011 [verified]
- S36. Maillard, S., Roncalli, T. & Teïletche, J. (2010). The Properties of Equally Weighted Risk Contribution Portfolios. *JPM* 36(4), 60–70. doi:10.3905/jpm.2010.36.4.060 [verified]
- S37. Asness, C. S., Frazzini, A. & Pedersen, L. H. (2012). Leverage Aversion and Risk Parity. *FAJ* 68(1), 47–59. doi:10.2469/faj.v68.n1.1 [verified]
- S38. Anderson, R. M., Bianchi, S. W. & Goldberg, L. R. (2012). Will My Risk Parity Strategy Outperform? *FAJ* 68(6), 75–93. doi:10.2469/faj.v68.n6.7 [verified]
- S39. Inker, B. (2011). The Dangers of Risk Parity. *Journal of Investing* 20(1), 90–98. doi:10.3905/joi.2011.20.1.090 [verified]
- S40. Lee, W. (2011). Risk-Based Asset Allocation: A New Answer to an Old Question? *JPM* 37(4), 11–28. doi:10.3905/jpm.2011.37.4.011 [verified]
- S41. Roncalli, T. (2013). *Introduction to Risk Parity and Budgeting*. Chapman & Hall/CRC. doi:10.1201/b15151; SSRN 2272973 [verified via Crossref]
- S42. López de Prado, M. (2016). Building Diversified Portfolios that Outperform Out of Sample. *JPM* 42(4), 59–69. doi:10.3905/jpm.2016.42.4.059 [verified]
- S43. Raffinot, T. (2017). Hierarchical Clustering-Based Asset Allocation. *JPM* 44(2), 89–99. doi:10.3905/jpm.2018.44.2.089 [verified; Crossref 2026-11-04: published online 2017-12-22, issue dated 2017-12-31 (Winter 2018 issue of vol. 44); v0.1's "online 2016" was wrong (R05b m1)]
- S44. Jaeger, M., Krügel, S., Marinelli, D., Papenbrock, J. & Schwendner, P. (2021). Interpretable Machine Learning for Diversified Portfolio Construction. *Journal of Financial Data Science* 3(3), 31–51. doi:10.3905/jfds.2021.1.066 [verified]
- S45. Michaud, R. O. & Michaud, R. (2008). *Efficient Asset Management*, 2nd ed. Oxford University Press. doi:10.1093/oso/9780195331912.001.0001 [verified]
- S46. Scherer, B. (2002). Portfolio Resampling: Review and Critique. *FAJ* 58(6), 98–109. doi:10.2469/faj.v58.n6.2489 [verified]
- S47. US Patent 6,003,018, "Portfolio optimization by means of resampled efficient frontiers", Michaud & Michaud, filed 1998-09-09, granted 1999-12-14, expired 2018-09-09. https://patents.google.com/patent/US6003018A/en (accessed 2026-11-04) [primary]
- S48. Garlappi, L., Uppal, R. & Wang, T. (2007). Portfolio Selection with Parameter and Model Uncertainty. *RFS* 20(1), 41–81. doi:10.1093/rfs/hhl003 [verified; online 2006]
- S49. Goldfarb, D. & Iyengar, G. (2003). Robust Portfolio Selection Problems. *Mathematics of Operations Research* 28(1), 1–38. doi:10.1287/moor.28.1.1.14260 [verified]
- S50. Rockafellar, R. T. & Uryasev, S. (2000). Optimization of conditional value-at-risk. *Journal of Risk* 2(3), 21–41. doi:10.21314/JOR.2000.038 [verified]
- S51. Rockafellar, R. T. & Uryasev, S. (2002). Conditional value-at-risk for general loss distributions. *JBF* 26(7), 1443–1471. doi:10.1016/S0378-4266(02)00271-6 [verified]
- S52. Kelly, J. L. (1956). A New Interpretation of Information Rate. *Bell System Technical Journal* 35(4), 917–926. doi:10.1002/j.1538-7305.1956.tb03809.x [verified]
- S53. MacLean, L. C., Thorp, E. O. & Ziemba, W. T. (2010). Long-term capital growth: the good and bad properties of the Kelly and fractional Kelly capital growth criteria. *Quantitative Finance* 10(7), 681–687. doi:10.1080/14697688.2010.506108 [verified]
- S54. Samuelson, P. A. (1979). Why we should not make mean log of wealth big though years to act are long. *JBF* 3(4), 305–307. doi:10.1016/0378-4266(79)90023-2 [verified]
- S55. Gârleanu, N. & Pedersen, L. H. (2013). Dynamic Trading with Predictable Returns and Transaction Costs. *Journal of Finance* 68(6), 2309–2340. doi:10.1111/jofi.12080 [verified]
- S56. Donohue, C. & Yip, K. (2003). Optimal Portfolio Rebalancing with Transaction Costs. *JPM* 29(4), 49–63. doi:10.3905/jpm.2003.319894 [verified]
- S57. Sun, W., Fan, A., Chen, L.-W., Schouwenaars, T. & Albota, M. A. (2006). Optimal Rebalancing for Institutional Portfolios. *JPM* 32(2), 33–43. doi:10.3905/jpm.2006.611801 [verified]
- S58. Dichtl, H., Drobetz, W. & Wambach, M. (2014). Where is the value added of rebalancing? *Financial Markets and Portfolio Management* 28, 209–231. doi:10.1007/s11408-014-0231-3 [verified]
- S59. Perold, A. F. & Sharpe, W. F. (1988). Dynamic Strategies for Asset Allocation. *FAJ* 44(1), 16–27. doi:10.2469/faj.v44.n1.16 [verified]
- S60. Jaconetti, C., Kinniry, F. & Zilbering, Y. (2010). *Best practices for portfolio rebalancing*. Vanguard Research. https://personal1.vanguard.com/pdf/icrpr.pdf (fetch failed 2026-11-04 — service unavailable) [unverified]

**Risk measurement, drawdown, diversification, crisis correlation, currency**
- S61. Artzner, P., Delbaen, F., Eber, J.-M. & Heath, D. (1999). Coherent Measures of Risk. *Mathematical Finance* 9(3), 203–228. doi:10.1111/1467-9965.00068 [verified]
- S62. Acerbi, C. & Tasche, D. (2002). On the coherence of expected shortfall. *JBF* 26(7), 1487–1503. doi:10.1016/S0378-4266(02)00283-2 [verified]
- S63. Beder, T. S. (1995). VAR: Seductive but Dangerous. *FAJ* 51(5), 12–24. doi:10.2469/faj.v51.n5.1932 [verified]
- S64. Basel Committee on Banking Supervision (2019). *Minimum capital requirements for market risk*, 14 Jan 2019 (corrected 25 Feb 2019). https://www.bis.org/bcbs/publ/d457.htm (accessed 2026-11-04; page confirms ES-based internal models approach) [primary page; standard text not re-read]
- S65. Basel Committee on Banking Supervision (2009). *Principles for sound stress testing practices and supervision*. https://www.bis.org/publ/bcbs155.htm [unverified — not fetched; background only, nothing in §4.4 depends on it]
- S66. Magdon-Ismail, M., Atiya, A. F., Pratap, A. & Abu-Mostafa, Y. S. (2004). On the maximum drawdown of a Brownian motion. *Journal of Applied Probability* 41(1), 147–161. doi:10.1239/jap/1077134674 [verified]
- S67. Chekhlov, A., Uryasev, S. & Zabarankin, M. (2005). Drawdown Measure in Portfolio Optimization. *IJTAF* 8(1), 13–58. doi:10.1142/S0219024905002767 [verified]
- S68. Goldberg, L. R. & Mahmoud, O. (2017). Drawdown: from practice to theory and back again. *Mathematics and Financial Economics* 11, 275–297. doi:10.1007/s11579-016-0181-9 [verified; online 2016]
- S69. Woerheide, W. & Persson, D. (1993). An Index of Portfolio Diversification. *Financial Services Review* 2(2), 73–85. doi:10.1016/1057-0810(92)90003-U [verified; online 1992]. (HHI itself: Hirschman 1964, *AER* — lookup failed; [unverified])
- S70. Choueifaty, Y. & Coignard, Y. (2008). Toward Maximum Diversification. *JPM* 35(1), 40–51. doi:10.3905/JPM.2008.35.1.40 [verified]
- S71. Meucci, A. (2009). Managing Diversification. *Risk* 22(5), 74–79. [unverified: not found in Crossref by title on 2026-11-04; the SSRN DOI 10.2139/ssrn.1358533 returned 404 to R05b. The effective-number-of-bets definition used here is pinned in §4.3 and graded E5]
- S72. (withdrawn — DOI did not resolve to the intended paper)
- S73. Longin, F. & Solnik, B. (2001). Extreme Correlation of International Equity Markets. *Journal of Finance* 56(2), 649–676. doi:10.1111/0022-1082.00340 [verified]
- S74. Ang, A. & Chen, J. (2002). Asymmetric correlations of equity portfolios. *JFE* 63(3), 443–494. doi:10.1016/S0304-405X(02)00068-5 [verified]
- S75. Forbes, K. J. & Rigobon, R. (2002). No Contagion, Only Interdependence. *Journal of Finance* 57(5), 2223–2261. doi:10.1111/0022-1082.00494 [verified]
- S76. Chow, G., Jacquier, E., Kritzman, M. & Lowry, K. (1999). Optimal Portfolios in Good Times and Bad. *FAJ* 55(3), 65–73. doi:10.2469/faj.v55.n3.2273 [verified]
- S77. Kritzman, M. & Li, Y. (2010). Skulls, Financial Turbulence, and Risk Management. *FAJ* 66(5), 30–41. doi:10.2469/faj.v66.n5.3 [verified]
- S78. Ankrim, E. M. & Hensel, C. R. (1994). Multicurrency Performance Attribution. *FAJ* 50(2), 29–35. doi:10.2469/faj.v50.n2.29 [verified]
- S79. Karnosky, D. S. & Singer, B. D. (1994). *Global Asset Management and Performance Attribution*. Research Foundation of the ICFA. doi:10.2470/rf.v1994.n3.4444 [verified via Crossref]
- S80. Perold, A. F. & Schulman, E. C. (1988). The Free Lunch in Currency Hedging. *FAJ* 44(3), 45–50. doi:10.2469/faj.v44.n3.45 [verified]
- S81. Black, F. (1989). Universal Hedging. *FAJ* 45(4), 16–22. doi:10.2469/faj.v45.n4.16 [verified]
- S82. Campbell, J. Y., Serfaty-de Medeiros, K. & Viceira, L. M. (2010). Global Currency Hedging. *Journal of Finance* 65(1), 87–121. doi:10.1111/j.1540-6261.2009.01524.x [verified]
- S83. Siegel, J. J. (1972). Risk, Interest Rates and the Forward Exchange. *QJE* 86(2), 303–309. doi:10.2307/1880565 [verified via Crossref]
- S84. World Bank, Official exchange rate (LCU per US$, period average), Nigeria, indicator PA.NUS.FCRF. https://api.worldbank.org/v2/country/NGA/indicator/PA.NUS.FCRF?format=json (fetched 2026-11-02) [primary data]
- S85. June 2023 naira unification: (a) Nairametrics, "Exchange rate: Naira depreciates by 13.9% in one week", 24 Jun 2023, https://nairametrics.com/2023/06/24/exchange-rate-naira-depreciates-by-13-9-in-one-week (re-fetched 2026-11-04: I&E close ₦770.17 on 23 Jun against ₦663.04 on 16 Jun; intraday high ₦815; no pre-unification rate given); (b) Nairametrics, "I&E window records $788 million turnover one week after currency unification", 21 Jun 2023, https://nairametrics.com/2023/06/21/ie-window-records-788-million-turnover-one-week-after-currency-unification/ (fetched 2026-11-04: the rate fell "29% to N664/$1 on the first day"; the calendar date of the first day is not stated; 14 Jun 2023 is inferred from the CBN announcement of that date); (c) Political Economist (Reuters report), "Nigeria allows naira to drop more than 36% on official market", https://www.politicaleconomistng.com/?p=146446 (HTTP 502 and a timeout on 2026-11-04; not relied on) [secondary]
- S86. June 2016 float: Africanews, "Naira devalues against dollar after flexible forex policy takes off", 20 Jun 2016, https://africanews.com/2016/06/20/naira-devalues-against-dollar-after-flexible-forex-policy-takes-off ; Nairametrics, 20 Jun 2016, https://nairametrics.com/2016/06/20/results-are-in-nigerias-new-official-exchange-rate-after-currency-float/ (accessed 2026-11-04) [secondary]
- S87. FRED series DCOILBRENTEU (Crude Oil Prices: Brent — Europe; source US EIA). https://fred.stlouisfed.org/graph/fredgraph.csv?id=DCOILBRENTEU (fetched 2026-11-02) [primary data]
- S88. FRED series SP500 (S&P Dow Jones Indices). https://fred.stlouisfed.org/graph/fredgraph.csv?id=SP500 (fetched 2026-11-02; 10-year window; a **price** index, not total return) [primary data]

**Liquidity and reverse stress**
- S89. Amihud, Y. (2002). Illiquidity and stock returns. *Journal of Financial Markets* 5(1), 31–56. doi:10.1016/S1386-4181(01)00024-6 [verified]
- S90. Lesmond, D. A., Ogden, J. P. & Trzcinka, C. A. (1999). A New Estimate of Transaction Costs. *RFS* 12(5), 1113–1141. doi:10.1093/rfs/12.5.1113 [verified]
- S91. Lesmond, D. A. (2005). Liquidity of emerging markets. *JFE* 77(2), 411–452. doi:10.1016/j.jfineco.2004.01.005 [verified]
- S92. Bekaert, G., Harvey, C. R. & Lundblad, C. (2007). Liquidity and Expected Returns: Lessons from Emerging Markets. *RFS* 20(6), 1783–1831. doi:10.1093/rfs/hhm030 [verified]
- S93. Roll, R. (1984). A Simple Implicit Measure of the Effective Bid-Ask Spread. *Journal of Finance* 39(4), 1127–1139. doi:10.1111/j.1540-6261.1984.tb03897.x [verified]
- S94. Grundke, P. (2011). Reverse stress tests with bottom-up approaches. *Journal of Risk Model Validation* 5(1), 71–90. doi:10.21314/JRMV.2011.068 [verified]

**Performance measurement**
- S95. Dietz, P. O. (1966). *Pension Funds: Measuring Investment Performance*. Free Press. [indirectly confirmed: Crossref holds 1967 reviews of the book in *Journal of Finance* 22(1), doi:10.2307/2977326, and *Journal of Risk and Insurance* 34(3), per R05b; book itself not seen]
- S96. CFA Institute (2019). *2020 Global Investment Performance Standards (GIPS) for Firms*. https://www.gipsstandards.org/wp-content/uploads/2021/03/2020_gips_standards_firms.pdf (fetched 2026-11-04; 146 pages; text extracted with `pdftotext` and read for 1.A.35, 2.A.12, 2.A.13, 2.A.23–2.A.24, 2.A.28–2.A.29, 5.A.1 and the glossary entries "external cash flow" and "large cash flow"; effective date 1 January 2020) [primary standard; text read]
- S97. Dichev, I. D. (2007). What Are Stock Investors' Actual Historical Returns? *AER* 97(1), 386–401. doi:10.1257/aer.97.1.386 [verified]
- S98. Lo, A. W. (2002). The Statistics of Sharpe Ratios. *FAJ* 58(4), 36–52. doi:10.2469/faj.v58.n4.2453 [verified]
- S99. Jobson, J. D. & Korkie, B. M. (1981). Performance Hypothesis Testing with the Sharpe and Treynor Measures. *Journal of Finance* 36(4), 889–908. doi:10.1111/j.1540-6261.1981.tb04891.x [verified]
- S100. Ledoit, O. & Wolf, M. (2008). Robust performance hypothesis testing with the Sharpe ratio. *Journal of Empirical Finance* 15(5), 850–859. doi:10.1016/j.jempfin.2008.03.002 [verified]
- S101. Opdyke, J. D. (2007). Comparing Sharpe ratios: So where are the p-values? *Journal of Asset Management* 8(5), 308–336. doi:10.1057/palgrave.jam.2250084 [verified]
- S102. Sortino, F. A. & van der Meer, R. (1991). Downside risk. *JPM* 17(4), 27–31. doi:10.3905/jpm.1991.409343 [verified]
- S103. Young, T. W. (1991). Calmar ratio: a smoother tool. *Futures* 20(1), 40. [unverified — trade magazine; the Calmar definition the product uses is fixed in §4.5, not taken from this source]
- S104. Bailey, D. H. & López de Prado, M. (2014). The Deflated Sharpe Ratio. *JPM* 40(5), 94–107. doi:10.3905/jpm.2014.40.5.094 [verified]
- S105. Bailey, D. H., Borwein, J. M., López de Prado, M. & Zhu, Q. J. (2014). Pseudo-Mathematics and Financial Charlatanism. *Notices of the AMS* 61(5), 458–471. doi:10.1090/noti1105 [verified]
- S106. Bailey, D. H., Borwein, J. M., López de Prado, M. & Zhu, Q. J. (2017). The probability of backtest overfitting. *Journal of Computational Finance* 20(4), 39–69. doi:10.21314/JCF.2016.322 [verified; online 2016]
- S107. Harvey, C. R., Liu, Y. & Zhu, H. (2016). … and the Cross-Section of Expected Returns. *RFS* 29(1), 5–68. doi:10.1093/rfs/hhv059 [verified; online 2015]
- S108. Brinson, G. P., Hood, L. R. & Beebower, G. L. (1986). Determinants of Portfolio Performance. *FAJ* 42(4), 39–44. doi:10.2469/faj.v42.n4.39 [verified]
- S109. Brinson, G. P. & Fachler, N. (1985). Measuring non-US equity portfolio performance. *JPM* 11(3), 73–76. doi:10.3905/jpm.1985.409005 [verified]

**Forecasting, capital-market assumptions, simulation, parameter uncertainty, calibration**
- S110. Welch, I. & Goyal, A. (2008). A Comprehensive Look at The Empirical Performance of Equity Premium Prediction. *RFS* 21(4), 1455–1508. doi:10.1093/rfs/hhm014 [verified; online 2007]
- S111. Campbell, J. Y. & Thompson, S. B. (2008). Predicting Excess Stock Returns Out of Sample. *RFS* 21(4), 1509–1531. doi:10.1093/rfs/hhm055 [verified; online 2007]
- S112. Rapach, D. E., Strauss, J. K. & Zhou, G. (2010). Out-of-Sample Equity Premium Prediction: Combination Forecasts and Links to the Real Economy. *RFS* 23(2), 821–862. doi:10.1093/rfs/hhp063 [verified; online 2009]
- S113. Goyal, A., Welch, I. & Zafirov, A. (2024). A Comprehensive 2022 Look at the Empirical Performance of Equity Premium Prediction. *RFS* 37(11), 3490–3557. doi:10.1093/rfs/hhae044 [verified]
- S114. Fama, E. F. & French, K. R. (2002). The Equity Premium. *Journal of Finance* 57(2), 637–659. doi:10.1111/1540-6261.00437 [verified]
- S115. Arnott, R. D. & Bernstein, P. L. (2002). What Risk Premium Is "Normal"? *FAJ* 58(2), 64–85. doi:10.2469/faj.v58.n2.2524 [verified]
- S116. Dimson, E., Marsh, P. & Staunton, M. (2002). *Triumph of the Optimists*. Princeton University Press. doi:10.1515/9781400829477 [verified via Crossref]
- S117. J.P. Morgan Asset Management, *Long-Term Capital Market Assumptions*, 2027 edition (31st), data as of September 2026, 10–15-year horizon. https://am.jpmorgan.com/us/en/asset-management/adv/insights/portfolio-insights/ltcma/ (accessed 2026-11-04) [primary page]
- S118. Hamilton, J. D. (1989). A New Approach to the Economic Analysis of Nonstationary Time Series and the Business Cycle. *Econometrica* 57(2), 357–384. doi:10.2307/1912559 [verified]
- S119. Ang, A. & Bekaert, G. (2002). International Asset Allocation With Regime Shifts. *RFS* 15(4), 1137–1187. doi:10.1093/rfs/15.4.1137 [verified]
- S120. Guidolin, M. & Timmermann, A. (2007). Asset allocation under multivariate regime switching. *JEDC* 31(11), 3503–3544. doi:10.1016/j.jedc.2006.12.004 [verified]
- S121. Efron, B. (1979). Bootstrap Methods: Another Look at the Jackknife. *Annals of Statistics* 7(1), 1–26. doi:10.1214/aos/1176344552 [verified]
- S122. Künsch, H. R. (1989). The Jackknife and the Bootstrap for General Stationary Observations. *Annals of Statistics* 17(3), 1217–1241. doi:10.1214/aos/1176347265 [verified]
- S123. Politis, D. N. & Romano, J. P. (1994). The Stationary Bootstrap. *JASA* 89(428), 1303–1313. doi:10.1080/01621459.1994.10476870 [verified]
- S124. Politis, D. N. & White, H. (2004). Automatic Block-Length Selection for the Dependent Bootstrap. *Econometric Reviews* 23(1), 53–70. doi:10.1081/ETC-120028836 [verified]
- S124b. Patton, A., Politis, D. N. & White, H. (2009). Correction to "Automatic Block-Length Selection for the Dependent Bootstrap" by D. Politis and H. White. *Econometric Reviews* 28(4), 372–375. doi:10.1080/07474930802459016 [verified, Crossref 2026-11-04: title, three authors, volume, issue and pages agree; published 2009-01-30]
- S125. Cont, R. (2001). Empirical properties of asset returns: stylized facts and statistical issues. *Quantitative Finance* 1(2), 223–236. doi:10.1080/713665670 [verified]
- S126. Merton, R. C. (1976). Option pricing when underlying stock returns are discontinuous. *JFE* 3(1–2), 125–144. doi:10.1016/0304-405X(76)90022-2 [verified]
- S127. Vasicek, O. (1977). An equilibrium characterization of the term structure. *JFE* 5(2), 177–188. doi:10.1016/0304-405X(77)90016-2 [verified]
- S128. Pástor, Ľ. & Stambaugh, R. F. (2012). Are Stocks Really Less Volatile in the Long Run? *Journal of Finance* 67(2), 431–478. doi:10.1111/j.1540-6261.2012.01722.x [verified]
- S129. Barberis, N. (2000). Investing for the Long Run when Returns Are Predictable. *Journal of Finance* 55(1), 225–264. doi:10.1111/0022-1082.00205 [verified]
- S130. Avramov, D. & Zhou, G. (2010). Bayesian Portfolio Analysis. *Annual Review of Financial Economics* 2, 25–47. doi:10.1146/annurev-financial-120209-133947 [verified]
- S131. Bodie, Z. (1995). On the Risk of Stocks in the Long Run. *FAJ* 51(3), 18–22. doi:10.2469/faj.v51.n3.1901 [verified]
- S132. Samuelson, P. A. (1969). Lifetime Portfolio Selection by Dynamic Stochastic Programming. *REStat* 51(3), 239–246. doi:10.2307/1926559 [verified]
- S133. Merton, R. C. (1969). Lifetime Portfolio Selection under Uncertainty: The Continuous-Time Case. *REStat* 51(3), 247–257. doi:10.2307/1926560 [verified]
- S134. Milevsky, M. A. & Robinson, C. (2005). A Sustainable Spending Rate without Simulation. *FAJ* 61(6), 89–100. doi:10.2469/faj.v61.n6.2776 [verified]
- S135. Bengen, W. P. (1994). Determining Withdrawal Rates Using Historical Data. *Journal of Financial Planning* 7(4), 171–180. [unverified — not indexed]
- S136. Rosenblatt, M. (1952). Remarks on a Multivariate Transformation. *Annals of Mathematical Statistics* 23(3), 470–472. doi:10.1214/aoms/1177729394 [verified]
- S137. Diebold, F. X., Gunther, T. A. & Tay, A. S. (1998). Evaluating Density Forecasts with Applications to Financial Risk Management. *International Economic Review* 39(4), 863–883. doi:10.2307/2527342 [verified]
- S138. Berkowitz, J. (2001). Testing Density Forecasts, With Applications to Risk Management. *JBES* 19(4), 465–474. doi:10.1198/07350010152596718 [verified]
- S139. Kupiec, P. H. (1995). Techniques for Verifying the Accuracy of Risk Measurement Models. *Journal of Derivatives* 3(2), 73–84. doi:10.3905/jod.1995.407942 [verified]
- S140. Christoffersen, P. F. (1998). Evaluating Interval Forecasts. *International Economic Review* 39(4), 841–862. doi:10.2307/2527341 [verified]
- S141. Gneiting, T., Balabdaoui, F. & Raftery, A. E. (2007). Probabilistic forecasts, calibration and sharpness. *JRSS-B* 69(2), 243–268. doi:10.1111/j.1467-9868.2007.00587.x [verified]

**Emerging-market data pathologies**
- S142. Scholes, M. & Williams, J. (1977). Estimating betas from nonsynchronous data. *JFE* 5(3), 309–327. doi:10.1016/0304-405X(77)90041-1 [verified]
- S143. Dimson, E. (1979). Risk measurement when shares are subject to infrequent trading. *JFE* 7(2), 197–226. doi:10.1016/0304-405X(79)90013-8 [verified]
- S144. Lo, A. W. & MacKinlay, A. C. (1990). An econometric analysis of nonsynchronous trading. *Journal of Econometrics* 45(1–2), 181–211. doi:10.1016/0304-4076(90)90098-E [verified; online 1989]
- S145. Fisher, L. (1966). Some New Stock-Market Indexes. *Journal of Business* 39(1), 191–225. doi:10.1086/294848 [verified]
- S146. Burns, P., Engle, R. & Mezrich, J. (1998). Correlations and Volatilities of Asynchronous Data. *Journal of Derivatives* 5(4), 7–18. doi:10.3905/jod.1998.408000 [verified via Crossref]
- S147. Martens, M. & Poon, S.-H. (2001). Returns synchronization and daily correlation dynamics between international stock markets. *JBF* 25(10), 1805–1827. doi:10.1016/S0378-4266(00)00159-X [verified]
- S148. Brown, S. J., Goetzmann, W., Ibbotson, R. G. & Ross, S. A. (1992). Survivorship Bias in Performance Studies. *RFS* 5(4), 553–580. doi:10.1093/rfs/5.4.553 [verified]
- S149. Bai, J. & Perron, P. (2003). Computation and analysis of multiple structural change models. *Journal of Applied Econometrics* 18(1), 1–22. doi:10.1002/jae.659 [verified; online 2002]
- S150. Pesaran, M. H. & Timmermann, A. (2007). Selection of estimation window in the presence of breaks. *Journal of Econometrics* 137(1), 134–161. doi:10.1016/j.jeconom.2006.03.010 [verified; online 2006]
- S151. Getmansky, M., Lo, A. W. & Makarov, I. (2004). An econometric model of serial correlation and illiquidity in hedge fund returns. *JFE* 74(3), 529–609. doi:10.1016/j.jfineco.2004.04.001 [verified]
- S152. Geltner, D. (1991). Smoothing in appraisal-based returns. *Journal of Real Estate Finance and Economics* 4, 327–345. doi:10.1007/BF00161933 [verified]
- S153. Bekaert, G. & Harvey, C. R. (1997). Emerging equity market volatility. *JFE* 43(1), 29–77. doi:10.1016/S0304-405X(96)00889-6 [verified]
- S154. Harvey, C. R. (1995). Predictable Risk and Returns in Emerging Markets. *RFS* 8(3), 773–816. doi:10.1093/rfs/8.3.773 [verified]
- S155. Bekaert, G., Erb, C. B., Harvey, C. R. & Viskanta, T. E. (1998). Distributional Characteristics of Emerging Market Returns and Asset Allocation. *JPM* 24(2), 102–116. doi:10.3905/jpm.24.2.102 [verified]
- S156. NGX market structure and 2026 rule changes: NGX, "Trading market structure", https://ngxgroup.com/exchange/trade/equities/trading-market-structure (page fetch failed 2026-11-04; search summary cites 10:00 continuous open, 14:20 pre-close, ±10% limit); Nairametrics, "NGX introduces new thresholds for share price changes", 18 Jun 2026, https://nairametrics.com/2026/06/18/ngx-introduces-new-thresholds-for-share-price-changes/ ; Leadership, "Nigerian Exchange postpones revised pricing rules hours before August 17 take-off", https://leadership.ng/nigerian-exchange-postpones-revised-pricing-rules-hours-before-august-17-take-off/ ; The Sun, "NGX returns to tiered price discovery system after SEC approval", https://thesun.ng/ngx-returns-to-tiered-price-discovery-system-after-sec-approval/ ; T+1 settlement from 1 June 2026 and changed trading hours reported in the same search (accessed 2026-11-04). **Conflicting; rulebook confirmation required.** [secondary]
- S157. scikit-learn developers, `sklearn.covariance.LedoitWolf` documentation. https://scikit-learn.org/stable/modules/generated/sklearn.covariance.LedoitWolf.html (accessed 2026-11-04) [primary documentation]
- S158. Clarke, R., de Silva, H. & Thorley, S. (2006). Minimum-Variance Portfolios in the U.S. Equity Market. *JPM* 33(1), 10–24. doi:10.3905/jpm.2006.661366 [verified]; and (2011) Minimum-Variance Portfolio Composition. *JPM* 37(2), 31–45. doi:10.3905/jpm.2011.37.2.031 [verified]
- S160. Breuer, T., Jandačka, M., Rheinberger, K. & Summer, M. (2009). How to Find Plausible, Severe, and Useful Stress Scenarios. *International Journal of Central Banking* 5(3), September 2009. https://www.ijcb.org/journal/v5n3/how-find-plausible-severe-and-useful-stress-scenarios (publisher page and abstract fetched 2026-11-04; IJCB has no DOI, so it was not in Crossref; pages not listed on the page) [verified on publisher page; full text not re-read]
- S161. Kevin Sheppard et al., `arch` 8.0.0, `arch.bootstrap.optimal_block_length` (implements [S124] with [S124b]). Installed in the scratchpad only for a one-off cross-check on 2026-11-04; not a dependency [software]
- S162. Portfolio OS `CANONICAL_CONTRACTS.md` (C1–C7), 2026-11-04; C2, C3, C5 and C6 are binding on this document [internal]
- S159. NGX All-Share Index annual returns: ThisDay, "NGX ASI Closes 2024 With Impressive Annual Growth of 37.65%", 1 Jan 2025, https://www.thisdaylive.com/2025/01/01/ngx-asi-closes-2024-with-impressive-annual-growth-of-37-65/ ; Prime Business Africa, "NGX Records 37.65% Growth, Ends 2024 On High Note" (2023: +45.90% to 74,773.77; 2024: +37.65% to 102,926.40, naira terms). No source found for USD-terms returns (accessed 2026-11-04). [secondary]

*Scripts (this repository):* `docs/portfolio-os/research/scripts/worked_example_5b.py`, `doc05b_revision_checks.py`, `doc05b_performance_golden.py`, `prototype_checks.py`, `thin_trading_demo.py`. All were run on 2026-11-04 under `python3 -I` with numpy 2.5.3 and pandas 3.0.5 (`requirements.txt`); none imports scipy. Outputs are quoted verbatim in §4 and Appendix A.

## 11. Revision history and response to review

**v0.1** (2026-11-02, completed 2026-11-04): first draft. **v0.2** (2026-11-04): revised after review R05b (verdict: accept with required changes) and revision-log rows V-015, V-016 and V-017. Contracts C2, C3, C5 and C6 adopted. All changed numbers were recomputed under `python3 -I` by `worked_example_5b.py`, `doc05b_revision_checks.py`, `doc05b_performance_golden.py`, `prototype_checks.py` and `thin_trading_demo.py`.

| Finding (R05b numbering) | Revision log | Action | Where | Note |
|---|---|---|---|---|
| B1 correlation 0.22→0.78 is one day | V-016 | Fixed | F15, §4.3, §4.9 (1b), reading 1 | Without the break day: 0.281. Leave-one-out influence −0.502. FX vol constant (0.062/0.058). New leave-one-out badge rule (E5) |
| B2 bootstrap centred on the historical mean | V-017 | Fixed | §4.7, §4.9 (4), Rec 6 | C6 adopted: demeaned joint bootstrap; drift from labelled assumption set ASM-SYN-01 (synthetic placeholders, not any published CMA) |
| B3 band set by H/T; Doc 8 cannot display it | V-017 | Fixed | §4.7, §4.11, §7 Disagreement 4 | Predictive count headline (41 → "about 40 of 100", MC SE 0.5), quantiles, adjustment, drift sensitivity, width reason. The analytic band Φ(c ± 1.2816√(H/T)) is shown in `doc05b_revision_checks.py` [4]. The statistician's two-level view is preserved as a narrowed dissent |
| B4 environment-dependent outputs; wrong fallback solver | V-015 | Fixed | Script, `requirements.txt`, §2, §4.9, §9.3 | scipy removed; exact active-set solver with KKT check; fails loudly if numpy or pandas is missing; output SHA-256 identical with and without `-I`. Weights equal the SLSQP values R05b confirmed (0/0.537/0.463; 0.134/0.479/0.388) |
| M1 matrix arithmetic wrong; circular criterion | V-016 | Fixed | §4.10 | 13 of 19 totals confirmed wrong and recomputed. MVP criterion dropped (S5). Explicit phase rule reproduces every phase and explains the Sharpe vs risk-budgeting order |
| M2 in-sample mix search; reverse stress is an optimisation | — | Fixed | §4.7 (illustrative mixes), §4.4, §4.11 | Four pre-registered mixes; non-overlapping window count; trial-count rule; reverse stress labelled |
| M3 calibration infeasible for one user | V-017 | Fixed | F26, §4.7, Rec 7, §9.5 | 1-month-ahead calibration with exact Clopper–Pearson; power 19%/34% at n = 24; 83 months for 80% power; ±10-point and "two failures" rules dropped; goal-horizon calibration stated as not achievable in the MVP |
| M4 "99%" was a 98% interval | V-016 | Fixed | F22, §4.9 (7b) | 99%: 97.9% exact (closed-form t5 CDF); 98%: 97.0% |
| M5 synthetic 31% presented as the real 2023 loss | V-016 | Fixed, with a correction to the reviewer's figure | F16, §4.4, §4.11, S85 | Re-fetched sources give −29% on the first day and about −39% by 23 June. The reviewer's 36% rests on a pre-unification rate (~477) that neither re-fetched article states; we do not use it |
| M6 TWR/MWR spec not codeable; GIPS unread | — | Fixed; partly Deferred | §4.5, F24, S96, §9.2, §9.10 | GIPS 2020 text read and cited by provision. P1–P10 contract plus 12 golden cases. *Deferred:* sign-off by a CIPM/GIPS-literate reviewer before coding (owner: founder to appoint); Karnosky–Singer implementation to Phase 2 (needs C3 short-rate series from Doc 5c) |
| M7 reverse stress undefined; 2008 figures unsourced; mixed windows | — | Fixed; partly Deferred | §4.4, F27, S160 | Mahalanobis-minimal joint scenario (Newton/KKT) plus single-factor breakevens (Breuer et al. conditional expectation); window type per scenario. *Deferred:* S&P 500 and NGX 2007–09 series (owner: Data, Doc 5c); the "−57%" withdrawn meanwhile |
| M8 bootstrap under-specified | V-017 | Fixed | §4.7 G-2–G-9, §4.6, F21, S124b | Joint date-vectors; one break rule (remove, compensated jump overlay); Politis–White with the PPW 2009 correction, golden-tested against `arch`; stationarity check |
| M9 LW intensity not a break detector; wrong sample | — | Fixed | F2, §4.2, §4.3, §4.9 (2, 5) | Break-free 250-day windows: identity 0.08–0.16, constant-correlation 0.27–1.00. Which Σ feeds which figure is now stated |
| M10 / §2a: D8 comment mismatch, D15 every p, D21 all-loss (N5), N1–N4 | — | Fixed | §4.8 (D8, D15, D21, D24–D27), Appendix A [10]–[11], §9.9 | Source lines re-checked on 2026-11-04 |
| m1 Raffinot online year | — | Fixed | S43 | Crossref: online 2017-12-22 |
| m2 thin-trading script text contradicts output | — | Fixed | `thin_trading_demo.py`, §4.6 | Numbers unchanged |
| m3 ±6 points is 1 SE | — | Fixed | §4.11 | ±12 points (95%) on the rebalanced portfolio |
| m4 NAFEM vs NFEM | — | Fixed | §4.1, §4.6, §7 | NFEM, per C5.1 |
| m5 mean of log returns ≠ rebalanced portfolio | — | Fixed | Script, §4.9 | −0.218 vs −0.237 on the break day; EW drawdown −24.6% (v0.1 −26.2%) |
| m6 Dimson unit test | — | Fixed | §9.1, `thin_trading_demo.py` | 0.9375 |
| Evidence-grade audit: F15 | — | Fixed | F15 | Literature E1; synthetic claim replaced |
| — F25 "E2" | — | Fixed | F25, Rec 9 | E5 plus replication |
| — F22 demo label | — | Fixed | F22 | — |
| — F2 sample | — | Fixed | F2 | 250-day ranges |
| — floors ungraded | — | Fixed | §4.3, §4.6 | E5 with a coverage-simulation test plan |
| — calibration rule ungraded | — | Fixed | F26, §4.7 | E5 with power calculation |
| — matrix | — | Fixed | §4.10 | E4, recomputed |
| — F24 built on unread text | — | Fixed | F24, §4.5 | Text read; coding still blocked until reviewer sign-off |
| — F11 Vanguard E4 | — | Fixed (no change needed) | F11 | S60 still unreachable |
| Citations: S71 Meucci not found | — | Fixed | F14, §4.3, S71 | Definition pinned in the spec (E5); effective number of bets is a secondary diagnostic |
| — S135 Bengen not found | — | Deferred | S135 | Remains [unverified]; nothing depends on it. Owner: Quant, at the next index check |
| — S95 Dietz | — | Fixed | S95 | Indirectly confirmed via 1967 reviews |
| — S103 Calmar source | — | Fixed | §4.5, S103 | Definition pinned in the spec |
| — S88 price index | — | Fixed | F17, §4.4, S88 | — |
| — S124 correction missing | — | Fixed | S124b | Verified on Crossref |
| — S60 Vanguard unavailable | — | Deferred | S60 | Re-fetch when available; owner: Quant |
| Cross-doc 1: Doc 8 Journey 6 | V-017 | Fixed here; Deferred to Doc 8 | §4.7 presentation, §6 | Doc 8 owns its Journey 6 and Overview changes (C6 "Documents that must change") |
| Cross-doc 2: FX valuation rate | — | Fixed per C5.1; reviewer's proposal partly Rejected | §4.1, §4.6, §7 Disagreement 3 | The reviewer proposed a user-chosen alternative *valuation* view. C5.1 allows the parallel rate only as a sensitivity line, and the contract governs |
| Cross-doc 3: stale vs zero-volume closes | — | Fixed | §4.1 | `last_traded_on` vs `as_of_date` in the input contract |
| Cross-doc 4: Doc 5a admissible universe | — | Fixed (interface); Deferred (filter) | §4.1, §4.7 G-1/G-11, §6 | Owner of the filter: Doc 5a |
| Cross-doc 5: NAFEM; Lesmond status | — | Fixed | §6 | Note to Doc 5c |
| IC questions 1–6 | V-017 | Fixed | §7 | Answered |
| §7 item 7: distribution-level golden tolerances | — | Fixed | §4.8 (8), §9.3 | — |
| Never-build additions; ban by objective, not score | — | Fixed | Rec 15, §4.10 rule 1 | Auto-rebalancing, orders, leverage/margin, single probability gauge |
| (found in revision) "53% of your risk is exposed to the naira" | — | Fixed | §4.11 | That was NGN equity alone. Naira risk (equity + bond) is 86% on all days, 65% on ordinary days |

**Counts** (44 rows above, excluding the item found in revision; M10 groups D8, D15, D21/N5 and N1–N4, and the IC row groups six questions):
- **37 fixed.** This includes M5, where our figure corrects the reviewer's, and F11, where no change was needed.
- **4 fixed with a part deferred:** M6, M7, cross-doc 1 and cross-doc 4, each with a named owner.
- **2 deferred:** S135 and S60.
- **1 fixed per contract, with the reviewer's proposal partly rejected:** cross-doc 2.

One further error, found during revision, was also fixed.

**On the contracts.** We found nothing in C2, C3, C5 or C6 that we believe is wrong, and we follow them. Two **clarification requests** for the C6 owner, not departures:
1. C6 does not say whether an assumption set's drift *includes* devaluation jumps. We assume it does, and compensate the jump overlay so that jumps add tail but not mean (§4.7 G-7). If the contract intends the opposite, G-7's `compensated` flag flips, and the CMA-case count would fall.
2. C6's "σ/√T for a drift estimated from history" suggests that a history-estimated drift is an allowed option. Doc 5b offers it only as an explicit user choice, never as a default, because F19 holds that the historical mean is not a forecast.

**What remains open.**
- Sign-off of §4.5 by a CIPM- or GIPS-literate reviewer; until then, no coding of the performance engine.
- The CMA source and its licence, the neutral default, and the NGN depreciation assumption (founder; C6 open questions). ASM-SYN-01 is a synthetic placeholder only.
- Licensed S&P 500 and NGX 2007–09 series for the GFC scenario (Data).
- Doc 8's re-specification of Journey 6 to the C6 output; Doc 5a's admissible-universe filter.
- No reference implementation for the constant-correlation Ledoit–Wolf intensity.
- Real NGX data for the thin-trading, floor and stationarity tests.
- Whether the optimiser stability gate can ever pass on the founder's data (§7, Disagreement 1).

## Appendix A. Verbatim output of `scripts/prototype_checks.py` (2026-11-04; checks [10] and [11] added in v0.2, earlier lines unchanged)

```
numpy 2.5.3

[1] Student-t(5): sample variance = 1.6651; theory nu/(nu-2) = 1.6667; sigma inflation factor = 1.2904 (so a user-entered 60% vol is simulated as ~77.5%)

[2] Prototype 'Max DD P50/P95' (1-P25/P50, 1-P5/P50 of terminal prices) vs true path max drawdown, GBM mu=5%, sigma=60%
     5d: prototype P50=  5.4% P95= 13.0% | true path MDD median=  5.7% 95th pct= 14.4%
    21d: prototype P50= 11.0% P95= 24.9% | true path MDD median= 14.8% 95th pct= 29.9%
    63d: prototype P50= 18.3% P95= 38.8% | true path MDD median= 26.9% 95th pct= 48.2%
   252d: prototype P50= 34.1% P95= 63.3% | true path MDD median= 50.5% 95th pct= 75.5%

[3] P(stop) terminal-only vs path-barrier (stop at -10%), GBM sigma=60%
     5d: terminal-only 10.9% | path (any day) 14.7% | under-count x1.35
    21d: terminal-only 29.3% | path (any day) 48.9% | under-count x1.67
    63d: terminal-only 40.3% | path (any day) 70.6% | under-count x1.75
   252d: terminal-only 52.4% | path (any day) 87.1% | under-count x1.66
[4] GARCH(0.08,0.85) sigma=60%, clamp=False: realised ann. vol 0.601 (target 0.600), excess kurtosis of daily returns 0.30
[4] GARCH(0.08,0.85) sigma=60%, clamp=True: realised ann. vol 0.601 (target 0.600), excess kurtosis of daily returns 0.30

[5] OU kappa=2.0: half-life = ln2/kappa = 0.3466 years = 87 trading days = 126 calendar days (code comments say '≈130 days' and '≈127 days')

[6] Prototype 'Sharpe' = mean/std of terminal simple returns * sqrt(252/h), GBM mu=0.05 hardcoded:
   sigma=0.18 h=  5d: 'Sharpe'=0.300  vs mu/sigma=0.278 (no risk-free rate, no data)
   sigma=0.18 h=252d: 'Sharpe'=0.270  vs mu/sigma=0.278 (no risk-free rate, no data)
   sigma=0.60 h=  5d: 'Sharpe'=0.059  vs mu/sigma=0.083 (no risk-free rate, no data)
   sigma=0.60 h=252d: 'Sharpe'=0.076  vs mu/sigma=0.083 (no risk-free rate, no data)

[7] MC noise at N=10,000 (50 independent runs, 21d, sigma 60%): P5 price sd=0.316 on mean 74.40 (≈0.43%); P(profit) sd=0.0057

[8] PerformancePanel: P&L sequence [50, -100, 30] on a 10,000 account -> reported max drawdown 200%; true equity drawdown 1.00%
[9] 20 trade returns mean 1% sd 5% (holding period unknown): panel 'Sharpe' = 2.34; Lo(2002) iid SE of the un-annualised ratio with n=20 ≈ 0.22 per sqrt(period)
[10] PerformancePanel: all-loss P&L [-100, -200] on a 10,000 account -> reported max drawdown 0%; true equity drawdown 3.00%
[11] quantile index floor(N*p) vs ceil(N*p)-1 at N=10,000: p=0.01: 100 vs 99, p=0.05: 500 vs 499, p=0.25: 2500 vs 2499, p=0.5: 5000 vs 4999, p=0.95: 9500 vs 9499
```
