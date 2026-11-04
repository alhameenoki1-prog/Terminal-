```
Document: 09 — Venture Capital Investment Memorandum (competitive analysis and commercialisation strategy)
Department: Executive Leadership and Venture Strategy  ·  Lead role(s): VC partner / investment-committee lead; CEO / startup-strategy lead; CFO; YC-style operator
Version: 0.1 draft  ·  Date: 2026-11-04 (research conducted 2026-11-02 to 2026-11-04)  ·  Status: for cross-department review
Reviewers required: Legal & Regulatory; Tax Intelligence (G); Data Architecture & Provenance (A/H); Behavioural Finance (B); Investment Research & Quant (C/D); Product & Design; Finance/Operations; the founder (inputs flagged "founder to confirm")
```

**Reading guide.** This memorandum answers one question: whether, and under what conditions, Portfolio OS — which begins as the founder's personal financial-intelligence system — could become a venture-scale Nigerian (then wider) financial-technology company. It is written as an investment committee would write it: conclusions first, numbers with sources and dates, a real bear case, kill criteria and alternatives. The four simulated roles disagree in places; those disagreements are preserved in §7 and §8 rather than averaged away. Every market figure carries a source number [S#] (list in §10) and an evidence grade (E1–E6, defined in the Context Brief §5). Figures that could not be verified are labelled as such. Nothing here is legal, tax or investment advice; §9 names the licensed reviews required before anything is relied upon.

---

## 1. Executive summary

**Conclusion.** Do not fund Portfolio OS today as a venture-scale consumer subscription business, and do not raise outside capital for it yet. The vision is coherent and the problem real, but the evidence says the Nigerian *paid* personal-finance software market is close to zero at present prices, the data rails the product depends on (open banking) are still not live, and personalised advice triggers Securities and Exchange Commission (SEC) registration with capital requirements that rise sharply in 2027. The committee recommends **"build-to-learn, no-fund-yet"**: continue as a personal system, run a 20-user friendly cohort at the founder's expense, and approach angels or a pre-seed fund only when two of three wedge signals (§8.3) are met. If they appear, the fundable company is probably **not** a nine-system consumer app but a narrow wedge — a multi-currency, provenance-first ledger plus Nigerian tax computation for mass-affluent and diaspora Nigerians — with a business-to-business-to-consumer (B2B2C) route through pension fund administrators, brokers and licensed advisers.

**Why.** Nigeria has ~111 million adults, 52% banked, but 62% earn below ₦100,000 a month and ~2% above ₦215,000 (2023) [S1]. Investment apps count 0.4–6 million registered users each yet monetise through spread, commissions or assets, not software fees [S11][S12]. The top budgeting apps in Nigeria earned roughly $150–220 *per week* each in Q3 2025 [S62]. At ₦1,346/$ [S49] a ₦2,500 monthly price is $1.86; our unit-economics sketch (§4.4) gives ~$46/year revenue, 60% gross margin and lifetime value/acquisition cost of ~1.8 at a $25 CAC. Sold to UAE/diaspora users at $10–15/month the economics are 3–10× better, but that market is small for Nigerians (50,000–100,000 in the UAE [S20]) and crowded with regulated incumbents.

**Biggest uncertainty.** Willingness to pay: no direct evidence exists for this product with these users; everything above is proxy data. Second: whether CBN open banking goes live in 2026–27 [S34][S35].

---

## 2. Scope and method

**Questions addressed.** (A) Who has the problem and how do they cope today; (B) market size with sourced assumptions; (C) competitive landscape in Nigeria, the UAE/MENA and globally; (D) business models, pricing and unit economics; (E) regulatory and structural risk; (F) defensibility; (G) staged plan and capital; (H) bear case, kill criteria, alternatives and a fund/no-fund recommendation.

**What we searched.** Primary and institutional sources where available: EFInA Access to Financial Services (A2F) 2023 survey report (full PDF extracted and read) [S1]; National Pension Commission (PenCom) Q4 2025 industry dashboard (PDF) [S2]; SEC Nigeria rules on robo-advisory services (2021, PDF), the SEC FinTech rules page and the January 2026 revised minimum-capital circular [S28–S32]; Central Bank of Nigeria (CBN) open-banking framework commentary and Open Banking Nigeria status pages [S33][S34]; Nigeria Tax Act 2025 commentaries (Legal500, Tope Adebayo LP, EY) [S39–S41]; the Nigerian Tax ID portal notice [S42]; UAE government taxation page [S44]; Partech 2025 Africa Tech VC report (PDF extracted) [S52]; NGX (then NSE) market-data price list 2018 (PDF extracted) [S66]; vendor pricing pages (YNAB, Monarch, Kubera, EODHD, Paystack) [S55–S57][S63][S65]; Y Combinator deal page [S75]; RevenueCat State of Subscription Apps 2026 [S61]; Sensor Tower Nigeria app-revenue blog [S62]; company and regulator announcements reported by TechCabal, Techpoint, BusinessDay, Nairametrics, Vanguard, The National, Fintech News UAE, Forbes Middle East, TechCrunch and others. Academic claims were checked against Crossref by DOI (the OpenAlex-based reference-lookup tools timed out and OpenAlex's free quota was exhausted on 2026-11-02; Crossref returned DOIs for all ten references, nine to journal versions and one to a working-paper version — marked accordingly in §10).

**Tools.** WebSearch (extended mode for Nigerian/UAE facts), WebFetch for primary pages, `pdftotext` for PDFs, Python 3 for the sizing and unit-economics model (script reproduced in §4.4), Crossref API via curl for citations.

**What we could not access or verify.** (i) The CBN's own open-banking status page and Operational Guidelines PDF (relied on Open Banking Nigeria and Legal500 summaries); (ii) a current NGX market-data price list (2018 schedule used as a stale baseline); (iii) user counts for baraka, Wio Invest, StashAway MENA, Plum and Copilot; (iv) Nigerian fintech customer-acquisition-cost benchmarks (none published; assumptions used); (v) the exact text of the Nigeria Tax Act 2025 share-disposal exemption (two law-firm readings conflict — flagged for the Tax department); (vi) several pages returned HTTP 403 (TechCabal, Gulf Business, GlobeNewswire, Forbes, Cleo's annual report, TheCable) — where used, the figures come from search-result summaries and are graded down; (vii) the WebSearch budget shared across teams was exhausted mid-research, so some second-order facts (Nigerian diaspora headcount, BVN totals, app-store naira pricing policies, CBUAE third-party-provider licensing detail) remain unverified and are marked "not verified this session". Prior conversations, the founder's Drive and email were not used.

---

## 3. Findings

Each finding states the claim, the evidence grade, and sources. "Checked" dates are 2026-11-02 to 2026-11-04.

### 3A. Problem and customer

**F1. The founder's problem is real but narrow: multi-account, multi-currency individuals have no aggregation layer in Nigeria.** Nigeria's banks do not yet expose consented data-sharing APIs under the CBN framework (F12), so there is no Plaid-equivalent for consumers; the private aggregator Mono reports >8 million bank-account linkages, "about 12% of Nigeria's banked population", almost all through lenders rather than personal-finance apps [S35]. Budgeting guides for Nigerians note that "automatic bank account syncing does not work reliably with most Nigerian commercial banks" and that users forward SMS alerts instead [S-search, E4]. The observable workarounds are spreadsheets, bank-app balance checking, savings-app dashboards and, for the affluent, advisers at stockbrokers or asset managers. *Grade E3 for the data-rail facts; E4 for the workaround description (no survey of workarounds was found).*

**F2. Who plausibly feels the problem acutely in Nigeria is a small slice of adults.** EFInA A2F 2023 (national probability sample, 18+) estimates ~111 million adults; 52% (58.3 million) banked; 64% formally included; 26% excluded; 93% own a mobile phone, but basic phones remain the predominant device; 62% of adults earn below ₦100,000 a month with an average around ₦31,000; only 3% report ₦115,000–215,000 and 2% above ₦215,000 a month; 28% are aware of any capital-market term; 3% have used stocks/shares, 1% mutual funds, 1% treasury bills; pension uptake has been flat at ~8–9% of adults since 2018 [S1, pp. 28–29, 32, 48, and Table 5]. A 2025 consumer survey reported by The Guardian puts ~5% of respondents at ≥₦500,000 a month [S78, E4]. The segment that is banked, smartphone-equipped, earning above roughly ₦200,000 a month and holding at least one investment product is therefore in the **0.3–1.6 million** range (model in §4.2). *E2 for EFInA figures; E5 for the derived range.*

**F3. Small-business owners who mix personal and business money are the largest "entrepreneurial" group but the weakest payers.** 53% of adults own a business and 47% cite business as their main income source [S1 p. 28–29]; Moniepoint reports >6 million businesses served [S-search, E4]. These users need separation of business and personal cash flows — a genuine Portfolio OS use case (System A) — but their income distribution matches F2 and their tooling needs overlap with bookkeeping products, not wealth analytics. *E3/E4.*

**F4. Diaspora and UAE-resident Nigerians are the segment with purchasing power and multi-currency pain, but the UAE sub-segment is small and frictional.** Remittances to Nigeria were $21.8 billion in both 2024 and 2025 on CBN data [S17] and $22.1 billion/$22.8 billion on the World Bank series (7.8% of GDP in 2025) [S18]. LemFi, a diaspora remittance app, reports >1 million users and >$1 billion monthly volume [S74]. The UAE has ~11.3–11.6 million residents, ~88.5% expatriates [S19, E4]; Nigerians in the UAE are estimated at only 50,000–100,000 (2024, secondary) [S20, E4]; visa restrictions on Nigerians (work-visa suspensions from 2021; tourist/transit restrictions tightened again in July 2025) constrain growth of that community [S20][S21]. The total Nigerian diaspora headcount was **not verified this session**. *E3 for flows; E4 for headcounts.*

**F5. Willingness-to-pay signals for software are weak in Nigeria and moderate abroad.** Sensor Tower's Q3 2025 estimates for the top personal-finance/budgeting apps in Nigeria on Android show peak *weekly* revenues of about $155–221 per app and weekly active users in the hundreds to low thousands; YNAB had 6–8 weekly active users in Nigeria [S62, E3 — vendor estimate]. Nigerians do pay for entertainment subscriptions — Netflix Premium ₦8,500/month, Spotify ₦1,300/month [S69] — and for fintech *transactions* (Bamboo 1.5% per trade; Trove 1.35–1.5%; Cowrywise 1.5% capped ₦2,000; Risevest ~0.5% of assets plus fees) [S12]. Abroad, Monarch charges $14.99/month or $99.99/year [S55], YNAB $14.99/$109 [S56], Kubera $250/year (Essentials) and $2,500/year (Black) [S57]; Cleo reports 1.3 million paying subscribers and $254 million 2025 revenue, but 61.7% of it from cash-advance fees rather than subscriptions [S58, E3/E4]. *E3.*

