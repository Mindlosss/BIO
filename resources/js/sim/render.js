export const canvasSize = (canvas) => ({
    w: canvas.__w || canvas.width,
    h: canvas.__h || canvas.height
});

export const resizeCanvas = (canvas) => {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    canvas.__w = rect.width;
    canvas.__h = rect.height;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
};

const toCanvasCoords = (x, y, canvas, bounds) => {
    const size = canvasSize(canvas);
    const pad = 20;
    const w = size.w - pad * 2;
    const h = size.h - pad * 2;
    const cx = pad + ((x + bounds) / (2 * bounds)) * w;
    const cy = pad + ((bounds - y) / (2 * bounds)) * h;
    return { cx, cy };
};

const drawGrid = (ctx, canvas) => {
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
};

const normalizeColor = (color) => {
    if (!color || typeof color !== 'string') {
        return { r: 43, g: 209, b: 167 };
    }
    if (color.startsWith('#')) {
        const hex = color.length === 4
            ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
            : color;
        const value = Number.parseInt(hex.slice(1), 16);
        return {
            r: (value >> 16) & 255,
            g: (value >> 8) & 255,
            b: value & 255
        };
    }
    return { r: 43, g: 209, b: 167 };
};

export const draw2DState = (simState, ctx, canvas, color, bestColor = 'rgba(255, 232, 181, 0.95)') => {
    if (!ctx || !canvas) {
        return;
    }
    drawGrid(ctx, canvas);
    const { r, g, b } = normalizeColor(color);
    simState.particles.forEach((p) => {
        const pos = toCanvasCoords(p.x, p.y, canvas, simState.bounds);
        const intensity = Math.min(1, p.f / (simState.best.f + 0.0001));
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.2 + 0.6 * (1 - intensity)})`;
        ctx.beginPath();
        ctx.arc(pos.cx, pos.cy, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    if (simState.best) {
        const bestPos = toCanvasCoords(simState.best.x, simState.best.y, canvas, simState.bounds);
        ctx.strokeStyle = bestColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bestPos.cx - 8, bestPos.cy);
        ctx.lineTo(bestPos.cx + 8, bestPos.cy);
        ctx.moveTo(bestPos.cx, bestPos.cy - 8);
        ctx.lineTo(bestPos.cx, bestPos.cy + 8);
        ctx.stroke();
    }
};

const projectIso = (x, y, z, centerX, centerY, scale, heightScale) => {
    const isoX = (x - y) * scale + centerX;
    const isoY = (x + y) * scale * 0.5 + centerY - z * heightScale;
    return { isoX, isoY };
};

export const draw3DState = (
    simState,
    ctx,
    canvas,
    objectiveFns,
    surfaceMode,
    color,
    bestColor = 'rgba(255, 232, 181, 0.95)'
) => {
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
        if (surfaceMode === 'popular') {
            const t = (f - minF) / rangeF;
            return maxZ * (1 - t) * 0.9;
        }
        return (maxZ / (1 + f)) * 0.9;
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

    const { r, g, b } = normalizeColor(color);
    simState.particles.forEach((p) => {
        const f = objectiveFns[simState.objective](p.x, p.y);
        const z = mapZ(f);
        const pt = projectIso(p.x, p.y, z, centerX, centerY, scale, 6);
        const intensity = Math.min(1, f / (simState.best.f + 0.0001));
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.25 + 0.7 * (1 - intensity)})`;
        ctx.beginPath();
        ctx.arc(pt.isoX, pt.isoY, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    if (simState.best) {
        const bestF = objectiveFns[simState.objective](simState.best.x, simState.best.y);
        const bestZ = mapZ(bestF);
        const bestPoint = projectIso(simState.best.x, simState.best.y, bestZ, centerX, centerY, scale, 6);
        ctx.strokeStyle = bestColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(bestPoint.isoX, bestPoint.isoY, 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = bestColor;
        ctx.beginPath();
        ctx.arc(bestPoint.isoX, bestPoint.isoY, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }
};

export const drawChartWithValues = (ctx, canvas, history, strokeColor) => {
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
};
