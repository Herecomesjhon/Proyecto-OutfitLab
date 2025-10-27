import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function ClosetScreen() {
  const [activeTab, setActiveTab] = useState("todas");
  const [clothes, setClothes] = useState([]);

  // Categorías de ropa
  const categories = [
    { id: "todas", name: "Todas", icon: "grid-outline" },
    { id: "camisetas", name: "Camisetas", icon: "shirt-outline" },
    { id: "pantalones", name: "Pantalones", icon: "cut-outline" },
    { id: "zapatos", name: "Zapatos", icon: "footsteps-outline" },
    { id: "accesorios", name: "Accesorios", icon: "watch-outline" },
  ];

  return (
    <View style={styles.container}>
      {/* Header con búsqueda */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <Text style={styles.searchPlaceholder}>Buscar prenda...</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Categorías */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              activeTab === category.id && styles.categoryButtonActive,
            ]}
            onPress={() => setActiveTab(category.id)}
          >
            <Ionicons
              name={category.icon as any}
              size={20}
              color={activeTab === category.id ? "#fff" : "#666"}
            />
            <Text
              style={[
                styles.categoryText,
                activeTab === category.id && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Grid de prendas */}
      <ScrollView style={styles.clothesContainer}>
        {clothes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="shirt-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateTitle}>Tu armario está vacío</Text>
            <Text style={styles.emptyStateText}>
              Comienza a agregar tus prendas favoritas
            </Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Agregar prenda</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.clothesGrid}>
            {/* Aquí irían las prendas en un grid */}
          </View>
        )}
      </ScrollView>

      {/* Botón flotante para agregar */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  searchPlaceholder: {
    marginLeft: 10,
    color: "#666",
    fontSize: 16,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  categoriesContainer: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingLeft: 15,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: "#667eea",
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#666",
  },
  categoryTextActive: {
    color: "#fff",
  },
  clothesContainer: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#667eea",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  clothesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#667eea",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
