export interface WithdrawModalProps {
  isVisible: boolean;
  onClose: () => void;
  availableBalance?: string;
  onWithdraw?: (data: {
    amount: string;
    option: 'UPI' | 'Bank Account';
    account: string;
  }) => void;
}

