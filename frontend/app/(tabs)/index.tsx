// app/(tabs)/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../../src/contexts/auth";

// --------- Tipos ----------
type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string; // texto corto tipo "Hace 2 h"
  read: boolean;
};

type EventItem = {
  id: string;
  title: string;
  date: string; // "Hoy", "Mañana", etc.
  time: string; // "3:00 PM"
  outfitName?: string;
};

// --------- Datos iniciales (demo local) ----------
const initialNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Nuevo like en tu outfit",
    description: "A alguien le gustó tu publicación en Explorar.",
    time: "Hace 10 min",
    read: false,
  },
  {
    id: "n2",
    title: "Comentario nuevo",
    description: "“Me encantó ese vestido azul 💙”.",
    time: "Hace 1 h",
    read: false,
  },
  {
    id: "n3",
    title: "Recordatorio",
    description: "Tienes un evento ‘Reunión de trabajo’ hoy a las 3:00 PM.",
    time: "Hoy",
    read: true,
  },
];

const initialEvents: EventItem[] = [
  {
    id: "e1",
    title: "Reunión de trabajo",
    date: "Hoy",
    time: "3:00 PM",
    outfitName: "Look Casual Elegante",
  },
  {
    id: "e2",
    title: "Cena con amigos",
    date: "Mañana",
    time: "8:00 PM",
    outfitName: "Smart Casual",
  },
  {
    id: "e3",
    title: "Fiesta de cumpleaños",
    date: "Sábado",
    time: "9:30 PM",
    outfitName: "Outfit para fiesta",
  },
];

