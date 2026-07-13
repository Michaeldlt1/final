import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import BookList from "./components/BookList";
import { isLoggedIn } from "./api";

export default function App() {
  const [view, setView] = useState(isLoggedIn() ? "books" : "login");

  return (
    <div className="app">
      <h1>📚 BookTrack</h1>
      {view === "login" && (
        <Login
          onLoggedIn={() => setView("books")}
          onSwitchToRegister={() => setView("register")}
        />
      )}
      {view === "register" && (
        <Register onSwitchToLogin={() => setView("login")} />
      )}
      {view === "books" && <BookList onLogout={() => setView("login")} />}
    </div>
  );
}
