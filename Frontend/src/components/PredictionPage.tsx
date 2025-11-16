import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { TrendingUp, AlertTriangle, Clock, Users, Zap, CloudRain } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const predictionAffluence = [
  { heure: '08h', actuel: 450, predit: 480, confiance: 92 },
  { heure: '09h', actuel: 380, predit: 390, confiance: 88 },
  { heure: '10h', actuel: 280, predit: 270, confiance: 85 },
  { heure: '11h', actuel: 320, predit: 310, confiance: 87 },
  { heure: '12h', actuel: 420, predit: 440, confiance: 90 },
  { heure: '13h', predit: 380, confiance: 88 },
  { heure: '14h', predit: 310, confiance: 84 },
  { heure: '15h', predit: 290, confiance: 82 },
  { heure: '16h', predit: 350, confiance: 86 },
  { heure: '17h', predit: 480, confiance: 91 },
  { heure: '18h', predit: 550, confiance: 93 },
  { heure: '19h', predit: 420, confiance: 89 },
];

const risqueIncidents = [
  { jour: 'Aujourd\'hui', risque: 35, incidents: 2 },
  { jour: 'Demain', risque: 62, incidents: 3 },
  { jour: 'Mer', risque: 45, incidents: 2 },
  { jour: 'Jeu', risque: 28, incidents: 1 },
  { jour: 'Ven', risque: 52, incidents: 2 },
  { jour: 'Sam', risque: 18, incidents: 1 },
  { jour: 'Dim', risque: 12, incidents: 0 },
];

const maintenancePredictive = [
  { tram: 'T1-04', risque: 85, composant: 'Système de freinage', jours: 7, criticite: 'high' },
  { tram: 'T2-03', risque: 72, composant: 'Moteur traction', jours: 14, criticite: 'medium' },
  { tram: 'T1-08', risque: 68, composant: 'Portes automatiques', jours: 21, criticite: 'medium' },
  { tram: 'T2-05', risque: 45, composant: 'Climatisation', jours: 30, criticite: 'low' },
];

const optimisationData = [
  { scenario: 'Actuel', couts: 100, efficacite: 85, satisfaction: 87 },
  { scenario: 'Optimisé', couts: 92, efficacite: 93, satisfaction: 91 },
  { scenario: 'Prédiction IA', couts: 88, efficacite: 96, satisfaction: 94 },
];

