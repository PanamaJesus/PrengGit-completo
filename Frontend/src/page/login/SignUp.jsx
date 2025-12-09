import { image, img } from "framer-motion/client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import eyeOpen from "../../utils/ojo.png";
import eyeClosed from "../../utils/invisible.png";


export default function SignUpForm() {
  const [icons, setIcons] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
const [capsLockOn, setCapsLockOn] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [errorMsg, setErrorMsg] = useState("");
const [errores, setErrores] = useState({
  fechaNacimiento: "",
  semanaEmbarazo: "",
});
const [fieldErrors, setFieldErrors] = useState({
  fecha_nacimiento: null,
  semana_inicial_registro: null,
});




  const ICONS_PER_PAGE = 6;
  const [iconPage, setIconPage] = useState(1);
  const totalIconPages = Math.ceil(icons.length / ICONS_PER_PAGE);

  const [state, setState] = useState({
    nombre: "",
    ap_pat: "",
    ap_mat: "",
    correo: "",
    contrasena: "",
    semana_inicial_registro: "",
    rol: 2,
    codigo_vinculacion: "",
    estado: true,
    imagen_perfil: null,
    fecha_nacimiento: null,
    rbpm_inferior: "60",
    rbpm_superior: "100",
    rox_inferior: "95",
    rox_superior: "100",
    contacto_nombre: "",
    contacto_ap_pat: "",
    contacto_ap_mat: "",
    contacto_correo: "",
    confirmar_contrasena: ""
  });

  // 🔹 Cargar íconos del backend
  useEffect(() => {
    async function cargarIconos() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/imagenes/por-proposito/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ proposito: "perfil" })
        });
        const data = await res.json();

        console.log("📌 Íconos recibidos del backend:", data);
        setIcons(data);

      } catch (error) {
        console.error("❌ Error cargando íconos:", error);
      }
    }
    cargarIconos();
  }, []);

  // 🔹 Tracear los inputs en tiempo real
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    console.log(`✏️ Input cambiado: ${name} =`, type === "checkbox" ? checked : value);

    setState({
      ...state,
      [name]: type === "checkbox" ? checked : value
    });
   // Validaciones en tiempo real para los campos reales del state
  if (name === "fecha_nacimiento") {
    const error = validarFechaNacimiento(value);
    setFieldErrors((prev) => ({ ...prev, fecha_nacimiento: error }));
  }

  if (name === "semana_inicial_registro") {
    const error = validarSemanaEmbarazo(value);
    setFieldErrors((prev) => ({ ...prev, semana_inicial_registro: error }));
  }
  };

  // 🔹 Enviar el formulario
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setLoading(true);
  
    // Validación de contraseña
    if (state.contrasena !== state.confirmar_contrasena) {
      setErrorMsg("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }
  
    // Confirmación
    if (state.contrasena !== state.confirmar_contrasena) {
      setErrorMsg("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    
  
    const payload = {
      ...state,
      fecha_nacimiento: state.fecha_nacimiento || null,
  
      semana_inicial_registro:
        state.semana_inicial_registro === ""
          ? null
          : Number(state.semana_inicial_registro),
  
      rbpm_inferior:
        state.rbpm_inferior === "" ? null : Number(state.rbpm_inferior),
      rbpm_superior:
        state.rbpm_superior === "" ? null : Number(state.rbpm_superior),
  
      rox_inferior:
        state.rox_inferior === "" ? null : Number(state.rox_inferior),
      rox_superior:
        state.rox_superior === "" ? null : Number(state.rox_superior),
  
      rol: 2,
    };
  
    console.log("📤 Enviando payload:", payload);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log("Respuesta del backend:", data);
  
      if (!response.ok) {
        setErrorMsg(data.error || "No se pudo registrar.");
        setLoading(false);
        return;
      }
  
      // Éxito
      setSuccessMsg("✅ Tu cuenta se creó correctamente. Redirigiéndote...");
      setErrorMsg("");
  
      // Reset
      setState({
        nombre: "",
        ap_pat: "",
        ap_mat: "",
        correo: "",
        contrasena: "",
        semana_inicial_registro: "",
        rol: 2,
        codigo_vinculacion: "",
        estado: true,
        imagen_perfil: null,
        fecha_nacimiento: null,
        rbpm_inferior: "60",
        rbpm_superior: "100",
        rox_inferior: "95",
        rox_superior: "100",
        contacto_nombre: "",
        contacto_ap_pat: "",
        contacto_ap_mat: "",
        contacto_correo: "",
      });
  
      setTimeout(() => {
        navigate("/IdxEmb");
      }, 2000);
  
    } catch (error) {
      console.error("❌ Error al conectar:", error);
      setErrorMsg("Error al conectar con el servidor.");
      setLoading(false);
    }
  };
  
 // ---------- VALIDADORES ----------
const validarFechaNacimiento = (fechaStr) => {
  if (!fechaStr) return "La fecha es obligatoria.";

  const fechaNac = new Date(fechaStr + "T00:00:00"); // evita errores por zona horaria
  if (isNaN(fechaNac.getTime())) return "Formato de fecha inválido.";

  const hoy = new Date();
  const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  if (fechaNac > hoySinHora) return "La fecha de nacimiento no puede ser futura.";

  // calcular edad
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const cumple =
    hoy.getMonth() > fechaNac.getMonth() ||
    (hoy.getMonth() === fechaNac.getMonth() && hoy.getDate() >= fechaNac.getDate());
  if (!cumple) edad--;

  if (edad < 12) return "La edad debe ser al menos 12 años.";
  if (edad > 60) return "La edad debe ser menor o igual a 60 años.";

  return null;
};

const validarSemanaEmbarazo = (semStr) => {
  if (semStr === "" || semStr === null || semStr === undefined)
    return "La semana es obligatoria.";

  const trimmed = String(semStr).trim();
  if (!/^\d+$/.test(trimmed)) return "Debe ser un número entero.";

  const numero = parseInt(trimmed, 10);
  if (numero < 1) return "La semana debe ser mayor o igual a 1.";
  if (numero > 42) return "No puede ser mayor a 42.";

  return null;
};

  
  

  const [step, setStep] = React.useState(1);
// ---- reemplaza nextStep ----
const nextStep = () => {
  // Si estamos en el paso 1 validamos fecha_nacimiento
  if (step === 1) {
    const errFecha = validarFechaNacimiento(state.fecha_nacimiento);
    setFieldErrors((prev) => ({ ...prev, fecha_nacimiento: errFecha }));
    if (errFecha) return; // no avanzar
  }

  // Si estamos en el paso 2 validamos semana_inicial_registro
  if (step === 2) {
    const errSemana = validarSemanaEmbarazo(state.semana_inicial_registro);
    setFieldErrors((prev) => ({ ...prev, semana_inicial_registro: errSemana }));
    if (errSemana) return; // no avanzar
  }

  setStep((prev) => Math.min(prev + 1, 5));
};

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // 2. 🧮 NUEVA LÓGICA PARA MOSTRAR LOS ÍCONOS DE LA PÁGINA ACTUAL
  const startIndex = (iconPage - 1) * ICONS_PER_PAGE;
  const endIndex = startIndex + ICONS_PER_PAGE;
  const currentIcons = icons.slice(startIndex, endIndex);

  // 3. 🖱️ NUEVOS MANEJADORES DE PAGINACIÓN DE ÍCONOS
  const goToIconPage = (pageNumber) => {
    setIconPage(Math.min(Math.max(1, pageNumber), totalIconPages));
  };
  const nextIconPage = () => {
    setIconPage((prev) => Math.min(prev + 1, totalIconPages));
  };
  const prevIconPage = () => {
    setIconPage((prev) => Math.max(prev - 1, 1));
  };
  return (
  <div className="form-container form-animation sign-up flex items-center justify-center">
    <form
      onSubmit={handleOnSubmit}
      className="bg-white flex flex-col items-center justify-center h-full text-center"
    >
      <h1 className="text-3xl font-bold mb-3">Crear cuenta</h1>
      <span className="text-xs text-gray-600 mb-4">
        Registrate con tus datos personales
      </span>

      {successMsg && (
        <p className="text-xs text-green-600 mb-3 max-w-xs">
          {successMsg}
        </p>
      )}
      {errorMsg && (
        <p className="text-xs text-red-600 mb-3 max-w-xs">
          {errorMsg}
        </p>
      )}


      {/* PASO 1 */}
      {step === 1 && (
        <>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={state.nombre}
            onChange={handleChange}
            className="bg-gray-200 px-4 py-3 my-2 w-full rounded"
            required
          />

          <input
            type="text"
            name="ap_pat"
            placeholder="Apellido Paterno"
            value={state.ap_pat}
            onChange={handleChange}
            className="bg-gray-200 px-4 py-3 my-2 w-full rounded"
            required
          />

          <input
            type="text"
            name="ap_mat"
            placeholder="Apellido Materno"
            value={state.ap_mat}
            onChange={handleChange}
            className="bg-gray-200 px-4 py-3 my-2 w-full rounded"
            required
          />
          <label className="w-full text-left text-sm font-semibold">Fecha de nacimiento</label>
          <input
  type="date"
  name="fecha_nacimiento"
  value={state.fecha_nacimiento || ""}
  onChange={handleChange}
  onBlur={() => {
    const err = validarFechaNacimiento(state.fecha_nacimiento);
    setFieldErrors(prev => ({ ...prev, fecha_nacimiento: err }));
  }}
  className={`bg-gray-200 px-4 py-3 my-2 w-full rounded 
    ${fieldErrors.fecha_nacimiento ? "border-red-400 border" : ""}`}
  max={new Date().toISOString().split("T")[0]}
/>


          
        </>
      )}


      
      {/* PASO 2 */}
      {step === 2 && (
        <>
<label className="w-full text-left text-sm font-semibold mt-3">Semana de embarazo</label>
<input
  type="number"
  name="semana_inicial_registro"
  value={state.semana_inicial_registro || ""}
  onChange={handleChange}
  onBlur={() => {
    const err = validarSemanaEmbarazo(state.semana_inicial_registro);
    setFieldErrors(prev => ({ ...prev, semana_inicial_registro: err }));
  }}
  className={`bg-gray-200 px-4 py-3 my-2 w-full rounded 
    ${fieldErrors.semana_inicial_registro ? "border-red-400 border" : ""}`}
  min="1"
  max="42"
/>



          <p className="text-sm text-gray-600 mt-4 mb-1 font-semibold w-full text-left">
            Rangos de frecuencia cardiaca (latidos por minuto)
          </p>
          <div className="flex gap-2 w-full">
            <input
              type="number"
              name="rbpm_inferior"
              placeholder="Mínimo (ej. 60)"
              value={state.rbpm_inferior}
              onChange={handleChange}
              className="bg-gray-200 px-4 py-3 my-2 w-1/2 rounded"
              min="40"
              max="140"
              required
            />
            <input
              type="number"
              name="rbpm_superior"
              placeholder="Máximo (ej. 100)"
              value={state.rbpm_superior}
              onChange={handleChange}
              className="bg-gray-200 px-4 py-3 my-2 w-1/2 rounded"
              min="40"
              max="180"
              required
            />
          </div>

          <p className="text-sm text-gray-600 mt-2 mb-1 font-semibold w-full text-left">
            Rangos de oxigenación (SpO₂ %)
          </p>
          <div className="flex gap-2 w-full">
            <input
              type="number"
              step="0.1"
              name="rox_inferior"
              placeholder="Mínimo (ej. 95)"
              value={state.rox_inferior}
              onChange={handleChange}
              className="bg-gray-200 px-4 py-3 my-2 w-1/2 rounded"
              min="80"
              max="100"
              required
            />
            <input
              type="number"
              step="0.1"
              name="rox_superior"
              placeholder="Máximo (ej. 100)"
              value={state.rox_superior}
              onChange={handleChange}
              className="bg-gray-200 px-4 py-3 my-2 w-1/2 rounded"
              min="80"
              max="100"
              required
            />
          </div>

        </>
      )}

      {/* PASO 3 */}
      {step === 3 && (
  <>
    <input
      type="email"
      name="correo"
      placeholder="Correo"
      value={state.correo}
      onChange={handleChange}
      className="bg-gray-200 px-4 py-3 my-2 w-full rounded"
      required
    />

    {/* 🔐 CONTRASEÑA CON OJO */}
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        name="contrasena"
        placeholder="Contraseña"
        value={state.contrasena}
        onChange={handleChange}
        className="bg-gray-200 px-4 py-3 my-2 w-full rounded pr-10"
        required
      />
      {/* 👁️ OJO PARA MOSTRAR / OCULTAR */}
      <span
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
  <img src={eyeOpen} className="w-5 h-5" />
) : (
  <img src={eyeClosed} className="w-5 h-5" />
)}

      </span>
    </div>

    {/* 🔁 CONFIRMAR CONTRASEÑA CON OJO */}
    <div className="relative w-full">
      <input
        type={showConfirmPassword ? "text" : "password"}
        name="confirmar_contrasena"
        placeholder="Confirmar contraseña"
        value={state.confirmar_contrasena}
        onChange={handleChange}
        className="bg-gray-200 px-4 py-3 my-2 w-full rounded pr-10"
        required
      />
      <span
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
        onClick={() => setShowConfirmPassword((prev) => !prev)}
      >
               {showConfirmPassword ? (
  <img src={eyeOpen} className="w-5 h-5" />
) : (
  <img src={eyeClosed} className="w-5 h-5" />
)}
      </span>
    </div>

    {/* ❗ MENSAJE SI NO COINCIDEN */}
    {state.confirmar_contrasena &&
      state.contrasena !== state.confirmar_contrasena && (
        <p className="text-red-500 text-xs w-full text-left">
          Las contraseñas no coinciden.
        </p>
      )}
  </>
)}

      {/* PASO 4 */}
      {step === 4 && (
          <>
            <h2 className="text-lg font-semibold mb-3">Selecciona tu ícono</h2>

            {/* Grid que solo muestra los íconos de la página actual */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {currentIcons.map((icon) => (
                <label
                  key={icon.id}
                  className={`cursor-pointer p-2 rounded-xl border transition transform
                    ${
                      state.imagen_perfil === icon.id
                        ? "border-[#ff4b2b] scale-105 shadow-md"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                >
                  <input
                    type="radio"
                    name="imagen_perfil"
                    value={icon.id}
                    checked={state.imagen_perfil === icon.id}
                    onChange={(e) => {
                      console.log("🖼 Ícono seleccionado:", e.target.value);
                      setState({
                        ...state,
                        imagen_perfil: Number(e.target.value),
                      });
                    }}
                    className="hidden"
                  />
                  <img
                    src={icon.url}
                    alt="icono perfil"
                    className="w-16 h-16 object-contain mx-auto"
                  />
                </label>
              ))}
            </div>
            
            {/* 4. 🧭 Controles de Paginación de Íconos */}
            {totalIconPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-4">
                {/* Botón Anterior */}
                <button
                  type="button"
                  onClick={prevIconPage}
                  disabled={iconPage === 1}
                  className={`p-2 rounded-full transition ${
                    iconPage === 1 ? "text-gray-400 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200 text-[#ff4b2b]"
                  }`}
                >
                  {'<'}
                </button>

                {/* Indicadores de Página */}
                {[...Array(totalIconPages).keys()].map((index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      type="button"
                      key={pageNumber}
                      onClick={() => goToIconPage(pageNumber)}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition ${
                        pageNumber === iconPage
                          ? "bg-[#ff4b2b] text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {/* Botón Siguiente */}
                <button
                  type="button"
                  onClick={nextIconPage}
                  disabled={iconPage === totalIconPages}
                  className={`p-2 rounded-full transition ${
                    iconPage === totalIconPages ? "text-gray-400 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200 text-[#ff4b2b]"
                  }`}
                >
                  {'>'}
                </button>
              </div>
            )}
            
          </>
        )}

      {/* PASO 5 */}
      {step === 5 && (
        <>
          <h2 className="text-lg font-semibold mb-3 w-full text-left">
            Contacto de emergencia
          </h2>
          <input
            type="text"
            name="contacto_nombre"
            placeholder="Nombre(s) del contacto"
            value={state.contacto_nombre}
            onChange={handleChange}
            className="bg-gray-200 px-4 py-3 my-2 w-full rounded"
            required
          />
          <input
            type="text"
            name="contacto_ap_pat"
            placeholder="Apellido paterno del contacto"
            value={state.contacto_ap_pat}
            onChange={handleChange}
            className="bg-gray-200 px-4 py-3 my-2 w-full rounded"
            required
          />
          <input
            type="text"
            name="contacto_ap_mat"
            placeholder="Apellido materno del contacto"
            value={state.contacto_ap_mat}
            onChange={handleChange}
            className="bg-gray-200 px-4 py-3 my-2 w-full rounded"
            required
          />
          <input
            type="email"
            name="contacto_correo"
            placeholder="Correo del contacto de emergencia"
            value={state.contacto_correo}
            onChange={handleChange}
            className="bg-gray-200 px-4 py-3 my-2 w-full rounded"
            required
          />
        </>
      )}

      {/* FLECHAS */}
      <div className="flex justify-between w-full mt-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="text-[#ff4b2b] font-bold text-xl"
          >
            ←
          </button>
        ) : (
          <div></div>
        )}

        {step < 5 ? (
          <button
            type="button"
            onClick={nextStep}
            className="text-[#ff4b2b] font-bold text-xl"
          >
            →
          </button>
        ) : (
          <div></div>
        )}
      </div>

      {step === 5 && (
        <button
          disabled={loading}
          className="mt-4 rounded-full px-10 py-3 text-white text-xs font-bold bg-[#ff4b2b] uppercase hover:scale-95 transition"
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>
      )}
    </form>
  </div>
  );
}

