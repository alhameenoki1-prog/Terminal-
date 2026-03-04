// Live TV panel — embeds YouTube live streams using YouTube Data API v3
// All channel IDs verified via vidIQ / Social Blade / Wikidata

import { useState, useEffect, useCallback, useRef } from 'react'
import { useStore } from '../store/useStore'
import { getLiveVideoId } from '../services/youtubeService'

// ── Verified channel IDs ──────────────────────────────────────────────────────
// Bloomberg Television  : https://vidiq.com/youtube-stats/channel/UCIALMKvObZNtJ6AmdCLP7Lg/
// CNBC Television       : https://vidiq.com/youtube-stats/channel/UCrp_UI8XtuYfpiqluWLD7Lw/
// Yahoo Finance         : https://vidiq.com/youtube-stats/channel/UCEAZeUIeJs0IjQiqTCdVSIg/
// Al Jazeera English    : https://vidiq.com/youtube-stats/channel/UCNye-wNBqNL5ZzHSJj3l8Bg/
// DW News               : https://www.wikidata.org/wiki/Q39055013
const CHANNELS = [
  {
    id:        'bloomberg',
    name:      'Bloomberg TV',
    channelId: 'UCIALMKvObZNtJ6AmdCLP7Lg',
    handle:    'BloombergTelevision',
    category:  'Markets',
    flag:      '📺',
  },
  {
    id:        'cnbc',
    name:      'CNBC Television',
    channelId: 'UCrp_UI8XtuYfpiqluWLD7Lw',
    handle:    'CNBCtelevision',
    category:  'Markets',
    flag:      '🇺🇸',
  },
  {
    id:        'yahoo',
    name:      'Yahoo Finance',
    channelId: 'UCEAZeUIeJs0IjQiqTCdVSIg',
    handle:    'YahooFinance',
    category:  'Markets',
    flag:      '📊',
  },
  {
    id:        'aljazeera',
    name:      'Al Jazeera',
    channelId: 'UCNye-wNBqNL5ZzHSJj3l8Bg',
    handle:    'AlJazeeraEnglish',
    category:  'Geopolitical',
    flag:      '🌐',
  },
  {
    id:        'dw',
    name:      'DW News',
    channelId: 'UCknLrEdhRCp1aegoMqRaCZg',
    handle:    'DWNews',
    category:  'Europe/Macro',
    flag:      '🇩🇪',
  },
] as const

type Channel = typeof CHANNELS[number]

type Status = 'idle' | 'loading' | 'live' | 'offline' | 'no_key' | 'invalid_key' | 'quota' | 'error'

const REFRESH_MS = 5 * 60_000 // 5 min

