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
  echo "npm introuvable. Installez Node.js : https://nodejs.org"
  exit 1
fi

echo "Installation des dependances..."
npm install --prefix backend
npm install --prefix frontend

echo "Demarrage backend (port 4000)..."
npm run dev --prefix backend &
BACK_PID=$!

sleep 2

echo "Demarrage frontend (port 5173)..."
npm run dev --prefix frontend &
FRONT_PID=$!

echo ""
echo "Kalil Nutrition demarre"
echo "   Boutique : http://localhost:5173"
echo "   API      : http://localhost:4000/api/health"
echo "   Produits : http://localhost:4000/api/products"
echo ""
echo "   Ctrl+C pour arreter."

trap "kill $BACK_PID $FRONT_PID 2>/dev/null" EXIT
wait