export default function HomeScreen() {
  const { user } = useAuth();

  // Estado de notificaciones y eventos
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [events] = useState<EventItem[]>(initialEvents);

  // Modales
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);

  // ¿Hay notificaciones sin leer?
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpenNotifications = () => {
    // al abrir, marcamos todas como leídas
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setShowNotificationsModal(true);
  };

  const handleOpenEvents = () => {
    setShowEventsModal(true);
  };

  const nextEvent = events[0]; // el primero como "Próximo evento"

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>
              ¡Buenos días! <Text style={{ fontSize: 28 }}>👋</Text>
            </Text>
            <Text style={styles.headerSubtitle}>
              ¿Qué outfit usarás hoy, {user?.name || "usuario"}?
            </Text>
          </View>

          {/* Campana de notificaciones */}
          <TouchableOpacity
            style={styles.bellButton}
            onPress={handleOpenNotifications}
          >
            <Ionicons name="notifications-outline" size={22} color="#111827" />
            {unreadCount > 0 && (
              <View style={styles.bellDot}>
                <Text style={styles.bellDotText}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Tarjeta clima (estática por ahora) */}
        <View style={styles.card}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="cloud-outline" size={32} color="#4f46e5" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.temperature}>22°C</Text>
              <Text style={styles.weatherText}>Soleado</Text>
            </View>
          </View>
          <Text style={styles.weatherHint}>
            Perfecto para looks ligeros y colores claros
          </Text>
        </View>

        {/* Recomendación del día */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recomendación del día</Text>

          <View style={styles.recommendCard}>
            <View style={styles.recommendImagesColumn}>
              <View style={styles.recommendImagePlaceholder} />
              <View style={styles.recommendImagePlaceholder} />
              <View style={styles.recommendImagePlaceholder} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.recommendTitle}>Look Casual Elegante</Text>
              <Text style={styles.recommendSubtitle}>
                Perfecto para el día a día
              </Text>

              <TouchableOpacity
                style={styles.useOutfitButton}
                onPress={() => {
                  // Por ahora solo lleva a la pestaña de outfits
                  router.push("/(tabs)/outfits");
                }}
              >
                <Text style={styles.useOutfitButtonText}>Usar este outfit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Próximos eventos */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Próximos eventos</Text>
            <TouchableOpacity onPress={handleOpenEvents}>
              <Text style={styles.linkText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {nextEvent ? (
            <TouchableOpacity
              style={styles.eventCard}
              onPress={handleOpenEvents}
            >
              <View style={styles.eventIconContainer}>
                <Ionicons name="briefcase-outline" size={22} color="#ef4444" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eventTitle}>{nextEvent.title}</Text>
                <Text style={styles.eventSubtitle}>
                  {nextEvent.date}, {nextEvent.time}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.eventEmptyCard}>
              <Text style={styles.eventEmptyText}>
                No tienes eventos próximos.
              </Text>
            </View>
          )}
        </View>

        {/* Acciones rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>

          <View style={styles.quickGrid}>
            {/* Agregar prenda */}
            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => router.push("/(tabs)/armario")}
            >
              <View style={styles.quickIconCircle}>
                <Ionicons name="add" size={22} color="#4f46e5" />
              </View>
              <Text style={styles.quickText}>Agregar prenda</Text>
            </TouchableOpacity>

            {/* Mi calendario */}
            <TouchableOpacity
              style={styles.quickCard}
              onPress={handleOpenEvents}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: "#ecfdf3" }]}>
                <Ionicons name="calendar-outline" size={20} color="#22c55e" />
              </View>
              <Text style={styles.quickText}>Mi calendario</Text>
            </TouchableOpacity>

            {/* Tendencias */}
            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => router.push("/(tabs)/explorar")}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: "#fff7ed" }]}>
                <Ionicons name="trending-up-outline" size={20} color="#f97316" />
              </View>
              <Text style={styles.quickText}>Tendencias</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ========== MODAL NOTIFICACIONES ========== */}
      <Modal
        visible={showNotificationsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNotificationsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notificaciones</Text>

            {notifications.length === 0 ? (
              <Text style={styles.modalEmptyText}>
                No tienes notificaciones por ahora.
              </Text>
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                style={{ marginTop: 10, maxHeight: 260 }}
                renderItem={({ item }) => (
                  <View style={styles.notificationItem}>
                    <View style={styles.notificationIcon}>
                      <Ionicons
                        name={
                          item.title.toLowerCase().includes("like")
                            ? "heart-outline"
                            : item.title.toLowerCase().includes("comentario")
                            ? "chatbubble-ellipses-outline"
                            : "alarm-outline"
                        }
                        size={18}
                        color="#4f46e5"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.notificationTitle}>
                        {item.title}
                      </Text>
                      <Text style={styles.notificationDescription}>
                        {item.description}
                      </Text>
                      <Text style={styles.notificationTime}>{item.time}</Text>
                    </View>
                  </View>
                )}
              />
            )}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowNotificationsModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========== MODAL EVENTOS / CALENDARIO ========== */}
      <Modal
        visible={showEventsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEventsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mis eventos</Text>

            {events.length === 0 ? (
              <Text style={styles.modalEmptyText}>
                Aún no has agregado eventos.
              </Text>
            ) : (
              <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                style={{ marginTop: 10, maxHeight: 260 }}
                renderItem={({ item }) => (
                  <View style={styles.eventItemRow}>
                    <View style={styles.eventItemIcon}>
                      <Ionicons
                        name="calendar-outline"
                        size={18}
                        color="#22c55e"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.eventItemTitle}>{item.title}</Text>
                      <Text style={styles.eventItemSubtitle}>
                        {item.date} · {item.time}
                      </Text>
                      {item.outfitName && (
                        <Text style={styles.eventItemOutfit}>
                          Outfit sugerido: {item.outfitName}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
              />
            )}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowEventsModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

// --------- Estilos ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bellDot: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#ef4444",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  bellDotText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  temperature: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },
  weatherText: {
    fontSize: 14,
    color: "#6b7280",
  },
  weatherHint: {
    marginTop: 12,
    fontSize: 13,
    color: "#4f46e5",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  linkText: {
    fontSize: 13,
    color: "#4f46e5",
    fontWeight: "600",
  },
  // Recomendación
  recommendCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendImagesColumn: {
    width: 60,
    marginRight: 12,
    justifyContent: "space-between",
  },
  recommendImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#e5e7eb",
  },
  recommendTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  recommendSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
  },
  useOutfitButton: {
    marginTop: 12,
    backgroundColor: "#4f46e5",
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  useOutfitButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  // Próximos eventos
  eventCard: {
    marginTop: 4,
    backgroundColor: "white",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  eventSubtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
  eventEmptyCard: {
    marginTop: 4,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
  },
  eventEmptyText: {
    fontSize: 13,
    color: "#6b7280",
  },
  // Quick actions
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  quickIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  quickText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  // Modales
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "88%",
    borderRadius: 18,
    backgroundColor: "white",
    padding: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  modalEmptyText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
  },
  modalCloseButton: {
    marginTop: 16,
    backgroundColor: "#4f46e5",
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "white",
    fontWeight: "600",
  },
  // Items notificaciones
  notificationItem: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 10,
  },
  notificationIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  notificationDescription: {
    fontSize: 13,
    color: "#4b5563",
  },
  notificationTime: {
    marginTop: 2,
    fontSize: 11,
    color: "#9ca3af",
  },
  // Items eventos en modal
  eventItemRow: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 10,
  },
  eventItemIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ecfdf3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  eventItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  eventItemSubtitle: {
    fontSize: 13,
    color: "#4b5563",
  },
  eventItemOutfit: {
    fontSize: 12,
    color: "#16a34a",
    marginTop: 2,
  },
});
