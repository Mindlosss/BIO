<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NeuralSuggestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'algo' => ['required', 'string', 'max:32'],
            'objective' => ['required', 'string', 'max:32'],
            'convergence' => ['nullable', 'string', 'max:24'],
            'bounds' => ['required', 'integer', 'min:1', 'max:100'],
            'population' => ['required', 'integer', 'min:1', 'max:2000'],
            'iterations' => ['required', 'integer', 'min:1', 'max:20000'],
            'parameters' => ['required', 'array'],
            'parameters.*' => ['nullable', 'numeric'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'algo.required' => 'Debes enviar el algoritmo actual.',
            'objective.required' => 'Debes enviar la funcion objetivo actual.',
            'bounds.required' => 'Debes indicar el limite del dominio.',
            'population.required' => 'Debes indicar la poblacion.',
            'iterations.required' => 'Debes indicar las iteraciones.',
            'parameters.required' => 'Debes enviar los parametros actuales.',
        ];
    }
}
