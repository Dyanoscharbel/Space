# 📏 Correction de l'Échelle des Exoplanètes

## 🎯 Problème Identifié

Les orbites des exoplanètes étaient **beaucoup trop petites** et se dessinaient dans le Soleil.

## 📐 Calcul de l'Échelle du Système Solaire

### **Définition : 1 UA (Unité Astronomique)**
1 UA = Distance Terre ↔ Soleil = 149 597 870,7 km

### **Dans le code du système solaire :**

```javascript
const REAL_DISTANCES_IN_EARTH_DIAMETERS = {
    earth: 11725,  // 149.6M km / 12756 km (diamètre terrestre)
};

const EARTH_DIAMETER_CANVAS = 12.8;  // Diamètre de la Terre en unités Three.js
const SCALE_COMPRESSION_FACTOR = 0.05;  // 5% de la vraie échelle

function getScaledDistance(planetName) {
    const realDistance = REAL_DISTANCES_IN_EARTH_DIAMETERS[planetName];
    const scaledDistance = realDistance * EARTH_DIAMETER_CANVAS * SCALE_COMPRESSION_FACTOR;
    return scaledDistance;
}

// Pour la Terre (1 UA) :
// 11725 × 12.8 × 0.05 = 7504 unités Three.js
```

### **Donc :**
**1 UA = 7504 unités Three.js**

---

## 🔧 Correction Appliquée

### **Avant (Incorrect)**

```javascript
this.scaleFactors = {
    distance: 50,  // ❌ Beaucoup trop petit !
    radius: 3
};

// Kepler-11 b à 0.091 UA :
// 0.091 × 50 = 4.55 unités ❌
// Résultat : Orbite dans le Soleil !
```

### **Après (Correct)**

```javascript
this.scaleFactors = {
    distance: 7504,  // ✅ Même échelle que système solaire
    radius: 10       // ✅ Plus visible
};

// Kepler-11 b à 0.091 UA :
// 0.091 × 7504 = 682.9 unités ✅
// Résultat : Orbite visible, bien positionnée !
```

---

## 📊 Comparaison des Distances

| Objet | Distance (UA) | Ancien (×50) | Nouveau (×7504) | Système Solaire |
|-------|--------------|--------------|-----------------|-----------------|
| **Kepler-11 b** | 0.091 | 4.6 ❌ | 682.9 ✅ | - |
| **Kepler-11 f** | 0.25 | 12.5 ❌ | 1876 ✅ | - |
| **Mercure** | 0.39 | 19.5 | 2927 | 2924 ✅ |
| **Terre** | 1.00 | 50 | 7504 | **7504** ✅ |
| **Mars** | 1.52 | 76 | 11407 | 11407 ✅ |

---

## ✅ Résultat

Maintenant les exoplanètes utilisent **exactement la même échelle** que le système solaire :

- ✅ **1 UA = 7504 unités** (cohérent)
- ✅ Orbites visibles et bien positionnées
- ✅ Proportions correctes entre planètes
- ✅ Navigation fluide

---

## 🧪 Test

Rechargez et exécutez :

```javascript
solarSystemScript.routeHandler.navigateToKeplerSystem('Kepler-11')
```

**Vous verrez :**
- ✅ 6 orbites colorées bien visibles
- ✅ Planètes correctement espacées
- ✅ Orbite la plus proche (Kepler-11 b) à 682 unités du Soleil
- ✅ Orbite la plus lointaine (Kepler-11 g) à ~2813 unités

---

## 📐 Formule Complète

```javascript
// Conversion UA → Unités Three.js
const visualDistance = distanceUA × 7504;

// Exemple Kepler-11 b :
// 0.091 UA × 7504 = 682.9 unités
```

---

**Status :** ✅ ÉCHELLE CORRIGÉE  
**Date :** 1 octobre 2025
