import type { NewsItem, NewsCategory } from '../types'

interface Rss2JsonItem {
  title: string
  description: string
  link: string
  pubDate: string
  author?: string
}
interface Rss2JsonResponse {
  status: string
  feed: { title: string; link: string }
  items: Rss2JsonItem[]
}

// rss2json converts RSS → JSON with CORS support (free, 10k req/day)
const RSS2JSON = 'https://api.rss2json.com/v1/api.json'

const FEEDS: { url: string; source: string; category: NewsCategory }[] = [
  {
    url:      'https://feeds.marketwatch.com/marketwatch/topstories/',
    source:   'MarketWatch',
    category: 'markets',
  },
  {
    url:      'https://feeds.finance.yahoo.com/rss/2.0/headline?s=^GSPC&region=US&lang=en-US',
    source:   'Yahoo Finance',
    category: 'markets',
  },
  {
    url:      'https://search.cnbc.com/rs/search/combinedcearch.htm?query=markets&module=Finance_News&format=rss&source=2',
    source:   'CNBC',
    category: 'markets',
  },
  {
    url:      'https://feeds.reuters.com/reuters/businessNews',
    source:   'Reuters',
    category: 'macro',
  },
  {
    url:      'https://cointelegraph.com/rss',
    source:   'CoinTelegraph',
    category: 'crypto',
  },
  {
    url:      'https://www.coindesk.com/arc/outboundfeeds/rss/',
    source:   'CoinDesk',
    category: 'crypto',
  },
  {
    url:      'https://feeds.bbci.co.uk/news/business/rss.xml',
    source:   'BBC Business',
    category: 'macro',
  },
  {
    url:      'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
    source:   'NY Times Business',
    category: 'markets',
  },
  {
    url:      'https://www.aljazeera.com/xml/rss/all.xml',
    source:   'Al Jazeera',
    category: 'geopolitical',
  },
  {
    url:      'https://oilprice.com/rss/main',
    source:   'OilPrice',
    category: 'commodities',
  },
  {
    url:      'https://feeds.ft.com/rss/home/us',
    source:   'Financial Times',
    category: 'macro',
  },
  {
    url:      'https://asia.nikkei.com/rss/feed/nar',
    source:   'Nikkei Asia',
    category: 'markets',
  },
  {
    url:      'https://www.investing.com/rss/news.rss',
    source:   'Investing.com',
    category: 'markets',
  },
  {
    url:      'https://www.zerohedge.com/fullrss2.xml',
    source:   'ZeroHedge',
    category: 'macro',
  },
  {
    url:      'https://decrypt.co/feed',
    source:   'Decrypt',
    category: 'crypto',
  },
]

async function fetchFeed(
  feed: (typeof FEEDS)[0],
  count = 8,
): Promise<NewsItem[]> {
  try {
    const url = `${RSS2JSON}?rss_url=${encodeURIComponent(feed.url)}&count=${count}`
    const res = await fetch(url)
    if (!res.ok) return []
    const data: Rss2JsonResponse = await res.json()
    if (data.status !== 'ok') return []

    return data.items.map((item, i): NewsItem => ({
      id:          `${feed.source}-${i}-${Date.now()}`,
      title:       stripHtml(item.title),
      description: stripHtml(item.description ?? '').slice(0, 160),
      url:         item.link,
      source:      feed.source,
      publishedAt: item.pubDate,
      category:    feed.category,
      sentiment:   guessSentiment(item.title),
      tags:        extractTags(item.title),
    }))
  } catch {
    return []
  }
}

export async function fetchAllNews(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(FEEDS.map((f) => fetchFeed(f)))
  const all: NewsItem[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') all.push(...r.value)
  }
  // Deduplicate by title similarity, sort newest first
  const seen = new Set<string>()
  return all
    .filter((n) => {
      const key = n.title.toLowerCase().slice(0, 40)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
}

const BULLISH_WORDS = /\b(surge|soar|rally|gain|bull|rise|record|high|growth|positive|strong|beat|profit)\b/i
const BEARISH_WORDS = /\b(fall|drop|crash|plunge|bear|decline|loss|weak|miss|selloff|recession|fear|risk|warn)\b/i

function guessSentiment(title: string): NewsItem['sentiment'] {
  if (BULLISH_WORDS.test(title)) return 'bullish'
  if (BEARISH_WORDS.test(title)) return 'bearish'
  return 'neutral'
}

const TAG_PATTERNS: [RegExp, string][] = [
  [/bitcoin|btc/i, 'BTC'],
  [/ethereum|eth/i, 'ETH'],
  [/federal reserve|fed|powell/i, 'FED'],
  [/oil|crude|opec/i, 'OIL'],
  [/gold/i, 'GOLD'],
  [/s&p|nasdaq|dow/i, 'EQUITIES'],
  [/inflation|cpi/i, 'INFLATION'],
  [/interest rate/i, 'RATES'],
  [/china/i, 'CHINA'],
  [/europe|ecb/i, 'ECB'],
  [/ukraine|russia/i, 'RUSSIA'],
  [/middle east|iran|israel/i, 'MENA'],
]

function extractTags(title: string): string[] {
  return TAG_PATTERNS.filter(([re]) => re.test(title)).map(([, tag]) => tag)
}
