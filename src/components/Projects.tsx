import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
    title: string;
    description: string;
    longDescription: string;
    date: string;
    client: string;
    tags: string[];
    image: string;
    demoUrl?: string;
    repoUrl?: string;
    color: string;
}

const PROJECTS: Project[] = [
    {
        title: "Cattle Industry CRM",
        description:
            "Comprehensive CRM platform for the cattle industry with herd management, financial tracking, and real-time analytics.",
        longDescription:
            "A comprehensive CRM platform designed for the cattle industry, featuring herd management, financial tracking, sales pipelines, and real-time analytics dashboards. Built with automated deployment pipelines and Scrum-driven iteration cycles. The platform handles thousands of records with optimized PostgreSQL queries and a responsive React frontend that works seamlessly across desktop and mobile devices.",
        date: "2025",
        client: "OddiSoluciones",
        tags: ["Django", "React", "PostgreSQL", "Docker", "Scrum"],
        image: "/projects/crm-preview.svg",
        demoUrl: "#",
        repoUrl: "#",
        color: "125, 91, 166",
    },
    {
        title: "Admin Process Optimizer",
        description:
            "Government software solution to streamline administrative workflows and digitize paper-based processes.",
        longDescription:
            "Software solution designed for the Mayor's Office of Montería to streamline administrative workflows, digitize paper-based processes, and provide real-time operational dashboards for government departments. The system reduced processing time by automating form submissions and approval chains, while maintaining strict security protocols required by government institutions.",
        date: "2024",
        client: "Mayor's Office of Montería",
        tags: ["Laravel", "Vue.js", "Oracle", "Government"],
        image: "/projects/admin-preview.svg",
        demoUrl: "#",
        color: "91, 166, 125",
    },
    {
        title: "Portfolio Engine",
        description:
            "High-performance portfolio featuring custom cursor physics, 3D particles, and GSAP-powered scroll animations.",
        longDescription:
            "A high-performance portfolio system built with Astro, React, and Three.js featuring custom cursor physics with lerp smoothing, GSAP-powered scroll animations with persistent triggers, smooth scrolling via Lenis, and an interactive 3D particle system that reacts to mouse movement. Every animation is crafted to feel cinematic and immersive.",
        date: "2025",
        client: "Personal",
        tags: ["Astro", "React", "Three.js", "GSAP", "TailwindCSS"],
        image: "/projects/portfolio-preview.svg",
        repoUrl: "#",
        color: "166, 125, 91",
    },
];

/**
 * ProjectModal — Full-screen immersive modal with cinematic transitions.
 * Morphs from the clicked card position to a full-screen overlay.
 */
