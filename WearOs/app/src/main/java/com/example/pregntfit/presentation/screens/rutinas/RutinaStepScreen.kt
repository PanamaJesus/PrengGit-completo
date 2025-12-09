package com.example.pregntfit.presentation.screens.rutinas

import com.example.pregntfit.presentation.navigation.ApiConfig
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.example.pregntfit.presentation.screens.rutinas.model.EjercicioDetalle
import com.example.pregntfit.presentation.screens.rutinas.model.fetchRutinaDetalle
import com.example.pregntfit.presentation.screens.rutinas.model.SimuladorResponse
import com.example.pregntfit.presentation.screens.rutinas.model.postSimulador
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

val ColorBackground = Color(0xFF0B0B0B)
val ColorCard = Color(0xFF1A1A1A)
val ColorTextLight = Color(0xFFFFFFFF)
val ColorTextSecondary = Color(0xFFBBBBBB)
val ColorPrimaryAction = Color(0xFF81D4FA)
val ColorSecondaryStatus = Color(0xFFA5D6A7)
val ColorDangerSoft = Color(0xFFFFCCBC)
val ColorDarkText = Color(0xFF141414)

private val CompactPadding = 6.dp
private val CardCornerRadius = 8.dp
private val IconSize = 14.dp
private val ButtonHeight = 32.dp

