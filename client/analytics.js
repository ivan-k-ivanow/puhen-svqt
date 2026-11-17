export function trackPageView(path) {
    if (typeof window.gtag !== 'function') return;

    window.gtag('event', 'page_view', {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
    });
}

export function updateConsent(choice) {
    if (typeof window.gtag !== 'function') return;

    window.gtag('consent', 'update', {
        analytics_storage: choice === 'accepted' ? 'granted' : 'denied',
    });
}