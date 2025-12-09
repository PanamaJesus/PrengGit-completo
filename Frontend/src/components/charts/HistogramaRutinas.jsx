import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function HistogramaRutinas() {
  const usuario = JSON.parse(localStorage.getItem("usuario")) || {};

  const [lecturas, setLecturas] = useState([]);
  const [metrica, setMetrica] = useState("ox"); // "ox", "bpm" o "temperatura"
  const [mes, setMes] = useState("2025-01");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const metricLabels = {
    ox: "Oxigenación (%)",
    bpm: "Frecuencia Cardiaca (bpm)",
    temperatura: "Temperatura (°C)",
  };

  const getColorByRange = (valor, tipo) => {
    switch (tipo) {
      case "ox":
        if (valor <= 91) return "#dc2626";
        if (valor <= 94) return "#f97316";
        return "#16a34a";
      case "bpm":
        if (valor >= 121) return "#dc2626";
        if (valor > 100) return "#f97316";
        return "#16a34a";
      case "temperatura":
        if (valor >= 38.1) return "#dc2626";
        if (valor > 37.5) return "#f97316";
        return "#16a34a";
      default:
        return "#3b82f6";
    }
  };

  const fetchLecturas = async () => {
    if (!usuario.id) return;

    setLoading(true);
    setError("");

    const mesNumero = parseInt(mes.split("-")[1]);

    try {
      const response = await fetch(
        "http://localhost:8000/api/lectura/usuario-mes/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario_id: usuario.id,
            tipo: metrica,
            mes: mesNumero,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al obtener lecturas");
      }

      const data = await response.json();
      setLecturas(data.datos || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLecturas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturas();
  }, [usuario.id, metrica, mes]);

  // Formatear datos para la gráfica
  const dataHistograma = lecturas.map((l) => ({
    dia: new Date(l.fecha).getDate(), // número del día
    valor: Number(l.valor),
  }));

  if (!usuario.id) return <p>No hay usuario logueado</p>;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Histograma de Lecturas / Rendimiento
      </h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="p-2 border rounded-lg"
          value={metrica}
          onChange={(e) => setMetrica(e.target.value)}
        >
          <option value="ox">Oxigenación</option>
          <option value="bpm">Frecuencia Cardiaca</option>
          <option value="temperatura">Temperatura</option>
        </select>

        <input
          type="month"
          className="p-2 border rounded-lg"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
        />
      </div>

      {loading && <p>Cargando lecturas...</p>}
      {error && <p className="text-red-600 font-bold">{error}</p>}

      {!loading && !error && dataHistograma.length > 0 && (
        <div className="w-full h-80">
          <ResponsiveContainer>
            <BarChart data={dataHistograma}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valor" name={metricLabels[metrica]}>
                {dataHistograma.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColorByRange(entry.valor, metrica)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {!loading && !error && dataHistograma.length === 0 && (
        <p>No hay lecturas para este mes y métrica.</p>
      )}
    </div>
  );
}
  