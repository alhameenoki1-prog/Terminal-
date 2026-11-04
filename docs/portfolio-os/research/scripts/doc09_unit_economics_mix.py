FX=1346.0
usd=lambda n:n/FX
def unit(mix, price, llm=1.03, support=0.25, infra=0.10, other=0.05, intl_fee=0.039, local_fee=0.015, local_fixed=100):
    arpu=sum(mix[k]*price[k] for k in mix)
    pay=0
    for k in mix:
        if k.startswith("ngn"):
            fee=price[k]*local_fee + (usd(local_fixed) if price[k]*FX>2500 else 0)
        else:
            fee=price[k]*intl_fee
        pay+=mix[k]*fee
    var=pay+llm+support+infra+other
    return arpu,pay,var,(arpu-var)/arpu
scen={
 "Nigeria-heavy (65/20/15)":({"ngn_basic":.65,"ngn_pro":.20,"usd":.15},{"ngn_basic":usd(2500),"ngn_pro":usd(7500),"usd":10}),
 "Balanced (40/20/40)":({"ngn_basic":.40,"ngn_pro":.20,"usd":.40},{"ngn_basic":usd(2500),"ngn_pro":usd(7500),"usd":10}),
 "Diaspora/UAE-heavy (20/10/70)":({"ngn_basic":.20,"ngn_pro":.10,"usd":.70},{"ngn_basic":usd(2500),"ngn_pro":usd(7500),"usd":10}),
 "UAE premium only ($15)":({"usd":1.0},{"usd":15}),
}
print("scenario | ARPU/mo | pay cost | variable | GM% | LTV@5%churn | LTV/CAC@$25 | LTV/CAC@$8")
for n,(m,p) in scen.items():
    a,pay,v,gm=unit(m,p)
    ltv=(a-v)/0.05
    print(f"{n} | ${a:.2f} | ${pay:.2f} | ${v:.2f} | {gm*100:.0f}% | ${ltv:.0f} | {ltv/25:.1f} | {ltv/8:.1f}")
print("\nB2B2C sketches (annual USD):")
print(f"PFA/bank white-label at $0.25-1.00 per covered member/yr x 1-3m members: ${0.25*1e6/1e6:.2f}m - ${1.0*3e6/1e6:.1f}m")
print(f"Adviser/broker seats: 200-1,000 seats x $40-80/mo: ${200*40*12/1e3:.0f}k - ${1000*80*12/1e6:.2f}m")
print(f"Tax computations: 5k-50k paid computations x N10k-N25k: ${5e3*usd(10000)/1e3:.0f}k - ${50e3*usd(25000)/1e6:.2f}m")
print(f"Data/analytics API (NGX fundamentals w/ provenance): 10-40 B2B clients x $500-2,000/mo: ${10*500*12/1e3:.0f}k - ${40*2000*12/1e6:.2f}m")
# Stage capital
print("\nStage capital (USD):")
team_cost_mo={"NG senior eng":2200,"NG mid eng":1300,"NG data/quant":1800,"NG ops/compliance":1200,"UAE/diaspora lead":9000}
for k,v in team_cost_mo.items(): print(f"  {k}: ~${v:,}/mo (assumption from salary ranges)")
s2 = (2*2200+1300+1800+1200)*18 + 60000 + 40000 + 30000
print(f"Stage 2 (18 months, 5 people, data+LLM+legal+NDPC): ~${s2/1e3:.0f}k before CAC; with $100-200k CAC -> ${(s2+100e3)/1e3:.0f}k-${(s2+200e3)/1e3:.0f}k")
s3 = (3*2200+2*1300+2*1800+2*1200+9000)*24 + usd(50e6) + 250000 + 150000 + 120000
print(f"Stage 3 (24 months, 10 people, SEC capital N50m, UAE licence/compliance, data, legal): ~${s3/1e6:.2f}m before CAC")
