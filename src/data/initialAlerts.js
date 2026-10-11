// Initial alerts dataset for AquaGuard
// Transparent rule-based simulation. All alerts are tagged as simulated.

export const INITIAL_ALERTS = [
  {
    id: 'alt-prev-001',
    buildingId: 'hostel-b',
    buildingName: 'Hostel B',
    type: 'possible-leak', // 'possible-leak' | 'low-water' | 'high-consumption'
    severity: 'Medium', // 'Low' | 'Medium' | 'High' | 'Critical'
    title: 'Possible leak — investigation recommended',
    reason: 'Hourly consumption exceeded baseline by +34% during overnight hours (02:00 - 04:00). Possible tap dripping or valve failure in 2nd floor restrooms.',
    observedValue: '380 L/hr',
    baselineValue: '95 L/hr',
    thresholdDescription: 'Flagged: Deviation > 30% above historical night baseline',
    timestamp: '2026-10-10 03:45 (Simulated)',
    status: 'acknowledged', // 'active' | 'acknowledged'
    acknowledgedAt: '2026-10-10 07:15 (Simulated)',
    acknowledgedBy: 'Facility Maintenance Officer',
    suggestedAction: 'Check 2nd floor restroom shut-off valves and float balls.'
  },
  {
    id: 'alt-prev-002',
    buildingId: 'college-block',
    buildingName: 'College Block',
    type: 'low-water',
    severity: 'Medium',
    title: 'Low tank water reserve detected',
    reason: 'Overhead reserve tank reached 24% capacity following heavy afternoon laboratory usage before scheduled replenishment.',
    observedValue: '24% (15,600 L)',
    baselineValue: 'Min recommended: 25%',
    thresholdDescription: 'Flagged: Tank level fell below warning threshold (25%)',
    timestamp: '2026-10-09 16:30 (Simulated)',
    status: 'acknowledged',
    acknowledgedAt: '2026-10-09 17:00 (Simulated)',
    acknowledgedBy: 'Central Campus Pump Operator',
    suggestedAction: 'Trigger supplementary pump from borehole reserve 2.'
  }
];
