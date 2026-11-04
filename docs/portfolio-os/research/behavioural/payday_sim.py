"""Synthetic worked example for Portfolio OS behavioural module.
One person, 6 months (Jan-Jun 2026), NGN current account. Salary on the 25th (or previous business day).
Discretionary spending, fixed obligations (rent on 26th Jan, utilities), family transfers after payday,
FX purchase (USD) after payday, ajo contribution weekly. All amounts synthetic.
"""
import numpy as np, pandas as pd
rng = np.random.default_rng(20261102)
days = pd.date_range("2026-01-01","2026-06-30",freq="D")
df = pd.DataFrame(index=days)
# Salary dates: 25th, moved earlier if weekend
def pay_date(y,m):
    d = pd.Timestamp(y,m,25)
    while d.weekday()>=5: d -= pd.Timedelta(days=1)
    return d
paydays = [pay_date(2026,m) for m in range(1,7)]
df["salary"] = 0.0
for p in paydays: df.loc[p,"salary"] = 1_500_000.0   # NGN 1.5m net, synthetic
# days since last payday (Dec 25 2025 assumed previous)
prev = pd.Timestamp(2025,12,24)
dsp = []
last = prev
for d in days:
    if d in paydays: last = d
    dsp.append((d-last).days)
df["days_since_pay"] = dsp
# Discretionary spend: baseline lognormal; weekend uplift; payday-window uplift (true effect = +45% for days 0-6)
base = 18_000.0
wk = np.where(df.index.weekday>=5, 1.25, 1.0)
pay_uplift = np.where(df["days_since_pay"]<=6, 1.45, 1.0)
end_month_squeeze = np.where(df["days_since_pay"]>=24, 0.85, 1.0)
noise = rng.lognormal(mean=0, sigma=0.45, size=len(df))
df["discretionary"] = np.maximum(np.round(base*wk*pay_uplift*end_month_squeeze*noise, -2), 500.0)
# Fixed obligations: rent annual in January (26th), utilities/data on 1st-3rd, school fees in Jan & May
df["fixed"] = 0.0
df.loc[pd.Timestamp(2026,1,26),"fixed"] += 2_400_000.0   # annual rent, synthetic
for m in range(1,7):
    df.loc[pd.Timestamp(2026,m,2),"fixed"] += 65_000.0     # utilities/data
df.loc[pd.Timestamp(2026,1,28),"fixed"] += 450_000.0        # school fees (dependant), synthetic
df.loc[pd.Timestamp(2026,5,27),"fixed"] += 450_000.0
# Family transfers: within 3 days of payday, synthetic
df["family_transfer"] = 0.0
for p in paydays: df.loc[p+pd.Timedelta(days=rng.integers(0,3)),"family_transfer"] += 150_000.0
# FX purchase: USD bought 1-2 days after payday most months (hedging), synthetic; recorded as outflow in NGN
df["fx_purchase"] = 0.0
for i,p in enumerate(paydays):
    if i!=3: df.loc[p+pd.Timedelta(days=1),"fx_purchase"] += 300_000.0
# Ajo/esusu weekly contribution (Mondays)
df["ajo"] = np.where(df.index.weekday==0, 20_000.0, 0.0)
# Investment contribution 2 days after payday
df["investment"] = 0.0
for p in paydays: df.loc[p+pd.Timedelta(days=2),"investment"] += 200_000.0
df["all_outflows"] = df[["discretionary","fixed","family_transfer","fx_purchase","ajo","investment"]].sum(axis=1)

def window_stats(col):
    w = df[df["days_since_pay"]<=6][col]; r = df[df["days_since_pay"]>6][col]
    return w.mean(), r.mean(), w.mean()/r.mean()

print("Paydays:", [p.strftime('%Y-%m-%d') for p in paydays])
print("N days:", len(df), " payday-window days:", (df.days_since_pay<=6).sum(), " other days:", (df.days_since_pay>6).sum())
for col in ["all_outflows","discretionary"]:
    w,r,ratio = window_stats(col)
    print(f"{col:15s} mean/day payday-window={w:,.0f}  other={r:,.0f}  ratio={ratio:.2f}")

# Naive 'spike' using all outflows vs. discretionary only
# Bootstrap CI for ratio (discretionary), resampling days within strata
def boot_ratio(col, B=4000):
    w = df[df["days_since_pay"]<=6][col].values; r = df[df["days_since_pay"]>6][col].values
    rs = []
    for _ in range(B):
        rs.append(rng.choice(w,len(w)).mean()/rng.choice(r,len(r)).mean())
    return np.percentile(rs,[2.5,97.5])
for col in ["all_outflows","discretionary"]:
    lo,hi = boot_ratio(col); print(f"bootstrap 95% CI ratio {col}: [{lo:.2f}, {hi:.2f}]")

# Permutation test preserving autocorrelation: circular shift of the payday indicator
obs = window_stats("discretionary")[2]
ind = (df["days_since_pay"]<=6).values; x = df["discretionary"].values
null = []
for s in range(1,len(df)):
    sh = np.roll(ind, s); null.append(x[sh].mean()/x[~sh].mean())
null = np.array(null); p = (np.sum(null>=obs)+1)/(len(null)+1)
print(f"circular-shift permutation: observed ratio={obs:.2f}, null 95th pct={np.percentile(null,95):.2f}, p={p:.3f}")

# Month-by-month consistency (does the pattern hold in >=5 of 6 cycles?)
df["cycle"] = np.cumsum(df.index.isin(paydays))  # 0 = before first payday in Jan
rows=[]
for c,g in df.groupby("cycle"):
    if c==0: continue
    w=g[g.days_since_pay<=6]["discretionary"].mean(); r=g[g.days_since_pay>6]["discretionary"].mean()
    rows.append((c, round(w), round(r) if r==r else None, round(w/r,2) if r==r else None))
