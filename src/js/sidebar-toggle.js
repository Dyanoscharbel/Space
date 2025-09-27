/**
 * Sidebar Toggle Functionality
 * Gère l'affichage/masquage de la sidebar avec bouton toggle
 */

class SidebarToggle {
  constructor() {
    this.sidebar = null;
    this.toggleBtn = null;
    this.canvas = null;
    this.isVisible = true; // Par défaut visible
    
    this.init();
  }
  
  init() {
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  setup() {
    // Récupérer les éléments
    this.sidebar = document.getElementById('hud-left-panel');
    this.toggleBtn = document.getElementById('sidebar-toggle');
    this.canvas = document.getElementById('canvas-container');
    
    if (!this.sidebar || !this.toggleBtn || !this.canvas) {
      console.warn('SidebarToggle: Éléments requis non trouvés');
      return;
    }
    
    // Configuration initiale
    this.setupInitialState();
    
    // Événements
    this.setupEventListeners();
    
    console.log('✅ SidebarToggle initialisé');
  }
  
  setupInitialState() {
    // Commencer avec la sidebar visible
    this.sidebar.classList.remove('hidden');
    this.toggleBtn.classList.add('hidden');
    this.isVisible = true;
  }
  
  setupEventListeners() {
    // Clic sur le bouton toggle
    this.toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showSidebar();
    });
    
    // Clic sur le canvas pour masquer la sidebar
    this.canvas.addEventListener('click', (e) => {
      if (this.isVisible) {
        this.hideSidebar();
      }
    });
    
    // Empêcher la propagation des clics dans la sidebar
    this.sidebar.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
    // Raccourci clavier (Échap pour masquer)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible) {
        this.hideSidebar();
      }
    });
    
    // Raccourci clavier (Tab pour afficher)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && !this.isVisible) {
        e.preventDefault();
        this.showSidebar();
      }
    });
  }
  
  showSidebar() {
    if (this.isVisible) return;
    
    // Afficher la sidebar
    this.sidebar.classList.remove('hidden');
    this.sidebar.classList.add('visible');
    
    // Masquer le bouton toggle
    this.toggleBtn.classList.add('hidden');
    
    this.isVisible = true;
    
    // Animation d'entrée
    this.sidebar.style.animation = 'slideInFromLeft 0.3s ease-out';
    
    console.log('🔓 Sidebar affichée');
  }
  
  hideSidebar() {
    if (!this.isVisible) return;
    
    // Masquer la sidebar
    this.sidebar.classList.add('hidden');
    this.sidebar.classList.remove('visible');
    
    // Afficher le bouton toggle après un délai
    setTimeout(() => {
      this.toggleBtn.classList.remove('hidden');
    }, 200);
    
    this.isVisible = false;
    
    console.log('🔒 Sidebar masquée');
  }
  
  toggle() {
    if (this.isVisible) {
      this.hideSidebar();
    } else {
      this.showSidebar();
    }
  }
  
  // Méthodes publiques pour contrôle externe
  show() {
    this.showSidebar();
  }
  
  hide() {
    this.hideSidebar();
  }
  
  isOpen() {
    return this.isVisible;
  }
}

// Auto-initialisation
const sidebarToggle = new SidebarToggle();

// Export pour utilisation externe
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SidebarToggle;
}

// Global pour accès depuis la console
window.sidebarToggle = sidebarToggle;
