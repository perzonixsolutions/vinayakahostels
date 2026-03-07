import { motion as Motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const LANDMARKS = [
    { _id: '1a', landmarkType: 'Education', landmarkName: 'SRM University', distanceFromHostel: '2km', description: 'Main road to SRM University', address: 'University Road', googleMapsUrl: 'https://maps.app.goo.gl/VbrCezxc4pQ34zWr9' },
    { _id: '1b', landmarkType: 'Education', landmarkName: 'Amrita University', distanceFromHostel: '2km', description: 'Main road to Amrita University', address: 'University Road', googleMapsUrl: 'https://maps.app.goo.gl/pAimnTtZEAkToqWMA' },
    { _id: '1c', landmarkType: 'Education', landmarkName: 'VIT University', distanceFromHostel: '5km', description: 'Main road to VIT University', address: 'University Road', googleMapsUrl: 'https://maps.app.goo.gl/GmLz7sc5gNxmaWzCA' },
    { _id: '2', landmarkType: 'Transport', landmarkName: 'Auto/Taxi Stand', distanceFromHostel: '50m', description: 'Connects to all parts of the city.', address: '2km from SRM University Main Gate', googleMapsUrl: 'https://maps.app.goo.gl/QvdYmWJWJqv7z3tMA' },
];

export default function LocationPage() {
    const groupedLandmarks = LANDMARKS.reduce((acc, landmark) => {
        const type = landmark.landmarkType || 'Other';
        if (!acc[type]) acc[type] = [];
        acc[type].push(landmark);
        return acc;
    }, {});


    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Location & Neighborhood"
                description="Find Vinayaka Boys Hostel on the map. Strategically located in Kuragallu near SRM AP, Amrita AP, and VIT AP with easy access to transport."
                keywords="Boys PG near SRM AP, Hostel in Kuragallu, PG near Amrita AP, Boys Student accommodation Neerukonda, Vinayaka Boys PG Mangalagiri"
                canonicalUrl="https://vinayakapghostels.in/location"
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
                        Location & Nearby Places
                    </h1>
                    <p className="font-paragraph text-lg md:text-xl text-foreground/80 leading-relaxed">
                        Strategically located with easy access to educational institutions, hospitals, shopping centers, and public transportation.
                    </p>
                </Motion.div>
            </section>

            {/* Address Section */}
            <section className="w-full py-16 bg-secondary/10">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <Motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <h2 className="font-heading text-4xl text-foreground">
                                Our Address
                            </h2>
                            <div className="flex items-start gap-4">
                                <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div className="space-y-2">
                                    <p className="font-paragraph text-lg text-foreground">
                                        Vinayaka Hostels
                                    </p>
                                    <p className="font-paragraph text-base text-foreground/80 leading-relaxed">
                                        Kuragallu Road<br />
                                        Guntur<br />
                                        Andhra Pradesh - 522002<br />
                                        India
                                    </p>
                                </div>
                            </div>
                            <div className="pt-4">
                                <a
                                    href="https://maps.app.goo.gl/QvdYmWJWJqv7z3tMA"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph font-medium">
                                        <Navigation className="w-4 h-4 mr-2" />
                                        Get Directions
                                    </Button>
                                </a>
                            </div>
                        </Motion.div>

                        <Motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl"
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.664414371989!2d80.52235237514336!3d16.451731484286127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f385932ceedb%3A0x4f50e9b62be74f6c!2sSri%20Vinayaka%20Boys%20Hostel%20%26%20PG!5e0!3m2!1sen!2sin!4v1716912345678!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Hostel Location"
                            ></iframe>
                        </Motion.div>
                    </div>
                </div>
            </section>

            {/* Nearby Landmarks */}
            <section className="w-full py-20">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
                            Nearby Landmarks
                        </h2>
                        <p className="font-paragraph text-lg text-foreground/70 max-w-3xl mx-auto">
                            Everything you need is within easy reach
                        </p>
                    </Motion.div>

                    <div className="min-h-[400px]">
                        {Object.keys(groupedLandmarks).length > 0 ? (
                            <div className="space-y-16">
                                {Object.keys(groupedLandmarks).map((type) => (
                                    <Motion.div
                                        key={type}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <h3 className="font-heading text-3xl text-foreground mb-8 pb-4 border-b-2 border-primary">
                                            {type}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {groupedLandmarks[type].map((landmark, index) => (
                                                <Motion.div
                                                    key={landmark._id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                                    className="bg-white rounded-lg overflow-hidden border border-muted-grey hover:shadow-lg transition-shadow duration-300"
                                                >
                                                    {landmark.landmarkImage && (
                                                        <div className="aspect-[4/3] overflow-hidden">
                                                            <Image
                                                                src={landmark.landmarkImage}
                                                                alt={landmark.landmarkName || 'Landmark'}
                                                                className="w-full h-full object-cover"
                                                                width={400}
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="p-6 space-y-3">
                                                        <h4 className="font-heading text-xl text-foreground">
                                                            {landmark.landmarkName}
                                                        </h4>
                                                        {landmark.distanceFromHostel !== undefined && (
                                                            <p className="font-paragraph text-sm text-primary font-medium">
                                                                {landmark.distanceFromHostel} {typeof landmark.distanceFromHostel === 'number' ? 'km away' : ''}
                                                            </p>
                                                        )}
                                                        {landmark.description && (
                                                            <p className="font-paragraph text-sm text-foreground/70 leading-relaxed">
                                                                {landmark.description}
                                                            </p>
                                                        )}
                                                        {landmark.address && (
                                                            <p className="font-paragraph text-xs text-foreground/60">
                                                                {landmark.address}
                                                            </p>
                                                        )}
                                                        {landmark.googleMapsUrl && (
                                                            <a
                                                                href={landmark.googleMapsUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-block pt-2"
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="border-primary text-primary hover:bg-primary/5 font-paragraph text-xs"
                                                                >
                                                                    <Navigation className="w-3 h-3 mr-1" />
                                                                    Directions
                                                                </Button>
                                                            </a>
                                                        )}
                                                    </div>
                                                </Motion.div>
                                            ))}
                                        </div>
                                    </Motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="font-paragraph text-lg text-foreground/60">
                                    Landmark information coming soon
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Transportation */}
            <section className="w-full py-20 bg-secondary/10">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="font-heading text-4xl text-foreground mb-4">
                            Transportation Access
                        </h2>
                        <p className="font-paragraph text-lg text-foreground/70 max-w-3xl mx-auto">
                            Well-connected with multiple transportation options
                        </p>
                    </Motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Mangalagiri Bus Stop',
                                description: 'Multiple bus routes available within 200 meters'
                            },
                            {
                                title: 'Vijayawada Railway Station',
                                description: 'Nearest railway station is 25 km away'
                            },
                            {
                                title: 'Auto/Taxi Stand',
                                description: 'Easy availability of autos and taxis nearby'
                            }
                        ].map((transport, index) => (
                            <Motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white p-8 rounded-lg border border-muted-grey text-center"
                            >
                                <h3 className="font-heading text-2xl text-foreground mb-3">
                                    {transport.title}
                                </h3>
                                <p className="font-paragraph text-base text-foreground/70 leading-relaxed">
                                    {transport.description}
                                </p>
                            </Motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
