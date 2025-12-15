export class SimpleParticles {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resizeTimeout = null;

        // Configuration: "Hyper Geometry" - Faster, more energetic
        this.config = {
            count: 70, // Density
            colors: [
                'rgba(255, 255, 255, 0.2)', // Brighter White
                'rgba(50, 75, 255, 0.4)',  // Stronger Blue
                'rgba(50, 75, 255, 0.15)', // Mid Blue
                'rgba(253, 69, 77, 0.4)'   // Accent Red (added back for energy)
            ],
            baseSpeed: 1.5, // Significantly faster
            rotationSpeedVar: 2.0
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
        const count = canvasArea / 20000; // More particles

        for (let i = 0; i < count; i++) {
            const types = ['circle', 'square', 'cross', 'triangle', 'diamond'];
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                // Much faster random velocity
                vx: (Math.random() - 0.5) * this.config.baseSpeed,
                vy: (Math.random() - 0.5) * this.config.baseSpeed,
                size: Math.random() * 8 + 3, // Larger
                type: types[Math.floor(Math.random() * types.length)],
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                rotation: Math.random() * 360,
                // Faster rotation
                rotationSpeed: (Math.random() - 0.5) * this.config.rotationSpeedVar
            });
        }
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
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];

            // Move
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;

            // Wall bounce instead of wrap for more "contained energy" feel
            if (p.x < 0 || p.x > this.canvas.width) {
                p.vx = -p.vx;
                p.rotationSpeed = -p.rotationSpeed; // Spin change on bounce
            }
            if (p.y < 0 || p.y > this.canvas.height) {
                p.vy = -p.vy;
                p.rotationSpeed = -p.rotationSpeed;
            }

            // Interactive "Evasion" - Particles run away from mouse fast
            if (this.mouse.x != null) {
                let dx = p.x - this.mouse.x;
                let dy = p.y - this.mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    const force = (200 - dist) / 200;
                    // Strong push
                    p.vx += (dx / dist) * force * 0.5;
                    p.vy += (dy / dist) * force * 0.5;
                }
            }

            // Friction (to stop them accelerating infinitely from mouse)
            // But let them keep base momentum
            const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (currentSpeed > this.config.baseSpeed * 2) {
                p.vx *= 0.95;
                p.vy *= 0.95;
            } else if (currentSpeed < this.config.baseSpeed * 0.5) {
                // Ensure they don't stop completely
                p.vx *= 1.05;
                p.vy *= 1.05;
            }


            // Draw Shapes
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation * Math.PI / 180);

            // Add shadow for depth
            // this.ctx.shadowColor = p.color;
            // this.ctx.shadowBlur = 10;

            this.ctx.fillStyle = p.color;
            this.ctx.strokeStyle = p.color;
            this.ctx.lineWidth = 1.5; // Thicker lines

            if (p.type === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (p.type === 'square') {
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            } else if (p.type === 'cross') {
                this.ctx.beginPath();
                const s = p.size / 2;
                this.ctx.moveTo(-s, 0); this.ctx.lineTo(s, 0);
                this.ctx.moveTo(0, -s); this.ctx.lineTo(0, s);
                this.ctx.stroke();
            } else if (p.type === 'triangle') {
                this.ctx.beginPath();
                const s = p.size / 2;
                this.ctx.moveTo(0, -s);
                this.ctx.lineTo(s, s);
                this.ctx.lineTo(-s, s);
                this.ctx.closePath();
                this.ctx.stroke();
            } else if (p.type === 'diamond') {
                this.ctx.beginPath();
                const s = p.size / 1.5;
                this.ctx.moveTo(0, -s);
                this.ctx.lineTo(s, 0);
                this.ctx.lineTo(0, s);
                this.ctx.lineTo(-s, 0);
                this.ctx.closePath();
                this.ctx.fill();
            }

            this.ctx.restore();
        }
    }
}
