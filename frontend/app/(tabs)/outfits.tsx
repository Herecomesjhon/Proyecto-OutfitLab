import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function OutfitsScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mis Outfits</Text>
          <Text style={styles.subtitle}>Organiza y planifica tus conjuntos</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Secciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Esta semana</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.outfitsRow}
        >
          {/* Outfit Card */}
          <TouchableOpacity style={styles.outfitCard}>
            <View style={styles.outfitImageContainer}>
              <Image
                source={require("../../assets/images/outfit-placeholder.png")}
                style={styles.outfitImage}
              />
              <View style={styles.dateTag}>
                <Text style={styles.dateText}>Lun</Text>
              </View>
            </View>
            <Text style={styles.outfitName}>Casual Office</Text>
          </TouchableOpacity>

          {/* Add More Card */}
          <TouchableOpacity style={[styles.outfitCard, styles.addMoreCard]}>
            <Ionicons name="add-circle-outline" size={40} color="#667eea" />
            <Text style={styles.addMoreText}>Planificar outfit</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Colecciones */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis colecciones</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.collectionsGrid}>
          <TouchableOpacity style={styles.collectionCard}>
            <View style={styles.collectionImageContainer}>
              <Image
                source={require("../../assets/images/outfit-placeholder.png")}
                style={styles.collectionImage}
              />
            </View>
            <Text style={styles.collectionName}>Trabajo</Text>
            <Text style={styles.collectionCount}>12 outfits</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.collectionCard}>
            <View style={styles.collectionImageContainer}>
              <Image
                source={require("../../assets/images/outfit-placeholder.png")}
                style={styles.collectionImage}
              />
            </View>
            <Text style={styles.collectionName}>Casual</Text>
            <Text style={styles.collectionCount}>8 outfits</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.collectionCard, styles.addCollection]}>
            <View style={[styles.collectionImageContainer, styles.addCollectionBox]}>
              <Ionicons name="add" size={40} color="#667eea" />
            </View>
            <Text style={styles.addCollectionText}>Nueva colección</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Favoritos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favoritos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.outfitsRow}
        >
          <TouchableOpacity style={styles.outfitCard}>
            <View style={styles.outfitImageContainer}>
              <Image
                source={require("../../assets/images/outfit-placeholder.png")}
                style={styles.outfitImage}
              />
              <TouchableOpacity style={styles.favoriteButton}>
                <Ionicons name="heart" size={16} color="#ff4757" />
              </TouchableOpacity>
            </View>
            <Text style={styles.outfitName}>Weekend Vibes</Text>
          </TouchableOpacity>
        </ScrollView>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: "#667eea",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  seeAllText: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "500",
  },
  outfitsRow: {
    paddingLeft: 20,
  },
  outfitCard: {
    marginRight: 15,
    width: 160,
  },
  outfitImageContainer: {
    width: 160,
    height: 200,
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
    marginBottom: 8,
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
    height: "100%",
    backgroundColor: "#f5f5f5",
  },
  dateTag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  outfitName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  addMoreCard: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9ff",
  },
  addMoreText: {
    marginTop: 8,
    fontSize: 14,
    color: "#667eea",
    fontWeight: "500",
  },
  collectionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
  },
  collectionCard: {
    width: "30%",
    marginHorizontal: "1.5%",
    marginBottom: 20,
  },
  collectionImageContainer: {
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  collectionImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
  },
  collectionName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  collectionCount: {
    fontSize: 12,
    color: "#666",
  },
  addCollection: {
    justifyContent: "center",
    alignItems: "center",
  },
  addCollectionBox: {
    backgroundColor: "#f8f9ff",
    justifyContent: "center",
    alignItems: "center",
  },
  addCollectionText: {
    fontSize: 14,
    color: "#667eea",
    fontWeight: "500",
    textAlign: "center",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});