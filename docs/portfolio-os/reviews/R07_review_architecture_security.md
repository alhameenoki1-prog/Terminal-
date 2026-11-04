Review of: Document 7 — Technology and Open-Source Research Report (v0.1, 2026-11-02)  ·  Reviewer roles: security red-teamer; principal engineer (production financial ledgers); AI-systems engineer; open-source licensing researcher; delegate of the methodology owners (Docs 3–6)  ·  Date: 2026-11-04  ·  Verdict: **Major revision**

## 1. Verdict and the three most important problems

Document 7 is well researched. Its licence metadata and its Anthropic model IDs and prices held up when I re-checked them. Its architecture is sound, but three problems keep it from the Investment Committee:

1. **The "no number without a tool result" gate is weaker than the contract in Docs 5c, 6 and 8, and it can be bypassed.** The model writes the digits itself. The gate accepts any value found anywhere in the trace, within 0.5%, including raw statement text from `documents.search`.
2. **The ledger specification cannot be built as written, and it conflicts with Docs 4 and 6.** The three documents use three posting models. A `CHAR(3)` currency column cannot hold security units. The worked example claims to balance "exactly" and does not. Single-entry transfers break cut-off.
3. **The privacy and security posture contradicts itself and is too heavy for one person.** Raw statements would go to the Batch API, which keeps data for 29 days and is not eligible for zero data retention (ZDR). The privileged model *does* see raw document text. There are no effort estimates, and the main single-user risks are missing: parser exploits, browser-side exposure and key loss.

## 2. Findings, severity-ranked

### Blocking

**B1 — The numeric-fidelity gate does not enforce "no number without a tool result" (§4.6 "defence in depth", §4.12(c), F19).**
*Claim:* the model writes `answer_markdown`. A validator masks dates and identifiers, then checks each remaining numeral against "the set of values returned by tool calls in the trace", with a tolerance of 0.5% relative or the display rounding, whichever is larger.
*Why it is wrong.*
- (a) The trace includes `documents.search` chunks, which are raw statement text. Any number printed in an unvalidated (or attacker-crafted) memo field therefore passes the gate.
- (b) Matching against a set of values ignores meaning. "Drawdown 8.12%" passes when 0.0812 was actually the TWRR (time-weighted rate of return). Normalising "−23.45%" can drop the sign. "Fractions treated as percentages" makes 0.4167 match both "41.67%" and "0.42".
- (c) A 0.5% tolerance is not fidelity. NGN 4,100,000 passes against a tool value of NGN 4,084,410 (0.38% apart).
- (d) A numeral regex misses "twelve percent", "a third", "doubled", and also "between 5 and 7" once the ranges are tokenised away.
- (e) `calc.derive` lets the model choose the operands and the operation. A meaningless ratio, or the wrong FX path, still produces a "tool result".

*Contradiction with other documents:* Doc 5c §4.3.12 already specifies a stronger design. The renderer substitutes `{{figure:…}}` and `{{calc:…}}` tokens, "the model's own digits are not rendered", and any numeric token that is not a token is rejected. Doc 8 Component B says the model "never produces the number". Doc 6 §4.3 says the explanation layer "may only render `steps[]`".

*Evidence:* the document's own smoke test (§4.12c) checks only string presence. My reading of §4.6 against Doc 5c §4.3.12, Doc 8 §4.1 and Doc 6 §4.3.

*Fix:* make token substitution the binding contract, and demote the gate to a backstop that rejects any free digit or number word. Each figure reference must carry its semantic field (`field`, `unit`, `currency`, `sign`). Retrieval chunks must have numbers masked, or be marked ineligible as figure sources. `calc.derive` must become a registry of named, typed formulas with unit and currency checks; it must not be free arithmetic.

