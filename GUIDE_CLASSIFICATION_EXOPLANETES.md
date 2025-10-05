# 🪐 Guide - Classification des Exoplanètes

## ✅ Système Installé !

Le système de classification automatique des exoplanètes est maintenant opérationnel.

---

## 🎯 Comment ça Fonctionne

Quand vous chargez un système Kepler :
1. ✅ **Le Soleil change de taille** selon l'étoile
2. ✅ **Les exoplanètes sont classifiées** automatiquement
3. ✅ **Une texture est attribuée** à chaque planète
4. ✅ **Tout s'affiche dans la console** avec des tableaux formatés

---

## 🧪 Tester Maintenant

### **Méthode 1 : Console (Recommandé)**

1. Ouvrez : `http://localhost:5173/`
2. Ouvrez la console (F12)
3. Tapez :
   ```javascript
   solarSystemScript.routeHandler.navigateToKeplerSystem('Kepler-11')
   ```

### **Méthode 2 : URL Directe**

Tapez dans la barre d'adresse :
- `http://localhost:5173/kepler-11` (6 planètes)
- `http://localhost:5173/kepler-186` (5 planètes dont une en zone habitable)
- `http://localhost:5173/kepler-10` (2 planètes)

---

## 📊 Ce que Vous Verrez dans la Console

### **1. Chargement du Système**
```
============================================================
🌌 CHARGEMENT DU SYSTÈME Kepler-11
============================================================
```

### **2. Modification du Soleil**
```
🌟 MODIFICATION DU RAYON DU SOLEIL:
   Étoile: Kepler 11
   Rayon de l'étoile: 1.10 R☉
✅ Rayon du Soleil mis à jour!
```

### **3. Classification des Planètes**
```
============================================================
🔬 CLASSIFICATION DES EXOPLANÈTES
============================================================

🌿 PLANÈTE 1: Kepler-11 b
────────────────────────────────────────────────────────────
┌──────────────────┬──────────────────────────────────────┐
│ Classification   │ Grassland (grassland)                │
│ Type             │ terrestrial                          │
│ Rayon (R⊕)       │ 1.80                                 │
│ Température (K)  │ 1134                                 │
│ Distance (UA)    │ 0.091                                │
│ Confiance        │ 85%                                  │
└──────────────────┴──────────────────────────────────────┘
📝 Description: Prairies tempérées
🖼️ Texture: /images/textures_exoplanet/Grassland.png

🪐 PLANÈTE 2: Kepler-11 c
────────────────────────────────────────────────────────────
[... et ainsi de suite pour toutes les planètes ...]
```

### **4. Résumé**
```
📊 RÉSUMÉ DES CLASSIFICATIONS
────────────────────────────────────────────────────────────

🌍 Par Type:
┌─────────────┬────────┐
│ terrestrial │ 3      │
│ arid        │ 2      │
│ gas_giant   │ 1      │
└─────────────┴────────┘

🎨 Par Classification:
┌───────────┬────────┐
│ Grassland │ 2      │
│ Arid      │ 1      │
│ Gaseous   │ 1      │
│ Snowy     │ 2      │
└───────────┴────────┘

🖼️ TEXTURES UTILISÉES:
   1. /images/textures_exoplanet/Grassland.png
   2. /images/textures_exoplanet/Arid.png
   3. /images/textures_exoplanet/Gaseous.png
   4. /images/textures_exoplanet/Snowy.png
```

---

## 🎨 Classifications Disponibles

### 🌍 **Planètes Terrestres (Rocheuses)**

| Type | Rayon (R⊕) | Température (K) | Distance (UA) | Texture |
|------|-----------|-----------------|---------------|---------|
| **Grassland** 🌿 | 0.8–1.5 | 250–320 | 0.8–1.2 | Grassland.png |
| **Jungle** 🌴 | 0.9–1.8 | 280–330 | 0.7–1.1 | Jungle.png |
| **Snowy** ❄️ | 0.5–2.0 | 150–250 | 1.5–5.0 | Snowy.png |
| **Tundra** 🏔️ | 0.7–1.3 | 200–270 | 1.2–2.5 | Tundra.png |

### 🏜️ **Mondes Arides**

| Type | Rayon (R⊕) | Température (K) | Distance (UA) | Texture |
|------|-----------|-----------------|---------------|---------|
| **Arid** 🏜️ | 0.6–1.4 | 300–400 | 0.4–0.8 | Arid.png |
| **Sandy** 🏖️ | 0.8–1.6 | 280–380 | 0.5–0.9 | Sandy.png |
| **Dusty** 🌫️ | 0.7–1.2 | 200–350 | 0.6–2.0 | Dusty.png |

