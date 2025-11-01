import React from 'react';
import { View, Text, TouchableOpacity,} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BaseModal } from '../../layout';
import CalendarIcon from '@/assets/svg/calender.svg';
import MapIcon from '@/assets/svg/map.svg';
import type { UpcomingShootModalProps } from './UpcomingShootModal.types';
import { styles } from './UpcomingShootModal.styles';

const UpcomingShootModal: React.FC<UpcomingShootModalProps> = ({
  isVisible,
  onClose,
  shoot,
  onStartButtonPress,
}) => {
  if (!shoot) return null;

  return (
    <BaseModal
      isVisible={isVisible}
      onClose={onClose}
      showCloseButton={false}
      showHeader={false}
      modalStyle={styles.modal}
      containerStyle={styles.container}
      contentStyle={styles.content}
    >
      <View style={styles.scrollContent}>
            <View style={styles.calendarIconContainer}>
                <CalendarIcon width={128} height={128} />
            </View>
            <View style={{gap:8 , justifyContent:'center' , alignItems:'center'}}>
                <View style={styles.startingTag}>
                    <Text style={styles.startingTagText}>Starting in 30 mins</Text>
                </View>
                <Text style={styles.eventTitle}>{shoot.title}</Text>
            </View>
            <View style={styles.detailsCard}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Client: </Text>
                    <TouchableOpacity style={{flexDirection:'row', alignItems:'center', gap:6}}>
                    <Text style={styles.detailValue}>{shoot.client}</Text>
                    <Text style={styles.linkText}> (Contact)</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Location: </Text>
                    <TouchableOpacity style={{flexDirection:'row', alignItems:'center', gap:6}}>
                    <Text style={styles.detailValue}>{shoot.location}</Text>
                    <Text style={styles.linkText}> (Map)</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date: </Text>
                    <Text style={styles.detailValue}>{shoot.date}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Time: </Text>
                    <Text style={styles.detailValue}>{shoot.time}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Niche: </Text>
                    <Text style={styles.detailValue}>{shoot.niche}</Text>
                </View>
            </View>
         
            <View style={styles.readinessCardBorder}>
                <LinearGradient
                colors={['#FFFFFF', '#FEEDD6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.readinessCard}
                >
                <MapIcon width={50} height={50} />
                <View style={styles.readinessTextContainer}>
                    <Text style={styles.readinessTitle}>Ready to go?</Text>
                    <Text style={styles.readinessSubtext}>
                    You are {shoot.distance} away • ETA {shoot.eta}
                    </Text>
                </View>
                </LinearGradient>
            </View>

            <TouchableOpacity 
              style={styles.startButtonTouchable}
              onPress={onStartButtonPress}
            >
                <LinearGradient
                    colors={['#000000', '#61240E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.startButton}
                >
                    <Text style={styles.startButtonText}>Start to location</Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose}>
                <Text style={styles.dropEventText}>Drop event</Text>
            </TouchableOpacity>
      </View>
    </BaseModal>
  );
};

export default UpcomingShootModal;

