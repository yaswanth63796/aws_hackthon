// AquaGuard Central Water Data Service
// Manages simulated telemetry, anomaly detection trigger rules, alert history, and AWS bridge.

import { INITIAL_BUILDINGS, DEFAULT_CONFIG } from '../data/buildingsData';
import { INITIAL_ALERTS } from '../data/initialAlerts';
import { evaluateBuildingAnomalies, computeBuildingStatus } from '../utils/anomalyDetection';
import { apiRequest, isAwsIntegrationActive } from './apiClient';

// In-memory runtime state for local prototype simulation
let runtimeBuildings = JSON.parse(JSON.stringify(INITIAL_BUILDINGS));
let runtimeAlerts = JSON.parse(JSON.stringify(INITIAL_ALERTS));
let runtimeConfig = { ...DEFAULT_CONFIG };

/**
 * Returns all buildings with up-to-date computed statuses
 */
export async function getBuildings() {
  if (isAwsIntegrationActive()) {
    try {
      const data = await apiRequest('/buildings');
      return data;
    } catch (err) {
      console.warn('[WaterDataService] AWS fetch failed, falling back to local simulation:', err);
    }
  }

  // Local simulated computation
  return runtimeBuildings.map(b => ({
    ...b,
    status: computeBuildingStatus(b, runtimeAlerts)
  }));
}

/**
 * Returns a specific building by ID
 */
export async function getBuildingById(id) {
  const buildings = await getBuildings();
  return buildings.find(b => b.id === id) || buildings[0];
}

/**
 * Returns all active and historical alerts
 */
export async function getAlerts() {
  if (isAwsIntegrationActive()) {
    try {
      return await apiRequest('/alerts');
    } catch (err) {
      console.warn('[WaterDataService] AWS alerts fetch failed, falling back to local simulation:', err);
    }
  }
  return [...runtimeAlerts];
}

/**
 * Acknowledges an alert
 */
export async function acknowledgeAlert(alertId, acknowledgedBy = 'Campus Facilities Warden') {
  if (isAwsIntegrationActive()) {
    try {
      return await apiRequest(`/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        body: JSON.stringify({ acknowledgedBy })
      });
    } catch (err) {
      console.warn('[WaterDataService] AWS acknowledge failed, using local simulation:', err);
    }
  }

  const alertIndex = runtimeAlerts.findIndex(a => a.id === alertId);
  if (alertIndex !== -1) {
    runtimeAlerts[alertIndex] = {
      ...runtimeAlerts[alertIndex],
      status: 'acknowledged',
      acknowledgedAt: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Simulated)`,
      acknowledgedBy
    };
  }
  return [...runtimeAlerts];
}

/**
 * Simulates a high consumption spike on a building (Reliably triggers possible leak rule)
 */
export function simulateConsumptionSpike(buildingId) {
  const building = runtimeBuildings.find(b => b.id === buildingId);
  if (!building) return { success: false };

  // Inflate current hour's consumption to +75% over baseline
  const hourly = building.hourlyConsumption;
  if (hourly.length > 0) {
    const lastIndex = hourly.length - 1;
    const base = hourly[lastIndex].baseline;
    // 75% spike
    hourly[lastIndex].consumption = Math.round(base * 1.75);
    if (hourly.length > 1) {
      hourly[lastIndex - 1].consumption = Math.round(hourly[lastIndex - 1].baseline * 1.6);
    }
  }

  // Elevate today's consumption
  building.todayConsumptionLitres = Math.round(building.avgDailyConsumptionLitres * 1.38);
  building.lastUpdated = `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Spike Simulated)`;

  // Evaluate anomaly rules and generate new alert
  const newAlerts = evaluateBuildingAnomalies(building, runtimeConfig);
  newAlerts.forEach(newAlt => {
    // Check if duplicate already active
    const exists = runtimeAlerts.some(
      a => a.buildingId === newAlt.buildingId && a.type === newAlt.type && a.status === 'active'
    );
    if (!exists) {
      runtimeAlerts.unshift(newAlt);
    }
  });

  building.status = computeBuildingStatus(building, runtimeAlerts);
  return { success: true, building, alerts: [...runtimeAlerts] };
}

/**
 * Simulates low tank level (Reliably triggers low-water warning or critical alert)
 */
export function simulateLowTankLevel(buildingId, targetPct = 12) {
  const building = runtimeBuildings.find(b => b.id === buildingId);
  if (!building) return { success: false };

  building.currentTankLevelPct = targetPct;
  building.lastUpdated = `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Low-Tank Simulated)`;

  // Evaluate anomaly rules
  const newAlerts = evaluateBuildingAnomalies(building, runtimeConfig);
  newAlerts.forEach(newAlt => {
    const exists = runtimeAlerts.some(
      a => a.buildingId === newAlt.buildingId && a.type === newAlt.type && a.status === 'active'
    );
    if (!exists) {
      runtimeAlerts.unshift(newAlt);
    }
  });

  building.status = computeBuildingStatus(building, runtimeAlerts);
  return { success: true, building, alerts: [...runtimeAlerts] };
}

/**
 * Simulates normal usage (Clears artificial anomalies for the selected building)
 */
export function simulateNormalUsage(buildingId) {
  const original = INITIAL_BUILDINGS.find(b => b.id === buildingId);
  const targetIndex = runtimeBuildings.findIndex(b => b.id === buildingId);

  if (original && targetIndex !== -1) {
    runtimeBuildings[targetIndex] = JSON.parse(JSON.stringify(original));
    runtimeBuildings[targetIndex].lastUpdated = `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Normal Simulated)`;

    // Automatically resolve/acknowledge active alerts for this building
    runtimeAlerts = runtimeAlerts.map(a => {
      if (a.buildingId === buildingId && a.status === 'active') {
        return {
          ...a,
          status: 'acknowledged',
          acknowledgedAt: 'Auto-resolved during Normal Usage Simulation',
          acknowledgedBy: 'System Auto-Normalizer'
        };
      }
      return a;
    });

    runtimeBuildings[targetIndex].status = 'Normal';
  }

  return { success: true, building: runtimeBuildings[targetIndex], alerts: [...runtimeAlerts] };
}

/**
 * Fully resets demo to initial state
 */
export function resetDemoState() {
  runtimeBuildings = JSON.parse(JSON.stringify(INITIAL_BUILDINGS));
  runtimeAlerts = JSON.parse(JSON.stringify(INITIAL_ALERTS));
  runtimeConfig = { ...DEFAULT_CONFIG };
  return {
    buildings: [...runtimeBuildings],
    alerts: [...runtimeAlerts],
    config: { ...runtimeConfig }
  };
}

/**
 * Returns current configuration
 */
export function getDemoConfig() {
  return { ...runtimeConfig };
}

/**
 * Updates configuration (e.g., custom leak threshold or low tank threshold)
 */
export function updateDemoConfig(newConfig) {
  runtimeConfig = { ...runtimeConfig, ...newConfig };
  // Re-evaluate all buildings
  runtimeBuildings.forEach(b => {
    const generated = evaluateBuildingAnomalies(b, runtimeConfig);
    generated.forEach(g => {
      if (!runtimeAlerts.some(a => a.buildingId === g.buildingId && a.type === g.type && a.status === 'active')) {
        runtimeAlerts.unshift(g);
      }
    });
    b.status = computeBuildingStatus(b, runtimeAlerts);
  });
  return { config: { ...runtimeConfig }, alerts: [...runtimeAlerts] };
}
