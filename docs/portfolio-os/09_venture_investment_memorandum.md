```
Document: 09 — Venture Capital Investment Memorandum (competitive analysis and commercialisation strategy)
Department: Executive Leadership and Venture Strategy  ·  Lead role(s): VC partner / investment-committee lead; CEO / startup-strategy lead; CFO; YC-style operator
Version: 0.2  ·  Date: 2026-11-04 (v0.1 research 2026-11-02 to 2026-11-04; revision 2026-11-04)  ·  Status: revised after independent review
Reviewers required: Legal & Regulatory (incl. CITN Act opinion); Tax Intelligence (G); Data Architecture & Provenance (A/H); Behavioural Finance (B); Investment Research & Quant (C/D); Product & Design; Finance/Operations; a licensed Nigerian tax practitioner; the founder (inputs flagged "founder to confirm")
```

**Reading guide.** Version 0.2 responds to red-team review R09 and to revision-log items V-012 (data costs) and V-023 (tax-practice regulation). The wedge, the unit economics, the sizing funnel, the raise signals and the kill criteria have been rebuilt; §11 lists every finding and what was done with it. The canonical contracts (`CANONICAL_CONTRACTS.md`) govern wherever this memo touches the ledger (C1), data status (C3), FX (C5) or tax-rule status (C7). This memorandum answers one question: whether, and under what conditions, Portfolio OS — which begins as the founder's personal financial-intelligence system — could become a venture-scale Nigerian (then wider) financial-technology company. It is written as an investment committee would write it: conclusions first, numbers with sources and dates, a real bear case, kill criteria and alternatives. The four simulated roles disagree in places; those disagreements are preserved in §7 and §8 rather than averaged away. Every market figure carries a source number [S#] (list in §10) and an evidence grade (E1–E6, defined in the Context Brief §5). Figures that could not be verified are labelled as such. Nothing here is legal, tax or investment advice; §9 names the licensed reviews required before anything is relied upon.

---

## 1. Executive summary

**Conclusion.** Do not fund Portfolio OS today and do not raise outside capital yet. The committee keeps **"build-to-learn, no-fund-yet"**: build the personal system, then run priced tests with *non-friend* users, and approach angels only if two of three signals that can be read by month 9 (August 2027) pass (§8.3). The wedge is narrower than v0.1 claimed. Mass-retail holders of Nigerian shares, including the IPO cohort, have no tax to compute: gains are exempt below ₦150m proceeds **and** ₦10m gains (NTA s.34(1)(a)), and dividends bear final withholding (Doc 6 F12–F13). The tax pain sits with **cross-border investors**: foreign shares (no threshold), foreign currency as a chargeable asset (s.34(1)(b)) and diaspora residency under the disjunctive s.201 definition. The candidate wedge is a cross-border tax-and-records pack that Portfolio OS prepares and a CITN-registered practitioner co-signs; the taxpayer files (NTAA s.33). B2B2C stays the main venture route, priced as flat licences.

**Why.** The ₦2,500 Basic plan is $1.86 gross and $1.73 after 7.5% VAT. After payment, aggregation and support costs it contributes $0.49 a month (29% margin), and LTV/CAC is 0.3 at a $25 CAC and 7% monthly churn. A 65/20/15 Nigeria-heavy mix earns 42% margin and LTV/CAC 0.9; a $10 USD plan earns 59% and 3.2. With one churn input, a USD-only product breaks even near 30,000 payers and a diaspora-heavy mix near 71,000; a Nigeria-heavy mix never does at a $25 CAC. The USD-payer share needed for LTV/CAC ≥ 3 depends on measured churn: 62% at 5% and 92% at 7% for a $25 CAC, or 31% and 49% for a $15 CAC (§4.4).

**Biggest uncertainty.** Willingness to pay and monthly churn, for which no direct evidence exists. Second, whether selling tax computations for a fee is "practice of taxation" under CITN Act s.16 and s.19. We have read the Act's text but have no legal opinion.

---

## 2. Scope and method

**Questions addressed.** (A) Who has the problem and how do they cope today; (B) market size with sourced assumptions; (C) competitive landscape in Nigeria, the UAE/MENA and globally; (D) business models, pricing and unit economics; (E) regulatory and structural risk; (F) defensibility; (G) staged plan and capital; (H) bear case, kill criteria, alternatives and a fund/no-fund recommendation.

