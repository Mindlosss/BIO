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

const mixColors = (a, b, t, alpha = 1) => {
    const r = Math.round(a.r + (b.r - a.r) * t);
    const g = Math.round(a.g + (b.g - a.g) * t);
    const bVal = Math.round(a.b + (b.b - a.b) * t);
    return `rgba(${r}, ${g}, ${bVal}, ${alpha})`;
};

const resolveValueRange = (values) => {
    if (!values.length) {
        return { min: 0, max: 1, range: 1 };
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { min, max, range: max - min || 1 };
};

const drawTrails = (ctx, canvas, trails, bounds, color, alpha = 0.35) => {
    if (!trails || trails.length === 0) {
        return;
    }
    const base = normalizeColor(color);
    ctx.strokeStyle = mixColors(base, base, 0, alpha);
    ctx.lineWidth = 1;
    trails.forEach((trail) => {
        if (!trail || trail.length < 2) {
            return;
        }
        ctx.beginPath();
        trail.forEach((point, index) => {
            const pos = toCanvasCoords(point.x, point.y, canvas, bounds);
            if (index === 0) {
                ctx.moveTo(pos.cx, pos.cy);
            } else {
                ctx.lineTo(pos.cx, pos.cy);
            }
        });
        ctx.stroke();
    });
};

export const draw2DState = (
    simState,
    ctx,
    canvas,
    color,
    bestColor = 'rgba(255, 232, 181, 0.95)',
    options = {}
) => {
    if (!ctx || !canvas) {
        return;
    }
    drawGrid(ctx, canvas);
    const showTrails = options.showTrails !== false;
    if (showTrails) {
        drawTrails(ctx, canvas, simState.trails, simState.bounds, color, 0.28);
    }
    const base = normalizeColor(color);
    const bestTone = normalizeColor('#ffd28a');
    const speedValues = simState.particles.map((p) => Math.hypot(p.vx || 0, p.vy || 0));
    const fitnessValues = simState.particles.map((p) => p.f);
    const speedRange = resolveValueRange(speedValues);
    const fitnessRange = resolveValueRange(fitnessValues);
    const colorMode = 'fitness';

    simState.particles.forEach((p) => {
        const pos = toCanvasCoords(p.x, p.y, canvas, simState.bounds);
        const intensity =
            colorMode === 'speed'
                ? (Math.hypot(p.vx || 0, p.vy || 0) - speedRange.min) / speedRange.range
                : (p.f - fitnessRange.min) / fitnessRange.range;
        const blend = colorMode === 'speed' ? intensity : 1 - intensity;
        ctx.fillStyle = mixColors(base, bestTone, blend, 0.25 + 0.7 * (1 - intensity));
        ctx.beginPath();
        ctx.arc(pos.cx, pos.cy, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    if (simState.best) {
        const bestPos = toCanvasCoords(simState.best.x, simState.best.y, canvas, simState.bounds);
        const glow = ctx.createRadialGradient(bestPos.cx, bestPos.cy, 2, bestPos.cx, bestPos.cy, 18);
        glow.addColorStop(0, 'rgba(255, 210, 138, 0.6)');
        glow.addColorStop(1, 'rgba(255, 210, 138, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(bestPos.cx, bestPos.cy, 18, 0, Math.PI * 2);
        ctx.fill();

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
    bestColor = 'rgba(255, 232, 181, 0.95)',
    options = {}
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

    const showTrails = options.showTrails !== false;
    const base = normalizeColor(color);
    const bestTone = normalizeColor('#ffd28a');
    const speedValues = simState.particles.map((p) => Math.hypot(p.vx || 0, p.vy || 0));
    const fitnessValues = simState.particles.map((p) => p.f);
    const speedRange = resolveValueRange(speedValues);
    const fitnessRange = resolveValueRange(fitnessValues);
    const colorMode = 'fitness';

    if (showTrails && simState.trails && simState.trails.length > 0) {
        ctx.strokeStyle = mixColors(base, base, 0, 0.22);
        ctx.lineWidth = 1;
        simState.trails.forEach((trail) => {
            if (!trail || trail.length < 2) {
                return;
            }
            ctx.beginPath();
            trail.forEach((point, index) => {
                const f = objectiveFns[simState.objective](point.x, point.y);
                const z = mapZ(f);
                const pt = projectIso(point.x, point.y, z, centerX, centerY, scale, 6);
                if (index === 0) {
                    ctx.moveTo(pt.isoX, pt.isoY);
                } else {
                    ctx.lineTo(pt.isoX, pt.isoY);
                }
            });
            ctx.stroke();
        });
    }

    simState.particles.forEach((p) => {
        const f = objectiveFns[simState.objective](p.x, p.y);
        const z = mapZ(f);
        const pt = projectIso(p.x, p.y, z, centerX, centerY, scale, 6);
        const intensity =
            colorMode === 'speed'
                ? (Math.hypot(p.vx || 0, p.vy || 0) - speedRange.min) / speedRange.range
                : (f - fitnessRange.min) / fitnessRange.range;
        const blend = colorMode === 'speed' ? intensity : 1 - intensity;
        ctx.fillStyle = mixColors(base, bestTone, blend, 0.25 + 0.7 * (1 - intensity));
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

export const drawSparkline = (ctx, canvas, history, strokeColor) => {
    if (!ctx || !canvas) {
        return;
    }
    const size = canvasSize(canvas);
    ctx.clearRect(0, 0, size.w, size.h);
    if (!history.length) {
        return;
    }
    const { min, range } = resolveValueRange(history);
    ctx.strokeStyle = strokeColor || 'rgba(255, 122, 26, 0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    history.forEach((val, index) => {
        const x = (index / Math.max(1, history.length - 1)) * size.w;
        const y = size.h - ((val - min) / range) * size.h;
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
};
