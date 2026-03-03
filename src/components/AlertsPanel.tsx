import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { sendTelegramAlert, formatAlertMessage } from '../services/telegramService'
import { sendEmailDigest, digestIntervalMs } from '../services/emailService'
import type { AlertRule, AlertType } from '../types'

const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  price_above:         'Price Above',
  price_below:         'Price Below',
  pct_change:          '% Change',
  regime_shift:        'Regime Shift',
  instability_jump:    'Instability Jump',
  vol_spread_extreme:  'Vol Spread Extreme',
  rate_divergence:     'Rate Divergence',
  yield_curve_signal:  'Yield Curve Signal',
}

function newRule(): Partial<AlertRule> {
  return {
    type: 'price_above', label: '', asset: 'BTCUSDT',
    threshold: 0, active: true, triggered: false,
    cooldownMinutes: 60, telegram: true,
  }
}

export function AlertsPanel() {
  const rules         = useStore((s) => s.alertRules)
  const addRule       = useStore((s) => s.addAlertRule)
  const removeRule    = useStore((s) => s.removeAlertRule)
  const updateRule    = useStore((s) => s.updateAlertRule)
  const tickers       = useStore((s) => s.tickers)
  const settings      = useStore((s) => s.settings)
  const regime        = useStore((s) => s.regime)

  const news          = useStore((s) => s.news)

  const [showForm, setShowForm]   = useState(false)
  const [draft, setDraft]         = useState<Partial<AlertRule>>(newRule())
  const [testResult, setTestResult] = useState<string | null>(null)

  // Alert evaluation engine — runs every 60s
  useEffect(() => {
    const evaluate = () => {
      rules.forEach((rule) => {
        if (!rule.active || rule.triggered) return

        // Cooldown check
        if (rule.lastTriggeredAt) {
          const ms = Date.now() - new Date(rule.lastTriggeredAt).getTime()
          if (ms < rule.cooldownMinutes * 60 * 1000) return
        }

        let fired = false
        let detail = ''

        if (rule.type === 'price_above' && rule.asset && rule.threshold) {
          const price = tickers[rule.asset]?.price
          if (price && price > rule.threshold) {
            fired = true
            detail = `${rule.asset} at $${price.toFixed(2)} exceeded $${rule.threshold}`
          }
        }
        if (rule.type === 'price_below' && rule.asset && rule.threshold) {
          const price = tickers[rule.asset]?.price
          if (price && price < rule.threshold) {
            fired = true
            detail = `${rule.asset} at $${price.toFixed(2)} dropped below $${rule.threshold}`
          }
        }
        if (rule.type === 'regime_shift') {
          const prevRegime = localStorage.getItem('nexus-prev-regime')
          if (prevRegime && prevRegime !== regime.regime) {
            fired = true
            detail = `Regime changed: ${prevRegime} → ${regime.regime}`
          }
          localStorage.setItem('nexus-prev-regime', regime.regime)
        }

        // ── 5 previously unimplemented alert types ──────────────────────

        // pct_change: fires when asset moves by threshold % in 24h
        if (rule.type === 'pct_change' && rule.asset && rule.threshold != null) {
          const t = tickers[rule.asset]
          if (t) {
            const absChg = Math.abs(t.changePct24h)
            if (absChg >= rule.threshold) {
              fired = true
              detail = `${rule.asset} moved ${t.changePct24h > 0 ? '+' : ''}${t.changePct24h.toFixed(2)}% in 24h (threshold ±${rule.threshold}%)`
            }
          }
        }

        // instability_jump: fires when VIX jumps by threshold % intraday
        if (rule.type === 'instability_jump') {
          const vix = tickers['^VIX']
          const threshold = rule.threshold ?? 15 // default 15% VIX spike
          if (vix && Math.abs(vix.changePct24h) >= threshold) {
            fired = true
            detail = `VIX ${vix.changePct24h > 0 ? 'spiked' : 'crashed'} ${vix.changePct24h > 0 ? '+' : ''}${vix.changePct24h.toFixed(1)}% — instability event (threshold ±${threshold}%)`
          }
        }

        // vol_spread_extreme: fires when any vol spread z-score exceeds ±threshold (default 2.0)
        if (rule.type === 'vol_spread_extreme') {
          const threshold = rule.threshold ?? 2.0
          // Check localStorage for latest vol spread data written by VolatilityPanel
          const storedSpreads = localStorage.getItem('nexus-vol-spreads')
          if (storedSpreads) {
            try {
              const spreads: { label: string; zScore: number }[] = JSON.parse(storedSpreads)
              const extreme = spreads.find((s) => Math.abs(s.zScore) >= threshold)
              if (extreme) {
                fired = true
                detail = `Vol spread extreme: ${extreme.label} z-score ${extreme.zScore > 0 ? '+' : ''}${extreme.zScore.toFixed(2)}σ (threshold ±${threshold}σ)`
              }
            } catch { /* ignore parse errors */ }
          }
        }

        // rate_divergence: fires when US 10Y moves by threshold bps without USDJPY moving
        if (rule.type === 'rate_divergence') {
          const us10y    = tickers['^TNX']
          const usdjpy   = tickers['USDJPY=X']
          const bpsThreshold = rule.threshold ?? 10 // default 10bp
          if (us10y && usdjpy) {
            // 10Y % change × 100 ≈ yield change in bps (rough approximation)
            const yieldChgBps  = Math.abs(us10y.changePct24h * (us10y.price / 100) * 100)
            const fxChangePct  = Math.abs(usdjpy.changePct24h)
            // Rate moved significantly but FX didn't respond (divergence)
            if (yieldChgBps >= bpsThreshold && fxChangePct < 0.2) {
              fired = true
              detail = `Rate divergence: US10Y changed ~${yieldChgBps.toFixed(0)}bp but USDJPY only moved ${fxChangePct.toFixed(2)}% — positioning block or intervention risk`
            }
          }
        }

        // yield_curve_signal: fires when 2s10s spread crosses zero (inversion) or un-inverts
        if (rule.type === 'yield_curve_signal') {
          const us3m  = tickers['^IRX']?.price   // 3M proxy for short end
          const us10y = tickers['^TNX']?.price
          if (us3m && us10y) {
            const spread    = us10y - us3m
            const prevKey   = 'nexus-prev-yield-spread'
            const prevSpread = parseFloat(localStorage.getItem(prevKey) ?? 'NaN')
            if (!isNaN(prevSpread)) {
              // Inversion event: spread crosses from positive to negative
              if (prevSpread >= 0 && spread < 0) {
                fired = true
                detail = `Yield curve INVERTED: 3M/10Y spread crossed to ${(spread * 100).toFixed(0)}bp`
              }
              // Un-inversion event: spread crosses from negative to positive
              if (prevSpread < 0 && spread >= 0) {
                fired = true
                detail = `Yield curve UN-INVERTED: 3M/10Y spread recovered to ${(spread * 100).toFixed(0)}bp`
              }
            }
            localStorage.setItem(prevKey, String(spread))
          }
        }

        if (fired) {
          updateRule(rule.id, { triggered: true, triggeredAt: new Date().toISOString(), lastTriggeredAt: new Date().toISOString() })
          if (rule.telegram && settings.telegramBotToken && settings.telegramChatId) {
            sendTelegramAlert(
              settings.telegramBotToken,
              settings.telegramChatId,
              formatAlertMessage(rule.label || rule.type, detail, new Date().toLocaleString()),
            ).catch(() => {})
          }
        }
      })
    }

    evaluate()
    const id = setInterval(evaluate, 60_000)
    return () => clearInterval(id)
  }, [rules, tickers, regime, settings, updateRule])

  // ── Email digest scheduler ─────────────────────────────────────────────────
  useEffect(() => {
    const intervalMs = digestIntervalMs(settings.digestFrequency)
    if (intervalMs === 0) return

    const sendDigest = async () => {
      const snapshot = Object.entries(tickers).slice(0, 12).map(([sym, t]) => ({
        label: sym,
        price: t.price.toLocaleString(undefined, { maximumFractionDigits: 4 }),
        change: `${t.changePct24h >= 0 ? '+' : ''}${t.changePct24h.toFixed(2)}%`,
      }))
      await sendEmailDigest(settings, {
        regime,
        marketSnapshot: snapshot,
        headlines: settings.digestIncludeHeadlines ? news.slice(0, 8).map((n) => n.title) : [],
        triggeredAlerts: rules.filter((r) => r.triggered).map((r) => `${r.label}: triggered at ${r.triggeredAt ?? 'unknown'}`),
      })
    }

    const id = setInterval(sendDigest, intervalMs)
    return () => clearInterval(id)
  }, [settings, tickers, regime, rules, news])

  const save = () => {
    addRule({
      id:             Date.now().toString(),
      type:           draft.type ?? 'price_above',
      label:          draft.label || `${draft.type} alert`,
      asset:          draft.asset,
      threshold:      draft.threshold,
      active:         true,
      triggered:      false,
      cooldownMinutes: draft.cooldownMinutes ?? 60,
      telegram:       draft.telegram ?? true,
    })
    setShowForm(false)
    setDraft(newRule())
  }

  const testTelegram = async () => {
    if (!settings.telegramBotToken || !settings.telegramChatId) {
      setTestResult('No Telegram credentials in Settings')
      return
    }
    const ok = await sendTelegramAlert(
      settings.telegramBotToken,
      settings.telegramChatId,
      formatAlertMessage('NEXUS Test Alert', 'This is a test message from NEXUS Terminal v5.0', new Date().toLocaleString()),
    )
    setTestResult(ok ? '✓ Telegram message sent!' : '✗ Failed — check token and chat ID')
    setTimeout(() => setTestResult(null), 4000)
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
      {/* Header */}
      <div className="sticky top-0 bg-terminal-surface border-b border-terminal-border px-3 py-2 flex items-center justify-between z-10">
        <span className="font-mono text-2xs text-terminal-accent tracking-widest uppercase">
          Alert Center
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={testTelegram}
            className="px-2 py-0.5 font-mono text-2xs rounded border border-terminal-border text-terminal-faint hover:text-terminal-dim"
          >
            Test TG
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-2 py-0.5 font-mono text-2xs rounded border border-terminal-accent text-terminal-accent"
          >
            + Rule
          </button>
        </div>
      </div>

      {testResult && (
        <div className="mx-3 mt-2 p-2 rounded bg-terminal-panel border border-terminal-border font-mono text-xs text-terminal-dim">
          {testResult}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="m-3 bg-terminal-panel rounded border border-terminal-border p-3 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-mono text-2xs text-terminal-faint block mb-0.5">Type</label>
              <select
                value={draft.type}
                onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value as AlertType }))}
                className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
              >
                {(Object.keys(ALERT_TYPE_LABELS) as AlertType[]).map((k) => (
                  <option key={k} value={k}>{ALERT_TYPE_LABELS[k]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-mono text-2xs text-terminal-faint block mb-0.5">Asset</label>
              <input
                value={draft.asset ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, asset: e.target.value }))}
                className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
                placeholder="BTCUSDT"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-mono text-2xs text-terminal-faint block mb-0.5">Threshold</label>
              <input
                type="number"
                value={draft.threshold ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, threshold: parseFloat(e.target.value) }))}
                className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
              />
            </div>
            <div>
              <label className="font-mono text-2xs text-terminal-faint block mb-0.5">Label</label>
              <input
                value={draft.label ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
                className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
                placeholder="My Alert"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 font-mono text-2xs text-terminal-faint cursor-pointer">
            <input
              type="checkbox"
              checked={draft.telegram ?? true}
              onChange={(e) => setDraft((d) => ({ ...d, telegram: e.target.checked }))}
            />
            Send Telegram notification
          </label>
          <div className="flex gap-2">
            <button onClick={save} className="flex-1 py-1 font-mono text-xs bg-terminal-accent text-terminal-bg rounded">Save</button>
            <button onClick={() => setShowForm(false)} className="px-3 py-1 font-mono text-xs border border-terminal-border text-terminal-faint rounded">Cancel</button>
          </div>
        </div>
      )}

      {/* Rules list */}
      <div className="p-3 flex flex-col gap-2">
        {rules.length === 0 && !showForm && (
          <div className="text-center py-8 font-mono text-xs text-terminal-faint/50">
            No alert rules configured
          </div>
        )}
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-terminal-panel rounded border p-2 ${
              rule.triggered ? 'border-terminal-accent/50' : 'border-terminal-border/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-terminal-text">{rule.label}</span>
                {rule.triggered && (
                  <span className="ml-2 font-mono text-2xs text-terminal-accent">⚡ TRIGGERED</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {rule.triggered && (
                  <button
                    onClick={() => updateRule(rule.id, { triggered: false })}
                    className="font-mono text-2xs text-terminal-faint hover:text-terminal-dim"
                  >
                    Reset
                  </button>
                )}
                <button
                  onClick={() => removeRule(rule.id)}
                  className="font-mono text-2xs text-terminal-faint hover:text-terminal-down"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="font-mono text-2xs text-terminal-faint mt-0.5">
              {ALERT_TYPE_LABELS[rule.type]}
              {rule.asset && ` · ${rule.asset}`}
              {rule.threshold ? ` · ${rule.threshold}` : ''}
              {rule.telegram && ' · 📱 TG'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
