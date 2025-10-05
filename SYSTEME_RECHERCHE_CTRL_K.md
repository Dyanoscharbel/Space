# 🔍 Système de Recherche Rapide Ctrl+K

## Fonctionnalité Ajoutée

Un système de recherche rapide inspiré des éditeurs modernes (VS Code, GitHub) pour naviguer facilement entre les systèmes Kepler.

---

## 🎯 Composants

### 1. **Popup d'Aide (Auto-affiché)**
- Apparaît en **haut à droite** 2 secondes après le chargement
- Indique comment utiliser **Ctrl+K**
- Disparaît automatiquement après 10 secondes
- Cliquable pour ouvrir la recherche
- Bouton de fermeture manuelle (×)

### 2. **Barre de Recherche (Ctrl+K)**
- Overlay plein écran avec blur
- Design futuriste cohérent avec l'interface
- Suggestions en temps réel
- Navigation au clavier
- Auto-complétion des systèmes Kepler

---

## 🎮 Utilisation

### Raccourcis Clavier

| Raccourci | Action |
|-----------|--------|
| `Ctrl + K` | Ouvrir la recherche rapide |
| `↑` `↓` | Naviguer dans les suggestions |
| `Enter` | Charger le système sélectionné |
| `Esc` | Fermer la recherche |

### Recherche

1. **Tapez le nom** d'un système Kepler (ex: `Kepler-11`)
2. **Sélectionnez** dans les suggestions ou utilisez les flèches
3. **Appuyez sur Enter** pour charger

---

## 🌌 Systèmes Kepler Pré-configurés

```javascript
const keplerSystems = [
    'Kepler-11',    // 6 planètes, système compact
    'Kepler-90',    // 8 planètes, plus grand système
    'Kepler-186',   // 5 planètes, zone habitable
    'Kepler-442',   // Super-Terre habitable
    'Kepler-452',   // "Cousin de la Terre"
    'Kepler-20',    // Alternance terrestres/géantes
    'Kepler-62',    // 2 planètes habitables
    'Kepler-444',   // Très ancien (11 Ga)
    'Kepler-296',   // Système multi-planétaire
    'Kepler-438',   // Planète très similaire à la Terre
    // ... et plus
];
```

---

## 🎨 Design

### Popup d'Aide
```css
Position: fixed top-right (20px, 20px)
Background: rgba(0, 15, 35, 0.95) avec blur
Border: 2px solid #00d4ff
Animation: slideInRight 0.5s
Auto-fade: après 10 secondes
```

### Barre de Recherche
```css
Overlay: rgba(0, 0, 0, 0.8) + backdrop-blur
Container: 600px max-width, centré
Header: gradient bleu (#00d4ff → #0099cc)
Input: 18px, background transparent avec focus glow
Suggestions: hover + keyboard navigation
```

---

## 📁 Fichiers Créés

### `src/styles/search-popup.css`
**Styles CSS complets** :
- `.help-popup` - Design du popup d'aide
- `.search-overlay` - Overlay plein écran
- `.search-container` - Conteneur principal
- `.search-input` - Champ de saisie stylisé
- `.search-suggestions` - Liste des suggestions
- Animations et transitions fluides

### `src/js/kepler-search.js`
**Module JavaScript complet** :
- `KeplerSearchSystem` - Classe principale
- Gestion des événements clavier
- Auto-complétion intelligente
- Navigation dans les suggestions
- Intégration avec `routeHandler`
- Notifications de status

---

## 🔧 Intégration

### HTML (`index.html`)
```html
<!-- CSS -->
<link rel="stylesheet" href="styles/search-popup.css">

<!-- JavaScript -->
<script type="module" src="js/kepler-search.js"></script>
```

### Initialisation Automatique
```javascript
// Auto-init au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    keplerSearch = new KeplerSearchSystem();
});

// Disponible globalement
window.keplerSearch = keplerSearch;
```

---

## 🚀 Fonctionnement Technique

### 1. Détection Ctrl+K
```javascript
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        this.showSearch();
    }
});
```

### 2. Recherche en Temps Réel
```javascript
handleSearch(query) {
    // Filtrer les systèmes existants
    const filtered = this.keplerSystems.filter(system => 
        system.toLowerCase().includes(query.toLowerCase())
    );
    
    // Ajouter la requête directe si elle commence par "kepler-"
    if (query.toLowerCase().startsWith('kepler-')) {
        filtered.unshift(query);
    }
    
    this.showSuggestions(filtered.slice(0, 10));
}
```

### 3. Chargement du Système
```javascript
loadSystem(systemName) {
    // Utiliser le routeHandler existant
    window.solarSystemScript.routeHandler.navigateToKeplerSystem(systemName);
    
    // Notification de succès
    this.showNotification(`🚀 Chargement de ${systemName}...`, 'success');
}
```

---

## 📊 Flux d'Utilisation

