import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 404:
            setError("Correo no registrado.");
            break;
          case 400:
            setError("Credenciales incorrectas.");
            break;
          default:
            setError("Error en el inicio de sesión. Por favor, intenta de nuevo.");
        }
        return;
      }

      // Guardar tokens
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      // Guardar información del usuario siempre
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      sessionStorage.setItem("userId", data.usuario.id);

      alert("Inicio de sesión exitoso");

      // Navegar según rol
      switch (data.usuario.rol) {
        case 1:
          localStorage.setItem("adminLoggedIn", "true");

          navigate("/IdxAdmin"); 
          break;
        case 2:
          navigate("/contenido-usuario"); 
          break;
        default:
          navigate("/"); 
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Ocurrió un error al conectar con el servidor.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-gray-700">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full p-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ingresa tu correo"
            required
          />
          <label className="block text-gray-700 mt-4">Contraseña</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full p-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
