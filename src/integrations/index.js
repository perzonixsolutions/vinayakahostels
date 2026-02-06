
// Mock BaseCrudService to replace missing backend integration

const mockData = {
    testimonials: [
        {
            _id: '1',
            rating: 5,
            reviewText: "Amazing hostel! The facilities are top-notch and the staff is very friendly. Best place for students.",
            reviewerName: "Rahul Verma",
            reviewerRole: "Medical Student",
            reviewDate: "2023-10-15",
            reviewerImage: null
        },
        {
            _id: '2',
            rating: 4,
            reviewText: "Great food and comfortable rooms. Highly recommended for anyone looking for a home away from home.",
            reviewerName: "Priya Reddy",
            reviewerRole: "Engineering Student",
            reviewDate: "2023-11-20",
            reviewerImage: null
        },
        {
            _id: '3',
            rating: 5,
            reviewText: "Security is excellent, giving my parents peace of mind. The warden is very supportive.",
            reviewerName: "Karthik Raju",
            reviewerRole: "CA Student",
            reviewDate: "2024-01-10",
            reviewerImage: null
        },
        {
            _id: '4',
            rating: 5,
            reviewText: "The food menu is diverse and tasty. I never felt the need to eat out. Valid value for money.",
            reviewerName: "Anusha Rao",
            reviewerRole: "MBA Student",
            reviewDate: "2024-02-05",
            reviewerImage: null
        },
        {
            _id: '5',
            rating: 4,
            reviewText: "Cleanliness is maintained properly. Housekeeping staff is regular and efficient.",
            reviewerName: "Sandeep Kumar",
            reviewerRole: "Student",
            reviewDate: "2023-12-12",
            reviewerImage: null
        }
    ],
    roomtypes: [
        {
            _id: '1',
            roomName: 'Single Room (Non-AC)',
            availabilityStatus: 'Available',
            description: 'Private room with attached bathroom. Ideal for students who prefer privacy.',
            capacity: 1,
            amenities: 'Study table, Wardrobe, Attached Washroom, Balcony',
            pricePerMonth: 15000,
            pricePerSemester: 85000,
            roomPhotos: null
        },
        {
            _id: '1a',
            roomName: 'Premium Single (AC)',
            availabilityStatus: 'Very Limited',
            description: 'Luxury private room with AC and premium furnishings.',
            capacity: 1,
            amenities: 'AC, Refrigerator, Study table, Wardrobe, Attached Washroom, Balcony',
            pricePerMonth: 22000,
            pricePerSemester: 120000,
            roomPhotos: null
        },
        {
            _id: '2',
            roomName: 'Double Sharing (Non-AC)',
            availabilityStatus: 'Limited',
            description: 'Spacious room shared by two students. Perfect balance of company and privacy.',
            capacity: 2,
            amenities: 'Separate Study tables, Wardrobes, Attached Washroom',
            pricePerMonth: 10000,
            pricePerSemester: 55000,
            roomPhotos: null
        },
        {
            _id: '2a',
            roomName: 'Deluxe Double (AC)',
            availabilityStatus: 'Available',
            description: 'Air-conditioned double room with upgraded amenities.',
            capacity: 2,
            amenities: 'AC, Separate Study tables, Wardrobes, Attached Washroom, Geyser',
            pricePerMonth: 14000,
            pricePerSemester: 80000,
            roomPhotos: null
        },
        {
            _id: '3',
            roomName: 'Triple Sharing',
            availabilityStatus: 'Available',
            description: 'Large room for three students. Economical and great for group studies.',
            capacity: 3,
            amenities: 'Separate Study tables, Wardrobes, Attached Washroom, Geyser',
            pricePerMonth: 8000,
            pricePerSemester: 45000,
            roomPhotos: null
        },
        {
            _id: '4',
            roomName: 'Four Sharing',
            availabilityStatus: 'Waiting List',
            description: 'Most affordable option with good ventilation and space.',
            capacity: 4,
            amenities: 'Individual Cupboards, Common Study Area, Attached Washroom',
            pricePerMonth: 6500,
            pricePerSemester: 35000,
            roomPhotos: null
        }
    ],
    diningmenu: [
        {
            _id: '1',
            mealType: 'Breakfast',
            menuItemName: 'Idli, Wada & Sambar',
            description: 'Hot steamed idlis and crispy wadas served with chutney and sambar.',
            servingStartTime: '7:30 AM',
            servingEndTime: '9:30 AM',
            dayOfWeek: 'Monday, Thursday',
            dishImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800'
        },
        {
            _id: '2',
            mealType: 'Breakfast',
            menuItemName: 'Masala Dosa',
            description: 'Crispy golden crepe filled with spiced potato mash, served with coconut chutney.',
            servingStartTime: '7:30 AM',
            servingEndTime: '9:30 AM',
            dayOfWeek: 'Tuesday, Friday',
            dishImage: 'https://images.unsplash.com/photo-1668236543090-d2f89691136b?q=80&w=800'
        },
        {
            _id: '2b',
            mealType: 'Breakfast',
            menuItemName: 'Puri Bhaji',
            description: 'Fluffy fried bread served with delicious potato curry.',
            servingStartTime: '7:30 AM',
            servingEndTime: '9:30 AM',
            dayOfWeek: 'Wednesday, Saturday',
            dishImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800'
        },
        {
            _id: '3',
            mealType: 'Lunch',
            menuItemName: 'South Indian Thali',
            description: 'Full meal with Rice, Dal, Sambar, Rasam, Curd, and Vegetable Curry.',
            servingStartTime: '12:30 PM',
            servingEndTime: '2:30 PM',
            dayOfWeek: 'Daily',
            dishImage: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800'
        },
        {
            _id: '3c',
            mealType: 'Lunch',
            menuItemName: 'Steamed Rice & Dal',
            description: 'Unlimited hot white rice served with seasoned homestyle dal and ghee.',
            servingStartTime: '12:30 PM',
            servingEndTime: '2:30 PM',
            dayOfWeek: 'Daily',
            dishImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800'
        },
        {
            _id: '3b',
            mealType: 'Lunch',
            menuItemName: 'Vegetable Biryani',
            description: 'Aromatic basmati rice cooked with mixed vegetables and spices.',
            servingStartTime: '12:30 PM',
            servingEndTime: '2:30 PM',
            dayOfWeek: 'Sunday',
            dishImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800'
        },
        {
            _id: '4',
            mealType: 'Snacks',
            menuItemName: 'Tea & Snacks',
            description: 'Evening tea with hot snacks like Samosa, Bajji, or Biscuits.',
            servingStartTime: '5:00 PM',
            servingEndTime: '6:00 PM',
            dayOfWeek: 'Daily',
            dishImage: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?q=80&w=800'
        },
        {
            _id: '5',
            mealType: 'Dinner',
            menuItemName: 'Chapati & Curry',
            description: 'Soft phulkas served with a variety of vegetable curries.',
            servingStartTime: '7:30 PM',
            servingEndTime: '9:30 PM',
            dayOfWeek: 'Weekdays',
            dishImage: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=800'
        },
        {
            _id: '5b',
            mealType: 'Dinner',
            menuItemName: 'White Rice & Rasam',
            description: 'Comforting hot rice served with pepper rasam, papad, and pickle.',
            servingStartTime: '7:30 PM',
            servingEndTime: '9:30 PM',
            dayOfWeek: 'Daily',
            dishImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800'
        },
        {
            _id: '5c',
            mealType: 'Dinner',
            menuItemName: 'Curd Rice',
            description: 'Creamy curd rice tempered with mustard seeds and curry leaves.',
            servingStartTime: '7:30 PM',
            servingEndTime: '9:30 PM',
            dayOfWeek: 'Daily',
            dishImage: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800'
        },
        {
            _id: '6',
            mealType: 'Dinner',
            menuItemName: 'Sunday Special Feast',
            description: 'Paneer Butter Masala, Jeera Rice, Sweet, and Ice Cream.',
            servingStartTime: '7:30 PM',
            servingEndTime: '9:30 PM',
            dayOfWeek: 'Sunday',
            dishImage: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800'
        }
    ],
    nearbylandmarks: [
        {
            _id: '1',
            landmarkType: 'Education',
            landmarkName: 'SRM University',
            distanceFromHostel: '2km',
            description: 'Main road to SRM University',
            address: 'University Road',
            googleMapsUrl: 'https://maps.app.goo.gl/QvdYmWJWJqv7z3tMA',
        },
        {
            _id: '2',
            landmarkType: 'Transport',
            landmarkName: 'Auto/Taxi Stand',
            distanceFromHostel: '50m',
            description: 'Connects to all parts of the city.',
            address: '2km from SRM University Main Gate',
            googleMapsUrl: 'https://maps.app.goo.gl/QvdYmWJWJqv7z3tMA'
        }
    ],
    rulesandpolicies: [
        {
            _id: '1',
            category: 'General',
            policyTitle: 'Curfew Timing',
            policyDescription: 'Main gates close at 10:00 PM. Late entry requires prior permission from the warden. Repeat offenders will be fined.',
            effectiveDate: '2023-01-01'
        },
        {
            _id: '2',
            category: 'Visitors',
            policyTitle: 'Visitor Policy',
            policyDescription: 'Visitors are allowed in the common area between 9:00 AM and 7:00 PM. No overnight stay for visitors.',
            effectiveDate: '2023-01-01'
        },
        {
            _id: '3',
            category: 'Discipline',
            policyTitle: 'Anti-Ragging Policy',
            policyDescription: 'Zero tolerance for ragging. Any involvement will lead to immediate expulsion and police complaint.',
            effectiveDate: '2023-01-01'
        },
        {
            _id: '4',
            category: 'Discipline',
            policyTitle: 'No Smoking/Alcohol',
            policyDescription: 'Possession or consumption of alcohol, drugs, or smoking items is strictly prohibited within hostel premises.',
            effectiveDate: '2023-01-01'
        },
        {
            _id: '5',
            category: 'Payments',
            policyTitle: 'Fee Payment',
            policyDescription: 'Hostel fees must be paid by the 5th of every month. Late fee of ₹100/day applies thereafter.',
            effectiveDate: '2023-01-01'
        },
        {
            _id: '6',
            category: 'Maintenance',
            policyTitle: 'Property Damage',
            policyDescription: 'Residents are responsible for room furniture. Any damage will be recovered from the security deposit.',
            effectiveDate: '2023-01-01'
        }
    ],
    managementteam: [
        {
            _id: '1',
            staffName: 'Mr. Sharma',
            role: 'Warden',
            bio: 'Experienced warden with 10 years of experience managing student hostels. Dedicated to student welfare.',
            photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            personalStatement: 'My goal is to ensure every student feels safe and supported.'
        },
        {
            _id: '2',
            staffName: 'Mrs. Lakshmi',
            role: 'Hostel Manager',
            bio: 'Oversees daily operations and ensuring smooth functioning of all facilities.',
            photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            personalStatement: 'Efficiency and comfort are my top priorities.'
        },
        {
            _id: '3',
            staffName: 'Mr. Rajesh',
            role: 'Head of Security',
            bio: 'Retired army personnel ensuring 24/7 security of the campus.',
            photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            personalStatement: 'Safety isn\'t expensive, it\'s priceless.'
        },
        {
            _id: '4',
            staffName: 'Ms. Anita',
            role: 'Kitchen Head',
            bio: 'Certified nutritionist and chef ensuring healthy and tasty meals.',
            photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            personalStatement: 'Good food is the foundation of happiness and health.'
        },
        {
            _id: '5',
            staffName: 'Dr. Kumar',
            role: 'Student Counselor',
            bio: 'Available to guide students through academic and personal challenges.',
            photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            personalStatement: 'A hearing ear can make a world of difference.'
        }
    ],
    gallery: [
        {
            _id: '1',
            category: 'Rooms',
            title: 'Spacious Non-AC Room',
            image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800',
            description: 'Well-ventilated single occupancy room with study area.'
        },
        {
            _id: '2',
            category: 'Common Areas',
            title: 'Student Lounge & Study Hall',
            image: 'https://images.unsplash.com/photo-1519452016668-e3ae81cb4065?q=80&w=800',
            description: 'Peaceful environment for group studies and relaxation.'
        },
        {
            _id: '3',
            category: 'Dining',
            title: 'Hygienic Dining Hall',
            image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=800',
            description: 'Spacious dining area maintaining high standards of cleanliness.'
        },
        {
            _id: '4',
            category: 'Exterior',
            title: 'Modern Hostel Building',
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800',
            description: 'Secure and well-maintained hostel campus.'
        },
        {
            _id: '5',
            category: 'Rooms',
            title: 'Premium AC Room',
            image: 'https://images.unsplash.com/photo-1595524362625-27a387556ee5?q=80&w=800',
            description: 'Luxury comfort with air conditioning and premium amenities.'
        },
        {
            _id: '6',
            category: 'Celebrations',
            title: 'Ganesh Chaturthi',
            image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800',
            description: 'Celebrating festivals together like a big family.'
        },
        {
            _id: '7',
            category: 'Dining',
            title: 'Delicious Meals',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800',
            description: 'Nutritious and tasty food served daily.'
        },
        {
            _id: '8',
            category: 'Common Areas',
            title: 'TV & Recreation Room',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800',
            description: 'A place to unwind and watch matches together.'
        },
        {
            _id: '9',
            category: 'Celebrations',
            title: 'Freshers Party',
            image: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af38?q=80&w=800',
            description: 'Welcoming our new residents with joy and music.'
        }
    ],
    facilities: [
        {
            _id: '1',
            title: 'High Speed WiFi',
            description: 'Unlimited 100Mbps dedicated leased line internet access for all residents.',
            icon: 'Wifi'
        },
        {
            _id: '2',
            title: '24/7 Power Backup',
            description: 'Full generator backup for lights and fans during power outages.',
            icon: 'Zap'
        },
        {
            _id: '3',
            title: 'RO Water Plant',
            description: 'Centralized mineral water plant ensuring clean drinking water.',
            icon: 'Droplet'
        },
        {
            _id: '4',
            title: 'CCTV Surveillance',
            description: '24/7 security monitoring with cameras in all common areas.',
            icon: 'Shield'
        },
        {
            _id: '5',
            title: 'Housekeeping',
            description: 'Daily room cleaning and washroom sanitation.',
            icon: 'Sparkles'
        },
        {
            _id: '6',
            title: 'Library/Study Hall',
            description: 'Dedicated silent zone for exam preparations and reading.',
            icon: 'Book'
        },
        {
            _id: '7',
            title: 'Washing Machines',
            description: 'Fully automatic washing machines available for student use.',
            icon: 'Waves'
        },
        {
            _id: '8',
            title: 'Biometric Access',
            description: 'Secure digital entry system for residents only.',
            icon: 'Fingerprint'
        }
    ],
    faqs: [
        {
            _id: '1',
            question: 'What is the curfew time?',
            answer: 'The curfew time is 10:00 PM for all residents. Late entry is only permitted with prior approval from the warden.',
            category: 'Rules',
            isFeatured: true
        },
        {
            _id: '2',
            question: 'Is WiFi included in the fees?',
            answer: 'Yes, high-speed WiFi is included in the monthly hostel fee and is available 24/7 in all rooms and common areas.',
            category: 'Facilities',
            isFeatured: false
        },
        {
            _id: '3',
            question: 'What happens if I fall ill?',
            answer: 'We have a first-aid kit available with the warden. For serious issues, we have a tie-up with a nearby hospital (1km away) for 24/7 emergency care.',
            category: 'General',
            isFeatured: true
        },
        {
            _id: '4',
            question: 'Are visitors allowed?',
            answer: 'Yes, visitors (parents/guardians) are allowed in the visitor lounge between 9:00 AM and 7:00 PM. They are not permitted in student rooms.',
            category: 'Rules',
            isFeatured: true
        },
        {
            _id: '5',
            question: 'How often are the rooms cleaned?',
            answer: 'Rooms are cleaned daily by our housekeeping staff. Bathrooms are cleaned twice a day.',
            category: 'Facilities',
            isFeatured: false
        },
        {
            _id: '6',
            question: 'Is laundry service available?',
            answer: 'Yes, we have washing machines available for self-service. We also have a tie-up with a laundry service that collects clothes twice a week (charged separately).',
            category: 'Facilities',
            isFeatured: false
        },
        {
            _id: '7',
            question: 'What kind of food is served?',
            answer: 'We serve healthy and hygienic vegetarian food. The menu changes weekly and includes breakfast, lunch, evening tea/snacks, and dinner.',
            category: 'Dining',
            isFeatured: true
        },
        {
            _id: '8',
            question: 'Can I change my room later?',
            answer: 'Room changes are subject to availability and warden approval. A small administrative fee may apply.',
            category: 'Accommodation',
            isFeatured: false
        },
        {
            _id: '9',
            question: 'Is there a security deposit?',
            answer: 'Yes, a refundable security deposit of ₹5,000 is required at the time of admission.',
            category: 'Booking',
            isFeatured: false
        },
        {
            _id: '10',
            question: 'What is the procedure for vacating the hostel?',
            answer: 'Residents must give a 1-month notice before vacating. The security deposit will be refunded after room inspection.',
            category: 'Booking',
            isFeatured: false
        }
    ]
};

export const BaseCrudService = {
    getAll: async (collection) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return { items: mockData[collection.toLowerCase()] || [] };
    },
    getById: async (collection, id) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const items = mockData[collection.toLowerCase()] || [];
        return items.find(item => item._id === id) || null;
    }
};
