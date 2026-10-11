# AquaGuard — Smart Water Waste Detection & Conservation Platform

> **Tagline:** Detect waste. Protect water. Enable action.  
> **Hackathon:** Environmental Hacks 2026  
> **Track:** Heat & Water  

---

## 1. Problem Statement

College campuses and residential hostels consume hundreds of thousands of litres of water daily. However, abnormal consumption surges, weeping toilet valves, broken pipe joints, and unclosed laboratory taps often go unnoticed for days or weeks. Campus estate engineers and hostel facility managers currently lack an accessible, real-time telemetry interface to identify suspicious patterns, understand baselines, and initiate rapid physical investigations before millions of litres are lost.

---

## 2. Solution Overview

**AquaGuard** is an environmental technology web platform designed for campus facility managers and hostel wardens. It provides:
- Real-time animated overhead tank reserve monitoring.
- Diurnal consumption telemetry and comparative baseline benchmarking.
- Transparent, explainable rule-based leak detection.
- Low-water storage warnings with action recommendations.
- Cross-facility comparative analytics across student residences and academic complexes.
- An interactive live **Demo Simulation Engine** enabling judges and developers to test anomaly detection in real time.

> **Simulated-Data Disclaimer:**  
> This application is a hackathon prototype running on realistic synthetic telemetry. It does not connect to live physical sensors or claim live campus monitoring. All values are labeled as simulated.

---

## 3. Key Functional Features

### 🏢 1. Overview Dashboard
- **Tank Level %:** Animated cylindrical water reservoir graphic displaying volume in litres, available headroom, and visual thresholds.
- **Consumption KPIs:** Today's volume, 30-day baseline average, and deviation percentages.
- **Campus Status:** Computed water operational status: **Normal** (Emerald), **Warning** (Amber), or **Critical** (Rose).
- **Weekly Trend Chart:** Area chart comparing actual consumption against expected historical baseline.
- **Quick Alerts & Actions:** Recent flagged events with instant acknowledge capabilities.

### 🏛️ 2. Campus Building Selector
- **Hostel A:** 450 undergraduate residents, 4 floors, 50,000 L tank capacity.
- **Hostel B:** 310 postgraduate scholars, 3 floors, 35,000 L tank capacity.
- **College Block:** 1,200 daytime academic occupancy, 5 floors, 65,000 L tank capacity.
- Selecting any facility dynamically updates all dashboard metrics, charts, sub-zones, and alert lists.

### 📊 3. Water Analytics
- **Multi-Period Filtering:** 24-Hour (Hourly flow curve), 7-Day (Daily bar comparison), and 30-Day (Weekly aggregates).
- **Cross-Facility Comparison:** Side-by-side benchmarking of today's consumption vs historical baseline across all three buildings.
- **Facility Sub-Zone Distribution:** Monitored usage share across washrooms, dormitories, dining mess scullery, and laboratories.
- **Trend Insights:** Plain-language technical explanations of diurnal peak shifts and nocturnal baseline flows.

### 🚨 4. Possible Leak Anomaly Detection
- **Rule-Based Engine:** Calculates deviation against diurnal baseline:
  $$\Delta \% = \frac{\text{Observed} - \text{Baseline}}{\text{Baseline}} \times 100$$
- When $\Delta \% \ge \text{threshold}$ (default: $+30\%$), generates an actionable alert: *"Possible leak — investigation recommended"*.
- Severity classification: Medium ($+30\%$), High ($+40\%$), Critical ($+60\%$).
- Full transparency: displays observed flow rate, baseline, mathematical rule triggered, and specific pipe risers to inspect.
- **Alert Acknowledgment:** Facility wardens can acknowledge active alerts, preserving audit records in the historical ledger.

### ⚠️ 5. Low-Water Storage Detection
- Monitors storage against configurable thresholds ($25\%$ advisory warning, $15\%$ critical depletion alarm).
- Prevents pump cavitation and dry runs by alerting wardens to schedule replenishment cycles before peak evening demand.

### 🎛️ 6. Live Demo Simulation Controls
Dedicated modal tool allowing instant simulation testing:
- **Simulate Consumption Spike:** Surges flow to $+75\%$ over baseline, triggering the possible leak rule.
- **Simulate Low Tank Level:** Drains simulated tank to $12\%$, triggering the low-water critical alarm.
- **Simulate Normal Usage:** Clears artificial anomalies and restores nominal baseline.
- **Reset Demo:** Restores pristine initial state across all facilities.
- **Custom Threshold Sliders:** Calibrate leak sensitivity and tank reserve cutoffs in real time.

