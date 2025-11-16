#!/bin/bash

# Script de configuration pour le projet Hackathon-KEOLIS

echo "🚀 Configuration du projet Hackathon-KEOLIS"
echo ""

# Vérifier si l'environnement virtuel existe
if [ ! -d "venv" ]; then
    echo "📦 Création de l'environnement virtuel..."
    python3 -m venv venv
fi

# Activer l'environnement virtuel
echo "🔧 Activation de l'environnement virtuel..."
source venv/bin/activate

# Mettre à jour pip
echo "⬆️  Mise à jour de pip..."
pip install --upgrade pip

# Installer les dépendances Python
echo "📥 Installation des dépendances Python..."
pip install -r requirements.txt

echo ""
echo "✅ Configuration terminée !"
echo ""
echo "Pour lancer le serveur Flask :"
echo "  1. Activez l'environnement virtuel : source venv/bin/activate"
echo "  2. Lancez le serveur : python app.py"
echo ""

