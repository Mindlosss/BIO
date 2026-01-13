<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'Firefly') }} - Comparacion</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body data-page="bio-compare" class="min-h-screen">
        <div class="mx-auto grid w-[min(96vw,1680px)] max-w-[1680px] gap-6 px-5 pb-12 pt-7">
            @include('partials.auth-navbar')
            <header class="flex flex-wrap items-center justify-between gap-4">
                <div class="max-w-2xl">
                    <div class="text-[clamp(2rem,3vw,3.1rem)] font-bold tracking-tight">Firefly Comparacion</div>
                    <div class="mt-2 max-w-[640px] leading-relaxed text-[color:var(--ink-dim)]">
                        Compara algoritmos bioinspirados en la misma funcion objetivo con vistas 2D, 3D y grafica
                        de convergencia para cada algoritmo.
                    </div>
                </div>
                <a class="rounded-full border border-[rgba(255,122,26,0.5)] bg-[rgba(255,122,26,0.18)] px-3 py-2 text-sm text-[color:var(--ink)]"
                    href="{{ route('home') }}">
                    Modo normal
                </a>
            </header>

            <div class="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
                <aside class="rounded-[18px] border border-white/10 bg-[rgba(17,25,22,0.72)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[14px]">
                    <div class="grid gap-5">
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
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Comparar algoritmos</label>
                            <div class="grid gap-2">
                                <label class="flex items-center gap-3 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-2 text-sm text-[color:var(--ink-dim)]">
                                    <input type="checkbox" id="comparePso" checked class="accent-[rgb(255,122,26)]">
                                    <span>PSO</span>
                                </label>
                                <label class="flex items-center gap-3 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-2 text-sm text-[color:var(--ink-dim)]">
                                    <input type="checkbox" id="compareFirefly" checked class="accent-[rgb(255,122,26)]">
                                    <span>Firefly</span>
                                </label>
                                <label class="flex items-center gap-3 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-2 text-sm text-[color:var(--ink-dim)]">
                                    <input type="checkbox" id="compareGa" class="accent-[rgb(255,122,26)]">
                                    <span>Genetic</span>
                                </label>
                                <label class="flex items-center gap-3 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-2 text-sm text-[color:var(--ink-dim)]">
                                    <input type="checkbox" id="compareCuckoo" class="accent-[rgb(255,122,26)]">
                                    <span>Cuckoo</span>
                                </label>
                                <label class="flex items-center gap-3 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-2 text-sm text-[color:var(--ink-dim)]">
                                    <input type="checkbox" id="compareAco" class="accent-[rgb(255,122,26)]">
                                    <span>ACO</span>
                                </label>
                            </div>
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
                                <input id="speed" type="range" min="0.25" max="8" step="0.25" value="1"
                                    class="h-9 w-full accent-[rgb(43,209,167)]">
                                <span id="speedValue" class="font-mono text-sm text-[rgb(43,209,167)]">1x</span>
                            </div>
                        </div>

                        <div class="grid gap-2">
                            <button id="benchmark"
                                class="rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-4 py-3 text-sm font-semibold text-[color:var(--ink)] transition hover:-translate-y-0.5">
                                Iniciar
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

                <section class="grid gap-3 rounded-[18px] border border-white/10 bg-[rgba(16,23,20,0.68)] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[8px]">
                    <div class="flex flex-wrap items-center justify-between gap-3 text-[0.95rem] text-[color:var(--ink-dim)]">
                        <div>Modo comparacion</div>
                        <div class="font-mono text-xs text-[color:var(--ink-dim)]">2D, 3D y convergencia por algoritmo</div>
                    </div>
                    <div id="comparisonGrid" class="flex flex-wrap items-start gap-3"></div>
                </section>
            </div>
        </div>
    </body>
</html>
