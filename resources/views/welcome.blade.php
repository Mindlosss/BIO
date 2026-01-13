<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'BIO Lab') }}</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body data-page="bio-sim">
        <div class="page">
            <header>
                <div>
                    <div class="title">BIO Lab Simulator</div>
                    <div class="subtitle">
                        Simulador de algoritmos bioinspirados con vista 2D, vista 3D y grafica de convergencia.
                        Elige el algoritmo y la funcion objetivo, define el modo de convergencia y personaliza
                        los parametros para observar la busqueda en tiempo real.
                    </div>
                </div>
                <a class="pill" href="{{ route('comparison') }}">Modo comparacion</a>
            </header>

            <div class="layout">
                <aside class="panel controls">
                    <div class="control-group">
                        <label for="algo">Algoritmo</label>
                        <select id="algo">
                            <option value="pso">PSO (Particle Swarm)</option>
                            <option value="firefly">Firefly</option>
                            <option value="ga">Genetic Algorithm</option>
                            <option value="cuckoo">Cuckoo Search</option>
                            <option value="aco">ACO (Ant Colony)</option>
                        </select>
                    </div>
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

                    <div class="control-group">
                        <label>Parametros</label>
                        <div class="param" data-algo="pso">
                            <div class="param-row">
                                <span>Inercia w</span>
                                <span id="psoWValue">0.72</span>
                            </div>
                            <input id="psoW" type="range" min="0.3" max="0.95" step="0.01" value="0.72">
                            <div class="param-row">
                                <span>c1</span>
                                <span id="psoC1Value">1.5</span>
                            </div>
                            <input id="psoC1" type="range" min="0.5" max="3" step="0.05" value="1.5">
                            <div class="param-row">
                                <span>c2</span>
                                <span id="psoC2Value">1.7</span>
                            </div>
                            <input id="psoC2" type="range" min="0.5" max="3" step="0.05" value="1.7">
                        </div>
                        <div class="param" data-algo="firefly">
                            <div class="param-row">
                                <span>Beta0</span>
                                <span id="ffBetaValue">1.0</span>
                            </div>
                            <input id="ffBeta" type="range" min="0.2" max="2" step="0.05" value="1.0">
                            <div class="param-row">
                                <span>Gamma</span>
                                <span id="ffGammaValue">0.35</span>
                            </div>
                            <input id="ffGamma" type="range" min="0.05" max="1" step="0.05" value="0.35">
                            <div class="param-row">
                                <span>Alpha</span>
                                <span id="ffAlphaValue">0.25</span>
                            </div>
                            <input id="ffAlpha" type="range" min="0" max="0.8" step="0.05" value="0.25">
                        </div>
                        <div class="param" data-algo="ga">
                            <div class="param-row">
                                <span>Elite rate</span>
                                <span id="gaEliteValue">0.25</span>
                            </div>
                            <input id="gaElite" type="range" min="0.1" max="0.5" step="0.02" value="0.25">
                            <div class="param-row">
                                <span>Mutation</span>
                                <span id="gaMutValue">0.25</span>
                            </div>
                            <input id="gaMut" type="range" min="0" max="0.8" step="0.05" value="0.25">
                            <div class="param-row">
                                <span>Crossover</span>
                                <span id="gaCrossValue">0.6</span>
                            </div>
                            <input id="gaCross" type="range" min="0" max="1" step="0.05" value="0.6">
                        </div>
                        <div class="param" data-algo="cuckoo">
                            <div class="param-row">
                                <span>Pa</span>
                                <span id="ckPaValue">0.25</span>
                            </div>
                            <input id="ckPa" type="range" min="0.05" max="0.6" step="0.05" value="0.25">
                            <div class="param-row">
                                <span>Step</span>
                                <span id="ckStepValue">0.7</span>
                            </div>
                            <input id="ckStep" type="range" min="0.1" max="1.2" step="0.05" value="0.7">
                        </div>
                        <div class="param" data-algo="aco">
                            <div class="param-row">
                                <span>Evap rho</span>
                                <span id="acoRhoValue">0.35</span>
                            </div>
                            <input id="acoRho" type="range" min="0.05" max="0.8" step="0.05" value="0.35">
                            <div class="param-row">
                                <span>Alpha</span>
                                <span id="acoAlphaValue">1.0</span>
                            </div>
                            <input id="acoAlpha" type="range" min="0.2" max="2.5" step="0.1" value="1.0">
                            <div class="param-row">
                                <span>Beta</span>
                                <span id="acoBetaValue">2.0</span>
                            </div>
                            <input id="acoBeta" type="range" min="0.5" max="4" step="0.1" value="2.0">
                        </div>
                    </div>

                    <div class="buttons">
                        <button id="toggle">Start</button>
                        <button id="reset" class="secondary">Reset</button>
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

                <section class="views">
                    <div class="panel view-card">
                        <div class="view-header">
                            <div>Vista 2D (posiciones)</div>
                            <div class="tag" id="domainTag">Dominio: [-5, 5]</div>
                        </div>
                        <canvas id="canvas2d"></canvas>
                    </div>
                    <div class="panel view-card">
                        <div class="view-header">
                            <div>Vista 3D (superficie + agentes)</div>
                            <div class="tag">Proyeccion isometrica</div>
                        </div>
                        <canvas id="canvas3d"></canvas>
                    </div>
                    <div class="panel view-card chart">
                        <div class="view-header">
                            <div>Convergencia</div>
                            <div class="tag">Mejor fitness por iteracion</div>
                        </div>
                        <div class="chart-legend" id="chartLegend"></div>
                        <canvas id="canvasChart"></canvas>
                    </div>
                </section>
            </div>
        </div>
    </body>
</html>
