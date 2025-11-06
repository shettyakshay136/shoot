import { StyleSheet, Dimensions } from 'react-native';
import { TEXT_COLORS, PRIMARY_COLORS } from '../../../../theme/colors';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4F0',
    width: '100%'
  },
  gradientContainer: {
    height: height * 0.37,
    width: '100%',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom:35,
    paddingTop:52,
    paddingHorizontal:23
  },
  leftSection: {
    flex: 1,
    // marginRight: 16,
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
    letterSpacing: -1.2,
  },
  sectionContainer: {
    padding: 18,
  },
  sectionHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 32,
    color: 'black',
    letterSpacing: 0,
  },
  tabContent: {
    gap: 18,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#D5D7DA',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: PRIMARY_COLORS[900],
    borderColor: PRIMARY_COLORS[900],
  },
  filterText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    color: '#252B37',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  transactionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    gap: 2
  },
  transactionTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 28,
    color: '#181D27',
  },
  transactionSubtext: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '300',
    fontSize: 15,
    lineHeight: 20,
    color: '#717680',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  transactionDate: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '300',
    fontSize: 15,
    lineHeight: 20,
    color: '#717680',
  },
  earningBadge: {
    backgroundColor: '#E8F5E8',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  payoutBadge: {
    backgroundColor: '#FEF0C7',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  amountText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 24,
    color: '#DC6803',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingVertical:25
  },
  actionButton: {
    backgroundColor: '#FFFFFF1F',
    borderRadius: 1000,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    gap:8
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
    // alignItems: 'center',
    // flex: 1,
  },
  todaysEarningContainer: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#F8F4F0',
  },
  todaysEarningLabel: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 22,
    color: '#717680',
    marginBottom: 8,
  },
  todaysEarningAmount: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '700',
    fontSize: 32,
    lineHeight: 40,
    color: '#181D27',
    marginBottom: 16,
  },
  summaryCardsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryCardContent: {
    flex: 1,
  },
  summaryCardValue: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 32,
    color: '#181D27',
    marginBottom: 4,
  },
  summaryCardLabel: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 20,
    color: '#717680',
  },
  starIcon: {
    fontSize: 24,
  },
  allShootsContainer: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#F8F4F0',
  },
  allShootsTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 32,
    color: '#181D27',
    marginBottom: 16,
  },
  shootCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  shootCardTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 28,
    color: '#181D27',
    marginBottom: 8,
  },
  shootCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  shootCardText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '300',
    fontSize: 15,
    lineHeight: 20,
    color: '#717680',
    flex: 1,
  },
  shootCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
  },
  shootCardRating: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: '#181D27',
  },
  shootCardPrice: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: '#181D27',
  },
  starIconSmall: {
    fontSize: 16,
  },
  tabSectionContainer: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#F8F4F0',
  },
  customTabContainer: {
    backgroundColor: 'white',
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    padding: 4,
    flexDirection: 'row',
    marginBottom: 16,
  },
  customTabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  customTabButtonActive: {
    backgroundColor: PRIMARY_COLORS[900],
  },
  customTabText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: '#181D27',
  },
  customTabTextActive: {
    color: '#FFFFFF',
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
    borderWidth:1,
    borderColor:'#E9EAEB'
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
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 1000,
  },
  datePickerButtonRotated: {
    transform: [{ rotate: '180deg' }],
  },
  datePickerText: {
    fontWeight: '600',
    color: '#252B37',
    fontSize: 24,
  },
  earningsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  earningsCardHeader: {
    gap: 4,
  },
  earningsCardTitle: {
    color: '#535862',
    fontWeight: '500',
    fontSize: 16,
  },
  earningsCardAmount: {
    color: 'black',
    fontWeight: '600',
    fontSize: 36,
  },
  earningsCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  starIconLarge: {
    fontSize: 24,
  },
  starIconMedium: {
    fontSize: 15,
  },
  allShootsHeader: {
    gap: 18,
  },
  allShootsList: {
    gap: 12,
  },
  transactionCardSeparator: {
    borderTopColor: '#F5F5F5',
    borderTopWidth: 1,
  },
  transactionCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  amountValue: {
    color: '#181D27',
    fontWeight: '600',
    fontSize: 18,
  },
  filtersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filtersTitle: {
    color: '#414651',
    fontWeight: '600',
    fontSize: 16,
  },
  filtersLink: {
    color: '#B7410E',
    fontWeight: '600',
    fontSize: 16,
  },
  payoutCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    justifyContent: 'space-between',
  },
  payoutId: {
    color: '#717680',
    fontWeight: '400',
    fontSize: 16,
  },
  payoutAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  payoutAmountValue: {
    color: '#181D27',
    fontWeight: '600',
    fontSize: 18,
  },
});

