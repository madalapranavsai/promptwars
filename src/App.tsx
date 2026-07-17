import React, { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { ScenarioPresets } from "./components/ScenarioPresets";
import { SituationForm } from "./components/SituationForm";
import { GuidancePanel } from "./components/GuidancePanel";
import { DiagnosticsSuite } from "./components/DiagnosticsSuite";
import { IncidentHistory } from "./components/IncidentHistory";
import { FinalResponse, TestSuiteResults, IncidentRecord } from "./shared/types";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("stadiumsense-theme");
    return (saved === "light" || saved === "dark") ? saved : "dark";
  });
  
  const [situation, setSituation] = useState("");
  const [role, setRole] = useState("volunteer_steward");
  const [zone, setZone] = useState("concourse_l1");
  const [urgencyOverride, setUrgencyOverride] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("auto");
  
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<FinalResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Checklists state tracking
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [checkedDetails, setCheckedDetails] = useState<Record<string, boolean>>({});

  // Accessibility screen reader announcer
  const [announcement, setAnnouncement] = useState("");
  const [activeTab, setActiveTab] = useState<"copilot" | "tests">("copilot");
  const [testSuiteResults, setTestSuiteResults] = useState<TestSuiteResults | null>(null);
  const [runningTests, setRunningTests] = useState(false);

  // Incident history state
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);

  // Auto scroll to response ref
  const responseRef = useRef<HTMLDivElement>(null);

  // Sync theme selection to localStorage
  useEffect(() => {
    localStorage.setItem("stadiumsense-theme", theme);
  }, [theme]);

  // Load incident history
  const fetchIncidents = async () => {
    try {
      const res = await fetch("/api/incidents");
      const data = await res.json();
      if (data.success) {
        setIncidents(data.incidents);
      }
    } catch (err) {
      console.error("Failed to load incidents:", err);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Reset checklists when response updates
  useEffect(() => {
    setCheckedSteps({});
    setCheckedDetails({});
    if (response && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [response]);

  const handlePresetClick = (text: string) => {
    setSituation(text);
    setAnnouncement("Scenario loaded into textarea. Word count is updated.");
  };

  const handleClear = () => {
    setSituation("");
    setResponse(null);
    setError(null);
    setAnnouncement("Form cleared.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) {
      setError("Please describe the matchday situation before submitting.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnnouncement("Analyzing situation. Querying the StadiumSense AI engine...");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          situation,
          role,
          zone,
          urgencyOverride,
          targetLanguage
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to analyze situation.");
      }

      const data = (await res.json()) as FinalResponse;
      setResponse(data);
      setAnnouncement(`Analysis completed. Identified category: ${data.analysis.category} with ${data.analysis.riskLevel} risk level.`);
      // Refresh persistent incident log
      fetchIncidents();
    } catch (err: any) {
      setError(err.message || "Failed to connect to the StadiumSense engine.");
      setAnnouncement("Analysis failed due to error.");
    } finally {
      setLoading(false);
    }
  };

  const runDiagnostics = async () => {
    setRunningTests(true);
    setAnnouncement("Running deterministic decision engine test suite...");
    try {
      const res = await fetch("/api/test-results");
      const data = await res.json();
      if (data.success) {
        setTestSuiteResults(data.results);
        setAnnouncement(`Diagnostics completed successfully. All tests passed!`);
      } else {
        throw new Error(data.error || "Diagnostic test execution failed.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to run diagnostics.");
      setAnnouncement("Diagnostics execution failed.");
    } finally {
      setRunningTests(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setAnnouncement(`${label} copied to clipboard.`);
  };

  const speakText = (text: string, langCode: string) => {
    if (!window.speechSynthesis) {
      setAnnouncement("Speech synthesis is not supported on this browser.");
      return;
    }

    // Stop current speaking
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voicesMap: Record<string, string> = {
      en: "en-US",
      es: "es-ES",
      fr: "fr-FR",
      de: "de-DE",
      pt: "pt-PT",
      ja: "ja-JP",
      zh: "zh-CN",
      ko: "ko-KR",
      ar: "ar-XA"
    };

    utterance.lang = voicesMap[langCode] || "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`min-h-screen font-sans antialiased flex flex-col selection:bg-blue-600/30 selection:text-white transition-colors duration-200 ${
      theme === "dark" ? "bg-[#05070a] text-gray-200" : "bg-[#f8fafc] text-slate-850"
    }`}>
      {/* Keyboard Skip to Content Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:font-bold focus:rounded focus:outline-hidden focus:shadow-md"
      >
        Skip to content
      </a>

      {/* Hidden live announcer for screen readers */}
      <div className="sr-only" aria-live="polite" id="accessibility-announcer">
        {announcement}
      </div>

      {/* Header component */}
      <Header
        theme={theme}
        setTheme={setTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        runDiagnostics={runDiagnostics}
        setAnnouncement={setAnnouncement}
      />

      <main 
        id="main-content"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col space-y-6"
      >
        {activeTab === "copilot" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column - Preset Scenario Dash, Reporting Form, and Incident Log */}
            <div className="lg:col-span-5 space-y-6">
              <ScenarioPresets
                theme={theme}
                handlePresetClick={handlePresetClick}
              />
              <SituationForm
                theme={theme}
                situation={situation}
                setSituation={setSituation}
                role={role}
                setRole={setRole}
                zone={zone}
                setZone={setZone}
                urgencyOverride={urgencyOverride}
                setUrgencyOverride={setUrgencyOverride}
                targetLanguage={targetLanguage}
                setTargetLanguage={setTargetLanguage}
                loading={loading}
                handleSubmit={handleSubmit}
                handleClear={handleClear}
              />
              <IncidentHistory 
                theme={theme}
                incidents={incidents}
              />
            </div>

            {/* Right Column - Results Guidance Workspace */}
            <div ref={responseRef} className="lg:col-span-7">
              {error && (
                <div className={`p-4 rounded-xl border flex items-center space-x-3 mb-6 animate-pulse transition-all duration-200 ${
                  theme === "dark" 
                    ? "bg-red-500/10 border-red-500/30 text-red-400" 
                    : "bg-red-50 border-red-200 text-red-750"
                }`}>
                  <span className="text-xs font-semibold leading-relaxed">
                    <strong>Error Gateway Triggered:</strong> {error}
                  </span>
                </div>
              )}

              {response ? (
                <GuidancePanel
                  theme={theme}
                  response={response}
                  checkedSteps={checkedSteps}
                  setCheckedSteps={setCheckedSteps}
                  checkedDetails={checkedDetails}
                  setCheckedDetails={setCheckedDetails}
                  setAnnouncement={setAnnouncement}
                  copyToClipboard={copyToClipboard}
                  speakText={speakText}
                />
              ) : (
                <div className={`border border-dashed rounded-xl py-24 flex flex-col items-center justify-center text-center p-6 transition-all duration-200 ${
                  theme === "dark" 
                    ? "bg-[#0d1117]/30 border-gray-800 text-gray-500" 
                    : "bg-white border-slate-200 text-slate-400 shadow-sm"
                }`}>
                  <p className="text-xs font-mono tracking-wider max-w-sm">
                    Awaiting matchday report submission... Load a preset scenario or enter a custom report to launch the Copilot Guidance workspace.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <DiagnosticsSuite
            theme={theme}
            runningTests={runningTests}
            testSuiteResults={testSuiteResults}
            runDiagnostics={runDiagnostics}
          />
        )}
      </main>

      <footer className={`border-t mt-auto py-6 text-center text-xs font-mono transition-colors duration-200 ${
        theme === "dark" ? "border-gray-800 text-gray-500" : "border-slate-200 text-slate-500"
      }`}>
        <p className="max-w-md mx-auto leading-relaxed">
          &copy; 2026 World Cup Stadium Operations Command. Designed for official venue volunteers, stewards, and managers. Powered by StadiumSense AI.
        </p>
      </footer>
    </div>
  );
}
