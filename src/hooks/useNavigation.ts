import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export type NavigationItem = 'dashboard' | 'customer' | 'recommendations' | 'overview' ;

export const useNavigation = () => {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState<NavigationItem>('dashboard');

    useEffect(() => {
        // Remove the leading slash and get the path
        const path = location.pathname.slice(1);

        // If path is empty, it means we're on the root path (overview)
        if (!path) {
            setCurrentPage('overview');
            return;
        }

        // Set the current page based on the path
        setCurrentPage(path as NavigationItem);
    }, [location.pathname]);

    return {
        currentPage,
        setCurrentPage,
    };
};
