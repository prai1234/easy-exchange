import React, { useState } from 'react'

export default function BookDetails({ book, onClose, onEdit, onDelete, onRequest }) {
  const [request, setRequest] = useState({ requester_name: '', requester_email: '', offered_book: '', message: '' })
  const [error, setError] = useState('')

  function update(e) {
    setRequest({ ...request, [e.target.name]: e.target.value })
  }

  function submit(e) {
    e.preventDefault()
    if (!request.requester_name.trim() || !request.requester_email.trim()) {
      setError('Name and email are required.')
      return
    }
    if (!request.requester_email.includes('@')) {
      setError('Please enter a valid email.')
      return
    }
    setError('')
    onRequest(book.id, request)
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>×</button>
        <span className={`status ${book.status.toLowerCase()}`}>{book.status}</span>
        <h2>{book.title}</h2>
        <p className="author">by {book.author}</p>
        <div className="detail-grid">
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Condition:</strong> {book.condition}</p>
          <p><strong>Owner:</strong> {book.owner_name}</p>
        </div>
        <p>{book.description || 'No description provided.'}</p>
        <div className="actions">
          <button className="secondary" onClick={() => onEdit(book)}>Edit Listing</button>
          <button className="danger" onClick={() => onDelete(book.id)}>Delete Listing</button>
        </div>

        {book.status === 'Available' ? (
          <form className="exchange-form" onSubmit={submit}>
            <h3>Request an Exchange</h3>
            {error && <p className="error">{error}</p>}
            <input name="requester_name" placeholder="Your name" value={request.requester_name} onChange={update} />
            <input name="requester_email" type="email" placeholder="Your email" value={request.requester_email} onChange={update} />
            <input name="offered_book" placeholder="Book you can offer (optional)" value={request.offered_book} onChange={update} />
            <textarea name="message" rows="3" placeholder="Message (optional)" value={request.message} onChange={update} />
            <button type="submit">Send Exchange Request</button>
          </form>
        ) : (
          <p className="notice">This book is currently {book.status.toLowerCase()} and cannot accept a new request.</p>
        )}
      </section>
    </div>
  )
}
