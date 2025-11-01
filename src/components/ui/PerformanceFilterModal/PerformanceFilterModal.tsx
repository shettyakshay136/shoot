import React, { useState, type JSX } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BaseModal from '@/components/layout/BaseModal/BaseModal';
import { styles } from '@/components/ui/PerformanceFilterModal/PerformanceFilterModal.styles';
import ArrowUp from '@/assets/svg/arrow-up-right.svg'
// colors imported elsewhere if needed

export interface PerformanceFilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (filters: { shootType: string; location: string }) => void;
  initialShootType?: string;
  initialLocation?: string;
}

const SHOOT_TYPES = ['All types', 'Wedding', 'Corporate', 'Birthday', 'Product'];
const LOCATIONS = ['All Locations', 'Hitec City', 'Banjara Hils', 'Jubilee Hills', 'Gachibowli'];

const PerformanceFilterModal = ({
  isVisible,
  onClose,
  onApply,
  initialShootType = 'All types',
  initialLocation = 'All Locations',
}: PerformanceFilterModalProps): JSX.Element => {
  const [shootType, setShootType] = useState<string>(initialShootType);
  const [location, setLocation] = useState<string>(initialLocation);

  const apply = (): void => {
    onApply({ shootType, location });
    onClose();
  };

  const renderChips = (items: string[], active: string, setActive: (v: string) => void): JSX.Element => (
    <View style={styles.chipsWrap}>
      {items.map((label) => (
        <TouchableOpacity
          key={label}
          style={[styles.chip, active === label && styles.chipActive]}
          onPress={() => setActive(label)}
        >
          <Text style={[styles.chipText, active === label && styles.chipTextActive]}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <BaseModal isVisible={isVisible} onClose={onClose} showHeader={false} backdropOpacity={0.4}>
                    <View style={styles.handleLine} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{gap:54}}>
            <View>
                <Text style={styles.title}>Filter performance</Text>
                <View style={{paddingVertical:24 , gap:16}}>
                    <View style={styles.section}> 
                        <Text style={styles.sectionTitle}>Shoot Type</Text>
                        {renderChips(SHOOT_TYPES, shootType, setShootType)}
                    </View>
                    <View style={styles.section}> 
                        <Text style={styles.sectionTitle}>Location</Text>
                        {renderChips(LOCATIONS, location, setLocation)}
                    </View>
                </View>

            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={apply} style={styles.applyTouchable}>
              <LinearGradient
                colors={['#000000', '#61240E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.applyButton}
              >
                <Text style={styles.applyText}>Filter</Text>
                <ArrowUp/>
              </LinearGradient>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </BaseModal>
  );
};

export default PerformanceFilterModal;