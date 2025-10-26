import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 0,
  },
  scrollContent: {
    paddingVertical: 12,
    gap: 8,
  },
  imageContainer: {
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    gap:8
  },
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#181D27',
    fontFamily: 'Saans TRIAL',
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#717680',
    fontFamily: 'Saans TRIAL',
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical:20
  },
  otpInput: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: '#D5D7DA',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#181D27',
    fontFamily: 'Saans TRIAL',
    textAlign:'center'
  },
  verifyButtonTouchable: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  verifyButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Saans TRIAL',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#B7410E',
    fontFamily: 'Saans TRIAL',
  },
});

