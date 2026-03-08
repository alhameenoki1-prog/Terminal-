import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { fetchAllNews } from '../services/newsService'
import { timeAgo } from '../utils/format'
import type { NewsItem } from '../types'
import { RefreshCw, ExternalLink } from 'lucide-react'

const SENTIMENT_COLOR: Record<string, string> = {
  bullish: 'text-terminal-up',
  bearish: 'text-terminal-down',
  neutral: 'text-terminal-dim',
}

const SENTIMENT_DOT: Record<string, string> = {
  bullish: 'bg-terminal-up',
  bearish: 'bg-terminal-down',
  neutral: 'bg-terminal-faint',
}

const CATEGORY_COLOR: Record<string, string> = {
  markets:      'text-terminal-blue',
  macro:        'text-terminal-accent',
  crypto:       'text-terminal-purple',
  geopolitical: 'text-terminal-down',
  commodities:  'text-yellow-500',
  tech:         'text-cyan-400',
  general:      'text-terminal-dim',
}

export function NewsFeed() {
  const news            = useStore((s) => s.news)
  const setNews         = useStore((s) => s.setNews)
  const loading         = useStore((s) => s.newsLoading)
  const setLoading      = useStore((s) => s.setNewsLoading)
  const selectedCountry = useStore((s) => s.selectedCountry)
  const setSelectedCountry = useStore((s) => s.setSelectedCountry)

  // Filter by country keywords when a country is selected
  const displayNews = selectedCountry
    ? news.filter((n) =>
        selectedCountry.rssKeywords.some((kw) =>
          `${n.title} ${n.description}`.toLowerCase().includes(kw.toLowerCase())
        )
      )
    : news

  const refresh = () => {
    setLoading(true)
    fetchAllNews()
      .then(setNews)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  // Initial fetch + 5-minute refresh
  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col h-full bg-terminal-surface border-b border-terminal-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-terminal-border flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-2xs font-semibold text-terminal-accent tracking-widest uppercase flex-shrink-0">
            Intelligence Feed
          </span>
          {selectedCountry && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-terminal-accent/15 border border-terminal-accent/30 rounded text-terminal-accent font-mono text-2xs truncate">
              <span>{selectedCountry.flag}</span>
              <span className="truncate">{selectedCountry.name}</span>
              <button
                onClick={() => setSelectedCountry(null)}
                className="ml-0.5 text-terminal-faint hover:text-terminal-down leading-none flex-shrink-0"
                title="Clear country filter"
              >
                ✕
              </button>
            </span>
          )}
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-1 text-terminal-faint hover:text-terminal-dim transition-colors flex-shrink-0"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span className="font-mono text-2xs">{loading ? 'fetching...' : 'refresh'}</span>
        </button>
      </div>

      {/* Feed items */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {loading && news.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <span className="font-mono text-xs text-terminal-faint animate-pulse">
              Loading news...
            </span>
          </div>
        )}

        {!loading && selectedCountry && displayNews.length === 0 && news.length > 0 && (
          <div className="p-4 text-center">
            <div className="text-2xl mb-2">{selectedCountry.flag}</div>
            <span className="font-mono text-xs text-terminal-faint">
              No recent headlines matched for {selectedCountry.name}.
            </span>
            <div className="font-mono text-2xs text-terminal-faint/50 mt-1">
              Try refreshing or switching country.
            </div>
          </div>
        )}

        {displayNews.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}

        {!loading && news.length === 0 && (
          <div className="p-4 text-center">
            <span className="font-mono text-xs text-terminal-faint">
              No news loaded. Check network or try refresh.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function NewsCard({ item }: { item: NewsItem }) {
  const sentimentClass = SENTIMENT_COLOR[item.sentiment ?? 'neutral']
  const dotClass       = SENTIMENT_DOT[item.sentiment ?? 'neutral']
  const catClass       = CATEGORY_COLOR[item.category] ?? 'text-terminal-dim'

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block px-3 py-2.5 border-b border-terminal-border/30 hover:bg-terminal-panel transition-colors group"
    >
      {/* Meta row */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClass}`} />
          <span className={`font-mono text-2xs font-semibold uppercase tracking-wide ${catClass}`}>
            {item.category}
          </span>
          <span className="font-mono text-2xs text-terminal-faint">{item.source}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-2xs text-terminal-faint">
            {timeAgo(item.publishedAt)}
          </span>
          <ExternalLink className="w-2.5 h-2.5 text-terminal-faint opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Title */}
      <p className="font-sans text-xs text-terminal-text leading-snug mb-1 group-hover:text-white transition-colors">
        {item.title}
      </p>

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-2xs px-1 py-0.5 rounded bg-terminal-border/50 text-terminal-faint"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </a>
  )
}
