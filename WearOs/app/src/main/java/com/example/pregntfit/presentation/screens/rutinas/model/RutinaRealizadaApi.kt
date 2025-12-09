package com.example.pregntfit.presentation.screens.rutinas.model

import com.example.pregntfit.presentation.navigation.ApiConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.BufferedOutputStream
import java.net.HttpURLConnection
import java.net.URL

data class HistorialRutinaRequest(
    val fecha: String,
    val finalizada: Boolean,
    val avg_oxigeno: Double,
    val avg_bpm: Double,
    val temperatura: Double,
    val tiempo: Int,
    val estado: String,
    val rutina: Int,
    val usuario: Int?
)

suspend fun postRutinaRealizada(data: HistorialRutinaRequest): Boolean {
    return withContext(Dispatchers.IO) {

        try {
            val url = URL(ApiConfig.BASE_URL + "historial_rutina/")
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "POST"
            conn.setRequestProperty("Content-Type", "application/json")
            conn.doOutput = true
            val jsonBody = JSONObject()
            jsonBody.put("fecha", data.fecha)
            jsonBody.put("finalizada", data.finalizada)
            jsonBody.put("avg_oxigeno", data.avg_oxigeno)
            jsonBody.put("avg_bpm", data.avg_bpm)
            jsonBody.put("temperatura", data.temperatura)
            jsonBody.put("tiempo", data.tiempo)
            jsonBody.put("estado", data.estado)
            jsonBody.put("rutina", data.rutina)
            jsonBody.put("usuario", data.usuario)
            val outputStream = BufferedOutputStream(conn.outputStream)
            outputStream.write(jsonBody.toString().toByteArray())
            outputStream.flush()
            val responseCode = conn.responseCode
            responseCode == 201
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
}
