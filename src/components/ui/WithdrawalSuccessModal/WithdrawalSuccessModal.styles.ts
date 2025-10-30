import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  content: {
    padding: 0,
  },
  scrollContent: {
    // alignItems: 'center',
    gap: 24,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleLine: {
    width: "40%",
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 2,
    alignSelf: 'center',
  },
  messageContainer: {
    // alignItems: 'center',
    gap: 8,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#181D27',
    fontFamily: 'Saans TRIAL',
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#717680',
    fontFamily: 'Saans TRIAL',
    textAlign: 'center',
  },
  amountCard: {
    backgroundColor: '#F5F3F0',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    gap: 8,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#252B37',
    fontFamily: 'Saans TRIAL',
  },
  amountValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#B7410E',
    fontFamily: 'Saans TRIAL',
  },
  viewStatusButtonTouchable: {
    borderRadius: 100,
    overflow: 'hidden',
    width: '100%',
  },
  viewStatusButton: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  viewStatusButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Saans TRIAL',
  },
  viewStatusButtonArrow: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

