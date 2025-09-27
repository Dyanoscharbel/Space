import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import PlanetMarkerSystem from './js/planet-markers.js';

import bgTexture1 from '/images/1.jpg';
import bgTexture2 from '/images/2.jpg';
import bgTexture3 from '/images/3.jpg';
import bgTexture4 from '/images/4.jpg';
import sunTexture from '/images/sun.jpg';
import mercuryTexture from '/images/mercurymap.jpg';
import mercuryBump from '/images/mercurybump.jpg';
import venusTexture from '/images/venusmap.jpg';
import venusBump from '/images/venusmap.jpg';
import venusAtmosphere from '/images/venus_atmosphere.jpg';
import earthTexture from '/images/earth_daymap.jpg';
import earthNightTexture from '/images/earth_nightmap.jpg';
import earthAtmosphere from '/images/earth_atmosphere.jpg';
import earthMoonTexture from '/images/moonmap.jpg';
import earthMoonBump from '/images/moonbump.jpg';
import marsTexture from '/images/marsmap.jpg';
import marsBump from '/images/marsbump.jpg';
import jupiterTexture from '/images/jupiter.jpg';
import ioTexture from '/images/jupiterIo.jpg';
import europaTexture from '/images/jupiterEuropa.jpg';
import ganymedeTexture from '/images/jupiterGanymede.jpg';
import callistoTexture from '/images/jupiterCallisto.jpg';
import saturnTexture from '/images/saturnmap.jpg';
import satRingTexture from '/images/saturn_ring.png';
import uranusTexture from '/images/uranus.jpg';
import uraRingTexture from '/images/uranus_ring.png';
import neptuneTexture from '/images/neptune.jpg';
import plutoTexture from '/images/plutomap.jpg';

// ===== PLANET MARKER SYSTEM VARIABLE =====
let planetMarkerSystem = null;

// ===== HUD INTERFACE SETUP =====
console.log("🚀 Initializing HUD Interface...");

// Initialize HUD controls
function initializeHUD() {
    // Orbit speed control
    const orbitSpeedSlider = document.getElementById('orbit-speed');
    if (orbitSpeedSlider) {
        orbitSpeedSlider.addEventListener('input', (e) => {
            settings.accelerationOrbit = parseFloat(e.target.value);
            updateSliderValue(e.target, e.target.value + 'x');
        });
    }

    // Rotation speed control
    const rotationSpeedSlider = document.getElementById('rotation-speed');
    if (rotationSpeedSlider) {
        rotationSpeedSlider.addEventListener('input', (e) => {
            settings.acceleration = parseFloat(e.target.value);
            updateSliderValue(e.target, e.target.value + 'x');
        });
    }

    // Sun intensity control (if sunMat exists)
    if (typeof sunMat !== 'undefined' && sunMat) {
        console.log("🌟 Sun material controls ready");
    }

    // Action buttons
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', toggleAnimation);
    }

    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetView);
    }

    // Close info panel
    const closeInfoBtn = document.getElementById('close-info');
    if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', closeInfo);
    }

    // Search functionality
    const commandInput = document.getElementById('command-input');
    if (commandInput) {
        commandInput.addEventListener('input', handleSearch);
        commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                executeSearch(e.target.value);
            }
        });
    }

    // HUD Toggle buttons
    const toggleLeftBtn = document.getElementById('toggle-left-panel');
    const toggleRightBtn = document.getElementById('toggle-right-panel');
    const toggleUIBtn = document.getElementById('toggle-ui');
    
    if (toggleLeftBtn) {
        toggleLeftBtn.addEventListener('click', toggleLeftPanel);
    }
    
    if (toggleRightBtn) {
        toggleRightBtn.addEventListener('click', toggleRightPanel);
    }
    
    if (toggleUIBtn) {
        toggleUIBtn.addEventListener('click', toggleFullUI);
    }

    // Tooltip close button
    const tooltipClose = document.getElementById('tooltip-close');
    if (tooltipClose) {
        tooltipClose.addEventListener('click', closeInfo);
    }

    // Center button
    const centerBtn = document.getElementById('center-btn');
    const stopFollowBtn = document.getElementById('stop-follow-btn');
    
    if (centerBtn) {
        centerBtn.addEventListener('click', () => {
            if (selectedPlanet) {
                centerOnPlanet(selectedPlanet.name, selectedPlanet.type);
                const emoji = selectedPlanet.type === 'moon' ? '🌙' : '🎯';
                console.log(`${emoji} Centrage manuel sur:`, selectedPlanet.name, `(${selectedPlanet.type})`);
                
                // Afficher le bouton "Libérer"
                if (stopFollowBtn) {
                    stopFollowBtn.style.display = 'block';
                }
            }
        });
    }
    
    // Stop follow button
    if (stopFollowBtn) {
        stopFollowBtn.addEventListener('click', () => {
            followedPlanet = null;
            stopFollowBtn.style.display = 'none';
            console.log('🔓 Suivi arrêté - contrôle libre restauré');
        });
    }

    // More info button
    const moreInfoBtn = document.getElementById('more-info-btn');
    if (moreInfoBtn) {
        moreInfoBtn.addEventListener('click', () => {
            console.log('More info clicked - could open detailed view');
            // TODO: Open detailed view or external link
        });
    }

    // Settings panel is now hover-based, no click needed
    console.log("✅ Settings panel configured for hover interaction");

    // Settings sliders
    const orbitSpeedSetting = document.getElementById('orbit-speed-setting');
    const rotationSpeedSetting = document.getElementById('rotation-speed-setting');
    const animationSpeedSetting = document.getElementById('animation-speed-setting');

    if (orbitSpeedSetting) {
        orbitSpeedSetting.addEventListener('input', (e) => {
            settings.accelerationOrbit = parseFloat(e.target.value);
            document.getElementById('orbit-speed-value').textContent = e.target.value + 'x';
        });
    }

    if (rotationSpeedSetting) {
        rotationSpeedSetting.addEventListener('input', (e) => {
            settings.acceleration = parseFloat(e.target.value);
            document.getElementById('rotation-speed-value').textContent = e.target.value + 'x';
        });
    }

    if (animationSpeedSetting) {
        animationSpeedSetting.addEventListener('input', (e) => {
            // Cette valeur pourra être utilisée pour d'autres animations
            document.getElementById('animation-speed-value').textContent = e.target.value + 'x';
        });
    }

    // Scale factor setting (en UA directes)
    const scaleFactorSetting = document.getElementById('scale-factor-setting');
    if (scaleFactorSetting) {
        scaleFactorSetting.addEventListener('input', (e) => {
            const uaPerUnit = parseFloat(e.target.value);
            SCALE_FACTOR = AU_IN_KM * uaPerUnit;
            document.getElementById('scale-factor-value').textContent = `${uaPerUnit} UA/unité`;
            console.log('📏 ÉCHELLE NASA: 1 unité =', uaPerUnit, 'UA exactes');
        });
    }

    // Settings toggle buttons
    const showLabelsBtn = document.getElementById('show-labels');
    const showMoonsBtn = document.getElementById('show-moons');

    if (showLabelsBtn) {
        showLabelsBtn.addEventListener('click', () => {
            showLabelsBtn.classList.toggle('active');
            // TODO: Toggle labels visibility
        });
    }

    if (showMoonsBtn) {
        showMoonsBtn.addEventListener('click', () => {
            showMoonsBtn.classList.toggle('active');
            // TODO: Toggle moons visibility
        });
    }

    // Orbits toggle button - NOUVEAU SYSTÈME
    const showOrbitsBtn = document.getElementById('show-orbits-btn');
    if (showOrbitsBtn) {
        showOrbitsBtn.addEventListener('click', () => {
            showOrbitsBtn.classList.toggle('active');
            const isActive = showOrbitsBtn.classList.contains('active');
            
            // Toggle le système de marqueurs et orbites
            if (planetMarkerSystem) {
                planetMarkerSystem.toggle(isActive);
                console.log('🌌 Marqueurs et Orbites:', isActive ? 'activés' : 'désactivés');
            }
        });
        
        // Activer par défaut
        showOrbitsBtn.classList.add('active');
        console.log('🌌 Système de marqueurs sera créé après les planètes');
    }

    console.log("✅ HUD Interface initialized");
}

// Functions for HUD controls
function toggleLeftPanel() {
    const hudInterface = document.getElementById('hud-interface');
    const toggleBtn = document.getElementById('toggle-left-panel');
    
    if (hudInterface) {
        hudInterface.classList.toggle('hide-left');
        if (toggleBtn) {
            toggleBtn.classList.toggle('active');
        }
    }
}

function toggleRightPanel() {
    const hudInterface = document.getElementById('hud-interface');
    const toggleBtn = document.getElementById('toggle-right-panel');
    
    if (hudInterface) {
        hudInterface.classList.toggle('hide-right');
        if (toggleBtn) {
            toggleBtn.classList.toggle('active');
        }
    }
}

function toggleFullUI() {
    const hudInterface = document.getElementById('hud-interface');
    const toggleBtn = document.getElementById('toggle-ui');
    
    if (hudInterface) {
        hudInterface.classList.toggle('hide-ui');
        if (toggleBtn) {
            toggleBtn.classList.toggle('active');
        }
    }
}

function updateSliderValue(slider, value) {
    const valueDisplay = slider.parentElement.querySelector('.slider-value');
    if (valueDisplay) {
        valueDisplay.textContent = value;
    }
}

function toggleAnimation() {
    // Toggle animation logic will be added here
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
        const icon = pauseBtn.querySelector('.btn-icon');
        if (icon) {
            icon.textContent = icon.textContent === '⏸' ? '▶' : '⏸';
        }
    }
}

function resetView() {
    camera.position.set(-3000, 2000, 1000); // Position adaptée aux nouvelles échelles
    controls.target.set(0, 0, 0);
    closeInfo();
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const searchResults = document.getElementById('search-results');
    
    if (!query.trim() || !searchResults) {
        if (searchResults) searchResults.innerHTML = '';
        return;
    }

    // Simple search through planet names
    const planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
    const results = planets.filter(planet => planet.includes(query));
    
    if (results.length > 0) {
        searchResults.innerHTML = results.map(planet => `
            <div class="search-result" onclick="selectPlanet('${planet}')">
                <span class="result-name">${planet.charAt(0).toUpperCase() + planet.slice(1)}</span>
                <span class="result-type">planet</span>
            </div>
        `).join('');
        searchResults.style.display = 'block';
    } else {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
    }
}

function executeSearch(query) {
    const commandInput = document.getElementById('command-input');
    const searchResults = document.getElementById('search-results');
    
    if (commandInput) commandInput.value = '';
    if (searchResults) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
    }
}

function selectPlanet(planetName) {
    console.log(`Selecting planet: ${planetName}`);
    // Planet selection logic will be enhanced
    executeSearch();
}

function updateCoordinates() {
    const camX = document.getElementById('cam-x');
    const camY = document.getElementById('cam-y');
    const camZ = document.getElementById('cam-z');
    
    if (camX && camera) camX.textContent = camera.position.x.toFixed(2);
    if (camY && camera) camY.textContent = camera.position.y.toFixed(2);
    if (camZ && camera) camZ.textContent = camera.position.z.toFixed(2);
}
// ******  SETUP  ******
console.log("Create the scene");
const scene = new THREE.Scene();

console.log("Create a perspective projection camera");
// We'll set the aspect ratio after we know the container size
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.001, 100000000 ); // Horizon ULTRA lointain pour dézoomer jusqu'à voir le système comme un point
camera.position.set(-3000, 2000, 1000); // Position initiale adaptée aux nouvelles échellesénorme pour voir tout le système

console.log("Create the renderer");
const renderer = new THREE.WebGLRenderer({ antialias: true });

// *** CONFIGURATION OMBRES DU RENDERER ***
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
console.log("🌑 Ombres activées sur le renderer principal");

// Inject canvas into HUD container instead of body
const canvasContainer = document.getElementById('canvas-container');
console.log("🔍 Canvas container found:", !!canvasContainer);

if (canvasContainer) {
    // Set size based on container, not full window
    const containerRect = canvasContainer.getBoundingClientRect();
    console.log("📐 Container dimensions:", containerRect.width, "x", containerRect.height);
    camera.aspect = containerRect.width / containerRect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(containerRect.width, containerRect.height);
    canvasContainer.appendChild(renderer.domElement);
    console.log("✅ Canvas injected into HUD container");
} else {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    console.log("⚠️ Fallback: Canvas injected into body");
}

console.log("🎨 Renderer created:", renderer);
console.log("📷 Camera position:", camera.position);

renderer.toneMapping = THREE.ACESFilmicToneMapping;

console.log("Create an orbit control");
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;

// Contrôles ultra-libres pour navigation totale
controls.minDistance = 0.01; // Permet de zoomer TRÈS près (presque à l'intérieur)
controls.maxDistance = 50000000; // Zoom ULTRA lointain pour voir tout le système comme un point
controls.enableZoom = true;
controls.zoomSpeed = 3.0; // Zoom encore plus rapide
controls.enableRotate = true;
controls.rotateSpeed = 1.5; // Rotation plus rapide
controls.enablePan = true;
controls.panSpeed = 3.0; // Pan plus rapide
controls.enableDamping = true;
controls.dampingFactor = 0.03; // Damping très léger pour plus de réactivité

