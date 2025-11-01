import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: '#FFFFFF',
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
  },
  content: {
    padding: 0,
  },
  scrollContent: {
    paddingVertical:12,
    // paddingHorizontal:18,
    gap:16,

    // padding: 20,
    // paddingBottom: 40,
  },
  calendarIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  startingTag: {
    backgroundColor: '#F4F4F5',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  startingTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Saans TRIAL',
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#181D27',
    fontFamily: 'Saans TRIAL',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth:1,
    borderColor:'#D5D7DA'
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#535862',
    fontFamily: 'Saans TRIAL',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#181D27',
    fontFamily: 'Saans TRIAL',
  },
  linkText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#B7410E',
    fontFamily: 'Saans TRIAL',
  },
  readinessCardBorder: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D5D7DA99',
    paddingVertical:10
    // paddingBottom:50
  },
  readinessCard: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal:12,
  },
  readinessTextContainer: {
    flex: 1,
    gap:2
  },
  readinessTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#983614',
    fontFamily: 'Saans TRIAL',
  },
  readinessSubtext: {
    fontSize: 12,
    fontWeight: '400',
    color: '#B7410E',
    fontFamily: 'Saans TRIAL',
  },
  startButtonTouchable: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  startButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Saans TRIAL',
  },
  dropEventText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
    textAlign: 'center',
    fontFamily: 'Saans TRIAL',
  },
});

