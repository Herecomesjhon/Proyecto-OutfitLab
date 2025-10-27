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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";

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
    await gPromptAsync();  // ✅ Sin useProxy
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
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Regístrate para comenzar</Text>
        </View>

        <View style={styles.form}>
          {/* Nombre */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor="#999"
              value={formData.nombre}
              onChangeText={(t) => handleChange("nombre", t)}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              value={formData.email}
              onChangeText={(t) => handleChange("email", t)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={formData.password}
              onChangeText={(t) => handleChange("password", t)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#999"
              value={formData.confirmPassword}
              onChangeText={(t) => handleChange("confirmPassword", t)}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              Al registrarte, aceptas nuestros <Text style={styles.termsLink}>Términos de servicio</Text> y{" "}
              <Text style={styles.termsLink}>Política de privacidad</Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Crear cuenta</Text>
          </TouchableOpacity>

          {/* Social */}
          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>o regístrate con</Text>
            <View style={styles.separatorLine} />
          </View>

          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            disabled={!gRequest}
            onPress={() => gPromptAsync()}
          >
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, styles.facebookButton]}
            disabled={!fbRequest}
            onPress={() => fbPromptAsync()}
          >
            <Ionicons name="logo-facebook" size={20} color="#4267B2" />
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.footerLink}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 30, paddingTop: 60, paddingBottom: 40 },
  header: { marginBottom: 40 },
  backButton: { alignSelf: "flex-start", marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#666" },
  form: { marginBottom: 30 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, color: "#333" },
  eyeIcon: { padding: 5 },
  termsContainer: { marginBottom: 25 },
  termsText: { fontSize: 12, color: "#666", textAlign: "center", lineHeight: 16 },
  termsLink: { color: "#667eea", fontWeight: "500" },
  registerButton: {
    backgroundColor: "#667eea",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 25,
  },
  registerButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  separator: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  separatorLine: { flex: 1, height: 1, backgroundColor: "#ddd" },
  separatorText: { marginHorizontal: 15, color: "#666", fontSize: 14 },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  googleButton: { backgroundColor: "#F5E5E5" },
  facebookButton: { backgroundColor: "#E6ECF7" },
  socialButtonText: { marginLeft: 10, fontSize: 16, fontWeight: "500", color: "#333" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: "auto" },
  footerText: { color: "#666", fontSize: 14 },
  footerLink: { color: "#667eea", fontSize: 14, fontWeight: "600" },
});
