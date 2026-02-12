import { useEffect, useRef, useCallback } from "react";

/**
 * CustomCursor — Physics-based cursor with magnetic interaction.
 * Uses lerp for smooth following and mix-blend-mode for background blending.
 */
export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);
    const pos = useRef({ x: 0, y: 0 });
    const target = useRef({ x: 0, y: 0 });
    const scale = useRef(1);
    const targetScale = useRef(1);
    const isHovering = useRef(false);
    const animFrame = useRef<number>(0);
    const lastSection = useRef<string | null>(null);

    const lerp = (start: number, end: number, factor: number) =>
        start + (end - start) * factor;

    const animate = useCallback(() => {
        // Smooth position
        pos.current.x = lerp(pos.current.x, target.current.x, 0.12);
        pos.current.y = lerp(pos.current.y, target.current.y, 0.12);

        // Smooth scale
        const hoverScale = isHovering.current ? 1.5 : 1; // Reduced from 2.5
        targetScale.current = hoverScale;
        scale.current = lerp(scale.current, targetScale.current, 0.1);

        if (cursorRef.current) {
            cursorRef.current.style.transform = `translate3d(${pos.current.x - 20}px, ${pos.current.y - 20}px, 0) scale(${scale.current})`;
        }
        if (dotRef.current) {
            dotRef.current.style.transform = `translate3d(${target.current.x - 4}px, ${target.current.y - 4}px, 0)`;
        }

        animFrame.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        // Don't show on touch devices
        if (window.matchMedia("(hover: none)").matches) return;

        const onMouseMove = (e: MouseEvent) => {
            target.current.x = e.clientX;
            target.current.y = e.clientY;

            // Detect section change (Navbar vs Main interactions)
            // Assuming Navbar height ~80-100px.
            const currentSection = e.clientY < 100 ? "navbar" : "main";

            if (lastSection.current && lastSection.current !== currentSection) {
                // Trigger flash animation
                triggerFlash();
            }
            lastSection.current = currentSection;
        };

        const triggerFlash = () => {
            if (cursorRef.current) {
                // Quick flash animation using GSAP if available, or simple class toggle
                // Since this component uses vanilla JS requestAnimationFrame for perf, let's use a quick CSS class or style burst
                const el = cursorRef.current;
                el.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
                el.style.borderColor = "rgba(255, 255, 255, 0.8)";

                setTimeout(() => {
                    el.style.backgroundColor = "";
                    el.style.borderColor = "";
                }, 150);
            }
        };

        const onMouseEnterInteractive = () => {
            isHovering.current = true;
        };

        const onMouseLeaveInteractive = () => {
            isHovering.current = false;
        };

        window.addEventListener("mousemove", onMouseMove);

        // Add magnetic effect to interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, [data-cursor="magnetic"], input, textarea'
        );

        interactiveElements.forEach((el) => {
            el.addEventListener("mouseenter", onMouseEnterInteractive);
            el.addEventListener("mouseleave", onMouseLeaveInteractive);
        });

        animFrame.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            cancelAnimationFrame(animFrame.current);
            interactiveElements.forEach((el) => {
                el.removeEventListener("mouseenter", onMouseEnterInteractive);
                el.removeEventListener("mouseleave", onMouseLeaveInteractive);
            });
        };
    }, [animate]);

    return (
        <>
            {/* Outer ring — blends with background */}
            <div
                ref={cursorRef}
                className="custom-cursor fixed top-0 left-0 z-9999 pointer-events-none w-10 h-10 rounded-full border border-primary/50 mix-blend-difference transition-colors duration-300"
                style={{ willChange: "transform" }}
            />
            {/* Inner dot */}
            <div
                ref={dotRef}
                className="custom-cursor fixed top-0 left-0 z-9999 pointer-events-none w-2 h-2 rounded-full bg-accent mix-blend-difference"
                style={{ willChange: "transform" }}
            />
        </>
    );
}
