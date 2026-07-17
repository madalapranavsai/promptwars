import React from "react";

export interface Preset {
  id: string;
  label: string;
  color: string;
  text: string;
}

export const SCENARIO_PRESETS: Preset[] = [
  {
    id: "medical",
    label: "Medical Emergency",
    color: "bg-red-950/30 text-red-400 border-red-900/40 hover:bg-red-950/60",
    text: "A spectator in Sector 104, Row G, Seat 14 suddenly fainted and is unconscious. Their breathing is shallow. We need medical paramedics immediately!"
  },
  {
    id: "lost_child",
    label: "Lost Child",
    color: "bg-amber-950/30 text-amber-400 border-amber-900/40 hover:bg-amber-950/60",
    text: "A 7-year-old boy named Leo wearing a blue World Cup jersey and yellow cap was separated from his parents near the Gate B concession stand. He is crying and scared."
  },
  {
    id: "crowding",
    label: "Crowd Bottleneck",
    color: "bg-orange-950/30 text-orange-400 border-orange-900/40 hover:bg-orange-950/60",
    text: "A massive bottleneck is forming at Entry Gate G3. Spectators are pushing hard, and some turnstiles appear jammed. Risk of crowd crush if not controlled immediately."
  },
  {
    id: "accessibility",
    label: "Mobility Blocked",
    color: "bg-blue-950/30 text-blue-400 border-blue-900/40 hover:bg-blue-950/60",
    text: "An elderly gentleman in a wheelchair is unable to access Sector 201 because the main concourse ramp is blocked by media gear, and the lift has a massive queue."
  },
  {
    id: "lost_item",
    label: "Lost Critical Asset",
    color: "bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-850",
    text: "A VIP guest lost their leather wallet containing their passport and FIFA Match 14 category tickets somewhere around the Concourse Level 2 food court."
  },
  {
    id: "sustainability",
    label: "Recycling Overflow",
    color: "bg-emerald-950/30 text-emerald-400 border-emerald-900/40 hover:bg-emerald-950/60",
    text: "The green sustainability sorting bins near Sector 112 are completely overflowing with plastic cups and food containers. It's causing litter in the walkway."
  },
  {
    id: "multilingual",
    label: "Language Barrier",
    color: "bg-purple-950/30 text-purple-400 border-purple-900/40 hover:bg-purple-950/60",
    text: "A Japanese supporter at Info Desk 4 does not speak English or Spanish. They are distressed, trying to find their family group but cannot explain their seating sector."
  },
  {
    id: "navigation",
    label: "Wayfinding",
    color: "bg-sky-950/30 text-sky-400 border-sky-900/40 hover:bg-sky-950/60",
    text: "How do I get from Sector 118 to Gate D? Is there a shortcut past the food court?"
  },
  {
    id: "transport",
    label: "Transit Connection",
    color: "bg-indigo-950/30 text-indigo-400 border-indigo-900/40 hover:bg-indigo-950/60",
    text: "Where is the nearest shuttle bus station for the park-and-ride lot? And does the subway run past midnight?"
  }
];

interface ScenarioPresetsProps {
  theme: "light" | "dark";
  handlePresetClick: (text: string) => void;
}

export function ScenarioPresets({ theme, handlePresetClick }: ScenarioPresetsProps) {
  const getPresetStyle = (id: string, darkColor: string) => {
    if (theme === "dark") return darkColor;
    const lightMap: Record<string, string> = {
      medical: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100/80",
      lost_child: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/80",
      crowding: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100/80",
      accessibility: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/80",
      lost_item: "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200/80",
      sustainability: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80",
      multilingual: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100/80",
      navigation: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100/80",
      transport: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100/80",
    };
    return lightMap[id] || "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200";
  };

  return (
    <div className="space-y-3">
      <h2 className={`text-xs font-bold uppercase tracking-widest transition-colors duration-200 ${
        theme === "dark" ? "text-gray-400" : "text-slate-500"
      }`}>Matchday Preset Scenarios</h2>
      <div className="flex flex-wrap gap-2">
        {SCENARIO_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetClick(preset.text)}
            aria-label={`Load preset scenario for ${preset.label}`}
            className={`text-xs px-3 py-2 border rounded font-medium cursor-pointer transition-all ${getPresetStyle(preset.id, preset.color)}`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
