document.addEventListener('DOMContentLoaded', function() {
    // Initialize with sample data if empty
    if (!localStorage.getItem('linkGroups')) {
        const sampleGroups = [
            {
                id: 'group1',
                name: 'Social Media',
                links: [
                    { id: 'link1', name: 'Twitter', url: 'https://twitter.com' },
                    { id: 'link2', name: 'Facebook', url: 'https://facebook.com' }
                ]
            },
            {
                id: 'group2',
                name: 'Development',
                links: [
                    { id: 'link3', name: 'GitHub', url: 'https://github.com' },
                    { id: 'link4', name: 'Stack Overflow', url: 'https://stackoverflow.com' }
                ]
            }
        ];
        localStorage.setItem('linkGroups', JSON.stringify(sampleGroups));
    }

    // Initialize components
    const linkManager = new LinkManager();
    const etaCalculator = new ETACalculator();
    
    // Force initial render
    linkManager.renderLinkTree();
    etaCalculator.renderStateList();
});
