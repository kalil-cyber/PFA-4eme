import { Fragment } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet';
import { STATUS_COLORS } from '../../utils/traffic';

const CASABLANCA_CENTER = [33.5731, -7.5898];

function zoneColor(zone) {
  const next = zone.predictions?.[zone.predictions.length - 1];
  const level = next?.congestion_level ?? zone.current?.congestion_level ?? 55;
  if (level >= 65) return STATUS_COLORS.congested;
  if (level >= 52) return STATUS_COLORS.moderate;
  return STATUS_COLORS.fluid;
}

export default function PredictionMap({ zones = [], height = '480px', selectedId, onSelectZone }) {
  return (
    <div style={{ height }} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 z-0">
      <MapContainer center={CASABLANCA_CENTER} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {zones.map((zone) => {
          const color = zoneColor(zone);
          const next = zone.predictions?.[zone.predictions.length - 1];
          const isSelected = selectedId === zone.segment_id;
          const positions = (zone.coordinates || []).map((c) => [c[1], c[0]]);

          return (
            <Fragment key={zone.segment_id}>
              {positions.length >= 2 && (
                <Polyline
                  positions={positions}
                  pathOptions={{
                    color,
                    weight: isSelected ? 8 : 5,
                    opacity: 0.85,
                    dashArray: '8 6',
                  }}
                />
              )}
              <CircleMarker
                center={[zone.latitude, zone.longitude]}
                radius={isSelected ? 14 : 10}
                pathOptions={{
                  color: isSelected ? '#2563eb' : color,
                  fillColor: color,
                  fillOpacity: 0.75,
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => onSelectZone?.(zone.segment_id),
                }}
              >
                <Popup>
                  <div className="text-sm min-w-[160px]">
                    <p className="font-semibold">{zone.zone_name}</p>
                    <p className="text-slate-600 mt-1">
                      Actuel : {zone.current?.congestion_level ?? '—'}%
                    </p>
                    <p className="font-medium" style={{ color }}>
                      Prévu +30 min : {next?.congestion_level ?? '—'}%
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Tendance : {zone.trend} • R² {zone.r2}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{zone.model_label}</p>
                  </div>
                </Popup>
              </CircleMarker>
            </Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
