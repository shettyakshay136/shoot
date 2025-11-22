// LocationPreferenceScreen.tsx
import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  UIManager,
  findNodeHandle,
  TextInput,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from 'react-native-geolocation-service';
import Header from '@/utils/ui/auth/Header';
import { ROG } from '@/utils/config/theme.config';
import SignupAllSetScreen from '@/utils/ui/auth/signup/allSet';
import SlideDownModal from '@/utils/ui/common/SlideDownModal';
import { useCitySearch } from '@/utils/hooks/useCitySearch';
import { updateCreatorProfile } from '@/utils/server/auth';
import { getUserAccessToken } from '@/utils/server/session';
import { reverseGeocode } from '@/utils/services/geocoding';

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export default function LocationPreferenceScreen() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [locationCoordinates, setLocationCoordinates] =
    useState<LocationCoordinates | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const pickerRef = useRef<View>(null);

  const { results, loading, isIdle } = useCitySearch(query, dropdownVisible);

  const canContinue = useMemo(() => !!selectedCity, [selectedCity]);

  useEffect(() => {
    requestLocationPermissionAndFetch();
  });

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
              message:
                'We need your location to suggest the best city for you.',
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
    setIsLoadingLocation(true);
    try {
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          setLocationCoordinates({ latitude, longitude });

          try {
            const cityResult = await reverseGeocode(latitude, longitude);
            if (cityResult) {
              setSelectedCity(cityResult.name);
              setQuery(cityResult.name);
            }
          } catch (geocodeError) {
            console.error('Geocoding error:', geocodeError);
          }
        },
        error => {
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

  const onConfirm = async () => {
    if (!canContinue || !locationCoordinates) return;
    setIsSubmitting(true);

    try {
      const accessToken = await getUserAccessToken();
      if (!accessToken) {
        Alert.alert('Error', 'Authentication token not found');
        setIsSubmitting(false);
        return;
      }

      await updateCreatorProfile(
        {
          primaryLocation: selectedCity,
          primaryLocationCoordinates: {
            type: 'Point',
            coordinates: [
              locationCoordinates.longitude,
              locationCoordinates.latitude,
            ],
          },
        },
        accessToken,
      );

      setModalVisible(true);
    } catch (error) {
      console.error('Error updating location:', error);
      Alert.alert('Error', 'Failed to update location. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDropdown = () => {
    const handle = findNodeHandle(pickerRef.current);
    if (handle) {
      UIManager.measureInWindow(handle, (x, y, width, height) => {
        setDropdownLayout({ x, y, width, height: height + 32 });
        setDropdownVisible(true);
        setTimeout(() => setQuery(selectedCity || ''), 0);
      });
    }
  };

  const onSelect = (name: string, coords: LocationCoordinates) => {
    setSelectedCity(name);
    setLocationCoordinates(coords);
    setDropdownVisible(false);
  };

  // If user chose from typed search, map results to UI
  const items = useMemo(() => {
    return results.map(r => ({
      key: r.id,
      label: r.name,
      coords: { latitude: r.latitude, longitude: r.longitude },
    }));
  }, [results]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Header helpOpen={helpOpen} setHelpOpen={setHelpOpen} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          <View>
            <Text className="text-neutral-900 text-[20px] font-bold mb-1">
              Choose the city you want to
            </Text>
            <Text className="text-neutral-900 text-[20px] font-bold mb-4">
              create magic with content
            </Text>

            <Text className="text-neutral-700 text-[12px] mb-1">
              Select City
            </Text>

            {isLoadingLocation && (
              <View className="flex-row items-center gap-2 mb-3 p-3 bg-blue-50 rounded-lg">
                <ActivityIndicator size="small" color={ROG.primary[600]} />
                <Text className="text-blue-700 text-[12px]">
                  Getting your location...
                </Text>
              </View>
            )}

            <Pressable
              ref={pickerRef}
              onPress={openDropdown}
              className="border border-neutral-300 rounded-xl px-4 py-3 flex-row items-center justify-between bg-white active:opacity-90"
            >
              <Text
                className={`text-[14px] ${
                  selectedCity ? 'text-neutral-900' : 'text-neutral-400'
                }`}
              >
                {selectedCity || 'Search & select a city'}
              </Text>
              <Ionicons
                name="chevron-down"
                size={18}
                color={ROG.neutral[300]}
              />
            </Pressable>

            <Pressable
              onPress={onConfirm}
              disabled={!canContinue || isSubmitting}
              className="w-full rounded-full mt-10 overflow-hidden"
            >
              <LinearGradient
                colors={
                  canContinue && !isSubmitting
                    ? [ROG.primary[900], ROG.primary[800]]
                    : ['#E5E7EB', '#D1D5DB']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ paddingVertical: 16, borderRadius: 999 }}
              >
                <View className="flex-row items-center justify-center gap-2">
                  {isSubmitting && (
                    <ActivityIndicator size="small" color="white" />
                  )}
                  <Text
                    className={`text-center font-semibold text-[15px] ${
                      canContinue && !isSubmitting
                        ? 'text-white'
                        : 'text-neutral-600'
                    }`}
                  >
                    {isSubmitting ? 'Saving Location...' : 'Confirm City'}
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Dropdown overlay with search + scroll */}
      {dropdownVisible && dropdownLayout && (
        <View className="absolute inset-0">
          <Pressable
            className="absolute inset-0"
            onPress={() => setDropdownVisible(false)}
          />
          <View
            className="absolute bg-white rounded-2xl shadow-lg border border-neutral-200"
            style={{
              top: dropdownLayout.y + dropdownLayout.height + 4,
              left: dropdownLayout.x,
              width: dropdownLayout.width,
            }}
            onStartShouldSetResponder={() => true}
          >
            {/* Search input */}
            <View className="px-3 pt-3 pb-2 border-b border-neutral-200">
              <View className="flex-row items-center border border-neutral-300 rounded-lg px-3 py-2 bg-white">
                <Ionicons name="search" size={16} color={ROG.neutral[600]} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search city"
                  placeholderTextColor={ROG.neutral[300]}
                  className="ml-2 flex-1 text-[14px] text-neutral-900"
                  autoFocus
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Scrollable list */}
            <ScrollView
              style={{ maxHeight: 320 }}
              keyboardShouldPersistTaps="always"
            >
              {isIdle ? (
                <View className="px-4 py-3">
                  <Text className="text-neutral-400">
                    Type at least 2 letters…
                  </Text>
                </View>
              ) : loading ? (
                <View className="px-4 py-3 flex-row items-center gap-2">
                  <ActivityIndicator />
                  <Text className="text-neutral-600">Searching…</Text>
                </View>
              ) : items.length === 0 ? (
                <View className="px-4 py-3">
                  <Text className="text-neutral-400">No results</Text>
                </View>
              ) : (
                items.map(it => {
                  const isSelected = selectedCity === it.label;
                  return (
                    <Pressable
                      key={it.key}
                      className={`px-4 py-3 flex-row justify-between items-center ${
                        isSelected ? 'bg-primary-50' : 'bg-white'
                      } active:opacity-90`}
                      onPress={() => onSelect(it.label, it.coords)}
                    >
                      <Text
                        className={`${
                          isSelected
                            ? 'text-primary-700 font-semibold'
                            : 'text-neutral-900'
                        }`}
                      >
                        {it.label}
                      </Text>
                      {isSelected && (
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={ROG.primary[600]}
                        />
                      )}
                    </Pressable>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      )}

      <SlideDownModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        maxHeightRatio={0.7}
        snapPoints={[0.5, 0.7]}
        initialSnapIndex={1}
        avoidKeyboard
        handleA11yLabel="All set bottom sheet"
        renderContent={({ onContentScrollY }) => (
          <SignupAllSetScreen
            onClose={() => setModalVisible(false)}
            onScrollY={onContentScrollY}
          />
        )}
      />
    </SafeAreaView>
  );
}
