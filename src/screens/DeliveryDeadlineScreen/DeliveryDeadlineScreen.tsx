import React, { useState, useEffect, useRef, type JSX } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { PRIMARY_COLORS } from '../../theme/colors';
import { OTPModal, ChooseCategoryModal, CompleteShootModal, RateCustomerModal } from '../../components/ui';
import type { Category } from '../../components/ui';
import { styles } from './DeliveryDeadlineScreen.styles';
import type { DeliveryDeadlineScreenNavigationProp } from './DeliveryDeadlineScreen.types';

const DeliveryDeadlineScreen = (): JSX.Element => {
  const navigation = useNavigation<DeliveryDeadlineScreenNavigationProp>();
  const [countdown, setCountdown] = useState(3);
  const [countdownComplete, setCountdownComplete] = useState(false);
  const [deadlineStartTime] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showEventTitle, setShowEventTitle] = useState(false);
  const [isOTPModalVisible, setIsOTPModalVisible] = useState(false);
  const [isChooseCategoryModalVisible, setIsChooseCategoryModalVisible] = useState(false);
  const [isCompleteShootModalVisible, setIsCompleteShootModalVisible] = useState(false);
  const [isRateCustomerModalVisible, setIsRateCustomerModalVisible] = useState(false);
  
  // Animations
  const countdownOpacity = useRef(new Animated.Value(1)).current;
  const countdownTranslateY = useRef(new Animated.Value(0)).current;
  const deadlineOpacity = useRef(new Animated.Value(0)).current;
  const deadlineTranslateY = useRef(new Animated.Value(300)).current; // Start from bottom of screen
  const gradientHeight = useRef(new Animated.Value(100)).current; // Start at 100% height

  // Countdown logic
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Animate countdown out and deadline countdown in
      setCountdownComplete(true);
      
      // Hide countdown (move up and fade out)
      Animated.parallel([
        Animated.timing(countdownOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(countdownTranslateY, {
          toValue: -200,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // Show deadline countdown (fade in and slide up from bottom)
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(deadlineOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(deadlineTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();

        // Animate gradient height from 100% to 40% after 1 second delay
        setTimeout(() => {
          Animated.timing(gradientHeight, {
            toValue: 40,
            duration: 600,
            useNativeDriver: false, // height animations don't support native driver
          }).start(() => {
            // Show event title after gradient animation completes
            setTimeout(() => {
              setShowEventTitle(true);
            }, 50);
          });
        }, 1000);
      }, 400);
    }
  }, [countdown, countdownOpacity, countdownTranslateY, deadlineOpacity, deadlineTranslateY, gradientHeight]);

  // Update deadline countdown timer
  useEffect(() => {
    if (countdownComplete) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - deadlineStartTime;
        // Set deadline as 30 minutes from start
        const deadline = 30 * 60 * 1000; // 30 minutes in milliseconds
        const remaining = Math.max(0, deadline - elapsed);
        setTimeRemaining(remaining);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [countdownComplete, deadlineStartTime]);

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleOTPVerify = () => {
    // Handle OTP verification
    console.log('OTP verified - Submit delivery');
    setIsOTPModalVisible(false);
    navigation.goBack();
  };

  const handleOTPResend = () => {
    // Handle OTP resend
    console.log('Resending Submit Delivery OTP');
  };

  const handleUploadPress = () => {
    setIsChooseCategoryModalVisible(true);
  };

  const handleCategoryUpload = (category: Category) => {
    // Handle upload for selected category
    console.log('Uploading for category:', category);
    // TODO: Implement upload logic
  };

  const handleUploadLater = () => {
    setIsCompleteShootModalVisible(true);
  };

  const handleCompleteShoot = () => {
    // Handle complete shoot action
    console.log('Shoot marked as complete');
    // TODO: Implement complete shoot logic
    // Close CompleteShootModal and open RateCustomerModal
    setIsCompleteShootModalVisible(false);
    setIsRateCustomerModalVisible(true);
  };

  const handleRateCustomerHome = () => {
    // Handle home navigation from rate customer modal
    setIsRateCustomerModalVisible(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.gradientContainer,
            {
              height: gradientHeight.interpolate({
                inputRange: [40, 100],
                outputRange: [300, 1000],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={['#000000', PRIMARY_COLORS[900]]}
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
          {/* Countdown View */}
          {!countdownComplete && (
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: countdownOpacity,
                  transform: [{ translateY: countdownTranslateY }],
                },
              ]}
            >
              <Text style={styles.instructionText}>Delivery starts in</Text>
              <Text style={styles.countdownText}>
                {countdown > 0 ? countdown : '0'}
              </Text>
            </Animated.View>
          )}

          {/* Deadline Countdown View - Centered */}
          {countdownComplete && (
            <>
              <View style={styles.deadlineContentWrapper}>
                <Animated.View
                  style={[
                    styles.deadlineContent,
                    {
                      opacity: deadlineOpacity,
                      transform: [{ translateY: deadlineTranslateY }],
                    },
                  ]}
                >
                  <Text style={styles.deadlineLabel}>Delivery deadline</Text>
                  <Text style={styles.deadlineText}>
                    {formatDuration(timeRemaining)}
                  </Text>
                  <Text style={styles.deadlineSubtext}>Upload all required files before timer ends</Text>
                </Animated.View>
              </View>
            </>
          )}
          </LinearGradient>
        </Animated.View>

        {/* Content Below Gradient - Shown after gradient height animation */}
        {showEventTitle && (
          <>
            <View style={styles.eventTitleContainer}>
              <Text style={styles.eventTitle}>Upload Client Data</Text>
            </View>

            {/* Reels Section */}
            <View style={styles.uploadSection}>
              <TouchableOpacity 
                style={styles.uploadCardHeader}
                onPress={() => {}}
                activeOpacity={0.8}
              >
                <View style={styles.uploadCardHeaderContent}>
                  <Text style={styles.uploadCardTitle}>Reels</Text>
                  <Text style={styles.uploadCardSubtitle}>0/2 required</Text>
                </View>
                {/* <View style={styles.chevronIcon}>
                  <Text style={styles.chevronText}>^</Text>
                </View> */}
              </TouchableOpacity>
              <View style={styles.uploadCardContent}>
                <Text style={styles.emptyStateText}>Nothing uploaded here</Text>
              </View>
            </View>

            {/* Pictures Section */}
            <View style={styles.uploadSection}>
              <TouchableOpacity 
                style={styles.uploadCardHeader}
                onPress={() => {}}
                activeOpacity={0.8}
              >
                <View style={styles.uploadCardHeaderContent}>
                  <Text style={styles.uploadCardTitle}>Pictures</Text>
                  <Text style={styles.uploadCardSubtitle}>1/20 optional</Text>
                </View>
                <View style={styles.chevronIcon}>
                  <Text style={styles.chevronText}>^</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.uploadCardContent}>
                <Text style={styles.emptyStateText}>Nothing uploaded here</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Bottom Buttons - Fixed at bottom */}
      {showEventTitle && (
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity 
            style={styles.uploadButtonTouchable}
            onPress={handleUploadPress}
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
          <TouchableOpacity 
            style={styles.uploadLaterButton}
            onPress={handleUploadLater}
            activeOpacity={0.8}
          >
            <Text style={styles.uploadLaterButtonText}>Upload Later</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Submit Delivery OTP Modal */}
      <OTPModal
        isVisible={isOTPModalVisible}
        onClose={() => setIsOTPModalVisible(false)}
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        title="Submit Delivery OTP"
        subtitle="Request the 4-digit OTP from your client to submit delivery"
      />

      {/* Choose Category Modal */}
      <ChooseCategoryModal
        isVisible={isChooseCategoryModalVisible}
        onClose={() => setIsChooseCategoryModalVisible(false)}
        onUpload={handleCategoryUpload}
        selectedCategory="Reels"
      />

      {/* Complete Shoot Modal */}
      <CompleteShootModal
        isVisible={isCompleteShootModalVisible}
        onClose={() => setIsCompleteShootModalVisible(false)}
        onComplete={handleCompleteShoot}
      />

      {/* Rate Customer Modal */}
      <RateCustomerModal
        isVisible={isRateCustomerModalVisible}
        onClose={() => setIsRateCustomerModalVisible(false)}
        onHome={handleRateCustomerHome}
      />
    </View>
  );
};

export default DeliveryDeadlineScreen;

