"""Portfolio OS - Document 9 v0.2: per-subscriber unit economics by plan mix.

Run:  python3 -I doc09_unit_economics_mix.py
Standard library only. Also imported by doc09_sizing_and_unit_economics.py (loaded by file path,
because python3 -I does not put the script directory on sys.path).

v0.2 (2026-11-04) changes after review R09 (M1-M4, M8; revision log V-012):
  * Nigerian VAT 7.5% is treated as included in NGN prices; USD plans carry a 5% VAT placeholder.
  * Paystack's NGN 100 fixed fee applies at NGN 2,500 (waived only *under* NGN 2,500) and on
    international cards (support article re-fetched 2026-11-04).
  * Aggregation (Mono Basic NGN 50,000 per 100 accounts per month) is a variable cost.
  * An agentic deep-research LLM profile (400k input tokens per run) replaces the 60k-token run, and
    LLM use is gated by plan (Basic = light profile); uniform agentic use is kept as a stress case.
  * One churn input is used for LTV, payback, P&L acquisition spend and the USD-share threshold.
  * The v0.1 calculation is kept as `legacy=True` so the v0.1 table can be reproduced.
All inputs are dated assumptions; grades in comments (E2 official, E3 vendor/press, E5 assumption).
"""
import sys

if sys.version_info < (3, 8):
    raise SystemExit("doc09_unit_economics_mix.py needs Python 3.8 or later")

# ---------------------------------------------------------------- inputs
FX = 1346.0            # NGN per USD; NFEM close 30 Oct 2026 per press [S49] (E3). Planning rate only,
                       # not a C3-validated figure; C5.1 names the CBN central rate as reference.
PRICE_NGN = {"b": 2500.0, "p": 7500.0}   # Basic, Pro monthly, VAT-inclusive (E5 hypotheses)
PRICE_USD = 10.0       # diaspora monthly plan, USD (E5)
VAT_NG = 0.075         # NTA 2025 s.147 rate per Doc 6 F21 (E2); applicability to our supply assumed (E4)
VAT_USD = 0.05         # placeholder: 0% if zero-rated export, 5% UAE once registered, 7.5% if not zero-rated (E5)
PAYSTACK_LOCAL = (0.015, 100.0, 2000.0)  # 1.5% + NGN 100, fee cap NGN 2,000; NGN 100 waived under NGN 2,500 (E3, fetched 2026-11-04)
PAYSTACK_INTL = (0.039, 100.0)           # 3.9% + NGN 100 (E3, fetched 2026-11-04)
PLAY_SUBS_FEE = 0.15   # Google Play auto-renewing subscriptions 10% + 5% billing fee in listed markets (E3, fetched 2026-11-04)
MONO_PER_ACCOUNT_NGN = 50000.0 / 100     # Mono Basic NGN 50,000/month for 100 accounts (Doc 4 F2; undated page, E3)
AGG_ACCOUNTS = 3       # linked accounts per aggregating user (E5)
AGG_SHARE = 0.5        # share of payers on aggregation; Doc 4 R10 makes statement upload the default (E5)
SUPPORT, INFRA, OTHER = 0.25, 0.10, 0.05  # USD per payer per month (E5)

# LLM list prices per million tokens (Anthropic pricing as cached 2026-10-06, [S67], E3)
OPUS, SONNET, HAIKU = (4.0, 20.0), (2.0, 10.0), (0.10, 0.50)
CACHE_READ = 0.10      # cache reads at ~10% of the input price


def llm_cost(runs, in_tok, out_tok, price, cache_share=0.6):
    p_in, p_out = price
    inp = runs * in_tok * ((1 - cache_share) * p_in + cache_share * p_in * CACHE_READ) / 1e6
    return inp + runs * out_tok * p_out / 1e6


def llm_profiles():
    """USD per active user per month. Token counts are disclosed here (R09 evidence audit)."""
    chat_l = llm_cost(15, 5000, 500, SONNET)
    cls_l = llm_cost(600, 300, 40, HAIKU, 0)
    chat_m = llm_cost(40, 8000, 700, SONNET)
    cls_m = llm_cost(1500, 300, 40, HAIKU, 0)
    deep_v01 = llm_cost(2, 60000, 4000, OPUS)
    deep_agentic = llm_cost(2, 400000, 8000, OPUS)   # agentic run: several hundred thousand tokens (R09 M3)
    chat_h = llm_cost(120, 10000, 900, SONNET)
    cls_h = llm_cost(3000, 300, 40, HAIKU, 0)
    deep_h = llm_cost(8, 400000, 8000, OPUS)
    return {
        "light": chat_l + cls_l,
        "medium_v01": chat_m + cls_m + deep_v01,
        "medium": chat_m + cls_m + deep_agentic,      # v0.2 base
        "heavy_v01": chat_h + cls_h + llm_cost(8, 80000, 6000, OPUS),
        "heavy": chat_h + cls_h + deep_h,
    }


