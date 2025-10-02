# 🚀 Guide de Test - Route Kepler

## 📋 Prérequis

1. **Backend démarré** sur le port 3001
2. **Frontend démarré** avec Vite

## 🔧 Démarrage

### 1. Démarrer le Backend

```bash
cd backend
npm start
```

Le serveur devrait afficher :
```
🚀 Exoplanets API Server running on http://localhost:3001
```

### 2. Démarrer le Frontend

```bash
cd Space
npm run dev
```

Vite devrait démarrer sur http://localhost:5173

## 🧪 Tests

### Test 1 : Page de Test Dédiée

1. Ouvrir : `http://localhost:5173/test-kepler-route.html`
2. Ouvrir la console (F12)
3. Cliquer sur un des liens (ex: Kepler-10)
4. Observer les données dans la console

### Test 2 : URL Directe

1. Ouvrir : `http://localhost:5173/kepler-10`
2. Ouvrir la console (F12)
3. Observer les données affichées automatiquement

### Test 3 : Depuis la Page Principale

1. Ouvrir : `http://localhost:5173/`
2. Ouvrir la console (F12)
3. Taper dans la console :
   ```javascript
   solarSystemApp.getRouteHandler().navigateToKeplerSystem('Kepler-186')
   ```
4. Observer le changement d'URL et l'affichage des données

## 🎯 Ce qui Devrait Apparaître dans la Console

Quand vous naviguez vers `/kepler-10`, vous devriez voir :

```
🛣️ Initialisation du gestionnaire de routes...
✅ Gestionnaire de routes initialisé
🔍 Analyse de la route: /kepler-10
🎯 Route Kepler détectée: Kepler-10

============================================================
🌌 CHARGEMENT DU SYSTÈME Kepler-10
============================================================

🌌 Récupération du système Kepler-10...
✅ Système Kepler-10 récupéré: {...}

📊 INFORMATIONS DU SYSTÈME:

🌟 Nom du système: Kepler-10
⭐ Nombre de planètes: 2

🌟 ÉTOILE CENTRALE:
┌─────────────────┬──────────┐
│ Nom             │ Kepler 10│
│ Masse (M☉)      │ 0.91     │
│ Rayon (R☉)     │ 1.06     │
│ Température (K) │ 5627     │
│ Type            │ G-type   │
└─────────────────┴──────────┘

🪐 EXOPLANÈTES:

──── Planète 1: Kepler-10 b ────
┌──────────────────┬────────────┐
│ Nom              │ Kepler-10 b│
│ KOI Name         │ K00072.01  │
│ Rayon (R⊕)       │ 1.47       │
│ Température (K)  │ 1833       │
│ Distance (UA)    │ 0.017      │
│ Classification   │ barren     │
│ Type             │ extreme    │
│ Texture          │ Barren     │
│ Confiance        │ 100%       │
└──────────────────┴────────────┘

📝 Stérile

[... etc pour les autres planètes ...]

============================================================
✅ Système Kepler-10 chargé avec succès !
============================================================
```

## 🔍 Commandes Console Utiles

Une fois sur une page avec un système Kepler chargé :

```javascript
// Voir la route actuelle
solarSystemApp.getRouteHandler().getCurrentRoute()

// Voir les données du système
solarSystemApp.getRouteHandler().getCurrentSystem()

// Naviguer vers un autre système
solarSystemApp.getRouteHandler().navigateToKeplerSystem('Kepler-186')

// Retour au système solaire
solarSystemApp.getRouteHandler().navigateToSolarSystem()

// Accéder directement au service API
solarSystemApp.getRouteHandler().apiService.getKeplerSystem('Kepler-442')
```

## 📊 Données Affichées

Pour chaque système Kepler, vous verrez :

### Étoile Centrale
- Nom
- Masse (en masses solaires)
- Rayon (en rayons solaires)
- Température (Kelvin)
- Type spectral

### Exoplanètes
Pour chaque planète :
- Nom complet
- Identifiant KOI
- Rayon (en rayons terrestres)
- Température d'équilibre (Kelvin)
- Distance de l'étoile (UA)
- Classification automatique (grassland, arid, snowy, etc.)
- Type de planète (terrestrial, gas_giant, etc.)
- Texture procédurale assignée
- Niveau de confiance de la classification
- Description textuelle

## 🎨 Prochaines Étapes

Actuellement, les données sont **seulement affichées dans la console**.

Les prochaines étapes seront :
1. ✅ Afficher dans la console (FAIT !)
2. 🔜 Afficher dans une UI sur la page
3. 🔜 Générer les planètes en 3D
4. 🔜 Créer des textures procédurales basées sur la classification
5. 🔜 Animer le système en orbite

## ⚠️ Dépannage

### Le backend ne répond pas
- Vérifier que le backend est démarré : `cd backend && npm start`
- Vérifier l'URL : `http://localhost:3001/health`

### Rien dans la console
- Vérifier que la console est bien ouverte (F12)
- Vérifier que l'URL contient bien `/kepler-XXX`
- Vérifier les erreurs dans la console

### Erreur CORS
- Le backend doit autoriser localhost:5173
- Vérifier dans `backend/server.js` la configuration CORS

### Système fictif affiché
- Si le backend ne répond pas, un système fictif est généré automatiquement
- Vérifier que le backend est bien connecté à MongoDB

## 🌟 Systèmes Kepler à Tester

Systèmes avec beaucoup de planètes :
- `Kepler-11` (6 planètes)
- `Kepler-90` (8 planètes - record !)
- `Kepler-20` (5 planètes)

Systèmes célèbres :
- `Kepler-186` (Kepler-186f dans zone habitable)
- `Kepler-442` (Super-Terre potentiellement habitable)
- `Kepler-452` (Cousin de la Terre)
- `Kepler-22` (Première planète en zone habitable)

Systèmes avec peu de planètes :
- `Kepler-10` (2 planètes)
- `Kepler-4` (1 planète)
