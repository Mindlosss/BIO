import json
import random
from http.server import BaseHTTPRequestHandler, HTTPServer


def relu(x):
    return x if x > 0 else 0


def relu_grad(x):
    return 1 if x > 0 else 0


def dot(a, b):
    return sum(value * b[index] for index, value in enumerate(a))


def mat_vec(matrix, vector):
    return [dot(row, vector) for row in matrix]


def add_vec(a, b):
    return [value + b[index] for index, value in enumerate(a)]


def sub_vec(a, b):
    return [value - b[index] for index, value in enumerate(a)]


def scale_vec(values, scalar):
    return [value * scalar for value in values]


def one_hot(value, values):
    return [1 if value == item else 0 for item in values]


def build_features(item, config):
    objective_vec = one_hot(item.get("objective"), config["objectives"])
    convergence_value = config["convergence_map"].get(item.get("convergence"), 0.5)
    params = item.get("parameters") or {}
    param_vec = [params.get(key, 0) for key in config["param_keys"]]

    return [
        item.get("bounds", 0),
        item.get("population", 0),
        item.get("iterations", 0),
        convergence_value,
        *param_vec,
        *objective_vec,
    ]


def normalize_dataset(dataset):
    dims = len(dataset[0]["features"])
    mins = [float("inf")] * dims
    maxs = [float("-inf")] * dims

    for row in dataset:
        for index, value in enumerate(row["features"]):
            mins[index] = min(mins[index], value)
            maxs[index] = max(maxs[index], value)

    def normalize(features):
        normalized = []
        for index, value in enumerate(features):
            min_val = mins[index]
            max_val = maxs[index]
            if max_val == min_val:
                normalized.append(0)
            else:
                normalized.append((value - min_val) / (max_val - min_val))
        return normalized

    return normalize


def init_matrix(rows, cols):
    return [[(random.random() - 0.5) * 0.3 for _ in range(cols)] for _ in range(rows)]


def train_network(samples, input_size, hidden_size, epochs, lr):
    w1 = init_matrix(hidden_size, input_size)
    b1 = [0 for _ in range(hidden_size)]
    w2 = [(random.random() - 0.5) * 0.3 for _ in range(hidden_size)]
    b2 = 0.0

    for _ in range(epochs):
        for sample in samples:
            x = sample["x"]
            y = sample["y"]

            z1 = add_vec(mat_vec(w1, x), b1)
            a1 = [relu(value) for value in z1]
            y_hat = dot(w2, a1) + b2
            error = y_hat - y
            d_y = 2 * error

            d_w2 = [d_y * value for value in a1]
            d_b2 = d_y

            d_a1 = [weight * d_y for weight in w2]
            d_z1 = [d_a1[index] * relu_grad(z1[index]) for index in range(len(z1))]

            d_w1 = [
                [d_z1[row_index] * x[col_index] for col_index in range(len(x))]
                for row_index in range(len(w1))
            ]
            d_b1 = d_z1

            w2 = sub_vec(w2, scale_vec(d_w2, lr))
            b2 -= lr * d_b2
            w1 = [
                sub_vec(row, scale_vec(d_w1[row_index], lr))
                for row_index, row in enumerate(w1)
            ]
            b1 = sub_vec(b1, scale_vec(d_b1, lr))

    def predict(values):
        z1 = add_vec(mat_vec(w1, values), b1)
        a1 = [relu(value) for value in z1]
        return dot(w2, a1) + b2

    return predict


def suggest(predict, normalize, current, config):
    candidates = []
    param_ranges = config["param_ranges"]
    current_params = current.get("parameters") or {}

    param_values = []
    for key in config["param_keys"]:
        base = current_params.get(key)
        if not isinstance(base, (int, float)):
            return None
        min_val, max_val = param_ranges[key]
        options = []
        for factor in (0.8, 1, 1.2):
            value = base * factor
            if value < min_val:
                value = min_val
            if value > max_val:
                value = max_val
            options.append(round(value, 3))
        param_values.append(sorted(set(options)))

    def build_candidates(index, acc):
        if index >= len(config["param_keys"]):
            candidates.append(acc)
            return
        key = config["param_keys"][index]
        for value in param_values[index]:
            build_candidates(index + 1, {**acc, key: value})

    build_candidates(0, {})

    for params in candidates:
        features = build_features(
            {**current, "parameters": params},
            config,
        )
        normalized = normalize(features)
        score = predict(normalized)
        params["score"] = score

    candidates.sort(key=lambda item: item["score"])
    return candidates[0] if candidates else None


