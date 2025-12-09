import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarE from "./NavEmb";
import { Mail, Calendar, Baby, HeartPulse } from "lucide-react";
import GaugeRosa from "./GaugeRosa";

export default function Profile() {
  const [usuario, setUsuario] = useState(null);
  const [rangos, setRangos] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // --- Cargar usuario ---
  const fetchUsuario = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/usuario/${userId}/`);
      if (!response.ok) {
        setError("No se pudo cargar la información del usuario.");
        return;
      }
      const data = await response.json();
      setUsuario(data);
    } catch (error) {
      setError("Error de conexión con el servidor.");
    }
  };

  // --- Cargar rangos usando el ID del usuario ---
  const fetchRangos = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/rangos/?usuario=${userId}`);
      if (!response.ok) {
        console.warn("No se pudieron cargar los rangos del usuario.");
        return;
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setRangos(data[0]); // Tomamos el primer registro encontrado
      } else {
        console.warn("No existen rangos para este usuario.");
      }
    } catch (error) {
      console.error("Error al conectar con la API de rangos", error);
    }
  };

  // --- useEffect inicial ---
  useEffect(() => {
    const userString = localStorage.getItem("usuario");
    const user = userString ? JSON.parse(userString) : null;
    const userId = user ? user.id : null;

    if (!userId) {
      setError("No se encontró el ID del usuario.");
      return;
    }

    fetchUsuario(userId);
    fetchRangos(userId);
  }, []);

  if (error) return <p className="text-red-600 text-center mt-4">{error}</p>;
  if (!usuario) return <p className="text-center mt-4">Cargando...</p>;

  return (
    <main className="relative min-h-screen overflow-x-hidden">

      {/* Fondo con blur */}
      <div className="absolute -top-28 -left-28 w-[500px] h-screen bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10"></div>
      
      <NavbarE />

      {/* Fondo superior */}
      <div className="mt-20 w-full h-60 bg-gradient-to-r from-[#BA487F] to-[#F39F9F]"></div>

      {/* Card principal */}
      <div className="max-w-3xl mx-auto -mt-24 bg-white shadow-xl rounded-xl p-8 relative">

        {/* Foto de perfil */}
        <div className="flex justify-center">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/150?img=32"
              alt="perfil"
              className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
            />
          </div>
        </div>

        {/* Nombre */}
        <h2 className="text-2xl font-bold text-center mt-4">
          {usuario.nombre} {usuario.ap_pat} {usuario.ap_mat}
        </h2>

        {/* Info del usuario */}
        <div className="grid grid-cols-2 gap-6 mt-10 p-6 border rounded-xl shadow-sm">

          {/* Correo */}
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-700" />
            <div>
              <p className="font-semibold text-gray-700">Correo:</p>
              <p className="text-gray-600">{usuario.correo}</p>
            </div>
          </div>

          {/* Fecha nacimiento */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-700" />
            <div>
              <p className="font-semibold text-gray-700">Fecha nacimiento:</p>
              <p className="text-gray-600">{usuario.fecha_nacimiento}</p>
            </div>
          </div>

          {/* Semanas embarazo */}
          <div className="flex items-center gap-2">
            <Baby className="w-5 h-5 text-gray-700" />
            <div>
              <p className="font-semibold text-gray-700">Semanas embarazo:</p>
              <p className="text-gray-600">{usuario.semana_embarazo}</p>
            </div>
          </div>

          {rangos && (
          <div className="col-span-2 mt-4 p-4 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-[#F39F9F]" /> Rangos personales
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <GaugeRosa
                titulo="Ritmo cardíaco (mín)"
                valor={rangos.rbpm_inferior}
                min={40}
                max={180}
              />

              <GaugeRosa
                titulo="Ritmo cardíaco (máx)"
                valor={rangos.rbpm_superior}
                min={40}
                max={180}
              />

              <GaugeRosa
                titulo="Oxigenación (mín)"
                valor={Number(rangos.rox_inferior)}
                min={80}
                max={100}
              />

              <GaugeRosa
                titulo="Oxigenación (máx)"
                valor={Number(rangos.rox_superior)}
                min={80}
                max={100}
              />
            </div>
          </div>
        )}


        </div>

        {/* Botón editar */}
        <button
          onClick={() => navigate("/UpdProfile")}
          className="w-full mt-8 bg-[#BA487F] hover:bg-[#a03c71] text-white py-3 rounded-lg font-semibold transition"
        >
          Editar Perfil
        </button>
      </div>
    </main>
  );
}