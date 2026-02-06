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

            <section class="grid gap-3">
                @forelse ($histories as $history)
                    <article class="grid gap-3 rounded-[16px] border border-white/10 bg-[rgba(17,25,22,0.72)] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.32)] backdrop-blur-[12px]">
                        <div class="grid gap-3 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                            <div class="grid gap-2">
                                <div class="flex flex-wrap items-center gap-2 text-xs text-[color:var(--ink-dim)]">
                                    <span class="rounded-full border border-white/10 px-2 py-1 uppercase tracking-[0.2em]">{{ $history->algo }}</span>
                                    <span class="rounded-full border border-white/10 px-2 py-1 uppercase tracking-[0.2em]">{{ $history->objective }}</span>
                                    <span class="rounded-full border border-[rgba(43,209,167,0.4)] bg-[rgba(43,209,167,0.12)] px-2 py-1 text-[color:var(--ink)]">
                                        Mejor f: {{ data_get($history->metrics, 'best.f') ?? '-' }}
                                    </span>
                                </div>
                                <div class="text-xs text-[color:var(--ink-dim)]">{{ $history->created_at->format('d/m/Y H:i') }}</div>
                            </div>
                            <div class="grid gap-2 text-xs text-[color:var(--ink-dim)]">
                                <div class="flex flex-wrap gap-2">
                                    <span class="rounded-full border border-white/10 bg-[rgba(12,18,16,0.6)] px-2 py-1">Dominio: <span class="text-[color:var(--ink)]">±{{ $history->bounds }}</span></span>
                                    <span class="rounded-full border border-white/10 bg-[rgba(12,18,16,0.6)] px-2 py-1">Poblacion: <span class="text-[color:var(--ink)]">{{ $history->population }}</span></span>
                                    <span class="rounded-full border border-white/10 bg-[rgba(12,18,16,0.6)] px-2 py-1">Iter: <span class="text-[color:var(--ink)]">{{ $history->iterations }}</span></span>
                                    <span class="rounded-full border border-white/10 bg-[rgba(12,18,16,0.6)] px-2 py-1">Semilla: <span class="text-[color:var(--ink)]">{{ $history->seed }}</span></span>
                                    <span class="rounded-full border border-white/10 bg-[rgba(12,18,16,0.6)] px-2 py-1">Convergencia: <span class="text-[color:var(--ink)]">{{ $history->convergence ?? 'Equilibrado' }}</span></span>
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    <span class="rounded-full border border-white/10 px-2 py-1">Promedio f: <span class="text-[color:var(--ink)]">{{ data_get($history->metrics, 'avg_f') ?? '-' }}</span></span>
                                    <span class="rounded-full border border-white/10 px-2 py-1">Diversidad: <span class="text-[color:var(--ink)]">{{ data_get($history->metrics, 'diversity') ?? '-' }}</span></span>
                                    <span class="rounded-full border border-white/10 px-2 py-1">Mejora: <span class="text-[color:var(--ink)]">{{ data_get($history->metrics, 'improve') ?? '-' }}</span></span>
                                </div>
                            </div>
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
