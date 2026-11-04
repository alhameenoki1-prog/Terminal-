# Portfolio OS - Doc 9 sizing and unit-economics sketch. All inputs are explicit assumptions (see memo for sources).
FX = 1346.0  # NGN per USD, NFEM close 30 Oct 2026 (Tribune/CBN)

def usd(n): return n / FX

print("=== A. PRICE ANCHORS (USD at NFEM 1,346) ===")
anchors = {"Spotify NG monthly N1,300": 1300, "Netflix NG premium N8,500": 8500, "Cowrywise/Paystack cap N2,000": 2000}
for k,v in anchors.items(): print(f"{k}: ${usd(v):.2f}")
tiers = {"Basic NGN N2,500/mo": 2500, "Pro NGN N7,500/mo": 7500, "Annual NGN N25,000": 25000}
for k,v in tiers.items(): print(f"{k}: ${usd(v):.2f}")

print("\n=== B. TOP-DOWN FUNNEL, NIGERIA (ranges) ===")
adults_2026 = (115e6, 120e6)   # EFInA 111m in 2023 + growth (assumption)
share_banked = (0.52, 0.56)
share_smart = (0.33, 0.60)     # EFInA 2023 ~29-33% of adults vs KPMG 75% urban 2025 -> wide band
share_income = (0.05, 0.08)    # adults earning > ~N200k/month (EFInA 2023: 5% above N115k; inflation drift)
share_invest = (0.30, 0.50)    # of those, holding any investment product (SEC MF 1.31m holders; CSCS ~0.6m active; apps 3-6m)
share_wtp = (0.10, 0.25)       # willing to pay for software (assumption; Sensor Tower data shows paid PFM near zero today)
lo = adults_2026[0]*share_banked[0]*share_smart[0]*share_income[0]*share_invest[0]
hi = adults_2026[1]*share_banked[1]*share_smart[1]*share_income[1]*share_invest[1]
print(f"Nigeria addressable individuals (banked, smartphone, income>~N200k, invests): {lo/1e6:.2f}m - {hi/1e6:.2f}m")
print(f"  of which plausibly willing to pay: {lo*share_wtp[0]/1e3:.0f}k - {hi*share_wtp[1]/1e3:.0f}k")
arpu_ng = (20, 60)  # USD/yr blended
print(f"  Nigeria consumer revenue SAM: ${lo*share_wtp[0]*arpu_ng[0]/1e6:.1f}m - ${hi*share_wtp[1]*arpu_ng[1]/1e6:.1f}m per year")

print("\n=== C. UAE / DIASPORA (ranges) ===")
uae_expats = (10.0e6, 10.3e6)
uae_digital_investors = (0.4e6, 1.0e6)   # Sarwa 300k registered Dec-2025 as anchor; others unknown
uae_wtp = (0.05, 0.15)
arpu_uae = (60, 150)
print(f"UAE digitally-engaged investors: {uae_digital_investors[0]/1e3:.0f}k-{uae_digital_investors[1]/1e3:.0f}k; paying: {uae_digital_investors[0]*uae_wtp[0]/1e3:.0f}k-{uae_digital_investors[1]*uae_wtp[1]/1e3:.0f}k; revenue ${uae_digital_investors[0]*uae_wtp[0]*arpu_uae[0]/1e6:.1f}m-${uae_digital_investors[1]*uae_wtp[1]*arpu_uae[1]/1e6:.1f}m/yr")
nig_uae = (50e3, 100e3)
print(f"Nigerians in UAE 50-100k -> paying at 3-10%: {nig_uae[0]*0.03/1e3:.1f}k-{nig_uae[1]*0.10/1e3:.0f}k")

