import React from "react";
import { ShieldAlert, Sun, Moon } from "lucide-react";

interface HeaderProps {
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  activeTab: "copilot" | "tests";
  setActiveTab: (tab: "copilot" | "tests") => void;
  runDiagnostics: () => void;
  setAnnouncement: (msg: string) => void;
}

export function Header({
  theme,
  setTheme,
  activeTab,
  setActiveTab,
  runDiagnostics,
  setAnnouncement
}: HeaderProps) {
  return (
    <header className={`sticky top-0 z-40 border-b shrink-0 transition-all duration-200 ${
      theme === "dark" ? "bg-[#0d1117] border-gray-800 shadow-lg" : "bg-white border-slate-200 shadow-sm"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h1 className={`text-sm font-bold uppercase tracking-wider transition-colors duration-200 ${
              theme === "dark" ? "text-white" : "text-slate-800"
            }`}>StadiumSense AI</h1>
            <p className={`text-[10px] tracking-wide transition-colors duration-200 ${
              theme === "dark" ? "text-gray-400" : "text-slate-400"
            }`}>MATCHDAY COMMAND OPERATIONS COPILOT</p>
          </div>
        </div>

        {/* Info panel */}
        <div className="hidden md:flex items-center space-x-6 text-[10px] font-mono tracking-wider">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              Status:{" "}
              <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-4 font-bold">
                Live Connected
              </span>
            </div>
          </div>
          <div className={theme === "dark" ? "text-gray-300" : "text-slate-600"}>
            Match: <span className="text-blue-500 font-bold">BRA vs USA</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => {
              setActiveTab("copilot");
              setAnnouncement("Navigated to Copilot dashboard.");
            }}
            className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "copilot"
                ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                : theme === "dark"
                  ? "bg-gray-800/80 hover:bg-gray-800 text-gray-300 border border-gray-700/60"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              setActiveTab("tests");
              runDiagnostics();
            }}
            className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "tests"
                ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                : theme === "dark"
                  ? "bg-gray-800/80 hover:bg-gray-800 text-gray-300 border border-gray-700/60"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
            }`}
          >
            Diagnostics
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => {
              const nextTheme = theme === "dark" ? "light" : "dark";
              setTheme(nextTheme);
              setAnnouncement(`Theme changed to ${nextTheme} mode.`);
            }}
            className={`p-1.5 rounded transition-all cursor-pointer border ${
              theme === "dark"
                ? "bg-gray-800/80 hover:bg-gray-800 text-yellow-400 border-gray-700/60"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
            }`}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
