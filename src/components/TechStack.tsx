import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    SiDjango,
    SiLaravel,
    SiReact,
    SiAngular,
    SiNodedotjs,
    SiVuedotjs,
    SiNx,
    SiNextdotjs,
    SiFlutter,
    SiPostgresql,
    SiMongodb,
    SiFirebase,
    SiSupabase,
    SiDart,
    SiPhp,
} from "react-icons/si";
import { FaJava, FaPython } from "react-icons/fa6"; // Using Fa6 for Java/Python if Si doesn't have good ones or preference

gsap.registerPlugin(ScrollTrigger);

interface TechItem {
    name: string;
    icon: React.ElementType;
    color?: string; // Optional custom color
}

const TECHNOLOGIES: TechItem[] = [
    { name: "Django", icon: SiDjango, color: "#092E20" },
    { name: "Laravel", icon: SiLaravel, color: "#FF2D20" },
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Angular", icon: SiAngular, color: "#DD0031" },
    { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
    { name: "Vue.js", icon: SiVuedotjs, color: "#4FC08D" },
    { name: "Nuxt", icon: SiNx, color: "#00DC82" },
    { name: "Next.js", icon: SiNextdotjs, color: "#000000" }, // White in dark mode handled by class
    { name: "Flutter", icon: SiFlutter, color: "#02569B" },
    { name: "Java", icon: FaJava, color: "#007396" },
    { name: "Python", icon: FaPython, color: "#3776AB" },
    { name: "PHP", icon: SiPhp, color: "#777BB4" },
    { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
    { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
    { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
    { name: "Dart", icon: SiDart, color: "#0175C2" },
];

/**
 * TechStack — Infinite CSS marquee carousel with persistent scroll reveal.
 */
export default function TechStack() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Heading label
            gsap.fromTo(
                headingRef.current,
                { x: -40, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: "top 90%",
                        end: "top 20%",
                        toggleActions: "play reverse play reverse",
                    },
                }
            );

            // Marquee rows
            const rows = sectionRef.current?.querySelectorAll(".marquee-row");
            if (rows) {
                gsap.fromTo(
                    rows,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.15,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top 90%",
                            end: "top 15%",
                            toggleActions: "play reverse play reverse",
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const TechIcon = ({ tech }: { tech: TechItem }) => (
        <div className="flex items-center gap-4 px-8 py-5 glass rounded-xl whitespace-nowrap shrink-0 hover:border-accent/30 transition-all duration-300 cursor-pointer group">
            <tech.icon
                className="w-6 h-6 text-muted group-hover:text-accent transition-colors duration-300"
            />
            <span className="font-mono text-xs text-muted group-hover:text-primary transition-colors duration-300">
                {tech.name}
            </span>
        </div>
    );

    return (
        <section
            ref={sectionRef}
            id="tech"
            className="section-spacer overflow-hidden"
        >
            <div className="section-divider mb-16 md:mb-20" />

            <div
                ref={headingRef}
                className="w-full section-padding mb-10 opacity-0"
            >
                <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-accent tracking-widest uppercase">
                        04
                    </span>
                    <div className="h-px w-12 bg-accent/30" />
                    <span className="font-mono text-xs text-muted tracking-widest uppercase">
                        Tech Stack
                    </span>
                </div>
            </div>

            {/* Marquee Row 1 */}
            <div className="marquee-row relative mb-6 opacity-0">
                <div className="flex gap-8 animate-marquee">
                    {[...TECHNOLOGIES, ...TECHNOLOGIES].map((tech, i) => (
                        <TechIcon key={`${tech.name}-${i}`} tech={tech} />
                    ))}
                </div>
            </div>

            {/* Marquee Row 2 */}
            <div className="marquee-row relative opacity-0">
                <div className="flex gap-8 animate-marquee-reverse">
                    {[
                        ...TECHNOLOGIES.slice().reverse(),
                        ...TECHNOLOGIES.slice().reverse(),
                    ].map((tech, i) => (
                        <TechIcon key={`${tech.name}-rev-${i}`} tech={tech} />
                    ))}
                </div>
            </div>

            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-bg to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-bg to-transparent z-10 pointer-events-none" />
        </section>
    );
}
