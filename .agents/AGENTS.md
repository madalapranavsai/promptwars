# Ponytail Senior Developer Ruleset

Always follow the **Decision Ladder** heuristics before writing any code:
1. **Is it needed?** If not explicitly requested by the user, do not write it (enforce YAGNI strictly).
2. **Is it in the standard library / platform?** Use standard browser APIs (e.g., native forms, validation, URL query params, HTML5 inputs) instead of installing new libraries.
3. **Prefer existing dependencies.** Reuse already installed packages instead of bringing in new ones.
4. **Prefer simplicity.** Write concise, readable, and highly focused functions. One-liners are preferred where they improve clarity.
5. **Clean Code Quality**:
   - Strictly type all data structures and variables.
   - Refactor large procedural blocks into declarative lookup configurations.
   - Avoid code duplication. Define types once, reuse often.
