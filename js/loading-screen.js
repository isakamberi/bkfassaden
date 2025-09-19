document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.getElementById('loading-progress');
    const loadingNumber = document.getElementById('loading-number');
    const loadingLogo = document.querySelector('.loading-logo');
    const loadingText = document.querySelector('.loading-text');
    const loadingSubtext = document.querySelector('.loading-subtext');
    
    let progress = 0;
    const loadingPhrases = [
        'Preparing Excellence',
        'Building Your Experience',
        'Crafting Perfection',
        'Almost There...'
    ];
    let currentPhrase = 0;

    // Initial state
    loadingText.textContent = loadingPhrases[0];
    loadingSubtext.textContent = 'Initializing...';

    // Smooth loading animation - faster for 1 second total duration
    const loadingInterval = setInterval(() => {
        // Update progress - faster increment for 1 second completion
        progress += Math.random() * 30 + 10; // Faster progress for 1 second completion
        if (progress > 100) progress = 100;
        
        // Update progress bar and number with easing
        loadingProgress.style.width = `${progress}%`;
        loadingNumber.textContent = `${Math.min(Math.floor(progress), 100)}%`;
        
        // Update loading phrases at certain intervals
        // Simplified for 1 second duration - show fewer messages
        if (progress > 50 && currentPhrase === 0) {
            currentPhrase++;
            loadingText.textContent = loadingPhrases[3];
            loadingSubtext.textContent = 'Almost ready...';
        }
        
        // Add dynamic scale effect to logo based on progress
        const scale = 1 + (Math.sin(Date.now() / 300) * 0.05);
        loadingLogo.style.transform = `scale(${scale}) rotate(${(progress / 100) * 360}deg)`;

        // When loading is complete
        if (progress >= 100) {
            clearInterval(loadingInterval);
            loadingText.textContent = 'Welcome to BK Fassaden';
            loadingSubtext.textContent = 'Experience the difference';
            
            // Start exit animation immediately for 1 second total duration
            loadingScreen.classList.add('loading-complete');
            
            // Start fade out animation after a short delay
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.pointerEvents = 'none';
                
                // Remove from DOM after fade out completes
                setTimeout(() => {
                    loadingScreen.remove();
                    document.body.style.overflow = 'auto';
                }, 300);
            }, 200);
        }
    }, 20); // Faster interval for smoother animation

    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';
});
