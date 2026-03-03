import { useState } from 'react'
import { useStore } from '../store/useStore'
import type { ResearchItem, ResearchType } from '../types'

// ── NEXUS Section 4.4 — Weighted quality scoring algorithm ───────────────────
// Source Credibility  25% (tier-based: T1=5, T2=4, T3=3, T4=2, T5=1)
// Data Quality        25% (type-based: model/risk-framework=5, macro=4, trade-idea=3, general=1)
// Recency & Relevance 20% (time since added: <6h=5, <24h=4, <7d=3, <30d=2, older=1)
// Methodology Rigor   15% (type-based: model=5, risk-framework=4, macro=3, trade-idea=2, general=1)
// Actionability       15% (type-based: trade-idea=5, macro=4, model=3, risk-framework=2, general=1)

function computeAutoScore(item: Pick<ResearchItem, 'tier' | 'type' | 'addedAt'>): number {
  // Source Credibility (25%)
  const credibilityMap: Record<number, number> = { 1: 5, 2: 4, 3: 3, 4: 2, 5: 1 }
  const credibility = credibilityMap[item.tier] ?? 3

  // Data Quality (25%)
  const dataQualityMap: Record<ResearchType, number> = {
    'model': 5, 'risk-framework': 5, 'macro-forecast': 4, 'trade-idea': 3, 'general': 1,
  }
  const dataQuality = dataQualityMap[item.type] ?? 3

  // Recency (20%) — based on time since addedAt
  const ageHours = (Date.now() - new Date(item.addedAt).getTime()) / (1000 * 60 * 60)
  const recency = ageHours < 6 ? 5 : ageHours < 24 ? 4 : ageHours < 168 ? 3 : ageHours < 720 ? 2 : 1

  // Methodology Rigor (15%)
  const rigorMap: Record<ResearchType, number> = {
    'model': 5, 'risk-framework': 4, 'macro-forecast': 3, 'trade-idea': 2, 'general': 1,
  }
  const rigor = rigorMap[item.type] ?? 3

  // Actionability (15%)
  const actionMap: Record<ResearchType, number> = {
    'trade-idea': 5, 'macro-forecast': 4, 'model': 3, 'risk-framework': 2, 'general': 1,
  }
  const action = actionMap[item.type] ?? 3

  const raw =
    (credibility * 25 + dataQuality * 25 + recency * 20 + rigor * 15 + action * 15) /
    (5 * 100) * 100

  return Math.round(raw * 10) / 10
}

// Auto-flag threshold: score ≥ 4.0 (out of 5 component scale) = ≥ 80 out of 100
const AUTO_FLAG_THRESHOLD = 80

const TYPE_LABELS: Record<ResearchType, { label: string; color: string }> = {
  'macro-forecast': { label: 'Macro',      color: 'text-blue-400' },
  'trade-idea':     { label: 'Trade Idea', color: 'text-terminal-accent' },
  'model':          { label: 'Model',      color: 'text-purple-400' },
  'risk-framework': { label: 'Risk',       color: 'text-red-400' },
  'general':        { label: 'General',    color: 'text-terminal-faint' },
}

const TIER_COLORS: Record<number, string> = {
  1: 'bg-terminal-accent text-terminal-bg',
  2: 'bg-blue-600 text-white',
  3: 'bg-purple-600 text-white',
  4: 'bg-yellow-600 text-white',
  5: 'bg-terminal-faint/30 text-terminal-faint',
}

function blank(): Omit<ResearchItem, 'id' | 'addedAt'> {
  return {
    title: '', content: '', source: '',
    tier: 1, type: 'macro-forecast',
    qualityScore: 50, flagged: false,
  }
}

