package com.example.pregntfit.presentation.screens.rutinas.model

import com.example.pregntfit.presentation.navigation.ApiConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

// --- MODELO ---
data class SimuladorResponse(
    val id: Int,
    val fecha: String,
    val lectura_bpm: Int,
    val lectura_ox: String,
    val temperatura: String,
    val tipo: String?,
    val usuario: Int

)

suspend fun postSimulador(
    usuarioId: Int?,
    nivelEsfuerzo: Int
): SimuladorResponse = withContext(Dispatchers.IO) {
    val url = URL("${ApiConfig.BASE_URL}simulador/$usuarioId/$nivelEsfuerzo/")
    val connection = url.openConnection() as HttpURLConnection

        try {
            connection.requestMethod = "POST"
            connection.setRequestProperty("Content-Type", "application/json")
            connection.doOutput = true
            connection.connectTimeout = 8000
            connection.readTimeout = 8000

            val jsonBody = JSONObject()
            val writer = OutputStreamWriter(connection.outputStream)
            writer.write(jsonBody.toString())
            writer.flush()
            writer.close()

            val response = connection.inputStream.bufferedReader().use { it.readText() }
            val obj = JSONObject(response)

            SimuladorResponse(
                id = obj.getInt("id"),
                fecha = obj.getString("fecha"),
                lectura_bpm = obj.getInt("lectura_bpm"),
                lectura_ox = obj.getString("lectura_ox"),
                temperatura = obj.getString("temperatura"),
                tipo = if (obj.isNull("tipo")) null else obj.getString("tipo"),
                usuario = obj.getInt("usuario")
            )
        } finally {
            connection.disconnect()
        }
    }
