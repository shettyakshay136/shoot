import { StyleSheet } from 'react-native';
import { PRIMARY_COLORS } from '../../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120, // Add padding to account for fixed bottom buttons
  },
  gradientBackground: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  countdownText: {
    fontSize: 120,
    fontWeight: '700',
    fontFamily: 'Saans TRIAL',
    color: '#FFFFFF',
    letterSpacing: -2,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Saans TRIAL',
    color: '#FDD8AB',
  },
  deadlineContentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deadlineContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  deadlineLabel: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Saans TRIAL',
    color: '#FDD8AB',
    letterSpacing: 0.5,
  },
  deadlineText: {
    fontSize: 72,
    fontWeight: '700',
    fontFamily: 'Saans TRIAL',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  deadlineSubtext: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'Saans TRIAL',
    color: '#FEEDD6',
    textAlign: 'center',
    marginTop: 4,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    width: '100%',
  },
  submitDeliveryButton: {
    backgroundColor: '#FFFFFF1F',
    borderRadius: 10000,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitDeliveryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Saans TRIAL',
    color: 'white',
  },
  eventTitleContainer: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 12,
  },
  eventTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 24,
    color: '#252B37',
  },
  uploadSection: {
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  uploadCardHeader: {
    backgroundColor: '#FFF7ED',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9EAEB',
  },
  uploadCardHeaderContent: {
    flex: 1,
    gap: 4,
  },
  uploadCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Saans TRIAL',
    color: '#252B37',
  },
  uploadCardSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Saans TRIAL',
    color: '#535862',
  },
  chevronIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#61240E',
  },
  uploadCardContent: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    minHeight: 80,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9EAEB',
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Saans TRIAL',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 18,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9EAEB',
    gap: 12,
  },
  uploadButtonTouchable: {
    borderRadius: 100,
    width: '100%',
  },
  uploadButton: {
    borderRadius: 120,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Saans TRIAL',
    color: '#FFFFFF',
  },
  uploadLaterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  uploadLaterButtonText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Saans TRIAL',
    color: PRIMARY_COLORS[700],
  },
});

