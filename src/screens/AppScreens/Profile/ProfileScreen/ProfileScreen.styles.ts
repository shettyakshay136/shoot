import { StyleSheet } from 'react-native';
import { PRIMARY_COLORS, TEXT_COLORS } from '../../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradientContainer: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: TEXT_COLORS.primary,
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontWeight: '500',
    color: TEXT_COLORS.secondary,
    marginTop: 4,
  },
  contactNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: TEXT_COLORS.secondary,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_COLORS.primary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: TEXT_COLORS.tertiary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_COLORS.primary,
  },
  logoutButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY_COLORS[500],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 24,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default styles;

