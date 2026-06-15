#!/bin/bash
set -e
cd "$(dirname "$0")/.."

echo "=============================================="
echo "  PUSH GITHUB - sans code telephone"
echo "=============================================="
echo ""
echo "1) Ouvrez : https://github.com/settings/tokens/new?scopes=repo&description=Kalil-Protein"
echo "2) Generate token puis copiez (ghp_...)"
echo ""
read -rsp "Collez le token ici : " TOKEN
echo ""

[ -n "$TOKEN" ] || { echo "Annule."; exit 1; }

echo "$TOKEN" | gh auth login --with-token
unset TOKEN

git push -u origin main
echo "OK - https://github.com/kalil-cyber/PFA-4eme"
