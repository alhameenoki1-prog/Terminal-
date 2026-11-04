```
Document: 04 — Banking and Personal Finance Architecture (financial-ledger and personal-finance requirements specification)
Department: Banking and Financial Services  ·  Lead role(s): commercial banker, retail banking specialist, private banker / wealth-management professional, financial-planning specialist, financial adviser, credit and lending specialist, financial-infrastructure and open-banking specialist, banking-operations / payments specialist
Version: 0.1 draft  ·  Date: 2026-11-02  ·  Status: for cross-department review
Reviewers required: Data Architecture & Engineering; Tax Intelligence; Behavioural Finance; Portfolio Management & Quant; Forecasting & Wealth Planning; AI Research & Explanation; Legal/Compliance & Privacy; Commercialisation
```

> Simulated specialists are not licensed professionals. Every regulatory, tax and fee statement below carries the date it was checked (all on 2026-11-02 unless stated) and must be re-verified by a licensed practitioner before anything is relied upon or shipped.

## 1. Executive summary

**Conclusion 1 — the personal MVP must be built on statement upload and parsing, not on bank APIs.** As of 2026-11-02 neither Nigeria's CBN open-banking regime (framework 2021, Operational Guidelines March 2023, August 2025 go-live missed, "phased rollout through mid-2026" promised, no public confirmation of a nationwide go-live found) nor the UAE's CBUAE Open Finance platform (live, but only five of fifteen mandated banks publicly confirmed live as of July 2026, and access requires a CBUAE licence) gives an individual a reliable, licence-free path to consented account data [S2–S6, S31–S33]. Okra, Nigeria's best-known aggregator, shut down in May 2025 [S7]; Mono exists (now part of Flutterwave) but its pricing is quote-based and its connections are proprietary, not standardised [S8–S12]. Exports do exist for every account that matters: Kuda and Moniepoint (PDF/Excel), OPay (PDF/XLSX), First Bank, Zenith, PalmPay (PDF), Wise (CSV/XLSX/CAMT.053/MT940), Revolut (CSV), Interactive Brokers (Flex Query XML/CSV), Bamboo and Sarwa (PDF statements) [S13–S16, S42–S46].

**Conclusion 2 — use a double-entry ledger with postings, not a transaction list.** Multi-currency transfers with spread, investment contributions, reversals and bank levies cannot be represented honestly in a single-entry list. We specify a Beancount/Firefly-style model: accounts, transactions, postings (each with amount, currency, reference-rate value and an explicit FX-cost posting), balance assertions per statement, and explicit confidence/review states [S53–S56].

**Conclusion 3 — reconciliation is the product's integrity guarantee.** Every imported statement must satisfy opening balance + Σcredits − Σdebits = closing balance before any figure is shown; the open-source Nigerian parser `bankstract` already enforces exactly this and documents why (silently dropped PDF rows) [S15].

**Conclusion 4 — context changes the numbers.** Nigerian CPI was rebased in February 2025 (2024 = 100; headline 14.63% y/y in September 2026) [S25, S26]; the official NFEM rate (₦1,346.91/$ on 29 Oct 2026) and the parallel market (≈₦1,373–1,390) still diverge by 2–3% [S29]; a ₦50 stamp duty now hits the *sender* of transfers ≥ ₦10,000 (from 1 Jan 2026) [S20–S22]; the revised CBN Guide to Charges took effect 1 May 2026 [S18].

**Biggest uncertainty:** whether CBN open banking goes live in a form usable by a single-user application within the next 12 months. We recommend building for statements now and designing the ingestion layer so an API source is a second adapter, not a rewrite.

## 2. Scope and method

**Questions addressed.** (A) How can financial data actually be obtained today across NGN, AED and USD accounts? (B) What ledger design is sound for an individual with multi-currency accounts? (C) What transaction intelligence (income detection, transfer matching, duplicates, categorisation, reconciliation) is feasible and how is confidence stored? (D) What planning intelligence has evidence behind it? (E) Which Nigerian and UAE facts change the numbers? (F) A reproducible synthetic worked example.

**What we searched and used.** WebSearch (standard and extended modes) across CBN, CBUAE, NBS, bank and fintech help centres, open-banking bodies, open-source project documentation and press (about 60 queries until the shared search budget was exhausted); WebFetch of primary pages and PDFs (CBN Guide to Charges 2020, NBS CPI Rebasing Highlights, PenCom FAQ 2023, FPAM/FPSB Practice Standards 2021, Standard Chartered UAE VAT FAQ, Plaid taxonomy CSVs, Wise/Actual Budget/Beancount documentation); Python 3 (decimal arithmetic) for the worked example; OpenAlex API (direct HTTPS) to verify academic references after the reference-lookup MCP tools timed out. Each time-sensitive fact states the date checked.

**What we could not access.** Several official pages blocked automated fetching (CBUAE rulebook, Firefly III docs, IBKR docs, ADCB, Sarwa, Revolut help, Moniepoint support); for those we rely on search-engine extracts of the official text and say so. We could not fetch the CBN's 2026 Guide to Charges PDF (figures are from two press reports), the CBN exchange-rate page (figures are press reports quoting CBN), or any official OPay, PalmPay, GTBank, Zenith, Access, UBA, Stanbic IBTC, Mashreq, Wio, Liv, RAKBANK, PiggyVest, Cowrywise, Trove or Chaka statement-export documentation. Those are listed as validation tasks (§9) rather than asserted. We did not read the founder's Google Drive or Gmail and wrote no application code.

## 3. Findings

Evidence grades follow the brief (E1–E6). Source numbers refer to §10.

**F1. Nigeria's regulated open banking is not usable for product planning today.** The CBN issued the Regulatory Framework in February 2021 and the Operational Guidelines in March 2023 [S1, S3]. The 1 August 2025 nationwide go-live "did not materialise"; the five workstreams delivered in September 2025; the CBN's February 2026 FinTech report moved implementation to a phased rollout "spread across mid-2026"; on 8 June 2026 BusinessDay still described go-live as "months away"; Open Banking Nigeria's page (updated July 2026) awaits "the CBN's next directive"; an October 2026 review found no confirmed nationwide go-live [S2–S6]. One vendor page claims the rules are "now live" but is undated and contradicts the rest [S91]. NIBSS is nominated to run both the Open Banking Registry and a centralised consent-management system; access is tiered and anchored on the Bank Verification Number (BVN); consent must be informed, specific, granular and withdrawable [S2–S4]. **Grade E2 for the rule texts, E3 for status (press and industry body; no CBN primary notice found).** Checked 2026-11-02.

**F2. The aggregator market is thin and unpriced.** Okra wound down in May 2025 (reported 3 July 2025), citing naira-depreciation-driven cloud costs and regulatory delays [S7]. Mono (now a Flutterwave company) publishes a page with a 30-day free trial (5 accounts), a "Basic" plan at ₦50,000/month for up to 100 unique accounts, add-ons (Real-time Sync ₦100 per call; widget customisation ₦50,000 one-off) and "contact sales" for enterprise; the page is undated and a tracker reports pay-as-you-go pricing introduced in February 2026 (unverified) [S8, S11]. Mono's coverage page lists Nigeria ("40"), Ghana and South Africa and shows logos for GTBank, Access, Kuda, Zenith, UBA, First Bank, Stanbic IBTC, OPay, PalmPay, Moniepoint, PiggyVest, Cowrywise, Risevest, Chaka and Trove, but does not state product-level coverage or reliability [S9, S10]. Industry commentary notes Mono's connections are proprietary rather than standardised APIs [S12]. Stitch entered Nigeria with pay-by-bank payments, not account data; OnePipe's current data-product status could not be verified [S4, search]. **Grade E3 (vendor pages, trackers, press).**

**F3. Statement exports exist and are the realistic MVP source.** Confirmed from official or near-official sources: Kuda — PDF or Excel, requested in-app and emailed [S13]; Moniepoint — Standard or Extended statement, Excel or PDF [S14]; OPay — PDF and XLSX (evidenced by an open-source parser supporting both) [S15]; First Bank, Zenith, PalmPay — PDF (same parser) [S15]; GTBank — "My Account → Account Statement" in Internet Banking, emailed to the profiled address; third-party tooling references a GTBank Excel export (unverified) [S16]; Wise — PDF, XLSX, CSV, MT940, QIF, CAMT.053, per currency/jar, maximum 365 days per file [S42]; Revolut — CSV whose header is `Type, Product, Started Date, Completed Date, Description, Amount, Fee, Currency, State, Balance` (parser evidence; official help page blocked) [S43]; Interactive Brokers — Flex Queries in XML/CSV/TXT, retrievable by token and query ID through the Flex Web Service (`SendRequest` → reference code → `GetStatement`, version 3, pacing 1 request/second and 10/minute) [S44]; Bamboo — monthly brokerage statements in-app, trade confirmations per settled trade, wallet statements emailed with a 6-month maximum per request [S45]; Sarwa — Invest activity statement via web only, Trade monthly statements in-app [S46]; Risevest — statements per plan or all plans, emailed (third-party guide, 2022) [S47]; CSCS — portfolio statement via the e-CSCS investor portal or the stockbroker, one Clearing House Number per statement (third-party) [S49]; pension — PFAs must issue RSA statements at least every three months (PenCom FAQ 2023) [S50]. UAE banks: ADCB's app offers "Download Statement" with a file-format choice [S40]; Emirates NBD's *business* portal exports PDF/Excel/CSV, personal export formats unconfirmed [S41]; Mashreq, Wio, Liv and RAKBANK export formats not found. **Grade E3 where official, E5 (engineering assumption, to be tested with real files) elsewhere.**

**F4. Nigerian statements have bank-specific layouts and narrations; machine-readable integrity checks are feasible.** `bankstract` (MIT, v0.18.3 released 2026-11-02) normalises PDF/XLSX statements to `date, narration, debit, credit, balance, reference, currency, has_time`, and reconciles each file two ways — row-wise running balance and totals versus the printed "Total Money In / Out" — raising an error when a check cannot run; it documents that OPay balances do not chain because OWealth auto-save movements are omitted, that some statements print both debit and credit on one row, and that PDFs may be password-protected [S15]. The same NIBSS session identifier is labelled "Session ID" (GTBank), "Reference" (UBA), "Transaction Ref" (Zenith) or "NIP Session ID" (Access) [search, vendor]. Narration prefixes such as `NIP/`, `TRF/`, `POS/WEB PURCHASE`, `USSD`, `REVERSAL`, `STAMP DUTY`, `EMTL`, `SMS ALERT`, `VAT`, `ACCOUNT MAINTENANCE FEE` are observed conventions, not documented standards. **Grade E3 for the parser facts; E4/E5 for narration conventions (specialist experience; to be validated on redacted samples).**

**F5. The Nigerian charge regime changed twice in 2026.** The 2020 Guide to Charges (effective 1 Jan 2020) set electronic transfer fees of ₦10 (below ₦5,000), ₦25 (₦5,001–₦50,000) and ₦50 (above ₦50,000); mandatory SMS alerts on a cost-recovery basis and email alerts free; naira card maintenance nil on current accounts and max ₦50/quarter on savings accounts; FX-denominated cards $10 p.a.; card issuance ₦1,000; current-account maintenance fee (CAMF) max ₦1 per mille; monthly statements free and special-request statements max ₦20/page; USSD "current NIP charges apply"; RTGS ₦950 [S17, PDF text extracted]. The revised Guide, exposure draft 21 April 2026 and effective 1 May 2026, is reported to make transfers ≤ ₦5,000 free, ₦5,001–₦50,000 ₦10, above ₦50,000 ₦50; card issuance ₦1,500; no maintenance fee on naira cards; SMS alerts still cost-recovery; CAMF capped at ₦0.5 per mille in 2026 falling to zero by 2027; other-bank ATM ₦100 per ₦20,000 with an off-site surcharge up to ₦500; POS free to customers with a 0.5% merchant charge capped at ₦10,000 [S18]. Separately, the Nigeria Tax Act 2025 (signed 26 June 2025, effective 1 January 2026) replaced the Electronic Money Transfer Levy with a ₦50 stamp duty on electronic transfers of ₦10,000 or more, borne by the *sender*, with exemptions for salary payments and intra-bank self-transfers; Kuda applied it from 1 January 2026 and Paystack from 18 February 2026 for merchant payouts [S20–S23]. VAT at 7.5% is applied to explicit bank fees (e.g., ₦3.75 on a ₦50 fee) [S24]. **Grade E2 for the 2020 Guide (primary PDF), E3 for the 2026 Guide and stamp-duty mechanics (press, bank and PSP notices; statute section not located).** Checked 2026-11-02.

