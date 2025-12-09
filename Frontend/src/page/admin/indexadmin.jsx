import '../../App'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

function IdxAdmin() {
  return (
     <main className="relative min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <Navbar />

      {/* Contenido principal */}
      <section className="flex-grow flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="max-w-3xl bg-white shadow-xl rounded-2xl p-10 border border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            Bienvenido, Administrador 👋
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Selecciona una opción para continuar con la administración del sistema.
          </p>

          {/* Tarjetas con navegación */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              onClick={() => navigate("/usuarios")}
              className="p-6 bg-blue-100 rounded-xl shadow hover:shadow-lg hover:scale-105 cursor-pointer transition"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Usuarios</h3>
              <p className="text-blue-700 text-sm">
                Gestiona los registros de todos los usuarios.
              </p>
            </div>

            <div
              onClick={() => navigate("/reportes")}
              className="p-6 bg-green-100 rounded-xl shadow hover:shadow-lg hover:scale-105 cursor-pointer transition"
            >
              <h3 className="text-xl font-semibold text-green-800 mb-2">Reportes</h3>
              <p className="text-green-700 text-sm">
                Gestión de ejercicios.
              </p>
            </div>

            <div
              onClick={() => navigate("/configuracion")}
              className="p-6 bg-yellow-100 rounded-xl shadow hover:shadow-lg hover:scale-105 cursor-pointer transition"
            >
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">Configuración</h3>
              <p className="text-yellow-700 text-sm">
                Administra la configuración general del sistema.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default IdxAdmin