document.addEventListener('DOMContentLoaded', function() {
    // Initialize the hero slider
    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slider .slide');
        let currentSlide = 0;
        const slideInterval = 5000; // Change slide every 5 seconds
        
        // Function to show a specific slide
        function showSlide(index) {
            // Hide all slides
            slides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Show the current slide
            slides[index].classList.add('active');
            
            // Update current slide index
            currentSlide = index;
        }
        
        // Function to show next slide
        function nextSlide() {
            const nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        }
        
        // Start the slider
        function startSlider() {
            // Show first slide
            showSlide(0);
            
            // Set interval for automatic sliding
            setInterval(nextSlide, slideInterval);
        }
        
        // Initialize the slider
        if (slides.length > 0) {
            startSlider();
        }
    }
    
    // Initialize the hero slider
    initHeroSlider();
});
