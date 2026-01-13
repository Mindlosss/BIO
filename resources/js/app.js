import './bootstrap';

const root = document.body;
const pageType = root && root.dataset.page;
const isSim = pageType === 'bio-sim';
const isCompare = pageType === 'bio-compare';
if (!isSim && !isCompare) {
    // Non-simulator pages should not initialize the demo.
} else {

const ui = {
    algo: document.getElementById('algo'),
    objective: document.getElementById('objective'),
    surfaceMode: document.getElementById('surfaceMode'),
    convergence: document.getElementById('convergence'),
    comparePso: document.getElementById('comparePso'),
    compareFirefly: document.getElementById('compareFirefly'),
    compareGa: document.getElementById('compareGa'),
    compareCuckoo: document.getElementById('compareCuckoo'),
    compareAco: document.getElementById('compareAco'),
    bounds: document.getElementById('bounds'),
    pop: document.getElementById('pop'),
    iterations: document.getElementById('iterations'),
    speed: document.getElementById('speed'),
    speedValue: document.getElementById('speedValue'),
    toggle: document.getElementById('toggle'),
    reset: document.getElementById('reset'),
    benchmark: document.getElementById('benchmark'),
    iter: document.getElementById('iter'),
    bestF: document.getElementById('bestF'),
    bestXY: document.getElementById('bestXY'),
    algoTag: document.getElementById('algoTag'),
    algoDesc: document.getElementById('algoDesc'),
    domainTag: document.getElementById('domainTag'),
    chartLegend: document.getElementById('chartLegend'),
    comparisonGrid: document.getElementById('comparisonGrid'),
    psoW: document.getElementById('psoW'),
    psoC1: document.getElementById('psoC1'),
    psoC2: document.getElementById('psoC2'),
    psoWValue: document.getElementById('psoWValue'),
    psoC1Value: document.getElementById('psoC1Value'),
    psoC2Value: document.getElementById('psoC2Value'),
    ffBeta: document.getElementById('ffBeta'),
    ffGamma: document.getElementById('ffGamma'),
    ffAlpha: document.getElementById('ffAlpha'),
    ffBetaValue: document.getElementById('ffBetaValue'),
    ffGammaValue: document.getElementById('ffGammaValue'),
    ffAlphaValue: document.getElementById('ffAlphaValue'),
    gaElite: document.getElementById('gaElite'),
    gaMut: document.getElementById('gaMut'),
    gaCross: document.getElementById('gaCross'),
    gaEliteValue: document.getElementById('gaEliteValue'),
    gaMutValue: document.getElementById('gaMutValue'),
    gaCrossValue: document.getElementById('gaCrossValue'),
    ckPa: document.getElementById('ckPa'),
    ckStep: document.getElementById('ckStep'),
    ckPaValue: document.getElementById('ckPaValue'),
    ckStepValue: document.getElementById('ckStepValue'),
    acoRho: document.getElementById('acoRho'),
    acoAlpha: document.getElementById('acoAlpha'),
    acoBeta: document.getElementById('acoBeta'),
    acoRhoValue: document.getElementById('acoRhoValue'),
    acoAlphaValue: document.getElementById('acoAlphaValue'),
    acoBetaValue: document.getElementById('acoBetaValue')
};

const canvases = isSim
    ? {
          view2d: document.getElementById('canvas2d'),
          view3d: document.getElementById('canvas3d'),
          chart: document.getElementById('canvasChart')
      }
    : { view2d: null, view3d: null, chart: null };

const ctx2d = canvases.view2d ? canvases.view2d.getContext('2d') : null;
const ctx3d = canvases.view3d ? canvases.view3d.getContext('2d') : null;
const ctxChart = canvases.chart ? canvases.chart.getContext('2d') : null;

const paramSections = Array.from(document.querySelectorAll('.param'));

const algoInfo = {
    pso: {
        tag: 'PSO',
        desc: 'Enjambre con memoria personal y global para converger al optimo.'
    },
    firefly: {
        tag: 'Firefly',
        desc: 'Luciernagas se atraen segun la intensidad; las mejores guian.'
    },
    ga: {
        tag: 'Genetic',
        desc: 'Seleccion, cruces y mutacion para refinar la poblacion.'
    },
    cuckoo: {
        tag: 'Cuckoo',
        desc: 'Busqueda con vuelos aleatorios y reemplazo probabilistico.'
    },
    aco: {
        tag: 'ACO',
        desc: 'Hormigas virtuales refuerzan caminos con feromonas hacia mejores soluciones.'
    }
};

const objectiveFns = {
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

const modePresets = {
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

const state = {
    bounds: Number(ui.bounds ? ui.bounds.value : 5),
    particles: [],
    best: null,
    iter: 0,
    history: [],
    running: false,
    algo: ui.algo ? ui.algo.value : 'pso',
    objective: ui.objective ? ui.objective.value : 'sphere',
    speed: Number(ui.speed ? ui.speed.value : 1)
};
let comparisonStates = null;
let comparisonRunning = false;
let comparisonRafId;
let comparisonStepBudget = 0;

function randRange(min, max) {
    return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function createParticle() {
    const x = randRange(-state.bounds, state.bounds);
    const y = randRange(-state.bounds, state.bounds);
    const f = objectiveFns[state.objective](x, y);
    return {
        x,
        y,
        vx: randRange(-1, 1),
        vy: randRange(-1, 1),
        bestX: x,
        bestY: y,
        bestF: f,
        f
    };
}

function resetSimulation() {
    state.bounds = Number(ui.bounds.value);
    stepBudget = 0;
    state.particles = Array.from({ length: Number(ui.pop.value) }, createParticle);
    state.best = null;
    state.iter = 0;
    state.history = [];
    stopComparison();
    updateBest();
    drawAll();
}

function updateBest() {
    state.particles.forEach((p) => {
        p.f = objectiveFns[state.objective](p.x, p.y);
        if (p.f < p.bestF) {
            p.bestF = p.f;
            p.bestX = p.x;
            p.bestY = p.y;
        }
        if (!state.best || p.f < state.best.f) {
            state.best = { x: p.x, y: p.y, f: p.f };
        }
    });
    state.history.push(state.best.f);
    if (state.history.length > 240) {
        state.history.shift();
    }
}

function stepPSO() {
    const moveScale = 0.15;
    const w = Number(ui.psoW.value);
    const c1 = Number(ui.psoC1.value);
    const c2 = Number(ui.psoC2.value);
    state.particles.forEach((p) => {
        const r1 = Math.random();
        const r2 = Math.random();
        const vx = w * p.vx + c1 * r1 * (p.bestX - p.x) + c2 * r2 * (state.best.x - p.x);
        const vy = w * p.vy + c1 * r1 * (p.bestY - p.y) + c2 * r2 * (state.best.y - p.y);
        p.vx = clamp(vx, -0.6, 0.6);
        p.vy = clamp(vy, -0.6, 0.6);
        p.x = clamp(p.x + p.vx * moveScale, -state.bounds, state.bounds);
        p.y = clamp(p.y + p.vy * moveScale, -state.bounds, state.bounds);
    });
}

function stepFirefly() {
    const beta0 = Number(ui.ffBeta.value);
    const gamma = Number(ui.ffGamma.value);
    const alpha = Number(ui.ffAlpha.value) * 0.35;
    for (let i = 0; i < state.particles.length; i += 1) {
        for (let j = 0; j < state.particles.length; j += 1) {
            const pi = state.particles[i];
            const pj = state.particles[j];
            if (pj.f < pi.f) {
                const dx = pj.x - pi.x;
                const dy = pj.y - pi.y;
                const distSq = dx * dx + dy * dy;
                const beta = beta0 * Math.exp(-gamma * distSq);
                pi.x += beta * dx * 0.35 + alpha * (Math.random() - 0.5);
                pi.y += beta * dy * 0.35 + alpha * (Math.random() - 0.5);
                pi.x = clamp(pi.x, -state.bounds, state.bounds);
                pi.y = clamp(pi.y, -state.bounds, state.bounds);
            }
        }
    }
}

function stepGA() {
    const eliteRate = Number(ui.gaElite.value);
    const mutation = Number(ui.gaMut.value);
    const crossover = Number(ui.gaCross.value);
    const scored = state.particles
        .map((p) => ({ p, f: objectiveFns[state.objective](p.x, p.y) }))
        .sort((a, b) => a.f - b.f);
    const eliteCount = Math.max(2, Math.floor(scored.length * eliteRate));
    const elites = scored.slice(0, eliteCount).map((item) => item.p);
    const next = [...elites];
    while (next.length < scored.length) {
        const a = elites[Math.floor(Math.random() * elites.length)];
        const b = elites[Math.floor(Math.random() * elites.length)];
        let x = a.x;
        let y = a.y;
        if (Math.random() < crossover) {
            const t = Math.random();
            x = a.x * t + b.x * (1 - t);
            y = a.y * t + b.y * (1 - t);
        }
        if (Math.random() < mutation) {
            x += randRange(-0.18, 0.18);
            y += randRange(-0.18, 0.18);
        }
        x = clamp(x, -state.bounds, state.bounds);
        y = clamp(y, -state.bounds, state.bounds);
        const f = objectiveFns[state.objective](x, y);
        next.push({
            x,
            y,
            vx: randRange(-1, 1),
            vy: randRange(-1, 1),
            bestX: x,
            bestY: y,
            bestF: f,
            f
        });
    }
    state.particles = next;
}

function stepCuckoo() {
    const pa = Number(ui.ckPa.value);
    const step = Number(ui.ckStep.value) * 0.35;
    state.particles.forEach((p) => {
        if (Math.random() < pa) {
            p.x = randRange(-state.bounds, state.bounds);
            p.y = randRange(-state.bounds, state.bounds);
            return;
        }
        const levyX = (Math.random() - 0.5) * step * 2;
        const levyY = (Math.random() - 0.5) * step * 2;
        p.x += levyX + 0.12 * (state.best.x - p.x);
        p.y += levyY + 0.12 * (state.best.y - p.y);
        p.x = clamp(p.x, -state.bounds, state.bounds);
        p.y = clamp(p.y, -state.bounds, state.bounds);
    });
}

function stepACO() {
    const rho = Number(ui.acoRho.value);
    const alpha = Number(ui.acoAlpha.value);
    const beta = Number(ui.acoBeta.value);
    const noise = 0.15;
    state.particles.forEach((p) => {
        const dx = state.best.x - p.x;
        const dy = state.best.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 1e-6;
        const desirability = Math.pow(1 / dist, beta);
        const pheromone = Math.pow(1 - rho, alpha);
        const step = 0.12 * pheromone * desirability;
        p.x = clamp(p.x + dx * step + noise * (Math.random() - 0.5), -state.bounds, state.bounds);
        p.y = clamp(p.y + dy * step + noise * (Math.random() - 0.5), -state.bounds, state.bounds);
    });
}

function stepSimulation() {
    const maxIters = Number(ui.iterations.value);
    if (state.iter >= maxIters) {
        state.running = false;
        ui.toggle.textContent = 'Start';
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
        return;
    }
    if (state.algo === 'pso') {
        stepPSO();
    } else if (state.algo === 'firefly') {
        stepFirefly();
    } else if (state.algo === 'ga') {
        stepGA();
    } else if (state.algo === 'cuckoo') {
        stepCuckoo();
    } else {
        stepACO();
    }
    updateBest();
    state.iter += 1;
}

function canvasSize(canvas) {
    return {
        w: canvas.__w || canvas.width,
        h: canvas.__h || canvas.height
    };
}

function toCanvasCoords(x, y, canvas, bounds) {
    const size = canvasSize(canvas);
    const pad = 20;
    const w = size.w - pad * 2;
    const h = size.h - pad * 2;
    const cx = pad + ((x + bounds) / (2 * bounds)) * w;
    const cy = pad + ((bounds - y) / (2 * bounds)) * h;
    return { cx, cy };
}

function drawGrid(ctx, canvas) {
    const size = canvasSize(canvas);
    ctx.clearRect(0, 0, size.w, size.h);
    ctx.strokeStyle = 'rgba(243, 239, 231, 0.08)';
    ctx.lineWidth = 1;
    const steps = 10;
    for (let i = 0; i <= steps; i += 1) {
        const t = i / steps;
        ctx.beginPath();
        ctx.moveTo(t * size.w, 0);
        ctx.lineTo(t * size.w, size.h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, t * size.h);
        ctx.lineTo(size.w, t * size.h);
        ctx.stroke();
    }
}

function draw2DState(simState, ctx, canvas) {
    if (!ctx || !canvas) {
        return;
    }
    drawGrid(ctx, canvas);
    simState.particles.forEach((p) => {
        const pos = toCanvasCoords(p.x, p.y, canvas, simState.bounds);
        const intensity = Math.min(1, p.f / (simState.best.f + 0.0001));
        ctx.fillStyle = `rgba(43, 209, 167, ${0.2 + 0.6 * (1 - intensity)})`;
        ctx.beginPath();
        ctx.arc(pos.cx, pos.cy, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    if (simState.best) {
        const bestPos = toCanvasCoords(simState.best.x, simState.best.y, canvas, simState.bounds);
        ctx.strokeStyle = 'rgba(255, 122, 26, 0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bestPos.cx - 8, bestPos.cy);
        ctx.lineTo(bestPos.cx + 8, bestPos.cy);
        ctx.moveTo(bestPos.cx, bestPos.cy - 8);
        ctx.lineTo(bestPos.cx, bestPos.cy + 8);
        ctx.stroke();
    }
}

function draw2D() {
    draw2DState(state, ctx2d, canvases.view2d);
}

function projectIso(x, y, z, centerX, centerY, scale, heightScale) {
    const isoX = (x - y) * scale + centerX;
    const isoY = (x + y) * scale * 0.5 + centerY - z * heightScale;
    return { isoX, isoY };
}

function draw3DState(simState, ctx, canvas) {
    if (!ctx || !canvas) {
        return;
    }
    const size = canvasSize(canvas);
    ctx.clearRect(0, 0, size.w, size.h);
    const gridSize = 14;
    const scale = Math.min(size.w, size.h) / 16;
    const centerX = size.w / 2;
    const centerY = size.h / 2 + 30;
    const maxZ = 18;
    const surfaceMode = ui.surfaceMode && ui.surfaceMode.checked ? 'popular' : 'smooth';
    let minF = Infinity;
    let maxF = -Infinity;
    for (let i = 0; i <= gridSize; i += 1) {
        for (let j = 0; j <= gridSize; j += 1) {
            const x = -simState.bounds + (2 * simState.bounds * i) / gridSize;
            const y = -simState.bounds + (2 * simState.bounds * j) / gridSize;
            const f = objectiveFns[simState.objective](x, y);
            minF = Math.min(minF, f);
            maxF = Math.max(maxF, f);
        }
    }
    const rangeF = maxF - minF || 1;
    const mapZ = (f) => {
        if (surfaceMode === 'smooth') {
            return (maxZ / (1 + f)) * 0.9;
        }
        const t = (f - minF) / rangeF;
        return maxZ * (1 - t) * 0.9;
    };
    ctx.strokeStyle = 'rgba(243, 239, 231, 0.16)';
    for (let i = 0; i <= gridSize; i += 1) {
        ctx.beginPath();
        for (let j = 0; j <= gridSize; j += 1) {
            const x = -simState.bounds + (2 * simState.bounds * i) / gridSize;
            const y = -simState.bounds + (2 * simState.bounds * j) / gridSize;
            const f = objectiveFns[simState.objective](x, y);
            const z = mapZ(f);
            const pt = projectIso(x, y, z, centerX, centerY, scale, 6);
            if (j === 0) {
                ctx.moveTo(pt.isoX, pt.isoY);
            } else {
                ctx.lineTo(pt.isoX, pt.isoY);
            }
        }
        ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255, 122, 26, 0.2)';
    for (let j = 0; j <= gridSize; j += 1) {
        ctx.beginPath();
        for (let i = 0; i <= gridSize; i += 1) {
            const x = -simState.bounds + (2 * simState.bounds * i) / gridSize;
            const y = -simState.bounds + (2 * simState.bounds * j) / gridSize;
            const f = objectiveFns[simState.objective](x, y);
            const z = mapZ(f);
            const pt = projectIso(x, y, z, centerX, centerY, scale, 6);
            if (i === 0) {
                ctx.moveTo(pt.isoX, pt.isoY);
            } else {
                ctx.lineTo(pt.isoX, pt.isoY);
            }
        }
        ctx.stroke();
    }

    simState.particles.forEach((p) => {
        const f = objectiveFns[simState.objective](p.x, p.y);
        const z = mapZ(f);
        const pt = projectIso(p.x, p.y, z, centerX, centerY, scale, 6);
        const intensity = Math.min(1, f / (simState.best.f + 0.0001));
        ctx.fillStyle = `rgba(43, 209, 167, ${0.25 + 0.7 * (1 - intensity)})`;
        ctx.beginPath();
        ctx.arc(pt.isoX, pt.isoY, 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

function draw3D() {
    draw3DState(state, ctx3d, canvases.view3d);
}

function drawChartWithValues(ctx, canvas, history, strokeColor) {
    if (!ctx || !canvas) {
        return;
    }
    const size = canvasSize(canvas);
    ctx.clearRect(0, 0, size.w, size.h);
    ctx.strokeStyle = 'rgba(243, 239, 231, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(32, 12);
    ctx.lineTo(32, size.h - 24);
    ctx.lineTo(size.w - 12, size.h - 24);
    ctx.stroke();

    if (history.length === 0) {
        return;
    }
    const maxVal = Math.max(...history);
    const minVal = Math.min(...history);
    const range = maxVal - minVal || 1;
    const ticks = 4;
    ctx.fillStyle = 'rgba(243, 239, 231, 0.6)';
    ctx.font = '11px "DM Mono", ui-monospace, monospace';
    for (let i = 0; i <= ticks; i += 1) {
        const t = i / ticks;
        const y = size.h - 24 - t * (size.h - 48);
        const value = (minVal + t * range).toFixed(2);
        ctx.fillText(value, 4, y + 4);
    }

    if (history.length > 1) {
        ctx.strokeStyle = strokeColor || 'rgba(255, 122, 26, 0.85)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        history.forEach((val, index) => {
            const x = 32 + (index / (history.length - 1)) * (size.w - 52);
            const y = size.h - 24 - ((val - minVal) / range) * (size.h - 48);
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
    }
}

function drawChart() {
    drawChartWithValues(ctxChart, canvases.chart, state.history, 'rgba(255, 122, 26, 0.85)');
}

function drawAll() {
    if (!isSim) {
        return;
    }
    draw2D();
    draw3D();
    drawChart();
    ui.iter.textContent = state.iter;
    if (state.best) {
        ui.bestF.textContent = state.best.f.toFixed(4);
        ui.bestXY.textContent = `${state.best.x.toFixed(2)}, ${state.best.y.toFixed(2)}`;
    }
}

function resizeCanvas(canvas) {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    canvas.__w = rect.width;
    canvas.__h = rect.height;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
}

function resizeAll() {
    Object.values(canvases)
        .filter(Boolean)
        .forEach(resizeCanvas);
    drawAll();
    resizeComparisonCanvases();
    drawComparisonViews();
}

function syncParamLabels() {
    if (ui.psoWValue && ui.psoW) ui.psoWValue.textContent = Number(ui.psoW.value).toFixed(2);
    if (ui.psoC1Value && ui.psoC1) ui.psoC1Value.textContent = Number(ui.psoC1.value).toFixed(2);
    if (ui.psoC2Value && ui.psoC2) ui.psoC2Value.textContent = Number(ui.psoC2.value).toFixed(2);
    if (ui.ffBetaValue && ui.ffBeta) ui.ffBetaValue.textContent = Number(ui.ffBeta.value).toFixed(2);
    if (ui.ffGammaValue && ui.ffGamma) ui.ffGammaValue.textContent = Number(ui.ffGamma.value).toFixed(2);
    if (ui.ffAlphaValue && ui.ffAlpha) ui.ffAlphaValue.textContent = Number(ui.ffAlpha.value).toFixed(2);
    if (ui.gaEliteValue && ui.gaElite) ui.gaEliteValue.textContent = Number(ui.gaElite.value).toFixed(2);
    if (ui.gaMutValue && ui.gaMut) ui.gaMutValue.textContent = Number(ui.gaMut.value).toFixed(2);
    if (ui.gaCrossValue && ui.gaCross) ui.gaCrossValue.textContent = Number(ui.gaCross.value).toFixed(2);
    if (ui.ckPaValue && ui.ckPa) ui.ckPaValue.textContent = Number(ui.ckPa.value).toFixed(2);
    if (ui.ckStepValue && ui.ckStep) ui.ckStepValue.textContent = Number(ui.ckStep.value).toFixed(2);
    if (ui.acoRhoValue && ui.acoRho) ui.acoRhoValue.textContent = Number(ui.acoRho.value).toFixed(2);
    if (ui.acoAlphaValue && ui.acoAlpha) ui.acoAlphaValue.textContent = Number(ui.acoAlpha.value).toFixed(2);
    if (ui.acoBetaValue && ui.acoBeta) ui.acoBetaValue.textContent = Number(ui.acoBeta.value).toFixed(2);
}

function setActiveParam(algo) {
    paramSections.forEach((section) => {
        const active = section.dataset.algo === algo;
        section.classList.toggle('active', active);
    });
}

function applyModePreset(mode) {
    const preset = modePresets[mode];
    if (!preset) {
        return;
    }
    const pso = preset.pso;
    if (ui.psoW) ui.psoW.value = pso.w;
    if (ui.psoC1) ui.psoC1.value = pso.c1;
    if (ui.psoC2) ui.psoC2.value = pso.c2;

    const ff = preset.firefly;
    if (ui.ffBeta) ui.ffBeta.value = ff.beta;
    if (ui.ffGamma) ui.ffGamma.value = ff.gamma;
    if (ui.ffAlpha) ui.ffAlpha.value = ff.alpha;

    const ga = preset.ga;
    if (ui.gaElite) ui.gaElite.value = ga.elite;
    if (ui.gaMut) ui.gaMut.value = ga.mut;
    if (ui.gaCross) ui.gaCross.value = ga.cross;

    const ck = preset.cuckoo;
    if (ui.ckPa) ui.ckPa.value = ck.pa;
    if (ui.ckStep) ui.ckStep.value = ck.step;
    const aco = preset.aco || modePresets.equilibrado.aco;
    if (ui.acoRho) ui.acoRho.value = aco.rho;
    if (ui.acoAlpha) ui.acoAlpha.value = aco.alpha;
    if (ui.acoBeta) ui.acoBeta.value = aco.beta;

    syncParamLabels();
}

function updateUI() {
    if (ui.speedValue) {
        ui.speedValue.textContent = `${Number(ui.speed.value)}x`;
    }
    if (ui.algoTag) {
        ui.algoTag.textContent = algoInfo[state.algo].tag;
    }
    if (ui.algoDesc) {
        ui.algoDesc.textContent = algoInfo[state.algo].desc;
    }
    if (ui.domainTag) {
        ui.domainTag.textContent = `Dominio: [-${state.bounds}, ${state.bounds}]`;
    }
    syncParamLabels();
    setActiveParam(state.algo);
}

function createBasePopulation(count) {
    return Array.from({ length: count }, () => {
        const x = randRange(-state.bounds, state.bounds);
        const y = randRange(-state.bounds, state.bounds);
        const f = objectiveFns[state.objective](x, y);
        return {
            x,
            y,
            vx: randRange(-1, 1),
            vy: randRange(-1, 1),
            bestX: x,
            bestY: y,
            bestF: f,
            f
        };
    });
}

function cloneParticles(baseParticles) {
    return baseParticles.map((p) => ({ ...p }));
}

function updateBestState(localState) {
    localState.particles.forEach((p) => {
        p.f = objectiveFns[localState.objective](p.x, p.y);
        if (p.f < p.bestF) {
            p.bestF = p.f;
            p.bestX = p.x;
            p.bestY = p.y;
        }
        if (!localState.best || p.f < localState.best.f) {
            localState.best = { x: p.x, y: p.y, f: p.f };
        }
    });
    localState.history.push(localState.best.f);
}

function drawBenchmarkChart(ctx, canvas, history, color) {
    const size = canvasSize(canvas);
    if (size.w === 0 || size.h === 0) {
        return;
    }
    drawChartWithValues(ctx, canvas, history, color);
}

function drawComparisonCharts() {
    if (!comparisonStates) {
        return;
    }
    const colors = comparisonColors();
    comparisonStates.forEach((entry) => {
        drawBenchmarkChart(entry.ctx.chart, entry.canvases.chart, entry.state.history, colors[entry.algo]);
    });
}

function drawComparisonViews() {
    if (!comparisonStates) {
        return;
    }
    const colors = comparisonColors();
    comparisonStates.forEach((entry) => {
        draw2DState(entry.state, entry.ctx.view2d, entry.canvases.view2d);
        draw3DState(entry.state, entry.ctx.view3d, entry.canvases.view3d);
        drawBenchmarkChart(entry.ctx.chart, entry.canvases.chart, entry.state.history, colors[entry.algo]);
        if (entry.stats) {
            entry.stats.iter.textContent = `Iter: ${entry.state.iter}`;
            if (entry.state.best) {
                entry.stats.bestF.textContent = `Best f: ${entry.state.best.f.toFixed(4)}`;
                entry.stats.bestXY.textContent = `Best x,y: ${entry.state.best.x.toFixed(2)}, ${entry.state.best.y.toFixed(2)}`;
            }
        }
    });
}

function setComparisonMode(active) {
    document.body.classList.toggle('comparison-mode', active);
    if (!active) {
        stopComparisonLoop();
        comparisonStates = null;
        if (ui.comparisonGrid) {
            ui.comparisonGrid.innerHTML = '';
        }
    }
    requestAnimationFrame(() => {
        resizeAll();
    });
}

function stepPSOState(localState, params) {
    const moveScale = 0.15;
    localState.particles.forEach((p) => {
        const r1 = Math.random();
        const r2 = Math.random();
        const vx =
            params.w * p.vx + params.c1 * r1 * (p.bestX - p.x) + params.c2 * r2 * (localState.best.x - p.x);
        const vy =
            params.w * p.vy + params.c1 * r1 * (p.bestY - p.y) + params.c2 * r2 * (localState.best.y - p.y);
        p.vx = clamp(vx, -0.6, 0.6);
        p.vy = clamp(vy, -0.6, 0.6);
        p.x = clamp(p.x + p.vx * moveScale, -localState.bounds, localState.bounds);
        p.y = clamp(p.y + p.vy * moveScale, -localState.bounds, localState.bounds);
    });
}

function stepFireflyState(localState, params) {
    for (let i = 0; i < localState.particles.length; i += 1) {
        for (let j = 0; j < localState.particles.length; j += 1) {
            const pi = localState.particles[i];
            const pj = localState.particles[j];
            if (pj.f < pi.f) {
                const dx = pj.x - pi.x;
                const dy = pj.y - pi.y;
                const distSq = dx * dx + dy * dy;
                const beta = params.beta * Math.exp(-params.gamma * distSq);
                pi.x += beta * dx * 0.35 + params.alpha * 0.35 * (Math.random() - 0.5);
                pi.y += beta * dy * 0.35 + params.alpha * 0.35 * (Math.random() - 0.5);
                pi.x = clamp(pi.x, -localState.bounds, localState.bounds);
                pi.y = clamp(pi.y, -localState.bounds, localState.bounds);
            }
        }
    }
}

function stepGAState(localState, params) {
    const scored = localState.particles
        .map((p) => ({ p, f: objectiveFns[localState.objective](p.x, p.y) }))
        .sort((a, b) => a.f - b.f);
    const eliteCount = Math.max(2, Math.floor(scored.length * params.elite));
    const elites = scored.slice(0, eliteCount).map((item) => item.p);
    const next = [...elites];
    while (next.length < scored.length) {
        const a = elites[Math.floor(Math.random() * elites.length)];
        const b = elites[Math.floor(Math.random() * elites.length)];
        let x = a.x;
        let y = a.y;
        if (Math.random() < params.cross) {
            const t = Math.random();
            x = a.x * t + b.x * (1 - t);
            y = a.y * t + b.y * (1 - t);
        }
        if (Math.random() < params.mut) {
            x += randRange(-0.18, 0.18);
            y += randRange(-0.18, 0.18);
        }
        x = clamp(x, -localState.bounds, localState.bounds);
        y = clamp(y, -localState.bounds, localState.bounds);
        const f = objectiveFns[localState.objective](x, y);
        next.push({
            x,
            y,
            vx: randRange(-1, 1),
            vy: randRange(-1, 1),
            bestX: x,
            bestY: y,
            bestF: f,
            f
        });
    }
    localState.particles = next;
}

function stepCuckooState(localState, params) {
    localState.particles.forEach((p) => {
        if (Math.random() < params.pa) {
            p.x = randRange(-localState.bounds, localState.bounds);
            p.y = randRange(-localState.bounds, localState.bounds);
            return;
        }
        const levyX = (Math.random() - 0.5) * params.step * 0.7;
        const levyY = (Math.random() - 0.5) * params.step * 0.7;
        p.x += levyX + 0.12 * (localState.best.x - p.x);
        p.y += levyY + 0.12 * (localState.best.y - p.y);
        p.x = clamp(p.x, -localState.bounds, localState.bounds);
        p.y = clamp(p.y, -localState.bounds, localState.bounds);
    });
}

function stepACOState(localState, params) {
    const rho = params.rho;
    const alpha = params.alpha;
    const beta = params.beta;
    const noise = 0.15;
    localState.particles.forEach((p) => {
        const dx = localState.best.x - p.x;
        const dy = localState.best.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 1e-6;
        const desirability = Math.pow(1 / dist, beta);
        const pheromone = Math.pow(1 - rho, alpha);
        const step = 0.12 * pheromone * desirability;
        p.x = clamp(p.x + dx * step + noise * (Math.random() - 0.5), -localState.bounds, localState.bounds);
        p.y = clamp(p.y + dy * step + noise * (Math.random() - 0.5), -localState.bounds, localState.bounds);
    });
}

function comparisonColors() {
    return {
        pso: '#ff7a1a',
        firefly: '#2bd1a7',
        ga: '#8dd3ff',
        cuckoo: '#f3d06b',
        aco: '#b38bff'
    };
}

function getPresetForMode(mode) {
    return modePresets[mode] || modePresets.equilibrado;
}

function getSelectedAlgorithms() {
    const selected = [];
    if (ui.comparePso && ui.comparePso.checked) selected.push('pso');
    if (ui.compareFirefly && ui.compareFirefly.checked) selected.push('firefly');
    if (ui.compareGa && ui.compareGa.checked) selected.push('ga');
    if (ui.compareCuckoo && ui.compareCuckoo.checked) selected.push('cuckoo');
    if (ui.compareAco && ui.compareAco.checked) selected.push('aco');
    return selected;
}

function createComparisonCards(algos) {
    if (!ui.comparisonGrid) {
        return [];
    }
    ui.comparisonGrid.innerHTML = '';
    const preset = getPresetForMode(ui.convergence ? ui.convergence.value : 'equilibrado');
    return algos.map((algo) => {
        const card = document.createElement('div');
        card.className = 'comparison-card';
        const titleRow = document.createElement('div');
        titleRow.className = 'comparison-title-row';
        const title = document.createElement('div');
        title.className = 'comparison-title';
        title.textContent = algoInfo[algo].tag;
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'config-toggle';
        toggle.textContent = 'v';
        toggle.setAttribute('aria-expanded', 'false');
        titleRow.appendChild(title);
        titleRow.appendChild(toggle);

        const config = document.createElement('div');
        config.className = 'comparison-config';
        const configInputs = { inputs: {}, values: {} };

        const addRange = (key, label, min, max, step, value) => {
            const row = document.createElement('div');
            row.className = 'param-row';
            const labelSpan = document.createElement('span');
            labelSpan.textContent = label;
            const valueSpan = document.createElement('span');
            valueSpan.textContent = Number(value).toFixed(2);
            row.appendChild(labelSpan);
            row.appendChild(valueSpan);

            const input = document.createElement('input');
            input.type = 'range';
            input.min = min;
            input.max = max;
            input.step = step;
            input.value = value;

            config.appendChild(row);
            config.appendChild(input);
            configInputs.inputs[key] = input;
            configInputs.values[key] = valueSpan;
        };

        if (algo === 'pso') {
            addRange('w', 'Inercia w', 0.3, 0.95, 0.01, preset.pso.w);
            addRange('c1', 'c1', 0.5, 3, 0.05, preset.pso.c1);
            addRange('c2', 'c2', 0.5, 3, 0.05, preset.pso.c2);
        } else if (algo === 'firefly') {
            addRange('beta', 'Beta0', 0.2, 2, 0.05, preset.firefly.beta);
            addRange('gamma', 'Gamma', 0.05, 1, 0.05, preset.firefly.gamma);
            addRange('alpha', 'Alpha', 0, 0.8, 0.05, preset.firefly.alpha);
        } else if (algo === 'ga') {
            addRange('elite', 'Elite rate', 0.1, 0.5, 0.02, preset.ga.elite);
            addRange('mut', 'Mutation', 0, 0.8, 0.05, preset.ga.mut);
            addRange('cross', 'Crossover', 0, 1, 0.05, preset.ga.cross);
        } else if (algo === 'cuckoo') {
            addRange('pa', 'Pa', 0.05, 0.6, 0.05, preset.cuckoo.pa);
            addRange('step', 'Step', 0.1, 1.2, 0.05, preset.cuckoo.step);
        } else {
            addRange('rho', 'Evap rho', 0.05, 0.8, 0.05, preset.aco.rho);
            addRange('alpha', 'Alpha', 0.2, 2.5, 0.1, preset.aco.alpha);
            addRange('beta', 'Beta', 0.5, 4, 0.1, preset.aco.beta);
        }

        toggle.addEventListener('click', () => {
            const isOpen = config.classList.toggle('is-open');
            toggle.classList.toggle('is-open', isOpen);
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            resizeComparisonCanvases();
            drawComparisonViews();
        });

        const label2d = document.createElement('div');
        label2d.className = 'comparison-label';
        label2d.textContent = 'Vista 2D';
        const canvas2d = document.createElement('canvas');
        canvas2d.className = 'comparison-canvas';
        const label3d = document.createElement('div');
        label3d.className = 'comparison-label';
        label3d.textContent = 'Vista 3D';
        const canvas3d = document.createElement('canvas');
        canvas3d.className = 'comparison-canvas';
        const labelChart = document.createElement('div');
        labelChart.className = 'comparison-label';
        labelChart.textContent = 'Convergencia';
        const canvasChart = document.createElement('canvas');
        canvasChart.className = 'comparison-chart';
        const stats = document.createElement('div');
        stats.className = 'comparison-stats';
        const iter = document.createElement('div');
        iter.textContent = 'Iter: 0';
        const bestF = document.createElement('div');
        bestF.textContent = 'Best f: -';
        const bestXY = document.createElement('div');
        bestXY.textContent = 'Best x,y: -';
        stats.appendChild(iter);
        stats.appendChild(bestF);
        stats.appendChild(bestXY);

        card.appendChild(titleRow);
        card.appendChild(config);
        card.appendChild(label2d);
        card.appendChild(canvas2d);
        card.appendChild(label3d);
        card.appendChild(canvas3d);
        card.appendChild(labelChart);
        card.appendChild(canvasChart);
        card.appendChild(stats);
        ui.comparisonGrid.appendChild(card);

        return {
            algo,
            configInputs,
            canvases: { view2d: canvas2d, view3d: canvas3d, chart: canvasChart },
            ctx: {
                view2d: canvas2d.getContext('2d'),
                view3d: canvas3d.getContext('2d'),
                chart: canvasChart.getContext('2d')
            },
            stats: {
                iter,
                bestF,
                bestXY
            }
        };
    });
}

function resizeComparisonCanvases() {
    if (!comparisonStates) {
        return;
    }
    comparisonStates.forEach((entry) => {
        resizeCanvas(entry.canvases.view2d);
        resizeCanvas(entry.canvases.view3d);
        resizeCanvas(entry.canvases.chart);
    });
}

function readParamsFromInputs(algo, configInputs) {
    const inputs = configInputs.inputs;
    if (algo === 'pso') {
        return {
            w: Number(inputs.w.value),
            c1: Number(inputs.c1.value),
            c2: Number(inputs.c2.value)
        };
    }
    if (algo === 'firefly') {
        return {
            beta: Number(inputs.beta.value),
            gamma: Number(inputs.gamma.value),
            alpha: Number(inputs.alpha.value)
        };
    }
    if (algo === 'ga') {
        return {
            elite: Number(inputs.elite.value),
            mut: Number(inputs.mut.value),
            cross: Number(inputs.cross.value)
        };
    }
    if (algo === 'cuckoo') {
        return {
            pa: Number(inputs.pa.value),
            step: Number(inputs.step.value)
        };
    }
    return {
        rho: Number(inputs.rho.value),
        alpha: Number(inputs.alpha.value),
        beta: Number(inputs.beta.value)
    };
}

function updateConfigValueLabels(configInputs) {
    Object.entries(configInputs.inputs).forEach(([key, input]) => {
        const label = configInputs.values[key];
        if (!label) {
            return;
        }
        label.textContent = Number(input.value).toFixed(2);
    });
}

function getAlgoParams() {
    const preset = getPresetForMode(ui.convergence ? ui.convergence.value : 'equilibrado');
    return {
        pso: {
            w: ui.psoW ? Number(ui.psoW.value) : preset.pso.w,
            c1: ui.psoC1 ? Number(ui.psoC1.value) : preset.pso.c1,
            c2: ui.psoC2 ? Number(ui.psoC2.value) : preset.pso.c2
        },
        firefly: {
            beta: ui.ffBeta ? Number(ui.ffBeta.value) : preset.firefly.beta,
            gamma: ui.ffGamma ? Number(ui.ffGamma.value) : preset.firefly.gamma,
            alpha: ui.ffAlpha ? Number(ui.ffAlpha.value) : preset.firefly.alpha
        },
        ga: {
            elite: ui.gaElite ? Number(ui.gaElite.value) : preset.ga.elite,
            mut: ui.gaMut ? Number(ui.gaMut.value) : preset.ga.mut,
            cross: ui.gaCross ? Number(ui.gaCross.value) : preset.ga.cross
        },
        cuckoo: {
            pa: ui.ckPa ? Number(ui.ckPa.value) : preset.cuckoo.pa,
            step: ui.ckStep ? Number(ui.ckStep.value) : preset.cuckoo.step
        },
        aco: {
            rho: ui.acoRho ? Number(ui.acoRho.value) : preset.aco.rho,
            alpha: ui.acoAlpha ? Number(ui.acoAlpha.value) : preset.aco.alpha,
            beta: ui.acoBeta ? Number(ui.acoBeta.value) : preset.aco.beta
        }
    };
}

function buildComparisonStates() {
    state.bounds = Number(ui.bounds.value);
    const iterations = Number(ui.iterations.value);
    const algos = getSelectedAlgorithms();
    if (algos.length === 0) {
        if (ui.comparisonGrid) {
            ui.comparisonGrid.innerHTML = '';
        }
        return;
    }
    const base = createBasePopulation(Number(ui.pop.value));
    const params = getAlgoParams();
    const cards = createComparisonCards(algos);

    comparisonStates = cards.map((card) => {
        const localState = {
            algo: card.algo,
            bounds: state.bounds,
            objective: state.objective,
            particles: cloneParticles(base),
            best: null,
            history: [],
            iter: 0
        };
        updateBestState(localState);
        return {
            algo: card.algo,
            state: localState,
            params: params[card.algo],
            canvases: card.canvases,
            ctx: card.ctx,
            configInputs: card.configInputs,
            stats: card.stats
        };
    });

    comparisonStates.forEach((entry) => {
        if (!entry.configInputs) {
            return;
        }
        updateConfigValueLabels(entry.configInputs);
        entry.params = readParamsFromInputs(entry.algo, entry.configInputs);
        Object.values(entry.configInputs.inputs).forEach((input) => {
            input.addEventListener('input', () => {
                updateConfigValueLabels(entry.configInputs);
                entry.params = readParamsFromInputs(entry.algo, entry.configInputs);
            });
        });
    });

    setComparisonMode(true);
    resizeComparisonCanvases();
    drawComparisonViews();
    return iterations;
}

function startComparisonLoop() {
    const iterations = Number(ui.iterations.value);
    if (!comparisonStates || comparisonRunning) {
        return;
    }
    comparisonRunning = true;
    if (ui.benchmark) {
        ui.benchmark.textContent = 'Pausar';
    }
    comparisonStepBudget = 0;

    const stepOnce = () => {
        comparisonStates.forEach((entry) => {
            if (entry.state.iter >= iterations) {
                return;
            }
            if (entry.algo === 'pso') {
                stepPSOState(entry.state, entry.params);
            } else if (entry.algo === 'firefly') {
                stepFireflyState(entry.state, entry.params);
            } else if (entry.algo === 'ga') {
                stepGAState(entry.state, entry.params);
            } else if (entry.algo === 'cuckoo') {
                stepCuckooState(entry.state, entry.params);
            } else {
                stepACOState(entry.state, entry.params);
            }
            updateBestState(entry.state);
            entry.state.iter += 1;
        });
    };

    const drawComparison = () => {
        drawComparisonViews();
    };

    const loopComparison = () => {
        if (!comparisonRunning) {
            return;
        }
        comparisonStepBudget += state.speed;
        const steps = Math.floor(comparisonStepBudget);
        for (let i = 0; i < steps; i += 1) {
            stepOnce();
        }
        comparisonStepBudget -= steps;
        drawComparison();

        const finished = comparisonStates.every((entry) => entry.state.iter >= iterations);
        if (finished) {
            comparisonRunning = false;
            return;
        }
        comparisonRafId = requestAnimationFrame(loopComparison);
    };

    loopComparison();
}

function applyPresetToComparisonCards(mode) {
    if (!comparisonStates) {
        return;
    }
    const preset = getPresetForMode(mode);
    comparisonStates.forEach((entry) => {
        const inputs = entry.configInputs?.inputs;
        if (!inputs) {
            return;
        }
        if (entry.algo === 'pso') {
            inputs.w.value = preset.pso.w;
            inputs.c1.value = preset.pso.c1;
            inputs.c2.value = preset.pso.c2;
        } else if (entry.algo === 'firefly') {
            inputs.beta.value = preset.firefly.beta;
            inputs.gamma.value = preset.firefly.gamma;
            inputs.alpha.value = preset.firefly.alpha;
        } else if (entry.algo === 'ga') {
            inputs.elite.value = preset.ga.elite;
            inputs.mut.value = preset.ga.mut;
            inputs.cross.value = preset.ga.cross;
        } else if (entry.algo === 'cuckoo') {
            inputs.pa.value = preset.cuckoo.pa;
            inputs.step.value = preset.cuckoo.step;
        } else {
            inputs.rho.value = preset.aco.rho;
            inputs.alpha.value = preset.aco.alpha;
            inputs.beta.value = preset.aco.beta;
        }
        updateConfigValueLabels(entry.configInputs);
        entry.params = readParamsFromInputs(entry.algo, entry.configInputs);
    });
    drawComparisonViews();
}

function stopComparisonLoop() {
    comparisonRunning = false;
    if (ui.benchmark) {
        ui.benchmark.textContent = 'Iniciar';
    }
    if (comparisonRafId) {
        cancelAnimationFrame(comparisonRafId);
    }
}

function stopComparison() {
    stopComparisonLoop();
    setComparisonMode(false);
}

let rafId;
let stepBudget = 0;
function loop() {
    if (!state.running) {
        return;
    }
    stepBudget += state.speed;
    const steps = Math.floor(stepBudget);
    for (let i = 0; i < steps; i += 1) {
        stepSimulation();
    }
    stepBudget -= steps;
    drawAll();
    rafId = requestAnimationFrame(loop);
}

if (ui.toggle) {
    ui.toggle.addEventListener('click', () => {
        if (!isSim) {
            return;
        }
        state.running = !state.running;
        ui.toggle.textContent = state.running ? 'Pause' : 'Start';
        if (state.running) {
            stopComparison();
            loop();
        } else if (rafId) {
            cancelAnimationFrame(rafId);
        }
    });
}

if (ui.reset) {
    ui.reset.addEventListener('click', () => {
        if (isSim) {
            state.running = false;
            if (ui.toggle) {
                ui.toggle.textContent = 'Start';
            }
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            stopComparison();
            resetSimulation();
            return;
        }
        stopComparisonLoop();
        buildComparisonStates();
    });
}

if (ui.benchmark) {
    ui.benchmark.addEventListener('click', () => {
        if (isSim) {
            return;
        }
        if (comparisonRunning) {
            stopComparisonLoop();
            return;
        }
        if (!comparisonStates || comparisonStates.length === 0) {
            buildComparisonStates();
        }
        startComparisonLoop();
    });
}

if (ui.algo) {
    ui.algo.addEventListener('change', () => {
        state.algo = ui.algo.value;
        updateUI();
        if (isSim) {
            resetSimulation();
        } else {
            stopComparison();
        }
    });
}

ui.objective.addEventListener('change', () => {
    state.objective = ui.objective.value;
    if (isSim) {
        resetSimulation();
    } else {
        stopComparisonLoop();
        buildComparisonStates();
    }
});

ui.convergence.addEventListener('change', () => {
    applyModePreset(ui.convergence.value);
    if (isSim) {
        resetSimulation();
    } else {
        stopComparisonLoop();
        buildComparisonStates();
        applyPresetToComparisonCards(ui.convergence.value);
    }
});

ui.bounds.addEventListener('change', () => {
    if (isSim) {
        resetSimulation();
        updateUI();
    } else {
        stopComparisonLoop();
        buildComparisonStates();
        updateUI();
    }
});

ui.pop.addEventListener('change', () => {
    if (isSim) {
        resetSimulation();
    } else {
        stopComparisonLoop();
        buildComparisonStates();
    }
});

ui.iterations.addEventListener('change', () => {
    if (isSim) {
        resetSimulation();
    } else {
        stopComparisonLoop();
        buildComparisonStates();
    }
});

ui.speed.addEventListener('input', () => {
    state.speed = Number(ui.speed.value);
    updateUI();
});

if (ui.surfaceMode) {
    ui.surfaceMode.addEventListener('change', () => {
        if (isSim) {
            drawAll();
        } else {
            drawComparisonViews();
        }
    });
}

if (!isSim && ui.comparePso) {
    [ui.comparePso, ui.compareFirefly, ui.compareGa, ui.compareCuckoo, ui.compareAco].forEach((input) => {
        if (!input) {
            return;
        }
        input.addEventListener('change', () => {
            stopComparisonLoop();
            buildComparisonStates();
        });
    });
}

[ui.psoW, ui.psoC1, ui.psoC2, ui.ffBeta, ui.ffGamma, ui.ffAlpha, ui.gaElite, ui.gaMut, ui.gaCross, ui.ckPa, ui.ckStep]
    .filter(Boolean)
    .forEach((input) => {
        input.addEventListener('input', () => {
            syncParamLabels();
        });
    });

window.addEventListener('resize', resizeAll);

applyModePreset(ui.convergence.value);
updateUI();
resizeAll();
if (isSim) {
    resetSimulation();
} else {
    setComparisonMode(true);
    buildComparisonStates();
    stopComparisonLoop();
}
}
