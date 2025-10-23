import React, { forwardRef, useImperativeHandle, useRef, type ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheetModal, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet';

interface BottomSheetProps {
  children: ReactNode;
  snapPoints?: string[];
  enablePanDownToClose?: boolean;
  enableDismissOnClose?: boolean;
  onDismiss?: () => void;
  title?: string;
  showHandle?: boolean;
  backgroundColor?: string;
  handleColor?: string;
}

export interface BottomSheetRef {
  present: () => void;
  dismiss: () => void;
  close: () => void;
}

const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      children,
      snapPoints = ['25%', '50%', '90%'],
      enablePanDownToClose = true,
      enableDismissOnClose = true,
      onDismiss,
      title,
      showHandle = true,
      backgroundColor = '#FFFFFF',
      handleColor = '#D1D5DB',
    },
    ref
  ) => {
    const bottomSheetModalRef = useRef<BottomSheetModalMethods>(null);

    useImperativeHandle(ref, () => ({
      present: () => {
        bottomSheetModalRef.current?.present();
      },
      dismiss: () => {
        bottomSheetModalRef.current?.dismiss();
      },
      close: () => {
        bottomSheetModalRef.current?.close();
      },
    }));

    const renderBackdrop = React.useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          onPress={() => {
            if (enableDismissOnClose) {
              bottomSheetModalRef.current?.dismiss();
            }
          }}
        />
      ),
      [enableDismissOnClose]
    );

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={enablePanDownToClose}
          onDismiss={onDismiss}
          backdropComponent={renderBackdrop}
          backgroundStyle={[styles.background, { backgroundColor }]}
          handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: handleColor }]}
        >
          <View style={styles.content}>
            {title && (
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
              </View>
            )}
            <View style={styles.childrenContainer}>
              {children}
            </View>
          </View>
        </BottomSheetModal>
      </GestureHandlerRootView>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    fontFamily: 'Saans TRIAL',
  },
  childrenContainer: {
    flex: 1,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
});

export default BottomSheet;
