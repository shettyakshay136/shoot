import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import WhiteTickIcon from '@/assets/svg/whitetick.svg'
import { styles } from './ChooseCategoryModal.styles';
import type { ChooseCategoryModalProps, Category } from './ChooseCategoryModal.types';

const CATEGORIES: Category[] = ['Reels', 'Pictures', 'Raw clips', 'Mic'];

const ChooseCategoryModal: React.FC<ChooseCategoryModalProps> = ({
  isVisible,
  onClose,
  onUpload,
  selectedCategory = 'Reels',
}) => {
  const [currentSelected, setCurrentSelected] = useState<Category>(selectedCategory);

  const handleCategorySelect = (category: Category) => {
    setCurrentSelected(category);
  };

  const handleUpload = () => {
    onUpload(currentSelected);
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
      avoidKeyboard={true}
      useNativeDriver={true}
      hideModalContentWhileAnimating={false}
      propagateSwipe={true}
    >
      <View style={styles.container}>
        <View style={styles.handleLine} />
        
        <Text style={styles.title}>Choose category</Text>

        <View style={styles.categoriesContainer}>
          {CATEGORIES.map((category) => {
            const isSelected = currentSelected === category;
            return (
              <TouchableOpacity
                key={category}
                style={styles.categoryItem}
                onPress={() => handleCategorySelect(category)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconCircle,
                    isSelected && styles.iconCircleSelected,
                  ]}
                >
                  {isSelected && (
                    <WhiteTickIcon width={16} height={16} />
                  )}
                </View>
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.uploadButtonTouchable}
            onPress={handleUpload}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#000000', '#61240E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.uploadButton}
            >
              <Text style={styles.uploadButtonText}>Upload</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ChooseCategoryModal;

