import { useId } from 'react';

const SIZES = { xs: 36, sm: 48, md: 56, lg: 72, xl: 96, '2xl': 112, '3xl': 128 };

const WORDMARK = {
  xs: { title: 'text-base', sub: 'text-[10px]' },
  sm: { title: 'text-lg', sub: 'text-[11px]' },
  md: { title: 'text-xl', sub: 'text-xs' },
  lg: { title: 'text-2xl sm:text-3xl', sub: 'text-xs sm:text-sm' },
  xl: { title: 'text-3xl sm:text-4xl', sub: 'text-sm' },
  '2xl': { title: 'text-4xl sm:text-5xl', sub: 'text-sm sm:text-base' },
  '3xl': { title: 'text-4xl sm:text-5xl', sub: 'text-base' },
};

/**
 * dimension:
 * - flat : logo plat (sidebar, petites tailles)
 * - 3d   : relief statique
 * - 4d / live : 3D animé (temps : rotation, feux, reflet)
 */
export default function TarikiLogo({
  size = 'md',
  variant = 'icon',
  dimension = 'flat',
  animated = false,
  className = '',
  showWordmark = false,
  inverted = false,
}) {
  const uid = useId().replace(/:/g, '');
  const px = SIZES[size] || SIZES.md;
  const isFull = variant === 'full' || showWordmark;
  const wm = WORDMARK[size] || WORDMARK.md;
  const dim = dimension === 'live' ? '4d' : dimension;
  const is3d = dim === '3d' || dim === '4d';
  const is4d = dim === '4d' || (animated && is3d);

  const icon = is3d ? (
    <div
      className={`tariki-logo-3d-wrap shrink-0 ${is4d ? 'tariki-logo-4d' : ''} ${className}`}
      style={{ width: px, height: px }}
      aria-hidden="true"
    >
      {is4d && <span className="tariki-logo-4d-halo" />}
      <svg
        width={px}
        height={px}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="tariki-logo-3d-svg"
      >
        <defs>
          <linearGradient id={`${uid}-face`} x1="8" y1="6" x2="44" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60a5fa" />
            <stop offset="0.45" stopColor="#2563eb" />
            <stop offset="1" stopColor="#1e3a8a" />
          </linearGradient>
          <linearGradient id={`${uid}-shine`} x1="14" y1="8" x2="38" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id={`${uid}-shadow`} x="-20%" y="-10%" width="140%" height="150%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.45" />
          </filter>
          <radialGradient id={`${uid}-g`} cx="35%" cy="30%" r="65%">
            <stop stopColor="#4ade80" />
            <stop offset="1" stopColor="#15803d" />
          </radialGradient>
          <radialGradient id={`${uid}-y`} cx="35%" cy="30%" r="65%">
            <stop stopColor="#fde047" />
            <stop offset="1" stopColor="#a16207" />
          </radialGradient>
          <radialGradient id={`${uid}-r`} cx="35%" cy="30%" r="65%">
            <stop stopColor="#f87171" />
            <stop offset="1" stopColor="#b91c1c" />
          </radialGradient>
        </defs>
        <g className={is4d ? 'tariki-logo-4d-extrude' : undefined}>
          <rect x="8" y="10" width="40" height="40" rx="11" fill="#0f172a" opacity="0.85" />
          <rect x="6" y="8" width="40" height="40" rx="11" fill="#1e3a8a" />
        </g>
        <g filter={`url(#${uid}-shadow)`} className={is4d ? 'tariki-logo-4d-face' : undefined}>
          <rect x="4" y="4" width="40" height="40" rx="11" fill={`url(#${uid}-face)`} />
          <path
            d="M8 18 L28 8 L44 18 L44 22 L8 22 Z"
            fill={`url(#${uid}-shine)`}
            opacity="0.9"
            className={is4d ? 'tariki-logo-4d-shine' : undefined}
          />
          <path
            d="M11 38c5-9 10-11 17-11s12 2 17 11"
            stroke="#1e3a8a"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.35"
          />
          <path
            d="M13 34c4-6 9-8 15-8s11 2 15 8"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            className={is4d ? 'tariki-logo-4d-road' : undefined}
          />
          <g className={is4d ? 'tariki-logo-4d-lights' : undefined}>
            <circle
              cx="18"
              cy="22"
              r="4"
              fill={`url(#${uid}-g)`}
              className={is4d ? 'tariki-logo-4d-dot tariki-logo-4d-dot-g' : ''}
            />
            <circle
              cx="28"
              cy="18"
              r="4"
              fill={`url(#${uid}-y)`}
              className={is4d ? 'tariki-logo-4d-dot tariki-logo-4d-dot-y' : ''}
            />
            <circle
              cx="38"
              cy="22"
              r="4"
              fill={`url(#${uid}-r)`}
              className={is4d ? 'tariki-logo-4d-dot tariki-logo-4d-dot-r' : ''}
            />
          </g>
          <ellipse
            cx="22"
            cy="42"
            rx="14"
            ry="3"
            fill="#0f172a"
            opacity="0.25"
            className={is4d ? 'tariki-logo-4d-shadow-oval' : undefined}
          />
        </g>
      </svg>
    </div>
  ) : (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${animated ? 'animate-logo-pulse' : ''} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={uid} x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill={`url(#${uid})`} />
      <path
        d="M10 34c5-8 10-10 16-10s11 2 16 10"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
      <path
        d="M12 30c4-5.5 8.5-7 12-7s8 1.5 12 7"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="16" cy="18" r="3.2" fill="#22c55e" className={animated ? 'animate-traffic-4d' : ''} />
      <circle cx="24" cy="15" r="3.2" fill="#eab308" className={animated ? 'animate-traffic-4d' : ''} style={{ animationDelay: '200ms' }} />
      <circle cx="32" cy="18" r="3.2" fill="#ef4444" className={animated ? 'animate-traffic-4d' : ''} style={{ animationDelay: '400ms' }} />
    </svg>
  );

  if (!isFull) return icon;

  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className}`}>
      {icon}
      <div className="min-w-0">
        <p
          className={`font-bold leading-tight tracking-tight ${wm.title} ${
            inverted ? 'text-white text-shadow-daylight' : 'text-slate-900 dark:text-white'
          } ${is4d ? 'tariki-logo-4d-wordmark' : ''}`}
        >
          Tariki
        </p>
        <p
          className={`font-semibold uppercase tracking-widest ${wm.sub} ${
            inverted ? 'text-white/90 text-shadow-daylight' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Smart Traffic
        </p>
      </div>
    </div>
  );
}
