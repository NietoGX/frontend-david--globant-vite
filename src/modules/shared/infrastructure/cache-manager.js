export class CacheManager {
    static DEFAULT_TTL_SECONDS = 3600;

    static set(key, value, ttl = CacheManager.DEFAULT_TTL_SECONDS) {
        if (typeof window === 'undefined') return;

        const entry = {
            value,
            expiry: Date.now() + ttl * 1000,
        };
        try {
            localStorage.setItem(key, JSON.stringify(entry));
        } catch (e) {
            console.warn('LocalStorage error', e);
        }
    }

    static get(key) {
        if (typeof window === 'undefined') return null;

        try {
            const item = localStorage.getItem(key);
            if (!item) return null;

            const entry = JSON.parse(item);

            if (Date.now() > entry.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            return entry.value;
        } catch (e) {
            console.warn('LocalStorage error', e);
            return null;
        }
    }

    static remove(key) {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(key);
    }
}
