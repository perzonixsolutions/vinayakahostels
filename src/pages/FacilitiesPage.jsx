import { motion as Motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

export default function FacilitiesPage() {

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Our Facilities"
                description="Explore the premium facilities at Vinayaka Boys Hostel including reliable WiFi, housekeeping, secure entry systems, and common areas."
                keywords="Boys PG facilities Kuragallu, Hostel amenities Neerukonda, Wi-Fi PG near SRM AP, Housekeeping boys hostel, Secure student housing, Best PG facilities Mangalagiri"
                canonicalUrl="https://vinayakapghostels.in/facilities"
            />
            <Header />

            {/* Hero Section */}
            <section className="w-full max-w-[100rem] mx-auto px-8 md:px-20 py-20">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-6 max-w-4xl mx-auto"
                >
                    <h1 className="font-heading text-5xl md:text-6xl text-foreground">
                        Our Facilities
                    </h1>
                    <p className="font-paragraph text-lg md:text-xl text-foreground/80 leading-relaxed">
                        We provide modern amenities and facilities to ensure your comfort and convenience.
                        Everything you need for a productive and enjoyable stay.
                    </p>
                </Motion.div>
            </section>

            {/* Coming Soon Section */}
            <section className="w-full py-20">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20 text-center">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white p-12 rounded-lg border border-muted-grey shadow-sm max-w-3xl mx-auto"
                    >
                        <h2 className="font-heading text-4xl text-foreground mb-4">
                            Facilities Information Coming Soon
                        </h2>
                        <p className="font-paragraph text-lg text-foreground/70">
                            We are currently gathering up-to-date photos and details about our amenities. Check back shortly!
                        </p>
                    </Motion.div>
                </div>
            </section>



            <Footer />
        </div>
    );
}
