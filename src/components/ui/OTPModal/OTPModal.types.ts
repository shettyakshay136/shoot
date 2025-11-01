export interface OTPModalProps {
  isVisible: boolean;
  onClose: () => void;
  onVerify: () => void;
  onResend?: () => void;
  title?: string;
  subtitle?: string;
}

