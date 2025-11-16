# 🚊 Application de gestion d'incidents - Hackathon KEOLIS

Application complète pour visualiser en temps réel les positions des tramways de Dijon et gérer les incidents du réseau de transport.

## 📋 Prérequis

- Python 3.8 ou supérieur
- Node.js 18+ et npm
- pip (gestionnaire de paquets Python)

## 🚀 Installation et lancement

### Méthode rapide (recommandée)

#### 1. Configuration automatique

```bash
./setup.sh
```

Ce script va :
- Créer l'environnement virtuel Python si nécessaire
- Installer toutes les dépendances Python

#### 2. Lancer le backend Flask

```bash
./start_backend.sh
```

Ou manuellement :

```bash
source venv/bin/activate
python app.py
```

Le serveur Flask sera accessible sur `http://127.0.0.1:5000`

#### 3. Lancer le frontend React

Dans un autre terminal :

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera accessible sur `http://localhost:3000`

### Méthode manuelle

#### Backend Flask

1. Créer et activer l'environnement virtuel :

```bash
python3 -m venv venv
source venv/bin/activate  # Sur macOS/Linux
# ou
venv\Scripts\activate  # Sur Windows
```

2. Installer les dépendances :

```bash
pip install -r requirements.txt
```

3. Lancer le serveur :

```bash
python app.py
```

#### Frontend React

1. Aller dans le dossier frontend :

```bash
cd frontend
```

2. Installer les dépendances :

```bash
npm install
```

3. Lancer le serveur de développement :

```bash
npm run dev
```

## 🎯 Utilisation

### Application React (Frontend)

1. Ouvrez `http://localhost:3000` dans votre navigateur
2. Naviguez vers la page **"Réseau"** dans le menu latéral
3. Cliquez sur l'onglet **"Vue cartographique"**
4. La carte affiche :
   - Les lignes T1 (bleu) et T2 (violet)
   - Les arrêts de tram (marqueurs bleus)
   - Les positions des tramways en temps réel (cercles colorés, mis à jour toutes les 10 secondes)

### Application Flask originale (Backend)

1. Ouvrez `http://127.0.0.1:5000` dans votre navigateur
2. La carte Leaflet s'affiche centrée sur Dijon
3. Cliquez sur le bouton **"Mettre à jour les positions des trams"**
4. Les positions des tramways apparaissent sur la carte sous forme de marqueurs bleus
5. Cliquez sur un marqueur pour voir les détails du véhicule (ligne, vitesse, direction, etc.)

## 📁 Structure du projet

```
.
├── app.py                 # Backend Flask avec APIs
├── requirements.txt       # Dépendances Python
├── setup.sh              # Script de configuration automatique
├── start_backend.sh      # Script pour lancer le backend
├── README.md             # Ce fichier
├── venv/                 # Environnement virtuel Python
├── frontend/             # Application React
│   ├── src/
│   │   ├── components/
│   │   │   ├── MapComponent.tsx  # Composant de carte interactive
│   │   │   └── ReseauPage.tsx    # Page réseau avec vue cartographique
│   │   └── ...
│   └── package.json
├── templates/
│   └── index.html        # Page HTML principale (ancienne version)
├── static/
│   ├── css/
│   │   └── style.css     # Styles CSS
│   └── js/
│       └── main.js       # Logique JavaScript frontend
└── Ressources/
    ├── Lignes.geojson    # Données géographiques des lignes
    └── stops.txt         # Liste des arrêts
```

## 🔧 Technologies utilisées

- **Backend**: Flask (Python) avec Flask-CORS
- **Frontend**: React 18 + TypeScript + Vite
- **Carte**: Leaflet.js + React-Leaflet
- **UI**: Tailwind CSS + Radix UI
- **Données**: GTFS-RT (Google Transit Feed Specification - Real-time)
- **Bibliothèque GTFS-RT**: `gtfs-realtime-bindings` (Google)

## 📡 Source de données

Les données proviennent du flux GTFS-RT officiel de Divia Dijon via data.gouv.fr :

```
https://proxy.transport.data.gouv.fr/resource/divia-dijon-gtfs-rt-vehicle-position
```

## 🐛 Dépannage

### Erreur "ModuleNotFoundError: No module named 'flask'"

**Solution** : Activez l'environnement virtuel avant de lancer le serveur :

```bash
source venv/bin/activate
python app.py
```

Ou utilisez le script `start_backend.sh` qui active automatiquement l'environnement.

### Erreur de connexion API

- Vérifiez que le backend Flask est bien démarré sur le port 5000
- Vérifiez votre connexion Internet et que l'URL du flux GTFS-RT est accessible
- Le frontend utilise un proxy configuré dans `vite.config.ts` pour accéder aux APIs Flask

### Port déjà utilisé

- **Backend** : Modifiez le port dans `app.py` (ligne 199) ou utilisez `flask run --port 5001`
- **Frontend** : Modifiez le port dans `frontend/vite.config.ts` (ligne 57)

### Erreur de décodage

Vérifiez que toutes les dépendances sont installées :

```bash
# Backend
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

## 📝 Notes

- Ceci est un POC (Proof of Concept) simple, pas une application de production
- Les données sont mises à jour uniquement lors du clic sur le bouton
- Pour une mise à jour automatique, décommentez la ligne dans `main.js` : `setInterval(updateVehicles, 30000);`

