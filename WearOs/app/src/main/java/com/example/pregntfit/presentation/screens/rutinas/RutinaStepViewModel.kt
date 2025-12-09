package com.example.pregntfit.presentation.screens.rutinas

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.pregntfit.presentation.screens.rutinas.model.EjercicioDetalle
import com.example.pregntfit.presentation.screens.rutinas.model.fetchRutinaDetalle
import kotlinx.coroutines.launch

class RutinaStepViewModel : ViewModel() {

    var ejercicios: List<EjercicioDetalle> = emptyList()
        private set

    var currentIndex: Int = 0
        private set

    fun loadEjercicios(rutinaId: Int, onLoaded: () -> Unit) {
        viewModelScope.launch {
            ejercicios = fetchRutinaDetalle(rutinaId)
            currentIndex = 0
            onLoaded()
        }
    }

    fun nextStep() {
        if (currentIndex < ejercicios.size - 1) {
            currentIndex++
        }
    }

    fun previousStep() {
        if (currentIndex > 0) {
            currentIndex--
        }
    }

    fun currentEjercicio(): EjercicioDetalle? {
        return ejercicios.getOrNull(currentIndex)
    }
}
