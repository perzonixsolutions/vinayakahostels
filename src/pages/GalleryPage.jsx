import { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import axios from 'axios';
import SEO from '@/components/SEO';

const API_URL = import.meta.env.VITE_API_URL;

export default function GalleryPage() {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        loadGallery();
    }, []);

    const loadGallery = async () => {
        try {
            const response = await axios.get(`${API_URL}/gallery`);
            if (Array.isArray(response.data)) {
                setImages(response.data);
            } else {
                console.error('Failed to load gallery: Invalid response format');
                setImages([]);
            }
        } catch (error) {
            console.error('Failed to load gallery:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const categories = ['All', ...Array.from(new Set(images.map(img => img.category).filter(Boolean)))];

    const filteredImages = selectedCategory === 'All'
        ? images
        : images.filter(img => img.category === selectedCategory);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        const baseUrl = API_URL.replace(/\/api$/, '');
        return `${baseUrl}${imagePath}`;
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Photo Gallery"
                description="Take a visual tour of Vinayaka Boys Hostel. View our well-furnished rooms, hygienic dining areas, and modern facilities near SRM AP."
                keywords="Vinayaka Boys PG photos Kuragallu, Boys Hostel rooms gallery, PG images Neerukonda, Student accommodation photos Mangalagiri, Boys Hostel facilities gallery"
                canonicalUrl="https://vinayakapghostels.in/gallery"
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
                        Gallery
                    </h1>
                    <p className="font-paragraph text-lg md:text-xl text-foreground/80 leading-relaxed">
                        Take a visual tour of our hostel. See our clean rooms, modern facilities, and comfortable common areas.
                    </p>
                </Motion.div>
            </section>

            {/* Category Filter */}
            {categories.length > 1 && (
                <section className="w-full py-8 bg-secondary/10">
                    <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                        <Motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-wrap justify-center gap-4"
                        >
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-6 py-3 rounded-lg font-paragraph text-base font-medium transition-all duration-200 ${selectedCategory === category
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-white text-foreground border border-muted-grey hover:border-primary'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </Motion.div>
                    </div>
                </section>
            )}

            {/* Gallery Grid */}
            <section className="w-full py-16">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <div className="min-h-[600px]">
                        {isLoading ? null : filteredImages.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredImages.map((item, index) => (
                                    <Motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.05 }}
                                        className="group relative bg-white rounded-lg overflow-hidden border border-muted-grey hover:shadow-xl transition-shadow duration-300"
                                    >
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <Image
                                                src={getImageUrl(item.image) || 'https://static.wixstatic.com/media/0e16eb_e8bff4d4c7a44b0ea7804005804c8810~mv2.png?originWidth=576&originHeight=448'}
                                                alt={item.title || 'Gallery image'}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                width={600}
                                            />
                                        </div>
                                        {(item.title || item.description) && (
                                            <div className="p-6 space-y-2">
                                                {item.title && (
                                                    <h3 className="font-heading text-xl text-foreground">
                                                        {item.title}
                                                    </h3>
                                                )}
                                                {item.description && (
                                                    <p className="font-paragraph text-sm text-foreground/70 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                )}
                                                {item.category && (
                                                    <span className="inline-block px-3 py-1 bg-secondary/20 text-primary text-xs font-paragraph font-medium rounded-full mt-2">
                                                        {item.category}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </Motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="font-paragraph text-lg text-foreground/60">
                                    {selectedCategory === 'All'
                                        ? 'Gallery images coming soon'
                                        : `No images found in ${selectedCategory} category`}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
