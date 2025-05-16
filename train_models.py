import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.feature_selection import SelectKBest, f_regression, mutual_info_classif, RFE

# Charger et prétraiter les données
def preprocess_data(file_path):
    df = pd.read_csv(file_path)
    
    # Traitement des colonnes temporelles
    df['Timestamp'] = pd.to_datetime(df['Timestamp'])
    df['Entry_Time'] = pd.to_datetime(df['Entry_Time'], format='%H:%M:%S').dt.time
    df['Exit_Time'] = pd.to_datetime(df['Exit_Time'], format='%H:%M:%S').dt.time
    
    # Extraction des caractéristiques temporelles
    df['Year'] = df['Timestamp'].dt.year
    df['Month'] = df['Timestamp'].dt.month
    df['Day'] = df['Timestamp'].dt.day
    df['Hour'] = df['Timestamp'].dt.hour
    df['Minute'] = df['Timestamp'].dt.minute
    df['Second'] = df['Timestamp'].dt.second
    
    # Création de caractéristiques plus significatives
    df['Weekday'] = df['Timestamp'].dt.dayofweek  # 0-6 où 0 est lundi
    df['Is_Weekend'] = df['Weekday'].apply(lambda x: 1 if x >= 5 else 0)
    df['Time_of_Day'] = df['Hour'].apply(lambda x:
                                        'Morning' if 5 <= x < 12 else
                                        'Afternoon' if 12 <= x < 17 else
                                        'Evening' if 17 <= x < 21 else
                                        'Night')
    
    # Encodage One-Hot pour les variables catégorielles
    categorical_columns = ['User_Type', 'Weather_Precipitation', 'Nearby_Traffic_Level',
                          'Payment_Status', 'Occupancy_Status', 'Vehicle_Type',
                          'Spot_Size', 'Weather_Category', 'Vehicle_Size', 'Parking_Lot_Section',
                          'Time_of_Day']
    df_encoded = pd.get_dummies(df, columns=categorical_columns, drop_first=True)
    
    # Conversion des temps en minutes
    df_encoded['Entry_Time_Minutes'] = pd.to_datetime(df['Entry_Time'], format='%H:%M:%S').dt.hour * 60 + pd.to_datetime(df['Entry_Time'], format='%H:%M:%S').dt.minute
    df_encoded['Exit_Time_Minutes'] = pd.to_datetime(df['Exit_Time'], format='%H:%M:%S').dt.hour * 60 + pd.to_datetime(df['Exit_Time'], format='%H:%M:%S').dt.minute
    
    # Conversion de occupancy en binaire (pour la classification)
    if 'occupancy' in df_encoded.columns:
        df_encoded['occupancy'] = df_encoded['occupancy'].map({'Yes': 1, 'No': 0}).astype(int)
    
    # Suppression des colonnes temporelles qui ne sont plus nécessaires
    df_encoded = df_encoded.drop(['Timestamp', 'Entry_Time', 'Exit_Time'], axis=1)
    
    return df_encoded

# Fonction de sélection des caractéristiques les plus pertinentes
def select_features(X, y, k=4, task_type='regression'):
    print(f"\nSélection des {k} meilleures caractéristiques pour la tâche de {task_type}...")
    
    if task_type == 'regression':
        # Méthode 1: SelectKBest avec f_regression
        selector1 = SelectKBest(score_func=f_regression, k=k)
        selector1.fit(X, y)
        scores1 = selector1.scores_
        
        # Méthode 2: Recursive Feature Elimination avec un modèle de base
        base_model = RandomForestRegressor(n_estimators=100, random_state=42)
        selector2 = RFE(estimator=base_model, n_features_to_select=k, step=1)
        selector2.fit(X, y)
        
        # Méthode 3: Importance des caractéristiques avec Random Forest
        rf = RandomForestRegressor(n_estimators=100, random_state=42)
        rf.fit(X, y)
        scores3 = rf.feature_importances_
        
    else:  # classification
        # Méthode 1: SelectKBest avec mutual_info_classif
        selector1 = SelectKBest(score_func=mutual_info_classif, k=k)
        selector1.fit(X, y)
        scores1 = selector1.scores_
        
        # Méthode 2: Recursive Feature Elimination avec un modèle de base
        base_model = RandomForestClassifier(n_estimators=100, random_state=42)
        selector2 = RFE(estimator=base_model, n_features_to_select=k, step=1)
        selector2.fit(X, y)
        
        # Méthode 3: Importance des caractéristiques avec Random Forest
        rf = RandomForestClassifier(n_estimators=100, random_state=42)
        rf.fit(X, y)
        scores3 = rf.feature_importances_
    
    # Récupérer l'indice des caractéristiques sélectionnées par chaque méthode
    features_to_keep = set()
    
    # À partir de SelectKBest
    top_indices1 = np.argsort(scores1)[-k:]
    features_to_keep.update(top_indices1)
    
    # À partir de RFE
    top_indices2 = np.where(selector2.support_)[0]
    features_to_keep.update(top_indices2)
    
    # À partir de RandomForest
    top_indices3 = np.argsort(scores3)[-k:]
    features_to_keep.update(top_indices3)
    
    # Sélection finale: prendre les k caractéristiques les plus importantes parmi toutes les méthodes
    feature_indices = list(features_to_keep)
    if len(feature_indices) > k:
        # Si plus de k caractéristiques sélectionnées, prendre les k plus importantes selon RF
        combined_scores = scores3[feature_indices]
        feature_indices = [feature_indices[i] for i in np.argsort(combined_scores)[-k:]]
    
    # Afficher les caractéristiques sélectionnées et leur importance
    feature_names = X.columns[feature_indices]
    feature_importance = scores3[feature_indices]
    
    print("\nCaractéristiques sélectionnées pour la tâche de", task_type)
    for name, importance in zip(feature_names, feature_importance):
        print(f"- {name}: {importance:.4f}")
    
    # Retourner les indices des caractéristiques à conserver et les noms correspondants
    return feature_indices, feature_names

