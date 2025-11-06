// frontend/app/index.tsx
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ColorValue,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../src/contexts/auth";


const { width } = Dimensions.get("window");

type GradientColors = [ColorValue, ColorValue, ...ColorValue[]];

type SlideItem = {
  id: string;
  title: string;
  description: string;
  color: GradientColors;
  gif: ImageSourcePropType;
};

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigation = useNavigation();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useLayoutEffect(() => {
    (navigation as any).setOptions?.({
      title: "  Bienvenido a OutfitLab",
      headerLeft: () => (
        <Image
          source={require("../assets/images/icom.png")}
          style={{ width: 32, height: 32, marginLeft: 16 }}
          resizeMode="contain"
        />
      ),
    });
  }, [navigation]);

  // ✅ Si ya está logueado, redirigir automáticamente
  useEffect(() => {
    console.log('👤 Usuario en index:', user);
    console.log('🔐 Auth loading:', isLoading);
    
    if (!isLoading) {
      if (user) {
        console.log("✅ Usuario ya logueado, redirigiendo a armario...");
        router.replace("/(tabs)/armario");
      } else {
        console.log("⚠️  No hay usuario logueado");
      }
    }
  }, [isLoading, user]);

  // Mostrar loading mientras verifica auth
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#40a585ff" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  const slides: SlideItem[] = [
    {
      id: "1",
      title: "Organiza tu armario",
      description:
        "Digitaliza todas tus prendas y accesorios en un solo lugar. Nunca más olvidarás lo que tienes",
      color: ["#f8f8f8ff", "#15c67fff"] as GradientColors,
      gif: require("../assets/images/armario.gif"),
    },
    {
      id: "2",
      title: "Descubre outfits",
      description: "Combina tu ropa de formas nuevas e innovadoras",
      color: ["#f8f8f8ff", "#e4c31eff"] as GradientColors,
      gif: require("../assets/images/adecuado.gif"),
    },
    {
      id: "3",
      title: "Ahorra tiempo",
      description: "Decide qué ponerte en segundos, no en horas",
      color: ["#f7f7f7ff", "#295adeff"] as GradientColors,
      gif: require("../assets/images/equilibrio-de-tiempo.gif"),
    },
  ];

  const Slide: React.FC<{ item: SlideItem }> = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      <LinearGradient colors={item.color} style={styles.gradient}>
        <View style={styles.content}>
          <Image
            source={item.gif}
            style={{ width: 120, height: 120, marginBottom: 20 }}
            resizeMode="contain"
          />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const slide = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentSlide(slide);
        }}
        scrollEventThrottle={16}
      >
        {slides.map((item) => (
          <Slide key={item.id} item={item} />
        ))}
      </ScrollView>

      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentSlide === index && styles.indicatorActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.primaryButtonText}>Crear cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.secondaryButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  slide: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: "#8e8e8eff",
    width: 20,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: "#40a585ff",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#40a585ff",
  },
  secondaryButtonText: {
    color: "#40a585ff",
    fontSize: 16,
    fontWeight: "600",
  },
});