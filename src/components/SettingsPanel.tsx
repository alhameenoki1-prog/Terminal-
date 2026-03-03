import { useState } from 'react'
import { useStore } from '../store/useStore'
import { sendEmailDigest } from '../services/emailService'

export function SettingsPanel() {
  const settings       = useStore((s) => s.settings)
  const updateSettings = useStore((s) => s.updateSettings)
  const tickers        = useStore((s) => s.tickers)
  const regime         = useStore((s) => s.regime)
  const news           = useStore((s) => s.news)
  const alertRules     = useStore((s) => s.alertRules)
  const [digestStatus, setDigestStatus] = useState<string | null>(null)

  const sendNow = async () => {
    setDigestStatus('Sending…')
    const snapshot = Object.entries(tickers).slice(0, 12).map(([sym, t]) => ({
      label: sym,
      price: t.price.toLocaleString(undefined, { maximumFractionDigits: 4 }),
      change: `${t.changePct24h >= 0 ? '+' : ''}${t.changePct24h.toFixed(2)}%`,
    }))
    const result = await sendEmailDigest(settings, {
      regime,
      marketSnapshot: snapshot,
      headlines: news.slice(0, 8).map((n) => n.title),
      triggeredAlerts: alertRules.filter((r) => r.triggered).map((r) => r.label),
    })
    setDigestStatus(result.ok ? '✓ Digest sent!' : `✗ ${result.error}`)
    setTimeout(() => setDigestStatus(null), 5000)
  }

  const field = (key: keyof typeof settings, label: string, type = 'text', placeholder = '') => (
    <div key={key}>
      <label className="font-mono text-2xs text-terminal-faint block mb-0.5">{label}</label>
      <input
        type={type}
        value={settings[key] as string}
        onChange={(e) => updateSettings({ [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text placeholder:text-terminal-faint/30 focus:outline-none focus:border-terminal-accent"
      />
    </div>
  )

  return (
    <div className="p-3 flex flex-col gap-4">
      <div className="font-mono text-2xs text-terminal-accent tracking-widest uppercase">
        NEXUS Settings
      </div>

      <section>
        <div className="font-mono text-2xs text-terminal-faint mb-2 border-b border-terminal-border/50 pb-1">AI / LLM</div>
        <div className="flex flex-col gap-2">
          {field('groqApiKey', 'Groq API Key', 'password', 'gsk_...')}
          {field('ollamaHost', 'Ollama Host (local)', 'text', 'http://localhost:11434')}
        </div>
      </section>

      <section>
        <div className="font-mono text-2xs text-terminal-faint mb-2 border-b border-terminal-border/50 pb-1">FRED Economic Data</div>
        <div className="flex flex-col gap-2">
          {field('fredApiKey', 'FRED API Key', 'password', 'abcdefghijklmnop1234567890123456')}
          <div className="font-mono text-2xs text-terminal-faint/60 leading-relaxed">
            Free key at <span className="text-terminal-accent">fred.stlouisfed.org/docs/api/api_key.html</span>
            <br />Provides live CPI, PCE, GDP, unemployment, yields & more.
          </div>
        </div>
      </section>

      <section>
        <div className="font-mono text-2xs text-terminal-faint mb-2 border-b border-terminal-border/50 pb-1">Telegram Alerts</div>
        <div className="flex flex-col gap-2">
          {field('telegramBotToken', 'Bot Token', 'password', '123456789:AABBcc...')}
          {field('telegramChatId',   'Chat ID',   'text',     '-100...')}
        </div>
      </section>

      <section>
        <div className="font-mono text-2xs text-terminal-faint mb-2 border-b border-terminal-border/50 pb-1">Email Digest (EmailJS)</div>
        <div className="flex flex-col gap-2">
          {field('emailjsServiceId',  'Service ID',  'text', 'service_...')}
          {field('emailjsTemplateId', 'Template ID', 'text', 'template_...')}
          {field('emailjsPublicKey',  'Public Key',  'password', 'xxxxxxxx')}
          {field('digestEmail',       'Recipient Email', 'email', 'you@example.com')}
          <div>
            <label className="font-mono text-2xs text-terminal-faint block mb-0.5">Digest Frequency</label>
            <select
              value={settings.digestFrequency}
              onChange={(e) => updateSettings({ digestFrequency: e.target.value as typeof settings.digestFrequency })}
              className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
            >
              {['off', 'hourly', '2h', '6h', 'daily', 'weekly'].map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            {([['digestIncludeAI', 'Include AI summary'], ['digestIncludeHeadlines', 'Include headlines'], ['digestIncludeSnapshot', 'Include market snapshot']] as [keyof typeof settings, string][]).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 font-mono text-2xs text-terminal-faint cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[key] as boolean}
                  onChange={(e) => updateSettings({ [key]: e.target.checked })}
                />
                {label}
              </label>
            ))}
          </div>

          {/* Send Now */}
          <button
            onClick={sendNow}
            className="w-full py-1.5 font-mono text-xs bg-terminal-accent/10 border border-terminal-accent/40 text-terminal-accent rounded hover:bg-terminal-accent/20 transition-colors"
          >
            Send Digest Now
          </button>
          {digestStatus && (
            <div className={`font-mono text-xs px-2 py-1 rounded ${
              digestStatus.startsWith('✓') ? 'text-terminal-up' :
              digestStatus === 'Sending…'  ? 'text-terminal-faint' : 'text-terminal-down'
            }`}>
              {digestStatus}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
