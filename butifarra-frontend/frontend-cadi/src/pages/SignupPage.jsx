import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import loginBackground from "../assets/login-background.jpg";
import icesiLogo from "../assets/icesi-logo.png";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    if (password !== confirmPassword) {
      setFeedback("Las contraseñas no coinciden.");
      return;
    }

    try {
      await register({
        username,
        email,
        password1: password,
        password2: confirmPassword,
      });
      navigate("/inicio", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo crear la cuenta.";
      setFeedback(message);
    }
  };

  const errorMessage = feedback || error;

  return (
    <div className="flex w-full h-screen">
      <div className="w-full flex flex-col justify-center px-6 py-8 sm:px-12 lg:w-2/5 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-3xl font-semibold text-gray-900">Crea tu cuenta</h1>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes una cuenta? {" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Inicia sesión
            </Link>
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nombre de usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                autoComplete="username"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="usuario123"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="new-password"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="********"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                autoComplete="new-password"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {loading ? "Creando cuenta..." : "Registrarme"}
            </button>

            {errorMessage && !loading && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </form>
        </div>
      </div>

      <div className="bg-white hidden h-full lg:flex items-center justify-center w-3/5">
        <div className="relative lg:flex h-full w-full">
          <img
            className="rounded-4xl w-full h-full object-cover"
            src={loginBackground}
            alt="signup-background"
          />
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-black/30 to-transparent"></div>
          <img
            className="absolute top-4 right-4 w-50"
            src={icesiLogo}
            alt="logo"
          />
        </div>
      </div>
    </div>
  );
}
