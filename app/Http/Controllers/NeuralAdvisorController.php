<?php

namespace App\Http\Controllers;

use App\Http\Requests\NeuralSuggestRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NeuralAdvisorController extends Controller
{
    public function suggest(NeuralSuggestRequest $request): JsonResponse
    {
        $histories = $request->user()
            ->simulationHistories()
            ->latest()
            ->take(200)
            ->get([
                'algo',
                'objective',
                'convergence',
                'bounds',
                'population',
                'iterations',
                'parameters',
                'metrics',
            ]);

        $payload = [
            'history' => $histories->map(function ($history) {
                return [
                    'algo' => $history->algo,
                    'objective' => $history->objective,
                    'convergence' => $history->convergence,
                    'bounds' => $history->bounds,
                    'population' => $history->population,
                    'iterations' => $history->iterations,
                    'parameters' => $history->parameters,
                    'metrics' => $history->metrics,
                ];
            })->values(),
            'current' => $request->validated(),
        ];

        $serviceUrl = rtrim((string) config('services.nn_service_url'), '/');

        if ($serviceUrl === '') {
            return response()->json([
                'status' => 'error',
                'message' => 'El servicio de red neuronal no esta configurado.',
            ], 503);
        }

        Log::info('NN suggest request', [
            'service_url' => $serviceUrl,
            'current' => $payload['current'] ?? null,
            'history_count' => $histories->count(),
        ]);

        $response = Http::timeout(12)->post($serviceUrl.'/train-suggest', $payload);

        if (! $response->ok()) {
            Log::warning('NN suggest response error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'No se pudo consultar el servicio de red neuronal.',
            ], 503);
        }

        Log::info('NN suggest response ok', [
            'body' => $response->json(),
        ]);

        return response()->json($response->json());
    }

    public function status(): JsonResponse
    {
        $serviceUrl = rtrim((string) config('services.nn_service_url'), '/');

        if ($serviceUrl === '') {
            return response()->json([
                'status' => 'down',
                'message' => 'El servicio de red neuronal no esta configurado.',
                'service_url' => null,
            ], 503);
        }

        try {
            $response = Http::timeout(3)->get($serviceUrl.'/health');
        } catch (\Throwable $exception) {
            return response()->json([
                'status' => 'down',
                'message' => 'No se pudo conectar con el servicio de red neuronal.',
                'service_url' => $serviceUrl,
            ], 503);
        }

        if (! $response->ok()) {
            return response()->json([
                'status' => 'down',
                'message' => 'El servicio de red neuronal no responde.',
                'service_url' => $serviceUrl,
            ], 503);
        }

        return response()->json([
            'status' => 'ok',
            'message' => 'Servicio de red neuronal activo.',
            'data' => $response->json(),
            'service_url' => $serviceUrl,
        ]);
    }
}
