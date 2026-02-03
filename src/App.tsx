import { Route, Routes } from 'react-router'
import { ToastBar, Toaster } from 'react-hot-toast'
import { Info } from 'lucide-react'
import { WebsocketProvider } from '@/contexts/WebsocketContext'
import DashboardPage from '@/pages/dashboard'
import ControlsPage from '@/pages/controls'
import LoggingPage from '@/pages/logging'
import AboutPage from '@/pages/about'
import AppLayout from '@/layout'

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
            path='/logs'
            element={<LoggingPage />}
          />
          <Route
            path='/about'
            element={<AboutPage />}
          />
        </Route>
      </Routes>
      <Toaster
        position='bottom-right'
        toastOptions={toastOptions}
      >
        {
          (t) => (
            <ToastBar
              toast={t}
            >
              {
                ({ message }) => (
                  <>
                    <Info
                      className='h-4 w-4'
                      strokeWidth={1.5}
                    />
                    {message}
                  </>
                )
              }
            </ToastBar>
          )
        }
      </Toaster>
    </WebsocketProvider>
  )
}
