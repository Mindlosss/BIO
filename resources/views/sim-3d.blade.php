<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'Firefly') }} - 3D</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body data-page="bio-3d" class="min-h-screen">
        <div class="mx-auto grid w-[min(96vw,1680px)] max-w-[1680px] gap-6 px-5 pb-12 pt-7">
            @include('partials.auth-navbar')

            <div class="grid gap-4 rounded-[18px] border border-white/20 bg-[rgba(26,36,31,0.74)] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-[8px]">
                <div class="flex flex-wrap items-center justify-between gap-3 text-[color:var(--ink)]">
                    <div class="text-sm uppercase tracking-[0.25em]">Simulación 3D</div>
                    <button type="button"
                        class="rounded-full border border-white/20 bg-[rgba(255,255,255,0.04)] px-3 py-1 text-xs text-[color:var(--ink)] transition hover:bg-[rgba(255,255,255,0.09)]"
                        onclick="window.close(); setTimeout(() => { if (!window.closed) window.location.href = '{{ route('home') }}'; }, 150);">
                        Volver al simulador
                    </button>
                </div>
                <div id="three-shell" class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div id="three-root" class="min-h-[420px] h-[72vh] max-h-[820px] w-full overflow-hidden rounded-[16px] border border-white/20 bg-[radial-gradient(circle_at_20%_20%,rgba(43,209,167,0.10),transparent_65%),rgba(18,24,22,0.95)]"></div>
                    
                    <div class="grid content-start gap-3 rounded-[16px] border border-white/20 bg-[rgba(24,34,30,0.72)] p-4 text-sm text-[color:var(--ink)]">
                        <div class="font-mono text-xs uppercase tracking-[0.2em] text-[rgb(43,209,167)]">Datos</div>
                        <div>Algoritmo: <span id="algoLabel" class="text-[color:var(--ink)]">-</span></div>
                        <div>Función: <span id="objectiveLabel" class="text-[color:var(--ink)]">-</span></div>
                        <div>Iteración: <span id="iterLabel" class="text-[color:var(--ink)]">0</span></div>
                        <div>Mejor f: <span id="bestLabel" class="text-[color:var(--ink)]">-</span></div>
                        <div id="legend" class="flex flex-wrap items-center gap-3 text-xs text-[color:var(--ink)]"></div>
                        <div class="grid grid-cols-2 gap-2">
                            <button id="replay3d" type="button"
                                class="mt-2 rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)] transition hover:-translate-y-0.5">
                                Ver de nuevo
                            </button>
                            <button id="fullscreen3d" type="button"
                                class="mt-2 rounded-xl border border-[rgba(255,122,26,0.55)] bg-[rgba(255,122,26,0.14)] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)] transition hover:-translate-y-0.5">
                                Pantalla
                            </button>
                        </div>
                        <div class="mt-2 grid gap-2 rounded-[14px] border border-white/10 bg-[rgba(8,12,10,0.52)] p-3">
                            <div class="font-mono text-xs uppercase tracking-[0.2em] text-[rgb(255,122,26)]">Ejecucion del codigo</div>
                            <div id="algorithmPhase" class="min-h-5 text-xs text-[color:var(--ink-dim)]">Preparando algoritmo...</div>
                            <div id="algorithmTrace" class="algorithm-code-grid"></div>
                        </div>
                        <div class="text-xs text-[color:var(--ink)]">
                            <div class="font-bold mb-1">Navegación:</div>
                            <div>Clic izquierdo para rotar | Clic derecho para mover a los lados | Rueda para zoom</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
