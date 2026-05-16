# Tariki — Module IA (Phase 3)

Service Python optionnel pour remplacer la régression linéaire par un modèle LSTM.

- Entraînement sur séries du dataset Casablanca / historique simulé
- Endpoint FastAPI : `POST /predict` → prévisions par segment
- Intégration : `backend/src/services/predictionService.js` peut appeler ce service

Le MVP Node.js fonctionne sans ce module.
