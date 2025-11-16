
  # Application de gestion d'incidents

  This is a code bundle for Application de gestion d'incidents. The original project is available at https://www.figma.com/design/P9HtrFkmQ7ID16N5EQVOAd/Application-de-gestion-d-incidents.

  ## Installation et lancement

  ### 1. Installer les dépendances

  ```bash
  npm install
  ```

  ### 2. Lancer le backend Flask

  Dans le répertoire racine du projet (où se trouve `app.py`), lancer :

  ```bash
  python app.py
  ```

  Le serveur Flask sera accessible sur `http://127.0.0.1:5000`

  ### 3. Lancer le frontend React

  Dans le répertoire `frontend`, lancer :

  ```bash
  npm run dev
  ```

  L'application sera accessible sur `http://localhost:3000`

  ## Fonctionnalités

  - **Page Réseau** : Visualisation de l'état du réseau avec les lignes T1 et T2
  - **Vue cartographique** : Carte interactive affichant :
    - Les lignes de tram T1 et T2 (en bleu et violet)
    - Les arrêts de tram
    - Les positions des tramways en temps réel (mis à jour toutes les 10 secondes)

  ## Notes

  - Assurez-vous que le backend Flask est démarré avant de lancer le frontend pour que la carte fonctionne correctement
  - Les données proviennent des APIs Flask qui récupèrent les informations depuis le flux GTFS-RT de Divia Dijon
  