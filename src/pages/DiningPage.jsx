import { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import axios from 'axios';
import SEO from '@/components/SEO';

const API_URL = import.meta.env.VITE_API_URL;

export default function DiningPage() {
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadMenu();
    }, []);

    const loadMenu = async () => {
        try {
            const response = await axios.get(`${API_URL}/menu`);
            const data = response.data;

            if (!Array.isArray(data)) {
                console.error('Failed to load menu: Invalid response format');
                setMenuItems([]);
                return;
            }

            // Map backend fields to frontend expectations
            const mappedItems = data.map(item => ({
                _id: item.id,
                mealType: item.meal_type || 'Other',
                menuItemName: item.name,
                description: item.description,
                dishImage: item.image,
                dayOfWeek: item.day_of_week,
                // Provide default times based on meal type strictly for display
                ...getDefaultServingTime(item.meal_type),
                price: item.price
            }));

            setMenuItems(mappedItems);
        } catch (error) {
            console.error('Failed to load menu:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getDefaultServingTime = (type) => {
        switch (type) {
            case 'Breakfast': return { servingStartTime: '7:30 AM', servingEndTime: '9:30 AM' };
            case 'Lunch': return { servingStartTime: '12:30 PM', servingEndTime: '2:30 PM' };
            case 'Snacks': return { servingStartTime: '5:00 PM', servingEndTime: '6:00 PM' };
            case 'Dinner': return { servingStartTime: '7:30 PM', servingEndTime: '9:30 PM' };
            default: return { servingStartTime: '', servingEndTime: '' };
        }
    };

    const groupedMenu = menuItems.reduce((acc, item) => {
        const mealType = item.mealType;
        if (!acc[mealType]) {
            acc[mealType] = [];
        }
        acc[mealType].push(item);
        return acc;
    }, {});

    const mealOrder = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
    const sortedMealTypes = Object.keys(groupedMenu).sort((a, b) => {
        const indexA = mealOrder.indexOf(a);
        const indexB = mealOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Food & Dining"
                description="Discover our nutritious, home-cooked dining menu. We provide hygienic, balanced meals for students at Vinayaka Boys Hostel."
                keywords="Boys Hostel food Kuragallu, PG with food near SRM AP, Student meals Neerukonda, Nutritious boys hostel food, Vinayaka PG dining Mangalagiri"
                canonicalUrl="https://vinayakapghostels.in/dining"
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
                        Food & Dining
                    </h1>
                    <p className="font-paragraph text-lg md:text-xl text-foreground/80 leading-relaxed">
                        Enjoy nutritious, home-cooked meals prepared with care in our hygienic kitchen.
                        We understand the importance of good food for student health and well-being.
                    </p>
                </Motion.div>
            </section>

            {/* Dining Highlights */}
            <section className="w-full py-16 bg-secondary/10">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: 'Hygienic Kitchen',
                                description: 'Maintained to the highest standards of cleanliness'
                            },
                            {
                                title: 'Balanced Meals',
                                description: 'Nutritious menu planned by dietary experts'
                            },
                            {
                                title: 'Fresh Ingredients',
                                description: 'Daily procurement of fresh vegetables and groceries'
                            },
                            {
                                title: 'Home-Style Cooking',
                                description: 'Prepared with care, just like home'
                            }
                        ].map((item, index) => (
                            <Motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white p-8 rounded-lg border border-muted-grey text-center"
                            >
                                <h3 className="font-heading text-2xl text-foreground mb-3">
                                    {item.title}
                                </h3>
                                <p className="font-paragraph text-base text-foreground/70 leading-relaxed">
                                    {item.description}
                                </p>
                            </Motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Menu Section */}
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
                            Our Menu
                        </h2>
                        <p className="font-paragraph text-lg text-foreground/70 max-w-3xl mx-auto">
                            A variety of delicious and nutritious meals served throughout the day
                        </p>
                    </Motion.div>

                    <div className="min-h-[400px]">
                        {isLoading ? (
                            <div className="text-center py-20">
                                <p className="font-paragraph text-lg text-foreground/60">Loading menu...</p>
                            </div>
                        ) : menuItems.length > 0 ? (
                            <div className="space-y-16">
                                {sortedMealTypes.map((mealType) => (
                                    <Motion.div
                                        key={mealType}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <h3 className="font-heading text-3xl text-foreground mb-8 pb-4 border-b-2 border-primary">
                                            {mealType}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {groupedMenu[mealType].map((item, index) => (
                                                <Motion.div
                                                    key={item._id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                                    className="bg-white rounded-lg overflow-hidden border border-muted-grey hover:shadow-lg transition-shadow duration-300"
                                                >
                                                    {item.dishImage && (
                                                        <div className="aspect-[4/3] overflow-hidden">
                                                            <Image
                                                                src={item.dishImage.startsWith('http') ? item.dishImage : `${API_URL.replace(/\/api$/, '')}${item.dishImage}`}
                                                                alt={item.menuItemName || 'Dish'}
                                                                className="w-full h-full object-cover"
                                                                width={400}
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="p-6 space-y-3">
                                                        <h4 className="font-heading text-xl text-foreground">
                                                            {item.menuItemName}
                                                        </h4>
                                                        {item.description && (
                                                            <p className="font-paragraph text-sm text-foreground/70 leading-relaxed">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                        {(item.servingStartTime || item.servingEndTime) && (
                                                            <div className="flex items-center gap-2 text-foreground/60 pt-2">
                                                                <Clock className="w-4 h-4" />
                                                                <span className="font-paragraph text-sm">
                                                                    {item.servingStartTime && item.servingEndTime
                                                                        ? `${item.servingStartTime} - ${item.servingEndTime}`
                                                                        : item.servingStartTime || item.servingEndTime}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {item.dayOfWeek && (
                                                            <p className="font-paragraph text-xs text-foreground/50">
                                                                {item.dayOfWeek}
                                                            </p>
                                                        )}
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
                                    No menu items available at the moment.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Dining Policies */}
            <section className="w-full py-20 bg-secondary/10">
                <div className="max-w-[100rem] mx-auto px-8 md:px-20">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="font-heading text-4xl text-foreground mb-4">
                            Dining Policies
                        </h2>
                    </Motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                title: 'Meal Timings',
                                description: 'Fixed timings for all meals to maintain routine and freshness. Late meal requests can be accommodated with prior notice.'
                            },
                            {
                                title: 'Special Dietary Needs',
                                description: 'We accommodate vegetarian, vegan, and other dietary preferences. Please inform us during admission.'
                            },
                            {
                                title: 'Food Quality',
                                description: 'We use only quality ingredients and maintain strict hygiene standards. Regular health inspections are conducted.'
                            },
                            {
                                title: 'Feedback Welcome',
                                description: 'We use your feedback on food quality and menu variety. Monthly menu reviews are conducted with residents.'
                            }
                        ].map((policy, index) => (
                            <Motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white p-8 rounded-lg border border-muted-grey"
                            >
                                <h3 className="font-heading text-2xl text-foreground mb-3">
                                    {policy.title}
                                </h3>
                                <p className="font-paragraph text-base text-foreground/70 leading-relaxed">
                                    {policy.description}
                                </p>
                            </Motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
