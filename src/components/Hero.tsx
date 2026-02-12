import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import HeroScene from "./HeroScene";

/**
 * Hero — Full-viewport intro with 3D particles, centered content,
 * and GSAP text reveal that replays on scroll.
 */
export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const greetRef = useRef<HTMLSpanElement>(null);
    const nameRef = useRef<HTMLHeadingElement>(null);
    const titleRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: 0.5 });

            // Decorative line
            tl.fromTo(
                lineRef.current,
                { scaleX: 0 },
                { scaleX: 1, duration: 0.8, ease: "power3.inOut" }
            )
                // Greeting
                .fromTo(
                    greetRef.current,
                    { y: 30, opacity: 0, filter: "blur(10px)" },
                    { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
                    "-=0.3"
                )
                // Name with clip-path
                .fromTo(
                    nameRef.current,
                    { y: 80, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
                    {
                        y: 0,
                        opacity: 1,
                        clipPath: "inset(0% 0% 0% 0%)",
                        duration: 1.2,
                        ease: "power3.out",
                    },
                    "-=0.4"
                )
                // Title
                .fromTo(
                    titleRef.current,
                    { y: 30, opacity: 0, filter: "blur(8px)" },
                    { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
                    "-=0.5"
                )
                // CTA buttons
                .fromTo(
                    ctaRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
                    "-=0.3"
                )
                // Scroll indicator
                .fromTo(
                    scrollIndicatorRef.current,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
                    "-=0.2"
                );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleScrollDown = () => {
        const aboutSection = document.querySelector("#about");
        if (aboutSection) {
            const lenis = (window as any).__lenis;
            lenis?.scrollTo(aboutSection, { offset: -80, duration: 1.2 });
        }
    };

    return (
        <section
            ref={containerRef}
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* 3D Background */}
            <HeroScene />

            {/* Gradient overlays */}
            <div className="absolute inset-0 z-1 bg-linear-to-b from-bg/30 via-transparent to-bg" />
            <div className="absolute inset-0 z-1 bg-linear-to-r from-bg/40 via-transparent to-bg/40" />

            {/* Centered Content */}
            <div className="relative z-2 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24 text-center">
                <div className="flex flex-col items-center gap-6">
                    <span
                        ref={greetRef}
                        className="font-mono text-sm text-accent tracking-[0.3em] uppercase opacity-0"
                    >
                        Hello, I'm
                    </span>

                    {/* Decorative line */}
                    <div
                        ref={lineRef}
                        className="w-16 h-px bg-linear-to-r from-transparent via-accent to-transparent origin-center"
                        style={{ transform: "scaleX(0)" }}
                    />

                    <h1
                        ref={nameRef}
                        className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] font-bold leading-[0.85] tracking-tighter opacity-0"
                    >
                        Sebastian
                        <br />
                        <span className="text-gradient">Solano</span>
                    </h1>

                    <p
                        ref={titleRef}
                        className="mt-2 font-sans text-lg sm:text-xl md:text-2xl text-muted max-w-2xl opacity-0"
                    >
                        Systems Engineer &{" "}
                        <span className="text-accent font-medium">Creative Developer</span>
                        <br />
                        <span className="mt-2 inline-block text-sm sm:text-base text-muted/60 tracking-wide">
                            Full Stack · Process Automation · Technical Leadership
                        </span>
                    </p>

                    <div ref={ctaRef} className="mt-10 flex flex-col sm:flex-row gap-4 opacity-0">
                        <a
                            href="#projects"
                            onClick={(e) => {
                                e.preventDefault();
                                const el = document.querySelector("#projects");
                                if (el) (window as any).__lenis?.scrollTo(el, { offset: -80 });
                            }}
                            className="group relative px-8 py-4 rounded-2xl bg-accent/10 border border-accent/30 text-accent font-mono text-sm overflow-hidden transition-all duration-300 cursor-pointer hover:border-accent/60"
                            data-cursor="magnetic"
                        >
                            <span className="relative z-10">View Projects</span>
                            <div className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </a>
                        <a
                            href="#contact"
                            onClick={(e) => {
                                e.preventDefault();
                                const el = document.querySelector("#contact");
                                if (el) (window as any).__lenis?.scrollTo(el, { offset: -80 });
                            }}
                            className="px-8 py-4 rounded-2xl border border-border text-primary/70 font-mono text-sm hover:border-accent/30 hover:text-primary transition-all duration-300 cursor-pointer"
                            data-cursor="magnetic"
                        >
                            Get in Touch
                        </a>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div
                ref={scrollIndicatorRef}
                onClick={handleScrollDown}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-2 flex flex-col items-center gap-3 cursor-pointer opacity-0 group"
            >
                <span className="font-mono text-[10px] text-muted/40 uppercase tracking-[0.4em] group-hover:text-accent transition-colors duration-300 animate-bounce">
                    Scroll
                </span>
                <div className="w-px h-10 bg-linear-to-b from-accent/50 to-transparent animate-glow-pulse" />
            </div>
        </section>
    );
}
