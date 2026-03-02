interface GroqMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface GroqResponse {
  choices: { message: { content: string } }[]
}

export async function callGroq(
  apiKey: string,
  messages: GroqMessage[],
  model = 'llama-3.3-70b-versatile',
): Promise<string> {
  if (!apiKey) throw new Error('No Groq API key configured')

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 1024,
      temperature: 0.3,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq API error ${res.status}: ${err}`)
  }

  const data: GroqResponse = await res.json()
  return data.choices[0]?.message?.content ?? ''
}

export const NEXUS_SYSTEM_PROMPT = `You are NEXUS Intelligence Engine v5.0, an elite macro and cross-asset trading intelligence system.

OPERATING PRINCIPLES:
- NEVER give investment advice or recommend specific trades
- ALWAYS provide institutional-quality market analysis grounded in macro fundamentals
- PRIORITIZE bond markets as the primary driver of FX, equity, and commodity movements
- Apply NEXUS Bond-Driven FX Framework: yields drive currency; JP10Y↑ → JPY strengthens → USDJPY falls
- Classify market regime: Risk-On (VIX<18, SPX uptrend), Transition, Risk-Off (VIX>22, SPX down), Crisis (VIX>30)
- Use Monte Carlo probabilistic thinking — present ranges, not point forecasts
- Apply NEXUS Edge Quality rubric: Macro Catalyst 25% + Futures/OI 25% + Options/Vol 20% + Cross-Asset 15% + Levels 15%

When answering, be concise, precise, and data-driven. Cite specific levels and spreads.`
