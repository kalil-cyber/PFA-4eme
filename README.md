# Tariki — Smart Traffic Management System

**Emplacement du projet :** `~/Documents/Tariki` (Finder → Documents → Tariki). Voir aussi [LISEZMOI.md](./LISEZMOI.md).

Plateforme web de gestion de circulation intelligente pour **Casablanca** (Smart City).

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Base de données | PostgreSQL |
| Temps réel | Socket.io |
| Cartographie | Mapbox GL (fallback simulé sans token) |
| Données | Dataset Waze `tariki_cleaned_dataset` (440 trajectoires/jour) |

## Fonctionnalités

- **Dashboard admin** : KPIs, carte Casablanca, incidents, graphiques
- **Dataset par jour** : lundi–dimanche (fichiers Waze nettoyés)
- **Carte interactive** : routes colorées (vert / jaune / rouge)
- **Incidents** : CRUD + notifications WebSocket
- **Interface conducteur** : itinéraires optimisés (presets Casablanca)
- **Simulation trafic** : mises à jour toutes les 3s (échelle 0–100 %)
- **Dark mode** + **logs système**
- **Prédiction IA** : régression linéaire (extension LSTM prévue)
- **Assistant chatbot** : bouton flottant bas-droite + menu « Assistant IA »

## Démarrage rapide

### Prérequis

- Node.js 18+
- Docker (optionnel, pour PostgreSQL)

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API : http://localhost:4000

Le dataset est dans `/datasets` (copié depuis `tariki_cleaned_dataset`).

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App : http://localhost:5173

### Accès public vs administrateur

| Rôle | URL | Visible dans l’UI |
|------|-----|-------------------|
| **Accueil / menu** | http://localhost:5173/ | Oui |
| **Conducteur** | http://localhost:5173/driver | Via le menu |
| **Carte** | http://localhost:5173/carte | Via le menu |
| **Aide** | http://localhost:5173/aide | Via le menu |
| **Admin** | URL secrète (voir ci-dessous) | Non — aucun lien depuis le conducteur |

Le dashboard admin est protégé comme en entreprise :

1. **URL non publiée** — définir `VITE_ADMIN_BASE` (ex. `/tariki-ops`) dans `frontend/.env`
2. **Code d’organisation** — définir `ADMIN_ACCESS_CODE` dans `backend/.env`
3. **JWT avec rôle `admin`** — vérifié côté API (`/api/auth/me`) et à l’expiration
4. **Anciennes URLs piège** — `/admin` et `/login` redirigent vers `/driver` si le portail n’est pas `/admin`

**Connexion (équipe — identifiants simples) :**

| Rôle | Email | Mot de passe |
|------|--------|----------------|
| Administrateur | `kalil@gmail.com` | `0000` |
| Conducteur | `kpl@gmail.com` | `0000` |

- Page unique : http://localhost:5173/connexion  
- **Code admin** : `0000` → `ADMIN_ACCESS_CODE=0000` dans `backend/.env`  
- Portail admin (si `VITE_ADMIN_BASE=/tariki-ops`) : http://localhost:5173/tariki-ops/login  

Après changement de mots de passe : `npm run seed` (met à jour les comptes en base).

Sans `ADMIN_ACCESS_CODE` : pas de code requis (déconseillé si plusieurs personnes sur le projet).

### Mapbox (optionnel)

```
VITE_MAPBOX_TOKEN=pk.xxx
```

Sans token : carte de secours avec barres de congestion en direct.

## Architecture

```
tariki/
├── datasets/           # JSON/CSV Casablanca (Waze)
├── backend/
│   └── src/
│       ├── services/tarikiDatasetLoader.js
│       ├── routes/     # auth, traffic, incidents, dataset, …
│       └── db/
└── frontend/
    └── src/
        ├── pages/      # dashboard, map, driver, …
        └── components/
```

## API principales

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/auth/portal-config` | Indique si un code d’accès est requis |
| POST | `/api/auth/login` | Connexion admin (email, mot de passe, code optionnel) |
| GET | `/api/auth/me` | Session admin (Bearer JWT) |
| GET | `/api/traffic/roads` | Segments routiers |
| GET | `/api/dataset/meta` | Métadonnées dataset |
| POST | `/api/dataset/apply-day` | Charger un jour (auth) |
| GET/POST/PATCH/DELETE | `/api/incidents` | CRUD incidents |
| POST | `/api/routes/optimize` | Itinéraire optimisé |

## Chatbot (Assistant trafic)

**Où le trouver sur le site :**

1. **Bouton bleu flottant** en bas à droite — « Assistant trafic » (toutes les pages)
2. **Menu admin** (barre latérale) — « Assistant IA (chat) »
3. **Page Conducteur** — lien « Assistant IA » dans l’en-tête

Sans `OPENAI_API_KEY` : réponses locales basées sur le trafic temps réel.  
Avec clé OpenAI dans `backend/.env` : réponses GPT enrichies.

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

## WebSocket

- `traffic:update` — trafic simulé
- `incident:new` / `updated` / `deleted`
- `prediction:update` — prévisions IA

## Phase 3 (extension)

- Service Python LSTM (`backend/python/`)
- Détection caméra (YOLO / OpenCV)
- Google Maps Traffic API

## Déploiement gratuit — un lien pour tous (Windows, Mac, mobile)

Guide détaillé : **[DEPLOIEMENT-GRATUIT.md](./DEPLOIEMENT-GRATUIT.md)**

Résumé : **Vercel** (site public HTTPS) + **Render** (API). Les utilisateurs ouvrent un seul lien dans le navigateur — aucune app à installer.

## Déploiement gratuit (GitHub `kalil-cyber/PFA-4eme`)

### 1. Pousser sur GitHub

```bash
git remote set-url origin https://github.com/kalil-cyber/PFA-4eme.git
git push -u origin main
```

Dépôt : [github.com/kalil-cyber/PFA-4eme](https://github.com/kalil-cyber/PFA-4eme)

### 2. Backend — [Render](https://render.com) (gratuit)

1. **New** → **Blueprint** → repo `kalil-cyber/PFA-4eme`
2. Fichier `render.yaml` à la racine (déjà inclus)
3. Variable **`CORS_ORIGIN`** = URL Vercel du frontend (ex. `https://tariki.vercel.app`)
4. URL API : `https://tariki-api.onrender.com`

### 3. Frontend — [Vercel](https://vercel.com) (gratuit)

1. **Import** du repo `kalil-cyber/PFA-4eme`
2. Framework : **Vite** — racine du projet (fichier `vercel.json` inclus)
3. Variables d’environnement :

| Variable | Valeur |
|----------|--------|
| `VITE_API_URL` | `https://tariki-api.onrender.com` |
| `VITE_WS_URL` | `https://tariki-api.onrender.com` |
| `VITE_ADMIN_BASE` | `/tariki-ops` |

4. Déployer → site public + admin sur `/tariki-ops`

> Render gratuit : le serveur peut « s’endormir » après ~15 min sans trafic (réveil ~1 min).
