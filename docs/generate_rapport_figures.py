#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Génère tous les schémas du rapport PFA (PNG)."""

from pathlib import Path
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np

ASSETS = Path(__file__).resolve().parent / "rapport_assets"
ASSETS.mkdir(exist_ok=True)

BLUE = "#1d4ed8"
LIGHT = "#dbeafe"
GREEN = "#22c55e"
YELLOW = "#eab308"
RED = "#ef4444"
GRAY = "#64748b"


def save(name):
    path = ASSETS / name
    plt.tight_layout()
    plt.savefig(path, dpi=160, bbox_inches="tight", facecolor="white")
    plt.close()
    print(f"  ✓ {name}")
    return path


def fig01_architecture():
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7)
    ax.axis("off")
    ax.set_title("Figure 1 — Architecture générale Tariki", fontsize=14, fontweight="bold", pad=12)
    layers = [
        (1, 5.2, "Couche présentation\nReact · Vite · Tailwind\nMapbox / Leaflet", LIGHT),
        (1, 3.6, "Couche API\nExpress · REST · JWT\nSocket.io", "#bfdbfe"),
        (1, 2.0, "Couche métier\nSimulateur · Prédiction · Chat\nDataset loader", "#93c5fd"),
        (1, 0.4, "Données\nPostgreSQL · memoryStore\ndatasets/ (Waze + surveillance)", "#60a5fa"),
    ]
    for x, y, text, color in layers:
        box = FancyBboxPatch((x, y), 8, 1.2, boxstyle="round,pad=0.05", facecolor=color, edgecolor=BLUE, linewidth=1.5)
        ax.add_patch(box)
        ax.text(5, y + 0.6, text, ha="center", va="center", fontsize=9)
    for y in [4.8, 3.2, 1.6]:
        ax.annotate("", xy=(5, y), xytext=(5, y + 0.35), arrowprops=dict(arrowstyle="->", color=GRAY, lw=1.5))
    save("fig01_architecture_generale.png")


def fig02_flux_donnees():
    fig, ax = plt.subplots(figsize=(10, 5))
    ax.axis("off")
    ax.set_title("Figure 2 — Flux de données temps réel", fontsize=14, fontweight="bold")
    boxes = ["Dataset Waze\n(JSON)", "Loader\n13 segments", "Simulateur\n3 s", "Socket.io", "Carte\nReact"]
    xs = np.linspace(0.5, 9.5, len(boxes))
    for i, (x, b) in enumerate(zip(xs, boxes)):
        ax.add_patch(FancyBboxPatch((x - 0.7, 2), 1.4, 1.2, boxstyle="round", fc=LIGHT, ec=BLUE))
        ax.text(x, 2.6, b, ha="center", va="center", fontsize=8)
        if i < len(boxes) - 1:
            ax.annotate("", xy=(x + 0.75, 2.6), xytext=(xs[i + 1] - 0.75, 2.6),
                        arrowprops=dict(arrowstyle="->", color=BLUE, lw=2))
    ax.text(5, 0.8, "Boucle de mise à jour : traffic:update · prediction:update", ha="center", fontsize=10, style="italic")
    save("fig02_flux_donnees.png")


def fig03_cas_utilisation():
    fig, ax = plt.subplots(figsize=(9, 6))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 8)
    ax.axis("off")
    ax.set_title("Figure 3 — Diagramme de cas d'utilisation", fontsize=14, fontweight="bold")
    ax.add_patch(FancyBboxPatch((3, 0.5), 4, 7, fill=False, edgecolor=GRAY, linestyle="--", linewidth=2))
    ax.text(5, 7.2, "Système Tariki", ha="center", fontsize=11, fontweight="bold")
    actors = [("Conducteur", 0.5, 6), ("Administrateur", 0.2, 3.5), ("Citoyen", 0.3, 1)]
    use_cases = [
        (5, 6.2, "Consulter carte\nItinéraire"),
        (5, 4.8, "Signaler / voir\nincidents"),
        (5, 3.5, "Dashboard\nPrédiction"),
        (5, 2.2, "Gérer dataset\nLogs"),
        (5, 0.9, "Météo · POI\nWebcams"),
    ]
    for name, x, y in actors:
        ax.text(x, y, name, fontsize=9, fontweight="bold")
        stick = plt.Circle((x + 0.3, y + 0.5), 0.15, color=BLUE)
        ax.add_patch(stick)
    for x, y, uc in use_cases:
        ax.add_patch(FancyBboxPatch((x - 1, y - 0.35), 2, 0.7, boxstyle="round", fc="#f0fdf4", ec=GREEN))
        ax.text(x, y, uc, ha="center", va="center", fontsize=7)
    save("fig03_cas_utilisation.png")


