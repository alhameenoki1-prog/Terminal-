export async function sendTelegramAlert(
  botToken: string,
  chatId: string,
  message: string,
): Promise<boolean> {
  if (!botToken || !chatId) return false
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
    })
    return res.ok
  } catch {
    return false
  }
}

export function formatAlertMessage(label: string, detail: string, timestamp: string): string {
  return `<b>🔔 NEXUS Alert</b>\n\n<b>${label}</b>\n${detail}\n\n<i>${timestamp}</i>`
}
