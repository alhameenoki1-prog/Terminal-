```
Document: 5b — Quantitative Finance Model-Selection Report
Department: Quantitative Finance and Financial Engineering  ·  Lead role(s): quantitative portfolio researcher, financial mathematician, statistician, financial econometrician, quantitative risk analyst, optimisation specialist, financial data scientist, financial-engineering specialist
Version: 0.1 draft  ·  Date: 2026-11-02 (research resumed and completed 2026-11-04)  ·  Status: for cross-department review
Reviewers required: Data Architecture & Market Data (provenance, NGX/DFM/ADX feeds); Product & UX (plain-language outputs); Behavioural Finance (how probabilities are shown); Engineering (Web Worker / test harness); Compliance & Legal (statements the product may make); Tax (after-tax return inputs)
```

> Governing rule from the founder, applied throughout: **"Mathematical sophistication is not sufficient justification for implementation."** Every model below had to pass the five-question test (§8) before it was allowed into Phase 1; most did not.

---

## 1. Executive summary

**Conclusions.** (1) For one individual holding a handful of positions across NGN, AED and USD, the quantitative problem is *measurement under bad data*, not optimisation. Descriptive risk analytics and a correct performance ledger deliver most of the decision value with little estimation risk. (2) Mean–variance optimisation and its relatives are not justified in the Personal MVP: the expected returns they need cannot be estimated from short, break-ridden histories [S2, S3, S5, S9, S10] (replicated in §4.9). We endorse only the Ledoit–Wolf shrinkage covariance as a *risk-measurement* input [S15–S17], with structural-break days isolated (they push its shrinkage intensity to the cap). (3) The Goal Reality Engine should be a block-bootstrap/scenario engine reporting ranges with an estimation-uncertainty band: a "54% chance of reaching $150k" in our example sits inside a 10th–90th percentile band of 11%–94%, because a 5-year drift has a standard error of ±6.5 points a year. (4) The existing prototypes are demonstration code: 23 defects (§4.8) include unscaled Student-t innovations, a "max drawdown" that is not a drawdown, a Cholesky mode that discards its second asset, a drawdown denominator reporting 200% on a 1% loss, and non-seeded `Math.random`.

**Biggest uncertainty.** Whether *any* optimiser belongs in the product. The optimisation specialist wants a constrained risk-based view shown as an alternative; the statistician holds that optimised weights invite action on noise (§7). Proposed resolution: none in Phase 1; Phase 2 only behind an out-of-sample stability gate.

**Headline recommendations.** Must-have: exposure decomposition, risk descriptives with confidence intervals, drawdowns, Ledoit–Wolf covariance with break handling, stress scenarios (2008, 2016 and 2023 naira devaluations, 2014–16 and 2020 oil shocks), TWR/MWR, bootstrap goal ranges with bands, calibration logging. Later: Black–Litterman as a view tool, risk-budgeting display, CVaR views. Do-not-build (yet): unconstrained mean–variance, resampled efficiency, Kelly, DCC-GARCH, HRP, point return forecasts.

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

### 4.8 Evaluation of the existing prototypes (item F)

Files: `/home/user/Terminal-/src/components/MonteCarloPanel.tsx` (563 lines) and `/home/user/Terminal-/src/components/PerformancePanel.tsx` (331 lines). Both were written for a day-trading dashboard (single-asset price targets, closed-trade statistics), not for a multi-currency personal portfolio. Defects are numbered; severity: **H** (wrong number shown to a user), **M** (misleading or unvalidated), **L** (engineering).