LLM = llm_profiles()
# v0.2 base: LLM use gated by plan (Basic: chat + classification only, no deep research). This is a product
# rule (Doc 9 R8 usage tiers), to be verified by measured tokens on the prototype (Doc 9 §9 item 7).
LLM_BY_PLAN = {"b": LLM["light"], "p": LLM["medium"], "u": LLM["medium"]}

MIXES = {
    "Nigeria-heavy 65/20/15": {"b": .65, "p": .20, "u": .15},
    "Balanced 40/20/40": {"b": .40, "p": .20, "u": .40},
    "Diaspora 20/10/70": {"b": .20, "p": .10, "u": .70},
    "Basic only (NGN 2,500)": {"b": 1.0},
    "USD $10 only": {"u": 1.0},
}


def paystack_fee_ngn(amount_ngn, intl=False):
    if intl:
        pct, fixed = PAYSTACK_INTL
        return amount_ngn * pct + fixed
    pct, fixed, cap = PAYSTACK_LOCAL
    fee = amount_ngn * pct + (fixed if amount_ngn >= 2500 else 0.0)
    return min(fee, cap)


def unit(mix, fx=FX, usd_price=PRICE_USD, llm=None, vat_ng=VAT_NG, vat_usd=VAT_USD,
         agg_share=AGG_SHARE, agg_accounts=AGG_ACCOUNTS, store=0.0, legacy=False):
    """Monthly USD per paying subscriber. Margin is on revenue net of VAT.

    legacy=True reproduces Doc 9 v0.1: no VAT, NGN 100 waived at <= NGN 2,500, no NGN 100 on
    international cards, no aggregation, v0.1 medium LLM profile.
    """
    if legacy:
        vat_ng = vat_usd = 0.0
        agg_share = 0.0
        llm = LLM["medium_v01"] if llm is None else llm
    if llm is None:
        llm = LLM_BY_PLAN
    if not isinstance(llm, dict):
        llm = {"b": llm, "p": llm, "u": llm}
    gross = net = pay = llm_c = 0.0
    for k, w in mix.items():
        if k in ("b", "p"):
            g_ngn = PRICE_NGN[k]          # NGN price is fixed in NGN; a weaker naira lowers its USD value
            g = g_ngn / fx
            n = g / (1 + vat_ng)
            if store:
                f = g * store
            elif legacy:
                f = (g_ngn * 0.015 + (100.0 if g_ngn > 2500 else 0.0)) / fx
            else:
                f = paystack_fee_ngn(g_ngn) / fx
        else:
            g = usd_price
            n = g / (1 + vat_usd)
            if store:
                f = g * store
            elif legacy:
                f = g * PAYSTACK_INTL[0]
            else:
                f = paystack_fee_ngn(g * fx, intl=True) / fx
        gross += w * g
        net += w * n
        pay += w * f
        llm_c += w * llm[k]
    agg = agg_share * agg_accounts * MONO_PER_ACCOUNT_NGN / fx
    other = SUPPORT + INFRA + OTHER
    var = pay + llm_c + agg + other
    return {"gross": gross, "net": net, "pay": pay, "llm": llm_c, "agg": agg, "other": other,
            "var": var, "contrib": net - var, "gm": (net - var) / net}


def ltv(u, churn):
    """Undiscounted contribution lifetime value; one churn input (R09 M2)."""
    return u["contrib"] / churn


def usd_share_needed(churn, cac=25.0, target=3.0, **kw):
    """Smallest USD-payer share (rest split Basic:Pro 65:20) giving LTV/CAC >= target."""
    for s in range(0, 101):
        u_ = s / 100
        m = {"b": (1 - u_) * 65 / 85, "p": (1 - u_) * 20 / 85, "u": u_}
        if ltv(unit(m, **kw), churn) / cac >= target:
            return s
    return None


def cac_kill(mix, churn, floor=1.5, **kw):
    """CAC above which LTV/CAC falls below `floor` at measured churn and mix (R09 2A)."""
    c = unit(mix, **kw)["contrib"]
    return c / churn / floor if c > 0 else 0.0


def tax_pack(price_usd, review_usd, fx=FX, vat=VAT_USD, llm=None, support=5.0):
    """One practitioner-co-signed cross-border tax-and-records pack (per pack, USD)."""
    llm = LLM["heavy"] if llm is None else llm
    net = price_usd / (1 + vat)
    fee = paystack_fee_ngn(price_usd * fx, intl=True) / fx
    var = fee + review_usd + llm + support
    return net, var, net - var


def fmt_share(s):
    return "not reachable" if s is None else f"{s}%"


