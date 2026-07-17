# Project Rules

## Submission Rules
- Maximum 3 attempts are allowed.
- Repository size must be less than 10 MB.
- GitHub repository must be public.
- Repository should contain only one branch.
- All project code must be included in the repository.
- README must explain the chosen vertical, approach, logic, how the solution works, assumptions, and GenAI usage.

## Product Direction Rules
- Build for FIFA World Cup 2026 stadium operations and matchday experience.
- Focus on venue staff and volunteers as primary users.
- Improve fan experience through faster staff guidance.
- Include at least three of these areas: navigation, crowd management, accessibility, transportation, sustainability, multilingual assistance, operational intelligence, or real-time decision support.
- Keep the assistant practical and usable, not just a demo chatbot.

## GenAI Rules
- Use GenAI for language generation, summarization, translation-style assistance, and staff-ready response drafting.
- Use deterministic rules for safety-critical classification and escalation.
- Do not let GenAI override emergency, security, medical, or lost child escalation rules.
- Do not expose API keys in frontend code.
- Provide clear behavior when the AI service is unavailable.
- Keep prompts specific, constrained, and grounded in provided context.

## Assistant Behavior Rules
- The assistant must respond dynamically based on user context.
- The assistant must explain its reasoning.
- The assistant should ask a follow-up question when the input is unclear.
- The assistant should recommend escalation for medical, security, lost child, fire, crush risk, or violence-related issues.
- The assistant should avoid pretending to know live stadium facts unless the data is provided.
- The assistant should use calm, clear, operational language.

## Development Rules
- Keep all work on the main branch unless instructed otherwise.
- Commit progress regularly.
- Keep code simple, readable, and maintainable.
- Prefer small modules with clear responsibilities.
- Avoid unnecessary dependencies.
- Avoid large images, videos, generated assets, or build folders.

## Code Quality Rules
- Use meaningful variable and function names.
- Keep functions focused on one responsibility.
- Avoid repeated logic when a helper function would be clearer.
- Add comments only where logic is not obvious.
- Keep formatting consistent.
- Separate decision logic from UI rendering.

## Security Rules
- Do not store sensitive user data.
- Do not commit secrets, API keys, tokens, or credentials.
- Do not use unsafe HTML rendering for user input.
- Validate user input before processing.
- Avoid collecting unnecessary personal information.
- Keep dependencies minimal and trusted.

## Accessibility Rules
- Use semantic HTML.
- Provide labels for inputs.
- Ensure buttons and controls are keyboard-accessible.
- Use readable color contrast.
- Make status and response areas understandable to screen readers.
- Avoid relying only on color to communicate risk level.
- Include accessibility-aware stadium guidance in assistant logic.

## Testing Rules
- Include basic automated tests or a validation checklist.
- Test navigation, crowding, accessibility, transport, and emergency scenarios.
- Test empty or unclear input.
- Test at least two urgency levels.
- Test fallback behavior when GenAI is unavailable.
- Document how testing was done in the README.

## Final Review Checklist
- Repo is public.
- Repo has only one branch.
- Repo size is below 10 MB.
- README is complete.
- App runs locally.
- GenAI setup or fallback is documented.
- Main assistant flow works.
- Safety escalation behavior works.
- Code is clean and readable.
- No secrets are committed.
