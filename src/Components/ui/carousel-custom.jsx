import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Carousel({ images, autoPlay = true, interval = 3000, className = "" }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!autoPlay || images.length <= 1) return;
        
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images, autoPlay, interval]);

    const handlePrevious = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    if (!images || images.length === 0) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 rounded-md ${className}`}>
                <span className="text-gray-400 text-xs">No images</span>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden group rounded-md ${className}`}>
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-full h-full object-cover"
                    alt={`Slide ${currentIndex + 1}`}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                    }}
                />
            </AnimatePresence>

            {images.length > 1 && (
                <>
                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrevious}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
                    >
                        <ChevronRight size={16} />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1 rounded-full transition-all duration-300 ${
                                    idx === currentIndex ? "w-4 bg-white" : "w-1 bg-white/50"
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
