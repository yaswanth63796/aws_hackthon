// AquaGuard Context-Aware Recommendation Engine
// Generates rule-driven conservation suggestions based on building readings and alert states.
// NOTE: Recommendations represent facility guidance; no real-world automated savings claimed.

export function generateRecommendations(building, activeAlerts = []) {
  const recommendations = [];
  const buildingAlerts = activeAlerts.filter(a => a.buildingId === building.id && a.status === 'active');
  const hasLeakAlert = buildingAlerts.some(a => a.type === 'possible-leak');
  const hasLowTankAlert = buildingAlerts.some(a => a.type === 'low-water') || building.currentTankLevelPct <= 25;
  const isUsageElevated = building.todayConsumptionLitres > building.avgDailyConsumptionLitres;

  // 1. SPIKE / LEAK DETECTED RECOMMENDATION
  if (hasLeakAlert) {
    const leakAlert = buildingAlerts.find(a => a.type === 'possible-leak');
    recommendations.push({
      id: `rec-leak-${building.id}`,
      priority: 'Urgent',
      category: 'Pipeline & Valve Audit',
      title: 'Inspect Pressure Valves & High-Traffic Riser Lines',
      action: `Deploy maintenance team to examine isolation valves and washroom risers in ${building.name}.`,
      whyTriggered: `An active consumption anomaly (${leakAlert?.observedValue || 'elevated flow'} vs baseline) was detected. Rapid isolation prevents major water loss and basement seepage.`,
      targetFacility: building.subZones ? building.subZones[0].name : 'Primary Distribution Riser',
      steps: [
        'Perform visual check on overhead flush valve banks on all floors.',
        'Inspect mechanical joint couplings on main downcomers.',
        'Verify float valves on secondary break-tanks.'
      ]
    });
  }

  // 2. LOW TANK LEVEL RECOMMENDATION
  if (hasLowTankAlert) {
    recommendations.push({
      id: `rec-tank-${building.id}`,
      priority: building.currentTankLevelPct <= 15 ? 'Critical' : 'High',
      category: 'Storage & Supply Refill',
      title: 'Verify Inflow Rate and Adjust Pumping Timetable',
      action: `Review the borehole supply pump timing and confirm feeder line inlet pressure for ${building.name}.`,
      whyTriggered: `Tank level is currently at ${building.currentTankLevelPct}% (below the ${building.currentTankLevelPct <= 15 ? '15% critical' : '25% advisory'} limit). Continued consumption without refill may cause suction airlocks in centrifugal pumps.`,
      targetFacility: 'Overhead Storage Reservoir & Pump Station',
      steps: [
        'Check central pump house switchboard for feeder motor trip status.',
        'Verify electrical float switch sensor on the rooftop tank.',
        'Prioritize refill cycle during off-peak campus utility rates.'
      ]
    });
  }

  // 3. ELEVATED DAILY USAGE COMPARISON
  if (isUsageElevated) {
    const diff = building.todayConsumptionLitres - building.avgDailyConsumptionLitres;
    const diffPct = Math.round((diff / building.avgDailyConsumptionLitres) * 100);
    recommendations.push({
      id: `rec-high-usage-${building.id}`,
      priority: 'Medium',
      category: 'Consumption Analysis',
      title: 'Audit Peak Operational Zones & High-Volume Fixtures',
      action: `Compare today's hourly timeline against previous 7-day average to isolate non-routine usage spikes.`,
      whyTriggered: `Today's simulated volume is running +${diffPct}% (+${diff.toLocaleString()} L) above the 30-day baseline average (${building.avgDailyConsumptionLitres.toLocaleString()} L).`,
      targetFacility: building.subZones && building.subZones[1] ? building.subZones[1].name : 'Common Facilities',
      steps: [
        'Review kitchen/scullery cleaning shifts and laundry timings.',
        'Check for auto-fill systems stuck in bypass mode.',
        'Encourage resident awareness during morning peak periods.'
      ]
    });
  }

  // 4. PREVENTATIVE / ROUTINE CONSERVATION RECOMMENDATION (Always present)
  recommendations.push({
    id: `rec-preventative-${building.id}`,
    priority: 'Preventative',
    category: 'Preventative Maintenance',
    title: 'Acoustic / Visual Inspection of Common Wet-Wall Risers',
    action: `Conduct weekly preventative walk-through during quiet hours (23:00 - 05:00) when background usage is minimal.`,
    whyTriggered: `Regular acoustic inspections detect silent weeping toilet valves and pinhole copper pipe corrosion before they manifest as critical alerts.`,
    targetFacility: 'Vertical Shafts & External Concealed Drainage',
    steps: [
      'Record nighttime baseline meter reading before dormitory lockdown.',
      'Check external drainage gullies for continuous trickling.',
      'Log aerator cleaning schedule on communal sinks.'
    ]
  });

  // 5. ZONE SPECIFIC RECOMMENDATION
  if (building.id === 'college-block') {
    recommendations.push({
      id: `rec-labs-${building.id}`,
      priority: 'Medium',
      category: 'Facility Protocol',
      title: 'Enforce Laboratory Water Conservation Protocols',
      action: 'Ensure cooling condenser loops and autoclave drain lines are turned off at end-of-day.',
      whyTriggered: 'Academic blocks experience high daytime laboratory water demand; unmonitored aspirator taps account for significant weekend waste.',
      targetFacility: 'Chemistry & Biology Research Wings',
      steps: [
        'Verify lab technician checklist at 17:00 closing.',
        'Install flow-restrictive aerators on laboratory wash basins.',
        'Inspect distilled water unit condenser discharge.'
      ]
    });
  } else {
    recommendations.push({
      id: `rec-hostel-mess-${building.id}`,
      priority: 'Low',
      category: 'Culinary & Dining',
      title: 'Hostel Dining Hall & Dishwashing Rinse Optimization',
      action: 'Install foot-pedal or sensor valves on heavy-use utensil washing sinks.',
      whyTriggered: 'Mess cleaning cycles represent approximately 18–22% of total residential water volume.',
      targetFacility: 'Mess Scullery & Wash Areas',
      steps: [
        'Provide dual-basin soaking stations for dish pre-rinsing.',
        'Inspect industrial grease trap bypass and backwash lines.'
      ]
    });
  }

  return recommendations;
}
