import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Train, ArrowRight, Save, Clock, MapPin, AlertCircle } from 'lucide-react';
import { getConducteurs } from '../utils/conducteurData';

interface Assignment {
  conducteurId: number;
  conducteur: string;
  tramId: number;
  tram: string;
  ligne: string;
  heureDebut: string;
  heureFin: string;
  stationDebut: string;
  stationFin: string;
}

// Générer 30 tramways (basé sur les données réelles : majorité T2)
const trams = [
  // Ligne T2 - 20 tramways (basé sur les données des conducteurs)
  ...Array.from({ length: 13 }, (_, i) => ({
    id: i + 1,
    numero: `T2-${String(i + 1).padStart(2, '0')}`,
    ligne: 'T2',
    statut: i < 10 ? 'En service' : 'Disponible'
  })),
  // Ligne T1 - 10 tramways
  ...Array.from({ length: 10 }, (_, i) => ({
    id: i + 14,
    numero: `T1-${String(i + 1).padStart(2, '0')}`,
    ligne: 'T1',
    statut: i < 7 ? 'En service' : 'Disponible'
  })),
  // Tramways en maintenance
  { id: 24, numero: 'T2-14', ligne: 'T2', statut: 'Maintenance' },
  { id: 25, numero: 'T1-11', ligne: 'T1', statut: 'Maintenance' }
];

// Stations de relève principales
const stationsReleve = [
  'GOD01', 'GOD02', // Dépôt Godinière
  'HCA01', 'HCA02', // Hôpital Clemenceau
  'TRAM' // Centre Tram (dépôt)
];

