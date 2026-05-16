import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet';
import { STATUS_COLORS, INCIDENT_TYPES } from '../../utils/traffic';
import { LEAFLET_BASEMAPS } from '../../constants/mapBasemaps';
import { CASABLANCA_MAP_VIEW } from '../../constants/city';

const CENTER = [CASABLANCA_MAP_VIEW.latitude, CASABLANCA_MAP_VIEW.longitude];

export default function LeafletTrafficMap({
  roads = [],
  incidents = [],
  height = '100%',
  basemap = 'satellite',
}) {
  const tiles = LEAFLET_BASEMAPS[basemap] || LEAFLET_BASEMAPS.satellite;

  return (
    <div style={{ height }} className="relative z-0">
      <MapContainer
        center={CENTER}
        zoom={CASABLANCA_MAP_VIEW.zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          key={basemap}
          attribution={tiles.attribution}
          url={tiles.url}
          maxZoom={tiles.maxZoom}
        />

        {roads.map((road) => {
          const positions = (road.coordinates || [])
            .filter((c) => Array.isArray(c) && c.length >= 2)
            .map((c) => [c[1], c[0]]);
          if (positions.length < 2) return null;
          const color = STATUS_COLORS[road.status] || '#22c55e';
          return (
            <Polyline
              key={road.id}
              positions={positions}
              pathOptions={{
                color,
                weight: 6,
                opacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            >
              <Popup>
                <div className="text-sm min-w-[140px]">
                  <p className="font-semibold">{road.name}</p>
                  <p className="text-slate-600 mt-0.5">
                    {road.congestion_level ?? '—'}% · {road.speed_kmh ?? '—'} km/h
                  </p>
                  <p className="text-xs capitalize mt-1" style={{ color }}>
                    {road.status}
                  </p>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {incidents
          .filter((i) => i.status === 'active')
          .map((inc) => (
            <CircleMarker
              key={inc.id}
              center={[inc.latitude, inc.longitude]}
              radius={10}
              pathOptions={{
                color: '#fff',
                weight: 2,
                fillColor: INCIDENT_TYPES[inc.type]?.color || '#ef4444',
                fillOpacity: 1,
              }}
            >
              <Popup>
                <p className="text-sm font-semibold">{inc.title}</p>
                <p className="text-xs text-slate-500">{inc.type}</p>
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>
    </div>
  );
}
