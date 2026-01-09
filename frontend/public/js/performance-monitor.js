// ===================================
// PERFORMANCE MONITOR - FPS TRACKING
// Design Tech Futuriste Professionnel 2025
// ===================================

class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.isDebugMode = window.location.search.includes('debug');

        this.init();
    }

    init() {
        this.trackFPS();
        this.setupLazyLoading();
        this.throttleScrollEvents();

        if (this.isDebugMode) {
            this.createDebugUI();
        }

        console.log('✅ PerformanceMonitor initialisé');
    }

    trackFPS() {
        const now = performance.now();
        this.frameCount++;

        if (now >= this.lastTime + 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
            this.frameCount = 0;
            this.lastTime = now;

            if (this.fps < 50) {
                console.warn('⚠️ FPS drop:', this.fps);
            }

            if (this.isDebugMode) {
                this.updateDebugUI();
            }
        }

        requestAnimationFrame(() => this.trackFPS());
    }

    setupLazyLoading() {
        const heavyElements = document.querySelectorAll('[data-lazy-load]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadHeavyElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '50px' });

        heavyElements.forEach(el => observer.observe(el));
    }

    loadHeavyElement(element) {
        const type = element.getAttribute('data-lazy-load');
        // Logique de chargement selon type
        element.classList.add('loaded');
    }

    throttleScrollEvents() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Événements scroll optimisés
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    createDebugUI() {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #00E5FF;
            padding: 10px;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
            border: 1px solid #00E5FF;
            border-radius: 4px;
        `;
        debugPanel.innerHTML = `
            <div>FPS: <span id="fps-value">--</span></div>
            <div>Memory: <span id="memory-value">--</span></div>
        `;
        document.body.appendChild(debugPanel);
    }

    updateDebugUI() {
        const fpsEl = document.getElementById('fps-value');
        const memEl = document.getElementById('memory-value');

        if (fpsEl) fpsEl.textContent = this.fps;
        if (memEl && performance.memory) {
            const memMB = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
            memEl.textContent = `${memMB} MB`;
        }
    }
}

let perfMonitor;
document.addEventListener('DOMContentLoaded', () => {
    perfMonitor = new PerformanceMonitor();
    window.perfMonitor = perfMonitor;
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}
