document.addEventListener('DOMContentLoaded', function() {
    const projectsSection = document.querySelector('.projects .container');
    if (!projectsSection) return;
    
    // Create the scrolling container
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    // Hide the original grid
    projectsGrid.style.display = 'none';
    
    // Create the scrolling track container
    const track = document.createElement('div');
    track.className = 'projects-track';
    
    // Create a duplicate track for seamless looping
    const duplicateTrack = document.createElement('div');
    duplicateTrack.className = 'projects-track duplicate';
    
    // Move all project cards to the track
    const projectCards = Array.from(projectsGrid.querySelectorAll('.project-card'));
    
    // Create copies of the project cards for the duplicate track
    const duplicateCards = projectCards.map(card => card.cloneNode(true));
    
    // Add cards to tracks
    projectCards.forEach(card => track.appendChild(card));
    duplicateCards.forEach(card => duplicateTrack.appendChild(card));
    
    // Create the container for the scrolling tracks
    const container = document.createElement('div');
    container.className = 'projects-container';
    container.appendChild(track);
    container.appendChild(duplicateTrack);
    
    // Insert the container after the h2
    const h2 = projectsSection.querySelector('h2');
    h2.insertAdjacentElement('afterend', container);
    
    // Animation variables
    let animationId;
    let speed = 0.5; // Slower speed (pixels per frame)
    let position = 0;
    const trackWidth = track.scrollWidth;
    
    // Add more duplicates if needed to fill the screen
    function ensureFullCoverage() {
        const viewportWidth = window.innerWidth;
        const cardsPerView = Math.ceil(viewportWidth / 300) + 1; // 300px per card + 1 extra
        const neededDuplicates = Math.ceil(cardsPerView / projectCards.length);
        
        // Clear existing duplicates
        while (track.children.length > projectCards.length) {
            track.removeChild(track.lastChild);
        }
        
        // Add more duplicates if needed
        for (let i = 0; i < neededDuplicates; i++) {
            projectCards.forEach(card => {
                const clone = card.cloneNode(true);
                track.appendChild(clone);
            });
        }
        
        // Update track width
        track.style.width = 'auto';
        track.style.display = 'flex';
    }
    
    // Initial setup
    ensureFullCoverage();
    window.addEventListener('resize', ensureFullCoverage);
    
    // Start the animation
    function animate() {
        position -= speed;
        
        // Reset position when first track is completely scrolled
        if (position <= -trackWidth) {
            position = 0;
        }
        
        // Apply the transform
        track.style.transform = `translateX(${position}px)`;
        duplicateTrack.style.transform = `translateX(${position + trackWidth}px)`;
        
        // Continue the animation
        animationId = requestAnimationFrame(animate);
    }
    
    // Start the animation
    animationId = requestAnimationFrame(animate);
    
    // Pause animation on hover
    container.addEventListener('mouseenter', () => {
        cancelAnimationFrame(animationId);
    });
    
    // Resume animation on mouse leave
    container.addEventListener('mouseleave', () => {
        animationId = requestAnimationFrame(animate);
    });
    
    // Handle touch events for mobile
    let touchStartX = 0;
    let touchStartPosition = 0;
    let isDragging = false;
    
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartPosition = position;
        isDragging = true;
        cancelAnimationFrame(animationId);
    }, { passive: true });
    
    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touchX = e.touches[0].clientX;
        const diff = touchStartX - touchX;
        position = touchStartPosition - diff;
        
        // Apply the transform
        track.style.transform = `translateX(${position}px)`;
        duplicateTrack.style.transform = `translateX(${position + trackWidth}px)`;
    }, { passive: true });
    
    container.addEventListener('touchend', () => {
        isDragging = false;
        // Resume animation with a small delay
        setTimeout(() => {
            if (!isDragging) {
                animationId = requestAnimationFrame(animate);
            }
        }, 100);
    }, { passive: true });
});
