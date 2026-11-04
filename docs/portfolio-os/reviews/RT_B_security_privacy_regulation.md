```
Document: RT-B — Red-team Panel B: security, privacy and regulatory perimeter (whole revised package)
Department: Red team (independent of all authors)  ·  Roles simulated: offensive-security tester; privacy and data-protection researcher (NDPA 2023, UAE PDPL); financial-regulation researcher (SEC Nigeria, CBN, UAE CMA, tax-practice rules). None licensed.
Version: 1.0  ·  Date: 2026-11-04  ·  Status: for coordinator and Investment Committee
Scope read: Context brief v0.2; Doc 1; CANONICAL_CONTRACTS (C2 in full); REVISION_LOG; Doc 7 v0.2 §3.3–3.5, §4.2, §4.5–4.7, §4.10, §7, §9; Doc 6 v0.2 §3E, §4.1, §4.1A, §4.2, §4.5–4.7; Doc 3 §3G, §4.9; Doc 8 F15, §4.5.13, §4.9; Doc 9 §3D, §4.6, §7.1, §8.3, §9; Doc 5c §1, F3, F19, §4.1, §4.3.10–4.3.12, §4.6
```

*Simulated specialists, not lawyers. Every legal reading below is a research input for counsel, not an opinion.*

## 1. Verdict

**Not ready for real data, and not ready for any external user.** The revision fixed the gross v0.1 faults (numeric gate, Batch API, browser keys, WORM vault). Four problems remain, and each would hurt:

1. **The retention design contradicts itself, and one choice cannot be undone.** Four documents give four answers on whether the tax vault can be erased. Doc 7 puts the tax-vault backups under object lock. In Backblaze compliance mode, nobody can delete locked data before the lock expires, including Backblaze. Doc 6 promises the user can always delete.
2. **C2 is weaker than it claims.** The lexical rule leaks: 18 of 20 bypass strings I tried pass the contract's own reference validator. The semantic check binds a token to a *field* only, never to a period, account or scope.
3. **The perimeter trigger is drawn too narrowly.** The documents put the line at "security-specific buy/sell/hold output". The product's own optimiser alternatives, goal "adjustment" and tax answers fall into categories that Anthropic's usage policy (re-fetched today) calls high-risk. The SEC robo-advisory definition plausibly covers them too. This bites at the first external user, paid or free.
4. **The threat model leaves out the most likely attacker.** That is malware or a hostile developer tool on the founder's own laptop, which also builds NEXUS with npm and AI coding agents.

Everything else is fixable inside the current architecture.

## 2. Method and evidence log

Read the documents listed above. I wrote and ran a bypass harness against the C2 reference validator, `validate_and_render()` in `research/scripts/contracts_checks.py`. The script is `scratchpad/rtb/c2_bypass.py`, run with `python3 -I`; it is not committed, and its output is reproduced in B2. Primary and secondary sources fetched on 2026-11-04:

