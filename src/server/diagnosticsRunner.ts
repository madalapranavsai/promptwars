import { analyzeContext } from "./contextAnalyzer";
import { getDeterministicDecision } from "./decisionEngine";
import { generateAIResponse } from "./aiAdapter";
import { TestDetail, TestSuiteResults } from "../shared/types";

export const TEST_CASES = [
  {
    name: "Medical Emergency - Unconscious spectator fainted in stand",
    input: "A spectator in Sector 104, Row G, Seat 14 fainted and is unconscious. Breathing is shallow.",
    expectedCategory: "MEDICAL",
    expectedRisk: "EMERGENCY",
    expectedEscalation: true,
    expectedTarget: "Venue Medical Response Team (VMRT) & Stadium Command Center"
  },
  {
    name: "Security Hazard - Active brawl/fight in entry gate concourse",
    input: "Brawl breaking out between multiple supporters at Gate D turnstiles. Throwing bottles and punches.",
    expectedCategory: "SECURITY",
    expectedRisk: "HIGH",
    expectedEscalation: true,
    expectedTarget: "Stadium Security Command & Local Law Enforcement Liaison"
  },
  {
    name: "Lost Child Safeguarding - Child unaccompanied near concessions",
    input: "I found a crying child alone near the family zone restrooms. He is about 6 years old wearing a green jersey.",
    expectedCategory: "LOST_CHILD",
    expectedRisk: "EMERGENCY",
    expectedEscalation: true,
    expectedTarget: "Venue Operations Center (VOC) & Safeguarding Officer"
  },
  {
    name: "Crowd Bottleneck - Critical trample risks at turnstile zones",
    input: "Massive crowd bottleneck at Entry Gate G3. Spectators are pushing hard and turnstiles seem stuck. Risk of crowd crush.",
    expectedCategory: "CROWDING",
    expectedRisk: "EMERGENCY",
    expectedEscalation: true,
    expectedTarget: "Crowd Management Command & Sector Gate Managers"
  },
  {
    name: "Sustainability Compliance - zero-waste overflowing bins",
    input: "The recycling bins are full of plastic cups near Sector 108.",
    expectedCategory: "SUSTAINABILITY",
    expectedRisk: "LOW",
    expectedEscalation: false,
    expectedTarget: "Venue Facilities & Recycling Zero-Waste Crew"
  },
  {
    name: "Navigation - locating stadium entrance or seats",
    input: "How do I get to Sector 104? Which gate is closest to my seat?",
    expectedCategory: "NAVIGATION",
    expectedRisk: "LOW",
    expectedEscalation: false,
    expectedTarget: "Wayfinding Volunteer Coordinator"
  },
  {
    name: "Accessibility - wheelchair ramp block",
    input: "An elderly guest in a wheelchair is stuck because the main wheelchair ramp is blocked by equipment.",
    expectedCategory: "ACCESSIBILITY",
    expectedRisk: "HIGH",
    expectedEscalation: true,
    expectedTarget: "Spectator Services Mobility Team"
  },
  {
    name: "Transportation - shuttle schedule to transport hub",
    input: "Where is the shuttle bus to the metro station? What time does the transit hub close?",
    expectedCategory: "TRANSPORT",
    expectedRisk: "LOW",
    expectedEscalation: false,
    expectedTarget: "Transport & Traffic Operations Center (TOC)"
  },
  {
    name: "Unclear input - incomplete description details",
    input: "Something went wrong here.",
    expectedCategory: "GENERAL",
    expectedRisk: "LOW",
    expectedEscalation: false,
    expectedTarget: "Sector Supervisor"
  },
  {
    name: "Urgency Level Override - LOW upgraded to HIGH",
    input: "Where is the nearest restroom?",
    urgencyOverride: "HIGH",
    expectedCategory: "GENERAL",
    expectedRisk: "HIGH",
    expectedEscalation: true,
    expectedTarget: "Sector Supervisor"
  }
];

// Helper execution routine for Frontend Diagnostics Tab
export async function runDecisionEngineTests(): Promise<TestSuiteResults> {
  const details: TestDetail[] = [];
  let passedCount = 0;

  for (const t of TEST_CASES) {
    let passed = true;
    let errorDetails = "";
    
    const analysis = analyzeContext(t.input);
    if (t.urgencyOverride) {
      analysis.riskLevel = t.urgencyOverride as any;
    }
    const decision = getDeterministicDecision(analysis, t.input);

    if (analysis.category !== t.expectedCategory) {
      passed = false;
      errorDetails += `Category mismatch: expected ${t.expectedCategory}, got ${analysis.category}. `;
    }
    if (analysis.riskLevel !== t.expectedRisk) {
      passed = false;
      errorDetails += `Risk level mismatch: expected ${t.expectedRisk}, got ${analysis.riskLevel}. `;
    }
    if (decision.escalationRequired !== t.expectedEscalation) {
      passed = false;
      errorDetails += `Escalation mismatch: expected ${t.expectedEscalation}, got ${decision.escalationRequired}. `;
    }
    if (decision.escalationTarget !== t.expectedTarget) {
      passed = false;
      errorDetails += `Escalation target mismatch: expected "${t.expectedTarget}", got "${decision.escalationTarget}". `;
    }

    if (passed) passedCount++;

    details.push({
      name: t.name,
      passed,
      input: t.input,
      category: analysis.category,
      riskLevel: analysis.riskLevel,
      escalationRequired: decision.escalationRequired,
      escalationTarget: decision.escalationTarget,
      expectedCategory: t.expectedCategory,
      expectedRisk: t.expectedRisk,
      expectedEscalation: t.expectedEscalation,
      expectedTarget: t.expectedTarget,
      errorDetails: errorDetails || undefined
    });
  }

  // AI Adapter Fallback test case
  let fallbackPassed = true;
  let fallbackError = "";
  try {
    const fallbackResponse = await generateAIResponse(
      "A spectator in Sector 104 suddenly fainted.",
      {
        category: "MEDICAL",
        riskLevel: "EMERGENCY",
        intent: "REPORT",
        detectedLanguage: "en",
        missingDetails: []
      },
      {
        escalationRequired: true,
        escalationTarget: "Paramedics / EMS Dispatch",
        recommendedActionPath: "Trigger Medical emergency dispatch",
        deterministicSteps: [],
        safetyWarnings: [],
        operationalReasoning: ""
      },
      true // force fallback bypass AI
    );

    if (!fallbackResponse.recommendation || !fallbackResponse.script || fallbackResponse.nextSteps.length === 0) {
      fallbackPassed = false;
      fallbackError = "Local AI fallback responses are incomplete or empty.";
    }
  } catch (err: any) {
    fallbackPassed = false;
    fallbackError = err.message || "Failed running offline fallback adapter.";
  }

  if (fallbackPassed) passedCount++;
  details.push({
    name: "GenAI Unavailable Fallback Verification",
    passed: fallbackPassed,
    input: "A spectator in Sector 104 suddenly fainted.",
    category: "MEDICAL",
    riskLevel: "EMERGENCY",
    escalationRequired: true,
    escalationTarget: "Paramedics / EMS Dispatch",
    expectedCategory: "MEDICAL",
    expectedRisk: "EMERGENCY",
    expectedEscalation: true,
    expectedTarget: "Paramedics / EMS Dispatch",
    errorDetails: fallbackError || undefined
  });

  return {
    passed: passedCount,
    total: TEST_CASES.length + 1,
    details
  };
}
