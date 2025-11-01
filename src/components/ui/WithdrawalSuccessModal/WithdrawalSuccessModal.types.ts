export interface WithdrawalSuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
  amount?: string;
  onViewStatus?: () => void;
}