**F6. A live demand signal for investing exists: the Dangote Refinery IPO.** The ~$1.6 billion offer closed on 27 October 2026 with orders of about ₦6.4 trillion ($4.78 billion), roughly three times the target, including >2 million investors subscribing through digital channels; minimum ticket ₦5,250 [S79][S80]. The NGX's own statements say retail participation rose from ~20% to ~33% of domestic value and that the Capital Market Master Plan target of 5 million active retail investors by 2025 was not met [S6, E3]. Retail investors accounted for ₦2.33 trillion (43%) of domestic transactions in January–August 2025 [S5]. *E3.* Implication: a wave of first-time shareholders will need statements, dividend tracking, capital-gains records and tax treatment — a time-bound wedge for Systems C/D/G.

### 3B. Market-size inputs

**F7. Investor-population counts are inconsistent across sources; use the low figures.** CSCS "holds roughly 6 million investor accounts, and only about 10% are active" (GTI Group CEO, December 2025) [S3]; a ThisDay/allAfrica report cites 15.6 million CSCS accounts at end-2025 and 17.3 million in 2026 to date, which appears to count sub-accounts/CHNs rather than people (direct fetch failed; not reconciled) [S4, E4]. Mutual-fund unit holders: 733,302 in money-market funds (April 2026) [S8] and 133,840 in equity funds (September 2026) [S9]; a secondary guide cites ~1.31 million unit holders in total (April 2026) [S10, E4]. Total mutual-fund NAV rose from ₦3.98 trillion (December 2024) to ₦5.98 trillion (June 2025) [S7] and to roughly ₦8.8 trillion by April 2026 (derived from the money-market share of 64.83%) [S8]. PenCom: 11,042,903 Retirement Savings Accounts (RSAs) at 31 December 2025, growing ~1% a quarter ("approaching saturation among salaried workers"), ₦27.45 trillion assets, 225,475 Personal Pension Plan accounts [S2]. *E2 (PenCom); E3 (press on SEC data); E4 (CSCS reconciliation).*

**F8. Savings/investment app bases (registered, not active, and overlapping).** PiggyVest >6 million users, ₦1.3 trillion paid out in 2025 (+56%), assets +110% [S11]; Cowrywise 500,000+ active users (other sources 800,000+ to "over 2 million") [S12][S13]; Risevest 600,000+ users (SEC has warned it is not registered to operate in the capital market) [S12]; Bamboo 500,000+ registered, 100,000+ active (April 2024) [S12]; Trove 400,000 registered [S12]; Chaka (acquired by Risevest, rebranded Hisa) 100,000+ [S12]; Kuda 7 million registered, 2024 revenue $18.3 million, loss $5.8 million, deposits ₦83 billion [S70]; OPay ~40 million registered (secondary) and 69% penetration among Nigerian smartphone users; PalmPay 29% [S14]. Unique investment-app users are plausibly **3–6 million**, mostly low-balance. *E3; de-duplication is E5.*

**F9. Smartphone penetration is disputed between a national survey and an urban study.** EFInA 2023 charts put smartphone ownership at roughly 29–33% of adults (national) [S1, Fig. 11]; KPMG/Orange's 2025 study of 13,251 respondents in 12 cities reports 75% (up from 64% in 2023), 96% Android [S14][S15]; NCC counts 158.5 million internet *subscriptions* in August 2026, over a third still on 2G [S16]. We model 33–60% of adults as smartphone users in 2026 (E5).

**F10. UAE wealth-tech is real but mid-sized and regulated.** Sarwa (ADGM-regulated, founded 2017) reports >300,000 registered users (December 2025), $879.7 million AUM at end-Q4 2025, >$1 billion by May 2026, ~$25 million raised in total and two consecutive profitable years [S22][S23][S24]. Comparable user counts for StashAway (DIFC), baraka, Wio Invest and bank robo products were **not retrieved**. National Bonds' savings index shows retirement is the top savings goal and 64% of residents are building emergency funds (February 2025) [S-search, E4]. *E3 for Sarwa.*

### 3C. Competitive and comparable evidence

**F11. The global lesson is unambiguous: free, ad-funded aggregation failed; paid, narrow, high-WTP products work — in high-income markets.** Intuit shut Mint on 23 March 2024 (peak >3.6 million active users; ~$15 ARPU on ads/referrals) and pushed users to Credit Karma, which lacked budgeting; Monarch (subscription-only, no ads) grew paid subscribers ~20× and raised $75 million at $850 million in May 2025; Sacra estimates ~$60 million ARR at end-2025 and ~$100 million by September 2026 [S53][S54, E3/E4]. Aggregator connections cost about $0.30 per connection per month, i.e. ~18% of gross margin at five connections on a ~$99/year plan [S53]. Cleo's growth came from behavioural AI *plus* credit products [S58]. Robo-advisers scale on assets: Betterment $56.4 billion/923,777 clients; Wealthfront $42.9 billion discretionary/491,179 advisory clients (Form ADV) and a December 2025 IPO at ~$2.05 billion [S59][S60]. *E3.*

**F12. In Nigeria, no venture-backed personal-finance-management (PFM) company has succeeded as software, and the data-infrastructure layer consolidated.** Okra (~$16 million raised) shut down in May 2025, citing the delayed open-banking regime, dollar-priced cloud costs after the 2023–24 devaluation and competition [S36]; Mono (~$17.5 million raised; $50 million post-money in 2021) was sold to Flutterwave for $25–40 million in stock in January 2026 [S35]; Bento (payroll) collapsed in February 2025 amid unremitted-pension allegations [S72]; Earnipay (financial wellness) cut staff and pivoted to business lending in 2025 [S73, E4]. Xara, a bootstrapped WhatsApp AI finance assistant launched June 2025, monetises on bill payments and airtime, not subscriptions [S81][S82, E4]. *E3.*

**F13. Open banking in Nigeria has not gone live.** The CBN's 1 August 2025 go-live "did not materialize"; industry workstreams delivered the Open Banking Registry requirements, consent framework and API specifications by September 2025; the CBN's February 2026 fintech report set a phased rollout "through mid-2026"; Open Banking Nigeria's page (updated July 2026) says the industry "awaits the next directive"; NIBSS is to operate the registry and consent system; participation requires registration and CBN licensing [S33][S34]. *E3 (checked 2026-11-04).*

### 3D. Regulatory and macro facts

**F14. Personalised investment advice delivered by software is regulated in Nigeria; general information is not clearly carved out.** The SEC's Rules on Robo-Advisory Services (executed 30 August 2021) define digital advisory services as "the provision of investment advice using automated, algorithm-based tools which are client-facing, with little or no human adviser interaction"; a robo-adviser must register under the rules for corporate/individual investment advisers; third-party technology providers need not register; portfolio management requires separate Fund/Portfolio Manager registration; algorithms must be audited before launch and continuously; suitability assessments and knock-out questions are mandatory [S28][S29]. The rules do not define a safe harbour for research or analytics without recommendations — a legal opinion is required (§9). The Investments and Securities Act 2025 has repealed the 2007 Act [S32]. On 16 January 2026 the SEC revised minimum capital: corporate investment adviser ₦5 million → **₦50 million**; robo-adviser ₦10 million → **₦100 million**; digital sub-broker → ₦100 million; fund/portfolio manager ₦2–5 billion; compliance by 30 June 2027 [S30]. At ₦1,346/$ these are $37,000, $74,000 and $1.5–3.7 million respectively. *E2.*

**F15. Nigerian tax law changed on 1 January 2026 and creates both a product opportunity and a verification burden.** The Nigeria Tax Act 2025 (signed 26 June 2025, effective 1 January 2026) repeals the Personal Income Tax Act and Capital Gains Tax Act; personal income tax bands: 0% on the first ₦800,000, 15% to ₦3 million, 18% to ₦12 million, 21% to ₦25 million, 23% to ₦50 million, 25% above; rent relief of 20% of rent capped at ₦500,000; residency tests include 183 days and "strong business or financial ties"; non-residents taxed on Nigerian-source income only [S39][S41]. Individual gains on shares are now taxed at personal rates, with an exemption described by one law firm as applying where aggregate disposals are below ₦150 million and gains do not exceed ₦10 million in any 12 consecutive months (another reading attaches additional conditions) — **conflicting secondary readings; the Act text must be checked by the Tax department** [S40]. A 13-digit Tax ID linked to the National Identification Number became effective 1 January 2026 [S42]; individuals file with state revenue services (the Lagos 2026 deadline was moved to 14 April) [S43, E4]. The UAE levies no personal income tax; VAT is 5%; corporate tax applies to business profits [S44]. *E2/E3; the share-gain exemption is E4 pending primary-text check.*

**F16. Data protection obligations start early and are tiered.** The Nigeria Data Protection Act 2023's General Application and Implementation Directive (GAID) took effect on 19 September 2025; controllers of "major importance" must register (commentary cites thresholds from 200 data subjects in six months, with higher tiers at 1,000 and 5,000), file annual Compliance Audit Returns through licensed auditors, and face penalties up to the greater of ₦10 million or 2% of gross revenue [S37][S85, E3/E4]. A 20-user cohort is below the threshold; a 1,000-user product is not. In the UAE, the Personal Data Protection Law's executive regulations were still outstanding as of June 2026 [S45, E3]. Digital lenders fall under FCCPC's 2025 DEON Regulations (enforcement from January 2026) — relevant only if Portfolio OS ever offers credit [S38]. *E2/E3.*

**F17. The UAE perimeter: onshore (CMA, formerly SCA) and the two free zones.** The SCA approved a federal robo-advisory regulation in July 2025 allowing licensed portfolio-management firms to offer algorithmic advice onshore, with independent IT audits, algorithm reviews and fee/risk disclosure [S25]; the SCA became the Capital Market Authority on 1 January 2026 under Federal Decree-Laws 32 and 33 of 2025 [S26]. DIFC advice falls under DFSA Category 4 (base capital reported at US$30,000 after 2025 reforms; commercial sources, unverified) and ADGM under FSRA, where Sarwa is licensed [S27, E4]. UAE Open Finance went live with Commercial Bank of Dubai and First Abu Dhabi Bank/Pay10 in December 2025 under Nebras/CBUAE; third-party-provider licensing terms were **not verified** [S46, E3/E4].

