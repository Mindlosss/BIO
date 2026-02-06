export const randRange = (min, max, rng = Math.random) => min + rng() * (max - min);

export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const normalizeSeed = (seed) => {
    const value = Number.parseInt(seed, 10);
    if (Number.isNaN(value)) {
        return Math.floor(Math.random() * 2 ** 31);
    }
    return value >>> 0;
};

export const createSeededRng = (seed) => {
    let t = normalizeSeed(seed);
    return () => {
        t += 0x6d2b79f5;
        let x = t;
        x = Math.imul(x ^ (x >>> 15), x | 1);
        x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
};