**B2 — The ledger model is internally inconsistent and unreconciled with Docs 4 and 6 (§4.2, §4.12a, §4.3 module 1).**
- *Three posting models exist.* Doc 4 §4.2 uses a signed `amount` + `ref_rate_to_base` + `base_amount`, with Σ base_amount = 0 in one base currency. Doc 6 §4.1 uses `account_dr`, `account_cr`, `amount`, `fx_rate`. Doc 7 uses per-currency Beancount weights. These give different balancing invariants, different FX-gain mechanics and different schemas, and Doc 7 does not say which one wins.
- *`currency CHAR(3)` cannot hold security units.* The document adopts Beancount semantics, where a commodity can be a ticker or ISIN, and Doc 4 says "securities use the security code as commodity". A 3-character ISO column cannot hold the units of NGX:BANKX unless they are smuggled into `lot_id`.
- *The worked example does not balance as claimed.* §4.12(a) says "2,722.94 × 3.6725 = 10,000.00 AED" and "per-currency sums are exactly 0.00". Recomputed with `Decimal`, the product is 9,999.997150 AED, so the AED weight residual is −0.00285 AED. It nets to zero only after quantisation or tolerance. The example also puts the residual "as metadata on posting 3", which contradicts §4.2.3 ("residuals are booked to an `Equity:FX-Rounding` account rather than silently dropped").
- *No conversion-cost posting.* Doc 4 §4.2 requires the spread between the implied rate and the reference rate to be posted to `Expenses:FX:ConversionCost`. The example has no such posting.
- *Single-entry transfers (§4.2.1) break in practice.* The debit and the credit usually arrive on different statements, on different value dates and sometimes in different periods. Doc 6 matches transfers within ±3 days and allocates periods by value date. A single entry has one date. The `Assets:Transit:USD` legs inside one entry net to zero and model nothing.

*Fix:* write one canonical posting specification, signed off by the Doc 4 and Doc 6 owners. It should carry a commodity column (ISO 4217 code or instrument id), keep `base_amount` as a derived view, and make the rounding and FX-cost accounts mandatory. Model transfers as two linked entries through an in-transit account. Re-run the worked example under that specification.

### Major

**M1 — The hosted-LLM data path contradicts the privacy posture (§4.6 "Model choice", ADR-7, F16, F24).**
- *Batch retention.* The document recommends `claude-haiku-5-5` "via the Batch API for bulk extraction" of statements. Anthropic's feature-eligibility table marks Batch processing as **not** ZDR-eligible ("29-day retention; async storage required").
- *Flagged content.* Even under ZDR, flagged content "may [be retained] for up to 2 years".
- *Data residency.* `inference_geo` offers only `"us"` (at 1.1×) or `"global"`. It is not a Nigerian or UAE residency control, so it cannot answer the NDPA or PDPL transfer questions that F24 raises.
- *Key compromise.* For as long as batch results are retained, a leaked API key exposes recent extraction outputs. This threat is not in §4.7.
- *Contradiction:* F24 says only "aggregates, not raw statements" should leave the system.

*Evidence:* "API and data retention" and "Pricing" pages, re-fetched 2026-11-04.

*Fix:* run statement extraction locally or synchronously under ZDR. Never use Batch or the Files API for statement content. Add per-workspace API keys with spend limits. Make "raw statement text leaves the device" an explicit founder decision.

**M2 — The prompt-injection architecture overstates its isolation (§4.6 "Prompt-injection defences").**
*Claim:* "the privileged answering model never sees raw document text, only validated rows and bounded chunks".
*Why it is wrong:* bounded chunks *are* raw document text. Validated rows also carry attacker-controlled narration and merchant strings into the privileged context. This is not the Dual-LLM pattern (S63), and it is not CaMeL-style capability tracking (S66).
*Fix:* treat narration and chunk text as tainted, display-only values. Pass them to the privileged model as opaque handles, or with their provenance taint attached. Forbid tool arguments that echo tainted text into any call that reaches the network. Add test cases for exfiltration through tool arguments and through rendered links or images.

