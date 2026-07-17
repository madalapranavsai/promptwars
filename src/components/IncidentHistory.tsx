import React from "react";
import { History, Calendar } from "lucide-react";
import { IncidentRecord } from "../shared/types";

interface IncidentHistoryProps {
  theme: "light" | "dark";
  incidents: IncidentRecord[];
}

export function IncidentHistory({ theme, incidents }: IncidentHistoryProps) {
  const getCategoryStyle = (cat: string) => {
    const map: Record<string, string> = {
      MEDICAL: "bg-red-500/10 text-red-400 border-red-900/30",
      SECURITY: "bg-red-500/10 text-red-400 border-red-900/30",
      LOST_CHILD: "bg-amber-500/10 text-amber-400 border-amber-900/30",
      CROWDING: "bg-orange-500/10 text-orange-400 border-orange-900/30",
      ACCESSIBILITY: "bg-blue-500/10 text-blue-400 border-blue-900/30",
      NAVIGATION: "bg-sky-500/10 text-sky-400 border-sky-900/30",
      TRANSPORT: "bg-indigo-500/10 text-indigo-400 border-indigo-900/30",
      SUSTAINABILITY: "bg-emerald-500/10 text-emerald-400 border-emerald-900/30",
      LOST_ITEM: "bg-gray-500/10 text-gray-400 border-gray-800/30",
      MULTILINGUAL: "bg-purple-500/10 text-purple-400 border-purple-900/30",
    };
    return map[cat] || "bg-gray-500/10 text-gray-400 border-gray-800/30";
  };

  const getRiskStyle = (risk: string) => {
    const map: Record<string, string> = {
      EMERGENCY: "bg-red-600/90 text-white",
      HIGH: "bg-orange-600/90 text-white",
      MEDIUM: "bg-amber-600/90 text-white",
      LOW: "bg-emerald-600/90 text-white",
    };
    return map[risk] || "bg-gray-600 text-white";
  };

  return (
    <div className={`border rounded-xl p-5 shadow-lg space-y-4 transition-all duration-200 ${
      theme === "dark" ? "bg-[#0d1117] border-gray-800" : "bg-white border-slate-200"
    }`}>
      <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center space-x-2 border-b pb-2 transition-all duration-200 ${
        theme === "dark" ? "text-gray-300 border-gray-800/60" : "text-slate-700 border-slate-200"
      }`}>
        <History className="w-4 h-4 text-blue-500" />
        <span>Incident History Feed</span>
      </h3>

      {incidents.length === 0 ? (
        <div className={`text-center py-8 text-xs font-mono transition-colors duration-200 ${
          theme === "dark" ? "text-gray-600" : "text-slate-400"
        }`}>
          No incidents logged in this session yet.
        </div>
      ) : (
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
          {[...incidents].reverse().map((inc) => {
            const timeStr = new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            return (
              <div 
                key={inc.id}
                className={`p-3 border rounded-lg transition-all duration-200 ${
                  theme === "dark" 
                    ? "bg-[#05070a] border-gray-800 hover:border-gray-700" 
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm border ${getCategoryStyle(inc.category)}`}>
                      {inc.category}
                    </span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-xs font-mono ${getRiskStyle(inc.riskLevel)}`}>
                      {inc.riskLevel}
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono flex items-center gap-1 transition-colors duration-200 ${
                    theme === "dark" ? "text-gray-400" : "text-slate-400"
                  }`}>
                    <Calendar className="w-2.5 h-2.5" />
                    <span>{timeStr}</span>
                  </span>
                </div>
                <p className={`text-xs font-medium line-clamp-2 transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-300" : "text-slate-700"
                }`}>
                  {inc.situation}
                </p>
                <p className={`text-[10px] italic mt-1 line-clamp-1 border-t pt-1 border-gray-800/40 transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-400" : "text-slate-450"
                }`}>
                  AI: {inc.recommendation}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
