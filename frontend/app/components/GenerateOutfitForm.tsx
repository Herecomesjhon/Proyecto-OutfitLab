// components/GenerateOutfitForm.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform
} from 'react-native';

interface OutfitFormData {
  occasion: string;
  dressCode: string;
  weather: string;
}

interface GenerateOutfitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: OutfitFormData) => void;
}

export default function GenerateOutfitForm({ isOpen, onClose, onGenerate }: GenerateOutfitFormProps) {
  const [formData, setFormData] = useState<OutfitFormData>({
    occasion: '',
    dressCode: '',
    weather: '',
  });

  const occasions = [
    'Trabajo/Oficina', 'Cita', 'Fiesta', 'Deporte/Ejercicio', 
    'Universidad/Clases', 'Viaje', 'Reunión familiar', 'Cena', 
    'Evento especial', 'Salida casual'
  ];

  const dressCodes = [
    'Casual', 'Smart Casual', 'Business Casual', 'Formal', 
    'Semi-Formal', 'Deportivo', 'Bohemio', 'Elegante'
  ];

  const weatherOptions = [
    'Caluroso', 'Templado', 'Frío', 'Lluvioso', 'Ventoso', 'Soleado'
  ];

  const handleSubmit = () => {
    if (!formData.occasion || !formData.dressCode || !formData.weather) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    
    onGenerate(formData);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      occasion: '',
      dressCode: '',
      weather: '',
    });
  };

  if (!isOpen) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.overlay}>
          <ScrollView 
            style={styles.modalContent}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerRow}>
                <Text style={styles.title}>Generar Nuevo Outfit</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
              </View>
              {/* Se eliminó el subtítulo "Describe la ocasión y condiciones" */}
            </View>

            {/* Formulario */}
            <View style={styles.form}>
              {/* Ocasión */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>¿Para qué ocasión?</Text>
                <View style={styles.dropdownContainer}>
                  <ScrollView style={styles.dropdownOptions}>
                    {occasions.map((occasion) => (
                      <TouchableOpacity
                        key={occasion}
                        style={[
                          styles.dropdownOption,
                          formData.occasion === occasion && styles.dropdownOptionSelected
                        ]}
                        onPress={() => setFormData({...formData, occasion})}
                      >
                        <Ionicons 
                          name={
                            occasion.includes('Trabajo') ? 'briefcase-outline' :
                            occasion.includes('Cita') ? 'heart-outline' :
                            occasion.includes('Fiesta') ? 'sparkles-outline' :
                            occasion.includes('Deporte') ? 'barbell-outline' :
                            occasion.includes('Universidad') ? 'school-outline' :
                            occasion.includes('Viaje') ? 'airplane-outline' :
                            occasion.includes('familiar') ? 'people-outline' :
                            occasion.includes('Cena') ? 'restaurant-outline' :
                            occasion.includes('Evento') ? 'star-outline' :
                            'walk-outline'
                          } 
                          size={20} 
                          color={formData.occasion === occasion ? '#667eea' : '#666'} 
                        />
                        <Text style={[
                          styles.dropdownText,
                          formData.occasion === occasion && styles.dropdownTextSelected
                        ]}>
                          {occasion}
                        </Text>
                        {formData.occasion === occasion && (
                          <Ionicons name="checkmark" size={20} color="#667eea" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                {formData.occasion ? (
                  <Text style={styles.selectedItem}>
                    Seleccionado: <Text style={styles.selectedItemText}>{formData.occasion}</Text>
                  </Text>
                ) : null}
              </View>

              {/* Código de vestimenta */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Código de vestimenta</Text>
                <View style={styles.chipContainer}>
                  {dressCodes.map(code => (
                    <TouchableOpacity
                      key={code}
                      style={[
                        styles.chip,
                        formData.dressCode === code && styles.chipSelected
                      ]}
                      onPress={() => setFormData({...formData, dressCode: code})}
                    >
                      <Ionicons 
                        name="shirt-outline" 
                        size={16} 
                        color={formData.dressCode === code ? '#667eea' : '#666'} 
                      />
                      <Text style={[
                        styles.chipText,
                        formData.dressCode === code && styles.chipTextSelected
                      ]}>
                        {code}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {formData.dressCode ? (
                  <Text style={styles.selectedItem}>
                    Seleccionado: <Text style={styles.selectedItemText}>{formData.dressCode}</Text>
                  </Text>
                ) : null}
              </View>

              {/* Clima */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Clima</Text>
                <View style={styles.weatherContainer}>
                  {weatherOptions.map(weather => (
                    <TouchableOpacity
                      key={weather}
                      style={[
                        styles.weatherOption,
                        formData.weather === weather && styles.weatherOptionSelected
                      ]}
                      onPress={() => setFormData({...formData, weather})}
                    >
                      <Ionicons 
                        name={
                          weather === 'Caluroso' ? 'thermometer-outline' :
                          weather === 'Templado' ? 'partly-sunny-outline' :
                          weather === 'Frío' ? 'snow-outline' :
                          weather === 'Lluvioso' ? 'rainy-outline' :
                          weather === 'Ventoso' ? 'cloudy-outline' :
                          'sunny-outline'
                        } 
                        size={24} 
                        color={formData.weather === weather ? '#667eea' : '#666'} 
                      />
                      <Text style={[
                        styles.weatherText,
                        formData.weather === weather && styles.weatherTextSelected
                      ]}>
                        {weather}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {formData.weather ? (
                  <Text style={styles.selectedItem}>
                    Seleccionado: <Text style={styles.selectedItemText}>{formData.weather}</Text>
                  </Text>
                ) : null}
              </View>

              {/* Botones */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.generateButton,
                    (!formData.occasion || !formData.dressCode || !formData.weather) && styles.generateButtonDisabled
                  ]}
                  onPress={handleSubmit}
                  disabled={!formData.occasion || !formData.dressCode || !formData.weather}
                >
                  <Ionicons name="color-wand-outline" size={20} color="#FFF" />
                  <Text style={styles.generateButtonText}>Generar Outfit</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => {
                    onClose();
                    resetForm();
                  }}
                >
                  <Ionicons name="close-circle-outline" size={20} color="#666" />
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    maxHeight: '90%',
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingVertical: 30,
  },
  header: {
    marginBottom: 25,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  form: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    maxHeight: 200,
  },
  dropdownOptions: {
    padding: 8,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 6,
  },
  dropdownOptionSelected: {
    backgroundColor: '#f0f4ff',
  },
  dropdownText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  dropdownTextSelected: {
    color: '#667eea',
    fontWeight: '600',
  },
  selectedItem: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
  },
  selectedItemText: {
    color: '#667eea',
    fontWeight: '600',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    backgroundColor: '#f9f9f9',
  },
  chipSelected: {
    backgroundColor: '#f0f4ff',
    borderColor: '#667eea',
  },
  chipText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#666',
  },
  chipTextSelected: {
    color: '#667eea',
    fontWeight: '600',
  },
  weatherContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  weatherOption: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
  },
  weatherOptionSelected: {
    backgroundColor: '#f0f4ff',
    borderColor: '#667eea',
  },
  weatherText: {
    marginTop: 8,
    fontSize: 13,
    color: '#666',
  },
  weatherTextSelected: {
    color: '#667eea',
    fontWeight: '600',
  },
  buttonsContainer: {
    marginTop: 10,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  generateButtonDisabled: {
    backgroundColor: '#a0aec0',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});