// app/(tabs)/outfits.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

import GenerateOutfitForm from "../components/GenerateOutfitForm";
import { post, get, API_URL } from "../../src/api";
import { useAuth } from "../../src/contexts/auth";

// ---------- Tipos ----------
interface OutfitFormData {
  occasion: string;
  dressCode: string;
  weather: string;
}

interface Prenda {
  id: number;
  imageUrl: string;
  type?: string | null;
  color?: string | null;
  category?: string | null;
  brand?: string | null;
}

interface GeneratedOutfit {
  id: number;
  name?: string | null;
  occasion: string;
  dressCode: string;
  weather: string;
  items: Prenda[];
}

interface OutfitItemDB {
  prenda: Prenda;
}

interface OutfitDB {
  id: string;
  name?: string | null;
  occasion?: string | null;
  dressCode?: string | null;
  weather?: string | null;
  photoUrl?: string | null;
  items: OutfitItemDB[];
}

// Para el modal: puede ser outfit generado o guardado
type SelectedOutfit =
  | { kind: "generated"; data: GeneratedOutfit }
  | { kind: "saved"; data: OutfitDB };

// ---------- Componente principal ----------
export default function OutfitsScreen() {
  const { user } = useAuth();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [generatedOutfits, setGeneratedOutfits] = useState<GeneratedOutfit[]>(
    []
  );
  const [selected, setSelected] = useState<SelectedOutfit | null>(null);
  const [showOutfitModal, setShowOutfitModal] = useState(false);

  const [savedOutfits, setSavedOutfits] = useState<OutfitDB[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Modal para pedir el título antes de publicar
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const [publishTargetOutfitId, setPublishTargetOutfitId] = useState<
    string | null
  >(null);
  const [publishTitle, setPublishTitle] = useState("");

  // ---------- Helpers ----------
  const getItemImageUrl = (item: { imageUrl?: string | null }) => {
    if (!item?.imageUrl) return null;
    if (item.imageUrl.startsWith("http")) return item.imageUrl;
    return `${API_URL}${item.imageUrl}`;
  };

  const getOutfitThumbnail = (o: OutfitDB): string | null => {
    // si tiene foto de outfit, úsala. Si no, la primera prenda
    if (o.photoUrl) {
      if (o.photoUrl.startsWith("http")) return o.photoUrl;
      return `${API_URL}${o.photoUrl}`;
    }
    const first = o.items?.[0]?.prenda;
    if (!first) return null;
    return getItemImageUrl(first);
  };

  const loadSavedOutfits = async () => {
    try {
      if (!user?.id) return;
      const response = await get(`/api/outfits/user/${user.id}`);
      setSavedOutfits(response.outfits || []);
    } catch (err) {
      console.error("Error cargando outfits guardados:", err);
    }
  };

  useEffect(() => {
    loadSavedOutfits();
  }, [user?.id]);

  const favoriteOutfits = useMemo(
    () => savedOutfits.filter((o) => favoriteIds.has(o.id)),
    [savedOutfits, favoriteIds]
  );

  const isFavorite = (id: string) => favoriteIds.has(id);

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // ---------- Generar outfit ----------
  const handleGenerateOutfit = async (data: OutfitFormData) => {
    try {
      setIsGenerating(true);

      const response = await post("/api/outfits/generate", {
        userId: user?.id,
        occasion: data.occasion,
        dressCode: data.dressCode,
        weather: data.weather,
      });

      setGeneratedOutfits(response.outfits || []);

      if (response.outfits?.[0]) {
        setSelected({ kind: "generated", data: response.outfits[0] });
        setShowOutfitModal(true);
      }

      Alert.alert("¡Outfit Generado!", "Tu outfit ha sido creado exitosamente");
    } catch (error: any) {
      console.error("❌ Error generando outfit:", error);
      const backendMessage =
        error?.response?.data?.message ||
        error?.message ||
        "No se pudo generar el outfit. Intenta de nuevo.";
      Alert.alert("Error", backendMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // ---------- Guardar outfit generado ----------
  const saveSelectedGeneratedOutfit = async () => {
    if (!selected || selected.kind !== "generated" || !user?.id) return;

    const selectedOutfit = selected.data;

    try {
      const itemIds = selectedOutfit.items.map((p) => p.id);
      await post("/api/outfits", {
        userId: user.id,
        name: selectedOutfit.name || "Outfit sugerido",
        occasion: selectedOutfit.occasion,
        dressCode: selectedOutfit.dressCode,
        weather: selectedOutfit.weather,
        itemIds,
      });

      Alert.alert("Guardado", "Tu outfit se guardó en Mis Outfits.");
      setShowOutfitModal(false);
      await loadSavedOutfits();
    } catch (error: any) {
      console.error("Error guardando outfit:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "No se pudo guardar el outfit."
      );
    }
  };

  // ---------- Cámara ----------
  const takePhotoAndUpdateOutfit = async (
    outfitId: string,
    publishToExplore: boolean,
    postTitle?: string
  ) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso requerido",
          "Necesitamos acceso a la cámara para tomar la foto."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (result.canceled) return;

      const photo = result.assets[0];

      const formData = new FormData();
      formData.append(
        "photo",
        {
          uri: photo.uri,
          name: "outfit.jpg",
          type: photo.mimeType || "image/jpeg",
        } as any
      );
      formData.append("publishToExplore", publishToExplore ? "true" : "false");
      if (postTitle) {
        formData.append("postTitle", postTitle);
      }

      const res = await fetch(`${API_URL}/api/outfits/${outfitId}/photo`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.ok) {
        console.log("Respuesta backend foto:", await res.text());
        throw new Error("Error subiendo foto");
      }

      const data = await res.json(); // { ok, photo }
      console.log("Foto subida:", data);

      const newUrl = data.photo?.url as string;

      // Actualizar lista local de outfits (miniatura)
      setSavedOutfits((prev) =>
        prev.map((o) =>
          o.id === outfitId
            ? {
                ...o,
                photoUrl: newUrl,
              }
            : o
        )
      );

      // Actualizar también el outfit seleccionado en el modal
      setSelected((prev) => {
        if (!prev || prev.kind !== "saved") return prev;
        if (prev.data.id !== outfitId) return prev;

        return {
          kind: "saved",
          data: {
            ...prev.data,
            photoUrl: newUrl,
          },
        };
      });

      Alert.alert(
        publishToExplore ? "Publicado" : "Foto guardada",
        publishToExplore
          ? "Tu foto se publicó en Explorar."
          : "La foto se guardó para tu outfit."
      );

      // Si se publicó en Explorar, navegar a esa pestaña
      if (publishToExplore) {
        router.navigate("/(tabs)/explorar");
      }
    } catch (err) {
      console.error("Error al tomar foto:", err);
      Alert.alert("Error", "Error subiendo foto");
    }
  };

  // ---------- Eliminar outfit guardado ----------
  const deleteSelectedOutfit = () => {
    if (!selected || selected.kind !== "saved") return;

    const outfitId = selected.data.id;

    Alert.alert(
      "Eliminar outfit",
      "¿Seguro que quieres eliminar este outfit? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(`${API_URL}/api/outfits/${outfitId}`, {
                method: "DELETE",
              });

              if (!res.ok) {
                console.log("Respuesta backend delete:", await res.text());
                throw new Error("Error eliminando outfit");
              }

              // Sacarlo de la lista de outfits guardados
              setSavedOutfits((prev) =>
                prev.filter((o) => o.id !== outfitId)
              );

              // Quitarlo también de favoritos si estaba ahí
              setFavoriteIds((prev) => {
                const next = new Set(prev);
                next.delete(outfitId);
                return next;
              });

              setShowOutfitModal(false);
              setSelected(null);

              Alert.alert("Eliminado", "Tu outfit se eliminó correctamente.");
            } catch (err) {
              console.error("Error eliminando outfit:", err);
              Alert.alert(
                "Error",
                "No se pudo eliminar el outfit. Intenta de nuevo."
              );
            }
          },
        },
      ]
    );
  };

  // ---------- Render helpers ----------
  const renderSelectedItems = () => {
    if (!selected) return null;

    if (selected.kind === "generated") {
      return selected.data.items.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <Image
            source={{ uri: getItemImageUrl(item) || "" }}
            style={styles.itemImage}
            resizeMode="cover"
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.itemName}>{item.type || "Prenda"}</Text>
            {item.category && (
              <Text style={styles.itemMeta}>Categoría: {item.category}</Text>
            )}
            {item.color && (
              <Text style={styles.itemMeta}>Color: {item.color}</Text>
            )}
          </View>
        </View>
      ));
    }

    const o = selected.data;
    return o.items.map((it) => (
      <View key={it.prenda.id} style={styles.itemRow}>
        <Image
          source={{ uri: getItemImageUrl(it.prenda) || "" }}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.itemName}>{it.prenda.type || "Prenda"}</Text>
          {it.prenda.category && (
            <Text style={styles.itemMeta}>
              Categoría: {it.prenda.category}
            </Text>
          )}
          {it.prenda.color && (
            <Text style={styles.itemMeta}>Color: {it.prenda.color}</Text>
          )}
        </View>
      </View>
    ));
  };

  const selectedTitle =
    selected?.kind === "generated"
      ? "Outfit sugerido"
      : selected?.data.name || "Outfit";

  const selectedSubtitle =
    selected &&
    `${selected.data.occasion || "Sin ocasión"} · ${
      selected.data.dressCode || "Sin estilo"
    } · ${selected.data.weather || ""}`;

  // ---------- Lógica para el modal de publicación ----------
  const openPublishModal = () => {
    if (!selected || selected.kind !== "saved") return;
    setPublishTargetOutfitId(selected.data.id);
    setPublishTitle(selected.data.name || "Outfit sugerido");
    setPublishModalVisible(true);
  };

  const confirmPublish = () => {
    if (!publishTargetOutfitId) return;
    const titleToSend =
      publishTitle.trim().length > 0
        ? publishTitle.trim()
        : "Outfit sugerido";

    setPublishModalVisible(false);
    takePhotoAndUpdateOutfit(publishTargetOutfitId, true, titleToSend);
  };

  // ---------- Render principal ----------
  return (
    <>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Mis Outfits</Text>
            <Text style={styles.subtitle}>
              Organiza y planifica tus conjuntos
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsFormOpen(true)}
            disabled={isGenerating}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Esta semana (último outfit guardado) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Esta semana</Text>

          {savedOutfits.length > 0 && savedOutfits[0].items?.length > 0 ? (
            <TouchableOpacity
              style={styles.weekCard}
              onPress={() => {
                const o = savedOutfits[0];
                setSelected({ kind: "saved", data: o });
                setShowOutfitModal(true);
              }}
            >
              <View style={styles.weekImageContainer}>
                <Image
                  source={{
                    uri: getOutfitThumbnail(savedOutfits[0]) || "",
                  }}
                  style={styles.weekImage}
                  resizeMode="cover"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.weekOutfitName}>
                  {savedOutfits[0].name || "Outfit sugerido"}
                </Text>
                <Text style={styles.weekOutfitMeta}>
                  {savedOutfits[0].items.length} prendas
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => toggleFavorite(savedOutfits[0].id)}
              >
                <Ionicons
                  name={
                    isFavorite(savedOutfits[0].id) ? "heart" : "heart-outline"
                  }
                  size={22}
                  color={
                    isFavorite(savedOutfits[0].id) ? "#ff4b8b" : "#9ca3af"
                  }
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.emptyWeekCard}
              onPress={() => setIsFormOpen(true)}
            >
              <Ionicons name="add-circle-outline" size={28} color="#667eea" />
              <Text style={styles.emptyText}>Genera tu primer outfit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Mis colecciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mis colecciones</Text>

          <View style={styles.collectionsGrid}>
            {savedOutfits.map((o) => (
              <TouchableOpacity
                key={o.id}
                style={styles.collectionCard}
                onPress={() => {
                  setSelected({ kind: "saved", data: o });
                  setShowOutfitModal(true);
                }}
              >
                <View style={styles.collectionImageContainer}>
                  <Image
                    source={{ uri: getOutfitThumbnail(o) || "" }}
                    style={styles.collectionImage}
                  />
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(o.id)}
                  >
                    <Ionicons
                      name={isFavorite(o.id) ? "heart" : "heart-outline"}
                      size={18}
                      color={isFavorite(o.id) ? "#ff4b8b" : "#374151"}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.collectionName}>
                  {o.name || "Outfit sugerido"}
                </Text>
                <Text style={styles.collectionCount}>
                  {o.items.length} prendas
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Favoritos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favoritos</Text>

          {favoriteOutfits.length === 0 ? (
            <Text style={styles.emptyFavoritesText}>
              Aún no tienes favoritos. Toca el corazón ❤️ de un outfit para verlo
              aquí.
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.outfitsRow}
            >
              {favoriteOutfits.map((o) => (
                <TouchableOpacity
                  key={o.id}
                  style={styles.outfitCard}
                  onPress={() => {
                    setSelected({ kind: "saved", data: o });
                    setShowOutfitModal(true);
                  }}
                >
                  <View style={styles.outfitImageContainer}>
                    <Image
                      source={{ uri: getOutfitThumbnail(o) || "" }}
                      style={styles.outfitImage}
                    />
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={() => toggleFavorite(o.id)}
                    >
                      <Ionicons
                        name={isFavorite(o.id) ? "heart" : "heart-outline"}
                        size={16}
                        color={isFavorite(o.id) ? "#ff4b8b" : "#374151"}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.outfitName}>
                    {o.name || "Outfit sugerido"}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* Modal del formulario para generar outfit */}
      <GenerateOutfitForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onGenerate={handleGenerateOutfit}
      />

      {/* Modal para ver / guardar / tomar foto */}
      <Modal
        visible={showOutfitModal && !!selected}
        animationType="slide"
        transparent
        onRequestClose={() => setShowOutfitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selected && (
              <>
                <Text style={styles.modalTitle}>{selectedTitle}</Text>
                <Text style={styles.modalSubtitle}>{selectedSubtitle}</Text>

                <ScrollView style={{ marginTop: 12 }}>
                  {renderSelectedItems()}
                </ScrollView>

                {/* Si es generado, mostramos botón para guardar */}
                {selected.kind === "generated" && (
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveSelectedGeneratedOutfit}
                  >
                    <Text style={styles.saveButtonText}>Guardar outfit</Text>
                  </TouchableOpacity>
                )}

                {/* Si es guardado, mostramos botones de cámara */}
                {selected.kind === "saved" && (
                  <>
                    <TouchableOpacity
                      style={[
                        styles.cameraButton,
                        { backgroundColor: "#0ea5e9" },
                      ]}
                      onPress={() =>
                        takePhotoAndUpdateOutfit(selected.data.id, false)
                      }
                    >
                      <Ionicons
                        name="camera-outline"
                        size={18}
                        color="#fff"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.cameraButtonText}>
                        Tomar foto del outfit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.cameraButton,
                        { backgroundColor: "#4f46e5" },
                      ]}
                      onPress={openPublishModal}
                    >
                      <Ionicons
                        name="cloud-upload-outline"
                        size={18}
                        color="#fff"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.cameraButtonText}>
                        Tomar foto y publicar
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={deleteSelectedOutfit}
                    >
                      <Text style={styles.deleteButtonText}>
                        Eliminar outfit
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowOutfitModal(false)}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal para elegir el título de la publicación */}
      <Modal
        visible={publishModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPublishModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.publishModalContent}>
            <Text style={styles.publishTitle}>Publicar en Explorar</Text>
            <Text style={styles.publishSubtitle}>
              Elige el nombre de tu publicación:
            </Text>

            <TextInput
              style={styles.publishInput}
              placeholder="Ej. Outfit para fiesta"
              placeholderTextColor="#9ca3af"
              value={publishTitle}
              onChangeText={setPublishTitle}
            />

            <View style={styles.publishButtonsRow}>
              <TouchableOpacity
                style={[styles.publishButton, { backgroundColor: "#e5e7eb" }]}
                onPress={() => setPublishModalVisible(false)}
              >
                <Text style={[styles.publishButtonText, { color: "#111827" }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.publishButton, { backgroundColor: "#4f46e5" }]}
                onPress={confirmPublish}
              >
                <Text style={styles.publishButtonText}>
                  Tomar foto y publicar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

