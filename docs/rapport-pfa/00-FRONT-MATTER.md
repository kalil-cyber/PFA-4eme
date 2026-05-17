# TARIKI
## Quand la ville respire en données  
### Système intelligent de gestion du trafic à Casablanca

---

**Projet de fin d’années**  
**Filière :** [Informatique / Ingénierie — à compléter]  
**Établissement :** [À compléter]  
**Réalisé par :** Kalil  
**Encadré par :** [Nom de l’encadrant — à compléter]  
**Année universitaire :** 2025–2026  
**Dépôt public :** https://github.com/kalil-cyber/PFA-4eme  

---

> *« Ce n’est pas la carte qui fait la ville, mais la façon dont on lit la carte au bon moment. »*  
> — Note de travail, équipe Tariki, mars 2026

---

## Remerciements

Ce rapport n’est pas tombé du ciel, ni d’un simple export GitHub. Il est le fruit de mois de tâtonnements : nuits où le port 4000 refusait de s’ouvrir, après-midis passées à nettoyer des coordonnées GPS qui pointaient vers l’océan Atlantique, et ces moments de satisfaction quand la carte de Casablanca s’est enfin allumée en vert, jaune et rouge.

Je remercie [l’encadrant] pour [ses relectures / sa patience / son exigence bienveillante — à personnaliser]. Merci à ma famille et à mes camarades qui ont testé l’application sans pitié — en oubliant volontairement le mot de passe, juste pour voir si le message d’erreur était clair (il l’est devenu).

Enfin, merci aux conducteurs invisibles dont les trajectoires, anonymisées, alimentent le dataset Waze qui a rendu **Tariki** possible. Sans cette matière première numérique, nous n’aurions eu qu’un joli écran vide.

---

## Résumé (Français)

**Tariki** est une plateforme web de gestion intelligente de la circulation pour **Casablanca**. Elle articule trois mondes : celui de l’**usager** (conducteur, citoyen), celui de l’**opérateur** (administrateur trafic), et celui de la **donnée** (historique Waze, simulation temps réel, points de surveillance).

Le système repose sur une architecture **React / Node.js / PostgreSQL**, enrichie par **Socket.io** pour la diffusion quasi instantanée de l’état du réseau. Un module de **prédiction** par régression linéaire anticipe la congestion à trente minutes ; une feuille de route **LSTM** (Python) est documentée pour une seconde phase. L’authentification unifiée, le chatbot contextuel et le module **Webcams & surveillance** (dataset local de 25 points) complètent une démonstration réaliste d’une **ville intelligente** à échelle réduite mais crédible.

**Mots-clés :** ville intelligente, ITS, trafic urbain, crowdsourcing, prédiction, Casablanca, React, Node.js.

---

## Abstract (English)

**Tariki** is a web-based intelligent traffic management platform focused on **Casablanca, Morocco**. It combines cleaned crowdsourced mobility data (Waze-style trajectories, seven weekdays), a real-time API (Node.js, Express, Socket.io), role-based interfaces (driver vs. admin), incident management, short-term congestion forecasting (linear regression, LSTM-ready), a traffic-aware chatbot, and a local surveillance dataset (webcams, tolls, traffic lights as map references).

The project demonstrates a reproducible smart-mobility MVP deployable on GitHub, Render, and Vercel, with an in-memory fallback for academic demos without database infrastructure.

**Keywords:** smart city, ITS, traffic prediction, crowdsourcing, Casablanca.

---

## Comment lire ce document

| Symbole | Signification |
|---------|----------------|
| 📌 | Point clé pour le jury |
| 🔬 | Lien recherche / état de l’art |
| 🛠 | Détail technique implémenté |
| ⚠ | Limite assumée — honnêteté méthodologique |
| 💡 | Retour d’expérience terrain |

Le volume cible (**60 à 70 pages** en mise en forme Word : Times New Roman 12 pt, interligne 1,5, marges 2,5 cm) inclut ce texte, les tableaux, les schémas à insérer (captures d’écran) et les annexes. Les pages blanches de garde et de séparation entre chapitres sont à ajouter lors de la composition finale.

---

## Table des matières détaillée

**Partie I — Le récit et le contexte**  
Chapitre 1. Pourquoi Casablanca, pourquoi maintenant  
Chapitre 2. Voyage au cœur d’une métropole en mouvement  

**Partie II — La science avant le code**  
Chapitre 3. État de l’art : des capteurs aux smartphones  
Chapitre 4. Revue critique : ce que la littérature nous promet (et nous cache)  
Chapitre 5. Cadre théorique retenu pour Tariki  

**Partie III — De l’idée au produit**  
Chapitre 6. Analyse des besoins et personas  
Chapitre 7. Conception fonctionnelle et ergonomique  
Chapitre 8. Architecture logicielle et choix techniques  

**Partie IV — La matière première : les données**  
Chapitre 9. Le dataset Waze nettoyé : anatomie d’un fichier  
Chapitre 10. Dataset surveillance : péages, feux, webcams sans illusion  

**Partie V — Construction et expérimentation**  
Chapitre 11. Backend : API, simulateur, prédiction  
Chapitre 12. Frontend : cartes, émotions visuelles, temps réel  
Chapitre 13. Intelligence artificielle : du simple au profond  
Chapitre 14. Sécurité, éthique et gouvernance des données  

**Partie VI — Bilan**  
Chapitre 15. Résultats, limites, ce que nous ferions demain  
Chapitre 16. Conclusion générale  

**Annexes** (A à H)  
**Bibliographie**  
**Glossaire**
