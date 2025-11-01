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
  quickCheckLabel: {
    backgroundColor: '#F4F4F5',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'center',
  },
  quickCheckText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Saans TRIAL',
  },
  questionText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#181D27',
    fontFamily: 'Saans TRIAL',
    textAlign: 'center',
  },
  buttonsContainer: {
    gap: 12,
  },
  confirmButtonTouchable: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  confirmButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:100
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Saans TRIAL',
  },
  declineButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    borderRadius: 100,
    backgroundColor: '#F5F5F5',
    borderWidth:1,
    borderColor:'#D5D7DA'
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181D27',
    fontFamily: 'Saans TRIAL',
  },
});