def fig04_sequence_auth():
    fig, ax = plt.subplots(figsize=(10, 5))
    ax.set_title("Figure 4 — Séquence : connexion utilisateur", fontsize=14, fontweight="bold")
    participants = ["Utilisateur", "React", "API Auth", "JWT / DB"]
    y_pos = {p: i for i, p in enumerate(participants)}
    for p, y in y_pos.items():
        ax.text(0, y, p, fontweight="bold", fontsize=9)
        ax.axhline(y, color="#e2e8f0", xmin=0.15, xmax=0.95)
    steps = [
        (0, 1, "Saisie email / MDP"),
        (1, 2, "POST /api/auth/login"),
        (2, 3, "Vérification bcrypt"),
        (3, 2, "Token JWT"),
        (2, 1, "Session + redirect"),
    ]
    x = 0.2
    for a, b, label in steps:
        ax.annotate("", xy=(x, y_pos[participants[b]]), xytext=(x, y_pos[participants[a]]),
                    arrowprops=dict(arrowstyle="->", color=BLUE))
        ax.text(x + 0.02, (y_pos[participants[a]] + y_pos[participants[b]]) / 2, label, fontsize=7, rotation=90, va="center")
        x += 0.16
    ax.set_xlim(-0.5, 1.2)
    ax.set_ylim(-0.5, len(participants) - 0.5)
    ax.axis("off")
    save("fig04_sequence_connexion.png")


def fig05_prediction():
    fig, ax = plt.subplots(figsize=(9, 4.5))
    t = np.arange(0, 24)
    hist = 40 + 15 * np.sin(t / 4) + np.random.default_rng(42).normal(0, 3, 24)
    hist = np.clip(hist, 10, 95)
    future = np.arange(24, 31)
    pred = hist[-1] + np.linspace(0, 12, 7) + np.random.default_rng(1).normal(0, 2, 7)
    pred = np.clip(pred, 10, 100)
    ax.plot(t, hist, "o-", color=BLUE, label="Historique (24 points)")
    ax.plot(future, pred, "s--", color=RED, label="Prédiction (30 min)")
    ax.axvline(23.5, color=GRAY, linestyle=":", label="Maintenant")
    ax.fill_between(future, pred - 8, pred + 8, alpha=0.2, color=RED)
    ax.set_xlabel("Pas de temps (× 5 min)")
    ax.set_ylabel("Congestion (%)")
    ax.set_title("Figure 5 — Prédiction par régression linéaire (exemple segment)", fontweight="bold")
    ax.legend(fontsize=8)
    ax.grid(True, alpha=0.3)
    ax.set_ylim(0, 100)
    save("fig05_prediction.png")


def fig06_carte_segments():
    fig, ax = plt.subplots(figsize=(8, 8))
    ax.set_title("Figure 6 — Segments routiers Casablanca (schéma)", fontweight="bold")
    np.random.seed(7)
    n = 13
    lats = 33.55 + np.random.rand(n) * 0.08
    lngs = -7.72 + np.random.rand(n) * 0.14
    colors = [GREEN, YELLOW, RED, GREEN, YELLOW, RED, GREEN, YELLOW, GREEN, RED, YELLOW, GREEN, YELLOW]
    for lat, lng, c in zip(lats, lngs, colors):
        ax.scatter(lng, lat, c=c, s=120, edgecolors="white", linewidths=1, zorder=3)
    ax.scatter(-7.59, 33.57, marker="*", c=BLUE, s=200, label="Centre Casa", zorder=4)
    ax.set_xlabel("Longitude")
    ax.set_ylabel("Latitude")
    ax.legend(loc="upper right", fontsize=8)
    ax.grid(True, alpha=0.3)
    leg = [mpatches.Patch(color=GREEN, label="Fluide"), mpatches.Patch(color=YELLOW, label="Modéré"),
           mpatches.Patch(color=RED, label="Congestionné")]
    ax.legend(handles=leg, loc="lower left", fontsize=8)
    save("fig06_carte_segments.png")


