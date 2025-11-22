import React from 'react';
import { View, Text } from 'react-native';

type Props = {
  title?: string;
  tagline?: string;
  subline?: string;
  className?: string;
};

export default function HeroSubline({
  title = 'ReelOnGo',
  tagline = 'Content Delivered\nin Minutes',
  subline = 'Crafted with ❤️ from Hyderabad, to India!',
  className,
}: Props) {
  return (
    <View
      className={['bg-neutral-25 px-5 py-6', className]
        .filter(Boolean)
        .join(' ')}
      accessibilityRole="header"
    >
      {/* Brand */}
      <Text className="text-primary-400 text-[18px] font-extrabold mb-3">
        {title}
      </Text>

      {/* Big headline */}
      <Text
        className="text-primary-700 text-[36px] leading-[42px] font-extrabold tracking-tight"
        accessibilityLabel={tagline.replace(/\n/g, ' ')}
      >
        {tagline}
      </Text>

      {/* Subline */}
      <Text className="text-neutral-700 text-[15px] mt-4">{subline}</Text>
    </View>
  );
}

// import HeroSubline from '@/utils/ui/marketing/HeroSubline';

// export default function Screen() {
//   return (
//     <View className="flex-1 bg-neutral-25">
//       <HeroSubline />
//       {/* rest of your screen */}
//     </View>
//   );
// }
