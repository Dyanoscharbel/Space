# 🌟 GUIDE COMPLET : SYSTÈME D'ÉCLAIRAGE DES PLANÈTES

## 📍 Localisation du code
**Fichier principal :** `src/script.js`
- **Lumières** : Lignes ~3210-3240
- **Lumière ambiante** : Lignes ~2115-2120

---

## 💡 LES 3 LUMIÈRES DU SYSTÈME

### 1️⃣ **AmbientLight** (Lumière ambiante)
```javascript
// Ligne ~2117
var lightAmbient = new THREE.AmbientLight(0x222222, 1.5);
scene.add(lightAmbient);
```

**À QUOI ÇA SERT :**
- Éclaire **uniformément** toute la scène
- Permet de voir le côté nuit des planètes (sinon il serait complètement noir)
- N'a pas de direction, éclaire de partout

**PARAMÈTRES À AJUSTER :**
- **Couleur** : `0x222222` (gris neutre) - Plus c'est élevé, plus c'est clair
- **Intensité** : `1.5` - Augmente = planètes plus lumineuses partout

**EFFET :**
- ⬆️ Augmenter = Les planètes sont plus lumineuses partout (moins de contraste)
- ⬇️ Diminuer = Le côté nuit est plus sombre (plus de contraste)

---

### 2️⃣ **PointLight** (Lumière du soleil)
```javascript
// Ligne ~3216
const lightIntensity = 100;
const lightDistance = 0; // 0 = portée infinie
const pointLight = new THREE.PointLight(0xFDFFD3, lightIntensity, lightDistance, 1.5);
pointLight.position.set(0, 0, 0); // Au centre du soleil
scene.add(pointLight);
```

**À QUOI ÇA SERT :**
- C'est la **VRAIE LUMIÈRE DU SOLEIL**
- Éclaire dans toutes les directions depuis le centre (position 0,0,0)
- Crée l'effet jour/nuit sur les planètes

**PARAMÈTRES À AJUSTER :**
- **Intensité** : `100` - Force de la lumière
- **Distance** : `0` (infini) - Portée de la lumière
- **Decay** : `1.5` - Atténuation de la lumière avec la distance (1.5 = réaliste)
- **Couleur** : `0xFDFFD3` (blanc jaunâtre, couleur du soleil)

**EFFET :**
- ⬆️ Augmenter intensité = Planètes plus lumineuses côté jour
- ⬇️ Diminuer intensité = Planètes plus sombres
- Distance = 0 = Portée infinie (NÉCESSAIRE pour vos planètes éloignées)

---

### 3️⃣ **DirectionalLight** (Lumière directionnelle)
```javascript
// Ligne ~3235
const directionalLight = new THREE.DirectionalLight(0xFDFFD3, 2);
directionalLight.position.set(0, 0, 0);
directionalLight.target.position.set(1000, 0, 0);
scene.add(directionalLight);
```

**À QUOI ÇA SERT :**
- Renforce l'éclairage dans une direction précise
- Simule les rayons du soleil parallèles
- **ATTENTION** : Peut inverser l'éclairage si mal configurée !

**PARAMÈTRES À AJUSTER :**
- **Intensité** : `2` - Force de la lumière
- **Position** : `(0, 0, 0)` - D'où part la lumière
- **Cible** : `(1000, 0, 0)` - Vers où va la lumière

**EFFET :**
- Si la partie jour est à l'opposé du soleil → **SUPPRIMER CETTE LUMIÈRE**
- Elle n'est pas nécessaire si la PointLight fonctionne bien

---

## 🎯 COMMENT CORRIGER L'ÉCLAIRAGE

### Problème : "La partie jour est à l'opposé du soleil"

**Solution 1 : SUPPRIMER la DirectionalLight**
```javascript
// COMMENTER OU SUPPRIMER ces lignes (~3235-3241) :
// const directionalLight = new THREE.DirectionalLight(0xFDFFD3, 2);
// directionalLight.position.set(0, 0, 0);
// directionalLight.target.position.set(1000, 0, 0);
// scene.add(directionalLight);
```

**Solution 2 : Augmenter la PointLight**
```javascript
const lightIntensity = 150; // Au lieu de 100
```

---

### Problème : "Les planètes sont trop sombres"

