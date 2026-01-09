// ===================================
// CANVAS EFFECTS - HERO VARIANTS
// Design Tech Futuriste Professionnel 2025
// ===================================
// Alice Sindayigaya - Portfolio DevOps & Cloud
// 4 variantes d'effets visuels: Particules, Matrix, Grid3D, Gradient Mesh
// ===================================

/**
 * Classe de base pour tous les effets
 */
class BaseEffect {
    constructor(container) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isDestroyed = false;
    }

    /**
     * Crée et initialise le canvas
     */
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'hero-effect-canvas';
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;

        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();

        this.container.appendChild(this.canvas);

        // Resize listener
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    /**
     * Redimensionne le canvas
     */
    resizeCanvas() {
        if (!this.canvas) return;

        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    /**
     * Nettoie et détruit l'effet
     */
    destroy() {
        this.isDestroyed = true;

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }

        console.log(`✅ ${this.constructor.name} détruit`);
    }

    /**
     * Méthode à override - Animation principale
     */
    animate() {
        // À implémenter par les classes enfants
    }

    /**
     * Méthode à override - Rendu
     */
    render() {
        // À implémenter par les classes enfants
    }
}

// ===================================
// VARIANTE 1: PARTICULES AMÉLIORÉES
// ===================================

class ParticlesEffect extends BaseEffect {
    constructor(container) {
        super(container);
        this.particles = [];
        this.particleCount = this.getParticleCount();
        this.theme = document.documentElement.getAttribute('data-theme') || 'dark';

        this.init();
    }

    /**
     * Détermine le nombre de particules selon device
     */
    getParticleCount() {
        const width = window.innerWidth;
        if (width < 768) return 30;  // Mobile
        if (width < 1024) return 50; // Tablet
        return 80;                    // Desktop
    }

    /**
     * Initialisation
     */
    init() {
        this.createCanvas();
        this.createParticles();
        this.animate();

        // Écouter changements de thème
        window.addEventListener('themechange', (e) => {
            this.theme = e.detail.theme;
        });

        console.log(`✅ ParticlesEffect initialisé (${this.particleCount} particules)`);
    }

    /**
     * Crée les particules
     */
    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }

    /**
     * Animation loop
     */
    animate() {
        if (this.isDestroyed) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            // Mise à jour position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Rendu
            const color = this.theme === 'dark'
                ? `rgba(0, 229, 255, ${particle.opacity})`
                : `rgba(2, 132, 199, ${particle.opacity * 0.7})`;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();

            // Glow effect
            if (this.theme === 'dark') {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = color;
            }
        });

        this.ctx.shadowBlur = 0;

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// ===================================
// VARIANTE 2: MATRIX RAIN
// ===================================

class VideoMatrixEffect extends BaseEffect {
    constructor(container) {
        super(container);
        this.columns = 0;
        this.drops = [];
        this.fontSize = 14;
        this.characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ';
        this.theme = document.documentElement.getAttribute('data-theme') || 'dark';

        this.init();
    }

    /**
     * Initialisation
     */
    init() {
        this.createCanvas();
        this.setupColumns();
        this.animate();

        window.addEventListener('themechange', (e) => {
            this.theme = e.detail.theme;
        });

        console.log(`✅ VideoMatrixEffect initialisé (${this.columns} colonnes)`);
    }

