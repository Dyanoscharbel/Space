# 🚀 Quick Start - Exoplanètes 3D

## ⚡ Démarrage Rapide

### 1. Lancer le serveur
```bash
npm run dev
```

### 2. Ouvrir le navigateur
```
http://localhost:5173/test-exoplanets-3d.html
```

### 3. Cliquer sur un système
→ **Kepler-11** (recommandé pour premier test)

---

## 💻 Commandes Console

### Charger un système
```javascript
solarSystemScript.routeHandler.navigateToKeplerSystem('Kepler-11')
```

### Voir les infos
```javascript
solarSystemScript.exoplanetSceneManager.displayInfo()
```

### Obtenir les données
```javascript
window.currentExoplanets
```

---

## 🎯 Systèmes à Tester

| Commande | Planètes | Intérêt |
|----------|----------|---------|
| `navigateToKeplerSystem('Kepler-11')` | 6 | Varié, excellent test |
| `navigateToKeplerSystem('Kepler-90')` | 8 | Record ! |
| `navigateToKeplerSystem('Kepler-186')` | 5 | Zone habitable |

---

## ✅ Résultats Attendus

### Console
- ✅ Classification de chaque planète
- ✅ Création des meshes 3D
- ✅ Chemins des textures affichés
- ✅ Aucune erreur 404

### Scène 3D
- ✅ Soleil modifié (taille)
- ✅ Orbites colorées visibles
- ✅ Planètes avec textures
- ✅ Animation fluide

---

## 🎨 Couleurs des Orbites

| Couleur | Type |
|---------|------|
| 🟢 Vert clair | Grassland |
| 🟢 Vert foncé | Jungle |
| 🔵 Cyan | Snowy |
| 🔵 Bleu ciel | Tundra |
| 🟤 Marron | Arid |
| 🟡 Sable | Sandy |
| ⚪ Gris clair | Dusty |
| 🔴 Rouge | Martian |
| ⚫ Gris foncé | Barren |
| 🟢 Vert olive | Marshy |
| 🟠 Orange | Gaseous |
| 🔵 Bleu royal | Methane |

---

## 📁 Fichiers Clés

```
src/
├── script.js                              (Intégration)
├── test-exoplanets-3d.html               (Page de test)
└── js/generators/
    ├── ExoplanetGenerator.js              (Classification)
    └── ExoplanetSceneManager.js           (Rendu 3D)
```

---

## 🐛 Problème ?

### Planètes n'apparaissent pas
```javascript
console.log(solarSystemScript.exoplanetSceneManager)
console.log(window.currentExoplanets)
```

### Recharger un système
```javascript
solarSystemScript.routeHandler.navigateToKeplerSystem('Kepler-11')
```

### Nettoyer la scène
```javascript
solarSystemScript.exoplanetSceneManager.clearExoplanets()
```

---

## 📚 Documentation Complète

- **GUIDE_EXOPLANETES_3D.md** → Guide détaillé
- **SESSION_FINALE.md** → Résumé complet
- **CORRECTION_CHEMINS_TEXTURES.md** → Chemins des textures

---

**🎉 Tout est prêt ! Lancez `npm run dev` et testez !**
