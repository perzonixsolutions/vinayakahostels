import { motion as Motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const RULES = [
    { _id: '1', category: 'General', policyTitle: 'Curfew Timing', policyDescription: 'Main gates close at 10:00 PM. Late entry requires prior permission from the warden. Repeat offenders will be fined.', effectiveDate: 'January 1, 2023' },
    { _id: '2', category: 'Visitors', policyTitle: 'Visitor Policy', policyDescription: 'Visitors are allowed in the common area between 9:00 AM and 7:00 PM. No overnight stay for visitors.', effectiveDate: 'January 1, 2023' },
    { _id: '3', category: 'Discipline', policyTitle: 'Anti-Ragging Policy', policyDescription: 'Zero tolerance for ragging. Any involvement will lead to immediate expulsion and police complaint.', effectiveDate: 'January 1, 2023' },
    { _id: '4', category: 'Discipline', policyTitle: 'No Smoking/Alcohol', policyDescription: 'Possession or consumption of alcohol, drugs, or smoking items is strictly prohibited within hostel premises.', effectiveDate: 'January 1, 2023' },
    { _id: '5', category: 'Payments', policyTitle: 'Fee Payment', policyDescription: 'Hostel fees must be paid by the 5th of every month. Late fee of ₹100/day applies thereafter.', effectiveDate: 'January 1, 2023' },
    { _id: '6', category: 'Maintenance', policyTitle: 'Property Damage', policyDescription: 'Residents are responsible for room furniture. Any damage will be recovered from the security deposit.', effectiveDate: 'January 1, 2023' },
];

export default function RulesPage() {
    const groupedPolicies = RULES.reduce((acc, policy) => {
        const category = policy.category || 'General';
        if (!acc[category]) acc[category] = [];
        acc[category].push(policy);
        return acc;
    }, {});


    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Rules & Policies"
                description="Review the rules and policies of Vinayaka Boys Hostel that ensure a safe, respectful, and comfortable living environment for all students."
                keywords="Vinayaka Boys PG rules, Hostel policies Kuragallu, Boys student accommodation rules, Safe PG guidelines Neerukonda, Boys Hostel management policies Mangalagiri"
                canonicalUrl="https://vinayakapghostels.in/rules"
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
                        Rules & Policies
                    </h1>
                    <p className="font-paragraph text-lg md:text-xl text-foreground/80 leading-relaxed">
                        Clear guidelines to ensure a safe, respectful, and comfortable living environment for all residents.
                    </p>
                </Motion.div>
            </section>

            {/* Introduction */}
            <section className="w-full py-16 bg-secondary/10">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto text-center space-y-6"
                    >
                        <h2 className="font-heading text-3xl text-foreground">
                            Our Commitment to You
                        </h2>
                        <p className="font-paragraph text-lg text-foreground/80 leading-relaxed">
                            These rules and policies are designed to create a harmonious living environment where
                            every resident can focus on their studies and personal growth. We believe in transparency
                            and fairness, and these guidelines apply equally to all residents.
                        </p>
                    </Motion.div>
                </div>
            </section>

            {/* Policies by Category */}
            <section className="w-full py-20">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <div className="min-h-[400px]">
                        {Object.keys(groupedPolicies).length > 0 ? (
                            <div className="space-y-16">
                                {Object.keys(groupedPolicies).map((category) => (
                                    <Motion.div
                                        key={category}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <h3 className="font-heading text-3xl text-foreground mb-8 pb-4 border-b-2 border-primary">
                                            {category}
                                        </h3>
                                        <div className="space-y-6">
                                            {groupedPolicies[category].map((policy, index) => (
                                                <Motion.div
                                                    key={policy._id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                                    className="bg-white p-8 rounded-lg border border-muted-grey"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                                        <div className="flex-1 space-y-3">
                                                            <h4 className="font-heading text-xl text-foreground">
                                                                {policy.policyTitle}
                                                            </h4>
                                                            {policy.policyDescription && (
                                                                <p className="font-paragraph text-base text-foreground/80 leading-relaxed">
                                                                    {policy.policyDescription}
                                                                </p>
                                                            )}
                                                            {policy.effectiveDate && (
                                                                <p className="font-paragraph text-sm text-foreground/60">
                                                                    Effective from: {typeof policy.effectiveDate === 'string'
                                                                        ? policy.effectiveDate
                                                                        : format(new Date(policy.effectiveDate), 'MMMM d, yyyy')}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Motion.div>
                                            ))}
                                        </div>
                                    </Motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="font-paragraph text-lg text-foreground/60">
                                    Policy information coming soon
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Important Notes */}
            <section className="w-full py-20 bg-secondary/10">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h2 className="font-heading text-3xl text-foreground mb-8 text-center">
                            Important Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    title: 'Policy Updates',
                                    description: 'We reserve the right to update these policies. Residents will be notified of any significant changes in advance.'
                                },
                                {
                                    title: 'Enforcement',
                                    description: 'Violation of hostel rules may result in warnings, fines, or termination of accommodation, depending on severity.'
                                },
                                {
                                    title: 'Exceptions',
                                    description: 'Special circumstances may be considered on a case-by-case basis. Please discuss with management.'
                                },
                                {
                                    title: 'Questions',
                                    description: 'If you have questions about any policy, please contact our management team for clarification.'
                                }
                            ].map((note, index) => (
                                <Motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="bg-white p-6 rounded-lg border border-muted-grey"
                                >
                                    <h3 className="font-heading text-xl text-foreground mb-3">
                                        {note.title}
                                    </h3>
                                    <p className="font-paragraph text-base text-foreground/70 leading-relaxed">
                                        {note.description}
                                    </p>
                                </Motion.div>
                            ))}
                        </div>
                    </Motion.div>
                </div>
            </section>

            {/* Contact CTA */}
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
                            Need Clarification?
                        </h2>
                        <p className="font-paragraph text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                            We're happy to discuss any of our policies in detail. Contact us to learn more
                            about our rules and how we maintain a safe, comfortable environment.
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
