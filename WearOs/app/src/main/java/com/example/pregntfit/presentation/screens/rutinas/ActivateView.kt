package com.example.pregntfit.presentation.screens.rutinas

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter
import com.example.pregntfit.presentation.screens.rutinas.model.EjercicioDetalle

@Composable
fun ActiveView(
    ejercicio: EjercicioDetalle,
    timeElapsed: Int,
    isTimerRunning: Boolean,
    onToggleTimer: () -> Unit,
    onNext: () -> Unit,
    formatTime: (Int) -> String
) {
    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.SpaceBetween,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Tiempo: $timeElapsed s", color = Color.White)

        Image(
            painter = rememberAsyncImagePainter(ejercicio.url),
            contentDescription = ejercicio.ejercicio,
            modifier = Modifier.size(140.dp),
            contentScale = ContentScale.Crop
        )

        Text(text = ejercicio.ejercicio, color = Color.White)
        Text("Series: ${ejercicio.series}", color = Color.LightGray)
        Text("Repeticiones: ${ejercicio.repeticiones}", color = Color.LightGray)
        Text(text = ejercicio.descripcion, color = Color.Gray)

        Button(onClick = onToggleTimer) {
            Text(if (isTimerRunning) "Pausar" else "Reanudar")
        }

        Button(onClick = onNext) {
            Text("Siguiente")
        }
    }
}
