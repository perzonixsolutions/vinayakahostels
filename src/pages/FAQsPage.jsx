import { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import SEO from '@/components/SEO';

export default function FAQsPage() {
    const [faqs, setFaqs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        loadFAQs();
    }, []);

    const loadFAQs = async () => {
        try {
            const result = await BaseCrudService.getAll('faqs');
            setFaqs(result.items);
        } catch (error) {
            console.error('Failed to load FAQs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category).filter(Boolean)))];

    const filteredFAQs = selectedCategory === 'All'
        ? faqs
        : faqs.filter(faq => faq.category === selectedCategory);

    const featuredFAQs = faqs.filter(faq => faq.isFeatured);

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="FAQs"
                description="Find answers to frequently asked questions about Vinayaka Boys Hostel, including our facilities, booking process, rules, and policies for students."
                keywords="Vinayaka Boys PG FAQs, Hostel queries Kuragallu, Boys PG booking Neerukonda, Student accommodation FAQs Mangalagiri, Boys Hostel rules questions"
                canonicalUrl="https://vinayakapghostels.in/faqs"
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
                        Frequently Asked Questions
                    </h1>
                    <p className="font-paragraph text-lg md:text-xl text-foreground/80 leading-relaxed">
                        Find answers to common questions about our hostel, facilities, booking process, and policies.
                    </p>
                </Motion.div>
            </section>

            {/* Featured FAQs */}
            {featuredFAQs.length > 0 && (
                <section className="w-full py-16 bg-secondary/10">
                    <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                        <Motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
                                Most Asked Questions
                            </h2>
                        </Motion.div>

                        <Motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="max-w-4xl mx-auto"
                        >
                            <Accordion type="single" collapsible className="space-y-4">
                                {featuredFAQs.map((faq, index) => (
                                    <AccordionItem
                                        key={faq._id}
                                        value={`featured-${index}`}
                                        className="bg-white border border-muted-grey rounded-lg px-6"
                                    >
                                        <AccordionTrigger className="font-heading text-lg text-foreground hover:text-primary text-left">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="font-paragraph text-base text-foreground/80 leading-relaxed pt-2">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </Motion.div>
                    </div>
                </section>
            )}

            {/* Category Filter */}
            {categories.length > 1 && (
                <section className="w-full py-8">
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

            {/* All FAQs */}
            <section className="w-full py-16">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
                            {selectedCategory === 'All' ? 'All Questions' : selectedCategory}
                        </h2>
                    </Motion.div>

                    <div className="min-h-[400px]">
                        {isLoading ? null : filteredFAQs.length > 0 ? (
                            <Motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="max-w-4xl mx-auto"
                            >
                                <Accordion type="single" collapsible className="space-y-4">
                                    {filteredFAQs.map((faq, index) => (
                                        <AccordionItem
                                            key={faq._id}
                                            value={`faq-${index}`}
                                            className="bg-white border border-muted-grey rounded-lg px-6"
                                        >
                                            <AccordionTrigger className="font-heading text-lg text-foreground hover:text-primary text-left">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="font-paragraph text-base text-foreground/80 leading-relaxed pt-2">
                                                {faq.answer}
                                                {faq.category && (
                                                    <span className="inline-block px-3 py-1 bg-secondary/20 text-primary text-xs font-paragraph font-medium rounded-full mt-4">
                                                        {faq.category}
                                                    </span>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </Motion.div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="font-paragraph text-lg text-foreground/60">
                                    {selectedCategory === 'All'
                                        ? 'FAQ information coming soon'
                                        : `No questions found in ${selectedCategory} category`}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Still Have Questions */}
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
                            Still Have Questions?
                        </h2>
                        <p className="font-paragraph text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                            Can't find the answer you're looking for? Our team is here to help.
                            Contact us and we'll get back to you as soon as possible.
                        </p>
                        <a href="/contact">
                            <button className="bg-white text-primary hover:bg-white/90 px-8 py-4 rounded font-paragraph font-medium text-lg transition-colors duration-200">
                                Contact Us
                            </button>
                        </a>
                    </Motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