export function LiveFeedPanel() {
  const settings       = useStore((s) => s.settings)
  const apiKey         = settings.youtubeApiKey

  const [channel, setChannel]   = useState<Channel>(CHANNELS[0])
  const [videoId, setVideoId]   = useState<string | null>(null)
  const [status,  setStatus]    = useState<Status>('idle')
  const [muted,   setMuted]     = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchStream = useCallback(async (ch: Channel) => {
    setStatus('loading')
    setVideoId(null)
    const result = await getLiveVideoId(ch.channelId, apiKey)
    if (result.error === 'no_key')        { setStatus('no_key');      return }
    if (result.error === 'invalid_key')   { setStatus('invalid_key'); return }
    if (result.error === 'quota_exceeded'){ setStatus('quota');       return }
    if (result.error === 'api_error')     { setStatus('error');       return }
    if (!result.videoId)                  { setStatus('offline');     return }
    setVideoId(result.videoId)
    setStatus('live')
  }, [apiKey])

  // Fetch on mount + channel/key change, then poll every 5 min
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    fetchStream(channel)
    timerRef.current = setInterval(() => fetchStream(channel), REFRESH_MS)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [channel, fetchStream])

  const handleSelect = (ch: Channel) => {
    setChannel(ch)
  }

  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${muted ? 1 : 0}&rel=0&modestbranding=1`
    : null

  const ytChannelUrl = `https://www.youtube.com/@${channel.handle}/live`

  return (
    <div className="flex flex-col h-full overflow-hidden bg-terminal-bg">

      {/* Channel tabs */}
      <div className="flex-shrink-0 border-b border-terminal-border bg-terminal-surface overflow-x-auto scrollbar-none">
        <div className="flex min-w-max">
          {CHANNELS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => handleSelect(ch)}
              className={`flex items-center gap-1.5 px-3 py-2 font-mono text-2xs whitespace-nowrap border-b-2 transition-colors ${
                channel.id === ch.id
                  ? 'border-terminal-accent text-terminal-accent'
                  : 'border-transparent text-terminal-faint hover:text-terminal-dim'
              }`}
            >
              <span>{ch.flag}</span>
              <span>{ch.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Controls bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-1.5 border-b border-terminal-border/40 bg-terminal-panel">
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs text-terminal-faint">{channel.category}</span>
          {status === 'live' && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-2xs text-red-400">LIVE</span>
            </span>
          )}
          {status === 'loading' && (
            <span className="font-mono text-2xs text-terminal-faint animate-pulse">checking…</span>
          )}
          {status === 'offline' && (
            <span className="font-mono text-2xs text-terminal-faint">OFF AIR</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {status === 'live' && (
            <button
              onClick={() => setMuted((m) => !m)}
              className="font-mono text-xs text-terminal-faint hover:text-terminal-dim px-1.5 py-0.5 border border-terminal-border/40 rounded"
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? '🔇' : '🔊'}
            </button>
          )}
          <button
            onClick={() => fetchStream(channel)}
            className="font-mono text-2xs text-terminal-faint hover:text-terminal-dim px-1.5 py-0.5 border border-terminal-border/40 rounded"
          >
            ↺
          </button>
          <a
            href={ytChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-2xs text-terminal-faint/50 hover:text-terminal-accent px-1.5 py-0.5"
          >
            ↗ YT
          </a>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 relative overflow-hidden bg-black">

        {/* Live embed */}
        {status === 'live' && embedUrl && (
          <iframe
            key={`${videoId}-${muted}`}
            src={embedUrl}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`${channel.name} Live`}
          />
        )}

        {/* No API key */}
        {status === 'no_key' && (
          <StatusCard
            icon="🔑"
            title="YouTube API Key Required"
            body="Add a free YouTube Data API v3 key in the Alerts → Settings tab to watch live streams."
            hint="console.cloud.google.com → Create project → YouTube Data API v3 → API key"
            action={{ label: 'Watch on YouTube →', href: ytChannelUrl }}
          />
        )}

        {/* Invalid key */}
        {status === 'invalid_key' && (
          <StatusCard
            icon="⚠️"
            title="Invalid API Key"
            body="The YouTube API key in Settings is invalid or has restrictions set. Check the key and try again."
            action={{ label: 'Watch on YouTube →', href: ytChannelUrl }}
          />
        )}

        {/* Quota exceeded */}
        {status === 'quota' && (
          <StatusCard
            icon="⛔"
            title="Quota Exceeded"
            body="YouTube API daily quota (10,000 units) reached. Resets at midnight Pacific time."
            action={{ label: 'Watch on YouTube →', href: ytChannelUrl }}
          />
        )}

        {/* Offline */}
        {status === 'offline' && (
          <StatusCard
            icon="📴"
            title={`${channel.name} — Not Currently Live`}
            body="This channel has no active live stream right now. Check back during market hours."
            action={{ label: 'Open channel →', href: `https://www.youtube.com/@${channel.handle}` }}
          />
        )}

        {/* API error */}
        {status === 'error' && (
          <StatusCard
            icon="❌"
            title="API Error"
            body="Could not reach the YouTube API. Check your internet connection."
            action={{ label: 'Watch on YouTube →', href: ytChannelUrl }}
          />
        )}

        {/* Loading */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-2xs text-terminal-faint animate-pulse">
              Checking for live stream…
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Helper ────────────────────────────────────────────────────────────────────
function StatusCard({
  icon, title, body, hint, action,
}: {
  icon: string
  title: string
  body: string
  hint?: string
  action: { label: string; href: string }
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
      <div className="text-2xl">{icon}</div>
      <div className="font-mono text-xs text-terminal-text text-center">{title}</div>
      <div className="font-mono text-2xs text-terminal-faint/70 text-center leading-relaxed max-w-xs">
        {body}
      </div>
      {hint && (
        <div className="font-mono text-2xs text-terminal-faint/40 text-center leading-relaxed max-w-xs border border-terminal-border/30 rounded px-2 py-1">
          {hint}
        </div>
      )}
      <a
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-2xs text-terminal-accent border border-terminal-accent/40 px-3 py-1 rounded hover:bg-terminal-accent/10"
      >
        {action.label}
      </a>
    </div>
  )
}
