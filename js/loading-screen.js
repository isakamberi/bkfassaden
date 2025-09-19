document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.getElementById('loading-progress');
    const loadingNumber = document.getElementById('loading-number');
    const loadingLogo = document.querySelector('.loading-logo');
    const loadingText = document.querySelector('.loading-text');
    const loadingSubtext = document.querySelector('.loading-subtext');
    
    let progress = 0;
    const loadingPhrases = ['Loading...'];
    let currentPhrase = 0;

    // Initial state
    loadingText.textContent = loadingPhrases[0];
    loadingSubtext.textContent = 'Please wait...';

    // Calculate progress based on time for exact 1 second duration
    const startTime = Date.now();
    const duration = 1000; // 1 second total duration
    
    const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        progress = Math.min((elapsed / duration) * 100, 100);
        
        // Update progress bar and number
        loadingProgress.style.width = `${progress}%`;
        loadingNumber.textContent = `${Math.floor(progress)}%`;
        
        // Add subtle animation to logo
        const scale = 1 + (Math.sin(Date.now() / 300) * 0.03);
        loadingLogo.style.transform = `scale(${scale})`;

        // When loading is complete
        if (progress >= 100) {
            loadingText.textContent = 'BK Fassaden';
            loadingSubtext.textContent = 'Experience the difference';
            
            // Start exit animation
            loadingScreen.classList.add('loading-complete');
            
            // Remove loading screen after a very short delay
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.pointerEvents = 'none';
                
                // Remove from DOM after fade out completes
                setTimeout(() => {
                    loadingScreen.remove();
                    document.body.style.overflow = 'auto';
                }, 100);
            }, 100);
        } else {
            requestAnimationFrame(updateProgress);
        }
    };
    
    // Start the progress update
    requestAnimationFrame(updateProgress);

    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';
});
