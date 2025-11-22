import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { CREATOR_STATUS } from '@/utils/config/models.config';
import { ROG } from '@/utils/config/theme.config';
import { useRouter } from 'react-native-auto-route';
import MiniCelebratoin from '@/utils/ui/auth/signup/miniCelebratoin';
import DigiLockerKYCModal from '@/utils/ui/auth/signup/DigiLockerKYCModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const RogCTA: React.FC<{
  title: string;
  onPress: () => void;
  className?: string;
  disabled?: boolean;
}> = ({ title, onPress, className, disabled }) => (
  <TouchableOpacity
    activeOpacity={0.9}
    disabled={disabled}
    onPress={onPress}
    className={[
      'self-start rounded-full overflow-hidden',
      disabled ? 'opacity-60' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    accessibilityRole="button"
  >
    <LinearGradient
      colors={[ROG.primary[900], ROG.primary[800]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999 }}
    >
      <View className="flex-row items-center">
        <Text className="text-white font-semibold text-[13px] mr-2">
          {title}
        </Text>
        <Ionicons name="arrow-forward" size={14} color="#fff" />
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default function ApplicationStatusScreen() {
  const insets = useSafeAreaInsets();
  const [isChecked, setIsChecked] = useState(false);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const router = useRouter();

  const [currentStatus, setCurrentStatus] = useState<string | null>(
    CREATOR_STATUS.APPLICATION_RECIEVED.value,
  );

  useEffect(() => {
    const getCurrentStatus = async () => {
      const status = await AsyncStorage.getItem('@ROG_APP_CREATOR_STATUS');
      if (status) {
        setCurrentStatus(status);
      }
    };
    getCurrentStatus();
  }, [currentStatus]);

  const uploadAssignment = () => console.log('upload assignment');
  const uploadShoot = () => console.log('upload shoot');
  const startKyc = () => setIsKYCModalOpen(true);

  const letsCapture = () => {
    router.push('/screens/home');
  };

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
        subComponent: (_disabled: boolean) =>
          currentStatus ===
          CREATOR_STATUS.AWAITING_WORKSHOP_SUBMISSION.value ? (
            <View className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mt-2">
              <View className="flex-row items-start">
                <Ionicons
                  name="alert-circle"
                  size={16}
                  color="#F59E0B"
                  style={{ marginTop: 2 }}
                />
                <Text className="ml-2 text-[12px] text-amber-800">
                  Your submission is under review. You will be notified via
                  WhatsApp about the next steps.
                </Text>
              </View>
            </View>
          ) : (
            <RogCTA
              title="Upload Assignment"
              onPress={uploadAssignment}
              className="mt-2"
              disabled={_disabled}
            />
          ),
      },
      {
        key: 'demo',
        title: 'Demo Shoot',
        description: 'Create your first content piece with our guidance',
        timeTheStepTakes: '~1 day',
        statusValue: CREATOR_STATUS.AWAITING_DEMO_SHOOT.value,
        subComponent: (_disabled: boolean) => (
          <RogCTA
            title="Upload Shoot"
            onPress={uploadShoot}
            className="mt-2"
            disabled={_disabled}
          />
        ),
      },
      {
        key: 'kyc',
        title: 'Digital KYC',
        description: 'Verify your identity to proceed',
        timeTheStepTakes: '~5–10 mins',
        statusValue: CREATOR_STATUS.AWAITING_KYC.value,
        subComponent: (_disabled: boolean) => (
          <RogCTA
            title="Verify"
            onPress={startKyc}
            className="mt-2"
            disabled={_disabled}
          />
        ),
      },
      {
        key: 'onboarded',
        title: 'Onboarded',
        description: 'Welcome aboard!',
        statusValue: CREATOR_STATUS.ONBOARDED.value,
        subComponent: (_disabled: boolean) => (
          <View className="mt-2">
            <MiniCelebratoin />
          </View>
        ),
      },
    ];
  }, [currentStatus]);

  const currentIndex = steps.findIndex(s => s.statusValue === currentStatus);

  const [openKeys, setOpenKeys] = useState<Set<string>>(
    () => new Set(currentIndex >= 0 ? [steps[currentIndex]?.key] : []),
  );

  const canToggle = (index: number) => index <= currentIndex;
  const toggleKey = (k: string, index: number) => {
    if (!canToggle(index)) return;
    setOpenKeys(prev => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });
  };

  const showFooter = true;
  const canContinue =
    currentStatus === CREATOR_STATUS.ONBOARDED.value && isChecked;

  return (
    <>
      <DigiLockerKYCModal
        isVisible={isKYCModalOpen}
        onClose={() => setIsKYCModalOpen(false)}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            paddingBottom: showFooter ? 140 : 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-4">
            <Text className="text-[24px] font-bold text-neutral-900">
              Application Status
            </Text>
          </View>

          <View className="relative">
            <View
              style={{
                position: 'absolute',
                left: 12,
                top: 0,
                bottom: 0,
                borderLeftWidth: 2,
                borderStyle: 'dashed',
                borderLeftColor: ROG.neutral[100],
              }}
            />
            {steps.map((step, index) => {
              const isDone = index < currentIndex;
              const isLocked = index > currentIndex;
              const open = openKeys.has(step.key);

              return (
                <View key={step.key} className="pl-10 pr-2 py-4">
                  <View
                    style={{
                      position: 'absolute',
                      left: -2,
                      top: 12,
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isDone
                        ? '#DCFCE7'
                        : isLocked
                        ? '#E5E7EB'
                        : '#F97316',
                    }}
                  >
                    {isDone ? (
                      <Ionicons name="checkmark" size={18} color="#10B981" />
                    ) : isLocked ? (
                      <Text style={{ color: '#6B7280', fontWeight: '700' }}>
                        {index + 1}
                      </Text>
                    ) : (
                      <Text style={{ color: 'white', fontWeight: '700' }}>
                        {index + 1}
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity
                    activeOpacity={canToggle(index) ? 0.85 : 1}
                    onPress={() => toggleKey(step.key, index)}
                    className="flex-1"
                  >
                    <View className="flex-row items-center justify-between">
                      <Text
                        className={`text-[16px] font-semibold ${
                          isLocked ? 'text-neutral-500' : 'text-neutral-900'
                        }`}
                      >
                        {step.title}
                      </Text>

                      <View className="flex-row items-center">
                        {isDone && step.daysTillNow != null && (
                          <View className="px-2 py-[2px] rounded-full bg-neutral-100 mr-2">
                            <Text className="text-[10px] text-neutral-600">
                              {fromDaysAgo(step.daysTillNow)}
                            </Text>
                          </View>
                        )}
                        <Ionicons
                          name={open ? 'chevron-up' : 'chevron-down'}
                          size={18}
                          color={isLocked ? '#D1D5DB' : '#9CA3AF'}
                        />
                      </View>
                    </View>

                    {step.description ? (
                      <Text
                        className={`text-[12px] mt-1 ${
                          isLocked ? 'text-neutral-400' : 'text-neutral-600'
                        }`}
                      >
                        {step.description}
                      </Text>
                    ) : null}
                  </TouchableOpacity>

                  {open && (
                    <View className="mt-2">
                      {step.timeTheStepTakes ? (
                        <View className="self-start bg-neutral-100 px-2 py-[2px] rounded-full mb-2">
                          <Text className="text-[10px] text-neutral-600">
                            {step.timeTheStepTakes}
                          </Text>
                        </View>
                      ) : null}
                      {step.subComponent
                        ? typeof step.subComponent === 'function'
                          ? step.subComponent(index < currentIndex)
                          : step.subComponent
                        : null}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>

        {showFooter && (
          <View
            aria-disabled={false}
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              bottom: Math.max(insets.bottom, 16),
            }}
          >
            <View className="flex-row items-center mb-3">
              <TouchableOpacity
                onPress={() => setIsChecked(!isChecked)}
                className="mr-2"
              >
                <View className="w-4 h-4 border border-primary-700 rounded bg-white flex items-center justify-center">
                  {isChecked && (
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color={ROG.primary[700]}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <Text className="text-[12px] text-neutral-800">
                I accept the{' '}
                <Text className="text-primary-700 font-semibold">
                  Terms & Conditions
                </Text>{' '}
                and{' '}
                <Text className="text-primary-700 font-semibold">
                  Privacy Policy
                </Text>
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={canContinue ? 0.9 : 1}
              disabled={!canContinue}
              onPress={letsCapture}
              className="w-full rounded-full overflow-hidden"
            >
              <LinearGradient
                colors={
                  canContinue
                    ? [ROG.primary[900], ROG.primary[800]]
                    : ['#E5E7EB', '#D1D5DB']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ paddingVertical: 16, borderRadius: 999 }}
              >
                <View className="flex-row items-center justify-center">
                  <Text
                    className={`font-semibold text-[15px] mr-2 ${
                      canContinue ? 'text-white' : 'text-neutral-600'
                    }`}
                  >
                    Let's Capture
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={canContinue ? '#fff' : '#6B7280'}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}
