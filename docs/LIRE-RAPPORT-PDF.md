# Rapport PFA Tariki

## Format recommandé : Word (.docx)

Le rapport officiel est au format **Microsoft Word**, éditable et conforme aux attentes d’un jury PFA.

**Fichier :** `~/Desktop/TARIKI-CODE/docs/RAPPORT-TARIKI-PFA.docx`

### Après ouverture dans Word

1. **Table des matières** : clic droit sur la zone grisée → *Mettre à jour les champs* → *Mettre à jour toute la table*.
2. **Export PDF** (pour remise jury) : *Fichier → Exporter → Créer un document PDF* (qualité bien supérieure à l’ancien PDF auto-généré).

### Régénérer le .docx

```bash
cd ~/Desktop/TARIKI-CODE/docs
python3 build_rapport_docx.py
open RAPPORT-TARIKI-PFA.docx
```

### Contenu inclus

- Page de garde, dédicace, remerciements, résumé, abstract
- Listes des figures et tableaux
- 6 parties (contexte, état de l’art, conception, données, réalisation, bilan)
- **10 schémas** intégrés (`rapport_assets/*.png`)
- **10+ tableaux** (API, stack, dataset, risques…)
- Bibliographie, annexes (comptes démo, URLs, glossaire)
- Zone pour **captures d’écran** (annexe G)

### Prérequis

```bash
pip install python-docx matplotlib numpy
```

### Autres fichiers

| Fichier | Usage |
|---------|--------|
| `RAPPORT-PFA-TARIKI.md` | Source texte (Markdown) |
| `build_rapport_docx.py` | Génère le .docx |
| `generate_rapport_figures.py` | Génère les PNG |
| `build_rapport_pdf.py` | Ancien PDF fpdf (déconseillé) |

Compléter sur la page de garde : **encadrant** et **établissement**.
