# 🌌 Solar System Explorer

Explorateur 3D interactif du système solaire construit avec THREE.js et Vite. Le projet met l’accent sur la pédagogie (données réalistes), l’expérience (UI moderne) et l’extensibilité (modules clairs, événements, données externes comme Kepler).

## ✨ Points clés

- **THREE.js + Postprocessing**: rendu 3D, bloom sur le Soleil, outline à la sélection
- **Données réalistes**: dimensions, orbites, atmosphères, lunes (sources NASA/IAU)
- **UI moderne**: panneau d’informations, sliders de vitesses, recherche, raccourcis
- **Echelles**: mode réaliste et mode visuel optimisé via `SCALE_FACTORS`
- **Kepler**: bouton “Voir les données recueillies” affiché uniquement pour Kepler et ouvrant `koi-data-explorer`

## 📦 Pré-requis

- Node.js 16+ recommandé
- Navigateur moderne compatible WebGL

## 🚀 Installation & exécution

```bash
npm install
npm run dev
# Build de production
npm run build
```

Vite est configuré avec `root: src/`, sorties dans `dist/` et assets publics dans `static/` (voir `vite.config.js`).

## 🧭 Démarrage applicatif

- `src/index.html` crée le conteneur UI et charge `src/script.js` (ou `js/main.js` selon l’entry choisie)
- `script.js` instancie `SolarSystemEngine` (moteur 3D) et `UIManager` (interface), attend les événements `loading:*`, puis affiche l’UI

## 🏗️ Architecture

```
src/
├── index.html                     # UI et panneaux
├── script.js                      # Bootstrap appli (ou js/main.js)
├── js/
│   ├── core/
│   │   └── SolarSystemEngine.js   # Scène, caméra, renderer, passes, objets, events
│   ├── data/
│   │   ├── solarSystemData.js     # Données réalistes + facteurs d’échelle
│   │   └── realisticSolarSystemData.js # Variante 100% réaliste détaillée
│   ├── objects/
│   │   ├── Sun.js                 # Soleil + point light + corona shader
│   │   ├── Planet.js              # Planètes, anneaux, atmosphères, lunes
│   │   └── AsteroidBelt.js        # Ceintures (instanced mesh / fallback)
│   ├── ui/
│   │   └── UIManager.js           # Panneaux, sliders, recherche, plein écran
│   └── utils/
│       ├── EventEmitter.js        # Bus d’événements interne
│       └── LoadingManager.js      # Suivi du chargement
├── images/                        # Textures planètes/skybox
└── asteroids/                     # Modèle GLB des astéroïdes
```

### Flux moteur (`SolarSystemEngine`)
- Initialise scène, caméra (OrbitControls), renderer, postprocessing
- Crée Soleil, planètes, ceintures via `data/*` et `objects/*`
- Raycast pour survol/sélection, émet `object:selected`
- Boucle `renderLoop`: `animate()` (orbites/rotations), `composer.render()`

### UI (`UIManager`)
- Récupère éléments HTML (chargement, panneau latéral, sliders, recherche)
- Relie les événements moteur (`loading:*`, `object:*`, `animation:toggled`)
- Met à jour les infos et gère les interactions (vitesse, échelles, vues)

## 🎮 Contrôles

- Souris: rotation (drag), zoom (molette)
- Clic sur un objet: focus + panneau d’infos
- Clavier: Espace (pause/lecture), R (reset), Ctrl+F (recherche), Échap (fermer)

## 🔬 Données & échelles

- `js/data/solarSystemData.js`: valeurs réalistes, textures, lunes majeures, `SCALE_FACTORS` (`realistic`, `visual`)
- `js/data/realisticSolarSystemData.js`: dataset enrichi (vitesses, gravité, etc.) et `REALISTIC_SCALE_FACTORS`
- Les textures sont servies depuis `src/images/*`

## 📊 Kepler: données recueillies

- Quand l’objet affiché est Kepler, le panneau ajoute un bouton “Voir les données recueillies” qui ouvre le site d’exploration des données KOI dans un nouvel onglet: [`koi-data-explorer.vercel.app`](https://koi-data-explorer.vercel.app/)
- Ce bouton n’apparaît pour aucun autre objet (logique dans `updateBottomRightInfo` de `src/script.js`)

## ⚙️ Scripts NPM

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

Serveur: hôte local + réseau (voir `vite.config.js`), base `./`, sortie `dist/`.

## 🌐 Déploiement

- Build: `npm run build` → `dist/`
- Hébergement statique: Vercel/Netlify/GitHub Pages
  - Assurez `base: './'` (déjà configuré) pour chemins relatifs
  - Uploadez le dossier `dist/`

## 🧪 Dépannage

- Écran noir: vérifiez WebGL et la console du navigateur
- Textures manquantes: chemins `/images/*` cohérents avec `vite.config.js`
- Modèle astéroïdes: si GLB indisponible, fallback sphères est utilisé automatiquement
- Bouton Kepler absent: assurez-vous que Kepler est l’objet sélectionné et que les pop-ups ne sont pas bloqués

## ⚡ Performance

- Limitez `devicePixelRatio` (déjà plafonné à 2)
- Réduisez `SCALE_FACTORS.size` si trop denses
- Désactivez orbits/anneaux via UI si nécessaire
- Utilisez l’instancing (déjà fait pour les astéroïdes)

## 📚 Crédits & licences

- Données: NASA/JPL, IAU (voir commentaires dans `data/*`)
- Textures: Solar System Scope, Planet Pixel Emporium
- Licence: MIT (`LICENSE`)

## 🔮 Roadmap

- Intégration API NASA Exoplanet Archive
- Courbes de lumière et détection (TensorFlow.js)
- Tableaux de bord avancés et comparaisons

—

Fait pour l’exploration scientifique et l’éducation, avec THREE.js et passion.
