import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceItem {
    date: string;
    title: string;
    company: string;
    description: string[];
    tags: string[];
}

const EXPERIENCES: ExperienceItem[] = [
    {
        date: "Jun 2025 — Dec 2026",
        title: "Fullstack Developer & Project Leader",
        company: "OddiSoluciones",
        description: [
            "Architected a scalable CRM platform reducing cattle management overhead by 40% using modern tech stacks.",
            "Led cross-functional Scrum teams to deliver 12+ iterative releases with 99.9% uptime.",
            "Automated CI/CD pipelines, cutting deployment time from hours to minutes.",
        ],
        tags: ["Architecture", "Team Leadership", "CI/CD", "React/Node"],
    },
    {
        date: "Feb 2024 — Present",
        title: "Systems Engineer",
        company: "Mayor's Office of Montería",
        description: [
            "Optimized government workflows, processing 500+ daily requests with 30% faster turnaround.",
            "Engineered secure administrative solutions ensuring 100% data integrity and compliance.",
            "Modernized legacy IT infrastructure, reducing maintenance downtime by 25%.",
        ],
        tags: ["Process Optimization", "Security", "Infrastructure", "GovTech"],
    },
];

/**
 * Experience — Interactive vertical timeline with persistent scroll animations.
 * Line draws progressively with scrub, cards slide in from alternating sides.
 */
export default function Experience() {
    const sectionRef = useRef<HTMLElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Heading reveal
            gsap.fromTo(
                headingRef.current,
                { y: 60, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
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

            // Timeline line — scrub animation
            if (lineRef.current) {
                gsap.fromTo(
                    lineRef.current,
                    { scaleY: 0 },
                    {
                        scaleY: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top 50%",
                            end: "bottom 60%",
                            scrub: 0.8,
                        },
                    }
                );
            }

            // Experience cards — slide in with persistent reverse
            const cards = sectionRef.current?.querySelectorAll(".exp-card");
            if (cards) {
                cards.forEach((card, i) => {
                    gsap.fromTo(
                        card,
                        {
                            x: i % 2 === 0 ? -80 : 80,
                            opacity: 0,
                            filter: "blur(8px)",
                        },
                        {
                            x: 0,
                            opacity: 1,
                            filter: "blur(0px)",
                            duration: 1,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: card,
                                start: "top 88%",
                                end: "top 20%",
                                toggleActions: "play reverse play reverse",
                            },
                        }
                    );
                });
            }

            // Timeline dots
            const dots = sectionRef.current?.querySelectorAll(".timeline-dot");
            if (dots) {
                dots.forEach((dot) => {
                    gsap.fromTo(
                        dot,
                        { scale: 0, opacity: 0 },
                        {
                            scale: 1,
                            opacity: 1,
                            duration: 0.5,
                            ease: "back.out(2.5)",
                            scrollTrigger: {
                                trigger: dot,
                                start: "top 85%",
                                end: "top 20%",
                                toggleActions: "play reverse play reverse",
                            },
                        }
                    );
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="experience"
            className="section-spacer section-padding"
        >
            <div className="section-divider mb-20 md:mb-28" />

            <div className="max-w-6xl mx-auto">
                {/* Section Label */}
                <div className="flex items-center gap-4 mb-8">
                    <span className="font-mono text-xs text-accent tracking-widest uppercase">
                        02
                    </span>
                    <div className="h-px w-12 bg-accent/30" />
                    <span className="font-mono text-xs text-muted tracking-widest uppercase">
                        Experience
                    </span>
                </div>

                <h2
                    ref={headingRef}
                    className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-20 opacity-0"
                >
                    Where I've <span className="text-gradient">worked.</span>
                </h2>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px">
                        <div
                            ref={lineRef}
                            className="w-full h-full bg-linear-to-b from-accent via-accent/50 to-accent/10 origin-top"
                        />
                    </div>

                    {/* Experience Entries */}
                    <div className="space-y-24">
                        {EXPERIENCES.map((exp, index) => (
                            <div
                                key={exp.company}
                                className={`exp-card relative flex flex-col md:flex-row items-start gap-8 opacity-0 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                    }`}
                            >
                                {/* Timeline Dot */}
                                <div className="timeline-dot absolute left-6 md:left-1/2 w-4 h-4 -translate-x-2 rounded-full bg-accent glow-accent-sm z-10 mt-1">
                                    <div className="absolute inset-0 rounded-full bg-accent animate-glow-pulse" />
                                </div>

                                {/* Date */}
                                <div
                                    className={`pl-16 md:pl-0 md:w-1/2 ${index % 2 === 0
                                        ? "md:text-right md:pr-16"
                                        : "md:text-left md:pl-16"
                                        }`}
                                >
                                    <span className="font-mono text-sm text-accent tracking-wider">
                                        {exp.date}
                                    </span>
                                </div>

                                {/* Content Card */}
                                <div
                                    className={`pl-16 md:pl-0 md:w-1/2 ${index % 2 === 0 ? "md:pl-16" : "md:pr-16"
                                        }`}
                                >
                                    <div className="glass rounded-2xl p-10 glass-hover transition-all duration-500 group cursor-pointer hover:glow-accent-sm">
                                        <h3 className="font-display text-xl md:text-2xl font-semibold mb-2 group-hover:text-accent transition-colors duration-300">
                                            {exp.title}
                                        </h3>
                                        <p className="font-mono text-sm text-accent/70 mb-6">
                                            @ {exp.company}
                                        </p>

                                        <ul className="space-y-3 mb-6">
                                            {exp.description.map((desc, i) => (
                                                <li
                                                    key={i}
                                                    className="flex gap-4 text-sm text-primary/60 leading-relaxed"
                                                >
                                                    <span className="text-accent/50 mt-1 shrink-0">
                                                        ▹
                                                    </span>
                                                    {desc}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="flex flex-wrap gap-2">
                                            {exp.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-4 py-2 rounded-full text-[11px] font-mono uppercase tracking-wider border border-accent/20 text-accent/70 hover:border-accent/40 transition-colors duration-200"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Education */}
                <div className="mt-24 glass rounded-2xl p-10 text-center max-w-2xl mx-auto hover:glow-accent-sm transition-all duration-500">
                    <span className="font-mono text-xs text-accent tracking-widest uppercase block mb-4">
                        Education
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">
                        Systems Engineering
                    </h3>
                    <p className="text-muted text-sm font-mono">
                        Universidad del Sinú · Graduated December 2024
                    </p>
                </div>
            </div>
        </section>
    );
}
