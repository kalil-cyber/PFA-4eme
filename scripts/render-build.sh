#!/usr/bin/env bash
# Build frontend + backend pour déploiement Render (un seul lien public)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "▶ Install frontend…"
npm install --prefix frontend

echo "▶ Build frontend (API même origine)…"
export VITE_API_URL=
export VITE_WS_URL=
export VITE_ADMIN_BASE=/tariki-ops
npm run build --prefix frontend

echo "▶ Install backend…"
npm install --prefix backend

echo "▶ Copie dist → backend/public…"
rm -rf backend/public
mkdir -p backend/public
cp -r frontend/dist/* backend/public/

echo "✅ Build Render terminé"
