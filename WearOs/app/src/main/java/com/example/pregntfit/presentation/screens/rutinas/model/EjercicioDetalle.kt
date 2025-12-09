package com.example.pregntfit.presentation.screens.rutinas.model

import com.example.pregntfit.presentation.navigation.ApiConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import java.net.HttpURLConnection
import java.net.URL

data class EjercicioDetalle(
    val ejercicio: String,
    val descripcion: String,
    val nivelEsfuerzo: Int,
    val series: Int,
    val repeticiones: Int,
    val tiempoAprox: Int,
    val animacionId: Int,
    val url: String

)


suspend fun fetchRutinaDetalle(rutinaId: Int): List<EjercicioDetalle> =
    withContext(Dispatchers.IO) {

        val url = URL("${ApiConfig.BASE_URL}rutina_detalle/$rutinaId/")
        val connection = url.openConnection() as HttpURLConnection

        try {
            connection.requestMethod = "GET"

            val response = connection.inputStream.bufferedReader().use { it.readText() }

            val jsonArray = JSONArray(response)
            val lista = mutableListOf<EjercicioDetalle>()

            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)

                lista.add(
                    EjercicioDetalle(
                        ejercicio = obj.getString("Ejercicio"),
                        descripcion = obj.getString("Descripcion"),
                        nivelEsfuerzo = obj.getInt("NivelEsfuerzo"),
                        series = obj.getInt("Series"),
                        repeticiones = obj.getInt("Repeticiones"),
                        tiempoAprox = obj.getInt("TiempoAprox"),
                        animacionId = obj.getInt("AnimacionId"),
                        url = obj.getString("Url")
                    )
                )
            }

            lista
        } finally {
            connection.disconnect()
        }
    }