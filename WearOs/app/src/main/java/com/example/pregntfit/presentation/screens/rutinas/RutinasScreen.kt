package com.example.pregntfit.presentation.screens.rutinas

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.FitnessCenter
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.foundation.background
import com.example.pregntfit.presentation.screens.rutinas.model.RutinaUsuario
import com.example.pregntfit.presentation.screens.rutinas.model.fetchRutinasUsuario

private val ColorBackgroundDeep = Color(0xFF0D0D0D)
private val ColorLavenderSoft = Color(0xFFFFECC0)
private val ColorCoralPeach = Color(0xFFE57373)
private val ColorCardDark = Color(0xFF1A1A1A)
private val ColorError = Color(0xFFE57373)
// Errores

private val CompactPadding = 6.dp
private val TitleFontSize = 14.sp
private val SubtitleFontSize = 12.sp
private val DetailFontSize = 8.sp
private val CardCornerRadius = 8.dp
private val ListItemSpacing = 8.dp
private val CompactCardElevation = 2.dp
private val CardBorderThickness = 1.dp

private data class RutinaListUiState(
    val rutinas: List<RutinaUsuario> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)

@Composable
fun RutinasScreen(navController: NavController, usuarioId: Int) {
    var uiState by remember { mutableStateOf(RutinaListUiState(isLoading = true)) }
    LaunchedEffect(usuarioId) {
        uiState = uiState.copy(isLoading = true, error = null)
        try {
            val rutinas = fetchRutinasUsuario(usuarioId)
            uiState = uiState.copy(rutinas = rutinas, isLoading = false)
        } catch (e: Exception) {
            uiState = uiState.copy(error = "Error al cargar las rutinas: ${e.message}", isLoading = false)
        }
    }

    // ESTRUCTURA PRINCIPAL
    Scaffold(
        topBar = {
            RutinasHeader(onBackClicked = { navController.popBackStack() })
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

                uiState.rutinas.isEmpty() -> NoRutinasMessage()

                else -> RutinasContent(
                    rutinas = uiState.rutinas,
                    navController = navController
                )
            }
        }
    }
}

@Composable
private fun RutinasHeader(onBackClicked: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = CompactPadding, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Button(
            onClick = onBackClicked,
            colors = ButtonDefaults.buttonColors(containerColor = ColorCoralPeach),
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
            text = "Tus rutinas",
            color = ColorTextLight,
            fontSize = TitleFontSize,
            fontWeight = FontWeight.ExtraBold
        )
    }
}

@Composable
private fun BoxScope.NoRutinasMessage() {
    Column(
        modifier = Modifier
            .align(Alignment.Center)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Default.FitnessCenter,
            contentDescription = "Sin Rutinas",
            tint = ColorTextSecondary.copy(alpha = 0.5f),
            modifier = Modifier.size(48.dp)
        )
        Spacer(modifier = Modifier.height(CompactPadding * 2))
        Text(
            text = "Aún no tienes rutinas guardadas.",
            color = ColorTextSecondary,
            fontSize = SubtitleFontSize,
            fontWeight = FontWeight.SemiBold
        )
        Spacer(modifier = Modifier.height(CompactPadding))
        Text(
            text = "Accede a la pagina de PrengFit para guardar rutinas",
            color = ColorTextSecondary.copy(alpha = 0.7f),
            fontSize = DetailFontSize
        )
    }
}


@Composable
private fun RutinasContent(rutinas: List<RutinaUsuario>, navController: NavController) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(ListItemSpacing),
        horizontalAlignment = Alignment.CenterHorizontally,
        contentPadding = PaddingValues(
            top = CompactPadding * 2,
            bottom = CompactPadding * 2,
            start = CompactPadding,
            end = CompactPadding
        )
    ) {
        items(rutinas) { rutina ->
            RutinaUsuarioCard(rutina = rutina, navController = navController)
        }
    }
}

@Composable
private fun RutinaUsuarioCard(rutina: RutinaUsuario, navController: NavController) {
    Card(
        shape = RoundedCornerShape(CardCornerRadius),
        colors = CardDefaults.cardColors(containerColor = ColorCardDark),
        elevation = CardDefaults.cardElevation(CompactCardElevation),
        border = BorderStroke(CardBorderThickness, ColorLavenderSoft.copy(alpha = 0.5f)),
        modifier = Modifier
            .fillMaxWidth(0.96f)
            .wrapContentHeight()
            .clickable { navController.navigate("RutinaDetalleScreen/${rutina.rutinaId}") }
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = CompactPadding * 1.5f, horizontal = CompactPadding),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.FitnessCenter,
                contentDescription = "Rutina Icono",
                tint = ColorLavenderSoft,
                modifier = Modifier
                    .size(24.dp)
                    .padding(end = CompactPadding)
            )

            Column(
                modifier = Modifier.weight(1f),
                horizontalAlignment = Alignment.Start
            ) {
                Text(
                    text = rutina.nombreRutina,
                    color = ColorLavenderSoft,
                    fontSize = SubtitleFontSize,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Duración: ${rutina.sugSemanas * 2} min",
                    color = ColorTextSecondary.copy(alpha = 0.7f),
                    fontSize = DetailFontSize,
                    fontWeight = FontWeight.Medium
                )
            }
            Icon(
                imageVector = Icons.Default.ArrowBack,
                contentDescription = "Ir a detalles",
                tint = ColorLavenderSoft,
                modifier = Modifier
                    .size(18.dp)
                    .rotate(180f)
            )
        }
    }
}