| # | Location | Defect | Sev. | Numerical evidence (`prototype_checks.py`) |
|---|---|---|---|---|
| D1 | `MonteCarloPanel.tsx` 49–69 (`Math.random`) | Non-seedable RNG: results are irreproducible; no golden tests possible; no antithetic/common random numbers across models | H | — |
| D2 | 57–62, 95 | Student-t(ν=5) innovations are not variance-scaled (variance ν/(ν−2) = 5/3). A user-entered σ is simulated at σ·√(5/3) | H | sample variance 1.665; a 60% input simulates as ≈77.5% |
| D3 | 113–114 | GARCH α = 0.08, β = 0.85 hardcoded, not estimated; no standard errors; "fat tails" claimed (554) but daily excess kurtosis is only ≈0.3 | M | realised vol 0.601 vs target 0.600; excess kurtosis 0.30 |
| D4 | 127 | Variance clamped at 4σ²: an arbitrary truncation of the volatility distribution (immaterial at these parameters but silently alters the model) | L | identical moments with and without clamp at α+β = 0.93 |
| D5 | 100 vs 123 | Drift conventions differ across engines: GBM uses μ − ½σ², GARCH uses μ (no Itô correction), OU uses a horizon-dependent θ; the same "μ" therefore means a different expected price in each model | M | — |
| D6 | 306 | μ = 0.05 hardcoded; not estimated, not user-visible, not currency-specific; applied to BTC and S&P alike | H | — |
| D7 | 229 | "Sharpe" is mean/SD of the *simulated terminal cross-section*, annualised by √(252/h), with no risk-free rate and no data: it restates μ/σ of the inputs | H | 0.270–0.300 for σ = 18%; 0.059–0.076 for σ = 60% (≈ 0.05/σ) |
| D8 | 238–242 | "Max DD P50/P95" are 1 − P25/P50 and 1 − P5/P50 of *terminal prices* — a dispersion statistic, not a drawdown; the comment admits it | H | 252 d: prototype 34%/63% vs true path median 50%, 95th pct 76% |
| D9 | 218–223, 103 | P(target)/P(stop) use terminal values only; `entry/target/stop` are explicitly `void`ed inside the path loop, so barrier hits during the horizon are ignored | H | P(stop −10%) at 63 d: terminal 40% vs path 71% (under-count ×1.75) |
| D10 | 184–202, 322–323 | Cholesky mode simulates two assets but returns only `finals1`; asset 2 and ρ have no effect on any displayed number | H | — |
| D11 | 139, 555 | OU half-life comments inconsistent and in mixed units (ln2/κ = 0.347 y = 87 trading days = 126 calendar days) | L | computed |
| D12 | 140 | OU long-run mean θ depends on the chosen horizon (`mu*horizon/252`), so the model changes when the user changes the display horizon | M | — |
| D13 | 159–161 | Merton λ, μ_J, σ_J hardcoded; no estimation or source | M | — |
| D14 | 40–45, 292–296 | Regime multipliers 0.85/1.0/1.2/1.5 are arbitrary constants applied multiplicatively to σ; no estimation, no source, no uncertainty | M | — |
| D15 | 225, 233–236 | Quantile indexing `sorted[floor(N·p)]` is off by one position for the lower tail; CVaR averages the lowest 500 of 10,000 (fine) but VaR uses the 501st value | L | — |
| D16 | 248–251 | VaR/CVaR reported in price units per one unit of asset, unlabelled by currency; not scaled to position size | M | — |
| D17 | 226–231 | Skewness/kurtosis of simple terminal returns with population (1/N) estimators; no standard errors; colour thresholds (541–542) arbitrary | L | — |
| D18 | 510 | "Fan chart" bar heights `[25,48,80,52,28]` are hardcoded: the chart is decorative, not data-driven | H | — |
| D19 | 298–328 | 10,000 × horizon steps run synchronously on the main thread after a 50 ms `setTimeout` (2.5 M normal draws for 1 y; 15 M with Student-t). No Web Worker, no progress, no cancellation | M | — |
| D20 | whole file | No Monte Carlo standard errors shown | M | at N = 10,000, 21 d, σ = 60%: SD of P5 price ≈ 0.4%; SD of P(profit) ≈ 0.6 pt |
| D21 | `PerformancePanel.tsx` 50–63 | Drawdown computed on cumulative realised P&L with `peak` starting at 0: denominator is the P&L peak, not account equity | H | P&L sequence [+50, −100, +30] on a 10,000 account → reported 200%; true 1.0% |
| D22 | 42–48, 90–93 | "Sharpe" from the last ≤ 20 per-trade returns, annualised by √252 as if each trade were one day; no risk-free rate; holding periods ignored; no SE | H | 20 trades, mean 1%, SD 5% → "2.34"; Lo SE of the raw ratio ≈ 0.22 per period |
| D23 | 313–328, 165–170 | "NEXUS Performance Assessment" issues sizing advice ("Scale position size") from ≥ 5 trades; composite edge score weights 0.6/0.4 arbitrary; USD sign hardcoded (144); no cash flows, no TWR/MWR, no currency | H | — |

