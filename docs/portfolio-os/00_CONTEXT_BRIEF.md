# Portfolio OS — Shared Context Brief for All Specialist Teams

**Version:** 0.2 · **Date:** 2026-11-04 (v0.1 2026-11-02) · **Prepared by:** Programme coordinator (Claude) for the founder
**Status:** Binding for every specialist assignment in Stage 1–3. Read it fully before researching.

---

## 0. How to use this brief

You are one specialist team inside a virtual, venture-backed financial-intelligence company. The founder has asked for the
intellectual standards of institutional finance, the methodological discipline of an academic research organisation, the
product discipline of a strong technology company, and the customer focus of a YC-style startup. Your output is a formal
deliverable that other departments will challenge. Write for a demanding investment committee, not for a chat window.

## 1. Provenance — what we actually know and what we do not

- **Source of truth:** the founder's master prompt dated 2026-11-02. Its requirements are summarised in §2–§6 below.
- **Prior conversations are NOT available.** The founder refers to earlier chats (requirements, a Nigerian equity research
  tracker, a private-equity "Deal Radar", an AML/financial-operations venture). None of that content is accessible in this
  session. The repository `alhameenoki1-prog/Terminal-` contains a different product (a Bloomberg-style day-trading
  dashboard called NEXUS: React 18 + Vite + Zustand + Tailwind, no backend, no tests, no CI). No Portfolio OS code,
  behavioural work or tax work exists in the repo, in the founder's claude.ai artifact list, or in the Drive files we were
  able to search. **Do not invent prior decisions.** Where a prior decision would matter, write "unknown — founder to confirm".
- **Lessons carried over (evidence from the founder and the repo):**
  1. The founder reports that a previous Nigerian equity research tracker produced outdated or inaccurate market figures.
  2. The repo shows the unsourced-constant anti-pattern: the Central Bank of Nigeria policy rate is hardcoded (27.50) with a
     "next meeting" date in March 2026 inside `src/data/countryProfiles.ts`. Numbers with no source, timestamp or refresh path.
     *Correction (v0.2, 2026-11-04, from review R05c):* the value was **wrong when committed** (commit d9ad9d5, 2026-03-02),
     not merely stale later. CBN's decisions page shows 26.5% from February 2026, and no MPC met in March 2026. Expiry
     controls alone would not have caught it; values must be checked against a primary source at the moment of entry.
  3. The repo's data layer relies on unofficial or fragile endpoints (Yahoo Finance v8 chart API, Stooq CSV, rss2json
     proxies, CBOE CDN JSON) with no provenance, licence or freshness metadata attached to any value.
  4. The repo's AI feature injects live numbers into a prompt for a Groq-hosted Llama model and lets the model restate them in
     prose, with no tool-based calculation or validation. This is exactly how fabricated or stale figures leak into output.
  5. API keys are persisted in browser localStorage via the Zustand `persist` middleware.
  6. The repo already contains a client-side Monte Carlo engine (GBM, GARCH(1,1), Ornstein-Uhlenbeck, Merton jump-diffusion,
     Student-t innovations, 2-asset Cholesky). Treat it as a prototype to be evaluated, not as validated infrastructure.

## 2. The product in one paragraph

**Portfolio OS** is a financial-intelligence operating system for an individual (first user: the founder) that combines
personal finance, behavioural finance, investment research, quantitative portfolio management, financial planning and
taxation into one interconnected system. It ingests bank statements, savings and investment records across Nigeria (NGN),
the UAE (AED) and international (USD) accounts; reconstructs an auditable financial ledger; measures financial behaviour
with scientific restraint; researches securities on NGX, DFM/ADX and US markets from validated data; manages portfolio
risk; tests goals against reality; forecasts wealth under scenarios; prepares Nigerian and UAE tax positions; and explains
everything in plain language through an AI interface that never fabricates figures. It starts as a personal system and is
architected so that it can become a Nigerian financial-technology company if the evidence justifies it.

## 3. The nine interconnected systems (the founder's full vision — preserve it)

| ID | System | What it must do |
|----|--------|-----------------|
| A | Financial data & personal finance | Combine bank statements, savings, investment records; classify transactions; detect income; cash-flow, spending, net-worth, budgeting, liabilities, planning; handle inter-account transfers, investment contributions, foreign currency, duplicates |
| B | Behavioural finance intelligence | Research-backed analysis of spending, habits, investment decisions, risk perception; evidence-graded conclusions; constructive, tested interventions |
| C | Investment research | NGX, UAE, US and other markets; securities, financial statements, valuation, fundamentals, earnings, cash flows, dividends, macro, risks; conclusions traceable to validated data |
| D | Portfolio management & quant analytics | Concentration, diversification, currency exposure, volatility, drawdowns, correlations, risk-adjusted performance, optimisation alternatives |
| E | Goal Reality Engine | Evaluate objectives realistically (e.g. $100,000 targeting a return): opportunities, risks, instruments, assumptions, alternative structures; never promise returns; optimisation is not forecasting |
| F | Forecasting & wealth planning | Link income, spending, savings, contributions, taxes, inflation, FX and long-term goals; scenarios and trade-offs |
| G | Tax intelligence | Nigerian and UAE obligations; calculate amounts; prepare filing information; support official filing where legal and technically permitted |
| H | AI research & explanation | Answer complex questions by retrieving, validating, calculating and explaining; no fabricated figures, no unsupported assumptions stated as fact |
| I | Future commercialisation | Architecture that can scale into a Nigerian fintech; market, segments, differentiation, regulation, distribution, pricing, viability |

**Boundaries:** do not merge this platform with the founder's separate private-equity Deal Radar or the AML/financial-
operations venture. Note reusable capabilities, but design Portfolio OS on its own objectives.