class NeuralServiceHandler(BaseHTTPRequestHandler):
    def _send_json(self, status_code, payload):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        try:
            body = json.dumps(payload).encode("utf-8")
        except Exception as error:
            body = json.dumps(
                {
                    "status": "error",
                    "message": "Error serializando la respuesta.",
                    "log": [f"[server] exception: {error}"],
                }
            ).encode("utf-8")
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/health":
            self._send_json(
                200,
                {
                    "status": "ok",
                    "message": "Servicio activo.",
                },
            )
            return

        if self.path != "/health":
            self._send_json(404, {"status": "error", "message": "Endpoint no encontrado."})
            return

    def do_POST(self):
        try:
            if self.path != "/train-suggest":
                self._send_json(404, {"status": "error", "message": "Endpoint no encontrado."})
                return

            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length or 0)

            try:
                payload = json.loads(body.decode("utf-8") or "{}")
            except json.JSONDecodeError:
                self._send_json(400, {"status": "error", "message": "JSON invalido."})
                return

            try:
                result = run_training(payload)
                self._send_json(200, result)
            except Exception as error:
                self._send_json(
                    500,
                    {
                        "status": "error",
                        "message": "Error interno en el servicio de red neuronal.",
                        "log": [f"[server] exception: {error}"],
                    },
                )
        except Exception as error:
            self._send_json(
                500,
                {
                    "status": "error",
                    "message": "Error inesperado en el servicio de red neuronal.",
                    "log": [f"[server] exception: {error}"],
                },
            )


def run():
    server = HTTPServer(("127.0.0.1", 8001), NeuralServiceHandler)
    print("Neural service running on http://127.0.0.1:8001")
    server.serve_forever()


def run_training(payload):
    history = payload.get("history") or []
    current = payload.get("current") or {}
    log = []

    random.seed(1337)

    algo = current.get("algo")
    algo_config = {
        "pso": {
            "param_keys": ["w", "c1", "c2"],
            "param_ranges": {
                "w": (0.3, 0.95),
                "c1": (0.5, 3.0),
                "c2": (0.5, 3.0),
            },
        },
        "firefly": {
            "param_keys": ["beta", "gamma", "alpha"],
            "param_ranges": {
                "beta": (0.2, 2.0),
                "gamma": (0.05, 1.0),
                "alpha": (0.0, 0.8),
            },
        },
        "ga": {
            "param_keys": ["elite", "mutation", "crossover"],
            "param_ranges": {
                "elite": (0.1, 0.5),
                "mutation": (0.0, 0.8),
                "crossover": (0.0, 1.0),
            },
        },
        "cuckoo": {
            "param_keys": ["pa", "step"],
            "param_ranges": {
                "pa": (0.05, 0.6),
                "step": (0.1, 1.2),
            },
        },
        "aco": {
            "param_keys": ["rho", "alpha", "beta"],
            "param_ranges": {
                "rho": (0.05, 0.8),
                "alpha": (0.2, 2.5),
                "beta": (0.5, 4.0),
            },
        },
    }

    if not algo or algo not in algo_config:
        return {"status": "error", "message": "Algoritmo no soportado.", "log": ["[server] falta algoritmo."]}

    param_keys = algo_config[algo]["param_keys"]
    param_ranges = algo_config[algo]["param_ranges"]
    log.append(f"[server] algoritmo: {algo}")

    current_objective = current.get("objective")
    if not current_objective:
        return {
            "status": "error",
            "message": "Funcion objetivo no valida.",
            "log": ["[server] falta funcion objetivo."],
        }
    log.append(f"[server] funcion objetivo: {current_objective}")
    config = {
        "objectives": [current_objective],
        "convergence_map": {
            "exploracion": 0.8,
            "equilibrado": 0.5,
            "optimo": 0.2,
        },
        "param_keys": param_keys,
        "param_ranges": param_ranges,
    }

    dataset = []
    for item in history:
        if item.get("algo") != algo or item.get("objective") != current_objective:
            continue
        params = item.get("parameters") or {}
        if not all(isinstance(params.get(key), (int, float)) for key in param_keys):
            continue
        best_f = (
            item.get("metrics", {})
            .get("best", {})
            .get("f")
        )
        if isinstance(best_f, (int, float)):
            dataset.append(
                {
                    "features": build_features(item, config),
                    "target": float(best_f),
                }
            )

    if len(dataset) < 8:
        log.append(f"[server] muestras validas: {len(dataset)} (minimo 8)")
        return {
            "status": "error",
            "message": "Necesitas al menos 8 simulaciones con este algoritmo y funcion objetivo.",
            "log": log,
        }

    normalize = normalize_dataset(dataset)
    samples = [{"x": normalize(item["features"]), "y": item["target"]} for item in dataset]
    input_size = len(samples[0]["x"])
    log.append(f"[server] muestras validas: {len(samples)}")
    log.append(f"[server] dimensiones de entrada: {input_size}")
    log.append("[server] entrenando red (1 capa oculta, 6 neuronas, 220 epocas)")

    predict = train_network(samples, input_size, 6, 220, 0.05)

    candidate = suggest(predict, normalize, current, config)

    if not candidate:
        return {"status": "error", "message": "No se pudo generar sugerencia.", "log": log}

    return {
        "status": "ok",
        "data": {
            "message": "Red neuronal entrenada con tu historial.",
            "suggestion": {
                "algo": algo,
                "parameters": {key: float(candidate[key]) for key in param_keys},
            },
        },
        "log": [
            *log,
            "[server] sugerencia generada.",
        ],
    }


if __name__ == "__main__":
    run()