| # | Source | URL | Result |
|---|---|---|---|
| E1 | Anthropic Usage Policy | https://www.anthropic.com/legal/aup | "Effective Nov 12, 2026". Finance High-risk Area: "a personalized recommendation to buy, sell, hold, or allocate among specific investment products"; "advising an individual on their own taxes". A qualified person must review before it is "delivered as advice to an individual"; AI use disclosed. Internal analysis excluded |
| E2 | Anthropic API and data retention | https://platform.claude.com/docs/en/manage-claude/api-and-data-retention | ZDR: "contact the Anthropic sales team. ZDR is enabled per organization". Flagged content "up to 2 years" even under ZDR. Schemas cached "up to 24 hours" |
| E3 | NDPA 2023 (DataGuidance copy, `pdftotext`; SHA-256 `0403906a…9a6272`) | https://www.dataguidance.com/sites/default/files/data_protection_act_2023.pdf | s.3(1) and proviso confirmed. s.43(1)(a) consent "after having been informed of the possible risks"; (b) contract necessity. s.65 sensitive list has no "family"; **no definition of "profiling"**. Not compared with the gazette |
| E4 | CITN Act (PLAC) | https://placng.org/lawsofnigeria/print.php?sn=66 | s.16(1)(a)–(c), s.19(2), (4) confirmed; s.16(1)(c) allows designation of further services by regulation |
| E5 | King & Spalding on Decree-Law 33/2025 (13 Feb 2026) | https://www.kslaw.com/news-and-insights/a-new-era-for-uae-federal-securities-regulation-the-2025-cma-decree-laws-february-2026 | 16 activities incl. "financial advisory", "promotion", "portfolio management"; reaches activity "from outside the UAE or from a freezone"; Art. 71 ≥ 1 year and AED 1m–250m. E3 |
| E6 | Apache Software Foundation, GPL compatibility | https://www.apache.org/licenses/GPL-compatibility.html | FSF "has never considered the Apache License to be compatible with GPL version 2" |
| E7 | Backblaze Object Lock | https://www.backblaze.com/blog/digging-deeper-into-object-lock/ (via search) | Compliance-mode locks cannot be removed by anyone, Backblaze support included, until expiry |
| E8 | Fava authentication | https://github.com/beancount/fava/issues/314 ; selfhosting-sh guide (via search) | Fava has no built-in authentication. Maintainers leave it to a reverse proxy. E3 |
| E9 | ISA 2025 "investment adviser" definition | searched | **Not found**. See §8 |

## 3. Findings

### Blocking

**B1. The four retention positions are incompatible, and one of them cannot be reversed.** Doc 6 §4.1A: "erasable by the data subject through crypto-shredding … It never blocks the user's deletion". Doc 7 §4.7.4: "Not erasable while the clock runs … Crypto-shredding is never applied to the tax vault", plus "object lock on backups" (MVB 8). Doc 3 §4.9.6: "write-once storage"; delete-everything deletes tax records only "when the legal retention period ends". Doc 8 §4.5.13: "WORM-style … the choice is theirs". Doc 6 owns retention, yet V-028 is marked "design closed".

A compliance-mode lock (E7) is permanent from the first backup. Per-class crypto-shredding, which Doc 7 relies on for behavioural erasure, needs the key service that §4.7.3 defers, so withdrawing consent never reaches nightly backups. The clock rule `NG-RECORDS-RETENTION-2026` is `draft` but "applies … regardless", which breaks C7's rule that draft rules never compute.

*Fix before the first real backup:*
- Adopt Doc 6's position.
- Use governance mode or no lock, with a bypass key held in escrow.
- Give each data class its own age recipient in the backup, so that destroying one identity erases that class everywhere.
- Raise rule 34 to `sourced` or stop it gating anything.

**B2. C2 can be bypassed lexically and semantically (blocking for the Stage 0b AI layer, not for the ledger).**

Running the contract's reference validator (`contracts_checks.py` `validate_and_render`):

```
PASS: 'millions' · 'fifth' · 'As of May' · 'end-Oct' · 'Last month you spent' · 'twe​lve' (zero-width space)
      'mil­lion' (soft hyphen) · 'оne' (Cyrillic о) · 'Ⅻ' U+216B (Nl) · '⑫' U+246B (No) · '²' (No) · 'XII'
      'doce' · 'mejila' · 'All of your accounts reconcile' · 'Your balance fell to {{fig}}' · {{fig}} with as= omitted · '⅞' U+215E
REJECT: 'fifty-k' · 'twenty-five'
```

**Specification** gaps: C2.2(2) bans only category Nd (Nl, No and confusables pass); names no normalisation (NFKC, Cf removal); omits ordinals, plurals, "twice", "zero/nil/none", abbreviations, relative time ("last month") and named dates ("Eid"); and nothing enforces C2.2(5)'s "direction words only from the renderer". **Reference-implementation** gaps: `as=` treated as optional although C2.2(5) makes it mandatory; "May" missing (it is also a verb), which shows the month rule cannot be implemented as worded. The span-map backstop (C2.2(10)) checks digits only and catches none of these.

