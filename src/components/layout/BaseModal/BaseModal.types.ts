import { type ReactNode } from 'react';

export interface BaseModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  showHeader?: boolean;
  modalStyle?: object;
  containerStyle?: object;
  contentStyle?: object;
  animationType?: 'slideInUp' | 'slideInDown' | 'fadeIn' | 'zoomIn';
  animationOut?: 'slideOutUp' | 'slideOutDown' | 'fadeOut' | 'zoomOut';
  backdropOpacity?: number;
  onModalHide?: () => void;
}