function ProjectModal({
    project,
    isOpen,
    onClose,
    originRect,
}: {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
    originRect: DOMRect | null;
}) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen || !project || !overlayRef.current || !contentRef.current) return;

        const lenis = (window as any).__lenis;
        lenis?.stop();

        // Animate open
        const tl = gsap.timeline();

        tl.to(overlayRef.current, {
            backgroundColor: "rgba(5,5,5,0.92)",
            backdropFilter: "blur(30px)",
            duration: 0.4,
            ease: "power2.out",
        });

        // Morph from card origin
        if (originRect) {
            gsap.set(contentRef.current, {
                position: "fixed",
                top: originRect.top,
                left: originRect.left,
                width: originRect.width,
                height: originRect.height,
                borderRadius: "1rem",
                opacity: 1,
            });

            tl.to(
                contentRef.current,
                {
                    top: "5vh",
                    left: "5vw",
                    width: "90vw",
                    height: "90vh",
                    borderRadius: "1.5rem",
                    duration: 0.6,
                    ease: "power3.inOut",
                },
                "-=0.2"
            );
        }

        // Reveal inner content
        tl.fromTo(
            innerRef.current?.querySelectorAll(".modal-reveal") ?? [],
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.08,
                duration: 0.5,
                ease: "power2.out",
            },
            "-=0.2"
        );

        return () => {
            tl.kill();
        };
    }, [isOpen, project, originRect]);

    const handleClose = useCallback(() => {
        if (!overlayRef.current || !contentRef.current) {
            onClose();
            return;
        }

        const tl = gsap.timeline({
            onComplete: () => {
                const lenis = (window as any).__lenis;
                lenis?.start();
                onClose();
            },
        });

        tl.to(innerRef.current?.querySelectorAll(".modal-reveal") ?? [], {
            y: -20,
            opacity: 0,
            stagger: 0.04,
            duration: 0.3,
            ease: "power2.in",
        });

        if (originRect) {
            tl.to(
                contentRef.current,
                {
                    top: originRect.top,
                    left: originRect.left,
                    width: originRect.width,
                    height: originRect.height,
                    borderRadius: "1rem",
                    duration: 0.5,
                    ease: "power3.inOut",
                },
                "-=0.1"
            );
        }

        tl.to(
            overlayRef.current,
            {
                backgroundColor: "rgba(5,5,5,0)",
                backdropFilter: "blur(0px)",
                duration: 0.3,
                ease: "power2.in",
            },
            "-=0.2"
        );
    }, [onClose, originRect]);

    if (!project) return null;

    return (
        <>
            {/* Overlay */}
            <div
                ref={overlayRef}
                onClick={handleClose}
                className="fixed inset-0 z-200 cursor-pointer"
                style={{
                    backgroundColor: "rgba(5,5,5,0)",
                    backdropFilter: "blur(0px)",
                    pointerEvents: isOpen ? "all" : "none",
                }}
            />

            {/* Modal Content */}
            <div
                ref={contentRef}
                className="fixed z-210 overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, rgba(${project.color}, 0.08) 0%, rgba(5,5,5,0.98) 50%)`,
                    border: `1px solid rgba(${project.color}, 0.15)`,
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? "all" : "none",
                }}
            >
                <div
                    ref={innerRef}
                    className="h-full overflow-y-auto p-8 md:p-12 lg:p-16"
                    data-lenis-prevent
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="modal-reveal fixed top-8 right-8 z-220 w-12 h-12 rounded-full glass flex items-center justify-center cursor-pointer hover:border-accent/40 transition-all duration-300 group"
                        aria-label="Close project"
                    >
                        <svg
                            className="w-5 h-5 text-muted group-hover:text-accent transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    {/* Project Header */}
                    <div className="max-w-4xl mx-auto pt-4">
                        <div className="modal-reveal mb-4">
                            <span className="font-mono text-xs tracking-widest uppercase" style={{ color: `rgba(${project.color}, 0.7)` }}>
                                {project.client} · {project.date}
                            </span>
                        </div>

                        <h2 className="modal-reveal font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05]">
                            {project.title}
                        </h2>

                        {/* Decorative line */}
                        <div
                            className="modal-reveal w-20 h-px mb-8"
                            style={{ background: `rgba(${project.color}, 0.4)` }}
                        />

                        <p className="modal-reveal text-primary/70 text-lg md:text-xl leading-relaxed mb-10 max-w-3xl">
                            {project.longDescription}
                        </p>

                        {/* Tech Tags */}
                        <div className="modal-reveal flex flex-wrap gap-3 mb-12">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider border text-primary/60"
                                    style={{
                                        borderColor: `rgba(${project.color}, 0.2)`,
                                        background: `rgba(${project.color}, 0.05)`,
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Preview Area */}
                        <div
                            className="modal-reveal w-full aspect-video rounded-2xl mb-10 overflow-hidden"
                            style={{
                                background: `linear-gradient(135deg, rgba(${project.color}, 0.12) 0%, rgba(5,5,5,0.6) 100%)`,
                                border: `1px solid rgba(${project.color}, 0.1)`,
                            }}
                        >
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="font-mono text-sm text-muted/30">
                                    Project Preview
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="modal-reveal flex gap-4 pb-8">
                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    className="px-8 py-4 rounded-xl font-mono text-sm font-medium transition-all duration-300 cursor-pointer"
                                    style={{
                                        background: `rgba(${project.color}, 0.15)`,
                                        border: `1px solid rgba(${project.color}, 0.3)`,
                                        color: `rgb(${project.color})`,
                                    }}
                                >
                                    Live Demo →
                                </a>
                            )}
                            {project.repoUrl && (
                                <a
                                    href={project.repoUrl}
                                    className="px-8 py-4 rounded-xl border border-border text-primary/70 font-mono text-sm hover:border-accent/30 transition-all duration-300 cursor-pointer"
                                >
                                    Source Code →
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

/**
 * ProjectCard — Immersive card that morphs into full-screen modal on click.
 */
function ProjectCard({
    project,
    index,
    onSelect,
}: {
    project: Project;
    index: number;
    onSelect: (project: Project, rect: DOMRect) => void;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                cardRef.current,
                { y: 100, opacity: 0, filter: "blur(6px)" },
                {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: "top 90%",
                        end: "top 15%",
                        toggleActions: "play reverse play reverse",
                    },
                }
            );
        }, cardRef);

        return () => ctx.revert();
    }, []);

    const handleClick = () => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            onSelect(project, rect);
        }
    };

    return (
        <div
            ref={cardRef}
            className="group relative opacity-0 cursor-pointer"
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-cursor="magnetic"
        >
            <div
                className="rounded-2xl overflow-hidden transition-all duration-700 border border-border hover:border-transparent flex flex-col h-full"
                style={{
                    background: isHovered
                        ? `linear-gradient(135deg, rgba(${project.color}, 0.06) 0%, rgba(5,5,5,0.95) 70%)`
                        : "rgba(255,255,255,0.02)",
                    boxShadow: isHovered
                        ? `0 0 60px rgba(${project.color}, 0.08), 0 0 120px rgba(${project.color}, 0.04)`
                        : "none",
                }}
            >
                {/* Preview Area */}
                <div className="relative aspect-16/10 overflow-hidden">
                    <div
                        className={`absolute inset-0 bg-linear-to-br transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"
                            }`}
                        style={{
                            background: `linear-gradient(135deg, rgba(${project.color}, 0.12) 0%, rgba(5,5,5,0.8) 100%)`,
                        }}
                    />

                    {/* Number */}
                    <div className="absolute top-6 left-6 font-display text-7xl md:text-8xl font-bold leading-none opacity-[0.04]">
                        {String(index + 1).padStart(2, "0")}
                    </div>

                    {/* Open indicator */}
                    <div
                        className={`absolute bottom-6 right-6 flex items-center gap-2 font-mono text-xs tracking-wider uppercase transition-all duration-500 ${isHovered
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2"
                            }`}
                        style={{ color: `rgba(${project.color}, 0.8)` }}
                    >
                        <span>Open Project</span>
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                            />
                        </svg>
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-10 md:p-14 flex flex-col grow gap-7">
                    <div className="flex items-center justify-between mb-4">
                        <span
                            className="font-mono text-[11px] uppercase tracking-widest"
                            style={{ color: `rgba(${project.color}, 0.5)` }}
                        >
                            {project.client} · {project.date}
                        </span>
                    </div>

                    <h3 className="font-display text-2xl md:text-3xl font-bold mb-4 group-hover:text-accent transition-colors duration-500">
                        {project.title}
                    </h3>

                    <p className="text-primary/40 text-sm leading-relaxed mb-6">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-5 py-2 rounded-full text-[11px] font-mono uppercase tracking-wider border text-primary/40"
                                style={{
                                    borderColor: `rgba(${project.color}, 0.25)`,
                                    background: `rgba(${project.color}, 0.05)`,
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Projects — Grid layout with immersive modal on click.
 */
export default function Projects() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [originRect, setOriginRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
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
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleProjectSelect = (project: Project, rect: DOMRect) => {
        setSelectedProject(project);
        setOriginRect(rect);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setTimeout(() => {
            setSelectedProject(null);
            setOriginRect(null);
        }, 600);
    };

    // Close modal on Escape
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && modalOpen) {
                handleModalClose();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [modalOpen]);

    return (
        <>
            <section
                ref={sectionRef}
                id="projects"
                className="section-spacer section-padding"
            >
                <div className="section-divider mb-20 md:mb-28" />

                <div className="max-w-7xl mx-auto">
                    {/* Section Label */}
                    <div className="flex items-center gap-4 mb-8">
                        <span className="font-mono text-xs text-accent tracking-widest uppercase">
                            03
                        </span>
                        <div className="h-px w-12 bg-accent/30" />
                        <span className="font-mono text-xs text-muted tracking-widest uppercase">
                            Projects
                        </span>
                    </div>

                    <h2
                        ref={headingRef}
                        className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-16 opacity-0"
                    >
                        Selected <span className="text-gradient">work.</span>
                    </h2>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {PROJECTS.map((project, index) => (
                            <ProjectCard
                                key={project.title}
                                project={project}
                                index={index}
                                onSelect={handleProjectSelect}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Full-screen Project Modal */}
            <ProjectModal
                project={selectedProject}
                isOpen={modalOpen}
                onClose={handleModalClose}
                originRect={originRect}
            />
        </>
    );
}
