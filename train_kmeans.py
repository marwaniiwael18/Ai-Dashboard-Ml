import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# Charger les données
print("Chargement des données...")
df = pd.read_csv('./cleaned_smart_parking_data.csv')

# Sélectionner les caractéristiques pour le clustering
kmeans_features = ['Parking_Duration', 'Payment_Amount', 'User_Parking_History', 'Proximity_To_Exit']

# Vérifier les valeurs manquantes
print(f"Valeurs manquantes: {df[kmeans_features].isnull().sum().sum()}")

# Préparer les données
X = df[kmeans_features].copy()

# Standardiser les caractéristiques
print("Standardisation des données...")
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Déterminer le nombre optimal de clusters
print("Détermination du nombre optimal de clusters...")
silhouette_scores = []
inertia = []
k_range = range(2, 10)

for k in k_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = kmeans.fit_predict(X_scaled)
    silhouette_scores.append(silhouette_score(X_scaled, labels))
    inertia.append(kmeans.inertia_)

# Choisir le nombre optimal de clusters (ici on choisit arbitrairement 4)
optimal_k = 4
print(f"Nombre optimal de clusters: {optimal_k}")

# Entraîner le modèle final
print(f"Entraînement du modèle KMeans avec {optimal_k} clusters...")
final_kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
final_kmeans.fit(X_scaled)

# Analyser les clusters
cluster_centers = scaler.inverse_transform(final_kmeans.cluster_centers_)
centers_df = pd.DataFrame(cluster_centers, columns=kmeans_features)
centers_df.index.name = 'Cluster'

print("Centres des clusters (échelle originale):")
print(centers_df)

# Évaluer les tailles des clusters
cluster_counts = np.bincount(final_kmeans.labels_)
print("Tailles des clusters:")
for i, count in enumerate(cluster_counts):
    print(f"Cluster {i}: {count} utilisateurs")

# Sauvegarder le modèle et le scaler
print("Sauvegarde du modèle KMeans...")
joblib.dump(final_kmeans, 'kmeans_model.pkl')
joblib.dump(scaler, 'kmeans_scaler.pkl')
joblib.dump(kmeans_features, 'kmeans_features.pkl')

print("Terminé! Le modèle KMeans a été entraîné et sauvegardé avec succès.")
