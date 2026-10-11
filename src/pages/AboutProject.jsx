import React from 'react';
import { 
  Droplet, 
  Target, 
  Users, 
  Lightbulb, 
  Sliders, 
  CloudUpload, 
  Cpu, 
  ShieldCheck, 
  ExternalLink,
  Flame,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export function AboutProject({ onOpenDemoControls }) {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#0A192F] via-[#0F294D] to-[#163B6E] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-700/50">
              Environmental Hacks 2026 • Heat & Water Track
            </span>
            <Badge variant="simulated" size="sm">Prototype Demonstration</Badge>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            AquaGuard
          </h1>
          <p className="text-base sm:text-lg font-medium text-sky-200 mt-1">
            Smart Water Waste Detection & Conservation Platform
          </p>
          <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
            Tagline: <strong className="text-white italic">"Detect waste. Protect water. Enable action."</strong>
          </p>
          <p className="text-xs text-slate-300 mt-2">
            Empowering college campus estate teams and hostel facility wardens with actionable telemetry intelligence to eradicate silent leaks, manage tank levels, and safeguard institutional reserves.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onOpenDemoControls}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>Launch Demo Controls</span>
            </button>
          </div>
        </div>

        {/* Ambient watermark icon */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Droplet className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Grid: Problem & Target Audience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* The Environmental Problem */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-rose-600">
            <Flame className="w-5 h-5" />
            <h2 className="text-base font-extrabold text-[#0A192F]">The Problem: Invisible Campus Water Loss</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Institutional campuses and multi-story hostel complexes consume millions of litres weekly. Due to sprawling plumbing distribution, silent toilet flapper valve weeping, pipe corrosion fractures, and unclosed laboratory taps often go unnoticed for days or weeks.
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
            <li>A single weeping flush valve loses between <strong>200–800 litres every 24 hours</strong>.</li>
            <li>Delayed anomaly awareness causes dry pump burnouts when overhead storage unexpectedly runs out.</li>
            <li>Lack of transparent telemetry leaves facility wardens reacting to crises instead of proactively mitigating waste.</li>
          </ul>
        </div>

        {/* Intended Users */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-sky-600">
            <Users className="w-5 h-5" />
            <h2 className="text-base font-extrabold text-[#0A192F]">Intended Stakeholders & Users</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            AquaGuard is designed specifically for non-technical frontline administrators and technical maintenance managers:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="text-slate-900 block">Hostel Wardens:</strong>
              <span className="text-slate-600">Receive instant alerts regarding abnormal overnight residential spikes without needing plumbing expertise.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="text-slate-900 block">Campus Facility & Estate Engineers:</strong>
              <span className="text-slate-600">Monitor storage tank reserves, balance pump replenishment cycles, and deploy plumbers directly to high-risk zones.</span>
            </div>
          </div>
        </div>

      </div>

      {/* The AquaGuard Solution & How Demo Works */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-emerald-600">
          <Lightbulb className="w-5 h-5" />
          <h2 className="text-base font-extrabold text-[#0A192F]">The Solution: Rule-Based Telemetry Intelligence</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          AquaGuard provides transparent, explainable heuristic intelligence rather than opaque black-box estimates. Every alert clearly informs the manager: <em>what baseline was expected</em>, <em>what volume was observed</em>, <em>which mathematical threshold was breached</em>, and <em>which exact riser or valve bank to inspect first</em>.
        </p>

        {/* How the Demo Works Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-100 text-xs">
            <strong className="text-sky-950 block font-bold mb-1">1. Synthetic Telemetry</strong>
            <p className="text-slate-600">
              High-resolution hourly and weekly profiles simulate residential diurnal patterns and academic lecture peaks for 3 distinct campus buildings.
            </p>
          </div>
          <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-100 text-xs">
            <strong className="text-sky-950 block font-bold mb-1">2. Anomaly Engine</strong>
            <p className="text-slate-600">
              Calculates percentage deviations against moving baselines. Flags possible leaks (&ge; 30% surge) and tank replenishment warnings (&le; 25% or &le; 15%).
            </p>
          </div>
          <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-100 text-xs">
            <strong className="text-sky-950 block font-bold mb-1">3. Demo Controls</strong>
            <p className="text-slate-600">
              Interactive triggers allow judges and developers to simulate a sudden consumption surge or reservoir depletion with zero latency.
            </p>
          </div>
        </div>
      </div>

      {/* Prominent Simulated Data Limitation Notice */}
      <div className="bg-amber-50/80 border-2 border-amber-300/80 rounded-2xl p-5 text-amber-950 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
          <ShieldCheck className="w-5 h-5 text-amber-700" />
          <span>Simulated Prototype Transparency Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          <strong>AquaGuard is currently an interactive hackathon prototype operating on synthetic test datasets.</strong> No physical sensors, live hardware transducers, or real-time campus network connections are presently deployed. All metrics, flow rates, and alerts are modeled to demonstrate operational feasibility and user workflow for Environmental Hacks 2026.
        </p>
      </div>

      {/* Cloud Architecture & AWS Integration Roadmap */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sky-700">
            <CloudUpload className="w-5 h-5" />
            <h2 className="text-base font-extrabold text-[#0A192F]">Planned AWS Cloud Architecture & Integration</h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-sky-100 text-sky-800 rounded-lg">
            Handoff Ready
          </span>
        </div>
        
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The AquaGuard frontend is strictly decoupled from the data layer via modular API client abstractions (<code className="bg-slate-100 px-1 rounded text-sky-800">src/services/apiClient.js</code> and <code className="bg-slate-100 px-1 rounded text-sky-800">src/services/waterDataService.js</code>). An AWS cloud engineer can easily connect the frontend to serverless endpoints:
        </p>

        {/* AWS Pipeline Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block">1. AWS IoT Core</span>
            <span className="text-slate-500 text-[11px] mt-1 block">MQTT broker ingests secure telemetry packets from hardware gateways every 60s.</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block">2. AWS Lambda</span>
            <span className="text-slate-500 text-[11px] mt-1 block">Serverless compute processes incoming payloads and evaluates anomaly rules.</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block">3. Amazon DynamoDB</span>
            <span className="text-slate-500 text-[11px] mt-1 block">NoSQL time-series table stores hourly readings and persistent alert state.</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block">4. Amazon API Gateway</span>
            <span className="text-slate-500 text-[11px] mt-1 block">RESTful endpoints (e.g. GET /readings, POST /alerts/ack) serving this React UI.</span>
          </div>
        </div>

        <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-900 flex items-center justify-between">
          <span>See detailed handoff files: <strong className="font-mono">AWS_LEAD_HANDOFF.md</strong> and <strong className="font-mono">docs/AWS_INTEGRATION_GUIDE.md</strong></span>
        </div>
      </div>

      {/* Future IoT Hardware Roadmap */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5 text-slate-800">
          <Cpu className="w-5 h-5 text-sky-600" />
          <h2 className="text-base font-extrabold text-[#0A192F]">Future IoT Sensor Roadmap</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Following successful hackathon prototyping and AWS deployment, the physical campus pilot will integrate:
        </p>
        <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
          <li><strong>Clamp-On Ultrasonic Flow Transducers (TUF-2000M):</strong> Non-invasive external pipe flow measurement without cutting PVC or copper lines.</li>
          <li><strong>Hydrostatic Submersible Pressure Sensors:</strong> High-precision stainless steel pressure transmitters suspended inside overhead tanks for millimeter water level measurement.</li>
          <li><strong>LoRaWAN Gateway Nodes:</strong> Long-range 868/915 MHz wireless telemetry spanning across multiple hostel wings to a central campus receiver.</li>
        </ul>
      </div>

    </div>
  );
}
