# Déployer Tariki GRATUITEMENT — sans carte Visa

**Render** (recommandé pour Tariki) et **Vercel** : plan gratuit **sans carte bancaire**.

Évitez Railway, Fly.io, AWS, Google Cloud : ils demandent souvent une carte.

---

## Option 1 — Render (1 lien, app + API) — 5 minutes

### Ce que vous obtenez

```text
https://tariki.onrender.com
```

(ou un nom proche, selon Render)

Fonctionne sur **Windows, Mac, iPhone, Android** (navigateur).

### Étapes

1. Ouvrir ce lien (compte gratuit Render, **pas de paiement**) :  
   **https://dashboard.render.com/register**

2. S’inscrire avec **GitHub** (bouton GitHub — pas de carte).

3. Ensuite ouvrir le déploiement automatique du projet :  
   **https://dashboard.render.com/blueprint/new?repo=https://github.com/kalil-cyber/PFA-4eme**

4. Cliquer **Apply** (ou **Approve**).

5. Attendre 5–15 min (barre de build verte).

6. Dans Render → service **tariki** → copier l’URL en haut (ex. `https://tariki-xxxx.onrender.com`).

7. Tester :
   - `https://VOTRE-URL.onrender.com/`
   - `https://VOTRE-URL.onrender.com/connexion`
   - Compte : `kalil@gmail.com` / `0000`

### Si Render demande un plan

Choisir **Hobby** / **Free** — **ne pas** ajouter de carte.

### Première visite lente

Plan gratuit : le serveur dort après 15 min. La **1re** ouverture peut prendre ~1 minute. C’est normal.

---

## Option 2 — Vercel (site seul) + Render (API)

Sans carte sur les deux.

1. **Render** : blueprint ci-dessus (API).  
2. **Vercel** : https://vercel.com/signup → GitHub → importer `PFA-4eme`.  
3. Variables Vercel :
   - `VITE_API_URL` = URL Render (ex. `https://tariki-xxxx.onrender.com`)
   - `VITE_WS_URL` = même URL
   - `VITE_ADMIN_BASE` = `/tariki-ops`

Lien public = URL Vercel.

---

## Plateformes à éviter (carte souvent obligatoire)

| Plateforme | Carte ? |
|------------|---------|
| Railway | Souvent oui |
| Fly.io | Oui |
| Heroku | Souvent oui |
| AWS / Azure | Oui |
| **Render (gratuit)** | **Non** |
| **Vercel Hobby** | **Non** |

---

## Code déjà sur GitHub

Dépôt prêt : https://github.com/kalil-cyber/PFA-4eme  
Fichier de config : `render.yaml` (build automatique).

---

## Aide

Si le build Render échoue : Render → **Logs** → copier l’erreur et demander de l’aide.
