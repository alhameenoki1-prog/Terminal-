# Synthetic worked examples for Document 6 (Portfolio OS). All figures synthetic.
BANDS = [(800_000, 0.00), (2_200_000, 0.15), (9_000_000, 0.18), (13_000_000, 0.21), (25_000_000, 0.23), (float('inf'), 0.25)]  # NTA 2025 Fourth Schedule
def pit(chargeable):
    tax, rem, rows = 0.0, chargeable, []
    for width, rate in BANDS:
        slice_ = min(rem, width)
        if slice_ <= 0: break
        t = slice_ * rate; tax += t; rows.append((slice_, rate, t)); rem -= slice_
    return tax, rows
def show(label, chargeable):
    tax, rows = pit(chargeable)
    print(f"\n{label}: chargeable income = N{chargeable:,.0f}")
    for s, r, t in rows: print(f"   N{s:>13,.0f} @ {r*100:>4.0f}% = N{t:>12,.0f}")
    print(f"   TOTAL PIT = N{tax:,.0f}; effective rate on chargeable = {tax/chargeable*100:.2f}%")
    return tax
# ---- Example 1: Nigerian-resident individual, 2026 year ----
salary = 18_000_000; pension_emp = 0.08*salary; rent_paid = 3_000_000
rent_relief = min(0.20*rent_paid, 500_000)
bank_interest = 600_000; wht_interest = 0.10*bank_interest
ngx_div = 400_000; wht_div = 0.10*ngx_div
# US stock: 100 sh bought $150 @ N1,500/$ (2024-03-01); sold $200 @ N1,550/$ (2026-06-15)
cost_usd, sale_usd = 100*150, 100*200
fx_buy, fx_sell = 1500, 1550
cost_ngn, proceeds_ngn = cost_usd*fx_buy, sale_usd*fx_sell
gain_ngn = proceeds_ngn - cost_ngn
gain_usd_at_sale_fx = (sale_usd-cost_usd)*fx_sell
us_div_usd = 300; us_wht = 0.30*us_div_usd
print("EXAMPLE 1 inputs"); print(f" salary {salary:,}; pension(8%) {pension_emp:,.0f}; rent relief {rent_relief:,.0f}; bank interest {bank_interest:,} (WHT {wht_interest:,.0f}); NGX div {ngx_div:,} (WHT {wht_div:,.0f})")
print(f" US stock cost N{cost_ngn:,} proceeds N{proceeds_ngn:,} gain N{gain_ngn:,} (of which pure FX component on cost: N{cost_usd*(fx_sell-fx_buy):,}; price component at sale FX: N{gain_usd_at_sale_fx:,})")
print(f" US dividends ${us_div_usd} gross, US WHT 30% = ${us_wht:.0f}, net ${us_div_usd-us_wht:.0f}")
# Treatment A: bank interest aggregated (WHT credited); dividends excluded as franked investment income
total_income_A = salary + bank_interest + gain_ngn
chargeable_A = total_income_A - pension_emp - rent_relief
taxA = show("Treatment A (bank interest aggregated, WHT credited)", chargeable_A)
print(f"   less WHT credit on interest N{wht_interest:,.0f} -> net liability N{taxA-wht_interest:,.0f}")
# PAYE portion (salary only) to show what employer would have deducted
chargeable_paye = salary - pension_emp - rent_relief
taxPAYE = show("PAYE-only view (salary less pension & rent relief)", chargeable_paye)
print(f"   => balance payable on direct assessment (Treatment A) = N{taxA - wht_interest - taxPAYE:,.0f}")
# Treatment B: bank interest WHT treated as final (excluded)
total_income_B = salary + gain_ngn
chargeable_B = total_income_B - pension_emp - rent_relief
taxB = show("Treatment B (bank interest WHT treated as final, excluded)", chargeable_B)
print(f"   => balance payable on direct assessment (Treatment B) = N{taxB - taxPAYE:,.0f}")
# Sensitivity: if US dividends NOT remitted via approved channels -> taxable with unilateral credit (s.119): credit = min(Nigerian tax attributable, foreign tax)
fx_div = 1550; us_div_ngn = us_div_usd*fx_div; us_wht_ngn = us_wht*fx_div
chargeable_C = chargeable_A + us_div_ngn
taxC, _ = pit(chargeable_C)
ng_tax_attrib = taxC * (us_div_ngn/ (total_income_A+us_div_ngn))
credit = min(ng_tax_attrib, us_wht_ngn)
print(f"\nSensitivity: US dividends retained abroad: N{us_div_ngn:,.0f} added; PIT becomes N{taxC:,.0f}; Nigerian tax attributable (proportional, s.119(3)) N{ng_tax_attrib:,.0f}; US tax paid N{us_wht_ngn:,.0f}; credit allowed N{credit:,.0f}; excess foreign tax unrelieved N{us_wht_ngn-credit:,.0f}")
# ---- Example 2: UAE resident with Nigerian rent ----
rent = 6_000_000; wht_rent = 0.10*rent
print(f"\nEXAMPLE 2: Nigerian rent N{rent:,}; 10% WHT = N{wht_rent:,.0f} (final tax if non-resident, NTAA s.51(2)); if RESIDENT instead: rent enters worldwide income at marginal rates")
tax_res, _ = pit(rent)  # if the only Nigerian income and resident
print(f"   if treated as resident with only this income: PIT on N{rent:,} = N{tax_res:,.0f} (vs N{wht_rent:,.0f} final WHT) ")
# ---- Example 3: ledger reconciliation & FX ----
print("\nEXAMPLE 3: NGN account: opening 1,000,000; salary +1,500,000; rent -600,000; transfer to USD acct -310,000; duplicate posting of rent -600,000 (error) then reversal +600,000; bank charge -1,050; EMTL -50")
postings = [1_500_000, -600_000, -310_000, -600_000, 600_000, -1_050, -50]
closing = 1_000_000 + sum(postings); print(f"   ledger closing = N{closing:,}; statement closing (synthetic) = N{closing:,} -> reconciled, difference 0")
print(f"   if statement closing were N{closing-25_000:,}: unexplained difference N25,000 -> investigation item")
usd_open, wavg = 10_000, 1500.0; print(f"   USD account: opening ${usd_open:,} at weighted-average cost N{wavg:,.0f}/$ = N{usd_open*wavg:,.0f}")
rate_me = 1550; unreal = usd_open*(rate_me-wavg); print(f"   month-end revaluation at N{rate_me}/$ -> unrealised FX gain N{unreal:,.0f} (IAS 21-style monetary item retranslation)")
sell_usd, rate_sell = 2000, 1560; realised = sell_usd*(rate_sell-wavg); print(f"   sell ${sell_usd:,} at N{rate_sell}/$ -> proceeds N{sell_usd*rate_sell:,}; realised gain vs weighted-average cost N{realised:,.0f}; remaining ${usd_open-sell_usd:,} at cost N{(usd_open-sell_usd)*wavg:,.0f}")
print(f"   unrealised reval to reverse on the sold portion: N{sell_usd*(rate_me-wavg):,.0f}; residual unrealised on ${usd_open-sell_usd:,}: N{(usd_open-sell_usd)*(rate_me-wavg):,.0f}")