export function PredictionPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1>Analyse prédictive & IA</h1>
        <p className="text-gray-500">Anticipation et optimisation du réseau par intelligence artificielle</p>
      </div>

      {/* Alert Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <div>Pic d'affluence prévu demain à 18h</div>
                <div className="text-sm mt-1">Recommandation: Augmenter la fréquence de 20%</div>
              </div>
              <Badge variant="destructive">Haute priorité</Badge>
            </div>
          </AlertDescription>
        </Alert>

        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <div>Maintenance préventive recommandée</div>
                <div className="text-sm mt-1">Tram T1-04: Système de freinage dans 7 jours</div>
              </div>
              <Badge>Action requise</Badge>
            </div>
          </AlertDescription>
        </Alert>
      </div>

      {/* Prediction Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-blue-600" />
              <Badge variant="outline">+12%</Badge>
            </div>
            <div className="text-3xl mb-1">16.8k</div>
            <p className="text-sm text-gray-600">Passagers prévus demain</p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
              <span>Confiance: 91%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <Badge variant="secondary">62%</Badge>
            </div>
            <div className="text-3xl mb-1">3</div>
            <p className="text-sm text-gray-600">Incidents prédits demain</p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
              <span>Risque moyen-élevé</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-green-600" />
              <Badge variant="outline">+3%</Badge>
            </div>
            <div className="text-3xl mb-1">91.2%</div>
            <p className="text-sm text-gray-600">Ponctualité prévue</p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
              <span>Amélioration attendue</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-8 w-8 text-purple-600" />
              <Badge variant="outline">-8%</Badge>
            </div>
            <div className="text-3xl mb-1">4</div>
            <p className="text-sm text-gray-600">Maintenances à planifier</p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
              <span>30 prochains jours</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="affluence" className="space-y-4">
        <TabsList>
          <TabsTrigger value="affluence">Prédiction affluence</TabsTrigger>
          <TabsTrigger value="incidents">Risque incidents</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance prédictive</TabsTrigger>
          <TabsTrigger value="optimisation">Optimisation</TabsTrigger>
        </TabsList>

        <TabsContent value="affluence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prévision d'affluence - Aujourd'hui et demain</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={predictionAffluence}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="heure" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="actuel" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Actuel" />
                  <Area type="monotone" dataKey="predit" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Prédit" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommandations d'ajustement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h4>Heures de pointe</h4>
                  </div>
                  <p className="text-sm mb-2">Pics prévus: 8h-9h et 17h-19h</p>
                  <Badge variant="default">Augmenter fréquence de 20%</Badge>
                </div>

                <div className="p-4 border rounded-lg bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <h4>Heures creuses</h4>
                  </div>
                  <p className="text-sm mb-2">Période: 10h-15h</p>
                  <Badge variant="secondary">Réduire fréquence de 15%</Badge>
                </div>

                <div className="p-4 border rounded-lg bg-orange-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CloudRain className="h-5 w-5 text-orange-600" />
                    <h4>Conditions météo</h4>
                  </div>
                  <p className="text-sm mb-2">Pluie prévue demain après-midi</p>
                  <Badge variant="outline">+10% affluence attendue</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Précision du modèle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Précision globale</span>
                      <span className="text-2xl">89%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '89%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Confiance court terme (24h)</span>
                      <span className="text-2xl">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Confiance moyen terme (7j)</span>
                      <span className="text-2xl">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="mb-2">Facteurs pris en compte</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Historique</Badge>
                      <Badge variant="outline">Météo</Badge>
                      <Badge variant="outline">Événements</Badge>
                      <Badge variant="outline">Vacances</Badge>
                      <Badge variant="outline">Jours fériés</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prédiction du risque d'incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={risqueIncidents}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="jour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="risque" fill="#f59e0b" name="Niveau de risque (%)" />
                  <Bar dataKey="incidents" fill="#ef4444" name="Incidents prévus" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <AlertTriangle className="h-8 w-8 text-red-600 mb-3" />
                <div className="text-2xl mb-1">Demain</div>
                <p className="text-sm text-gray-600 mb-2">Risque élevé: 62%</p>
                <Badge variant="destructive">3 incidents prévus</Badge>
                <div className="mt-3 text-sm text-gray-600">
                  <div>• Météo défavorable</div>
                  <div>• Pics d'affluence</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-orange-600 mb-3" />
                <div className="text-2xl mb-1">Vendredi</div>
                <p className="text-sm text-gray-600 mb-2">Risque moyen: 52%</p>
                <Badge variant="secondary">2 incidents prévus</Badge>
                <div className="mt-3 text-sm text-gray-600">
                  <div>• Trafic élevé fin semaine</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
                <div className="text-2xl mb-1">Week-end</div>
                <p className="text-sm text-gray-600 mb-2">Risque faible: 15%</p>
                <Badge variant="outline">0-1 incidents prévus</Badge>
                <div className="mt-3 text-sm text-gray-600">
                  <div>• Trafic réduit</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertes maintenance prédictive</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {maintenancePredictive.map((item) => (
                <div
                  key={item.tram}
                  className={`p-4 border-2 rounded-lg ${
                    item.criticite === 'high' ? 'border-red-500 bg-red-50' :
                    item.criticite === 'medium' ? 'border-orange-500 bg-orange-50' :
                    'border-yellow-500 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={item.tram.startsWith('T1') ? 'default' : 'secondary'}>
                          {item.tram}
                        </Badge>
                        <Badge variant={
                          item.criticite === 'high' ? 'destructive' :
                          item.criticite === 'medium' ? 'secondary' :
                          'outline'
                        }>
                          {item.criticite === 'high' ? 'Critique' :
                           item.criticite === 'medium' ? 'Moyen' : 'Faible'}
                        </Badge>
                        <span className="text-sm text-gray-500">Dans {item.jours} jours</span>
                      </div>
                      <h4 className="mb-1">{item.composant}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <div>
                          <span className="text-sm text-gray-600">Probabilité de panne:</span>
                          <span className="ml-2 text-red-600">{item.risque}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div
                          className={`h-2 rounded-full ${
                            item.criticite === 'high' ? 'bg-red-600' :
                            item.criticite === 'medium' ? 'bg-orange-600' :
                            'bg-yellow-600'
                          }`}
                          style={{ width: `${item.risque}%` }}
                        />
                      </div>
                    </div>
                    <Button size="sm" className="ml-4">
                      Planifier maintenance
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Économies prévues avec maintenance prédictive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 border rounded-lg">
                  <div className="text-3xl text-green-600 mb-1">-32%</div>
                  <p className="text-sm text-gray-600">Coûts de réparation</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-3xl text-blue-600 mb-1">-45%</div>
                  <p className="text-sm text-gray-600">Temps d'arrêt</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-3xl text-purple-600 mb-1">+28%</div>
                  <p className="text-sm text-gray-600">Durée de vie équipements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimisation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparaison des scénarios d'optimisation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={optimisationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="scenario" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="couts" fill="#ef4444" name="Coûts (base 100)" />
                  <Bar dataKey="efficacite" fill="#3b82f6" name="Efficacité (%)" />
                  <Bar dataKey="satisfaction" fill="#10b981" name="Satisfaction (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommandations IA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <h4>Optimisation énergétique</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Ajuster la vitesse en fonction du trafic réel
                  </p>
                  <Badge variant="default">Économie: -12% énergie</Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <h4>Répartition intelligente</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Distribution optimale des trams selon affluence prédite
                  </p>
                  <Badge variant="default">+8% satisfaction</Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <h4>Horaires dynamiques</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Ajustement en temps réel des fréquences
                  </p>
                  <Badge variant="default">+5% ponctualité</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact des optimisations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Réduction des coûts</span>
                      <span className="text-2xl text-green-600">-12%</span>
                    </div>
                    <p className="text-sm text-gray-600">Économie annuelle estimée: 240k€</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Amélioration efficacité</span>
                      <span className="text-2xl text-blue-600">+11%</span>
                    </div>
                    <p className="text-sm text-gray-600">Meilleure utilisation de la flotte</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Satisfaction client</span>
                      <span className="text-2xl text-purple-600">+7%</span>
                    </div>
                    <p className="text-sm text-gray-600">Score prédit: 94% vs 87% actuel</p>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full">
                      Appliquer les recommandations
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}