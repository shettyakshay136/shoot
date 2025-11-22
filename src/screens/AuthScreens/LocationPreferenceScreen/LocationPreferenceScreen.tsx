import React, { useMemo, useState, useEffect, useRef, type JSX } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Platform, PermissionsAndroid, InteractionManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import { styles } from './LocationPreferenceScreen.styles';
import type { AuthStackParamList } from '@/navigation/AuthNavigator/AuthNavigator.types';
import BackButton from '@/assets/svg/back.svg';
import { SimpleModal } from '@/components/layout';
import BoomSvg from '@/assets/svg/boom.svg';
import Infoicon from '@/assets/svg/info.svg';
import Dropdownicon from '@/assets/svg/dropdown.svg';
import ArrowUp from '@/assets/svg/arrow-up-right.svg';
import { useToast } from '@/contexts';
import { useCitySearch } from '@/utils/hooks/useCitySearch';
import { reverseGeocode } from '@/utils/services/geocoding';
import CelebrationAnimation from '@/assets/animation/celebration.json'
import MiniCelebrationAnimation from '@/assets/animation/mini_celebration.json'

// Conditionally import Geolocation to handle cases where native module isn't linked
let Geolocation: any = null;
try {
  Geolocation = require('react-native-geolocation-service');
} catch (error) {
  console.warn('react-native-geolocation-service not available:', error);
}

type LocationPreferenceScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'LocationPreferenceScreen'
>;

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

