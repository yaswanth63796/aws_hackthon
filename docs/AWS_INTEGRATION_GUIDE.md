# AquaGuard — AWS Integration Guide

This guide is written for the cloud and backend developer responsible for connecting the AquaGuard frontend prototype to Amazon Web Services (AWS).

---

## 1. Current Frontend Architecture Overview

The AquaGuard frontend is a React 18 single-page application built on Vite and Tailwind CSS.
- Currently, telemetry and alerts are generated locally by `src/data/buildingsData.js` and `src/data/initialAlerts.js`.
- The frontend delegates all data interactions to `src/services/waterDataService.js`.
- The data service uses `src/services/apiClient.js` as an abstracted HTTP client.
- When `VITE_USE_AWS_API=true` is set in `.env`, `waterDataService.js` routes requests directly to the AWS API Gateway URL configured in `VITE_AWS_API_BASE_URL`.

---

## 2. Telemetry & Data Schema Contract

When creating your DynamoDB tables or Lambda payloads, adhere to the following JSON schemas to ensure zero frontend modification:

### 2.1. Building Telemetry Object
```json
{
  "id": "hostel-a",
  "name": "Hostel A",
  "subtitle": "Undergrad Residents (Block A & B)",
  "type": "Student Residence",
  "occupancy": 450,
  "floors": 4,
  "tankCapacityLitres": 50000,
  "currentTankLevelPct": 78,
  "todayConsumptionLitres": 13850,
  "avgDailyConsumptionLitres": 14200,
  "status": "Normal",
  "primaryZone": "North Quad Campus",
  "lastUpdated": "2026-10-11 14:15 UTC",
  "hourlyConsumption": [
    { "hour": "00:00", "consumption": 180, "baseline": 190 },
    { "hour": "02:00", "consumption": 140, "baseline": 150 },
    { "hour": "04:00", "consumption": 160, "baseline": 170 },
    { "hour": "06:00", "consumption": 890, "baseline": 850 },
    { "hour": "08:00", "consumption": 1650, "baseline": 1580 },
    { "hour": "10:00", "consumption": 1420, "baseline": 1390 },
    { "hour": "12:00", "consumption": 1100, "baseline": 1150 },
    { "hour": "14:00", "consumption": 980, "baseline": 950 },
    { "hour": "16:00", "consumption": 1050, "baseline": 1020 },
    { "hour": "18:00", "consumption": 1520, "baseline": 1480 },
    { "hour": "20:00", "consumption": 1780, "baseline": 1720 },
    { "hour": "22:00", "consumption": 920, "baseline": 900 }
  ],
  "weeklyConsumption": [
    { "day": "Mon", "consumption": 14100, "baseline": 14000 },
    { "day": "Tue", "consumption": 14350, "baseline": 14100 },
    { "day": "Wed", "consumption": 13900, "baseline": 14200 },
    { "day": "Thu", "consumption": 14500, "baseline": 14050 },
    { "day": "Fri", "consumption": 14750, "baseline": 14300 },
    { "day": "Sat", "consumption": 13600, "baseline": 13800 },
    { "day": "Sun (Today)", "consumption": 13850, "baseline": 14200 }
  ],
  "monthlyConsumption": [
    { "period": "Week 1", "consumption": 98400, "baseline": 99000 },
    { "period": "Week 2", "consumption": 99800, "baseline": 98500 },
    { "period": "Week 3", "consumption": 97900, "baseline": 99200 },
    { "period": "Week 4", "consumption": 98100, "baseline": 99100 }
  ],
  "subZones": [
    { "name": "Ground Floor Washrooms", "sharePct": 28, "status": "Normal" },
    { "name": "1st & 2nd Floor Dorms", "sharePct": 44, "status": "Normal" },
    { "name": "Mess & Kitchen Scullery", "sharePct": 20, "status": "Normal" },
    { "name": "Laundry & Rooftop Supply", "sharePct": 8, "status": "Normal" }
  ]
}
```

### 2.2. Alert Object
```json
{
  "id": "alert-leak-hostel-a-1760180400000",
  "buildingId": "hostel-a",
  "buildingName": "Hostel A",
  "type": "possible-leak",
  "severity": "High",
  "title": "Possible leak — investigation recommended",
  "reason": "Observed usage at 08:00 reached 2,850 L/hr, which is +80% above the historical baseline of 1,580 L/hr.",
  "observedValue": "2,850 L/hr",
  "baselineValue": "1,580 L/hr",
  "thresholdDescription": "Triggered rule: Deviation (+80%) exceeded threshold (+30%)",
  "timestamp": "2026-10-11 08:15 (UTC)",
  "status": "active",
  "suggestedAction": "Inspect high-traffic washroom risers and kitchen shut-off valves in Hostel A."
}
```

