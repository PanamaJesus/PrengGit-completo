import React, { useState, useEffect } from "react";
import TablaRutinas from "../../../components/tablas/TablaRutinas";

export default function DatosRutinas() {
  const [rutinas, setRutinas] = useState([]);
  const [rangos, setRangos] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) return;

    fetch("http://127.0.0.1:8000/api/historial/usuario/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id: usuario.id }),
    })
      .then(response => {
        if (!response.ok) throw new Error("Error al obtener las rutinas");
        return response.json();
      })
      .then(data => {
        // Transformamos los datos si es necesario
        console.log("Datos de rutinas:", data);
        setRutinas(data.rutinas);
        setRangos(data.rangos);
        setCargando(false);
      })
      .catch(err => {
        console.error(err);
        setCargando(false);
      });
  }, []);

  if (cargando) return <p>Cargando rutinas...</p>;

  return (
<div className="w-full max-w-none px-5 py-8 mx-0 bg-white shadow-lg rounded-xl p-6 mt-10">

<h1 className="text-2xl font-bold text-gray-800 mb-6 ">
        Datos de Rutinas Realizadas
      </h1>

      <TablaRutinas 
        rutinas={rutinas}
        rangos={{
          oxigenacion: {
            normalMin: rangos?.rox_inferior || 95,
            alertaMin: (rangos?.rox_inferior || 95) - 3,
            peligroMin: 0
          },
          frecuencia: {
            normalMin: rangos?.rbpm_inferior || 70,
            normalMax: rangos?.rbpm_superior || 100,
            alertaMin: (rangos?.rbpm_superior || 100) + 1,
            peligroMin: (rangos?.rbpm_superior || 100) + 20
          },
          temperatura: "C"
        }}
      />
    </div>
  );
}
