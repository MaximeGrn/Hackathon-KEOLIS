import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Train, Users, AlertTriangle, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const statsData = [
  { title: 'Trams en service', value: '18', total: '20', icon: Train, change: '+2', trend: 'up', color: 'text-blue-600' },
  { title: 'Conducteurs actifs', value: '22', total: '24', icon: Users, change: '-1', trend: 'down', color: 'text-green-600' },
  { title: 'Incidents actifs', value: '2', total: '', icon: AlertTriangle, change: '+1', trend: 'up', color: 'text-red-600' },
  { title: 'Retard moyen', value: '3.2min', total: '', icon: Clock, change: '-0.5', trend: 'down', color: 'text-orange-600' },
];

const activeIncidents = [
  { id: 1, ligne: 'T1', description: 'Panne technique Station République', severity: 'high', time: '14:32', status: 'En cours' },
  { id: 2, ligne: 'T2', description: 'Retard mineur - Affluence élevée', severity: 'low', time: '15:10', status: 'Surveillance' },
];

const recentActivities = [
  { id: 1, action: 'Conducteur Martin J. assigné à Tram T1-05', time: '15:45', type: 'assignment' },
  { id: 2, action: 'Incident résolu: Ligne T1 - Station Erasme', time: '15:30', type: 'resolved' },
  { id: 3, action: 'Tram T2-08 mis en maintenance', time: '14:55', type: 'maintenance' },
  { id: 4, action: 'Réorganisation trafic ligne T2 effectuée', time: '14:40', type: 'traffic' },
];

export function Dashboard() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1>Tableau de bord</h1>
        <p className="text-gray-500">Vue d'ensemble du réseau Divia - Lignes T1 & T2</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
                  {stat.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl">{stat.value}</span>
                  {stat.total && <span className="text-gray-500">/ {stat.total}</span>}
                </div>
                <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Incidents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Incidents actifs</span>
              <Link to="/incidents">
                <Button variant="ghost" size="sm">Voir tout</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeIncidents.map((incident) => (
              <Alert key={incident.id} variant={incident.severity === 'high' ? 'destructive' : 'default'}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={incident.ligne === 'T1' ? 'default' : 'secondary'}>
                        {incident.ligne}
                      </Badge>
                      <span className="text-sm text-gray-500">{incident.time}</span>
                    </div>
                    <AlertDescription>{incident.description}</AlertDescription>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {incident.status}
                      </Badge>
                    </div>
                  </div>
                  <Link to="/incidents">
                    <Button variant="ghost" size="sm">Gérer</Button>
                  </Link>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0 last:pb-0">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    activity.type === 'resolved' ? 'bg-green-500' :
                    activity.type === 'assignment' ? 'bg-blue-500' :
                    activity.type === 'maintenance' ? 'bg-orange-500' :
                    'bg-purple-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/incidents">
              <Button variant="outline" className="w-full">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Signaler incident
              </Button>
            </Link>
            <Link to="/planning">
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Assigner conducteur
              </Button>
            </Link>
            <Link to="/reseau">
              <Button variant="outline" className="w-full">
                <Train className="h-4 w-4 mr-2" />
                Voir réseau
              </Button>
            </Link>
            <Link to="/kpi">
              <Button variant="outline" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Consulter KPI
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}