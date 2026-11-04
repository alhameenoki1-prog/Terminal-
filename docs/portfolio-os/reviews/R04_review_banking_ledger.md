```
Review of: 04 — Banking and Personal Finance Architecture (v0.1, 2026-11-02)  ·  Reviewer roles: chartered accountant / internal auditor; principal data engineer; Nigerian retail-banking operations specialist (all simulated, none licensed)  ·  Date: 2026-11-04  ·  Verdict: Major revision
```

## 1. Verdict and the three most important problems

**Verdict: Major revision.** The direction is sound: statements first, double entry, reconciliation gating, named FX series. The worked-example arithmetic reproduces to the cent. The ledger contract is the weak point. As written, it lets wrong postings pass every control.

1. **The FX "conversion cost" is a residual plug (Blocking).** With a symmetric ±6% band, any false-positive cross-currency match, wrong rate date or misread amount is booked as plausible "spread". Every statement still reconciles.
2. **The ledger model contradicts Docs 06 and 07 (Blocking).**
   - It balances on Σ base_amount, not per currency.
   - Categories are stored as posting accounts, which conflicts with append-only storage.
   - It has no currency lots, although foreign currency is chargeable under NTA s.34(1)(b).
   - "4 dp rates" truncate USD-per-NGN with an error of about 5%.
3. **Ingestion claims outrun evidence (Major).**
   - bankstract is an alpha package with four parsers, and its OPay chaining is disabled, yet OPay is Tier 1 under a "reject on failure" rule.
   - Duplicate hashing breaks on re-exports.
   - The Plaid mapping misfiles telecoms and stamp duty.

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

## 3. Evidence-grade audit

