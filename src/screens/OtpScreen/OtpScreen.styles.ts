import { StyleSheet } from 'react-native';

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
    gap:8
  },
  helpButtonText: {
    fontSize: 16,
    color: '#983614',
    fontWeight: '600',
  },
  content: {
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 32,
    fontFamily: 'Saans TRIAL',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#717680',
    lineHeight: 20,
    fontFamily: 'Saans TRIAL',
    textAlignVertical: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap:12
  },
  otpInput: {
    flex: 1,
    height: 58,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    fontSize: 24,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'center',
  },
  resendContainer: {
    paddingTop:23
  },
  resendText: {
    fontSize: 14,
    color: '#B7410E',
    fontWeight: '500',
    fontFamily:'Inter'
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 34,
    paddingTop: 20,
    paddingHorizontal: 23,
    gap:14
  },
  verifyButtonTouchable: {
    borderRadius: 100,
  },
  verifyButton: {
    borderRadius: 100,
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 20,
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
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: 'Saans TRIAL',
  },
  facingIssueText: {
    color: '#414651',
  },
  changeNumberText: {
    color: '#B7410E',
  },
});