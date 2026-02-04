import { useEffect, useRef, useState } from 'react'
import Map, { type MapRef, Marker } from 'react-map-gl/maplibre'
import { initialViewport } from '@/utils/utils'
import 'maplibre-gl/dist/maplibre-gl.css'

interface MapProps {
  gpsLatitude: number
  gpsLongitude: number
  gpsAltitude: number
}

export default function GPSMap ({
  gpsLatitude,
  gpsLongitude,
  gpsAltitude
}: MapProps) {
  const mapRef = useRef<MapRef>(null)
  const [anchored, setAnchored] = useState(true)

  const buttonStyle = `
    fixed top-4 right-4 w-32 flex justify-center gap-2 px-2 py-1 font-semibold tracking-wider border-2 border-primary rounded cursor-pointer hover:opacity-80
    ${anchored ? 'bg-primary text-primary-foreground' : 'bg-primary-foreground text-primary'}
  `

  useEffect(() => {
    if (mapRef.current == null) {
      return
    }

    if (anchored) {
      mapRef.current.setCenter({
        lng: gpsLongitude,
        lat: gpsLatitude
      })
    }
  }, [gpsLatitude, gpsLongitude, anchored])

  return (
    <div
      className='w-full h-full flex flex-col'
    >
      <Map
        ref={mapRef}
        initialViewState={initialViewport}
        mapStyle='https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
        // mapStyle='https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json'
      >
        <Marker
          longitude={gpsLongitude}
          latitude={gpsLatitude}
          anchor='bottom'
          className='flex flex-col items-center gap-1'
        >
          <p
            className='bg-primary p-1 rounded'
          >
            {gpsAltitude.toFixed(1)}m
          </p>
          <p
            className='bg-primary p-1 rounded'
          >
            {gpsLatitude.toFixed(5)}, {gpsLongitude.toFixed(5)}
          </p>
          <img
            src='/images/logo.png'
            alt='Marker'
            className='w-8 h-8'
          />
        </Marker>
      </Map>
      <button
        title='TOGGLE ANCHOR'
        className={buttonStyle}
        onClick={() => setAnchored(!anchored)}
      >
        {anchored ? 'ANCHORED' : 'FREE'}
      </button>
    </div>
  )
}
