# Déploiement gratuit Tariki — un lien pour tous (Windows, Mac, mobile)

Tariki est une **application web** : un seul lien HTTPS fonctionne sur **tous les navigateurs** — PC, Mac, iPhone, Android. Aucune installation.

## Option recommandée — UN seul service Render (app + API)

Lien public après déploiement :

```text
https://tariki.onrender.com
```

(Le nom exact dépend de Render, ex. `https://tariki-xxxx.onrender.com`)

### Déployer en 2 clics

1. Ouvrir : **https://dashboard.render.com/blueprint/new?repo=https://github.com/kalil-cyber/PFA-4eme**
2. Se connecter à Render (compte gratuit) → **Apply** → attendre ~5–10 min.

C’est tout. Partager l’URL Render affichée.

---

## Option 2 — Vercel + Render (deux services)

Lien frontend :

```text
https://VOTRE-PROJET.vercel.app
```

Exemples :
- Accueil : `/`
- Connexion : `/connexion`
- Admin : `/tariki-ops`

Comptes démo : `kalil@gmail.com` / `0000` · `kpl@gmail.com` / `0000`

---

## Étape 1 — GitHub (5 min)

```bash
cd ~/Desktop/TARIKI-CODE
git add -A
git commit -m "Config déploiement public multi-plateforme"
git push origin main
```

Dépôt : https://github.com/kalil-cyber/PFA-4eme

---

## Étape 2 — Backend gratuit sur Render (10 min)

1. Créer un compte sur [render.com](https://render.com) (gratuit).
2. **Dashboard** → **New** → **Blueprint**.
3. Connecter GitHub → repo **`kalil-cyber/PFA-4eme`**.
4. Render lit `render.yaml` et crée le service **`tariki-api`**.
5. Attendre le déploiement → noter l’URL, ex. :  
   `https://tariki-api.onrender.com`
6. Tester : ouvrir `https://tariki-api.onrender.com/api/health` → JSON `"status":"ok"`.

Variables déjà dans `render.yaml` : `USE_MEMORY=true`, `CORS_ALLOW_VERCEL=true`, comptes démo au démarrage.

Optionnel : variable **`CORS_ORIGIN`** = votre URL Vercel exacte (en plus de `*.vercel.app`).

> **Plan gratuit** : après ~15 min sans visite, le serveur dort. La **première** requête peut prendre ~30–90 s (normal).

---

## Étape 3 — Frontend gratuit sur Vercel (10 min)

1. Compte sur [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. Importer **`kalil-cyber/PFA-4eme`** depuis GitHub.
3. Vercel détecte `vercel.json` (build frontend automatique).
4. **Environment Variables** (Production) :

| Nom | Valeur |
|-----|--------|
| `VITE_API_URL` | `https://tariki-api.onrender.com` |
| `VITE_WS_URL` | `https://tariki-api.onrender.com` |
| `VITE_ADMIN_BASE` | `/tariki-ops` |

5. **Deploy** → URL publique, ex. `https://pfa-4eme.vercel.app`.

6. (Optionnel) Render → `CORS_ORIGIN` = cette URL Vercel → **Manual Deploy**.

---

## Étape 4 — Partager

Envoyez **uniquement** le lien Vercel à votre jury, équipe ou amis :

```text
https://pfa-4eme.vercel.app
```

Fonctionne sur :
- Windows (Chrome, Edge)
- macOS (Safari, Chrome)
- iPhone / iPad (Safari)
- Android (Chrome)

---

## Vérification rapide

```bash
./scripts/check-deploy.sh https://tariki-api.onrender.com https://VOTRE-PROJET.vercel.app
```

---

## Dépannage

| Problème | Solution |
|----------|----------|
| Page blanche / API erreur | Vérifier `VITE_API_URL` sur Vercel, redéployer |
| « Serveur met du temps » | Render se réveille — attendre 1 min, rafraîchir |
| Connexion refusée | Vérifier email/mot de passe démo |
| Carte lente mobile | Normal sur 4G ; webcams utilisent le dataset local (rapide) |

---

## Coût

| Service | Prix |
|---------|------|
| GitHub | Gratuit |
| Render (API) | Gratuit (limites veille) |
| Vercel (site) | Gratuit |

**Total : 0 €/mois** pour une démo PFA ouverte au public.
