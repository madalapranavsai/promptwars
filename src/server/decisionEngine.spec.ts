import { describe, it, expect } from "vitest";
import { analyzeContext } from "./contextAnalyzer";
import { getDeterministicDecision } from "./decisionEngine";
import { generateAIResponse } from "./aiAdapter";
import { TEST_CASES } from "./diagnosticsRunner";

// Vitest suite definition
describe("StadiumSense AI Safety Logic", () => {
  it("passes all 10 deterministic incident category and urgency override scenarios", () => {
    for (const t of TEST_CASES) {
      const analysis = analyzeContext(t.input);
      if (t.urgencyOverride) {
        analysis.riskLevel = t.urgencyOverride as "EMERGENCY" | "HIGH" | "MEDIUM" | "LOW";
      }
      const decision = getDeterministicDecision(analysis, t.input);

      expect(analysis.category).toBe(t.expectedCategory);
      expect(analysis.riskLevel).toBe(t.expectedRisk);
      expect(decision.escalationRequired).toBe(t.expectedEscalation);
      expect(decision.escalationTarget).toBe(t.expectedTarget);
    }
  });

  it("successfully resolves localized templates when GenAI is bypassed/offline", async () => {
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
      true // force fallback
    );

    expect(fallbackResponse.recommendation).toBeDefined();
    expect(fallbackResponse.script).toBeDefined();
    expect(fallbackResponse.nextSteps.length).toBeGreaterThan(0);
  });
});
