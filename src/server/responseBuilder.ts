import { analyzeContext } from "./contextAnalyzer";
import { getDeterministicDecision } from "./decisionEngine";
import { generateAIResponse } from "./aiAdapter";
import { 
  ContextAnalysis, 
  LocalizedScript, 
  FinalResponse, 
  IncidentRecord 
} from "../shared/types";

export const incidentHistory: IncidentRecord[] = [];

// Full translation dictionary supporting all 9 languages
const translationDictionary: Record<string, { languageName: string } & Omit<LocalizedScript, "languageName">> = {
  en: {
    languageName: "English",
    greeting: "Hello, my name is a Stadium Volunteer. I am here to assist you.",
    reassurance: "Please stay calm. Our operations team has been notified and help is on the way.",
    locationPrompt: "Could you please show me your ticket or point to your seat sector on this map?",
    actionDirective: "Please follow me to a safe, designated waiting area.",
    closing: "Thank you for your cooperation. We will resolve this situation together."
  },
  es: {
    languageName: "Spanish (Español)",
    greeting: "Hola, mi nombre es un Voluntario del Estadio. Estoy aquí para ayudarte.",
    reassurance: "Por favor, mantén la calma. Nuestro equipo de operaciones ha sido notificado y la ayuda está en camino.",
    locationPrompt: "¿Podrías mostrarme tu boleto o señalar tu sector de asientos en este mapa?",
    actionDirective: "Por favor, sígueme a una zona de espera segura y designada.",
    closing: "Gracias por tu cooperación. Resolveremos esta situación juntos."
  },
  fr: {
    languageName: "French (Français)",
    greeting: "Bonjour, je suis un Volontaire du Stade. Je suis là pour vous aider.",
    reassurance: "S'il vous plaît, restez calme. Notre équipe d'opérations a été prévenue et les secours arrivent.",
    locationPrompt: "Pourriez-vous me montrer votre billet ou indiquer votre secteur de siège sur ce plan ?",
    actionDirective: "S'il vous plaît, suivez-moi vers une zone d'attente sécurisée.",
    closing: "Merci pour votre coopération. Nous allons résoudre cette situation ensemble."
  },
  de: {
    languageName: "German (Deutsch)",
    greeting: "Hallo, ich bin ein Stadion-Freiwilliger. Ich bin hier, um Ihnen zu helfen.",
    reassurance: "Bitte bleiben Sie ruhig. Unser Einsatzteam wurde benachrichtigt und Hilfe ist unterwegs.",
    locationPrompt: "Könnten Sie mir bitte Ihr Ticket zeigen oder Ihren Sitzbereich auf dieser Karte markieren?",
    actionDirective: "Bitte folgen Sie mir zu einem sicheren, ausgewiesenen Wartebereich.",
    closing: "Vielen Dank für Ihre Kooperation. Wir werden diese Situation gemeinsam lösen."
  },
  pt: {
    languageName: "Portuguese (Português)",
    greeting: "Olá, meu nome é um Voluntário do Estádio. Estou aqui para ajudar.",
    reassurance: "Por favor, mantenha a calma. Nossa equipe de operações foi notificada e a ajuda está a caminho.",
    locationPrompt: "Você poderia me mostrar seu ingresso ou apontar o seu setor de assento neste mapa?",
    actionDirective: "Por favor, siga-me até uma área de espera segura e designada.",
    closing: "Obrigado pela sua cooperação. Resolveremos esta situação juntos."
  },
  ja: {
    languageName: "Japanese (日本語)",
    greeting: "こんにちは、スタジアムボランティアの者です。お手伝いいたします。",
    reassurance: "落ち着いてください。運営チームに連絡が届き、現在支援が向かっています。",
    locationPrompt: "チケットを見せていただくか、マップ上で座席セクションを教えていただけますか？",
    actionDirective: "安全な指定の待機エリアまで私についてきてください。",
    closing: "ご協力ありがとうございます。一緒にこの状況を解決しましょう。"
  },
  zh: {
    languageName: "Chinese (中文)",
    greeting: "您好，我是体育场志愿者。我来为您提供帮助。",
    reassurance: "请保持冷静。我们的运营团队已经收到通知，救援人员正在赶来。",
    locationPrompt: "能请您出示您的门票，或者在这张地图上指出您的座位区域吗？",
    actionDirective: "请跟我前往安全指定的等候区域。",
    closing: "感谢您的配合。我们将共同解决这个问题。"
  },
  ko: {
    languageName: "Korean (한국어)",
    greeting: "안녕하세요, 스타디움 자원봉사자입니다. 도와드리겠습니다.",
    reassurance: "진정하십시오. 운영 팀에 연락이 완료되었으며 지원 조치가 진행 중입니다.",
    locationPrompt: "티켓을 보여주시거나 이 지도에서 좌석 구역을 가리켜 주시겠습니까?",
    actionDirective: "안전하게 지정된 대기 구역으로 저를 따라와 주십시오.",
    closing: "협조해 주셔서 감사합니다. 함께 이 상황을 해결하겠습니다."
  },
  ar: {
    languageName: "Arabic (العربية)",
    greeting: "مرحباً، أنا متطوع في الملعب. أنا هنا لمساعدتك.",
    reassurance: "يرجى الحفاظ على الهدوء. لقد تم إخطار فريق العمليات والمساعدة في الطريق إليك.",
    locationPrompt: "هل يمكنك من فضلك إظهار تذكرتك أو الإشارة إلى منطقة مقعدك على هذه الخريطة؟",
    actionDirective: "يرجى اتباعي إلى منطقة الانتظار الآمنة والمحددة.",
    closing: "نشكرك على تعاونك. سوف نحل هذا الموقف معاً."
  }
};

