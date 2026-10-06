# Architecture Specification

## High-Level Flow
Browser → React Frontend → REST API → Express Server → SQLite Database

## Frontend Responsibilities
- Render catalog and forms
- Search/filter UI
- Client-side validation
- Call backend API
- Display success/error messages

## Backend Responsibilities
- Validate requests
- Read/write SQLite data
- Enforce allowed book statuses
- Reject exchange requests for unavailable books
- Return JSON responses

## API
- GET /api/books
- GET /api/books/:id
- POST /api/books
- PUT /api/books/:id
- DELETE /api/books/:id
- GET /api/exchanges
- POST /api/exchanges

## Database Entities

### books
- id
- title
- author
- genre
- condition
- description
- owner_name
- owner_email
- status
- created_at

### exchange_requests
- id
- book_id
- requester_name
- requester_email
- offered_book
- message
- status
- created_at
