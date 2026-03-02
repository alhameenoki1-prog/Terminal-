import { useState } from 'react'
import { useStore } from '../store/useStore'
import type { DailyLog, RegimeForLog } from '../types'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function emptyLog(date: string): DailyLog {
  return {
    date, theme: '', regime: 'transition', regimeClarity: 5, regimeEdge: 5,
    regimeRisk: 5, regimeActionability: 5, posture: '',
    keyDrivers: ['', '', '', '', ''], yieldSignal: '', tierOneEvidence: '',
    macroEvents: '', mcSummary: '', volAlerts: '', bestEdge: '',
    altScenario: '', researchNotes: '', alerts: '', checklistStatus: '',
    whatWouldChange: '',
  }
}

export function DailyLogPanel() {
  const dailyLogs  = useStore((s) => s.dailyLogs)
  const saveDailyLog = useStore((s) => s.saveDailyLog)
  const regime     = useStore((s) => s.regime)

  const [date, setDate]   = useState(today())
  const [log, setLog]     = useState<DailyLog>(() => dailyLogs[today()] ?? emptyLog(today()))
  const [saved, setSaved] = useState(false)

  const update = (patch: Partial<DailyLog>) => setLog((l) => ({ ...l, ...patch }))

  const save = () => {
    saveDailyLog(log)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const loadDate = (d: string) => {
    setDate(d)
    setLog(dailyLogs[d] ?? { ...emptyLog(d), regime: regime.regime, regimeClarity: regime.clarity, regimeEdge: regime.edge, regimeRisk: regime.risk, regimeActionability: regime.actionability, posture: regime.posture })
  }

  const exportLog = () => {
    const text = Object.entries(log).map(([k, v]) => `${k.toUpperCase()}: ${Array.isArray(v) ? v.join(' | ') : v}`).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `nexus-log-${date}.txt`
    a.click()
  }

  const field = (key: keyof DailyLog, label: string, rows = 2) => (
    <div>
      <label className="font-mono text-2xs text-terminal-faint block mb-0.5">{label}</label>
      <textarea
        value={log[key] as string}
        onChange={(e) => update({ [key]: e.target.value })}
        rows={rows}
        className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text resize-none focus:outline-none focus:border-terminal-accent"
      />
    </div>
  )

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
      {/* Header */}
      <div className="sticky top-0 bg-terminal-surface border-b border-terminal-border px-3 py-2 flex items-center justify-between z-10">
        <span className="font-mono text-2xs text-terminal-accent tracking-widest uppercase">
          NEXUS Daily Log
        </span>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => loadDate(e.target.value)}
            className="bg-terminal-bg border border-terminal-border rounded px-2 py-0.5 font-mono text-2xs text-terminal-text"
          />
          <button onClick={exportLog} className="px-2 py-0.5 font-mono text-2xs border border-terminal-border rounded text-terminal-faint hover:text-terminal-dim">Export</button>
          <button onClick={save} className={`px-2 py-0.5 font-mono text-2xs rounded border ${saved ? 'border-terminal-up text-terminal-up' : 'border-terminal-accent text-terminal-accent'}`}>
            {saved ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-3">
        {/* Regime */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="font-mono text-2xs text-terminal-faint block mb-0.5">Regime</label>
            <select
              value={log.regime}
              onChange={(e) => update({ regime: e.target.value as RegimeForLog })}
              className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
            >
              {['risk-on','transition','risk-off','crisis'].map((r) => (
                <option key={r} value={r}>{r.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-mono text-2xs text-terminal-faint block mb-0.5">Checklist</label>
            <select
              value={log.checklistStatus}
              onChange={(e) => update({ checklistStatus: e.target.value as DailyLog['checklistStatus'] })}
              className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
            >
              {['','PASS','PARTIAL','FAIL'].map((s) => <option key={s} value={s}>{s || 'Not run'}</option>)}
            </select>
          </div>
        </div>

        {field('theme', 'Daily Theme / Thesis', 2)}
        {field('posture', 'Posture', 1)}

        {/* Key drivers */}
        <div>
          <label className="font-mono text-2xs text-terminal-faint block mb-1">Key Drivers (5)</label>
          {log.keyDrivers.map((kd, i) => (
            <input
              key={i}
              value={kd}
              onChange={(e) => {
                const next = [...log.keyDrivers]
                next[i] = e.target.value
                update({ keyDrivers: next })
              }}
              placeholder={`Driver ${i + 1}`}
              className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text mb-1 focus:outline-none focus:border-terminal-accent"
            />
          ))}
        </div>

        {field('yieldSignal', '2Y Yield Signal', 1)}
        {field('tierOneEvidence', 'Tier-1 Evidence', 2)}
        {field('macroEvents', 'Macro Events Today', 2)}
        {field('mcSummary', 'Monte Carlo Summary', 2)}
        {field('volAlerts', 'Vol Spread Alerts', 1)}
        {field('bestEdge', 'Best Edge Scenario', 2)}
        {field('altScenario', 'Alternative Scenario', 2)}
        {field('researchNotes', 'Research Intelligence', 2)}
        {field('whatWouldChange', '"What Would Change My Mind?"', 2)}
      </div>
    </div>
  )
}
