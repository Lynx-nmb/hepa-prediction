import pandas as pd
from joblib import load
from flask import Flask, request, jsonify
from flask_cors import CORS
from category_encoders import BinaryEncoder

# Load the model
model = load('decision_tree_model.joblib')

# Import the dataset
x = pd.read_csv("x.csv")

categorical_features = ['gender', 'steroid', 'fatigue', 'liverBig', 'liverFirm']
encoder = BinaryEncoder()
encoder.fit(x[categorical_features])

app = Flask(__name__)
CORS(app)

@app.route('/api/hfp_prediction', methods=['POST'])
def predict_heart_failure():
    try:
        # Get the data from the request
        data = request.json['inputs']
        input_df = pd.DataFrame(data)
        
        # Encode categorical features
        input_encoded = encoder.transform(input_df[categorical_features])
        input_df = input_df.drop(categorical_features, axis=1)
        
        # Combine features
        final_input = pd.concat([input_df, input_encoded], axis=1)

        # Get prediction probabilities and class prediction
        probabilities = model.predict_proba(final_input)
        prediction = model.predict(final_input)
        
        # Prepare response
        response = []
        for i, prob in enumerate(probabilities):
            response.append({
                "probabilities": {
                    "no_hepatitis": round(float(prob[0]) * 100, 2),
                    "hepatitis": round(float(prob[1]) * 100, 2)
                },
                "prediction": "yes" if prediction[i] == 2 else "no"
            })

        return jsonify({"results": response})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)