**M3 — Missing threats and controls, and an operability problem for one person (§4.7).**
The STRIDE table lists a "malicious PDF" under Tampering and mitigates it with a document hash, which does nothing against a parser exploit. Missing items:
- *Parser sandboxing.* pypdfium2 wraps the C++ PDFium library, and Docling pulls in `torch`, `huggingface-hub` and model weights. Parsers should run in a no-network, resource-limited container. Models should be pre-fetched and pinned, because Docling's default is a download at runtime from Hugging Face, which contradicts "no network fetch at build/run".
- *Browser-side exposure.* Extensions can read every rendered figure. The repository already loads `https://s3.tradingview.com/tv.js` (`src/components/TradingChart.tsx:85`). There is no Content Security Policy (CSP), no Trusted Types, and no dedicated browser profile.
- *Feed poisoning.* Doc 5c's two-source reconciliation is not adopted as a security control.
- *Hash-pinned dependencies.* Lockfiles are named, but hash-pinning (`--require-hashes`) is not.
- *Key placement.* The key-encryption key is an age identity "on the founder's machine", which is the same host as the database, so envelope encryption adds little if that host is compromised.
- *Availability.* For a single user the biggest risk is total loss: a lost age key, combined with crypto-shredding and WORM-free backups. The document treats key loss as "denial of service".
- *Exposure.* Use a VPN or localhost only, not "no public ports except the proxy".

*Operability:* the control set includes per-document data keys, a hash-chained audit verified nightly, 13 PostgreSQL roles, row-level security (RLS), Trivy, an SBOM, licence scanning, quarterly restore drills, and OpenBao later. That is a team's programme, and the "security review" is done by the person who wrote the code.

*Fix:* specify a minimum-viable baseline for one person: full-disk encryption, no internet exposure, passkeys, sandboxed parsers, encrypted and tested off-device backups with escrowed keys, hash-pinned dependencies, and CSP. Defer the rest, and budget for one external review before real data is loaded.

**M4 — The reproducibility, re-ingestion and migration claims are not met (§4.2.2, §4.2.4, §4.2.7, §4.9).**
- *Bitemporal reproducibility.* "Any past report can be regenerated exactly" fails in three ways. Categories live in a *mutable* `entry_category` table with no history. `validation_status` on provenance changes in place. Results depend on library versions and RNG implementations, and no engine version is recorded (Doc 6 §4.3 records `engine_version`). Materialised views (module 4) also cannot be parameterised by `as_of_recorded`.
- *Idempotent re-ingestion.* Duplicates are matched on `(account, date, amount, normalised description)`. That wrongly merges legitimate identical items, such as two ₦50 e-transfer levies on the same day. Doc 4's `line_hash` includes the running balance and the reference for exactly this reason.
- *Undefined idempotency semantics.* Nothing defines the idempotency key for `POST /ledger/entries`, or what happens when an improved parser re-parses a document that is already posted.
- *Migrations.* "Migrations up/down" on append-only financial tables is unsafe.

*Fix:* add bitemporal history (or event-sourcing) to categories and statuses. Record engine and library versions plus seed in every run. Define the idempotency key as (document hash, row number, parser version) with supersession semantics. Allow forward-only migrations under an audited migration role.

**M5 — The licence analysis contains a legal-concept error that drives a build/reuse decision (F2, §5 row 2, §4.10).**
*Claim (F2):* AGPL, GPL-2.0 and GPL-3.0 are lumped together: "incorporating or linking this code into a proprietary hosted product would trigger source-disclosure obligations".
*Why it is wrong:* GPL-2.0 and GPL-3.0 obligations are triggered by *distribution*. Network use is the gap that the AGPL was written to close. For the personal MVP, which is not distributed, no copyleft licence imposes any obligation. Beancount (GPL-2.0-only) and hledger (GPL-3.0-or-later) only become a problem for a distributed desktop build, which the document itself keeps open. My attempt to re-fetch gnu.org's AGPL rationale page failed (HTTP 503 and connection reset), so this point rests on E3 practitioner knowledge, and counsel must confirm it as the document already asks.
*Consequence:* the strongest reuse option was not genuinely evaluated. That option is Beancount 3 as the ledger engine, beangulp importers, and Fava (MIT) as the UI for the personal stage, with export and migration later. It could remove most of the module-1 build.
*Smaller issues:* the OpenBB repository LICENSE says "All files in this repository are licensed under the Apache License, Version 2.0", while PyPI declares `openbb-yfinance`, `openbb-fmp` and `openbb-polygon` as AGPL-3.0-only. The document reports the PyPI view but does not flag the conflict. I confirmed that `pip install openbb` 5.0.0 does not pull those three packages by default.

