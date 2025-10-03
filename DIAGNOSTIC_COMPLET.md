# 🔍 DIAGNOSTIC COMPLET - Pourquoi Tout Est Noir

## 🎯 Checklist de Diagnostic

Copiez-collez ces commandes dans la console du navigateur (F12) après avoir chargé l'application :

### 1. Vérifier que la Scène Existe
```javascript
console.log('=== SCÈNE ===');
console.log('Scene existe:', typeof scene !== 'undefined');
console.log('Scene type:', scene?.type);
console.log('Objets dans la scène:', scene?.children.length);
```

### 2. Vérifier le Renderer
```javascript
console.log('\n=== RENDERER ===');
console.log('Renderer existe:', typeof renderer !== 'undefined');
console.log('Shadow map enabled:', renderer?.shadowMap.enabled);
console.log('Tone mapping:', renderer?.toneMapping);
console.log('Tone mapping exposure:', renderer?.toneMappingExposure);
console.log('Pixel ratio:', renderer?.getPixelRatio());
```

### 3. Vérifier les Lumières
```javascript
console.log('\n=== LUMIÈRES ===');
let lights = [];
scene.traverse(obj => {
    if (obj.isLight) {
        lights.push({
            type: obj.type,
            intensity: obj.intensity,
            castShadow: obj.castShadow,
            position: obj.position,
            parent: obj.parent?.type
        });
    }
});
console.log('Nombre de lumières:', lights.length);
console.table(lights);
```

### 4. Vérifier la PointLight du Soleil
```javascript
console.log('\n=== POINTLIGHT DU SOLEIL ===');
console.log('window.sunPointLight existe:', typeof window.sunPointLight !== 'undefined');
if (window.sunPointLight) {
    console.log('Intensité:', window.sunPointLight.intensity);
    console.log('Distance:', window.sunPointLight.distance);
    console.log('Decay:', window.sunPointLight.decay);
    console.log('Cast shadow:', window.sunPointLight.castShadow);
    console.log('Position:', window.sunPointLight.position);
    console.log('World position:', window.sunPointLight.getWorldPosition(new THREE.Vector3()));
    console.log('Parent:', window.sunPointLight.parent?.type);
    console.log('Visible:', window.sunPointLight.visible);
} else {
    console.error('❌ window.sunPointLight N\'EXISTE PAS !');
}
```

### 5. Vérifier le Soleil
```javascript
console.log('\n=== SOLEIL ===');
console.log('sun existe:', typeof sun !== 'undefined');
if (typeof sun !== 'undefined') {
    console.log('Position:', sun.position);
    console.log('Échelle:', sun.scale);
    console.log('Visible:', sun.visible);
    console.log('Matériau type:', sun.material?.type);
    console.log('Matériau emissive:', sun.material?.emissive);
    console.log('Matériau emissiveIntensity:', sun.material?.emissiveIntensity);
    console.log('Enfants du soleil:', sun.children.length);
    console.log('Enfants:', sun.children.map(c => c.type));
}
```

### 6. Vérifier les Planètes
```javascript
console.log('\n=== PLANÈTES ===');
let planets = [];
scene.traverse(obj => {
    if (obj.isMesh && obj.geometry?.type === 'SphereGeometry' && obj !== sun) {
        planets.push({
            name: obj.name || 'Sans nom',
            position: `${obj.position.x.toFixed(0)}, ${obj.position.y.toFixed(0)}, ${obj.position.z.toFixed(0)}`,
            visible: obj.visible,
            materialType: obj.material?.type,
            castShadow: obj.castShadow,
            receiveShadow: obj.receiveShadow
        });
    }
});
console.log('Nombre de planètes:', planets.length);
console.table(planets);
```

### 7. Vérifier les Matériaux
```javascript
console.log('\n=== MATÉRIAUX ===');
let materials = new Set();
scene.traverse(obj => {
    if (obj.isMesh && obj.material) {
        materials.add(obj.material.type);
    }
});
console.log('Types de matériaux:', Array.from(materials));
```

### 8. Vérifier la Caméra
```javascript
console.log('\n=== CAMÉRA ===');
console.log('Position:', camera.position);
console.log('Rotation:', camera.rotation);
console.log('Near:', camera.near);
console.log('Far:', camera.far);
console.log('FOV:', camera.fov);
```

### 9. Test: Augmenter l'Intensité Lumineuse
```javascript
console.log('\n=== TEST INTENSITÉ ===');
if (window.sunPointLight) {
    const oldIntensity = window.sunPointLight.intensity;
    window.sunPointLight.intensity = 100;
    console.log(`Intensité augmentée: ${oldIntensity} → 100`);
    console.log('Attendez quelques secondes et observez si les planètes s\'éclairent...');
    
    setTimeout(() => {
        console.log('Si les planètes sont maintenant visibles, le problème était l\'intensité.');
        console.log('Trouvez la bonne valeur entre 20 et 100.');
    }, 3000);
} else {
    console.error('❌ Impossible de tester: window.sunPointLight n\'existe pas');
}
```

### 10. Test: Augmenter l'Exposition
```javascript
console.log('\n=== TEST EXPOSITION ===');
const oldExposure = renderer.toneMappingExposure;
renderer.toneMappingExposure = 2.0;
console.log(`Exposition augmentée: ${oldExposure} → 2.0`);
console.log('Observez si l\'image s\'éclaircit...');

setTimeout(() => {
    console.log('Si tout est maintenant visible, le problème était l\'exposition du tone mapping.');
}, 3000);
```

