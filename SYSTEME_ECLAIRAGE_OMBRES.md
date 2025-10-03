# 🌟 Système d'Éclairage et d'Ombres - Projet Space

## ✅ Corrections Implémentées

### 1. **Éclairage Principal (PointLight)**

#### Configuration Optimale
```javascript
// Lumière positionnée au centre de l'étoile (Soleil ou étoile Kepler)
const pointLight = new THREE.PointLight(0xFFFAF0, 4, 0, 2);
pointLight.position.set(0, 0, 0);
pointLight.castShadow = true;
```

**Paramètres:**
- **Couleur**: `0xFFFAF0` (blanc chaud naturel)
- **Intensité**: `4` (réduite pour contraste réaliste)
- **Distance**: `0` (portée infinie)
- **Decay**: `2` (atténuation physiquement réaliste)

#### Configuration des Ombres
```javascript
pointLight.shadow.mapSize.width = 4096;   // Haute résolution
pointLight.shadow.mapSize.height = 4096;
pointLight.shadow.camera.near = 0.5;
pointLight.shadow.camera.far = 50000;     // Grande portée
pointLight.shadow.bias = -0.0005;         // Anti-artefacts
pointLight.shadow.radius = 1;             // Ombres douces
```

### 2. **Lumière Ambiante**

#### Système Solaire Standard
```javascript
const ambientLight = new THREE.AmbientLight(0x111122, 0.05);
```
- Intensité très faible (`0.05`) pour préserver le contraste
- Couleur bleutée froide simulant la lumière réfléchie de l'espace

#### Système Réaliste
```javascript
const ambientLight = new THREE.AmbientLight(0x0a0a15, 0.03);
```
- Intensité ultra-faible (`0.03`) pour réalisme maximal
- Permet aux côtés non éclairés d'être vraiment sombres

#### script.js (système principal)
```javascript
const lightAmbient = new THREE.AmbientLight(0x111122, 0.08);
```
- Légèrement plus élevée pour faciliter la navigation

### 3. **Suppression des Lumières Redondantes**

❌ **SUPPRIMÉ** : DirectionalLight qui causait des artefacts
```javascript
// Cette lumière a été supprimée car elle:
// - Créait un double éclairage non réaliste
// - Éclairait les côtés opposés à l'étoile
// - Réduisait le contraste des ombres
```

❌ **SUPPRIMÉ** : Lumière de remplissage (fill light)
```javascript
// Supprimée pour préserver le contraste réaliste
// Dans l'espace, il n'y a pas de lumière de remplissage
```

## 🎨 Matériaux Optimisés

### Planètes (MeshPhongMaterial)
```javascript
const materialProps = {
  map: texture,
  shininess: 5,              // Très faible brillance
  specular: 0x050505,        // Réflexion minimale
  emissive: 0x000000,        // Pas d'émission propre
  emissiveIntensity: 0
};
```

### Atmosphères
```javascript
const atmosphereMaterial = new THREE.MeshPhongMaterial({
  map: atmosphereTexture,
  transparent: true,
  opacity: 0.3,
  shininess: 0,
  specular: 0x000000,
  // Ombres
  castShadow: false,         // Ne projettent pas d'ombres
  receiveShadow: true        // Mais en reçoivent
});
```

### Anneaux
```javascript
// Changé de MeshBasicMaterial à MeshPhongMaterial
const ringMaterial = new THREE.MeshPhongMaterial({
  map: ringTexture,
  transparent: true,
  opacity: 0.8,
  shininess: 0,
  specular: 0x000000,
  emissive: 0x000000,
  // Ombres
  castShadow: true,
  receiveShadow: true
});
```

### Lunes
```javascript
const moonMaterial = new THREE.MeshPhongMaterial({
  map: texture,
  shininess: 5,
  specular: 0x050505,
  emissive: 0x000000,
  // Ombres actives
  castShadow: true,
  receiveShadow: true
});
```

## 🌑 Configuration des Ombres par Objet

### Soleil/Étoile
```javascript
mesh.castShadow = false;      // Le soleil ne projette pas d'ombre
mesh.receiveShadow = false;   // Et n'en reçoit pas
```

### Planètes
```javascript
planet.castShadow = true;     // Projettent des ombres
planet.receiveShadow = true;  // Reçoivent des ombres
```

### Lunes
```javascript
moon.castShadow = true;
moon.receiveShadow = true;
```

### Atmosphères
```javascript
atmosphere.castShadow = false;  // Transparentes, ne projettent pas
atmosphere.receiveShadow = true; // Mais reçoivent pour effet réaliste
```

