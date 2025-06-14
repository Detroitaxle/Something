class ETACalculator {
    constructor() {
        this.currentWarehouse = 'texas';
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderStateList();
    }
    
    renderStateList(filter = '') {
        const resultsContainer = document.getElementById('eta-results');
        resultsContainer.innerHTML = '';
        
        const filteredStates = statesData.filter(state => 
            state.abbreviation.toLowerCase().includes(filter.toLowerCase()) || 
            state.name.toLowerCase().includes(filter.toLowerCase())
        );
        
        if (filteredStates.length === 0) {
            resultsContainer.innerHTML = '<p>No states found matching your search</p>';
            return;
        }
        
        filteredStates.forEach(state => {
            const eta = this.getETA(state.abbreviation);
            const timezone = state.timezone;
            const localTime = new Date().toLocaleTimeString('en-US', {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const stateElement = document.createElement('div');
            stateElement.className = 'state-card';
            stateElement.innerHTML = `
                <h3>${state.name} (${state.abbreviation})</h3>
                <p>ZIP Prefix: ${state.zipPrefix}</p>
                <p>Local Time: ${localTime}</p>
                <p class="eta">ETA: ${eta} days</p>
            `;
            resultsContainer.appendChild(stateElement);
        });
    }
    
    getETA(stateAbbr) {
        return etaData[this.currentWarehouse][stateAbbr] || 'N/A';
    }
    
    setupEventListeners() {
        // Search input
        document.getElementById('state-search').addEventListener('input', (e) => {
            this.renderStateList(e.target.value);
        });
        
        // Warehouse tabs
        document.querySelectorAll('.warehouse-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.currentWarehouse = tab.dataset.warehouse;
                document.querySelectorAll('.warehouse-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.documentElement.style.setProperty(
                    '--warehouse-color', 
                    this.currentWarehouse === 'texas' ? '#e67e22' : '#f39c12'
                );
                this.renderStateList(document.getElementById('state-search').value);
            });
        });
    }
}
