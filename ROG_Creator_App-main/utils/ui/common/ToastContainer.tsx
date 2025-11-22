import React, { useEffect, useState } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import eventEmitter from '@/utils/utilities/eventEmitter';
import { TOAST_EVENT_TYPES, toastOptions } from '@/utils/types/Toast';

const ToastContainer = () => {
  const insets = useSafeAreaInsets();
  const [toasts, setToasts] = useState<(toastOptions & { id: string })[]>([]);
  const [animations, setAnimations] = useState<Record<string, Animated.Value>>({});

  useEffect(() => {
    const handleShowToast = (options: toastOptions) => {
      const id = Date.now().toString();
      const animValue = new Animated.Value(0);

      setToasts(prev => [...prev, { ...options, id }]);
      setAnimations(prev => ({ ...prev, [id]: animValue }));

      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay((options.duration || 2000) - 600),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
        setAnimations(prev => {
          const newAnimations = { ...prev };
          delete newAnimations[id];
          return newAnimations;
        });
      });
    };

    eventEmitter.on(TOAST_EVENT_TYPES.SHOW, handleShowToast);

    return () => {
      eventEmitter.off(TOAST_EVENT_TYPES.SHOW, handleShowToast);
    };
  }, []);

  const getToastStyle = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return styles.success;
      case 'ERROR':
        return styles.error;
      case 'WARNING':
        return styles.warning;
      case 'INFO':
        return styles.info;
      default:
        return styles.info;
    }
  };

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return '✓';
      case 'ERROR':
        return '✕';
      case 'WARNING':
        return '⚠';
      case 'INFO':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  };

  return (
    <View
      style={[
        styles.container,
        { top: insets.top + 16 },
      ]}
      pointerEvents="box-none"
    >
      {toasts.map(toast => (
        <Animated.View
          key={toast.id}
          style={[
            styles.toastWrapper,
            {
              opacity: animations[toast.id],
              transform: [
                {
                  translateY: animations[toast.id].interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.toast, getToastStyle(toast.type)]}>
            <Text style={styles.icon}>{getToastIcon(toast.type)}</Text>
            <Text style={styles.message} numberOfLines={2}>
              {toast.message}
            </Text>
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  toastWrapper: {
    marginBottom: 12,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    marginRight: 8,
    fontSize: 18,
    fontWeight: '700',
  },
  message: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  success: {
    backgroundColor: '#DCFCE7',
  },
  error: {
    backgroundColor: '#FEE2E2',
  },
  warning: {
    backgroundColor: '#FEF3C7',
  },
  info: {
    backgroundColor: '#DBEAFE',
  },
});

export default ToastContainer;
