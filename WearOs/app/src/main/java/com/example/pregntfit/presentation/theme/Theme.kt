package com.example.pregntfit.presentation.theme

import androidx.compose.runtime.Composable
import androidx.wear.compose.material.MaterialTheme
import androidx.wear.compose.material.Colors
import androidx.wear.compose.material.Typography
import androidx.compose.ui.graphics.Color

private val WearColorPalette = Colors(
    primary = Color(0xFF00796B),
    primaryVariant = Color(0xFF004D40),
    secondary = Color(0xFF80CBC4),
    background = Color.Black, // <- aquí decides el fondo por defecto
    surface = Color.Black,
    onPrimary = Color.White,
    onSecondary = Color.Black,
    onBackground = Color.White,
    onSurface = Color.White
)

private val WearTypography = Typography()

@Composable
fun PregntFitTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colors = WearColorPalette,
        typography = WearTypography,
        content = content
    )
}
