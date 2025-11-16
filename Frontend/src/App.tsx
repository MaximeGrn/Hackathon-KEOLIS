import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ConducteursPage } from './components/ConducteursPage';
import { PlanningPage } from './components/PlanningPage';
import { ReseauPage } from './components/ReseauPage';
import { IncidentsPage } from './components/IncidentsPage';
import { KPIPage } from './components/KPIPage';
import { PredictionPage } from './components/PredictionPage';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/conducteurs" element={<ConducteursPage />} />
            <Route path="/planning" element={<PlanningPage />} />
            <Route path="/reseau" element={<ReseauPage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/kpi" element={<KPIPage />} />
            <Route path="/prediction" element={<PredictionPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}