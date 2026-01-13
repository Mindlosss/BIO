import { objectiveFns } from './objectives';
import { modePresets } from './modePresets';
import { clamp, randRange } from './utils';
import { draw2DState, draw3DState, drawChartWithValues, resizeCanvas } from './render';
import { createComparisonManager } from './comparison';

export function initSimulator({ root, isSim, isCompare }) {
    if (!root) {
        return;
    }

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

    const comparison = createComparisonManager({
        ui,
        state,
        objectiveFns,
        modePresets,
        draw2DState,
        draw3DState,
        drawChartWithValues,
        resizeCanvas,
        clamp,
        randRange,
        algoInfo
    });

    const sim3dUrl = root && root.dataset ? root.dataset.sim3dUrl : null;
    const open3dButtons = Array.from(document.querySelectorAll('[data-open-3d]'));
    const open3dWindow = () => {
        if (!sim3dUrl) {
            return;
        }
        const params = new URLSearchParams({
            algo: state.algo,
            objective: ui.objective ? ui.objective.value : state.objective,
            bounds: ui.bounds ? ui.bounds.value : state.bounds,
            pop: ui.pop ? ui.pop.value : state.particles.length,
            speed: ui.speed ? ui.speed.value : state.speed,
            iterations: ui.iterations ? ui.iterations.value : 100
        });

        if (state.algo === 'pso') {
            params.set('psoW', ui.psoW ? ui.psoW.value : 0.72);
            params.set('psoC1', ui.psoC1 ? ui.psoC1.value : 1.5);
            params.set('psoC2', ui.psoC2 ? ui.psoC2.value : 1.7);
        } else if (state.algo === 'firefly') {
            params.set('ffBeta', ui.ffBeta ? ui.ffBeta.value : 1.0);
            params.set('ffGamma', ui.ffGamma ? ui.ffGamma.value : 0.35);
            params.set('ffAlpha', ui.ffAlpha ? ui.ffAlpha.value : 0.25);
        } else if (state.algo === 'ga') {
            params.set('gaElite', ui.gaElite ? ui.gaElite.value : 0.25);
            params.set('gaMut', ui.gaMut ? ui.gaMut.value : 0.25);
            params.set('gaCross', ui.gaCross ? ui.gaCross.value : 0.6);
        } else if (state.algo === 'cuckoo') {
            params.set('ckPa', ui.ckPa ? ui.ckPa.value : 0.25);
            params.set('ckStep', ui.ckStep ? ui.ckStep.value : 0.7);
        } else {
            params.set('acoRho', ui.acoRho ? ui.acoRho.value : 0.35);
            params.set('acoAlpha', ui.acoAlpha ? ui.acoAlpha.value : 1.0);
            params.set('acoBeta', ui.acoBeta ? ui.acoBeta.value : 2.0);
        }

        window.open(`${sim3dUrl}?${params.toString()}`, '_blank', 'noopener');
    };

    open3dButtons.forEach((button) => {
        button.addEventListener('click', open3dWindow);
    });

    let rafId;
    let stepBudget = 0;

    const createParticle = () => {
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
    };

    const resetSimulation = () => {
        state.bounds = Number(ui.bounds ? ui.bounds.value : state.bounds);
        stepBudget = 0;
        const popValue = ui.pop ? Number(ui.pop.value) : state.particles.length || 24;
        state.particles = Array.from({ length: popValue }, createParticle);
        state.best = null;
        state.iter = 0;
        state.history = [];
        comparison.stopComparison();
        updateBest();
        drawAll();
    };

    const updateBest = () => {
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
        if (state.best) {
            state.history.push(state.best.f);
        }
        if (state.history.length > 240) {
            state.history.shift();
        }
    };

    const stepPSO = () => {
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
    };

    const stepFirefly = () => {
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
    };

    const stepGA = () => {
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
    };

    const stepCuckoo = () => {
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
    };

    const stepACO = () => {
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
    };

    const stepSimulation = () => {
        const maxIters = Number(ui.iterations ? ui.iterations.value : 100);
        if (state.iter >= maxIters) {
            state.running = false;
            if (ui.toggle) {
                ui.toggle.textContent = 'Start';
            }
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
    };

    const draw2D = () => {
        draw2DState(state, ctx2d, canvases.view2d);
    };

    const draw3D = () => {
        const surfaceMode = ui.surfaceMode && ui.surfaceMode.checked ? 'popular' : 'smooth';
        draw3DState(state, ctx3d, canvases.view3d, objectiveFns, surfaceMode);
    };

    const drawChart = () => {
        drawChartWithValues(ctxChart, canvases.chart, state.history, 'rgba(255, 122, 26, 0.85)');
    };

    const drawAll = () => {
        if (!isSim) {
            return;
        }
        draw2D();
        draw3D();
        drawChart();
        if (ui.iter) {
            ui.iter.textContent = state.iter;
        }
        if (state.best) {
            if (ui.bestF) {
                ui.bestF.textContent = state.best.f.toFixed(4);
            }
            if (ui.bestXY) {
                ui.bestXY.textContent = `${state.best.x.toFixed(2)}, ${state.best.y.toFixed(2)}`;
            }
        }
    };

    const resizeAll = () => {
        Object.values(canvases)
            .filter(Boolean)
            .forEach(resizeCanvas);
        drawAll();
        if (isCompare) {
            comparison.resizeComparisonCanvases();
            comparison.drawComparisonViews();
        }
    };

    const syncParamLabels = () => {
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
    };

    const setActiveParam = (algo) => {
        paramSections.forEach((section) => {
            const active = section.dataset.algo === algo;
            section.classList.toggle('active', active);
            section.classList.toggle('hidden', !active);
        });
    };

    const applyModePreset = (mode) => {
        const preset = modePresets[mode] || modePresets.equilibrado;
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
    };

    const updateUI = () => {
        if (ui.speedValue && ui.speed) {
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
    };

    const loop = () => {
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
    };

    if (ui.toggle) {
        ui.toggle.addEventListener('click', () => {
            if (!isSim) {
                return;
            }
            state.running = !state.running;
            ui.toggle.textContent = state.running ? 'Pause' : 'Start';
            if (state.running) {
                comparison.stopComparison();
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
                comparison.stopComparison();
                resetSimulation();
                return;
            }
            comparison.stopComparisonLoop();
            comparison.buildComparisonStates();
        });
    }

    if (ui.benchmark) {
        ui.benchmark.addEventListener('click', () => {
            if (isSim) {
                return;
            }
            if (ui.benchmark.textContent === 'Pausar') {
                comparison.stopComparisonLoop();
                return;
            }
            if (!ui.comparisonGrid || ui.comparisonGrid.children.length === 0) {
                comparison.buildComparisonStates();
            }
            comparison.startComparisonLoop();
        });
    }

    if (ui.algo) {
        ui.algo.addEventListener('change', () => {
            state.algo = ui.algo.value;
            updateUI();
            if (isSim) {
                resetSimulation();
            } else {
                comparison.stopComparison();
            }
        });
    }

    if (ui.objective) {
        ui.objective.addEventListener('change', () => {
            state.objective = ui.objective.value;
            if (isSim) {
                resetSimulation();
            } else {
                comparison.stopComparisonLoop();
                comparison.buildComparisonStates();
            }
        });
    }

    if (ui.convergence) {
        ui.convergence.addEventListener('change', () => {
            applyModePreset(ui.convergence.value);
            if (isSim) {
                resetSimulation();
            } else {
                comparison.stopComparisonLoop();
                comparison.buildComparisonStates();
                comparison.applyPresetToComparisonCards(ui.convergence.value);
            }
        });
    }

    if (ui.bounds) {
        ui.bounds.addEventListener('change', () => {
            if (isSim) {
                resetSimulation();
                updateUI();
            } else {
                comparison.stopComparisonLoop();
                comparison.buildComparisonStates();
                updateUI();
            }
        });
    }

    if (ui.pop) {
        ui.pop.addEventListener('change', () => {
            if (isSim) {
                resetSimulation();
            } else {
                comparison.stopComparisonLoop();
                comparison.buildComparisonStates();
            }
        });
    }

    if (ui.iterations) {
        ui.iterations.addEventListener('change', () => {
            if (isSim) {
                resetSimulation();
            } else {
                comparison.stopComparisonLoop();
                comparison.buildComparisonStates();
            }
        });
    }

    if (ui.speed) {
        ui.speed.addEventListener('input', () => {
            state.speed = Number(ui.speed.value);
            updateUI();
        });
    }

    if (ui.surfaceMode) {
        ui.surfaceMode.addEventListener('change', () => {
            if (isSim) {
                drawAll();
            } else {
                comparison.drawComparisonViews();
            }
        });
    }

    if (isCompare && ui.comparePso) {
        [ui.comparePso, ui.compareFirefly, ui.compareGa, ui.compareCuckoo, ui.compareAco].forEach((input) => {
            if (!input) {
                return;
            }
            input.addEventListener('change', () => {
                comparison.stopComparisonLoop();
                comparison.buildComparisonStates();
            });
        });
    }

    [
        ui.psoW,
        ui.psoC1,
        ui.psoC2,
        ui.ffBeta,
        ui.ffGamma,
        ui.ffAlpha,
        ui.gaElite,
        ui.gaMut,
        ui.gaCross,
        ui.ckPa,
        ui.ckStep
    ]
        .filter(Boolean)
        .forEach((input) => {
            input.addEventListener('input', () => {
                syncParamLabels();
            });
        });

    window.addEventListener('resize', resizeAll);

    const initialMode = ui.convergence ? ui.convergence.value : 'equilibrado';
    applyModePreset(initialMode);
    updateUI();
    resizeAll();
    if (isSim) {
        resetSimulation();
    } else if (isCompare) {
        comparison.buildComparisonStates();
        comparison.stopComparisonLoop();
    }
}