The semantic hole is larger. `as=` binds the field (`spend.total`), not the period, account or entity: "Last month you spent {{fig:q3_total|as=spend.total}}" passes on a quarterly AED total. `calc` inputs are type-checked, not role-checked (`ratio(b,a)` passes). Quantifiers ("all", "none") and comparatives ("higher than") assert counts and orderings no tool computed. C2 guarantees no free numerals, not no false quantitative claims; Docs 5c, 7 and 8 describe it as the latter.

*Tests that would prove the lexical half:* (i) a character allow-list after NFKC, Cf stripping and a UTS #39 confusable skeleton; (ii) a generated corpus (Hypothesis) of integers 0–10¹² as cardinals, ordinals, plurals, abbreviations, Roman, circled and superscript forms, in English, Yoruba, Hausa and Arabic (C2.6 Q2), mutated with zero-width characters and homoglyphs, with 100% rejection reported with n and a bound. *Tests that bound the semantic half:* (iii) the renderer prints each figure's scope label (period, account, currency) from metadata and relative-time words are banned; (iv) `cmp` and `count` tokens plus a quantifier/comparative lint; (v) a metamorphic test swapping two same-field figures, reporting a misattribution rate with a Wilson bound; (vi) an independent extractor lists every quantity asserted in the rendered output, each of which must map to a renderer span.

**B3. The perimeter trigger in the documents is too narrow, and the vendor's own policy already applies at the first external user.** Doc 6 §4.6(a) and F35 put the SEC/CMA trigger at "security-specific buy/sell/hold output to another person". But module 7 returns "candidate allocations" for the user's holdings, C6 returns an `adjustment`, and module 10 answers tax questions on the user's own facts. E1 classes "allocate among specific investment products" and "advising an individual on their own taxes" as High-risk: a qualified person must review before delivery to an individual, and AI use must be disclosed. The founder's own analysis is plausibly excluded; a friend in a free P2 circle is not. The SEC Robo-Advisory Rules cover "investment advice using automated, algorithm-based tools which are client-facing" with no research carve-out (Doc 9 F14). Doc 9's S-a recruits cold-channel diaspora and UAE prospects to paid pre-orders from month 3. The SEC opinion arrives in month 6 and UAE counsel has no date, while Decree-Law 33/2025 licenses "promotion" aimed at onshore clients from abroad (E5).

*Fix:*
- Redraw the trigger as "any output computed from a specific person's holdings or circumstances, delivered to that person when they are not the operator".
- Gate modules 7 and 9 and the C6 `adjustment` as founder-only until counsel opines.
- Hold S-a until both the UAE and SEC opinions arrive, or exclude UAE residents and research features from the pre-order offer.

**B4. The dominant attacker path, compromise of the founder's own machine, is not modelled.** Doc 7 §4.7.2 lists theft, extensions, backup leaks and parser exploits, but not an infostealer or malicious dependency on the same user account. While the server runs, full-disk encryption protects nothing. Malware running as the founder reads the PostgreSQL data directory, the SOPS/age identity that decrypts the API keys (it must be on the host; only the *backup* identity is off-host), browser session cookies (passkeys do not protect a stolen session), and statements in Downloads or email. The same laptop builds NEXUS (`npm install`) and Portfolio OS, very likely with AI coding agents that have shell access. npm credential-stealing worms are a known attack class. *Fix (cheap, before real data):*
- Run Portfolio OS under a dedicated OS account or VM that holds no development tools, no coding agents and no NEXUS checkout.
- Keep the data directory outside every repository and agent working directory, and add a pre-commit check for statement files.
- Ingest from a drop folder that is shredded after import.
- Store statement PDF passwords nowhere, or in the OS keychain. Doc 8 Journey 1 assumes password-protected PDFs, and no document designs for them.

### Major

