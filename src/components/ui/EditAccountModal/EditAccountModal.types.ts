export interface EditAccountModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (accountNumber: string, ifsc: string) => void;
  initialAccountNumber?: string;
  initialIfsc?: string;
  title?: string;
}
