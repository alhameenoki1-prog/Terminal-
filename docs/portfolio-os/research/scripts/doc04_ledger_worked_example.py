from decimal import Decimal as D, ROUND_HALF_UP
def q(x, p="0.01"): return D(x).quantize(D(p), rounding=ROUND_HALF_UP)

# ---- Reference FX (synthetic month: October 2026). AED peg 3.6725 (CBUAE). NFEM month-end 1,346.91 = CBN weighted avg 29 Oct 2026 (used as 31 Oct reference). 30 Sep opening reference 1,329.00 (assumption).
AED_USD = D("3.6725")
NFEM = {"2026-09-30": D("1329.00"), "2026-10-18": D("1350.00"), "2026-10-20": D("1352.00"), "2026-10-31": D("1346.91")}
def ngn_per_aed(d): return NFEM[d] / AED_USD

# ---- Account A1: NGN current account (opening 1,250,000.00) ----
ngn = [
 # date, narration, debit, credit, category/posting
 ("2026-10-03","POS/WEB PURCHASE TRANSACTION SHOPRITE LEKKI", D("48500.00"), D("0"), "Expenses:Groceries"),
 ("2026-10-05","NIP/ZEN/ADEBAYO LANDLORD/RENT OCT", D("400000.00"), D("0"), "Expenses:Housing:Rent"),
 ("2026-10-05","NIP TRANSFER FEE", D("50.00"), D("0"), "Expenses:BankCharges:TransferFee"),
 ("2026-10-05","VAT ON NIP FEE", D("3.75"), D("0"), "Expenses:BankCharges:VAT"),
 ("2026-10-05","STAMP DUTY (NTA 2025)", D("50.00"), D("0"), "Expenses:BankCharges:StampDuty"),
 ("2026-10-10","USSD AIRTIME TOPUP 0803XXXXXXX", D("5000.00"), D("0"), "Expenses:Telecoms:Airtime"),
 ("2026-10-12","POS PURCHASE TOTAL ENERGIES IKOYI 12/10 09:41", D("27300.00"), D("0"), "Expenses:Transport:Fuel"),
 ("2026-10-12","POS PURCHASE TOTAL ENERGIES IKOYI 12/10 09:42", D("27300.00"), D("0"), "Suspense:PendingReversal"),
 ("2026-10-14","REVERSAL OF POS TXN 12/10 TOTAL ENERGIES", D("0"), D("27300.00"), "Suspense:PendingReversal"),
 ("2026-10-19","NIP/IMTO PARTNER/REMITTANCE REF AE7781", D("0"), D("1780000.00"), "Transfer:From:A2_AED"),
 ("2026-10-20","FX PURCHASE USD 715.00 FOR BROKERAGE FUNDING", D("1000000.00"), D("0"), "Transfer:To:A3_USD"),
 ("2026-10-20","NIP TRANSFER FEE", D("50.00"), D("0"), "Expenses:BankCharges:TransferFee"),
 ("2026-10-20","VAT ON NIP FEE", D("3.75"), D("0"), "Expenses:BankCharges:VAT"),
 ("2026-10-20","STAMP DUTY (NTA 2025)", D("50.00"), D("0"), "Expenses:BankCharges:StampDuty"),
 ("2026-10-26","SALARY OCT 2026 ACME NIGERIA LTD", D("0"), D("2350000.00"), "Income:Salary:NGN"),
 ("2026-10-31","SMS ALERT CHARGES 12 @ N4", D("48.00"), D("0"), "Expenses:BankCharges:SMSAlert"),
 ("2026-10-31","VAT ON SMS ALERT CHARGES", D("3.60"), D("0"), "Expenses:BankCharges:VAT"),
 ("2026-10-31","ACCOUNT MAINTENANCE FEE (N0.5/mille)", D("740.40"), D("0"), "Expenses:BankCharges:CAMF"),
 ("2026-10-31","VAT ON ACCOUNT MAINTENANCE FEE", D("55.53"), D("0"), "Expenses:BankCharges:VAT"),
]
open_ngn = D("1250000.00")
bal = open_ngn
print("A1 NGN account — running balance check")
for d,n,dr,cr,c in ngn:
    bal = bal - dr + cr
    print(f"  {d} | {n[:46]:46} | Dr {dr:>12} | Cr {cr:>12} | Bal {bal:>14,.2f} | {c}")
close_ngn = bal
sum_dr = sum(x[2] for x in ngn); sum_cr = sum(x[3] for x in ngn)
print(f"  Opening {open_ngn:,.2f} + credits {sum_cr:,.2f} - debits {sum_dr:,.2f} = {open_ngn+sum_cr-sum_dr:,.2f}  (closing {close_ngn:,.2f})")
# CAMF check: debit turnover subject to CAMF (third-party & own-account-other-bank debits, excl. fees/VAT/stamp): 
camf_base = D("48500")+D("400000")+D("5000")+D("27300")+D("1000000")
print(f"  CAMF base (customer-induced debits, net of reversed duplicate) {camf_base:,.2f} x 0.0005 = {q(camf_base*D('0.0005')):,.2f}; VAT 7.5% = {q(camf_base*D('0.0005')*D('0.075')):,.2f}")

