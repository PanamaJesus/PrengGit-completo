import { useState, useEffect } from "react";

export default function MainEjerciciosAdmin() {
  const [categoria, setCategoria] = useState("");
  const [ejercicios, setEjercicios] = useState([]);

  useEffect(() => {
    if (!categoria) return; // si no hay categoría seleccionada, no hace nada

    fetch(`http://127.0.0.1:8000/api/ejercicio/categoria/?categoria=${categoria}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener ejercicios");
        return res.json();
      })
      .then((data) => setEjercicios(data))
      .catch((err) => console.error("Error:", err));
  }, [categoria]); 

  function AdministracionEjercicios() {
    const [ejercicioSeleccionado, SetEjercicioSeleccionado] = useState({});
    const [allEjercicios, setAllEjercicios] = useState([]);
    const [showModalEditar, setShowModalEditar] = useState(false);
    const [showModalEliminar, setShowModalEliminar] = useState(false);
    const [showModalEliminarComentarios, setShowModalEliminarComentarios] = useState(false);
    const [allComentarios, setAllComentarios] = useState([]);
    const [comentarioSeleccionado, SetComentarioSeleccionado] = useState({});
    const [paginaActual, setPaginaActual] = useState(1);
    const comentariosPorPagina = 5;
    const [showModalConfirmacion, setShowModalConfirmacion] = useState(false);


    useEffect(() => {
         fetch(`http://127.0.0.1:8000/api/ejercicio`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener ejercicios");
        return res.json();
      })
      .then((data) => setAllEjercicios(data))
      .catch((err) => console.error("Error:", err));
  },[]);
  console.log("Ejercicio seleccionado:", ejercicioSeleccionado);
  
const handleDelete = (id) => {
  fetch(`http://127.0.0.1:8000/api/ejercicio/eliminar_ejercicio/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      { id_ejercicio: id }
    )
  })
    .then((res) => {
      if (res.ok) {
        console.log(JSON.stringify({ id_ejercicio: id }));
        setAllEjercicios(allEjercicios.filter((e) => e.id !== id));
        setShowModalEliminar(false);
      } else {
        alert("Error al eliminar ejercicio");
        console.log(res);
        console.log(JSON.stringify({ id_ejercicio: id }));
      }
    })
    .catch((err) => console.error(err));
};

const handleUpdate = (ejercicio) => {
  console.log("Actualizando ejercicio:", ejercicio);
  fetch(`http://127.0.0.1:8000/api/ejercicio/actualizar_ejercicio/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({  
      id_ejercicio: ejercicio.id,
      nombre: ejercicio.nombre,
      descripcion: ejercicio.descripcion,
      nivel_esfuerzo: Number(ejercicio.nivel_esfuerzo),  
      sug_semanas: Number(ejercicio.sug_semanas),        
      categoria: ejercicio.categoria,
      usuario: ejercicio.usuario,
      animacion: ejercicio.animacion
    }),
  })
    .then((res) => {
      if (res.ok) {
        setAllEjercicios(
          allEjercicios.map((e) => (e.id === ejercicio.id ? ejercicio : e))
        );
        setShowModalEditar(false);
      } else {
                console.log({"id_ejercicio": ejercicio.id,
                "nombre": ejercicio.nombre,
                "descripcion": ejercicio.descripcion,
                "nivel_esfuerzo": ejercicio.nivel_esfuerzo,
                "sug_semanas": ejercicio.sug_semanas,
                "categoria": ejercicio.categoria,
                "usuario": ejercicio.usuario,
                "animacion": ejercicio.animacion});

        alert("Error al actualizar ejercicio");
      }
    })
    .catch((err) => console.error(err));
};

const handleGetComentarios = (id) => {
  fetch(`http://127.0.0.1:8000/api/resena/comentarios_ejercicio/`, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
      body: JSON.stringify({  
      ejercicio_id: id,
    }),
  })
    .then((res) => {
        if (!res.ok) throw new Error("Error al obtener ejercicios");
        return res.json();
  })
      .then((data) => setAllComentarios(data))
      .catch((err) => console.error("Error:", err));
};

