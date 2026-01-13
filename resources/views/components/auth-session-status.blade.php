@props(['status'])

@if ($status)
    <div {{ $attributes->merge(['class' => 'text-xs text-[rgb(43,209,167)]']) }}>
        {{ $status }}
    </div>
@endif
