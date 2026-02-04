import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

interface Mode {
  mode: string
}

// https://vite.dev/config/
export default ({ mode }: Mode) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd())
  }

  return defineConfig({
    plugins: [
      react(),
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    server: {
      port: parseInt(process.env.VITE_FRONTEND_PORT ?? '3000'),
      // Could HMR be causing issues with RAM consumption?
      // hmr: false
    },
    preview: {
      port: parseInt(process.env.VITE_FRONTEND_PORT ?? '3000')
    },
    build: {
      rolldownOptions: {
        output: {
          advancedChunks: {
            groups: [
              {
                name: 'three',
                test: /[\\/]node_modules[\\/]three[\\/]/
              },
              {
                name: 'react',
                test: /[\\/]node_modules[\\/]react(?:-dom)?[\\/]/
              },
              {
                name: 'react-three',
                test: /[\\/]node_modules[\\/](@react-three[\\/]fiber|@react-three[\\/]drei)[\\/]/
              },
              {
                name: 'chart',
                test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/
              },
              {
                name: 'lucide',
                test: /[\\/]node_modules[\\/](lucide-react)[\\/]/
              },
              {
                name: 'maplibre',
                test: /[\\/]node_modules[\\/](maplibre-gl)[\\/]/
              },
              {
                name: 'react-maplibre',
                test: /[\\/]node_modules[\\/](react-map-gl)[\\/]/
              }
            ]
          }
        }
      }
    }
  })
}
