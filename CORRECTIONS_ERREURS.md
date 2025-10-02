# 🔧 Corrections des Erreurs Three.js

## ✅ Problèmes Corrigés

### 1. **Soleil - MeshBasicMaterial → MeshStandardMaterial**

**Erreur :**
```
THREE.Material: 'emissive' is not a property of THREE.MeshBasicMaterial.
THREE.Material: 'emissiveIntensity' is not a property of THREE.MeshBasicMaterial.
THREE.Material: 'emissiveMap' is not a property of THREE.MeshBasicMaterial.
```

**Cause :** `MeshBasicMaterial` ne supporte pas les propriétés émissives.

**Solution :** Changé en `MeshStandardMaterial` dans `Sun.js`

**Fichier modifié :** `src/js/objects/Sun.js`
```javascript
// AVANT
const material = new THREE.MeshBasicMaterial({
  map: sunTexture,
  emissive: 0xffaa00,        // ❌ Erreur !
  emissiveIntensity: 0.8,    // ❌ Erreur !
  emissiveMap: sunTexture    // ❌ Erreur !
});

// APRÈS
const material = new THREE.MeshStandardMaterial({
  map: sunTexture,
  emissive: 0xffaa00,        // ✅ Supporté
  emissiveIntensity: 0.8,    // ✅ Supporté
  emissiveMap: sunTexture,   // ✅ Supporté
  toneMapped: false          // ✅ Bonus : Soleil plus brillant
});
```

---

### 2. **Lunes - TypeError: moons is not iterable**

**Erreur :**
```
TypeError: moons is not iterable
Failed to initialize planet Jupiter
Failed to initialize planet Saturne
Failed to initialize planet Uranus
Failed to initialize planet Neptune
```

**Cause :** Dans `solarSystemData.js`, certaines planètes ont `moons` comme **nombre** (ex: Jupiter avec `moons: 95`), pas comme tableau.

**Exemple dans les données :**
```javascript
jupiter: {
  moons: 95,           // ❌ Nombre, pas un tableau !
  majorMoons: [...]    // ✅ Tableau avec les détails
}
```

**Solution :** Vérifier si `moons` est un tableau avant de l'itérer dans `Planet.js`

**Fichier modifié :** `src/js/objects/Planet.js`
```javascript
// AVANT
async createMoons() {
  const moons = this.data.moons || this.data.majorMoons || [];
  
  for (const moonData of moons) {  // ❌ Erreur si moons = 95
    // ...
  }
}

// APRÈS
async createMoons() {
  let moonsData = this.data.majorMoons || this.data.moons;
  
  // Si c'est un nombre ou undefined, ne rien faire
  if (!moonsData || typeof moonsData === 'number') {
    console.log(`   ℹ️ ${this.data.name}: ${moonsData || 0} lunes (non modélisées)`);
    return;
  }
  
  // Si c'est un tableau, créer les lunes
  if (Array.isArray(moonsData)) {
    for (const moonData of moonsData) {
      // ... ✅ OK !
    }
  }
}
```

---

### 3. **Astéroïdes - MeshPhongMaterial → MeshStandardMaterial**

**Erreur :**
```
THREE.Material: 'roughness' is not a property of THREE.MeshPhongMaterial.
THREE.Material: 'metalness' is not a property of THREE.MeshPhongMaterial.
```

**Cause :** `MeshPhongMaterial` ne supporte pas `roughness` et `metalness`. Ces propriétés sont spécifiques à `MeshStandardMaterial`.

**Solution :** Changé en `MeshStandardMaterial` dans `AsteroidBelt.js` (2 endroits)

**Fichier modifié :** `src/js/objects/AsteroidBelt.js`
```javascript
// AVANT (dans createInstancedAsteroids et createSimpleAsteroidBelt)
const material = new THREE.MeshPhongMaterial({
  color: 0x8B4513,
  roughness: 0.9,    // ❌ Erreur !
  metalness: 0.1     // ❌ Erreur !
});

// APRÈS
const material = new THREE.MeshStandardMaterial({
  color: 0x8B4513,
  roughness: 0.9,    // ✅ Supporté
  metalness: 0.1     // ✅ Supporté
});
```

---

## 📊 Récapitulatif des Types de Matériaux Three.js

| Matériau | Éclairage | Émissif | Roughness/Metalness | Usage |
|----------|-----------|---------|---------------------|-------|
| `MeshBasicMaterial` | ❌ Non | ❌ Non | ❌ Non | Objets non éclairés (UI, sprites) |
| `MeshPhongMaterial` | ✅ Oui (Phong) | ❌ Non | ❌ Non | Objets brillants classiques |
| `MeshStandardMaterial` | ✅ Oui (PBR) | ✅ Oui | ✅ Oui | **Matériau moderne recommandé** |
| `MeshPhysicalMaterial` | ✅ Oui (PBR+) | ✅ Oui | ✅ Oui | Matériau avancé avec transmission |

**PBR** = Physically Based Rendering (rendu basé sur la physique)

---

## 🎯 Fichiers Modifiés

1. ✅ `src/js/objects/Sun.js` - Matériau du Soleil
2. ✅ `src/js/objects/Planet.js` - Gestion des lunes
3. ✅ `src/js/objects/AsteroidBelt.js` - Matériau des astéroïdes (2 méthodes)

---

## 🧪 Vérification

Après ces corrections, vous devriez voir :

✅ **Console propre** - Plus d'erreurs de matériaux  
✅ **Soleil brillant** - Le Soleil s'affiche correctement avec son effet émissif  
✅ **Planètes avec lunes** - Terre avec la Lune, Jupiter avec ses 4 lunes principales  
✅ **Ceintures d'astéroïdes** - Astéroïdes visibles sans erreurs  

---

## 🔄 Prochaines Actions

1. **Rechargez la page** dans votre navigateur
2. **Ouvrez la console** (F12) - Elle devrait être propre
3. **Testez le système Kepler** : `http://localhost:5173/test-sun-radius.html`
4. **Vérifiez que le Soleil change de taille** quand vous cliquez sur les différents systèmes

---

**Les erreurs sont maintenant corrigées ! 🎉**
