#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if [ -d "$HOME/.nvm" ]; then
  # shellcheck source=/dev/null
  . "$HOME/.nvm/nvm.sh"
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm introuvable. Installez Node.js : https://nodejs.org"
  exit 1
fi

echo "📦 Installation des dépendances..."
npm install --prefix backend
npm install --prefix frontend

echo "🚀 Démarrage backend (port 4000)..."
npm run dev --prefix backend &
BACK_PID=$!

sleep 2

echo "🌐 Démarrage frontend (port 5173)..."
npm run dev --prefix frontend &
FRONT_PID=$!

echo ""
echo "✅ Tariki démarré — Casablanca Smart Traffic"
echo "   Connexion  : http://localhost:5173/connexion"
echo "   Admin      : kalil@gmail.com / 0000  (code: 0000)"
echo "   Conducteur : kpl@gmail.com / 0000"
echo "   Dashboard  : http://localhost:5173/admin"
echo "   Conducteur : http://localhost:5173/driver"
echo "   Chatbot    : bouton bleu en bas à droite"
echo ""
echo "   Ctrl+C pour arrêter."

trap "kill $BACK_PID $FRONT_PID 2>/dev/null" EXIT
wait
