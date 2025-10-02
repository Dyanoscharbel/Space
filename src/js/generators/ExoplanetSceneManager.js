/**
 * 🪐 ExoplanetSceneManager
 * 
 * Gère la création des exoplanètes en 3D avec :
 * - Chargement des textures PNG selon classification
 * - Création des meshes Three.js
 * - Orbites colorées selon le type de planète
 * - Positionnement orbital
 * - Animation
 */

import * as THREE from 'three';

export class ExoplanetSceneManager {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.exoplanets = [];
        this.orbits = [];
        this.textureLoader = new THREE.TextureLoader();
        
        // Facteur d'échelle pour correspondre au système solaire
        // Système solaire : 1 UA = 11725 diamètres terrestres × 12.8 × 0.05 = 7504 unités
        // Donc : 1 UA = 7504 unités (même échelle que le système solaire)
        this.scaleFactors = {
            distance: 7504,  // 1 UA = 7504 unités (même que système solaire)
            radius: 10,      // Multiplicateur pour les rayons planétaires (plus visible)
        };
        
        // Couleurs des orbites selon le type de planète
        this.orbitColors = {
            grassland: 0x7CFC00,   // Vert prairie
            jungle: 0x228B22,      // Vert forêt
            snowy: 0xE0FFFF,       // Cyan clair
            tundra: 0x87CEEB,      // Bleu ciel
            arid: 0xD2691E,        // Marron orangé
            sandy: 0xF4A460,       // Sable
            dusty: 0xC0C0C0,       // Gris
            martian: 0xFF4500,     // Rouge orangé
            barren: 0x696969,      // Gris foncé
            marshy: 0x556B2F,      // Vert olive
            gaseous: 0xFFA500,     // Orange
            methane: 0x4169E1,     // Bleu royal
            default: 0xFFFFFF      // Blanc
        };
        
