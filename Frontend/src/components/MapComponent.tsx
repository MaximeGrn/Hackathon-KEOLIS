import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Layers, Eye, EyeOff, Clock } from 'lucide-react';

// Fix pour les icônes Leaflet avec Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// SVG de l'icône d'arrêt (maison)
const StopIconSVG = (color: string) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house">
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
    <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  </svg>
`;

// Icône personnalisée pour les arrêts avec SVG
const createStopIcon = (color: string) => {
  return L.divIcon({
    className: 'stop-marker',
    html: `
      <div style="
        background-color: white;
        border-radius: 4px;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        border: 2px solid ${color};
      ">
        ${StopIconSVG(color)}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

// SVG de l'icône de tram
const TramIconSVG = (color: string) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tram-front-icon lucide-tram-front">
    <rect width="16" height="16" x="4" y="3" rx="2"/>
    <path d="M4 11h16"/>
    <path d="M12 3v8"/>
    <path d="m8 19-2 3"/>
    <path d="m18 22-2-3"/>
    <path d="M8 15h.01"/>
    <path d="M16 15h.01"/>
  </svg>
`;

// Icône personnalisée pour les tramways avec SVG
const createTramIcon = (color: string) => {
  return L.divIcon({
    className: 'tram-marker',
    html: `
      <div style="
        background-color: white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 2px solid ${color};
      ">
        ${TramIconSVG(color)}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Composant pour ajuster la vue de la carte
function MapBounds() {
  const map = useMap();
  const [boundsSet, setBoundsSet] = useState(false);

  useEffect(() => {
    if (!boundsSet) {
      // Centrer sur Dijon
      map.setView([47.3220, 5.0415], 13);
      setBoundsSet(true);
    }
  }, [map, boundsSet]);

  return null;
}

// Composant pour changer le calque de carte
function ChangeTileLayer({ tileLayer }: { tileLayer: 'osm' | 'cartodb' }) {
  const map = useMap();
  const layerRef = React.useRef<L.TileLayer | null>(null);

  useEffect(() => {
    // Supprimer l'ancien calque s'il existe
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    // Créer le nouveau calque
    let url = '';
    let attribution = '';

    if (tileLayer === 'cartodb') {
      url = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
    } else {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }

    const newLayer = L.tileLayer(url, {
      attribution: attribution,
      maxZoom: 19,
    });

    newLayer.addTo(map);
    layerRef.current = newLayer;

    // Cleanup
    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, tileLayer]);

  return null;
}

interface Vehicle {
  vehicle_id: string;
  label: string;
  route_id: string;
  trip_id?: string;
  direction_id?: number;
  latitude: number;
  longitude: number;
  bearing?: number;
  speed?: number;
  stop_id?: string;
  timestamp?: number;
  current_status?: number;
}

interface Stop {
  stop_id: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
}

