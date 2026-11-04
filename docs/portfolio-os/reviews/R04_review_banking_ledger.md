```
Review of: 04 — Banking and Personal Finance Architecture (v0.1, 2026-11-02)  ·  Reviewer roles: chartered accountant / internal auditor; principal data engineer; Nigerian retail-banking operations specialist (all simulated, none licensed)  ·  Date: 2026-11-04  ·  Verdict: Major revision
```

## 1. Verdict and the three most important problems

**Verdict: Major revision.** The direction is right: statements before APIs, double entry, reconciliation as a gate, and named FX series. The worked-example arithmetic reproduces exactly. The problems are in the ledger contract, which the other documents will build on. As written it would let wrong postings pass every control and still balance.

1. **FX "conversion cost" is a residual plug, and the ±6% band lets it absorb matching errors (Blocking).** The cost is defined as |D| − fees − |C|×ref_rate, so any false-positive cross-currency match, wrong reference date or misread amount within 6% becomes a plausible "spread". The transaction balances and every statement reconciles. Nothing in §4.3.7 catches it.
2. **The ledger model is not settled and contradicts Docs 06 and 07 (Blocking).** It balances on Σ base_amount = 0, not per currency. Categories are encoded as posting accounts, which clashes with append-only storage and mutable categories. There are no currency lots, although Doc 06 says foreign currency is a chargeable asset under NTA s.34(1)(b). §4.5(7) allows "decimals with four places for rates", which truncates USD-per-NGN to 0.0007, an error of about 5%.
3. **Ingestion claims run ahead of evidence (Major).** `bankstract` is an alpha package, first released in June 2026, with four parsers (FBN, OPay, PalmPay, Zenith). Its OPay row-chaining is disabled. Yet OPay is listed as a Tier 1 must-have source and the rule is "reject files that fail balance checks". Duplicate hashing breaks on re-exports. The Plaid mapping misfiles telecoms, and stamp duty is booked as a bank fee.

## 2. Findings, severity-ranked

### 2.0 Recomputation of the worked example (§4.6)

I ran `scratchpad/scripts/worked_example.py` with `python3 -I` and checked it by hand. Every printed figure in §4.6 matches the script to the cent:

- A1 closing balance: ₦3,898,144.97 (credits 4,157,300.00, debits 1,509,155.03).
- A2 closing balance: AED 24,775.65.
- A3 closing cash: $2,170.72.
- FX costs: T1 ₦57,985.02 (3.15%), T2 ₦33,320.00 (3.33%).
- Savings: net saving $4,422.44 (57.1%).
- Net worth: $11,100.77 → $15,622.12. Decomposition 4,422.44 + 111.00 − 12.51 + residual 0.42. NGN-view translation gain ₦181,969.38.
- T2 postings: −739.64 + 715.00 + 24.64 = 0.

The arithmetic is not the problem. The accounting and operational content is:

