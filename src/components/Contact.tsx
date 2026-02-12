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

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Heading
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

            // Content reveals
            const elements =
                sectionRef.current?.querySelectorAll(".contact-reveal");
            if (elements) {
                gsap.fromTo(
                    elements,
                    { y: 50, opacity: 0, filter: "blur(6px)" },
                    {
                        y: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top 70%",
                            end: "top 10%",
                            toggleActions: "play reverse play reverse",
                        },
                    }
                );
            }
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

            <div className="max-w-5xl mx-auto">
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

                <h2
                    ref={headingRef}
                    className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-8 opacity-0 leading-[1.1]"
                >
                    Let's build
                    <br />
                    <span className="text-gradient">something together.</span>
                </h2>

                <p className="contact-reveal text-muted text-lg mb-16 max-w-xl opacity-0">
                    Have a project in mind or just want to chat? I'm always open to
                    discussing new opportunities and ideas.
                </p>

                {/* Contact Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-8 contact-reveal opacity-0"
                    >
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
                                className="w-full bg-transparent border-b border-border py-5 text-primary text-lg font-sans placeholder:text-muted/20 focus:border-accent focus:outline-none transition-colors duration-300"
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
                                className="w-full bg-transparent border-b border-border py-5 text-primary text-lg font-sans placeholder:text-muted/20 focus:border-accent focus:outline-none transition-colors duration-300"
                                placeholder="your@email.com"
                                required
                            />
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
                                className="w-full bg-transparent border-b border-border py-5 text-primary text-lg font-sans placeholder:text-muted/20 focus:border-accent focus:outline-none transition-colors duration-300 resize-none"
                                placeholder="Tell me about your project..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="group relative mt-8 px-12 py-6 rounded-2xl bg-accent/10 border border-accent/30 text-accent font-mono text-sm overflow-hidden transition-all duration-300 hover:bg-accent/20 hover:glow-accent-sm cursor-pointer"
                            data-cursor="magnetic"
                        >
                            <span className="relative z-10">Send Message →</span>
                            <div className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </button>
                    </form>

                    {/* Direct Links */}
                    <div className="flex flex-col justify-center gap-10 contact-reveal opacity-0">
                        <div>
                            <span className="font-mono text-xs text-muted uppercase tracking-wider block mb-3">
                                Email
                            </span>
                            <a
                                href="mailto:sebaxsolanom@gmail.com"
                                className="magnetic font-display text-xl md:text-2xl font-semibold hover:text-accent transition-colors duration-300 cursor-pointer"
                                data-cursor="magnetic"
                            >
                                sebaxsolanom@gmail.com
                            </a>
                        </div>

                        <div>
                            <span className="font-mono text-xs text-muted uppercase tracking-wider block mb-3">
                                Phone
                            </span>
                            <a
                                href="tel:+573137874304"
                                className="magnetic font-display text-xl md:text-2xl font-semibold hover:text-accent transition-colors duration-300 cursor-pointer"
                                data-cursor="magnetic"
                            >
                                +57 313 787 4304
                            </a>
                        </div>

                        <div>
                            <span className="font-mono text-xs text-muted uppercase tracking-wider block mb-3">
                                Location
                            </span>
                            <p className="font-display text-xl md:text-2xl font-semibold text-muted">
                                Montería, Colombia
                            </p>
                        </div>

                        {/* Achievements */}
                        <div className="glass rounded-2xl p-6">
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
        </section>
    );
}