export function MapComponent() {
  const [lines, setLines] = useState<any>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tileLayer, setTileLayer] = useState<'osm' | 'cartodb'>('osm');
  const [visibleLines, setVisibleLines] = useState<{ T1: boolean; T2: boolean }>({ T1: true, T2: true });
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charger les lignes
        const linesResponse = await fetch('/api/lines');
        if (!linesResponse.ok) throw new Error('Erreur lors du chargement des lignes');
        const linesData = await linesResponse.json();
        setLines(linesData);

        // Charger les arrêts
        const stopsResponse = await fetch('/api/tram-stops');
        if (!stopsResponse.ok) throw new Error('Erreur lors du chargement des arrêts');
        const stopsData = await stopsResponse.json();
        setStops(stopsData.stops || []);

        // Charger les véhicules
        const vehiclesResponse = await fetch('/api/vehicles');
        if (!vehiclesResponse.ok) throw new Error('Erreur lors du chargement des véhicules');
        const vehiclesData = await vehiclesResponse.json();
        setVehicles(vehiclesData || []);
        setLastUpdate(new Date());

        setLoading(false);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setLoading(false);
      }
    };

    loadData();

    // Mettre à jour les véhicules toutes les 30 secondes
    const interval = setInterval(async () => {
      try {
        const vehiclesResponse = await fetch('/api/vehicles');
        if (vehiclesResponse.ok) {
          const vehiclesData = await vehiclesResponse.json();
          setVehicles(vehiclesData || []);
          setLastUpdate(new Date());
        }
      } catch (err) {
        console.error('Erreur lors de la mise à jour des véhicules:', err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Style pour les lignes GeoJSON
  const getLineStyle = (feature: any) => {
    const routeName = feature?.properties?.route_short_name || '';
    const color = routeName === 'T1' ? '#2563eb' : routeName === 'T2' ? '#9333ea' : '#6b7280';
    const isVisible = routeName === 'T1' ? visibleLines.T1 : routeName === 'T2' ? visibleLines.T2 : true;
    
    return {
      color: color,
      weight: 4,
      opacity: isVisible ? 0.8 : 0,
    };
  };

  // Filtrer les lignes selon la visibilité
  const getFilteredLines = () => {
    if (!lines || !lines.features) return null;
    
    return {
      ...lines,
      features: lines.features.filter((feature: any) => {
        const routeName = feature?.properties?.route_short_name || '';
        if (routeName === 'T1') return visibleLines.T1;
        if (routeName === 'T2') return visibleLines.T2;
        return true;
      }),
    };
  };

  // Filtrer les véhicules selon les lignes visibles
  const getFilteredVehicles = () => {
    return vehicles.filter((vehicle) => {
      const routeId = vehicle.route_id || '';
      const isT1 = routeId.includes('T1');
      const isT2 = routeId.includes('T2');
      
      if (isT1) return visibleLines.T1;
      if (isT2) return visibleLines.T2;
      return true;
    });
  };

  // Créer un mapping des arrêts vers les lignes en utilisant les véhicules
  const getStopLineMapping = () => {
    const mapping: Record<string, Set<'T1' | 'T2'>> = {};
    
    // Créer un mapping basé sur les véhicules et leurs route_id
    vehicles.forEach((vehicle) => {
      const routeId = vehicle.route_id || '';
      if (routeId.includes('T1') || routeId.includes('T2')) {
        const line: 'T1' | 'T2' = routeId.includes('T1') ? 'T1' : 'T2';
        
        // Si le véhicule a un stop_id, mapper cet arrêt à la ligne
        if (vehicle.stop_id) {
          if (!mapping[vehicle.stop_id]) {
            mapping[vehicle.stop_id] = new Set();
          }
          mapping[vehicle.stop_id].add(line);
        }
      }
    });
    
    // Convertir les Sets en une seule ligne (priorité T1 si les deux)
    const finalMapping: Record<string, 'T1' | 'T2' | null> = {};
    Object.keys(mapping).forEach((stopId) => {
      const lines = Array.from(mapping[stopId]);
      // Si un arrêt est sur les deux lignes, on choisit T1 par défaut
      finalMapping[stopId] = lines.includes('T1') ? 'T1' : 'T2';
    });
    
    return finalMapping;
  };

  // Filtrer les arrêts selon les lignes visibles
  const getFilteredStops = () => {
    const stopLineMapping = getStopLineMapping();
    
    return stops.filter((stop) => {
      const line = stopLineMapping[stop.stop_id];
      if (line === 'T1') return visibleLines.T1;
      if (line === 'T2') return visibleLines.T2;
      // Si on ne connaît pas la ligne, on affiche l'arrêt si au moins une ligne est visible
      return visibleLines.T1 || visibleLines.T2;
    });
  };

  // Formater la date de dernière mise à jour
  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Chargement...';
    const hours = lastUpdate.getHours().toString().padStart(2, '0');
    const minutes = lastUpdate.getMinutes().toString().padStart(2, '0');
    const seconds = lastUpdate.getSeconds().toString().padStart(2, '0');
    return `${hours}h${minutes}m${seconds}s`;
  };

  // Formater le statut du véhicule
  const getStatusText = (status?: number) => {
    if (status === undefined || status === null) return 'Inconnu';
    switch (status) {
      case 0: return 'En transit vers un arrêt';
      case 1: return 'En attente à l\'arrêt';
      case 2: return 'En transit vers l\'arrêt suivant';
      case 3: return 'En service';
      case 4: return 'Hors service';
      default: return 'Inconnu';
    }
  };

  if (loading) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Erreur: {error}</p>
          <p className="text-sm mt-2">Assurez-vous que le serveur Flask est démarré sur le port 5000</p>
        </div>
      </div>
    );
  }

  const filteredLines = getFilteredLines();
  const filteredVehicles = getFilteredVehicles();
  const filteredStops = getFilteredStops();
  const stopLineMapping = getStopLineMapping();

  return (
    <div className="space-y-4">
      {/* Contrôles de la carte */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Sélecteur de calque */}
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-gray-600" />
          <Label className="text-sm font-medium">Calque de carte:</Label>
          <div className="flex gap-2">
            <Button
              variant={tileLayer === 'osm' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTileLayer('osm')}
            >
              OpenStreetMap
            </Button>
            <Button
              variant={tileLayer === 'cartodb' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTileLayer('cartodb')}
            >
              CartoDB
            </Button>
          </div>
        </div>

        {/* Dernière mise à jour */}
        <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
          <Clock className="h-4 w-4 text-gray-600" />
          <Label className="text-sm text-gray-600">
            Dernière mise à jour: <span className="font-medium text-gray-900">{formatLastUpdate()}</span>
          </Label>
        </div>

        {/* Contrôles de visibilité des lignes */}
        <div className="flex items-center gap-4 border-l border-gray-300 pl-4">
          <Label className="text-sm font-medium">Lignes visibles:</Label>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="line-t1"
                checked={visibleLines.T1}
                onCheckedChange={(checked) => setVisibleLines({ ...visibleLines, T1: checked })}
              />
              <Label htmlFor="line-t1" className="flex items-center gap-2 cursor-pointer">
                {visibleLines.T1 ? (
                  <Eye className="h-4 w-4 text-blue-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
                <span className={`text-sm ${visibleLines.T1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  Ligne T1
                </span>
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="line-t2"
                checked={visibleLines.T2}
                onCheckedChange={(checked) => setVisibleLines({ ...visibleLines, T2: checked })}
              />
              <Label htmlFor="line-t2" className="flex items-center gap-2 cursor-pointer">
                {visibleLines.T2 ? (
                  <Eye className="h-4 w-4 text-purple-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
                <span className={`text-sm ${visibleLines.T2 ? 'text-purple-600 font-medium' : 'text-gray-500'}`}>
                  Ligne T2
                </span>
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Carte */}
      <div className="aspect-video rounded-lg overflow-hidden border border-gray-300">
        <MapContainer
          center={[47.3220, 5.0415]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <ChangeTileLayer tileLayer={tileLayer} />
          <MapBounds />

          {/* Afficher les lignes filtrées */}
          {filteredLines && (
            <GeoJSON
              key={JSON.stringify(visibleLines)} // Force le re-render quand la visibilité change
              data={filteredLines}
              style={getLineStyle}
              onEachFeature={(feature, layer) => {
                const routeName = feature?.properties?.route_short_name || 'Ligne inconnue';
                layer.bindPopup(`<strong>${routeName}</strong>`);
              }}
            />
          )}

          {/* Afficher les arrêts filtrés */}
          {filteredStops.map((stop) => {
            const line = stopLineMapping[stop.stop_id];
            const color = line === 'T1' ? '#2563eb' : line === 'T2' ? '#9333ea' : '#6b7280';
            
            return (
              <Marker
                key={stop.stop_id}
                position={[stop.stop_lat, stop.stop_lon]}
                icon={createStopIcon(color)}
              >
                <Popup>
                  <div>
                    <strong>{stop.stop_name}</strong>
                    <br />
                    <span className="text-sm text-gray-600">Arrêt {stop.stop_id}</span>
                    {line && (
                      <>
                        <br />
                        <span className={`text-sm font-medium ${line === 'T1' ? 'text-blue-600' : 'text-purple-600'}`}>
                          Ligne {line}
                        </span>
                      </>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Afficher les véhicules filtrés */}
          {filteredVehicles.map((vehicle) => {
            if (!vehicle.latitude || !vehicle.longitude) return null;
            
            const routeId = vehicle.route_id || '';
            const isT1 = routeId.includes('T1');
            const isT2 = routeId.includes('T2');
            const color = isT1 ? '#2563eb' : isT2 ? '#9333ea' : '#6b7280';
            
            return (
              <Marker
                key={vehicle.vehicle_id}
                position={[vehicle.latitude, vehicle.longitude]}
                icon={createTramIcon(color)}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="font-semibold text-base mb-2">
                      Tram {vehicle.label || vehicle.vehicle_id}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="font-medium">Ligne:</span> {routeId}
                      </div>
                      {vehicle.trip_id && (
                        <div>
                          <span className="font-medium">Trajet:</span> {vehicle.trip_id}
                        </div>
                      )}
                      {vehicle.direction_id !== undefined && vehicle.direction_id !== null && (
                        <div>
                          <span className="font-medium">Direction:</span> {vehicle.direction_id === 0 ? 'Aller' : 'Retour'}
                        </div>
                      )}
                      {vehicle.stop_id && (
                        <div>
                          <span className="font-medium">Arrêt:</span> {vehicle.stop_id}
                        </div>
                      )}
                      {vehicle.current_status !== undefined && vehicle.current_status !== null && (
                        <div>
                          <span className="font-medium">Statut:</span> {getStatusText(vehicle.current_status)}
                        </div>
                      )}
                      {vehicle.speed !== null && vehicle.speed !== undefined && (
                        <div>
                          <span className="font-medium">Vitesse:</span> {Math.round(vehicle.speed * 3.6)} km/h
                        </div>
                      )}
                      {vehicle.bearing !== null && vehicle.bearing !== undefined && (
                        <div>
                          <span className="font-medium">Cap:</span> {Math.round(vehicle.bearing)}°
                        </div>
                      )}
                      {vehicle.timestamp && (
                        <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                          <span className="font-medium">Horodatage:</span> {new Date(vehicle.timestamp * 1000).toLocaleTimeString('fr-FR')}
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

