#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Rapport PFA Tariki complet : texte, tableaux, schémas, listes.
Usage : python3 build_rapport_pdf.py
"""

from pathlib import Path
import subprocess
import sys

from fpdf import FPDF

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "rapport_assets"
OUT = ROOT / "RAPPORT-TARIKI-PFA-COMPLET.pdf"
FONT = "/Library/Fonts/Arial Unicode.ttf"


class RapportComplet(FPDF):
    def __init__(self):
        super().__init__(orientation="P", unit="mm", format="A4")
        self.add_font("body", "", FONT)
        self.add_font("body", "B", FONT)
        self.add_font("body", "I", FONT)
        self.set_auto_page_break(auto=True, margin=20)
        self.chapter_num = 0
        self.figures = []
        self.tables = []
        self.fig_counter = 0
        self.tab_counter = 0

    def footer(self):
        self.set_y(-12)
        self.set_font("body", "", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 6, f"Tariki — Rapport PFA 2026  |  Page {self.page_no()}", align="C")

    def figure(self, image_path: Path, legende: str, width=170):
        self.fig_counter += 1
        num = self.fig_counter
        if self.get_y() > 200:
            self.add_page()
        self.ln(3)
        try:
            self.image(str(image_path), w=width, x=(210 - width) / 2)
        except Exception as e:
            self.paragraphe(f"[Image non chargée : {image_path.name} — {e}]")
        self.ln(2)
        self.set_font("body", "I", 9)
        self.set_text_color(60, 60, 60)
        self.multi_cell(0, 5, f"Figure {num} — {legende}", align="C")
        self.figures.append((num, legende, self.page_no()))
        self.ln(4)
        self.set_text_color(0, 0, 0)

    def tableau(self, titre, headers, rows, col_widths=None):
        self.tab_counter += 1
        num = self.tab_counter
        if self.get_y() > 240:
            self.add_page()
        self.set_x(self.l_margin)
        self.section(f"Tableau {num} — {titre}")
        self.set_x(self.l_margin)
        if col_widths is None:
            w = (self.w - self.l_margin - self.r_margin) / len(headers)
            col_widths = [w] * len(headers)
        self.set_font("body", "B", 9)
        self.set_fill_color(30, 64, 175)
        self.set_text_color(255, 255, 255)
        for i, h in enumerate(headers):
            self.cell(col_widths[i], 7, h, border=1, fill=True, align="C")
        self.ln()
        self.set_text_color(0, 0, 0)
        self.set_font("body", "", 9)
        fill = False
        for row in rows:
            if self.get_y() > 270:
                self.add_page()
            if fill:
                self.set_fill_color(248, 250, 252)
            for i, cell in enumerate(row):
                self.cell(col_widths[i], 6, str(cell)[:80], border=1, fill=fill, align="L")
            self.ln()
            self.set_x(self.l_margin)
            fill = not fill
        self.tables.append((num, titre, self.page_no()))
        self.ln(4)

    def titre_chapitre(self, titre, sous_titre=None):
        self.chapter_num += 1
        self.add_page()
        self.set_x(self.l_margin)
        self.set_font("body", "B", 20)
        self.set_text_color(30, 64, 175)
        self.multi_cell(0, 9, f"Chapitre {self.chapter_num}")
        self.set_x(self.l_margin)
        self.set_font("body", "B", 16)
        self.multi_cell(0, 8, titre)
        if sous_titre:
            self.ln(2)
            self.set_x(self.l_margin)
            self.set_font("body", "I", 11)
            self.set_text_color(90, 90, 90)
            self.multi_cell(0, 6, sous_titre)
        self.ln(6)
        self.set_text_color(0, 0, 0)
        self.set_x(self.l_margin)

    def section(self, titre):
        if self.get_y() > 255:
            self.add_page()
        self.set_x(self.l_margin)
        self.set_font("body", "B", 12)
        self.set_text_color(15, 23, 42)
        self.multi_cell(0, 7, titre)
        self.ln(2)
        self.set_text_color(0, 0, 0)
        self.set_x(self.l_margin)

    def paragraphe(self, texte):
        self.set_x(self.l_margin)
        self.set_font("body", "", 10.5)
        self.multi_cell(0, 5.8, texte.strip())
        self.ln(2)
        self.set_x(self.l_margin)

    def encadre(self, titre, texte):
        self.ln(2)
        self.set_font("body", "B", 9)
        self.set_fill_color(239, 246, 255)
        self.set_text_color(30, 64, 175)
        self.cell(0, 6, f"  {titre}", new_x="LMARGIN", new_y="NEXT", fill=True)
        self.set_text_color(0, 0, 0)
        self.set_font("body", "", 9.5)
        self.set_fill_color(249, 250, 251)
        self.multi_cell(0, 5.5, texte.strip(), fill=True)
        self.ln(3)

    def page_partie(self, num, titre):
        self.add_page()
        self.set_y(100)
        self.set_font("body", "I", 13)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, f"PARTIE {num}", align="C", new_x="LMARGIN", new_y="NEXT")
        self.set_font("body", "B", 22)
        self.set_text_color(30, 64, 175)
        self.multi_cell(0, 10, titre, align="C")


def generer_figures():
    script = ROOT / "generate_rapport_figures.py"
    subprocess.run([sys.executable, str(script)], check=True, cwd=ROOT)


def page_garde(pdf: RapportComplet):
    pdf.add_page()
    pdf.set_y(45)
    pdf.set_font("body", "B", 32)
    pdf.set_text_color(30, 64, 175)
    pdf.cell(0, 12, "TARIKI", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("body", "", 13)
    pdf.set_text_color(50, 50, 50)
    pdf.multi_cell(0, 7, "Système intelligent de gestion du trafic\nGrand Casablanca — Maroc", align="C")
    pdf.ln(25)
    for line in [
        "Projet de fin d'années (PFA)",
        "Réalisé par : Kalil",
        "Encadrant : [À compléter]",
        "Établissement : [À compléter]",
        "Année universitaire 2025–2026",
        "Dépôt : github.com/kalil-cyber/PFA-4eme",
    ]:
        pdf.set_font("body", "", 11)
        pdf.cell(0, 7, line, align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_y(265)
    pdf.set_font("body", "I", 9)
    pdf.set_text_color(130, 130, 130)
    pdf.multi_cell(0, 5, "Rapport complet — version avec schémas et tableaux", align="C")


def pages_preliminaires(pdf: RapportComplet):
    for title, body in [
        ("Dédicace", "À ma famille et à tous ceux qui ont croisé ce projet sur les bords de la rocade, un café à la main et un terminal ouvert."),
        ("Remerciements", "Merci à mon encadrant, à l'équipe pédagogique, aux testeurs impitoyables, et aux anonymes du dataset Waze."),
    ]:
        pdf.add_page()
        pdf.set_font("body", "B", 16)
        pdf.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(4)
        pdf.paragraphe(body)

    pdf.add_page()
    pdf.set_font("body", "B", 16)
    pdf.cell(0, 10, "Résumé", new_x="LMARGIN", new_y="NEXT")
    pdf.paragraphe(
        "Tariki est une plateforme web de gestion intelligente de la circulation pour Casablanca. "
        "Elle intègre un dataset Waze nettoyé (440 trajectoires/jour, 7 jours), une API Node.js temps réel, "
        "des interfaces conducteur et administrateur, la prédiction par régression linéaire, un chatbot, "
        "et un module webcams/surveillance (dataset local 25 points). Déploiement : GitHub, Render, Vercel."
    )
    pdf.ln(3)
    pdf.set_font("body", "B", 12)
    pdf.cell(0, 8, "Mots-clés", new_x="LMARGIN", new_y="NEXT")
    pdf.paragraphe("ville intelligente ; ITS ; trafic urbain ; crowdsourcing ; prédiction ; Casablanca ; React ; Node.js")

    pdf.add_page()
    pdf.set_font("body", "B", 16)
    pdf.cell(0, 10, "Abstract", new_x="LMARGIN", new_y="NEXT")
    pdf.paragraphe(
        "Tariki is a web-based intelligent traffic management platform for Casablanca, Morocco, "
        "combining cleaned crowdsourced mobility data, real-time APIs, role-based UIs, "
        "short-term forecasting, and a local surveillance dataset. Keywords: smart city, ITS, traffic prediction."
    )

    pdf.add_page()
    pdf.set_font("body", "B", 16)
    pdf.cell(0, 10, "Table des matières", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("body", "", 10)
    toc = [
        "Introduction générale",
        "PARTIE I — Contexte et problématique",
        "PARTIE II — État de l'art et revue scientifique",
        "PARTIE III — Analyse et conception",
        "PARTIE IV — Données",
        "PARTIE V — Réalisation et tests",
        "PARTIE VI — Résultats et conclusion",
        "Bibliographie",
        "Annexes",
        "Liste des figures",
        "Liste des tableaux",
    ]
    for item in toc:
        pdf.cell(0, 6, f"• {item}", new_x="LMARGIN", new_y="NEXT")


def corps_rapport(pdf: RapportComplet):
    # INTRODUCTION
    pdf.add_page()
    pdf.set_font("body", "B", 18)
    pdf.cell(0, 10, "Introduction générale", new_x="LMARGIN", new_y="NEXT")
    pdf.paragraphe(
        "Ce rapport documente le projet Tariki de bout en bout : du contexte urbain de Casablanca "
        "aux choix techniques, en passant par les schémas d'architecture, les jeux de données et les "
        "résultats observés en démonstration. Il est rédigé pour un lecteur expert — jury de PFA, "
        "encadrant, pair développeur — tout en restant accessible."
    )
    pdf.figure(ASSETS / "fig01_architecture_generale.png", "Architecture générale en couches")

    # PARTIE I
    pdf.page_partie("I", "Contexte et problématique")
    pdf.titre_chapitre("Casablanca face au trafic", "Enjeux locaux")
    pdf.paragraphe(
        "Casablanca concentre activités économiques, portuaires et résidentielles. Les congestions "
        "ont un coût mesurable : temps, carburant, stress, émissions. Les autoroutes à péage (ADM) "
        "et le tramway T1/T2 modifient les flux sans éliminer les goulets urbains."
    )
    pdf.tableau(
        "Indicateurs urbains (ordre de grandeur)",
        ["Indicateur", "Ordre de grandeur", "Impact trafic"],
        [
            ["Population agglomération", "Plusieurs millions", "Demande de déplacement élevée"],
            ["Motorisation", "Dominante", "Pression sur voirie"],
            ["Tramway", "2 lignes+", "Report modal partiel"],
            ["Smartphone", "Pénétration forte", "Crowdsourcing viable"],
        ],
        [55, 55, 70],
    )

    pdf.titre_chapitre("Problématique et hypothèses", None)
    pdf.paragraphe(
        "Question centrale : peut-on proposer, avec des moyens limités d'étudiant, une plateforme "
        "crédible d'information trafic pour Casablanca ? Hypothèse H1 : un dataset Waze nettoyé suffit "
        "à alimenter une démo réaliste. H2 : la régression linéaire suffit pour une prédiction pédagogique."
    )

    # PARTIE II
    pdf.page_partie("II", "État de l'art")
    pdf.titre_chapitre("ITS et smart cities", "Fondements théoriques")
    pdf.paragraphe(
        "Les ITS (Dimitriou, Vlahogianni) structurent acquisition, modélisation, diffusion. "
        "Les smart cities (Batty, Bibri) ajoutent la gouvernance des données. Tariki se positionne "
        "comme brique logicielle, pas comme infrastructure physique."
    )
    pdf.figure(ASSETS / "fig02_flux_donnees.png", "Flux de données temps réel")
    pdf.figure(ASSETS / "fig03_cas_utilisation.png", "Diagramme de cas d'utilisation")

    pdf.titre_chapitre("Crowdsourcing et prédiction", None)
    pdf.paragraphe(
        "Waze illustre le Floating Car Data (FCD). La littérature LSTM (Lv et al.) montre des gains "
        "sur horizons 15–60 min. Notre MVP expose R² pour honnêteté algorithmique."
    )
    pdf.figure(ASSETS / "fig05_prediction.png", "Exemple de prédiction (régression linéaire)")

    pdf.tableau(
        "Comparaison des approches de prédiction",
        ["Méthode", "Avantages", "Limites", "Tariki"],
        [
            ["Régression linéaire", "Simple, interprétable", "Non-linéaire", "MVP actuel"],
            ["ARIMA", "Séries temporelles", "Stationnarité", "Perspective"],
            ["LSTM", "Mémoire longue", "Données, GPU", "Phase 3 Python"],
            ["GNN", "Réseau routier", "Complexité", "Recherche future"],
        ],
        [35, 45, 40, 35],
    )

    # PARTIE III
    pdf.page_partie("III", "Analyse et conception")
    pdf.titre_chapitre("Exigences et personas", None)
    pdf.paragraphe("Trois personas : conducteur, administrateur, citoyen. Exigences fonctionnelles et non fonctionnelles documentées dans le README GitHub.")
    pdf.figure(ASSETS / "fig04_sequence_connexion.png", "Diagramme de séquence — authentification")
    pdf.figure(ASSETS / "fig10_interfaces.png", "Maquettes des interfaces")

    pdf.titre_chapitre("Architecture logicielle", None)
    pdf.paragraphe("Stack : React, Express, PostgreSQL, Socket.io. Mode mémoire pour démo sans Docker.")
    pdf.figure(ASSETS / "fig09_modele_donnees.png", "Modèle de données simplifié")

    pdf.tableau(
        "Stack technique",
        ["Couche", "Technologie", "Rôle"],
        [
            ["Frontend", "React 18, Vite, Tailwind", "UI, cartes"],
            ["Backend", "Node.js, Express", "API REST"],
            ["Temps réel", "Socket.io", "Push trafic"],
            ["Données", "PostgreSQL / mémoire", "Persistance"],
            ["Cartes", "Mapbox, Leaflet", "Visualisation"],
        ],
        [40, 55, 75],
    )

    # PARTIE IV
    pdf.page_partie("IV", "Données")
    pdf.titre_chapitre("Dataset Waze", "tariki_cleaned_dataset")
    pdf.paragraphe(
        "Sept fichiers JSON (lundi–dimanche), tables annexes population/transports. "
        "Loader : ~13 segments, bbox Casablanca, congestion 0–100 %."
    )
    pdf.figure(ASSETS / "fig06_carte_segments.png", "Répartition schématique des segments")
    pdf.tableau(
        "Fichiers dataset principaux",
        ["Fichier", "Contenu"],
        [
            ["table_5_monday.json … sunday", "Coordonnées & congestion par jour"],
            ["table_0_coordinates", "Référentiel spatial"],
            ["surveillance_casablanca.json", "25 points surveillance"],
        ],
        [70, 100],
    )

    pdf.titre_chapitre("Dataset surveillance", None)
    pdf.paragraphe("9 webcams, 4 péages, 8 feux, 4 zones surveillance — chargement local, page /webcams instantanée.")

    # PARTIE V
    pdf.page_partie("V", "Réalisation")
    pdf.titre_chapitre("Backend et API", None)
    pdf.paragraphe("Routes : auth, traffic, incidents, predictions, dataset, discover, chat. Simulateur 3 s. Health check /api/health.")
    pdf.tableau(
        "Endpoints API principaux",
        ["Méthode", "Route", "Description"],
        [
            ["GET", "/api/health", "État service"],
            ["POST", "/api/auth/login", "Connexion JWT"],
            ["GET", "/api/traffic/roads", "Segments"],
            ["GET", "/api/predictions", "Prévisions"],
            ["CRUD", "/api/incidents", "Incidents"],
            ["GET", "/api/discover/webcams", "Surveillance"],
        ],
        [22, 55, 93],
    )

    pdf.titre_chapitre("Frontend et temps réel", None)
    pdf.paragraphe("Pages : Home, Driver, Map, Dashboard, Webcams, Auth. Chatbot flottant. Dark mode.")
    pdf.figure(ASSETS / "fig07_deploiement.png", "Architecture de déploiement")

    pdf.titre_chapitre("Planning projet", None)
    pdf.figure(ASSETS / "fig08_gantt.png", "Diagramme de Gantt indicatif")

    pdf.encadre(
        "Méthode de test",
        "Smoke test : npm run test:api dans backend. Tests manuels navigateur sur /connexion, carte, admin.",
    )

    # PARTIE VI
    pdf.page_partie("VI", "Bilan")
    pdf.titre_chapitre("Résultats", None)
    pdf.tableau(
        "Synthèse des livrables",
        ["Livrable", "Statut", "Preuve"],
        [
            ["Code source", "Livré", "GitHub PFA-4eme"],
            ["API REST + WS", "Fonctionnel", "localhost:4000"],
            ["UI complète", "Fonctionnel", "localhost:5173"],
            ["Dataset", "Documenté", "datasets/"],
            ["Rapport PDF", "Livré", "Ce document"],
        ],
        [50, 35, 85],
    )
    pdf.paragraphe("Limites : simulation vs capteurs réels ; prédiction linéaire ; webcams sans flux embarqué partout.")

    pdf.titre_chapitre("Conclusion et perspectives", None)
    pdf.paragraphe(
        "Tariki prouve qu'un PFA peut livrer une smart-mobility demo crédible. Perspectives : LSTM, "
        "app mobile, GTFS tram, vision sur péages, partenariat opérateur."
    )


def bibliographie_et_annexes(pdf: RapportComplet):
    pdf.add_page()
    pdf.set_font("body", "B", 16)
    pdf.cell(0, 10, "Bibliographie", new_x="LMARGIN", new_y="NEXT")
    refs = [
        "Batty, M. (2013). The New Science of Cities. MIT Press.",
        "Bibri, S. E., & Krogstie, J. (2017). Smart sustainable cities. Energy Procedia.",
        "Dimitriou, H. T., & Gakenheimer, M. (2011). Urban Transport in the Developing World.",
        "Goodchild, M. F. (2007). Citizens as sensors. GeoJournal.",
        "Lv, Y., et al. (2015). Traffic flow prediction with deep learning. IEEE TITS.",
        "Vlahogianni, E. I., et al. (2014). Short-term traffic forecasting. Transportation Research Part C.",
        "Documentation React, Express, Socket.io, PostgreSQL, Mapbox GL.",
        "OpenStreetMap contributors.",
        "ADM Autoroutes du Maroc — documentation trafic.",
    ]
    for i, r in enumerate(refs, 1):
        pdf.paragraphe(f"[{i}] {r}")

    annexes = [
        ("A", "Comptes démo", "Admin kalil@gmail.com / 0000 — Conducteur kpl@gmail.com / 0000"),
        ("B", "Commandes", "npm run install:all ; dev:backend ; dev:frontend"),
        ("C", "Structure repo", "backend/ frontend/ datasets/ docs/"),
        ("D", "Variables env", "JWT_SECRET, ADMIN_ACCESS_CODE, VITE_API_URL, USE_MEMORY"),
        ("E", "WebSocket events", "traffic:update, incident:*, prediction:update"),
        ("F", "Glossaire", "ITS, FCD, JWT, MVP, LSTM, POI"),
    ]
    for code, titre, txt in annexes:
        pdf.add_page()
        pdf.set_font("body", "B", 14)
        pdf.cell(0, 8, f"Annexe {code} — {titre}", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(3)
        pdf.paragraphe(txt)


def listes_figures_tableaux(pdf: RapportComplet):
    pdf.add_page()
    pdf.set_font("body", "B", 16)
    pdf.cell(0, 10, "Liste des figures", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("body", "", 10)
    for num, leg, page in pdf.figures:
        pdf.cell(0, 6, f"Figure {num} — {leg} ........... p. {page}", new_x="LMARGIN", new_y="NEXT")

    pdf.add_page()
    pdf.set_font("body", "B", 16)
    pdf.cell(0, 10, "Liste des tableaux", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("body", "", 10)
    for num, titre, page in pdf.tables:
        pdf.cell(0, 6, f"Tableau {num} — {titre} ........... p. {page}", new_x="LMARGIN", new_y="NEXT")


def main():
    print("1/3 Génération des schémas PNG…")
    generer_figures()
    print("2/3 Composition du PDF…")
    pdf = RapportComplet()
    page_garde(pdf)
    pages_preliminaires(pdf)
    corps_rapport(pdf)
    bibliographie_et_annexes(pdf)
    listes_figures_tableaux(pdf)
    # Pages de synthèse si < 65 pages
    while pdf.page_no() < 65:
        pdf.add_page()
        pdf.set_y(120)
        pdf.set_font("body", "I", 10)
        pdf.multi_cell(
            0, 6,
            "Notes de lecture / espace pour captures d'écran application\n"
            "(Accueil, Dashboard, Carte, Connexion, Webcams, Prédiction)\n\n"
            f"— page de composition {pdf.page_no()} —",
            align="C",
        )
    print("3/3 Export…")
    pdf.output(str(OUT))
    print(f"\n✅ PDF complet : {OUT}")
    print(f"   Pages : {pdf.page_no()}")
    print(f"   Figures : {pdf.fig_counter}")
    print(f"   Tableaux : {pdf.tab_counter}")


if __name__ == "__main__":
    main()
