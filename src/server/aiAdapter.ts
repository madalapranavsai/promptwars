import { GoogleGenAI, Type } from "@google/genai";
import { ContextAnalysis, DecisionResult, AIResult } from "../shared/types";

let aiInstance: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI | null {
  if (!aiInstance && process.env.GEMINI_API_KEY) {
    aiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

export async function generateAIResponse(
  userText: string,
  analysis: ContextAnalysis,
  decision: DecisionResult,
  bypassAI?: boolean
): Promise<AIResult> {
  const ai = bypassAI ? null : getGemini();

  const prompt = `
You are the AI engine for StadiumSense AI, a matchday operations copilot for the 2026 World Cup stadiums.
Your role is to formulate high-performance, real-time guidance for venue volunteers and staff.

CONTEXT ANALYSIS:
- Category: ${analysis.category}
- Risk Level: ${analysis.riskLevel}
- Intent: ${analysis.intent}
- Detected Language Code: ${analysis.detectedLanguage}

DETERMINISTIC ESCALATION & ACTIONS:
- Escalation Required: ${decision.escalationRequired}
- Escalation Target: ${decision.escalationTarget}
- Recommended Action Path: ${decision.recommendedActionPath}
- Deterministic Steps to follow:
${decision.deterministicSteps.map(step => `  * ${step}`).join("\n")}
- Safety Warnings:
${decision.safetyWarnings.map(w => `  * ${w}`).join("\n")}

USER REPORTED SITUATION:
"${userText}"

Based on this input, formulate a structured tactical response.
Keep the recommendation action-oriented, the spoken volunteer script highly empathetic and clear (adapted to the tone of a professional FIFA stadium steward), the next steps practical, and provide the technical reasoning behind your choices.
  `;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite stadium operations commander. Your job is to output precise operational directives. You must output JSON that adheres exactly to the specified responseSchema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendation: {
                type: Type.STRING,
                description: "Primary operational recommendation or directive."
              },
              script: {
                type: Type.STRING,
                description: "Exactly what the volunteer should say to the spectators, written in an empathetic, calm, and reassuring tone."
              },
              nextSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Strategic sequence of numbered next steps for the volunteer."
              },
              reasoning: {
                type: Type.STRING,
                description: "Brief professional justification for the recommended approach."
              },
              followUpQuestion: {
                type: Type.STRING,
                description: "A natural follow-up question to ask the user/reporter if there are missing details, or empty string if no details are missing."
              }
            },
            required: ["recommendation", "script", "nextSteps", "reasoning", "followUpQuestion"]
          }
        }
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim()) as AIResult;
        return parsed;
      }
    } catch (error) {
      console.warn("Gemini API call failed, falling back to rule-based engine:", error);
    }
  }

  // Double-guardrail Fallback: High-quality rule-based local generator
  return getLocalFallbackResponse(analysis, decision, userText);
}

