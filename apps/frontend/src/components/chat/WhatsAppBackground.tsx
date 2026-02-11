/**
 * WhatsApp-style background pattern component
 * Creates the signature tiled background pattern similar to WhatsApp
 */
const WhatsAppBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Light mode pattern */}
            <div className="absolute inset-0 dark:hidden opacity-[0.06]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="whatsapp-pattern-light" x="0" y="0" width="280" height="280" patternUnits="userSpaceOnUse">
                            {/* Geometric shapes inspired by WhatsApp's pattern */}
                            <circle cx="70" cy="70" r="2" fill="#000000" opacity="0.4" />
                            <circle cx="140" cy="140" r="2" fill="#000000" opacity="0.4" />
                            <circle cx="210" cy="210" r="2" fill="#000000" opacity="0.4" />
                            <path d="M 70 70 L 140 140 L 210 210" stroke="#000000" strokeWidth="0.5" opacity="0.2" fill="none" />
                            <path d="M 210 70 L 140 140 L 70 210" stroke="#000000" strokeWidth="0.5" opacity="0.2" fill="none" />
                        </pattern>
                    </defs>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#whatsapp-pattern-light)" />
                </svg>
            </div>

            {/* Dark mode pattern */}
            <div className="absolute inset-0 hidden dark:block opacity-[0.03]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="whatsapp-pattern-dark" x="0" y="0" width="280" height="280" patternUnits="userSpaceOnUse">
                            {/* Lighter pattern for dark mode */}
                            <circle cx="70" cy="70" r="2" fill="#FFFFFF" opacity="0.3" />
                            <circle cx="140" cy="140" r="2" fill="#FFFFFF" opacity="0.3" />
                            <circle cx="210" cy="210" r="2" fill="#FFFFFF" opacity="0.3" />
                            <path d="M 70 70 L 140 140 L 210 210" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.15" fill="none" />
                            <path d="M 210 70 L 140 140 L 70 210" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.15" fill="none" />
                        </pattern>
                    </defs>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#whatsapp-pattern-dark)" />
                </svg>
            </div>
        </div>
    );
};

export default WhatsAppBackground;
