/**
 * Robot Tariki animé — idle, moving, thinking, speaking.
 */
export default function TarikiRobot({
  state = 'idle',
  size = 'md',
  className = '',
  badge = true,
}) {
  const sizes = {
    sm: 'h-12 w-12',
    md: 'h-[4.25rem] w-[4.25rem]',
    lg: 'h-[5.5rem] w-[5.5rem]',
    xl: 'h-32 w-32',
  };

  const badgePad = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
    xl: 'p-2.5',
  };

  const stateClass =
    state === 'moving'
      ? 'tariki-robot-moving'
      : state === 'thinking'
        ? 'tariki-robot-thinking'
        : state === 'speaking'
          ? 'tariki-robot-speaking'
          : 'tariki-robot-idle';

  const svg = (
    <svg
      viewBox="0 0 64 72"
      className="h-full w-full drop-shadow-[0_2px_6px_rgba(15,23,42,0.35)]"
      fill="none"
      aria-hidden
    >
      <ellipse cx="32" cy="68" rx="14" ry="3" className="tariki-robot-shadow" fill="rgba(15,23,42,0.2)" />
      <g className="tariki-robot-body">
        <rect x="20" y="38" width="24" height="22" rx="6" fill="#1d4ed8" stroke="#fff" strokeWidth="1.2" />
        <rect x="22" y="42" width="20" height="10" rx="2" fill="#60a5fa" />
        <circle cx="32" cy="28" r="14" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
        <circle cx="32" cy="28" r="11" fill="#2563eb" />
        <rect
          x="14"
          y="40"
          width="8"
          height="16"
          rx="4"
          fill="#1d4ed8"
          stroke="#fff"
          strokeWidth="1"
          className="tariki-robot-arm-left"
        />
        <rect
          x="42"
          y="40"
          width="8"
          height="16"
          rx="4"
          fill="#1d4ed8"
          stroke="#fff"
          strokeWidth="1"
          className="tariki-robot-arm-right"
        />
        <rect x="24" y="56" width="5" height="8" rx="2" fill="#1e3a8a" className="tariki-robot-leg-left" />
        <rect x="35" y="56" width="5" height="8" rx="2" fill="#1e3a8a" className="tariki-robot-leg-right" />
      </g>
      <g className="tariki-robot-face">
        <circle cx="26" cy="26" r="3.5" fill="#fff" className="tariki-robot-eye-left" />
        <circle cx="38" cy="26" r="3.5" fill="#fff" className="tariki-robot-eye-right" />
        <circle cx="27" cy="26" r="1.5" fill="#0f172a" />
        <circle cx="39" cy="26" r="1.5" fill="#0f172a" />
        <path
          d="M 27 33 Q 32 37 37 33"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          className="tariki-robot-mouth"
        />
      </g>
      <circle cx="32" cy="14" r="2.5" fill="#4ade80" stroke="#fff" strokeWidth="1" className="tariki-robot-antenna-tip" />
      <line x1="32" y1="16" x2="32" y2="14" stroke="#e2e8f0" strokeWidth="2" className="tariki-robot-antenna" />
    </svg>
  );

  return (
    <div
      className={`tariki-robot inline-flex shrink-0 ${sizes[size] || sizes.md} ${stateClass} ${className}`}
      aria-hidden
    >
      {badge ? (
        <div className={`tariki-robot-badge h-full w-full ${badgePad[size] || badgePad.md}`}>
          {svg}
        </div>
      ) : (
        svg
      )}
    </div>
  );
}
