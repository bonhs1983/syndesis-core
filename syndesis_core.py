
from flask import Flask, request, jsonify
from syndesis_math import (
    calculate_alignment_score,
    calculate_intent_deviation,
    calculate_emotional_shift,
    calculate_thread_correlation,
    calculate_field_tension
)

app = Flask(__name__)

def syndesis_score(msg):
    return {
        "alignment": calculate_alignment_score(msg),
        "intent_match": calculate_intent_deviation(msg),
        "emotional_shift": calculate_emotional_shift(msg),
        "thread_correlation": calculate_thread_correlation(msg),
        "field_tension": calculate_field_tension(0.8, 0.6, 2.0)
    }

@app.route('/process', methods=['POST'])
def process():
    if not request.is_json:
        return jsonify({"error": "Invalid content-type, must be application/json"}), 400

    try:
        data = request.get_json(force=True)
    except Exception as e:
        return jsonify({"error": f"JSON parsing error: {str(e)}"}), 400

    message = data.get("message", "")
    metrics = syndesis_score(message)

    return jsonify({
        "reply": f"Έλαβα το μήνυμα: {message}",
        "metrics": metrics
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