### 💡 7. Context-Aware Recommendations
- Intelligently generates mitigation checklists based on current anomalies (e.g., valve inspections on spikes, booster pump scheduling on low reserves).
- Explains the exact rationale for why each recommendation appeared.
- Includes interactive checkboxes for maintenance walk-throughs.

### ℹ️ 8. About Project & Cloud Architecture
- Deep-dive into institutional water scarcity challenges.
- Stakeholder workflows for hostel wardens and estate engineers.
- Planned AWS cloud pipeline and future ultrasonic IoT hardware sensor roadmap.

---

## 4. Technology Stack

- **Frontend Core:** React 18, Vite 5, JavaScript (ES Modules).
- **Styling & Design System:** Tailwind CSS (Navy `#0A192F` and Water Cyan `#0284C7`), Glassmorphism, Custom Animations.
- **Data Visualization:** Recharts (ResponsiveContainer, AreaChart, BarChart).
- **Iconography:** Lucide React.
- **Data Layer:** Modular service layer (`src/services/waterDataService.js`) with decoupled AWS API client bridge (`src/services/apiClient.js`).

---

## 5. Getting Started & Running Locally

### Prerequisites
- Node.js (v18 or higher recommended; verified on Node.js v22.19.0)
- npm (verified on npm 10.9.3)

### Installation
```bash
# Clone or extract repository
cd AquaGuard

# Install dependencies
npm install
```

### Running Development Server
```bash
# Start local development server
npm run dev
```
Open **http://localhost:3000** in your browser.

### Building for Production
```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

---

## 6. How to Demo AquaGuard (Step-by-Step)

1. **Explore Baseline State:** View the Overview dashboard for **Hostel A**. Notice the 78% tank cylinder and nominal consumption.
2. **Switch Facility:** Click the building selector in the header and choose **College Block**. Observe academic weekday/weekend trend shifts.
3. **Trigger Possible Leak Spike:**
   - Click **Demo Controls** in the header.
   - Click **Trigger Spike**.
   - Notice the toast confirmation and new alert: *"Possible leak — investigation recommended"*.
   - Close modal: observe the updated status badge (**Warning** or **Critical**) and new mitigation advice.
4. **Trigger Low Tank Warning:**
   - Open **Demo Controls**.
   - Click **Drop Tank**.
   - Observe the tank visualizer cylinder turn deep red and drop to 12%.
5. **Acknowledge Alert:**
   - Navigate to the **Leak Alerts** page via the sidebar.
   - Click **Acknowledge** on the active alert. Notice it moves to the **Acknowledged History** ledger.
6. **Reset Demo:**
   - Open **Demo Controls** and click **Reset Demo** to restore all baseline values.

---

## 7. Planned AWS Integration

AquaGuard is built for immediate handoff to an AWS cloud engineer:
- **Architecture:** AWS IoT Core $\rightarrow$ Amazon API Gateway $\rightarrow$ AWS Lambda $\rightarrow$ Amazon DynamoDB $\rightarrow$ Amazon SNS.
- **Documentation:**
  - Complete integration manual: [`docs/AWS_INTEGRATION_GUIDE.md`](./docs/AWS_INTEGRATION_GUIDE.md)
  - Immediate teammate handoff brief: [`AWS_LEAD_HANDOFF.md`](./AWS_LEAD_HANDOFF.md)
  - Architecture breakdown: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
  - Quality assurance report: [`docs/TESTING.md`](./docs/TESTING.md)

---

## 8. Team Contribution Placeholders

- **Frontend Lead & UI/UX Design:** Architecture, responsive React components, Recharts visualizations, simulation controls.
- **Data & Anomaly Detection:** Transparent baseline algorithms, deviation calculations, heuristic recommendation engine.
- **AWS & Cloud Lead:** DynamoDB telemetry schemas, Lambda ingestion functions, API Gateway deployment.
- **Domain & Quality Assurance:** Testing protocols, campus maintenance workflows, environmental documentation.

---

## 9. Limitations & Future Work

- **Current Limitation:** Prototype operates on in-browser simulated models; no physical hardware connected.
- **Phase 2 Roadmap:** Connect non-invasive clamp-on ultrasonic flow sensors (TUF-2000M) and submersible hydrostatic tank sensors via LoRaWAN gateways to AWS IoT Core.
- **Automated Actuation:** Integrate motorized solenoid shut-off valves for emergency remote isolation during major nocturnal pipe bursts.

---

## 10. License

This project is licensed under the MIT License — see the [`LICENSE`](./LICENSE) file for details.
# aws_hackthon
