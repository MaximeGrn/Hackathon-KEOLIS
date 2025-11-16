"""
Backend Flask pour visualiser les positions des tramways de Dijon en temps réel.
Télécharge et décode le flux GTFS-RT depuis data.gouv.fr
"""

from flask import Flask, render_template, jsonify
from flask_cors import CORS
import requests
from google.transit import gtfs_realtime_pb2
from datetime import datetime
import json
import os
import csv

app = Flask(__name__)
CORS(app)  # Autoriser les requêtes depuis le frontend React

# URL du flux GTFS-RT pour les positions des véhicules Divia Dijon
GTFS_RT_URL = "https://proxy.transport.data.gouv.fr/resource/divia-dijon-gtfs-rt-vehicle-position"

# URL du flux GTFS-RT pour les mises à jour de trajets (trip-update)
GTFS_RT_TRIP_UPDATE_URL = "https://proxy.transport.data.gouv.fr/resource/divia-dijon-gtfs-rt-trip-update"

# Chemin vers le fichier GeoJSON des lignes
GEOJSON_PATH = os.path.join(os.path.dirname(__file__), 'Ressources', 'Lignes.geojson')

# Chemin vers le fichier des arrêts
STOPS_PATH = os.path.join(os.path.dirname(__file__), 'Ressources', 'stops.txt')


@app.route('/')
def index():
    """Route principale : renvoie la page HTML"""
    return render_template('index.html')


@app.route('/api/lines')
def get_lines():
    """
    Route API : renvoie le GeoJSON des lignes de tram filtré pour T1 et T2 uniquement
    """
    try:
        # Lire le fichier GeoJSON
        with open(GEOJSON_PATH, 'r', encoding='utf-8') as f:
            geojson_data = json.load(f)
        
        # Filtrer pour ne garder que les features avec route_short_name = T1 ou T2
        # Ou les LineString qui correspondent aux lignes T1/T2
        filtered_features = []
        
        for feature in geojson_data.get('features', []):
            props = feature.get('properties', {})
            geometry_type = feature.get('geometry', {}).get('type', '')
            
            # Pour les LineString, vérifier si elles correspondent à T1 ou T2
            if geometry_type == 'LineString':
                # Vérifier dans les propriétés si c'est T1 ou T2
                route_short_name = props.get('route_short_name', '')
                route_id = props.get('route_id', '')
                
                # Filtrer pour ne garder que T1 et T2
                if route_short_name in ['T1', 'T2'] or 'T1' in str(route_id) or 'T2' in str(route_id):
                    filtered_features.append(feature)
            # Ne pas inclure les Points (arrêts) pour l'instant, seulement les tracés des lignes
        
        # Créer un nouveau GeoJSON avec les features filtrées
        filtered_geojson = {
            'type': 'FeatureCollection',
            'features': filtered_features
        }
        
        return jsonify(filtered_geojson)
    
    except FileNotFoundError:
        return jsonify({"error": "Fichier GeoJSON introuvable"}), 404
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la lecture du GeoJSON: {str(e)}"}), 500


