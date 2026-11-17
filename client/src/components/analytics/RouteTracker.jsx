import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { trackPageView } from '../../analytics';

export default function RouteTracker() {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.startsWith('/admin')) return;

        trackPageView(location.pathname + location.search);
    }, [location.pathname, location.search]);

    return null;
}