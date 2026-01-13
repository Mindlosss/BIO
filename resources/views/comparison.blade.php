<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'BIO Lab') }} - Comparacion</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body data-page="bio-compare">
        <div class="page">
            <header>
                <div>
                    <div class="title">BIO Lab Comparacion</div>
                    <div class="subtitle">
                        Compara algoritmos bioinspirados en la misma funcion objetivo con vistas 2D, 3D y grafica
                        de convergencia para cada algoritmo.
                    </div>
                </div>
                <a class="pill" href="{{ url('/') }}">Modo normal</a>
            </header>

            <div class="layout">
                <aside class="panel controls">
                    <div class="control-group">
                        <label for="objective">Funcion objetivo</label>
                        <select id="objective">
                            <option value="sphere">Sphere</option>
                            <option value="rastrigin">Rastrigin</option>
                            <option value="rosenbrock">Rosenbrock</option>
                            <option value="ackley">Ackley</option>
                            <option value="griewank">Griewank</option>
                            <option value="styblinski">Styblinski-Tang</option>
                            <option value="schwefel">Schwefel</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label for="surfaceMode">Superficie</label>
                        <label class="toggle-row">
                            <input id="surfaceMode" type="checkbox">
                            <span>Vista popular (sin suavizado)</span>
                        </label>
                    </div>
                    <div class="control-group">
                        <label for="convergence">Modo de convergencia</label>
                        <select id="convergence">
                            <option value="exploracion">Exploracion</option>
                            <option value="equilibrado" selected>Equilibrado</option>
                            <option value="optimo">Optimo</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Comparar algoritmos</label>
                        <div class="compare-list">
                            <label class="compare-item">
                                <input type="checkbox" id="comparePso" checked>
                                <span>PSO</span>
                            </label>
                            <label class="compare-item">
                                <input type="checkbox" id="compareFirefly" checked>
                                <span>Firefly</span>
                            </label>
                            <label class="compare-item">
                                <input type="checkbox" id="compareGa">
                                <span>Genetic</span>
                            </label>
                            <label class="compare-item">
                                <input type="checkbox" id="compareCuckoo">
                                <span>Cuckoo</span>
                            </label>
                            <label class="compare-item">
                                <input type="checkbox" id="compareAco">
                                <span>ACO</span>
                            </label>
                        </div>
                    </div>
                    <div class="control-group">
                        <label for="bounds">Dominio (limite)</label>
                        <input id="bounds" type="number" min="2" max="20" step="1" value="5">
                    </div>
                    <div class="control-group">
                        <label for="pop">Poblacion</label>
                        <input id="pop" type="number" min="10" max="300" value="60">
                    </div>
                    <div class="control-group">
                        <label for="iterations">Iteraciones</label>
                        <input id="iterations" type="number" min="10" max="5000" step="10" value="300">
                    </div>
                    <div class="control-group">
                        <label for="speed">Velocidad (camara lenta)</label>
                        <div class="range-row">
                            <input id="speed" type="range" min="0.25" max="8" step="0.25" value="2">
                            <span id="speedValue">2x</span>
                        </div>
                    </div>

                    <div class="buttons">
                        <button id="benchmark" class="secondary button-full">Iniciar</button>
                        <button id="reset" class="secondary button-full">Reset</button>
                    </div>
                    <div class="stats" id="stats">
                        <div>Iter: <strong id="iter">0</strong></div>
                        <div>Best f: <strong id="bestF">-</strong></div>
                        <div>Best x,y: <strong id="bestXY">-</strong></div>
                    </div>
                    <div class="info">
                        <div class="tag" id="algoTag">PSO</div>
                        <div id="algoDesc">
                            Enjambre de particulas con memoria personal y global para converger al optimo.
                        </div>
                    </div>
                </aside>

                <section class="panel view-card comparison-view">
                    <div class="comparison-header">
                        <div>Modo comparacion</div>
                        <div class="tag">2D, 3D y convergencia por algoritmo</div>
                    </div>
                    <div class="comparison-grid" id="comparisonGrid"></div>
                </section>
            </div>
        </div>
    </body>
</html>
