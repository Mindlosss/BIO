<nav class="flex flex-wrap items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-[rgba(17,25,22,0.72)] px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-[12px]">
    <div class="flex flex-wrap items-center gap-4">
        <a href="{{ route('home') }}" class="font-mono text-xs uppercase tracking-[0.35em] text-[rgb(43,209,167)]">
            Firefly
        </a>
        <div class="hidden items-center gap-3 text-xs text-[color:var(--ink-dim)] sm:flex">
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
