const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

function getToken() {
  return localStorage.getItem("booktrack_token");
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let detail = "Error en la solicitud";
    try {
      const data = await res.json();
      detail = data.detail || detail;
    } catch (_) {}
    throw new Error(detail);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/auth/me"),
  listBooks: () => request("/books"),
  createBook: (payload) => request("/books", { method: "POST", body: JSON.stringify(payload) }),
  updateBook: (id, payload) => request(`/books/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteBook: (id) => request(`/books/${id}`, { method: "DELETE" }),
};

export function saveToken(token) {
  localStorage.setItem("booktrack_token", token);
}

export function clearToken() {
  localStorage.removeItem("booktrack_token");
}

export function isLoggedIn() {
  return !!getToken();
}
