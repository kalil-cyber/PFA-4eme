# Rapport de projet — Tariki  
## Système intelligent de gestion du trafic urbain — Casablanca

**Projet de fin d’années (PFA)**  
**Auteur :** Kalil — compte GitHub `kalil-cyber`  
**Dépôt :** https://github.com/kalil-cyber/PFA-4eme  
**Institution / filière :** [À compléter]  
**Encadrant :** [À compléter]  
**Date :** Mai 2026  

---

## Résumé exécutif

**Tariki** est une plateforme web de **gestion intelligente de la circulation** centrée sur **Casablanca**. Elle combine un **dataset de mobilité** dérivé de trajectoires type Waze (440 observations par jour, sept jours de la semaine), une **API temps réel** (Node.js / Express / Socket.io), une **interface conducteur** et un **portail administrateur** sécurisé. Le système propose la visualisation de la congestion, la gestion d’incidents, des **prévisions à court terme** (régression linéaire, extensible LSTM), un **assistant conversationnel**, et un module **Webcams & surveillance** alimenté par un dataset local.

Mots-clés : *ville intelligente, ITS, trafic urbain, prédiction, crowdsourcing, React, Node.js, Casablanca.*

---

## Table des matières

1. [Introduction](#1-introduction)  
2. [Contexte et problématique](#2-contexte-et-problématique)  
3. [État de l’art et revue scientifique](#3-état-de-lart-et-revue-scientifique)  
4. [Objectifs du projet](#4-objectifs-du-projet)  
5. [Méthodologie](#5-méthodologie)  
6. [Architecture du système](#6-architecture-du-système)  
7. [Données et jeux de données](#7-données-et-jeux-de-données)  
8. [Fonctionnalités réalisées](#8-fonctionnalités-réalisées)  
9. [Intelligence artificielle et prédiction](#9-intelligence-artificielle-et-prédiction)  
10. [Sécurité et gestion des accès](#10-sécurité-et-gestion-des-accès)  
11. [Déploiement et exploitation](#11-déploiement-et-exploitation)  
12. [Limites, risques et perspectives](#12-limites-risques-et-perspectives)  
13. [Conclusion](#13-conclusion)  
14. [Bibliographie indicative](#14-bibliographie-indicative)  
15. [Annexes](#15-annexes)  

---

## 1. Introduction

La croissance démographique et l’urbanisation accélérée des métropoles africaines, dont **Casablanca** (plus grande ville économique du Maroc), accentuent les **congestions**, la pollution et la perte de temps. Les autorités et les usagers ont besoin d’outils **numériques** pour observer, anticiper et réagir au trafic.

Les systèmes de transport intelligents (*Intelligent Transportation Systems*, ITS) s’appuient historiquement sur des capteurs fixes, des boucles magnétiques et des caméras de surveillance. Aujourd’hui, les **données participatives** (applications mobiles de navigation) et l’**open data** complètent ces sources à moindre coût.

**Tariki** (nom du projet) répond à cette logique en proposant une **application full-stack** démontrable : tableau de bord, carte, conducteur, prédiction, incidents et découverte (météo, POI, webcams). Le projet est conçu comme **MVP évolutif** : fonctionnel en mode mémoire sans PostgreSQL, déployable sur GitHub, Render et Vercel.

---

## 2. Contexte et problématique

### 2.1 Contexte urbain — Casablanca

- Agglomération à forte densité, axes structurants (Mohammed V, Zerktouni, corniche, rocade, accès portuaires).  
- Réseau **tramway** (T1, T2), bus, taxis ; intermodalité limitée par la congestion aux heures de pointe.  
- Projets d’**autoroutes** et péages (réseau ADM) en périphérie ; flux poids lourds vers le port.

### 2.2 Problématique

| Question | Enjeu |
|----------|--------|
| Comment visualiser l’état du trafic en quasi temps réel ? | Décision conducteur / opérateur |
| Comment alerter sur incidents et zones saturées ? | Sécurité et fluidité |
| Comment anticiper la congestion ? | Planification et information voyageur |
| Comment centraliser des données hétérogènes ? | Vision « smart city » |

### 2.3 Positionnement de Tariki

Tariki ne remplace pas un système national de gestion du trafic, mais **démontre** l’intégration : données historiques (dataset), simulation temps réel, API REST, WebSocket, interfaces distinctes **admin / conducteur / public**.

---

## 3. État de l’art et revue scientifique

### 3.1 Villes intelligentes (*Smart Cities*)

La littérature sur les **smart cities** (Batty, 2013 ; Bibri & Krogstie, 2017) décrit l’intégration des infrastructures physiques et numériques pour améliorer qualité de vie, efficacité énergétique et mobilité. Les piliers pertinents pour Tariki :

- **Capteurs et IoT** : feux, caméras, compteurs.  
- **Plateformes de données** : agrégation, APIs ouvertes.  
- **Applications citoyennes** : information, participation.

*Lien avec le projet :* module surveillance (points carte), dataset géolocalisé, tableau de bord opérateur.

### 3.2 Systèmes de transport intelligents (ITS)

Les ITS couvrent acquisition, traitement, diffusion et contrôle du trafic (Dimitriou & Gakenheimer, 2011). Composants classiques :

| Composant | Exemple industriel | Équivalent Tariki |
|-----------|-------------------|-------------------|
| Acquisition | Détecteurs, GPS flotte | Dataset Waze + simulateur |
| Fusion / stockage | SCADA, data lake | PostgreSQL / memoryStore |
| Analyse | Modèles prédictifs | Régression linéaire (+ LSTM prévu) |
| Diffusion | PMV, applications | Web + WebSocket |
| Contrôle | Feux adaptatifs | Non implémenté (perspective) |

### 3.3 Données crowdsourcées et Waze

Les applications collaboratives (Waze, Google Maps) produisent des **trajectoires GPS** et signalements utilisateurs. La recherche montre :

- **Avantage** : couverture spatiale large, mise à jour fréquente, faible coût d’infrastructure.  
- **Limite** : biais d’échantillonnage (conducteurs smartphone), qualité variable, questions de vie privée.

Le dataset **tariki_cleaned_dataset** utilisé dans le projet repose sur ce paradigme : coordonnées et niveaux de congestion dérivés, **nettoyés** en tables par jour de la semaine (lundi–dimanche).

*Références thématiques :*  
- Antoniou et al. — fusion de données GPS pour l’état du trafic.  
- Work sur *floating car data* (FCD) en environnement urbain.

### 3.4 Prédiction du trafic

La prédiction à court terme (5–60 minutes) utilise souvent :

1. **Méthodes statistiques** : ARIMA, régression.  
2. **Machine learning** : Random Forest, SVM sur features temporelles.  
3 **Deep learning** : LSTM, GRU, Graph Neural Networks sur réseaux routiers.

**Tariki (MVP)** implémente une **régression linéaire** sur fenêtre glissante d’historique de congestion par segment, avec coefficient \(R^2\) et horizon par défaut de **6 pas × 5 min = 30 minutes**. Une extension **LSTM** est documentée (`backend/python/`).

*Comparaison académique :*  
- LSTM : meilleure capture de non-linéarités et saisonnalité (Lv et al., 2015).  
- Régression linéaire : interprétable, léger, adapté à un PFA avec démonstration rapide.

### 3.5 Vision par ordinateur et vidéosurveillance

Les travaux sur **détection de véhicules** (YOLO, OpenCV) et **analyse de flux** à partir de caméras fixes permettent d’estimer densité et incidents. Les péages et autoroutes marocains (ADM) exposent parfois des **flux vidéo** publics.

**Tariki** intègre un dataset **`surveillance_casablanca.json`** (webcams, péages, feux, zones de surveillance) pour la **géolocalisation** et l’UX, sans traitement vidéo automatique en Phase 1.

### 3.6 Synthèse comparative

| Approche | Maturité | Coût | Adéquation PFA Tariki |
|----------|----------|------|------------------------|
| Capteurs fixes | Élevée | Élevé | Référence état de l’art |
| Crowdsourcing (Waze) | Élevée | Faible | **Cœur du dataset** |
| Simulation microscopique | Recherche | Élevé | Simulateur simplifié 3 s |
| LSTM / deep learning | Recherche / prod | Moyen | Phase 3 planifiée |
| OpenStreetMap | Communautaire | Faible | Feux / péages (référence) |

---

## 4. Objectifs du projet

### 4.1 Objectif général

Concevoir et réaliser une **plateforme web** de supervision et d’aide à la mobilité pour Casablanca, fondée sur des **données réelles nettoyées** et des services temps réel.

### 4.2 Objectifs spécifiques

| ID | Objectif | Critère de réussite |
|----|----------|---------------------|
| O1 | Visualiser le trafic sur carte | Segments colorés, mise à jour WebSocket |
| O2 | Gérer les incidents | CRUD + notifications |
| O3 | Prédire la congestion | API `/api/predictions`, graphiques |
| O4 | Servir conducteur et admin | Rôles JWT, URLs séparées |
| O5 | Exploiter le dataset multi-jours | 7 fichiers JSON, sélecteur de jour |
| O6 | Assister l’utilisateur | Chatbot contextuel trafic |
| O7 | Documenter et déployer | README, GitHub, Render/Vercel |

---

## 5. Méthodologie

### 5.1 Démarche

1. **Analyse** du besoin (conducteur vs opérateur).  
2. **Collecte / préparation** des données (`datasets/`, nettoyage Excel → CSV/JSON).  
3. **Conception** UML simplifiée (cas d’usage : connexion, incident, prédiction).  
4. **Implémentation** agile par couches (API → UI).  
5. **Tests** : `npm run test:api` (smoke test backend).  
6. **Déploiement** et documentation.

### 5.2 Stack technique retenue

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| Frontend | React 18, Vite, Tailwind | Écosystème riche, HMR rapide |
| Cartographie | Mapbox GL + Leaflet fallback | Qualité visuelle + mode dégradé |
| Backend | Node.js 18+, Express | JavaScript full-stack, JSON natif |
| Temps réel | Socket.io | Diffusion congestion / incidents |
| Données | PostgreSQL 16 (+ mode mémoire) | Persistance production / démo sans Docker |
| Auth | JWT, bcrypt | Standard REST stateless |
| IA MVP | Régression linéaire (JS) | Simplicité, traçabilité PFA |
| IA cible | Python LSTM (FastAPI) | Aligné littérature deep learning |

### 5.3 Environnement de développement

- Projet local : `~/Desktop/TARIKI-CODE` (ou clone GitHub).  
- Ports : frontend **5173**, API **4000**.  
- Variables : `backend/.env`, `frontend/.env`.

---

## 6. Architecture du système

### 6.1 Vue logique

```
┌─────────────┐     REST / WS      ┌──────────────────┐
│   React     │ ◄────────────────► │  Express + IO    │
│   (Vite)    │                    │  Node.js         │
└─────────────┘                    └────────┬─────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    ▼                       ▼                       ▼
             ┌──────────┐           ┌─────────────┐         ┌────────────┐
             │ PostgreSQL│           │ memoryStore │         │  datasets/ │
             │ (prod)    │           │ (démo)      │         │  JSON/CSV  │
             └──────────┘           └─────────────┘         └────────────┘
```

### 6.2 Structure des répertoires

```
TARIKI-CODE/
├── datasets/                    # Données Waze + surveillance
├── docs/                        # Documentation (ce rapport)
├── backend/src/
│   ├── routes/                  # auth, traffic, incidents, predictions, discover…
│   ├── services/                # simulateur, prédiction, dataset loader, chat…
│   ├── db/                      # migrate, seed, bootstrap
│   └── middleware/              # auth JWT
├── frontend/src/
│   ├── pages/                   # Home, Driver, Map, Dashboard, Webcams…
│   ├── components/              # cartes, charts, chatbot, UI
│   └── contexts/                # Socket, Theme, Toast, Chat
└── scripts/                     # publication GitHub
```

### 6.3 Flux de données temps réel

1. **Simulateur** (`trafficSimulator.js`) : toutes les 3 s, variation congestion 0–100 % sur ~13 segments.  
2. **Socket.io** : émission `traffic:update`, `prediction:update`, événements incidents.  
3. **Frontend** : hooks `useTrafficData`, `useTrafficNotifications`.

### 6.4 API principales

| Domaine | Endpoints clés |
|---------|----------------|
| Auth | `POST /api/auth/login`, `register`, `GET /me`, `GET /check-email` |
| Trafic | `GET /api/traffic/roads`, `stats`, `simulation` |
| Dataset | `GET /api/dataset/meta`, `POST /apply-day` |
| Incidents | CRUD `/api/incidents` |
| Prédictions | `GET /api/predictions`, `insights`, par zone |
| Découverte | `GET /api/discover/webcams`, `weather`, `pois`, `events` |
| Chat | `POST /api/chat/message` |
| Santé | `GET /api/health` |

---

## 7. Données et jeux de données

### 7.1 Dataset trafic Waze (cœur métier)

| Table | Contenu |
|-------|---------|
| `table_5_monday.json` … `table_11_sunday.json` | Coordonnées / congestion par jour |
| `table_0_coordinates` | Référentiel spatial |
| `table_1` … `table_4` | Population, transports, types de routes, usage du sol |
| `dataset_summary.csv` | Synthèse |

**Traitement** (`tarikiDatasetLoader.js`) :

- Extraction coordonnées uniques dans la bounding box Casablanca.  
- Génération d’environ **13 segments** nommés (rues réelles : Mohammed V, Zerktouni, Corniche…).  
- Niveau de congestion dérivé par seed déterministe + index jour.

**Volume indicatif :** ~440 trajectoires / jour (documentation projet).

### 7.2 Dataset surveillance (`surveillance_casablanca.json`)

25 points catégorisés :

| Catégorie | Nombre | Rôle |
|-----------|--------|------|
| Webcam | 9 | Points de vue (flux ou référence) |
| Péage | 4 | Passages autoroutiers |
| Feu | 8 | Carrefours signalés |
| Surveillance | 4 | Zones fixes (tunnel, marina, aéroport…) |

Chargement **local** (pas d’API externe obligatoire) — affichage instantané côté frontend.

### 7.3 Données externes (optionnelles / dégradées)

| Source | Usage | Statut dans Tariki |
|--------|-------|-------------------|
| Open-Meteo | Météo Casablanca | Service `weatherService` |
| OSM / Overpass | POI, (feux) | Partiel / remplacé par dataset |
| ADM Trafic | Webcams live | Optionnel, instable |
| OpenAI | Chat enrichi | Si `OPENAI_API_KEY` |

---

## 8. Fonctionnalités réalisées

### 8.1 Portail public

- **Accueil** : présentation Tariki, liens connexion / carte.  
- **Carte publique** (`/carte`) : trafic simulé.  
- **Conducteur** (`/driver`) : presets lieux Casa, itinéraire optimisé.  
- **Découverte** : météo, POI, événements, **webcams**.  
- **Aide** : documentation utilisateur.

### 8.2 Authentification unifiée (`/connexion`)

- Inscription / connexion **conducteur** et **admin**.  
- Reconnaissance email + notification + connexion automatique (comptes enregistrés).  
- Code admin (`ADMIN_ACCESS_CODE`) si configuré.

### 8.3 Portail administrateur

- URL configurable (`VITE_ADMIN_BASE`, ex. `/tariki-ops`).  
- **Dashboard** : KPIs, jauge congestion ville, graphiques.  
- **Carte** admin, **incidents**, **logs**, **prédictions** analyste.  
- Sélecteur **jour du dataset** (lundi–dimanche).

### 8.4 Incidents

- Création, modification, suppression.  
- Types et statuts ; diffusion WebSocket aux clients connectés.

### 8.5 Assistant IA (chatbot)

- Bouton flottant global (`TrafficChatbot`).  
- Mode **local** : réponses basées sur règles + état trafic (`chatBrain`, `chatAssistant`).  
- Mode **OpenAI** si clé API fournie.

### 8.6 Webcams & surveillance

- Carte Leaflet, filtres par catégorie.  
- Dataset embarqué + sync API optionnelle.  
- Pas de traitement vidéo IA en Phase 1.

---

## 9. Intelligence artificielle et prédiction

### 9.1 Modèle MVP — régression linéaire

Pour chaque segment routier, historique des niveaux de congestion \(y_t \in [0,100]\) :

\[
\hat{y}_{t+h} = \beta_0 + \beta_1 \cdot (t + h)
\]

avec \(\beta_0, \beta_1\) estimés par moindres carrés sur les **24 derniers points**. Métrique **\(R^2\)** renvoyée au client pour indiquer la confiance.

**Horizon :** 6 intervalles de 5 minutes (30 min).

### 9.2 Module analyste

`predictionAnalyst.js` + UI `PredictionAnalystPanel` : synthèse zones à risque, tendances.

### 9.3 Extension LSTM (Phase 3)

- Dossier `backend/python/` : service FastAPI prévu.  
- Entrées : séries multivariées par segment / jour.  
- Justification scientifique : modélisation de dépendances temporelles longues (Lv et al., traffic forecasting with LSTM).

### 9.4 Pistes non implémentées (revue → roadmap)

- Détection véhicules / files d’attente par **YOLO** sur flux webcam.  
- Feux connectés : état rouge/vert via API municipale (non disponible).  
- **GNN** pour corrélations entre axes adjacents.

---

## 10. Sécurité et gestion des accès

| Mécanisme | Description |
|-----------|-------------|
| JWT | Token signé, rôle `admin` / `user`, expiration configurable |
| bcrypt | Hash mots de passe |
| Code admin | Variable d’environnement, vérifié à l’inscription / login admin |
| CORS | Restriction origine frontend en production |
| Routes protégées | Middleware `authMiddleware` sur endpoints sensibles |
| Obscurité admin | Pas de lien public vers `/tariki-ops` |

**Recommandation production :** HTTPS obligatoire, secrets forts, rotation JWT, rate limiting.

---

## 11. Déploiement et exploitation

| Cible | Rôle |
|-------|------|
| **GitHub** `kalil-cyber/PFA-4eme` | Code source, versioning |
| **Render** | API Node (`render.yaml`) |
| **Vercel** | Frontend statique Vite (`vercel.json`) |

Variables critiques : `VITE_API_URL`, `VITE_WS_URL`, `CORS_ORIGIN`, `JWT_SECRET`, `DATABASE_URL`.

**Commandes locales :**

```bash
npm run install:all
npm run dev:backend
npm run dev:frontend
```

---

## 12. Limites, risques et perspectives

### 12.1 Limites actuelles

- Simulation temps réel **ne remplace pas** capteurs réels.  
- Prédiction linéaire **simpliste** sur données partiellement simulées.  
- Webcams : peu de flux embarqués ; pas d’analyse vidéo.  
- Feux : positions de référence, pas d’état dynamique.  
- Déploiement gratuit : cold start Render (~1 min).

### 12.2 Risques

| Risque | Mitigation |
|--------|------------|
| Qualité dataset | Documentation traçabilité, contrôles bbox Casa |
| Sécurité JWT | Secrets, HTTPS |
| Dépendance APIs tierces | Mode dégradé, datasets locaux |

### 12.3 Perspectives (12–24 mois)

1. Entraîner et intégrer **LSTM** / modèle Prophet.  
2. Connexion **API trafic** officielle ou partenariat opérateur.  
3. Application mobile (React Native).  
4. Tableau de bord **autorités** (export PDF, alerting SMS).  
5. Intégration **tramway / bus** (horaires GTFS Casablanca).  
6. Module **vision** sur webcams péage.

---

## 13. Conclusion

Le projet **Tariki** démontre la faisabilité d’une **plateforme intégrée** de gestion du trafic pour Casablanca, en s’appuyant sur des **données crowdsourcées nettoyées**, une architecture **moderne** (React / Node / WebSocket) et des briques d’**aide à la décision** (prédiction, incidents, assistant). 

Sur le plan scientifique, il s’inscrit dans les champs des **ITS**, des **smart cities** et du **machine learning appliqué au transport**, avec une trajectoire claire vers des modèles **deep learning** et la **vidéosurveillance intelligente**.

Le dépôt GitHub à jour et la documentation associée permettent la **reproductibilité** et l’évaluation par un jury de PFA.

---

## 14. Bibliographie indicative

> À compléter selon les normes de votre établissement (APA, IEEE, etc.). Vérifier les références dans Google Scholar / IEEE Xplore.

1. Batty, M. (2013). *The New Science of Cities*. MIT Press.  
2. Bibri, S. E., & Krogstie, J. (2017). Smart sustainable cities of the future. *Energy Procedia*.  
3. Dimitriou, H. T., & Gakenheimer, M. (2011). *Urban Transport in the Developing World*. Edward Elgar.  
4. Lv, Y., et al. (2015). Traffic flow prediction with big data: a deep learning approach. *IEEE Transactions on Intelligent Transportation Systems*.  
5. Vlahogianni, E. I., et al. (2014). Short-term traffic forecasting: Overview and challenges. *Transportation Research Part C*.  
6. Bar-Gera, H. (2017). Traffic assignment by pairs of alternative segments. *Transportation Research Part B*. (thématique réseaux)  
7. Goodchild, M. F. (2007). Citizens as sensors: the world of volunteered geography. *GeoJournal*.  
8. ADM Autoroutes du Maroc — documentation trafic et péages (sources opérationnelles).  
9. OpenStreetMap Foundation — données cartographiques collaboratives.  
10. Documentation officielle : React, Express, Socket.io, PostgreSQL, Mapbox GL.

**Articles thématiques Maroc / Afrique (recherche recommandée) :**

- Mobilité urbaine à Casablanca — études ANCFCC, ministère du Transport.  
- Tramway Casablanca — impacts sur congestion (rapports Casa Transport).  

---

## 15. Annexes

### Annexe A — Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|--------|--------------|
| Admin | kalil@gmail.com | 0000 |
| Conducteur | kpl@gmail.com | 0000 |
| Code admin | — | 0000 |

### Annexe B — URLs locales

| Service | URL |
|---------|-----|
| Application | http://localhost:5173 |
| Connexion | http://localhost:5173/connexion |
| API health | http://localhost:4000/api/health |
| Webcams | http://localhost:5173/webcams |
| Admin (ex.) | http://localhost:5173/tariki-ops |

### Annexe C — Fichiers clés du dépôt

| Fichier | Rôle |
|---------|------|
| `backend/src/services/tarikiDatasetLoader.js` | Chargement dataset Waze |
| `backend/src/services/predictionEngine.js` | Régression linéaire |
| `backend/src/services/trafficSimulator.js` | Temps réel |
| `datasets/surveillance_casablanca.json` | Points surveillance |
| `frontend/src/pages/AuthPage.jsx` | Authentification |
| `docs/RAPPORT-PFA-TARIKI.md` | Ce document |

### Annexe D — Glossaire

| Terme | Définition |
|-------|------------|
| ITS | Intelligent Transportation System |
| FCD | Floating Car Data |
| JWT | JSON Web Token |
| MVP | Minimum Viable Product |
| LSTM | Long Short-Term Memory (réseau récurrent) |
| POI | Point of Interest |
| ADM | Autoroutes du Maroc |

---

*Document généré pour le projet Tariki — PFA 2026. Dernière synchronisation code : branche `main`, dépôt GitHub kalil-cyber/PFA-4eme.*
