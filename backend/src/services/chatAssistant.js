import { getTrafficSnapshot } from './trafficSimulator.js';
import { getLastForecast, refreshPredictions } from './predictionService.js';
import { composeSmartReply } from './chatBrain.js';

async function buildTrafficContext() {
  const { roads, stats, incidents } = await getTrafficSnapshot();
  const forecast = getLastForecast() || (await refreshPredictions(6).catch(() => null));
  const congested = roads.filter((r) => r.status === 'congested');
  const topCongested = [...roads]
    .sort((a, b) => b.congestion_level - a.congestion_level)
    .slice(0, 8);

  return {
    city: 'Casablanca',
    stats,
    roads: roads.map((r) => ({
      id: r.id,
      name: r.name,
      status: r.status,
      congestion_level: r.congestion_level,
      speed_kmh: r.speed_kmh,
    })),
    active_incidents: incidents.filter((i) => i.status === 'active'),
    congested_segments: congested.map((r) => ({
      name: r.name,
      level: r.congestion_level,
      speed: r.speed_kmh,
    })),
    top_congested: topCongested.map((r) => ({
      name: r.name,
      level: r.congestion_level,
      status: r.status,
      speed: r.speed_kmh,
    })),
    prediction_summary: forecast?.summary || null,
    forecast,
    segment_count: roads.length,
  };
}

function normalize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function systemPrompt(ctx) {
  return `Tu es l'assistant Tariki, expert trafic et guide de la plateforme smart city Casablanca (Maroc).
Réponds TOUJOURS en français, de façon structurée, proactive et précise. Combine données temps réel + conseils pratiques.
Tu gères : trafic, incidents, prévisions, météo, inscription (/connexion), itinéraires (/driver), carte (/carte).
Pour questions composées (ex. météo ET congestion), réponds aux deux parties. Cite des chiffres des données fournies.
Si hors sujet, réponds en une phrase puis propose une action Tariki utile.
Données temps réel:
- Segments: ${ctx.segment_count}
- Fluide: ${ctx.stats?.fluid}, Modéré: ${ctx.stats?.moderate}, Congestionné: ${ctx.stats?.congested}
- Congestion moyenne: ${Math.round(ctx.stats?.avg_congestion || 0)}%
- Vitesse moyenne: ${Math.round(ctx.stats?.avg_speed_kmh || 0)} km/h
- Incidents actifs: ${ctx.active_incidents.length}
${ctx.active_incidents.map((i) => `- ${i.type}: ${i.title}`).join('\n')}
Top congestion: ${ctx.top_congested.map((r) => `${r.name} (${r.level}%)`).join(', ')}
${ctx.prediction_summary ? `Prévision: ${JSON.stringify(ctx.prediction_summary)}` : ''}`;
}

async function localReply(message, ctx, history = []) {
  const q = normalize(message);

  if (/merci|au revoir|bye|ciao/.test(q)) {
    return 'Avec plaisir ! Bonne route à Casablanca. Je reste disponible pour le trafic ou l\'inscription.';
  }

  if (/parle|voix|oral|ecoute|entendre/.test(q)) {
    return 'Activez le bouton **haut-parleur** : je lirai mes réponses à voix haute. Vous pouvez aussi **déplacer** la fenêtre en la faisant glisser depuis l\'en-tête.';
  }

  if (/webcam|camera|video|surveillance/.test(q)) {
    return 'Les **webcams** des axes majeurs sont sur **/webcams**. Idéal pour confirmer visuellement un embouteillage.';
  }

  if (/poi|interet|lieu|station|hopital/.test(q)) {
    return 'Les **points d\'intérêt** sont sur **/interet** (OpenStreetMap).';
  }

  if (/evenement|manifestation|match|concert/.test(q)) {
    return 'Agenda **/evenements** — vérifiez avant un déplacement vers le centre.';
  }

  if (/carte|plan|cartographie/.test(q)) {
    return `Carte live **/carte** : ${ctx.segment_count} segments Waze Casablanca (vert / orange / rouge).`;
  }

  if (/casablanca|ville|dataset|waze|tariki/.test(q)) {
    return '**Tariki** — mobilité smart city Casablanca, dataset Waze, prévisions IA. Inscription : **/connexion**.';
  }

  return composeSmartReply(message, ctx, history);
}

async function openAiReply(message, ctx, history = []) {
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const messages = [
    { role: 'system', content: systemPrompt(ctx) },
    ...history.slice(-12).map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ];

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 700,
      temperature: 0.55,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI: ${res.status} ${err.slice(0, 120)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || 'Réponse vide.';
}

export async function chatReply(message, history = []) {
  const ctx = await buildTrafficContext();
  const trimmed = (message || '').trim();
  if (!trimmed) {
    return { reply: 'Posez une question sur le trafic, l\'inscription (/connexion) ou les services Tariki à Casablanca.', mode: 'local', context: ctx };
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      const reply = await openAiReply(trimmed, ctx, history);
      return { reply, mode: 'openai', context: ctx };
    } catch (err) {
      const fallback = await localReply(trimmed, ctx, history);
      return {
        reply: `${fallback}\n\n_(Mode enrichi temporairement indisponible)_`,
        mode: 'local-fallback',
        context: ctx,
      };
    }
  }

  return { reply: await localReply(trimmed, ctx, history), mode: 'smart', context: ctx };
}
