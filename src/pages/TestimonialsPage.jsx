import { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { format } from 'date-fns';
import SEO from '@/components/SEO';

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        try {
            const result = await BaseCrudService.getAll('testimonials');
            setTestimonials(result.items);
        } catch (error) {
            console.error('Failed to load testimonials:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const ratingValue = rating || 0;
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`w-5 h-5 ${i <= ratingValue ? 'fill-accent-gold text-accent-gold' : 'text-muted-grey'
                        }`}
                />
            );
        }
        return stars;
    };

    const averageRating = testimonials.length > 0
        ? (testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length).toFixed(1)
        : '0.0';

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Testimonials"
                description="Read reviews and experiences from students about their stay at Vinayaka Boys Hostel near SRM AP."
                keywords="Vinayaka Boys PG reviews, Student testimonials Kuragallu, Boys Hostel feedback Neerukonda, Best boys PG reviews Mangalagiri"
                canonicalUrl="https://vinayakapghostels.in/testimonials"
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
                        What Our Residents Say
                    </h1>
                    <p className="font-paragraph text-lg md:text-xl text-foreground/80 leading-relaxed">
                        Real experiences from students and parents who have chosen Serenity Hostel as their home away from home.
                    </p>
                </Motion.div>
            </section>

            {/* Rating Summary */}
            {testimonials.length > 0 && (
                <section className="w-full py-16 bg-secondary/10">
                    <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                        <Motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center space-y-6"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <span className="font-heading text-6xl text-primary">{averageRating}</span>
                                <div className="flex flex-col items-start">
                                    <div className="flex gap-1">
                                        {renderStars(Math.round(parseFloat(averageRating)))}
                                    </div>
                                    <span className="font-paragraph text-sm text-foreground/60 mt-1">
                                        Based on {testimonials.length} {testimonials.length === 1 ? 'review' : 'reviews'}
                                    </span>
                                </div>
                            </div>
                        </Motion.div>
                    </div>
                </section>
            )}

            {/* Testimonials Grid */}
            <section className="w-full py-20">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <div className="min-h-[500px]">
                        {isLoading ? null : testimonials.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {testimonials.map((testimonial, index) => (
                                    <Motion.div
                                        key={testimonial._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="bg-white p-8 rounded-lg border border-muted-grey hover:shadow-lg transition-shadow duration-300 flex flex-col"
                                    >
                                        <div className="flex gap-1 mb-4">
                                            {renderStars(testimonial.rating)}
                                        </div>

                                        {testimonial.reviewText && (
                                            <p className="font-paragraph text-base text-foreground/80 leading-relaxed mb-6 flex-1 italic">
                                                "{testimonial.reviewText}"
                                            </p>
                                        )}

                                        <div className="flex items-center gap-4 pt-6 border-t border-muted-grey">
                                            {testimonial.reviewerImage ? (
                                                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={testimonial.reviewerImage}
                                                        alt={testimonial.reviewerName || 'Reviewer'}
                                                        className="w-full h-full object-cover"
                                                        width={56}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-14 h-14 bg-secondary/30 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="font-heading text-2xl text-primary">
                                                        {testimonial.reviewerName?.charAt(0) || 'R'}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-paragraph font-medium text-foreground">
                                                    {testimonial.reviewerName || 'Anonymous'}
                                                </p>
                                                {testimonial.reviewerRole && (
                                                    <p className="font-paragraph text-sm text-foreground/60">
                                                        {testimonial.reviewerRole}
                                                    </p>
                                                )}
                                                {testimonial.reviewDate && (
                                                    <p className="font-paragraph text-xs text-foreground/50 mt-1">
                                                        {typeof testimonial.reviewDate === 'string'
                                                            ? testimonial.reviewDate
                                                            : format(new Date(testimonial.reviewDate), 'MMMM yyyy')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="font-paragraph text-lg text-foreground/60">
                                    Testimonials coming soon
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full py-20 bg-primary">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-6"
                    >
                        <h2 className="font-heading text-3xl md:text-4xl text-primary-foreground">
                            Ready to Join Our Community?
                        </h2>
                        <p className="font-paragraph text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                            Experience the same quality and care that our residents rave about.
                            Book a visit today and see for yourself.
                        </p>
                        <a href="/contact">
                            <button className="bg-white text-primary hover:bg-white/90 px-8 py-4 rounded font-paragraph font-medium text-lg transition-colors duration-200">
                                Book a Visit
                            </button>
                        </a>
                    </Motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
