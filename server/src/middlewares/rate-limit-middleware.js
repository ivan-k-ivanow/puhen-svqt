// Просто ограничение на заявките по IP, без външни библиотеки.
// Пази броя в паметта на сървъра – достатъчно за една инстанция.
export function rateLimit({ windowMs, max, message }) {
    const hits = new Map();

    setInterval(() => {
        const now = Date.now();

        for (const [key, entry] of hits) {
            if (entry.resetAt <= now) {
                hits.delete(key);
            }
        }
    }, windowMs).unref();

    return (req, res, next) => {
        const now = Date.now();
        const key = req.ip;
        const entry = hits.get(key);

        if (!entry || entry.resetAt <= now) {
            hits.set(key, { count: 1, resetAt: now + windowMs });
            return next();
        }

        entry.count += 1;

        if (entry.count > max) {
            return res.status(429).json({ message });
        }

        return next();
    };
}
