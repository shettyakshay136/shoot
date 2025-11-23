import { JSX, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PRIMARY_COLORS, SEMANTIC_COLORS } from '@/theme/colors';
import { useAuth, useToast } from '@/contexts';
import type { ProfileStackParamList } from '@/navigation/stacks/ProfileStack/ProfileStack.types';
import SimpleModal from '@/components/layout/SimpleModal';
import styles from './ProfileScreen.styles';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'Profile'
>;

// Import navlist SVGs
import ReferAndEarnIcon from '@/assets/svg/refer-and-earn.svg';
import ChevronRightIcon from '@/assets/svg/chevron-right.svg';
import UserRoundIcon from '@/assets/svg/user-round.svg';
import CreditCardIcon from '@/assets/svg/card.svg';
import BellElectricIcon from '@/assets/svg/bell-electric.svg';
import ApertureIcon from '@/assets/svg/aperture.svg';
import MessageCircleQuestionIcon from '@/assets/svg/info.svg'; // TODO: Replace with message-circle-question-mark.svg when available
import ZapIcon from '@/assets/svg/zap.svg';
import StarIcon from '@/assets/svg/star.svg';
import MedalIcon from '@/assets/svg/medal.svg';
import BanIcon from '@/assets/svg/decline.svg'; // TODO: Replace with ban.svg when available
import BadgeIndianRupeeIcon from '@/assets/svg/indian-rupee.svg';
import ActivityIcon from '@/assets/svg/activity.svg';
import RoseIcon from '@/assets/svg/gift.svg'; // TODO: Replace with rose.svg when available
import BadgeAlertIcon from '@/assets/svg/info.svg';
import SettingsIcon from '@/assets/svg/more.svg'; // TODO: Replace with settings.svg when available
import PowerIcon from '@/assets/svg/back.svg'; // TODO: Replace with power.svg when available
import AwardIcon from '@/assets/svg/award.svg';
import HistoryIcon from '@/assets/svg/history.svg';

// Small pill badges (orange/green/neutral)
const Badge = ({
  text,
  tone,
}: {
  text: string;
  tone: 'warning' | 'success' | 'neutral';
}) => {
  const style = useMemo(() => {
    switch (tone) {
      case 'warning':
        return {
          container: [styles.badge, { backgroundColor: '#FFF6E6' }],
          text: [styles.badgeText, { color: PRIMARY_COLORS[600] }],
        };
      case 'success':
        return {
          container: [
            styles.badge,
            {
              backgroundColor: '#F1FFF7',
              borderWidth: 1,
              borderColor: SEMANTIC_COLORS.success[500],
            },
          ],
          text: [styles.badgeText, { color: SEMANTIC_COLORS.success[600] }],
        };
      default:
        return { container: styles.badge, text: styles.badgeText };
    }
  }, [tone]);

  return (
    <View style={style.container}>
      <Text style={style.text}>{text}</Text>
    </View>
  );
};

// List row
interface RowProps {
  title: string;
  onPress?: () => void;
  leftIcon?: JSX.Element;
  rightContent?: JSX.Element;
  first?: boolean;
  last?: boolean;
}

const Row = ({
  title,
  onPress,
  leftIcon,
  rightContent,
  first,
  last,
}: RowProps) => (
  <TouchableOpacity
    activeOpacity={0.75}
    onPress={onPress}
    style={[styles.row, first && styles.rowFirst, last && styles.rowLast]}
  >
    <View style={styles.rowLeft}>
      <View style={styles.rowIconWrap}>{leftIcon}</View>
      <Text style={styles.rowTitle}>{title}</Text>
    </View>
    <View style={styles.rowRight}>
      {rightContent}
      <ChevronRightIcon width={20} height={20} />
    </View>
  </TouchableOpacity>
);

