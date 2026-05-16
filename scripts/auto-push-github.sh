#!/bin/bash
set -e
cd "$(dirname "$0")/.."

REPO="kalil-cyber/PFA-4eme"

if ! command -v gh >/dev/null 2>&1; then
  echo "Installation de GitHub CLI…"
  brew install gh
fi

if gh auth status >/dev/null 2>&1; then
  echo "✓ Déjà connecté à GitHub"
else
  echo "=== Connexion GitHub (une fois) ==="
  echo "Le navigateur va s'ouvrir. Validez la connexion."
  gh auth login -h github.com -p https -w
fi

echo ""
echo "=== Push vers $REPO ==="
git push -u origin main

echo ""
echo "✓ Terminé : https://github.com/$REPO"
open "https://github.com/$REPO"
