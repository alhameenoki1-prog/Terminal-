"""Portfolio OS - Document 9 v0.2: market sizing, cross-border segment, steady-state P&L,
breakeven, capital plan and signal/kill-criteria arithmetic.

Run:  python3 -I doc09_sizing_and_unit_economics.py
Standard library only. Per-subscriber economics come from doc09_unit_economics_mix.py, loaded by
file path (python3 -I does not put the script directory on sys.path).

v0.2 (2026-11-04) changes after review R09:
  * Funnel rebuilt on conditional shares (M5); the v0.1 independent funnel is printed for the record.
  * Cross-border tax segment sized (B1): foreign-share holders with realised gains + diaspora who may
    be resident under the disjunctive NTA s.201 definition.
  * Steady-state P&L uses ONE churn input for LTV and acquisition spend (M2); breakeven counts shown;
    the 1,000,000-subscriber row is removed from the P&L and printed only as a SOM/SAM coherence check.
  * Fixed costs add professional lines (practitioner, indemnity, NDPC audit) and the 2026 NGX schedule
    including the non-display licence (M3; revision log V-012).
  * Stage 2 re-costed with a founder salary, a growth hire and a USD-benchmarked case (M11).
  * Signal and kill-criteria arithmetic: Wilson intervals, calendar months from 2026-11-04 (B2, 2A).
"""
import sys
import math
import importlib.util
from datetime import date
from pathlib import Path

if sys.version_info < (3, 8):
    raise SystemExit("doc09_sizing_and_unit_economics.py needs Python 3.8 or later")

_core_path = Path(__file__).resolve().parent / "doc09_unit_economics_mix.py"
if not _core_path.exists():
    raise SystemExit(f"missing {_core_path}")
_spec = importlib.util.spec_from_file_location("doc09_core", _core_path)
core = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(core)

FX = core.FX
usd = lambda n: n / FX


def rng(a, b, scale=1e6, unit="m", dp=2):
    return f"{a/scale:.{dp}f}{unit}-{b/scale:.{dp}f}{unit}"


# ------------------------------------------------------------------ A. price anchors
print("=== A. PRICE ANCHORS (USD at planning rate NGN 1,346/$) ===")
for k, v in {"Spotify NG N1,300": 1300, "Netflix NG premium N8,500": 8500,
             "Basic N2,500/mo": 2500, "Pro N7,500/mo": 7500, "Annual N25,000": 25000}.items():
    print(f"  {k}: ${usd(v):.2f}")

# ------------------------------------------------------------------ B. funnel
print("\n=== B. NIGERIA FUNNEL ===")
adults = (115e6, 120e6)        # EFInA 111m in 2023 [S1] + growth (E5)
banked = (0.52, 0.56)          # EFInA 2023 [S1] (E2)
smart = (0.33, 0.60)           # v0.1 band; EFInA's own national figure is 26.6% (appendix) / 29% (chart)
income = (0.05, 0.08)          # adults above ~N200k/month in 2026 money; EFInA 2023: 5% above N115k (E5 drift)
invest = (0.30, 0.50)          # of those, holding >= 1 investment product (E5)
wtp = (0.10, 0.25)             # willing to pay for software (E5; no direct evidence)
v01 = [adults[i] * banked[i] * smart[i] * income[i] * invest[i] for i in (0, 1)]
print(f"  v0.1 independent funnel (adults x banked x smartphone x income x invests): {rng(*v01)}  [for the record]")
# v0.2: start from income; banking and smartphone ownership are near-universal among top earners.
p_bank_smart_given_high_income = (0.80, 0.90)   # E5; R09 used 0.85; EFInA income cross-tab not retrieved
v02 = [adults[i] * income[i] * p_bank_smart_given_high_income[i] * invest[i] for i in (0, 1)]
print(f"  v0.2 conditional funnel (adults x income x P(banked & smartphone | income) x invests): {rng(*v02)}")
print(f"  ratio v0.2/v0.1: {v02[0]/v01[0]:.1f}x low, {v02[1]/v01[1]:.1f}x high")
sam_people = (v02[0] * wtp[0], v02[1] * wtp[1])
print(f"  x WTP {wtp[0]:.0%}-{wtp[1]:.0%}: paying people (SAM) {rng(*sam_people, scale=1e3, unit='k', dp=0)}")
arpu_ng = (20, 60)
print(f"  Nigeria consumer revenue SAM at ${arpu_ng[0]}-{arpu_ng[1]}/yr: "
      f"${sam_people[0]*arpu_ng[0]/1e6:.1f}m-${sam_people[1]*arpu_ng[1]/1e6:.1f}m per year")

