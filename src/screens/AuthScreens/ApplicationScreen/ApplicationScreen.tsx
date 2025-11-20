import React, { useState, type JSX } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './ApplicationScreen.styles';
import BackButton from '@/assets/svg/backButtonPdp.svg';
import BoomSvg from '@/assets/svg/boom.svg';
import { UploadModal, DigiLockerKYCModal } from '@/components/ui';

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

const ApplicationStatusScreen = (): JSX.Element => {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([2])); // Step 2 is expanded by default
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isKYCModalVisible, setIsKYCModalVisible] = useState(false);

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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
      <View style={styles.footer}>
        <View style={styles.termsContainer}>
          <TouchableOpacity style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              <Text style={styles.checkboxCheckmark}>✓</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I accept the <Text style={styles.termsLink}>Terms & Conditions</Text> and <Text style={styles.privacyLink}>Privacy Policy</Text>
          </Text>
        </View>
        
        <TouchableOpacity style={styles.submitButton}>
          <LinearGradient
            colors={['#000000', '#61240E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>Let's Capture</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Upload Modal */}
      <UploadModal
        isVisible={isUploadModalVisible}
        onClose={handleCloseUploadModal}
        onUpload={handleFileUpload}
        onCheckStatus={handleCloseUploadModal}
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