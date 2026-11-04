FX=1346.0
usd=lambda n,fx=FX:n/fx
def unit(mix, usd_price=10, fx=FX, llm=1.03, vat_ng=0.0, fixed_on_2500=False, store=0.0, agg=0.0, other=0.40):
    p={"b":usd(2500,fx),"p":usd(7500,fx),"u":usd_price}
    arpu_g=sum(mix[k]*p[k] for k in mix)
    net={k:(p[k]/(1+vat_ng) if k in "bp" else p[k]) for k in p}
    arpu=sum(mix[k]*net[k] for k in mix)
    pay=0
    for k in mix:
        if k in "bp":
            f=p[k]*0.015+(usd(100,fx) if (p[k]*fx>2500 or (fixed_on_2500 and p[k]*fx>=2500)) else 0)
        else: f=p[k]*0.039+(usd(100,fx) if fixed_on_2500 else 0)
        pay+=mix[k]*(f if store==0 else p[k]*store)
    var=pay+llm+other+agg  # other = support .25 + infra .10 + other .05
    return arpu,var,arpu-var
mixes={"NG-heavy 65/20/15":{"b":.65,"p":.2,"u":.15},"Balanced 40/20/40":{"b":.4,"p":.2,"u":.4},"Diaspora 20/10/70":{"b":.2,"p":.1,"u":.7},"Basic only":{"b":1.0},"USD $10 only":{"u":1.0}}
print("A. Memo base vs adjusted (monthly USD): ARPU, var, contrib, GM, LTV@5%, LTV@7%, LTV/CAC25 @5/7%")
for n,m in mixes.items():
    for lab,kw in [("memo",{}),("adj",dict(vat_ng=0.075,fixed_on_2500=True,llm=1.03)),("adj+agg+LLMx2.5",dict(vat_ng=0.075,fixed_on_2500=True,llm=2.6,agg=1.11*0.5)),("adj FX1700",dict(vat_ng=0.075,fixed_on_2500=True,fx=1700))]:
        a,v,c=unit(m,**kw)
        print(f"{n:18s} {lab:16s} ARPU {a:5.2f} var {v:4.2f} contrib {c:5.2f} GM {c/a*100:5.0f}% LTV5 {c/.05:6.1f} LTV7 {c/.07:6.1f}  L/C {c/.05/25:4.1f}/{c/.07/25:4.1f}")
print("\nB. USD-payer share needed for LTV/CAC>=3 at CAC $25 (rest split Basic:Pro 65:20 ratio)")
for churn in (0.05,0.07,0.10):
  for kw_lab,kw in [("memo",{}),("adj",dict(vat_ng=0.075,fixed_on_2500=True))]:
    need=None
    for s in range(0,101):
        u=s/100; rest=1-u
        m={"b":rest*65/85,"p":rest*20/85,"u":u}
        a,v,c=unit(m,**kw)
        if c/churn/25>=3: need=s;break
    print(f"churn {churn:.0%} {kw_lab}: USD share needed = {need}%")
print("\nC. Breakeven: memo fixed costs (team+compliance+data) & acquisition = CAC x 12 x churn x N (steady state)")
fixed={10_000:0.66e6+0.06e6+0.04e6,100_000:1.92e6+0.25e6+0.15e6,1_000_000:7.2e6+0.9e6+0.6e6}
for n,m in mixes.items():
  if n in("Basic only",):continue
  a,v,c=unit(m)
  for churn in (0.05,0.075):
    row=[]
    for N,F in fixed.items():
        eb=N*12*(c-25*churn)-F
        row.append(f"{N:>9,}: {eb/1e6:6.2f}m")
    print(f"{n:18s} churn {churn:.1%} per-sub/yr contribution after CAC {12*(c-25*churn):6.2f} | "+" | ".join(row))
print("\nmemo P&L uses 0.9 replacement => implied monthly churn", 0.9/12)
print("annual attrition at 5%/mo:",1-0.95**12)
print("\nD. B2B2C revenue at memo pricing")
for mem in (250e3,500e3,1e6,3e6):
    print(f"{mem:>9,.0f} members: ${0.25*mem/1e3:,.0f}k - ${1.0*mem/1e3:,.0f}k per year")
print("PFA revenue per RSA approx: AUM N27.45tr; RSAs 11.04m; avg RSA N",27.45e12/11.04e6, "= $",27.45e12/11.04e6/FX)
for fee in (0.005,0.01):
    print(f" at {fee:.1%} fee: ${27.45e12*fee/11.04e6/FX:.1f}/RSA/yr; $1/member = {1/(27.45e12*fee/11.04e6/FX):.1%} of it")
print("\nE. Kill-criterion arithmetic")
print("Signal (c): 500 x N10,000 =", 500*10000/FX, "USD;  100 x $25 =",2500)
print("Signal (a): 40% of 20 users =",0.4*20,"payers; 95% CI (Wilson) for 8/20:")
import math
def wilson(k,n,z=1.96):
    p=k/n; d=1+z*z/n; c=(p+z*z/(2*n))/d; h=z*math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d; return c-h,c+h
print(wilson(8,20), "12/20:",wilson(12,20), "5/20:",wilson(5,20))
print("Stage-1 fund threshold vs Stage-2 kill: 300 payers x memo NG-heavy ARPU per yr =",300*3.82*12)
