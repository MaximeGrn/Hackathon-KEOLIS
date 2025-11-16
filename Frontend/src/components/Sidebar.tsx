import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Map, AlertTriangle, BarChart3, TrendingUp, ChevronLeft, ChevronRight, Train } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Conducteurs', href: '/conducteurs', icon: Users },
  { name: 'Planning', href: '/planning', icon: Calendar },
  { name: 'Réseau', href: '/reseau', icon: Map },
  { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
  { name: 'KPI', href: '/kpi', icon: BarChart3 },
  { name: 'Prédiction', href: '/prediction', icon: TrendingUp },
];

export function Sidebar({ open, setOpen }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ${open ? 'w-64' : 'w-16'}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {open && (
            <div className="flex items-center gap-2">
              <Train className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">Réseau Divia</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(!open)}
            className="h-8 w-8 p-0"
          >
            {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {open && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {open && (
            <div className="text-xs text-gray-500">
              <div>Lignes T1 & T2</div>
              <div className="text-green-600 mt-1">● Système opérationnel</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}