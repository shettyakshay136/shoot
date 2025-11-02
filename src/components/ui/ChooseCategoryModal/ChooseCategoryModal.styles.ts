import { StyleSheet } from 'react-native';
import { PRIMARY_COLORS } from '@/theme/colors';

export const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
    width: '100%',
  },
  handleLine: {
    width: 40,
    height: 4,
    backgroundColor: '#9CA3AF',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Saans TRIAL',
    marginBottom: 20,
  },
  categoriesContainer: {
    gap: 12,
    marginBottom: 24,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleSelected: {
    backgroundColor: PRIMARY_COLORS[900],
    borderColor: PRIMARY_COLORS[900],
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#111827',
    fontFamily: 'Saans TRIAL',
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
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
});

