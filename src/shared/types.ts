export type CategoryType = "MEDICAL" | "SECURITY" | "ACCESSIBILITY" | "LOST_CHILD" | "LOST_ITEM" | "CROWDING" | "SUSTAINABILITY" | "MULTILINGUAL" | "TRANSPORT" | "NAVIGATION" | "GENERAL";
export type RiskLevelType = "EMERGENCY" | "HIGH" | "MEDIUM" | "LOW";

export interface ContextAnalysis {
  category: CategoryType;
  riskLevel: RiskLevelType;
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
  category: CategoryType;
  riskLevel: RiskLevelType;
  escalationRequired: boolean;
  escalationTarget: string;
  expectedCategory: CategoryType;
  expectedRisk: RiskLevelType;
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
  category: CategoryType;
  riskLevel: RiskLevelType;
  recommendation: string;
}
