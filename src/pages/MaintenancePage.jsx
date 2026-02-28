import React from 'react';
import { motion } from 'framer-motion';

const MaintenancePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden"
            >
                <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600 w-full" />
                <div className="p-8 text-center">
                    <div className="mb-6 flex justify-center">
                        {/* Logo Placeholder */}
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Vinayaka Hostels
                    </h1>
                    <h2 className="text-xl font-medium text-blue-600 mb-4">
                        We are Building Something Great!
                    </h2>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Our website is currently undergoing scheduled maintenance and upgrades to provide you with a better experience. We will be back shortly.
                    </p>

                    <div className="bg-blue-50 rounded-lg p-4 mb-8">
                        <p className="text-sm text-blue-800 font-medium">
                            For urgent inquiries, please contact us:
                        </p>
                        <p className="text-lg font-bold text-blue-900 mt-1">
                            +91 88861 48989
                        </p>
                    </div>

                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "60%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-2 bg-blue-200 rounded-full mx-auto mb-2 overflow-hidden"
                    >
                        <div className="h-full bg-blue-600 rounded-full" />
                    </motion.div>
                    <p className="text-xs text-gray-400">Estimated progress: 60%</p>
                </div>
                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} Vinayaka Hostels. All rights reserved.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default MaintenancePage;
