import os
import numpy as np
import pandas as pd
import joblib
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Pour permettre les requêtes cross-origin depuis votre frontend React

# Utiliser les modèles améliorés 
use_improved_models = True

# Vérification de l'existence des fichiers de modèles
required_files = [
    'model_columns.pkl',
    'regression_features.pkl',
    'regression_model.pkl',
    'regression_scaler.pkl'
]

# Ajouter le fichier du modèle KMeans
required_files.append('kmeans_model.pkl')
required_files.append('kmeans_scaler.pkl')
required_files.append('kmeans_features.pkl')

if use_improved_models:
    required_files.extend([
        'improved_classification_features.pkl',
        'improved_classification_model.pkl',
        'improved_classification_scaler.pkl'
    ])
else:
    required_files.extend([
        'classification_features.pkl',
        'classification_model.pkl',
        'classification_scaler.pkl'
    ])

models_ready = True

for file in required_files:
    if not os.path.exists(file):
        models_ready = False
        print(f"Fichier manquant: {file}")

# Chargement des modèles si tous les fichiers sont présents
# Variables globales pour les modèles
model_columns = None
regression_features = None
regression_model = None  
regression_scaler = None
classification_features = None
classification_model = None
classification_scaler = None
kmeans_model = None
kmeans_scaler = None
kmeans_features = None
kmeans_ready = False

if models_ready:
    try:
        # Chargement des colonnes et caractéristiques
        print("Chargement des modèles...")
        model_columns = joblib.load('model_columns.pkl')
        print("model_columns chargé")
        regression_features = joblib.load('regression_features.pkl')
        print("regression_features chargé")
        
        # Chargement du modèle KMeans
        try:
            kmeans_model = joblib.load('kmeans_model.pkl')
            print("kmeans_model chargé")
            kmeans_scaler = joblib.load('kmeans_scaler.pkl')
            print("kmeans_scaler chargé")
            kmeans_features = joblib.load('kmeans_features.pkl')
            print("kmeans_features chargé")
            print("Modèle KMeans chargé avec succès!")
            kmeans_ready = True
        except Exception as e:
            print(f"Erreur lors du chargement du modèle KMeans: {str(e)}")
            kmeans_ready = False
        
        if use_improved_models:
            classification_features = joblib.load('improved_classification_features.pkl')
            print("classification_features chargé")
            classification_model = joblib.load('improved_classification_model.pkl')
            print("classification_model chargé")
            classification_scaler = joblib.load('improved_classification_scaler.pkl')
            print("classification_scaler chargé")
            print("Modèles de classification améliorés chargés avec succès!")
        else:
            classification_features = joblib.load('classification_features.pkl')
            classification_model = joblib.load('classification_model.pkl')
            classification_scaler = joblib.load('classification_scaler.pkl')
        
        # Chargement des modèles et scalers de régression
        regression_model = joblib.load('regression_model.pkl')
        print("regression_model chargé")
        regression_scaler = joblib.load('regression_scaler.pkl')
        print("regression_scaler chargé")
        
        print("Tous les modèles ont été chargés avec succès!")
    except Exception as e:
        models_ready = False
        print(f"ERREUR lors du chargement des modèles: {str(e)}")
else:
    print("Certains fichiers de modèles sont manquants. Veuillez d'abord exécuter train_models.py")


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/health', methods=['GET'])
def health():
    if models_ready:
        return jsonify({"status": "ok", "message": "API is running and models are loaded"})
    else:
        return jsonify({"status": "error", "message": "Models are not loaded"})

@app.route('/features', methods=['GET'])
def get_features():
    """Renvoie les caractéristiques nécessaires pour les prédictions"""
    if not models_ready:
        return jsonify({"error": "Models not loaded"}), 503
    
    return jsonify({
        "regression_features": regression_features.tolist(),
        "classification_features": classification_features if isinstance(classification_features, list) else classification_features.tolist()
    })

