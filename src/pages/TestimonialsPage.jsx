import { motion as Motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const TESTIMONIALS = [
    { _id: '1', rating: 5, reviewText: 'Amazing hostel! The facilities are top-notch and the staff is very friendly. Best place for students.', reviewerName: 'Rahul Verma', reviewerRole: 'Medical Student', reviewDate: 'October 2023' },
    { _id: '2', rating: 4, reviewText: 'Great food and comfortable rooms. Highly recommended for anyone looking for a home away from home.', reviewerName: 'Priya Reddy', reviewerRole: 'Engineering Student', reviewDate: 'November 2023' },
    { _id: '3', rating: 5, reviewText: 'Security is excellent, giving my parents peace of mind. The warden is very supportive.', reviewerName: 'Karthik Raju', reviewerRole: 'CA Student', reviewDate: 'January 2024' },
    { _id: '4', rating: 5, reviewText: 'The food menu is diverse and tasty. I never felt the need to eat out. Great value for money.', reviewerName: 'Anusha Rao', reviewerRole: 'MBA Student', reviewDate: 'February 2024' },
    { _id: '5', rating: 4, reviewText: 'Cleanliness is maintained properly. Housekeeping staff is regular and efficient.', reviewerName: 'Sandeep Kumar', reviewerRole: 'Student', reviewDate: 'December 2023' },
];

export default function TestimonialsPage() {
    const averageRating = (TESTIMONIALS.reduce((sum, t) => sum + (t.rating || 0), 0) / TESTIMONIALS.length).toFixed(1);

    const renderStars = (rating) => {
        const stars = [];
        const ratingValue = rating || 0;
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`w-5 h-5 ${i <= ratingValue ? 'fill-accent-gold text-accent-gold' : 'text-muted-grey'}`}
                />
            );
        }
        return stars;
    };

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
                        Real experiences from students who have chosen Vinayaka Hostels as their home away from home.
                    </p>
                </Motion.div>
            </section>

            {/* Rating Summary */}
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
                                    Based on {TESTIMONIALS.length} reviews
                                </span>
                            </div>
                        </div>
                    </Motion.div>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="w-full py-20">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((testimonial, index) => (
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
                                        &ldquo;{testimonial.reviewText}&rdquo;
                                    </p>
                                )}

                                <div className="flex items-center gap-4 pt-6 border-t border-muted-grey">
                                    <div className="w-14 h-14 bg-secondary/30 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="font-heading text-2xl text-primary">
                                            {testimonial.reviewerName?.charAt(0) || 'R'}
                                        </span>
                                    </div>
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
                                                {testimonial.reviewDate}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Motion.div>
                        ))}
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
