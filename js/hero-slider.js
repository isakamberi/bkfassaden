document.addEventListener('DOMContentLoaded', function() {
    // Initialize the hero slider
    function initHeroSlider() {
        const slider = document.querySelector('.hero-slider');
        if (!slider) return;
        
        const slides = document.querySelectorAll('.hero-slider .slide');
        if (slides.length <= 1) return; // No need for slider with 0 or 1 slide
        
        let currentSlide = 0;
        let slideInterval;
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID;
        
        // Optimized showSlide with hardware acceleration
        function showSlide(index) {
            // Update current slide index
            currentSlide = (index + slides.length) % slides.length;
            
            // Move slides with transform for better performance
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update active class for indicators if any
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentSlide);
            });
        }
        
        // Touch event handlers
        function touchStart(index) {
            return function(e) {
                isDragging = true;
                startPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
                slider.style.transition = 'none';
                cancelAnimationFrame(animationID);
                clearInterval(slideInterval);
            };
        }
        
        function touchMove(e) {
            if (!isDragging) return;
            const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            const diff = currentPosition - startPos;
            
            // Prevent vertical scroll when swiping
            if (Math.abs(diff) > 5) {
                e.preventDefault();
            }
            
            currentTranslate = prevTranslate + diff;
            slider.style.transform = `translateX(calc(-${currentSlide * 100}% + ${diff}px))`;
        }
        
        function touchEnd() {
            if (!isDragging) return;
            isDragging = false;
            
            // Determine if we should change slide
            const threshold = window.innerWidth / 4; // 25% of screen width
            if (Math.abs(currentTranslate - prevTranslate) > threshold) {
                if (currentTranslate > prevTranslate && currentSlide > 0) {
                    // Swipe right
                    showSlide(currentSlide - 1);
                } else if (currentTranslate < prevTranslate && currentSlide < slides.length - 1) {
                    // Swipe left
                    showSlide(currentSlide + 1);
                }
            }
            
            // Reset position with smooth transition
            slider.style.transition = 'transform 0.3s ease-out';
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Restart auto-sliding
            startAutoSlide();
        }
        
        // Auto-slide functionality
        function startAutoSlide() {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 5000);
        }
        
        // Initialize slider
        function init() {
            // Set initial positions
            slider.style.display = 'flex';
            slider.style.width = `${slides.length * 100}%`;
            
            // Set slide widths
            slides.forEach(slide => {
                slide.style.flex = `0 0 ${100 / slides.length}%`;
                slide.style.maxWidth = `${100 / slides.length}%`;
            });
            
            // Add event listeners
            slider.addEventListener('mousedown', touchStart(0));
            slider.addEventListener('touchstart', touchStart(0), { passive: true });
            
            window.addEventListener('mousemove', touchMove);
            window.addEventListener('touchmove', touchMove, { passive: false });
            
            window.addEventListener('mouseup', touchEnd);
            window.addEventListener('touchend', touchEnd);
            
            // Prevent image drag
            slider.addEventListener('dragstart', (e) => e.preventDefault());
            
            // Start with first slide
            showSlide(0);
            startAutoSlide();
            
            // Pause on hover
            slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
            slider.addEventListener('mouseleave', startAutoSlide);
        }
        
        // Initialize when images are loaded
        if (document.readyState === 'complete') {
            init();
        } else {
            window.addEventListener('load', init);
        }
    }
    
    // Initialize the hero slider
    initHeroSlider();
});
