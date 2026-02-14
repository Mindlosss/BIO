<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>{{ config('app.name', 'Firefly') }}</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body data-page="bio-sim" data-sim3d-url="{{ route('sim.3d') }}" data-history-url="{{ route('history.store') }}" data-nn-url="{{ route('nn.suggest') }}" class="min-h-screen">
        <div class="mx-auto grid w-[min(96vw,1680px)] max-w-[1680px] gap-6 px-5 pb-12 pt-7">
            @include('partials.auth-navbar')
            <header class="flex flex-wrap items-center justify-between gap-4">
                <div class="max-w-2xl">
                    <div class="text-[clamp(2rem,3vw,3.1rem)] font-bold tracking-tight">Simulador</div>
                    {{-- <div class="mt-2 max-w-[640px] leading-relaxed text-[color:var(--ink-dim)]">
                        Simulador de algoritmos bioinspirados con vista 2D, vista 3D y grafica de convergencia.
                        Elige el algoritmo y la funcion objetivo, define el modo de convergencia y personaliza
                        los parametros para observar la busqueda en tiempo real.
                    </div> --}}
                </div>
            </header>

            <div class="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
                <aside class="rounded-[18px] border border-white/10 bg-[rgba(17,25,22,0.72)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[14px]">
                    <div class="grid gap-5">
                        
                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Algoritmo</label>
                            <div class="custom-select-container" id="algoSelectWrapper">
                                <select id="algo" class="hidden">
                                    <option value="pso" selected>PSO (Particle Swarm)</option>
                                    <option value="firefly">Firefly</option>
                                    <option value="ga">Genetic Algorithm</option>
                                    <option value="cuckoo">Cuckoo Search</option>
                                    <option value="aco">ACO (Ant Colony)</option>
                                </select>
                                <div class="select-trigger">
                                    <span class="current-value">PSO (Particle Swarm)</span>
                                    <svg class="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                                <div class="select-options">
                                    <div class="custom-option selected" data-value="pso">PSO (Particle Swarm)</div>
                                    <div class="custom-option" data-value="firefly">Firefly</div>
                                    <div class="custom-option" data-value="ga">Genetic Algorithm</div>
                                    <div class="custom-option" data-value="cuckoo">Cuckoo Search</div>
                                    <div class="custom-option" data-value="aco">ACO (Ant Colony)</div>
                                </div>
                            </div>
                        </div>

                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Funcion objetivo</label>
                            <div class="custom-select-container" id="objectiveSelectWrapper">
                                <select id="objective" class="hidden">
                                    <option value="sphere" selected>Sphere</option>
                                    <option value="rastrigin">Rastrigin</option>
                                    <option value="rosenbrock">Rosenbrock</option>
                                    <option value="ackley">Ackley</option>
                                    <option value="griewank">Griewank</option>
                                    <option value="styblinski">Styblinski-Tang</option>
                                    <option value="schwefel">Schwefel</option>
                                </select>
                                <div class="select-trigger">
                                    <span class="current-value">Sphere</span>
                                    <svg class="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                                <div class="select-options">
                                    <div class="custom-option selected" data-value="sphere">Sphere</div>
                                    <div class="custom-option" data-value="rastrigin">Rastrigin</div>
                                    <div class="custom-option" data-value="rosenbrock">Rosenbrock</div>
                                    <div class="custom-option" data-value="ackley">Ackley</div>
                                    <div class="custom-option" data-value="griewank">Griewank</div>
                                    <div class="custom-option" data-value="styblinski">Styblinski-Tang</div>
                                    <div class="custom-option" data-value="schwefel">Schwefel</div>
                                </div>
                            </div>
                        </div>

                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Superficie</label>
                            <label class="group flex cursor-pointer items-center gap-3 text-sm text-[color:var(--ink-dim)] transition-colors">
                                <div class="relative">
                                    <input id="surfaceMode" type="checkbox" class="peer sr-only" checked>
                                    
                                    <div class="h-7 w-12 rounded-full bg-[#232B28] transition-colors peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF7A1A]/20"></div>
                                    
                                    <div class="absolute left-1 top-1 h-5 w-5 rounded-full bg-[#555E5B] transition-all duration-200 peer-checked:translate-x-5 peer-checked:bg-[#FF7A1A]"></div>
                                </div>
                                <span>Vista popular (sin suavizado)</span>
                            </label>
                        </div>

                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Modo de convergencia</label>
                            <div class="custom-select-container" id="convergenceSelectWrapper">
                                <select id="convergence" class="hidden">
                                    <option value="exploracion">Exploracion</option>
                                    <option value="equilibrado" selected>Equilibrado</option>
                                    <option value="optimo">Optimo</option>
                                </select>
                                <div class="select-trigger">
                                    <span class="current-value">Equilibrado</span>
                                    <svg class="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                                <div class="select-options">
                                    <div class="custom-option" data-value="exploracion">Exploracion</div>
                                    <div class="custom-option selected" data-value="equilibrado">Equilibrado</div>
                                    <div class="custom-option" data-value="optimo">Optimo</div>
                                </div>
                            </div>
                        </div>

                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]" for="bounds">Dominio (limite)</label>
                            <div class="grid grid-cols-[auto_1fr_auto] gap-2">
                                <button type="button" onclick="stepInput('bounds', -1)" class="h-full w-9 rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] text-[color:var(--ink)] hover:bg-white/5 active:bg-white/10">-</button>
                                <input id="bounds" type="number" min="2" max="20" step="1" value="5"
                                    class="w-full rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] px-3 py-2 text-center text-sm text-[color:var(--ink)]">
                                <button type="button" onclick="stepInput('bounds', 1)" class="h-full w-9 rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] text-[color:var(--ink)] hover:bg-white/5 active:bg-white/10">+</button>
                            </div>
                        </div>

                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]" for="pop">Poblacion</label>
                            <div class="grid grid-cols-[auto_1fr_auto] gap-2">
                                <button type="button" onclick="stepInput('pop', -1)" class="h-full w-9 rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] text-[color:var(--ink)] hover:bg-white/5 active:bg-white/10">-</button>
                                <input id="pop" type="number" min="10" max="300" value="60"
                                    class="w-full rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] px-3 py-2 text-center text-sm text-[color:var(--ink)]">
                                <button type="button" onclick="stepInput('pop', 1)" class="h-full w-9 rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] text-[color:var(--ink)] hover:bg-white/5 active:bg-white/10">+</button>
                            </div>
                        </div>

                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]" for="iterations">Iteraciones</label>
                            <div class="grid grid-cols-[auto_1fr_auto] gap-2">
                                <button type="button" onclick="document.getElementById('iterations').stepDown()" class="h-full w-9 rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] text-[color:var(--ink)] hover:bg-white/5 active:bg-white/10">-</button>
                                <input id="iterations" type="number" min="10" max="5000" step="10" value="100"
                                    class="w-full rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] px-3 py-2 text-center text-sm text-[color:var(--ink)]">
                                <button type="button" onclick="document.getElementById('iterations').stepUp()" class="h-full w-9 rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] text-[color:var(--ink)] hover:bg-white/5 active:bg-white/10">+</button>
                            </div>
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
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]" for="seed">Semilla</label>
                            <div class="grid grid-cols-[1fr_auto_auto] items-center gap-2">
                                <input id="seed" type="number" min="1" max="2147483647" value="1337"
                                    class="w-full rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] px-3 py-2 text-sm text-[color:var(--ink)]">
                                <button id="seedRepeat" type="button"
                                    class="rounded-xl border border-white/10 px-3 py-2 text-xs text-[color:var(--ink-dim)]">Repetir</button>
                                <button id="seedRandom" type="button"
                                    class="rounded-xl border border-white/10 px-3 py-2 text-xs text-[color:var(--ink-dim)]">Nueva</button>
                            </div>
                       
                        </div>
                        <label class="group flex cursor-pointer items-center gap-3 
                            rounded-xl border border-white/10 
                            bg-[rgba(12,18,16,0.6)] 
                            px-3 py-2 text-sm transition 
                            hover:border-[rgba(255,122,26,0.5)]">

                            <input type="checkbox" id="chk-trayectoria" class="peer hidden" checked>
                            <span class="flex h-5 w-5 items-center justify-center 
                                rounded-md border border-white/20 
                                bg-[rgba(0,0,0,0.3)] transition-all">

                                <svg class="h-3 w-3 scale-0 text-[rgb(255,122,26)] transition-all"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                    <path d="M5 13l4 4L19 7" />
                                </svg>
                            </span>

                            <span class="text-[color:var(--ink-dim)] group-hover:text-[color:var(--ink)]">
                                Mostrar trayectoria
                            </span>
                        </label>
                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Parametros</label>
                            <div class="param hidden grid gap-2 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] p-3" data-algo="pso">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]" title="Inercia alta = explora mas, baja = converge rapido.">
                                    <span>Inercia w</span>
                                    <span id="psoWValue" class="font-mono text-[rgb(43,209,167)]">0.72</span>
                                </div>
                                <input id="psoW" type="range" min="0.3" max="0.95" step="0.01" value="0.72"
                                    class="h-9 w-full accent-[rgb(255,122,26)]">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]" title="C1: atraccion a la mejor solucion propia.">
                                    <span>c1</span>
                                    <span id="psoC1Value" class="font-mono text-[rgb(43,209,167)]">1.5</span>
                                </div>
                                <input id="psoC1" type="range" min="0.5" max="3" step="0.05" value="1.5"
                                    class="h-9 w-full accent-[rgb(255,122,26)]">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]" title="C2: atraccion a la mejor solucion global.">
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
                                <input id="ffBeta" type="range" min="0.2" max="2" step="0.05" value="1.0" class="h-9 w-full accent-[rgb(255,122,26)]">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Gamma</span>
                                    <span id="ffGammaValue" class="font-mono text-[rgb(43,209,167)]">0.35</span>
                                </div>
                                <input id="ffGamma" type="range" min="0.05" max="1" step="0.05" value="0.35" class="h-9 w-full accent-[rgb(255,122,26)]">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Alpha</span>
                                    <span id="ffAlphaValue" class="font-mono text-[rgb(43,209,167)]">0.25</span>
                                </div>
                                <input id="ffAlpha" type="range" min="0" max="0.8" step="0.05" value="0.25" class="h-9 w-full accent-[rgb(255,122,26)]">
                                <button type="button" data-open-3d class="mt-2 rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)] transition hover:-translate-y-0.5">Abrir 3D real</button>
                            </div>
                            <div class="param hidden grid gap-2 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] p-3" data-algo="ga">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Elite rate</span>
                                    <span id="gaEliteValue" class="font-mono text-[rgb(43,209,167)]">0.25</span>
                                </div>
                                <input id="gaElite" type="range" min="0.1" max="0.5" step="0.02" value="0.25" class="h-9 w-full accent-[rgb(255,122,26)]">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Mutation</span>
                                    <span id="gaMutValue" class="font-mono text-[rgb(43,209,167)]">0.25</span>
                                </div>
                                <input id="gaMut" type="range" min="0" max="0.8" step="0.05" value="0.25" class="h-9 w-full accent-[rgb(255,122,26)]">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Crossover</span>
                                    <span id="gaCrossValue" class="font-mono text-[rgb(43,209,167)]">0.6</span>
                                </div>
                                <input id="gaCross" type="range" min="0" max="1" step="0.05" value="0.6" class="h-9 w-full accent-[rgb(255,122,26)]">
                                <button type="button" data-open-3d class="mt-2 rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)] transition hover:-translate-y-0.5">Abrir 3D real</button>
                            </div>
                            <div class="param hidden grid gap-2 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] p-3" data-algo="cuckoo">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Pa</span>
                                    <span id="ckPaValue" class="font-mono text-[rgb(43,209,167)]">0.25</span>
                                </div>
                                <input id="ckPa" type="range" min="0.05" max="0.6" step="0.05" value="0.25" class="h-9 w-full accent-[rgb(255,122,26)]">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Step</span>
                                    <span id="ckStepValue" class="font-mono text-[rgb(43,209,167)]">0.7</span>
                                </div>
                                <input id="ckStep" type="range" min="0.1" max="1.2" step="0.05" value="0.7" class="h-9 w-full accent-[rgb(255,122,26)]">
                                <button type="button" data-open-3d class="mt-2 rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)] transition hover:-translate-y-0.5">Abrir 3D real</button>
                            </div>
                             <div class="param hidden grid gap-2 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] p-3" data-algo="aco">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Evap rho</span>
                                    <span id="acoRhoValue" class="font-mono text-[rgb(43,209,167)]">0.35</span>
                                </div>
                                <input id="acoRho" type="range" min="0.05" max="0.8" step="0.05" value="0.35" class="h-9 w-full accent-[rgb(255,122,26)]">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Alpha</span>
                                    <span id="acoAlphaValue" class="font-mono text-[rgb(43,209,167)]">1.0</span>
                                </div>
                                <input id="acoAlpha" type="range" min="0.2" max="2.5" step="0.1" value="1.0" class="h-9 w-full accent-[rgb(255,122,26)]">
                                <div class="flex items-center justify-between text-sm text-[color:var(--ink-dim)]">
                                    <span>Beta</span>
                                    <span id="acoBetaValue" class="font-mono text-[rgb(43,209,167)]">2.0</span>
                                </div>
                                <input id="acoBeta" type="range" min="0.5" max="4" step="0.1" value="2.0" class="h-9 w-full accent-[rgb(255,122,26)]">
                                <button type="button" data-open-3d class="mt-2 rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)] transition hover:-translate-y-0.5">Abrir 3D real</button>
                            </div>
                        </div>

                        <div class="grid grid-cols-3 gap-2">
                            <button id="toggle"
                                class="rounded-xl bg-[linear-gradient(135deg,#ff7a1a,#ffb36b)] px-4 py-3 text-sm font-semibold text-[#0e0f0f] shadow-[0_10px_25px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5">
                                Start
                            </button>
                            <button id="step"
                                class="rounded-xl border border-[rgba(255,122,26,0.4)] bg-[rgba(255,122,26,0.12)] px-4 py-3 text-sm font-semibold text-[color:var(--ink)] transition hover:-translate-y-0.5">
                                Paso
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
                            <div>Prom f: <strong id="avgF" class="text-[rgb(43,209,167)]">-</strong></div>
                            <div>Diversidad: <strong id="diversity" class="text-[rgb(43,209,167)]">-</strong></div>
                        </div>
                        <div class="grid gap-2 text-[0.92rem] text-[color:var(--ink-dim)]">
                            <div id="algoTag" class="font-mono text-xs text-[rgb(255,122,26)]">PSO</div>
                            <div id="algoDesc">
                                Enjambre de particulas con memoria personal y global para converger al optimo.
                            </div>
                        </div>
                        <div class="grid gap-3 rounded-[14px] border border-white/10 bg-[rgba(12,18,16,0.6)] p-4 text-sm text-[color:var(--ink-dim)]">
                            <div class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Red neuronal</div>
                            <div id="nnStatus">Entrena la red con tu historial de simulaciones.</div>
                            <div id="nnSuggestion" class="text-[color:var(--ink)]"></div>
                            <div class="grid grid-cols-2 gap-2">
                                <button id="nnTrain" type="button"
                                    class="rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)] transition hover:-translate-y-0.5">
                                    Entrenar
                                </button>
                                <button id="nnApply" type="button" disabled
                                    class="rounded-xl border border-white/10 bg-[rgba(25,38,33,0.6)] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink-dim)]">
                                    Aplicar
                                </button>
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
                        <div class="grid gap-3 md:grid-cols-2">
                            <div class="grid gap-2">
                                <div class="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Diversidad</div>
                                <canvas id="canvasDiversity"
                                    class="h-[120px] w-full rounded-[12px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,122,26,0.08),transparent_55%),rgba(8,12,10,0.85)]"></canvas>
                            </div>
                            <div class="grid gap-2">
                                <div class="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Promedio fitness</div>
                                <canvas id="canvasAvg"
                                    class="h-[120px] w-full rounded-[12px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(43,209,167,0.08),transparent_55%),rgba(8,12,10,0.85)]"></canvas>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>

        <script>
            function stepInput(id, amount) {
                const input = document.getElementById(id);
                let val = parseInt(input.value) || 0;
                val += amount;
                
                const min = parseInt(input.getAttribute('min'));
                const max = parseInt(input.getAttribute('max'));
                
                if (!isNaN(min) && val < min) val = min;
                if (!isNaN(max) && val > max) val = max;
                
                input.value = val;
                input.dispatchEvent(new Event('change'));
            }

            document.querySelectorAll('.custom-select-container').forEach(container => {
                const trigger = container.querySelector('.select-trigger');
                const options = container.querySelector('.select-options');
                const nativeSelect = container.querySelector('select');
                const currentValueSpan = container.querySelector('.current-value');

                trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    document.querySelectorAll('.select-options').forEach(opt => {
                        if(opt !== options) opt.classList.remove('open');
                    });
                    document.querySelectorAll('.custom-select-container').forEach(c => {
                       if(c !== container) c.classList.remove('active');
                    });

                    options.classList.toggle('open');
                    container.classList.toggle('active');
                });

                container.querySelectorAll('.custom-option').forEach(option => {
                    option.addEventListener('click', () => {
                        const value = option.dataset.value;
                        const text = option.innerText;

                        currentValueSpan.innerText = text;
                        container.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
                        option.classList.add('selected');

                        nativeSelect.value = value;
                        nativeSelect.dispatchEvent(new Event('change'));
                        options.classList.remove('open');
                        container.classList.remove('active');
                    });
                });
            });

  
            document.addEventListener('click', () => {
                document.querySelectorAll('.select-options').forEach(opt => opt.classList.remove('open'));
                document.querySelectorAll('.custom-select-container').forEach(c => c.classList.remove('active'));
            });
        </script>
    </body>
