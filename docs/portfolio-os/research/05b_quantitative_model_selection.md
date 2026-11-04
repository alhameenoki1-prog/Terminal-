```
Document: 5b — Quantitative Finance Model-Selection Report
Department: Quantitative Finance and Financial Engineering  ·  Lead role(s): quantitative portfolio researcher, financial mathematician, statistician, financial econometrician, quantitative risk analyst, optimisation specialist, financial data scientist, financial-engineering specialist
Version: 0.1 draft  ·  Date: 2026-11-02 (research resumed and completed 2026-11-04)  ·  Status: for cross-department review
Reviewers required: Data Architecture & Market Data (provenance, NGX/DFM/ADX feeds); Product & UX (plain-language outputs); Behavioural Finance (how probabilities are shown); Engineering (Web Worker / test harness); Compliance & Legal (statements the product may make); Tax (after-tax return inputs)
```

> Governing rule from the founder, applied throughout: **"Mathematical sophistication is not sufficient justification for implementation."** Every model below had to pass the five-question test (§8) before it was allowed into Phase 1; most did not.

---

## 1. Executive summary

**Conclusions.** (1) For a single individual holding a handful of positions across NGN, AED and USD, the quantitative problem is *measurement under bad data*, not optimisation. Descriptive risk analytics (exposure by currency and asset, volatility with a stated base currency, drawdown tables, concentration, correlation under stress) and a correct performance ledger (time-weighted *and* money-weighted return with cash flows) deliver almost all of the decision value and carry almost none of the estimation risk. (2) Mean–variance optimisation and its relatives are not justified in the Personal MVP: with few assets and short, break-ridden histories, the inputs they need (expected returns above all) cannot be estimated to useful precision; the literature on estimation error is unambiguous [S2, S3, S5, S9, S10] and our own synthetic experiment reproduces it (§4.9). The one optimisation component we endorse early is the **Ledoit–Wolf shrinkage covariance** as a *risk-measurement* input [S15–S17], and even that must be shielded from structural-break days, which we show push its shrinkage intensity to the cap. (3) Simulation for the Goal Reality Engine should be a **block-bootstrap/scenario engine that reports ranges with an explicit estimation-uncertainty band**, not a parametric GBM/GARCH engine that prints percentiles to one decimal. In our worked example the point estimate "54% chance of reaching $150k" sits inside a 10th–90th percentile estimation band of **11%–94%**; the drift of a 5-year series has a standard error of ±6.5 percentage points a year. Percentile precision that ignores this is false precision. (4) The existing prototypes (`MonteCarloPanel.tsx`, `PerformancePanel.tsx`) are demonstration code, not validated infrastructure: 23 concrete defects are listed in §4.8, including unscaled Student-t innovations (a 60% volatility input is simulated as ≈77.5%), a "max drawdown" that is not a drawdown, a Cholesky mode whose second asset is discarded, a drawdown denominator that reports 200% on a 1% loss, and non-seeded `Math.random`.

**Biggest uncertainty.** Whether *any* optimiser belongs in the product at all. The optimisation specialist argues that a constrained minimum-variance or risk-budgeting view is a useful *alternative to display* (never a recommendation); the statistician argues that showing optimised weights to a lay user invites action on noise. We preserve the disagreement (§7) and propose a resolution path: ship no optimiser in Phase 1; in Phase 2, run the "optimisation alternatives" module only behind an out-of-sample stability gate that the module must pass on the user's own data before anything is shown.

**Headline recommendations.** Personal-MVP must-have: exposure decomposition (asset × currency × issuer), risk descriptives with confidence intervals, drawdown statistics, Ledoit–Wolf covariance with break handling, historical and hypothetical stress scenarios (2008, 2016 and 2023 naira devaluations, 2014–16 and 2020 oil shocks), TWR/MWR performance, bootstrap goal-feasibility ranges with uncertainty bands, and calibration logging from day one. Later: Black–Litterman as a *view-expression* tool, risk-budgeting display, CVaR views, regime-conditional stress. Do-not-build (yet): unconstrained mean–variance, resampled efficiency, Kelly sizing, DCC-GARCH, HRP, point forecasts of returns.

## 2. Scope and method

