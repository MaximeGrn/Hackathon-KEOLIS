import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TrendingUp, TrendingDown, Clock, Users, Train, AlertTriangle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const punctualityData = [
  { jour: 'Lun', T1: 92, T2: 95 },
  { jour: 'Mar', T1: 88, T2: 93 },
  { jour: 'Mer', T1: 90, T2: 91 },
  { jour: 'Jeu', T1: 85, T2: 89 },
  { jour: 'Ven', T1: 87, T2: 90 },
  { jour: 'Sam', T1: 94, T2: 96 },
  { jour: 'Dim', T1: 96, T2: 98 },
];

const incidentsData = [
  { mois: 'Jan', incidents: 12 },
  { mois: 'Fév', incidents: 8 },
  { mois: 'Mar', incidents: 15 },
  { mois: 'Avr', incidents: 10 },
  { mois: 'Mai', incidents: 7 },
  { mois: 'Jun', incidents: 9 },
];

const typeIncidentsData = [
  { name: 'Technique', value: 35, color: '#ef4444' },
  { name: 'Affluence', value: 25, color: '#f97316' },
  { name: 'Voies', value: 20, color: '#eab308' },
  { name: 'Météo', value: 12, color: '#3b82f6' },
  { name: 'Autres', value: 8, color: '#6b7280' },
];

const performanceData = [
  { heure: '06h', frequence: 8, passagers: 120 },
  { heure: '08h', frequence: 5, passagers: 450 },
  { heure: '10h', frequence: 6, passagers: 280 },
  { heure: '12h', frequence: 6, passagers: 320 },
  { heure: '14h', frequence: 7, passagers: 250 },
  { heure: '16h', frequence: 5, passagers: 380 },
  { heure: '18h', frequence: 4, passagers: 520 },
  { heure: '20h', frequence: 7, passagers: 180 },
];

export function KPIPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1>Indicateurs de performance (KPI)</h1>
        <p className="text-gray-500">Analyse des performances du réseau TransUrban</p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+2.3%</span>
              </div>
            </div>
            <div className="text-3xl mb-1">89.5%</div>
            <p className="text-sm text-gray-600">Ponctualité globale</p>
            <Badge variant="outline" className="mt-2 text-xs">Objectif: 90%</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-green-600" />
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+5.8%</span>
              </div>
            </div>
            <div className="text-3xl mb-1">15.2k</div>
            <p className="text-sm text-gray-600">Passagers / jour</p>
            <Badge variant="outline" className="mt-2 text-xs">+880 vs hier</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Train className="h-8 w-8 text-purple-600" />
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+1.2%</span>
              </div>
            </div>
            <div className="text-3xl mb-1">96.3%</div>
            <p className="text-sm text-gray-600">Disponibilité flotte</p>
            <Badge variant="outline" className="mt-2 text-xs">18 / 20 trams</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="flex items-center gap-1 text-red-600">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm">-15%</span>
              </div>
            </div>
            <div className="text-3xl mb-1">9</div>
            <p className="text-sm text-gray-600">Incidents / mois</p>
            <Badge variant="outline" className="mt-2 text-xs">vs 10.6 moy.</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="ponctualite" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ponctualite">Ponctualité</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="ponctualite" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Taux de ponctualité par ligne</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={punctualityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="jour" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="T1" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="T2" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance par ligne</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">T1</Badge>
                      <span>Ligne T1</span>
                    </div>
                    <span className="text-2xl">88.7%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88.7%' }} />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
                    <span>Retard moyen: 3.5 min</span>
                    <span className="text-red-600">-1.3% vs semaine</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">T2</Badge>
                      <span>Ligne T2</span>
                    </div>
                    <span className="text-2xl">90.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90.3%' }} />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
                    <span>Retard moyen: 2.8 min</span>
                    <span className="text-green-600">+0.5% vs semaine</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="mb-3">Objectifs</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Ponctualité ≥ 90%</span>
                      <Badge variant="secondary">En cours</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Retard moyen ≤ 3 min</span>
                      <Badge variant="destructive">Non atteint</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Satisfaction client ≥ 85%</span>
                      <Badge variant="default">Atteint</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des incidents</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={incidentsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="incidents" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par type d'incident</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={typeIncidentsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeIncidentsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl text-red-600 mb-1">35</div>
                  <p className="text-sm text-gray-600">Pannes techniques</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl text-orange-600 mb-1">18 min</div>
                  <p className="text-sm text-gray-600">Temps résolution moy.</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl text-green-600 mb-1">92%</div>
                  <p className="text-sm text-gray-600">Auto-détection</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl text-blue-600 mb-1">4.2</div>
                  <p className="text-sm text-gray-600">Impact retard moy.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance par tranche horaire</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="heure" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="frequence" stroke="#3b82f6" name="Fréquence (min)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="passagers" stroke="#10b981" name="Passagers" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Taux d'occupation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl mb-2">68%</div>
                  <p className="text-sm text-gray-600 mb-4">Taux moyen</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Heures de pointe</span>
                      <Badge variant="destructive">92%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Heures creuses</span>
                      <Badge variant="secondary">44%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efficacité énergétique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl mb-2 text-green-600">A+</div>
                  <p className="text-sm text-gray-600 mb-4">Note globale</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Consommation</span>
                      <span className="text-green-600">-8% vs objectif</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>CO₂ évité</span>
                      <span>1.2k tonnes/an</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfaction client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl mb-2">87%</div>
                  <p className="text-sm text-gray-600 mb-4">Taux de satisfaction</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Très satisfait</span>
                      <span>62%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Satisfait</span>
                      <span>25%</span>
                    </div>
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