const algorithmLabels = {
    aco: 'ACO',
    cuckoo: 'Cuckoo',
    firefly: 'Firefly',
    ga: 'Genetic',
    pso: 'PSO',
};

const objectiveLabels = {
    ackley: 'Ackley',
    griewank: 'Griewank',
    rastrigin: 'Rastrigin',
    rosenbrock: 'Rosenbrock',
    schwefel: 'Schwefel',
    sphere: 'Sphere',
    styblinski: 'Styblinski-Tang',
};

const defaultConsoleHint = 'Aqui aparecen los eventos del ultimo entrenamiento ejecutado desde el simulador.';
const defaultLastMessage = 'La proxima vez que entrenes desde el simulador, esta vista guardara el contexto y la sugerencia generada.';

const setText = (element, value) => {
    if (element) {
        element.textContent = value;
    }
};

const formatLabel = (value, labels = {}) => {
    if (!value) {
        return '-';
    }

    if (labels[value]) {
        return labels[value];
    }

    return String(value)
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDateTime = (value) => {
    if (!value) {
        return 'Sin registros';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString();
};

const formatParamValue = (value) => {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
        return '-';
    }

    if (Math.abs(parsed) >= 100) {
        return parsed.toFixed(0);
    }

    return parsed.toFixed(3).replace(/\.?0+$/, '');
};

const normalizeLines = (value) => {
    if (Array.isArray(value)) {
        return value
            .map((line) => String(line).trim())
            .filter(Boolean);
    }

    if (typeof value !== 'string') {
        return [];
    }

    return value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
};

const readJson = (key) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
};

const findMatch = (lines, expression) => {
    for (const line of lines) {
        const match = line.match(expression);
        if (match) {
            return match;
        }
    }

    return null;
};

const buildInsights = (state, lines) => {
    const current = state?.current || {};
    const candidate = state?.candidate || null;
    const algorithmMatch = findMatch(lines, /algoritmo:\s*([a-z0-9_-]+)/i);
    const objectiveMatch = findMatch(lines, /funcion objetivo:\s*([a-z0-9_-]+)/i);
    const samplesMatch = findMatch(lines, /muestras validas:\s*(\d+)/i);
    const dimensionsMatch = findMatch(lines, /dimensiones de entrada:\s*(\d+)/i);
    const architectureMatch = findMatch(lines, /(\d+)\s*capa oculta,\s*(\d+)\s*neuronas,\s*(\d+)\s*epocas/i);
    const notEnoughSamples = lines.some((line) => line.includes('minimo 8'));
    const hasTrainingLine = lines.some((line) => line.includes('entrenando red'));
    const hasSuggestionLine = lines.some((line) => line.includes('sugerencia generada'));

    return {
        algorithm: current.algo || algorithmMatch?.[1] || null,
        objective: current.objective || objectiveMatch?.[1] || null,
        samples: samplesMatch ? Number(samplesMatch[1]) : null,
        dimensions: dimensionsMatch ? Number(dimensionsMatch[1]) : null,
        candidate,
        checkedAt: state?.checkedAt || null,
        status: state?.status || null,
        message: state?.message || null,
        architecture: architectureMatch
            ? `${architectureMatch[1]} capa oculta / ${architectureMatch[2]} neuronas / ${architectureMatch[3]} epocas`
            : '1 capa oculta / 6 neuronas / 220 epocas',
        hasContext: Boolean(current.algo || current.objective || lines.length),
        hasEnoughSamples: samplesMatch ? Number(samplesMatch[1]) >= 8 : false,
        hasTraining: Boolean(hasTrainingLine || state?.status === 'pending' || state?.status === 'ok'),
        hasSuggestion: Boolean(candidate || hasSuggestionLine),
        notEnoughSamples,
    };
};

