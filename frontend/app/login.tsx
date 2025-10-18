import { post } from "../src/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
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
import axios from 'axios';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        'http://192.168.0.100:3000/auth/login',   //poner su IP de su compuu
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('LOGIN OK:', res.status, res.data);
      // ...seguir flujo
    } catch (err: any) {
      console.error('LOGIN ERROR:', err?.message || err);
      if (err?.response) console.log('status:', err.response.status, 'data:', err.response.data);
      alert('No se pudo conectar con el servidor');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image source={require("../assets/images/icom.png")} style={styles.logo} resizeMode="contain" />
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
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
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

          <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
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
  loginButton: { backgroundColor: "#667eea", paddingVertical: 16, borderRadius: 12, alignItems: "center", marginBottom: 25 },
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
