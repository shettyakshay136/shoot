export interface Shoot {
  title: string;
  client: string;
  location: string;
  date: string;
  time: string;
  niche: string;
  distance: string;
  eta: string;
}

export interface UpcomingShootModalProps {
  isVisible: boolean;
  onClose: () => void;
  shoot: Shoot | null;
  onStartButtonPress?: () => void;
}

