import { Route, Routes } from 'react-router'
import toast, { ToastBar, Toaster } from 'react-hot-toast'
import { X } from 'lucide-react'
import { WebsocketProvider } from '@/contexts/WebsocketContext'
import DashboardPage from '@/pages/dashboard'
import LoggingPage from '@/pages/logging'
import AboutPage from '@/pages/about'
import SettingsPage from '@/pages/settings'
import AppLayout from '@/layout'
import { getToastIcon } from '@/utils/utils'

const toastOptions = {
  duration: 4000,
  success: {
    duration: 3000
  },
  error: {
    duration: 8000
  },
  style: {
    background: 'none',
    boxShadow: 'none',
    borderRadius: 0,
    padding: 0,
    margin: 0,
    maxWidth: 'none',
    color: 'var(--color-primary-foreground)'
  }
}

const toastStyles: Record<string, string> = {
  success: 'border-positive',
  error: 'border-negative'
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
        position='bottom-right'
        gutter={8}
        containerClassName='!bottom-10'
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
                  const borderStyle = toastStyles[t.type] ?? 'border-primary-muted'

                  return (
                    <button
                      type='button'
                      title='DISMISS'
                      onClick={() => toast.dismiss(t.id)}
                      className={`
                        w-80 flex items-center gap-3 border-2 bg-primary px-3 py-2 text-left
                        text-sm tracking-widest cursor-pointer transition-colors duration-100
                        hover:bg-primary-muted ${borderStyle}
                      `}
                    >
                      <Icon
                        className={`size-4 shrink-0 ${styles}`}
                        strokeWidth={1.5}
                      />
                      <span
                        className='min-w-0 flex-1 break-words'
                      >
                        {message}
                      </span>
                      <X
                        className='size-4 shrink-0 text-primary-muted-foreground'
                        strokeWidth={1.5}
                      />
                    </button>
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
