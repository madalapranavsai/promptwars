import { ContextAnalysis, DecisionResult } from "../shared/types";
import { getEmergencyOverrideReason } from "./contextAnalyzer";

interface CategoryRule {
  escalationTarget: string;
  recommendedActionPath: (risk: string) => string;
  safetyWarnings?: string[];
  deterministicSteps: string[];
}

const CATEGORY_RULES: Record<string, CategoryRule> = {
  MEDICAL: {
    escalationTarget: "Venue Medical Response Team (VMRT) & Stadium Command Center",
    recommendedActionPath: (risk) => risk === "EMERGENCY" 
      ? "VMRT Emergency Red Code Dispatch & Priority Evacuation Route Activation" 
      : "VMRT Yellow Code Support Team Deployment",
    safetyWarnings: [
      "Do not attempt to move a severely injured person unless there is an immediate secondary hazard (e.g. fire).",
      "Keep crowds back to maintain fresh air and clear path for the medical stretchers."
    ],
    deterministicSteps: [
      "Secure the exact seat/concourse location and clear a 3-meter radius around the patient.",
      "Check if the patient is conscious and breathing normally; prepare to guide emergency medics.",
      "Assign one volunteer to wait at the nearest Sector entry gate to physically guide the VMRT team."
    ]
  },
  SECURITY: {
    escalationTarget: "Stadium Security Command & Local Law Enforcement Liaison",
    recommendedActionPath: (risk) => risk === "EMERGENCY"
      ? "Active Hostility Containment Protocol & Rapid Security Intervention"
      : "Security Patrol Sector Re-route & Incident Documentation",
    safetyWarnings: [
      "NEVER put yourself or other volunteers in physical danger. Stand back and observe.",
      "Do NOT attempt to physically restrain or engage with aggressive individuals."
    ],
    deterministicSteps: [
      "Observe from a safe distance of at least 5-10 meters.",
      "Note physical descriptions of key subjects (height, attire, shirt numbers, physical markings).",
      "Advise nearby spectators to move calmly away from the active containment zone."
    ]
  },
  LOST_CHILD: {
    escalationTarget: "Venue Operations Center (VOC) & Safeguarding Officer",
    recommendedActionPath: () => "Coordinated Multi-Sector Sweep & Perimeter Gate Lockout Alert",
    safetyWarnings: [
      "A volunteer must NEVER be left alone with a child. Always ensure at least two volunteers or staff are present.",
      "Do not broadcast the child's full name over public speakers to ensure child safeguarding."
    ],
    deterministicSteps: [
      "Ensure two registered volunteers remain with the child/parent at all times.",
      "Obtain full physical description of child: clothing colors, age, height, and name.",
      "Notify the Safeguarding Officer to alert exit gates and begin a systematic sweep of the Sector."
    ]
  },
  CROWDING: {
    escalationTarget: "Crowd Management Command & Sector Gate Managers",
    recommendedActionPath: (risk) => risk === "EMERGENCY"
      ? "Gate Lockout Holding & Emergency Concave Bypass Route Activation"
      : "Queue Metering & Concourse Flow Redirection",
    safetyWarnings: [
      "Avoid building static blockages. Keep walking paths dynamic and clear.",
      "Ensure emergency exits are not locked or chained under any circumstances."
    ],
    deterministicSteps: [
      "Immediately open any secondary bypass lanes or exit-only auxiliary gates.",
      "Use mega-megaphones to direct fans to adjacent, less crowded concourse zones.",
      "Monitor crowd density at turnstiles and suspend entry briefly if platforms are oversaturated."
    ]
  },
  ACCESSIBILITY: {
    escalationTarget: "Spectator Services Mobility Team",
    recommendedActionPath: () => "Mobility Shuttle/Golf Cart Dispatch & Elevator Bypass Routing",
    deterministicSteps: [
      "Assess if the spectator requires a manual wheelchair or a motorized golf cart.",
      "Accompany the visitor to the nearest designated priority elevator or ramp.",
      "Coordinate with Spectator Services to confirm accessible seat compatibility."
    ]
  },
  LOST_ITEM: {
    escalationTarget: "Stadium Lost & Found Registry Office",
    recommendedActionPath: () => "Digital Item Entry & Guest Retrieval Ticket Issuance",
    deterministicSteps: [
      "Inspect the item visually for security hazards before handling (do not open unattended luggage).",
      "Record the item description, seat location found, and timestamp into the operational database.",
      "Direct the guest to the nearest Info Desk or issue a standard Lost & Found claim receipt."
    ]
  },
  SUSTAINABILITY: {
    escalationTarget: "Venue Facilities & Recycling Zero-Waste Crew",
    recommendedActionPath: () => "Janitorial Service Dispatch & Recycling Bin Re-sort Operations",
    deterministicSteps: [
      "Assess if there are hazardous waste components involved (spills, glass).",
      "Mark the sorting bin or trash area for priority pickup by the zero-waste crew.",
      "Advise guests on correct placement of reusable stadium cups and plastic bottle recyclables."
    ]
  },
  NAVIGATION: {
    escalationTarget: "Wayfinding Volunteer Coordinator",
    recommendedActionPath: () => "Standard Wayfinding Assistance & Digital Map Sharing",
    safetyWarnings: [
      "Do not send guests through restricted team/media tunnels or exit-only emergency doors."
    ],
    deterministicSteps: [
      "Identify the spectator's target location (Sector, Gate, Suite, or Concessions).",
      "Point the guest in the correct physical direction and provide a digital map scan QR code.",
      "If the guest has a mobility request, check accessibility pathways and redirect as needed."
    ]
  },
  TRANSPORT: {
    escalationTarget: "Transport & Traffic Operations Center (TOC)",
    recommendedActionPath: () => "Transit Dispatch & Park-and-Ride Shuttle Routing",
    safetyWarnings: [
      "Remind guests to remain on designated walkways and avoid walking onto active vehicle roadways."
    ],
    deterministicSteps: [
      "Confirm destination (e.g. Park-and-Ride, Metro Station, rideshare lot, or Airport).",
      "Provide schedule info for the stadium express buses and nearest Metro departure gates.",
      "Direct the guest to the safe, illuminated transport boarding corridors outside the gates."
    ]
  },
  MULTILINGUAL: {
    escalationTarget: "Volunteer Language Services Hub",
    recommendedActionPath: () => "Bilingual Ambassador Dispatch & Digital Language Service Connection",
    deterministicSteps: [
      "Identify the spectator's preferred language (e.g., Spanish, French, German, Arabic).",
      "Use the preset multilingual translation script or the remote translation hot-channel.",
      "Guide the fan visually using standard stadium iconography and stadium map panels."
    ]
  }
};

