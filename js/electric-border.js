class ElectricBorder {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            color: options.color || '#5227FF',
            speed: options.speed || 1,
            chaos: options.chaos || 1,
            thickness: options.thickness || 2,
            borderRadius: options.borderRadius || 16
        };

        this.rawId = this.generateId();
        this.filterId = `turbulent-displace-${this.rawId}`;
        this.svgRef = null;
        this.strokeRef = null;
        this.resizeObserver = null;

        this.init();
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9).replace(/[:]/g, '');
    }

    init() {
        this.setupHTML();
        this.setupStyles();
        this.setupResizeObserver();
        this.updateAnimation();
    }

    setupHTML() {
        // Store original content
        const originalContent = this.element.innerHTML;
        
        // Add electric border class
        this.element.classList.add('electric-border');
        
        // Create the structure
        this.element.innerHTML = `
            <svg class="eb-svg" aria-hidden="true" focusable="false">
                <defs>
                    <filter id="${this.filterId}" color-interpolation-filters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
                        <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
                            <animate attributeName="dy" values="700; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="1" />
                        <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
                            <animate attributeName="dy" values="0; -700" dur="6s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="2" />
                        <feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
                            <animate attributeName="dx" values="490; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="2" />
                        <feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
                            <animate attributeName="dx" values="0; -490" dur="6s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
                        <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
                        <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="combinedNoise"
                            scale="30"
                            xChannelSelector="R"
                            yChannelSelector="B"
                        />
                    </filter>
                </defs>
            </svg>

            <div class="eb-layers">
                <div class="eb-stroke"></div>
                <div class="eb-glow-1"></div>
                <div class="eb-glow-2"></div>
                <div class="eb-background-glow"></div>
            </div>

            <div class="eb-content">
                ${originalContent}
            </div>
        `;

        // Get references to created elements
        this.svgRef = this.element.querySelector('.eb-svg');
        this.strokeRef = this.element.querySelector('.eb-stroke');
    }

    setupStyles() {
        this.updateColor();
        this.element.style.setProperty('--eb-border-width', `${this.options.thickness}px`);
        
        if (this.options.borderRadius) {
            this.element.style.borderRadius = `${this.options.borderRadius}px`;
        }
        
        // Listen for theme changes
        this.themeObserver = new MutationObserver(() => this.updateColor());
        this.themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    updateColor() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const color = isDark ? '#3b82f6' : '#dc2626';
        this.element.style.setProperty('--electric-border-color', color);
        
        // Update the SVG filter if it exists
        if (this.svgRef) {
            const feTurbulence = this.svgRef.querySelector('feTurbulence');
            if (feTurbulence) {
                feTurbulence.setAttribute('seed', Math.floor(Math.random() * 100));
            }
        }
    }

    setupResizeObserver() {
        if ('ResizeObserver' in window) {
            this.resizeObserver = new ResizeObserver(() => {
                this.updateAnimation();
            });
            this.resizeObserver.observe(this.element);
        }
    }

    updateAnimation() {
        const svg = this.svgRef;
        const host = this.element;
        
        if (!svg || !host) return;

        // Apply filter to stroke
        if (this.strokeRef) {
            this.strokeRef.style.filter = `url(#${this.filterId})`;
        }

        // Get dimensions
        const rect = host.getBoundingClientRect();
        const width = Math.max(1, Math.round(host.clientWidth || rect.width || 0));
        const height = Math.max(1, Math.round(host.clientHeight || rect.height || 0));

        // Update dy animations
        const dyAnims = Array.from(svg.querySelectorAll('feOffset > animate[attributeName="dy"]'));
        if (dyAnims.length >= 2) {
            dyAnims[0].setAttribute('values', `${height}; 0`);
            dyAnims[1].setAttribute('values', `0; -${height}`);
        }

        // Update dx animations
        const dxAnims = Array.from(svg.querySelectorAll('feOffset > animate[attributeName="dx"]'));
        if (dxAnims.length >= 2) {
            dxAnims[0].setAttribute('values', `${width}; 0`);
            dxAnims[1].setAttribute('values', `0; -${width}`);
        }

        // Update animation duration based on speed
        const baseDur = 6;
        const dur = Math.max(0.001, baseDur / (this.options.speed || 1));
        [...dyAnims, ...dxAnims].forEach(a => a.setAttribute('dur', `${dur}s`));

        // Update displacement scale based on chaos
        const disp = svg.querySelector('feDisplacementMap');
        if (disp) {
            disp.setAttribute('scale', String(30 * (this.options.chaos || 1)));
        }

        // Update filter dimensions
        const filterEl = svg.querySelector(`#${CSS.escape(this.filterId)}`);
        if (filterEl) {
            filterEl.setAttribute('x', '-200%');
            filterEl.setAttribute('y', '-200%');
            filterEl.setAttribute('width', '500%');
            filterEl.setAttribute('height', '500%');
        }

        // Start animations
        requestAnimationFrame(() => {
            [...dyAnims, ...dxAnims].forEach(a => {
                if (typeof a.beginElement === 'function') {
                    try {
                        a.beginElement();
                    } catch (e) {
                        console.warn('ElectricBorder: beginElement failed, this may be due to a browser limitation.');
                    }
                }
            });
        });
    }

    // Public methods
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.setupStyles();
        this.updateAnimation();
    }

    destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }
}

// Auto-initialize elements with data-electric-border attribute
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('[data-electric-border]');
    elements.forEach(element => {
        const options = {
            color: element.dataset.electricColor || '#5227FF',
            speed: parseFloat(element.dataset.electricSpeed) || 1,
            chaos: parseFloat(element.dataset.electricChaos) || 1,
            thickness: parseInt(element.dataset.electricThickness) || 2,
            borderRadius: parseInt(element.dataset.electricRadius) || 16
        };

        new ElectricBorder(element, options);
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ElectricBorder;
}
