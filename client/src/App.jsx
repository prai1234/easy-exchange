import React, { useEffect, useMemo, useState } from 'react'
import BookCard from './components/BookCard'
import BookForm from './components/BookForm'
import BookDetails from './components/BookDetails'

const API = 'http://localhost:5000/api'

export default function App() {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('All Genres')
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadBooks() {
    try {
      setLoading(true)
      const res = await fetch(`${API}/books`)
      if (!res.ok) throw new Error('Could not load books.')
      setBooks(await res.json())
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBooks() }, [])

  const genres = useMemo(() => ['All Genres', ...Array.from(new Set(books.map((b) => b.genre))).sort()], [books])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return books.filter((book) => {
      const matchesSearch = !q || book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q)
      const matchesGenre = genre === 'All Genres' || book.genre === genre
      return matchesSearch && matchesGenre
    })
  }, [books, search, genre])

  function flash(text) {
    setMessage(text)
    setTimeout(() => setMessage(''), 2500)
  }

  async function saveBook(form) {
    try {
      const isEdit = Boolean(editing)
      const res = await fetch(`${API}/books${isEdit ? `/${editing.id}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not save book.')
      setShowForm(false)
      setEditing(null)
      await loadBooks()
      flash(isEdit ? 'Book updated.' : 'Book added.')
    } catch (err) { setError(err.message) }
  }

  async function deleteBook(id) {
    if (!confirm('Delete this listing?')) return
    try {
      const res = await fetch(`${API}/books/${id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Could not delete book.')
      setSelected(null)
      await loadBooks()
      flash('Book deleted.')
    } catch (err) { setError(err.message) }
  }

  async function requestExchange(bookId, request) {
    try {
      const res = await fetch(`${API}/exchanges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_id: bookId, ...request })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not submit exchange request.')
      setSelected(null)
      await loadBooks()
      flash('Exchange request sent. Book status changed to Pending.')
    } catch (err) { setError(err.message) }
  }

  return (
    <div>
      <header className="site-header">
        <div className="container header-inner">
          <div>
            <p className="eyebrow">Assignment 07</p>
            <h1>Easy Book Exchange</h1>
          </div>
          <button onClick={() => { setEditing(null); setShowForm(true) }}>+ Add Book</button>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <span className="hero-label">COMMUNITY BOOK EXCHANGE</span>
            <h2>Give a book a new reader.</h2>
            <p>List books you no longer need and discover books other people are ready to exchange.</p>
          </div>
          <div className="hero-number">{books.filter((b) => b.status === 'Available').length}<small>available</small></div>
        </section>

        {message && <div className="success">{message}</div>}
        {error && <div className="error banner">{error}<button onClick={() => setError('')}>×</button></div>}

        <section className="toolbar">
          <input aria-label="Search books" placeholder="Search by title or author..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            {genres.map((g) => <option key={g}>{g}</option>)}
          </select>
        </section>

        {showForm && <BookForm book={editing} onSave={saveBook} onCancel={() => { setShowForm(false); setEditing(null) }} />}

        <section className="catalog-heading">
          <div><p className="eyebrow">Catalog</p><h2>{filtered.length} book{filtered.length === 1 ? '' : 's'}</h2></div>
          {(search || genre !== 'All Genres') && <button className="text-button" onClick={() => { setSearch(''); setGenre('All Genres') }}>Clear filters</button>}
        </section>

        {loading ? <p className="empty">Loading books...</p> : filtered.length === 0 ? (
          <div className="empty"><h3>No books found</h3><p>Try another search or add a new listing.</p></div>
        ) : (
          <section className="book-grid">
            {filtered.map((book) => <BookCard key={book.id} book={book} onView={setSelected} />)}
          </section>
        )}
      </main>

      <footer><div className="container">Easy Book Exchange • Prahlad B Rai • Assignment 07</div></footer>

      {selected && <BookDetails
        book={selected}
        onClose={() => setSelected(null)}
        onEdit={(book) => { setSelected(null); setEditing(book); setShowForm(true) }}
        onDelete={deleteBook}
        onRequest={requestExchange}
      />}
    </div>
  )
}
