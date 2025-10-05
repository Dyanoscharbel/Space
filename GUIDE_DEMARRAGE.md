# 🚀 Guide de Démarrage Rapide

## 📋 Prérequis

- **Node.js** version 18 ou supérieure
- **npm** ou **yarn**
- Navigateur moderne supportant WebGL 2.0

## ⚡ Démarrage Ultra-Rapide

### Option 1: Script Automatique (Windows)
```bash
# Double-cliquez sur start.bat
./start.bat
```

### Option 2: Commandes Manuelles
```bash
# 1. Installation des dépendances
npm install

# 2. Démarrage du serveur de développement
npm run dev

# 3. Ouvrir http://localhost:3000
```

## 🧪 Test de l'Installation

1. **Ouvrir `test.html`** dans votre navigateur
2. **Cliquer sur tous les boutons de test**
3. **Vérifier que tout est vert** ✅

## 🎮 Première Utilisation

### Navigation 3D
- **Clic gauche + glisser** → Rotation de la caméra
- **Molette de souris** → Zoom avant/arrière
- **Clic droit + glisser** → Déplacement (pan)

### Interface
- **Clic sur une planète** → Affiche les informations détaillées
- **Barre de recherche** → Tapez le nom d'une planète
- **Contrôles en bas** → Ajustez vitesses et échelles

### Raccourcis Clavier
| Touche | Action |
|--------|--------|
| `Espace` | Pause/Play animation |
| `R` | Retour vue d'ensemble |
| `Ctrl+F` | Focus recherche |
| `Échap` | Fermer panneau |
| `F11` | Plein écran |

## 🎨 Personnalisation

### Modifier les Couleurs
Éditez `src/styles/main.css` :
```css
:root {
  --color-primary: #votre-couleur;
  --bg-primary: #votre-fond;
}
```

### Ajouter des Données
Éditez `src/js/data/solarSystemData.js` :
```javascript
export const SOLAR_SYSTEM_DATA = {
  // Ajoutez vos données ici
};
```

### Modifier l'Interface
Éditez `src/index_new.html` et `src/styles/components.css`

## 🔧 Configuration Avancée

### Variables d'Environnement
Copiez `.env.example` vers `.env` :
```bash
cp .env.example .env
```

Modifiez selon vos besoins :
```env
VITE_MAX_ASTEROIDS=2000
VITE_ENABLE_SHADOWS=true
VITE_DEBUG_MODE=true
```

### Build de Production
```bash
# Build optimisée
npm run build

# Aperçu de la build
npm run preview
```

## 🐛 Résolution de Problèmes

### Erreur "Module not found"
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Performance lente
1. **Réduire le nombre d'astéroïdes** dans `.env`
2. **Désactiver les ombres** si nécessaire
3. **Utiliser l'échelle visuelle** au lieu de réaliste

### Textures ne se chargent pas
1. **Vérifier que le serveur est démarré** avec `npm run dev`
2. **Contrôler les chemins** dans `solarSystemData.js`
3. **Vérifier la console** pour les erreurs 404

### WebGL non supporté
- **Mettre à jour votre navigateur**
- **Activer l'accélération matérielle**
- **Utiliser Chrome/Firefox récent**

## 📁 Structure des Fichiers

```
📦 Votre Projet
├── 🎯 src/index_new.html     # Interface principale
├── 🎨 src/styles/            # Tous les styles CSS
├── 🧠 src/js/core/           # Moteur 3D
├── 🌍 src/js/objects/        # Objets 3D (planètes, soleil)
├── 📊 src/js/data/           # Données scientifiques
├── 🎮 src/js/ui/             # Interface utilisateur
├── 🛠️ src/js/utils/          # Utilitaires
└── 🖼️ src/images/            # Textures des planètes
```

## 🎯 Prochaines Étapes

1. **Explorer l'interface** et tester toutes les fonctionnalités
2. **Lire le code** pour comprendre l'architecture
3. **Modifier les données** pour ajouter vos propres objets
4. **Personnaliser l'interface** selon vos goûts
5. **Préparer l'intégration IA** pour les exoplanètes

## 🆘 Besoin d'Aide ?

- **Console du navigateur** (F12) pour voir les erreurs
- **Fichier `test.html`** pour diagnostiquer les problèmes
- **Documentation THREE.js** : https://threejs.org/docs/
- **Données NASA** : https://nasa3d.arc.nasa.gov/

---

**Bon voyage dans l'espace ! 🚀🌌**
