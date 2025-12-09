package com.example.pregntfit.presentation.navigation

import com.example.pregntfit.presentation.screens.rutinas.model.Usuario
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface Api {

    @GET("usuario/")
    suspend fun getUsuarios(): List<Usuario>



}