// Améliorer la sensibilité de la molette
controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN
};

console.log("✅ Enhanced camera controls configured");

console.log("Set up texture loader");
const cubeTextureLoader = new THREE.CubeTextureLoader();
const loadTexture = new THREE.TextureLoader();

// ===== SYSTÈME DE TRAÎNÉES ORBITALES STYLÉES =====
let orbitTrailSystem = null;
let showOrbits = true;
let planetTrails = new Map(); // Stockage des traînées par planète

// Configuration des traînées ADAPTATIVES (style Universe Sandbox)
const TRAIL_CONFIG = {
    maxPoints: 128,       // Plus de points pour plus de fluidité
    fadeDistance: 0.5,    // Distance sur laquelle la traînée s'estompe
    updateFrequency: 2,   // Mise à jour plus fréquente
    glowIntensity: 1.2,   // Effet glow plus intense
    
    // ADAPTATION AU ZOOM (comme Universe Sandbox)
    minTrailWidth: 0.5,   // Largeur minimale des traînées
    maxTrailWidth: 50,    // Largeur maximale des traînées
    zoomScaleFactor: 0.1, // Facteur d'adaptation au zoom
    
    // VISIBILITÉ À DISTANCE
    minVisibleDistance: 100,    // Distance min pour voir les traînées
    maxVisibleDistance: 50000,  // Distance max pour voir les traînées
    distanceOpacityFactor: 0.8  // Facteur d'opacité selon la distance
};

// Variables pour l'adaptation au zoom
let currentCameraDistance = 1000;
let adaptiveTrailWidth = 1;
let adaptiveOpacity = 1;

// SUPPRIMÉ - Ne fonctionnait pas correctement

// FONCTION SUPPRIMÉE
/*
function createPlanetSelectionSpheres() {
    const planetData = [];
    
    // Ajouter seulement les planètes qui existent (PAS LE SOLEIL)
    if (typeof mercury !== 'undefined' && mercury) {
        planetData.push({ name: 'Mercury', planet: mercury, displayName: 'Mercury', realSize: getRealisticPlanetSize('mercury') });
    }
    if (typeof venus !== 'undefined' && venus) {
        planetData.push({ name: 'Venus', planet: venus, displayName: 'Venus', realSize: getRealisticPlanetSize('venus') });
    }
    if (typeof earth !== 'undefined' && earth) {
        planetData.push({ name: 'Earth', planet: earth, displayName: 'Earth', realSize: getRealisticPlanetSize('earth') });
    }
    if (typeof mars !== 'undefined' && mars) {
        planetData.push({ name: 'Mars', planet: mars, displayName: 'Mars', realSize: getRealisticPlanetSize('mars') });
    }
    if (typeof jupiter !== 'undefined' && jupiter) {
        planetData.push({ name: 'Jupiter', planet: jupiter, displayName: 'Jupiter', realSize: getRealisticPlanetSize('jupiter') });
    }
    if (typeof saturn !== 'undefined' && saturn) {
        planetData.push({ name: 'Saturn', planet: saturn, displayName: 'Saturn', realSize: getRealisticPlanetSize('saturn') });
    }
    if (typeof uranus !== 'undefined' && uranus) {
        planetData.push({ name: 'Uranus', planet: uranus, displayName: 'Uranus', realSize: getRealisticPlanetSize('uranus') });
    }
    if (typeof neptune !== 'undefined' && neptune) {
        planetData.push({ name: 'Neptune', planet: neptune, displayName: 'Neptune', realSize: getRealisticPlanetSize('neptune') });
    }
    
    console.log(`🔘 Création des cercles de sélection pour ${planetData.length} planètes (PAS LE SOLEIL):`);
    planetData.forEach(data => {
        console.log(`  - ${data.name} (taille réelle: ${data.realSize.toFixed(1)})`);
    });
    
    planetData.forEach(data => {
        if (data.planet && data.planet.planet3d) {
            console.log(`🔘 Création cercle pour ${data.name}`);
            createPlanetSelectionCircle(data.name, data.planet, data.displayName, data.realSize);
        } else {
            console.log(`⚠️ ERREUR: ${data.name} - structure:`, {
                planet: !!data.planet,
                planet3d: data.planet ? !!data.planet.planet3d : 'N/A',
                keys: data.planet ? Object.keys(data.planet) : 'N/A'
            });
        }
    });
    
    console.log('✅ Sphères de sélection et labels créés');
}
*/

// FONCTION SUPPRIMÉE
/*
function createPlanetSelectionCircle(planetName, planetObj, displayName, realPlanetSize) {
    // Créer un CERCLE plat (pas une sphère 3D) pour la sélection
    const circleGeometry = new THREE.RingGeometry(
        SELECTION_CONFIG.sphereSize * 0.95, // Rayon intérieur
        SELECTION_CONFIG.sphereSize,         // Rayon extérieur (cercle fin)
        32  // Segments pour un cercle lisse
    );
    
    const circleMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: false,
        opacity: SELECTION_CONFIG.sphereOpacity,
        side: THREE.DoubleSide  // Visible des deux côtés
    });
    
    const selectionCircle = new THREE.Mesh(circleGeometry, circleMaterial);
    selectionCircle.userData = { 
        planetName: planetName, 
        isSelectionSphere: true,
        realPlanetSize: realPlanetSize,
        minSize: SELECTION_CONFIG.sphereSize
    };
    
    // Orienter le cercle pour qu'il soit face à la caméra (billboard)
    selectionCircle.lookAt(camera.position);
    
    // Créer le label (texte 3D)
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    // Style du texte
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.font = `${SELECTION_CONFIG.fontSize}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(displayName, canvas.width / 2, canvas.height / 2);
    
    // Créer le sprite pour le texte
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture, 
        transparent: true,
        opacity: 0.9
    });
    
    const labelSprite = new THREE.Sprite(spriteMaterial);
    labelSprite.scale.set(400, 100, 1); // Labels BEAUCOUP plus grands
    
    // Créer la ligne de connexion (plus épaisse)
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: false,  // Pas de transparence
        opacity: SELECTION_CONFIG.lineOpacity,
        linewidth: SELECTION_CONFIG.lineWidth
    });
    
    const connectionLine = new THREE.Line(lineGeometry, lineMaterial);
    
    // Ajouter à la scène
    scene.add(selectionCircle);
    scene.add(labelSprite);
    scene.add(connectionLine);
    
    console.log(`🔘 Cercle créé pour ${planetName}: taille ${SELECTION_CONFIG.sphereSize}, position initiale:`, selectionCircle.position);
    
    // Stocker les références
    planetSelectionSpheres.set(planetName, {
        sphere: selectionCircle,  // C'est maintenant un cercle
        label: labelSprite,
        line: connectionLine,
        planetObj: planetObj,
        realPlanetSize: realPlanetSize
    });
    
    // Ajouter le cercle aux targets de raycast
    raycastTargets.push(selectionCircle);
}
*/

// FONCTION SUPPRIMÉE
/*
function updatePlanetSelectionSpheres() {
    if (planetSelectionSpheres.size === 0) return;
    
    planetSelectionSpheres.forEach((data, planetName) => {
        const planetObj = data.planetObj;
        if (!planetObj || !planetObj.planet3d) return;
        
        // Obtenir la position de la planète
        const planetPos = new THREE.Vector3();
        planetObj.planet3d.getWorldPosition(planetPos);
        
        // Positionner la sphère sur la planète
        data.sphere.position.copy(planetPos);
        
        // Debug occasionnel
        if (Math.random() < 0.001) {
            console.log(`🔘 ${planetName}: position sphère`, planetPos, "distance caméra:", camera.position.distanceTo(planetPos).toFixed(0));
        }
        
        // Calculer la position du label (décalé)
        const labelOffset = new THREE.Vector3(SELECTION_CONFIG.labelDistance, SELECTION_CONFIG.labelDistance * 0.5, 0);
        const labelPos = planetPos.clone().add(labelOffset);
        data.label.position.copy(labelPos);
        
        // Mettre à jour la ligne de connexion
        const linePoints = [planetPos, labelPos];
        data.line.geometry.setFromPoints(linePoints);
        
        // Adapter la zone de clic selon la distance
        const distanceToCamera = camera.position.distanceTo(planetPos);
        const isNear = distanceToCamera < SELECTION_CONFIG.nearDistance;
        
        // LOGIQUE DE DIAMÈTRE ADAPTATIF pour les cercles
        const realPlanetSize = data.realPlanetSize || 10;
        const minCircleSize = SELECTION_CONFIG.sphereSize; // Taille minimale du cercle
        
        // Distance où le cercle commence à se réduire (quand on peut voir la planète)
        const visibilityThreshold = realPlanetSize * 20; // 20x la taille de la planète
        
        let circleSize;
        if (distanceToCamera > visibilityThreshold) {
            // Loin : cercle à taille minimale (toujours visible)
            circleSize = minCircleSize;
            data.sphere.visible = true;
        } else {
            // Proche : réduire progressivement jusqu'au diamètre réel de la planète
            const reductionFactor = distanceToCamera / visibilityThreshold;
            circleSize = Math.max(realPlanetSize, minCircleSize * reductionFactor);
            
            // Masquer le cercle quand on est très proche (planète visible)
            data.sphere.visible = distanceToCamera > realPlanetSize * 3;
        }
        
        // Appliquer la nouvelle taille au cercle
        const scaleRatio = circleSize / minCircleSize;
        data.sphere.scale.setScalar(scaleRatio);
        
        // Faire que le cercle regarde toujours la caméra (billboard)
        data.sphere.lookAt(camera.position);
        
        // Adapter les labels
        data.label.scale.setScalar(Math.max(0.5, scaleRatio * 0.7));
        
        // Debug occasionnel
        if (Math.random() < 0.001) {
            console.log(`🔘 ${planetName}: distance=${distanceToCamera.toFixed(0)}, circleSize=${circleSize.toFixed(1)}, visible=${data.sphere.visible}`);
        }
    });
}
*/

// FONCTION SUPPRIMÉE
/*
function createProgressiveOrbits() {
    const planetData = [];
    
    // Ajouter seulement les planètes qui existent
    if (typeof mercury !== 'undefined' && mercury) {
        planetData.push({ name: 'mercury', planet: mercury, distance: getScaledDistance('mercury'), color: 0x8C7853 });
    }
    if (typeof venus !== 'undefined' && venus) {
        planetData.push({ name: 'venus', planet: venus, distance: getScaledDistance('venus'), color: 0xFFC649 });
    }
    if (typeof earth !== 'undefined' && earth) {
        planetData.push({ name: 'earth', planet: earth, distance: getScaledDistance('earth'), color: 0x6B93D6 });
    }
    if (typeof mars !== 'undefined' && mars) {
        planetData.push({ name: 'mars', planet: mars, distance: getScaledDistance('mars'), color: 0xCD5C5C });
    }
    if (typeof jupiter !== 'undefined' && jupiter) {
        planetData.push({ name: 'jupiter', planet: jupiter, distance: getScaledDistance('jupiter'), color: 0xD8CA9D });
    }
    if (typeof saturn !== 'undefined' && saturn) {
        planetData.push({ name: 'saturn', planet: saturn, distance: getScaledDistance('saturn'), color: 0xFAD5A5 });
    }
    if (typeof uranus !== 'undefined' && uranus) {
        planetData.push({ name: 'uranus', planet: uranus, distance: getScaledDistance('uranus'), color: 0x4FD0E7 });
    }
    if (typeof neptune !== 'undefined' && neptune) {
        planetData.push({ name: 'neptune', planet: neptune, distance: getScaledDistance('neptune'), color: 0x4B70DD });
    }
    
    console.log(`🌌 Création des orbites progressives pour ${planetData.length} planètes`);
    
    planetData.forEach(data => {
        if (data.planet && data.planet.planet3d) {
            createProgressiveOrbit(data.name, data.planet, data.distance, data.color);
        }
    });
    
    console.log('✅ Orbites progressives créées');
}
*/

// FONCTION SUPPRIMÉE
/*
function createProgressiveOrbit(planetName, planetObj, orbitDistance, color) {
    const orbit = {
        points: [],
        planetObj: planetObj,
        orbitDistance: orbitDistance,
        color: new THREE.Color(color),
        geometry: new THREE.BufferGeometry(),
        material: new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(color) },
                time: { value: 0 }
            },
            vertexShader: `
                attribute float thickness;
                attribute float alpha;
                varying float vAlpha;
                varying float vThickness;
                
                void main() {
                    vAlpha = alpha;
                    vThickness = thickness;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                varying float vAlpha;
                varying float vThickness;
                
                void main() {
                    gl_FragColor = vec4(color, vAlpha);
                }
            `,
            transparent: true,
            linewidth: 1
        }),
        line: null,
        lastUpdate: 0
    };
    
    orbit.line = new THREE.Line(orbit.geometry, orbit.material);
    scene.add(orbit.line);
    
    progressiveOrbits.set(planetName, orbit);
}
*/