**F6. Nigerian inflation is measured on a new basis.** The NBS rebased the CPI in February 2025: weight reference period 2023, price reference period 2024 (= 100), COICOP 2018 with 13 divisions, 934 product varieties, Young index; food weight fell from 51.8% to 40.0%; January 2025 headline 24.48%, food 26.08%, core 22.59% [S25]. The September 2026 release (15 October 2026) reports headline 14.63% y/y (August 15.39%; September 2025 20.98%), month-on-month 0.06%, food 19.59%, core 12.95%, urban 15.64%, rural 12.46% [S26]. Old-series and new-series figures are not comparable. **Grade E2.**

**F7. Nigeria has one official rate and one street rate, and the system must store both.** Interbank FX trades moved to Bloomberg BMatch (the Electronic FX Matching System) on 2 December 2024; the Nigerian Foreign Exchange Market (NFEM) rate is computed on FMDQ's closing-rate methodology; the Nigerian FX Code took effect 14 October 2024 [S27, S28]. On 29 October 2026 the CBN weighted-average NFEM rate was ₦1,346.91/$ (buy ₦1,345.91 / sell ₦1,346.91); parallel-market quotes on 29–31 October were ≈₦1,373–1,390, a 2–3% gap [S29]. Domiciliary accounts: since the CBN's 18 June 2023 guidance, cash deposits are unrestricted subject to KYC, and holders may utilise cash deposits up to $10,000 per day via telegraphic transfer [S30]. **Grade E2 for the regime, E3 for the daily figures (press quoting CBN; CBN page not fetchable).**

**F8. The UAE's Open Finance framework is real, licensed and partially live.** CBUAE Circular 7/2023 (issued 31 Dec 2023, effective 15 Apr 2024) was replaced by Circular 3/2025 of 10 July 2025. Nebras Open Finance (an Al Etihad Payments entity) operates the AlTareq API hub and trust framework; third parties need a CBUAE Open Finance licence covering Data Sharing and/or Service Initiation; banks and other licensed persons are "deemed licensed" but must notify and obtain approval; Pay10 was the first licensed TPP (April 2025); Spare and Fintech Galaxy received in-principle approvals [S31, S34]. A tracker reviewed on 2 July 2026 listed CBD (live 2025 with Pay10 and Lean), ADIB (January 2026), FAB, DIB and Mashreq as live; Wio unconfirmed; Emirates NBD, ADCB, Emirates Islamic and RAKBANK onboarding; five banks pending; consumer data sharing confirmed at CBD and Mashreq [S32]. An October 2026 article reports a mid-September 2026 compliance deadline [S33]. **Implication:** a single-user system cannot be a TPP; UAE account data must come from statements or from a licensed aggregator's consumer product. **Grade E2 for the regulation (via law-firm summaries; rulebook page blocked), E3 for live status.**

**F9. UAE payments context.** UAEFTS is the CBUAE-owned real-time gross settlement system, operational since 2001; IBAN is mandatory for domestic and international electronic payments [S35]. Aani (Al Etihad Payments, launched October 2023) offers 24/7 instant transfers by mobile-number proxy and QR, request-to-pay and split payments; AEP's site cites a limit of AED 50,000 while a 2025 press report cites AED 5,000 per proxy transaction — the two must be reconciled [S36]. The dirham has been fixed at AED 3.6725 per US dollar since November 1997 [S37]. Private-sector salaries must be paid through the Wage Protection System (WPS): Ministerial Resolution 340 of 2026 (12 May 2026, effective 1 June 2026) requires payment by the first day of the following month, with escalating sanctions from day 2 [S38]. VAT at 5% applies to explicit bank fees and commissions; margin- or interest-based services are exempt [S39]. **Grade E2/E3.**

**F10. Plaid's Personal Finance Categories are the right public yardstick.** Version 1 had 16 primary and 104 detailed categories; version 2 (December 2025) has 18 primary and 127 detailed, adding `LOAN_DISBURSEMENTS` and `OTHER`, richer `INCOME` (`SALARY, CONTRACTOR, GIG_ECONOMY, RENTAL, DIVIDENDS, INTEREST_EARNED, …`) and transfer subtypes (`ACCOUNT_TRANSFER, INVESTMENT_AND_RETIREMENT_FUNDS, SAVINGS, WIRE, CRYPTO, WITHDRAWAL, TRANSFER_IN_FROM_APPS, …`). Plaid exposes a `confidence_level` enumeration `VERY_HIGH (>98%) / HIGH (>90%) / MEDIUM / LOW / UNKNOWN` and typed counterparties (`merchant, financial_institution, payment_app, marketplace, payment_terminal, income_source`) [S51]. Plaid's recurring-stream detection groups by description, amount and cadence, treats a stream as mature after three occurrences and reports weekly/biweekly/semi-monthly/monthly frequencies [S52]. **Grade E3 (vendor documentation; widely used de-facto standard).**

**F11. Mature open-source ledgers converge on the same primitives.** Beancount: every transaction must balance (posting weights sum to zero); `@`/`@@` price annotations participate in balancing; `{}` records cost basis; `balance` assertions are evaluated at the start of their date and check one currency; `pad` books the difference to an equity account; `price` directives drive valuation [S55]. hledger: `=` asserts one commodity, `==` asserts it is the only commodity, `=*` includes sub-accounts; costs are ignored for assertions; valuation can be "then", "end" or "now" from `P` price records [S56]. Firefly III: a transaction *group* holds one or more *journals*, each with exactly two legs (source and destination); withdrawals go asset → expense, deposits revenue → asset, transfers asset → asset; a journal may carry a foreign currency and foreign amount; splits are journals within a group [S53]. Actual Budget: a transfer is a linked pair whose payee is the other account, with category "Transfer" and no budget effect; import de-duplication uses the file's transaction ID first, then "around the same date, same amount, similar payee"; it recommends importing one side and letting the other reconcile to avoid duplicate transfers [S54]. **Grade E3.**

**F12. Record linkage has a formal basis.** Fellegi and Sunter (1969) give the probabilistic framework for deciding match / possible match / non-match from field agreement weights with explicit error bounds — the correct foundation for fuzzy duplicate and transfer matching rather than ad-hoc thresholds [S79, verified]. **Grade E1 (classic, replicated).**

**F13. Budgeting method evidence is weaker than practice suggests.** Mental budgeting is real and measurable: consumers set category budgets and then under- or over-consume relative to them (Heath & Soll 1996 [S62]; Thaler 1999 [S63]; review in Zhang & Sussman 2018 [S64]). Partitioning and earmarking money increased saving among low-income Indian households in a field experiment (Soman & Cheema 2011 [S65]); cash and immediate payment forms reduce spending relative to cards (Soman 2001 [S67]; Prelec & Loewenstein 1998 [S66]). This supports *envelope-style* allocation as a plausible intervention (E2, single or few studies). We found **no** peer-reviewed causal evidence for zero-based budgeting in households, and the 50/30/20 rule traces to a practitioner book [S93] (E4). Financial-education meta-analyses disagree on effect size: Fernandes et al. (2014) find small, decaying effects [S68]; Kaiser et al. (2022), pooling 76 randomised experiments, find positive effects on knowledge and behaviours [S69] (E1, conflicting). **Implication:** present budgets as tools with measured outcomes, not as doctrine.

**F14. Personal-finance software data has been used to show how people actually behave.** Olafsson & Pagel (2018), using an Icelandic aggregation app, document "liquid hand-to-mouth" behaviour — spending responds to paycheque arrival even among people with liquidity [S70]; Carlin, Olafsson & Pagel (2023) find that mobile-app access is associated with lower bank fees and less high-interest debt [S71]; Gelman et al. (2014), Ganong & Noel (2019) and Baugh et al. (2021) show spending tracks income timing and falls sharply when income stops [S75–S77] (E2 each; E1 as a body of evidence on income-timing sensitivity). **Implication:** cash-flow forecasting should be paycheque-anchored, not monthly-average.

**F15. Emergency-fund evidence favours measurable buffers over fixed multiples.** Lusardi, Schneider & Tufano (2011) found roughly half of US adults could not raise $2,000 in 30 days [S72]; the Federal Reserve's 2026 report (survey October 2025) reports 63% would cover a $400 expense with cash or equivalent [S74]; Despard et al. (2020) link emergency savings to financial capability rather than income alone [S73] (E2). The "three to six months of expenses" rule is a professional convention (E4); a working-paper threshold estimate (Sabat & Gallagher 2019) could not be verified [S84, unverified]. **Implication:** express the buffer as *months of essential expenses covered by liquid assets*, show the number, and let the user set the target.

**F16. Risk should be modelled as three separate quantities.** Practice literature distinguishes *risk need* (risk required to meet a goal), *risk capacity* (ability to absorb loss, objective: net worth, income, horizon) and *risk tolerance* (willingness, subjective, measured by validated questionnaire) and warns that plans fail when portfolios exceed tolerance (Ryack, Kraten & Sheikh 2016 [S59], E3). The Grable–Lytton 13-item scale (1999) is the most used instrument [S60, verified; E2]; a 15-year retrospective judged it acceptable but imperfect [S61, unverified]. CFP Board's Practice Standards (effective 1 October 2019) list risk tolerance among the *qualitative* inputs of step 1 [S57]. **Grade E2/E3.**

**F17. The financial-planning process is standardised and software-adaptable.** CFP Board's seven steps: (1) understanding the client's personal and financial circumstances (qualitative: health, family, values, risk tolerance, goals; quantitative: age, dependants, income, expenses, savings, assets, liabilities, insurance, estate); (2) identifying and selecting goals; (3) analysing the current course of action and alternatives; (4) developing recommendations; (5) presenting; (6) implementing; (7) monitoring and updating [S57]. FPSB's 2021 Practice Standards (as adopted by affiliates such as FPAM, revision 17 May 2021) use a six-step relationship model that starts with establishing the engagement and collecting information and documents [S58]. **Grade E3.**

**F18. Credit information is accessible but not central to the personal MVP.** Nigeria has three CBN-licensed bureaus (CRC, CreditRegistry, FirstCentral) under the Credit Reporting Act 2017; CRC reports contain identity, address and employment history, enquiries, facility history, security, dishonoured cheques and suits, with disputes by email/phone; secondary sources report one free report per year and a USSD channel (`*565*8#`) [S81] (E3). The UAE's Etihad Credit Bureau sells a credit score for AED 10.50 and a credit report quoted at AED 157.50 on its FAQ, while 2026 secondary sources quote AED 84 for individuals — to be verified at purchase [S82] (E3, conflicting). Debt-repayment behaviour deviates from optimal: Gathergood et al. (2019) show "balance matching" across cards instead of paying the highest rate first [S78] (E2) — relevant once liabilities exist in the ledger.

**F19. Household saving-rate and liquidity ratios have standard definitions.** National-accounts practice defines the household saving rate as saving divided by disposable income (OECD indicator; page not fetchable, E3 unverified) [S88]; personal-finance textbooks define the liquidity (basic) ratio as liquid assets divided by monthly essential expenses (E3). The system should compute both from the ledger with their definitions printed beside them.

**F20. Multi-currency accounting has an accepted reference.** IAS 21 distinguishes functional from presentation currency; transactions are initially recorded at the spot rate of the transaction date, monetary items are retranslated at the closing rate, and exchange differences are recognised in profit or loss (IFRS Foundation overview fetched; paragraph-level rules cited from the standard, E3) [S80]. For an individual, this translates to: record each posting in its native currency, store the reference rate at transaction date, revalue monetary balances at period end, and show translation effects separately from real flows.

**F21. Nigerian tax residency now matters for the ledger's income tagging.** The Nigeria Tax Act 2025 taxes residents' income "regardless of whether the income is received in Nigeria or abroad" and removes the former unilateral foreign-tax-credit mechanism in favour of treaty/section-45 relief (law-firm analysis) [S23] (E3). The ledger must therefore tag every income posting with source country, currency and payer, and record the user's residency status as a confirmed input — the Tax department owns the rule, we own the data.