print("per-cycle (cycle, window mean, other mean, ratio):", rows)

# Weekday confound check: payday window weekday composition vs rest
print("weekend share in window:", round(np.mean(df[df.days_since_pay<=6].index.weekday>=5),3), " rest:", round(np.mean(df[df.days_since_pay>6].index.weekday>=5),3))
# Regression with weekday fixed effects and payday-window dummy on log discretionary spend
X = pd.get_dummies(df.index.weekday, prefix="wd", drop_first=True).astype(float)
X["payday_window"] = ind.astype(float); X["end_month"] = (df.days_since_pay>=24).astype(float).values; X.insert(0,"const",1.0)
y = np.log(df["discretionary"].values)
beta, *_ = np.linalg.lstsq(X.values, y, rcond=None)
resid = y - X.values@beta; n,k = X.shape; s2 = resid@resid/(n-k)
cov = s2*np.linalg.inv(X.values.T@X.values); se = np.sqrt(np.diag(cov))
# Newey-West (HAC) SE with 7 lags for autocorrelation
def hac(X,resid,L=7):
    Xv=X.values; n=len(resid); S=np.zeros((Xv.shape[1],)*2)
    for l in range(0,L+1):
        wgt = 1 - l/(L+1)
        for t in range(l,n):
            u = np.outer(Xv[t]*resid[t], Xv[t-l]*resid[t-l])
            S += wgt*(u + (u.T if l>0 else 0))
    B = np.linalg.inv(Xv.T@Xv); return np.sqrt(np.diag(B@S@B))
se_hac = hac(X,resid)
j = list(X.columns).index("payday_window")
print(f"OLS log(disc) ~ weekday FE + payday_window + end_month: beta_payday={beta[j]:.3f} (x{np.exp(beta[j]):.2f}), SE_ols={se[j]:.3f}, SE_HAC7={se_hac[j]:.3f}, t_HAC={beta[j]/se_hac[j]:.2f}")

# Control chart on weekly discretionary spend (Shewhart individuals chart using moving range)
wk = df["discretionary"].resample("W-SUN").sum()
mr = wk.diff().abs().dropna(); center = wk.mean(); sigma_hat = mr.mean()/1.128
ucl, lcl = center+3*sigma_hat, max(center-3*sigma_hat,0)
print(f"Weekly discretionary: n_weeks={len(wk)}, mean={center:,.0f}, sigma_hat(MR)={sigma_hat:,.0f}, UCL={ucl:,.0f}, LCL={lcl:,.0f}")
print("weeks above UCL:", [(d.strftime('%Y-%m-%d'), round(v)) for d,v in wk[wk>ucl].items()])
# Run-chart rule: longest run on one side of median
med = wk.median(); side = np.sign(wk-med); runs=[]; cur=0; prev=0
for s in side:
    if s==0: continue
    if s==prev: cur+=1
    else: cur=1; prev=s
    runs.append(cur)
print("longest run one side of median:", max(runs), "of", int((side!=0).sum()), "non-median points")

# Power simulation: how many pay cycles to detect a true payday uplift u with circular-shift test at alpha .05 (one-sided)?
def simulate_power(u, n_cycles, sims=120):
    hits=0
    for _ in range(sims):
        nd = 30*n_cycles; idx = np.arange(nd); dsp_ = idx%30
        wk_ = np.where((idx%7)>=5,1.25,1.0); up = np.where(dsp_<=6,u,1.0)
        xs = base*wk_*up*rng.lognormal(0,0.45,nd); ind_ = dsp_<=6
        ob = xs[ind_].mean()/xs[~ind_].mean()
        nl = np.array([xs[np.roll(ind_,s)].mean()/xs[~np.roll(ind_,s)].mean() for s in range(1,nd,3)])
        if (np.sum(nl>=ob)+1)/(len(nl)+1) < 0.05: hits+=1
    return hits/sims
for u in [1.10,1.20,1.30,1.45]:
    print(f"power (true uplift x{u}):", {n: round(simulate_power(u,n),2) for n in [3,6,12]})

# Illustrative n-of-1 alternating-month evaluation of an intervention that cuts payday-window discretionary spend by 15%
def sim_ab(effect=0.85, months=6, sims=200):
    hits=0
    for _ in range(sims):
        vals=[]; arms=[]
        for m in range(months):
            arm = m%2  # alternate A/B
            dsp_=np.arange(30); wk_=np.where((np.arange(30)%7)>=5,1.25,1.0); up=np.where(dsp_<=6,1.45,1.0)
            eff = np.where(dsp_<=6, effect if arm==1 else 1.0, 1.0)
            xs = base*wk_*up*eff*rng.lognormal(0,0.45,30)
            vals.append(xs[dsp_<=6].sum()); arms.append(arm)
        vals=np.array(vals); arms=np.array(arms)
        obs_d = vals[arms==0].mean()-vals[arms==1].mean()
        # exact permutation over arm labels
        from itertools import combinations
        idx=np.arange(months); null=[]
        for comb in combinations(idx, months//2):
            mask=np.zeros(months,bool); mask[list(comb)]=True
            null.append(vals[~mask].mean()-vals[mask].mean())
        pval = np.mean(np.array(null)>=obs_d)
        if pval<=0.05: hits+=1
    return hits/sims
for months in [6,12]:
    print(f"n-of-1 alternating design, 15% reduction in payday-window spend, {months} months: power≈{sim_ab(0.85,months):.2f}; 30% reduction: power≈{sim_ab(0.70,months):.2f}")
df.to_csv("synthetic_ledger.csv")
