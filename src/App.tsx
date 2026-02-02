import { Route, Routes } from 'react-router'
import { WebsocketProvider } from '@/components/contexts/WebsocketContext'
import DashboardPage from '@/pages/dashboard'
import ControlsPage from '@/pages/controls'
import LoggingPage from '@/pages/logging'

export default function App () {
  return (
    <WebsocketProvider>
      <Routes>
        <Route
          index
          element={<DashboardPage />}
        />
        <Route
          path='/controls'
          element={<ControlsPage />}
        />
        <Route
          path='/logs'
          element={<LoggingPage />}
        />
      </Routes>
    </WebsocketProvider>
  )
}
