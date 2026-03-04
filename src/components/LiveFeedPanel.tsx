// Live TV — Direct HLS streams + YouTube IFrame API fallback
// Architecture mirrors worldmonitor (github.com/koala73/worldmonitor)
// HLS URLs sourced from worldmonitor/src/components/LiveNewsPanel.ts
// YouTube fallback video IDs sourced from worldmonitor channel definitions

import { useState, useEffect, useRef, useCallback } from 'react'
import Hls from 'hls.js'
import { useStore } from '../store/useStore'
import { getLiveVideoId } from '../services/youtubeService'

// ─── YouTube IFrame API ───────────────────────────────────────────────────────

interface YTPlayer {
  mute(): void
  unMute(): void
  playVideo(): void
  pauseVideo(): void
  destroy(): void
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId?: string
          playerVars?: Record<string, string | number>
          events?: {
            onReady?: (e: { target: YTPlayer }) => void
            onError?: (e: { data: number }) => void
          }
        }
      ) => YTPlayer
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

let _ytLoaded = false
let _ytReady  = false
const _ytCbs: Array<() => void> = []

function ensureYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (_ytReady) { resolve(); return }
    _ytCbs.push(resolve)
    if (_ytLoaded) return
    _ytLoaded = true
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      _ytReady = true
      _ytCbs.splice(0).forEach((cb) => cb())
    }
  })
}

// ─── Channel data ─────────────────────────────────────────────────────────────
// HLS URLs from worldmonitor/src/components/LiveNewsPanel.ts (DIRECT_HLS_MAP)
// fallbackVideoId from worldmonitor channel definitions
// channelId verified via vidIQ / Social Blade / Wikidata

interface Channel {
  id:              string
  name:            string
  flag:            string
  category:        string
  hlsUrl?:         string   // direct m3u8 — preferred, no API key needed
  channelId?:      string   // YouTube channel ID for live-lookup via YT API
  fallbackVideoId: string   // always-valid YT video ID (worldmonitor verified)
  useFallbackOnly?: boolean // skip API lookup (some channels block it)
}

const CHANNELS: readonly Channel[] = [
  // ── Markets ─────────────────────────────────────────────────────────────────
  {
    id: 'bloomberg', name: 'Bloomberg', flag: '📺', category: 'Markets',
    channelId:       'UCIALMKvObZNtJ6AmdCLP7Lg',
    fallbackVideoId: 'iEpJwprxDdk',
  },
  {
    id: 'cnbc', name: 'CNBC', flag: '🇺🇸', category: 'Markets',
    channelId:       'UCrp_UI8XtuYfpiqluWLD7Lw',
    fallbackVideoId: '9NyxcX3rhQs',
  },
  {
    id: 'yahoo', name: 'Yahoo Finance', flag: '📊', category: 'Markets',
    channelId:       'UCEAZeUIeJs0IjQiqTCdVSIg',
    fallbackVideoId: 'KQp-e_XQnDE',
  },
  // ── Global ──────────────────────────────────────────────────────────────────
  {
    id: 'sky', name: 'Sky News', flag: '🇬🇧', category: 'Global',
    hlsUrl:          'https://linear901-oo-hls0-prd-gtm.delivery.skycdp.com/17501/sde-fast-skynews/master.m3u8',
    fallbackVideoId: 'uvviIF4725I',
  },
  {
    id: 'bbc-news', name: 'BBC News', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', category: 'Global',
    hlsUrl:          'https://vs-hls-push-uk.live.fastly.md.bbci.co.uk/x=4/i=urn:bbc:pips:service:bbc_news_channel_hd/iptv_hd_abr_v1.m3u8',
    fallbackVideoId: 'bjgQzJzCZKs',
  },
  {
    id: 'cnn', name: 'CNN', flag: '🇺🇸', category: 'Global',
    fallbackVideoId: 'w_Ma8oQLmSM',
  },
  {
    id: 'aljazeera', name: 'Al Jazeera', flag: '🌐', category: 'Global',
    channelId:       'UCNye-wNBqNL5ZzHSJj3l8Bg',
    fallbackVideoId: 'gCNeDWCI0vo',
    useFallbackOnly: true,
  },
  {
    id: 'cbs-news', name: 'CBS News', flag: '🇺🇸', category: 'Global',
    hlsUrl:          'https://cbsn-us.cbsnstream.cbsnews.com/out/v1/55a8648e8f134e82a470f83d562deeca/master.m3u8',
    fallbackVideoId: 'R9L8sDK8iEc',
  },
  // ── Europe ──────────────────────────────────────────────────────────────────
  {
    id: 'euronews', name: 'Euronews', flag: '🇪🇺', category: 'Europe',
    hlsUrl:          'https://dash4.antik.sk/live/test_euronews/playlist.m3u8',
    fallbackVideoId: 'pykpO5kQJ98',
  },
  {
    id: 'dw', name: 'DW News', flag: '🇩🇪', category: 'Europe',
    hlsUrl:          'https://dwamdstream103.akamaized.net/hls/live/2015526/dwstream103/master.m3u8',
    channelId:       'UCknLrEdhRCp1aegoMqRaCZg',
    fallbackVideoId: 'LuKwFajn37U',
  },
  {
    id: 'france24', name: 'France 24', flag: '🇫🇷', category: 'Europe',
    hlsUrl:          'https://amg00106-france24-france24-samsunguk-qvpp8.amagi.tv/playlist/amg00106-france24-france24-samsunguk/playlist.m3u8',
    fallbackVideoId: 'u9foWyMSETk',
  },
  // ── ME / Asia ────────────────────────────────────────────────────────────────
  {
    id: 'alarabiya', name: 'Al Arabiya', flag: '🇸🇦', category: 'ME/Asia',
    hlsUrl:          'https://live.alarabiya.net/alarabiapublish/alarabiya.smil/playlist.m3u8',
    fallbackVideoId: 'n7eQejkXbnM',
    useFallbackOnly: true,
  },
  {
    id: 'trt-world', name: 'TRT World', flag: '🇹🇷', category: 'ME/Asia',
    hlsUrl:          'https://tv-trtworld.medya.trt.com.tr/master.m3u8',
    fallbackVideoId: 'ABfFhWzWs0s',
  },
  {
    id: 'nhk-world', name: 'NHK World', flag: '🇯🇵', category: 'ME/Asia',
    hlsUrl:          'https://nhkwlive-ojp.akamaized.net/hls/live/2003459/nhkwlive-ojp-en/index_4M.m3u8',
    fallbackVideoId: 'f0lYfG_vY_U',
  },
]

