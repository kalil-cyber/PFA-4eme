/** Illustrations style autocollant — remplace les emojis du menu */

const STICKERS = {
  car: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect x="8" y="28" width="48" height="20" rx="6" fill="#3b82f6" />
      <path d="M14 28 L20 18 H44 L50 28" fill="#2563eb" />
      <rect x="16" y="32" width="10" height="8" rx="2" fill="#93c5fd" />
      <rect x="38" y="32" width="10" height="8" rx="2" fill="#93c5fd" />
      <circle cx="20" cy="48" r="6" fill="#1e293b" />
      <circle cx="44" cy="48" r="6" fill="#1e293b" />
      <circle cx="20" cy="48" r="2.5" fill="#94a3b8" />
      <circle cx="44" cy="48" r="2.5" fill="#94a3b8" />
      <path d="M28 24 h8 v4 h-8z" fill="#fbbf24" />
    </svg>
  ),
  map: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect x="10" y="12" width="44" height="40" rx="4" fill="#10b981" opacity="0.2" />
      <path d="M14 16 H50 V48 H14 Z" stroke="#059669" strokeWidth="2" fill="#ecfdf5" />
      <path d="M22 20 L32 36 L42 24 L50 40" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="22" cy="20" r="4" fill="#ef4444" />
      <circle cx="42" cy="24" r="4" fill="#eab308" />
      <circle cx="32" cy="36" r="4" fill="#22c55e" />
      <path d="M48 14 L54 20 L48 26 Z" fill="#3b82f6" />
    </svg>
  ),
  chat: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <path
        d="M12 14 H52 V38 H36 L28 48 L30 38 H12 Z"
        fill="#8b5cf6"
        stroke="#6d28d9"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="26" r="2" fill="white" />
      <circle cx="32" cy="26" r="2" fill="white" />
      <circle cx="40" cy="26" r="2" fill="white" />
      <rect x="44" y="8" width="12" height="10" rx="3" fill="#f59e0b" />
      <path d="M46 12 h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  help: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="22" fill="#f59e0b" />
      <circle cx="32" cy="32" r="18" fill="#fbbf24" />
      <path
        d="M32 20 c4 0 6 2.5 6 5.5 c0 3 -4 3.5 -4 7 h-3 c0 -4.5 4 -5 4 -8 c0 -3.5 -3 -5.5 -6 -4"
        stroke="#b45309"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="32" cy="44" r="3" fill="#b45309" />
    </svg>
  ),
  weather: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="24" cy="26" r="10" fill="#fbbf24" />
      <path
        d="M24 12 v4 M24 36 v4 M12 26 h4 M32 26 h4 M15 15 l3 3 M30 33 l3 3 M33 15 l-3 3 M18 33 l-3 3"
        stroke="#f59e0b"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 38 c0 -8 6 -12 14 -10 c6 1 10 6 10 12 c0 8 -8 12 -16 10 c-5 -1 -8 -6 -8 -12 z"
        fill="#94a3b8"
      />
      <path
        d="M28 42 h16"
        stroke="#64748b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3 3"
      />
    </svg>
  ),
  poi: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <path d="M32 8 C22 8 16 18 16 28 c0 14 16 28 16 28 s16 -14 16 -28 c0 -10 -6 -20 -16 -20 z" fill="#ef4444" />
      <circle cx="32" cy="26" r="8" fill="white" />
      <rect x="26" y="22" width="12" height="10" rx="1" fill="#fca5a5" />
      <path d="M28 26 h8 M32 22 v10" stroke="#dc2626" strokeWidth="1.5" />
      <rect x="38" y="12" width="14" height="12" rx="2" fill="#3b82f6" opacity="0.9" />
      <path d="M42 16 h6 M45 13 v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  webcam: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect x="10" y="20" width="36" height="26" rx="4" fill="#334155" />
      <circle cx="28" cy="33" r="10" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
      <circle cx="28" cy="33" r="5" fill="#38bdf8" opacity="0.6" />
      <rect x="46" y="26" width="8" height="14" rx="2" fill="#475569" />
      <circle cx="14" cy="16" r="3" fill="#ef4444" className="animate-pulse" />
      <path d="M8 48 h48" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  event: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect x="12" y="14" width="40" height="38" rx="4" fill="#fff" stroke="#f97316" strokeWidth="2" />
      <rect x="12" y="14" width="40" height="12" rx="4" fill="#f97316" />
      <path d="M22 12 v6 M42 12 v6" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="36" r="3" fill="#3b82f6" />
      <circle cx="32" cy="40" r="3" fill="#22c55e" />
      <circle cx="40" cy="34" r="3" fill="#a855f7" />
      <path d="M20 44 h24" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      <rect x="44" y="38" width="10" height="14" rx="2" fill="#fbbf24" />
    </svg>
  ),
  sparkles: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <path d="M32 8 L34 26 L52 28 L34 30 L32 48 L30 30 L12 28 L30 26 Z" fill="#38bdf8" />
      <path d="M48 12 L49 18 L55 19 L49 20 L48 26 L47 20 L41 19 L47 18 Z" fill="#a78bfa" />
      <path d="M14 40 L15 44 L19 45 L15 46 L14 50 L13 46 L9 45 L13 44 Z" fill="#f472b6" />
    </svg>
  ),
};

export default function StickerIcon({ type = 'car', size = 48, className = '' }) {
  const Sticker = STICKERS[type] || STICKERS.car;
  return (
    <span className={`inline-flex ${className}`} role="img" aria-label={type}>
      <Sticker size={size} />
    </span>
  );
}

export function StickerBadge({ type, size = 52, className = '' }) {
  return (
    <span
      className={`shrink-0 inline-flex items-center justify-center rounded-2xl bg-white p-1.5 shadow-lg ring-2 ring-white/60 ${className}`}
      style={{ transform: 'rotate(-4deg)' }}
    >
      <StickerIcon type={type} size={size} />
    </span>
  );
}
