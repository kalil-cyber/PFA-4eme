import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { CASABLANCA_MAP_VIEW } from '../../constants/city';

const CENTER = [CASABLANCA_MAP_VIEW.latitude, CASABLANCA_MAP_VIEW.longitude];

const COLORS = {
  webcam: '#2563eb',
  peage: '#f59e0b',
  feu: '#ef4444',
  surveillance: '#8b5cf6',
};

const ZONE_LABEL = { ville: 'Ville', autoroute: 'Autoroute' };

function dot(color) {
  return L.divIcon({
    className: '',
    html: `<span style="display:block;width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

export default function WebcamsMap({ points = [], filter = 'all', height = 400 }) {
  const visible = points.filter((p) => {
    if (!Number.isFinite(p.latitude)) return false;
    if (filter === 'all') return true;
    if (filter === 'ville' || filter === 'autoroute') return p.zone === filter;
    return p.category === filter;
  });

  return (
    <div
      className="rounded-2xl border border-slate-200 overflow-hidden dark:border-slate-700"
      style={{ height }}
    >
      <MapContainer
        center={CENTER}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
        preferCanvas
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        {visible.map((p) => {
          const color = COLORS[p.category] || '#64748b';
          const isFeu = p.category === 'feu';
          const MarkerComp = isFeu ? CircleMarker : Marker;
          const props = isFeu
            ? {
                center: [p.latitude, p.longitude],
                radius: 6,
                pathOptions: { color, fillColor: color, fillOpacity: 0.8 },
              }
            : {
                position: [p.latitude, p.longitude],
                icon: dot(color),
              };

          return (
            <MarkerComp key={p.id} {...props}>
              <Popup>
                <p className="font-semibold text-sm">{p.name}</p>
                <p className="text-xs text-slate-600 capitalize">
                  {p.category} · {ZONE_LABEL[p.zone] || p.zone}
                </p>
                {p.description && <p className="text-xs mt-1">{p.description}</p>}
              </Popup>
            </MarkerComp>
          );
        })}
      </MapContainer>
    </div>
  );
}
