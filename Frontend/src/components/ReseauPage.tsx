import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MapPin, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { MapComponent } from './MapComponent';

// Ligne T1 (Dijon Gare ↔ Quetigny Centre La Parenthèse) — 17 arrêts
const stationsT1 = [
  { id: 1, nom: 'Dijon Gare', statut: 'normal', theorique: '—', reel: '—', ecart: 0 },
  { id: 2, nom: 'Foch Gare', statut: 'normal', theorique: '3 min', reel: '3 min', ecart: 0 },
  { id: 3, nom: 'Darcy', statut: 'normal', theorique: '2 min', reel: '2 min', ecart: 0 },
  { id: 4, nom: 'Godrans Les Halles', statut: 'normal', theorique: '3 min', reel: '3 min', ecart: 0 },
  { id: 5, nom: 'République', statut: 'incident', theorique: '4 min', reel: '12 min', ecart: 8 },
  { id: 6, nom: 'Auditorium', statut: 'normal', theorique: '3 min', reel: '3 min', ecart: 0 },
  { id: 7, nom: 'Poincaré', statut: 'normal', theorique: '4 min', reel: '4 min', ecart: 0 },
  { id: 8, nom: 'Grésilles Trimolet', statut: 'normal', theorique: '3 min', reel: '3 min', ecart: 0 },
  { id: 9, nom: 'Parc des Sports', statut: 'normal', theorique: '4 min', reel: '4 min', ecart: 0 },
  { id: 10, nom: 'CHU – Hôpitaux', statut: 'normal', theorique: '3 min', reel: '3 min', ecart: 0 },
  { id: 11, nom: 'Erasme', statut: 'normal', theorique: '4 min', reel: '4 min', ecart: 0 },
  { id: 12, nom: 'Université', statut: 'normal', theorique: '3 min', reel: '3 min', ecart: 0 },
  { id: 13, nom: 'Mazen Sully', statut: 'normal', theorique: '4 min', reel: '4 min', ecart: 0 },
  { id: 14, nom: 'Piscine Olympique', statut: 'normal', theorique: '3 min', reel: '3 min', ecart: 0 },
  { id: 15, nom: 'Cap Vert', statut: 'normal', theorique: '4 min', reel: '4 min', ecart: 0 },
  { id: 16, nom: 'Grand Marché', statut: 'retard', theorique: '3 min', reel: '5 min', ecart: 2 },
  { id: 17, nom: 'Quetigny Centre La Parenthèse', statut: 'normal', theorique: '—', reel: '—', ecart: 0 },
];

