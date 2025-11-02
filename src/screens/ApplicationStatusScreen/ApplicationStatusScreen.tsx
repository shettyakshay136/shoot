import React, { useState, type JSX } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './ApplicationStatusScreen.styles';
import type { Step } from './ApplicationStatusScreen.types';
import BackButton from '@/assets/svg/backButtonPdp.svg';
import BoomSvg from '@/assets/svg/boom.svg';
import { UploadModal } from '@/components/ui';
import { MoneySetupModal } from '@/components/ui';
import DocumentPicker, { isInProgress, types as DocumentTypes } from 'react-native-document-picker';
import Infoicon from '@/assets/svg/info.svg';
import Tick from '@/assets/svg/tick.svg';
import ArrowUp from '@/assets/svg/arrow-up-right.svg';

const ApplicationStatusScreen = (): JSX.Element => {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([2])); // Step 2 is expanded by default
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isMoneyModalVisible, setIsMoneyModalVisible] = useState(false);

  const handleUploadAssignment = () => {
    setIsUploadModalVisible(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalVisible(false);
  };

  const handleFileUpload = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentTypes.allFiles],
        allowMultiSelection: true,
        copyTo: Platform.OS === 'android' ? 'cachesDirectory' : 'documentDirectory',
        presentationStyle: 'fullScreen',
      });

      const formData = new FormData();
      results.forEach((file: any, index: number) => {
        const uri = file.fileCopyUri ?? file.uri;
        formData.append('files', {
          uri,
          type: file.type ?? 'application/octet-stream',
          name: file.name ?? `upload-${index}`,
        } as any);
      });

      // Example upload (adjust endpoint as needed)
      // await rogApi.post('/uploads', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      console.log('Selected files:', results.map((f: any) => ({ name: f.name, size: f.size, uri: f.fileCopyUri ?? f.uri })));

      setSteps(prevSteps => {
        const updatedSteps = [...prevSteps];
        const currentActiveIndex = updatedSteps.findIndex(step => step.status === 'active');
        if (currentActiveIndex !== -1) {
          updatedSteps[currentActiveIndex] = {
            ...updatedSteps[currentActiveIndex],
            status: 'completed',
            timeAgo: updatedSteps[currentActiveIndex].id === 1 ? 'Just now' : undefined,
            actionButton: undefined,
          };
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
    } catch (e: any) {
      if (DocumentPicker.isCancel(e)) {
        // user cancelled
      } else if (isInProgress(e)) {
        console.warn('Multiple pickers opened');
      } else {
        console.error('File picking error:', e);
      }
    }
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
    // Handle KYC verification logic here
    console.log('KYC verification initiated');
    
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
        
        // Mark next step as active and completed (Onboarded step)
        const nextStepIndex = currentActiveIndex + 1;
        if (nextStepIndex < updatedSteps.length) {
          updatedSteps[nextStepIndex] = {
            ...updatedSteps[nextStepIndex],
            status: 'completed',
            timeAgo: updatedSteps[nextStepIndex].id === 1 ? 'Just now' : undefined,
            description: 'onboarded_message', // Special identifier for onboarded message
          };
        }
      }
      
      return updatedSteps;
    });
  };

  const handleMoneyContinue = (method: 'bank' | 'upi') => {
    console.log('Selected payout method:', method);
    setIsMoneyModalVisible(false);
  };

  const handleMoneySkip = () => {
    console.log('Skipped payout setup');
    setIsMoneyModalVisible(false);
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
          <Tick/>
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
                <ArrowUp/>

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Application Status</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Infoicon/>
          <Text style={styles.helpButtonText}>Help</Text>
        </TouchableOpacity>
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
        
        <TouchableOpacity onPress={() => setIsMoneyModalVisible(true)}>
          <LinearGradient
            colors={['#000000', '#61240E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>Let's Capture</Text>
            <ArrowUp/>
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

      {/* Money Setup Modal */}
      <MoneySetupModal
        isVisible={isMoneyModalVisible}
        onClose={() => setIsMoneyModalVisible(false)}
        onContinue={handleMoneyContinue}
        onSkip={handleMoneySkip}
        defaultMethod={null}
      />
    </View>
  );
};

export default ApplicationStatusScreen;
