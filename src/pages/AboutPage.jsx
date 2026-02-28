import { motion as Motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

export default function AboutPage() {
    const team = [
        {
            _id: '1',
            staffName: 'B.N. Reddy',
            role: 'Proprietor',
            bio: 'Founder and visionary behind Vinayaka Hostels, dedicated to providing a comfortable and secure living environment for all residents.',
        },
        {
            _id: '2',
            staffName: 'Pulla Reddy',
            role: 'Manager',
            bio: 'Oversees daily operations and ensures that all residents receive prompt assistance and top-quality facilities.',
        },
        {
            _id: '3',
            staffName: 'Guru Prasad',
            role: 'Head Chef',
            bio: 'Leads the culinary team to deliver nutritious, delicious, and hygienic meals every day.',
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="About Us"
                description="Learn about Vinayaka Boys Hostel & PG mission, vision, and core values. We are committed to providing a safe, clean, and nurturing environment for students near SRM AP, Amrita AP, and VIT AP."
                keywords="About Vinayaka Boys PG, Student housing near SRM AP, Boys hostel facilities Kuragallu, Safe PG Neerukonda, Best boys accommodation Mangalagiri"
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
                        About Vinayaka Hostels
                    </h1>
                    <p className="font-paragraph text-lg md:text-xl text-foreground/80 leading-relaxed">
                        We are committed to providing a safe, clean, and nurturing environment where students can thrive academically and personally.
                    </p>
                </Motion.div>
            </section>

            {/* Mission & Vision */}
            <section className="w-full py-16 bg-secondary/10">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <Motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="font-heading text-4xl text-foreground mb-4">
                                    Our Mission
                                </h2>
                                <p className="font-paragraph text-lg text-foreground/80 leading-relaxed">
                                    To provide students with a home-like environment that supports their educational journey.
                                    We believe that a comfortable and secure living space is essential for academic success and personal growth.
                                </p>
                            </div>
                            <div>
                                <h2 className="font-heading text-4xl text-foreground mb-4">
                                    Our Vision
                                </h2>
                                <p className="font-paragraph text-lg text-foreground/80 leading-relaxed">
                                    To be the most trusted and preferred hostel for students and parents, setting the standard
                                    for quality accommodation, safety, and student welfare in the region.
                                </p>
                            </div>
                        </Motion.div>

                        <Motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                                <Image
                                    src="https://static.wixstatic.com/media/0e16eb_0268fce05b364eec8bdd44d0f1e1ecbf~mv2.png?originWidth=768&originHeight=576"
                                    alt="Hostel building exterior"
                                    className="w-full h-full object-cover"
                                    width={800}
                                />
                            </div>
                        </Motion.div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="w-full py-20">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
                            Our Core Values
                        </h2>
                        <p className="font-paragraph text-lg text-foreground/70 max-w-3xl mx-auto">
                            These principles guide everything we do
                        </p>
                    </Motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Safety First',
                                description: '24/7 security, CCTV surveillance, and strict visitor policies ensure complete peace of mind for parents and students.'
                            },
                            {
                                title: 'Cleanliness',
                                description: 'Daily housekeeping, regular deep cleaning, and maintenance of the highest hygiene standards throughout the hostel.'
                            },
                            {
                                title: 'Transparency',
                                description: 'Clear pricing, open communication, and honest dealings with students and parents at all times.'
                            },
                            {
                                title: 'Respect',
                                description: 'We treat every resident with dignity and respect, fostering a supportive and inclusive community.'
                            },
                            {
                                title: 'Excellence',
                                description: 'Continuous improvement in our facilities, services, and student experience is our constant pursuit.'
                            },
                            {
                                title: 'Community',
                                description: 'Building a supportive environment where students form lasting friendships and support each other.'
                            }
                        ].map((value, index) => (
                            <Motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white p-8 rounded-lg border border-muted-grey"
                            >
                                <h3 className="font-heading text-2xl text-foreground mb-4">
                                    {value.title}
                                </h3>
                                <p className="font-paragraph text-base text-foreground/70 leading-relaxed">
                                    {value.description}
                                </p>
                            </Motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Management Team */}
            <section className="w-full py-20 bg-secondary/10">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
                            Meet Our Team
                        </h2>
                        <p className="font-paragraph text-lg text-foreground/70 max-w-3xl mx-auto">
                            Experienced professionals dedicated to your well-being
                        </p>
                    </Motion.div>

                    <div className="min-h-[400px]">
                        {team.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {team.map((member, index) => (
                                    <Motion.div
                                        key={member._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="bg-white rounded-lg overflow-hidden border border-muted-grey"
                                    >
                                        <div className="aspect-[3/4] overflow-hidden">
                                            <Image
                                                src={member.photo || 'https://static.wixstatic.com/media/0e16eb_07cb501434414ebebec7ccd538c58fc9~mv2.png?originWidth=384&originHeight=512'}
                                                alt={member.staffName || 'Team member'}
                                                className="w-full h-full object-cover"
                                                width={400}
                                            />
                                        </div>
                                        <div className="p-6 space-y-3">
                                            <h3 className="font-heading text-2xl text-foreground">
                                                {member.staffName}
                                            </h3>
                                            <p className="font-paragraph text-base text-primary font-medium">
                                                {member.role}
                                            </p>
                                            {member.bio && (
                                                <p className="font-paragraph text-base text-foreground/70 leading-relaxed">
                                                    {member.bio}
                                                </p>
                                            )}
                                            {member.personalStatement && (
                                                <p className="font-paragraph text-sm text-foreground/60 italic leading-relaxed mt-4">
                                                    "{member.personalStatement}"
                                                </p>
                                            )}
                                        </div>
                                    </Motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="font-paragraph text-lg text-foreground/60">
                                    Team information coming soon
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="w-full py-20">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
                            Why Parents Trust Us
                        </h2>
                    </Motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {[
                            {
                                title: 'Years of Experience',
                                description: 'Over a decade of providing quality accommodation and care for students from diverse backgrounds.'
                            },
                            {
                                title: 'Parent Communication',
                                description: 'Regular updates and open communication channels ensure parents are always informed about their child\'s well-being.'
                            },
                            {
                                title: 'Emergency Support',
                                description: '24/7 availability for emergencies with direct contact to management and nearby medical facilities.'
                            },
                            {
                                title: 'Proven Track Record',
                                description: 'Hundreds of satisfied students and parents who have trusted us with their accommodation needs.'
                            }
                        ].map((item, index) => (
                            <Motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="flex gap-6"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="font-heading text-2xl text-primary">{index + 1}</span>
                                </div>
                                <div>
                                    <h3 className="font-heading text-2xl text-foreground mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="font-paragraph text-base text-foreground/70 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </Motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