**M1. Prompt injection costs one naira, and C2 does not stop its useful outcomes.** The sender sets a NIP narration and the merchant sets a card descriptor, so anyone who knows the founder's NUBAN can plant text. Digits are masked; instructions arrive intact. The attacker can still (a) steer the model to the wrong allow-listed figure (B2); (b) have a `quote` rendered verbatim with its digits ("BALANCE CONFIRMED ◊◊◊◊◊◊◊" becomes a number on screen, and the span-map passes it because the renderer emitted it); (c) flood the review queue with ₦1 credits, each tax-weighted under C4, on top of Doc 8's 231-item first batch; (d) make the extraction proposer fabricate a +X/−X pair that leaves the closing balance intact.

*Fix:*
- Render quotes only in a separate evidence block, never inline in an answer, with a per-answer cap.
- Require every proposed row to match text found at its bbox by the deterministic parser.
- Rate-limit and bundle micro-credits in the queue.
- Add T2-13 (quote used as an answer), T2-14 (balanced-pair injection) and T2-15 (queue flood).

**M2. Option B (Beancount and Fava) breaks MVB 3 and MVB 5.**
- Fava has no authentication (E8). On 127.0.0.1 it is reachable by every local process and, unless the Host header is validated, by DNS-rebinding pages in the founder's browser.
- Fava's editor writes the ledger file, and Fava's CSP is not under our control.
- Beancount `plugin` directives import Python modules. A narration written into the `.beancount` file needs a round-trip test proving that quotes, newlines and directive keywords stay data.

*Fix:* put Fava behind an authenticating proxy that checks the Host header (Authelia is already in F21). Add the authentication proxy, Host-header check, CSP report and ledger-injection test to the ADR-10 spike pass criteria.

**M3. The hosted-model plan assumes a ZDR arrangement that an individual probably cannot get.** ZDR is "enabled per organization" through sales (E2), so Doc 7's "ZDR organisation when available" is likely false for a person; without it, default handling applies, plus up to 2 years for flagged content. Getting ZDR through a company plausibly creates "a controller other than the founder", the trigger Doc 3 §4.9.2 and Doc 7 §4.7.5(1) name as ending the household exemption, at Stage 0. C2.2(8) masks numbers in the user's message but not names ("Did Amina repay the school fees?"). Schemas are cached for 24 hours (E2), so allow-lists and labels must never be emitted as `enum` values.

*Fix:*
- Decide FD-1 together with the account structure.
- Mask names in user text through the counterparty registry.
- Make the model *value-blind* by rule: tool results carry IDs, fields and C3 axes, never values. That closes this egress question, most of M7 and part of B2 (a model cannot encode a value it never saw). Doc 7's sequence diagram implies it but never states it.

**M4. Lawful basis and profiling are scoped too narrowly for the first external user.** Doc 7 §4.7.5(2) tags ledger and tax data "legal obligation", but NTAA s.31(5) binds the *taxpayer* (Doc 6 §4.1A); a company's basis is contract. The NDPA does not define profiling (E3). On a GDPR-style "economic situation" reading, categorisation, net worth and the goal engine are profiling, so s.27(1)(g) notice covers the whole product. Labelling spend "Pharmacy" already infers health, and the register does not reach the classifier. Docs 6 F38 and 9 F16 say "consent is not a stand-alone basis" for transfer, whereas the Act's s.43(1)(a)–(b) provides consent after a risk warning and contract necessity (E3); counsel must reconcile GAID and Act. Doc 9's S-a screening ("multi-currency, ≥ 1 investment") collects strangers' financial data from month 3.

*Fix:* write a light DPIA **now**. FD-1, Option B and the hosted model all depend on it. Add a recruitment privacy notice before S-a.

**M5. Third-party data is in the founder's ledger today.** It holds:
- relatives' names and counterparty account numbers in `narration_raw`;
- landlord name and address (the rent-relief condition, Doc 6 §4.4);
- joint-account holders;
- employer details.

`value_hmac` protects little while `narration_raw` keeps the full number in clear. The s.3(1) proviso still protects these people, and the material will go to a practitioner. *Fix:* tokenise counterparty identifiers in narrations at ingest; have the practitioner pack and the subject-access export apply redaction; list third-party data classes in the DPIA.

