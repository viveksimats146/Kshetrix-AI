import java.net.Socket

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

// Automatically start Python backend if it is not already running
tasks.register("ensureBackendRunning") {
    doLast {
        var isRunning: Boolean
        try {
            Socket("127.0.0.1", 8001).use {
                isRunning = true
            }
            println("[Agrico] Backend is already running on port 8001.")
        } catch (e: Exception) {
            isRunning = false
        }

        if (!isRunning) {
            println("[Agrico] Starting Python Backend on port 8001...")
            val backendDir = file("../../backend")
            try {
                if (System.getProperty("os.name").lowercase().contains("windows")) {
                    ProcessBuilder("cmd", "/c", "start", "/b", "python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001")
                        .directory(backendDir)
                        .start()
                } else {
                    ProcessBuilder("python3", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001")
                        .directory(backendDir)
                        .start()
                }
            } catch (e: Exception) {
                println("[Agrico] Warning: Could not auto-start python backend: ${e.message}")
            }
        }
    }
}

// Automatically bridge port 8001 from Android device to local backend server
tasks.register<Exec>("reversePortBridge") {
    val localAppData = System.getenv("LOCALAPPDATA") ?: ""
    val adbFile = file("$localAppData/Android/Sdk/platform-tools/adb.exe")
    if (adbFile.exists()) {
        commandLine(adbFile.absolutePath, "reverse", "tcp:8001", "tcp:8001")
    } else {
        commandLine("adb", "reverse", "tcp:8001", "tcp:8001")
    }
    isIgnoreExitValue = true
}

tasks.named("preBuild") {
    dependsOn("npmBuild")
    dependsOn("ensureBackendRunning")
    dependsOn("reversePortBridge")
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.constraintlayout)
    implementation(libs.androidx.webkit)
}