### 🔴 **Mondes Extrêmes**

| Type | Rayon (R⊕) | Température (K) | Distance (UA) | Texture |
|------|-----------|-----------------|---------------|---------|
| **Martian** 🔴 | 0.4–0.8 | 180–280 | 1.0–2.5 | Martian.png |
| **Barren** ⚫ | 0.3–1.0 | 100–500 | 0.1–10.0 | Barren.png |
| **Marshy** 🌿 | 1.0–2.2 | 260–310 | 0.8–1.3 | Marshy.png |

### ⛽ **Géantes Gazeuses**

| Type | Rayon (R⊕) | Température (K) | Distance (UA) | Texture |
|------|-----------|-----------------|---------------|---------|
| **Gaseous** 🪐 | 3.0–20.0 | 50–2000 | 0.1–30.0 | Gaseous.png |
| **Methane** 💠 | 2.5–15.0 | 50–150 | 5.0–50.0 | Methane.png |

---

## 💡 Commandes Console Utiles

### **Charger un Système**
```javascript
// Kepler-11 (6 planètes, grande variété)
solarSystemScript.routeHandler.navigateToKeplerSystem('Kepler-11')

// Kepler-186 (5 planètes, zone habitable)
solarSystemScript.routeHandler.navigateToKeplerSystem('Kepler-186')

// Kepler-90 (8 planètes, record!)
solarSystemScript.routeHandler.navigateToKeplerSystem('Kepler-90')
```

### **Voir les Données**
```javascript
// Planètes actuelles
window.currentExoplanets

// Système actuel
solarSystemScript.routeHandler.getCurrentSystem()

// Afficher toutes les classifications disponibles
solarSystemScript.ExoplanetGenerator.displayAllClassifications()
```

### **Retraiter les Planètes**
```javascript
// Si vous voulez revoir la classification
const system = solarSystemScript.routeHandler.getCurrentSystem();
const exoplanets = system.data?.exoplanets || system.exoplanets;
solarSystemScript.processExoplanets(exoplanets)
```

---

## 📂 Structure des Textures

Les textures doivent être dans :
```
Space/src/images/textures_exoplanet/
├── Grassland.png
├── Jungle.png
├── Snowy.png
├── Tundra.png
├── Arid.png
├── Sandy.png
├── Dusty.png
├── Martian.png
├── Barren.png
├── Marshy.png
├── Gaseous.png
└── Methane.png
```

---

## 🔍 Algorithme de Classification

Le système :
1. ✅ Récupère **rayon**, **température** et **distance** de chaque planète
2. ✅ Compare avec les **13 types** de classifications
3. ✅ Calcule un **score de correspondance** pour chaque type
4. ✅ Attribue la classification avec le **meilleur score**
5. ✅ Assigne la **texture correspondante**

**Score basé sur :**
- 40% Rayon (proximité du centre de la plage)
- 30% Température (proximité du centre de la plage)
- 30% Distance (proximité du centre de la plage)

---

## 🌟 Systèmes Recommandés pour Tests

### **Kepler-11** (Excellent pour tester)
- 6 planètes confirmées
- Grande variété de types
- Mélange de terrestres et géantes

### **Kepler-186** (Zone habitable)
- 5 planètes dont Kepler-186f (zone habitable)
- Étoile naine rouge (0.54 R☉)
- Bon exemple de diversité

### **Kepler-90** (Record)
- 8 planètes confirmées (comme notre système solaire!)
- Le plus grand système connu par Kepler

### **Kepler-20** (Variété)
- 5 planètes avec alternance tailles
- Mélange intéressant

---

## ✅ Vérifications

### Le système fonctionne si :
- ✅ La console affiche les tableaux de classification
- ✅ Chaque planète a une texture assignée
- ✅ Les chemins des textures pointent vers `/images/textures_exoplanet/`
- ✅ `window.currentExoplanets` contient les données

---

## 🚀 Prochaines Étapes

Maintenant que les planètes sont classifiées, vous pouvez :
1. 🔜 Générer les sphères 3D avec ces textures
2. 🔜 Positionner les planètes selon leur distance
3. 🔜 Créer les orbites
4. 🔜 Ajouter des animations

---

**Rechargez la page et testez : `solarSystemScript.routeHandler.navigateToKeplerSystem('Kepler-11')` 🎉**
