package com.example.pregntfit.presentation.screens.rutinas.model

data class Usuario(
    val id: Int,
    val nombre: String,
    val ap_pat: String,
    val ap_mat: String,
    val correo: String,
    val semana_embarazo: Int?,
    val codigo_vinculacion: String?,
    val estado: Boolean,
    val contrasena: String,
    val rol: Int
)
