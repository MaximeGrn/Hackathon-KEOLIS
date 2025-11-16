#!/bin/bash

# Script pour lancer le backend Flask

# Activer l'environnement virtuel
source venv/bin/activate

# Lancer le serveur Flask
echo "🚀 Démarrage du serveur Flask sur http://127.0.0.1:5000"
python app.py

