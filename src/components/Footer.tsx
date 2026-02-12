/**
 * Footer — Minimal footer with copyright, accent divider, and social links.
 */
export default function Footer() {
    return (
        <footer className="relative section-padding">
            {/* Divider */}
            <div className="section-divider mb-12" />

            <div className="max-w-7xl mx-auto py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="font-mono text-xs text-muted/40">
                    © {new Date().getFullYear()} Sebastian Solano. Crafted with
                    precision.
                </p>

                <div className="flex items-center gap-8">
                    <a
                        href="mailto:sebaxsolanom@gmail.com"
                        className="font-mono text-xs text-muted/40 hover:text-accent transition-colors duration-300 cursor-pointer"
                        data-cursor="magnetic"
                    >
                        Email
                    </a>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-muted/40 hover:text-accent transition-colors duration-300 cursor-pointer"
                        data-cursor="magnetic"
                    >
                        GitHub
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-muted/40 hover:text-accent transition-colors duration-300 cursor-pointer"
                        data-cursor="magnetic"
                    >
                        LinkedIn
                    </a>
                </div>
            </div>
        </footer>
    );
}