def fig07_deploiement():
    fig, ax = plt.subplots(figsize=(10, 4.5))
    ax.axis("off")
    ax.set_title("Figure 7 — Architecture de déploiement", fontweight="bold")
    items = [
        (1, 2.5, "Utilisateur\nNavigateur", "#f1f5f9"),
        (4, 2.5, "Vercel\nFrontend React", LIGHT),
        (7, 2.5, "Render\nAPI Node.js", "#bfdbfe"),
        (4, 0.5, "GitHub\nkalil-cyber/PFA-4eme", "#e0e7ff"),
    ]
    for x, y, t, c in items:
        ax.add_patch(FancyBboxPatch((x - 0.9, y - 0.5), 1.8, 1, boxstyle="round", fc=c, ec=BLUE))
        ax.text(x, y, t, ha="center", va="center", fontsize=9)
    arrows = [(1.9, 2.5, 3.1, 2.5), (4.9, 2.5, 6.1, 2.5), (4, 1.5, 4, 2)]
    for x1, y1, x2, y2 in arrows:
        ax.annotate("", xy=(x2, y2), xytext=(x1, y1), arrowprops=dict(arrowstyle="->", color=GRAY, lw=1.5))
    ax.set_xlim(0, 9)
    ax.set_ylim(0, 4)
    save("fig07_deploiement.png")


def fig08_gantt():
    fig, ax = plt.subplots(figsize=(10, 4))
    phases = ["Analyse & dataset", "Backend API", "Frontend UI", "IA & prédiction", "Webcams & tests", "Rapport & GitHub"]
    starts = [0, 3, 6, 9, 12, 15]
    durations = [3, 4, 5, 3, 2, 3]
    colors_bar = [BLUE, "#3b82f6", "#60a5fa", "#818cf8", "#a78bfa", "#c084fc"]
    for i, (p, s, d, c) in enumerate(zip(phases, starts, durations, colors_bar)):
        ax.barh(i, d, left=s, height=0.6, color=c, edgecolor="white")
        ax.text(s + d / 2, i, f"{d} sem.", ha="center", va="center", fontsize=8, color="white", fontweight="bold")
    ax.set_yticks(range(len(phases)))
    ax.set_yticklabels(phases, fontsize=9)
    ax.set_xlabel("Semaines (indicatif)")
    ax.set_title("Figure 8 — Planning projet (diagramme de Gantt)", fontweight="bold")
    ax.set_xlim(0, 19)
    ax.invert_yaxis()
    ax.grid(axis="x", alpha=0.3)
    save("fig08_gantt.png")


def fig09_modele_donnees():
    fig, ax = plt.subplots(figsize=(10, 5))
    ax.axis("off")
    ax.set_title("Figure 9 — Modèle de données (simplifié)", fontweight="bold")
    entities = [
        (1, 3, "users\nid, email, role\npassword_hash"),
        (5, 3, "road_segments\nid, name, status\ncongestion_level"),
        (3, 0.5, "incidents\nid, type, location\nstatus"),
    ]
    for x, y, t in entities:
        ax.add_patch(FancyBboxPatch((x - 1.2, y - 0.6), 2.4, 1.2, boxstyle="round", fc=LIGHT, ec=BLUE))
        ax.text(x, y, t, ha="center", va="center", fontsize=8)
    ax.annotate("", xy=(4, 3), xytext=(2.2, 3), arrowprops=dict(arrowstyle="<->", color=GRAY))
    ax.text(3.1, 3.3, "alerte", fontsize=7)
    save("fig09_modele_donnees.png")


def fig10_interfaces():
    fig, axes = plt.subplots(1, 3, figsize=(11, 3.5))
    titles = ["Accueil", "Dashboard admin", "Conducteur"]
    for ax, title in zip(axes, titles):
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.axis("off")
        ax.add_patch(FancyBboxPatch((0.05, 0.05), 0.9, 0.9, boxstyle="round", fc="#f8fafc", ec=GRAY))
        ax.add_patch(FancyBboxPatch((0.05, 0.82), 0.9, 0.13, fc=BLUE))
        ax.text(0.5, 0.88, "Tariki", ha="center", color="white", fontsize=9, fontweight="bold")
        ax.add_patch(FancyBboxPatch((0.1, 0.2), 0.35, 0.5, fc=LIGHT))
        ax.add_patch(FancyBboxPatch((0.55, 0.2), 0.35, 0.5, fc="#dcfce7"))
        ax.set_title(title, fontsize=10, fontweight="bold")
    fig.suptitle("Figure 10 — Maquettes des interfaces principales", fontsize=12, fontweight="bold", y=1.02)
    save("fig10_interfaces.png")


def main():
    print("Génération des schémas…")
    fig01_architecture()
    fig02_flux_donnees()
    fig03_cas_utilisation()
    fig04_sequence_auth()
    fig05_prediction()
    fig06_carte_segments()
    fig07_deploiement()
    fig08_gantt()
    fig09_modele_donnees()
    fig10_interfaces()
    print(f"Dossier : {ASSETS}")


if __name__ == "__main__":
    main()
