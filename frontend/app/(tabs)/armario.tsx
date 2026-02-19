//frontend/app/(tabs)/armario.tsx
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, FlatList } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useState, useEffect } from "react";
// import * as ImagePicker from "expo-image-picker";

// // Ajusta estas rutas según tu estructura real:
// import { API_URL } from "../../src/api";            // desde app/(tabs) → ../../src/api
// import { useAuth } from "../../src/contexts/auth";         // si tu contexto está en app/contexts/auth.tsx

// type ClothingItem = {
//   id: number;
//   imageUrl: string;   // el backend devolverá URL completa http://IP:3000/uploads/xxx.jpg
//   type?: string;
//   color?: string;
// };

// export default function ArmarioScreen() {
//   const [activeTab, setActiveTab] = useState("todas");
//   const [clothes, setClothes] = useState<ClothingItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const { user } = useAuth(); // Debe tener user.id

//   const categories = [
//     { id: "todas", name: "Todas", icon: "grid-outline" },
//     { id: "camisetas", name: "Camisetas", icon: "shirt-outline" },
//     { id: "pantalones", name: "Pantalones", icon: "cut-outline" },
//     { id: "zapatos", name: "Zapatos", icon: "footsteps-outline" },
//     { id: "accesorios", name: "Accesorios", icon: "watch-outline" },
//   ];

//   // Pon esto ARRIBA del componente:
//   const TEST_USER_ID = 'cmhhzpave0000bguh98qm8z4l'; // ← el que ya probaste

//   function getSafeUserId(user: any) {
//     return user?.id ?? TEST_USER_ID; // mientras arreglamos el Auth
//   }

//   const loadUserClothes = async () => {
//     const uid = getSafeUserId(user);
//     if (!uid) return;
//     setLoading(true);
//     try {
//       const r = await fetch(`${API_URL}/api/clothes/user/${uid}`);
//       const data = await r.json();
//       setClothes(Array.isArray(data) ? data : []);
//     } catch (e) {
//       console.error(e);
//       Alert.alert("Error", "No se pudieron cargar las prendas");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUserClothes();
//   }, [user?.id]);

//   const takePhoto = async () => {
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permiso denegado", "Necesitas permitir el acceso a la cámara");
//       return;
//     }
//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.8,
//     });
//     if (!result.canceled) await uploadImage(result.assets[0].uri);
//   };

//   const pickFromGallery = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permiso denegado", "Necesitas permitir el acceso a la galería");
//       return;
//     }
//     const result = await ImagePicker.launchImageLibraryAsync({
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.8,
//     });
//     if (!result.canceled) await uploadImage(result.assets[0].uri);
//   };

//   const uploadImage = async (uri: string) => {
//   console.log('AUTH user:', user);
//   const uid = getSafeUserId(user);
//   //const TEST_USER_ID = 'cmhhzpave0000bguh98qm8z4l';
//   //const safeUserId = user?.id ?? TEST_USER_ID;

//   if (!uid) return;
//   setUploading(true);
//   try {
//     const form = new FormData();
//     form.append('image', {
//       uri,
//       type: 'image/jpeg',
//       name: `clothing_${Date.now()}.jpg`,
//     } as any);
//     form.append('userId', String(uid));

//     console.log('POST →', `${API_URL}/api/clothes/upload`, 'uid:', uid);
//     const resp = await fetch(`${API_URL}/api/clothes/upload`, { method: 'POST', body: form });
//     const created = await resp.json();
//     console.log('CREATED:', created);

//     if (!resp.ok) throw new Error(created?.error || 'Upload failed');

//     // 👇 Optimistic update: lo mostramos al instante
//     setClothes(prev => [created, ...prev]);
    

//     Alert.alert('Éxito', 'Prenda subida correctamente');
//     loadUserClothes();
//   } catch (e) {
//     console.error('upload error:', e);
//     Alert.alert('Error', 'No se pudo subir la imagen');
//   } finally {
//     setUploading(false);
//   }
// };


