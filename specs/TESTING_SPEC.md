# Testing Specification

## Catalog
- Books load from the API.
- Empty catalog displays a helpful message.

## Search
- Searching by title finds matching books.
- Searching by author finds matching books.
- Search is case-insensitive.

## Genre Filter
- Selecting a genre shows only matching books.
- All Genres restores the full catalog.

## Add Book
- Required fields cannot be empty.
- Valid submissions create a new listing.

## Edit Book
- Existing values load into the form.
- Saving updates the listing.

## Delete Book
- Deleting removes the listing.

## Exchange Request
- Request can be submitted only for Available books.
- Successful request changes the book status to Pending.
- Requester name and email are required.

## Error Handling
- Server errors display readable feedback.
- Missing book IDs return 404.
