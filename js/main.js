document.addEventListener('DOMContentLoaded', function() {
    // Link Tree Management
    const linkTree = document.getElementById('link-tree');
    const addLinkBtn = document.getElementById('add-link-btn');
    const linkEditor = document.querySelector('.link-editor');
    const linkNameInput = document.getElementById('link-name');
    const linkUrlInput = document.getElementById('link-url');
    const saveLinkBtn = document.getElementById('save-link-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    
    let editingLinkId = null;
    
    // Load saved links from localStorage
    function loadLinks() {
        const savedLinks = JSON.parse(localStorage.getItem('linkTree')) || [];
        linkTree.innerHTML = '';
        
        savedLinks.forEach((link, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="${link.url}" target="_blank">${link.name}</a>
                <div class="link-actions">
                    <button class="icon-btn edit-link" data-id="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-btn delete-link" data-id="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            linkTree.appendChild(li);
        });
        
        // Add event listeners to edit/delete buttons
        document.querySelectorAll('.edit-link').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editLink(id);
            });
        });
        
        document.querySelectorAll('.delete-link').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteLink(id);
            });
        });
    }
    
    // Add new link
    function addLink() {
        linkNameInput.value = '';
        linkUrlInput.value = '';
        editingLinkId = null;
        linkEditor.style.display = 'block';
        linkNameInput.focus();
    }
    
    // Edit existing link
    function editLink(id) {
        const savedLinks = JSON.parse(localStorage.getItem('linkTree')) || [];
        const link = savedLinks[id];
        
        linkNameInput.value = link.name;
        linkUrlInput.value = link.url;
        editingLinkId = id;
        linkEditor.style.display = 'block';
        linkNameInput.focus();
    }
    
    // Delete link
    function deleteLink(id) {
        const savedLinks = JSON.parse(localStorage.getItem('linkTree')) || [];
        savedLinks.splice(id, 1);
        localStorage.setItem('linkTree', JSON.stringify(savedLinks));
        loadLinks();
    }
    
    // Save link
    function saveLink() {
        const name = linkNameInput.value.trim();
        let url = linkUrlInput.value.trim();
        
        if (!name || !url) {
            alert('Please fill in both fields');
            return;
        }
        
        // Add https:// if not present
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        const savedLinks = JSON.parse(localStorage.getItem('linkTree')) || [];
        
        if (editingLinkId !== null) {
            // Update existing link
            savedLinks[editingLinkId] = { name, url };
        } else {
            // Add new link
            savedLinks.push({ name, url });
        }
        
        localStorage.setItem('linkTree', JSON.stringify(savedLinks));
        linkEditor.style.display = 'none';
        loadLinks();
    }
    
    // Event listeners for link management
    addLinkBtn.addEventListener('click', addLink);
    saveLinkBtn.addEventListener('click', saveLink);
    cancelEditBtn.addEventListener('click', () => {
        linkEditor.style.display = 'none';
    });
    
    // Load initial links
    loadLinks();
    
    // Warehouse ETA Search Functionality
    const stateSearch = document.getElementById('state-search');
    const searchBtn = document.getElementById('search-btn');
    const etaTable = document.querySelector('#eta-table tbody');
    const warehouseRadios = document.querySelectorAll('input[name="warehouse"]');
    
    let currentWarehouse = 'texas';
    
    // Update warehouse selection
    warehouseRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            currentWarehouse = this.value;
            searchETA();
        });
    });
    
    // Search ETA
    function searchETA() {
        const searchTerm = stateSearch.value.trim().toUpperCase();
        const warehouseData = etaData[currentWarehouse];
        etaTable.innerHTML = '';
        
        if (searchTerm === '') {
            // Show all states if search is empty
            for (const [state, eta] of Object.entries(warehouseData)) {
                addRowToTable(state, eta);
            }
        } else {
            // Filter by search term
            if (warehouseData.hasOwnProperty(searchTerm)) {
                addRowToTable(searchTerm, warehouseData[searchTerm]);
            } else {
                // Show message if no match found
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="2">No ETA data found for ${searchTerm}</td>
                `;
                etaTable.appendChild(row);
            }
        }
    }
    
    // Add row to ETA table
    function addRowToTable(state, eta) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${state}</td>
            <td>${eta} business days</td>
        `;
        etaTable.appendChild(row);
    }
    
    // Event listeners for ETA search
    searchBtn.addEventListener('click', searchETA);
    stateSearch.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchETA();
        }
    });
    
    // Load all ETAs on initial page load
    searchETA();
});