**F22. Investment platforms rarely offer machine-readable exports; brokers do.** Interactive Brokers' Flex Queries are the only fully programmatic source among the accounts reviewed [S44]; Bamboo, Sarwa, Risevest and PFAs deliver PDFs (monthly or quarterly) [S45–S47, S50]; CSCS statements are per-CHN and historically required paid portal registration [S49]; PiggyVest, Cowrywise, Trove and Chaka export formats were not found. **Grade E3/E5.** Implication: investment ledgers will be reconstructed from PDF statements plus manual confirmation for the foreseeable future, and position valuation must come from the Investment Research data layer, not from the statements.

## 4. Proposed framework / specification for Portfolio OS

### 4.1 Data acquisition: what the personal MVP can rely on

| Tier | Source type | Accounts (examples) | Machine-readable? | MVP decision |
|---|---|---|---|---|
| 1 | Structured exports (CSV/XLSX/XML) | Wise (CSV/XLSX/CAMT.053/MT940), Revolut (CSV), IBKR (Flex XML/CSV), Kuda, Moniepoint, OPay (XLSX) | Yes | **Must-have**: one adapter per format, column maps versioned |
| 2 | Text PDF statements | GTBank, Zenith, First Bank, UBA, Access, Stanbic IBTC, PalmPay, Emirates NBD, FAB, ADCB, Mashreq, Wio, Liv, RAKBANK, Bamboo, Sarwa, Risevest, PFA RSA statements, CSCS | Yes, with layout-specific parsing and mandatory reconciliation | **Must-have**: PDF text extraction with per-institution templates; reject files that fail balance checks |
| 3 | Image/scanned PDFs, screenshots | Older statements, some fintech receipts | Only via OCR; error-prone | **Later**: OCR behind a human-review queue |
| 4 | Aggregator APIs | Mono Connect (Nigeria); licensed UAE TPPs (e.g., Lean) | Yes, but consent model proprietary, pricing quote-based, coverage per bank unverified | **Later**: second adapter once reliability is measured on the founder's own banks |
| 5 | Regulated open banking | CBN open banking (not live, F1); CBUAE AlTareq (licence required, F8) | Not available to an individual | **Do-not-build (yet)**; design interfaces so it slots in |
| 6 | Manual entry | Cash, informal loans, physical assets, opening balances | n/a | **Must-have**, with evidence attachment and "manual" provenance flag |

Provenance rule (brief §5.1): every imported row stores `source_file_id, source_row_no, source_hash, parser_version, imported_at`; every displayed amount can be traced back to a row or to a manual entry with a reason.