**M6 — Effort and cost are not estimated, and the AI costs are understated (§4.12b, §7.5).**
- *No effort estimates.* Risk 7.5 says "effort estimates are uncertain by a factor of two", but the document contains no effort estimates at all.
- *No hosting or hardware costs.* There is no VPS, backup-storage or GPU cost. A local Qwen3-32B for "quarantined extraction" implies roughly 20 GB or more of accelerator memory (E5, my estimate).
- *Thinking tokens.* The AI estimate assumes 2,000 output tokens per question. Adaptive thinking is "always on" for Opus 5.5, Sonnet 5.5's Models API reports `thinking.types.disabled.supported = false`, and thinking tokens bill as output.
- *Agentic loops.* Each tool round trip resends the whole context. The sequence diagram has at least three model calls per question, not one.
- *Caching.* The 5-minute cache write costs 1.25× input, and sporadic personal use will mostly miss the cache, so the "70% cache hits" figure is optimistic.
- *Evaluation runs.* Running 200+ golden questions on every prompt change across three models is uncosted.
- *Founder capacity.* Doc 9 gives the founder 0–6 months for Stage 0 and notes "no engineering team". Eight MVP modules plus §4.7 is not credible for one person without a plan.

*Fix:* give person-week estimates per module. Re-cost the AI layer with measured traces (tokens per question, including thinking and tool turns). Cut the MVP, for example: ledger, ingestion and validation, read-only analytics, a minimal AI layer, and the minimum security baseline.

**M7 — Gaps in architecture fit with Docs 3–6 and 8 (§4.3, §8).**
- *Personal-MVP scope conflicts with Doc 3.* Doc 3 §8 ranks the claims-ladder template engine, onboarding questionnaires (SOEP, Big Three, CFPB) and the payday construct as Personal-MVP must-haves. Doc 7 defers module 5 to "Later" (rank 8).
- *No control on qualitative claims.* The AI layer controls numbers only. Doc 3 forbids free-text LLM psychology, but nothing in module 11 enforces Doc 3's sentence templates, so "you are impulsive" passes the gate.
- *Missing owners in the 13-module table.* Nothing owns user-asserted facts (residency day counts, employment, questionnaire answers, Doc 8's "Facts about you"). There is no source, licence and security-master registry (Doc 5c), no corporate actions, no period close or reopen (Doc 6 §4.1), and no notifications.
- *Thin provenance schema.* Doc 7's provenance record lacks `licence_scope`, `scale` (NGN'000), `expiry_at`, `vintage`/`supersedes` and confidence A–D (Doc 5c §4.3.1).
- *Three status vocabularies.* Doc 7 has four states, Doc 5c has eight and Doc 8 has five (including "Estimated").
- *Offline and sync.* Doc 8 expects offline and sync behaviour and cites Doc 7 for local-first storage. Doc 7 specifies a server Postgres with no client store, and it cites Kleppmann et al. (S78) to support "Compose on founder-controlled hardware", which is not local-first in that paper's sense.

**M8 — The repository critique is accurate on the headline claims but incomplete, and one claim is wrong (F25–F28, §4.11).**
- *Student-t (F28 i): confirmed, with qualifications.* `studentTRandom(5)` returns z/√(χ²₅/5) unscaled. Its variance is 5/3, so the standard deviation is inflated by √(5/3) − 1 = 29.1%. My simulation gives 1.290 per step and 1.287 over a 63-day horizon. The document does not say that:
  - the toggle is off by default (`useState(false)`) and applies only to GBM (`runGBM`);
  - the −½σ² drift term keeps the unscaled σ, so the median is also biased;
  - at the horizons this panel uses, the fat tails mostly disappear by the central limit theorem (excess kurtosis 5.65 per day versus 0.06 for the 63-day sum in my simulation), so the toggle mainly *inflates volatility* rather than adding tail risk.
