import { useEffect, useMemo, useRef, useState } from 'react'
import Map, { type MapRef, Source, Layer } from 'react-map-gl/maplibre'
import type { FeatureCollection } from 'geojson'
import { useWebsocketAPI } from '@/contexts/WebsocketContext'
import { useLocation } from '@/hooks/useLocation'
import { pointLayer, labelLayer, groundStationLayer, groundStationLabelLayer } from '@/utils/charts'
import 'maplibre-gl/dist/maplibre-gl.css'

interface GPSMapProps {
  initial: WebsocketTelemetryData
}

export default function GPSMap ({
  initial
}: GPSMapProps) {
  const { subscribe } = useWebsocketAPI()
  const location = useLocation()
  const mapRef = useRef<MapRef>(null)
  const [anchored, setAnchored] = useState(true)
  const anchoredRef = useRef(true)
  const lastUpdateRef = useRef(0)

  const initialViewState = useMemo(() => ({
    longitude: initial.longitude / 1e7,
    latitude: initial.latitude / 1e7,
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
        coordinates: [initial.longitude / 1e7, initial.latitude / 1e7]
      },
      properties: {
        altitude: initial.altitude.toFixed(1)
      }
    }]
  }), [initial])

  const groundStationLocation: FeatureCollection | null = useMemo(() => {
    if (location == null) {
      return null
    }

    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        },
        properties: {}
      }]
    }
  }, [location])

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
          latitude,
          longitude,
          altitude
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
                coordinates: [longitude / 1e7, latitude / 1e7]
              },
              properties: {
                altitude: altitude.toFixed(1)
              }
            }]
          })
        }

        if (anchoredRef.current) {
          map.jumpTo({
            center: [longitude / 1e7, latitude / 1e7]
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
        {
          groundStationLocation != null && (
            <Source
              id='ground-station'
              type='geojson'
              data={groundStationLocation}
            >
              {/* @ts-expect-error */}
              <Layer
                {...groundStationLayer}
              />
              {/* @ts-expect-error */}
              <Layer
                {...groundStationLabelLayer}
              />
            </Source>
          )
        }
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
