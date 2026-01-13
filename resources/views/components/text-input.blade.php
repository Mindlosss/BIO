@props(['disabled' => false])

<input @disabled($disabled) {{ $attributes->merge(['class' => 'w-full rounded-xl border border-white/15 bg-[rgba(25,38,33,0.92)] px-3 py-2 text-sm text-[color:var(--ink)] placeholder:text-[color:var(--ink-dim)] focus:border-[rgba(255,122,26,0.8)] focus:ring-[rgba(255,122,26,0.35)]']) }}>
