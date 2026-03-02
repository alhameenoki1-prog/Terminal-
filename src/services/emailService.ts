import emailjs from '@emailjs/browser'
import type { AppSettings, RegimeScores } from '../types'

export interface DigestPayload {
  regime: RegimeScores
  marketSnapshot: { label: string; price: string; change: string }[]
  headlines: string[]
  aiSummary?: string
  triggeredAlerts: string[]
}

function buildHtmlDigest(payload: DigestPayload): string {
  const { regime, marketSnapshot, headlines, aiSummary, triggeredAlerts } = payload

  const regimeColors: Record<string, string> = {
    'risk-on':   '#10B981',
    'transition':'#F59E0B',
    'risk-off':  '#EF4444',
    'crisis':    '#DC2626',
  }
  const color = regimeColors[regime.regime] ?? '#9CA3AF'

  const marketRows = marketSnapshot
    .map(({ label, price, change }) => {
      const isUp = change.startsWith('+')
      const isDown = change.startsWith('-')
      const chColor = isUp ? '#10B981' : isDown ? '#EF4444' : '#9CA3AF'
      return `<tr>
        <td style="padding:3px 8px;font-family:monospace;font-size:12px;color:#F9FAFB;">${label}</td>
        <td style="padding:3px 8px;font-family:monospace;font-size:12px;color:#F9FAFB;text-align:right;">${price}</td>
        <td style="padding:3px 8px;font-family:monospace;font-size:12px;color:${chColor};text-align:right;">${change}</td>
      </tr>`
    })
    .join('')

  const headlineItems = headlines
    .slice(0, 8)
    .map((h) => `<li style="margin-bottom:4px;font-size:13px;color:#D1D5DB;">${h}</li>`)
    .join('')

  const alertItems = triggeredAlerts.length
    ? triggeredAlerts.map((a) => `<li style="color:#F59E0B;font-size:12px;font-family:monospace;">${a}</li>`).join('')
    : '<li style="color:#6B7280;font-size:12px;">No active alerts</li>'

  const now = new Date()
  const timeStr = now.toUTCString()

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#050A14;color:#F9FAFB;font-family:system-ui,sans-serif;padding:20px;max-width:700px;margin:0 auto;">
  <div style="border:1px solid #1F2937;border-radius:6px;overflow:hidden;">

    <!-- Header -->
    <div style="background:#0A0E1A;padding:16px 20px;border-bottom:1px solid #1F2937;">
      <div style="font-family:monospace;font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:0.1em;">NEXUS Intelligence Engine</div>
      <div style="font-size:18px;font-weight:bold;margin-top:4px;">Market Digest</div>
      <div style="font-family:monospace;font-size:11px;color:#6B7280;margin-top:2px;">${timeStr}</div>
    </div>

    <!-- Regime -->
    <div style="background:#0A0E1A;padding:12px 20px;border-bottom:1px solid #1F2937;">
      <div style="font-family:monospace;font-size:10px;color:#6B7280;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">NEXUS Regime</div>
      <span style="background:${color}22;color:${color};border:1px solid ${color}44;font-family:monospace;font-size:13px;font-weight:bold;padding:3px 10px;border-radius:4px;">
        ${regime.regime.toUpperCase()}
      </span>
      <div style="font-family:monospace;font-size:12px;color:#9CA3AF;margin-top:8px;">${regime.posture}</div>
      <div style="display:flex;gap:16px;margin-top:8px;">
        ${(['clarity','edge','risk','actionability'] as const).map((k) =>
          `<div><span style="font-size:10px;color:#6B7280;text-transform:uppercase;">${k}</span><br><span style="font-family:monospace;font-size:14px;font-weight:bold;">${regime[k as keyof RegimeScores]}</span></div>`
        ).join('')}
      </div>
    </div>

    <!-- Market Snapshot -->
    <div style="background:#0A0E1A;padding:12px 20px;border-bottom:1px solid #1F2937;">
      <div style="font-family:monospace;font-size:10px;color:#6B7280;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Market Snapshot</div>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left;font-family:monospace;font-size:10px;color:#6B7280;padding:3px 8px;border-bottom:1px solid #1F2937;">Asset</th>
            <th style="text-align:right;font-family:monospace;font-size:10px;color:#6B7280;padding:3px 8px;border-bottom:1px solid #1F2937;">Price</th>
            <th style="text-align:right;font-family:monospace;font-size:10px;color:#6B7280;padding:3px 8px;border-bottom:1px solid #1F2937;">24H</th>
          </tr>
        </thead>
        <tbody>${marketRows}</tbody>
      </table>
    </div>

    <!-- Alerts -->
    <div style="background:#0A0E1A;padding:12px 20px;border-bottom:1px solid #1F2937;">
      <div style="font-family:monospace;font-size:10px;color:#6B7280;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Active Alerts</div>
      <ul style="margin:0;padding-left:16px;">${alertItems}</ul>
    </div>

    <!-- Headlines -->
    <div style="background:#0A0E1A;padding:12px 20px;${aiSummary ? 'border-bottom:1px solid #1F2937;' : ''}">
      <div style="font-family:monospace;font-size:10px;color:#6B7280;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Key Headlines</div>
      <ul style="margin:0;padding-left:16px;">${headlineItems}</ul>
    </div>

    ${aiSummary ? `
    <!-- AI Summary -->
    <div style="background:#0A0E1A;padding:12px 20px;">
      <div style="font-family:monospace;font-size:10px;color:#6B7280;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">NEXUS AI Analysis</div>
      <div style="font-size:13px;color:#D1D5DB;line-height:1.6;">${aiSummary.replace(/\n/g, '<br>')}</div>
    </div>
    ` : ''}
  </div>
  <div style="text-align:center;font-family:monospace;font-size:10px;color:#374151;margin-top:12px;">
    NEXUS Intelligence Engine · Automated Digest
  </div>
</body>
</html>
  `.trim()
}

export async function sendEmailDigest(
  settings: Pick<AppSettings, 'emailjsServiceId' | 'emailjsTemplateId' | 'emailjsPublicKey' | 'digestEmail'>,
  payload: DigestPayload
): Promise<{ ok: boolean; error?: string }> {
  const { emailjsServiceId, emailjsTemplateId, emailjsPublicKey, digestEmail } = settings

  if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey || !digestEmail) {
    return { ok: false, error: 'EmailJS not configured — fill in all fields in Settings' }
  }

  try {
    emailjs.init({ publicKey: emailjsPublicKey })

    const html = buildHtmlDigest(payload)

    const now = new Date()
    const subject = `NEXUS Digest — ${payload.regime.regime.toUpperCase()} | ${now.toUTCString()}`

    await emailjs.send(emailjsServiceId, emailjsTemplateId, {
      to_email:  digestEmail,
      subject,
      html_body: html,
      // Plain text fallback
      regime:     payload.regime.regime.toUpperCase(),
      posture:    payload.regime.posture,
      headlines:  payload.headlines.slice(0, 5).join('\n'),
      alerts:     payload.triggeredAlerts.join('\n') || 'None',
      ai_summary: payload.aiSummary ?? '',
    })

    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

// Convert frequency setting to interval in ms (0 = off)
export function digestIntervalMs(freq: AppSettings['digestFrequency']): number {
  switch (freq) {
    case 'hourly': return 60 * 60_000
    case '2h':     return 2 * 60 * 60_000
    case '6h':     return 6 * 60 * 60_000
    case 'daily':  return 24 * 60 * 60_000
    case 'weekly': return 7 * 24 * 60 * 60_000
    case 'off':
    default:       return 0
  }
}