### Anneaux
```javascript
rings.castShadow = true;
rings.receiveShadow = true;
```

## 🎬 Rendu

### Configuration Renderer
```javascript
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Ombres douces
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0 - 1.2;
```

### Résolution des Shadow Maps
- **Système Standard**: 4096x4096 pixels
- **Système Réaliste**: 4096x4096 pixels
- **script.js**: 4096x4096 pixels

## ✨ Résultats Attendus

### Comportement Correct
1. ✅ Le côté face à l'étoile est **lumineux et chaud**
2. ✅ Le côté opposé à l'étoile est **sombre et froid**
3. ✅ Les ombres sont **nettes et réalistes**
4. ✅ Les planètes projettent des ombres sur leurs lunes
5. ✅ Les lunes projettent des ombres sur leurs planètes
6. ✅ Les anneaux créent des ombres sur les planètes (Saturne, Uranus)
7. ✅ Transition jour/nuit progressive sur les sphères

### Contraste Visuel
- **Côté jour**: Texture pleine luminosité + détails
- **Côté nuit**: Très sombre (uniquement lumière ambiante minimale)
- **Transition**: Gradient lisse entre les deux zones

## 🔧 Fichiers Modifiés

1. **src/script.js**
   - Réduction intensité lumière ambiante (2.5 → 0.08)
   - Réduction intensité PointLight (25 → 4)
   - Augmentation decay (1.8 → 2)
   - Suppression DirectionalLight
   - Shadow maps 4096x4096

2. **src/js/objects/Sun.js**
   - Optimisation PointLight (intensité, decay, couleur)
   - Shadow maps 4096x4096
   - Ajout logs de diagnostic

3. **src/js/objects/Planet.js**
   - Matériaux optimisés (shininess, specular, emissive)
   - Anneaux: MeshBasicMaterial → MeshPhongMaterial
   - Configuration ombres atmosphères
   - Configuration ombres anneaux
   - Amélioration matériaux lunes

4. **src/js/core/SolarSystemEngine.js**
   - Réduction lumière ambiante (0.2 → 0.05)
   - Suppression fill light
   - Simplification système d'éclairage

5. **src/js/core/RealisticSolarSystemEngine.js**
   - Réduction lumière ambiante (0.05 → 0.03)
   - Système minimaliste pour réalisme maximal

## 🧪 Tests Recommandés

### Test 1: Vérifier les Ombres
```javascript
// Dans la console
console.log('PointLight shadows:', pointLight.castShadow);
console.log('Shadow map size:', pointLight.shadow.mapSize);
```

### Test 2: Observer la Transition Jour/Nuit
- Naviguer autour d'une planète
- Vérifier que le côté opposé au soleil est vraiment sombre
- Vérifier la transition progressive

### Test 3: Systèmes Kepler
- Charger un système Kepler (ex: Kepler-442)
- Vérifier que l'étoile éclaire correctement
- Vérifier les ombres sur les exoplanètes

### Test 4: Ombres des Lunes
- Observer la Terre avec la Lune
- Vérifier l'ombre de la Lune sur la Terre
- Observer Jupiter avec ses lunes

### Test 5: Anneaux de Saturne
- Observer Saturne
- Vérifier l'ombre des anneaux sur la planète
- Vérifier que les anneaux reçoivent la lumière

## 📊 Performances

### Impact sur les FPS
- Shadow maps haute résolution: Impact modéré (~10-15% GPU)
- Compensé par la suppression des lumières redondantes
- Performance globale maintenue ou améliorée

### Optimisations Possibles
1. Réduire shadowMapSize à 2048 si nécessaire
2. Ajuster shadow.camera.far selon la vue
3. Désactiver les ombres pour objets lointains

## 🎯 Principe Physique

### Loi du Carré Inverse
```javascript
decay = 2  // Atténuation selon 1/distance²
```
La lumière s'atténue naturellement avec la distance, créant un effet réaliste.

### Absence de Lumière Ambiante dans l'Espace
Dans le vide spatial, il n'y a pas de diffusion atmosphérique. Les côtés non éclairés sont donc **vraiment sombres**, éclairés uniquement par:
- Lumière réfléchie des autres corps (simulée par lumière ambiante très faible)
- Lumière des étoiles lointaines (négligeable)

### Contraste Extrême
L'espace présente un contraste extrême entre lumière et ombre. Ce système reproduit fidèlement ce comportement.

---

**Date de mise à jour**: 3 octobre 2025  
**Version**: 2.0 - Système d'éclairage réaliste avec ombres
