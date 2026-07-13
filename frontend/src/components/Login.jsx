import { useState } from "react";
import { api, saveToken } from "../api";

export default function Login({ onLoggedIn, onSwitchToRegister }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const { access_token } = await api.login(form);
      saveToken(access_token);
      onLoggedIn();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="email"
        placeholder="Correo"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <button type="submit">Entrar</button>
      <p className="link" onClick={onSwitchToRegister}>Crear una cuenta</p>
    </form>
  );
}
