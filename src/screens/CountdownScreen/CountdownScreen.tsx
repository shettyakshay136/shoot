import React, { useState, useEffect, useRef, type JSX } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PRIMARY_COLORS } from '../../theme/colors';
import { OTPModal } from '../../components/ui';
import type { ShootStackParamList } from '../../navigation/stacks/ShootStack/ShootStack.types';

type CountdownScreenNavigationProp = NativeStackNavigationProp<ShootStackParamList, 'CountdownScreen'>;

const CountdownScreen = (): JSX.Element => {
  const navigation = useNavigation<CountdownScreenNavigationProp>();
  const [countdown, setCountdown] = useState(3);
  const [countdownComplete, setCountdownComplete] = useState(false);
  const [shootStartTime] = useState(Date.now());
  const [shootDuration, setShootDuration] = useState(0);
  const [showEventTitle, setShowEventTitle] = useState(false);
  const [isOTPModalVisible, setIsOTPModalVisible] = useState(false);
  
  // Animations
  const countdownOpacity = useRef(new Animated.Value(1)).current;
  const countdownTranslateY = useRef(new Animated.Value(0)).current;
  const shootDurationOpacity = useRef(new Animated.Value(0)).current;
  const shootDurationTranslateY = useRef(new Animated.Value(300)).current; // Start from bottom of screen
  const gradientHeight = useRef(new Animated.Value(100)).current; // Start at 100% height

  // Countdown logic
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Animate countdown out and shoot duration in
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

      // Show shoot duration (fade in and slide up from bottom)
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(shootDurationOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(shootDurationTranslateY, {
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
  }, [countdown, countdownOpacity, countdownTranslateY, shootDurationOpacity, shootDurationTranslateY, gradientHeight]);

  // Update shoot duration timer
  useEffect(() => {
    if (countdownComplete) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - shootStartTime;
        setShootDuration(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [countdownComplete, shootStartTime]);

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleEndShoot = () => {
    // Open OTP modal
    setIsOTPModalVisible(true);
  };

  const handleOTPVerify = () => {
    // Handle OTP verification
    console.log('OTP verified - End shoot');
    setIsOTPModalVisible(false);
    // Navigate to DeliveryDeadlineScreen
    navigation.navigate('DeliveryDeadlineScreen');
  };

  const handleOTPResend = () => {
    // Handle OTP resend
    console.log('Resending End Shoot OTP');
  };

  return (
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
              outputRange: [400, 1000],
            }),
            minHeight: 400,
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
            <Text style={styles.instructionText}>Shoot starts in</Text>
            <Text style={styles.countdownText}>
              {countdown > 0 ? countdown : '0'}
            </Text>
          </Animated.View>
        )}

        {/* Shoot Duration View - Centered */}
        {countdownComplete && (
          <>
            <View style={styles.shootContentWrapper}>
              <Animated.View
                style={[
                  styles.shootContent,
                  {
                    opacity: shootDurationOpacity,
                    transform: [{ translateY: shootDurationTranslateY }],
                  },
                ]}
              >
                <Text style={styles.shootDurationLabel}>Shoot Duration</Text>
                <Text style={styles.shootDurationText}>
                  {formatDuration(shootDuration)}
                </Text>
              </Animated.View>
            </View>

            {/* End Shoot Button - At Bottom */}
            <Animated.View
              style={[
                styles.buttonContainer,
                {
                  opacity: shootDurationOpacity,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.endShootButton}
                onPress={handleEndShoot}
              >
                <Text style={styles.endShootButtonText}>End Shoot</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
        </LinearGradient>
      </Animated.View>

      {/* Content Below Gradient - Shown after gradient height animation */}
      {showEventTitle && (
        <>
          <View style={styles.eventTitleContainer}>
            <Text style={styles.eventTitle}>Corporate Event - Tech Conference</Text>
          </View>

          {/* Requirement Section */}
          <View style={styles.requirementSection}>
            <Text style={styles.requirementTitle}>Event details</Text>
            
            <View style={styles.requirementCard}>
              <View style={styles.requirementRow}>
                <Text style={styles.requirementLabel}>Shoot hours</Text>
                <Text style={styles.requirementValue}>7:00 PM to 9:00 PM (2hrs)</Text>
              </View>
              <View style={styles.requirementRow}>
                <Text style={styles.requirementLabel}>Reels required</Text>
                <Text style={styles.requirementValue}>2 reels</Text>
              </View>
              <View style={styles.requirementRow}>
                <Text style={styles.requirementLabel}>Instant delivery</Text>
                <Text style={styles.instantDelivery}>Within 30 minutes</Text>
              </View>
              <View style={styles.addonsWrapper}>
                <Text style={styles.addonsTitle}>Add ons</Text>
                <View style={styles.addonsContainer}>
                  <View style={styles.addonPill}>
                    <Text style={styles.addonText}>Pictures (Up to 20)</Text>
                  </View>
                  <View style={styles.addonPill}>
                    <Text style={styles.addonText}>Raw data required</Text>
                  </View>
                  <View style={styles.addonPill}>
                    <Text style={styles.addonText}>Mic</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>Short description</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>
                This high-profile corporate tech conference will feature keynote sessions, product demos, startup showcases, and panel discussions with industry leaders across AI, SaaS, and enterprise innovation.
              </Text>
            </View>
          </View>

          {/* Audio Section */}
          <View style={styles.audioSection}>
            <View style={styles.audioHeader}>
              <Text style={styles.audioTitle}>Audio preference</Text>
              <TouchableOpacity style={styles.suggestButton}>
                <Text style={styles.suggestButtonText}>Suggest songs</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.songsList}>
              <View style={styles.songCard}>
                <View style={[styles.songThumbnail, { backgroundColor: '#FF6E9C' }]} />
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle}>Boujee</Text>
                  <Text style={styles.songArtist}>Wowashwow (via Soundstripe)</Text>
                </View>
              </View>
              <View style={styles.songCard}>
                <View style={[styles.songThumbnail, { backgroundColor: '#FFD700' }]} />
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle}>L'amour Au Café</Text>
                  <Text style={styles.songArtist}>Rêves Français (via Soundstripe)</Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}

      {/* End Shoot OTP Modal */}
      <OTPModal
        isVisible={isOTPModalVisible}
        onClose={() => setIsOTPModalVisible(false)}
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        title="End Shoot OTP"
        subtitle="Request the 4-digit OTP from your client to end the shoot"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  gradientBackground: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  countdownText: {
    fontSize: 120,
    fontWeight: '700',
    fontFamily: 'Saans TRIAL',
    color: '#FFFFFF',
    letterSpacing: -2,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Saans TRIAL',
    color: '#FDD8AB',
  },
  shootContentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shootContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  shootDurationLabel: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Saans TRIAL',
    color: '#FDD8AB',
    letterSpacing: 0.5,
  },
  shootDurationText: {
    fontSize: 72,
    fontWeight: '700',
    fontFamily: 'Saans TRIAL',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  shootDurationTarget: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Saans TRIAL',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    width: '100%',
  },
  endShootButton: {
    backgroundColor: '#FFFFFF1F',
    borderRadius: 10000,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endShootButtonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Saans TRIAL',
    color: 'white',
  },
  eventTitleContainer: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 12,
  },
  eventTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '700',
    fontSize: 30,
    lineHeight: 38,
    color: '#252B37',
  },
  requirementSection: {
    paddingHorizontal: 18,
    paddingTop: 24,
  },
  requirementTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Saans TRIAL',
    color: '#181D27',
    marginBottom: 16,
  },
  requirementCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requirementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  requirementLabel: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Saans TRIAL',
    color: '#181D27',
  },
  requirementValue: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Saans TRIAL',
    color: '#181D27',
  },
  instantDelivery: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Saans TRIAL',
    color: '#181D27',
  },
  addonsWrapper: {
    marginTop: 20,
  },
  addonsTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Saans TRIAL',
    color: '#181D27',
    marginBottom: 12,
  },
  addonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  addonPill: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addonText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Saans TRIAL',
    color: '#181D27',
  },
  descriptionSection: {
    paddingHorizontal: 18,
    paddingTop: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Saans TRIAL',
    color: '#181D27',
    marginBottom: 16,
  },
  descriptionCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Saans TRIAL',
    color: '#181D27',
    lineHeight: 24,
  },
  audioSection: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 24,
  },
  audioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  audioTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Saans TRIAL',
    color: '#181D27',
  },
  suggestButton: {
    backgroundColor: '#FF6E9C',
    borderRadius: 10000,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  suggestButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Saans TRIAL',
    color: 'white',
  },
  songsList: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  songThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Saans TRIAL',
    color: '#181D27',
  },
  songArtist: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Saans TRIAL',
    color: 'rgba(24, 29, 39, 0.7)',
  },
});

export default CountdownScreen;

