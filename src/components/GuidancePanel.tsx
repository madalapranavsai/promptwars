import React from "react";
import { 
  ShieldAlert, Activity, AlertTriangle, Info, Globe, 
  HelpCircle, Volume2, Clipboard, CheckSquare 
} from "lucide-react";
import { FinalResponse, LocalizedScript } from "../shared/types";

interface GuidancePanelProps {
  theme: "light" | "dark";
  response: FinalResponse;
  checkedSteps: Record<string, boolean>;
  setCheckedSteps: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  checkedDetails: Record<string, boolean>;
  setCheckedDetails: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setAnnouncement: (msg: string) => void;
  copyToClipboard: (text: string, label: string) => void;
  speakText: (text: string, langCode: string) => void;
}

export function GuidancePanel({
  theme,
  response,
  checkedSteps,
  setCheckedSteps,
  checkedDetails,
  setCheckedDetails,
  setAnnouncement,
  copyToClipboard,
  speakText
}: GuidancePanelProps) {
  const getRiskColor = (risk: string) => {
    const map: Record<string, string> = {
      EMERGENCY: "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.45)]",
      HIGH: "bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.35)]",
      MEDIUM: "bg-amber-600 text-white shadow-[0_0_12px_rgba(217,119,6,0.25)]",
      LOW: "bg-emerald-600 text-white shadow-[0_0_10px_rgba(5,150,105,0.2)]",
    };
    return map[risk] || "bg-gray-600 text-white";
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Alerts & Meta Details Bar */}
      <div className={`border rounded-xl p-5 shadow-lg space-y-4 transition-all duration-200 ${
        theme === "dark" ? "bg-[#0d1117] border-gray-800" : "bg-white border-slate-200"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-gray-800/60">
          <div>
            <h2 className={`text-xs font-bold uppercase tracking-widest flex items-center space-x-2 transition-colors duration-200 ${
              theme === "dark" ? "text-gray-300" : "text-slate-700"
            }`}>
              <ShieldAlert className="w-4 h-4 text-blue-500" />
              <span>Safety & Escalation Directive</span>
            </h2>
            <p className={`text-[10px] font-mono mt-1 transition-colors duration-200 ${
              theme === "dark" ? "text-gray-400" : "text-slate-450"
            }`}>COGNITIVE DECISION ENGINE DISPATCH REPORT</p>
          </div>
          <div className="flex items-center space-x-2.5">
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full font-mono ${getRiskColor(response.analysis.riskLevel)}`}>
              {response.analysis.riskLevel}
            </span>
            {response.decision.escalationRequired && (
              <span className="text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full animate-pulse flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>ESCALATION REQUIRED</span>
              </span>
            )}
          </div>
        </div>

        {/* Coordinated Target Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border transition-all duration-200 ${
            theme === "dark" ? "bg-[#05070a] border-gray-800/80" : "bg-slate-50 border-slate-200"
          }`}>
            <span className={`block text-[9px] font-semibold uppercase tracking-widest transition-colors duration-200 ${
              theme === "dark" ? "text-gray-400" : "text-slate-450"
            }`}>Escalation Dispatch Target</span>
            <span className={`text-xs font-bold mt-1 block transition-colors duration-200 ${
              theme === "dark" ? "text-red-450" : "text-red-750"
            }`}>{response.decision.escalationTarget}</span>
          </div>

          <div className={`p-4 rounded-lg border transition-all duration-200 ${
            theme === "dark" ? "bg-[#05070a] border-gray-800/80" : "bg-slate-50 border-slate-200"
          }`}>
            <span className={`block text-[9px] font-semibold uppercase tracking-widest transition-colors duration-200 ${
              theme === "dark" ? "text-gray-400" : "text-slate-450"
            }`}>Active Operations Pathway</span>
            <span className={`text-xs font-bold mt-1 block transition-colors duration-200 ${
              theme === "dark" ? "text-white" : "text-slate-800"
            }`}>{response.decision.recommendedActionPath}</span>
          </div>
        </div>
      </div>

      {/* 2. Primary Copilot Action Plan Card */}
      <div className={`border rounded-xl p-5 shadow-lg space-y-3 transition-all duration-200 ${
        theme === "dark" ? "bg-[#0d1117] border-gray-800" : "bg-white border-slate-200"
      }`}>
        <div className="flex items-center justify-between border-b pb-3 border-gray-800/60">
          <h3 className={`text-xs font-bold uppercase tracking-[0.2em] flex items-center space-x-2 transition-colors duration-200 ${
            theme === "dark" ? "text-gray-300" : "text-slate-700"
          }`}>
            <Activity className="w-4 h-4 text-blue-500" />
            <span>Primary Operational Directive</span>
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`border text-[10px] px-2.5 py-0.5 rounded font-mono font-bold transition-all duration-200 ${
              theme === "dark" 
                ? "bg-blue-950/50 text-blue-400 border-blue-900/40" 
                : "bg-blue-50 text-blue-700 border-blue-200"
            }`}>
              Category: {response.analysis.category}
            </span>
            <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold transition-all duration-200 ${
              theme === "dark" 
                ? "bg-gray-800 text-gray-300" 
                : "bg-slate-100 text-slate-700 border border-slate-200"
            }`}>
              Intent: {response.analysis.intent}
            </span>
          </div>
        </div>
        <p className={`text-sm font-medium leading-relaxed mt-2 transition-colors duration-200 ${
          theme === "dark" ? "text-white" : "text-slate-800"
        }`}>
          {response.aiOutput.recommendation}
        </p>
        {response.aiOutput.followUpQuestion && (
          <div className={`mt-3 p-3 rounded border border-dashed transition-all duration-200 ${
            theme === "dark"
              ? "bg-amber-955/10 border-amber-900/40 text-amber-300"
              : "bg-amber-50/70 border-amber-200 text-amber-900"
          }`}>
            <p className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span>AI Follow-Up Clarification:</span>
            </p>
            <p className="text-xs italic mt-1 font-medium leading-relaxed">
              &ldquo;{response.aiOutput.followUpQuestion}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* 3. Volunteer localized scripts card (with TTS and clipboard copy) */}
      <div className={`border rounded-xl p-5 shadow-lg space-y-4 transition-all duration-200 ${
        theme === "dark" ? "bg-[#0d1117] border-gray-800" : "bg-white border-slate-200"
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 transition-colors duration-200 ${
          theme === "dark" ? "border-gray-800/80" : "border-slate-200"
        }`}>
          <h3 className={`text-xs font-bold uppercase tracking-[0.2em] flex items-center space-x-2 transition-colors duration-200 ${
            theme === "dark" ? "text-gray-300" : "text-slate-700"
          }`}>
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Localized Bilingual Fan Scripts</span>
          </h3>
          <span className={`text-[10px] transition-colors duration-200 ${
            theme === "dark" ? "text-gray-400" : "text-slate-500"
          }`}>
            Detected spectator language: <strong className="uppercase font-bold text-blue-500">{response.analysis.detectedLanguage}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.entries(response.localizedScripts) as [string, LocalizedScript][]).map(([langCode, script]) => (
            <div 
              key={langCode} 
              className={`border rounded p-4 relative flex flex-col justify-between transition-all duration-200 ${
                langCode === response.analysis.detectedLanguage 
                  ? theme === "dark" 
                    ? "bg-blue-950/10 border-blue-500/20" 
                    : "bg-blue-50/70 border-blue-200 shadow-xs" 
                  : theme === "dark"
                    ? "bg-gray-900/40 border-gray-800"
                    : "bg-slate-50/50 border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold flex items-center space-x-1.5 transition-colors duration-200 ${
                    theme === "dark" ? "text-gray-300" : "text-slate-800"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>{script.languageName} Sheet</span>
                  </span>
                  <span className={`text-[9px] font-mono font-bold uppercase px-1 py-0.5 rounded transition-all duration-200 ${
                    theme === "dark" 
                      ? "text-gray-400 bg-gray-800 border border-gray-700" 
                      : "text-slate-600 bg-slate-100 border border-slate-200"
                  }`}>
                    {langCode}
                  </span>
                </div>

                <div className={`text-xs space-y-2 leading-relaxed pr-6 transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-400" : "text-slate-600"
                }`}>
                  <p><strong className={`font-semibold mr-1 transition-colors duration-200 ${theme === "dark" ? "text-gray-300" : "text-slate-800"}`}>Greeting:</strong> &ldquo;{script.greeting}&rdquo;</p>
                  <p><strong className={`font-semibold mr-1 transition-colors duration-200 ${theme === "dark" ? "text-gray-300" : "text-slate-800"}`}>Reassurance:</strong> &ldquo;{script.reassurance}&rdquo;</p>
                  <p><strong className={`font-semibold mr-1 transition-colors duration-200 ${theme === "dark" ? "text-gray-300" : "text-slate-800"}`}>Seat/Location Inquiry:</strong> &ldquo;{script.locationPrompt}&rdquo;</p>
                  <p><strong className={`font-semibold mr-1 transition-colors duration-200 ${theme === "dark" ? "text-gray-300" : "text-slate-800"}`}>Action Directive:</strong> &ldquo;{script.actionDirective}&rdquo;</p>
                  <p><strong className={`font-semibold mr-1 transition-colors duration-200 ${theme === "dark" ? "text-gray-300" : "text-slate-800"}`}>Closing:</strong> &ldquo;{script.closing}&rdquo;</p>
                </div>
              </div>

              <div className={`flex items-center space-x-2 mt-4 pt-3 border-t justify-end transition-colors duration-200 ${
                theme === "dark" ? "border-gray-800/85" : "border-slate-200"
              }`}>
                <button
                  onClick={() => speakText(
                    `${script.greeting} ${script.reassurance} ${script.locationPrompt} ${script.actionDirective} ${script.closing}`, 
                    langCode
                  )}
                  title="Speak Script"
                  aria-label={`Speak script in ${script.languageName}`}
                  className={`p-1.5 rounded transition-all cursor-pointer border ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700/80"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-255"
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => copyToClipboard(
                    `Greeting: ${script.greeting}\nReassurance: ${script.reassurance}\nInquiry: ${script.locationPrompt}\nDirective: ${script.actionDirective}\nClosing: ${script.closing}`,
                    `${script.languageName} script`
                  )}
                  title="Copy Script to Clipboard"
                  aria-label={`Copy script in ${script.languageName} to clipboard`}
                  className={`p-1.5 rounded transition-all cursor-pointer border ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700/80"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-255"
                  }`}
                >
                  <Clipboard className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Generative spoken script card */}
        <div className={`border rounded p-4 transition-all duration-200 ${
          theme === "dark" ? "border-gray-800 bg-gray-900/20" : "border-slate-200 bg-slate-50"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] uppercase font-bold tracking-[0.2em] transition-colors duration-200 ${
              theme === "dark" ? "text-gray-400" : "text-slate-500"
            }`}>AI Empathetic Volunteer Script</span>
            <button
              onClick={() => speakText(response.aiOutput.script, response.analysis.detectedLanguage)}
              className={`text-[10px] font-bold px-2 py-1 rounded transition-all cursor-pointer flex items-center space-x-1 border ${
                theme === "dark"
                  ? "text-blue-400 bg-blue-950/50 hover:bg-blue-950/80 border-blue-900/30"
                  : "text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200"
              }`}
            >
              <Volume2 className="w-3 h-3" />
              <span>Listen Speech</span>
            </button>
          </div>
          <p className={`text-xs leading-relaxed italic p-3 rounded shadow-inner transition-all duration-200 border ${
            theme === "dark"
              ? "text-gray-300 bg-[#05070a]/80 border-gray-800/80"
              : "text-slate-700 bg-white border-slate-200"
          }`}>
            &ldquo;{response.aiOutput.script}&rdquo;
          </p>
        </div>
      </div>

      {/* 4. Interactive checklists */}
      <div className={`border rounded-xl p-5 shadow-lg space-y-3 transition-all duration-200 ${
        theme === "dark" ? "bg-[#0d1117] border-gray-800" : "bg-white border-slate-200"
      }`}>
        <h3 className={`text-xs font-bold uppercase tracking-[0.2em] flex items-center space-x-2 transition-colors duration-200 ${
          theme === "dark" ? "text-gray-300" : "text-slate-700"
        }`}>
          <CheckSquare className="w-4 h-4 text-blue-500" />
          <span>Interactive Tactical Checklist</span>
        </h3>
        <p className={`text-xs transition-colors duration-200 ${
          theme === "dark" ? "text-gray-400" : "text-slate-500"
        }`}>
          Volunteers should tick off each action step as they execute the guidelines below:
        </p>

        <div className="space-y-2 mt-3">
          {response.aiOutput.nextSteps.map((step, idx) => (
            <div 
              key={idx}
              className={`flex items-start space-x-3 p-3 border rounded transition-all duration-200 ${
                checkedSteps[`step-${idx}`] 
                  ? theme === "dark"
                    ? "bg-emerald-950/20 border-emerald-900/40 text-gray-400 line-through" 
                    : "bg-emerald-50/70 border-emerald-200 text-slate-400 line-through"
                  : theme === "dark"
                    ? "bg-gray-900/40 border-gray-800 hover:border-gray-700 hover:bg-gray-900/60 text-gray-300"
                    : "bg-slate-50/50 border-slate-200 hover:border-slate-350 hover:bg-slate-100/50 text-slate-700"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  id={`step-check-${idx}`}
                  checked={!!checkedSteps[`step-${idx}`]}
                  onChange={() => {
                    const key = `step-${idx}`;
                    setCheckedSteps(prev => {
                      const newVal = !prev[key];
                      setAnnouncement(`Step ${idx + 1} marked as ${newVal ? 'completed' : 'incomplete'}`);
                      return { ...prev, [key]: newVal };
                    });
                  }}
                  className={`rounded-sm text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-750 cursor-pointer ${
                    theme === "dark" ? "bg-[#05070a]" : "bg-white"
                  }`}
                />
              </div>
              <label
                htmlFor={`step-check-${idx}`}
                className="text-xs leading-relaxed font-medium cursor-pointer flex-1"
              >
                <span className={`font-mono font-bold mr-1 ${checkedSteps[`step-${idx}`] ? "text-emerald-500" : "text-blue-500"}`}>{idx + 1}.</span> {step}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Missing Details Checker Panel */}
      {response.analysis.missingDetails.length > 0 && (
        <div className={`border rounded-xl p-5 shadow-lg space-y-3 transition-all duration-200 ${
          theme === "dark" ? "bg-[#0d1117] border-gray-800" : "bg-white border-slate-200"
        }`}>
          <h3 className={`text-xs font-bold uppercase tracking-[0.2em] flex items-center space-x-2 transition-colors duration-200 ${
            theme === "dark" ? "text-gray-300" : "text-slate-700"
          }`}>
            <HelpCircle className="w-4 h-4 text-orange-500" />
            <span>Missing Details Questionnaire</span>
          </h3>
          <p className={`text-xs transition-colors duration-200 ${
            theme === "dark" ? "text-gray-400" : "text-slate-500"
          }`}>
            Ask the reporter or spectator the following questions to gather missing critical context:
          </p>
          
          <div className="space-y-2 mt-2">
            {response.analysis.missingDetails.map((detail, idx) => (
              <div 
                key={idx}
                className={`flex items-start space-x-2.5 p-2.5 border border-dashed rounded transition-all duration-200 ${
                  checkedDetails[`detail-${idx}`]
                    ? theme === "dark"
                      ? "bg-gray-955/60 border-gray-800 text-gray-400 line-through"
                      : "bg-slate-100 border-slate-200 text-slate-400 line-through"
                    : theme === "dark"
                      ? "bg-orange-500/5 border-orange-500/20 text-orange-300 hover:border-orange-500/40 hover:bg-orange-500/10"
                      : "bg-orange-50/50 border-orange-200 text-orange-800 hover:border-orange-300 hover:bg-orange-100/40"
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    id={`detail-check-${idx}`}
                    checked={!!checkedDetails[`detail-${idx}`]}
                    onChange={() => {
                      const key = `detail-${idx}`;
                      setCheckedDetails(prev => {
                        const newVal = !prev[key];
                        setAnnouncement(`Context question ${idx + 1} marked as ${newVal ? 'completed' : 'incomplete'}.`);
                        return { ...prev, [key]: newVal };
                      });
                    }}
                    className={`rounded-sm text-orange-550 focus:ring-orange-500 h-3.5 w-3.5 cursor-pointer ${
                      theme === "dark" ? "border-gray-700 bg-gray-955" : "border-slate-300 bg-white"
                    }`}
                  />
                </div>
                <label
                  htmlFor={`detail-check-${idx}`}
                  className="text-xs leading-relaxed font-medium cursor-pointer flex-1"
                >
                  {detail}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Operations Safety Warnings */}
      {response.decision.safetyWarnings.length > 0 && (
        <div className={`border-l-4 rounded-r p-4 shadow-lg space-y-2 transition-all duration-200 border ${
          theme === "dark"
            ? "bg-amber-500/10 border-amber-500 border-gray-800 text-amber-200/95"
            : "bg-amber-50 border-amber-500 border-amber-100 text-amber-900"
        }`}>
          <h4 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
            <span>Operational Safety Warning Gateways</span>
          </h4>
          <ul className="text-xs list-disc pl-4 space-y-1 leading-relaxed">
            {response.decision.safetyWarnings.map((w, idx) => (
              <li key={idx} className="marker:text-amber-500">{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 7. Decision Engine Reasoning diagnostics */}
      <div className={`border rounded-xl p-5 shadow-lg space-y-3 transition-all duration-200 ${
        theme === "dark" ? "bg-[#0d1117] border-gray-800" : "bg-white border-slate-200"
      }`}>
        <h3 className={`text-xs font-bold uppercase tracking-[0.2em] flex items-center space-x-2 transition-colors duration-200 ${
          theme === "dark" ? "text-gray-300" : "text-slate-700"
        }`}>
          <Info className="w-4 h-4 text-blue-500" />
          <span>Decision Logic & Explainable AI reasoning</span>
        </h3>
        <p className={`text-xs leading-relaxed transition-colors duration-200 ${
          theme === "dark" ? "text-gray-400" : "text-slate-650"
        }`}>
          <strong className="text-blue-500">Deterministic Logic:</strong> {response.decision.operationalReasoning}
        </p>
        <p className={`text-xs leading-relaxed border-t pt-3 transition-colors duration-200 ${
          theme === "dark" ? "border-gray-800/80 text-gray-400" : "border-slate-200 text-slate-650"
        }`}>
          <strong className="text-blue-500">AI Rationale:</strong> {response.aiOutput.reasoning}
        </p>
      </div>
    </div>
  );
}