**M6. Several specified controls need a second person who does not exist** (§6). C3.3 requires "validator != ingester". C7 requires a "checker" and "a second internal reviewer", yet Doc 6 already marks several rules `reviewed_internal`, apparently on simulated review. Doc 8's seeded-error protocol plants "a transposed amount" in ordinary sessions on real data; it needs an independent facilitator (still open), and a real decision could be taken on a planted error. MVB 10 has no line in Doc 9's $10–20k Stage 0 budget.

*Fix:*
- Name AI-agent review as "machine-checked", not "reviewed_internal".
- Run seeded errors only in a labelled replica, or with a hard block on exports and decisions during the session window.
- Budget the review: roughly 1 reviewer-week, quote pending.

**M7. Licensing exposure is real beyond the non-display fee.** (a) Sending NGX-derived values to Anthropic may be "Distribution" to a third party, beyond use "exclusively for his/her private purposes" (Doc 5c F3); value-blind design (M3) avoids the question. (b) EUA cl. 13.5 may require purging derived figures at licence end (Doc 5c §6), but a tax computation that used an NGX value (e.g. s.36 market-value deeming) must be kept 6 years, a conflict B1 does not list. (c) Every "personal use" licence becomes a breach at the first external user: NGX non-professional, Tiingo, EODHD, Alpha Vantage, Massive, ADX MCP Starter. (d) Doc 7 F8 calls yfinance "acceptable for the founder's personal prototype" and keeps it in the §4.4 feed list; Doc 5c F19 quotes Yahoo's ban on collection "using any automated means" and recommends removal. Doc 5c is right.

**M8. Key escrow trades one risk for an easier one.** "Paper in two locations" holding a bare age identity lets anyone who photographs either sheet decrypt every backup, and every household member or visitor is a candidate. The B2 application key on the host can delete unlocked backups (ransomware), which is the reason object lock is tempting (B1). *Fix:* passphrase-wrap the identity (`age -p`) and memorise the passphrase, or use a 2-of-3 split. Give the host a write-only B2 key (no `deleteFiles`), and keep versioned retention on the bucket, not compliance lock.

### Minor

- **m1.** A *distributed* build (for example a desktop app given to P2 friends) combining Beancount (GPL-2.0-only) with Apache-2.0 code (OpenBB core, yfinance, lightweight-charts) or LGPL-3.0 code (psycopg) faces GPLv2 incompatibility (E6). Doc 7 F2 says only that distribution "triggers GPL obligations". The licence allow-list reads PyPI metadata and misses external binaries (Poppler GPL; Ghostscript AGPL when used as a Camelot backend) and model-weight licences.
- **m2.** CITN s.16(1)(a) catches anyone who "holds himself out", and (c) allows designation by regulation (E4). Product copy such as "tax agent", "file your taxes" or "tax practitioner" should be banned in Doc 8's copy rules now. The penalty is nominal (₦100/₦1,000), but two years' imprisonment on indictment is not.
- **m3.** Docs 1, 6 and 9 disagree on staging. Doc 1 P2 (~20 friends) needs only "consent and data-protection basics" and defers the perimeter assessment to P3. Docs 6 and 9 need a DPIA and a transfer instrument before any second user. Doc 9 has no friendly-circle stage at all, only a "10-user usability cohort" whose data status is undefined.
- **m4.** NDPA assent: 13 June (Doc 7) vs 12 or 14 June in search results; pin it from the gazette.
- **m5.** E1 takes effect on 12 Nov 2026; re-check then and record Anthropic's `terms_version` in the licence registry.
- **m6.** The weekly tax-source monitor (Doc 6 §4.2) and weekly `pip-audit` have no alerting path other than the founder reading them. Make both fail-closed (a red banner on the dashboard), not reports.

## 4. Threat paths for the personal deployment, ranked by likelihood × impact (E4)

