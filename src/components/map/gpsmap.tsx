import { useEffect, useMemo, useRef, useState } from 'react'
import Map, { type MapRef, Source, Layer } from 'react-map-gl/maplibre'
import type { FeatureCollection } from 'geojson'
import { pointLayer, labelLayer } from '@/utils/charts'
import { useWebsocketAPI } from '@/contexts/WebsocketContext'
import 'maplibre-gl/dist/maplibre-gl.css'

interface GPSMapProps {
  initial: WebsocketTelemetryData
}

export default function GPSMap ({
  initial
}: GPSMapProps) {
  const { subscribe } = useWebsocketAPI()
  const mapRef = useRef<MapRef>(null)
  const [anchored, setAnchored] = useState(true)
  const anchoredRef = useRef(true)
  const lastUpdateRef = useRef(0)

  const initialViewState = useMemo(() => ({
    longitude: initial.gpsLongitude,
    latitude: initial.gpsLatitude,
    zoom: 15,
    pitch: 60,
    bearing: 0
  }), [initial])

  const initialGeoJson: FeatureCollection = useMemo(() => ({
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [initial.gpsLongitude, initial.gpsLatitude]
      },
      properties: {
        altitude: initial.gpsAltitude.toFixed(1)
      }
    }]
  }), [initial])

  useEffect(() => {
    anchoredRef.current = anchored
  }, [anchored])

  useEffect(() => {
    const unsubscribe = subscribe('TELEMETRY_PACKET', (packet) => {
      const map = mapRef.current?.getMap()
      if (map == null) {
        return
      }

      const now = Date.now()

      // TODO: Implement refresh rate selection, settings
      if (now - lastUpdateRef.current > 100) {
        const {
          gpsLatitude,
          gpsLongitude,
          gpsAltitude
        } = packet

        const source = map.getSource('gps')
        if (source != null) {
          // @ts-expect-error
          source.setData({
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [gpsLongitude, gpsLatitude]
              },
              properties: {
                altitude: gpsAltitude.toFixed(1)
              }
            }]
          })
        }

        if (anchoredRef.current) {
          map.jumpTo({
            center: [gpsLongitude, gpsLatitude]
          })
        }

        lastUpdateRef.current = now
      }
    })

    return () => {
      unsubscribe()
    }
  }, [subscribe])

  const buttonStyle = `
    fixed top-4 right-4 w-32 flex justify-center gap-2 px-2 py-1 font-semibold tracking-wider border-2 border-primary rounded cursor-pointer hover:opacity-80
    ${anchored ? 'bg-primary text-primary-foreground' : 'bg-primary-foreground text-primary'}
  `

  return (
    <div
      className='w-full h-full flex flex-col'
    >
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        mapStyle='https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
        // mapStyle='https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json'
      >
        <Source
          id='gps'
          type='geojson'
          data={initialGeoJson}
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
