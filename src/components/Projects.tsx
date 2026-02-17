import { useEffect, useRef, useState, useCallback, useMemo, memo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";

gsap.registerPlugin(ScrollTrigger);

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// --- TYPES ---

export type ProjectType = 'livestock' | 'government' | 'tech' | 'design';

export interface Project {
    title: string;
    description: string;
    longDescription?: string;
    date: string;
    client: string;
    tags: string[];
    image: string;
    demoUrl?: string;
    repoUrl?: string;
    // New properties
    isFeatured: boolean;
    influenceScore: number;
    primaryColor: string;
    secondaryColor: string;
    type: ProjectType;
    colors?: Record<string, any>;
    banner?: string;
    gallery?: string[];
}

// --- UTILS ---

/**
 * Validates and ensures sufficient contrast between two colors (WCAG 2.1 AA).
 */
function checkContrast(color1: string, color2: string): boolean {
    const getLuminance = (hex: string) => {
        const rgb = parseInt(hex.slice(1), 16);
        const r = ((rgb >> 16) & 0xff) / 255;
        const g = ((rgb >> 8) & 0xff) / 255;
        const b = (rgb & 0xff) / 255;
        
        const a = [r, g, b].map(v => 
            v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
        );
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    
    // WCAG AA for large text requires 3:1, normal text 4.5:1. 
    // We enforce a baseline of 3:1 for decorative elements.
    if (ratio < 3) {
        console.warn(`Low contrast ratio (${ratio.toFixed(2)}) between ${color1} and ${color2}`);
        return false;
    }
    return true;
}

// --- HOOKS ---

/**
 * Custom ScrollLock hook that prevents background scrolling
 * while maintaining the current scroll position.
 */
function useScrollLock(isOpen: boolean) {
    useEffect(() => {
        if (!isOpen) return;

        const scrollY = window.scrollY;
        const body = document.body;

        // 1. Save position and lock
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.width = '100%';
        body.style.overflowY = 'hidden';

        // 2. Prevent wheel/touch events
        const preventDefault = (e: Event) => e.preventDefault();
        window.addEventListener('wheel', preventDefault, { passive: false });
        window.addEventListener('touchmove', preventDefault, { passive: false });

        return () => {
            // 3. Restore
            body.style.position = '';
            body.style.top = '';
            body.style.width = '';
            body.style.overflowY = '';
            window.removeEventListener('wheel', preventDefault);
            window.removeEventListener('touchmove', preventDefault);
            window.scrollTo(0, scrollY);
        };
    }, [isOpen]);
}

// --- SUB-COMPONENTS ---

/**
 * 3D Logo Component using R3F
 * Rotates on hover.
 */
function ThreeLogo({ color }: { color: string }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.5;
            meshRef.current.rotation.y += delta * (hovered ? 2 : 0.5);
        }
    });

    return (
        <mesh
            ref={meshRef}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            scale={hovered ? 1.2 : 1}
        >
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={color} wireframe />
        </mesh>
    );
}

/**
 * Grass Animation Plugin (Livestock)
 * Uses SVG and GSAP for realistic sway.
 */
const GrassPlugin = memo(() => {
    const grassRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!grassRef.current) return;
        const blades = grassRef.current.querySelectorAll('.grass-blade');
        
        blades.forEach((blade, i) => {
            gsap.to(blade, {
                rotate: "random(-10, 10)",
                transformOrigin: "bottom center",
                duration: "random(1.5, 3)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.1
            });
        });
    }, []);

    return (
        <div className="w-full h-24 absolute bottom-0 left-0 overflow-hidden pointer-events-none z-10">
            <svg ref={grassRef} viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
                {Array.from({ length: 20 }).map((_, i) => (
                    <path
                        key={i}
                        className="grass-blade"
                        d={`M${i * 5 + 2},20 Q${i * 5 + 4},10 ${i * 5 + 2 + (Math.random() * 4 - 2)},0`}
                        stroke="#4ade80"
                        strokeWidth="1"
                        fill="none"
                    />
                ))}
            </svg>
        </div>
    );
});

