import { objectiveFns } from '../sim/objectives';
import { clamp, createSeededRng, randRange } from '../sim/utils';

export async function initThreeView() {
    const rootEl = document.getElementById('three-root');
    if (!rootEl) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const algo = params.get('algo') || 'pso';
    const objective = params.get('objective') || 'sphere';
    const bounds = Number(params.get('bounds') || 5);
    const pop = Math.max(10, Number(params.get('pop') || 60));
    const speedParam = Number(params.get('speed'));
    const speed = clamp(Number.isNaN(speedParam) ? 0.5 : speedParam, 0.01, 2.5);
    const iterations = Math.max(1, Number(params.get('iterations') || 100));
    const seed = Number(params.get('seed') || Date.now());

    let rng = createSeededRng(seed);
    const random = () => rng();

    const algoParams = {
        pso: {
            w: Number(params.get('psoW') || 0.72),
            c1: Number(params.get('psoC1') || 1.5),
            c2: Number(params.get('psoC2') || 1.7)
        },
        firefly: {
            beta: Number(params.get('ffBeta') || 1.0),
            gamma: Number(params.get('ffGamma') || 0.35),
            alpha: Number(params.get('ffAlpha') || 0.25)
        },
        ga: {
            elite: Number(params.get('gaElite') || 0.25),
            mut: Number(params.get('gaMut') || 0.25),
            cross: Number(params.get('gaCross') || 0.6)
        },
        cuckoo: {
            pa: Number(params.get('ckPa') || 0.25),
            step: Number(params.get('ckStep') || 0.7)
        },
        aco: {
            rho: Number(params.get('acoRho') || 0.35),
            alpha: Number(params.get('acoAlpha') || 1.0),
            beta: Number(params.get('acoBeta') || 2.0)
        }
    };

    const objectiveFn = objectiveFns[objective] || objectiveFns.sphere;
    const agentColor = 0x2bd1a7;
    const objectiveLabels = {
        sphere: 'Sphere',
        rastrigin: 'Rastrigin',
        rosenbrock: 'Rosenbrock',
        ackley: 'Ackley',
        griewank: 'Griewank',
        styblinski: 'Styblinski-Tang',
        schwefel: 'Schwefel'
    };
    const algorithmLines = {
        pso: [
            { key: 'pso-params', label: 'Leer parametros PSO', code: 'w, c1, c2 = parametros del enjambre' },
            { key: 'pso-random', label: 'Generar factores aleatorios', code: 'r1, r2 = random() para cada particula' },
            { key: 'pso-velocity', label: 'Actualizar velocidad', code: 'v = w*v + c1*r1*(pBest - x) + c2*r2*(gBest - x)' },
            { key: 'pso-position', label: 'Mover particula', code: 'x = limitar(x + v * escala, dominio)' },
            { key: 'evaluate', label: 'Evaluar fitness', code: 'f = funcionObjetivo(x, y); actualizar mejor personal' },
            { key: 'global-best', label: 'Actualizar mejor global', code: 'si f < mejorGlobal entonces mejorGlobal = particula' },
            { key: 'iteration', label: 'Cerrar iteracion', code: 'iteracion = iteracion + 1' }
        ],
        firefly: [
            { key: 'firefly-params', label: 'Leer parametros Firefly', code: 'beta0, gamma, alpha = parametros de atraccion' },
            { key: 'firefly-compare', label: 'Comparar brillo', code: 'si f(j) < f(i), la luciernaga j atrae a i' },
            { key: 'firefly-attraction', label: 'Calcular atraccion', code: 'beta = beta0 * exp(-gamma * distancia^2)' },
            { key: 'firefly-move', label: 'Mover agente', code: 'x(i) = x(i) + beta * direccion + alpha * ruido' },
            { key: 'evaluate', label: 'Evaluar fitness', code: 'f = funcionObjetivo(x, y); actualizar mejor personal' },
            { key: 'global-best', label: 'Actualizar mejor global', code: 'si f < mejorGlobal entonces mejorGlobal = agente' },
            { key: 'iteration', label: 'Cerrar iteracion', code: 'iteracion = iteracion + 1' }
        ],
        ga: [
            { key: 'ga-score', label: 'Ordenar poblacion', code: 'poblacion = ordenarPorFitness(poblacion)' },
            { key: 'ga-elite', label: 'Conservar elite', code: 'siguiente = mejores individuos' },
            { key: 'ga-parents', label: 'Elegir padres', code: 'a, b = elegir desde la elite' },
            { key: 'ga-crossover', label: 'Cruzar genes', code: 'hijo = mezclar(a, b) si random() < crossover' },
            { key: 'ga-mutation', label: 'Mutar hijo', code: 'hijo += ruido si random() < mutacion' },
            { key: 'evaluate', label: 'Evaluar fitness', code: 'f = funcionObjetivo(x, y); actualizar mejor personal' },
            { key: 'global-best', label: 'Actualizar mejor global', code: 'si f < mejorGlobal entonces mejorGlobal = individuo' },
            { key: 'iteration', label: 'Cerrar iteracion', code: 'iteracion = iteracion + 1' }
        ],
        cuckoo: [
            { key: 'cuckoo-params', label: 'Leer parametros Cuckoo', code: 'pa, step = parametros de abandono y vuelo' },
            { key: 'cuckoo-abandon', label: 'Abandonar nido', code: 'si random() < pa, crear nueva posicion aleatoria' },
            { key: 'cuckoo-flight', label: 'Vuelo aleatorio', code: 'levy = (random() - 0.5) * step' },
            { key: 'cuckoo-best', label: 'Atraer hacia el mejor', code: 'x = x + levy + 0.12 * (mejorGlobal - x)' },
            { key: 'evaluate', label: 'Evaluar fitness', code: 'f = funcionObjetivo(x, y); actualizar mejor personal' },
            { key: 'global-best', label: 'Actualizar mejor global', code: 'si f < mejorGlobal entonces mejorGlobal = nido' },
            { key: 'iteration', label: 'Cerrar iteracion', code: 'iteracion = iteracion + 1' }
        ],
        aco: [
            { key: 'aco-params', label: 'Leer parametros ACO', code: 'rho, alpha, beta = parametros de feromona' },
            { key: 'aco-direction', label: 'Medir direccion', code: 'direccion = mejorGlobal - posicionActual' },
            { key: 'aco-desirability', label: 'Calcular visibilidad', code: 'visibilidad = (1 / distancia)^beta' },
            { key: 'aco-pheromone', label: 'Calcular feromona', code: 'feromona = (1 - rho)^alpha' },
            { key: 'aco-move', label: 'Mover agente', code: 'x = x + direccion * feromona * visibilidad + ruido' },
            { key: 'evaluate', label: 'Evaluar fitness', code: 'f = funcionObjetivo(x, y); actualizar mejor personal' },
            { key: 'global-best', label: 'Actualizar mejor global', code: 'si f < mejorGlobal entonces mejorGlobal = agente' },
            { key: 'iteration', label: 'Cerrar iteracion', code: 'iteracion = iteracion + 1' }
        ]
    };

    const [
        {
            Scene,
            PerspectiveCamera,
            WebGLRenderer,
            Color,
            AmbientLight,
            HemisphereLight,
            DirectionalLight,
            PointLight,
            PlaneGeometry,
            MeshStandardMaterial,
            Mesh,
            SphereGeometry,
            InstancedMesh,
            Object3D,
            WireframeGeometry,
            LineSegments,
            LineBasicMaterial,
            SRGBColorSpace,
            ACESFilmicToneMapping
        },
        { OrbitControls }
    ] = await Promise.all([
        import('three'),
        import('three/examples/jsm/controls/OrbitControls.js')
    ]);

    const scene = new Scene();
    scene.background = new Color(0x121816);
    const baseColor = new Color(agentColor);
    const bestTone = new Color(0xffd28a);

    const camera = new PerspectiveCamera(50, 1, 0.1, 2000);
    camera.position.set(bounds * 2, bounds * 1.4, bounds * 2);

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rootEl.appendChild(renderer.domElement);

    // Configuración de controles orbitales
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
   
    controls.mouseButtons = {
        LEFT: 0, 
        MIDDLE: 2, 
        RIGHT: 2  
    };
    controls.screenSpacePanning = true; 
    
    controls.zoomSpeed = 1.0; 
    controls.panSpeed = 1.2; 
    controls.rotateSpeed = 0.8;
    controls.minDistance = Math.max(bounds * 0.1, 0.5);
    controls.maxDistance = bounds * 12; 
    controls.minPolarAngle = 0; 
    controls.maxPolarAngle = Math.PI; 
    controls.target.set(0, 0, 0);
    controls.update();


    const ambient = new AmbientLight(0xffffff, 0.42);
    const hemisphere = new HemisphereLight(0xdffdf4, 0x10201c, 0.85);
    const directional = new DirectionalLight(0xffffff, 1.35);
    directional.position.set(bounds * 2, bounds * 3, bounds * 1.5);
    const fill = new DirectionalLight(0x9fffe1, 0.58);
    fill.position.set(-bounds * 1.8, bounds * 1.8, -bounds * 1.2);
    scene.add(ambient, hemisphere, directional, fill);

    const surfaceSize = bounds * 2;
    const segments = 80;
    const surfaceGeometry = new PlaneGeometry(surfaceSize, surfaceSize, segments, segments);
    const position = surfaceGeometry.attributes.position;
    let minF = Infinity;
    let maxF = -Infinity;
    for (let i = 0; i < position.count; i += 1) {
        const x = position.getX(i);
        const y = position.getY(i);
        const f = objectiveFn(x, y);
        minF = Math.min(minF, f);
        maxF = Math.max(maxF, f);
    }
    const rangeF = maxF - minF || 1;
    const heightScale = bounds * 0.4;
    const mapHeight = (f) => {
        const t = (f - minF) / rangeF;
        return heightScale * (1 - t);
    };
    for (let i = 0; i < position.count; i += 1) {
        const x = position.getX(i);
        const y = position.getY(i);
        const f = objectiveFn(x, y);
        position.setZ(i, mapHeight(f));
    }
    surfaceGeometry.computeVertexNormals();
    const surfaceMaterial = new MeshStandardMaterial({
        color: 0x1f5a45,
        emissive: 0x071612,
        emissiveIntensity: 0.16,
        metalness: 0.1,
        roughness: 0.8,
        side: 2
    });
    const surface = new Mesh(surfaceGeometry, surfaceMaterial);
    surface.rotation.x = -Math.PI / 2;
    scene.add(surface);

    const wireframe = new LineSegments(
        new WireframeGeometry(surfaceGeometry),
        new LineBasicMaterial({ color: 0x65f5c9, opacity: 0.36, transparent: true })
    );
    wireframe.rotation.x = -Math.PI / 2;
    scene.add(wireframe);

    const agentRadius = Math.max(0.11, bounds * 0.04);
    const agentGeometry = new SphereGeometry(agentRadius, 24, 24);
    const agentMaterial = new MeshStandardMaterial({
        vertexColors: true,
        color: 0xffffff,
        emissive: 0x0d5a49,
        emissiveIntensity: 0.55,
        metalness: 0.08,
        roughness: 0.32
    });
    const agents = new InstancedMesh(agentGeometry, agentMaterial, pop);
    agents.frustumCulled = false;
    const dummy = new Object3D();
    const instanceColor = new Color();
    scene.add(agents);
    const bestMaterial = new MeshStandardMaterial({
        color: 0xffe8b5,
        emissive: 0xffd28a,
        emissiveIntensity: 0.72,
        roughness: 0.24
    });
    const bestMesh = new Mesh(new SphereGeometry(Math.max(0.16, bounds * 0.06), 24, 24), bestMaterial);
    bestMesh.add(new PointLight(0xffd28a, 1.4, Math.max(bounds * 2.8, 7)));
    scene.add(bestMesh);

    const state = {
        bounds,
        particles: [],
        best: null,
        iter: 0
    };
    const queuedCodePhases = [];
    const codeLineElements = new Map();
    const codePlaybackInterval = 420;
    let currentCodePhase = null;
    let lastCodePhaseAt = 0;

    const queueCodePhase = (key) => {
        if (!key) {
            return;
        }
        if (key === currentCodePhase || queuedCodePhases.includes(key)) {
            return;
        }
        queuedCodePhases.push(key);
        while (queuedCodePhases.length > 28) {
            queuedCodePhases.shift();
        }
    };

    const createParticle = () => {
        const x = randRange(-bounds, bounds, random);
        const y = randRange(-bounds, bounds, random);
        const f = objectiveFn(x, y);
        return {
            x,
            y,
            vx: randRange(-1, 1, random),
            vy: randRange(-1, 1, random),
            bestX: x,
            bestY: y,
            bestF: f,
            f
        };
    };

    const updateBest = () => {
        let currentBest = null;
        queueCodePhase('evaluate');
        state.particles.forEach((p) => {
            p.f = objectiveFn(p.x, p.y);
            if (p.f < p.bestF) {
                p.bestF = p.f;
                p.bestX = p.x;
                p.bestY = p.y;
            }
            if (!currentBest || p.f < currentBest.f) {
                currentBest = { x: p.x, y: p.y, f: p.f };
            }
        });
        queueCodePhase('global-best');
        state.best = currentBest;
    };

    const stepPSO = () => {
        queueCodePhase('pso-params');
        const moveScale = 0.15;
        const { w, c1, c2 } = algoParams.pso;
        state.particles.forEach((p) => {
            queueCodePhase('pso-random');
            const r1 = random();
            const r2 = random();
            queueCodePhase('pso-velocity');
            const vx = w * p.vx + c1 * r1 * (p.bestX - p.x) + c2 * r2 * (state.best.x - p.x);
            const vy = w * p.vy + c1 * r1 * (p.bestY - p.y) + c2 * r2 * (state.best.y - p.y);
            p.vx = clamp(vx, -0.6, 0.6);
            p.vy = clamp(vy, -0.6, 0.6);
            queueCodePhase('pso-position');
            p.x = clamp(p.x + p.vx * moveScale, -bounds, bounds);
            p.y = clamp(p.y + p.vy * moveScale, -bounds, bounds);
        });
    };

    const stepFirefly = () => {
        queueCodePhase('firefly-params');
        const { beta, gamma, alpha } = algoParams.firefly;
        for (let i = 0; i < state.particles.length; i += 1) {
            for (let j = 0; j < state.particles.length; j += 1) {
                const pi = state.particles[i];
                const pj = state.particles[j];
                queueCodePhase('firefly-compare');
                if (pj.f < pi.f) {
                    const dx = pj.x - pi.x;
                    const dy = pj.y - pi.y;
                    const distSq = dx * dx + dy * dy;
                    queueCodePhase('firefly-attraction');
                    const betaVal = beta * Math.exp(-gamma * distSq);
                    queueCodePhase('firefly-move');
                    pi.x += betaVal * dx * 0.35 + alpha * 0.35 * (random() - 0.5);
                    pi.y += betaVal * dy * 0.35 + alpha * 0.35 * (random() - 0.5);
                    pi.x = clamp(pi.x, -bounds, bounds);
                    pi.y = clamp(pi.y, -bounds, bounds);
                }
            }
        }
    };

    const stepGA = () => {
        const { elite, mut, cross } = algoParams.ga;
        queueCodePhase('ga-score');
        const scored = state.particles
            .map((p) => ({ p, f: objectiveFn(p.x, p.y) }))
            .sort((a, b) => a.f - b.f);
        queueCodePhase('ga-elite');
        const eliteCount = Math.max(2, Math.floor(scored.length * elite));
        const elites = scored.slice(0, eliteCount).map((item) => item.p);
        const next = [...elites];
        while (next.length < scored.length) {
            queueCodePhase('ga-parents');
            const a = elites[Math.floor(random() * elites.length)];
            const b = elites[Math.floor(random() * elites.length)];
            let x = a.x;
            let y = a.y;
            if (random() < cross) {
                queueCodePhase('ga-crossover');
                const t = random();
                x = a.x * t + b.x * (1 - t);
                y = a.y * t + b.y * (1 - t);
            }
            if (random() < mut) {
                queueCodePhase('ga-mutation');
                x += randRange(-0.18, 0.18, random);
                y += randRange(-0.18, 0.18, random);
            }
            x = clamp(x, -bounds, bounds);
            y = clamp(y, -bounds, bounds);
            const f = objectiveFn(x, y);
            next.push({
                x,
                y,
                vx: randRange(-1, 1, random),
                vy: randRange(-1, 1, random),
                bestX: x,
                bestY: y,
                bestF: f,
                f
            });
        }
        state.particles = next;
    };

    const stepCuckoo = () => {
        queueCodePhase('cuckoo-params');
        const { pa, step } = algoParams.cuckoo;
        state.particles.forEach((p) => {
            queueCodePhase('cuckoo-abandon');
            if (random() < pa) {
                p.x = randRange(-bounds, bounds, random);
                p.y = randRange(-bounds, bounds, random);
                return;
            }
            queueCodePhase('cuckoo-flight');
            const levyX = (random() - 0.5) * step * 0.7;
            const levyY = (random() - 0.5) * step * 0.7;
            queueCodePhase('cuckoo-best');
            p.x += levyX + 0.12 * (state.best.x - p.x);
            p.y += levyY + 0.12 * (state.best.y - p.y);
            p.x = clamp(p.x, -bounds, bounds);
            p.y = clamp(p.y, -bounds, bounds);
        });
    };

    const stepACO = () => {
        queueCodePhase('aco-params');
        const { rho, alpha, beta } = algoParams.aco;
        const noise = 0.15;
        state.particles.forEach((p) => {
            queueCodePhase('aco-direction');
            const dx = state.best.x - p.x;
            const dy = state.best.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy) + 1e-6;
            queueCodePhase('aco-desirability');
            const desirability = Math.pow(1 / dist, beta);
            queueCodePhase('aco-pheromone');
            const pheromone = Math.pow(1 - rho, alpha);
            const step = 0.12 * pheromone * desirability;
            queueCodePhase('aco-move');
            p.x = clamp(p.x + dx * step + noise * (random() - 0.5), -bounds, bounds);
            p.y = clamp(p.y + dy * step + noise * (random() - 0.5), -bounds, bounds);
        });
    };

    const stepSimulation = () => {
        if (state.iter >= iterations) {
            return;
        }
        if (algo === 'pso') {
            stepPSO();
        } else if (algo === 'firefly') {
            stepFirefly();
        } else if (algo === 'ga') {
            stepGA();
        } else if (algo === 'cuckoo') {
            stepCuckoo();
        } else {
            stepACO();
        }
        updateBest();
        queueCodePhase('iteration');
        state.iter += 1;
    };

    const applyAgents = () => {
        const values = state.particles.map((p) => p.f);
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        const range = maxVal - minVal || 1;
        state.particles.forEach((p, index) => {
            const height = mapHeight(objectiveFn(p.x, p.y));
            const value = p.f;
            const t = (value - minVal) / range;
            const fitnessGlow = 1 - t;
            dummy.position.set(p.x, height + agentRadius * 0.72, p.y);
            dummy.scale.setScalar(1 + fitnessGlow * 0.7);
            dummy.updateMatrix();
            agents.setMatrixAt(index, dummy.matrix);
            instanceColor.copy(bestTone).lerp(baseColor, t);
            agents.setColorAt(index, instanceColor);
        });
        agents.instanceMatrix.needsUpdate = true;
        if (agents.instanceColor) {
            agents.instanceColor.needsUpdate = true;
        }
        if (state.best) {
            const bestHeight = mapHeight(objectiveFn(state.best.x, state.best.y));
            bestMesh.position.set(state.best.x, bestHeight + agentRadius, state.best.y);
            bestMesh.visible = true;
        } else {
            bestMesh.visible = false;
        }
    };

    const algoLabel = document.getElementById('algoLabel');
    const objectiveLabel = document.getElementById('objectiveLabel');
    const iterLabel = document.getElementById('iterLabel');
    const bestLabel = document.getElementById('bestLabel');
    const replayButton = document.getElementById('replay3d');
    const fullscreenButton = document.getElementById('fullscreen3d');
    const threeShell = document.getElementById('three-shell');
    const algorithmTrace = document.getElementById('algorithmTrace');
    const algorithmPhase = document.getElementById('algorithmPhase');

    if (algoLabel) algoLabel.textContent = algo.toUpperCase();
    if (objectiveLabel) objectiveLabel.textContent = objectiveLabels[objective] || objective;
    const setCodePhase = (key) => {
        const lines = algorithmLines[algo] || algorithmLines.pso;
        const line = lines.find((item) => item.key === key);
        if (!line || key === currentCodePhase) {
            return;
        }
        currentCodePhase = key;
        codeLineElements.forEach((element, elementKey) => {
            element.dataset.active = elementKey === key ? 'true' : 'false';
        });
        if (algorithmPhase) {
            algorithmPhase.textContent = line.label;
        }
        codeLineElements.get(key)?.scrollIntoView({ block: 'nearest' });
    };
    const renderAlgorithmCode = () => {
        if (!algorithmTrace) {
            return;
        }
        algorithmTrace.innerHTML = '';
        codeLineElements.clear();
        const lines = algorithmLines[algo] || algorithmLines.pso;
        lines.forEach((line, index) => {
            const row = document.createElement('div');
            row.className = 'algorithm-code-line';
            row.dataset.active = 'false';
            const number = document.createElement('span');
            number.className = 'algorithm-code-line-number';
            number.textContent = String(index + 1).padStart(2, '0');
            const code = document.createElement('span');
            code.textContent = line.code;
            row.append(number, code);
            algorithmTrace.appendChild(row);
            codeLineElements.set(line.key, row);
        });
        setCodePhase((lines[0] || {}).key);
    };
    const showNextCodePhase = (timestamp) => {
        if (timestamp - lastCodePhaseAt < codePlaybackInterval) {
            return;
        }
        const nextPhase = queuedCodePhases.shift();
        if (nextPhase) {
            setCodePhase(nextPhase);
            lastCodePhaseAt = timestamp;
        }
    };
    renderAlgorithmCode();

    const legend = document.getElementById('legend');
    if (legend) {
        const colorHex = `#${agentColor.toString(16).padStart(6, '0')}`;
        legend.innerHTML = `
            <span class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full" style="background:${colorHex}"></span>
                Agentes
            </span>
            <span class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full" style="background:rgba(255, 232, 181, 0.95)"></span>
                Mejor agente
            </span>
        `;
    }

    const updateFullscreenButton = () => {
        if (fullscreenButton) {
            fullscreenButton.textContent = document.fullscreenElement ? 'Salir' : 'Pantalla';
        }
    };

    if (fullscreenButton && threeShell) {
        fullscreenButton.addEventListener('click', async () => {
            try {
                if (document.fullscreenElement) {
                    await document.exitFullscreen();
                    return;
                }
                await threeShell.requestFullscreen();
            } catch (error) {
                updateFullscreenButton();
            }
        });
        document.addEventListener('fullscreenchange', () => {
            updateFullscreenButton();
            resize();
        });
    }

    const resize = () => {
        const rect = rootEl.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
    };

    let stepBudget = 0;
    const resetSimulation = () => {
        rng = createSeededRng(seed);
        queuedCodePhases.length = 0;
        state.particles = Array.from({ length: pop }, createParticle);
        state.best = null;
        state.iter = 0;
        stepBudget = 0;
        lastCodePhaseAt = performance.now();
        updateBest();
        queuedCodePhases.length = 0;
        setCodePhase(((algorithmLines[algo] || algorithmLines.pso)[0] || {}).key);
        applyAgents();
        if (iterLabel) {
            iterLabel.textContent = String(state.iter);
        }
        if (bestLabel) {
            bestLabel.textContent = state.best ? state.best.f.toFixed(4) : '-';
        }
    };

    if (replayButton) {
        replayButton.addEventListener('click', resetSimulation);
    }

    const animate = (timestamp = performance.now()) => {
        stepBudget += speed;
        const steps = Math.floor(stepBudget);
        for (let i = 0; i < steps; i += 1) {
            stepSimulation();
        }
        stepBudget -= steps;
        showNextCodePhase(timestamp);
        applyAgents();
        if (iterLabel) iterLabel.textContent = String(state.iter);
        if (bestLabel && state.best) bestLabel.textContent = state.best.f.toFixed(4);
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    resetSimulation();
    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(animate);
}
