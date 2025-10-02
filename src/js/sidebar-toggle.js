/**
 * Sidebar Toggle Functionality - Version Space_v1
 * Gère l'affichage/masquage de la sidebar avec bouton hamburger flottant
 */

// Sidebar click-toggle with hamburger button and CSS overrides injected at runtime
function setupSidebarToggle() {
  console.log('🔧 setupSidebarToggle() appelée');
  const panel = document.getElementById('settings-panel');
  let toggle = document.getElementById('settings-toggle');
  console.log('📋 Panel trouvé:', !!panel, 'Toggle trouvé:', !!toggle);
  if (!panel) {
    console.error('❌ Élément settings-panel non trouvé !');
    return;
  }

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
  console.log('🍔 Bouton hamburger créé:', !!floatBtn);

  // Start closed
  panel.classList.remove('open');
  // Ensure initial visibility: hamburger visible when panel is closed
  floatBtn.style.display = 'flex';
  console.log('🎯 État initial: sidebar fermée, bouton visible');

  const setUIByPanelState = () => {
    const isOpen = panel.classList.contains('open');
    floatBtn.style.display = isOpen ? 'none' : 'flex';
  };

  const togglePanel = () => {
    console.log('🔄 Toggle panel appelé');
    panel.classList.toggle('open');
    const isOpen = panel.classList.contains('open');
    console.log('📱 Nouvel état:', isOpen ? 'ouvert' : 'fermé');
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

// Auto-initialisation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupSidebarToggle);
} else {
  setupSidebarToggle();
}

// Export pour utilisation externe
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setupSidebarToggle };
}

// Global pour accès depuis la console
window.setupSidebarToggle = setupSidebarToggle;

console.log("✅ Sidebar Toggle (Space_v1 style) initialisé");
