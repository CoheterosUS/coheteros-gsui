import { Route, Routes } from 'react-router'
import DashboardPage from '@/pages/dashboard'
import ControlsPage from '@/pages/controls'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import Annotation from 'chartjs-plugin-annotation'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Annotation
)

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
