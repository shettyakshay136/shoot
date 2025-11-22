import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useColorScheme } from 'nativewind';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface BackButtonProps {
  title?: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  textClassName?: string;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  activeOpacity?: number; // <- lets you control press opacity
}

const BackButton: React.FC<BackButtonProps> = ({
  title = 'Back',
  onPress,
  size = 'md',
  variant = 'secondary',
  disabled = false,
  className,
  style,
  textClassName,
  textStyle,
  accessibilityLabel,
  activeOpacity = 0.7, // default press fade
}) => {
  useColorScheme();

  const sizing = useMemo(() => {
    switch (size) {
      case 'sm':
        return {
          padX: 'px-3',
          padY: 'py-1.5',
          text: 'text-sm',
          gap: 'gap-1.5',
          icon: 16,
        };
      case 'lg':
        return {
          padX: 'px-5',
          padY: 'py-3',
          text: 'text-lg',
          gap: 'gap-2.5',
          icon: 24,
        };
      default:
        return {
          padX: 'px-4',
          padY: 'py-2',
          text: 'text-base',
          gap: 'gap-2',
          icon: 20,
        };
    }
  }, [size]);

  const variantClasses = useMemo(() => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-500 dark:bg-primary-400 text-white dark:text-black';
      case 'outline':
        return 'bg-transparent text-neutral-800 dark:text-neutral-100';
      default:
        return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100';
    }
  }, [variant]);

  const containerClasses = [
    'flex-row items-center rounded-full',
    sizing.padX,
    sizing.padY,
    sizing.gap,
    variantClasses,
    disabled ? 'opacity-50' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const labelClasses = [
    sizing.text,
    'font-medium',
    variant === 'primary' ? 'text-white dark:text-black' : '',
    textClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessible
      accessibilityLabel={accessibilityLabel || title || 'Back'}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={activeOpacity}
      className={containerClasses}
      style={style}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <View className="flex-row items-center border border-neutral-300 rounded-full p-1">
        <Ionicons
          name="chevron-back"
          size={sizing.icon}
          color={variant === 'primary' ? '#fff' : '#111827'}
        />
      </View>

      {title ? (
        <Text className={labelClasses} style={textStyle}>
          {title}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

export default BackButton;
