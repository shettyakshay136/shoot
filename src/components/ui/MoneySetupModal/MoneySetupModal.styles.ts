import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 100,
  },
  illustrationContainer: {
    alignItems: 'center',
    gap: 12,
  },
  optionalBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  optionalBadgeText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Saans TRIAL',
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingBottom:10
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Saans TRIAL',
  },
  optionsContainer: {
    width: '100%',
    gap: 19,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  optionRowSelected: {
    borderColor: '#983614',
    backgroundColor:'#FFFBF6'
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#983614',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#983614',
  },
  optionText: {
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Saans TRIAL',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  primaryTouchable: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  primaryButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: '#F3F4F6',
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
});


