package com.example.pregntfit.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.pregntfit.presentation.screens.rutinas.model.postSimulador
import com.example.pregntfit.presentation.screens.rutinas.model.SimuladorResponse

private val ColorBackgroundDeep = Color(0xFF0D0D0D)
private val ColorCardDark = Color(0xFF1A1A1A)
private val ColorTextLight = Color(0xFFFFFFFF)
private val ColorTextSecondary = Color(0xFFBBBBBB)
private val ColorCoralPeach = Color(0xFFE57373)
private val ColorPrimaryAction = Color(0xFF81D4FA)

private val ColorHeartRate = Color(0xFFFFCCBC)

private val CompactPadding = 4.dp
private val TitleFontSize = 13.sp
private val CardCornerRadius = 6.dp
private val IconSizeSmall = 12.dp
private val ButtonHeightLarge = 40.dp
private val ButtonWidthCompact = 36.dp
private val CardWidth = 0.75f

private val MenuButtonHeight = 26.dp
private val MenuButtonWidth = 36.dp
private val MenuIconSize = 16.dp

@Composable
fun LecturaScreen(navController: NavController, usuarioId: Int = 1) {

    var simuladorLectura by remember { mutableStateOf<SimuladorResponse?>(null) }
    var error by remember { mutableStateOf<String?>(null) }
    var loading by remember { mutableStateOf(true) }

    val ACCION_ID = 4

    LaunchedEffect(usuarioId) {
        try {
            simuladorLectura = postSimulador(usuarioId, ACCION_ID)
        } catch (e: Exception) {
            error = "Error al obtener datos del simulador: ${e.message}"
        } finally {
            loading = false
        }
    }

    Scaffold(
        containerColor = ColorBackgroundDeep,
        topBar = {
            LecturaHeaderMenu(
                title = "Ritmo Cardíaco",
                onBackClicked = { navController.navigate("MenuScreen/$usuarioId") }
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentAlignment = Alignment.Center
        ) {
            when {
                loading -> CircularProgressIndicator(
                    color = ColorHeartRate,
                    modifier = Modifier.align(Alignment.Center)
                )
                error != null -> Text(
                    text = error ?: "Error desconocido",
                    color = ColorCoralPeach,
                    fontSize = 11.sp,
                    modifier = Modifier.align(Alignment.Center)
                )
                simuladorLectura != null -> {
                    LecturaCardView(
                        lecturaBpm = simuladorLectura!!.lectura_bpm
                    )
                }
            }
            if (!loading && error == null) {
                Button(
                    onClick = { navController.navigate("LecturaOxScreen") },
                    colors = ButtonDefaults.buttonColors(containerColor =ColorCoralPeach),
                    shape = RoundedCornerShape(CardCornerRadius),
                    contentPadding = PaddingValues(0.dp),
                    modifier = Modifier
                        .align(Alignment.CenterEnd)
                        .padding(end = CompactPadding)
                        .height(ButtonHeightLarge)
                        .width(ButtonWidthCompact)
                ) {
                    Icon(
                        imageVector = Icons.Default.ArrowForward,
                        contentDescription = "Siguiente (Oxígeno)",
                        tint = ColorBackgroundDeep,
                        modifier = Modifier.size(IconSizeSmall)
                    )
                }
            }
        }
    }
}

@Composable
private fun LecturaHeaderMenu(title: String, onBackClicked: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(ColorBackgroundDeep)
            .padding(horizontal = CompactPadding, vertical = 2.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Start
    ) {
        Button(
            onClick = onBackClicked,
            colors = ButtonDefaults.buttonColors(containerColor = ColorCoralPeach),
            shape = RoundedCornerShape(CardCornerRadius),
            contentPadding = PaddingValues(0.dp),
            modifier = Modifier
                .height(MenuButtonHeight)
                .width(MenuButtonWidth)
        ) {
            Icon(
                imageVector = Icons.Default.ArrowBack,
                contentDescription = "Volver",
                tint = ColorBackgroundDeep,
                modifier = Modifier.size(MenuIconSize)
            )
        }

        Spacer(modifier = Modifier.width(CompactPadding * 2))

        Text(
            text = title,
            color = ColorTextLight,
            fontSize = TitleFontSize,
            fontWeight = FontWeight.ExtraBold
        )
    }
}

@Composable
private fun LecturaCardView(lecturaBpm: Int) {
    Card(
        shape = RoundedCornerShape(CardCornerRadius * 2),
        colors = CardDefaults.cardColors(containerColor = ColorCardDark),
        elevation = CardDefaults.cardElevation(3.dp),
        modifier = Modifier
            .fillMaxWidth(CardWidth)
            .wrapContentHeight()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = Icons.Default.Favorite,
                contentDescription = "Corazón",
                tint = ColorHeartRate,
                modifier = Modifier.size(36.dp)
            )

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = "${lecturaBpm}",
                color = ColorHeartRate,
                fontSize = 40.sp,
                fontWeight = FontWeight.Black
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Ritmo cardíaco por minuto",
                color = ColorTextSecondary.copy(alpha = 0.7f),
                fontSize = 9.sp
            )
        }
    }
}