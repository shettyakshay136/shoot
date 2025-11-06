import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4F0',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 23,
    paddingTop: 24,
    paddingBottom: 24,
  },
  buttonContainer: {
    paddingHorizontal: 23,
    paddingBottom: 24,
    paddingTop: 16,
    backgroundColor: '#F8F4F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 12,
  },
  title: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '700',
    fontSize: 28,
    color: '#181D27',
    flex: 1,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  idText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '500',
    fontSize: 16,
    color: '#535862',
  },
  copyButton: {
    padding: 4,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTimeText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '400',
    fontSize: 14,
    color: '#717680',
  },
  paymentStatusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentStatusLeft: {
  },
  paymentStatusLabel: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '400',
    fontSize: 16,
    color: '#535862',
  },
  paymentAmount: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 18,
    color: '#181D27',
  },
  statusBadge: {
    backgroundColor: '#FEF0C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection:'row',
    gap:10
  },
  statusBadgeText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 12,
    color: '#E75B0F',
    top:1.2
  },
  sectionTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 18,
    color: '#181D27',
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  accountName: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 18,
    color: '#181D27',
  },
  accountDetailRow: {
    gap: 4,
  },
  accountDetailLabel: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '400',
    fontSize: 16,
    color: '#535862',
  },
  accountDetailValue: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 16,
    color: '#181D27',
  },
  transactionIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transactionIdText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 16,
    color: '#717680',
    flex: 1,
  },
  noticeBox: {
    backgroundColor: '#FEF0C7',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal:10,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    alignItems:'flex-start'
  },
  noticeText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '400',
    fontSize: 14,
    color: '#B54708',
    flex: 1,
    lineHeight: 20,
  },
  supportButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  supportButtonText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 18,
    color: '#000000',
  },
  copyIcon: {
    fontSize: 16,
  },
  headphoneIcon: {
    fontSize: 20,
  },
});