export function getDeterministicDecision(
  analysis: ContextAnalysis,
  userText: string
): DecisionResult {
  const category = analysis.category;
  let riskLevel = analysis.riskLevel;
  let escalationRequired = false;
  let operationalReasoning = "";

  // 1. Risk Level Upgrades & Security/Safety Overrides
  const overrideReason = getEmergencyOverrideReason(category, userText);
  if (overrideReason) {
    riskLevel = "EMERGENCY";
    analysis.riskLevel = "EMERGENCY";
    operationalReasoning += overrideReason;
  }

  // Escalation criteria
  if (riskLevel === "EMERGENCY" || riskLevel === "HIGH") {
    escalationRequired = true;
  }

  // 2. Fetch deterministic mappings from config lookup
  const rule = CATEGORY_RULES[category] || {
    escalationTarget: "Sector Supervisor",
    recommendedActionPath: () => "Standard Volunteer Support & Guest Relations Guidance",
    deterministicSteps: [
      "Understand the fan's core inquiry or problem calmly.",
      "Refer to the matchday pocket-guide or stadium signage for direct resolution.",
      "If unresolved in 2 minutes, escalate to the nearest concourse Info Desk."
    ]
  };

  const escalationTarget = rule.escalationTarget;
  const recommendedActionPath = rule.recommendedActionPath(riskLevel);

  const safetyWarnings = rule.safetyWarnings ? [...rule.safetyWarnings] : [];
  const deterministicSteps = [...rule.deterministicSteps];

  // General operational reasoning
  if (!operationalReasoning) {
    operationalReasoning = `Determined risk level: ${riskLevel} and category: ${category}. Following standard FIFA World Cup operational procedure for matchday operations.`;
  } else {
    operationalReasoning += `Standard operational protocol for category: ${category} and risk level: ${riskLevel} activated.`;
  }

  return {
    escalationRequired,
    escalationTarget,
    recommendedActionPath,
    deterministicSteps,
    safetyWarnings,
    operationalReasoning
  };
}
