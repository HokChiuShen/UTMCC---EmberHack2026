// UTMCraft - Particle & Visual Effects Engine
// Renders smooth celebratory bursts, glowing shockwaves, and golden stars on canvas

class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animId = null;
        this.colors = ['#F1B82D', '#002A5C', '#007FA3', '#4E9F3D', '#FFFFFF', '#FFD166'];
    }

    init(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.loop = this.loop.bind(this);
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // Standard craft burst at (x, y)
    burst(x, y, isFirstDiscovery = false) {
        const count = isFirstDiscovery ? 48 : 24;
        const colorPalette = isFirstDiscovery
            ? ['#FFD700', '#FFA500', '#FFFFFF', '#F1B82D', '#70D6FF']
            : ['#007FA3', '#F1B82D', '#4E9F3D', '#E2E8F0', '#002A5C'];

        // Add expanding shockwave ring
        this.particles.push({
            type: 'ring',
            x,
            y,
            radius: 10,
            maxRadius: isFirstDiscovery ? 120 : 65,
            lineWidth: isFirstDiscovery ? 4 : 2,
            alpha: 1,
            color: isFirstDiscovery ? '#FFD700' : '#70D6FF'
        });

        // Add radial spark particles
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
            const speed = (isFirstDiscovery ? 4 : 2.5) + Math.random() * (isFirstDiscovery ? 6 : 4);
            const size = (isFirstDiscovery ? 3.5 : 2.5) + Math.random() * 3;
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

            this.particles.push({
                type: 'spark',
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size,
                alpha: 1,
                decay: 0.015 + Math.random() * 0.02,
                color,
                rotation: Math.random() * Math.PI * 2,
                vRot: (Math.random() - 0.5) * 0.2,
                isStar: isFirstDiscovery && Math.random() > 0.4
            });
        }

        if (!this.animId) {
            this.animId = requestAnimationFrame(this.loop);
        }
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }

    loop() {
        if (!this.ctx || !this.canvas) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            if (p.type === 'ring') {
                p.radius += (p.maxRadius - p.radius) * 0.15;
                p.alpha -= 0.04;
                if (p.alpha <= 0 || p.radius >= p.maxRadius - 2) {
                    this.particles.splice(i, 1);
                    continue;
                }
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = p.color;
                this.ctx.globalAlpha = Math.max(0, p.alpha);
                this.ctx.lineWidth = p.lineWidth;
                this.ctx.stroke();
                this.ctx.restore();
            } else {
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.94;
                p.vy *= 0.94;
                p.vy += 0.08; // subtle gravity
                p.alpha -= p.decay;
                p.rotation += p.vRot;

                if (p.alpha <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }

                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rotation);
                this.ctx.globalAlpha = Math.max(0, p.alpha);
                this.ctx.fillStyle = p.color;

                if (p.isStar) {
                    this.drawStar(this.ctx, 0, 0, 5, p.size * 2, p.size);
                } else {
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                this.ctx.restore();
            }
        }

        if (this.particles.length > 0) {
            this.animId = requestAnimationFrame(this.loop);
        } else {
            this.animId = null;
        }
    }
}

export const fx = new ParticleSystem();
