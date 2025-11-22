import React, { useState, useEffect, useCallback, useMemo, type JSX } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/AuthNavigator/AuthNavigator.types';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './ApplicationScreen.styles';
import BackButton from '@/assets/svg/backButtonPdp.svg';
import BoomSvg from '@/assets/svg/boom.svg';
import { UploadModal, DigiLockerKYCModal } from '@/components/ui';
import { useAuth } from '@/contexts';
import { useToast } from '@/contexts';

interface Step {
  id: number;
  title: string;
  status: 'completed' | 'active' | 'pending';
  timeAgo?: string;
  estimatedTime?: string;
  description: string;
  isExpanded?: boolean;
  actionButton?: {
    text: string;
    onPress: () => void;
  };
}

type ApplicationScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'ApplicationScreen'
>;

const ApplicationStatusScreen = ({ route }: ApplicationScreenProps): JSX.Element => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([2])); // Step 2 is expanded by default
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isKYCModalVisible, setIsKYCModalVisible] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);

  const handleUploadAssignment = () => {
    setIsUploadModalVisible(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalVisible(false);
  };

  const handleFileUpload = () => {
    // Handle file upload logic here
    console.log('File upload initiated');
    
    // Update steps: mark current active step as completed and next step as active
    setSteps(prevSteps => {
      const updatedSteps = [...prevSteps];
      const currentActiveIndex = updatedSteps.findIndex(step => step.status === 'active');
      
      if (currentActiveIndex !== -1) {
        // Mark current step as completed
        updatedSteps[currentActiveIndex] = {
          ...updatedSteps[currentActiveIndex],
          status: 'completed',
          timeAgo: updatedSteps[currentActiveIndex].id === 1 ? 'Just now' : undefined,
          actionButton: undefined, // Remove action button for completed step
        };
        
        // Mark next step as active
        const nextStepIndex = currentActiveIndex + 1;
        if (nextStepIndex < updatedSteps.length) {
          updatedSteps[nextStepIndex] = {
            ...updatedSteps[nextStepIndex],
            status: 'active',
            isExpanded: true,
          };
        }
      }
      
      return updatedSteps;
    });
    
    setIsUploadModalVisible(false);
  };

  const handleUploadShoot = () => {
    // Handle shoot upload logic here
    console.log('Shoot upload initiated');
    
    // Update steps: mark current active step as completed and next step as active
    setSteps(prevSteps => {
      const updatedSteps = [...prevSteps];
      const currentActiveIndex = updatedSteps.findIndex(step => step.status === 'active');
      
      if (currentActiveIndex !== -1) {
        // Mark current step as completed
        updatedSteps[currentActiveIndex] = {
          ...updatedSteps[currentActiveIndex],
          status: 'completed',
          timeAgo: updatedSteps[currentActiveIndex].id === 1 ? 'Just now' : undefined,
          actionButton: undefined, // Remove action button for completed step
        };
        
        // Mark next step as active
        const nextStepIndex = currentActiveIndex + 1;
        if (nextStepIndex < updatedSteps.length) {
          updatedSteps[nextStepIndex] = {
            ...updatedSteps[nextStepIndex],
            status: 'active',
            isExpanded: true,
          };
        }
      }
      
      return updatedSteps;
    });
  };

  const handleVerifyKYC = () => {
    // Open KYC verification modal
    console.log('KYC verification initiated - opening modal');
    setIsKYCModalVisible(true);
  };

  const handleCloseKYCModal = () => {
    setIsKYCModalVisible(false);
  };

  const handleKYCCompleted = useCallback(() => {
    // Update steps: mark KYC step (step 4) as completed and Onboarded step (step 5) as active
    setSteps(prevSteps => {
      const updatedSteps = [...prevSteps];
      
      // Find and mark step 4 (Digital KYC) as completed
      const kycStepIndex = updatedSteps.findIndex(step => step.id === 4);
      if (kycStepIndex !== -1) {
        updatedSteps[kycStepIndex] = {
          ...updatedSteps[kycStepIndex],
          status: 'completed',
          timeAgo: 'Just now',
          actionButton: undefined, // Remove action button for completed step
        };
      }
      
      // Find and mark step 5 (Onboarded) as active
      const onboardedStepIndex = updatedSteps.findIndex(step => step.id === 5);
      if (onboardedStepIndex !== -1) {
        updatedSteps[onboardedStepIndex] = {
          ...updatedSteps[onboardedStepIndex],
          status: 'active',
          isExpanded: true,
        };
        // Expand step 5
        setExpandedSteps(prev => new Set([...prev, 5]));
      }
      
      return updatedSteps;
    });
  }, []);

  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: 'Application Received',
      status: 'completed',
      timeAgo: '2 days ago',
      description: 'Your application has been successfully submitted',
    },
    {
      id: 2,
      title: 'Workshop + Assignment',
      status: 'active',
      estimatedTime: '',
      description: 'Learn our process and complete a skill assessment.',
      isExpanded: true,
      actionButton: {
        text: 'Upload Assignment',
        onPress: handleUploadAssignment,
      },
    },
    {
      id: 3,
      title: 'Demo Shoot',
      status: 'pending',
      estimatedTime: '',
      description: 'Create your first content piece with our guidance.',
      actionButton: {
        text: 'Upload Shoot',
        onPress: handleUploadShoot,
      },
    },
    {
      id: 4,
      title: 'Digital KYC',
      status: 'pending',
      estimatedTime: '',
      description: 'Create your first content piece with our guidance.',
      actionButton: {
        text: 'Verify',
        onPress: handleVerifyKYC,
      },
    },
    {
      id: 5,
      title: 'Onboarded',
      status: 'pending',
      estimatedTime: '',
      description: 'Create your first content piece with our guidance.',
    },
  ]);

  // Handle KYC completion from route params
  useEffect(() => {
    if (route.params?.kycCompleted) {
      handleKYCCompleted();
    }
  }, [route.params?.kycCompleted, handleKYCCompleted]);

  // Check if all steps are completed (step 5 "Onboarded" is active or completed)
  const isAllStepsComplete = useMemo(() => {
    const onboardedStep = steps.find(step => step.id === 5);
    return onboardedStep?.status === 'active' || onboardedStep?.status === 'completed';
  }, [steps]);

  // Handle "Let's Capture" button press
  const handleLetsCapture = async () => {
    if (!isAllStepsComplete) {
      showToast('Please complete all steps before proceeding', 'error');
      return;
    }

    if (!isTermsAccepted) {
      showToast('Please accept the Terms & Conditions and Privacy Policy', 'error');
      return;
    }

    try {
      setIsOnboarding(true);
      
      // Update user to mark as onboarded
      const updatedUser = {
        ...user,
        onboarded: true,
      };
      
      await updateUser(updatedUser);
      
      showToast('Welcome! You are now onboarded.', 'success');
      
      // Navigation will happen automatically via RootNavigator since user.onboarded is now true
    } catch (error: any) {
      console.error('Error updating user:', error);
      showToast('Failed to complete onboarding. Please try again.', 'error');
    } finally {
      setIsOnboarding(false);
    }
  };

  const toggleStepExpansion = (stepId: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const renderStepIcon = (step: Step) => {
    if (step.status === 'completed') {
      return (
        <View style={styles.completedIcon}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      );
    } else if (step.status === 'active') {
      return (
        <View style={styles.activeIcon}>
          <Text style={styles.activeIconText}>{step.id}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.pendingIcon}>
          <Text style={styles.pendingIconText}>{step.id}</Text>
        </View>
      );
    }
  };

  const renderStepContent = (step: Step) => {
    const isExpanded = expandedSteps.has(step.id);
    
    return (
      <View style={styles.stepContainer}>
        <View style={styles.stepHeader}>
          <View style={styles.stepIconContainer}>
            {renderStepIcon(step)}
          </View>
          <View style={styles.stepInfo}>
            <View style={styles.stepTitleRow}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              {step.status === 'completed' && step.id !== 5 && (
                <View style={step.id === 1 ? styles.timeAgoPill : styles.donePill}>
                  <Text style={step.id === 1 ? styles.timeAgoText : styles.doneText}>
                    {step.id === 1 ? step.timeAgo : 'Done'}
                  </Text>
                </View>
              )}
              {step.status === 'active' && (
                <View style={styles.activePill}>
                  <Text style={styles.activePillText}>Active</Text>
                </View>
              )}
            </View>
            {step.description === 'onboarded_message' ? (
              <View style={styles.onboardedMessageContainer}>
                <BoomSvg width={72} height={72} style={styles.boomIcon} />
                <Text style={styles.onboardedMessageText}>
                  Welcome! You have successfully completed the onboarding process and can now access all features.
                </Text>
              </View>
            ) : (
              <Text style={styles.stepDescription}>{step.description}</Text>
            )}
            {step.estimatedTime && (
              <Text style={styles.estimatedTimeText}>{step.estimatedTime}</Text>
            )}
            {(isExpanded || step.status === 'active') && step.actionButton && (
              <TouchableOpacity style={styles.actionButton} onPress={step.actionButton.onPress}>
                <Text style={styles.actionButtonText}>{step.actionButton.text}</Text>
              </TouchableOpacity>
            )}
          </View>
          {step.status === 'pending' && (
            <TouchableOpacity onPress={() => toggleStepExpansion(step.id)} style={styles.expandButton}>
              <BackButton 
                style={[
                  styles.expandIcon,
                  isExpanded && styles.expandIconRotated
                ]} 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{paddingHorizontal:23 , flex:1}}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Application Status</Text>
        {/* <TouchableOpacity onPress={handleHelp} style={styles.helpButton}>
          <Text style={styles.helpButtonText}>Help</Text>
        </TouchableOpacity> */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.timelineContainer}>
          {steps.map((step, index) => (
            <View key={step.id} style={styles.stepWrapper}>
              {renderStepContent(step)}
              {index < steps.length - 1 && <View style={styles.timelineLine} />}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer with Buttons */}
      {isAllStepsComplete && (
        <View style={styles.footer}>
          <View style={styles.termsContainer}>
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setIsTermsAccepted(!isTermsAccepted)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, isTermsAccepted && styles.checkboxChecked]}>
                {isTermsAccepted && <Text style={styles.checkboxCheckmark}>✓</Text>}
              </View>
            </TouchableOpacity>
            <Text style={styles.termsText}>
              I accept the <Text style={styles.termsLink}>Terms & Conditions</Text> and <Text style={styles.privacyLink}>Privacy Policy</Text>
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleLetsCapture}
            disabled={!isTermsAccepted || isOnboarding}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                isTermsAccepted && !isOnboarding
                  ? ['#000000', '#61240E']
                  : ['#E5E7EB', '#D1D5DB']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitButtonGradient}
            >
              {isOnboarding ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={[
                  styles.submitButtonText,
                  (!isTermsAccepted || isOnboarding) && styles.submitButtonTextDisabled
                ]}>
                  Let's Capture
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Upload Modal */}
      <UploadModal
        isVisible={isUploadModalVisible}
        onClose={handleCloseUploadModal}
        onUpload={handleFileUpload}
        onCheckStatus={handleCloseUploadModal}
        eventCode=""
        eventName=""
        eventDate=""
        creatorCode=""
        fileType="raw"
      />

      {/* KYC Modal */}
      <DigiLockerKYCModal
        isVisible={isKYCModalVisible}
        onClose={handleCloseKYCModal}
      />
      </View>
    </SafeAreaView>
  );
};

export default ApplicationStatusScreen;