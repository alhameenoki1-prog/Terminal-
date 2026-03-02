import { TickerTape }   from './components/TickerTape'
import { Watchlist }    from './components/Watchlist'
import { TradingChart } from './components/TradingChart'
import { WorldMap }     from './components/WorldMap'
import { NewsFeed }     from './components/NewsFeed'
import { RatesPanel }   from './components/RatesPanel'
import { StatusBar }    from './components/StatusBar'
import { CountryPanel } from './components/CountryPanel'
import { NexusPanel }   from './components/NexusPanel'
import { ChatPanel }    from './components/ChatPanel'
import { AlertsPanel }  from './components/AlertsPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { useStore }     from './store/useStore'

const RIGHT_TABS: { key: ReturnType<typeof useStore.getState>['rightPanelTab']; label: string; icon: string }[] = [
  { key: 'news',    label: 'News',    icon: '📰' },
  { key: 'country', label: 'Country', icon: '🌍' },
  { key: 'nexus',   label: 'NEXUS',   icon: '⚡' },
  { key: 'chat',    label: 'Chat',    icon: '🧠' },
  { key: 'alerts',  label: 'Alerts',  icon: '🔔' },
]

export default function App() {
  const rightPanelTab    = useStore((s) => s.rightPanelTab)
  const setRightPanelTab = useStore((s) => s.setRightPanelTab)
  const alertRules       = useStore((s) => s.alertRules)
  const triggeredCount   = alertRules.filter((r) => r.triggered).length

  return (
    <div className="app-grid font-sans text-terminal-text select-none">
      {/* ── Row 1: Ticker tape (full width) ─────────────────────── */}
      <header className="col-span-3 h-10 border-b border-terminal-border z-10">
        <TickerTape />
      </header>

      {/* ── Row 2: Main content ──────────────────────────────────── */}

      {/* Col 1: Watchlist */}
      <aside className="h-full overflow-hidden bg-terminal-surface border-r border-terminal-border">
        <Watchlist />
      </aside>

      {/* Col 2: Chart + Map stacked */}
      <main className="h-full flex flex-col overflow-hidden">
        <div className="chart-pane">
          <TradingChart />
        </div>
        <div className="map-pane">
          <WorldMap />
        </div>
      </main>

      {/* Col 3: Right panel with tabs */}
      <aside className="h-full flex flex-col overflow-hidden border-l border-terminal-border">
        {/* Tab bar */}
        <div className="flex border-b border-terminal-border bg-terminal-surface flex-shrink-0">
          {RIGHT_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setRightPanelTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 font-mono text-2xs transition-colors relative ${
                rightPanelTab === tab.key
                  ? 'text-terminal-accent border-b-2 border-terminal-accent'
                  : 'text-terminal-faint hover:text-terminal-dim'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.key === 'alerts' && triggeredCount > 0 && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-terminal-accent rounded-full font-mono text-2xs text-terminal-bg flex items-center justify-center leading-none" style={{ fontSize: '8px' }}>
                  {triggeredCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-hidden">
          {rightPanelTab === 'news'    && (
            <div className="h-full flex flex-col overflow-hidden">
              <div className="news-pane">
                <NewsFeed />
              </div>
              <div className="rates-pane overflow-hidden">
                <RatesPanel />
              </div>
            </div>
          )}
          {rightPanelTab === 'country' && <CountryPanel />}
          {rightPanelTab === 'nexus'   && <NexusPanel />}
          {rightPanelTab === 'chat'    && <ChatPanel />}
          {rightPanelTab === 'alerts'  && (
            <div className="h-full flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <AlertsPanel />
              </div>
              <div className="border-t border-terminal-border">
                <SettingsPanel />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Row 3: Status bar (full width) ───────────────────────── */}
      <footer className="col-span-3 h-8 border-t border-terminal-border">
        <StatusBar />
      </footer>
    </div>
  )
}
