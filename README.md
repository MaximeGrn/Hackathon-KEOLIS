# 🚊 POC - Visualisation des positions des tramways de Dijon

Application simple pour visualiser en temps réel les positions des tramways de Dijon à partir du flux GTFS-RT officiel.

## 📋 Prérequis

- Python 3.8 ou supérieur
- pip (gestionnaire de paquets Python)

## 🚀 Installation et lancement

### 1. Créer un environnement virtuel (recommandé)

```bash
python3 -m venv venv
source venv/bin/activate  # Sur macOS/Linux
# ou
venv\Scripts\activate  # Sur Windows
```

### 2. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 3. Lancer l'application

```bash
python app.py
```

Ou avec Flask directement :

```bash
flask run
```

### 4. Accéder à l'application

Ouvrez votre navigateur et allez à :

```
http://127.0.0.1:5000
```

## 🎯 Utilisation

1. La carte Leaflet s'affiche centrée sur Dijon
2. Cliquez sur le bouton **"Mettre à jour les positions des trams"**
3. Les positions des tramways apparaissent sur la carte sous forme de marqueurs bleus
4. Cliquez sur un marqueur pour voir les détails du véhicule (ligne, vitesse, direction, etc.)

## 📁 Structure du projet

```
.
├── app.py                 # Backend Flask
├── requirements.txt       # Dépendances Python
├── README.md             # Ce fichier
├── templates/
│   └── index.html        # Page HTML principale
└── static/
    ├── css/
    │   └── style.css     # Styles CSS
    └── js/
        └── main.js       # Logique JavaScript frontend
```

## 🔧 Technologies utilisées

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **Carte**: Leaflet.js
- **Données**: GTFS-RT (Google Transit Feed Specification - Real-time)
- **Bibliothèque GTFS-RT**: `gtfs-realtime-bindings` (Google)

## 📡 Source de données

Les données proviennent du flux GTFS-RT officiel de Divia Dijon via data.gouv.fr :

```
https://proxy.transport.data.gouv.fr/resource/divia-dijon-gtfs-rt-vehicle-position
```

## 🐛 Dépannage

- **Erreur de connexion**: Vérifiez votre connexion Internet et que l'URL du flux GTFS-RT est accessible
- **Erreur de décodage**: Vérifiez que toutes les dépendances sont installées (`pip install -r requirements.txt`)
- **Port déjà utilisé**: Modifiez le port dans `app.py` (ligne finale) ou utilisez `flask run --port 5001`

## 📝 Notes

- Ceci est un POC (Proof of Concept) simple, pas une application de production
- Les données sont mises à jour uniquement lors du clic sur le bouton
- Pour une mise à jour automatique, décommentez la ligne dans `main.js` : `setInterval(updateVehicles, 30000);`

