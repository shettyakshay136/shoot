import React, { createContext, useContext, useRef, type ReactNode } from 'react';
import RootBottomSheet, { RootBottomSheetRef } from '@/components/layout/RootBottomSheet';

interface BottomSheetContextType {
  present: () => void;
  dismiss: () => void;
  close: () => void;
  setContent: (content: ReactNode) => void;
  content: ReactNode | null;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

interface BottomSheetProviderProps {
  children: ReactNode;
}

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({ children }) => {
  const bottomSheetRef = useRef<RootBottomSheetRef>(null);
  const [content, setContent] = React.useState<ReactNode | null>(null);

  const present = () => {
    bottomSheetRef.current?.present();
  };

  const dismiss = () => {
    bottomSheetRef.current?.dismiss();
  };

  const close = () => {
    bottomSheetRef.current?.close();
  };

  const value: BottomSheetContextType = {
    present,
    dismiss,
    close,
    setContent,
    content,
  };

  return (
    <BottomSheetContext.Provider value={value}>
      {children}
      <RootBottomSheet ref={bottomSheetRef} />
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = (): BottomSheetContextType => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};
