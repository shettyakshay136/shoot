import React, { useState, type JSX } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './ShootDetailsScreen.styles';
import type { ShootStackParamList } from '@/navigation/stacks/ShootStack/ShootStack.types';
import { BaseModal } from '@/components/layout';
import { OTPModal } from '@/components/ui';
import BackButton from '@/assets/svg/back.svg';
import LocationIcon from '@/assets/svg/location.svg';
import TimerIcon from '@/assets/svg/timer.svg';
import VideoIcon from '@/assets/svg/video.svg';
import BoomIcon from '@/assets/svg/boom.svg';
import SpotifyIcon from '@/assets/svg/spotify.svg';
import AcceptIcon from '@/assets/svg/accept.svg';
import DeclineIcon from '@/assets/svg/decline.svg';

type ShootDetailsScreenRouteProp = RouteProp<ShootStackParamList, 'ShootDetails'>;
type ShootDetailsScreenNavigationProp = NativeStackNavigationProp<ShootStackParamList, 'ShootDetails'>;

const ShootDetailsScreen = (): JSX.Element => {
  const route = useRoute<ShootDetailsScreenRouteProp>();
  const navigation = useNavigation<ShootDetailsScreenNavigationProp>();
  const { shootData } = route.params || {};
  
  // Check if this is coming from upcoming shoots flow
  const isUpcomingShootFlow = !!shootData?.isFromUpcoming;
  
  const [isTermsAccepted, setIsTermsAccepted] = useState(true);
  const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false);
  const [isDeclineModalVisible, setIsDeclineModalVisible] = useState(false);
  const [isOTPModalVisible, setIsOTPModalVisible] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleViewMaps = () => {
    // Open maps with location
    const url = `https://maps.google.com/?q=${shootData?.location}`;
    Linking.openURL(url);
  };

  const handleReject = () => {
    // Show decline confirmation modal
    setIsDeclineModalVisible(true);
  };

  const handleDecline = () => {
    // Handle decline logic
    console.log('Shoot declined');
    setIsDeclineModalVisible(false);
    navigation.goBack();
  };

  const handleDeclineModalCancel = () => {
    setIsDeclineModalVisible(false);
  };

  const handleAccept = () => {
    // Show accept confirmation modal
    setIsAcceptModalVisible(true);
  };

  const handleConfirmAccept = () => {
    // Handle accept logic
    console.log('Shoot accepted');
    setIsAcceptModalVisible(false);
    navigation.goBack();
  };

  const handleAcceptModalCancel = () => {
    setIsAcceptModalVisible(false);
  };

  const handleTermsClick = () => {
    // Open terms and conditions
    console.log('Open terms and conditions');
  };

  const handlePrivacyClick = () => {
    // Open privacy policy
    console.log('Open privacy policy');
  };

  const handleStartShoot = () => {
    // Open OTP modal
    setIsOTPModalVisible(true);
  };

  const handleOTPVerify = () => {
    // Handle OTP verification
    console.log('OTP verified');
    setIsOTPModalVisible(false);
    // Navigate to countdown screen
    navigation.navigate('CountdownScreen');
  };

  const handleOTPResend = () => {
    // Handle OTP resend
    console.log('Resending OTP');
  };

  // Default data for demo purposes
  const shootDataWithDefaults = shootData || {
    title: 'Corporate Event - Tech Conference',
    location: 'HITEC City, Hyderabad',
    date: 'Fri, Sept 29, 2025',
    time: '7:00 PM',
    category: 'Niche',
    earnings: '₹1150',
    distance: '1.5 km',
    eta: '32 mins',
    shootHours: '7:00 PM to 9:00 PM (2hrs)',
    reelsRequired: '2 reels',
    instantDelivery: 'Within 30 minutes',
    addons: ['Pictures (Up to 20)', 'Raw data required', 'Mic'],
    description: 'This high-profile corporate tech conference will feature keynote sessions, product demos, startup showcases, and panel discussions with industry leaders across AI, SaaS, and enterprise innovation. Attendees include founders, investors, corporate executives, and technology enthusiasts from India\'s leading companies and startups.',
    songs: [
      {
        title: 'Boujee',
        artist: 'Wowashwow (via Soundstripe)',
        thumbnail: '#FF6E9C',
      },
      {
        title: 'L\'amour Au Café',
        artist: 'Rêves Français (via Soundstripe)',
        thumbnail: '#FFD700',
      },
    ],
  };

  const { title, location, date, time, category, earnings, distance, eta, shootHours, reelsRequired, instantDelivery, addons, description, songs } = shootDataWithDefaults;

  return (
    <View style={styles.container}>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackButton width={36} height={36} />
          </TouchableOpacity>
        </View>
        {!isUpcomingShootFlow && (
          <View style={styles.earningsBanner}>
            <BoomIcon width={25} height={25} />
            <Text style={styles.earningsText}>You earn <Text style={styles.earningBoldText}>{earnings}/-</Text> from this shoot!</Text>
          </View>
        )}
        <View style={styles.detailsContainer}>
          {!isUpcomingShootFlow && (
            <Text style={styles.distanceText}>You are {distance} away • ETA {eta}</Text>
          )}
          <Text style={styles.eventTitle}>{title}</Text>
          {!isUpcomingShootFlow && (
            <View style={styles.infoContainer}>
              <View style={styles.section}>
                <View style={styles.iconTextRow}>
                  <LocationIcon width={14} height={17} />
                  <Text style={styles.infoText}>{location}</Text>
                </View>
                <TouchableOpacity onPress={handleViewMaps}>
                  <Text style={styles.mapLinkText}>(View on maps)</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.section}>
                <View style={styles.iconTextRow}>
                  <TimerIcon  width={14} height={17} />
                  <Text style={styles.infoText}>{date} • {time}</Text>
                </View>
              </View>
              <View style={styles.section}>
                <View style={styles.iconTextRow}>
                  <VideoIcon  width={14} height={17} />
                  <Text style={styles.infoText}>{category}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
        <View style={styles.requirementSection}>
          <Text style={styles.requirementTitle}>{!isUpcomingShootFlow ?  'Requirement' : "Event details"}</Text>
          
          <View style={styles.requirementCard}>
            <View style={styles.requirementRow}>
              <Text style={styles.requirementLabel}>Shoot hours</Text>
              <Text style={styles.requirementValue}>{shootHours}</Text>
            </View>
            <View style={styles.requirementRow}>
              <Text style={styles.requirementLabel}>Reels required</Text>
              <Text style={styles.requirementValue}>{reelsRequired}</Text>
            </View>
            <View style={styles.requirementRow}>
              <Text style={styles.requirementLabel}>Instant delivery</Text>
              <Text style={styles.instantDelivery}>{instantDelivery}</Text>
            </View>
            <View style={styles.addonsWrapper}>
              <Text style={styles.addonLabel}>Add ons</Text>
              <View style={styles.addonsContainer}>
                {addons?.map((addon, index) => (
                  <View key={index} style={styles.addonPill}>
                    <Text style={styles.addonText}>{addon}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>Short description</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>{description}</Text>
            </View>
          </View>

        <View style={styles.audioSection}>
          <View style={styles.audioHeader}>
            <Text style={styles.audioTitle}>Audio preference</Text>
            <TouchableOpacity style={styles.suggestButton}>
              <SpotifyIcon/>
              <Text style={styles.suggestButtonText}>Suggest songs</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.songsContainer}>
            {songs?.map((song, index) => (
              <View key={index} style={styles.songCard}>
                <View style={[styles.songThumbnail, { backgroundColor: song.thumbnail }]} />
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle}>{song.title}</Text>
                  <Text style={styles.songArtist}>{song.artist}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      {!isUpcomingShootFlow && (
        <View style={styles.footerContainer}>
          <View style={styles.termsSection}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIsTermsAccepted(!isTermsAccepted)}
            >
              <View style={[styles.checkbox, isTermsAccepted && styles.checkboxChecked]}>
                {isTermsAccepted && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I accept the{' '}
                <Text style={styles.termsLink} onPress={handleTermsClick}>
                  Terms & Conditions
                </Text>
                {' '}and{' '}
                <Text style={styles.termsLink} onPress={handlePrivacyClick}>
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={handleReject}
            >
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptButtonWrapper}
              onPress={handleAccept}
              disabled={!isTermsAccepted}
            >
              <LinearGradient
                colors={['#000000', '#61240E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.acceptButton, !isTermsAccepted && styles.acceptButtonDisabled]}
              >
                <Text style={styles.acceptButtonText}>Accept</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isUpcomingShootFlow && (
        <View style={styles.upcomingFooterContainer}>
          <TouchableOpacity 
            style={styles.startShootButtonWrapper}
            onPress={handleStartShoot}
          >
            <LinearGradient
              colors={['#000000', '#61240E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startShootButton}
            >
              <Text style={styles.startShootButtonText}>Start shoot</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* OTP Modal */}
      <OTPModal
        isVisible={isOTPModalVisible}
        onClose={() => setIsOTPModalVisible(false)}
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
      />

      {/* Accept Modal */}
      <BaseModal
        isVisible={isAcceptModalVisible}
        onClose={handleAcceptModalCancel}
        showHeader={false}
        containerStyle={styles.modalContentWrapper}
        contentStyle={styles.modalContentInner}
      >
        <AcceptIcon width={120} height={120} />
        <View style={styles.earnTag}>
          <Text style={styles.earnTagText}>Earn {earnings}/-</Text>
        </View>
        <View style={styles.modalContentContainer}>
          <Text style={styles.modalQuestion}>Accept this shoot?</Text>
          <Text style={styles.modalEventTitle}>{title}</Text>
        </View>

        <View style={styles.modalButtonsContainer}>
          <TouchableOpacity
            style={styles.modalConfirmButton}
            onPress={handleConfirmAccept}
          >
            <Text style={styles.modalConfirmButtonText}>Confirm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalCancelButton}
            onPress={handleAcceptModalCancel}
          >
            <Text style={styles.modalCancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </BaseModal>

      {/* Decline Modal */}
      <BaseModal
        isVisible={isDeclineModalVisible}
        onClose={handleDeclineModalCancel}
        showHeader={false}
        containerStyle={styles.modalContentWrapper}
        contentStyle={styles.modalContentInner}
      >
        <DeclineIcon width={120} height={120} />
        <View style={styles.earnTagDecline}>
          <Text style={styles.earnTagTextDecline}>You're missing out {earnings}/-</Text>
        </View>
        <View style={styles.modalContentContainer}>
          <Text style={styles.modalQuestion}>Reject this shoot?</Text>
          <Text style={styles.modalEventTitle}>{title}</Text>
        </View>

        <View style={styles.modalButtonsContainer}>
          <TouchableOpacity
            style={styles.modalDeclineButton}
            onPress={handleDecline}
          >
            <Text style={styles.modalDeclineButtonText}>Decline</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalCancelButton}
            onPress={handleDeclineModalCancel}
          >
            <Text style={styles.modalCancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </BaseModal>
    </View>
  );
};

export default ShootDetailsScreen;

