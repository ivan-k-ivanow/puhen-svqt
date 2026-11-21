// Meta (Facebook) пиксел – зарежда се само след „Приемам“.

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;
const CONSENT_KEY = 'puhen-svqt-cookie-consent';

let isLoaded = false;

function hasConsent() {
    try {
        return localStorage.getItem(CONSENT_KEY) === 'accepted';
    } catch {
        return false;
    }
}

function loadPixel() {
    if (isLoaded || !PIXEL_ID || typeof window === 'undefined') {
        return;
    }

    isLoaded = true;

    // Кодът от Meta (base code)
    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
        n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', PIXEL_ID);
}

// При всяка смяна на страница – зарежда пиксела, ако има съгласие.
export function initMetaPixel() {
    if (hasConsent()) {
        loadPixel();
    }
}

// Когато посетителят натисне „Приемам“.
export function grantMetaPixel() {
    loadPixel();
    trackMeta('PageView');
}

export function trackMeta(event, params = {}, eventId) {
    if (!isLoaded || typeof window.fbq !== 'function') {
        return;
    }

    if (eventId) {
        window.fbq('track', event, params, { eventID: eventId });
    } else {
        window.fbq('track', event, params);
    }
}

export function productParams(product) {
    return {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: Number(product?.price) || 0,
        currency: 'EUR',
    };
}