**What a validated implementation needs.** (1) A seedable, tested PRNG (e.g. a counter-based or xoshiro generator with a Ziggurat/Box–Muller normal) with golden-value tests against a reference implementation. (2) Unit tests with analytic cases: GBM terminal log-price mean and variance; Student-t variance after scaling; GARCH unconditional variance ω/(1−α−β); Merton compensator (E[S_T] = S₀e^{μT}); OU stationary variance σ²/(2κ); barrier probability for Brownian motion with drift (reflection-principle closed form) against the path simulator; Modified Dietz and TWR on hand-computed ledgers; max drawdown on a hand-built path. (3) Golden datasets: a frozen synthetic ledger with known TWR/MWR/drawdown; a frozen return panel with known Ledoit–Wolf intensity (cross-checked against scikit-learn's `LedoitWolf` [S157]). (4) Estimation, not constants: GARCH/jump parameters fitted by maximum likelihood with reported standard errors, or the model is not offered. (5) Monte Carlo error bars on every reported quantity; Web Worker execution with cancellation; results cached by (inputs, seed). (6) Separation of engine from UI so the same code runs in CI.

### 4.9 Worked example with synthetic data (item H)

Script: `/home/user/Terminal-/docs/portfolio-os/research/scripts/worked_example_5b.py` (numpy 2.5.3, pandas 3.0.5, scipy 1.18.1; seed 5). **All parameters are assumptions, not estimates of any real market.** Three assets: an NGN equity-index proxy (local vol 20%, 35% stale days), a USD equity proxy (vol 16%), an FGN bond proxy (local vol 5%, high nominal carry); USD/NGN drifts 12% a year with a one-day +45% jump at day 630 (≈ −31% in the USD value of naira assets); innovations are variance-scaled t5. Base currency USD. Core code:
```python
"""Document 5b — Section H worked example on SYNTHETIC data.
Three assets: NGN equity index proxy (NGX-like, thinly traded), USD equity proxy, FGN bond proxy (NGN).
Base currency USD. FX path includes a one-day devaluation jump. Reproducible seed. numpy/pandas only (+scipy if present).
Run: python3 worked_example_5b.py"""
import numpy as np, pandas as pd
rng = np.random.default_rng(5)
T = 1260  # 5 years of trading days
dt = 1/252

# ---------- 1. Synthetic data-generating process (all parameters are ASSUMPTIONS, not estimates) ----------
# True local-currency daily log-returns, correlated: [NGN equity, USD equity, FGN bond]
mu_loc  = np.array([0.22, 0.08, 0.17])        # annual drift in LOCAL currency (NGN nominal rates high)
vol_loc = np.array([0.20, 0.16, 0.05])
corr    = np.array([[1.0, 0.15, 0.10],[0.15, 1.0, 0.00],[0.10, 0.00, 1.0]])
L = np.linalg.cholesky(corr)
z = rng.standard_t(5, size=(T,3)) / np.sqrt(5/3)   # variance-scaled t5 innovations
true_loc = (mu_loc - 0.5*vol_loc**2)*dt + (z @ L.T)*vol_loc*np.sqrt(dt)
# Thin trading: NGN equity prints a zero return (stale price) on 35% of days; the missed move is recovered later
obs = true_loc.copy(); carry = 0.0
stale = rng.random(T) < 0.35
for t in range(T):
    if stale[t]: carry += true_loc[t,0]; obs[t,0] = 0.0
    else:        obs[t,0] = true_loc[t,0] + carry; carry = 0.0
# FX: log USDNGN (NGN per USD). Crawling depreciation 12%/yr, vol 6%, plus a one-day +45% jump (≈ -31% in USD value of NGN) at day 630
fx = 0.12*dt + 0.06*np.sqrt(dt)*rng.standard_normal(T); fx[630] += np.log(1.45)
# Convert NGN assets to USD: r_usd = r_ngn - d(log USDNGN)
usd = obs.copy(); usd[:,0] -= fx; usd[:,2] -= fx
names = ["NGN_equity","USD_equity","FGN_bond"]
R = pd.DataFrame(usd, columns=names)             # daily log returns in USD
Rngn = pd.DataFrame(obs, columns=names); Rngn["USD_equity"] = obs[:,1] + fx   # NGN-base view

print("=== 1. Annualised statistics (USD base, full 5y sample) ===")
stats = pd.DataFrame({"ann_mean": R.mean()*252, "ann_vol": R.std()*np.sqrt(252),
                      "zero_days_local_ccy": (Rngn==0).mean()}).round(4)
print(stats.to_string())
print("\nSample correlation (USD base):\n", R.corr().round(3).to_string())
pre, post = R.iloc[:630], R.iloc[630:]
print("\nCorrelation NGN_equity vs FGN_bond: pre-devaluation %.3f | post %.3f  (shared FX factor dominates in USD terms)" %
      (pre.corr().iloc[0,2], post.corr().iloc[0,2]))

# ---------- 2. Covariance estimators ----------
def lw_identity(X):
    """Ledoit & Wolf (2004, J. Multivariate Analysis) shrinkage toward scaled identity. X: T x N, demeaned inside."""
    Xc = X - X.mean(0); T_, N = Xc.shape
    S = Xc.T @ Xc / T_
    mu = np.trace(S)/N; F = mu*np.eye(N)
    d2 = ((S-F)**2).sum()
    b2 = sum(((np.outer(x,x) - S)**2).sum() for x in Xc)/T_**2
    b2 = min(b2, d2); delta = b2/d2 if d2 > 0 else 0.0
    return (1-delta)*S + delta*F, delta
def lw_constcorr(X):
    """Ledoit & Wolf (2004, J. Portfolio Management) shrinkage toward constant-correlation target."""
    Xc = X - X.mean(0); T_, N = Xc.shape
    S = Xc.T @ Xc / T_; s = np.sqrt(np.diag(S)); C = S/np.outer(s,s)
    rbar = (C.sum()-N)/(N*(N-1)); F = rbar*np.outer(s,s); np.fill_diagonal(F, np.diag(S))
    Y = Xc**2; pi_mat = (Y.T @ Y)/T_ - S**2; pi = pi_mat.sum()
    term1 = ((Xc**3).T @ Xc)/T_; help_ = Xc.T @ Xc/T_; help_diag = np.diag(help_)
    term2 = help_diag[:,None]*S; term3 = help_*np.diag(S)[:,None]; term4 = np.diag(S)[:,None]*S
    theta = term1 - term2 - term3 + term4
    rho = np.trace(pi_mat) + rbar*((1/s)[:,None]*s[None,:]*theta).sum() - rbar*np.trace(theta)  # standard formula
# ... (full script in the repository: LW constant-correlation target, rolling windows, drawdown table, bootstrap, diagnostics, TWR/MWR, Sharpe SE, PIT)
ew = R.mean(axis=1)  # equal-weight, rebalanced daily (approximation using log returns)
tab = pd.DataFrame({n: dd_stats(R[n].values) for n in names} | {"EW_USD": dd_stats(ew.values), "NGN_equity_in_NGN": dd_stats(Rngn["NGN_equity"].values)}).T
print(tab.round(3).to_string())
print("Note: the same NGN equity series shows a mild drawdown in NGN and a deep one in USD — base currency must be stated on every figure.")

# ---------- 4. Bootstrap goal probability with its own uncertainty band ----------
# Goal: USD 100,000 today -> USD 150,000 in 5 years (8.45% p.a.), portfolio = equal weight, no contributions.
def stationary_bootstrap(x, n_paths, horizon, mean_block, rng):
    T_ = len(x); p = 1/mean_block; out = np.empty((n_paths, horizon))
    idx = rng.integers(0, T_, n_paths)
    for h in range(horizon):
        out[:, h] = x[idx]
        new = rng.random(n_paths) < p
        idx = np.where(new, rng.integers(0, T_, n_paths), (idx+1) % T_)
    return out
goal_log = np.log(150_000/100_000); H = 1260
def p_success(sample, n_paths=4000, mean_block=20):
    paths = stationary_bootstrap(sample, n_paths, H, mean_block, rng)
    return (paths.sum(1) >= goal_log).mean()
base = ew.values
p_hat = p_success(base)
# Outer loop: resample the HISTORY itself (block bootstrap of the 5y sample) to express estimation uncertainty
outer = []
for b in range(40):
    hist_b = stationary_bootstrap(base, 1, T, 20, rng)[0]
    outer.append(p_success(hist_b, n_paths=2000))
outer = np.array(outer)
```

**Output (verbatim):**

```
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

Correlation NGN_equity vs FGN_bond: pre-devaluation 0.221 | post 0.783  (shared FX factor dominates in USD terms)

LW shrinkage intensities on the full sample: identity-target delta=1.000, constant-correlation delta=0.985
Same, EXCLUDING the single devaluation day: identity delta=0.023, constant-correlation delta=0.127
-> One structural-break day drives the estimated fourth moments and pushes the shrinkage intensity to its cap; the estimator then returns the target itself. Breaks must be handled explicitly (scenario or dummy), not fed to the estimator as if stationary.

=== 2. Minimum-variance long-only weights, full sample (USD base) ===
            sample  LW_identity(delta=1.00)  LW_constcorr(delta=0.99)    1/N
NGN_equity   0.000                    0.333                     0.134  0.333
USD_equity   0.537                    0.333                     0.479  0.333
FGN_bond     0.463                    0.333                     0.388  0.333

=== 2b. Weight instability: rolling 250-day windows (step 21d) ===
            sample_mean  sample_sd  LWid_mean  LWid_sd  LWcc_mean  LWcc_sd
NGN_equity        0.030      0.029      0.147    0.110      0.063    0.020
USD_equity        0.323      0.270      0.240    0.057      0.320    0.299
FGN_bond          0.647      0.252      0.613    0.160      0.617    0.297
Mean absolute weight change between consecutive windows (turnover proxy): sample 0.076 | LW-identity 0.053 | LW-constcorr 0.084
Small-N caveat: with N=3 and T=250 the sample covariance is already well conditioned, so shrinkage changes little; the instability that remains comes from the data (regime/devaluation), not from estimation noise alone.

=== 2c. Short-history case: 60-day windows (what a new user actually has) ===
            sample_sd  LWid_sd
NGN_equity      0.050    0.070
USD_equity      0.171    0.056
FGN_bond        0.161    0.079

=== 3. Drawdown table (daily, 5y synthetic) ===
                   max_dd  peak_day  trough_day  days_peak_to_trough  days_to_recover  ann_return  ann_vol
NGN_equity         -0.474     627.0       910.0                283.0              NaN       0.067    0.262
USD_equity         -0.143     540.0       671.0                131.0             51.0       0.244    0.169
FGN_bond           -0.399     390.0      1083.0                693.0              NaN      -0.063    0.183
EW_USD             -0.262     572.0       671.0                 99.0              NaN       0.083    0.145
NGN_equity_in_NGN  -0.175     758.0       873.0                115.0            118.0       0.313    0.192
Note: the same NGN equity series shows a mild drawdown in NGN and a deep one in USD — base currency must be stated on every figure.

=== 4. Goal: $100,000 -> $150,000 in 5 years (needs 8.45%/yr), equal-weight USD portfolio ===
Point estimate P(success) = 53.6%  (Monte Carlo SE ±0.8% from 4,000 paths)
Estimation-uncertainty band (resampling the 5y history, 40 reps): 10th-90th pct = 11% – 94%, min–max 2%–100%
Sensitivity to assumed annual drift (shift the historical mean):
   drift shift -4%/yr -> P(success) = 30%
   drift shift -2%/yr -> P(success) = 40%
   drift shift +0%/yr -> P(success) = 52%
   drift shift +2%/yr -> P(success) = 64%
Standard error of the 5y annualised mean return itself: ±6.5%/yr (vol 14.5%, 5 years) -> the drift is essentially unknown

=== 5. Diagnostics for the equal-weight USD portfolio ===
HHI = 0.333 (effective positions 1/HHI = 3.00); diversification ratio = 1.410; effective number of bets (PCA entropy) = 1.64
Risk contributions: {'NGN_equity': np.float64(0.529), 'USD_equity': np.float64(0.139), 'FGN_bond': np.float64(0.332)}
Currency exposure (USD base): NGN 67%, USD 33%

=== 6. TWR vs Modified Dietz, one quarter (63 days), deposit of 50% of start value on day 10 ===
TWR -6.27% | Modified Dietz -5.21% | IRR (money-weighted) -5.21% | end value 142,594
Interpretation: TWR measures the strategy; MWR/IRR measures the investor's experience including timing of the deposit.

=== 7. Sharpe ratio with standard error (Lo 2002, iid formula) ===
USD_equity annualised SR = 1.44 ± 0.45 (1 s.e.) from 1260 daily obs; 95% CI ≈ [0.56, 2.32]

=== 7b. Calibration check: Gaussian forecast applied to fat-tailed (t5) outcomes ===
PIT histogram (10 bins, should be flat at 0.10): [0.079 0.083 0.1   0.113 0.122 0.119 0.119 0.1   0.087 0.079]
Nominal 90% interval covers 91.3%; nominal 99% interval covers 97.1% -> centre over-covered, tails under-covered (Kupiec-type test would reject the 99% band)
```

**Reading the example.**
1. *Covariance sensitivity.* On the full sample the single devaluation day pushes both Ledoit–Wolf intensities to their cap (1.00 and 0.985); without that day they are 0.023 and 0.127. The "shrunk" minimum-variance portfolio is therefore just the target (equal weights for the identity target). With N = 3 the sample covariance is not ill-conditioned; what makes the weights unstable is the data regime — rolling 250-day weights have standard deviations of 25–30 points for the sample estimator and the constant-correlation target, and 6–16 points for the identity target, which is stable only because it is shrinking toward 1/N. On 60-day windows (a new user's reality) the identity-target estimator roughly halves the instability of the USD-equity and bond weights. Conclusion: shrinkage is worth having as a *risk input*; it does not make an optimiser trustworthy, and it must never see break days as ordinary observations.
2. *Drawdown table.* The same NGN equity series has a −17.5% maximum drawdown in naira and −47.4% in dollars; the FGN bond, "safe" in naira, has a −40% dollar drawdown with no recovery in the sample. Base currency is part of the definition of every risk number.
3. *Goal probability.* The point estimate (53.6% ± 0.8% Monte Carlo error) looks precise; resampling the five-year history gives a 10th–90th percentile band of 11%–94%, and shifting the assumed drift by ±2 points a year moves the answer by ±12 points. The standard error of the historical mean return is ±6.5 points a year. The honest product statement is a range, with the reason for its width.
4. *Diagnostics.* HHI 0.333 (three effective positions) but only 1.64 effective bets and 53% of risk from NGN equity; currency exposure 67% NGN. These are the numbers a user can act on without any optimiser.
5. *Performance.* A 50% deposit ten days into a losing quarter: TWR −6.27%, MWR −5.21%. Both are correct answers to different questions.
6. *Sharpe and calibration.* A five-year daily Sharpe of 1.44 carries a one-sigma band of ±0.45. A Gaussian forecaster on t5 outcomes passes casual inspection but fails at the 99% band (97.1% coverage).

### 4.10 Model-selection decision matrix and phasing (item G)

Scores 1 (poor) – 5 (strong). Weights: validity 0.25, data requirements 0.20, stability 0.20, lay interpretability 0.15, compute 0.05, personal-MVP suitability 0.15. Scores are the department's expert judgement (E4) informed by the findings cited.

| Model / module | Validity | Data req. | Stability | Interpretability | Compute | MVP suitability | Weighted | Phase |
|---|---|---|---|---|---|---|---|---|
| Exposure decomposition (asset × currency × issuer) | 5 | 5 | 5 | 5 | 5 | 5 | 5.00 | **1** |
| Descriptive risk (vol, downside, drawdown, HHI, DR, risk contributions) with CIs | 5 | 4 | 4 | 4 | 5 | 5 | 4.45 | **1** |
| Historical/hypothetical stress + reverse stress | 4 | 3 | 5 | 5 | 5 | 5 | 4.40 | **1** |
| TWR + MWR performance ledger, currency decomposition | 5 | 4 | 5 | 4 | 5 | 5 | 4.65 | **1** |
| Ledoit–Wolf covariance (+EWMA second estimate), break isolation | 5 | 3 | 4 | 2 | 5 | 4 | 3.95 | **1** (internal) |
| Block-bootstrap goal engine with uncertainty bands + scenario overlays | 4 | 3 | 3 | 4 | 4 | 5 | 3.85 | **1** |
| Calibration logging (PIT/coverage) | 5 | 2 | 5 | 3 | 5 | 4 | 4.00 | **1** |
| Sharpe/Sortino/Calmar with Lo SE; deflated SR for research | 4 | 3 | 3 | 3 | 5 | 3 | 3.45 | 1 (display rules) |
| Risk-budgeting / risk-parity *display* | 4 | 3 | 4 | 4 | 5 | 3 | 3.75 | 2 |
| Constrained minimum-variance "alternative view" | 3 | 3 | 2 | 2 | 5 | 2 | 2.65 | 2 (gated) |
| Black–Litterman view-expression tool | 3 | 2 | 2 | 3 | 5 | 2 | 2.60 | 2 (gated) |
| CVaR optimisation | 4 | 1 | 2 | 3 | 4 | 1 | 2.45 | Not yet |
| Student-t GARCH simulation (estimated) | 4 | 2 | 2 | 2 | 3 | 2 | 2.55 | 2 research |
| Regime-switching simulation | 3 | 1 | 2 | 2 | 3 | 1 | 2.00 | Not yet |
| DCC-GARCH | 2 | 1 | 1 | 1 | 2 | 1 | 1.35 | Not yet |
| Mean–variance (unconstrained) | 2 | 1 | 1 | 1 | 5 | 1 | 1.40 | Not yet |
| Resampled efficiency / robust MV | 2 | 1 | 3 | 1 | 3 | 1 | 1.75 | Not yet |
| Hierarchical risk parity | 3 | 2 | 3 | 1 | 4 | 1 | 2.30 | Not yet |
| Kelly / fractional Kelly | 2 | 1 | 1 | 2 | 5 | 1 | 1.60 | Do not build |

### 4.11 Statements the product may and may not make

| May say (with inputs, as-of date and base currency attached) | May not say |
|---|---|
| "Your portfolio's yearly swing over the last 3 years was about 18% in USD (range 15–22% allowing for estimation error)." | "Your expected return is 11.3%." |
| "67% of your money and 53% of your risk is exposed to the naira." | "You should move 20% into US equities." |
| "In the 2023 naira unification, a portfolio like this would have lost about 31% in USD terms." | "There is a 2% chance of losing more than 31%." (unless from a labelled, calibrated distribution) |
| "To reach $150,000 in 5 years you need about 8.4% a year; mixes that have delivered this over rolling 5-year windows did so in n of m windows and carried drawdowns of up to x%." | "This goal is 54% likely." (point probability without a band) |
| "The chance of reaching the goal is somewhere between roughly 10% and 90%; the range is wide because five years of data cannot pin down average returns." | "Our model forecasts…" |
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
| Using LLM prose to restate numbers | Lesson 4 in the brief; all figures must come from the calculation layer with provenance. |

## 6. Cross-department dependencies

**We need from others.**
- *Data architecture / market data:* daily closes with venue, timestamp, currency, zero-volume and limit-day flags for NGX, DFM, ADX and US holdings; total-return indices with documented methodology; official FX series (CBN/FMDQ) and a way to store the user's transacted rates; NGX ASI history for 2008–09 and an S&P 500 2007–09 series from a licensed source; confirmation of the current NGX rulebook (price limits, tiered price-movement thresholds, trading hours, settlement cycle — 2026 press reports cite T+1 from 1 June 2026 and changed hours; unverified) [S156]; licence status of every benchmark.
- *Personal-finance ledger (System A):* reconciled positions and dated external cash flows; identification of inter-account transfers so they are not counted as flows.
- *Tax:* after-tax return inputs (withholding on NGX dividends, capital-gains treatment) so that the goal engine can run pre- and post-tax.
- *Behavioural finance:* how to display probability ranges without inducing over- or under-reaction; evidence on whether showing drawdown tables changes behaviour.
- *Product/UX:* plain-language templates for every metric in §4.3; a mandatory "assumptions" panel.
- *Engineering:* a Web Worker/CI-testable calculation layer; seedable RNG; golden-test harness.
- *Compliance/legal:* review of §4.11; confirmation that scenario and range outputs are not "investment advice" under Nigerian SEC and UAE SCA/DFSA rules (unknown — must be checked by counsel).
- *Founder:* base currency; cash-rate benchmark; whether any NGN hedging instrument is accessible to them.

**Others need from us.** The metric definitions and provenance schema (§4.1, §4.3); the scenario library with sources (§4.4); the validation protocol (§9); the list of permitted statements (§4.11); the data-quality floors per model (§4.6) that the data team must enforce upstream.

## 7. Risks, open uncertainties and disagreements

**Disagreement 1 — any optimiser in the MVP?** *Optimisation specialist:* a constrained minimum-variance or risk-budgeting view, labelled "one alternative, not a recommendation", helps the user see the trade-off between naira carry and dollar stability; withholding it is paternalistic. *Statistician:* weights with 25–30-point standard deviations (§4.9) are noise dressed as advice; a lay user will act on them; the product's credibility rests on not doing this. *Quantitative portfolio researcher (tie-breaker proposal):* no optimiser in Phase 1; in Phase 2, enable the "alternative views" module only when the user's own data pass a stability gate — weights from two halves of the history within 10 points of each other and a bootstrap weight SD below 10 points — and show it with the band, never a point. Unresolved; founder to decide after seeing Phase 1 data.

**Disagreement 2 — bootstrap versus parametric simulation.** *Financial econometrician:* the bootstrap cannot produce a devaluation that is not in the sample, so a parametric or regime model with a crisis state is more honest for NGN. *Statistician:* a regime model's crisis parameters are themselves assumptions; make them explicit as scenario overlays on the bootstrap instead of hiding them in a transition matrix. Resolution adopted: bootstrap + explicit, user-visible scenario overlays (§4.7); revisit if calibration tests fail.

**Disagreement 3 — which FX rate is "true".** Official, NAFEM/interbank and parallel rates have diverged by large margins in Nigeria. *Financial data scientist:* use the official series for history and the user's own transacted rate for their flows. *Risk analyst:* risk should be measured at the rate at which the user could actually convert, which may be the parallel rate. Resolution: store both, label both, let the user choose the valuation rate, and show the gap.

**Open uncertainties.** (a) Real NGX zero-return-day fractions and their effect sizes are unmeasured; our thin-trading numbers are synthetic. (b) Whether retail access to naira hedges exists. (c) Current NGX microstructure rules (changed in 2026; sources conflict). (d) GIPS text not re-read; the TWR/MWR provisions are stated from the standard's known structure. (e) The 97.5% ES level in the BIS standard was not re-read in this session. (f) Regulatory classification of range-based goal outputs. (g) Whether the founder's holdings include instruments (private funds, fixed deposits, real estate) whose valuations are appraisal-smoothed; if so, unsmoothing (F18) applies to them too.

**Risks.** False precision is the dominant product risk; the mitigations are bands, rounding, sensitivity lines and calibration logging. The second risk is silent data corruption (stale prices, mixed FX sources) producing fictitious returns; the mitigation is provenance on every figure and the floors in §4.6. The third is scope creep toward sophisticated models because they are available; the mitigation is the founder's rule, applied through the gate in Disagreement 1.

## 8. Recommendations, ranked

| Rank | Recommendation | Class |
|---|---|---|
| 1 | Exposure decomposition by asset, issuer, sector, country and currency (denomination and economic), with provenance on every row | Personal-MVP must-have |
| 2 | TWR and MWR performance ledger with currency decomposition and the TWR–MWR gap explained | Personal-MVP must-have |
| 3 | Descriptive risk analytics with confidence intervals and base-currency switch (vol, downside, drawdown table, HHI, DR, risk contributions, stress-conditional correlation) | Personal-MVP must-have |
| 4 | Scenario library (2008, 2014–16 oil/2016 float, 2020, 2022, 2023 unification) + hypothetical and reverse stress tests, each with sources | Personal-MVP must-have |
| 5 | Ledoit–Wolf covariance with EWMA cross-check and break isolation, used only as an input to 3 and 6 | Personal-MVP must-have (internal) |
| 6 | Goal Reality Engine: stationary-block-bootstrap ranges with estimation-uncertainty band, drift sensitivity, scenario overlays, sequence-risk view, and the statement contract of §4.11 | Personal-MVP must-have |
| 7 | Calibration logging and PIT/coverage tests from the first forecast | Personal-MVP must-have |
| 8 | Sharpe/Sortino/Calmar display rules (Lo SE; "not distinguishable from zero" wording) | Personal-MVP must-have |
| 9 | Rebuild simulation engine from tests upward (seedable RNG, golden values, Web Worker); retire `MonteCarloPanel.tsx` and `PerformancePanel.tsx` as they stand | Personal-MVP must-have (engineering) |
| 10 | Risk-budgeting display (risk contributions and the volatility-balanced weights as one labelled alternative) | Later |
| 11 | Constrained minimum-variance and Black–Litterman "alternative views" behind the stability gate | Later |
| 12 | Estimated Student-t GARCH and regime-switching research engines, offered only if they pass calibration tests against the bootstrap | Later |
| 13 | Asset-class × currency Brinson attribution once licensed benchmarks exist | Later |
| 14 | CVaR optimisation, DCC-GARCH, HRP, resampled/robust mean–variance, point return forecasts | Do-not-build (yet) |
| 15 | Kelly sizing; any "edge score" or sizing advice | Do-not-build |

**Five-question test on the top items.**

*Recommendation 1–3 (exposure, performance, descriptive risk).* (1) Problem: the founder cannot currently see what they own in one currency, what it has actually earned after cash flows, or where the risk sits. (2) Who: the founder now; every multi-currency retail user later. (3) Evidence: measurement standards (GIPS/Dietz, Brinson/Karnosky–Singer decomposition) and the concentration/diversification literature [S69–S71, S78, S79, S95–S97] — E1/E3; the numbers require no forecasting. (4) Build/validate: deterministic calculations with analytic unit tests and golden ledgers (§9); the main risk is data quality, handled by floors and badges. (5) Improvement metric: fraction of positions with complete provenance; reconciliation error between ledger value and sum of priced positions < 0.1%; user-reported decisions changed after seeing currency exposure (behavioural team to measure).

*Recommendation 4 (stress library).* (1) Problem: the dominant risk for a naira-based investor is a regime event that volatility statistics do not capture. (2) Who: anyone with NGN assets and USD goals. (3) Evidence: the devaluation and oil series themselves [S84–S88]; the crisis-correlation literature [S73–S77] — E2. (4) Build/validate: deterministic shock application; test by re-applying each scenario to a portfolio that existed at the time and comparing to realised P&L (data team to supply). (5) Improvement: scenario loss vs realised loss error in future events; user comprehension tests.

*Recommendation 5 (Ledoit–Wolf).* (1) Problem: sample covariances on short windows are noisy, and portfolio risk needs a covariance. (2) Who: the risk module. (3) Evidence: [S15–S18], scikit-learn reference implementation [S157], our experiment — E1. (4) Build/validate: golden test against `sklearn.covariance.LedoitWolf`; break-day exclusion test (§4.9). (5) Improvement: out-of-sample portfolio-variance forecast error (QLIKE) vs sample and EWMA, evaluated monthly.

*Recommendation 6–7 (goal engine + calibration).* (1) Problem: goals like "$100k targeting x%" are currently judged by intuition or by false-precision calculators. (2) Who: the founder (System E), later retail users. (3) Evidence: bootstrap theory [S121–S124], parameter-uncertainty results [S128–S133], weak predictability [S110–S113], calibration methods [S136–S141] — E1. (4) Build/validate: unit tests on bootstrap moments; coverage tests on synthetic data with known truth; then live PIT logging. (5) Improvement: coverage of the 50%/90% bands within ±10 points after 24 monthly outcomes; the engine is withdrawn from display if it fails twice in succession.

*Recommendation 9 (rebuild engine).* (1) Problem: current code produces wrong numbers (§4.8). (2) Who: everyone downstream. (3) Evidence: direct replication of defects — E2. (4) Build/validate: §9. (5) Improvement: 100% of displayed statistics covered by analytic or golden tests; reproducibility of any result from (inputs, seed, version).

## 9. Required validation before implementation

1. **Analytic unit tests** (must pass before any UI): GBM moments; scaled-t variance; GARCH unconditional variance and persistence; Merton compensator; OU stationary variance; barrier-hit probability vs closed form; max drawdown on hand-built paths; HHI/DR/risk contributions on 2-asset cases with closed-form answers; TWR/MWR on hand-computed ledgers (including a case with a mid-period flow where TWR and MWR differ in sign); multicurrency decomposition identity R_B = R_L + R_FX + R_L·R_FX to 1e-12; Lo SE formula against a Monte Carlo of iid Sharpe ratios.
2. **Golden datasets:** frozen synthetic ledger and price panel (the §4.9 generator, versioned) with stored outputs; Ledoit–Wolf cross-checked against scikit-learn to 1e-8; bootstrap engine checked for reproducibility by seed and for mean/variance preservation.
3. **Out-of-sample tests:** rolling-origin evaluation of covariance estimators (sample, EWMA, LW) by realised portfolio variance and QLIKE; rolling evaluation of any "alternative view" weights by turnover and realised volatility against 1/N — a module that does not beat 1/N on realised risk out of sample is not shown.
4. **Calibration tests:** PIT histogram and Berkowitz test on synthetic data with known DGP (must pass), on misspecified DGP (must fail), then live.
5. **Sensitivity analysis:** every displayed figure gets a sensitivity table over window length (60/250/500 d), estimator, base currency, FX source and inclusion/exclusion of break days; figures whose sign or decile changes across these settings are shown with a "fragile" badge.
6. **Data-quality gates:** the floors in §4.3/§4.6 enforced in code; a metric below its floor is suppressed or badged, never silently computed.
7. **Thin-trading tests:** Dimson vs OLS beta on real NGX names once data exist; vol at daily vs weekly frequency; results documented before any beta is displayed.
8. **Human review:** a regulated financial adviser and counsel review §4.11 before anything leaves personal use; a statistician signs off the calibration protocol.

## 10. Sources

Verification key: **[verified]** = DOI resolved on OpenAlex/Crossref with matching title, first author and year (print year given; "online year n" noted where OpenAlex records an earlier online date); **[unverified]** = could not be checked in this session. Access dates: academic checks 2026-11-02 and 2026-11-04; web pages as stated.

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
- S43. Raffinot, T. (2017). Hierarchical Clustering-Based Asset Allocation. *JPM* 44(2), 89–99. doi:10.3905/jpm.2018.44.2.089 [verified; online 2016]
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
- S65. Basel Committee on Banking Supervision (2009). *Principles for sound stress testing practices and supervision*. https://www.bis.org/publ/bcbs155.htm [unverified — not fetched]
- S66. Magdon-Ismail, M., Atiya, A. F., Pratap, A. & Abu-Mostafa, Y. S. (2004). On the maximum drawdown of a Brownian motion. *Journal of Applied Probability* 41(1), 147–161. doi:10.1239/jap/1077134674 [verified]
- S67. Chekhlov, A., Uryasev, S. & Zabarankin, M. (2005). Drawdown Measure in Portfolio Optimization. *IJTAF* 8(1), 13–58. doi:10.1142/S0219024905002767 [verified]
- S68. Goldberg, L. R. & Mahmoud, O. (2017). Drawdown: from practice to theory and back again. *Mathematics and Financial Economics* 11, 275–297. doi:10.1007/s11579-016-0181-9 [verified; online 2016]
- S69. Woerheide, W. & Persson, D. (1993). An Index of Portfolio Diversification. *Financial Services Review* 2(2), 73–85. doi:10.1016/1057-0810(92)90003-U [verified; online 1992]. (HHI itself: Hirschman 1964, *AER* — lookup failed; [unverified])
- S70. Choueifaty, Y. & Coignard, Y. (2008). Toward Maximum Diversification. *JPM* 35(1), 40–51. doi:10.3905/JPM.2008.35.1.40 [verified]
- S71. Meucci, A. (2009). Managing Diversification. *Risk* 22(5), 74–79. [unverified — not indexed]
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
- S85. June 2023 naira unification: Nairametrics, "Exchange rate: Naira depreciates by 13.9% in one week", 24 Jun 2023, https://nairametrics.com/2023/06/24/exchange-rate-naira-depreciates-by-13-9-in-one-week ; Political Economist (Reuters report), "Nigeria allows naira to drop more than 36% on official market", https://www.politicaleconomistng.com/?p=146446 (both accessed 2026-11-04) [secondary]
- S86. June 2016 float: Africanews, "Naira devalues against dollar after flexible forex policy takes off", 20 Jun 2016, https://africanews.com/2016/06/20/naira-devalues-against-dollar-after-flexible-forex-policy-takes-off ; Nairametrics, 20 Jun 2016, https://nairametrics.com/2016/06/20/results-are-in-nigerias-new-official-exchange-rate-after-currency-float/ (accessed 2026-11-04) [secondary]
- S87. FRED series DCOILBRENTEU (Crude Oil Prices: Brent — Europe; source US EIA). https://fred.stlouisfed.org/graph/fredgraph.csv?id=DCOILBRENTEU (fetched 2026-11-02) [primary data]
- S88. FRED series SP500 (S&P Dow Jones Indices). https://fred.stlouisfed.org/graph/fredgraph.csv?id=SP500 (fetched 2026-11-02; 10-year window) [primary data]

**Liquidity and reverse stress**
- S89. Amihud, Y. (2002). Illiquidity and stock returns. *Journal of Financial Markets* 5(1), 31–56. doi:10.1016/S1386-4181(01)00024-6 [verified]
- S90. Lesmond, D. A., Ogden, J. P. & Trzcinka, C. A. (1999). A New Estimate of Transaction Costs. *RFS* 12(5), 1113–1141. doi:10.1093/rfs/12.5.1113 [verified]
- S91. Lesmond, D. A. (2005). Liquidity of emerging markets. *JFE* 77(2), 411–452. doi:10.1016/j.jfineco.2004.01.005 [verified]
- S92. Bekaert, G., Harvey, C. R. & Lundblad, C. (2007). Liquidity and Expected Returns: Lessons from Emerging Markets. *RFS* 20(6), 1783–1831. doi:10.1093/rfs/hhm030 [verified]
- S93. Roll, R. (1984). A Simple Implicit Measure of the Effective Bid-Ask Spread. *Journal of Finance* 39(4), 1127–1139. doi:10.1111/j.1540-6261.1984.tb03897.x [verified]
- S94. Grundke, P. (2011). Reverse stress tests with bottom-up approaches. *Journal of Risk Model Validation* 5(1), 71–90. doi:10.21314/JRMV.2011.068 [verified]

**Performance measurement**
- S95. Dietz, P. O. (1966). *Pension Funds: Measuring Investment Performance*. Free Press. [unverified — book]
- S96. CFA Institute (2019). *2020 Global Investment Performance Standards (GIPS) for Firms*. https://www.gipsstandards.org/wp-content/uploads/2021/03/2020_gips_standards_firms.pdf (fetched 2026-11-04; text extraction failed) [unverified text]
- S97. Dichev, I. D. (2007). What Are Stock Investors' Actual Historical Returns? *AER* 97(1), 386–401. doi:10.1257/aer.97.1.386 [verified]
- S98. Lo, A. W. (2002). The Statistics of Sharpe Ratios. *FAJ* 58(4), 36–52. doi:10.2469/faj.v58.n4.2453 [verified]
- S99. Jobson, J. D. & Korkie, B. M. (1981). Performance Hypothesis Testing with the Sharpe and Treynor Measures. *Journal of Finance* 36(4), 889–908. doi:10.1111/j.1540-6261.1981.tb04891.x [verified]
- S100. Ledoit, O. & Wolf, M. (2008). Robust performance hypothesis testing with the Sharpe ratio. *Journal of Empirical Finance* 15(5), 850–859. doi:10.1016/j.jempfin.2008.03.002 [verified]
- S101. Opdyke, J. D. (2007). Comparing Sharpe ratios: So where are the p-values? *Journal of Asset Management* 8(5), 308–336. doi:10.1057/palgrave.jam.2250084 [verified]
- S102. Sortino, F. A. & van der Meer, R. (1991). Downside risk. *JPM* 17(4), 27–31. doi:10.3905/jpm.1991.409343 [verified]
- S103. Young, T. W. (1991). Calmar ratio: a smoother tool. *Futures* 20(1), 40. [unverified — trade magazine]
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
- S159. NGX All-Share Index annual returns: ThisDay, "NGX ASI Closes 2024 With Impressive Annual Growth of 37.65%", 1 Jan 2025, https://www.thisdaylive.com/2025/01/01/ngx-asi-closes-2024-with-impressive-annual-growth-of-37-65/ ; Prime Business Africa, "NGX Records 37.65% Growth, Ends 2024 On High Note" (2023: +45.90% to 74,773.77; 2024: +37.65% to 102,926.40, naira terms). No source found for USD-terms returns (accessed 2026-11-04). [secondary]

*Scripts (this repository):* `docs/portfolio-os/research/scripts/worked_example_5b.py`, `prototype_checks.py`, `thin_trading_demo.py` — run on 2026-11-04 with numpy 2.5.3, pandas 3.0.5, scipy 1.18.1; outputs quoted verbatim in §4.

## Appendix A. Verbatim output of `scripts/prototype_checks.py` (2026-11-04)

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
```
