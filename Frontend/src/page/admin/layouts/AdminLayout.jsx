// page/admin/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="flex h-screen overflow-hidden bg-bgLight">
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden bg-bgLight">
        <Navbar />

        {/* Agregado: pt-20 para compensar el navbar fixed */}
        <main className="flex-1 overflow-y-auto p-0 m-0 bg-bgLight pt-20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
