import { Container } from "pixi.js";
import gsap from "gsap";

export function gsapTypewriter(container: Container, speed = 0.04) {
    const items = [...container.children];
    if (items.length === 0) {
        const tl = gsap.timeline({paused: true});
        tl.to({}, {duration: speed});
        (tl as any).revealAll = () => {};
        return tl;
    }

    for (const item of items) {
        item.alpha = 0;
        item.visible = true;
    }

    const tl = gsap.timeline({ paused: true});

    items.forEach((item, i) => {
        tl.to(item, {
            alpha: 1,
            duration: speed,
            ease: "power1.out",
            onStart: () => {
                if ("scale" in item) {
                    const baseX = item.scale.x;
                    const baseY = item.scale.y;
                    gsap.fromTo(
                        item.scale,
                        { x: baseX * 0.5, y: baseY * 0.5 },
                        { x: baseX, y: baseY, duration: 0.2, ease: "back.out(2)", overwrite: true }
                    );
                }
            }
        }, i * speed);
    });
    (tl as any).revealAll = () => {
        tl.pause(0);
        tl.progress(1);
        tl.kill();

        for (const item of items) {
            item.alpha = 1;

            if ("scale" in item) {
                item.scale.set(1);
            }
        }
    };
    return tl;
}