@app.route('/api/tram-stops')
def get_tram_stops():
    """
    Route API : récupère les stopId des lignes T1/T2 depuis trip-update,
    puis filtre et renvoie les arrêts de tram depuis stops.txt
    """
    try:
        # Étape 1 : Télécharger et décoder le flux trip-update
        response = requests.get(GTFS_RT_TRIP_UPDATE_URL, timeout=10)
        response.raise_for_status()
        
        # Parser le message GTFS-RT trip-update
        feed = gtfs_realtime_pb2.FeedMessage()
        feed.ParseFromString(response.content)
        
        # Étape 2 : Extraire tous les stopId des entités T1 et T2
        tram_stop_ids = set()
        
        for entity in feed.entity:
            if entity.HasField('trip_update'):
                trip_update = entity.trip_update
                entity_id = entity.id
                
                # Vérifier si c'est une ligne T1 ou T2
                if 'T1' in entity_id or 'T2' in entity_id:
                    # Parcourir tous les stopTimeUpdate pour récupérer les stopId
                    for stop_time_update in trip_update.stop_time_update:
                        if stop_time_update.HasField('stop_id'):
                            tram_stop_ids.add(stop_time_update.stop_id)
        
        # Étape 3 : Lire le fichier stops.txt et filtrer les arrêts de tram
        tram_stops = []
        
        if not os.path.exists(STOPS_PATH):
            return jsonify({"error": "Fichier stops.txt introuvable"}), 404
        
        with open(STOPS_PATH, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                stop_id = row.get('stop_id', '').strip()
                if stop_id in tram_stop_ids:
                    tram_stops.append({
                        'stop_id': stop_id,
                        'stop_code': row.get('stop_code', '').strip(),
                        'stop_name': row.get('stop_name', '').strip(),
                        'stop_lat': float(row.get('stop_lat', 0)),
                        'stop_lon': float(row.get('stop_lon', 0)),
                        'wheelchair_boarding': int(row.get('wheelchair_boarding', 0))
                    })
        
        return jsonify({
            'stops': tram_stops,
            'count': len(tram_stops)
        })
    
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Erreur lors du téléchargement du flux trip-update: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Erreur lors du traitement des arrêts: {str(e)}"}), 500


@app.route('/api/vehicles')
def get_vehicles():
    """
    Route API : télécharge le flux GTFS-RT, le décode et renvoie un JSON simplifié
    avec les positions des véhicules.
    """
    try:
        # Télécharger le flux Protobuf
        response = requests.get(GTFS_RT_URL, timeout=10)
        response.raise_for_status()
        
        # Parser le message GTFS-RT
        feed = gtfs_realtime_pb2.FeedMessage()
        feed.ParseFromString(response.content)
        
        # Transformer les données en JSON simplifié
        vehicles = []
        for entity in feed.entity:
            if entity.HasField('vehicle'):
                vehicle_data = entity.vehicle
                
                # Extraire les informations du véhicule
                vehicle_info = {
                    "vehicle_id": entity.id,
                    "label": vehicle_data.vehicle.label if vehicle_data.HasField('vehicle') else entity.id,
                    "route_id": vehicle_data.trip.route_id if vehicle_data.HasField('trip') else None,
                    "trip_id": vehicle_data.trip.trip_id if vehicle_data.HasField('trip') else None,
                    "direction_id": vehicle_data.trip.direction_id if vehicle_data.HasField('trip') else None,
                    "latitude": vehicle_data.position.latitude if vehicle_data.HasField('position') else None,
                    "longitude": vehicle_data.position.longitude if vehicle_data.HasField('position') else None,
                    "bearing": vehicle_data.position.bearing if vehicle_data.HasField('position') and vehicle_data.position.HasField('bearing') else None,
                    "speed": vehicle_data.position.speed if vehicle_data.HasField('position') and vehicle_data.position.HasField('speed') else None,
                    "stop_id": vehicle_data.stop_id if vehicle_data.HasField('stop_id') else None,
                    "timestamp": vehicle_data.timestamp if vehicle_data.HasField('timestamp') else None,
                    "current_status": vehicle_data.current_status if vehicle_data.HasField('current_status') else None
                }
                
                # Ne garder que les véhicules avec une position valide
                # ET qui appartiennent aux lignes T1 ou T2
                if vehicle_info["latitude"] is not None and vehicle_info["longitude"] is not None:
                    route_id = vehicle_info.get("route_id", "")
                    # Filtrer pour ne garder que T1 et T2
                    if route_id and ("T1" in route_id or "T2" in route_id):
                        vehicles.append(vehicle_info)
        
        return jsonify(vehicles)
    
    except requests.exceptions.RequestException as e:
        # Erreur réseau
        return jsonify({"error": f"Erreur lors du téléchargement du flux GTFS-RT: {str(e)}"}), 500
    
    except Exception as e:
        # Erreur de parsing ou autre
        return jsonify({"error": f"Erreur lors du décodage du flux GTFS-RT: {str(e)}"}), 500


if __name__ == '__main__':
    # Lancer le serveur Flask en mode debug pour le développement
    app.run(debug=True, host='127.0.0.1', port=5000)

