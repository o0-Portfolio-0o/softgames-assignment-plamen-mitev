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
        }, i * speed);
    });
    (tl as any).revealAll = () => {
        tl.pause(0);
        tl.progress(1);
        tl.kill();

        for (const item of items) {
            item.alpha = 1;
        }
    };
    return tl;
}