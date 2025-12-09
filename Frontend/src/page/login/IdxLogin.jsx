import React, { useState } from "react";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";
import "./login.css"; // <-- nuevo CSS pequeño

export default function IdxLogin() {
  const [type, setType] = useState("signIn");

  const handleOnClick = (text) => {
    if (text !== type) setType(text);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f5f7] p-6">
      <div
        className={`container-login bg-white rounded-xl shadow-2xl transition-all duration-700 ${
          type === "signUp" ? "right-panel-active" : ""
        }`}
      >
        {/* Sign Up */}
        <div className="form-animation sign-up">
          <SignUpForm />
        </div>

        {/* Sign In */}
        <div className="form-animation sign-in">
          <SignInForm />
        </div>

        {/* OVERLAY */}
        <div className="overlay-container-login">
          <div className="overlay-login flex">
            
            {/* Left Panel */}
            <div className="overlay-panel-login overlay-left">
              <h1 className="text-4xl font-bold">Bienvenido de nuevo!</h1>
              <p className="text-sm mt-3">
                Para mantenerte conectado con nosotros, inicia sesión con tu información personal
              </p>

              <button
                className="mt-5 px-6 py-2 border border-white rounded-full 
                hover:bg-white hover:text-pink-600 transition font-bold"
                onClick={() => handleOnClick("signIn")}
              >
                Inicia Sesión
              </button>
            </div>

            {/* Right Panel */}
            <div className="overlay-panel-login overlay-right">
              <h1 className="text-4xl font-bold">Hola, Amiga!</h1>
              <p className="text-sm mt-3">
                Ingresa tu detalles personales para empezar este camino.
              </p>

              <button
                className="mt-5 px-6 py-2 border border-white rounded-full 
                hover:bg-white hover:text-pink-600 transition font-bold"
                onClick={() => handleOnClick("signUp")}
              >
                Registrarse
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
