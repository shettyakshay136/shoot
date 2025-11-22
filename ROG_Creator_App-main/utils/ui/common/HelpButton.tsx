import { ROG } from '@/utils/config/theme.config';
import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type HelpButtonProps = {
  title?: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  className?: string;
  activeOpacity?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const SIZES = {
  sm: {
    padX: 'px-4',
    padY: 'py-2',
    text: 'text-sm',
    icon: 16,
    iconMR: 'mr-1.5',
  },
  md: {
    padX: 'px-6',
    padY: 'py-3',
    text: 'text-base',
    icon: 20,
    iconMR: 'mr-2',
  },
  lg: {
    padX: 'px-6',
    padY: 'py-4',
    text: 'text-lg',
    icon: 24,
    iconMR: 'mr-2.5',
  },
} as const;

const VARIANTS = {
  primary: 'bg-primary-100 dark:bg-primary-100',
  secondary: 'bg-neutral-100 dark:bg-neutral-800',
  outline: 'bg-transparent border border-neutral-300 dark:border-neutral-600',
} as const;

const TEXT_BY_VARIANT = {
  primary: 'text-primary-800 dark:text-primary-800',
  secondary: 'text-neutral-900 dark:text-neutral-100',
  outline: 'text-neutral-800 dark:text-neutral-100',
} as const;

export default function HelpButton({
  title = 'Help',
  onPress,
  size = 'md',
  variant = 'secondary',
  disabled = false,
  className = '',
  activeOpacity = 0.7,
  style,
  textStyle,
}: HelpButtonProps) {
  const s = SIZES[size];

  const container =
    `flex-row items-center rounded-full ${s.padX} ${s.padY} ` +
    `${VARIANTS[variant]} ${disabled ? 'opacity-50' : ''} ` +
    `${className}`;

  const iconColor = variant === 'primary' ? ROG.primary[800] : ROG.neutral[800];

  const textClasses = `${s.text} font-medium font-bold ${TEXT_BY_VARIANT[variant]}`;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={activeOpacity}
      className={container}
      style={style}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <View className="flex-row items-center gap-2">
        <Ionicons
          name="information-circle-outline"
          size={s.icon}
          color={iconColor}
        />
        {!!title && (
          <Text className={textClasses} style={textStyle}>
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