print("\n=== D. UNIT ECONOMICS PER PAYING SUBSCRIBER (monthly, USD) ===")
mix = {"ngn_basic":0.65, "ngn_pro":0.20, "usd":0.15}
price = {"ngn_basic": usd(2500), "ngn_pro": usd(7500), "usd": 10.0}
arpu = sum(mix[k]*price[k] for k in mix)
print(f"Blended ARPU: ${arpu:.2f}/month (${arpu*12:.0f}/yr)")
# payment costs
pay_cost = mix["ngn_basic"]*price["ngn_basic"]*0.015 + mix["ngn_pro"]*(price["ngn_pro"]*0.015+usd(100)) + mix["usd"]*price["usd"]*0.039
print(f"Payment processing (Paystack local 1.5%+N100, intl 3.9%): ${pay_cost:.3f}  ({pay_cost/arpu*100:.1f}% of ARPU)")
store_cost = arpu*0.15
print(f"If billed via app stores at 15%: ${store_cost:.2f}")
# LLM cost scenarios (Sonnet 5.5 $2/$10 per MTok; Opus 5.5 $4/$20; Haiku 5.5 $0.10/$0.50; cache reads ~10% of input price)
def llm(queries, in_tok, out_tok, p_in, p_out, cache_share=0.6):
    inp = queries*in_tok*((1-cache_share)*p_in + cache_share*p_in*0.1)/1e6
    out = queries*out_tok*p_out/1e6
    return inp+out
light = llm(15, 5000, 500, 2, 10) + llm(600, 300, 40, 0.10, 0.50, 0)   # 15 chats + 600 txn classifications (Haiku)
medium = llm(40, 8000, 700, 2, 10) + llm(1500, 300, 40, 0.10, 0.50, 0) + llm(2, 60000, 4000, 4, 20)
heavy = llm(120, 10000, 900, 2, 10) + llm(3000, 300, 40, 0.10, 0.50, 0) + llm(8, 80000, 6000, 4, 20)
print(f"LLM cost/active user/month: light ${light:.2f}, medium ${medium:.2f}, heavy ${heavy:.2f}")
# market data allocation (fixed licences spread over actives)
for actives in (3000, 30000, 300000):
    fixed_data = 100 + 2000 + usd(625000+500000)/12   # EODHD all-in-one + est. commercial feed + NGX web/mobile RT + EOD licences (2018 schedule)
    print(f"  market-data fixed ~${fixed_data:,.0f}/mo -> per active at {actives:,}: ${fixed_data/actives:.3f}")
support = 0.25; infra = 0.10
for name, l in (("light",light),("medium",medium),("heavy",heavy)):
    var = pay_cost + l + support + infra + 0.05
    print(f"Variable cost ({name} LLM): ${var:.2f}; gross margin {(arpu-var)/arpu*100:.0f}%")

print("\n=== E. CAC, CHURN, PAYBACK ===")
for cac in (8, 25, 60):
    for churn in (0.04, 0.07, 0.10):
        gm = arpu - (pay_cost + medium + support + infra + 0.05)
        ltv = gm/churn
        payback = cac/gm
        print(f"CAC ${cac:>2} churn {churn*100:>4.0f}%/mo -> LTV ${ltv:5.0f}, LTV/CAC {ltv/cac:4.1f}, payback {payback:4.1f} months")

print("\n=== F. P&L SKETCH AT SCALE (annual USD) ===")
fixed_team = {10_000: 55_000*12, 100_000: 160_000*12, 1_000_000: 600_000*12}  # monthly team+G&A assumptions
compliance = {10_000: 60_000, 100_000: 250_000, 1_000_000: 900_000}
data_lic = {10_000: 40_000, 100_000: 150_000, 1_000_000: 600_000}
for n in (10_000, 100_000, 1_000_000):
    rev = n*arpu*12
    var = n*(pay_cost+medium+support+infra+0.05)*12
    cac_spend = n*0.9*25   # replace ~90%/yr churned + growth, at mid CAC
    total_cost = var+fixed_team[n]+compliance[n]+data_lic[n]+cac_spend
    print(f"{n:>9,} paying: revenue ${rev/1e6:5.2f}m | variable ${var/1e6:4.2f}m | team ${fixed_team[n]/1e6:4.2f}m | compliance ${compliance[n]/1e6:4.2f}m | data ${data_lic[n]/1e6:4.2f}m | CAC ${cac_spend/1e6:4.2f}m | EBITDA ${(rev-total_cost)/1e6:5.2f}m")

print("\n=== G. REGULATORY CAPITAL IN USD ===")
for k,v in {"SEC IA corporate N50m":50e6,"SEC robo-adviser N100m":100e6,"SEC digital sub-broker N100m":100e6,"NDPA max fine N10m floor":10e6}.items():
    print(f"{k}: ${usd(v)/1e3:.0f}k")
