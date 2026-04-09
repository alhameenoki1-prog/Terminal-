import emailjs from '@emailjs/browser'
import type { AppSettings, RegimeScores } from '../types'

export interface DigestPayload {
  regime: RegimeScores
  marketSnapshot: { label: string; price: string; change: string }[]
  headlines: string[]
  aiSummary?: string
  triggeredAlerts: string[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}

function formatTime(d: Date): string {
  return d.toUTCString()
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Escape HTML entities to prevent injection in user-supplied content
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ─── Score bar (table-based — works in Outlook) ───────────────────────────────

function scoreBar(label: string, val: number): string {
  const clamped   = Math.max(0, Math.min(100, Math.round(val)))
  const remainder = 100 - clamped
  const barColor  = clamped >= 70 ? '#10B981' : clamped >= 40 ? '#F59E0B' : '#EF4444'

  // Two-cell table trick: filled cell width% + empty cell = full-width bar
  const filledCell = clamped > 0
    ? `<td width="${clamped}%" height="4" bgcolor="${barColor}" style="font-size:0;line-height:0;height:4px;"></td>`
    : ''
  const emptyCell  = remainder > 0
    ? `<td width="${remainder}%" height="4" bgcolor="#1F2937" style="font-size:0;line-height:0;height:4px;"></td>`
    : ''

  return `
  <tr>
    <td width="100" style="font-family:'Courier New',Courier,monospace;font-size:10px;color:#6B7280;text-transform:uppercase;letter-spacing:0.08em;padding:4px 10px 4px 0;vertical-align:middle;white-space:nowrap;">${esc(label)}</td>
    <td style="vertical-align:middle;padding:4px 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#1F2937;border-radius:2px;">
        <tr>${filledCell}${emptyCell}</tr>
      </table>
    </td>
    <td width="30" style="text-align:right;font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:600;color:#F9FAFB;padding-left:10px;vertical-align:middle;">${clamped}</td>
  </tr>`
}

// ─── HTML digest builder ──────────────────────────────────────────────────────

function buildHtmlDigest(payload: DigestPayload): string {
  const { regime, marketSnapshot, headlines, aiSummary, triggeredAlerts } = payload

  // Regime color palette
  const regimeColor: Record<string, string> = {
    'risk-on':    '#10B981',
    'transition': '#F59E0B',
    'risk-off':   '#EF4444',
    'crisis':     '#DC2626',
  }
  const color      = regimeColor[regime.regime] ?? '#9CA3AF'
  const colorAlpha = color + '22'   // ~13% opacity bg
  const colorBorder= color + '55'   // ~33% opacity border

  const now      = new Date()
  const timeStr  = formatTime(now)
  const dateStr  = formatDate(now)

  // ── Market snapshot rows (zebra-striped) ───────────────────────────────────
  const marketRows = marketSnapshot
    .map(({ label, price, change }, i) => {
      const isUp    = change.startsWith('+')
      const isDown  = change.startsWith('-')
      const chColor = isUp ? '#10B981' : isDown ? '#EF4444' : '#9CA3AF'
      const rowBg   = i % 2 === 0 ? '#0A0E1A' : '#0D1321'
      return `
      <tr bgcolor="${rowBg}">
        <td style="padding:8px 14px;font-family:'Courier New',Courier,monospace;font-size:12px;color:#E5E7EB;border-bottom:1px solid #151C2C;">${esc(label)}</td>
        <td style="padding:8px 14px;font-family:'Courier New',Courier,monospace;font-size:12px;color:#F9FAFB;text-align:right;border-bottom:1px solid #151C2C;">${esc(price)}</td>
        <td style="padding:8px 14px;font-family:'Courier New',Courier,monospace;font-size:12px;color:${chColor};text-align:right;font-weight:600;border-bottom:1px solid #151C2C;">${esc(change)}</td>
      </tr>`
    })
    .join('')

  // ── Headline rows ──────────────────────────────────────────────────────────
  const headlineRows = headlines
    .slice(0, 8)
    .map((h, i) => `
    <tr>
      <td width="24" style="padding:5px 8px 5px 0;font-family:'Courier New',Courier,monospace;font-size:10px;color:#374151;vertical-align:top;padding-top:7px;">${String(i + 1).padStart(2, '0')}</td>
      <td style="padding:5px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,Helvetica,sans-serif;font-size:13px;color:#D1D5DB;line-height:1.55;">${esc(h)}</td>
    </tr>`)
    .join('')

  // ── Alert rows ─────────────────────────────────────────────────────────────
  const alertRows = triggeredAlerts.length
    ? triggeredAlerts.map((a) => `
    <tr>
      <td width="16" style="padding:4px 8px 4px 0;vertical-align:top;padding-top:7px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td width="7" height="7" bgcolor="#F59E0B" style="border-radius:50%;font-size:0;line-height:0;"></td>
        </tr></table>
      </td>
      <td style="padding:4px 0;font-family:'Courier New',Courier,monospace;font-size:12px;color:#FCD34D;line-height:1.45;">${esc(a)}</td>
    </tr>`).join('')
    : `<tr><td colspan="2" style="padding:4px 0;font-family:'Courier New',Courier,monospace;font-size:12px;color:#374151;">No active alerts at this time.</td></tr>`

  // ── Score bars ─────────────────────────────────────────────────────────────
  const scoreRows = (
    ['clarity', 'edge', 'risk', 'actionability'] as const
  )
    .map((k) => scoreBar(k, regime[k]))
    .join('')

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>NEXUS Market Digest</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    body,table,td,a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table,td        { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    body            { margin:0 !important; padding:0 !important; background:#050A14; }
  </style>
</head>
<body style="margin:0;padding:0;background:#050A14;">

  <!-- ═══ Preheader (visible only in inbox preview, hidden in body) ═══════ -->
  <div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#050A14;mso-hide:all;">
    ${esc(capitalize(regime.regime))} regime &bull; ${esc(dateStr)} &bull; Clarity ${regime.clarity} &bull; Edge ${regime.edge}
    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <!-- ═══ Outer wrapper ════════════════════════════════════════════════════ -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#050A14">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- ═══ Container (600px) ════════════════════════════════════════ -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px;width:100%;background:#0A0E1A;border:1px solid #1E2840;border-radius:8px;overflow:hidden;">

          <!-- Accent bar — gradient for modern clients, solid for Outlook -->
          <!--[if mso]>
          <tr><td height="3" bgcolor="#2563EB" style="font-size:0;line-height:0;">&nbsp;</td></tr>
          <![endif]-->
          <!--[if !mso]><!-->
          <tr>
            <td height="3" style="font-size:0;line-height:0;background:linear-gradient(90deg,#2563EB 0%,#7C3AED 55%,#059669 100%);">&nbsp;</td>
          </tr>
          <!--<![endif]-->

          <!-- ─── Header ─────────────────────────────────────────────── -->
          <tr>
            <td style="padding:28px 32px 22px;border-bottom:1px solid #1E2840;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle">
                    <div style="font-family:'Courier New',Courier,monospace;font-size:9px;color:#374151;text-transform:uppercase;letter-spacing:0.2em;">NEXUS Intelligence Engine</div>
                    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,Helvetica,sans-serif;font-size:26px;font-weight:700;color:#F9FAFB;margin-top:6px;letter-spacing:-0.02em;line-height:1.2;">Market Digest</div>
                    <div style="font-family:'Courier New',Courier,monospace;font-size:11px;color:#4B5563;margin-top:6px;">${esc(timeStr)}</div>
                  </td>
                  <td valign="middle" align="right" style="padding-left:20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td bgcolor="#0D1730" style="border:1px solid #1E3A8A;border-radius:6px;padding:9px 14px;text-align:center;">
                          <div style="font-family:'Courier New',Courier,monospace;font-size:18px;font-weight:700;color:#3B82F6;letter-spacing:0.12em;">NX</div>
                          <div style="font-family:'Courier New',Courier,monospace;font-size:8px;color:#1E40AF;letter-spacing:0.18em;margin-top:2px;">NEXUS</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ─── Regime ─────────────────────────────────────────────── -->
          <tr>
            <td bgcolor="#0D1321" style="padding:22px 32px;border-bottom:1px solid #1E2840;">
              <div style="font-family:'Courier New',Courier,monospace;font-size:9px;color:#374151;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:14px;">Market Regime</div>

              <!-- Regime badge -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="${colorAlpha}" style="border:1px solid ${colorBorder};border-radius:4px;padding:5px 14px;">
                    <span style="font-family:'Courier New',Courier,monospace;font-size:13px;font-weight:700;color:${color};letter-spacing:0.1em;">${esc(regime.regime.toUpperCase())}</span>
                  </td>
                </tr>
              </table>

              <!-- Posture -->
              <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#9CA3AF;margin-top:12px;line-height:1.55;">${esc(regime.posture)}</div>

              <!-- Score bars -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
                ${scoreRows}
              </table>
            </td>
          </tr>

          <!-- ─── Market Snapshot ────────────────────────────────────── -->
          <tr>
            <td style="padding:22px 32px;border-bottom:1px solid #1E2840;">
              <div style="font-family:'Courier New',Courier,monospace;font-size:9px;color:#374151;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:14px;">Market Snapshot</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                style="border:1px solid #1E2840;border-radius:4px;overflow:hidden;">
                <thead>
                  <tr bgcolor="#111827">
                    <th style="text-align:left;font-family:'Courier New',Courier,monospace;font-size:9px;color:#4B5563;text-transform:uppercase;letter-spacing:0.12em;padding:9px 14px;border-bottom:1px solid #1E2840;font-weight:600;">Asset</th>
                    <th style="text-align:right;font-family:'Courier New',Courier,monospace;font-size:9px;color:#4B5563;text-transform:uppercase;letter-spacing:0.12em;padding:9px 14px;border-bottom:1px solid #1E2840;font-weight:600;">Price</th>
                    <th style="text-align:right;font-family:'Courier New',Courier,monospace;font-size:9px;color:#4B5563;text-transform:uppercase;letter-spacing:0.12em;padding:9px 14px;border-bottom:1px solid #1E2840;font-weight:600;">24H</th>
                  </tr>
                </thead>
                <tbody>${marketRows}</tbody>
              </table>
            </td>
          </tr>

          <!-- ─── Active Alerts ──────────────────────────────────────── -->
          <tr>
            <td bgcolor="#0D1321" style="padding:22px 32px;border-bottom:1px solid #1E2840;">
              <div style="font-family:'Courier New',Courier,monospace;font-size:9px;color:#374151;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:14px;">Active Alerts</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${alertRows}
              </table>
            </td>
          </tr>

          <!-- ─── Key Headlines ──────────────────────────────────────── -->
          <tr>
            <td style="padding:22px 32px;${aiSummary ? 'border-bottom:1px solid #1E2840;' : ''}">
              <div style="font-family:'Courier New',Courier,monospace;font-size:9px;color:#374151;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:14px;">Key Headlines</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${headlineRows}
              </table>
            </td>
          </tr>

          ${aiSummary ? `
          <!-- ─── AI Analysis ────────────────────────────────────────── -->
          <tr>
            <td bgcolor="#0D1321" style="padding:22px 32px;">
              <div style="font-family:'Courier New',Courier,monospace;font-size:9px;color:#374151;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:14px;">NEXUS AI Analysis</div>
              <!-- Styled blockquote using table border trick -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="3" bgcolor="#1D4ED8" style="border-radius:2px;font-size:0;line-height:0;"></td>
                  <td style="padding:10px 16px;">
                    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#D1D5DB;line-height:1.7;">${esc(aiSummary).replace(/\n/g, '<br>')}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}

        </table>
        <!-- ═══ END Container ════════════════════════════════════════════ -->

        <!-- ═══ Footer ═══════════════════════════════════════════════════ -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px;width:100%;margin-top:20px;">
          <tr>
            <td style="padding:0 8px;text-align:center;">
              <div style="font-family:'Courier New',Courier,monospace;font-size:10px;color:#1F2937;line-height:1.8;">
                NEXUS Intelligence Engine &bull; Automated Market Digest<br>
                You are receiving this because digest alerts are enabled in your settings.<br>
                To stop, set Digest Frequency to &ldquo;Off&rdquo; in the Settings panel.
              </div>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`.trim()
}

// ─── Plain-text fallback ──────────────────────────────────────────────────────

function buildPlainTextDigest(payload: DigestPayload): string {
  const { regime, marketSnapshot, headlines, aiSummary, triggeredAlerts } = payload
  const now     = new Date()
  const dateStr = formatDate(now)
  const timeStr = formatTime(now)

  const snapshotLines = marketSnapshot
    .map(({ label, price, change }) => `  ${label.padEnd(16)} ${price.padStart(12)}  ${change}`)
    .join('\n')

  const headlineLines = headlines
    .slice(0, 8)
    .map((h, i) => `  ${String(i + 1).padStart(2, '0')}. ${h}`)
    .join('\n')

  const alertLines = triggeredAlerts.length
    ? triggeredAlerts.map((a) => `  • ${a}`).join('\n')
    : '  No active alerts.'

  const aiSection = aiSummary
    ? `\n\n── NEXUS AI ANALYSIS ──────────────────────────────────\n${aiSummary}`
    : ''

  return [
    `NEXUS MARKET DIGEST`,
    `${dateStr}  ·  ${timeStr}`,
    ``,
    `── MARKET REGIME ──────────────────────────────────────`,
    `  Regime:         ${regime.regime.toUpperCase()}`,
    `  Posture:        ${regime.posture}`,
    `  Clarity:        ${regime.clarity}`,
    `  Edge:           ${regime.edge}`,
    `  Risk:           ${regime.risk}`,
    `  Actionability:  ${regime.actionability}`,
    ``,
    `── MARKET SNAPSHOT ────────────────────────────────────`,
    snapshotLines,
    ``,
    `── ACTIVE ALERTS ──────────────────────────────────────`,
    alertLines,
    ``,
    `── KEY HEADLINES ──────────────────────────────────────`,
    headlineLines,
    aiSection,
    ``,
    `──────────────────────────────────────────────────────`,
    `NEXUS Intelligence Engine · Automated Digest`,
    `To disable, set Digest Frequency to Off in Settings.`,
  ].join('\n')
}

// ─── Subject line ─────────────────────────────────────────────────────────────

function buildSubject(payload: DigestPayload): string {
  const regime  = capitalize(payload.regime.regime)
  const dateStr = formatDate(new Date())
  // Avoid spam triggers: no ALL-CAPS, no exclamation marks, descriptive prefix
  return `NEXUS Market Digest — ${regime} | ${dateStr}`
}

// ─── Public API ───────────────────────────────────────────────────────────────

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

    const html      = buildHtmlDigest(payload)
    const text      = buildPlainTextDigest(payload)
    const subject   = buildSubject(payload)

    await emailjs.send(emailjsServiceId, emailjsTemplateId, {
      to_email:   digestEmail,
      subject,
      html_body:  html,
      text_body:  text,
      // Individual fields for templates that reference them directly
      regime:        payload.regime.regime.toUpperCase(),
      posture:       payload.regime.posture,
      clarity:       String(payload.regime.clarity),
      edge:          String(payload.regime.edge),
      risk:          String(payload.regime.risk),
      actionability: String(payload.regime.actionability),
      headlines:     payload.headlines.slice(0, 5).join('\n'),
      alerts:        payload.triggeredAlerts.join('\n') || 'None',
      ai_summary:    payload.aiSummary ?? '',
    })

    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

// ─── Digest interval ─────────────────────────────────────────────────────────

export function digestIntervalMs(freq: AppSettings['digestFrequency']): number {
  switch (freq) {
    case 'hourly': return     60 * 60_000
    case '2h':     return  2 * 60 * 60_000
    case '6h':     return  6 * 60 * 60_000
    case 'daily':  return 24 * 60 * 60_000
    case 'weekly': return  7 * 24 * 60 * 60_000
    case 'off':
    default:       return 0
  }
}
