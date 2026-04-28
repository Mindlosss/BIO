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

            <section class="grid gap-4">
                @forelse ($grouped as $group)
                    @php
                        $first = $group->first();
                        $isBatch = $first && $first->mode === 'comparison' && $first->batch_id && $group->count() > 1;
                    @endphp

                    @if ($isBatch)
                        <details class="group overflow-hidden rounded-[22px] border border-[rgba(255,122,26,0.22)] bg-[rgba(14,20,18,0.78)] shadow-[0_24px_60px_rgba(0,0,0,0.36)] backdrop-blur-[12px] transition hover:border-[rgba(255,122,26,0.42)]">
                            <summary class="grid cursor-pointer list-none gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                                <div class="flex min-w-0 flex-wrap items-center gap-3">
                                    <div class="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[rgba(255,122,26,0.28)] bg-[rgba(255,122,26,0.14)] font-mono text-sm font-bold text-[rgb(255,194,149)]">
                                        {{ $group->count() }}
                                    </div>
                                    <div class="min-w-0">
                                        <div class="flex flex-wrap items-center gap-2">
                                            <span class="rounded-full border border-[rgba(255,122,26,0.6)] bg-[rgba(255,122,26,0.14)] px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-[color:var(--ink)]">
                                                Comparación
                                            </span>
                                            <span class="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">
                                                Lote {{ $first->batch_id }}
                                            </span>
                                        </div>
                                        <div class="mt-2 text-lg font-semibold text-[color:var(--ink)]">
                                            {{ $group->count() }} algoritmos comparados
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between gap-4 text-xs text-[color:var(--ink-dim)] sm:justify-end">
                                    <span class="font-mono">{{ $first->created_at->format('d/m/Y H:i') }}</span>
                                    <span class="rounded-full border border-white/10 px-3 py-1 uppercase tracking-[0.2em] transition group-open:border-[rgba(43,209,167,0.45)] group-open:text-[rgb(43,209,167)]">
                                        Detalles
                                    </span>
                                </div>
                            </summary>
                            <div class="grid gap-3 border-t border-white/10 bg-[rgba(6,9,8,0.22)] p-4">
                                @foreach ($group as $history)
                                    <article class="grid gap-3 rounded-[16px] border border-white/10 bg-[rgba(12,18,16,0.72)] p-4 text-xs text-[color:var(--ink-dim)] transition hover:border-white/20">
                                        <div class="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <div class="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-[rgb(255,122,26)]">{{ $history->algo }}</div>
                                                <div class="mt-1 text-base font-semibold text-[color:var(--ink)]">{{ $history->objective }}</div>
                                            </div>
                                            <div class="rounded-[14px] border border-[rgba(43,209,167,0.28)] bg-[rgba(43,209,167,0.09)] px-3 py-2 text-right">
                                                <div class="text-[0.62rem] uppercase tracking-[0.18em] text-[color:var(--ink-dim)]">Mejor f</div>
                                                <div class="mt-1 font-mono text-sm font-semibold text-[rgb(43,209,167)]">{{ data_get($history->metrics, 'best.f') ?? '-' }}</div>
                                            </div>
                                        </div>
                                        <div class="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
                                            <div class="rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2">Dominio <span class="block font-mono text-[color:var(--ink)]">±{{ $history->bounds }}</span></div>
                                            <div class="rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2">Población <span class="block font-mono text-[color:var(--ink)]">{{ $history->population }}</span></div>
                                            <div class="rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2">Iter <span class="block font-mono text-[color:var(--ink)]">{{ $history->iterations }}</span></div>
                                            <div class="rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2">Semilla <span class="block font-mono text-[color:var(--ink)]">{{ $history->seed }}</span></div>
                                            <div class="rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2">Promedio f <span class="block font-mono text-[color:var(--ink)]">{{ data_get($history->metrics, 'avg_f') ?? '-' }}</span></div>
                                            <div class="rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2">Diversidad <span class="block font-mono text-[color:var(--ink)]">{{ data_get($history->metrics, 'diversity') ?? '-' }}</span></div>
                                        </div>
                                    </article>
                                @endforeach
                            </div>
                        </details>
                    @else
                        @php
                            $history = $group->first();
                        @endphp
                        <details class="group overflow-hidden rounded-[22px] border border-white/10 bg-[rgba(17,25,22,0.76)] shadow-[0_20px_50px_rgba(0,0,0,0.32)] backdrop-blur-[12px] transition hover:border-[rgba(43,209,167,0.34)] open:border-[rgba(43,209,167,0.42)]">
                            <summary class="grid cursor-pointer list-none gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                                <div class="flex min-w-0 flex-wrap items-center gap-3">
                                    <div class="flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-[rgba(43,209,167,0.24)] bg-[rgba(43,209,167,0.1)] px-1 text-center font-mono text-[clamp(0.48rem,1.4vw,0.68rem)] font-bold uppercase leading-none text-[rgb(43,209,167)]">
                                        {{ $history->algo }}
                                    </div>
                                    <div class="min-w-0">
                                        <div class="flex flex-wrap items-center gap-2">
                                            <span class="rounded-full border border-[rgba(43,209,167,0.45)] bg-[rgba(43,209,167,0.1)] px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-[color:var(--ink)]">
                                                Normal
                                            </span>
                                            <span class="max-w-full break-words rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">
                                                {{ $history->objective }}
                                            </span>
                                        </div>
                                        <div class="mt-2 min-w-0 text-lg font-semibold text-[color:var(--ink)]">
                                            <span class="break-words">{{ strtoupper($history->algo) }}</span>
                                            <span class="text-[color:var(--ink-dim)]">en</span>
                                            <span class="break-words">{{ $history->objective }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between gap-3 text-xs text-[color:var(--ink-dim)] sm:justify-end sm:min-w-[260px]">
                                    <span class="font-mono">
                                        {{ $history->created_at->format('d/m/Y H:i') }}
                                    </span>
                                    <span class="rounded-full border border-white/10 px-3 py-1 uppercase tracking-[0.2em] transition group-open:border-[rgba(43,209,167,0.45)] group-open:text-[rgb(43,209,167)]">
                                        Detalles
                                    </span>
                                </div>
                            </summary>
                            <div class="grid gap-3 border-t border-white/10 bg-[rgba(6,9,8,0.22)] p-4">
                                <article class="grid gap-3 rounded-[16px] border border-white/10 bg-[rgba(12,18,16,0.72)] p-4 text-xs text-[color:var(--ink-dim)]">
                                    <div class="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <div class="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-[rgb(43,209,167)]">{{ $history->algo }}</div>
                                            <div class="mt-1 text-base font-semibold text-[color:var(--ink)]">{{ $history->objective }}</div>
                                        </div>
                                        <div class="rounded-[14px] border border-[rgba(43,209,167,0.28)] bg-[rgba(43,209,167,0.09)] px-3 py-2 text-right">
                                            <div class="text-[0.62rem] uppercase tracking-[0.18em] text-[color:var(--ink-dim)]">Mejor f</div>
                                            <div class="mt-1 break-all font-mono text-sm font-semibold text-[rgb(43,209,167)]">{{ data_get($history->metrics, 'best.f') ?? '-' }}</div>
                                        </div>
                                    </div>
                                    <div class="grid gap-2 sm:grid-cols-3 lg:grid-cols-7">
                                        <div class="rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2">Dominio <span class="block font-mono text-[color:var(--ink)]">±{{ $history->bounds }}</span></div>
                                        <div class="rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2">Población <span class="block font-mono text-[color:var(--ink)]">{{ $history->population }}</span></div>
                                        <div class="rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2">Iter <span class="block font-mono text-[color:var(--ink)]">{{ $history->iterations }}</span></div>
                                        <div class="rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2">Semilla <span class="block break-all font-mono text-[color:var(--ink)]">{{ $history->seed }}</span></div>
                                        <div class="rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2">Convergencia <span class="block break-words font-mono text-[color:var(--ink)]">{{ $history->convergence ?? 'Equilibrado' }}</span></div>
                                        <div class="rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2">Promedio f <span class="block break-all font-mono text-[color:var(--ink)]">{{ data_get($history->metrics, 'avg_f') ?? '-' }}</span></div>
                                        <div class="rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2">Diversidad <span class="block break-all font-mono text-[color:var(--ink)]">{{ data_get($history->metrics, 'diversity') ?? '-' }}</span></div>
                                    </div>
                                </article>
                            </div>
                        </details>
                    @endif
                @empty
                    <div class="grid gap-3 rounded-[22px] border border-dashed border-white/15 bg-[rgba(17,25,22,0.72)] p-10 text-center text-sm text-[color:var(--ink-dim)]">
                        <div class="text-lg font-semibold text-[color:var(--ink)]">Aún no hay simulaciones guardadas</div>
                        <div>Ejecuta una simulación y guarda el resultado para verlo aquí.</div>
                    </div>
                @endforelse
            </section>
        </div>
    </body>
</html>
