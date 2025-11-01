import { StyleSheet } from 'react-native';


const FONT_SIZE = 36;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  backgroundImage: { 
    flex: 1, 
    width: '100%', 
    height: '100%' 
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  contentContainer: { 
    position:'absolute',
    bottom:0,
    paddingHorizontal:21,
    paddingBottom:28,
    gap:24
  },
  brand: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  headline: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE,
    fontWeight: '700',
    lineHeight: 44,
    letterSpacing: FONT_SIZE * -0.02,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF1A',
    width: '100%',
  },
  countryPrefix: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    marginRight: 8 
  },
  phoneInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    height: 52,
    paddingVertical: 0,
  },
  signInButton: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  signInButtonDisabled: { 
    backgroundColor: 'rgba(255,255,255,0.6)',
    opacity: 0.5,
  },
  buttonContainer: {
    gap: 24,
  },
  signInText: { 
    color: '#983614', 
    fontSize: 18, 
    fontWeight: '600' 
  },
  signInTextDisabled: { 
    color: 'rgba(152,54,14,0.6)' 
  },
  registerText: { 
    color: 'rgba(255,255,255,0.95)', 
    fontSize: 14 
  },
  registerLink: {
    textDecorationLine: 'underline',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  registerButtonContainer: {
    alignSelf: 'center',
  },
  inputRowFocused: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderColor: 'rgba(255,255,255,0.85)',
  },
  inputRowUnfocused: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderColor: 'rgba(255,255,255,0.3)',
  },
  homeIndicatorWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 3,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
    opacity: 0.95,
  },
});

export default styles;
