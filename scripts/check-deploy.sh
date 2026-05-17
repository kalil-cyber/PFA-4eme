#!/usr/bin/env bash
# Vérifie API Render + site Vercel après déploiement
# Usage: ./scripts/check-deploy.sh https://tariki-api.onrender.com https://mon-app.vercel.app

set -e
API_URL="${1:-}"
WEB_URL="${2:-}"

if [[ -z "$API_URL" || -z "$WEB_URL" ]]; then
  echo "Usage: $0 <API_URL> <WEB_URL>"
  echo "Ex:    $0 https://tariki-api.onrender.com https://pfa-4eme.vercel.app"
  exit 1
fi

API_URL="${API_URL%/}"
WEB_URL="${WEB_URL%/}"

echo "🔍 API: $API_URL/api/health"
HTTP=$(curl -sS -o /tmp/tariki-health.json -w "%{http_code}" --max-time 90 "$API_URL/api/health" || echo "000")
echo "   HTTP $HTTP"
if [[ "$HTTP" == "200" ]]; then
  cat /tmp/tariki-health.json
  echo ""
else
  echo "   ⚠️  API injoignable ou en veille — réessayez dans 1 min"
fi

echo ""
echo "🔍 Site: $WEB_URL"
WEB_HTTP=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 30 "$WEB_URL" || echo "000")
echo "   HTTP $WEB_HTTP"
if [[ "$WEB_HTTP" == "200" ]]; then
  echo "   ✅ Frontend accessible (Windows / Mac / mobile via navigateur)"
else
  echo "   ⚠️  Vérifiez le déploiement Vercel"
fi

echo ""
echo "📱 Lien à partager: $WEB_URL/connexion"
