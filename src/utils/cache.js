class Cache {

    constructor(ttlSeconds = 60) {
        this.ttl = ttlSeconds;
        this.store = new Map();
    }

    _isExpired(timestamp) {
        const age = (Date.now() - timestamp) / 1000;
        return age > this.ttl;
    }

    get(key) {
        const cached = this.store.get(key);
        if (!cached) return null;

        if (this._isExpired(cached.timestamp)) {
            this.store.delete(key);
            return null;
        }

        return cached.value;
    }

    set(key, value) {
        this.store.set(key, { value, timestamp: Date.now(),});
    }

    delete(key) {
        this.store.delete(key);
    }

    clear() {
        this.store.clear();
    }

}

module.exports = Cache;