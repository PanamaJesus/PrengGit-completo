package com.example.pregntfit.presentation.screens.rutinas.model

import com.example.pregntfit.presentation.navigation.ApiConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

// --- MODELO ---
data class UltimaLecturaUsuario(
    val NombreUsuario: String,
    val SemanasEmb: Int?,
    val FechaNacimiento: String,
    val lecturabpm: Int,
    val lecturaox: String,
    val Temperatura: String
)


suspend fun fetchUltimaLecturaUsuario(usuarioId: Int?): UltimaLecturaUsuario =
    withContext(Dispatchers.IO) {
        val urlString = "${ApiConfig.BASE_URL}ultima_lectura_usuario/$usuarioId/"
        println("DEBUG_ULTIMA_LECTURA_URL: $urlString")
        val url = URL(urlString)
        val connection = url.openConnection() as HttpURLConnection
        try {
            connection.requestMethod = "GET"
            connection.connectTimeout = 8000
            connection.readTimeout = 8000
            val responseCode = connection.responseCode
            if (responseCode != HttpURLConnection.HTTP_OK) {
                val errorStream = connection.errorStream.bufferedReader().use { it.readText() }
                throw Exception("Error HTTP $responseCode: $errorStream")
            }

            val response = connection.inputStream.bufferedReader().use { it.readText() }
            val obj = JSONObject(response)

            UltimaLecturaUsuario(
                NombreUsuario = obj.getString("NombreUsuario"),
                // Usamos getIntOrNull para manejar el valor 'null' de SemanasEmb
                SemanasEmb = if (obj.isNull("SemanasEmb")) null else obj.getInt("SemanasEmb"),
                FechaNacimiento = obj.getString("FechaNacimiento"),
                lecturabpm = obj.getInt("lecturabpm"),
                lecturaox = obj.getString("lecturaox"),
                Temperatura = obj.getString("Temperatura")
            )
        } finally {
            connection.disconnect()
        }
    }
