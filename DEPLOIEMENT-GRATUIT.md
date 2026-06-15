# Deploiement gratuit Kalil Nutrition

Kalil Nutrition est une application web. Un seul lien HTTPS suffit pour ordinateur, tablette et mobile.

## Option recommandee : Render seul

Render peut servir le frontend et l API depuis le meme service.

1. Pousser le code sur GitHub.
2. Ouvrir Render : https://dashboard.render.com/blueprint/new
3. Choisir le depot.
4. Render lit `render.yaml`.
5. Attendre la fin du build.
6. Ouvrir l URL Render.

Exemple :

```text
https://kalil-nutrition.onrender.com
```

## Option Vercel + Render

### Backend Render

- Build command : `bash scripts/render-build.sh`
- Start command : `npm start --prefix backend`
- Health check : `/api/health`

### Frontend Vercel

Le fichier `vercel.json` construit `frontend/dist`.

Variable a configurer :

```env
VITE_API_URL=https://votre-api-render.onrender.com
```

## Tester apres deploiement

```text
https://votre-url.onrender.com/
https://votre-url.onrender.com/api/health
https://votre-url.onrender.com/api/products
```

## Remarque plan gratuit

Sur Render gratuit, le serveur peut dormir apres une periode sans visite. La premiere requete peut donc etre lente.