```
1. Chargement de la page
   ↓
2. Popup d'aide apparaît (2s)
   ↓
3. Utilisateur appuie sur Ctrl+K
   ↓
4. Barre de recherche s'ouvre
   ↓
5. Utilisateur tape "Kepler-11"
   ↓
6. Suggestions filtrées apparaissent
   ↓
7. Sélection avec flèches ou clic
   ↓
8. Enter → chargement du système
   ↓
9. Recherche se ferme + notification
   ↓
10. Navigation vers le système Kepler
```

---

## 🎯 Exemple d'Utilisation

### Scénario 1: Recherche Directe
```
1. Ctrl+K
2. Taper "442"
3. "Kepler-442" apparaît en premier
4. Enter
→ Kepler-442 se charge
```

### Scénario 2: Navigation Clavier
```
1. Ctrl+K
2. Taper "kepler"
3. ↓ ↓ ↓ pour sélectionner "Kepler-90"
4. Enter
→ Kepler-90 se charge (8 planètes)
```

### Scénario 3: Système Custom
```
1. Ctrl+K
2. Taper "Kepler-1649"
3. (Pas dans la liste, mais ajouté automatiquement)
4. Enter
→ Tentative de chargement via API
```

---

## 🔔 Notifications

### Types de Messages
```javascript
// Succès (vert)
this.showNotification('🚀 Chargement de Kepler-11...', 'success');

// Erreur (rouge)
this.showNotification('❌ Erreur: Kepler-999 introuvable', 'error');

// Info (bleu)
this.showNotification('ℹ️ Recherche annulée', 'info');
```

### Affichage
- Position: haut-droite (comme le popup)
- Durée: 3 secondes ou clic pour fermer
- Animation: slide-in depuis la droite

---

## 🎨 Personnalisation

### Couleurs Principales
```css
--primary-blue: #00d4ff
--dark-bg: rgba(0, 15, 35, 0.95)
--success-green: rgba(34, 197, 94, 0.9)
--error-red: rgba(239, 68, 68, 0.9)
--overlay-bg: rgba(0, 0, 0, 0.8)
```

### Animations
```css
slideInRight: entrée depuis la droite
slideInUp: suggestions depuis le bas
fadeOut: disparition en fondu
```

---

## 🧪 Tests

### Test 1: Popup d'Aide
1. Recharger la page
2. ✅ Popup apparaît après 2 secondes
3. ✅ Disparaît après 10 secondes
4. ✅ Cliquable pour ouvrir recherche
5. ✅ Bouton × fonctionne

### Test 2: Recherche Rapide
1. Ctrl+K
2. ✅ Overlay s'ouvre avec focus sur input
3. Taper "kepler-11"
4. ✅ Suggestions filtrées
5. ↓ pour sélectionner
6. ✅ Sélection visuelle active
7. Enter
8. ✅ Système Kepler-11 se charge

### Test 3: Navigation Clavier
1. Ctrl+K dans la recherche
2. ✅ ↑↓ navigue dans les suggestions
3. ✅ Enter valide la sélection
4. ✅ Esc ferme la recherche

### Test 4: Intégration
1. Rechercher un système
2. ✅ Masquage du système solaire
3. ✅ Chargement des exoplanètes
4. ✅ Modification du soleil
5. ✅ Notification de succès

---

## 🔮 Extensions Futures

### Possible Améliorations
- **Historique** : Systèmes récemment visités
- **Favoris** : Marquer des systèmes préférés
- **Filtres** : Par nombre de planètes, zone habitable
- **Aperçu** : Mini-infos dans les suggestions
- **Recherche floue** : Tolérance aux fautes de frappe
- **Raccourcis** : Numéros pour sélection rapide

### API Integration
- **Auto-completion** : Requête backend pour tous les systèmes
- **Métadonnées** : Nombre de planètes, type d'étoile
- **Validation** : Vérifier l'existence avant chargement

---

## 📈 Avantages

✅ **UX Moderne** : Inspiration VS Code/GitHub  
✅ **Rapidité** : Navigation instantanée  
✅ **Discoverability** : Popup d'aide automatique  
✅ **Accessibilité** : Navigation complète au clavier  
✅ **Cohérence** : Design intégré à l'interface  
✅ **Feedback** : Notifications en temps réel  

---

## 🛠️ Maintenance

### Variables Globales
```javascript
window.keplerSearch    // Instance principale
keplerSearch.isVisible // État de la recherche
keplerSearch.suggestions // Suggestions actuelles
```

### Méthodes Publiques
```javascript
keplerSearch.showSearch()     // Ouvrir manuellement
keplerSearch.hideSearch()     // Fermer manuellement
keplerSearch.loadSystem(name) // Charger un système
```

### Debug Console
```javascript
// Lister les systèmes
console.log(keplerSearch.keplerSystems);

// Forcer l'ouverture
keplerSearch.showSearch();

// Charger directement
keplerSearch.loadSystem('Kepler-442');
```

---

**Date** : 1 octobre 2025  
**Statut** : ✅ Implémenté et fonctionnel  
**Fichiers créés** : 2 (CSS + JS)  
**Fichiers modifiés** : 1 (index.html)  
**Raccourci** : `Ctrl + K`