| # | Item in §4.6 | Problem |
|---|---|---|
| W1 | Reference rates on 18 Oct (₦1,350) and 31 Oct | 18 Oct 2026 is a **Sunday** and 31 Oct a **Saturday**. NFEM has no fixing on either day. The spec has no non-business-day rule (previous fixing? next?). Doc 07 marks a rate older than 2 business days as stale. |
| W2 | "NFEM ₦1,346.91 … CBN weighted average" | The re-fetched source gives 29 Oct buy ₦1,345.91, **sell ₦1,346.91, central ₦1,346.41**. The document stores the *sell* rate and calls it the weighted average. It also uses 29 Oct as month-end when the source shows 30 Oct trading. Provenance must name the field (buy/sell/central) and the fixing date. |
| W3 | T1 legs dated 18 Oct (debit) and 19 Oct (credit) | §4.2 says each posting uses the rate "as of the transaction date". A transfer has two dates, and the spec does not say which one sets the FX cost. The script uses the debit date. |
| W4 | T2 "auto-link" | Under the document's own counterparty test (§4.3.2), T2 **fails**. Neither narration names the other institution, the user, or a shared reference; "FOR BROKERAGE FUNDING" does not name A3. The only links are the USD amount in the A1 narration and timing. The example over-states what the rule would do. |
| W5 | T2 charged "NIP fee / VAT / stamp duty" on an "FX PURCHASE" | If the bank sold the USD, the outward leg is a SWIFT or FX-desk transaction, not NIP, so the NIP band and fee do not apply. The A3 narration says "wire from FX provider", which implies a third party. The chain is A1 → non-owned intermediary → A3, and the spec has no intermediary leg (Doc 07 §4.12 uses `Assets:Transit`). |
| W6 | Second 12 Oct POS debit posted to `Suspense:PendingReversal` | This works only because the reversal is already on the same statement. In real time both debits post to Fuel. If the reversal never arrives (common with failed Nigerian POS transactions), "Suspense must be empty at period close" blocks close indefinitely. An unreversed double debit is a **claim against the bank** (`Assets:Receivable:BankDispute`) with an ageing and dispute workflow, not suspense. |
| W7 | CAMF base "net of the reversed duplicate" = ₦1,480,800 | Unsourced. Whether a bank charges CAMF on gross or net debit turnover, and whether POS, airtime and FX purchases count as "customer-induced debits to third parties", needs the 2026 Guide text. 0.5 per mille is a **cap**, so the audit test is ≤, not =. Rounding mode (the script uses HALF_UP; banks often truncate) decides whether a 0.00 tolerance raises false alerts. |
| W8 | Stamp duty on two NIP debits only | NTA Ninth Schedule item 48 (cited in Doc 06 F21) covers "electronic receipt or transfer of money". The document does not say whether **POS/card payments** (₦48,500 and ₦27,300 × 2 here) are in scope. The re-fetched Kuda and TechEconomy notices are silent on this. Also, "the salary credit carries none (exempt)" mixes up the logic: under sender-pays, a *recipient* never pays, whatever the exemption. |
| W9 | AED Aani transfer → `Expenses:Dining:SharedBills` | Aani pays to a mobile-number proxy. The user's own number may be the proxy for their own Wio or Liv account. The narration cannot show either "dining" or "not own account". It should be `needs_review`. |
| W10 | Residual +0.42 "is zero in production" | Wrong. The 0.42 is the gap between FX costs measured at transaction-date rates and flows converted at month-end rates (T1 +3.11, T2 −2.70). With transaction-date rates, the gap reappears as **translation on intra-month NGN flows**. IAS 21 retranslation of the closing monetary balance yields it automatically, but the decomposition shown only translates the *opening* balance. The production rule must translate balance changes as well as opening balances. |
| W11 | ETF commission expensed; cost lot $700 | Doc 06 §4.1 includes `fees` in the lot. For CGT purposes acquisition costs normally go into cost basis. The two documents disagree (see §5). |
| W12 | "Four times the visible bank charges" | The implicit cost ($67.79) is 4.2× an explicit figure ($16.10) that *includes* withholding tax and commission. Against bank charges only (≈$12.22) it is 5.5×. The sentence needs a defined denominator. |
| W13 | WPS "SALARY SEP" credited 1 Oct counted as October income | WPS allows payment up to the 1st of the following month, and 85% of wages by then is compliant (EY, re-fetched). A calendar month can therefore hold zero or two AED salaries. Cash-basis savings rate and the "±3 days monthly anchor" both need a pay-period attribute separate from the cash date. |

### 2.1 Blocking

**B1. The FX conversion cost is a plug, and the ±6% band turns matching errors into "spread" (§4.2, §4.3.2).**
- **Claim:** "FX cost is an explicit posting, never a plug."
- **Why it fails:** By definition it is the residual that makes Σ base_amount = 0. It mixes four things: (a) the true dealer spread; (b) reference-rate choice (official vs parallel, buy vs sell); (c) rate drift between the two leg dates; (d) any mismatch.
- **How wide the band is:** For T2, ±6% admits any USD credit from about $695 to $784 within [−1, +5] business days. A freelance USD receipt or a dividend sweep in that range would be "matched", a fictitious ₦-cost booked, and both statements would still reconcile.
- **Asymmetry:** The band is symmetric, but spreads on AED/USD conversions (pegged pair) are about 0–1.5%, not 6%. For NGN, an IMTO or parallel-market rate can be *better* than NFEM, so a positive residual is legitimate only for NGN legs.
- **Evidence is circular:** "Observed 2–3.5% spreads" cites §4.6, the synthetic example. F7's 2–3% is the official-vs-parallel gap, not a measured spread.
- **Fix:**
  - Per-pair, one-sided bands calibrated on real data.
  - Book the residual as `FX:ConversionCost` only when the match is confirmed by a shared reference or by the user. Otherwise post to `Suspense:FXUnexplained`.
  - Split the cost into "vs official" and "vs dealer-quoted rate" where the provider prints its rate (Wise and IMTO receipts do).
  - Add a control: the conversion cost as a percentage must fall inside the pair's historical distribution, or the item goes to review.

