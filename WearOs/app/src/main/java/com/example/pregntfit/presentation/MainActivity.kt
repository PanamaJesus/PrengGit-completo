package com.example.pregntfit.presentation

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.navigation.compose.rememberNavController
import com.example.pregntfit.presentation.navigation.NavGraph
import com.example.pregntfit.presentation.theme.PregntFitTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            PregntFitTheme {
                val navController = rememberNavController()
                NavGraph(navController = navController)
            }
        }
    }
}
