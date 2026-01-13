<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'Firefly') }}</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body data-page="bio-landing" class="min-h-screen">
        <div class="mx-auto grid w-[min(96vw,1200px)] max-w-[1200px] gap-10 px-5 pb-16 pt-10">
            <header class="flex flex-wrap items-center justify-between gap-4">
                <div class="font-mono text-xs uppercase tracking-[0.35em] text-[rgb(43,209,167)]">Firefly</div>
                <div class="flex items-center gap-2 text-xs text-[color:var(--ink-dim)]">
                    <span class="rounded-full border border-white/10 px-2 py-1">v1.0</span>
                    <span class="rounded-full border border-white/10 px-2 py-1">Simulador</span>
                </div>
            </header>

            <section class="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                <div class="grid gap-6">
                    <div>
                        <h1 class="text-[clamp(2.4rem,4vw,4rem)] font-bold tracking-tight">
                            Laboratorio de algoritmos bioinspirados
                        </h1>
                        <p class="mt-3 max-w-2xl text-lg leading-relaxed text-[color:var(--ink-dim)]">
                            Visualiza PSO, Firefly, GA, Cuckoo y ACO con vistas 2D, 3D y grafica de convergencia.
                            Ajusta parametros en tiempo real y compara estrategias en un solo panel.
                        </p>
                    </div>

                    <div class="flex flex-wrap gap-3">
                        <a href="{{ route('login') }}"
                            class="rounded-xl bg-[linear-gradient(135deg,#ff7a1a,#ffb36b)] px-5 py-3 text-sm font-semibold text-[#0e0f0f] shadow-[0_10px_25px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5">
                            Iniciar sesion
                        </a>
                        @if (Route::has('register'))
                            <a href="{{ route('register') }}"
                                class="rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-5 py-3 text-sm font-semibold text-[color:var(--ink)] transition hover:-translate-y-0.5">
                                Crear cuenta
                            </a>
                        @endif
                    </div>
                </div>

                <div class="grid gap-4 rounded-[22px] border border-white/10 bg-[rgba(17,25,22,0.72)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[14px]">
                    <div class="text-sm uppercase tracking-[0.3em] text-[color:var(--ink-dim)]">Que incluye</div>
                    <div class="grid gap-3 text-sm text-[color:var(--ink-dim)]">
                        <div class="rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] p-4">
                            Panel unico para configurar algoritmos y parametros criticos.
                        </div>
                        <div class="rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] p-4">
                            Proyeccion isometrica + curvas de convergencia en tiempo real.
                        </div>
                        <div class="rounded-xl border border-white/10 bg-[rgba(12,18,16,0.6)] p-4">
                            Modo comparacion para ver rendimiento lado a lado.
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </body>
</html>
