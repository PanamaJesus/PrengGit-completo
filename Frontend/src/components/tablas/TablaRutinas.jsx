import React from "react";

export default function TablaRutinas({ rutinas = [], rangos = {} }) {

  // RANGOS POR DEFECTO
  const rangosDefault = {
    oxigenacion: { normalMin: 95, normalMax: 100, alertaMin: 92, peligroMin: 0 },
    frecuencia: { normalMin: 70, normalMax: 100, alertaMin: 101, peligroMin: 121 },
    presion: { normalMin: 90, normalMax: 120, alertaMin: 121, peligroMin: 140 },
    temperatura: { normalMin: 36.5, normalMax: 37.5, alertaMin: 37.6, peligroMin: 38.1 }
  };

  const R = { ...rangosDefault, ...rangos };

  const getColorClass = (valor, tipo) => {
    if (valor == null) return "text-gray-400"; // fallback

    const r = R[tipo];

    switch (tipo) {
      case "oxigenacion":
        if (valor <= r.alertaMin) return "text-red-600 font-bold";
        if (valor < r.normalMin) return "text-orange-500 font-semibold";
        return "text-green-600 font-semibold";

      case "frecuencia":
        if (valor >= r.peligroMin) return "text-red-600 font-bold";
        if (valor > r.normalMax) return "text-orange-500 font-semibold";
        return "text-green-600 font-semibold";

      case "temperatura":
        if (valor >= r.peligroMin) return "text-red-600 font-bold";
        if (valor > r.normalMax) return "text-orange-500 font-semibold";
        return "text-green-600 font-semibold";

      default:
        return "";
    }
  };

  return (
    <div className="w-full max-w-none px-5 py-8 overflow-x-auto">

  <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="p-3">Rutina</th>
            <th className="p-3">Fecha</th>
            <th className="p-3">Oxige (%)</th>
            <th className="p-3">Frec. Cardiaca</th>
            <th className="p-3">Temperatura</th>
            <th className="p-3">Tiempo</th>
          
          </tr>
        </thead>

        <tbody>
          {rutinas.map((r) => (
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-semibold text-gray-800">{r.nombre || "—"}</td>
              <td className="p-3">{r.fecha || "—"}</td>

              <td className={`p-3 ${getColorClass(r.promedioOxigenacion, "oxigenacion")}`}>
                {r.promedioOxigenacion ?? "—"}%
              </td>

              
              <td className={`p-3 ${getColorClass(r.promedioFrecuencia, "frecuencia")}`}>
                {r.promedioFrecuencia ?? "—"} bpm
              </td>
              <td className={`p-3 ${getColorClass(r.temperatura, "temperatura")}`}>
                {r.temperatura ?? "—"} C
              </td> 

              

              <td className="p-3">{r.tiempo || "—"}</td>
             

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