print("\n  UAE / diaspora (unchanged method; UAE lines are partner-only, see §7.1)")
uae_inv = (0.4e6, 1.0e6); uae_wtp = (0.05, 0.15); arpu_uae = (60, 150)
print(f"  UAE digitally engaged investors {rng(*uae_inv, scale=1e3, unit='k', dp=0)}; paying "
      f"{uae_inv[0]*uae_wtp[0]/1e3:.0f}k-{uae_inv[1]*uae_wtp[1]/1e3:.0f}k; revenue "
      f"${uae_inv[0]*uae_wtp[0]*arpu_uae[0]/1e6:.1f}m-${uae_inv[1]*uae_wtp[1]*arpu_uae[1]/1e6:.1f}m/yr")

# ------------------------------------------------------------------ C. cross-border tax segment
print("\n=== C. CROSS-BORDER TAX SEGMENT (re-scoped wedge, B1) ===")
# C1. Nigeria residents holding foreign shares (no s.34(1)(a) threshold for foreign shares; Doc 6 F13)
registered = 500e3 + 600e3 + 400e3 + 100e3   # Bamboo, Risevest, Trove, Chaka/Hisa registered [S12] (E3)
dedup = (0.60, 0.80)                         # unique people / registrations (E5)
active = (0.20, 0.35)                        # Bamboo: 100k active of 500k registered (20%) [S12]; E5 upper
realised = (0.20, 0.40)                      # share of active holders realising a gain in a year (E5)
fs = [registered * dedup[i] * active[i] * realised[i] for i in (0, 1)]
print(f"  foreign-share holders with a realised gain in a year: {rng(*fs, scale=1e3, unit='k', dp=0)}"
      f"  (registered {registered/1e6:.1f}m x unique {dedup[0]:.0%}-{dedup[1]:.0%} x active {active[0]:.0%}-{active[1]:.0%}"
      f" x realising {realised[0]:.0%}-{realised[1]:.0%})")
# C2. Diaspora who may be resident under the disjunctive s.201 definition (Doc 6 F10; R06 pinpoint)
diaspora = (1.77e6, 2.09e6)                  # UN DESA migrant stock 2020 / 2024 via secondary (E4)
adult = 0.85                                 # E5
ties = (0.20, 0.40)                          # keep a home available or substantial family/economic ties (E5)
means = (0.20, 0.40)                         # income/assets that make a pack worth buying (E5)
dz = [diaspora[i] * adult * ties[i] * means[i] for i in (0, 1)]
print(f"  diaspora possibly resident and with means: {rng(*dz, scale=1e3, unit='k', dp=0)}")
seg = (fs[0] + dz[0], fs[1] + dz[1])
print(f"  segment total (overlap ignored): {rng(*seg, scale=1e3, unit='k', dp=0)}")
pay_share = (0.10, 0.30)                     # E5
packs = (seg[0] * pay_share[0], seg[1] * pay_share[1])
price_pack = (60, 150)
print(f"  paying at {pay_share[0]:.0%}-{pay_share[1]:.0%}: {rng(*packs, scale=1e3, unit='k', dp=0)} packs/yr; "
      f"revenue at ${price_pack[0]}-{price_pack[1]}: ${packs[0]*price_pack[0]/1e6:.2f}m-${packs[1]*price_pack[1]/1e6:.1f}m/yr")
print("  FX holders (s.34(1)(b)) are NOT sized: the segment widens to every FX holder only if a practitioner")
print("  confirms each foreign-currency spend is a disposal (CANONICAL_CONTRACTS C1.6 question i).")
print("  Mass-retail NGX/IPO holders: gains exempt below N150m proceeds AND N10m gains (s.34(1)(a));")
ipo_min = 5250
print(f"  e.g. the N{ipo_min:,} minimum IPO ticket (${usd(ipo_min):.2f}) creates no tax computation.")

# ------------------------------------------------------------------ D. steady-state P&L and breakeven
print("\n=== D. STEADY-STATE P&L (annual USD), ONE CHURN INPUT, BREAKEVEN ===")
# Fixed-cost tiers (annual USD). Team & G&A and compliance as in v0.1 (E5).
# Data v0.2: NGX 2026 commercial floor N5-8m/yr incl. display, distribution, bandwidth and the N1.25m
# non-display licence (Doc 5c §4.6, F4; V-012), +7.5% VAT, plus UAE/US commercial data $1-3k/month (E5).
ngx_floor_hi = 8e6 * 1.075 / FX
data_10k = ngx_floor_hi + 3000 * 12
print(f"  data tier at 10k payers: NGX floor (high, incl. VAT) ${ngx_floor_hi:,.0f} + UAE/US ${36000:,} = ${data_10k:,.0f}")
print("  (real-time Level-1 at $10/user/month is excluded by design: delayed/EOD display only)")
TIERS = {   # N: (team & G&A, compliance, data, professional: practitioner + indemnity + NDPC audit + opinions)
    10_000: (0.66e6, 0.06e6, round(data_10k, -3), 0.06e6),
    100_000: (1.92e6, 0.25e6, 0.15e6, 0.15e6),
    1_000_000: (7.2e6, 0.90e6, 0.60e6, 0.50e6),
}


