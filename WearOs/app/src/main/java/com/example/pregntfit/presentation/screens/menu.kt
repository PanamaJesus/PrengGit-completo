package com.example.pregntfit.presentation.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.FitnessCenter
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.material3.LocalContentColor

// --- 💎 PALETA MODERNA Y PREMIUM ---
private val ColorBackgroundDeep = Color(0xFF0D0D0D)
private val ColorTealSoft = Color(0xFF80CBC4)
private val ColorCoralPeach = Color(0xFFFFAB91)
private val ColorSkyBlueSoft = Color(0xFFB3E5FC)
private val ColorExitButton = Color(0xFFE57373)
private val ColorTextLight = Color(0xFFFFFFFF)
private val ColorContentDark = Color(0xFF1A1A1A)

private val WearButtonHeight = 80.dp
private val WearIconSize = 40.dp
private val WearTextSize = 14.sp
private val HorizontalSpacing = 8.dp
private val VerticalSpacing = 6.dp
private val CornerRadius = 16.dp
private val BorderWidth = 1.dp
private val TopPushDown = 5.dp

@Composable
fun MenuScreen(navController: NavHostController, usuarioId: Int) {
    Scaffold(
        topBar = {
            MenuExitButton(navController = navController)
        },
        containerColor = ColorBackgroundDeep
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(top = TopPushDown),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Top
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(bottom = VerticalSpacing * 1.5f)
            ) {
                Icon(
                    imageVector = Icons.Default.FavoriteBorder,
                    contentDescription = "Health",
                    tint = ColorCoralPeach,
                    modifier = Modifier.size(16.dp).padding(end = 4.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "PREGNFIT",
                    color = ColorTextLight,
                    fontSize = 17.sp,
                    fontWeight = FontWeight.ExtraBold,
                )
                Spacer(modifier = Modifier.width(4.dp))
                Icon(
                    imageVector = Icons.Default.FavoriteBorder,
                    contentDescription = "Health",
                    tint = ColorCoralPeach,
                    modifier = Modifier.size(16.dp).padding(start = 4.dp)
                )
            }
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                ElaborateMenuButton(
                    icon = Icons.Default.FitnessCenter,
                    label = "Rutinas",
                    containerColor = ColorTealSoft,
                    onClick = { navController.navigate("RutinasScreen/$usuarioId") },
                    modifier = Modifier.weight(1f).height(WearButtonHeight).aspectRatio(1f)
                )

                Spacer(modifier = Modifier.width(HorizontalSpacing))

                ElaborateMenuButton(
                    icon = Icons.Default.BarChart,
                    label = "Lecturas",
                    containerColor = ColorCoralPeach,
                    onClick = { navController.navigate("LecturaScreen") },
                    modifier = Modifier.weight(1f).height(WearButtonHeight).aspectRatio(1f)
                )
            }

            Spacer(modifier = Modifier.height(VerticalSpacing))


        }
    }
}

@Composable
private fun MenuExitButton(navController: NavHostController) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Start
    ) {
        Button(
            onClick = { navController.navigate("login") },
            colors = ButtonDefaults.buttonColors(containerColor = ColorExitButton),
            shape = RoundedCornerShape(10.dp),
            contentPadding = PaddingValues(0.dp),
            modifier = Modifier
                .height(26.dp)
                .width(36.dp)
        ) {
            Icon(
                imageVector = Icons.Default.ArrowBack,
                contentDescription = "Volver",
                tint = ColorTextLight,
                modifier = Modifier.size(16.dp)
            )
        }
    }
}

@Composable
private fun ElaborateMenuButton(
    icon: ImageVector,
    label: String,
    containerColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(CornerRadius),
        color = containerColor,
        modifier = modifier
            .padding(BorderWidth)
            .clip(RoundedCornerShape(CornerRadius))
            .clickable(onClick = onClick)
    ) {
        CompositionLocalProvider(
            LocalContentColor provides ColorContentDark
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 8.dp, vertical = 6.dp)
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = label,
                    modifier = Modifier.size(WearIconSize)
                )
                Text(
                    text = label,
                    fontSize = WearTextSize,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center,
                    maxLines = 1
                )
            }
        }
    }
}