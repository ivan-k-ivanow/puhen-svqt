import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { trackPageView } from '../../analytics.js';
import { captureAttribution } from '../../utils/attribution.js';
import { initMetaPixel, trackMeta } from '../../utils/meta-pixel.js';

export default function RouteTracker() {
    const location = useLocation();

    useEffect(() => {
        const isAdmin = location.pathname.startsWith('/admin');

        // Спира Google Analytics изцяло в админа.
        window['ga-disable-G-R9DX325PTY'] = isAdmin;

        if (isAdmin) return;

        captureAttribution(location.search);
        trackPageView(location.pathname + location.search);
        initMetaPixel();
        trackMeta('PageView');
    }, [location.pathname, location.search]);
}