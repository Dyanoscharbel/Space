# 🔧 Correction : Orbites Visibles à Travers les Exoplanètes

## Problème Identifié

Les **orbites** (blanches ou colorées) étaient visibles **à travers les exoplanètes**, créant un effet de transparence non désiré où les lignes traversaient les corps solides des planètes.

### Cause du Problème

L'erreur initiale était d'utiliser `depthWrite: false` pour les orbites, ce qui empêchait le depth buffer de les masquer correctement derrière les planètes.

---

## Solution Finale (Simplifiée)

### La Solution : `depthWrite: true` + `depthTest: true`

```javascript
createOrbit(radius, color) {
    const orbitMaterial = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.5,
        depthWrite: true,  // ✅ ACTIVER l'écriture dans le depth buffer
        depthTest: true    // ✅ Tester la profondeur pour occlusion
    });
    
    const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    
    return orbit;
}
```

**C'est tout !** Pas besoin de `renderOrder` compliqué. Le depth buffer de Three.js gère automatiquement l'occlusion.

---

## Explication Technique

### Depth Buffer (Z-Buffer)

Le **depth buffer** est une technique 3D qui enregistre la profondeur de chaque pixel rendu :

```
Pour chaque pixel à dessiner :
  1. Calculer la distance de l'objet à la caméra (profondeur Z)
  2. Comparer avec la profondeur déjà enregistrée
  3. Si plus proche → dessiner le pixel ET enregistrer la nouvelle profondeur
  4. Si plus loin → ne pas dessiner (objet caché)
```

### DepthWrite et DepthTest

```javascript
depthWrite: true   // ✅ Écrire la profondeur des orbites dans le buffer
depthTest: true    // ✅ Tester la profondeur pour occlusion
```

**Résultat** :
- Quand l'orbite est devant une planète → elle est visible
- Quand une planète est devant l'orbite → l'orbite est **cachée** automatiquement
- Pas besoin de gérer manuellement l'ordre de rendu !

---

## Rendu Automatique

```
Caméra → Orbite → Planète
         (visible)

Caméra → Planète → Orbite
         (visible)  (cachée par le depth buffer)
         
→ Three.js gère automatiquement !
```

---

## Résultat Visuel

### Avant ❌

```
🌍 Exoplanète
   |
   | (on voit l'orbite blanche à travers)
   |
━━━━━━━ Orbite blanche (visible à travers)
```

### Après ✅

```
🌍 Exoplanète (opaque)
   |
   | (orbite cachée derrière)
   |
━━━━━━━ Orbite blanche (cachée correctement)
```

---

## Fichiers Modifiés

### `src/js/generators/ExoplanetSceneManager.js`

**1 seule modification dans `createOrbit()`** - Ligne ~220 :

```javascript
const orbitMaterial = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.5,
    depthWrite: true,  // ✅ Changé de false à true
    depthTest: true    // ✅ Déjà présent
});
```

**Supprimé** :
- ❌ `orbit.renderOrder = -1` (inutile)
- ❌ `mesh.renderOrder = 1` (inutile)

**Pourquoi c'est plus simple** : Le depth buffer gère tout automatiquement !

---

## Autres Objets à Vérifier

Si d'autres éléments transparents ont des problèmes similaires :

### Anneaux de Saturne
```javascript
saturnRing.renderOrder = -1;  // Avant la planète
```

### Atmosphères
```javascript
atmosphere.renderOrder = 2;  // Après tout
atmosphere.material.depthWrite = false;
```

### Labels/Noms
```javascript
label.renderOrder = 10;  // Toujours visible au premier plan
```

---

## Tests à Effectuer

1. **Recharger la page**
2. **Charger un système Kepler** :
   ```javascript
   solarSystemScript.routeHandler.navigateToKeplerSystem('Kepler-11')
   ```
3. **Vérifier visuellement** :
   - ✅ Les exoplanètes cachent les orbites derrière elles
   - ✅ Les orbites colorées sont visibles devant le fond étoilé
   - ✅ Pas d'effet de transparence indésirable

4. **Tourner la caméra** :
   - Les orbites doivent apparaître/disparaître correctement selon la profondeur

---

## Points Clés

✅ **Solution simple** : `depthWrite: true` + `depthTest: true`  
✅ **Pas de renderOrder** : Le depth buffer gère tout  
✅ **Automatique** : Three.js cache les orbites derrière les planètes  
✅ **Universel** : Fonctionne pour toutes les orbites (système solaire ET exoplanètes)

---

## Impact

Cette correction améliore considérablement le **réalisme visuel** :

- Les planètes sont maintenant **opaques** comme dans la réalité
- Les orbites restent visibles mais ne traversent plus les corps célestes
- L'ordre de rendu est cohérent avec la physique

**Résultat** : Scène 3D plus propre et réaliste ! 🌟

---

**Date** : 1 octobre 2025  
**Statut** : ✅ Corrigé et prêt à tester
