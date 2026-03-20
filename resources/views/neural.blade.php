<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'Firefly') }} - Red neuronal</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body data-page="bio-neural" data-nn-status-url="{{ route('neural.status') }}" class="min-h-screen">
        @php
            $inputYs = [48, 84, 120, 156, 192, 228, 264, 300];
            $hiddenYs = [60, 108, 156, 204, 252, 300];
            $outputY = 174;
        @endphp

        <div class="mx-auto grid w-[min(96vw,1600px)] max-w-[1600px] gap-6 px-5 pb-12 pt-7">
            @include('partials.auth-navbar')

            <header class="flex flex-wrap items-start justify-between gap-4">
                <div class="max-w-3xl">
                    <div class="text-[clamp(2.1rem,3vw,3.4rem)] font-bold tracking-[-0.04em] text-[color:var(--ink)]">
                        Red neuronal
                    </div>
                    <div id="nnStatusMessage" class="mt-3 text-sm leading-relaxed text-[color:var(--ink-dim)] sm:text-base">
                        Verificando conexion con el microservicio...
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-3">
                    <div id="nnArchitectureBadge"
                        class="rounded-full border border-[rgba(255,122,26,0.25)] bg-[rgba(255,122,26,0.1)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[rgb(255,194,149)]">
                        1 capa oculta / 6 neuronas / 220 epocas
                    </div>
                    <div id="nnStatusBadge"
                        class="rounded-full border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">
                        Verificando
                    </div>
                </div>
            </header>

            <section class="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_320px]">
                <div class="grid gap-4 rounded-[26px] border border-white/10 bg-[linear-gradient(135deg,rgba(16,23,20,0.82),rgba(10,14,12,0.92))] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur-[10px]">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div class="text-xs uppercase tracking-[0.24em] text-[color:var(--ink-dim)]">Estado de la red</div>
                            <div id="nnArchitectureStatus" class="mt-2 text-xl font-semibold text-[color:var(--ink)]">
                                Esperando estado del servicio
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 text-xs">
                            <div class="rounded-full border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[color:var(--ink-dim)]">
                                <span class="font-mono text-[rgb(43,209,167)]" id="nnFeatureCount">0 rasgos</span>
                            </div>
                            <div class="rounded-full border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[color:var(--ink-dim)]">
                                <span id="nnSignalState">Sin senal</span>
                            </div>
                            <div id="nnLogSummary" class="rounded-full border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[color:var(--ink-dim)]">
                                Sin actividad reciente
                            </div>
                        </div>
                    </div>

                    <div id="nnNetworkPanel"
                        class="nn-network relative overflow-hidden rounded-[22px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(43,209,167,0.08),transparent_30%),radial-gradient(circle_at_80%_35%,rgba(255,122,26,0.08),transparent_24%),rgba(7,10,9,0.92)]"
                        data-phase="offline">
                        <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]"></div>

                        <div class="absolute left-6 top-5 text-[0.7rem] uppercase tracking-[0.24em] text-[color:var(--ink-dim)]">
                            Entradas
                        </div>
                        <div class="absolute left-1/2 top-5 -translate-x-1/2 text-[0.7rem] uppercase tracking-[0.24em] text-[color:var(--ink-dim)]">
                            Capa oculta
                        </div>
                        <div class="absolute right-7 top-5 text-[0.7rem] uppercase tracking-[0.24em] text-[color:var(--ink-dim)]">
                            Salida
                        </div>

                        <svg class="relative z-10 h-full w-full" viewBox="0 0 760 360" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                            <defs>
                                <linearGradient id="edgeInput" x1="0%" x2="100%" y1="0%" y2="0%">
                                    <stop offset="0%" stop-color="rgba(43,209,167,0.08)" />
                                    <stop offset="100%" stop-color="rgba(43,209,167,0.34)" />
                                </linearGradient>
                                <linearGradient id="edgeOutput" x1="0%" x2="100%" y1="0%" y2="0%">
                                    <stop offset="0%" stop-color="rgba(255,122,26,0.14)" />
                                    <stop offset="100%" stop-color="rgba(255,122,26,0.42)" />
                                </linearGradient>

                                <path id="pulse-path-a" d="M 122 84 C 228 84, 286 60, 390 60 C 512 60, 560 174, 648 174" />
                                <path id="pulse-path-b" d="M 122 156 C 228 156, 286 156, 390 156 C 512 156, 560 174, 648 174" />
                                <path id="pulse-path-c" d="M 122 264 C 228 264, 286 252, 390 252 C 512 252, 560 174, 648 174" />
                            </defs>

                            @foreach ($inputYs as $inputY)
                                @foreach ($hiddenYs as $hiddenY)
                                    <path class="nn-edge nn-edge-input"
                                        d="M 122 {{ $inputY }} C 220 {{ $inputY }}, 290 {{ $hiddenY }}, 390 {{ $hiddenY }}" />
                                @endforeach
                            @endforeach

                            @foreach ($hiddenYs as $hiddenY)
                                <path class="nn-edge nn-edge-output"
                                    d="M 390 {{ $hiddenY }} C 500 {{ $hiddenY }}, 560 {{ $outputY }}, 648 {{ $outputY }}" />
                            @endforeach

                            <g class="nn-pulses">
                                <circle class="nn-pulse nn-pulse-a" r="4" fill="#2bd1a7">
                                    <animateMotion dur="4.8s" repeatCount="indefinite" rotate="auto">
                                        <mpath href="#pulse-path-a"></mpath>
                                    </animateMotion>
                                </circle>
                                <circle class="nn-pulse nn-pulse-b" r="4" fill="#2bd1a7">
                                    <animateMotion dur="4.2s" begin="0.9s" repeatCount="indefinite" rotate="auto">
                                        <mpath href="#pulse-path-b"></mpath>
                                    </animateMotion>
                                </circle>
                                <circle class="nn-pulse nn-pulse-c" r="4" fill="#ff7a1a">
                                    <animateMotion dur="4.6s" begin="1.6s" repeatCount="indefinite" rotate="auto">
                                        <mpath href="#pulse-path-c"></mpath>
                                    </animateMotion>
                                </circle>
                            </g>

                            <g class="nn-layer-input">
                                @foreach ($inputYs as $inputY)
                                    <g class="nn-node-wrap nn-node-wrap-input">
                                        <circle class="nn-node nn-node-input" cx="122" cy="{{ $inputY }}" r="11"></circle>
                                        <circle class="nn-node-ring nn-node-ring-input" cx="122" cy="{{ $inputY }}" r="18"></circle>
                                    </g>
                                @endforeach
                            </g>

                            <g class="nn-layer-hidden">
                                @foreach ($hiddenYs as $hiddenY)
                                    <g class="nn-node-wrap nn-node-wrap-hidden">
                                        <circle class="nn-node nn-node-hidden" cx="390" cy="{{ $hiddenY }}" r="13"></circle>
                                        <circle class="nn-node-ring nn-node-ring-hidden" cx="390" cy="{{ $hiddenY }}" r="21"></circle>
                                    </g>
                                @endforeach
                            </g>

                            <g class="nn-layer-output">
                                <g class="nn-node-wrap nn-node-wrap-output">
                                    <circle class="nn-node nn-node-output" cx="648" cy="{{ $outputY }}" r="17"></circle>
                                    <circle class="nn-node-ring nn-node-ring-output" cx="648" cy="{{ $outputY }}" r="28"></circle>
                                </g>
                            </g>
                        </svg>

                        <div class="pointer-events-none absolute bottom-5 left-6 text-sm text-[color:var(--ink-dim)]">
                            Historial, convergencia y parametros normalizados
                        </div>
                        <div class="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-[color:var(--ink-dim)]">
                            Patrones combinados con activacion ReLU
                        </div>
                        <div id="nnInferenceState" class="absolute bottom-5 right-6 rounded-full border border-[rgba(255,122,26,0.22)] bg-[rgba(255,122,26,0.08)] px-3 py-1 text-sm text-[color:var(--ink)]">
                            Aun no hay sugerencia reciente
                        </div>
                    </div>

                    <div id="nnQuickRead" class="text-sm leading-relaxed text-[color:var(--ink-dim)]">
                        Cuando el servicio este activo, la red mostrara el flujo de senal y el estado de la ultima sugerencia generada.
                    </div>
                </div>

                <aside class="grid gap-4">
                    <section class="grid gap-3 rounded-[22px] border border-white/10 bg-[rgba(16,23,20,0.68)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[8px]">
                        <div class="text-xs uppercase tracking-[0.24em] text-[color:var(--ink-dim)]">Actividad reciente</div>
                        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                            <div class="rounded-[16px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                                <div class="text-[0.68rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Algoritmo</div>
                                <div id="nnLastAlgorithm" class="mt-2 text-lg font-semibold text-[color:var(--ink)]">-</div>
                            </div>
                            <div class="rounded-[16px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                                <div class="text-[0.68rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Funcion objetivo</div>
                                <div id="nnLastObjective" class="mt-2 text-lg font-semibold text-[color:var(--ink)]">-</div>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div class="rounded-[16px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                                    <div class="text-[0.68rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Muestras</div>
                                    <div id="nnLastSamples" class="mt-2 text-lg font-semibold text-[color:var(--ink)]">-</div>
                                </div>
                                <div class="rounded-[16px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                                    <div class="text-[0.68rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Dims</div>
                                    <div id="nnLastDimensions" class="mt-2 text-lg font-semibold text-[color:var(--ink)]">-</div>
                                </div>
                            </div>
                            <div class="rounded-[16px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                                <div class="text-[0.68rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Ultima actividad</div>
                                <div id="nnLastRunAt" class="mt-2 text-base font-semibold text-[color:var(--ink)]">Sin registros</div>
                                <div id="nnLastMessage" class="mt-2 text-sm leading-relaxed text-[color:var(--ink-dim)]">
                                    La proxima corrida desde el simulador dejara aqui el resumen.
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="grid gap-3 rounded-[22px] border border-white/10 bg-[rgba(16,23,20,0.68)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[8px]">
                        <div class="flex items-center justify-between gap-3">
                            <div class="text-xs uppercase tracking-[0.24em] text-[color:var(--ink-dim)]">Parametros sugeridos</div>
                            <div id="nnSuggestionContext" class="font-mono text-xs text-[color:var(--ink-dim)]">Sin sugerencia</div>
                        </div>
                        <div id="nnSuggestedParams" class="grid gap-2">
                            <div class="rounded-[14px] border border-dashed border-white/10 px-4 py-5 text-sm text-[color:var(--ink-dim)]">
                                Aun no hay una recomendacion almacenada.
                            </div>
                        </div>
                    </section>
                </aside>
            </section>

            <section class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div class="grid gap-3 rounded-[22px] border border-white/10 bg-[rgba(16,23,20,0.68)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[8px]">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <div class="text-xs uppercase tracking-[0.24em] text-[color:var(--ink-dim)]">Flujo del entrenamiento</div>
                        <div class="flex flex-wrap gap-2 text-xs text-[color:var(--ink-dim)]">
                            <div class="rounded-full border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-1">
                                <span id="nnStatusLatency">-</span>
                            </div>
                            <div class="rounded-full border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-1">
                                <span id="nnStatusChecked">-</span>
                            </div>
                        </div>
                    </div>

                    <div class="grid gap-2 md:grid-cols-4">
                        <article id="nnStepCapture" class="nn-step rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4" data-state="pending">
                            <div class="text-sm font-semibold text-[color:var(--ink)]">Captura</div>
                            <div data-step-copy class="mt-2 text-sm leading-relaxed text-[color:var(--ink-dim)]">Sin contexto reciente.</div>
                        </article>
                        <article id="nnStepDataset" class="nn-step rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4" data-state="pending">
                            <div class="text-sm font-semibold text-[color:var(--ink)]">Dataset</div>
                            <div data-step-copy class="mt-2 text-sm leading-relaxed text-[color:var(--ink-dim)]">Esperando muestras.</div>
                        </article>
                        <article id="nnStepTraining" class="nn-step rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4" data-state="pending">
                            <div class="text-sm font-semibold text-[color:var(--ink)]">Entrenamiento</div>
                            <div data-step-copy class="mt-2 text-sm leading-relaxed text-[color:var(--ink-dim)]">Sin actividad.</div>
                        </article>
                        <article id="nnStepSuggestion" class="nn-step rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4" data-state="pending">
                            <div class="text-sm font-semibold text-[color:var(--ink)]">Sugerencia</div>
                            <div data-step-copy class="mt-2 text-sm leading-relaxed text-[color:var(--ink-dim)]">Aun no disponible.</div>
                        </article>
                    </div>
                </div>

                <div class="grid gap-3 rounded-[22px] border border-white/10 bg-[rgba(16,23,20,0.68)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[8px]">
                    <div class="flex items-center justify-between gap-3">
                        <div>
                            <div class="text-xs uppercase tracking-[0.24em] text-[color:var(--ink-dim)]">Consola</div>
                            <div id="nnConsoleHint" class="mt-2 text-sm text-[color:var(--ink-dim)]">
                                Ultimos eventos del entrenamiento.
                            </div>
                        </div>
                        <div id="nnConsoleCount" class="rounded-full border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-1 font-mono text-xs text-[color:var(--ink-dim)]">
                            0 eventos
                        </div>
                    </div>

                    <pre id="nnConsole" class="max-h-[220px] overflow-auto rounded-[18px] border border-white/10 bg-[rgba(10,14,12,0.82)] p-4 font-mono text-xs leading-6 text-[color:var(--ink)]">-</pre>

                    <div class="flex flex-wrap gap-2">
                        <button id="nnStatusRefresh" type="button"
                            class="rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)] transition hover:-translate-y-0.5">
                            Revisar conexion
                        </button>
                        <button id="nnConsoleClear" type="button"
                            class="rounded-xl border border-white/10 bg-[rgba(25,38,33,0.6)] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink-dim)] transition hover:-translate-y-0.5">
                            Limpiar
                        </button>
                    </div>

                    <details class="rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                        <summary class="cursor-pointer text-sm font-semibold text-[color:var(--ink)]">Detalles tecnicos</summary>
                        <div class="mt-3 grid gap-3">
                            <div class="rounded-[14px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-3">
                                <div class="text-[0.68rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">URL</div>
                                <div id="nnStatusUrl" class="mt-2 break-all font-mono text-xs text-[color:var(--ink)]">-</div>
                            </div>
                            <pre id="nnStatusPayload" class="max-h-[180px] overflow-auto rounded-[14px] border border-white/10 bg-[rgba(10,14,12,0.82)] p-3 font-mono text-xs text-[color:var(--ink)]">-</pre>
                        </div>
                    </details>
                </div>
            </section>
        </div>
    </body>
    <style>
        .nn-network {
            min-height: 540px;
        }

        .nn-edge {
            fill: none;
            stroke-width: 1.35;
            transition: stroke 0.3s ease, opacity 0.3s ease;
        }

        .nn-edge-input {
            stroke: rgba(43, 209, 167, 0.09);
        }

        .nn-edge-output {
            stroke: rgba(255, 122, 26, 0.1);
        }

        .nn-node {
            transition: fill 0.3s ease, transform 0.3s ease, filter 0.3s ease;
        }

        .nn-node-ring {
            fill: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .nn-node-input {
            fill: rgba(43, 209, 167, 0.28);
            stroke: rgba(43, 209, 167, 0.22);
        }

        .nn-node-hidden {
            fill: rgba(255, 194, 149, 0.22);
            stroke: rgba(255, 122, 26, 0.2);
        }

        .nn-node-output {
            fill: rgba(255, 122, 26, 0.32);
            stroke: rgba(255, 122, 26, 0.34);
        }

        .nn-node-ring-input {
            stroke: rgba(43, 209, 167, 0.2);
        }

        .nn-node-ring-hidden {
            stroke: rgba(255, 122, 26, 0.18);
        }

        .nn-node-ring-output {
            stroke: rgba(255, 122, 26, 0.28);
        }

        .nn-pulse {
            opacity: 0;
            filter: drop-shadow(0 0 10px currentColor);
        }

        .nn-network[data-phase="connected"] .nn-node-ring-input,
        .nn-network[data-phase="training"] .nn-node-ring-input,
        .nn-network[data-phase="trained"] .nn-node-ring-input,
        .nn-network[data-phase="training"] .nn-node-ring-hidden,
        .nn-network[data-phase="trained"] .nn-node-ring-hidden,
        .nn-network[data-phase="trained"] .nn-node-ring-output {
            opacity: 1;
        }

        .nn-network[data-phase="connected"] .nn-node-ring-input {
            animation: nnBreath 2.6s ease-in-out infinite;
        }

        .nn-network[data-phase="training"] .nn-node-ring-input,
        .nn-network[data-phase="training"] .nn-node-ring-hidden,
        .nn-network[data-phase="trained"] .nn-node-ring-input,
        .nn-network[data-phase="trained"] .nn-node-ring-hidden,
        .nn-network[data-phase="trained"] .nn-node-ring-output {
            animation: nnBreath 1.9s ease-in-out infinite;
        }

        .nn-network[data-phase="connected"] .nn-edge-input {
            stroke: rgba(43, 209, 167, 0.18);
        }

        .nn-network[data-phase="training"] .nn-edge-input,
        .nn-network[data-phase="trained"] .nn-edge-input {
            stroke: rgba(43, 209, 167, 0.25);
        }

        .nn-network[data-phase="training"] .nn-edge-output,
        .nn-network[data-phase="trained"] .nn-edge-output {
            stroke: rgba(255, 122, 26, 0.22);
        }

        .nn-network[data-phase="training"] .nn-pulse,
        .nn-network[data-phase="trained"] .nn-pulse {
            opacity: 0.95;
        }

        .nn-network[data-phase="trained"] .nn-node-output {
            filter: drop-shadow(0 0 18px rgba(255, 122, 26, 0.35));
        }

        .nn-step {
            transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
        }

        .nn-step[data-state="done"] {
            border-color: rgba(43, 209, 167, 0.28);
            background: rgba(43, 209, 167, 0.07);
        }

        .nn-step[data-state="active"] {
            border-color: rgba(255, 122, 26, 0.28);
            background: rgba(255, 122, 26, 0.06);
            transform: translateY(-1px);
        }

        .nn-step[data-state="warning"] {
            border-color: rgba(255, 122, 26, 0.22);
            background: rgba(255, 122, 26, 0.05);
        }

        @keyframes nnBreath {
            0%,
            100% {
                transform: scale(0.94);
                opacity: 0.2;
            }
            50% {
                transform: scale(1.06);
                opacity: 0.75;
            }
        }

        @media (max-width: 1023px) {
            .nn-network {
                min-height: 420px;
            }
        }
    </style>
</html>
