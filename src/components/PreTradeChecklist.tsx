import { useState } from 'react'

type Answer = 'YES' | 'NO' | null

const QUESTIONS: { id: string; text: string; critical: boolean }[] = [
  { id: 'jp10y',    text: 'Is JP10Y trending clearly today?',                                  critical: false },
  { id: 'curve',    text: 'Is the US yield curve expanding or compressing?',                  critical: false },
  { id: 'aligned',  text: 'Are bond moves aligned across sessions (Tokyo/London/NY)?',        critical: true  },
  { id: 'strong',   text: 'Are the fundamentally strong currencies clearly identified?',      critical: false },
  { id: 'weak',     text: 'Are the fundamentally weak currencies clearly identified?',        critical: false },
  { id: 'yields',   text: 'Are US 2Y and 10Y yields providing a clear directional signal?',  critical: true  },
  { id: 'regime',   text: 'Is the current regime (Risk-On / Risk-Off) confirmed?',            critical: true  },
  { id: 'flow',     text: 'Is the proposed trade direction aligned with dominant capital flow?', critical: true },
]

export function PreTradeChecklist() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({})

  const toggle = (id: string, val: Answer) => {
    setAnswers((prev) => ({ ...prev, [id]: prev[id] === val ? null : val }))
  }

  const criticalFails = QUESTIONS.filter((q) => q.critical && answers[q.id] === 'NO')
  const allAnswered   = QUESTIONS.every((q) => answers[q.id] !== null && answers[q.id] !== undefined)
  const passed        = allAnswered && criticalFails.length === 0

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="font-mono text-2xs text-terminal-accent tracking-widest uppercase">
        Pre-Trade Checklist (NEXUS §1.2)
      </div>

      <div className="flex flex-col gap-1.5">
        {QUESTIONS.map((q) => {
          const ans = answers[q.id]
          return (
            <div key={q.id} className={`flex items-start gap-2 p-2 rounded border ${
              q.critical ? 'border-terminal-border/50' : 'border-terminal-border/20'
            } bg-terminal-panel`}>
              <div className="flex-1">
                <div className="font-mono text-2xs text-terminal-dim flex items-center gap-1">
                  {q.critical && <span className="text-yellow-400" title="Critical">★</span>}
                  {q.text}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => toggle(q.id, 'YES')}
                  className={`px-2 py-0.5 font-mono text-2xs rounded border transition-all ${
                    ans === 'YES'
                      ? 'bg-terminal-up/20 border-terminal-up text-terminal-up'
                      : 'border-terminal-border/50 text-terminal-faint hover:border-terminal-up/50'
                  }`}
                >Y</button>
                <button
                  onClick={() => toggle(q.id, 'NO')}
                  className={`px-2 py-0.5 font-mono text-2xs rounded border transition-all ${
                    ans === 'NO'
                      ? 'bg-terminal-down/20 border-terminal-down text-terminal-down'
                      : 'border-terminal-border/50 text-terminal-faint hover:border-terminal-down/50'
                  }`}
                >N</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Result */}
      {allAnswered ? (
        <div className={`font-mono text-xs font-bold p-3 rounded border text-center ${
          passed
            ? 'bg-terminal-up/10 border-terminal-up text-terminal-up'
            : 'bg-terminal-down/10 border-terminal-down text-terminal-down'
        }`}>
          {passed
            ? '✓ CHECKLIST PASS — Proceed with defined edge'
            : `✗ CHECKLIST FAIL — ${criticalFails.length} critical issue${criticalFails.length > 1 ? 's' : ''}. Standing aside.`}
        </div>
      ) : (
        <div className="font-mono text-2xs text-terminal-faint text-center p-2">
          Answer all questions to get pass/fail verdict
        </div>
      )}

      <div className="font-mono text-2xs text-terminal-faint bg-terminal-panel rounded p-2 border border-terminal-border/30">
        <span className="text-terminal-accent">NEXUS Rule:</span> Any critical ★ FAIL = "Standing aside — macro unclear."
        No trade without confluence of bond signal + regime + capital flow alignment.
      </div>
    </div>
  )
}
