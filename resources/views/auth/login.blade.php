<x-guest-layout>
    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    <div class="mb-6 grid gap-2">
        <div class="text-lg font-semibold text-[color:var(--ink)]">Iniciar sesion</div>
        <div class="text-sm text-[color:var(--ink-dim)]">
            Accede al simulador para continuar con tus configuraciones.
        </div>
    </div>

    <form method="POST" action="{{ route('login') }}" class="grid gap-4">
        @csrf

        <!-- Email Address -->
        <div>
            <x-input-label for="email" :value="__('Email')" />
            <x-text-input id="email" class="mt-2" type="email" name="email" :value="old('email')" required autofocus autocomplete="username" />
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <!-- Password -->
        <div>
            <x-input-label for="password" :value="__('Password')" />

            <x-text-input id="password" class="mt-2"
                            type="password"
                            name="password"
                            required autocomplete="current-password" />

            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <!-- Remember Me -->
        <div class="flex items-center justify-between gap-4">
            <label for="remember_me" class="inline-flex items-center">
                <input id="remember_me" type="checkbox" class="h-4 w-4 rounded border-white/30 bg-[rgba(25,38,33,0.92)] accent-[rgb(255,122,26)]" name="remember">
                <span class="ms-2 text-sm text-[color:var(--ink-dim)]">{{ __('Remember me') }}</span>
            </label>

            @if (Route::has('password.request'))
                <a class="text-sm text-[color:var(--ink-dim)] underline decoration-dotted underline-offset-4 hover:text-[color:var(--ink)]" href="{{ route('password.request') }}">
                    {{ __('Forgot your password?') }}
                </a>
            @endif
        </div>

        <div class="flex items-center justify-end">
            <x-primary-button>
                {{ __('Log in') }}
            </x-primary-button>
        </div>
    </form>
</x-guest-layout>
