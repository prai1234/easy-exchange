const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

const requiredBookFields = ['title', 'author', 'genre', 'condition', 'owner_name', 'owner_email']

function validateBook(body) {
  for (const field of requiredBookFields) {
    if (!String(body[field] || '').trim()) return `${field.replace('_', ' ')} is required.`
  }
  if (!String(body.owner_email).includes('@')) return 'A valid owner email is required.'
  return null
}

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.get('/api/books', (req, res) => {
  const books = db.prepare('SELECT * FROM books ORDER BY datetime(created_at) DESC, id DESC').all()
  res.json(books)
})

app.get('/api/books/:id', (req, res) => {
  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id)
  if (!book) return res.status(404).json({ error: 'Book not found.' })
  res.json(book)
})

app.post('/api/books', (req, res) => {
  const error = validateBook(req.body)
  if (error) return res.status(400).json({ error })

  const info = db.prepare(`
    INSERT INTO books (title, author, genre, condition, description, owner_name, owner_email, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Available')
  `).run(
    req.body.title.trim(),
    req.body.author.trim(),
    req.body.genre.trim(),
    req.body.condition.trim(),
    String(req.body.description || '').trim(),
    req.body.owner_name.trim(),
    req.body.owner_email.trim()
  )

  res.status(201).json(db.prepare('SELECT * FROM books WHERE id = ?').get(info.lastInsertRowid))
})

app.put('/api/books/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Book not found.' })

  const error = validateBook(req.body)
  if (error) return res.status(400).json({ error })

  const allowedStatuses = ['Available', 'Pending', 'Exchanged']
  const status = allowedStatuses.includes(req.body.status) ? req.body.status : existing.status

  db.prepare(`
    UPDATE books SET title=?, author=?, genre=?, condition=?, description=?, owner_name=?, owner_email=?, status=?
    WHERE id=?
  `).run(
    req.body.title.trim(),
    req.body.author.trim(),
    req.body.genre.trim(),
    req.body.condition.trim(),
    String(req.body.description || '').trim(),
    req.body.owner_name.trim(),
    req.body.owner_email.trim(),
    status,
    req.params.id
  )

  res.json(db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id))
})

app.delete('/api/books/:id', (req, res) => {
  const info = db.prepare('DELETE FROM books WHERE id = ?').run(req.params.id)
  if (info.changes === 0) return res.status(404).json({ error: 'Book not found.' })
  res.json({ success: true })
})

app.get('/api/exchanges', (req, res) => {
  const requests = db.prepare(`
    SELECT exchange_requests.*, books.title AS book_title
    FROM exchange_requests
    JOIN books ON books.id = exchange_requests.book_id
    ORDER BY exchange_requests.id DESC
  `).all()
  res.json(requests)
})

app.post('/api/exchanges', (req, res) => {
  const { book_id, requester_name, requester_email, offered_book = '', message = '' } = req.body
  if (!book_id || !String(requester_name || '').trim() || !String(requester_email || '').trim()) {
    return res.status(400).json({ error: 'Book, requester name, and requester email are required.' })
  }
  if (!String(requester_email).includes('@')) return res.status(400).json({ error: 'A valid requester email is required.' })

  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(book_id)
  if (!book) return res.status(404).json({ error: 'Book not found.' })
  if (book.status !== 'Available') return res.status(409).json({ error: 'This book is not currently available.' })

  const createRequest = db.transaction(() => {
    const info = db.prepare(`
      INSERT INTO exchange_requests (book_id, requester_name, requester_email, offered_book, message)
      VALUES (?, ?, ?, ?, ?)
    `).run(book_id, requester_name.trim(), requester_email.trim(), String(offered_book).trim(), String(message).trim())
    db.prepare("UPDATE books SET status = 'Pending' WHERE id = ?").run(book_id)
    return info.lastInsertRowid
  })

  const id = createRequest()
  res.status(201).json(db.prepare('SELECT * FROM exchange_requests WHERE id = ?').get(id))
})

app.use((req, res) => res.status(404).json({ error: 'Route not found.' }))

app.listen(PORT, () => {
  console.log(`Easy Book Exchange API running at http://localhost:${PORT}`)
})
