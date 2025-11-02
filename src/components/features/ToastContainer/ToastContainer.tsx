import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { useToast, type Toast } from '@/contexts/ToastContext';

interface ToastItemProps {
  toast: Toast;
  onHide: (id: string) => void;
}

const ToastItem = ({ toast, onHide }: ToastItemProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handlePress = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide(toast.id);
    });
  };

  const getToastStyle = () => {
    switch (toast.type) {
      case 'success':
        return [styles.toast, styles.successToast];
      case 'error':
        return [styles.toast, styles.errorToast];
      case 'info':
        return [styles.toast, styles.infoToast];
      default:
        return [styles.toast, styles.infoToast];
    }
  };

  return (
    <Animated.View
      style={[
        getToastStyle(),
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={styles.contentContainer}
      >
        <View style={styles.textContainer}>
          <Text style={styles.message}>{toast.message}</Text>
          {toast.description && (
            <Text style={styles.description}>{toast.description}</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const ToastContainer = () => {
  const { toasts, hideToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onHide={hideToast} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    paddingHorizontal: 15,
  },
  toast: {
    minWidth: 300,
    maxWidth: '90%',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical:10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successToast: {
    backgroundColor: '#027A48',
  },
  errorToast: {
    backgroundColor: '#027A48',
  },
  infoToast: {
    backgroundColor: '#027A48',
  },
  contentContainer: {
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection:'row',
    gap:5
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#fff',
    marginTop: 2,
  },
});

