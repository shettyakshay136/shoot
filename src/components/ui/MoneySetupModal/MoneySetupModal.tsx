import React, { useState, type JSX } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './MoneySetupModal.styles';
import MoneySvg from '@/assets/svg/money.svg';
import { SimpleModal } from '@/components';
import Bankicon from '@/assets/svg/bank.svg';
import UPI from '@/assets/svg/upi.svg'

export type MoneyMethod = 'bank' | 'upi';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onContinue: (method: MoneyMethod) => void;
  onSkip: () => void;
  defaultMethod?: MoneyMethod | null;
};

const MoneySetupModal = ({
  isVisible,
  onClose,
  onContinue,
  onSkip,
  defaultMethod = null,
}: Props): JSX.Element => {
  const [selected, setSelected] = useState<MoneyMethod | null>(defaultMethod);

  const handleSelect = (method: MoneyMethod) => {
    setSelected(method);
  };

  const handleContinue = () => {
    if (selected) onContinue(selected);
  };

  return (
    <SimpleModal isVisible={isVisible} onClose={onClose}>
      <View style={styles.container}>

        <View style={styles.optionsContainer}>
            <View style={styles.illustrationContainer}>
                <MoneySvg />
                <View style={styles.optionalBadge}>
                    <Text style={styles.optionalBadgeText}>Optional</Text>
                </View>
            </View>

            <View style={styles.titleContainer}>
                <Text style={styles.title}>To transfer money, add bank{"\n"}account or UPI ID</Text>
            </View>
            <TouchableOpacity
                style={[styles.optionRow, selected === 'bank' && styles.optionRowSelected]}
                onPress={() => handleSelect('bank')}
                activeOpacity={0.8}
            >
                <View style={[styles.radioOuter, selected === 'bank' && styles.radioOuterSelected]}>
                {selected === 'bank' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.optionText}>Bank Account</Text>
                <Bankicon/>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.optionRow, selected === 'upi' && styles.optionRowSelected]}
                onPress={() => handleSelect('upi')}
                activeOpacity={0.8}
            >
                <View style={[styles.radioOuter, selected === 'upi' && styles.radioOuterSelected]}>
                {selected === 'upi' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.optionText}>UPI</Text>
                <UPI/>
            </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            disabled={!selected}
            onPress={handleContinue}
            style={styles.primaryTouchable}
          >
            <LinearGradient
              colors={['#000000', '#61240E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.primaryButton, !selected && styles.primaryButtonDisabled]}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={onSkip} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Skip and setup later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SimpleModal>
  );
};

export default MoneySetupModal;

