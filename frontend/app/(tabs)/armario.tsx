import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ClothingItem {
  id: number;
  imageUrl: string;
  type?: string;
  color?: string;
}
import { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/auth';
import CategorizationModal from '../components/CategorizationModal';

export default function ClosetScreen() {
  const [activeTab, setActiveTab] = useState("todas");
  const [clothes, setClothes] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const { user } = useAuth(); // Hook para obtener usuario autenticado

  // Categorías de ropa
  const categories = [
    { id: "todas", name: "Todas", icon: "grid-outline" },
    { id: "camisetas", name: "Camisetas", icon: "shirt-outline" },
    { id: "pantalones", name: "Pantalones", icon: "cut-outline" },
    { id: "zapatos", name: "Zapatos", icon: "footsteps-outline" },
    { id: "accesorios", name: "Accesorios", icon: "watch-outline" },
  ];

  // Cargar prendas del usuario
  const loadUserClothes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/clothes/user/${user.id}`);
      const data = await response.json();
      setClothes(data);
    } catch (error) {
      console.error('Error cargando prendas:', error);
      Alert.alert('Error', 'No se pudieron cargar las prendas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserClothes();
  }, [user]);

  // Subir imagen desde cámara
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas permitir el acceso a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  };

  // Seleccionar imagen de galería
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas permitir el acceso a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  };

  // Subir imagen al servidor
  const uploadImage = async (uri: string) => {
    if (!user) return;

    setUploading(true);
    
    const formData = new FormData();
    formData.append('image', {
      uri,
      type: 'image/jpeg',
      name: `clothing_${Date.now()}.jpg`,
    } as any);
    formData.append('userId', user.id);

    try {
      const response = await fetch('http://localhost:3000/api/clothes/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Prenda subida correctamente');
        loadUserClothes(); // Recargar la lista
      } else {
        throw new Error('Error en la subida');
      }
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      Alert.alert('Error', 'No se pudo subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  // Mostrar opciones de subida
  const showUploadOptions = () => {
    Alert.alert(
      'Agregar prenda',
      'Selecciona una opción',
      [
        {
          text: 'Tomar foto',
          onPress: takePhoto,
        },
        {
          text: 'Elegir de galería',
          onPress: pickFromGallery,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  // Renderizar grid de prendas con lazy loading
  const renderClothesGrid = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Cargando prendas...</Text>
        </View>
      );
    }

    if (clothes.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="shirt-outline" size={64} color="#ccc" />
          <Text style={styles.emptyStateTitle}>Tu armario está vacío</Text>
          <Text style={styles.emptyStateText}>
            Comienza a agregar tus prendas favoritas
          </Text>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={showUploadOptions}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.addButtonText}>Agregar prenda</Text>
            )}
          </TouchableOpacity>
        </View>
      );
    }

return (
      <FlatList
        data={clothes}
        numColumns={2}
        contentContainerStyle={styles.clothesGrid}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.clothingItem}
            onPress={() => setSelectedItem(item)}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.clothingImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        onEndReached={() => {
          // Aquí puedes implementar paginación si el backend la soporta
          // loadMoreClothes();
        }}
        onEndReachedThreshold={0.5}
      />
    );
  };

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
        {renderClothesGrid()}
      </ScrollView>

      {/* Loading durante upload */}
      {uploading && (
        <View style={styles.uploadOverlay}>
          <View style={styles.uploadModal}>
            <ActivityIndicator size="large" color="#22bb9fff" />
            <Text style={styles.uploadText}>Subiendo prenda...</Text>
          </View>
        </View>
      )}

      {/* Botón flotante para agregar */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={showUploadOptions}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Ionicons name="add" size={24} color="#fff" />
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
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
    minWidth: 150,
    alignItems: "center",
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
  clothingItem: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  clothingImage: {
    width: "100%",
    height: "100%",
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
  uploadOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadModal: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
  },
  uploadText: {
    marginTop: 15,
    fontSize: 16,
    color: "#333",
  },
});