import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import StarIcon from '@/assets/svg/star.svg';
import RateIcon from '@/assets/svg/rate.svg';
import FillRateIcon from '@/assets/svg/fillrate.svg';
import { styles } from './RateCustomerModal.styles';
import type { RateCustomerModalProps } from './RateCustomerModal.types';

const RateCustomerModal: React.FC<RateCustomerModalProps> = ({
  isVisible,
  onClose,
  onHome,
  initialRating = 4,
}) => {
  const [rating, setRating] = useState(initialRating);

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleHome = () => {
    onHome();
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
        
        <View style={styles.iconContainer}>
          <View style={styles.largeStarContainer}>
            <StarIcon width={120} height={120} />
          </View>
        </View>

        <Text style={styles.title}>Rate customer</Text>

        <View style={styles.starRatingContainer}>
          {[1, 2, 3, 4, 5].map((starIndex) => {
            const isFilled = starIndex <= rating;
            const StarComponent = isFilled ? FillRateIcon : RateIcon;
            return (
              <TouchableOpacity
                key={starIndex}
                onPress={() => handleStarPress(starIndex)}
                activeOpacity={0.7}
                style={styles.starButton}
              >
                <StarComponent
                  width={40}
                  height={40}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.homeButtonTouchable}
            onPress={handleHome}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#000000', '#61240E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.homeButton}
            >
              <Text style={styles.homeButtonText}>Home</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RateCustomerModal;

