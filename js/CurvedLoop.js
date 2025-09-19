class CurvedLoop {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            text: options.text || 'BK Fassaden AG • Professional Facade Solutions • ',
            speed: options.speed || 2,
            curveAmount: options.curveAmount || 100,
            fontSize: options.fontSize || '3rem',
            color: options.color || 'var(--text-color)'
        };

        this.init();
    }

    init() {
        this.createSVG();
        this.setupAnimation();
        this.setupResizeObserver();
    }

    createSVG() {
        // Create SVG element
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.classList.add('curved-loop-svg');
        
        // Create path for the text to follow
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('id', `curve-${Math.random().toString(36).substr(2, 9)}`);
        path.setAttribute('d', this.getPathData());
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'transparent');
        
        // Create text path
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.style.fontSize = this.options.fontSize;
        text.style.fill = this.options.color;
        text.style.fontWeight = 'bold';
        text.style.textTransform = 'uppercase';
        text.style.letterSpacing = '2px';
        
        const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
        textPath.setAttribute('href', `#${path.id}`);
        textPath.setAttribute('startOffset', '0');
        textPath.textContent = this.options.text.repeat(3); // Repeat text to fill the curve
        
        // Append elements
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.appendChild(path);
        
        text.appendChild(textPath);
        this.svg.appendChild(defs);
        this.svg.appendChild(text);
        
        // Add to DOM
        this.element.appendChild(this.svg);
        
        // Store references
        this.path = path;
        this.textPath = textPath;
        this.offset = 0;
    }

    getPathData() {
        const width = this.element.offsetWidth || 1440;
        const height = 50; // Reduced height for straight line
        // Create a straight horizontal path
        return `M0,${height} H${width * 1.5}`;
    }

    setupAnimation() {
        // Store original text and duplicate it
        const originalText = this.textPath.textContent;
        this.textPath.textContent = originalText + ' • ' + originalText;
        
        // Get the width of the original text
        const textLength = this.textPath.getComputedTextLength() / 2;
        
        // Start position (fully to the right)
        this.offset = 0;
        
        const animate = () => {
            // Move text from right to left
            this.offset = (this.offset - this.options.speed) % textLength;
            this.textPath.setAttribute('startOffset', this.offset);
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        // Initial render
        this.textPath.setAttribute('startOffset', this.offset);
        this.animationId = requestAnimationFrame(animate);
    }

    setupResizeObserver() {
        this.observer = new ResizeObserver(() => {
            this.path.setAttribute('d', this.getPathData());
        });
        this.observer.observe(this.element);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.observer) {
            this.observer.disconnect();
        }
        if (this.element && this.svg) {
            this.element.removeChild(this.svg);
        }
    }
}

// Auto-initialize elements with data-curved-loop attribute
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('[data-curved-loop]');
    elements.forEach(el => {
        const options = {
            text: el.getAttribute('data-text') || undefined,
            speed: parseFloat(el.getAttribute('data-speed')) || undefined,
            curveAmount: parseFloat(el.getAttribute('data-curve')) || undefined,
            fontSize: el.getAttribute('data-font-size') || undefined,
            color: el.getAttribute('data-color') || undefined
        };
        new CurvedLoop(el, options);
    });
});
