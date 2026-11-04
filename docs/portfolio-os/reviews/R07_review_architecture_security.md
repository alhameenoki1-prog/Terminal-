Review of: Document 7 — Technology and Open-Source Research Report (v0.1, 2026-11-02)  ·  Reviewer roles: security red-teamer; principal engineer (production financial ledgers); AI-systems engineer; open-source licensing researcher; delegate of the methodology owners (Docs 3–6)  ·  Date: 2026-11-04  ·  Verdict: **Major revision**

## 1. Verdict and the three most important problems

Document 7 is well researched and mostly accurate. Its licence metadata and its Anthropic model IDs and prices held up when I re-checked them. Its overall shape (modular monolith, decimal append-only ledger, deterministic tools behind an LLM) is sound. It is not ready for the Investment Committee, for three reasons:

1. **The "no number without a tool result" gate is weaker than the contract that Docs 5c, 6 and 8 already rely on, and it can be bypassed.** The model writes the digits itself. The gate accepts any value that appears anywhere in the trace, within 0.5%, and that includes raw statement text returned by `documents.search`. It does not catch a correct number attached to the wrong label, a flipped sign, or a number written in words.
2. **The ledger specification cannot be built as written, and it conflicts with Docs 4 and 6.** The three documents use three different posting models. A `CHAR(3)` currency column cannot hold security units. The worked example claims to balance "exactly" when it does not. Single-entry transfers break statement cut-off.
3. **The privacy and security posture contradicts its own recommendations, and one person could not operate it.** Raw statements would go to the Batch API, which is not eligible for zero data retention (ZDR) and keeps data for 29 days. The prompt-injection design claims that the privileged model "never sees raw document text", but it does. The control set is sized for a team, there are no effort estimates, and the main single-user risks are missing: parser exploits, browser-side exposure, and losing the key.

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
