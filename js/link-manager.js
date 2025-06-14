/**
 * Link Manager - Handles link tree management with group support
 * Features:
 * - Collapsible link groups
 * - Add/edit/delete links and groups
 * - Bulk edit mode
 * - Drag and drop reordering
 * - Local storage persistence
 */
class LinkManager {
  constructor() {
    // Initialize with default data or from localStorage
    this.linkGroups = this.loadData();
    this.editMode = false;
    this.bulkEditMode = false;
    this.selectedLinks = new Set();
    this.draggedItem = null;

    // Initialize the manager
    this.init();
  }

  // Initialize the link manager
  init() {
    this.renderLinkTree();
    this.setupEventListeners();
    this.checkEmptyState();
  }

  // Load data from localStorage or return defaults
  loadData() {
    const savedData = localStorage.getItem('linkGroups');
    if (savedData) {
      return JSON.parse(savedData);
    }
    
    // Default structure if no data exists
    return [
      {
        id: this.generateId(),
        name: 'Social Media',
        collapsed: false,
        links: [
          { id: this.generateId(), name: 'Twitter', url: 'https://twitter.com' },
          { id: this.generateId(), name: 'Facebook', url: 'https://facebook.com' }
        ]
      },
      {
        id: this.generateId(),
        name: 'Development',
        collapsed: false,
        links: [
          { id: this.generateId(), name: 'GitHub', url: 'https://github.com' },
          { id: this.generateId(), name: 'Stack Overflow', url: 'https://stackoverflow.com' }
        ]
      }
    ];
  }

