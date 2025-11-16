import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertTriangle, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';

interface Incident {
  id: number;
  ligne: string;
  station: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  statut: 'actif' | 'en_cours' | 'resolu';
  heureDebut: string;
  heureFin?: string;
  impactRetard: number;
  autoDetecte: boolean;
}

const initialIncidents: Incident[] = [
  {
    id: 1,
    ligne: 'T1',
    station: 'République',
    description: 'Panne technique - Système de freinage défaillant',
    severity: 'critical',
    statut: 'actif',
    heureDebut: '14:32',
    impactRetard: 8,
    autoDetecte: true,
  },
  {
    id: 2,
    ligne: 'T2',
    station: 'Drapeau',
    description: 'Affluence élevée - Temps d\'embarquement allongé',
    severity: 'low',
    statut: 'en_cours',
    heureDebut: '15:10',
    impactRetard: 2,
    autoDetecte: true,
  },
  {
    id: 3,
    ligne: 'T1',
    station: 'Grand Marché',
    description: 'Obstacle sur les voies - Intervention nécessaire',
    severity: 'high',
    statut: 'resolu',
    heureDebut: '13:45',
    heureFin: '14:20',
    impactRetard: 5,
    autoDetecte: false,
  },
];

export function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newIncident, setNewIncident] = useState({
    ligne: '',
    station: '',
    description: '',
    severity: 'medium' as 'critical' | 'high' | 'medium' | 'low',
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical': return 'Critique';
      case 'high': return 'Élevé';
      case 'medium': return 'Moyen';
      case 'low': return 'Faible';
      default: return severity;
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'actif': return 'Actif';
      case 'en_cours': return 'En cours de résolution';
      case 'resolu': return 'Résolu';
      default: return statut;
    }
  };

  const handleResolveIncident = (id: number) => {
    setIncidents(incidents.map((inc: Incident) => 
      inc.id === id 
        ? { ...inc, statut: 'resolu' as const, heureFin: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
        : inc
    ));
  };

  const handleAddIncident = () => {
    if (!newIncident.ligne || !newIncident.station || !newIncident.description) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const incident: Incident = {
      id: incidents.length + 1,
      ligne: newIncident.ligne,
      station: newIncident.station,
      description: newIncident.description,
      severity: newIncident.severity,
      statut: 'actif',
      heureDebut: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      impactRetard: 0,
      autoDetecte: false,
    };

    setIncidents([incident, ...incidents]);
    setIsDialogOpen(false);
    setNewIncident({ ligne: '', station: '', description: '', severity: 'medium' });
  };

  const activeIncidents = incidents.filter((i: Incident) => i.statut !== 'resolu');
  const resolvedIncidents = incidents.filter((i: Incident) => i.statut === 'resolu');

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Gestion des incidents</h1>
          <p className="text-gray-500">Détection automatique et signalement manuel des incidents</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Signaler un incident
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Signaler un nouvel incident</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Ligne</Label>
                <Select value={newIncident.ligne} onValueChange={(v: string) => setNewIncident({ ...newIncident, ligne: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une ligne" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="T1">T1</SelectItem>
                    <SelectItem value="T2">T2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Station</Label>
                <Select value={newIncident.station} onValueChange={(v: string) => setNewIncident({ ...newIncident, station: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une station" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Ligne T1 */}
                    <SelectItem value="Dijon Gare">Dijon Gare</SelectItem>
                    <SelectItem value="Foch Gare">Foch Gare</SelectItem>
                    <SelectItem value="Darcy">Darcy</SelectItem>
                    <SelectItem value="Godrans Les Halles">Godrans Les Halles</SelectItem>
                    <SelectItem value="République">République</SelectItem>
                    <SelectItem value="Auditorium">Auditorium</SelectItem>
                    <SelectItem value="Poincaré">Poincaré</SelectItem>
                    <SelectItem value="Grésilles Trimolet">Grésilles Trimolet</SelectItem>
                    <SelectItem value="Parc des Sports">Parc des Sports</SelectItem>
                    <SelectItem value="CHU – Hôpitaux">CHU – Hôpitaux</SelectItem>
                    <SelectItem value="Erasme">Erasme</SelectItem>
                    <SelectItem value="Université">Université</SelectItem>
                    <SelectItem value="Mazen Sully">Mazen Sully</SelectItem>
                    <SelectItem value="Piscine Olympique">Piscine Olympique</SelectItem>
                    <SelectItem value="Cap Vert">Cap Vert</SelectItem>
                    <SelectItem value="Grand Marché">Grand Marché</SelectItem>
                    <SelectItem value="Quetigny Centre La Parenthèse">Quetigny Centre La Parenthèse</SelectItem>
                    {/* Ligne T2 */}
                    <SelectItem value="Dijon Valmy">Dijon Valmy</SelectItem>
                    <SelectItem value="Giroud">Giroud</SelectItem>
                    <SelectItem value="Pôle Santé">Pôle Santé</SelectItem>
                    <SelectItem value="Zénith">Zénith</SelectItem>
                    <SelectItem value="Toison d'Or">Toison d'Or</SelectItem>
                    <SelectItem value="Europe – Simone Veil">Europe – Simone Veil</SelectItem>
                    <SelectItem value="Nation">Nation</SelectItem>
                    <SelectItem value="Junot">Junot</SelectItem>
                    <SelectItem value="Drapeau">Drapeau</SelectItem>
                    <SelectItem value="Monge – Cité de la Gastronomie">Monge – Cité de la Gastronomie</SelectItem>
                    <SelectItem value="1er Mai">1er Mai</SelectItem>
                    <SelectItem value="Jaurès">Jaurès</SelectItem>
                    <SelectItem value="Bourroches">Bourroches</SelectItem>
                    <SelectItem value="Carraz">Carraz</SelectItem>
                    <SelectItem value="Valendons">Valendons</SelectItem>
                    <SelectItem value="Le Mail">Le Mail</SelectItem>
                    <SelectItem value="Chenôve Centre">Chenôve Centre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Gravité</Label>
                <Select value={newIncident.severity} onValueChange={(v: 'critical' | 'high' | 'medium' | 'low') => setNewIncident({ ...newIncident, severity: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyen</SelectItem>
                    <SelectItem value="high">Élevé</SelectItem>
                    <SelectItem value="critical">Critique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Décrire l'incident..."
                  value={newIncident.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewIncident({ ...newIncident, description: e.target.value })}
                  rows={4}
                />
              </div>
              <Button onClick={handleAddIncident} className="w-full">
                Signaler l'incident
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl">{activeIncidents.length}</div>
                <p className="text-sm text-gray-600">Actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl">{incidents.filter((i: Incident) => i.statut === 'en_cours').length}</div>
                <p className="text-sm text-gray-600">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl">{resolvedIncidents.length}</div>
                <p className="text-sm text-gray-600">Résolus</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl">{incidents.filter((i: Incident) => i.autoDetecte).length}</div>
                <p className="text-sm text-gray-600">Auto-détectés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Incidents */}
      <Card>
        <CardHeader>
          <CardTitle>Incidents actifs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeIncidents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-600" />
              <p>Aucun incident actif</p>
            </div>
          ) : (
            activeIncidents.map((incident: Incident) => (
              <div key={incident.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={incident.ligne === 'T1' ? 'default' : 'secondary'}>
                        {incident.ligne}
                      </Badge>
                      <Badge variant={getSeverityColor(incident.severity)}>
                        {getSeverityLabel(incident.severity)}
                      </Badge>
                      {incident.autoDetecte && (
                        <Badge variant="outline" className="text-xs">
                          Auto-détecté
                        </Badge>
                      )}
                      <span className="text-sm text-gray-500">{incident.heureDebut}</span>
                    </div>
                    <h3 className="mb-1">{incident.station}</h3>
                    <p className="text-sm text-gray-600">{incident.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="text-sm">
                        <span className="text-gray-500">Impact retard:</span>
                        <span className="ml-2 text-red-600">+{incident.impactRetard} min</span>
                      </div>
                      <Badge variant="outline">{getStatutLabel(incident.statut)}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleResolveIncident(incident.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Résoudre
                    </Button>
                    <Button size="sm" variant="outline">
                      Réorganiser trafic
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Resolved Incidents Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des incidents résolus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resolvedIncidents.map((incident: Incident) => (
              <div key={incident.id} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={incident.ligne === 'T1' ? 'default' : 'secondary'} className="text-xs">
                      {incident.ligne}
                    </Badge>
                    <span>{incident.station}</span>
                  </div>
                  <p className="text-sm text-gray-600">{incident.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>Début: {incident.heureDebut}</span>
                    <span>Fin: {incident.heureFin}</span>
                    <Badge variant="outline" className="text-xs bg-green-50">
                      Résolu
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions de réorganisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              <span>Réorganiser trafic T1</span>
              <span className="text-xs text-gray-500 mt-1">Revenir à l'état théorique</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              <span>Réorganiser trafic T2</span>
              <span className="text-xs text-gray-500 mt-1">Revenir à l'état théorique</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <CheckCircle className="h-6 w-6 mb-2" />
              <span>Réattribuer conducteurs</span>
              <span className="text-xs text-gray-500 mt-1">Suite aux incidents</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
