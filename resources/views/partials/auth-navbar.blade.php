<nav class="flex flex-wrap items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-[rgba(17,25,22,0.72)] px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-[12px]">
    <div class="flex flex-wrap items-center gap-4">
        <a href="{{ route('home') }}" class="font-mono text-s uppercase tracking-[0.35em] text-[rgb(43,209,167)]">
            Firefly
        </a>
        <div class="flex flex-wrap items-center gap-2 text-xs text-[color:var(--ink-dim)]">
            <a href="{{ route('home') }}"
                class="rounded-full border px-3 py-1 uppercase tracking-[0.2em] {{ request()->routeIs('home') ? 'border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.16)] text-[rgb(43,209,167)]' : 'border-white/10 text-[color:var(--ink-dim)]' }}">
                Modo normal
            </a>
            <a href="{{ route('comparison') }}"
                class="rounded-full border px-3 py-1 uppercase tracking-[0.2em] {{ request()->routeIs('comparison') ? 'border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.16)] text-[rgb(43,209,167)]' : 'border-white/10 text-[color:var(--ink-dim)]' }}">
                Modo comparación
            </a>
            <a href="{{ route('history.index') }}"
                class="rounded-full border px-3 py-1 uppercase tracking-[0.2em] {{ request()->routeIs('history.*') ? 'border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.16)] text-[rgb(43,209,167)]' : 'border-white/10 text-[color:var(--ink-dim)]' }}">
                Historial
            </a>
            <a href="{{ route('neural.index') }}"
                class="rounded-full border px-3 py-1 uppercase tracking-[0.2em] {{ request()->routeIs('neural.*') ? 'border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.16)] text-[rgb(43,209,167)]' : 'border-white/10 text-[color:var(--ink-dim)]' }}">
                Red neuronal
            </a>
        </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
        <div class="text-right text-xs text-[color:var(--ink-dim)]">
            <div class="font-semibold text-[color:var(--ink)]">{{ Auth::user()->name }}</div>
            <div>{{ Auth::user()->email }}</div>
        </div>
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit"
                class="rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)] transition hover:-translate-y-0.5">
                Logout
            </button>
        </form>
    </div>
</nav>
