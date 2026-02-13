import { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        preferredDate: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: '',
                preferredDate: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-background">
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
                        Contact Us
                    </h1>
                    <p className="font-paragraph text-lg md:text-xl text-foreground/80 leading-relaxed">
                        Have questions? Want to schedule a visit? We're here to help.
                        Fill out the form below or reach out to us directly.
                    </p>
                </Motion.div>
            </section>

            {/* Contact Form & Info */}
            <section className="w-full py-16">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Form */}
                        <Motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-2"
                        >
                            <div className="bg-white p-8 md:p-12 rounded-lg border border-muted-grey">
                                <h2 className="font-heading text-3xl text-foreground mb-8">
                                    Send Us a Message
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="font-paragraph text-base text-foreground">
                                                Full Name *
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="font-paragraph"
                                                placeholder="Enter your name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="font-paragraph text-base text-foreground">
                                                Phone Number *
                                            </Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="font-paragraph"
                                                placeholder="Enter your phone"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="font-paragraph text-base text-foreground">
                                            Email Address *
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="font-paragraph"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="preferredDate" className="font-paragraph text-base text-foreground">
                                            Preferred Visit Date (Optional)
                                        </Label>
                                        <Input
                                            id="preferredDate"
                                            name="preferredDate"
                                            type="date"
                                            value={formData.preferredDate}
                                            onChange={handleChange}
                                            className="font-paragraph"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="font-paragraph text-base text-foreground">
                                            Message *
                                        </Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="font-paragraph min-h-[150px]"
                                            placeholder="Tell us about your requirements, questions, or any specific concerns..."
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-paragraph font-medium"
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </Button>

                                    {submitStatus === 'success' && (
                                        <Motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 bg-green-50 border border-green-200 rounded-lg"
                                        >
                                            <p className="font-paragraph text-sm text-green-800">
                                                Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
                                            </p>
                                        </Motion.div>
                                    )}

                                    {submitStatus === 'error' && (
                                        <Motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 bg-red-50 border border-red-200 rounded-lg"
                                        >
                                            <p className="font-paragraph text-sm text-red-800">
                                                Sorry, something went wrong. Please try again or contact us directly.
                                            </p>
                                        </Motion.div>
                                    )}
                                </form>
                            </div>
                        </Motion.div>

                        {/* Contact Info */}
                        <Motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="bg-white p-8 rounded-lg border border-muted-grey space-y-6">
                                <h3 className="font-heading text-2xl text-foreground">
                                    Contact Information
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-paragraph text-sm text-foreground/60 mb-1">Phone</p>
                                            <a
                                                href="tel:+919876543210"
                                                className="font-paragraph text-base text-foreground hover:text-primary transition-colors"
                                            >
                                                +91 98765 43210
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-paragraph text-sm text-foreground/60 mb-1">Email</p>
                                            <a
                                                href="mailto:info@serenityhostel.com"
                                                className="font-paragraph text-base text-foreground hover:text-primary transition-colors"
                                            >
                                                vinayakahostels@gmail.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-paragraph text-sm text-foreground/60 mb-1">Address</p>
                                            <p className="font-paragraph text-base text-foreground">
                                                Kuragallu Road<br />
                                                Mangalagiri, Guntur<br />
                                                Andhra Pradesh - 522002
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-paragraph text-sm text-foreground/60 mb-1">Office Hours</p>
                                            <p className="font-paragraph text-base text-foreground">
                                                Monday - Saturday<br />
                                                9:00 AM - 7:00 PM
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-secondary/10 p-6 rounded-lg">
                                <h4 className="font-heading text-lg text-foreground mb-3">
                                    Visit Us
                                </h4>
                                <p className="font-paragraph text-sm text-foreground/70 leading-relaxed mb-4">
                                    We encourage parents and students to visit our hostel before making a decision.
                                    Schedule a visit to see our facilities firsthand.
                                </p>
                                <p className="font-paragraph text-xs text-foreground/60">
                                    Please call ahead to schedule your visit.
                                </p>
                            </div>
                        </Motion.div>
                    </div>
                </div>
            </section>

            {/* Quick Contact */}
            <section className="w-full py-20 bg-secondary/10">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-6"
                    >
                        <h2 className="font-heading text-3xl md:text-4xl text-foreground">
                            Need Immediate Assistance?
                        </h2>
                        <p className="font-paragraph text-lg text-foreground/70 max-w-2xl mx-auto">
                            For urgent queries or immediate booking assistance, call us directly.
                            Our team is available during office hours to help you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="tel:+919876543210">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-paragraph font-medium">
                                    <Phone className="w-5 h-5 mr-2" />
                                    Call Now
                                </Button>
                            </a>
                            <a href="mailto:info@serenityhostel.com">
                                <Button
                                    variant="outline"
                                    className="border-primary text-primary hover:bg-primary/5 px-8 py-6 text-lg font-paragraph font-medium"
                                >
                                    <Mail className="w-5 h-5 mr-2" />
                                    Email Us
                                </Button>
                            </a>
                        </div>
                    </Motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
