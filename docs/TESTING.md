# AquaGuard — Testing & Quality Assurance Report

**Platform:** AquaGuard — Smart Water Waste Detection & Conservation Platform  
**Environment:** Windows 11, Node.js v22.19.0, npm 10.9.3, Vite 5.4.21  
**Test Date:** October 11, 2026  

---

## 1. Test Summary

| Test Category | Scope | Status | Notes |
| :--- | :--- | :---: | :--- |
| **Dependency Resolution** | `npm install` | ✅ PASSED | All dependencies installed cleanly with zero conflicts. |
| **Production Build** | `npm run build` | ✅ PASSED | Vite build finished in 5.50s; bundle generated under `dist/`. |
| **Development Server** | `npm run dev` | ✅ PASSED | Vite server running at `http://localhost:3000/`. |
| **HTTP Response** | `GET http://localhost:3000/` | ✅ PASSED | Returns `HTTP 200 OK` with full HTML layout. |
| **Building Switching** | Dynamic state updates | ✅ PASSED | Switching between Hostel A, Hostel B, and College Block updates all cards, charts, and tanks. |
| **Spike Simulation** | Rule-based leak detection | ✅ PASSED | Injected +75% surge triggers "Possible leak — investigation recommended" alert. |
| **Low-Tank Simulation** | Water depletion warning | ✅ PASSED | Draining reservoir to 12% triggers Critical Low Water Warning and visual cylinder animation. |
| **Alert Lifecycle** | Acknowledge action | ✅ PASSED | Acknowledging an active alert moves it to historical ledger with warden timestamp. |
| **Demo Reset** | Baseline restoration | ✅ PASSED | Restores default parameters and alerts with zero state pollution. |
| **Navigation & Links** | 6 sidebar sections | ✅ PASSED | All 6 navigation tabs route cleanly without reload or broken links. |

---

## 2. Detailed Test Cases & Execution Logs

### TC-01: Production Build Compilation
- **Command:** `npm run build`
- **Output:**
  ```text
  vite v5.4.21 building for production...
  transforming...
  ✓ 2394 modules transformed.
  rendering chunks...
  computing gzip size...
  dist/index.html                   1.29 kB │ gzip:   0.71 kB
  dist/assets/index-Jis07yC5.css   39.78 kB │ gzip:   7.03 kB
  dist/assets/index-DbPgDfKK.js   644.79 kB │ gzip: 180.10 kB
  ✓ built in 5.50s
  ```
- **Verification:** Exit code 0, complete bundle produced in `dist/`.

### TC-02: HTTP Server Readiness
- **Command:** `Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing`
- **Output:** `StatusCode: 200 OK`
- **Verification:** Application is serving properly.

### TC-03: Multi-Facility Telemetry Reactivity
- **Procedure:**
  1. Default facility loads as Hostel A (Tank: 78%, Consumption: 13,850 L).
  2. Select `Hostel B` in header dropdown.
  3. UI reactively updates: Tank level shifts to 62%, today's consumption updates to 9,480 L, sub-zones update to Wing 1 & 2 suites.
  4. Select `College Block` in header dropdown.
  5. UI updates: Tank level shifts to 83%, today's consumption updates to 18,200 L, weekend drop profile is reflected on charts.

### TC-04: Consumption Surge & Possible Leak Anomaly Injection
- **Procedure:**
  1. Open Demo Controls modal (`Test Scenarios`).
  2. Click `Trigger Spike` on Hostel A.
  3. Hourly flow rate surges to +75% above baseline (1,750 L/hr vs 1,000 L/hr base).
  4. Anomaly engine executes rule: $\text{Deviation} \ge 30\% \implies \text{Possible Leak}$.
  5. New alert created: "Possible leak — investigation recommended" with Critical/High severity.
  6. Toast notification confirms alert creation.
  7. Recommendations engine immediately updates to recommend pipeline and riser audit.

### TC-05: Low Tank Level Anomaly Injection
- **Procedure:**
  1. Open Demo Controls modal.
  2. Click `Drop Tank` on target building.
  3. Tank level falls to 12% capacity.
  4. Anomaly engine executes rule: $\text{Level} \le 15\% \implies \text{Critical Low Water Alarm}$.
  5. Tank cylinder visualizer shifts color from Cyan to Deep Red with flashing wave warning.
  6. Storage alert appears in recent alerts and alert ledger.

### TC-06: Alert Acknowledgment Workflow
- **Procedure:**
  1. Navigate to `Leak Alerts` page.
  2. Filter by `Active Alerts`.
  3. Click `Acknowledge` on active alert.
  4. Alert transitions to `Acknowledged History` tab with status timestamp (`2026-10-11 ... (Simulated)`).
  5. Sidebar active badge decrement occurs immediately.

### TC-07: Interactive Demo Reset
- **Procedure:**
  1. Open Demo Controls modal.
  2. Click `Reset Demo to Initial State`.
  3. In-memory state wipes injected test anomalies and restores default baseline values.
  4. Facility status returns to `Normal`.

---

## 3. Usability & UI/UX Audit
- **Zero dead buttons:** All interactive controls (tabs, dropdowns, modal triggers, checkboxes, acknowledge buttons) trigger visible state updates.
- **No placeholder images:** Native vector SVG graphics and Lucide iconography utilized throughout.
- **Visual hierarchy:** High contrast typography (Deep Navy `#0A192F` against Light Blue `#F4F9FD`), color-coded status badges, and smooth fluid animations.
- **Simulated data transparency:** Visibly highlighted in Header, Top Banner, Tank Visualizer, and About Project page.
