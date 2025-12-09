package com.example.pregntfit.presentation.screens.rutinas.model

import com.example.pregntfit.presentation.navigation.ApiConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import java.net.HttpURLConnection
import java.net.URL

data class RutinaUsuario(
    val idRutinaGuardada: Int,
    val fecha: String,
    val rutinaId: Int,
    val usuario: Int,
    val nombreRutina: String,
    val descripcion: String,
    val sugSemanas: Int
)

suspend fun fetchRutinasUsuario(usuarioId: Int): List<RutinaUsuario> = withContext(Dispatchers.IO) {
    val url = URL("${ApiConfig.BASE_URL}rutinas_guardadas/$usuarioId/")

    val connection = url.openConnection() as HttpURLConnection
    try {
        connection.requestMethod = "GET"
        connection.connectTimeout = 8000
        connection.readTimeout = 8000

        val stream = connection.inputStream.bufferedReader().use { it.readText() }
        val jsonArray = JSONArray(stream)
        val lista = mutableListOf<RutinaUsuario>()

        for (i in 0 until jsonArray.length()) {
            val obj = jsonArray.getJSONObject(i)
            lista.add(
                RutinaUsuario(
                    idRutinaGuardada = obj.optInt("idRutinaGuardada"),
                    fecha = obj.optString("fecha"),
                    rutinaId = obj.optInt("RutinaId"),
                    usuario = obj.optInt("Usuario"),
                    nombreRutina = obj.optString("NombreRutina"),
                    descripcion = obj.optString("Descripcion"),
                    sugSemanas = obj.optInt("SugSemanas")
                )
            )
        }
        lista
    } finally {
        connection.disconnect()
    }
}