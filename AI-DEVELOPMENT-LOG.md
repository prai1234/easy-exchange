# Easy Book Exchange AI Development Log

## Phase 1 — Planning
The first AI request was intentionally planning-only. The AI was instructed not to generate code and instead identify the problem, users, MVP, non-goals, architecture, risks, and acceptance criteria.

## Phase 2 — Specifications
The approved plan was converted into:
- PROJECT_SPEC.md
- REQUIREMENTS.md
- ARCHITECTURE.md
- UI_SPEC.md
- TESTING_SPEC.md

These files became the source of truth before implementation.

## Phase 3 — Skills
A custom `exchange-feature-planner` Skill was created to require planning before feature implementation.
A `code-review` Skill was created to compare completed work to the specifications.

## Phase 4 — Implementation
Implementation was divided into small features instead of one large prompt:
1. Project structure
2. Database/API
3. Catalog
4. Add listing
5. Search/filter
6. Details
7. Edit/delete
8. Exchange requests

## Phase 5 — Testing and Review
The application was checked against TESTING_SPEC.md. Generated code was treated as a draft that required verification.

## Prompt Engineering Approach
Prompts used five elements:
1. Context
2. Role
3. Task
4. Constraints
5. Required output

## Example Planning Prompt
Act as a software architect and product planner. Do not implement the application yet. Plan Easy Book Exchange by identifying purpose, users, user stories, MVP features, non-goals, stack, entities, phases, risks, and acceptance criteria.

## Example Feature Prompt
Read the relevant specs and use the exchange-feature-planner Skill. Implement only FR-01: View Books. Explain the files and data flow first, then implement the feature and verify its acceptance criteria.

## Lesson Learned
AI is more reliable when the developer provides a persistent specification, limits each change, and verifies the result instead of accepting generated code automatically.