    /**
     * Configure les colonnes de texte
     */
    setupColumns() {
        this.columns = Math.floor(this.canvas.width / this.fontSize);

        // Initialiser les gouttes
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * this.canvas.height / this.fontSize;
        }
    }

    /**
     * Redimensionne et réinitialise les colonnes
     */
    resizeCanvas() {
        super.resizeCanvas();
        this.setupColumns();
    }

    /**
     * Animation Matrix Rain
     */
    animate() {
        if (this.isDestroyed) return;

        // Fond semi-transparent pour effet de traînée
        this.ctx.fillStyle = this.theme === 'dark'
            ? 'rgba(10, 14, 39, 0.05)'
            : 'rgba(248, 250, 252, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Couleur texte
        this.ctx.fillStyle = this.theme === 'dark'
            ? '#00E5FF'
            : '#0284C7';
        this.ctx.font = `${this.fontSize}px monospace`;

        // Dessiner chaque colonne
        for (let i = 0; i < this.drops.length; i++) {
            // Caractère aléatoire
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];

            // Position
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            // Dessiner
            this.ctx.fillText(char, x, y);

            // Réinitialiser la goutte si elle atteint le bas
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            // Tomber
            this.drops[i]++;
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// ===================================
// VARIANTE 3: GRILLE 3D ISOMÉTRIQUE
// ===================================

class Grid3DEffect extends BaseEffect {
    constructor(container) {
        super(container);
        this.gridSize = 60;
        this.perspective = 1000;
        this.rotationX = 60;
        this.offset = 0;
        this.theme = document.documentElement.getAttribute('data-theme') || 'dark';
        this.points = [];

        this.init();
    }

    /**
     * Initialisation
     */
    init() {
        this.createCanvas();
        this.generatePoints();
        this.animate();

        window.addEventListener('themechange', (e) => {
            this.theme = e.detail.theme;
        });

        console.log(`✅ Grid3DEffect initialisé`);
    }

    /**
     * Génère les points lumineux
     */
    generatePoints() {
        this.points = [];
        const pointCount = 20;

        for (let i = 0; i < pointCount; i++) {
            this.points.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                opacity: Math.random() * 0.5 + 0.5,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    /**
     * Redimensionne et régénère les points
     */
    resizeCanvas() {
        super.resizeCanvas();
        this.generatePoints();
    }

    /**
     * Animation grille 3D
     */
    animate() {
        if (this.isDestroyed) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Couleur selon thème
        const gridColor = this.theme === 'dark'
            ? 'rgba(0, 229, 255, 0.2)'
            : 'rgba(2, 132, 199, 0.15)';

        this.ctx.strokeStyle = gridColor;
        this.ctx.lineWidth = 1;

        // Dessiner grille avec perspective
        const cols = Math.floor(this.canvas.width / this.gridSize);
        const rows = Math.floor(this.canvas.height / this.gridSize);

        for (let i = 0; i <= cols; i++) {
            this.ctx.beginPath();
            const x = i * this.gridSize;
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let j = 0; j <= rows; j++) {
            this.ctx.beginPath();
            const y = (j * this.gridSize + this.offset) % this.canvas.height;
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        // Points lumineux
        this.points.forEach(point => {
            point.pulse += 0.05;
            const opacity = (Math.sin(point.pulse) + 1) / 2 * point.opacity;

            const color = this.theme === 'dark'
                ? `rgba(0, 229, 255, ${opacity})`
                : `rgba(2, 132, 199, ${opacity})`;

            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();

            // Glow
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = color;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });

        // Animer défilement
        this.offset += 0.5;
        if (this.offset >= this.gridSize) {
            this.offset = 0;
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// ===================================
// VARIANTE 4: GRADIENT MESH ORGANIQUE
// ===================================

class GradientMeshEffect extends BaseEffect {
    constructor(container) {
        super(container);
        this.blobs = [];
        this.blobCount = 5;
        this.theme = document.documentElement.getAttribute('data-theme') || 'dark';

        this.init();
    }

    /**
     * Initialisation
     */
    init() {
        this.createCanvas();
        this.createBlobs();
        this.animate();

        window.addEventListener('themechange', (e) => {
            this.theme = e.detail.theme;
        });

        console.log(`✅ GradientMeshEffect initialisé (${this.blobCount} blobs)`);
    }

    /**
     * Crée les blobs animés
     */
    createBlobs() {
        const colors = this.theme === 'dark'
            ? ['#00E5FF', '#60A5FA', '#B388FF', '#FF1744', '#00FFA3']
            : ['#0284C7', '#3B82F6', '#7C3AED', '#DC2626', '#059669'];

        for (let i = 0; i < this.blobCount; i++) {
            this.blobs.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 150 + 100,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                color: colors[i % colors.length]
            });
        }
    }

    /**
     * Animation blobs organiques
     */
    animate() {
        if (this.isDestroyed) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Appliquer blur pour effet organique
        this.ctx.filter = 'blur(40px)';

        this.blobs.forEach(blob => {
            // Mise à jour position
            blob.x += blob.speedX;
            blob.y += blob.speedY;

            // Rebond sur les bords
            if (blob.x < -blob.radius || blob.x > this.canvas.width + blob.radius) {
                blob.speedX *= -1;
            }
            if (blob.y < -blob.radius || blob.y > this.canvas.height + blob.radius) {
                blob.speedY *= -1;
            }

            // Dessiner blob
            const gradient = this.ctx.createRadialGradient(
                blob.x, blob.y, 0,
                blob.x, blob.y, blob.radius
            );

            const opacity = this.theme === 'dark' ? 0.4 : 0.3;
            gradient.addColorStop(0, this.hexToRgba(blob.color, opacity));
            gradient.addColorStop(1, this.hexToRgba(blob.color, 0));

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.filter = 'none';

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Convertit hex vers rgba
     */
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}

// ===================================
// EXPORTS
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ParticlesEffect,
        VideoMatrixEffect,
        Grid3DEffect,
        GradientMeshEffect
    };
}
