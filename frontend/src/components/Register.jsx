import { useState } from "react";
import { api } from "../api";

export default function Register({ onSwitchToLogin }) {
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.register(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  }

  if (success) {
    return (
      <div className="card">
        <h2>Cuenta creada</h2>
        <p>Ya puedes iniciar sesión.</p>
        <button onClick={onSwitchToLogin}>Ir a iniciar sesión</button>
      </div>
    );
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Crear cuenta</h2>
      {error && <p className="error">{error}</p>}
      <input
        placeholder="Nombre completo"
        value={form.full_name}
        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        required
      />
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
        minLength={6}
      />
      <button type="submit">Registrarme</button>
      <p className="link" onClick={onSwitchToLogin}>Ya tengo cuenta</p>
    </form>
  );
}