// Quick action card
const QuickAction = ({
  title,
  onPress,
  leftIcon,
}: {
  title: string;
  onPress?: () => void;
  leftIcon?: JSX.Element;
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={styles.quickCard}
  >
    <View style={styles.quickIconCircle}>{leftIcon}</View>
    <Text style={styles.quickTitle}>{title}</Text>
  </TouchableOpacity>
);

const ProfileScreen = (): JSX.Element => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const name = user?.name ?? 'Satya Pavan';
  const phone = user?.contactNumber ?? '+91 48242 53232';

  const handleLogoutPress = () => {
    setIsLogoutModalVisible(true);
  };

  const handleCloseLogoutModal = () => {
    setIsLogoutModalVisible(false);
  };

  const handleConfirmLogout = async () => {
    try {
      setIsLogoutModalVisible(false);
      await logout();
      showToast('Logged out successfully', 'success');
    } catch (error) {
      console.error('Error during logout:', error);
      // Logout still succeeds locally even if API call fails
      showToast('Logged out successfully', 'success');
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#000000', PRIMARY_COLORS[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={{paddingHorizontal:18 , paddingBottom:27}}>
          <View style={styles.headerTopRow}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.referPill}
              onPress={() => navigation.navigate('ReferAndEarn')}
            >
              <ReferAndEarnIcon width={18} height={18} />
              <Text style={styles.referText}>Refer and earn</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerProfileRow}>
            <Image
              source={require('@/assets/external/icon.png')}
              // TODO: Replace with actual user avatar if available
              // source={{ uri: user?.avatarUrl }}
              style={styles.avatar}
            />
            <View style={styles.headerDetails}>
              <View style={styles.nameRow}>
                <View>
                  <Text style={styles.name}>{name}</Text>
                  <Text style={styles.phone}>{phone}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('EditProfile')}
                >
                  <ChevronRightIcon width={20} height={20} />
                </TouchableOpacity>
              </View>

              <Badge text="Not verified" tone="warning" />
            </View>
          </View>
          </View>
        </LinearGradient>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          <QuickAction
            title="Balance"
            leftIcon={<BadgeIndianRupeeIcon width={22} height={22} />}
            onPress={() => Alert.alert('Balance', 'View your account balance')}
          />
          <QuickAction
            title="Your rank"
            leftIcon={<MedalIcon width={22} height={22} />}
            onPress={() => Alert.alert('Your rank', 'View your ranking')}
          />
        </View>

        {/* Sections */}
        <Text style={styles.sectionLabel}>Basic</Text>
        <View style={styles.cardGroup}>
          <Row
            first
            title="Your profile"
            leftIcon={<UserRoundIcon width={20} height={20} />}
            rightContent={<Badge text="40% complete" tone="warning" />}
            onPress={() => navigation.navigate('EditProfile')}
          />
          <Row
            title="Payment settings"
            leftIcon={<CreditCardIcon width={20} height={20} />}
            onPress={() => navigation.navigate('PaymentSettings')}
          />
          <Row
            title="Health insurance"
            leftIcon={<ActivityIcon width={20} height={20} />}
            rightContent={<Badge text="Coming soon" tone="success" />}
            onPress={() =>
              Alert.alert('Coming soon', 'This feature is coming soon')
            }
          />
          <Row
            title="Booking and shoot process"
            leftIcon={<ApertureIcon width={20} height={20} />}
            onPress={() =>
              Alert.alert('Info', 'Learn about our booking and shoot process')
            }
          />
          <Row
            last
            title="FAQs"
            leftIcon={<MessageCircleQuestionIcon width={20} height={20} />}
            onPress={() =>
              Alert.alert('FAQs', 'View our frequently asked questions')
            }
          />
        </View>

        <Text style={styles.sectionLabel}>Booking</Text>
        <View style={styles.cardGroup}>
          <Row
            first
            title="Your previous bookings"
            leftIcon={<ZapIcon width={20} height={20} />}
            onPress={() => showToast('Previous bookings coming soon', 'info')}
          />
          <Row
            title="Your rating"
            leftIcon={<StarIcon width={20} height={20} />}
            rightContent={
              <View style={styles.ratingWrap}>
                <StarIcon width={16} height={16} fill={PRIMARY_COLORS[400]} />
                <Text style={styles.ratingText}>4.8/5</Text>
              </View>
            }
            onPress={() => navigation.navigate('RatingDetails')}
          />
          <Row
            last
            title="Cancelled Shoots"
            leftIcon={<BanIcon width={20} height={20} />}
            onPress={() => showToast('Cancelled Shoots coming soon', 'info')}
          />
        </View>

        <Text style={styles.sectionLabel}>Earning</Text>
        <View style={styles.cardGroup}>
          <Row
            first
            title="Earnings details"
            leftIcon={<BadgeIndianRupeeIcon width={20} height={20} />}
            onPress={() => showToast('Earnings details coming soon', 'info')}
          />
          <Row
            title="Incentives"
            leftIcon={<AwardIcon width={20} height={20} />}
            onPress={() => navigation.navigate('Incentives')}
          />
          <Row
            last
            title="Payout history"
            leftIcon={<HistoryIcon width={20} height={20} />}
            onPress={() => showToast('Payout history coming soon', 'info')}
          />
        </View>

        <Text style={styles.sectionLabel}>More</Text>
        <View style={styles.cardGroup}>
          <Row
            first
            title="About"
            leftIcon={<RoseIcon width={20} height={20} />}
            onPress={() => navigation.navigate('About')}
          />
          <Row
            title="Raise an issue"
            leftIcon={<BadgeAlertIcon width={20} height={20} />}
            onPress={() => navigation.navigate('RaiseIssue')}
          />
          <Row
            title="Report a safety emergency"
            leftIcon={<BellElectricIcon width={20} height={20} />}
            onPress={() =>
              showToast('Report a safety emergency coming soon', 'info')
            }
          />
          <Row
            title="Settings"
            leftIcon={<SettingsIcon width={20} height={20} />}
            onPress={() => showToast('Settings coming soon', 'info')}
          />
          <Row
            last
            title="Log out"
            leftIcon={<PowerIcon width={20} height={20} />}
            onPress={handleLogoutPress}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Logout Modal */}
      <SimpleModal
        isVisible={isLogoutModalVisible}
        onClose={handleCloseLogoutModal}
        showCloseButton={false}
      >
        <View style={styles.logoutModalContent}>
          <View style={styles.logoutTitleContainer}>
            <Text style={styles.logoutTitle}>Sure you want to log out?</Text>
          </View>

          <View style={styles.logoutButtonsContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleConfirmLogout}
            >
              <LinearGradient
                colors={[PRIMARY_COLORS[900], PRIMARY_COLORS[800]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.logoutButtonGradient}
              >
                <Text style={styles.logoutButtonText}>Log Out</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCloseLogoutModal}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SimpleModal>
    </View>
  );
};

export default ProfileScreen;