// ---------- Estilos ----------
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  // Esta semana
  weekCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  weekImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
    marginRight: 12,
  },
  weekImage: {
    width: "100%",
    height: "100%",
  },
  weekOutfitName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  weekOutfitMeta: {
    fontSize: 12,
    color: "#6b7280",
  },
  emptyWeekCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#eef2ff",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  } as any,
  emptyText: {
    fontSize: 14,
    color: "#4f46e5",
    fontWeight: "500",
    marginLeft: 8,
  },
  // Colecciones
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
    shadowOffset: { width: 0, height: 2 },
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
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  // Favoritos
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  outfitImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
  },
  outfitName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  emptyFavoritesText: {
    paddingHorizontal: 20,
    fontSize: 13,
    color: "#6b7280",
  },
  // Modal principal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#555",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
  },
  itemMeta: {
    fontSize: 12,
    color: "#666",
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: "#10b981",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "700",
  },
  cameraButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  cameraButtonText: {
    color: "white",
    fontWeight: "700",
  },
  closeButton: {
    marginTop: 8,
    backgroundColor: "#4f46e5",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "700",
  },
  deleteButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#ef4444",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "700",
  },
  // Modal de publicación
  publishModalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
  },
  publishTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  publishSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 10,
  },
  publishInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#111827",
    marginBottom: 14,
  },
  publishButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  publishButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  publishButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
});
