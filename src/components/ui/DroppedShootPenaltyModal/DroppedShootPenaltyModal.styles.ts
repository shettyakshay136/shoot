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
    padding: 24,
    width: '100%',
  },
  handleLine: {
    width: '30%',
    height: 4,
    backgroundColor: 'black',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Saans TRIAL',
    textAlign: 'center',
  },
  content: {
    gap: 10,
  },
  description: {
    fontSize: 18,
    fontWeight: '300',
    color: '#374151',
    fontFamily: 'Saans TRIAL',
    lineHeight: 28,
  },
  closeButton: {
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Saans TRIAL',
  },
});

