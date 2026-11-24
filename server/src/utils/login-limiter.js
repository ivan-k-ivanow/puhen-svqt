// Пази входа в админа от налучкване на паролата.
// След твърде много грешни опита от един IP адрес или за един имейл
// входът се спира за 15 минути. Пази се в паметта на сървъра –
// при рестарт (нов деплой) броячите се нулират, което е достатъчно за нас.

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS_PER_IP = 5;
const MAX_FAILS_PER_EMAIL = 10;

const failures = new Map(); // ключ -> { count, firstAt }

function keys(ip, email) {
    return [
        { key: `ip:${ip}`, max: MAX_FAILS_PER_IP },
        { key: `email:${email.trim().toLowerCase()}`, max: MAX_FAILS_PER_EMAIL },
    ];
}

function current(key) {
    const entry = failures.get(key);

    if (entry && Date.now() - entry.firstAt > WINDOW_MS) {
        failures.delete(key);
        return null;
    }

    return entry ?? null;
}

// Колко секунди още е спрян входът (0, ако не е).
export function loginRetryAfter(ip, email) {
    let wait = 0;

    for (const { key, max } of keys(ip, email)) {
        const entry = current(key);

        if (entry && entry.count >= max) {
            wait = Math.max(wait, Math.ceil((entry.firstAt + WINDOW_MS - Date.now()) / 1000));
        }
    }

    return wait;
}

export function recordLoginFailure(ip, email) {
    for (const { key } of keys(ip, email)) {
        const entry = current(key);

        if (entry) {
            entry.count += 1;
        } else {
            failures.set(key, { count: 1, firstAt: Date.now() });
        }
    }
}

export function clearLoginFailures(ip, email) {
    for (const { key } of keys(ip, email)) {
        failures.delete(key);
    }
}

// Чистим старите записи, за да не растат безкрайно.
setInterval(() => {
    const now = Date.now();

    for (const [key, entry] of failures) {
        if (now - entry.firstAt > WINDOW_MS) {
            failures.delete(key);
        }
    }
}, WINDOW_MS).unref();
