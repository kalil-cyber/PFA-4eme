import { Link } from 'react-router-dom';
import { AUTH_PATH } from '../config/auth';
import {
  Car,
  Map,
  MessageCircle,
  HelpCircle,
  CloudSun,
  Landmark,
  Video,
  CalendarDays,
  Moon,
  Sun,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import TarikiLogo from '../components/brand/TarikiLogo';
import CasablancaPresentationBackground from '../components/brand/CasablancaPresentationBackground';
import { useTheme } from '../context/ThemeContext';

const TRAFFIC_SERVICES = [
  {
    id: 'route',
    to: '/driver',
    icon: Car,
    title: 'Itinéraire intelligent',
    description: 'Calcul d’itinéraire adapté au trafic en temps réel.',
    accent: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  },
  {
    id: 'map',
    to: '/carte',
    icon: Map,
    title: 'Carte du trafic',
    description: 'Dataset Casablanca — segments colorés en temps réel.',
    accent: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  },
  {
    id: 'chat',
    action: 'chat',
    icon: MessageCircle,
    title: 'Assistant Tariki',
    description: 'Interrogation en langage naturel sur la circulation.',
    accent: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  },
  {
    id: 'help',
    to: '/aide',
    icon: HelpCircle,
    title: 'Documentation',
    description: 'Guide d’utilisation et lecture des indicateurs.',
    accent: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
  },
];

const DISCOVER_SERVICES = [
  {
    id: 'weather',
    to: '/meteo',
    icon: CloudSun,
    title: 'Météo',
    description: 'Conditions actuelles et impact sur la conduite.',
    accent: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
  },
  {
    id: 'poi',
    to: '/interet',
    icon: Landmark,
    title: 'Points d’intérêt',
    description: 'Lieux stratégiques et zones d’activité.',
    accent: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  {
    id: 'webcams',
    to: '/webcams',
    icon: Video,
    title: 'Webcams',
    description: 'Surveillance visuelle des axes majeurs.',
    accent: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  {
    id: 'events',
    to: '/evenements',
    icon: CalendarDays,
    title: 'Événements',
    description: 'Agenda et perturbations prévues du trafic.',
    accent: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
  },
];

function ServiceCard({ item, onChat, stacked = false }) {
  const Icon = item.icon;
  const body = stacked ? (
    <>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${item.accent}`}
        aria-hidden
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div className="flex-1 min-w-0 w-full">
        <h3 className="text-base font-semibold text-slate-950 dark:text-white leading-snug">
          {item.title}
        </h3>
        <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-400 leading-relaxed">
          {item.description}
        </p>
      </div>
      <ChevronRight
        className="h-5 w-5 shrink-0 text-slate-300 group-hover:text-tariki-600 transition-colors dark:text-slate-600 dark:group-hover:text-tariki-400"
        strokeWidth={1.75}
        aria-hidden
      />
    </>
  ) : (
    <>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${item.accent}`}
        aria-hidden
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-slate-950 dark:text-white leading-snug">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-400 leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>
      <ChevronRight
        className="h-5 w-5 shrink-0 text-slate-300 group-hover:text-tariki-600 group-hover:translate-x-0.5 transition-all dark:text-slate-600 dark:group-hover:text-tariki-400"
        strokeWidth={1.75}
        aria-hidden
      />
    </>
  );

  const className = stacked
    ? 'group flex h-full w-full flex-col items-start gap-3 rounded-xl surface-daylight p-4 sm:p-5 text-left transition-all hover:border-tariki-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-tariki-500 focus-visible:ring-offset-2 dark:hover:border-tariki-700 sm:min-h-[168px]'
    : 'group flex w-full items-center gap-4 rounded-xl surface-daylight p-4 sm:p-5 text-left transition-all hover:border-tariki-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-tariki-500 focus-visible:ring-offset-2 dark:hover:border-tariki-700';

  if (item.action === 'chat') {
    return (
      <button type="button" onClick={onChat} className={className}>
        {body}
      </button>
    );
  }

  return (
    <Link to={item.to} className={className}>
      {body}
    </Link>
  );
}

function Section({ id, title, subtitle, children }) {
  return (
    <section className="mb-10 sm:mb-12" aria-labelledby={id}>
      <div className="mb-4 sm:mb-6">
        <h2 id={id} className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}


export default function HomePage() {
  const { openChat } = useChat();
  const { dark, toggle } = useTheme();
  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-slate-950">
      <CasablancaPresentationBackground />

      <header className="relative z-30 border-b border-white/20 bg-slate-950/80 backdrop-blur-lg shadow-lg">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <TarikiLogo variant="full" size="lg" inverted className="min-w-0" />
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to={AUTH_PATH}
              className="rounded-lg border border-white/40 bg-slate-900/50 px-3 py-2 text-sm font-semibold text-white shadow-md hover:bg-slate-900/70"
            >
              Connexion
            </Link>
            <button
              type="button"
              onClick={toggle}
              aria-label="Mode clair ou sombre"
              className="rounded-lg border border-white/35 bg-slate-900/40 p-2.5 text-white shadow-md hover:bg-slate-900/60"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <section className="relative z-20 mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20 lg:px-8 lg:pt-16 lg:pb-24">
        <div className="lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:items-end">
          <div className="panel-daylight rounded-2xl p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-200 mb-3 text-shadow-daylight">
              Ville de Casablanca
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-tight text-shadow-daylight">
              Plateforme de mobilité urbaine
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white leading-relaxed max-w-xl text-shadow-daylight">
              Tariki pour Casablanca : trafic en direct, carte, météo et données ville sur la
              métropole marocaine.
            </p>
          </div>

          <div className="mt-8 lg:mt-0 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-white/35 bg-slate-950/75 backdrop-blur-md px-4 py-3 text-sm font-medium text-white shadow-lg min-w-[140px] flex-1 sm:flex-none">
              <span className="flex h-2.5 w-2.5 rounded-full bg-traffic-fluid ring-2 ring-white/50" />
              Fluide
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/35 bg-slate-950/75 backdrop-blur-md px-4 py-3 text-sm font-medium text-white shadow-lg min-w-[140px] flex-1 sm:flex-none">
              <span className="flex h-2.5 w-2.5 rounded-full bg-traffic-moderate ring-2 ring-white/50" />
              Modéré
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/35 bg-slate-950/75 backdrop-blur-md px-4 py-3 text-sm font-medium text-white shadow-lg min-w-[140px] flex-1 sm:flex-none">
              <span className="flex h-2.5 w-2.5 rounded-full bg-traffic-congested ring-2 ring-white/50" />
              Dense
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-sky-300/50 bg-sky-900/60 backdrop-blur-md px-4 py-3 text-sm font-semibold text-white shadow-lg w-full sm:w-auto sm:flex-none">
              <Activity className="h-4 w-4 shrink-0" />
              <span className="font-medium">Données en direct</span>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-12 -mt-4">
        <div className="rounded-t-3xl bg-white dark:bg-slate-950 shadow-2xl border border-slate-300 dark:border-slate-700 px-4 py-10 sm:px-8 sm:py-12">
        <Section
          id="traffic-heading"
          title="Trafic & navigation"
          subtitle="Outils opérationnels pour planifier et suivre vos déplacements."
        >
          <nav
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
            aria-label="Trafic et navigation"
          >
            {TRAFFIC_SERVICES.map((item) => (
              <ServiceCard key={item.id} item={item} onChat={openChat} />
            ))}
          </nav>
        </Section>

        <Section
          id="discover-heading"
          title="Données ville"
          subtitle="Contexte météo, lieux, flux caméra et événements à fort impact."
        >
          <nav
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4"
            aria-label="Données ville"
          >
            {DISCOVER_SERVICES.map((item) => (
              <ServiceCard key={item.id} item={item} onChat={openChat} stacked />
            ))}
          </nav>
        </Section>
        </div>
      </main>

      <footer className="relative z-20 border-t border-slate-300 bg-white py-6 dark:border-slate-800 dark:bg-slate-950 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 px-4">
          © {new Date().getFullYear()} Tariki — Smart City Casablanca
        </p>
        <p className="text-center text-[10px] text-slate-400 mt-2 px-4">
          Photos :{' '}
          <a href="https://www.pexels.com" className="underline hover:text-tariki-600" target="_blank" rel="noreferrer">
            Pexels
          </a>{' '}
          (licence gratuite)
        </p>
      </footer>
    </div>
  );
}