**F18. Macro conditions improved in 2026 but the FX history dominates any USD-cost, NGN-revenue model.** Headline inflation 14.63% in September 2026 (lowest since October 2020; food 19.59%) [S47]; CBN Monetary Policy Rate cut 350 bp to 23% on 22 September 2026 [S48]; NFEM close ₦1,346/$ on 30 October 2026 with the parallel market at ₦1,382–1,388 (a ~3% gap) [S49]; GDP per capita ~$1,224 (2025, World Bank, via secondary) [S50, E4]. Digital-payment fraud losses fell 51% to ₦25.85 billion in 2025, but reporting compliance also fell [S51]. Nigerian banks restored international spending on naira cards in 2025 with caps commonly $500–1,000 per month or quarter [S68, E4] — relevant to USD-priced subscriptions. Nigerian dollar millionaires: ~7,200 (−47% since 2015) [S77]. *E3.*

**F19. Venture capital for Nigerian consumer fintech is scarcer and more selective.** Partech: Africa raised $4.1 billion in 2025 (equity $2.4 billion across 462 deals); Nigeria $572 million ($412 million equity, $160 million debt), −3% year on year, 102 deals (−11%), the only top-four market with declining equity; 118 active equity investors in Nigeria (−30%); fintech 56% of Nigerian equity; the average seed ticket was $1.7 million; Seed+ volumes fell 4% to $462 million; only 5.5–6.5% of the 2021–2023 seed cohorts reached Series A within three years [S52]. YC's standard deal is $500,000 ($125,000 for 7% plus a $375,000 uncapped MFN SAFE; US/Cayman/Singapore/Canada parent required) [S75]. Hub71 (Abu Dhabi) offers roughly AED 250,000 cash via SAFE plus AED 250,000 in-kind, per commercial guides (official page not reachable) [S76, E4]. *E3.*

**F20. Behavioural-finance features have supportive but contested evidence, so they are a retention feature, not a commercial moat.** Goal-setting features in a fintech app increased saving (Gargano & Rossi, Journal of Finance 2024) [A6]; mobile access to financial information reduced spending (Levi & Benartzi, Journal of Finance 2026) [A10]; reminders increase saving (Karlan et al.) [A8]; robo-advice improved diversification for under-diversified investors (D'Acunto, Prabhala & Rossi 2019; Rossi & Utkus 2020) and extended access to lower-wealth households (Reher & Sokolinski 2024) [A1][A7][A9]. Against this, a meta-analysis found nudges effective (Mertens et al. 2021/22) [A4] while a re-analysis found "no evidence for nudging after adjusting for publication bias" (Maier et al. 2022) [A5]; financial-education effects are small in Fernandes et al. (2014) [A2] but positive in Kaiser et al. (2022) [A3]. *E1/E2 for the individual studies; the disagreement itself is the finding.*

---

## 4. Proposed framework / specification: the commercial architecture of Portfolio OS

### 4.1 Segments, jobs and current workarounds

| Segment | Size indicator (source) | Job-to-be-done Portfolio OS could own | Current workaround | WTP signal | Priority |
|---|---|---|---|---|---|
| S1. Nigeria-resident, multi-account, mass-affluent individuals (income > ~₦200k/month, ≥1 investment product) | 0.3–1.6m (model §4.2 from [S1][S7–S9]) | One auditable net-worth and cash-flow view across banks, PiggyVest/Cowrywise, broker, PFA; dividend and capital-gains records; NTA 2025 tax position | Spreadsheets; multiple apps; adviser at broker | Weak for software (F5); strong for transactions | Core for personal MVP; commercial only via tax/IPO wedge |
| S2. Diaspora Nigerians (UK/US/Canada/UAE) with Nigerian assets | Remittances $21.8–22.8bn/yr [S17][S18]; LemFi >1m users [S74] | NGN/USD/GBP consolidation; FX-adjusted returns; Nigerian tax residency and filing exposure; remittance-to-investment tracking | Spreadsheets; WhatsApp with family; remittance apps | Moderate: USD cards, used to $10/month apps | Best early *paying* segment |
| S3. UAE expatriates generally (mass-affluent) | ~10m expatriates [S19]; Sarwa 300k registered [S22] | Multi-currency net worth; end-of-service and home-country planning | Sarwa/StashAway/bank apps; Excel | Moderate–high | Only via a UAE-licensed partner; crowded |
| S4. Nigerian small-business owners mixing personal and business money | 53% of adults own a business [S1] | Separate personal from business flows; tax | Moniepoint/OPay business accounts; notebooks | Weak | Later; bookkeeping products own it |
| S5. B2B2C counterparties: PFAs (11.04m RSAs [S2]), brokers (~6m CSCS accounts, ~10% active [S3]), banks, employers, licensed advisers | ~20 PFAs; dozens of brokers; 24+ banks | White-label portfolio, tax-statement and financial-wellness analytics for their members | In-house dashboards; none for tax | Institutional budgets exist; procurement is slow | Most credible venture route |

### 4.2 Market sizing (top-down and bottom-up, ranges)

**Method.** Top-down funnels from EFInA adult counts through banking, smartphone, income, investing and willingness-to-pay filters; bottom-up from comparable paying bases. All multipliers are explicit; the two weakest inputs are **willingness to pay (E5, no direct evidence)** and **smartphone share (E3 conflicting, F9)**. Exchange rate ₦1,346/$ [S49].

| Step (Nigeria, 2026) | Low | High | Basis |
|---|---|---|---|
| Adults | 115m | 120m | 111m in 2023 [S1] + growth (E5) |
| × banked | 52% | 56% | 52% in 2023 [S1] |
| × smartphone | 33% | 60% | EFInA vs KPMG [S1][S14] |
| × income > ~₦200k/month | 5% | 8% | 5% above ₦115k in 2023 [S1]; inflation drift (E5) |
| × holds ≥1 investment product | 30% | 50% | 1.31m unit holders [S10]; ~0.6m active CSCS [S3]; 3–6m app users (F8) |
| **= addressable individuals** | **0.30m** | **1.61m** | |
| × willing to pay for software | 10% | 25% | E5; Sensor Tower suggests today's figure is far lower [S62] |
| **= paying users (SAM, people)** | **30k** | **403k** | |
| × ARPU $20–60/yr | | | §4.4 |
| **= Nigeria consumer revenue SAM** | **$0.6m/yr** | **$24m/yr** | |

| UAE / diaspora | Low | High | Basis |
|---|---|---|---|
| Digitally engaged UAE investors | 400k | 1.0m | Sarwa 300k registered [S22]; others unknown (E5) |
| × willing to pay $60–150/yr | 5% | 15% | E5 |
| = paying users / revenue | 20k / $1.2m | 150k / $22.5m | |
| Nigerians in UAE paying at 3–10% | 1.5k | 10k | 50–100k residents [S20] |
| Diaspora (all countries) | not sized: headcount unverified this session | | LemFi 1m+ users is the only hard anchor [S74] |

**Bottom-up cross-check.** Monarch needed the whole US market (>3.6m Mint refugees) to reach an estimated ~1m paying subscribers at ~$99 [S53][S54]. Cleo reached 1.3m payers across the US/UK with credit products [S58]. Nigeria's entire mutual-fund population is ~1.3m [S10] and active CSCS accounts ~0.6m [S3]. A **serviceable obtainable market of 20,000–150,000 paying users within five years** (consumer, all geographies) is the defensible planning range; revenue $1–10 million a year. B2B2C adds $0.3–3 million a year at $0.25–1.00 per covered member for 1–3 million members (model2 output), adviser seats $0.1–1 million, paid tax computations $0.04–0.9 million, a provenance-first NGX fundamentals API $0.06–1 million. **Total realistic five-year revenue envelope: $2–15 million a year.** That is a good business; it is marginal as a venture outcome unless the B2B2C or UAE lines scale beyond these ranges.

**Top-down TAM for completeness.** If every addressable Nigerian individual (1.6m), every digitally engaged UAE investor (1.0m) and 2m diaspora users paid $20–150 a year, the ceiling is roughly $0.1–0.5 billion a year — the number a pitch deck would show. The committee does not treat it as achievable; it is listed so reviewers can see the gap between TAM and SOM.

### 4.3 Competitive landscape

**Positioning map (two axes).** Horizontal: *scope* — single product (save/invest/pay) → whole balance sheet. Vertical: *monetisation* — spread/commission/assets → software subscription or licence.

```
                 Software / licence revenue
                          ^
   YNAB, Monarch, Copilot |  Kubera (multi-currency, $250–2,500)   <- Portfolio OS target quadrant
   (budget-first, US)     |  Empower dashboard (free; sells advice)
                          |
 Single product ----------+---------------------------------- Whole balance sheet
                          |
   Bamboo/Trove/Chaka     |  Sarwa, StashAway (robo, assets)
   PiggyVest/Cowrywise    |  Betterment/Wealthfront (assets)
   Risevest; bank apps    |  Cleo/Plum (behavioural AI + credit/assets)
                          v
                 Spread / commission / assets
```

The empty quadrant Portfolio OS targets (whole balance sheet, software revenue) is empty in Nigeria for a reason: aggregation is hard without open banking and consumers pay for products, not analysis. Kubera proves the quadrant exists for global multi-currency users at premium prices.

**Capability matrix.** ● = core; ◐ = partial; ○ = absent; ? = not verified.

| Player | Ledger / aggregation | Multi-currency (NGN/AED/USD) | Behavioural analytics | Investment research | Portfolio analytics | Tax (NG/UAE) | Monetisation | Scale (latest) |
|---|---|---|---|---|---|---|---|---|
| PiggyVest (NG) | ○ (own balances only) | ◐ (NGN/USD savings) | ◐ (goals, locks) | ○ | ○ | ○ | Interest spread | >6m users [S11] |
| Cowrywise (NG) | ○ | ◐ | ◐ (plans) | ○ | ◐ (fund returns) | ○ | 1.5% processing, fund fees | 0.5–0.8m [S12][S13] |
| Risevest / Hisa (NG) | ○ | ● (USD plans) | ○ | ◐ | ◐ | ○ | ~0.5% AUM + fees | 600k [S12] |
| Bamboo, Trove, Chaka (NG) | ○ | ● (US/NG stocks) | ○ | ◐ (basic) | ◐ | ○ | 1–1.5% commission | 0.1–0.5m [S12] |
| Kuda / OPay / PalmPay / bank apps | ◐ (own accounts; Kuda spend insights) | ○ | ◐ | ○ | ○ | ○ | Interest, fees, payments | 7m–40m [S14][S70] |
| Xara (NG, WhatsApp AI) | ◐ (via its wallet) | ○ | ◐ | ○ | ○ | ○ | Bill/airtime margins | ~50k claimed [S81] |
| Mono (Flutterwave) | ● (data infra, B2B) | ○ | ○ | ○ | ○ | ○ | API fees | 8m linkages [S35] |
| Stears / NGX data vendors | ○ | ○ | ○ | ● (B2B) | ○ | ○ | Data licences | n/a |
| Sarwa, StashAway (UAE) | ○ | ● (AED/USD) | ◐ | ◐ | ● (own portfolios) | ○ | AUM fees, trading | Sarwa 300k, $1bn AUM [S22][S23] |
| baraka, Wio Invest (UAE) | ○ | ● | ○ | ◐ | ◐ | ○ | Commission | ? |
| Mint (US, closed 2024) | ● | ○ | ◐ | ○ | ◐ | ○ | Ads/referrals (~$15 ARPU) | 3.6m peak [S54] |
| Monarch, Copilot, YNAB (US) | ● (via aggregators) | ◐ (USD-centric) | ◐ | ○ | ◐ | ○ | $90–110/yr | Monarch ~$100m ARR est. [S53] |
| Empower Personal Dashboard (US) | ● | ○ | ○ | ◐ | ● | ◐ | Free; upsell to advice | ? |
| Kubera (global) | ● (multi-aggregator) | ● | ○ | ○ | ● | ○ | $250–2,500/yr [S57] | ? |
| Cleo, Plum (US/UK) | ◐ | ○ | ● (chat coaching) | ○ | ◐ (Plum) | ○ | Subscription + credit/assets | Cleo 1.3m payers [S58] |
| Betterment, Wealthfront (US) | ◐ | ○ | ◐ | ○ | ● | ● (tax-loss harvesting) | AUM fees | $43–56bn AUM [S59] |
| Excel / Google Sheets | ● (manual) | ● | ○ | ○ | ◐ | ◐ | Free | ubiquitous |
| **Portfolio OS (target)** | ● (provenance-first) | ● | ◐ (restrained) | ● (NGX/UAE/US, validated) | ● | ● (NG + UAE) | Subscription + B2B2C | 1 user |

**Where Portfolio OS is genuinely differentiated** (no competitor in the matrix does all of these): (i) NGN/AED/USD consolidation with corporate-action handling for NGX holdings; (ii) a Nigerian tax engine for the 2026 regime (nobody in the table has one); (iii) provenance on every figure, which matters more in a market where the founder's previous tracker produced stale numbers and where retail trust in apps is thin. **Where it is not differentiated:** budgeting and spending analytics (every bank and savings app does a version, free); behavioural nudges (PiggyVest's locks and goals already embody the best-evidenced interventions, F20); US-stock research (free, abundant); robo portfolios (Sarwa et al. do it under licence, with assets). The AI explanation layer is table stakes by 2026, not a moat.

