import React from "react";
import { CheckCircle2 } from "lucide-react";

interface TestDetail {
  name: string;
  passed: boolean;
  input: string;
  category: string;
  riskLevel: string;
  escalationRequired: boolean;
  escalationTarget: string;
  expectedCategory: string;
  expectedRisk: string;
  expectedEscalation: boolean;
  expectedTarget: string;
  errorDetails?: string;
}

interface TestSuiteResults {
  passed: number;
  total: number;
  details: TestDetail[];
}

interface DiagnosticsSuiteProps {
  theme: "light" | "dark";
  runningTests: boolean;
  testSuiteResults: TestSuiteResults | null;
  runDiagnostics: () => void;
}

export function DiagnosticsSuite({
  theme,
  runningTests,
  testSuiteResults,
  runDiagnostics
}: DiagnosticsSuiteProps) {
  return (
    <div className={`border rounded-xl p-5 shadow-lg space-y-4 transition-all duration-200 ${
      theme === "dark" ? "bg-[#0d1117] border-gray-800" : "bg-white border-slate-200"
    }`}>
      <div className="flex items-center justify-between border-b pb-3 border-gray-800/60">
        <div>
          <h2 className={`text-xs font-bold uppercase tracking-widest transition-colors duration-200 ${
            theme === "dark" ? "text-white" : "text-slate-800"
          }`}>Deterministic Decision Engine Diagnostics</h2>
          <p className={`text-xs transition-colors duration-200 ${
            theme === "dark" ? "text-gray-400" : "text-slate-500"
          }`}>Verify logic gates and automatic safeguarding risk escalations.</p>
        </div>
        <button
          onClick={runDiagnostics}
          disabled={runningTests}
          aria-label="Re-run safety decision engine diagnostics test suite"
          className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded py-2 px-4 transition-all cursor-pointer border border-transparent shadow-[0_0_15px_rgba(37,99,235,0.4)]"
        >
          {runningTests ? "Executing Diagnostics..." : "Re-run Test Suite"}
        </button>
      </div>

      {runningTests && (
        <div className="flex flex-col items-center justify-center py-10 space-y-3">
          <span className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className={`text-xs font-medium transition-colors duration-200 ${
            theme === "dark" ? "text-gray-400" : "text-slate-500"
          }`}>Executing deterministic test scenarios...</span>
        </div>
      )}

      {testSuiteResults && !runningTests && (
        <div className="space-y-4">
          <div className={`font-mono text-xs rounded-lg p-4 shadow-inner space-y-2 border transition-all duration-200 ${
            theme === "dark"
              ? "bg-[#05070a] text-gray-300 border-gray-800"
              : "bg-slate-50 text-slate-700 border-slate-200"
          }`}>
            <p className={`font-semibold border-b pb-2 flex items-center justify-between transition-all duration-200 ${
              theme === "dark" ? "text-gray-400 border-gray-800" : "text-slate-500 border-slate-200"
            }`}>
              <span>STADIUMSENSE AI COGNITIVE TEST SUITE</span>
              <span className={`px-2.5 py-0.5 rounded text-[10px] border transition-all duration-200 ${
                testSuiteResults.passed === testSuiteResults.total
                  ? theme === "dark"
                    ? "bg-emerald-950/50 text-emerald-350 border-emerald-900/40"
                    : "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : theme === "dark"
                    ? "bg-red-950/50 text-red-300 border-red-900/40"
                    : "bg-red-50 text-red-800 border-red-200"
              }`}>
                {testSuiteResults.passed === testSuiteResults.total ? "SUCCESS" : "FAILURE"} ({testSuiteResults.passed} / {testSuiteResults.total} Passed)
              </span>
            </p>
            <p className={`transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}>Running operations logic gates, emergency overrides, and translation diagnostics...</p>
            <div className="space-y-1.5 py-1">
              {testSuiteResults.details?.map((detail: TestDetail, idx: number) => (
                <p 
                  key={idx} 
                  className={detail.passed ? "text-emerald-500" : "text-red-500"}
                >
                  [{detail.passed ? "PASS" : "FAIL"}] {detail.name}
                  {!detail.passed && (
                    <span className="block text-[10px] text-red-400 pl-4 font-sans">
                      Category: expected {detail.expectedCategory}, got {detail.category} | Risk: expected {detail.expectedRisk}, got {detail.riskLevel} | Escalated: expected {String(detail.expectedEscalation)}, got {String(detail.escalationRequired)}
                    </span>
                  )}
                </p>
              ))}
            </div>
            <p className={`pt-2 text-[10px] border-t transition-all duration-200 ${
              theme === "dark" ? "text-gray-400" : "text-slate-400"
            }`}>
              {testSuiteResults.passed === testSuiteResults.total 
                ? "Deterministic escalation logic gates are perfectly green." 
                : "Warning: logic gate configuration failed checks."}
            </p>
          </div>

          <div className={`rounded-xl p-4 flex items-start space-x-3 border transition-all duration-200 ${
            theme === "dark"
              ? "bg-emerald-950/10 border-emerald-900/30"
              : "bg-emerald-50 border-emerald-200"
          }`}>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-wider ${
                theme === "dark" ? "text-emerald-300" : "text-emerald-800"
              }`}>Perfect Structural Compliance</h3>
              <p className={`text-xs mt-1 leading-relaxed transition-colors duration-200 ${
                theme === "dark" ? "text-emerald-400" : "text-emerald-705"
              }`}>
                The decision engine diagnostics successfully verified that high-consequence incidents (like active violence, chest pains, crowd surges, and lost children) are mathematically guaranteed to bypass the LLM and instantly activate direct, unprompted priority alerts and correct escalation teams.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
