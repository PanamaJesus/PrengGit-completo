package com.example.pregntfit.presentation.navigation

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ApiService {

    val api: Api by lazy {
        Retrofit.Builder()
            .baseUrl(ApiConfig.BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(Api::class.java)
    }
}
