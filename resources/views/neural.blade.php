<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'Firefly') }} - Red neuronal</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body data-page="bio-neural" data-nn-status-url="{{ route('neural.status') }}" class="min-h-screen">
        <div class="mx-auto grid w-[min(96vw,1680px)] max-w-[1680px] gap-6 px-5 pb-12 pt-7">
            @include('partials.auth-navbar')

            <header class="flex flex-wrap items-center justify-between gap-4">
                <div class="max-w-2xl">
                    <div class="text-[clamp(2rem,3vw,3.1rem)] font-bold tracking-tight">Red neuronal</div>
                    {{-- <div class="mt-2 text-sm text-[color:var(--ink-dim)]">
                        Verifica si el microservicio Python esta activo antes de entrenar sugerencias.
                    </div> --}}
                </div>
                <div id="nnStatusBadge"
                    class="rounded-full border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">
                    Verificando
                </div>
            </header>

            <section class="grid gap-4 rounded-[18px] border border-white/10 bg-[rgba(16,23,20,0.68)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[8px]">
                <div class="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Estado del microservicio</div>
                <div id="nnStatusMessage" class="text-[color:var(--ink)]">
                    Verificando conexion...
                </div>
                <div class="grid gap-3 text-xs text-[color:var(--ink-dim)] sm:grid-cols-2">
                    <div class="rounded-[14px] border border-white/10 bg-[rgba(12,18,16,0.6)] p-3">
                        <div class="text-[0.7rem] uppercase tracking-[0.2em]">URL</div>
                        <div id="nnStatusUrl" class="mt-1 font-mono text-[color:var(--ink)]">-</div>
                    </div>
                    <div class="rounded-[14px] border border-white/10 bg-[rgba(12,18,16,0.6)] p-3">
                        <div class="text-[0.7rem] uppercase tracking-[0.2em]">Latencia</div>
                        <div id="nnStatusLatency" class="mt-1 font-mono text-[color:var(--ink)]">-</div>
                    </div>
                    <div class="rounded-[14px] border border-white/10 bg-[rgba(12,18,16,0.6)] p-3 sm:col-span-2">
                        <div class="text-[0.7rem] uppercase tracking-[0.2em]">Ultima revision</div>
                        <div id="nnStatusChecked" class="mt-1 font-mono text-[color:var(--ink)]">-</div>
                    </div>
                </div>
                <div class="grid gap-2 rounded-[14px] border border-white/10 bg-[rgba(12,18,16,0.6)] p-3 text-xs">
                    <div class="text-[0.7rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Respuesta del servicio</div>
                    <pre id="nnStatusPayload" class="max-h-[220px] overflow-auto whitespace-pre-wrap font-mono text-[color:var(--ink)]">-</pre>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <button id="nnStatusRefresh" type="button"
                        class="rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)] transition hover:-translate-y-0.5">
                        Revisar conexion
                    </button>
                    {{-- <div class="text-xs text-[color:var(--ink-dim)]">
                        Ejecuta `python resources/python/nn_service.py` si esta desconectado.
                    </div> --}}
                </div>
            </section>

            <section class="grid gap-4 rounded-[18px] border border-white/10 bg-[rgba(16,23,20,0.68)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[8px]">
                <div class="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Consola de entrenamiento</div>
                <div class="text-sm text-[color:var(--ink-dim)]">
                    Muestra los logs del ultimo entrenamiento ejecutado desde el simulador.
                </div>
                <div class="grid gap-2 rounded-[14px] border border-white/10 bg-[rgba(10,14,12,0.8)] p-3 text-xs">
                    <div class="text-[0.7rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">Salida</div>
                    <pre id="nnConsole" class="max-h-[240px] overflow-auto whitespace-pre-wrap font-mono text-[color:var(--ink)]">-</pre>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <button id="nnConsoleClear" type="button"
                        class="rounded-xl border border-white/10 bg-[rgba(25,38,33,0.6)] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink-dim)] transition hover:-translate-y-0.5">
                        Limpiar consola
                    </button>
                </div>
            </section>
        </div>
    </body>
</html>
