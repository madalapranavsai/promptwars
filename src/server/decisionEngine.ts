import { ContextAnalysis, DecisionResult } from "../shared/types";

export function getDeterministicDecision(
  analysis: ContextAnalysis,
  userText: string
): DecisionResult {
  const textLower = userText.toLowerCase();
  let { category, riskLevel } = analysis;

  // 1. Risk Level Upgrades & Security/Safety Overrides
  let operationalReasoning = "";
  const safetyWarnings: string[] = [];
  const deterministicSteps: string[] = [];

  if (category === "LOST_CHILD") {
    riskLevel = "EMERGENCY";
    operationalReasoning += "Override: Lost child incidents are automatically elevated to EMERGENCY risk level under safeguarding rules. ";
  }

  if (category === "SECURITY" && (textLower.includes("weapon") || textLower.includes("gun") || textLower.includes("knife") || textLower.includes("bomb") || textLower.includes("fire"))) {
    riskLevel = "EMERGENCY";
    operationalReasoning += "Override: Active security threat or weapon detected in input. Upgraded to EMERGENCY risk level. ";
  }

  if (category === "CROWDING" && (textLower.includes("crush") || textLower.includes("suffocat") || textLower.includes("trample") || textLower.includes("pushing"))) {
    riskLevel = "EMERGENCY";
    operationalReasoning += "Override: Crowd density triggers structural crush indicators. Upgraded to EMERGENCY risk level. ";
  }

  // 2. Coordinated Escalation targets and action paths based on category and risk
  let escalationRequired = false;
  let escalationTarget = "Sector Supervisor";
  let recommendedActionPath = "Standard Operations Protocol";

  if (riskLevel === "EMERGENCY" || riskLevel === "HIGH") {
    escalationRequired = true;
  }

  switch (category) {
    case "MEDICAL":
      escalationTarget = "Venue Medical Response Team (VMRT) & Stadium Command Center";
      recommendedActionPath = riskLevel === "EMERGENCY" 
        ? "VMRT Emergency Red Code Dispatch & Priority Evacuation Route Activation" 
        : "VMRT Yellow Code Support Team Deployment";
      
      safetyWarnings.push("Do not attempt to move a severely injured person unless there is an immediate secondary hazard (e.g. fire).");
      safetyWarnings.push("Keep crowds back to maintain fresh air and clear path for the medical stretchers.");
      
      deterministicSteps.push("Secure the exact seat/concourse location and clear a 3-meter radius around the patient.");
      deterministicSteps.push("Check if the patient is conscious and breathing normally; prepare to guide emergency medics.");
      deterministicSteps.push("Assign one volunteer to wait at the nearest Sector entry gate to physically guide the VMRT team.");
      break;

    case "SECURITY":
      escalationTarget = "Stadium Security Command & Local Law Enforcement Liaison";
      recommendedActionPath = riskLevel === "EMERGENCY"
        ? "Active Hostility Containment Protocol & Rapid Security Intervention"
        : "Security Patrol Sector Re-route & Incident Documentation";

      safetyWarnings.push("NEVER put yourself or other volunteers in physical danger. Stand back and observe.");
      safetyWarnings.push("Do NOT attempt to physically restrain or engage with aggressive individuals.");

      deterministicSteps.push("Observe from a safe distance of at least 5-10 meters.");
      deterministicSteps.push("Note physical descriptions of key subjects (height, attire, shirt numbers, physical markings).");
      deterministicSteps.push("Advise nearby spectators to move calmly away from the active containment zone.");
      break;

    case "LOST_CHILD":
      escalationTarget = "Venue Operations Center (VOC) & Safeguarding Officer";
      recommendedActionPath = "Coordinated Multi-Sector Sweep & Perimeter Gate Lockout Alert";

      safetyWarnings.push("A volunteer must NEVER be left alone with a child. Always ensure at least two volunteers or staff are present.");
      safetyWarnings.push("Do not broadcast the child's full name over public speakers to ensure child safeguarding.");

      deterministicSteps.push("Ensure two registered volunteers remain with the child/parent at all times.");
      deterministicSteps.push("Obtain full physical description of child: clothing colors, age, height, and name.");
      deterministicSteps.push("Notify the Safeguarding Officer to alert exit gates and begin a systematic sweep of the Sector.");
      break;

    case "CROWDING":
      escalationTarget = "Crowd Management Command & Sector Gate Managers";
      recommendedActionPath = riskLevel === "EMERGENCY"
        ? "Gate Lockout Holding & Emergency Concave Bypass Route Activation"
        : "Queue Metering & Concourse Flow Redirection";

      safetyWarnings.push("Avoid building static blockages. Keep walking paths dynamic and clear.");
      safetyWarnings.push("Ensure emergency exits are not locked or chained under any circumstances.");

      deterministicSteps.push("Immediately open any secondary bypass lanes or exit-only auxiliary gates.");
      deterministicSteps.push("Use mega-megaphones to direct fans to adjacent, less crowded concourse zones.");
      deterministicSteps.push("Monitor crowd density at turnstiles and suspend entry briefly if platforms are oversaturated.");
      break;

    case "ACCESSIBILITY":
      escalationTarget = "Spectator Services Mobility Team";
      recommendedActionPath = "Mobility Shuttle/Golf Cart Dispatch & Elevator Bypass Routing";

      deterministicSteps.push("Assess if the spectator requires a manual wheelchair or a motorized golf cart.");
      deterministicSteps.push("Accompany the visitor to the nearest designated priority elevator or ramp.");
      deterministicSteps.push("Coordinate with Spectator Services to confirm accessible seat compatibility.");
      break;

    case "LOST_ITEM":
      escalationTarget = "Stadium Lost & Found Registry Office";
      recommendedActionPath = "Digital Item Entry & Guest Retrieval Ticket Issuance";

      deterministicSteps.push("Inspect the item visually for security hazards before handling (do not open unattended luggage).");
      deterministicSteps.push("Record the item description, seat location found, and timestamp into the operational database.");
      deterministicSteps.push("Direct the guest to the nearest Info Desk or issue a standard Lost & Found claim receipt.");
      break;

    case "SUSTAINABILITY":
      escalationTarget = "Venue Facilities & Recycling Zero-Waste Crew";
      recommendedActionPath = "Janitorial Service Dispatch & Recycling Bin Re-sort Operations";

      deterministicSteps.push("Assess if there are hazardous waste components involved (spills, glass).");
      deterministicSteps.push("Mark the sorting bin or trash area for priority pickup by the zero-waste crew.");
      deterministicSteps.push("Advise guests on correct placement of reusable stadium cups and plastic bottle recyclables.");
      break;

    case "NAVIGATION":
      escalationTarget = "Wayfinding Volunteer Coordinator";
      recommendedActionPath = "Standard Wayfinding Assistance & Digital Map Sharing";

      safetyWarnings.push("Do not send guests through restricted team/media tunnels or exit-only emergency doors.");

      deterministicSteps.push("Identify the spectator's target location (Sector, Gate, Suite, or Concessions).");
      deterministicSteps.push("Point the guest in the correct physical direction and provide a digital map scan QR code.");
      deterministicSteps.push("If the guest has a mobility request, check accessibility pathways and redirect as needed.");
      break;

    case "TRANSPORT":
      escalationTarget = "Transport & Traffic Operations Center (TOC)";
      recommendedActionPath = "Transit Dispatch & Park-and-Ride Shuttle Routing";

      safetyWarnings.push("Remind guests to remain on designated walkways and avoid walking onto active vehicle roadways.");

      deterministicSteps.push("Confirm destination (e.g. Park-and-Ride, Metro Station, rideshare lot, or Airport).");
      deterministicSteps.push("Provide schedule info for the stadium express buses and nearest Metro departure gates.");
      deterministicSteps.push("Direct the guest to the safe, illuminated transport boarding corridors outside the gates.");
      break;

    case "MULTILINGUAL":
      escalationTarget = "Volunteer Language Services Hub";
      recommendedActionPath = "Bilingual Ambassador Dispatch & Digital Language Service Connection";

      deterministicSteps.push("Identify the spectator's preferred language (e.g., Spanish, French, German, Arabic).");
      deterministicSteps.push("Use the preset multilingual translation script or the remote translation hot-channel.");
      deterministicSteps.push("Guide the fan visually using standard stadium iconography and stadium map panels.");
      break;

    default:
      escalationTarget = "Sector Supervisor";
      recommendedActionPath = "Standard Volunteer Support & Guest Relations Guidance";

      deterministicSteps.push("Understand the fan's core inquiry or problem calmly.");
      deterministicSteps.push("Refer to the matchday pocket-guide or stadium signage for direct resolution.");
      deterministicSteps.push("If unresolved in 2 minutes, escalate to the nearest concourse Info Desk.");
      break;
  }

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
