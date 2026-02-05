import { Route, Routes } from 'react-router'
import { ToastBar, Toaster } from 'react-hot-toast'
import { WebsocketProvider } from '@/contexts/WebsocketContext'
import DashboardPage from '@/pages/dashboard'
import ControlsPage from '@/pages/controls'
import LoggingPage from '@/pages/logging'
import AboutPage from '@/pages/about'
import MapPage from '@/pages/map'
import SettingsPage from '@/pages/settings'
import AppLayout from '@/layout'
import { getToastIcon } from '@/utils/utils'

const toastOptions = {
  style: {
    background: 'var(--color-primary-muted)',
    color: 'var(--color-primary-foreground)'
  }
}

export default function App () {
  return (
    <WebsocketProvider>
      <Routes>
        <Route
          element={<AppLayout />}
        >
          <Route
            index
            element={<DashboardPage />}
          />
          <Route
            path='/controls'
            element={<ControlsPage />}
          />
          <Route
            path='/map'
            element={<MapPage />}
          />
          <Route
            path='/logging'
            element={<LoggingPage />}
          />
          <Route
            path='/settings'
            element={<SettingsPage />}
          />
          <Route
            path='/about'
            element={<AboutPage />}
          />
        </Route>
      </Routes>
      <Toaster
        position='top-right'
        toastOptions={toastOptions}
      >
        {
          (t) => (
            <ToastBar
              toast={t}
            >
              {
                ({ message }) => {
                  const { Icon, styles } = getToastIcon(t.type as ToastCategory)
                  const iconStyle = `
                    h-4 w-4
                    ${styles}
                  `

                  return (
                    <>
                      <Icon
                        className={iconStyle}
                        strokeWidth={1.5}
                      />
                      {message}
                    </>
                  )
                }
              }
            </ToastBar>
          )
        }
      </Toaster>
    </WebsocketProvider>
  )
}
