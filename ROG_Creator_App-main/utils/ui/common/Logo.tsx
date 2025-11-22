import React, { useMemo } from 'react';
import {
  Image,
  Pressable,
  StyleProp,
  ImageStyle,
  ImageSourcePropType,
} from 'react-native';

/**
 * Logo component for displaying app logos with customizable size, theming, and optional interactivity.
 *
 * @param source - The image source for the logo.
 * @param size - Size variant: 'sm', 'md', or 'lg'. Defaults to 'md'. Overrides width/height if provided.
 * @param width - Custom width for the logo.
 * @param height - Custom height for the logo.
 * @param className - Optional Tailwind/NativeWind class overrides.
 * @param style - Optional inline style overrides.
 * @param onPress - Optional callback when pressed.
 * @param disabled - Disables interaction when true.
 * @param variant - Style variant: 'primary', 'secondary', or 'outline'. Defaults to 'primary'.
 */
interface LogoProps {
  source: ImageSourcePropType;
  size?: 'sm' | 'md' | 'lg';
  width?: number;
  height?: number;
  className?: string;
  style?: StyleProp<ImageStyle>;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

const Logo: React.FC<LogoProps> = ({
  source,
  size = 'md',
  width,
  height,
  className,
  style,
  onPress,
  disabled = false,
  variant = 'primary',
}) => {
  const sizeClasses = useMemo(() => {
    if (width || height) {
      return '';
    }
    switch (size) {
      case 'sm':
        return 'w-12 h-12';
      case 'lg':
        return 'w-20 h-20';
      default:
        return 'w-16 h-16';
    }
  }, [size, width, height]);

  const variantClasses = useMemo(() => {
    const base = 'rounded-lg';
    switch (variant) {
      case 'secondary':
        return `${base} bg-neutral-700 dark:bg-neutral-700`;
      case 'outline':
        return `${base} border border-primary-400 dark:border-primary-400`;
      default:
        return `${base}`;
    }
  }, [variant]);

  const combinedClassName = useMemo(
    () => [sizeClasses, variantClasses, className].filter(Boolean).join(' '),
    [sizeClasses, variantClasses, className],
  );

  const imageElement = (
    <Image
      source={source}
      className={combinedClassName}
      style={[{ width, height }, style]}
      resizeMode="contain"
      accessibilityRole="image"
      accessible
    />
  );

  if (onPress && !disabled) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessible
        accessibilityState={{ disabled }}
        className="active:opacity-80"
      >
        {imageElement}
      </Pressable>
    );
  }

  return imageElement;
};

export default Logo;

// Example Usage
// <Logo
//   source={require('@/assets/logo.png')}
//   size="md"
//   variant="primary"
//   onPress={() => console.log("Logo pressed")}
//   className="ml-2"
// />
// <Logo
//   source={require('@/assets/logo.png')}
//   width={80}
//   height={80}
//   variant="outline"
// />
