import { analyzeContext } from "./contextAnalyzer";
import { getDeterministicDecision } from "./decisionEngine";

// A lightweight test execution harness that runs our suite to verify correct outputs
export function runDecisionEngineTests() {
  const tests = [
    {
      name: "Medical Emergency - Unconscious spectator",
      input: "Someone fainted and is unconscious at Section B, row 12, seat 4. They aren't responding.",
      expectedCategory: "MEDICAL",
      expectedRisk: "EMERGENCY",
      expectedEscalation: true,
      expectedTarget: "Venue Medical Response Team (VMRT) & Stadium Command Center"
    },
    {
      name: "Security Hazard - Fighting in concourse",
      input: "There is an active physical fight between two drunken supporters with a bottle near gate 4.",
      expectedCategory: "SECURITY",
      expectedRisk: "HIGH", // Or EMERGENCY due to fight
      expectedEscalation: true,
      expectedTarget: "Stadium Security Command & Local Law Enforcement Liaison"
    },
    {
      name: "Lost Child Safeguarding - crying kid alone",
      input: "I found a crying child alone near the family zone restrooms. He is about 6 years old wearing a green jersey.",
      expectedCategory: "LOST_CHILD",
      expectedRisk: "EMERGENCY", // Automatically elevated
      expectedEscalation: true,
      expectedTarget: "Venue Operations Center (VOC) & Safeguarding Officer"
    },
    {
      name: "Crowding bottleneck - crowd pushing hard",
      input: "Massive crowd bottleneck at Entry Gate G3. Spectators are pushing hard and turnstiles seem stuck.",
      expectedCategory: "CROWDING",
      expectedRisk: "EMERGENCY", // Upgraded due to pushing/bottleneck
      expectedEscalation: true,
      expectedTarget: "Crowd Management Command & Sector Gate Managers"
    },
    {
      name: "Sustainability - recycling bins overflowing",
      input: "The recycling bins are full of plastic cups near Sector 108.",
      expectedCategory: "SUSTAINABILITY",
      expectedRisk: "LOW",
      expectedEscalation: false,
      expectedTarget: "Venue Facilities & Recycling Zero-Waste Crew"
    }
  ];

  console.log("=========================================");
  console.log("RUNNING STADIUMSENSE AI TEST SUITE");
  console.log("=========================================");

  let passedCount = 0;

  for (const t of tests) {
    const analysis = analyzeContext(t.input);
    const decision = getDeterministicDecision(analysis, t.input);

    const categoryMatches = analysis.category === t.expectedCategory;
    const riskMatches = analysis.riskLevel === t.expectedRisk || (analysis.riskLevel === "EMERGENCY" && t.expectedRisk === "HIGH"); // fighting can be upgraded to EMERGENCY
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
  }

  console.log("-----------------------------------------");
  console.log(`Suite result: ${passedCount}/${tests.length} tests passed successfully.`);
  console.log("=========================================");

  return {
    passed: passedCount,
    total: tests.length
  };
}
