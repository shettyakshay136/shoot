import { StyleSheet } from 'react-native';
import { PRIMARY_COLORS } from '../../theme/colors';

export const styles = StyleSheet.create({
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
    backgroundColor: 'transparent',
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
});
