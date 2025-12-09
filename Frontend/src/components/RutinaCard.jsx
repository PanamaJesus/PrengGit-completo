import React from "react";

export default function RutinaCard({ rutina }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer">

      <img
        src={rutina.imagen}
        alt={rutina.titulo}
        className="w-full h-36 object-cover rounded-lg mb-3"
      />

      <h3 className="text-lg font-semibold">{rutina.titulo}</h3>

      <p className="text-gray-600 text-sm mt-1">
        Categoría: <span className="font-semibold">{rutina.categoria}</span>
      </p>

      <p className="text-gray-600 text-sm">
        Esfuerzo: <span className="font-semibold">{rutina.esfuerzo}</span>
      </p>

      <p className="text-gray-600 text-sm mb-2">
        Semanas: <span className="font-semibold">{rutina.semanas}</span>
      </p>

      <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg">
        Ver Rutina
      </button>
    </div>
  );
}