def train_and_save_models(data_path):
    """Entraîne et sauvegarde les modèles pour la régression et la classification"""
    # Prétraitement des données
    print("Chargement et prétraitement des données...")
    df_encoded = preprocess_data(data_path)
    
    # Sauvegarde des colonnes pour un usage ultérieur dans l'API
    all_columns = list(df_encoded.columns)
    joblib.dump(all_columns, 'model_columns.pkl')
    
    # ==========================================================
    # PARTIE 1: TÂCHE DE RÉGRESSION (prédiction de la durée)
    # ==========================================================
    print("\nEntraînement du modèle de régression...")
    
    # Séparation des features et de la cible
    X = df_encoded.drop('Parking_Duration', axis=1)
    if 'occupancy' in X.columns:
        X = X.drop('occupancy', axis=1)  # Éviter d'utiliser la cible de classification
    y = df_encoded['Parking_Duration']
    
    # Sélection des caractéristiques pertinentes
    feature_indices, feature_names = select_features(X, y, k=4, task_type='regression')
    X_selected = X.iloc[:, feature_indices]
    
    # Sauvegarde des noms de caractéristiques pour la régression
    joblib.dump(feature_names, 'regression_features.pkl')
    
    # Division des données
    X_train, X_test, y_train, y_test = train_test_split(X_selected, y, test_size=0.2, random_state=42)
    
    # Standardisation des données
    scaler_reg = StandardScaler()
    X_train_scaled = scaler_reg.fit_transform(X_train)
    
    # Entraînement du modèle (Linear Regression a montré les meilleurs résultats)
    regression_model = LinearRegression()
    regression_model.fit(X_train_scaled, y_train)
    
    # Sauvegarde du modèle et du scaler
    joblib.dump(regression_model, 'regression_model.pkl')
    joblib.dump(scaler_reg, 'regression_scaler.pkl')
    
    # ==========================================================
    # PARTIE 2: TÂCHE DE CLASSIFICATION (prédiction d'occupation)
    # ==========================================================
    print("\nEntraînement du modèle de classification...")
    
    # Séparation des features et de la cible
    X = df_encoded.drop('occupancy', axis=1)
    y = df_encoded['occupancy']
    
    # Sélection des caractéristiques pertinentes
    feature_indices, feature_names = select_features(X, y, k=3, task_type='classification')
    X_selected = X.iloc[:, feature_indices]
    
    # Sauvegarde des noms de caractéristiques pour la classification
    joblib.dump(feature_names, 'classification_features.pkl')
    
    # Standardisation
    scaler_class = StandardScaler()
    X_scaled = scaler_class.fit_transform(X_selected)
    
    # Division des données
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    
    # Entraînement du modèle (SVM a montré les meilleurs résultats)
    classification_model = SVC(kernel='rbf', C=1, gamma='scale', probability=True)
    classification_model.fit(X_train, y_train)
    
    # Sauvegarde du modèle et du scaler
    joblib.dump(classification_model, 'classification_model.pkl')
    joblib.dump(scaler_class, 'classification_scaler.pkl')
    
    print("\nModèles entraînés et sauvegardés avec succès!")
    print("Fichiers créés:")
    print("- model_columns.pkl: Toutes les colonnes du dataframe")
    print("- regression_features.pkl: Caractéristiques utilisées pour la régression")
    print("- regression_model.pkl: Modèle de régression (Linear Regression)")
    print("- regression_scaler.pkl: Standardisation pour la régression")
    print("- classification_features.pkl: Caractéristiques utilisées pour la classification")
    print("- classification_model.pkl: Modèle de classification (SVM)")
    print("- classification_scaler.pkl: Standardisation pour la classification")

if __name__ == "__main__":
    # Chemin vers le fichier CSV traité
    data_path = "cleaned_smart_parking_data.csv"
    
    # Entraîner et sauvegarder les modèles
    train_and_save_models(data_path)
