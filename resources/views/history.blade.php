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
                    {{-- <div class="mt-2 text-sm text-[color:var(--ink-dim)]">Tus ultimas simulaciones guardadas con parametros y resultados.</div> --}}
                </div>
                <div class="rounded-full border border-white/10 bg-[rgba(12,18,16,0.6)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">
                    Total: {{ $histories->count() }}
                </div>
            </header>

            @php
                $grouped = $histories->groupBy(function ($item) {
                    if ($item->mode === 'comparison' && $item->batch_id) {
                        return 'batch-'.$item->batch_id;
                    }
                    return 'single-'.$item->id;
                });
            @endphp

            <section class="grid gap-3">
                @forelse ($grouped as $group)
                    @php
                        $first = $group->first();
                        $isBatch = $first && $first->mode === 'comparison' && $first->batch_id && $group->count() > 1;
                    @endphp

                    @if ($isBatch)
                        <details class="group rounded-[18px] border border-white/10 bg-[rgba(14,20,18,0.75)] p-4 shadow-[0_24px_55px_rgba(0,0,0,0.35)] backdrop-blur-[12px]">
                            <summary class="flex cursor-pointer flex-wrap items-center justify-between gap-3 text-xs text-[color:var(--ink-dim)]">
                                <div class="flex flex-wrap items-center gap-2">
                                    <span class="rounded-full border border-[rgba(255,122,26,0.6)] bg-[rgba(255,122,26,0.12)] px-2 py-1 uppercase tracking-[0.2em] text-[color:var(--ink)]">
                                        Comparacion
                                    </span>
                                    <span class="rounded-full border border-white/10 px-2 py-1 uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">
                                        Lote {{ $first->batch_id }}
                                    </span>
                                    <span class="rounded-full border border-white/10 px-2 py-1 uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">
                                        {{ $group->count() }} algoritmos
                                    </span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <span>{{ $first->created_at->format('d/m/Y H:i') }}</span>
                                    <span class="text-[0.7rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)] group-open:text-[color:var(--ink)]">
                                        Detalles
                                    </span>
                                </div>
                            </summary>
                            <div class="mt-3 grid gap-3">
                                @foreach ($group as $history)
                                    <article class="grid gap-2 rounded-[14px] border border-white/10 bg-[rgba(12,18,16,0.6)] p-3 text-xs text-[color:var(--ink-dim)]">
                                        <div class="flex flex-wrap items-center justify-between gap-2">
                                            <div class="flex flex-wrap items-center gap-2">
                                                <span class="rounded-full border border-white/10 px-2 py-1 uppercase tracking-[0.2em]">{{ $history->algo }}</span>
                                                <span class="rounded-full border border-white/10 px-2 py-1 uppercase tracking-[0.2em]">{{ $history->objective }}</span>
                                                <span class="rounded-full border border-[rgba(43,209,167,0.4)] bg-[rgba(43,209,167,0.12)] px-2 py-1 text-[color:var(--ink)]">
                                                    Mejor f: {{ data_get($history->metrics, 'best.f') ?? '-' }}
                                                </span>
                                            </div>
                                            <div class="text-[0.7rem] text-[color:var(--ink-dim)]">{{ $history->created_at->format('H:i') }}</div>
                                        </div>
                                        <div class="flex flex-wrap gap-2">
                                            <span class="rounded-full border border-white/10 px-2 py-1">Dominio: <span class="text-[color:var(--ink)]">±{{ $history->bounds }}</span></span>
                                            <span class="rounded-full border border-white/10 px-2 py-1">Poblacion: <span class="text-[color:var(--ink)]">{{ $history->population }}</span></span>
                                            <span class="rounded-full border border-white/10 px-2 py-1">Iter: <span class="text-[color:var(--ink)]">{{ $history->iterations }}</span></span>
                                            <span class="rounded-full border border-white/10 px-2 py-1">Semilla: <span class="text-[color:var(--ink)]">{{ $history->seed }}</span></span>
                                        </div>
                                        <div class="flex flex-wrap gap-2">
                                            <span class="rounded-full border border-white/10 px-2 py-1">Promedio f: <span class="text-[color:var(--ink)]">{{ data_get($history->metrics, 'avg_f') ?? '-' }}</span></span>
                                            <span class="rounded-full border border-white/10 px-2 py-1">Diversidad: <span class="text-[color:var(--ink)]">{{ data_get($history->metrics, 'diversity') ?? '-' }}</span></span>
                                        </div>
                                    </article>
                                @endforeach
                            </div>
                        </details>
                    @else
                        @php
                            $history = $group->first();
                        @endphp
                        <details class="group rounded-[16px] border border-white/10 bg-[rgba(17,25,22,0.72)] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.32)] backdrop-blur-[12px]">
                            <summary class="flex cursor-pointer flex-wrap items-center justify-between gap-3 text-xs text-[color:var(--ink-dim)]">
                                <div class="flex flex-wrap items-center gap-2">
                                    <span class="rounded-full border border-white/10 px-2 py-1 uppercase tracking-[0.2em]">Normal</span>
                                    <span class="rounded-full border border-white/10 px-2 py-1 uppercase tracking-[0.2em]">{{ $history->algo }}</span>
                                    <span class="rounded-full border border-white/10 px-2 py-1 uppercase tracking-[0.2em]">{{ $history->objective }}</span>
                                    <span class="rounded-full border border-[rgba(43,209,167,0.4)] bg-[rgba(43,209,167,0.12)] px-2 py-1 text-[color:var(--ink)]">
                                        Mejor f: {{ data_get($history->metrics, 'best.f') ?? '-' }}
                                    </span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <span>{{ $history->created_at->format('d/m/Y H:i') }}</span>
                                    <span class="text-[0.7rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)] group-open:text-[color:var(--ink)]">
                                        Detalles
                                    </span>
                                </div>
                            </summary>
                            <div class="mt-3 grid gap-2 text-xs text-[color:var(--ink-dim)] sm:grid-cols-2">
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
                                </div>
                            </div>
                        </details>
                    @endif
                @empty
                    <div class="rounded-[18px] border border-white/10 bg-[rgba(17,25,22,0.72)] p-8 text-center text-sm text-[color:var(--ink-dim)]">
                        Aun no hay simulaciones guardadas. Ejecuta una simulacion y guarda el resultado.
                    </div>
                @endforelse
            </section>
        </div>
    </body>
</html>
