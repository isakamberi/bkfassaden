// Service Loading Screen Handler
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    
    if (loadingScreen) {
        // Hide loading screen after 1 second
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            
            // Remove loading screen from DOM after fade animation
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500); // Wait for fade-out transition to complete
            
        }, 1000); // 1 second loading time
    }
});
