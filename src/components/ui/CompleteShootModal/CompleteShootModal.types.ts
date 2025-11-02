export interface CompleteShootModalProps {
  isVisible: boolean;
  onClose: () => void;
  onComplete: () => void;
  title?: string;
  completeButtonText?: string;
  cancelButtonText?: string;
}

