import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useWebsocket } from '@/hooks/useWebsocket'

interface WebsocketAPI {
  subscribe: (callback: (data: WebsocketTelemetryData) => void) => () => void
  send: (command: WebsocketCommand) => void
  reconnect: () => void
}

interface WebsocketStats {
  status: WebsocketStatus
  rate: number
  pps: number
}

interface WebsocketProviderProps {
  children: ReactNode
}

const WebsocketAPIContext = createContext<WebsocketAPI | undefined>(undefined)
const WebsocketStatsContext = createContext<WebsocketStats | undefined>(undefined)

export function WebsocketProvider ({
  children
}: WebsocketProviderProps) {
  const {
    subscribe,
    send,
    reconnect,
    status,
    rate,
    pps
  } = useWebsocket()

  const apiValue = useMemo(() => ({
    subscribe,
    send,
    reconnect
  }), [subscribe, send, reconnect])

  const statsValue = useMemo(() => ({
    status,
    rate,
    pps
  }), [status, rate, pps])

  return (
    <WebsocketAPIContext.Provider
      value={apiValue}
    >
        <WebsocketStatsContext.Provider
          value={statsValue}
        >
          {children}
        </WebsocketStatsContext.Provider>
    </WebsocketAPIContext.Provider>
  )
}

export function useWebsocketAPI () {
  const context = useContext(WebsocketAPIContext)
  if (context == null) {
    throw new Error('useWebsocketAPI must be used within WebsocketProvider')
  }

  return context
}

export function useWebsocketStats () {
  const context = useContext(WebsocketStatsContext)
  if (context == null) {
    throw new Error('useWebsocketStats must be used within WebsocketProvider')
  }

  return context
}
