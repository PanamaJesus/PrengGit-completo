package com.example.pregntfit.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable

import androidx.navigation.NavType
import androidx.navigation.navArgument

import com.example.pregntfit.presentation.screens.MenuScreen
import com.example.pregntfit.presentation.screens.SecondScreen
import com.example.pregntfit.presentation.screens.LecturaScreen
import com.example.pregntfit.presentation.screens.LecturaOxScreen
import com.example.pregntfit.presentation.screens.LecturaTempScreen
import com.example.pregntfit.presentation.screens.rutinas.RutinasScreen
import com.example.pregntfit.presentation.screens.rutinas.RutinaDetalleScreen
import com.example.pregntfit.presentation.screens.rutinas.RutinaStepScreen
import com.example.pregntfit.presentation.screens.rutinas.RutinaFinalScreen
import com.example.pregntfit.presentation.screens.LoginScreen

@Composable
fun NavGraph(navController: NavHostController) {

    NavHost(navController = navController, startDestination = "login") {

        composable(
            "MenuScreen/{usuarioId}",
            arguments = listOf(navArgument("usuarioId") { type = NavType.IntType })
        ) { backStack ->

            val usuarioId = backStack.arguments?.getInt("usuarioId") ?: 0

            MenuScreen(navController, usuarioId)
        }
        composable("second_screen") { SecondScreen(navController) }
        composable("LecturaScreen") { LecturaScreen(navController) }
        composable("LecturaOxScreen") { LecturaOxScreen(navController) }
        composable("LecturaTempScreen") { LecturaTempScreen(navController) }

        composable("login") {
            LoginScreen(navController)
        }
        composable(
            "RutinasScreen/{usuarioId}",
            arguments = listOf(navArgument("usuarioId") { type = NavType.IntType })
        ) { backStack ->
            val usuarioId = backStack.arguments?.getInt("usuarioId") ?: 0
            RutinasScreen(navController, usuarioId)
        }

        composable(
            "RutinaDetalleScreen/{rutinaId}",
            arguments = listOf(navArgument("rutinaId") { type = NavType.IntType })
        ) { backStack ->
            val rutinaId = backStack.arguments?.getInt("rutinaId") ?: 0
            RutinaDetalleScreen(navController, rutinaId)
        }

        composable(
            "RutinaStepScreen/{rutinaId}/{usuarioId}",
            arguments = listOf(
                navArgument("rutinaId") { type = NavType.IntType },
                navArgument("usuarioId") { type = NavType.IntType }
            )
        ) { backStack ->
            val rutinaId = backStack.arguments?.getInt("rutinaId") ?: 0
            val usuarioId = backStack.arguments?.getInt("usuarioId") ?: 0
            RutinaStepScreen(navController, rutinaId, usuarioId)
        }

        composable(
            route = "RutinaFinalScreen/{rutinaId}/{tiempoTotal}",
            arguments = listOf(
                navArgument("rutinaId") { type = NavType.IntType },
                navArgument("tiempoTotal") { type = NavType.IntType }
            )
        ) { backStackEntry ->
            val rutinaId = backStackEntry.arguments?.getInt("rutinaId") ?: 0
            val tiempoTotal = backStackEntry.arguments?.getInt("tiempoTotal") ?: 0
            RutinaFinalScreen(navController, rutinaId, tiempoTotal)
        }
    }
}
