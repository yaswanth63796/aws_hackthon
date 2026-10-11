# AquaGuard — AWS Teammate Handoff Briefing

**Welcome to the AquaGuard Project!**  
This document is prepared specifically for the AWS / Cloud lead developer who will integrate cloud persistence and API endpoints into this working hackathon prototype.

---

## 1. Executive Summary & Current State

- **Current Status:** 100% working, standalone frontend prototype built with React 18, Vite, Tailwind CSS, Recharts, and Lucide React.
- **Local Simulation:** All campus water readings, tank volumes, diurnal hourly charts, and leak alerts are presently generated and evaluated inside `src/services/waterDataService.js`.
- **Decoupled Architecture:** The UI is completely isolated from the data layer. You do NOT need to rewrite UI components or charts. You only need to plug in your AWS API endpoints.
- **Fail-Safe Mode:** If an AWS request fails or your API is temporarily offline, the frontend automatically falls back to local simulated data with zero UI crashes.

---

## 2. Where the Data Currently Lives

- **Building Telemetry:** `src/data/buildingsData.js` (Hostel A, Hostel B, College Block).
- **Historical Alerts:** `src/data/initialAlerts.js` (Sample acknowledged anomalies).
- **Simulation & Anomaly Logic:** `src/utils/anomalyDetection.js` and `src/services/waterDataService.js`.

---

## 3. Recommended AWS Service Setup (Phase 1)

We recommend starting with a serverless architecture:

```
[React Frontend]
       │
       ▼ (HTTPS REST / JSON)
[Amazon API Gateway] (HTTP or REST API)
       │
       ▼ (Lambda Proxy Integration)
[AWS Lambda Function] (Node.js 20.x or Python 3.11)
       │
       ▼ (Read / Write)
[Amazon DynamoDB] (Tables: AquaGuard_Buildings & AquaGuard_Alerts)
```

### Table 1: `AquaGuard_Buildings`
- **Primary Partition Key:** `id` (String, e.g., `'hostel-a'`, `'hostel-b'`, `'college-block'`)
- **Attributes:** `name`, `tankCapacityLitres`, `currentTankLevelPct`, `todayConsumptionLitres`, `avgDailyConsumptionLitres`, `hourlyConsumption`, `weeklyConsumption`, `monthlyConsumption`, `subZones`

### Table 2: `AquaGuard_Alerts`
- **Primary Partition Key:** `id` (String, e.g., `'alert-leak-hostel-a-12345678'`)
- **Global Secondary Index (GSI):** `buildingId` (Partition Key), `timestamp` (Sort Key)
- **Attributes:** `buildingId`, `buildingName`, `type`, `severity`, `title`, `reason`, `observedValue`, `baselineValue`, `status` ('active' | 'acknowledged')

---

## 4. Suggested REST API Contract

Configure your Amazon API Gateway with CORS enabled:

### `GET /buildings`
- **Response `200 OK`:** Array of all building objects.
```json
[
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
    "hourlyConsumption": [{ "hour": "00:00", "consumption": 180, "baseline": 190 }],
    "weeklyConsumption": [{ "day": "Mon", "consumption": 14100, "baseline": 14000 }],
    "subZones": [{ "name": "Ground Floor Washrooms", "sharePct": 28, "status": "Normal" }]
  }
]
```

### `GET /alerts`
- **Response `200 OK`:** Array of all alerts (active and acknowledged).

### `POST /alerts/{id}/acknowledge`
- **Request Body:**
```json
{
  "acknowledgedBy": "Campus Facilities Warden"
}
```
- **Response `200 OK`:** Updated alert object or updated alert array.

---

## 5. Environment Variables

Create `.env` from `.env.example`:

```env
# Toggle AWS API on
VITE_USE_AWS_API=true

# Your Amazon API Gateway stage URL
VITE_AWS_API_BASE_URL=https://<api-id>.execute-api.<region>.amazonaws.com/<stage>

# Optional API Key if using API Gateway usage plans
VITE_AWS_API_KEY=YOUR_AWS_API_GATEWAY_KEY_PLACEHOLDER

# Target region
VITE_AWS_REGION=us-east-1
```

---

## 6. Exact Frontend Files to Touch

You only need to look at two files in `src/services/`:

1. **`src/services/apiClient.js`:**
   - Handles the fetch call, error handling, and authorization headers (`x-api-key` or `Authorization: Bearer <token>`).
2. **`src/services/waterDataService.js`:**
   - Already has `if (isAwsIntegrationActive())` checks in `getBuildings()`, `getAlerts()`, and `acknowledgeAlert()`.
   - Adjust endpoint URL paths here if your API routes differ.

---

## 7. How to Run Before and After Integration

### Before Integration (Local Prototype Mode)
```bash
npm install
npm run dev
```
Runs at `http://localhost:3000/` using synthetic simulated models.

### After Integration (Connected to AWS)
1. Add `.env` with `VITE_USE_AWS_API=true` and your `VITE_AWS_API_BASE_URL`.
2. Run `npm run dev`.
3. Open `http://localhost:3000/`. Telemetry now streams from your AWS Lambda/DynamoDB stack!

---

## 8. AWS Features Not Yet Implemented (Your Roadmap)

- [ ] DynamoDB schema creation (`AquaGuard_Buildings`, `AquaGuard_Alerts`).
- [ ] Lambda functions for data retrieval and anomaly alert acknowledgment.
- [ ] API Gateway REST API with CORS enabled.
- [ ] Amazon SNS topic for instant SMS/Email notifications to hostel wardens.
- [ ] AWS Amplify or S3/CloudFront hosting configuration.
- [ ] IoT Core integration (for real ESP32 / LoRaWAN ultrasonic flow sensors in future physical pilot).

---

## 9. Security Mandates

> ⚠️ **CRITICAL SECURITY RULES:**
> 1. **NEVER** place AWS IAM Secret Access Keys (`AWS_SECRET_ACCESS_KEY`) or root credentials in frontend code or Git.
> 2. The React frontend is a public client; all authentication should be via Amazon Cognito tokens or restricted API Gateway keys.
> 3. Implement least-privilege IAM roles for your Lambda execution functions (e.g., restricted `dynamodb:GetItem`, `dynamodb:PutItem`, `dynamodb:Scan` permissions).
