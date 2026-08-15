from flask import Flask, request, jsonify, send_from_directory
import joblib
import pandas as pd
import os


app = Flask(
    __name__,
    static_folder="../frontend",
    static_url_path=""
)


# Get project directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(
    BASE_DIR,
    "../model/churn_model.pkl"
)


# Load trained model
model_data = joblib.load(MODEL_PATH)

model = model_data["model"]
threshold = model_data["threshold"]

print("Churn model loaded successfully.")
print("Prediction threshold:", threshold)


# Serve frontend
@app.route("/")
def home():
    return send_from_directory(
        app.static_folder,
        "index.html"
    )


# Prediction API
@app.route("/predict", methods=["POST"])
def predict():

    try:
        # Get customer data
        data = request.get_json()

        # Convert input to DataFrame
        input_data = pd.DataFrame([data])

        # Get churn probability
        probability = model.predict_proba(
            input_data
        )[0][1]

        # Apply saved model threshold
        prediction = int(
            probability >= threshold
        )

        # Determine risk level
        if probability >= 0.70:
            risk = "High"

        elif probability >= 0.40:
            risk = "Medium"

        else:
            risk = "Low"

        # Send prediction result
        return jsonify({
            "churn_prediction":
                "Yes" if prediction == 1 else "No",

            "churn_probability":
                round(probability * 100, 2),

            "risk_level":
                risk
        })

    except Exception as e:

        print("Prediction error:", e)

        return jsonify({
            "error": str(e)
        }), 400


# Run Flask application
if __name__ == "__main__":
    app.run(debug=True)