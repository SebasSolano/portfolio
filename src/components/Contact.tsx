import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Contact — Minimalist form with magnetic social links.
 * Persistent scroll animations.
 */
export default function Contact() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        message: "",
    });

    const slotRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial reveal animation (standard)
            const revealTl = gsap.timeline();
            revealTl.fromTo(
                headingRef.current,
                { y: 80, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
                {
                    y: 0,
                    opacity: 1,
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 1,
                    ease: "power3.out",
                }
            );

            const elements = sectionRef.current?.querySelectorAll(".contact-reveal");
            if (elements) {
                revealTl.fromTo(
                    elements,
                    { y: 50, opacity: 0, filter: "blur(6px)" },
                    {
                        y: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power3.out",
                    },
                    "-=0.5"
                );
            }

            // Scroll-triggered "Outro" Sequence
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top", 
                    end: "+=2500", 
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                }
            });

            // 1. Fade out everything except H2
            tl.to(elements || [], {
                opacity: 0,
                y: -30,
                filter: "blur(10px)",
                stagger: 0.05,
                duration: 2
            });

            // 2. Move H2 to center (calculated dynamically)
            tl.to(headingRef.current, {
                x: () => {
                    if (!headingRef.current) return 0;
                    const rect = headingRef.current.getBoundingClientRect();
                    const viewCenter = window.innerWidth / 2;
                    const elCenter = rect.left + rect.width / 2;
                    return viewCenter - elCenter;
                },
                y: () => {
                     if (!headingRef.current) return 0;
                     const rect = headingRef.current.getBoundingClientRect();
                     const viewCenter = window.innerHeight / 2;
                     const elCenter = rect.top + rect.height / 2;
                     return viewCenter - elCenter;
                },
                scale: 1.3,
                duration: 4,
                ease: "power2.inOut"
            }, "-=1"); // Overlap slightly

            // 3. Pause (hold position)
            tl.to({}, { duration: 2 });

            // 4. Slot Machine Animation (Rolling Text)
            // We animate the 'y' of the span to show different words
            if (slotRef.current) {
                tl.to(slotRef.current, {
                    y: "-75%", // Move up to show the last item (assuming 4 items)
                    duration: 4,
                    ease: "elastic.out(1, 0.5)"
                });
            }
            
            // Final pause
            tl.to({}, { duration: 1 });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const subject = encodeURIComponent(
            `Portfolio Contact from ${formState.name}`
        );
        const body = encodeURIComponent(formState.message);
        window.open(
            `mailto:sebaxsolanom@gmail.com?subject=${subject}&body=${body}`,
            "_blank"
        );
    };

    return (
        <section
            ref={sectionRef}
            id="contact"
            className="section-spacer section-padding"
        >
            <div className="section-divider mb-20 md:mb-28" />

            <div className="w-full">
                {/* Section Label */}
                <div className="flex items-center gap-4 mb-8 contact-reveal opacity-0">
                    <span className="font-mono text-xs text-accent tracking-widest uppercase">
                        05
                    </span>
                    <div className="h-px w-12 bg-accent/30" />
                    <span className="font-mono text-xs text-muted tracking-widest uppercase">
                        Contact
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                    <div className="lg:col-span-6 xl:col-span-5">
                        <h2
                            ref={headingRef}
                            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-8 opacity-0 leading-[1.1] relative z-20"
                        >
                            Let's build
                            <br />
                            <span className="text-gradient block h-[1.1em] overflow-hidden">
                                <span ref={slotRef} className="block">
                                    something together.
                                    <br />
                                    the future.
                                    <br />
                                    your vision.
                                    <br />
                                    a legacy.
                                </span>
                            </span>
                        </h2>

                        <p className="contact-reveal text-muted text-lg mb-16 max-w-xl opacity-0">
                            Have a project in mind or just want to chat? I'm always open to
                            discussing new opportunities and ideas.
                        </p>
                        
                         {/* Direct Links (Moved here for asymmetry) */}
                         <div className="flex flex-col gap-8 contact-reveal opacity-0 mb-12">
                            <div>
                                <span className="font-mono text-xs text-muted uppercase tracking-wider block mb-2">
                                    Email
                                </span>
                                <a
                                    href="mailto:sebaxsolanom@gmail.com"
                                    className="magnetic font-display text-xl md:text-2xl font-semibold hover:text-accent transition-colors duration-300 cursor-pointer inline-block"
                                    data-cursor="magnetic"
                                >
                                    sebaxsolanom@gmail.com
                                </a>
                            </div>

                            <div>
                                <span className="font-mono text-xs text-muted uppercase tracking-wider block mb-2">
                                    Phone
                                </span>
                                <a
                                    href="tel:+573137874304"
                                    className="magnetic font-display text-xl md:text-2xl font-semibold hover:text-accent transition-colors duration-300 cursor-pointer inline-block"
                                    data-cursor="magnetic"
                                >
                                    +57 313 787 4304
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="lg:col-span-6 xl:col-span-7">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-8 contact-reveal opacity-0 bg-white/5 p-8 rounded-3xl border border-white/10"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block font-mono text-xs text-muted mb-3 uppercase tracking-wider"
                                    >
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={formState.name}
                                        onChange={(e) =>
                                            setFormState({ ...formState, name: e.target.value })
                                        }
                                        className="w-full bg-transparent border-b border-border py-4 text-primary text-lg font-sans placeholder:text-muted/20 focus:border-accent focus:outline-none transition-colors duration-300"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block font-mono text-xs text-muted mb-3 uppercase tracking-wider"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formState.email}
                                        onChange={(e) =>
                                            setFormState({ ...formState, email: e.target.value })
                                        }
                                        className="w-full bg-transparent border-b border-border py-4 text-primary text-lg font-sans placeholder:text-muted/20 focus:border-accent focus:outline-none transition-colors duration-300"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="block font-mono text-xs text-muted mb-3 uppercase tracking-wider"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    value={formState.message}
                                    onChange={(e) =>
                                        setFormState({ ...formState, message: e.target.value })
                                    }
                                    rows={4}
                                    className="w-full bg-transparent border-b border-border py-4 text-primary text-lg font-sans placeholder:text-muted/20 focus:border-accent focus:outline-none transition-colors duration-300 resize-none"
                                    placeholder="Tell me about your project..."
                                    required
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="group relative px-12 py-6 rounded-2xl bg-accent text-bg font-mono text-sm font-bold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(125,91,166,0.6)] cursor-pointer"
                                    data-cursor="magnetic"
                                >
                                    <span className="relative z-10">Send Message →</span>
                                </button>
                            </div>
                        </form>
                         
                         {/* Achievements - Below Form or Beside */}
                         <div className="mt-12 contact-reveal opacity-0">
                             <div className="glass rounded-2xl p-6 inline-block">
                                <span className="font-mono text-xs text-accent uppercase tracking-wider block mb-4">
                                    Achievements
                                </span>
                                <ul className="space-y-3">
                                    {[
                                        "Hackathon Montería (2019)",
                                        "RedCOLSI Recognition (2019)",
                                        "RedCOLSI Recognition (2022)",
                                    ].map((achievement) => (
                                        <li
                                            key={achievement}
                                            className="flex items-center gap-3 text-sm text-primary/60"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-accent/50 shrink-0" />
                                            {achievement}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
