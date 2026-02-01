import { Route, Routes } from 'react-router'
import DashboardPage from '@/pages/dashboard'
import ControlsPage from '@/pages/controls'

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
    </Routes>
  )
}