**Questions addressed.** Assignment items A–H: portfolio-construction models and their evidence; risk measurement; performance measurement with cash flows and currencies; forecasting and simulation; emerging-market data pathologies; evaluation of the two prototypes; a decision matrix and phased plan; a synthetic worked example.

**What we searched and used.**
- Academic literature: every paper cited was checked against OpenAlex by DOI (scripted batch, 2026-11-02) and, where no DOI was known, by title through the hosted reference-lookup tool or Crossref (2026-11-04). Status is marked **[verified]** (title, first author and year agree; where OpenAlex records the online-first year one year earlier than the print year we note "print year") or **[unverified]**. Verification logs are retained in the session scratchpad (`openalex_verification.json`, `openalex_batch2.json`, Crossref log).
- Primary data pulled by API (not search engines): World Bank official exchange rate series for Nigeria (`PA.NUS.FCRF`, annual average NGN per USD, 2005–2025, fetched 2026-11-02); FRED/EIA Brent daily prices and FRED S&P 500 daily index (fetched 2026-11-02). These calibrate the stress scenarios in §4.4.
- Primary documents fetched: Google Patents record of US 6,003,018 (Michaud resampled efficiency; expired); BIS page for *Minimum capital requirements for market risk* (January 2019); scikit-learn `LedoitWolf` documentation; J.P. Morgan Long-Term Capital Market Assumptions landing page (2027 edition, data as of September 2026).
- Web search (budget-limited; several calls failed on shared rate limits): used for NGX market-structure facts (2026 changes to price-movement rules, settlement cycle and trading hours), the June 2016 and June 2023 naira regime changes, NGX All-Share Index annual returns for 2023 and 2024, and the RiskMetrics decay factors. Where only secondary press sources were reachable we say so and grade E3/E4.
- Experiments: Python 3 with numpy 2.5.3, pandas 3.0.5 and scipy 1.18.1 (installed during the session; the worked example falls back to a projected-gradient solver if scipy is absent). Scripts and complete outputs are in `/home/user/Terminal-/docs/portfolio-os/research/scripts/` (`worked_example_5b.py`, `prototype_checks.py`, `thin_trading_demo.py`). All seeds are fixed; outputs quoted in §4 are verbatim.

