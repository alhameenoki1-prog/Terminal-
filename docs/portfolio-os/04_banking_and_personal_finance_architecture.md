```
Document: 04 — Banking and Personal Finance Architecture (financial-ledger and personal-finance requirements specification)
Department: Banking and Financial Services  ·  Lead role(s): commercial banker, retail banking specialist, private banker / wealth-management professional, financial-planning specialist, financial adviser, credit and lending specialist, financial-infrastructure and open-banking specialist, banking-operations / payments specialist
Version: 0.2  ·  Date: 2026-11-04  ·  Status: revised after independent review
Reviewers required: Architecture and Accounting (owners of CANONICAL_CONTRACTS.md); Data Architecture & Engineering; Tax Intelligence; Behavioural Finance; Portfolio Management & Quant; Forecasting & Wealth Planning; AI Research & Explanation; Legal/Compliance & Privacy; Commercialisation
```

> Simulated specialists are not licensed professionals. Every regulatory, tax and fee statement below carries the date it was checked (2026-11-02 unless stated; facts changed in the revision pass were re-checked on 2026-11-04) and must be re-verified by a licensed practitioner before anything is relied upon or shipped.
>
> **Binding contracts.** This version adopts `CANONICAL_CONTRACTS.md` C1 (ledger posting model), C3 (data status), C4 (confidence) and C5 (FX presentation). Where this document and a contract differ, the contract governs; this document references the contracts and does not restate them. §11 lists every review finding and what was done with it.

## 1. Executive summary

**Conclusion 1 — build the personal MVP on statement upload, not bank APIs.** As of 2026-11-04 Nigeria's CBN open banking has no confirmed go-live. Open Banking Nigeria (last updated July 2026) still cites "a phased go-live in early 2026", and individuals are not API consumers [S2, S90]. UAE Open Finance is live at about five of fifteen banks and requires a CBUAE licence [S31, S32]. Exports exist for the accounts that matter (F3). Parser coverage for the founder's banks is unproven: `bankstract` is alpha, with four Nigerian parsers [S15].

**Conclusion 2 — the ledger follows Contract C1.** Postings balance per commodity, exactly, through conversion and in-transit accounts. Categories are journaled attributes, not accounts. Every base-currency figure is derived, never posted. Foreign currency carries a weighted-average NGN cost for Tax.

**Conclusion 3 — reconciliation is a completeness control, not an integrity guarantee.** Opening + credits − debits = closing shows that the parse is complete relative to the document. Classification, matching, dates and authenticity need separate controls (§4.3.7).

**Conclusion 4 — FX cost is measured, not plugged.** Conversion cost against the CBN central rate (C5) is reported only for a confirmed match that passes C1.5's residual rule. The v0.1 symmetric ±6% band, which let mismatches pass as "spread", is withdrawn.

**Conclusion 5 — context changes the numbers.** CPI is rebased (14.63% y/y, September 2026) [S26]. On 29 Oct 2026 NFEM sell was ₦1,346.91 and central ₦1,346.41, against a parallel ₦1,375–1,390 [S29]. Senders pay ₦50 stamp duty on transfers of ₦10,000 or more [S20–S22, S98].

**Biggest uncertainty:** whether every foreign-currency spend is a chargeable disposal (NTA s.34(1)(b)), and whether the founder's banks produce statements that parse and reconcile. Both need outside answers: a licensed practitioner and real redacted samples.

## 2. Scope and method

**Questions addressed.** (A) How can financial data actually be obtained today across NGN, AED and USD accounts? (B) What ledger design is sound for an individual with multi-currency accounts? (C) What transaction intelligence (income detection, transfer matching, duplicates, categorisation, reconciliation) is feasible and how is confidence stored? (D) What planning intelligence has evidence behind it? (E) Which Nigerian and UAE facts change the numbers? (F) A reproducible synthetic worked example.

**What we searched and used.** WebSearch (standard and extended modes) across CBN, CBUAE, NBS, bank and fintech help centres, open-banking bodies, open-source project documentation and press (about 60 queries until the shared search budget was exhausted); WebFetch of primary pages and PDFs (CBN Guide to Charges 2020, NBS CPI Rebasing Highlights, PenCom FAQ 2023, FPAM/FPSB Practice Standards 2021, Standard Chartered UAE VAT FAQ, Plaid taxonomy CSVs, Wise/Actual Budget/Beancount documentation); Python 3 (decimal arithmetic) for the worked example; OpenAlex API (direct HTTPS) to verify academic references after the reference-lookup MCP tools timed out. Each time-sensitive fact states the date checked.

**What we could not access.** Several official pages blocked automated fetching (CBUAE rulebook, Firefly III docs, IBKR docs, ADCB, Sarwa, Revolut help, Moniepoint support); for those we rely on search-engine extracts of the official text and say so. We could not fetch the CBN's 2026 Guide to Charges PDF (figures are from two press reports), the CBN exchange-rate page (figures are press reports quoting CBN), or any official OPay, PalmPay, GTBank, Zenith, Access, UBA, Stanbic IBTC, Mashreq, Wio, Liv, RAKBANK, PiggyVest, Cowrywise, Trove or Chaka statement-export documentation. Those are listed as validation tasks (§9) rather than asserted. We did not read the founder's Google Drive or Gmail and wrote no application code.

**Revision pass (2026-11-04).** We read review R04, revision-log rows V-003, V-008 and V-025, the context brief v0.2 and `CANONICAL_CONTRACTS.md`. Re-fetched with WebFetch on 2026-11-04: S2 (Open Banking Nigeria), S15 (PyPI JSON for `bankstract`), S22 (TechEconomy), S29 (WithinNigeria NFEM), S32 (Himma tracker) and S38 (EY WPS alert). We also re-downloaded and parsed the Plaid PFC CSV (S51) and checked DOIs against the Crossref API (S61, S84, S94, S95). The reference-lookup tool timed out twice, so Crossref was used instead. The worked example (§4.6) was recomputed by `research/scripts/doc04_ledger_worked_example.py` (standard library only; `python3 -I`). Still not retrieved: the CBN 2026 Guide to Charges PDF, the CBN NFEM page, the CBUAE rulebook and the NTA 2025 gazette text. For stamp duty we rely on Doc 6 F21's reading of the statute.

## 3. Findings

Evidence grades follow the brief (E1–E6). Source numbers refer to §10.

**F1. Nigeria's regulated open banking is not usable for product planning today.** The CBN issued the Regulatory Framework in February 2021 [S1, S3] and the Operational Guidelines in March 2023. Doc 7 read the Guidelines in primary text [Doc 7 S48]: individuals are not a participant class [S96]. The 1 August 2025 nationwide go-live "did not materialize". Workstreams had delivered by September 2025 [S2]. A February 2026 law-firm review reported a phased rollout spread across mid-2026 [S90]. BusinessDay on 8 June 2026 still described go-live as "months away" [S4]. Open Banking Nigeria's page, last updated July 2026, says the industry "awaits the next directive from the regulator, with expectations of a phased go-live in early 2026" (re-fetched 2026-11-04) [S2]. The two target dates disagree, and both have passed without a confirmed go-live. TechCrier (October 2026) found no go-live, but its latest evidence is the same July page, so it does not corroborate independently [S6]. One vendor page claims the rules are "now live"; it is undated and contradicts the rest [S91]. NIBSS is nominated to run the Open Banking Registry and a centralised consent-management system. Access is tiered and anchored on the Bank Verification Number (BVN), and individuals appear only as consent-givers [S2–S4]. **Grade E2 for the 2023 Guidelines (primary text via Doc 7 S48). E3 for the 2021 framework (law-firm summary) and for go-live status (industry body and press; sources not independent; no CBN primary notice found).** Checked 2026-11-02; status re-checked 2026-11-04.

**F2. The aggregator market is thin and unpriced.** Okra wound down in May 2025 (reported 3 July 2025), citing naira-depreciation-driven cloud costs and regulatory delays [S7]. Mono (now a Flutterwave company) publishes a page with a 30-day free trial (5 accounts), a "Basic" plan at ₦50,000/month for up to 100 unique accounts, add-ons (Real-time Sync ₦100 per call; widget customisation ₦50,000 one-off) and "contact sales" for enterprise; the page is undated and a tracker reports pay-as-you-go pricing introduced in February 2026 (unverified) [S8, S11]. Mono's coverage page lists Nigeria ("40"), Ghana and South Africa and shows logos for GTBank, Access, Kuda, Zenith, UBA, First Bank, Stanbic IBTC, OPay, PalmPay, Moniepoint, PiggyVest, Cowrywise, Risevest, Chaka and Trove, but does not state product-level coverage or reliability [S9, S10]. Industry commentary notes Mono's connections are proprietary rather than standardised APIs [S12]. Stitch entered Nigeria with pay-by-bank payments, not account data; OnePipe's current data-product status could not be verified [S4, search]. **Grade E3 (vendor pages, trackers, press).**

**F3. Statement exports exist and are the realistic MVP source.** Confirmed from official or near-official sources: Kuda — PDF or Excel, requested in-app and emailed [S13]; Moniepoint — Standard or Extended statement, Excel or PDF [S14]; OPay — PDF and XLSX (evidenced by an open-source parser supporting both) [S15]; First Bank, Zenith, PalmPay — PDF (same parser) [S15]; GTBank — "My Account → Account Statement" in Internet Banking, emailed to the profiled address; third-party tooling references a GTBank Excel export (unverified) [S16]; Wise — PDF, XLSX, CSV, MT940, QIF, CAMT.053, per currency/jar, maximum 365 days per file [S42]; Revolut — CSV whose header is `Type, Product, Started Date, Completed Date, Description, Amount, Fee, Currency, State, Balance` (parser evidence; official help page blocked) [S43]; Interactive Brokers — Flex Queries in XML/CSV/TXT, retrievable by token and query ID through the Flex Web Service (`SendRequest` → reference code → `GetStatement`, version 3, pacing 1 request/second and 10/minute) [S44]; Bamboo — monthly brokerage statements in-app, trade confirmations per settled trade, wallet statements emailed with a 6-month maximum per request [S45]; Sarwa — Invest activity statement via web only, Trade monthly statements in-app [S46]; Risevest — statements per plan or all plans, emailed (third-party guide, 2022) [S47]; CSCS — portfolio statement via the e-CSCS investor portal or the stockbroker, one Clearing House Number per statement (third-party) [S49]; pension — PFAs must issue RSA statements at least every three months (PenCom FAQ 2023) [S50]. UAE banks: ADCB's app offers "Download Statement" with a file-format choice [S40]; Emirates NBD's *business* portal exports PDF/Excel/CSV, personal export formats unconfirmed [S41]; Mashreq, Wio, Liv and RAKBANK export formats not found. **Grade E3 where official, E5 (engineering assumption, to be tested with real files) elsewhere.**

**F4. Nigerian statements have bank-specific layouts and narrations. `bankstract` is useful but immature.** The PyPI JSON (re-fetched 2026-11-04) shows `bankstract` v0.18.3 (2 Nov 2026), MIT licence, "Development Status :: 3 - Alpha", with 21 releases since 13 June 2026 [S15]. It has **four parsers only**: First Bank, Zenith and PalmPay (PDF) and OPay (PDF, XLSX). It has none for Kuda, Moniepoint, GTBank, UBA or Access. It normalises rows to `date, narration, debit, credit, balance, reference, currency, has_time`. It runs two checks, row-wise running balance and totals against the printed "Total Money In / Out", and publishes a status per bank: First Bank passes both; Zenith totals are `not_available`; PalmPay row-wise is `not_available`; **OPay row-wise is `disabled`** because "opay balances skip OWealth auto-save moves, so they don't chain". It does not test the opening/closing identity as such. It also offers `inspect()`, which "look[s] for signs a statement was edited after the bank made it" (signals such as `incremental_update`, `overlay_over_text`, `unexpected_producer`) and states that it never says a statement is forged [S15]. v0.1 listed per-bank labels for the NIBSS session identifier. That list had no source and is withdrawn; it becomes a validation item (§9). Narration prefixes such as `NIP/`, `TRF/`, `POS/WEB PURCHASE`, `USSD`, `REVERSAL`, `STAMP DUTY`, `EMTL`, `SMS ALERT`, `VAT` and `ACCOUNT MAINTENANCE FEE` are observed conventions, not documented standards. **Grade E3 for the parser facts (package metadata and README); E4/E5 for narration conventions (specialist experience, to be validated on redacted samples).**

**F5. The Nigerian charge regime changed twice in 2026.** The 2020 Guide to Charges (effective 1 Jan 2020) set electronic transfer fees of ₦10 (below ₦5,000), ₦25 (₦5,001–₦50,000) and ₦50 (above ₦50,000); mandatory SMS alerts on a cost-recovery basis and email alerts free; naira card maintenance nil on current accounts and max ₦50/quarter on savings accounts; FX-denominated cards $10 p.a.; card issuance ₦1,000; current-account maintenance fee (CAMF) max ₦1 per mille; monthly statements free and special-request statements max ₦20/page; USSD "current NIP charges apply"; RTGS ₦950 [S17, PDF text extracted]. The revised Guide, exposure draft 21 April 2026 and effective 1 May 2026, is reported to make transfers ≤ ₦5,000 free, ₦5,001–₦50,000 ₦10, above ₦50,000 ₦50; card issuance ₦1,500; no maintenance fee on naira cards; SMS alerts still cost-recovery; CAMF capped at ₦0.5 per mille in 2026 falling to zero by 2027; other-bank ATM ₦100 per ₦20,000 with an off-site surcharge up to ₦500; POS free to customers with a 0.5% merchant charge capped at ₦10,000 [S18]. Separately, the Nigeria Tax Act 2025 (signed 26 June 2025, effective 1 January 2026) replaced the Electronic Money Transfer Levy with a ₦50 stamp duty on electronic transfers of ₦10,000 or more, borne by the *sender*, with exemptions for salary payments and intra-bank self-transfers; Kuda applied it from 1 January 2026 and Paystack from 18 February 2026 for merchant payouts [S20–S23]. The statutory basis, as Doc 6 F21 reads the gazette, is NTA 2025 s.123 (charge), Ninth Schedule item 48 ("electronic receipt or transfer of money", ₦50 payable by the transferor) and s.184(i) (exempting transfers below ₦10,000, salary payments and intra-bank self-transfers) [S98]. TechEconomy adds "or their foreign currency equivalent" (re-fetched 2026-11-04) [S22]. No source we found says whether **card/POS payments** are "electronic transfers" for this purpose. VAT at 7.5% is applied to explicit bank fees (e.g., ₦3.75 on a ₦50 fee) [S24]. **Grade E2 for the 2020 Guide (primary PDF). E2 via Doc 6 for the stamp-duty statute (not re-read here). E3 for the 2026 Guide and the bank and PSP mechanics (press, bank and PSP notices).** Checked 2026-11-02; stamp-duty basis 2026-11-04.

**F6. Nigerian inflation is measured on a new basis.** The NBS rebased the CPI in February 2025: weight reference period 2023, price reference period 2024 (= 100), COICOP 2018 with 13 divisions, 934 product varieties, Young index; food weight fell from 51.8% to 40.0%; January 2025 headline 24.48%, food 26.08%, core 22.59% [S25]. The September 2026 release (15 October 2026) reports headline 14.63% y/y (August 15.39%; September 2025 20.98%), month-on-month 0.06%, food 19.59%, core 12.95%, urban 15.64%, rural 12.46% [S26]. Old-series and new-series figures are not comparable. **Grade E2.**

**F7. Nigeria has one official rate and one street rate, and the system must store both.** Interbank FX trades moved to Bloomberg BMatch (the Electronic FX Matching System) on 2 December 2024; the Nigerian Foreign Exchange Market (NFEM) rate is computed on FMDQ's closing-rate methodology; the Nigerian FX Code took effect 14 October 2024 [S27, S28]. For Thursday 29 October 2026 the press report gives NFEM buy ₦1,345.91, **sell ₦1,346.91** and **central ₦1,346.41**. It also calls ₦1,346.91 the "weighted average", which is the sell figure. v0.1 stored that sell figure under the name "weighted average" and used it as the month-end rate. The same report gives early trading on Friday 30 October at about ₦1,346.86, with no fixing, and parallel quotes of about ₦1,375 buy and ₦1,385–1,390 sell, a gap of about 2–3% (re-fetched 2026-11-04) [S29]. Every stored rate therefore records its field (buy/sell/central/close) and fixing date. The reference rate is the **central** rate (C5.1). Domiciliary accounts: since the CBN's 18 June 2023 guidance, cash deposits are unrestricted subject to KYC, and holders may utilise cash deposits up to $10,000 per day via telegraphic transfer [S30]. **Grade E3 for the regime (law-firm summaries; CBN circulars not read) and for the daily figures (press quoting CBN; CBN page not fetched).**

