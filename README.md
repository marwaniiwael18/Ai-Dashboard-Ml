# Smart Parking Prediction

Système de prédiction intelligent pour la durée de stationnement et l'occupation des places de parking.

## Description

Ce projet intègre des modèles d'apprentissage automatique pour fournir deux types de prédictions :
1. **Prédiction de durée** : Combien de temps un véhicule restera stationné (tâche de régression)
2. **Prédiction d'occupation** : Si une place de parking sera occupée ou non (tâche de classification)

L'application est composée de deux parties principales :
- Une API backend Flask qui expose les modèles entraînés
- Une interface frontend React moderne et réactive

## Structure du projet

```
smart_parking/
├── improved_app.py         # API Flask améliorée avec clustering
├── train_models.py         # Script pour entraîner et sauvegarder les modèles de base
├── improve_classification.py # Script pour améliorer le modèle de classification
├── train_kmeans.py         # Script pour entraîner le modèle de clustering
├── templates/              # Templates HTML pour Flask
│   └── index.html
├── frontend/               # Application React
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── ...
│   └── package.json
├── *.pkl                   # Modèles entraînés (créés par train_models.py)
└── cleaned_smart_parking_data.csv   # Données d'entraînement
```

## Démarrage

### Prérequis

- Python 3.8+ avec pip
- Node.js 14+ avec npm

### Installation et configuration du backend (Flask)

1. Créez et activez un environnement virtuel Python (recommandé) :
   ```
   python -m venv venv
   venv\Scripts\activate
   ```

2. Installez les dépendances Python :
   ```
   pip install flask flask-cors pandas scikit-learn numpy joblib xgboost
   ```

3. Entraînez les modèles :
   ```
   python train_models.py
   ```
   Cette étape créera plusieurs fichiers `.pkl` avec les modèles entraînés.

4. Lancez l'API Flask :
   ```
   python improved_app.py
   ```
   L'API sera disponible à l'adresse http://localhost:5000

### Installation et configuration du frontend (React)

1. Accédez au dossier frontend :
   ```
   cd frontend
   ```

2. Installez les dépendances :
   ```
   npm install
   ```

3. Lancez l'application React :
   ```
   npm start
   ```
   L'interface sera disponible à l'adresse http://localhost:3000

## Utilisation de l'API

### Endpoints disponibles

- `GET /health` - Vérifier l'état de l'API
- `GET /features` - Obtenir les caractéristiques nécessaires pour les prédictions
- `POST /predict/duration` - Prédire la durée de stationnement
- `POST /predict/occupancy` - Prédire l'occupation d'une place de parking
- `POST /predict/cluster` - Prédire le cluster comportemental de l'utilisateur

### Exemple de requête pour la prédiction de durée

```json
POST /predict/duration
{
    "Day": 15,
    "Proximity_To_Exit": 8.5,
    "Payment_Amount": 12.0,
    "User_Parking_History": 25
}
```

### Exemple de requête pour la prédiction d'occupation

```json
POST /predict/occupancy
{
    "Proximity_To_Exit": 8.5,
    "Payment_Amount": 12.0,
    "User_Parking_History": 25
}
```

## Technologies utilisées

### Backend
- Flask - Framework web Python
- Scikit-learn - Bibliothèque d'apprentissage automatique
- Pandas - Manipulation et analyse de données
- XGBoost - Algorithme de gradient boosting

### Frontend
- React - Bibliothèque JavaScript pour construire l'interface utilisateur
- Material-UI - Composants React pour un design moderne
- Axios - Client HTTP pour les requêtes API
- Chart.js - Bibliothèque de visualisation

## Auteur

Aymen Jallouli

## Licence

Ce projet est sous licence MIT.
