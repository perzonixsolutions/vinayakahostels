import { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, IndianRupee } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import Carousel from '@/components/ui/carousel-custom';

export default function RoomsPage() {
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
            
            const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');

            const mappedRooms = data.map(room => ({
                _id: room.id,
                roomName: room.name || `Room ${room.room_number}`,
                availabilityStatus: room.current_occupancy >= room.capacity ? 'Full' : 'Available',
                description: room.description,
                capacity: room.capacity,
                amenities: room.amenities,
                pricePerMonth: room.price_monthly,
                pricePerSemester: room.price_semester,
                roomPhotos: room.images ? room.images.map(img => 
                    img.startsWith('http') ? img : `${baseUrl}${img}`
                ) : [],
            }));
            setRooms(mappedRooms);
        } catch (error) {
            console.error('Failed to load rooms:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'available':
                return 'text-green-600 bg-green-50';
            case 'limited':
                return 'text-yellow-600 bg-yellow-50';
            case 'full':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-foreground/60 bg-muted-grey/30';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Rooms & Pricing"
                description="Explore comfortable, secure, and affordable boys student rooms at Vinayaka Hostels near Kuragallu and SRM AP. Check our pricing and included amenities."
                keywords="Boys PG rooms Kuragallu, Single room PG near SRM AP, Shared boys hostel Neerukonda, Affordable student housing Mangalagiri, Boys PG near VIT AP"
                canonicalUrl="https://vinayakapghostels.in/rooms"
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
                        Rooms & Pricing
                    </h1>
                    <p className="font-paragraph text-lg md:text-xl text-foreground/80 leading-relaxed">
                        Choose from our range of comfortable rooms designed to suit your needs and budget.
                        All rooms come with essential amenities and access to common facilities.
                    </p>
                </Motion.div>
            </section>

            {/* Rooms Grid */}
            <section className="w-full py-16">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <div className="min-h-[600px]">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <LoadingSpinner />
                            </div>
                        ) : rooms.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {rooms.map((room, index) => (
                                    <Motion.div
                                        key={room._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="bg-white rounded-lg overflow-hidden border border-muted-grey hover:shadow-xl transition-shadow duration-300 flex flex-col"
                                    >
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <Carousel 
                                                images={room.roomPhotos} 
                                                autoPlay={true}
                                                interval={5000}
                                                className="w-full h-full"
                                            />
                                        </div>

                                        <div className="p-6 space-y-4 flex-grow flex flex-col">
                                            <div className="flex items-start justify-between gap-4">
                                                <h3 className="font-heading text-2xl text-foreground">
                                                    {room.roomName}
                                                </h3>
                                                {room.availabilityStatus && (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-paragraph font-medium flex-shrink-0 ${getStatusColor(room.availabilityStatus)}`}>
                                                        {room.availabilityStatus}
                                                    </span>
                                                )}
                                            </div>

                                            {room.description && (
                                                <p className="font-paragraph text-base text-foreground/70 leading-relaxed line-clamp-2">
                                                    {room.description}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-2 text-foreground/60">
                                                <Users className="w-5 h-5" />
                                                <span className="font-paragraph text-sm">
                                                    Capacity: {room.capacity || 'N/A'} {room.capacity === 1 ? 'person' : 'people'}
                                                </span>
                                            </div>

                                            {room.amenities && (
                                                <div className="pt-4 border-t border-muted-grey">
                                                    <p className="font-paragraph text-xs text-foreground/60 mb-2 uppercase tracking-wider">Amenities:</p>
                                                    <p className="font-paragraph text-sm text-foreground/80 line-clamp-1">
                                                        {room.amenities}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="mt-auto pt-4 border-t border-muted-grey space-y-2">
                                                {room.pricePerMonth && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-paragraph text-sm text-foreground/60">Per Month:</span>
                                                        <div className="flex items-center gap-1">
                                                            <IndianRupee className="w-4 h-4 text-primary" />
                                                            <span className="font-paragraph text-xl font-semibold text-primary">
                                                                {room.pricePerMonth.toLocaleString('en-IN')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                                <Link to={`/rooms/${room._id}`} className="block pt-2">
                                                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph font-medium">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="font-paragraph text-lg text-foreground/60">
                                    Room information coming soon
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Pricing Info */}
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
                            What's Included
                        </h2>
                        <p className="font-paragraph text-lg text-foreground/70 max-w-3xl mx-auto">
                            All our room prices include the following amenities and services
                        </p>
                    </Motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            'High-speed WiFi',
                            'Daily housekeeping',
                            'Electricity & water',
                            'Common area access',
                            '24/7 security',
                            'Laundry facilities',
                            'Study room access',
                            'Maintenance support'
                        ].map((item, index) => (
                            <Motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="bg-white p-6 rounded-lg border border-muted-grey text-center"
                            >
                                <p className="font-paragraph text-base text-foreground">
                                    {item}
                                </p>
                            </Motion.div>
                        ))}
                    </div>

                    <Motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center mt-12"
                    >
                        <Link to="/contact">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-paragraph font-medium">
                                Book a Visit
                            </Button>
                        </Link>
                    </Motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
}
