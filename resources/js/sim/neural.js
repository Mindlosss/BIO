export function createNeuralAdvisor({ nnUrl, ui }) {
    const statusEl = ui.nnStatus;
    const suggestionEl = ui.nnSuggestion;
    const applyButton = ui.nnApply;
    const trainButton = ui.nnTrain;
    const logKey = 'nn:lastLog';

    if (!nnUrl || !statusEl || !suggestionEl || !applyButton || !trainButton) {
        return;
    }

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null;

    const setStatus = (value) => {
        statusEl.textContent = value;
    };

    const setSuggestion = (value) => {
        suggestionEl.textContent = value;
    };

    const storeLog = (lines) => {
        if (!lines) {
            localStorage.removeItem(logKey);
            return;
        }
        const value = Array.isArray(lines) ? lines.join('\n') : String(lines);
        localStorage.setItem(logKey, value);
    };

    const applySuggestion = (candidate) => {
        if (!candidate) {
            return;
        }

        const algo = candidate.algo || (ui.algo ? ui.algo.value : null);
        const params = candidate.parameters || {};

        if (algo === 'pso') {
            if (ui.psoW && typeof params.w === 'number') {
                ui.psoW.value = params.w;
                ui.psoW.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (ui.psoC1 && typeof params.c1 === 'number') {
                ui.psoC1.value = params.c1;
                ui.psoC1.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (ui.psoC2 && typeof params.c2 === 'number') {
                ui.psoC2.value = params.c2;
                ui.psoC2.dispatchEvent(new Event('input', { bubbles: true }));
            }
        } else if (algo === 'firefly') {
            if (ui.ffBeta && typeof params.beta === 'number') {
                ui.ffBeta.value = params.beta;
                ui.ffBeta.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (ui.ffGamma && typeof params.gamma === 'number') {
                ui.ffGamma.value = params.gamma;
                ui.ffGamma.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (ui.ffAlpha && typeof params.alpha === 'number') {
                ui.ffAlpha.value = params.alpha;
                ui.ffAlpha.dispatchEvent(new Event('input', { bubbles: true }));
            }
        } else if (algo === 'ga') {
            if (ui.gaElite && typeof params.elite === 'number') {
                ui.gaElite.value = params.elite;
                ui.gaElite.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (ui.gaMut && typeof params.mutation === 'number') {
                ui.gaMut.value = params.mutation;
                ui.gaMut.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (ui.gaCross && typeof params.crossover === 'number') {
                ui.gaCross.value = params.crossover;
                ui.gaCross.dispatchEvent(new Event('input', { bubbles: true }));
            }
        } else if (algo === 'cuckoo') {
            if (ui.ckPa && typeof params.pa === 'number') {
                ui.ckPa.value = params.pa;
                ui.ckPa.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (ui.ckStep && typeof params.step === 'number') {
                ui.ckStep.value = params.step;
                ui.ckStep.dispatchEvent(new Event('input', { bubbles: true }));
            }
        } else if (algo === 'aco') {
            if (ui.acoRho && typeof params.rho === 'number') {
                ui.acoRho.value = params.rho;
                ui.acoRho.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (ui.acoAlpha && typeof params.alpha === 'number') {
                ui.acoAlpha.value = params.alpha;
                ui.acoAlpha.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (ui.acoBeta && typeof params.beta === 'number') {
                ui.acoBeta.value = params.beta;
                ui.acoBeta.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    };

    const buildParameters = () => {
        const algo = ui.algo ? ui.algo.value : 'pso';

        if (algo === 'pso') {
            return {
                w: Number(ui.psoW?.value || 0.72),
                c1: Number(ui.psoC1?.value || 1.5),
                c2: Number(ui.psoC2?.value || 1.7),
            };
        }
        if (algo === 'firefly') {
            return {
                beta: Number(ui.ffBeta?.value || 1.0),
                gamma: Number(ui.ffGamma?.value || 0.35),
                alpha: Number(ui.ffAlpha?.value || 0.25),
            };
        }
        if (algo === 'ga') {
            return {
                elite: Number(ui.gaElite?.value || 0.25),
                mutation: Number(ui.gaMut?.value || 0.25),
                crossover: Number(ui.gaCross?.value || 0.6),
            };
        }
        if (algo === 'cuckoo') {
            return {
                pa: Number(ui.ckPa?.value || 0.25),
                step: Number(ui.ckStep?.value || 0.7),
            };
        }
        return {
            rho: Number(ui.acoRho?.value || 0.35),
            alpha: Number(ui.acoAlpha?.value || 1.0),
            beta: Number(ui.acoBeta?.value || 2.0),
        };
    };

    const formatSuggestion = (algo, params) => {
        if (!algo || !params) {
            return '';
        }
        const format = (value) => Number(value).toFixed(2);
        if (algo === 'pso') {
            return `Sugerencia (PSO): w ${format(params.w)}, c1 ${format(params.c1)}, c2 ${format(params.c2)}.`;
        }
        if (algo === 'firefly') {
            return `Sugerencia (Firefly): beta ${format(params.beta)}, gamma ${format(params.gamma)}, alpha ${format(params.alpha)}.`;
        }
        if (algo === 'ga') {
            return `Sugerencia (GA): elite ${format(params.elite)}, mutacion ${format(params.mutation)}, cruce ${format(params.crossover)}.`;
        }
        if (algo === 'cuckoo') {
            return `Sugerencia (Cuckoo): pa ${format(params.pa)}, step ${format(params.step)}.`;
        }
        return `Sugerencia (ACO): rho ${format(params.rho)}, alpha ${format(params.alpha)}, beta ${format(params.beta)}.`;
    };

    const buildPayload = () => ({
        algo: ui.algo ? ui.algo.value : 'pso',
        objective: ui.objective ? ui.objective.value : 'sphere',
        convergence: ui.convergence ? ui.convergence.value : 'equilibrado',
        bounds: Number(ui.bounds?.value || 5),
        population: Number(ui.pop?.value || 60),
        iterations: Number(ui.iterations?.value || 100),
        parameters: buildParameters(),
    });

    const requestSuggestion = async () => {
        setStatus('Entrenando red neuronal en el servidor...');
        setSuggestion('');
        applyButton.disabled = true;
        storeLog(['[client] solicitando entrenamiento...']);

        try {
            const response = await fetch(nnUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify(buildPayload()),
            });

            if (!response.ok) {
                throw new Error('No se pudo entrenar la red neuronal.');
            }

            const payload = await response.json();

            if (payload.status !== 'ok') {
                setStatus(payload.message || 'No se pudo entrenar la red neuronal.');
                setSuggestion('');
                applyButton.disabled = true;
                storeLog(payload.log || '[client] sin salida del servidor.');
                return;
            }

            const candidate = payload.data?.suggestion;

            if (!candidate) {
                setStatus('No hay sugerencias disponibles.');
                setSuggestion('');
                applyButton.disabled = true;
                storeLog(payload.log || '[client] sin salida del servidor.');
                return;
            }

            setStatus(payload.data?.message || 'Red neuronal entrenada.');
            setSuggestion(formatSuggestion(candidate.algo, candidate.parameters));
            applyButton.disabled = false;
            applyButton.onclick = () => applySuggestion(candidate);
            storeLog(payload.log || '[client] entrenamiento completado.');
        } catch (error) {
            setStatus('No se pudo entrenar la red neuronal.');
            setSuggestion('');
            applyButton.disabled = true;
            storeLog('[client] error de conexion.');
        }
    };

    trainButton.addEventListener('click', () => {
        requestSuggestion();
    });
}
