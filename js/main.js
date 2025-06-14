/**
 * Main Application Controller
 * Initializes and coordinates all application components
 */

// Application State
const AppState = {
  components: {
    linkManager: null,
    etaCalculator: null
  },
  initialized: false
};

/**
 * Initialize the application
 */
function initializeApp() {
  // Check if we're on a page that needs the link manager
  if (document.getElementById('link-tree-container')) {
    AppState.components.linkManager = new LinkManager();
    
    // Set up any link manager specific event listeners
    setupLinkManagerEvents();
  }

  // Check if we're on a page that needs the ETA calculator
  if (document.getElementById('eta-results')) {
    AppState.components.etaCalculator = new ETACalculator();
    
    // Set up any ETA calculator specific event listeners
    setupETACalculatorEvents();
  }

  // Set up global event listeners
  setupGlobalEvents();

  AppState.initialized = true;
  console.log('Application initialized');
}

/**
 * Set up link manager specific event listeners
 */
function setupLinkManagerEvents() {
  // Handle bulk move action
  document.getElementById('bulk-move-btn').addEventListener('click', () => {
    if (AppState.components.linkManager.selectedLinks.size === 0) {
      alert('Please select links to move first');
      return;
    }

    const targetGroupId = document.getElementById('group-selector').value;
    if (!targetGroupId) {
      alert('Please select a target group');
      return;
    }

    AppState.components.linkManager.moveSelectedLinks(targetGroupId);
  });

  // Populate group selector for bulk operations
  document.getElementById('add-link-btn').addEventListener('click', () => {
    updateGroupSelector();
  });
}

/**
 * Set up ETA calculator specific event listeners
 */
function setupETACalculatorEvents() {
  // Add any calculator-specific events here
  // For example, you might want to refresh data periodically
  setInterval(() => {
    if (AppState.components.etaCalculator) {
      AppState.components.etaCalculator.renderStateList(
        document.getElementById('state-search').value
      );
    }
  }, 60000); // Refresh every minute
}

/**
 * Set up global event listeners
 */
function setupGlobalEvents() {
  // Handle window resize for responsive adjustments
  window.addEventListener('resize', debounce(() => {
    if (AppState.components.linkManager) {
      AppState.components.linkManager.handleResize();
    }
  }, 200));

  // Global keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl+E to toggle edit mode (if on link manager page)
    if (e.ctrlKey && e.key === 'e' && AppState.components.linkManager) {
      e.preventDefault();
      AppState.components.linkManager.toggleEditMode();
    }
  });
}

/**
 * Update the group selector dropdown for bulk operations
 */
function updateGroupSelector() {
  const selector = document.getElementById('group-selector');
  selector.innerHTML = '';
  
  if (AppState.components.linkManager) {
    AppState.components.linkManager.linkGroups.forEach(group => {
      const option = document.createElement('option');
      option.value = group.id;
      option.textContent = group.name;
      selector.appendChild(option);
    });
  }
}

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Initialize the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on a page that needs any of our components
  if (document.getElementById('link-tree-container') || document.getElementById('eta-results')) {
    initializeApp();
  } else {
    console.log('No application components found on this page');
  }
});

// Export for testing purposes (if using module system)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeApp,
    AppState
  };
}