// Ligne T2 (Dijon Valmy ↔ Chenôve Centre) — 21 arrêts
const stationsT2 = [
  { id: 1, nom: 'Dijon Valmy', statut: 'normal', theorique: '—', reel: '—', ecart: 0 },
  { id: 2, nom: 'Giroud', statut: 'normal', theorique: '3 min', reel: '3 min', ecart: 0 },
  { id: 3, nom: 'Pôle Santé', statut: 'normal', theorique: '2 min', reel: '2 min', ecart: 0 },
  { id: 4, nom: 'Zénith', statut: 'normal', theorique: '3 min', reel: '3 min', ecart: 0 },
  { id: 5, nom: "Toison d'Or", statut: 'normal', theorique: '4 min', reel: '4 min', ecart: 0 },
  { id: 6, nom: 'Europe – Simone Veil', statut: 'normal', theorique: '3 min', reel: '3 min', ecart: 0 },
  { id: 7, nom: 'Nation', statut: 'normal', theorique: '2 min', reel: '2 min', ecart: 0 },
  { id: 8, nom: 'Junot', statut: 'normal', theorique: '3 min', reel: '3 min', ecart: 0 },
  { id: 9, nom: 'Drapeau', statut: 'retard', theorique: '3 min', reel: '5 min', ecart: 2 },
  { id: 10, nom: 'République', statut: 'normal', theorique: '2 min', reel: '2 min', ecart: 0 },
  { id: 11, nom: 'Godrans Les Halles', statut: 'normal', theorique: '3 min', reel: '3 min', ecart: 0 },
  { id: 12, nom: 'Darcy', statut: 'normal', theorique: '2 min', reel: '2 min', ecart: 0 },
  { id: 13, nom: 'Foch Gare', statut: 'normal', theorique: '3 min', reel: '3 min', ecart: 0 },
  { id: 14, nom: 'Monge – Cité de la Gastronomie', statut: 'normal', theorique: '4 min', reel: '4 min', ecart: 0 },
  { id: 15, nom: '1er Mai', statut: 'normal', theorique: '3 min', reel: '3 min', ecart: 0 },
  { id: 16, nom: 'Jaurès', statut: 'normal', theorique: '2 min', reel: '2 min', ecart: 0 },
  { id: 17, nom: 'Bourroches', statut: 'normal', theorique: '3 min', reel: '3 min', ecart: 0 },
  { id: 18, nom: 'Carraz', statut: 'normal', theorique: '4 min', reel: '4 min', ecart: 0 },
  { id: 19, nom: 'Valendons', statut: 'normal', theorique: '3 min', reel: '3 min', ecart: 0 },
  { id: 20, nom: 'Le Mail', statut: 'normal', theorique: '2 min', reel: '2 min', ecart: 0 },
  { id: 21, nom: 'Chenôve Centre', statut: 'normal', theorique: '—', reel: '—', ecart: 0 },
];

const tramsEnCirculation = [
  { id: 'T1-01', ligne: 'T1', position: 'Godrans Les Halles → République', retard: 0, statut: 'normal' },
  { id: 'T1-02', ligne: 'T1', position: 'CHU - Hôpitaux → Erasme', retard: 0, statut: 'normal' },
  { id: 'T1-05', ligne: 'T1', position: 'République (arrêté)', retard: 8, statut: 'incident' },
  { id: 'T2-01', ligne: 'T2', position: 'Darcy → Godrans Les Halles', retard: 2, statut: 'retard' },
  { id: 'T2-02', ligne: 'T2', position: 'Junot → Drapeau', retard: 0, statut: 'normal' },
  { id: 'T2-04', ligne: 'T2', position: "Toison d'Or → Zénith", retard: 0, statut: 'normal' },
];

