import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import PlanetMarkerSystem from './js/planet-markers.js';
import { RouteHandler } from './js/utils/RouteHandler.js';
import { ExoplanetGenerator } from './js/generators/ExoplanetGenerator.js';
import { ExoplanetSceneManager } from './js/generators/ExoplanetSceneManager.js';
import { loadingSystem } from './js/ui/LoadingSystem.js';

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

// Fonction pour mettre à jour l'intensité du soleil
// ✅ FONCTIONS DE CONTRÔLE D'INTENSITÉ DU SOLEIL SUPPRIMÉES
// L'intensité du soleil est maintenant fixée à une valeur optimale (150)

// Créer la sidebar pour les systèmes Kepler
function createKeplerSidebar() {
  const panel = document.querySelector('#settings-panel .settings-body');
  if (!panel) return;
  
  // Vider la sidebar
  panel.innerHTML = '';
  
  // Ajouter le bouton de retour au système solaire
  const navigationGroup = document.createElement('div');
  navigationGroup.className = 'setting-group';
  navigationGroup.innerHTML = `
    <label class="setting-label">NAVIGATION</label>
    <div class="kepler-controls" style="margin-top: 10px;">
      <button id="kepler-follow-button" class="kepler-follow-btn" style="
        width: 100%;
        padding: 12px 16px;
        background: linear-gradient(135deg, #FF9800, #F57C00);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      ">
        <span style="font-size: 16px;">🌍</span>
        <span>Revenir au système solaire</span>
      </button>
    </div>
  `;
  panel.appendChild(navigationGroup);
  
  // Ajouter KOI Data Explorer
  const koiGroup = document.createElement('div');
  koiGroup.className = 'setting-group';
  koiGroup.innerHTML = `
    <label class="setting-label">EXPLORATION DES DONNÉES</label>
    <div class="koi-controls" style="margin-top: 10px;">
      <button id="koi-data-explorer-button" class="koi-data-explorer-btn" style="
        width: 100%;
        padding: 12px 16px;
        background: linear-gradient(135deg, #9C27B0, #7B1FA2);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(156, 39, 176, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      ">
        <span style="font-size: 16px;">🔬</span>
        <span>KOI Data Explorer</span>
      </button>
    </div>
  `;
  panel.appendChild(koiGroup);
  
  // Ajouter les event listeners
  setupKeplerSidebarEvents();
}

// Créer la sidebar pour le système solaire
function createSolarSystemSidebar() {
  const panel = document.querySelector('#settings-panel .settings-body');
  if (!panel) return;
  
  // Vider la sidebar
  panel.innerHTML = '';
  
  // Ajouter le bouton Kepler
  const keplerGroup = document.createElement('div');
  keplerGroup.className = 'setting-group';
  keplerGroup.innerHTML = `
    <label class="setting-label">SATELLITE KEPLER</label>
    <div class="kepler-controls" style="margin-top: 10px;">
      <button id="kepler-follow-button" class="kepler-follow-btn" style="
        width: 100%;
        padding: 12px 16px;
        background: linear-gradient(135deg, #2196F3, #1976D2);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      ">
        <span style="font-size: 16px;">🛰️</span>
        <span>Suivre le satellite Kepler</span>
      </button>
    </div>
  `;
  panel.appendChild(keplerGroup);
  
  // Ajouter KOI Data Explorer
  const koiGroup = document.createElement('div');
  koiGroup.className = 'setting-group';
  koiGroup.innerHTML = `
    <label class="setting-label">EXPLORATION DES DONNÉES</label>
    <div class="koi-controls" style="margin-top: 10px;">
      <button id="koi-data-explorer-button" class="koi-data-explorer-btn" style="
        width: 100%;
        padding: 12px 16px;
        background: linear-gradient(135deg, #9C27B0, #7B1FA2);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(156, 39, 176, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      ">
        <span style="font-size: 16px;">🔬</span>
        <span>KOI Data Explorer</span>
      </button>
    </div>
  `;
  panel.appendChild(koiGroup);
  
  // Ajouter la section ASTRE
  const astreGroup = document.createElement('div');
  astreGroup.className = 'setting-group';
  astreGroup.innerHTML = `
    <label class="setting-label">ASTRE</label>
    <div class="setting-toggles">
      <button class="setting-toggle-btn" id="astre-search-btn">RECHERCHER UN ASTRE</button>
    </div>
  `;
  panel.appendChild(astreGroup);
  
  // Ajouter les event listeners
  setupSolarSystemSidebarEvents();
}

