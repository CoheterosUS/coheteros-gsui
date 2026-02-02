import { useEffect, useRef, useState } from 'react'
import { API_URL } from '@/utils/config'

export default function useFetchState<T> () {
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  const controllerRef = useRef<AbortController | null>(null)

  const getData = async (endpoint: string, method = 'GET', body = null, options: RequestInit = {}) => {
    if (controllerRef.current != null) {
      controllerRef.current.abort()
    }

    const controller = new AbortController()
    controllerRef.current = controller

    setStatus('loading')

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        body: body == null ? null : JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        signal: controller.signal,
        ...options
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result: T = await response.json()
      setData(result)
      setStatus('success')

      return {
        data: result,
        status: 'success'
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return {
          data: null,
          status: 'error'
        }
      }

      console.error('Fetch error:', error)
      setStatus('error')
      return {
        data: null,
        status: 'error'
      }
    }
  }

  useEffect(() => {
    return () => {
      if (controllerRef.current != null) {
        controllerRef.current.abort()
      }
    }
  }, [])

  return {
    data,
    status,
    getData,
    setData
  }
}
