import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 30;

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState("tendencias");

  const categories = [
    { id: "tendencias", name: "Tendencias" },
    { id: "casual", name: "Casual" },
    { id: "formal", name: "Formal" },
    { id: "deportivo", name: "Deportivo" },
    { id: "fiesta", name: "Fiesta" },
  ];

  // Mock data para outfits
  const outfits = [
    {
      id: 1,
      image: require("../../assets/images/icon.png"),
      title: "Casual Chic",
      likes: 245,
      saves: 123,
    },
    {
      id: 2,
      image: require("../../assets/images/icon.png"),
      title: "Oficina Moderna",
      likes: 189,
      saves: 87,
    },
    // Más outfits...
  ];

  return (
    <View style={styles.container}>
      {/* Header con búsqueda */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <Text style={styles.searchPlaceholder}>Buscar inspiración...</Text>
        </View>
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

      {/* Grid de outfits */}
      <ScrollView style={styles.outfitsContainer}>
        <View style={styles.outfitsGrid}>
          {outfits.map((outfit) => (
            <TouchableOpacity key={outfit.id} style={styles.outfitCard}>
              <Image source={outfit.image} style={styles.outfitImage} />
              <View style={styles.outfitInfo}>
                <Text style={styles.outfitTitle}>{outfit.title}</Text>
                <View style={styles.outfitStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="heart-outline" size={16} color="#666" />
                    <Text style={styles.statText}>{outfit.likes}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="bookmark-outline" size={16} color="#666" />
                    <Text style={styles.statText}>{outfit.saves}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchPlaceholder: {
    marginLeft: 10,
    color: "#666",
    fontSize: 16,
  },
  categoriesContainer: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingLeft: 15,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: "#667eea",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
  },
  categoryTextActive: {
    color: "#fff",
  },
  outfitsContainer: {
    flex: 1,
    padding: 20,
  },
  outfitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  outfitCard: {
    width: CARD_WIDTH,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  outfitImage: {
    width: "100%",
    height: CARD_WIDTH * 1.2,
    backgroundColor: "#f5f5f5",
  },
  outfitInfo: {
    padding: 12,
  },
  outfitTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  outfitStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#666",
  },
});
