export const modePresets = {
    exploracion: {
        pso: { w: 0.85, c1: 1.1, c2: 1.1 },
        firefly: { beta: 0.7, gamma: 0.2, alpha: 0.45 },
        ga: { elite: 0.18, mut: 0.5, cross: 0.7 },
        cuckoo: { pa: 0.35, step: 0.9 },
        aco: { rho: 0.3, alpha: 1.0, beta: 2.0 }
    },
    equilibrado: {
        pso: { w: 0.72, c1: 1.5, c2: 1.7 },
        firefly: { beta: 1.0, gamma: 0.35, alpha: 0.25 },
        ga: { elite: 0.25, mut: 0.25, cross: 0.6 },
        cuckoo: { pa: 0.25, step: 0.7 },
        aco: { rho: 0.35, alpha: 1.0, beta: 2.0 }
    },
    optimo: {
        pso: { w: 0.55, c1: 2.1, c2: 2.2 },
        firefly: { beta: 1.4, gamma: 0.45, alpha: 0.15 },
        ga: { elite: 0.32, mut: 0.18, cross: 0.65 },
        cuckoo: { pa: 0.18, step: 0.55 },
        aco: { rho: 0.4, alpha: 1.3, beta: 2.2 }
    }
};
