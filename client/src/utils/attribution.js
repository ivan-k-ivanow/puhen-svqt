import { isInternalDevice } from './internal-device.js';

// Запомня откъде е дошъл клиентът (реклама, UTM), за да го видим в поръчката.
const STORAGE_KEY = 'ps_attribution';
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'ttclid', 'gclid'];

function readStored() {
    try {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
        return {};
    }
}

export function captureAttribution(search) {
    const params = new URLSearchParams(search);
    const found = {};

    for (const key of PARAMS) {
        const value = params.get(key);

        if (value) {
            found[key] = value.slice(0, 500);
        }
    }

    // Кога е дошъл от рекламата – нужно е на Meta за fbc.
    if (found.fbclid) {
        found.fbclid_ts = String(Date.now());
    }

    if (Object.keys(found).length === 0) {
        return;
    }

    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readStored(), ...found }));
    } catch {
        // sessionStorage може да е недостъпен (частен режим) – не е критично.
    }
}

function readCookie(name) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

export function getAttribution() {
    const data = readStored();
    const fbp = readCookie('_fbp');
    const fbc = readCookie('_fbc');

    if (fbp) data.fbp = fbp;
    if (fbc) data.fbc = fbc;

    // Сървърът праща данни на Meta само ако посетителят е приел бисквитките.
    try {
        // „internal“ = тестова поръчка от екипа – сървърът не я праща към Meta.
        data.consent = isInternalDevice()
            ? 'internal'
            : localStorage.getItem('puhen-svqt-cookie-consent') || 'none';
    } catch {
        data.consent = 'none';
    }

    return data;
}
