import { getCached, setCached } from './cache.js';

const CASA = { lat: 33.5731, lng: -7.5898 };

const WMO_LABELS = {
  0: 'Ciel dégagé',
  1: 'Principalement dégagé',
  2: 'Partiellement nuageux',
  3: 'Couvert',
  45: 'Brouillard',
  48: 'Brouillard givrant',
  51: 'Bruine légère',
  53: 'Bruine',
  55: 'Bruine dense',
  61: 'Pluie faible',
  63: 'Pluie',
  65: 'Forte pluie',
  71: 'Neige faible',
  80: 'Averses',
  95: 'Orage',
};

function wmoLabel(code) {
  return WMO_LABELS[code] ?? 'Conditions variables';
}

function windDir(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(deg / 45) % 8];
}

function forecastIcon(code) {
  if (code === 0 || code === 1) return 'sun';
  if (code >= 61 && code <= 67) return 'rain';
  if (code >= 51) return 'cloud';
  return 'partly';
}

export async function getCasablancaWeather() {
  const cacheKey = 'weather:casa';
  const cached = getCached(cacheKey, 15 * 60 * 1000);
  if (cached) return cached;

  const params = new URLSearchParams({
    latitude: String(CASA.lat),
    longitude: String(CASA.lng),
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,uv_index',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'Africa/Casablanca',
    forecast_days: '5',
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error(`Météo: ${res.status}`);
  const data = await res.json();

  const c = data.current;
  const daily = data.daily;
  const dayNames = ['Aujourd\'hui', 'Demain', 'Après-demain'];

  const forecast = daily.time.slice(0, 5).map((iso, i) => ({
    day: dayNames[i] || new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long' }),
    icon: forecastIcon(daily.weather_code[i]),
    high: Math.round(daily.temperature_2m_max[i]),
    low: Math.round(daily.temperature_2m_min[i]),
    precip: daily.precipitation_probability_max[i] ?? 0,
  }));

  let drivingTip = 'Conditions normales sur le réseau urbain.';
  const windKmh = Math.round(c.wind_speed_10m ?? 0);
  if (windKmh > 35) drivingTip = 'Vent fort — prudence sur la corniche et les viaducs.';
  else if ((daily.precipitation_probability_max[0] ?? 0) > 50) {
    drivingTip = 'Risque de pluie — allongez les distances de sécurité.';
  } else if (c.weather_code >= 45 && c.weather_code <= 48) {
    drivingTip = 'Brouillard possible — allumez les feux et réduisez la vitesse.';
  }

  const payload = {
    source: 'open-meteo',
    city: 'Casablanca',
    updatedAt: new Date().toISOString(),
    current: {
      tempC: Math.round(c.temperature_2m),
      feelsLikeC: Math.round(c.apparent_temperature),
      condition: wmoLabel(c.weather_code),
      humidity: Math.round(c.relative_humidity_2m),
      windKmh,
      windDir: windDir(c.wind_direction_10m ?? 0),
      uv: Math.round(c.uv_index ?? 0),
    },
    forecast,
    drivingTip,
  };

  setCached(cacheKey, payload);
  return payload;
}
