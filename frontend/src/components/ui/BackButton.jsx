import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function BackButton({
  to,
  label = 'Retour',
  onClick,
  className = '',
  variant = 'default',
  prominent = false,
  icon: Icon,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    else if (to) navigate(to);
    else navigate(-1);
  };

  const styles =
    variant === 'light' && prominent
      ? 'text-white border border-white/45 bg-white/15 hover:bg-white/25 shadow-md'
      : variant === 'light'
        ? 'text-white/90 hover:text-white hover:bg-white/10'
        : prominent
        ? 'text-tariki-700 bg-tariki-50 border border-tariki-200 hover:bg-tariki-100 dark:text-tariki-300 dark:bg-tariki-950/50 dark:border-tariki-800 dark:hover:bg-tariki-950'
        : 'text-slate-600 hover:text-tariki-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-tariki-400';

  const TrailingIcon = Icon;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors ${styles} ${className}`}
    >
      <ChevronLeft className="h-4 w-4 shrink-0" strokeWidth={2} />
      {label}
      {TrailingIcon && <TrailingIcon className="h-4 w-4 shrink-0 opacity-80" />}
    </button>
  );
}
