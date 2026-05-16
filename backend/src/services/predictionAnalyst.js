/**
 * Synthèse « data analyste » à partir des prévisions trafic.
 */

function trendLabel(trend) {
  if (trend === 'rising') return 'hausse';
  if (trend === 'falling') return 'baisse';
  return 'stabilité';
}

function statusLabel(level) {
  if (level >= 70) return 'critique';
  if (level >= 45) return 'chargé';
  if (level >= 25) return 'modéré';
  return 'fluide';
}

function riskFromSummary(summary, zones) {
  const avg = summary?.avg_predicted_30min ?? 0;
  const risingRatio = (summary?.rising ?? 0) / Math.max(zones.length, 1);
  if (avg >= 65 || risingRatio >= 0.5) return 'high';
  if (avg >= 40 || risingRatio >= 0.3) return 'medium';
  return 'low';
}

function buildRecommendations(summary, hotspots, risk) {
  const recs = [];
  if (risk === 'high') {
    recs.push(
      'Prioriser les axes alternatifs sur les 30 prochaines minutes — plusieurs segments montent en congestion.'
    );
  }
  if (summary?.rising > 0 && hotspots.length) {
    recs.push(
      `Surveiller de près **${hotspots[0].zone_name}** : tendance à la hausse (+${hotspots[0].delta} pts prévus).`
    );
  }
  if (summary?.falling > 0) {
    recs.push('Profiter des segments en décongestion pour rééquilibrer les flux vers le centre-ville.');
  }
  if (summary?.avg_predicted_30min < 35) {
    recs.push('Conditions globalement favorables : maintenir la vitesse de croisière et éviter les freinages brusques.');
  } else {
    recs.push('Anticiper +5 à +10 min sur les trajets traversant les zones orange/rouge de la carte.');
  }
  recs.push('Croiser cette analyse avec la page Conducteur pour un itinéraire optimisé en temps réel.');
  return recs.slice(0, 5);
}

export function buildPredictionInsights(forecast) {
  if (!forecast?.zones?.length) {
    return {
      generated_at: new Date().toISOString(),
      empty: true,
      executive_summary: 'Aucune donnée de prévision disponible pour le moment. Lancez une actualisation depuis le tableau de bord.',
      health_score: null,
      risk_level: 'unknown',
      kpis: [],
      hotspots: [],
      cooling_zones: [],
      recommendations: ['Actualiser les prévisions depuis le module Prédiction IA.'],
      zone_insights: [],
    };
  }

  const zones = forecast.zones;
  const summary = forecast.summary || {};

  const enriched = zones.map((z) => {
    const last = z.predictions?.[z.predictions.length - 1];
    const current = z.current?.congestion_level ?? 0;
    const predicted = last?.congestion_level ?? current;
    const delta = predicted - current;
    return { ...z, currentLevel: current, predictedLevel: predicted, delta };
  });

  const avgCurrent = Math.round(
    enriched.reduce((s, z) => s + z.currentLevel, 0) / enriched.length
  );
  const avgPredicted = summary.avg_predicted_30min ?? Math.round(
    enriched.reduce((s, z) => s + z.predictedLevel, 0) / enriched.length
  );
  const globalDelta = avgPredicted - avgCurrent;

  const hotspots = [...enriched]
    .filter((z) => z.trend === 'rising' || z.delta >= 5)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 5)
    .map((z) => ({
      segment_id: z.segment_id,
      zone_name: z.zone_name,
      current: z.currentLevel,
      predicted: z.predictedLevel,
      delta: z.delta,
      trend: z.trend,
      narrative: `${z.zone_name} passe de ${z.currentLevel}% à ~${z.predictedLevel}% (${trendLabel(z.trend)}).`,
    }));

  const cooling_zones = [...enriched]
    .filter((z) => z.trend === 'falling' || z.delta <= -3)
    .sort((a, b) => a.delta - b.delta)
    .slice(0, 3)
    .map((z) => ({
      zone_name: z.zone_name,
      delta: z.delta,
      narrative: `Décongestion attendue sur ${z.zone_name} (${z.delta} pts).`,
    }));

  const risk = riskFromSummary(summary, zones);
  const health_score = Math.max(0, Math.min(100, 100 - avgPredicted - (summary.rising || 0) * 3));

  const trendPhrase =
    globalDelta > 5
      ? 'La ville s’oriente vers une congestion plus marquée'
      : globalDelta < -3
        ? 'La tendance globale est à l’amélioration'
        : 'La circulation reste globalement stable';

  const executive_summary = [
    `**Analyse Tariki** — horizon ${forecast.horizon_minutes || 30} min (${forecast.model_label || 'modèle statistique'}).`,
    `${trendPhrase} : congestion moyenne **${avgCurrent}%** → **${avgPredicted}%** (${globalDelta >= 0 ? '+' : ''}${globalDelta} pts).`,
    `${summary.rising ?? 0} axe(s) en hausse, ${summary.falling ?? 0} en baisse, ${summary.stable ?? 0} stable(s) sur ${zones.length} zones monitorées à Casablanca.`,
    risk === 'high'
      ? '⚠️ Niveau de vigilance **élevé** : planifier des itinéraires de contournement.'
      : risk === 'medium'
        ? 'Niveau de vigilance **modéré** : adapter les horaires de départ si possible.'
        : 'Niveau de vigilance **faible** : conditions de circulation acceptables.',
  ].join('\n\n');

  const kpis = [
    {
      id: 'avg_now',
      label: 'Congestion actuelle',
      value: `${avgCurrent}%`,
      hint: 'Moyenne sur tous les segments',
    },
    {
      id: 'avg_forecast',
      label: 'Prévision +30 min',
      value: `${avgPredicted}%`,
      hint: 'Projection du modèle',
    },
    {
      id: 'delta',
      label: 'Évolution prévue',
      value: `${globalDelta >= 0 ? '+' : ''}${globalDelta} pts`,
      hint: globalDelta > 0 ? 'Pression croissante' : 'Amélioration attendue',
    },
    {
      id: 'health',
      label: 'Indice fluidité',
      value: `${health_score}/100`,
      hint: 'Plus c’est haut, mieux c’est',
    },
  ];

  const zone_insights = enriched.slice(0, 8).map((z) => ({
    segment_id: z.segment_id,
    zone_name: z.zone_name,
    current: z.currentLevel,
    predicted: z.predictedLevel,
    delta: z.delta,
    trend: z.trend,
    status_now: statusLabel(z.currentLevel),
    status_forecast: statusLabel(z.predictedLevel),
    confidence: z.r2 != null ? Math.round(z.r2 * 100) : null,
    insight:
      z.delta >= 8
        ? `Pic probable : prévoir un ralentissement significatif.`
        : z.delta <= -5
          ? `Amélioration nette attendue — bon candidat pour désengorger le réseau.`
          : `Évolution modérée, situation ${statusLabel(z.predictedLevel)}.`,
  }));

  return {
    generated_at: new Date().toISOString(),
    forecast_at: forecast.generated_at,
    empty: false,
    executive_summary,
    health_score,
    risk_level: risk,
    kpis,
    hotspots,
    cooling_zones,
    recommendations: buildRecommendations(summary, hotspots, risk),
    zone_insights,
    model_label: forecast.model_label,
    horizon_minutes: forecast.horizon_minutes,
  };
}
