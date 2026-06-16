from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import joblib
import os

app = Flask(__name__)

# --------------------
# Load Model
# --------------------
model_dir = 'model_components'

full_pipeline = joblib.load(os.path.join(model_dir, 'full_classification_pipeline.pkl'))
label_encoder = joblib.load(os.path.join(model_dir, 'label_encoder.pkl'))

# --------------------
# Prediction Function
# --------------------
def predict_report(report_data: dict):
    df_input = pd.DataFrame([report_data])

    df_input['text_features'] = (
        df_input.get('report_headline', '') + ' ' +
        df_input.get('report_detail', '')
    )

    feature_cols = ['issue_type', 'governorate', 'city', 'report_category', 'text_features']
    df_input = df_input[feature_cols]

    probs = full_pipeline.predict_proba(df_input)[0]
    class_names = label_encoder.classes_

    prob_list = [
        {
            "label": class_names[i],
            "score": round(float(probs[i]), 4)
        }
        for i in range(len(class_names))
    ]

    prob_list = sorted(prob_list, key=lambda x: x["score"], reverse=True)

    return {
        "prediction": prob_list[0]["label"],
        "confidence": prob_list[0]["score"],
        "probabilities": prob_list
    }

# --------------------
# API Endpoint
# --------------------
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    result = predict_report(data)
    return jsonify(result)

# --------------------
# Run Server
# --------------------
if __name__ == "__main__":
    app.run(port=5000)