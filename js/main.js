// Add these updates to your main.js

// Warehouse-specific header colors
function updateHeaderColor(warehouse) {
    const header = document.querySelector('header');
    header.classList.remove('texas-header', 'detroit-header');
    header.classList.add(`${warehouse}-header`);
}

// Instant search functionality
stateSearch.addEventListener('input', searchETA);

// Enhanced ETA results with state info
function addRowToTable(stateAbbr, eta) {
    const stateInfo = statesData[stateAbbr];
    if (!stateInfo) return;
    
    const now = new Date();
    const options = { timeZone: stateInfo.timezone, hour: '2-digit', minute: '2-digit' };
    const localTime = now.toLocaleTimeString('en-US', options);
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <div class="state-info">
                <div>
                    <span class="state-name">${stateInfo.name}</span>
                    <div class="state-zip">ZIP starts with: ${stateInfo.zipPrefix}</div>
                </div>
                <div class="state-time">${localTime}</div>
            </div>
        </td>
        <td>${stateAbbr}</td>
        <td>${eta} business days</td>
    `;
    etaTable.appendChild(row);
}

// Group management for links
function loadLinks() {
    const savedLinks = JSON.parse(localStorage.getItem('linkTree')) || { groups: [] };
    linkTree.innerHTML = '';
    
    savedLinks.groups.forEach((group, groupIndex) => {
        const groupElement = document.createElement('div');
        groupElement.className = `link-group ${group.expanded ? 'expanded' : ''}`;
        groupElement.innerHTML = `
            <div class="link-group-header">
                <h3>${group.name || 'Unnamed Group'}</h3>
                <div>
                    <button class="icon-btn edit-group" data-group="${groupIndex}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-btn delete-group" data-group="${groupIndex}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="link-group-content"></div>
        `;
        
        const contentElement = groupElement.querySelector('.link-group-content');
        group.links.forEach((link, linkIndex) => {
            const li = document.createElement('div');
            li.className = 'link-item';
            li.innerHTML = `
                <a href="${link.url}" target="_blank">${link.name}</a>
                <input type="checkbox" class="link-checkbox" data-group="${groupIndex}" data-link="${linkIndex}">
            `;
            contentElement.appendChild(li);
        });
        
        linkTree.appendChild(groupElement);
        
        // Toggle group expansion
        groupElement.querySelector('.link-group-header').addEventListener('click', function(e) {
            if (!e.target.closest('button')) {
                groupElement.classList.toggle('expanded');
                savedLinks.groups[groupIndex].expanded = groupElement.classList.contains('expanded');
                localStorage.setItem('linkTree', JSON.stringify(savedLinks));
            }
        });
    });
    
    // Add bulk edit controls
    const bulkEditDiv = document.createElement('div');
    bulkEditDiv.className = 'bulk-edit-controls';
    bulkEditDiv.innerHTML = `
        <button id="delete-selected-links">Delete Selected</button>
        <button id="move-selected-links">Move to Group</button>
        <select id="group-selector"></select>
    `;
    linkTree.appendChild(bulkEditDiv);
    
    // Populate group selector
    savedLinks.groups.forEach((group, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = group.name || `Group ${index + 1}`;
        bulkEditDiv.querySelector('#group-selector').appendChild(option);
    });
}

// Toggle bulk edit mode
function toggleBulkEdit() {
    document.querySelector('.bulk-edit-controls').classList.toggle('active');
    document.querySelectorAll('.link-checkbox').forEach(checkbox => {
        checkbox.style.display = checkbox.style.display === 'inline-block' ? 'none' : 'inline-block';
    });
}

// Highlight search matches
function searchETA() {
    const searchTerm = stateSearch.value.trim().toUpperCase();
    const warehouseData = etaData[currentWarehouse];
    etaTable.innerHTML = '';
    
    // Highlight matching text in the search box
    if (searchTerm) {
        const regex = new RegExp(searchTerm, 'gi');
        document.querySelectorAll('.state-name, .state-zip, td').forEach(element => {
            const text = element.textContent;
            element.innerHTML = text.replace(regex, match => 
                `<span class="highlight">${match}</span>`
            );
        });
    }
    
    // Rest of your search logic...
}

// Initialize with Texas as default
updateHeaderColor('texas');
warehouseRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        currentWarehouse = this.value;
        updateHeaderColor(currentWarehouse);
        searchETA();
    });
});
