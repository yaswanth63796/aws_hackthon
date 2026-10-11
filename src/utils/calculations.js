// AquaGuard Calculation & Metrics Utilities

/**
 * Formats a number with comma separators and optional unit
 */
export function formatLitres(litres, unit = 'L') {
  if (litres === undefined || litres === null) return '0 L';
  return `${Number(litres).toLocaleString()} ${unit}`;
}

/**
 * Calculates aggregate campus metrics across all buildings
 */
export function calculateCampusSummary(buildings = [], alerts = []) {
  const totalTodayConsumption = buildings.reduce((acc, b) => acc + (b.todayConsumptionLitres || 0), 0);
  const totalAvgDaily = buildings.reduce((acc, b) => acc + (b.avgDailyConsumptionLitres || 0), 0);
  const totalCapacity = buildings.reduce((acc, b) => acc + (b.tankCapacityLitres || 0), 0);
  const totalWaterStored = buildings.reduce(
    (acc, b) => acc + Math.round(((b.currentTankLevelPct || 0) / 100) * (b.tankCapacityLitres || 0)),
    0
  );
  const avgTankLevelPct = totalCapacity > 0 ? Math.round((totalWaterStored / totalCapacity) * 100) : 0;
  
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const acknowledgedAlerts = alerts.filter(a => a.status === 'acknowledged');
  
  const criticalCount = activeAlerts.filter(a => a.severity === 'Critical').length;
  const warningCount = activeAlerts.filter(a => a.severity === 'High' || a.severity === 'Warning' || a.severity === 'Medium').length;

  let campusStatus = 'Normal';
  if (criticalCount > 0 || avgTankLevelPct <= 20) {
    campusStatus = 'Critical';
  } else if (warningCount > 0 || avgTankLevelPct <= 35) {
    campusStatus = 'Warning';
  }

  return {
    totalTodayConsumption,
    totalAvgDaily,
    totalCapacity,
    totalWaterStored,
    avgTankLevelPct,
    activeAlertsCount: activeAlerts.length,
    acknowledgedAlertsCount: acknowledgedAlerts.length,
    criticalCount,
    warningCount,
    campusStatus
  };
}

/**
 * Computes difference and percentage change between actual and baseline
 */
export function computeDeviation(actual, baseline) {
  if (!baseline || baseline === 0) return { diff: 0, pct: 0 };
  const diff = actual - baseline;
  const pct = Number(((diff / baseline) * 100).toFixed(1));
  return { diff, pct };
}