// ─── HLS Player ───────────────────────────────────────────────────────────────

function HlsPlayer({
  url, muted, onError,
}: {
  url: string; muted: boolean; onError: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef   = useRef<Hls | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const cleanup = () => {
      hlsRef.current?.destroy()
      hlsRef.current = null
      video.removeAttribute('src')
      video.load()
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari — native HLS
      video.src = url
      video.setAttribute('referrerpolicy', 'no-referrer')
      video.muted = true
      video.play().then(() => { if (!muted) video.muted = false }).catch(() => {})
    } else if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true })
      hlsRef.current = hls
      hls.loadSource(url)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.muted = true
        video.play().then(() => { if (!muted) video.muted = false }).catch(() => {})
      })
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) { cleanup(); onError() }
      })
    } else {
      onError()
      return
    }

    return cleanup
  }, [url]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted
  }, [muted])

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover"
      playsInline
      autoPlay
      muted
    />
  )
}

// ─── YouTube IFrame-API Player ────────────────────────────────────────────────

function YoutubePlayer({
  videoId, muted, onError,
}: {
  videoId: string; muted: boolean; onError: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef    = useRef<YTPlayer | null>(null)

  useEffect(() => {
    let cancelled = false

    ensureYouTubeAPI().then(() => {
      if (cancelled || !containerRef.current || !window.YT) return

      const player = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1, mute: 1, rel: 0,
          playsinline: 1, enablejsapi: 1, modestbranding: 1,
        },
        events: {
          onReady: (e) => {
            if (!muted) e.target.unMute()
            e.target.playVideo()
          },
          onError: () => onError(),
        },
      })
      playerRef.current = player
    })

    return () => {
      cancelled = true
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [videoId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const p = playerRef.current
    if (!p) return
    muted ? p.mute() : p.unMute()
  }, [muted])

  return <div ref={containerRef} className="w-full h-full" />
}

// ─── Main panel ───────────────────────────────────────────────────────────────

type Mode = 'loading' | 'hls' | 'yt' | 'error'

const IDLE_MS = 5 * 60_000 // 5 minutes — auto-pause like worldmonitor

