import React, { useState, useEffect } from 'react';
import MaintenancePage from '../pages/MaintenancePage';
import { useSearchParams } from 'react-router-dom';

const MaintenanceRoute = ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isBypassed, setIsBypassed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for bypass query param
        const bypassParam = searchParams.get('bypass');
        const storedBypass = localStorage.getItem('maintenance_bypass');

        if (bypassParam === 'true') {
            localStorage.setItem('maintenance_bypass', 'true');
            setIsBypassed(true);
            // Optional: Clean up URL
            searchParams.delete('bypass');
            setSearchParams(searchParams);
        } else if (storedBypass === 'true') {
            setIsBypassed(true);
        }

        setLoading(false);
    }, [searchParams, setSearchParams]);

    // Check env var. Note: In Vite, env vars are strings, so check for 'true'
    const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

    if (loading) return null; // Or a simple spinner

    if (isMaintenanceMode && !isBypassed) {
        return <MaintenancePage />;
    }

    return children;
};

export default MaintenanceRoute;
