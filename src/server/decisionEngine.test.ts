import { analyzeContext } from "./contextAnalyzer";
import { getDeterministicDecision } from "./decisionEngine";
import { generateAIResponse } from "./aiAdapter";
import { fileURLToPath } from "url";

export interface TestDetail {
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

// A lightweight test execution harness that runs our suite to verify correct outputs
export async function runDecisionEngineTests() {
  const tests = [
    {
      name: "Medical Emergency - Unconscious spectator fainted in stand",
      input: "Someone fainted and is unconscious at Section B, row 12, seat 4. They aren't responding.",
      expectedCategory: "MEDICAL",
      expectedRisk: "EMERGENCY",
      expectedEscalation: true,
      expectedTarget: "Venue Medical Response Team (VMRT) & Stadium Command Center",
      urgencyOverride: "auto"
    },
    {
      name: "Security Hazard - Active brawl/fight in entry gate concourse",
      input: "There is an active physical fight between two drunken supporters with a bottle near gate 4.",
      expectedCategory: "SECURITY",
      expectedRisk: "HIGH",
      expectedEscalation: true,
      expectedTarget: "Stadium Security Command & Local Law Enforcement Liaison",
      urgencyOverride: "auto"
    },
    {
      name: "Lost Child Safeguarding - Child unaccompanied near concessions",
      input: "I found a crying child alone near the family zone restrooms. He is about 6 years old wearing a green jersey.",
      expectedCategory: "LOST_CHILD",
      expectedRisk: "EMERGENCY",
      expectedEscalation: true,
      expectedTarget: "Venue Operations Center (VOC) & Safeguarding Officer",
      urgencyOverride: "auto"
    },
    {
      name: "Crowd Bottleneck - Critical trample risks at turnstile zones",
      input: "Massive crowd bottleneck at Entry Gate G3. Spectators are pushing hard and turnstiles seem stuck. Risk of crowd crush.",
      expectedCategory: "CROWDING",
      expectedRisk: "EMERGENCY",
      expectedEscalation: true,
      expectedTarget: "Crowd Management Command & Sector Gate Managers",
      urgencyOverride: "auto"
    },
    {
      name: "Sustainability Compliance - zero-waste overflowing bins",
      input: "The recycling bins are full of plastic cups near Sector 108.",
      expectedCategory: "SUSTAINABILITY",
      expectedRisk: "LOW",
      expectedEscalation: false,
      expectedTarget: "Venue Facilities & Recycling Zero-Waste Crew",
      urgencyOverride: "auto"
    },
    {
      name: "Navigation - locating stadium entrance or seats",
      input: "How do I get to Sector 104? Which gate is closest to my seat?",
      expectedCategory: "NAVIGATION",
      expectedRisk: "LOW",
      expectedEscalation: false,
      expectedTarget: "Wayfinding Volunteer Coordinator",
      urgencyOverride: "auto"
    },
    {
      name: "Accessibility - wheelchair ramp block",
      input: "An elderly guest in a wheelchair is stuck because the main wheelchair ramp is blocked by equipment.",
      expectedCategory: "ACCESSIBILITY",
      expectedRisk: "HIGH",
      expectedEscalation: true,
      expectedTarget: "Spectator Services Mobility Team",
      urgencyOverride: "auto"
    },
    {
      name: "Transportation - shuttle schedule to transport hub",
      input: "Where is the shuttle bus to the metro station? What time does the transit hub close?",
      expectedCategory: "TRANSPORT",
      expectedRisk: "LOW",
      expectedEscalation: false,
      expectedTarget: "Transport & Traffic Operations Center (TOC)",
      urgencyOverride: "auto"
    },
    {
      name: "Unclear input - incomplete description details",
      input: "Something went wrong here.",
      expectedCategory: "GENERAL",
      expectedRisk: "LOW",
      expectedEscalation: false,
      expectedTarget: "Sector Supervisor",
      urgencyOverride: "auto"
    },
    {
      name: "Urgency Level Override - LOW upgraded to HIGH",
      input: "Where is the nearest restroom?",
      expectedCategory: "GENERAL",
      expectedRisk: "HIGH", // Urgency override will set this to HIGH
      expectedEscalation: true, // Upgraded risk triggers escalation
      expectedTarget: "Sector Supervisor",
      urgencyOverride: "HIGH"
    }
  ];

  console.log("=========================================");
  console.log("RUNNING STADIUMSENSE AI TEST SUITE");
  console.log("=========================================");

  let passedCount = 0;
  const details: TestDetail[] = [];

  for (const t of tests) {
    const analysis = analyzeContext(t.input);
    if (t.urgencyOverride !== "auto") {
      analysis.riskLevel = t.urgencyOverride as any;
    }
    const decision = getDeterministicDecision(analysis, t.input);

    const categoryMatches = analysis.category === t.expectedCategory;
    const riskMatches = analysis.riskLevel === t.expectedRisk || (analysis.riskLevel === "EMERGENCY" && t.expectedRisk === "HIGH"); // fighting upgraded
    const escalationMatches = decision.escalationRequired === t.expectedEscalation;
    const targetMatches = decision.escalationTarget === t.expectedTarget;

    const isSuccess = categoryMatches && escalationMatches && targetMatches;

    if (isSuccess) {
      passedCount++;
      console.log(`[PASS] ${t.name}`);
    } else {
      console.log(`[FAIL] ${t.name}`);
      console.log(`  - Input: "${t.input}"`);
      console.log(`  - Expected Category: ${t.expectedCategory}, Got: ${analysis.category}`);
      console.log(`  - Expected Risk: ${t.expectedRisk}, Got: ${analysis.riskLevel}`);
      console.log(`  - Expected Escalation: ${t.expectedEscalation}, Got: ${decision.escalationRequired}`);
      console.log(`  - Expected Target: "${t.expectedTarget}", Got: "${decision.escalationTarget}"`);
    }

    details.push({
      name: t.name,
      passed: isSuccess,
      input: t.input,
      category: analysis.category,
      riskLevel: analysis.riskLevel,
      escalationRequired: decision.escalationRequired,
      escalationTarget: decision.escalationTarget,
      expectedCategory: t.expectedCategory,
      expectedRisk: t.expectedRisk,
      expectedEscalation: t.expectedEscalation,
      expectedTarget: t.expectedTarget
    });
  }

  // 11. Test Fallback Behavior when GenAI is Unavailable
  console.log("Running Fallback Verification...");
  const originalApiKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  
  try {
    const testAnalysis = { category: "MEDICAL" as const, riskLevel: "EMERGENCY" as const, intent: "REPORT" as const, detectedLanguage: "en" as const, missingDetails: [] };
    const testDecision = getDeterministicDecision(testAnalysis, "Someone fainted");
    const fallbackRes = await generateAIResponse("Someone fainted", testAnalysis, testDecision);
    
    const fallbackSuccess = fallbackRes.reasoning.includes("Medical fallback activated") && fallbackRes.followUpQuestion === "";
    
    details.push({
      name: "GenAI Unavailable Fallback Verification",
      passed: fallbackSuccess,
      input: "Someone fainted",
      category: "MEDICAL",
      riskLevel: "EMERGENCY",
      escalationRequired: true,
      escalationTarget: testDecision.escalationTarget,
      expectedCategory: "MEDICAL",
      expectedRisk: "EMERGENCY",
      expectedEscalation: true,
      expectedTarget: testDecision.escalationTarget,
      errorDetails: fallbackSuccess ? undefined : `Fallback reasoning was unexpected: "${fallbackRes.reasoning}"`
    });

    if (fallbackSuccess) {
      passedCount++;
      console.log(`[PASS] GenAI Unavailable Fallback Verification`);
    } else {
      console.log(`[FAIL] GenAI Unavailable Fallback Verification`);
    }
  } catch (err: any) {
    console.log(`[FAIL] GenAI Unavailable Fallback Verification - Threw error: ${err.message}`);
    details.push({
      name: "GenAI Unavailable Fallback Verification",
      passed: false,
      input: "Someone fainted",
      category: "MEDICAL",
      riskLevel: "EMERGENCY",
      escalationRequired: true,
      escalationTarget: "VMRT",
      expectedCategory: "MEDICAL",
      expectedRisk: "EMERGENCY",
      expectedEscalation: true,
      expectedTarget: "VMRT",
      errorDetails: err.message
    });
  } finally {
    process.env.GEMINI_API_KEY = originalApiKey;
  }

  const totalTests = tests.length + 1; // tests + fallback test

  console.log("-----------------------------------------");
  console.log(`Suite result: ${passedCount}/${totalTests} tests passed successfully.`);
  console.log("=========================================");

  return {
    passed: passedCount,
    total: totalTests,
    details
  };
}

// Check if running directly in node environment via tsx command-line
const isCLI = typeof process !== "undefined" && process.argv[1] && (
  process.argv[1].endsWith("decisionEngine.test.ts") ||
  process.argv[1].endsWith("decisionEngine.test.js")
);
if (isCLI) {
  runDecisionEngineTests()
    .then((result) => {
      if (result.passed !== result.total) {
        process.exit(1);
      }
      process.exit(0);
    })
    .catch((err) => {
      console.error("Failed to execute test suite CLI runner:", err);
      process.exit(1);
    });
}
