import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 20,
    fontFamily: 'Saans TRIAL',
  },
  button: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Saans TRIAL',
    flex: 1,
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  arrow: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pickerCancel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  pickerTitle: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  pickerDone: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  pickerScroll: {
    maxHeight: 300,
  },
  pickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerItemSelected: {
    backgroundColor: '#F0F4F8',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Saans TRIAL',
  },
  pickerItemTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
});