| # | Path | Target | Covered by MVB? | Gap |
|---|---|---|---|---|
| 1 | Infostealer or malicious npm/pip package on the founder's dev account | DB, SOPS key, sessions, raw PDFs | Partly (MVB 7 pins *this* repo only) | B4 |
| 2 | Email or cloud account takeover (statements arrive by email; synced passkeys follow the Apple or Google account) | Statements, passkey | No | B4; treat the email account as part of the system boundary |
| 3 | Narration or descriptor injection | AI answers, review queue, extraction | Partly (§4.6) | M1 |
| 4 | Photograph of escrow paper | All backups | No | M8 |
| 5 | Localhost UI reached by DNS rebinding or a local process (Option B) | Ledger read/write | No | M2 |
| 6 | Hosted-model retention or flagging | AI context | Partly | M3 |
| 7 | Malicious PDF exploiting the parser | Code execution | Yes (MVB 4) | Keep |
| 8 | Feed poisoning | Market figures | Yes (MVB 9, C3.5) | Keep |
| 9 | Total loss (key or restore failure) | Everything | Yes (MVB 8) | Tension with M8 |

## 5. Perimeter map

| Feature | Jurisdiction | Exact trigger | Required licence / opinion | Do the docs agree? |
|---|---|---|---|---|
| Ledger, cash flow, net worth on own data | NG / AE | Founder alone: none. First other person: NDPA controller duties from n = 2; PDPL (or banking-data carve-out) | DPIA; transfer basis (s.43); notice; NDPC tier at >200 (secondary) | Partly (m3) |
| Hosted LLM on another person's data | NG / AE | First non-founder request | s.41–43 basis; DPA with Anthropic; AUP disclosure; ZDR via sales | Docs 6/9 vs Act on consent (M4) |
| Research notes on named securities | NG | Delivered to others, plausibly "for remuneration" | SEC opinion: ISA 2025 "investment adviser" (definition **not retrieved**; ISA 2007 also covered issuing "analyses or reports concerning securities", from memory, E4) | No: Doc 6 trigger ignores research |
| Research notes | AE | Offered to onshore residents, from anywhere | CMA "financial advisory"/"promotion" opinion; DFSA GEN 2.11.1 if DIFC | Doc 9 cautious; Doc 6 narrow |
| Optimiser alternatives on user holdings (module 7) | NG / AE | First external user, paid **or free** | SEC robo-advisory registration (₦100m capital per Doc 9 F14) or partner licence; CMA licence; AUP qualified-human review (E1) | **No** (B3) |
| Goal-engine `adjustment` (C6) | NG / AE | Same | Opinion: financial-planning advice vs information; AUP "allocate" | Not addressed |
| Behavioural insights | NG / AE | First external user | NDPA s.27(1)(g), s.30 consent, s.37; PDPL family limb | Yes (Docs 3, 7, 8) |
| Indicative tax computation, free | NG | First external user | CITN s.16 needs remuneration: outside if genuinely free. **Bundled in a paid plan = remuneration (E4)**. AUP "own taxes" review | Partly |
| Paid tax-and-records pack | NG | First sale | CITN member as the practising, paid party; NTAA s.33 accreditation to file; s.33(4)(a)/s.101 liability; indemnity | Yes (Docs 6, 9) |
| Pre-filled return / submission | NG / AE | Any submission for another | NTAA s.33 accredited agent; FTA-registered agent | Yes |
| Bank-API aggregation (Mono, Lean) | NG / AE | Company becomes API consumer | CBN open-banking registration (when live); CBUAE Open Finance TPP licence (**not verified**) | Yes, at summary level |
| Scores or "profile, analytics and scoring" shared with anyone | NG | Any third-party use | CBN open-banking Tier 3; credit-reporting law (not checked) | Not addressed: keep as Do-not-build |
| Pre-orders and marketing (S-a) | AE | Targeting onshore residents, month 3 | Decree-Law 33/2025 "promotion": counsel first | **No** (B3) |
| NGX data, founder's analytics | NG | Any processing beyond display | Non-display fee (EUA cl. 3.1); NGX written answer | Yes (Doc 5c) |
| NGX values sent to a hosted model | NG | First call carrying values | NGX view on "Distribution" | Not addressed (M7) |
| NGX or US vendor data shown to others | NG / US | First external user | Display + distribution + non-display licences; commercial vendor plans | Partly (M7c) |

