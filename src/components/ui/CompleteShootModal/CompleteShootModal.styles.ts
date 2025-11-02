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
    paddingTop: 12,
    width: '100%',
  },
  handleLine: {
    width: 40,
    height: 4,
    backgroundColor: '#000000',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap:6
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Saans TRIAL',
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  completeButtonTouchable: {
    borderRadius: 100,
    width: '100%',
  },
  completeButton: {
    borderRadius: 120,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Saans TRIAL',
    color: '#FFFFFF',
  },
  cancelButton: {
    borderRadius: 100,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Saans TRIAL',
    color: '#111827',
  },
  content: {
    padding: 0,
  },
});

