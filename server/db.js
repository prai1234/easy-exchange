const Database = require('better-sqlite3')

const db = new Database('easy-exchange.db')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT NOT NULL,
    condition TEXT NOT NULL,
    description TEXT DEFAULT '',
    owner_name TEXT NOT NULL,
    owner_email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Available' CHECK(status IN ('Available','Pending','Exchanged')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS exchange_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    requester_name TEXT NOT NULL,
    requester_email TEXT NOT NULL,
    offered_book TEXT DEFAULT '',
    message TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
  );
`)

const count = db.prepare('SELECT COUNT(*) AS count FROM books').get().count
if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO books (title, author, genre, condition, description, owner_name, owner_email, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const seed = db.transaction(() => {
    insert.run('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 'Good', 'Classic fantasy adventure in good condition.', 'Alex', 'alex@example.com', 'Available')
    insert.run('Dune', 'Frank Herbert', 'Science Fiction', 'Good', 'A well-read copy with a clean cover.', 'Jordan', 'jordan@example.com', 'Pending')
    insert.run('1984', 'George Orwell', 'Fiction', 'Fair', 'Some highlighting but all pages are intact.', 'Taylor', 'taylor@example.com', 'Exchanged')
    insert.run('The Alchemist', 'Paulo Coelho', 'Fiction', 'Like New', 'Read once and kept on a shelf.', 'Sam', 'sam@example.com', 'Available')
    insert.run('Educated', 'Tara Westover', 'Memoir', 'Good', 'Paperback in good condition.', 'Morgan', 'morgan@example.com', 'Available')
  })
  seed()
}

module.exports = db