export function initNeuralStatus({ root }) {
    if (!root) {
        return;
    }

    const statusUrl = root.dataset ? root.dataset.nnStatusUrl : null;
    const statusBadge = document.getElementById('nnStatusBadge');
    const statusMessage = document.getElementById('nnStatusMessage');
    const refreshButton = document.getElementById('nnStatusRefresh');
    const statusLatency = document.getElementById('nnStatusLatency');
    const statusChecked = document.getElementById('nnStatusChecked');
    const statusUrlEl = document.getElementById('nnStatusUrl');
    const statusPayload = document.getElementById('nnStatusPayload');
    const consoleEl = document.getElementById('nnConsole');
    const consoleClear = document.getElementById('nnConsoleClear');
    const networkPanel = document.getElementById('nnNetworkPanel');
    const architectureStatus = document.getElementById('nnArchitectureStatus');
    const architectureBadge = document.getElementById('nnArchitectureBadge');
    const featureCount = document.getElementById('nnFeatureCount');
    const signalState = document.getElementById('nnSignalState');
    const inferenceState = document.getElementById('nnInferenceState');
    const quickRead = document.getElementById('nnQuickRead');
    const logSummary = document.getElementById('nnLogSummary');
    const lastRunAt = document.getElementById('nnLastRunAt');
    const lastMessage = document.getElementById('nnLastMessage');
    const lastAlgorithm = document.getElementById('nnLastAlgorithm');
    const lastObjective = document.getElementById('nnLastObjective');
    const lastSamples = document.getElementById('nnLastSamples');
    const lastDimensions = document.getElementById('nnLastDimensions');
    const suggestionContext = document.getElementById('nnSuggestionContext');
    const suggestedParams = document.getElementById('nnSuggestedParams');
    const consoleHint = document.getElementById('nnConsoleHint');
    const consoleCount = document.getElementById('nnConsoleCount');
    const stepCapture = document.getElementById('nnStepCapture');
    const stepDataset = document.getElementById('nnStepDataset');
    const stepTraining = document.getElementById('nnStepTraining');
    const stepSuggestion = document.getElementById('nnStepSuggestion');
    const logKey = 'nn:lastLog';
    const stateKey = 'nn:lastState';
    let currentServiceStatus = 'checking';

    if (!statusUrl || !statusBadge || !statusMessage || !refreshButton) {
        return;
    }

    const setStepState = (element, state, copy) => {
        if (!element) {
            return;
        }

        element.dataset.state = state;

        const copyElement = element.querySelector('[data-step-copy]');

        if (copyElement && copy) {
            copyElement.textContent = copy;
        }
    };

    const renderSuggestedParams = (algorithm, candidate) => {
        if (!suggestedParams) {
            return;
        }

        if (!candidate || !candidate.parameters) {
            suggestedParams.innerHTML = `
                <div class="rounded-[14px] border border-dashed border-white/10 px-4 py-5 text-sm text-[color:var(--ink-dim)]">
                    Aun no hay una recomendacion almacenada.
                </div>
            `;
            setText(suggestionContext, 'Sin sugerencia');
            return;
        }

        const entries = Object.entries(candidate.parameters);
        const title = formatLabel(algorithm, algorithmLabels);

        suggestedParams.innerHTML = entries
            .map(([key, value]) => {
                return `
                    <div class="flex items-center justify-between rounded-[14px] border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-3">
                        <div class="text-sm font-semibold text-[color:var(--ink)]">${formatLabel(key)}</div>
                        <div class="font-mono text-sm text-[rgb(43,209,167)]">${formatParamValue(value)}</div>
                    </div>
                `;
            })
            .join('');

        setText(suggestionContext, `Sugerencia ${title}`);
    };

    const renderStoredState = () => {
        const state = readJson(stateKey);
        const lines = normalizeLines(state?.log ?? localStorage.getItem(logKey));
        const insights = buildInsights(state, lines);
        const eventCount = lines.length;

        if (consoleEl) {
            consoleEl.textContent = eventCount ? lines.join('\n') : '-';
        }

        setText(consoleCount, eventCount ? `${eventCount} eventos` : '0 eventos');
        setText(consoleHint, insights.message || (eventCount ? 'Se cargaron eventos del ultimo entrenamiento.' : defaultConsoleHint));
        setText(lastMessage, insights.message || defaultLastMessage);
        setText(lastAlgorithm, formatLabel(insights.algorithm, algorithmLabels));
        setText(lastObjective, formatLabel(insights.objective, objectiveLabels));
        setText(lastSamples, insights.samples ?? '-');
        setText(lastDimensions, insights.dimensions ?? '-');
        setText(lastRunAt, formatDateTime(insights.checkedAt));
        setText(featureCount, insights.dimensions ? `${insights.dimensions} rasgos` : '0 rasgos');
        setText(architectureBadge, insights.architecture);

        renderSuggestedParams(insights.algorithm, insights.candidate);

        let networkPhase = 'offline';

        if (currentServiceStatus === 'ok') {
            if (insights.hasSuggestion) {
                networkPhase = 'trained';
            } else if (insights.hasTraining) {
                networkPhase = 'training';
            } else {
                networkPhase = 'connected';
            }
        }

        if (networkPanel) {
            networkPanel.dataset.phase = networkPhase;
        }

        if (networkPhase === 'trained') {
            setText(architectureStatus, 'La red ya produjo una sugerencia util');
            setText(signalState, 'Senal estable');
            setText(inferenceState, 'Sugerencia lista para aplicar en el simulador');
            setText(quickRead, 'La corrida mas reciente completo dataset, entrenamiento e inferencia. La salida representa una recomendacion concreta de parametros.');
            setText(logSummary, 'Entrenamiento completo');
        } else if (networkPhase === 'training') {
            setText(architectureStatus, 'La capa oculta esta procesando patrones del historial');
            setText(signalState, 'Entrenando');
            setText(inferenceState, 'Se detecto actividad de entrenamiento reciente');
            setText(quickRead, 'Las conexiones entre capas se activan porque la red encontro suficientes datos para empezar a ajustar pesos.');
            setText(logSummary, 'Entrenamiento en progreso');
        } else if (networkPhase === 'connected') {
            setText(architectureStatus, 'Servicio listo para recibir nuevas corridas');
            setText(signalState, 'En espera');
            setText(inferenceState, 'Servicio activo, sin sugerencia reciente');
            setText(quickRead, 'El microservicio responde correctamente. Entrena desde el simulador para ver el comportamiento completo de la red.');
            setText(logSummary, eventCount ? 'Contexto almacenado' : 'Sin actividad reciente');
        } else {
            setText(architectureStatus, 'El panel necesita que el servicio este disponible');
            setText(signalState, 'Sin senal');
            setText(inferenceState, 'No hay conexion con el microservicio');
            setText(quickRead, 'Mientras el servicio este desconectado, solo se mostrara el ultimo entrenamiento guardado localmente.');
            setText(logSummary, eventCount ? 'Historial local disponible' : 'Sin actividad reciente');
        }

        const captureCopy = insights.algorithm || insights.objective
            ? `${formatLabel(insights.algorithm, algorithmLabels)} con ${formatLabel(insights.objective, objectiveLabels)} listo para analizar.`
            : 'Aun no se detectan datos recientes del simulador.';
        const datasetCopy = insights.samples !== null
            ? insights.hasEnoughSamples
                ? `${insights.samples} muestras validas y ${insights.dimensions ?? '-'} dimensiones disponibles para normalizar.`
                : `${insights.samples} muestras validas detectadas. Aun faltan registros para llegar al minimo de 8.`
            : 'Se necesitan al menos 8 simulaciones validas para construir el dataset.';
        const trainingCopy = insights.hasTraining
            ? `Arquitectura ${insights.architecture}. La red ajusta pesos con activacion ReLU para reducir la loss.`
            : 'Cuando inicia el entrenamiento, la capa oculta combina pesos y activaciones para reducir la loss.';
        const suggestionCopy = insights.hasSuggestion
            ? `La red ya produjo una sugerencia para ${formatLabel(insights.algorithm, algorithmLabels)}.`
            : insights.notEnoughSamples
                ? 'No fue posible generar sugerencia porque aun no hay suficientes simulaciones validas.'
                : 'La salida final recomienda parametros para el algoritmo activo.';

        setStepState(stepCapture, insights.hasContext ? 'done' : 'pending', captureCopy);
        setStepState(
            stepDataset,
            insights.samples === null ? 'pending' : insights.hasEnoughSamples ? 'done' : 'warning',
            datasetCopy,
        );
        setStepState(
            stepTraining,
            insights.hasTraining ? (insights.hasSuggestion ? 'done' : 'active') : 'pending',
            trainingCopy,
        );
        setStepState(
            stepSuggestion,
            insights.hasSuggestion ? 'done' : insights.notEnoughSamples ? 'warning' : 'pending',
            suggestionCopy,
        );
    };

    const setBadgeState = (status) => {
        if (!statusBadge) {
            return;
        }

        if (status === 'ok') {
            statusBadge.textContent = 'Conectado';
            statusBadge.className = 'rounded-full border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.16)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[rgb(43,209,167)]';
            return;
        }

        if (status === 'checking') {
            statusBadge.textContent = 'Verificando';
            statusBadge.className = 'rounded-full border border-white/10 bg-[rgba(255,255,255,0.06)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[color:var(--ink-dim)]';
            return;
        }

        statusBadge.textContent = 'Desconectado';
        statusBadge.className = 'rounded-full border border-[rgba(255,122,26,0.6)] bg-[rgba(255,122,26,0.16)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[rgb(255,122,26)]';
    };

    const setState = ({ status, message, latency, serviceUrl, payload }) => {
        currentServiceStatus = status;
        setBadgeState(status);
        setText(statusMessage, message);
        setText(statusLatency, latency ? `${latency} ms` : '-');
        setText(statusChecked, new Date().toLocaleString());
        setText(statusUrlEl, serviceUrl || '-');

        if (statusPayload) {
            statusPayload.textContent = payload ? JSON.stringify(payload, null, 2) : '-';
        }

        renderStoredState();
    };

    const checkStatus = async () => {
        setState({
            status: 'checking',
            message: 'Verificando conexion con el microservicio...',
            latency: null,
            serviceUrl: null,
            payload: null,
        });

        try {
            const startedAt = performance.now();
            const response = await fetch(statusUrl, { headers: { Accept: 'application/json' } });
            const payload = await response.json();
            const latency = Math.round(performance.now() - startedAt);

            if (!response.ok) {
                throw new Error(payload.message || 'Servicio no disponible.');
            }

            setState({
                status: 'ok',
                message: payload.message || 'Servicio activo.',
                latency,
                serviceUrl: payload.service_url,
                payload,
            });
        } catch (error) {
            setState({
                status: 'down',
                message: 'No se pudo conectar con el microservicio.',
                latency: null,
                serviceUrl: null,
                payload: null,
            });
        }
    };

    refreshButton.addEventListener('click', () => {
        checkStatus();
    });

    if (consoleClear) {
        consoleClear.addEventListener('click', () => {
            localStorage.removeItem(logKey);
            localStorage.removeItem(stateKey);
            renderStoredState();
        });
    }

    window.addEventListener('storage', (event) => {
        if (event.key === logKey || event.key === stateKey) {
            renderStoredState();
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            renderStoredState();
        }
    });

    renderStoredState();
    checkStatus();
}
