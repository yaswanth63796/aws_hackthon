// AquaGuard Rule-Based Anomaly & Leak Detection Engine
// NOTE: Transparent rule-based evaluation on simulated datasets.
// Never claims physical confirmation; flags anomalies for facility investigation.

/**
 * Checks a building's current readings against historical baseline and thresholds.
 * @param {Object} building - The building object with consumption and tank stats
 * @param {Object} config - Configurable thresholds (leakThresholdPct, lowTankWarningThresholdPct, lowTankCriticalThresholdPct)
 * @returns {Array} List of newly generated alert candidate objects
 */
export function evaluateBuildingAnomalies(building, config) {
  const alerts = [];
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date().toISOString().split('T')[0];
  const simulatedTime = `${dateStr} ${nowStr} (Simulated)`;

  // 1. TANK LEVEL EVALUATION (Low-water detection)
  const tankPct = building.currentTankLevelPct;
  const criticalThreshold = config?.lowTankCriticalThresholdPct ?? 15;
  const warningThreshold = config?.lowTankWarningThresholdPct ?? 25;

  if (tankPct <= criticalThreshold) {
    alerts.push({
      id: `alert-low-${building.id}-${Date.now()}`,
      buildingId: building.id,
      buildingName: building.name,
      type: 'low-water',
      severity: 'Critical',
      title: 'Critical Tank Depletion Warning',
      reason: `Tank level dropped to ${tankPct}% (capacity: ${building.tankCapacityLitres.toLocaleString()} L). Risk of booster pump cavitation and supply interruption.`,
      observedValue: `${tankPct}% (${Math.round((tankPct / 100) * building.tankCapacityLitres).toLocaleString()} L)`,
      baselineValue: `Safe Minimum: > ${warningThreshold}%`,
      thresholdDescription: `Triggered rule: Tank Level <= ${criticalThreshold}% critical threshold`,
      timestamp: simulatedTime,
      status: 'active',
      suggestedAction: 'Immediately inspect main inlet supply valves, verify feeder pump status, and activate secondary reserve or municipal transfer.'
    });
  } else if (tankPct <= warningThreshold) {
    alerts.push({
      id: `alert-low-${building.id}-${Date.now()}`,
      buildingId: building.id,
      buildingName: building.name,
      type: 'low-water',
      severity: 'Warning',
      title: 'Low Water Reserve Advisory',
      reason: `Overhead storage tank reserve is currently at ${tankPct}%, below the ${warningThreshold}% standard advisory reserve.`,
      observedValue: `${tankPct}% (${Math.round((tankPct / 100) * building.tankCapacityLitres).toLocaleString()} L)`,
      baselineValue: `Standard Operating Reserve: > ${warningThreshold}%`,
      thresholdDescription: `Triggered rule: Tank Level <= ${warningThreshold}% warning threshold`,
      timestamp: simulatedTime,
      status: 'active',
      suggestedAction: 'Schedule replenishment pump cycle and monitor evening demand peak.'
    });
  }

  // 2. CONSUMPTION SPIKE EVALUATION (Possible Leak Detection)
  const leakThresholdPct = config?.leakThresholdPct ?? 30;

  // Evaluate the most recent hourly readings
  const hourlyData = building.hourlyConsumption || [];
  if (hourlyData.length > 0) {
    // Check the latest reading or readings with significant positive delta
    const latestReading = hourlyData[hourlyData.length - 1];
    const previousReading = hourlyData.length > 1 ? hourlyData[hourlyData.length - 2] : latestReading;
    
    // Check both latest and preceding for anomalous surges
    const targetReading = (latestReading.consumption - latestReading.baseline > previousReading.consumption - previousReading.baseline)
      ? latestReading
      : previousReading;

    const baseline = targetReading.baseline;
    const actual = targetReading.consumption;
    const diff = actual - baseline;
    const pctDeviation = Math.round((diff / baseline) * 100);

    if (pctDeviation >= leakThresholdPct) {
      let severity = 'Medium';
      if (pctDeviation >= 60) severity = 'Critical';
      else if (pctDeviation >= 40) severity = 'High';

      alerts.push({
        id: `alert-leak-${building.id}-${Date.now()}`,
        buildingId: building.id,
        buildingName: building.name,
        type: 'possible-leak',
        severity: severity,
        title: 'Possible leak — investigation recommended',
        reason: `Observed usage at ${targetReading.hour} reached ${actual.toLocaleString()} L/hr, which is ${pctDeviation}% above the historical baseline of ${baseline.toLocaleString()} L/hr. Consistent flow spikes often correspond to stuck cistern valves, burst pipeline elbows, or unclosed laboratory taps.`,
        observedValue: `${actual.toLocaleString()} L/hr`,
        baselineValue: `${baseline.toLocaleString()} L/hr`,
        thresholdDescription: `Triggered rule: Deviation (+${pctDeviation}%) exceeded configurable threshold (+${leakThresholdPct}%)`,
        timestamp: simulatedTime,
        status: 'active',
        suggestedAction: `Inspect high-traffic washroom risers and kitchen/lab shut-off valves in ${building.name}. Verify no fixtures were left running.`
      });
    }
  }

  // 3. DAILY TOTAL EVALUATION
  if (building.todayConsumptionLitres && building.avgDailyConsumptionLitres) {
    const dailyDeviationPct = Math.round(
      ((building.todayConsumptionLitres - building.avgDailyConsumptionLitres) / building.avgDailyConsumptionLitres) * 100
    );

    if (dailyDeviationPct >= 35 && !alerts.some(a => a.type === 'possible-leak')) {
      alerts.push({
        id: `alert-daily-${building.id}-${Date.now()}`,
        buildingId: building.id,
        buildingName: building.name,
        type: 'possible-leak',
        severity: 'High',
        title: 'Possible continuous loss — abnormal daily volume',
        reason: `Cumulative daily consumption (${building.todayConsumptionLitres.toLocaleString()} L) is running ${dailyDeviationPct}% above typical daily baseline (${building.avgDailyConsumptionLitres.toLocaleString()} L). Continuous baseline drift detected.`,
        observedValue: `${building.todayConsumptionLitres.toLocaleString()} L`,
        baselineValue: `${building.avgDailyConsumptionLitres.toLocaleString()} L`,
        thresholdDescription: `Triggered rule: Total daily volume > 35% above historical mean`,
        timestamp: simulatedTime,
        status: 'active',
        suggestedAction: 'Conduct physical walk-through of ground floor mains and underground storage sumps.'
      });
    }
  }

  return alerts;
}

/**
 * Computes status (Normal, Warning, Critical) for a building based on active alerts and tank level.
 */
export function computeBuildingStatus(building, activeAlerts = []) {
  const buildingAlerts = activeAlerts.filter(a => a.buildingId === building.id && a.status === 'active');
  
  if (buildingAlerts.some(a => a.severity === 'Critical') || building.currentTankLevelPct <= 15) {
    return 'Critical';
  }
  if (buildingAlerts.some(a => a.severity === 'High' || a.severity === 'Warning' || a.severity === 'Medium') || building.currentTankLevelPct <= 25) {
    return 'Warning';
  }
  return 'Normal';
}
