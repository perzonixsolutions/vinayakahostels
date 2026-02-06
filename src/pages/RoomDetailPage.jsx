import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Users, IndianRupee, ArrowLeft, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';

export default function RoomDetailPage() {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadRoom = async () => {
            try {
                const data = await BaseCrudService.getById('roomtypes', id);
                setRoom(data);
            } catch (error) {
                console.error('Failed to load room:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            loadRoom();
        }
    }, [id]);

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

    const amenitiesList = room?.amenities?.split(',').map(a => a.trim()).filter(Boolean) || [];

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="w-full max-w-[100rem] mx-auto px-8 md:px-20 py-12">
                <Link to="/rooms">
                    <Button variant="outline" className="mb-8 border-primary text-primary hover:bg-primary/5 font-paragraph">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Rooms
                    </Button>
                </Link>

                <div className="min-h-[600px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <LoadingSpinner />
                        </div>
                    ) : !room ? (
                        <div className="text-center py-20">
                            <h2 className="font-heading text-3xl text-foreground mb-4">Room Not Found</h2>
                            <p className="font-paragraph text-lg text-foreground/60 mb-8">
                                The room you're looking for doesn't exist or has been removed.
                            </p>
                            <Link to="/rooms">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph font-medium">
                                    View All Rooms
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {/* Room Header */}
                            <Motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                            >
                                <div>
                                    <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
                                        {room.roomName}
                                    </h1>
                                    {room.availabilityStatus && (
                                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-paragraph font-medium ${getStatusColor(room.availabilityStatus)}`}>
                                            {room.availabilityStatus}
                                        </span>
                                    )}
                                </div>
                                <div className="text-left md:text-right space-y-2">
                                    {room.pricePerMonth && (
                                        <div className="flex items-center gap-2 md:justify-end">
                                            <IndianRupee className="w-5 h-5 text-primary" />
                                            <span className="font-paragraph text-3xl font-semibold text-primary">
                                                {room.pricePerMonth.toLocaleString('en-IN')}
                                            </span>
                                            <span className="font-paragraph text-lg text-foreground/60">/month</span>
                                        </div>
                                    )}
                                    {room.pricePerSemester && (
                                        <div className="flex items-center gap-2 md:justify-end">
                                            <IndianRupee className="w-4 h-4 text-primary" />
                                            <span className="font-paragraph text-xl font-semibold text-primary">
                                                {room.pricePerSemester.toLocaleString('en-IN')}
                                            </span>
                                            <span className="font-paragraph text-base text-foreground/60">/semester</span>
                                        </div>
                                    )}
                                </div>
                            </Motion.div>

                            {/* Room Image */}
                            <Motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="aspect-[16/9] rounded-lg overflow-hidden shadow-xl"
                            >
                                <Image
                                    src={room.roomPhotos || 'https://static.wixstatic.com/media/0e16eb_f4f7fa4d202a480c88ad50855ab555a3~mv2.png?originWidth=1152&originHeight=640'}
                                    alt={room.roomName || 'Room'}
                                    className="w-full h-full object-cover"
                                    width={1200}
                                />
                            </Motion.div>

                            {/* Room Details */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                <Motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="lg:col-span-2 space-y-8"
                                >
                                    <div>
                                        <h2 className="font-heading text-3xl text-foreground mb-4">
                                            Description
                                        </h2>
                                        <p className="font-paragraph text-lg text-foreground/80 leading-relaxed">
                                            {room.description || 'A comfortable and well-maintained room designed for students.'}
                                        </p>
                                    </div>

                                    {amenitiesList.length > 0 && (
                                        <div>
                                            <h2 className="font-heading text-3xl text-foreground mb-6">
                                                Room Amenities
                                            </h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {amenitiesList.map((amenity, index) => (
                                                    <div key={index} className="flex items-start gap-3">
                                                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                                                        <span className="font-paragraph text-base text-foreground">
                                                            {amenity}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <h2 className="font-heading text-3xl text-foreground mb-6">
                                            Common Facilities Included
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                'High-speed WiFi',
                                                '24/7 Security',
                                                'Daily Housekeeping',
                                                'Laundry Service',
                                                'Study Room',
                                                'Common Kitchen',
                                                'Recreation Area',
                                                'Maintenance Support'
                                            ].map((facility, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                                                    <span className="font-paragraph text-base text-foreground">
                                                        {facility}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Motion.div>

                                <Motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-white p-8 rounded-lg border border-muted-grey space-y-6">
                                        <h3 className="font-heading text-2xl text-foreground">
                                            Room Details
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 pb-4 border-b border-muted-grey">
                                                <Users className="w-5 h-5 text-primary" />
                                                <div>
                                                    <p className="font-paragraph text-sm text-foreground/60">Capacity</p>
                                                    <p className="font-paragraph text-base font-medium text-foreground">
                                                        {room.capacity || 'N/A'} {room.capacity === 1 ? 'person' : 'people'}
                                                    </p>
                                                </div>
                                            </div>

                                            {room.pricePerMonth && (
                                                <div className="pb-4 border-b border-muted-grey">
                                                    <p className="font-paragraph text-sm text-foreground/60 mb-2">Monthly Rent</p>
                                                    <div className="flex items-center gap-1">
                                                        <IndianRupee className="w-5 h-5 text-primary" />
                                                        <p className="font-paragraph text-2xl font-semibold text-primary">
                                                            {room.pricePerMonth.toLocaleString('en-IN')}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {room.pricePerSemester && (
                                                <div className="pb-4 border-b border-muted-grey">
                                                    <p className="font-paragraph text-sm text-foreground/60 mb-2">Semester Rent</p>
                                                    <div className="flex items-center gap-1">
                                                        <IndianRupee className="w-5 h-5 text-primary" />
                                                        <p className="font-paragraph text-2xl font-semibold text-primary">
                                                            {room.pricePerSemester.toLocaleString('en-IN')}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <p className="font-paragraph text-sm text-foreground/60 mb-2">Availability</p>
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-paragraph font-medium ${getStatusColor(room.availabilityStatus)}`}>
                                                    {room.availabilityStatus || 'Contact for details'}
                                                </span>
                                            </div>
                                        </div>

                                        <Link to="/contact">
                                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph font-medium py-6">
                                                Book This Room
                                            </Button>
                                        </Link>
                                    </div>

                                    <div className="bg-secondary/10 p-6 rounded-lg">
                                        <p className="font-paragraph text-sm text-foreground/70 leading-relaxed">
                                            <strong>Note:</strong> All prices are inclusive of basic amenities.
                                            Security deposit and advance payment details will be shared during the booking process.
                                        </p>
                                    </div>
                                </Motion.div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