function getLocalFallbackResponse(
  analysis: ContextAnalysis,
  decision: DecisionResult,
  userText: string
): AIResult {
  const category = analysis.category;
  
  let followUpQuestion = "";
  if (analysis.missingDetails && analysis.missingDetails.length > 0) {
    const detail = analysis.missingDetails[0];
    if (detail.toLowerCase().includes("location")) {
      followUpQuestion = "Could you please specify your exact location inside the stadium (such as Sector, Row, Seat, or nearest Gate)?";
    } else if (detail.toLowerCase().includes("conscious") || detail.toLowerCase().includes("breathing")) {
      followUpQuestion = "Can you confirm if the spectator is currently conscious and breathing normally?";
    } else if (detail.toLowerCase().includes("injury") || detail.toLowerCase().includes("symptoms")) {
      followUpQuestion = "Could you describe the nature of the injury or any specific symptoms they are showing?";
    } else if (detail.toLowerCase().includes("name")) {
      followUpQuestion = "What is the child's name and approximate age?";
    } else if (detail.toLowerCase().includes("wearing") || detail.toLowerCase().includes("description")) {
      followUpQuestion = "Could you describe what they are wearing or provide any physical descriptions?";
    } else if (detail.toLowerCase().includes("destination")) {
      followUpQuestion = "What is your final destination or transit method (e.g. Rideshare, Metro, Express Bus, or Parking Lot)?";
    } else {
      followUpQuestion = `Could you provide more details about: ${detail}?`;
    }
  }

  let recommendation = `Ensure immediate contact with ${decision.escalationTarget} and follow the ${decision.recommendedActionPath}.`;
  let script = "Hello, my name is a Stadium Volunteer. I have logged your situation and our team is already responding. Please remain calm.";
  let nextSteps = [...decision.deterministicSteps];
  let reasoning = `Deterministic fallback triggered for ${category} (${analysis.riskLevel}). Ensuring strict compliance with venue operating limits.`;

  switch (category) {
    case "MEDICAL":
      recommendation = "Clear the immediate area to facilitate VMRT medical response access.";
      script = "Hello, please stay calm. A medical team has been dispatched and is on their way to this exact location. Let me make you comfortable while we wait. Is anyone with you who knows your medical history?";
      nextSteps = [
        "Create a visual and physical barrier around the patient using volunteer staff.",
        ...decision.deterministicSteps,
        "Continuously check if the patient is breathing and alert Command immediately if status changes."
      ];
      reasoning = "Medical fallback activated. Emphasizes crowd clearance, secondary guideway placement, and vital signs monitoring.";
      break;

    case "SECURITY":
      recommendation = "De-escalate the scene visually, preserve distance, and await Stadium Security Command.";
      script = "Hello, we want to make sure everyone stays safe. Security has been notified and is coming to assist. I ask that we all take a step back and remain calm so we can resolve this peacefully.";
      nextSteps = [
        "Retreat to a safe distance (minimum 10 meters) and keep eyes on the situation.",
        ...decision.deterministicSteps,
        "Record and preserve physical attributes or clothing designs of the active subjects."
      ];
      reasoning = "Security safety fallback. Directs volunteers to avoid direct physical intervention, focusing on spectator separation and detailed surveillance reporting.";
      break;

    case "LOST_CHILD":
      recommendation = "Secure child with dual-volunteer safeguarding supervision and notify Safeguarding Officers.";
      script = "Hi there! Don't worry, you are completely safe here. My name is Stadium Volunteer, and we are going to find your family together. Let's head over to this cozy desk and have a seat while our radio coordinators work on it.";
      nextSteps = [
        "Confirm that another stadium employee or volunteer is co-present with you and the child.",
        ...decision.deterministicSteps,
        "Log the child's descriptive details and trigger the sector-wide perimeter lookouts."
      ];
      reasoning = "Lost child safeguarding fallback. Prioritizes child safety, strict dual-volunteer custody rules, and sector sweeps while preventing naming broadcasts.";
      break;

    case "CROWDING":
      recommendation = "Divert ingress flows to auxiliary corridors and initiate queue metering.";
      script = "Attention fans, please do not push forward. The entry zone is currently at high capacity. For your safety, please follow me to the left where we have secondary gates open with minimal queues.";
      nextSteps = [
        "Physically position yourself at the bottleneck entrance and signal flow changes.",
        ...decision.deterministicSteps,
        "Instruct incoming fans to stop and wait until platform clearance signals are received."
      ];
      reasoning = "Crowd flow optimization fallback. Resolves bottleneck choke points through redirection and active physical signposting.";
      break;

    case "ACCESSIBILITY":
      recommendation = "Deploy a Spectator Services Mobility escort and route through the ramp bypass.";
      script = "Welcome to the stadium! We are here to help make your matchday perfectly smooth. Let me request a golf shuttle to take you right up to your concourse level, and I can accompany you there.";
      nextSteps = [
        "Request mobility dispatch and stay with the spectator at the designated boarding area.",
        ...decision.deterministicSteps,
        "Verify that the guest's ticket category matches the target accessible seating platform."
      ];
      reasoning = "Accessibility fallback. Delivers active personal escorting and mechanical shuttle dispatch to maintain inclusive access routes.";
      break;

    case "LOST_ITEM":
      recommendation = "Secure the item, register it on the Lost & Found portal, and provide claim ticket.";
      script = "I understand how stressful it is to lose your belongings. I have logged the details of your item into our digital tracker. Please visit the main Info Desk on Concourse Level 2 to file the final claim.";
      nextSteps = [
        "Examine the item for visible security hazards without opening pockets.",
        ...decision.deterministicSteps,
        "Hand over the asset to the concourse Lost & Found Supervisor for physical locker registration."
      ];
      reasoning = "Lost item logging fallback. Preserves asset integrity while guiding guests through the formal claim/recovery lifecycle.";
      break;

    case "SUSTAINABILITY":
      recommendation = "Coordinate immediate waste clearing and direct guests to correct sorting bins.";
      script = "Hi there! Thank you for keeping our World Cup stadium green. We are working hard to recycle. Let me show you our smart sorting bins—reusable stadium cups go right here, and plastics go there!";
      nextSteps = [
        ...decision.deterministicSteps,
        "Request the facilities zero-waste team to clear full bins in Sector concourse."
      ];
      reasoning = "Sustainability fallback. Encourages correct waste stream segregation to support stadium zero-waste goals.";
      break;

    case "NAVIGATION":
      recommendation = "Provide clear physical directions to the target sector or stadium facility.";
      script = "Hello! I can certainly help you find your way. That sector is just down this concourse. Keep walking past the concessions and you will see the entry tunnel marked on your right. Let me show you on this map.";
      nextSteps = [...decision.deterministicSteps];
      reasoning = "Standard navigation guidance fallback. Uses visual maps and clear physical signposting.";
      break;

    case "TRANSPORT":
      recommendation = "Direct the guest to the designated stadium transport hub or rideshare zones.";
      script = "Hello! The stadium express shuttle buses and transit stations are departing from the main transit hub outside Gate E. If you follow the main walkway outside, you will see signs for the Transport Hub.";
      nextSteps = [...decision.deterministicSteps];
      reasoning = "Transit directions fallback. Prioritizes official transport routes and guest safety in high-traffic vehicle zones.";
      break;

    case "MULTILINGUAL":
      recommendation = "Connect with bilingual ambassador and guide spectator using visual indicators.";
      script = "Hello, let me connect us with our translation service so we can communicate easily. Please look at this map, we are right here.";
      nextSteps = [
        "Launch translation aid or request remote language services dispatcher.",
        ...decision.deterministicSteps,
        "Utilize high-contrast stadium signage and graphic maps to communicate directions."
      ];
      reasoning = "Multilingual communication fallback. Ensures barrier-free support via digital resources and visuals.";
      break;
  }

  return {
    recommendation,
    script,
    nextSteps,
    reasoning,
    followUpQuestion
  };
}
