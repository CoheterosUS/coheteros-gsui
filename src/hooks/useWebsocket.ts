import { getCalculatedDataSize, MAX_DATA_POINTS, RECONNECT_INTERVAL, WEBSOCKET_PORT } from '@/utils/utils'
import { useEffect, useRef, useState } from 'react'

const URL = `ws://localhost:${WEBSOCKET_PORT}`

export function useWebsocket (url: string = URL) {
  const [data, setData] = useState<TelemetryPacket[]>([])
  const [status, setStatus] = useState('disconnected')
  const [downlink, setDownlink] = useState(0)
  const [pps, setPps] = useState(0)

  const websocketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const cleaningUpRef = useRef(false)

  const lastTimestampRef = useRef<number>(Date.now())
  const totalBytesRef = useRef<number>(0)
  const packetCountRef = useRef<number>(0)

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

        totalBytesRef.current += getCalculatedDataSize(event)
        packetCountRef.current += 1
        const deltaTime = (Date.now() - lastTimestampRef.current) / 1000

        if (deltaTime >= 1) {
          const speedKBs = (totalBytesRef.current / 1024) / deltaTime
          const currentPps = packetCountRef.current / deltaTime

          setPps(currentPps)
          setDownlink(speedKBs)

          lastTimestampRef.current = Date.now()
          totalBytesRef.current = 0
          packetCountRef.current = 0
        }
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
    status,
    downlink,
    pps
  }
}
