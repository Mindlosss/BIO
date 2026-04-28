<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSimulationHistoryRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class SimulationHistoryController extends Controller
{
    public function index(Request $request): View
    {
        $user = $request->user();

        $histories = $user
            ->simulationHistories()
            ->latest()
            ->take(30)
            ->get();

        return view('history', [
            'histories' => $histories,
        ]);
    }

    public function store(StoreSimulationHistoryRequest $request): JsonResponse
    {
        $history = $request->user()->simulationHistories()->create($request->validated());

        return response()->json([
            'id' => $history->id,
            'status' => 'ok',
        ]);
    }
}
