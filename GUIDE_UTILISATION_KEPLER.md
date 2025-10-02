# 🚀 Guide d'Utilisation - Système Solaire avec Kepler

## ✅ Configuration Terminée !

Le système est maintenant configuré pour :
- Afficher le système solaire complet en 3D
- Détecter automatiquement les routes `/kepler-XXX`
- Modifier le rayon du Soleil selon l'étoile du système Kepler

---

## 🎮 Comment Tester

### **Méthode 1 : Depuis la Page Principale**

1. Ouvrez : **`http://localhost:5173/`**
2. Vous voyez le système solaire normal
3. Ouvrez la console (F12)
4. Tapez :
   ```javascript
   solarSystemScript.routeHandler.navigateToKeplerSystem('Kepler-186')
   ```
5. **Observez** : Le Soleil devient beaucoup plus petit !

### **Méthode 2 : URL Directe**

Tapez directement dans la barre d'adresse :
- `http://localhost:5173/kepler-186` (naine rouge, très petit)
- `http://localhost:5173/kepler-10` (légèrement plus petit)
- `http://localhost:5173/kepler-11` (légèrement plus grand)
- `http://localhost:5173/kepler-452` (un peu plus grand)

### **Méthode 3 : Page de Test avec Interface**

Ouvrez : **`http://localhost:5173/test-sun-radius.html`**

Cette page a des boutons pour tester facilement !

---

## 🧪 Tests Recommandés

### Test 1 : Kepler-186 (Effet Dramatique)
```javascript
solarSystemScript.routeHandler.navigateToKeplerSystem('Kepler-186')
```
**Résultat** : Soleil devient **0.54x** sa taille (naine rouge) ⭐→🔴

### Test 2 : Kepler-11 (Légère Augmentation)
```javascript
solarSystemScript.routeHandler.navigateToKeplerSystem('Kepler-11')
```
**Résultat** : Soleil devient **1.1x** sa taille ⭐→☀️

### Test 3 : Retour au Système Solaire
```javascript
solarSystemScript.routeHandler.navigateToSolarSystem()
```
**Résultat** : Soleil revient à sa taille normale (1.0x) ☀️

---

## 📊 Ce qui se Passe dans la Console

Quand vous chargez un système Kepler, vous verrez :

```
🛣️ Initialisation du RouteHandler...
🔍 Analyse de la route: /kepler-186
🎯 Route Kepler détectée: Kepler-186

============================================================
🌌 CHARGEMENT DU SYSTÈME Kepler-186
============================================================

📊 INFORMATIONS DU SYSTÈME:
🌟 Nom du système: Kepler-186
⭐ Nombre de planètes: 5

🌟 ÉTOILE CENTRALE:
┌─────────────────┬──────────────┐
│ Rayon (R☉)     │ 0.54         │  👈 54% du Soleil !
└─────────────────┴──────────────┘

🪐 Système Kepler chargé, mise à jour du Soleil...

🌟 MODIFICATION DU RAYON DU SOLEIL:
   Étoile: Kepler 186
   Rayon original: 699.17 unités (1.0 R☉)
   Rayon de l'étoile: 0.54 R☉
   Nouveau rayon: 377.55 unités
✅ Rayon du Soleil mis à jour!
```

---

## 🎯 Commandes Console Disponibles

Depuis la console du navigateur (F12) :

```javascript
// Accéder au système
const sys = window.solarSystemScript;

// Charger un système Kepler
sys.routeHandler.navigateToKeplerSystem('Kepler-186');

// Voir les données du système actuel
sys.routeHandler.getCurrentSystem();

// Voir la route actuelle
sys.routeHandler.getCurrentRoute();

// Retour au système solaire
sys.routeHandler.navigateToSolarSystem();

// Accès direct aux objets 3D
sys.sun      // Le mesh du Soleil
sys.scene    // La scène Three.js
sys.camera   // La caméra
```

---

## 🌟 Systèmes Kepler Intéressants

| Système | Rayon Étoile | Effet Visuel | Description |
|---------|-------------|--------------|-------------|
| **Kepler-186** | 0.54 R☉ | ⭐→🔴 Très petit | Naine rouge célèbre |
| **Kepler-10** | 0.91 R☉ | ⭐→⭐ Légèrement plus petit | Étoile similaire au Soleil |
| **Kepler-11** | 1.10 R☉ | ⭐→☀️ Un peu plus grand | Système avec 6 planètes |
| **Kepler-452** | 1.11 R☉ | ⭐→☀️ Plus grand | "Cousin de la Terre" |
| **Kepler-442** | ~1.0 R☉ | ⭐→⭐ Similaire | Super-Terre habitable |

---

## 🎨 Raccourcis Clavier (Système Solaire)

- **R** : Réinitialiser la vue
- **H** : Vue d'ensemble (Home)
- **1-9** : Zoomer sur les planètes (1=Mercure, 9=Pluton)
- **Escape** : Fermer les infos
- **Molette** : Zoom in/out

---

## 🔧 Vérifications

### ✅ Le Soleil change de taille
- Zoomez sur le Soleil (molette)
- Chargez Kepler-186
- Le Soleil doit devenir beaucoup plus petit

### ✅ Les données s'affichent dans la console
- Les tableaux avec les infos de l'étoile et des planètes
- Les logs de modification du rayon

### ✅ Le retour au système solaire fonctionne
- Le Soleil revient à sa taille normale

---

## 🐛 Dépannage

### Le Soleil ne change pas
- Vérifiez que le backend répond : `http://localhost:3001/health`
- Regardez la console pour les erreurs
- Vérifiez : `solarSystemScript.sun` existe

### Erreur "routeHandler is not defined"
- Attendez que la page soit complètement chargée
- Rechargez la page (F5)

### Le système Kepler ne se charge pas
- Vérifiez le backend : `npm start` dans le dossier `backend`
- Vérifiez MongoDB est connecté

---

## 🎉 C'est Prêt !

**Rechargez maintenant la page `http://localhost:5173/` et testez !**

Les commandes les plus simples :
```javascript
// Dans la console
solarSystemScript.routeHandler.navigateToKeplerSystem('Kepler-186')
// Observez le Soleil devenir petit !

solarSystemScript.routeHandler.navigateToSolarSystem()
// Retour à la normale !
```

---

**Bon test ! 🚀**
