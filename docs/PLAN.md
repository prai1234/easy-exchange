# Easy Book Exchange Development Plan

## Problem
Students and community members often have books they no longer need while other people are looking for those same books. Easy Book Exchange provides a simple place to list books and request exchanges.

## Goals
- Let users browse available books.
- Let users create book listings.
- Let users search and filter listings.
- Let users view book details.
- Let users submit exchange requests.
- Let the application track listing status.

## Non-Goals
The MVP will not include online payments, shipping integration, real-time chat, social media login, recommendation engines, or a mobile app.

## Target Users
Students and community members who want to exchange physical books.

## Core User Stories
1. As a visitor, I want to browse book listings so I can discover books available for exchange.
2. As a visitor, I want to search by title or author so I can find a specific book quickly.
3. As a visitor, I want to filter by genre so I can narrow the catalog.
4. As a user, I want to add a book listing so others can request it.
5. As a visitor, I want to view book details before requesting an exchange.
6. As a visitor, I want to submit an exchange request for an available book.
7. As a user, I want to edit or delete a listing.

## MVP
- Browse books
- Search by title/author
- Filter by genre
- Add listing
- View details
- Edit listing
- Delete listing
- Submit exchange request
- Statuses: Available, Pending, Exchanged

## Technology
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: SQLite using better-sqlite3
- API style: REST

## Development Phases
1. Planning
2. Specifications
3. Reusable Cursor Skills
4. Backend/database setup
5. Frontend setup
6. Catalog feature
7. Add/edit/delete listing features
8. Exchange request feature
9. Validation and error handling
10. Testing and review
11. Documentation and presentation evidence

## Risks
- Allowing the project scope to grow too large.
- AI-generated code drifting away from the specs.
- Frontend and backend API mismatch.
- Missing validation and error handling.

## Definition of Done
A user can browse, search, filter, add, edit, delete, and view books; submit an exchange request for an available book; and see book statuses update correctly.