// Event listeners pour la sidebar Kepler
function setupKeplerSidebarEvents() {
  const followButton = document.getElementById('kepler-follow-button');
  if (followButton) {
    followButton.addEventListener('click', () => {
      console.log('🌍 Retour au système solaire demandé');
      
      // Utiliser la même fonction que Ctrl+K
      if (window.solarSystemScript && window.solarSystemScript.routeHandler) {
        window.solarSystemScript.routeHandler.navigateToSolarSystem();
        
        // Actualiser la page après un court délai (comme Ctrl+K)
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  }
  
  const koiButton = document.getElementById('koi-data-explorer-button');
  if (koiButton) {
    koiButton.addEventListener('click', () => {
      window.open('https://koi-data-explorer.vercel.app', '_blank');
    });
  }
}

// Event listeners pour la sidebar système solaire
function setupSolarSystemSidebarEvents() {
  const followButton = document.getElementById('kepler-follow-button');
  if (followButton) {
    followButton.addEventListener('click', () => {
      console.log('🛰️ Suivi de Kepler activé');
      centerOnPlanet('kepler', 'satellite');
    });
  }
  
  const koiButton = document.getElementById('koi-data-explorer-button');
  if (koiButton) {
    koiButton.addEventListener('click', () => {
      window.open('https://koi-data-explorer.vercel.app', '_blank');
    });
  }
  
  const astreButton = document.getElementById('astre-search-btn');
  if (astreButton) {
    // Ajouter la logique de recherche d'astre ici
    console.log('Bouton ASTRE configuré');
  }
}

// Fonction principale pour mettre à jour la sidebar
function updateSidebar() {
  const isInKeplerSystem = window.currentExoplanets && window.currentExoplanets.length > 0;
  
  if (isInKeplerSystem) {
    createKeplerSidebar();
    console.log('✅ Sidebar Kepler créée');
  } else {
    createSolarSystemSidebar();
    console.log('✅ Sidebar système solaire créée');
  }
}

// Exposer la fonction globalement pour le bouton hamburger
window.updateSidebar = updateSidebar;

// ANCIENNE FONCTION - maintenant remplacée par updateSidebar()
function addKeplerFollowButton() {
  const panel = document.querySelector('#settings-panel .settings-body');
  if (!panel) {
    console.error('❌ Panel .settings-body non trouvé pour le bouton de navigation');
    return;
  }
  
  // Détecter si on est dans un système Kepler
  const isInKeplerSystem = window.currentExoplanets && window.currentExoplanets.length > 0;
  
  // Supprimer le bouton existant s'il y en a un
  const existingGroup = document.getElementById('kepler-follow-control');
  if (existingGroup) {
    existingGroup.remove();
  }

  const group = document.createElement('div');
  group.className = 'setting-group';
  group.id = 'kepler-follow-control';
  
  if (isInKeplerSystem) {
    // Mode Kepler : bouton pour revenir au système solaire
    group.innerHTML = `
      <label class="setting-label">NAVIGATION</label>
      <div class="kepler-controls" style="margin-top: 10px;">
        <button id="kepler-follow-button" class="kepler-follow-btn" style="
          width: 100%;
          padding: 12px 16px;
          background: linear-gradient(135deg, #FF9800, #F57C00);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        ">
          <span style="font-size: 16px;">🌍</span>
          <span>Revenir au système solaire</span>
        </button>
      </div>
    `;
    console.log('✅ Bouton "Revenir au système solaire" ajouté au DOM');
  } else {
    // Mode système solaire : bouton pour suivre Kepler
    group.innerHTML = `
      <label class="setting-label">SATELLITE KEPLER</label>
      <div class="kepler-controls" style="margin-top: 10px;">
        <button id="kepler-follow-button" class="kepler-follow-btn" style="
          width: 100%;
          padding: 12px 16px;
          background: linear-gradient(135deg, #2196F3, #1976D2);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        ">
          <span style="font-size: 16px;">🛰️</span>
          <span>Suivre le satellite Kepler</span>
        </button>
      </div>
    `;
    console.log('✅ Bouton "Suivre le satellite Kepler" ajouté au DOM');
  }
  
  panel.appendChild(group);

  const followButton = document.getElementById('kepler-follow-button');
  if (followButton) {
    // Effet hover adaptatif
    const hoverColor = isInKeplerSystem ? 'rgba(255, 152, 0, 0.4)' : 'rgba(33, 150, 243, 0.4)';
    const normalColor = isInKeplerSystem ? 'rgba(255, 152, 0, 0.3)' : 'rgba(33, 150, 243, 0.3)';
    
    followButton.addEventListener('mouseenter', () => {
      followButton.style.transform = 'translateY(-2px)';
      followButton.style.boxShadow = `0 4px 12px ${hoverColor}`;
    });
    
    followButton.addEventListener('mouseleave', () => {
      followButton.style.transform = 'translateY(0)';
      followButton.style.boxShadow = `0 2px 8px ${normalColor}`;
    });
    
    // Action selon le mode
    followButton.addEventListener('click', () => {
      if (isInKeplerSystem) {
        // Retour au système solaire
        console.log('🌍 Retour au système solaire demandé');
        
        // Feedback visuel
        followButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        followButton.innerHTML = `
          <span style="font-size: 16px;">✅</span>
          <span>Retour en cours...</span>
        `;
        
        // Appeler la fonction de retour
        setTimeout(() => {
          if (window.solarSystemScript && window.solarSystemScript.routeHandler) {
            window.solarSystemScript.routeHandler.navigateToSolarSystem();
          } else {
            console.warn('⚠️ RouteHandler non disponible, rechargement de la page');
            window.location.href = '/';
          }
        }, 500);
        
      } else {
        // Suivi de Kepler (mode original)
        console.log('🛰️ Suivi de Kepler activé');
        
        // Centrer sur Kepler
        centerOnPlanet('kepler', 'satellite');
        
        // Afficher les informations de Kepler
        showPlanetInfo('Kepler', 'satellite');
        
        // Feedback visuel
        followButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        followButton.innerHTML = `
          <span style="font-size: 16px;">✅</span>
          <span>Kepler suivi</span>
        `;
        
        // Remettre le bouton normal après 2 secondes
        setTimeout(() => {
          followButton.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
          followButton.innerHTML = `
            <span style="font-size: 16px;">🛰️</span>
            <span>Suivre le satellite Kepler</span>
          `;
        }, 2000);
      }
    });
    
    console.log(`✅ Événements du bouton ${isInKeplerSystem ? 'retour système solaire' : 'suivi Kepler'} configurés`);
  }
}

// Ajouter le bouton KOI Data Explorer dans la sidebar
function addKOIDataExplorerButton() {
  console.log('🔬 Ajout du bouton KOI Data Explorer');
  const panel = document.querySelector('#settings-panel .settings-body');
  if (!panel) {
    console.error('❌ Panel .settings-body non trouvé pour le bouton KOI Data Explorer');
    return;
  }
  
  // Ne pas masquer KOI Data Explorer - vous ne l'avez pas demandé
  
  // Vérifier si le bouton existe déjà
  if (document.getElementById('koi-data-explorer-button')) {
    console.log('🔬 Bouton KOI Data Explorer déjà présent');
    return;
  }

  const group = document.createElement('div');
  group.className = 'setting-group';
  group.id = 'koi-data-explorer-control';
  group.innerHTML = `
    <label class="setting-label"> EXPLORATION DES DONNÉES</label>
    <div class="koi-controls" style="margin-top: 10px;">
      <button id="koi-data-explorer-button" class="koi-data-explorer-btn" style="
        width: 100%;
        padding: 12px 16px;
        background: linear-gradient(135deg, #9C27B0, #7B1FA2);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(156, 39, 176, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      ">
        <span style="font-size: 16px;">🔬</span>
        <span>KOI Data Explorer</span>
      </button>
    </div>
  `;
  panel.appendChild(group);
  console.log('✅ Bouton KOI Data Explorer ajouté au DOM');

  const explorerButton = document.getElementById('koi-data-explorer-button');
  if (explorerButton) {
    // Effet hover
    explorerButton.addEventListener('mouseenter', () => {
      explorerButton.style.transform = 'translateY(-2px)';
      explorerButton.style.boxShadow = '0 4px 12px rgba(156, 39, 176, 0.4)';
    });
    
    explorerButton.addEventListener('mouseleave', () => {
      explorerButton.style.transform = 'translateY(0)';
      explorerButton.style.boxShadow = '0 2px 8px rgba(156, 39, 176, 0.3)';
    });
    
    // Action d'ouverture
    explorerButton.addEventListener('click', () => {
      console.log('🔬 Ouverture de KOI Data Explorer');
      
      // Ouvrir le lien dans un nouvel onglet
      window.open('https://koi-data-explorer.vercel.app', '_blank');
      
      // Feedback visuel
      explorerButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
      explorerButton.innerHTML = `
        <span style="font-size: 16px;">✅</span>
        <span>Ouvert dans un nouvel onglet</span>
      `;
      
      // Remettre le bouton normal après 2 secondes
      setTimeout(() => {
        explorerButton.style.background = 'linear-gradient(135deg, #9C27B0, #7B1FA2)';
        explorerButton.innerHTML = `
          <span style="font-size: 16px;">🔬</span>
          <span>KOI Data Explorer</span>
        `;
      }, 2000);
    });
    
    console.log('✅ Événements du bouton KOI Data Explorer configurés');
  }
}

// Hide the AFFICHAGE toggle group (Orbits/Labels/Lunes)
function hideDisplayToggles() {
  const orbitsBtn = document.getElementById('show-orbits-btn');
  const labelsBtn = document.getElementById('show-labels');
  const moonsBtn = document.getElementById('show-moons');
  const any = orbitsBtn || labelsBtn || moonsBtn;
  if (any) {
    const group = any.closest('.setting-group');
    if (group) group.style.display = 'none';
    if (orbitsBtn) orbitsBtn.style.display = 'none';
    if (labelsBtn) labelsBtn.style.display = 'none';
    if (moonsBtn) moonsBtn.style.display = 'none';
  }
}

// Add an "ASTRE" section in the sidebar that opens a popup to search and center on an object
function ensureAstreSearchControl() {
  const panel = document.querySelector('#settings-panel .settings-body');
  if (!panel) return;
  
  // Vérifier si on est dans un système Kepler - si oui, cacher/retirer le contrôle
  const isInKeplerSystem = window.currentExoplanets && window.currentExoplanets.length > 0;
  
  const existingControl = document.getElementById('astre-search-btn')?.closest('.setting-group');
  
  if (isInKeplerSystem) {
    // Dans un système Kepler : supprimer complètement le contrôle
    if (existingControl) {
      existingControl.remove();
      console.log('🙈 Contrôle ASTRE supprimé (système Kepler actif)');
    }
    return;
  } else {
    // Dans le système solaire : afficher le contrôle
    if (existingControl) {
      existingControl.style.display = 'block';
      console.log('👁️ Contrôle ASTRE affiché (système solaire actif)');
      return;
    }
  }
  
  if (document.getElementById('astre-search-btn')) return; // already added

  const group = document.createElement('div');
  group.className = 'setting-group';
  group.innerHTML = `
    <label class="setting-label"> ASTRE</label>
    <div class="setting-toggles">
      <button class="setting-toggle-btn" id="astre-search-btn">RECHERCHER UN ASTRE</button>
    </div>
  `;
  panel.appendChild(group);

  // Create modal only once
  if (!document.getElementById('astre-modal')) {
    const modal = document.createElement('div');
    modal.id = 'astre-modal';
    Object.assign(modal.style, {
      position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)', display: 'none', alignItems: 'center', justifyContent: 'center', zIndex: '100002'
    });
    modal.innerHTML = `
      <div id="astre-modal-card" style="min-width: 340px; max-width: 520px; background: linear-gradient(145deg, rgba(0, 20, 40, 0.98) 0%, rgba(0, 40, 80, 0.95) 100%); border:1px solid #00ffff; border-radius:12px; padding:16px; box-shadow: 0 0 25px rgba(0,255,255,0.35);">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
          <div style="font-family:'Rajdhani',sans-serif; font-weight:700; color:#00ffff;">Rechercher un astre</div>
          <button id="astre-modal-close" title="Fermer" style="margin-left:auto; width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border:1px solid rgba(0,255,255,0.3); background:rgba(0,128,255,0.08); color:#00ffff; border-radius:6px; cursor:pointer;">×</button>
        </div>
        <input id="astre-search-input" type="text" placeholder="Nom d'astre (ex: Mars, Phobos, Venus, Soleil)" style="width:100%; padding:10px 12px; border-radius:8px; border:1px solid rgba(0,255,255,0.3); background:rgba(0,20,40,0.6); color:#00ffff; outline:none;" />
        <div id="astre-search-results" style="margin-top:10px; max-height:260px; overflow:auto;"></div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeModal = () => { modal.style.display = 'none'; };
    modal.addEventListener('click', (e) => { if (e.target.id === 'astre-modal') closeModal(); });
    modal.querySelector('#astre-modal-close').addEventListener('click', closeModal);

    const buildCandidates = () => {
      const items = [];
      items.push({name:'Soleil', key:'sun', type:'sun'});
      const planets = [
        {name:'Mercury', key:'mercury'}, {name:'Venus', key:'venus'}, {name:'Earth', key:'earth'},
        {name:'Mars', key:'mars'}, {name:'Jupiter', key:'jupiter'}, {name:'Saturn', key:'saturn'},
        {name:'Uranus', key:'uranus'}, {name:'Neptune', key:'neptune'}, {name:'Pluto', key:'pluto'}
      ];
      planets.forEach(p=>items.push({name:p.name, key:p.key, type:'planet'}));
      if (earth?.moons?.[0]?.mesh) items.push({name:'Lune', key:'moon', type:'moon'});
      // Earth satellites (now handled as moons)
      if (earth?.moons) {
        earth.moons.forEach((moon, i) => {
          if (moon.name && moon.name !== 'moon') {
            items.push({name:moon.name, key:moon.name.toLowerCase(), type:'satellite'});
          }
        });
      }
      
      // Earth artificial satellites
      if (Array.isArray(earthSatellites)) {
        earthSatellites.forEach(satellite => {
          if (satellite?.name) {
            items.push({name:satellite.name, key:satellite.name.toLowerCase(), type:'satellite'});
          }
        });
      }
      if (jupiter?.moons?.length) {
        const jNames = ['Io','Europa','Ganymède','Callisto'];
        jNames.forEach((n,i)=>{ if (jupiter.moons[i]?.mesh) items.push({name:n, key:n.toLowerCase(), type:'moon'}); });
      }
      if (Array.isArray(marsMoons)) {
        marsMoons.forEach(m=>{ if (m?.name) items.push({name:m.name, key:(m.name||'').toLowerCase(), type:'moon'}); });
      }
      return items;
    };

    const resultsEl = modal.querySelector('#astre-search-results');
    const inputEl = modal.querySelector('#astre-search-input');

    const renderResults = (q) => {
      const query = (q||'').toLowerCase().trim();
      const list = buildCandidates().filter(it => it.name.toLowerCase().includes(query));
      if (!list.length) {
        resultsEl.innerHTML = `<div style="padding:10px; color:#80c0ff; font-family:'Rajdhani',sans-serif;">Aucun résultat</div>`;
        return;
      }
      resultsEl.innerHTML = list.map(it => `
        <div class="astre-result" data-key="${it.key}" data-type="${it.type}" data-name="${it.name}"
             style="padding:10px 12px; margin-bottom:6px; background:rgba(0,255,255,0.05); border-left:2px solid rgba(0,255,255,0.3); border-radius:6px; cursor:pointer;">
          <div style="font-weight:700; color:#00ffff; font-family:'Rajdhani',sans-serif;">${it.name}</div>
          <div style="font-size:0.8rem; color:#0080ff; font-family:'Rajdhani',sans-serif; text-transform:uppercase;">${it.type}</div>
        </div>
      `).join('');
      resultsEl.querySelectorAll('.astre-result').forEach(el => {
        el.addEventListener('click', () => {
          const name = el.getAttribute('data-name');
          const type = el.getAttribute('data-type');
          const objType = type === 'sun' ? 'sun' : (type || 'planet');
          centerOnPlanet(objType === 'sun' ? 'sun' : name, objType);
          // Update info card content
          try { showPlanetInfo(name, objType); } catch (e) { console.warn('showPlanetInfo failed', e); }
          setScaleCardTitle(name);
          modal.style.display = 'none';
        });
      });
    };

    inputEl.addEventListener('input', (e)=> renderResults(e.target.value));
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const first = resultsEl.querySelector('.astre-result');
        if (first) first.click();
      }
    });

    renderResults('');

    ensureAstreSearchControl.openModal = () => {
      modal.style.display = 'flex';
      setTimeout(() => inputEl?.focus(), 0);
      renderResults(inputEl.value);
    };
  }

  const openBtn = group.querySelector('#astre-search-btn');
  openBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); ensureAstreSearchControl.openModal && ensureAstreSearchControl.openModal(); });
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

    // Sidebar: force click-toggle with hamburger (auto-initialized by sidebar-toggle.js)

    // Settings sliders
    const orbitSpeedSetting = document.getElementById('orbit-speed-setting');
    const rotationSpeedSetting = document.getElementById('rotation-speed-setting');
    const animationSpeedSetting = document.getElementById('animation-speed-setting');

    if (orbitSpeedSetting) {
        console.log('🎚️ Slider VITESSE ORBITALE trouvé:', orbitSpeedSetting);
        console.log('🎚️ Style du slider:', window.getComputedStyle(orbitSpeedSetting).display);
        console.log('🎚️ Pointer events:', window.getComputedStyle(orbitSpeedSetting).pointerEvents);
        
        // Range: 0.1x to 5x with 0.1 step
        orbitSpeedSetting.min = '0.1';
        orbitSpeedSetting.max = '5';
        orbitSpeedSetting.step = '0.1';
        // Load persisted value
        let initial = '1.0';
        try {
            const saved = localStorage.getItem('orbitSpeed');
            if (saved) initial = saved;
        } catch {}
        if (!orbitSpeedSetting.dataset.init) {
            orbitSpeedSetting.value = initial;
            const orbitVal = document.getElementById('orbit-speed-value');
            if (orbitVal) orbitVal.textContent = Number(initial).toFixed(1) + 'x';
            settings.accelerationOrbit = parseFloat(initial);
            orbitSpeedSetting.dataset.init = '1';
        }
        // Test de tous les événements possibles
        ['input', 'change', 'mousedown', 'click'].forEach(eventType => {
            orbitSpeedSetting.addEventListener(eventType, (e) => {
                console.log(`🎚️ Événement ${eventType} détecté sur slider vitesse orbitale`);
                if (eventType === 'input' || eventType === 'change') {
                    const v = parseFloat(e.target.value);
                    settings.accelerationOrbit = v;
                    const orbitVal = document.getElementById('orbit-speed-value');
                    if (orbitVal) orbitVal.textContent = Number(v).toFixed(1) + 'x';
                    console.log('🚀 Vitesse orbitale changée:', v, 'settings.accelerationOrbit:', settings.accelerationOrbit);
                    try { localStorage.setItem('orbitSpeed', String(v)); } catch {}
                }
            });
        });
    }

    // Hide orbit speed control from sidebar
    if (orbitSpeedSetting) {
        const grp = orbitSpeedSetting.closest('.setting-group');
        if (grp) grp.style.display = 'none';
    }

    // Hide rotation speed control from sidebar
    if (rotationSpeedSetting) {
        const grp = rotationSpeedSetting.closest('.setting-group');
        if (grp) grp.style.display = 'none';
    }

    // Hide animation speed control from sidebar
    if (animationSpeedSetting) {
        const grp = animationSpeedSetting.closest('.setting-group');
        if (grp) grp.style.display = 'none';
    }

    // Scale factor setting (en UA directes)
    // Hide NASA scale control from sidebar
    const scaleFactorSetting = document.getElementById('scale-factor-setting');
    if (scaleFactorSetting) {
        const grp = scaleFactorSetting.closest('.setting-group');
        if (grp) grp.style.display = 'none';
    }
    
    setTimeout(() => {
        // ✅ CONTRÔLE D'INTENSITÉ DU SOLEIL SUPPRIMÉ
        // L'intensité du soleil est maintenant fixée à une valeur optimale (150)
        
        // Ajouter le bouton de suivi de Kepler
        addKeplerFollowButton();
        
        // Ajouter le bouton KOI Data Explorer
        addKOIDataExplorerButton();
        // Hide AFFICHAGE toggles group (Orbits / Labels / Lunes)
        hideDisplayToggles();
        // Add ASTRE search section with popup
        ensureAstreSearchControl();
        // Ensure bottom-right info panel exists
        ensureBottomRightInfoPanel();
        // Ensure top-right distance HUD exists
        ensureDistanceHUD();
        // Setup header with ASTRE title and toggle
        setupScaleCardHeader();
    }, 100); // Délai très court de 100ms

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

// Ensure a bottom-right info panel exists as a standalone element
function ensureBottomRightInfoPanel() {
  console.log("📋 ensureBottomRightInfoPanel() appelée");
  
  // Create a standalone container since scale-display is hidden
  let scaleBox = document.getElementById('br-panel-container');
  if (!scaleBox) {
    scaleBox = document.createElement('div');
    scaleBox.id = 'br-panel-container';
    Object.assign(scaleBox.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '280px',
      background: 'linear-gradient(145deg, rgba(0, 20, 40, 0.95) 0%, rgba(0, 40, 80, 0.9) 100%)',
      border: '1px solid #00ffff',
      borderRadius: '12px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 0 25px rgba(0, 255, 255, 0.3)',
      zIndex: '1000',
      fontFamily: 'Rajdhani, sans-serif'
    });
    document.body.appendChild(scaleBox);
  }

  let container = document.getElementById('br-info');
  if (!container) {
    container = document.createElement('div');
    container.id = 'br-info';
    container.style.marginTop = '0';
    container.style.borderTop = 'none';
    container.style.padding = '12px 15px';
    container.style.position = 'relative';
    container.style.zIndex = '100000';
    container.style.pointerEvents = 'auto';

    container.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:8px;">
        <div>
          <div id="br-name" style="font-weight:700; color:#00ffff; font-family:'Rajdhani', sans-serif;">—</div>
          <div id="br-type" style="font-size:0.8rem; color:#0080ff; font-family:'Rajdhani', sans-serif;">—</div>
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          <button id="br-toggle-btn" type="button" title="Réduire / Afficher" style="width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border:1px solid rgba(0,255,255,0.3); background:rgba(0,128,255,0.08); color:#00ffff; border-radius:6px; cursor:pointer; user-select:none;">▾</button>
          <button id="br-uncenter-btn" class="uncenter-btn" style="padding:6px 10px; display:none; border:1px solid rgba(255,165,0,0.5); background:rgba(255,165,0,0.1); color:#ffa500; border-radius:4px; cursor:pointer; font-size:0.8rem;">Décentrer</button>
          <button id="br-stop-follow-btn" class="stop-follow-btn" style="padding:6px 10px; display:none;">Libérer</button>
        </div>
      </div>
      <div id="br-content" class="tooltip-content"></div>
      <div id="br-description" class="tooltip-description" style="margin-top:8px;"></div>
    `;

    scaleBox.appendChild(container);
  }

  // Wire toggle button idempotently (even if container already existed)
  if (!container.dataset.wired) {
    const toggleBtn = container.querySelector('#br-toggle-btn');
    const contentEl = container.querySelector('#br-content');
    const descEl = container.querySelector('#br-description');
    const stopBtn = container.querySelector('#br-stop-follow-btn');
    const uncenterBtn = container.querySelector('#br-uncenter-btn');
    // Hide the internal arrow toggle in the bottom info panel
    if (toggleBtn) toggleBtn.style.display = 'none';
    const setCollapsed = (collapsed) => {
      contentEl.style.display = collapsed ? 'none' : '';
      descEl.style.display = collapsed ? 'none' : '';
      if (stopBtn && stopBtn.style.display !== 'none') {
        stopBtn.style.display = collapsed ? 'none' : 'inline-flex';
      }
      if (uncenterBtn && uncenterBtn.style.display !== 'none') {
        uncenterBtn.style.display = collapsed ? 'none' : 'inline-flex';
      }
      if (toggleBtn) toggleBtn.textContent = collapsed ? '▸' : '▾';
      container.dataset.collapsed = collapsed ? '1' : '0';
      try { localStorage.setItem('brCollapsed', container.dataset.collapsed); } catch {}
    };
    // Restore last state
    let saved = '0';
    try { saved = localStorage.getItem('brCollapsed') || '0'; } catch {}
    setCollapsed(saved === '1');
    const toggleHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const next = !(container.dataset.collapsed === '0');
      setCollapsed(next);
      console.log('🔀 BR toggle clicked. Collapsed =', next);
    };
    // Attach in both capture and bubble to guarantee handling before canvas
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleHandler, { capture: true });
      toggleBtn.addEventListener('click', toggleHandler);
      // Extra safety: pointerdown support
      toggleBtn.addEventListener('pointerdown', (e) => { e.stopPropagation(); }, { capture: true });
      // Inline fallback
      toggleBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); toggleHandler(e); };
    }
    
    // Gérer le bouton "Décentrer"
    if (uncenterBtn) {
      const uncenterHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Remettre la caméra au centre du système solaire (0, 0, 0)
        controls.target.set(0, 0, 0);
        controls.update();
        
        // Arrêter le suivi si actif
        followedPlanet = null;
        
        // Cacher le bouton "Décentrer" et "Libérer"
        uncenterBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'none';
        
        console.log('🎯 Caméra décentrée - retour au centre du système');
      };
      
      uncenterBtn.addEventListener('click', uncenterHandler, { capture: true });
      uncenterBtn.addEventListener('click', uncenterHandler);
      uncenterBtn.addEventListener('pointerdown', (e) => { e.stopPropagation(); }, { capture: true });
      uncenterBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); uncenterHandler(e); };
    }
    
    container.dataset.wired = '1';
  }
}

