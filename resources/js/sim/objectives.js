export const objectiveFns = {
    sphere: (x, y) => x * x + y * y,
    rastrigin: (x, y) =>
        20 + (x * x - 10 * Math.cos(2 * Math.PI * x)) + (y * y - 10 * Math.cos(2 * Math.PI * y)),
    rosenbrock: (x, y) => (1 - x) * (1 - x) + 100 * (y - x * x) * (y - x * x),
    ackley: (x, y) => {
        const a = 20;
        const b = 0.2;
        const c = 2 * Math.PI;
        const sumSq = 0.5 * (x * x + y * y);
        const sumCos = 0.5 * (Math.cos(c * x) + Math.cos(c * y));
        return -a * Math.exp(-b * Math.sqrt(sumSq)) - Math.exp(sumCos) + a + Math.E;
    },
    griewank: (x, y) => {
        const sum = (x * x + y * y) / 4000;
        const prod = Math.cos(x) * Math.cos(y / Math.sqrt(2));
        return sum - prod + 1;
    },
    styblinski: (x, y) => {
        const f = (v) => 0.5 * (Math.pow(v, 4) - 16 * v * v + 5 * v);
        return f(x) + f(y);
    },
    schwefel: (x, y) => {
        const f = (v) => -v * Math.sin(Math.sqrt(Math.abs(v)));
        return 418.9829 * 2 - (f(x) + f(y));
    }
};
