package com.example.pregntfit.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController

@Composable
fun SecondScreen(navController: NavHostController) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.DarkGray),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                text = "Segunda Pantalla",
                color = Color.White,
                style = MaterialTheme.typography.titleMedium,
                textAlign = TextAlign.Center
            )

            Button(
                onClick = { navController.navigate("first_screen") },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E88E5)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth(0.7f)
            ) {
                Text("Volver a Pantalla Inicial", color = Color.White)
            }
        }
    }
}
