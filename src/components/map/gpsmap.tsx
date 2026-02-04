import { useEffect, useRef, useState } from 'react'
import Map, { type MapRef, Source, Layer } from 'react-map-gl/maplibre'
import { initialViewport } from '@/utils/charts'
import 'maplibre-gl/dist/maplibre-gl.css'
import { labelLayer, pointLayer } from '@/utils/charts'

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

  const pointGeoJSON = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [gpsLongitude, gpsLatitude]
        },
        properties: {
          altitude: gpsAltitude.toFixed(1)
        }
      }
    ]
  }

  useEffect(() => {
    if (mapRef.current == null) {
      return
    }

    if (anchored) {
      mapRef.current.jumpTo({
        center: [gpsLongitude, gpsLatitude]
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
        <Source
          id='gps'
          type='geojson'
          // @ts-expect-error
          data={pointGeoJSON}
        >
          {/* @ts-expect-error */}
          <Layer
            {...pointLayer}
          />
          {/* @ts-expect-error */}
          <Layer
            {...labelLayer}
          />
        </Source>
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
