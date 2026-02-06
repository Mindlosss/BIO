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
    const logKey = 'nn:lastLog';

    if (!statusUrl || !statusBadge || !statusMessage || !refreshButton) {
        return;
    }

    const loadConsole = () => {
        if (!consoleEl) {
            return;
        }
        const log = localStorage.getItem(logKey);
        consoleEl.textContent = log || '-';
    };

    const setState = ({ status, message, latency, serviceUrl, payload }) => {
        const isUp = status === 'ok';
        statusBadge.textContent = isUp ? 'Conectado' : 'Desconectado';
        statusBadge.className = isUp
            ? 'rounded-full border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.16)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[rgb(43,209,167)]'
            : 'rounded-full border border-[rgba(255,122,26,0.6)] bg-[rgba(255,122,26,0.16)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[rgb(255,122,26)]';
        statusMessage.textContent = message;
        if (statusLatency) {
            statusLatency.textContent = latency ? `${latency} ms` : '-';
        }
        if (statusChecked) {
            statusChecked.textContent = new Date().toLocaleString();
        }
        if (statusUrlEl) {
            statusUrlEl.textContent = serviceUrl || '-';
        }
        if (statusPayload) {
            statusPayload.textContent = payload ? JSON.stringify(payload, null, 2) : '-';
        }
    };

    const checkStatus = async () => {
        setState({ status: 'checking', message: 'Verificando conexion con el microservicio...' });
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
            loadConsole();
        });
    }

    checkStatus();
    loadConsole();
}
