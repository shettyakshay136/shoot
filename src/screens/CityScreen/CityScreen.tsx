import React, { useState, type JSX } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './CityScreen.styles';
import { CITIES } from './CityScreen.constants';
import type { AuthStackParamList } from '@/navigation/AuthNavigator/AuthNavigator.types';
import BackButton from '@/assets/svg/back.svg';
import { SimpleModal } from '@/components/layout';
import BoomSvg from '@/assets/svg/boom.svg';
import Dropdownicon from '@/assets/svg/dropdown.svg';
import ArrowUp from '@/assets/svg/arrow-up-right.svg'

type CityScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'CityScreen'
>;

const CityScreen = (): JSX.Element => {
  const navigation = useNavigation<CityScreenNavigationProp>();
  const [selectedCity, setSelectedCity] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isFormValid = () => {
    return selectedCity.trim() !== '';
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsDropdownOpen(false);
  };

  const handleContinue = () => {
    if (isFormValid()) {
      setIsModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleCheckStatus = () => {
    setIsModalVisible(false);
    navigation.navigate('ApplicationStatusScreen');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleHelp = () => {
    console.log('Show help');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
                  {isDropdownOpen ? <Dropdownicon/> : <Dropdownicon style={{transform:[{rotate:'180deg'}]}}/>}
                
                </TouchableOpacity>

                {isDropdownOpen && (
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                    {CITIES.map((city, index) => {
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
                          <Text style={[
                            styles.dropdownItemText,
                            isSelected && styles.dropdownItemTextSelected,
                          ]}>{city}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!isFormValid()}
            style={styles.verifyButtonTouchable}
          >
            <LinearGradient
              colors={['#000000', '#61240E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.verifyButton,
                !isFormValid() && styles.verifyButtonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.verifyButtonText,
                  !isFormValid() && styles.verifyButtonTextDisabled,
                ]}
              >
                Confirm City
              </Text>
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
                Your application has been successfully submitted and is now
                under review.
              </Text>
            </View>
            <View>
              <Text style={styles.whatHappensNext}>What happens next?</Text>
              <View style={styles.stepsContainer}>
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Application Review</Text>
                    <Text style={styles.stepDescription}>
                      We'll review your details and get back within 48 hours
                    </Text>
                  </View>
                </View>
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Approval & Setup</Text>
                    <Text style={styles.stepDescription}>
                      Once approved, we'll set up your creator profile
                    </Text>
                  </View>
                </View>
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Start Creating</Text>
                    <Text style={styles.stepDescription}>
                      Access shoots and start earning immediately
                    </Text>
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
                <ArrowUp/>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SimpleModal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CityScreen;