export function ReseauPage() {
  const [viewMode, setViewMode] = useState<'reel' | 'theorique'>('reel');

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'normal': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'retard': return <Clock className="h-5 w-5 text-orange-600" />;
      case 'incident': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'normal': return 'border-green-500 bg-green-50';
      case 'retard': return 'border-orange-500 bg-orange-50';
      case 'incident': return 'border-red-500 bg-red-50';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>État du réseau</h1>
          <p className="text-gray-500">Visualisation en temps réel vs état théorique</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'reel' ? 'default' : 'outline'}
            onClick={() => setViewMode('reel')}
          >
            État réel
          </Button>
          <Button
            variant={viewMode === 'theorique' ? 'default' : 'outline'}
            onClick={() => setViewMode('theorique')}
          >
            État théorique
          </Button>
        </div>
      </div>

      {/* Network Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl">35 / 38</div>
                <p className="text-sm text-gray-600">Stations opérationnelles</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl text-orange-600">2</div>
                <p className="text-sm text-gray-600">Stations en retard</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl text-red-600">1</div>
                <p className="text-sm text-gray-600">Stations avec incident</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Visualization */}
      <Tabs defaultValue="t1" className="space-y-4">
        <TabsList>
          <TabsTrigger value="t1">Ligne T1</TabsTrigger>
          <TabsTrigger value="t2">Ligne T2</TabsTrigger>
          <TabsTrigger value="map">Vue cartographique</TabsTrigger>
        </TabsList>

        <TabsContent value="t1" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Schéma ligne T1 - Dijon Gare ↔ Quetigny Centre La Parenthèse</span>
                <Badge variant="default">T1</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Network Schema */}
              <div className="relative py-12 overflow-x-auto">
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-blue-600 -translate-y-1/2 min-w-[800px]" />
                <div className="flex justify-between relative min-w-[800px]">
                  {stationsT1.map((station, index) => (
                    <div key={station.id} className="flex flex-col items-center flex-shrink-0" style={{ width: `${100 / stationsT1.length}%` }}>
                      <div className={`w-8 h-8 rounded-full border-4 ${
                        station.statut === 'incident' ? 'border-red-600 bg-white' :
                        station.statut === 'retard' ? 'border-orange-600 bg-white' :
                        'border-blue-600 bg-white'
                      } relative z-10 shadow-md`} />
                      <div className="text-xs mt-3 text-center max-w-[100px] leading-tight font-medium">
                        {station.nom}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Station Details */}
              <div className="mt-8 space-y-2">
                {stationsT1.map((station) => (
                  <div
                    key={station.id}
                    className={`flex items-center justify-between p-4 border-2 rounded-lg ${getStatusColor(station.statut)}`}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(station.statut)}
                      <div>
                        <div>{station.nom}</div>
                        {station.statut === 'incident' && (
                          <div className="text-sm text-red-600">Panne technique - Service interrompu</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Théorique</div>
                        <div>{station.theorique}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Réel</div>
                        <div className={station.ecart > 0 ? 'text-red-600' : ''}>
                          {station.reel}
                        </div>
                      </div>
                      {station.ecart > 0 && (
                        <Badge variant="destructive">+{station.ecart} min</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="t2" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Schéma ligne T2 - Dijon Valmy ↔ Chenôve Centre</span>
                <Badge variant="secondary">T2</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Network Schema */}
              <div className="relative py-12 overflow-x-auto">
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-purple-600 -translate-y-1/2 min-w-[1000px]" />
                <div className="flex justify-between relative min-w-[1000px]">
                  {stationsT2.map((station, index) => (
                    <div key={station.id} className="flex flex-col items-center flex-shrink-0" style={{ width: `${100 / stationsT2.length}%` }}>
                      <div className={`w-8 h-8 rounded-full border-4 ${
                        station.statut === 'incident' ? 'border-red-600 bg-white' :
                        station.statut === 'retard' ? 'border-orange-600 bg-white' :
                        'border-purple-600 bg-white'
                      } relative z-10 shadow-md`} />
                      <div className="text-xs mt-3 text-center max-w-[100px] leading-tight font-medium">
                        {station.nom}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Station Details */}
              <div className="mt-8 space-y-2">
                {stationsT2.map((station) => (
                  <div
                    key={station.id}
                    className={`flex items-center justify-between p-4 border-2 rounded-lg ${getStatusColor(station.statut)}`}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(station.statut)}
                      <div>
                        <div>{station.nom}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Théorique</div>
                        <div>{station.theorique}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Réel</div>
                        <div className={station.ecart > 0 ? 'text-red-600' : ''}>
                          {station.reel}
                        </div>
                      </div>
                      {station.ecart > 0 && (
                        <Badge variant="destructive">+{station.ecart} min</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Vue cartographique du réseau</CardTitle>
            </CardHeader>
            <CardContent>
              <MapComponent />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Trams in Circulation */}
      <Card>
        <CardHeader>
          <CardTitle>Trams en circulation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tramsEnCirculation.map((tram) => (
              <div key={tram.id} className={`p-4 border-2 rounded-lg ${getStatusColor(tram.statut)}`}>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={tram.ligne === 'T1' ? 'default' : 'secondary'}>
                    {tram.id}
                  </Badge>
                  {getStatusIcon(tram.statut)}
                </div>
                <div className="text-sm mb-2">{tram.position}</div>
                {tram.retard > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    Retard: {tram.retard} min
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
