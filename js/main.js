// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initLanguageSwitcher();
    initSmoothScrolling();
    initStickyHeader();
    initContactForm();
    initCounters();
    initThemeToggle();
    initHeroSlider();
});

// Animated counters
function initCounters() {
    const counters = document.querySelectorAll('.counter-number');
    const circles = document.querySelectorAll('.progress-ring__circle');
    
    // Set the radius for the circles
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    
    // Set initial stroke properties
    circles.forEach(circle => {
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;
    });
    
    // Function to check if element is in viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };
    
    // Function to animate counters
    const animateCounters = () => {
        counters.forEach((counter, index) => {
            if (isInViewport(counter) && !counter.classList.contains('animated')) {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const step = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                    
                    // Update circle progress
                    const circle = circles[index];
                    if (circle) {
                        const offset = circumference - (current / target) * circumference;
                        circle.style.strokeDashoffset = offset;
                    }
                };
                
                counter.classList.add('animated');
                updateCounter();
            }
        });
    };
    
    // Check on load and scroll
    animateCounters();
    window.addEventListener('scroll', animateCounters);
}

// Mobile menu functionality
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const primaryNav = document.querySelector('.primary-navigation');
    const navLinks = document.querySelectorAll('.nav-link');
    const html = document.documentElement;
    
    if (!menuToggle || !primaryNav) return;
    
    // Toggle mobile menu
    const toggleMenu = () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        primaryNav.classList.toggle('active');
        html.classList.toggle('nav-open');
        
        // Toggle hamburger animation
        const hamburger = menuToggle.querySelector('.hamburger');
        if (hamburger) {
            hamburger.classList.toggle('active');
        }
    };
    
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close menu when clicking on a link (for mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                toggleMenu();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInside = primaryNav.contains(e.target) || menuToggle.contains(e.target);
        if (!isClickInside && primaryNav.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && primaryNav.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);
        
        // Reset menu on desktop
        if (window.innerWidth > 1024) {
            menuToggle.setAttribute('aria-expanded', 'false');
            primaryNav.classList.remove('active');
            html.classList.remove('nav-open');
            const hamburger = menuToggle.querySelector('.hamburger');
            if (hamburger) {
                hamburger.classList.remove('active');
            }
        }
    });
}

// Language switcher functionality
function initLanguageSwitcher() {
    const langSwitcher = document.querySelector('.lang-switcher');
    if (!langSwitcher) return;
    
    const langCurrent = langSwitcher.querySelector('.lang-current');
    const langDropdown = langSwitcher.querySelector('.lang-dropdown');
    const langButtons = langDropdown?.querySelectorAll('button');

    if (!langButtons?.length || !langCurrent) return;

    // Update current language display and translate page
    function updateCurrentLang(lang) {
        const activeLang = langDropdown.querySelector(`button[data-lang="${lang}"]`);
        if (activeLang) {
            const langCode = activeLang.querySelector('.lang-code')?.textContent || lang.toUpperCase();
            const currentCode = langCurrent.querySelector('.lang-code');
            if (currentCode) {
                currentCode.textContent = langCode;
            }
            
            // Update active state
            langButtons.forEach(btn => btn.classList.remove('active'));
            activeLang.classList.add('active');
            
            // Save language preference
            localStorage.setItem('language', lang);
            document.documentElement.lang = lang;
            document.documentElement.setAttribute('data-lang', lang);
            
            // Update all translatable elements
            updatePageLanguage(lang);
            
            // Dispatch custom event for any additional language change handlers
            document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
        }
    }

    // Update all translatable elements on the page
    function updatePageLanguage(lang) {
        const currentTranslations = translations[lang] || translations['de'];
        if (!currentTranslations) return;
        
        // Update all elements with data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key && currentTranslations[key] !== undefined) {
                if (element.tagName === 'INPUT') {
                    if (element.placeholder !== undefined) {
                        element.placeholder = currentTranslations[key];
                    }
                    if (element.type === 'submit' || element.type === 'button') {
                        element.value = currentTranslations[key];
                    }
                } else if (element.tagName === 'TEXTAREA' && element.placeholder !== undefined) {
                    element.placeholder = currentTranslations[key];
                } else if (element.tagName === 'META' && element.name === 'description') {
                    element.content = currentTranslations[key];
                } else if (element.tagName === 'TITLE') {
                    element.textContent = currentTranslations[key];
                } else {
                    element.textContent = currentTranslations[key];
                }
            }
        });
        
        // Update page title and meta description if they exist
        if (currentTranslations['site.title']) {
            document.title = currentTranslations['site.title'];
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc && currentTranslations['site.description']) {
                metaDesc.content = currentTranslations['site.description'];
            }
        }
        
        // Update any image alts with data-i18n-alt
        document.querySelectorAll('img[data-i18n-alt]').forEach(img => {
            const altKey = img.getAttribute('data-i18n-alt');
            if (altKey && currentTranslations[altKey] !== undefined) {
                img.alt = currentTranslations[altKey];
            }
        });
    }

    // Handle language selection
    langButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const lang = this.dataset.lang;
            updateCurrentLang(lang);
            langSwitcher.classList.remove('open');
        });
    });

    // Toggle dropdown
    if (langCurrent) {
        langCurrent.addEventListener('click', function(e) {
            e.stopPropagation();
            langSwitcher.classList.toggle('open');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        langSwitcher.classList.remove('open');
    });

    // Prevent dropdown from closing when clicking inside
    if (langDropdown) {
        langDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Initialize with current language from localStorage or browser language or default to 'de'
    function getPreferredLanguage() {
        // Check localStorage first
        const savedLang = localStorage.getItem('language');
        if (savedLang) return savedLang;
        
        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            const shortLang = browserLang.split('-')[0];
            if (['de', 'en', 'fr', 'it'].includes(shortLang)) {
                return shortLang;
            }
        }
        
        // Default to German
        return 'de';
    }

    const currentLang = getPreferredLanguage();
    document.documentElement.lang = currentLang;
    document.documentElement.setAttribute('data-lang', currentLang);
    updateCurrentLang(currentLang);
}

