# Project Memory

## Current Status
Problem statement received and planning documents updated for a FIFA World Cup 2026 stadium operations GenAI assistant.

## Problem Statement
Build a GenAI-enabled solution that enhances stadium operations and the overall tournament experience for fans, organizers, volunteers, or venue staff. The solution must leverage Generative AI to improve navigation, crowd management, accessibility, transportation, sustainability, multilingual assistance, operational intelligence, or real-time decision support during the FIFA World Cup 2026.

## Chosen Concept
StadiumSense AI: a matchday operations copilot for venue staff and volunteers.

## Primary Users
- Venue staff.
- Volunteers.
- Operations coordinators.

## Fan Benefit
Fans receive faster, clearer, safer, and more accessible help through staff and volunteer guidance.

## Included Challenge Areas
- Navigation.
- Crowd management.
- Accessibility.
- Transportation.
- Sustainability.
- Multilingual assistance.
- Operational intelligence.
- Real-time decision support.

## Known Challenge Guidelines
- Maximum 3 submission attempts.
- Repository size must be less than 10 MB.
- GitHub repository must be public.
- Repository should contain only one branch.
- Solution should demonstrate a smart, dynamic assistant.
- Solution should use logical decision-making based on user context.
- Solution should be practical and usable.
- Code should be clean and maintainable.
- README must explain the vertical, approach, logic, how it works, and assumptions.

## Current Repo Notes
- Workspace path: `/`
- Current branch: `main`
- Keep project lightweight and review-friendly.

## Decisions So Far
- Build a small web app.
- Use staff and volunteers as primary personas.
- Use GenAI for response generation and multilingual-friendly phrasing.
- Use deterministic logic for classification, risk scoring, and safety escalation.
- Avoid storing sensitive incident data.
- Use environment variables for any AI API key.
- Include fallback template responses if GenAI is unavailable.

## Safety Logic Priorities
Escalate immediately for:
- Medical emergencies.
- Security threats.
- Lost child reports.
- Fire or smoke reports.
- Crowd crush or panic risk.
- Violence or weapons.

## Pending Work
- Implement app files.
- Create decision engine.
- Add GenAI adapter.
- Add tests.
- Write README.
- Verify repository size and branch count.

## Assumptions
- Prototype does not use official FIFA data or live stadium feeds.
- Stadium zones can be simulated.
- The assistant supports staff decision-making but does not replace venue policy.
- Emergency guidance should always defer to official venue procedures.
