<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'Firefly') }} - Historial</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body data-page="bio-sim" class="min-h-screen">
        <div class="mx-auto grid w-[min(96vw,1680px)] max-w-[1680px] gap-6 px-5 pb-12 pt-7">
            @include('partials.auth-navbar')

            <header class="flex flex-wrap items-center justify-between gap-4">
                <div class="max-w-2xl">
                    <div class="text-[clamp(2rem,3vw,3.1rem)] font-bold tracking-tight">Historial de simulaciones</div>
                    <div class="mt-2 text-sm text-[color:var(--ink-dim)]">Tus ultimas simulaciones guardadas con parametros y resultados.</div>
                </div>
            </header>

            <section class="grid gap-4">
                @forelse ($histories as $history)
                    <article class="grid gap-4 rounded-[18px] border border-white/10 bg-[rgba(17,25,22,0.72)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[12px]">
                        <div class="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <div class="text-sm uppercase tracking-[0.25em] text-[color:var(--ink-dim)]">{{ $history->algo }} · {{ $history->objective }}</div>
                                <div class="text-xs text-[color:var(--ink-dim)]">{{ $history->created_at->format('d/m/Y H:i') }}</div>
                            </div>
                            <div class="rounded-full border border-[rgba(43,209,167,0.4)] bg-[rgba(43,209,167,0.12)] px-3 py-1 text-xs text-[color:var(--ink)]">
                                Mejor f: {{ data_get($history->metrics, 'best.f') ?? '-' }}
                            </div>
                        </div>
                        <div class="grid gap-3 text-sm text-[color:var(--ink-dim)] md:grid-cols-3">
                            <div class="rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-2">
                                <div class="text-[0.7rem] uppercase tracking-[0.2em]">Dominio</div>
                                <div class="text-[color:var(--ink)]">±{{ $history->bounds }}</div>
                            </div>
                            <div class="rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-2">
                                <div class="text-[0.7rem] uppercase tracking-[0.2em]">Poblacion</div>
                                <div class="text-[color:var(--ink)]">{{ $history->population }}</div>
                            </div>
                            <div class="rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-2">
                                <div class="text-[0.7rem] uppercase tracking-[0.2em]">Iteraciones</div>
                                <div class="text-[color:var(--ink)]">{{ $history->iterations }}</div>
                            </div>
                            <div class="rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-2">
                                <div class="text-[0.7rem] uppercase tracking-[0.2em]">Velocidad</div>
                                <div class="text-[color:var(--ink)]">{{ number_format($history->speed, 2) }}x</div>
                            </div>
                            <div class="rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-2">
                                <div class="text-[0.7rem] uppercase tracking-[0.2em]">Semilla</div>
                                <div class="text-[color:var(--ink)]">{{ $history->seed }}</div>
                            </div>
                            <div class="rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-2">
                                <div class="text-[0.7rem] uppercase tracking-[0.2em]">Convergencia</div>
                                <div class="text-[color:var(--ink)]">{{ $history->convergence ?? 'Equilibrado' }}</div>
                            </div>
                        </div>
                        <div class="grid gap-2 text-xs text-[color:var(--ink-dim)]">
                            <div>Promedio f: <span class="text-[color:var(--ink)]">{{ data_get($history->metrics, 'avg_f') ?? '-' }}</span></div>
                            <div>Diversidad: <span class="text-[color:var(--ink)]">{{ data_get($history->metrics, 'diversity') ?? '-' }}</span></div>
                            <div>Mejora: <span class="text-[color:var(--ink)]">{{ data_get($history->metrics, 'improve') ?? '-' }}</span></div>
                        </div>
                    </article>
                @empty
                    <div class="rounded-[18px] border border-white/10 bg-[rgba(17,25,22,0.72)] p-8 text-center text-sm text-[color:var(--ink-dim)]">
                        Aun no hay simulaciones guardadas. Ejecuta una simulacion y guarda el resultado.
                    </div>
                @endforelse
            </section>
        </div>
    </body>
</html>
