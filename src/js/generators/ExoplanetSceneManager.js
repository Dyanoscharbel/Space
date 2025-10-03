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
        // ⭐ Nous n'utilisons plus cette liste d'orbites car nous utilisons uniquement les orbites du PlanetMarkerSystem
        // Mais nous l'initialisons quand même comme tableau vide pour éviter les erreurs
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
            // Utiliser la fonction du système solaire pour garantir le même comportement
            this.createExoplanetWithSolarSystemFunction(planet, index);
        });
        
        console.log('════════════════════════════════════════════════════════════\n');
    }
    
    /**
     * Crée une exoplanète en utilisant la fonction createPlanet du système solaire
     */
    createExoplanet(planet, index) {
        const {
            name,
            radius,
            distance,
            temperature,
            classification,
            type,  // ✅ Maintenant type contient la clé (grassland, jungle, etc.)
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
        
        // Créer un groupe pour la planète (comme le système solaire)
        const planetSystem = new THREE.Group();
        
        // Définir la couleur de l'orbite basée sur le type
        const orbitColor = this.orbitColors[type] || this.orbitColors.default;
        // ⭐ SUPPRESSION DE L'ORBITE DE BASE - On utilise uniquement celle du PlanetMarkerSystem
        // pour éviter la double orbite désalignée
        const orbit = null; // Plus de création d'orbite basique
        
        // 🎯 AJOUTER L'ORBITE COLORÉE via PlanetMarkerSystem (comme le système solaire)
        if (window.planetMarkerSystem) {
            try {
                window.planetMarkerSystem.createOrbit(name.toLowerCase(), visualDistance, orbitColor);
                console.log(`   🌈 Orbite colorée créée via PlanetMarkerSystem (opacity: 0.4)`);
            } catch (e) {
                console.warn(`   ⚠️ Erreur création orbite colorée:`, e);
            }
        }
        
        console.log(`   💫 Utilisation exclusive de l'orbite colorée du PlanetMarkerSystem`);
        
        // Créer la géométrie de la planète avec les MÊMES paramètres que dans createPlanet pour le système solaire
        // Utilisez EXACTEMENT les mêmes paramètres : 32 segments horizontaux, 20 segments verticaux
        const geometry = new THREE.SphereGeometry(visualRadius, 32, 20);
        
        // 🔧 CORRECTION : S'assurer que les normales pointent vers l'extérieur
        geometry.computeVertexNormals();
        
        // Charger la texture et créer le matériau
        this.textureLoader.load(
            texturePath,
            (texture) => {
                // Texture chargée avec succès - utiliser MeshPhongMaterial avec paramètres améliorés
                
                // Appliquer des corrections à la texture pour éviter les coutures visibles
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1, 1);
                texture.offset.set(0, 0);
                
                // Appliquer un filtre bilinéaire pour adoucir les bords
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                
                // Désactiver les mipmaps pour éviter les artefacts aux coutures
                texture.generateMipmaps = false;
                
                // Option 1: Matériel standard avec paramètres améliorés
                let material;
                
                // Déterminer si nous devons utiliser un shader personnalisé pour mieux gérer les coutures
                const useCustomShader = true;
                
                if (useCustomShader) {
                    // Shader personnalisé pour atténuer les coutures
                    material = new THREE.ShaderMaterial({
                        uniforms: {
                            baseTexture: { value: texture },
                            blendFactor: { value: 0.05 }  // Contrôle la force du flou aux coutures
                        },
                        vertexShader: `
                            varying vec2 vUv;
                            
                            void main() {
                                vUv = uv;
                                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                            }
                        `,
                        fragmentShader: `
                            uniform sampler2D baseTexture;
                            uniform float blendFactor;
                            
                            varying vec2 vUv;
                            
                            void main() {
                                // Coordonnées de texture
                                vec2 uv = vUv;
                                
                                // Échantillonner la texture principale
                                vec4 texColor = texture2D(baseTexture, uv);
                                
                                // Échantillonner à proximité pour atténuer les coutures
                                vec2 offset1 = vec2(0.001, 0.0);
                                vec2 offset2 = vec2(0.0, 0.001);
                                vec4 texSample1 = texture2D(baseTexture, mod(uv + offset1, 1.0));
                                vec4 texSample2 = texture2D(baseTexture, mod(uv - offset1, 1.0));
                                vec4 texSample3 = texture2D(baseTexture, mod(uv + offset2, 1.0));
                                vec4 texSample4 = texture2D(baseTexture, mod(uv - offset2, 1.0));
                                
                                // Mélanger les échantillons
                                vec4 blendedColor = mix(
                                    texColor,
                                    (texSample1 + texSample2 + texSample3 + texSample4) / 4.0,
                                    blendFactor
                                );
                                
                                gl_FragColor = blendedColor;
                            }
                        `,
                        lights: true,
                        fog: false
                    });
                } else {
                    // Matériel standard avec paramètres améliorés
                    material = new THREE.MeshPhongMaterial({
                        map: texture,
                        transparent: false,
                        depthWrite: true,
                        depthTest: true,
                        fog: false,
                        shininess: 5,      // Réduire la brillance pour un aspect plus mat
                        specular: 0x111111  // Réduire la spécularité pour moins accentuer les bords
                    });
                }
                
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
                    rotationSpeed: this.calculateRotationSpeed(visualRadius, type),
                    currentAngle: angle,
                    temperature: temperature,
                    confidence: confidence
                };
                
                // Pas de renderOrder comme dans le système solaire
                
                // Ajouter la planète au groupe
                planetSystem.add(mesh);
                
                // Ajouter le groupe complet à la scène
                this.scene.add(planetSystem);
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
                const material = new THREE.MeshPhongMaterial({
                    color: fallbackColor,
                    transparent: false,  // ✅ Matériau opaque
                    depthWrite: true,    // ✅ Écrire dans le depth buffer
                    depthTest: true,     // ✅ Tester la profondeur
                    fog: false           // ✅ DÉSACTIVER le fog pour éviter la perte d'opacité
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
                    rotationSpeed: this.calculateRotationSpeed(visualRadius, type),
                    currentAngle: angle,
                    temperature: temperature,
                    confidence: confidence
                };
                
                // Pas de renderOrder comme dans le système solaire
                
                // Ajouter la planète au groupe
                planetSystem.add(mesh);
                
                // Ajouter le groupe complet à la scène
                this.scene.add(planetSystem);
                this.exoplanets.push(mesh);
                
                console.log(`   ✅ Mesh créé avec couleur (rayon visuel: ${visualRadius.toFixed(2)} unités)`);
            }
        );
    }
    
    /**
     * Crée une exoplanète en utilisant EXACTEMENT la fonction createPlanet du système solaire
     */
    createExoplanetWithSolarSystemFunction(planet, index) {
        const {
            name,
            radius,
            distance,
            temperature,
            classification,
            type,  // ✅ Maintenant type contient la clé (grassland, jungle, etc.)
            texturePath,
            confidence
        } = planet;
        
        console.log(`\n🌍 Création avec fonction système solaire: ${name}`);
        
        // Calculer les dimensions visuelles
        const visualRadius = this.calculateVisualRadius(radius);
        const visualDistance = this.calculateVisualDistance(distance);
        
        // Calculer la position initiale sur l'orbite
        const angle = (index / this.totalPlanets) * Math.PI * 2;
        
        // Nous n'avons pas besoin de pré-charger la texture, nous allons modifier
        // l'appel à createPlanet pour utiliser directement le chemin de texture
        
        // Utiliser la fonction createPlanet du système solaire avec la texture pré-configurée
        if (typeof window.createPlanet === 'function') {
            // Créer un matériau personnalisé pour éviter les coutures
            const customMaterial = new THREE.MeshPhongMaterial({
                shininess: 10,         // Réduire la brillance pour un aspect plus réaliste
                specular: 0x333333,    // Réflexion spéculaire plus subtile
                reflectivity: 0.2      // Augmenter légèrement la réflectivité
            });
            
            // Charger la texture manuellement avec des paramètres personnalisés
            const texture = new THREE.TextureLoader().load(texturePath, (loadedTexture) => {
                loadedTexture.anisotropy = 16;  // Augmenter l'anisotropie pour réduire les coutures
                loadedTexture.generateMipmaps = true;
                loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;  // Filtrage trilinéaire
                loadedTexture.wrapS = THREE.ClampToEdgeWrapping;  // Ne pas répéter aux bords
                loadedTexture.wrapT = THREE.ClampToEdgeWrapping;  // Ne pas répéter aux bords
                customMaterial.map = loadedTexture;
                customMaterial.needsUpdate = true;
            });
            
            // Utiliser createPlanet avec notre matériau personnalisé
            const planetData = window.createPlanet(
                name,                    // planetName
                visualRadius,           // size
                visualDistance,         // position (rayon orbital)
                0,                      // tilt
                customMaterial,         // matériau personnalisé au lieu du chemin de texture
                null,                   // bump
                null,                   // ring
                null,                   // atmosphere
                null                    // moons
            );
            
            // Modifier la couleur de l'orbite selon le type d'exoplanète
            const orbitColor = this.orbitColors[type] || this.orbitColors.default;
            if (planetData.planetSystem) {
                planetData.planetSystem.children.forEach(child => {
                    if (child instanceof THREE.LineLoop) {
                        // Remplacer complètement le matériau par un identique au PlanetMarkerSystem
                        child.material = new THREE.LineBasicMaterial({
                            color: orbitColor,
                            transparent: true,
                            opacity: 0.4
                            // Pas de depthWrite/depthTest - utiliser les valeurs par défaut
                        });
                    }
                });
            }
            
            // Positionner la planète à l'angle calculé
            if (planetData.planet) {
                const initialX = visualDistance * Math.cos(angle);
                const initialZ = visualDistance * Math.sin(angle);
                
                planetData.planet.position.x = initialX;
                planetData.planet.position.z = initialZ;
                planetData.planet.position.y = 0;
                
                // Ajouter les métadonnées d'exoplanète
                planetData.planet.userData = {
                    name, classification, type, distance: visualDistance,
                    radius: visualRadius, orbitSpeed: this.calculateOrbitSpeed(distance),
                    rotationSpeed: this.calculateRotationSpeed(visualRadius, type),
                    currentAngle: angle, temperature, confidence
                };
                
                this.exoplanets.push(planetData.planet);
                console.log(`   ✅ Exoplanète créée avec fonction système solaire`);
            }
        } else {
            console.error('❌ Fonction createPlanet non disponible');
            // Fallback vers la méthode actuelle
            this.createExoplanet(planet, index);
        }
    }
    
    /**
     * Crée une orbite circulaire EXACTEMENT comme le système solaire
     * @param {Number} radius - Rayon de l'orbite
     * @param {Number} color - Couleur de l'orbite
     * @returns {THREE.LineLoop} L'orbite
     */
    createOrbit(radius, color) {
        // COPIE EXACTE du système solaire (lignes 3276-3294 de script.js)
        const orbitPath = new THREE.EllipseCurve(
            0, 0,              // ax, aY
            radius, radius,    // xRadius, yRadius
            0, 2 * Math.PI,    // aStartAngle, aEndAngle
            false,             // aClockwise
            0                  // aRotation
        );
        
        // Utiliser un nombre fixe élevé de points pour toutes les orbites (2048 points pour un cercle parfait)
        const ORBIT_SEGMENTS = 2048;
        const pathPoints = orbitPath.getPoints(ORBIT_SEGMENTS);
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
        const orbitMaterial = new THREE.LineBasicMaterial({ 
            color: color, 
            transparent: true, 
            opacity: 0.002,  // ✅ ULTRA-FINE : opacité très réduite pour simuler finesse
            depthWrite: true,   // ✅ CRUCIAL : Écrire dans le z-buffer
            depthTest: true,    // ✅ Tester la profondeur pour masquer derrière le soleil
            fog: false          // ✅ DÉSACTIVER le fog pour éviter la perte d'opacité
        });
        const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        
        // 🔥 LOG DE DEBUG - NOUVELLES MODIFICATIONS ACTIVES
        console.log(`🔧 ORBITE MODIFIÉE: points=${pathPoints.length}, opacity=${orbitMaterial.opacity}, color=#${color.toString(16)}`);
        console.log(`🔥 VERSION MISE À JOUR: ${new Date().toLocaleTimeString()}`);
        
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
            
            // ☀️ ROTATION SUR ELLE-MÊME : Vitesse augmentée
            // L'éclairage jour/nuit est géré automatiquement par la PointLight centrale
            const baseRotationSpeed = this.calculateRotationSpeed(planet.userData.radius, planet.userData.type);
            planet.rotation.y += baseRotationSpeed * 2.0; // x2 pour être plus visible
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
            
            // 🧹 Nettoyer aussi l'orbite colorée du PlanetMarkerSystem
            if (window.planetMarkerSystem && planet.userData && planet.userData.name) {
                try {
                    window.planetMarkerSystem.removeOrbit(planet.userData.name.toLowerCase());
                    console.log(`   🗑️ Orbite colorée supprimée: ${planet.userData.name}`);
                } catch (e) {
                    console.warn(`   ⚠️ Erreur suppression orbite colorée:`, e);
                }
            }
        });
        
        // Supprimer les orbites de base si elles existent
        if (this.orbits && Array.isArray(this.orbits)) {
            this.orbits.forEach(orbit => {
                if (orbit.geometry) orbit.geometry.dispose();
                if (orbit.material) orbit.material.dispose();
                this.scene.remove(orbit);
            });
            this.orbits = [];
        } else {
            // Initialiser si undefined
            this.orbits = [];
        }
        
        this.exoplanets = [];
        
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
     * Récupère une exoplanète par son nom
     * @param {string} name - Nom de l'exoplanète (insensible à la casse)
     * @returns {THREE.Mesh|null} Le mesh de l'exoplanète ou null si non trouvé
     */
    getExoplanetByName(name) {
        if (!name) return null;
        
        const searchName = name.toLowerCase();
        const exoplanet = this.exoplanets.find(p => 
            p.userData && 
            p.userData.name && 
            p.userData.name.toLowerCase() === searchName
        );
        
        if (exoplanet) {
            console.log(`✅ Exoplanète trouvée par nom: ${name}`);
            return exoplanet;
        } else {
            console.warn(`⚠️ Exoplanète non trouvée par nom: ${name}`);
            return null;
        }
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
    
    /**
     * Liste toutes les exoplanètes disponibles pour le centrage
     * @returns {Array} Liste des exoplanètes avec leurs noms
     */
    getAvailableExoplanets() {
        return this.exoplanets.map(planet => ({
            name: planet.userData.name,
            displayName: planet.userData.name,
            type: planet.userData.type,
            classification: planet.userData.classification,
            mesh: planet
        }));
    }
    
    /**
     * Centre la caméra sur une exoplanète spécifique
     * @param {string} planetName - Nom de l'exoplanète
     * @returns {boolean} True si le centrage a réussi
     */
    centerOnExoplanet(planetName) {
        const exoplanet = this.getExoplanetByName(planetName);
        if (exoplanet && typeof window.centerOnPlanet === 'function') {
            window.centerOnPlanet(planetName, 'exoplanet');
            return true;
        }
        console.warn(`⚠️ Impossible de centrer sur l'exoplanète: ${planetName}`);
        return false;
    }
    
    /**
     * Calcule la vitesse de rotation selon la taille et le type de planète
     */
    calculateRotationSpeed(radius, type) {
        // Vitesse de base selon le type (comme le système solaire)
        const baseSpeed = {
            grassland: 0.01,    // Comme la Terre
            jungle: 0.008,      // Planètes denses
            snowy: 0.006,       // Planètes froides
            tundra: 0.007,      // 
            arid: 0.012,        // Planètes sèches (rotation rapide)
            sandy: 0.011,       // 
            dusty: 0.009,       // 
            martian: 0.01,      // Comme Mars
            barren: 0.005,      // Planètes mortes (lent)
            marshy: 0.008,      // 
            gaseous: 0.015,     // Géantes gazeuses (rotation rapide)
            methane: 0.012,     // Comme Uranus/Neptune
            default: 0.008
        };
        
        const speed = baseSpeed[type] || baseSpeed.default;
        
        // Ajuster selon la taille (plus grande = plus lente généralement)
        const sizeModifier = Math.max(0.3, 1 - (radius / 50));
        
        // Ajouter de la variabilité réaliste
        const variation = 0.8 + Math.random() * 0.4; // Entre 0.8x et 1.2x
        
        return speed * sizeModifier * variation;
    }
    
    /**
     * Centre la caméra sur l'étoile Kepler
     * @returns {boolean} True si le centrage a réussi
     */
    centerOnKeplerStar() {
        if (typeof window.centerOnPlanet === 'function') {
            window.centerOnPlanet('sun', 'kepler_star');
            return true;
        }
        console.warn(`⚠️ Impossible de centrer sur l'étoile Kepler`);
        return false;
    }
}

export default ExoplanetSceneManager;
