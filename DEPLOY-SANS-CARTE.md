# Deployer Kalil Protein sans carte bancaire

Render et Vercel proposent des plans gratuits utilisables sans carte bancaire dans la plupart des cas.

## Render : app + API sur un seul lien

1. Creer un compte Render : https://dashboard.render.com/register
2. Se connecter avec GitHub.
3. Creer un Blueprint depuis le depot.
4. Verifier que le service s appelle `kalil-protein`.
5. Lancer le deploiement.
6. Tester :

```text
https://votre-url.onrender.com/
https://votre-url.onrender.com/api/health
```

## Vercel : frontend seul

1. Creer un compte : https://vercel.com/signup
2. Importer le depot GitHub.
3. Configurer :

```env
VITE_API_URL=https://votre-api-render.onrender.com
```

## Plateformes a eviter si vous ne voulez pas ajouter de carte

| Plateforme | Carte souvent demandee |
|------------|------------------------|
| Railway | Oui |
| Fly.io | Oui |
| Heroku | Oui |
| AWS / Azure / Google Cloud | Oui |
| Render | Non sur plan gratuit |
| Vercel Hobby | Non sur plan gratuit |
