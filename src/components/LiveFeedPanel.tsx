// NEXUS Live Feed — Bloomberg, CNBC, Reuters, Yahoo Finance, Al Jazeera, Fox Business
// Embeds public YouTube live streams (no API key required)
// Channels sourced from official public YouTube pages

const CHANNELS: {
  id: string
  name: string
  channelId: string
  flag: string
  category: string
  description: string
}[] = [
  {
    id:          'bloomberg',
    name:        'Bloomberg Television',
    channelId:   'UCIALMKvObZNtJ6AmdCLP7Lg',
    flag:        '📺',
    category:    'markets',
    description: 'Live market coverage, analysis & breaking news',
  },
  {
    id:          'cnbc',
    name:        'CNBC Television',
    channelId:   'UCvJJ_dzjViJCoLf5uKUTwoA',
    flag:        '🇺🇸',
    category:    'markets',
    description: 'US markets, earnings, Fed coverage',
  },
  {
    id:          'reuters',
    name:        'Reuters TV',
    channelId:   'UChqUTb7kYRX8-EiaN3XFrSQ',
    flag:        '🌐',
    category:    'macro',
    description: 'Global news & macroeconomic events',
  },
  {
    id:          'yahoo',
    name:        'Yahoo Finance',
    channelId:   'UCEAZeUIeJs0IjQiqTCdVSIg',
    flag:        '📊',
    category:    'markets',
    description: 'Markets open/close, earnings calls',
  },
  {
    id:          'aljazeera',
    name:        'Al Jazeera English',
    channelId:   'UCNye-wNBqNL5ZzHSJdrlvxA',
    flag:        '🇶🇦',
    category:    'geopolitical',
    description: 'Geopolitical & emerging market coverage',
  },
  {
    id:          'foxbusiness',
    name:        'Fox Business',
    channelId:   'UCF9IOB2TExg3QIBupFtBDxg',
    flag:        '🦊',
    category:    'markets',
    description: 'US business, trade & markets',
  },
  {
    id:          'wion',
    name:        'WION',
    channelId:   'UCpgDp31ND0GKMxEkGsZEGqg',
    flag:        '🌏',
    category:    'geopolitical',
    description: 'Asia-Pacific & global geopolitical news',
  },
  {
    id:          'dwnews',
    name:        'DW News',
    channelId:   'UCknLrEdhRCp1aegoMqRaCZg',
    flag:        '🇩🇪',
    category:    'macro',
    description: 'European macro, ECB, German/EU policy',
  },
]

import { useState, useRef, useCallback } from 'react'

export function LiveFeedPanel() {
  const [selected, setSelected] = useState(CHANNELS[0])
  const [muted, setMuted]       = useState(true)
  const [quality, setQuality]   = useState<'hd720' | 'medium' | 'small'>('medium')
  const [errored, setErrored]   = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const embedUrl = `https://www.youtube.com/embed/live_stream?channel=${selected.channelId}&autoplay=1&mute=${muted ? 1 : 0}&rel=0&modestbranding=1&vq=${quality}`

  const switchChannel = useCallback((ch: typeof CHANNELS[0]) => {
    setSelected(ch)
    setErrored(false)
  }, [])

  const CATEGORY_COLOR: Record<string, string> = {
    markets:      'text-terminal-up',
    macro:        'text-blue-400',
    geopolitical: 'text-orange-400',
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-terminal-bg">

      {/* Channel selector */}
      <div className="flex-shrink-0 border-b border-terminal-border bg-terminal-surface">
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex min-w-max">
            {CHANNELS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => switchChannel(ch)}
                className={`flex items-center gap-1.5 px-3 py-2 font-mono text-2xs whitespace-nowrap border-b-2 transition-colors ${
                  selected.id === ch.id
                    ? 'border-terminal-accent text-terminal-accent'
                    : 'border-transparent text-terminal-faint hover:text-terminal-dim'
                }`}
              >
                <span>{ch.flag}</span>
                <span>{ch.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Channel info bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-1.5 bg-terminal-panel border-b border-terminal-border/40">
        <div>
          <span className="font-mono text-xs text-terminal-text">{selected.name}</span>
          <span className={`ml-2 font-mono text-2xs ${CATEGORY_COLOR[selected.category] ?? 'text-terminal-faint'}`}>
            {selected.category.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Quality selector */}
          <div className="flex gap-0.5">
            {(['small', 'medium', 'hd720'] as const).map((q) => (
              <button
                key={q}
                onClick={() => { setQuality(q); setErrored(false) }}
                className={`px-1.5 py-0.5 font-mono text-2xs rounded ${quality === q ? 'bg-terminal-accent text-terminal-bg' : 'text-terminal-faint'}`}
              >
                {q === 'hd720' ? 'HD' : q === 'medium' ? '480p' : '360p'}
              </button>
            ))}
          </div>
          {/* Mute toggle */}
          <button
            onClick={() => { setMuted((m) => !m); setErrored(false) }}
            className="font-mono text-xs text-terminal-faint hover:text-terminal-dim px-1.5 py-0.5 border border-terminal-border/50 rounded"
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* Video embed */}
      <div className="flex-1 relative overflow-hidden bg-black">
        {errored ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="font-mono text-2xs text-terminal-faint text-center px-4">
              <div className="text-terminal-down mb-2">Stream unavailable</div>
              <div className="text-terminal-faint/60">
                {selected.name} may not be live right now, or YouTube is blocking the embed.
              </div>
            </div>
            <a
              href={`https://www.youtube.com/@${selected.id}/live`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-2xs text-terminal-accent border border-terminal-accent/40 px-3 py-1 rounded hover:bg-terminal-accent/10"
            >
              Open in YouTube →
            </a>
            <button
              onClick={() => setErrored(false)}
              className="font-mono text-2xs text-terminal-faint border border-terminal-border px-3 py-1 rounded"
            >
              Retry
            </button>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            key={`${selected.id}-${muted}-${quality}`}
            src={embedUrl}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`${selected.name} Live`}
            onError={() => setErrored(true)}
          />
        )}

        {/* Live badge */}
        {!errored && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600/90 rounded px-1.5 py-0.5 pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-2xs text-white font-bold">LIVE</span>
          </div>
        )}
      </div>

      {/* Description bar */}
      <div className="flex-shrink-0 px-3 py-1.5 border-t border-terminal-border/40 bg-terminal-panel">
        <div className="flex items-center justify-between">
          <span className="font-mono text-2xs text-terminal-faint/60">{selected.description}</span>
          <a
            href={`https://www.youtube.com/channel/${selected.channelId}/live`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-2xs text-terminal-faint/50 hover:text-terminal-accent"
          >
            youtube ↗
          </a>
        </div>
      </div>
    </div>
  )
}