//   const showUploadOptions = () => {
//     Alert.alert("Agregar prenda", "Selecciona una opción", [
//       { text: "Tomar foto", onPress: takePhoto },
//       { text: "Elegir de galería", onPress: pickFromGallery },
//       { text: "Cancelar", style: "cancel" },
//     ]);
//   };

//   const renderClothesGrid = () => {
//     if (loading) {
//       return (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" />
//           <Text style={styles.loadingText}>Cargando prendas...</Text>
//         </View>
//       );
//     }
//     if (clothes.length === 0) {
//       return (
//         <View style={styles.emptyState}>
//           <Ionicons name="shirt-outline" size={64} color="#ccc" />
//           <Text style={styles.emptyStateTitle}>Tu armario está vacío</Text>
//           <Text style={styles.emptyStateText}>Comienza a agregar tus prendas favoritas</Text>
//           <TouchableOpacity style={styles.addButton} onPress={showUploadOptions} disabled={uploading}>
//             {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.addButtonText}>Agregar prenda</Text>}
//           </TouchableOpacity>
//         </View>
//       );
//     }
//     return (
//       <FlatList
//         data={clothes}
//         numColumns={2}
//         contentContainerStyle={styles.clothesGrid}
//         keyExtractor={(item, idx) => item.id?.toString() ?? String(idx)}
//         renderItem={({ item }) => (
//           <View style={styles.clothingItem}>
//             <Image
//               source={{ uri: item.imageUrl.startsWith('http') ? item.imageUrl : `${API_URL}${item.imageUrl}` }}
//               style={styles.clothingImage}
//               resizeMode="cover"
//             />
//           </View>
//         )}
//       />
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.searchContainer}>
//           <Ionicons name="search-outline" size={20} color="#666" />
//           <Text style={styles.searchPlaceholder}>Buscar prenda...</Text>
//         </View>
//         <TouchableOpacity style={styles.filterButton}>
//           <Ionicons name="options-outline" size={24} color="#333" />
//         </TouchableOpacity>
//       </View>

//       {/* Categorías */}
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
//         {categories.map((c) => (
//           <TouchableOpacity
//             key={c.id}
//             style={[styles.categoryButton, activeTab === c.id && styles.categoryButtonActive]}
//             onPress={() => setActiveTab(c.id)}
//           >
//             <Ionicons name={c.icon as any} size={20} color={activeTab === c.id ? "#fff" : "#666"} />
//             <Text style={[styles.categoryText, activeTab === c.id && styles.categoryTextActive]}>{c.name}</Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {/* Grid */}
//       {/*<ScrollView style={styles.clothesContainer}>{renderClothesGrid()}</ScrollView>*/}

//       {/* 👇 FlatList como único scroll vertical */}
//       <FlatList
//         style={{ flex: 1 }}
//         contentContainerStyle={styles.gridContent}
//         data={clothes}
//         numColumns={2}
//         keyExtractor={(item, idx) => item.id?.toString() ?? String(idx)}
//         columnWrapperStyle={styles.gridRow}
//         renderItem={({ item }) => (
//           <View style={styles.clothingItem}>
//             <Image source={{ uri: item.imageUrl }} style={styles.clothingImage} resizeMode="cover" />
//           </View>
//         )}
//         ListEmptyComponent={
//           loading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" />
//               <Text style={styles.loadingText}>Cargando prendas...</Text>
//             </View>
//           ) : (
//             <View style={styles.emptyState}>
//               <Ionicons name="shirt-outline" size={64} color="#ccc" />
//               <Text style={styles.emptyStateTitle}>Tu armario está vacío</Text>
//               <Text style={styles.emptyStateText}>Comienza a agregar tus prendas favoritas</Text>
//               <TouchableOpacity style={styles.addButton} onPress={showUploadOptions} disabled={uploading}>
//                 {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.addButtonText}>Agregar prenda</Text>}
//               </TouchableOpacity>
//             </View>
//           )
//         }
//       />

