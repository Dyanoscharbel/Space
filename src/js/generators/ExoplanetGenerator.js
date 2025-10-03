/**
 * Générateur d'exoplanètes avec classification et attribution de textures
 */

export class ExoplanetGenerator {
    
    /**
     * Classifications disponibles avec leurs critères et textures
     */
    static CLASSIFICATIONS = {
        // 🌍 Planètes Terrestres (Rocheuses)
        grassland: {
            name: 'Grassland',
            type: 'terrestrial',
            emoji: '🌿',
            description: 'Prairies tempérées',
            criteria: {
                radius: { min: 0.8, max: 1.5 },      // R⊕
                temperature: { min: 250, max: 320 },  // K
                distance: { min: 0.8, max: 1.2 }     // UA
            },
            texture: '/images/textures_exoplanet/Grassland/Grassland01.png'
        },
        jungle: {
            name: 'Jungle',
            type: 'terrestrial',
            emoji: '🌴',
            description: 'Forêts tropicales',
            criteria: {
                radius: { min: 0.9, max: 1.8 },
                temperature: { min: 280, max: 330 },
                distance: { min: 0.7, max: 1.1 }
            },
            texture: '/images/textures_exoplanet/Jungle/Jungle01.png'
        },
        snowy: {
            name: 'Snowy',
            type: 'terrestrial',
            emoji: '❄️',
            description: 'Monde glacé',
            criteria: {
                radius: { min: 0.5, max: 2.0 },
                temperature: { min: 150, max: 250 },
                distance: { min: 1.5, max: 5.0 }
            },
            texture: '/images/textures_exoplanet/Snowy/Snowy01.png'
        },
        tundra: {
            name: 'Tundra',
            type: 'terrestrial',
            emoji: '🏔️',
            description: 'Climat froid',
            criteria: {
                radius: { min: 0.7, max: 1.3 },
                temperature: { min: 200, max: 270 },
                distance: { min: 1.2, max: 2.5 }
            },
            texture: '/images/textures_exoplanet/Tundra/Tundra01.png'
        },

        // 🏜️ Mondes Arides
        arid: {
            name: 'Arid',
            type: 'arid',
            emoji: '🏜️',
            description: 'Déserts',
            criteria: {
                radius: { min: 0.6, max: 1.4 },
                temperature: { min: 300, max: 400 },
                distance: { min: 0.4, max: 0.8 }
            },
            texture: '/images/textures_exoplanet/Arid/Arid01.png'
        },
        sandy: {
            name: 'Sandy',
            type: 'arid',
            emoji: '🏖️',
            description: 'Sablonneux',
            criteria: {
                radius: { min: 0.8, max: 1.6 },
                temperature: { min: 280, max: 380 },
                distance: { min: 0.5, max: 0.9 }
            },
            texture: '/images/textures_exoplanet/Sandy/Sandy01.png'
        },
        dusty: {
            name: 'Dusty',
            type: 'arid',
            emoji: '🌫️',
            description: 'Poussiéreux',
            criteria: {
                radius: { min: 0.7, max: 1.2 },
                temperature: { min: 200, max: 350 },
                distance: { min: 0.6, max: 2.0 }
            },
            texture: '/images/textures_exoplanet/Dusty/Dusty01.png'
        },

        // 🔴 Mondes Extrêmes
        martian: {
            name: 'Martian',
            type: 'extreme',
            emoji: '🔴',
            description: 'Type Mars',
            criteria: {
                radius: { min: 0.4, max: 0.8 },
                temperature: { min: 180, max: 280 },
                distance: { min: 1.0, max: 2.5 }
            },
            texture: '/images/textures_exoplanet/Martian/Martian01.png'
        },
        barren: {
            name: 'Barren',
            type: 'extreme',
            emoji: '⚫',
            description: 'Stérile',
            criteria: {
                radius: { min: 0.3, max: 1.0 },
                temperature: { min: 100, max: 500 },
                distance: { min: 0.1, max: 10.0 }
            },
            texture: '/images/textures_exoplanet/Barren/Barren01.png'
        },
        marshy: {
            name: 'Marshy',
            type: 'extreme',
            emoji: '🌿',
            description: 'Marécageux',
            criteria: {
                radius: { min: 1.0, max: 2.2 },
                temperature: { min: 260, max: 310 },
                distance: { min: 0.8, max: 1.3 }
            },
            texture: '/images/textures_exoplanet/Marshy/Marshy01.png'
        },

        // ⛽ Géantes Gazeuses
        gaseous: {
            name: 'Gaseous',
            type: 'gas_giant',
            emoji: '🪐',
            description: 'Géantes H₂/He',
            criteria: {
                radius: { min: 3.0, max: 20.0 },
                temperature: { min: 50, max: 2000 },
                distance: { min: 0.1, max: 30.0 }
            },
            texture: '/images/textures_exoplanet/Gaseous/Gaseous01.png'
        },
        methane: {
            name: 'Methane',
            type: 'gas_giant',
            emoji: '💠',
            description: 'Riches en méthane',
            criteria: {
                radius: { min: 2.5, max: 15.0 },
                temperature: { min: 50, max: 150 },
                distance: { min: 5.0, max: 50.0 }
            },
            texture: '/images/textures_exoplanet/Methane/Methane01.png'
        }
    };

