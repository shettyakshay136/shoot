export interface CalendarModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDateSelect: (startDate: string | null, endDate: string | null) => void;
  startDate?: string | null;
  endDate?: string | null;
  mode?: 'single' | 'range';
}