**B2. The ledger invariant, currency model and precision are under-specified and partly wrong (§4.2, §4.5(7)).**
- **(a) Invariant.** Σ base_amount = 0 is weaker than Beancount's per-currency weight rule, which Doc 07 §4.2 mandates. Nothing forces base_amount = round(amount × ref_rate). A stored base amount can drift without breaking the invariant. Rounding residuals have no home (Doc 07 books them to `Equity:FX-Rounding`).
- **(b) One currency per leaf.** The rule is contradicted by the example: `Expenses:Groceries` and `BankCharges:VAT` receive both NGN and AED. Either expense leaves are multi-currency or the chart needs per-currency leaves.
- **(c) Revaluation postings.** A revaluation changes only the base value, so its native amount is zero. The schema cannot express that. If revaluations are stored as postings tied to one base currency, switching base currency (Doc 01 A4, and the dual view in §4.4.7) means rewriting history. Revaluation should be a derived view, or carry a base-currency key.
- **(d) Precision.** "Decimals with four places for rates" breaks whenever a rate is expressed as base per foreign unit with USD as base. 1/1352 = 0.00073964 becomes 0.0007, an error of 5.4%. Units for fractional ETFs (2.8 here; IBKR up to 4 decimal places), fund units and IBKR commissions (often 4–8 decimal places) also do not fit "integers in minor units".
- **Fix:** Adopt Doc 07's NUMERIC(28,8) amounts (or wider for rates), store rates in a fixed direction with ≥10 significant digits, state the invariant per currency with price annotations, and set a written rounding policy (mode, where residuals go).

**B3. No currency cost basis, so no realised FX gain for tax (§4.2, F21).**
- Doc 06 F4 and §4.1 require weighted-average lots for currency holdings, because NTA s.34(1)(b) makes foreign currency a chargeable asset.
- Doc 04 values each conversion only against the day's reference rate. When AED 5,000 is sold for naira (T1), the taxable quantity is proceeds minus the NGN cost basis of those dirhams. The "conversion cost" is a different, non-tax number.
- **Fix:** Add `Assets:*:AED/USD` currency lots in NGN (the tax-reporting currency), alongside the spread measure, and label each output.

**B4. The reconciliation identity does not test what the document says it guarantees (§1 Conclusion 3, §4.3.7).**
- Opening + Σcredits − Σdebits = closing shows the parse is complete relative to the document. It says nothing about classification, matching, dates or authenticity.
- Cases where every control in §4.3.7 passes and postings are still wrong:
  1. Misclassification, including a family loan booked as income.
  2. A false-positive transfer match (B1).
  3. **DD/MM vs MM/DD swaps.** "12/10" in a Nigerian PDF vs a US-format CSV leaves totals and chaining intact but moves FX dates, periods, the stamp-duty regime boundary (1 Jan 2026) and the tax year.
  4. **Dropping an adjacent debit–reversal pair.** Removing the 09:42 duplicate and its reversal leaves row chaining and opening/closing intact. Only printed totals catch it, and bankstract reports that check as `not_available` for Zenith.
  5. A bank that omits movements, such as OPay OWealth sweeps (see M1).
  6. A tampered PDF that is internally consistent.
- The "ledger assertion" (ledger balance = statement closing) is circular when the bank leg comes only from that statement.
- **Fix:**
  - Re-state Conclusion 3 as a completeness control, not an integrity guarantee.
  - Add independent checks: counter-leg confirmation for transfers; date-format plausibility (value_date ≥ transaction date, no future dates, consistent day-of-week patterns); bankstract's `inspect()` tamper signals; and a periodic "trace to source" sample (Doc 06 §4.1).

### 2.2 Major