// FONCTION SUPPRIMÉE
/*
function updateProgressiveOrbits() {
    if (progressiveOrbits.size === 0) return;
    
    const currentTime = performance.now();
    
    progressiveOrbits.forEach((orbit, planetName) => {
        // Mise à jour selon la fréquence
        if (currentTime - orbit.lastUpdate < (1000 / 60) * PROGRESSIVE_ORBIT_CONFIG.updateFrequency) return;
        orbit.lastUpdate = currentTime;
        
        const planetObj = orbit.planetObj;
        if (!planetObj || !planetObj.planet3d) return;
        
        // Obtenir la position actuelle de la planète
        const currentPos = new THREE.Vector3();
        planetObj.planet3d.getWorldPosition(currentPos);
        
        // Ajouter le nouveau point
        orbit.points.push({
            position: currentPos.clone(),
            time: currentTime
        });
        
        // Limiter le nombre de points (longueur de la traînée)
        const maxAge = PROGRESSIVE_ORBIT_CONFIG.fadeLength * 60000; // Durée en ms
        orbit.points = orbit.points.filter(point => currentTime - point.time < maxAge);
        
        if (orbit.points.length < 2) return;
        
        // Créer la géométrie avec épaisseur progressive
        const positions = [];
        const alphas = [];
        const thicknesses = [];
        
        orbit.points.forEach((point, index) => {
            positions.push(point.position.x, point.position.y, point.position.z);
            
            // Calculer l'épaisseur : plus épaisse près de la planète
            const ageRatio = (currentTime - point.time) / maxAge;
            const thickness = PROGRESSIVE_ORBIT_CONFIG.maxThickness * (1 - ageRatio) + PROGRESSIVE_ORBIT_CONFIG.minThickness;
            thicknesses.push(thickness);
            
            // Calculer l'alpha : disparition progressive
            const alpha = Math.max(0, 1 - ageRatio);
            alphas.push(alpha);
        });
        
        // Mettre à jour la géométrie
        orbit.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        orbit.geometry.setAttribute('alpha', new THREE.Float32BufferAttribute(alphas, 1));
        orbit.geometry.setAttribute('thickness', new THREE.Float32BufferAttribute(thicknesses, 1));
        orbit.geometry.attributes.position.needsUpdate = true;
        orbit.geometry.attributes.alpha.needsUpdate = true;
        orbit.geometry.attributes.thickness.needsUpdate = true;
    });
}
*/

function createOrbitTrails() {
    // ANCIEN SYSTÈME DÉSACTIVÉ - Remplacé par les orbites progressives
    console.log('⚠️ Ancien système d’orbites désactivé');
    return;
    
    if (orbitTrailSystem) {
        scene.remove(orbitTrailSystem);
        orbitTrailSystem = null;
        planetTrails.clear();
    }
    
    orbitTrailSystem = new THREE.Group();
    
    // Données des planètes avec leurs couleurs (vérifier qu'elles existent)
    const planetData = [];
    
    // Ajouter seulement les planètes qui existent
    if (typeof mercury !== 'undefined' && mercury) {
        planetData.push({ name: 'mercury', planet: mercury, color: new THREE.Color(0x8C7853), distance: getScaledDistance('mercury') });
    }
    if (typeof venus !== 'undefined' && venus) {
        planetData.push({ name: 'venus', planet: venus, color: new THREE.Color(0xFFC649), distance: getScaledDistance('venus') });
    }
    if (typeof earth !== 'undefined' && earth) {
        planetData.push({ name: 'earth', planet: earth, color: new THREE.Color(0x6B93D6), distance: getScaledDistance('earth') });
    }
    if (typeof mars !== 'undefined' && mars) {
        planetData.push({ name: 'mars', planet: mars, color: new THREE.Color(0xCD5C5C), distance: getScaledDistance('mars') });
    }
    if (typeof jupiter !== 'undefined' && jupiter) {
        planetData.push({ name: 'jupiter', planet: jupiter, color: new THREE.Color(0xD8CA9D), distance: getScaledDistance('jupiter') });
    }
    if (typeof saturn !== 'undefined' && saturn) {
        planetData.push({ name: 'saturn', planet: saturn, color: new THREE.Color(0xFAD5A5), distance: getScaledDistance('saturn') });
    }
    if (typeof uranus !== 'undefined' && uranus) {
        planetData.push({ name: 'uranus', planet: uranus, color: new THREE.Color(0x4FD0E7), distance: getScaledDistance('uranus') });
    }
    if (typeof neptune !== 'undefined' && neptune) {
        planetData.push({ name: 'neptune', planet: neptune, color: new THREE.Color(0x4B70DD), distance: getScaledDistance('neptune') });
    }
    
    console.log(`🌌 Création des traînées pour ${planetData.length} planètes`);
    
    planetData.forEach(data => {
        if (data.planet && data.planet.planet3d) {
            createPlanetTrail(data.name, data.planet, data.color, data.distance);
        }
    });
    
    scene.add(orbitTrailSystem);
    console.log('✅ Système de traînées orbitales créé');
}

