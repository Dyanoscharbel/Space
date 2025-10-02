// ===== SYSTÈME DE RECHERCHE RAPIDE CTRL+K =====

class KeplerSearchSystem {
    constructor() {
        this.isVisible = false;
        this.selectedIndex = -1;
        this.suggestions = [];
        
        // Systèmes disponibles (Système Solaire + Kepler)
        this.keplerSystems = [
            'Système Solaire', // ⭐ Système Solaire en premier
            'Kepler-11', 'Kepler-90', 'Kepler-186', 'Kepler-442', 'Kepler-452',
            'Kepler-20', 'Kepler-62', 'Kepler-444', 'Kepler-296', 'Kepler-438',
            'Kepler-283', 'Kepler-1649', 'Kepler-1411', 'Kepler-257', 'Kepler-1638',
            'Kepler-1544', 'Kepler-1552', 'Kepler-395', 'Kepler-28'
        ];
        
        this.init();
    }
    
    init() {
        this.createHTML();
        this.bindEvents();
        this.showHelpPopup();
    }
    
    createHTML() {
        // Popup d'aide
        const helpPopup = document.createElement('div');
        helpPopup.className = 'help-popup';
        helpPopup.id = 'help-popup';
        helpPopup.innerHTML = `
            <button class="close-btn" onclick="this.parentElement.remove()">×</button>
            <div class="help-title">
                🚀 Navigation Rapide
            </div>
            <div class="help-text">
                Recherchez rapidement un système Kepler
            </div>
            <div class="help-text">
                Appuyez sur <span class="help-shortcut">Ctrl + K</span>
            </div>
        `;
        
        // Overlay de recherche
        const searchOverlay = document.createElement('div');
        searchOverlay.className = 'search-overlay';
        searchOverlay.id = 'search-overlay';
        searchOverlay.innerHTML = `
            <div class="search-container">
                <div class="search-header">
                    🔍 Recherche de Système Kepler
                </div>
                <div class="search-body">
                    <div class="search-input-group">
                        <input 
                            type="text" 
                            class="search-input" 
                            id="search-input"
                            placeholder="Tapez le nom d'un système (ex: Kepler-11, Kepler-442...)"
                            autocomplete="off"
                        >
                        <div class="search-icon">🔍</div>
                    </div>
                    <div class="search-suggestions" id="search-suggestions"></div>
                    <div class="search-help">
                        <div class="search-help-item">
                            <span class="search-key">↑↓</span>
                            <span>Naviguer dans les suggestions</span>
                        </div>
                        <div class="search-help-item">
                            <span class="search-key">Enter</span>
                            <span>Charger le système sélectionné</span>
                        </div>
                        <div class="search-help-item">
                            <span class="search-key">Esc</span>
                            <span>Fermer la recherche</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Ajouter les éléments au DOM
        document.body.appendChild(helpPopup);
        document.body.appendChild(searchOverlay);
        
        // Références
        this.helpPopup = helpPopup;
        this.searchOverlay = searchOverlay;
        this.searchInput = document.getElementById('search-input');
        this.searchSuggestions = document.getElementById('search-suggestions');
    }
    
    bindEvents() {
        // Ctrl+K pour ouvrir la recherche
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.showSearch();
            }
            
            if (this.isVisible) {
                if (e.key === 'Escape') {
                    this.hideSearch();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.selectNext();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.selectPrevious();
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    this.selectCurrent();
                }
            }
        });
        
        // Clic sur l'overlay pour fermer
        this.searchOverlay.addEventListener('click', (e) => {
            if (e.target === this.searchOverlay) {
                this.hideSearch();
            }
        });
        
        // Input de recherche
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        // Focus sur clic dans l'input
        this.searchInput.addEventListener('click', () => {
            this.searchInput.focus();
        });
        
        // Clic sur le popup d'aide pour l'ouvrir
        this.helpPopup.addEventListener('click', (e) => {
            if (!e.target.classList.contains('close-btn')) {
                this.showSearch();
            }
        });
    }
    
    showHelpPopup() {
        // Afficher le popup d'aide au chargement
        setTimeout(() => {
            if (this.helpPopup && this.helpPopup.parentElement) {
                this.helpPopup.style.display = 'block';
                
                // Auto-masquer après 10 secondes
                setTimeout(() => {
                    if (this.helpPopup && this.helpPopup.parentElement) {
                        this.helpPopup.classList.add('fade-out');
                        setTimeout(() => {
                            if (this.helpPopup && this.helpPopup.parentElement) {
                                this.helpPopup.remove();
                            }
                        }, 300);
                    }
                }, 10000);
            }
        }, 2000); // Attendre 2 secondes après le chargement
    }
    
    showSearch() {
        this.isVisible = true;
        this.searchOverlay.classList.add('active');
        
        // Focus avec délai pour s'assurer que l'overlay est affiché
        setTimeout(() => {
            this.searchInput.focus();
            this.searchInput.select(); // Sélectionner tout le texte s'il y en a
        }, 100);
        
        this.searchInput.value = '';
        this.selectedIndex = -1;
        this.showSuggestions(this.keplerSystems.slice(0, 8)); // Afficher les premiers systèmes
        
        // Masquer le popup d'aide si visible
        if (this.helpPopup && this.helpPopup.parentElement) {
            this.helpPopup.style.display = 'none';
        }
    }
    
    hideSearch() {
        this.isVisible = false;
        this.searchOverlay.classList.remove('active');
        this.selectedIndex = -1;
    }
    
    handleSearch(query) {
        if (!query.trim()) {
            this.showSuggestions(this.keplerSystems.slice(0, 8));
            return;
        }
        
        // Filtrer les suggestions (avec alias pour le système solaire)
        const queryLower = query.toLowerCase();
        const filtered = this.keplerSystems.filter(system => {
            const systemLower = system.toLowerCase();
            
            // Correspondance directe
            if (systemLower.includes(queryLower)) {
                return true;
            }
            
            // Alias pour le système solaire
            if (system === 'Système Solaire') {
                return ['solaire', 'terre', 'earth', 'home', 'maison'].some(alias => 
                    alias.includes(queryLower) || queryLower.includes(alias)
                );
            }
            
            return false;
        });
        
        // Ajouter la requête exacte si elle n'existe pas déjà
        if (!filtered.some(s => s.toLowerCase() === query.toLowerCase()) && 
            query.toLowerCase().startsWith('kepler-')) {
            filtered.unshift(query);
        }
        
        this.showSuggestions(filtered.slice(0, 10));
        this.selectedIndex = -1;
    }
    
    showSuggestions(suggestions) {
        this.suggestions = suggestions;
        
        if (suggestions.length === 0) {
            this.searchSuggestions.innerHTML = `
                <div class="search-suggestion">
                    <span>❌ Aucun système trouvé</span>
                </div>
            `;
            return;
        }
        
        const html = suggestions.map((system, index) => {
            const icon = system === 'Système Solaire' ? '🌍' : '🌌';
            return `
                <div class="search-suggestion" data-index="${index}" onclick="keplerSearch.loadSystem('${system}')">
                    <span>${icon}</span>
                    <span>${system}</span>
                </div>
            `;
        }).join('');
        
        this.searchSuggestions.innerHTML = html;
    }
    
    selectNext() {
        if (this.suggestions.length === 0) return;
        
        this.selectedIndex = (this.selectedIndex + 1) % this.suggestions.length;
        this.updateSelection();
    }
    
    selectPrevious() {
        if (this.suggestions.length === 0) return;
        
        this.selectedIndex = this.selectedIndex <= 0 ? 
            this.suggestions.length - 1 : 
            this.selectedIndex - 1;
        this.updateSelection();
    }
    
    updateSelection() {
        const items = this.searchSuggestions.querySelectorAll('.search-suggestion');
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedIndex);
        });
        
        // Scroll vers l'élément sélectionné
        if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
            items[this.selectedIndex].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }
    
    selectCurrent() {
        if (this.selectedIndex >= 0 && this.suggestions[this.selectedIndex]) {
            this.loadSystem(this.suggestions[this.selectedIndex]);
        } else if (this.searchInput.value.trim()) {
            // Utiliser la valeur tapée directement
            this.loadSystem(this.searchInput.value.trim());
        }
    }
    
    loadSystem(systemName) {
        console.log(`🔍 Chargement du système: ${systemName}`);
        
        // Fermer la recherche
        this.hideSearch();
        
        // Charger le système via le routeHandler
        if (window.solarSystemScript && window.solarSystemScript.routeHandler) {
            try {
                // Gérer le système solaire spécialement
                if (systemName === 'Système Solaire') {
                    window.solarSystemScript.routeHandler.navigateToSolarSystem();
                    this.showNotification(`🌍 Retour au Système Solaire - Actualisation...`, 'success');
                    
                    // Actualiser la page après un court délai
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                    
                } else {
                    window.solarSystemScript.routeHandler.navigateToKeplerSystem(systemName);
                    this.showNotification(`🚀 Chargement de ${systemName} - Actualisation...`, 'success');
                    
                    // Actualiser la page après un court délai
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
                
            } catch (error) {
                console.error('❌ Erreur lors du chargement:', error);
                this.showNotification(`❌ Erreur: ${systemName} introuvable`, 'error');
            }
        } else {
            console.error('❌ RouteHandler non disponible');
            this.showNotification('❌ Système de navigation non disponible', 'error');
        }
    }
    
    showNotification(message, type = 'info') {
        // Créer une notification temporaire
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 
                        type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 
                        'rgba(59, 130, 246, 0.9)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            z-index: 25000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.3s ease-out;
            cursor: pointer;
        `;
        notification.textContent = message;
        
        // Ajouter au DOM
        document.body.appendChild(notification);
        
        // Supprimer après 3 secondes ou au clic
        const remove = () => {
            notification.style.animation = 'fadeOut 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        };
        
        notification.addEventListener('click', remove);
        setTimeout(remove, 3000);
    }
}

// Initialiser le système au chargement
let keplerSearch = null;

// Attendre que le DOM soit chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        keplerSearch = new KeplerSearchSystem();
    });
} else {
    keplerSearch = new KeplerSearchSystem();
}

// Exporter pour utilisation globale
window.keplerSearch = keplerSearch;

export default KeplerSearchSystem;