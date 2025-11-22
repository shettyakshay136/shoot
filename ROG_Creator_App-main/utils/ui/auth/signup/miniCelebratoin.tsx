// utils/ui/common/WelcomeCardAnimated.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { ROG } from '@/utils/config/theme.config';
import images from '@/utils/config/images.config';

type Props = {
  title?: string;
  message?: string;
};

export default function MiniCelebratoin({
  title = 'Welcome aboard!',
  message = 'Your kit is being prepared and will be delivered shortly.',
}: Props) {
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    // play once on mount
    lottieRef.current?.play();
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: ROG.neutral[200],
        paddingVertical: 12,
        paddingHorizontal: 16,
        overflow: 'hidden',
      }}
      accessibilityRole="summary"
      accessible
    >
      {/* Left: emoji + confetti */}
      <View style={{ width: 64, height: 64, marginRight: 12 }}>
        <Image
          source={images.auth.signup.celebration}
          style={{ width: 64, height: 64 }}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
        {/* Confetti burst overlay (no loop) */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: -12,
            left: -12,
            right: -12,
            bottom: -12,
          }}
        >
          <LottieView
            ref={lottieRef}
            source={images.auth.signup.minicelebration}
            autoPlay
            loop={false}
            style={{ width: '100%', height: '100%' }}
            renderMode="HARDWARE"
          />
        </View>
      </View>

      {/* Right: text */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 18,
            lineHeight: 18,
            color: ROG.neutral[900],
            fontWeight: '700',
          }}
        >
          {title}
          {'\n'}
          <Text style={{ fontWeight: '200' }}>{message}</Text>
        </Text>
      </View>
    </View>
  );
}