export function PlanningPage() {
  const conducteursData = useMemo(() => getConducteurs(), []);
  
  // Transformer les données des conducteurs pour la page Planning
  const conducteurs = conducteursData.map(c => ({
    id: c.id,
    nom: `${c.prenom} ${c.nom}`,
    matricule: c.matricule,
    disponible: c.statut !== 'En service',
    heureDebut: c.heures.split('-')[0],
    heureFin: c.heures.split('-')[1],
    stationDebut: c.stationDebut,
    stationFin: c.stationFin,
    tram: c.tram
  }));
  
  // Créer les affectations initiales depuis les données réelles
  const initialAssignments: Assignment[] = conducteursData
    .filter(c => c.statut === 'En service')
    .map(c => ({
      conducteurId: c.id,
      conducteur: `${c.prenom} ${c.nom}`,
      tramId: parseInt(c.tram.split('-')[1]),
      tram: c.tram,
      ligne: c.ligne,
      heureDebut: c.heures.split('-')[0],
      heureFin: c.heures.split('-')[1],
      stationDebut: c.stationDebut,
      stationFin: c.stationFin
    }));

  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [selectedConducteur, setSelectedConducteur] = useState<string>('');
  const [selectedTram, setSelectedTram] = useState<string>('');
  const [heureDebut, setHeureDebut] = useState<string>('06:00');
  const [heureFin, setHeureFin] = useState<string>('14:00');
  const [selectedStationDebut, setSelectedStationDebut] = useState<string>('');
  const [selectedStationFin, setSelectedStationFin] = useState<string>('');

  const handleAssign = () => {
    if (!selectedConducteur || !selectedTram) {
      alert('Veuillez sélectionner un conducteur et un tram');
      return;
    }

    const conducteur = conducteurs.find(c => c.id.toString() === selectedConducteur);
    const tram = trams.find(t => t.id.toString() === selectedTram);

    if (conducteur && tram) {
      const newAssignment: Assignment = {
        conducteurId: conducteur.id,
        conducteur: conducteur.nom,
        tramId: tram.id,
        tram: tram.numero,
        ligne: tram.ligne,
        heureDebut,
        heureFin,
        stationDebut: selectedStationDebut || conducteur.stationDebut,
        stationFin: selectedStationFin || conducteur.stationFin
      };

      setAssignments([...assignments, newAssignment]);
      setSelectedConducteur('');
      setSelectedTram('');
      setSelectedStationDebut('');
      setSelectedStationFin('');
    }
  };

  const handleRemoveAssignment = (conducteurId: number) => {
    setAssignments(assignments.filter(a => a.conducteurId !== conducteurId));
  };

  const assignedConducteurIds = new Set(assignments.map(a => a.conducteurId));
  const assignedTramIds = new Set(assignments.map(a => a.tramId));

  // Calculer le nombre de relèves prévues (basé sur les services des conducteurs)
  const nombreReleves = useMemo(() => {
    let totalReleves = 0;
    conducteursData.forEach(c => {
      totalReleves += c.services.length;
    });
    return totalReleves;
  }, [conducteursData]);

  // Fonction pour vérifier si un conducteur nécessite une pause (>3h de service)
  const needsBreak = (heureDebut: string, heureFin: string) => {
    const [startH, startM] = heureDebut.split(':').map(Number);
    const [endH, endM] = heureFin.split(':').map(Number);
    const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    return durationMinutes > 180; // Plus de 3 heures
  };

  // Statistiques
  const stats = {
    totalTrams: trams.length,
    tramsEnService: trams.filter(t => t.statut === 'En service').length,
    totalConducteurs: conducteurs.length,
    conducteursEnService: assignments.length,
    nombreReleves: nombreReleves,
    conducteursNeedingBreak: assignments.filter(a => needsBreak(a.heureDebut, a.heureFin)).length
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1>Planning des affectations</h1>
        <p className="text-gray-500">Assigner et gérer les conducteurs aux trams - Pause obligatoire toutes les 3h</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tramways</p>
                <p className="text-2xl">{stats.tramsEnService}/{stats.totalTrams}</p>
              </div>
              <Train className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Conducteurs</p>
                <p className="text-2xl">{stats.conducteursEnService}/{stats.totalConducteurs}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Relèves/jour</p>
                <p className="text-2xl">{stats.nombreReleves}</p>
              </div>
              <MapPin className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Stations relève</p>
                <p className="text-2xl">{stationsReleve.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className={stats.conducteursNeedingBreak > 0 ? 'border-amber-500' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pause requise</p>
                <p className="text-2xl">{stats.conducteursNeedingBreak}</p>
              </div>
              <AlertCircle className={`h-8 w-8 ${stats.conducteursNeedingBreak > 0 ? 'text-amber-500' : 'text-gray-400'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes pour les pauses */}
      {stats.conducteursNeedingBreak > 0 && (
        <Card className="border-amber-500 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">Attention : Pauses obligatoires</p>
                <p className="text-sm text-amber-700 mt-1">
                  {stats.conducteursNeedingBreak} conducteur(s) ont des services de plus de 3 heures consécutives. 
                  Une pause est obligatoire tous les 3 heures maximum selon la réglementation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle affectation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <div>
              <label className="text-sm mb-2 block">Conducteur</label>
              <Select value={selectedConducteur} onValueChange={setSelectedConducteur}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent>
                  {conducteurs
                    .filter(c => !assignedConducteurIds.has(c.id))
                    .map(c => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.nom} ({c.matricule})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm mb-2 block">Tram</label>
              <Select value={selectedTram} onValueChange={setSelectedTram}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent>
                  {trams
                    .filter(t => !assignedTramIds.has(t.id) && t.statut !== 'Maintenance')
                    .map(t => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.numero} - {t.ligne}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm mb-2 block">Station départ</label>
              <Select value={selectedStationDebut} onValueChange={setSelectedStationDebut}>
                <SelectTrigger>
                  <SelectValue placeholder="Station..." />
                </SelectTrigger>
                <SelectContent>
                  {stationsReleve.map(station => (
                    <SelectItem key={station} value={station}>
                      {station}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm mb-2 block">Heure début</label>
              <Select value={heureDebut} onValueChange={setHeureDebut}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="06:00">06:00</SelectItem>
                  <SelectItem value="07:00">07:00</SelectItem>
                  <SelectItem value="08:00">08:00</SelectItem>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm mb-2 block">Heure fin</label>
              <Select value={heureFin} onValueChange={setHeureFin}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="15:00">15:00</SelectItem>
                  <SelectItem value="16:00">16:00</SelectItem>
                  <SelectItem value="17:00">17:00</SelectItem>
                  <SelectItem value="18:00">18:00</SelectItem>
                  <SelectItem value="22:00">22:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm mb-2 block">Station arrivée</label>
              <Select value={selectedStationFin} onValueChange={setSelectedStationFin}>
                <SelectTrigger>
                  <SelectValue placeholder="Station..." />
                </SelectTrigger>
                <SelectContent>
                  {stationsReleve.map(station => (
                    <SelectItem key={station} value={station}>
                      {station}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAssign} className="w-full">
                Assigner
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Affectations actuelles</span>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const needsPause = needsBreak(assignment.heureDebut, assignment.heureFin);
              return (
              <div
                key={assignment.conducteurId}
                className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 ${needsPause ? 'border-amber-400 bg-amber-50/30' : ''}`}
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {assignment.conducteur}
                        {needsPause && (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                            <Clock className="h-3 w-3 mr-1" />
                            Pause requise
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{assignment.heureDebut} - {assignment.heureFin}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <MapPin className="h-3 w-3" />
                        {assignment.stationDebut} → {assignment.stationFin}
                      </div>
                    </div>
                  </div>
                  
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                  
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Train className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div>{assignment.tram}</div>
                      <Badge variant={assignment.ligne === 'T1' ? 'default' : 'secondary'}>
                        Ligne {assignment.ligne}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAssignment(assignment.conducteurId)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Retirer
                </Button>
              </div>
            );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Available Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conducteurs disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conducteurs
                .filter(c => !assignedConducteurIds.has(c.id))
                .map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{c.nom}</span>
                    </div>
                    <Badge variant="outline">{c.matricule}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trams disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {trams
                .filter(t => !assignedTramIds.has(t.id) && t.statut !== 'Maintenance')
                .map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Train className="h-4 w-4 text-gray-400" />
                      <span>{t.numero}</span>
                    </div>
                    <Badge variant={t.ligne === 'T1' ? 'default' : 'secondary'}>
                      {t.ligne}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}