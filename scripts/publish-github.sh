#!/bin/bash
# Cree le depot GitHub, pousse le code et active GitHub Pages.
# Prerequis : gh auth login  (une seule fois)
set -e

REPO_OWNER="${REPO_OWNER:-kalil-cyber}"
REPO_NAME="${REPO_NAME:-PFA-4eme}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v gh >/dev/null 2>&1; then
  echo "Installez GitHub CLI : brew install gh"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Connexion GitHub requise (une fois) :"
  gh auth login
fi

echo "Creation du depot $REPO_OWNER/$REPO_NAME (si absent)..."
gh repo view "$REPO_OWNER/$REPO_NAME" 2>/dev/null || \
  gh repo create "$REPO_OWNER/$REPO_NAME" --public \
    --description "Kalil Protein e-commerce fitness (React + Node.js)"

git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$REPO_OWNER/$REPO_NAME.git"

echo "Push vers GitHub..."
git branch -M main
git push -u origin main

echo "Activation GitHub Pages..."
gh api -X POST "repos/$REPO_OWNER/$REPO_NAME/pages" \
  -f build_type=workflow \
  -f source[branch]=main \
  -f source[path]=/ 2>/dev/null || true

PAGES_URL="https://$REPO_OWNER.github.io/$REPO_NAME/"

echo ""
echo "Termine"
echo "   Code    : https://github.com/$REPO_OWNER/$REPO_NAME"
echo "   Site    : $PAGES_URL (1-3 min apres le workflow Actions)"
echo ""
echo "   Backend : deployez sur Render (render.yaml) puis ajoutez dans GitHub :"
echo "   Settings → Secrets and variables → Actions → Variables"
echo "   VITE_API_URL = https://votre-api.onrender.com"
