import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { getCalculatedDataSize } from '@/utils/utils'
import { WS_URL, RECONNECT_INTERVAL, MAX_DATA_POINTS } from '@/utils/config'

export function useWebsocket (url: string = WS_URL): WebsocketContextType {
  const [data, setData] = useState<TelemetryData[]>([])
  const [status, setStatus] = useState('disconnected')
  const [rate, setRate] = useState(0)
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
          setRate(0)
          setPps(0)

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

        const packet: WebsocketPacket = JSON.parse(event.data)

        switch (packet.type) {
          case 'TELEMETRY_PACKET':
            setData(prev => {
              const updated = [...prev, packet.data]
              if (updated.length > MAX_DATA_POINTS) {
                updated.shift()
              }

              return updated
            })
          break
          case 'NOTIFICATION_PACKET':
            console.log('WS: Notification', packet.data)
            toast(packet.data)
          break
        }

        totalBytesRef.current += getCalculatedDataSize(event)
        packetCountRef.current += 1
      }
    }

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsedSeconds = (now - lastTimestampRef.current) / 1000

      if (elapsedSeconds >= 1) {
        const currentRate = totalBytesRef.current / 1024 / elapsedSeconds
        const currentPps = packetCountRef.current / elapsedSeconds

        setRate(currentRate)
        setPps(currentPps)

        totalBytesRef.current = 0
        packetCountRef.current = 0
        lastTimestampRef.current = now
      }
    }, 1000)

    connectWebsocket()

    return () => {
      cleaningUpRef.current = true
      clearInterval(interval)

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

  const sendCommand = (command: Command) => {
    const ws = websocketRef.current
    if (ws != null && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(command))
    }
  }

  return {
    data,
    status,
    rate,
    pps,
    sendCommand
  }
}
