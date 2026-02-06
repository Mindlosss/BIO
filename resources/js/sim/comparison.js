export function createComparisonManager({
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
}) {
    let comparisonStates = null;
    let comparisonRunning = false;
    let comparisonRafId;
    let comparisonStepBudget = 0;

    const comparisonColors = () => ({
        pso: '#2bd1a7',
        firefly: '#2bd1a7',
        ga: '#2bd1a7',
        cuckoo: '#2bd1a7',
        aco: '#2bd1a7'
    });
    const bestColor = 'rgba(255, 232, 181, 0.95)';

    const getPresetForMode = (mode) => modePresets[mode] || modePresets.equilibrado;

    const getSelectedAlgorithms = () => {
        const selected = [];
        if (ui.comparePso && ui.comparePso.checked) selected.push('pso');
        if (ui.compareFirefly && ui.compareFirefly.checked) selected.push('firefly');
        if (ui.compareGa && ui.compareGa.checked) selected.push('ga');
        if (ui.compareCuckoo && ui.compareCuckoo.checked) selected.push('cuckoo');
        if (ui.compareAco && ui.compareAco.checked) selected.push('aco');
        return selected;
    };

    const createBasePopulation = (count) =>
        Array.from({ length: count }, () => {
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

    const cloneParticles = (baseParticles) => baseParticles.map((p) => ({ ...p }));

    const updateBestState = (localState) => {
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
    };

    const drawBenchmarkChart = (ctx, canvas, history, color) => {
        const size = canvas.__w || canvas.width;
        if (size === 0) {
            return;
        }
        drawChartWithValues(ctx, canvas, history, color);
    };

    const drawComparisonViews = () => {
        if (!comparisonStates) {
            return;
        }
        const colors = comparisonColors();
        const surfaceMode = ui.surfaceMode && ui.surfaceMode.checked ? 'popular' : 'smooth';
        comparisonStates.forEach((entry) => {
            const algoColor = colors[entry.algo];
            draw2DState(entry.state, entry.ctx.view2d, entry.canvases.view2d, algoColor, bestColor);
            draw3DState(entry.state, entry.ctx.view3d, entry.canvases.view3d, objectiveFns, surfaceMode, algoColor, bestColor);
            drawBenchmarkChart(entry.ctx.chart, entry.canvases.chart, entry.state.history, colors[entry.algo]);
            if (entry.stats) {
                entry.stats.iter.textContent = `Iter: ${entry.state.iter}`;
                if (entry.state.best) {
                    entry.stats.bestF.textContent = `Best f: ${entry.state.best.f.toFixed(4)}`;
                    entry.stats.bestXY.textContent = `Best x,y: ${entry.state.best.x.toFixed(2)}, ${entry.state.best.y.toFixed(2)}`;
                }
            }
        });
    };

    const setComparisonMode = (active) => {
        document.body.classList.toggle('comparison-mode', active);
        if (!active) {
            stopComparisonLoop();
            comparisonStates = null;
            if (ui.comparisonGrid) {
                ui.comparisonGrid.innerHTML = '';
            }
        }
        requestAnimationFrame(() => {
            resizeComparisonCanvases();
            drawComparisonViews();
        });
    };

    const stepPSOState = (localState, params) => {
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
    };

    const stepFireflyState = (localState, params) => {
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
    };

    const stepGAState = (localState, params) => {
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
    };

    const stepCuckooState = (localState, params) => {
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
    };

    const stepACOState = (localState, params) => {
        const { rho, alpha, beta } = params;
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
    };

    const createComparisonCards = (algos) => {
        if (!ui.comparisonGrid) {
            return [];
        }
        ui.comparisonGrid.innerHTML = '';
        const preset = getPresetForMode(ui.convergence ? ui.convergence.value : 'equilibrado');
        return algos.map((algo) => {
            const card = document.createElement('div');
            card.className =
                'relative flex w-full min-w-[260px] flex-1 flex-col gap-3 rounded-[16px] border border-white/10 bg-[rgba(12,18,16,0.6)] p-3';
            const titleRow = document.createElement('div');
            titleRow.className = 'flex items-center justify-between gap-2';
            const title = document.createElement('div');
            title.className = 'text-xs uppercase tracking-[0.15em] text-[color:var(--ink-dim)]';
            title.textContent = algoInfo[algo].tag;
            const toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className =
                'h-7 w-7 rounded-lg border border-white/15 bg-[rgba(12,18,16,0.6)] text-xs text-[color:var(--ink-dim)] transition';
            toggle.textContent = 'v';
            toggle.setAttribute('aria-expanded', 'false');
            titleRow.appendChild(title);
            titleRow.appendChild(toggle);

            const legend = document.createElement('div');
            legend.className = 'flex flex-wrap items-center gap-3 text-[0.65rem] text-[color:var(--ink-dim)]';
            const legendAgent = document.createElement('span');
            legendAgent.className = 'flex items-center gap-2';
            const legendAgentDot = document.createElement('span');
            legendAgentDot.className = 'h-2.5 w-2.5 rounded-full';
            legendAgentDot.style.backgroundColor = comparisonColors()[algo];
            legendAgent.appendChild(legendAgentDot);
            legendAgent.appendChild(document.createTextNode('Agentes'));
            const legendBest = document.createElement('span');
            legendBest.className = 'flex items-center gap-2';
            const legendBestDot = document.createElement('span');
            legendBestDot.className = 'h-2.5 w-2.5 rounded-full';
            legendBestDot.style.backgroundColor = bestColor;
            legendBest.appendChild(legendBestDot);
            legendBest.appendChild(document.createTextNode('Mejor agente'));
            legend.appendChild(legendAgent);
            legend.appendChild(legendBest);

            const config = document.createElement('div');
            config.className =
                'absolute right-3 top-10 hidden w-[min(240px,88%)] grid gap-2 rounded-xl border border-white/15 bg-[rgba(10,16,14,0.95)] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.45)]';
            const configInputs = { inputs: {}, values: {} };

            const addRange = (key, label, min, max, step, value) => {
                const row = document.createElement('div');
                row.className = 'flex items-center justify-between text-xs text-[color:var(--ink-dim)]';
                const labelSpan = document.createElement('span');
                labelSpan.textContent = label;
                const valueSpan = document.createElement('span');
                valueSpan.className = 'font-mono text-[rgb(43,209,167)]';
                valueSpan.textContent = Number(value).toFixed(2);
                row.appendChild(labelSpan);
                row.appendChild(valueSpan);

                const input = document.createElement('input');
                input.type = 'range';
                input.min = min;
                input.max = max;
                input.step = step;
                input.value = value;
                input.className = 'h-9 w-full accent-[rgb(255,122,26)]';

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
                const isHidden = config.classList.toggle('hidden');
                toggle.classList.toggle('rotate-180', !isHidden);
                toggle.setAttribute('aria-expanded', isHidden ? 'false' : 'true');
                resizeComparisonCanvases();
                drawComparisonViews();
            });

            const label2d = document.createElement('div');
            label2d.className = 'text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--ink-dim)]';
            label2d.textContent = 'Vista 2D';
            const canvas2d = document.createElement('canvas');
            canvas2d.className =
                'h-40 w-full rounded-[12px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(43,209,167,0.08),transparent_55%),rgba(8,12,10,0.85)]';
            const label3d = document.createElement('div');
            label3d.className = 'text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--ink-dim)]';
            label3d.textContent = 'Vista 3D';
            const canvas3d = document.createElement('canvas');
            canvas3d.className =
                'h-40 w-full rounded-[12px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(43,209,167,0.08),transparent_55%),rgba(8,12,10,0.85)]';
            const labelChart = document.createElement('div');
            labelChart.className = 'text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--ink-dim)]';
            labelChart.textContent = 'Convergencia';
            const canvasChart = document.createElement('canvas');
            canvasChart.className =
                'h-32 w-full rounded-[12px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(43,209,167,0.08),transparent_55%),rgba(8,12,10,0.85)]';
            const stats = document.createElement('div');
            stats.className =
                'grid gap-1 rounded-[10px] border border-white/10 bg-[rgba(10,16,14,0.7)] p-2 font-mono text-[0.7rem] text-[color:var(--ink-dim)]';
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
            card.appendChild(legend);
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
    };

    const resizeComparisonCanvases = () => {
        if (!comparisonStates) {
            return;
        }
        comparisonStates.forEach((entry) => {
            resizeCanvas(entry.canvases.view2d);
            resizeCanvas(entry.canvases.view3d);
            resizeCanvas(entry.canvases.chart);
        });
    };

    const readParamsFromInputs = (algo, configInputs) => {
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
    };

    const updateConfigValueLabels = (configInputs) => {
        Object.entries(configInputs.inputs).forEach(([key, input]) => {
            const label = configInputs.values[key];
            if (!label) {
                return;
            }
            label.textContent = Number(input.value).toFixed(2);
        });
    };

    const getAlgoParams = () => {
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
    };

    const buildComparisonStates = () => {
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
    };

    const startComparisonLoop = () => {
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
            drawComparisonViews();

            const finished = comparisonStates.every((entry) => entry.state.iter >= iterations);
            if (finished) {
                comparisonRunning = false;
                return;
            }
            comparisonRafId = requestAnimationFrame(loopComparison);
        };

        loopComparison();
    };

    const applyPresetToComparisonCards = (mode) => {
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
    };

    const stopComparisonLoop = () => {
        comparisonRunning = false;
        if (ui.benchmark) {
            ui.benchmark.textContent = 'Iniciar';
        }
        if (comparisonRafId) {
            cancelAnimationFrame(comparisonRafId);
        }
    };

    const stopComparison = () => {
        stopComparisonLoop();
        setComparisonMode(false);
    };

    return {
        buildComparisonStates,
        startComparisonLoop,
        stopComparisonLoop,
        stopComparison,
        applyPresetToComparisonCards,
        resizeComparisonCanvases,
        drawComparisonViews
    };
}
