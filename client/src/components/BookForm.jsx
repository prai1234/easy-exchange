import { useEffect, useState } from 'react'

const initial = {
  title: '',
  author: '',
  genre: '',
  condition: 'Good',
  description: '',
  owner_name: '',
  owner_email: ''
}

export default function BookForm({ book, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')

  useEffect(() => {
    if (book) setForm({ ...initial, ...book })
    else setForm(initial)
  }, [book])

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function submit(e) {
    e.preventDefault()
    const required = ['title', 'author', 'genre', 'condition', 'owner_name', 'owner_email']
    if (required.some((key) => !String(form[key] || '').trim())) {
      setError('Please complete all required fields.')
      return
    }
    if (!form.owner_email.includes('@')) {
      setError('Please enter a valid owner email.')
      return
    }
    setError('')
    onSave(form)
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <h2>{book ? 'Edit Book' : 'Add a Book'}</h2>
      {error && <p className="error">{error}</p>}
      <div className="form-grid">
        <label>Title *<input name="title" value={form.title} onChange={update} /></label>
        <label>Author *<input name="author" value={form.author} onChange={update} /></label>
        <label>Genre *<input name="genre" value={form.genre} onChange={update} placeholder="Fantasy, History..." /></label>
        <label>Condition *
          <select name="condition" value={form.condition} onChange={update}>
            <option>Like New</option><option>Good</option><option>Fair</option><option>Worn</option>
          </select>
        </label>
        <label>Owner Name *<input name="owner_name" value={form.owner_name} onChange={update} /></label>
        <label>Owner Email *<input name="owner_email" type="email" value={form.owner_email} onChange={update} /></label>
      </div>
      <label>Description<textarea name="description" value={form.description} onChange={update} rows="4" /></label>
      <div className="actions">
        <button type="submit">{book ? 'Save Changes' : 'Add Book'}</button>
        <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