const LocationPreferenceScreen = (): JSX.Element => {
  const navigation = useNavigation<LocationPreferenceScreenNavigationProp>();
  const { showToast } = useToast();
  const [selectedCity, setSelectedCity] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [locationCoordinates, setLocationCoordinates] = useState<LocationCoordinates | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [query, setQuery] = useState('');
  const lottieRef = useRef<LottieView>(null);
  const miniLottieRef = useRef<LottieView>(null);

  // Use city search hook for dynamic city search
  const { results, loading: searchLoading } = useCitySearch(query, isDropdownOpen && query.length >= 2);

  // Fallback cities list
  const fallbackCities = useMemo(
    () => [
      'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
      'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur',
      'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
      'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad'
    ],
    [],
  );

  // Combine search results with fallback cities
  const cities = useMemo(() => {
    if (query && query.length >= 2 && results.length > 0) {
      return results.map(r => r.name);
    }
    return fallbackCities;
  }, [query, results, fallbackCities]);

  useEffect(() => {
    requestLocationPermissionAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestLocationPermissionAndFetch = async () => {
    try {
      if (Platform.OS === 'android') {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (!hasPermission) {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'We need your location to suggest the best city for you.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'Allow',
            },
          );

          if (result !== PermissionsAndroid.RESULTS.GRANTED) {
            return;
          }
        }
      }

      await fetchCurrentLocation();
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const fetchCurrentLocation = async () => {
    if (!Geolocation) {
      console.warn('Geolocation service not available');
      setIsLoadingLocation(false);
      return;
    }

    setIsLoadingLocation(true);
    try {
      Geolocation.getCurrentPosition(
        async (position: any) => {
          const { latitude, longitude } = position.coords;
          setLocationCoordinates({ latitude, longitude });

          try {
            const cityResult = await reverseGeocode(latitude, longitude);
            if (cityResult) {
              setSelectedCity(cityResult.name);
            }
          } catch (geocodeError) {
            console.error('Geocoding error:', geocodeError);
          }
        },
        (error: any) => {
          console.warn('Location fetch error:', error.code, error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    } catch (error) {
      console.error('Geolocation error:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Validation logic
  const isFormValid = () => {
    return selectedCity.trim() !== '';
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsDropdownOpen(false);
    setQuery('');

    // Find coordinates for selected city
    const cityResult = results.find(r => r.name === city);
    if (cityResult) {
      setLocationCoordinates({
        latitude: cityResult.latitude,
        longitude: cityResult.longitude,
      });
    } else {
      // If not in search results, try to get from fallback or set null
      // The API will handle this when submitting
      setLocationCoordinates(null);
    }
  };

  const handleContinue = async () => {
    if (!isFormValid()) {
      showToast('Please select a city', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // const accessToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      // if (!accessToken) {
      //   showToast('Authentication token not found', 'error');
      //   setIsSubmitting(false);
      //   return;
      // }

      // // Get coordinates from selected city or use null (API will handle)
      // let coords = locationCoordinates;
      // if (!coords) {
      //   // Try to find in results
      //   const cityResult = results.find(r => r.name === selectedCity);
      //   if (cityResult) {
      //     coords = {
      //       latitude: cityResult.latitude,
      //       longitude: cityResult.longitude,
      //     };
      //   }
      // }

      // const payload: any = {
      //   primaryLocation: selectedCity,
      // };

      // if (coords) {
      //   payload.primaryLocationCoordinates = {
      //     type: 'Point',
      //     coordinates: [coords.longitude, coords.latitude],
      //   };
      // }

      // await updateCreatorProfile(payload);

      // console.log('Location Update Response:', JSON.stringify({ success: true }, null, 2));

      // showToast('Location updated successfully!', 'success');
      setIsModalVisible(true);
    } catch (error: any) {
      console.error('Error updating location:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update location. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (isModalVisible) {
      // Delay animation playback until after modal animation completes (200ms)
      // This prevents performance issues and ensures smooth modal opening
      const playTimeout = setTimeout(() => {
        InteractionManager.runAfterInteractions(() => {
          lottieRef.current?.play();
          miniLottieRef.current?.play();
        });
      }, 250); // Slightly longer than modal animation (200ms) to ensure it's fully visible

      return () => {
        clearTimeout(playTimeout);
      };
    } else {
      // Reset animations when modal closes
      lottieRef.current?.reset();
      miniLottieRef.current?.reset();
    }
  }, [isModalVisible]);

  const handleCheckStatus = () => {
    navigation.replace('ApplicationScreen', {});
    setIsModalVisible(false);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleHelp = () => {
    // Handle help action
    console.log('Show help');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{paddingHorizontal:23 , flex:1 , gap:20}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <BackButton />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleHelp} style={styles.helpButton}>
          <Infoicon />
          <Text style={styles.helpButtonText}>Help</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Choose the city you want to create magic with content</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Select City</Text>
          {isLoadingLocation && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, padding: 12, backgroundColor: '#EFF6FF', borderRadius: 8 }}>
              <ActivityIndicator size="small" color="#61240E" />
              <Text style={{ color: '#1E40AF', fontSize: 12 }}>Getting your location...</Text>
            </View>
          )}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={[
                styles.dropdownButton,
                focusedField === 'city' && styles.dropdownButtonFocused,
              ]}
              onPress={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setFocusedField('city');
              }}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !selectedCity && styles.placeholderText,
                ]}
              >
                {selectedCity || 'Select your city'}
              </Text>
              {isDropdownOpen ? (
                <Dropdownicon />
              ) : (
                <Dropdownicon style={{ transform: [{ rotate: '180deg' }] }} />
              )}
            </TouchableOpacity>

            {isDropdownOpen && (
              <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                {searchLoading && (
                  <View style={{ padding: 16, alignItems: 'center' }}>
                    <ActivityIndicator size="small" color="#61240E" />
                  </View>
                )}
                {cities.map((city, index) => {
                  const isSelected = city === selectedCity;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dropdownItem,
                        isSelected && styles.dropdownItemSelected,
                      ]}
                      onPress={() => handleCitySelect(city)}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          isSelected && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {city}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!isFormValid() || isSubmitting}
          style={styles.verifyButtonTouchable}
        >
          <LinearGradient
            colors={['#000000', '#61240E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.verifyButton,
              (!isFormValid() || isSubmitting) && styles.verifyButtonDisabled,
            ]}
          >
            {isSubmitting && <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />}
            <Text
              style={[
                styles.verifyButtonText,
                !isFormValid() && styles.verifyButtonTextDisabled,
              ]}
            >
              {isSubmitting ? 'Saving Location...' : 'Confirm City'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <SimpleModal isVisible={isModalVisible} onClose={handleCloseModal}>
        <View style={styles.bottomSheetContent}>
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              {/* Main Lottie animation overlay */}
              <View style={styles.lottieOverlay} pointerEvents="none">
                <LottieView
                  ref={lottieRef}
                  source={CelebrationAnimation}
                  autoPlay={false}
                  loop={false}
                  style={styles.lottieAnimation}
                  renderMode="HARDWARE"
                  resizeMode='cover'
                />
              </View>
              {/* Boom SVG */}
              <View style={styles.boomSvgContainer} pointerEvents="none">
                <BoomSvg />
              </View>
              {/* Mini Lottie animation overlay */}
              <View style={styles.miniLottieOverlay} pointerEvents="none">
                <LottieView
                  ref={miniLottieRef}
                  source={MiniCelebrationAnimation}
                  autoPlay={false}
                  loop={false}
                  style={styles.miniLottieAnimation}
                  renderMode="HARDWARE"
                />
              </View>
            </View>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.successTitle}>You're All Set!</Text>
            <Text style={styles.successSubtitle}>
              Your application has been successfully submitted and is now under review.
            </Text>
          </View>
          <View>
            <Text style={styles.whatHappensNext}>What happens next?</Text>
            <View style={styles.stepsContainer}>
              <View style={styles.steps}>
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Review Process</Text>
                    <Text style={styles.stepDescription}>
                      Our team will review your application within 24-48 hours
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.steps}>
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Instant Notification</Text>
                    <Text style={styles.stepDescription}>
                      You'll receive an SMS and WhatsApp update once approved
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.steps}>
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Start Using</Text>
                    <Text style={styles.stepDescription}>
                      Access all features immediately after approval
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={handleCheckStatus}>
            <LinearGradient
              colors={['#000000', '#61240E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.confirmButtonGradient}
            >
              <Text style={styles.confirmButtonText}>Check Status</Text>
              <ArrowUp />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SimpleModal>
      </View>
    </SafeAreaView>
  );
};

export default LocationPreferenceScreen;