@app.route('/predict/duration', methods=['POST'])
def predict_duration():
    """Endpoint pour prédire la durée de stationnement"""
    if not models_ready:
        return jsonify({"error": "Models not loaded"}), 503
    
    try:
        # Récupération des données envoyées par le client
        json_data = request.get_json()
        
        # Création d'un dataframe avec les caractéristiques requises
        input_data = {}
        for feature in regression_features:
            if feature in json_data:
                input_data[feature] = [json_data[feature]]
            else:
                return jsonify({"error": f"Missing feature: {feature}"}), 400
        
        input_df = pd.DataFrame(input_data)
        
        # Standardisation des données
        input_scaled = regression_scaler.transform(input_df)
        
        # Prédiction de la durée
        prediction = regression_model.predict(input_scaled)[0]
        
        # Arrondir la prédiction à 2 décimales
        prediction = round(float(prediction), 2)
        
        return jsonify({
            "prediction": prediction,
            "unit": "hours"
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict/occupancy', methods=['POST'])
def predict_occupancy():
    """Endpoint pour prédire l'occupation du parking"""
    if not models_ready:
        return jsonify({"error": "Models not loaded"}), 503
    
    try:
        # Récupération des données envoyées par le client
        json_data = request.get_json()
        
        # Création d'un dataframe avec les caractéristiques requises
        input_data = {}
        for feature in classification_features:
            if feature in json_data:
                input_data[feature] = [json_data[feature]]
            else:
                return jsonify({"error": f"Missing feature: {feature}"}), 400
        
        input_df = pd.DataFrame(input_data)
        
        # Standardisation des données
        input_scaled = classification_scaler.transform(input_df)
        
        # Prédiction de l'occupation et de la probabilité
        prediction = int(classification_model.predict(input_scaled)[0])
        probability = classification_model.predict_proba(input_scaled)[0]
        
        return jsonify({
            "prediction": prediction,
            "probability": {
                "not_occupied": round(float(probability[0]), 3),
                "occupied": round(float(probability[1]), 3) if len(probability) > 1 else 0
            },
            "label": "Occupied" if prediction == 1 else "Not Occupied"
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict/cluster', methods=['POST'])
def predict_cluster():
    """Endpoint pour prédire le cluster comportemental de l'utilisateur"""
    if not models_ready or not kmeans_ready:
        return jsonify({"error": "KMeans model not loaded"}), 503
    
    try:
        # Récupération des données envoyées par le client
        json_data = request.get_json()
        
        # Création d'un dataframe avec les caractéristiques requises pour KMeans
        input_data = {}
        for feature in kmeans_features:
            if feature in json_data:
                input_data[feature] = [json_data[feature]]
            else:
                return jsonify({"error": f"Missing feature for clustering: {feature}"}), 400
        
        input_df = pd.DataFrame(input_data)
        
        # Standardisation des données
        input_scaled = kmeans_scaler.transform(input_df)
        
        # Prédiction du cluster
        cluster = int(kmeans_model.predict(input_scaled)[0])
        
        # Calculer la distance aux centroïdes pour estimer la confiance
        distances = kmeans_model.transform(input_scaled)[0]
        closest_distance = np.min(distances)
        
        # Définir les caractéristiques des clusters
        cluster_profiles = [
            "Court séjour, petit budget",
            "Longue durée, prix élevé",
            "Habitués, stationnement fréquent",
            "Premium, proche des sorties"
        ]
        
        # Assurer que nous avons suffisamment de descriptions pour le nombre de clusters
        if cluster < len(cluster_profiles):
            cluster_profile = cluster_profiles[cluster]
        else:
            cluster_profile = f"Profil d'utilisateur {cluster}"
        
        return jsonify({
            "cluster": cluster,
            "profile": cluster_profile,
            "confidence": round(float(1.0 / (1.0 + closest_distance)), 3),
            "distances": [round(float(d), 3) for d in distances.tolist()]
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