//       {/* FAB */}
//       <TouchableOpacity style={styles.fab} onPress={showUploadOptions} disabled={uploading}>
//         {uploading ? <ActivityIndicator color="#fff" /> : <Ionicons name="add" size={24} color="#fff" />}
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f8f9fa" },
//   header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: "#fff" },
//   searchContainer: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#f5f5f5", paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginRight: 10 },
//   searchPlaceholder: { marginLeft: 10, color: "#666", fontSize: 16 },
//   filterButton: { width: 44, height: 44, backgroundColor: "#f5f5f5", justifyContent: "center", alignItems: "center", borderRadius: 10 },
//   categoriesContainer: { backgroundColor: "#fff", paddingVertical: 15, paddingLeft: 15 },
//   categoryButton: { flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: "#f5f5f5", marginRight: 10 },
//   categoryButtonActive: { backgroundColor: "#667eea" },
//   categoryText: { marginLeft: 6, fontSize: 14, color: "#666" },
//   categoryTextActive: { color: "#fff" },
//   clothesContainer: { flex: 1, padding: 20 },
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 60 },
//   loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
//   emptyState: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 60 },
//   emptyStateTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginTop: 20, marginBottom: 10 },
//   emptyStateText: { fontSize: 16, color: "#666", marginBottom: 30, textAlign: "center" },
//   addButton: { backgroundColor: "#667eea", paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25, minWidth: 150, alignItems: "center" },
//   addButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
//   clothesGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
//   clothingItem: { width: "48%", aspectRatio: 1, marginBottom: 15, borderRadius: 12, overflow: "hidden", backgroundColor: "#fff" },
//   clothingImage: { width: "100%", height: "100%" },
//   fab: { position: "absolute", right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: "#667eea", justifyContent: "center", alignItems: "center" },
//   gridContent: { padding: 20, paddingBottom: 100 }, // deja espacio para el FAB
//   gridRow: { justifyContent: "space-between", marginBottom: 15 },
// });

// app/(tabs)/armario.tsx
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";

import { API_URL } from "../../src/api";
import { useAuth } from "../../src/contexts/auth";

type ClothingItem = {
  id: number;
  imageUrl: string;
  type?: string;
  color?: string;
  category?: string | null;
};

// Mapeo de categorías UI → categorías de la BD
const CATEGORY_FILTERS = {
  todas: null as string[] | null,
  camisetas: [
    "camiseta",
    "camisa",
    "blusa",
    "top",
    "playera",
    "sueter",
    "sudadera",
    "cardigan",
  ],
  pantalones: ["pantalon", "jeans", "shorts", "falda", "leggins"],
  zapatos: ["calzado", "tenis", "bota", "sandalia", "tacones", "botín", "botin"],
  accesorios: [
    "bolso",
    "mochila",
    "sombrero",
    "gorra",
    "bufanda",
    "cinturon",
    "reloj",
    "lentes",
  ],
};

