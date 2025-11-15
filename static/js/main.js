/**
 * Script principal pour la visualisation des positions des tramways sur Leaflet
 */

// Initialiser la carte après le chargement complet du DOM
let map;
let markers = []; // Stocker les marqueurs avec leurs infos (ligne, etc.)
let stopMarkers = []; // Stocker les marqueurs des arrêts
let lineLayers = []; // Stocker les couches de lignes GeoJSON avec leurs infos
let currentTileLayer = null; // Couche de tuiles actuelle
let autoUpdateInterval = null; // Intervalle pour la mise à jour automatique
let lineVisibility = { T1: true, T2: true }; // État de visibilité des lignes
let stopsVisible = true; // État de visibilité des arrêts

// Attendre que le DOM soit chargé avant d'initialiser la carte
document.addEventListener('DOMContentLoaded', function() {
    // S'assurer que le conteneur de la carte a une taille
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error('Conteneur de carte introuvable');
        return;
    }
    
    // Initialisation de la carte Leaflet centrée sur Dijon
    map = L.map('map', {
        center: [47.32, 5.04],
        zoom: 13,
        zoomControl: true
    });
    
    // Attendre que la carte soit prête avant d'ajouter les tuiles
    map.whenReady(function() {
        // Initialiser avec OpenStreetMap par défaut
        changeMapStyle('osm');
    });
    
    // Initialiser les éléments DOM après la création de la carte
    initApp();
    
    // Charger les lignes de tram au démarrage
    loadTramLines();
    
    // Charger les arrêts de tram au démarrage
    loadTramStops();
});

/**
 * Initialise l'application après le chargement de la carte
 */
function initApp() {
    // Éléments DOM
    const updateBtn = document.getElementById('updateBtn');
    const autoUpdateBtn = document.getElementById('autoUpdateBtn');
    const mapStyleSelect = document.getElementById('mapStyle');
    const toggleT1 = document.getElementById('toggleT1');
    const toggleT2 = document.getElementById('toggleT2');
    const statusDiv = document.getElementById('status');
    
    // Écouter le clic sur le bouton de mise à jour manuelle
    if (updateBtn) {
        updateBtn.addEventListener('click', updateVehicles);
    }
    
    // Écouter le clic sur le bouton de mise à jour automatique
    if (autoUpdateBtn) {
        autoUpdateBtn.addEventListener('click', toggleAutoUpdate);
    }
    
    // Écouter le changement de style de carte
    if (mapStyleSelect) {
        mapStyleSelect.addEventListener('change', function(e) {
            changeMapStyle(e.target.value);
        });
    }
    
    // Écouter les changements des checkboxes de lignes
    if (toggleT1) {
        toggleT1.addEventListener('change', function(e) {
            toggleLineVisibility('T1', e.target.checked);
        });
    }
    
    if (toggleT2) {
        toggleT2.addEventListener('change', function(e) {
            toggleLineVisibility('T2', e.target.checked);
        });
    }
    
    // Écouter le changement de la checkbox des arrêts
    const toggleStops = document.getElementById('toggleStops');
    if (toggleStops) {
        toggleStops.addEventListener('change', function(e) {
            toggleStopsVisibility(e.target.checked);
        });
    }
}

// Variables globales pour les éléments DOM (seront initialisées dans initApp)
let updateBtn;
let autoUpdateBtn;
let statusDiv;

// Initialiser autoUpdateBtn globalement pour qu'il soit accessible dans toggleAutoUpdate
document.addEventListener('DOMContentLoaded', function() {
    autoUpdateBtn = document.getElementById('autoUpdateBtn');
});

/**
 * Change le style de fond de carte
 */
function changeMapStyle(style) {
    // Supprimer l'ancienne couche
    if (currentTileLayer) {
        map.removeLayer(currentTileLayer);
    }
    
    // Créer la nouvelle couche selon le style choisi
    if (style === 'carto') {
        currentTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap contributors © CARTO',
            subdomains: 'abcd',
            maxZoom: 20
        });
    } else {
        // OpenStreetMap par défaut
        currentTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
            subdomains: ['a', 'b', 'c']
        });
    }
    
    // Ajouter la nouvelle couche
    currentTileLayer.addTo(map);
}

/**
 * Active ou désactive la mise à jour automatique
 */