function updateBottomRightInfo(name, type, info, objectType) {
  console.log("🔄 updateBottomRightInfo appelée avec:", name, type, objectType);
  
  const nameEl = document.getElementById('br-name');
  const typeEl = document.getElementById('br-type');
  const contentEl = document.getElementById('br-content');
  const descEl = document.getElementById('br-description');
  const container = document.getElementById('br-info');
  const toggleBtn = document.getElementById('br-toggle-btn');
  
  if (!nameEl || !typeEl || !contentEl || !descEl) {
    console.log("❌ Éléments UI manquants:", {nameEl: !!nameEl, typeEl: !!typeEl, contentEl: !!contentEl, descEl: !!descEl});
    return;
  }

  nameEl.textContent = name || '—';
  typeEl.textContent = type || '—';

  contentEl.innerHTML = `
    <div class="tooltip-info">
      <span class="info-label">Rayon</span>
      <span class="info-value">${info.radius || '—'}</span>
    </div>
    <div class="tooltip-info">
      <span class="info-label">Distance</span>
      <span class="info-value">${info.distance || '—'}</span>
    </div>
    <div class="tooltip-info">
      <span class="info-label">Orbite</span>
      <span class="info-value">${info.orbit || '—'}</span>
    </div>
    ${objectType !== 'sun' ? `
      <div class="tooltip-info">
        <span class="info-label">Lunes</span>
        <span class="info-value">${info.moons || '—'}</span>
      </div>
    ` : ''}
  `;

  descEl.textContent = info.info || '';

  // Gérer le bouton "Voir les données recueillies" uniquement pour Kepler
  // 1) Toujours supprimer un éventuel bouton existant
  if (descEl && descEl.parentNode) {
    const existingButton = descEl.parentNode.querySelector('.data-button');
    if (existingButton) {
      existingButton.remove();
      console.log('🗑️ Bouton de données existant supprimé');
    }
  }

  // 2) Le recréer uniquement quand les infos affichées concernent Kepler
  if (info.dataButton && (name || '').toLowerCase() === 'kepler') {
    const dataButton = document.createElement('button');
    dataButton.className = 'data-button';
    dataButton.innerHTML = `
      <span class="data-button-icon">📊</span>
      <span class="data-button-text">${info.dataButton.text}</span>
    `;
    dataButton.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      padding: 10px 16px;
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
    `;

    dataButton.addEventListener('mouseenter', () => {
      dataButton.style.transform = 'translateY(-2px)';
      dataButton.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.4)';
    });

    dataButton.addEventListener('mouseleave', () => {
      dataButton.style.transform = 'translateY(0)';
      dataButton.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.3)';
    });

    dataButton.addEventListener('click', () => {
      window.open(info.dataButton.url, '_blank');
    });

    if (descEl && descEl.parentNode) {
      descEl.parentNode.insertBefore(dataButton, descEl.nextSibling);
      console.log('✅ Bouton de données Kepler créé');
    }
  }

  // Always expand on new content to ensure visibility
  if (container) {
    contentEl.style.display = '';
    descEl.style.display = '';
    const stopBtn = document.getElementById('br-stop-follow-btn');
    const uncenterBtn = document.getElementById('br-uncenter-btn');
    
    // Afficher le bouton "Décentrer" quand un objet est sélectionné
    if (uncenterBtn) {
      uncenterBtn.style.display = 'inline-flex';
    }
    
    if (stopBtn && stopBtn.style.display !== 'none') stopBtn.style.display = 'inline-flex';
    container.dataset.collapsed = '0';
    if (toggleBtn) toggleBtn.textContent = '▾';
  }
}

// Minimalist top-right distance HUD
function ensureDistanceHUD() {
  if (document.getElementById('distance-hud')) return;
  const el = document.createElement('div');
  el.id = 'distance-hud';
  Object.assign(el.style, {
    position: 'fixed',
    top: '12px',
    right: '16px',
    zIndex: '100000',
    color: '#00ffff',
    fontFamily: "Rajdhani, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
    fontWeight: '700',
    letterSpacing: '0.5px',
    textShadow: '0 0 8px rgba(0,255,255,0.6)',
    background: 'transparent',
    pointerEvents: 'none',
    padding: '6px 10px',
  });
  el.textContent = '';
  document.body.appendChild(el);
}

function updateDistanceHUD(text) {
  const el = document.getElementById('distance-hud');
  if (!el) return;
  if (!text) {
    el.style.display = 'none';
  } else {
    el.style.display = 'block';
    el.textContent = `Distance à l'objet: ${text}`;
  }
}

// Setup header for the bottom-right card with ASTRE title and toggle
function setupScaleCardHeader() {
  const scaleDisplay = document.getElementById('br-panel-container');
  if (!scaleDisplay) return;
  
  // Create header if it doesn't exist
  let header = scaleDisplay.querySelector('.scale-header');
  if (!header) {
    header = document.createElement('div');
    header.className = 'scale-header';
    Object.assign(header.style, {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 15px',
      borderBottom: '1px solid rgba(0, 255, 255, 0.2)',
      background: 'rgba(0, 255, 255, 0.05)'
    });
    
    const icon = document.createElement('span');
    icon.className = 'scale-icon';
    icon.textContent = '🪐';
    icon.style.fontSize = '1.1rem';
    
    const title = document.createElement('span');
    title.className = 'scale-title';
    title.textContent = 'ASTRE';
    Object.assign(title.style, {
      fontSize: '0.9rem',
      fontWeight: '700',
      color: '#00ffff',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontFamily: 'Rajdhani, sans-serif'
    });
    
    header.appendChild(icon);
    header.appendChild(title);
    scaleDisplay.insertBefore(header, scaleDisplay.firstChild);
  }
  
  const brInfo = document.getElementById('br-info');
  
  // Inject collapsed styles once
  if (!document.getElementById('scale-card-style')) {
    const style = document.createElement('style');
    style.id = 'scale-card-style';
    style.textContent = `
      #br-panel-container.collapsed { padding-bottom: 0 !important; }
      #br-panel-container.collapsed #br-info { display: none !important; }
    `;
    document.head.appendChild(style);
  }
  
  // Create toggle button if missing
  let toggleBtn = document.getElementById('scale-card-toggle');
  if (!toggleBtn) {
    toggleBtn = document.createElement('button');
    toggleBtn.id = 'scale-card-toggle';
    toggleBtn.title = 'Réduire / Agrandir';
    Object.assign(toggleBtn.style, {
      marginLeft: 'auto',
      width: '28px',
      height: '28px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid rgba(0,255,255,0.3)',
      background: 'rgba(0,128,255,0.08)',
      color: '#00ffff',
      borderRadius: '6px',
      cursor: 'pointer',
      userSelect: 'none'
    });
    header.appendChild(toggleBtn);
  }
  
  // Force default collapsed on startup
  let collapsed = true;
  try { localStorage.setItem('scaleCardCollapsed', '1'); } catch {}
  
  const applyCollapsed = (isCollapsed) => {
    if (isCollapsed) {
      scaleDisplay.classList.add('collapsed');
    } else {
      scaleDisplay.classList.remove('collapsed');
    }
    if (brInfo) brInfo.style.display = isCollapsed ? 'none' : '';
    scaleDisplay.style.paddingBottom = isCollapsed ? '0' : '';
    toggleBtn.textContent = isCollapsed ? '▸' : '▾';
  };
  
  applyCollapsed(collapsed);
  
  // Toggle handler
  const onToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    collapsed = !collapsed;
    applyCollapsed(collapsed);
    try { localStorage.setItem('scaleCardCollapsed', collapsed ? '1' : '0'); } catch {}
  };
  
  // Ensure single binding
  toggleBtn.onclick = onToggle;
}

function setScaleCardTitle(name) {
  const scaleDisplay = document.getElementById('br-panel-container');
  if (!scaleDisplay) return;
  const header = scaleDisplay.querySelector('.scale-header');
  if (!header) return;
  const titleEl = header.querySelector('.scale-title');
  if (titleEl) titleEl.textContent = name || 'ASTRE';
}

