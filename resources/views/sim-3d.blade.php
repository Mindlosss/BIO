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

            <div class="grid gap-4 rounded-[18px] border border-white/10 bg-[rgba(16,23,20,0.68)] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[8px]">
                <div class="flex flex-wrap items-center justify-between gap-3 text-[color:var(--ink-dim)]">
                    <div class="text-sm uppercase tracking-[0.25em]">Simulacion 3D</div>
                    <button type="button"
                        class="rounded-full border border-white/10 px-3 py-1 text-xs text-[color:var(--ink-dim)]"
                        onclick="window.close(); setTimeout(() => { if (!window.closed) window.location.href = '{{ route('home') }}'; }, 150);">
                        Volver al simulador
                    </button>
                </div>
                <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <div id="three-root" class="min-h-[360px] h-[60vh] max-h-[640px] w-full overflow-hidden rounded-[16px] border border-white/10"></div>
                    <div class="grid content-start gap-3 rounded-[16px] border border-white/10 bg-[rgba(12,18,16,0.6)] p-4 text-sm text-[color:var(--ink-dim)]">
                        <div class="font-mono text-xs uppercase tracking-[0.2em] text-[rgb(43,209,167)]">Datos</div>
                        <div>Algoritmo: <span id="algoLabel" class="text-[color:var(--ink)]">-</span></div>
                        <div>Funcion: <span id="objectiveLabel" class="text-[color:var(--ink)]">-</span></div>
                        <div>Iteracion: <span id="iterLabel" class="text-[color:var(--ink)]">0</span></div>
                        <div>Mejor f: <span id="bestLabel" class="text-[color:var(--ink)]">-</span></div>
                        <div class="text-xs text-[color:var(--ink-dim)]">
                            Usa el mouse para rotar, zoom y mover la escena.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
