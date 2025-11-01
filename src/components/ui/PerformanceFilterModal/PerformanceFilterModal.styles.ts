import { StyleSheet } from 'react-native';
import { PRIMARY_COLORS } from '@/theme/colors';

export const styles = StyleSheet.create({
  container: {
    paddingVertical:12,
    gap: 16,
  },
  handleLine: {
    width: "40%",
    height: 5,
    backgroundColor: '#D5D7DA',
    borderRadius: 2,
    alignSelf: 'center',
  },
  title: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '700',
    fontSize: 24,
    color: '#181D27',
    textAlign: 'center',
    marginBottom: 8,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '700',
    fontSize: 14,
    color: '#262626',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9EAEB',
    width:'48%'
  },
  chipActive: {
    backgroundColor: '#983614',
    borderColor: PRIMARY_COLORS[900],
  },
  chipText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 18,
    color: '#414651',
    textAlign:'center'
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  applyButton: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius:100
  },
  applyText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '700',
    fontSize: 16,
    color: '#FFFFFF',
  },
  applyTouchable: {
    borderRadius: 100,
    backgroundColor:"red"
    // marginTop: 8,
  },
});


