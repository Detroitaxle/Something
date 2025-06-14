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
    initApp();

    function initApp() {
        loadLinks();
        searchETA();
        updateHeaderColor(currentWarehouse);
        setupEventListeners();
    }

    function setupEventListeners() {
        // Warehouse Selection
        warehouseRadios.forEach(radio => {
            radio.addEventListener('change', handleWarehouseChange);
        });

        // Edit Mode Toggle
        toggleEditBtn.addEventListener('click', toggleEditMode);

        // Group Management
        addGroupBtn.addEventListener('click', showGroupEditor);
        saveGroupBtn.addEventListener('click', saveGroup);
        cancelGroupBtn.addEventListener('click', hideGroupEditor);

        // Link Management
        saveLinkBtn.addEventListener('click', saveLink);
        cancelEditBtn.addEventListener('click', hideLinkEditor);

        // Bulk Actions
        deleteSelectedBtn.addEventListener('click', deleteSelectedLinks);
        groupSelector.addEventListener('change', moveSelectedLinks);

        // Search
        stateSearch.addEventListener('input', searchETA);
    }

    function handleWarehouseChange(e) {
        currentWarehouse = e.target.value;
        updateHeaderColor(currentWarehouse);
        searchETA();
    }

    function updateHeaderColor(warehouse) {
        header.className = `${warehouse}-header`;
    }

    // LINK TREE FUNCTIONS
    function loadLinks() {
        const savedLinks = JSON.parse(localStorage.getItem('linkTree')) || { groups: [] };
        linkTree.innerHTML = '';
        groupSelector.innerHTML = '<option value="">Move to...</option>';
        
        if (savedLinks.groups.length === 0) {
            savedLinks.groups.push(createNewGroup('Main Links'));
        }

        savedLinks.groups.forEach((group, groupIndex) => {
            createGroupElement(group, groupIndex, savedLinks);
        });

        if (bulkEditControls.classList.contains('active')) {
            toggleEditMode();
        }
    }

    function createGroupElement(group, groupIndex, savedLinks) {
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
            contentElement.appendChild(createLinkElement(link, groupIndex, linkIndex));
        });

        linkTree.appendChild(groupElement);
        groupSelector.appendChild(createGroupOption(group, groupIndex));

        setupGroupEventListeners(groupElement, groupIndex, savedLinks);
    }

    function createLinkElement(link, groupIndex, linkIndex) {
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item';
        linkItem.innerHTML = `
            <a href="${link.url}" target="_blank">${link.name}</a>
            <input type="checkbox" class="link-checkbox" data-group="${groupIndex}" data-link="${linkIndex}">
        `;
        return linkItem;
    }

    function createGroupOption(group, index) {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = group.name;
        return option;
    }

    function setupGroupEventListeners(groupElement, groupIndex, savedLinks) {
        // Group header click
        groupElement.querySelector('.link-group-header').addEventListener('click', function(e) {
            if (!e.target.closest('button')) {
                toggleGroupExpansion(groupElement, groupIndex, savedLinks);
            }
        });

        // Add link button
        groupElement.querySelector('.add-link-to-group').addEventListener('click', () => {
            showLinkEditor(groupIndex);
        });

        // Edit group button
        groupElement.querySelector('.edit-group-btn').addEventListener('click', () => {
            showGroupEditor(groupIndex);
        });
    }

    function toggleGroupExpansion(groupElement, groupIndex, savedLinks) {
        groupElement.classList.toggle('expanded');
        savedLinks.groups[groupIndex].expanded = groupElement.classList.contains('expanded');
        saveLinksToStorage(savedLinks);
    }

    function createNewGroup(name) {
        return {
            name: name,
            expanded: true,
            links: []
        };
    }

    function saveLinksToStorage(data) {
        localStorage.setItem('linkTree', JSON.stringify(data));
    }

    // EDIT MODE FUNCTIONS
    function toggleEditMode() {
        bulkEditControls.classList.toggle('active');
        document.querySelectorAll('.link-checkbox').forEach(checkbox => {
            checkbox.style.display = checkbox.style.display === 'inline-block' ? 'none' : 'inline-block';
        });
        document.querySelectorAll('.group-actions').forEach(actions => {
            actions.style.display = actions.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // GROUP EDITOR FUNCTIONS
    function showGroupEditor(groupIndex = null) {
        editingGroup = groupIndex;
        groupNameInput.value = groupIndex !== null ? getSavedLinks().groups[groupIndex].name : '';
        hideLinkEditor();
        groupEditor.style.display = 'block';
        groupNameInput.focus();
    }

    function hideGroupEditor() {
        groupEditor.style.display = 'none';
    }

    function saveGroup() {
        const name = groupNameInput.value.trim();
        if (!name) return;

        const savedLinks = getSavedLinks();

        if (editingGroup !== null) {
            savedLinks.groups[editingGroup].name = name;
        } else {
            savedLinks.groups.push(createNewGroup(name));
        }

        saveLinksToStorage(savedLinks);
        hideGroupEditor();
        loadLinks();
    }

    // LINK EDITOR FUNCTIONS
    function showLinkEditor(groupIndex) {
        currentGroupForNewLink = groupIndex;
        editingLink = null;
        linkNameInput.value = '';
        linkUrlInput.value = '';
        hideGroupEditor();
        linkEditor.style.display = 'block';
        linkNameInput.focus();
    }

    function hideLinkEditor() {
        linkEditor.style.display = 'none';
    }

    function saveLink() {
        const name = linkNameInput.value.trim();
        let url = linkUrlInput.value.trim();
        
        if (!name || !url) return;
        
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        const savedLinks = getSavedLinks();
        const groupIndex = currentGroupForNewLink !== null ? currentGroupForNewLink : 0;
        
        if (editingLink !== null) {
            const [groupIdx, linkIdx] = editingLink;
            savedLinks.groups[groupIdx].links[linkIdx] = { name, url };
        } else {
            savedLinks.groups[groupIndex].links.push({ name, url });
        }
        
        saveLinksToStorage(savedLinks);
        hideLinkEditor();
        loadLinks();
    }

    // BULK ACTIONS
    function deleteSelectedLinks() {
        const checkboxes = document.querySelectorAll('.link-checkbox:checked');
        if (checkboxes.length === 0) return;

        const savedLinks = getSavedLinks();
        
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
    }

    function moveSelectedLinks() {
        const targetGroup = parseInt(this.value);
        if (isNaN(targetGroup)) return;

        const checkboxes = document.querySelectorAll('.link-checkbox:checked');
        if (checkboxes.length === 0) return;

        const savedLinks = getSavedLinks();
        
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
    }

    // ETA SEARCH FUNCTIONS
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
                showNoResultsMessage(searchTerm);
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
        
        highlightSearchMatches(row);
    }

    function highlightSearchMatches(row) {
        const searchTerm = stateSearch.value.trim();
        if (!searchTerm) return;

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

    function showNoResultsMessage(searchTerm) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5">No ETA data found for "${searchTerm}"</td>
        `;
        etaTable.appendChild(row);
    }

    // HELPER FUNCTIONS
    function getSavedLinks() {
        return JSON.parse(localStorage.getItem('linkTree')) || { groups: [] };
    }
});
