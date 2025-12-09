import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Historial = () => {
  const [historial, setHistorial] = useState([]);
  const [rutinas, setRutinas] = useState([]);

  const [mes, setMes] = useState("10");
  const [anio, setAnio] = useState("2025");

  // Cargar datos reales del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historialRes, rutinasRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/historial/"),
          axios.get("http://127.0.0.1:8000/api/rutina/"),
        ]);

        setHistorial(historialRes.data);
        setRutinas(rutinasRes.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    fetchData();
  }, []);

  // Filtrar por mes y año
  const filtered = historial.filter((item) => {
    const fecha = new Date(item.fecha);
    return (
      fecha.getMonth() + 1 === Number(mes) &&
      fecha.getFullYear() === Number(anio)
    );
  });

  // Obtener nombre de rutina por ID
  const getRutina = (id) => {
    const r = rutinas.find((rt) => rt.id === id);
    return r ? r.nombre : "Desconocida";
  };

  // --------- A) GRÁFICA DE LÍNEAS (BPM, Oxígeno, Tiempo) ---------
  const lineLabels = filtered.map((h) => getRutina(h.rutina));

  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: "BPM Promedio",
        data: filtered.map((h) => h.avg_bpm),
        borderColor: "#FF1744",
        backgroundColor: "#FF1744",
        tension: 0.3,
      },
      {
        label: "Oxígeno Promedio (%)",
        data: filtered.map((h) => parseFloat(h.avg_oxigeno)),
        borderColor: "#2979FF",
        backgroundColor: "#2979FF",
        tension: 0.3,
      },
      {
        label: "Tiempo (minutos)",
        data: filtered.map((h) => Math.floor(h.tiempo / 60)),
        borderColor: "#00E676",
        backgroundColor: "#00E676",
        tension: 0.3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Tendencia por rutina",
        color: "#722323",
      },
    },
  };

  // --------- B) GRÁFICA DE BARRAS (Agrupada por rutina) ---------

  // Agrupar datos por rutina
  const rutinaStats = {};

  filtered.forEach((h) => {
    const nombre = getRutina(h.rutina);

    if (!rutinaStats[nombre]) {
      rutinaStats[nombre] = {
        count: 0,
        totalBpm: 0,
        totalOxigeno: 0,
        totalTiempo: 0,
      };
    }

    rutinaStats[nombre].count++;
    rutinaStats[nombre].totalBpm += h.avg_bpm;
    rutinaStats[nombre].totalOxigeno += parseFloat(h.avg_oxigeno);
    rutinaStats[nombre].totalTiempo += h.tiempo / 60;
  });

  const barLabels = Object.keys(rutinaStats);

  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: "Promedio BPM",
        data: barLabels.map(
          (name) => rutinaStats[name].totalBpm / rutinaStats[name].count
        ),
        backgroundColor: "#FF4081",
      },
      {
        label: "Promedio Oxígeno (%)",
        data: barLabels.map(
          (name) => rutinaStats[name].totalOxigeno / rutinaStats[name].count
        ),
        backgroundColor: "#536DFE",
      },
      {
        label: "Promedio Tiempo (min)",
        data: barLabels.map(
          (name) => rutinaStats[name].totalTiempo / rutinaStats[name].count
        ),
        backgroundColor: "#00E5FF",
      },
      {
        label: "Cantidad de Actividades",
        data: barLabels.map((name) => rutinaStats[name].count),
        backgroundColor: "#FFC400",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Promedios por Rutina",
        color: "#722323",
      },
    },
  };

  return (
    <div className="p-8">

      {/* Filtros globales */}
      <div className="flex gap-4 mb-8">
        <div>
          <label>Mes:</label>
          <select
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="1">Enero</option>
            <option value="2">Febrero</option>
            <option value="3">Marzo</option>
            <option value="4">Abril</option>
            <option value="5">Mayo</option>
            <option value="6">Junio</option>
            <option value="7">Julio</option>
            <option value="8">Agosto</option>
            <option value="9">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
          </select>
        </div>

        <div>
          <label>Año:</label>
          <select
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>
      </div>

      {/* A) Línea */}
      <div className="mb-12 p-6 rounded-xl border shadow">
        <Line data={lineData} options={lineOptions} />
      </div>

      {/* B) Barras */}
      <div className="mb-12 p-6 rounded-xl border shadow">
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
};

export default Historial;