function createPlanetTrail(planetName, planetObj, color, distance) {
    const trail = {
        points: [],
        geometry: new THREE.BufferGeometry(),
        material: new THREE.ShaderMaterial({
            uniforms: {
                color: { value: color },
                time: { value: 0 },
                opacity: { value: 1.0 }
            },
            vertexShader: `
                attribute float alpha;
                attribute float size;
                varying float vAlpha;
                
                void main() {
                    vAlpha = alpha;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float opacity;
                varying float vAlpha;
                
                void main() {
                    float dist = distance(gl_PointCoord, vec2(0.5));
                    if (dist > 0.5) discard;
                    
                    float glow = 1.0 - (dist * 2.0);
                    glow = pow(glow, 2.0);
                    
                    gl_FragColor = vec4(color, vAlpha * glow * opacity);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }),
        line: null,
        planetObj: planetObj,
        distance: distance,
        lastUpdate: 0
    };
    
    // Créer la ligne de traînée
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.ShaderMaterial({
        uniforms: {
            color: { value: color },
            time: { value: 0 },
            opacity: { value: 1.0 }
        },
        vertexShader: `
            attribute float alpha;
            varying float vAlpha;
            
            void main() {
                vAlpha = alpha;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            uniform float opacity;
            varying float vAlpha;
            
            void main() {
                gl_FragColor = vec4(color, vAlpha * opacity);
            }
        `,
        transparent: true,
        linewidth: 2
    });
    
    trail.line = new THREE.Line(lineGeometry, lineMaterial);
    orbitTrailSystem.add(trail.line);
    
    planetTrails.set(planetName, trail);
}

// Fonction pour calculer l'adaptation au zoom (style Universe Sandbox)
function calculateZoomAdaptation() {
    // Calculer la distance de la caméra au centre
    currentCameraDistance = camera.position.distanceTo(controls.target);
    
    // Adapter la largeur des traînées selon le zoom
    const zoomFactor = Math.log10(Math.max(currentCameraDistance, 1)) / 4; // Logarithmique
    adaptiveTrailWidth = THREE.MathUtils.clamp(
        TRAIL_CONFIG.minTrailWidth + (zoomFactor * TRAIL_CONFIG.maxTrailWidth),
        TRAIL_CONFIG.minTrailWidth,
        TRAIL_CONFIG.maxTrailWidth
    );
    
    // Adapter l'opacité selon la distance
    const distanceRatio = currentCameraDistance / TRAIL_CONFIG.maxVisibleDistance;
    adaptiveOpacity = THREE.MathUtils.clamp(
        1 - (distanceRatio * TRAIL_CONFIG.distanceOpacityFactor),
        0.1,
        1.0
    );
    
    // Debug occasionnel
    if (Math.random() < 0.001) {
        console.log(`🔍 Zoom: distance=${currentCameraDistance.toFixed(0)}, width=${adaptiveTrailWidth.toFixed(1)}, opacity=${adaptiveOpacity.toFixed(2)}`);
    }
}

function updateOrbitTrails() {
    if (!orbitTrailSystem || planetTrails.size === 0) return;
    
    // Calculer l'adaptation au zoom
    calculateZoomAdaptation();
    
    const currentTime = performance.now();
    
    planetTrails.forEach((trail, planetName) => {
        // Mise à jour seulement selon la fréquence définie
        if (currentTime - trail.lastUpdate < (1000 / 60) * TRAIL_CONFIG.updateFrequency) return;
        trail.lastUpdate = currentTime;
        
        const planetObj = trail.planetObj;
        if (!planetObj || !planetObj.planet3d) return;
        
        // Obtenir la position actuelle de la planète
        const currentPos = new THREE.Vector3();
        planetObj.planet3d.getWorldPosition(currentPos);
        
        // Calculer la distance de la planète à la caméra
        const planetDistance = camera.position.distanceTo(currentPos);
        
        // Masquer les traînées trop éloignées ou trop proches
        const isVisible = planetDistance >= TRAIL_CONFIG.minVisibleDistance && 
                         planetDistance <= TRAIL_CONFIG.maxVisibleDistance;
        
        if (!isVisible) {
            trail.line.visible = false;
            return;
        }
        
        trail.line.visible = true;
        
        // Ajouter le nouveau point
        trail.points.push({
            position: currentPos.clone(),
            time: currentTime
        });
        
        // Limiter le nombre de points et calculer les alphas
        const maxAge = TRAIL_CONFIG.fadeDistance * 15000; // Durée de vie plus longue
        trail.points = trail.points.filter(point => currentTime - point.time < maxAge);
        
        if (trail.points.length < 2) return;
        
        // Créer la géométrie de la ligne avec largeur adaptative
        const positions = [];
        const alphas = [];
        const sizes = []; // Pour la largeur adaptative
        
        trail.points.forEach((point, index) => {
            positions.push(point.position.x, point.position.y, point.position.z);
            
            // Calculer l'alpha basé sur l'âge du point ET la distance
            const age = currentTime - point.time;
            const ageAlpha = Math.max(0, 1 - (age / maxAge));
            const finalAlpha = ageAlpha * adaptiveOpacity;
            alphas.push(finalAlpha);
            
            // Taille adaptative
            sizes.push(adaptiveTrailWidth);
        });
        
        // Mettre à jour la géométrie
        trail.line.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        trail.line.geometry.setAttribute('alpha', new THREE.Float32BufferAttribute(alphas, 1));
        trail.line.geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        trail.line.geometry.attributes.position.needsUpdate = true;
        trail.line.geometry.attributes.alpha.needsUpdate = true;
        trail.line.geometry.attributes.size.needsUpdate = true;
        
        // Mettre à jour l'opacité globale du matériau (vérifier si les uniforms existent)
        if (trail.line.material.uniforms && trail.line.material.uniforms.opacity) {
            trail.line.material.uniforms.opacity.value = adaptiveOpacity;
        } else {
            // Fallback pour les matériaux sans uniforms
            trail.line.material.opacity = adaptiveOpacity;
        }
    });
}

function createOrbits() {
    createOrbitTrails();
}

function toggleOrbits(show) {
    if (show && !orbitTrailSystem) {
        createOrbitTrails();
    } else if (orbitTrailSystem) {
        orbitTrailSystem.visible = show;
    }
}

// ******  POSTPROCESSING setup ******
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// ******  OUTLINE PASS - GAMING STYLE ******
const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
outlinePass.edgeStrength = 2.0; // Réduit la force
outlinePass.edgeGlow = 0.3; // Réduit la lueur
outlinePass.edgeThickness = 1.2; // Légèrement plus épais
outlinePass.pulsePeriod = 0; // Pas de pulsation
outlinePass.visibleEdgeColor.set(0x0080ff); // Bleu au lieu de blanc
outlinePass.hiddenEdgeColor.set(0x004080); // Bleu foncé
composer.addPass(outlinePass);

// ******  BLOOM PASS  ******
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1, 0.4, 0.85);
bloomPass.threshold = 1;
bloomPass.radius = 0.9;
composer.addPass(bloomPass);

// ****** AMBIENT LIGHT ******
console.log("Add the ambient light");
var lightAmbient = new THREE.AmbientLight(0x222244, 2.5); // Légèrement plus forte pour voir le côté nuit
scene.add(lightAmbient);

// ******  Star background  ******
scene.background = cubeTextureLoader.load([

  bgTexture3,
  bgTexture1,
  bgTexture2,
  bgTexture2,
  bgTexture4,
  bgTexture2
]);

// ******  SETTINGS FOR INTERACTIVE CONTROLS  ******
const settings = {
  accelerationOrbit: 1,
  acceleration: 1,
  sunIntensity: 1.9
};

// Note: GUI controls are now handled by HUD interface
console.log("⚙️ Settings initialized for HUD controls");

// ===== ÉCHELLE ET DISTANCES RÉALISTES NASA =====
// Unité Astronomique (UA) = distance Terre-Soleil EXACTE = 149,597,870.7 km
const AU_IN_KM = 149597870.7; // 1 UA en kilomètres (définition IAU)
let SCALE_FACTOR = AU_IN_KM; // 1 unité THREE.js = 1 UA EXACTE

// Distances réelles dans le système solaire (en UA et km)
const REAL_DISTANCES = {
    sun: { radius: 696340 }, // km
    mercury: { distance: 0.387, distanceKm: 57.9e6, radius: 2439.7 },
    venus: { distance: 0.723, distanceKm: 108.2e6, radius: 6051.8 },
    earth: { distance: 1.000, distanceKm: 149.6e6, radius: 6371 },
    mars: { distance: 1.524, distanceKm: 227.9e6, radius: 3389.5 },
    jupiter: { distance: 5.203, distanceKm: 778.5e6, radius: 69911 },
    saturn: { distance: 9.537, distanceKm: 1432e6, radius: 58232 },
    uranus: { distance: 19.191, distanceKm: 2867e6, radius: 25362 },
    neptune: { distance: 30.069, distanceKm: 4515e6, radius: 24622 },
    pluto: { distance: 39.482, distanceKm: 5906e6, radius: 1188.3 },
    moon: { distance: 0.00257, distanceKm: 384400, radius: 1737.4 } // Distance de la Terre en UA
};

function formatDistance(distanceKm) {
    const distanceUA = distanceKm / AU_IN_KM;
    
    // PRIORITÉ AUX UNITÉS ASTRONOMIQUES pour projet NASA
    if (distanceUA < 0.001) {
        return `${Math.round(distanceKm)} km`;
    } else if (distanceUA < 0.01) {
        return `${(distanceUA * 1000).toFixed(1)} mUA`; // milliUA
    } else if (distanceUA < 1) {
        return `${distanceUA.toFixed(4)} UA`;
    } else if (distanceUA < 100) {
        return `${distanceUA.toFixed(3)} UA`;
    } else {
        return `${distanceUA.toFixed(2)} UA`;
    }
}

function updateScaleDisplay() {
    // Distance de la caméra au centre (0,0,0) en UA
    const cameraDistanceUnits = camera.position.length();
    const cameraDistanceUA = cameraDistanceUnits; // Maintenant 1 unité = 1 UA
    const cameraDistanceKm = cameraDistanceUA * AU_IN_KM;
    
    // Mise à jour de l'affichage - PRÉCISION NASA
    document.getElementById('camera-distance').textContent = formatDistance(cameraDistanceKm);
    document.getElementById('scale-ratio').textContent = `1 unité = 1.000 UA`;
    
    // Si on suit un objet, afficher la distance à cet objet
    if (followedPlanet) {
        const targetPosition = new THREE.Vector3();
        followedPlanet.getWorldPosition(targetPosition);
        const distanceToTargetUA = camera.position.distanceTo(targetPosition);
        const distanceToTargetKm = distanceToTargetUA * AU_IN_KM;
        
        document.getElementById('target-distance').textContent = formatDistance(distanceToTargetKm);
        document.getElementById('target-distance-item').style.display = 'flex';
    } else {
        document.getElementById('target-distance-item').style.display = 'none';
    }
}

// mouse movement
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    event.preventDefault();
    // Utiliser les coordonnées de la fenêtre entière car le canvas fait toute la fenêtre
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// ******  SELECT PLANET  ******
let selectedPlanet = null;
let isMovingTowardsPlanet = false;
let targetCameraPosition = new THREE.Vector3();
let offset;
let followedPlanet = null; // Planète actuellement suivie par la caméra

function onDocumentMouseDown(event) {
  event.preventDefault();

  // Mettre à jour les coordonnées de la souris
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Configurer le raycaster
  raycaster.setFromCamera(mouse, camera);
  
  // Chercher les intersections avec les planètes
  const intersects = raycaster.intersectObjects(raycastTargets);
  
  console.log("🖱️ Clic détecté:", mouse, "Intersections:", intersects.length);
  console.log("🎯 Objets raycastables:", raycastTargets.length);
  
  // Debug: afficher les premiers objets raycastables
  if (raycastTargets.length > 0) {
    console.log("🔍 Premiers objets raycast:", raycastTargets.slice(0, 5).map(obj => obj.userData?.planetName || 'unknown'));
  }

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    
    // Vérifier si c'est une sphère de sélection ou un marqueur
    if (clickedObject.userData && (clickedObject.userData.isSelectionSphere || clickedObject.userData.isMarker)) {
      const objectName = clickedObject.userData.planetName;
      const objectType = clickedObject.userData.type || 'planet';
      const emoji = objectType === 'moon' ? '🌙' : '🪐';
      
      console.log(`🔘 Marqueur/Sphère cliqué: ${emoji} ${objectName} (${objectType})`);
      
      // Centrer sur l'objet (planète ou lune)
      centerOnPlanet(objectName, objectType);
      
      // Afficher les infos
      selectedPlanet = { name: objectName, type: objectType };
      closeInfoNoZoomOut();
      showPlanetInfo(objectName, objectType);
      
      console.log(`${emoji} ${objectType} sélectionné(e) via marqueur:`, objectName);
      return;
    }
    selectedPlanet = identifyPlanet(clickedObject);
    if (selectedPlanet) {
      closeInfoNoZoomOut();
      
      // Juste afficher les infos de l'objet (planète ou lune)
      // AUCUN mouvement de caméra automatique
      console.log("🔍 Tentative d'affichage tooltip pour:", selectedPlanet.name, selectedPlanet.type);
      showPlanetInfo(selectedPlanet.name, selectedPlanet.type);
      
      console.log(`${selectedPlanet.type === 'moon' ? '🌙' : '🪐'} ${selectedPlanet.type} sélectionnée:`, selectedPlanet.name, "- Caméra libre");
    }
  }
}

function identifyPlanet(clickedObject) {
  // Logic to identify which planet/moon was clicked based on the clicked object
  
  // Check planets first
  if (clickedObject.material === mercury.planet.material) {
    offset = 10;
    return { type: 'planet', name: 'mercury', object: mercury };
  } else if (clickedObject.material === venus.Atmosphere.material) {
    offset = 25;
    return { type: 'planet', name: 'venus', object: venus };
  } else if (clickedObject.material === earth.Atmosphere.material) {
    offset = 25;
    return { type: 'planet', name: 'earth', object: earth };
  } else if (clickedObject.material === mars.planet.material) {
    offset = 15;
    return { type: 'planet', name: 'mars', object: mars };
  } else if (clickedObject.material === jupiter.planet.material) {
    offset = 50;
    return { type: 'planet', name: 'jupiter', object: jupiter };
  } else if (clickedObject.material === saturn.planet.material) {
    offset = 50;
    return { type: 'planet', name: 'saturn', object: saturn };
  } else if (clickedObject.material === uranus.planet.material) {
    offset = 25;
    return { type: 'planet', name: 'uranus', object: uranus };
  } else if (clickedObject.material === neptune.planet.material) {
    offset = 20;
    return { type: 'planet', name: 'neptune', object: neptune };
  } else if (clickedObject.material === pluto.planet.material) {
    offset = 10;
    return { type: 'planet', name: 'pluto', object: pluto };
  }
  
  // Check moons
  if (typeof earth !== 'undefined' && earth.moon && clickedObject.material === earth.moon.material) {
    offset = 5;
    return { type: 'moon', name: 'moon', object: earth.moon, parent: 'earth' };
  }
  
  // Check Jupiter's moons
  if (jupiter && jupiter.moons) {
    const moonNames = ['Io', 'Europa', 'Ganymède', 'Callisto'];
    for (let i = 0; i < jupiter.moons.length; i++) {
      if (jupiter.moons[i].mesh && clickedObject === jupiter.moons[i].mesh) {
        return { type: 'moon', name: moonNames[i], object: jupiter.moons[i].mesh, parent: 'Jupiter' };
      }
    }
  }

  // TODO: Add other moons when they exist (Mars moons, etc.)

  return null;
}

// ******  SHOW PLANET INFO AFTER SELECTION  ******
function showPlanetInfo(objectName, objectType = 'planet') {
  console.log("🎯 showPlanetInfo appelée avec:", objectName, objectType);
  
  const tooltip = document.getElementById('planet-tooltip');
  const tooltipName = document.getElementById('tooltip-name');
  const tooltipType = document.getElementById('tooltip-type');
  const tooltipContent = document.getElementById('tooltip-content');
  const tooltipDescription = document.getElementById('tooltip-description');
  
  console.log("🔍 Éléments tooltip trouvés:", {
    tooltip: !!tooltip,
    tooltipName: !!tooltipName,
    tooltipType: !!tooltipType,
    tooltipContent: !!tooltipContent,
    tooltipDescription: !!tooltipDescription
  });
  
  if (!tooltip) {
    console.error("❌ Tooltip element not found!");
    return;
  }

  let objectInfo;
  let displayName;
  let displayType;
  
  if (objectType === 'moon') {
    // Data for moons
    if (objectName === 'moon') {
      objectInfo = {
        radius: '1,737 km',
        distance: '384,400 km de la Terre',
        orbit: '27.3 jours',
        moons: '0',
        info: 'La Lune est le seul satellite naturel de la Terre. Elle influence les marées et stabilise l\'axe de rotation terrestre.'
      };
      displayName = 'Lune';
      displayType = 'Satellite naturel';
    }
  } else {
    // Data for planets - CORRECTION: utiliser la bonne clé
    const planetKey = objectName.charAt(0).toUpperCase() + objectName.slice(1);
    objectInfo = planetData[planetKey];
    displayName = planetKey;
    displayType = 'Planète';
    
    console.log("🔍 Recherche données planète:", planetKey, "Trouvé:", !!objectInfo);
  }
  
  if (!objectInfo) return;
  
  // Update tooltip content
  tooltipName.textContent = displayName;
  tooltipType.textContent = displayType;
  
  // Generate quick info
  tooltipContent.innerHTML = `
    <div class="tooltip-info">
      <span class="info-label">Rayon</span>
      <span class="info-value">${objectInfo.radius}</span>
    </div>
    <div class="tooltip-info">
      <span class="info-label">Distance</span>
      <span class="info-value">${objectInfo.distance}</span>
    </div>
    <div class="tooltip-info">
      <span class="info-label">Orbite</span>
      <span class="info-value">${objectInfo.orbit}</span>
    </div>
    <div class="tooltip-info">
      <span class="info-label">Lunes</span>
      <span class="info-value">${objectInfo.moons}</span>
    </div>
  `;
  
  // Set description
  tooltipDescription.textContent = objectInfo.info;
  
  // Position tooltip near mouse
  tooltip.style.left = (mouse.x * window.innerWidth * 0.5 + window.innerWidth * 0.5 + 20) + 'px';
  tooltip.style.top = (-mouse.y * window.innerHeight * 0.5 + window.innerHeight * 0.5 - 100) + 'px';
  
  // Show tooltip
  console.log("✅ Ajout de la classe 'show' au tooltip");
  tooltip.classList.add('show');
  
  // Vérifier que la classe a été ajoutée
  console.log("🔍 Classes du tooltip après ajout:", tooltip.className);
  
  // NE PAS bouger la caméra automatiquement
  // L'utilisateur décide s'il veut centrer ou pas
}

// Fonction pour centrer sur un objet (planète ou lune) SANS forcer le zoom
function centerOnPlanet(objectName, objectType = 'planet') {
  let targetObject = null;
  
  if (objectType === 'moon') {
    // Trouver la lune correspondante
    switch(objectName.toLowerCase()) {
      case 'moon': 
        if (typeof earth !== 'undefined' && earth.moons && earth.moons[0]) {
          targetObject = earth.moons[0].mesh;
        }
        break;
      case 'io':
        if (jupiter && jupiter.moons && jupiter.moons[0]) {
          targetObject = jupiter.moons[0].mesh;
        }
        break;
      case 'europa':
        if (jupiter && jupiter.moons && jupiter.moons[1]) {
          targetObject = jupiter.moons[1].mesh;
        }
        break;
      case 'ganymede':
        if (jupiter && jupiter.moons && jupiter.moons[2]) {
          targetObject = jupiter.moons[2].mesh;
        }
        break;
      case 'callisto':
        if (jupiter && jupiter.moons && jupiter.moons[3]) {
          targetObject = jupiter.moons[3].mesh;
        }
        break;
    }
  } else {
    // Trouver la planète correspondante
    switch(objectName.toLowerCase()) {
      case 'mercury': targetObject = mercury.planet; break;
      case 'venus': targetObject = venus.planet; break;
      case 'earth': targetObject = earth.planet; break;
      case 'mars': targetObject = mars.planet; break;
      case 'jupiter': targetObject = jupiter.planet; break;
      case 'saturn': targetObject = saturn.planet; break;
      case 'uranus': targetObject = uranus.planet; break;
      case 'neptune': targetObject = neptune.planet; break;
      case 'pluto': targetObject = pluto.planet; break;
    }
  }
  
  if (targetObject) {
    // Marquer cet objet comme suivi EN PREMIER
    followedPlanet = targetObject;
    
    // Obtenir la position actuelle de l'objet
    const objectPosition = new THREE.Vector3();
    targetObject.getWorldPosition(objectPosition);
    
    // Centrer SEULEMENT le target sur la planète, SANS bouger la caméra
    controls.target.copy(objectPosition);
    controls.update();
    
    const emoji = objectType === 'moon' ? '🌙' : '🎯';
    console.log(`${emoji} Centré sur ${objectName} (${objectType}) - suivi orbital activé`);
    console.log("Position objet:", objectPosition);
  }
}

// Fonction pour simplement centrer sur une planète (clic sur marqueur)
function centerOnPlanetSimple(planetName) {
  let targetPlanet = null;
  
  // Trouver la planète correspondante
  switch(planetName.toLowerCase()) {
    case 'mercury': targetPlanet = mercury.planet; break;
    case 'venus': targetPlanet = venus.planet; break;
    case 'earth': targetPlanet = earth.planet; break;
    case 'mars': targetPlanet = mars.planet; break;
    case 'jupiter': targetPlanet = jupiter.planet; break;
    case 'saturn': targetPlanet = saturn.planet; break;
    case 'uranus': targetPlanet = uranus.planet; break;
    case 'neptune': targetPlanet = neptune.planet; break;
    case 'pluto': targetPlanet = pluto.planet; break;
  }
  
  if (targetPlanet) {
    // Marquer cette planète comme suivie
    followedPlanet = targetPlanet;
    
    // Obtenir la position de la planète
    const planetPosition = new THREE.Vector3();
    targetPlanet.getWorldPosition(planetPosition);
    
    // Centrer SEULEMENT le target, SANS bouger la caméra
    controls.target.copy(planetPosition);
    controls.update();
    
    console.log(`🎯 Centré sur ${planetName} - position caméra inchangée`);
  }
}

// Fonction pour zoomer sur une planète (utilisée par les raccourcis clavier)
function zoomToPlanet(planetName) {
  let targetPlanet = null;
  let planetRadius = 1;
  
  // Trouver la planète correspondante
  switch(planetName.toLowerCase()) {
    case 'mercury':
      targetPlanet = mercury.planet;
      planetRadius = 2.4;
      break;
    case 'venus':
      targetPlanet = venus.planet;
      planetRadius = 6.0;
      break;
    case 'earth':
      targetPlanet = earth.planet;
      planetRadius = 6.3;
      break;
    case 'mars':
      targetPlanet = mars.planet;
      planetRadius = 3.4;
      break;
    case 'jupiter':
      targetPlanet = jupiter.planet;
      planetRadius = 69.9;
      break;
    case 'saturn':
      targetPlanet = saturn.planet;
      planetRadius = 58.2;
      break;
    case 'uranus':
      targetPlanet = uranus.planet;
      planetRadius = 25.4;
      break;
    case 'neptune':
      targetPlanet = neptune.planet;
      planetRadius = 24.6;
      break;
    case 'pluto':
      targetPlanet = pluto.planet;
      planetRadius = 1.2;
      break;
  }
  
  if (targetPlanet) {
    // Position actuelle de la planète
    const planetPosition = targetPlanet.position.clone();
    
    // Distance optimale basée sur la taille de la planète
    const optimalDistance = Math.max(planetRadius * 4, 10); // Au minimum 10 unités
    
    // Positionner la caméra à une distance fixe de la planète
    // Utiliser une position relative standard (comme pour le soleil)
    const cameraOffset = new THREE.Vector3(optimalDistance * 0.8, optimalDistance * 0.6, optimalDistance * 0.3);
    const newCameraPosition = planetPosition.clone().add(cameraOffset);
    
    // IMPORTANT: Définir le target des contrôles sur la planète
    // C'est ce qui fait que la caméra "orbite" autour de la planète
    controls.target.copy(planetPosition);
    
    // Marquer cette planète comme suivie
    followedPlanet = targetPlanet;
    
    // Plus besoin d'enregistrer distance et offset - OrbitControls gère tout
    
    // Animation fluide vers la nouvelle position
    animateCameraTo(newCameraPosition, planetPosition);
    
    console.log(`🎯 Centering on ${planetName} at position:`, planetPosition, `distance: ${optimalDistance}`);
  }
}

// Animation fluide de la caméra
function animateCameraTo(targetPosition, lookAtPosition) {
  const startPosition = camera.position.clone();
  const startLookAt = controls.target.clone();
  
  let progress = 0;
  const duration = 1500; // 1.5 secondes pour plus de réactivité
  const startTime = Date.now();
  
  function animate() {
    const elapsed = Date.now() - startTime;
    progress = Math.min(elapsed / duration, 1);
    
    // Utiliser une courbe d'easing pour une animation plus fluide
    const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    
    // Interpoler la position de la caméra
    camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
    
    // Interpoler le point de vue (target des contrôles)
    controls.target.lerpVectors(startLookAt, lookAtPosition, easeProgress);
    
    // Forcer la mise à jour des contrôles
    controls.update();
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // S'assurer que le target final est bien défini
      controls.target.copy(lookAtPosition);
      controls.update();
      console.log("✅ Animation terminée, centré sur:", lookAtPosition);
    }
  }
  
  animate();
}

// Animation douce du target seulement (sans bouger la caméra)
function animateTargetTo(targetPosition) {
  const startTarget = controls.target.clone();
  
  let progress = 0;
  const duration = 1000; // 1 seconde seulement
  const startTime = Date.now();
  
  function animate() {
    const elapsed = Date.now() - startTime;
    progress = Math.min(elapsed / duration, 1);
    
    // Courbe d'easing douce
    const easeProgress = 1 - Math.pow(1 - progress, 2); // ease-out quadratic
    
    // Interpoler seulement le target
    controls.target.lerpVectors(startTarget, targetPosition, easeProgress);
    controls.update();
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      console.log("✅ Target centré sur la planète");
    }
  }
  
  animate();
}
// Variables supprimées - plus de zoom out forcé
// close 'x' button function
function closeInfo() {
  const tooltip = document.getElementById('planet-tooltip');
  
  if (tooltip) {
    tooltip.classList.remove('show');
  }
  
  // NE PAS changer la cible de la caméra ni forcer le zoom out
  // L'utilisateur garde le contrôle total
  console.log("ℹ️ Tooltip fermé - caméra reste sur la planète");
}
window.closeInfo = closeInfo;

// close info when clicking another planet
function closeInfoNoZoomOut() {
  const tooltip = document.getElementById('planet-tooltip');
  
  if (tooltip) {
    tooltip.classList.remove('show');
  }
}

// ******  SUN AVEC TAILLE RÉALISTE ******
// TAILLE RÉALISTE DU SOLEIL par rapport à la Terre
// Soleil: 1,392,700 km de diamètre | Terre: 12,756 km de diamètre
// Ratio: 1,392,700 / 12,756 = 109.2 fois plus grand
const EARTH_RADIUS_CANVAS = 6.4; // Rayon Terre dans le canvas
const SUN_EARTH_RATIO = 109.2; // Soleil = 109.2 fois le diamètre terrestre
const sunSize = EARTH_RADIUS_CANVAS * SUN_EARTH_RATIO; // Taille réaliste
console.log(`☀️ Soleil: ${sunSize.toFixed(1)} unités (${SUN_EARTH_RATIO}x la Terre)`);

// Géométrie et matériau du Soleil
const sunGeom = new THREE.SphereGeometry(sunSize, 64, 32); // Plus de détails
let sunMat = new THREE.MeshStandardMaterial({
  emissive: 0xFFF88F,
  emissiveMap: loadTexture.load(sunTexture),
  emissiveIntensity: settings.sunIntensity
});
const sun = new THREE.Mesh(sunGeom, sunMat);
scene.add(sun);

//point light in the sun - AJUSTÉE À LA NOUVELLE TAILLE
// Intensité et portée proportionnelles à la taille du Soleil
const lightIntensity = 25; // Éclairage normal du Soleil
const lightDistance = 0; // Portée infinie pour éclairer tout le système solaire
const pointLight = new THREE.PointLight(0xFDFFD3, lightIntensity, lightDistance, 1.8);
// Positionner la lumière exactement au centre du Soleil
pointLight.position.set(0, 0, 0);

// *** CONFIGURER LES OMBRES IMMÉDIATEMENT ***
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;
pointLight.shadow.camera.near = 1;
pointLight.shadow.camera.far = 50000;
pointLight.shadow.radius = 1;
pointLight.shadow.bias = -0.001;

console.log(`💡 Lumière solaire: intensité ${lightIntensity.toFixed(0)}, portée ${lightDistance.toFixed(0)} unités`);
console.log(`🌑 Ombres configurées: ${pointLight.shadow.mapSize.width}x${pointLight.shadow.mapSize.height}, portée: ${pointLight.shadow.camera.far}`);
scene.add(pointLight);

// Ajouter une lumière directionnelle pour l'effet jour/nuit CORRECT
const directionalLight = new THREE.DirectionalLight(0xFDFFD3, 2);
directionalLight.position.set(0, 0, 0); // Position au centre (Soleil)
directionalLight.target.position.set(1000, 0, 0); // Cible vers l'extérieur du système
directionalLight.castShadow = false; // PAS d'ombres - seule la PointLight en génère
scene.add(directionalLight);
scene.add(directionalLight.target);
console.log(`🌅 Lumière directionnelle corrigée pour l'effet jour/nuit`);

// DEBUG: Vérifier que les ombres sont activées
console.log(`🌑 Système d'ombres:`, {
  enabled: renderer.shadowMap.enabled,
  type: renderer.shadowMap.type,
  pointLightCastShadow: pointLight.castShadow,
  shadowMapSize: pointLight.shadow.mapSize,
  shadowCameraNear: pointLight.shadow.camera.near,
  shadowCameraFar: pointLight.shadow.camera.far
});


// ******  PLANET CREATION FUNCTION  ******
function createPlanet(planetName, size, position, tilt, texture, bump, ring, atmosphere, moons){

  let material;
  if (texture instanceof THREE.Material){
    material = texture;
  } 
  else if(bump){
    material = new THREE.MeshPhongMaterial({
    map: loadTexture.load(texture),
    bumpMap: loadTexture.load(bump),
    bumpScale: 0.7
    });
  }
  else {
    material = new THREE.MeshPhongMaterial({
    map: loadTexture.load(texture)
    });
  } 

  const name = planetName;
  const geometry = new THREE.SphereGeometry(size, 32, 20);
  const planet = new THREE.Mesh(geometry, material);
  const planet3d = new THREE.Object3D;
  const planetSystem = new THREE.Group();
  planetSystem.add(planet);
  let Atmosphere;
  let Ring;
  planet.position.x = position;
  planet.rotation.z = tilt * Math.PI / 180;

  // add orbit path
  const orbitPath = new THREE.EllipseCurve(
    0, 0,            // ax, aY
    position, position, // xRadius, yRadius
    0, 2 * Math.PI,   // aStartAngle, aEndAngle
    false,            // aClockwise
    0                 // aRotation
);

  const pathPoints = orbitPath.getPoints(100);
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.03 });
  const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
  orbit.rotation.x = Math.PI / 2;
  planetSystem.add(orbit);

  //add ring
  if(ring)
  {
    const RingGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius,30);
    const RingMat = new THREE.MeshStandardMaterial({
      map: loadTexture.load(ring.texture),
      side: THREE.DoubleSide
    });
    Ring = new THREE.Mesh(RingGeo, RingMat);
    planetSystem.add(Ring);
    Ring.position.x = position;
    Ring.rotation.x = -0.5 *Math.PI;
    Ring.rotation.y = -tilt * Math.PI / 180;
  }
  
  //add atmosphere
  if(atmosphere){
    const atmosphereGeom = new THREE.SphereGeometry(size+0.1, 32, 20);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      map:loadTexture.load(atmosphere),
      transparent: true,
      opacity: 0.4,
      depthTest: true,
      depthWrite: false
    })
    Atmosphere = new THREE.Mesh(atmosphereGeom, atmosphereMaterial)
    
    Atmosphere.rotation.z = 0.41;
    planet.add(Atmosphere);
  }

  //add moons
  if(moons){
    moons.forEach(moon => {
      let moonMaterial;
      
      if(moon.bump){
        moonMaterial = new THREE.MeshStandardMaterial({
          map: loadTexture.load(moon.texture),
          bumpMap: loadTexture.load(moon.bump),
          bumpScale: 0.5
        });
      } else{
        moonMaterial = new THREE.MeshStandardMaterial({
          map: loadTexture.load(moon.texture)
        });
      }
      const moonGeometry = new THREE.SphereGeometry(moon.size, 32, 20);
      const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
      const moonOrbitDistance = size * 1.5;
      moonMesh.position.set(moonOrbitDistance, 0, 0);
      planetSystem.add(moonMesh);
      moon.mesh = moonMesh;
    });
  }
  //add planet system to planet3d object and to the scene
  planet3d.add(planetSystem);
  scene.add(planet3d);
  return {name, planet, planet3d, Atmosphere, moons, planetSystem, Ring};
}


