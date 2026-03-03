import { useStore } from '../store/useStore'
import { RegimePanel } from './RegimePanel'
import { TransmissionMap } from './TransmissionMap'
import { MonteCarloPanel } from './MonteCarloPanel'
import { VolatilityPanel } from './VolatilityPanel'
import { EconomicCalendar } from './EconomicCalendar'
import { PortfolioPanel } from './PortfolioPanel'
import { FuturesFlowPanel } from './FuturesFlowPanel'
import { YieldCurvePanel } from './YieldCurvePanel'
import { PreTradeChecklist } from './PreTradeChecklist'
import { EdgePlaybook } from './EdgePlaybook'
import { DailyLogPanel } from './DailyLogPanel'
import { OptionsPanel } from './OptionsPanel'
import { ResearchFeedPanel } from './ResearchFeedPanel'

const NEXUS_TABS: { key: string; label: string; icon: string }[] = [
  { key: 'regime',    label: 'Regime',    icon: '⚡' },
  { key: 'portfolio', label: 'Portfolio', icon: '💼' },
  { key: 'calendar',  label: 'Calendar',  icon: '📅' },
  { key: 'mc',        label: 'Monte Carlo', icon: '🎲' },
  { key: 'vol',       label: 'Volatility', icon: '📊' },
  { key: 'futures',   label: 'Futures',   icon: '📦' },
  { key: 'options',   label: 'Options',   icon: '🎰' },
  { key: 'yields',    label: 'Yields',    icon: '📈' },
  { key: 'transmit',  label: 'Transmit',  icon: '🔗' },
  { key: 'research',  label: 'Research',  icon: '🔬' },
  { key: 'checklist', label: 'Checklist', icon: '✅' },
  { key: 'edge',      label: 'Edge',      icon: '🎯' },
  { key: 'log',       label: 'Daily Log', icon: '📋' },
]

export function NexusPanel() {
  const nexusSubTab   = useStore((s) => s.nexusSubTab)
  const setNexusSubTab = useStore((s) => s.setNexusSubTab)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sub-tab bar */}
      <div className="flex overflow-x-auto border-b border-terminal-border flex-shrink-0 bg-terminal-surface scrollbar-none">
        {NEXUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setNexusSubTab(tab.key)}
            className={`flex-shrink-0 flex items-center gap-1 px-2 py-1.5 font-mono text-2xs transition-colors whitespace-nowrap ${
              nexusSubTab === tab.key
                ? 'text-terminal-accent border-b-2 border-terminal-accent'
                : 'text-terminal-faint hover:text-terminal-dim'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {nexusSubTab === 'regime'    && <RegimePanel />}
        {nexusSubTab === 'portfolio' && <PortfolioPanel />}
        {nexusSubTab === 'calendar'  && <EconomicCalendar />}
        {nexusSubTab === 'mc'        && <MonteCarloPanel />}
        {nexusSubTab === 'vol'       && <VolatilityPanel />}
        {nexusSubTab === 'futures'   && <FuturesFlowPanel />}
        {nexusSubTab === 'options'   && <OptionsPanel />}
        {nexusSubTab === 'yields'    && <YieldCurvePanel />}
        {nexusSubTab === 'transmit'  && <TransmissionMap />}
        {nexusSubTab === 'research'  && <ResearchFeedPanel />}
        {nexusSubTab === 'checklist' && <PreTradeChecklist />}
        {nexusSubTab === 'edge'      && <EdgePlaybook />}
        {nexusSubTab === 'log'       && <DailyLogPanel />}
      </div>
    </div>
  )
}
