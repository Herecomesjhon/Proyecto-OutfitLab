import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigation = useNavigation();
  const router = useRouter();

  // Configura el título y el ícono del header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '  Bienvenido a OutfitLab',
      headerLeft: () => (
        <Image
          source={require('../assets/images/icom.png')} // ✅ ruta corregida
          style={{ width: 32, height: 32, marginLeft: 16 }}
          resizeMode="contain"
        />
      ),
    });
  }, [navigation]);

  // Datos del carrusel
  const slides = [
    {
      id: '1',
      title: 'Organiza tu armario',
      description: 'Digitaliza todas tus prendas y accesorios en un solo lugar. Nunca más olvidarás lo que tienes',
      color: ['#f8f8f8ff', '#15c67fff'],
      gif: require('../assets/images/armario.gif'), // recuerda el formato de las rutas
    },
    {
      id: '2',
      title: 'Descubre outfits',
      description: 'Combina tu ropa de formas nuevas e innovadoras',
      color: ['#f8f8f8ff', '#e4c31eff'],
      gif: require('../assets/images/adecuado.gif'),
    },
    {
      id: '3',
      title: 'Ahorra tiempo',
      description: 'Decide qué ponerte en segundos, no en horas',

      
      color: ['#f7f7f7ff', '#295adeff'],
      gif: require('../assets/images/equilibrio-de-tiempo.gif'),
    },
  ];

  // Componente interno para cada slide
  const Slide = ({ item }) => (
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

      {/* Indicadores */}
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

      {/* Botones */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.primaryButtonText}>Crear cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.secondaryButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: '#8e8e8eff',
    width: 20,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: '#40a585ff',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#40a585ff',
  },
  secondaryButtonText: {
    color: '#40a585ff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Opciones estáticas del screen (cabecera)
export const options = {
  title: 'Bienvenido',
  headerLeft: () => (
    <Image
      source={require('../assets/images/outfitlab.png')} // ✅ ruta corregida
      style={{ width: 32, height: 32, marginLeft: 16 }}
      resizeMode="contain"
    />
  ),
};
