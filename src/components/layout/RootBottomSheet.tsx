import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheetModal, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet';
import { useBottomSheet } from '@/contexts/BottomSheetContext';

export interface RootBottomSheetRef {
  present: () => void;
  dismiss: () => void;
  close: () => void;
}

const RootBottomSheet = forwardRef<RootBottomSheetRef>((props, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModalMethods>(null);
  const { content, dismiss: contextDismiss } = useBottomSheet();

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
          bottomSheetModalRef.current?.dismiss();
        }}
      />
    ),
    []
  );

  if (!content) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={['40%', '50%', '90%']}
        enablePanDownToClose={true}
        enableDismissOnClose={true}
        onDismiss={contextDismiss}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View style={styles.content}>
          {content}
        </View>
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
});

RootBottomSheet.displayName = 'RootBottomSheet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    backgroundColor: '#D1D5DB',
  },
});

export default RootBottomSheet;
