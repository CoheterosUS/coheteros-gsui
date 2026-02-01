import { Route, Routes } from 'react-router'
import DashboardPage from '@/pages/dashboard'
import ControlsPage from '@/pages/controls'
import LoggingPage from '@/pages/logging'

export default function App () {
  return (
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
  )
}