@Composable
fun RutinaStepScreen(navController: NavController, rutinaId: Int, usuarioId: Int) {

    var ejercicios by remember { mutableStateOf<List<EjercicioDetalle>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }
    var currentIndex by remember { mutableStateOf(0) }
    val scope = rememberCoroutineScope()
    var isExerciseStarted by remember { mutableStateOf(false) }
    var isTimerRunning by remember { mutableStateOf(false) }
    var timeElapsed by remember { mutableStateOf(0) }
    var totalTimeSeconds by remember { mutableStateOf(0) }
    var ultimaLectura by remember { mutableStateOf<SimuladorResponse?>(null) }

    LaunchedEffect(isTimerRunning) {
        while (isTimerRunning) {
            delay(1000)
            totalTimeSeconds++
            timeElapsed++
        }
    }

    fun formatTime(seconds: Int): String {
        val minutes = seconds / 60
        val remaining = seconds % 60
        return String.format("%02d:%02d", minutes, remaining)
    }

    // RutinaStepScreen.kt - CÓDIGO CORRECTO
    fun handleNextStep(ejercicio: EjercicioDetalle) {
        scope.launch {
            // ✅ Envía el usuario ID y el Nivel de Esfuerzo (que es el segundo parámetro esperado)
            ultimaLectura = postSimulador(
                usuarioId = usuarioId,
                nivelEsfuerzo = ejercicio.nivelEsfuerzo // ⬅️ DEBE SER nivelEsfuerzo
            )
        }
    }

    // Confirmar lectura y avanzar
    fun confirmarLectura() {
        ultimaLectura = null
        isTimerRunning = false
        isExerciseStarted = false
        timeElapsed = 0 // Resetear el cronómetro del ejercicio

        if (currentIndex < ejercicios.size - 1) {
            currentIndex++
        } else {
            navController.navigate("RutinaFinalScreen/$rutinaId/$totalTimeSeconds")
        }
    }

    val toggleTimer = { isTimerRunning = !isTimerRunning }

    // Cargar rutina
    LaunchedEffect(rutinaId) {
        scope.launch {
            try {
                ejercicios = fetchRutinaDetalle(rutinaId)
            } catch (e: Exception) {
                error = "Error al obtener ejercicios: ${e.message}"
            } finally {
                loading = false
            }
        }
    }

    // UI principal
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(ColorBackground)
            .padding(horizontal = 0.dp, vertical = 0.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        // HEADER
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = CompactPadding, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Start
        ) {
            Button(
                onClick = { navController.popBackStack() },
                colors = ButtonDefaults.buttonColors(containerColor = ColorDangerSoft),
                shape = RoundedCornerShape(CardCornerRadius),
                contentPadding = PaddingValues(0.dp),
                modifier = Modifier
                    .height(22.dp)
                    .width(32.dp)
            ) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Volver", tint = ColorBackground, modifier = Modifier.size(IconSize))
            }

            Spacer(modifier = Modifier.width(CompactPadding))

            // Contador de Ejercicios
            Text(
                text = "Ejercicios (${currentIndex + 1}/${ejercicios.size})",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = ColorTextSecondary
            )
        }

        // CONTENIDO PRINCIPAL
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .padding(top = CompactPadding, bottom = CompactPadding),
            contentAlignment = Alignment.TopCenter
        ) {
            when {
                loading -> CircularProgressIndicator(color = ColorPrimaryAction, modifier = Modifier.align(Alignment.Center))
                error != null -> Text(text = error ?: "Error desconocido", color = ColorDangerSoft, fontSize = 12.sp, modifier = Modifier.align(Alignment.Center))
                ejercicios.isEmpty() -> Text("No hay ejercicios", color = ColorTextLight, modifier = Modifier.align(Alignment.Center))

                // Mostrar la pantalla de Lectura
                ultimaLectura != null -> {
                    LecturaScreen(
                        ultimaLectura = ultimaLectura!!,
                        onConfirm = ::confirmarLectura
                    )
                }

                else -> {
                    val ejercicio = ejercicios[currentIndex]

                    if (!isExerciseStarted) {
                        PreparationView(ejercicio) {
                            isExerciseStarted = true
                            isTimerRunning = true
                        }
                    } else {
                        ActiveView(
                            ejercicio = ejercicio,
                            timeElapsed = timeElapsed,
                            isTimerRunning = isTimerRunning,
                            formatTime = ::formatTime,
                            currentIndex = currentIndex,
                            ejerciciosSize = ejercicios.size,
                            onToggleTimer = toggleTimer,
                            onNextStep = { handleNextStep(ejercicio) }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun LecturaScreen(
    ultimaLectura: SimuladorResponse,
    onConfirm: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = CompactPadding * 2),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Top
    ) {
        Card(
            shape = RoundedCornerShape(CardCornerRadius),
            colors = CardDefaults.cardColors(containerColor = ColorCard),
            elevation = CardDefaults.cardElevation(2.dp),
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .padding(top = CompactPadding, bottom = CompactPadding)
        ) {
            Column(
                modifier = Modifier.padding(horizontal = CompactPadding * 2, vertical = CompactPadding * 1.5f).fillMaxWidth(),
                horizontalAlignment = Alignment.Start,
                verticalArrangement = Arrangement.Top
            ) {
                Text(
                    text = "LECTURA DE DATOS VITALES",
                    color = ColorDangerSoft,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Black,
                    maxLines = 1
                )
                Spacer(modifier = Modifier.height(3.dp))
                Divider(color = ColorTextSecondary.copy(alpha = 0.3f), thickness = 1.dp)
                Spacer(modifier = Modifier.height(CompactPadding * 1.5f))

                // Datos de la Lectura
                Column(verticalArrangement = Arrangement.spacedBy(CompactPadding / 2)) {
                    Text(
                        text = "BPM: ${ultimaLectura.lectura_bpm}",
                        color = ColorTextLight,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = "Oxígeno: ${ultimaLectura.lectura_ox}%",
                        color = ColorTextLight,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = "Temperatura: ${ultimaLectura.temperatura}°C",
                        color = ColorTextLight,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }

        Button(
            onClick = onConfirm,
            colors = ButtonDefaults.buttonColors(containerColor = ColorPrimaryAction),
            shape = RoundedCornerShape(CardCornerRadius),
            contentPadding = PaddingValues(horizontal = CompactPadding),
            modifier = Modifier
                .fillMaxWidth(0.90f)
                .height(ButtonHeight)
        ) {
            Text(
                "CONTINUAR",
                fontSize = 10.sp,
                fontWeight = FontWeight.Black,
                textAlign = TextAlign.Center,
                color = ColorDarkText
            )
        }
        Spacer(modifier = Modifier.height(CompactPadding))
    }
}


@Composable
fun PreparationView(ejercicio: EjercicioDetalle, onStart: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize().padding(horizontal = CompactPadding * 2),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        LazyColumn(
            modifier = Modifier.weight(1f).fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
            contentPadding = PaddingValues(vertical = CompactPadding)
        ) {

            item {
                Text(
                    text = ejercicio.ejercicio,
                    color = ColorTextLight,
                    fontSize = 16.sp, // 🚨 Más grande 🚨
                    fontWeight = FontWeight.ExtraBold,
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(CompactPadding / 2))
                Text(
                    text = "Series: ${ejercicio.series} | Reps: ${ejercicio.repeticiones}",
                    color = ColorDangerSoft,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(CompactPadding * 1.5f))
            }
            item {
                Card(
                    shape = RoundedCornerShape(CardCornerRadius),
                    colors = CardDefaults.cardColors(containerColor = ColorCard),
                    modifier = Modifier.size(120.dp),
                    elevation = CardDefaults.cardElevation(2.dp)
                ) {
                    AsyncImage(
                        model = ApiConfig.MEDIA_URL + ejercicio.url,
                        contentDescription = ejercicio.ejercicio,
                        modifier = Modifier.fillMaxSize().padding(CompactPadding / 2),
                        contentScale = ContentScale.Crop
                    )
                }
            }

            item {
                Spacer(modifier = Modifier.height(CompactPadding * 2))
                Text(
                    text = ejercicio.descripcion,
                    color = ColorTextSecondary,
                    fontSize = 9.sp,
                    modifier = Modifier.fillMaxWidth().padding(horizontal = CompactPadding * 2),
                    lineHeight = 12.sp,
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(10.dp))
            }
        }

        // Botón Empezar
        Button(
            onClick = onStart,
            colors = ButtonDefaults.buttonColors(containerColor = ColorSecondaryStatus),
            shape = RoundedCornerShape(CardCornerRadius),
            contentPadding = PaddingValues(0.dp),
            modifier = Modifier
                .fillMaxWidth(0.6f)
                .height(ButtonHeight)
        ) {
            Text(
                "EMPEZAR",
                fontSize = 11.sp,
                fontWeight = FontWeight.Black,
                textAlign = TextAlign.Center,
                color = ColorDarkText
            )
        }
        Spacer(modifier = Modifier.height(CompactPadding))
    }
}


@Composable
fun ActiveView(
    ejercicio: EjercicioDetalle,
    timeElapsed: Int,
    isTimerRunning: Boolean,
    formatTime: (Int) -> String,
    currentIndex: Int,
    ejerciciosSize: Int,
    onToggleTimer: () -> Unit,
    onNextStep: () -> Unit
) {
    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
            contentPadding = PaddingValues(bottom = ButtonHeight + CompactPadding * 2)
        ) {
            item {
                // RELOJ
                Text(
                    text = formatTime(timeElapsed),
                    color = if (isTimerRunning) ColorSecondaryStatus else ColorDangerSoft,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Black,
                    modifier = Modifier.padding(top = CompactPadding * 2)
                )
                Spacer(modifier = Modifier.height(CompactPadding * 1.5f))

                // IMAGEN
                Card(
                    shape = RoundedCornerShape(CardCornerRadius),
                    colors = CardDefaults.cardColors(containerColor = ColorCard),
                    modifier = Modifier.size(80.dp),
                    elevation = CardDefaults.cardElevation(2.dp)
                ) {
                    AsyncImage(
                        model = ApiConfig.MEDIA_URL + ejercicio.url,
                        contentDescription = ejercicio.ejercicio,
                        modifier = Modifier.fillMaxSize().padding(CompactPadding / 2),
                        contentScale = ContentScale.Crop
                    )
                }
                Spacer(modifier = Modifier.height(CompactPadding))
                Text(
                    text = ejercicio.ejercicio,
                    color = ColorTextLight,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.ExtraBold,
                    maxLines = 1,
                    textAlign = TextAlign.Center
                )
                Text(
                    text = "Series: ${ejercicio.series} | Reps: ${ejercicio.repeticiones}",
                    color = ColorDangerSoft,
                    fontSize = 9.sp,
                    modifier = Modifier.padding(top = 1.dp)
                )
                Spacer(modifier = Modifier.height(CompactPadding))
                Text(
                    text = ejercicio.descripcion,
                    color = ColorTextSecondary.copy(alpha = 0.8f),
                    fontSize = 8.sp,
                    modifier = Modifier.fillMaxWidth().padding(horizontal = CompactPadding * 2),
                    lineHeight = 11.sp,
                    textAlign = TextAlign.Center
                )
            }
        }

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.BottomCenter)
                .height(ButtonHeight + CompactPadding)
                .background(ColorCard)
                .padding(horizontal = CompactPadding, vertical = 4.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Botón Pausa/Iniciar
            Button(
                onClick = onToggleTimer,
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isTimerRunning) ColorDangerSoft else ColorSecondaryStatus
                ),
                shape = RoundedCornerShape(CardCornerRadius),
                contentPadding = PaddingValues(0.dp),
                modifier = Modifier.weight(1f).height(ButtonHeight).padding(end = CompactPadding / 2)
            ) {
                Text(
                    if (isTimerRunning) "PAUSA" else "INICIAR",
                    fontSize = 10.sp,
                    maxLines = 1,
                    fontWeight = FontWeight.Black,
                    textAlign = TextAlign.Center,
                    color = ColorDarkText
                )
            }

            // Botón Siguiente/Finalizar
            Button(
                onClick = onNextStep,
                colors = ButtonDefaults.buttonColors(containerColor = ColorPrimaryAction),
                shape = RoundedCornerShape(CardCornerRadius),
                contentPadding = PaddingValues(0.dp),
                modifier = Modifier.weight(1f).height(ButtonHeight).padding(start = CompactPadding / 2)
            ) {
                Text(
                    if (currentIndex == ejerciciosSize - 1) "FINALIZAR" else "SIGUIENTE",
                    fontSize = 10.sp,
                    maxLines = 1,
                    fontWeight = FontWeight.Black,
                    textAlign = TextAlign.Center,
                    color = ColorDarkText
                )
            }
        }
    }
}