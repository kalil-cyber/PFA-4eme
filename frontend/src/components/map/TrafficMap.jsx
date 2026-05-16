import { useMemo, useState } from 'react';
import Map, { Layer, Source, Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { STATUS_COLORS, INCIDENT_TYPES } from '../../utils/traffic';
import { CASABLANCA_MAP_VIEW } from '../../constants/city';
import { MAPBOX_STYLES } from '../../constants/mapBasemaps';
import LeafletTrafficMap from './LeafletTrafficMap';
import MapBasemapControl from './MapBasemapControl';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const HAS_MAPBOX =
  MAPBOX_TOKEN && MAPBOX_TOKEN !== 'your_mapbox_token_here' && MAPBOX_TOKEN.length > 10;

const DEFAULT_VIEW = CASABLANCA_MAP_VIEW;

export default function TrafficMap({
  roads = [],
  incidents = [],
  height = '100%',
  showMapboxTraffic = false,
  defaultBasemap = 'satellite',
}) {
  const [viewState, setViewState] = useState(DEFAULT_VIEW);
  const [basemap, setBasemap] = useState(defaultBasemap);

  const geojson = useMemo(() => {
    const features = roads.map((road) => ({
      type: 'Feature',
      properties: {
        id: road.id,
        name: road.name,
        status: road.status,
        color: STATUS_COLORS[road.status] || '#22c55e',
        speed: road.speed_kmh,
      },
      geometry: {
        type: 'LineString',
        coordinates: road.coordinates || [],
      },
    }));
    return { type: 'FeatureCollection', features };
  }, [roads]);

  const mapStyle = MAPBOX_STYLES[basemap] || MAPBOX_STYLES.satellite;

  if (!HAS_MAPBOX) {
    return (
      <div style={{ height }} className="relative overflow-hidden rounded-xl">
        <LeafletTrafficMap
          roads={roads}
          incidents={incidents}
          height="100%"
          basemap={basemap}
        />
        <MapBasemapControl value={basemap} onChange={setBasemap} provider="osm" />
        <Legend />
      </div>
    );
  }

  return (
    <div style={{ height }} className="relative overflow-hidden rounded-xl">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={mapStyle}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />

        {showMapboxTraffic && (
          <Source id="mapbox-traffic" type="vector" url="mapbox://mapbox.mapbox-traffic-v1">
            <Layer
              id="mapbox-traffic-flow"
              type="line"
              source-layer="traffic"
              paint={{
                'line-width': 3,
                'line-opacity': 0.75,
                'line-color': [
                  'match',
                  ['get', 'congestion'],
                  'low',
                  '#22c55e',
                  'moderate',
                  '#eab308',
                  'heavy',
                  '#f97316',
                  'severe',
                  '#ef4444',
                  '#94a3b8',
                ],
              }}
            />
          </Source>
        )}

        <Source id="roads" type="geojson" data={geojson}>
          <Layer
            id="road-lines"
            type="line"
            paint={{
              'line-color': ['get', 'color'],
              'line-width': 6,
              'line-opacity': basemap === 'satellite' ? 0.95 : showMapboxTraffic ? 0.55 : 0.85,
            }}
          />
        </Source>

        {incidents
          .filter((i) => i.status === 'active')
          .map((inc) => (
            <Marker
              key={inc.id}
              longitude={inc.longitude}
              latitude={inc.latitude}
              anchor="bottom"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-lg text-xs font-bold text-white"
                style={{ backgroundColor: INCIDENT_TYPES[inc.type]?.color || '#ef4444' }}
                title={inc.title}
              >
                !
              </div>
            </Marker>
          ))}
      </Map>

      <MapBasemapControl value={basemap} onChange={setBasemap} provider="mapbox" />
      <Legend />
    </div>
  );
}

function Legend() {
  return (
    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 sm:gap-3 rounded-lg bg-slate-900/90 px-3 sm:px-4 py-2 text-xs text-white max-w-[calc(100%-2rem)] z-[1000] pointer-events-none">
      {Object.entries(STATUS_COLORS).map(([status, color]) => (
        <span key={status} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
          {status}
        </span>
      ))}
    </div>
  );
}
