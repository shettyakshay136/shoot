import { StyleSheet , Dimensions } from 'react-native';


const SCREEN_HEIGHT = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    gap:23,
    paddingHorizontal:23
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButton: {
    borderRadius: 1000,
    backgroundColor: '#FEEDD6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical:10,
    paddingHorizontal:16,
    flexDirection:'row',
    gap:4
  },
  helpButtonText: {
    fontSize: 16,
    color: '#983614',
    fontWeight: '600',
  },
  content: {
    gap:20
  },
  dropdownContainer: {
    position: 'relative',
  },
  inputContainer: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 20,
    fontFamily: 'Saans TRIAL',
  },
  dropdownButtonFocused: {
    borderWidth: 1.5,
    borderColor: '#414651',
  },
  dropdownButton: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Saans TRIAL',
    flex: 1,
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  dropdownList: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    overflow:'hidden',
    maxHeight:SCREEN_HEIGHT * 0.5,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Saans TRIAL',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 32,
    fontFamily: 'Saans TRIAL',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 21,
    paddingTop: 20,
    paddingHorizontal: 23,
    gap:14
  },
  verifyButtonTouchable: {
    borderRadius: 100,
    overflow:'hidden'
  },
  dropdownItemSelected: {
    backgroundColor: '#FEEDD6',
  },
  dropdownItemTextSelected: {
    color: '#983614',
  },
  verifyButton: {
    borderRadius: 100,
    height:48,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    opacity: 1,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  verifyButtonTextDisabled: {
    color: '#FFFFFF',
  },
  // BottomSheet styles
  bottomSheetContent: {
    paddingVertical: 20,
    gap: 24,
  },
  successTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 32,
    color: '#111827',
    textAlign: 'center',
  },
  successSubtitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  whatHappensNext: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 28,
    color: '#B7410E',
    textAlign: 'center',
    marginBottom: 18,
  },
  steps: {
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  stepNumber: {
    width: 42,
    height: 42,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingRight: 17,
    paddingBottom: 8,
    paddingLeft: 17,
  },
  stepNumberText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#B7410E',
  },
  stepContent: {
    flex: 1,
    gap: 4,
  },
  stepTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#111827',
  },
  stepDescription: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
  confirmButton: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    gap:4
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Saans TRIAL',
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'relative',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieOverlay: {
    position: 'absolute',
    // top: -12,
    // left: -12,
    // right: -12,
    // bottom: -12,
    width: 250,
    height: 150,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  boomSvgContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
  },
  miniLottieOverlay: {
    position: 'absolute',
    // top: -8,
    // left: -8,
    // right: -8,
    // bottom: -8,
    width: 250,
    height: 150,
  },
  miniLottieAnimation: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    gap: 8,
  },
  stepsContainer: {
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
  },
});