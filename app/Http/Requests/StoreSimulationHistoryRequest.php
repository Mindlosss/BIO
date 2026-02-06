<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSimulationHistoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
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
            'seed' => ['required', 'integer', 'min:1'],
            'show_trails' => ['required', 'boolean'],
            'surface_mode' => ['nullable', 'string', 'max:16'],
            'parameters' => ['required', 'array'],
            'metrics' => ['required', 'array'],
            'metrics.best' => ['nullable', 'array'],
            'metrics.best.f' => ['nullable', 'numeric'],
            'metrics.best.x' => ['nullable', 'numeric'],
            'metrics.best.y' => ['nullable', 'numeric'],
            'metrics.avg_f' => ['nullable', 'numeric'],
            'metrics.diversity' => ['nullable', 'numeric'],
            'metrics.speed_avg' => ['nullable', 'numeric'],
            'history' => ['nullable', 'array'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'algo.required' => 'Debes seleccionar un algoritmo.',
            'objective.required' => 'Debes seleccionar una funcion objetivo.',
            'bounds.required' => 'Debes indicar el limite del dominio.',
            'population.required' => 'Debes indicar la poblacion.',
            'iterations.required' => 'Debes indicar las iteraciones.',
            'seed.required' => 'Debes indicar la semilla.',
            'show_trails.required' => 'Debes indicar si se muestran trayectorias.',
            'parameters.required' => 'Debes enviar los parametros de la simulacion.',
            'metrics.required' => 'Debes enviar las metricas de la simulacion.',
        ];
    }
}