/**
 * Tech Plugin (Government/Tech)
 * Geometric 3D elements placeholder
 */
const TechPlugin = memo(({ colors }: { colors?: Record<string, any> }) => {
    return (
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
             <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <Suspense fallback={null}>
                    <GradeGainScene colors={colors} />
                </Suspense>
             </Canvas>
        </div>
    );
});

function GradeGainScene({ colors }: { colors?: Record<string, any> }) {
    const texture = useTexture('/projects/gradegain-logo-white.png');
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if(groupRef.current) {
             groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
        }
    });

    const palette = colors ? [
        colors.green?.DEFAULT || "#57FE1E",
        colors.blue?.DEFAULT || "#CAFAE1",
        colors.danger?.DEFAULT || "#fb7185",
        colors.warning?.DEFAULT || "#fcd34d",
        colors.neutral?.DEFAULT || "#E8E8E8"
    ] : ["white"];

    return (
        <group ref={groupRef}>
            {/* Center Logo */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[3, 3]} />
                <meshBasicMaterial 
                    map={texture} 
                    transparent 
                    opacity={1} 
                    side={THREE.DoubleSide}
                    depthWrite={false}
                />
            </mesh>

            {/* Floating Shapes */}
            {[...Array(8)].map((_, i) => {
                const color = palette[i % palette.length];
                const position: [number, number, number] = [
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 2 - 1
                ];
                
                return (
                    <FloatingMesh key={i} position={position} color={color} index={i} />
                );
            })}
        </group>
    );
}

function FloatingMesh({ position, color, index }: { position: [number, number, number], color: string, index: number }) {
    const meshRef = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.01 * (index % 2 === 0 ? 1 : -1);
            meshRef.current.rotation.y += 0.015 * (index % 3 === 0 ? 1 : -1);
            meshRef.current.position.y += Math.sin(state.clock.elapsedTime + index) * 0.005;
        }
    });

    // Random geometry type
    const geometry = useMemo(() => {
        const type = index % 3;
        if (type === 0) return <boxGeometry args={[0.4, 0.4, 0.4]} />;
        if (type === 1) return <tetrahedronGeometry args={[0.4]} />;
        return <octahedronGeometry args={[0.3]} />;
    }, [index]);

    return (
        <mesh ref={meshRef} position={position}>
            {geometry}
            <meshStandardMaterial 
                color={color} 
                wireframe={index % 2 === 0} 
                transparent 
                opacity={0.3} 
                depthWrite={false}
            />
        </mesh>
    );
}


/**
 * Design Plugin (Design)
 * Abstract geometric shapes using CSS
 */
const DesignPlugin = memo(() => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-current animate-[spin_10s_linear_infinite]" />
            <div className="absolute top-20 right-20 w-20 h-20 border border-current rotate-45 animate-[pulse_3s_ease-in-out_infinite]" />
        </div>
    );
});

const PLUGINS: Record<ProjectType, React.FC<any> | null> = {
    livestock: GrassPlugin,
    government: TechPlugin,
    tech: TechPlugin,
    design: DesignPlugin
};

// --- MODAL ---