### 4.4 Business models and unit economics

**Model options and the regulation each triggers.**

| Model | Mechanics | Revenue potential (5-yr) | Regulatory trigger | Committee view |
|---|---|---|---|---|
| M1. Consumer subscription, NGN-priced | ₦2,500–7,500/month or ₦25,000/yr via Paystack/Flutterwave (web) or app stores | $0.6–24m SAM; SOM low single-digit $m | None if no personalised recommendations; NDPA registration at scale | Viable as cash-flow, not as venture |
| M2. Consumer subscription, USD-priced (diaspora/UAE) | $8–15/month; international cards 3.9% [S63] | $1–22m | UAE: CMA/DFSA/FSRA if advice; marketing rules | Best consumer economics; small Nigerian-specific base |
| M3. Freemium | Free ledger; paid tax, research, analytics | Converts 1–3% download-to-paid in emerging markets [S61] | As above | Required for distribution; dangerous for LLM cost (free users consume tokens) |
| M4. B2B2C through PFAs, brokers, banks, employers | Per-member licence $0.25–1.00/yr; or revenue share | $0.3–3m+ | Vendor due diligence; data processor under NDPA; no SEC licence if the partner is the regulated adviser | Most credible path to scale; 12–24-month sales cycles |
| M5. Advisory enablement (tools for licensed advisers) | Seats $40–80/month; tax statements per client | $0.1–1m | Adviser holds the licence; Portfolio OS is a third-party provider (SEC rules exempt tech providers from registration) [S28] | Low capital, high trust; small |
| M6. Data/analytics licensing (NGX fundamentals with provenance) | API $500–2,000/month per client | $0.06–1m | NGX redistribution licence (₦0.5–1.2m/yr on 2018 schedule) [S66] | Pays for the data pipeline the product needs anyway |
| M7. Regulated robo-advice / portfolio management | AUM fees | Potentially larger | SEC robo-adviser ₦100m capital; fund manager ₦2–5bn [S30]; UAE licences | Not before Stage 3; capital-heavy |

**Price anchors (₦1,346/$).** Spotify Nigeria ₦1,300 ($0.97); Netflix Premium ₦8,500 ($6.32) [S69]; proposed Basic ₦2,500 ($1.86), Pro ₦7,500 ($5.57), annual ₦25,000 ($18.57); diaspora/UAE $10–15. YNAB $109/yr [S56]; Monarch $99.99/yr [S55]; Kubera $250/yr [S57].

**Cost inputs.** Payments: Paystack local 1.5% + ₦100 (waived ≤ ₦2,500), capped ₦2,000; international 3.9% + ₦100 [S63]; app-store billing 15–30%. Large-language-model (LLM) API list prices (Anthropic, cached 2026-10-06): Opus 5.5 $4/$20 per million input/output tokens, Sonnet 5.5 $2/$10, Haiku 5.5 $0.10/$0.50, cache reads ~10% of input price, batch −50% [S67]. Market data: EODHD $19.99–$99.99/month for personal plans, commercial plans custom [S65]; NGX 2018 schedule: website/mobile real-time licence ₦625,000/yr, EOD vendor licence ₦500,000/yr, real-time feed ₦1.2m/yr, end-user Level-1 $3/month local (real-time) [S66] — use delayed/EOD data to avoid per-user fees. Support $0.25 and infrastructure $0.10 per paying user/month (E5). Churn 4–10%/month for monthly plans (RevenueCat MEA: 55% monthly-plan share, ~20% trial-to-paid, negative median MRR growth) [S61] (E5). CAC $8 (community/referral), $25 (mixed), $60 (paid) per paying subscriber — **no Nigerian benchmark exists; E5**.

**Per-subscriber economics (monthly, USD; Python model `model.py`/`model2.py`, reproduced in the research folder of this session).**

| Scenario (mix Basic/Pro/USD) | ARPU | Payment cost | LLM (medium use) | Variable total | Gross margin | LTV at 5% churn | LTV/CAC @ $25 | LTV/CAC @ $8 |
|---|---|---|---|---|---|---|---|---|
| Nigeria-heavy 65/20/15 | $3.82 | $0.11 | $1.03 | $1.54 | 60% | $46 | 1.8 | 5.7 |
| Balanced 40/20/40 | $5.86 | $0.20 | $1.03 | $1.63 | 72% | $85 | 3.4 | 10.6 |
| Diaspora/UAE-heavy 20/10/70 | $7.93 | $0.29 | $1.03 | $1.72 | 78% | $124 | 5.0 | 15.5 |
| UAE premium only ($15) | $15.00 | $0.58 | $1.03 | $2.02 | 87% | $260 | 10.4 | 32.5 |

LLM cost per *active* user per month: light use $0.17 (15 chats on Sonnet-class, 600 Haiku-class classifications), medium $1.03 (40 chats, 1,500 classifications, 2 Opus-class deep-research runs), heavy $4.47 (120 chats, 8 deep runs) — heavy users are loss-making at Nigerian prices (−30% gross margin), so rate limits or a usage tier are mandatory. App-store billing at 15% ($0.57 on the Nigeria-heavy ARPU) costs five times Paystack. Market-data licences (~$2,200/month fixed) are $0.72 per active at 3,000 actives and $0.007 at 300,000: they do not scale down.

**Payback and the CAC trap.** At the Nigeria-heavy ARPU, a $25 CAC pays back in ~11 months and a $60 CAC in ~26 months; with 7% monthly churn the median subscriber leaves before paying back a $25 CAC. The model only works with (a) near-zero CAC (community, employer or partner distribution), (b) a majority of USD-paying subscribers, or (c) annual prepaid plans that convert churn into a renewal decision.

**P&L sketch at scale (annual USD, Nigeria-heavy mix, medium LLM use, $25 blended CAC replacing ~90% of the base each year).**

| Paying subscribers | Revenue | Variable costs | Team & G&A | Compliance | Data licences | Acquisition | EBITDA |
|---|---|---|---|---|---|---|---|
| 10,000 | $0.46m | $0.18m | $0.66m | $0.06m | $0.04m | $0.23m | **−$0.71m** |
| 100,000 | $4.59m | $1.85m | $1.92m | $0.25m | $0.15m | $2.25m | **−$1.83m** |
| 1,000,000 | $45.9m | $18.5m | $7.2m | $0.9m | $0.6m | $22.5m | **−$3.8m** |

Costs that do not scale down: the data pipeline and licences, the compliance function (NDPA audits, SEC registration once advice is offered, UAE licence), a quant/tax rules team that must be senior, and LLM spend for free-tier users. Costs that improve the picture: the balanced or diaspora mix lifts the 100,000-subscriber line to roughly break-even and the 1,000,000 line to ~$15–25m EBITDA; a CAC of $8 instead of $25 lifts every line by ~$15 per subscriber-year. **CFO reading:** the business is a margin story driven by mix and acquisition channel, not by product features.

**Regulatory capital in USD (₦1,346/$):** SEC corporate investment adviser ₦50m = $37k; robo-adviser ₦100m = $74k; digital sub-broker ₦100m = $74k; fund/portfolio manager ₦2–5bn = $1.5–3.7m (all by 30 June 2027) [S30].

### 4.5 Defensibility assessment

| Candidate moat | Strength today | What a bank, PiggyVest or a global player could do | Verdict |
|---|---|---|---|
| Brand / trust (provenance-first, no fabricated figures) | None yet (one user) | Banks have trust by default; PiggyVest has 6m users and a decade of payouts [S11] | Earnable only through years of visible accuracy; not an initial moat |
| Proprietary behavioural research and validation data | None; evidence base is public and contested (F20) | PiggyVest already runs the best-evidenced interventions at scale | Weak; useful for retention, not defence |
| Multi-market data pipelines and NGX corporate-action handling | Hard, unglamorous, slow to copy | Brokers hold the data but lack product incentive; global players ignore NGX | **Real, modest moat if executed**; also a licensable asset (M6) |
| Nigeria/UAE tax-rule engine (2026 regime) | Nobody has it; rules just changed | Big-4 firms sell services, not software; banks will not build it | **Strongest near-term differentiator**; needs licensed review |
| Distribution partnerships (PFAs, brokers, employers) | None | Incumbents can sign the same partners | Winner-takes-most per partner; first-mover matters |
| Founder's unfair advantages | Lived multi-currency problem; cross-border network; domain knowledge | Gaps: no co-founder, no engineering team, no licence, prior tracker produced stale figures (Context Brief §1) | Honest assessment: motivation and insight, not yet execution evidence |

