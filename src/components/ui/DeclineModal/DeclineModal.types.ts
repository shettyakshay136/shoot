export interface DeclineModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDelete: () => void;
  title?: string;
  subtitle?: string;
  deleteButtonText?: string;
  cancelButtonText?: string;
}