function resetScaleCard() {
  setScaleCardTitle('ASTRE');
  const brInfo = document.getElementById('br-info');
  if (brInfo) brInfo.style.display = 'none';
  
  // Ensure card is collapsed when nothing is selected
  const scaleDisplay = document.getElementById('br-panel-container');
  if (scaleDisplay) {
    scaleDisplay.classList.add('collapsed');
    const toggleBtn = document.getElementById('scale-card-toggle');
    if (toggleBtn) toggleBtn.textContent = '▸';
  }
}

console.log("✅ Fonctions ensureBottomRightInfoPanel et updateBottomRightInfo définies dans la portée globale");

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

// ✅ DÉSACTIVER LE FOG GLOBALEMENT pour éviter la perte d'opacité avec la distance
scene.fog = null;
console.log("🌫️ Fog désactivé globalement pour préserver l'opacité des objets");

console.log("Create a perspective projection camera");
// We'll set the aspect ratio after we know the container size
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 10000000 ); // Valeurs équilibrées pour éviter les problèmes de précision
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
controls.minDistance = 1; // Distance minimale raisonnable pour éviter les problèmes de rendu
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
var lightAmbient = new THREE.AmbientLight(0x222222, 1.5); // Lumière ambiante faible et neutre
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
  accelerationOrbit: 0.5,
  acceleration: 1,
  sunIntensity: 0.5
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
    // Si on suit un objet, afficher la distance à cet objet dans le HUD en haut à droite
    if (followedPlanet) {
        const targetPosition = new THREE.Vector3();
        followedPlanet.getWorldPosition(targetPosition);
        const distanceToTargetUA = camera.position.distanceTo(targetPosition);
        const distanceToTargetKm = distanceToTargetUA * AU_IN_KM;
        
        // Update minimalist HUD in top-right
        updateDistanceHUD(formatDistance(distanceToTargetKm));
    } else {
        updateDistanceHUD(null);
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
  const intersects = raycaster.intersectObjects(raycastTargets, false);
  
  console.log("🖱️ Clic détecté:", mouse, "Intersections:", intersects.length);
  console.log("🎯 Objets raycastables:", raycastTargets.length);
  
  // ✅ FIX: Liste les marqueurs d'exoplanètes qui sont censés être cliquables
  if (window.currentExoplanets) {
    const exoMarkers = raycastTargets.filter(obj => 
      obj.userData?.isMarker && 
      obj.userData?.planetName && 
      window.currentExoplanets.some(p => 
        p.name.toLowerCase() === obj.userData.planetName.toLowerCase()
      )
    );
    console.log(`🎯 Marqueurs d'exoplanètes cliquables: ${exoMarkers.length}`);
    exoMarkers.forEach(marker => {
      console.log(`  → Marqueur: ${marker.userData.planetName}, type: ${marker.userData.type}, isExoplanetMarker: ${!!marker.userData.isExoplanetMarker}`);
    });
  }
  
  // Debug: afficher les objets intersectés
  if (intersects.length > 0) {
    intersects.forEach((intersect, index) => {
      console.log(`🔍 Intersection ${index}:`, {
        object: intersect.object,
        userData: intersect.object.userData,
        material: intersect.object.material?.name || 'no name',
        parent: intersect.object.parent?.name || 'no parent'
      });
    });
  }
  
  // Debug spécial: vérifier si les lunes de Mars sont dans raycastTargets
  const marsInTargets = raycastTargets.filter(target => 
    target.userData?.planetName === 'phobos' || 
    target.userData?.planetName === 'deimos' ||
    (Array.isArray(marsMoons) && marsMoons.some(moon => moon.mesh === target))
  );
  console.log("🔴 Lunes de Mars dans raycastTargets:", marsInTargets.length, marsInTargets);
  
  // Debug spécial: vérifier les exoplanètes dans raycastTargets
  const exoplanetsInTargets = raycastTargets.filter(target => 
    target.userData?.type === 'exoplanet' || 
    (target.userData?.name && window.currentExoplanets && window.currentExoplanets.some(p => p.name === target.userData.name))
  );
  console.log("🪐 Exoplanètes dans raycastTargets:", exoplanetsInTargets.length, exoplanetsInTargets.map(t => t.userData?.name));
  
  // Debug: état du système Kepler
  console.log("🌟 État système Kepler:", {
    currentExoplanets: window.currentExoplanets ? window.currentExoplanets.length : 0,
    exoplanetManager: !!exoplanetSceneManager,
    exoplanetsCreated: exoplanetSceneManager ? exoplanetSceneManager.exoplanets.length : 0
  });
  
  // Debug: afficher les premiers objets raycastables
  if (raycastTargets.length > 0) {
    console.log("🔍 Premiers objets raycast:", raycastTargets.slice(0, 5).map(obj => obj.userData?.planetName || obj.userData?.name || 'unknown'));
  }

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    
    // Vérifier si c'est une sphère de sélection ou un marqueur
    if (clickedObject.userData && (clickedObject.userData.isSelectionSphere || clickedObject.userData.isMarker || clickedObject.userData.isExoplanetMarker)) {
      let objectName = clickedObject.userData.planetName;
      let objectType = clickedObject.userData.type || 'planet';
      let realPlanetMesh = clickedObject.userData.planetMesh;
      
      console.log(`🔍 DEBUG CLIC MARKER: userData=`, clickedObject.userData);
      
      // ✅ FIX: Détecter automatiquement les exoplanètes
      if (window.currentExoplanets) {
        const isExoplanet = window.currentExoplanets.some(p => 
          p.name.toLowerCase() === objectName.toLowerCase()
        );
        
        if (isExoplanet) {
          objectType = 'exoplanet';
          console.log(`🪐 Marqueur d'exoplanète détecté: ${objectName}`);
          
          // ✅ FIX: Récupérer la vraie exoplanète depuis le manager
          if (exoplanetSceneManager) {
            const exoplanet = exoplanetSceneManager.getExoplanetByName(objectName);
            if (exoplanet) {
              realPlanetMesh = exoplanet;
              console.log(`🚀 Récupéré le vrai mesh d'exoplanète: ${objectName}`);
            }
          }
        }
      }
      
      const emoji = objectType === 'moon' ? '🌙' : objectType === 'exoplanet' ? '🪐' : '🌎';
      
      console.log(`🔘 Marqueur/Sphère cliqué: ${emoji} ${objectName} (${objectType})`);
      
      // Gérer les cas où les lunes ne sont pas encore chargées
      if (objectType === 'moon' && (objectName === 'phobos' || objectName === 'deimos')) {
        console.log(`🔴 Marqueur lune de Mars cliqué: ${objectName}`);
        // Vérifier si la lune est chargée
        const marsMoon = marsMoons.find(moon => moon.name.toLowerCase() === objectName);
        if (!marsMoon || !marsMoon.mesh) {
          console.log(`⚠️ Lune ${objectName} pas encore chargée, affichage des infos de base`);
          // Afficher les informations même si le mesh n'est pas chargé
          showPlanetInfo(objectName, objectType);
          return;
        }
      }
      
      // Debug spécial pour les marqueurs des lunes de Mars
      if (objectType === 'moon' && (objectName === 'phobos' || objectName === 'deimos')) {
        console.log(`🔴 Marqueur lune de Mars détecté: ${objectName}`);
        console.log(`🔴 selectedPlanet avant:`, selectedPlanet);
      }
      
      // ✅ FIX: Pour les exoplanètes, construire un objet selectedPlanet complet
      if (objectType === 'exoplanet' && realPlanetMesh) {
        selectedPlanet = { 
          name: objectName, 
          type: objectType,
          object: realPlanetMesh,
          userData: realPlanetMesh.userData
        };
        console.log(`🪐 Exoplanète sélectionnée via marqueur:`, selectedPlanet);
      } else {
        selectedPlanet = { name: objectName, type: objectType };
      }
      
      // Centrer sur l'objet (planète ou lune)
      centerOnPlanet(objectName, objectType);
      
      // Afficher les infos
      // closeInfoNoZoomOut(); // Temporairement commenté pour test
      showPlanetInfo(objectName, objectType);
      
      // Debug après traitement
      if (objectType === 'moon' && (objectName === 'phobos' || objectName === 'deimos')) {
        console.log(`🔴 selectedPlanet après:`, selectedPlanet);
        console.log(`🔴 Appel showPlanetInfo terminé pour:`, objectName);
      }
      
      console.log(`${emoji} ${objectType} sélectionné(e) via marqueur:`, objectName);
      return;
    }
    selectedPlanet = identifyPlanet(clickedObject);
    if (selectedPlanet) {
      closeInfoNoZoomOut();
      
      // Centrer sur l'objet - ACTIVÉ pour les lunes de Mars et TOUS les objets des systèmes Kepler
      if ((selectedPlanet.type === 'moon' && (selectedPlanet.name === 'Phobos' || selectedPlanet.name === 'Deimos')) ||
          (selectedPlanet.type === 'exoplanet') || 
          (selectedPlanet.type === 'kepler_star') ||
          (selectedPlanet.type === 'sun' && window.currentExoplanets)) {
        
        const emoji = selectedPlanet.type === 'moon' ? '🌙' : 
                     selectedPlanet.type === 'exoplanet' ? '🪐' : '⭐';
        console.log(`${emoji} Centrage automatique sur ${selectedPlanet.type}:`, selectedPlanet.name);
        
        // Utiliser le nom approprié pour centerOnPlanet
        const objectName = (selectedPlanet.type === 'sun' || selectedPlanet.type === 'kepler_star') ? 'sun' : selectedPlanet.name.toLowerCase();
        centerOnPlanet(objectName, selectedPlanet.type === 'kepler_star' ? 'sun' : selectedPlanet.type);
      }
      
      console.log("🔍 Tentative d'affichage tooltip pour:", selectedPlanet.name, selectedPlanet.type);
      showPlanetInfo(selectedPlanet.name, selectedPlanet.type);
      
      console.log(`${selectedPlanet.type === 'moon' ? '🌙' : '🪐'} ${selectedPlanet.type} sélectionnée:`, selectedPlanet.name, selectedPlanet.type === 'moon' && (selectedPlanet.name === 'Phobos' || selectedPlanet.name === 'Deimos') ? "- Centrage automatique" : "- Caméra libre");
    }
  }
}

function identifyPlanet(clickedObject) {
  // Logic to identify which planet/moon was clicked based on the clicked object
  
  // Check exoplanets first (if any are loaded) - includes Kepler star detection
  if (exoplanetSceneManager && exoplanetSceneManager.exoplanets.length > 0) {
    const exoplanetData = exoplanetSceneManager.findExoplanetByMesh(clickedObject);
    if (exoplanetData) {
      if (exoplanetData.type === 'kepler_star') {
        offset = 100;
        return { 
          type: 'kepler_star', 
          name: exoplanetData.userData.name, 
          object: exoplanetData.mesh,
          userData: exoplanetData.userData 
        };
      } else {
        offset = Math.max(10, exoplanetData.userData.radius * 2); // Distance proportionnelle à la taille
        return { 
          type: 'exoplanet', 
          name: exoplanetData.userData.name, 
          object: exoplanetData.mesh,
          userData: exoplanetData.userData 
        };
      }
    }
  }
  
  // Check the Sun (only for solar system, not Kepler systems)
  if (clickedObject.material === sun.material && !window.currentExoplanets) {
    offset = 100;
    return { type: 'sun', name: 'sun', object: sun };
  }
  
  // Check planets
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
    return { type: 'dwarf_planet', name: 'pluto', object: pluto };
  }
  
  // Check moons
  if (typeof earth !== 'undefined' && earth.moon && clickedObject.material === earth.moon.material) {
    offset = 5;
    return { type: 'moon', name: 'moon', object: earth.moon, parent: 'earth' };
  }
  
  // Check Jupiter's moons
  if (jupiter && jupiter.moons) {
    const moonNames = ['Io', 'Europa', 'Ganymede', 'Callisto']; // Supprimer l'accent pour éviter les problèmes
    for (let i = 0; i < jupiter.moons.length; i++) {
      if (jupiter.moons[i].mesh && clickedObject === jupiter.moons[i].mesh) {
        return { type: 'moon', name: moonNames[i], object: jupiter.moons[i].mesh, parent: 'Jupiter' };
      }
    }
  }

  // Check Earth satellites
  if (Array.isArray(earthSatellites)) {
    console.log("🔍 Vérification satellites de la Terre:", earthSatellites.length, "satellites");
    for (let i = 0; i < earthSatellites.length; i++) {
      console.log(`🛰️ Satellite Terre ${i}:`, earthSatellites[i].name, "mesh:", !!earthSatellites[i].mesh);
      
      if (earthSatellites[i].mesh) {
        // Vérification directe
        if (clickedObject === earthSatellites[i].mesh) {
          console.log("✅ Satellite de la Terre identifié (direct):", earthSatellites[i].name);
          return { type: 'satellite', name: earthSatellites[i].name, object: earthSatellites[i].mesh, parent: 'Earth' };
        }
        
        // Vérification des enfants (pour les modèles .glb)
        let found = false;
        earthSatellites[i].mesh.traverse((child) => {
          if (child === clickedObject) {
            console.log("✅ Satellite de la Terre identifié (enfant):", earthSatellites[i].name);
            found = true;
          }
        });
        
        if (found) {
          return { type: 'satellite', name: earthSatellites[i].name, object: earthSatellites[i].mesh, parent: 'Earth' };
        }
      } else {
        // Si le mesh n'est pas encore chargé, vérifier si c'est un marqueur
        console.log("⚠️ Satellite de la Terre pas encore chargé:", earthSatellites[i].name);
      }
    }
  }

  // Check Mars moons
  if (Array.isArray(marsMoons)) {
    console.log("🔍 Vérification lunes de Mars:", marsMoons.length, "lunes");
    for (let i = 0; i < marsMoons.length; i++) {
      console.log(`🌙 Lune Mars ${i}:`, marsMoons[i].name, "mesh:", !!marsMoons[i].mesh);
      
      if (marsMoons[i].mesh) {
        // Vérification directe
        if (clickedObject === marsMoons[i].mesh) {
          console.log("✅ Lune de Mars identifiée (direct):", marsMoons[i].name);
          return { type: 'moon', name: marsMoons[i].name, object: marsMoons[i].mesh, parent: 'Mars' };
        }
        
        // Vérification des enfants (pour les modèles .glb)
        let found = false;
        marsMoons[i].mesh.traverse((child) => {
          if (child === clickedObject) {
            console.log("✅ Lune de Mars identifiée (enfant):", marsMoons[i].name);
            found = true;
          }
        });
        
        if (found) {
          return { type: 'moon', name: marsMoons[i].name, object: marsMoons[i].mesh, parent: 'Mars' };
        }
      } else {
        // Si le mesh n'est pas encore chargé, vérifier si c'est un marqueur
        console.log("⚠️ Lune de Mars pas encore chargée:", marsMoons[i].name);
      }
    }
  }

  return null;
}