function toggleAutoUpdate() {
    if (autoUpdateInterval) {
        // Désactiver la mise à jour automatique
        clearInterval(autoUpdateInterval);
        autoUpdateInterval = null;
        autoUpdateBtn.textContent = 'Activer la mise à jour automatique';
        autoUpdateBtn.classList.remove('active');
        if (statusDiv) {
            statusDiv.textContent = 'Mise à jour automatique désactivée.';
            statusDiv.className = 'status';
        }
    } else {
        // Activer la mise à jour automatique
        updateVehicles(); // Mise à jour immédiate
        autoUpdateInterval = setInterval(updateVehicles, 31000); // Toutes les 31 secondes
        autoUpdateBtn.textContent = 'Désactiver la mise à jour automatique';
        autoUpdateBtn.classList.add('active');
        if (statusDiv) {
            statusDiv.textContent = 'Mise à jour automatique activée (toutes les 31 secondes).';
            statusDiv.className = 'status success';
        }
    }
}

/**
 * Crée une icône SVG personnalisée pour un tram
 */
function createTramIcon(color) {
    // Générer un ID unique pour le filtre basé sur la couleur
    const filterId = 'shadow-' + color.replace('#', '');
    
    // Créer un SVG avec le fond coloré en forme de pin et l'icône de tram au centre
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="60" viewBox="0 0 48 60">
            <!-- Forme du pin (goutte) -->
            <defs>
                <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                    <feOffset dx="0" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <!-- Fond du pin coloré -->
            <path d="M24 4 C16 4, 4 12, 4 24 C4 36, 24 56, 24 56 C24 56, 44 36, 44 24 C44 12, 32 4, 24 4 Z" 
                  fill="${color}" 
                  stroke="white" 
                  stroke-width="2"
                  filter="url(#${filterId})"/>
            <!-- Icône de tram centrée (24x24 au centre du pin) -->
            <g transform="translate(12, 10)">
                <rect width="16" height="16" x="4" y="3" rx="2" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 11h16" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M12 3v8" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                <path d="m8 19-2 3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="m18 22-2-3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="9" cy="15" r="0.8" fill="white"/>
                <circle cx="17" cy="15" r="0.8" fill="white"/>
            </g>
        </svg>
    `;
    
    // Créer une URL de données pour le SVG
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    return L.icon({
        iconUrl: svgUrl,
        iconSize: [48, 60],
        iconAnchor: [24, 60],
        popupAnchor: [0, -60]
    });
}

/**
 * Masque ou affiche une ligne de tram (lignes + véhicules)
 */
function toggleLineVisibility(lineName, visible) {
    lineVisibility[lineName] = visible;
    
    // Masquer/afficher les lignes
    lineLayers.forEach(layerInfo => {
        if (layerInfo.lineName === lineName) {
            if (visible) {
                layerInfo.layer.addTo(map);
            } else {
                map.removeLayer(layerInfo.layer);
            }
        }
    });
    
    // Masquer/afficher les marqueurs des véhicules de cette ligne
    markers.forEach(markerInfo => {
        if (markerInfo.lineName === lineName) {
            if (visible) {
                markerInfo.marker.addTo(map);
            } else {
                map.removeLayer(markerInfo.marker);
            }
        }
    });
}

/**
 * Masque ou affiche les arrêts de tram
 */
function toggleStopsVisibility(visible) {
    stopsVisible = visible;
    
    stopMarkers.forEach(markerInfo => {
        if (visible) {
            markerInfo.marker.addTo(map);
        } else {
            map.removeLayer(markerInfo.marker);
        }
    });
}

/**
 * Charge et affiche les arrêts de tram depuis l'API
 */
async function loadTramStops() {
    try {
        const response = await fetch('/api/tram-stops');
        const data = await response.json();
        
        if (data.error) {
            console.error('Erreur lors du chargement des arrêts:', data.error);
            return;
        }
        
        // Supprimer les anciens marqueurs d'arrêts
        stopMarkers.forEach(markerInfo => map.removeLayer(markerInfo.marker));
        stopMarkers = [];
        
        // Créer un marqueur pour chaque arrêt
        data.stops.forEach(stop => {
            // Créer une icône pour les arrêts (cercle simple)
            const stopIcon = L.divIcon({
                className: 'tram-stop-icon',
                html: `<div class="stop-marker" style="background-color: #3498db; border: 2px solid white; border-radius: 50%; width: 12px; height: 12px;"></div>`,
                iconSize: [12, 12],
                iconAnchor: [6, 6]
            });
            
            const marker = L.marker([stop.stop_lat, stop.stop_lon], {
                icon: stopIcon
            });
            
            // Créer le contenu du popup
            const wheelchairIcon = stop.wheelchair_boarding === 1 ? '♿' : '';
            const popupContent = `
                <div class="popup-content">
                    <h3>${stop.stop_name} ${wheelchairIcon}</h3>
                    <p><strong>Code:</strong> ${stop.stop_code || 'N/A'}</p>
                    <p><strong>ID:</strong> ${stop.stop_id}</p>
                </div>
            `;
            
            marker.bindPopup(popupContent);
            
            // Ajouter le marqueur seulement si les arrêts sont visibles
            if (stopsVisible) {
                marker.addTo(map);
            }
            
            stopMarkers.push({
                marker: marker,
                stop: stop
            });
        });
        
        console.log(`${stopMarkers.length} arrêt(s) de tram chargé(s)`);
        
    } catch (error) {
        console.error('Erreur lors du chargement des arrêts:', error);
    }
}

/**
 * Formate un timestamp Unix en heure lisible
 */
function formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('fr-FR');
}

/**
 * Met à jour l'affichage de la dernière mise à jour
 */
function updateLastUpdateTime() {
    const lastUpdateDiv = document.getElementById('lastUpdate');
    if (lastUpdateDiv) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        lastUpdateDiv.textContent = `Dernière mise à jour : ${hours}h${minutes}min${seconds}s`;
    }
}

/**
 * Formate le statut du véhicule en français
 */
function formatStatus(status) {
    const statusMap = {
        0: 'En transit',
        1: 'Arrêté à',
        2: 'En approche',
        3: 'En attente'
    };
    return statusMap[status] || 'Inconnu';
}

/**
 * Récupère les positions des véhicules depuis l'API
 */
async function updateVehicles() {
    // Récupérer les éléments DOM si pas encore initialisés
    if (!updateBtn) updateBtn = document.getElementById('updateBtn');
    if (!statusDiv) statusDiv = document.getElementById('status');
    
    // Ne pas désactiver le bouton si la mise à jour automatique est active
    const isAutoUpdate = autoUpdateInterval !== null;
    
    // Désactiver le bouton pendant la requête (sauf si mise à jour auto)
    if (!isAutoUpdate) {
        updateBtn.disabled = true;
        updateBtn.textContent = 'Chargement...';
    }
    if (statusDiv) {
        statusDiv.textContent = isAutoUpdate ? 'Mise à jour automatique en cours...' : 'Téléchargement des positions en cours...';
        statusDiv.className = 'status loading';
    }
    
    try {
        // Appel à l'API backend
        const response = await fetch('/api/vehicles');
        const data = await response.json();
        
        // Vérifier s'il y a une erreur
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Supprimer les anciens marqueurs
        markers.forEach(markerInfo => {
            map.removeLayer(markerInfo.marker);
            // Libérer l'URL de l'icône SVG si elle existe
            if (markerInfo.marker.options.icon && markerInfo.marker.options.icon.options.iconUrl) {
                URL.revokeObjectURL(markerInfo.marker.options.icon.options.iconUrl);
            }
        });
        markers = [];
        
        // Ajouter les nouveaux marqueurs
        if (data.length === 0) {
            statusDiv.textContent = 'Aucun véhicule trouvé.';
            statusDiv.className = 'status warning';
        } else {
            // Filtrer une deuxième fois côté frontend pour être sûr (double vérification)
            const filteredVehicles = data.filter(vehicle => {
                const routeId = vehicle.route_id || '';
                return routeId.includes('T1') || routeId.includes('T2');
            });
            
            filteredVehicles.forEach(vehicle => {
                // Déterminer la ligne et la couleur du marqueur
                const routeId = vehicle.route_id || '';
                let lineName = '';
                let iconColor = '#3498db'; // Bleu par défaut
                
                if (routeId.includes('T1')) {
                    lineName = 'T1';
                    iconColor = '#e74c3c'; // Rouge pour T1
                } else if (routeId.includes('T2')) {
                    lineName = 'T2';
                    iconColor = '#27ae60'; // Vert pour T2
                }
                
                // Créer une icône SVG personnalisée avec le tram
                const tramIcon = createTramIcon(iconColor);
                
                // Créer un marqueur pour chaque véhicule
                const marker = L.marker([vehicle.latitude, vehicle.longitude], {
                    icon: tramIcon
                });
                
                // Créer le contenu du popup avec les informations du véhicule
                const popupContent = `
                    <div class="popup-content">
                        <h3>Tram ${vehicle.label || vehicle.vehicle_id}</h3>
                        <p><strong>Ligne:</strong> ${vehicle.route_id || 'N/A'}</p>
                        <p><strong>Direction:</strong> ${vehicle.direction_id !== null ? vehicle.direction_id : 'N/A'}</p>
                        <p><strong>Vitesse:</strong> ${vehicle.speed !== null ? Math.round(vehicle.speed * 3.6) + ' km/h' : 'N/A'}</p>
                        <p><strong>Cap:</strong> ${vehicle.bearing !== null ? Math.round(vehicle.bearing) + '°' : 'N/A'}</p>
                        <p><strong>Statut:</strong> ${vehicle.current_status !== null ? formatStatus(vehicle.current_status) : 'N/A'}</p>
                        <p><strong>Dernière mise à jour:</strong> ${formatTimestamp(vehicle.timestamp)}</p>
                        ${vehicle.stop_id ? `<p><strong>Arrêt:</strong> ${vehicle.stop_id}</p>` : ''}
                    </div>
                `;
                
                marker.bindPopup(popupContent);
                
                // Ajouter le marqueur seulement si la ligne est visible
                if (lineVisibility[lineName]) {
                    marker.addTo(map);
                }
                
                // Stocker le marqueur avec ses informations (ligne, etc.)
                markers.push({
                    marker: marker,
                    lineName: lineName
                });
            });
            
            if (statusDiv) {
                const autoText = isAutoUpdate ? ' (mise à jour auto)' : '';
                statusDiv.textContent = `${filteredVehicles.length} véhicule(s) T1/T2 affiché(s) sur la carte.${autoText}`;
                statusDiv.className = 'status success';
            }
            
            // Mettre à jour l'horodatage de la dernière mise à jour
            updateLastUpdateTime();
        }
        
    } catch (error) {
        console.error('Erreur lors de la récupération des véhicules:', error);
        if (statusDiv) {
            statusDiv.textContent = `Erreur: ${error.message}`;
            statusDiv.className = 'status error';
        }
    } finally {
        // Réactiver le bouton seulement si ce n'est pas une mise à jour automatique
        if (!isAutoUpdate && updateBtn) {
            updateBtn.disabled = false;
            updateBtn.textContent = 'Mettre à jour les positions des trams';
        }
    }
}

/**
 * Charge et affiche les lignes de tram depuis le GeoJSON
 */
async function loadTramLines() {
    try {
        const response = await fetch('/api/lines');
        const geojson = await response.json();
        
        if (geojson.error) {
            console.error('Erreur lors du chargement des lignes:', geojson.error);
            return;
        }
        
        // Supprimer les anciennes couches de lignes
        lineLayers.forEach(layerInfo => map.removeLayer(layerInfo.layer));
        lineLayers = [];
        
        // Parcourir les features du GeoJSON
        geojson.features.forEach(feature => {
            const geometry = feature.geometry;
            const properties = feature.properties || {};
            
            // Traiter les LineString (tracés des lignes)
            if (geometry.type === 'LineString') {
                const coordinates = geometry.coordinates;
                // Convertir les coordonnées [lng, lat] en [lat, lng] pour Leaflet
                const latlngs = coordinates.map(coord => [coord[1], coord[0]]);
                
                // Déterminer la couleur selon la ligne
                const routeShortName = properties.route_short_name || '';
                const routeId = properties.route_id || '';
                
                let lineColor = '#3498db'; // Bleu par défaut
                let lineWeight = 5;
                
                if (routeShortName === 'T1' || routeId.includes('T1')) {
                    lineColor = '#e74c3c'; // Rouge pour T1
                } else if (routeShortName === 'T2' || routeId.includes('T2')) {
                    lineColor = '#27ae60'; // Vert pour T2
                } else {
                    // Si ce n'est ni T1 ni T2, ne pas afficher cette ligne
                    return;
                }
                
                // Créer la polyligne
                const polyline = L.polyline(latlngs, {
                    color: lineColor,
                    weight: lineWeight,
                    opacity: 0.8
                });
                
                // Ajouter un popup avec les informations de la ligne
                const popupContent = `
                    <div class="popup-content">
                        <h3>Ligne ${routeShortName || routeId || 'Tram'}</h3>
                        ${properties.name ? `<p><strong>Nom:</strong> ${properties.name}</p>` : ''}
                        ${properties.description ? `<p><strong>Description:</strong> ${properties.description}</p>` : ''}
                    </div>
                `;
                polyline.bindPopup(popupContent);
                
                // Stocker les informations de la ligne avec son nom
                const lineName = routeShortName || (routeId.includes('T1') ? 'T1' : 'T2');
                const layerInfo = {
                    layer: polyline,
                    lineName: lineName
                };
                
                // Ajouter à la carte seulement si la ligne est visible
                if (lineVisibility[lineName]) {
                    polyline.addTo(map);
                }
                
                lineLayers.push(layerInfo);
            }
        });
        
        console.log(`${lineLayers.length} ligne(s) de tram chargée(s)`);
        
    } catch (error) {
        console.error('Erreur lors du chargement des lignes GeoJSON:', error);
    }
}

// Optionnel : mettre à jour automatiquement toutes les 30 secondes
// setInterval(updateVehicles, 30000);

