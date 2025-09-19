// Load footer component
function loadFooter() {
    fetch('components/footer.html')
        .then(response => response.text())
        .then(html => {
            // Insert the footer before the closing body tag
            document.body.insertAdjacentHTML('beforeend', html);
            
            // Reinitialize any necessary scripts after loading the footer
            if (typeof initLanguage === 'function') {
                initLanguage();
            }
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
}

// Load footer when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
} else {
    loadFooter();
}
