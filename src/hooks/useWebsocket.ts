import { useEffect, useRef, useCallback, useState } from 'react'

const URL = 'ws://localhost:8765/'
const MAX_DATA_POINTS = 50
const RECONNECT_INTERVAL = 3000

export function useWebsocket (url: string = URL) {
  const [data, setData] = useState<TelemetryPacket[]>([])
  const [status, setStatus] = useState('disconnected')

  const websocketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)

  const connectWebsocket = useCallback(() => {
    const websocket = new WebSocket(url)
    websocketRef.current = websocket

    websocket.onopen = () => {
      console.log('WS: Connected')
      setStatus('connected')
    }

    websocket.onclose = () => {
      console.log('WS: Disconnected')
      setStatus('disconnected')
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('WS: Reconnecting')
        setStatus('reconnecting')
        connectWebsocket()
      }, RECONNECT_INTERVAL)
    }

    websocket.onerror = (error) => {
      console.error('WS: Error', error)
      setStatus('disconnected')
      websocket.close()
    }

    websocket.onmessage = (event) => {
      const packet: TelemetryPacket = JSON.parse(event.data)

      setData(prev => {
        const updated = [...prev, packet]
        if (updated.length > MAX_DATA_POINTS) {
          updated.shift()
        }

        return updated
      })
    }
  }, [url])

  useEffect(() => {
    connectWebsocket()

    return () => {
      if (websocketRef.current != null) {
        websocketRef.current.close()
      }

      if (reconnectTimeoutRef.current != null) {
        clearTimeout(reconnectTimeoutRef.current)
      }

      setStatus('disconnected')
    }
  }, [connectWebsocket])

  return {
    data,
    status
  }
}
