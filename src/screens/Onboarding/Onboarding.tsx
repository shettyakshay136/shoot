import React, { useState, type JSX } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './Onboarding.styles';
import { IPHONE_MODELS, GENDER_OPTIONS } from './Onboarding.constants';
import type { AuthStackParamList } from '@/navigation/AuthNavigator/AuthNavigator.types';
import BackButton from '@/assets/svg/back.svg';
import { initiateSignup } from '@/services';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'OnboardingScreen'>;

const OnboardingScreen = (): JSX.Element => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [selectedIphoneModel, setSelectedIphoneModel] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [location, setLocation] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  // Validation logic
  const isFormValid = () => {
    return (
      name.trim() !== '' &&
      phoneNumber.trim() !== '' &&
      email.trim() !== '' &&
      selectedIphoneModel !== '' &&
      selectedGender !== '' &&
      location.trim() !== ''
    );
  };

  const handleVerify = async () => {
    if (!isFormValid()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await initiateSignup({
        creatorName: name,
        contactNumber: phoneNumber,
        email: email,
        portfolio: portfolioLink,
        iphoneModel: selectedIphoneModel,
        gender: selectedGender,
        location: location,
      });
      // Navigate to OTP screen with phone number
      navigation.navigate('OtpScreen', { phoneNumber, flow: 'signup' });
    } catch (error) {
      console.error('Initiate Signup Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate signup. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
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
            <BackButton/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleHelp} style={styles.helpButton}>
            <Text style={styles.helpButtonText}>Help</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.content}>
            <Text style={styles.title}>Tell us a bit about yourself</Text>
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.inputsContainer}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={[
                  styles.textInput,
                  focusedField === 'name' && styles.textInputFocused
                ]}
                value={name}
                onChangeText={setName}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={[
                styles.phoneInputContainer,
                focusedField === 'phone' && styles.phoneInputContainerFocused
              ]}>
                <View style={styles.phonePrefix}>
                  <Text style={styles.phonePrefixText}>+91</Text>
                </View>
                <TextInput
                  style={styles.phoneTextInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[
                  styles.textInput,
                  focusedField === 'email' && styles.textInputFocused
                ]}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Portfolio Link Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Portfolio Link (Optional)</Text>
              <TextInput
                style={[
                  styles.textInput,
                  focusedField === 'portfolio' && styles.textInputFocused
                ]}
                value={portfolioLink}
                onChangeText={setPortfolioLink}
                onFocus={() => setFocusedField('portfolio')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your portfolio link"
                placeholderTextColor="#9CA3AF"
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            {/* iPhone Model Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>iPhone Model</Text>
              <TouchableOpacity
                style={[
                  styles.dropdownButton,
                  focusedField === 'iphone' && styles.textInputFocused
                ]}
                onPress={() => setFocusedField(focusedField === 'iphone' ? null : 'iphone')}
              >
                <Text style={[
                  styles.dropdownText,
                  !selectedIphoneModel && styles.placeholderText
                ]}>
                  {selectedIphoneModel || 'Select iPhone model'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
              {focusedField === 'iphone' && (
                <View style={styles.dropdownList}>
                  {IPHONE_MODELS.map((model, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedIphoneModel(model);
                        setFocusedField(null);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{model}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Gender Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gender</Text>
              <TouchableOpacity
                style={[
                  styles.dropdownButton,
                  focusedField === 'gender' && styles.textInputFocused
                ]}
                onPress={() => setFocusedField(focusedField === 'gender' ? null : 'gender')}
              >
                <Text style={[
                  styles.dropdownText,
                  !selectedGender && styles.placeholderText
                ]}>
                  {selectedGender || 'Select gender'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
              {focusedField === 'gender' && (
                <View style={styles.dropdownList}>
                  {GENDER_OPTIONS.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedGender(option);
                        setFocusedField(null);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Location Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={[
                  styles.textInput,
                  focusedField === 'location' && styles.textInputFocused
                ]}
                value={location}
                onChangeText={setLocation}
                onFocus={() => setFocusedField('location')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your location"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={handleVerify}
            disabled={!isFormValid() || loading}
            style={styles.verifyButtonTouchable}
          >
            <LinearGradient
              colors={['#000000', '#61240E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.verifyButton,
                (!isFormValid() || loading) && styles.verifyButtonDisabled
              ]}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={[
                  styles.verifyButtonText,
                  !isFormValid() && styles.verifyButtonTextDisabled
                ]}>Continue</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