    /**
     * Classifier une exoplanète selon ses caractéristiques
     * @param {Object} exoplanet - Données de l'exoplanète
     * @returns {Object} Classification avec texture
     */
    static classifyExoplanet(exoplanet) {
        const radius = exoplanet.radius || exoplanet.koi_prad;
        const temperature = exoplanet.temperature || exoplanet.koi_teq;
        const distance = exoplanet.distance || exoplanet.koi_sma;
        
        // Validation des données
        if (!radius || !temperature || !distance) {
            return {
                classification: 'barren',
                ...this.CLASSIFICATIONS.barren,
                confidence: 0,
                reason: 'Données insuffisantes'
            };
        }

        // Calculer les scores pour chaque classification
        const scores = [];
        
        for (const [key, classification] of Object.entries(this.CLASSIFICATIONS)) {
            const score = this.calculateScore(radius, temperature, distance, classification.criteria);
            if (score > 0) {
                scores.push({
                    classification: key,
                    ...classification,
                    confidence: score,
                    reason: `R=${radius.toFixed(2)}R⊕, T=${temperature.toFixed(0)}K, D=${distance.toFixed(3)}UA`
                });
            }
        }

        // Trier par score décroissant
        scores.sort((a, b) => b.confidence - a.confidence);

        // Retourner la meilleure classification ou barren par défaut
        return scores.length > 0 ? scores[0] : {
            classification: 'barren',
            ...this.CLASSIFICATIONS.barren,
            confidence: 0.1,
            reason: `Aucune classification précise - R=${radius.toFixed(2)}R⊕, T=${temperature.toFixed(0)}K, D=${distance.toFixed(3)}UA`
        };
    }

    /**
     * Calculer le score de correspondance avec les critères
     * @param {number} radius - Rayon en R⊕
     * @param {number} temperature - Température en K
     * @param {number} distance - Distance en UA
     * @param {Object} criteria - Critères de classification
     * @returns {number} Score entre 0 et 1
     */
    static calculateScore(radius, temperature, distance, criteria) {
        // Vérifier si dans les plages
        const radiusMatch = radius >= criteria.radius.min && radius <= criteria.radius.max;
        const tempMatch = temperature >= criteria.temperature.min && temperature <= criteria.temperature.max;
        const distMatch = distance >= criteria.distance.min && distance <= criteria.distance.max;
        
        // Toutes les conditions doivent être remplies
        if (!radiusMatch || !tempMatch || !distMatch) {
            return 0;
        }
        
        // Calculer un score basé sur la position dans les plages
        const radiusScore = 1 - Math.abs((radius - (criteria.radius.min + criteria.radius.max) / 2) / (criteria.radius.max - criteria.radius.min));
        const tempScore = 1 - Math.abs((temperature - (criteria.temperature.min + criteria.temperature.max) / 2) / (criteria.temperature.max - criteria.temperature.min));
        const distScore = 1 - Math.abs((distance - (criteria.distance.min + criteria.distance.max) / 2) / (criteria.distance.max - criteria.distance.min));
        
        // Score moyen pondéré
        return (radiusScore * 0.4 + tempScore * 0.3 + distScore * 0.3);
    }

