import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
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
    port: 3000,
    // hmr: false
  },
  preview: {
    port: 3000
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
            }
          ]
        }
      }
    }
  }
})
