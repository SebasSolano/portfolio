import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const NAV_LINKS = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
];

/**
 * Navbar — Floating glassmorphism navigation.
 * Mobile: full-screen overlay with NO visible close button; tapping
 * any link or the background auto-closes the menu.
 */
export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const tl = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // GSAP mobile menu timeline
    useEffect(() => {
        if (!menuRef.current) return;

        tl.current = gsap.timeline({ paused: true });
        tl.current
            .to(menuRef.current, {
                clipPath: "circle(150% at calc(100% - 2rem) 2rem)",
                duration: 0.6,
                ease: "power3.inOut",
            })
            .fromTo(
                menuRef.current.querySelectorAll(".nav-link-mobile"),
                { y: 60, opacity: 0, filter: "blur(8px)" },
                {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    stagger: 0.1,
                    duration: 0.5,
                    ease: "power2.out",
                },
                "-=0.3"
            );

        return () => {
            tl.current?.kill();
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            tl.current?.play();
            // Prevent body scroll
            document.body.style.overflow = "hidden";
        } else {
            tl.current?.reverse();
            document.body.style.overflow = "";
        }
    }, [isOpen]);

    const handleLinkClick = (href: string) => {
        setIsOpen(false);
        const el = document.querySelector(href);
        if (el) {
            const lenis = (window as any).__lenis;
            lenis?.scrollTo(el, { offset: -80, duration: 1.2 });
        }
    };

    return (
        <>
            {/* Desktop Nav */}
            <nav
                className={`fixed top-5 left-5 right-5 z-100 rounded-2xl flex items-center justify-center transition-all duration-500 ${scrolled
                    ? "glass border-border py-4"
                    : "bg-transparent border border-transparent py-5"
                    }`}
            >
                <div className="w-full max-w-7xl px-6 md:px-8 flex items-center justify-between">
                    {/* Logo */}
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            const lenis = (window as any).__lenis;
                            lenis?.scrollTo(0, { duration: 1.2 });
                        }}
                        className="font-display font-bold text-xl tracking-tight cursor-pointer"
                        data-cursor="magnetic"
                    >
                        <span className="text-accent">S</span>
                        <span className="text-primary/80">olano</span>
                    </a>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLinkClick(link.href);
                                }}
                                className="relative font-mono text-sm text-muted hover:text-primary transition-colors duration-300 cursor-pointer group"
                                data-cursor="magnetic"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
                            </a>
                        ))}
                        <a
                            href="/resume.pdf"
                            className="ml-2 px-6 py-2.5 rounded-lg text-sm font-mono border border-accent/30 text-accent hover:bg-accent/10 transition-all duration-300 cursor-pointer"
                            data-cursor="magnetic"
                        >
                            Résumé
                        </a>
                    </div>

                    {/* Hamburger — only shows when menu is CLOSED */}
                    {!isOpen && (
                        <button
                            onClick={() => setIsOpen(true)}
                            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 cursor-pointer z-110 group"
                            data-cursor="magnetic"
                            aria-label="Open menu"
                        >
                            <span className="block w-6 h-px bg-primary transition-all duration-300 group-hover:w-8 group-hover:bg-accent" />
                            <span className="block w-4 h-px bg-accent transition-all duration-300 group-hover:w-8" />
                            <span className="block w-6 h-px bg-primary transition-all duration-300 group-hover:w-8 group-hover:bg-accent" />
                        </button>
                    )}
                </div>
            </nav>

            {/* Mobile Menu — no close button, links & background tap close it */}
            <div
                ref={menuRef}
                className="fixed inset-0 z-105 bg-bg/98 backdrop-blur-3xl flex flex-col items-center justify-center gap-10 md:hidden"
                style={{ clipPath: "circle(0% at calc(100% - 2rem) 2rem)" }}
                onClick={(e) => {
                    // Close when background is tapped
                    if (e.target === menuRef.current) {
                        setIsOpen(false);
                    }
                }}
            >
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-8 right-8 z-110 w-12 h-12 rounded-full glass flex items-center justify-center cursor-pointer hover:border-accent/40 transition-all duration-300 group"
                    data-cursor="magnetic"
                    aria-label="Close menu"
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

                {/* Section number decoration */}
                <div className="absolute top-20 left-8 font-display text-[8rem] font-bold text-primary/10 leading-none select-none pointer-events-none">
                    MENU
                </div>

                {NAV_LINKS.map((link, i) => (
                    <a
                        key={link.href}
                        href={link.href}
                        onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick(link.href);
                        }}
                        className="nav-link-mobile flex items-center gap-4 font-display text-4xl sm:text-5xl font-semibold text-primary hover:text-accent transition-colors duration-300 cursor-pointer opacity-0"
                    >
                        <span className="font-mono text-xs text-accent/40">
                            0{i + 1}
                        </span>
                        {link.label}
                    </a>
                ))}
            </div>
        </>
    );
}
