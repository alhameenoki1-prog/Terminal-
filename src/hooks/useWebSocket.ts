import { useEffect, useRef, useCallback } from 'react'

interface UseWebSocketOptions {
  onMessage: (data: unknown) => void
  onOpen?: () => void
  onClose?: () => void
  reconnectDelay?: number
}

export function useWebSocket(url: string, options: UseWebSocketOptions) {
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shouldReconnect = useRef(true)
  const { onMessage, onOpen, onClose, reconnectDelay = 3000 } = options

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(url)

      ws.current.onopen = () => onOpen?.()

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
          reconnectTimer.current = setTimeout(connect, reconnectDelay)
        }
      }

      ws.current.onerror = () => {
        ws.current?.close()
      }
    } catch {
      if (shouldReconnect.current) {
        reconnectTimer.current = setTimeout(connect, reconnectDelay)
      }
    }
  }, [url, onMessage, onOpen, onClose, reconnectDelay])

  useEffect(() => {
    shouldReconnect.current = true
    connect()
    return () => {
      shouldReconnect.current = false
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      ws.current?.close()
    }
  }, [connect])
}
