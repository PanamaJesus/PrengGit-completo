// page/admin/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dumbbell, Users, Calendar, FileText, Eye, Edit, Trash2 } from "lucide-react";
import StatCard from "../components/StatCard";

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: "Total Ejercicios", value: "...", change: "", icon: Dumbbell, colorIndex: 0 },
    { title: "Usuarios Activos", value: "...", change: "", icon: Users, colorIndex: 1 },
    { title: "Rutinas Creadas", value: "...", change: "", icon: Calendar, colorIndex: 2 },
    { title: "Contenidos", value: "...", change: "", icon: FileText, colorIndex: 3 },
  ]);

  const [recentActivities, setRecentActivities] = useState([]);

  // --------------------------------------
  // 🔥 Cargar estadísticas reales
  // --------------------------------------
  const loadStats = async () => {
    try {
      const [ejercicios, usuarios, rutinas, contenidos] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/ejercicio/"),
        axios.get("http://127.0.0.1:8000/api/usuario/"),
        axios.get("http://127.0.0.1:8000/api/rutina/"),
        axios.get("http://127.0.0.1:8000/api/contenido/"),
      ]);

      setStats([
        { title: "Total Ejercicios", value: ejercicios.data.length, change: "+0%", icon: Dumbbell, colorIndex: 0 },
        { title: "Usuarios Activos", value: usuarios.data.length, change: "+0%", icon: Users, colorIndex: 1 },
        { title: "Rutinas Creadas", value: rutinas.data.length, change: "+0%", icon: Calendar, colorIndex: 2 },
        { title: "Contenidos", value: contenidos.data.length, change: "+0%", icon: FileText, colorIndex: 3 },
      ]);
    } catch (err) {
      console.error("Error cargando estadísticas:", err);
    }
  };

  // --------------------------------------
  // 🔥 Cargar actividades recientes (fallback)
  // --------------------------------------
  const loadActivities = async () => {
    try {
      // Si tienes endpoint real de actividades, reemplaza esto:
      setRecentActivities([
        {
          id: "US-" + Date.now(),
          user: "Sistema",
          activity: "El dashboard cargó correctamente",
          type: "Sistema",
          status: "Actualizado",
          date: new Date().toLocaleDateString(),
        },
      ]);
    } catch (err) {
      console.error("Error cargando actividades:", err);
    }
  };

  useEffect(() => {
    loadStats();
    loadActivities();
  }, []);

  // --------------------------------------
  // COLORES DEL ESTADO
  // --------------------------------------
  const getStatusStyle = (status) => {
    switch (status) {
      case "Completado":
        return { backgroundColor: "#FFECCC", color: "#722323", borderColor: "#FFC29B" };
      case "Nuevo":
        return { backgroundColor: "#FFC29B", color: "#722323", borderColor: "#F39F9F" };
      case "Pendiente":
        return { backgroundColor: "#FAF5FF", color: "#BA487F", borderColor: "#FFC29B" };
      case "Actualizado":
        return { backgroundColor: "#F39F9F", color: "#722323", borderColor: "#B95E82" };
      default:
        return { backgroundColor: "#FFECCC", color: "#722323", borderColor: "#FFC29B" };
    }
  };

  return (
    <div className="p-0 m-0 min-h-full w-full" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <div className="mb-8 px-6 pt-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#722323" }}>Dashboard</h1>
        <p style={{ color: "#BA487F" }}>Bienvenido de nuevo, aquí está tu resumen</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} delay={index * 0.1} />
        ))}
      </div>

      {/* Tabla de actividades */}
      <div className="bg-white rounded-xl shadow-md border-2 mx-6 mb-6" style={{ borderColor: "#BA487F" }}>
        <div className="p-6 border-b-2" style={{ borderBottomColor: "#FFECCC" }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold" style={{ color: "#722323" }}>Actividades Recientes</h2>
              <p className="text-sm mt-1" style={{ color: "#BA487F" }}>
                Últimas acciones en el sistema
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "#FFECCC" }}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#722323" }}>ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#722323" }}>Usuario</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#722323" }}>Actividad</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#722323" }}>Tipo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#722323" }}>Estado</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#722323" }}>Fecha</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>

            <tbody>
              {recentActivities.map((activity, index) => (
                <tr key={index} className="border-b" style={{ borderBottomColor: "#FFECCC" }}>
                  <td className="px-6 py-4 font-semibold" style={{ color: "#722323" }}>
                    {activity.id}
                  </td>

                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                         style={{ background: "linear-gradient(135deg, #FF9587 0%, #BA487F 100%)" }}>
                      {activity.user[0]}
                    </div>
                    {activity.user}
                  </td>

                  <td className="px-6 py-4" style={{ color: "#722323" }}>{activity.activity}</td>

                  <td className="px-6 py-4" style={{ color: "#BA487F" }}>{activity.type}</td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border"
                          style={getStatusStyle(activity.status)}>
                      {activity.status}
                    </span>
                  </td>

                  <td className="px-6 py-4" style={{ color: "#BA487F" }}>{activity.date}</td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Eye size={18} style={{ color: "#722323", cursor: "pointer" }} />
                      <Edit size={18} style={{ color: "#BA487F", cursor: "pointer" }} />
                      <Trash2 size={18} style={{ color: "#FF9587", cursor: "pointer" }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