**M1. bankstract is over-relied on, and OPay contradicts the rejection rule (F3, F4, §4.1 Tier 1).**
- The PyPI JSON API (checked 2026-11-04) shows bankstract is "Development Status :: 3 - Alpha", single maintainer, 21 releases since 13 Jun 2026.
- It has **four parsers only**: PalmPay, First Bank and Zenith (PDF), and OPay (PDF, XLSX). It has none for Kuda, Moniepoint, GTBank, UBA or Access.
- Its check matrix: Zenith totals `not_available`; PalmPay row-wise `not_available`; **OPay row-wise `disabled`** because OWealth moves are omitted.
- So OPay statements cannot pass §4.3.7 "row chaining" and the files would be rejected, yet OPay is a Tier 1 must-have source. The document's own claim that "OPay balances do not chain" leaves this unresolved.
- Also, bankstract does not "enforce exactly" the opening/closing identity. It runs row-wise and printed-totals checks.
- **Fix:**
  - Pin and vendor-review the dependency.
  - Define a "reconciled with documented exception" state (e.g., an OWealth sweep account inferred from balance breaks).
  - Treat bankstract's tamper `inspect()` as an asset the document missed.

**M2. Duplicate detection fails on re-exports (§4.3.4, R4).**
- `line_hash` includes `normalised_narration` and `running_balance`. Re-exports change both:
  - PDF vs XLSX from the same bank truncate narrations differently.
  - Some exports omit running balance. Revolut, Wise and IBKR differ, so the hash falls back to the date+amount+narration weakness the document criticises.
  - A back-dated posting or a re-ordering of same-day items changes **every later running balance**. The whole overlap then re-imports as new lines and the fuzzy layer floods.
- Two identical lines in one file with no balance column hash the same, so the second is silently skipped. The statement then fails and is wrongly rejected.
- The fuzzy rule (≤2 days, equal amount, Jaro–Winkler ≥0.85) will flag every repeated ₦50/₦3.75/₦50 fee triple and same-day airtime purchase.
- Doc 07 §4.2(7) specifies a different key (no running balance).
- **Fix:**
  - Key on bank reference / NIP session ID when present.
  - Otherwise key on (account, value_date, signed amount, within-day ordinal).
  - Treat narration as a soft feature.
  - Exclude system charge lines from fuzzy matching by anchoring them to their parent transaction.
  - Resolve overlaps at the **last common row**, not at a date. The 31 Oct month-end CAMF/SMS lines may be absent from an export generated on 31 Oct.

**M3. Account identity across uploads is unspecified (§4.2 `account`, `statement`).**
- `line_hash` starts with account_id, but there is no rule for resolving an uploaded file to an account.
- Masked NUBANs differ between exports (last-4 vs first-3), and IBAN vs account number.
- A Wise multi-currency file maps to several leaves.
- If a second account_id is created for the same account, dedup, continuity and transfer matching all fail silently.
- **Fix:** A deterministic resolver (institution + full identifier hash + currency), a user confirmation on first sight, and a merge operation that is itself journaled.

**M4. Fellegi–Sunter is named but not specified (F12, §4.3.2).**
- Fellegi–Sunter needs m/u probabilities (from EM or labelled data) and assumes conditional independence. Amount agreement and date agreement are dependent in cross-currency pairs because the rate moves with the date.
- One-to-one assignment needs a global step; pairwise scores are not enough.
- "Confidence ≥0.95" is not a Fellegi–Sunter quantity.
- **Labelled data needed:**
  - Stratified positives by rail and pair (NIP same-bank, NIP inter-bank, IMTO AED→NGN, NGN→USD via FX provider, Wise intra-jar, card top-ups, savings-app sweeps).
  - **Hard negatives**: same-amount third-party credits, family remittances, refunds.
  - Split transfers.
- At the founder's volume (monthly cross-currency), §9 item 6's "200 own transfers" will take years for the cross-currency strata. Plan synthetic augmentation and say that thresholds are provisional.

**M5. Irregular and business income detection is biased and too coarse (§4.3.1).**
- Defaulting unknown credits to `TRANSFER_IN:OTHER` systematically **understates** income. That is the tax-dangerous direction under worldwide taxation (Doc 06 s.12, s.202).
- Missing classes common in Nigerian accounts:
  - Gift received.
  - Loan received (liability) and loan repaid to the user (receivable).
  - Reimbursements (the Aani shared bill).
  - P2P crypto sale proceeds from strangers (a disposal, not income).
  - Sale of personal assets.
  - Mixed personal/business accounts (Moniepoint POS-agent turnover is revenue, not income).
