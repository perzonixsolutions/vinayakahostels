import { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import SEO from '@/components/SEO';

export default function FacilitiesPage() {
    const [facilities, setFacilities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadFacilities();
    }, []);

    const loadFacilities = async () => {
        try {
            const result = await BaseCrudService.getAll('facilities');
            setFacilities(result.items);
        } catch (error) {
            console.error('Failed to load facilities:', error);
        } finally {
            setIsLoading(false);
        }
    };

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

            {/* Temporarily Hidden Facilities Content */}
            {false && (
                <>
                    {/* Facilities Grid */}
                    <section className="w-full py-16">
                        <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                            <div className="min-h-[600px]">
                                {isLoading ? null : facilities.length > 0 ? (
                                    <div className="space-y-16">
                                        {facilities.map((facility, index) => (
                                            <Motion.div
                                                key={facility._id}
                                                initial={{ opacity: 0, y: 30 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.8 }}
                                                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                                                    }`}
                                            >
                                                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                                                    <h2 className="font-heading text-4xl text-foreground">
                                                        {facility.title}
                                                    </h2>

                                                    {facility.description && (
                                                        <p className="font-paragraph text-lg text-foreground/80 leading-relaxed">
                                                            {facility.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                                                    <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                                                        <Image
                                                            src={facility.facilityImage || 'https://static.wixstatic.com/media/0e16eb_ca0055e0d66e4613b25f45aa377c8e9c~mv2.png?originWidth=768&originHeight=576'}
                                                            alt={facility.title || 'Facility'}
                                                            className="w-full h-full object-cover"
                                                            width={800}
                                                        />
                                                    </div>
                                                </div>
                                            </Motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20">
                                        <p className="font-paragraph text-lg text-foreground/60">
                                            Facilities information coming soon
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Additional Features */}
                    <section className="w-full py-20 bg-secondary/10">
                        <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                            <Motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="text-center mb-16"
                            >
                                <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
                                    What Makes Us Special
                                </h2>
                                <p className="font-paragraph text-lg text-foreground/70 max-w-3xl mx-auto">
                                    Beyond the basics, we offer additional features for your comfort
                                </p>
                            </Motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    {
                                        title: 'Power Backup',
                                        description: 'Uninterrupted power supply with generator backup for essential areas'
                                    },
                                    {
                                        title: 'Water Purification',
                                        description: 'RO purified drinking water available 24/7 on all floors'
                                    },
                                    {
                                        title: 'CCTV Surveillance',
                                        description: 'Complete coverage of common areas and entry points for your safety'
                                    },
                                    {
                                        title: 'Fire Safety',
                                        description: 'Fire extinguishers, smoke detectors, and emergency exits on all floors'
                                    },
                                    {
                                        title: 'Pest Control',
                                        description: 'Regular professional pest control services to maintain hygiene'
                                    }
                                ].map((feature, index) => (
                                    <Motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="bg-white p-8 rounded-lg border border-muted-grey"
                                    >
                                        <h3 className="font-heading text-2xl text-foreground mb-3">
                                            {feature.title}
                                        </h3>
                                        <p className="font-paragraph text-base text-foreground/70 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </Motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            )}

            <Footer />
        </div>
    );
}
