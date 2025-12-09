plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.example.pregntfit"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.example.pregntfit"
        minSdk = 30
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    useLibrary("wear-sdk")
    buildFeatures {
        compose = true
    }
}

dependencies {

    implementation(libs.play.services.wearable)
    implementation(platform(libs.compose.bom))
    implementation(libs.ui)
    implementation(libs.ui.graphics)
    implementation(libs.ui.tooling.preview)
    implementation(libs.compose.material)
    implementation(libs.compose.foundation)
    implementation(libs.wear.tooling.preview)
    implementation(libs.activity.compose)
    implementation(libs.core.splashscreen)
    implementation(libs.tiles)
    implementation(libs.tiles.material)
    implementation(libs.tiles.tooling.preview)
    implementation(libs.horologist.compose.tools)
    implementation(libs.horologist.tiles)
    implementation(libs.watchface.complications.data.source.ktx)

    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")

    implementation("androidx.wear.compose:compose-material:1.4.0-beta03")
    implementation("androidx.wear.compose:compose-foundation:1.4.0-beta03")
    implementation("androidx.wear.compose:compose-ui-tooling:1.4.0-beta03")
    // Navigation Compose (para manejar pantallas)
    implementation("androidx.navigation:navigation-compose:2.7.3")
    implementation("androidx.compose.material3:material3:1.2.0-alpha03")
    implementation("androidx.compose.material3:material3-window-size-class:1.2.0-alpha03")

    implementation("io.coil-kt:coil-compose:2.4.0")

    implementation("io.coil-kt:coil-compose:2.4.0")
    implementation("androidx.compose.material:material-icons-extended")




    androidTestImplementation(platform(libs.compose.bom))
    androidTestImplementation(libs.ui.test.junit4)
    debugImplementation(libs.ui.tooling)
    debugImplementation(libs.ui.test.manifest)
    debugImplementation(libs.tiles.tooling)


}