## 4. Users, markets and circumstances

- **First user:** the founder, for personal use. Assume a multi-currency financial life across Nigeria and the UAE with
  international investments. Do **not** assume tax residency, employment type, income level or citizenship — flag these as
  inputs the system must capture and the founder must confirm.
- **Markets in scope:** Nigerian Exchange (NGX), Dubai Financial Market (DFM), Abu Dhabi Securities Exchange (ADX), US
  exchanges, relevant fixed income (FGN bonds/T-bills, UAE and US government and corporate bonds), savings products, funds.
- **Longer term:** Nigerian retail, mass-affluent and diaspora customers; later other markets.

## 5. Non-negotiable standards

1. **Financial accuracy is non-negotiable.** Every figure that could reach a user must carry: source, timestamp/as-of date,
   unit and currency, and a validation status. Calculations must be reproducible from stored inputs.
2. **Evidence grading.** Tag every important claim with one of:
   - **E1** peer-reviewed and replicated / meta-analytic evidence
   - **E2** single peer-reviewed study, or an official regulatory, government or exchange publication
   - **E3** authoritative textbook, standards body, or credible institutional/practitioner source
   - **E4** expert judgment (state whose discipline and why)
   - **E5** engineering assumption (state how it will be tested)
   - **E6** speculative product concept (state what evidence would validate it)
3. **Citations.** Real sources only. Give title, publisher/author, year, URL and the date you accessed it. Academic citations
   must be checked with the reference-lookup tool (`verify_reference` / `search_works` / `lookup_reference`, which query
   OpenAlex and arXiv) and marked **[verified]** or **[unverified]**. If you cannot verify a source, say so and downgrade the
   claim. Never cite from memory alone for anything that matters.
4. **Time-sensitive facts** (tax law, regulation, licences, API pricing, data availability, market rules) must be checked
   against current sources. State the effective date of the rule and the date you checked it. Nigerian tax law in particular
   has been reformed recently; verify what is in force and from when rather than relying on training memory.
5. **Simulated specialists are not licensed professionals.** Mark clearly where a licensed accountant, tax practitioner,
   lawyer or regulated financial adviser must review before anything is relied upon or shipped.
6. **No investment advice framing, no promised returns.** Present ranges, assumptions and uncertainty.
7. **Synthetic data only** for examples until the data architecture and privacy controls are approved.
8. **Preserve disagreement.** If evidence conflicts or departments would disagree, write it down with both positions and a
   proposed resolution path. Do not manufacture consensus.
9. **Do not quietly remove requested features.** If something is unrealistic, unsupported, too expensive or legally
   restricted, say why and propose the soundest alternative that still serves the founder's intent.

## 6. Two tests every proposal must pass

**The five-question test (all capabilities):**
1. What real problem does it solve? 2. Who needs it and why? 3. What evidence supports the approach?
4. How can we build and validate it reliably? 5. What measurable improvement would justify continued development?

**The eight-question test (behavioural features, in addition):**
1. What academic theory supports it? 2. What empirical evidence exists (and how strong)? 3. What data is required?
4. How is the variable measured? 5. What alternative explanations produce the same observation?
6. How will the system avoid unsupported conclusions? 7. What intervention, if any, is appropriate?
8. How will we evaluate whether it improves financial decisions?

Also distinguish, for any behavioural claim: (i) directly observable behaviour; (ii) statistically measurable pattern;
(iii) psychological explanation supported by evidence; (iv) hypothesis requiring testing; (v) conclusion that cannot be
legitimately established from available data.

## 7. Mandatory deliverable format

Begin with a metadata block:

```
Document: <number and title>
Department: <department>  ·  Lead role(s): <roles you are simulating>
Version: 0.1 draft  ·  Date: 2026-11-02  ·  Status: for cross-department review
Reviewers required: <departments that must review this>
```

Then these numbered sections (keep the numbering so reviewers can reference them):

1. **Executive summary** (≤ 300 words; lead with conclusions and the biggest uncertainty)
2. **Scope and method** (questions addressed, what you searched, which tools you used, what you could not access)
3. **Findings** (numbered F1, F2…; each with evidence grade and source numbers)
4. **Proposed framework / specification for Portfolio OS** (concrete: inputs, methods, outputs, uncertainty handling,
   limitations, validation; use tables; include at least one worked example with synthetic numbers where useful)
5. **Alternatives considered and rejected** (and why)
6. **Cross-department dependencies** (what you need from other teams; what they need from you)
7. **Risks, open uncertainties and disagreements** (preserve them)
8. **Recommendations, ranked** — classify each as *Personal-MVP must-have*, *Later*, or *Do-not-build (yet)*, with the
   five-question test applied to the top items
9. **Required validation before implementation**
10. **Sources** (numbered; title, author/publisher, year, URL, access date, verification status)

Length: substantive — typically 4,000–9,000 words — with no padding. Prefer tables for comparisons. Write in clear English;
expand acronyms on first use; no marketing language.

## 8. Working conventions

- Write your deliverable to the exact file path in your assignment, in Markdown. Then return to the coordinator a summary of
  **at most 400 words**: top findings, top recommendations, key disagreements or uncertainties, what you could not verify,
  and questions for other departments.
- Today's date is **2026-11-02**. Use it when judging freshness.
- Tools: `WebSearch` and `WebFetch` (or the web-fetch agent) for current sources; the reference-lookup tools for academic
  citations (if they appear only as deferred tools, load them with ToolSearch `select:` first); Python 3 for calculations.
- **Do not read or use the founder's private Google Drive documents or email.** They are out of scope for research.
- **Do not write application code into `src/`.** This is the research and design phase. Illustrative pseudocode or small
  calculation scripts in your document are fine.
- If a question cannot be answered with available tools, say so explicitly rather than guessing.
