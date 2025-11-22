import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  margin?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0,
  margin = 0,
  style,
}) => {
  const opacity = useSharedValue(0.6);

  React.useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          margin: margin !== 0 ? margin : undefined,
          marginTop: margin === 0 ? marginTop : undefined,
          marginBottom: margin === 0 ? marginBottom : undefined,
          marginLeft: margin === 0 ? marginLeft : undefined,
          marginRight: margin === 0 ? marginRight : undefined,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

interface SkeletonGroupProps {
  count?: number;
  spacing?: number;
  children?: (index: number) => React.ReactNode;
  style?: any;
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  count = 1,
  spacing = 12,
  children,
  style,
}) => {
  return (
    <View style={[{ marginVertical: spacing }, style]}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={{
            marginBottom: index < count - 1 ? spacing : 0,
          }}
        >
          {children ? children(index) : <Skeleton />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB',
  },
});
