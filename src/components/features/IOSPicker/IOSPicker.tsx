import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { styles } from './IOSPicker.styles';

interface IOSPickerProps {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: string[];
  placeholder?: string;
}

export const IOSPicker: React.FC<IOSPickerProps> = ({
  label,
  selectedValue,
  onValueChange,
  items,
  placeholder = 'Select an option',
}) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsPickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsPickerVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.buttonText, !selectedValue && styles.placeholderText]}
        >
          {selectedValue || placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={() => setIsPickerVisible(false)}>
                <Text style={styles.pickerCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.pickerTitle}>Select {label}</Text>
              <TouchableOpacity onPress={() => setIsPickerVisible(false)}>
                <Text style={styles.pickerDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerScroll}>
              {items.map(item => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.pickerItem,
                    selectedValue === item && styles.pickerItemSelected,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      selectedValue === item && styles.pickerItemTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