- `INT` as a narration cue matches INTERNET, INTL and INTER-BANK.
- "≥2 credits from the same counterparty" relies on truncated NIP sender names.
- ±3 days will miss salaries moved for weekends, Eid or December early pay. For WPS see W13.
- "WPS in the narration" is not documented anywhere I could find; the EY alert describes the file channel, not the narration. Grade it E4/E5.
- **Fix:** A typed credit taxonomy with a tax-relevance flag. Every unclassified credit counts toward a visible "unexplained inflows" total that Tax sees.

**M6. Plaid PFC v2 mapping errors and gaps (§4.3.5).** I re-downloaded `pfc-taxonomy-all.csv`: 18 primary and 127 detailed categories, confirming F10. However:

| Item | Problem |
|---|---|
| Telecoms and airtime | Mapped to GENERAL_SERVICES/ENTERTAINMENT. Plaid has **RENT_AND_UTILITIES_TELEPHONE**. |
| Stamp duty / EMTL | Booked under BANK_FEES. These are government levies collected by banks, so GOVERNMENT_AND_NON_PROFIT_TAX_PAYMENT fits, and Tax needs them separate from fees. |
| FX conversion cost | Nearest is BANK_FEES_FOREIGN_TRANSACTION_FEES; the mapping should say so. |
| Rails | POS, USSD, NIP, Aani, WPS, UAEFTS and SWIFT are **rails/channels, not categories**. Plaid keeps them in `payment_channel`. The schema has no `rail` field, so "POS", "USSD" and "NIP" cannot drive both category and fee audit. |
| USSD | Session charges are telco-billed. |
| Family remittances | Mapped to GOVERNMENT_AND_NON_PROFIT ("Family & giving"); they belong under TRANSFER_OUT_ACCOUNT_TRANSFER / OTHER. Donations are a separate detail category. |

The many-to-many mapping means the "comparability" claim is not earned. **Fix:** a one-to-one detailed mapping table, plus `rail`, `levy_type` and `is_tax` attributes.

**M7. Category-as-account conflicts with append-only storage (§4.2 vs Doc 07 §4.2(2)).**
- In Doc 04 the category *is* the posting account (`Expenses:Groceries`). User edits ("categories are user-editable") therefore rewrite postings.
- Doc 07 keeps categories in a mutable `entry_category` table and forbids changing postings. Doc 06 F2 requires reversal plus replacement.
- **Fix:** Choose one model. I recommend coarse posting accounts (expense / transfer / fee / tax) with category as journaled soft state.

### 2.3 Minor

- **m1.** "Statement rejected" on any mismatch (§4.3.7) vs Doc 06's `UNEXPLAINED_DIFFERENCE` item. Rejection loses the data. Prefer quarantine with a named difference.
- **m2.** Beancount balance assertions apply at the *start* of the date (F11), yet §4.3.7 asserts "at period_end". That is an off-by-one, given intra-day timing and statements generated mid-day.
- **m3.** Time zones and calendars are absent:
  - Time zones: WAT (UTC+1), GST (UTC+4), IBKR US Eastern.
  - "Business days" without naming the calendar (Nigerian, UAE and US holidays differ).
  - value_date vs booking date. Doc 06 says value date drives period allocation; Doc 04 uses `date`.
- **m4.** Doc 04 says the stamp-duty section was "not located", but Doc 06 F21 cites NTA s.123, Ninth Schedule item 48 and s.184(i). TechEconomy (re-fetched) also says "or their foreign currency equivalent", which partly answers §7 item 2.
- **m5.** Himma lists consumer data sharing confirmed at **FAB and DIB** as well as CBD and Mashreq. Its own onboarding count is inconsistent (4 vs 5).
- **m6.** S61 and S84 are marked unverified but resolve on Crossref: 10.61190/fsr.v24i2.3240 and 10.2139/ssrn.3455696.
- **m7.** §7 item 1 says "[checked 2026-11-04]" in a document dated 2026-11-02.
- **m8.** Parallel-market "stress" uses an unsourced series. Label it indicative until §7 item 7 is resolved.
