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
