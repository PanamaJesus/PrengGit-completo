package com.example.pregntfit.presentation.screens.rutinas

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.pregntfit.presentation.navigation.UserSession
import com.example.pregntfit.presentation.screens.rutinas.model.HistorialRutinaRequest
import com.example.pregntfit.presentation.screens.rutinas.model.postRutinaRealizada
import kotlinx.coroutines.launch
import java.time.ZonedDateTime
import com.example.pregntfit.presentation.screens.rutinas.model.fetchUltimaLecturaUsuario
import com.example.pregntfit.presentation.screens.rutinas.model.UltimaLecturaUsuario

private val CompactPadding = 4.dp
private val CardCornerRadius = 8.dp
private val ButtonHeight = 32.dp
private val SectionSpacing = 10.dp




@Composable
fun RutinaFinalScreen(navController: NavController, rutinaId: Int, tiempoTotal: Int) {
    val userId = UserSession.usuarioId
    val scope = rememberCoroutineScope()

    var loadingLectura by remember { mutableStateOf(true) }
    var ultimaLectura by remember { mutableStateOf<UltimaLecturaUsuario?>(null) }
    var errorLectura by remember { mutableStateOf<String?>(null) }

    var postLoading by remember { mutableStateOf(false) }
    var postError by remember { mutableStateOf<String?>(null) }

    fun formatTime(seconds: Int): String {
        val minutes = seconds / 60
        val remaining = seconds % 60
        return String.format("%02d:%02d", minutes, remaining)
    }

    LaunchedEffect(userId) {
        try {
            ultimaLectura = fetchUltimaLecturaUsuario(userId)
        } catch (e: Exception) {
            errorLectura = "Error al cargar signos vitales: ${e.message}"
        } finally {
            loadingLectura = false
        }
    }

    val handleSave: () -> Unit = {
        postLoading = true
        postError = null

        scope.launch {
            val avgBpm = ultimaLectura?.lecturabpm?.toDouble() ?: 80.0
            val avgOxigeno = ultimaLectura?.lecturaox?.toDoubleOrNull() ?: 97.5
            val avgTemperatura = ultimaLectura?.Temperatura?.toDoubleOrNull() ?: 36.5

            val body = HistorialRutinaRequest(
                fecha = ZonedDateTime.now().toString(),
                finalizada = true,
                avg_oxigeno = avgOxigeno,
                avg_bpm = avgBpm,
                temperatura = avgTemperatura,
                tiempo = tiempoTotal,
                estado = "Completada",
                rutina = rutinaId,
                usuario = userId
            )

            try {
                val ok = postRutinaRealizada(body)
                if (!ok) {
                    postError = "Error al guardar el historial."
                }
            } catch (e: Exception) {
                postError = "Error de red al guardar: ${e.message}"
            } finally {
                postLoading = false
            }
        }
    }

    Scaffold(
        containerColor = ColorBackground,
        modifier = Modifier.fillMaxSize()
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = SectionSpacing),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {

            Text(
                "¡RUTINA COMPLETADA!",
                color = ColorSecondaryStatus,
                fontSize = 16.sp,
                fontWeight = FontWeight.ExtraBold,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(SectionSpacing))
            Divider(color = ColorSecondaryStatus.copy(alpha = 0.5f), thickness = 1.dp, modifier = Modifier.fillMaxWidth(0.8f))
            Spacer(modifier = Modifier.height(SectionSpacing))


            Card(
                shape = RoundedCornerShape(CardCornerRadius),
                colors = CardDefaults.cardColors(containerColor = ColorCard),
                elevation = CardDefaults.cardElevation(2.dp),
                modifier = Modifier.fillMaxWidth(0.85f)
            ) {
                Column(
                    modifier = Modifier.padding(SectionSpacing / 2),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        "Tiempo Total",
                        color = ColorTextSecondary,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    Spacer(modifier = Modifier.height(CompactPadding))
                    Text(
                        formatTime(tiempoTotal),
                        color = ColorPrimaryAction,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }

            Spacer(modifier = Modifier.height(SectionSpacing))


            Card(
                shape = RoundedCornerShape(CardCornerRadius),
                colors = CardDefaults.cardColors(containerColor = ColorCard),
                elevation = CardDefaults.cardElevation(2.dp),
                modifier = Modifier.fillMaxWidth(0.85f)
            ) {
                Column(
                    modifier = Modifier.padding(SectionSpacing / 2),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        "Lectura Final",
                        color = ColorTextSecondary,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    Spacer(modifier = Modifier.height(CompactPadding))

                    when {
                        loadingLectura -> CircularProgressIndicator(color = ColorPrimaryAction, modifier = Modifier.size(18.dp))
                        errorLectura != null -> {
                            Text("$errorLectura", color = ColorDangerSoft, fontSize = 8.sp, textAlign = TextAlign.Center)
                        }
                        ultimaLectura != null -> {
                            val lectura = ultimaLectura!!
                            Row(
                                modifier = Modifier.fillMaxWidth().padding(horizontal = CompactPadding),
                                horizontalArrangement = Arrangement.SpaceAround
                            ) {
                                LecturaItem(label = "BPM", value = "${lectura.lecturabpm}", color = ColorSecondaryStatus)
                                LecturaItem(label = "Oxígeno", value = "${lectura.lecturaox}%", color = ColorPrimaryAction)
                                LecturaItem(label = "Temp.", value = "${lectura.Temperatura}°C", color = ColorDangerSoft)
                            }
                        }
                        else -> {
                            Text("No se obtuvieron signos vitales.", color = ColorTextSecondary, fontSize = 8.sp)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(SectionSpacing * 1.5f))

            // --- BOTONES DE ACCIÓN ---
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Button(
                    onClick = {
                        handleSave() // Inicia el guardado
                        navController.navigate("MenuScreen/${UserSession.usuarioId}") {
                            popUpTo("RutinaStepScreen/$rutinaId/$userId") { inclusive = true }
                        }
                    },
                    enabled = !postLoading,
                    colors = ButtonDefaults.buttonColors(containerColor = ColorPrimaryAction),
                    shape = RoundedCornerShape(CardCornerRadius),
                    modifier = Modifier
                        .fillMaxWidth(0.6f)
                        .height(ButtonHeight)
                ) {
                    Text(
                        when {
                            postLoading -> "Guardando..."
                            else -> "Finalizar"
                        },
                        color = ColorDarkText,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black
                    )
                }

                // Mostrar error de guardado si ocurre
                if (postError != null) {
                    Spacer(modifier = Modifier.height(CompactPadding))
                    Text("🚨 $postError", color = ColorDangerSoft, fontSize = 8.sp, textAlign = TextAlign.Center) // Más pequeño
                }

                Spacer(modifier = Modifier.height(CompactPadding))



            }
        }
    }
}

@Composable
fun LecturaItem(label: String, value: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            value,
            color = color,
            fontSize = 11.sp,
            fontWeight = FontWeight.ExtraBold
        )
        Text(
            label,
            color = ColorTextSecondary.copy(alpha = 0.7f),
            fontSize = 7.sp
        )
    }
}