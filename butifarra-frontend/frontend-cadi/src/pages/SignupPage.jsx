import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    try {
      await register({ username, email, password1, password2 });
      navigate("/inicio", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo crear la cuenta.";
      setFeedback(message);
    }
  };

  const errorMessage = feedback || error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Crear una cuenta</h1>
          <p className="mt-2 text-sm text-gray-600">
            Regístrate para acceder a los servicios de Bienestar Universitario.
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Nombre de usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none"
              placeholder="Tu nombre de usuario"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none"
              placeholder="correo@icesi.edu.co"
            />
          </div>

          <div>
            <label htmlFor="password1" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password1"
              type="password"
              value={password1}
              onChange={(event) => setPassword1(event.target.value)}
              autoComplete="new-password"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none"
              placeholder="Introduce una contraseña"
            />
          </div>

          <div>
            <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
              Confirmación de contraseña
            </label>
            <input
              id="password2"
              type="password"
              value={password2}
              onChange={(event) => setPassword2(event.target.value)}
              autoComplete="new-password"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none"
              placeholder="Repite la contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <div className="space-y-2 text-center text-sm">
          {errorMessage && !loading && (
            <p className="text-red-600">{errorMessage}</p>
          )}
          {loading && <p className="text-gray-600">Procesando registro...</p>}
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link className="font-medium text-indigo-600 hover:underline" to="/login">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