**Solution :**
```javascript
// Augmenter l'AmbientLight (ligne ~2117)
var lightAmbient = new THREE.AmbientLight(0x222222, 3); // Au lieu de 1.5

// ET/OU augmenter la PointLight (ligne ~3216)
const lightIntensity = 150; // Au lieu de 100
```

---

### Problème : "Pas assez de contraste jour/nuit"

**Solution :**
```javascript
// Diminuer l'AmbientLight
var lightAmbient = new THREE.AmbientLight(0x222222, 0.8); // Au lieu de 1.5

// Augmenter la PointLight
const lightIntensity = 150;
```

---

## 🔧 VALEURS RECOMMANDÉES

### Configuration actuelle (équilibrée)
```javascript
// AmbientLight
AmbientLight(0x222222, 1.5)

// PointLight
PointLight(0xFDFFD3, 100, 0, 1.5)

// DirectionalLight
DirectionalLight(0xFDFFD3, 2)
```

### Configuration "Contraste Fort" (plus dramatique)
```javascript
// AmbientLight - TRÈS FAIBLE
AmbientLight(0x111111, 0.5)

// PointLight - TRÈS FORTE
PointLight(0xFDFFD3, 200, 0, 1.5)

// DirectionalLight - SUPPRIMÉE
// (commentée)
```

### Configuration "Réaliste Space"
```javascript
// AmbientLight
AmbientLight(0x222222, 6)

// PointLight
PointLight(0xFDFFD3, 1200, 400, 1.4)

// DirectionalLight - AUCUNE
```

---

## 🎨 COMMENT LES MATÉRIAUX RÉAGISSENT

### MeshPhongMaterial (vos planètes)
```javascript
material = new THREE.MeshPhongMaterial({
    map: texture
});
```
- ✅ Réagit à la PointLight
- ✅ Réagit à la DirectionalLight
- ✅ Réagit à l'AmbientLight
- ✅ Crée automatiquement l'effet jour/nuit

### ShaderMaterial (Terre uniquement)
```javascript
const earthMaterial = new THREE.ShaderMaterial({
    uniforms: {
        sunPosition: { value: sun.position }
    }
});
```
- ⚠️ **NE réagit PAS** aux lumières Three.js automatiquement
- ✅ Calcule l'éclairage manuellement dans le shader
- ✅ Mis à jour chaque frame (ligne ~4291)

---

## 📊 TABLEAU DE DÉBOGAGE

| Problème | AmbientLight | PointLight | DirectionalLight |
|----------|--------------|------------|------------------|
| Tout noir | ⬆️ Augmenter | ⬆️ Augmenter | ⬆️ Augmenter |
| Pas de contraste | ⬇️ Diminuer | ⬆️ Augmenter | ⬇️ Diminuer |
| Jour inversé | - | - | ❌ Supprimer |
| Trop clair partout | ⬇️ Diminuer | ⬇️ Diminuer | ⬇️ Diminuer |

---

## 🧪 TEST RAPIDE

Pour tester l'éclairage :
1. Ouvrir la console du navigateur (F12)
2. Taper ces commandes :

```javascript
// Tester l'AmbientLight
lightAmbient.intensity = 3; // Augmenter
lightAmbient.intensity = 0.5; // Diminuer

// Tester la PointLight
pointLight.intensity = 200; // Augmenter
pointLight.intensity = 50; // Diminuer

// Supprimer la DirectionalLight
scene.remove(directionalLight);

// Remettre la DirectionalLight
scene.add(directionalLight);
```

---

## ✅ CHECKLIST

- [ ] AmbientLight activée (ligne ~2117)
- [ ] PointLight au centre (0,0,0) (ligne ~3218)
- [ ] PointLight avec portée infinie (distance = 0)
- [ ] Ombres activées sur le renderer (ligne ~1381)
- [ ] Planètes utilisent MeshPhongMaterial (ligne ~3260)
- [ ] Shader de la Terre mis à jour chaque frame (ligne ~4291)

---

## 🆘 SI RIEN NE MARCHE

**Essayez cette configuration minimaliste :**
```javascript
// SUPPRIMER la DirectionalLight complètement

// Mettre ces valeurs :
AmbientLight(0x333333, 2)      // Ambiante moyenne
PointLight(0xFFFFFF, 150, 0, 1.5)  // Lumière forte et blanche
```

---

**FICHIER CRÉÉ LE :** 3 octobre 2025
**DERNIÈRE MODIFICATION :** Configuration actuelle avec PointLight 100, Ambient 1.5, Directional 2
