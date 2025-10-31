//login.tsx
import { post } from "../src/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import formStyles from '../src/styles/forms';


WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const redirectUri = __DEV__ 
  ? "https://auth.expo.dev/@pandemuerttoo/outfit-lab"
  : AuthSession.makeRedirectUri({ scheme: "outfitlab" });
  console.log("redirectUri ->", redirectUri);

  // --- Google (id_token) ---
const [gRequest, gResponse, gPromptAsync] = Google.useAuthRequest({
  clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "",
  // androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? "",
  scopes: ["profile", "email"], 
  redirectUri: redirectUri,
});

useEffect(() => {
  if (gResponse?.type === "success" && gResponse.params?.id_token) {
    handleGoogleWithToken(gResponse.params.id_token);
  }
}, [gResponse]);

const onGooglePress = async () => {
  await gPromptAsync();  // ✅ Sin useProxy
};

  // --- Facebook (access_token) ---
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_FB_APP_ID || "",
    scopes: ["profile", "email"], 
    redirectUri: redirectUri,
  });

  useEffect(() => {
    if (fbResponse?.type === "success") {
      // TS no conoce 'authentication', así que hacemos un cast a any
      const accessToken = (fbResponse as any)?.authentication?.accessToken;
      if (accessToken) {
        handleFacebookWithToken(accessToken);
      }
    }
  }, [fbResponse]);

  const onFacebookPress = async () => {
    await gPromptAsync();  // ✅ Sin useProxy
  }

  // ---------------- Email / password ----------------
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    try {
      const data = await post("/auth/login", { email, password }); // { token, user }
      // TODO: guarda token si lo necesitas y navega
      // await AsyncStorage.setItem('token', data.token);
      Alert.alert("Éxito", `Bienvenido, ${data.user?.name ?? ""}`);
      router.replace("./(tabs)");
    } catch (err: any) {
      console.error("LOGIN ERROR:", err?.message || err);
      Alert.alert("Error", err?.message || "No se pudo conectar con el servidor");
    }
  };

  // ---------------- Google ----------------
  const handleGoogle = async () => {
    try {
      await gPromptAsync();
    } catch (e: any) {
      Alert.alert("Google", e?.message || "No se pudo abrir Google");
    }
  };

  const handleGoogleWithToken = async (idToken: string) => {
    try {
      const data = await post("/auth/google", { idToken }); // { token, user }
      Alert.alert("Éxito", `Hola, ${data.user?.name ?? "Google User"}`);
      router.replace("/");
    } catch (e: any) {
      Alert.alert("Google", e?.message || "Error al autenticar con Google");
    }
  };

  // ---------------- Facebook ----------------
  const handleFacebook = async () => {
    try {
      await fbPromptAsync();
    } catch (e: any) {
      Alert.alert("Facebook", e?.message || "No se pudo abrir Facebook");
    }
  };

  const handleFacebookWithToken = async (accessToken: string) => {
    try {
      const data = await post("/auth/facebook", { accessToken }); // { token, user }
      Alert.alert("Éxito", `Hola, ${data.user?.name ?? "Facebook User"}`);
      router.replace("/");
    } catch (e: any) {
      Alert.alert("Facebook", e?.message || "Error al autenticar con Facebook");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 30, paddingTop: 60, paddingBottom: 40 }}>
        <View style={{ marginBottom: 50, alignItems: "center" }}>
          <TouchableOpacity style={{ alignSelf: "flex-start", marginBottom: 20 }} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
            <Image
              source={require("../assets/images/icom.png")}
              style={{ width: 40, height: 40, marginRight: 10 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 28, fontWeight: "bold", color: "#667eea" }}>OutfitLab</Text>
          </View>

          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 10, textAlign: "center" }}>Bienvenido de nuevo</Text>
          <Text style={{ fontSize: 16, color: "#666", textAlign: "center" }}>Inicia sesión en tu cuenta</Text>
        </View>

        <View style={{ marginBottom: 30 }}>
          {/* Email */}
          <View style={formStyles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={formStyles.inputIcon} />
            <TextInput
              style={formStyles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={formStyles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={formStyles.inputIcon} />
            <TextInput
              style={formStyles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={formStyles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={formStyles.forgotPassword}>
            <Text style={formStyles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={formStyles.button} onPress={handleLogin}>
            <Text style={formStyles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>

          {/* Social */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 25 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: "#ddd" }} />
            <Text style={{ marginHorizontal: 15, color: "#666", fontSize: 14 }}>o continúa con</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "#ddd" }} />
          </View>

          <TouchableOpacity
            style={[formStyles.socialButton, formStyles.googleButton]}
            onPress={handleGoogle}
            disabled={!gRequest}
          >
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={formStyles.socialButtonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[formStyles.socialButton, formStyles.facebookButton]}
            onPress={handleFacebook}
            disabled={!fbRequest}
          >
            <Ionicons name="logo-facebook" size={20} color="#4267B2" />
            <Text style={formStyles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: "auto" }}>
          <Text style={{ color: "#666", fontSize: 14 }}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={{ color: "#667eea", fontSize: 14, fontWeight: "600" }}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


