import React, { useState, type JSX } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './Onboarding.styles';
import { IPHONE_MODELS, GENDER_OPTIONS } from './Onboarding.constants';
import type { AuthStackParamList } from '@/navigation/AuthNavigator/AuthNavigator.types';
import BackButton from '@/assets/svg/back.svg';
import Dropdownicon from '@/assets/svg/dropdown.svg';
import { IOSPicker } from '@/components/features';
// import { initiateSignup } from '@/services';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'OnboardingScreen'
>;

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
      // API call commented out - backend not running
      // await initiateSignup({
      //   creatorName: name,
      //   contactNumber: phoneNumber,
      //   email: email,
      //   portfolio: portfolioLink,
      //   iphoneModel: selectedIphoneModel,
      //   gender: selectedGender,
      //   location: location,
      // });
      // Navigate directly to RegisterScreen to continue the flow
      navigation.navigate('RegisterScreen');
    } catch (error) {
      console.error('Initiate Signup Error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to initiate signup. Please try again.';
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
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
          <Text style={styles.title}>Tell us a bit about yourself</Text>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputsContainer}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={[
                  styles.textInput,
                  focusedField === 'name' && styles.textInputFocused,
                ]}
                value={name}
                onChangeText={setName}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
                returnKeyType="next"
              />
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View
                style={[
                  styles.phoneInputContainer,
                  focusedField === 'phone' && styles.phoneInputContainerFocused,
                ]}
              >
                <View style={styles.phonePrefix}>
                  <Text style={styles.phonePrefixText}>+91</Text>
                  <Dropdownicon />
                </View>
                <TextInput
                  style={styles.phoneTextInput}
                  value={phoneNumber}
                  onChangeText={text =>
                    setPhoneNumber(text.replace(/[^\d]/g, '').slice(0, 10))
                  }
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  maxLength={10}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[
                  styles.textInput,
                  focusedField === 'email' && styles.textInputFocused,
                ]}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>

            {/* Portfolio Link Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Portfolio Link (Optional)</Text>
              <TextInput
                style={[
                  styles.textInput,
                  focusedField === 'portfolio' && styles.textInputFocused,
                ]}
                value={portfolioLink}
                onChangeText={setPortfolioLink}
                onFocus={() => setFocusedField('portfolio')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your portfolio link"
                placeholderTextColor="#9CA3AF"
                keyboardType="url"
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>

            {/* iPhone Model Picker */}
            <IOSPicker
              label="iPhone Model"
              selectedValue={selectedIphoneModel}
              onValueChange={setSelectedIphoneModel}
              items={IPHONE_MODELS}
              placeholder="Select iPhone model"
            />

            {/* Gender Picker */}
            <IOSPicker
              label="Gender"
              selectedValue={selectedGender}
              onValueChange={setSelectedGender}
              items={GENDER_OPTIONS}
              placeholder="Select gender"
            />

            {/* Location Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={[
                  styles.textInput,
                  focusedField === 'location' && styles.textInputFocused,
                ]}
                value={location}
                onChangeText={setLocation}
                onFocus={() => setFocusedField('location')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your location"
                placeholderTextColor="#9CA3AF"
                returnKeyType="done"
              />
            </View>

            {/* Extra space at bottom to prevent content from hiding */}
            <View style={styles.bottomSpacer} />
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={handleVerify}
            disabled={!isFormValid() || loading}
            // style={styles.verifyButtonTouchable}
            activeOpacity={0.7}
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
                <ActivityIndicator color="white" />
              ) : (
                <Text
                  style={[
                    styles.verifyButtonText,
                    !isFormValid() && styles.verifyButtonTextDisabled,
                  ]}
                >
                  Continue
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