# ---- Account A2: AED current account (opening 18,400.00) ----
aed = [
 ("2026-10-01","WPS SALARY SEP 2026 GULF EMPLOYER LLC", D("0"), D("22000.00"), "Income:Salary:AED"),
 ("2026-10-02","STANDING ORDER RENT INSTALMENT", D("9000.00"), D("0"), "Expenses:Housing:Rent"),
 ("2026-10-06","POS CARREFOUR MOE", D("612.35"), D("0"), "Expenses:Groceries"),
 ("2026-10-09","DEWA BILL PAYMENT", D("540.00"), D("0"), "Expenses:Utilities"),
 ("2026-10-12","AANI TRANSFER TO +9715XXXXXXX", D("250.00"), D("0"), "Expenses:Dining:SharedBills"),
 ("2026-10-18","OUTWARD REMITTANCE NGN BENEF SELF REF AE7781", D("5000.00"), D("0"), "Transfer:To:A1_NGN"),
 ("2026-10-18","REMITTANCE FEE", D("15.00"), D("0"), "Expenses:BankCharges:TransferFee"),
 ("2026-10-18","VAT 5% ON FEE", D("0.75"), D("0"), "Expenses:BankCharges:VAT"),
 ("2026-10-25","ACCOUNT FEE", D("25.00"), D("0"), "Expenses:BankCharges:AccountFee"),
 ("2026-10-25","VAT 5% ON ACCOUNT FEE", D("1.25"), D("0"), "Expenses:BankCharges:VAT"),
 ("2026-10-28","POS RESTAURANT JBR", D("180.00"), D("0"), "Expenses:Dining"),
]
open_aed = D("18400.00"); bal = open_aed
print("\nA2 AED account — running balance check")
for d,n,dr,cr,c in aed:
    bal = bal - dr + cr
    print(f"  {d} | {n[:46]:46} | Dr {dr:>10} | Cr {cr:>10} | Bal {bal:>12,.2f} | {c}")
close_aed = bal
print(f"  Opening {open_aed:,.2f} + credits {sum(x[3] for x in aed):,.2f} - debits {sum(x[2] for x in aed):,.2f} = {close_aed:,.2f}")

# ---- Account A3: USD brokerage (opening cash 2,150.00; 12 units ETF, cost 240.00, price 30 Sep 250.00) ----
usd = [
 ("2026-10-22","DEPOSIT (wire from FX provider) ref NG-5520", D("0"), D("715.00"), "Transfer:From:A1_NGN"),
 ("2026-10-23","BUY 2.8 ETF @ 250.00", D("700.00"), D("0"), "Assets:Brokerage:ETF (cost)"),
 ("2026-10-23","COMMISSION", D("1.00"), D("0"), "Expenses:Investing:Commission"),
 ("2026-10-30","DIVIDEND ETF 12 x 0.80 (gross)", D("0"), D("9.60"), "Income:Dividends:USD"),
 ("2026-10-30","WITHHOLDING TAX 30%", D("2.88"), D("0"), "Expenses:Tax:WithholdingUSD"),
]
open_cash = D("2150.00"); bal = open_cash
print("\nA3 USD brokerage cash — running balance check")
for d,n,dr,cr,c in usd:
    bal = bal - dr + cr
    print(f"  {d} | {n[:46]:46} | Dr {dr:>8} | Cr {cr:>8} | Bal {bal:>10,.2f} | {c}")
close_cash = bal
units_open, units_close = D("12"), D("14.8"); px_open, px_close = D("250.00"), D("257.50")
mv_open, mv_close = units_open*px_open, units_close*px_close
print(f"  Positions: {units_open} units @ {px_open} = {mv_open:,.2f} -> {units_close} units @ {px_close} = {mv_close:,.2f}; unrealised P&L in month = {mv_close - mv_open - D('700.00'):,.2f} USD")

# ---- Transfer matching ----
print("\nTransfer matches")
# T1: AED 5,000 out 18 Oct -> NGN 1,780,000 in 19 Oct
ref1 = ngn_per_aed("2026-10-18")
implied1 = D("1780000")/D("5000")
cost1 = D("5000")*ref1 - D("1780000")
print(f"  T1 AED->NGN: implied {implied1:,.2f} NGN/AED vs reference {ref1:,.2f} (NFEM/peg cross) -> conversion cost {q(cost1):,.2f} NGN ({q(cost1/(D('5000')*ref1)*100):.2f}%) + explicit fee AED 15.75 incl VAT")
# T2: NGN 1,000,000 out 20 Oct -> USD 715 in 22 Oct
ref2 = NFEM["2026-10-20"]; implied2 = D("1000000")/D("715"); cost2 = D("1000000") - D("715")*ref2
print(f"  T2 NGN->USD: implied {implied2:,.2f} NGN/USD vs NFEM {ref2:,.2f} -> conversion cost {q(cost2):,.2f} NGN ({q(cost2/D('1000000')*100):.2f}%) + NIP fee/VAT/stamp 103.75 NGN")

