import React from 'react';
import { motion as Motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Terms of Service"
                description="Terms of Service for Vinayaka Boys Hostel & PG."
                keywords="Vinayaka Boys PG terms, Hostel terms of service Kuragallu, Boys student accommodation conditions Neerukonda"
                canonicalUrl="https://vinayakapghostels.in/terms"
            />
            <Header />

            <section className="w-full max-w-[100rem] mx-auto px-8 md:px-20 py-20">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-6 max-w-4xl mx-auto mb-16"
                >
                    <h1 className="font-heading text-5xl md:text-6xl text-foreground">
                        Terms of Service
                    </h1>
                    <p className="font-paragraph text-lg md:text-xl text-foreground/80 leading-relaxed">
                        Please read these terms carefully before using our services.
                    </p>
                </Motion.div>

                <div className="max-w-4xl mx-auto space-y-12">
                    <section className="space-y-4">
                        <h2 className="font-heading text-3xl text-foreground">1. Acceptance of Terms</h2>
                        <p className="font-paragraph text-base text-foreground/80 leading-relaxed">
                            By accessing and using the services provided by Vinayaka PG & Hostels, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services or stay at our facilities.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-3xl text-foreground">2. Booking and Payments</h2>
                        <p className="font-paragraph text-base text-foreground/80 leading-relaxed">
                            All bookings are subject to availability. A security deposit and advance payment are required to confirm your accommodation. The management reserves the right to revise the pricing at any time.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-3xl text-foreground">3. Conduct and Behavior</h2>
                        <p className="font-paragraph text-base text-foreground/80 leading-relaxed">
                            Residents are expected to maintain proper decorum, respect fellow residents and staff, and adhere to the hostel's rules and policies. Any form of harassment, illegal activities, or breach of peace will lead to immediate eviction.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-3xl text-foreground">4. Liability</h2>
                        <p className="font-paragraph text-base text-foreground/80 leading-relaxed">
                            Vinayaka PG & Hostels is not liable for any personal injury, loss, or damage to personal belongings. Residents are advised to keep their valuables secure.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-3xl text-foreground">5. Termination</h2>
                        <p className="font-paragraph text-base text-foreground/80 leading-relaxed">
                            The management reserves the right to terminate your stay at any time with sufficient notice, or immediately in case of severe misconduct or failure to pay dues.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-3xl text-foreground">6. Changes to Terms</h2>
                        <p className="font-paragraph text-base text-foreground/80 leading-relaxed">
                            We reserve the right to modify these terms at any time. Significant changes will be communicated to the residents.
                        </p>
                    </section>
                </div>
            </section>

            <Footer />
        </div>
    );
}