**What we searched.** Primary and institutional sources where available: EFInA Access to Financial Services (A2F) 2023 survey report (full PDF extracted and read) [S1]; National Pension Commission (PenCom) Q4 2025 industry dashboard (PDF) [S2]; SEC Nigeria rules on robo-advisory services (2021, PDF), the SEC FinTech rules page and the January 2026 revised minimum-capital circular [S28–S32]; Central Bank of Nigeria (CBN) open-banking framework commentary and Open Banking Nigeria status pages [S33][S34]; Nigeria Tax Act 2025 commentaries (Legal500, Tope Adebayo LP, EY) [S39–S41]; the Nigerian Tax ID portal notice [S42]; UAE government taxation page [S44]; Partech 2025 Africa Tech VC report (PDF extracted) [S52]; NGX (then NSE) market-data price list 2018 (PDF extracted) [S66]; vendor pricing pages (YNAB, Monarch, Kubera, EODHD, Paystack) [S55–S57][S63][S65]; Y Combinator deal page [S75]; RevenueCat State of Subscription Apps 2026 [S61]; Sensor Tower Nigeria app-revenue blog [S62]; company and regulator announcements reported by TechCabal, Techpoint, BusinessDay, Nairametrics, Vanguard, The National, Fintech News UAE, Forbes Middle East, TechCrunch and others. Academic claims were checked against Crossref by DOI (the OpenAlex-based reference-lookup tools timed out and OpenAlex's free quota was exhausted on 2026-11-02; Crossref returned DOIs for all ten references, nine to journal versions and one to a working-paper version — marked accordingly in §10).

**Tools.** WebSearch (extended mode for Nigerian/UAE facts), WebFetch for primary pages, `pdftotext` for PDFs, Crossref API via curl for citations. Python 3: `research/scripts/doc09_unit_economics_mix.py` (per-subscriber model) and `research/scripts/doc09_sizing_and_unit_economics.py` (funnel, segment, P&L, breakeven, capital, signals). Both run under `python3 -I` with the standard library only.

**Revision pass (v0.2, 2026-11-04).** We read review R09 in full, revision-log rows V-012 and V-023, the canonical contracts C1–C7, Doc 4 F2/F8/R10, Doc 5c F1–F4/§4.6 and Doc 6 F10–F19/F34–F38. Facts we changed were re-checked on 2026-11-04:
- Paystack's pricing article, fetched;
- the CITN Act text (Laws of the Federation 2004, as hosted by the Policy and Legal Advocacy Centre), fetched;
- Google Play service fees, fetched;
- fiscalreforms.ng, fetched (the calculator URL redirected to the committee's home page);
- press reports of the government PIT calculator launch, by search;
- the UN DESA diaspora estimate, through a secondary site, by search;
- Crossref metadata for A8.

The reviewer's own recomputation is `research/scripts/r09_unit_economics_sensitivity.py`. Our scripts reproduce its outputs before applying v0.2 changes, so the two can be compared line by line.

**What we could not access or verify.** (i) The CBN's own open-banking status page and Operational Guidelines PDF (relied on Open Banking Nigeria and Legal500 summaries); (ii) NGX's bespoke commercial quote. The 2026 schedule now comes from Doc 5c [S86], which replaces the 2018 list; whether personal analytics count as non-display use is unanswered until NGX replies in writing; (iii) user counts for baraka, Wio Invest, StashAway MENA, Plum and Copilot; (iv) Nigerian fintech customer-acquisition-cost benchmarks (none published; assumptions used); (v) *resolved in v0.2:* Doc 6 read the share-disposal exemption in the gazette (F15). Not resolved: amendments to the CITN Act after 2004, and any court ruling on software-based tax computation; (vi) several pages returned HTTP 403 (TechCabal, Gulf Business, GlobeNewswire, Forbes, Cleo's annual report, TheCable) — where used, the figures come from search-result summaries and are graded down; (vii) the WebSearch budget shared across teams was exhausted mid-research, so some second-order facts (Nigerian diaspora headcount, BVN totals, app-store naira pricing policies, CBUAE third-party-provider licensing detail) remain unverified and are marked "not verified this session". Prior conversations, the founder's Drive and email were not used.

---

## 3. Findings

Each finding states the claim, the evidence grade, and sources. "Checked" dates are 2026-11-02 to 2026-11-04.

### 3A. Problem and customer

**F1. The founder's problem is real but narrow: multi-account, multi-currency individuals have no aggregation layer in Nigeria.** Nigeria's banks do not yet expose consented data-sharing APIs under the CBN framework (F12), so there is no Plaid-equivalent for consumers; the private aggregator Mono reports >8 million bank-account linkages, "about 12% of Nigeria's banked population", almost all through lenders rather than personal-finance apps [S35] (company claim that TechCrunch did not verify: **E4**). Mono's published Basic tier is ₦50,000 a month for up to 100 accounts (Doc 4 F2, undated page), about $0.37 per linked account per month, so aggregation is a variable cost, not a free fallback. Budgeting guides for Nigerians note that "automatic bank account syncing does not work reliably with most Nigerian commercial banks" and that users forward SMS alerts instead [S-search, E4]. The observable workarounds are spreadsheets, bank-app balance checking, savings-app dashboards and, for the affluent, advisers at stockbrokers or asset managers. *Grade E3 for the data-rail facts; E4 for the workaround description (no survey of workarounds was found).*

**F2. Who plausibly feels the problem acutely in Nigeria is a small slice of adults.** EFInA A2F 2023 (national probability sample, 18+) estimates ~111 million adults; 52% (58.3 million) banked; 64% formally included; 26% excluded; 93% own a mobile phone in the main text but 87.9% in the appendix (an inconsistency inside the source), and basic phones remain the predominant device (smartphone ownership 26.6% in the appendix, about 29% in the chart); 62% of adults earn below ₦100,000 a month with an average around ₦31,000; only 3% report ₦115,000–215,000 and 2% above ₦215,000 a month; 28% are aware of any capital-market term; 3% have used stocks/shares, 1% mutual funds, 1% treasury bills; pension uptake has been flat at ~8–9% of adults since 2018 [S1, pp. 28–29, 32, 48, and Table 5]. A 2025 consumer survey reported by The Guardian puts ~5% of respondents at ≥₦500,000 a month [S78, E4]. The segment that is banked, smartphone-equipped, earning above roughly ₦200,000 a month and holding at least one investment product is in the **1.4–4.3 million** range (model in §4.2). v0.1 gave 0.3–1.6 million by multiplying the filters as if they were independent. Among the top 5–8% of earners, banking and smartphone ownership are close to universal, so the shares must be conditional (R09 M5). *E2 for EFInA figures; E5 for the derived range. The conditional share P(banked and smartphone | high income) = 0.80–0.90 is an assumption until the EFInA income cross-tabulation is obtained.*

**F3. Small-business owners who mix personal and business money are the largest "entrepreneurial" group but the weakest payers.** 53% of adults own a business and 47% cite business as their main income source [S1 p. 28–29]; Moniepoint reports >6 million businesses served [S-search, E4]. These users need separation of business and personal cash flows — a genuine Portfolio OS use case (System A) — but their income distribution matches F2 and their tooling needs overlap with bookkeeping products, not wealth analytics. *E3/E4.*

**F4. Diaspora and UAE-resident Nigerians are the segment with purchasing power and multi-currency pain, but the UAE sub-segment is small and frictional.** Remittances to Nigeria were $21.8 billion in both 2024 and 2025 on CBN data [S17] and $22.1 billion/$22.8 billion on the World Bank series (7.8% of GDP in 2025) [S18]. LemFi, a diaspora remittance app, reports >1 million users and >$1 billion monthly volume [S74]. The UAE has ~11.3–11.6 million residents, ~88.5% expatriates [S19, E4]; Nigerians in the UAE are estimated at only 50,000–100,000 (2024, secondary) [S20, E4]; visa restrictions on Nigerians (work-visa suspensions from 2021; tourist/transit restrictions tightened again in July 2025) constrain growth of that community [S20][S21]. The total Nigerian diaspora headcount is about **1.8 million (2020) to 2.1 million (2024)** on UN DESA's International Migrant Stock (2,094,265 at mid-2024), taken from a secondary site that republishes UN data. The UN table itself was not downloaded, and the distribution by country of destination was not retrieved [S89, E4]. *E3 for flows; E4 for headcounts.*

**F5. Willingness-to-pay signals for software are unmeasured in Nigeria and moderate abroad.** Sensor Tower's Q3 2025 estimates for the top personal-finance and budgeting apps in Nigeria on Android show peak revenues of about $155–221 per app. Only two of the four figures carry a stated weekly unit: Wallet $221 and YNAB $209. Budge ($218) and Money Manager ($155) carry no unit. Active users range from a few for YNAB (6–8 weekly) to a 17.7K peak for Money Tracker [S62, re-checked by R09]. These are Google Play estimates in a market where card-on-file in-app billing is rare and fintechs collect by bank transfer or Paystack on the web. They measure the app-store channel, not willingness to pay, so they are graded **E4 for willingness to pay** and are no longer cited as "≈ nil" (R09 M6). Nigerians do pay for entertainment subscriptions — Netflix Premium ₦8,500/month, Spotify ₦1,300/month [S69] — and for fintech *transactions* (Bamboo 1.5% per trade; Trove 1.35–1.5%; Cowrywise 1.5% capped ₦2,000; Risevest ~0.5% of assets plus fees) [S12]. Abroad, Monarch charges $14.99/month or $99.99/year [S55], YNAB $14.99/$109 [S56], Kubera $250/year (Essentials) and $2,500/year (Black) [S57]; Cleo reports 1.3 million paying subscribers and $254 million 2025 revenue, but 61.7% of it from cash-advance fees rather than subscriptions [S58, E3/E4]. *E3.*

**F6. A live demand signal for investing exists: the Dangote Refinery IPO.** The ~$1.6 billion offer closed on 27 October 2026 with orders of about ₦6.4 trillion ($4.78 billion), roughly three times the target, including >2 million investors subscribing through digital channels; minimum ticket ₦5,250 [S79][S80]. The NGX's own statements say retail participation rose from ~20% to ~33% of domestic value and that the Capital Market Master Plan target of 5 million active retail investors by 2025 was not met [S6, E3]. Retail investors accounted for ₦2.33 trillion (43%) of domestic transactions in January–August 2025 [S5]. *E3.* Implication (revised in v0.2): a wave of first-time shareholders will need statements, dividend tracking, corporate-action records and registrar correspondence, which makes them a free top-of-funnel for Systems A, C and D. They are **not** a tax wedge. A ₦5,250 subscriber (≈ $3.90) is far below the s.34(1)(a) exemption of ₦150m proceeds and ₦10m gains, and net Nigerian dividends are "not charged to further tax" (NTAA s.51(3)) (Doc 6 F12–F13, gazette text, **E2**).

### 3B. Market-size inputs

**F7. Investor-population counts are inconsistent across sources; use the low figures.** CSCS "holds roughly 6 million investor accounts, and only about 10% are active" (GTI Group CEO, December 2025) [S3]; a ThisDay/allAfrica report cites 15.6 million CSCS accounts at end-2025 and 17.3 million in 2026 to date, which appears to count sub-accounts/CHNs rather than people (direct fetch failed; not reconciled) [S4, E4]. Mutual-fund unit holders: 733,302 in money-market funds (April 2026) [S8] and 133,840 in equity funds (September 2026) [S9]; a secondary guide cites ~1.31 million unit holders in total (April 2026) [S10, E4]. Total mutual-fund NAV rose from ₦3.98 trillion (December 2024) to ₦5.98 trillion (June 2025) [S7] and to roughly ₦8.8 trillion by April 2026 (derived from the money-market share of 64.83%) [S8]. PenCom: 11,042,903 Retirement Savings Accounts (RSAs) at 31 December 2025, growing ~1% a quarter ("approaching saturation among salaried workers"), ₦27.45 trillion assets, 225,475 Personal Pension Plan accounts [S2]. *E2 (PenCom); E3 (press on SEC data); E4 (CSCS reconciliation).*

**F8. Savings/investment app bases (registered, not active, and overlapping).** PiggyVest >6 million users, ₦1.3 trillion paid out in 2025 (+56%), assets +110% [S11]; Cowrywise 500,000+ active users (other sources 800,000+ to "over 2 million") [S12][S13]; Risevest 600,000+ users (SEC has warned it is not registered to operate in the capital market) [S12]; Bamboo 500,000+ registered, 100,000+ active (April 2024) [S12]; Trove 400,000 registered [S12]; Chaka (acquired by Risevest, rebranded Hisa) 100,000+ [S12]; Kuda 7 million registered, 2024 revenue $18.3 million, loss $5.8 million, deposits ₦83 billion [S70]; OPay ~40 million registered (secondary) and 69% penetration among Nigerian smartphone users; PalmPay 29% [S14]. Unique investment-app users are plausibly **3–6 million**, mostly low-balance. *E3; de-duplication is E5.*

**F9. Smartphone penetration is disputed between a national survey and an urban study.** EFInA 2023 charts put smartphone ownership at roughly 29–33% of adults (national) [S1, Fig. 11]; KPMG's *Nigeria Smartphone Study* (page dated September 2026; fieldwork year not stated) of 13,251 respondents in 12 cities reports 75% (BusinessDay: up from 64% in 2023), 96% Android [S14][S15]. NCC counts 158.5 million internet *subscriptions* in August 2026, over a third still on 2G [S16]. v0.1 modelled 33–60% of all adults as smartphone users. Its low bound was above EFInA's own national 26.6%, and the share was applied as if independent of income. v0.2 instead uses smartphone ownership conditional on high income (§4.2) (E5).

**F10. UAE wealth-tech is real but mid-sized and regulated.** Sarwa (ADGM-regulated, founded 2017) reports >300,000 registered users (December 2025), $879.7 million AUM at end-Q4 2025, >$1 billion by May 2026, ~$25 million raised in total and two consecutive profitable years [S22][S23][S24]. Comparable user counts for StashAway (DIFC), baraka, Wio Invest and bank robo products were **not retrieved**. National Bonds' savings index shows retirement is the top savings goal and 64% of residents are building emergency funds (February 2025) [S-search, E4]. *E3 for Sarwa.*

### 3C. Competitive and comparable evidence

**F11. The global lesson is unambiguous: free, ad-funded aggregation failed; paid, narrow, high-WTP products work — in high-income markets.** Intuit shut Mint on 23 March 2024 (peak >3.6 million active users; ~$15 ARPU on ads/referrals) and pushed users to Credit Karma, which lacked budgeting; Monarch (subscription-only, no ads) grew paid subscribers ~20× and raised $75 million at $850 million in May 2025; Sacra estimates ~$60 million ARR at end-2025 and ~$100 million by September 2026 [S53][S54, E3/E4]. Aggregator connections cost about $0.30 per connection per month, i.e. ~18% of gross margin at five connections on a ~$99/year plan [S53]. Cleo's growth came from behavioural AI *plus* credit products [S58]. Robo-advisers scale on assets: Betterment $56.4 billion/923,777 clients; Wealthfront $42.9 billion discretionary/491,179 advisory clients (Form ADV) and a December 2025 IPO at ~$2.05 billion [S59][S60]. *E3.*

**F12. In Nigeria, no venture-backed personal-finance-management (PFM) company has succeeded as software, and the data-infrastructure layer consolidated.** Okra (~$16 million raised) shut down in May 2025, citing the delayed open-banking regime, dollar-priced cloud costs after the 2023–24 devaluation and competition [S36]; Mono (~$17.5 million raised; $50 million post-money in 2021) was sold to Flutterwave for $25–40 million in stock in January 2026 [S35]; Bento (payroll) collapsed in February 2025 amid unremitted-pension allegations [S72]; Earnipay (financial wellness) cut staff and pivoted to business lending in 2025 [S73, E4]. Xara, a bootstrapped WhatsApp AI finance assistant launched June 2025, monetises on bill payments and airtime, not subscriptions [S81][S82, E4]. *E3.*

**F13. Open banking in Nigeria has not gone live.** The CBN's 1 August 2025 go-live "did not materialize"; industry workstreams delivered the Open Banking Registry requirements, consent framework and API specifications by September 2025; the CBN's February 2026 fintech report set a phased rollout "through mid-2026"; Open Banking Nigeria's page (updated July 2026) says the industry "awaits the next directive"; NIBSS is to operate the registry and consent system; participation requires registration and CBN licensing [S33][S34]. *E3 (checked 2026-11-04).*

### 3D. Regulatory and macro facts

**F14. Personalised investment advice delivered by software is regulated in Nigeria; general information is not clearly carved out.** The SEC's Rules on Robo-Advisory Services (executed 30 August 2021) define digital advisory services as "the provision of investment advice using automated, algorithm-based tools which are client-facing, with little or no human adviser interaction"; a robo-adviser must register under the rules for corporate/individual investment advisers; third-party technology providers need not register; portfolio management requires separate Fund/Portfolio Manager registration; algorithms must be audited before launch and continuously; suitability assessments and knock-out questions are mandatory [S28][S29]. The rules do not define a safe harbour for research or analytics without recommendations — a legal opinion is required (§9). The Investments and Securities Act 2025 (assented 31 March 2025) has repealed the 2007 Act (Doc 6 F35; v0.1 wrongly cited a registration checklist [S32] for this). On 16 January 2026 the SEC revised minimum capital: corporate investment adviser ₦5 million → **₦50 million**; robo-adviser ₦10 million → **₦100 million**; digital sub-broker → ₦100 million; fund/portfolio manager ₦2–5 billion; compliance by 30 June 2027 [S30]. At ₦1,346/$ these are $37,000, $74,000 and $1.5–3.7 million respectively. *E2.*

**F15. Nigerian tax law changed on 1 January 2026. For mass-retail investors it creates little to compute; for cross-border investors it creates real, liability-bearing work.** Tax facts here follow Doc 6, which read the gazetted texts; Doc 6 governs where this memo differs.
- **Commencement and bands.** The Nigeria Tax Act 2025 (NTA) commenced on 1 January 2026 and repeals the Personal Income Tax Act and the Capital Gains Tax Act. The NTAA's own commencement bracket reads 26 June 2025 (R06). The personal income tax bands are 0% on the first ₦800,000, then 15%, 18%, 21% and 23%, and 25% above ₦50 million. Rent relief is 20% of rent, capped at ₦500,000 (Doc 6 F8–F9) [S39][S41].
- **Residency is disjunctive.** Any one limb of the "resident individual" definition suffices: domicile, a permanent place available for domestic use, habitual abode, substantial economic and immediate family ties, or 183 days. The definition is in s.201 per R06; Doc 6 F10 cites s.202. A resident is taxed on worldwide income (s.12), so a diaspora Nigerian who keeps a Lagos home or family ties may be resident (Doc 6 F10–F11, **E2**).
- **Gains.**
  - Gains on shares in Nigerian companies are not chargeable where aggregate proceeds are below ₦150m **and** gains do not exceed ₦10m in any 12 consecutive months (s.34(1)(a) proviso).
  - Foreign shares have no such threshold.
  - Non-naira currency is a chargeable asset (s.34(1)(b)).
  - An individual's gains are assessed in the year of assessment after disposal (s.26(3); CANONICAL_CONTRACTS C7.6) (Doc 6 F13, **E2**). v0.1 called the exemption "conflicting secondary readings"; Doc 6 has settled it from the primary text.
- **Dividends.** Net Nigerian dividends are "not charged to further tax" (NTAA s.51(3); Doc 6 F12, **E2**).
- **Filing.** Only the taxpayer or a tax agent accredited by the tax authority may file (NTAA s.33). Software may compute, pre-fill and explain, and the taxpayer submits (Doc 6 F19, F34, **E2**). A pre-entered electronic return is treated as valid self-assessment (NTAA s.34(3), per R09 and Doc 6 R7).
- **Free calculators exist.** The Presidential Committee on Fiscal Policy and Tax Reforms launched a personal income tax calculator at fiscalreforms.ng in August 2025, reported by Tribune and TheCable [S90, E3]. Its URL redirected to the committee's home page when fetched on 2026-11-04, so whether it is still live is unverified. R09 found further 2026-band calculators by search. "Nobody has a tax engine" is withdrawn.
- **Tax ID and deadlines.** A 13-digit Tax ID linked to the National Identification Number became effective on 1 January 2026 [S42]. Individuals file with state revenue services. The Lagos 2026 deadline was extended to 14 April and then to 21 April (Doc 6 F17) [S43].
- **UAE.** No personal income tax; VAT 5%; corporate tax on business profits [S44].

*E2 (statute text via Doc 6 and R06); E3 for the calculator.*

**F16. Data-protection obligations start with the second user; only registration is tiered.** The Nigeria Data Protection Act 2023's General Application and Implementation Directive (GAID) took effect on 19 September 2025 [S37].
- **Registration is tiered.** Controllers of "major importance" must register. Commentary cites tiers at 200, 1,000 and 5,000 data subjects in six months [S85, **E4**]; Andersen [S37] gives no numeric tiers. Registered controllers file annual Compliance Audit Returns through licensed auditors, and penalties run up to the greater of ₦10 million or 2% of gross revenue.
- **The obligations are not tiered** (Doc 6 F38). Offering financial services requires a data-protection impact assessment (DPIA). Cross-border transfers need an adequacy decision or an approved instrument; consent alone is not a basis.
- **Consequence for the pilot.** Sending a second person's statements to a US-hosted large-language-model API is a cross-border transfer at n = 2. v0.1's "a 20-user cohort is below the threshold" was wrong (R09 M9). The cohort therefore needs a DPIA, a transfer instrument and a privacy design before it starts (revision log V-028; Doc 3/6/8 owners). In the UAE, the Personal Data Protection Law's executive regulations were still outstanding as of June 2026 [S45, E3]. Digital lenders fall under FCCPC's 2025 DEON Regulations (enforcement from January 2026) — relevant only if Portfolio OS ever offers credit [S38]. *E2/E3.*

**F17. The UAE perimeter: onshore (CMA, formerly SCA) and the two free zones.** The SCA approved a federal robo-advisory regulation in July 2025 allowing licensed portfolio-management firms to offer algorithmic advice onshore, with independent IT audits, algorithm reviews and fee/risk disclosure [S25]; the SCA became the Capital Market Authority on 1 January 2026 under Federal Decree-Laws 32 and 33 of 2025 [S26]. Federal Decree-Law 33/2025 lists "financial advisory" **and "promotion"** among licensable activities. It expressly reaches activity from abroad or from free zones that targets onshore clients, and it criminalises unlicensed activity with at least one year's imprisonment and fines of AED 1m–250m (Doc 6 F36, E3). The National confirms that onshore robo-advice is limited to licensed portfolio-management firms [S25]. Any direct marketing of a paid product to UAE residents is therefore treated as partner-only until UAE counsel opines (R09 M8). DIFC advice falls under DFSA Category 4 (base capital reported at US$30,000 after 2025 reforms; commercial sources, unverified) and ADGM under FSRA, where Sarwa is licensed [S27, E4]. UAE Open Finance went live with Commercial Bank of Dubai and First Abu Dhabi Bank/Pay10 in December 2025 under Nebras/CBUAE [S46]. Doc 4 F8 found 5 of 15 mandated banks publicly confirmed live by July 2026 and a CBUAE licence required for access. Third-party-provider licensing terms were **not verified** (E3/E4).

**F18. Macro conditions improved in 2026 but the FX history dominates any USD-cost, NGN-revenue model.** Headline inflation 14.63% in September 2026 (lowest since October 2020; food 19.59%) [S47]; CBN Monetary Policy Rate cut 350 bp to 23% on 22 September 2026 [S48]; NFEM close ₦1,346/$ on 30 October 2026 with the parallel market at ₦1,382–1,388 (a ~3% gap) [S49]; GDP per capita ~$1,224 (2025, World Bank, via secondary) [S50, E4]. Digital-payment fraud losses fell 51% to ₦25.85 billion in 2025, but reporting compliance also fell [S51]. Nigerian banks restored international spending on naira cards in 2025 with caps commonly $500–1,000 per month or quarter [S68, E4] — relevant to USD-priced subscriptions. Nigerian dollar millionaires: ~7,200 (−47% since 2015) [S77]. *E3.*

**F19. Venture capital for Nigerian consumer fintech is scarcer and more selective.** Partech: Africa raised $4.1 billion in 2025 (equity $2.4 billion across 462 deals); Nigeria $572 million ($412 million equity, $160 million debt), −3% year on year, 102 deals (−11%), the only top-four market with declining equity; 118 active equity investors in Nigeria (−30%); fintech 56% of Nigerian equity; the average seed ticket was $1.7 million; Seed+ volumes fell 4% to $462 million; only 5.5–6.5% of the 2021–2023 seed cohorts reached Series A within three years [S52]. YC's standard deal is $500,000 ($125,000 for 7% plus a $375,000 uncapped MFN SAFE; US/Cayman/Singapore/Canada parent required) [S75]. Hub71 (Abu Dhabi) offers roughly AED 250,000 cash via SAFE plus AED 250,000 in-kind, per commercial guides (official page not reachable) [S76, E4]. *E3.*

**F20. Behavioural-finance features have supportive but contested evidence, so they are a retention feature, not a commercial moat.** Goal-setting features in a fintech app increased saving (Gargano & Rossi, Journal of Finance 2024) [A6]; mobile access to financial information reduced spending (Levi & Benartzi, Journal of Finance 2026) [A10]; reminders increase saving (Karlan et al.) [A8]; robo-advice improved diversification for under-diversified investors (D'Acunto, Prabhala & Rossi 2019; Rossi & Utkus 2020) and extended access to lower-wealth households (Reher & Sokolinski 2024) [A1][A7][A9]. Against this, a meta-analysis found nudges effective (Mertens et al. 2021/22) [A4] while a re-analysis found "no evidence for nudging after adjusting for publication bias" (Maier et al. 2022) [A5]; financial-education effects are small in Fernandes et al. (2014) [A2] but positive in Kaiser et al. (2022) [A3]. *E1/E2 for the individual studies; the disagreement itself is the finding. Bibliographic metadata were checked; whether each study supports the exact sentence above was not re-read (R09 §4).*

**F21. Selling tax computations for a fee may be "practice of taxation" restricted to CITN members (V-023).** We read the Chartered Institute of Taxation of Nigeria (CITN) Act as consolidated in the Laws of the Federation of Nigeria 2004 [S87, fetched 2026-11-04].
- **Deemed practice (s.16(1)).** A person is deemed to practise if, "in consideration of remuneration received or to be received", they "engage … in the practice of taxation" or "render … professional service or assistance in or about matters of principle or detail" relating to taxation.
- **Offence (s.19(2)).** A non-member who "practices or holds himself out to practice as a tax administrator or practitioner for or in expectation of reward" commits an offence.
- **Penalties (s.19(4)).** On summary conviction, a fine not exceeding ₦100. On indictment, a fine not exceeding ₦1,000 or imprisonment for up to two years.

The money penalties are nominal, but the custodial term and the reputational cost are not. Press and party filings report a Federal High Court ruling in 2019 that only CITN members may practise taxation. ICAN contests this, and the cases were not read [search results, E4]. Separately, NTAA s.101 penalises knowingly incomplete or inaccurate returns, and s.33(4)(a) makes the filer attest that a return is "true and complete" (R06 M7). Pre-filled schedules therefore carry product liability.

*Implication.* The commercial tax product is structured so that a CITN-registered practitioner reviews, signs and is the party paid for professional assistance, while Portfolio OS supplies the software and the records. Whether that structure is enough, or whether the company must itself employ registered practitioners, is a question for counsel (§9 item 2). Until that opinion is in hand, no tax output is sold. *E2 for the statute text (amendments after 2004 not checked); E4 for the case law.*

---

## 4. Proposed framework / specification: the commercial architecture of Portfolio OS

### 4.1 Segments, jobs and current workarounds

| Segment | Size indicator (source) | Job-to-be-done Portfolio OS could own | Current workaround | WTP signal | Priority |
|---|---|---|---|---|---|
| S1. Nigeria-resident, multi-account, mass-affluent individuals (income > ~₦200k/month, ≥1 investment product) | 1.4–4.3m (conditional funnel, §4.2, from [S1][S7–S10]) | One auditable net-worth and cash-flow view across banks, PiggyVest/Cowrywise, broker, PFA; dividend and corporate-action records; *indicative* NTA 2025 position (mostly exempt, F15) | Spreadsheets; multiple apps; adviser at broker | Unmeasured for software (F5, E4); strong for transactions | Core for personal MVP; commercial only through annual prepaid NGN plans at near-zero CAC |
| **S6. Cross-border investors (new in v0.2):** Nigeria residents holding foreign shares or foreign currency; diaspora who may be resident under s.201 | 99k–463k people (§4.2, Table C; E5) | A tax-and-records pack covering foreign-share gains (no threshold), FX as a chargeable asset (s.34(1)(b)), residency facts, US 30% dividend withholding and estate-tax exposure above $60k (Doc 6 F30–F31). Practitioner co-signed; taxpayer files | Practitioners and accountants; spreadsheets; nothing | Plausibly moderate: deadline- and fear-driven; USD cards (E5; signal S-b tests it) | **Candidate wedge**, conditional on the CITN opinion (F21) |
| S2. Diaspora Nigerians (UK/US/Canada/UAE) with Nigerian assets | ~1.8–2.1m diaspora [S89, E4]; remittances $21.8–22.8bn/yr [S17][S18]; LemFi >1m users [S74] | NGN/USD/GBP consolidation; FX-adjusted returns; Nigerian residency exposure (overlaps S6); remittance-to-investment tracking | Spreadsheets; WhatsApp with family; remittance apps | Moderate: USD cards, used to $10/month apps | Best early *paying* segment |
| S3. UAE expatriates generally (mass-affluent) | ~10m expatriates [S19]; Sarwa 300k registered [S22] | Multi-currency net worth; end-of-service and home-country planning | Sarwa/StashAway/bank apps; Excel | Moderate–high | **Partner-only** (Decree-Law 33/2025 "promotion", F17); crowded |
| S4. Nigerian small-business owners mixing personal and business money | 53% of adults own a business [S1] | Separate personal from business flows; tax | Moniepoint/OPay business accounts; notebooks; PiggyVest's planned personal/business toggle [S11] | Weak | Later; bookkeeping products and PiggyVest own it |
| S5. B2B2C counterparties: PFAs (11.04m RSAs [S2]), brokers (~6m CSCS accounts, ~10% active [S3]), banks, employers, licensed advisers and CITN practitioners | About 20 PFAs and 24+ banks: **unsourced in v0.1**, PenCom and CBN operator lists not re-checked (E4); dozens of brokers | White-label portfolio, records and tax-statement analytics; practitioner workbench for S6 packs | In-house dashboards; integrated groups (Stanbic IBTC, ARM, United Capital) already show pension, funds and brokerage in one app; Personetics, Meniga and Moneyhub sell bank PFM | Institutional budgets exist; procurement is slow; price unknown (flat licences, §4.4) | Most credible venture route |

### 4.2 Market sizing (top-down and bottom-up, ranges)

**Method.** Top-down funnels start from EFInA adult counts and apply income, conditional banking and smartphone, investing and willingness-to-pay filters. A bottom-up estimate starts from comparable paying bases. All multipliers are explicit and come from `doc09_sizing_and_unit_economics.py` §B–C. The two weakest inputs are **willingness to pay (E5, no direct evidence)** and **P(banked and smartphone | high income)** (E5, pending EFInA's income cross-tabulation). The exchange rate is a planning rate of ₦1,346/$ [S49]. It is not a C3-validated figure; C5.1 names the CBN central rate as the reference.

**Table B — Nigeria funnel, v0.2 (conditional shares).** v0.1 multiplied banked × smartphone × income × investing as if they were independent. That understated the base by 2.7–4.7×, and its smartphone low bound (33%) was above EFInA's own national 26.6% (R09 M5).

| Step (Nigeria, 2026) | Low | High | Basis |
|---|---|---|---|
| Adults | 115m | 120m | 111m in 2023 [S1] + growth (E5) |
| × income > ~₦200k/month | 5% | 8% | 5% above ₦115k in 2023 [S1]; inflation drift (E5) |
| × P(banked and smartphone \| high income) | 80% | 90% | E5; R09 used 85%; near-universal among top earners |
| × holds ≥1 investment product | 30% | 50% | 1.31m unit holders [S10]; ~0.6m active CSCS [S3]; 3–6m app users (F8) |
| **= addressable individuals** | **1.38m** | **4.32m** | v0.1 independent funnel: 0.30–1.61m (rejected) |
| × willing to pay for software | 10% | 25% | E5; no direct evidence (F5) |
| **= paying users (SAM, people)** | **138k** | **1.08m** | |
| × ARPU $20–60/yr | | | §4.4 |
| **= Nigeria consumer revenue SAM** | **$2.8m/yr** | **$65m/yr** | |

The larger funnel does **not** change the planning range below. The binding constraint is willingness to pay and acquisition cost, not the number of people who could pay. The 20,000–150,000 SOM is already a fraction of the low SAM.

**Table C — Cross-border tax segment (S6, the re-scoped wedge).**

| Component | Low | High | Basis |
|---|---|---|---|
| Registered users of Bamboo, Risevest, Trove, Chaka/Hisa | 1.6m | 1.6m | [S12] (E3), overlapping |
| × unique people | 60% | 80% | E5 |
| × active | 20% | 35% | Bamboo 100k active of 500k registered [S12]; E5 upper |
| × realising a gain in a year | 20% | 40% | E5 (R09 IC question 1: obtain platform disclosures) |
| **= foreign-share holders with a realised gain** | **38k** | **179k** | Foreign shares get no s.34(1)(a) threshold (Doc 6 F13) |
| Diaspora (UN DESA 2020–2024) × adults 85% | 1.5m | 1.8m | [S89] (E4); 85% adult share E5 |
| × keep a home available or substantial ties | 20% | 40% | E5; disjunctive s.201 (Doc 6 F10) |
| × income or assets that make a pack worth buying | 20% | 40% | E5 |
| **= diaspora possibly resident, with means** | **60k** | **284k** | |
| **Segment total (overlap ignored)** | **99k** | **463k** | |
| × pay for a co-signed pack | 10% | 30% | E5; tested by signal S-b |
| **= packs per year / revenue at $60–150** | **10k / $0.6m** | **139k / $20.9m** | |

Holders of foreign currency are **not** sized. If a practitioner confirms that every foreign-currency spend is a disposal under s.34(1)(b), the segment widens to most holders of domiciliary accounts and dollar savings plans. If a de-minimis or chattels route applies, it does not (CANONICAL_CONTRACTS C1.6, question i).

| UAE / diaspora | Low | High | Basis |
|---|---|---|---|
| Digitally engaged UAE investors | 400k | 1.0m | Sarwa 300k registered [S22]; others unknown (E5) |
| × willing to pay $60–150/yr | 5% | 15% | E5 |
| = paying users / revenue | 20k / $1.2m | 150k / $22.5m | |
| Nigerians in UAE paying at 3–10% | 1.5k | 10k | 50–100k residents [S20] |
| Diaspora (all countries) | not sized: headcount unverified this session | | LemFi 1m+ users is the only hard anchor [S74] |

**Bottom-up cross-check.**
- **Monarch** had the whole US market to draw on (>3.6m Mint refugees) [S53][S54]. Its "~1m paying subscribers" in v0.1 was our own derivation (ARR ÷ $99); Sacra reports no subscriber count.
- **Cleo** reached 1.3m payers across the US and UK with credit products [S58].
- **Nigeria's base** is small: about 1.3m mutual-fund unit holders in total [S10] and about 0.6m active CSCS accounts [S3].

A **serviceable obtainable market of 20,000–150,000 paying users within five years** (consumer, all geographies) remains the defensible planning range, with revenue of $1–10 million a year.

Other lines, re-priced in v0.2:
- **B2B2C:** flat enterprise licences at an **unknown** price. Two quotes are required. Illustratively, 2–5 clients at $15–40k a year gives $30–200k (E6). v0.1's $0.25–1.00 per member would take 5–11% of a PFA's per-member revenue (§4.4, R09 M10).
- **Adviser and practitioner seats:** $0.1–1 million.
- **Cross-border tax packs:** $0.6–21 million at the Table C extremes; the SOM share is unknown.
- **NGX data API:** $0.01–0.15 million, re-priced against Mansa and Kobo Terminal (§4.4 M6).

**Total realistic five-year revenue envelope: $2–15 million a year** (unchanged). That is a good business. It is marginal as a venture outcome unless the B2B2C line or the cross-border pack scales beyond these ranges.

**Top-down TAM for completeness.** Suppose every addressable Nigerian individual (up to 4.3m), every digitally engaged UAE investor (1.0m) and every diaspora Nigerian (2.1m) paid $20–150 a year. The ceiling would be about $0.15–1.1 billion a year, the number a pitch deck would show. The committee does not treat it as achievable. It is listed so reviewers can see the gap between TAM and SOM.

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

The quadrant Portfolio OS targets (whole balance sheet, software revenue) is empty in Nigeria for a reason: aggregation is hard without open banking, and consumers pay for products, not analysis. Globally it is not empty. Kubera, and portfolio trackers with tax reports (Sharesight, Getquin, Snowball, Delta/eToro), show that it exists for multi-currency investors at premium prices. None of them, as far as we could see, models Nigerian residency or the s.34 rules; their Nigerian coverage was not verified.

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
| Sharesight, Getquin, Snowball, Delta (global trackers) | ◐ (broker imports) | ● | ○ | ◐ | ● | ◐ (tax reports for their home markets; Nigeria ?) | Subscription | ? (named by R09; not re-fetched) |
| Nigerian PIT calculators (government calculator at fiscalreforms.ng; third-party 2026-band calculators) | ○ | ○ | ○ | ○ | ○ | ◐ (PAYE/PIT bands only; no foreign shares, FX or residency) | Free | ? [S90] |
| NRS Rev360 / LIRS eTax pre-fill | ○ | ○ | ○ | ○ | ○ | ◐ (pre-entered returns, NTAA s.34(3)) | Free (state) | all filers |
| Grey, Nala, Afriex, Cleva, LemFi (diaspora money apps) | ◐ (own wallets) | ● | ○ | ○ | ○ | ○ | FX spread, fees; adding savings/investing | LemFi >1m [S74]; others ? (R09, not re-fetched) |
| Stanbic IBTC, ARM, United Capital (integrated groups) | ◐ (own pension, funds, brokerage) | ◐ | ○ | ◐ | ◐ | ○ | Fees on assets | ? (R09; "incumbent copies the wedge" risk and B2B2C buyer) |
| Personetics, Meniga, Moneyhub (bank PFM vendors) | ● (via bank) | ◐ | ● | ○ | ◐ | ○ | Enterprise licences | ? (B2B2C competitors and price anchors) |
| Mansa API, Kobo Terminal (NGX data APIs) | ○ | ○ | ○ | ◐ (data) | ○ | ○ | $20–200/mo; ₦0–350,000/mo (Doc 5c N14–N15) | n/a |
| Excel / Google Sheets | ● (manual) | ● | ○ | ○ | ◐ | ◐ | Free | ubiquitous |
| **Portfolio OS (target)** | ● (provenance-first) | ● | ◐ (restrained) | ● (NGX/UAE/US, validated) | ● | ◐ → ● only with practitioner co-signature (cross-border pack) | Subscription + tax packs + B2B2C | 1 user |

**Where Portfolio OS may be differentiated** (no competitor in the matrix does all of these):
1. NGN/AED/USD consolidation with corporate-action handling for NGX holdings. Doc 5c found that nobody, official or third-party, sells corporate-action-adjusted NGX data.
2. A cross-border tax-and-records engine. It covers foreign-share lots at NGN cost, the FX currency pool (C1.6) and residency facts, with practitioner co-signature.
3. Provenance on every figure (C2, C3). This matters more in a market where the founder's previous tracker produced stale numbers and where retail trust in apps is thin.

v0.1 claimed "a Nigerian tax engine, nobody has one". That is withdrawn: free PIT calculators and state pre-fill already cover salaried PIT.

**Where it is not differentiated:**
- budgeting and spending analytics, which every bank and savings app offers in some form, free;
- behavioural nudges, which PiggyVest's locks and goals already embody (F20);
- US-stock research, which is free and abundant;
- robo portfolios, which Sarwa and others run under licence, with assets;
- salaried PIT computation.

The AI explanation layer is table stakes by 2026, not a moat.

### 4.4 Business models and unit economics

All figures in this subsection come from `research/scripts/doc09_unit_economics_mix.py` (sections A–I) and `doc09_sizing_and_unit_economics.py` (section D). Run with `python3 -I`. Every input is a dated assumption, graded in the script header. The model is **E5** throughout. It was internally inconsistent in v0.1 (R09 M2) and is now built on one churn input.

**Model options and the regulation each triggers.**

| Model | Mechanics | Revenue potential (5-yr) | Regulatory trigger | Committee view |
|---|---|---|---|---|
| M1. Consumer subscription, NGN-priced | ₦2,500–7,500/month, or ₦25,000/yr prepaid, via Paystack on the web | $2.8–65m SAM; SOM low single-digit $m | NDPA obligations from the second user (F16); none from SEC if no personalised recommendations | Monthly NGN plans do not pay back a $25 CAC (below). Annual prepaid only, at near-zero CAC |
| M2. Consumer subscription, USD-priced (diaspora) | $8–15/month; international cards 3.9% + ₦100 [S63] | $1–22m | Nigerian NDPA; UK/US/EU marketing and data rules; **UAE residents partner-only** (Decree-Law 33/2025, F17) | Best consumer economics |
| M3. Freemium | Free ledger; paid tax packs, research, analytics | Unknown. v0.1's "1–3% download-to-paid" had no quoted source and is withdrawn. RevenueCat reports ~20% trial-to-paid for MEA [S61, not re-fetched] | As above | Needed for distribution. The free tier gets no AI chat (R8), or token costs fall on non-payers |
| **M8. Cross-border tax-and-records pack (new)** | Portfolio OS prepares; a CITN-registered practitioner reviews and co-signs; the taxpayer (or an accredited agent) files (NTAA s.33). $60–150 per pack, USD | $0.6–21m (Table C, §4.2) | CITN Act s.16/s.19 (F21); NTAA s.33, s.101; C7 requires every rule to be `practitioner_confirmed` before pre-filled return data is produced | **Candidate wedge**; seasonal; liability-bearing |
| M4. B2B2C through PFAs, brokers, banks, employers | **Flat enterprise licence**; price unknown, two quotes required. v0.1's $0.25–1.00 per member is withdrawn: $1 is 5–11% of a PFA's ~$9–18 annual revenue per RSA (PenCom Q4 2025: ₦27.45tn over 11.04m RSAs ≈ $1,850 average) | Illustrative $30–200k/yr for 2–5 clients (E6) | Vendor due diligence; data processor under NDPA; no SEC licence if the partner is the regulated adviser | Most credible route to scale. 12–24-month sales cycles; competes with Personetics, Meniga, Moneyhub and in-house group apps |
| M5. Advisory and practitioner enablement | Seats $40–80/month; practitioner workbench for M8 packs | $0.1–1m | Adviser or practitioner holds the licence; Portfolio OS is a technology provider (SEC rules exempt tech providers [S28]); CITN position to confirm | Low capital, high trust; small; also the route that best fits F21 |
| M6. Data/analytics API (NGX fundamentals with provenance) | v0.1's $500–2,000/month is withdrawn. Mansa sells $20–200/month and Kobo Terminal ₦0–350,000/month (Doc 5c N14–N15), so $100–300/month per client is the realistic range | $0.01–0.15m | NGX redistribution licence on the **2026** schedule: delayed distribution ₦2.0m/yr or EOD ₦1.5m/yr, plus display and non-display fees (Doc 5c F4) [S86] | Pays for part of the pipeline; small |
| M7. Regulated robo-advice / portfolio management | AUM fees | Potentially larger | SEC robo-adviser ₦100m capital; fund manager ₦2–5bn [S30]; UAE licences | Not before Stage 3; capital-heavy |

**Price anchors (₦1,346/$).** Spotify Nigeria ₦1,300 ($0.97); Netflix Premium ₦8,500 ($6.32) [S69]; proposed Basic ₦2,500 ($1.86), Pro ₦7,500 ($5.57), annual ₦25,000 ($18.57); diaspora $10–15. YNAB $109/yr [S56]; Monarch $99.99/yr [S55]; Kubera $250/yr [S57].

**Cost inputs (v0.2).**

| Line | v0.2 input | Source and grade | v0.1 |
|---|---|---|---|
| VAT | NGN prices include 7.5% VAT (NTA s.147, Doc 6 F21). USD plans carry a 5% placeholder: 0% if zero-rated as an export, 5% for UAE customers once registered, 7.5% if not zero-rated | E2 rate; E4/E5 applicability, tax advice needed | omitted |
| Paystack | Local 1.5% + ₦100, capped at ₦2,000. The ₦100 is waived only *under* ₦2,500, so it applies to the ₦2,500 Basic plan. International 3.9% + ₦100 | [S63], fetched 2026-11-04 (E3) | ₦100 waived at ₦2,500; none on international |
| App-store billing | Google Play auto-renewing subscriptions 15% (10% + 5% billing fee) in the markets its page lists; Nigerian rate not stated | [S88], fetched 2026-11-04 (E3); scenario only | "15–30%", unsourced |
| Aggregation | Mono Basic ₦50,000/month per 100 accounts = ₦500 (≈ $0.37) per account per month. Base: 50% of payers aggregate 3 accounts ($0.56 per payer). Statement upload stays the default (Doc 4 R10: Mono only after a 60-day shadow test) | Doc 4 F2 (E3, undated page) | omitted |
| LLM | Plan-gated. Basic: light profile, $0.17 (15 Sonnet-class chats of 5k in / 500 out tokens + 600 Haiku-class classifications). Pro and USD: medium-agentic, $2.44 (40 chats of 8k/700 + 1,500 classifications + **2 Opus-class research runs of 400k input / 8k output**, 60% cache hits). Heavy: $9.50. Uniform-agentic use is a stress case | List prices [S67] (E3); token counts E5 until measured on the prototype (§9 item 7) | 60k-token research runs; $1.03 for every plan |
| Market data | NGX 2026 commercial floor ₦5–8m/yr. It covers display, distribution, bandwidth and the ₦1.25m "Delayed Data for Financial modelling" **non-display** licence (V-012), and is ≈ $6.4k/yr at the high end including VAT. UAE/US commercial data add $1–3k/month. Real-time Level-1 ($10/user/month local) is excluded by showing delayed/EOD data only. For the personal MVP, Doc 5c and R05c give ≈ $104/month on a local basis or ≈ $792/month on an international basis including non-display | Doc 5c §4.6, F4 [S86]; R05c M1 (E2 schedule, E5 assembly) | 2018 schedule; Level-1 $3 |
| Professional | Practitioner retainer, professional-indemnity cover, NDPC-licensed audit, legal opinions: $60k/yr at 10k payers, $150k at 100k (fixed). Per-pack practitioner review for M8: $25–60 (variable) | E5; quotes required (§9) | omitted |
| Support, infrastructure, other | $0.25 + $0.10 + $0.05 per payer per month | E5 | same |
| Churn | **One input** for LTV, payback, acquisition spend and thresholds: base 7%/month, shown at 5% and 10%. RevenueCat MEA: monthly-plan heavy, negative median MRR growth [S61] | E5; to be measured (signal confirmation at month 15) | 5% for LTV but ~7.5% implied in the P&L |
| CAC | $8 (community/referral), $15, $25 (mixed), $60 (paid) per paying subscriber; no Nigerian benchmark exists | E5 | same |

**Per-subscriber economics, v0.2 base (monthly, USD).** Margins are on revenue net of VAT. LTV is undiscounted contribution ÷ churn.

| Plan mix (Basic/Pro/USD) | Gross price | Net of VAT | Payment | LLM | Aggregation | Other | Contribution | Margin | LTV/CAC at $25, churn 5% / 7% / 10% | v0.1 margin |
|---|---|---|---|---|---|---|---|---|---|---|
| **Basic only (₦2,500)** | $1.86 | $1.73 | $0.10 | $0.17 | $0.56 | $0.40 | **$0.49** | **29%** | 0.4 / 0.3 / 0.2 | 21% (not shown in v0.1) |
| Nigeria-heavy 65/20/15 | $3.82 | $3.59 | $0.17 | $0.97 | $0.56 | $0.40 | $1.50 | 42% | 1.2 / 0.9 / 0.6 | 60% |
| Balanced 40/20/40 | $5.86 | $5.54 | $0.26 | $1.53 | $0.56 | $0.40 | $2.79 | 50% | 2.2 / 1.6 / 1.1 | 72% |
| Diaspora 20/10/70 | $7.93 | $7.53 | $0.36 | $1.99 | $0.56 | $0.40 | $4.22 | 56% | 3.4 / 2.4 / 1.7 | 78% |
| USD $10 only | $10.00 | $9.52 | $0.46 | $2.44 | $0.56 | $0.40 | $5.66 | 59% | 4.5 / 3.2 / 2.3 | 82% |

v0.1's "UAE premium only ($15)" row is removed, because direct UAE consumer sales are partner-only (F17). The v0.1 executive summary set "₦2,500 = $1.86" beside a margin and LTV/CAC that belonged to the 65/20/15 mix, which depends on 35% of payers being on Pro or USD plans (R09 M1). The Basic-only row is the honest picture of a ₦2,500 subscriber. The §4.7 v0.1 figure of 23% computed to 21.5%.

**Sensitivities (margin; one input changed from the v0.2 base).**

| Case | Nigeria-heavy | Balanced | Diaspora | Basic only | USD only |
|---|---|---|---|---|---|
| v0.2 base | 42% | 50% | 56% | 29% | 59% |
| No aggregation (statement upload only) | 57% | 60% | 63% | 61% | 65% |
| All payers aggregated (3 accounts) | 26% | 40% | 49% | −4% | 54% |
| Uniform agentic LLM on every plan (R09's stress) | 1% | 34% | 50% | −103% | 59% |
| Uniform heavy LLM use | −196% | −94% | −44% | −511% | −15% |
| Play billing 15% instead of Paystack | 30% | 39% | 45% | 18% | 49% |
| Naira at ₦1,700/$ | 38% | 50% | 57% | 20% | 61% |

Three conclusions follow. (1) Basic is viable only without deep research, and that limit must be enforced, not just priced in. (2) Aggregation can halve the margin of NGN plans, so statement upload stays the default. (3) Token usage is the largest single unknown and must be measured on the prototype before any price is fixed.

**Payback and the CAC trap.** On a $25 CAC, payback takes 16.7 months for the Nigeria-heavy mix, 50.6 months for Basic-only, 5.9 months for the diaspora mix and 4.4 months for USD-only. At 7% churn, contribution after acquisition is negative for the Nigeria-heavy mix ($1.50 − 7% × $25 = −$0.25 a month). The consumer model works only with (a) near-zero CAC (community, employer, partner or practitioner distribution), (b) a high share of USD payers, or (c) annual prepaid plans, which turn monthly churn into a renewal decision.

**One USD threshold, indexed to measured churn (replaces v0.1's 20%, 25% and 35%).** U\*(churn, CAC) is the USD-payer share at which LTV/CAC ≥ 3, with the remaining payers split Basic:Pro 65:20.

| Measured monthly churn | U\* at CAC $25 (v0.2 base) | U\* at CAC $15 | v0.1 model at CAC $25 (reproduces R09 M4) |
|---|---|---|---|
| 3% | 31% | 13% | 15% |
| 5% | 62% | 31% | 37% |
| 7% | 92% | 49% | 58% |
| 10% | not reachable | 77% | 91% |

U\* is the only USD threshold in this memo. It is read from this table, or recomputed by the script, at the **measured** churn and CAC of the paying base (§8.3).

**Kill CAC.** The CAC at which LTV/CAC falls below 1.5 at measured churn is, for 7% churn: Nigeria-heavy $14, Balanced $27, diaspora-heavy $40 and USD-only $54 (script §F). v0.1's "CAC > $40 ⇒ LTV/CAC < 1" was wrong: the v0.1 model itself gave 1.14 (R09 2A).

**Cross-border tax-and-records pack (M8), per pack, USD.** Net of the 5% VAT placeholder, Paystack international fee, heavy-LLM allocation ($9.50) and $5 support.

| Price | Practitioner review $25 | $40 | $60 |
|---|---|---|---|
| $60 | $15 (27%) | $0 (0%) | −$20 (−35%) |
| $100 | $52 (54%) | $37 (39%) | $17 (18%) |
| $150 | $97 (68%) | $82 (58%) | $62 (44%) |

The pack carries its economics only at about $100 or more, so the practitioner's fee is the decisive input. Two practitioner quotes are required (§9 item 2).

**Steady-state P&L (annual USD, one churn input, $25 CAC; acquisition = payers × churn × 12 × CAC).** Fixed costs: team and G&A as in v0.1, compliance, market data (NGX 2026 schedule including non-display), and professional lines. That is $0.82m at 10k payers and $2.47m at 100k, interpolated in log-payers between tiers.

| Mix (churn 7%) | 10k payers | 30k | 100k | 150k | Breakeven payers at churn 5% / 7% / 10% |
|---|---|---|---|---|---|
| Nigeria-heavy 65/20/15 | −$0.85m | −$1.48m | −$2.77m | −$3.57m | > 3m / never / never |
| Balanced 40/20/40 | −$0.70m | −$1.02m | −$1.23m | −$1.25m | ~199k / ~495k / > 3m |
| Diaspora 20/10/70 | −$0.53m | −$0.50m | +$0.50m | +$1.34m | ~50k / ~71k / ~154k |
| USD $10 only | −$0.35m | +$0.02m | +$2.22m | +$3.93m | ~23k / ~30k / ~44k |

Changes from v0.1:
- **The 1,000,000-payer row is removed.** It is incoherent with the 20–150k SOM, and a Nigeria-heavy million needs 650k Basic payers. It is now printed only as a coherence check in the script.
- **v0.1 charged acquisition at payers × 0.9 × $25**, which implies about 7.5% monthly churn, while its LTV used 5%.
- **The reviewer's correction is right in method, but the numbers move.** R09 found that the v0.1 cost base breaks even at ~190k Nigeria-heavy payers with 5% churn. With v0.2's added costs that mix does not break even below 3m. Only the diaspora and USD mixes break even inside the SOM. *CFO reading:* the business is a margin story driven by mix, channel and token discipline, not by product features.

**Regulatory capital in USD (₦1,346/$):** SEC corporate investment adviser ₦50m = $37k; robo-adviser ₦100m = $74k; digital sub-broker ₦100m = $74k; fund/portfolio manager ₦2–5bn = $1.5–3.7m (all by 30 June 2027) [S30].

### 4.5 Defensibility assessment

| Candidate moat | Strength today | What a bank, PiggyVest or a global player could do | Verdict |
|---|---|---|---|
| Brand / trust (provenance-first, no fabricated figures) | None yet (one user) | Banks have trust by default; PiggyVest has 6m users and a decade of payouts [S11] | Earnable only through years of visible accuracy; not an initial moat |
| Proprietary behavioural research and validation data | None; evidence base is public and contested (F20) | PiggyVest already runs the best-evidenced interventions at scale | Weak; useful for retention, not defence |
| Multi-market data pipelines and NGX corporate-action handling | Hard, unglamorous, slow to copy. Doc 5c found nobody sells corporate-action-adjusted NGX data; the NGX EOD API is ≈ ₦425k/yr on a personal licence | Brokers hold the data but lack product incentive; global players ignore NGX; Mansa and Kobo Terminal sell unadjusted, unlicensed-provenance feeds cheaply | **Real, modest moat if executed**. Also a licensable asset (M6), probably more defensible than any consumer feature (R09 bull case) |
| Cross-border tax-and-records engine (foreign-share lots, FX pool per C1.6, residency facts) | Not built. Salaried PIT is already served free (F15), so v0.1's "nobody has it" is withdrawn. Nothing seen covers foreign shares, FX and s.201 residency for Nigerians | Practitioners can do it by hand and capture the fee; diaspora money apps could add an estimate tab. v0.1's "Big-4 firms sell services, not software" was unsourced and is withdrawn | **Conditional differentiator**: real only with practitioner co-signature and a favourable CITN opinion (F21); seasonal; liability-bearing |
| Distribution partnerships (PFAs, brokers, employers) | None | Incumbents can sign the same partners | Winner-takes-most per partner; first-mover matters |
| Founder's unfair advantages | Lived multi-currency problem; cross-border network; domain knowledge | Gaps: no co-founder, no engineering team, no licence, prior tracker produced stale figures (Context Brief §1) | Honest assessment: motivation and insight, not yet execution evidence |

### 4.6 Staged plan, milestones and capital

Month 0 is 4 November 2026. v0.1's month-9 signals could not be read by month 9 (R09 B2). The cohort-retention signal needed a cohort from month 6, a three-month free period and 90-day retention, so month 12 at the earliest. The tax-season signal needed a practitioner-reviewed rule set by about January 2027 (month 2), while Stage 0 runs six months. Under C7 no pre-filled return data may be produced until every rule is `practitioner_confirmed`. The plan below runs the stages in sequence and uses signals that can be read inside their window (§8.3).

| Stage | Months (dates) | What must be proven | Milestones (measurable, pre-registered) | Capital and source | Team |
|---|---|---|---|---|---|
| 0. Personal system | 0–6 (Nov 2026–May 2027) | The ledger reconciles the founder's own NGN/AED/USD accounts with provenance. The founder's own cross-border tax-and-records pack is prepared and reviewed by a practitioner | All 12 monthly periods of every account reconcile to the printed closing balance with zero unexplained difference, and `Suspense` = 0 at each close (Doc 6 Gate 1; C1-I7). Founder's pack reviewed before the 31 March 2027 deadline. Legal opinions (SEC perimeter; CITN Act and NTAA s.33) commissioned in month 1 and received by month 6 | $10–20k: founder; LLM and data at personal-plan prices (NGX ≈ $104/month local or ≈ $792/month international with non-display, R05c); practitioner fee | Founder (+ contractor) |
| 1. Priced tests | 3–9 (Feb–Aug 2027) | Non-friend users pay real money; professionals use the tool | Signals S-a, S-b and S-c (§8.3). DPIA, transfer instrument and privacy design **before** any second user's data (F16; V-028). A 10-user usability cohort is allowed, but it is not a demand test | $30–60k, founder-financed: DPIA and transfer instruments, legal opinions, practitioner fees for packs, $3–5k cold-channel recruitment | Founder (commercial work ≤ 20 h/week) + part-time engineer + practitioner on fee |
| 1b. Confirmation | 9–15 (Aug 2027–Feb 2028) | Payers stay; churn and CAC are measured | 90-day paid retention ≥ 60%; measured monthly churn and CAC; USD-payer share ≥ U\*(measured churn, CAC) or contracted B2B revenue | Angels ≤ $150k only if two of three signals passed at month 9 | Founder + 1 engineer |
| 2. 1,000 paying | 15–33 | A repeatable channel at the measured unit economics | 1,000 payers with LTV/CAC ≥ 3 at measured churn (equivalently USD share ≥ U\*); a paid B2B pilot ≥ $5k by month 18; tax-pack volume in the 2028 season | **$0.54–0.64m** (Nigerian-rate case) or **$0.74–0.84m** (USD-benchmarked case), including $100–200k acquisition. v0.1's $0.4–0.5m assumed an unpaid founder and $2,200/month senior engineers (R09 M11). Sources: angels; Microtraction/Ventures Platform/Future Africa-type funds (ticket sizes not verified); YC $500k [S75]. Hub71 only via a UAE partner [S76] | 6: founder (salaried), 2 engineers, data/quant, ops/support, **growth/BD**; DPO/compliance as a contractor; practitioner on retainer |
| 3. Regulated product | 33+ | Economics at scale and licence to advise, or a partner-held licence | Annualised revenue ≥ $250k with LTV/CAC ≥ 3 at measured churn, or contracted B2B ARR ≥ $150k from ≥ 2 clients (replaces v0.1's "250,000 members"); SEC registration (₦50m) or partner-held licence; audited data QA | $2–4m seed; African seed funds, strategic (PFA/bank). Stage 3 costs **≈ $1.9m** over 24 months before acquisition in the USD-benchmarked case (v0.1: $1.1m) | 10–12 incl. compliance officer, tax lead (CITN-registered), partner lead |

Stage costs come from `doc09_sizing_and_unit_economics.py` §E. Salary inputs are graded **E5**: v0.1 graded them E4 from search summaries [S83] that give wide ranges, not quotes. The Nigerian-rate case for Stage 2 is $13,500/month for the team, comprising:
- founder $2,500;
- two senior engineers at $2,200 each;
- data/quant $1,800 and a mid-level engineer $1,300;
- ops/support $1,200;
- growth/BD $1,500;
- DPO/compliance contractor $800.

The USD-benchmarked case is $24,500/month, with senior engineers at $5,000 each. Other Stage-2 costs total $198k: data and LLM, legal (including the SEC-perimeter and CITN opinions), NDPC registration and audit, practitioner retainer, indemnity, and DPIA and transfer instruments.

### 4.7 Worked example (synthetic numbers): a diaspora subscriber in year 2

The subscriber is a UK-based Nigerian. She has a Lagos salary account, a PiggyVest dollar plan, 2,000 Dangote Refinery shares from the IPO, US ETFs bought through a Nigerian app, and a UAE savings account. She keeps a Lagos flat available for family use.

- **Subscription ($10/month).** Net of the 5% VAT placeholder it brings $9.52. Monthly cost to serve:
  - payments $0.46 (3.9% + ₦100);
  - LLM $2.44 (medium-agentic);
  - aggregation $0.56;
  - support, infrastructure and other $0.40.

  That leaves a contribution of $5.66, a 59% margin. Acquired through a diaspora community at an $8 CAC, she pays back in about 1.4 months. At 7% monthly churn her LTV is about $81 and LTV/CAC about 10.
- **Tax position (indicative, C7 watermark "INDICATIVE – not confirmed by a licensed tax practitioner").**
  - The Dangote shares are well inside the s.34(1)(a) exemption, so they need tracking, not tax.
  - Because the Lagos flat is available for her use, she may be resident under s.201 and taxed on worldwide income. That is a judgment the system must flag as "needs professional review" (Doc 6).
  - Gains on her US ETFs have no threshold, and the NGN cost is set at the acquisition-date official rate (C1.6, flagged).
  - Her dollar balances may be chargeable assets (s.34(1)(b)).
  - US withholding of 30% applies to her ETF dividends, and US estate-tax filing applies above $60k of US-situs assets (Doc 6 F30–F31).

  A practitioner-co-signed pack at $100 with a $40 review fee contributes about $37.
- **The same person on Basic.** Priced at ₦2,500 while resident in Lagos, she brings $1.73 net of VAT. Payment costs $0.10, light-profile LLM (no deep research) $0.17, aggregation $0.56 and other costs $0.40. Contribution is $0.49 (29%) and LTV about $7 at 7% churn. On the uniform-agentic profile her contribution is negative.

The product is identical. The economics are set by where the subscriber lives, how she is acquired, and how much research she is allowed to run. The tax value comes from her cross-border facts, not from her Nigerian shares.

---

## 5. Alternatives considered and rejected (or deferred)

| Alternative strategy | Case for it | Why rejected or deferred | Status |
|---|---|---|---|
| A1. Raise pre-seed now for the full nine-system consumer app | Vision is complete; AI makes building cheaper; Monarch shows post-Mint demand | No WTP evidence; the only Nigerian revenue data (Play-store estimates [S62]) measure one channel, not willingness to pay (E4); open banking not live [S34]; nine systems dilute a wedge; active Nigerian investors down 30% and seed-to-A conversion 5.5–6.5% [S52] | **Rejected** at this stage |
| A2. Become a regulated robo-adviser (Nigeria) | Advice is the monetisable layer; SEC rules exist [S28] | ₦100m capital by mid-2027 [S30], algorithm audits, suitability duties; assets, not software, drive revenue; Risevest's warning shows enforcement risk [S12] | **Do-not-build (yet)** |
| A3. UAE-expat wealth product first | Highest ARPU; Sarwa shows a profitable path [S24] | Licensing (CMA/DFSA/FSRA); Decree-Law 33/2025 makes "promotion" licensable, reaches activity from abroad and is criminal (F17); small Nigerian base (50–100k) [S20]; crowded incumbents; founder's distribution is Nigerian | **Deferred; partner-only** until UAE counsel opines |
| A4. B2B tooling for PFAs, brokers and licensed advisers (white-label analytics, tax statements) | 11m RSAs [S2]; partners hold licences; CAC ≈ 0; tech providers exempt from SEC registration [S28] | Long sales cycles; founder has no enterprise sales track record; needs a product first | **Kept as the primary venture route from Stage 2** |
| A5. Nigerian mass-retail tax-preparation product (TurboTax-style) for the 2026 regime | Law changed 1 Jan 2026; Tax ID live | Software may prepare but not file (NTAA s.33); the state pre-fills (s.34(3)); free PIT calculators exist (F15); most retail share and dividend income is exempt or final-taxed (F15); CITN restriction (F21) | **Rejected** (v0.1 kept it as the wedge) |
| A5b. Cross-border tax-and-records pack, practitioner co-signed (M8) | Foreign shares, FX and s.201 residency create real computations; USD-paying, deadline-driven segment (§4.2 Table C) | Smaller segment (99k–463k people, E5); liability-bearing; seasonal; the practitioner may capture the fee (bear case) | **Kept as the candidate wedge**, conditional on the CITN opinion and signal S-b |
| A6. Data/analytics API for NGX fundamentals with provenance | Pays for part of the pipeline; brokers and media need corporate-action-adjusted data nobody sells (Doc 5c) | Small market at Mansa/Kobo price points ($20–200/month); 2026 redistribution fees ₦1.5–2.0m/yr plus display and non-display fees [S86] | **Later**, as a by-product |
| A7. Behavioural-AI coaching app (Cleo/Plum model) | Cleo's scale [S58] | Cleo monetises credit; evidence for nudges contested (F20); PiggyVest already owns the behaviour niche | **Rejected** |
| A8. Remain a personal tool indefinitely | Zero regulatory exposure; founder's problem solved | Forecloses the option; but costs nothing to keep open | **Default if kill criteria trip** |
| A9. Sell the practitioner workbench only (B2B to CITN members, no consumer product) | Fits F21 cleanly (the practitioner practises; Portfolio OS is a tool); CAC through professional networks | Small seat market; practitioners' willingness to pay unknown | **Kept as the fallback** if the CITN opinion rules out consumer-facing packs (signal S-c tests demand) |

---

## 6. Cross-department dependencies

**We need from other departments:**
1. **Legal & Regulatory**, written opinions by month 6:
   - whether analytics and research *without personalised recommendations* fall outside SEC "digital advisory services" [S28];
   - whether selling practitioner-co-signed tax packs, or the software behind them, is "practice of taxation" under CITN Act s.16/s.19, and which structure avoids it (F21; V-023);
   - liability for pre-filled schedules under NTAA s.33(4)(a) and s.101;
   - the open-banking participation route [S33];
   - the NDPA DPIA and the cross-border transfer instrument for the pilot (F16);
   - the UAE "promotion" perimeter under Decree-Law 33/2025 (F17).
2. **Tax Intelligence (Doc 6)**:
   - the rule set for the cross-border pack (foreign-share gains, the FX pool under C1.6, the s.201 residency limbs, US withholding and estate-tax flags) carried to `practitioner_confirmed` under C7;
   - which state portals pre-fill investment income (R09 IC question 4);
   - two practitioner quotes for per-pack review.
3. **Data Architecture (Doc 5c)**: NGX's written answer on non-display use and the local or international fee basis (V-012); DFM, ADX and US commercial quotes.
4. **Banking and ledger (Doc 4)**: Mono shadow-test results (completeness, re-authentication, cost per account). These decide the aggregation line in §4.4.
5. **Technology (Doc 7)**: measured tokens per research run on the prototype (R09 IC question 6).
6. **Behavioural Finance (Doc 3)**: which interventions survive the eight-question test, so marketing never over-claims.
7. **Product (Doc 8)**: instrumentation for S-a/S-b/S-c, and the privacy design for any second user (V-028).
8. **Finance/Operations**: Lagos and remote-USD salary quotes to replace the E5 inputs.

**Other departments need from us:**
- The segment priority: S6 cross-border and S2 diaspora before S1 Nigeria-resident; B2B2C and practitioner seats from Stage 2.
- The price hypotheses: $10 USD plan; Basic without deep research; $100+ pack.
- The pre-registered signals and kill criteria (§8.3) to design experiments against.
- The rule that no feature may introduce a regulated activity before Stage 3, and that no tax output is sold before the CITN opinion and C7 `practitioner_confirmed` status.

---

## 7. Risks, open uncertainties and disagreements

### 7.1 Risk register (commercial and structural)

| Risk | Likelihood | Impact | Evidence | Mitigation |
|---|---|---|---|---|
| Willingness to pay in NGN is near zero | High | Fatal to M1 | [S62][S1] | Test in Stage 1; price in USD for diaspora; B2B2C |
| Open banking slips beyond 2027 | Medium–high | Degrades onboarding; higher support cost | [S34] | Statement upload + Mono; design for manual-first |
| Personalised outputs deemed "digital advisory" | Medium | Registration, ₦50–100m capital, audits | [S28][S30] | Legal opinion; partner-held licence; information-only framing |
| FX: USD costs (LLM, data, talent paid in USD) vs NGN revenue | High | Margin collapse on devaluation | [S36][S49]; §4.4 sensitivity | USD-payer share ≥ U\*(measured churn); **repricing rule**: if the reference rate (C5.1) is > 15% weaker than the price-setting rate for 30 consecutive days, NGN prices rise by the depreciation at the next renewal |
| Incumbent copies the wedge free (PiggyVest with its planned business toggle, integrated bank/asset-manager/PFA groups, diaspora money apps Grey/Nala/Afriex/Cleva/LemFi) | Medium–high | Price to zero; their customers already trust them with money movement | [S11][S70]; R09 M7 | Depth on cross-border tax and NGX corporate actions; practitioner channel; B2B2C exclusivity |
| LLM cost per user exceeds ARPU | High at NGN prices | Basic margin −103% on uniform agentic use | §4.4 | Plan-gated LLM profiles enforced in code; measure tokens before pricing; caching; small models |
| **Tax practice restricted to CITN members (V-023)** | Medium (unquantified) | Offence under s.19(2) (fine; up to 2 years' imprisonment on indictment); reputational loss; product withdrawn | F21 [S87] | No paid tax output before the counsel opinion (month 6); practitioner is the paid party and signs; fallback A9 (practitioner workbench) |
| **Liability for pre-filled schedules** | Medium | Users penalised under NTAA s.101; claims against Portfolio OS | R06 M7; Doc 6 F19 | C7 watermarks; filing support only when every rule is `practitioner_confirmed`; professional-indemnity cover; engagement terms |
| **UAE "promotion" without a licence** | Low if partner-only; high if marketed directly | Criminal: ≥ 1 year imprisonment, AED 1m–250m (Decree-Law 33/2025) | F17; Doc 6 F36 | UAE consumer lines partner-only until counsel opines |
| **NDPA obligations at the pilot** | Certain once a second user joins | Unlawful cross-border transfer to an LLM API; DPIA missing | F16; Doc 6 F38; V-028 | DPIA, transfer instrument and privacy design before the first non-founder dataset |
| App-store billing forced on a 96%-Android market | Medium | −12 points of margin (Play 15%) | [S88]; §4.4 | Web billing via Paystack; app as companion |
| Data-vendor and LLM-provider dependency | Medium | Price shocks, deprecations | Mint's aggregator costs [S53]; Okra's cloud costs [S36] | Multi-vendor abstraction; cache; licence terms reviewed |
| Fraud/social engineering against users of a "financial OS" | Medium | Trust loss, liability | [S51] | Read-only data, no money movement in Stages 0–2 |
| Talent flight ("japa") and USD-indexed salaries | High | Cost base drifts to UAE levels | [S83] | Small senior team; equity; UAE lead only when funded |
| Regulatory capital hikes (SEC 2026 circular) repeated | Medium | Raises Stage-3 cost | [S30] | Partner licences; keep advice out of scope |
| Diaspora segment too dispersed to acquire cheaply | Medium | CAC > $25 | §4.4 | Community partnerships, employer and remittance-app channels |

### 7.2 Open uncertainties
1. Actual willingness to pay for *this* product (E5): the single most important unknown.
2. Monthly churn by plan type (annual NGN prepaid vs monthly USD). U\* hinges on it (R09 IC question 5).
3. Tokens per research run on the real prototype (R09 IC question 6).
4. How many Nigerian residents hold foreign shares with *realised* gains (Bamboo, Risevest and Trove disclosures; SEC data) (R09 IC question 1).
5. Whether every foreign-currency spend is a disposal under s.34(1)(b) (C1.6 question i). This decides whether the S6 segment includes all FX holders.
6. The CITN opinion (F21), and whether a practitioner co-signature resolves it (R09 IC question 3).
7. What PFAs, brokers or banks actually pay for member-facing analytics, and whether flat or per member (R09 IC question 2).
8. Nigerian diaspora by destination and income. Only the UN DESA total is known (E4). Is the UAE the right second market, given visa restrictions and the CMA's criminal exposure? (R09 IC question 7)
9. NGX's answer on non-display use and the fee basis; DFM, ADX and US commercial licence pricing.
10. Whether SEC will issue updated robo-advisory rules under ISA 2025 (none found).
11. CBUAE Open Finance third-party licensing cost and timeline for a non-bank.
12. The founder's own salary needs and equity position (R09 IC question 8). **Founder to confirm.**

### 7.3 Preserved disagreements

| Issue | VC partner | CEO / strategy | CFO | YC-style operator | Proposed resolution path |
|---|---|---|---|---|---|
| Fund now? | No. Pass at pre-seed for a consumer app; would re-open for a B2B/adviser or cross-border tax wedge with a *paid* pilot (an LOI costs the signer nothing) | Build the wedge (ledger + cross-border pack) and prove WTP by month 9 before raising | Numbers say no unless the USD-payer share exceeds U\*(measured churn), e.g. 49% at 7% churn and a $15 CAC | Nigerians do not pay for "insight"; find a painful, time-bound job (cross-border tax, FX reconciliation) | Pre-registered signals at month 9; confirmation at month 15 |
| Which first segment? | Diaspora/UAE (ARPU) | Nigeria-resident mass-affluent (founder's network, data access) | Diaspora (payment rails, margin) | Whoever answers a cold message and uploads a statement within 48 hours | Run both in the 20-user cohort (10/10); pick by retention and WTP |
| Is the nine-system vision an asset or a liability? | Liability for fundraising; asset as architecture | Asset: it is the reason the product is different | Liability: fixed costs of C/D/G before revenue | Liability: ship the ledger and one wedge; everything else is a roadmap slide | Keep the architecture; sequence the build (Doc 1–8 owners to agree) |
| Behavioural analytics as a selling point? | No; contested evidence invites regulator and press scrutiny | Yes, if "scientifically restrained" is the brand | Neutral; it costs little | No; nobody buys restraint | Position as trust/retention feature; never in acquisition copy |
| Regulated advice eventually? | Only through partners | Own licence by Stage 3 to capture value | Partner first; own licence when revenue > $3m | Never, unless it is the business | Decision deferred to Stage-3 gate with legal opinion |
| Is the mass-affluent Nigerian tax job dead? (new) | Yes for retail share and IPO holders (s.34(1)(a)); keep only cross-border | Dissent: the salaried mass-affluent still need a *year-round* position, reliefs and records, which calculators do not provide. Keep an indicative PIT view inside the ledger as a retention feature | Not a revenue line: free substitutes exist | Agrees with VC | Indicative PIT view stays in the product (C7 watermark); only the cross-border pack is priced |
| Plan-gated LLM costs vs R09's uniform 2.5× stress (new) | — | Plan gating is a product rule we control | Gating is an assumption until tokens are measured; R09's stress (Nigeria-heavy margin ≈ 1%) stays in the sensitivity table | Ship gating in code, not in the price sheet | Base case uses gating; the decision gates use **measured** tokens and churn, not either model |
| Does the larger funnel (R09 M5, 2.7–4.7×) change the call? (new) | No: WTP and CAC bind, not headcount | It strengthens the bull case | No: the SOM was never funnel-limited | No | SAM revised up; SOM and recommendation unchanged; reviewer's bull case recorded in §7.4 |

### 7.4 Bull and bear cases (kept and strengthened after R09)

**Strongest bull case.**
1. **The addressable base is 2.7–4.7× larger than v0.1 modelled** (Table B). The bearish proxies (Play-store revenue; national smartphone share) under-count affluent web payers (F5, F9).
2. **Diaspora tax pain is new, legal and large.** Under the disjunctive s.201 definition, a Nigerian in Dubai or London who keeps a Lagos flat or family ties may be resident and taxed on worldwide income. FX itself is a chargeable asset, and no UAE treaty is in effect (Doc 6 F10, F13, F14). Remittances run at about $21.8bn a year [S17]. Nobody in the competitor matrix explains this exposure. It is a fear-driven, deadline-driven, USD-paying job.
3. **The data moat is real.** Nobody sells corporate-action-adjusted NGX data, and the NGX EOD API costs about ₦425k a year on a personal licence (Doc 5c). A validated adjustment engine is a product moat and a sellable asset.
4. **A growing retail cohort** gives a free top-of-funnel for tracking, not tax: more than 2m digital IPO subscribers will receive their first CSCS statements [S79]. It arrives while Okra's exit and Mono's sale have left the field empty.
5. **USD-only economics hold at small scale.** Breakeven is near 30k payers at 7% churn in v0.2 (R09 said ~10k on v0.1 costs; §11 explains the difference), inside the SOM.

**Strongest bear case.**
1. **The wedge may not be there.** Mass retail has nothing to compute (F15). For cross-border users the system must flag residency as "needs professional review". The software then becomes an intake form for a practitioner who captures the fee, and the CITN Act may require exactly that structure (F21).
2. **Every lever that rescues the economics is outside the founder's control:**
   - churn: at 7% the business needs 92% USD payers at a $25 CAC;
   - tokens and aggregation: together they take Nigeria-heavy margin to about 1%;
   - Play billing: 15%;
   - the naira.
3. **Distribution is owned by incumbents.** PiggyVest (6m users, adding business accounts), integrated bank, asset-manager and PFA groups, and diaspora money apps can each add a "net worth + tax estimate" tab at zero marginal CAC.
4. **The B2B2C route has no price anchor.** PFA fee economics cannot carry per-member pricing, and the seller is a founder without enterprise-sales history facing 12–24-month cycles.
5. **Capital efficiency was overstated.** With a founder salary and USD-indexed hires, Stage 2 costs $0.54–0.84m, not $0.4–0.5m. Seed-to-Series-A conversion is 5.5–6.5% and active Nigerian investors fell 30% [S52].

---

## 8. Recommendations, ranked

Classification: *Personal-MVP must-have* / *Later* / *Do-not-build (yet)*. Each top item is subjected to the five-question test (Context Brief §6) **from a commercial standpoint**.

### 8.1 Ranked recommendations

1. **Build the provenance-first multi-currency ledger (System A) and prove it on the founder** — *Personal-MVP must-have*. It is the precondition for every monetisable feature and the only thing competitors in Nigeria do not do (F1, §4.3).
2. **Build the cross-border tax-and-records engine (System G) for the founder first, with every rule taken to `practitioner_confirmed` under C7. Sell it only as a practitioner-co-signed pack** — *Personal-MVP must-have* for the founder's own position. Paid packs are *Later*, after the CITN opinion (F21) and signal S-b. The founder's own case is a cross-border case, so the personal MVP and the wedge coincide. Mass-retail NGX/IPO holders get tracking and an indicative, watermarked PIT view, not a paid tax product (F6, F15).
3. **Build validated NGX/US/UAE holdings analytics (C/D) only to the depth needed to value and tax the user's own portfolio. License data for internal use, not redistribution** — *Personal-MVP must-have* for holdings; *Later* for research breadth. Settle the NGX non-display question in writing first (V-012).
4. **Price in USD for diaspora users from the first paid test. Offer NGN only as an annual prepaid plan. Basic carries no deep research, enforced in code** — *Later* (Stage 1 tests). §4.4 shows this is the difference between a business and a hobby.
5. **Pursue one *paid* B2B pilot (≥ $5k; PFA, broker, adviser or practitioner firm) on a flat-licence price, by month 18** — *Later*; the most credible venture route (A4, M4).
6. **Keep behavioural analytics (B) as an internal measurement and retention layer; do not market it** — *Later*; the evidence is contested (F20).
7. **Do not offer personalised recommendations, portfolio management, money movement or direct UAE consumer marketing before Stage 3 and the relevant legal opinions** — *Do-not-build (yet)* (F14, F17).
8. **Do not build a free tier with unmetered AI chat** — *Do-not-build (yet)*. Uniform heavy use is loss-making on every plan (§4.4).
9. **Do not process any second person's data before a DPIA, a transfer instrument and a privacy design exist** — governance; *Personal-MVP must-have* before Stage 1 (F16; V-028).
10. **Do not raise institutional capital before the month-9 signals and the month-15 confirmation** — governance recommendation; see §8.3.

### 8.2 Five-question test on the top three capabilities (commercial lens)

| Question | 1. Multi-currency, provenance-first ledger | 2. Cross-border tax-and-records engine (practitioner co-signed) | 3. Validated multi-market holdings analytics |
|---|---|---|---|
| Real problem? | Fragmented NGN/AED/USD money with no aggregation rail (F1) | Foreign-share gains with no threshold, FX as a chargeable asset and disjunctive s.201 residency, which no free calculator handles (F15) | Stale or wrong market figures in existing tools (Context Brief §1); IPO cohort needs records, not tax (F6) |
| Who needs it and why? | Multi-account mass-affluent and diaspora (S1, S2): decisions on FX, savings allocation, debt | S6: 99k–463k cross-border investors and diaspora (Table C); compliance, penalty avoidance (NTAA s.65, s.101) | Retail shareholders (~0.6m active [S3], 2m+ IPO subscribers [S79]) and their advisers |
| Evidence for the approach? | Kubera's paid multi-currency niche [S57]; Monarch's post-Mint growth [S54]; Mono's linkages show demand for connectivity [S35] (E4) | Statute text (E2, Doc 6); demand unmeasured (E6 until S-b) | Provenance requirements from the brief (E5); data vendors exist [S65][S86] (E3) |
| Build and validate reliably? | Statement parsing first; Mono only after a shadow test (Doc 4 R10); reconciliation tests to the unit of currency (C1) | Versioned rules under C7 (draft → sourced → reviewed-internal → practitioner-confirmed); FX pool and lots per C1.6; residency questionnaire (Doc 6 R3); weakest links are the C1.6 practitioner questions and the CITN opinion | Licensed EOD data; corporate-action tests against NGX notices; weakest link is DFM/ADX data access |
| Measurable improvement to justify continuing? | All 12 monthly periods reconcile with zero unexplained difference (Doc 6 Gate 1); zero unsourced figures (C2) | Founder's pack reviewed with no material practitioner correction before 31 Mar 2027; signal S-b (≥ 20 paid packs at ≥ $75 by month 9) | ≥ 95% of holdings priced within one trading day with source and timestamp; zero unsourced figures |
| Commercial verdict | Necessary, not sufficient; monetises only through 2 and 3 | Candidate wedge; seasonal; liability-bearing; may end as a practitioner tool (A9) | Monetises better B2B (M5/M6) than B2C |

### 8.3 Fund / no-fund recommendation, signals and kill criteria

**Recommendation: no-fund at pre-seed today.** Stages 0–1 are founder-financed (about $40–80k in total). The first decision is at **month 9 (4 August 2027)**, on signals that can be read by then. Approach angels (≤ $150k) only if **two of three** pre-registered signals pass. Each signal has a single cutoff, so a result cannot fall between "pass" and "kill" (v0.1 left 8–11 of 20 undefined, R09 m9). Friends, family and existing contacts are excluded from every count.

| Signal (runs months 3–9) | Pass if (by month 9) | Fail if | Why this threshold |
|---|---|---|---|
| **S-a Priced pre-orders, cold channel** | At least 150 screened non-friend prospects (multi-currency, ≥ 1 investment) are recruited by cold channels (diaspora community lists, paid social, investing forums) to a checkout page, and **≥ 30 pay a full annual pre-order** (≥ $60 USD plan or ≥ ₦25,000 NGN plan), refundable until delivery | < 30 payers | 30/150 has a Wilson 95% interval of 14–27%, which excludes the 10% low WTP bound in Table B. v0.1's 8/20 interval (22–61%) could not separate 25% from 50% |
| **S-b Paid cross-border diagnostic** | **≥ 20 cross-border users** (foreign shares, FX holdings, or diaspora with Nigerian ties) pay ≥ $75 (or naira equivalent) for a practitioner-co-signed tax-and-records pack, delivered by month 9 | < 20 | Tests the re-scoped wedge with real money. Runs only after the CITN opinion (month 6) and with the practitioner as the paid, signing party |
| **S-c Professional usage** | **≥ 5 licensed advisers or CITN-registered practitioners** use the free beta in ≥ 6 of 8 consecutive weeks | < 5 | Usage, not letters of intent: an LOI costs the signer nothing (R09 B2) |

**Confirmation at month 15 (4 February 2028)**, before any priced round. Two tests:
- 90-day paid retention of month-9 payers is ≥ 60%;
- the paying base's USD share is ≥ **U\*(measured churn, measured CAC)** (§4.4), or contracted B2B revenue exists.

**Seed (Stage 3).** Fund at seed only if one of two revenue tests is met, and the SEC-perimeter and CITN opinions are in hand:
- annualised revenue ≥ $250k with LTV/CAC ≥ 3 at measured churn (equivalently, USD share ≥ U\*); or
- contracted B2B ARR ≥ $150k from ≥ 2 clients.

This replaces v0.1's gates of "35% USD", "250,000 members" and "CAC < $15".

**Kill criteria (stop treating Portfolio OS as a company; keep it as a personal tool).** Each is dated and falsifiable, and U\* is the only USD threshold.

| Gate (date) | Kill if | Rationale |
|---|---|---|
| End of Stage 0 (month 6, 4 May 2027) | Any of the founder's accounts fails to reconcile for any of 12 monthly periods to the printed closing balance with zero unexplained difference, or `Suspense` ≠ 0 at a close (Doc 6 Gate 1; C1-I7). v0.1's "≥ 99%" did not say by count, value or period | If the data problem is unsolved for one motivated user, it is unsolved for 1,000 |
| Month 6 (legal) | The opinions conclude that core outputs are regulated advice or tax practice **and** no licensed partner or practitioner will hold the activity. If the opinions are simply late, nothing is sold until they arrive (a block, not a kill) | Capital, audit and criminal exposure exceed Stage-2 funding |
| Month 9 (4 Aug 2027) | Fewer than two of S-a, S-b, S-c pass | No demand evidence from strangers paying real money |
| Month 15 (4 Feb 2028) | 90-day paid retention < 60%, **or** USD-payer share < U\*(measured churn, measured CAC) with no contracted B2B revenue | One churn-indexed USD threshold (R09 M4). At 7% churn and a $15 CAC, U\* = 49% |
| Month 18 (4 May 2028) | No paid B2B pilot ≥ $5,000 signed **and** blended CAC > kill CAC (LTV/CAC < 1.5 at measured churn and mix; e.g. $40 for the diaspora mix at 7% churn) | The two routes to scale both fail |
| Month 24 (4 Nov 2028) | Contribution after acquisition is negative for the whole paying base at measured churn | No path to breakeven inside the SOM (§4.4 table) |

**Operating rules (not kill criteria).**
- **Founder time cap.** Commercial work is capped at 20 hours a week through month 9. If the plan needs more, scope is cut, not the cap (R09 B2: one founder cannot run Stage 0, a pilot, PFA business development and a tax season at once).
- **Repricing.** v0.1's "naira depreciates > 40%" kill is replaced by the repricing rule in §7.1. It was an external event, not a test of the hypothesis (R09 2A).
- **Founder hours are logged weekly**, so the month-9 review can show what the signals cost.

**Alternative outcomes if killed as a venture:** keep the personal system; open-source the NGX corporate-action and tax-rule libraries to build reputation; license the cross-border engine to a practitioner firm (A9); or sell the data pipeline to a broker.

---

## 9. Required validation before implementation

1. **Legal opinion (Nigerian capital-markets counsel), by month 6.** Does holdings analytics, research summaries and tax computation without recommendations fall outside the SEC digital advisory rules [S28]? What follows from ISA 2025? What is the open-banking participation route [S33]?
2. **CITN Act and tax-practice opinion (V-023), plus licensed tax practitioner review, by month 6.**
   - Is a fee-charging tax-and-records pack, or the software behind it, "practice of taxation" under CITN Act s.16(1)/s.19(2) [S87]? Does a CITN member's co-signature resolve it, or must the company employ registered practitioners? Have the Act or the case law changed since 2004?
   - Liability for pre-filled schedules (NTAA s.33(4)(a), s.101); engagement terms; professional-indemnity cover.
   - The four C1.6 practitioner questions (FX disposals, cost method, official rate field, NGN cost of USD-bought securities).
   - The s.201 residency limbs; the cross-border rule set taken to `practitioner_confirmed` (C7).
   - **Two quotes** for per-pack review.
3. **Data protection (NDPC-licensed consultant), before any second user.** A DPIA for financial services; a cross-border transfer instrument for LLM and cloud processing; registration tier under GAID at each stage (numeric tiers from primary NDPC text, not S85); Compliance Audit Return obligations; the privacy design required by V-028.
4. **UAE counsel (free-zone and onshore).** Whether any Portfolio OS activity is "promotion" or "financial advisory" under Decree-Law 33/2025; Category-4-type licensing thresholds; PDPL status; the Open Finance third-party-provider route [S25–S27][S45][S46].
5. **Market-data licences.** NGX's written answer on non-display use and the local or international fee basis (Doc 5c; V-012); DFM, ADX and US redistribution and internal-use terms.
6. **Pre-registration of signals S-a/S-b/S-c and the month-15 tests** (with Product and Behavioural Finance). Recruitment channels, screening, refund terms and analysis are fixed before the first prospect is contacted. Real payment collection, not surveys.
7. **Cost measurement (Finance and Technology).**
   - Tokens per chat and per research run on the actual prototype, replacing the E5 profiles.
   - Mono shadow-test cost per account (Doc 4 R10).
   - Paystack and FX leakage on real NGN and USD charges.
   - Lagos and remote-USD salary quotes.
   - Two B2B price quotes from PFAs, brokers or banks (R09 IC question 2).
8. **Independent re-check of this memo's weakest inputs** before any number here enters a pitch: willingness to pay, churn, P(banked and smartphone | high income), the Table C shares, CAC and diaspora headcount (all E4/E5).

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
- [S37] Andersen Nigeria, "GAID 2025 takes effect: a new data privacy compliance era", 2025. https://ng.andersen.com/gaid-2025-takes-effect-a-new-data-privacy-compliance-era-for-nigeria-businesses/. E3 for the effective date. **v0.2 correction:** the page gives no numeric registration tiers (R09 re-fetch); those rest on S85 only (E4).
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
- [S62] Sensor Tower, "Top 5 Personal Finance Apps on Android in Nigeria, Q3 2025", Sep 2025 (vendor estimates). https://sensortower.com/blog/2025-q3-android-top-5-personal%20finance%20budgeting%20and%20planning-revenue-ng-63e363f0e1714cfff1979caa. E3 as an app-store revenue estimate; **E4 as evidence of willingness to pay** (v0.2). Weekly unit stated for 2 of 4 apps; Money Tracker peaked at 17.7K actives (R09 re-fetch).
- [S63] Paystack, "Transactions pricing" (support article). https://support.paystack.com/hc/en-us/articles/360009881920. Fetched 2026-11-04: local "1.5% + NGN 100", "the NGN 100 fee is waived for transactions under NGN 2,500", "capped at NGN 2,000"; international "3.9% + NGN 100" (Mastercard, Visa, Verve), 4.5% American Express. E3. v0.1 misread the waiver as "≤ ₦2,500".
- [S64] Flutterwave Nigeria pricing as reported by comparison sites (2.0% local; 4.8% international) — unverified. E4.
- [S65] EODHD, pricing page. https://eodhd.com/pricing. E3.
- [S66] The Nigerian Stock Exchange, *Schedule 4 — Market Data Pricelist 2018* (PDF read; dated). https://doclib.ngxgroup.com/market_data-site/market-data-services-site/Data%20Policies/NSE%20Market%20Data%20Pricelist%202018.pdf. E3 (stale). **Superseded in v0.2 by [S86].**
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
- [A8] Karlan, D., McConnell, M., Mullainathan, S. & Zinman, J. (2016). "Getting to the Top of Mind: How Reminders Increase Saving". *Management Science* 62(12), 3393–3411. https://doi.org/10.1287/mnsc.2015.2296 **[verified]** (Crossref, 2026-11-04; OpenAlex returned the title and year but a garbled author list). Working-paper version: https://doi.org/10.2139/ssrn.1652784.
- [A9] Rossi, A. G. & Utkus, S. P. (2020). "Who Benefits from Robo-advising? Evidence from Machine Learning". SSRN working paper. https://doi.org/10.2139/ssrn.3552671 **[verified as working paper]**.
- [A10] Levi, Y. & Benartzi, S. (2026). "Mind the App: Mobile Access to Financial Information and Consumer Behavior". *Journal of Finance*. https://doi.org/10.1111/jofi.70087 **[verified]**.

**Added in v0.2 (accessed 2026-11-04 unless stated)**
- [S86] NGX, *Market Data Pricelist, Schedule 3* (PDF created 12 Aug 2026), as extracted and read by Doc 5c (its [S3]; F4, §4.6); non-display arithmetic per R05c M1. https://ngxgroup.com/ngx-download/market-data-pricelist-2/?wpdmdl=41216. E2 via Doc 5c (not re-extracted here).
- [S87] *Chartered Institute of Taxation of Nigeria Act*, Cap. C10, Laws of the Federation of Nigeria 2004, as hosted by the Policy and Legal Advocacy Centre. https://www.lawsofnigeria.placng.org/print.php?sn=66. Fetched 2026-11-04; ss.16, 19(2), 19(4), 19(6), 22 read. E2 (statute text; later amendments not checked). Case-law reports (Federal High Court 2019; ICAN appeal filings) from search results only: https://portal.citn.org/wp-content/uploads/2023/01/CITN-ICAN_Supreme-Court-Notice-of-Appeal-2013.pdf; https://spaajibade.com/is-a-citn-license-required-to-file-tax-returns-a-review-of-the-ican-v-firs-citn-case-olukolade-ehinmosan/. E4.
- [S88] Google Play Console Help, "Service fees". https://support.google.com/googleplay/android-developer/answer/112622. Fetched 2026-11-04: auto-renewing subscriptions "10% + 5% billing fee" for Australia, the EEA, Japan, the UK and the US; Nigeria not listed. E3.
- [S89] UN DESA, *International Migrant Stock 2024*, Nigerian-born population abroad 2,094,265 (mid-2024) and 1,768,444 (2020), via statbase.ru (https://statbase.ru/data/nga-international-migrant-stock-by-origin/) and the Migration Policy Institute data hub (https://www.migrationpolicy.org/programs/data-hub/charts/immigrant-and-emigrant-populations-country-origin-and-destination); search summaries, UN table not downloaded. E4.
- [S90] Nigerian Tribune, "Tinubu launches personal income tax calculator under new reform laws" (Aug 2025), https://tribuneonlineng.com/tinubu-launches-personal-income-tax-calculator-under-new-reform-laws; TheCable, "Tinubu unveils personal income tax calculator to simplify compliance", https://www.thecable.ng/tinubu-unveils-personal-income-tax-calculator-to-simplify-compliance (search summaries). fiscalreforms.ng fetched 2026-11-04: home page of the Presidential Committee on Fiscal Policy & Tax Reforms; the calculator URL redirected to it. E3 (launch); live status unverified.
- [S91] Portfolio OS internal documents (v0.1–v0.2, 2026-11-02 to 2026-11-04): Doc 4 (F2, F8, R10), Doc 5c (F1–F4, F7, §4.6, N14–N15), Doc 6 (F8–F19, F30–F31, F34–F38, R3, R7), `CANONICAL_CONTRACTS.md` (C1.6, C3, C5.1, C7), reviews R05c, R06, R09, revision log V-012, V-023, V-028. Competitors named only by R09 (Sharesight, Getquin, Snowball, Delta, Grey, Nala, Afriex, Cleva, Personetics, Meniga, Moneyhub, Stanbic IBTC, ARM, United Capital) were not re-fetched in this pass (E4 via reviewer).

*Calculation scripts (v0.2):* `research/scripts/doc09_unit_economics_mix.py` (per-subscriber model; `legacy=True` reproduces the v0.1 table) and `research/scripts/doc09_sizing_and_unit_economics.py` (funnel, cross-border segment, steady-state P&L and breakeven, capital plan, B2B2C, signals). Both use the standard library only and run under `python3 -I`; outputs quoted in §4.2–§4.7 and §8.3 are verbatim from a run on 2026-11-04. Reviewer recomputation: `research/scripts/r09_unit_economics_sensitivity.py`. v0.1's `model.py`/`model2.py` were moved into the repository as the doc09 scripts (V-002, commit 593543c) and have now been revised in place.
