import { createContext, useContext, type ReactNode } from 'react'
import { useWebsocket } from '@/hooks/useWebsocket'

interface WebsocketProviderProps {
  children: ReactNode
}

const WebsocketContext = createContext<WebsocketContextType | undefined>(undefined)

export function WebsocketProvider ({
  children
}: WebsocketProviderProps) {
  const websocketState = useWebsocket()

  return (
    <WebsocketContext.Provider
      value={websocketState}
    >
      {children}
    </WebsocketContext.Provider>
  )
}

export function useWebsocketContext () {
  const context = useContext(WebsocketContext)
  if (context == null) {
    throw new Error('useWebsocketContext must be used within WebsocketProvider')
  }

  return context
}
