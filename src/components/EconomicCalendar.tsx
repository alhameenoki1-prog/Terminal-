import { useState, useMemo } from 'react'
import { CALENDAR_EVENTS } from '../data/economicCalendar'
import { useStore } from '../store/useStore'
import type { EconomicEvent, EventImpact, EventCategory } from '../types'

const IMPACT_STYLE: Record<EventImpact, { dot: string; badge: string }> = {
  high:   { dot: 'bg-red-500',    badge: 'text-red-400 border-red-800/60 bg-red-900/20' },
  medium: { dot: 'bg-yellow-500', badge: 'text-yellow-400 border-yellow-800/60 bg-yellow-900/20' },
  low:    { dot: 'bg-terminal-faint', badge: 'text-terminal-faint border-terminal-border' },
}

const CAT_LABEL: Record<EventCategory, string> = {
  'central-bank': 'CB',
  'inflation':    'CPI',
  'employment':   'EMP',
  'growth':       'GDP',
  'trade':        'TRADE',
  'custom':       'CUSTOM',
}

const CAT_COLOR: Record<EventCategory, string> = {
  'central-bank': 'text-terminal-accent',
  'inflation':    'text-orange-400',
  'employment':   'text-blue-400',
  'growth':       'text-green-400',
  'trade':        'text-purple-400',
  'custom':       'text-terminal-faint',
}

function blankEvent(): Omit<EconomicEvent, 'id'> {
  return {
    date: new Date().toISOString().slice(0, 10),
    time: '12:00',
    country: 'US',
    flag: '🇺🇸',
    title: '',
    category: 'custom',
    impact: 'medium',
    custom: true,
  }
}

