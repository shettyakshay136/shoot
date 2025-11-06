import { StyleSheet } from 'react-native';
import { PRIMARY_COLORS } from '../../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4F0',
    width: '100%',
    gap:20,
    paddingHorizontal:23
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#F8F4F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 32,
    color: '#252B37',
    flex: 1,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 1000,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: PRIMARY_COLORS[900],
  },
  segmentText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: '#717680',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    gap:10
  },
  accountCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    gap:4
  },
  accountTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 28,
    color: '#181D27',
  },
  accountDetail: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 20,
    color: '#717680',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingTop:12
  },
  editButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#D5D7DA',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#DC2626',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 20,
    color: '#181D27',
  },
  deleteButtonText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: '#DC2626',
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  bottomContainer: {
    paddingVertical: 16,
  },
});

