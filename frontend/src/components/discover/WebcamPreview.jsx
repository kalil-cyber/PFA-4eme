/** Aperçu stylisé de webcam (pas de flux réel) */

const STYLES = {
  corniche: 'from-sky-400 via-cyan-300 to-blue-500',
  urban: 'from-slate-500 via-slate-400 to-slate-600',
  port: 'from-amber-700 via-slate-600 to-slate-800',
  highway: 'from-emerald-600 via-slate-500 to-slate-700',
};

export default function WebcamPreview({ thumb = 'urban', name, live = true }) {
  const gradient = STYLES[thumb] || STYLES.urban;

  return (
    <div className={`relative aspect-video rounded-xl bg-gradient-to-br ${gradient} overflow-hidden`}>
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.15)_50%,transparent_100%)] animate-pulse" />
      <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white">
        {live && <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />}
        {live ? 'LIVE (démo)' : 'Hors ligne'}
      </div>
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <p className="text-xs font-medium text-white truncate">{name}</p>
      </div>
      <svg className="absolute inset-0 m-auto h-12 w-12 text-white/20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M4 6h2v12H4V6zm14 0h2v12h-2V6zM8 8h8v8H8V8z" />
      </svg>
    </div>
  );
}
