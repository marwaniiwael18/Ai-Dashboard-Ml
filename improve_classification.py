import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix

# Charger les données prétraitées
print("Chargement des données...")
df = pd.read_csv("cleaned_smart_parking_data.csv")

# Prétraitement des données
print("Prétraitement des données...")
# Conversion de occupancy en binaire
df['occupancy'] = df['occupancy'].map({'Yes': 1, 'No': 0}).astype(int)

# Encodage One-Hot pour les variables catégorielles
categorical_columns = ['User_Type', 'Weather_Precipitation', 'Nearby_Traffic_Level',
                      'Payment_Status', 'Occupancy_Status', 'Vehicle_Type',
                      'Spot_Size', 'Weather_Category', 'Vehicle_Size', 'Parking_Lot_Section']
                      
df_encoded = pd.get_dummies(df, columns=categorical_columns, drop_first=True)

# Analyse de la distribution des classes
print("\nDistribution des classes:")
print(df_encoded['occupancy'].value_counts())
print(f"Ratio de classes: {df_encoded['occupancy'].value_counts()[1] / df_encoded['occupancy'].value_counts()[0]:.4f}")

# Utiliser plus de caractéristiques pour la classification
print("\nEntraînement d'un modèle de classification amélioré...")

# Séparation des features et de la cible
X = df_encoded.drop('occupancy', axis=1)
y = df_encoded['occupancy']

# Sélection de caractéristiques plus pertinentes (utilisons plus de caractéristiques)
important_features = [
    'User_Parking_History', 
    'Payment_Amount', 
    'Proximity_To_Exit',
    'Parking_Duration',
    'Electric_Vehicle',
    'Reserved_Status',
    'Entry_Time_Minutes',
    'Exit_Time_Minutes',
    'Hour',
    'Weekday',
    'Is_Weekend'
]

# Filtrer les caractéristiques qui existent réellement dans le dataset
existing_features = [col for col in important_features if col in X.columns]
print(f"\nUtilisation de {len(existing_features)} caractéristiques pour la classification:")
print(", ".join(existing_features))

X_selected = X[existing_features]

# Standardisation
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_selected)

# Division des données
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.3, random_state=42, stratify=y)

# Entraînement d'un modèle SVM avec hyperparamètres optimisés
param_grid = {
    'C': [0.1, 1, 10, 100],
    'gamma': ['scale', 'auto', 0.01, 0.1, 1],
    'class_weight': [None, 'balanced']
}

print("\nOptimisation des hyperparamètres du modèle SVM...")
grid_search = GridSearchCV(
    SVC(kernel='rbf', probability=True, random_state=42),
    param_grid,
    scoring='f1',
    cv=5,
    verbose=1,
    n_jobs=-1
)

grid_search.fit(X_train, y_train)

print("\nMeilleurs paramètres trouvés:")
print(grid_search.best_params_)

# Utiliser le meilleur modèle SVM
svm_model = grid_search.best_estimator_

# Évaluation sur l'ensemble de test
y_pred = svm_model.predict(X_test)
print("\nÉvaluation du modèle SVM:")
print(confusion_matrix(y_test, y_pred))
print(classification_report(y_test, y_pred))

# Essayer également un modèle RandomForest
print("\nEntraînement d'un modèle RandomForest...")
rf_model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=5,
    min_samples_leaf=2,
    class_weight='balanced',
    random_state=42
)
rf_model.fit(X_train, y_train)

# Évaluation du RandomForest
rf_pred = rf_model.predict(X_test)
print("Évaluation du modèle RandomForest:")
print(confusion_matrix(y_test, rf_pred))
print(classification_report(y_test, rf_pred))

# Comparer les deux modèles et choisir le meilleur
svm_f1 = classification_report(y_test, y_pred, output_dict=True)['1']['f1-score']
rf_f1 = classification_report(y_test, rf_pred, output_dict=True)['1']['f1-score']

if rf_f1 > svm_f1:
    print("\nLe modèle RandomForest est meilleur. Utilisation de RandomForest.")
    best_model = rf_model
    model_name = "RandomForest"
else:
    print("\nLe modèle SVM est meilleur. Utilisation de SVM.")
    best_model = svm_model
    model_name = "SVM"

# Sauvegarde du meilleur modèle et des caractéristiques
print("\nSauvegarde du modèle et des caractéristiques...")
joblib.dump(existing_features, 'improved_classification_features.pkl')
joblib.dump(best_model, 'improved_classification_model.pkl')
joblib.dump(scaler, 'improved_classification_scaler.pkl')

print(f"\nModèle amélioré ({model_name}) sauvegardé avec succès!")
print(f"Nombre de caractéristiques utilisées: {len(existing_features)}")
print("Caractéristiques utilisées:", ", ".join(existing_features))

# Test du modèle avec quelques exemples
print("\nTest du modèle avec quelques exemples:")

# Générer quelques exemples variés
examples = []
# Valeurs faibles
examples.append({feat: 1.0 for feat in existing_features})
# Valeurs moyennes
examples.append({feat: 5.0 for feat in existing_features})
# Valeurs élevées
examples.append({feat: 10.0 for feat in existing_features})

for i, example in enumerate(examples):
    example_df = pd.DataFrame([example])
    example_scaled = scaler.transform(example_df)
    prediction = best_model.predict(example_scaled)[0]
    probability = best_model.predict_proba(example_scaled)[0]
    
    print(f"Exemple {i+1}:")
    print(f"  Prédiction: {'Occupé' if prediction == 1 else 'Non occupé'}")
    print(f"  Probabilité d'occupation: {probability[1]:.2%}")
    print(f"  Probabilité de non-occupation: {probability[0]:.2%}")
    print()
