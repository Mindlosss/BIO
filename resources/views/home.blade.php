<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'Firefly') }}</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body data-page="bio-sim" data-sim3d-url="{{ route('sim.3d') }}" class="min-h-screen">
        <div class="mx-auto grid w-[min(96vw,1680px)] max-w-[1680px] gap-6 px-5 pb-12 pt-7">
            @include('partials.auth-navbar')
            <header class="flex flex-wrap items-center justify-between gap-4">
                <div class="max-w-2xl">
                    <div class="text-[clamp(2rem,3vw,3.1rem)] font-bold tracking-tight">Simulator</div>
                    <div class="mt-2 max-w-[640px] leading-relaxed text-[color:var(--ink-dim)]">
                        Simulador de algoritmos bioinspirados con vista 2D, vista 3D y grafica de convergencia.
                        Elige el algoritmo y la funcion objetivo, define el modo de convergencia y personaliza
                        los parametros para observar la busqueda en tiempo real.
                    </div>
                </div>
                <a class="rounded-full border border-[rgba(255,122,26,0.5)] bg-[rgba(255,122,26,0.18)] px-3 py-2 text-sm text-[color:var(--ink)]"
                    href="{{ route('comparison') }}">
                    Modo comparacion
                </a>
            </header>

            <div class="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
                <aside class="rounded-[18px] border border-white/10 bg-[rgba(17,25,22,0.72)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[14px]">
                    <div class="grid gap-5">
                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]" for="algo">Algoritmo</label>
                            <select id="algo" class="w-full rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] px-3 py-2 text-sm text-[color:var(--ink)]">
                                <option value="pso">PSO (Particle Swarm)</option>
                                <option value="firefly">Firefly</option>
                                <option value="ga">Genetic Algorithm</option>
                                <option value="cuckoo">Cuckoo Search</option>
                                <option value="aco">ACO (Ant Colony)</option>
                            </select>
                        </div>
                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]" for="objective">Funcion objetivo</label>
                            <select id="objective" class="w-full rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] px-3 py-2 text-sm text-[color:var(--ink)]">
                                <option value="sphere">Sphere</option>
                                <option value="rastrigin">Rastrigin</option>
                                <option value="rosenbrock">Rosenbrock</option>
                                <option value="ackley">Ackley</option>
                                <option value="griewank">Griewank</option>
                                <option value="styblinski">Styblinski-Tang</option>
                                <option value="schwefel">Schwefel</option>
                            </select>
                        </div>
                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]" for="surfaceMode">Superficie</label>
                            <label class="flex items-center gap-3 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-2 text-sm text-[color:var(--ink-dim)]">
                                <input id="surfaceMode" type="checkbox" class="accent-[rgb(255,122,26)]">
                                <span>Vista popular (sin suavizado)</span>
                            </label>
                        </div>
                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]" for="convergence">Modo de convergencia</label>
                            <select id="convergence" class="w-full rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] px-3 py-2 text-sm text-[color:var(--ink)]">
                                <option value="exploracion">Exploracion</option>
                                <option value="equilibrado" selected>Equilibrado</option>
                                <option value="optimo">Optimo</option>
                            </select>
                        </div>
                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]" for="bounds">Dominio (limite)</label>
                            <input id="bounds" type="number" min="2" max="20" step="1" value="5"
                                class="w-full rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] px-3 py-2 text-sm text-[color:var(--ink)]">
                        </div>
                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]" for="pop">Poblacion</label>
                            <input id="pop" type="number" min="10" max="300" value="60"
                                class="w-full rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] px-3 py-2 text-sm text-[color:var(--ink)]">
                        </div>
                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]" for="iterations">Iteraciones</label>
                            <input id="iterations" type="number" min="10" max="5000" step="10" value="100"
                                class="w-full rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] px-3 py-2 text-sm text-[color:var(--ink)]">
                        </div>
                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]" for="speed">Velocidad (camara lenta)</label>
                            <div class="grid grid-cols-[1fr_auto] items-center gap-3">
                                <input id="speed" type="range" min="0.1" max="4" step="0.1" value="0.5"
                                    class="h-9 w-full accent-[rgb(43,209,167)]">
                                <span id="speedValue" class="font-mono text-sm text-[rgb(43,209,167)]">0.5x</span>
                            </div>
                        </div>

                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Parametros</label>
                            <div class="param hidden grid gap-2 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] p-3" data-algo="pso">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Inercia w</span>
                                    <span id="psoWValue" class="font-mono text-[rgb(43,209,167)]">0.72</span>
                                </div>
                                <input id="psoW" type="range" min="0.3" max="0.95" step="0.01" value="0.72"
                                    class="h-9 w-full accent-[rgb(255,122,26)]">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>c1</span>
                                    <span id="psoC1Value" class="font-mono text-[rgb(43,209,167)]">1.5</span>
                                </div>
                                <input id="psoC1" type="range" min="0.5" max="3" step="0.05" value="1.5"
                                    class="h-9 w-full accent-[rgb(255,122,26)]">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>c2</span>
                                    <span id="psoC2Value" class="font-mono text-[rgb(43,209,167)]">1.7</span>
                                </div>
                                <input id="psoC2" type="range" min="0.5" max="3" step="0.05" value="1.7"
                                    class="h-9 w-full accent-[rgb(255,122,26)]">
                                <button type="button" data-open-3d
                                    class="mt-2 rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)] transition hover:-translate-y-0.5">
                                    Abrir 3D
                                </button>
                            </div>
                            <div class="param hidden grid gap-2 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] p-3" data-algo="firefly">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Beta0</span>
                                    <span id="ffBetaValue" class="font-mono text-[rgb(43,209,167)]">1.0</span>
                                </div>
                                <input id="ffBeta" type="range" min="0.2" max="2" step="0.05" value="1.0"
                                    class="h-9 w-full accent-[rgb(255,122,26)]">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Gamma</span>
                                    <span id="ffGammaValue" class="font-mono text-[rgb(43,209,167)]">0.35</span>
                                </div>
                                <input id="ffGamma" type="range" min="0.05" max="1" step="0.05" value="0.35"
                                    class="h-9 w-full accent-[rgb(255,122,26)]">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Alpha</span>
                                    <span id="ffAlphaValue" class="font-mono text-[rgb(43,209,167)]">0.25</span>
                                </div>
                                <input id="ffAlpha" type="range" min="0" max="0.8" step="0.05" value="0.25"
                                    class="h-9 w-full accent-[rgb(255,122,26)]">
                                <button type="button" data-open-3d
                                    class="mt-2 rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)] transition hover:-translate-y-0.5">
                                    Abrir 3D real
                                </button>
                            </div>
                            <div class="param hidden grid gap-2 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] p-3" data-algo="ga">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Elite rate</span>
                                    <span id="gaEliteValue" class="font-mono text-[rgb(43,209,167)]">0.25</span>
                                </div>
                                <input id="gaElite" type="range" min="0.1" max="0.5" step="0.02" value="0.25"
                                    class="h-9 w-full accent-[rgb(255,122,26)]">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Mutation</span>
                                    <span id="gaMutValue" class="font-mono text-[rgb(43,209,167)]">0.25</span>
                                </div>
                                <input id="gaMut" type="range" min="0" max="0.8" step="0.05" value="0.25"
                                    class="h-9 w-full accent-[rgb(255,122,26)]">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Crossover</span>
                                    <span id="gaCrossValue" class="font-mono text-[rgb(43,209,167)]">0.6</span>
                                </div>
                                <input id="gaCross" type="range" min="0" max="1" step="0.05" value="0.6"
                                    class="h-9 w-full accent-[rgb(255,122,26)]">
                                <button type="button" data-open-3d
                                    class="mt-2 rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)] transition hover:-translate-y-0.5">
                                    Abrir 3D real
                                </button>
                            </div>
                            <div class="param hidden grid gap-2 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] p-3" data-algo="cuckoo">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Pa</span>
                                    <span id="ckPaValue" class="font-mono text-[rgb(43,209,167)]">0.25</span>
                                </div>
                                <input id="ckPa" type="range" min="0.05" max="0.6" step="0.05" value="0.25"
                                    class="h-9 w-full accent-[rgb(255,122,26)]">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Step</span>
                                    <span id="ckStepValue" class="font-mono text-[rgb(43,209,167)]">0.7</span>
                                </div>
                                <input id="ckStep" type="range" min="0.1" max="1.2" step="0.05" value="0.7"
                                    class="h-9 w-full accent-[rgb(255,122,26)]">
                                <button type="button" data-open-3d
                                    class="mt-2 rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)] transition hover:-translate-y-0.5">
                                    Abrir 3D real
                                </button>
                            </div>
                            <div class="param hidden grid gap-2 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] p-3" data-algo="aco">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Evap rho</span>
                                    <span id="acoRhoValue" class="font-mono text-[rgb(43,209,167)]">0.35</span>
                                </div>
                                <input id="acoRho" type="range" min="0.05" max="0.8" step="0.05" value="0.35"
                                    class="h-9 w-full accent-[rgb(255,122,26)]">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Alpha</span>
                                    <span id="acoAlphaValue" class="font-mono text-[rgb(43,209,167)]">1.0</span>
                                </div>
                                <input id="acoAlpha" type="range" min="0.2" max="2.5" step="0.1" value="1.0"
                                    class="h-9 w-full accent-[rgb(255,122,26)]">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Beta</span>
                                    <span id="acoBetaValue" class="font-mono text-[rgb(43,209,167)]">2.0</span>
                                </div>
                                <input id="acoBeta" type="range" min="0.5" max="4" step="0.1" value="2.0"
                                    class="h-9 w-full accent-[rgb(255,122,26)]">
                                <button type="button" data-open-3d
                                    class="mt-2 rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)] transition hover:-translate-y-0.5">
                                    Abrir 3D real
                                </button>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-2">
                            <button id="toggle"
                                class="rounded-xl bg-[linear-gradient(135deg,#ff7a1a,#ffb36b)] px-4 py-3 text-sm font-semibold text-[#0e0f0f] shadow-[0_10px_25px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5">
                                Start
                            </button>
                            <button id="reset"
                                class="rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-4 py-3 text-sm font-semibold text-[color:var(--ink)] transition hover:-translate-y-0.5">
                                Reset
                            </button>
                        </div>
                        <div id="stats" class="grid gap-1 rounded-[14px] bg-[rgba(12,18,16,0.6)] p-4 font-mono text-xs text-[color:var(--ink-dim)]">
                            <div>Iter: <strong id="iter" class="text-[rgb(43,209,167)]">0</strong></div>
                            <div>Best f: <strong id="bestF" class="text-[rgb(43,209,167)]">-</strong></div>
                            <div>Best x,y: <strong id="bestXY" class="text-[rgb(43,209,167)]">-</strong></div>
                        </div>
                        <div class="grid gap-2 text-[0.92rem] text-[color:var(--ink-dim)]">
                            <div id="algoTag" class="font-mono text-xs text-[rgb(255,122,26)]">PSO</div>
                            <div id="algoDesc">
                                Enjambre de particulas con memoria personal y global para converger al optimo.
                            </div>
                        </div>
                    </div>
                </aside>

                <section class="grid gap-6">
                    <div class="grid gap-3 rounded-[18px] border border-white/10 bg-[rgba(16,23,20,0.68)] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[8px] animate-[floatIn_0.8s_ease_both]">
                        <div class="flex items-center justify-between gap-3 text-[0.95rem] text-[color:var(--ink-dim)]">
                            <div>Vista 2D (posiciones)</div>
                            <div id="domainTag" class="font-mono text-xs text-[rgb(255,122,26)]">Dominio: [-5, 5]</div>
                        </div>
                        <canvas id="canvas2d"
                            class="h-[320px] w-full rounded-[14px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(43,209,167,0.08),transparent_55%),rgba(8,12,10,0.85)]"></canvas>
                    </div>
                    <div class="grid gap-3 rounded-[18px] border border-white/10 bg-[rgba(16,23,20,0.68)] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[8px] animate-[floatIn_0.8s_ease_both]">
                        <div class="flex items-center justify-between gap-3 text-[0.95rem] text-[color:var(--ink-dim)]">
                            <div>Vista 3D (superficie + agentes)</div>
                            <div class="font-mono text-xs text-[color:var(--ink-dim)]">Proyeccion isometrica</div>
                        </div>
                        <canvas id="canvas3d"
                            class="h-[320px] w-full rounded-[14px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(43,209,167,0.08),transparent_55%),rgba(8,12,10,0.85)]"></canvas>
                    </div>
                    <div class="grid gap-3 rounded-[18px] border border-white/10 bg-[rgba(16,23,20,0.68)] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[8px] animate-[floatIn_0.8s_ease_both]">
                        <div class="flex items-center justify-between gap-3 text-[0.95rem] text-[color:var(--ink-dim)]">
                            <div>Convergencia</div>
                            <div class="font-mono text-xs text-[color:var(--ink-dim)]">Mejor fitness por iteracion</div>
                        </div>
                        <div id="chartLegend" class="flex flex-wrap gap-3 text-xs text-[color:var(--ink-dim)]"></div>
                        <canvas id="canvasChart"
                            class="h-[220px] w-full rounded-[14px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(43,209,167,0.08),transparent_55%),rgba(8,12,10,0.85)]"></canvas>
                    </div>
                </section>
            </div>
        </div>
    </body>
</html>
