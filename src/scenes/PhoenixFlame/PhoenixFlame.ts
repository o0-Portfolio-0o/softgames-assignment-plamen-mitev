import { Container, Sprite, Texture, BLEND_MODES } from "pixi.js";
import gsap from "gsap";
import baseConfig from "../../core/config";

export class PhoenixFlame extends Container {
    private particles: Sprite[] = [];
    private index = 0;
    private spawnAccumulator = 0;
    private xPos: number;
    private yPos: number;

    constructor(texture: Texture, x: number, y: number) {
        super();

        this.xPos = x;
        this.yPos = y;

        const { maxParticles, anchor, blendMode } = baseConfig.games.phoenixFlame;

        for (let i = 0; i < maxParticles; i++) {
            const p = new Sprite(texture);
            p.anchor.set(anchor);
            p.blendMode = blendMode as BLEND_MODES;
            p.visible = false;
            this.addChild(p);
            this.particles.push(p);
        }
    }

    update(deltaMS: number) {
        this.spawnAccumulator += deltaMS;

        const spawnInterval = 40 + Math.random() * 80;

        if (this.spawnAccumulator >= spawnInterval) {
            this.spawnAccumulator = 0;

            const count = Math.random() < 0.3 ? 2 : 1;
            for (let i = 0; i < count; i++) {
                this.spawnParticle();
            }
        }
    }

    private spawnParticle() {
        const p = this.particles[this.index];
        this.index = (this.index + 1) % this.particles.length;

        p.visible = true;
        p.alpha = 1;

        const scale = 0.3 + Math.random() * 0.9;
        p.scale.set(scale * (0.8 + Math.random() * 0.6));

        p.x = this.xPos + (Math.random() * 40 - 20);
        p.y = this.yPos + (Math.random() * 20 - 10);
        p.rotation = (Math.random() - 0.5) * 0.6;

        const t = Math.random();
        const tint = t < 0.5 ? 0xffdd66 : (t < 0.85 ? 0xff6600 : 0xff1122);
        p.tint = tint;

        const driftX = (Math.random() * 80 - 40);
        const riseY = -120 - Math.random() * 80;
        const life = 1.0 + Math.random() * 1.0;

        gsap.to(p, {
            duration: life,
            x: p.x + driftX,
            y: p.y + riseY,
            alpha: 0,
            rotation: p.rotation + (Math.random() - 0.5) * 2,
            ease: "sine.out",
            onComplete: () => {
                p.visible = false;
            }
        });

        gsap.to(p, {
            duration: life * 0.6,
            tint: 0xffffff,
            ease: "none",
        });
    }

    destroyFlame() {
        gsap.globalTimeline.clear();
        this.removeChildren();
    }
}