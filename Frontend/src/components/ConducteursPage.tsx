import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Search, Phone, MapPin, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { getConducteurs } from '../utils/conducteurData';

export function ConducteursPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('all');

  const conducteurs = useMemo(() => getConducteurs(), []);

  const formatConducteurName = (prenom: string, nom: string) => {
    return `${prenom} ${nom.charAt(0)}.`;
  };

  const filteredConducteurs = conducteurs.filter((c) => {
    const matchesSearch = 
      c.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.matricule.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatut === 'all' || c.statut === filterStatut;
    
    return matchesSearch && matchesFilter;
  });

  // Calculer les stats dynamiquement
  const stats = useMemo(() => {
    const total = conducteurs.length;
    const enService = conducteurs.filter(c => c.statut === 'En service').length;
    const enPause = conducteurs.filter(c => c.statut === 'Pause').length;
    const enRetard = conducteurs.filter(c => c.statut === 'En retard').length;
    return { total, enService, enPause, enRetard };
  }, [conducteurs]);

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'En service': return 'bg-green-500';
      case 'Pause': return 'bg-yellow-500';
      case 'Repos': return 'bg-gray-500';
      case 'En retard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (statut: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (statut) {
      case 'En service': return 'default';
      case 'Pause': return 'secondary';
      case 'Repos': return 'outline';
      case 'En retard': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1>Informations conducteurs</h1>
        <p className="text-gray-500">Gestion et suivi des conducteurs en temps réel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl">{stats.total}</div>
            <p className="text-sm text-gray-600">Total actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl text-green-600">{stats.enService}</div>
            <p className="text-sm text-gray-600">En service</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl text-yellow-600">{stats.enPause}</div>
            <p className="text-sm text-gray-600">En pause</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl text-red-600">{stats.enRetard}</div>
            <p className="text-sm text-gray-600">En retard</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, prénom ou matricule..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatut === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatut('all')}
              >
                Tous
              </Button>
              <Button
                variant={filterStatut === 'En service' ? 'default' : 'outline'}
                onClick={() => setFilterStatut('En service')}
              >
                En service
              </Button>
              <Button
                variant={filterStatut === 'Pause' ? 'default' : 'outline'}
                onClick={() => setFilterStatut('Pause')}
              >
                Pause
              </Button>
              <Button
                variant={filterStatut === 'Repos' ? 'default' : 'outline'}
                onClick={() => setFilterStatut('Repos')}
              >
                Repos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conducteurs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConducteurs.map((conducteur) => (
          <Dialog key={conducteur.id}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {conducteur.prenom[0]}{conducteur.nom[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="truncate">{formatConducteurName(conducteur.prenom, conducteur.nom)}</h3>
                        <div className={`h-2 w-2 rounded-full ${getStatusColor(conducteur.statut)}`} />
                      </div>
                      <p className="text-sm text-gray-500">{conducteur.matricule}</p>
                      <Badge variant={getStatusVariant(conducteur.statut)} className="mt-2">
                        {conducteur.statut}
                      </Badge>
                      {conducteur.ligne !== '-' && (
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{conducteur.tram}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>{conducteur.heures}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Détails conducteur</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                      {conducteur.prenom[0]}{conducteur.nom[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3>{formatConducteurName(conducteur.prenom, conducteur.nom)}</h3>
                    <p className="text-sm text-gray-500">Matricule: {conducteur.matricule}</p>
                    <Badge variant={getStatusVariant(conducteur.statut)} className="mt-2">
                      {conducteur.statut}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{conducteur.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span>Horaires: {conducteur.heures}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>Position: {conducteur.position}</span>
                  </div>
                  {conducteur.ligne !== '-' && (
                    <>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Ligne {conducteur.ligne}</Badge>
                        <Badge variant="outline">Tram {conducteur.tram}</Badge>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="text-sm mb-2">Stations de service:</div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">Prise de service:</span>
                          <span>{conducteur.stationDebut}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm mt-1">
                          <span className="text-gray-600">Fin de service:</span>
                          <span>{conducteur.stationFin}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Contacter</Button>
                  <Button variant="outline" className="flex-1">Réassigner</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}