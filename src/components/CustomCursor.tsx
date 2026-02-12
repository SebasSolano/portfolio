import { useEffect, useRef, useCallback } from "react";

/**
 * CustomCursor — Physics-based cursor with magnetic interaction.
 * Uses lerp for smooth following and mix-blend-mode for background blending.
 */
export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);
    const trailRef = useRef<HTMLDivElement>(null);
    
    const pos = useRef({ x: 0, y: 0 });
    const trailPos = useRef({ x: 0, y: 0 });
    const target = useRef({ x: 0, y: 0 });
    
    const scale = useRef(1);
    const targetScale = useRef(1);
    
    const isHovering = useRef(false);
    const isVisible = useRef(false);
    const animFrame = useRef<number>(0);
    const lastSection = useRef<string | null>(null);

    const lerp = (start: number, end: number, factor: number) =>
        start + (end - start) * factor;

    const animate = useCallback(() => {
        // Smooth position for main cursor
        pos.current.x = lerp(pos.current.x, target.current.x, 0.15);
        pos.current.y = lerp(pos.current.y, target.current.y, 0.15);

        // Smoother/Slower position for trail
        trailPos.current.x = lerp(trailPos.current.x, target.current.x, 0.08);
        trailPos.current.y = lerp(trailPos.current.y, target.current.y, 0.08);

        // Smooth scale
        // Reduced growth: 1.2 instead of 1.5
        const hoverScale = isHovering.current ? 1.2 : 1; 
        targetScale.current = hoverScale;
        scale.current = lerp(scale.current, targetScale.current, 0.1);

        if (cursorRef.current) {
            cursorRef.current.style.transform = `translate3d(${pos.current.x - 20}px, ${pos.current.y - 20}px, 0) scale(${scale.current})`;
            
            // Toggle hover class for visual feedback
            if (isHovering.current) {
                cursorRef.current.classList.add("cursor-hover");
            } else {
                cursorRef.current.classList.remove("cursor-hover");
            }
        }

        if (dotRef.current) {
            dotRef.current.style.transform = `translate3d(${target.current.x - 4}px, ${target.current.y - 4}px, 0)`;
            
            // "Click icon" effect: Change shape/color when hovering
            if (isHovering.current) {
                dotRef.current.style.transform += " scale(1.5)";
                dotRef.current.style.backgroundColor = "var(--color-accent-light)";
            } else {
                dotRef.current.style.backgroundColor = "var(--color-accent)";
            }
        }

        // Trail effect in main section
        if (trailRef.current) {
            trailRef.current.style.transform = `translate3d(${trailPos.current.x - 100}px, ${trailPos.current.y - 100}px, 0)`;
            
            if (lastSection.current === "main") {
                trailRef.current.style.opacity = "0.15";
                trailRef.current.style.scale = "1";
            } else {
                trailRef.current.style.opacity = "0";
                trailRef.current.style.scale = "0.5";
            }
        }

        animFrame.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        // Initial visibility check
        const mediaQuery = window.matchMedia("(hover: none)");
        const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
            if (e.matches) {
                isVisible.current = false;
                if (cursorRef.current) cursorRef.current.style.display = "none";
                if (dotRef.current) dotRef.current.style.display = "none";
                if (trailRef.current) trailRef.current.style.display = "none";
            } else {
                isVisible.current = true;
                if (cursorRef.current) cursorRef.current.style.display = "block";
                if (dotRef.current) dotRef.current.style.display = "block";
                if (trailRef.current) trailRef.current.style.display = "block";
            }
        };
        
        // Handle initial state
        handleMediaChange(mediaQuery);
        mediaQuery.addEventListener("change", handleMediaChange);

        const onMouseMove = (e: MouseEvent) => {
            if (!isVisible.current) return;
            
            target.current.x = e.clientX;
            target.current.y = e.clientY;

            // If pos was stuck at 0,0 (resize bug), snap it
            if (pos.current.x === 0 && pos.current.y === 0) {
                pos.current.x = e.clientX;
                pos.current.y = e.clientY;
                trailPos.current.x = e.clientX;
                trailPos.current.y = e.clientY;
            }

            // Detect section
            const currentSection = e.clientY < 100 ? "navbar" : "main";
            lastSection.current = currentSection;
        };

        const onResize = () => {
            // Fix for "buguea de la nada": ensure we don't lose track
            // We rely on the next mouse move to update, but we can check bounds
        };
        
        const onMouseEnterInteractive = () => {
            isHovering.current = true;
        };

        const onMouseLeaveInteractive = () => {
            isHovering.current = false;
        };

        window.addEventListener("resize", onResize);
        window.addEventListener("mousemove", onMouseMove);

        // Add magnetic effect to interactive elements
        const updateInteractiveListeners = () => {
            const interactiveElements = document.querySelectorAll(
                'a, button, [data-cursor="magnetic"], input, textarea, .cursor-pointer'
            );
            
            interactiveElements.forEach((el) => {
                el.addEventListener("mouseenter", onMouseEnterInteractive);
                el.addEventListener("mouseleave", onMouseLeaveInteractive);
            });
            return interactiveElements;
        };
        
        const elements = updateInteractiveListeners();

        animFrame.current = requestAnimationFrame(animate);

        return () => {
            mediaQuery.removeEventListener("change", handleMediaChange);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("mousemove", onMouseMove);
            cancelAnimationFrame(animFrame.current);
            elements.forEach((el) => {
                el.removeEventListener("mouseenter", onMouseEnterInteractive);
                el.removeEventListener("mouseleave", onMouseLeaveInteractive);
            });
        };
    }, [animate]);

    return (
        <>
            {/* Trail — Soft glow behind cursor in main section */}
            <div
                ref={trailRef}
                className="fixed top-0 left-0 z-9990 pointer-events-none w-50 h-50 rounded-full bg-accent blur-3xl transition-opacity duration-500 opacity-0"
                style={{ willChange: "transform, opacity" }}
            />

            {/* Outer ring */}
            <div
                ref={cursorRef}
                className="custom-cursor fixed top-0 left-0 z-9999 pointer-events-none w-10 h-10 rounded-full border border-primary/50 mix-blend-difference transition-colors duration-300 flex items-center justify-center"
                style={{ willChange: "transform" }}
            />
            
            {/* Inner dot */}
            <div
                ref={dotRef}
                className="custom-cursor fixed top-0 left-0 z-9999 pointer-events-none w-2 h-2 rounded-full bg-accent mix-blend-difference transition-all duration-200"
                style={{ willChange: "transform" }}
            />
        </>
    );
}
