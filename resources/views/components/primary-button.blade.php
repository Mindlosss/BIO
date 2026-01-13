<button {{ $attributes->merge(['type' => 'submit', 'class' => 'inline-flex items-center justify-center rounded-xl bg-[linear-gradient(135deg,#ff7a1a,#ffb36b)] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[#0e0f0f] shadow-[0_10px_25px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[rgba(255,122,26,0.35)]']) }}>
    {{ $slot }}
</button>
