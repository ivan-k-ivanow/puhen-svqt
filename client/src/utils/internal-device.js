// Устройствата на екипа (админ, тестове) не се броят в Meta и Google Analytics.
// Устройството се маркира, щом влезеш като админ, или с ?internal=1 в адреса
// (например на телефон, на който не влизаш в админа). ?internal=0 маха маркировката.
const KEY = 'ps_internal';
const LIVE_HOSTS = ['puhensvqt.com', 'www.puhensvqt.com'];

export function markInternalDevice(on = true) {
    try {
        if (on) {
            localStorage.setItem(KEY, '1');
        } else {
            localStorage.removeItem(KEY);
        }
    } catch {
        // localStorage може да е недостъпен – не е критично.
    }
}

export function isInternalDevice() {
    if (typeof window === 'undefined') return false;

    // localhost и всякакви тестови адреси никога не се броят.
    if (!LIVE_HOSTS.includes(window.location.hostname)) return true;

    try {
        return localStorage.getItem(KEY) === '1';
    } catch {
        return false;
    }
}

// Чете ?internal=1 / ?internal=0 от адреса.
export function captureInternalFlag(search) {
    const value = new URLSearchParams(search).get('internal');

    if (value === '1') markInternalDevice(true);
    if (value === '0') markInternalDevice(false);
}
