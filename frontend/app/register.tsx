//register.tsx
import { post } from "../src/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
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

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const redirectUri = __DEV__ 
    ? "https://auth.expo.dev/@pandemuerttoo/outfit-lab"
    : AuthSession.makeRedirectUri({ scheme: "outfitlab" });
    console.log("redirectUri ->", redirectUri);

  // ---------------- Google (id_token) ----------------
  const [gRequest, gResponse, gPromptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "",
    scopes: ["profile", "email"], 
    redirectUri: redirectUri,
  });

  const handleGoogleWithToken = async (id_token: string) => {
    try {
      const data = await post("/auth/google", { id_token });
      if (data?.token || data?.success) {
        Alert.alert("¡Listo!", "Registro/ingreso con Google exitoso");
        // si quieres llevarlo directo a tabs:
        // router.replace("/(tabs)");
        router.replace("/login");
      } else {
        Alert.alert("Error", data?.error || "No se pudo registrar con Google");
      }
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Fallo Google");
    }
  };

  useEffect(() => {
    if (gResponse?.type === "success" && (gResponse as any)?.params?.id_token) {
      handleGoogleWithToken((gResponse as any).params.id_token);
    }
  }, [gResponse]);

  const onGooglePress = async () => {
    await gPromptAsync();  // ✅ Sin useProxy
  };

  // ---------------- Facebook (access_token) ----------------
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_FB_APP_ID || "",
    scopes: ["profile", "email"], 
    redirectUri: redirectUri,
  });

  const handleFacebookWithToken = async (access_token: string) => {
    try {
      const data = await post("/auth/facebook", { access_token });
      if (data?.token || data?.success) {
        Alert.alert("¡Listo!", "Registro/ingreso con Facebook exitoso");
        // router.replace("/(tabs)");
        router.replace("/login");
      } else {
        Alert.alert("Error", data?.error || "No se pudo registrar con Facebook");
      }
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Fallo Facebook");
    }
  };

  useEffect(() => {
    if (fbResponse?.type === "success") {
      // 👇 Expo no tipa 'authentication' correctamente, usamos cast
      const accessToken = (fbResponse as any)?.authentication?.accessToken;
      if (accessToken) handleFacebookWithToken(accessToken);
    }
  }, [fbResponse]);

  const onFacebookPress = async () => {
    await gPromptAsync();  //  Sin useProxy
  };

  // ---------------- Email / Password ----------------
  const handleRegister = async () => {
    if (!formData.nombre || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    if (formData.password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const data = await post("/auth/register", {
        email: formData.email,
        password: formData.password,
        name: formData.nombre,
      });

      if (data?.success) {
        Alert.alert("Éxito", "Cuenta creada exitosamente");
        router.push("/login");
      } else {
        Alert.alert("Error", data?.error || "Error al crear la cuenta");
      }
    } catch (err: any) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 30, paddingTop: 60, paddingBottom: 40 }}>
        <View style={{ marginBottom: 40 }}>
          <TouchableOpacity style={{ alignSelf: "flex-start", marginBottom: 20 }} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={{ fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 10 }}>Crear cuenta</Text>
          <Text style={{ fontSize: 16, color: "#666" }}>Regístrate para comenzar</Text>
        </View>

        <View style={{ marginBottom: 30 }}>
          {/* Nombre */}
          <View style={formStyles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={formStyles.inputIcon} />
            <TextInput
              style={formStyles.input}
              placeholder="Nombre completo"
              placeholderTextColor="#999"
              value={formData.nombre}
              onChangeText={(t) => handleChange("nombre", t)}
            />
          </View>

          {/* Email */}
          <View style={formStyles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={formStyles.inputIcon} />
            <TextInput
              style={formStyles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              value={formData.email}
              onChangeText={(t) => handleChange("email", t)}
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
              value={formData.password}
              onChangeText={(t) => handleChange("password", t)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={formStyles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={formStyles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={formStyles.inputIcon} />
            <TextInput
              style={formStyles.input}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#999"
              value={formData.confirmPassword}
              onChangeText={(t) => handleChange("confirmPassword", t)}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={formStyles.eyeIcon}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 25 }}>
            <Text style={{ fontSize: 12, color: "#666", textAlign: "center", lineHeight: 16 }}>
              Al registrarte, aceptas nuestros <Text style={{ color: "#667eea", fontWeight: "500" }}>Términos de servicio</Text> y{' '}
              <Text style={{ color: "#667eea", fontWeight: "500" }}>Política de privacidad</Text>
            </Text>
          </View>

          <TouchableOpacity style={formStyles.button} onPress={handleRegister}>
            <Text style={formStyles.buttonText}>Crear cuenta</Text>
          </TouchableOpacity>

          {/* Social */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 25 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: "#ddd" }} />
            <Text style={{ marginHorizontal: 15, color: "#666", fontSize: 14 }}>o regístrate con</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "#ddd" }} />
          </View>

          <TouchableOpacity
            style={[formStyles.socialButton, formStyles.googleButton]}
            disabled={!gRequest}
            onPress={() => gPromptAsync()}
          >
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={formStyles.socialButtonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[formStyles.socialButton, formStyles.facebookButton]}
            disabled={!fbRequest}
            onPress={() => fbPromptAsync()}
          >
            <Ionicons name="logo-facebook" size={20} color="#4267B2" />
            <Text style={formStyles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: "auto" }}>
          <Text style={{ color: "#666", fontSize: 14 }}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}> 
            <Text style={{ color: "#667eea", fontSize: 14, fontWeight: "600" }}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


