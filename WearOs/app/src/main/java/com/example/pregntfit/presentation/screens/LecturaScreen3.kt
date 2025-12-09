package com.example.pregntfit.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Thermostat
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.pregntfit.presentation.navigation.UserSession
import com.example.pregntfit.presentation.screens.rutinas.model.postSimulador
import com.example.pregntfit.presentation.screens.rutinas.model.SimuladorResponse

private val ColorBackgroundDeep = Color(0xFF0D0D0D)
private val ColorCardDark = Color(0xFF1A1A1A)
private val ColorTextLight = Color(0xFFFFFFFF)
private val ColorTextSecondary = Color(0xFFBBBBBB)
private val ColorCoralPeach = Color(0xFFE57373)
private val ColorPrimaryAction = Color(0xFF81D4FA)

private val ColorTempAcent = Color(0xFFB2FF59)

private val CompactPadding = 4.dp
private val TitleFontSize = 13.sp
private val CardCornerRadius = 6.dp
private val IconSizeSmall = 12.dp
private val ButtonHeightLarge = 35.dp
private val ButtonWidthCompact = 36.dp
private val CardWidth = 0.7f

private val MenuButtonHeight = 26.dp
private val MenuButtonWidth = 36.dp
private val MenuIconSize = 16.dp


@Composable
fun LecturaTempScreen(navController: NavController) {
    val usuarioId = UserSession.usuarioId

    var simuladorLectura by remember { mutableStateOf<SimuladorResponse?>(null) }
    var error by remember { mutableStateOf<String?>(null) }
    var loading by remember { mutableStateOf(true) }

    val ACCION_ID = 4

    LaunchedEffect(usuarioId) {
        try {
            simuladorLectura = postSimulador(usuarioId, ACCION_ID)
        } catch (e: Exception) {
            error = "Error al obtener datos de temperatura del simulador: ${e.message}"
        } finally {
            loading = false
        }
    }

    Scaffold(
        containerColor = ColorBackgroundDeep,
        topBar = {
            LecturaTempHeader(
                title = "Temperatura Corporal",
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
                    color = ColorTempAcent,
                    modifier = Modifier.align(Alignment.Center).size(20.dp)
                )
                error != null -> Text(
                    text = error ?: "Error desconocido",
                    color = ColorCoralPeach,
                    fontSize = 9.sp,
                    modifier = Modifier.align(Alignment.Center)
                )
                simuladorLectura != null -> {
                    LecturaTempCardView(
                        lecturaTemp = simuladorLectura!!.temperatura
                    )
                }
            }

            if (!loading && error == null) {
                Button(
                    onClick = { navController.navigate("LecturaOxScreen") },
                    colors = ButtonDefaults.buttonColors(containerColor = ColorTempAcent),
                    shape = RoundedCornerShape(CardCornerRadius),
                    contentPadding = PaddingValues(0.dp),
                    modifier = Modifier
                        .align(Alignment.CenterStart)
                        .padding(start = CompactPadding)
                        .height(ButtonHeightLarge)
                        .width(ButtonWidthCompact)
                ) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "Anterior (Oxígeno)",
                        tint = ColorBackgroundDeep,
                        modifier = Modifier.size(IconSizeSmall)
                    )
                }



            }
        }
    }
}

@Composable
private fun LecturaTempHeader(title: String, onBackClicked: () -> Unit) {
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
private fun LecturaTempCardView(lecturaTemp: String) {
    Card(
        shape = RoundedCornerShape(CardCornerRadius * 2),
        colors = CardDefaults.cardColors(containerColor = ColorCardDark),
        elevation = CardDefaults.cardElevation(2.dp),
        modifier = Modifier
            .fillMaxWidth(0.7f)
            .wrapContentHeight()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = Icons.Default.Thermostat,
                contentDescription = "Temperatura",
                tint = ColorTempAcent,
                modifier = Modifier.size(30.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "${lecturaTemp}°C",
                color = ColorTempAcent,
                fontSize = 30.sp,
                fontWeight = FontWeight.Black
            )

            Spacer(modifier = Modifier.height(3.dp))

            Text(
                text = "Temperatura corporal",
                color = ColorTextSecondary.copy(alpha = 0.7f),
                fontSize = 8.sp
            )
        }
    }
}