**F8. The UAE's Open Finance framework is real, licensed and partially live.** CBUAE Circular 7/2023 (issued 31 Dec 2023, effective 15 Apr 2024) was replaced by Circular 3/2025 of 10 July 2025. Nebras Open Finance (an Al Etihad Payments entity) operates the AlTareq API hub and trust framework; third parties need a CBUAE Open Finance licence covering Data Sharing and/or Service Initiation; banks and other licensed persons are "deemed licensed" but must notify and obtain approval; Pay10 was the first licensed TPP (April 2025); Spare and Fintech Galaxy received in-principle approvals [S31, S34]. A tracker reviewed on 2 July 2026 counts five of fifteen banks live: CBD (live 2025 with Pay10 and Lean), ADIB (January 2026), FAB, DIB and Mashreq. It shows Wio as live but "Unconfirmed", Emirates NBD, ADCB, Emirates Islamic and RAKBANK as onboarding, and five banks as pending. It names consumer data sharing explicitly only for CBD and Mashreq, and describes AlTareq as "live and enabled" for FAB and DIB accounts. Its own counts disagree: the summary tiles show 5 live, 5 onboarding and 5 pending, while the table shows 6, 4 and 5 (re-fetched 2026-11-04) [S32]. An October 2026 article reports a mid-September 2026 compliance deadline [S33]. **Implication:** a single-user system cannot be a TPP; UAE account data must come from statements or from a licensed aggregator's consumer product. **Grade E3 for the regulation (law-firm summaries; rulebook page blocked) and for live status (tracker with internal inconsistencies).**

**F9. UAE payments context.** UAEFTS is the CBUAE-owned real-time gross settlement system, operational since 2001; IBAN is mandatory for domestic and international electronic payments [S35]. Aani (Al Etihad Payments, launched October 2023) offers 24/7 instant transfers by mobile-number proxy and QR, request-to-pay and split payments; AEP's site cites a limit of AED 50,000 while a 2025 press report cites AED 5,000 per proxy transaction — the two must be reconciled [S36]. The dirham has been fixed at AED 3.6725 per US dollar since November 1997 [S37]. Private-sector salaries must be paid through the Wage Protection System (WPS): Ministerial Resolution 340 of 2026 (12 May 2026, effective 1 June 2026) requires payment "no later than the first day of each Gregorian month for the previous Gregorian month's work". An employer that pays at least 85% of wages by the deadline is compliant. Payments are "submitted via WPS files" through banks or approved platforms (re-fetched 2026-11-04) [S38]. A calendar month can therefore hold zero, one or two AED salaries, and no source documents a "WPS" narration cue (E4/E5). VAT at 5% applies to explicit bank fees and commissions; margin- or interest-based services are exempt [S39]. **Grade E2/E3.**

**F10. Plaid's Personal Finance Categories are the right public yardstick.** Version 1 had 16 primary and 104 detailed categories; version 2 (December 2025) has 18 primary and 127 detailed, adding `LOAN_DISBURSEMENTS` and `OTHER`, richer `INCOME` (`SALARY, CONTRACTOR, GIG_ECONOMY, RENTAL, DIVIDENDS, INTEREST_EARNED, …`) and transfer subtypes (`ACCOUNT_TRANSFER, INVESTMENT_AND_RETIREMENT_FUNDS, SAVINGS, WIRE, CRYPTO, WITHDRAWAL, TRANSFER_IN_FROM_APPS, …`). Plaid exposes a `confidence_level` enumeration `VERY_HIGH (>98%) / HIGH (>90%) / MEDIUM / LOW / UNKNOWN` and typed counterparties (`merchant, financial_institution, payment_app, marketplace, payment_terminal, income_source`) [S51]. Plaid's recurring-stream detection groups by description, amount and cadence, treats a stream as mature after three occurrences and reports weekly/biweekly/semi-monthly/monthly frequencies [S52]. **Grade E3 (vendor documentation; widely used de-facto standard).**

**F11. Mature open-source ledgers converge on the same primitives.** Beancount: every transaction must balance (posting weights sum to zero); `@`/`@@` price annotations participate in balancing; `{}` records cost basis; `balance` assertions are evaluated at the start of their date and check one currency; `pad` books the difference to an equity account; `price` directives drive valuation [S55]. hledger: `=` asserts one commodity, `==` asserts it is the only commodity, `=*` includes sub-accounts; costs are ignored for assertions; valuation can be "then", "end" or "now" from `P` price records [S56]. Firefly III: a transaction *group* holds one or more *journals*, each with exactly two legs (source and destination); withdrawals go asset → expense, deposits revenue → asset, transfers asset → asset; a journal may carry a foreign currency and foreign amount; splits are journals within a group [S53]. Actual Budget: a transfer is a linked pair whose payee is the other account, with category "Transfer" and no budget effect; import de-duplication uses the file's transaction ID first, then "around the same date, same amount, similar payee"; it recommends importing one side and letting the other reconcile to avoid duplicate transfers [S54]. **Grade E3.**

**F12. Record linkage has a formal basis, but its use here is unproven.** Fellegi and Sunter (1969) give the probabilistic framework for match / possible match / non-match decisions from field-agreement weights with explicit error bounds [S79, verified]. Their m and u probabilities are usually estimated by EM (Jaro 1989 [S94, Crossref]). A modern implementation and evaluation exists (Enamorado, Fifield & Imai 2019, fastLink [S95, Crossref]). The model assumes conditional independence between fields. That assumption fails for cross-currency transfers, where amount agreement depends on the date through the rate. **Grade E2 for the theory (foundational paper plus method papers); E4 for its applicability to own-transfer matching (no study of this use found).**

**F13. Budgeting method evidence is weaker than practice suggests.** Mental budgeting is real and measurable: consumers set category budgets and then under- or over-consume relative to them (Heath & Soll 1996 [S62]; Thaler 1999 [S63]; review in Zhang & Sussman 2018 [S64]). Partitioning and earmarking money increased saving among low-income Indian households in a field experiment (Soman & Cheema 2011 [S65]); cash and immediate payment forms reduce spending relative to cards (Soman 2001 [S67]; Prelec & Loewenstein 1998 [S66]). This supports *envelope-style* allocation as a plausible intervention (E2, single or few studies). We found **no** peer-reviewed causal evidence for zero-based budgeting in households, and the 50/30/20 rule traces to a practitioner book [S93] (E4). Financial-education meta-analyses disagree on effect size: Fernandes et al. (2014) find small, decaying effects [S68]; Kaiser et al. (2022), pooling 76 randomised experiments, find positive effects on knowledge and behaviours [S69] (E1, conflicting). **Implication:** present budgets as tools with measured outcomes, not as doctrine.

**F14. Personal-finance software data has been used to show how people actually behave.** Olafsson & Pagel (2018), using an Icelandic aggregation app, document "liquid hand-to-mouth" behaviour — spending responds to paycheque arrival even among people with liquidity [S70]; Carlin, Olafsson & Pagel (2023) find that mobile-app access is associated with lower bank fees and less high-interest debt [S71]; Gelman et al. (2014), Ganong & Noel (2019) and Baugh et al. (2021) show spending tracks income timing and falls sharply when income stops [S75–S77]. **Grade E2 for each study and for the body of evidence on income-timing sensitivity, which is from US and Icelandic data; E4 for its transfer to Nigerian and UAE households (no local evidence found).** **Implication:** cash-flow forecasting should be paycheque-anchored, not monthly-average, as a hypothesis to back-test (§9).

**F15. Emergency-fund evidence favours measurable buffers over fixed multiples.** Lusardi, Schneider & Tufano (2011) found roughly half of US adults could not raise $2,000 in 30 days [S72]; the Federal Reserve's 2026 report (survey October 2025) reports 63% would cover a $400 expense with cash or equivalent [S74]; Despard et al. (2020) link emergency savings to financial capability rather than income alone [S73] (E2). The "three to six months of expenses" rule is a professional convention (E4); a working-paper threshold estimate exists (Sabat & Gallagher 2019, SSRN; DOI resolves on Crossref; not peer reviewed) [S84]. **Implication:** express the buffer as *months of essential expenses covered by liquid assets*, show the number, and let the user set the target.

**F16. Risk should be modelled as three separate quantities.** Practice literature distinguishes *risk need* (risk required to meet a goal), *risk capacity* (ability to absorb loss, objective: net worth, income, horizon) and *risk tolerance* (willingness, subjective, measured by validated questionnaire) and warns that plans fail when portfolios exceed tolerance (Ryack, Kraten & Sheikh 2016 [S59], E3). The Grable–Lytton 13-item scale (1999) is the most used instrument [S60, verified; E2]; a 15-year retrospective judged it acceptable but imperfect [S61, verified on Crossref]. CFP Board's Practice Standards (effective 1 October 2019) list risk tolerance among the *qualitative* inputs of step 1 [S57]. **Grade E2/E3.**

**F17. The financial-planning process is standardised and software-adaptable.** CFP Board's seven steps: (1) understanding the client's personal and financial circumstances (qualitative: health, family, values, risk tolerance, goals; quantitative: age, dependants, income, expenses, savings, assets, liabilities, insurance, estate); (2) identifying and selecting goals; (3) analysing the current course of action and alternatives; (4) developing recommendations; (5) presenting; (6) implementing; (7) monitoring and updating [S57]. FPSB's 2021 Practice Standards (as adopted by affiliates such as FPAM, revision 17 May 2021) use a six-step relationship model that starts with establishing the engagement and collecting information and documents [S58]. **Grade E3.**

**F18. Credit information is accessible but not central to the personal MVP.** Nigeria has three CBN-licensed bureaus (CRC, CreditRegistry, FirstCentral) under the Credit Reporting Act 2017; CRC reports contain identity, address and employment history, enquiries, facility history, security, dishonoured cheques and suits, with disputes by email/phone; secondary sources report one free report per year and a USSD channel (`*565*8#`) [S81] (E3). The UAE's Etihad Credit Bureau sells a credit score for AED 10.50 and a credit report quoted at AED 157.50 on its FAQ, while 2026 secondary sources quote AED 84 for individuals — to be verified at purchase [S82] (E3, conflicting). Debt-repayment behaviour deviates from optimal: Gathergood et al. (2019) show "balance matching" across cards instead of paying the highest rate first [S78] (E2) — relevant once liabilities exist in the ledger.

**F19. Household saving-rate and liquidity ratios have standard definitions.** National-accounts practice defines the household saving rate as saving divided by disposable income (OECD indicator; page not fetchable, E3 unverified) [S88]; personal-finance textbooks define the liquidity (basic) ratio as liquid assets divided by monthly essential expenses (E3). The system should compute both from the ledger with their definitions printed beside them.

**F20. Multi-currency accounting has an accepted reference.** IAS 21 distinguishes functional from presentation currency; transactions are initially recorded at the spot rate of the transaction date, monetary items are retranslated at the closing rate, and exchange differences are recognised in profit or loss (IFRS Foundation overview fetched; paragraph-level rules cited from the standard, E3) [S80]. For an individual, this translates to the following. Record each posting in its native commodity. Compute translation and period-end revaluation as **derived views** from quantities and a named, versioned rate set (C1 D3), never as postings. Show translation effects separately from real flows (C5.3).

**F21. Nigerian tax residency now matters for the ledger's income tagging.** The Nigeria Tax Act 2025 taxes residents' income "regardless of whether the income is received in Nigeria or abroad" and removes the former unilateral foreign-tax-credit mechanism in favour of treaty/section-45 relief (law-firm analysis) [S23] (E3). The ledger must therefore tag every income posting with source country, currency and payer, and record the user's residency status as a confirmed input — the Tax department owns the rule, we own the data.

**F22. Investment platforms rarely offer machine-readable exports; brokers do.** Interactive Brokers' Flex Queries are the only fully programmatic source among the accounts reviewed [S44]; Bamboo, Sarwa, Risevest and PFAs deliver PDFs (monthly or quarterly) [S45–S47, S50]; CSCS statements are per-CHN and historically required paid portal registration [S49]; PiggyVest, Cowrywise, Trove and Chaka export formats were not found. **Grade E3/E5.** Implication: investment ledgers will be reconstructed from PDF statements plus manual confirmation for the foreseeable future, and position valuation must come from the Investment Research data layer, not from the statements.

## 4. Proposed framework / specification for Portfolio OS

### 4.1 Data acquisition: what the personal MVP can rely on

| Tier | Source type | Accounts (examples) | Machine-readable? | MVP decision |
|---|---|---|---|---|
| 1 | Structured exports (CSV/XLSX/XML) | Wise (CSV/XLSX/CAMT.053/MT940), Revolut (CSV), IBKR (Flex XML/CSV), Kuda, Moniepoint, OPay (XLSX) | Yes | **Must-have**: one adapter per format, with versioned column maps. OPay parses, but its balances do not chain because OWealth sweeps are omitted (F4). OPay files can therefore reach only `reconciled_with_exception` (below), never plain `reconciled` |
| 2 | Text PDF statements | GTBank, Zenith, First Bank, UBA, Access, Stanbic IBTC, PalmPay, Emirates NBD, FAB, ADCB, Mashreq, Wio, Liv, RAKBANK, Bamboo, Sarwa, Risevest, PFA RSA statements, CSCS | Yes, with layout-specific parsing and mandatory reconciliation | **Must-have**: PDF text extraction with per-institution templates. Files that fail checks are **quarantined, not rejected** (§4.3.7) |
| 3 | Image/scanned PDFs, screenshots | Older statements, some fintech receipts | Only via OCR; error-prone | **Later**: OCR behind a human-review queue |
| 4 | Aggregator APIs | Mono Connect (Nigeria); licensed UAE TPPs (e.g., Lean) | Yes, but consent model proprietary, pricing quote-based, coverage per bank unverified | **Later**: second adapter once reliability is measured on the founder's own banks |
| 5 | Regulated open banking | CBN open banking (not live, F1); CBUAE AlTareq (licence required, F8) | Not available to an individual | **Do-not-build (yet)**; design interfaces so it slots in |
| 6 | Manual entry | Cash, informal loans, physical assets, opening balances | n/a | **Must-have**, with evidence attachment and "manual" provenance flag |

**Parser dependency.** `bankstract` covers First Bank, Zenith, PalmPay and OPay only, and is alpha with a single maintainer (F4). If used, it is pinned to an exact version and vendor-reviewed before use. Its `inspect()` tamper signals are stored as evidence, never as a verdict. Parsers for the founder's other banks are written once redacted samples exist. Which banks the founder uses is **unknown — founder to confirm** (§7).

**Reconciliation status of a statement** (feeds C3; statement-derived amounts take the C3 validation state shown):

| Status | Condition | C3 validation | Use |
|---|---|---|---|
| `reconciled` | Every completeness control in §4.3.7 passes | `auto_validated` | Totals and conclusions per C3.4 |
| `reconciled_with_exception` | A documented exception explains each break. Example: an OPay balance break equal to an OWealth sweep, booked as an inferred transfer to a shadow account `Assets:Savings:OPay:OWealth`, with one review item per inferred movement | `auto_validated` with an exception badge | Totals with badge; the inferred movements are `candidate` until confirmed |
| `quarantined` | Any break is not explained. A named `UNEXPLAINED_DIFFERENCE` (amount, first breaking row, age, owner) is raised, as Doc 6 does | `candidate` | Kept and visible, never in totals |

Provenance follows C1.3: immutable `document` (SHA-256), versioned `extraction` (parser name and version), and raw `source_line` rows with page and bounding box. Every displayed amount traces back to a source line or to a manual entry with a reason.

