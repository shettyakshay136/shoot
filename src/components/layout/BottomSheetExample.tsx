import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetRef } from './BottomSheet';

interface BottomSheetExampleProps {
  onClose?: () => void;
}

const BottomSheetExample: React.FC<BottomSheetExampleProps> = ({ onClose }) => {
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.present();
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.dismiss();
    onClose?.();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleOpenBottomSheet}>
        <Text style={styles.buttonText}>Open Bottom Sheet</Text>
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        title="Example Bottom Sheet"
        snapPoints={['25%', '50%', '90%']}
        onDismiss={handleCloseBottomSheet}
      >
        <View style={styles.content}>
          <Text style={styles.contentTitle}>Bottom Sheet Content</Text>
          <Text style={styles.contentText}>
            This is an example of how to use the reusable BottomSheet component.
            You can pass any children to it and customize the appearance.
          </Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleCloseBottomSheet}>
            <Text style={styles.actionButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    fontFamily: 'Saans TRIAL',
  },
  contentText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
    fontFamily: 'Saans TRIAL',
  },
  actionButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BottomSheetExample;
