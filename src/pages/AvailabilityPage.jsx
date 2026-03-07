import { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

export default function AvailabilityPage() {
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const API_URL = `${import.meta.env.VITE_API_URL}/hostels/public`;

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch rooms');
            const data = await response.json();

            const mappedRooms = data.map(room => {
                const availableBeds = room.capacity - room.current_occupancy;
                let status = 'Available';
                if (availableBeds <= 0) status = 'Full';
                else if (availableBeds <= 2) status = 'Limited';

                return {
                    _id: room.id,
                    roomName: room.name || `Room ${room.room_number}`,
                    availabilityStatus: status,
                    description: room.description,
                    capacity: room.capacity,
                    amenities: room.amenities,
                    pricePerMonth: room.price_monthly,
                    pricePerSemester: room.price_semester,
                };
            });
            setRooms(mappedRooms);
        } catch (error) {
            console.error('Failed to load rooms:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'available':
                return <CheckCircle className="w-8 h-8 text-green-600" />;
            case 'limited':
                return <AlertCircle className="w-8 h-8 text-yellow-600" />;
            case 'full':
                return <XCircle className="w-8 h-8 text-red-600" />;
            default:
                return <AlertCircle className="w-8 h-8 text-foreground/40" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'available':
                return 'bg-green-50 border-green-200';
            case 'limited':
                return 'bg-yellow-50 border-yellow-200';
            case 'full':
                return 'bg-red-50 border-red-200';
            default:
                return 'bg-muted-grey/30 border-muted-grey';
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'available':
                return 'Rooms Available';
            case 'limited':
                return 'Limited Availability';
            case 'full':
                return 'Currently Full';
            default:
                return 'Contact for Details';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Room Availability"
                description="Check real-time availability of boys rooms at Vinayaka Hostel. Secure your comfortable student accommodation near SRM AP today."
                keywords="Boys PG room availability Kuragallu, Boys Hostel beds Neerukonda, Book student room Mangalagiri, Vacant PG rooms near SRM AP"
                canonicalUrl="https://vinayakapghostels.in/availability"
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
                        Room Availability
                    </h1>
                    <p className="font-paragraph text-lg md:text-xl text-foreground/80 leading-relaxed">
                        Check real-time availability of our rooms. We update this information regularly to help you make informed decisions.
                    </p>
                </Motion.div>
            </section>

            {/* Availability Status */}
            <section className="w-full py-16">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <div className="min-h-[500px]">
                        {isLoading ? null : rooms.length > 0 ? (
                            <div className="space-y-6">
                                {rooms.map((room, index) => (
                                    <Motion.div
                                        key={room._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className={`bg-white rounded-lg border-2 p-8 ${getStatusColor(room.availabilityStatus)}`}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-start gap-6">
                                                <div className="flex-shrink-0">
                                                    {getStatusIcon(room.availabilityStatus)}
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="font-heading text-2xl md:text-3xl text-foreground">
                                                        {room.roomName}
                                                    </h3>
                                                    <p className="font-paragraph text-base text-foreground/70">
                                                        {room.description || 'Comfortable accommodation for students'}
                                                    </p>
                                                    <div className="flex flex-wrap gap-4 pt-2">
                                                        <span className="font-paragraph text-sm text-foreground/60">
                                                            Capacity: {room.capacity || 'N/A'} {room.capacity === 1 ? 'person' : 'people'}
                                                        </span>
                                                        {room.pricePerMonth && (
                                                            <span className="font-paragraph text-sm text-foreground/60">
                                                                ₹{room.pricePerMonth.toLocaleString('en-IN')}/month
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-start md:items-end gap-4">
                                                <span className="font-paragraph text-lg font-semibold text-foreground">
                                                    {getStatusText(room.availabilityStatus)}
                                                </span>
                                                <div className="flex gap-3">
                                                    <Link to={`/rooms/${room._id}`}>
                                                        <Button
                                                            variant="outline"
                                                            className="border-primary text-primary hover:bg-primary/5 font-paragraph font-medium"
                                                        >
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                    {room.availabilityStatus?.toLowerCase() !== 'full' && (
                                                        <Link to="/contact">
                                                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph font-medium">
                                                                Book Now
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="font-paragraph text-lg text-foreground/60">
                                    Availability information coming soon
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Legend */}
            <section className="w-full py-16 bg-secondary/10">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="font-heading text-3xl text-foreground mb-4">
                            Availability Status Guide
                        </h2>
                    </Motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <Motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white p-8 rounded-lg border border-muted-grey text-center"
                        >
                            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                            <h3 className="font-heading text-xl text-foreground mb-2">
                                Available
                            </h3>
                            <p className="font-paragraph text-sm text-foreground/70 leading-relaxed">
                                Multiple rooms available. Book your visit today to secure your spot.
                            </p>
                        </Motion.div>

                        <Motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-white p-8 rounded-lg border border-muted-grey text-center"
                        >
                            <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                            <h3 className="font-heading text-xl text-foreground mb-2">
                                Limited
                            </h3>
                            <p className="font-paragraph text-sm text-foreground/70 leading-relaxed">
                                Only a few rooms left. Contact us immediately to avoid missing out.
                            </p>
                        </Motion.div>

                        <Motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white p-8 rounded-lg border border-muted-grey text-center"
                        >
                            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                            <h3 className="font-heading text-xl text-foreground mb-2">
                                Full
                            </h3>
                            <p className="font-paragraph text-sm text-foreground/70 leading-relaxed">
                                Currently no rooms available. Join our waitlist to be notified when rooms open up.
                            </p>
                        </Motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full py-20">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-primary rounded-lg p-12 text-center space-y-6"
                    >
                        <h2 className="font-heading text-3xl md:text-4xl text-primary-foreground">
                            Don't Wait - Rooms Fill Up Fast!
                        </h2>
                        <p className="font-paragraph text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                            Contact us today to book a visit and secure your room. Our team is ready to answer all your questions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/contact">
                                <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-paragraph font-medium">
                                    Contact Us Now
                                </Button>
                            </Link>
                            <Link to="/rooms">
                                <Button
                                    variant="outline"
                                    className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-paragraph font-medium"
                                >
                                    View All Rooms
                                </Button>
                            </Link>
                        </div>
                    </Motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
