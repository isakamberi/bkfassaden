class MetallicLogo {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID "${containerId}" not found`);
            return;
        }

        this.options = {
            size: options.size || 250,
            logoUrl: options.logoUrl || 'images/bk-fassaden-ag-logo.png',
            metalColor1: options.metalColor1 || '#e0e0e0',
            metalColor2: options.metalColor2 || '#f0f0f0',
            metalColor3: options.metalColor3 || '#c0c0c0',
            animationSpeed: options.animationSpeed || 3,
            ...options
        };

        this.init();
    }

    init() {
        // Create the container
        this.container.innerHTML = `
            <div class="metallic-logo-container">
                <div class="metallic-background"></div>
                <div class="metallic-overlay"></div>
                <img src="${this.options.logoUrl}" alt="BK Fassaden AG" class="logo-image">
            </div>
        `;

        // Set container size
        const container = this.container.querySelector('.metallic-logo-container');
        container.style.width = `${this.options.size}px`;
        container.style.height = `${this.options.size}px`;

        // Set up the metallic background
        const background = this.container.querySelector('.metallic-background');
        background.style.background = `
            linear-gradient(
                135deg,
                ${this.options.metalColor1} 0%,
                ${this.options.metalColor2} 50%,
                ${this.options.metalColor3} 100%
            )
        `;
        
        // Set up the logo as a mask
        background.style.webkitMaskImage = `url('${this.options.logoUrl}')`;
        background.style.maskImage = `url('${this.options.logoUrl}')`;
        background.style.webkitMaskSize = 'contain';
        background.style.maskSize = 'contain';
        background.style.webkitMaskPosition = 'center';
        background.style.maskPosition = 'center';
        background.style.webkitMaskRepeat = 'no-repeat';
        background.style.maskRepeat = 'no-repeat';
        background.style.maskRepeat = 'no-repeat';
        background.style.webkitMaskRepeat = 'no-repeat';
        background.style.width = '100%';
        background.style.height = '100%';
        background.style.position = 'absolute';
        background.style.top = '0';
        background.style.left = '0';

        // Set up the shine animation
        const overlay = this.container.querySelector('.metallic-overlay');
        overlay.style.background = `
            linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.8) 0%,
                rgba(200, 200, 200, 0.5) 50%,
                rgba(150, 150, 150, 0.8) 100%
            )
        `;
        overlay.style.animation = `shine ${this.options.animationSpeed}s infinite alternate`;
    }
}

// Auto-initialize if data-metallic-logo attribute is present
document.addEventListener('DOMContentLoaded', () => {
    const logoContainers = document.querySelectorAll('[data-metallic-logo]');
    logoContainers.forEach(container => {
        const options = {
            size: container.dataset.size || 250,
            logoUrl: container.dataset.logoUrl || 'images/bk-fassaden-ag-logo.png',
            metalColor1: container.dataset.metalColor1 || '#e0e0e0',
            metalColor2: container.dataset.metalColor2 || '#f0f0f0',
            metalColor3: container.dataset.metalColor3 || '#c0c0c0',
            animationSpeed: container.dataset.animationSpeed || 3
        };
        new MetallicLogo(container.id, options);
    });
});
