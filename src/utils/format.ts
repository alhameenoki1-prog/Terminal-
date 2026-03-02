export function fmt(price: number): string {
  if (price >= 10000) return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  if (price >= 100)   return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (price >= 1)     return price.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 4 })
  return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })
}

export function fmtCompact(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3)  return `$${(n / 1e3).toFixed(1)}K`
  return `$${n.toFixed(2)}`
}

export function pctClass(pct: number): string {
  if (pct > 0)  return 'text-terminal-up'
  if (pct < 0)  return 'text-terminal-down'
  return 'text-terminal-dim'
}

export function pctSign(pct: number): string {
  return pct >= 0 ? `+${pct.toFixed(2)}%` : `${pct.toFixed(2)}%`
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}
