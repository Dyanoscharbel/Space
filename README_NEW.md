# 🌌 Solar System Explorer 2.0

Un explorateur 3D moderne du système solaire avec interface élégante, conçu comme base pour un projet d'identification d'exoplanètes par IA utilisant les données NASA.

## ✨ Nouveautés de la Version 2.0

### 🎨 Interface Utilisateur Moderne
- **Design System cohérent** avec variables CSS et thème sombre élégant
- **Interface glassmorphism** avec effets de flou et transparence
- **Animations fluides** et transitions polies
- **Responsive design** optimisé pour tous les écrans
- **Typographie moderne** avec Inter et JetBrains Mono

### 🏗️ Architecture Refactorisée
- **Code modulaire** organisé en classes et modules ES6
- **Séparation des responsabilités** (3D Engine, UI Manager, Data)
- **Gestion d'événements** centralisée avec EventEmitter
- **Système de chargement** avec indicateurs de progression
- **Gestion d'erreurs** robuste

### 🌍 Données Scientifiques Réelles
- **Échelles réelles** du système solaire avec mode visuel optimisé
- **Données NASA authentiques** pour toutes les planètes
- **Informations détaillées** : composition, atmosphère, lunes
- **Faits scientifiques** et descriptions éducatives

### 🚀 Fonctionnalités Avancées
- **Recherche intelligente** de planètes et objets célestes
- **Panneau d'informations** détaillé avec données scientifiques
- **Contrôles de vitesse** pour orbites et rotations
- **Modes de visualisation** (vue d'ensemble, système interne/externe)
- **Raccourcis clavier** pour navigation rapide

## 🛠️ Technologies Utilisées

- **THREE.js** - Rendu 3D WebGL
- **Vite** - Build tool moderne et rapide
- **ES6 Modules** - Architecture modulaire native
- **CSS Custom Properties** - Design system maintenable
- **Web APIs** - Fullscreen, Resize Observer, etc.

## 📁 Structure du Projet

```
src/
├── js/
│   ├── core/
│   │   └── SolarSystemEngine.js    # Moteur 3D principal
│   ├── objects/
│   │   ├── Planet.js               # Classe planète
│   │   ├── Sun.js                  # Classe soleil
│   │   └── AsteroidBelt.js         # Ceintures d'astéroïdes
│   ├── data/
│   │   └── solarSystemData.js      # Données scientifiques
│   ├── ui/
│   │   └── UIManager.js            # Gestionnaire d'interface
│   ├── utils/
│   │   ├── EventEmitter.js         # Système d'événements
│   │   └── LoadingManager.js       # Gestion du chargement
│   └── main.js                     # Point d'entrée
├── styles/
│   ├── main.css                    # Styles principaux
│   └── components.css              # Composants UI
├── images/                         # Textures des planètes
└── index_new.html                  # Interface moderne
```

## 🚀 Installation et Démarrage

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# Build de production
npm run build

# Aperçu de la build
npm run preview
```

## 🎮 Utilisation

### Navigation
- **Clic gauche + glisser** : Rotation de la caméra
- **Molette** : Zoom avant/arrière
- **Clic sur planète** : Sélection et informations détaillées

### Raccourcis Clavier
- **Espace** : Pause/lecture de l'animation
- **R** : Retour à la vue d'ensemble
- **Ctrl+F** : Focus sur la recherche
- **Échap** : Fermer les panneaux

### Contrôles Interface
- **Vitesse d'orbite** : Contrôle la vitesse des révolutions
- **Vitesse de rotation** : Contrôle la rotation des planètes
- **Échelle** : Basculer entre réaliste et visuelle
- **Vues** : Vue d'ensemble, système interne, système externe

## 🔬 Données Scientifiques

Toutes les données proviennent de sources officielles :
- **NASA JPL** - Données orbitales et physiques
- **IAU** - Standards astronomiques
- **Solar System Scope** - Textures haute qualité
- **Planet Pixel Emporium** - Cartes de surface

### Planètes Incluses
- ☀️ **Soleil** - Étoile centrale avec effets de corona
- ☿️ **Mercure** - Planète la plus proche, criblée de cratères
- ♀️ **Vénus** - Planète la plus chaude avec atmosphère dense
- 🌍 **Terre** - Notre planète bleue avec cycle jour/nuit
- ♂️ **Mars** - Planète rouge avec ses deux lunes
- ♃ **Jupiter** - Géante gazeuse avec ses lunes majeures
- ♄ **Saturne** - Planète aux anneaux spectaculaires
- ♅ **Uranus** - Géante de glace inclinée sur le côté
- ♆ **Neptune** - Planète la plus éloignée aux vents violents

## 🎯 Objectifs Futurs

Cette version sert de base pour un projet plus ambitieux :

### 🤖 Module IA d'Identification d'Exoplanètes
- **Intégration TensorFlow.js** pour l'analyse en temps réel
- **API NASA Exoplanet Archive** pour données réelles
- **Algorithmes de détection** basés sur les courbes de lumière
- **Visualisation 3D** des systèmes exoplanétaires découverts

### 📊 Tableau de Bord Scientifique
- **Métriques en temps réel** des découvertes
- **Graphiques interactifs** des données d'observation
- **Comparaisons** avec notre système solaire
- **Export des résultats** pour analyse approfondie

## 🤝 Contribution

Ce projet est conçu pour être extensible. Les contributions sont les bienvenues :

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/amazing-feature`)
3. **Commit** les changements (`git commit -m 'Add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **NASA** pour les données et textures
- **THREE.js Community** pour l'excellent framework 3D
- **Solar System Scope** pour les textures planétaires
- **Communauté open source** pour l'inspiration

---

**Développé avec ❤️ pour l'exploration spatiale et l'éducation scientifique**
