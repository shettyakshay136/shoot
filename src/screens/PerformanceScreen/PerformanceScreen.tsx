import React, { useState, type JSX } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { styles } from '@/screens/PerformanceScreen/PerformanceScreen.styles';
import { PRIMARY_COLORS } from '@/theme/colors';
import BackButton from '@/assets/svg/backButtonPdp.svg';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { PerformanceFilterModal } from '@/components/ui';
import StarIcon from '@/assets/svg/star.svg';
import MoneyIcon from "@/assets/svg/money.svg";
import RocketIcon from "@/assets/svg/rocket.svg";
import ClapperboardIcon from '@/assets/svg/file.svg'

const TABS = ['Earning', 'Bookings', 'Reels Delivered', 'Total'];
const X_AXIS_LABELS: string[] = ['1D', '1W', '1M', '6M', '1Y', '5Y', 'MAX'];

// Placeholder dataset illustration (not currently used for x-axis labels only)

const PerformanceScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const { width: screenWidth } = Dimensions.get('window');
  const [activeTab, setActiveTab] = useState<string>('Earning');
  // range not interactive now; keep UI simple
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);

  const handleBack = (): void => {
    navigation.goBack();
  };

  // Derived data can be wired later if needed for each tab

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#000000', PRIMARY_COLORS[900]]}
          style={styles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <BackButton width={24} height={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Performance</Text>
          </View>

          <View style={styles.scoreBlock}>
            <Text style={styles.scoreValue}>92</Text>
            <Text style={styles.scoreLabel}>Overall performance score</Text>
          </View>

          <View style={styles.tabPillsContainer}>
            {TABS.map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabPill, activeTab === tab && styles.tabPillActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabPillText, activeTab === tab && styles.tabPillTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.sectionContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={styles.cardTitle}>Total earning</Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
                  <Text style={styles.amountBig}>₹12,543.12</Text>
                  <Text style={styles.deltaPositive}>+2.4%</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.filterChip} onPress={() => setIsFilterVisible(true)}>
                <Text style={styles.filterChipText}>Filter</Text>
              </TouchableOpacity>
            </View>

            <View>
            <LineChart
              data={{
                labels: X_AXIS_LABELS,
                datasets: [
                  {
                    // Provide 7 points to match 7 x-axis labels
                    data: [12, 14, 15, 18, 20, 22, 25],
                    color: () => PRIMARY_COLORS[400],
                    strokeWidth: 2,
                  },
                ],
              }}
              width={screenWidth}
              height={180}
              withInnerLines={false}
              withOuterLines={false}
              withDots={false}
              withVerticalLabels={false}
              withHorizontalLabels={true}
              chartConfig={{
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                fillShadowGradient: PRIMARY_COLORS[400],
                fillShadowGradientOpacity: 0.15,
                color: () => PRIMARY_COLORS[400],
                labelColor: () => '#9AA4B2',
                propsForBackgroundLines: { strokeDasharray: '' },
              }}
              style={styles.chart}
            />
            </View>

            <Text style={styles.helperText}>
              Your total earning is <Text style={styles.helperStrong}>+12% high</Text> compared to last period. Keep up the great work!
            </Text>
          </View>
          <View style={{padding:18, gap:18}}>
            <View style={styles.listHeader}> 
              <Text style={styles.listHeaderText}>Performance</Text>
            </View>


            <View style={{ gap: 12 }}>
            <View style={styles.metricRow}> 
              <ClapperboardIcon width={77} height={77}/>
              <View style={{ flex: 1 }}>
                <Text style={styles.metricValue}>24</Text>
                <Text style={styles.metricLabel}>Shoots</Text>
                <Text style={styles.metricDeltaPositive}>+2.4% from last week</Text>
              </View>
            </View>

            <View style={styles.metricRow}> 
              <StarIcon width={77} height={77}/>
              <View style={{ flex: 1 }}>
                <Text style={styles.metricValue}>4.8</Text>
                <Text style={styles.metricLabel}>Rating</Text>
                <Text style={styles.metricDeltaPositive}>+2.4% from last week</Text>
              </View>
            </View>

            <View style={styles.metricRow}> 
              <RocketIcon width={77} height={77}/>
              <View style={{ flex: 1 }}>
                <Text style={styles.metricValue}>95.8%</Text>
                <Text style={styles.metricLabel}>Success rate</Text>
                <Text style={styles.metricDeltaPositive}>+2.4% from last week</Text>
              </View>
            </View>

            <View style={styles.metricRow}> 
              <MoneyIcon width={77} height={77}/>
              <View style={{ flex: 1 }}>
                <Text style={styles.metricValue}>₹1,887</Text>
                <Text style={styles.metricLabel}>Success rate</Text>
                <Text style={styles.metricDeltaNegative}>+8% from last week</Text>
              </View>
            </View>
          </View>
          </View>
        </View>
        <PerformanceFilterModal
          isVisible={isFilterVisible}
          onClose={() => setIsFilterVisible(false)}
          onApply={() => setIsFilterVisible(false)}
        />
      </View>
    </ScrollView>
  );
};

export default PerformanceScreen;


