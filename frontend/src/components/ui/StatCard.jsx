export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue' }) {
  const colors = {
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/5 border-green-500/30',
    yellow: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30',
    red: 'from-red-500/20 to-red-600/5 border-red-500/30',
  };

  return (
    <div
      className={`rounded-xl border bg-gradient-to-br p-5 ${colors[color]} dark:bg-slate-900/50`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="rounded-lg bg-white/80 p-2 shadow-sm dark:bg-slate-800">
            <Icon className="h-5 w-5 text-tariki-600" />
          </div>
        )}
      </div>
    </div>
  );
}
