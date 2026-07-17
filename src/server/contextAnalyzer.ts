import { ContextAnalysis } from "../shared/types";

export function analyzeContext(text: string): ContextAnalysis {
  const normalized = text.toLowerCase();

  // 1. Language Detection based on key operational terms
  let detectedLanguage: ContextAnalysis["detectedLanguage"] = "en";
  
  const langKeywords: Record<ContextAnalysis["detectedLanguage"], string[]> = {
    es: ["ayuda", "perdido", "baño", "medico", "médico", "pelea", "niño", "niña", "gracias", "por favor"],
    fr: ["aide", "perdu", "toilette", "médical", "bagarre", "enfant", "merci", "s'il vous plaît", "s'il vous plait"],
    de: ["hilfe", "verloren", "toilette", "medizin", "streit", "kind", "danke", "bitte"],
    pt: ["ajuda", "perdido", "banheiro", "médico", "briga", "criança", "obrigado", "por favor"],
    ja: ["助けて", "迷子", "トイレ", "医療", "喧嘩", "子供", "ありがとうございます", "おねがい", "tasukete", "maigo"],
    zh: ["帮助", "迷路", "厕所", "医疗", "打架", "孩子", "谢谢", "请", "bangzhu", "milu"],
    ko: ["도와줘", "미아", "화장실", "의료", "싸움", "아이", "감사합니다", "부탁", "dowa", "mia"],
    ar: ["مساعدة", "مفقود", "مرحاض", "طبي", "قتال", "طفل", "شكرا", "من فضلك", "musada", "mafqud"],
    en: ["help", "lost", "restroom", "medical", "fight", "child", "thanks", "please"]
  };

  for (const [lang, keywords] of Object.entries(langKeywords)) {
    if (lang === "en") continue;
    if (keywords.some(kw => normalized.includes(kw))) {
      detectedLanguage = lang as ContextAnalysis["detectedLanguage"];
      break;
    }
  }

  // 2. Category Detection
  let category: ContextAnalysis["category"] = "GENERAL";

  const keywordsMedical = [
    "heart", "attack", "faint", "injury", "injured", "chest", "breathing", "bleeding", "blood", "unconscious", 
    "pain", "sick", "doctor", "paramedic", "stretcher", "cpr", "allergic", "bee", "stroke", "seizure", 
    "medico", "médico", "médical", "medizin", "طبي", "의료", "医疗", "医療"
  ];
  const keywordsSecurity = [
    "fight", "weapon", "gun", "knife", "theft", "stolen", "robbed", "trespass", "arrest", "alcohol", 
    "drunk", "brawl", "smoke", "fire", "bomb", "suspect", "baggage", "unattended bag", "backpack left", 
    "violence", "pelea", "bagarre", "streit", "briga", "喧嘩", "打架", "싸움", "قتال"
  ];
  const keywordsAccessibility = [
    "wheelchair", "ramp", "elevator", "blind", "deaf", "guide", "cart", "lift", "assistance", 
    "disabled", "accessible", "stairlift", "sign language", "mobility"
  ];
  const keywordsLostChild = [
    "lost child", "lost parent", "missing boy", "missing girl", "separated", "kid", "daughter", "son", 
    "crying child", "child alone", "toddler", "niño", "niña", "enfant", "kind", "criança", "子供", "孩子", 
    "아이", "طفل", "maigo", "mia"
  ];
  const keywordsLostItem = [
    "lost phone", "lost wallet", "lost keys", "lost passport", "lost ticket", "credit card", "purse", 
    "backpack", "phone missing", "wallet missing", "lost bag", "perdu", "verloren", "perdido", "مفقود"
  ];
  const keywordsCrowding = [
    "bottleneck", "crush", "crowd", "packed", "stadium entry", 
    "stairwell", "congestion", "overcrowded", "pushing", "cannot move", "stuck"
  ];
  const keywordsSustainability = [
    "recycle", "waste", "trash", "plastic", "bottle", "bin", "compost", "cup", "green", "environmental", 
    "eco", "garbage", "litter", "sorting", "zero waste"
  ];
  const keywordsMultilingual = [
    "no english", "translate", "language", "translator", "speak english", "spanish", "french", "german", 
    "portuguese", "japanese", "chinese", "korean", "arabic", "communication barrier"
  ];
  const keywordsNavigation = [
    "navigation", "where is gate", "how do i get to", "find my seat", "direction to", 
    "where is sector", "where is seat", "how to reach", "locate gate", "stadium entrance", 
    "exit route", "where is restroom", "where is bathroom", "toilet location", "find restroom"
  ];
  const keywordsTransport = [
    "transport", "shuttle", "parking", "bus", "metro", "train", "taxi", "uber", 
    "lyft", "transit", "subway", "ride share", "rideshare", "station", "car park", 
    "airport shuttle"
  ];

  if (keywordsMedical.some(kw => normalized.includes(kw))) {
    category = "MEDICAL";
  } else if (keywordsSecurity.some(kw => normalized.includes(kw))) {
    category = "SECURITY";
  } else if (keywordsLostChild.some(kw => normalized.includes(kw))) {
    category = "LOST_CHILD";
  } else if (keywordsAccessibility.some(kw => normalized.includes(kw))) {
    category = "ACCESSIBILITY";
  } else if (keywordsCrowding.some(kw => normalized.includes(kw))) {
    category = "CROWDING";
  } else if (keywordsLostItem.some(kw => normalized.includes(kw))) {
    category = "LOST_ITEM";
  } else if (keywordsSustainability.some(kw => normalized.includes(kw))) {
    category = "SUSTAINABILITY";
  } else if (keywordsTransport.some(kw => normalized.includes(kw))) {
    category = "TRANSPORT";
  } else if (keywordsNavigation.some(kw => normalized.includes(kw))) {
    category = "NAVIGATION";
  } else if (keywordsMultilingual.some(kw => normalized.includes(kw)) || detectedLanguage !== "en") {
    category = "MULTILINGUAL";
  }

  // 3. Risk Level Assessment
  let riskLevel: ContextAnalysis["riskLevel"] = "LOW";

  // Critical Emergency Keywords (Immediate threat to life or severe safety breach)
  const emergencyKeywords = [
    "unconscious", "not breathing", "heart attack", "bleeding heavily", "weapon", "gun", "knife", 
    "bomb", "fire", "crush", "pushing hard", "suffocating", "active fight", "lost child", "lost kid"
  ];
  // High Risk Keywords (Injured but conscious, minor fight, unattended bag in crowds, elevator broken)
  const highKeywords = [
    "stolen", "fight", "injury", "injured", "pain", "allergic", "cannot breathe", "separated", 
    "wheelchair blocked", "wheelchair stuck", "ramp blocked", "ramp is blocked", "elevator broken",
    "unattended bag", "exit blocked", "pushing", "overcrowded", "stuck in elevator"
  ];
  // Medium Risk Keywords (Lost items, full bins, minor navigation, languages)
  const mediumKeywords = [
    "lost wallet", "lost phone", "lost passport", "lost ticket", "broken seat", "trash overflowing", 
    "bin full", "cannot find seat", "need translator"
  ];

  if (emergencyKeywords.some(kw => normalized.includes(kw)) || category === "MEDICAL" && normalized.includes("unconscious") || category === "LOST_CHILD") {
    riskLevel = "EMERGENCY";
  } else if (highKeywords.some(kw => normalized.includes(kw)) || category === "SECURITY" || category === "CROWDING") {
    riskLevel = "HIGH";
  } else if (mediumKeywords.some(kw => normalized.includes(kw)) || category === "ACCESSIBILITY" || category === "LOST_ITEM" || category === "MULTILINGUAL") {
    riskLevel = "MEDIUM";
  } else {
    riskLevel = "LOW";
  }

  // 4. Intent Detection
  let intent: ContextAnalysis["intent"] = "ASK";
  
  const reportIndicators = ["is", "there is", "reporting", "saw", "happened", "fight", "bleeding", "broken", "spilled", "overflowing", "locked", "blocked"];
  const requestHelpIndicators = ["need", "help me", "can i get", "looking for", "lost", "where is my", "please find", "assist", "want", "require"];
  const askIndicators = ["where", "how", "can i", "is there", "what time", "schedule", "info", "guideline", "policy"];

  if (requestHelpIndicators.some(kw => normalized.includes(kw))) {
    intent = "REQUEST_HELP";
  } else if (reportIndicators.some(kw => normalized.includes(kw))) {
    intent = "REPORT";
  } else if (askIndicators.some(kw => normalized.includes(kw))) {
    intent = "ASK";
  }

  // 5. Missing Details Checklist formulation
  const missingDetails: string[] = [];

  const hasLocation = /\b(gate|sector|block|row|seat|section|entrance|concourse|tunnel|zone|toilet|restroom|concession)\b/i.test(normalized) || /\b[a-z]\d{1,3}\b/i.test(normalized);

  if (!hasLocation) {
    missingDetails.push("Exact location inside the stadium (e.g. Sector, Row, Seat, Gate, or Concourse zone)");
  }

  if (category === "MEDICAL") {
    if (!normalized.includes("conscious") && !normalized.includes("awake") && !normalized.includes("unconscious") && !normalized.includes("breathing")) {
      missingDetails.push("Is the person conscious and breathing normally?");
    }
    if (!/\b(symptom|pain|bleed|hurt|faint|fall|allerg)\b/i.test(normalized)) {
      missingDetails.push("Specific symptoms or nature of the injury (e.g. chest pain, bleeding, fall)");
    }
    if (!/\b(age|man|woman|child|boy|girl|years old)\b/i.test(normalized)) {
      missingDetails.push("Approximate age and gender of the patient");
    }
  } else if (category === "SECURITY") {
    if (!/\b(many|people|guy|person|crowd|group)\b/i.test(normalized) && !/\d+/.test(normalized)) {
      missingDetails.push("Number of individuals involved in the incident");
    }
    if (!normalized.includes("weapon") && !normalized.includes("gun") && !normalized.includes("knife") && !normalized.includes("fist")) {
      missingDetails.push("Are there visible weapons or active violence?");
    }
    if (!/\b(description|wearing|shirt|jacket|hat|tall|height)\b/i.test(normalized)) {
      missingDetails.push("Physical description or clothing of the key suspect(s)");
    }
  } else if (category === "LOST_CHILD") {
    if (!/\b(name|called)\b/i.test(normalized)) {
      missingDetails.push("Child's full name and nickname");
    }
    if (!/\b(\d+|years old|age)\b/i.test(normalized)) {
      missingDetails.push("Child's age");
    }
    if (!/\b(wearing|shirt|pants|jacket|color|blue|red|green|white|black|yellow)\b/i.test(normalized)) {
      missingDetails.push("Description of what the child is wearing (especially clothing color)");
    }
    if (!/\b(last seen|lost at|separated at|where)\b/i.test(normalized)) {
      missingDetails.push("Last seen location and elapsed time since separation");
    }
  } else if (category === "LOST_ITEM") {
    if (!/\b(color|brand|black|iphone|samsung|leather|metal|plastic|size)\b/i.test(normalized)) {
      missingDetails.push("Distinctive features of the item (color, brand, serial number, or markings)");
    }
    if (!/\b(lost at|left in|where|forgot|dropped)\b/i.test(normalized)) {
      missingDetails.push("Where and approximately when the item was last seen");
    }
  } else if (category === "CROWDING") {
    if (!normalized.includes("gate") && !normalized.includes("turnstile") && !normalized.includes("stairwell") && !normalized.includes("concourse")) {
      missingDetails.push("Specific bottleneck structure (e.g., Gate entry, turnstile, stairwell, or exit tunnel)");
    }
    if (!normalized.includes("push") && !normalized.includes("fall") && !normalized.includes("stuck") && !normalized.includes("flow")) {
      missingDetails.push("Are people pushing, falling, or are there injuries?");
    }
  } else if (category === "ACCESSIBILITY") {
    if (!/\b(assistance|cart|chair|ramp|help)\b/i.test(normalized)) {
      missingDetails.push("Specific type of mobility/accessibility assistance required");
    }
  } else if (category === "NAVIGATION") {
    if (!hasLocation) {
      missingDetails.push("Exact destination you are trying to reach (e.g. gate number, sector number, specific facility like first aid or restroom)");
    }
    if (!/\b(elevator|wheelchair|ramp|stairs|walk|accessible)\b/i.test(normalized)) {
      missingDetails.push("Are you looking for an elevator/accessible route or standard walking route?");
    }
  } else if (category === "TRANSPORT") {
    if (!hasLocation) {
      missingDetails.push("Nearest gate or exit you are currently at");
    }
    if (!/\b(parking|metro|bus|taxi|uber|shuttle|station)\b/i.test(normalized)) {
      missingDetails.push("Destination details (e.g. specific parking lot, rideshare area, metro transit, airport shuttle)");
    }
  }

  return {
    category,
    riskLevel,
    intent,
    detectedLanguage,
    missingDetails
  };
}