### 11. Test: Créer une Lumière de Secours
```javascript
console.log('\n=== TEST LUMIÈRE DE SECOURS ===');
const testLight = new THREE.PointLight(0xffffff, 50, 0, 2);
testLight.position.set(0, 0, 0);
testLight.castShadow = true;
scene.add(testLight);
window.testLight = testLight;
console.log('Lumière de test créée à (0,0,0) avec intensité 50');
console.log('Si les planètes s\'éclairent maintenant, la PointLight originale avait un problème.');
```

## 🔧 Solutions Possibles

### Problème 1: PointLight N'existe Pas
**Symptôme**: `window.sunPointLight` est `undefined`

**Solution**:
```javascript
// Créer la PointLight manuellement
const sunLight = new THREE.PointLight(0xFDFFD3, 30, 0, 2);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 4096;
sunLight.shadow.mapSize.height = 4096;
sun.add(sunLight);
window.sunPointLight = sunLight;
console.log('✅ PointLight créée manuellement');
```

### Problème 2: Intensité Trop Faible
**Symptôme**: Planètes légèrement visibles mais très sombres

**Solution**:
```javascript
window.sunPointLight.intensity = 50; // ou plus
lightAmbient.intensity = 1.0; // augmenter aussi l'ambiante
```

### Problème 3: Tone Mapping Exposure Trop Faible
**Symptôme**: Tout est sombre malgré l'éclairage

**Solution**:
```javascript
renderer.toneMappingExposure = 1.5; // ou 2.0
```

### Problème 4: Matériaux qui Ne Réagissent Pas
**Symptôme**: MeshBasicMaterial présent

**Solution**:
```javascript
// Convertir tous les MeshBasicMaterial
scene.traverse(obj => {
    if (obj.isMesh && obj.material?.type === 'MeshBasicMaterial') {
        const oldColor = obj.material.color;
        obj.material = new THREE.MeshStandardMaterial({
            color: oldColor,
            metalness: 0.1,
            roughness: 0.7
        });
        console.log('Matériau converti:', obj.name || 'Sans nom');
    }
});
```

### Problème 5: Ombres Bloquent la Lumière
**Symptôme**: Erreurs de shadow map

**Solution**:
```javascript
// Désactiver temporairement les ombres
renderer.shadowMap.enabled = false;
console.log('Ombres désactivées pour test');
```

## 📊 Interprétation des Résultats

### Si Aucune Lumière N'est Trouvée
➡️ La PointLight n'a jamais été créée ou ajoutée à la scène
➡️ **Action**: Créer manuellement la PointLight (voir Solution 1)

### Si La Lumière Existe Mais Intensité = 0
➡️ L'intensité a été mise à 0 quelque part dans le code
➡️ **Action**: Augmenter l'intensité (voir Solution 2)

### Si Tout S'éclaire Avec Intensité = 100
➡️ L'intensité d'origine était trop faible
➡️ **Action**: Trouver la bonne valeur entre 30 et 100

### Si Tout S'éclaire Avec Exposition = 2.0
➡️ Le tone mapping exposure était trop faible
➡️ **Action**: Garder exposure entre 1.0 et 2.0

### Si La Lumière de Test Fonctionne
➡️ La PointLight originale n'était pas au bon endroit ou mal configurée
➡️ **Action**: Vérifier la hiérarchie et la position

## 🎯 Commande de Réparation Complète

Si rien ne fonctionne, exécutez ce script de réparation complète :

```javascript
console.log('🔧 RÉPARATION COMPLÈTE DU SYSTÈME D\'ÉCLAIRAGE...\n');

// 1. Supprimer toutes les lumières existantes
let removedLights = 0;
scene.traverse(obj => {
    if (obj.isLight) {
        obj.parent?.remove(obj);
        removedLights++;
    }
});
console.log(`✅ ${removedLights} lumières supprimées`);

// 2. Créer une lumière ambiante forte
const newAmbient = new THREE.AmbientLight(0x404040, 1.0);
scene.add(newAmbient);
console.log('✅ Lumière ambiante créée (intensité: 1.0)');

// 3. Créer une PointLight puissante au centre du Soleil
const newSunLight = new THREE.PointLight(0xFDFFD3, 50, 0, 2);
newSunLight.position.set(0, 0, 0);
newSunLight.castShadow = true;
newSunLight.shadow.mapSize.width = 2048;
newSunLight.shadow.mapSize.height = 2048;
newSunLight.shadow.camera.near = 0.5;
newSunLight.shadow.camera.far = 50000;
sun.add(newSunLight);
window.sunPointLight = newSunLight;
console.log('✅ PointLight créée et attachée au Soleil (intensité: 50)');

// 4. Ajuster l'exposition
renderer.toneMappingExposure = 1.2;
console.log('✅ Tone mapping exposure: 1.2');

// 5. Vérifier les matériaux
let converted = 0;
scene.traverse(obj => {
    if (obj.isMesh && obj.material?.type === 'MeshBasicMaterial' && obj !== sun) {
        const oldColor = obj.material.color;
        obj.material = new THREE.MeshStandardMaterial({
            color: oldColor,
            metalness: 0,
            roughness: 0.8
        });
        obj.castShadow = true;
        obj.receiveShadow = true;
        converted++;
    }
});
console.log(`✅ ${converted} matériaux convertis`);

// 6. Activer les ombres sur toutes les planètes
let shadowsEnabled = 0;
scene.traverse(obj => {
    if (obj.isMesh && obj !== sun) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        shadowsEnabled++;
    }
});
console.log(`✅ Ombres activées sur ${shadowsEnabled} objets`);

console.log('\n✅ RÉPARATION TERMINÉE !');
console.log('👀 Observez si les planètes sont maintenant visibles et éclairées.');
```

---

**Exécutez ces diagnostics dans l'ordre et notez les résultats pour identifier le problème exact.**
