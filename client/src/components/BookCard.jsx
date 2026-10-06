export default function BookCard({ book, onView }) {
  return (
    <article className="book-card">
      <div className="book-cover" aria-hidden="true">📚</div>
      <div className="book-card-body">
        <div className="card-topline">
          <span className={`status ${book.status.toLowerCase()}`}>{book.status}</span>
          <span className="genre">{book.genre}</span>
        </div>
        <h3>{book.title}</h3>
        <p className="author">by {book.author}</p>
        <p><strong>Condition:</strong> {book.condition}</p>
        <button onClick={() => onView(book)}>View Details</button>
      </div>
    </article>
  )
}
