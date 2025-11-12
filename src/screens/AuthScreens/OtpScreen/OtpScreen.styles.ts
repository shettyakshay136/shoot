import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop:50,
    paddingHorizontal: 23,
    // paddingBottom: Platform.OS === 'ios' ? 20 : 130,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButton: {
    borderRadius: 1000,
    backgroundColor: '#FEEDD6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 44,
  },
  helpButtonText: {
    fontSize: 16,
    color: '#983614',
    fontWeight: '600',
  },
  content: {
    marginTop: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 34,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Saans TRIAL',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#717680',
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Saans TRIAL',
  },
  otpSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: Platform.OS === 'ios' ? 0 : 0,
  },
  otpInput: {
    flex: 1,
    height: 64,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    fontSize: 28,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        paddingTop: 0,
        paddingBottom: 0,
      },
      android: {
        textAlignVertical: 'center',
      },
    }),
  },
  resendContainer: {
    paddingVertical: 12,
  },
  resendText: {
    fontSize: 14,
    color: '#B7410E',
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  bottomContainer: {
    // paddingBottom: Platform.OS === 'ios' ? 20 : 34,
    // paddingHorizontal: 23,
    // gap: 14,
    // backgroundColor: 'white',
    // borderTopColor: '#F3F4F6',
    position:'absolute',
    bottom:0,
    width:'100%',
    alignSelf:'center',
    gap:14
  },
  verifyButtonTouchable: {
    borderRadius: 100,
  },
  verifyButton: {
    borderRadius: 120,
    height: 56,
    // paddingHorizontal: 20,
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
  helpText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Saans TRIAL',
  },
  facingIssueText: {
    color: '#414651',
  },
  changeNumberText: {
    color: '#B7410E',
  },
});