- *Defects not mentioned.*
  - The "Cholesky" model returns only `finals1` (line 319), so asset 2 and ρ never affect any output.
  - The max-drawdown comment says "1 − P5/P50 and 1 − P1/P50", but the code uses P25 and P5.
  - GARCH has no −½σ² term, so drift is inconsistent across models, and its variance is clamped at 4σ².
  - There are silent fallbacks: σ = 0.6 and ρ = 0.65 when input parsing fails.
  - VaR is measured from the spot price, not from the entry price.
- *Wrong salvage claim.* §4.11 proposes to salvage "the lightweight-charts wrapper pattern". No TypeScript file imports `lightweight-charts`: commit 0269637 "Replace lightweight-charts with TradingView Widget" removed it, and the chart is a third-party `tv.js` embed. That embed, combined with secrets in localStorage (F25), is a worse exposure than F25 alone. Also, `callGroq` sends the key from the browser, so the key is exposed whether or not it is persisted.

**M9 — The evaluation harness cannot support its own targets (§4.6, §4.9).**
- *Sample size.* "Fabricated-number rate = 0" on about 200 golden questions supports, at best, a 95% upper bound of about 1.5% (rule of three: 3/200).
- *Definitions.* "Fabricated" and "exact-match ≥ 95%" are not reconciled: is a figure that matches within tolerance fabricated or not?
- *Missing measurements.* There is no measurement of the gate's false-negative rate (numbers it misses) or false-positive rate (legitimate answers it blocks), of label misattribution, of qualitative claims, of run-to-run variance, or of cases drawn from real (redacted) statements.

*Fix:* report bounds rather than zeros. Add a red-team corpus aimed at the gate itself.

### Minor

- **m1 (F14).** "Forced `tool_choice` is rejected on the newest models" is only partly right. Opus 5.5, Sonnet 5.5, Fable 5.1 and Mythos 5.1 return a 400 error, but **Haiku 5.5 accepts forced tool use** (406 tokens), so the extraction role could combine `any` with `strict`. (Define-tools page, re-fetched.)
- **m2 (F14, §5).** Citations are indeed incompatible with `output_config.format` (confirmed). However, Anthropic documents a "Get structured data with citations" pattern (one line per field, parsed in code) that gives page-located evidence for each extracted value. It is relevant to ingestion and was not considered.
- **m3 (F13).** The FinanceBench "81%" figure is a 2023 GPT-4-Turbo result and includes refusals. It supports "do not let the model calculate", not any claim about 2026 fabrication rates. The wording should say so.
- **m4 (§4.2.3).** No ISO 4217 minor-unit table is specified (JPY 0, KWD 3 decimal places). `ROUND_HALF_EVEN` is chosen without reference to the tax rounding rules (Doc 6). NUMERIC(28,8) is too coarse for 18-decimal crypto units if those ever come into scope.
- **m5 (F22, F23).** Doc 9 F16 states GAID took effect on 19 September 2025, and Doc 8 F15 says the UAE Executive Regulations were "not issued as of March 2026". Doc 7 leaves both as unknown and should harmonise with them or dispute them.
- **m6 (§4.7 retention).** "Documents 7 years", "discard raw OCR" and crypto-shredding erasure conflict with Doc 6's "≥ 6 years after the year of assessment … WORM-style storage".
- **m7.** Package versions had already moved by 2026-11-04 (docling 2.147.0, PyMuPDF 2.1, yfinance 1.8.0, psycopg 3.3.8). The lockfile, not Table 3.2, must be the record.
- **m8 (ADR-2, §7.2).** The proposed two-week dual-stack spike is poor value. Its criteria (lines of code, defect count) are weak, and the result is predictable: HRP, `arch` and Docling have no TypeScript equivalents. The deciding variable is the founder's own language skill, which is unknown. One alternative was not considered: a Python-only server-rendered UI with no SPA, which removes the two-language cost. Recommendation: no spike. Decide on founder skill, or at most run a 3-day statement-parsing spike.
- **m9 (ADR-3, ADR-7).** Some alternatives were not genuinely weighed. SQLite+SQLCipher is rejected on SaaS grounds even though the target is personal. OpenAI and Gemini are "not evaluated". §7.1 states as fact that hosted models give "measurably better tool discipline" without any measurement.
- **m10.** The F29 phrase "no lockfile-based audit" is ambiguous, because `package-lock.json` exists in the repository.