        console.log('🎨 ExoplanetSceneManager initialisé');
    }
    
    /**
     * Crée toutes les exoplanètes dans la scène
     * @param {Array} processedPlanets - Planètes classifiées
     * @param {Number} sunRadius - Rayon actuel du Soleil en unités Three.js
     */
    createExoplanets(processedPlanets, sunRadius = 698.88) {
        console.log('\n════════════════════════════════════════════════════════════');
        console.log('🪐 CRÉATION DES EXOPLANÈTES EN 3D');
        console.log('════════════════════════════════════════════════════════════');
        console.log(`📊 Nombre de planètes à créer: ${processedPlanets.length}`);
        console.log(`☀️ Rayon du Soleil: ${sunRadius.toFixed(2)} unités`);
        
        // Sauvegarder le rayon du Soleil pour les calculs de distance
        this.currentSunRadius = sunRadius;
        
        // Sauvegarder le nombre total de planètes pour la répartition angulaire
        this.totalPlanets = processedPlanets.length;
        
        // Nettoyer les anciennes exoplanètes
        this.clearExoplanets();
        
        processedPlanets.forEach((planet, index) => {
            this.createExoplanet(planet, index);
        });
        
        console.log(`✅ ${this.exoplanets.length} exoplanètes créées avec succès!`);
        console.log('════════════════════════════════════════════════════════════\n');
    }
    
    /**
     * Crée une seule exoplanète
     * @param {Object} planet - Données de la planète classifiée
     * @param {Number} index - Index de la planète
     */
    createExoplanet(planet, index) {
        const {
            name,
            radius,        // Rayon en R⊕ (Rayons terrestres)
            distance,      // Distance en UA
            temperature,
            classification,
            type,
            texturePath,
            confidence
        } = planet;
        
        console.log(`\n🌍 Création de: ${name}`);
        console.log(`   Type: ${classification} (${type})`);
        console.log(`   Rayon: ${radius} R⊕`);
        console.log(`   Distance: ${distance} UA`);
        console.log(`   Texture: ${texturePath}`);
        
        // Calculer les dimensions visuelles
        const visualRadius = this.calculateVisualRadius(radius);
        const visualDistance = this.calculateVisualDistance(distance);
        
        // Créer l'orbite
        const orbitColor = this.orbitColors[type] || this.orbitColors.default;
        const orbit = this.createOrbit(visualDistance, orbitColor);
        this.scene.add(orbit);
        this.orbits.push(orbit);
        
        console.log(`   💫 Orbite créée (couleur: #${orbitColor.toString(16).padStart(6, '0')})`);
        
        // Créer la géométrie de la planète
        const geometry = new THREE.SphereGeometry(visualRadius, 64, 64);
        
        // Charger la texture et créer le matériau
        this.textureLoader.load(
            texturePath,
            (texture) => {
                // Texture chargée avec succès
                const material = new THREE.MeshStandardMaterial({
                    map: texture,
                    roughness: 0.7,
                    metalness: 0.1
                });
                
                const mesh = new THREE.Mesh(geometry, material);
                
                // Calculer la position initiale sur l'orbite (répartition uniforme)
                const angle = (index / this.totalPlanets) * Math.PI * 2;
                mesh.position.x = visualDistance * Math.cos(angle);
                mesh.position.z = visualDistance * Math.sin(angle);
                mesh.position.y = 0;
                
                // Ajouter des données pour l'animation
                mesh.userData = {
                    name: name,
                    classification: classification,
                    type: type,
                    distance: visualDistance,
                    radius: visualRadius,
                    orbitSpeed: this.calculateOrbitSpeed(distance),
                    currentAngle: angle,
                    temperature: temperature,
                    confidence: confidence
                };
                
                // Ajouter à la scène
                this.scene.add(mesh);
                this.exoplanets.push(mesh);
                
                console.log(`   ✅ Mesh créé avec texture (rayon visuel: ${visualRadius.toFixed(2)} unités)`);
                console.log(`   📍 Position: (${mesh.position.x.toFixed(2)}, ${mesh.position.y.toFixed(2)}, ${mesh.position.z.toFixed(2)})`);
            },
            undefined,
            (error) => {
                // Erreur de chargement de texture - utiliser une couleur par défaut
                console.warn(`   ⚠️ Texture non trouvée: ${texturePath}`);
                console.log(`   🎨 Utilisation d'une couleur par défaut`);
                
                const fallbackColor = this.getFallbackColor(type);
                const material = new THREE.MeshStandardMaterial({
                    color: fallbackColor,
                    roughness: 0.7,
                    metalness: 0.1
                });
                
                const mesh = new THREE.Mesh(geometry, material);
                
                // Position initiale sur l'orbite (répartition uniforme)
                const angle = (index / this.totalPlanets) * Math.PI * 2;
                mesh.position.x = visualDistance * Math.cos(angle);
                mesh.position.z = visualDistance * Math.sin(angle);
                mesh.position.y = 0;
                
                // Données utilisateur
                mesh.userData = {
                    name: name,
                    classification: classification,
                    type: type,
                    distance: visualDistance,
                    radius: visualRadius,
                    orbitSpeed: this.calculateOrbitSpeed(distance),
                    currentAngle: angle,
                    temperature: temperature,
                    confidence: confidence
                };
                
                this.scene.add(mesh);
                this.exoplanets.push(mesh);
                
                console.log(`   ✅ Mesh créé avec couleur (rayon visuel: ${visualRadius.toFixed(2)} unités)`);
            }
        );
    }
    
    /**
     * Crée une orbite circulaire (même système que le système solaire)
     * @param {Number} radius - Rayon de l'orbite
     * @param {Number} color - Couleur de l'orbite
     * @returns {THREE.LineLoop} L'orbite
     */
    createOrbit(radius, color) {
        // Utiliser EllipseCurve comme dans le système solaire
        const orbitPath = new THREE.EllipseCurve(
            0, 0,              // centre (ax, aY)
            radius, radius,    // xRadius, yRadius (cercle parfait)
            0, 2 * Math.PI,    // aStartAngle, aEndAngle
            false,             // aClockwise
            0                  // aRotation
        );
        
        // Générer les points de l'orbite
        const pathPoints = orbitPath.getPoints(128);
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
        
        // Matériau avec opacité et respect du depth test complet
        const orbitMaterial = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.5,     // Plus visible que 0.03 du système solaire
            depthWrite: true,  // ✅ Écrire dans le depth buffer pour être caché par les planètes
            depthTest: true    // ✅ Tester la profondeur pour occlusion
        });
        
        // Créer la ligne en boucle
        const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
        
        // Rotation pour mettre l'orbite dans le plan horizontal (comme le système solaire)
        orbit.rotation.x = Math.PI / 2;
        
        // Les orbites sont rendues normalement (pas besoin de renderOrder négatif)
        // Le depthTest s'occupera de les cacher derrière les planètes
        
        return orbit;
    }
    
    /**
     * Calcule le rayon visuel de la planète pour Three.js
     * @param {Number} radius - Rayon réel en R⊕
     * @returns {Number} Rayon visuel
     */
    calculateVisualRadius(radius) {
        // Pour les petites planètes, on les agrandit un peu pour la visibilité
        const baseRadius = radius * this.scaleFactors.radius;
        return Math.max(baseRadius, 0.5); // Minimum 0.5 unités
    }
    
    /**
     * Calcule la distance visuelle pour Three.js
     * Distance = distance de l'étoile + rayon du Soleil (depuis la surface, pas le centre)
     * @param {Number} distance - Distance réelle en UA
     * @returns {Number} Distance visuelle
     */
    calculateVisualDistance(distance) {
        // Distance depuis le centre de l'étoile
        const distanceFromCenter = distance * this.scaleFactors.distance;
        
        // Ajouter le rayon du Soleil pour partir de sa surface
        const sunRadius = this.currentSunRadius || 698.88;
        const distanceFromSurface = distanceFromCenter + sunRadius;
        
        return distanceFromSurface;
    }
    
    /**
     * Calcule la vitesse orbitale (inverse de la distance)
     * @param {Number} distance - Distance en UA
     * @returns {Number} Vitesse orbitale
     */
    calculateOrbitSpeed(distance) {
        // Plus loin = plus lent (loi de Kepler simplifiée)
        return 0.001 / Math.sqrt(distance);
    }
    
    /**
     * Obtient une couleur de secours selon le type
     * @param {String} type - Type de planète
     * @returns {Number} Couleur hexadécimale
     */
    getFallbackColor(type) {
        const colors = {
            grassland: 0x7CFC00,
            jungle: 0x228B22,
            snowy: 0xFFFFFF,
            tundra: 0x87CEEB,
            arid: 0xD2691E,
            sandy: 0xF4A460,
            dusty: 0xC0C0C0,
            martian: 0xFF4500,
            barren: 0x696969,
            marshy: 0x556B2F,
            gaseous: 0xFFA500,
            methane: 0x4169E1
        };
        return colors[type] || 0x808080;
    }
    
    /**
     * Met à jour les positions des exoplanètes (appelé dans la boucle d'animation)
     * @param {Number} deltaTime - Temps écoulé depuis la dernière frame
     */
    update(deltaTime = 0.016) {
        this.exoplanets.forEach(planet => {
            const { distance, orbitSpeed, currentAngle } = planet.userData;
            
            // Calculer le nouvel angle
            const newAngle = currentAngle + orbitSpeed;
            planet.userData.currentAngle = newAngle;
            
            // Calculer la nouvelle position
            planet.position.x = distance * Math.cos(newAngle);
            planet.position.z = distance * Math.sin(newAngle);
            
            // Rotation sur elle-même
            planet.rotation.y += 0.001;
        });
    }
    
    /**
     * Nettoie toutes les exoplanètes de la scène
     */
    clearExoplanets() {
        console.log('🧹 Nettoyage des anciennes exoplanètes...');
        
        // Supprimer les meshes
        this.exoplanets.forEach(planet => {
            if (planet.geometry) planet.geometry.dispose();
            if (planet.material) {
                if (planet.material.map) planet.material.map.dispose();
                planet.material.dispose();
            }
            this.scene.remove(planet);
        });
        
        // Supprimer les orbites
        this.orbits.forEach(orbit => {
            if (orbit.geometry) orbit.geometry.dispose();
            if (orbit.material) orbit.material.dispose();
            this.scene.remove(orbit);
        });
        
        this.exoplanets = [];
        this.orbits = [];
        
        console.log('✅ Scène nettoyée');
    }
    
    /**
     * Obtient toutes les exoplanètes actuellement dans la scène
     * @returns {Array} Liste des meshes d'exoplanètes
     */
    getExoplanets() {
        return this.exoplanets;
    }
    
    /**
     * Obtient une exoplanète par son nom
     * @param {String} name - Nom de l'exoplanète
     * @returns {THREE.Mesh|null} Le mesh ou null
     */
    getExoplanetByName(name) {
        return this.exoplanets.find(planet => planet.userData.name === name) || null;
    }
    
    /**
     * Affiche les informations de toutes les exoplanètes
     */
    displayInfo() {
        console.log('\n════════════════════════════════════════════════════════════');
        console.log('📊 EXOPLANÈTES DANS LA SCÈNE');
        console.log('════════════════════════════════════════════════════════════');
        
        if (this.exoplanets.length === 0) {
            console.log('❌ Aucune exoplanète dans la scène');
            return;
        }
        
        this.exoplanets.forEach((planet, index) => {
            const { name, classification, type, distance, radius, temperature, confidence } = planet.userData;
            console.log(`\n🌍 ${index + 1}. ${name}`);
            console.log(`   Type: ${classification} (${type})`);
            console.log(`   Rayon: ${radius.toFixed(2)} unités`);
            console.log(`   Distance: ${distance.toFixed(2)} unités`);
            console.log(`   Température: ${temperature}K`);
            console.log(`   Confiance: ${confidence}%`);
            console.log(`   Position: (${planet.position.x.toFixed(2)}, ${planet.position.y.toFixed(2)}, ${planet.position.z.toFixed(2)})`);
        });
        
        console.log('\n════════════════════════════════════════════════════════════\n');
    }
    
    /**
     * Change les facteurs d'échelle
     * @param {Object} newScales - Nouveaux facteurs (distance, radius)
     */
    setScaleFactors(newScales) {
        if (newScales.distance) this.scaleFactors.distance = newScales.distance;
        if (newScales.radius) this.scaleFactors.radius = newScales.radius;
        console.log('📏 Facteurs d\'échelle mis à jour:', this.scaleFactors);
    }
    
    /**
     * Retourne tous les objets cliquables (exoplanètes + étoile) pour le système de raycast
     * @returns {Array} Tableau des meshes des exoplanètes et de l'étoile avec leurs données
     */
    getClickableObjects() {
        console.log(`🔍 getClickableObjects appelée - Exoplanètes disponibles: ${this.exoplanets.length}`);
        const clickableObjects = this.exoplanets.map(planet => {
            console.log(`  🪐 Ajout exoplanète: ${planet.userData?.name || 'SANS_NOM'}`);
            return {
                mesh: planet,
                userData: planet.userData,
                type: 'exoplanet'
            };
        });
        
        // Ajouter l'étoile centrale (le Soleil) avec des métadonnées Kepler
        if (window.sun && window.currentExoplanets) {
            clickableObjects.push({
                mesh: window.sun,
                userData: {
                    name: this.getKeplerStarName(),
                    type: 'kepler_star',
                    temperature: this.getKeplerStarTemperature(),
                    classification: 'Étoile de type G (similaire au Soleil)',
                    system: this.getCurrentSystemName()
                },
                type: 'kepler_star'
            });
        }
        
        return clickableObjects;
    }
    
    /**
     * Trouve une exoplanète par son mesh
     * @param {THREE.Mesh} mesh - Le mesh Three.js
     * @returns {Object|null} Les données de l'exoplanète ou null
     */
    findExoplanetByMesh(mesh) {
        const planet = this.exoplanets.find(p => p === mesh);
        if (planet) {
            return {
                mesh: planet,
                userData: planet.userData,
                type: 'exoplanet'
            };
        }
        
        // Vérifier si c'est l'étoile centrale dans un système Kepler
        if (mesh === window.sun && window.currentExoplanets) {
            return {
                mesh: mesh,
                userData: {
                    name: this.getKeplerStarName(),
                    type: 'kepler_star',
                    temperature: this.getKeplerStarTemperature(),
                    classification: 'Étoile de type G (similaire au Soleil)',
                    system: this.getCurrentSystemName()
                },
                type: 'kepler_star'
            };
        }
        
        return null;
    }
    
    /**
     * Obtient le nom de l'étoile du système Kepler actuel
     * @returns {string} Nom de l'étoile
     */
    getKeplerStarName() {
        if (window.currentExoplanets && window.currentExoplanets.length > 0) {
            // Extraire le nom du système depuis le nom de la première planète
            const firstPlanet = window.currentExoplanets[0];
            if (firstPlanet.name) {
                // Par exemple "Kepler-442 b" -> "Kepler-442"
                const systemName = firstPlanet.name.split(' ')[0];
                return systemName;
            }
        }
        return 'Étoile Kepler';
    }
    
    /**
     * Obtient la température estimée de l'étoile Kepler
     * @returns {string} Température de l'étoile
     */
    getKeplerStarTemperature() {
        // La plupart des étoiles Kepler sont similaires au Soleil
        return '5778 K (température solaire)';
    }
    
    /**
     * Obtient le nom du système actuel
     * @returns {string} Nom du système
     */
    getCurrentSystemName() {
        if (window.currentExoplanets && window.currentExoplanets.length > 0) {
            const firstPlanet = window.currentExoplanets[0];
            if (firstPlanet.name) {
                return firstPlanet.name.split(' ')[0];
            }
        }
        return 'Système Kepler';
    }
}

export default ExoplanetSceneManager;
