<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('simulation_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('algo', 32);
            $table->string('objective', 32);
            $table->string('convergence', 24)->nullable();
            $table->unsignedSmallInteger('bounds');
            $table->unsignedSmallInteger('population');
            $table->unsignedSmallInteger('iterations');
            $table->unsignedBigInteger('seed');
            $table->boolean('show_trails')->default(true);
            $table->string('surface_mode', 16)->nullable();
            $table->json('parameters');
            $table->json('metrics');
            $table->json('history')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('simulation_histories');
    }
};
