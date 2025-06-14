class LinkManager {
    constructor() {
        this.linkGroups = JSON.parse(localStorage.getItem('linkGroups')) || [];
        this.editMode = false;
        this.bulkEditMode = false;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    renderLinkTree() {
        const container = document.getElementById('link-tree-container');
        container.innerHTML = '';
        
        this.linkGroups.forEach(group => {
            const groupElement = this.createGroupElement(group);
            container.appendChild(groupElement);
        });
    }
    
    createGroupElement(group) {
        const groupElement = document.createElement('div');
        groupElement.className = 'link-group';
        groupElement.innerHTML = `
            <div class="link-group-header">
                <span>${group.name}</span>
                <div class="edit-controls ${this.editMode ? '' : 'hidden'}">
                    <button class="edit-group">✏️</button>
                    <button class="delete-group">🗑️</button>
                </div>
            </div>
            <div class="link-group-content">
                ${group.links.map(link => this.createLinkElement(link)).join('')}
            </div>
        `;
        return groupElement;
    }
    
    createLinkElement(link) {
        return `
            <div class="link-item" data-id="${link.id}">
                <a href="${link.url}" target="_blank">${link.name}</a>
                <div class="edit-controls ${this.editMode ? '' : 'hidden'}">
                    <button class="edit-link">✏️</button>
                    <button class="delete-link">🗑️</button>
                </div>
            </div>
        `;
    }
    
    toggleEditMode() {
        this.editMode = !this.editMode;
        document.querySelectorAll('.edit-controls').forEach(control => {
            control.classList.toggle('hidden', !this.editMode);
        });
        document.getElementById('edit-mode-toggle').textContent = 
            this.editMode ? 'Normal Mode' : 'Edit Mode';
    }
    
    setupEventListeners() {
        // Edit mode toggle
        document.getElementById('edit-mode-toggle').addEventListener('click', () => {
            this.toggleEditMode();
        });
        
        // Add group button
        document.getElementById('add-group-btn').addEventListener('click', () => {
            const groupName = prompt("Enter group name:");
            if (groupName) {
                this.addGroup(groupName);
            }
        });
    }
    
    addGroup(groupName) {
        const newGroup = {
            id: 'group' + Date.now(),
            name: groupName,
            links: []
        };
        this.linkGroups.push(newGroup);
        this.saveToLocalStorage();
    }
    
    saveToLocalStorage() {
        localStorage.setItem('linkGroups', JSON.stringify(this.linkGroups));
        this.renderLinkTree();
    }
}
