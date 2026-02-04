import { useEffect, useRef, useState } from 'react'
import { getCalculatedDataSize, showToast } from '@/utils/utils'
import { WS_URL, RECONNECT_INTERVAL, MAX_DATA_POINTS } from '@/utils/config'

export function useWebsocket (url: string = WS_URL): WebsocketContextType {
  const [data, setData] = useState<TelemetryData[]>([])
  const [status, setStatus] = useState<('disconnected' | 'connected' | 'reconnecting')>('disconnected')
  const [rate, setRate] = useState(0)
  const [pps, setPps] = useState(0)

  const websocketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const cleaningUpRef = useRef(false)

  const lastTimestampRef = useRef<number>(Date.now())
  const totalBytesRef = useRef<number>(0)
  const packetCountRef = useRef<number>(0)

  const connectWebsocket = () => {
    if (cleaningUpRef.current) {
      return
    }

    if (websocketRef.current != null && websocketRef.current.readyState === WebSocket.OPEN) {
      return
    }

    const ws = new WebSocket(url)
    websocketRef.current = ws
    
    if (reconnectTimeoutRef.current != null) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    ws.onopen = () => {
      if (cleaningUpRef.current) {
        ws.close()
        return
      }

      console.log('WS: Connected')
      setStatus('connected')
    }

    ws.onclose = () => {
      console.log('WS: Disconnected')

      if (!cleaningUpRef.current && reconnectTimeoutRef.current == null) {
        setStatus('disconnected')
        setRate(0)
        setPps(0)

        console.log(`WS: Reconnecting in ${RECONNECT_INTERVAL}ms`)
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('WS: Reconnecting')
          setStatus('reconnecting')
          connectWebsocket()
        }, RECONNECT_INTERVAL)
      }
    }

    ws.onerror = (error) => {
      if (!cleaningUpRef.current) {
        setStatus('disconnected')
      }

      console.error('WS: Error', error)
      ws.close()
    }

    ws.onmessage = (event) => {
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
          showToast(packet)
          break
      }

      totalBytesRef.current += getCalculatedDataSize(event)
      packetCountRef.current += 1
    }
  }

  const reconnect = () => {
    if (websocketRef.current != null) {
      websocketRef.current.onclose = null
      websocketRef.current.close()
      websocketRef.current = null
    }

    if (reconnectTimeoutRef.current != null) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    setRate(0)
    setPps(0)
    setData([])
    totalBytesRef.current = 0
    packetCountRef.current = 0

    console.log('WS: Reconnecting')
    setStatus('reconnecting')
    connectWebsocket()
  }

  const send = (command: Command) => {
    const ws = websocketRef.current
    if (ws != null && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(command))
    }
  }

  useEffect(() => {
    cleaningUpRef.current = false

    connectWebsocket()    

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

    return () => {
      cleaningUpRef.current = true
      clearInterval(interval)

      if (reconnectTimeoutRef.current != null) {
        clearTimeout(reconnectTimeoutRef.current)
      }

      if (websocketRef.current != null) {
        websocketRef.current.onclose = null
        websocketRef.current.close()
        websocketRef.current = null
      }
    }
  }, [url])

  return {
    data,
    status,
    rate,
    pps,
    send,
    reconnect
  }
}
