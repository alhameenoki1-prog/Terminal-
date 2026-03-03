import { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { callGroq, NEXUS_SYSTEM_PROMPT } from '../services/chatService'
import { fmt } from '../utils/format'
import { REGIME_LABEL } from '../services/regimeService'

export function ChatPanel() {
  const messages     = useStore((s) => s.chatMessages)
  const addMessage   = useStore((s) => s.addChatMessage)
  const clearChat    = useStore((s) => s.clearChat)
  const settings     = useStore((s) => s.settings)
  const tickers      = useStore((s) => s.tickers)
  const news         = useStore((s) => s.news)
  const regime       = useStore((s) => s.regime)
  const selectedCountry = useStore((s) => s.selectedCountry)

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function buildContext(): string {
    const snap = ['^GSPC', '^TNX', 'GC=F', 'USDJPY=X', 'BTCUSDT', '^VIX']
      .map((sym) => {
        const t = tickers[sym]
        if (!t) return null
        return `${sym}: ${fmt(t.price)} (${t.changePct24h > 0 ? '+' : ''}${t.changePct24h.toFixed(2)}%)`
      })
      .filter(Boolean)
      .join(' | ')

    const headlines = news.slice(0, 10)
      .map((n) => `• ${n.title} — ${n.source}`)
      .join('\n')

    const usdjpy = tickers['USDJPY=X']
    const jp10y = tickers['^JN10Y']
    const jp10yTrend = (jp10y?.changePct24h ?? 0) > 0 ? 'RISING' : 'FALLING'

    return `
LIVE MARKET CONTEXT:
Regime: ${REGIME_LABEL[regime.regime]} | Clarity: ${regime.clarity}/10 | Edge: ${regime.edge}/10 | Risk: ${regime.risk}/10
Posture: ${regime.posture}
JP10Y trend: ${jp10yTrend} → USDJPY bias: ${jp10yTrend === 'RISING' ? 'SHORT (JPY strengthens)' : 'LONG (JPY weakens)'}
Selected country: ${selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : 'None'}

Market Snapshot: ${snap}

Recent Headlines (top 10):
${headlines}
`
  }

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: text, timestamp: new Date().toISOString() }
    addMessage(userMsg)

    if (!settings.groqApiKey) {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠ No Groq API key configured. Go to the Alerts tab → Settings to add your key.',
        timestamp: new Date().toISOString(),
      })
      return
    }

    setLoading(true)
    try {
      const context = buildContext()
      const response = await callGroq(settings.groqApiKey, [
        { role: 'system', content: `${NEXUS_SYSTEM_PROMPT}\n\n${context}` },
        ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: text },
      ])
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-terminal-border bg-terminal-surface flex-shrink-0">
        <span className="font-mono text-2xs text-terminal-accent tracking-widest uppercase">
          NEXUS RAG Chat
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs text-terminal-faint">
            {settings.groqApiKey ? '🟢 Groq connected' : '🔴 No API key'}
          </span>
          <button
            onClick={clearChat}
            className="font-mono text-2xs text-terminal-faint hover:text-terminal-dim"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 flex flex-col gap-2">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">🧠</div>
            <div className="font-mono text-xs text-terminal-faint">NEXUS Intelligence Engine v5.0</div>
            <div className="font-mono text-2xs text-terminal-faint/60 mt-1">
              Ask about regime, yields, FX bias, macro setups
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded p-2 font-mono text-xs ${
              msg.role === 'user'
                ? 'bg-terminal-accent/20 border border-terminal-accent/30 text-terminal-text'
                : 'bg-terminal-panel border border-terminal-border/50 text-terminal-dim'
            }`}>
              {msg.role === 'assistant' && (
                <div className="text-terminal-accent text-2xs mb-1">NEXUS</div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-terminal-panel border border-terminal-border/50 rounded p-2">
              <span className="font-mono text-xs text-terminal-faint animate-pulse">NEXUS thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-2 border-t border-terminal-border flex-shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask NEXUS about regime, yields, FX bias..."
          className="flex-1 bg-terminal-panel border border-terminal-border rounded px-3 py-1.5 font-mono text-xs text-terminal-text placeholder:text-terminal-faint/40 focus:outline-none focus:border-terminal-accent"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="px-3 py-1.5 font-mono text-xs bg-terminal-accent text-terminal-bg rounded font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          →
        </button>
      </div>
    </div>
  )
}
