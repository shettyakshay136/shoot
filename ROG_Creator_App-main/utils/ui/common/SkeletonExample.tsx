import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Skeleton, SkeletonGroup } from '@/utils/ui/common/Skeleton';

export const SkeletonExample = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <ScrollView style={{ flex: 1, padding: 16, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
          Loading Content...
        </Text>

        <Skeleton
          width="100%"
          height={120}
          borderRadius={12}
          marginBottom={16}
        />

        <Text style={{ fontSize: 14, marginBottom: 12, color: '#666' }}>
          Multiple Items
        </Text>
        <SkeletonGroup
          count={3}
          spacing={12}
          children={index => (
            <View key={index} style={{ flexDirection: 'row', gap: 12 }}>
              <Skeleton width={60} height={60} borderRadius={8} />
              <View style={{ flex: 1 }}>
                <Skeleton
                  width="80%"
                  height={16}
                  borderRadius={4}
                  marginBottom={8}
                />
                <Skeleton width="60%" height={14} borderRadius={4} />
              </View>
            </View>
          )}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: 'white' }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 16,
          color: '#000',
        }}
      >
        Content Loaded!
      </Text>
      <Text style={{ fontSize: 14, color: '#666' }}>
        Replace skeleton with actual content here.
      </Text>
    </ScrollView>
  );
};

export default SkeletonExample;