// Smooth scrolling for navigation
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Don't prevent default for language switcher links
            if (this.classList.contains('lang-switcher') || this.closest('.lang-switcher')) {
                return;
            }
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#!') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const nav = document.querySelector('nav ul');
                const menuToggle = document.querySelector('.menu-toggle');
                if (nav && menuToggle) {
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
}

// Sticky header functionality
function initStickyHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });
}

// Simple contact form handling with mailto:
function initContactForm() {
    const form = document.getElementById('contactForm');
    const sendBtn = document.getElementById('sendEmailBtn');
    
    if (!form || !sendBtn) {
        console.error('Contact form elements not found');
        return;
    }
    
    console.log('Contact form initialized with mailto');
    
    sendBtn.addEventListener('click', function() {
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const phone = form.querySelector('#phone').value.trim();
        const message = form.querySelector('#message').value.trim();
        
        // Basic validation
        if (!name || !email || !message) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Create email body
        let emailBody = `Name: ${name}%0D%0A`;
        emailBody += `Email: ${email}%0D%0A`;
        if (phone) emailBody += `Phone: ${phone}%0D%0A`;
        emailBody += `%0D%0AMessage:%0D%0A${message}`;
        
        // Create mailto link
        const mailtoLink = `mailto:isakamberi81@gmail.com?subject=Contact%20Form%20Submission&body=${emailBody}`;
        
        // Save button state
        const originalBtnText = sendBtn.innerHTML;
        sendBtn.disabled = true;
        sendBtn.innerHTML = 'Opening Email...';
        
        try {
            // Open default email client
            window.location.href = mailtoLink;
            
            // Show success message
            showFormMessage('Your email client should open with a pre-filled message. Please click send to complete your inquiry.', 'success');
            
            // Reset form after a short delay
            setTimeout(() => {
                form.reset();
                sendBtn.disabled = false;
                sendBtn.innerHTML = originalBtnText;
            }, 2000);
            
        } catch (error) {
            console.error('Error opening email client:', error);
            showFormMessage('Could not open email client. Please email us directly at isakamberi81@gmail.com', 'error');
            sendBtn.disabled = false;
            sendBtn.innerHTML = originalBtnText;
        }
    });
}

// Helper function to show form messages
function showFormMessage(message, type = 'success') {
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create and show new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    const form = document.querySelector('.contact-form');
    if (form) {
        form.insertBefore(messageElement, form.firstChild);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
}

// Email validation helper
// Email validation helper function
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Hero background slider
function initHeroSlider() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const heroImages = [
        'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Facade/Construction
        'https://images.pexels.com/photos/1578997/pexels-photo-1578997.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Painting
        'https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'  // Plastering/Worker
    ];

    let currentImageIndex = 0;

    function createSlides() {
        heroImages.forEach((img, index) => {
            const slide = document.createElement('div');
            slide.classList.add('hero-slide');
            slide.style.backgroundImage = `url(${img})`;
            if (index === 0) slide.classList.add('active');
            heroSection.appendChild(slide);
        });
    }

    function changeSlide() {
        const slides = document.querySelectorAll('.hero-slide');
        if (slides.length === 0) return;
        slides[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % heroImages.length;
        slides[currentImageIndex].classList.add('active');
    }

    createSlides();
    setInterval(changeSlide, 5000);
}

// Theme initialization and toggle functionality
function initThemeToggle() {
    // Apply theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Only add toggle functionality on the main page (index.html)
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        const themeToggleButton = document.querySelector('.theme-toggle');
        
        if (themeToggleButton) {
            // Update icon based on current theme
            updateThemeIcon(savedTheme);
            
            themeToggleButton.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeIcon(newTheme);
                
                // Reinitialize electric border effects to apply new theme colors
                document.querySelectorAll('[data-electric-border]').forEach(element => {
                    const instance = element._electricBorderInstance;
                    if (instance) {
                        const color = element.dataset.electricColor;
                        element.style.setProperty('--electric-border-color', color);
                    }
                });
            });
        }
    }
    
    // Function to update theme icon
    function updateThemeIcon(theme) {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;
        
        const sunIcon = themeToggle.querySelector('.fa-sun');
        const moonIcon = themeToggle.querySelector('.fa-moon');
        
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
}

// Add scroll-based animations
window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});