  // Save data to localStorage
  saveData() {
    localStorage.setItem('linkGroups', JSON.stringify(this.linkGroups));
    this.checkEmptyState();
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Render the complete link tree
  renderLinkTree() {
    const container = document.getElementById('link-tree-container');
    container.innerHTML = '';

    if (this.linkGroups.length === 0) {
      container.innerHTML = '<p class="empty-message">No links yet. Add a group to get started!</p>';
      return;
    }

    this.linkGroups.forEach(group => {
      const groupElement = this.createGroupElement(group);
      container.appendChild(groupElement);
    });
  }

  // Create a group element
  createGroupElement(group) {
    const groupElement = document.createElement('div');
    groupElement.className = 'link-group';
    groupElement.dataset.groupId = group.id;
    groupElement.draggable = this.editMode;

    groupElement.innerHTML = `
      <div class="link-group-header ${group.collapsed ? 'collapsed' : ''}">
        <span class="group-name">${group.name}</span>
        <span class="group-count">(${group.links.length})</span>
        <div class="group-controls ${this.editMode ? '' : 'hidden'}">
          <button class="edit-group" title="Edit group">✏️</button>
          <button class="delete-group" title="Delete group">🗑️</button>
        </div>
        <button class="toggle-group">${group.collapsed ? '+' : '-'}</button>
      </div>
      <div class="link-group-content ${group.collapsed ? 'hidden' : ''}">
        ${group.links.map(link => this.createLinkElement(link, group.id)).join('')}
      </div>
    `;

    return groupElement;
  }

  // Create a link element
  createLinkElement(link, groupId) {
    return `
      <div class="link-item" data-link-id="${link.id}" data-group-id="${groupId}" 
           draggable="${this.editMode}">
        ${this.bulkEditMode ? `<input type="checkbox" class="link-checkbox" ${this.selectedLinks.has(link.id) ? 'checked' : ''}>` : ''}
        <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.name}</a>
        <div class="link-controls ${this.editMode ? '' : 'hidden'}">
          <button class="edit-link" title="Edit link">✏️</button>
          <button class="delete-link" title="Delete link">🗑️</button>
        </div>
      </div>
    `;
  }

  // Toggle edit mode
  toggleEditMode() {
    this.editMode = !this.editMode;
    document.getElementById('edit-mode-toggle').textContent = 
      this.editMode ? 'Exit Edit Mode' : 'Edit Mode';
    
    // Update visibility of edit controls
    document.querySelectorAll('.group-controls, .link-controls').forEach(control => {
      control.classList.toggle('hidden', !this.editMode);
    });

    // Make items draggable in edit mode
    document.querySelectorAll('.link-group, .link-item').forEach(item => {
      item.draggable = this.editMode;
    });

    // Exit bulk edit mode when exiting edit mode
    if (!this.editMode && this.bulkEditMode) {
      this.toggleBulkEditMode();
    }

    this.renderLinkTree();
  }

  // Toggle bulk edit mode
  toggleBulkEditMode() {
    this.bulkEditMode = !this.bulkEditMode;
    document.getElementById('bulk-edit-controls').classList.toggle('hidden', !this.bulkEditMode);
    
    if (!this.bulkEditMode) {
      this.selectedLinks.clear();
    }

    this.renderLinkTree();
  }

  // Add a new group
  addGroup() {
    const groupName = prompt('Enter group name:');
    if (groupName && groupName.trim()) {
      const newGroup = {
        id: this.generateId(),
        name: groupName.trim(),
        collapsed: false,
        links: []
      };
      this.linkGroups.push(newGroup);
      this.saveData();
      this.renderLinkTree();
    }
  }

  // Add a new link
  addLink() {
    if (this.linkGroups.length === 0) {
      alert('Please create a group first');
      return;
    }

    const groupId = prompt('Enter group ID to add link to:');
    const group = this.linkGroups.find(g => g.id === groupId);
    
    if (group) {
      const linkName = prompt('Enter link name:');
      const linkUrl = prompt('Enter link URL:');
      
      if (linkName && linkUrl) {
        group.links.push({
          id: this.generateId(),
          name: linkName.trim(),
          url: linkUrl.trim().startsWith('http') ? linkUrl.trim() : `https://${linkUrl.trim()}`
        });
        this.saveData();
        this.renderLinkTree();
      }
    } else {
      alert('Group not found!');
    }
  }

  // Setup all event listeners
  setupEventListeners() {
    // Edit mode toggle
    document.getElementById('edit-mode-toggle').addEventListener('click', () => {
      this.toggleEditMode();
    });

    // Bulk edit controls
    document.getElementById('bulk-delete-btn').addEventListener('click', () => {
      this.deleteSelectedLinks();
    });

    // Add group/link buttons
    document.getElementById('add-group-btn').addEventListener('click', () => {
      this.addGroup();
    });

    document.getElementById('add-link-btn').addEventListener('click', () => {
      this.addLink();
    });

    // Delegate events for dynamic elements
    document.getElementById('link-tree-container').addEventListener('click', (e) => {
      // Group header click (toggle collapse)
      if (e.target.closest('.link-group-header')) {
        const header = e.target.closest('.link-group-header');
        const groupId = header.parentElement.dataset.groupId;
        this.toggleGroupCollapse(groupId);
      }
      
      // Edit group button
      else if (e.target.classList.contains('edit-group')) {
        const groupId = e.target.closest('.link-group').dataset.groupId;
        this.editGroup(groupId);
      }
      
      // Delete group button
      else if (e.target.classList.contains('delete-group')) {
        const groupId = e.target.closest('.link-group').dataset.groupId;
        this.deleteGroup(groupId);
      }
      
      // Edit link button
      else if (e.target.classList.contains('edit-link')) {
        const linkId = e.target.closest('.link-item').dataset.linkId;
        const groupId = e.target.closest('.link-item').dataset.groupId;
        this.editLink(groupId, linkId);
      }
      
      // Delete link button
      else if (e.target.classList.contains('delete-link')) {
        const linkId = e.target.closest('.link-item').dataset.linkId;
        const groupId = e.target.closest('.link-item').dataset.groupId;
        this.deleteLink(groupId, linkId);
      }
      
      // Link checkbox
      else if (e.target.classList.contains('link-checkbox')) {
        const linkId = e.target.closest('.link-item').dataset.linkId;
        if (e.target.checked) {
          this.selectedLinks.add(linkId);
        } else {
          this.selectedLinks.delete(linkId);
        }
      }
    });

    // Drag and drop events
    document.getElementById('link-tree-container').addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('link-item')) {
        this.draggedItem = {
          type: 'link',
          id: e.target.dataset.linkId,
          groupId: e.target.dataset.groupId,
          element: e.target
        };
      } else if (e.target.classList.contains('link-group')) {
        this.draggedItem = {
          type: 'group',
          id: e.target.dataset.groupId,
          element: e.target
        };
      }
    });

    document.getElementById('link-tree-container').addEventListener('dragover', (e) => {
      e.preventDefault();
      const targetGroup = e.target.closest('.link-group');
      const targetLink = e.target.closest('.link-item');
      
      if (this.draggedItem && targetGroup) {
        // Highlight potential drop targets
        if (this.draggedItem.type === 'link') {
          if (targetLink) {
            targetLink.classList.add('drag-over');
          } else {
            targetGroup.querySelector('.link-group-content').classList.add('drag-over');
          }
        }
      }
    });

    document.getElementById('link-tree-container').addEventListener('dragleave', (e) => {
      document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    });

    document.getElementById('link-tree-container').addEventListener('drop', (e) => {
      e.preventDefault();
      document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
      
      if (!this.draggedItem) return;
      
      const targetGroup = e.target.closest('.link-group');
      const targetLink = e.target.closest('.link-item');
      
      if (this.draggedItem.type === 'link') {
        const sourceGroup = this.linkGroups.find(g => g.id === this.draggedItem.groupId);
        const link = sourceGroup.links.find(l => l.id === this.draggedItem.id);
        
        if (targetLink) {
          // Move link before another link
          const targetGroup = this.linkGroups.find(g => g.id === targetLink.dataset.groupId);
          const targetIndex = targetGroup.links.findIndex(l => l.id === targetLink.dataset.linkId);
          targetGroup.links.splice(targetIndex, 0, link);
        } else if (targetGroup) {
          // Move link to end of group
          const destinationGroup = this.linkGroups.find(g => g.id === targetGroup.dataset.groupId);
          destinationGroup.links.push(link);
        }
        
        // Remove from original group
        sourceGroup.links = sourceGroup.links.filter(l => l.id !== link.id);
      } else if (this.draggedItem.type === 'group') {
        // Reorder groups
        const group = this.linkGroups.find(g => g.id === this.draggedItem.id);
        const groupIndex = this.linkGroups.findIndex(g => g.id === this.draggedItem.id);
        
        this.linkGroups.splice(groupIndex, 1);
        
        if (targetGroup) {
          const targetIndex = this.linkGroups.findIndex(g => g.id === targetGroup.dataset.groupId);
          this.linkGroups.splice(targetIndex, 0, group);
        } else {
          this.linkGroups.push(group);
        }
      }
      
      this.saveData();
      this.renderLinkTree();
    });

    document.getElementById('link-tree-container').addEventListener('dragend', () => {
      this.draggedItem = null;
    });
  }

  // Toggle group collapse state
  toggleGroupCollapse(groupId) {
    const group = this.linkGroups.find(g => g.id === groupId);
    if (group) {
      group.collapsed = !group.collapsed;
      this.saveData();
      this.renderLinkTree();
    }
  }

  // Edit a group
  editGroup(groupId) {
    const group = this.linkGroups.find(g => g.id === groupId);
    if (group) {
      const newName = prompt('Edit group name:', group.name);
      if (newName && newName.trim()) {
        group.name = newName.trim();
        this.saveData();
        this.renderLinkTree();
      }
    }
  }

  // Delete a group
  deleteGroup(groupId) {
    if (confirm('Are you sure you want to delete this group and all its links?')) {
      this.linkGroups = this.linkGroups.filter(g => g.id !== groupId);
      this.saveData();
      this.renderLinkTree();
    }
  }

  // Edit a link
  editLink(groupId, linkId) {
    const group = this.linkGroups.find(g => g.id === groupId);
    if (group) {
      const link = group.links.find(l => l.id === linkId);
      if (link) {
        const newName = prompt('Edit link name:', link.name);
        const newUrl = prompt('Edit link URL:', link.url);
        
        if (newName && newUrl) {
          link.name = newName.trim();
          link.url = newUrl.trim().startsWith('http') ? newUrl.trim() : `https://${newUrl.trim()}`;
          this.saveData();
          this.renderLinkTree();
        }
      }
    }
  }

  // Delete a link
  deleteLink(groupId, linkId) {
    const group = this.linkGroups.find(g => g.id === groupId);
    if (group) {
      group.links = group.links.filter(l => l.id !== linkId);
      this.saveData();
      this.renderLinkTree();
    }
  }

  // Delete selected links (bulk mode)
  deleteSelectedLinks() {
    if (this.selectedLinks.size === 0) {
      alert('No links selected');
      return;
    }

    if (confirm(`Delete ${this.selectedLinks.size} selected links?`)) {
      this.linkGroups.forEach(group => {
        group.links = group.links.filter(link => !this.selectedLinks.has(link.id));
      });
      this.selectedLinks.clear();
      this.saveData();
      this.renderLinkTree();
    }
  }

  // Check if there's no data and show empty state
  checkEmptyState() {
    const emptyMessage = document.querySelector('.empty-message');
    if (emptyMessage) {
      emptyMessage.style.display = this.linkGroups.length === 0 ? 'block' : 'none';
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('link-tree-container')) {
    new LinkManager();
  }
});
