@props(['value'])

<label {{ $attributes->merge(['class' => 'block text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--ink-dim)]']) }}>
    {{ $value ?? $slot }}
</label>