/**
 * ProjectModal — Redesigned with 2 columns, magic book scroll, and plugins.
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
    useScrollLock(isOpen);

    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const leftColRef = useRef<HTMLDivElement>(null);
    const rightColRef = useRef<HTMLDivElement>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Ensure contrast
    useEffect(() => {
        if (project) {
            checkContrast(project.primaryColor, project.secondaryColor);
            // Set dynamic CSS variables
            document.documentElement.style.setProperty('--project-primary', project.primaryColor);
            document.documentElement.style.setProperty('--project-secondary', project.secondaryColor);
            setCurrentImageIndex(0);
        }
    }, [project]);

    // Magic Book Scroll Effect
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const scrollProgress = target.scrollTop / (target.scrollHeight - target.clientHeight);
        
        if (rightColRef.current) {
            // Parallax / Book effect
            gsap.to(rightColRef.current, {
                rotationY: -5 + (scrollProgress * 10), // -5 to 5 deg
                perspective: 1000,
                ease: "power1.out",
                duration: 0.5
            });
        }
    }, []);

    // Enter/Exit Animations
    useEffect(() => {
        if (!isOpen || !project || !overlayRef.current || !contentRef.current) return;

        const lenis = (window as any).__lenis;
        lenis?.stop();

        const tl = gsap.timeline();

        // 1. Overlay
        tl.to(overlayRef.current, {
            backgroundColor: "rgba(5,5,5,0.95)",
            backdropFilter: "blur(30px)",
            duration: 0.4,
            ease: "power2.out",
        });

        // 2. Modal expansion
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

            tl.to(contentRef.current, {
                top: "2.5vh",
                left: "2.5vw",
                width: "95vw",
                height: "95vh",
                borderRadius: "1.5rem",
                duration: 0.6,
                ease: "power3.inOut",
            }, "-=0.2");
        }

        // 3. Content Reveal
        tl.fromTo(
            [leftColRef.current, rightColRef.current],
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" },
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

        tl.to([leftColRef.current, rightColRef.current], {
            y: 20, opacity: 0, duration: 0.3
        });

        if (originRect) {
            tl.to(contentRef.current, {
                top: originRect.top,
                left: originRect.left,
                width: originRect.width,
                height: originRect.height,
                borderRadius: "1rem",
                duration: 0.5,
                ease: "power3.inOut",
            }, "-=0.2");
        }

        tl.to(overlayRef.current, {
            backgroundColor: "rgba(0,0,0,0)",
            backdropFilter: "blur(0px)",
            duration: 0.3
        }, "-=0.2");

    }, [onClose, originRect]);

    if (!project) return null;

    const PluginComponent = PLUGINS[project.type];
    
    // Gallery Logic
    const images = project.gallery && project.gallery.length > 0 ? project.gallery : [project.image];
    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <>
            <div
                ref={overlayRef}
                onClick={handleClose}
                className="fixed inset-0 z-[200] cursor-pointer"
                style={{ backgroundColor: "rgba(0,0,0,0)", pointerEvents: isOpen ? "all" : "none" }}
            />

            <div
                ref={contentRef}
                className="fixed z-[210] overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-2xl"
                style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "all" : "none" }}
            >
                <div 
                    className="flex flex-col lg:flex-row h-full w-full"
                    onScroll={handleScroll}
                >
                    {/* Left Column (40%) - Dev Content */}
                    <div 
                        ref={leftColRef}
                        className="w-full lg:w-[40%] h-full p-8 lg:p-12 overflow-y-auto relative border-r border-white/5"
                    >
                        {/* Header: Banner or 3D Logo */}
                        {project.banner ? (
                            <div className="h-32 w-full mb-8 rounded-xl relative z-10 overflow-hidden shadow-lg border border-white/10">
                                <img src={project.banner} alt={`${project.title} Banner`} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="h-32 w-full mb-8 flex items-center justify-center bg-white/5 rounded-xl relative z-10">
                                 <Canvas>
                                    <ambientLight intensity={0.5} />
                                    <pointLight position={[10, 10, 10]} />
                                    <ThreeLogo color={project.primaryColor} />
                                 </Canvas>
                            </div>
                        )}

                        {/* Content Container with Blur for Contrast */}
                        <div className="relative z-10 bg-black/60 backdrop-blur-xs p-6 rounded-2xl border border-white/5 shadow-xl">
                            <div className="mb-4">
                                <span 
                                    className="font-mono text-xs tracking-widest uppercase px-2 py-1 rounded"
                                    style={{ backgroundColor: `${project.primaryColor}20`, color: project.primaryColor }}
                                >
                                    {project.client}
                                </span>
                            </div>

                            <h2 className="font-display text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                {project.title}
                            </h2>

                            <p className="text-white/80 text-lg leading-relaxed mb-8">
                                {project.longDescription}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-10">
                                {project.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-mono border border-white/10 text-white/60">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                {project.demoUrl && (
                                    <a 
                                        href={project.demoUrl} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-mono text-white"
                                    >
                                        Live Demo
                                    </a>
                                )}
                                {project.repoUrl && (
                                    <a 
                                        href={project.repoUrl} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 rounded-lg border border-white/10 hover:border-white/30 transition text-sm font-mono text-white"
                                    >
                                        Code
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Plugin Area (e.g. Grass or Tech 3D) */}
                        {PluginComponent && <PluginComponent colors={project.colors} />}
                    </div>

                    {/* Right Column (60%) - Gallery/Image */}
                    <div 
                        ref={rightColRef}
                        className="w-full lg:w-[60%] h-full relative overflow-hidden bg-black/50"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                         {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-white/10 transition"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="w-full h-full flex items-center justify-center relative perspective-container">
                            {/* Horizontal Scroll Gallery */}
                            <div 
                                className="w-full h-full flex items-center overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-8 px-[10%] py-12"
                                onScroll={(e) => {
                                    const target = e.currentTarget;
                                    const progress = target.scrollLeft / (target.scrollWidth - target.clientWidth);
                                    
                                    // Update progress bar
                                    const progressBar = document.getElementById('gallery-progress');
                                    if(progressBar) progressBar.style.width = `${progress * 100}%`;

                                    // Rotate images based on center position
                                    const cards = target.querySelectorAll('.gallery-card');
                                    const centerX = target.getBoundingClientRect().width / 2;
                                    
                                    cards.forEach((card) => {
                                        const rect = card.getBoundingClientRect();
                                        const cardCenter = rect.left + rect.width / 2;
                                        const dist = (cardCenter - centerX) / (target.clientWidth / 2);
                                        // Clamp rotation between -15 and 15
                                        const rotation = Math.max(-15, Math.min(15, dist * 15));
                                        
                                        gsap.to(card, {
                                            rotationY: rotation,
                                            scale: 1 - Math.abs(dist) * 0.1,
                                            duration: 0.5,
                                            ease: "power2.out"
                                        });
                                    });
                                }}
                            >
                                {images.map((img, i) => (
                                    <div 
                                        key={i}
                                        className="gallery-card flex-shrink-0 w-[85%] md:w-[70%] aspect-video relative snap-center cursor-pointer group"
                                        style={{ perspective: "1000px" }}
                                        onClick={() => {
                                            // Page flip effect on click
                                            const card = document.getElementById(`card-${i}`);
                                            if(card) {
                                                gsap.to(card, {
                                                    rotationY: 180,
                                                    duration: 0.6,
                                                    ease: "back.inOut(1.7)",
                                                    yoyo: true,
                                                    repeat: 1
                                                });
                                            }
                                        }}
                                        id={`card-${i}`}
                                    >
                                        <div 
                                            className="w-full h-full rounded-xl overflow-hidden shadow-2xl transition-all duration-500 transform-style-3d bg-[#1a1a1a]"
                                            style={{ 
                                                boxShadow: `0 20px 50px -12px ${project.primaryColor}40`
                                            }}
                                        >
                                            <img 
                                                src={img} 
                                                alt={`${project.title} gallery ${i + 1}`}
                                                className="w-full h-full object-cover backface-hidden"
                                                loading="lazy"
                                            />
                                            {/* Back of the card (for flip effect) */}
                                            <div 
                                                className="absolute inset-0 bg-black/90 flex items-center justify-center backface-hidden"
                                                style={{ transform: "rotateY(180deg)" }}
                                            >
                                                <span className="font-mono text-white/50 text-sm">
                                                    {project.title} • {i + 1}/{images.length}
                                                </span>
                                            </div>

                                            {/* Overlay Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                                            
                                            {/* Reflection/Shine effect */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Progress Indicator */}
                            {images.length > 1 && (
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        id="gallery-progress"
                                        className="h-full bg-white transition-all duration-300 ease-out"
                                        style={{ width: '0%', backgroundColor: project.primaryColor }}
                                    />
                                </div>
                            )}
                            
                            {/* Scroll Hint */}
                            {images.length > 1 && (
                                <div className="absolute bottom-12 right-8 animate-pulse hidden md:block">
                                    <IoIosArrowForward className="text-white/30 text-2xl" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// --- PROJECT CARD ---

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
            className={`group relative opacity-0 cursor-pointer ${project.isFeatured ? 'lg:col-span-2' : ''}`}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-cursor="magnetic"
        >
            <div
                className="rounded-2xl overflow-hidden transition-all duration-700 border border-white/10 hover:border-white/20 flex flex-col h-full relative"
                style={{
                    background: isHovered
                        ? `linear-gradient(135deg, ${project.primaryColor}10 0%, #050505 70%)`
                        : "rgba(255,255,255,0.02)",
                    boxShadow: isHovered
                        ? `0 0 60px ${project.primaryColor}15`
                        : "none",
                    borderColor: isHovered ? `${project.primaryColor}40` : 'rgba(255,255,255,0.1)',
                }}
            >
                {/* Featured Badge */}
                {project.isFeatured && (
                    <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded-full">
                        <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Featured</span>
                    </div>
                )}

                {/* Preview Area */}
                <div className={`relative ${project.isFeatured ? 'aspect-21/9' : 'aspect-16/10'} overflow-hidden`}>
                    <div
                        className={`absolute inset-0 transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"}`}
                        style={{
                            background: `linear-gradient(135deg, ${project.primaryColor}20 0%, #050505 100%)`,
                        }}
                    />
                    
                    {/* Placeholder for image if not loading real one */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                         <span className="font-mono text-sm text-white/20">Project Preview</span>
                    </div>

                    {/* Number */}
                    <div className="absolute top-6 left-6 font-display text-7xl md:text-8xl font-bold leading-none opacity-[0.04]">
                        {String(index + 1).padStart(2, "0")}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-10 flex flex-col grow gap-6">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">
                            {project.client} · {project.date}
                        </span>
                    </div>

                    <h3 className="font-display text-2xl md:text-3xl font-bold group-hover:text-white transition-colors duration-500 text-white/90">
                        {project.title}
                    </h3>

                    <p className="text-white/40 text-sm leading-relaxed">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider border border-white/10 text-white/40"
                                style={{
                                    borderColor: isHovered ? `${project.primaryColor}40` : 'rgba(255,255,255,0.1)',
                                    color: isHovered ? `${project.primaryColor}` : 'rgba(255,255,255,0.4)'
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

// --- MAIN COMPONENT ---

export default function Projects({ projects }: { projects: Project[] }) {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [originRect, setOriginRect] = useState<DOMRect | null>(null);

    // Sort projects by influence score
    const sortedProjects = useMemo(() => {
        return [...projects].sort((a, b) => b.influenceScore - a.influenceScore);
    }, [projects]);

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

    const handleProjectSelect = useCallback((project: Project, rect: DOMRect) => {
        setSelectedProject(project);
        setOriginRect(rect);
        setModalOpen(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setModalOpen(false);
        setTimeout(() => {
            setSelectedProject(null);
            setOriginRect(null);
        }, 600);
    }, []);

    return (
        <>
            <section
                ref={sectionRef}
                id="projects"
                className="section-spacer section-padding"
            >
                <div className="section-divider mb-20 md:mb-28" />

                <div className="w-full">
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {sortedProjects.map((project, index) => (
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
