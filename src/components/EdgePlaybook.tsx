import { useState } from 'react'
import { useStore } from '../store/useStore'
import type { EdgeScenario, SetupType } from '../types'

const SETUP_LABELS: Record<SetupType, string> = {
  'trend':            'Trend Follow',
  'mean-revert':      'Mean Revert',
  'liquidity-event':  'Liquidity Event',
  'macro-transition': 'Macro Transition',
}

const SETUP_COLOR: Record<SetupType, string> = {
  'trend':            'text-terminal-up',
  'mean-revert':      'text-terminal-accent',
  'liquidity-event':  'text-yellow-400',
  'macro-transition': 'text-terminal-blue',
}

function newScenario(): Partial<EdgeScenario> {
  return {
    asset: 'BTCUSDT', direction: 'LONG', setupType: 'trend',
    bondConfirmation: '', triggers: '', targets: '', invalidation: '', riskPlan: '',
  }
}

export function EdgePlaybook() {
  const scenarios       = useStore((s) => s.edgeScenarios)
  const addScenario     = useStore((s) => s.addEdgeScenario)
  const removeScenario  = useStore((s) => s.removeEdgeScenario)

  const [showForm, setShowForm] = useState(false)
  const [draft, setDraft]       = useState<Partial<EdgeScenario>>(newScenario())

  const save = () => {
    if (!draft.asset) return
    addScenario({
      id:               Date.now().toString(),
      asset:            draft.asset ?? 'BTCUSDT',
      direction:        draft.direction ?? 'LONG',
      setupType:        draft.setupType ?? 'trend',
      bondConfirmation: draft.bondConfirmation ?? '',
      triggers:         draft.triggers ?? '',
      targets:          draft.targets ?? '',
      invalidation:     draft.invalidation ?? '',
      riskPlan:         draft.riskPlan ?? '',
      createdAt:        new Date().toISOString(),
    })
    setShowForm(false)
    setDraft(newScenario())
  }

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-2xs text-terminal-accent tracking-widest uppercase">
          Edge Playbook
        </span>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-2 py-0.5 font-mono text-2xs rounded border border-terminal-border text-terminal-faint hover:text-terminal-accent transition-colors"
        >
          {showForm ? '✕ Cancel' : '+ Add Scenario'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-terminal-panel rounded border border-terminal-border p-3 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-mono text-2xs text-terminal-faint block mb-0.5">Asset</label>
              <input
                value={draft.asset ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, asset: e.target.value }))}
                className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
                placeholder="BTCUSDT"
              />
            </div>
            <div>
              <label className="font-mono text-2xs text-terminal-faint block mb-0.5">Direction</label>
              <select
                value={draft.direction}
                onChange={(e) => setDraft((d) => ({ ...d, direction: e.target.value as 'LONG' | 'SHORT' }))}
                className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
              >
                <option value="LONG">LONG</option>
                <option value="SHORT">SHORT</option>
              </select>
            </div>
          </div>
          <div>
            <label className="font-mono text-2xs text-terminal-faint block mb-0.5">Setup Type</label>
            <select
              value={draft.setupType}
              onChange={(e) => setDraft((d) => ({ ...d, setupType: e.target.value as SetupType }))}
              className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
            >
              {(Object.keys(SETUP_LABELS) as SetupType[]).map((k) => (
                <option key={k} value={k}>{SETUP_LABELS[k]}</option>
              ))}
            </select>
          </div>
          {[
            { key: 'bondConfirmation', label: 'Bond Confirmation (which yields support this?)' },
            { key: 'triggers',         label: 'Triggers / Entry conditions' },
            { key: 'targets',          label: 'Targets' },
            { key: 'invalidation',     label: 'Invalidation' },
            { key: 'riskPlan',         label: 'Risk Plan (size + correlation limit)' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="font-mono text-2xs text-terminal-faint block mb-0.5">{label}</label>
              <textarea
                value={(draft as Record<string, string>)[key] ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                rows={2}
                className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text resize-none"
              />
            </div>
          ))}
          <button
            onClick={save}
            className="w-full py-1.5 font-mono text-xs bg-terminal-accent text-terminal-bg rounded font-bold"
          >
            Save Scenario
          </button>
        </div>
      )}

      {/* Scenario cards */}
      {scenarios.length === 0 && !showForm && (
        <div className="text-center font-mono text-2xs text-terminal-faint/50 py-4">
          No scenarios yet. Click "+ Add Scenario" to define your edge.
        </div>
      )}

      {scenarios.map((s) => (
        <div key={s.id} className="bg-terminal-panel rounded border border-terminal-border/50 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-terminal-text">{s.asset}</span>
              <span className={`font-mono text-xs font-bold ${s.direction === 'LONG' ? 'text-terminal-up' : 'text-terminal-down'}`}>
                {s.direction}
              </span>
              <span className={`font-mono text-2xs ${SETUP_COLOR[s.setupType]}`}>
                {SETUP_LABELS[s.setupType]}
              </span>
            </div>
            <button
              onClick={() => removeScenario(s.id)}
              className="font-mono text-2xs text-terminal-faint/50 hover:text-terminal-down transition-colors"
            >
              ✕
            </button>
          </div>
          {s.bondConfirmation && (
            <div className="font-mono text-2xs text-terminal-accent mb-1">
              🔑 Bond: {s.bondConfirmation}
            </div>
          )}
          {s.triggers && (
            <div className="font-mono text-2xs text-terminal-dim mb-1">
              ⚡ Triggers: {s.triggers}
            </div>
          )}
          {s.targets && (
            <div className="font-mono text-2xs text-terminal-dim">
              🎯 Targets: {s.targets} · Stop: {s.invalidation}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