# ---- Cash-flow (October), converted at transaction-date reference rates to NGN and USD ----
def to_usd_ngn(amount, cur, d):
    rate = NFEM[d] if d in NFEM else NFEM["2026-10-31"]
    if cur=="NGN": return amount/rate
    if cur=="AED": return amount/AED_USD
    return amount
inc_ngn = D("2350000"); inc_aed = D("22000"); div_usd = D("9.60")
exp_ngn = D("48500")+D("400000")+D("5000")+D("27300")   # spending (excl. fees)
fees_ngn = D("50")+D("3.75")+D("50")+D("50")+D("3.75")+D("50")+D("48")+D("3.60")+D("740.40")+D("55.53")
exp_aed = D("9000")+D("612.35")+D("540")+D("250")+D("180"); fees_aed = D("15")+D("0.75")+D("25")+D("1.25")
fees_usd = D("1.00"); tax_usd = D("2.88")
fx_costs_ngn = cost1 + cost2
# express everything in USD at month-end NFEM for a single view, and in NGN
R = NFEM["2026-10-31"]
income_usd = inc_ngn/R + inc_aed/AED_USD + div_usd
spend_usd  = exp_ngn/R + exp_aed/AED_USD
fees_usd_t = fees_ngn/R + fees_aed/AED_USD + fees_usd + tax_usd
fx_usd     = fx_costs_ngn/R
net_usd = income_usd - spend_usd - fees_usd_t - fx_usd
print("\nOctober cash-flow summary (USD at month-end NFEM 1,346.91; AED at 3.6725)")
print(f"  Income: NGN {inc_ngn:,.2f} + AED {inc_aed:,.2f} + USD {div_usd} gross dividend = USD {q(income_usd):,.2f}")
print(f"  Spending (excl. charges): NGN {exp_ngn:,.2f} + AED {exp_aed:,.2f} = USD {q(spend_usd):,.2f}")
print(f"  Bank charges/levies/taxes: NGN {fees_ngn:,.2f} + AED {fees_aed:,.2f} + USD {fees_usd+tax_usd} = USD {q(fees_usd_t):,.2f}")
print(f"  Implicit FX conversion cost (two own transfers): NGN {q(fx_costs_ngn):,.2f} = USD {q(fx_usd):,.2f}")
print(f"  Net saving = USD {q(net_usd):,.2f}; savings rate = {q(net_usd/income_usd*100):.1f}% of gross income")
print(f"  Of which invested: ETF purchase USD 700.00; remaining net saving stays as cash")

# ---- Net worth 30 Sep vs 31 Oct ----
def nw(date, ngn_cash, aed_cash, usd_cash, mv):
    r = NFEM[date]
    usd_total = ngn_cash/r + aed_cash/AED_USD + usd_cash + mv
    ngn_total = ngn_cash + aed_cash*(r/AED_USD) + (usd_cash+mv)*r
    return usd_total, ngn_total
nw0 = nw("2026-09-30", open_ngn, open_aed, open_cash, mv_open)
nw1 = nw("2026-10-31", close_ngn, close_aed, close_cash, mv_close)
print("\nNet worth (no liabilities in this example)")
print(f"  30 Sep 2026: NGN {open_ngn:,.2f} | AED {open_aed:,.2f} | USD cash {open_cash:,.2f} + ETF {mv_open:,.2f} -> USD {q(nw0[0]):,.2f} / NGN {q(nw0[1]):,.2f} (NFEM 1,329.00)")
print(f"  31 Oct 2026: NGN {close_ngn:,.2f} | AED {close_aed:,.2f} | USD cash {close_cash:,.2f} + ETF {mv_close:,.2f} -> USD {q(nw1[0]):,.2f} / NGN {q(nw1[1]):,.2f} (NFEM 1,346.91)")
print(f"  Change: USD {q(nw1[0]-nw0[0]):,.2f}; NGN {q(nw1[1]-nw0[1]):,.2f}")
# decomposition in USD terms: flows (net saving at month-end rates) + market P&L + FX translation effect on opening NGN balance
flows_usd = net_usd
mkt_usd = mv_close - mv_open - D("700.00")
transl_usd = open_ngn/NFEM["2026-10-31"] - open_ngn/NFEM["2026-09-30"]
print(f"  Decomposition (USD view): net saving {q(flows_usd):,.2f} + market P&L {q(mkt_usd):,.2f} + FX translation on opening NGN balance {q(transl_usd):,.2f} = {q(flows_usd+mkt_usd+transl_usd):,.2f} (residual vs change = {q(nw1[0]-nw0[0]-(flows_usd+mkt_usd+transl_usd)):,.2f}, from using month-end rate for all October flows)")
# decomposition in NGN terms
transl_ngn = (open_aed*(NFEM['2026-10-31']/AED_USD) - open_aed*(NFEM['2026-09-30']/AED_USD)) + ((open_cash+mv_open)*(NFEM['2026-10-31']-NFEM['2026-09-30']))
print(f"  FX translation gain on opening AED+USD holdings in NGN view: NGN {q(transl_ngn):,.2f}")
