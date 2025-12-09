package com.example.pregntfit.presentation.screens.rutinas

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.pregntfit.presentation.navigation.UserSession.usuarioId
import com.example.pregntfit.presentation.screens.rutinas.model.EjercicioDetalle
import com.example.pregntfit.presentation.screens.rutinas.model.fetchRutinaDetalle

private val ColorBackgroundDeep = Color(0xFF0D0D0D)
private val ColorTealSoft = Color(0xFF80CBC4)
private val ColorLavenderSoft = Color(0xFFD0BCFF)
private val ColorCardDark = Color(0xFF1A1A1A)
private val ColorCardDarker = Color(0xFF141414)
private val ColorExitButton = Color(0xFFE57373)
private val ColorError = Color(0xFFE57373)
private val CompactPadding = 6.dp
private val TitleFontSize = 12.sp
private val DetailFontSize = 8.sp
private val DetailHighlightFontSize = 9.sp
private val CardCornerRadius = 8.dp
private val CardElevation = 1.dp
private val ButtonFooterHeight = 45.dp
private val CardBorderThickness = 1.dp

private data class RutinaDetalleUiState(
    val ejercicios: List<EjercicioDetalle> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)

@Composable
fun RutinaDetalleScreen(navController: NavController, rutinaId: Int) {
    var uiState by remember { mutableStateOf(RutinaDetalleUiState(isLoading = true)) }

    LaunchedEffect(rutinaId) {
        uiState = uiState.copy(isLoading = true, error = null)
        try {
            val ejercicios = fetchRutinaDetalle(rutinaId)
            uiState = uiState.copy(ejercicios = ejercicios, isLoading = false)
        } catch (e: Exception) {
            uiState = uiState.copy(error = "Error: ${e.message}", isLoading = false)
        }
    }

    Scaffold(
        topBar = {
            RutinaDetalleHeader(onBackClicked = { navController.popBackStack() })
        },
        bottomBar = {
            StartButton(rutinaId = rutinaId, navController = navController)
        },
        containerColor = ColorBackgroundDeep
    ) { paddingValues ->

        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when {
                uiState.isLoading -> CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center),
                    color = ColorLavenderSoft
                )

                uiState.error != null -> Text(
                    text = uiState.error ?: "Error desconocido",
                    color = ColorError,
                    modifier = Modifier.align(Alignment.Center),
                    fontSize = DetailFontSize
                )

                else -> RutinaDetalleContent(ejercicios = uiState.ejercicios)
            }
        }
    }
}

@Composable
private fun RutinaDetalleHeader(onBackClicked: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = CompactPadding, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Button(
            onClick = onBackClicked,
            colors = ButtonDefaults.buttonColors(containerColor = ColorExitButton),
            shape = RoundedCornerShape(8.dp),
            contentPadding = PaddingValues(0.dp),
            modifier = Modifier
                .height(22.dp)
                .width(32.dp)
        ) {
            Icon(
                imageVector = Icons.Default.ArrowBack,
                contentDescription = "Volver",
                tint = ColorTextLight,
                modifier = Modifier.size(14.dp)
            )
        }

        Spacer(modifier = Modifier.width(CompactPadding * 2))
        Text(
            text = "Detalles de la Rutina",
            color = ColorTextLight,
            fontSize = TitleFontSize,
            fontWeight = FontWeight.ExtraBold
        )
    }
}

@Composable
private fun RutinaDetalleContent(ejercicios: List<EjercicioDetalle>) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(CompactPadding),
        horizontalAlignment = Alignment.CenterHorizontally,
        contentPadding = PaddingValues(top = 0.dp, bottom = CompactPadding * 2)
    ) {

        item {
            RutinaSummaryHeader(numEjercicios = ejercicios.size)
        }

        itemsIndexed(ejercicios) { index, ejercicio ->
            EjercicioCard(ejercicio = ejercicio, index = index)
        }
    }
}

@Composable
private fun RutinaSummaryHeader(numEjercicios: Int) {

}
@Composable
private fun EjercicioCard(ejercicio: EjercicioDetalle, index: Int) {
    Card(
        modifier = Modifier
            .fillMaxWidth(0.96f)
            .wrapContentHeight(),
        shape = RoundedCornerShape(CardCornerRadius),
        colors = CardDefaults.cardColors(containerColor = ColorCardDark),
        elevation = CardDefaults.cardElevation(CardElevation),
        border = BorderStroke(CardBorderThickness, ColorLavenderSoft.copy(alpha = 0.5f))
    ) {
        Column(
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = CompactPadding, horizontal = CompactPadding),
                verticalAlignment = Alignment.Top
            ) {
                Column(
                    modifier = Modifier.weight(1f),
                    horizontalAlignment = Alignment.Start
                ) {
                    Text(
                        text = ejercicio.ejercicio,
                        color = ColorLavenderSoft,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = ejercicio.descripcion,
                        color = ColorTextSecondary,
                        fontSize = DetailFontSize,
                        fontWeight = FontWeight.Medium,
                        modifier = Modifier.padding(top = 1.dp)
                    )
                }
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(bottomStart = CardCornerRadius, bottomEnd = CardCornerRadius))
                    .background(ColorCardDarker)
                    .padding(horizontal = CompactPadding, vertical = CompactPadding / 2),
                horizontalArrangement = Arrangement.Start,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Series: ${ejercicio.series}",
                    color = ColorTextLight.copy(alpha = 0.8f),
                    fontSize = DetailHighlightFontSize,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.width(CompactPadding * 3))
                Text(
                    text = "Reps: ${ejercicio.repeticiones}",
                    color = ColorTextLight.copy(alpha = 0.8f),
                    fontSize = DetailHighlightFontSize,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}

@Composable
private fun StartButton(rutinaId: Int, navController: NavController) {
    BottomAppBar(
        containerColor = ColorBackgroundDeep.copy(alpha = 0.95f),
        contentPadding = PaddingValues(0.dp),
        modifier = Modifier
            .height(ButtonFooterHeight)
            .clip(RoundedCornerShape(topStart = 8.dp, topEnd = 8.dp))
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = CompactPadding),
            contentAlignment = Alignment.Center
        ) {
            Button(
                onClick = { navController.navigate("RutinaStepScreen/$rutinaId/$usuarioId") },
                colors = ButtonDefaults.buttonColors(containerColor = ColorTealSoft),
                shape = RoundedCornerShape(CardCornerRadius),
                modifier = Modifier
                    .fillMaxWidth(0.65f)
                    .height(35.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {

                    Text(
                        "¡Comenzar!",
                        color = ColorCardDark,
                        fontSize = 12.sp, // 🚨 Reducido 🚨
                        fontWeight = FontWeight.ExtraBold
                    )
                }
            }
        }
    }
}