import React from 'react';
import { motion as Motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Privacy Policy"
                description="Privacy Policy for Vinayaka Boys Hostel & PG."
                keywords="Vinayaka Boys PG privacy policy, Boys Hostel data protection Kuragallu, Student privacy guidelines Neerukonda"
                canonicalUrl="https://vinayakapghostels.in/privacy"
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
                        Privacy Policy
                    </h1>
                    <p className="font-paragraph text-lg md:text-xl text-foreground/80 leading-relaxed">
                        How we handle and protect your personal data.
                    </p>
                </Motion.div>

                <div className="max-w-4xl mx-auto space-y-12">
                    <section className="space-y-4">
                        <h2 className="font-heading text-3xl text-foreground">1. Information We Collect</h2>
                        <p className="font-paragraph text-base text-foreground/80 leading-relaxed">
                            We collect personal information that you provide to us when registering for our hostel, including your name, contact details, identification documents, and emergency contact information.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-3xl text-foreground">2. Use of Information</h2>
                        <p className="font-paragraph text-base text-foreground/80 leading-relaxed">
                            The information we collect is used solely for the purpose of providing accommodation services, ensuring safety, and communicating important updates or notices. We do not sell or rent your personal data to third parties.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-3xl text-foreground">3. Security</h2>
                        <p className="font-paragraph text-base text-foreground/80 leading-relaxed">
                            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, accidental loss, or destruction. We also use CCTV surveillance on our premises primarily for the safety of our residents.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-3xl text-foreground">4. Disclosure of Information</h2>
                        <p className="font-paragraph text-base text-foreground/80 leading-relaxed">
                            Your information may be disclosed to legal or regulatory authorities if required by law, or to trusted third-party service providers who assist us in operating our hostel under strict confidentiality agreements.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-3xl text-foreground">5. Your Rights</h2>
                        <p className="font-paragraph text-base text-foreground/80 leading-relaxed">
                            You have the right to access, correct, or request the deletion of your personal data at any time. For any data-related queries, please contact our management team.
                        </p>
                    </section>
                </div>
            </section>

            <Footer />
        </div>
    );
}
