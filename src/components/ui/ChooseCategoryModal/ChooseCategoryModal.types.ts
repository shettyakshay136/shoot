export type Category = 'Reels' | 'Pictures' | 'Raw clips' | 'Mic';

export interface ChooseCategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  onUpload: (category: Category) => void;
  selectedCategory?: Category;
}