Consent and security posture for Tier 4 (specialist judgment, E4): the user, not the system, initiates any aggregator link; credentials never enter Portfolio OS; tokens are stored server-side encrypted, never in browser storage (the repository's localStorage anti-pattern, brief §1.5).

### 4.2 Ledger design

**Single-entry versus double-entry.** A single-entry transaction list is what every bank export is, and it is sufficient for *one* account. It fails the moment money moves between the user's own accounts (counted twice as spending and income), crosses currencies (the "loss" between ₦1,000,000 sent and $715 received is invisible or mis-booked), is reversed (a double POS swipe and its reversal inflate both spending and income), or buys a security (cash falls, but wealth does not). Double entry forces each movement to name where value came from and where it went, which is exactly the question the founder's requirements ask (transfers, contributions, FX, duplicates). Beancount, hledger and Firefly III all prove that this is tractable for an individual [F11]. Actual Budget shows the cost of the alternative: it bolts transfer-pairing and de-duplication onto a single-entry model and must document import order to avoid duplicates [S54].

**Recommendation:** double-entry postings, with a *presentation layer* that still looks like a transaction list (one row per bank line, expandable into its postings). Users never type debits and credits; the import pipeline and rules engine generate postings, and the user confirms.

**Binding contract.** The posting model is **C1**. This section maps C1 onto an individual's accounts. It does not restate the schema (C1.3), the invariants (C1-I1 to C1-I13) or the rounding rules (C1.7).

**Chart of accounts for an individual (NGN/AED/USD).** Accounts encode economic **nature** (C1 D4). Spending categories are rows in the bitemporal `classification` table, so recategorising never touches a posting. Asset and liability leaves hold exactly one commodity (C1-I3). Commodity identifiers follow C1 D5 (`CUR:NGN`, `SEC:<MIC>:<ISIN>`, `FUND:…`, `PEN:…`).

| Top level | Examples | Notes |
|---|---|---|
| Assets:Cash | `Assets:Cash:NGN:Wallet`, `Assets:Cash:AED:Wallet` | Manual |
| Assets:Bank | `Assets:Bank:NG:GTB:Current:NGN`, `Assets:Bank:NG:GTB:Dom:USD`, `Assets:Bank:AE:ENBD:Current:AED` | Domiciliary accounts are separate leaves per commodity |
| Assets:EMoney | `Assets:EMoney:Wise:USD`, `Assets:EMoney:Wise:AED`, `Assets:EMoney:OPay:NGN` | A multi-currency file resolves to one account per commodity (C1.8) |
| Assets:Savings | `Assets:Savings:PiggyVest:Flex:NGN`, `Assets:Savings:OPay:OWealth` | Contributions are transfers. OWealth is a shadow account inferred from balance breaks |
| Assets:Brokerage | `Assets:Brokerage:IBKR:Cash:USD`, `Assets:Brokerage:IBKR:<SEC>` | Securities are held in FIFO lots with fees capitalised (C1.6). Market value comes from the price table |
| Assets:Pension | `Assets:Pension:RSA:<PFA>:FundII` | Units × unit price from the quarterly statement |
| Assets:InTransit | `Assets:InTransit:<transfer_id>` | One commodity each. Nets to zero when both legs are confirmed. Older than 10 business days → review (C1 D8, C1-I6) |
| Assets:Receivable | `Assets:Receivable:Loans:<Person>`, `Assets:Receivable:BankDispute:<bank>` | An unreversed bank double debit is a claim on the bank, with an age (C1-I7) |
| Liabilities | `Liabilities:Cards:<Bank>:AED`, `Liabilities:Loans:<Lender>:NGN`, `Liabilities:Loans:<Person>:NGN` | Repayments split principal (transfer) and interest (expense) |
| Equity | `Equity:OpeningBalances`, `Equity:Conversion:<commodity>`, `Equity:Adjustments:Reconciliation` | Conversion accounts are C1 D2 trading accounts. Their value at a reference rate is the conversion gain or loss. Adjustments need user approval and a reason |
| Income | `Income:Employment:<country>:<payer>`, `Income:Business:<client>`, `Income:Dividend`, `Income:Interest`, `Income:Rental`, `Income:Gift` | Tagged with source country, payer and currency (F21). Tax decides taxability |
| Expenses | `Expenses:Consumption`, `Expenses:BankCharge`, `Expenses:Levy`, `Expenses:Tax`, `Expenses:Interest`, `Expenses:TransferOut:Family` | By nature only. Groceries, rent, airtime and other categories are classification rows (§4.3.5). Investing commissions are capitalised into lots, not expensed |
| Suspense | `Suspense:Unmatched:<account>`, `Suspense:FXUnexplained:<commodity>` | Must be zero at period close or the close is blocked (C1-I7) |

**Withdrawn from v0.1:** `Expenses:FX:ConversionCost`, `Income:FXGain:Realised`, `Income:FXGain:Unrealised`, `Expenses:FXLoss:Unrealised`, category leaves such as `Expenses:Groceries`, `Expenses:Investing:Commission` and `Suspense:PendingReversal`. The `posting` fields `ref_rate_to_base` and `base_amount`, and the invariant Σ base_amount = 0, are replaced by C1.3 and C1-I1.

**Domain entities added to C1.3** (append-only or bitemporal per C1.7; C1.3's tables are not repeated here):

| Entity | Key fields | Rules |
|---|---|---|
| `statement` | id, document_id, account_id, period_start, period_end, opening, closing, printed_total_in, printed_total_out, reconciliation_status, exceptions[] | Status per §4.1. Overlaps resolved at line level (§4.3.4) |
| `counterparty` | id, canonical_name, aliases[], type (merchant/person/employer/institution/government/self/provider), identifier_hmac[], country | Self-counterparties are the user's own accounts. An FX provider in a chain is a counterparty, not an account |
| `category` | id, path, plaid_pfc_detailed (exactly one), is_essential, levy_type, is_tax, tax_relevance | Referenced by `classification` (§4.3.5) |
| `income_stream` | id, payer, commodity, cadence, anchor rule and calendar, pay_period rule, median, variance, last date, next expected date | Feeds forecasting and Tax (§4.3.1) |
| `rule` | id, pattern, action, producer (C4), confirmed_applications, correct_applications, Wilson lower bound | A rule is provisional until it has ≥30 confirmations with a Wilson lower bound ≥ 0.90 (C4) |
| `review_item` | id, entity, reason, materiality_ngn, tax_weighted, state, resolved_by, resolved_at | Queue order per C4 |
| `fx_rate` | pair, fixing_date, rate exactly as published, direction, price_type (buy/sell/central/close/VWAP), source, retrieved_at, evidence_snapshot_hash | C1 D7, C3.5 and C5.1. A rate is a world fact that cannot leave `candidate` until it matches a primary-source snapshot |
| `price` | commodity, date, price, currency, source, C3 status | From the Investment Research data layer |
| `evidence` | id, type (statement, provider receipt, contract, screenshot, note), sha256, uri, linked_entity | A provider receipt that prints a dealer rate enables the C1.5 residual test |

**FX is derived, never posted.** An exchange books quantities only, through `Equity:Conversion:<C>` (C1 D2). There are three labelled FX measures (C1 D9). (a) **Conversion cost vs reference** (C1.5) is a spread measure, shown only for a confirmed match whose residual test passed (C1-I13). (b) **Translation effect** (C5.3) is presentation only. (c) **Realised currency gain in NGN** comes from the weighted-average pool (C1.6) and is the only FX figure the Tax engine receives. Period-end revaluation is a view keyed by rate-set version, so changing the headline base currency rewrites nothing. The reference rate is dated at `conversion_on` (C1.5): the provider's printed conversion time if there is one, otherwise the value date of the debit leg. A non-business day takes the latest earlier fixing (C5.2). A parallel-market series may appear only as a labelled sensitivity line with confidence D (C5.1).

**Confidence and review states.** C4 governs. It sets the four bands (very high ≥ 0.98; high ≥ 0.90; medium ≥ 0.70; low), the producer order and the five-condition auto-apply rule. That rule requires the producer not to be a model, a Wilson lower bound ≥ 0.90 over ≥ 30 confirmations, no tax or legal weight, and, for cross-currency matches, a shared reference plus a passed residual test. Confidence applies only to inferences. Amounts and dates are statement facts.

**Reversals and corrections** follow C1.7. A bank reversal is its own entry with `reverses_line_id`; the pair is netted in spending views. Our errors are corrected by a `void` plus a `replacement`. A change that alters nature (for example, spend → loan to a relative) is a correction entry. A change that alters only grouping is a new classification version.

### 4.3 Transaction intelligence

#### 4.3.1 Income detection

**Typed credit taxonomy.** Every credit is classified into one class. Each class carries a ledger nature and a tax-relevance flag. Tax sees every class.

| Credit class | Ledger nature | Tax relevance | Typical evidence |
|---|---|---|---|
| Salary / wages | `Income:Employment` | yes | payroll narration, WPS, payslip |
| Business or contractor revenue | `Income:Business` | yes | recurring client, invoice |
| POS-agent or merchant turnover (mixed account) | business sub-ledger (revenue and float), outside personal income | yes (Tax owns) | Moniepoint agent account declared by user |
| Dividend, interest, rental | `Income:Dividend` / `Interest` / `Rental` | yes | broker section, bank interest line |
| Refund or reversal | negative `Expenses:Consumption` with `reverses_line_id` | no | REVERSAL/REFUND line |
| Own transfer | in-transit or exchange (§4.3.2) | no, once confirmed | matched counter-leg |
| Gift received | `Income:Gift` | yes (Tax decides) | user statement |
| Loan received / loan repaid to the user | `Liabilities:Loans:<Person>` / `Assets:Receivable:Loans:<Person>` | yes (evidence of the loan) | user statement, agreement |
| Reimbursement (e.g., a shared bill) | reduces `Assets:Receivable` or consumption | no | link to the original spend |
| Sale of a personal asset; P2P crypto sale proceeds | disposal of an asset | yes (disposal, not income) | user statement, platform record |
| **Unknown** | `Suspense:Unmatched:<account>` | **counted as "unexplained inflows"** | none yet |

**An unknown credit is never defaulted to a transfer.** v0.1's `TRANSFER_IN:OTHER` default understated income, which is the dangerous direction under worldwide taxation (Doc 6 F21). Unknown credits now accumulate in a visible **unexplained inflows** total that the Tax department sees (C4). The first classification of a credit as income, gift, loan or disposal is tax-weighted and always goes to review (C4 condition 4).

**Methods.** Deterministic rules come first and statistical suggestions second.

1. **Salary stream.** A stream needs ≥3 occurrences (Plaid's maturity threshold, F10). Each must fall within ±3 **business** days of a business-day-adjusted anchor on the payer's calendar (NG, AE or US). The window widens to −10 business days in December and before Eid al-Fitr and Eid al-Adha, when early payment is common. Amounts must be within ±15% of the stream median, and the payer must not be an own account. All of these thresholds are **E5** (to be calibrated on confirmed history). Narration cues `SALARY`, `SAL` and `PAYROLL` are matched as whole tokens, and the employer name is matched where printed. NIP sender names are often truncated, so counterparty memory is keyed on the payer's account-identifier HMAC where printed, not on the name (E4). A "WPS" narration cue is **E4/E5**: no source documents it, since WPS is a file channel [S38].
2. **Pay period vs cash date.** Each income line carries `pay_period` separately from its value date. WPS allows payment up to the 1st of the following month, so a calendar month may hold zero or two AED salaries (F9). Cash-basis and pay-period-basis savings rates are both available (§4.4.3). *Note for contract owners:* C1.3's `classification` has no `pay_period` field. Until it does, the attribute lives on `income_stream` and on the income classification row (§11).
3. **Interest cue.** `INT` matches only as a whole token on interest-shaped lines (credit from the account's own bank, period-end, small), never inside INTERNET, INTL or INTER-BANK. Dividends and interest from brokers come from statement sections, not narration.
4. **Confidence.** The v0.1 values (0.95 with an employer cue, 0.80 on periodicity alone) are **provisional rule outputs (E5)**. A rule is applied without review only under C4.
5. **Outputs.** An `income_stream` object (payer, currency, frequency, median, last date, next date, variance, pay-period rule) feeds forecasting (§4.4.6) and Tax (source country, payer, currency).
6. **Validation.** Precision and recall are measured on the founder's confirmed history. A salary stream feeds forecasts only once its rule's Wilson lower bound on precision is ≥ 0.95 (E5).

#### 4.3.2 Transfer matching between own accounts

**Candidate generation (blocking).** A candidate is a debit D in account X and a credit C in account Y, where both accounts are owned.

| Test | Same-currency | Cross-currency |
|---|---|---|
| Amount | \|C\| = \|D\| exactly, or \|D\| − \|C\| equals a known fee in X | Comparison level from C1.5: cost vs reference inside the pair's one-sided band, near it, or far from it. This is a **comparison field, not an acceptance tolerance**; the v0.1 ±6% band is withdrawn (C1.5 item 4) |
| Date window (E5) | value_on(C) ∈ [value_on(D) − 1, value_on(D) + 3] business days on the receiving account's calendar (NIP near-instant; IMTO 0–2 days) | [−1, +5] business days (settlement T+2 is common). A credit before the debit is allowed for fintech pre-funding |
| Evidence | Shared bank reference or NIP session ID; the user's name or X's institution in C's narration; Y named in D | Same, plus provider IDs (Wise, IMTO) and a provider receipt |

**Fellegi–Sunter specification** [S79, S94, S95]:

- **Comparison vector** γ per candidate pair. It has five fields: amount level; date-gap level (0, 1, 2, 3–5 business days); shared reference (equal / absent / conflicting); counterparty evidence (none / name / institution / own-account identifier HMAC); and rail compatibility (e.g., SWIFT → NIP via IMTO, NIP → wire via FX provider).
- **Dependence.** For cross-currency pairs, amount and date are not conditionally independent, because the reference rate moves with the date. They are therefore combined into **one joint field**: cost vs reference computed at the debit date. They are not entered as two independent fields.
- **m and u probabilities** are estimated **per stratum** by EM on unlabelled candidate pairs (Jaro 1989; fastLink) and checked against confirmed and rejected matches.
- **Weight and probability.** The weight is w = Σ log(m/u). The confidence passed to C4 is a **calibrated posterior** p per stratum (isotonic or logistic calibration on confirmed and rejected matches), not w (C4 calibration).
- **Global one-to-one assignment.** Within each block, a maximum-weight bipartite assignment (Hungarian algorithm) runs over pairs above the lower threshold. Pairwise scores alone are not enough. Split transfers (one debit, several credits) use a separate many-to-one search limited to k ≤ 3 credits with an exact sum.
- **Strata for labelled data.** NIP same-bank; NIP inter-bank; IMTO AED→NGN; NGN→USD via an FX provider; Wise intra-jar; card top-ups; savings-app sweeps (PiggyVest, OWealth).
- **Hard negatives.** Same-amount third-party credits, family remittances, refunds, round-amount salary credits and dividend sweeps.
- **Thresholds are provisional (E5).** At the founder's volume (about one cross-currency transfer a month), a cross-currency stratum would take years to reach C4's 30 confirmations. Those matches therefore stay in review (C4 open question 2). Synthetic augmentation is used to test the matcher, never to satisfy the Wilson condition.

**Routing and posting.** A match is applied without review only if all five C4 conditions hold. Otherwise its status is `proposed` and it is queued. Once confirmed, it posts as follows (C1 D2, D8):

- The debit leg posts to `Assets:InTransit:<id>`.
- For a same-currency transfer, the credit leg clears the in-transit balance.
- For a cross-currency transfer, the credit leg is an `exchange` entry through `Equity:Conversion:<C>`.
- Fees, VAT and levies are their own postings. **No residual is posted.**

The conversion cost is then computed per C1.5. If the provider receipt prints a dealer rate q, the test is |G − R·q| ≤ q·½ minor unit of R + ½ minor unit of G (rounding only); otherwise the difference is an **unexplained difference**, not spread. Without q, the cost must fall inside the pair's one-sided band (E5: NGN→USD/AED [−1%, +4%]; AED↔USD [0%, +1.5%]; USD/AED→NGN via an IMTO [−3%, +4%]). Until confirmation, both legs stay in in-transit or `Suspense:FXUnexplained:<C>`, no conversion cost appears in any total, and an unexplained credit counts toward unexplained inflows. A chain through a non-owned provider (A1 → FX provider → A3) is one exchange. The provider is a counterparty, and its receipt is evidence.

**Investment contributions** (bank → brokerage or savings platform) are transfers under this logic. The subsequent *purchase* inside the brokerage is a separate `trade` entry (cash → lot at cost including commission). Neither appears in spending; both appear in a "contributions" view.

Edge cases (E5, to be tested): one debit split into several credits (Wise multi-currency); credits arriving before the debit's value date (fintech pre-funding); transfers to a third party with the user's own name in the narration (false positives, so Y must be an owned account); Aani payments to a mobile-number proxy that may be the user's own Wio or Liv account (always `needs_review`); and reversed transfers.

#### 4.3.3 Investment contributions are not spending

Rule: any posting whose destination account is under `Assets:Savings`, `Assets:Brokerage`, `Assets:Pension` or `Liabilities` (debt repayment) is excluded from spending and income aggregates and reported under *Saving & investing flows*. Only fees, levies and withholding taxes attached to these flows are expenses. Commissions on security purchases are capitalised into lot cost (C1.6) and show as a fall in market value in the net-worth decomposition (§4.6). Conversion cost is a derived measure (C1.5), not an expense posting. This matches Plaid's `TRANSFER_OUT:INVESTMENT_AND_RETIREMENT_FUNDS` and `LOAN_PAYMENTS` separation [F10] and Actual Budget's off-budget treatment [S54].

#### 4.3.4 Duplicate detection, re-import and account identity

C1.8 governs. The layers are:

1. **Document.** An identical SHA-256 is rejected as already held.
2. **Line key.** The key is (account_id, bank_ref) where a unique reference exists: bank reference, NIP session ID, Wise ID or IBKR trade ID. Otherwise it is (account_id, value_on, signed_amount, ordinal), where the ordinal ranks same-date, same-amount lines in printed order. **Narration and running balance are not in the key**; they are soft features for aligning overlaps. The v0.1 `line_hash` included both and failed on re-exports (golden test in §4.6).
3. **Overlaps** are resolved at the **last common row**, not at a date. Trailing lines missing from an export taken earlier in the day (e.g., 31 Oct month-end charges) are not deletions.
4. **Fuzzy possible-duplicate flags** require the same account, an equal amount, a gap of ≤2 days and similar narrations (E5). System charge lines (transfer fee, VAT, stamp duty, SMS, CAMF) are **excluded** and anchored to their parent transaction, so a ₦50 / ₦3.75 / ₦50 triple belongs to its NIP debit. Same-day airtime purchases are flagged only if neither a printed time nor a reference distinguishes them. Flags never delete.
5. **Bank-side double debit.** Both debits post as real lines (`Expenses:Consumption`), and the second is flagged as a possible bank duplicate. If the reversal arrives, it is its own entry with `reverses_line_id`, and the pair is netted in spending views. If no reversal arrives within 10 business days and the user confirms the duplicate, a `reclass` entry moves it to `Assets:Receivable:BankDispute:<bank>` with an age and a dispute workflow. It is not left in suspense (C1-I7).
6. **Re-parse.** A new parser version's extraction is diffed against existing postings. Each difference becomes a void plus replacement with the reason "parser upgrade".

**Account identity (C1.8).** An uploaded file is resolved to an account by an exact match on the HMAC of the normalised full identifier (NUBAN, IBAN, broker account). A masked fragment (last-4 vs first-3; IBAN vs NUBAN) only creates a **candidate**, which the user confirms on first sight. A Wise multi-currency file resolves to one account per commodity column. Merges are journaled `account_merge` events that create aliases; postings are never rewritten. At most one account exists per (institution, identifier HMAC, commodity) (C1-I11).

#### 4.3.5 Categorisation taxonomy

Categories are `classification` rows (C1 D4). Each leaf maps to **exactly one** Plaid PFC v2 detailed code. The CSV was re-downloaded and parsed on 2026-11-04: 18 primary and 127 detailed codes [S51]. Comparability is claimed only at leaf level. Payment **rails** (POS, USSD, NIP, Aani, WPS, UAEFTS, SWIFT, card) are channels, not categories. They live in `source_line.rail` (C1.3), the equivalent of Plaid's `payment_channel`, so one line can drive both its category and the fee audit. Each leaf also carries `levy_type`, `is_tax` and `is_essential`.

| Group (presentation) | Leaf | Plaid PFC v2 detailed | Posting nature | levy_type / is_tax |
|---|---|---|---|---|
| Housing & utilities | rent (annual or quarterly instalments flagged) | RENT_AND_UTILITIES_RENT | Consumption | — |
| | electricity (EKEDC, IKEDC; DEWA combined bill) | RENT_AND_UTILITIES_GAS_AND_ELECTRICITY | Consumption | — |
| | water | RENT_AND_UTILITIES_WATER | Consumption | — |
| | generator fuel/diesel; estate levy; service charge | RENT_AND_UTILITIES_OTHER_UTILITIES (nearest) | Consumption | — |
| Telecoms | airtime and mobile data (incl. USSD session charges, which telcos bill) | **RENT_AND_UTILITIES_TELEPHONE** | Consumption | — |
| | home internet | RENT_AND_UTILITIES_INTERNET_AND_CABLE | Consumption | — |
| Subscriptions | streaming | ENTERTAINMENT_TV_AND_MOVIES | Consumption | — |
| Food | groceries, market purchases | FOOD_AND_DRINK_GROCERIES | Consumption | — |
| | restaurant, shared bill | FOOD_AND_DRINK_RESTAURANT | Consumption | — |
| Transport | vehicle fuel | TRANSPORTATION_GAS | Consumption | — |
| | ride-hailing | TRANSPORTATION_TAXIS_AND_RIDE_SHARES | Consumption | — |
| | Salik, tolls | TRANSPORTATION_TOLLS | Consumption | — |
| Travel | flights | TRAVEL_FLIGHTS | Consumption | — |
| Health | HMO premium | GENERAL_SERVICES_INSURANCE | Consumption | — |
| | pharmacy | MEDICAL_PHARMACIES_AND_SUPPLEMENTS | Consumption | — |
| | hospital | MEDICAL_OTHER_MEDICAL | Consumption | — |
| Education | school fees | GENERAL_SERVICES_EDUCATION | Consumption | — |
| Giving & family | religious or charitable giving | GOVERNMENT_AND_NON_PROFIT_DONATIONS | Consumption | — |
| | remittance to a family member (not an own account) | **TRANSFER_OUT_OTHER_TRANSFER_OUT** | TransferOut:Family | — |
| Government, taxes & levies | visa, Emirates ID, passport fees | GOVERNMENT_AND_NON_PROFIT_GOVERNMENT_DEPARTMENTS_AND_AGENCIES | Consumption | — |
| | PAYE (manual), withholding tax, foreign WHT | GOVERNMENT_AND_NON_PROFIT_TAX_PAYMENT | Tax | wht / true |
| | **stamp duty (NTA 2025); legacy EMTL** | **GOVERNMENT_AND_NON_PROFIT_TAX_PAYMENT** | **Levy** | stamp_duty, emtl / true |
| Bank charges | NIP/transfer fee, SMS alert, CAMF, card fee, account fee | BANK_FEES_OTHER_BANK_FEES | BankCharge | — |
| | ATM fee | BANK_FEES_ATM_FEES | BankCharge | — |
| | VAT on a bank fee (follows its fee for Plaid; separate for Tax) | BANK_FEES_OTHER_BANK_FEES | Tax | vat / true |
| | FX conversion cost vs reference (derived measure, not a posting) | nearest: BANK_FEES_FOREIGN_TRANSACTION_FEES (comparison only) | — | — |
| Debt service | loan repayment (principal → liability; interest → `Expenses:Interest`) | LOAN_PAYMENTS_PERSONAL_LOAN_PAYMENT (Plaid does not split) | Interest / transfer | — |
| Transfers & investing (excluded from spending) | own-account transfer | TRANSFER_OUT_ACCOUNT_TRANSFER / TRANSFER_IN_ACCOUNT_TRANSFER | InTransit / exchange | — |
| | savings or brokerage contribution | TRANSFER_OUT_SAVINGS / TRANSFER_OUT_INVESTMENT_AND_RETIREMENT_FUNDS | InTransit | — |

Shopping, personal care and the remaining Plaid primaries map leaf by leaf in the same way; the full table is a build artefact, versioned with the rules. Categories are user-editable. An edit is a new classification version, never a posting rewrite.

#### 4.3.6 Rules engine with human confirmation

Producers in order of precedence (C4): (1) `statement_structure` (broker sections, fee lines printed separately); (2) `deterministic_rule` (narration rules per institution, versioned, with Wilson-bounded precision); (3) `counterparty_memory` (what the user confirmed for this counterparty before); (4) `model` (statistical or LLM suggestion with confidence and evidence). A model suggestion always goes to review and may never change amounts or dates. Every automatic classification is reversible and badged. The review queue puts tax-weighted items first, then orders by NGN materiality × (1 − p) (C4). Rules whose trailing-100 precision falls below 0.90 are demoted to suggestions. Bulk accept is allowed only for very-high items that share one reason and carry no tax weight.

#### 4.3.7 Reconciliation controls

The statement checks prove **completeness relative to the document**. They do not prove that classification, matching, dates or the document itself are right. The ledger assertion is circular when the bank leg comes only from that same statement. Independent controls are therefore added.

**Completeness controls**

| Control | Check | On failure |
|---|---|---|
| Statement identity | opening + Σcredits − Σdebits = closing (tolerance 0.00) | **Quarantine** with a named `UNEXPLAINED_DIFFERENCE`: amount, first row where the running balance breaks, age, owner. Data are kept as `candidate` (C3) |
| Row chaining | running_balance(i) = running_balance(i−1) − debit(i) + credit(i), where printed | As above. OPay: `reconciled_with_exception` only when each break is explained by an inferred OWealth movement (§4.1) |
| Printed totals | Σdebits = "Total Money Out", Σcredits = "Total Money In", where printed (Zenith prints none, F4) | Quarantine |
| Continuity | closing(n) = opening(n+1); a gap of > 1 day raises a `gap` review item | Period marked *incomplete*; aggregates badged |
| Ledger assertion | Balance at the **start of the day after** period_end equals the statement closing (Beancount semantics: assertions apply at the start of their date, F11) | `Equity:Adjustments:Reconciliation` only with user approval and a reason |
| Suspense and in-transit | C1-I6, C1-I7 | Close blocked; in-transit older than 10 business days → review |
| Investment | Units per position = Σ trades and match the broker's position section; cash matches the broker cash report | Differences itemised (corporate actions, fees) |

**Independent controls (R04 B4)**

| Control | Check | Catches |
|---|---|---|
| Counter-leg confirmation | Each transfer leg is confirmed by the other account's statement or a provider receipt; otherwise it stays in transit | False-positive matches |
| Date-format plausibility | The format (DD/MM vs MM/DD) is inferred per file from the share of dates inside the printed period. A file whose day values are all ≤ 12 is ambiguous and quarantined for the user. Other checks: value_on ≥ booked date; no future dates; no NIP salary on a bank holiday | Day/month swaps that leave totals intact but move FX dates, periods, the stamp-duty boundary (1 Jan 2026) and the tax year |
| Regime boundaries | Lines within 3 days of 1 Jan 2026 (stamp duty), 1 May 2026 (Guide to Charges) or a tax-year end are flagged for a date re-check | Wrong-regime charges |
| Adjacent-pair test | Debit–reversal pairs are listed. Where printed totals are absent, a dropped pair is not detectable; the statement is badged "pair drop not testable" and given priority in the trace sample | Dropped debit + reversal |
| Tamper signals | `bankstract inspect()` signals are stored as evidence; never treated as a forgery verdict | Edited PDFs (not a regenerated forgery) |
| Trace to source | Each quarter, a sample of postings (1 in 20, per the C3.3 sampling rule) is traced to page and bounding box (Doc 6 §4.1) | Parser drift |
| Inference quality | Quarterly calibration per C4 | Classification drift |

**Time zones and calendars (C1.7).** Each account has a time zone (WAT UTC+1, GST UTC+4, US/Eastern for IBKR). Business days are counted on a named calendar (Nigeria, UAE or US). Allocation to a period uses the **value date** in the account's time zone, and booking-date versus value-date differences are listed at close.

### 4.4 Cash-flow and planning intelligence

#### 4.4.1 Budgets
The system offers three budget *views* over the same ledger — category envelopes (allocation per category, with the carry-over behaviour the user chooses), zero-based (every unit of expected income assigned), and percentage guides (needs/wants/saving) — and measures the same outcomes for each: adherence (actual ÷ planned by category), spending volatility, and the savings rate. It states the evidence honestly (F13): envelope/partitioning has field-experiment support; zero-based has none we could find; percentage rules are heuristics. Whether a budget view improves outcomes for *this* user is an experiment the Behavioural department designs (eight-question test), not an assumption.

#### 4.4.2 Emergency fund and liquidity
Metrics (all from the ledger, definitions printed on screen): essential monthly spend (trailing 6-month median of `is_essential` categories, per currency and in base currency); liquid assets (cash, current/savings accounts, e-money, money-market balances; *not* pensions, *not* volatile securities); **months covered = liquid assets ÷ essential monthly spend**; and a stress variant using the parallel-market rate for NGN liquidity held against AED/USD obligations. The stress variant is labelled **indicative (confidence D)** until a documented parallel series exists (§7 item 7; C5.1). The target is a user input with a suggested range (3–6 months) labelled as convention, plus two evidence anchors: "could you raise the equivalent of $2,000 within 30 days from liquid assets?" (Lusardi et al.) and "$400 unexpected expense" (Federal Reserve) [F15].

#### 4.4.3 Savings-rate measurement
Savings rate = net saving ÷ income. Net saving is income − spending − bank charges − levies and taxes paid from the accounts − investing costs − conversion cost vs reference. Each flow is valued at its transaction-date reference rate, which equals C5.3's net external flows plus conversion cost. It is computed per month and trailing 12 months, on two bases:

- a **cash basis** (value date), always available;
- a **pay-period basis** using `pay_period` (§4.3.1), where known. Under WPS an AED salary for month m may arrive on the 1st of m+1, so the cash basis can show zero or two salaries in one month.

Transfers and investment contributions are excluded from spending (§4.3.3) and shown separately as "of which invested". Gross versus net income is a stated choice; payslip data, where available, allow the gross basis. The OECD-style definition is reported alongside so the number is comparable (F19). A period containing unconfirmed matches or quarantined statements is badged *incomplete*.

#### 4.4.4 Risk capacity, tolerance and need
Captured separately (F16): **capacity** is computed (months covered, income stability from §4.3.1, horizon of each goal, share of net worth in volatile assets, liabilities); **tolerance** is measured with a validated questionnaire (Grable–Lytton 13-item, licensed/attributed) and re-measured annually; **need** is derived by the Goal Reality Engine (required return for each goal). The system shows the three side by side and flags conflicts (e.g., need > tolerance) as a decision for the user, never as a recommendation to take more risk.

#### 4.4.5 Credit and liabilities
Liabilities are ledger accounts with interest, fees and principal split per statement; the system computes debt-service ratio (debt service ÷ income) and total liabilities ÷ liquid assets. Credit-bureau reports (CRC/CreditRegistry/FirstCentral; Etihad Credit Bureau) are *user-uploaded documents* (F18) parsed for open facilities and enquiries, cross-checked against the liabilities ledger; the system never pulls bureau data itself. Repayment guidance, when liabilities exist, uses the evidence on balance-matching (F18) and presents the interest cost of alternatives as ranges.

#### 4.4.6 Cash-flow forecasting
Two methods, both reproducible from stored inputs: (a) **recurring-pattern projection** — income streams and recurring outflows (rent instalments, subscriptions, school fees, annual rent due dates) projected on their detected cadence with a ± band from historical variance, anchored on paycheque dates (F14); (b) **scenario overlays** — user-defined shocks (income stops for n months, NGN depreciates x%, rent increases y%) applied to (a). No stochastic forecasting of spending at MVP; the Forecasting department owns long-horizon models.

#### 4.4.7 Net-worth statement across currencies
**C5 governs.** Two views are shown by default: USD (a stable numeraire for a person with AED and USD assets; AED is pegged) and NGN (the currency of most spending). The user chooses the headline. Each holding is valued at the closing fixing under C5.2: the last fixing on or before the month's last calendar day, which for October 2026 is Friday 30 October. Securities use validated prices and pensions the latest statement value with its as-of date. Liabilities translate the same way. The change in net worth splits **exactly** (with Fraction arithmetic) into four parts: net external flows at transaction-date rates; conversion cost vs reference; market; and FX translation per commodity. The translation term covers **intra-period flows as well as opening balances** (C5.3), which v0.1 omitted (R04 W10). Display rounding is its own line. A render-time sign check withholds any FX figure whose sign contradicts the rate move for a currency held long throughout a monotone move. A secondary line may value NGN assets at a parallel rate as a sensitivity, labelled with confidence D, never as the headline.

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

1. **Native first.** Every amount is stored and displayed in its native commodity with its ISO code. A converted figure is secondary and always carries the rate, its field, the source and the fixing and applied dates. For example: "≈ $2,874.74 at CBN central ₦1,356.00/$ (fixing Fri 30 Oct 2026, applied 31 Oct)" (synthetic rate).
2. **One reference series per pair, named (C5.1).** For NGN this is the CBN NFEM **central** rate, stored with `price_type` and `fixing_date`. FMDQ closing is a corroboration check only. The parallel market is an indicative sensitivity line, confidence D, never in totals and never blended. For AED it is the CBUAE peg of 3.6725, registered as a reference fact with a source and a deviation check (C3.5), not a code constant. AED/NGN is the exact cross (NGN/USD) ÷ (AED/USD).
3. **Spread is a measured, labelled figure, not a plug (C1.5).** "Cost of converting vs CBN central rate (date)" is shown only for confirmed matches that pass the residual rule. Where a receipt prints a dealer rate, the provider's markup is shown and any remainder is labelled **unexplained difference**.
4. **Translation effects are labelled (C5.3).** Net-worth changes separate flows, conversion cost, market and FX translation per currency, and the sign check runs at render time. A user whose NGN balance "grew" in NGN but shrank in USD sees both views.
5. **Inflation is a distinct lens.** Real-terms views use the rebased NBS CPI (2024 = 100) and state the base. The data layer disallows comparisons with the old series (F6).
6. **No silent defaults (C5.2).** A non-business day takes the latest earlier fixing, and both `fixing_date` and `applied_date` are stored. A fixing more than 2 business days old makes the converted figure `stale` (badged). More than 10 business days old makes it `expired`: the amount is shown unconverted with "rate missing", and the aggregate is marked incomplete.
7. **Precision and rounding (C1 D6, D7, C1.7).** Amounts are decimal strings with a scale per commodity, stored as NUMERIC(38,18) with a scale check. Rates are stored exactly as published, in the published direction. An inverse is computed to at least 28 significant digits and rounded **once**, half-even, at the final amount. Truncation is forbidden: 1/1,352 truncated to 4 dp gives a −5.36% error (C1.9). Bank-printed amounts are never re-rounded.
8. **Status display (C3.4).** Amounts from a `reconciled` statement are `auto_validated`, those from a quarantined statement are `candidate` (never in totals), and aggregates carry `complete | incomplete`.

### 4.6 Worked example (synthetic data, October 2026)

All figures are synthetic and are reproduced verbatim by `research/scripts/doc04_ledger_worked_example.py` (`python3 -I`, standard library, `Decimal`/`Fraction`). The v0.1 example has been re-run under C1, C4 and C5. Its arithmetic was correct (R04 §2.0); its accounting was not.

**Reference rates (synthetic CBN central, NGN per USD; Nigerian business days only; 1 Oct is Independence Day).** Anchors: 30 Sep 1,329.00; 16 Oct 1,350.00; 20 Oct 1,352.00; 30 Oct 1,356.00, with linear interpolation by business day between them (full table in the script output). A non-business day takes the latest earlier fixing (C5.2):

| Applied date | Fixing used | Rate |
|---|---|---:|
| Thu 1 Oct (holiday) | Wed 30 Sep | 1,329.00 |
| Sat 3 Oct | Fri 2 Oct | 1,330.91 |
| **Sun 18 Oct** (T1 conversion) | **Fri 16 Oct** | 1,350.00 |
| Tue 20 Oct (T2 conversion) | Tue 20 Oct | 1,352.00 |
| Sun 25 Oct | Fri 23 Oct | 1,353.50 |
| **Sat 31 Oct** (month-end) | **Fri 30 Oct** | 1,356.00 |

These synthetic values replace v0.1's "₦1,346.91 on 31 Oct". That figure was a real **sell** rate for 29 Oct presented as a weighted average and as a 31 Oct (Saturday) rate (R04 W1, W2). AED/USD is the peg, 3.6725. There are three accounts: **A1**, an NGN current account (opening ₦1,250,000.00); **A2**, an AED current account (opening AED 18,400.00); and **A3**, a USD brokerage account (opening cash $2,150.00; 12 ETF units at cost $240, price $250 on 30 Sep). There are no liabilities.

**A1 — NGN current account, as imported**

| Date | Narration (as printed) | Debit ₦ | Credit ₦ | Balance ₦ | Rail | Posting (nature) · classification · status |
|---|---|---:|---:|---:|---|---|
| 03 Oct | POS/WEB PURCHASE TRANSACTION SHOPRITE LEKKI | 48,500.00 | | 1,201,500.00 | POS | Consumption · groceries |
| 05 Oct | NIP/ZEN/ADEBAYO LANDLORD/RENT OCT | 400,000.00 | | 801,500.00 | NIP | Consumption · rent |
| 05 Oct | NIP TRANSFER FEE | 50.00 | | 801,450.00 | NIP | BankCharge · transfer_fee (anchored to the rent debit) |
| 05 Oct | VAT ON NIP FEE | 3.75 | | 801,446.25 | NIP | Tax · vat_on_fee |
| 05 Oct | STAMP DUTY (NTA 2025) | 50.00 | | 801,396.25 | NIP | Levy · stamp_duty |
| 10 Oct | USSD AIRTIME TOPUP 0803XXXXXXX | 5,000.00 | | 796,396.25 | USSD | Consumption · telephone |
| 12 Oct | POS PURCHASE TOTAL ENERGIES IKOYI 12/10 09:41 | 27,300.00 | | 769,096.25 | POS | Consumption · fuel |
| 12 Oct | POS PURCHASE TOTAL ENERGIES IKOYI 12/10 09:42 | 27,300.00 | | 741,796.25 | POS | Consumption · fuel · **flagged: possible bank duplicate** (review) |
| 14 Oct | REVERSAL OF POS TXN 12/10 TOTAL ENERGIES | | 27,300.00 | 769,096.25 | POS | Consumption (−) · `reverses_line_id` = 09:42 line; pair netted |
| 19 Oct | NIP/IMTO PARTNER/REMITTANCE REF AE7781 | | 1,780,000.00 | 2,549,096.25 | NIP | Credit leg of **T1**: `Suspense:FXUnexplained:NGN` until confirmed, then an exchange |
| 20 Oct | NIP/FX PROVIDER LTD/USD 715.00 FOR BROKERAGE FUNDING | 1,000,000.00 | | 1,549,096.25 | NIP | `Assets:InTransit:T2` · match **T2** proposed |
| 20 Oct | NIP TRANSFER FEE / VAT / STAMP DUTY | 50.00 + 3.75 + 50.00 | | 1,548,992.50 | NIP | BankCharge, Tax, Levy |
| 26 Oct | SALARY OCT 2026 ACME NIGERIA LTD | | 2,350,000.00 | 3,898,992.50 | NIP | Income:Employment:NG:ACME · pay_period 2026-10 · first classification tax-weighted → review |
| 31 Oct | SMS ALERT CHARGES 12 @ N4 + VAT | 48.00 + 3.60 | | 3,898,940.90 | SYS | BankCharge, Tax |
| 31 Oct | ACCOUNT MAINTENANCE FEE (₦0.5/mille) + VAT | 740.40 + 55.53 | | 3,898,144.97 | SYS | BankCharge · camf, Tax |

v0.1 called the 20 Oct debit "FX PURCHASE" and charged it a NIP fee, which is inconsistent: a bank FX sale would be a SWIFT or FX-desk transaction (R04 W5). The synthetic narration is now an NIP transfer to a non-owned FX provider that wires USD to A3. The chain A1 → provider → A3 is one exchange (§4.3.2), and the NIP fee and stamp duty apply to the NIP leg.

Reconciliation A1: 1,250,000.00 + 4,157,300.00 − 1,509,155.03 = **3,898,144.97** = printed closing → `reconciled`. This is a completeness check only (§4.3.7).

*CAMF audit.* ₦0.5 per mille is a **cap**, so the test is charged ≤ cap. Which debits count as the base is not sourced (the 2026 Guide PDF was not retrieved):

| Base reading | Base ₦ | Cap, half-even | Cap, truncated | 740.40 ≤ cap |
|---|---:|---:|---:|---|
| Gross customer-induced debits (POS, NIP, USSD, incl. the duplicate) | 1,508,100.00 | 754.05 | 754.05 | yes |
| Net of the reversed duplicate | 1,480,800.00 | 740.40 | 740.40 | yes |

VAT 7.5% on ₦740.40 = ₦55.53 (printed 55.53). No alert is raised under either reading. The base definition and the bank's rounding mode are open items for Tax (§7).

*Stamp-duty scope audit* (Ninth Schedule item 48 per Doc 6 F21; ₦50, sender pays, ≥ ₦10,000): the NIP debits of ₦400,000 and ₦1,000,000 are in scope and charged. The USSD airtime purchase of ₦5,000 is below the threshold. The **POS/card payments** (₦48,500 and ₦27,300 × 2) carry no duty on this statement. Whether they are in scope is **unconfirmed**, so they are flagged for the practitioner and raise no alert. Credits (salary, remittance) carry no duty because the sender pays, not because of an exemption (R04 W8).

**A2 — AED current account**

| Date | Narration | Debit AED | Credit AED | Balance AED | Rail | Posting · classification · status |
|---|---|---:|---:|---:|---|---|
| 01 Oct | WPS SALARY SEP 2026 GULF EMPLOYER LLC | | 22,000.00 | 40,400.00 | WPS | Income:Employment:AE · **pay_period 2026-09** |
| 02 Oct | STANDING ORDER RENT INSTALMENT | 9,000.00 | | 31,400.00 | SO | Consumption · rent |
| 06 Oct | POS CARREFOUR MOE | 612.35 | | 30,787.65 | POS | Consumption · groceries |
| 09 Oct | DEWA BILL PAYMENT | 540.00 | | 30,247.65 | BILL | Consumption · electricity (DEWA combined) |
| 12 Oct | AANI TRANSFER TO +9715XXXXXXX | 250.00 | | 29,997.65 | AANI | `Suspense:Unmatched:A2` (the proxy may be the user's own Wio or Liv account) → user confirms a friend's shared bill → `reclass` to Consumption · restaurant |
| 18 Oct | OUTWARD REMITTANCE NGN BENEF SELF REF AE7781 | 5,000.00 | | 24,997.65 | SWIFT | `Assets:InTransit:T1` |
| 18 Oct | REMITTANCE FEE + VAT 5% | 15.00 + 0.75 | | 24,981.90 | SWIFT | BankCharge, Tax |
| 25 Oct | ACCOUNT FEE + VAT 5% | 25.00 + 1.25 | | 24,955.65 | SYS | BankCharge, Tax |
| 28 Oct | POS RESTAURANT JBR | 180.00 | | 24,775.65 | POS | Consumption · restaurant |

Reconciliation A2: 18,400.00 + 22,000.00 − 15,624.35 = **24,775.65** → `reconciled`.

**A3 — USD brokerage (cash section)**

| Date | Line | Debit $ | Credit $ | Cash $ | Posting |
|---|---|---:|---:|---:|---|
| 22 Oct | DEPOSIT (wire from FX provider) ref NG-5520 | | 715.00 | 2,865.00 | Credit leg of **T2** (exchange once confirmed) |
| 23 Oct | BUY 2.8 ETF @ 250.00 | 700.00 | | 2,165.00 | One `trade` entry: cash −701.00; ETF lot +2.8 units, `cost_total` **USD 701.00 including commission** (C1.6; R04 W11) |
| 23 Oct | COMMISSION | 1.00 | | 2,164.00 | (part of the trade entry above) |
| 30 Oct | DIVIDEND ETF 12 × 0.80 (gross) | | 9.60 | 2,173.60 | Income:Dividend (US source) |
| 30 Oct | WITHHOLDING TAX 30% | 2.88 | | 2,170.72 | Tax · foreign_wht |

Positions: 12 → 14.8 units; price $250.00 → $257.50; market value $3,000.00 → $3,811.00.

**Journal checks.** All 35 entries balance per commodity, exactly (C1-I1). Ledger assertions at the start of 1 November equal every statement closing. Both in-transit accounts are zero after confirmation, and suspense is zero at close. Conversion accounts hold AED +5,000.00, NGN −780,000.00 (−1,780,000 + 1,000,000) and USD −715.00. In the script the confirmed exchanges are written directly. In production the 19 Oct and 22 Oct credits first post against `Suspense:FXUnexplained:<C>`, and a `reclass` on confirmation moves them into the exchange; the balances are the same.

**Transfer matches (C1.5 and C4)**

| Match | Legs | conversion_on → fixing | Implied vs reference | Cost vs reference | Rule applied | Routing |
|---|---|---|---|---|---|---|
| T1 | A2 −AED 5,000.00 (Sun 18 Oct) → A1 +₦1,780,000.00 (Mon 19 Oct); shared ref AE7781 | 18 Oct (no provider time; debit value date) → Fri 16 Oct, ₦1,350.00/$ | ₦356.00/AED vs ₦367.597…/AED (1,350.00 ÷ 3.6725, exact) | AED 157.74 = ₦57,985.02 (**3.15%**); explicit fee AED 15.75 separate | No dealer rate printed → band AED→NGN via IMTO [−3%, +4%]: within | Review: cross-currency stratum has 0 confirmations (provisional), and classifying a credit as not-income is tax-weighted. User confirms → exchange entry |
| T2 | A1 −₦1,000,000.00 (Tue 20 Oct) → provider → A3 +$715.00 (Thu 22 Oct); no shared ref | 20 Oct (provider receipt timestamp) → 20 Oct, ₦1,352.00/$ | ₦1,398.601…/$ vs ₦1,352.00/$ | ₦33,320.00 (**3.33%**); NIP fee/VAT/stamp ₦103.75 separate | Receipt prints q = ₦1,398.60: markup ₦33,319.00; unexplained residual ₦1.00 ≤ tolerance ₦7.00 → rounding only | **Proposed, not auto-linked** (R04 W4): no shared reference, so C4 condition 5 fails. User confirms with the receipt as evidence |

v0.1's symmetric ±6% band would have accepted a third-party USD credit in place of T2's counter-leg. Under C1.5 these go to review:

| Candidate USD credit | Cost vs ref | v0.1 ±6% | C1.5 band NGN→USD [−1%, +4%] |
|---:|---:|---|---|
| 700.00 | 5.36% | accept | outside → review, `Suspense:FXUnexplained` |
| 750.00 | −1.40% | accept | outside → review |
| 760.00 | −2.75% | accept | outside → review |

Valued at their reference rates, the conversion-account legs of T1 and T2 are worth ₦57,985.02 and ₦33,320.00. These equal the conversion costs, which is the trading-account identity (C1 D2). Before review, the T1 credit counts in **unexplained inflows** (₦1,780,000.00); after confirmation the figure is ₦0.00. The two fuel debits and the Aani payment also go to review (C4: a provisional rule history of 41/44 has a Wilson lower bound of 0.82; the Aani suggestion comes from a model).

**Tax view: currency pools at weighted-average NGN cost (C1.6).** ⚠ This assumes every foreign-currency spend is a disposal under NTA s.34(1)(b), which needs **practitioner confirmation**. Synthetic opening pools: AED 18,400.00 at ₦6,660,800.00; USD 2,150.00 at ₦2,857,350.00. Acquisitions are booked at NGN given, or at the official rate on the acquisition date (the 1 Oct WPS salary uses the 30 Sep fixing). Disposals are booked at NGN received, or at the official-rate value.

| Event | Proceeds ₦ | Relieved cost ₦ | Gain (loss) ₦ |
|---|---:|---:|---:|
| 18 Oct AED 5,000.00 exchanged (T1), NGN actually received | 1,780,000.00 | 1,809,670.08 | **(29,670.08)** |
| 23 Oct USD 701.00 spent on the ETF lot | 948,803.50 | 943,805.36 | 4,998.14 |
| October total, AED pool (all AED spends) | | | (20,487.66) |
| October total, USD pool | | | 5,025.75 |

At 31 Oct the AED pool holds 24,775.65 units at ₦8,967,150.51 (weighted average 361.934016), and the USD pool 2,170.72 units at ₦2,922,684.57 (weighted average 1,346.412513). Pool quantities equal ledger balances. The new ETF lot has `tax_cost_ngn` ₦948,803.50, equal to the USD pool's disposal proceeds. T1 shows why the three FX measures must be kept apart. Its **conversion cost** of ₦57,985.02 is a spread against CBN central. Its **realised currency loss** of ₦29,670.08 against pool cost is a tax figure. They are different numbers answering different questions (R04 B3).

**October cash flow (each flow at its transaction-date reference rate; cash basis)**

| Item | NGN | AED | USD | USD view | NGN view |
|---|---:|---:|---:|---:|---:|
| Income (salaries, gross dividend) | 2,350,000.00 | 22,000.00 | 9.60 | 7,735.67 | 10,324,351.84 |
| Spending (fuel counted once; Aani after review) | −480,800.00 | −10,582.35 | — | −3,242.19 | −4,319,831.97 |
| Bank charges incl. VAT on fees | −955.03 | −42.00 | — | −12.14 | −16,419.12 |
| Stamp duty | −100.00 | — | — | −0.07 | −100.00 |
| Withholding tax | — | — | −2.88 | −2.88 | −3,905.28 |
| Investing cost (commission; capitalised for tax) | — | — | −1.00 | −1.00 | −1,353.50 |
| Conversion cost vs reference (T1 + T2, confirmed) | | | | −67.60 | −91,305.02 |
| **Net saving** | | | | **4,409.78** (57.01%) | **5,891,436.94** (57.06%) |
| of which invested (ETF purchase) | | | 700.00 | 700.00 | |

The savings rate differs slightly between views because flows are valued at different dates' rates. The 1 Oct AED salary belongs to pay period September. On a pay-period basis, October's AED salary is not in this statement (due by 1 Nov), and that view is shown as incomplete for October.

*Implicit versus explicit costs, with stated denominators (R04 W12).* The implicit conversion cost, $67.60, is **5.57×** bank charges including VAT ($12.14), **5.53×** bank charges plus stamp duty ($12.21), and **4.20×** all explicit costs including withholding tax and commission ($16.10).

**Net worth**

| As of | A1 NGN | A2 AED | A3 cash $ | ETF $ | Net worth USD | Net worth NGN | Fixing |
|---|---:|---:|---:|---:|---:|---:|---|
| 30 Sep 2026 | 1,250,000.00 | 18,400.00 | 2,150.00 | 3,000.00 | 11,100.77 | 14,752,920.46 | Wed 30 Sep, 1,329.00 |
| 31 Oct 2026 | 3,898,144.97 | 24,775.65 | 2,170.72 | 3,811.00 | 15,602.72 | 21,157,289.60 | Fri 30 Oct, 1,356.00 |
| Change | | | | | +4,501.95 | +6,404,369.14 | |

**Decomposition (C5.3; exact in Fraction arithmetic; display rounding shown)**

| Component | USD view | NGN view |
|---|---:|---:|
| Net external flows (transaction-date rates) | 4,477.38 | 5,982,741.97 |
| Conversion cost vs reference | −67.60 | −91,305.02 |
| Market (local-currency move, translated at the closing rate) | 111.00 | 150,516.00 |
| FX translation on NGN (opening balance and intra-month flows) | −18.83 | 0.00 |
| FX translation on AED | 0.00 | 220,508.70 |
| FX translation on USD (cash and ETF, incl. trade-date value) | 0.00 | 141,907.50 |
| Display rounding | 0.00 | −0.01 |
| **Total = change in net worth** | **4,501.95** | **6,404,369.14** |

The sign check passes. The synthetic naira weakens monotonically, so in the USD view FX on NGN is negative, and in the NGN view FX on AED and USD holdings is positive. v0.1 showed a "residual +0.42" and claimed it "is zero in production". That was wrong: it was untranslated intra-month NGN flows, now inside "FX translation on NGN" (R04 W10). The trade's $700 cash leg is internal (it becomes security value); the $1 commission is an external flow. C5.3 does not say how trades enter the decomposition, so this treatment is ours and flagged for the contract owners (§11).

**Duplicates, re-import and identity (C1.8; golden test C1-I10)**

| Re-import variant of A1 | New keys (C1.8) | New lines (v0.1 `line_hash`) |
|---|---:|---:|
| PDF re-upload of the same period | 0 | 0 |
| XLSX re-export (narrations cut at 24 characters, no balance column) | 0 | 18, plus 1 in-file collision |
| Later PDF with one back-dated line (8 Oct) | 1 (the real new line) | 15 |
| Export taken mid-day on 31 Oct (last 4 charge lines absent) | 0; overlap ends at the last common row, row 15 of 19 | 0 |

In the XLSX variant, the two 12 Oct fuel debits become identical under the v0.1 hash. The second would be skipped silently and the file would then fail its own totals check. C1.8 ordinals keep the two lines distinct. The account resolver matches A1 on the HMAC of the full NUBAN. The masked forms `******6789` and `012*******` produce candidates only.

**Date format.** The nine distinct dates in A1 all fall inside the printed period when read as DD/MM; read as MM/DD, one in nine does. The file is therefore accepted as DD/MM. A file whose day values are all ≤ 12 would be quarantined for the user to confirm the format.

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
| **Base-currency balancing with an FX-cost posting that forces balance (v0.1)** | Stored base amounts could drift unnoticed; history was tied to a base-currency choice; any mismatch became "spread" (R04 B1, B2). Replaced by per-commodity balancing through conversion accounts (C1 D1–D3). |
| **Revaluation journal entries (v0.1)** | They have no native amount, and changing the base currency would rewrite them. Replaced by derived views keyed by rate-set version (C1 D3). |
| **Categories as posting accounts (v0.1)** | A recategorisation rewrote postings, which conflicts with append-only storage (R04 M7). Replaced by bitemporal classification rows (C1 D4). |
| **Symmetric ±6% cross-currency tolerance (v0.1)** | It would accept any USD credit from about $695 to $784 as T2's counter-leg (R04 B1). Replaced by C1.5's residual rule and one-sided bands per pair. |
| **Rejecting statements that fail a check (v0.1)** | Rejection loses the data. Replaced by quarantine with a named difference (§4.3.7; Doc 6). |
| **Portfolio OS executing sweeps, conversions or trade friction (Doc 3 proposals)** | Payment initiation is licensed activity in both jurisdictions (F1, F8), and Portfolio OS routes no orders. Automation the user configures at the bank or app is in scope and measured (R13; V-025; §7). |

## 6. Cross-department dependencies

**We need from others:**
- **Architecture and Accounting (contract owners):** confirmation of the three points raised in §11: `pay_period` on classification, trades in the C5.3 decomposition, and calibration of the C1.5 bands. Ownership of the C1 invariant tests.
- **Data Architecture & Engineering:** implementation of C1.3 (NUMERIC(38,18) with scale, conversion and in-transit accounts, bitemporal classification), the line-key golden test, encryption at rest, and a parser test harness.
- **Tax Intelligence (with a licensed practitioner):** answers to C1.6's four questions, above all whether every foreign-currency spend is a disposal. Also: stamp-duty scope for card/POS payments and domiciliary transfers; the CAMF base and rounding; VAT on fees; withholding on foreign dividends; residency tests under the Nigeria Tax Act 2025 and UAE rules (F5, F21); and treatment of the typed credit classes (§4.3.1).
- **Investment Research / Market Data (Doc 5c):** the CBN central NFEM series with `price_type` and `fixing_date`; FMDQ as corroboration; the peg as a registered reference fact (C3.5); a documented parallel-market methodology, or confirmation that it stays indicative; corporate-action feeds for position reconciliation (F22).
- **Behavioural Finance (V-025):** whether to adopt user-configured bank-side automation as the intervention, with Portfolio OS only measuring it (R13; §7). Also the experiment design for budget views and the risk-tolerance instrument licensing (F13, F16).
- **Forecasting & Wealth Planning:** consumption of income-stream objects, including `pay_period`.
- **Goal Reality Engine:** the definition of "risk need" per goal.
- **AI Research & Explanation:** narratives follow C2. Ledger figures reach the model only as figure tokens.
- **Legal/Compliance & Privacy:** data retention and NDPA/PDPL obligations for statements; consent text for any aggregator link; confirmation that observing user-configured automation is not payment initiation.
- **Commercialisation:** whether multi-user tenancy changes the ledger (it should not change the schema).

**Others need from us:**
- the C1 mapping, chart of accounts and category taxonomy (§4.2–4.3);
- reconciliation status per statement and period (every downstream figure inherits the *incomplete* badge);
- the unexplained-inflows total (Tax);
- income-stream and recurring-outflow objects;
- the three labelled FX measures (C1 D9) and the fee-leakage series;
- the net-worth decomposition (C5.3);
- the fact-find record with confirmation stamps (tax and planning).

## 7. Risks, open uncertainties and disagreements

**Uncertainties (ranked):**
1. **Tax treatment of foreign currency:** is each foreign-currency spend a disposal under NTA s.34(1)(b), which cost method applies, and which "official market rate" field? These questions determine whether the pools in §4.6 are tax figures at all (C1.6). Licensed practitioner.
2. **Founder's institutions:** which banks and brokers are used? `bankstract` covers none of the banks the founder is confirmed to use, and the line-key branch depends on whether references are printed. **Unknown — founder to confirm.**
3. **CBN open-banking go-live**, and whether individuals or small developers can ever be API consumers. Open Banking Nigeria still cites "early 2026" and a law-firm review cites mid-2026; neither has happened (checked 2026-11-04).
4. **Stamp duty:** whether card/POS payments are in scope, and how the ₦10,000 threshold applies in foreign-currency equivalents on domiciliary accounts. The statute is cited via Doc 6 F21 and was not re-read here.
5. **Revised CBN Guide to Charges (1 May 2026):** figures come from press reports; the PDF was not retrieved. The CAMF base (gross or net) and the bank's rounding mode are unknown, so the CAMF audit tests ≤ cap under both readings.
6. **Statement formats:** GTBank, Zenith, Access, UBA, First Bank, Stanbic IBTC (official), OPay and PalmPay (official), Mashreq, Wio, Liv, RAKBANK, Emirates NBD personal, PiggyVest, Cowrywise, Trove and Chaka are unverified. Per-bank NIBSS session-ID labels are unsourced.
7. **FX band calibration:** C1.5's one-sided bands are E5. T2's 3.33% sits near the +4% ceiling, so retail fintech FX in a stressed month may often go to review. That is safe (review, not error) but adds friction.
8. **Acceptable false-positive rate for transfer matching** (R04 IC question 5). We propose zero false positives among *confirmed* matches in the founder's first 12 months, measured by a quarterly trace sample, and at most 2% among *proposed* matches. These are E5 targets for the Investment Committee to accept or change.
9. **Aani limit** (AED 50,000 on AEP's site vs AED 5,000 per proxy transaction in 2025 press) and **Etihad Credit Bureau** report price (AED 157.50 vs AED 84): the sources conflict.
10. **Mono** coverage of the founder's banks is untested.
11. **Parallel-market rate:** there is no official series. Any secondary series must document its survey method or stay labelled indicative (confidence D). Ownership is for Doc 5c to settle (R04 IC question 6).

**Disagreements preserved:**
- *Commercial/retail banker vs financial planner — what comes first.* The banker position: nothing is trustworthy until statements reconcile and charges are audited, so the first three months should build only ingestion, reconciliation and the charge audit. The planner position: the founder's decisions depend on goals, savings rate and liquidity, which can be estimated from imperfect data, and a system that shows nothing for three months loses the user. Proposed resolution: ship reconciliation-gated aggregates — every KPI is visible from week one but carries the reconciliation badge and confidence band; no forecast or recommendation consumes an "incomplete" period.
- *Infrastructure specialist vs product ambition — APIs.* The specialist regards aggregator integration as premature and a privacy liability; the product view regards manual upload as friction that limits adoption later. Resolution: build the adapter boundary now, integrate Mono only after a 60-day shadow test on the founder's own accounts measuring completeness against statements.
- *Private banker vs behavioural researcher — risk tolerance.* The private banker is content with a suitability questionnaire; the behavioural researcher regards single questionnaires as noisy and wants repeated measurement and observed behaviour. Resolution: measure with the Grable–Lytton scale annually *and* record observed behaviour (sales after drawdowns) as a separate, labelled signal; never merge the two into one score.
- *Credit specialist vs planner — credit reports.* The credit specialist wants bureau reports in the MVP; the planner notes the founder's decisions rarely hinge on a bureau score. Resolution: document upload only; no automation.
- *Base currency.* Wealth-management view: USD numeraire; retail view: NGN because spending is in naira. Resolution: dual view by default, user chooses the headline (§4.4.7).
- *Doc 3 vs Doc 4 — automation (V-025, R03 B2).* Doc 3 recommends auto-sweeps, rule-based auto-conversion and cooling-off friction for trades. Doc 4 R13 holds that Portfolio OS must not initiate payments, transfers or conversions. Doing so would be payment initiation, which needs a CBN licence in Nigeria and a CBUAE Service Initiation licence in the UAE (F1, F8). **Our position (banking side):** automation the user configures at the provider is in scope as the intervention. Examples are a standing order at the bank, PiggyVest or OPay OWealth auto-save, and a Wise auto-conversion. Portfolio OS detects it from statements as a recurring stream tagged `automation_origin = user_configured_at_provider`, measures its effect on savings rate and buffer, and may offer reminders or a link to the provider's own setup screen. It never executes, and it cannot randomise such automation. Trade friction has no point of application, because Portfolio OS routes no orders; at most a user-run pre-trade checklist is possible. If Doc 3 wants execution, the conflict goes to the Investment Committee with the licensing cost stated.
- *Reviewer vs us — UAE consumer data sharing (R04 m5).* The reviewer reads the Himma tracker as confirming consumer data sharing at FAB and DIB. Our re-fetch on 2026-11-04 finds data sharing named only for CBD and Mashreq; for FAB and DIB the tracker says AlTareq is "live and enabled" without naming data sharing. We record both readings. We agree with the reviewer that the tracker's counts are internally inconsistent.

**Answers to the reviewer's Investment Committee questions (R04 §6).** (1) C1 is authoritative. Architecture and Accounting own the invariant tests. (2) An unconfirmed match posts no conversion cost; its legs sit in in-transit or `Suspense:FXUnexplained`, and the close is blocked until they are resolved (C1.5). (3) Unknown; founder to confirm (item 2). (4) Unknown; practitioner (item 4). (5) The proposed targets are in item 8. (6) Doc 5c (item 11).

**Risks:** silent parser errors (mitigated by reconciliation plus the independent controls of §4.3.7, since reconciliation alone cannot catch misclassification, false matches, date swaps or dropped pairs); false-positive transfer matches hidden as spread (mitigated by C1.5 and C4 review); stale fee and rate constants (mitigated by sourced, dated constants and a review calendar — the repository's hard-coded policy-rate anti-pattern must not recur); privacy exposure from storing statements (encryption, retention policy, no third-party model calls with raw statements); over-interpretation of behaviour from one person's data (Behavioural department's eight-question test applies); regulatory change in both jurisdictions (every rule carries an effective date and a "checked on" date).

## 8. Recommendations, ranked

| # | Recommendation | Class |
|---|---|---|
| R1 | Statement-import pipeline for Tier 1–2 sources with completeness reconciliation, quarantine (not rejection), the independent controls of §4.3.7 and C1.3 provenance | Personal-MVP must-have |
| R2 | Ledger per C1: per-commodity postings, conversion and in-transit accounts, categories as classification rows, derived FX measures, currency pools and FIFO lots; confidence per C4 | Personal-MVP must-have |
| R3 | Transfer matching per §4.3.2 (Fellegi–Sunter with calibrated posteriors, global one-to-one assignment, C1.5 residual rule) and exclusion of investment contributions from spending | Personal-MVP must-have |
| R4 | Line keys and idempotent re-import per C1.8; account resolver; fuzzy flagging; reversal pairing; bank-dispute receivable | Personal-MVP must-have |
| R5 | Rules engine with review queue (C4); one-to-one Plaid PFC v2 mapping with `rail`, `levy_type`, `is_tax`; charge audit as cap tests; stamp-duty scope audit; typed credit taxonomy and unexplained-inflows total | Personal-MVP must-have |
| R6 | Cash-flow, savings-rate, liquidity and dual-currency net-worth views with decomposition and reconciliation badges | Personal-MVP must-have |
| R7 | Income-stream detection and paycheque-anchored recurring forecast with scenario overlays | Personal-MVP must-have (forecast banded, not point) |
| R8 | Fact-find record (residency, employment type, goals) with confirmation stamps; risk capacity/tolerance/need shown separately | Personal-MVP must-have (questionnaire licensing: Later) |
| R9 | Budget views with measured adherence, framed as an experiment | Later |
| R10 | Aggregator adapter (Mono; UAE licensed TPP) after shadow test | Later |
| R11 | OCR for scanned statements; credit-report parsing | Later |
| R12 | CBN open-banking / CBUAE AlTareq direct participation | Do-not-build (yet) |
| R13 | Real-time balance sync, or payments, transfers, sweeps or conversions initiated by Portfolio OS | Do-not-build (yet): payment initiation is licensed activity (F1, F8). Automation the user configures at the bank or app is observed and measured instead (V-025; §7) |

**Five-question test on the top items.**

*R1–R2 (import + ledger).* (1) Problem: the founder cannot see one truthful picture across NGN/AED/USD accounts, and prior tools produced inaccurate figures. (2) Who: the founder now; any multi-banked Nigerian/UAE user later. (3) Evidence: open-source ledgers converge on these primitives (F11); reconciliation failures in PDF parsing are documented (F4); IAS 21 provides the multi-currency logic (F20). (4) Build/validate: per-institution parsers with redacted fixtures; completeness and independent controls (§4.3.7); property tests for C1-I1 to C1-I13; the three-variant re-import golden test (§4.6). (5) Measurable improvement (targets E5, no baseline): share of statements `reconciled` (target ≥95%), zero unexplained differences left open past close, and time from upload to confirmed ledger (< 10 minutes per statement).

*R3–R4 (transfers, duplicates).* (1) Problem: own transfers and reversals inflate income and spending and hide FX spread. (2) Who: anyone moving money across accounts or currencies — the founder does so monthly. (3) Evidence: Fellegi–Sunter record linkage (F12; E2 theory, E4 applicability); Actual Budget's documented duplicate-transfer problem (F11); the v0.1 band would have admitted third-party credits as spread (§4.6). (4) Build/validate: a stratified labelled set with hard negatives (§4.3.2); a calibrated posterior per stratum; replay tests with overlapping statements and back-dated lines. (5) Improvement (targets E5): no false positives among confirmed matches in a quarterly trace sample; spending and income error versus manual ground truth < 1%; a conversion-cost series produced monthly for confirmed matches only.

*R5 (rules + charge audit).* (1) Problem: unexplained bank charges and miscategorised spending. (2) Who: the founder; later retail users who routinely question charges. (3) Evidence: published charge schedules (F5) make an audit deterministic; Plaid's confidence enumeration is an accepted interface (F10). (4) Build/validate: rule precision tracked per rule with Wilson lower bounds (C4); charge audit tested on synthetic statements with every charge type and both CAMF base readings. (5) Improvement (targets E5): calibration within each C4 band and a falling correction rate, not an acceptance rate (C4); every charge line either matched to a tariff rule or flagged.

*R6–R7 (views + forecast).* (1) Problem: decisions need savings rate, liquidity and a credible near-term cash position in the right currency. (2) Who: the founder; the Planning and Goal engines downstream. (3) Evidence: income-timing sensitivity (F14), emergency-fund evidence (F15), national-accounts definitions (F19). (4) Build/validate: back-test the recurring forecast on the founder's own history (mean absolute percentage error by horizon); all metrics print their definitions. (5) Improvement (targets E5): 30-day cash forecast error < 10% of monthly spend after six months of data; months-covered metric stable within ±0.2 between consecutive reconciled months.

*R8 (fact-find and risk).* (1) Problem: tax and suitability outcomes depend on facts no statement contains. (2) Who: the founder, Tax and Planning departments. (3) Evidence: CFP Board/FPSB practice standards (F17); three-dimensional risk framework (F16); Tax Act residency rule (F21). (4) Build/validate: structured form with confirmation stamps; questionnaire psychometrics from the literature. (5) Improvement: zero downstream computations running on unconfirmed residency or employment status.

## 9. Required validation before implementation

1. Obtain redacted real statements (the founder's own, after privacy controls are approved) for each institution in Tiers 1–2. For each, record file type, columns, narration patterns, running-balance presence, printed totals, password behaviour, date format and whether bank references or NIP session IDs are printed, and their labels. Build fixtures only from redacted copies.
2. Retrieve and file the primary texts with dates: CBN Guide to Charges 2026 (PDF), including the CAMF base and rounding; NTA 2025 s.123, Ninth Schedule item 48 and s.184 (to be re-read, not only via Doc 6); CBUAE Open Finance Regulation (Circular 3/2025); the CBN circular of 18 June 2023 on domiciliary accounts; MOHRE Resolution 340/2026.
3. Confirm with each institution (support ticket or in-app test) the export formats not verified here (§7 item 6), including whether GTBank's Excel export exists.
4. Vendor-review and pin `bankstract` if it is used; run its parsers and `inspect()` on redacted samples.
5. Run a 60-day shadow comparison of Mono Connect against statements for the founder's Nigerian accounts before any API dependency. Record completeness, latency, re-authentication frequency and cost per account.
6. Establish the CBN central NFEM feed with `price_type` and `fixing_date` (C5.1, C3.5), the holiday calendars (NG, AE, US) and a documented parallel-market series or an "indicative" label. Test the §4.5 display rules with users for misreading risk.
7. Implement C1-I1 to C1-I13 as property tests, plus the three-variant re-import golden test (C1-I10).
8. Build the stratified labelled transfer set (§4.3.2) with hard negatives and split transfers. Estimate m/u per stratum, calibrate posteriors and measure precision and recall. Calibrate the C1.5 one-sided bands on the founder's confirmed history; until then they remain E5.
9. Back-test the recurring-pattern forecast on 12 months of reconciled history, on both cash and pay-period bases.
10. Have a licensed Nigerian tax practitioner answer C1.6's four questions and §7 items 1 and 4, and review the charge, levy, VAT and residency assumptions (F5, F9, F21), before any figure reaches a user. A UAE adviser should review the UAE items.
11. Privacy and security review of statement storage, encryption and retention (Legal/Compliance) before real data are loaded.
12. Behavioural department to specify the budget-view experiment, the risk-tolerance instrument licensing, and the measurement of user-configured automation (V-025), before R8/R9 proceed.

## 10. Sources

Access dates are 2026-11-02 unless stated; "fetched" means the page or PDF was read directly; "search extract" means the official text was obtained through a search-engine extract because the page blocked automated fetching. Academic references were checked against OpenAlex by DOI on 2026-11-02 ([verified] = title, first author and year agree). In the revision pass (2026-11-04) the reference-lookup tool timed out, so new and corrected references were checked against the Crossref API.

**Regulators, standards bodies and primary documents**
- S1. Udo Udoma & Belo-Osagie, *Open Banking in Nigeria: An Overview of the CBN Operational Guidelines for Open Banking in Nigeria 2023* (2023). https://uubo.org/wp-content/uploads/2023/10/OPEN-BANKING-IN-NIGERIA-AN-OVERVIEW-OF-THE-CBN-OPERATIONAL-GUIDELINES-FOR-OPEN-BANKING-IN-NIGERIA-2023.pdf — search extract.
- S2. Open Banking Nigeria, *Open banking in Nigeria* (page updated July 2026). https://openbanking.ng/open-banking-in-nigeria/ — fetched; re-fetched 2026-11-04 ("Last updated: July 2026"; "expectations of a phased go-live in early 2026"; fintechs named as API consumers).
- S3. Goldsmiths LLP, *Nigerian Open Banking: The Legal Framework All Banks and FinTechs Need to Know* (2026). https://www.goldsmithsllp.com/nigerian-open-banking-the-legal-framework-all-banks-and-fintechs-need-to-know/ — fetched.
- S4. Y.-F. Elaigwu, "As Nigeria prepares for the open banking rollout", *BusinessDay*, 8 June 2026. https://businessday.ng/opinion/article/as-nigeria-prepares-for-the-open-banking-rollout/ — fetched.
- S5. *Vanguard*, "Nigeria's open banking will happen soon — CBN", October 2025. https://www.vanguardngr.com/2025/10/nigerias-open-banking-will-happen-soon-cbn/ — search extract.
- S6. TechCrier, "What is open banking, and is Nigeria ready for it?", October 2026. https://www.techcrier.com/2026/10/what-is-open-banking-and-is-nigeria.html — fetched; relies on S2, so not independent (R04).
- S7. *Nairametrics*, "Nigerian fintech Okra shuts down as co-founder Fara Ashiru moves to UK's Kernel", 3 July 2025. https://nairametrics.com/2025/07/03/nigerian-fintech-okra-shuts-down-as-co-founder-fara-ashiru-moves-to-uks-kernel/ — search extract.
- S8. Mono, *Pricing* (undated). https://mono.co/pricing — fetched.
- S9. Mono, *Coverage*. https://mono.co/coverage — fetched.
- S10. Mono, *Documentation overview*. https://docs.mono.co/docs — fetched.
- S11. Open Banking Tracker, *Mono (acquired by Flutterwave)* profile (2026). https://www.openbankingtracker.com/mono-co — search extract (fetch returned HTTP 429).
- S12. Open Banking Nigeria, *Are Mono and Stitch truly open banking?* https://openbanking.ng/are-mono-and-stitch-truly-open-banking/ — search extract.
- S13. Kuda Help Centre, *Get your account statement*. https://help.kuda.com/en/articles/8947801-get-your-account-statement — fetched.
- S14. Moniepoint Support, *How to generate account statement*. https://support.moniepoint.com/topics/how-to-generate-account-statement-202/how-to-generate-account-statement-206 — search extract (fetch 403).
- S15. J. Orazulike, *bankstract* v0.18.3 (MIT; "Development Status :: 3 - Alpha"), PyPI, released 2 November 2026. https://pypi.org/project/bankstract/ — fetched; JSON API https://pypi.org/pypi/bankstract/json re-fetched 2026-11-04 (4 parsers, check matrix, `inspect()`).
- S16. GTBank, *Help Centre*. https://gtbank.com/help-centre — fetched (statement path only); TaxFetch, *GTBank Nigeria bank statement analyzer* (third-party). https://taxfetchindia.com/tools/bank-statement/gtbank-nigeria-bank-statement-analyzer — search extract.
- S17. Central Bank of Nigeria, *Guide to Charges by Banks, Other Financial and Non-Bank Financial Institutions*, effective 1 January 2020 (PDF). https://www.cbn.gov.ng/Out/2022/CCD/Guide%20to%20Charges%20by%20Banks%20Other%20Financial%20and%20Non-Financial%20Institutions%20eff%20Jan%201%202020.pdf — fetched; text extracted.
- S18. Legit.ng, "CBN scraps card maintenance fees, makes email alerts free as 4 new banking charges take effect" (May 2026). https://www.legit.ng/business-economy/economy/1708374-cbn-scraps-card-maintenance-fees-email-alerts-free-4-banking-charges-effect/ — fetched; *Leadership*, "CBN raises debit, credit card issuance fee to N1,500" (2026). https://leadership.ng/cbn-raises-debit-credit-card-issuance-fee-to-n1500/ — search extract; WithinNigeria, "CBN ATM card fee increase…", 25 April 2026. https://www.withinnigeria.com/2026/04/25/cbn-atm-card-fee-increase-new-charges-effective-date-and-what-every-nigerian-bank-customer-must-know/ — search extract.
- S19. TechCabal, "Here is why bank transfers in Nigeria will cost more from 2026", 22 December 2025. https://techcabal.com/2025/12/22/why-your-50000-transfer-will-cost-100-from-2026/ — search extract (fetch 403).
- S20. Kuda Help Centre, *An important update about stamp duty* (2025/26). https://help.kuda.com/en/articles/13285316-an-important-update-about-stamp-duty — fetched.
- S21. Paystack Support, *Stamp duty charge on NGN transfers* (2026). https://support.paystack.com/en/articles/7573314 — fetched.
- S22. TechEconomy, "Stamp duty replaces EMTL: sender to bear ₦50 charge on bank transfers", 1 January 2026. https://www.techeconomy.ng/stamp-duty-replaces-emtl-sender-to-bear-50-charge-on-bank-transfers — fetched; re-fetched 2026-11-04 ("or their foreign currency equivalent"; no statute section; POS not mentioned).
- S23. Tope Adebayo LP, *Nigeria Tax Act, 2025: An Outlook of Income and Profit Taxation under the Present Regime* (2025, PDF). www.topeadebayolp.com — PDF read; exact URL not recorded.
- S24. *BusinessDay*, "5 other levies Nigerians pay for electronic transactions" (2024). https://businessday.ng/analysis/article/5-other-levies-nigerians-pay-for-electronic-transactions/ — search extract.
- S25. National Bureau of Statistics, *Highlights of Consumer Price Index (CPI) Rebasing*, February 2025 (PDF). https://microdata.nigerianstat.gov.ng/index.php/catalog/154/download/1156/Highlights%20of%20CPI%20Rebasing%20Result.pdf — fetched; text extracted.
- S26. *Nairametrics*, "Nigeria's inflation slows to 14.63% in September, fourth straight monthly decline in 2026", 15 October 2026. https://nairametrics.com/2026/10/15/nigerias-inflation-slows-to-14-63-in-september-fourth-straight-monthly-decline-in-2026/ — fetched; National Bureau of Statistics homepage CPI panel (2024 = 100). https://nigerianstat.gov.ng/ — fetched.
- S27. *A Review of Key CBN Foreign Exchange Policies in 2024* (Legal500/Mondaq, 2025). https://www.legal500.com/intelligence/nigeria/finance-and-banking/a-review-of-key-cbn-foreign-exchange-policies-in-2024 — fetched.
- S28. Mondaq, *Recent Reforms in the Nigeria Foreign Exchange Market and the Introduction of the Electronic Foreign Exchange Matching System* (2025). https://www.mondaq.com/nigeria/financial-services/1568396/ — search extract.
- S29. WithinNigeria, "Dollar to Naira today, October 31, 2026: NFEM rate ₦1,346.91, black market ₦1,385". https://www.withinnigeria.com/2026/10/31/dollar-to-naira-today-october-31-2026-nfem-rate-%E2%82%A61346-91-black-market-%E2%82%A61385/ — fetched; re-fetched 2026-11-04: figures are for Thursday 29 Oct trading (buy 1,345.91; sell 1,346.91, also called "weighted average"; central 1,346.41); early 30 Oct trading about 1,346.86; *Vanguard*, "Naira appreciates to N1,373/$ in parallel market", October 2026. https://www.vanguardngr.com/2026/10/naira-appreciates-to-n1373-in-parallel-market/ — search extract.
- S30. *Nairametrics*, "CBN lifts cash deposit restriction on domiciliary accounts, allows $10k withdrawals daily", 18 June 2023. https://nairametrics.com/2023/06/18/breaking-cbn-lifts-cash-deposit-restriction-on-domiciliary-accounts-allows-10k-withdrawals-daily/ — fetched.
- S31. Central Bank of the UAE, *Open Finance Regulation* (Circular 7/2023 of 31 December 2023, replaced by Circular 3/2025 of 10 July 2025). https://rulebook.centralbank.ae/node/5686 — fetch 403; summarised via Pinsent Masons, *UAE open finance* (https://www.pinsentmasons.com/out-law/guides/uae-open-finance) and Mondaq, *Open Finance Regulation* (https://www.mondaq.com/financial-services/1555738/open-finance-regulation) — search extracts.
- S32. Himma.ai, *UAE Open Finance Tracker 2026: Which banks are live on CBUAE AlTareq?* (reviewed 2 July 2026). https://himma.ai/tools/open-finance-tracker/ — fetched; re-fetched 2026-11-04 (counts inconsistent: tiles 5/5/5, table 6/4/5).
- S33. PaymentExpert, "UAE fintech hub: open finance, Aani and what's next in 2026", 21 October 2026. https://paymentexpert.com/2026/10/21/uae-fintech-hub-open-finance-2026/ — search extract (fetch 403).
- S34. The Paypers, "Fintech Galaxy secures CBUAE approval for Open Finance". https://thepaypers.com/fintech/news/fintech-galaxy-secures-cbuae-approval-for-open-finance ; Spare, "Spare receives in-principle approval from the Central Bank of the UAE for Open Finance license" (August 2025). https://tryspare.com/blog/spare-receives-in-principle-approval-from-the-central-bank-of-the-uae-for-open-finance-license/ — search extracts.
- S35. Central Bank of the UAE, *UAE Fund Transfer System (UAEFTS)*. https://centralbank.ae/en/our-operations/payments-and-settlements/uae-fund-transfer-system-uaefts/ ; *IBAN* FAQ. https://www.centralbank.ae/en/services/iban — search extracts (fetch 403).
- S36. Al Etihad Payments, *Aani*. https://aep.ae/ — fetched; *Al Etihad*, "Aani…" (September 2025). https://en.aletihad.ae/news/business/4609296/ ; *Gulf News*, "UAE instant payments platform Aani crosses 12.5 million users". https://gulfnews.com/business/banking/uae-instant-payments-platform-aani-crosses-125-million-users-1.500502686 — search extracts.
- S37. *Gulf News*, "Creation, history and evolution of the UAE dirham" (2021). https://gulfnews.com/amp/story/uae%2Fyear-of-the-50th%2Fcreation-history-and-evolution-of-the-uae-dirham-1.1621767243152 — search extract.
- S38. EY, *UAE introduces enhanced Wage Protection System, effective 1 June 2026* (Tax Alert, 2026). https://www.ey.com/en_gl/technical/tax-alerts/uae-introduces-enhanced-wage-protection-system-effective-1-june-2026 — fetched; re-fetched 2026-11-04 (85% compliance threshold; WPS files).
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
- S51. Plaid, *Personal Finance Category taxonomy* (v1 CSV). https://plaid.com/documents/transactions-personal-finance-category-taxonomy.csv ; *PFC taxonomy v1/v2 comparison* (CSV). https://plaid.com/documents/pfc-taxonomy-all.csv ; *Personal Finance Category migration guide* (PFCv2, December 2025). https://plaid.com/docs/transactions/pfc-migration/ ; *Transactions API reference* (confidence_level, counterparties). https://plaid.com/docs/api/products/transactions/ — all fetched; `pfc-taxonomy-all.csv` re-downloaded and parsed 2026-11-04 (18 primary, 127 detailed; codes in §4.3.5 taken from it).
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
- S61. P. Kuzniak, A. Rabbani, W. Heo, J. Ruiz-Menjivar, J. E. Grable, "The Grable and Lytton risk-tolerance scale: a 15-year retrospective", *Financial Services Review* 24(2), 177–192, 2015. https://doi.org/10.61190/fsr.v24i2.3240 [verified on Crossref 2026-11-04; v0.1 wrongly marked unverified]
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
- S84. J. Sabat, E. Gallagher, "Rules of Thumb in Household Savings Decisions: Estimation Using Threshold Regression" (working paper, SSRN, 2019). https://doi.org/10.2139/ssrn.3455696 [found on Crossref 2026-11-04; working paper, not peer reviewed]
- S85. J. M. Collins, L. Gjertson, "Emergency savings for low-income consumers", *Focus* 30(1), 2013. [unverified — not found in OpenAlex]
- S86. J. Klement, *Investor Risk Profiling: An Overview*, CFA Institute Research Foundation, 2015. [unverified — not found in OpenAlex]
- S87. World Bank, *Nigeria Development Update*, October 2026 (as reported by Nairametrics, S26). — not fetched.
- S88. OECD, *Household savings* indicator (definition of household saving rate). https://www.oecd.org/en/data/indicators/household-savings.html — fetch 403; definition cited from standard national-accounts practice [unverified].
- S89. Intuit Inc., US Patent 8,380,590, "Method and system for detecting recurring income from financial transaction data". https://patents.google.com/patent/US8380590 — search extract (industry-approach reference only).
- S90. Udo Udoma & Belo-Osagie, *Nigeria's FinTech Regulatory Framework: Key 2025 Review and Outlook for 2026* (February 2026, PDF). https://uubo.org/wp-content/uploads/2026/02/FINTECH-2025-REVIEW-AND-OUTLOOK-FOR-2026-.pdf — search extract.
- S91. Launchpad.ng, *Open banking in Nigeria in 2026: who's actually compliant* (undated; claims rules "now live"; contradicted by S2–S6). https://launchpad.ng/resources/open-banking-nigeria-2026 — search extract; low confidence.
- S92. Afriex, *Nigeria bank transfer fees 2026*. https://afriex.com/post/nigeria-bank-transfer-fees-2026 — search extract; secondary.
- S93. E. Warren, A. W. Tyagi, *All Your Worth: The Ultimate Lifetime Money Plan* (Free Press, 2005) — origin of the 50/30/20 rule; book, not verified.
- S94. M. A. Jaro, "Advances in Record-Linkage Methodology as Applied to Matching the 1985 Census of Tampa, Florida", *Journal of the American Statistical Association* 84(406), 414–420, 1989. https://doi.org/10.1080/01621459.1989.10478785 [verified on Crossref 2026-11-04]
- S95. T. Enamorado, B. Fifield, K. Imai, "Using a Probabilistic Model to Assist Merging of Large-Scale Administrative Records", *American Political Science Review* 113(2), 353–371, 2019. https://doi.org/10.1017/S0003055418000783 [verified on Crossref 2026-11-04]
- S96. Central Bank of Nigeria, *Operational Guidelines for Open Banking in Nigeria* (approved March 2023, PDF). https://www.cbn.gov.ng/Out/2023/CCD/Operational%20Guidelines%20for%20Open%20Banking%20in%20Nigeria.pdf — read in primary text by Doc 7 (its S48, F7); not re-read here.
- S97. Portfolio OS, `CANONICAL_CONTRACTS.md` v0.1 (2026-11-04), contracts C1, C3, C4, C5; worked examples in `research/scripts/contracts_checks.py`.
- S98. Portfolio OS, Doc 6 (Accounting, Audit and Tax Framework) F21: reading of the Nigeria Tax Act 2025 s.123, Ninth Schedule item 48 and s.184(h)–(i). E2 via Doc 6; not re-read here.
- S99. Portfolio OS, Review R04 (banking and ledger), 2026-11-04, including its re-fetches of S2, S6, S15, S20–S22, S29, S32, S36, S38 and S51.

*Research artefacts (not sources):* the worked example is reproduced by `docs/portfolio-os/research/scripts/doc04_ledger_worked_example.py` (v0.2, standard library only, `python3 -I`). The v0.1 OpenAlex verification log and the PDF text extracts (CBN 2020 Guide, NBS rebasing, PenCom FAQ, SC VAT FAQ, FPAM standards) were kept in the v0.1 session scratchpad and are not in the repository.

## 11. Revision history and response to review

**v0.1 (2026-11-02):** first draft. **v0.2 (2026-11-04):** revised after review R04 and revision-log rows V-003 (adopt C1), V-008 (adopt C4/C5) and V-025 (Doc 4 side). Finding IDs are the reviewer's (R04 §2–§6, plus R03 B2 for V-025). The worked example was recomputed by `research/scripts/doc04_ledger_worked_example.py`.

| Finding | Revision log | Action | Where | Note |
|---|---|---|---|---|
| B1 FX cost is a plug; ±6% band | V-003 | Fixed | §1 C4; §4.2 "FX is derived"; §4.3.2; §4.6 | C1.5 adopted: reference-rate cost, residual rule with the dealer rate, one-sided bands, suspense until confirmed. ±6% withdrawn; the false-positive credits are shown |
| B2a Σ base_amount invariant | V-003 | Fixed | §4.2 | C1 D1 (per commodity, exact). The reviewer suggested price annotations; the contract chose trading accounts, and we follow the contract |
| B2b one currency per leaf violated | V-003 | Fixed | §4.2 chart | Expense accounts are by nature and multi-commodity (C1.3); asset and liability leaves hold one commodity (C1-I3) |
| B2c revaluation postings | V-003 | Fixed | §4.2; F20; §5 | Derived views keyed by rate set (C1 D3) |
| B2d precision (4-dp rates; minor units) | V-003 | Fixed | §4.5(7) | C1 D6/D7: NUMERIC(38,18) with scale, not the reviewer's NUMERIC(28,8) (contract governs); rates as published; single rounding |
| B3 no currency cost basis | V-003 | Fixed | §4.2; §4.6 tax view | WA pools in NGN (C1.6). T1 shows a ₦29,670.08 realised loss next to ₦57,985.02 conversion cost. Practitioner flag kept |
| B4 reconciliation is not an integrity guarantee | — | Fixed | §1 C3; §4.3.7 | Restated as a completeness control; independent controls added (counter-leg, date format, regime boundaries, pair drop, `inspect()`, trace sample) |
| M1 bankstract over-relied on; OPay contradiction | — | Fixed | F4; §4.1; §9 item 4 | Alpha status, 4 parsers and the check matrix recorded (re-fetched); `reconciled_with_exception` state; pin and vendor review |
| M2 duplicate hash fails on re-exports | V-003 | Fixed | §4.3.4; §4.6 golden test | C1.8 line key; overlaps at last common row; charge lines anchored; v0.1 hash shown failing (18 and 15 false new lines) |
| M3 account identity unspecified | V-003 | Fixed | §4.3.4 | C1.8 resolver (HMAC, candidate on masked forms, journaled merges) |
| M4 Fellegi–Sunter unspecified | — | Fixed | §4.3.2; F12 | Comparison vector, joint amount–date field, EM per stratum, calibrated posterior, Hungarian assignment, strata, hard negatives. Thresholds stay E5 |
| M5 income detection biased | — | Fixed | §4.3.1 | Typed credit taxonomy with tax relevance; unexplained-inflows total; INT cue; truncated NIP names; business-day anchors; WPS cue E4/E5 |
| M6 Plaid mapping errors | — | Fixed | §4.3.5 | One-to-one detailed codes from the re-downloaded CSV: telecoms → RENT_AND_UTILITIES_TELEPHONE; stamp duty → GOVERNMENT_AND_NON_PROFIT_TAX_PAYMENT; family remittance → TRANSFER_OUT_OTHER_TRANSFER_OUT; `rail`, `levy_type`, `is_tax` |
| M7 category as account | V-003 | Fixed | §4.2; §4.3.5 | Classification rows (C1 D4) |
| m1 reject vs quarantine | — | Fixed | §4.1; §4.3.7 | Quarantine with named difference |
| m2 balance-assertion off-by-one | — | Fixed | §4.3.7 | Assertion at the start of the day after period end |
| m3 time zones, calendars, value date | — | Fixed | §4.3.7; §4.6 rates | C1.7; Nigerian holiday calendar in the script |
| m4 stamp-duty section "not located" | — | Fixed | F5 | Doc 6 F21 citation; "foreign currency equivalent" re-fetched |
| m5a FAB and DIB consumer data sharing | — | Rejected (evidence) | F8; §7 | Re-fetch: data sharing named only for CBD and Mashreq; FAB/DIB "live and enabled". Both readings preserved |
| m5b tracker count inconsistency | — | Fixed | F8 | Tiles 5/5/5 vs table 6/4/5 recorded |
| m6 S61, S84 marked unverified | — | Fixed | S61, S84; F15, F16 | Confirmed on Crossref |
| m7 "[checked 2026-11-04]" in a 2026-11-02 document | — | Fixed | §7 item 3 | Document now dated 2026-11-04; status re-checked that day |
| m8 parallel stress unsourced | V-008 | Fixed | §4.4.2; §4.5(2) | Labelled indicative, confidence D (C5.1) |
| W1 weekend rate dates | V-008 | Fixed | §4.6 rate table; §4.5(6) | C5.2: Sun 18 Oct → Fri 16 Oct; Sat 31 Oct → Fri 30 Oct |
| W2 sell rate called weighted average; 29 Oct as month-end | V-008 | Fixed | F7; §4.6 | Field and fixing date stored; central is the reference; synthetic rates replace the real figure |
| W3 which leg dates the FX cost | V-003 | Fixed | §4.2; §4.6 | `conversion_on` per C1.5 |
| W4 T2 should not auto-link | V-003 | Fixed | §4.6 | T2 `proposed`; C4 condition 5 fails |
| W5 NIP fee on an FX purchase; intermediary leg | V-003 | Fixed | §4.6 A1 | Narration changed to an NIP transfer to an FX provider; chain as one exchange via in-transit |
| W6 second fuel debit in suspense | V-003 | Fixed | §4.3.4(5); §4.6 | Both debits to Consumption; reversal entry; BankDispute receivable if no reversal |
| W7 CAMF base and test | — | Fixed | §4.6 CAMF audit | ≤ cap under gross and net bases, half-even and truncation. Base definition **deferred** to Tax with the 2026 Guide PDF |
| W8a stamp-duty "exempt" logic | — | Fixed | §4.6 | Recipients never pay under sender-pays |
| W8b POS/card stamp-duty scope | — | Deferred | §7 item 4; §9 item 10 | Owner: Doc 6 and a licensed practitioner. Flagged, no alert |
| W9 Aani as dining | — | Fixed | §4.6 A2 | Suspense → review → reclass |
| W10 residual 0.42 "zero in production" | V-008 | Fixed | §4.4.7; §4.6 decomposition | C5.3 exact identity with intra-month flows translated; sign check |
| W11 commission expensed | V-003 | Fixed | §4.6 A3 | Capitalised: lot cost USD 701.00 |
| W12 "four times" denominator | — | Fixed | §4.6 | 5.57× charges incl. VAT; 5.53× with stamp duty; 4.20× all explicit costs |
| W13 WPS pay period | — | Fixed | §4.3.1(2); §4.4.3 | `pay_period` attribute; two bases |
| §3 F1 rule texts E2 | — | Fixed | F1 | E2 only for the 2023 Guidelines via Doc 7 S48; E3 otherwise |
| §3 F1 status not independent | — | Fixed | F1 | TechCrier marked dependent on S2 |
| §3 F7, F8 E2 | — | Fixed | F7, F8 | E3 |
| §3 F12 E1 | — | Fixed | F12 | E2 theory, E4 applicability |
| §3 F14 E1 body | — | Fixed | F14 | E2 + E4 transfer |
| §3 §4.3.1 thresholds untagged | — | Fixed | §4.3.1 | E5 |
| §3 "observed 2–3.5% spreads" | V-003 | Fixed | §4.3.2 | Claim removed; bands are E5 per C1.5 |
| §3 WPS narration cue | — | Fixed | F9; §4.3.1 | E4/E5 |
| §3 F4 session-ID labels unsourced | — | Fixed | F4; §9 item 1 | Withdrawn; validation item |
| §3 §8 targets untagged | — | Fixed | §8 | E5, no baseline |
| §4 S2 "early 2026" vs "mid-2026" | — | Fixed | §1; F1; §7 item 3 | Both wordings given with sources; re-fetched |
| §4 S36 Aani limit conflict | — | Deferred | §7 item 9 | Sources still conflict; owner: Banking, at the first real Aani transaction |
| §5 cross-document contradictions (13 rows) | V-003, V-008 | Fixed | §4.2–§4.6 | Resolved by adopting C1, C4 and C5 |
| §5 CBN NFEM source "not fetchable" vs Doc 7 S44 | V-008 | Deferred | §9 item 6 | Owner: Doc 5c feed. Not re-attempted in this pass |
| §5 Doc 6 Example 3 VAT error | — | Rejected (out of remit) | — | Doc 6's document; the reviewer referred it to R06 |
| §6 IC questions 1–2 | V-003 | Fixed | §7 answers | C1 authoritative; unconfirmed residual policy |
| §6 IC question 3 (founder's banks) | — | Deferred | §7 item 2 | Founder to confirm |
| §6 IC question 4 (stamp-duty scope) | — | Deferred | §7 item 4 | Licensed practitioner |
| §6 IC question 5 (false-positive rate) | — | Fixed (proposal) | §7 item 8 | E5 targets for IC decision |
| §6 IC question 6 (parallel series) | — | Deferred | §7 item 11 | Owner: Doc 5c |
| V-008 C4 bands and routing | V-008 | Fixed | §4.2; §4.3.6; §4.6 routing | C4 adopted (Wilson condition, tax weight, shared reference) |
| R03 B2: automation conflict | V-025 | Fixed (Doc 4 side) | R13; §5; §7 disagreements | User-configured automation at the provider is measured, never executed. Escalate if Doc 3 wants execution |

**Count (59 rows):** 51 fixed (one as a proposal for the Investment Committee and one as the Doc 4 side of V-025; W7's base definition is also deferred), 2 rejected (one with evidence, one as outside our remit) and 6 deferred, each with an owner.

**Points for the contract owners (we follow the contracts as written):**
1. C1.3 `classification` has no `pay_period`. Income lines need one (W13). We store it on `income_stream` and the income classification row, and ask that C1.3 add it.
2. C5.3 does not say how security trades and capitalised commissions enter the decomposition. We treat the trade's cash leg as internal and the commission as an external flow (§4.6). We ask for confirmation.
3. C1.5's NGN→USD ceiling of +4% may send many legitimate retail conversions to review in a stressed month (T2 is at 3.33%). This is not a disagreement, because review is the safe failure, but it should be the first item calibrated.

**Still open:**
- the tax treatment of foreign-currency spends and C1.6's four questions (practitioner);
- the founder's banks, and real redacted statements;
- stamp-duty scope for POS/card payments and the CAMF base (practitioner; 2026 Guide PDF);
- the CBN NFEM feed and the parallel-series ownership (Doc 5c);
- calibration of the bands and the matcher on confirmed history;
- the Behavioural department's response on V-025.
