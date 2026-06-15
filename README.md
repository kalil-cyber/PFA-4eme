# Kalil Protein — Boutique e-commerce fitness

Kalil Protein est une application web e-commerce pour vendre des proteines, complements sportifs et accessoires fitness.

Le projet contient :

- une vitrine moderne responsive ;
- un catalogue produits avec filtres et recherche ;
- un panier local ;
- un formulaire de commande ;
- une API Express pour les produits, commandes et inscriptions newsletter ;
- un deploiement possible en un seul service Render ou en frontend Vercel + API Render.

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| UI | Lucide React |
| Stockage MVP | Memoire serveur |
| Deploiement | Render / Vercel |

## Demarrage rapide

### Prerequis

- Node.js 18+
- npm

### Installation

```bash
npm run install:all
```

### Lancer le backend

```bash
npm run dev:backend
```

API : http://localhost:4000

### Lancer le frontend

```bash
npm run dev:frontend
```

Application : http://localhost:5173

## Fonctionnalites

### Cote client

- page d accueil marketing ;
- liste de produits ;
- filtre par categorie : Proteines, Performance, Accessoires ;
- recherche produit ;
- ajout au panier ;
- modification des quantites ;
- calcul du sous-total, livraison et total ;
- formulaire de commande ;
- inscription newsletter.

### Cote API

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | Etat de l API |
| GET | `/api/products` | Liste des produits |
| GET | `/api/products/:id` | Detail d un produit |
| POST | `/api/orders` | Creation d une commande |
| GET | `/api/orders` | Liste des commandes en memoire |
| POST | `/api/newsletter` | Inscription newsletter |

## Variables d environnement

### Backend

```env
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

### Frontend

```env
VITE_API_URL=http://localhost:4000
```

## Structure

```text
kalil-protein/
├── backend/
│   └── src/
│       ├── data/catalog.js
│       ├── routes/shop.js
│       └── index.js
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
├── scripts/render-build.sh
├── render.yaml
└── vercel.json
```

## Test rapide de l API

1. Lancer le backend :

```bash
npm run dev:backend
```

2. Dans un autre terminal :

```bash
npm run test:api --prefix backend
```

## Deploiement

### Render, app + API ensemble

Le fichier `render.yaml` utilise :

- `scripts/render-build.sh` pour construire le frontend ;
- `npm start --prefix backend` pour servir l API et les fichiers statiques.

### Vercel, frontend seul

Le fichier `vercel.json` construit `frontend/dist`.

Configurer :

```env
VITE_API_URL=https://votre-api-render.onrender.com
```

## Pistes d evolution

- authentification client/admin ;
- paiement en ligne ;
- base PostgreSQL ou MongoDB ;
- tableau de bord administrateur ;
- gestion du stock ;
- emails de confirmation ;
- pages produit detaillees.
