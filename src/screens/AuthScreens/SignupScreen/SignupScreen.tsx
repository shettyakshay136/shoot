import React, { useState, type JSX } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './Signup.styles';
import { IPHONE_MODELS, GENDER_OPTIONS } from './Signup.constants';
import type { AuthStackParamList } from '@/navigation/AuthNavigator/AuthNavigator.types';
import BackButton from '@/assets/svg/back.svg';
import Dropdownicon from '@/assets/svg/dropdown.svg';
import { creatorSignupInitiate } from '@/services/auth';
import { useToast } from '@/contexts';
type SignupScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'SignupScreen'
>;

const SignupScreen = (): JSX.Element => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { showToast } = useToast();
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
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    const phoneOk = /^\d{10}$/.test(phoneDigits);
    const emailOk = email.length === 0 || /.+@.+\..+/.test(email);
    
    return (
      name.trim() !== '' &&
      phoneOk &&
      emailOk &&
      selectedIphoneModel !== '' &&
      selectedGender !== '' &&
      location.trim() !== ''
    );
  };

  const handleVerify = async () => {
    if (!isFormValid()) {
      const phoneDigits = phoneNumber.replace(/\D/g, '');
      if (!/^\d{10}$/.test(phoneDigits)) {
        showToast('Please enter a valid 10-digit phone number', 'error');
      } else if (email && !/.+@.+\..+/.test(email)) {
        showToast('Please enter a valid email address', 'error');
      } else {
        showToast('Please fill all required fields', 'error');
      }
      return;
    }

    setLoading(true);
    try {
      const phoneDigits = phoneNumber.replace(/\D/g, '');
      
      const response = await creatorSignupInitiate({
        creatorName: name.trim(),
        contactNumber: phoneDigits,
        email: email.trim(),
        portfolio: portfolioLink.trim(),
        iphoneModel: selectedIphoneModel,
        gender: selectedGender,
        location: location.trim(),
      });
      
      console.log('Signup Initiate Response:', JSON.stringify(response, null, 2));
      
      showToast(`Verification code sent to your phone: ${response.data.otp}`, 'success');

      navigation.navigate('OtpScreen', {
        phoneNumber: phoneDigits,
        flow: 'signup',
      });
    } catch (error: any) {
      console.error('Initiate Signup Error:', error);
      showToast(
        error?.message || 'Failed to initiate signup. Please try again.',
        'error',
      );
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
      <View style={{paddingHorizontal:23 ,     flex: 1, gap:20}}>
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
      <ScrollView style={styles.scrollView} showsHorizontalScrollIndicator={false}>
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
              </View>
              <TextInput
                style={styles.phoneTextInput}
                value={phoneNumber}
                onChangeText={(text) => {
                  // Remove any non-digit characters and limit to 10 digits
                  const digitsOnly = text.replace(/\D/g, '').slice(0, 10);
                  setPhoneNumber(digitsOnly);
                }}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={10}
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
            />
          </View>

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
                <Dropdownicon />
              </TouchableOpacity>
              {focusedField === 'iphone' && (
                <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                  {IPHONE_MODELS.map((model, index) => {
                    const isSelected = model === selectedIphoneModel;
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownItem,
                          isSelected && styles.dropdownItemSelected,
                        ]}
                        onPress={() => {
                          setSelectedIphoneModel(model);
                          setFocusedField(null);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          isSelected && styles.dropdownItemTextSelected,
                        ]}>{model}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>

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
                <Dropdownicon />
              </TouchableOpacity>
              {focusedField === 'gender' && (
                <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                  {GENDER_OPTIONS.map((option, index) => {
                    const isSelected = option === selectedGender;
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownItem,
                          isSelected && styles.dropdownItemSelected,
                        ]}
                        onPress={() => {
                          setSelectedGender(option);
                          setFocusedField(null);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          isSelected && styles.dropdownItemTextSelected,
                        ]}>{option}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>


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
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;
