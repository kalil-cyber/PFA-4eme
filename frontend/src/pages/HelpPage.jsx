import { Link } from 'react-router-dom';
import { Car, Map, MessageCircle } from 'lucide-react';
import PublicShell from '../components/layout/PublicShell';
import { StickerBadge } from '../components/stickers/StickerIcon';

const STEPS = [
  {
    num: '1',
    sticker: 'car',
    icon: Car,
    title: 'Trouver mon chemin',
    text: 'Tu choisis un départ (vert) et une arrivée (rouge). Tu appuies sur le gros bouton bleu. Tariki te dit combien de minutes et quel chemin prendre.',
    to: '/driver',
    btn: 'Essayer',
  },
  {
    num: '2',
    sticker: 'map',
    icon: Map,
    title: 'Voir la carte',
    text: 'Tu vois toute la ville. Les routes vertes vont vite. Les routes rouges sont encombrées.',
    to: '/carte',
    btn: 'Ouvrir la carte',
  },
  {
    num: '3',
    sticker: 'chat',
    icon: MessageCircle,
    title: 'Parler à l’assistant',
    text: 'Pose une question en français. Le bouton chat est en bas à droite.',
    to: '/',
    btn: 'Retour à Tariki',
  },
];

export default function HelpPage() {
  return (
    <PublicShell title="Comment ça marche ?" subtitle="Guide simple en 3 étapes">
      <p className="text-lg text-slate-700 dark:text-slate-200 mb-6 leading-relaxed">
        <strong>Tariki</strong> t’aide à comprendre la circulation à Casablanca.
      </p>

      <ol className="space-y-6">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <li
              key={step.num}
              className="rounded-2xl border-2 border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tariki-600 text-xl font-bold text-white">
                  {step.num}
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold flex items-center gap-2 flex-wrap">
                    <StickerBadge type={step.sticker} size={36} className="!p-1 !ring-0" />
                    <Icon className="h-5 w-5 text-tariki-600" />
                    {step.title}
                  </h2>
                  <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed">{step.text}</p>
                  <Link
                    to={step.to}
                    className="mt-4 inline-flex rounded-xl bg-tariki-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-tariki-700"
                  >
                    {step.btn} →
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 rounded-2xl bg-amber-50 border-2 border-amber-200 p-5 dark:bg-amber-950/30 dark:border-amber-800">
        <p className="font-bold text-amber-900 dark:text-amber-200 mb-1">Astuce</p>
        <p className="text-sm text-amber-800 dark:text-amber-300">
          Perdu ? Appuie sur <strong>Retour à Tariki</strong> en haut ou sur le bouton bleu en bas.
        </p>
      </div>
    </PublicShell>
  );
}