| Location | Claim | Grade given | Should be | Reason |
|---|---|---|---|---|
| F1 | CBN rule texts | E2 | E3 (or E2 if Doc 07's S48 primary text is cited) | S1 and S3 are law-firm summaries |
| F1 | "October 2026 review found no go-live" | E3 | E3, but not independent | TechCrier's latest evidence is the July 2026 OBN page (re-fetched), so it is circular, not corroborating |
| F7, F8 | FX regime; CBUAE regulation | E2 | E3 | Legal500/Mondaq and law-firm summaries; rulebook not read |
| F12 | Fellegi–Sunter is "the correct foundation" | E1 | E2 for the theory, E4 for applicability | One theoretical paper, not replicated evidence for this use |
| F14 | Paycheque-anchored forecasting | E1 body | E2 evidence + E4 transfer | US and Icelandic data; no NG/UAE evidence |
| §4.3.1 | ±3 days, ±15%, confidence 0.95/0.80 | untagged | E5 | Engineering assumptions stated as specification |
| §4.3.2 | "Observed 2–3.5% spreads" | implicit | E6/E5 | The source is the synthetic §4.6 |
| §4.3.1 | WPS narration cue | untagged | E4/E5 | Not in the EY/MOHRE text |
| F4 | NIBSS session-ID labels per bank | "[search, vendor]" | unsourced | No source number |
| §8 | Targets (≥95% auto-reconciled, <10 min, ≥90% at ≥0.90) | untagged | E5 | No baseline |

## 4. Citation and source spot-check

**Academic (Crossref DOI API, 2026-11-04).** All match title, authors, year and volume.

| Ref | DOI | Status |
|---|---|---|
| S60 Grable & Lytton 1999 | 10.1016/S1057-0810(99)00041-4 | Verified (FSR 8(3)) |
| S62 Heath & Soll 1996 | 10.1086/209465 | Verified |
| S65 Soman & Cheema 2011 | 10.1509/jmkr.48.SPL.S14 | Verified |
| S66 Prelec & Loewenstein 1998 | 10.1287/mksc.17.1.4 | Verified |
| S67 Soman 2001 | 10.1086/319621 | Verified |
| S68 Fernandes et al. 2014 | 10.1287/mnsc.2013.1849 | Verified |
| S69 Kaiser et al. 2022 | 10.1016/j.jfineco.2021.09.022 | Verified (145(2)) |
| S70 Olafsson & Pagel 2018 | 10.1093/rfs/hhy055 | Verified |
| S71 Carlin et al. | 10.1093/rof/rfac040 | Verified (27(3); issued 2022) |
| S72 Lusardi et al. 2011 | 10.1353/eca.2011.0002 | Verified |
| S78 Gathergood et al. 2019 | 10.1257/aer.20180288 | Verified |
| S79 Fellegi & Sunter 1969 | 10.1080/01621459.1969.10501049 | Verified (64(328)) |
| S61 Kuzniak et al. 2015 | 10.61190/fsr.v24i2.3240 | Document says unverified; **found** |
| S84 Sabat & Gallagher 2019 | 10.2139/ssrn.3455696 | Document says unverified; **found** (SSRN) |

**Non-academic (re-fetched 2026-11-04).**

| Source | Result |
|---|---|
| S20 Kuda stamp duty | Confirmed: ₦50, ≥₦10,000, sender, from 1 Jan 2026. Exempt: salaries, own Kuda accounts. Silent on POS/card. |
| S22 TechEconomy | Confirmed; adds "or foreign currency equivalent". No statute section. |
| S21 Paystack | Confirmed: 18 Feb 2026, merchant outflows, payroll merchants exempt. |
| S18 Legit.ng (CBN charges) | Confirmed every figure in F5 (effective 1 May 2026). Still press, not the CBN PDF. |
| S26 Nairametrics CPI | Confirmed 14.63 / 15.39 / 20.98 / 0.06 / 19.59 / 12.95 / 15.64 / 12.46. Doc 03 notes core 13.29% in other press. |
| S29 WithinNigeria NFEM | ₦1,346.91 confirmed as the 29 Oct **sell** rate; central ₦1,346.41; parallel ₦1,375–1,390 (W2). |
| S2 Open Banking Nigeria | "Last updated July 2026"; go-live pending; expected "early 2026" (the document says mid-2026 via S90). Individuals are not API consumers. |
| S6 TechCrier | No go-live confirmed; relies on the July 2026 OBN page. |
| S32 Himma tracker | Confirmed 5 live; see m5. |
| S15 bankstract (PyPI JSON) | v0.18.3, 2 Nov 2026, MIT, Alpha, 4 parsers (M1). |
| S51 Plaid PFC CSV | 18 / 127 confirmed; mapping errors (M6). |
| S38 EY WPS | Confirmed Resolution 340/2026, 12 May, effective 1 Jun, 1st-of-month deadline; adds the 85% compliance threshold. |
| S36 aep.ae (Aani) | "Up to AED 50,000"; no daily or per-proxy split. The conflict stands. |

## 5. Cross-document contradictions

| Topic | Doc 04 | Doc 06 | Doc 07 |
|---|---|---|---|
| Posting shape | Multi-leg, signed, Σ base = 0 | `account_dr, account_cr` (two-legged) | ≥2 postings, Σ weights = 0 **per currency** |
| Amount precision | Integer minor units *or* decimals, "4 dp for rates" | — | NUMERIC(28,8); ROUND_HALF_EVEN; `Equity:FX-Rounding` |
| Rounding in the example | HALF_UP | — | HALF_EVEN |
| Append-only | Not stated; categories editable on postings | Append-only, reversal + replacement | Append-only; categories in a mutable side table |
| FX spread | Expense vs reference rate | Realised/unrealised vs **weighted-average currency cost** | Price annotations via `Assets:Transit`; spread not shown |
| Reference/tax currency | USD + NGN dual view | NGN tax-reporting currency; CBN rate "acceptability unconfirmed" | — |
| Cost basis | Lots, no method; commission expensed | WA for currency, FIFO for securities, fees in lot | Beancount STRICT/FIFO |
| Reconciliation failure | Reject statement | `UNEXPLAINED_DIFFERENCE` item | Validation exception queue |
| Transfer window | [−1, +3] / [−1, +5] business days; ±6% | ±3 days | — |
| Duplicate key | Includes running balance | Control totals + file hash | (account, date, amount, description) |
| Bank-side double debit | Statement lines + suspense pair | "Reversed by a new entry" | — |
| One currency per account | Yes (but violated in §4.6) | Revaluation posts NGN into a USD account | Per-currency weights |
| CBN NFEM source | "Not fetchable"; press | — | CBN page with Excel export [Doc 07 S44] |

Doc 06 Example 3 also has its own error: 7.5% VAT on ₦1,000 is ₦75, not ₦50. This is outside my remit, so I am reporting it to R06's reviewer.

## 6. Questions the Investment Committee needs answered

1. Which ledger contract (Doc 04, 06 or 07) is authoritative, and who owns the invariant tests?
2. What is the residual-FX policy when a transfer is matched but unconfirmed?
3. Which banks does the founder actually use? bankstract covers four Nigerian banks, none of them the founder's confirmed banks.
4. Does stamp duty apply to POS/card payments and to domiciliary transfers in FX equivalent? What does the tax practitioner say?
5. What false-positive rate on transfer matching is acceptable, given that the errors flow silently into the FX-cost and savings-rate figures?
6. Who maintains the parallel-market series, and under what methodology?

## 7. Required changes before Investment Committee (priority order)

1. Replace the FX-residual design (B1): per-pair one-sided bands, a suspense account for unconfirmed residuals, and a dealer-rate split.
2. Harmonise the ledger contract with Docs 06 and 07 (B2, M7, §5): per-currency invariant, precision and rounding policy, append-only storage, category placement, revaluation as a view.
3. Add currency lots and NGN tax-basis FX gains (B3).
4. Re-state reconciliation as a completeness control and add the independent controls in B4.
5. Correct the ingestion evidence (M1): OPay exception state, bankstract maturity, the per-bank parser gap.
6. Redesign the dedup key and overlap resolution, and specify the account-identity resolver (M2, M3).
7. Specify the Fellegi–Sunter estimation, labelled-data strata and hard negatives (M4).
8. Fix the income taxonomy and the "unexplained inflows" exposure (M5).
9. Fix the Plaid mapping; add `rail`, `levy_type` and `is_tax` (M6).
10. Correct the worked example: W1–W13, especially W4, W6, W8 and W10.
11. Regrade per §3.

## 8. What the reviewer could not check

- The CBN 2026 Guide to Charges PDF, and therefore whether CAMF applies to gross or net turnover and whether ₦0.5/mille is in force. I confirmed only the press figures.
- NTA 2025 Ninth Schedule item 48 in the gazette. I relied on Doc 06's reading.
- Whether POS payments attract stamp duty.
- The CBN NFEM page and the CBUAE rulebook (not attempted, given that the author was blocked by 403).
- Real Nigerian/UAE statement samples. Narration conventions, session-ID labels, the GTBank Excel export and UAE bank formats remain untested.
- Aani's per-proxy limit (sources still conflict).
- Plaid confidence-level semantics, and the Firefly, Beancount and hledger documentation (not re-fetched).
- Whether 0.42 is the only residual under a full daily-balance retranslation. I reasoned it analytically from the T1/T2 split; I did not re-code it.
