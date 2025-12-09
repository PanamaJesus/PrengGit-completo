// page/admin/indexadmin2.jsx
// Punto de entrada principal del panel administrativo
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Usuario from './pages/Usuario';
import Ejercicio from './pages/Ejercicio';
import Contenido from './pages/Contenido';
import TipoTema from './pages/TipoTema';
import Rutinas from './pages/Rutinas';
import Resenas from './pages/Resenas';
import Historial from './pages/Historial';


const IndexAdmin2 = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/ejercicio" element={<Ejercicio />} />
        <Route path="/contenido" element={<Contenido />} />
        <Route path="/tipotema" element={<TipoTema/>} />
        <Route path="/rutina" element={<Rutinas/>} />
        <Route path="/resena" element={<Resenas />} />
        <Route path="/historial" element={<Historial />} />
      </Routes>
    </AdminLayout>
  );
};

export default IndexAdmin2;