### 4.6 Staged plan, milestones and capital

| Stage | Duration | What must be proven | Milestones (measurable) | Capital and source | Team |
|---|---|---|---|---|---|
| 0. Personal system | 0–6 months | The ledger reconciles the founder's own NGN/AED/USD accounts to the kobo/fils/cent with provenance; tax position computed and checked by a practitioner | ≥99% reconciliation on 12 months of statements; zero unsourced figures in outputs; one accountant sign-off | $0–10k; founder time; LLM and data at personal-plan prices | Founder (+ contractor) |
| 1. 20 friendly users | 6–12 months | Others can onboard with their own statements; the product changes a decision | ≥12 of 20 weekly-active at week 12; ≥10 say they would pay ₦2,500+/month; ≥5 diaspora users would pay $10; NDPC check (stay below 200 data subjects or register) | <$25k; founder; no outside capital | Founder + 1 engineer (part-time) |
| 2. 1,000 paying users | 12–24 months | Willingness to pay and a repeatable channel | 1,000 paying with ≥35% USD payers or ≥1 signed B2B2C pilot; CAC < $15; 90-day retention ≥60%; tax-season conversion data | $0.4–0.5m pre-seed: angels, Microtraction/Ventures Platform/Future Africa-type funds (ticket sizes not verified this session), YC $500k [S75], Hub71 if UAE-anchored [S76] | 5: 2 engineers, 1 data/quant, 1 ops/compliance, founder |
| 3. Regulated product | 24–40 months | Economics at scale and licence to advise | 10,000+ paying or 500k B2B2C members; SEC investment-adviser registration (₦50m) or partner-held licence; UAE Cat-4-type licence via partner or own; audited data QA | $2–4m seed; African seed funds, UAE funds, strategic (PFA/bank) | 10–12 incl. compliance officer, tax lead, UAE lead |

Stage-2 costs modelled at ~$290k over 18 months before acquisition spend (five people at Nigerian market rates of ~$1,200–2,200/month each, data, LLM, legal, NDPC), i.e. $0.4–0.5m with $100–200k of acquisition; Stage 3 at ~$1.1m over 24 months before acquisition, including SEC capital and UAE compliance (model2 output; salary inputs E4 from [S83]).

### 4.7 Worked example (synthetic numbers): a diaspora subscriber in year 2

A UK-based Nigerian with a Lagos salary account, a PiggyVest dollar plan, 2,000 Dangote Refinery shares from the IPO, and a UAE savings account pays $10/month. Monthly cost to serve: payments $0.39 (3.9%), LLM $1.03 (medium), support $0.25, infrastructure $0.10, other $0.05, data allocation $0.07 at 30,000 actives — $1.89, gross margin 81%. Acquired through a diaspora community at $8 CAC: payback under one month; at 5% monthly churn, LTV ≈ $162 and LTV/CAC ≈ 20. The same person priced at ₦2,500 while resident in Lagos yields $1.86 ARPU, $0.03 payment cost, the same $1.43 of other variable cost, gross margin 23% at medium LLM use — negative if she asks many deep questions. The product is identical; the economics are determined by where the subscriber lives and how she is acquired.

---

## 5. Alternatives considered and rejected (or deferred)

| Alternative strategy | Case for it | Why rejected or deferred | Status |
|---|---|---|---|
| A1. Raise pre-seed now for the full nine-system consumer app | Vision is complete; AI makes building cheaper; Monarch shows post-Mint demand | No WTP evidence; Nigerian paid-PFM revenue ≈ nil [S62]; open banking not live [S34]; nine systems dilute a wedge; investors in Nigeria down 30% and seed-to-A conversion ~6% [S52] | **Rejected** at this stage |
| A2. Become a regulated robo-adviser (Nigeria) | Advice is the monetisable layer; SEC rules exist [S28] | ₦100m capital by mid-2027 [S30], algorithm audits, suitability duties; assets, not software, drive revenue; Risevest's warning shows enforcement risk [S12] | **Do-not-build (yet)** |
| A3. UAE-expat wealth product first | Highest ARPU; Sarwa shows a profitable path [S24] | Licensing (CMA/DFSA/FSRA), small Nigerian base (50–100k) [S20], crowded incumbents, founder's distribution is Nigerian | **Deferred**; pursue via partner |
| A4. B2B tooling for PFAs, brokers and licensed advisers (white-label analytics, tax statements) | 11m RSAs [S2]; partners hold licences; CAC ≈ 0; tech providers exempt from SEC registration [S28] | Long sales cycles; founder has no enterprise sales track record; needs a product first | **Kept as the primary venture route from Stage 2** |
| A5. Nigerian tax-preparation product (TurboTax-style) for the 2026 regime | Law changed 1 Jan 2026; Tax ID live; share gains newly taxable [S15]; nobody has software | State-level filing, low compliance culture, seasonal revenue, practitioner liability | **Kept as the wedge feature inside the ledger**, not standalone |
| A6. Data/analytics API for NGX fundamentals with provenance | Pays for the pipeline; brokers and media need it; licence fees known [S66] | Small market; Stears and vendors exist; NGX licensing terms current schedule unknown | **Later**, as a by-product |
| A7. Behavioural-AI coaching app (Cleo/Plum model) | Cleo's scale [S58] | Cleo monetises credit; evidence for nudges contested (F20); PiggyVest already owns the behaviour niche | **Rejected** |
| A8. Remain a personal tool indefinitely | Zero regulatory exposure; founder's problem solved | Forecloses the option; but costs nothing to keep open | **Default if kill criteria trip** |

---

## 6. Cross-department dependencies

**We need from other departments:** (i) Legal & Regulatory — a written opinion on whether analytics and research *without personalised recommendations* fall outside SEC "digital advisory services" [S28], the open-banking participation route for a non-licensed fintech [S33], NDPA tier at 20 and 1,000 users [S37], and the UAE marketing-to-residents perimeter; (ii) Tax Intelligence — confirmation of the NTA 2025 share-gain exemption text and state filing mechanics (F15), plus an estimate of a per-computation price a practitioner would co-sign; (iii) Data Architecture — a costed plan for statement ingestion without open banking and the real NGX/DFM/ADX data licence quotes (the 2018 schedule is stale); (iv) Behavioural Finance — which interventions survive the eight-question test so marketing never over-claims; (v) Product — a cohort instrumentation plan that produces the Stage-1 metrics in §4.6; (vi) Finance/Operations — Nigerian and UAE salary quotes to replace the E4 assumptions.

**Other departments need from us:** the segment priority (S2 diaspora before S1 Nigeria-resident, B2B2C from Stage 2), the price-point hypotheses to test, the kill criteria (§8.3) to design experiments against, and the rule that no feature may introduce a regulated activity before Stage 3.

---

## 7. Risks, open uncertainties and disagreements

### 7.1 Risk register (commercial and structural)

| Risk | Likelihood | Impact | Evidence | Mitigation |
|---|---|---|---|---|
| Willingness to pay in NGN is near zero | High | Fatal to M1 | [S62][S1] | Test in Stage 1; price in USD for diaspora; B2B2C |
| Open banking slips beyond 2027 | Medium–high | Degrades onboarding; higher support cost | [S34] | Statement upload + Mono; design for manual-first |
| Personalised outputs deemed "digital advisory" | Medium | Registration, ₦50–100m capital, audits | [S28][S30] | Legal opinion; partner-held licence; information-only framing |
| FX: USD costs (LLM, data, talent paid in USD) vs NGN revenue | High | Margin collapse on devaluation | [S36][S49] | USD revenue share ≥35%; naira-priced vendors where possible |
| Incumbent copies the wedge free (PiggyVest, Kuda, banks) | Medium | Price to zero | [S11][S70] | Depth (tax, multi-market), B2B2C exclusivity |
| LLM cost per heavy user exceeds ARPU | High at NGN prices | Negative gross margin | §4.4 | Usage tiers, caching, small models for routine tasks |
| Data-vendor and LLM-provider dependency | Medium | Price shocks, deprecations | Mint's aggregator costs [S53]; Okra's cloud costs [S36] | Multi-vendor abstraction; cache; licence terms reviewed |
| Fraud/social engineering against users of a "financial OS" | Medium | Trust loss, liability | [S51] | Read-only data, no money movement in Stages 0–2 |
| Talent flight ("japa") and USD-indexed salaries | High | Cost base drifts to UAE levels | [S83] | Small senior team; equity; UAE lead only when funded |
| Regulatory capital hikes (SEC 2026 circular) repeated | Medium | Raises Stage-3 cost | [S30] | Partner licences; keep advice out of scope |
| Diaspora segment too dispersed to acquire cheaply | Medium | CAC > $25 | §4.4 | Community partnerships, employer and remittance-app channels |

### 7.2 Open uncertainties
1. Actual willingness to pay for *this* product (E5) — the single most important unknown.
2. Nigerian diaspora headcount and income distribution (not verified).
3. Current NGX, DFM and ADX data-licence pricing for redistribution to retail users (2018 schedule only).
4. Whether SEC will issue updated robo-advisory rules under ISA 2025 (none found).
5. CBUAE Open Finance third-party licensing cost and timeline for a non-bank.
6. Exact NTA 2025 share-gain exemption wording and the 2026 state filing calendar.
7. App-store naira pricing and payout mechanics (unverified) versus web billing.

### 7.3 Preserved disagreements