// Fonction utilitaire pour normaliser les noms des lunes
function normalizeMoonName(name) {
  const normalized = name.toLowerCase();
  const nameMap = {
    'ganymede': 'Ganymede',
    'ganymède': 'Ganymede',
    'phobos': 'Phobos',
    'deimos': 'Deimos',
    'io': 'Io',
    'europa': 'Europa',
    'callisto': 'Callisto',
    'moon': 'moon'
  };
  return nameMap[normalized] || name;
}

// ******  SHOW PLANET INFO AFTER SELECTION  ******
function showPlanetInfo(objectName, objectType = 'planet') {
  console.log("🎯 showPlanetInfo appelée avec:", objectName, objectType);
  console.log("🔍 ensureBottomRightInfoPanel définie:", typeof ensureBottomRightInfoPanel);
  
  // Debug spécial pour les lunes de Mars
  if (objectType === 'moon' && (objectName === 'Phobos' || objectName === 'phobos' || objectName === 'Deimos' || objectName === 'deimos')) {
    console.log("🔴 Traitement lune de Mars:", objectName, objectType);
  }
  
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
  
  if (objectType === 'sun') {
    // Data for the Sun
    objectInfo = {
      radius: '696,340 km',
      distance: '0 km (centre du système)',
      orbit: 'N/A (étoile centrale)',
      moons: '0',
      info: 'Le Soleil est l\'étoile au centre de notre système solaire. Il  génère son énergie par fusion nucléaire.'
    };
    displayName = 'Soleil';
    displayType = 'Étoile';
  } else if (objectType === 'exoplanet') {
    // Data for exoplanets
    console.log("🪐 Traitement exoplanète:", objectName);
    
    // Récupérer les userData depuis selectedPlanet si disponible
    let userData = null;
    if (selectedPlanet && selectedPlanet.userData) {
      userData = selectedPlanet.userData;
    } else if (exoplanetSceneManager) {
      // Fallback: chercher dans les exoplanètes
      const exoplanet = exoplanetSceneManager.exoplanets.find(p => p.userData.name === objectName);
      if (exoplanet) userData = exoplanet.userData;
    }
    
    if (userData) {
      objectInfo = formatExoplanetInfo(userData);
      displayName = userData.name;
      displayType = `Exoplanète (${userData.classification})`;
      console.log("✅ Données exoplanète formatées:", objectInfo);
    } else {
      console.warn("⚠️ Données exoplanète non trouvées pour:", objectName);
      objectInfo = {
        radius: 'Données non disponibles',
        distance: 'Données non disponibles',
        orbit: 'Données non disponibles',
        moons: '0',
        info: `Informations sur l'exoplanète ${objectName} en cours de chargement...`
      };
      displayName = objectName;
      displayType = 'Exoplanète';
    }
  } else if (objectType === 'kepler_star') {
    // Data for Kepler system stars
    console.log("⭐ Traitement étoile Kepler:", objectName);
    
    // Récupérer les userData depuis selectedPlanet si disponible
    let userData = null;
    if (selectedPlanet && selectedPlanet.userData) {
      userData = selectedPlanet.userData;
    }
    
    if (userData) {
      objectInfo = {
        radius: '696,340 km (similaire au Soleil)',
        distance: '0 km (centre du système)',
        orbit: 'N/A (étoile centrale)',
        moons: '0',
        temperature: userData.temperature || '5778 K',
        classification: userData.classification || 'Étoile de type G',
        system: userData.system || 'Système Kepler',
        info: `${userData.name} est l'étoile centrale du système ${userData.system || 'Kepler'}. Cette étoile de type solaire héberge plusieurs exoplanètes détectées par le télescope spatial Kepler.`
      };
      displayName = userData.name;
      displayType = 'Étoile Kepler';
      console.log("✅ Données étoile Kepler formatées:", objectInfo);
    } else {
      console.warn("⚠️ Données étoile Kepler non trouvées pour:", objectName);
      objectInfo = {
        radius: '696,340 km (estimation)',
        distance: '0 km (centre du système)',
        orbit: 'N/A (étoile centrale)',
        moons: '0',
        info: `${objectName} est l'étoile centrale de ce système Kepler.`
      };
      displayName = objectName;
      displayType = 'Étoile Kepler';
    }
  } else if (objectType === 'dwarf_planet') {
    // Data for dwarf planets (specifically Pluto)
    const planetKey = objectName.charAt(0).toUpperCase() + objectName.slice(1);
    objectInfo = planetData[planetKey];
    displayName = planetKey;
    displayType = 'Planète naine';
    
    console.log("🔍 Recherche données planète naine:", planetKey, "Trouvé:", !!objectInfo);
  } else if (objectType === 'moon') {
    // Normaliser le nom de la lune
    const normalizedName = normalizeMoonName(objectName);
    console.log(`🌙 Nom normalisé: ${objectName} -> ${normalizedName}`);
    
    // Data for moons
    if (normalizedName === 'moon') {
      objectInfo = {
        radius: '1,737 km',
        distance: '384,400 km de la Terre',
        orbit: '27.3 jours',
        moons: '0',
        info: 'La Lune est le seul satellite naturel de la Terre. Elle influence les marées et stabilise l\'axe de rotation terrestre.'
      };
      displayName = 'Lune';
      displayType = 'Satellite naturel';
    } else if (normalizedName === 'Io') {
      objectInfo = {
        radius: '1,821 km',
        distance: '421,700 km de Jupiter',
        orbit: '1.77 jours',
        moons: '0',
        info: 'Io est la lune la plus volcanique du système solaire avec plus de 400 volcans actifs. Elle est constamment déformée par les forces de marée de Jupiter.'
      };
      displayName = 'Io';
      displayType = 'Satellite de Jupiter';
    } else if (normalizedName === 'Europa') {
      objectInfo = {
        radius: '1,560 km',
        distance: '671,034 km de Jupiter',
        orbit: '3.55 jours',
        moons: '0',
        info: 'Europa possède un océan souterrain sous sa croûte de glace, ce qui en fait l\'un des endroits les plus prometteurs pour rechercher la vie dans le système solaire.'
      };
      displayName = 'Europa';
      displayType = 'Satellite de Jupiter';
    } else if (normalizedName === 'Ganymede') {
      objectInfo = {
        radius: '2,634 km',
        distance: '1,070,412 km de Jupiter',
        orbit: '7.15 jours',
        moons: '0',
        info: 'Ganymède est la plus grande lune du système solaire, plus grande que Mercure. Elle possède son propre champ magnétique et probablement un océan souterrain.'
      };
      displayName = 'Ganymède';
      displayType = 'Satellite de Jupiter';
    } else if (normalizedName === 'Callisto') {
      objectInfo = {
        radius: '2,410 km',
        distance: '1,882,709 km de Jupiter',
        orbit: '16.69 jours',
        moons: '0',
        info: 'Callisto est la lune la plus cratérisée du système solaire. Sa surface ancienne n\'a pas été modifiée par l\'activité géologique depuis des milliards d\'années.'
      };
      displayName = 'Callisto';
      displayType = 'Satellite de Jupiter';
    } else if (normalizedName === 'Phobos') {
      console.log("🔴 MATCH Phobos trouvé pour:", objectName);
      objectInfo = {
        radius: '11.3 km',
        distance: '9,376 km de Mars',
        orbit: '7.6 heures',
        moons: '0',
        info: 'Phobos est la plus grande et la plus proche des deux lunes de Mars. Elle orbite si près de Mars qu\'elle se rapproche de 1.8 mètre par siècle et s\'écrasera sur Mars dans 50 millions d\'années.'
      };
      displayName = 'Phobos';
      displayType = 'Satellite de Mars';
    } else if (normalizedName === 'Deimos') {
      console.log("🔴 MATCH Deimos trouvé pour:", objectName);
      objectInfo = {
        radius: '6.2 km',
        distance: '23,463 km de Mars',
        orbit: '30.3 heures',
        moons: '0',
        info: 'Deimos est la plus petite et la plus éloignée des deux lunes de Mars. Son nom signifie "terreur" en grec. Elle s\'éloigne lentement de Mars à raison de quelques centimètres par siècle.'
      };
      displayName = 'Deimos';
      displayType = 'Satellite de Mars';
    } else if (normalizedName === 'kepler') {
      objectInfo = {
        radius: '2.7 m (longueur)',
        distance: 'Orbite héliocentrique (suivait la Terre)',
        orbit: '372.5 jours',
        moons: '0',
        info: 'Kepler était un télescope spatial de la NASA conçu pour découvrir des planètes de taille terrestre en orbite autour d\'autres étoiles. Il a découvert plus de 2,600 exoplanètes confirmées.',
        dataButton: {
          text: 'Voir les données recueillies',
          url: 'https://koi-data-explorer.vercel.app',
          description: 'Explorer les données d\'exoplanètes découvertes par Kepler'
        }
      };
      displayName = 'Kepler';
      displayType = 'Télescope spatial';
    }
  } else if (objectType === 'satellite') {
    // Data for artificial satellites
    console.log("🛰️ Traitement satellite artificiel:", objectName);
    
    if (objectName.toLowerCase() === 'kepler') {
      objectInfo = {
        radius: '2.7 m (longueur)',
        distance: 'Orbite héliocentrique (suivait la Terre)',
        orbit: '372.5 jours',
        moons: '0',
        info: 'Kepler était un télescope spatial de la NASA conçu pour découvrir des planètes de taille terrestre en orbite autour d\'autres étoiles',
        dataButton: {
          text: 'Voir les données recueillies',
          url: 'https://koi-data-explorer.vercel.app',
          description: 'Explorer les données d\'exoplanètes découvertes par Kepler'
        }
      };
      displayName = 'Kepler';
      displayType = 'Satellite artificiel';
    } else {
      // Fallback pour d'autres satellites
      objectInfo = {
        radius: 'N/A',
        distance: 'N/A',
        orbit: 'N/A',
        moons: '0',
        info: 'Satellite artificiel en orbite autour de la Terre.'
      };
      displayName = objectName;
      displayType = 'Satellite artificiel';
    }
  } else {
    // Data for planets - CORRECTION: utiliser la bonne clé
    const planetKey = objectName.charAt(0).toUpperCase() + objectName.slice(1);
    objectInfo = planetData[planetKey];
    displayName = planetKey;
    displayType = 'Planète';
    
    console.log("🔍 Recherche données planète:", planetKey, "Trouvé:", !!objectInfo);
  }
  
  if (!objectInfo) {
    console.log("❌ Aucune information trouvée pour:", objectName, objectType);
    
    // Créer des informations par défaut pour les lunes non reconnues
    if (objectType === 'moon') {
      objectInfo = {
        radius: 'Données non disponibles',
        distance: 'Données non disponibles',
        orbit: 'Données non disponibles',
        moons: '0',
        info: `Informations sur ${objectName} en cours de chargement...`
      };
      displayName = objectName;
      displayType = 'Satellite';
    } else {
    return;
    }
  }
  
  console.log("✅ Informations trouvées pour:", objectName, objectType, objectInfo);
  
  // Also update the bottom-right info panel (preferred display)
  ensureBottomRightInfoPanel();
  updateBottomRightInfo(displayName, displayType, objectInfo, objectType);
  
  // Update card title with object name and expand the card
  setScaleCardTitle(displayName);
  
  // Expand the card when an object is selected
  const scaleDisplay = document.getElementById('br-panel-container');
  if (scaleDisplay) {
    scaleDisplay.classList.remove('collapsed');
    const toggleBtn = document.getElementById('scale-card-toggle');
    if (toggleBtn) toggleBtn.textContent = '▾';
  }

  // Hide legacy floating tooltip to avoid duplicate displays
  if (tooltip) tooltip.classList.remove('show');
  
  // NE PAS bouger la caméra automatiquement; l'utilisateur décide s'il veut centrer
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
      case 'phobos':
        if (Array.isArray(marsMoons) && marsMoons[0] && marsMoons[0].mesh) {
          targetObject = marsMoons[0].mesh;
          console.log("🌙 Centrage sur Phobos (lune de Mars)");
        }
        break;
      case 'deimos':
        if (Array.isArray(marsMoons) && marsMoons[1] && marsMoons[1].mesh) {
          targetObject = marsMoons[1].mesh;
          console.log("🌙 Centrage sur Deimos (lune de Mars)");
        }
        break;
      case 'kepler':
        if (Array.isArray(earthSatellites) && earthSatellites[0] && earthSatellites[0].mesh) {
          targetObject = earthSatellites[0].mesh;
          console.log("🛰️ Centrage sur Kepler (satellite de la Terre)");
        }
        break;
    }
  } else if (objectType === 'satellite') {
    // Gérer les satellites artificiels
    switch(objectName.toLowerCase()) {
      case 'kepler':
        if (Array.isArray(earthSatellites) && earthSatellites[0] && earthSatellites[0].mesh) {
          targetObject = earthSatellites[0].mesh;
          console.log("🛰️ Centrage sur Kepler (satellite de la Terre)");
        }
        break;
    }
  } else if (objectType === 'exoplanet') {
    // Gérer les exoplanètes
    if (exoplanetSceneManager && exoplanetSceneManager.exoplanets.length > 0) {
      const exoplanet = exoplanetSceneManager.exoplanets.find(p => 
        p.userData.name === objectName || p.userData.name.toLowerCase() === objectName.toLowerCase()
      );
      if (exoplanet) {
        targetObject = exoplanet;
        console.log("🪐 Centrage sur exoplanète:", objectName);
        console.log("   Position:", exoplanet.position);
        console.log("   Données:", exoplanet.userData);
      } else {
        console.warn("⚠️ Exoplanète non trouvée:", objectName);
        console.log("   Exoplanètes disponibles:", exoplanetSceneManager.exoplanets.map(p => p.userData.name));
      }
    }
  } else if (objectType === 'kepler_star' || (objectType === 'sun' && window.currentExoplanets)) {
    // Gérer l'étoile Kepler (le soleil dans un système Kepler)
    if (sun) {
      targetObject = sun;
      const starName = exoplanetSceneManager ? exoplanetSceneManager.getKeplerStarName() : 'Étoile Kepler';
      console.log("⭐ Centrage sur étoile Kepler:", starName);
    }
  } else if (objectType === 'sun') {
    // Gérer le Soleil du système solaire
    if (objectName.toLowerCase() === 'soleil' || objectName.toLowerCase() === 'sun') {
      targetObject = sun; // Le soleil est défini comme une variable globale
      console.log("☀️ Centrage sur le Soleil");
    }
  } else if (objectType === 'dwarf_planet') {
    // Gérer les planètes naines
    switch(objectName.toLowerCase()) {
      case 'pluto': targetObject = pluto.planet; break;
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

// Fonction utilitaire pour centrer sur les objets Kepler
function centerOnKeplerObject(objectName, objectType = 'auto') {
  console.log(`🎯 Tentative de centrage Kepler sur: ${objectName} (${objectType})`);
  
  // Auto-détection du type si nécessaire
  if (objectType === 'auto') {
    if (objectName.toLowerCase().includes('kepler') && !objectName.includes(' ')) {
      objectType = 'kepler_star';
      objectName = 'sun';
    } else {
      objectType = 'exoplanet';
    }
  }
  
  // Utiliser la fonction centerOnPlanet existante
  centerOnPlanet(objectName, objectType);
  
  // Afficher les informations
  if (objectType === 'exoplanet' && exoplanetSceneManager) {
    const exoplanet = exoplanetSceneManager.getExoplanetByName(objectName);
    if (exoplanet && exoplanet.userData) {
      showPlanetInfo(objectName, objectType);
    }
  } else if (objectType === 'kepler_star') {
    const starName = exoplanetSceneManager ? exoplanetSceneManager.getKeplerStarName() : 'Étoile Kepler';
    showPlanetInfo(starName, 'kepler_star');
  }
}

// Fonction pour lister toutes les exoplanètes disponibles
function listAvailableExoplanets() {
  if (!exoplanetSceneManager || exoplanetSceneManager.exoplanets.length === 0) {
    console.log('❌ Aucune exoplanète disponible');
    return [];
  }
  
  const exoplanets = exoplanetSceneManager.getAvailableExoplanets();
  console.log('\n🪐 EXOPLANÈTES DISPONIBLES POUR CENTRAGE:');
  console.log('═══════════════════════════════════════════');
  
  exoplanets.forEach((planet, index) => {
    console.log(`${index + 1}. ${planet.name} (${planet.type})`);
    console.log(`   Classification: ${planet.classification}`);
    console.log(`   Commande: centerOnKeplerObject("${planet.name}")`);
  });
  
  // Ajouter l'étoile Kepler
  const starName = exoplanetSceneManager.getKeplerStarName();
  console.log(`${exoplanets.length + 1}. ${starName} (étoile)`);
  console.log(`   Commande: centerOnKeplerObject("${starName}", "kepler_star")`);
  
  console.log('═══════════════════════════════════════════\n');
  
  return exoplanets;
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

// close 'x' button function
function closeInfo() {
  const tooltip = document.getElementById('planet-tooltip');
  
  if (tooltip) {
    tooltip.classList.remove('show');
  }
  
  // Reset the scale card to show "ASTRE" and collapse it
  resetScaleCard();
  
  // NE PAS changer la cible de la caméra ni forcer le zoom out
  // L'utilisateur garde le contrôle total de la caméra
}

// close info when clicking another planet (without resetting the card)
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
let sunMat = new THREE.MeshBasicMaterial({
  color: 0xFFFF00,   // Jaune plus vif
  map: loadTexture.load(sunTexture),
  // MeshBasicMaterial ignore l'éclairage et brille uniformément
});
const sun = new THREE.Mesh(sunGeom, sunMat);
scene.add(sun);

// Mettre à jour le contrôle d'intensité du soleil maintenant que sunMat existe
// ✅ CONTRÔLE D'INTENSITÉ DU SOLEIL SUPPRIMÉ
// L'intensité du soleil est maintenant fixée à une valeur optimale (150)

//point light in the sun - LUMIÈRE PRINCIPALE ET UNIQUE
const lightIntensity = 100; // ✅ INTENSITÉ FORTEMENT AUGMENTÉE pour une meilleure visibilité
const lightDistance = 0; // Portée infinie pour atteindre toutes les planètes
const pointLight = new THREE.PointLight(0xFDFFD3, lightIntensity, lightDistance, 0.5); // Decay réduit pour que la lumière atteigne mieux les planètes éloignées
pointLight.position.set(0, 0, 0); // Au centre du soleil

// *** CONFIGURER LES OMBRES IMMÉDIATEMENT ***
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;
pointLight.shadow.camera.near = 1;
pointLight.shadow.camera.far = 50000;
pointLight.shadow.radius = 1;
pointLight.shadow.bias = -0.001;

console.log(`💡 Lumière solaire: intensité ${lightIntensity.toFixed(0)}, portée infinie`);
console.log(`🌑 Ombres configurées: ${pointLight.shadow.mapSize.width}x${pointLight.shadow.mapSize.height}, portée: ${pointLight.shadow.camera.far}`);
scene.add(pointLight);

// Supprimer complètement la lumière directionnelle
// La PointLight du soleil sera notre seule source lumineuse
// Cela garantit que la lumière vient vraiment du soleil dans toutes les directions
console.log(`🌅 Lumière directionnelle supprimée, utilisation exclusive de la PointLight`)

// Ajouter une lumière ambiante très faible pour éviter que les planètes ne soient complètement noires du côté non éclairé
const ambientLight = new THREE.AmbientLight(0x404040, 0.3); // Couleur grise avec faible intensité
scene.add(ambientLight);
console.log(`✨ Lumière ambiante faible ajoutée pour améliorer la visibilité`)

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
      bumpScale: 0.7,
      shininess: 10,        // Réduire la brillance pour un aspect plus réaliste
      specular: 0x333333,   // Réflexion spéculaire plus subtile
      reflectivity: 0.2     // Augmenter légèrement la réflectivité
    });
  }
  else {
    material = new THREE.MeshPhongMaterial({
      map: loadTexture.load(texture),
      shininess: 10,        // Réduire la brillance pour un aspect plus réaliste
      specular: 0x333333,   // Réflexion spéculaire plus subtile
      reflectivity: 0.2     // Augmenter légèrement la réflectivité
    });
  } 

  const name = planetName;
  const geometry = new THREE.SphereGeometry(size, 32, 20);
  
  // 🔧 CORRECTION : S'assurer que les normales pointent vers l'extérieur
  geometry.computeVertexNormals();
  
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

  // Utiliser un nombre fixe élevé de points pour toutes les orbites (2048 points pour un cercle parfait)
  const ORBIT_SEGMENTS = 2048;
  const pathPoints = orbitPath.getPoints(ORBIT_SEGMENTS);
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
  
  // Configurer le DRACOLoader pour la décompression
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
  loader.setDRACOLoader(dracoLoader);

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
  
  // Configurer le DRACOLoader pour la décompression
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
  loader.setDRACOLoader(dracoLoader);
  
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
    name: 'Phobos',
    modelPath: '/images/mars/phobos.glb',
    scale: 0.1,
    orbitRadius: 5,
    orbitSpeed: 0.002 * settings.accelerationOrbit,
    position: 100,
    mesh: null
  },
  {
    name: 'Deimos',
    modelPath: '/images/mars/deimos.glb',
    scale: 0.1,
    orbitRadius: 9,
    orbitSpeed: 0.0005 * settings.accelerationOrbit,
    position: 120,
    mesh: null
  }
];