## 3. Evidence-grade audit

| Location | Claim | Problem | Proposed grade |
|---|---|---|---|
| F2 | GPL/AGPL disclosure is triggered by a hosted product | Concept error for GPL (distribution trigger) | E3 with correction; counsel |
| Table 4.1 row 5 | "Local-first literature [S78]" supports Compose on hardware or a VPS | Citation misapplied | E5 |
| §7.1 | Hosted models give "measurably better tool discipline" | Not measured | E4/E5 |
| §4.6, §4.9 | "Fabricated-number rate = 0" is achievable and testable | No statistical basis | E5 with bound |
| §4.6 | 0.5% gate tolerance | Unlabelled engineering choice | E5 |
| §4.7 | RTO < 4 h, RPO < 24 h, coverage ≥ 85%, "≥ 5,000 labelled rows" | Unsourced thresholds | E5, state the test |
| §4.12(a) | "exactly 0.00" balance | False as stated | Correct the arithmetic |
| §4.12(b) | AI cost figures | Omit thinking, loops and cache writes | E5, re-estimate |
| §4.6 | Privileged model "never sees raw document text" | Contradicted by its own design | Remove |
| F28 | Student-t ≈ 29% | Correct (verified) | E3 ok |
| F14–F16 | API behaviour, prices, retention | Correct (verified), except m1 and the Batch omission | E2 ok |

## 4. Citation and source spot-check

**Academic works.** Verified on 2026-11-04 via Crossref DOI (`api.crossref.org/works/<DOI>`) or the arXiv API.

| # | Reference | Route | Status |
|---|---|---|---|
| S65 | Greshake et al., arXiv:2302.12173 (2023-02-23) | arXiv | Verified |
| S66 | Debenedetti et al., "Defeating Prompt Injections by Design", arXiv:2503.18813 | arXiv | Verified |
| S68 | Islam et al., FinanceBench, arXiv:2311.11944; the "81%" sentence quoted verbatim in the abstract | arXiv | Verified |
| S69 | Chen et al., FinQA, arXiv:2109.00122 | arXiv | Verified |
| S74 | Auer et al., Docling Technical Report, arXiv:2408.09869 | arXiv | Verified |
| S71 | Ji et al., ACM Computing Surveys, 10.1145/3571730 (issued 2023-03) | Crossref | Verified |
| S75 | Claessen & Hughes, QuickCheck, 10.1145/351240.351266 (ICFP 2000) | Crossref | Verified |
| S76 | MacIver & Hatfield-Dodds, JOSS, 10.21105/joss.01891 (2019) | Crossref | Verified |
| S78 | Kleppmann et al., Onward! 2019, 10.1145/3359591.3359737 | Crossref | Verified (but misapplied, see §3) |
| S80 | Michaud, FAJ 1989, 10.2469/faj.v45.n1.31 | Crossref | Verified |
| S81 | DeMiguel, Garlappi & Uppal, RFS, 10.1093/rfs/hhm075 (Crossref issued 2007-12) | Crossref | Verified |
| S82 | Ledoit & Wolf, JPM 2004, 10.3905/jpm.2004.110 | Crossref | Verified |
| S83 | López de Prado, JPM 2016, 10.3905/jpm.2016.42.4.059 | Crossref | Verified |
| S84 | Bollerslev, J. Econometrics 1986, 10.1016/0304-4076(86)90063-1 | Crossref | Verified |

**Non-academic sources.** Re-fetched on 2026-11-04.

