// YouTube Data API v3 — find current live stream video ID for a channel
// Costs 100 quota units per search. Free tier = 10,000 units/day → 100 searches/day.
// We cache results for 5 minutes to stay well within limits.

interface CacheEntry {
  videoId: string | null
  expires: number
}

const cache = new Map<string, CacheEntry>()

export type YoutubeError =
  | 'no_key'
  | 'invalid_key'
  | 'quota_exceeded'
  | 'not_live'
  | 'api_error'

export interface LiveStreamResult {
  videoId: string | null
  error?: YoutubeError
}

export async function getLiveVideoId(
  channelId: string,
  apiKey: string,
): Promise<LiveStreamResult> {
  if (!apiKey) return { videoId: null, error: 'no_key' }

  const now = Date.now()
  const cached = cache.get(channelId)
  if (cached && cached.expires > now) {
    return { videoId: cached.videoId, error: cached.videoId ? undefined : 'not_live' }
  }

  try {
    const params = new URLSearchParams({
      channelId,
      eventType: 'live',
      type:       'video',
      part:       'id',
      maxResults: '1',
      key:        apiKey,
    })
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`)

    if (res.status === 400) return { videoId: null, error: 'invalid_key' }
    if (res.status === 403) return { videoId: null, error: 'quota_exceeded' }
    if (!res.ok)            return { videoId: null, error: 'api_error' }

    const data = await res.json()
    const videoId: string | null = data.items?.[0]?.id?.videoId ?? null

    cache.set(channelId, { videoId, expires: now + 5 * 60_000 })
    return { videoId, error: videoId ? undefined : 'not_live' }
  } catch {
    return { videoId: null, error: 'api_error' }
  }
}