| Issue | VC partner | CEO / strategy | CFO | YC-style operator | Proposed resolution path |
|---|---|---|---|---|---|
| Fund now? | No. Pass at pre-seed for a consumer app; would re-open for a B2B/adviser or tax wedge with signed pilots | Build the wedge (ledger + tax) and prove WTP in 9 months before raising; raising now would set the wrong milestones | Numbers say no unless USD payers exceed ~35% of the base or CAC < $10 | Nigerians do not pay for "insight"; find a painful, time-bound job (tax deadline, IPO allotment, FX reconciliation) | Stage 1 metrics decide; revisit at month 9 |
| Which first segment? | Diaspora/UAE (ARPU) | Nigeria-resident mass-affluent (founder's network, data access) | Diaspora (payment rails, margin) | Whoever answers a cold message and uploads a statement within 48 hours | Run both in the 20-user cohort (10/10); pick by retention and WTP |
| Is the nine-system vision an asset or a liability? | Liability for fundraising; asset as architecture | Asset: it is the reason the product is different | Liability: fixed costs of C/D/G before revenue | Liability: ship the ledger and one wedge; everything else is a roadmap slide | Keep the architecture; sequence the build (Doc 1–8 owners to agree) |
| Behavioural analytics as a selling point? | No; contested evidence invites regulator and press scrutiny | Yes, if "scientifically restrained" is the brand | Neutral; it costs little | No; nobody buys restraint | Position as trust/retention feature; never in acquisition copy |
| Regulated advice eventually? | Only through partners | Own licence by Stage 3 to capture value | Partner first; own licence when revenue > $3m | Never, unless it is the business | Decision deferred to Stage-3 gate with legal opinion |

---

## 8. Recommendations, ranked

Classification: *Personal-MVP must-have* / *Later* / *Do-not-build (yet)*. Each top item is subjected to the five-question test (Context Brief §6) **from a commercial standpoint**.

### 8.1 Ranked recommendations

1. **Build the provenance-first multi-currency ledger (System A) and prove it on the founder, then 20 users** — *Personal-MVP must-have*. It is the precondition for every monetisable feature and the only thing competitors in Nigeria do not do (F1, §4.3).
2. **Build the Nigerian tax computation for individuals under the 2026 regime (System G) as the first paid feature, with a licensed practitioner reviewing every rule** — *Personal-MVP must-have*; paid launch *Later* (Stage 2). It is the strongest near-term differentiator and time-bound demand exists (F6, F15).
3. **Build validated NGX/US/UAE holdings analytics (C/D) only to the depth needed to value and tax the user's own portfolio; license data for internal use, not redistribution** — *Personal-MVP must-have* for holdings; *Later* for research breadth.
4. **Price in USD for diaspora/UAE users from the first paid cohort; keep NGN pricing as an annual prepaid plan** — *Later* (Stage 2); the unit economics (§4.4) make this the difference between a business and a hobby.
5. **Pursue one B2B2C pilot (PFA, broker or employer) in Stage 2 before any priced round** — *Later*; the most credible venture route (A4).
6. **Keep behavioural analytics (B) as an internal measurement and retention layer; do not market it** — *Later*; evidence contested (F20).
7. **Do not offer personalised recommendations, portfolio management or money movement before Stage 3 and a legal opinion** — *Do-not-build (yet)* (F14).
8. **Do not build a free tier with unmetered AI chat** — *Do-not-build (yet)*; heavy users are loss-making at NGN prices (§4.4).
9. **Do not raise institutional capital before the Stage-1 signals** — governance recommendation; see §8.3.

### 8.2 Five-question test on the top three capabilities (commercial lens)

| Question | 1. Multi-currency, provenance-first ledger | 2. Nigerian tax computation (2026 regime) | 3. Validated multi-market holdings analytics |
|---|---|---|---|
| Real problem? | Fragmented NGN/AED/USD money with no aggregation rail (F1) | New Act, new Tax ID, share gains newly taxable, no consumer software (F15) | Stale or wrong market figures in existing tools (Context Brief §1); IPO cohort needs records (F6) |
| Who needs it and why? | Multi-account mass-affluent and diaspora (S1, S2): decisions on FX, savings allocation, debt | Salaried and investing Nigerians, diaspora with Nigerian income; compliance and refunds | Retail shareholders (~0.6m active [S3], 2m+ IPO subscribers [S79]) and their advisers |
| Evidence for the approach? | Kubera's paid multi-currency niche [S57]; Monarch's post-Mint growth [S54]; Mono's 8m linkages show demand for connectivity [S35] (E3) | Regulatory change is the demand driver (E2); tax software precedent is foreign, not Nigerian (E4) | Provenance requirements from the brief (E5); data vendors exist [S65][S66] (E3) |
| Build and validate reliably? | Statement parsing + Mono + manual; reconciliation tests to the unit of currency; weakest link is bank-statement formats | Versioned rule engine; test cases signed by a licensed practitioner; weakest link is unverified Act text (F15) | Licensed EOD data; corporate-action tests against NGX notices; weakest link is DFM/ADX data access |
| Measurable improvement to justify continuing? | ≥12/20 weekly-active at week 12; ≥99% reconciliation; users report a decision changed | ≥500 paid computations in first tax season at ≥₦10,000; error rate <1% on audited sample | ≥95% of holdings priced within one trading day with source and timestamp; zero unsourced figures |
| Commercial verdict | Necessary, not sufficient; monetises only through 2 and 3 | Best wedge; seasonal; needs practitioner liability cover | Monetises better B2B (M5/M6) than B2C |

### 8.3 Fund / no-fund recommendation and kill criteria

**Recommendation: no-fund at pre-seed today; founder-financed Stages 0–1; re-evaluate at month 9.** Approach angels or a pre-seed fund only when **two of three wedge signals** are observed: (a) in the friendly cohort, ≥40% of users pay the NGN or USD price after a three-month free period and 90-day retention is ≥60%; (b) a signed B2B2C pilot or letter of intent from a PFA, broker, bank or employer, or ≥10 licensed advisers paying for seats; (c) a tax-season test sells ≥500 computations at ≥₦10,000 (or ≥100 at ≥$25 to diaspora users). At seed (Stage 3), fund only if ≥35% of subscription revenue is USD-denominated or B2B2C members exceed 250,000, CAC is below $15, and the legal opinion on the advisory perimeter is in hand.

**Kill criteria (stop treating Portfolio OS as a company; keep it as a personal tool):**

| Gate | Kill if | Rationale |
|---|---|---|
| End of Stage 0 (month 6) | Founder cannot reconcile own accounts to ≥99% with provenance within 6 months of effort | If the data problem is unsolved for one motivated user, it is unsolved for 1,000 |
| End of Stage 1 (month 12) | <8 of 20 users weekly-active at week 12, or <5 would pay anything, or no diaspora user would pay $10 | Below this the SAM arithmetic (§4.2) has no bottom-up support |
| Stage 2 (month 18) | <300 paying after 6 months of selling, or CAC > $40 per payer, or 90-day retention < 45% | LTV/CAC < 1 at Nigeria-heavy mix (§4.4) |
| Stage 2 (month 24) | No B2B2C pilot signed and USD payers < 20% of base | Consumer-NGN-only business cannot carry fixed data/compliance costs |
| Any time | Legal opinion concludes core outputs are regulated advice and no partner will hold the licence | Capital requirement and audit burden exceed Stage-2 funding |
| Any time | Naira depreciates >40% in 12 months while USD revenue share < 25% | Okra's failure mode [S36] |

**Alternative outcomes if killed as a venture:** keep the personal system; open-source the NGX corporate-action and tax-rule libraries to build reputation; license the tax engine to a practitioner firm; or sell the data pipeline to a broker.

---

## 9. Required validation before implementation

1. **Legal opinion (Nigerian capital-markets counsel):** whether holdings analytics, research summaries and tax computations without recommendations fall outside SEC digital advisory rules [S28]; the implications of ISA 2025; the open-banking participation route [S33].
2. **Licensed tax practitioner review:** NTA 2025 individual provisions used by the engine (bands, rent relief, residency, share-gain exemption, foreign-income relief), filing authority and 2026–27 deadlines; indemnity and engagement terms for paid computations.
3. **Data-protection registration assessment (NDPC-licensed consultant):** tier under GAID at each stage, Compliance Audit Return obligations, cross-border transfer rules for UAE users [S37].
4. **UAE counsel (free-zone and onshore):** marketing to UAE residents, Category-4-type licensing thresholds, PDPL status, Open Finance TPP route [S25–S27][S45][S46].
5. **Market-data licence quotes:** current NGX, DFM, ADX and US redistribution/internal-use terms to replace the 2018 schedule [S66].
6. **Cohort experiment design (with Product and Behavioural Finance):** pre-registered metrics for Stage 1 (§4.6), consented synthetic-then-real data, and a pricing test with real payment collection, not surveys.
7. **Cost benchmarking (Finance):** salary quotes in Lagos and Dubai; LLM token measurement from the actual prototype to replace the E5 usage profiles; payment-processor and FX leakage measured on real NGN and USD charges.
8. **Independent check of this memo's weakest inputs:** willingness to pay, smartphone share, diaspora headcount, CAC — all E5/E4 — before any number here enters a pitch.

---

## 10. Sources

Access dates: 2026-11-02 to 2026-11-04 unless stated. "Search summary" means the page was located by WebSearch but a direct fetch failed; such figures are graded E4 unless corroborated.

**Market, regulators and official data**
- [S1] EFInA, *Access to Financial Services in Nigeria (A2F) 2023 Survey Report*, 2024. https://a2f.ng/wp-content/uploads/2024/07/A2F-2023-SURVEY-REPORT-1.pdf (PDF read in full). E2.
- [S2] National Pension Commission, *Q4 2025 Pension Industry Information Dashboard*, 2026. https://www.pencom.gov.ng/wp-content/uploads/2026/08/Final-PenCom-Q4-2025-Dashboard.pdf. E2.
- [S3] Nairametrics, "GTI Group CEO: Only 10% of 6 million CSCS accounts are active", 7 Dec 2025. http://nairametrics.com/2025/12/07/gti-group-ceo-only-10-of-6-million-cscs-accounts-are-active/. E3.
- [S4] ThisDay/allAfrica, "CSCS: Reshaping Nigeria's Capital Market Infrastructure for Development", 29 Sep 2026. https://allafrica.com/stories/202609290700.html (search summary; fetch 403). E4.
- [S5] Nairametrics, "NGX: Retail investors boost trading with N2.33 trillion in 8 months", 7 Oct 2025. http://nairametrics.com/2025/10/07/ngx-retail-investors-boost-trading-with-n2-33-trillion-in-8-months/. E3.
- [S6] The Guardian (Nigeria), "NGX targets 30 million retail investors to deepen liquidity", 2026. https://guardian.ng/business-services/ngx-targets-30-million-retail-investors-to-deepen-liquidity/ (search summary; fetch 503). E4.
- [S7] Blueprint, "Nigeria: Safe-haven demand pushes mutual funds to N5.98trn in H1 2025", 21 Jul 2025. https://blueprint.ng/nigeria-safe-haven-demand-pushes-mutual-funds-to-n5-98trn-in-h1-2025/. E3.
- [S8] Nairametrics, "Best performing money market funds in Nigeria as of April 2026", 12 May 2026. https://nairametrics.com/2026/05/12/best-performing-money-market-funds-in-nigeria-as-of-april-2026/. E3.
- [S9] Nairametrics, "Best performing equity mutual funds in Nigeria as of September 2026", 9 Oct 2026. https://nairametrics.com/2026/10/09/best-performing-equity-mutual-funds-in-nigeria-as-of-september-2026/. E3.
- [S10] KudiCompass, "Mutual Funds in Nigeria: Your Complete Guide", updated 4 Sep 2026. https://kudicompass.com/mutual-funds-nigeria-guide/. E4.
- [S11] Techpoint Africa, "PiggyVest reports ₦1.3 trillion in payouts and over 6 million users in 2025", 3 Jan 2026. https://techpoint.africa/news/piggyvest-2025-payouts/. E3.
- [S12] BusinessDay, "Top fintech apps powering Nigeria's investment boom", 19 Feb 2026. https://businessday.ng/technology/article/top-fintech-apps-powering-nigerias-investment-boom/. E3.
- [S13] TechCabal, "From Bamboo to Trove: Where Nigerians are investing their money in 2025", 4 Oct 2025. https://techcabal.com/2025/10/04/investment-platforms-in-nigeria/ (search summary; fetch 403). E4.
- [S14] BusinessDay, "Nigeria's smartphone ownership rises to 75%, reshaping digital economy", 25 Sep 2026. https://businessday.ng/news/article/nigerias-smartphone-ownership-rises-to-75-reshaping-digital-economy/. E3.
- [S15] KPMG Nigeria, *Nigeria Smartphone Study*, Sep 2026. https://kpmg.com/ng/en/insights/2026/09/nigeria-smartphone-study.html. E3.
- [S16] Techeconomy, "Nigeria's internet subscribers rise to 153.15 million in March 2026 — NCC data" and later NCC figures (search summary). https://techeconomy.ng/nigerias-internet-subscribers-rise-to-153-15-million-in-march-2026-ncc-data/. E3.
- [S17] Vanguard, "Diaspora remittances stabilises at $21.8bn in 2025 amid global pressures", 19 May 2026 (CBN Q4 2025 bulletin). https://www.vanguardngr.com/2026/05/diaspora-remittances-stabilises-at-21-8bn-in-2025-amid-global-pressures/. E3.
- [S18] Intelpoint, "Personal remittance inflows to Nigeria increased 3.0% ... $22.8 billion in 2025" (World Bank series), 2026. https://intelpoint.co/insights/personal-remittance-inflows-to-nigeria-increased-3-0-year-on-year-from-22-1-billion-in-2024-to-22-8-billion-in-2025/. E3.
- [S19] Global Media Insight, "UAE Population Statistics 2026", 19 Oct 2026. https://www.globalmediainsight.com/blog/uae-population-statistics/. E4.
- [S20] Wikipedia, "Nigerians in the United Arab Emirates" (citing Business Insider Africa, 25 Aug 2024). https://en.wikipedia.org/wiki/Nigerians_in_the_United_Arab_Emirates. E4.
- [S21] Vanguard, "Full list: UAE imposes fresh travel conditions on Nigerians, bans transit visa", Jul 2025. https://www.vanguardngr.com/2025/07/full-list-uae-imposes-fresh-travel-conditions-on-nigerians-bans-transit-visa-others/ (search summary). E3.
- [S22] Forbes Middle East, "The Middle East's Fintech 50 2026 — Sarwa". https://www.forbesmiddleeast.com/lists/the-middle-easts-fintech-50-2026/sarwa/. E3.
- [S23] GlobeNewswire, "Sarwa Reaches $1B in Client Assets", 8 May 2026. https://www.globenewswire.com/news-release/2026/05/08/3291359/0/en/sarwa-reaches-1b-in-client-assets-a-first-for-a-homegrown-uae-fintech.html (search summary; fetch 403). E4.
- [S24] Fintech News UAE, "6 Homegrown Robo-Advisory Platforms in the Middle East to Watch in 2026", 3 Feb 2026. https://fintechnews.ae/11321/abudhabi/robo-advisory-platforms-in-the-middle-east/. E3.
- [S25] The National, "UAE's federal regulation of robo-advisory services aimed to protect retail investors", 4 Jul 2025. https://www.thenationalnews.com/business/money/2025/07/04/uae-investing-robo-advisory/. E3.
- [S26] Wikipedia, "Capital Market Authority (United Arab Emirates)"; UAE Legislation portal entry for Federal Decree-Law No. 32 of 2025. https://en.wikipedia.org/wiki/Capital_Market_Authority_(United_Arab_Emirates); https://uaelegislation.gov.ae/en/legislations/4001. E3/E4.
- [S27] Zitadelle AG, "DFSA Category 4 Licence 2026"; 10 Leaves, "DIFC Category 4 License" (commercial guides). https://www.zitadelleag.com/services/investment-licensing/dubai-dfsa-category-4; https://10leaves.ae/publications/difc/category-4-difc-investment-advisory-license-difc-license-categories. E4 (unverified against DFSA rulebook).
- [S28] SEC Nigeria, *Rules on Robo-Advisory Services*, executed 30 Aug 2021 (PDF read). https://sec.gov.ng/documents/1292/Rules-on-Robo-Advisory-Services_Executed-30-August-2021.pdf. E2.
- [S29] SEC Nigeria, "SEC Rules for FinTechs". https://home.sec.gov.ng/our-mandate/regulation/rules-and-regulations/sec-rules-for-fintechs/. E2.
- [S30] SEC Nigeria, "Revised Minimum Capital (MC) for Regulated Capital Market Entities", circular published 16 Jan 2026. https://sec.gov.ng/for-investors/keep-track-of-circulars/revised-minimum-capital-mc-for-regulated-capital-market-entities/. E2.
- [S31] SEC Nigeria, "Investment Adviser (Corporate) Registration Requirements", 22 May 2025. https://sec.gov.ng/about/resources/checklists/individual-registration-requirements-for-each-cmo/investment-adviser-corporate-registration-requirements/ (search summary). E2.
- [S32] SEC Nigeria, "Robo Adviser Registration Requirements". https://sec.gov.ng/about/resources/checklists/individual-registration-requirements-for-each-cmo/robo-adviser-registration-requirements/. E2.
- [S33] Legal500 / Syntegral Legal Practice, "Legal insights on the Central Bank of Nigeria open banking initiative", 16 Sep 2025. https://www.legal500.com/intelligence/nigeria/finance-and-banking/legal-insights-on-the-central-bank-of-nigeria-open-banking-initiative. E3.
- [S34] Open Banking Nigeria, "Open banking in Nigeria" (updated Jul 2026) and "Has Nigeria's open banking conversation lost momentum?", 28 Oct 2025. https://openbanking.ng/open-banking-in-nigeria/; https://openbanking.ng/has-nigerias-open-banking-conversation-lost-momentum/. E3.
- [S35] TechCrunch, "Flutterwave buys Nigeria's Mono in rare African fintech exit", 5 Jan 2026. https://techcrunch.com/2026/01/05/flutterwave-buys-nigerias-mono-in-rare-african-fintech-exit. E3.
- [S36] Techlabari, "Nigerian open banking startup Okra quietly shut down in May 2025", 2 Jul 2025. https://techlabari.com/nigerian-open-banking-startup-okra-quietly-shut-in-may-2025/. E3.
- [S37] Andersen Nigeria, "GAID 2025 takes effect: a new data privacy compliance era", 2025. https://ng.andersen.com/gaid-2025-takes-effect-a-new-data-privacy-compliance-era-for-nigeria-businesses/. E3.
- [S38] FCCPC, "Digital Lending Rule: FCCPC goes after violators", 21 Jan 2026. https://fccpc.gov.ng/digital-lending-rule-fccpc-goes-after-violators/. E2.
- [S39] Legal500 (orig. Mondaq), "Understanding Personal Income Tax under the Nigerian Tax Act 2025", 2025. https://www.legal500.com/intelligence/nigeria/tax/understanding-personal-income-tax-under-the-nigerian-tax-act-2025. E3.
- [S40] Tope Adebayo LP, *Nigeria Tax Act 2025: An Outlook of Income and Profit Taxation*, Jul 2025 (PDF read). https://topeadebayolp.com/wp-content/uploads/2025/07/Nigeria-Tax-Act-2025.pdf. E3.
- [S41] EY, "Nigeria Tax Act, 2025 has been signed — highlights", 2025. https://www.ey.com/en_gl/technical/tax-alerts/nigeria-tax-act-2025-has-been-signed-highlights (search summary). E3.
- [S42] FCT-IRS / Joint Revenue Board / Nigeria Revenue Service, "Nigerian Tax ID Portal goes live effective January 1, 2026". https://fctirs.gov.ng/nigerian-tax-id-portal-goes-live/. E2.
- [S43] TechCabal, "How to file tax on the LIRS eTax portal", 2 Apr 2026. https://techcabal.com/2026/04/02/how-to-file-tax-on-the-lirs-etax-portal/ (search summary). E4.
- [S44] UAE Government portal, "Taxation". https://u.ae/en/information-and-services/finance-and-investment/taxation. E2.
- [S45] Morgan Lewis, "UAE establishes federal authority for artificial intelligence and data", Jun 2026. https://www.morganlewis.com/pubs/2026/06/uae-establishes-federal-authority-for-artificial-intelligence-and-data (search summary). E3.
- [S46] Gulf Business, "Commercial Bank of Dubai becomes UAE's first bank live on Open Finance", Dec 2025; Gulf Today, "Pay10, FAB go live with UAE Open Finance plan", 30 Dec 2025. https://gulfbusiness.com/en/2025/finance/commercial-bank-of-dubai-becomes-uaes-first-bank-live-on-open-finance/; https://www.gulftoday.ae/business/2025/12/30/pay10-fab-go-live-with-uae-open-finance-plan (search summaries). E3.
- [S47] Trading Economics, "Nigeria Inflation Rate" (NBS data; September 2026 = 14.63%). https://tradingeconomics.com/nigeria/inflation-cpi. E3.
- [S48] Trading Economics, "Nigeria Interest Rate" (MPR 23% from 22 Sep 2026); ThisDay, "The CBN's rate reset", Oct 2026. https://tradingeconomics.com/nigeria/interest-rate; https://www.thisdaylive.com/2026/10/19/%C2%B7-the-cbns-rate-reset/. E3.
- [S49] Nigerian Tribune, "Naira appreciates against dollar at official FX market" (NFEM ₦1,346.00, 30 Oct 2026; parallel ₦1,382/1,388). https://tribuneonlineng.com/naira-appreciates-against-dollar-at-official-fx-market-12/. E3.
- [S50] World Factbooks (World Bank WDI 2025: GDP $290.79bn; $1,224 per capita; population 237.5m). https://www.worldfactbooks.com/country/nigeria/ (search summary). E4.
- [S51] Techeconomy, "NIBSS: digital payment fraud drops 51% to ₦25.85bn in 2025", 2 Jun 2026. https://techeconomy.ng/nibss-digital-payment-fraud-drops-51-to-25-85b-in-2025. E3.
- [S52] Partech, *2025 Africa Tech Venture Capital Report* (PDF read) and press release, 22 Jan 2026. https://partech-admin.prod.unomena.io/media/documents/2025_Partech-Africa-Tech-VC-Report.pdf; https://partechpartners.com/news/2025-partech-africa-tech-vc-report-african-tech-funding-rebounds-to-us41b-driven-by-record-debt-activity-and-disciplined-equity-growth. E3.

**Companies, pricing and comparables**
- [S53] Sacra, "Monarch at $100M ARR", 5 Oct 2026 (analyst estimates). https://sacra.com/research/monarch-money-at-100m-arr/. E4.
- [S54] Tech Funding News, "Personal finance app Monarch rises with $75M at $850M valuation after Mint's meltdown", 26 May 2025. https://techfundingnews.com/personal-finance-app-monarch-rises-with-75m-after-mints-meltdown-a-soonicorn-on-cards/. E3.
- [S55] Monarch, pricing page ($14.99/month; $99.99/year). https://www.monarch.com/pricing. E3.
- [S56] YNAB, pricing page ($14.99/month; $109/year; 34-day trial). https://www.ynab.com/pricing. E3.
- [S57] Kubera, home/pricing (Essentials $250/yr; Black $2,500/yr). https://www.kubera.com/. E3.
- [S58] Cleo, *2025 Annual Report* (fetch 403); Sacra, "Cleo at $150M ARR"; ARR Club, "Cleo ARR hits $250M" (search summaries). https://web.meetcleo.com/2025-annual-report; https://sacra.com/research/cleo-at-150m-arr/. E4.
- [S59] The Motley Fool, "The Largest Robo-Advisors by AUM, Users, and Returns", updated 12 Feb 2026 (Form ADV data). https://www.fool.com/money/research/largest-robo-advisors/. E3.
- [S60] Forbes, "Fintech robo-advisor Wealthfront gets a tepid Wall Street reception for its IPO", 12 Dec 2025 (search summary; fetch 403). https://www.forbes.com/sites/jeffkauflin/2025/12/12/fintech-robo-advisor-wealthfront-gets-a-tepid-wall-street-reception-for-its-ipo/. E4.
- [S61] RevenueCat, *State of Subscription Apps 2026*. https://revenuecat.com/report. E3.
- [S62] Sensor Tower, "Top 5 Personal Finance Apps on Android in Nigeria, Q3 2025", Sep 2025 (vendor estimates). https://sensortower.com/blog/2025-q3-android-top-5-personal%20finance%20budgeting%20and%20planning-revenue-ng-63e363f0e1714cfff1979caa. E3.
- [S63] Paystack, "Transactions pricing" (support article; search summary) — 1.5% + ₦100 capped ₦2,000; international 3.9% + ₦100. https://support.paystack.com/hc/en-us/articles/360009881920. E3.
- [S64] Flutterwave Nigeria pricing as reported by comparison sites (2.0% local; 4.8% international) — unverified. E4.
- [S65] EODHD, pricing page. https://eodhd.com/pricing. E3.
- [S66] The Nigerian Stock Exchange, *Schedule 4 — Market Data Pricelist 2018* (PDF read; dated). https://doclib.ngxgroup.com/market_data-site/market-data-services-site/Data%20Policies/NSE%20Market%20Data%20Pricelist%202018.pdf. E3 (stale).
- [S67] Anthropic Claude API pricing table (skill reference cached 2026-10-06): Opus 5.5 $4/$20, Sonnet 5.5 $2/$10, Haiku 5.5 $0.10/$0.50 per MTok; cache reads ~10%; batch −50%. E3.
- [S68] TheCable, "After years of suspension, Nigerian banks resume international transactions on naira cards", 2025 (search summary; fetch 403). https://www.thecable.ng/after-years-of-suspension-nigerian-banks-resume-international-transactions-on-naira-cards/. E4.
- [S69] Techloy / TheCondia on Netflix (₦8,500 Premium, 2025), Spotify (₦1,300, Nov 2024) and Apple Music (₦1,300) Nigerian prices (search summaries). https://thecondia.com/netflix-raises-prices-in-nigeria-2025/; https://www.techloy.com/apple-music-raises-subscription-prices-in-nigeria-by-30-percent/. E3.
- [S70] BusinessDay, "Kuda cuts losses to $5.8m as fintech shifts focus to profitability", 14 Jan 2026. https://businessday.ng/technology/article/breaking-kuda-cuts-losses-to-5-8m-as-fintech-shifts-focus-to-profitability/. E3.
- [S71] Nairametrics, "Kuda lays off hundreds of staff across departments", 27 Mar 2026 (search summary). https://nairametrics.com/2026/03/27/kuda-lays-off-hundreds-of-staff-across-departments-in-restructuring-move/. E3.
- [S72] TechCabal, "Bento 'temporarily' shuts down after rehiring staff to handle backlog", 10 Feb 2025. https://techcabal.com/2025/02/10/bento-africa-temporarily-shut-down/ (search summary). E3.
- [S73] CB Insights / Techpoint, Earnipay layoffs and pivot to business lending, Apr 2025 (search summary). https://www.cbinsights.com/company/earnipay. E4.
- [S74] LaunchBase Africa and others, "LemFi raises $53m Series B", Jan 2025. https://launchbaseafrica.com/2025/01/14/lemfi-led-by-opay-alumni-raises-53m-in-series-b-to-tap-into-booming-remittance-market. E3.
- [S75] Y Combinator, "The YC Deal". https://www.ycombinator.com/deal. E2.
- [S76] Hub71 Access programme as described by commercial guides (official page returned 404). https://gulfpitch.com/programs/hub71/. E4.
- [S77] Henley & Partners, *Africa Wealth Report 2025*. https://www.henleyglobal.com/publications/africa-wealth-report-2025/millionaire-momentum-powers-africas-rise. E3.
- [S78] The Guardian (Nigeria), "How much to be considered rich in Nigeria?" (citing SEID Consumer Outlook), 2025 (search summary). https://guardian.ng/nigerian/how-much-to-be-considered-rich-in-nigeria/. E4.
- [S79] CNBC Africa (Reuters), "Dangote refinery IPO draws three times target demand, sources say", 28 Oct 2026. https://www.cnbcafrica.com/2026/dangote-refinery-ipo-draws-three-times-target-demand-sources-say. E3.
- [S80] Legit.ng, "Dangote Refinery closes $1.6bn IPO as investors from 119 countries rush for shares", 29 Oct 2026. https://www.legit.ng/business-economy/capital-market/1738555-dangote-refinery-closes-16bn-ipo-investors-119-countries-rush-shares/. E3.
- [S81] Technext, "WhatsApp fintech Xara crosses ₦10 billion transaction milestone in first year", 5 Jun 2026 (search summary). https://technext24.com/2026/06/05/whatsapp-xara-crosses-%e2%82%a610-b-transaction/. E4.
- [S82] Techpoint Africa, Xara founder profile (bootstrapped), 2025–26 (search summary). https://techpoint.africa/feature/nigerian-xara-founder-xai-offer/. E4.
- [S83] Payscale, Life Indexed, Plane and Indeed UAE salary pages for software engineers (search summaries; wide ranges). https://www.payscale.com/research/NG/Job=Software_Engineer/Salary; https://plane.com/salaries/software-engineer/nigeria; https://ae.indeed.com/career/software-engineer/salaries/Remote. E4.
- [S84] TheCable, "Registry of participants, customers' consent… CBN issues guidelines for open banking", 2023 (search summary; fetch 403). https://www.thecable.ng/registry-of-participants-customers-consent-cbn-issues-guidelines-for-open-banking/. E4.
- [S85] Digital Policy Alert; Legal500/Balogun Harold on GAID 2025 DCPMI tiers and Schedule 10 fees (search summaries). https://digitalpolicyalert.org/change/13818-registration-as-a-data-controller-or-data-processor-of-major-importance-requirement-in-nigeria-data-protection-act-2023-general-application-and-implementation-directive-2025-ndpcndp-act-gaid012025. E4.

**Academic references (checked against Crossref by DOI on 2026-11-02; OpenAlex/arXiv lookup tools unavailable)**
- [A1] D'Acunto, F., Prabhala, N. & Rossi, A. G. (2019). "The Promises and Pitfalls of Robo-Advising". *Review of Financial Studies*. https://doi.org/10.1093/rfs/hhz014 **[verified]**.
- [A2] Fernandes, D., Lynch, J. G. & Netemeyer, R. G. (2014). "Financial Literacy, Financial Education, and Downstream Financial Behaviors". *Management Science*. https://doi.org/10.1287/mnsc.2013.1849 **[verified]**.
- [A3] Kaiser, T., Lusardi, A., Menkhoff, L. & Urban, C. (2022). "Financial education affects financial knowledge and downstream behaviors". *Journal of Financial Economics*. https://doi.org/10.1016/j.jfineco.2021.09.022 **[verified]**.
- [A4] Mertens, S., Herberz, M., Hahnel, U. J. J. & Brosch, T. (2021/2022). "The effectiveness of nudging: A meta-analysis of choice architecture interventions across behavioral domains". *PNAS*. https://doi.org/10.1073/pnas.2107346118 **[verified]** (correction: 10.1073/pnas.2204059119).
- [A5] Maier, M., Bartoš, F., Stanley, T. D., Shanks, D. R., Harris, A. J. L. & Wagenmakers, E.-J. (2022). "No evidence for nudging after adjusting for publication bias". *PNAS*. https://doi.org/10.1073/pnas.2200300119 **[verified]**.
- [A6] Gargano, A. & Rossi, A. G. (2024). "Goal Setting and Saving in the FinTech Era". *Journal of Finance*. https://doi.org/10.1111/jofi.13339 **[verified]**.
- [A7] Reher, M. & Sokolinski, S. (2024). "Robo advisors and access to wealth management". *Journal of Financial Economics*. https://doi.org/10.1016/j.jfineco.2024.103829 **[verified]**.
- [A8] Karlan, D., McConnell, M., Mullainathan, S. & Zinman, J. "Getting to the Top of Mind: How Reminders Increase Saving". Working paper 2010, https://doi.org/10.2139/ssrn.1652784 **[partially verified: Crossref matched the working paper; the *Management Science* 2016 journal version was not retrieved]**.
- [A9] Rossi, A. G. & Utkus, S. P. (2020). "Who Benefits from Robo-advising? Evidence from Machine Learning". SSRN working paper. https://doi.org/10.2139/ssrn.3552671 **[verified as working paper]**.
- [A10] Levi, Y. & Benartzi, S. (2026). "Mind the App: Mobile Access to Financial Information and Consumer Behavior". *Journal of Finance*. https://doi.org/10.1111/jofi.70087 **[verified]**.

*Calculation scripts:* `model.py` and `model2.py` (Python 3, no external dependencies) were run on 2026-11-02; inputs and outputs are reproduced in §4.2 and §4.4. Reviewers can re-run them by copying the assumptions listed there.
