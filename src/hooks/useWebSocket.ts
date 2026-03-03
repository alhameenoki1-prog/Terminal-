import { useEffect, useRef, useCallback } from 'react'

interface UseWebSocketOptions {
  onMessage: (data: unknown) => void
  onOpen?: () => void
  onClose?: () => void
  baseDelay?: number     // initial reconnect delay in ms (default 1000)
  maxDelay?: number      // max reconnect delay in ms (default 30000)
}

export function useWebSocket(url: string, options: UseWebSocketOptions) {
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shouldReconnect = useRef(true)
  const retryCount = useRef(0)
  const { onMessage, onOpen, onClose, baseDelay = 1000, maxDelay = 30000 } = options

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(url)

      ws.current.onopen = () => {
        retryCount.current = 0
        onOpen?.()
      }

      ws.current.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data as string)
          onMessage(data)
        } catch {
          // ignore non-JSON frames
        }
      }

      ws.current.onclose = () => {
        onClose?.()
        if (shouldReconnect.current) {
          const delay = Math.min(baseDelay * Math.pow(2, retryCount.current), maxDelay)
          retryCount.current++
          reconnectTimer.current = setTimeout(connect, delay)
        }
      }

      ws.current.onerror = () => {
        ws.current?.close()
      }
    } catch {
      if (shouldReconnect.current) {
        const delay = Math.min(baseDelay * Math.pow(2, retryCount.current), maxDelay)
        retryCount.current++
        reconnectTimer.current = setTimeout(connect, delay)
      }
    }
  }, [url, onMessage, onOpen, onClose, baseDelay, maxDelay])

  useEffect(() => {
    shouldReconnect.current = true
    retryCount.current = 0
    connect()
    return () => {
      shouldReconnect.current = false
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      ws.current?.close()
    }
  }, [connect])
}
