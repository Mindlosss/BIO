<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>{{ config('app.name', 'Firefly') }} - Comparacion</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body data-page="bio-compare" data-history-url="{{ route('history.store') }}" class="min-h-screen">
        <div class="mx-auto grid w-[min(96vw,1680px)] max-w-[1680px] gap-6 px-5 pb-12 pt-7">
            @include('partials.auth-navbar')
            <header class="flex flex-wrap items-center justify-between gap-4">
                <div class="max-w-2xl">
                    <div class="text-[clamp(2rem,3vw,3.1rem)] font-bold tracking-tight">Comparación</div>
                </div>
            </header>

            <div class="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
                <aside class="rounded-[18px] border border-white/10 bg-[rgba(17,25,22,0.72)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[14px]">
                    <div class="grid gap-5">
                        
                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Funcion objetivo</label>
                            <div class="custom-select-container">
                                <input type="hidden" id="objective" value="sphere">
                                <div class="select-trigger" onclick="toggleDrop('opts-obj')">
                                    <span id="text-objective">Sphere</span>
                                    <svg class="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                                </div>
                                <div id="opts-obj" class="select-options">
                                    <div class="option-item" onclick="setVal('objective', 'sphere', 'Sphere')">Sphere</div>
                                    <div class="option-item" onclick="setVal('objective', 'rastrigin', 'Rastrigin')">Rastrigin</div>
                                    <div class="option-item" onclick="setVal('objective', 'rosenbrock', 'Rosenbrock')">Rosenbrock</div>
                                    <div class="option-item" onclick="setVal('objective', 'ackley', 'Ackley')">Ackley</div>
                                    <div class="option-item" onclick="setVal('objective', 'griewank', 'Griewank')">Griewank</div>
                                    <div class="option-item" onclick="setVal('objective', 'styblinski', 'Styblinski-Tang')">Styblinski-Tang</div>
                                    <div class="option-item" onclick="setVal('objective', 'schwefel', 'Schwefel')">Schwefel</div>
                                </div>
                            </div>
                        </div>

                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]" for="surfaceMode">Superficie</label>
                            <label class="flex cursor-pointer items-center gap-3 text-sm text-[color:var(--ink-dim)]">
                                <input id="surfaceMode" type="checkbox" checked class="peer hidden"> <div class="relative h-6 w-11 rounded-full bg-white/10 transition-all">
                                    <span class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white/70 transition-all"></span>
                                </div>
                                <span>Vista popular (sin suavizado)</span>
                            </label>
                        </div>

                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Modo de convergencia</label>
                            <div class="custom-select-container">
                                <input type="hidden" id="convergence" value="equilibrado">
                                <div class="select-trigger" onclick="toggleDrop('opts-conv')">
                                    <span id="text-convergence">Equilibrado</span>
                                    <svg class="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                                </div>
                                <div id="opts-conv" class="select-options">
                                    <div class="option-item" onclick="setVal('convergence', 'exploracion', 'Exploracion')">Exploracion</div>
                                    <div class="option-item" onclick="setVal('convergence', 'equilibrado', 'Equilibrado')">Equilibrado</div>
                                    <div class="option-item" onclick="setVal('convergence', 'optimo', 'Optimo')">Optimo</div>
                                </div>
                            </div>
                        </div>

                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Comparar algoritmos</label>
                            <div class="grid gap-2">
                                <label class="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-2 text-sm transition hover:border-[rgba(255,122,26,0.5)]">
                                    <input type="checkbox" id="comparePso" checked class="peer hidden">
                                    <span class="flex h-5 w-5 items-center justify-center rounded-md border border-white/20 bg-[rgba(0,0,0,0.3)] transition-all">
                                        <svg class="h-3 w-3 scale-0 text-[rgb(255,122,26)] transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                            <path d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <span class="text-[color:var(--ink-dim)] group-hover:text-[color:var(--ink)]">PSO</span>
                                </label>
                                <label class="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-2 text-sm transition hover:border-[rgba(255,122,26,0.5)]">
                                    <input type="checkbox" id="compareFirefly" checked class="peer hidden">
                                    <span class="flex h-5 w-5 items-center justify-center rounded-md border border-white/20 bg-[rgba(0,0,0,0.3)] transition-all">
                                        <svg class="h-3 w-3 scale-0 text-[rgb(255,122,26)] transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                            <path d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <span class="text-[color:var(--ink-dim)] group-hover:text-[color:var(--ink)]">Firefly</span>
                                </label>
                                <label class="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-2 text-sm transition hover:border-[rgba(255,122,26,0.5)]">
                                    <input type="checkbox" id="compareGa" class="peer hidden">
                                    <span class="flex h-5 w-5 items-center justify-center rounded-md border border-white/20 bg-[rgba(0,0,0,0.3)] transition-all">
                                        <svg class="h-3 w-3 scale-0 text-[rgb(255,122,26)] transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                            <path d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <span class="text-[color:var(--ink-dim)] group-hover:text-[color:var(--ink)]">Genetic</span>
                                </label>
                                <label class="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-2 text-sm transition hover:border-[rgba(255,122,26,0.5)]">
                                    <input type="checkbox" id="compareCuckoo" class="peer hidden">
                                    <span class="flex h-5 w-5 items-center justify-center rounded-md border border-white/20 bg-[rgba(0,0,0,0.3)] transition-all">
                                        <svg class="h-3 w-3 scale-0 text-[rgb(255,122,26)] transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                            <path d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <span class="text-[color:var(--ink-dim)] group-hover:text-[color:var(--ink)]">Cuckoo</span>
                                </label>
                                <label class="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-2 text-sm transition hover:border-[rgba(255,122,26,0.5)]">
                                    <input type="checkbox" id="compareAco" class="peer hidden">
                                    <span class="flex h-5 w-5 items-center justify-center rounded-md border border-white/20 bg-[rgba(0,0,0,0.3)] transition-all">
                                        <svg class="h-3 w-3 scale-0 text-[rgb(255,122,26)] transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                            <path d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <span class="text-[color:var(--ink-dim)] group-hover:text-[color:var(--ink)]">ACO</span>
                                </label>
                            </div>
                        </div>

                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]" for="bounds">Dominio (limite)</label>
                            <div class="grid grid-cols-[auto_1fr_auto] gap-2">
                                <button type="button" onclick="document.getElementById('bounds').stepDown()" class="h-full w-9 rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] text-[color:var(--ink)] hover:bg-white/5 active:bg-white/10">-</button>
                                <input id="bounds" type="number" min="2" max="20" step="1" value="5"
                                    class="w-full rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] px-3 py-2 text-center text-sm text-[color:var(--ink)]">
                                <button type="button" onclick="document.getElementById('bounds').stepUp()" class="h-full w-9 rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] text-[color:var(--ink)] hover:bg-white/5 active:bg-white/10">+</button>
                            </div>
                        </div>

                        <div class="grid gap-2">
                            <label class="text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]" for="pop">Poblacion</label>
                            <div class="grid grid-cols-[auto_1fr_auto] gap-2">
                                <button type="button" onclick="document.getElementById('pop').stepDown()" class="h-full w-9 rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] text-[color:var(--ink)] hover:bg-white/5 active:bg-white/10">-</button>
                                <input id="pop" type="number" min="10" max="300" value="60"
                                    class="w-full rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] px-3 py-2 text-center text-sm text-[color:var(--ink)]">
                                <button type="button" onclick="document.getElementById('pop').stepUp()" class="h-full w-9 rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] text-[color:var(--ink)] hover:bg-white/5 active:bg-white/10">+</button>
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
                                <input id="speed" type="range" min="0.01" max="2.5" step="0.01" value="0.5"
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

                        <div class="grid gap-2">
                            <button id="benchmark"
                                class="rounded-xl border border-[rgba(255,122,26,0.6)] bg-[rgba(255,122,26,0.15)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[rgba(255,122,26,0.25)] hover:-translate-y-0.5 active:scale-95">
                                Iniciar
                            </button>
                            <button id="reset"
                                class="rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-4 py-3 text-sm font-semibold text-[color:var(--ink)] transition hover:-translate-y-0.5">
                                Reset
                            </button>
                        </div>

                        <div id="activeAlgosList" class="mt-2 flex flex-col gap-4 border-t border-white/10 pt-4 text-[0.92rem] text-[color:var(--ink-dim)]">
                        </div>
                    </div>
                </aside>

                <section class="flex flex-col h-full rounded-[18px] border border-white/10 bg-[rgba(16,23,20,0.68)] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[8px]">
                    <div class="flex items-center justify-between mb-4 px-2 text-[0.85rem] text-[color:var(--ink-dim)]">
                        <span>Modo comparación</span>
                        <span class="font-mono text-[10px] opacity-50 uppercase">2D, 3D y convergencia por algoritmo</span>
                    </div>
                    <div id="comparisonGrid" class="grid grid-cols-2 gap-4"></div>
                </section>
            </div>
        </div>
        <div id="custom-alert" class="fixed top-10 left-1/2 z-[1000] -translate-x-1/2 opacity-0 pointer-events-none transition-all duration-500 ease-in-out">
            <div class="flex items-center gap-4 rounded-2xl border border-[rgba(255,122,26,0.4)] bg-[rgba(17,25,22,0.98)] px-6 py-4 shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur-xl">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,122,26,0.2)] text-[rgb(255,122,26)]">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <div>
                    <div class="text-base font-bold text-white">Límite de comparación</div>
                    <div class="text-sm text-[color:var(--ink-dim)]">Selecciona máximo 4 algoritmos.</div>
                </div>
            </div>
        </div>

        <script>
            function toggleDrop(id) {
                const target = document.getElementById(id);
                const isShown = target.classList.contains('show');
                document.querySelectorAll('.select-options').forEach(el => el.classList.remove('show'));
                if (!isShown) target.classList.add('show');
            }

            function setVal(inputId, val, text) {
                const hiddenInput = document.getElementById(inputId);
                hiddenInput.value = val;
                document.getElementById('text-' + inputId).innerText = text;
                document.querySelectorAll('.select-options').forEach(el => el.classList.remove('show'));
                
                hiddenInput.dispatchEvent(new Event('change'));
            }

            window.onclick = function(e) {
                if (!e.target.closest('.custom-select-container')) {
                    document.querySelectorAll('.select-options').forEach(el => el.classList.remove('show'));
                }
            }
            // Función para limitar la selección a máximo 4 checkboxes
            document.querySelectorAll('input[type="checkbox"][id^="compare"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const checkedCount = document.querySelectorAll('input[type="checkbox"][id^="compare"]:checked').length;
                
                if (checkedCount > 4) {
                    this.checked = false; 
                    
                    const alertBox = document.getElementById('custom-alert');
                    alertBox.style.opacity = "1";
                    alertBox.style.transform = "translate(-50%, 20px)"; 
                    alertBox.style.pointerEvents = "auto";

                    setTimeout(() => {
                        alertBox.style.opacity = "0";
                        alertBox.style.transform = "translate(-50%, 0px)"; 
                        alertBox.style.pointerEvents = "none";
                    }, 2500);
                }
            });
        });

            // Diccionario de descripciones
            const algoInfo = {
                'comparePso': {
                    name: 'PSO',
                    desc: 'Enjambre con memoria personal y global para converger al optimo.'
                },
                'compareFirefly': {
                    name: 'Firefly',
                    desc: 'Atracción basada en brillo relativo y movimiento hacia parejas más brillantes.'
                },
                'compareGa': {
                    name: 'Genetic',
                    desc: 'Evolución basada en selección natural, cruce y mutación de genes.'
                },
                'compareCuckoo': {
                    name: 'Cuckoo',
                    desc: 'Búsqueda basada en parasitismo de nido y vuelos de Lévy aleatorios.'
                },
                'compareAco': {
                    name: 'ACO',
                    desc: 'Comportamiento de hormigas usando feromonas para optimizar rutas.'
                }
            };

            function updateAlgoList() {
                const container = document.getElementById('activeAlgosList');
                container.innerHTML = ''; 
                const checked = document.querySelectorAll('input[type="checkbox"][id^="compare"]:checked');

                if (checked.length === 0) {
                    container.innerHTML = '<div class="text-xs opacity-50 italic">Ningún algoritmo seleccionado.</div>';
                    return;
                }

                checked.forEach(cb => {
                    const info = algoInfo[cb.id];
                    if (info) {
                        const itemHtml = `
                            <div class="animate-slide-in">
                                <div class="font-mono text-xs text-[rgb(255,122,26)] mb-1 uppercase tracking-wider font-bold">${info.name}</div>
                                <div class="leading-relaxed text-xs opacity-80">
                                    ${info.desc}
                                </div>
                            </div>
                        `;
                        container.insertAdjacentHTML('beforeend', itemHtml);
                    }
                });
            }
            document.querySelectorAll('input[type="checkbox"][id^="compare"]').forEach(checkbox => {
                checkbox.addEventListener('change', updateAlgoList);
            });

            document.addEventListener('DOMContentLoaded', updateAlgoList);
        </script>
    </body>
    <style>
            #surfaceMode:checked + div span {
                transform: translateX(20px);
                background-color: rgb(255, 122, 26) !important;
            }

            @keyframes slideIn {
                from { opacity: 0; transform: translateX(20px); }
                to { opacity: 1; transform: translateX(0); }
            }

            .animate-slide-in {
                animation: slideIn 0.3s ease forwards;
            }

            #custom-alert > div {
                box-shadow: 0 0 20px rgba(255, 122, 26, 0.1);
            }

            #three-root {
                min-height: 550px; 
                height: 100%;
                width: 100%;
                position: relative;
                overflow: hidden;
                border: 1px solid rgba(43, 209, 167, 0.2); 
                border-radius: 12px;
            }

            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            input[type=number] { -moz-appearance: textfield; appearance: textfield; }

            .flex:has(input:focus) {
                border-color: rgba(255, 122, 26, 0.4);
                box-shadow: 0 0 10px rgba(255, 122, 26, 0.05);
            }

            #three-root canvas {
                display: block;
                width: 100% !important;
                height: 100% !important;
            }

            input[type="checkbox"]:checked + span svg {
                transform: scale(1) !important;
                opacity: 1 !important;
            }
            
            input[type="checkbox"]:checked + span {
                border-color: rgb(255, 122, 26) !important;
                background-color: rgba(255, 122, 26, 0.15) !important;
            }

            .custom-select-container { position: relative; width: 100%; }
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
            .select-trigger:hover { border-color: rgba(43, 209, 167, 0.5); }
            
            .select-options {
                position: absolute;
                top: calc(100% + 5px);
                left: 0;
                right: 0;
                background: rgba(17, 25, 22, 0.98);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                backdrop-filter: blur(12px);
                z-index: 100;
                display: none;
                overflow: hidden;
            }

            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            input[type=number] {
                -moz-appearance: textfield; 
                appearance: textfield;
            }

            input[type="number"]:focus {
                outline: none;
                border-color: rgba(255, 122, 26, 0.5);
                background: rgba(25, 38, 33, 1);
                box-shadow: 0 0 15px rgba(255, 122, 26, 0.1);
            }

            .select-options.show { display: block; animation: selectFade 0.2s ease; }
            .option-item { padding: 0.6rem 1rem; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
            .option-item:hover { background: rgba(43, 209, 167, 0.15); color: #2bd1a7; }
            
            @keyframes selectFade { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        </style>
</html>