def fixed(n):
    pts = sorted(TIERS)
    tot = {k: sum(v) for k, v in TIERS.items()}
    if n <= pts[0]:
        return tot[pts[0]]
    for a, b in zip(pts, pts[1:]):
        if n <= b:
            t = (math.log(n) - math.log(a)) / (math.log(b) - math.log(a))
            return tot[a] * (tot[b] / tot[a]) ** t
    return tot[pts[-1]] * n / pts[-1]


CAC = 25.0


def ebitda(n, contrib, churn, cac=CAC):
    return n * 12 * (contrib - cac * churn) - fixed(n)


def breakeven(contrib, churn, cac=CAC):
    if contrib - cac * churn <= 0:
        return None
    n = 1000
    while n <= 3_000_000:
        if ebitda(n, contrib, churn, cac) >= 0:
            return n
        n = int(n * 1.02) + 1
    return None


ROWS = (10_000, 30_000, 100_000, 150_000)
for mixname in ("Nigeria-heavy 65/20/15", "Balanced 40/20/40", "Diaspora 20/10/70", "USD $10 only"):
    u = core.unit(core.MIXES[mixname])
    for churn in (0.05, 0.07, 0.10):
        row = " | ".join(f"{n//1000}k {ebitda(n, u['contrib'], churn)/1e6:6.2f}m" for n in ROWS)
        be = breakeven(u["contrib"], churn)
        bes = "not reached (contribution after CAC <= 0)" if be is None and u["contrib"] - CAC * churn <= 0 \
            else ("> 3m" if be is None else f"~{be/1000:,.0f}k")
        print(f"  {mixname:24s} churn {churn:.0%}: {row} | breakeven {bes}")
u = core.unit(core.MIXES["Nigeria-heavy 65/20/15"])
n = 100_000
rev, var = n * 12 * u["net"], n * 12 * u["var"]
print(f"  detail, Nigeria-heavy at 100k, churn 7%: revenue net of VAT ${rev/1e6:.2f}m | variable ${var/1e6:.2f}m |"
      f" fixed ${fixed(n)/1e6:.2f}m | acquisition ${n*12*0.07*CAC/1e6:.2f}m | EBITDA ${ebitda(n, u['contrib'], .07)/1e6:.2f}m")
print("  v0.1 P&L charged acquisition at n x 0.9 x $25: implied monthly churn", round(0.9 / 12, 4),
      "; 5%/month churn is", f"{1-0.95**12:.0%}", "annual attrition")
print("  1,000,000-subscriber coherence check: SOM 20k-150k payers; Nigeria-heavy 1m needs",
      f"{0.65e6/1e3:.0f}k Basic payers vs v0.2 SAM {sam_people[0]/1e3:.0f}k-{sam_people[1]/1e3:.0f}k paying people -> TAM-only, not modelled")

# ------------------------------------------------------------------ E. capital plan
print("\n=== E. STAGE CAPITAL (USD) ===")
s2_v01 = (2 * 2200 + 1300 + 1800 + 1200) * 18 + 60000 + 40000 + 30000
print(f"  v0.1 Stage 2 (18 months, 5 people, founder unpaid): ${s2_v01/1e3:.0f}k before CAC")
other_s2 = {"data + LLM": 60000, "legal incl. SEC-perimeter and CITN/NTAA opinions": 65000, "NDPC registration/audit": 30000,
            "practitioner retainer": 18000, "professional indemnity": 10000, "DPIA + transfer instruments": 15000}
ng_team = {"founder": 2500, "2 senior eng (NG rate)": 2 * 2200, "data/quant": 1800, "mid eng": 1300,
           "ops/support": 1200, "growth/BD": 1500, "DPO/compliance contractor": 800}
usd_team = {"founder": 4000, "2 senior eng (USD-indexed remote)": 2 * 5000, "data/quant": 4000,
            "ops/support": 2000, "growth/BD": 3000, "DPO/compliance contractor": 1500}