// Earth satellites - Kepler Space Telescope
const earthSatellites = [
  {
    name: 'Kepler',
    modelPath: '/images/satellites/Kepler.glb',
    scale: 0.05, // Plus petit que les lunes car c'est un satellite artificiel
    orbitRadius: 8, // Orbite plus éloignée de la Terre pour être visible
    orbitSpeed: 0.003 * settings.accelerationOrbit, // Orbite plus rapide
    position: 50, // Position initiale
    mesh: null,
    type: 'satellite' // Type pour différencier des lunes naturelles
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
    
    // Ajouter la lune aux raycastTargets une fois chargée
    raycastTargets.push(moon.mesh);
    
    // Ajouter aussi tous les enfants aux raycastTargets (pour les modèles .glb)
    moon.mesh.traverse((child) => {
      if (child.isMesh && child !== moon.mesh) {
        raycastTargets.push(child);
        console.log("🌙 Enfant de lune de Mars ajouté aux raycastTargets:", moon.name, child.name || 'unnamed child');
      }
    });
    
    console.log("🌙 Lune de Mars ajoutée aux raycastTargets après chargement:", moon.name);
    
    // Créer le marqueur pour la lune de Mars - DÉSACTIVÉ
    // const moonKey = moon.name.toLowerCase();
    // planetMarkerSystem.createMoonMarker(moonKey, moon.mesh, mars.planet, moon.name);
    // addMarkerToRaycast(moonKey);
    console.log("🔘 Marqueur DÉSACTIVÉ pour lune de Mars:", moon.name);
    
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

// Load Earth satellites - Kepler Space Telescope
earthSatellites.forEach(satellite => {
  loadObject(satellite.modelPath, satellite.position, satellite.scale, function(loadedModel) {
    satellite.mesh = loadedModel;
    earth.planetSystem.add(satellite.mesh);
    
    // Ajouter le satellite aux raycastTargets une fois chargé
    raycastTargets.push(satellite.mesh);
    
    // Ajouter aussi tous les enfants aux raycastTargets (pour les modèles .glb)
    satellite.mesh.traverse((child) => {
      if (child.isMesh && child !== satellite.mesh) {
        raycastTargets.push(child);
        console.log("🛰️ Enfant de satellite ajouté aux raycastTargets:", satellite.name, child.name || 'unnamed child');
      }
    });
    
    console.log("🛰️ Satellite de la Terre ajouté aux raycastTargets après chargement:", satellite.name);
    
    // Créer le marqueur pour le satellite
    const satelliteKey = satellite.name.toLowerCase();
    planetMarkerSystem.createMoonMarker(satelliteKey, satellite.mesh, earth.planet, satellite.name);
    addMarkerToRaycast(satelliteKey);
    console.log("🛰️ Marqueur créé pour satellite de la Terre:", satellite.name);
    
    satellite.mesh.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.userData = { planetName: satellite.name.toLowerCase(), type: 'satellite' };
        
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
    
    console.log(`🛰️ Satellite de la Terre chargé: ${satellite.name}`);
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

// Add the Sun first
if (sun) raycastTargets.push(sun);

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

// Debug: lister tous les raycastTargets pour voir si les lunes de Mars y sont
console.log("📋 Liste complète des raycastTargets:");
raycastTargets.forEach((target, index) => {
  if (target.userData) {
    console.log(`  ${index}: ${target.userData.planetName || 'unnamed'} (${target.userData.type || 'unknown type'})`);
  } else {
    console.log(`  ${index}: objet sans userData`);
  }
});

// ===== INITIALISATION DU SYSTÈME DE MARQUEURS =====
console.log("🎯 Initializing Planet Marker System...");
planetMarkerSystem = new PlanetMarkerSystem(scene, camera);

// Exposer les variables globales pour les managers d'exoplanètes
window.planetMarkerSystem = planetMarkerSystem;
window.raycastTargets = raycastTargets;
window.createPlanet = createPlanet;  // Exposer la fonction createPlanet
window.centerOnPlanet = centerOnPlanet;  // Exposer la fonction de centrage
window.centerOnKeplerObject = centerOnKeplerObject;  // Fonction spécifique Kepler
window.listAvailableExoplanets = listAvailableExoplanets;  // Lister les exoplanètes
console.log("🌍 Variables globales exposées pour les exoplanètes");

// Helper function pour ajouter les marqueurs aux raycastTargets
function addMarkerToRaycast(objectName) {
    const markerData = planetMarkerSystem.markers.get(objectName);
    if (markerData) {
        // Ajouter l'anneau visible aux cibles du raycast
        raycastTargets.push(markerData.ring);
        
        // Ajouter la zone de clic (disque invisible) aux cibles du raycast
        raycastTargets.push(markerData.clickArea);
        
        // ✅ FIX: S'assurer que clickArea a bien la référence vers l'exoplanète
        if (window.currentExoplanets && markerData.planet.userData && markerData.planet.userData.type) {
            // Pour les exoplanètes, s'assurer que userData.planetMesh est correctement défini
            markerData.clickArea.userData.planetMesh = markerData.planet;
            markerData.ring.userData.planetMesh = markerData.planet;
            
            // Ajouter une référence explicite à l'exoplanète
            markerData.clickArea.userData.isExoplanetMarker = true;
            markerData.ring.userData.isExoplanetMarker = true;
            
            console.log(`🚀 Marqueur exoplanète ${objectName} configuré avec planetMesh pour le clic`);
        }
        
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

// Supprimer les marqueurs des lunes de Mars si ils existent déjà
if (planetMarkerSystem) {
    planetMarkerSystem.removeMarker('phobos');
    planetMarkerSystem.removeMarker('deimos');
    console.log("🗑️ Marqueurs des lunes de Mars supprimés");
}

// Nettoyer les raycastTargets pour retirer les marqueurs des lunes de Mars
const marsMarkerIndices = [];
raycastTargets.forEach((target, index) => {
    if (target.userData && (target.userData.planetName === 'phobos' || target.userData.planetName === 'deimos') && target.userData.isMarker) {
        marsMarkerIndices.push(index);
    }
});

// Supprimer les marqueurs des lunes de Mars des raycastTargets (en ordre inverse pour éviter les décalages d'index)
marsMarkerIndices.reverse().forEach(index => {
    raycastTargets.splice(index, 1);
});

if (marsMarkerIndices.length > 0) {
    console.log(`🗑️ ${marsMarkerIndices.length} marqueurs de lunes de Mars supprimés des raycastTargets`);
}

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

// Animate Earth satellites - Kepler Space Telescope
if (earthSatellites) {
  earthSatellites.forEach(satellite => {
    if (satellite.mesh) {
      const time = performance.now();
      
      const satelliteX = earth.planet.position.x + satellite.orbitRadius * Math.cos(time * satellite.orbitSpeed);
      const satelliteY = satellite.orbitRadius * Math.sin(time * satellite.orbitSpeed);
      const satelliteZ = earth.planet.position.z + satellite.orbitRadius * Math.sin(time * satellite.orbitSpeed);
      
      satellite.mesh.position.set(satelliteX, satelliteY, satelliteZ);
      satellite.mesh.rotateY(0.002); // Rotation légèrement plus rapide que les lunes
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
    console.log(`🎬 Animation frame ${animate.callCount + 1}, accelerationOrbit: ${settings.accelerationOrbit}, sunIntensity: ${settings.sunIntensity}`);
    animate.callCount++;
  }
  
  // Masquer le chargement après les premiers frames (système chargé)
  if (animate.callCount === 3) {
    setTimeout(() => {
      // Retirer la classe loading du body pour réafficher l'interface
      document.body.classList.remove('loading');
      
      // La sidebar est maintenant gérée directement dans le HTML
      
      // Masquer l'écran de chargement initial du HTML
      const initialOverlay = document.getElementById('initial-loading-overlay');
      if (initialOverlay) {
        initialOverlay.style.opacity = '0';
        setTimeout(() => {
          initialOverlay.style.display = 'none';
        }, 500);
      }
      // Masquer aussi le système de chargement JS s'il est visible
      if (loadingSystem.visible) {
        loadingSystem.hide();
      }
    }, 3000); // 3 secondes pour voir l'animation
  }
  
  // Rotation du soleil
  sun.rotation.y += 0.008 * settings.acceleration;

  // ☀️ SYSTÈME D'ÉCLAIRAGE : La PointLight au centre du soleil est la SEULE source de lumière
  // Elle émet dans toutes les directions et éclaire les planètes sur le côté face au soleil
  // Les planètes tournent sur elles-mêmes, l'éclairage est géré par Three.js
  
  // Mercury - rotation + orbite
  mercury.planet.rotateY(0.015 * settings.acceleration);
  mercury.planet3d.rotateY(0.002 * settings.accelerationOrbit);
  
  // Venus - rotation + orbite
  venus.planet.rotateY(0.008 * settings.acceleration);
  venus.planet3d.rotateY(0.0015 * settings.accelerationOrbit);
  
  // Earth - rotation + orbite + atmosphère
  earth.planet.rotateY(0.015 * settings.acceleration);
  earth.planet3d.rotateY(0.001 * settings.accelerationOrbit);
  if (earth.Atmosphere) {
    earth.Atmosphere.rotateY(0.0015 * settings.acceleration);
  }
  
  // 🌍 CORRECTION ÉCLAIRAGE TERRE : Mettre à jour la position du soleil dans le shader
  if (earth.planet.material.uniforms && earth.planet.material.uniforms.sunPosition) {
    earth.planet.material.uniforms.sunPosition.value.set(0, 0, 0);
  }
  
  // Mars - rotation + orbite
  mars.planet.rotateY(0.015 * settings.acceleration);
  mars.planet3d.rotateY(0.0007 * settings.accelerationOrbit);
  
  // Jupiter - rotation + orbite
  jupiter.planet.rotateY(0.008 * settings.acceleration);
  jupiter.planet3d.rotateY(0.0003 * settings.accelerationOrbit);
  
  // Saturn - rotation + orbite
  saturn.planet.rotateY(0.015 * settings.acceleration);
  saturn.planet3d.rotateY(0.0002 * settings.accelerationOrbit);
  
  // Uranus - rotation + orbite
  uranus.planet.rotateY(0.008 * settings.acceleration);
  uranus.planet3d.rotateY(0.0001 * settings.accelerationOrbit);
  
  // Neptune - rotation + orbite
  neptune.planet.rotateY(0.008 * settings.acceleration);
  neptune.planet3d.rotateY(0.00008 * settings.accelerationOrbit);
  
  // Pluto - rotation + orbite
  pluto.planet.rotateY(0.002 * settings.acceleration);
  pluto.planet3d.rotateY(0.00006 * settings.accelerationOrbit);

  // 🌙 Animation des lunes de la Terre
  // L'éclairage est géré automatiquement par la PointLight
  if (earth.moons) {
    earth.moons.forEach(moon => {
      const time = performance.now();
      const tiltAngle = 5 * Math.PI / 180;

      const moonX = earth.planet.position.x + moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
      const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed) * Math.sin(tiltAngle);
      const moonZ = earth.planet.position.z + moon.orbitRadius * Math.sin(time * moon.orbitSpeed) * Math.cos(tiltAngle);

      moon.mesh.position.set(moonX, moonY, moonZ);
      moon.mesh.rotateY(0.015);
    });
  }

  // 🌙 Animation des lunes de Mars
  if (marsMoons) {
    marsMoons.forEach(moon => {
      if (moon.mesh) {
        const time = performance.now();
        const moonX = mars.planet.position.x + moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
        const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
        const moonZ = mars.planet.position.z + moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
        moon.mesh.position.set(moonX, moonY, moonZ);
        moon.mesh.rotateY(0.002);
      }
    });
  }
  
  // 🛰️ Animate Earth satellites - Kepler Space Telescope
  if (earthSatellites) {
    earthSatellites.forEach(satellite => {
      if (satellite.mesh) {
        const time = performance.now();
        
        const satelliteX = earth.planet.position.x + satellite.orbitRadius * Math.cos(time * satellite.orbitSpeed);
        const satelliteY = satellite.orbitRadius * Math.sin(time * satellite.orbitSpeed);
        const satelliteZ = earth.planet.position.z + satellite.orbitRadius * Math.sin(time * satellite.orbitSpeed);
        
        satellite.mesh.position.set(satelliteX, satelliteY, satelliteZ);
        satellite.mesh.rotateY(0.003);
      }
    });
  }

  // 🌙 Animation des lunes de Jupiter
  if (jupiter.moons) {
    jupiter.moons.forEach(moon => {
      const time = performance.now();
      const moonX = jupiter.planet.position.x + moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
      const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
      const moonZ = jupiter.planet.position.z + moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
      moon.mesh.position.set(moonX, moonY, moonZ);
      moon.mesh.rotateY(0.015);
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
  
  // Mettre à jour les exoplanètes (orbites et rotations)
  if (exoplanetSceneManager) {
    exoplanetSceneManager.update();
  }
  
  // Fonctions supprimées
  requestAnimationFrame(animate);
  composer.render();
}

// Initialize HUD after everything is loaded
initializeHUD();

// ===== ROUTE HANDLER POUR SYSTÈMES KEPLER =====
let routeHandler = null;
let defaultSunSize = sunSize; // Sauvegarder la taille originale du Soleil

// Fonction pour modifier le rayon du Soleil
function updateSunRadius(starData) {
    if (!starData || !starData.radius) {
        console.warn('⚠️ Pas de données d\'étoile pour modifier le Soleil');
        return;
    }

    console.log('\n🌟 MODIFICATION DU RAYON DU SOLEIL:');
    console.log(`   Étoile: ${starData.name}`);
    console.log(`   Rayon original: ${defaultSunSize.toFixed(2)} unités (1.0 R☉)`);
    console.log(`   Rayon de l'étoile: ${starData.radius.toFixed(2)} R☉`);
    
    // Calculer le nouveau rayon
    const newSunSize = defaultSunSize * starData.radius;
    console.log(`   Nouveau rayon: ${newSunSize.toFixed(2)} unités`);
    
    // Supprimer l'ancien mesh du Soleil
    scene.remove(sun);
    
    // Recréer la géométrie avec le nouveau rayon
    const newSunGeom = new THREE.SphereGeometry(newSunSize, 64, 32);
    sun.geometry.dispose(); // Libérer l'ancienne géométrie
    sun.geometry = newSunGeom;
    
    // Remettre le Soleil dans la scène
    scene.add(sun);
    
    console.log('✅ Rayon du Soleil mis à jour!\n');
}

// Fonction pour réinitialiser le rayon du Soleil
function resetSunRadius() {
    console.log('🔄 Réinitialisation du rayon du Soleil');
    
    // Supprimer l'ancien mesh
    scene.remove(sun);
    
    // Recréer la géométrie avec le rayon original
    const originalSunGeom = new THREE.SphereGeometry(defaultSunSize, 64, 32);
    sun.geometry.dispose();
    sun.geometry = originalSunGeom;
    
    // Remettre le Soleil dans la scène
    scene.add(sun);
    
    console.log('✅ Soleil réinitialisé à sa taille originale');
}

// Initialiser le RouteHandler
console.log('🛣️ Initialisation du RouteHandler...');
routeHandler = new RouteHandler();
routeHandler.init();

// Initialiser le système de chargement
console.log('🌟 Initialisation du LoadingSystem...');
loadingSystem.init();

// Afficher le chargement au démarrage immédiatement - AVANT tout le reste
setTimeout(() => {
    loadingSystem.show('Initialisation du système solaire...');
}, 0);

// Initialiser le gestionnaire de scène des exoplanètes
console.log('🪐 Initialisation du ExoplanetSceneManager...');
let exoplanetSceneManager = null;
exoplanetSceneManager = new ExoplanetSceneManager(scene, camera);
console.log('✅ ExoplanetSceneManager prêt');

/**
 * Cache ou affiche les planètes du système solaire avec leurs orbites et marqueurs
 * @param {Boolean} visible - true pour afficher, false pour cacher
 */
function setSolarSystemPlanetsVisibility(visible) {
    console.log(`\n${visible ? '👁️ AFFICHAGE' : '🙈 MASQUAGE'} DES ÉLÉMENTS DU SYSTÈME SOLAIRE`);
    console.log('='.repeat(60));
    
    // 1. Cacher/Afficher les planètes (avec leurs orbites blanches intégrées)
    const solarPlanets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto];
    
    solarPlanets.forEach(planetObj => {
        if (planetObj && planetObj.planetSystem) {
            planetObj.planetSystem.visible = visible;
            console.log(`   ${visible ? '✅' : '❌'} ${planetObj.name || 'Planète'}: ${visible ? 'visible' : 'cachée'}`);
        }
    });
    
    // 2. Cacher/Afficher les marqueurs (noms/labels des planètes)
    if (planetMarkerSystem) {
        const planetNames = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
        
        planetNames.forEach(planetName => {
            // Cacher/afficher les marqueurs
            const markerData = planetMarkerSystem.markers.get(planetName);
            if (markerData && markerData.group) {
                markerData.group.visible = visible;
                console.log(`   ${visible ? '🏷️' : '❌'} Marqueur ${planetName}: ${visible ? 'visible' : 'caché'}`);
            }
            
            // Cacher/afficher les ORBITES COLORÉES
            const orbitData = planetMarkerSystem.orbits.get(planetName);
            if (orbitData && orbitData.group) {
                orbitData.group.visible = visible;
                console.log(`   ${visible ? '�' : '❌'} Orbite colorée ${planetName}: ${visible ? 'visible' : 'cachée'}`);
            }
        });
        
        // 3. Cacher/Afficher les marqueurs des LUNES
        const moonNames = ['moon', 'io', 'europa', 'ganymede', 'callisto']; // Lune de la Terre + lunes de Jupiter
        
        moonNames.forEach(moonName => {
            const moonMarkerData = planetMarkerSystem.markers.get(moonName);
            if (moonMarkerData && moonMarkerData.group) {
                moonMarkerData.group.visible = visible;
                console.log(`   ${visible ? '🌙' : '❌'} Marqueur lune ${moonName}: ${visible ? 'visible' : 'caché'}`);
            }
        });
    }
    
    console.log('='.repeat(60));
    console.log(`${visible ? '✅ Système solaire affiché' : '✅ Système solaire masqué'}\n`);
}

// Écouter l'événement de chargement d'un système Kepler
window.addEventListener('kepler-system-loaded', (event) => {
    const systemData = event.detail;
    const star = systemData.data?.star || systemData.star;
    const exoplanets = systemData.data?.exoplanets || systemData.exoplanets;
    
    if (star) {
        console.log('🪐 Système Kepler chargé, mise à jour du Soleil...');
        updateSunRadius(star);
    }
    
    if (exoplanets && exoplanets.length > 0) {
        console.log('\n🌍 Traitement des exoplanètes...');
        processExoplanets(exoplanets);
    }
});

// Fonction pour formater les données d'une exoplanète pour le système de card
function formatExoplanetInfo(userData) {
    const { name, classification, type, distance, radius, temperature, confidence } = userData;
    
    // Convertir les unités Three.js en unités réelles
    const distanceAU = (distance / 7504).toFixed(3); // Reconvertir en UA
    const radiusKm = (radius * 6371 / 6.37).toFixed(0); // Approximation du rayon en km
    const distanceKm = (parseFloat(distanceAU) * 149597870.7).toFixed(0); // Distance en km
    
    return {
        radius: `${radiusKm} km (estimé)`,
        distance: `${distanceAU} UA (${distanceKm} km)`,
        orbit: 'Période orbitale inconnue',
        moons: '0 (données indisponibles)',
        info: `Exoplanète de type ${classification} (${type}) avec ${confidence}% de confiance. Température estimée: ${temperature}K. Classification basée sur le rayon, la température et la distance à l'étoile.`,
        // Données supplémentaires pour l'affichage
        classification: classification,
        type: type,
        temperature: temperature,
        confidence: confidence
    };
}

// Fonction pour traiter et classifier les exoplanètes
function processExoplanets(exoplanets) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🔬 CLASSIFICATION DES EXOPLANÈTES`);
    console.log(`${'='.repeat(80)}\n`);
    
    // Afficher l'écran de chargement et masquer l'interface
    document.body.classList.add('loading');
    loadingSystem.showSystemLoading('kepler');
    
    // Cacher les planètes du système solaire
    setSolarSystemPlanetsVisibility(false);
    
    // Utiliser le générateur pour classifier
    const processedPlanets = ExoplanetGenerator.processExoplanets(exoplanets);
    
    // Sauvegarder les planètes traitées pour usage ultérieur
    window.currentExoplanets = processedPlanets;
    
    // Mettre à jour la sidebar pour le système Kepler
    setTimeout(() => {
        updateSidebar();
    }, 100);
    
    console.log(`\n✅ ${processedPlanets.length} exoplanètes classifiées et prêtes à être affichées`);
    console.log(`💡 Accès via: window.currentExoplanets\n`);
    
    // Créer les exoplanètes en 3D dans la scène
    if (exoplanetSceneManager) {
        // Récupérer le rayon actuel du Soleil depuis sa géométrie
        const currentSunRadius = sun.geometry.parameters.radius;
        console.log(`☀️ Utilisation du rayon actuel du Soleil: ${currentSunRadius.toFixed(2)} unités`);
        
        exoplanetSceneManager.createExoplanets(processedPlanets, currentSunRadius);
        
        // 🎨 CRÉER LES MARQUEURS ET ORBITES COLORÉES POUR LES EXOPLANÈTES
        console.log(`🎨 Création des marqueurs colorés pour ${exoplanetSceneManager.exoplanets.length} exoplanètes...`);
        exoplanetSceneManager.exoplanets.forEach((exoplanet, index) => {
            const planetName = exoplanet.userData.name.toLowerCase();
            const planetType = exoplanet.userData.type;
            
            console.log(`\n🔍 DEBUG Exoplanète ${index + 1}:`);
            console.log(`   - Nom: ${exoplanet.userData.name}`);
            console.log(`   - Type: ${planetType}`);
            console.log(`   - userData complet:`, exoplanet.userData);
            
            // Créer le marqueur (cercle coloré)
            if (planetMarkerSystem) {
                planetMarkerSystem.createPlanetMarker(planetName, exoplanet, exoplanet.userData.name);
                
                // Créer l'orbite colorée
                const orbitRadius = exoplanet.userData.distance;
                planetMarkerSystem.createOrbit(planetName, orbitRadius);
                
                // Ajouter le marqueur aux raycastTargets pour le rendre cliquable
                addMarkerToRaycast(planetName);
                
                console.log(`   ✅ Marqueur créé pour ${exoplanet.userData.name} (${planetType}, distance: ${orbitRadius.toFixed(1)})`);
            }
        });
        console.log(`✨ ${exoplanetSceneManager.exoplanets.length} marqueurs d'exoplanètes créés avec succès`);
        
        // Ajouter les exoplanètes aux raycastTargets pour les rendre cliquables
        console.log(`📊 Exoplanètes disponibles dans le manager: ${exoplanetSceneManager.exoplanets.length}`);
        const clickableObjects = exoplanetSceneManager.getClickableObjects();
        console.log(`📋 Objets cliquables retournés: ${clickableObjects.length}`);
        
        clickableObjects.forEach(obj => {
            raycastTargets.push(obj.mesh);
            console.log(`🎯 Objet ${obj.userData.name || 'SANS_NOM'} (${obj.type}) ajouté aux raycastTargets`);
        });
        console.log(`✅ ${clickableObjects.length} objets ajoutés au système de clic`);
        
        // Mettre à jour les contrôles de la sidebar (cacher la recherche ASTRE)
        setTimeout(() => {
            try {
                if (typeof ensureAstreSearchControl === 'function') {
                    ensureAstreSearchControl();
                }
                if (typeof addKeplerFollowButton === 'function') {
                    addKeplerFollowButton();
                }
            } catch (error) {
                console.warn('⚠️ Erreur lors de la mise à jour de l\'interface:', error.message);
            }
            
            // Masquer l'écran de chargement après la création complète
            setTimeout(() => {
                document.body.classList.remove('loading');
                loadingSystem.hide();
            }, 2500); // 2.5 secondes pour les exoplanètes
        }, 100);
    }
    
    return processedPlanets;
}

// Écouter le chargement d'un système Kepler
window.addEventListener('kepler-system-loaded', (event) => {
    console.log('🌌 Système Kepler chargé, mise à jour de la sidebar...');
    
    // Mettre à jour la sidebar pour le système Kepler
    setTimeout(() => {
        updateSidebar();
    }, 100);
});

// Écouter le retour au système solaire
const originalNavigateToSolarSystem = routeHandler.navigateToSolarSystem.bind(routeHandler);
routeHandler.navigateToSolarSystem = function() {
    console.log('\n🌍 Retour au système solaire...');
    
    // Réinitialiser les exoplanètes
    window.currentExoplanets = null;
    
    // Mettre à jour la sidebar pour le système solaire
    setTimeout(() => {
        updateSidebar();
    }, 100);
    
    // Afficher l'écran de chargement et masquer l'interface
    document.body.classList.add('loading');
    loadingSystem.showSystemLoading('solar');
    
    // Nettoyer les exoplanètes
    if (exoplanetSceneManager) {
        // Retirer les exoplanètes des raycastTargets
        const exoplanetMeshes = exoplanetSceneManager.exoplanets;
        exoplanetMeshes.forEach(mesh => {
            const index = raycastTargets.indexOf(mesh);
            if (index > -1) {
                raycastTargets.splice(index, 1);
                console.log(`🗑️ Exoplanète ${mesh.userData?.name || 'inconnue'} retirée des raycastTargets`);
            }
        });
        
        exoplanetSceneManager.clearExoplanets();
        console.log('✅ Exoplanètes nettoyées du système de clic');
    }
    
    // Réafficher les planètes du système solaire
    setSolarSystemPlanetsVisibility(true);
    
    // Réinitialiser le rayon du Soleil
    resetSunRadius();
    
    // Réafficher les contrôles de la sidebar (montrer la recherche ASTRE)
    setTimeout(() => {
        try {
            if (typeof ensureAstreSearchControl === 'function') {
                ensureAstreSearchControl();
            }
            if (typeof addKeplerFollowButton === 'function') {
                addKeplerFollowButton();
            }
        } catch (error) {
            console.warn('⚠️ Erreur lors de la mise à jour de l\'interface:', error.message);
        }
        
        // Masquer l'écran de chargement après la restauration complète
        setTimeout(() => {
            document.body.classList.remove('loading');
            loadingSystem.hide();
        }, 2000); // 2 secondes pour le retour au système solaire
    }, 100);
    
    // Appeler la fonction originale
    originalNavigateToSolarSystem();
};

// Exposer les fonctions globalement pour utilisation dans la console
window.solarSystemScript = {
    updateSunRadius,
    resetSunRadius,
    processExoplanets,
    setSolarSystemPlanetsVisibility,
    routeHandler,
    ExoplanetGenerator,
    exoplanetSceneManager,
    sun,
    scene,
    camera
};

console.log('✅ RouteHandler initialisé et connecté au Soleil');
console.log('✅ ExoplanetGenerator chargé et prêt');
console.log('💡 Testez dans la console: solarSystemScript.routeHandler.navigateToKeplerSystem("Kepler-186")');
console.log('💡 Afficher toutes les classifications: solarSystemScript.ExoplanetGenerator.displayAllClassifications()');

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
