// HPI 1.7-G
import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Shield, Wifi, Utensils, MapPin, Star, CheckCircle, ArrowRight, Quote, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
    // ---------------------------------------------------------------------------
    // DATA FIDELITY PROTOCOL: CANONICAL DATA SOURCES
    // ---------------------------------------------------------------------------
    const features = [
        {
            icon: Shield,
            title: 'Safe & Secure',
            description: '24/7 security with CCTV surveillance and secure entry systems'
        },
        {
            icon: Wifi,
            title: 'Modern Facilities',
            description: 'High-speed WiFi, study areas, and all essential amenities'
        },
        {
            icon: Utensils,
            title: 'Nutritious Meals',
            description: 'Hygienic kitchen with balanced, home-cooked meals daily'
        },
        {
            icon: MapPin,
            title: 'Prime Location',
            description: '2km to SRM University, 5km to Guntur Railway Station, 10km to Guntur Bus Station'
        }
    ];

    const highlights = [
        'Spotlessly clean rooms and common areas',
        'Experienced and caring management team',
        'Transparent pricing with no hidden costs',
        'Regular maintenance and housekeeping',
        'Separate floors for Seniors and Juniors',
        'Study-friendly environment'
    ];

    // ---------------------------------------------------------------------------
    // MOTION & SCROLL HOOKS
    // ---------------------------------------------------------------------------
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
    const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

    // Smooth spring for parallax elements
    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
    const ySpring = useSpring(heroY, springConfig);

    return (
        <div className="min-h-screen bg-background overflow-x-clip selection:bg-primary/20 selection:text-primary">
            <Header />

            {/* ---------------------------------------------------------------------------
          HERO SECTION: IMMERSIVE PARALLAX
          --------------------------------------------------------------------------- */}
            <section className="relative w-full min-h-[95vh] flex items-center justify-center overflow-hidden">
                {/* Background Parallax Layer */}
                <motion.div
                    style={{ y: ySpring, opacity: heroOpacity }}
                    className="absolute inset-0 w-full h-[120%] -top-[10%] z-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background z-10" />
                    <Image
                        src="https://static.wixstatic.com/media/0e16eb_78a284633f3d4781a42b1c3833d9d389~mv2.png?originWidth=1920&originHeight=1024"
                        alt="Vinayaka hostel environment"
                        className="w-full h-full object-cover opacity-40"
                        width={1920}
                    />
                </motion.div>

                {/* Content Layer */}
                <div className="relative z-20 w-full max-w-[120rem] mx-auto px-8 md:px-20 pt-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        {/* Text Content */}
                        <div className="lg:col-span-7 space-y-10">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-sm font-paragraph font-medium text-primary tracking-wide uppercase">
                                        Premium Student Living
                                    </span>
                                </div>
                                <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl text-foreground leading-[1.1] tracking-tight">
                                    Your Home <br />
                                    <span className="text-primary italic">Away From Home</span>
                                </h1>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                className="font-paragraph text-xl md:text-2xl text-foreground/70 leading-relaxed max-w-2xl"
                            >
                                A sanctuary of comfort designed for focus and peace of mind.
                                Where premium facilities meet the warmth of community.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="flex flex-col sm:flex-row gap-5"
                            >
                                <Link to="/contact">
                                    <Button className="h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-paragraph font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
                                        Book a Visit
                                    </Button>
                                </Link>
                                <Link to="/rooms">
                                    <Button variant="outline" className="h-14 px-10 border-primary/30 text-foreground hover:bg-primary/5 text-lg font-paragraph font-medium rounded-full transition-all duration-300">
                                        View Rooms
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Hero Image Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: 50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="lg:col-span-5 relative hidden lg:block"
                        >
                            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                                <Image
                                    src="https://static.wixstatic.com/media/0e16eb_bae17e8ea2d9428196cc5d93e5e5cea9~mv2.png?originWidth=1920&originHeight=1024"
                                    alt="Modern hostel interior"
                                    className="w-full h-full object-cover"
                                    width={800}
                                />

                                {/* Floating Badge */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1, duration: 0.8 }}
                                    className="absolute bottom-8 left-8 right-8 z-20 bg-white/95 backdrop-blur-md p-6 rounded-xl border border-white/40 shadow-lg"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-heading text-lg text-foreground">Admissions Open</p>
                                            <p className="font-paragraph text-sm text-foreground/60">Academic Year 2026-27</p>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <ArrowRight className="w-5 h-5 text-primary" />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
                >
                    <span className="text-xs font-paragraph uppercase tracking-widest text-foreground/40">Scroll to Explore</span>
                    <ChevronDown className="w-5 h-5 text-primary animate-bounce" />
                </motion.div>
            </section>

            {/* ---------------------------------------------------------------------------
          FEATURES SECTION: STAGGERED GRID
          --------------------------------------------------------------------------- */}
            <section className="w-full py-32 bg-background relative">
                {/* Decorative Divider */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-muted-grey to-transparent opacity-50" />

                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="max-w-2xl"
                        >
                            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-6">
                                Curated for <span className="text-primary">Excellence</span>
                            </h2>
                            <p className="font-paragraph text-lg text-foreground/70 leading-relaxed">
                                We understand that a conducive environment is key to academic success.
                                Every detail of our facility is crafted to provide safety, comfort, and convenience.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <Link to="/facilities">
                                <Button variant="ghost" className="group text-lg font-paragraph text-primary hover:bg-primary/5 px-6">
                                    View All Facilities
                                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group relative bg-white p-10 rounded-2xl border border-muted-grey/40 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <feature.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
                                </div>

                                <h3 className="font-heading text-2xl text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="font-paragraph text-base text-foreground/60 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------------------------------------------------------------------------
          VISUAL BREATHER: FULL BLEED
          --------------------------------------------------------------------------- */}
            <section className="w-full h-[70vh] relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://static.wixstatic.com/media/0e16eb_5f7292325d29422fa494aa109046468a~mv2.png?originWidth=1920&originHeight=1024"
                        alt="Peaceful study environment"
                        className="w-full h-full object-cover"
                        width={1920}
                    />
                    <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="relative z-10 max-w-4xl mx-auto px-8 text-center"
                >
                    <Quote className="w-16 h-16 text-white/80 mx-auto mb-8" />
                    <h2 className="font-heading text-4xl md:text-6xl text-white leading-tight mb-8">
                        "Peace of mind for parents. <br /> A launchpad for students."
                    </h2>
                    <div className="w-24 h-1 bg-accent-gold mx-auto rounded-full" />
                </motion.div>
            </section>

            {/* ---------------------------------------------------------------------------
          HIGHLIGHTS SECTION: STICKY LAYOUT
          --------------------------------------------------------------------------- */}
            <section className="w-full py-32 bg-secondary/5">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <div className="flex flex-col lg:flex-row gap-20">

                        {/* Sticky Image Column */}
                        <div className="lg:w-1/2 relative">
                            <div className="sticky top-32 h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/50">
                                <Image
                                    src="https://static.wixstatic.com/media/0e16eb_1e47f1c4a56b4c19acbe876bdc935a14~mv2.png?originWidth=960&originHeight=704"
                                    alt="Premium hostel amenities"
                                    className="w-full h-full object-cover"
                                    width={1000}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-10 left-10 right-10 text-white">
                                    <p className="font-heading text-3xl mb-2">The Gold Standard</p>
                                    <p className="font-paragraph text-white/80">Setting the benchmark for student accommodation.</p>
                                </div>
                            </div>
                        </div>

                        {/* Scrolling Content Column */}
                        <div className="lg:w-1/2 py-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="mb-16"
                            >
                                <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-6">
                                    What Sets Us Apart
                                </h2>
                                <p className="font-paragraph text-lg text-foreground/70 leading-relaxed">
                                    We go beyond providing just a room. Our commitment is to create a supportive environment
                                    where students thrive academically and personally.
                                </p>
                            </motion.div>

                            <div className="space-y-8">
                                {highlights.map((highlight, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="group flex items-start gap-6 p-6 rounded-xl bg-white border border-transparent hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                            <CheckCircle className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="font-heading text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                                                {highlight}
                                            </h3>
                                            <p className="font-paragraph text-sm text-foreground/60">
                                                Designed to ensure the highest quality of living standards.
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------------------------------------------------------------------------
          TESTIMONIALS: HORIZONTAL FLOW
          --------------------------------------------------------------------------- */}
            <section className="w-full py-32 bg-background overflow-hidden">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20 mb-16 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-heading text-4xl md:text-5xl text-foreground mb-4"
                    >
                        Voices of Our Community
                    </motion.h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
                </div>

                <div className="max-w-[120rem] mx-auto px-8 md:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item, index) => (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                className="bg-white p-10 rounded-t-2xl rounded-br-2xl rounded-bl-none border border-muted-grey shadow-sm hover:shadow-xl transition-all duration-500 relative mt-4"
                            >
                                <Quote className="absolute top-8 right-8 w-10 h-10 text-primary/10" />
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-accent-gold text-accent-gold" />
                                    ))}
                                </div>
                                <p className="font-paragraph text-lg text-foreground/80 mb-8 leading-relaxed italic">
                                    "The hostel exceeded our expectations. Clean rooms, good food, and excellent management.
                                    My parents are completely satisfied with the safety measures."
                                </p>
                                <div className="flex items-center gap-4 pt-6 border-t border-muted-grey/30">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-heading text-xl shadow-md">
                                        R
                                    </div>
                                    <div>
                                        <p className="font-paragraph font-bold text-foreground">Resident Name</p>
                                        <p className="font-paragraph text-sm text-primary">Student, Engineering</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link to="/testimonials">
                            <Button variant="link" className="text-primary text-lg font-paragraph hover:text-primary/80">
                                Read more stories <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ---------------------------------------------------------------------------
          CTA SECTION: BOLD & DIRECT
          --------------------------------------------------------------------------- */}
            <section className="w-full py-32 bg-primary relative overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-secondary blur-3xl" />
                </div>

                <div className="max-w-[100rem] mx-auto px-8 md:px-20 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-3/5 space-y-8"
                        >
                            <h2 className="font-heading text-5xl md:text-6xl text-white leading-tight">
                                Ready to Upgrade Your <br /> Living Experience?
                            </h2>
                            <p className="font-paragraph text-xl text-white/90 max-w-2xl leading-relaxed">
                                Schedule a visit to see our facilities, meet our team, and experience the difference.
                                We're here to answer all your questions.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:w-2/5 flex flex-col gap-6 w-full max-w-md"
                        >
                            <Link to="/contact" className="w-full">
                                <Button className="w-full h-16 bg-white text-primary hover:bg-white/90 text-xl font-paragraph font-medium rounded-xl shadow-xl shadow-black/10 transition-transform hover:-translate-y-1">
                                    Schedule a Visit
                                </Button>
                            </Link>
                            <Link to="/availability" className="w-full">
                                <Button variant="outline" className="w-full h-16 border-white/30 text-white hover:bg-white/10 text-xl font-paragraph font-medium rounded-xl backdrop-blur-sm">
                                    Check Room Availability
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}