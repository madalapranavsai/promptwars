import React from "react";
import { FileText, RotateCcw } from "lucide-react";

interface SituationFormProps {
  theme: "light" | "dark";
  situation: string;
  setSituation: (text: string) => void;
  role: string;
  setRole: (r: string) => void;
  zone: string;
  setZone: (z: string) => void;
  urgencyOverride: string;
  setUrgencyOverride: (u: string) => void;
  targetLanguage: string;
  setTargetLanguage: (lang: string) => void;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleClear: () => void;
}

export function SituationForm({
  theme,
  situation,
  setSituation,
  role,
  setRole,
  zone,
  setZone,
  urgencyOverride,
  setUrgencyOverride,
  targetLanguage,
  setTargetLanguage,
  loading,
  handleSubmit,
  handleClear
}: SituationFormProps) {
  return (
    <form onSubmit={handleSubmit} className={`border rounded-xl p-5 shadow-lg space-y-4 transition-all duration-200 ${
      theme === "dark" ? "bg-[#0d1117] border-gray-800" : "bg-white border-slate-200"
    }`}>
      <h2 className={`text-xs font-bold uppercase tracking-widest flex items-center space-x-2 border-b pb-2 transition-all duration-200 ${
        theme === "dark" ? "text-gray-300 border-gray-800/60" : "text-slate-700 border-slate-200"
      }`}>
        <FileText className="w-4 h-4 text-blue-500" />
        <span>Report Matchday Situation</span>
      </h2>

      <div>
        <label htmlFor="situation-desc" className={`block text-[10px] uppercase font-bold tracking-widest mb-1.5 transition-colors duration-200 ${
          theme === "dark" ? "text-gray-400" : "text-slate-500"
        }`}>
          Describe the Active Situation: <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <textarea
            id="situation-desc"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="Describe what is happening in detail. Specify seats, symptoms, behaviors, languages, or security threats..."
            rows={6}
            className={`w-full text-sm rounded p-3 pr-2 outline-hidden transition-all duration-200 ${
              theme === "dark"
                ? "bg-[#05070a] border-gray-800 text-gray-200 placeholder-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                : "bg-slate-50 border-slate-250 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
            }`}
            maxLength={2000}
            required
          />
          <div className={`absolute bottom-2.5 right-2.5 text-[10px] font-mono transition-colors duration-200 ${
            theme === "dark" ? "text-gray-600" : "text-slate-450"
          }`}>
            {situation.length} / 2000
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="role-select" className={`block text-[10px] uppercase font-bold tracking-widest mb-1.5 transition-colors duration-200 ${
            theme === "dark" ? "text-gray-400" : "text-slate-500"
          }`}>
            Your Duty Role:
          </label>
          <select
            id="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={`w-full text-xs rounded p-2 outline-hidden transition-all duration-200 ${
              theme === "dark"
                ? "bg-[#05070a] border-gray-800 text-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                : "bg-slate-50 border-slate-250 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
            }`}
          >
            <option value="volunteer_steward" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Volunteer Steward</option>
            <option value="gate_manager" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Gate Entry Manager</option>
            <option value="medical_coordinator" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Medical Coordinator</option>
            <option value="security_agent" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Stadium Security Agent</option>
          </select>
        </div>

        <div>
          <label htmlFor="zone-select" className={`block text-[10px] uppercase font-bold tracking-widest mb-1.5 transition-colors duration-200 ${
            theme === "dark" ? "text-gray-400" : "text-slate-500"
          }`}>
            Active Stadium Zone:
          </label>
          <select
            id="zone-select"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className={`w-full text-xs rounded p-2 outline-hidden transition-all duration-200 ${
              theme === "dark"
                ? "bg-[#05070a] border-gray-800 text-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                : "bg-slate-50 border-slate-250 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
            }`}
          >
            <option value="gate_entry" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Entry Gates & Turnstiles</option>
            <option value="concourse_l1" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Concourse Level 1</option>
            <option value="concourse_l2" className={theme === "dark" ? "bg-[#0d1117] text-gray-355" : "bg-white text-slate-700"}>Concourse Level 2</option>
            <option value="spectator_seats" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Spectator Stand / Seats</option>
            <option value="vip_area" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>VIP / Hospitality Lounge</option>
            <option value="restrooms" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Restrooms & Facilities</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="urgency-select" className={`block text-[10px] uppercase font-bold tracking-widest mb-1.5 transition-colors duration-200 ${
            theme === "dark" ? "text-gray-400" : "text-slate-500"
          }`}>
            Urgency Override:
          </label>
          <select
            id="urgency-select"
            value={urgencyOverride}
            onChange={(e) => setUrgencyOverride(e.target.value)}
            className={`w-full text-xs rounded p-2 outline-hidden transition-all duration-200 ${
              theme === "dark"
                ? "bg-[#05070a] border-gray-800 text-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                : "bg-slate-50 border-slate-250 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
            }`}
          >
            <option value="auto" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Auto-detect (System Rule)</option>
            <option value="LOW" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Low Urgency</option>
            <option value="MEDIUM" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Medium Urgency</option>
            <option value="HIGH" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>High Urgency</option>
            <option value="EMERGENCY" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Emergency (Red Alert)</option>
          </select>
        </div>

        <div>
          <label htmlFor="lang-select" className={`block text-[10px] uppercase font-bold tracking-widest mb-1.5 transition-colors duration-200 ${
            theme === "dark" ? "text-gray-400" : "text-slate-500"
          }`}>
            Target Language Support:
          </label>
          <select
            id="lang-select"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className={`w-full text-xs rounded p-2 outline-hidden transition-all duration-200 ${
              theme === "dark"
                ? "bg-[#05070a] border-gray-800 text-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                : "bg-slate-50 border-slate-250 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
            }`}
          >
            <option value="auto" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Auto-detect (System Rule)</option>
            <option value="en" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>English (US/UK)</option>
            <option value="es" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Spanish (Español)</option>
            <option value="fr" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>French (Français)</option>
            <option value="de" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>German (Deutsch)</option>
            <option value="pt" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Portuguese (Português)</option>
            <option value="ja" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Japanese (日本語)</option>
            <option value="zh" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Chinese (中文)</option>
            <option value="ko" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Korean (한국어)</option>
            <option value="ar" className={theme === "dark" ? "bg-[#0d1117] text-gray-350" : "bg-white text-slate-700"}>Arabic (العربية)</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-3 pt-2">
        <button
          type="button"
          onClick={handleClear}
          className={`flex-1 py-2.5 px-3 border text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            theme === "dark"
              ? "bg-gray-900 hover:bg-gray-800 border-gray-800 text-gray-300"
              : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Report</span>
        </button>

        <button
          type="submit"
          disabled={loading}
          className={`flex-3 bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-4 rounded font-bold uppercase tracking-widest text-xs transition-colors shadow-lg flex items-center justify-center space-x-2 cursor-pointer ${
            theme === "dark"
              ? "shadow-blue-900/20 disabled:bg-gray-800 disabled:text-gray-500 disabled:border-gray-700 disabled:cursor-not-allowed"
              : "shadow-blue-500/10 disabled:bg-slate-200 disabled:text-slate-400 disabled:border-slate-300 disabled:cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing with AI...</span>
            </>
          ) : (
            <span>Run Decision Copilot</span>
          )}
        </button>
      </div>
    </form>
  );
}
