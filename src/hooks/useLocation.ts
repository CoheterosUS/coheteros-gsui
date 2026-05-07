import { useEffect, useState } from 'react'
import { showToast } from '@/utils/utils'

export function useLocation () {
  const [location, setLocation] = useState<LocationData | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      showToast({
        category: 'ERROR',
        data: 'GEOLOCATION NOT SUPPORTED'
      })

      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        })
      },
      (error) => {
        console.error('Position error:', error)
      },
      {
        maximumAge: 60000,
        timeout: 10000
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  return location
}
