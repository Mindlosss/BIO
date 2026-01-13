<button {{ $attributes->merge(['type' => 'button', 'class' => 'inline-flex items-center justify-center rounded-xl border border-[rgba(43,209,167,0.6)] bg-[rgba(43,209,167,0.15)] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[rgba(43,209,167,0.35)] disabled:opacity-40']) }}>
    {{ $slot }}
</button>
