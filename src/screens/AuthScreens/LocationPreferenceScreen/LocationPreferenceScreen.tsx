import React, { useState, type JSX } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './LocationPreferenceScreen.styles';
import type { RootStackParamList } from '@/navigation/types';
import BackButton from '@/assets/svg/back.svg';
import { SimpleModal } from '@/components';
import BoomSvg from '@/assets/svg/boom.svg';
import { updateCreatorProfile } from '@/services';
import { useToast } from '@/contexts';
import { AUTH_TOKEN_KEY } from '@/contexts/AuthContext';
import { getCoordinatesForCity } from '@/utils/geolocation';

type LocationPreferenceScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'App'
>;

const LocationPreferenceScreen = (): JSX.Element => {
  const navigation = useNavigation<LocationPreferenceScreenNavigationProp>();
  const { showToast } = useToast();
  const [selectedCity, setSelectedCity] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // List of cities
  const cities = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Surat',
    'Lucknow',
    'Kanpur',
    'Nagpur',
    'Indore',
    'Thane',
    'Bhopal',
    'Visakhapatnam',
    'Pimpri-Chinchwad',
    'Patna',
    'Vadodara',
    'Ghaziabad',
    'Ludhiana',
    'Agra',
    'Nashik',
    'Faridabad',
  ];

  // Validation logic
  const isFormValid = () => {
    return selectedCity.trim() !== '';
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsDropdownOpen(false);
  };

  const handleContinue = async () => {
    if (!isFormValid()) return;

    setLoading(true);
    try {
      // Get access token from AsyncStorage
      const accessToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

      if (!accessToken) {
        showToast('Authentication required. Please login again.', 'error');
        return;
      }

      // Get coordinates for the selected city
      const coordinates = getCoordinatesForCity(selectedCity);

      if (!coordinates) {
        showToast(
          'Unable to fetch coordinates for the selected city.',
          'error',
        );
        return;
      }

      // Send coordinates in GeoJSON Point format
      await updateCreatorProfile(
        {
          primaryLocation: selectedCity,
          primaryLocationCoordinates: {
            type: 'Point',
            coordinates: [coordinates.longitude, coordinates.latitude],
          },
        },
        accessToken,
      );

      // Show success modal
      setIsModalVisible(true);
    } catch (error: any) {
      console.error('Error updating location:', error);
      showToast(
        error?.message || 'Failed to update location. Please try again.',
        'error',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleCheckStatus = () => {
    setIsModalVisible(false);
    navigation.navigate('Auth', { screen: 'ApplicationScreen' });
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
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <BackButton />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleHelp} style={styles.helpButton}>
          <Text style={styles.helpButtonText}>Help</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>
          Choose the city you want to create magic with content
        </Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Select City</Text>
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
              <Text style={styles.dropdownArrow}>
                {isDropdownOpen ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {isDropdownOpen && (
              <View style={styles.dropdownList}>
                {cities.map((city, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => handleCitySelect(city)}
                  >
                    <Text style={styles.dropdownItemText}>{city}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!isFormValid() || loading}
          style={styles.verifyButtonTouchable}
        >
          <LinearGradient
            colors={['#000000', '#61240E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.verifyButton,
              (!isFormValid() || loading) && styles.verifyButtonDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text
                style={[
                  styles.verifyButtonText,
                  !isFormValid() && styles.verifyButtonTextDisabled,
                ]}
              >
                Confirm City
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <SimpleModal isVisible={isModalVisible} onClose={handleCloseModal}>
        <View style={styles.bottomSheetContent}>
          <View style={styles.iconContainer}>
            <BoomSvg />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.successTitle}>You're All Set!</Text>
            <Text style={styles.successSubtitle}>
              Your application has been successfully submitted and is now under
              review.
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

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleCheckStatus}
          >
            <LinearGradient
              colors={['#000000', '#61240E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.confirmButtonGradient}
            >
              <Text style={styles.confirmButtonText}>Check Status</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SimpleModal>
    </SafeAreaView>
  );
};

export default LocationPreferenceScreen;
