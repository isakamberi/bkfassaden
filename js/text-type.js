class TextType {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            text: options.text || ['Hello World'],
            typingSpeed: options.typingSpeed || 50,
            initialDelay: options.initialDelay || 0,
            pauseDuration: options.pauseDuration || 2000,
            deletingSpeed: options.deletingSpeed || 30,
            loop: options.loop !== false,
            showCursor: options.showCursor !== false,
            hideCursorWhileTyping: options.hideCursorWhileTyping || false,
            cursorCharacter: options.cursorCharacter || '|',
            cursorBlinkDuration: options.cursorBlinkDuration || 0.5,
            textColors: options.textColors || [],
            variableSpeed: options.variableSpeed || null,
            onSentenceComplete: options.onSentenceComplete || null,
            startOnVisible: options.startOnVisible || false,
            reverseMode: options.reverseMode || false
        };

        this.displayedText = '';
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.currentTextIndex = 0;
        this.isVisible = !this.options.startOnVisible;
        this.timeout = null;
        this.cursorInterval = null;

        this.textArray = Array.isArray(this.options.text) ? this.options.text : [this.options.text];

        this.init();
    }

    init() {
        this.setupHTML();
        this.setupCursor();
        
        if (this.options.startOnVisible) {
            this.setupIntersectionObserver();
        } else {
            this.startTyping();
        }
    }

    setupHTML() {
        this.element.classList.add('text-type');
        this.element.innerHTML = `
            <span class="text-type__content"></span>
            ${this.options.showCursor ? `<span class="text-type__cursor">${this.options.cursorCharacter}</span>` : ''}
        `;
        
        this.contentElement = this.element.querySelector('.text-type__content');
        this.cursorElement = this.element.querySelector('.text-type__cursor');
    }

    setupCursor() {
        if (this.options.showCursor && this.cursorElement) {
            this.startCursorBlink();
        }
    }

    startCursorBlink() {
        if (this.cursorInterval) {
            clearInterval(this.cursorInterval);
        }
        
        let visible = true;
        this.cursorInterval = setInterval(() => {
            if (this.cursorElement) {
                this.cursorElement.style.opacity = visible ? '0' : '1';
                visible = !visible;
            }
        }, this.options.cursorBlinkDuration * 1000);
    }

    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !this.isVisible) {
                            this.isVisible = true;
                            this.startTyping();
                        }
                    });
                },
                { threshold: 0.1 }
            );
            observer.observe(this.element);
        } else {
            // Fallback for browsers without IntersectionObserver
            this.isVisible = true;
            this.startTyping();
        }
    }

    getRandomSpeed() {
        if (!this.options.variableSpeed) return this.options.typingSpeed;
        const { min, max } = this.options.variableSpeed;
        return Math.random() * (max - min) + min;
    }

    getCurrentTextColor() {
        if (this.options.textColors.length === 0) return '';
        return this.options.textColors[this.currentTextIndex % this.options.textColors.length];
    }

    updateDisplay() {
        if (this.contentElement) {
            this.contentElement.textContent = this.displayedText;
            const color = this.getCurrentTextColor();
            if (color) {
                this.contentElement.style.color = color;
            }
        }
    }

    updateCursorVisibility() {
        if (this.cursorElement && this.options.hideCursorWhileTyping) {
            const shouldHide = this.currentCharIndex < this.textArray[this.currentTextIndex].length || this.isDeleting;
            this.cursorElement.style.display = shouldHide ? 'none' : 'inline-block';
        }
    }

    startTyping() {
        if (!this.isVisible) return;
        
        setTimeout(() => {
            this.executeTypingAnimation();
        }, this.options.initialDelay);
    }

    executeTypingAnimation() {
        const currentText = this.textArray[this.currentTextIndex];
        const processedText = this.options.reverseMode ? 
            currentText.split('').reverse().join('') : currentText;

        if (this.isDeleting) {
            if (this.displayedText === '') {
                this.isDeleting = false;
                
                if (this.currentTextIndex === this.textArray.length - 1 && !this.options.loop) {
                    return;
                }

                if (this.options.onSentenceComplete) {
                    this.options.onSentenceComplete(this.textArray[this.currentTextIndex], this.currentTextIndex);
                }

                this.currentTextIndex = (this.currentTextIndex + 1) % this.textArray.length;
                this.currentCharIndex = 0;
                
                this.timeout = setTimeout(() => {
                    this.executeTypingAnimation();
                }, this.options.pauseDuration);
            } else {
                this.displayedText = this.displayedText.slice(0, -1);
                this.updateDisplay();
                this.updateCursorVisibility();
                
                this.timeout = setTimeout(() => {
                    this.executeTypingAnimation();
                }, this.options.deletingSpeed);
            }
        } else {
            if (this.currentCharIndex < processedText.length) {
                this.displayedText += processedText[this.currentCharIndex];
                this.currentCharIndex++;
                this.updateDisplay();
                this.updateCursorVisibility();
                
                const speed = this.options.variableSpeed ? this.getRandomSpeed() : this.options.typingSpeed;
                this.timeout = setTimeout(() => {
                    this.executeTypingAnimation();
                }, speed);
            } else if (this.textArray.length > 1) {
                this.timeout = setTimeout(() => {
                    this.isDeleting = true;
                    this.executeTypingAnimation();
                }, this.options.pauseDuration);
            }
        }
    }

    destroy() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        if (this.cursorInterval) {
            clearInterval(this.cursorInterval);
        }
    }

    // Public methods to control the animation
    pause() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    resume() {
        this.executeTypingAnimation();
    }

    reset() {
        this.pause();
        this.displayedText = '';
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.currentTextIndex = 0;
        this.updateDisplay();
        this.startTyping();
    }
}

// Auto-initialize elements with data-text-type attribute
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('[data-text-type]');
    elements.forEach(element => {
        const options = {
            text: element.dataset.textType ? element.dataset.textType.split('|') : ['Hello World'],
            typingSpeed: parseInt(element.dataset.typingSpeed) || 50,
            initialDelay: parseInt(element.dataset.initialDelay) || 0,
            pauseDuration: parseInt(element.dataset.pauseDuration) || 2000,
            deletingSpeed: parseInt(element.dataset.deletingSpeed) || 30,
            loop: element.dataset.loop !== 'false',
            showCursor: element.dataset.showCursor !== 'false',
            hideCursorWhileTyping: element.dataset.hideCursorWhileTyping === 'true',
            cursorCharacter: element.dataset.cursorCharacter || '|',
            cursorBlinkDuration: parseFloat(element.dataset.cursorBlinkDuration) || 0.5,
            textColors: element.dataset.textColors ? element.dataset.textColors.split(',') : [],
            startOnVisible: element.dataset.startOnVisible === 'true',
            reverseMode: element.dataset.reverseMode === 'true'
        };

        if (element.dataset.variableSpeed) {
            const [min, max] = element.dataset.variableSpeed.split(',').map(Number);
            options.variableSpeed = { min, max };
        }

        new TextType(element, options);
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextType;
}
