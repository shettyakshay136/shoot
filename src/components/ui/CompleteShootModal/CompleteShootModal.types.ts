export interface CompleteShootModalProps {
  isVisible: boolean;
  onClose: () => void;
  onComplete: () => void;
  onModalHide?: () => void;
  title?: string;
  completeButtonText?: string;
  cancelButtonText?: string;
}

