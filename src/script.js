import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';

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
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// ===== HUD INTERFACE SETUP =====
console.log("🚀 Initializing HUD Interface...");

// Initialize HUD controls
function initializeHUD() {
    // Orbit speed control
    const orbitSpeedSlider = document.getElementById('orbit-speed');
    if (orbitSpeedSlider) {
        // Restore persisted value
        try {
            const saved = localStorage.getItem('orbitSpeed');
            if (saved) {
                orbitSpeedSlider.value = saved;
                settings.accelerationOrbit = parseFloat(saved);
                updateSliderValue(orbitSpeedSlider, Number(saved).toFixed(1) + 'x');
            }
        } catch {}
        orbitSpeedSlider.addEventListener('input', (e) => {
            const v = parseFloat(e.target.value);
            settings.accelerationOrbit = v;
            updateSliderValue(e.target, Number(v).toFixed(1) + 'x');
            try { localStorage.setItem('orbitSpeed', String(v)); } catch {}
        });
    }

    // Rotation speed control (top mini slider)
    const topRotationSlider = document.getElementById('rotation-speed');
    if (topRotationSlider) {
        // Restore persisted value
        try {
            const saved = localStorage.getItem('rotationSpeed');
            if (saved) {
                topRotationSlider.value = saved;
                settings.acceleration = parseFloat(saved);
                updateSliderValue(topRotationSlider, Number(saved).toFixed(1) + 'x');
            }
        } catch {}
        topRotationSlider.addEventListener('input', (e) => {
            const v = parseFloat(e.target.value);
            settings.acceleration = v;
            updateSliderValue(e.target, Number(v).toFixed(1) + 'x');
            try { localStorage.setItem('rotationSpeed', String(v)); } catch {}
        });
    }

// Ensure a Sun intensity slider is present in the sidebar and wired
function ensureSunIntensityControl() {
  const panel = document.querySelector('#settings-panel .settings-body');
  if (!panel) return;
  if (document.getElementById('sun-intensity-setting')) return;

  const group = document.createElement('div');
  group.className = 'setting-group';
  group.innerHTML = `
    <label class="setting-label">INTENSITÉ DU SOLEIL</label>
    <div class="setting-slider">
      <input type="range" id="sun-intensity-setting" min="0.5" max="5" step="0.1">
      <span class="slider-value" id="sun-intensity-value"></span>
    </div>
  `;
  panel.appendChild(group);

  const slider = group.querySelector('#sun-intensity-setting');
  const valueEl = group.querySelector('#sun-intensity-value');

  // Load persisted value or use current settings
  let initial = settings.sunIntensity ?? 1.9;
  try {
    const saved = localStorage.getItem('sunIntensity');
    if (saved) initial = parseFloat(saved);
  } catch {}
  if (initial < 0.5) initial = 0.5;

  slider.value = String(initial);
  valueEl.textContent = Number(initial).toFixed(1) + 'x';
  if (typeof sunMat !== 'undefined' && sunMat) {
    sunMat.emissiveIntensity = initial;
  }

  slider.addEventListener('input', (e) => {
    const v = parseFloat(e.target.value);
    valueEl.textContent = Number(v).toFixed(1) + 'x';
    if (typeof sunMat !== 'undefined' && sunMat) {
      sunMat.emissiveIntensity = v;
    }
    settings.sunIntensity = v;
    try { localStorage.setItem('sunIntensity', String(v)); } catch {}
  });
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
  if (document.getElementById('astre-search-btn')) return; // already added

  const group = document.createElement('div');
  group.className = 'setting-group';
  group.innerHTML = `
    <label class="setting-label">ASTRE</label>
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

// Force UI layers (scale-display and tooltips) above canvas and clickable
function ensureUIZIndexOverrides() {
  if (document.getElementById('ui-overrides')) return;
  const style = document.createElement('style');
  style.id = 'ui-overrides';
  style.textContent = `
    .scale-display { z-index: 99999 !important; pointer-events: auto !important; }
    .scale-display * { pointer-events: auto !important; }
    #planet-tooltip { z-index: 3001 !important; }
  `;
  document.head.appendChild(style);
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

    // Sidebar: force click-toggle with hamburger
    setupSidebarToggle();

    // Settings sliders
    const orbitSpeedSetting = document.getElementById('orbit-speed-setting');
    const rotationSpeedSetting = document.getElementById('rotation-speed-setting');
    const animationSpeedSetting = document.getElementById('animation-speed-setting');

    if (orbitSpeedSetting) {
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
        orbitSpeedSetting.addEventListener('input', (e) => {
            const v = parseFloat(e.target.value);
            settings.accelerationOrbit = v;
            const orbitVal = document.getElementById('orbit-speed-value');
            if (orbitVal) orbitVal.textContent = Number(v).toFixed(1) + 'x';
            try { localStorage.setItem('orbitSpeed', String(v)); } catch {}
        });
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

    // Inject Sun intensity control in sidebar
    ensureSunIntensityControl();
    // Hide AFFICHAGE toggles group (Orbits / Labels / Lunes)
    hideDisplayToggles();
    // Add ASTRE search section with popup
    ensureAstreSearchControl();

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

    // Orbits toggle button
    const showOrbitsBtn = document.getElementById('show-orbits-btn');
    if (showOrbitsBtn) {
        showOrbitsBtn.addEventListener('click', () => {
            showOrbitsBtn.classList.toggle('active');
            const isActive = showOrbitsBtn.classList.contains('active');
            toggleOrbits(isActive);
            console.log('🌌 Orbites:', isActive ? 'activées' : 'désactivées');
        });
        
        // Créer les orbites au démarrage
        createOrbits();
    }

    // Enable dragging of the tooltip card (kept for legacy, but we will prefer bottom-right panel)
    enableTooltipDrag();

    // Ensure bottom-right info panel exists and wire its buttons
    ensureBottomRightInfoPanel();
    // Ensure UI is above canvas and clickable
    ensureUIZIndexOverrides();
    // Ensure minimalist top-right distance HUD exists
    ensureDistanceHUD();
    // Setup header rename + collapse/expand toggle for the bottom-right card
    setupScaleCardHeader();
    // Hide scale card rows (camera distance, scale, target distance) in bottom-right card
    try {
      const camSpan = document.getElementById('camera-distance');
      if (camSpan && camSpan.parentElement) camSpan.parentElement.style.display = 'none';
      const scaleSpan = document.getElementById('scale-ratio');
      if (scaleSpan && scaleSpan.parentElement) scaleSpan.parentElement.style.display = 'none';
      const targetItem = document.getElementById('target-distance-item');
      if (targetItem) targetItem.style.display = 'none';
    } catch (e) { console.warn('Could not hide scale card rows', e); }
    const brCenterBtn = document.getElementById('br-center-btn');
    const brStopBtn = document.getElementById('br-stop-follow-btn');
    const brToggleBtn = document.getElementById('br-toggle-btn');
    const stopMouseAndClick = (el, handler) => {
        if (!el) return;
        ['mousedown','click'].forEach(type => el.addEventListener(type, (e) => {
            e.stopPropagation();
            handler && type === 'click' && handler(e);
        }, { capture: true }));
    };
    stopMouseAndClick(brCenterBtn, () => {
        if (selectedPlanet) {
            centerOnPlanet(selectedPlanet.name, selectedPlanet.type);
            const stopBtn = document.getElementById('br-stop-follow-btn');
            if (stopBtn) stopBtn.style.display = 'inline-flex';
        }
    });
    stopMouseAndClick(brStopBtn, () => {
        followedPlanet = null;
        followOffset = null;
        followAutoOrbit = false;
        if (brStopBtn) brStopBtn.style.display = 'none';
    });
    stopMouseAndClick(brToggleBtn, null);

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
    camera.position.set(-175, 115, 5);
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
// Root group for the whole solar system to allow dynamic scaling when zooming out
const solarRoot = new THREE.Group();
scene.add(solarRoot);

console.log("Create a perspective projection camera");
// We'll set the aspect ratio after we know the container size
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000000 );
camera.position.set(-175, 115, 5);

console.log("Create the renderer");
const renderer = new THREE.WebGLRenderer({ antialias: true });

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
controls.maxDistance = 5000; // Permet de zoomer TRÈS loin
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

// Register mouse events for raycasting (hover + click) ONLY on the canvas
renderer.domElement.addEventListener('mousemove', onMouseMove);
renderer.domElement.addEventListener('mousedown', onDocumentMouseDown);

console.log("Set up texture loader");
const cubeTextureLoader = new THREE.CubeTextureLoader();
const loadTexture = new THREE.TextureLoader();

// ===== SYSTÈME D'ORBITES =====
let orbitSystem = null;
let showOrbits = true;

function createOrbits() {
    if (orbitSystem) {
        scene.remove(orbitSystem);
        orbitSystem = null;
    }
    
    orbitSystem = new THREE.Group();
    
    // Données des orbites (distances réelles en UA)
    const orbitData = [
        { name: 'Mercury', distance: 0.387, color: 0x8C7853 },
        { name: 'Venus', distance: 0.723, color: 0xFFC649 },
        { name: 'Earth', distance: 1.000, color: 0x6B93D6 },
        { name: 'Mars', distance: 1.524, color: 0xCD5C5C },
        { name: 'Jupiter', distance: 5.203, color: 0xD8CA9D },
        { name: 'Saturn', distance: 9.537, color: 0xFAD5A5 },
        { name: 'Uranus', distance: 19.191, color: 0x4FD0E7 },
        { name: 'Neptune', distance: 30.069, color: 0x4B70DD },
        { name: 'Pluto', distance: 39.482, color: 0x9CA6B7 }
    ];
    
    orbitData.forEach(orbit => {
        const radius = orbit.distance; // En UA
        const segments = 128;
        const geometry = new THREE.RingGeometry(radius - 0.01, radius + 0.01, segments);
        
        const material = new THREE.MeshBasicMaterial({
            color: orbit.color,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        const orbitRing = new THREE.Mesh(geometry, material);
        orbitRing.rotation.x = -Math.PI / 2; // Horizontal
        orbitSystem.add(orbitRing);
        
        // Ligne de l'orbite plus visible
        const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
        const points = curve.getPoints(segments);
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, 0, p.y)));
        
        const lineMaterial = new THREE.LineBasicMaterial({
            color: orbit.color,
            transparent: true,
            opacity: 0.6
        });
        
        const orbitLine = new THREE.Line(lineGeometry, lineMaterial);
        orbitSystem.add(orbitLine);
    });
    
    solarRoot.add(orbitSystem);
    console.log('✅ Orbites créées');
}

function toggleOrbits(show) {
    if (show && !orbitSystem) {
        createOrbits();
    } else if (orbitSystem) {
        orbitSystem.visible = show;
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
var lightAmbient = new THREE.AmbientLight(0x222222, 6); 
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

// Prepare Milky Way background (equirectangular). Provide an image at /images/milkyway.jpg
let __originalBackground = scene.background;
let __galaxyBackground = null;
try {
  loadTexture.load('/images/milkyway.jpg', (tex) => {
    tex.mapping = THREE.EquirectangularReflectionMapping;
    __galaxyBackground = tex;
    console.log('🌌 Milky Way texture loaded');
  });
} catch (e) {
  console.warn('Milky Way texture not found; keeping star cube background.');
}

// ******  SETTINGS FOR INTERACTIVE CONTROLS  ******
const settings = {
  accelerationOrbit: 0.05,
  acceleration: 1,
  sunIntensity: 1.9
};

// Realistic orbital period handling (seconds-based), with a time scale
const ORBIT_PERIOD_DAYS = {
  mercury: 87.97,
  venus: 224.7,
  earth: 365.26,
  mars: 686.98,
  jupiter: 4332.59,
  saturn: 10759.22,
  uranus: 30688.5,
  neptune: 60182,
  pluto: 90560
};
const SEC_PER_DAY = 86400;
// Time scale to speed up true orbital motion to a visible rate
settings.orbitTimeScale = 5000; // increase/decrease to tune

function orbitDelta(periodDays, dtSeconds) {
  return (2 * Math.PI / (periodDays * SEC_PER_DAY)) * dtSeconds * settings.orbitTimeScale * settings.accelerationOrbit;
}

// Draggable tooltip implementation
function enableTooltipDrag() {
  const tooltip = document.getElementById('planet-tooltip');
  if (!tooltip) return;
  const handle = tooltip.querySelector('.tooltip-header') || tooltip;
  let dragging = false;
  let startX = 0, startY = 0, startLeft = 0, startTop = 0;

  const onMouseDown = (e) => {
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = tooltip.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    // remove entrance transform to allow free move
    tooltip.style.transform = 'none';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const newLeft = Math.max(0, Math.min(window.innerWidth - tooltip.offsetWidth, startLeft + dx));
    const newTop = Math.max(0, Math.min(window.innerHeight - tooltip.offsetHeight, startTop + dy));
    tooltip.style.left = newLeft + 'px';
    tooltip.style.top = newTop + 'px';
  };

  const onMouseUp = () => {
    dragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  handle.style.cursor = 'move';
  handle.addEventListener('mousedown', onMouseDown);
}

// Create and update bottom-right info panel (inside #scale-display)
function ensureBottomRightInfoPanel() {
  const scaleBox = document.getElementById('scale-display');
  if (!scaleBox) return;

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
          <button id="br-center-btn" class="more-info-btn" style="padding:6px 10px;">Centrer</button>
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
    const cntrBtn = container.querySelector('#br-center-btn');
    const stopBtn = container.querySelector('#br-stop-follow-btn');
    // Hide the internal arrow toggle in the bottom info panel
    if (toggleBtn) toggleBtn.style.display = 'none';
    const setCollapsed = (collapsed) => {
      contentEl.style.display = collapsed ? 'none' : '';
      descEl.style.display = collapsed ? 'none' : '';
      if (cntrBtn) cntrBtn.style.display = collapsed ? 'none' : 'inline-flex';
      if (stopBtn && stopBtn.style.display !== 'none') {
        stopBtn.style.display = collapsed ? 'none' : 'inline-flex';
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
    container.dataset.wired = '1';
  }
}

function updateBottomRightInfo(name, type, info, objectType) {
  const nameEl = document.getElementById('br-name');
  const typeEl = document.getElementById('br-type');
  const contentEl = document.getElementById('br-content');
  const descEl = document.getElementById('br-description');
  const container = document.getElementById('br-info');
  const toggleBtn = document.getElementById('br-toggle-btn');
  if (!nameEl || !typeEl || !contentEl || !descEl) return;

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

  // Always expand on new content to ensure visibility
  if (container) {
    contentEl.style.display = '';
    descEl.style.display = '';
    const cntrBtn = document.getElementById('br-center-btn');
    const stopBtn = document.getElementById('br-stop-follow-btn');
    if (cntrBtn) cntrBtn.style.display = 'inline-flex';
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

// Update the bottom-right card title dynamically
function setScaleCardTitle(name) {
  const scaleDisplay = document.getElementById('scale-display');
  if (!scaleDisplay) return;
  const header = scaleDisplay.querySelector('.scale-header');
  if (!header) return;
  const titleEl = header.querySelector('.scale-title');
  if (titleEl) titleEl.textContent = name || 'ASTRE';
}

// Rename the bottom-right card title to ASTRE and add a collapse/expand toggle
function setupScaleCardHeader() {
  const scaleDisplay = document.getElementById('scale-display');
  if (!scaleDisplay) return;
  const header = scaleDisplay.querySelector('.scale-header');
  const content = scaleDisplay.querySelector('.scale-info');
  // The info panel we inject (#br-info) should also collapse with the card
  const brInfo = document.getElementById('br-info');
  if (!header) return;

  // Rename title to ASTRE
  const titleEl = header.querySelector('.scale-title');
  if (titleEl) titleEl.textContent = 'ASTRE';

  // Inject collapsed styles once
  if (!document.getElementById('scale-card-style')) {
    const style = document.createElement('style');
    style.id = 'scale-card-style';
    style.textContent = `
      #scale-display.collapsed { padding-bottom: 0 !important; }
      #scale-display.collapsed .scale-info { display: none !important; }
      #scale-display.collapsed #br-info { display: none !important; }
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

  // Force default collapsed on startup (ignore previous state unless explicitly toggled this session)
  let collapsed = true;
  try { localStorage.setItem('scaleCardCollapsed', '1'); } catch {}

  const applyCollapsed = (isCollapsed) => {
    if (isCollapsed) {
      scaleDisplay.classList.add('collapsed');
    } else {
      scaleDisplay.classList.remove('collapsed');
    }
    if (content) {
      content.style.display = isCollapsed ? 'none' : '';
      content.style.padding = isCollapsed ? '0' : '15px';
      content.style.margin = isCollapsed ? '0' : '';
    }
    if (brInfo) brInfo.style.display = isCollapsed ? 'none' : '';
    // Ensure no extra bottom space on the card container itself
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

// Sidebar click-toggle with hamburger button and CSS overrides injected at runtime
function setupSidebarToggle() {
  const panel = document.getElementById('settings-panel');
  let toggle = document.getElementById('settings-toggle');
  if (!panel) return;

  // Inject CSS overrides to disable hover-open behavior and enforce open class
  if (!document.getElementById('runtime-overrides')) {
    const style = document.createElement('style');
    style.id = 'runtime-overrides';
    style.textContent = `
      .settings-panel:not(.open) { left: -300px !important; }
      .settings-panel.open { left: 0 !important; }
    `;
    document.head.appendChild(style);
  }

  // Always create an additional floating hamburger to guarantee visibility
  const createFloating = () => {
    let btn = document.getElementById('settings-toggle-float');
    if (btn) return btn;
    btn = document.createElement('button');
    btn.id = 'settings-toggle-float';
    btn.type = 'button';
    btn.title = 'Ouvrir/fermer le panneau (H)';
    btn.innerHTML = '<span style="font-size:20px; line-height:1">☰</span>';
    Object.assign(btn.style, {
      position: 'fixed',
      left: '12px',
      top: '16px',
      width: '46px',
      height: '46px',
      background: 'linear-gradient(145deg, rgba(0, 20, 40, 0.98) 0%, rgba(0, 40, 80, 0.95) 100%)',
      border: '1px solid #00ffff',
      borderRadius: '12px',
      color: '#00ffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 0 18px rgba(0,255,255,0.35)',
      zIndex: '9999'
    });
    document.body.appendChild(btn);
    return btn;
  };

  // Reposition original as fixed hamburger (if present)
  if (toggle) {
    // Hide the original toggle inside the sidebar to avoid duplicate hamburgers
    toggle.style.display = 'none';
  }

  // Create floating guaranteed-visible button
  const floatBtn = createFloating();

  // Start closed
  panel.classList.remove('open');
  // Ensure initial visibility: hamburger visible when panel is closed
  floatBtn.style.display = 'flex';

  const setUIByPanelState = () => {
    const isOpen = panel.classList.contains('open');
    floatBtn.style.display = isOpen ? 'none' : 'flex';
  };

  const togglePanel = () => {
    panel.classList.toggle('open');
    setUIByPanelState();
  };

  // Click handlers for both buttons
  if (toggle) toggle.addEventListener('click', togglePanel);
  floatBtn.addEventListener('click', togglePanel);

  // Keyboard fallback: press "H" to toggle the panel
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'h') {
      panel.classList.toggle('open');
      setUIByPanelState();
    }
  });

  // Close on outside click: clicking outside the panel closes it and shows hamburger
  document.addEventListener('click', (e) => {
    const isOpen = panel.classList.contains('open');
    if (!isOpen) return;
    const clickInsidePanel = panel.contains(e.target);
    if (!clickInsidePanel) {
      panel.classList.remove('open');
      setUIByPanelState();
    }
  });
  // Prevent inside clicks from bubbling to document and closing the panel
  panel.addEventListener('click', (e) => e.stopPropagation());
  floatBtn.addEventListener('click', (e) => e.stopPropagation());
}

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
        // Keep the bottom-right card hidden and only update the top-right HUD
        const targetItem = document.getElementById('target-distance-item');
        if (targetItem) targetItem.style.display = 'none';
        // Update minimalist HUD in top-right
        updateDistanceHUD(formatDistance(distanceToTargetKm));
    } else {
        const targetItem = document.getElementById('target-distance-item');
        if (targetItem) targetItem.style.display = 'none';
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
let followOffset = null;   // Offset caméra conservé par rapport à l'objet suivi
let followAutoOrbit = true; // La caméra orbite doucement autour de l'astre suivi

function onDocumentMouseDown(event) {
  event.preventDefault();
  // Ignore clicks originating from UI panels/buttons to avoid swallowing UI interactions
  const target = event.target;
  if (
    target.closest('#scale-display') ||
    target.closest('#settings-panel') ||
    target.closest('#planet-tooltip')
  ) {
    return; // let the UI handle this
  }
  // Only respond to clicks on the WebGL canvas element, ignore everything else
  if (target !== renderer.domElement) {
    return;
  }

  // Mettre à jour les coordonnées de la souris
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Configurer le raycaster
  raycaster.setFromCamera(mouse, camera);
  
  // Chercher les intersections (inclure les enfants des groupes)
  const intersects = raycaster.intersectObjects(raycastTargets, true);
  
  console.log("🖱️ Clic détecté:", mouse, "Intersections:", intersects.length);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
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

// Trouver un ancêtre qui porte des métadonnées de lune de Mars
function findAncestorMarsMoon(obj) {
  let cur = obj;
  while (cur) {
    if (cur.userData && cur.userData.isMarsMoon) return cur;
    cur = cur.parent;
  }
  return null;
}

function identifyPlanet(clickedObject) {
  // Logic to identify which planet/moon was clicked based on the clicked object
  
  // Check sun first
  if (clickedObject === sun || clickedObject.material === sun.material) {
    return { type: 'sun', name: 'sun', object: sun };
  }
  
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
  
  // Check Earth moons (including Kepler satellite)
  if (typeof earth !== 'undefined' && earth.moons) {
    for (let i = 0; i < earth.moons.length; i++) {
      const moon = earth.moons[i];
      if (moon.mesh && (clickedObject === moon.mesh || clickedObject.material === moon.mesh.material)) {
        offset = 5;
        const moonName = moon.name || (i === 0 ? 'moon' : 'Kepler');
        return { type: 'moon', name: moonName, object: moon.mesh, parent: 'earth' };
      }
      // Also check children for GLTF models
      if (moon.mesh) {
        let found = false;
        moon.mesh.traverse(child => {
          if (child === clickedObject) {
            found = true;
          }
        });
        if (found) {
          offset = 5;
          const moonName = moon.name || (i === 0 ? 'moon' : 'Kepler');
          return { type: 'moon', name: moonName, object: moon.mesh, parent: 'earth' };
        }
      }
    }
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

  // Check Mars' moons (support GLTF hierarchy)
  const marsMoonNode = findAncestorMarsMoon(clickedObject);
  if (marsMoonNode) {
    const name = marsMoonNode.userData.marsMoonName || 'Phobos';
    return { type: 'moon', name, object: marsMoonNode, parent: 'Mars' };
  }

  // Fallback: climb parents to match the loaded GLTF root of Phobos/Deimos
  if (Array.isArray(marsMoons)) {
    let cur = clickedObject;
    while (cur) {
      const found = marsMoons.find(m => m && m.mesh === cur);
      if (found) {
        return { type: 'moon', name: found.name || 'Phobos', object: cur, parent: 'Mars' };
      }
      cur = cur.parent;
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
  
  // Le tooltip flottant peut ne pas exister: on continue quand même et on met à jour le panneau bas-droite
  if (!tooltip) {
    console.warn("⚠️ Tooltip flottant introuvable: utilisation du panneau bas-droite uniquement.");
  }

  let objectInfo;
  let displayName;
  let displayType;
  
  if (objectType === 'sun') {
    displayName = 'Soleil';
    displayType = 'Étoile';
    objectInfo = {
      radius: '696,340 km',
      distance: '—',
      orbit: '—',
      moons: '—',
      info: "Le Soleil est l'étoile au centre du Système solaire. Il fournit l'énergie lumineuse et thermique à l'origine de la vie sur Terre."
    };
  } else if (objectType === 'moon') {
    // Support both Earth's moon and named moons (Io, Europa, etc.)
    if (objectName === 'moon') {
      displayName = 'Lune';
      displayType = 'Satellite naturel';
      objectInfo = planetData[displayName] || {
        radius: '1,737 km',
        distance: '384,400 km de la Terre',
        orbit: '27.3 jours',
        moons: '0',
        info: 'La Lune est le seul satellite naturel de la Terre.'
      };
    } else {
      // Try to map directly to data keys (Io, Europa, Ganymède, Callisto, ...)
      displayName = objectName; // already capitalized by identifyPlanet
      displayType = 'Satellite naturel';
      objectInfo = planetData[displayName];
      // If not found, try a fallback with first-letter uppercased
      if (!objectInfo && typeof displayName === 'string') {
        const alt = displayName.charAt(0).toUpperCase() + displayName.slice(1);
        objectInfo = planetData[alt];
      }
      // Final fallback minimal info
      if (!objectInfo) {
        objectInfo = { radius: '—', distance: '—', orbit: '—', moons: '0', info: '' };
      }
    }
  } else {
    // Data for planets - CORRECTION: utiliser la bonne clé
    const planetKey = objectName.charAt(0).toUpperCase() + objectName.slice(1);
    objectInfo = planetData[planetKey];
    displayName = planetKey;
    displayType = 'Planète';
    
    console.log("🔍 Recherche données planète:", planetKey, "Trouvé:", !!objectInfo);
  }
  
  // Mettre à jour le titre du card avec le nom de l'astre sélectionné
  if (displayName) setScaleCardTitle(displayName);

  if (!objectInfo) return;
  
  // Also update the bottom-right info panel (preferred display)
  ensureBottomRightInfoPanel();
  updateBottomRightInfo(displayName, displayType, objectInfo, objectType);

  // Hide legacy floating tooltip to avoid duplicate displays
  if (tooltip) tooltip.classList.remove('show');
  
  // NE PAS bouger la caméra automatiquement; l'utilisateur décide s'il veut centrer
}

// Fonction pour centrer sur un objet (planète, lune ou soleil) avec déplacement caméra
function centerOnPlanet(objectName, objectType = 'planet') {
  let targetObject = null;

  if (objectType === 'sun') {
    targetObject = sun;
  } else if (objectType === 'moon') {
    // Trouver la lune correspondante
    const key = (objectName || '').toLowerCase();
    switch (key) {
      case 'moon':
      case 'lune': {
        if (earth?.moons?.[0]?.mesh) targetObject = earth.moons[0].mesh;
        break;
      }
      case 'kepler': {
        if (earth?.moons?.[1]?.mesh) targetObject = earth.moons[1].mesh;
        break;
      }
      case 'io': {
        if (jupiter?.moons?.[0]?.mesh) targetObject = jupiter.moons[0].mesh;
        break;
      }
      case 'europa': {
        if (jupiter?.moons?.[1]?.mesh) targetObject = jupiter.moons[1].mesh;
        break;
      }
      case 'ganymède':
      case 'ganymede': {
        if (jupiter?.moons?.[2]?.mesh) targetObject = jupiter.moons[2].mesh;
        break;
      }
      case 'callisto': {
        if (jupiter?.moons?.[3]?.mesh) targetObject = jupiter.moons[3].mesh;
        break;
      }
      case 'phobos':
      case 'deimos': {
        const found = Array.isArray(marsMoons) ? marsMoons.find(m => (m.name || '').toLowerCase() === key && m.mesh) : null;
        if (found) targetObject = found.mesh;
        break;
      }
      default: {
        // Fallback recherches
        if (!targetObject && Array.isArray(jupiter?.moons)) {
          const names = ['io','europa','ganymède','ganymede','callisto'];
          const idx = names.indexOf(key);
          if (idx >= 0 && jupiter.moons[idx]?.mesh) targetObject = jupiter.moons[idx].mesh;
        }
        if (!targetObject && Array.isArray(marsMoons)) {
          const found = marsMoons.find(m => (m.name || '').toLowerCase() === key && m.mesh);
          if (found) targetObject = found.mesh;
        }
      }
    }
  } else {
    // Planètes
    switch ((objectName || '').toLowerCase()) {
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
    followedPlanet = targetObject;

    const objectPosition = new THREE.Vector3();
    if (typeof targetObject.getWorldPosition === 'function') {
      targetObject.getWorldPosition(objectPosition);
    } else if (targetObject.position) {
      objectPosition.copy(targetObject.position);
    }

    // Déterminer un rayon apparent de l'objet pour choisir un zoom optimal
    const computeRadius = (obj) => {
      let r = 10;
      if (obj && obj.geometry) {
        if (!obj.geometry.boundingSphere) obj.geometry.computeBoundingSphere();
        if (obj.geometry.boundingSphere) r = Math.max(r, obj.geometry.boundingSphere.radius);
      }
      // Groupes: essayer de trouver un mesh enfant
      if (r === 10 && obj && obj.children && obj.children.length) {
        for (const ch of obj.children) {
          if (ch.geometry) {
            if (!ch.geometry.boundingSphere) ch.geometry.computeBoundingSphere();
            if (ch.geometry.boundingSphere) { r = Math.max(r, ch.geometry.boundingSphere.radius); break; }
          }
        }
      }
      // Spécial Soleil: rayon connu
      if (obj === sun && typeof sunGeom?.parameters?.radius === 'number') {
        r = Math.max(r, sunGeom.parameters.radius);
      }
      return r;
    };

    const radius = computeRadius(targetObject);
    const optimalDistance = Math.min(Math.max(radius * 6, 15), 500); // Zoom agréable, clampé

    // Direction de vue stable: de l'objet vers la caméra actuelle (sinon direction par défaut)
    let viewDir = new THREE.Vector3().subVectors(camera.position, objectPosition);
    if (viewDir.length() < 1e-3) viewDir.set(1, 0.6, 0.4);
    viewDir.normalize();

    const desiredCameraPos = objectPosition.clone().add(viewDir.multiplyScalar(optimalDistance));

    // Enregistrer l'offset de suivi et activer le suivi + auto-orbite
    followOffset = desiredCameraPos.clone().sub(objectPosition);
    followAutoOrbit = true;
    // Animer la caméra et le target pour atteindre la position initiale de suivi
    animateCameraTo(desiredCameraPos, objectPosition);

    const emoji = objectType === 'moon' ? '🌙' : (objectType === 'sun' ? '☀️' : '🪐');
    console.log(`${emoji} Centré sur ${objectName} (${objectType})`);
  } else {
    console.warn('centerOnPlanet: target introuvable pour', objectName, objectType);
  }
}

// Fonction pour zoomer sur une planète
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
// ******  SUN  ******
let sunMat;

const sunSize = 697/40; // 40 times smaller scale than earth
const sunGeom = new THREE.SphereGeometry(sunSize, 32, 20);
sunMat = new THREE.MeshStandardMaterial({
  emissive: 0xFFF88F,
  emissiveMap: loadTexture.load(sunTexture),
  emissiveIntensity: settings.sunIntensity
});
const sun = new THREE.Mesh(sunGeom, sunMat);
solarRoot.add(sun);

//point light in the sun
const pointLight = new THREE.PointLight(0xFDFFD3 , 1200, 400, 1.4);
solarRoot.add(pointLight);


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
      if (moon.isModel && moon.modelPath) {
        // Load 3D model for this moon (like Kepler satellite)
        loadObject(moon.modelPath, moon.orbitRadius, moon.scale, function(loadedModel) {
          moon.mesh = loadedModel;
          console.log(`🛰️ ${moon.name} loaded as Earth moon`);
          
          // Tag for identification
          if (moon.mesh) {
            moon.mesh.name = moon.name;
            moon.mesh.userData.isEarthMoon = true;
            moon.mesh.userData.moonName = moon.name;
            moon.mesh.traverse(function (child) {
              if (child.isMesh) {
                child.name = moon.name;
                child.userData.isEarthMoon = true;
                child.userData.moonName = moon.name;
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
          }
          
          // Add to planet system instead of solarRoot
          planetSystem.add(moon.mesh);
          
          // Add to raycast targets
          if (typeof raycastTargets !== 'undefined') {
            raycastTargets.push(moon.mesh);
            console.log('🛰️ Satellite ajouté aux raycastTargets:', moon.name);
          }
        });
      } else {
        // Regular spherical moon
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
        const moonOrbitDistance = moon.orbitRadius || size * 1.5;
        moonMesh.position.set(moonOrbitDistance, 0, 0);
        planetSystem.add(moonMesh);
        moon.mesh = moonMesh;
      }
    });
  }
  //add planet system to planet3d object and to the scene
  planet3d.add(planetSystem);
  solarRoot.add(planet3d);
  return {name, planet, planet3d, Atmosphere, moons, planetSystem, Ring};
}


// ******  LOADING OBJECTS METHOD  ******
// Setup DRACO loader for compressed models
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

function loadObject(path, position, scale, callback) {
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  loader.load(path, function (gltf) {
      const obj = gltf.scene;
      obj.position.set(position, 0, 0);
      obj.scale.set(scale, scale, scale);
      solarRoot.add(obj);
      if (callback) {
        callback(obj);
      }
  }, undefined, function (error) {
      console.error('An error happened', error);
  });
}

// ******  ASTEROIDS  ******
const asteroids = [];
function loadAsteroids(path, numberOfAsteroids, minOrbitRadius, maxOrbitRadius) {
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load(path, function (gltf) {
      gltf.scene.traverse(function (child) {
          if (child.isMesh) {
              for (let i = 0; i < numberOfAsteroids / 12; i++) { // Divide by 12 because there are 12 asteroids in the pack
                  const asteroid = child.clone();
                  const orbitRadius = THREE.MathUtils.randFloat(minOrbitRadius, maxOrbitRadius);
                  const angle = Math.random() * Math.PI * 2;
                  const x = orbitRadius * Math.cos(angle);
                  const y = 0;
                  const z = orbitRadius * Math.sin(angle);
                  child.receiveShadow = true;
                  asteroid.position.set(x, y, z);
                  asteroid.scale.setScalar(THREE.MathUtils.randFloat(0.8, 1.2));
                  solarRoot.add(asteroid);
                  asteroids.push(asteroid);
              }
          }
      });
  }, undefined, function (error) {
      console.error('An error happened', error);
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


// ******  MOONS  ******
// Earth
const earthMoon = [
  {
    size: 1.6,
    texture: earthMoonTexture,
    bump: earthMoonBump,
    orbitSpeed: 0.001,
    orbitRadius: 10
  },
  {
    name: 'Kepler',
    modelPath: '/images/satellites/Kepler.glb',
    scale: 0.07,
    orbitRadius: 7,
    orbitSpeed: 0.0008,
    isModel: true
  }
]

// Mars' moons with path to 3D models (phobos & deimos)
const marsMoons = [
  {
    name: 'Phobos',
    modelPath: '/images/mars/phobos.glb',
    scale: 0.1,
    orbitRadius: 5,
    orbitSpeed: 0.002,
    position: 100,
    mesh: null
  },
  {
    name: 'Deimos',
    modelPath: '/images/mars/deimos.glb',
    scale: 0.1,
    orbitRadius: 9,
    orbitSpeed: 0.0005,
    position: 120,
    mesh: null
  }
];

// Earth satellites (removed - Kepler is now treated as a moon)
// const earthSatellites = [];

// Jupiter
const jupiterMoons = [
  {
    size: 1.6,
    texture: ioTexture,
    orbitRadius: 20,
    orbitSpeed: 0.0005
  },
  {
    size: 1.4,
    texture: europaTexture,
    orbitRadius: 24,
    orbitSpeed: 0.00025
  },
  {
    size: 2,
    texture: ganymedeTexture,
    orbitRadius: 28,
    orbitSpeed: 0.000125
  },
  {
    size: 1.7,
    texture: callistoTexture,
    orbitRadius: 32,
    orbitSpeed: 0.00006
  }
];

// ******  PLANET CREATIONS  ******
console.log("🪐 Creating planets...");
const mercury = new createPlanet('Mercury', 2.4, 40, 0, mercuryTexture, mercuryBump);
console.log("✅ Mercury created:", mercury);

const venus = new createPlanet('Venus', 6.1, 65, 3, venusTexture, venusBump, null, venusAtmosphere);
console.log("✅ Venus created:", venus);

const earth = new createPlanet('Earth', 6.4, 90, 23, earthMaterial, null, null, earthAtmosphere, earthMoon);
console.log("✅ Earth created:", earth);

const mars = new createPlanet('Mars', 3.4, 115, 25, marsTexture, marsBump);
console.log("✅ Mars created:", mars);
// Load Mars moons
marsMoons.forEach(moon => {
  loadObject(moon.modelPath, moon.position, moon.scale, function(loadedModel) {
    moon.mesh = loadedModel;
    console.log(`🌙 ${moon.name} loaded and positioned`);
    // Tag root and children for reliable hit-testing and naming
    if (moon.mesh) {
      moon.mesh.name = moon.name;
      moon.mesh.userData.isMarsMoon = true;
      moon.mesh.userData.marsMoonName = moon.name;
      moon.mesh.traverse(function (child) {
        if (child.isMesh) {
          child.name = moon.name;
          child.userData.isMarsMoon = true;
          child.userData.marsMoonName = moon.name;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }

    mars.planetSystem.add(moon.mesh);
    // Add to raycast targets once available (children covered via recursive raycast)
    if (typeof raycastTargets !== 'undefined') {
      raycastTargets.push(moon.mesh);
      console.log('🌙 Lune de Mars ajoutée aux raycastTargets:', moon.name);
    }
  });
});

// Earth satellites are now handled as moons in the createPlanet function

const jupiter = new createPlanet('Jupiter', 69/4, 200, 3, jupiterTexture, null, null, null, jupiterMoons);
const saturn = new createPlanet('Saturn', 58/4, 270, 26, saturnTexture, null, {
  innerRadius: 18, 
  outerRadius: 29, 
  texture: satRingTexture
});
const uranus = new createPlanet('Uranus', 25/4, 320, 82, uranusTexture, null, {
  innerRadius: 6, 
  outerRadius: 8, 
  texture: uraRingTexture
});
const neptune = new createPlanet('Neptune', 24/4, 340, 28, neptuneTexture);
const pluto = new createPlanet('Pluto', 1, 350, 57, plutoTexture);
console.log("✅ Pluto created:", pluto);

console.log("🎯 All planets created, setting up raycast targets...");

// Array of planets, atmospheres and moons for raycasting
const raycastTargets = [];

// Add sun
if (typeof sun !== 'undefined' && sun) raycastTargets.push(sun);

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
    },
    'Phobos': {
        radius: '11.3 km',
        distance: '≈ 9,376 km de Mars',
        orbit: '7 h 39 min',
        moons: '0',
        info: "Phobos est la plus grande et la plus proche des deux lunes de Mars. Sa surface est fortement cratérisée ; elle se rapproche lentement de Mars sous l’effet des forces de marée."
    },
    'Kepler': {
  radius: '4.7 m (diamètre)',
  distance: '≈ 15 UA de la Terre (orbite héliocentrique)',
  orbit: '372.5 jours',
  moons: '0',
  info: 'Télescope spatial Kepler, lancé en 2009 pour détecter des exoplanètes par la méthode du transit. A découvert plus de 2600 planètes confirmées.'
},
    'Deimos': {
        radius: '6.2 km',
        distance: '≈ 23,460 km de Mars',
        orbit: '30 h 18 min',
        moons: '0',
        info: "Deimos est la plus petite et la plus éloignée des deux lunes de Mars. Elle a une surface relativement lisse recouverte de régolithe."
    }
};


// Array of planets, atmospheres and moons for raycasting - MOVED AFTER PLANET CREATION

// ******  SHADOWS  ******
renderer.shadowMap.enabled = true;
pointLight.castShadow = true;

//properties for the point light
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 10;
pointLight.shadow.camera.far = 20;

//casting and receiving shadows
earth.planet.castShadow = true;
earth.planet.receiveShadow = true;
earth.Atmosphere.castShadow = true;
earth.Atmosphere.receiveShadow = true;
earth.moons.forEach(moon => {
  if (moon.mesh) {
    moon.mesh.castShadow = true;
    moon.mesh.receiveShadow = true;
  }
});
mercury.planet.castShadow = true;
mercury.planet.receiveShadow = true;
venus.planet.castShadow = true;
venus.planet.receiveShadow = true;
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
saturn.Ring.receiveShadow = true;
uranus.planet.receiveShadow = true;
neptune.planet.receiveShadow = true;
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
    if (moon.mesh) {
      const time = performance.now();
      const tiltAngle = 5 * Math.PI / 180;

      const moonSpeed = moon.orbitSpeed * settings.accelerationOrbit * 0.2; // slower
      const moonX = earth.planet.position.x + moon.orbitRadius * Math.cos(time * moonSpeed);
      const moonY = moon.orbitRadius * Math.sin(time * moonSpeed) * Math.sin(tiltAngle);
      const moonZ = earth.planet.position.z + moon.orbitRadius * Math.sin(time * moonSpeed) * Math.cos(tiltAngle);

      moon.mesh.position.set(moonX, moonY, moonZ);
      moon.mesh.rotateY(0.01);
    }
  });
}
// Animate Mars' moons
if (marsMoons){
marsMoons.forEach(moon => {
  if (moon.mesh) {
    const time = performance.now();

    const moonSpeed = moon.orbitSpeed * settings.accelerationOrbit * 0.2;
    const moonX = mars.planet.position.x + moon.orbitRadius * Math.cos(time * moonSpeed);
    const moonY = moon.orbitRadius * Math.sin(time * moonSpeed);
    const moonZ = mars.planet.position.z + moon.orbitRadius * Math.sin(time * moonSpeed);

    moon.mesh.position.set(moonX, moonY, moonZ);
    moon.mesh.rotateY(0.001);
  }
});
}

// Animate Jupiter's moons
if (jupiter.moons) {
  jupiter.moons.forEach(moon => {
    const time = performance.now();
    const moonSpeed = moon.orbitSpeed * settings.accelerationOrbit * 0.2;
    const moonX = jupiter.planet.position.x + moon.orbitRadius * Math.cos(time * moonSpeed);
    const moonY = moon.orbitRadius * Math.sin(time * moonSpeed);
    const moonZ = jupiter.planet.position.z + moon.orbitRadius * Math.sin(time * moonSpeed);

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
// ******  LOAD ASTEROIDS  ******
loadAsteroids('/asteroids/asteroidPack.glb', 1000, 130, 160);
loadAsteroids('/asteroids/asteroidPack.glb', 3000, 352, 370);

// ===== FONCTION D'ANIMATION PRINCIPALE =====
let __lastFrameTime = performance.now();
function animate() {
  const now = performance.now();
  const dt = Math.max(0.001, (now - __lastFrameTime) / 1000);
  __lastFrameTime = now;

  // Dynamic scaling when zooming out to prevent disappearing due to far plane
  const dist = camera.position.length();
  const scaleThreshold = 200; // start scaling beyond this distance
  if (dist > scaleThreshold) {
    const s = Math.max(0.0005, scaleThreshold / dist);
    solarRoot.scale.set(s, s, s);
  } else {
    solarRoot.scale.set(1, 1, 1);
  }
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
      if (moon.mesh) {
        const time = performance.now();
        const tiltAngle = 5 * Math.PI / 180;

        const speed = moon.orbitSpeed * settings.accelerationOrbit;
        const moonX = earth.planet.position.x + moon.orbitRadius * Math.cos(time * speed);
        const moonY = moon.orbitRadius * Math.sin(time * speed) * Math.sin(tiltAngle);
        const moonZ = earth.planet.position.z + moon.orbitRadius * Math.sin(time * speed) * Math.cos(tiltAngle);

        moon.mesh.position.set(moonX, moonY, moonZ);
        moon.mesh.rotateY(0.01);
      }
    });
  }

  // Animation des lunes de Mars
  if (marsMoons) {
    marsMoons.forEach(moon => {
      if (moon.mesh) {
        const time = performance.now();
        const speed = moon.orbitSpeed * settings.accelerationOrbit;
        const moonX = mars.planet.position.x + moon.orbitRadius * Math.cos(time * speed);
        const moonY = moon.orbitRadius * Math.sin(time * speed);
        const moonZ = mars.planet.position.z + moon.orbitRadius * Math.sin(time * speed);
        moon.mesh.position.set(moonX, moonY, moonZ);
        moon.mesh.rotateY(0.001);
      }
    });
  }

  // Animation des lunes de Jupiter
  if (jupiter.moons) {
    jupiter.moons.forEach(moon => {
      const time = performance.now();
      const speed = moon.orbitSpeed * settings.accelerationOrbit;
      const moonX = jupiter.planet.position.x + moon.orbitRadius * Math.cos(time * speed);
      const moonY = moon.orbitRadius * Math.sin(time * speed);
      const moonZ = jupiter.planet.position.z + moon.orbitRadius * Math.sin(time * speed);
      moon.mesh.position.set(moonX, moonY, moonZ);
      moon.mesh.rotateY(0.01);
    });
  }

  // Animation des satellites de la Terre (maintenant gérés comme lunes)

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

  // Suivre la planète sélectionnée en temps réel
  if (followedPlanet) {
    const currentPosition = new THREE.Vector3();
    followedPlanet.getWorldPosition(currentPosition);
    
    // Si on a un offset de suivi, maintenir la distance relative
    if (followOffset) {
      const newCameraPosition = currentPosition.clone().add(followOffset);
      camera.position.copy(newCameraPosition);
      
      // Auto-orbite douce autour de l'objet suivi
      if (followAutoOrbit) {
        const orbitSpeed = 0.0002; // Très lent
        const rotationMatrix = new THREE.Matrix4().makeRotationY(orbitSpeed);
        followOffset.applyMatrix4(rotationMatrix);
      }
    }
    
    // Toujours pointer vers l'objet suivi
    controls.target.copy(currentPosition);
  }
  controls.update();
  updateCoordinates(); // Update HUD coordinates
  updateScaleDisplay(); // Update scale and distance display
  requestAnimationFrame(animate);
  composer.render();
}

// Initialize HUD after everything is loaded
initializeHUD();

animate();

// Ne pas attacher les événements sur window pour éviter d'interférer avec l'UI
// Les événements sont gérés sur renderer.domElement uniquement.
console.log("✅ Mouse events attached to canvas only");

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
