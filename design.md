# Design Document

## Design Goal
Create a focused stadium operations assistant that helps staff and volunteers make faster, safer, and more accessible matchday decisions during FIFA World Cup 2026.

The design should feel operational, clear, and trustworthy. It should prioritize fast scanning over decoration.

## Product Name
StadiumSense AI

## Primary User
Venue staff and volunteers working gates, concourses, seating areas, accessibility points, transport exits, and information desks.

## Design Principles
- Put the assistant workflow on the first screen.
- Make context fields fast to use.
- Keep recommendations short and actionable.
- Separate staff script, next steps, and reasoning.
- Make risk and escalation states clear without relying only on color.
- Support mobile and tablet use.
- Keep the interface accessible for real matchday conditions.

## Target Experience
The user should immediately understand:
- What situation they can enter.
- Which operational context they can provide.
- What action the assistant recommends.
- What they can say to the fan.
- Whether escalation is required.
- Why the assistant made that recommendation.

## Layout

Recommended layout:

```text
Top bar
  - Product name
  - Matchday operations label

Main workspace
  - Context controls
    - Role
    - Stadium zone
    - Urgency
    - Preferred language
  - Situation input
  - Generate guidance button

Response workspace
  - Recommendation
  - Staff script
  - Next steps
  - Reasoning
  - Escalation notice when needed
```

## UI Components

### Top Bar
Purpose:
- Establish the product as a stadium operations copilot.
- Keep branding simple and professional.

### Context Controls
Purpose:
- Give the assistant structured context before generation.

Fields:
- Role: volunteer, venue staff, accessibility support, operations coordinator.
- Zone: gate, concourse, seating, transport exit, accessibility desk, food area, merchandise area.
- Urgency: low, medium, high, emergency.
- Language: English by default, with optional multilingual output.

### Situation Input
Purpose:
- Captures the fan question or operational situation.

Requirements:
- Visible label.
- Helpful placeholder.
- Character limit guidance.
- Clear validation for empty input.

### Recommendation Panel
Purpose:
- Shows the main operational guidance.

Requirements:
- Short, direct action.
- Clear risk level.
- Escalation status if needed.

### Staff Script Panel
Purpose:
- Provides text the staff member can say to a fan.

Requirements:
- Calm language.
- Short sentences.
- Adapted to selected language when possible.
- Avoid overclaiming live information.

### Next Steps Panel
Purpose:
- Turns the recommendation into action.

Requirements:
- Use short ordered steps.
- Include escalation instructions for high-risk issues.
- Include follow-up questions when context is missing.

### Reasoning Panel
Purpose:
- Explains the assistant's logic.

Requirements:
- Show detected category.
- Show risk level.
- Show key signals from input.
- Explain why escalation or non-escalation was chosen.

## Visual Style
- Work-focused and calm.
- High contrast text.
- Clear section hierarchy.
- Compact spacing suitable for repeated use.
- Avoid heavy decorative assets.
- Use status badges or icons for risk, but include text labels too.

## Accessibility
- Use semantic HTML.
- Provide labels for every input.
- Ensure all controls are keyboard-accessible.
- Use visible focus states.
- Ensure response updates are announced with an appropriate live region.
- Maintain strong color contrast.
- Do not rely only on color for urgency.
- Make buttons large enough for touch use.

## Mobile Behavior
- Stack context controls vertically.
- Keep the submit button easy to reach.
- Keep response sections readable without horizontal scrolling.
- Avoid text overlap on narrow screens.

## Content Tone
- Calm.
- Practical.
- Direct.
- Safety-aware.
- Respectful to international fans.

## Example Output Shape

```text
Recommendation
Redirect the fan to the nearest accessibility support point and notify a zone lead if the route is blocked.

Staff Script
"I can help you get to the accessible entrance. Please stay with me while I confirm the clearest route."

Next Steps
1. Confirm the fan's current location.
2. Check whether the accessible route is blocked.
3. Guide them to the nearest support point.
4. Escalate if mobility access is obstructed.

Reasoning
Detected category: accessibility.
Risk level: medium.
The request involves accessible movement inside the venue and may require staff coordination.
```