export function LiveFeedPanel() {
  const apiKey = useStore((s) => s.settings.youtubeApiKey)

  const [channel, setChannel] = useState<Channel>(CHANNELS[0])
  const [mode,    setMode]    = useState<Mode>('loading')
  const [videoId, setVideoId] = useState<string | null>(null)
  const [muted,   setMuted]   = useState(true)
  const [badge,   setBadge]   = useState<'hls' | 'yt' | null>(null)

  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Idle auto-pause (5 min, like worldmonitor) ────────────────────────────
  const resetIdle = useCallback(() => {
    if (idleRef.current) clearTimeout(idleRef.current)
    idleRef.current = setTimeout(() => {
      setMode((m) => (m === 'hls' || m === 'yt' ? 'loading' : m))
    }, IDLE_MS)
  }, [])

  useEffect(() => {
    const evs = ['mousedown', 'keydown', 'touchstart', 'scroll'] as const
    evs.forEach((ev) => window.addEventListener(ev, resetIdle, { passive: true }))
    resetIdle()
    return () => {
      evs.forEach((ev) => window.removeEventListener(ev, resetIdle))
      if (idleRef.current) clearTimeout(idleRef.current)
    }
  }, [resetIdle])

  // Pause when tab is hidden (Page Visibility API)
  useEffect(() => {
    const handler = () => {
      if (document.hidden) setMode((m) => (m === 'hls' || m === 'yt' ? 'loading' : m))
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [])

  // ── Load channel ──────────────────────────────────────────────────────────
  const loadYouTube = useCallback(async (ch: Channel) => {
    setMode('loading')
    setVideoId(null)
    setBadge(null)

    let vid = ch.fallbackVideoId

    // Optional: upgrade to current live ID if YT API key is set
    if (!ch.useFallbackOnly && ch.channelId && apiKey) {
      const result = await getLiveVideoId(ch.channelId, apiKey)
      if (result.videoId) vid = result.videoId
    }

    setVideoId(vid)
    setBadge('yt')
    setMode('yt')
  }, [apiKey])

  const loadChannel = useCallback((ch: Channel) => {
    setMode('loading')
    setVideoId(null)
    setBadge(null)

    if (ch.hlsUrl) {
      // Try HLS first — HlsPlayer will call onError if it fails
      setBadge('hls')
      setMode('hls')
    } else {
      loadYouTube(ch)
    }
  }, [loadYouTube])

  const handleHlsError = useCallback(() => {
    loadYouTube(channel)
  }, [channel, loadYouTube])

  const handleYtError = useCallback(() => setMode('error'), [])

  useEffect(() => {
    loadChannel(channel)
  }, [channel]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col h-full overflow-hidden bg-terminal-bg"
      onMouseMove={resetIdle}
    >

      {/* Channel tab bar */}
      <div className="flex-shrink-0 border-b border-terminal-border bg-terminal-surface overflow-x-auto scrollbar-none">
        <div className="flex min-w-max">
          {CHANNELS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setChannel(ch)}
              className={`flex items-center gap-1 px-2.5 py-2 font-mono text-2xs whitespace-nowrap border-b-2 transition-colors ${
                channel.id === ch.id
                  ? 'border-terminal-accent text-terminal-accent bg-terminal-accent/5'
                  : 'border-transparent text-terminal-faint hover:text-terminal-dim'
              }`}
            >
              <span>{ch.flag}</span>
              <span>{ch.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Status + controls bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-1 border-b border-terminal-border/30 bg-terminal-panel">
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs text-terminal-faint/60">{channel.category}</span>

          {badge === 'hls' && (
            <span className="font-mono text-2xs text-blue-400 border border-blue-400/30 px-1 rounded">HLS</span>
          )}
          {badge === 'yt' && (
            <span className="font-mono text-2xs text-red-400 border border-red-400/30 px-1 rounded">YT</span>
          )}

          {(mode === 'hls' || mode === 'yt') && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-2xs text-red-400 font-bold">LIVE</span>
            </span>
          )}
          {mode === 'loading' && (
            <span className="font-mono text-2xs text-terminal-faint animate-pulse">connecting…</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMuted((m) => !m)}
            disabled={mode !== 'hls' && mode !== 'yt'}
            className="font-mono text-sm text-terminal-faint hover:text-terminal-text disabled:opacity-30 transition-colors"
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button
            onClick={() => loadChannel(channel)}
            className="font-mono text-xs text-terminal-faint hover:text-terminal-dim border border-terminal-border/40 px-1.5 py-0.5 rounded"
            title="Reload"
          >↺</button>
          <a
            href={`https://www.youtube.com/watch?v=${videoId ?? channel.fallbackVideoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-2xs text-terminal-faint/50 hover:text-terminal-accent"
          >↗</a>
        </div>
      </div>

      {/* Player */}
      <div className="flex-1 relative overflow-hidden bg-black">

        {mode === 'hls' && channel.hlsUrl && (
          <HlsPlayer
            key={channel.id}
            url={channel.hlsUrl}
            muted={muted}
            onError={handleHlsError}
          />
        )}

        {mode === 'yt' && videoId && (
          <YoutubePlayer
            key={`${channel.id}:${videoId}`}
            videoId={videoId}
            muted={muted}
            onError={handleYtError}
          />
        )}

        {mode === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-2xs text-terminal-faint animate-pulse">
              {channel.name}…
            </span>
          </div>
        )}

        {mode === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="font-mono text-2xs text-terminal-faint/60">Stream unavailable</span>
            <div className="flex gap-2">
              <button
                onClick={() => loadChannel(channel)}
                className="font-mono text-2xs text-terminal-faint border border-terminal-border/50 px-3 py-1 rounded hover:border-terminal-dim"
              >
                Retry
              </button>
              <a
                href={`https://www.youtube.com/watch?v=${channel.fallbackVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-2xs text-terminal-accent border border-terminal-accent/40 px-3 py-1 rounded hover:bg-terminal-accent/10"
              >
                Watch on YouTube →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
