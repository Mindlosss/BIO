<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Firefly') }}</title>

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body data-page="bio-landing" class="min-h-screen antialiased">
        <div class="mx-auto grid min-h-screen w-[min(96vw,520px)] max-w-[520px] place-content-center gap-6 px-5 py-10">
            <div class="flex items-center justify-between">
                <a href="{{ route('landing') }}"
                    class="font-mono text-xs uppercase tracking-[0.35em] text-[rgb(43,209,167)]">
                    Firefly
                </a>
                <a href="{{ route('landing') }}"
                    class="rounded-full border border-white/10 px-3 py-1 text-xs text-[color:var(--ink-dim)]">
                    Volver
                </a>
            </div>

            <div class="rounded-[22px] border border-white/10 bg-[rgba(17,25,22,0.72)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[14px]">
                {{ $slot }}
            </div>
        </div>
    </body>
</html>