---

## 3. Recommended AWS Service Architecture

Start with a lightweight serverless architecture that can be provisioned in under an hour:

### Phase 1: Minimal Serverless Core (Recommended First Step)
1. **Amazon API Gateway (HTTP API or REST API):**
   - Enables public RESTful interface.
   - Configure CORS: Allow headers `Content-Type`, `x-api-key`, Allow methods `GET`, `POST`, `OPTIONS`.
2. **AWS Lambda (Node.js 20.x or Python 3.11):**
   - `getTelemetryHandler`: Fetches building telemetry and summaries.
   - `getAlertsHandler`: Fetches active and acknowledged anomaly alerts.
   - `acknowledgeAlertHandler`: Updates alert status to `acknowledged`.
3. **Amazon DynamoDB (On-Demand Capacity):**
   - Table 1: `AquaGuard_Buildings` (Partition Key: `id` [String])
   - Table 2: `AquaGuard_Alerts` (Partition Key: `id` [String], GSI: `buildingId-timestamp-index`)

### Phase 2: Telemetry Ingestion (Next Step)
- **AWS IoT Core:** Direct MQTT message broker topic `campus/water/+/telemetry`.
- **AWS IoT Rule Action:** Triggers ingestion Lambda to write new hourly readings into DynamoDB.
- **Amazon SNS:** Publish to `AquaGuard-Alerts-Topic` to dispatch SMS or email to campus maintenance staff when an anomaly is detected.

---

## 4. Suggested REST API Contract

| Method | Endpoint | Description | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/buildings` | Get all campus buildings telemetry | None | Array of `Building` objects |
| `GET` | `/buildings/{id}` | Get telemetry for a specific building | None | Single `Building` object |
| `GET` | `/alerts` | Get all active and acknowledged alerts | None | Array of `Alert` objects |
| `POST` | `/alerts/{id}/acknowledge` | Mark an alert as acknowledged | `{ "acknowledgedBy": "Warden Name" }` | Updated `Alert` object |
| `POST` | `/simulate/spike` | Inject simulated spike for test/eval | `{ "buildingId": "hostel-a" }` | `{ "success": true }` |

---

## 5. Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```bash
# Enable AWS integration in frontend
VITE_USE_AWS_API=true

# API Gateway invoke URL
VITE_AWS_API_BASE_URL=https://<api-id>.execute-api.<region>.amazonaws.com/<stage>

# Optional API Gateway Key (if protected with usage plan)
VITE_AWS_API_KEY=YOUR_API_KEY_HERE

# AWS region
VITE_AWS_REGION=us-east-1
```

> **SECURITY MANDATE:**  
> Never enter AWS IAM Secret Access Keys (`AWS_SECRET_ACCESS_KEY`) or permanent credentials in client-side code or `.env`. Only publish non-sensitive API Gateway endpoints.

---

## 6. Exact Frontend Files for the AWS Lead to Modify

You only need to interact with two files:
1. **`src/services/apiClient.js`:**
   - Already configured to handle headers, API keys, and fetch calls to `VITE_AWS_API_BASE_URL`.
   - Update header schemas if using Amazon Cognito authorizer tokens (`Authorization: Bearer <token>`).
2. **`src/services/waterDataService.js`:**
   - Review functions `getBuildings()`, `getAlerts()`, and `acknowledgeAlert()`.
   - The fallback logic is already written: if an AWS call fails or returns an error, it will cleanly log a warning and fall back to local simulated data without crashing the UI.

---

## 7. How to Run Before and After Integration

### Running Locally (Before Cloud Integration)
```bash
npm install
npm run dev
# Opens at http://localhost:3000 running in local simulated mode
```

### Running with AWS Integration Active
1. Deploy your AWS Lambda & API Gateway stack.
2. In `.env`, set:
   ```env
   VITE_USE_AWS_API=true
   VITE_AWS_API_BASE_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
   ```
3. Restart the dev server:
   ```bash
   npm run dev
   ```
4. Verify telemetry loads from your DynamoDB tables!

---

## 8. AWS Features Not Yet Implemented (Cloud Lead To-Do List)

- [ ] Deploy DynamoDB tables (`AquaGuard_Buildings`, `AquaGuard_Alerts`).
- [ ] Implement Lambda functions for GET `/buildings`, GET `/alerts`, POST `/alerts/{id}/acknowledge`.
- [ ] Set up Amazon API Gateway with CORS enabled for your frontend origin.
- [ ] Configure Amazon SNS topic for warden emergency SMS/Email notifications.
- [ ] Setup AWS Amplify Hosting or S3 + CloudFront distribution for production hosting.
- [ ] (Future IoT Phase): Configure AWS IoT Core MQTT certificates and IoT Rules.
