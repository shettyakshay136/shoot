import React, { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BoomSvg from '@/assets/svg/boom.svg';
import ChevronDownSvg from '@/assets/svg/chevron-down.svg';
import ChevronUpSvg from '@/assets/svg/chevron-up.svg';
import CheckBoxIcon from '@/assets/svg/checkbox.svg';

import { useToast, AUTH_TOKEN_KEY } from '@/contexts';
import { CREATOR_STATUS_KEY } from '@/contexts/AuthContext';
import { CREATOR_STATUS } from '@/types/models.config';
import {
  getDigiLockerAuthUrl,
  updateCreatorProfile,
} from '@/services/authUtils';
import { styles } from './ApplicationScreen.styles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';

type StepModel = {
  key: string;
  title: string;
  description?: string;
  daysTillNow?: number;
  timeTheStepTakes?: string;
  statusValue: string;
  subComponent?: React.ReactNode | ((disabled: boolean) => React.ReactNode);
};

function fromDaysAgo(n?: number) {
  if (n == null) return undefined;
  if (n <= 0) return 'today';
  if (n === 1) return '1 day ago';
  return `${n} days ago`;
}

const ApplicationStatusScreen = (): JSX.Element => {
  const { showToast } = useToast();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // Footer state
  const [isChecked, setIsChecked] = useState(false);

  // KYC state
  const [isVerifyingKYC, setIsVerifyingKYC] = useState(false);

  // Current status
  const [currentStatus, setCurrentStatus] = useState<string>(
    CREATOR_STATUS.APPLICATION_RECIEVED.value,
  );

  // Read status from storage
  useEffect(() => {
    const getCurrentStatus = async () => {
      const status = await AsyncStorage.getItem(CREATOR_STATUS_KEY);
      if (status) setCurrentStatus(status);
    };
    getCurrentStatus();
  }, [currentStatus]);

  // Demo handlers for step CTAs
  const uploadAssignment = useCallback(() => {
    showToast('Upload Assignment pressed', 'info');
  }, [showToast]);

  const uploadShoot = useCallback(() => {
    showToast('Upload Shoot pressed', 'info');
  }, [showToast]);

  const handleVerifyKYC = useCallback(async () => {
    try {
      setIsVerifyingKYC(true);
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        showToast('Session expired. Please login again.', 'error');
        return;
      }
      const res = await getDigiLockerAuthUrl(token);
      if (res.success && res.data?.authorizationUrl) {
        showToast('Opening DigiLocker…', 'success');
        Linking.openURL(res.data?.authorizationUrl);
      } else {
        showToast(res.message || 'Failed to start KYC', 'error');
      }
    } catch (e: any) {
      showToast(e?.message || 'Failed to start KYC', 'error');
    } finally {
      setIsVerifyingKYC(false);
    }
  }, [showToast]);

  // Removed unused checkKYCStatus function

  // Build steps model (UI reads from this)
  const steps: StepModel[] = useMemo(() => {
    return [
      {
        key: 'application',
        title: 'Application Received',
        description: 'Your application has been successfully submitted',
        daysTillNow: 2,
        timeTheStepTakes: '~few hours',
        statusValue: CREATOR_STATUS.APPLICATION_RECIEVED.value,
      },
      {
        key: 'workshop',
        title: 'Workshop + Assignment',
        description: 'Learn our process and complete a skill assessment',
        timeTheStepTakes: '~1–2 days',
        statusValue:
          currentStatus === CREATOR_STATUS.WORKSHOP_INITIATED.value
            ? CREATOR_STATUS.WORKSHOP_INITIATED.value
            : CREATOR_STATUS.AWAITING_WORKSHOP_SUBMISSION.value,
        subComponent:
          currentStatus ===
          CREATOR_STATUS.AWAITING_WORKSHOP_SUBMISSION.value ? (
            <View className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mt-2">
              <View className="flex-row items-start">
                <BoomSvg width={16} height={16} style={{ marginTop: 2 }} />
                <Text className="ml-2 text-[12px] text-amber-800">
                  Your submission is under review. You will be notified via
                  WhatsApp about the next steps.
                </Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={uploadAssignment}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>Upload Assignment</Text>
            </TouchableOpacity>
          ),
      },
      {
        key: 'demo',
        title: 'Demo Shoot',
        description: 'Create your first content piece with our guidance',
        timeTheStepTakes: '~1 day',
        statusValue: CREATOR_STATUS.AWAITING_DEMO_SHOOT.value,
        subComponent: (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={uploadShoot}
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>Upload Shoot</Text>
          </TouchableOpacity>
        ),
      },
      {
        key: 'kyc',
        title: 'Digital KYC',
        description: 'Verify your identity to proceed',
        timeTheStepTakes: '~5–10 mins',
        statusValue: CREATOR_STATUS.AWAITING_KYC.value,
        subComponent: (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleVerifyKYC}
            style={styles.actionButton}
            disabled={isVerifyingKYC}
          >
            {isVerifyingKYC ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.actionButtonText}>Verify</Text>
            )}
          </TouchableOpacity>
        ),
      },
      {
        key: 'onboarded',
        title: 'Onboarded',
        description: 'Welcome aboard!',
        statusValue: CREATOR_STATUS.ONBOARDED.value,
        subComponent: (
          <View style={styles.onboardedMessageContainer}>
            <BoomSvg width={72} height={72} style={styles.boomIcon} />
            <Text style={styles.onboardedMessageText}>
              Welcome aboard! Your onboarding is complete and will be delivered
              shortly.
            </Text>
          </View>
        ),
      },
    ];
  }, [currentStatus, isVerifyingKYC, handleVerifyKYC, uploadAssignment, uploadShoot]);

  // figure out "current index" for visual states
  const currentIndex = useMemo(() => {
    const map = {
      [CREATOR_STATUS.APPLICATION_RECIEVED.value]: 0,
      [CREATOR_STATUS.WORKSHOP_INITIATED.value]: 1,
      [CREATOR_STATUS.AWAITING_WORKSHOP_SUBMISSION.value]: 1,
      [CREATOR_STATUS.AWAITING_DEMO_SHOOT.value]: 2,
      [CREATOR_STATUS.AWAITING_KYC.value]: 3,
      [CREATOR_STATUS.ONBOARDED.value]: 4,
    } as Record<string, number>;
    return map[currentStatus] ?? 0;
  }, [currentStatus]);

  // expanded rows (only <= currentIndex can toggle)
  const [openKeys, setOpenKeys] = useState<Set<string>>(
    () => new Set([steps[currentIndex]?.key]),
  );
  useEffect(() => {
    setOpenKeys(new Set([steps[currentIndex]?.key]));
  }, [currentIndex, steps]);

  const canToggle = (index: number) => index <= currentIndex;
  const toggleKey = (k: string, index: number) => {
    if (!canToggle(index)) return;
    setOpenKeys(prev => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });
  };

  const canContinue =
    currentStatus === CREATOR_STATUS.ONBOARDED.value && isChecked;

  const renderLeftIcon = (index: number) => {
    if (index < currentIndex) {
      return (
        <View style={styles.completedIcon}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      );
    }
    if (index === currentIndex) {
      return (
        <View style={styles.activeIcon}>
          <Text style={styles.activeIconText}>{index + 1}</Text>
        </View>
      );
    }
    return (
      <View style={styles.pendingIcon}>
        <Text style={styles.pendingIconText}>{index + 1}</Text>
      </View>
    );
  };

  const handleContinue = async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) return;
      await updateCreatorProfile(
        {
          onboarded: true,
        },
        token,
      );
      navigation.navigate('App', { screen: 'HomeStack' });
    } catch (e) {
      showToast('Failed to complete application', 'error');
    } finally {
      setIsChecked(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Application Status</Text>
      </View>

      {/* Steps */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.timelineContainer}>
          {steps.map((step, index) => {
            const isDone = index < currentIndex;
            const isLocked = index > currentIndex;
            const open = openKeys.has(step.key);

            return (
              <View key={step.key} style={styles.stepWrapper}>
                <View style={styles.stepContainer}>
                  <View style={styles.stepHeader}>
                    {/* Left status icon */}
                    <View style={styles.stepIconContainer}>
                      {renderLeftIcon(index)}
                    </View>

                    {/* Right info */}
                    <View style={styles.stepInfo}>
                      <View style={styles.stepTitleRow}>
                        <Text
                          style={[
                            styles.stepTitle,
                            { color: isLocked ? '#6B7280' : '#111827' },
                          ]}
                        >
                          {step.title}
                        </Text>

                        {/* Done time ago pill */}
                        {isDone && step.daysTillNow != null && (
                          <View style={styles.timeAgoPill}>
                            <Text style={styles.timeAgoText}>
                              {fromDaysAgo(step.daysTillNow)}
                            </Text>
                          </View>
                        )}

                        {/* Active pill */}
                        {index === currentIndex && (
                          <View style={styles.activePill}>
                            <Text style={styles.activePillText}>Active</Text>
                          </View>
                        )}

                        {/* Expander */}
                        <TouchableOpacity
                          activeOpacity={canToggle(index) ? 0.85 : 1}
                          onPress={() => toggleKey(step.key, index)}
                          style={styles.expandButton}
                        >
                          {open ? <ChevronUpSvg /> : <ChevronDownSvg />}
                        </TouchableOpacity>
                      </View>

                      {/* Description */}
                      {step.description ? (
                        <Text
                          style={[
                            styles.stepDescription,
                            { color: isLocked ? '#9CA3AF' : '#6B7280' },
                          ]}
                        >
                          {step.description}
                        </Text>
                      ) : null}

                      {/* Expanded content */}
                      {open && (
                        <View style={{ marginTop: 6 }}>
                          {step.timeTheStepTakes ? (
                            <Text style={styles.estimatedTimeText}>
                              {step.timeTheStepTakes}
                            </Text>
                          ) : null}

                          {step.subComponent
                            ? typeof step.subComponent === 'function'
                              ? step.subComponent(index < currentIndex)
                              : step.subComponent
                            : null}
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Vertical dashed line (between items) */}
                {index < steps.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.termsContainer}>
          <TouchableOpacity
            onPress={() => setIsChecked(v => !v)}
            style={styles.checkboxContainer}
          >
            <View
              style={[
                styles.checkbox,
                { backgroundColor: isChecked ? '#983614' : '#FFFFFF' },
              ]}
            >
              {isChecked && (
                <CheckBoxIcon width={12} height={12} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I accept the{' '}
            <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
            <Text style={styles.privacyLink}>Privacy Policy</Text>
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={canContinue ? 0.9 : 1}
          disabled={!canContinue}
          style={styles.submitButton}
          onPress={handleContinue}
        >
          <LinearGradient
            colors={
              canContinue ? ['#000000', '#61240E'] : ['#E5E7EB', '#D1D5DB']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>Let&apos;s Capture</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ApplicationStatusScreen;