**What we could not access or verify.** The text of the 2020 GIPS Standards (PDF fetched but text extraction failed; we cite the standard by URL and grade the TWR/MWR provisions E3 from the standard's well-known structure, flagged for confirmation). The RiskMetrics 1996 Technical Document itself (decay factors 0.94/0.97 confirmed only via secondary sources). The BIS standard's internal text (the page confirms ES-based internal models; the 97.5% confidence level is from the standard's published text, not re-read here). SSRN and Duke pages for He–Litterman, Walters and Idzorek returned 403; those papers were verified through Crossref DOIs instead. NGX historical index levels for 2008–2009 (no API; flagged as a data-department dependency). Current NGX trading hours and price-movement rules changed during 2026 and press reports conflict; we state what the sources say and require rulebook confirmation. We did not read the founder's Drive or Gmail, and nothing under `src/` was modified.

## 3. Findings

Each finding carries an evidence grade (E1–E6 per the brief) and source numbers from §10.

**F1. Estimation error dominates mean–variance output, and the damage is largest in the inputs a personal investor can least estimate: expected returns.** Michaud called the optimiser an "estimation-error maximiser" [S2]; Jobson & Korkie showed sample-based efficient portfolios performing far worse than equal weights out of sample [S3, S4]; Chopra & Ziemba found errors in means roughly ten times as costly as errors in variances for a moderately risk-averse investor [S9]; Best & Grauer showed small mean changes flipping weights [S10]. DeMiguel, Garlappi & Uppal estimated that, for 25 assets, a sample-based mean–variance strategy needs on the order of 3,000 months of data to beat 1/N out of sample [S5]. Counter-evidence exists (Kritzman, Page & Turkington [S6]; Tu & Zhou [S7]; Kirby & Ostdiek [S8]) but it relies on long histories, many assets or shrinkage toward priors — none of which describes a 3–10-position personal portfolio with 1–5 years of broken history. **E1** [S2–S10]. Our synthetic replication (§4.9) shows rolling-window minimum-variance weights with standard deviations of 25–30 percentage points even with *no* return forecasts involved.

**F2. Covariance can be estimated far more reliably than means, and shrinkage is the right default — but it is not a cure for structural breaks.** Ledoit–Wolf shrinkage toward a structured target is well-conditioned, analytically justified and cheap [S15–S17], with nonlinear extensions for large N [S18]; factor models help when N is large relative to T [S20–S22]. With N = 3 and T = 250 the sample covariance is already well conditioned, so shrinkage changes little (our experiment: shrinkage intensity 0.02–0.13 on break-free data). But a single devaluation day in the sample drove the estimated intensity to 1.00 (identity target) and 0.985 (constant-correlation target), i.e. the estimator gave up and returned its target. Breaks must be isolated as scenarios, not averaged into a "stationary" covariance. **E1** for the estimator [S15–S18]; **E5** for the break-handling rule (tested in §4.9, to be re-tested on real data).

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

**F14. Concentration and diversification metrics are useful descriptives when they carry their definitions.** Herfindahl–Hirschman index (sum of squared weights; 1/HHI is the "effective number of positions") [S69]; diversification ratio (weighted average volatility divided by portfolio volatility) [S70]; effective number of bets via principal-component entropy [S71, unverified]. **E3** [S69–S71].

**F15. Correlations rise in crises and in the left tail; diversification measured in calm periods overstates protection.** Longin & Solnik (extreme-value evidence that correlation rises in bear markets, not merely in volatile markets) [S73]; Ang & Chen (asymmetric correlations) [S74]; Forbes & Rigobon (part of measured "contagion" is a volatility artefact — the correction matters for how we display it) [S75]; Chow et al. and Kritzman & Li (turbulence-conditioned risk) [S76, S77]. In our synthetic USD-base data the NGN-equity/FGN-bond correlation rose from 0.22 to 0.78 after the devaluation because a shared currency factor took over. **E1** [S73–S77].

**F16. Currency is a separate exposure that must be decomposed, and for NGN it is the dominant risk.** Multicurrency attribution separates local-market return, currency return and their cross term [S78, S79]; the hedging literature [S80–S82] presumes hedging instruments that a Nigerian retail investor largely lacks (offshore non-deliverable forwards and FMDQ naira-settled futures exist for institutions; retail access unknown — founder/data team to confirm); Siegel's paradox means expected currency returns differ by base currency [S83]. **Primary data:** World Bank official annual-average NGN/USD: 192.4 (2015) → 253.5 (2016) → 305.8 (2017); 426.0 (2022) → 645.2 (2023) → 1,479.0 (2024) → 1,518.4 (2025) [S84]. The June 2016 float (peg of 197 abandoned; interbank rate ~254–282 on 20 June 2016) [S86] and the June 2023 unification (official rate from ~477 to ~750 in a day; 770 by 23 June 2023) [S85] are the two defining structural breaks. **E2** for the data [S84]; **E3** for event narratives [S85, S86].

**F17. Oil and global equity shocks are the external stress drivers.** FRED/EIA Brent: $115.19 (19 June 2014) → $26.01 (20 Jan 2016), −77%; $143.95 (3 Jul 2008) → $33.73 (26 Dec 2008), −77%; $70.25 (6 Jan 2020) → $9.12 (21 Apr 2020), −87%; 2022: $133.18 → $76.02, −43% [S87]. S&P 500 (FRED, daily close): −33.9% peak 19 Feb 2020 to trough 23 Mar 2020; −25.4% 3 Jan to 12 Oct 2022 [S88]. The 2007–09 S&P drawdown (≈ −57% on daily closes) is outside FRED's 10-year window and must be sourced by the data team. **E2** (official data) [S87, S88].

**F18. Thinly traded NGX stocks bias volatility and beta downward; corrections exist and must be applied before any risk number is shown.** Fisher (index autocorrelation from stale prices) [S145]; Scholes–Williams and Dimson estimators [S142, S143]; Lo & MacKinlay's econometrics of nonsynchronous trading [S144]; zero-return-day measures of illiquidity [S90, S91]; Amihud's price-impact ratio [S89]; emerging-market liquidity premia [S92]. Our synthetic demonstration (§4.6): with 50% stale days, OLS beta of a true-beta-1 stock is 0.51; Dimson with ±3 lags recovers 0.94; weekly aggregation 0.84. **E1** for the mechanism [S142–S145]; **E5** for the specific NGX magnitudes (to be measured on real data).

**F19. Returns are weakly forecastable at best; the historical mean is a hard benchmark to beat out of sample, and long-run "capital market assumptions" are judgements, not estimates.** Welch & Goyal [S110], Campbell & Thompson (small gains only with economic restrictions) [S111], Rapach, Strauss & Zhou (combination forecasts) [S112], and the 2024 update [S113]. Even the long-run equity premium is disputed [S114–S116]. Institutional CMAs are published annually on 10–15-year horizons by committees (J.P. Morgan's 2027 edition, data as of September 2026, "over a 10- to 15-year horizon") [S117] — appropriate as *labelled assumptions*, never as forecasts. **E1** [S110–S113].

**F20. Parameter uncertainty widens long-horizon return distributions; the "stocks are safe in the long run" intuition does not survive it.** Pástor & Stambaugh [S128]; Barberis [S129]; Avramov & Zhou survey [S130]; Bodie, Samuelson and Merton on time diversification [S131–S133]. A goal engine that simulates with a point drift understates the dispersion of outcomes. **E1** [S128–S133].

**F21. Bootstrap methods preserve empirical fat tails and dependence without parametric assumptions, but with short samples they cannot create tails that were never observed.** Efron [S121]; block and stationary bootstraps [S122, S123]; automatic block length [S124]; stylised facts of returns [S125]. Regime-switching models [S118–S120] capture crisis clustering but add parameters that a few years of data cannot pin down. **E1** [S118–S125].

**F22. Probabilistic outputs can and must be calibration-tested.** Probability integral transform (PIT) histograms [S136, S137], Berkowitz's likelihood-ratio test [S138], Kupiec/Christoffersen coverage tests [S139, S140], and the calibration-and-sharpness paradigm [S141]. Our demonstration: a Gaussian forecaster on t5 outcomes over-covers the centre and under-covers the 99% band (97.1% realised). **E1** [S136–S141].

**F23. Reported Sharpe ratios need standard errors and, when selected from many trials, deflation.** Lo's standard errors (iid SE ≈ √((1+½SR²)/T) and larger under autocorrelation) [S98]; Jobson–Korkie, Ledoit–Wolf and Opdyke tests [S99–S101]; the deflated Sharpe ratio and the probability of backtest overfitting [S104–S107]. With 20 trade returns, the prototype's annualised "Sharpe" of 2.34 has a one-sigma band wider than the estimate (§4.8). **E1** [S98–S107].

**F24. Time-weighted and money-weighted returns answer different questions; a personal ledger needs both, and cash-flow timing makes them diverge materially.** Modified Dietz [S95] and GIPS methodology (TWR with valuation at large external cash flows for firm composites; money-weighted returns permitted where the manager controls cash flows) [S96, unverified text]; Dichev shows investors' dollar-weighted returns lag buy-and-hold returns [S97]. Our example: one quarter with a mid-period 50% deposit gives TWR −6.27% versus Modified Dietz/IRR −5.21%. **E3** [S95–S97].

**F25. The two prototypes are not validated infrastructure.** Twenty-three defects with line references in §4.8, independently reproduced numerically. **E2** (direct code inspection and replication).

## 4. Proposed framework / specification for Portfolio OS

### 4.1 Inputs the quant layer requires (and what it refuses to compute without)

| Input | Minimum for Phase 1 | Provenance fields required (per brief §5.1) | If missing |
|---|---|---|---|
| Position ledger (holdings, units, cost, currency, account, dates) | Complete, reconciled by System A | source, as-of, currency, validation status | No risk figure is shown; exposure table shows "unpriced" rows |
| Prices for each holding | Daily closes, ≥ 60 trading days for volatility; ≥ 250 for correlation; ≥ 1,000 for tail/drawdown statistics | venue, timestamp, currency, adjustment status, stale-flag (zero-volume day) | Show the metric with a "short history" badge and a wider interval, or suppress below the floor |
| FX rates NGN/USD, AED/USD (and the rate *the user actually transacts at*) | Daily; both official and any parallel/retail rate the user supplies, labelled | source (e.g. CBN/FMDQ official vs user-supplied), timestamp | Report in local currency only, flag "USD view unavailable" |
| Base currency choice | User-selected; default unknown — **founder to confirm** | — | Block multi-currency aggregation |
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
| Covariance: Ledoit–Wolf shrinkage [S15–S18] | Stationarity within window | ≥ 60 d usable, ≥ 250 preferred | Good | — (internal) | Intensity saturates on jump days (§4.9) | Trivial | **Phase 1 risk input, with break isolation** | E1 |
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
| VaR / CVaR (historical and scenario) | 1-day and 1-month 95%/99% from historical returns and from the scenario library; parametric VaR *not* shown | 250 d (95%); 1,000 d (99%) | Order-statistic CI; Kupiec backtest once ≥ 250 forecasts exist [S139, S140] | "Loss exceeded about 1 month in 20" |
| Drawdown table | Max drawdown, peak/trough dates, time to recover, current drawdown; per asset, per currency view, and portfolio | 250 d | Note on sampling distribution [S66]; horizon stated | "Worst peak-to-trough fall" |
| Concentration | HHI and 1/HHI by position, issuer, sector, country, currency [S69] | Holdings only | None needed | "Effective number of holdings" |
| Diversification ratio [S70] and effective number of bets [S71] | As defined in §4.9 code | 250 d | Bootstrap CI | "How much diversification you are actually getting" |
| Risk contributions | w_i (Σw)_i / w'Σw | 250 d | Bootstrap CI | "Where your risk comes from" |
| Correlation under stress | Full-sample, EWMA, and conditional on the worst-decile days of a chosen factor (oil, USD/NGN, S&P) [S73–S77] | 500 d | Forbes–Rigobon-adjusted figure shown alongside [S75] | "How things move together in bad months" |
| Currency exposure decomposition | For each position: local return, currency return, cross term, in base currency [S78, S79]; exposure table by currency of denomination *and* of economic exposure (e.g. a USD-earning NGX stock — user-tagged) | Holdings + FX | None | "What happens to you if the naira moves 10%" |
| Liquidity flags | Zero-return-day fraction, Amihud ratio, days-to-liquidate at 20% of ADV [S89–S91] | 60 d of volume | — | "How hard to sell" |

**Multi-currency decomposition formula** (base currency B, position in local currency L): $1+R_B = (1+R_L)(1+R_{FX})$, so $R_B = R_L + R_{FX} + R_L R_{FX}$. The product reports all three terms; for NGN assets the cross term is not negligible in devaluation months (a +20% local month with a −35% currency month gives −22% in USD: −35% + 20% − 7%).

### 4.4 Stress testing specification

**Historical scenarios (shipped library, versioned, each with source series and dates):**

| Scenario | Window | Shock definitions (source) | Applies to |
|---|---|---|---|
| Global financial crisis | 2007-10 → 2009-03 | S&P 500 ≈ −57% (to be sourced by data team; outside FRED window); Brent −77% (3 Jul 2008 → 26 Dec 2008) [S87]; NGX ASI collapse of 2008–09 (level data to be sourced; CBN Statistical Bulletin) | USD equity, oil-linked NGN equity, FX |
| Oil collapse and 2016 naira float | 2014-06 → 2017-12 | Brent −77% (19 Jun 2014 → 20 Jan 2016) [S87]; NGN/USD annual average 158.6 (2014) → 305.8 (2017) [S84]; one-day interbank move ~197 → 254–282 on 20 Jun 2016 [S86] | All NGN assets in USD view |
| COVID shock | 2020-02 → 2020-04 | S&P 500 −33.9% (19 Feb → 23 Mar 2020) [S88]; Brent −87% (6 Jan → 21 Apr 2020) [S87] | Global |
| 2022 rates shock | 2022 | S&P 500 −25.4% (3 Jan → 12 Oct 2022) [S88]; bond drawdowns (data team) | USD bonds/equity |
| 2023 naira unification | 2023-06 → 2024-03 | Official rate ~477 → ~750 in one day (June 2023) and 770 by 23 Jun 2023 [S85]; annual average 426.0 (2022) → 645.2 (2023) → 1,479.0 (2024) [S84] | All NGN assets; NGN-denominated goals |

**Hypothetical scenarios (parametrised; user can edit the magnitudes):** NGN −30%/−50% overnight; AED peg break (AED has been pegged to USD; a peg-break scenario is a low-probability, high-impact hypothetical — E6); oil −50%; US equity −40% with NGN −20% (joint); NGX liquidity freeze (positions marked at a 15% discount and 30-day exit). **Reverse stress test [S94, S65]:** solve for the smallest joint move (along the first principal component of the stressed covariance) that reduces the base-currency net worth below the user's stated "unacceptable" level, and report it in words ("a 28% naira fall with flat equities would put you below your floor").

Each stress result is shown as a *loss given the scenario*, never with a probability attached, unless the scenario comes from the historical library — in which case the frequency statement is limited to "this happened n times in the last m years".

### 4.5 Performance measurement specification (item C)

| Measure | Method | When shown | Standard error / caveat |
|---|---|---|---|
| Time-weighted return (TWR) | Sub-period returns between every external cash flow, geometrically linked; daily valuation where prices exist [S95, S96] | Always (strategy quality) | Pricing-stale badge if any sub-period uses a stale price |
| Money-weighted return (MWR) | IRR of dated cash flows and end value; Modified Dietz as the fallback approximation when intra-period prices are missing [S95] | Always (investor's experience) | Multiple-root check; shown with the TWR–MWR gap explained ("timing effect") [S97] |
| Currency decomposition of return | Local, currency, cross term by position and in aggregate [S78, S79] | Always for multi-currency | — |
| Sharpe, Sortino, Calmar | Excess of a *stated* cash rate in the base currency (USD T-bill / FGN T-bill / AED deposit — unknown which; founder to confirm); Sortino vs stated MAR [S102]; Calmar = annualised return / max drawdown over the same window [S103] | Only when ≥ 36 monthly or ≥ 250 daily observations | Lo (2002) SE [S98] printed next to the ratio; autocorrelation-adjusted SE when the Ljung–Box test rejects; the product states "not statistically distinguishable from zero" when |SR| < 2 SE |
| Deflated Sharpe ratio [S104] | Applied to any backtested or strategy-selected figure the research module produces | Research outputs only | Number of trials must be logged |
| Attribution (Brinson) [S108, S109] | At the level of *asset class × currency* only (allocation vs selection vs currency); security-level attribution suppressed for < 20 holdings | Quarterly, when a benchmark is chosen | Benchmark choice stated; no attribution without a licensed benchmark series |

### 4.6 Emerging-market data pathologies and required fixes (item E)

| Pathology | Effect on models | Detection | Fix | Minimum data quality by model |
|---|---|---|---|---|
| Thin trading / zero-return days | Volatility and beta biased down; correlations biased toward zero [S142–S145] | Zero-return-day fraction; volume = 0 flags | Dimson aggregated coefficients (±2–3 lags) for beta; weekly or monthly aggregation for volatility and correlation; show both | Volatility: daily only if zero-day fraction < 10%, else weekly; beta: Dimson always on NGX |
| Stale prices in indices and funds | Autocorrelated, smoothed returns; understated risk [S145, S151, S152] | Significant lag-1 autocorrelation | Unsmoothing (Geltner/Getmansky) for fund NAVs; disclose | Any series with ρ₁ > 0.2 is flagged "smoothed" |
| Non-synchronous closes across time zones | Daily cross-market correlations biased down [S146, S147] (NGX closes before US cash open; DFM/ADX close hours earlier still) | Lead–lag cross-correlations | Use 2-day or weekly returns for cross-region correlation; never mix daily closes across regions in Σ | Cross-region Σ: weekly only |
| Survivorship | Overstated historical returns of "the market" [S148] | Compare constituent lists over time | Use total-return indices with documented methodology; flag back-filled data | Any backtest must state the universe-as-of date |
| FX conversion | Mixing official, NAFEM and parallel rates creates fictitious returns | Rate source per observation | One rate source per series, labelled; user-transacted rate for the user's own flows | — |
| Short histories | Tail and drawdown statistics undefined; shrinkage targets dominate | T below floors in §4.3 | Suppress or badge; use scenario library instead of empirical tails | Per-metric floors in §4.3 |
| Structural breaks (devaluations, policy regimes) | Estimates average across regimes; shrinkage intensity saturates (§4.9) | Known event dates; Bai–Perron break tests on longer series [S149]; window-selection logic [S150] | Isolate break days as scenarios; estimate Σ on the post-break window when ≥ 120 d exist, otherwise show both windows | — |
| Price limits and circuit breakers | Truncated return distributions on limit days (NGX ±10% daily limit per its market-structure page; tiered minimum-volume rules for price changes were revised during 2026 and press reports on the effective date conflict [S156]) | Returns equal to the limit | Flag limit days; do not treat as ordinary observations | — |

**Thin-trading demonstration** (`thin_trading_demo.py`, output verbatim):

```
stale prob  obs vol true vol  OLS beta Dimson k=1 Dimson k=3 weekly beta zero-day frac
       0.0    0.303    0.303     0.967      1.005      0.987       0.973          0.00
       0.3    0.304    0.303     0.674      0.932      0.982       0.902          0.29
       0.5    0.308    0.303     0.510      0.744      0.937       0.844          0.49
       0.7    0.313    0.303     0.322      0.580      0.818       0.664          0.69
```

(In this generator the missed moves are recovered in full on the next trading day, so total variance is preserved and observed volatility is not understated; in real thin markets stale quotes are *not* fully caught up within the sample window, and daily volatility is also biased down [S142, S145]. The beta bias is the robust result.)

### 4.7 Forecasting and simulation specification (item D) — the Goal Reality Engine

**Principles.** (a) No point forecast of returns is produced anywhere in the product (F19). (b) Every simulated distribution is accompanied by an *estimation-uncertainty band* (how much the answer moves when the history is resampled) and a *sensitivity line* (how much it moves per ±2 percentage points of assumed drift). (c) Optimisation output is never a forecast; (d) percentiles are rounded to the nearest 5 points and shown as ranges; (e) every output logs the forecast so it can be calibration-tested later (F22).

**Engine choice.**

| Engine | Keeps | Loses | Verdict |
|---|---|---|---|
| GBM with point μ, σ | Simplicity | Fat tails, clustering, parameter uncertainty [S125, S128] | Allowed only as a *labelled benchmark path* |
| Student-t / GARCH [S26] | Tails, clustering | Needs estimated parameters and ≥ 1,000 d; unstable on NGX data | Phase 2, only with estimation + diagnostics |
| Regime switching [S118–S120] | Crisis clustering | Many parameters; regime identification from short data is unreliable | Phase 2 research only |
| IID bootstrap [S121] | Empirical tails | Dependence | — |
| Stationary/block bootstrap [S122–S124] | Empirical tails and short-range dependence | Tails never observed; stationarity | **Phase 1 engine**, with the scenario library injected as explicit overlays |
| Scenario trees (deterministic) | Transparency | Probability | **Phase 1**, alongside the bootstrap |

**Presentation contract for a goal (example: "$100,000 targeting $150,000 in five years").** The product shows: (1) the required compound return (8.4% a year in USD); (2) which asset mixes have *historically* delivered that over rolling 5-year windows and how often (with the window count); (3) the risk those mixes carried (worst 5-year drawdown in the history, in the user's base currency); (4) the bootstrap probability of shortfall as a *range* (10th–90th percentile of the estimation band), with a plain sentence: "With the data we have, the chance of reaching this goal is somewhere between X and Y; the range is wide because five years of history cannot tell us the average return to within ±6 points a year"; (5) alternative structures (longer horizon, higher contributions, lower target) and what each does to the range; (6) the explicit statement that none of this is a forecast or a recommendation. Sequence risk is shown as the difference between the goal probability with and without contributions timed early versus late (path-dependence of contributions [S134, S135]).

**Calibration testing (from day one).** Each forecast distribution issued is stored with its PIT value once the outcome is known; monthly, the product computes the PIT histogram [S136, S137], a Berkowitz test [S138] and coverage of the 50%/90% bands [S139, S140]. Until 24 outcomes exist, the engine is labelled "uncalibrated".
