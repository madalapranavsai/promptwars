export interface ContextAnalysis {
  category: "MEDICAL" | "SECURITY" | "ACCESSIBILITY" | "LOST_CHILD" | "LOST_ITEM" | "CROWDING" | "SUSTAINABILITY" | "MULTILINGUAL" | "TRANSPORT" | "NAVIGATION" | "GENERAL";
  riskLevel: "EMERGENCY" | "HIGH" | "MEDIUM" | "LOW";
  intent: "REPORT" | "REQUEST_HELP" | "ASK";
  detectedLanguage: "en" | "es" | "fr" | "de" | "pt" | "ja" | "zh" | "ko" | "ar";
  missingDetails: string[];
}

export interface DecisionResult {
  escalationRequired: boolean;
  escalationTarget: string;
  recommendedActionPath: string;
  deterministicSteps: string[];
  safetyWarnings: string[];
  operationalReasoning: string;
}

export interface AIResult {
  recommendation: string;
  script: string;
  nextSteps: string[];
  reasoning: string;
  followUpQuestion: string;
}

export interface LocalizedScript {
  languageName: string;
  greeting: string;
  reassurance: string;
  locationPrompt: string;
  actionDirective: string;
  closing: string;
}

export interface FinalResponse {
  analysis: ContextAnalysis;
  decision: DecisionResult;
  aiOutput: AIResult;
  localizedScripts: Record<string, LocalizedScript>;
  timestamp: string;
}

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

export interface TestSuiteResults {
  passed: number;
  total: number;
  details: TestDetail[];
}

export interface IncidentRecord {
  id: string;
  timestamp: string;
  situation: string;
  category: string;
  riskLevel: string;
  recommendation: string;
}
