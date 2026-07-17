# StadiumSense AI — FIFA 2026 Stadium Operations Copilot

**StadiumSense AI** is a real-time, GenAI-enabled matchday operations copilot designed for stadium volunteers, stewards, and venue staff at the FIFA World Cup 2026. It combines highly reliable deterministic logic gates with generative artificial intelligence to deliver instantaneous, context-aware operational guidance, bilingual scripts, and safety checklists.

---

## 🌟 Visual Theme: Elegant Dark

The application is styled with a custom **Elegant Dark** theme, utilizing:
- **Rich Dark Base (`#05070a`)** with subtle metallic gradients to keep the screen distraction-free and comfortable under high-glare or nighttime stadium conditions.
- **Vibrant Blue Accent Colors** and high-contrast typography pairing **Inter** (for high-legibility interface controls) with **JetBrains Mono** (for diagnostic feedback, live coordinate stamps, and technical parameters).
- **Tactile feedback** states, responsive transition effects (using `motion`), and prominent safety-urgency alert banners to ensure zero layout-clutter while maintaining pristine aesthetic discipline.

---

## 🏗️ Core Architecture & How It Works

StadiumSense AI utilizes a reliable hybrid full-stack system architecture that separates concerns between quick-response rule-based logic and creative generative models:

```text
       [ User Matchday Input ]
                  |
                  v
       [ Input Validation Unit ]
                  |
                  v
       [ Context Analyzer Module ]  <--- Categorizes issue & risk level (LOW -> EMERGENCY)
                  |
                  v
    [ Safety & Decision Engine ]   <--- Bypasses AI for life safety (Deterministic Escalation)
         /                  \
        /                    \
(Escalation Needed)    (Standard Request)
      /                        \
     v                          v
[Immediate Alert Routing]  [GenAI Response Adapter] (Gemini 1.5 / OpenAI / Fallback Engine)
     \                          /
      \                        /
       v                      v
      [ Unified Structured Response ]
                  |
                  v
       [ Accessible UI Workspace ]  <--- Staggered animation panels & Bilingual scripts
```

### 1. Context Analyzer
Directly processes incoming descriptions to extract:
- **Incident Category**: Categorizes issues into `MEDICAL`, `SECURITY`, `LOST_CHILD`, `CROWDING`, `ACCESSIBILITY`, `TRANSPORT`, `SUSTAINABILITY`, `MULTILINGUAL`, or `GENERAL`.
- **Risk Level**: Automatically scores situations as `LOW`, `MEDIUM`, `HIGH`, or `EMERGENCY`.
- **User Intent**: Recognizes if the reporter is trying to `report`, `ask`, `escalate`, or `translate`.
- **Missing Information**: Identifies details missing from the description (e.g., specific section, symptoms) and creates a targeted questionnaire.

### 2. Deterministic Safety & Decision Engine
A strict guardrail layer that prevents AI hallucinations for high-risk situations:
- **Zero-Bypass Escalation**: If the context analyzer detects threats involving active violence, chest pains, lost children, or potential crowd crushes, the system **automatically triggers direct escalation alerts** and pre-mapped response groups.
- **Safety Overrides**: Guarantees that any safety-sensitive category will get mapped to verified, deterministic stadium protocols regardless of the AI model's output.

### 3. Dual-Guardrail GenAI Adapter
- **Server-Side Security**: All GenAI operations occur entirely on the backend to keep keys protected.
- **Multi-Provider Flexibility**: Leverages the official modern `@google/genai` SDK with fallback routing to OpenAI or a robust template engine if no API credentials are provided.
- **Structured Prompts**: Forces structured JSON responses containing operational recommendations, empathetic scripts, and step-by-step reasoning.

---

## 🛠️ Folder Structure

```text
├── src/
│   ├── App.tsx                     # Main interactive user dashboard & design workspace
│   ├── index.css                   # Global Tailwind configuration with Inter & JetBrains Mono font definitions
│   └── server/
│       ├── aiAdapter.ts            # Secure Gemini/OpenAI API routing and template fallbacks
│       ├── contextAnalyzer.ts      # Keyword detection, language categorization & intent parser
│       ├── decisionEngine.ts       # Deterministic safety protocols & VIP/Escalation rules
│       ├── decisionEngine.test.ts  # Logic gate test suite
│       └── responseBuilder.ts      # Core orchestrator unifying rules and generated text
├── server.ts                       # Express backend server serving static bundle & hosting APIs
├── PRD.md                          # Product Requirements Document
├── architecture.md                 # System diagrams, data flow sheets & performance considerations
├── rules.md                        # Strict submission parameters, development guidelines & safety standards
├── phases.md                       # Product development timeline & completed iterations
├── design.md                       # Styling details, color specifications, and UI components
└── memory.md                       # Context tracking, key assumptions, and design records
```

---

## 🚦 Running Locally

Ensure you have Node.js 18+ installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root folder (referenced in `.env.example`):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🧪 Executing Diagnostics

StadiumSense AI includes a dedicated, robust diagnostic module to test the deterministic routing of the safety engine.

1. Navigate to the **Diagnostics** tab in the application.
2. Click **Re-run Test Suite** to watch the system run high-consequence drills (e.g., unconscious spectators, crowding surges, lost child recovery).
3. The diagnostics terminal will output real-time validation checks showing how safety gates are mathematically guaranteed to operate correctly.

---

## 🛡️ Assumptions & Scope Limits

- **Simulated Stadium Feeds**: Uses simulated coordinates for Houston, TX NRG Stadium during matchday.
- **Emergency Deferral**: Designed strictly to aid volunteer decision-making; it does not replace official, localized stadium emergency response instructions.
- **Safety Hardening**: Highly resilient offline fallback mechanisms ensure zero disruption to volunteers during wireless connectivity failures or peak cellular congestion.