</html>
        <style>
           .peer:checked + span svg {
                transform: scale(1);
            }
             .peer:checked + span {
                border-color: rgb(255, 122, 26);
                background-color: rgba(255, 122, 26, 0.2);
                box-shadow: 0 0 8px rgba(255, 122, 26, 0.4);
            }

            .custom-select-container {
                position: relative;
                z-index: 200;
            }
     
//4556
            aside {
                overflow: visible !important;
            }
            
            .custom-select-container { position: relative; width: 100%; }
            .custom-select-container.active { z-index: 10000; }
            .select-trigger {
                width: 100%;
                padding: 0.6rem 1rem;
                background: rgba(25, 38, 33, 0.92);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                color: #e2e8f0;
                font-size: 0.875rem;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.2s;
            }

            .custom-checkbox-container {
            display: flex;
            align-items: center;
            cursor: pointer;
            user-select: none;
            font-family: monospace; 
            color: #c9d1d9; 
            padding: 8px 0;
            }

            .custom-checkbox-container input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
            }

            .checkmark {
            position: relative;
            height: 20px;
            width: 20px;
            background-color: transparent;
            border: 2px solid #3f4e4f; 
            border-radius: 6px; 
            margin-right: 12px;
            transition: all 0.2s ease;
            }

            .custom-checkbox-container:hover input ~ .checkmark {
            border-color: #666;
            }

            .custom-checkbox-container input:checked ~ .checkmark {
            background-color: #e66c2c; 
            border-color: #e66c2c;
            }

            .checkmark:after {
            content: "";
            position: absolute;
            display: none;
            }

            .custom-checkbox-container input:checked ~ .checkmark:after {
            display: block;
            }

            .custom-checkbox-container .checkmark:after {
            left: 6px;
            top: 2px;
            width: 4px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
            }

            .label-text {
            font-size: 14px;
            letter-spacing: 0.5px;
            }
            input[type='number']::-webkit-outer-spin-button,
            input[type='number']::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            input[type='number'] {
                -moz-appearance: textfield;
                appearance: textfield;
            }
            
            .select-trigger:hover { border-color: rgba(43, 209, 167, 0.5); }
            
            .select-options {
                position: absolute;
                top: calc(100% + 6px);
                left: 0;
                right: 0;
                display: none;

                background: rgba(17, 25, 22, 0.98);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 14px;
                box-shadow: 0 15px 35px rgba(0,0,0,0.6);
                backdrop-filter: blur(14px);

                max-height: none;
                overflow-y: visible;

                opacity: 0;
                transform: translateY(-4px);
                pointer-events: none;

                transition: opacity 0.25s ease, transform 0.25s ease;
            }

            .custom-select-container.active .select-options,
            .select-options.open {
                display: block;
                opacity: 1;
                transform: translateY(0);
                pointer-events: auto;
            }
            
            .toggle-switch {
                position: relative;
                width: 50px;
                height: 26px;
                background-color: #3A4440;
                border-radius: 15px;
                transition: background-color 0.2s;
                cursor: pointer;
            }

            .toggle-switch::before {
                content: '';
                position: absolute;
                top: 3px;
                left: 3px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: #838A88;
                transition: all 0.2s;
            }

            .custom-option {
                padding: 0.6rem 1rem;
                font-size: 0.875rem;
                color: var(--ink-dim);
                cursor: pointer;
                transition: background 0.2s;
            }
            .custom-option:hover {
                background: rgba(43, 209, 167, 0.2); 
                color: rgb(43, 209, 167);
            }
            
            .custom-option.selected {
                color: rgb(43, 209, 167);
                background: rgba(43, 209, 167, 0.05);
            }
 </style>    