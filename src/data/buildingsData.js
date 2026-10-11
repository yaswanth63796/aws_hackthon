// AquaGuard Simulated Building Data Module
// All values are realistic synthetic representations for the Environmental Hacks 2026 prototype.
// DISCLAIMER: Simulated data for evaluation and demonstration. No real-time physical sensors attached.

export const INITIAL_BUILDINGS = [
  {
    id: 'hostel-a',
    name: 'Hostel A',
    subtitle: 'Undergrad Residents (Block A & B)',
    type: 'Student Residence',
    occupancy: 450,
    floors: 4,
    tankCapacityLitres: 50000,
    currentTankLevelPct: 78,
    todayConsumptionLitres: 13850,
    avgDailyConsumptionLitres: 14200,
    status: 'Normal', // Normal, Warning, Critical
    primaryZone: 'North Quad Campus',
    lastUpdated: 'Just now (Simulated)',
    hourlyConsumption: [
      { hour: '00:00', consumption: 180, baseline: 190 },
      { hour: '02:00', consumption: 140, baseline: 150 },
      { hour: '04:00', consumption: 160, baseline: 170 },
      { hour: '06:00', consumption: 890, baseline: 850 },
      { hour: '08:00', consumption: 1650, baseline: 1580 },
      { hour: '10:00', consumption: 1420, baseline: 1390 },
      { hour: '12:00', consumption: 1100, baseline: 1150 },
      { hour: '14:00', consumption: 980, baseline: 950 },
      { hour: '16:00', consumption: 1050, baseline: 1020 },
      { hour: '18:00', consumption: 1520, baseline: 1480 },
      { hour: '20:00', consumption: 1780, baseline: 1720 },
      { hour: '22:00', consumption: 920, baseline: 900 },
    ],
    weeklyConsumption: [
      { day: 'Mon', consumption: 14100, baseline: 14000 },
      { day: 'Tue', consumption: 14350, baseline: 14100 },
      { day: 'Wed', consumption: 13900, baseline: 14200 },
      { day: 'Thu', consumption: 14500, baseline: 14050 },
      { day: 'Fri', consumption: 14750, baseline: 14300 },
      { day: 'Sat', consumption: 13600, baseline: 13800 },
      { day: 'Sun (Today)', consumption: 13850, baseline: 14200 },
    ],
    monthlyConsumption: [
      { period: 'Week 1', consumption: 98400, baseline: 99000 },
      { period: 'Week 2', consumption: 99800, baseline: 98500 },
      { period: 'Week 3', consumption: 97900, baseline: 99200 },
      { period: 'Week 4', consumption: 98100, baseline: 99100 },
    ],
    subZones: [
      { name: 'Ground Floor Washrooms', sharePct: 28, status: 'Normal' },
      { name: '1st & 2nd Floor Dorms', sharePct: 44, status: 'Normal' },
      { name: 'Mess & Kitchen Scullery', sharePct: 20, status: 'Normal' },
      { name: 'Laundry & Rooftop Supply', sharePct: 8, status: 'Normal' },
    ]
  },
  {
    id: 'hostel-b',
    name: 'Hostel B',
    subtitle: 'Postgraduate & Scholars Hall',
    type: 'Student Residence',
    occupancy: 310,
    floors: 3,
    tankCapacityLitres: 35000,
    currentTankLevelPct: 62,
    todayConsumptionLitres: 9480,
    avgDailyConsumptionLitres: 9650,
    status: 'Normal',
    primaryZone: 'South Garden Wing',
    lastUpdated: '2 mins ago (Simulated)',
    hourlyConsumption: [
      { hour: '00:00', consumption: 110, baseline: 120 },
      { hour: '02:00', consumption: 90, baseline: 95 },
      { hour: '04:00', consumption: 95, baseline: 100 },
      { hour: '06:00', consumption: 540, baseline: 520 },
      { hour: '08:00', consumption: 1150, baseline: 1120 },
      { hour: '10:00', consumption: 940, baseline: 920 },
      { hour: '12:00', consumption: 760, baseline: 780 },
      { hour: '14:00', consumption: 680, baseline: 690 },
      { hour: '16:00', consumption: 720, baseline: 740 },
      { hour: '18:00', consumption: 1090, baseline: 1060 },
      { hour: '20:00', consumption: 1220, baseline: 1190 },
      { hour: '22:00', consumption: 650, baseline: 640 },
    ],
    weeklyConsumption: [
      { day: 'Mon', consumption: 9600, baseline: 9500 },
      { day: 'Tue', consumption: 9750, baseline: 9600 },
      { day: 'Wed', consumption: 9580, baseline: 9650 },
      { day: 'Thu', consumption: 9800, baseline: 9550 },
      { day: 'Fri', consumption: 9950, baseline: 9700 },
      { day: 'Sat', consumption: 9350, baseline: 9400 },
      { day: 'Sun (Today)', consumption: 9480, baseline: 9650 },
    ],
    monthlyConsumption: [
      { period: 'Week 1', consumption: 67100, baseline: 67500 },
      { period: 'Week 2', consumption: 68200, baseline: 67200 },
      { period: 'Week 3', consumption: 66900, baseline: 67600 },
      { period: 'Week 4', consumption: 67400, baseline: 67400 },
    ],
    subZones: [
      { name: 'Wing 1 Suites', sharePct: 35, status: 'Normal' },
      { name: 'Wing 2 Suites', sharePct: 35, status: 'Normal' },
      { name: 'Dining Hall Pantry', sharePct: 18, status: 'Normal' },
      { name: 'Utility & RO Water Plant', sharePct: 12, status: 'Normal' },
    ]
  },
  {
    id: 'college-block',
    name: 'College Block',
    subtitle: 'Academic & Laboratory Complex',
    type: 'Academic & Admin',
    occupancy: 1200, // Daytime occupancy
    floors: 5,
    tankCapacityLitres: 65000,
    currentTankLevelPct: 83,
    todayConsumptionLitres: 18200,
    avgDailyConsumptionLitres: 18600,
    status: 'Normal',
    primaryZone: 'Central Administrative Core',
    lastUpdated: '1 min ago (Simulated)',
    hourlyConsumption: [
      { hour: '00:00', consumption: 80, baseline: 90 },
      { hour: '02:00', consumption: 60, baseline: 70 },
      { hour: '04:00', consumption: 70, baseline: 80 },
      { hour: '06:00', consumption: 320, baseline: 300 },
      { hour: '08:00', consumption: 1890, baseline: 1800 },
      { hour: '10:00', consumption: 2450, baseline: 2400 },
      { hour: '12:00', consumption: 2780, baseline: 2750 },
      { hour: '14:00', consumption: 2310, baseline: 2350 },
      { hour: '16:00', consumption: 1980, baseline: 1950 },
      { hour: '18:00', consumption: 920, baseline: 900 },
      { hour: '20:00', consumption: 430, baseline: 420 },
      { hour: '22:00', consumption: 160, baseline: 150 },
    ],
    weeklyConsumption: [
      { day: 'Mon', consumption: 19200, baseline: 18800 },
      { day: 'Tue', consumption: 19500, baseline: 18900 },
      { day: 'Wed', consumption: 19100, baseline: 18700 },
      { day: 'Thu', consumption: 18800, baseline: 18600 },
      { day: 'Fri', consumption: 19300, baseline: 18900 },
      { day: 'Sat', consumption: 8200, baseline: 8500 }, // Weekend drop
      { day: 'Sun (Today)', consumption: 5400, baseline: 5800 },
    ],
    monthlyConsumption: [
      { period: 'Week 1', consumption: 110200, baseline: 109500 },
      { period: 'Week 2', consumption: 111400, baseline: 110000 },
      { period: 'Week 3', consumption: 109800, baseline: 109800 },
      { period: 'Week 4', consumption: 110800, baseline: 110100 },
    ],
    subZones: [
      { name: 'Chemistry & Bio Labs', sharePct: 32, status: 'Normal' },
      { name: 'Ground & 1st Floor Restrooms', sharePct: 30, status: 'Normal' },
      { name: 'Faculty & Administrative Wing', sharePct: 22, status: 'Normal' },
      { name: 'Central Air Cooling & Garden', sharePct: 16, status: 'Normal' },
    ]
  }
];

// Threshold configuration constants
export const DEFAULT_CONFIG = {
  leakThresholdPct: 30, // % above baseline to flag as possible leak
  lowTankWarningThresholdPct: 25, // % tank level warning
  lowTankCriticalThresholdPct: 15, // % tank level critical alert
  highUsageDeviationPct: 20, // % usage deviation consideration
};
