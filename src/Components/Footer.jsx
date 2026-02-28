import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
    const quickLinks = [
        { path: '/about', label: 'About Us' },
        { path: '/rooms', label: 'Rooms & Pricing' },
        { path: '/facilities', label: 'Facilities' },
        { path: '/dining', label: 'Food & Dining' },
        { path: '/availability', label: 'Availability' },
        { path: '/gallery', label: 'Gallery' }
    ];

    const resources = [
        { path: '/faqs', label: 'FAQs' },
        { path: '/rules', label: 'Rules & Policies' },
        { path: '/testimonials', label: 'Testimonials' },
        { path: '/location', label: 'Location' },
        { path: '/contact', label: 'Contact Us' }
    ];

    return (
        <footer className="w-full bg-foreground text-white">
            <div className="max-w-[100rem] mx-auto px-8 md:px-20 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* About Section */}
                    <div className="space-y-6">
                        <h3 className="font-heading text-3xl text-white">
                            Vinayaka Hostels
                        </h3>
                        <p className="font-paragraph text-base text-white/80 leading-relaxed">
                            Your trusted home away from home. We provide a safe, clean, and comfortable living environment for students.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-200"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-200"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-200"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="font-heading text-xl text-white">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="font-paragraph text-base text-white/80 hover:text-primary transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="space-y-6">
                        <h4 className="font-heading text-xl text-white">
                            Resources
                        </h4>
                        <ul className="space-y-3">
                            {resources.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="font-paragraph text-base text-white/80 hover:text-primary transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h4 className="font-heading text-xl text-white">
                            Contact Us
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                                <span className="font-paragraph text-base text-white/80">
                                    Kuragallu, Mangalagiri, Andhra Pradesh
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                                <a
                                    href="tel:+918886148989"
                                    className="font-paragraph text-base text-white/80 hover:text-primary transition-colors duration-200"
                                >
                                    +91 88861 48989
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                                <a
                                    href="mailto:vinayakapghostels@gmail.com"
                                    className="font-paragraph text-base text-white/80 hover:text-primary transition-colors duration-200"
                                >
                                    vinayakapghostels@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="font-paragraph text-sm text-white/60 text-center md:text-left">
                            © {new Date().getFullYear()} Vinayaka Hostels. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link
                                to="/privacy"
                                className="font-paragraph text-sm text-white/60 hover:text-primary transition-colors duration-200"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                to="/terms"
                                className="font-paragraph text-sm text-white/60 hover:text-primary transition-colors duration-200"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>

                    {/* Developer Credit */}
                    <div className="font-paragraph text-sm text-white/40 text-center mt-2 flex items-center justify-center gap-1">
                        Made with <span className="text-red-500">♥</span> by <a href="https://perzonix.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Perzonix Solutions Pvt. Ltd.</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
