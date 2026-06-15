#!/usr/bin/env bash
# Build frontend + backend pour deploiement Render (un seul lien public)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Install frontend..."
npm install --prefix frontend

echo "Build frontend (API meme origine)..."
export VITE_API_URL=
npm run build --prefix frontend

echo "Install backend..."
npm install --prefix backend

echo "Copie dist vers backend/public..."
rm -rf backend/public
mkdir -p backend/public
cp -r frontend/dist/* backend/public/

echo "Build Render termine"