    /**
     * Traiter et classifier toutes les exoplanètes d'un système
     * @param {Array} exoplanets - Liste des exoplanètes
     * @returns {Array} Exoplanètes avec classification et texture
     */
    static processExoplanets(exoplanets) {
        if (!exoplanets || !Array.isArray(exoplanets)) {
            console.warn('⚠️ Aucune exoplanète à traiter');
            return [];
        }

        console.log(`\n🔬 CLASSIFICATION DE ${exoplanets.length} EXOPLANÈTES\n`);
        console.log('='.repeat(80));

        const processedPlanets = exoplanets.map((exoplanet, index) => {
            const classification = this.classifyExoplanet(exoplanet);
            
            const processed = {
                // Données originales
                ...exoplanet,
                
                // Classification
                classification: classification.classification,  // CLÉ (grassland, jungle, etc.) - utilisé dans script.js
                classificationKey: classification.classification,
                classificationName: classification.name,
                classificationType: classification.classification,  // ✅ FIX: Utiliser la clé au lieu de type parent
                type: classification.classification,  // ✅ AJOUT: pour compatibilité avec ExoplanetSceneManager
                parentType: classification.type,  // Type parent (terrestrial, arid, etc.)
                classificationEmoji: classification.emoji,
                description: classification.description,
                confidence: classification.confidence,
                
                // Texture
                texturePath: classification.texture,
                
                // Métadonnées
                index: index + 1
            };

            // Afficher dans la console
            this.displayPlanetInConsole(processed);

            return processed;
        });

        console.log('='.repeat(80));
        console.log(`✅ ${processedPlanets.length} exoplanètes classifiées\n`);

        // Afficher un résumé
        this.displaySummary(processedPlanets);

        return processedPlanets;
    }

    /**
     * Afficher une planète dans la console
     * @param {Object} planet - Données de la planète
     */
    static displayPlanetInConsole(planet) {
        console.log(`\n${planet.classificationEmoji} PLANÈTE ${planet.index}: ${planet.name || 'Sans nom'}`);
        console.log(`${'─'.repeat(80)}`);
        
        console.table({
            'Classification': `${planet.classificationName} (${planet.classificationKey})`,
            'Type': planet.classificationType,
            'Rayon (R⊕)': planet.radius?.toFixed(2) || 'N/A',
            'Température (K)': planet.temperature?.toFixed(0) || 'N/A',
            'Distance (UA)': planet.distance?.toFixed(3) || 'N/A',
            'Confiance': `${(planet.confidence * 100).toFixed(0)}%`
        });
        
        console.log(`📝 Description: ${planet.description}`);
        console.log(`🖼️ Texture: ${planet.texturePath}`);
    }

    /**
     * Afficher un résumé des classifications
     * @param {Array} planets - Liste des planètes traitées
     */
    static displaySummary(planets) {
        console.log('\n📊 RÉSUMÉ DES CLASSIFICATIONS');
        console.log('─'.repeat(80));
        
        // Compter par type
        const countByType = {};
        const countByClassification = {};
        
        planets.forEach(planet => {
            countByType[planet.classificationType] = (countByType[planet.classificationType] || 0) + 1;
            countByClassification[planet.classificationName] = (countByClassification[planet.classificationName] || 0) + 1;
        });
        
        console.log('\n🌍 Par Type:');
        console.table(countByType);
        
        console.log('\n🎨 Par Classification:');
        console.table(countByClassification);
        
        // Lister toutes les textures utilisées
        console.log('\n🖼️ TEXTURES UTILISÉES:');
        const textures = [...new Set(planets.map(p => p.texturePath))];
        textures.forEach((texture, i) => {
            console.log(`   ${i + 1}. ${texture}`);
        });
    }

    /**
     * Afficher toutes les classifications disponibles
     */
    static displayAllClassifications() {
        console.log('\n📚 CLASSIFICATIONS DISPONIBLES');
        console.log('='.repeat(80));
        
        for (const [key, classification] of Object.entries(this.CLASSIFICATIONS)) {
            console.log(`\n${classification.emoji} ${classification.name.toUpperCase()} (${key})`);
            console.log(`   Type: ${classification.type}`);
            console.log(`   Description: ${classification.description}`);
            console.log(`   Rayon: ${classification.criteria.radius.min}–${classification.criteria.radius.max} R⊕`);
            console.log(`   Température: ${classification.criteria.temperature.min}–${classification.criteria.temperature.max} K`);
            console.log(`   Distance: ${classification.criteria.distance.min}–${classification.criteria.distance.max} UA`);
            console.log(`   Texture: ${classification.texture}`);
        }
        
        console.log('\n' + '='.repeat(80));
    }
}

// Export par défaut
export default ExoplanetGenerator;
