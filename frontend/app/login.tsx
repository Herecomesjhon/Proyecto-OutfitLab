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
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/icom.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appTitle}>OutfitLab</Text>
          </View>

          <Text style={styles.title}>Bienvenido de nuevo</Text>
          <Text style={styles.subtitle}>Inicia sesión en tu cuenta</Text>
        </View>

        <View style={styles.form}>
          {/* Email */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
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
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>

          {/* Social */}
          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>o continúa con</Text>
            <View style={styles.separatorLine} />
          </View>

          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            onPress={handleGoogle}
            disabled={!gRequest}
          >
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, styles.facebookButton]}
            onPress={handleFacebook}
            disabled={!fbRequest}
          >
            <Ionicons name="logo-facebook" size={20} color="#4267B2" />
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.footerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 30, paddingTop: 60, paddingBottom: 40 },
  header: { marginBottom: 50, alignItems: "center" },
  backButton: { alignSelf: "flex-start", marginBottom: 20 },
  logoContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  logo: { width: 40, height: 40, marginRight: 10 },
  appTitle: { fontSize: 28, fontWeight: "bold", color: "#667eea" },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#666", textAlign: "center" },
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
  forgotPassword: { alignSelf: "flex-end", marginBottom: 30 },
  forgotPasswordText: { color: "#667eea", fontSize: 14 },
  loginButton: {
    backgroundColor: "#667eea",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 25,
  },
  loginButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
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
