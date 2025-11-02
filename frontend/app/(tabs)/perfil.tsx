import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import profileStyles from '../../src/styles/profile';
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

export default function ProfileScreen() {
  const [user, setUser] = useState({
    name: "Usuario",
    email: "usuario@example.com",
    prendas: 0,
    outfits: 0
  });

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      router.replace("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
  <ScrollView style={profileStyles.container}>
      {/* Header con foto de perfil */}
    <View style={profileStyles.profileImageContainer}>
    <View style={profileStyles.avatarPlaceholder}>
      <Ionicons name="person" size={40} color="#666" />
    </View>
    <TouchableOpacity style={profileStyles.editImageButton}>
      <Ionicons name="camera" size={20} color="#fff" />
    </TouchableOpacity>
    </View>

      {/* Estadísticas */}
      <View style={profileStyles.statsContainer}>
        <View style={profileStyles.statItem}>
          <Text style={profileStyles.statNumber}>{user.prendas}</Text>
          <Text style={profileStyles.statLabel}>Prendas</Text>
        </View>
        <View style={[profileStyles.statItem, profileStyles.statBorder]}>
          <Text style={profileStyles.statNumber}>{user.outfits}</Text>
          <Text style={profileStyles.statLabel}>Outfits</Text>
        </View>
      </View>

      {/* Menú de opciones */}
      <View style={profileStyles.menuContainer}>
        <TouchableOpacity style={profileStyles.menuItem}>
          <View style={profileStyles.menuItemContent}>
            <Ionicons name="person-outline" size={24} color="#333" />
            <Text style={profileStyles.menuItemText}>Editar Perfil</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={profileStyles.menuItem}>
          <View style={profileStyles.menuItemContent}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
            <Text style={profileStyles.menuItemText}>Notificaciones</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={profileStyles.menuItem}>
          <View style={profileStyles.menuItemContent}>
            <Ionicons name="lock-closed-outline" size={24} color="#333" />
            <Text style={profileStyles.menuItemText}>Privacidad</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={profileStyles.menuItem}>
          <View style={profileStyles.menuItemContent}>
            <Ionicons name="help-circle-outline" size={24} color="#333" />
            <Text style={profileStyles.menuItemText}>Ayuda y Soporte</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={profileStyles.menuItem} onPress={handleLogout}>
          <View style={profileStyles.menuItemContent}>
            <Ionicons name="log-out-outline" size={24} color="#ff4444" />
            <Text style={[profileStyles.menuItemText, { color: "#ff4444" }]}>Cerrar Sesión</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