export default function ArmarioScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("todas");
  const [allClothes, setAllClothes] = useState<ClothingItem[]>([]);
  const [filteredClothes, setFilteredClothes] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const categories = [
    { id: "todas", name: "Todas", icon: "grid-outline" },
    { id: "camisetas", name: "Camisetas", icon: "shirt-outline" },
    { id: "pantalones", name: "Pantalones", icon: "cut-outline" },
    { id: "zapatos", name: "Zapatos", icon: "footsteps-outline" },
    { id: "accesorios", name: "Accesorios", icon: "watch-outline" },
  ];

  const loadUserClothes = async () => {
    if (!user?.id) {
      console.log("No hay user.id aún, no se cargan prendas");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/clothes/user/${user.id}`);
      const data = await r.json();
      const clothes = Array.isArray(data) ? data : [];
      setAllClothes(clothes);
      applyFilter(activeTab, clothes);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudieron cargar las prendas");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (
    categoryId: string,
    clothesList: ClothingItem[] = allClothes
  ) => {
    const allowedCategories =
      CATEGORY_FILTERS[categoryId as keyof typeof CATEGORY_FILTERS];

    if (!allowedCategories) {
      setFilteredClothes(clothesList);
    } else {
      const filtered = clothesList.filter((item) => {
        const cat = (item.category || "otro").toLowerCase();
        return allowedCategories.includes(cat);
      });
      setFilteredClothes(filtered);
    }
  };

  const handleTabChange = (categoryId: string) => {
    setActiveTab(categoryId);
    applyFilter(categoryId);
  };

  useEffect(() => {
    loadUserClothes();
  }, [user?.id]);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitas permitir el acceso a la cámara"
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) await uploadImage(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitas permitir el acceso a la galería"
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) await uploadImage(result.assets[0].uri);
  };

  const uploadImage = async (uri: string) => {
    if (!user?.id) {
      Alert.alert("Error", "Debes iniciar sesión para agregar prendas");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append(
        "image",
        {
          uri,
          type: "image/jpeg",
          name: `clothing_${Date.now()}.jpg`,
        } as any
      );
      form.append("userId", String(user.id));

      const resp = await fetch(`${API_URL}/api/clothes/upload`, {
        method: "POST",
        body: form,
      });
      const created = await resp.json();

      if (!resp.ok) throw new Error(created?.error || "Upload failed");

      const newList = [created.prenda || created, ...allClothes];
      setAllClothes(newList);
      applyFilter(activeTab, newList);

      Alert.alert(
        "Éxito",
        `Prenda clasificada como: ${
          created.classification?.category || "otro"
        }`
      );
    } catch (e) {
      console.error("upload error:", e);
      Alert.alert("Error", "No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const showUploadOptions = () => {
    Alert.alert("Agregar prenda", "Selecciona una opción", [
      { text: "Tomar foto", onPress: takePhoto },
      { text: "Elegir de galería", onPress: pickFromGallery },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const renderEmptyOrLoading = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Cargando prendas...</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyState}>
        <Ionicons name="shirt-outline" size={64} color="#ccc" />
        <Text style={styles.emptyStateTitle}>
          {activeTab === "todas"
            ? "Tu armario está vacío"
            : "No hay prendas en esta categoría"}
        </Text>
        <Text style={styles.emptyStateText}>
          {activeTab === "todas"
            ? "Comienza a agregar tus prendas favoritas"
            : "Prueba con otra categoría o agrega más prendas"}
        </Text>
        {activeTab === "todas" && (
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
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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
        {categories.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[
              styles.categoryButton,
              activeTab === c.id && styles.categoryButtonActive,
            ]}
            onPress={() => handleTabChange(c.id)}
          >
            <Ionicons
              name={c.icon as any}
              size={20}
              color={activeTab === c.id ? "#fff" : "#666"}
            />
            <Text
              style={[
                styles.categoryText,
                activeTab === c.id && styles.categoryTextActive,
              ]}
            >
              {c.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Grid */}
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={styles.gridContent}
        data={filteredClothes}
        numColumns={2}
        keyExtractor={(item, idx) => item.id?.toString() ?? String(idx)}
        columnWrapperStyle={
          filteredClothes.length > 0 ? styles.gridRow : undefined
        }
        renderItem={({ item }) => (
          <View style={styles.clothingItem}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.clothingImage}
              resizeMode="cover"
            />
            {item.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{item.category}</Text>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={renderEmptyOrLoading()}
      />

      {/* FAB */}
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
  container: { flex: 1, backgroundColor: "#f8f9fa" },
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
  searchPlaceholder: { marginLeft: 10, color: "#666", fontSize: 16 },
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
  categoryButtonActive: { backgroundColor: "#667eea" },
  categoryText: { marginLeft: 6, fontSize: 14, color: "#666" },
  categoryTextActive: { color: "#fff" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
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
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  gridContent: { padding: 20, paddingBottom: 100 },
  gridRow: { justifyContent: "space-between", marginBottom: 15 },
  clothingItem: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    position: "relative",
  },
  clothingImage: { width: "100%", height: "100%" },
  categoryBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(102, 126, 234, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