for lab, team in (("Nigerian-rate case", ng_team), ("USD-benchmarked case", usd_team)):
    base = sum(team.values()) * 18 + sum(other_s2.values())
    print(f"  v0.2 Stage 2 {lab}: team ${sum(team.values()):,}/mo x 18 + other ${sum(other_s2.values())/1e3:.0f}k"
          f" = ${base/1e3:.0f}k before CAC; with $100-200k CAC ${(base+100e3)/1e3:.0f}k-${(base+200e3)/1e3:.0f}k")
s3_v01 = (3 * 2200 + 2 * 1300 + 2 * 1800 + 2 * 1200 + 9000) * 24 + usd(50e6) + 250000 + 150000 + 120000
s3_v02 = (4000 + 3 * 5000 + 2 * 3000 + 2 * 4000 + 2 * 2500 + 3000 + 9000) * 24 + usd(50e6) + 250000 + 150000 + 120000 + 150000
print(f"  Stage 3 v0.1 ${s3_v01/1e6:.2f}m; v0.2 USD-benchmarked with founder, growth lead and professional lines ${s3_v02/1e6:.2f}m before CAC")

# ------------------------------------------------------------------ F. B2B2C
print("\n=== F. B2B2C ===")
aum, rsas = 27.45e12, 11_042_903        # PenCom Q4 2025 [S2] (E2)
avg = aum / rsas
print(f"  average RSA balance N{avg:,.0f} = ${usd(avg):,.0f}")
for fee in (0.005, 0.01):
    per = usd(avg * fee)
    print(f"  at {fee:.1%} PFA fee: ${per:.1f}/RSA/yr; $1/member = {1/per:.0%} of it")
for mem in (250e3, 1e6):
    print(f"  v0.1 per-member pricing, {mem/1e3:,.0f}k members: ${0.25*mem/1e3:,.0f}k-${1.0*mem/1e3:,.0f}k/yr")
print("  v0.2: flat enterprise licence, price UNKNOWN (two quotes required); illustrative only (E6):")
for price in (15e3, 40e3):
    print(f"    {price/1e3:.0f}k/yr x 2-5 clients = ${2*price/1e3:.0f}k-${5*price/1e3:.0f}k/yr")

# ------------------------------------------------------------------ G. signals and kill criteria
print("\n=== G. SIGNALS AND KILL CRITERIA ===")


def wilson(k, n, z=1.96):
    p = k / n
    d = 1 + z * z / n
    c = (p + z * z / (2 * n)) / d
    h = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d
    return c - h, c + h


for k, n_ in ((8, 20), (12, 20), (30, 150), (20, 150), (45, 150)):
    lo, hi = wilson(k, n_)
    print(f"  Wilson 95% for {k}/{n_}: {lo:.1%}-{hi:.1%}")
start = date(2026, 11, 4)


def month(m):
    y, mo = divmod(start.month - 1 + m, 12)
    return date(start.year + y, mo + 1, min(start.day, 28)).isoformat()


for m, label in ((5, "2027 filing deadline is 31 Mar 2027 (LIRS 2026 precedent: extended to 21 Apr)"),
                 (6, "end Stage 0; legal opinions due"), (9, "first decision: 2 of 3 readable signals"),
                 (15, "confirmation: 90-day paid retention and measured churn"),
                 (18, "paid B2B pilot >= $5k or kill"), (24, "unit-economics kill test")):
    print(f"  month {m:2d} = {month(m)}: {label}")
print("  v0.1 signal (a) timing: cohort from month 6 + 3 months free + 90-day retention -> earliest month", 6 + 3 + 3)
print("  v0.1 signal (c) needs a reviewed rule set by ~Jan 2027 (month 2) for the 2027 season; Stage 0 ends month 6")
print("  v0.1 tax signal value: 500 x N10,000 =", f"${500*10000/FX:,.0f}", "; 100 x $25 = $2,500")
print("  One USD threshold U*(churn, CAC) = USD-payer share for LTV/CAC >= 3 (v0.2 base):")
for cac in (25.0, 15.0):
    print(f"    CAC ${cac:.0f}: " + " | ".join(
        f"churn {c:.0%}: {core.fmt_share(core.usd_share_needed(c, cac))}" for c in (0.03, 0.05, 0.07, 0.10)))

# ------------------------------------------------------------------ H. regulatory capital
print("\n=== H. REGULATORY CAPITAL IN USD (SEC circular 16 Jan 2026 [S30]) ===")
for k, v in {"SEC IA corporate N50m": 50e6, "SEC robo-adviser N100m": 100e6, "SEC digital sub-broker N100m": 100e6,
             "NDPA fine floor N10m": 10e6}.items():
    print(f"  {k}: ${usd(v)/1e3:.0f}k")
