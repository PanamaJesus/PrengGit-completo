import React from "react";
import { PieChart, Pie, Cell } from "recharts";

export default function SignoGauge({
  title,
  valor,
  unidad,
  rangos = { normalMin: 0, normalMax: 0, peligroMin: 0, peligroMax: 0 }
}) {
  const { normalMin, normalMax, peligroMin, peligroMax } = rangos;

  // 🔥 LÓGICA CORRECTA DE COLORES
  let color = "#22c55e"; // 🟢 verde (normal por defecto)

  if (valor <= peligroMin) color = "#ef4444";      // 🔴 peligro bajo
  else if (valor >= peligroMax) color = "#ef4444"; // 🔴 peligro alto
  else if (valor < normalMin) color = "#f97316";   // 🟠 alerta bajo
  else if (valor > normalMax) color = "#f97316";   // 🟠 alerta alto

  // Calcular porcentaje
  const porcentaje = Math.min(100, Math.max(0, (valor / peligroMax) * 100));

  const data = [
    { name: "valor", value: porcentaje },
    { name: "resto", value: 100 - porcentaje }
  ];

  return (
    <div className="w-medium max-w-md p-4 bg-white rounded-2xl shadow-md">
      
      <div className="flex items-center justify-between">
        
        {/* Título a la izquierda */}
        <h3 className="text-lg font-semibold text-gray-800 w-1/2">
          {title}
        </h3>

        {/* Donut a la derecha */}
        <div className="relative flex items-center justify-center w-1/2">
          <PieChart width={160} height={160}>
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              <Cell fill={color} />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>

          {/* Valor en el centro */}
          <div className="absolute text-center">
            <span className="text-2xl font-bold" style={{ color }}>
              {valor}
            </span>
            <div className="text-sm font-medium text-gray-700">{unidad}</div>
          </div>
        </div>
      </div>

      {/* Rangos debajo */}
      <div className="mt-4 text-sm text-gray-600 text-left">
        <p><strong>Normal:</strong> {normalMin} - {normalMax} {unidad}</p>
        <p><strong>Peligro Bajo:</strong> ≤ {peligroMin} {unidad}</p>
        <p><strong>Peligro Alto:</strong> ≥ {peligroMax} {unidad}</p>
      </div>

    </div>
  );
}
