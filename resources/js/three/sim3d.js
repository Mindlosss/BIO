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
    const speed = Math.max(0.1, Number(params.get('speed') || 0.5));
    const iterations = Math.max(1, Number(params.get('iterations') || 100));
    const seed = Number(params.get('seed') || Date.now());

    const rng = createSeededRng(seed);
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

    const [
        {
            Scene,
            PerspectiveCamera,
            WebGLRenderer,
            Color,
            AmbientLight,
            DirectionalLight,
            PlaneGeometry,
            MeshStandardMaterial,
            Mesh,
            SphereGeometry,
            InstancedMesh,
            Object3D,
            WireframeGeometry,
            LineSegments,
            LineBasicMaterial
        },
        { OrbitControls }
    ] = await Promise.all([
        import('three'),
        import('three/examples/jsm/controls/OrbitControls.js')
    ]);

    const scene = new Scene();
    scene.background = new Color(0x0f1413);
    const baseColor = new Color(agentColor);
    const bestTone = new Color(0xffd28a);

    const camera = new PerspectiveCamera(50, 1, 0.1, 2000);
    camera.position.set(bounds * 2, bounds * 1.4, bounds * 2);

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    rootEl.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = bounds * 0.8;
    controls.maxDistance = bounds * 6;

    const ambient = new AmbientLight(0xffffff, 0.6);
    const directional = new DirectionalLight(0xffffff, 0.9);
    directional.position.set(bounds * 2, bounds * 3, bounds * 1.5);
    scene.add(ambient, directional);

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
        color: 0x173126,
        metalness: 0.1,
        roughness: 0.8,
        side: 2
    });
    const surface = new Mesh(surfaceGeometry, surfaceMaterial);
    surface.rotation.x = -Math.PI / 2;
    scene.add(surface);

    const wireframe = new LineSegments(
        new WireframeGeometry(surfaceGeometry),
        new LineBasicMaterial({ color: 0x2bd1a7, opacity: 0.25, transparent: true })
    );
    wireframe.rotation.x = -Math.PI / 2;
    scene.add(wireframe);

    const agentGeometry = new SphereGeometry(Math.max(0.08, bounds * 0.03), 16, 16);
    const agentMaterial = new MeshStandardMaterial({ vertexColors: true });
    const agents = new InstancedMesh(agentGeometry, agentMaterial, pop);
    const dummy = new Object3D();
    const instanceColor = new Color();
    scene.add(agents);
    const bestMaterial = new MeshStandardMaterial({
        color: 0xffe8b5,
        emissive: 0xffd28a,
        emissiveIntensity: 0.4
    });
    const bestMesh = new Mesh(new SphereGeometry(Math.max(0.12, bounds * 0.045), 18, 18), bestMaterial);
    scene.add(bestMesh);

    const state = {
        bounds,
        particles: [],
        best: null,
        iter: 0
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

    state.particles = Array.from({ length: pop }, createParticle);

    const updateBest = () => {
        state.particles.forEach((p) => {
            p.f = objectiveFn(p.x, p.y);
            if (p.f < p.bestF) {
                p.bestF = p.f;
                p.bestX = p.x;
                p.bestY = p.y;
            }
            if (!state.best || p.f < state.best.f) {
                state.best = { x: p.x, y: p.y, f: p.f };
            }
        });
    };

    const stepPSO = () => {
        const moveScale = 0.15;
        const { w, c1, c2 } = algoParams.pso;
        state.particles.forEach((p) => {
            const r1 = random();
            const r2 = random();
            const vx = w * p.vx + c1 * r1 * (p.bestX - p.x) + c2 * r2 * (state.best.x - p.x);
            const vy = w * p.vy + c1 * r1 * (p.bestY - p.y) + c2 * r2 * (state.best.y - p.y);
            p.vx = clamp(vx, -0.6, 0.6);
            p.vy = clamp(vy, -0.6, 0.6);
            p.x = clamp(p.x + p.vx * moveScale, -bounds, bounds);
            p.y = clamp(p.y + p.vy * moveScale, -bounds, bounds);
        });
    };

    const stepFirefly = () => {
        const { beta, gamma, alpha } = algoParams.firefly;
        for (let i = 0; i < state.particles.length; i += 1) {
            for (let j = 0; j < state.particles.length; j += 1) {
                const pi = state.particles[i];
                const pj = state.particles[j];
                if (pj.f < pi.f) {
                    const dx = pj.x - pi.x;
                    const dy = pj.y - pi.y;
                    const distSq = dx * dx + dy * dy;
                    const betaVal = beta * Math.exp(-gamma * distSq);
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
        const scored = state.particles
            .map((p) => ({ p, f: objectiveFn(p.x, p.y) }))
            .sort((a, b) => a.f - b.f);
        const eliteCount = Math.max(2, Math.floor(scored.length * elite));
        const elites = scored.slice(0, eliteCount).map((item) => item.p);
        const next = [...elites];
        while (next.length < scored.length) {
            const a = elites[Math.floor(random() * elites.length)];
            const b = elites[Math.floor(random() * elites.length)];
            let x = a.x;
            let y = a.y;
            if (random() < cross) {
                const t = random();
                x = a.x * t + b.x * (1 - t);
                y = a.y * t + b.y * (1 - t);
            }
            if (random() < mut) {
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
        const { pa, step } = algoParams.cuckoo;
        state.particles.forEach((p) => {
            if (random() < pa) {
                p.x = randRange(-bounds, bounds, random);
                p.y = randRange(-bounds, bounds, random);
                return;
            }
            const levyX = (random() - 0.5) * step * 0.7;
            const levyY = (random() - 0.5) * step * 0.7;
            p.x += levyX + 0.12 * (state.best.x - p.x);
            p.y += levyY + 0.12 * (state.best.y - p.y);
            p.x = clamp(p.x, -bounds, bounds);
            p.y = clamp(p.y, -bounds, bounds);
        });
    };

    const stepACO = () => {
        const { rho, alpha, beta } = algoParams.aco;
        const noise = 0.15;
        state.particles.forEach((p) => {
            const dx = state.best.x - p.x;
            const dy = state.best.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy) + 1e-6;
            const desirability = Math.pow(1 / dist, beta);
            const pheromone = Math.pow(1 - rho, alpha);
            const step = 0.12 * pheromone * desirability;
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
        state.iter += 1;
    };

    const applyAgents = () => {
        const values = state.particles.map((p) => p.f);
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        const range = maxVal - minVal || 1;
        state.particles.forEach((p, index) => {
            const height = mapHeight(objectiveFn(p.x, p.y));
            dummy.position.set(p.x, height, p.y);
            dummy.updateMatrix();
            agents.setMatrixAt(index, dummy.matrix);
            const value = p.f;
            const t = (value - minVal) / range;
            instanceColor.copy(bestTone).lerp(baseColor, t);
            agents.setColorAt(index, instanceColor);
        });
        agents.instanceMatrix.needsUpdate = true;
        if (agents.instanceColor) {
            agents.instanceColor.needsUpdate = true;
        }
        if (state.best) {
            const bestHeight = mapHeight(objectiveFn(state.best.x, state.best.y));
            bestMesh.position.set(state.best.x, bestHeight, state.best.y);
            bestMesh.visible = true;
        } else {
            bestMesh.visible = false;
        }
    };

    const algoLabel = document.getElementById('algoLabel');
    const objectiveLabel = document.getElementById('objectiveLabel');
    const iterLabel = document.getElementById('iterLabel');
    const bestLabel = document.getElementById('bestLabel');

    if (algoLabel) algoLabel.textContent = algo.toUpperCase();
    if (objectiveLabel) objectiveLabel.textContent = objective;
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

    const resize = () => {
        const rect = rootEl.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
    };

    let stepBudget = 0;
    const animate = () => {
        stepBudget += speed;
        const steps = Math.floor(stepBudget);
        for (let i = 0; i < steps; i += 1) {
            stepSimulation();
        }
        stepBudget -= steps;
        applyAgents();
        if (iterLabel) iterLabel.textContent = String(state.iter);
        if (bestLabel && state.best) bestLabel.textContent = state.best.f.toFixed(4);
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    updateBest();
    resize();
    applyAgents();
    window.addEventListener('resize', resize);
    requestAnimationFrame(animate);
}
