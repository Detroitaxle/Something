document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const linkTree = document.getElementById('link-tree');
    const toggleEditBtn = document.getElementById('toggle-edit-btn');
    const addGroupBtn = document.getElementById('add-group-btn');
    const bulkEditControls = document.querySelector('.bulk-edit-controls');
    const deleteSelectedBtn = document.getElementById('delete-selected-links');
    const groupSelector = document.getElementById('group-selector');
    const linkEditor = document.querySelector('.link-editor');
    const groupEditor = document.querySelector('.group-editor');
    const linkNameInput = document.getElementById('link-name');
    const linkUrlInput = document.getElementById('link-url');
    const groupNameInput = document.getElementById('group-name');
    const saveLinkBtn = document.getElementById('save-link-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const saveGroupBtn = document.getElementById('save-group-btn');
    const cancelGroupBtn = document.getElementById('cancel-group-btn');
    const stateSearch = document.getElementById('state-search');
    const etaTable = document.querySelector('#eta-table tbody');
    const warehouseRadios = document.querySelectorAll('input[name="warehouse"]');
    const header = document.querySelector('header');

    // State
    let currentWarehouse = 'texas';
    let editingLink = null;
    let editingGroup = null;
    let currentGroupForNewLink = null;

    // Initialize
    loadLinks();
    searchETA();
    updateHeaderColor(currentWarehouse);

    // Warehouse Selection
    warehouseRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            currentWarehouse = this.value;
            updateHeaderColor(currentWarehouse);
            searchETA();
        });
    });

    function updateHeaderColor(warehouse) {
        header.classList.remove('texas-header', 'detroit-header');
        header.classList.add(`${warehouse}-header`);
    }

    // Link Tree Management
    function loadLinks() {
        const savedLinks = JSON.parse(localStorage.getItem('linkTree')) || { groups: [] };
        linkTree.innerHTML = '';
        groupSelector.innerHTML = '<option value="">Move to...</option>';
        
        if (savedLinks.groups.length === 0) {
            savedLinks.groups.push({
                name: 'Main Links',
                expanded: true,
                links: []
            });
        }

        savedLinks.groups.forEach((group, groupIndex) => {
            // Add to group selector
            const option = document.createElement('option');
            option.value = groupIndex;
            option.textContent = group.name;
            groupSelector.appendChild(option);

            // Create group element
            const groupElement = document.createElement('div');
            groupElement.className = `link-group ${group.expanded ? 'expanded' : ''}`;
            groupElement.innerHTML = `
                <div class="link-group-header">
                    <h3>${group.name}</h3>
                    <div class="group-actions" style="display: none">
                        <button class="icon-btn add-link-to-group" data-group="${groupIndex}">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="icon-btn edit-group-btn" data-group="${groupIndex}">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
                <div class="link-group-content"></div>
            `;

            const contentElement = groupElement.querySelector('.link-group-content');
            group.links.forEach((link, linkIndex) => {
                const linkItem = document.createElement('div');
                linkItem.className = 'link-item';
                linkItem.innerHTML = `
                    <a href="${link.url}" target="_blank">${link.name}</a>
                    <input type="checkbox" class="link-checkbox" data-group="${groupIndex}" data-link="${linkIndex}">
                `;
                contentElement.appendChild(linkItem);
            });

            linkTree.appendChild(groupElement);

            // Toggle group expansion
            groupElement.querySelector('.link-group-header').addEventListener('click', function(e) {
                if (!e.target.closest('button')) {
                    groupElement.classList.toggle('expanded');
                    savedLinks.groups[groupIndex].expanded = groupElement.classList.contains('expanded');
                    saveLinksToStorage(savedLinks);
                }
            });

            // Add link to group button
            groupElement.querySelector('.add-link-to-group').addEventListener('click', function() {
                currentGroupForNewLink = groupIndex;
                linkNameInput.value = '';
                linkUrlInput.value = '';
                linkEditor.style.display = 'block';
                groupEditor.style.display = 'none';
                linkNameInput.focus();
            });

            // Edit group button
            groupElement.querySelector('.edit-group-btn').addEventListener('click', function() {
                editingGroup = groupIndex;
                groupNameInput.value = group.name;
                groupEditor.style.display = 'block';
                linkEditor.style.display = 'none';
                groupNameInput.focus();
            });
        });
    }

    function saveLinksToStorage(data) {
        localStorage.setItem('linkTree', JSON.stringify(data));
    }

    // Toggle edit mode
    toggleEditBtn.addEventListener('click', function() {
        bulkEditControls.classList.toggle('active');
        document.querySelectorAll('.link-checkbox').forEach(checkbox => {
            checkbox.style.display = checkbox.style.display === 'inline-block' ? 'none' : 'inline-block';
        });
        document.querySelectorAll('.group-actions').forEach(actions => {
            actions.style.display = actions.style.display === 'flex' ? 'none' : 'flex';
        });
    });

    // Add new group
    addGroupBtn.addEventListener('click', function() {
        editingGroup = null;
        groupNameInput.value = '';
        groupEditor.style.display = 'block';
        linkEditor.style.display = 'none';
        groupNameInput.focus();
    });

    // Save group
    saveGroupBtn.addEventListener('click', function() {
        const name = groupNameInput.value.trim();
        if (!name) return;

        const savedLinks = JSON.parse(localStorage.getItem('linkTree')) || { groups: [] };

        if (editingGroup !== null) {
            // Update existing group
            savedLinks.groups[editingGroup].name = name;
        } else {
            // Add new group
            savedLinks.groups.push({
                name: name,
                expanded: true,
                links: []
            });
        }

        saveLinksToStorage(savedLinks);
        groupEditor.style.display = 'none';
        loadLinks();
    });

    // Cancel group edit
    cancelGroupBtn.addEventListener('click', function() {
        groupEditor.style.display = 'none';
    });

    // Save link
    saveLinkBtn.addEventListener('click', function() {
        const name = linkNameInput.value.trim();
        let url = linkUrlInput.value.trim();
        
        if (!name || !url) return;
        
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        const savedLinks = JSON.parse(localStorage.getItem('linkTree')) || { groups: [] };
        const groupIndex = currentGroupForNewLink !== null ? currentGroupForNewLink : 0;
        
        if (editingLink !== null) {
            // Update existing link
            const [groupIdx, linkIdx] = editingLink;
            savedLinks.groups[groupIdx].links[linkIdx] = { name, url };
        } else {
            // Add new link
            savedLinks.groups[groupIndex].links.push({ name, url });
        }
        
        saveLinksToStorage(savedLinks);
        linkEditor.style.display = 'none';
        loadLinks();
    });

    // Cancel link edit
    cancelEditBtn.addEventListener('click', function() {
        linkEditor.style.display = 'none';
    });

    // Delete selected links
    deleteSelectedBtn.addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('.link-checkbox:checked');
        if (checkboxes.length === 0) return;

        const savedLinks = JSON.parse(localStorage.getItem('linkTree')) || { groups: [] };
        
        // We need to delete from highest index to lowest to avoid shifting issues
        const toDelete = Array.from(checkboxes)
            .map(checkbox => ({
                group: parseInt(checkbox.dataset.group),
                link: parseInt(checkbox.dataset.link)
            }))
            .sort((a, b) => b.link - a.link);
        
        toDelete.forEach(({ group, link }) => {
            savedLinks.groups[group].links.splice(link, 1);
        });

        saveLinksToStorage(savedLinks);
        loadLinks();
        bulkEditControls.classList.remove('active');
    });

    // Move selected links
    groupSelector.addEventListener('change', function() {
        const targetGroup = parseInt(this.value);
        if (isNaN(targetGroup)) return;

        const checkboxes = document.querySelectorAll('.link-checkbox:checked');
        if (checkboxes.length === 0) return;

        const savedLinks = JSON.parse(localStorage.getItem('linkTree')) || { groups: [] };
        
        // We need to process from highest index to lowest to avoid shifting issues
        const toMove = Array.from(checkboxes)
            .map(checkbox => ({
                group: parseInt(checkbox.dataset.group),
                link: parseInt(checkbox.dataset.link)
            }))
            .sort((a, b) => b.link - a.link);
        
        toMove.forEach(({ group, link }) => {
            const linkData = savedLinks.groups[group].links[link];
            savedLinks.groups[group].links.splice(link, 1);
            savedLinks.groups[targetGroup].links.push(linkData);
        });

        saveLinksToStorage(savedLinks);
        loadLinks();
        this.value = '';
        bulkEditControls.classList.remove('active');
    });

    // ETA Search Functionality
    stateSearch.addEventListener('input', searchETA);

    function searchETA() {
        const searchTerm = stateSearch.value.trim().toUpperCase();
        const warehouseData = etaData[currentWarehouse];
        etaTable.innerHTML = '';
        
        if (searchTerm === '') {
            // Show all states if search is empty
            for (const [stateAbbr, eta] of Object.entries(warehouseData)) {
                addRowToTable(stateAbbr, eta);
            }
        } else {
            // Filter by search term
            const matchingStates = Object.keys(warehouseData).filter(abbr => 
                abbr.includes(searchTerm) || 
                (statesData[abbr]?.name.toUpperCase().includes(searchTerm)) ||
                (statesData[abbr]?.zipPrefix.includes(searchTerm))
            );
            
            if (matchingStates.length > 0) {
                matchingStates.forEach(stateAbbr => {
                    addRowToTable(stateAbbr, warehouseData[stateAbbr]);
                });
            } else {
                // Show message if no match found
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="5">No ETA data found for "${searchTerm}"</td>
                `;
                etaTable.appendChild(row);
            }
        }
    }

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
                    <span class="state-name">${stateInfo.name}</span>
                    <span class="state-zip">ZIP: ${stateInfo.zipPrefix}xxx</span>
                </div>
            </td>
            <td>${stateAbbr}</td>
            <td>${stateInfo.zipPrefix}</td>
            <td class="state-time">${localTime}</td>
            <td>${eta} days</td>
        `;
        etaTable.appendChild(row);
        
        // Highlight search matches
        if (stateSearch.value.trim() !== '') {
            const searchTerm = stateSearch.value.trim().toUpperCase();
            const regex = new RegExp(searchTerm, 'gi');
            
            ['state-name', 'state-zip', 'state-time'].forEach(className => {
                const element = row.querySelector(`.${className}`);
                if (element) {
                    element.innerHTML = element.textContent.replace(regex, 
                        match => `<span class="highlight">${match}</span>`
                    );
                }
            });
        }
    }
});
