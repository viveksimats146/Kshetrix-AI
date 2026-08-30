plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.example.agricoapp"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.agricoapp"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
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
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    
    // Map Vite build folder ('dist') to Android assets
    sourceSets {
        getByName("main") {
            assets.srcDirs("../../dist")
        }
    }
}

// Automatically build React frontend before compiling the Android application
tasks.register<Exec>("npmBuild") {
    workingDir = file("../../")
    if (System.getProperty("os.name").lowercase().contains("windows")) {
        commandLine("cmd", "/c", "npm run build")
    } else {
        commandLine("npm", "run", "build")
    }
}

tasks.named("preBuild") {
    dependsOn("npmBuild")
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.constraintlayout)
    implementation(libs.androidx.webkit)
}
