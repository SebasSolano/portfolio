import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * About — Bio section with persistent scroll animations (replay on scroll up/down),
 * parallax stat cards, and proper centered layout.
 */
export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Section label — slide in from left
            gsap.fromTo(
                labelRef.current,
                { x: -60, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: labelRef.current,
                        start: "top 90%",
                        end: "top 20%",
                        toggleActions: "play reverse play reverse",
                    },
                }
            );

            // Heading — clip-path reveal
            gsap.fromTo(
                headingRef.current,
                { y: 80, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
                {
                    y: 0,
                    opacity: 1,
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: "top 85%",
                        end: "top 15%",
                        toggleActions: "play reverse play reverse",
                    },
                }
            );

            // Text paragraphs — stagger with blur
            const paragraphs = textRef.current?.querySelectorAll(".about-para");
            if (paragraphs) {
                gsap.fromTo(
                    paragraphs,
                    { y: 50, opacity: 0, filter: "blur(6px)" },
                    {
                        y: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: textRef.current,
                            start: "top 80%",
                            end: "top 10%",
                            toggleActions: "play reverse play reverse",
                        },
                    }
                );
            }

            // Stats — scale + glow animation
            const statItems = statsRef.current?.querySelectorAll(".stat-item");
            if (statItems) {
                gsap.fromTo(
                    statItems,
                    { y: 40, opacity: 0, scale: 0.9 },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        stagger: 0.12,
                        ease: "back.out(1.4)",
                        scrollTrigger: {
                            trigger: statsRef.current,
                            start: "top 85%",
                            end: "top 10%",
                            toggleActions: "play reverse play reverse",
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const stats = [
        { value: "2+", label: "Years of Experience", icon: "⏱" },
        { value: "14+", label: "Technologies Mastered", icon: "⚡" },
        { value: "3", label: "Awards & Recognitions", icon: "🏆" },
        { value: "∞", label: "Lines of Code & Counting", icon: "💻" },
    ];

    return (
        <section
            ref={sectionRef}
            id="about"
            className="section-spacer section-padding"
        >
            {/* Divider */}
            <div className="section-divider mb-20 md:mb-28" />

            <div className="w-full">
                {/* Section Label */}
                <div ref={labelRef} className="flex items-center gap-4 mb-16 opacity-0">
                    <span className="font-mono text-xs text-accent tracking-widest uppercase">
                        01
                    </span>
                    <div className="h-px w-12 bg-accent/30" />
                    <span className="font-mono text-xs text-muted tracking-widest uppercase">
                        About
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                    {/* Text Column - Asymmetric Layout */}
                    <div className="lg:col-span-6 xl:col-span-5">
                        <h2
                            ref={headingRef}
                            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-10 opacity-0"
                        >
                            Crafting digital
                            <br />
                            solutions{" "}
                            <span className="text-gradient">with purpose.</span>
                        </h2>

                        <div
                            ref={textRef}
                            className="space-y-6 text-primary/70 text-base md:text-lg leading-[1.8]"
                        >
                            <p className="about-para opacity-0">
                                <span className="font-bold text-primary">The digital world is chaotic.</span>{" "}
                                Bloated systems, slow interfaces, and confusing workflows aren't just annoying—they're
                                costing businesses millions in lost productivity and user frustration. In an era where
                                speed is currency, bad software is a liability you can't afford.
                            </p>
                            <p className="about-para opacity-0">
                                But it doesn't have to be this way. I don't just write code; I engineer{" "}
                                <span className="text-primary font-medium">clarity out of complexity</span>.
                                By merging rigorous Scrum methodologies with elegant full-stack architecture, I transform
                                tangled processes into streamlined, high-performance engines that drive real growth.
                            </p>
                            <p className="about-para opacity-0">
                                Whether it's a mission-critical CRM or a government-scale platform, I deliver solutions that are
                                <span className="text-accent font-medium"> invisible yet powerful</span>.
                                Stop settling for "good enough" software. Let's build the competitive advantage your business deserves.
                            </p>

                            <div className="pt-4 about-para opacity-0">
                                <a
                                    href="#projects"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const el = document.querySelector("#projects");
                                        const lenis = (window as any).__lenis;
                                        lenis?.scrollTo(el, { offset: -80, duration: 1.2 });
                                    }}
                                    className="relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-mono font-medium tracking-tighter text-white bg-accent rounded-lg group cursor-pointer shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all duration-300 hover:scale-105"
                                >
                                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                                    <span className="relative flex items-center gap-2">
                                        View My Work
                                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Stats Column - Puzzle Layout */}
                    <div
                        ref={statsRef}
                        className="lg:col-span-6 xl:col-span-7 relative min-h-125 hidden lg:block"
                    >
                        {/* Stat 1: Top Left */}
                        <div className="stat-item absolute top-0 left-0 w-64 glass rounded-2xl p-6 glass-hover transition-all duration-500 opacity-0 cursor-pointer group hover:-translate-y-2">
                            <div className="flex flex-col gap-2">
                                <div className="font-display text-5xl font-bold text-accent group-hover:glow-text transition-all duration-300">
                                    {stats[0].value}
                                </div>
                                <div className="font-mono text-[11px] text-muted/70 tracking-wide uppercase leading-tight">
                                    {stats[0].label}
                                </div>
                            </div>
                        </div>

                        {/* Stat 2: Top Right (Higher) */}
                        <div className="stat-item absolute -top-12 right-10 w-64 glass rounded-2xl p-6 glass-hover transition-all duration-500 opacity-0 cursor-pointer group hover:-translate-y-2">
                            <div className="flex flex-col gap-2">
                                <div className="font-display text-5xl font-bold text-accent group-hover:glow-text transition-all duration-300">
                                    {stats[1].value}
                                </div>
                                <div className="font-mono text-[11px] text-muted/70 tracking-wide uppercase leading-tight">
                                    {stats[1].label}
                                </div>
                            </div>
                        </div>

                        {/* Stat 3: Bottom Left (Shifted Left) */}
                        <div className="stat-item absolute bottom-20 -left-12 w-64 glass rounded-2xl p-6 glass-hover transition-all duration-500 opacity-0 cursor-pointer group hover:-translate-y-2">
                            <div className="flex flex-col gap-2">
                                <div className="font-display text-5xl font-bold text-accent group-hover:glow-text transition-all duration-300">
                                    {stats[2].value}
                                </div>
                                <div className="font-mono text-[11px] text-muted/70 tracking-wide uppercase leading-tight">
                                    {stats[2].label}
                                </div>
                            </div>
                        </div>

                        {/* Stat 4: Bottom Center */}
                        <div className="stat-item absolute bottom-0 left-1/2 -translate-x-1/2 w-64 glass rounded-2xl p-6 glass-hover transition-all duration-500 opacity-0 cursor-pointer group hover:-translate-y-2">
                            <div className="flex flex-col gap-2">
                                <div className="font-display text-5xl font-bold text-accent group-hover:glow-text transition-all duration-300">
                                    {stats[3].value}
                                </div>
                                <div className="font-mono text-[11px] text-muted/70 tracking-wide uppercase leading-tight">
                                    {stats[3].label}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile/Tablet Fallback for Stats */}
                    <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5">
                         {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="stat-item glass rounded-2xl p-6 glass-hover transition-all duration-500 opacity-0 cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="font-display text-4xl font-bold text-accent group-hover:glow-text transition-all duration-300">
                                        {stat.value}
                                    </div>
                                    <div className="font-mono text-[11px] text-muted/70 tracking-wide uppercase leading-tight">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