const handleDeleteComentario = (id) => {
  fetch(`http://127.0.0.1:8000/api/resena/eliminar_comentario/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      { id_comentario: id }
    )
  })
    .then((res) => {
      console.log("Respuesta al eliminar comentario:", res);
      if (res.ok) {
        setAllComentarios(allComentarios.filter((e) => e.id !== id));
        setShowModalEliminarComentarios(false);
        setShowModalConfirmacion(false);
      } else {
        alert("Error al eliminar ejercicio");
        console.log(res);
        console.log(JSON.stringify({ id_ejercicio: id }));
      }
    })
    .catch((err) => console.error(err));
};



  return(
   <div>
      <h2 className="text-lg font-semibold mb-3 text-indigo-600">
        Tabla de todos los ejercicios
      </h2>
      {allEjercicios.length > 0 ? (
        <div className="overflow-x-max">
          <table className="max-w-full border border-gray-300 rounded-lg shadow-md bg-white">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">Nombre del Ejercicio</th>
                <th className="py-2 px-4 text-left">Descripcion</th>
                <th className="py-2 px-4 text-left">Nivel de esfuerzo</th>
                <th className="py-2 px-4 text-left">Sem sugeridas</th>
                <th className="py-2 px-4 text-left">Categoria</th>
                <th className="py-2 px-4 text-left">Animacion</th>
                <th className="py-2 px-4 text-left">Comentarios</th>
                <th className="py-2 px-4 text-left"></th>
                <th className="py-2 px-4 text-left"></th>

              </tr>
            </thead>
            <tbody>
              {allEjercicios.map  ((e, i) => (
                <tr key={i} className="border-b hover:bg-indigo-50 transition-all">
                  <td className="py-2 px-4">{e.id}</td>
                  <td className="py-2 px-4">{e.nombre}</td>
                  <td className="py-2 px-4">{e.descripcion}</td>
                  <td className="py-2 px-4">{e.nivel_esfuerzo}</td>
                  <td className="py-2 px-4">{e.sug_semanas}</td>
                  <td className="py-2 px-4">{e.categoria}</td>
                  <td className="py-2 px-4">{e.animacion}</td>

                  <td className="py-2 px-4">
                    <button className="px-4 py-2 rounded-lg font-medium transition-all underline"
                    onClick={()=>{SetEjercicioSeleccionado(e); setShowModalEliminarComentarios(true); handleGetComentarios(e.id)}}>{e.contador_resenas}</button>
                  </td>

                  <td className="py-2 px-4">
                    <button className="px-4 py-2 rounded-lg font-medium transition-all"
                    onClick={()=>{SetEjercicioSeleccionado(e); setShowModalEliminar(true)}}>❎</button>
                  </td>
                  
                  <td className="py-2 px-4">
                    <button className="px-4 py-2 rounded-lg font-medium transition-all"
                    onClick={()=>{SetEjercicioSeleccionado(e); setShowModalEditar(true)}}>✏️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            
          {showModalEliminar && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h3 className="text-lg font-semibold mb-4 text-red-600">Eliminar ejercicio</h3>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModalEliminar(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleDelete(ejercicioSeleccionado.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}

          {showModalEditar && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
                <h3 className="text-lg font-semibold mb-4 text-indigo-600">Editar ejercicio</h3>

                <label className="block mb-2 text-sm font-medium">Nombre</label>
                <input
                  className="w-full border rounded px-3 py-2 mb-3"
                  value={ejercicioSeleccionado.nombre || ""}
                  onChange={(e) =>
                    SetEjercicioSeleccionado({
                      ...ejercicioSeleccionado,
                      nombre: e.target.value,
                    })
                  }
                />

                <label className="block mb-2 text-sm font-medium">Descripción</label>
                <textarea
                  className="w-full border rounded px-3 py-2 mb-3"
                  value={ejercicioSeleccionado.descripcion || ""}
                  onChange={(e) =>
                    SetEjercicioSeleccionado({
                      ...ejercicioSeleccionado,
                      descripcion: e.target.value,
                    })
                  }
                />
                
                <label className="block mb-2 text-sm font-medium">Nivel de esfuerzo</label>
                <input
                  className="w-full border rounded px-3 py-2 mb-3"
                  type="number"
                  min="1" max="3"
                  value={ejercicioSeleccionado.nivel_esfuerzo || ""}
                  onChange={(e) =>
                    SetEjercicioSeleccionado({
                      ...ejercicioSeleccionado,
                      nivel_esfuerzo: Number(e.target.value),
                    })
                  }
                />

                <label className="block mb-2 text-sm font-medium">Semanas de embarazo</label>
                <input
                  className="w-full border rounded px-3 py-2 mb-3"
                  type="number"
                  min="1" max="42"
                  value={ejercicioSeleccionado.sug_semanas || ""}
                  onChange={(e) =>
                    SetEjercicioSeleccionado({
                      ...ejercicioSeleccionado,
                      sug_semanas: Number(e.target.value),
                    })
                  }
                />

                <label className="block mb-2 text-sm font-medium">Categoría</label>
                  <select
                    className="w-full border rounded px-3 py-2 mb-3"
                    value={ejercicioSeleccionado.categoria || ""}
                    onChange={(e) =>
                      SetEjercicioSeleccionado({
                        ...ejercicioSeleccionado,
                        categoria: e.target.value,
                      })
                    }
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>

              <label className="block mb-2 text-sm font-medium">Animación (GIF o video)</label>
                <input
                  className="w-full border rounded px-3 py-2 mb-3"
                  type="file"
                  accept="image/gif, video/*"
                  onChange={(e) =>
                    SetEjercicioSeleccionado({
                      ...ejercicioSeleccionado,
                      animacion: e.target.files[0], // guardamos el archivo
                    })
                  }
                />


                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModalEditar(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleUpdate(ejercicioSeleccionado)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}

          {showModalEliminarComentarios && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4 text-blue-600 text-center">
                  Comentarios del ejercicio
                </h3>

                {/* Lista de comentarios */}
                {allComentarios.length > 0 ? (
                  <div className="space-y-3">
                    {allComentarios
                      .slice((paginaActual - 1) * comentariosPorPagina, paginaActual * comentariosPorPagina)
                      .map((comentario) => (
                        <div
                          key={comentario.id}
                          className="p-3 border rounded-lg flex justify-between items-start hover:bg-gray-50 transition-all"
                        >
                          <div>
                            <p className="text-gray-800 font-medium">{comentario.usuario_nombre}</p>
                            <p className="text-gray-600 text-sm">{comentario.descripcion}</p>
                            <p className="text-xs text-gray-400">{new Date(comentario.fecha).toLocaleString()}</p>
                          </div>

                          <button
                            onClick={() => {
                              SetComentarioSeleccionado(comentario);
                              setShowModalConfirmacion(true);
                              console.log("Comentario seleccionado para eliminar:", comentario);
                            }}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No hay comentarios disponibles.</p>
                )}

                {/* Paginación */}
                {allComentarios.length > comentariosPorPagina && (
                  <div className="flex justify-center mt-4 space-x-2">
                    <button
                      onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                      disabled={paginaActual === 1}
                      className={`px-3 py-1 rounded ${
                        paginaActual === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      Anterior
                    </button>
                    <span className="text-gray-600 font-medium">
                      Página {paginaActual} de {Math.ceil(allComentarios.length / comentariosPorPagina)}
                    </span>
                    <button
                      onClick={() =>
                        setPaginaActual((prev) =>
                          prev < Math.ceil(allComentarios.length / comentariosPorPagina) ? prev + 1 : prev
                        )
                      }
                      disabled={paginaActual === Math.ceil(allComentarios.length / comentariosPorPagina)}
                      className={`px-3 py-1 rounded ${
                        paginaActual === Math.ceil(allComentarios.length / comentariosPorPagina)
                          ? "bg-gray-300"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      Siguiente
                    </button>
                  </div>
                )}

                {/* Botón cerrar */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowModalEliminarComentarios(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div> 
          )}

{/* Modal de confirmación para eliminar comentario */}
{showModalConfirmacion && comentarioSeleccionado && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg p-6 shadow-lg w-96">
      <h3 className="text-lg font-semibold mb-3 text-red-600 text-center">
        ¿Eliminar comentario?
      </h3>
      <p className="text-gray-600 text-center mb-4">
        Esta acción no se puede deshacer.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setShowModalConfirmacion(false)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          onClick={() => handleDeleteComentario(comentarioSeleccionado.id)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
)}



        </div>
      ) : (
        <p className="text-gray-500 mt-3">No hay ejercicios disponibles.</p>
      )}

    </div>
  )
    }

    

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md w-full text-center">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Selecciona una categoría
      </h2>
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setCategoria("principiante")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            categoria === "principiante"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Principiante
        </button>

        <button
          onClick={() => setCategoria("intermedio")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            categoria === "intermedio"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Intermedio
        </button>

        <button
          onClick={() => setCategoria("avanzado")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            categoria === "avanzado"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Avanzado
        </button>
      </div>

      {/* 🔹 Mostrar ejercicios */}
      {categoria && (
        <div>
          <h3 className="text-lg font-medium mb-2 text-indigo-600">
            Ejercicios de {categoria}
          </h3>
          {ejercicios.length > 0 ? (
            <ul className="text-left">
              {ejercicios.map((e, i) => (
                <li
                  key={i}
                  className="border-b py-2 hover:bg-gray-50 transition-all"
                >
                  {e.nombre}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No hay° ejercicios en esta categoría.
            </p>
          )}
        </div>
      )}

      <div className="text-2xl font-semibold mb-4 text-gray-700">
        <h1>Gestion de ejercicios CRUD</h1>
        <AdministracionEjercicios />

      </div>

    
    </div>
  );
}

