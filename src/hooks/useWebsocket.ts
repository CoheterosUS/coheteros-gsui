import { useEffect, useRef, useCallback, useState } from 'react'

const URL = 'ws://localhost:8765/'
const MAX_DATA_POINTS = 50
const RECONNECT_INTERVAL = 3000

export function useWebsocket (url: string = URL) {
  const [data, setData] = useState<TelemetryPacket[]>([])
  const [status, setStatus] = useState('disconnected')

  const websocketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const cleaningUpRef = useRef(false)

  useEffect(() => {
    cleaningUpRef.current = false
    let websocket: WebSocket | null = null

    const connectWebsocket = () => {
      if (cleaningUpRef.current) {
        return
      }

      if (websocket != null && websocket.readyState === WebSocket.OPEN) {
        return
      }

      websocket = new WebSocket(url)
      websocketRef.current = websocket
      reconnectTimeoutRef.current = null

      websocket.onopen = () => {
        if (cleaningUpRef.current) {
          websocket?.close()
          return
        }

        console.log('WS: Connected')
        setStatus('connected')

        if (reconnectTimeoutRef.current != null) {
          clearTimeout(reconnectTimeoutRef.current)
          reconnectTimeoutRef.current = null
        }
      }

      websocket.onclose = () => {
        console.log('WS: Disconnected')

        if (!cleaningUpRef.current && reconnectTimeoutRef.current == null) {
          setStatus('disconnected')
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('WS: Reconnecting')
            setStatus('reconnecting')
            connectWebsocket()
          }, RECONNECT_INTERVAL)
        }
      }

      websocket.onerror = (error) => {
        if (!cleaningUpRef.current) {
          console.error('WS: Error', error)
          setStatus('disconnected')
        }

        websocket?.close()
      }

      websocket.onmessage = (event) => {
        if (cleaningUpRef.current) {
          return
        }

        const packet: TelemetryPacket = JSON.parse(event.data)

        setData(prev => {
          const updated = [...prev, packet]
          if (updated.length > MAX_DATA_POINTS) {
            updated.shift()
          }

          return updated
        })
      }
    }

    connectWebsocket()

    return () => {
      cleaningUpRef.current = true

      if (reconnectTimeoutRef.current != null) {
        clearTimeout(reconnectTimeoutRef.current)
      }

      if (websocket != null) {
        websocket.close()
        websocket = null
      }

      websocketRef.current = null
    }
  }, [url])

  return {
    data,
    status
  }
}
