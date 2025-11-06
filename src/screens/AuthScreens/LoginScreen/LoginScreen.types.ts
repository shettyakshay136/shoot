export interface LoginScreenProps {
  navigation?: any;
  route?: any;
}

export interface LoginScreenState {
  phoneNumber: string;
  inputFocused: boolean;
}

export interface LoginScreenRef {
  focusInput: () => void;
  clearInput: () => void;
}
