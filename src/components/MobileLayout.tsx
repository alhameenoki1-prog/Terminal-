import { useState } from 'react'
import { TickerTape }  from './TickerTape'
import { Watchlist }   from './Watchlist'
import { TradingChart } from './TradingChart'
import { WorldMap }    from './WorldMap'
import { NewsFeed }    from './NewsFeed'
import { RatesPanel }  from './RatesPanel'
import { CountryPanel } from './CountryPanel'
import { NexusPanel }  from './NexusPanel'
import { ChatPanel }   from './ChatPanel'
import { AlertsPanel } from './AlertsPanel'
import { SettingsPanel } from './SettingsPanel'
import { StatusBar }   from './StatusBar'
import { useStore }    from '../store/useStore'

type MobileTab = 'markets' | 'chart' | 'map' | 'nexus' | 'chat'

const MOBILE_TABS: { key: MobileTab; icon: string; label: string }[] = [
  { key: 'markets', icon: '📊', label: 'Markets' },
  { key: 'chart',   icon: '📈', label: 'Chart'   },
  { key: 'map',     icon: '🌍', label: 'Map'     },
  { key: 'nexus',   icon: '⚡', label: 'NEXUS'   },
  { key: 'chat',    icon: '🧠', label: 'Chat'    },
]

export function MobileLayout() {
  const [activeTab, setActiveTab] = useState<MobileTab>('chart')
  const rightPanelTab    = useStore((s) => s.rightPanelTab)
  const setRightPanelTab = useStore((s) => s.setRightPanelTab)
  const alertRules       = useStore((s) => s.alertRules)
  const triggeredCount   = alertRules.filter((r) => r.triggered).length

  return (
    <div className="mobile-layout font-sans text-terminal-text select-none">
      {/* Ticker tape */}
      <header className="h-10 border-b border-terminal-border z-10">
        <TickerTape />
      </header>

      {/* Main content area */}
      <main className="mobile-content overflow-hidden">
        {activeTab === 'markets' && (
          <div className="h-full flex flex-col overflow-hidden">
            {/* Right panel tabs inside markets */}
            <div className="flex border-b border-terminal-border bg-terminal-surface flex-shrink-0">
              {(['news', 'country', 'alerts'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRightPanelTab(tab)}
                  className={`flex-1 py-1.5 font-mono text-2xs capitalize transition-colors relative ${
                    rightPanelTab === tab
                      ? 'text-terminal-accent border-b-2 border-terminal-accent'
                      : 'text-terminal-faint'
                  }`}
                >
                  {tab === 'alerts' && triggeredCount > 0 && (
                    <span className="absolute top-1 right-2 w-3 h-3 bg-terminal-accent rounded-full text-terminal-bg flex items-center justify-center" style={{ fontSize: '8px' }}>
                      {triggeredCount}
                    </span>
                  )}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-hidden">
              {rightPanelTab === 'news' && (
                <div className="h-full flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-hidden"><NewsFeed /></div>
                  <div className="h-48 border-t border-terminal-border overflow-hidden"><RatesPanel /></div>
                </div>
              )}
              {rightPanelTab === 'country' && <CountryPanel />}
              {rightPanelTab === 'alerts'  && (
                <div className="h-full flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto scrollbar-thin"><AlertsPanel /></div>
                  <div className="border-t border-terminal-border"><SettingsPanel /></div>
                </div>
              )}
              {(rightPanelTab === 'nexus' || rightPanelTab === 'chat') && <Watchlist />}
            </div>
          </div>
        )}
        {activeTab === 'chart' && (
          <div className="h-full overflow-hidden">
            <TradingChart />
          </div>
        )}
        {activeTab === 'map' && (
          <div className="h-full overflow-hidden">
            <WorldMap />
          </div>
        )}
        {activeTab === 'nexus' && (
          <div className="h-full overflow-hidden">
            <NexusPanel />
          </div>
        )}
        {activeTab === 'chat' && (
          <div className="h-full overflow-hidden">
            <ChatPanel />
          </div>
        )}
      </main>

      {/* Status bar */}
      <div className="h-8 border-t border-terminal-border">
        <StatusBar />
      </div>

      {/* Bottom nav */}
      <nav className="mobile-nav border-t border-terminal-border bg-terminal-surface flex-shrink-0">
        {MOBILE_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-col items-center justify-center gap-0.5 py-1.5 font-mono text-2xs transition-colors ${
              activeTab === tab.key ? 'text-terminal-accent' : 'text-terminal-faint'
            }`}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
