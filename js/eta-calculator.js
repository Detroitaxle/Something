/**
 * ETA Calculator - Handles warehouse selection and state ETA calculations
 */
class ETACalculator {
    constructor() {
        // Default to Texas warehouse
        this.currentWarehouse = 'texas';
        
        // DOM Elements
        this.elements = {
            searchInput: document.getElementById('state-search'),
            resultsContainer: document.getElementById('eta-results'),
            warehouseTabs: document.querySelectorAll('.warehouse-tab')
        };
        
        // Initialize
        this.init();
    }
    
    init() {
        // Set initial warehouse color
        this.updateWarehouseColor();
        
        // Load initial data
        this.renderStateList();
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    /**
     * Render states list based on current filter and warehouse
     * @param {string} filter - Search filter text
     */
    renderStateList(filter = '') {
        // Clear previous results
        this.elements.resultsContainer.innerHTML = '';
        
        // Filter states based on search input
        const filteredStates = statesData.filter(state => 
            state.abbreviation.toLowerCase().includes(filter.toLowerCase()) || 
            state.name.toLowerCase().includes(filter.toLowerCase())
        );
        
        // Show message if no results
        if (filteredStates.length === 0) {
            this.elements.resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>No states found matching "${filter}"</p>
                    <p>Try searching by state name (e.g., "California") or abbreviation (e.g., "CA")</p>
                </div>
            `;
            return;
        }
        
        // Create cards for each matching state
        filteredStates.forEach(state => {
            const eta = this.getETA(state.abbreviation);
            const timezone = state.timezone;
            const localTime = this.getLocalTime(timezone);
            
            const stateElement = document.createElement('div');
            stateElement.className = 'state-card';
            stateElement.innerHTML = `
                <div class="state-header">
                    <h3>${state.name} (${state.abbreviation})</h3>
                    <span class="zip-prefix">ZIP: ${state.zipPrefix}XX</span>
                </div>
                <div class="state-details">
                    <p><strong>Local Time:</strong> ${localTime}</p>
                    <p class="eta-display"><strong>ETA:</strong> <span>${eta}</span> days</p>
                </div>
            `;
            this.elements.resultsContainer.appendChild(stateElement);
        });
    }
    
    /**
     * Get ETA for a state from current warehouse
     * @param {string} stateAbbr - State abbreviation
     * @returns {number|string} - ETA in days or 'N/A'
     */
    getETA(stateAbbr) {
        // Check if data exists for current warehouse and state
        if (etaData[this.currentWarehouse] && 
            etaData[this.currentWarehouse][stateAbbr] !== undefined) {
            return etaData[this.currentWarehouse][stateAbbr];
        }
        return 'N/A';
    }
    
    /**
     * Get formatted local time for a timezone
     * @param {string} timezone - IANA timezone (e.g., "America/New_York")
     * @returns {string} - Formatted time string
     */
    getLocalTime(timezone) {
        try {
            return new Date().toLocaleTimeString('en-US', {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            console.warn(`Invalid timezone: ${timezone}`);
            return 'N/A';
        }
    }
    
    /**
     * Update CSS variable with current warehouse color
     */
    updateWarehouseColor() {
        const color = this.currentWarehouse === 'texas' ? '#e67e22' : '#f39c12';
        document.documentElement.style.setProperty('--warehouse-color', color);
    }
    
    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Instant search as user types
        this.elements.searchInput.addEventListener('input', (e) => {
            this.renderStateList(e.target.value);
        });
        
        // Warehouse tab switching
        this.elements.warehouseTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update current warehouse
                this.currentWarehouse = tab.dataset.warehouse;
                
                // Update UI
                this.elements.warehouseTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.updateWarehouseColor();
                
                // Refresh results with current search
                this.renderStateList(this.elements.searchInput.value);
            });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if on a page with ETA calculator
    if (document.getElementById('eta-results')) {
        new ETACalculator();
    }
});