// ******  LOADING OBJECTS METHOD  ******
function loadObject(path, position, scale, callback) {
  const loader = new GLTFLoader();

  loader.load(path, function (gltf) {
      const obj = gltf.scene;
      obj.position.set(position, 0, 0);
      obj.scale.set(scale, scale, scale);
      scene.add(obj);
      if (callback) {
        callback(obj);
      }
  }, undefined, function (error) {
      console.error('An error happened', error);
  });
}

// ******  ASTEROIDS  ******
const asteroids = [];
function loadAsteroids(path, numberOfAsteroids, minOrbitRadius, maxOrbitRadius, beltType = 'main') {
  const loader = new GLTFLoader();
  loader.load(path, function (gltf) {
      gltf.scene.traverse(function (child) {
          if (child.isMesh) {
              for (let i = 0; i < numberOfAsteroids / 12; i++) { // Divide by 12 because there are 12 asteroids in the pack
                  const asteroid = child.clone();
                  const orbitRadius = THREE.MathUtils.randFloat(minOrbitRadius, maxOrbitRadius);
                  const angle = Math.random() * Math.PI * 2;
                  const x = orbitRadius * Math.cos(angle);
                  
                  // Variation en hauteur selon le type de ceinture
                  let yVariation;
                  if (beltType === 'kuiper') {
                      yVariation = THREE.MathUtils.randFloat(-5, 5); // Kuiper plus étalée verticalement
                  } else {
                      yVariation = THREE.MathUtils.randFloat(-1, 1); // Ceinture principale plus plate
                  }
                  const y = yVariation;
                  const z = orbitRadius * Math.sin(angle);
                  
                  child.receiveShadow = true;
                  asteroid.position.set(x, y, z);
                  
                  // Taille selon le type de ceinture
                  let scaleRange;
                  if (beltType === 'kuiper') {
                      scaleRange = [0.2, 0.8]; // Objets Kuiper plus gros (comètes, planètes naines)
                  } else {
                      scaleRange = [0.05, 0.3]; // Astéroïdes plus petits
                  }
                  asteroid.scale.setScalar(THREE.MathUtils.randFloat(scaleRange[0], scaleRange[1]));
                  
                  scene.add(asteroid);
                  asteroids.push(asteroid);
              }
          }
      });
  }, undefined, function (error) {
      console.error('An error happened loading asteroids:', error);
  });
}


