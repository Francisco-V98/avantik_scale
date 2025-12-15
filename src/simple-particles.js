export class SimpleParticles {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resizeTimeout = null;

        // Configuration: "Digital Circuit"
        this.config = {
            count: 50,
            colors: [
                '#324BFF',  // Brand Blue
                '#00D1B2',  // Cyan
                '#FFFFFF'   // White
            ],
            baseSpeed: 2,
            trailLength: 20
        };

        this.mouse = { x: null, y: null };
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const canvasArea = this.canvas.width * this.canvas.height;
        const count = Math.floor(canvasArea / 25000); // Sparse but distinct

        for (let i = 0; i < count; i++) {
            this.particles.push(this.createSingleParticle());
        }
    }

    createSingleParticle() {
        const isHorizontal = Math.random() > 0.5;
        const speed = this.config.baseSpeed * (Math.random() * 0.5 + 0.8);
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: isHorizontal ? (Math.random() > 0.5 ? speed : -speed) : 0,
            vy: !isHorizontal ? (Math.random() > 0.5 ? speed : -speed) : 0,
            color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
            history: [],
            size: Math.random() * 2 + 2,
            changeDirTimer: Math.random() * 100
        };
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.resize();
                this.createParticles();
            }, 100);
        });

        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Slight trails effect by not clearing completely? 
        // No, let's clear and draw manual trails for cleaner look on transparency
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];

            // Update History
            p.history.push({ x: p.x, y: p.y });
            if (p.history.length > this.config.trailLength) {
                p.history.shift();
            }

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Timer to change direction
            p.changeDirTimer--;
            if (p.changeDirTimer <= 0) {
                p.changeDirTimer = Math.random() * 50 + 20; // Reset timer
                // Turn 90 degrees
                if (p.vx !== 0) {
                    // Moving X -> Switch to Y
                    p.vx = 0;
                    p.vy = (Math.random() > 0.5 ? 1 : -1) * this.config.baseSpeed;
                } else {
                    // Moving Y -> Switch to X
                    p.vy = 0;
                    p.vx = (Math.random() > 0.5 ? 1 : -1) * this.config.baseSpeed;
                }
            }

            // Wrap around screen
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Reset history on wrap (visual glitch fix) 
            // Actually simpler to just let it streak or clear history
            if (Math.abs(p.x - p.history[p.history.length - 1]?.x) > 10 ||
                Math.abs(p.y - p.history[p.history.length - 1]?.y) > 10) {
                p.history = [];
            }

            // Interact with mouse (Disrupt circuit)
            if (this.mouse.x != null) {
                let dx = p.x - this.mouse.x;
                let dy = p.y - this.mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    // Turn away
                    if (Math.abs(dx) < Math.abs(dy)) {
                        p.vx = (dx > 0 ? 1 : -1) * this.config.baseSpeed * 2;
                        p.vy = 0;
                    } else {
                        p.vy = (dy > 0 ? 1 : -1) * this.config.baseSpeed * 2;
                        p.vx = 0;
                    }
                }
            }

            // Draw Trail
            this.ctx.beginPath();
            if (p.history.length > 0) {
                this.ctx.moveTo(p.history[0].x, p.history[0].y);
                for (let j = 1; j < p.history.length; j++) {
                    this.ctx.lineTo(p.history[j].x, p.history[j].y);
                }
                this.ctx.lineTo(p.x, p.y);
            }
            this.ctx.strokeStyle = p.color;
            this.ctx.globalAlpha = 0.5;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;

            // Draw Head (Data Packet)
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);

            // Glow
            // this.ctx.shadowBlur = 5;
            // this.ctx.shadowColor = p.color;
        }
    }
}
