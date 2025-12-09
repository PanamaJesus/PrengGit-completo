package com.example.pregntfit.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.pregntfit.presentation.navigation.ApiConfig
import com.example.pregntfit.presentation.navigation.UserSession
import com.example.pregntfit.presentation.navigation.Api
import com.example.pregntfit.presentation.screens.rutinas.model.Usuario
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

// --- 💎 PALETA MODERNA Y PREMIUM ---
private val ColorBackgroundDeep = Color(0xFF0D0D0D)
private val ColorCoralPeach = Color(0xFFFFAB91)
private val ColorCardDark = Color(0xFF1A1A1A)
private val ColorTextLight = Color(0xFFFFFFFF)
private val ColorError = Color(0xFFE57373)

// --- CONSTANTES DE DISEÑO ---
private val CardCornerRadius = 10.dp
private val ListItemSpacing = 6.dp
private val ScreenPadding = 4.dp
private val TitleFontSize = 16.sp
private val TextFontSize = 11.sp
private val CardBorderWidth = 1.5.dp

@Composable
fun LoginScreen(navController: NavController) {
    val scope = rememberCoroutineScope()
    var listaUsuarios by remember { mutableStateOf<List<Usuario>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }
    val retrofit = remember {
        Retrofit.Builder()
            .baseUrl(ApiConfig.BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
    val api = remember { retrofit.create(Api::class.java) }
    LaunchedEffect(Unit) {
        scope.launch {
            try {
                listaUsuarios = api.getUsuarios()
            } catch (e: Exception) {
                error = "Error al obtener usuarios: ${e.message}"
            } finally {
                loading = false
            }
        }
    }
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(ColorBackgroundDeep)
            .padding(horizontal = ScreenPadding, vertical = ScreenPadding)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Top,
            modifier = Modifier.fillMaxSize()
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(vertical = ListItemSpacing * 1.5f)
            ) {
                Icon(
                    imageVector = Icons.Default.FavoriteBorder,
                    contentDescription = "Health Icon",
                    tint = ColorCoralPeach,
                    modifier = Modifier.size(TitleFontSize.value.dp).padding(end = 4.dp)
                )
                Text(
                    text = "Seleccionar Usuario",
                    color = ColorTextLight,
                    fontSize = TitleFontSize,
                    fontWeight = FontWeight.ExtraBold,
                )
            }
            when {
                loading -> CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.CenterHorizontally),
                    color = ColorCoralPeach
                )

                error != null -> Text(
                    text = error ?: "Error desconocido",
                    color = ColorError,
                    fontSize = TextFontSize,
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                )

                else -> LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(ListItemSpacing),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    contentPadding = PaddingValues(top = ListItemSpacing, bottom = ListItemSpacing)
                ) {
                    items(listaUsuarios) { usuario ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth(0.96f)
                                .wrapContentHeight()
                                .border(
                                    width = CardBorderWidth,
                                    color = ColorCoralPeach.copy(alpha = 0.5f),
                                    shape = RoundedCornerShape(CardCornerRadius)
                                )
                                .clickable {
                                    UserSession.usuarioId = usuario.id
                                    navController.navigate("MenuScreen/${usuario.id}")
                                },
                            shape = RoundedCornerShape(CardCornerRadius),
                            colors = CardDefaults.cardColors(containerColor = ColorCardDark),
                            elevation = CardDefaults.cardElevation(4.dp)
                        ) {
                            Column(
                                modifier = Modifier
                                    .padding(vertical = ListItemSpacing + 2.dp, horizontal = 12.dp)
                                    .fillMaxWidth(),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text(
                                    text = "${usuario.nombre} ${usuario.ap_pat} ${usuario.ap_mat}",
                                    color = ColorCoralPeach,
                                    fontSize = TextFontSize,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "ID: #${usuario.id}",
                                    color = ColorTextLight.copy(alpha = 0.7f),
                                    fontSize = 9.sp
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}