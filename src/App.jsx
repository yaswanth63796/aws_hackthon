import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DemoBanner } from './components/DemoBanner';
import { SimulationControlsModal } from './components/SimulationControlsModal';

// Pages
import { Overview } from './pages/Overview';
import { WaterAnalytics } from './pages/WaterAnalytics';
import { LeakAlerts } from './pages/LeakAlerts';
import { Buildings } from './pages/Buildings';
import { Recommendations } from './pages/Recommendations';
import { AboutProject } from './pages/AboutProject';

// Services & Utilities
import { 
  getBuildings, 
  getAlerts, 
  getDemoConfig, 
  acknowledgeAlert, 
  simulateConsumptionSpike, 
  simulateLowTankLevel, 
  simulateNormalUsage, 
  resetDemoState, 
  updateDemoConfig 
} from './services/waterDataService';
import { generateRecommendations } from './utils/recommendationsEngine';
import { calculateCampusSummary } from './utils/calculations';

export function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBuildingId, setSelectedBuildingId] = useState('hostel-a');
  const [buildings, setBuildings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [config, setConfig] = useState(getDemoConfig());
  const [isDemoControlsOpen, setIsDemoControlsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const bList = await getBuildings();
      const aList = await getAlerts();
      setBuildings(bList);
      setAlerts(aList);
    }
    loadData();
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Currently selected building
  const currentBuilding = buildings.find(b => b.id === selectedBuildingId) || buildings[0] || {
    id: 'hostel-a',
    name: 'Hostel A',
    subtitle: 'Undergrad Residents',
    type: 'Student Residence',
    occupancy: 450,
    floors: 4,
    tankCapacityLitres: 50000,
    currentTankLevelPct: 78,
    todayConsumptionLitres: 13850,
    avgDailyConsumptionLitres: 14200,
    status: 'Normal',
    lastUpdated: 'Just now (Simulated)',
    hourlyConsumption: [],
    weeklyConsumption: [],
    monthlyConsumption: [],
    subZones: []
  };

  // Contextual recommendations
  const currentRecommendations = generateRecommendations(currentBuilding, alerts);

  // Campus summary stats
  const campusSummary = calculateCampusSummary(buildings, alerts);

  // Handlers
  const handleSelectBuilding = (id) => {
    setSelectedBuildingId(id);
    showToast(`Switched view to ${buildings.find(b => b.id === id)?.name || id}`);
  };

  const handleAcknowledgeAlert = async (alertId) => {
    const updated = await acknowledgeAlert(alertId);
    setAlerts(updated);
    // Refresh buildings status
    const bList = await getBuildings();
    setBuildings(bList);
    showToast('Alert acknowledged. Moved to historical ledger.');
  };

  const handleSimulateSpike = (buildingId) => {
    const res = simulateConsumptionSpike(buildingId);
    if (res.success) {
      setAlerts(res.alerts);
      setBuildings(prev => prev.map(b => b.id === buildingId ? res.building : b));
      showToast(`Consumption spike (+75%) injected on ${res.building.name}! Rule evaluated.`);
    }
  };

  const handleSimulateLowTank = (buildingId) => {
    const res = simulateLowTankLevel(buildingId, 12);
    if (res.success) {
      setAlerts(res.alerts);
      setBuildings(prev => prev.map(b => b.id === buildingId ? res.building : b));
      showToast(`Simulated reservoir depletion (12%) on ${res.building.name}! Warning active.`);
    }
  };

  const handleSimulateNormal = (buildingId) => {
    const res = simulateNormalUsage(buildingId);
    if (res.success) {
      setAlerts(res.alerts);
      setBuildings(prev => prev.map(b => b.id === buildingId ? res.building : b));
      showToast(`Restored nominal baseline flow for ${res.building.name}.`);
    }
  };

  const handleResetDemo = () => {
    const res = resetDemoState();
    setBuildings(res.buildings);
    setAlerts(res.alerts);
    setConfig(res.config);
    showToast('Demo reset complete. Standard conditions restored.');
  };

  const handleUpdateConfig = (newCfg) => {
    const res = updateDemoConfig(newCfg);
    setConfig(res.config);
    setAlerts(res.alerts);
    showToast('Rule thresholds updated and recalculated.');
  };

  // Page titles and descriptions
  const pageMeta = {
    overview: {
      title: 'Facility Water Overview',
      description: 'Central operational monitoring for campus water storage and distribution telemetry.'
    },
    analytics: {
      title: 'Water Analytics & Trends',
      description: 'Diurnal patterns, hourly flow variations, and multi-facility benchmarking.'
    },
    alerts: {
      title: 'Possible Leak & Anomaly Alerts',
      description: 'Transparent rule-based detection for consumption surges and storage depletion.'
    },
    buildings: {
      title: 'Campus Facility Directory',
      description: 'Facility attributes, tank capacities, and real-time operational statuses.'
    },
    recommendations: {
      title: 'Conservation Action Engine',
      description: 'Contextual facility maintenance checklists triggered by telemetry deviations.'
    },
    about: {
      title: 'About AquaGuard Platform',
      description: 'Environmental Hacks 2026 project overview, prototype design, and AWS roadmap.'
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F9FD] flex text-[#0A192F]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0A192F] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-sky-400/40 flex items-center gap-2 animate-in slide-in-from-bottom-3">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeAlertsCount={campusSummary.activeAlertsCount}
        campusStatus={campusSummary.campusStatus}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        
        {/* Sticky Header */}
        <Header
          pageTitle={pageMeta[activeTab]?.title || 'AquaGuard'}
          pageDescription={pageMeta[activeTab]?.description}
          buildings={buildings}
          selectedBuildingId={selectedBuildingId}
          onSelectBuilding={handleSelectBuilding}
          onOpenDemoControls={() => setIsDemoControlsOpen(true)}
          lastUpdated={currentBuilding.lastUpdated}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          
          {/* Simulated Data Banner */}
          <DemoBanner onOpenDemoControls={() => setIsDemoControlsOpen(true)} />

          {/* Tab Views */}
          {activeTab === 'overview' && (
            <Overview
              building={currentBuilding}
              alerts={alerts}
              recommendations={currentRecommendations}
              config={config}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onNavigate={setActiveTab}
              onOpenDemoControls={() => setIsDemoControlsOpen(true)}
            />
          )}

          {activeTab === 'analytics' && (
            <WaterAnalytics
              allBuildings={buildings}
              currentBuilding={currentBuilding}
              onSelectBuilding={handleSelectBuilding}
            />
          )}

          {activeTab === 'alerts' && (
            <LeakAlerts
              alerts={alerts}
              buildings={buildings}
              selectedBuildingId={selectedBuildingId}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onOpenDemoControls={() => setIsDemoControlsOpen(true)}
            />
          )}

          {activeTab === 'buildings' && (
            <Buildings
              buildings={buildings}
              selectedBuildingId={selectedBuildingId}
              onSelectBuilding={handleSelectBuilding}
              alerts={alerts}
              onNavigate={setActiveTab}
              onOpenDemoControls={() => setIsDemoControlsOpen(true)}
            />
          )}

          {activeTab === 'recommendations' && (
            <Recommendations
              recommendations={currentRecommendations}
              building={currentBuilding}
              buildings={buildings}
              selectedBuildingId={selectedBuildingId}
              onSelectBuilding={handleSelectBuilding}
              activeAlertsCount={alerts.filter(a => a.buildingId === currentBuilding.id && a.status === 'active').length}
            />
          )}

          {activeTab === 'about' && (
            <AboutProject 
              onOpenDemoControls={() => setIsDemoControlsOpen(true)} 
            />
          )}

        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-200/80 bg-white/70 py-4 px-6 text-center text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>AquaGuard — Smart Water Waste Detection & Conservation Platform</span>
            <span className="text-[11px] text-slate-400">Environmental Hacks 2026 • Simulated Prototype • AWS Integration Ready</span>
          </div>
        </footer>

      </div>

      {/* Simulation Controls Modal */}
      <SimulationControlsModal
        isOpen={isDemoControlsOpen}
        onClose={() => setIsDemoControlsOpen(false)}
        buildings={buildings}
        selectedBuildingId={selectedBuildingId}
        onSelectBuilding={handleSelectBuilding}
        onSimulateSpike={handleSimulateSpike}
        onSimulateLowTank={handleSimulateLowTank}
        onSimulateNormal={handleSimulateNormal}
        onResetDemo={handleResetDemo}
        config={config}
        onUpdateConfig={handleUpdateConfig}
      />

    </div>
  );
}

export default App;
