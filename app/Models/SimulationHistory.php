<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SimulationHistory extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'algo',
        'objective',
        'convergence',
        'bounds',
        'population',
        'iterations',
        'seed',
        'show_trails',
        'surface_mode',
        'parameters',
        'metrics',
        'history',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'show_trails' => 'boolean',
            'parameters' => 'array',
            'metrics' => 'array',
            'history' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