export function ResearchFeedPanel() {
  const items         = useStore((s) => s.researchItems)
  const addItem       = useStore((s) => s.addResearchItem)
  const removeItem    = useStore((s) => s.removeResearchItem)

  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm]       = useState(blank())
  const [filter, setFilter]   = useState<ResearchType | 'all'>('all')
  const [tierFilter, setTierFilter] = useState<number | 'all'>('all')
  const [search, setSearch]   = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = items.filter((i) => {
    if (filter !== 'all' && i.type !== filter) return false
    if (tierFilter !== 'all' && i.tier !== tierFilter) return false
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) &&
        !i.content.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function submit() {
    if (!form.title.trim()) return
    addItem({
      ...form,
      id: crypto.randomUUID(),
      addedAt: new Date().toISOString(),
    })
    setForm(blank())
    setShowAdd(false)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header + controls */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-terminal-border flex-shrink-0">
        <span className="font-mono text-2xs font-semibold text-terminal-accent tracking-widest">
          RESEARCH INTEL ({items.length})
        </span>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className={`px-2 py-0.5 font-mono text-2xs rounded border transition-all ${
            showAdd ? 'border-terminal-accent text-terminal-accent' : 'border-terminal-border text-terminal-faint hover:border-terminal-muted'
          }`}
        >
          + Add
        </button>
      </div>

      {/* Filters */}
      <div className="px-3 py-1.5 border-b border-terminal-border/40 flex gap-2 flex-wrap flex-shrink-0">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="flex-1 min-w-[120px] bg-terminal-bg border border-terminal-border/50 rounded px-2 py-0.5 font-mono text-xs text-terminal-text placeholder:text-terminal-faint/30 focus:outline-none focus:border-terminal-accent"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="bg-terminal-bg border border-terminal-border/50 rounded px-1.5 py-0.5 font-mono text-xs text-terminal-faint"
        >
          <option value="all">All types</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="bg-terminal-bg border border-terminal-border/50 rounded px-1.5 py-0.5 font-mono text-xs text-terminal-faint"
        >
          <option value="all">All tiers</option>
          {[1, 2, 3, 4, 5].map((t) => <option key={t} value={t}>T{t}</option>)}
        </select>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="border-b border-terminal-border bg-terminal-panel/60 p-3 flex-shrink-0 space-y-2">
          <div className="font-mono text-2xs text-terminal-accent tracking-widest mb-1">NEW RESEARCH ITEM</div>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title / thesis"
            className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text placeholder:text-terminal-faint/30 focus:outline-none focus:border-terminal-accent"
          />
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Content / analysis notes…"
            rows={3}
            className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text placeholder:text-terminal-faint/30 focus:outline-none focus:border-terminal-accent resize-none"
          />
          <div className="flex gap-2">
            <input
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              placeholder="Source"
              className="flex-1 bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text placeholder:text-terminal-faint/30 focus:outline-none focus:border-terminal-accent"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as ResearchType })}
              className="bg-terminal-bg border border-terminal-border rounded px-1.5 py-1 font-mono text-xs text-terminal-faint focus:outline-none focus:border-terminal-accent"
            >
              {Object.entries(TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <select
              value={form.tier}
              onChange={(e) => setForm({ ...form, tier: Number(e.target.value) as 1|2|3|4|5 })}
              className="bg-terminal-bg border border-terminal-border rounded px-1.5 py-1 font-mono text-xs text-terminal-faint focus:outline-none focus:border-terminal-accent"
            >
              {[1,2,3,4,5].map((t) => <option key={t} value={t}>T{t}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xs text-terminal-faint">Quality: {form.qualityScore}</span>
            <input
              type="range"
              min={0} max={100} step={5}
              value={form.qualityScore}
              onChange={(e) => setForm({ ...form, qualityScore: Number(e.target.value) })}
              className="flex-1 accent-terminal-accent"
            />
            <label className="flex items-center gap-1 font-mono text-2xs text-terminal-faint cursor-pointer">
              <input
                type="checkbox"
                checked={form.flagged}
                onChange={(e) => setForm({ ...form, flagged: e.target.checked })}
              />
              Flag
            </label>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAdd(false)} className="px-3 py-1 font-mono text-2xs text-terminal-faint border border-terminal-border rounded hover:border-terminal-muted">
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={!form.title.trim()}
              className="px-3 py-1 font-mono text-2xs text-terminal-bg bg-terminal-accent rounded disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Items list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="p-4 text-center font-mono text-xs text-terminal-faint/50">
            {items.length === 0 ? 'No research items yet. Add your first insight.' : 'No matches.'}
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`border-b border-terminal-border/30 hover:bg-terminal-panel/40 transition-colors ${
                item.flagged ? 'border-l-2 border-l-terminal-accent' : ''
              }`}
            >
              <button
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                className="w-full text-left px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`font-mono text-2xs font-bold px-1.5 py-0.5 rounded ${TIER_COLORS[item.tier]}`}>
                      T{item.tier}
                    </span>
                    {item.flagged && <span className="text-terminal-accent text-sm">★</span>}
                    <span className="font-mono text-xs text-terminal-text truncate">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`font-mono text-2xs ${TYPE_LABELS[item.type].color}`}>
                      {TYPE_LABELS[item.type].label}
                    </span>
                    {/* Show both auto-computed score and manual override */}
                    {(() => {
                      const auto = computeAutoScore(item)
                      const isHighQ = auto >= AUTO_FLAG_THRESHOLD
                      return (
                        <span className={`font-mono text-2xs ${isHighQ ? 'text-terminal-accent' : 'text-terminal-faint'}`}
                          title={`Auto: ${auto} | Manual: ${item.qualityScore}`}>
                          {isHighQ ? '★' : ''} Q:{auto}
                        </span>
                      )
                    })()}
                  </div>
                </div>
                {item.source && (
                  <div className="font-mono text-2xs text-terminal-faint/60 mt-0.5 truncate">
                    {item.source} · {new Date(item.addedAt).toLocaleDateString()}
                  </div>
                )}
              </button>

              {/* Expanded content */}
              {expanded === item.id && (
                <div className="px-3 pb-2">
                  <div className="bg-terminal-bg rounded border border-terminal-border/40 p-2 mb-2">
                    <p className="font-mono text-xs text-terminal-dim whitespace-pre-wrap leading-relaxed">
                      {item.content || 'No content.'}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        removeItem(item.id)
                        if (expanded === item.id) setExpanded(null)
                      }}
                      className="font-mono text-2xs text-terminal-down/70 hover:text-terminal-down border border-terminal-down/30 px-2 py-0.5 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Quality legend */}
      {items.length > 0 && (
        <div className="px-3 py-1.5 border-t border-terminal-border/40 flex gap-3 flex-shrink-0">
          {[1,2,3,4,5].map((t) => (
            <span key={t} className={`font-mono text-2xs px-1.5 py-0.5 rounded ${TIER_COLORS[t]}`}>
              T{t}: {items.filter(i => i.tier === t).length}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
