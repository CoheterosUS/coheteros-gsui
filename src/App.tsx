import { Route, Routes } from 'react-router'
import { ToastBar, Toaster } from 'react-hot-toast'
import { WebsocketProvider } from '@/contexts/WebsocketContext'
import DashboardPage from '@/pages/dashboard'
import LoggingPage from '@/pages/logging'
import AboutPage from '@/pages/about'
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
                    h-5 w-5
                    ${styles}
                  `

                  return (
                    <div
                      className={`
                        grid grid-cols-[auto_1fr] items-center
                      `}
                    >
                      <Icon
                        className={iconStyle}
                        strokeWidth={1.5}
                      />
                      {message}
                    </div>
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
