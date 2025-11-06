import { StyleSheet, Dimensions } from 'react-native';
import { PRIMARY_COLORS, TEXT_COLORS } from '@/theme/colors';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4F0',
    width: '100%',
  },
  gradientContainer: {
    height: height * 0.35,
    width: '100%',
    gap:30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:12,
    paddingTop:52,
    paddingHorizontal:23
    // justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: 'white',
    borderRadius: 1000,
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 24,
    color: '#FFFFFF',
  },
  scoreBlock: {
    alignItems: 'center',
    gap: 4,
  },
  scoreValue: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '700',
    fontSize: 60,
    lineHeight: 72,
    color: '#FFFFFF',
    letterSpacing: -1.2,
  },
  scoreLabel: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 16,
    color: '#FDD8AB',
  },
  tabPillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent:'center'
  },
  tabPill: {
    backgroundColor: '#FFFFFF1F',
    borderRadius: 1000,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth:1,
    borderColor:'#D5D7DA'
  },
  tabPillActive: {
    backgroundColor: '#FFFFFF',
  },
  tabPillText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 14,
    color: '#FFFFFF',
  },
  tabPillTextActive: {
    color: PRIMARY_COLORS[900],
  },

  sectionContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
  },
  cardTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 16,
    color: '#535862',
  },
  amountBig: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 36,
    color: '#000000',
    letterSpacing: -0.2,
  },
  deltaPositive: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 18,
    color: '#039855',
    top:-4
  },
  filterChip: {
    borderRadius: 8,
    backgroundColor: 'white',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth:1,
    borderColor:'#E9EAEB'
  },
  filterChipText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 14,
    color: '#B7410E',
  },
  rangesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  rangeButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#E9EAEB',
    backgroundColor: '#FFFFFF',
  },
  rangeButtonActive: {
    backgroundColor: PRIMARY_COLORS[900],
    borderColor: PRIMARY_COLORS[900],
  },
  rangeText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '500',
    fontSize: 16,
    color: '#9AA4B2',
  },
  rangeTextActive: {
    color: '#FFFFFF',
  },
  chart: {
    borderRadius: 12,
  },
  crosshair: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(225, 143, 64, 0.6)',
  },
  tooltipBox: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  tooltipTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '500',
    fontSize: 14,
    color: '#535862',
  },
  tooltipValue: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '800',
    fontSize: 22,
    color: '#181D27',
  },
  helperText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '400',
    fontSize: 16,
    color: '#717680',
    padding:12
  },
  helperStrong: {
    fontWeight: '700',
    color: '#983614',
  },

  listHeader: {
    paddingTop: 8,
  },
  listHeaderText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 20,
    color: '#181D27',
  },
  metricRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal:10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricEmoji: {
    fontSize: 50,
  },
  metricValue: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '700',
    fontSize: 20,
    color: '#181D27',
  },
  metricLabel: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '500',
    fontSize: 16,
    color: '#A4A7AE',
  },
  metricDeltaPositive: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 16,
    color: '#039855',
  },
  metricDeltaNegative: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 14,
    color: '#E63B2E',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  metricsContainer: {
    padding: 18,
    gap: 18,
  },
  metricList: {
    gap: 12,
  },
  metricContent: {
    flex: 1,
  },
});


