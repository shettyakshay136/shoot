import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4F0',
  },
  statusBar: {
    height: 44,
    backgroundColor: '#F8F4F0',
  },
  header: {
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal:23
  },
  scrollContent: {
    paddingTop: 24,
    // paddingBottom: 40,
    gap:20
  },
  earningsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FADF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical:10,
    gap: 8,
    borderWidth:1,
    borderColor:'#6CE9A6'
  },
  earningsText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: 400,
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  earningBoldText:{
    fontWeight:700,

  },
  distanceText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: 600,
    fontSize: 16,
    color: '#B7410E',
  },
  eventTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '700',
    fontSize: 30,
    color: '#252B37',
    lineHeight: 38,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:3
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  infoText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 16,
    color: '#535862',
  },
  mapLinkText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 16,
    color: '#B7410E',
  },
  requirementSection: {
    gap:12
  },
  requirementTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 18,
    color: '#000000',
  },
  requirementCard: {
    backgroundColor: '#FFFFFF',
    borderWidth:1,
    borderColor:'#D5D7DA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical:18,
    gap: 10,
  },
  requirementLabel: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '400',
    fontSize: 16,
    color: '#535862',
  },
  requirementValue: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '700',
    fontSize: 16,
    color: '#181D27',
  },
  instantDelivery: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '500',
    fontSize: 16,
    color: '#E75B0F',
  },
  addonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  addonPill: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addonText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '400',
    fontSize: 14,
    color: '#000000',
  },
  descriptionSection: {
    gap:12
  },
  descriptionTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 20,
    color: '#000000',
  },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  descriptionText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '400',
    fontSize: 16,
    color: '#535862',
    lineHeight: 24,
  },
  audioSection: {
    marginBottom: 24,
  },
  audioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  audioTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 20,
    color: '#000000',
  },
  suggestButton: {
    flexDirection:'row',
    gap:5,
    alignItems:'center'
  },
  suggestButtonText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '500',
    fontSize: 14,
    color: '#10B981',
  },
  songCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  songThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 16,
    color: '#181D27',
  },
  songArtist: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '400',
    fontSize: 16,
    color: '#535862',
  },
  termsSection: {
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  termsText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '400',
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '500',
    fontSize: 14,
    color: '#B7410E',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#D92D20',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButtonText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 16,
    color: '#D92D20',
  },
  acceptButtonWrapper: {
    flex: 1,
    borderRadius: 26,
    overflow: 'hidden',
  },
  acceptButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonDisabled: {
    opacity: 0.5,
  },
  acceptButtonText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  earnTag: {
    backgroundColor: '#D1FADF',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 100,
  },
  earnTagText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 14,
    color: '#047857',
  },
  modalQuestion: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 24,
    color: '#181D27',
    textAlign: 'center',
    lineHeight:32
  },
  modalEventTitle: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '400',
    fontSize: 16,
    color: '#535862',
    textAlign: 'center',
  },
  modalButtonsContainer: {
    width: '100%',
    gap: 12,
    paddingTop:20
  },
  modalConfirmButton: {
    width: '100%',
    paddingVertical:12,
    paddingHorizontal:24,
    backgroundColor: '#039855',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmButtonText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 18,
    color: '#FFFFFF',
  },
  modalCancelButton: {
    width: '100%',
    paddingVertical:12,
    paddingHorizontal:24,
    backgroundColor: '#F5F5F5',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#D5D7DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButtonText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 16,
    color: '#000000',
  },
  earnTagDecline: {
    backgroundColor: '#FEE4E2',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 100,
  },
  earnTagTextDecline: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 14,
    color: '#B7410E',
  },
  modalDeclineButton: {
    width: '100%',
    paddingVertical:12,
    paddingHorizontal:24,
    backgroundColor: '#D92D20',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDeclineButtonText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '600',
    fontSize: 18,
    color: '#FFFFFF',
  },
  startShootButtonWrapper: {
    width: '100%',
    borderRadius: 100,
    overflow: 'hidden',
  },
  startShootButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startShootButtonText: {
    fontFamily: 'Saans TRIAL',
    fontWeight: '700',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

