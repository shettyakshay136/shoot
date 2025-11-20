import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  handleLine: {
    width: '40%',
    height: 5,
    backgroundColor: 'black',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    width: '100%',
    maxHeight: '85%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Saans TRIAL',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#374151',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    fontSize: 13,
    color: '#1E3A8A',
    fontFamily: 'Saans TRIAL',
    flex: 1,
    lineHeight: 18,
  },
  verifyBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  verifyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Saans TRIAL',
    marginBottom: 12,
  },
  verifyList: {
    gap: 8,
  },
  verifyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkmark: {
    fontSize: 16,
    color: '#10B981',
    marginRight: 8,
    marginTop: 2,
  },
  verifyItemText: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'Saans TRIAL',
    flex: 1,
    lineHeight: 18,
  },
  startButton: {
    borderRadius: 999,
    overflow: 'hidden',
    height:52
  },
  startButtonGradient: {
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height:52
  },
  startButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Saans TRIAL',
    marginRight: 8,
  },
  arrowIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  laterButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  laterButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Saans TRIAL',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Saans TRIAL',
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Saans TRIAL',
    flex: 1,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  errorIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  errorText: {
    fontSize: 13,
    color: '#991B1B',
    fontFamily: 'Saans TRIAL',
    flex: 1,
    lineHeight: 18,
  },
  retryButton: {
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 12,
  },
});

