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
                    <div class="text-sm uppercase tracking-[0.25em]">Simulacion 3D</div>
                    <button type="button"
                        class="rounded-full border border-white/20 bg-[rgba(255,255,255,0.04)] px-3 py-1 text-xs text-[color:var(--ink)] transition hover:bg-[rgba(255,255,255,0.09)]"
                        onclick="window.close(); setTimeout(() => { if (!window.closed) window.location.href = '{{ route('home') }}'; }, 150);">
                        Volver al simulador
                    </button>
                </div>
                <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <div id="three-root" class="min-h-[360px] h-[60vh] max-h-[640px] w-full overflow-hidden rounded-[16px] border border-white/20 bg-[radial-gradient(circle_at_20%_20%,rgba(43,209,167,0.10),transparent_65%),rgba(18,24,22,0.95)]"></div>
                    
                    <div class="grid content-start gap-3 rounded-[16px] border border-white/20 bg-[rgba(24,34,30,0.72)] p-4 text-sm text-[color:var(--ink)]">
                        <div class="font-mono text-xs uppercase tracking-[0.2em] text-[rgb(43,209,167)]">Datos</div>
                        <div>Algoritmo: <span id="algoLabel" class="text-[color:var(--ink)]">-</span></div>
                        <div>Funcion: <span id="objectiveLabel" class="text-[color:var(--ink)]">-</span></div>
                        <div>Iteracion: <span id="iterLabel" class="text-[color:var(--ink)]">0</span></div>
                        <div>Mejor f: <span id="bestLabel" class="text-[color:var(--ink)]">-</span></div>
                        <div id="legend" class="flex flex-wrap items-center gap-3 text-xs text-[color:var(--ink)]"></div>
                        <button id="replay3d" type="button"
                            class="mt-2 rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)] transition hover:-translate-y-0.5">
                            Ver de nuevo
                        </button>
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