export function EconomicCalendar() {
  const [customEvents, setCustomEvents] = useState<EconomicEvent[]>([])
  const [showAdd, setShowAdd]           = useState(false)
  const [form, setForm]                 = useState(blankEvent())
  const [filter, setFilter]             = useState<EventImpact | 'all'>('all')
  const [catFilter, setCatFilter]       = useState<EventCategory | 'all'>('all')
  const [daysAhead, setDaysAhead]       = useState(30)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const allEvents = useMemo(() => {
    const cutoff = new Date(today)
    cutoff.setDate(cutoff.getDate() + daysAhead)
    return [...CALENDAR_EVENTS, ...customEvents]
      .filter((e) => {
        const d = new Date(e.date)
        if (d < today || d > cutoff) return false
        if (filter !== 'all' && e.impact !== filter) return false
        if (catFilter !== 'all' && e.category !== catFilter) return false
        return true
      })
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? '').localeCompare(b.time ?? ''))
  }, [customEvents, filter, catFilter, daysAhead, today])

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, EconomicEvent[]>()
    for (const e of allEvents) {
      const arr = map.get(e.date) ?? []
      arr.push(e)
      map.set(e.date, arr)
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [allEvents])

  const addCustom = () => {
    if (!form.title.trim()) return
    setCustomEvents((prev) => [...prev, { ...form, id: crypto.randomUUID() }])
    setForm(blankEvent())
    setShowAdd(false)
  }

  const removeCustom = (id: string) => setCustomEvents((prev) => prev.filter((e) => e.id !== id))

  const isToday = (date: string) => date === today.toISOString().slice(0, 10)
  const isThisWeek = (date: string) => {
    const d = new Date(date)
    const diff = Math.floor((d.getTime() - today.getTime()) / 86_400_000)
    return diff >= 0 && diff < 7
  }

  const upcoming = allEvents.filter((e) => {
    const diff = Math.floor((new Date(e.date).getTime() - today.getTime()) / 86_400_000)
    return diff >= 0 && diff <= 7
  })

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header + controls */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-terminal-border flex-shrink-0">
        <span className="font-mono text-2xs font-semibold text-terminal-accent tracking-widest">
          ECONOMIC CALENDAR
        </span>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className={`px-2 py-0.5 font-mono text-2xs rounded border transition-all ${
            showAdd ? 'border-terminal-accent text-terminal-accent' : 'border-terminal-border text-terminal-faint hover:border-terminal-muted'
          }`}
        >
          + Custom
        </button>
      </div>

      {/* Upcoming ribbon */}
      {upcoming.length > 0 && (
        <div className="px-3 py-1.5 bg-terminal-accent/5 border-b border-terminal-accent/20 flex-shrink-0">
          <div className="font-mono text-2xs text-terminal-accent mb-1">THIS WEEK ({upcoming.length})</div>
          <div className="flex gap-1 flex-wrap">
            {upcoming.slice(0, 5).map((e) => (
              <span key={e.id} className={`font-mono text-2xs px-1.5 py-0.5 rounded border ${IMPACT_STYLE[e.impact].badge}`}>
                {e.flag} {e.date.slice(5)} {e.title.split(' ').slice(0, 2).join(' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="px-3 py-1.5 border-b border-terminal-border/40 flex gap-2 flex-shrink-0 flex-wrap">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="bg-terminal-bg border border-terminal-border/50 rounded px-1.5 py-0.5 font-mono text-xs text-terminal-faint"
        >
          <option value="all">All impact</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value as typeof catFilter)}
          className="bg-terminal-bg border border-terminal-border/50 rounded px-1.5 py-0.5 font-mono text-xs text-terminal-faint"
        >
          <option value="all">All types</option>
          {(Object.keys(CAT_LABEL) as EventCategory[]).map((k) => (
            <option key={k} value={k}>{CAT_LABEL[k]}</option>
          ))}
        </select>
        <select
          value={daysAhead}
          onChange={(e) => setDaysAhead(Number(e.target.value))}
          className="bg-terminal-bg border border-terminal-border/50 rounded px-1.5 py-0.5 font-mono text-xs text-terminal-faint"
        >
          <option value={7}>7 days</option>
          <option value={14}>14 days</option>
          <option value={30}>30 days</option>
          <option value={60}>60 days</option>
          <option value={90}>90 days</option>
        </select>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="border-b border-terminal-border bg-terminal-panel/60 p-3 flex-shrink-0 space-y-2">
          <div className="font-mono text-2xs text-terminal-accent tracking-widest mb-1">ADD CUSTOM EVENT</div>
          <div className="grid grid-cols-2 gap-2">
            <input value={form.date} type="date" onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text" />
            <input value={form.time ?? ''} type="time" onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text" />
          </div>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title"
            className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text placeholder:text-terminal-faint/30 focus:outline-none focus:border-terminal-accent" />
          <div className="grid grid-cols-3 gap-2">
            <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="US"
              className="bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text" />
            <select value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value as EventImpact })}
              className="bg-terminal-bg border border-terminal-border rounded px-1.5 py-1 font-mono text-xs text-terminal-faint">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <input value={form.forecast ?? ''} onChange={(e) => setForm({ ...form, forecast: e.target.value })} placeholder="Forecast"
              className="bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAdd(false)} className="px-3 py-1 font-mono text-2xs text-terminal-faint border border-terminal-border rounded">Cancel</button>
            <button onClick={addCustom} disabled={!form.title.trim()} className="px-3 py-1 font-mono text-2xs text-terminal-bg bg-terminal-accent rounded disabled:opacity-40">Add</button>
          </div>
        </div>
      )}

      {/* Calendar list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {grouped.length === 0 ? (
          <div className="p-6 text-center font-mono text-xs text-terminal-faint/50">No events in selected range</div>
        ) : (
          grouped.map(([date, events]) => (
            <div key={date}>
              {/* Date header */}
              <div className={`sticky top-0 z-10 px-3 py-1 flex items-center gap-2 border-b border-terminal-border/40 ${
                isToday(date) ? 'bg-terminal-accent/10 border-terminal-accent/30' :
                isThisWeek(date) ? 'bg-terminal-panel/80' : 'bg-terminal-surface/90'
              }`}>
                <span className={`font-mono text-2xs font-bold ${isToday(date) ? 'text-terminal-accent' : 'text-terminal-dim'}`}>
                  {isToday(date) ? 'TODAY' : new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <span className="font-mono text-2xs text-terminal-faint/50">{events.length} event{events.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Events */}
              {events.map((event) => (
                <div key={event.id} className="flex items-start gap-2 px-3 py-2 border-b border-terminal-border/20 hover:bg-terminal-panel/30 transition-colors">
                  {/* Impact dot */}
                  <div className="flex-shrink-0 mt-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${IMPACT_STYLE[event.impact].dot}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-sm">{event.flag}</span>
                      <span className={`font-mono text-2xs font-semibold ${CAT_COLOR[event.category]}`}>
                        {CAT_LABEL[event.category]}
                      </span>
                      {event.time && (
                        <span className="font-mono text-2xs text-terminal-faint">{event.time} UTC</span>
                      )}
                      {event.custom && (
                        <button onClick={() => removeCustom(event.id)} className="font-mono text-2xs text-terminal-faint/40 hover:text-terminal-down ml-auto">✕</button>
                      )}
                    </div>
                    <div className="font-mono text-xs text-terminal-text">{event.title}</div>
                    {(event.forecast || event.previous || event.actual) && (
                      <div className="flex gap-3 mt-0.5">
                        {event.actual && (
                          <span className={`font-mono text-2xs font-bold ${
                            event.previous && parseFloat(event.actual) > parseFloat(event.previous) ? 'text-terminal-up' : 'text-terminal-down'
                          }`}>Act: {event.actual}</span>
                        )}
                        {event.forecast && <span className="font-mono text-2xs text-terminal-faint">Fcst: {event.forecast}</span>}
                        {event.previous && <span className="font-mono text-2xs text-terminal-faint">Prev: {event.previous}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Footer count */}
      <div className="px-3 py-1 border-t border-terminal-border/40 flex-shrink-0">
        <span className="font-mono text-2xs text-terminal-faint">
          {allEvents.filter(e => e.impact === 'high').length} high · {allEvents.filter(e => e.impact === 'medium').length} medium · {allEvents.length} total
        </span>
      </div>
    </div>
  )
}
