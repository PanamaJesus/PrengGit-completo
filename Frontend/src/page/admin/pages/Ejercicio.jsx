// page/admin/pages/Ejercicio.jsx
import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Plus, Search, Loader, X } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Ejercicio = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para filtros
  const [filtroNivel, setFiltroNivel] = useState('');
  const [filtroSemana, setFiltroSemana] = useState('');

  // Estados para modales
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEjercicio, setSelectedEjercicio] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    nivel_esfuerzo: 1,
    sug_semanas: '',
    usuario: '',
    animacion: '',
    imagen: null,
    nombreArchivo: ''
  });

  useEffect(() => {
    fetchEjercicios();
  }, []);

  const fetchEjercicios = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/ejercicio/');
      if (!response.ok) throw new Error('Error al cargar los ejercicios');
      const data = await response.json();

      // Traer imágenes y mapear por ID (usando el campo animacion)
      const resImgs = await fetch('http://127.0.0.1:8000/api/imagenes/');
      const imgs = await resImgs.json();

      const ejerciciosConImagen = data.map(ej => {
        const img = ej.animacion ? imgs.find(i => i.id === parseInt(ej.animacion)) : null;
        return { 
          ...ej, 
          imagenUrl: img ? img.url : null, 
          nombreArchivo: img ? img.url.split('/').pop() : ''
        };
      });

      setEjercicios(ejerciciosConImagen);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching ejercicios:', err);
    } finally {
      setLoading(false);
    }
  };

  // CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imagenId = formData.animacion; // Mantener el ID existente si no hay nueva imagen

      // 1. Si hay nueva imagen, subirla primero
      if (formData.imagen) {
        const formImg = new FormData();
        formImg.append('url', formData.imagen);
        formImg.append('proposito', formData.nombre);
        
        const resImg = await fetch('http://127.0.0.1:8000/api/imagenes/', {
          method: 'POST',
          body: formImg
        });
        
        if (resImg.ok) {
          const imgData = await resImg.json();
          imagenId = imgData.id; // Guardar el ID de la nueva imagen
          
          // Si estamos editando y había una imagen anterior, eliminarla
          if (isEditing && selectedEjercicio.animacion) {
            try {
              await fetch(`http://127.0.0.1:8000/api/imagenes/${selectedEjercicio.animacion}/`, {
                method: 'DELETE'
              });
            } catch (err) {
              console.error('Error eliminando imagen anterior:', err);
            }
          }
        }
      }

      // 2. Guardar/actualizar el ejercicio con el ID de la imagen
      const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        nivel_esfuerzo: parseInt(formData.nivel_esfuerzo) || 1,
        sug_semanas: formData.sug_semanas,
        usuario: usuarioLogueado.id,
        animacion: imagenId || null // Asociar el ID de la imagen
      };

      const response = await fetch(
        isEditing
          ? `http://127.0.0.1:8000/api/ejercicio/${selectedEjercicio.id}/`
          : 'http://127.0.0.1:8000/api/ejercicio/',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) throw new Error('Error al guardar el ejercicio');

      await fetchEjercicios();
      setShowModal(false);

      MySwal.fire({
        icon: 'success',
        title: isEditing ? 'Ejercicio actualizado' : 'Ejercicio creado',
        text: `✅ ${formData.nombre} ha sido ${isEditing ? 'actualizado' : 'creado'} correctamente`
      });

      // Reset formulario
      setFormData({
        nombre: '',
        descripcion: '',
        nivel_esfuerzo: 1,
        sug_semanas: '',
        usuario: '',
        animacion: '',
        imagen: null,
        nombreArchivo: ''
      });
      setSelectedEjercicio(null);
      setIsEditing(false);
    } catch (err) {
      MySwal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  // DELETE
  const handleDelete = async () => {
    try {
      // 1. Eliminar la imagen asociada si existe
      if (selectedEjercicio.animacion) {
        try {
          await fetch(`http://127.0.0.1:8000/api/imagenes/${selectedEjercicio.animacion}/`, {
            method: 'DELETE'
          });
        } catch (err) {
          console.error('Error eliminando imagen:', err);
        }
      }

      // 2. Eliminar el ejercicio
      const response = await fetch(`http://127.0.0.1:8000/api/ejercicio/${selectedEjercicio.id}/`, { 
        method: 'DELETE' 
      });
      if (!response.ok) throw new Error('Error al eliminar el ejercicio');

      await fetchEjercicios();
      setShowDeleteModal(false);
      setSelectedEjercicio(null);

      MySwal.fire({ 
        icon: 'success', 
        title: 'Ejercicio eliminado', 
        text: '✅ Se eliminó correctamente junto con su imagen' 
      });
    } catch (err) {
      MySwal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({
      nombre: '',
      descripcion: '',
      nivel_esfuerzo: 1,
      sug_semanas: '',
      usuario: '',
      animacion: '',
      imagen: null,
      nombreArchivo: ''
    });
    setShowModal(true);
  };

  const openEditModal = (ejercicio) => {
    setIsEditing(true);
    setSelectedEjercicio(ejercicio);
    setFormData({
      nombre: ejercicio.nombre,
      descripcion: ejercicio.descripcion,
      nivel_esfuerzo: ejercicio.nivel_esfuerzo,
      sug_semanas: ejercicio.sug_semanas,
      usuario: ejercicio.usuario,
      animacion: ejercicio.animacion,
      imagen: null,
      nombreArchivo: ejercicio.nombreArchivo || ''
    });
    setShowModal(true);
  };

  const openDeleteModal = (ejercicio) => {
    setSelectedEjercicio(ejercicio);
    setShowDeleteModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setSelectedEjercicio(null);
    setIsEditing(false);
    setFormData(prev => ({ ...prev, imagen: null }));
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagen' && files.length > 0) {
      setFormData(prev => ({ ...prev, imagen: files[0], nombreArchivo: files[0].name }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const getNivelEsfuerzoLabel = (nivel) => {
    switch(nivel) {
      case 1: return 'Bajo';
      case 2: return 'Medio';
      case 3: return 'Alto';
      default: return 'Desconocido';
    }
  };

  const getNivelEsfuerzoStyle = (nivel) => {
    switch(nivel) {
      case 1: return { backgroundColor: '#FFECCC', color: '#722323', borderColor: '#FFC29B' };
      case 2: return { backgroundColor: '#FFC29B', color: '#722323', borderColor: '#F39F9F' };
      case 3: return { backgroundColor: '#F39F9F', color: '#722323', borderColor: '#B95E82' };
      default: return { backgroundColor: '#FFECCC', color: '#722323', borderColor: '#FFC29B' };
    }
  };

  const filteredEjercicios = ejercicios.filter((ejercicio) => {
    const matchesSearch =
      ejercicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ejercicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesNivel = filtroNivel ? ejercicio.nivel_esfuerzo === parseInt(filtroNivel) : true;
    const matchesSemana = filtroSemana ? ejercicio.sug_semanas === parseInt(filtroSemana) : true;

    return matchesSearch && matchesNivel && matchesSemana;
  });

  return (
    <div className="p-0 m-0 min-h-full w-full" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#722323' }}>Gestión de Ejercicios</h1>
          <p style={{ color: '#BA487F' }}>Administra los ejercicios del sistema</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all font-medium hover:shadow-lg transform hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #722323 0%, #BA487F 100%)' }}
        >
          <Plus size={20} /> Nuevo Ejercicio
        </button>
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-3 px-6 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#BA487F' }} size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 rounded-lg focus:outline-none"
            style={{ borderColor: '#FFECCC', height: '36px' }}
          />
        </div>
        <select value={filtroNivel} onChange={(e) => setFiltroNivel(e.target.value)} className="px-2 py-1 border-2 rounded-lg text-sm" style={{ borderColor: '#FFECCC', height: '36px' }}>
          <option value="">Todos los niveles</option>
          <option value="1">Bajo</option>
          <option value="2">Medio</option>
          <option value="3">Alto</option>
        </select>
        <input type="number" placeholder="Semana" value={filtroSemana} onChange={(e) => setFiltroSemana(e.target.value)} className="px-2 py-1 border-2 rounded-lg text-sm" style={{ borderColor: '#FFECCC', height: '36px', width: '80px' }} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin" size={40} style={{ color: '#BA487F' }} />
          <span className="ml-3 text-lg" style={{ color: '#722323' }}>Cargando ejercicios...</span>
        </div>
      ) : error ? (
        <div className="mx-6 mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F39F9F', color: '#722323' }}>
          <p className="font-semibold">Error: {error}</p>
          <button onClick={fetchEjercicios} className="mt-2 px-4 py-2 bg-white rounded-lg">Reintentar</button>
        </div>
      ) : (
        <div className="mx-6 mb-6">
          <div className="bg-white rounded-xl shadow-md border-2" style={{ borderColor: '#BA487F' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: '#FFECCC' }}>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#722323' }}>ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#722323' }}>Nombre</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#722323' }}>Imagen</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#722323' }}>Descripción</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#722323' }}>Nivel Esfuerzo</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#722323' }}>Semanas</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#722323' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEjercicios.map((ejercicio) => (
                    <tr key={ejercicio.id} className="border-b transition-colors" style={{ borderBottomColor: '#FFECCC' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFECC0'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <td className="px-6 py-4">{ejercicio.id}</td>
                      <td className="px-6 py-4">{ejercicio.nombre}</td>
                      <td className="px-6 py-4">
                        {ejercicio.imagenUrl ? (
                          <div className="flex items-center gap-2">
                            <img src={ejercicio.imagenUrl} alt={ejercicio.nombre} className="w-10 h-10 object-cover rounded-md" />
                            <span className="text-sm" style={{ color: '#722323' }}>{ejercicio.nombreArchivo}</span>
                          </div>
                        ) : (
                          <span className="text-sm" style={{ color: '#722323' }}>Sin imagen</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{ejercicio.descripcion}</td>
                      <td className="px-6 py-4"><span className="px-3 py-1 rounded-full text-xs font-semibold border" style={getNivelEsfuerzoStyle(ejercicio.nivel_esfuerzo)}>{getNivelEsfuerzoLabel(ejercicio.nivel_esfuerzo)}</span></td>
                      <td className="px-6 py-4 text-center" style={{ color: '#BA487F' }}>{ejercicio.sug_semanas} sem.</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button onClick={() => openEditModal(ejercicio)} style={{ color: '#BA487F' }}><Edit size={18} /></button>
                        <button onClick={() => openDeleteModal(ejercicio)} style={{ color: '#FF9587' }}><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold" style={{ color: '#722323' }}>
                {isEditing ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
              </h2>
              <button onClick={closeModal}><X size={24} style={{ color: '#722323' }} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#722323' }}>Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required className="w-full px-3 py-2 border-2 rounded-lg" style={{ borderColor: '#FFECCC' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#722323' }}>Descripción</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} required className="w-full px-3 py-2 border-2 rounded-lg" style={{ borderColor: '#FFECCC' }} rows="3" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#722323' }}>Nivel de Esfuerzo</label>
                <select name="nivel_esfuerzo" value={formData.nivel_esfuerzo} onChange={handleInputChange} className="w-full px-3 py-2 border-2 rounded-lg" style={{ borderColor: '#FFECCC' }}>
                  <option value="1">Bajo</option>
                  <option value="2">Medio</option>
                  <option value="3">Alto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#722323' }}>Semanas Sugeridas</label>
                <input type="number" name="sug_semanas" value={formData.sug_semanas} onChange={handleInputChange} required className="w-full px-3 py-2 border-2 rounded-lg" style={{ borderColor: '#FFECCC' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#722323' }}>Imagen</label>
                <input type="file" name="imagen" accept="image/*" onChange={handleInputChange} className="w-full border-2 rounded-lg p-1" style={{ borderColor: '#FFECCC' }} />
                {formData.nombreArchivo && <p className="text-sm mt-1" style={{ color: '#722323' }}>Archivo: {formData.nombreArchivo}</p>}
                {isEditing && !formData.imagen && selectedEjercicio?.imagenUrl && (
                  <p className="text-xs mt-1" style={{ color: '#BA487F' }}>💡 Sube una nueva imagen para reemplazar la actual</p>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border-2 rounded-lg" style={{ borderColor: '#BA487F', color: '#BA487F' }}>Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 text-white rounded-lg" style={{ background: 'linear-gradient(135deg, #722323 0%, #BA487F 100%)' }}>
                  {isEditing ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {showDeleteModal && selectedEjercicio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#722323' }}>Confirmar Eliminación</h2>
            <p style={{ color: '#722323' }}>¿Estás seguro de eliminar el ejercicio <strong>"{selectedEjercicio.nombre}"</strong>?</p>
            <p className="text-sm mt-2" style={{ color: '#BA487F' }}>⚠️ También se eliminará la imagen asociada</p>
            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} className="flex-1 px-4 py-2 border-2 rounded-lg" style={{ borderColor: '#BA487F', color: '#BA487F' }}>Cancelar</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 text-white rounded-lg" style={{ backgroundColor: '#FF9587' }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ejercicio;