| Source | URL | Status |
|---|---|---|
| S51 Pricing | platform.claude.com/docs/en/about-claude/pricing | Confirmed: Fable 5.1 $10/$50 (hit $0.25); Opus 5.5 $4/$20 ($0.20); Sonnet 5.5 $2/$10 ($0.10); Haiku 5.5 $0.10/$0.50 ≤100k and $0.50/$2.50 above; Batch −50%; `inference_geo:"us"` 1.1× |
| S50 Models overview | …/about-claude/models/overview | Confirmed: IDs; 1M context and 128K output; Opus 5.5 default effort `medium`; adaptive thinking always on for Fable 5.1 and Opus 5.5 |
| S52 Structured outputs | …/build-with-claude/structured-outputs | Confirmed: `output_config.format`; `additionalProperties:false`; no min/max or length limits; refusal and max_tokens caveats; Citations returns 400. Not reported in Doc 7: 20 strict tools per request and a 180 s compile timeout |
| S55 Retention | …/manage-claude/api-and-data-retention | Confirmed: not retained by default; Covered Models need 30 days. **Batch not ZDR-eligible (29 days)**; flagged content up to 2 years (M1) |
| S53 Tool use | …/agents-and-tools/tool-use/overview and …/define-tools | 286 tokens confirmed. Forced tool use returns 400 on Opus 5.5, Sonnet 5.5, Fable 5.1 and Mythos 5.1; Haiku 5.5 accepts it (m1) |
| S54 Citations | …/build-with-claude/citations | Incompatibility confirmed; "structured data with citations" pattern exists (m2) |
| S38 yfinance README | github.com/ranaroussi/yfinance | Confirmed: "personal use only"; Apache |
| S39 Lightweight Charts | github.com/tradingview/lightweight-charts | Confirmed: Apache-2.0 plus attribution notice and link |
| S44 CBN rates | cbn.gov.ng/rates/ExchRateByCurrency.html | Confirmed: NFEM VWAP "official exchange rate for the day"; Export to Excel; no API |
| S89 NIST 800-63B-4 | pages.nist.gov/800-63-4/sp800-63b.html | Confirmed: phishing-resistant option SHALL be offered at AAL2; syncable authenticators barred at AAL3; 15-character single-factor minimum; no composition or rotation rules; PSTN restricted |
| S8 Actual sync | actualbudget.org/docs/getting-started/sync/ | Confirmed: bank tokens "not covered by end-to-end encryption" |
| Licence files | raw.githubusercontent.com: Actual LICENSE.txt (MIT), Firefly III, Ghostfolio, Wealthfolio (AGPL-3.0), Portfolio Performance (EPL-1.0), hledger (GPL-3.0), Beancount COPYING (GPL-2), OpenBB (Apache-2.0 "all files") | All match the document |
| PyPI metadata | pypi.org/pypi/<pkg>/json | PyPortfolioOpt MIT; Riskfolio-Lib BSD-3; skfolio BSD-3; cvxpy Apache-2.0; arch NCSA; Procrastinate MIT; Docling MIT; beancount GPL-2.0-only; openbb, core, sec, fred Apache; openbb-yfinance, fmp, polygon AGPL-3.0-only. All match |
| gnu.org AGPL rationale | gnu.org/licenses/why-affero-gpl.html | **Not reachable** (503 / reset) |

## 5. Cross-document contradictions

| Topic | Doc 7 | Other document | Resolution owner |
|---|---|---|---|
| Posting model | Per-currency weights, `CHAR(3)` | Doc 4: signed amount + `base_amount`, Σ = 0 in base; Doc 6: `account_dr/account_cr` | Doc 4 + Doc 6 + Doc 7 joint specification (B2) |
| Transfers | Single entry, two asset postings | Doc 4: two linked transactions; Doc 6: matching within ±3 days, value-date cut-off | Doc 4 |
| AI numbers | Model writes digits; gate with tolerance | Doc 5c: token substitution, digits never rendered; Doc 8: model "never produces the number"; Doc 6: render `steps[]` only | Adopt Doc 5c (B1) |
| Provenance and status | 4 states, no licence scope or expiry | Doc 5c: 8 states, licence_scope, expiry_at, vintage, confidence A–D; Doc 8: 5 UI states incl. "Estimated" | Doc 5c schema canonical |
| FX source | CBN NFEM | Doc 6: "CBN official window" default; Doc 4: NFEM plus optional parallel series; Doc 5c: `rate_type` enum | Doc 5c + Doc 6 |
| Behavioural MVP | Module 5 "Later" | Doc 3 §8: ranks 1–4 Personal-MVP must-have | Coordinator |
| Retention and erasure | 7 years; crypto-shredding | Doc 6: ≥ 6 years after year of assessment, WORM | Doc 6 |
| Local-first | Server Postgres via Compose; hosted LLM | Doc 8: offline states, local-first "(Doc 7)", writes queued | Doc 7 + Doc 8 |
| Regulatory dates | GAID and UAE regulations "unverified" | Doc 9: GAID effective 19 Sep 2025; Doc 8: UAE regulations not issued as of Mar 2026 | Doc 6 |
| Undo | Append-only, reversals | Doc 8 P8: "Undo for 30 days on all ledger edits" | Compatible if undo = reversal; state it |

