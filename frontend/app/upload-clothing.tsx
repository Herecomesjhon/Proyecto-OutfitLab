// frontend/app/upload-clothing.tsx (o donde quieras poner esta pantalla)
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   ScrollView,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { uploadClothing } from '../src/services/clothingServie';

// export default function UploadClothingScreen() {  
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);

//   // TODO: Obtener userId de tu contexto de autenticación
//   const userId = 'user-id-from-context'; // Reemplaza con tu lógica de auth

//   // Solicitar permisos de cámara/galería
//   const requestPermissions = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permiso denegado', 'Necesitamos acceso a tus fotos');
//       return false;
//     }
//     return true;
//   };

//   // Seleccionar imagen de la galería
//   const pickImage = async () => {
//     const hasPermission = await requestPermissions();
//     if (!hasPermission) return;

//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.8,
//       });

//       if (!result.canceled) {
//         setSelectedImage(result.assets[0].uri);
//         setResult(null); // Limpiar resultado anterior
//       }
//     } catch (error) {
//       console.error('Error picking image:', error);
//       Alert.alert('Error', 'No se pudo seleccionar la imagen');
//     }
//   };

//   // Tomar foto con la cámara
//   const takePhoto = async () => {
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permiso denegado', 'Necesitamos acceso a tu cámara');
//       return;
//     }

//     try {
//       const result = await ImagePicker.launchCameraAsync({
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.8,
//       });

//       if (!result.canceled) {
//         setSelectedImage(result.assets[0].uri);
//         setResult(null);
//       }
//     } catch (error) {
//       console.error('Error taking photo:', error);
//       Alert.alert('Error', 'No se pudo tomar la foto');
//     }
//   };

//   // Subir prenda al servidor
//   const handleUpload = async () => {
//     if (!selectedImage) {
//       Alert.alert('Error', 'Selecciona una imagen primero');
//       return;
//     }

//     try {
//       setLoading(true);
//       const data = await uploadClothing(userId, selectedImage);

//       setResult(data);

//       Alert.alert(
//         '¡Prenda subida! 🎉',
//         `Clasificada como: ${data.classification.category}\nConfianza: ${(
//           data.classification.confidence * 100
//         ).toFixed(0)}%`
//       );
//     } catch (error: any) {
//       console.error('Upload error:', error);
//       Alert.alert('Error', error.message || 'No se pudo subir la prenda');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Subir Prenda</Text>

//       {/* Botones para seleccionar imagen */}
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.button} onPress={pickImage}>
//           <Text style={styles.buttonText}>📷 Galería</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.button} onPress={takePhoto}>
//           <Text style={styles.buttonText}>📸 Cámara</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Previsualización de imagen */}
//       {selectedImage && (
//         <View style={styles.imageContainer}>
//           <Image source={{ uri: selectedImage }} style={styles.image} />

//           <TouchableOpacity
//             style={styles.uploadButton}
//             onPress={handleUpload}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.uploadButtonText}>Subir y Clasificar</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Resultado de clasificación */}
//       {result && (
//         <View style={styles.resultContainer}>
//           <Text style={styles.resultTitle}>✅ Resultado:</Text>
//           <Text style={styles.resultText}>
//             Categoría: <Text style={styles.bold}>{result.classification.category}</Text>
//           </Text>
//           <Text style={styles.resultText}>
//             Confianza: <Text style={styles.bold}>
//               {(result.classification.confidence * 100).toFixed(0)}%
//             </Text>
//           </Text>
//           <Text style={styles.resultText}>
//             Etiqueta IA: <Text style={styles.bold}>{result.classification.aiLabel}</Text>
//           </Text>
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     padding: 15,
//     borderRadius: 10,
//     width: '45%',
//   },
//   buttonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   imageContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   image: {
//     width: 300,
//     height: 300,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   uploadButton: {
//     backgroundColor: '#34C759',
//     padding: 15,
//     borderRadius: 10,
//     width: '80%',
//   },
//   uploadButtonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   resultContainer: {
//     backgroundColor: '#f0f0f0',
//     padding: 20,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   resultTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   resultText: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   bold: {
//     fontWeight: 'bold',
//   },
// });

// frontend/app/upload-clothing.tsx
// frontend/app/upload-clothing.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
// ✅ FIX: Corregir el typo en el import (clothingServie → clothingService)
import { uploadClothing, UploadResult } from '../src/services/clothingServie';
import { useAuth } from '../src/contexts/auth';

export default function UploadClothingScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);

  const { user } = useAuth();
  const userId = user?.id ?? '';

  const requestGalleryPerm = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tus fotos');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const ok = await requestGalleryPerm();
    if (!ok) return;

    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!r.canceled) {
      setSelectedImage(r.assets[0].uri);
      setResult(null);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu cámara');
      return;
    }

    const r = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!r.canceled) {
      setSelectedImage(r.assets[0].uri);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!userId) {
      Alert.alert('Error', 'Debes iniciar sesión');
      return;
    }
    if (!selectedImage) {
      Alert.alert('Error', 'Selecciona una imagen primero');
      return;
    }

    try {
      setLoading(true);
      const data = await uploadClothing(userId, selectedImage);
      setResult(data);

      const conf = Math.round((data.classification?.confidence ?? 0) * 100);
      Alert.alert(
        '¡Prenda subida!',
        `Clasificada como: ${data.classification?.category}\nConfianza: ${conf}%`
      );
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error', e?.message || 'No se pudo subir la prenda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Subir Prenda</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>📷 Galería</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>📸 Cámara</Text>
        </TouchableOpacity>
      </View>

      {selectedImage && (
        <View style={styles.preview}>
          <Image source={{ uri: selectedImage }} style={styles.image} />
          <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.uploadText}>Subir y clasificar</Text>}
          </TouchableOpacity>
        </View>
      )}

      {result?.classification && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Resultado (IA)</Text>
          <Text style={styles.resultText}>
            Categoría IA: <Text style={styles.bold}>{result.classification.category}</Text>
          </Text>
          <Text style={styles.resultText}>
            Confianza:{' '}
            <Text style={styles.bold}>
              {Math.round((result.classification.confidence ?? 0) * 100)}%
            </Text>
          </Text>
          <Text style={styles.resultText}>
            Etiqueta IA: <Text style={styles.bold}>{result.classification.aiLabel}</Text>
          </Text>
        </View>
      )}

      {result?.prenda && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Guardado</Text>
          <Text style={styles.resultText}>
            Imagen: <Text style={styles.bold}>{result.prenda.imageUrl}</Text>
          </Text>
          {result.prenda.category ? (
            <Text style={styles.resultText}>
              Categoría guardada: <Text style={styles.bold}>{result.prenda.category}</Text>
            </Text>
          ) : null}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  button: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: '600' },
  preview: { alignItems: 'center', marginBottom: 20 },
  image: { width: 300, height: 300, borderRadius: 8, marginBottom: 12 },
  uploadBtn: { backgroundColor: '#34C759', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 10, width: '80%' },
  uploadText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  resultBox: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 16, marginTop: 10 },
  resultTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  resultText: { fontSize: 14, marginBottom: 4 },
  bold: { fontWeight: '700' },
});