## 6. Controls specified that will not, or cannot, be performed

| Control | Source | Why it fails for one person | Recurring load (E5) |
|---|---|---|---|
| validator ≠ ingester for manual world facts | C3.3 | The founder enters and validates | — |
| C7 checker / second internal reviewer | C7; Doc 6 rule table | No second human; AI review is not independent | — |
| Seeded unannounced errors | Doc 8 §4.9 | Cannot be self-administered; risk to real decisions | — |
| Independent facilitator, blind scorer | Doc 8 §4.9 | Open; unbudgeted | — |
| External security review (MVB 10) | Doc 7 §4.7.1 | Not in Doc 9 Stage 0 budget | ≈1 reviewer-week once |
| Weekly tax-source monitor | Doc 6 §4.2 | Six sites plus two feeds a week | ≈26 h/yr |
| Weekly `pip-audit` with upgrades | MVB 7 | Nobody on call | ≈26 h/yr |
| Single-source price sampling | Doc 5c §4.3.10 | Plausible if kept small | ≈20 h/yr |
| Review queue (steady state) | C4; CC-8 | Fatigue under M1 flooding | ≈5–15 h/yr |
| Restore drills | MVB 8 | Plausible | ≈12 h in year 1 |
| Smoke-eval triage | Doc 7 §4.6 | ≈8 runs a month | ≈24 h/yr |
| C4 quarterly calibration; C3.5 snapshots; licence re-checks; portal field mapping | C4, C3.5, Doc 5c, Doc 6 R7 | — | ≈20 h/yr |
| **Total recurring** | | | **≈130–150 h/yr ≈ 3 h/week**, about 15% of a 20 h/week budget before any building (P-1) |

## 7. Items requiring counsel

1. **Nigerian data-protection counsel:** whether the household exemption survives a company-held API account or a cloud processor; GAID vs NDPA s.43(1)(a)–(b) on consent and contract as transfer bases; the scope of the undefined "profiling"; extra sensitive categories under s.30(2); the company's basis for keeping a vault after erasure; S-a recruitment data; any NITDA localisation duty (not checked).
2. **Nigerian capital-markets counsel:** the ISA 2025 "investment adviser" definition and any research exclusion; whether modules 7 and 9 and the C6 `adjustment` are "digital advisory services"; whether the "third-party technology provider" exemption (Doc 9 F14) covers a B2B route; whether free provision changes the answer.
3. **Nigerian tax-practice counsel:** CITN s.16(1)(a)–(c) for a paid plan that bundles tax, including "holds himself out"; whether a CITN co-signature suffices; NTAA s.33 and s.101 liability.
4. **UAE counsel:** Decree-Law 33/2025 "promotion" and "financial advisory" for cold-channel pre-orders and research features; PDPL status, transfers and the banking-data carve-out; the CBUAE Open Finance third-party route.
5. **Licensing counsel:** NGX EUA on values sent to an AI processor; cl. 13.5 purge vs 6-year retention; GPLv2 compatibility of any distributed build; whether AUP high-risk duties reach a founder-only deployment.

## 8. What I could not check

ISA 2025 text (adviser definition unverified) and the SEC Robo-Advisory Rules PDF (rests on Docs 6, 9); NDPC GAID primary text; UAE PDPL primary text and Executive Regulations; Decree-Law 33/2025 primary text (secondary only); NITDA localisation guidelines; Nigeria's credit-reporting law; NGX EUA cl. 13.5 (relied on Doc 5c); Fava's Host-header handling and CSP (needs a test, not a reading); whether Anthropic grants ZDR to individuals; the AUP version in force before 12 Nov 2026. The NDPA copy was not compared with the gazette and has OCR artefacts. Nothing runs yet, so there was no live penetration test; C2 results come from the reference validator, not production code.