Consent and security posture for Tier 4 (specialist judgment, E4): the user, not the system, initiates any aggregator link; credentials never enter Portfolio OS; tokens are stored server-side encrypted, never in browser storage (the repository's localStorage anti-pattern, brief §1.5).

### 4.2 Ledger design

**Single-entry versus double-entry.** A single-entry transaction list is what every bank export is, and it is sufficient for *one* account. It fails the moment money moves between the user's own accounts (counted twice as spending and income), crosses currencies (the "loss" between ₦1,000,000 sent and $715 received is invisible or mis-booked), is reversed (a double POS swipe and its reversal inflate both spending and income), or buys a security (cash falls, but wealth does not). Double entry forces each movement to name where value came from and where it went, which is exactly the question the founder's requirements ask (transfers, contributions, FX, duplicates). Beancount, hledger and Firefly III all prove that this is tractable for an individual [F11]. Actual Budget shows the cost of the alternative: it bolts transfer-pairing and de-duplication onto a single-entry model and must document import order to avoid duplicates [S54].

**Recommendation:** double-entry postings, with a *presentation layer* that still looks like a transaction list (one row per bank line, expandable into its postings). Users never type debits and credits; the import pipeline and rules engine generate postings, and the user confirms.

**Chart of accounts for an individual (NGN/AED/USD).** Account identifiers are hierarchical, each leaf has exactly one currency (securities use the security code as commodity, as in Beancount).

| Top level | Examples | Notes |
|---|---|---|
| Assets:Cash | `Assets:Cash:NGN:Wallet`, `Assets:Cash:AED:Wallet` | Manual |
| Assets:Bank | `Assets:Bank:NG:GTB:Current:NGN`, `Assets:Bank:NG:GTB:Dom:USD`, `Assets:Bank:AE:ENBD:Current:AED`, `Assets:Bank:NG:Kuda:Spend:NGN` | Domiciliary accounts are separate leaves per currency |
| Assets:EMoney | `Assets:EMoney:Wise:USD`, `Assets:EMoney:Wise:AED`, `Assets:EMoney:OPay:NGN` | Wise jars/currency balances are separate leaves |
| Assets:Savings | `Assets:Savings:PiggyVest:Flex:NGN`, `Assets:Savings:Cowrywise:Plan1:NGN` | Contributions are transfers |
| Assets:Brokerage | `Assets:Brokerage:IBKR:Cash:USD`, `Assets:Brokerage:IBKR:Positions:<TICKER>`, `Assets:Brokerage:NGX:<Broker>:Positions:<TICKER>` | Positions carried at cost lots; market value from price table |
| Assets:Pension | `Assets:Pension:RSA:<PFA>:FundII` | Units × unit price from quarterly statement |
| Assets:Receivable | `Assets:Receivable:Loans:<Person>` | Informal lending |
| Liabilities | `Liabilities:Cards:<Bank>:AED`, `Liabilities:Loans:<Lender>:NGN`, `Liabilities:Payable:Rent` | Credit cards are liabilities, repayments are transfers |
| Equity | `Equity:OpeningBalances`, `Equity:Adjustments:Reconciliation` | Only the system writes here |
| Income | `Income:Salary:NG:<Employer>`, `Income:Salary:AE:<Employer>`, `Income:Business:<Client>`, `Income:Dividends:<Market>`, `Income:Interest`, `Income:Rental`, `Income:FXGain:Realised` | Tagged with source country and payer (F21) |
| Expenses | taxonomy in §4.3.5 plus `Expenses:BankCharges:{TransferFee, StampDuty, SMSAlert, CAMF, AccountFee, CardFee, VAT}`, `Expenses:FX:ConversionCost`, `Expenses:Investing:Commission`, `Expenses:Tax:Withholding` | Charges are split by regulatory type so they can be audited against the Guide to Charges |
| Suspense | `Suspense:PendingReversal`, `Suspense:Unmatched` | Must be empty at period close |

**Core entities.**

| Entity | Key fields | Rules |
|---|---|---|
| `account` | id, path, currency/commodity, institution, country, type (asset/liability/income/expense/equity/suspense), opened_on, closed_on, external_identifiers (masked IBAN/NUBAN), base_currency_override | One currency per leaf; multi-currency products are several leaves |
| `statement` | id, account_id, period_start, period_end, opening_balance, closing_balance, printed_total_in, printed_total_out, file_hash, parser_version, reconciliation_status | Immutable once reconciled; overlapping statements allowed, duplicates resolved at line level (§4.3.4) |
| `source_line` | id, statement_id, row_no, raw_date, value_date, raw_narration, debit, credit, running_balance, raw_reference, line_hash | Raw, never edited; `line_hash = sha256(account_id|date|amount|normalised_narration|reference|running_balance)` |
| `transaction` | id, date, value_date, description, counterparty_id, kind (spend/income/transfer/investment/fee/reversal/opening/revaluation), status (imported/auto_posted/needs_review/confirmed/disputed/void), confidence (0–1), rule_id, created_by (parser/rule/model/user), source_line_ids[] | A reversal links to the transaction it reverses; a transfer links its two sides |
| `posting` | id, transaction_id, account_id, amount, currency, ref_rate_to_base, ref_rate_source, ref_rate_asof, base_amount, cost_lot_id, evidence_id | Σ(base_amount) over a transaction = 0; FX cost is an explicit posting, never a plug |
| `counterparty` | id, canonical_name, aliases[], type (merchant/person/employer/institution/government/self), default_category, country | Self-counterparties are the user's own accounts (transfer detection) |
| `category` | id, path, plaid_pfc_detailed (mapping), is_essential (bool), is_transfer (bool), is_investment (bool) | Mapped to Plaid PFC v2 for comparability (F10) |
| `fx_rate` | currency_pair, date, rate, source (CBN/NFEM, FMDQ, CBUAE peg, parallel-market survey, provider-implied), as_of, retrieved_at | Several sources per day may coexist; display names the source |
| `price` | commodity, date, price, currency, source | From the Investment Research layer with validation status |
| `evidence` | id, type (statement, receipt, contract, screenshot, note), file_hash, uri, linked_entity | Attachments for any transaction or account |
| `rule` | id, pattern (narration regex / counterparty / amount band / account), action (category, counterparty, kind), precision_observed, created_by, active | Rules learn from confirmations; precision is measured, not assumed |
| `review_item` | id, entity, reason (low confidence, unmatched transfer, failed assertion, possible duplicate, gap), state (open/resolved), resolved_by | The human-in-the-loop queue |

**FX at transaction date and revaluation at period end.** Each posting stores the native amount and a reference rate to the user's base currency as of the transaction date (source named: NFEM/CBN for NGN, CBUAE peg 3.6725 for AED/USD). Where a transfer's *implied* rate differs from the reference rate, the difference is posted to `Expenses:FX:ConversionCost` (or `Income:FXGain:Realised` if favourable) so that spread is visible and auditable (F7, F20). At each period end the system writes a `revaluation` transaction per monetary account that restates its balance at the closing reference rate, posting the difference to `Income:FXGain:Unrealised` / `Expenses:FXLoss:Unrealised`; these entries are reversible and excluded from the cash-flow view. Users may also choose a *second* reference series (parallel market) for NGN; the display then shows both figures with their sources rather than a blended number.

**Confidence and review states.** `confidence` is a number in [0,1] attached to the *classification* (kind, category, counterparty, transfer match), never to the amount — amounts are facts from the statement. Surfaced as four bands mirroring Plaid's enumeration (≥0.98 very high, ≥0.90 high, ≥0.70 medium, else low) [F10]. Anything below 0.90 or produced by a model rather than a deterministic rule enters `needs_review`. A confirmed item records who confirmed it and when, and feeds rule precision statistics.

### 4.3 Transaction intelligence

#### 4.3.1 Income detection

Inputs: credits across all asset accounts, counterparty, narration, periodicity. Method (deterministic first, statistical second):

1. **Regular salary.** A credit stream qualifies when ≥3 occurrences (Plaid's maturity threshold, F10) fall within a tolerance of ±3 calendar days of a monthly anchor (or semi-monthly/biweekly), amounts within ±15% of the stream median, and the counterparty is not one of the user's own accounts. Nigeria-specific cues raise confidence: narration containing `SALARY`, `SAL`, `PAYROLL`, employer name; UAE cue: `WPS` in the narration (F9). Confidence: deterministic rule ≥0.95 when ≥3 matches and employer cue present; 0.80 when periodicity only.
2. **Irregular / business income.** Credits from non-self counterparties that do not match a stream are `Income:Business:<Client>` candidates only if the counterparty recurs (≥2 credits in 12 months) or the user has tagged the payer; otherwise they are `needs_review` with a default of `TRANSFER_IN:OTHER` — never auto-booked as income (behavioural and tax consequences). Dividend, interest and refund credits are detected by narration (`DIV`, `INT`, `REVERSAL`, `REFUND`) and broker statement sections.
3. **Outputs.** An `income_stream` object (payer, currency, frequency, median amount, last date, predicted next date, variance) feeds forecasting (§4.4.6) and the Tax department (source country, payer).
4. **Validation.** Precision/recall against the founder's own confirmed history; target ≥0.95 precision on salary before the stream is used in forecasts.

#### 4.3.2 Transfer matching between own accounts

Candidates: a debit D in account X and a credit C in account Y (both owned), where:

| Test | Same-currency rule | Cross-currency rule |
|---|---|---|
| Amount | |C| = |D| exactly, or |D| − |C| equals a known fee in X | |C| × ref_rate(date_D) within ±6% of |D| (covers observed 2–3.5% spreads plus fee, F7, §4.6); configurable |
| Date window | value_date(C) ∈ [date_D − 1, date_D + 3] business days (NIP is near-instant; IMTO 0–2 days) | [date_D − 1, date_D + 5] business days (FX settlement T+2 common) |
| Counterparty | narration of C contains the user's name, X's institution, or a shared reference; or Y is the destination named in D | same, plus provider identifiers (Wise/IMTO reference) |
| Uniqueness | one-to-one; if several candidates, prefer the smallest date distance, then shared reference | same |

Scoring follows Fellegi–Sunter: each test contributes an agreement weight; matches ≥ the upper threshold are auto-linked (`confidence` ≥0.95), between thresholds queued, below rejected [F12]. A matched pair becomes one `transfer` transaction with postings: X −D, Y +C, fees to `Expenses:BankCharges:*`, stamp duty/VAT to their own accounts, and the residual (|D| − fees − |C|×ref_rate) to `Expenses:FX:ConversionCost` with the reference rate's source and date stored. **Investment contributions** (bank → brokerage/savings platform) are transfers under this logic; the subsequent *purchase* inside the brokerage is a separate transaction (cash → position at cost). Neither appears in spending; both appear in a "contributions" view.

Edge cases (E5, to be tested): one debit split into several credits (Wise multi-currency), credits arriving before the debit's value date (fintech pre-funding), transfers to a third party with the user's own name in narration (false positives — require Y to be an owned account), and reversed transfers.

#### 4.3.3 Investment contributions are not spending

Rule: any posting whose destination account is under `Assets:Savings`, `Assets:Brokerage`, `Assets:Pension` or `Liabilities` (debt repayment) is excluded from spending and income aggregates and reported under *Saving & investing flows*. Only fees, commissions, withholding taxes and FX conversion costs attached to these flows count as expenses. This matches Plaid's `TRANSFER_OUT:INVESTMENT_AND_RETIREMENT_FUNDS` and `LOAN_PAYMENTS` separation [F10] and Actual Budget's off-budget treatment [S54].

#### 4.3.4 Duplicate detection

Three layers:

1. **Exact file-level**: identical `file_hash` → reject with message.
2. **Deterministic line hash** (`line_hash`, §4.2) → skip silently and record the overlap in the statement's provenance. Including `running_balance` in the hash distinguishes two genuine identical purchases (the running balance differs) from a re-uploaded line (identical) — this is the main weakness of hashing date+amount+narration alone (Firefly III's "classic" approach suffers from it; search summary only, page blocked).
3. **Fuzzy** (Fellegi–Sunter over date distance ≤2 days, amount equality, narration similarity ≥0.85 Jaro–Winkler, same account): flags *possible duplicates* for review, never auto-deletes. A **bank-side duplicate with later reversal** (double POS swipe) is *not* a duplicate: both debits and the reversal are real lines and must be kept so the statement reconciles; the second debit and its reversal are linked as a `reversal` pair and netted out of spending (§4.6).

Overlapping statements (e.g., a Jan–Mar PDF then a Mar–Jun PDF) are expected; the system reconciles each statement independently and then checks that the earlier statement's closing balance equals the running balance at the overlap boundary.

#### 4.3.5 Categorisation taxonomy

Proposed first level (12 groups) with Plaid PFC v2 mapping, so that figures remain comparable with external benchmarks and any later aggregator feed [F10]:

| Portfolio OS group | Plaid PFC v2 primary | Nigeria/UAE-specific detail leaves |
|---|---|---|
| Housing & utilities | RENT_AND_UTILITIES | rent (annual/quarterly instalments flagged), service charge, DEWA/EKEDC/IKEDC, generator fuel/diesel, estate levy |
| Food & groceries | FOOD_AND_DRINK | supermarket, market/cash, dining, delivery |
| Transport | TRANSPORTATION | fuel, ride-hailing, Salik/tolls, flights (domestic) |
| Health | MEDICAL | HMO premium, pharmacy, hospital |
| Family & giving | GOVERNMENT_AND_NON_PROFIT / GENERAL_SERVICES | remittances to family (not own transfers), religious giving, school fees (education leaf) |
| Telecoms & subscriptions | GENERAL_SERVICES / ENTERTAINMENT | airtime, data, streaming |
| Shopping & personal | GENERAL_MERCHANDISE / PERSONAL_CARE | |
| Travel | TRAVEL | |
| Government & taxes | GOVERNMENT_AND_NON_PROFIT | PAYE visible on payslip (manual), withholding tax, visa/Emirates ID fees |
| Bank charges & levies | BANK_FEES | NIP fee, stamp duty, SMS alert, CAMF, card fee, VAT on fees, FX conversion cost |
| Debt service | LOAN_PAYMENTS | interest (expense) vs principal (transfer to liability) split |
| Transfers & investing (excluded from spending) | TRANSFER_IN/OUT, LOAN_DISBURSEMENTS | own-account transfers, savings/brokerage contributions, pension, dividends reinvested |

Each leaf carries `is_essential` (for liquidity ratios) and a Plaid detailed code. Categories are user-editable; edits create aliases, not deletions, so history remains comparable.

#### 4.3.6 Rules engine with human confirmation

Order of precedence: (1) statement structure (broker sections, fee lines printed separately) → (2) deterministic narration rules per institution (versioned, with observed precision) → (3) counterparty memory (what the user confirmed for this counterparty before) → (4) statistical/LLM suggestion with a confidence score and the evidence it used, never allowed to change amounts or dates. Every automatic classification is reversible; the user confirms in a review queue sorted by financial materiality × uncertainty. Rules whose observed precision falls below 0.90 over the trailing 100 applications are demoted to suggestions automatically.

#### 4.3.7 Reconciliation controls

| Control | Formula / check | On failure |
|---|---|---|
| Statement balance | opening + Σcredits − Σdebits = closing (tolerance 0.00) | Statement rejected; parser diagnostic shows first row where the running balance breaks |
| Row chaining | running_balance(i) = running_balance(i−1) − debit(i) + credit(i) where the bank prints a running balance | Flags dropped or merged rows (bankstract's documented failure mode, F4) |
| Printed totals | Σdebits = "Total Money Out", Σcredits = "Total Money In" when printed | Statement rejected |
| Continuity | closing(statement n) = opening(statement n+1); gaps > 1 day between statements raise a `gap` review item | Period marked *incomplete*; aggregates for that period shown with an "incomplete data" badge |
| Ledger assertion | after posting, ledger balance at period_end = statement closing (Beancount-style balance assertion, F11) | `Equity:Adjustments:Reconciliation` entry only with user approval and a reason |
| Suspense | `Suspense:*` balances = 0 at period close | Close blocked |
| Cross-account | each `transfer` has exactly two owned-account legs; unmatched own-transfers older than 10 business days raise a review item | |
| Investment | units per position = Σ(trades) and match the broker's position section; cash = broker cash report | Differences itemised (corporate actions, fees) |

### 4.4 Cash-flow and planning intelligence

#### 4.4.1 Budgets
The system offers three budget *views* over the same ledger — category envelopes (allocation per category, with the carry-over behaviour the user chooses), zero-based (every unit of expected income assigned), and percentage guides (needs/wants/saving) — and measures the same outcomes for each: adherence (actual ÷ planned by category), spending volatility, and the savings rate. It states the evidence honestly (F13): envelope/partitioning has field-experiment support; zero-based has none we could find; percentage rules are heuristics. Whether a budget view improves outcomes for *this* user is an experiment the Behavioural department designs (eight-question test), not an assumption.

#### 4.4.2 Emergency fund and liquidity
Metrics (all from the ledger, definitions printed on screen): essential monthly spend (trailing 6-month median of `is_essential` categories, per currency and in base currency); liquid assets (cash, current/savings accounts, e-money, money-market balances; *not* pensions, *not* volatile securities); **months covered = liquid assets ÷ essential monthly spend**; and a stress variant using the parallel-market rate for NGN liquidity held against AED/USD obligations. The target is a user input with a suggested range (3–6 months) labelled as convention, plus two evidence anchors: "could you raise the equivalent of $2,000 within 30 days from liquid assets?" (Lusardi et al.) and "$400 unexpected expense" (Federal Reserve) [F15].

#### 4.4.3 Savings-rate measurement
Savings rate = (income − spending − fees − taxes paid from the accounts) ÷ income, computed on a *cash* basis per month and on a trailing-12-month basis, with transfers and investment contributions excluded from spending (§4.3.3) and shown separately as "of which invested". Gross versus net income is a stated choice (payslip data, where available, allows the gross basis). Report alongside the OECD-style definition so the number is comparable (F19).

#### 4.4.4 Risk capacity, tolerance and need
Captured separately (F16): **capacity** is computed (months covered, income stability from §4.3.1, horizon of each goal, share of net worth in volatile assets, liabilities); **tolerance** is measured with a validated questionnaire (Grable–Lytton 13-item, licensed/attributed) and re-measured annually; **need** is derived by the Goal Reality Engine (required return for each goal). The system shows the three side by side and flags conflicts (e.g., need > tolerance) as a decision for the user, never as a recommendation to take more risk.

#### 4.4.5 Credit and liabilities
Liabilities are ledger accounts with interest, fees and principal split per statement; the system computes debt-service ratio (debt service ÷ income) and total liabilities ÷ liquid assets. Credit-bureau reports (CRC/CreditRegistry/FirstCentral; Etihad Credit Bureau) are *user-uploaded documents* (F18) parsed for open facilities and enquiries, cross-checked against the liabilities ledger; the system never pulls bureau data itself. Repayment guidance, when liabilities exist, uses the evidence on balance-matching (F18) and presents the interest cost of alternatives as ranges.

#### 4.4.6 Cash-flow forecasting
Two methods, both reproducible from stored inputs: (a) **recurring-pattern projection** — income streams and recurring outflows (rent instalments, subscriptions, school fees, annual rent due dates) projected on their detected cadence with a ± band from historical variance, anchored on paycheque dates (F14); (b) **scenario overlays** — user-defined shocks (income stops for n months, NGN depreciates x%, rent increases y%) applied to (a). No stochastic forecasting of spending at MVP; the Forecasting department owns long-horizon models.

#### 4.4.7 Net-worth statement across currencies
Base-currency choice is an explicit setting, with the recommendation to show **two views by default**: USD (stable numeraire for a person with AED and USD assets; AED is pegged) and NGN (the currency of most spending). Each monetary account is translated at the closing reference rate of the period (IAS 21 logic, F20); securities at validated prices; pensions at the latest statement value with its as-of date. The period change is decomposed into *net saving*, *market gains/losses*, and *FX translation effect*, each labelled; a secondary line shows NGN assets valued at the parallel rate as a sensitivity, never as the headline (§4.5). Liabilities translate the same way.

#### 4.4.8 Planning workflow adapted to software (CFP Board / FPSB steps, F17)

| Step | Ask the user | Infer from records | Output |
|---|---|---|---|
| 1 Circumstances | residency (NG/AE/other) and days of presence, citizenship(s), employment type, dependants, health/insurance, values, risk-tolerance questionnaire | accounts, balances, income streams, spending structure, liabilities, FX exposure | Fact-find record with confirmation stamps |
| 2 Goals | goals, horizons, priorities, currency of each goal | historical saving capacity | Goal register (feeds Goal Reality Engine) |
| 3 Analysis | — | savings rate, months covered, debt ratios, FX mismatch between income and obligations, fee leakage, conversion costs | Diagnostic report with evidence grades |
| 4–5 Recommendations & presentation | choices among alternatives | ranges and trade-offs | Alternatives with assumptions, never promised returns |
| 6 Implementation | what was done | ledger shows contributions/changes | Action log |
| 7 Monitoring | changes in circumstances | monthly reconciliation and KPI drift | Alerts with thresholds the user set |

Ask-versus-infer principle: anything that is a legal status, a preference or a goal is asked and confirmed; anything observable in statements is inferred and shown with its evidence; inferred facts that carry tax or legal weight (residency, income source) are *never* treated as confirmed until the user says so.

### 4.5 Recording and displaying amounts across currencies without misleading the user

1. **Native first.** Every amount is stored and displayed in its native currency with its ISO code (₦/NGN, AED, USD); converted figures are secondary and always carry the rate, the rate source and the as-of date (e.g., "≈ $2,894 at NFEM ₦1,346.91/$ (CBN, 29 Oct 2026)").
2. **One reference series per currency pair, named.** NGN: CBN/NFEM weighted average as the default reference; parallel-market survey as an optional secondary series shown side by side for NGN-denominated liquidity and for what-if views; never blended. AED: fixed 3.6725 (state "pegged since 1997").
3. **Spread is an expense line, not a rounding error.** Implied rates on own transfers are computed and the difference from the reference rate is booked and displayed (§4.3.2).
4. **Translation effects are labelled.** Net-worth changes separate real flows from FX translation; a user whose NGN balance "grew" in NGN but shrank in USD must see both.
5. **Inflation is a distinct lens.** Real-terms views use the rebased NBS CPI (2024 = 100) and state the base; old-series comparisons are disallowed by the data layer (F6).
6. **No silent defaults.** If a rate for a date is missing, the amount is shown unconverted with a "rate missing" badge; aggregates that include unconverted items are marked incomplete.
7. **Rounding and precision.** Store amounts as integers in minor units (kobo/fils/cents) or decimals with four places for rates; display with the currency's conventional precision; totals are computed from stored precision, not from displayed values.

### 4.6 Worked example (synthetic data, October 2026)

All figures are synthetic and were produced by a small decimal-arithmetic script (`worked_example.py`, kept with the research notes) so that they can be re-run. Reference rates: AED 3.6725/USD (peg); NFEM ₦1,329.00/$ on 30 Sep (assumption), ₦1,350.00 on 18 Oct, ₦1,352.00 on 20 Oct (assumptions), ₦1,346.91 on 31 Oct (CBN weighted average published for 29 Oct 2026, used as month-end). Three accounts: **A1** NGN current account (opening ₦1,250,000.00), **A2** AED current account (opening AED 18,400.00), **A3** USD brokerage (opening cash $2,150.00; 12 units of an ETF at cost $240, price $250 on 30 Sep). No liabilities.

**A1 — NGN current account, as imported (running balance reproduced by the parser check)**

| Date | Narration (as printed) | Debit ₦ | Credit ₦ | Balance ₦ | System posting |
|---|---|---:|---:|---:|---|
| 03 Oct | POS/WEB PURCHASE TRANSACTION SHOPRITE LEKKI | 48,500.00 | | 1,201,500.00 | Expenses:Groceries |
| 05 Oct | NIP/ZEN/ADEBAYO LANDLORD/RENT OCT | 400,000.00 | | 801,500.00 | Expenses:Housing:Rent |
| 05 Oct | NIP TRANSFER FEE | 50.00 | | 801,450.00 | BankCharges:TransferFee |
| 05 Oct | VAT ON NIP FEE | 3.75 | | 801,446.25 | BankCharges:VAT |
| 05 Oct | STAMP DUTY (NTA 2025) | 50.00 | | 801,396.25 | BankCharges:StampDuty |
| 10 Oct | USSD AIRTIME TOPUP 0803XXXXXXX | 5,000.00 | | 796,396.25 | Expenses:Telecoms:Airtime |
| 12 Oct | POS PURCHASE TOTAL ENERGIES IKOYI 12/10 09:41 | 27,300.00 | | 769,096.25 | Expenses:Transport:Fuel |
| 12 Oct | POS PURCHASE TOTAL ENERGIES IKOYI 12/10 09:42 | 27,300.00 | | 741,796.25 | Suspense:PendingReversal (possible duplicate flagged) |
| 14 Oct | REVERSAL OF POS TXN 12/10 TOTAL ENERGIES | | 27,300.00 | 769,096.25 | Suspense:PendingReversal (pair closed) |
| 19 Oct | NIP/IMTO PARTNER/REMITTANCE REF AE7781 | | 1,780,000.00 | 2,549,096.25 | Transfer from A2 (match T1) |
| 20 Oct | FX PURCHASE USD 715.00 FOR BROKERAGE FUNDING | 1,000,000.00 | | 1,549,096.25 | Transfer to A3 (match T2) |
| 20 Oct | NIP TRANSFER FEE / VAT / STAMP DUTY | 50.00 + 3.75 + 50.00 | | 1,548,992.50 | BankCharges (three postings) |
| 26 Oct | SALARY OCT 2026 ACME NIGERIA LTD | | 2,350,000.00 | 3,898,992.50 | Income:Salary:NG:ACME |
| 31 Oct | SMS ALERT CHARGES 12 @ N4 + VAT | 48.00 + 3.60 | | 3,898,940.90 | BankCharges:SMSAlert, VAT |
| 31 Oct | ACCOUNT MAINTENANCE FEE (₦0.5/mille) + VAT | 740.40 + 55.53 | | 3,898,144.97 | BankCharges:CAMF, VAT |

Reconciliation A1: 1,250,000.00 + 4,157,300.00 − 1,509,155.03 = **3,898,144.97** = printed closing balance → statement accepted. Charge audit: CAMF base = customer-induced debits net of the reversed duplicate = ₦1,480,800 × 0.0005 = ₦740.40; VAT 7.5% = ₦55.53 — consistent with the 2026 cap (F5), so no "unexpected charge" alert. Stamp duty appears twice (two outward transfers ≥ ₦10,000, sender pays, 2026 rule); the salary credit carries none (exempt).

**A2 — AED current account**

| Date | Narration | Debit AED | Credit AED | Balance AED | Posting |
|---|---|---:|---:|---:|---|
| 01 Oct | WPS SALARY SEP 2026 GULF EMPLOYER LLC | | 22,000.00 | 40,400.00 | Income:Salary:AE (WPS cue) |
| 02 Oct | STANDING ORDER RENT INSTALMENT | 9,000.00 | | 31,400.00 | Expenses:Housing:Rent |
| 06 Oct | POS CARREFOUR MOE | 612.35 | | 30,787.65 | Expenses:Groceries |
| 09 Oct | DEWA BILL PAYMENT | 540.00 | | 30,247.65 | Expenses:Utilities |
| 12 Oct | AANI TRANSFER TO +9715XXXXXXX | 250.00 | | 29,997.65 | Expenses:Dining:SharedBills (not an own account) |
| 18 Oct | OUTWARD REMITTANCE NGN BENEF SELF REF AE7781 | 5,000.00 | | 24,997.65 | Transfer to A1 (match T1) |
| 18 Oct | REMITTANCE FEE + VAT 5% | 15.00 + 0.75 | | 24,981.90 | BankCharges:TransferFee, VAT |
| 25 Oct | ACCOUNT FEE + VAT 5% | 25.00 + 1.25 | | 24,955.65 | BankCharges:AccountFee, VAT |
| 28 Oct | POS RESTAURANT JBR | 180.00 | | 24,775.65 | Expenses:Dining |

Reconciliation A2: 18,400.00 + 22,000.00 − 15,624.35 = **24,775.65** → accepted.

**A3 — USD brokerage (cash section)**

| Date | Line | Debit $ | Credit $ | Cash $ | Posting |
|---|---|---:|---:|---:|---|
| 22 Oct | DEPOSIT (wire from FX provider) ref NG-5520 | | 715.00 | 2,865.00 | Transfer from A1 (match T2) |
| 23 Oct | BUY 2.8 ETF @ 250.00 | 700.00 | | 2,165.00 | Assets:Brokerage:Positions:ETF (cost lot) |
| 23 Oct | COMMISSION | 1.00 | | 2,164.00 | Expenses:Investing:Commission |
| 30 Oct | DIVIDEND ETF 12 × 0.80 (gross) | | 9.60 | 2,173.60 | Income:Dividends:US |
| 30 Oct | WITHHOLDING TAX 30% | 2.88 | | 2,170.72 | Expenses:Tax:Withholding:US |

Positions: 12 → 14.8 units; price $250.00 → $257.50; market value $3,000.00 → $3,811.00; unrealised gain in the month = 3,811.00 − 3,000.00 − 700.00 = **$111.00**. Position check: units from trades (12 + 2.8) = broker position section.

**Transfer matches**

| Match | Legs | Date gap | Implied rate | Reference rate (source) | Conversion cost booked | Score |
|---|---|---|---|---|---|---|
| T1 | A2 −AED 5,000.00 (18 Oct) → A1 +₦1,780,000.00 (19 Oct), shared ref AE7781 | 1 day | ₦356.00/AED | ₦367.60/AED (NFEM ₦1,350.00 ÷ 3.6725, 18 Oct) | ₦57,985.02 (3.15%) + explicit fee AED 15.75 | auto-link (amount within 6%, date in window, reference shared, both accounts owned) |
| T2 | A1 −₦1,000,000.00 (20 Oct) → A3 +$715.00 (22 Oct) | 2 days | ₦1,398.60/$ | ₦1,352.00/$ (NFEM, 20 Oct) | ₦33,320.00 (3.33%) + ₦103.75 fee/VAT/stamp | auto-link |

Postings generated for T2 (base currency USD, rate ₦1,352.00): A1 −₦1,000,000.00 (−$739.64); A3 +$715.00; Expenses:FX:ConversionCost +₦33,320.00 (+$24.64); the transaction's base amounts sum to zero. The same transfer in a single-entry list would have shown ₦1,000,000 of "spending" and $715 of "income".

**Duplicate and reversal handling.** The two 12 Oct fuel debits differ only by the printed time and running balance; the deterministic line hash (which includes the running balance) treats them as distinct lines, the fuzzy layer flags the second as a *possible duplicate*, and the 14 Oct reversal closes the pair: net fuel spend ₦27,300, statement still reconciles because all three lines are kept. When the founder later uploads an overlapping 1 Oct–15 Nov statement, every October line hashes identically and is skipped; the overlap is recorded on the new statement's provenance and the boundary balance (₦3,898,144.97 at 31 Oct) is re-asserted.

**October cash-flow (USD view at month-end NFEM ₦1,346.91; AED at 3.6725)**

| Item | NGN | AED | USD | Total USD |
|---|---:|---:|---:|---:|
| Income (salaries, gross dividend) | 2,350,000.00 | 22,000.00 | 9.60 | 7,744.80 |
| Spending (excl. charges; fuel counted once) | 480,800.00 | 10,582.35 | — | 3,238.48 |
| Bank charges, levies, withholding tax | 1,055.03 | 42.00 | 3.88 | 16.10 |
| Implicit FX conversion cost on own transfers | 91,305.02 | — | — | 67.79 |
| **Net saving** | | | | **4,422.44** (57.1% of gross income) |
| of which invested (ETF purchase) | | | 700.00 | 700.00 |

Note how the two "costs of moving money" (₦91,305 implicit, ₦1,055 + AED 42 explicit) are four times the visible bank charges — exactly the figure a single-entry list hides.

**Net worth**

| As of | A1 NGN | A2 AED | A3 cash $ | ETF $ | Net worth USD | Net worth NGN | Rate used |
|---|---:|---:|---:|---:|---:|---:|---|
| 30 Sep 2026 | 1,250,000.00 | 18,400.00 | 2,150.00 | 3,000.00 | 11,100.77 | 14,752,920.46 | ₦1,329.00/$ |
| 31 Oct 2026 | 3,898,144.97 | 24,775.65 | 2,170.72 | 3,811.00 | 15,622.12 | 21,041,592.23 | ₦1,346.91/$ |
| Change | | | | | +4,521.35 | +6,288,671.78 | |

Decomposition (USD view): net saving +4,422.44, market gain +111.00, FX translation on the opening NGN balance −12.51 (naira weakened from 1,329.00 to 1,346.91), residual +0.42 from converting all October flows at the month-end rate rather than transaction-date rates (the production system uses transaction-date rates, so the residual is zero). In the NGN view the same month shows an FX translation *gain* of ₦181,969.38 on the opening AED and USD holdings — the display rule in §4.5(4) requires both to be shown with labels, because the user's "wealth grew" is true in one numeraire and partly an FX artefact in the other.

## 5. Alternatives considered and rejected

| Alternative | Why rejected (for now) |
|---|---|
| **API-first ingestion via Mono (Nigeria) and a licensed UAE TPP** | Coverage per bank unverified, pricing quote-based, consent model proprietary, a single-user project cannot hold a CBUAE licence, and CBN open banking is not live (F1, F2, F8). Kept as a second adapter behind the same `source_line` contract. |
| **Single-entry transaction list with "transfer" and "exclude" flags** (Actual-Budget-style) | Cannot represent cross-currency spread, reversals or security purchases without plugs; de-duplication and transfer pairing become import-order dependent (F11). |
| **Adopting Beancount/hledger text files as the system of record** | Excellent semantics, but plain text has no row-level provenance, confidence, review states or evidence links, and is hostile to a non-technical interface. We adopt their *semantics* (postings, balance assertions, pad, prices) in a database schema. |
| **A single blended NGN/USD rate (e.g., average of official and parallel)** | Fabricates a number nobody can transact at; violates the provenance rule. Two named series shown side by side instead (§4.5). |
| **LLM-first categorisation and transfer detection** | Deterministic rules and record-linkage scoring are auditable and measurable; models are allowed only as ranked suggestions with confidence and evidence, and never touch amounts (§4.3.6; brief §1.4). |
| **OCR of scanned statements in the MVP** | Error rates undermine the reconciliation guarantee; deferred behind a human-review queue. |
| **Pulling credit-bureau data programmatically** | No consumer API with a lawful purpose for a self-use app; reports are user-uploaded documents (F18). |
| **Fixed "6 months of expenses" emergency-fund target** | Convention, not evidence; the metric is shown and the target is the user's (F15). |

## 6. Cross-department dependencies

**We need from others:** Data Architecture & Engineering — storage schema review, integer minor-unit amounts, encryption-at-rest for statements, parser test harness; Tax Intelligence — the authoritative rule set for stamp duty, VAT on fees, withholding on foreign dividends, residency tests under the Nigeria Tax Act 2025 and UAE rules (F5, F21), and the list of income tags they need; Investment Research — validated price and FX series with provenance (NFEM/CBN, FMDQ, CBUAE, parallel-market survey methodology), corporate-action feeds for position reconciliation (F22); Behavioural Finance — the experiment design for budget views and the risk-tolerance instrument licensing (F13, F16); Forecasting & Wealth Planning — consumption of income streams and recurring-outflow objects; Goal Reality Engine — definition of "risk need" per goal; AI Research & Explanation — the contract that any narrative cites ledger IDs and never restates numbers it did not compute; Legal/Compliance & Privacy — data-retention, NDPA/PDPL obligations for storing statements, and the consent text for any aggregator link; Commercialisation — whether multi-user tenancy changes the ledger (it should not change the schema).

**Others need from us:** the ledger schema and category taxonomy (this document, §4.2–4.3); the reconciliation status per period (every downstream figure must inherit the "incomplete" badge); income-stream and recurring-outflow objects; the FX-cost and fee-leakage series (behavioural and planning use); the net-worth decomposition (forecasting baseline); the fact-find record with confirmation stamps (tax and planning).

## 7. Risks, open uncertainties and disagreements

**Uncertainties (ranked):**
1. CBN open-banking go-live date and whether individuals or small developers will be able to register as API consumers — unknown; no CBN primary notice found [checked 2026-11-04].
2. Exact text and section of the Nigeria Tax Act 2025 stamp-duty provision, and whether the ₦10,000 threshold applies per transfer in foreign currency equivalents on domiciliary accounts — press-level only.
3. The revised CBN Guide to Charges (effective 1 May 2026): figures come from two press reports; the CBN PDF was not retrieved.
4. Statement export formats for GTBank, Zenith, Access, UBA, First Bank, Stanbic IBTC (official), OPay and PalmPay (official), Mashreq, Wio, Liv, RAKBANK, Emirates NBD personal, PiggyVest, Cowrywise, Trove, Chaka — unverified; the parser plan depends on real samples.
5. Aani transaction limit (AED 50,000 on AEP's site vs AED 5,000 per proxy transaction in 2025 press) and Etihad Credit Bureau report price (AED 157.50 vs AED 84) — conflicting sources.
6. Whether Mono's coverage of the founder's specific banks is reliable enough to justify its cost — untested.
7. Parallel-market rate sourcing: there is no official series; any secondary series must document its survey method or be labelled indicative.

**Disagreements preserved:**
- *Commercial/retail banker vs financial planner — what comes first.* The banker position: nothing is trustworthy until statements reconcile and charges are audited, so the first three months should build only ingestion, reconciliation and the charge audit. The planner position: the founder's decisions depend on goals, savings rate and liquidity, which can be estimated from imperfect data, and a system that shows nothing for three months loses the user. Proposed resolution: ship reconciliation-gated aggregates — every KPI is visible from week one but carries the reconciliation badge and confidence band; no forecast or recommendation consumes an "incomplete" period.
- *Infrastructure specialist vs product ambition — APIs.* The specialist regards aggregator integration as premature and a privacy liability; the product view regards manual upload as friction that limits adoption later. Resolution: build the adapter boundary now, integrate Mono only after a 60-day shadow test on the founder's own accounts measuring completeness against statements.
- *Private banker vs behavioural researcher — risk tolerance.* The private banker is content with a suitability questionnaire; the behavioural researcher regards single questionnaires as noisy and wants repeated measurement and observed behaviour. Resolution: measure with the Grable–Lytton scale annually *and* record observed behaviour (sales after drawdowns) as a separate, labelled signal; never merge the two into one score.
- *Credit specialist vs planner — credit reports.* The credit specialist wants bureau reports in the MVP; the planner notes the founder's decisions rarely hinge on a bureau score. Resolution: document upload only; no automation.
- *Base currency.* Wealth-management view: USD numeraire; retail view: NGN because spending is in naira. Resolution: dual view by default, user chooses the headline (§4.4.7).

**Risks:** silent parser errors (mitigated by mandatory reconciliation); stale fee and rate constants (mitigated by sourced, dated constants and a review calendar — the repository's hard-coded policy-rate anti-pattern must not recur); privacy exposure from storing statements (encryption, retention policy, no third-party model calls with raw statements); over-interpretation of behaviour from one person's data (Behavioural department's eight-question test applies); regulatory change in both jurisdictions (every rule carries an effective date and a "checked on" date).

## 8. Recommendations, ranked

| # | Recommendation | Class |
|---|---|---|
| R1 | Statement-import pipeline for Tier 1–2 sources with mandatory reconciliation and provenance | Personal-MVP must-have |
| R2 | Double-entry ledger with postings, reference FX rates at transaction date, explicit FX-cost and charge accounts, confidence and review states | Personal-MVP must-have |
| R3 | Transfer matching (same- and cross-currency) and investment-contribution exclusion | Personal-MVP must-have |
| R4 | Deterministic de-duplication plus fuzzy flagging; reversal pairing | Personal-MVP must-have |
| R5 | Rules engine with review queue; taxonomy mapped to Plaid PFC v2; charge audit against the Guide to Charges and stamp-duty rules | Personal-MVP must-have |
| R6 | Cash-flow, savings-rate, liquidity and dual-currency net-worth views with decomposition and reconciliation badges | Personal-MVP must-have |
| R7 | Income-stream detection and paycheque-anchored recurring forecast with scenario overlays | Personal-MVP must-have (forecast banded, not point) |
| R8 | Fact-find record (residency, employment type, goals) with confirmation stamps; risk capacity/tolerance/need shown separately | Personal-MVP must-have (questionnaire licensing: Later) |
| R9 | Budget views with measured adherence, framed as an experiment | Later |
| R10 | Aggregator adapter (Mono; UAE licensed TPP) after shadow test | Later |
| R11 | OCR for scanned statements; credit-report parsing | Later |
| R12 | CBN open-banking / CBUAE AlTareq direct participation | Do-not-build (yet) |
| R13 | Real-time balance sync, automated payments or transfers from Portfolio OS | Do-not-build (yet) — moves the product into regulated payment activity |

**Five-question test on the top items.**

*R1–R2 (import + ledger).* (1) Problem: the founder cannot see one truthful picture across NGN/AED/USD accounts, and prior tools produced inaccurate figures. (2) Who: the founder now; any multi-banked Nigerian/UAE user later. (3) Evidence: open-source ledgers converge on these primitives (F11); reconciliation failures in PDF parsing are documented (F4); IAS 21 provides the multi-currency logic (F20). (4) Build/validate: per-institution parsers with redacted fixtures; every statement must pass four reconciliation checks; property tests that Σ base amounts = 0. (5) Measurable improvement: share of statements auto-reconciled (target ≥95%), zero unexplained balance differences, time from upload to confirmed ledger (< 10 minutes per statement).

*R3–R4 (transfers, duplicates).* (1) Problem: own transfers and reversals inflate income and spending and hide FX spread. (2) Who: anyone moving money across accounts or currencies — the founder does so monthly. (3) Evidence: Fellegi–Sunter record linkage (F12); Actual Budget's documented duplicate-transfer problem (F11); observed 2–3% spreads (F7). (4) Build/validate: labelled set of the founder's confirmed transfers; precision ≥0.98, recall ≥0.95 before auto-linking; replay tests with overlapping statements. (5) Improvement: spending and income error versus manual ground truth < 1%; FX cost series produced monthly.

*R5 (rules + charge audit).* (1) Problem: unexplained bank charges and miscategorised spending. (2) Who: the founder; later retail users who routinely question charges. (3) Evidence: published charge schedules (F5) make an audit deterministic; Plaid's confidence enumeration is an accepted interface (F10). (4) Build/validate: rule precision tracked per rule; charge audit tested on synthetic statements with every charge type. (5) Improvement: ≥90% of lines auto-classified at ≥0.90 confidence after three months; every charge line either matched to a tariff rule or flagged.

*R6–R7 (views + forecast).* (1) Problem: decisions need savings rate, liquidity and a credible near-term cash position in the right currency. (2) Who: the founder; the Planning and Goal engines downstream. (3) Evidence: income-timing sensitivity (F14), emergency-fund evidence (F15), national-accounts definitions (F19). (4) Build/validate: back-test the recurring forecast on the founder's own history (mean absolute percentage error by horizon); all metrics print their definitions. (5) Improvement: 30-day cash forecast error < 10% of monthly spend after six months of data; months-covered metric stable within ±0.2 between consecutive reconciled months.

*R8 (fact-find and risk).* (1) Problem: tax and suitability outcomes depend on facts no statement contains. (2) Who: the founder, Tax and Planning departments. (3) Evidence: CFP Board/FPSB practice standards (F17); three-dimensional risk framework (F16); Tax Act residency rule (F21). (4) Build/validate: structured form with confirmation stamps; questionnaire psychometrics from the literature. (5) Improvement: zero downstream computations running on unconfirmed residency or employment status.

## 9. Required validation before implementation

1. Obtain redacted real statements (founder's own, after privacy controls are approved) for each institution in Tier 1–2 and record: file type, columns, narration patterns, running-balance presence, printed totals, password behaviour. Build fixtures only from redacted copies.
2. Retrieve and file the primary texts with dates: CBN Guide to Charges 2026 (PDF), Nigeria Tax Act 2025 stamp-duty provisions (section numbers), CBUAE Open Finance Regulation (Circular 3/2025) from the rulebook, CBN circular of 18 June 2023 on domiciliary accounts, MOHRE Resolution 340/2026.
3. Confirm with each institution (support ticket or in-app test) the export formats not verified here (§7 item 4) and whether GTBank's Excel export exists.
4. Run a 60-day shadow comparison of Mono Connect against statements for the founder's Nigerian accounts before any API dependency; record completeness, latency, re-authentication frequency and cost per account.
5. Establish the FX reference feed (CBN/NFEM daily) and a documented parallel-market series; test the §4.5 display rules with users for misreading risk.
6. Validate transfer matching and duplicate detection on a labelled set of at least 200 own transfers and 50 reversals; tune Fellegi–Sunter thresholds; measure precision/recall.
7. Back-test the recurring-pattern forecast on 12 months of reconciled history.
8. Have a licensed Nigerian tax practitioner and a UAE adviser review the charge, levy, VAT and residency assumptions (F5, F9, F21) before any figure reaches a user.
9. Privacy and security review of statement storage, encryption and retention (Legal/Compliance) before real data is loaded.
10. Behavioural department to specify the budget-view experiment and risk-tolerance instrument licensing before R8/R9 proceed.

## 10. Sources

Access dates are 2026-11-02 unless stated; "fetched" means the page or PDF was read directly; "search extract" means the official text was obtained through a search-engine extract because the page blocked automated fetching. Academic references were checked against OpenAlex by DOI on 2026-11-02 ([verified] = title, first author and year agree).

**Regulators, standards bodies and primary documents**
- S1. Udo Udoma & Belo-Osagie, *Open Banking in Nigeria: An Overview of the CBN Operational Guidelines for Open Banking in Nigeria 2023* (2023). https://uubo.org/wp-content/uploads/2023/10/OPEN-BANKING-IN-NIGERIA-AN-OVERVIEW-OF-THE-CBN-OPERATIONAL-GUIDELINES-FOR-OPEN-BANKING-IN-NIGERIA-2023.pdf — search extract.
- S2. Open Banking Nigeria, *Open banking in Nigeria* (page updated July 2026). https://openbanking.ng/open-banking-in-nigeria/ — fetched.
- S3. Goldsmiths LLP, *Nigerian Open Banking: The Legal Framework All Banks and FinTechs Need to Know* (2026). https://www.goldsmithsllp.com/nigerian-open-banking-the-legal-framework-all-banks-and-fintechs-need-to-know/ — fetched.
- S4. Y.-F. Elaigwu, "As Nigeria prepares for the open banking rollout", *BusinessDay*, 8 June 2026. https://businessday.ng/opinion/article/as-nigeria-prepares-for-the-open-banking-rollout/ — fetched.
- S5. *Vanguard*, "Nigeria's open banking will happen soon — CBN", October 2025. https://www.vanguardngr.com/2025/10/nigerias-open-banking-will-happen-soon-cbn/ — search extract.
- S6. TechCrier, "What is open banking, and is Nigeria ready for it?", October 2026. https://www.techcrier.com/2026/10/what-is-open-banking-and-is-nigeria.html — fetched.
- S7. *Nairametrics*, "Nigerian fintech Okra shuts down as co-founder Fara Ashiru moves to UK's Kernel", 3 July 2025. https://nairametrics.com/2025/07/03/nigerian-fintech-okra-shuts-down-as-co-founder-fara-ashiru-moves-to-uks-kernel/ — search extract.
- S8. Mono, *Pricing* (undated). https://mono.co/pricing — fetched.
- S9. Mono, *Coverage*. https://mono.co/coverage — fetched.
- S10. Mono, *Documentation overview*. https://docs.mono.co/docs — fetched.
- S11. Open Banking Tracker, *Mono (acquired by Flutterwave)* profile (2026). https://www.openbankingtracker.com/mono-co — search extract (fetch returned HTTP 429).
- S12. Open Banking Nigeria, *Are Mono and Stitch truly open banking?* https://openbanking.ng/are-mono-and-stitch-truly-open-banking/ — search extract.
- S13. Kuda Help Centre, *Get your account statement*. https://help.kuda.com/en/articles/8947801-get-your-account-statement — fetched.
- S14. Moniepoint Support, *How to generate account statement*. https://support.moniepoint.com/topics/how-to-generate-account-statement-202/how-to-generate-account-statement-206 — search extract (fetch 403).
- S15. J. Orazulike, *bankstract* v0.18.3 (MIT), PyPI, released 2 November 2026. https://pypi.org/project/bankstract/ — fetched.
- S16. GTBank, *Help Centre*. https://gtbank.com/help-centre — fetched (statement path only); TaxFetch, *GTBank Nigeria bank statement analyzer* (third-party). https://taxfetchindia.com/tools/bank-statement/gtbank-nigeria-bank-statement-analyzer — search extract.
- S17. Central Bank of Nigeria, *Guide to Charges by Banks, Other Financial and Non-Bank Financial Institutions*, effective 1 January 2020 (PDF). https://www.cbn.gov.ng/Out/2022/CCD/Guide%20to%20Charges%20by%20Banks%20Other%20Financial%20and%20Non-Financial%20Institutions%20eff%20Jan%201%202020.pdf — fetched; text extracted.
- S18. Legit.ng, "CBN scraps card maintenance fees, makes email alerts free as 4 new banking charges take effect" (May 2026). https://www.legit.ng/business-economy/economy/1708374-cbn-scraps-card-maintenance-fees-email-alerts-free-4-banking-charges-effect/ — fetched; *Leadership*, "CBN raises debit, credit card issuance fee to N1,500" (2026). https://leadership.ng/cbn-raises-debit-credit-card-issuance-fee-to-n1500/ — search extract; WithinNigeria, "CBN ATM card fee increase…", 25 April 2026. https://www.withinnigeria.com/2026/04/25/cbn-atm-card-fee-increase-new-charges-effective-date-and-what-every-nigerian-bank-customer-must-know/ — search extract.
- S19. TechCabal, "Here is why bank transfers in Nigeria will cost more from 2026", 22 December 2025. https://techcabal.com/2025/12/22/why-your-50000-transfer-will-cost-100-from-2026/ — search extract (fetch 403).
- S20. Kuda Help Centre, *An important update about stamp duty* (2025/26). https://help.kuda.com/en/articles/13285316-an-important-update-about-stamp-duty — fetched.
- S21. Paystack Support, *Stamp duty charge on NGN transfers* (2026). https://support.paystack.com/en/articles/7573314 — fetched.
- S22. TechEconomy, "Stamp duty replaces EMTL: sender to bear ₦50 charge on bank transfers", 1 January 2026. https://www.techeconomy.ng/stamp-duty-replaces-emtl-sender-to-bear-50-charge-on-bank-transfers — fetched.
- S23. Tope Adebayo LP, *Nigeria Tax Act, 2025: An Outlook of Income and Profit Taxation under the Present Regime* (2025, PDF). www.topeadebayolp.com — PDF read; exact URL not recorded.
- S24. *BusinessDay*, "5 other levies Nigerians pay for electronic transactions" (2024). https://businessday.ng/analysis/article/5-other-levies-nigerians-pay-for-electronic-transactions/ — search extract.
- S25. National Bureau of Statistics, *Highlights of Consumer Price Index (CPI) Rebasing*, February 2025 (PDF). https://microdata.nigerianstat.gov.ng/index.php/catalog/154/download/1156/Highlights%20of%20CPI%20Rebasing%20Result.pdf — fetched; text extracted.
- S26. *Nairametrics*, "Nigeria's inflation slows to 14.63% in September, fourth straight monthly decline in 2026", 15 October 2026. https://nairametrics.com/2026/10/15/nigerias-inflation-slows-to-14-63-in-september-fourth-straight-monthly-decline-in-2026/ — fetched; National Bureau of Statistics homepage CPI panel (2024 = 100). https://nigerianstat.gov.ng/ — fetched.
- S27. *A Review of Key CBN Foreign Exchange Policies in 2024* (Legal500/Mondaq, 2025). https://www.legal500.com/intelligence/nigeria/finance-and-banking/a-review-of-key-cbn-foreign-exchange-policies-in-2024 — fetched.
- S28. Mondaq, *Recent Reforms in the Nigeria Foreign Exchange Market and the Introduction of the Electronic Foreign Exchange Matching System* (2025). https://www.mondaq.com/nigeria/financial-services/1568396/ — search extract.
- S29. WithinNigeria, "Dollar to Naira today, October 31, 2026: NFEM rate ₦1,346.91, black market ₦1,385". https://www.withinnigeria.com/2026/10/31/dollar-to-naira-today-october-31-2026-nfem-rate-%E2%82%A61346-91-black-market-%E2%82%A61385/ — fetched; *Vanguard*, "Naira appreciates to N1,373/$ in parallel market", October 2026. https://www.vanguardngr.com/2026/10/naira-appreciates-to-n1373-in-parallel-market/ — search extract.
- S30. *Nairametrics*, "CBN lifts cash deposit restriction on domiciliary accounts, allows $10k withdrawals daily", 18 June 2023. https://nairametrics.com/2023/06/18/breaking-cbn-lifts-cash-deposit-restriction-on-domiciliary-accounts-allows-10k-withdrawals-daily/ — fetched.
- S31. Central Bank of the UAE, *Open Finance Regulation* (Circular 7/2023 of 31 December 2023, replaced by Circular 3/2025 of 10 July 2025). https://rulebook.centralbank.ae/node/5686 — fetch 403; summarised via Pinsent Masons, *UAE open finance* (https://www.pinsentmasons.com/out-law/guides/uae-open-finance) and Mondaq, *Open Finance Regulation* (https://www.mondaq.com/financial-services/1555738/open-finance-regulation) — search extracts.
- S32. Himma.ai, *UAE Open Finance Tracker 2026: Which banks are live on CBUAE AlTareq?* (reviewed 2 July 2026). https://himma.ai/tools/open-finance-tracker/ — fetched.
- S33. PaymentExpert, "UAE fintech hub: open finance, Aani and what's next in 2026", 21 October 2026. https://paymentexpert.com/2026/10/21/uae-fintech-hub-open-finance-2026/ — search extract (fetch 403).
- S34. The Paypers, "Fintech Galaxy secures CBUAE approval for Open Finance". https://thepaypers.com/fintech/news/fintech-galaxy-secures-cbuae-approval-for-open-finance ; Spare, "Spare receives in-principle approval from the Central Bank of the UAE for Open Finance license" (August 2025). https://tryspare.com/blog/spare-receives-in-principle-approval-from-the-central-bank-of-the-uae-for-open-finance-license/ — search extracts.
- S35. Central Bank of the UAE, *UAE Fund Transfer System (UAEFTS)*. https://centralbank.ae/en/our-operations/payments-and-settlements/uae-fund-transfer-system-uaefts/ ; *IBAN* FAQ. https://www.centralbank.ae/en/services/iban — search extracts (fetch 403).
- S36. Al Etihad Payments, *Aani*. https://aep.ae/ — fetched; *Al Etihad*, "Aani…" (September 2025). https://en.aletihad.ae/news/business/4609296/ ; *Gulf News*, "UAE instant payments platform Aani crosses 12.5 million users". https://gulfnews.com/business/banking/uae-instant-payments-platform-aani-crosses-125-million-users-1.500502686 — search extracts.
- S37. *Gulf News*, "Creation, history and evolution of the UAE dirham" (2021). https://gulfnews.com/amp/story/uae%2Fyear-of-the-50th%2Fcreation-history-and-evolution-of-the-uae-dirham-1.1621767243152 — search extract.
- S38. EY, *UAE introduces enhanced Wage Protection System, effective 1 June 2026* (Tax Alert, 2026). https://www.ey.com/en_gl/technical/tax-alerts/uae-introduces-enhanced-wage-protection-system-effective-1-june-2026 — fetched.
- S39. Standard Chartered Bank UAE, *Value Added Tax ('VAT') and frequently asked questions* (January 2018, PDF). https://www.sc.com/global/av/ae-vat-frequently-asked-questions.pdf — fetched; text extracted.
- S40. ADCB, *e-Statements: How to view & download online*. https://www.adcb.com/en/tools-resources/e-statement/ — search extract (fetch 403).
- S41. Emirates NBD, *businessONLINE: How to access your statements* (February 2022, PDF). https://www.emiratesnbd.com.sa/-/media/enbd/ksa/pdf/businessonline/ksa_how_to_access_your_statements.pdf — search extract; Emirates NBD, *E-Statements*. https://www.emiratesnbd.com/en/ways-of-banking/e-statements — fetched (navigation only).
- S42. Wise Help Centre, *How do I download a statement?* https://wise.com/help/articles/2736049/how-do-i-download-a-statement — fetched.
- S43. M. Laitinen, *ofxstatement-revolut* parser source (GitHub). https://raw.githubusercontent.com/mlaitinen/ofxstatement-revolut/master/src/ofxstatement/plugins/revolut.py — fetched; Revolut Help, *Account statement per chosen currency*. https://help.revolut.com/en-JP/help/profile-and-plan/managing-my-account/account-statement-per-chosen-currency/ — fetch 403.
- S44. Interactive Brokers, *Flex Web Service — SendRequest* and *GetStatement* API reference. https://www.interactivebrokers.com/docs/web-api/api-reference/send-request.md ; https://www.interactivebrokers.com/docs/web-api/api-reference/get-statement.md ; IBKR Campus, *Flex Web Service*. https://www.interactivebrokers.com/campus/ibkr-api-page/flex-web-service/ — search extracts (fetch 403).
- S45. Bamboo FAQ, *Account statements and trade confirmations*. https://faq.investbamboo.com/en/articles/6889357-account-statements-and-trade-confirmations — fetched.
- S46. Sarwa Help Centre, *How do I download my Sarwa Invest statement?* https://help.sarwa.co/hc/en-us/articles/4410507600657-How-do-I-download-my-Sarwa-Invest-statement ; *How do I view my monthly Sarwa Trade statement?* https://help.sarwa.co/hc/en-us/articles/5885578724509-How-do-I-view-my-monthly-Sarwa-Trade-statement — search extracts (fetch 403).
- S47. Dignited, *Risevest account statement* (13 June 2022, third-party). https://www.dignited.com/96294/risevest-account-statement/ — fetched.
- S48. Techpoint Africa, "Risevest acquires Chaka", 26 September 2023. https://techpoint.africa/2023/09/26/risevest-acquires-chaka — search extract.
- S49. ShareSaver, *CSCS account number in Nigeria: meaning and how to find it* (third-party). https://sharessaver.com/blog/cscs-account-number-nigeria — search extract.
- S50. National Pension Commission (PenCom), *Frequently Asked Questions 2023* (PDF), Part on RSA statements ("at least once every three months"). https://www.pencom.gov.ng/wp-content/uploads/2023/09/FREQUENTLY-ASKED-QUESTIONS-2023.pdf — fetched; text extracted.
- S51. Plaid, *Personal Finance Category taxonomy* (v1 CSV). https://plaid.com/documents/transactions-personal-finance-category-taxonomy.csv ; *PFC taxonomy v1/v2 comparison* (CSV). https://plaid.com/documents/pfc-taxonomy-all.csv ; *Personal Finance Category migration guide* (PFCv2, December 2025). https://plaid.com/docs/transactions/pfc-migration/ ; *Transactions API reference* (confidence_level, counterparties). https://plaid.com/docs/api/products/transactions/ — all fetched.
- S52. Plaid, *Recurring transactions* (blog). https://plaid.com/blog/recurring-transactions/ — search extract; Plaid, *Bank Income* documentation. https://plaid.com/docs/income/bank-income/ — fetched.
- S53. Firefly III documentation, *Architecture* and *Transactions*. https://docs.firefly-iii.org/explanation/more-information/architecture/ ; https://docs.firefly-iii.org/explanation/financial-concepts/transactions/ — search extracts quoting the docs (fetch 403).
- S54. Actual Budget documentation, *Transfers* and *Importing transactions*. https://actualbudget.org/docs/transactions/transfers/ ; https://actualbudget.org/docs/transactions/importing/ — fetched.
- S55. Beancount syntax reference (beancount.io mirror of the official syntax). https://beancount.io/docs/Basics/syntax — fetched; official documentation https://beancount.github.io/docs/ — not fetched.
- S56. hledger manual. https://hledger.org/hledger.html — fetched (first 100,000 characters).
- S57. CFP Board, *Code of Ethics and Standards of Conduct* — Practice Standards for the Financial Planning Process (effective 1 October 2019). https://www.cfp.net/ethics/code-of-ethics-and-standards-of-conduct — fetched.
- S58. Financial Planning Standards Board, *Financial Planning Practice Standards* (2021). https://fpsb.org/standards-for-the-profession/framework/practice/ — fetched; Financial Planning Association of Malaysia, *Practice Standards v2021* (revision 17 May 2021, PDF). https://fpam.org.my/wp-content/uploads/2026/06/FPAM-Practice-Standards-v2021.pdf — fetched; text extracted.
- S59. K. N. Ryack, M. Kraten, A. Sheikh, "Incorporating Financial Risk Tolerance Research into the Financial Planning Process", *Journal of Financial Planning* 29(10), October 2016, 54–61. https://www.financialplanningassociation.org/article/journal/OCT16-incorporating-financial-risk-tolerance-research-financial-planning-process — fetched [unverified in OpenAlex].

**Academic references (checked against OpenAlex by DOI, 2026-11-02)**
- S60. J. E. Grable, R. H. Lytton, "Financial risk tolerance revisited: the development of a risk assessment instrument", *Financial Services Review* 8(3), 1999. https://doi.org/10.1016/S1057-0810(99)00041-4 [verified]
- S61. P. Kuzniak, A. Rabbani, W. Heo, J. Ruiz-Menjivar, J. E. Grable, "The Grable and Lytton risk-tolerance scale: a 15-year retrospective", *Financial Services Review* 24, 2015. [unverified — not found in OpenAlex title search]
- S62. C. Heath, J. B. Soll, "Mental Budgeting and Consumer Decisions", *Journal of Consumer Research* 23(1), 1996. https://doi.org/10.1086/209465 [verified]
- S63. R. H. Thaler, "Mental accounting matters", *Journal of Behavioral Decision Making* 12(3), 1999. https://doi.org/10.1002/(SICI)1099-0771(199909)12:3<183::AID-BDM318>3.0.CO;2-F [verified]
- S64. C. Y. Zhang, A. B. Sussman, "Perspectives on mental accounting: An exploration of budgeting and investing", *Financial Planning Review* 1(1–2), 2018. https://doi.org/10.1002/cfp2.1011 [verified]
- S65. D. Soman, A. Cheema, "Earmarking and Partitioning: Increasing Saving by Low-Income Households", *Journal of Marketing Research* 48(SPL), 2011. https://doi.org/10.1509/jmkr.48.SPL.S14 [verified]
- S66. D. Prelec, G. Loewenstein, "The Red and the Black: Mental Accounting of Savings and Debt", *Marketing Science* 17(1), 1998. https://doi.org/10.1287/mksc.17.1.4 [verified]
- S67. D. Soman, "Effects of Payment Mechanism on Spending Behavior: The Role of Rehearsal and Immediacy of Payments", *Journal of Consumer Research* 27(4), 2001. https://doi.org/10.1086/319621 [verified]
- S68. D. Fernandes, J. G. Lynch Jr., R. G. Netemeyer, "Financial Literacy, Financial Education, and Downstream Financial Behaviors", *Management Science* 60(8), 2014. https://doi.org/10.1287/mnsc.2013.1849 [verified]
- S69. T. Kaiser, A. Lusardi, L. Menkhoff, C. Urban, "Financial education affects financial knowledge and downstream behaviors", *Journal of Financial Economics* 145(2), 2022 (online 2021). https://doi.org/10.1016/j.jfineco.2021.09.022 [verified]
- S70. A. Olafsson, M. Pagel, "The Liquid Hand-to-Mouth: Evidence from Personal Finance Management Software", *Review of Financial Studies* 31(11), 2018. https://doi.org/10.1093/rfs/hhy055 [verified]
- S71. B. I. Carlin, A. Olafsson, M. Pagel, "Mobile Apps and Financial Decision Making", *Review of Finance* 27(3), 2023 (online 2022). https://doi.org/10.1093/rof/rfac040 [verified]
- S72. A. Lusardi, D. Schneider, P. Tufano, "Financially Fragile Households: Evidence and Implications", *Brookings Papers on Economic Activity*, Spring 2011. https://doi.org/10.1353/eca.2011.0002 [verified]
- S73. M. Despard, T. Friedline, S. West, "Why Do Households Lack Emergency Savings? The Role of Financial Capability", *Journal of Family and Economic Issues* 41, 2020. https://doi.org/10.1007/s10834-020-09679-8 [verified]
- S74. Board of Governors of the Federal Reserve System, *Economic Well-Being of U.S. Households in 2025* — Executive Summary (survey fielded 17–28 October 2025; published May 2026). https://www.federalreserve.gov/publications/2026-economic-well-being-of-us-households-in-2025-executive-summary.htm — fetched 2026-11-02.
- S75. M. Gelman, S. Kariv, M. D. Shapiro, D. Silverman, S. Tadelis, "Harnessing naturally occurring data to measure the response of spending to income", *Science* 345(6193), 2014. https://doi.org/10.1126/science.1247727 [verified]
- S76. P. Ganong, P. Noel, "Consumer Spending during Unemployment: Positive and Normative Implications", *American Economic Review* 109(7), 2019. https://doi.org/10.1257/aer.20170537 [verified]
- S77. B. Baugh, I. Ben-David, H. Park, J. A. Parker, "Asymmetric Consumption Smoothing", *American Economic Review* 111(1), 2021 (OpenAlex year 2020). https://doi.org/10.1257/aer.20181735 [verified]
- S78. J. Gathergood, N. Mahoney, N. Stewart, J. Weber, "How Do Individuals Repay Their Debt? The Balance-Matching Heuristic", *American Economic Review* 109(3), 2019. https://doi.org/10.1257/aer.20180288 [verified]
- S79. I. P. Fellegi, A. B. Sunter, "A Theory for Record Linkage", *Journal of the American Statistical Association* 64(328), 1969. https://doi.org/10.1080/01621459.1969.10501049 [verified]
- S80. IFRS Foundation, *IAS 21 The Effects of Changes in Foreign Exchange Rates* (overview page). https://www.ifrs.org/issued-standards/list-of-standards/ias-21-the-effects-of-changes-in-foreign-exchange-rates/ — fetched (overview only; paragraph-level rules cited from the standard, not re-read here).
- S81. CRC Credit Bureau, *FAQ*. https://crccreditbureau.com/faq/ — fetched; WithinNigeria, "How to check your credit score in Nigeria using credit bureau", 10 June 2026. https://www.withinnigeria.com/2026/06/10/how-to-check-your-credit-score-in-nigeria-using-credit-bureau/ — search extract; "An Appraisal of the Nigerian Credit Reporting Act 2017", *Journal of African Law* (Cambridge). https://www.cambridge.org/core/journals/journal-of-african-law/article/appraisal-of-the-nigerian-credit-reporting-act-2017/BA239BBC8810186E0FA9A86BA8DB7F13 — search extract [unverified].
- S82. Etihad Credit Bureau, *FAQs — Credit Report & Score* (AED 157.50 report; AED 10.50 score, incl. VAT). https://etihadbureau.ae/faqs/19 — search extract (fetched page rendered empty); Bayut, *A quick guide to Etihad Credit Bureau* (AED 84 individual report). https://bayut.com/mybayut/etihad-credit-bureau — search extract (page later returned HTTP 410).
- S83. (merged into S51.)
- S84. J. Sabat, E. Gallagher, "Rules of Thumb in Household Savings Decisions: Estimation Using Threshold Regression" (working paper, SSRN, 2019). [unverified — not found in OpenAlex]
- S85. J. M. Collins, L. Gjertson, "Emergency savings for low-income consumers", *Focus* 30(1), 2013. [unverified — not found in OpenAlex]
- S86. J. Klement, *Investor Risk Profiling: An Overview*, CFA Institute Research Foundation, 2015. [unverified — not found in OpenAlex]
- S87. World Bank, *Nigeria Development Update*, October 2026 (as reported by Nairametrics, S26). — not fetched.
- S88. OECD, *Household savings* indicator (definition of household saving rate). https://www.oecd.org/en/data/indicators/household-savings.html — fetch 403; definition cited from standard national-accounts practice [unverified].
- S89. Intuit Inc., US Patent 8,380,590, "Method and system for detecting recurring income from financial transaction data". https://patents.google.com/patent/US8380590 — search extract (industry-approach reference only).
- S90. Udo Udoma & Belo-Osagie, *Nigeria's FinTech Regulatory Framework: Key 2025 Review and Outlook for 2026* (February 2026, PDF). https://uubo.org/wp-content/uploads/2026/02/FINTECH-2025-REVIEW-AND-OUTLOOK-FOR-2026-.pdf — search extract.
- S91. Launchpad.ng, *Open banking in Nigeria in 2026: who's actually compliant* (undated; claims rules "now live"; contradicted by S2–S6). https://launchpad.ng/resources/open-banking-nigeria-2026 — search extract; low confidence.
- S92. Afriex, *Nigeria bank transfer fees 2026*. https://afriex.com/post/nigeria-bank-transfer-fees-2026 — search extract; secondary.
- S93. E. Warren, A. W. Tyagi, *All Your Worth: The Ultimate Lifetime Money Plan* (Free Press, 2005) — origin of the 50/30/20 rule; book, not verified.

*Research artefacts (not sources):* worked-example script and OpenAlex verification log kept in the session scratchpad (`worked_example.py`, `openalex_results.txt`); CBN 2020 Guide, NBS rebasing, PenCom FAQ, SC VAT FAQ and FPAM standards PDF text extracts retained for reviewer inspection.