def main():
    print("Doc 9 v0.2 unit economics (monthly USD per paying subscriber); FX planning rate", FX)
    print("\nA. LLM profiles, USD per active user per month (token counts in llm_profiles())")
    for k, v in LLM.items():
        print(f"   {k:11s} ${v:.2f}")

    print("\nB. v0.1 table reproduced (legacy=True) - for the record")
    for n, m in MIXES.items():
        u = unit(m, legacy=True)
        print(f"   {n:24s} ARPU ${u['net']:.2f} pay ${u['pay']:.2f} var ${u['var']:.2f} GM {u['gm']*100:3.0f}%"
              f"  LTV@5% ${ltv(u, .05):5.0f}  LTV/CAC25 {ltv(u, .05)/25:4.1f}")

    print("\nC. v0.2 base case (VAT, Paystack fixed fee, aggregation at 50% x 3 accounts, plan-gated LLM:"
          f" Basic ${LLM['light']:.2f}, Pro/USD ${LLM['medium']:.2f})")
    print("   mix | gross | net of VAT | payment | LLM | aggregation | other | variable | contribution | GM | LTV/CAC25 at churn 5/7/10%")
    for n, m in MIXES.items():
        u = unit(m)
        lc = "/".join(f"{ltv(u, c)/25:4.1f}" for c in (.05, .07, .10))
        print(f"   {n:24s} ${u['gross']:5.2f} | ${u['net']:5.2f} | ${u['pay']:.2f} | ${u['llm']:.2f} | ${u['agg']:.2f} |"
              f" ${u['other']:.2f} | ${u['var']:.2f} | ${u['contrib']:5.2f} | {u['gm']*100:4.0f}% | {lc}")

    print("\nD. Sensitivities on gross margin (each changes one input from the v0.2 base)")
    cases = [
        ("v0.2 base", {}),
        ("no aggregation", dict(agg_share=0.0)),
        ("all payers aggregated", dict(agg_share=1.0)),
        ("uniform agentic LLM", dict(llm=LLM["medium"])),
        ("uniform v0.1 LLM", dict(llm=LLM["medium_v01"])),
        ("uniform light LLM", dict(llm=LLM["light"])),
        ("uniform heavy LLM", dict(llm=LLM["heavy"])),
        ("Play billing 15%", dict(store=PLAY_SUBS_FEE)),
        ("naira at 1,700/$", dict(fx=1700.0)),
        ("USD VAT 0%", dict(vat_usd=0.0)),
    ]
    for lab, kw in cases:
        row = " | ".join(f"{n.split(' ')[0]} {unit(m, **kw)['gm']*100:4.0f}%" for n, m in MIXES.items())
        print(f"   {lab:22s} {row}")

    print("\nE. USD-payer share needed for LTV/CAC >= 3 (one threshold, indexed to measured churn)")
    for cac in (25.0, 15.0):
        for churn in (0.03, 0.05, 0.07, 0.10):
            print(f"   CAC ${cac:.0f} churn {churn:.0%}: v0.1 model {fmt_share(usd_share_needed(churn, cac, legacy=True)):>13s}"
                  f" | v0.2 base {fmt_share(usd_share_needed(churn, cac)):>13s}"
                  f" | no aggregation {fmt_share(usd_share_needed(churn, cac, agg_share=0.0)):>13s}"
                  f" | uniform agentic LLM {fmt_share(usd_share_needed(churn, cac, llm=LLM['medium'])):>13s}")

    print("\nF. Kill CAC: LTV/CAC < 1.5 at measured churn (v0.2 base)")
    for n in ("Nigeria-heavy 65/20/15", "Balanced 40/20/40", "Diaspora 20/10/70", "USD $10 only"):
        row = " | ".join(f"churn {c:.0%}: ${cac_kill(MIXES[n], c):5.1f}" for c in (.05, .07, .10))
        print(f"   {n:24s} {row}")
    u = unit(MIXES["Nigeria-heavy 65/20/15"], legacy=True)
    print(f"   v0.1 check: CAC $40 at 5% churn gives LTV/CAC {ltv(u, .05)/40:.2f} (memo said '< 1')")

    print("\nG. Payback months on a $25 CAC (contribution basis)")
    for n, m in MIXES.items():
        c = unit(m)["contrib"]
        print(f"   {n:24s} " + ("never (contribution <= 0)" if c <= 0 else f"{25/c:5.1f} months"))

    print("\nH. Cross-border tax-and-records pack, per pack (USD; practitioner review fee E5)")
    for price in (60.0, 100.0, 150.0):
        row = []
        for review in (25.0, 40.0, 60.0):
            net, var, c = tax_pack(price, review)
            row.append(f"review ${review:.0f}: contrib ${c:6.2f} ({c/net*100:3.0f}%)")
        print(f"   price ${price:.0f}: " + " | ".join(row))

    print("\nI. Worked example (§4.7): diaspora $10 payer vs Lagos Basic payer, v0.2 base")
    for n in ("USD $10 only", "Basic only (NGN 2,500)"):
        u = unit(MIXES[n])
        print(f"   {n:24s} net ${u['net']:.2f} | payment ${u['pay']:.2f} | LLM ${u['llm']:.2f} | aggregation ${u['agg']:.2f}"
              f" | other ${u['other']:.2f} | contribution ${u['contrib']:.2f} | GM {u['gm']*100:.0f}%"
              f" | LTV@7% ${ltv(u, .07):.0f} | LTV/CAC@$8 {ltv(u, .07)/8:.1f}")


if __name__ == "__main__":
    main()
