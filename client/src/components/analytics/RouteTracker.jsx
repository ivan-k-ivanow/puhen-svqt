import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { trackPageView } from '../../analytics.js';
import { captureAttribution } from '../../utils/attribution.js';
import { initMetaPixel, trackMeta } from '../../utils/meta-pixel.js';
import { captureInternalFlag, isInternalDevice } from '../../utils/internal-device.js';

export default function RouteTracker() {
    const location = useLocation();

    useEffect(() => {
        captureInternalFlag(location.search);

        const isAdmin = location.pathname.startsWith('/admin');
        const skip = isAdmin || isInternalDevice();

        // Спира Google Analytics в админа и на устройствата на екипа.
        window['ga-disable-G-R9DX325PTY'] = skip;

        if (skip) return;

        captureAttribution(location.search);
        trackPageView(location.pathname + location.search);
        initMetaPixel();
        trackMeta('PageView');
    }, [location.pathname, location.search]);
}