# Architecture

## Overview
StadiumSense AI uses a lightweight web architecture with a clear split between interface, decision logic, and GenAI response generation.

Recommended architecture:

```text
Browser UI
   |
   v
Input Validation
   |
   v
Context Analyzer
   |
   v
Safety and Decision Engine
   |
   v
GenAI Response Adapter
   |
   v
Structured Assistant Output
```

## Proposed File Structure

```text
project-root/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── src/
│   ├── contextAnalyzer.js
│   ├── decisionEngine.js
│   ├── responseBuilder.js
│   └── aiAdapter.js
├── tests/
│   └── decisionEngine.test.js
├── server.js
├── package.json
├── README.md
├── PRD.md
├── architecture.md
├── rules.md
├── phases.md
├── design.md
└── memory.md
```

## Main Components

### Browser UI
Responsible for:
- Capturing role, zone, urgency, language, and situation text.
- Displaying recommendation, staff script, next steps, and reasoning.
- Showing validation, loading, and error states.
- Supporting keyboard and screen reader usage.

### Input Validation
Responsible for:
- Preventing empty submissions.
- Limiting overly long input.
- Normalizing role, zone, urgency, and language values.
- Preparing safe structured payloads for the backend.

### Context Analyzer
Responsible for detecting:
- Issue category: navigation, crowding, accessibility, transport, sustainability, multilingual help, lost item, medical, security, or general support.
- Risk level: low, medium, high, or emergency.
- User intent: ask, report, request help, escalate, translate, redirect, or summarize.
- Missing details that require a follow-up question.

### Safety and Decision Engine
Responsible for:
- Applying deterministic rules for escalation.
- Choosing recommended action paths.
- Prioritizing medical, security, lost child, and crowd safety issues.
- Returning structured decision data that the GenAI layer can safely phrase.

### GenAI Response Adapter
Responsible for:
- Sending structured context to a GenAI model.
- Producing concise staff-ready language.
- Adapting tone for volunteers, venue staff, or operations coordinators.
- Generating multilingual-friendly responses when requested.
- Falling back to a local template response when no API key is available.

### Response Builder
Responsible for returning:
- Category.
- Risk level.
- Recommended action.
- Suggested staff script.
- Next steps.
- Reasoning.
- Escalation notice when needed.

### Test Layer
Responsible for:
- Verifying category detection.
- Verifying escalation rules.
- Verifying fallback response behavior.
- Checking empty and unclear input handling.

## Data Flow
1. User enters matchday situation and context.
2. Frontend validates the form.
3. Backend receives a structured request.
4. Context analyzer extracts category, intent, and risk signals.
5. Decision engine selects action path and escalation level.
6. AI adapter generates clear language from structured context.
7. Response builder returns a safe, structured assistant response.
8. UI renders the result in accessible sections.

## AI Prompt Strategy
The model should receive structured context, not raw instructions alone.

Prompt inputs:
- Staff role.
- Stadium zone.
- Urgency.
- Preferred language.
- Detected category.
- Detected risk level.
- Situation text.
- Required safety constraints.

Prompt output should be constrained to:
- Short recommendation.
- Staff-facing response script.
- Next steps.
- Reasoning summary.

## Security Considerations
- Keep API keys in environment variables only.
- Do not commit `.env` files.
- Do not store user incidents permanently.
- Escape or safely render user-generated text.
- Use deterministic safety rules before AI generation.
- Avoid asking for unnecessary personal information.

## Performance Considerations
- Keep dependencies minimal.
- Use small static frontend assets.
- Avoid large images, videos, or build artifacts.
- Use local rule-based classification before GenAI calls.
- Provide template fallback to keep the app usable without network access.

## Scalability Notes
For a prototype, a single Node server is enough.

Future production versions could integrate:
- Stadium maps.
- Live crowd density feeds.
- Transport APIs.
- Incident management systems.
- Multilingual voice support.
