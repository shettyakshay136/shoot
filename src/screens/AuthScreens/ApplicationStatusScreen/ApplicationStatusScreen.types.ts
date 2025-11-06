export interface Step {
  id: number;
  title: string;
  status: 'completed' | 'active' | 'pending';
  timeAgo?: string;
  estimatedTime?: string;
  description: string;
  isExpanded?: boolean;
  actionButton?: {
    text: string;
    onPress: () => void;
  };
}



