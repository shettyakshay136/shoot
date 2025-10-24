import { StyleSheet, Dimensions } from 'react-native';
import { TEXT_COLORS, PRIMARY_COLORS } from '../../theme/colors';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4F0',
    width: '100%'
  },
  gradientContainer: {
    paddingHorizontal: 18,
    height: height * 0.5, // Exactly half of the screen height
    width: '100%',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 16
  },
  leftSection: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 30,
    color: TEXT_COLORS.primary,
    letterSpacing: 0,
  },
  address: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: TEXT_COLORS.secondary,
    width: '60%',
    letterSpacing: 0,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  toggleButtonActive: {
    backgroundColor: PRIMARY_COLORS[500],
    borderColor: PRIMARY_COLORS[500],
  },
  toggleButtonInactive: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  toggleText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  toggleTextInactive: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  balanceSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 23,
  },
  balanceInfo: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 28,
    color: '#FDD8AB',
    letterSpacing: 0,
  },
  balanceAmount: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '700',
    fontSize: 60,
    lineHeight: 72,
    color: '#FFFFFF',
    letterSpacing: -1.2, // -2% of 60px
  },
  earnMoreButton: {
    backgroundColor: '#FFFFFF1F',
    borderRadius: 1000,
    paddingTop: 10,
    paddingRight: 16,
    paddingBottom: 10,
    paddingLeft: 16,
  },
  earnMoreText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    letterSpacing: 0,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 37
  },
  actionButton: {
    backgroundColor: '#FFFFFF1F',
    borderRadius: 1000,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    marginTop: 4,
  },
  actionButtonContainer: {
    alignItems: 'center'
  },
  sectionContainer: {
    padding: 18,
  },
  sectionHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 32,
    color: 'black',
    letterSpacing: 0,
  },
  sectionall: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 32,
    color: '#252B37',
    letterSpacing: 0,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#D5D7DA',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: PRIMARY_COLORS[900], // #61240E
    borderColor: PRIMARY_COLORS[900],
  },
  inactiveTabButton: {
    backgroundColor: 'white',
    borderColor: '#D5D7DA',
  },
  tabButtonText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  activeTabButtonText: {
    color: 'white',
  },
  inactiveTabButtonText: {
    color: '#252B37',
  },
  tabContent: {
    gap: 12
  },
  upcomingContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    gap: 2
  },
  contentText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 28,
    color: '#181D27',
  },
  contentSubtext: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '300',
    fontSize: 15,
    lineHeight: 20,
    color: '#717680',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  payBadge: {
    backgroundColor: '#FEEDD6',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  daysBadge: {
    backgroundColor: '#FEEDD6',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  completedBadge: {
    backgroundColor: '#E8F5E8',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  rejectedBadge: {
    backgroundColor: '#FFE5E5',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  performanceSection: {
    paddingVertical: 18,
  },
  performanceCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceCard: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  performanceIcon: {
    width: 40,
    height: 40,
  },
  performanceValue: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 18,
  },
  performanceLabel: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 16,
    color: '#A4A7AE',
  },
  footerSection: {
    gap: 8,
    paddingVertical: 44,
  },
  footerTitle: {
    color: '#FBBB76',
    fontSize: 26,
    fontWeight: '500',
    fontFamily: 'Saans TRIAL',
  },
  footerSubtitle: {
    color: '#B7410E',
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Saans TRIAL',
  },
  footerDescription: {
    color: '#252B37',
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Saans TRIAL',
  },
});
