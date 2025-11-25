import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function DashboardScreen() {
  return ( 
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Buenos días! 👋</Text>
          <Text style={styles.subtitle}>¿Qué outfit usarás hoy?</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Weather Card */}
      <View style={styles.weatherCard}>
        <View style={styles.weatherInfo}>
          <Ionicons name="partly-sunny-outline" size={32} color="#667eea" />
          <View style={styles.weatherDetails}>
            <Text style={styles.weatherTemp}>22°C</Text>
            <Text style={styles.weatherDesc}>Soleado</Text>
          </View>
        </View>
        <Text style={styles.weatherRecommendation}>
          Perfecto para looks ligeros y colores claros
        </Text>
      </View>

      {/* Quick Recommendation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recomendación del día</Text>
        <View style={styles.recommendationCard}>
          <View style={styles.outfitPreview}>
            <View style={styles.outfitItem} />
            <View style={styles.outfitItem} />
            <View style={styles.outfitItem} />
          </View>
          <View style={styles.recommendationInfo}>
            <Text style={styles.outfitTitle}>Look Casual Elegante</Text>
            <Text style={styles.outfitDesc}>Perfecto para el día a día</Text>
            <TouchableOpacity style={styles.useOutfitButton}>
              <Text style={styles.useOutfitText}>Usar este outfit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximos eventos</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.eventCard}>
          <View style={[styles.eventIcon, { backgroundColor: "#ff6b6b" }]}>
            <Ionicons name="briefcase-outline" size={20} color="#fff" />
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>Reunión de trabajo</Text>
            <Text style={styles.eventTime}>Hoy, 3:00 PM</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones rápidas</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/armario")}   
          >
            <View style={[styles.actionIcon, { backgroundColor: "#f8f9ff" }]}>
              <Ionicons name="add-circle-outline" size={24} color="#667eea" />
            </View>
            <Text style={styles.actionText}>Agregar prenda</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: "#f0fff4" }]}>
              <Ionicons name="calendar-outline" size={24} color="#51cf66" />
            </View>
            <Text style={styles.actionText}>Mi calendario</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: "#fff9f0" }]}>
              <Ionicons name="trending-up-outline" size={24} color="#ff922b" />
            </View>
            <Text style={styles.actionText}>Tendencias</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
  },
  weatherCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  weatherInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  weatherDetails: {
    marginLeft: 12,
  },
  weatherTemp: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  weatherDesc: {
    fontSize: 14,
    color: "#666",
  },
  weatherRecommendation: {
    fontSize: 14,
    color: "#667eea",
    fontStyle: "italic",
  },
  section: {
    marginVertical: 8,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "500",
  },
  recommendationCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  outfitPreview: {
    flexDirection: "column",
    marginRight: 16,
  },
  outfitItem: {
    width: 40,
    height: 40,
    backgroundColor: "#e9ecef",
    borderRadius: 8,
    marginBottom: 4,
  },
  recommendationInfo: {
    flex: 1,
  },
  outfitTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  outfitDesc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  useOutfitButton: {
    backgroundColor: "#667eea",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  useOutfitText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: "#666",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
});