## 6. Questions the Investment Committee needs answered

1. Who builds this, in what language, and with how many hours per week? No effort estimate exists, and Doc 9 Stage 0 assumes 6 months.
2. Will the founder allow raw statement text to leave his machine? If so, under what retention (ZDR synchronous only, never Batch)? If not, what local hardware budget is approved?
3. Which posting model is canonical, and who signs it off?
4. What is the minimum security baseline before real data is loaded, and who reviews it independently?
5. Is a distributed desktop build or a hosted tier planned within 12 months? This determines whether GPL or AGPL matters at all, and therefore whether Beancount plus Fava can be the personal ledger.
6. Does the AI layer also prevent qualitative fabrication (behavioural, tax-status or categorisation claims), and by what mechanism?

## 7. Required changes before Investment Committee (priority order)

1. Replace the §4.6 gate with Doc 5c's token-substitution contract. Make the gate a reject-any-digit backstop, mask numbers in retrieval chunks, and turn `calc.derive` into a typed formula registry (B1).
2. Publish one canonical posting specification with Docs 4 and 6. It needs a commodity column, rounding and FX-cost accounts, and transfers through an in-transit account. Correct the §4.12(a) arithmetic (B2).
3. Remove Batch and Files API use for statement content. Document retention per feature, the limits of `inference_geo`, and API-key compromise (M1).
4. Correct the claim of prompt-injection isolation and add taint handling (M2).
5. Add a minimum-viable security baseline for one person covering parser sandboxing, browser-side exposure (CSP, no third-party scripts), feed poisoning, hash-pinning and key placement, with an external review (M3).
6. Fix the reproducibility gaps: history for categories and statuses, engine and library versions, an idempotency-key definition, forward-only migrations (M4).
7. Correct F2's GPL/AGPL analysis and evaluate Beancount + beangulp + Fava as the personal-stage reuse path (M5).
8. Add person-week estimates and hosting and hardware costs. Re-cost the AI layer with thinking tokens, tool turns and cache writes. Cut MVP scope to what one person can do (M6).
9. Reconcile MVP scope with Doc 3. Add modules or owners for user-asserted facts, the source and licence registry, and period close. Adopt Doc 5c provenance (M7).
10. Correct §4.11 (the lightweight-charts salvage claim) and expand F28 with the missed Monte Carlo defects (M8). State statistical bounds for the evaluation targets (M9).
11. Drop the two-week dual-stack spike, or reduce it to a skill-based decision (m8).

## 8. What I could not check

- The GNU AGPL rationale page (HTTP 503 and connection reset). The GPL distribution-trigger point (M5) therefore rests on practitioner knowledge, E3, and needs counsel.
- Ghostfolio's Prisma `Float` fields, its exchange-rate service and Firefly III's string casts (S2, S4, S19). I did not re-read these source files.
- The licences of Docling's and RapidOCR's model weights, the Qwen3 and gpt-oss model cards, the Llama 4 and Gemma terms, and the Mono and Lean vendor claims.
- NDPA, GAID and PDPL status. I relied on cross-document statements only.
- Whether `temperature` is accepted alongside always-on adaptive thinking. This matters for Doc 5c's "temperature 0" rule.
- The exact mechanics by which batch results can be retrieved with a leaked key. I inferred this from the documented 29-day retention.
- The hardware requirement for local 32B models, which is my own estimate (E5).
- Procrastinate's built-in periodic-task support. If it has one, APScheduler is redundant (not verified).
- Any Docs 4, 6 or 8 material beyond the sections named in the assignment.
