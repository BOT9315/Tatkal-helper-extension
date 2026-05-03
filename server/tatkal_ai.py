"""
tatkal_ai.py — Tatkal booking success probability predictor
Run: python tatkal_ai.py
Port: 5000
"""
from flask import Flask, request, jsonify
from flask_cors import CORS  # FIX: was missing; Node server needs CORS

app = Flask(__name__)
CORS(app)  # Allow requests from localhost:3000 (Node server)

# ── Prediction logic ──────────────────────────────────────────────────────────

WEEKEND_DAYS = {"Friday", "Saturday", "Sunday"}

def predict_tatkal(seats: int, day: str, train_popularity: int) -> tuple[int, str]:
    """
    Simple heuristic model for Tatkal booking success probability.

    seats            : available seats in the quota (higher = easier)
    day              : day of travel (weekend = harder)
    train_popularity : 1–10 scale (higher = more competition)

    Returns (score 0–100, label)
    """
    score = 50  # baseline

    # More seats = higher chance of success
    score += min(seats, 20) * 1.5

    # Popular trains = more competition
    score -= train_popularity * 4

    # Weekends are harder to book
    if day in WEEKEND_DAYS:
        score -= 15

    # Clamp to [0, 100]
    score = max(0, min(100, int(score)))

    if score >= 70:
        label = "High Success"
    elif score >= 40:
        label = "Medium Success"
    else:
        label = "Low Success"
    return score, label


# ── Routes ────────────────────────────────────────────────────────────────────
@app.route("/predictTatkal", methods=["GET"])
def predict():
    try:
        seats      = int(request.args.get("seats", 10))
        day        = request.args.get("day", "Monday")
        popularity = int(request.args.get("popularity", 5))
    except ValueError:
        return jsonify({"error": "seats and popularity must be integers."}), 400

    if not (0 <= seats <= 200):
        return jsonify({"error": "seats must be between 0 and 200."}), 400

    if not (1 <= popularity <= 10):
        return jsonify({"error": "popularity must be between 1 and 10."}), 400

    probability, label = predict_tatkal(seats, day, popularity)

    return jsonify({
        "tatkal_probability": probability,
        "prediction": label,
        "inputs": {"seats": seats, "day": day, "train_popularity": popularity},
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    app.run(port=5000, debug=False)