// Earth day/night effect shader material
const earthMaterial = new THREE.ShaderMaterial({
  uniforms: {
    dayTexture: { type: "t", value: loadTexture.load(earthTexture) },
    nightTexture: { type: "t", value: loadTexture.load(earthNightTexture) },
    sunPosition: { type: "v3", value: sun.position }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vSunDirection;

    uniform vec3 sunPosition;

    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
      vSunDirection = normalize(sunPosition - worldPosition.xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;

    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vSunDirection;

    void main() {
      float intensity = max(dot(vNormal, vSunDirection), 0.0);
      vec4 dayColor = texture2D(dayTexture, vUv);
      vec4 nightColor = texture2D(nightTexture, vUv)* 0.2;
      gl_FragColor = mix(nightColor, dayColor, intensity);
    }
  `
});


// ******  DONNÉES RÉELLES DES PLANÈTES ET LUNES  ******
// TAILLES RÉELLES DES PLANÈTES (diamètre en km) - DÉPLACÉ ICI POUR ÉVITER L'ERREUR
const REAL_PLANET_DIAMETERS = {
    earth: 12742,    // Référence
    mercury: 4879,   // 0.38 x Terre
    venus: 12104,    // 0.95 x Terre  
    mars: 6779,      // 0.53 x Terre
    jupiter: 139820, // 10.97 x Terre
    saturn: 116460,  // 9.14 x Terre
    uranus: 50724,   // 3.98 x Terre
    neptune: 49244   // 3.86 x Terre
};

// Diamètres réels des lunes (en km)
const REAL_MOON_DIAMETERS = {
    // Lune de la Terre
    moon: 3474,        // 0.27 x Terre
    
    // Lunes de Jupiter (galiléennes)
    io: 3643,          // 0.29 x Terre
    europa: 3122,      // 0.24 x Terre
    ganymede: 5268,    // 0.41 x Terre (plus grande lune du système solaire)
    callisto: 4821     // 0.38 x Terre
};

// Distances réelles des lunes à leur planète (en diamètres terrestres)
const REAL_MOON_DISTANCES = {
    // Lune de la Terre
    moon: 30.1,        // 384,400 km / 12,742 km = 30.1 diamètres terrestres
    
    // Lunes de Jupiter (en diamètres terrestres)
    io: 33.1,          // 421,700 km / 12,742 km
    europa: 52.7,      // 671,034 km / 12,742 km  
    ganymede: 84.2,    // 1,070,412 km / 12,742 km
    callisto: 147.4    // 1,882,709 km / 12,742 km
};

// Calculer les tailles relatives à la Terre pour les lunes
const MOON_SIZE_RATIOS = {};
Object.keys(REAL_MOON_DIAMETERS).forEach(moonName => {
    MOON_SIZE_RATIOS[moonName] = REAL_MOON_DIAMETERS[moonName] / REAL_PLANET_DIAMETERS.earth;
    console.log(`🌙 ${moonName}: ${MOON_SIZE_RATIOS[moonName].toFixed(3)}x la Terre`);
});

// ******  MOONS  ******
// Earth
const earthMoon = [{
  size: 6.4 * MOON_SIZE_RATIOS.moon, // 0.273 x Terre = 1.75 unités
  texture: earthMoonTexture,
  bump: earthMoonBump,
  orbitSpeed: 0.001 * settings.accelerationOrbit,
  orbitRadius: 6.4 * REAL_MOON_DISTANCES.moon // 30.1 diamètres terrestres = 192.6 unités
}]

// Mars' moons with path to 3D models (phobos & deimos)
const marsMoons = [
  {
    modelPath: '/images/mars/phobos.glb',
    scale: 0.1,
    orbitRadius: 5,
    orbitSpeed: 0.002 * settings.accelerationOrbit,
    position: 100,
    mesh: null
  },
  {
    modelPath: '/images/mars/deimos.glb',
    scale: 0.1,
    orbitRadius: 9,
    orbitSpeed: 0.0005 * settings.accelerationOrbit,
    position: 120,
    mesh: null
  }
];

// Jupiter
const jupiterMoons = [
  {
    size: 6.4 * MOON_SIZE_RATIOS.io, // 0.286 x Terre = 1.83 unités
    texture: ioTexture,
    orbitRadius: 6.4 * REAL_MOON_DISTANCES.io, // 33.1 diamètres = 211.8 unités
    orbitSpeed: 0.0005 * settings.accelerationOrbit
  },
  {
    size: 6.4 * MOON_SIZE_RATIOS.europa, // 0.245 x Terre = 1.57 unités
    texture: europaTexture,
    orbitRadius: 6.4 * REAL_MOON_DISTANCES.europa, // 52.7 diamètres = 337.3 unités
    orbitSpeed: 0.00025 * settings.accelerationOrbit
  },
  {
    size: 6.4 * MOON_SIZE_RATIOS.ganymede, // 0.413 x Terre = 2.64 unités
    texture: ganymedeTexture,
    orbitRadius: 6.4 * REAL_MOON_DISTANCES.ganymede, // 84.2 diamètres = 538.9 unités
    orbitSpeed: 0.000125 * settings.accelerationOrbit
  },
  {
    size: 6.4 * MOON_SIZE_RATIOS.callisto, // 0.378 x Terre = 2.42 unités
    texture: callistoTexture,
    orbitRadius: 6.4 * REAL_MOON_DISTANCES.callisto, // 147.4 diamètres = 943.4 unités
    orbitSpeed: 0.00006 * settings.accelerationOrbit
  }
];

// ******  PLANET CREATIONS  ******
// ===== SYSTÈME D'ÉCHELLE RÉALISTE (style Universe Sandbox) =====
// Distances réelles en diamètres terrestres
const REAL_DISTANCES_IN_EARTH_DIAMETERS = {
    mercury: 4544,   // 58M km / 12756 km
    venus: 8467,     // 108M km / 12756 km  
    earth: 11725,    // 149.6M km / 12756 km (1 UA)
    mars: 17873,     // 228M km / 12756 km
    jupiter: 61058,  // 779M km / 12756 km
    saturn: 111943,  // 1428M km / 12756 km
    uranus: 226063,  // 2884M km / 12756 km
    neptune: 354717  // 4525M km / 12756 km
};

// TAILLES RÉELLES DES PLANÈTES - DÉPLACÉES PLUS HAUT POUR ÉVITER L'ERREUR DE RÉFÉRENCE

// Calculer les tailles relatives à la Terre
const PLANET_SIZE_RATIOS = {};
Object.keys(REAL_PLANET_DIAMETERS).forEach(planet => {
    PLANET_SIZE_RATIOS[planet] = REAL_PLANET_DIAMETERS[planet] / REAL_PLANET_DIAMETERS.earth;
    console.log(`🌍 ${planet}: ${PLANET_SIZE_RATIOS[planet].toFixed(2)}x la Terre`);
});

// Facteur de compression pour navigation (comme Universe Sandbox)
let SCALE_COMPRESSION_FACTOR = 0.05; // 5% de la vraie échelle (ajustable pour meilleure visibilité)

// Fonction pour mettre à jour le facteur de compression
function updateScaleCompression(newFactor) {
    SCALE_COMPRESSION_FACTOR = newFactor;
    console.log(`🔄 Facteur de compression mis à jour: ${newFactor * 100}% de la vraie échelle`);
    // TODO: Recalculer les positions des planètes si nécessaire
}
const EARTH_DIAMETER_CANVAS = 12.8; // Terre = 6.4 rayon = 12.8 diamètre

// Fonction pour calculer les distances compressées
function getScaledDistance(planetName) {
    const realDistance = REAL_DISTANCES_IN_EARTH_DIAMETERS[planetName];
    const scaledDistance = realDistance * EARTH_DIAMETER_CANVAS * SCALE_COMPRESSION_FACTOR;
    console.log(`🌍 ${planetName}: ${realDistance} diamètres terrestres = ${scaledDistance.toFixed(1)} unités canvas`);
    return scaledDistance;
}

// Fonction pour calculer la taille réaliste d'une planète
function getRealisticPlanetSize(planetName) {
    const earthRadius = 6.4; // Rayon de référence de la Terre
    const sizeRatio = PLANET_SIZE_RATIOS[planetName] || 1;
    const realisticSize = earthRadius * sizeRatio;
    console.log(`🪐 ${planetName}: ${realisticSize.toFixed(2)} unités (${sizeRatio.toFixed(2)}x Terre)`);
    return realisticSize;
}

console.log("🪐 Creating planets with realistic distances...");
const mercury = new createPlanet('Mercury', getRealisticPlanetSize('mercury'), getScaledDistance('mercury'), 0, mercuryTexture, mercuryBump);
console.log("✅ Mercury created:", mercury);

const venus = new createPlanet('Venus', getRealisticPlanetSize('venus'), getScaledDistance('venus'), 3, venusTexture, venusBump, null, venusAtmosphere);
console.log("✅ Venus created:", venus);

const earth = new createPlanet('Earth', getRealisticPlanetSize('earth'), getScaledDistance('earth'), 23, earthMaterial, null, null, earthAtmosphere, earthMoon);
console.log("✅ Earth created:", earth);

const mars = new createPlanet('Mars', getRealisticPlanetSize('mars'), getScaledDistance('mars'), 25, marsTexture, marsBump);
console.log("✅ Mars created:", mars);
// Load Mars moons
marsMoons.forEach(moon => {
  loadObject(moon.modelPath, moon.position, moon.scale, function(loadedModel) {
    moon.mesh = loadedModel;
    mars.planetSystem.add(moon.mesh);
    moon.mesh.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // S'assurer que le matériau réagit à l'éclairage
        if (child.material && child.material.isMeshBasicMaterial) {
          // Convertir MeshBasicMaterial en MeshStandardMaterial pour l'éclairage
          const oldMaterial = child.material;
          child.material = new THREE.MeshStandardMaterial({
            map: oldMaterial.map,
            color: oldMaterial.color,
            transparent: oldMaterial.transparent,
            opacity: oldMaterial.opacity
          });
        }
      }
    });
  });
});

const jupiter = new createPlanet('Jupiter', getRealisticPlanetSize('jupiter'), getScaledDistance('jupiter'), 3, jupiterTexture, null, null, null, jupiterMoons);
const saturn = new createPlanet('Saturn', getRealisticPlanetSize('saturn'), getScaledDistance('saturn'), 26, saturnTexture, null, {
  innerRadius: 18, 
  outerRadius: 29, 
  texture: satRingTexture
});
const uranus = new createPlanet('Uranus', getRealisticPlanetSize('uranus'), getScaledDistance('uranus'), 82, uranusTexture, null, {
  innerRadius: 6, 
  outerRadius: 8, 
  texture: uraRingTexture
});
const neptune = new createPlanet('Neptune', getRealisticPlanetSize('neptune'), getScaledDistance('neptune'), 28, neptuneTexture);
const pluto = new createPlanet('Pluto', 1, getScaledDistance('neptune') * 1.2, 57, plutoTexture); // Pluton approximatif
console.log("✅ Pluto created:", pluto);

console.log("🎯 All planets created, setting up raycast targets...");

// SUPPRIMÉ - Code qui ne fonctionnait pas

// Array of planets, atmospheres and moons for raycasting
const raycastTargets = [];

// Add planets safely
if (mercury && mercury.planet) raycastTargets.push(mercury.planet);
if (venus && venus.planet) raycastTargets.push(venus.planet);
if (venus && venus.Atmosphere) raycastTargets.push(venus.Atmosphere);
if (earth && earth.planet) raycastTargets.push(earth.planet);
if (earth && earth.Atmosphere) raycastTargets.push(earth.Atmosphere);
if (earth && earth.moons && earth.moons[0] && earth.moons[0].mesh) raycastTargets.push(earth.moons[0].mesh);
if (mars && mars.planet) raycastTargets.push(mars.planet);
if (jupiter && jupiter.planet) raycastTargets.push(jupiter.planet);

// AJOUTER LES LUNES DE JUPITER
if (jupiter && jupiter.moons) {
    jupiter.moons.forEach(moon => {
        if (moon.mesh) {
            raycastTargets.push(moon.mesh);
            console.log("🌙 Lune de Jupiter ajoutée aux raycastTargets:", moon.mesh);
        }
    });
}
if (saturn && saturn.planet) raycastTargets.push(saturn.planet);
if (uranus && uranus.planet) raycastTargets.push(uranus.planet);
if (neptune && neptune.planet) raycastTargets.push(neptune.planet);
if (pluto && pluto.planet) raycastTargets.push(pluto.planet);

console.log("🎯 Raycast targets:", raycastTargets.length, "objects");

// ===== INITIALISATION DU SYSTÈME DE MARQUEURS =====
console.log("🎯 Initializing Planet Marker System...");
planetMarkerSystem = new PlanetMarkerSystem(scene, camera);

// Helper function pour ajouter les marqueurs aux raycastTargets
function addMarkerToRaycast(objectName) {
    const markerData = planetMarkerSystem.markers.get(objectName);
    if (markerData) {
        raycastTargets.push(markerData.ring);
        raycastTargets.push(markerData.clickArea); // Zone de clic élargie
        console.log(`✅ Marqueur ${objectName} ajouté aux raycastTargets (${markerData.type || 'planet'})`);
    } else {
        console.log(`❌ Marqueur ${objectName} non trouvé pour raycast`);
    }
}

// Créer les marqueurs pour chaque planète
if (mercury && mercury.planet) {
    planetMarkerSystem.createPlanetMarker('mercury', mercury.planet, 'Mercury');
    planetMarkerSystem.createOrbit('mercury', getScaledDistance('mercury'));
    addMarkerToRaycast('mercury');
}
if (venus && venus.planet) {
    planetMarkerSystem.createPlanetMarker('venus', venus.planet, 'Venus');
    planetMarkerSystem.createOrbit('venus', getScaledDistance('venus'));
    addMarkerToRaycast('venus');
}
if (earth && earth.planet) {
    planetMarkerSystem.createPlanetMarker('earth', earth.planet, 'Earth');
    planetMarkerSystem.createOrbit('earth', getScaledDistance('earth'));
    addMarkerToRaycast('earth');
}
if (mars && mars.planet) {
    planetMarkerSystem.createPlanetMarker('mars', mars.planet, 'Mars');
    planetMarkerSystem.createOrbit('mars', getScaledDistance('mars'));
    addMarkerToRaycast('mars');
}
if (jupiter && jupiter.planet) {
    planetMarkerSystem.createPlanetMarker('jupiter', jupiter.planet, 'Jupiter');
    planetMarkerSystem.createOrbit('jupiter', getScaledDistance('jupiter'));
    addMarkerToRaycast('jupiter');
}
if (saturn && saturn.planet) {
    planetMarkerSystem.createPlanetMarker('saturn', saturn.planet, 'Saturn');
    planetMarkerSystem.createOrbit('saturn', getScaledDistance('saturn'));
    addMarkerToRaycast('saturn');
}
if (uranus && uranus.planet) {
    planetMarkerSystem.createPlanetMarker('uranus', uranus.planet, 'Uranus');
    planetMarkerSystem.createOrbit('uranus', getScaledDistance('uranus'));
    addMarkerToRaycast('uranus');
}
if (neptune && neptune.planet) {
    planetMarkerSystem.createPlanetMarker('neptune', neptune.planet, 'Neptune');
    planetMarkerSystem.createOrbit('neptune', getScaledDistance('neptune'));
    addMarkerToRaycast('neptune');
}
if (pluto && pluto.planet) {
    planetMarkerSystem.createPlanetMarker('pluto', pluto.planet, 'Pluto');
    planetMarkerSystem.createOrbit('pluto', getScaledDistance('neptune') * 1.2);
    addMarkerToRaycast('pluto');
}

// Créer les marqueurs pour les LUNES
// Lune de la Terre
if (earth && earth.moons && earth.moons[0]) {
    planetMarkerSystem.createMoonMarker('moon', earth.moons[0].mesh, earth.planet, 'Moon');
    addMarkerToRaycast('moon');
}

// Lunes de Jupiter
if (jupiter && jupiter.moons) {
    const jupiterMoonNames = ['io', 'europa', 'ganymede', 'callisto'];
    const jupiterMoonDisplayNames = ['Io', 'Europa', 'Ganymède', 'Callisto'];
    
    jupiter.moons.forEach((moon, index) => {
        if (moon.mesh && index < jupiterMoonNames.length) {
            const moonName = jupiterMoonNames[index];
            const displayName = jupiterMoonDisplayNames[index];
            planetMarkerSystem.createMoonMarker(moonName, moon.mesh, jupiter.planet, displayName);
            addMarkerToRaycast(moonName);
        }
    });
}

console.log("✅ Planet Marker System initialized with moons");

  // ******  PLANETS DATA  ******
  const planetData = {
    'Mercury': {
        radius: '2,439.7 km',
        tilt: '0.034°',
        rotation: '58.6 Earth days',
        orbit: '88 Earth days',
        distance: '57.9 million km',
        moons: '0',
        info: 'The smallest planet in our solar system and nearest to the Sun.'
    },
    'Venus': {
        radius: '6,051.8 km',
        tilt: '177.4°',
        rotation: '243 Earth days',
        orbit: '225 Earth days',
        distance: '108.2 million km',
        moons: '0',
        info: 'Second planet from the Sun, known for its extreme temperatures and thick atmosphere.'
    },
    'Earth': {
        radius: '6,371 km',
        tilt: '23.5°',
        rotation: '24 hours',
        orbit: '365 days',
        distance: '150 million km',
        moons: '1 (Moon)',
        info: 'Third planet from the Sun and the only known planet to harbor life.'
    },
    'Mars': {
        radius: '3,389.5 km',
        tilt: '25.19°',
        rotation: '1.03 Earth days',
        orbit: '687 Earth days',
        distance: '227.9 million km',
        moons: '2 (Phobos and Deimos)',
        info: 'Known as the Red Planet, famous for its reddish appearance and potential for human colonization.'
    },
    'Jupiter': {
        radius: '69,911 km',
        tilt: '3.13°',
        rotation: '9.9 hours',
        orbit: '12 Earth years',
        distance: '778.5 million km',
        moons: '95 known moons (Ganymede, Callisto, Europa, Io are the 4 largest)',
        info: 'The largest planet in our solar system, known for its Great Red Spot.'
    },
    'Saturn': {
        radius: '58,232 km',
        tilt: '26.73°',
        rotation: '10.7 hours',
        orbit: '29.5 Earth years',
        distance: '1.4 billion km',
        moons: '146 known moons',
        info: 'Distinguished by its extensive ring system, the second-largest planet in our solar system.'
    },
    'Uranus': {
        radius: '25,362 km',
        tilt: '97.77°',
        rotation: '17.2 hours',
        orbit: '84 Earth years',
        distance: '2.9 billion km',
        moons: '27 known moons',
        info: 'Known for its unique sideways rotation and pale blue color.'
    },
    'Neptune': {
        radius: '24,622 km',
        tilt: '28.32°',
        rotation: '16.1 hours',
        orbit: '165 Earth years',
        distance: '4.5 billion km',
        moons: '14 known moons',
        info: 'The most distant planet from the Sun in our solar system, known for its deep blue color.'
    },
    'Pluto': {
        radius: '1,188.3 km',
        tilt: '122.53°',
        rotation: '6.4 Earth days',
        orbit: '248 Earth years',
        distance: '5.9 billion km',
        moons: '5 (Charon, Styx, Nix, Kerberos, Hydra)',
        info: 'Originally classified as the ninth planet, Pluto is now considered a dwarf planet.'
    },
    'Lune': {
        radius: '1,737 km',
        distance: '384,400 km de la Terre',
        orbit: '27.3 jours',
        moons: '0',
        info: 'La Lune est le seul satellite naturel de la Terre. Elle influence les marées et stabilise l\'axe de rotation terrestre.'
    },
    'Io': {
        radius: '1,821.6 km',
        distance: '421,700 km de Jupiter',
        orbit: '1.77 jours',
        moons: '0',
        info: 'Lune volcanique de Jupiter, la plus active géologiquement du système solaire.'
    },
    'Europa': {
        radius: '1,560.8 km',
        distance: '671,034 km de Jupiter',
        orbit: '3.55 jours',
        moons: '0',
        info: 'Lune glacée avec un océan sous-terrain, candidate pour la vie extraterrestre.'
    },
    'Ganymède': {
        radius: '2,634.1 km',
        distance: '1,070,412 km de Jupiter',
        orbit: '7.15 jours',
        moons: '0',
        info: 'La plus grande lune du système solaire, plus grande que Mercure.'
    },
    'Callisto': {
        radius: '2,410.3 km',
        distance: '1,882,709 km de Jupiter',
        orbit: '16.69 jours',
        moons: '0',
        info: 'Lune cratérisée, la plus éloignée des quatre lunes galiléennes.'
    }
};


// Array of planets, atmospheres and moons for raycasting - MOVED AFTER PLANET CREATION

// ******  SHADOWS  ******
// Configuration du renderer et de la PointLight déjà faite au début du script

//casting and receiving shadows
earth.planet.castShadow = true;
earth.planet.receiveShadow = true;
earth.Atmosphere.castShadow = false; // Les atmosphères ne projettent pas d'ombres solides
earth.Atmosphere.receiveShadow = true;
earth.moons.forEach(moon => {
moon.mesh.castShadow = true;
moon.mesh.receiveShadow = true;
});
mercury.planet.castShadow = true;
mercury.planet.receiveShadow = true;
venus.planet.castShadow = true;
venus.planet.receiveShadow = true;
venus.Atmosphere.castShadow = false; // Les atmosphères ne projettent pas d'ombres solides
venus.Atmosphere.receiveShadow = true;
mars.planet.castShadow = true;
mars.planet.receiveShadow = true;
jupiter.planet.castShadow = true;
jupiter.planet.receiveShadow = true;
jupiter.moons.forEach(moon => {
  moon.mesh.castShadow = true;
  moon.mesh.receiveShadow = true;
  });
saturn.planet.castShadow = true;
saturn.planet.receiveShadow = true;
saturn.Ring.castShadow = true;
saturn.Ring.receiveShadow = true;
uranus.planet.castShadow = true;
uranus.planet.receiveShadow = true;
neptune.planet.castShadow = true;
neptune.planet.receiveShadow = true;
pluto.planet.castShadow = true;
pluto.planet.receiveShadow = true;

  earth.Atmosphere.rotateY(0.001 * settings.acceleration);
  earth.planet3d.rotateY(0.001 * settings.accelerationOrbit);
  mars.planet.rotateY(0.01 * settings.acceleration);
  mars.planet3d.rotateY(0.0007 * settings.accelerationOrbit);
  jupiter.planet.rotateY(0.005 * settings.acceleration);
  jupiter.planet3d.rotateY(0.0003 * settings.accelerationOrbit);
  saturn.planet.rotateY(0.01 * settings.acceleration);
  saturn.planet3d.rotateY(0.0002 * settings.accelerationOrbit);
  uranus.planet.rotateY(0.005 * settings.acceleration);
  uranus.planet3d.rotateY(0.0001 * settings.accelerationOrbit);
  neptune.planet.rotateY(0.005 * settings.acceleration);
  neptune.planet3d.rotateY(0.00008 * settings.accelerationOrbit);
  pluto.planet.rotateY(0.001 * settings.acceleration)
  pluto.planet3d.rotateY(0.00006 * settings.accelerationOrbit)

// Animate Earth's moon
if (earth.moons) {
  earth.moons.forEach(moon => {
    const time = performance.now();
    const tiltAngle = 5 * Math.PI / 180;

    const moonX = earth.planet.position.x + moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
    const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed) * Math.sin(tiltAngle);
    const moonZ = earth.planet.position.z + moon.orbitRadius * Math.sin(time * moon.orbitSpeed) * Math.cos(tiltAngle);

    moon.mesh.position.set(moonX, moonY, moonZ);
    moon.mesh.rotateY(0.01);
  });
}
// Animate Mars' moons
if (marsMoons){
marsMoons.forEach(moon => {
  if (moon.mesh) {
    const time = performance.now();

    const moonX = mars.planet.position.x + moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
    const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
    const moonZ = mars.planet.position.z + moon.orbitRadius * Math.sin(time * moon.orbitSpeed);

    moon.mesh.position.set(moonX, moonY, moonZ);
    moon.mesh.rotateY(0.001);
  }
});
}

// Animate Jupiter's moons
if (jupiter.moons) {
  jupiter.moons.forEach(moon => {
    const time = performance.now();
    const moonX = jupiter.planet.position.x + moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
    const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
    const moonZ = jupiter.planet.position.z + moon.orbitRadius * Math.sin(time * moon.orbitSpeed);

    moon.mesh.position.set(moonX, moonY, moonZ);
    moon.mesh.rotateY(0.01);
  });
}

// Rotate asteroids
asteroids.forEach(asteroid => {
  asteroid.rotation.y += 0.0001;
  asteroid.position.x = asteroid.position.x * Math.cos(0.0001 * settings.accelerationOrbit) + asteroid.position.z * Math.sin(0.0001 * settings.accelerationOrbit);
  asteroid.position.z = asteroid.position.z * Math.cos(0.0001 * settings.accelerationOrbit) - asteroid.position.x * Math.sin(0.0001 * settings.accelerationOrbit);
});

// ****** OUTLINES ON PLANETS ******
raycaster.setFromCamera(mouse, camera);

// Check for intersections
var intersects = raycaster.intersectObjects(raycastTargets);

// Reset all outlines
outlinePass.selectedObjects = [];

if (intersects.length > 0) {
  const intersectedObject = intersects[0].object;

  // If the intersected object is an atmosphere, find the corresponding planet
  if (intersectedObject === earth.Atmosphere) {
    outlinePass.selectedObjects = [earth.planet];
  } else if (intersectedObject === venus.Atmosphere) {
    outlinePass.selectedObjects = [venus.planet];
  } else {
    // For other planets, outline the intersected object itself
    outlinePass.selectedObjects = [intersectedObject];
  }
}
// ******  LOAD ASTEROIDS AVEC DISTANCES ASTRONOMIQUES RÉELLES ******
const earthDistance = getScaledDistance('earth'); // 1 UA de référence

// ===== CEINTURE PRINCIPALE D'ASTÉROÏDES (2.1 à 3.3 UA) =====
// Diviser en 4 sous-ceintures pour couvrir toute la distance
const mainBeltStart = earthDistance * 2.1;
const mainBeltEnd = earthDistance * 3.3;
const mainBeltWidth = (mainBeltEnd - mainBeltStart) / 4;

console.log(`🌌 Ceinture principale d'astéroïdes: ${mainBeltStart.toFixed(1)} - ${mainBeltEnd.toFixed(1)} unités (2.1-3.3 UA)`);

// Sous-ceinture 1 : Zone intérieure (2.1 - 2.4 UA)
loadAsteroids('/asteroids/asteroidPack.glb', 800, 
    mainBeltStart, 
    mainBeltStart + mainBeltWidth, 'main');

// Sous-ceinture 2 : Zone centrale-intérieure (2.4 - 2.7 UA)
loadAsteroids('/asteroids/asteroidPack.glb', 1000, 
    mainBeltStart + mainBeltWidth, 
    mainBeltStart + mainBeltWidth * 2, 'main');

// Sous-ceinture 3 : Zone centrale-extérieure (2.7 - 3.0 UA)
loadAsteroids('/asteroids/asteroidPack.glb', 1200, 
    mainBeltStart + mainBeltWidth * 2, 
    mainBeltStart + mainBeltWidth * 3, 'main');

// Sous-ceinture 4 : Zone extérieure (3.0 - 3.3 UA)
loadAsteroids('/asteroids/asteroidPack.glb', 800, 
    mainBeltStart + mainBeltWidth * 3, 
    mainBeltEnd, 'main');

// ===== CEINTURE DE KUIPER (30 à 50 UA) =====
// Diviser en 5 sous-ceintures pour couvrir toute la distance
const kuiperBeltStart = earthDistance * 30;
const kuiperBeltEnd = earthDistance * 50;
const kuiperBeltWidth = (kuiperBeltEnd - kuiperBeltStart) / 5;

console.log(`🌌 Ceinture de Kuiper: ${kuiperBeltStart.toFixed(1)} - ${kuiperBeltEnd.toFixed(1)} unités (30-50 UA)`);

// Sous-ceinture Kuiper 1 : Zone intérieure (30 - 34 UA)
loadAsteroids('/asteroids/asteroidPack.glb', 600, 
    kuiperBeltStart, 
    kuiperBeltStart + kuiperBeltWidth, 'kuiper');

// Sous-ceinture Kuiper 2 : Zone centrale-intérieure (34 - 38 UA)
loadAsteroids('/asteroids/asteroidPack.glb', 800, 
    kuiperBeltStart + kuiperBeltWidth, 
    kuiperBeltStart + kuiperBeltWidth * 2, 'kuiper');

// Sous-ceinture Kuiper 3 : Zone centrale (38 - 42 UA) - Plus dense
loadAsteroids('/asteroids/asteroidPack.glb', 1000, 
    kuiperBeltStart + kuiperBeltWidth * 2, 
    kuiperBeltStart + kuiperBeltWidth * 3, 'kuiper');

// Sous-ceinture Kuiper 4 : Zone centrale-extérieure (42 - 46 UA)
loadAsteroids('/asteroids/asteroidPack.glb', 800, 
    kuiperBeltStart + kuiperBeltWidth * 3, 
    kuiperBeltStart + kuiperBeltWidth * 4, 'kuiper');

// Sous-ceinture Kuiper 5 : Zone extérieure (46 - 50 UA)
loadAsteroids('/asteroids/asteroidPack.glb', 600, 
    kuiperBeltStart + kuiperBeltWidth * 4, 
    kuiperBeltEnd, 'kuiper');

// ===== FONCTION D'ANIMATION PRINCIPALE =====
function animate() {
  // Log pour debug (seulement les 10 premières fois)
  if (animate.callCount === undefined) animate.callCount = 0;
  if (animate.callCount < 10) {
    console.log("🎬 Animation frame:", animate.callCount);
    animate.callCount++;
  }
  
  // Rotation du soleil
  sun.rotation.y += 0.005 * settings.acceleration;

  // Rotation des planètes
  mercury.planet.rotateY(0.01 * settings.acceleration);
  mercury.planet3d.rotateY(0.002 * settings.accelerationOrbit);
  venus.planet.rotateY(0.005 * settings.acceleration);
  venus.planet3d.rotateY(0.0015 * settings.accelerationOrbit);
  earth.planet.rotateY(0.01 * settings.acceleration);
  earth.Atmosphere.rotateY(0.001 * settings.acceleration);
  earth.planet3d.rotateY(0.001 * settings.accelerationOrbit);
  mars.planet.rotateY(0.01 * settings.acceleration);
  mars.planet3d.rotateY(0.0007 * settings.accelerationOrbit);
  jupiter.planet.rotateY(0.005 * settings.acceleration);
  jupiter.planet3d.rotateY(0.0003 * settings.accelerationOrbit);
  saturn.planet.rotateY(0.01 * settings.acceleration);
  saturn.planet3d.rotateY(0.0002 * settings.accelerationOrbit);
  uranus.planet.rotateY(0.005 * settings.acceleration);
  uranus.planet3d.rotateY(0.0001 * settings.accelerationOrbit);
  neptune.planet.rotateY(0.005 * settings.acceleration);
  neptune.planet3d.rotateY(0.00008 * settings.accelerationOrbit);
  pluto.planet.rotateY(0.001 * settings.acceleration);
  pluto.planet3d.rotateY(0.00006 * settings.accelerationOrbit);

  // Animation des lunes de la Terre
  if (earth.moons) {
    earth.moons.forEach(moon => {
      const time = performance.now();
      const tiltAngle = 5 * Math.PI / 180;

      const moonX = earth.planet.position.x + moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
      const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed) * Math.sin(tiltAngle);
      const moonZ = earth.planet.position.z + moon.orbitRadius * Math.sin(time * moon.orbitSpeed) * Math.cos(tiltAngle);

      moon.mesh.position.set(moonX, moonY, moonZ);
      moon.mesh.rotateY(0.01);
    });
  }

  // Animation des lunes de Mars
  if (marsMoons) {
    marsMoons.forEach(moon => {
      if (moon.mesh) {
        const time = performance.now();
        const moonX = mars.planet.position.x + moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
        const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
        const moonZ = mars.planet.position.z + moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
        moon.mesh.position.set(moonX, moonY, moonZ);
        moon.mesh.rotateY(0.001);
      }
    });
  }

  // Animation des lunes de Jupiter
  if (jupiter.moons) {
    jupiter.moons.forEach(moon => {
      const time = performance.now();
      const moonX = jupiter.planet.position.x + moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
      const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
      const moonZ = jupiter.planet.position.z + moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
      moon.mesh.position.set(moonX, moonY, moonZ);
      moon.mesh.rotateY(0.01);
    });
  }

  // Animation des astéroïdes
  asteroids.forEach(asteroid => {
    asteroid.rotation.y += 0.0001;
    asteroid.position.x = asteroid.position.x * Math.cos(0.0001 * settings.accelerationOrbit) + asteroid.position.z * Math.sin(0.0001 * settings.accelerationOrbit);
    asteroid.position.z = asteroid.position.z * Math.cos(0.0001 * settings.accelerationOrbit) - asteroid.position.x * Math.sin(0.0001 * settings.accelerationOrbit);
  });

  // Outlines sur les planètes
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(raycastTargets);
  outlinePass.selectedObjects = [];

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;
    if (intersectedObject === earth.Atmosphere) {
      outlinePass.selectedObjects = [earth.planet];
    } else if (intersectedObject === venus.Atmosphere) {
      outlinePass.selectedObjects = [venus.planet];
    } else {
      outlinePass.selectedObjects = [intersectedObject];
    }
  }

  // Suivre la planète sélectionnée - CAMÉRA EN ORBITE AUTOUR DE LA PLANÈTE
  if (followedPlanet) {
    const newPlanetPosition = new THREE.Vector3();
    followedPlanet.getWorldPosition(newPlanetPosition);
    
    // Calculer le déplacement de la planète depuis la dernière frame
    const planetMovement = newPlanetPosition.clone().sub(controls.target);
    
    // Déplacer la caméra ET le target avec la planète
    camera.position.add(planetMovement);
    controls.target.copy(newPlanetPosition);
    
    // Les contrôles OrbitControls gèrent maintenant la rotation/zoom autour de la planète
    // La planète ne peut plus "s'échapper" car on déplace tout le système de référence
  }
  
  controls.update();
  updateCoordinates(); // Update HUD coordinates
  updateScaleDisplay(); // Update scale and distance display
  
  // Mettre à jour le système de marqueurs
  if (planetMarkerSystem) {
    planetMarkerSystem.update();
  }
  
  // Fonctions supprimées
  requestAnimationFrame(animate);
  composer.render();
}

// Initialize HUD after everything is loaded
initializeHUD();

animate();

// Gestionnaire pour la molette de la souris (zoom) - Laisse OrbitControls gérer
function onMouseWheel(event) {
  // OrbitControls gère automatiquement le zoom
  // Pas besoin d'intervention manuelle
}

// Attacher les événements directement au window pour plus de fiabilité
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onDocumentMouseDown, false);
window.addEventListener('wheel', onMouseWheel, false);
console.log("✅ Mouse events attached to window");

// Ajouter des raccourcis clavier pour la navigation
document.addEventListener('keydown', (event) => {
    switch(event.key.toLowerCase()) {
        case 'r': // Reset vue
            followedPlanet = null; // Arrêter le suivi
            camera.position.set(-175, 115, 5);
            controls.target.set(0, 0, 0);
            controls.update();
            console.log("🔄 Vue réinitialisée");
            break;
        case 'h': // Home - vue d'ensemble
            followedPlanet = null; // Arrêter le suivi
            animateCameraTo(new THREE.Vector3(-175, 115, 5), new THREE.Vector3(0, 0, 0));
            console.log("🏠 Retour à la vue d'ensemble");
            break;
        case 'escape': // Fermer tooltip
            closeInfo();
            break;
        case '1': zoomToPlanet('mercury'); break;
        case '2': zoomToPlanet('venus'); break;
        case '3': zoomToPlanet('earth'); break;
        case '4': zoomToPlanet('mars'); break;
        case '5': zoomToPlanet('jupiter'); break;
        case '6': zoomToPlanet('saturn'); break;
        case '7': zoomToPlanet('uranus'); break;
        case '8': zoomToPlanet('neptune'); break;
        case '9': zoomToPlanet('pluto'); break;
    }
});

console.log("✅ Keyboard shortcuts configured:");
window.addEventListener('resize', function(){
  const canvasContainer = document.getElementById('canvas-container');
  if (canvasContainer) {
    const containerRect = canvasContainer.getBoundingClientRect();
    camera.aspect = containerRect.width / containerRect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(containerRect.width, containerRect.height);
    composer.setSize(containerRect.width, containerRect.height);
  } else {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
    composer.setSize(window.innerWidth,window.innerHeight);
  }
});
