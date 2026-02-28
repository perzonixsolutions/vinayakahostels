import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About' },
        { path: '/rooms', label: 'Rooms ' },
        { path: '/facilities', label: 'Facilities' },
        { path: '/dining', label: 'Food' },
        { path: '/location', label: 'Location' },
        { path: '/availability', label: 'Availability' },
        { path: '/gallery', label: 'Gallery' },
        { path: '/faqs', label: 'FAQs' },
        { path: '/contact', label: 'Contact' }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header className="w-full bg-white border-b border-muted-grey sticky top-0 z-50">
            <div className="max-w-[100rem] mx-auto px-8 md:px-20 py-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <h1 className="font-heading text-3xl md:text-4xl text-primary">
                            Vinayaka PG Hostels
                        </h1>
                    </Link>

                    {/* Desktop Navigation & CTA */}
                    <div className="hidden xl:flex items-center gap-6 2xl:gap-8">
                        <nav className="flex items-center gap-6 2xl:gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`font-paragraph text-base transition-colors duration-200 ${isActive(link.path)
                                        ? 'text-primary font-medium'
                                        : 'text-foreground/70 hover:text-primary'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <Link to="/contact">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 font-paragraph font-medium">
                                Book a Visit
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="xl:hidden p-2 text-foreground hover:text-primary transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="xl:hidden mt-6 pb-4 space-y-4 border-t border-muted-grey pt-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block font-paragraph text-base py-2 transition-colors duration-200 ${isActive(link.path)
                                    ? 'text-primary font-medium'
                                    : 'text-foreground/70 hover:text-primary'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 font-paragraph font-medium mt-4">
                                Book a Visit
                            </Button>
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}
