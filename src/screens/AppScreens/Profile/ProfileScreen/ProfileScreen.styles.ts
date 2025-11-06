import { StyleSheet } from 'react-native';
import { NEUTRAL_COLORS } from '@/theme/colors';

const RADIUS = 16;

const styles = StyleSheet.create({
  // Page
  wrapper: {
    flex: 1,
    backgroundColor: NEUTRAL_COLORS[50],
  },
  scrollBody: {
    paddingBottom: 24,
  },

  // Header
  headerGradient: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: RADIUS,
    borderBottomRightRadius: RADIUS,
    overflow: 'hidden',
    marginBottom: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  referPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    gap: 8,
  },
  referText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  headerProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginRight: 16,
  },
  headerDetails: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  phone: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },

  // Badges
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#EFEFEF',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },

  // Quick actions
  quickRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  quickCard: {
    flex: 1,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  quickIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: NEUTRAL_COLORS[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  quickTitle: {
    color: NEUTRAL_COLORS[800],
    fontWeight: '600',
  },

  // Section label
  sectionLabel: {
    paddingHorizontal: 16,
    marginBottom: 8,
    color: NEUTRAL_COLORS[500],
    fontSize: 14,
    fontWeight: '600',
  },

  // Card groups
  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },

  // Rows
  row: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
    backgroundColor: '#FFFFFF',
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  rowLast: {
    borderBottomLeftRadius: RADIUS,
    borderBottomRightRadius: RADIUS,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: NEUTRAL_COLORS[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTitle: {
    color: NEUTRAL_COLORS[800],
    fontSize: 16,
    fontWeight: '600',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Rating
  ratingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    gap: 6,
  },
  ratingText: {
    color: NEUTRAL_COLORS[800],
    fontWeight: '700',
  },

  // Spacing
  bottomSpacer: {
    height: 24,
  },

  // Logout Modal
  logoutModalContent: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  logoutIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: NEUTRAL_COLORS[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoutTitleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoutTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: NEUTRAL_COLORS[900],
    marginBottom: 8,
    textAlign: 'center',
  },
  logoutSubtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: NEUTRAL_COLORS[600],
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  logoutButtonsContainer: {
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: NEUTRAL_COLORS[300],
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: NEUTRAL_COLORS[800],
  },
  logoutButton: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
  },
  logoutButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default styles;
