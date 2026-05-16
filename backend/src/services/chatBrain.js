import { buildPredictionInsights } from './predictionAnalyst.js';
import { getCasablancaWeather } from './weatherService.js';
import { refreshPredictions } from './predictionService.js';

export function normalizeText(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const INTENT_PATTERNS = [
  { id: 'greeting', re: /bonjour|salut|hello|coucou|bonsoir/, weight: 1 },
  { id: 'help', re: /aide|help|que peux|comment utiliser|fonctionnalite|service/, weight: 1 },
  { id: 'auth', re: /inscription|inscrire|compte|register|signup|mot de passe|connexion|connecter|login/, weight: 1.2 },
  { id: 'incidents', re: /incident|accident|bouchon|ferme|travaux|bloque/, weight: 1.1 },
  { id: 'congestion', re: /congestion|embouteillage|dense|ralenti|bouchon|charge|traffic|circulation/, weight: 1 },
  { id: 'avoid', re: /eviter|contourner|alternative|detour|plus rapide|meilleur chemin/, weight: 1.1 },
  { id: 'prediction', re: /previction|prevision|futur|demain|30 min|dans 1 h|analyse|tendance|evolution/, weight: 1.1 },
  { id: 'route', re: /itineraire|route|aller|trajet|comment aller/, weight: 1 },
  { id: 'weather', re: /meteo|pluie|vent|temperature|temps qu il fait|neige/, weight: 1 },
  { id: 'compare', re: /pire|meilleur|plus congestion|plus fluide|comparer|versus|\bvs\b/, weight: 1.2 },
  { id: 'summary', re: /resume|synthese|situation|etat|bilan|global/, weight: 1 },
  { id: 'time', re: /maintenant|heure|pointe|matin|soir|week-end|weekend/, weight: 0.9 },
];

export function scoreIntents(message) {
  const q = normalizeText(message);
  return INTENT_PATTERNS.map(({ id, re, weight }) => ({
    id,
    score: re.test(q) ? weight : 0,
  }))
    .filter((i) => i.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function findRoadsInMessage(message, roads, limit = 3) {
  const q = normalizeText(message);
  const matches = roads
    .map((r) => {
      const n = normalizeText(r.name);
      const tokens = n.split(/[\s—\-]+/).filter((p) => p.length > 3);
      let score = 0;
      if (q.includes(n.slice(0, Math.min(n.length, 14)))) score += 3;
      tokens.forEach((t) => {
        if (q.includes(t)) score += 2;
      });
      return { road: r, score };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
  return matches.slice(0, limit).map((m) => m.road);
}

function casablancaTimeContext() {
  const now = new Date();
  const hour = parseInt(
    new Intl.DateTimeFormat('fr-FR', { hour: 'numeric', hour12: false, timeZone: 'Africa/Casablanca' }).format(now),
    10
  );
  let period = 'journée';
  let hint = '';
  if (hour >= 7 && hour <= 9) {
    period = 'heure de pointe matinale';
    hint = 'Attendez-vous à plus de trafic vers le centre et les zones d\'affaires.';
  } else if (hour >= 17 && hour <= 20) {
    period = 'heure de pointe du soir';
    hint = 'Les sorties de ville et la corniche sont souvent plus chargées.';
  } else if (hour >= 22 || hour < 6) {
    period = 'nuit';
    hint = 'Circulation en général plus fluide, vigilance sur les axes isolés.';
  } else {
    hint = 'Trafic habituellement modéré en milieu de journée.';
  }
  return { hour, period, hint };
}

function followUpFromHistory(message, history) {
  const q = normalizeText(message);
  if (!history?.length) return null;

  const lastBot = [...history].reverse().find((m) => m.role === 'assistant');
  const lastUser = [...history].reverse().find((m) => m.role === 'user');

  if (/^(oui|ok|d accord|vas y|continue|et alors)$/.test(q) && lastBot) {
    if (/inscription|connexion|compte/.test(normalizeText(lastBot.content))) {
      return { type: 'auth_expand' };
    }
    if (/congestion|incident|prevision/.test(normalizeText(lastBot.content))) {
      return { type: 'traffic_expand' };
    }
  }

  if (q.length < 35 && lastUser && /congestion|trafic|incident|route|prevision/.test(normalizeText(lastUser.content))) {
    if (!INTENT_PATTERNS.some((p) => p.id !== 'greeting' && p.re.test(q))) {
      return { type: 'combine', prior: lastUser.content };
    }
  }

  return null;
}

async function weatherBlock() {
  try {
    const w = await getCasablancaWeather();
    const cur = w?.current;
    if (!cur) return null;
    return `**Météo Casablanca** : ${cur.condition}, **${cur.tempC}°C** (ressenti ${cur.feelsLikeC}°C), vent **${cur.windKmh} km/h** ${cur.windDir}, humidité ${cur.humidity}%.\n${w.drivingTip || ''}\nDétails : **/meteo**`;
  } catch {
    return null;
  }
}

async function predictionBlock(ctx) {
  const forecast = ctx.forecast || (await refreshPredictions(6).catch(() => null));
  if (!forecast) return null;
  const insights = buildPredictionInsights(forecast);
  const parts = insights.executive_summary
    ?.split('\n\n')
    .slice(0, 2)
    .map((p) => p.replace(/\*\*/g, '')) || [];
  const rec = insights.recommendations?.[0];
  return [parts.join('\n'), rec].filter(Boolean).join('\n\n');
}

function networkSummary(ctx, detailed = false) {
  const avg = Math.round(ctx.stats?.avg_congestion || 0);
  const speed = Math.round(ctx.stats?.avg_speed_kmh || 0);
  const lines = [
    `**Réseau Casablanca** (${ctx.segment_count} axes) : congestion moyenne **${avg}%**, vitesse ~**${speed} km/h**.`,
    `Fluide **${ctx.stats?.fluid || 0}** · Modéré **${ctx.stats?.moderate || 0}** · Congestionné **${ctx.stats?.congested || 0}** · Incidents actifs **${ctx.active_incidents.length}**.`,
  ];
  if (detailed && ctx.top_congested?.length) {
    lines.push(
      '',
      '**Axes les plus sensibles :**',
      ...ctx.top_congested.slice(0, 4).map(
        (r) => `• ${r.name} — ${r.level}% (${r.status}, ${r.speed_kmh ?? r.speed} km/h)`
      )
    );
  }
  return lines.join('\n');
}

function registrationBlock(isAdmin) {
  if (isAdmin) {
    return `**Compte administrateur** — **/connexion** → Administrateur. Équipe : kalil@gmail.com / 0000, code admin **0000**.`;
  }
  return `**Inscription** sur **/connexion** : Admin kalil@gmail.com / 0000, conducteur kpl@gmail.com / 0000, code admin **0000**.`;
}

function compareBlock(ctx) {
  const sorted = [...(ctx.roads || [])].sort((a, b) => b.congestion_level - a.congestion_level);
  const worst = sorted[0];
  const best = sorted[sorted.length - 1];
  if (!worst) return null;
  return `**Plus congestionné** : ${worst.name} (${worst.congestion_level}%). **Plus fluide** : ${best?.name} (${best?.congestion_level ?? 0}%). Écart utile pour choisir un itinéraire alternatif via **/driver**.`;
}

/**
 * Moteur de réponse locale enrichi (multi-intentions, contexte horaire, météo, historique).
 */
export async function composeSmartReply(message, ctx, history = []) {
  const raw = (message || '').trim();
  const q = normalizeText(raw);
  const intents = scoreIntents(raw);
  const followUp = followUpFromHistory(raw, history);
  const timeCtx = casablancaTimeContext();
  const roads = findRoadsInMessage(raw, ctx.roads || []);
  const parts = [];

  if (followUp?.type === 'auth_expand') {
    parts.push(registrationBlock(/admin/.test(q)));
  }
  if (followUp?.type === 'traffic_expand') {
    parts.push(networkSummary(ctx, true));
    const pred = await predictionBlock(ctx);
    if (pred) parts.push(pred);
  }
  if (followUp?.type === 'combine' && followUp.prior) {
    const extra = findRoadsInMessage(followUp.prior, ctx.roads || [], 1);
    roads.push(...extra.filter((r) => !roads.find((x) => x.id === r.id)));
  }

  const topIntent = intents[0]?.id;

  if (/bonjour|salut|hello|coucou/.test(q) && parts.length === 0) {
    return `Bonjour ! Je suis **Tariki** (${timeCtx.period}, ~${timeCtx.hour}h à Casablanca). ${timeCtx.hint}\n\nPosez-moi une question précise ou combinez plusieurs sujets (ex. « météo et congestion vers Maarif »).`;
  }

  if ((topIntent === 'auth' || /inscription|connexion|compte/.test(q)) && parts.length === 0) {
    parts.push(registrationBlock(/admin/.test(q)));
  }

  if (topIntent === 'weather' || (/meteo|pluie|temperature/.test(q) && intents.find((i) => i.id === 'weather'))) {
    const w = await weatherBlock();
    if (w) parts.push(w);
  }

  if (topIntent === 'prediction' || /prevision|previction|tendance/.test(q)) {
    const p = await predictionBlock(ctx);
    if (p) parts.push(p);
  }

  if (topIntent === 'incidents' || /incident|accident|travaux/.test(q)) {
    if (ctx.active_incidents.length === 0) {
      parts.push('Aucun incident actif sur le réseau pour le moment.');
    } else {
      parts.push(
        `**${ctx.active_incidents.length} incident(s) actif(s)** :\n${ctx.active_incidents
          .map((i) => `• **${i.title}** — ${i.type}, gravité ${i.severity}`)
          .join('\n')}`
      );
    }
  }

  if (topIntent === 'compare' || /pire|plus congestion|plus fluide/.test(q)) {
    const c = compareBlock(ctx);
    if (c) parts.push(c);
  }

  if (
    topIntent === 'congestion' ||
    topIntent === 'summary' ||
    /congestion|circulation|resume|situation/.test(q)
  ) {
    if (!parts.some((p) => p.includes('Réseau Casablanca'))) {
      parts.push(networkSummary(ctx, intents.length > 1 || /detail|complet/.test(q)));
    }
  }

  if (topIntent === 'avoid' || /eviter|contourner|detour/.test(q)) {
    const bad = ctx.congested_segments?.[0] || ctx.top_congested?.[0];
    if (bad) {
      parts.push(
        `Je vous conseille d'éviter **${bad.name}** (${bad.level}% congestion). ${timeCtx.hint} Itinéraire alternatif : **/driver**.`
      );
    } else {
      parts.push(`Peu de zones critiques actuellement. ${timeCtx.hint}`);
    }
  }

  if (topIntent === 'route' || /itineraire|aller a|comment aller/.test(q)) {
    parts.push(
      'Calculez un trajet optimisé sur **/driver** (départ / arrivée ou raccourcis : Gare Casa-Voyageurs, Marina, Anfa, Maarif). Je peux aussi citer l\'état d\'un axe si vous précisez le nom.'
    );
  }

  if (roads.length > 0) {
    parts.push(
      roads
        .map(
          (r) =>
            `**${r.name}** : ${r.congestion_level}% congestion, ${r.status}, ~${r.speed_kmh} km/h.`
        )
        .join('\n')
    );
  }

  if (topIntent === 'help' && parts.length === 0) {
    parts.push(
      `**Tariki** — trafic temps réel, prévisions IA, météo, webcams, itinéraires, inscription (/connexion).\nExemples : « congestion maintenant », « météo », « incidents », « prévision 30 min », « comment m'inscrire ».`
    );
  }

  if (parts.length === 0) {
    const pred = await predictionBlock(ctx);
    parts.push(networkSummary(ctx, false));
    if (pred && /demain|futur|evolution/.test(q)) parts.push(pred);
    parts.push(
      `\nConcernant « **${raw.slice(0, 100)}${raw.length > 100 ? '…' : ''}** » : précisez un quartier, un axe, ou reformulez (trafic, météo, inscription, itinéraire). ${timeCtx.hint}`
    );
  } else if (intents.length > 1 && !parts.some((p) => p.includes(timeCtx.period))) {
    parts.push(`_Contexte : ${timeCtx.period} à Casablanca — ${timeCtx.hint}_`);
  }

  return [...new Set(parts)].join('\n\n');
}
