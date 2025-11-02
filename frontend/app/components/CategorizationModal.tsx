import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from "@expo/vector-icons";
import modalStyles from '../../src/styles/modal';

const GARMENT_TYPES = [
  { id: 'shirt', name: 'Camisa', icon: 'shirt-outline' },
  { id: 'pants', name: 'Pantalón', icon: 'cut-outline' },
  { id: 'shoes', name: 'Zapatos', icon: 'footsteps-outline' },
  { id: 'accessory', name: 'Accesorio', icon: 'watch-outline' },
];

const COLORS = [
  { id: 'black', name: 'Negro', hex: '#000000' },
  { id: 'white', name: 'Blanco', hex: '#FFFFFF' },
  { id: 'red', name: 'Rojo', hex: '#FF0000' },
  { id: 'blue', name: 'Azul', hex: '#0000FF' },
  { id: 'green', name: 'Verde', hex: '#00FF00' },
  { id: 'yellow', name: 'Amarillo', hex: '#FFFF00' },
  { id: 'purple', name: 'Morado', hex: '#800080' },
  { id: 'gray', name: 'Gris', hex: '#808080' },
];

interface CategorizationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { type: string; color: string }) => void;
  initialType?: string;
  initialColor?: string;
}

export default function CategorizationModal({
  visible,
  onClose,
  onSave,
  initialType = '',
  initialColor = '',
}: CategorizationModalProps) {
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedColor, setSelectedColor] = useState(initialColor);

  const handleSave = () => {
    onSave({
      type: selectedType,
      color: selectedColor
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContent}>
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalTitle}>Categorizar Prenda</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={modalStyles.sectionTitle}>Tipo de Prenda</Text>
          <View style={modalStyles.typeGrid}>
            {GARMENT_TYPES.map(type => (
              <TouchableOpacity
                key={type.id}
                style={[
                  modalStyles.typeButton,
                  selectedType === type.id && modalStyles.typeButtonSelected
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <Ionicons
                  name={type.icon as any}
                  size={24}
                  color={selectedType === type.id ? '#fff' : '#666'}
                />
                <Text
                  style={[
                    modalStyles.typeText,
                    selectedType === type.id && modalStyles.typeTextSelected
                  ]}
                >
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={modalStyles.sectionTitle}>Color Principal</Text>
          <View style={modalStyles.colorGrid}>
            {COLORS.map(color => (
              <TouchableOpacity
                key={color.id}
                style={[
                  modalStyles.colorButton,
                  { backgroundColor: color.hex },
                  selectedColor === color.id && modalStyles.colorButtonSelected
                ]}
                onPress={() => setSelectedColor(color.id)}
              >
                {selectedColor === color.id && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={color.id === 'white' ? '#000' : '#fff'}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={modalStyles.saveButton}
            onPress={handleSave}
          >
            <Text style={modalStyles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

