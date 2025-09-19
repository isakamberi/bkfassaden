document.addEventListener('DOMContentLoaded', () => {
    // Create a style element for our dynamic styles
    const style = document.createElement('style');
    style.textContent = `
        .line-burst {
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transform-origin: center;
        }
        
        /* Ensure buttons have proper stacking context */
        button {
            position: relative;
            z-index: 1;
        }
        
        .line {
            position: absolute;
            height: 1px;
            transform-origin: left center;
            left: 0;
            top: 0;
            margin: 0 -2px;
            animation: lineBurst 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            opacity: 0;
        }
        
        @keyframes lineBurst {
            0% {
                width: 12px;
                opacity: 0.9;
                transform: rotate(var(--rotation)) translateX(0);
                height: 1.2px;
            }
            30% {
                opacity: 0.9;
                transform: rotate(var(--rotation)) translateX(5px);
                width: 10px;
                height: 1.1px;
            }
            70% {
                opacity: 0.7;
                transform: rotate(var(--rotation)) translateX(10px);
                width: 7px;
                height: 0.9px;
            }
            100% {
                opacity: 0;
                transform: rotate(var(--rotation)) translateX(15px);
                width: 4px;
                height: 0.6px;
            }
        }
        
        /* Light theme colors */
        .line {
            background: linear-gradient(90deg, #10b981, #3b82f6);
            box-shadow: 0 0 4px rgba(16, 185, 129, 0.4);
        }
        
        /* Dark theme support */
        [data-theme='dark'] .line {
            background: linear-gradient(90deg, #6ee7b7, #60a5fa);
            box-shadow: 0 0 12px rgba(110, 231, 183, 0.8);
        }
    `;
    document.head.appendChild(style);

    // Add click event listener to the document
    document.addEventListener('click', (e) => {
        // Skip if it's a link (but allow buttons)
        if (e.target.tagName === 'A') {
            return;
        }
        
        const burst = document.createElement('div');
        burst.className = 'line-burst';
        
        // Get the target element (button or document)
        const target = e.target.closest('button') || document.documentElement;
        
        // Position the effect relative to the viewport
        burst.style.left = `${e.clientX}px`;
        burst.style.top = `${e.clientY}px`;
        
        // Create multiple lines in a burst pattern
        const lineCount = 10;
        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement('div');
            line.className = 'line';
            const rotation = (360 / lineCount) * i;
            line.style.setProperty('--rotation', `${rotation}deg`);
            
            // Random delay for each line (0-100ms)
            line.style.animationDelay = `${Math.random() * 0.1}s`;
            
            // Random width variation (60-100% of max)
            const width = 60 + Math.random() * 40;
            line.style.width = `${width}px`;
            
            burst.appendChild(line);
        }
        
        document.body.appendChild(burst);
        
        // Remove the burst element after animation completes
        setTimeout(() => {
            burst.remove();
        }, 1000);
    });
});
