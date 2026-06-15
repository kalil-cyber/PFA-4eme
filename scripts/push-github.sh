#!/bin/bash
# Pousse Kalil Nutrition vers GitHub - lance une fois : gh auth login
set -e
cd "$(dirname "$0")/.."

if ! command -v gh >/dev/null 2>&1; then
  echo "Installez GitHub CLI : brew install gh"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
    echo "Connexion GitHub (navigateur)..."
  gh auth login -h github.com -p https -w
fi

echo "Push vers kalil-cyber/PFA-4eme..."
git push -u origin main

echo ""
echo "OK - https://github.com/kalil-cyber/PFA-4eme"
