import { TickerTape } from './components/TickerTape'
import { Watchlist }  from './components/Watchlist'
import { TradingChart } from './components/TradingChart'
import { WorldMap }   from './components/WorldMap'
import { NewsFeed }   from './components/NewsFeed'
import { RatesPanel } from './components/RatesPanel'
import { StatusBar }  from './components/StatusBar'

export default function App() {
  return (
    <div className="app-grid font-sans text-terminal-text select-none">
      {/* ── Row 1: Ticker tape (full width) ──────────────────────────── */}
      <header className="col-span-3 h-10 border-b border-terminal-border z-10">
        <TickerTape />
      </header>

      {/* ── Row 2: Main content ───────────────────────────────────────── */}

      {/* Col 1: Watchlist */}
      <aside className="h-full overflow-hidden bg-terminal-surface border-r border-terminal-border">
        <Watchlist />
      </aside>

      {/* Col 2: Chart + Map stacked */}
      <main className="h-full flex flex-col overflow-hidden">
        {/* Chart — 60% of center height */}
        <div className="chart-pane">
          <TradingChart />
        </div>

        {/* Map — 40% of center height */}
        <div className="map-pane">
          <WorldMap />
        </div>
      </main>

      {/* Col 3: News + Rates stacked */}
      <aside className="h-full flex flex-col overflow-hidden border-l border-terminal-border">
        {/* News — 55% */}
        <div className="news-pane">
          <NewsFeed />
        </div>

        {/* Rates — 45% */}
        <div className="rates-pane overflow-hidden">
          <RatesPanel />
        </div>
      </aside>

      {/* ── Row 3: Status bar (full width) ───────────────────────────── */}
      <footer className="col-span-3 h-8 border-t border-terminal-border">
        <StatusBar />
      </footer>
    </div>
  )
}