interface CacheEntry {
  response: FinalResponse;
  expiresAt: number;
}

const responseCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

export async function buildFullResponse(
  userText: string,
  userMetadata?: {
    role?: string;
    zone?: string;
    urgencyOverride?: string;
    targetLanguage?: string;
    bypassCache?: boolean;
  },
  bypassAI?: boolean
): Promise<FinalResponse> {
  const cacheKey = JSON.stringify({
    text: userText.trim(),
    role: userMetadata?.role || "",
    zone: userMetadata?.zone || "",
    urgencyOverride: userMetadata?.urgencyOverride || "auto",
    targetLanguage: userMetadata?.targetLanguage || "auto"
  });

  const now = Date.now();
  if (!userMetadata?.bypassCache) {
    const cached = responseCache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      return {
        ...cached.response,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 1. Analyze context using rule-based keyword system
  const analysis = analyzeContext(userText);

  // Apply user overrides if selected in frontend
  if (userMetadata?.urgencyOverride && userMetadata.urgencyOverride !== "auto") {
    analysis.riskLevel = userMetadata.urgencyOverride as ContextAnalysis["riskLevel"];
  }
  if (userMetadata?.targetLanguage && userMetadata.targetLanguage !== "auto") {
    analysis.detectedLanguage = userMetadata.targetLanguage as ContextAnalysis["detectedLanguage"];
  }

  // 2. Compute deterministic decisions & safety routes
  const decision = getDeterministicDecision(analysis, userText);

  // 3. Request LLM AI Directives (with rule fallback)
  const aiOutput = await generateAIResponse(userText, analysis, decision, bypassAI);

  // 4. Gather localized sheets for volunteers (Bilingual support)
  const localizedScripts: Record<string, LocalizedScript> = {};

  // Always generate English sheet
  localizedScripts["en"] = {
    languageName: "English",
    ...translationDictionary["en"]
  };

  // If detected/target language is not English, add the target language sheet too!
  const targetLang = analysis.detectedLanguage;
  if (targetLang !== "en" && translationDictionary[targetLang]) {
    localizedScripts[targetLang] = {
      languageName: translationDictionary[targetLang].languageName,
      ...translationDictionary[targetLang]
    };
  }

  // Also include Spanish as the general matchday standby if not already included
  if (targetLang !== "es") {
    localizedScripts["es"] = {
      languageName: translationDictionary["es"].languageName,
      ...translationDictionary["es"]
    };
  }

  const result: FinalResponse = {
    analysis,
    decision,
    aiOutput,
    localizedScripts,
    timestamp: new Date().toISOString()
  };

  // Enforce size cap cache eviction (FIFO)
  if (responseCache.size >= 100) {
    const firstKey = responseCache.keys().next().value;
    if (firstKey !== undefined) {
      responseCache.delete(firstKey);
    }
  }

  responseCache.set(cacheKey, {
    response: result,
    expiresAt: Date.now() + CACHE_TTL_MS
  });

  // Record incident to memory history log
  const record: IncidentRecord = {
    id: Math.random().toString(36).substring(2, 11),
    timestamp: result.timestamp,
    situation: userText,
    category: result.analysis.category,
    riskLevel: result.analysis.riskLevel,
    recommendation: result.aiOutput.recommendation
  };
  incidentHistory.push(record);
  if (incidentHistory.length > 50) {
    incidentHistory.shift();
  }

  return result;
}
