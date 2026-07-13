import { useEffect, useState } from "react";
import { api, clearToken } from "../api";

const STATUS_LABELS = {
  por_leer: "Por leer",
  leyendo: "Leyendo",
  leido: "Leído",
};

export default function BookList({ onLogout }) {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [error, setError] = useState("");

  async function loadBooks() {
    try {
      setBooks(await api.listBooks());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await api.createBook({ title, author, genre, status: "por_leer" });
      setTitle("");
      setAuthor("");
      setGenre("");
      loadBooks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function cycleStatus(book) {
    const order = ["por_leer", "leyendo", "leido"];
    const next = order[(order.indexOf(book.status) + 1) % order.length];
    await api.updateBook(book.id, { status: next });
    loadBooks();
  }

  async function rateBook(book, rating) {
    await api.updateBook(book.id, { rating });
    loadBooks();
  }

  async function handleDelete(id) {
    await api.deleteBook(id);
    loadBooks();
  }

  function handleLogout() {
    clearToken();
    onLogout();
  }

  return (
    <div className="card wide">
      <div className="header-row">
        <h2>Mis libros</h2>
        <button className="secondary" onClick={handleLogout}>Cerrar sesión</button>
      </div>

      {error && <p className="error">{error}</p>}

      <form className="inline-form" onSubmit={handleCreate}>
        <input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input placeholder="Autor" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        <input placeholder="Género (opcional)" value={genre} onChange={(e) => setGenre(e.target.value)} />
        <button type="submit">Agregar</button>
      </form>

      <ul className="book-list">
        {books.map((book) => (
          <li key={book.id}>
            <div className="book-info">
              <strong>{book.title}</strong>
              <span className="author"> — {book.author}</span>
              {book.genre && <span className="genre"> ({book.genre})</span>}
              <span className={`status status-${book.status}`} onClick={() => cycleStatus(book)}>
                {STATUS_LABELS[book.status]}
              </span>
              {book.status === "leido" && (
                <span className="rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={n <= (book.rating || 0) ? "star filled" : "star"}
                      onClick={() => rateBook(book, n)}
                    >
                      ★
                    </span>
                  ))}
                </span>
              )}
            </div>
            <button className="danger" onClick={() => handleDelete(book.id)}>Eliminar</button>
          </li>
        ))}
        {books.length === 0 && <p>Todavía no tienes libros registrados.</p>}
      </ul>
    </div>
  );
}
